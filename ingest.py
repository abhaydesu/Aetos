import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import json_util
import json
import concurrent.futures
import re
import requests
import xml.etree.ElementTree as ET
from worker import run_analysis_pipeline_task


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
MAX_SCORING_WORKERS = int(os.getenv("MAX_SCORING_WORKERS", "4"))
SINGLE_SCORE_TIMEOUT = float(os.getenv("SINGLE_SCORE_TIMEOUT", "6.0"))
ARXIV_TIMEOUT = float(os.getenv("ARXIV_TIMEOUT", "8.0"))
ARXIV_MAX_RESULTS = int(os.getenv("ARXIV_MAX_RESULTS", "10"))
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
SERPAPI_TIMEOUT = float(os.getenv("SERPAPI_TIMEOUT", "8.0"))
SERPAPI_MAX_RESULTS = int(os.getenv("SERPAPI_MAX_RESULTS", "10"))

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client.get_database("aetos_db")

    def heuristic_trl(doc):
        funding_text = (doc.get("funding_details") or "") or ""
        progress_text = (doc.get("progress") or "") or (doc.get("summary") or "") or (doc.get("strategic_summary") or "")
        trl = 1
        try:
            m = re.search(r"(\d+(?:\.\d+)?)", funding_text.replace(",", ""))
            if m:
                val = float(m.group(1))
                if val >= 50_000_000:
                    trl = 8
                elif val >= 5_000_000:
                    trl = 7
                elif val >= 500_000:
                    trl = 6
                elif val >= 50_000:
                    trl = 5
                elif val >= 5_000:
                    trl = 4
                else:
                    trl = 3
        except Exception:
            trl = 2
        prog = (progress_text or "").lower()
        if any(k in prog for k in ["commercial", "production", "deployed", "live", "scale"]):
            trl = min(9, max(trl, 8))
        elif any(k in prog for k in ["pilot", "trial", "beta"]):
            trl = max(trl, 6)
        elif any(k in prog for k in ["prototype", "demo", "proof of concept", "poc"]):
            trl = max(trl, 4)
        justification = f"Heuristic estimate based on funding and progress. Funding excerpt: '{funding_text[:120]}'."
        return int(trl), justification

    def score_doc_trl(doc):
        try:
            trl = int(doc.get("TRL", 0))
            justification = doc.get("TRL_justification", "")
            if trl and 1 <= trl <= 9:
                return trl, justification or "From analysis"
        except Exception:
            pass
        return heuristic_trl(doc)

    def score_docs_concurrently(docs):
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(MAX_SCORING_WORKERS, max(1, len(docs)))) as executor:
            future_to_doc = {executor.submit(score_doc_trl, d): d for d in docs}
            for fut in concurrent.futures.as_completed(future_to_doc):
                doc = future_to_doc[fut]
                try:
                    trl_val, justification = fut.result(timeout=SINGLE_SCORE_TIMEOUT)
                except concurrent.futures.TimeoutError:
                    trl_val, justification = heuristic_trl(doc)
                except Exception:
                    trl_val, justification = heuristic_trl(doc)
                results.append((doc, trl_val, justification))
        return results

    # ---------------------------
    # Fetchers: arXiv & SerpAPI
    # ---------------------------
    def fetch_arxiv_papers(query, max_results=ARXIV_MAX_RESULTS, timeout=ARXIV_TIMEOUT):
        try:
            q = requests.utils.requote_uri(query)
            url = f"http://export.arxiv.org/api/query?search_query=all:{q}&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"
            resp = requests.get(url, timeout=timeout, headers={"User-Agent": "AetosBot/1.0"})
            if resp.status_code != 200 or not resp.text:
                return []
            root = ET.fromstring(resp.text)
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            entries = []
            for entry in root.findall("atom:entry", ns):
                title = entry.find("atom:title", ns).text if entry.find("atom:title", ns) is not None else ""
                summary = entry.find("atom:summary", ns).text if entry.find("atom:summary", ns) is not None else ""
                published = entry.find("atom:published", ns).text if entry.find("atom:published", ns) is not None else ""
                authors = [a.find("atom:name", ns).text for a in entry.findall("atom:author", ns) if a.find("atom:name", ns) is not None]
                link = ""
                for l in entry.findall("atom:link", ns):
                    href = l.attrib.get("href", "")
                    if href and (l.attrib.get("type", "").startswith("text/html") or l.attrib.get("rel") == "alternate"):
                        link = href
                doc = {
                    "title": (title or "").strip(),
                    "summary": (summary or "").strip(),
                    "published": published,
                    "authors": authors,
                    "source": "arXiv",
                    "url": link or "",
                    "funding_details": "0"
                }
                entries.append(doc)
            return entries
        except Exception:
            return []

    def fetch_scholar_via_serpapi(query, api_key=SERPAPI_KEY, max_results=SERPAPI_MAX_RESULTS, timeout=SERPAPI_TIMEOUT):
        try:
            if not api_key:
                return []
            params = {
                "engine": "google_scholar",
                "q": query,
                "api_key": api_key,
                "num": max_results
            }
            resp = requests.get("https://serpapi.com/search", params=params, timeout=timeout, headers={"User-Agent": "AetosBot/1.0"})
            if resp.status_code != 200 or not resp.text:
                return []
            j = resp.json()
            # SerpAPI uses different keys depending on engine/version
            organic = j.get("organic_results") or j.get("scholar_results") or j.get("organic") or []
            results = []
            for item in organic[:max_results]:
                # try to gracefully normalize a few common shapes
                title = item.get("title") or item.get("headline") or item.get("title_noformat") or ""
                snippet = item.get("snippet") or item.get("citation") or item.get("abstract") or item.get("snippet_highlighted") or ""
                # publication_info often contains authors/year for scholar
                authors = []
                pub_info = item.get("publication_info") or {}
                if isinstance(pub_info, dict) and pub_info.get("authors"):
                    try:
                        authors = [a.get("name") if isinstance(a, dict) else str(a) for a in pub_info.get("authors")]
                    except Exception:
                        authors = []
                # fallback: try to parse 'source' keys
                if not authors and item.get("authors"):
                    authors = item.get("authors")
                link = item.get("link") or item.get("source") or item.get("url") or ""
                year = ""
                if isinstance(pub_info, dict):
                    year = pub_info.get("year") or pub_info.get("summary") or ""
                doc = {
                    "title": (title or "").strip(),
                    "summary": (snippet or "").strip(),
                    "published": year,
                    "authors": authors,
                    "source": "Google Scholar (SerpAPI)",
                    "url": link or "",
                    "funding_details": "0"
                }
                results.append(doc)
            return results
        except Exception:
            return []

    def fetch_combined_papers(query, desired_num=10):
        """
        Run both arXiv and SerpAPI (concurrently), merge results, dedupe by URL/title,
        prefer arXiv entries first, then scholar results. Return up to desired_num items.
        """
        results = []
        # run fetchers concurrently to save time
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as exe:
            future_arxiv = exe.submit(fetch_arxiv_papers, query, max_results=desired_num, timeout=ARXIV_TIMEOUT)
            future_scholar = exe.submit(fetch_scholar_via_serpapi, query, api_key=SERPAPI_KEY, max_results=desired_num, timeout=SERPAPI_TIMEOUT)
            arxiv_res = future_arxiv.result(timeout=ARXIV_TIMEOUT + 1) if future_arxiv else []
            scholar_res = []
            try:
                scholar_res = future_scholar.result(timeout=SERPAPI_TIMEOUT + 1)
            except Exception:
                scholar_res = []

        # Normalize and deduplicate: use lowercase normalized title or url
        seen = set()
        combined = []

        def normalize_key(doc):
            url = (doc.get("url") or "").strip()
            title = (doc.get("title") or "").strip().lower()
            if url:
                return url
            return title

        # prefer arXiv first
        for doc in (arxiv_res or []):
            key = normalize_key(doc)
            if not key:
                # fallback to title snippet hash
                key = (doc.get("title") or "").strip().lower()
            if key and key not in seen:
                seen.add(key)
                combined.append(doc)
            if len(combined) >= desired_num:
                return combined[:desired_num]

        # then scholar results
        for doc in (scholar_res or []):
            key = normalize_key(doc)
            if not key:
                key = (doc.get("title") or "").strip().lower()
            if key and key not in seen:
                seen.add(key)
                combined.append(doc)
            if len(combined) >= desired_num:
                break

        # final fallback: if still empty, try a lightweight DB search (if available)
        if not combined:
            try:
                query_db = {
                    "$or": [
                        {"title": {"$regex": query, "$options": "i"}},
                        {"technologies": {"$regex": query, "$options": "i"}}
                    ]
                }
                db_docs = list(db.documents.find(query_db).sort("published", -1).limit(desired_num))
                for d in db_docs:
                    # convert bson to plain dict fields we need
                    doc = json.loads(json_util.dumps(d))
                    # map some fields
                    combined.append({
                        "title": doc.get("title", ""),
                        "summary": doc.get("summary", "") or doc.get("abstract", ""),
                        "published": doc.get("published", ""),
                        "authors": doc.get("authors", []),
                        "source": "MongoDB",
                        "url": doc.get("url", ""),
                        "funding_details": doc.get("funding_details", "0")
                    })
                combined = combined[:desired_num]
            except Exception:
                pass

        return combined[:desired_num]

    def doc_funding_default():
        return "0"

    @app.route("/api/documents/<topic>", methods=['GET'])
    def get_documents(topic):
        query = {
            "$or": [
                {"title": {"$regex": topic, "$options": "i"}},
                {"technologies": {"$regex": topic, "$options": "i"}}
            ]
        }
        documents = list(db.documents.find(query).sort("published", -1).limit(50))
        return jsonify(json.loads(json_util.dumps(documents)))

    @app.route("/api/analyze/<topic>", methods=['POST'])
    def analyze_topic(topic):
        try:
            # n is desired number of documents to analyze
            num = int(request.args.get("n", "5"))
            # first, attempt your pipeline (fast)
            result = run_analysis_pipeline_task(topic, num_documents=num)
            docs = result.get("documents", []) if isinstance(result, dict) else []
            plain_docs = []
            for d in docs:
                try:
                    doc = dict(d)
                except Exception:
                    doc = {"title": str(d)}
                plain_docs.append(doc)

            # If pipeline returned zero or fewer than requested, use combined fetcher to top-up
            if len(plain_docs) < num:
                needed = max(0, num - len(plain_docs))
                combined = fetch_combined_papers(topic, desired_num=max(num, needed))
                # append only docs not already present (dedupe by title/url)
                existing_keys = set()
                for pd in plain_docs:
                    k = (pd.get("url") or "").strip() or (pd.get("title") or "").strip().lower()
                    if k: existing_keys.add(k)
                for c in combined:
                    k = (c.get("url") or "").strip() or (c.get("title") or "").strip().lower()
                    if k in existing_keys:
                        continue
                    plain_docs.append(c)
                    existing_keys.add(k)
                    if len(plain_docs) >= num:
                        break

            # final fallback: if still empty, return 404-style empty payload (handled below)
            if len(plain_docs) == 0:
                return jsonify({"status": "Analysis complete", "documents": []}), 200

            # Score and enrich
            scored = score_docs_concurrently(plain_docs)
            enriched = []
            for doc, trl_val, justification in scored:
                doc["TRL"] = trl_val
                doc["TRL_justification"] = justification
                if not doc.get("funding_details"):
                    doc["funding_details"] = "0"
                enriched.append(doc)
            response_payload = {"status": "Analysis complete", "documents": enriched}
            return jsonify(response_payload), 200
        except Exception as e:
            return jsonify({"status": "Analysis failed", "error": str(e)}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=int(os.getenv("API_PORT", 5000)))
