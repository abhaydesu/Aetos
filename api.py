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
import pandas as pd
from datetime import datetime

load_dotenv()

# Environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
MAX_SCORING_WORKERS = int(os.getenv("MAX_SCORING_WORKERS", "4"))
SINGLE_SCORE_TIMEOUT = float(os.getenv("SINGLE_SCORE_TIMEOUT", "6.0"))
ARXIV_TIMEOUT = float(os.getenv("ARXIV_TIMEOUT", "8.0"))
ARXIV_MAX_RESULTS = int(os.getenv("ARXIV_MAX_RESULTS", "10"))
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
SERPAPI_TIMEOUT = float(os.getenv("SERPAPI_TIMEOUT", "8.0"))
SERPAPI_MAX_RESULTS = int(os.getenv("SERPAPI_MAX_RESULTS", "10"))
GEMINI_TIMEOUT = float(os.getenv("GEMINI_TIMEOUT", "10.0"))

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client.get_database("aetos_db")

    # ========================================
    # INTELLIGENCE / GEMINI ANALYSIS
    # ========================================
    def get_gemini_analysis(summary_text):
        """
        Call Gemini API to analyze a research summary and extract structured information.
        Returns dict with analysis results or error info.
        """
        if not GEMINI_API_KEY:
            return {"analysis_error": "GEMINI_API_KEY not configured"}
        
        try:
            prompt = f"""Analyze the following research summary and provide:
1. TRL (Technology Readiness Level) from 1-9
2. TRL justification (brief explanation)
3. Key technologies mentioned (comma-separated list)
4. Funding details if mentioned (amount and source)
5. Progress/status (e.g., prototype, pilot, commercial)
6. Strategic importance (1-10 rating with brief explanation)

Research Summary:
{summary_text}

Respond in JSON format with keys: TRL, TRL_justification, technologies, funding_details, progress, strategic_rating, strategic_summary"""

            url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1024
                }
            }
            
            resp = requests.post(url, json=payload, timeout=GEMINI_TIMEOUT)
            if resp.status_code != 200:
                return {"analysis_error": f"Gemini API error: {resp.status_code}"}
            
            result = resp.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                text = result['candidates'][0].get('content', {}).get('parts', [{}])[0].get('text', '')
                # Try to parse JSON from response
                try:
                    # Remove markdown code blocks if present
                    text = text.strip()
                    if text.startswith('```'):
                        text = '\n'.join(text.split('\n')[1:-1])
                    analysis = json.loads(text)
                    return analysis
                except json.JSONDecodeError:
                    # If not valid JSON, return raw text
                    return {"raw_analysis": text}
            
            return {"analysis_error": "No valid response from Gemini"}
        except Exception as e:
            return {"analysis_error": str(e)}

    # ========================================
    # DATABASE OPERATIONS
    # ========================================
    def save_to_db(df):
        """Save DataFrame of documents to MongoDB"""
        try:
            if df.empty:
                return
            
            records = df.to_dict('records')
            # Convert datetime objects to strings
            for rec in records:
                for k, v in rec.items():
                    if isinstance(v, pd.Timestamp):
                        rec[k] = v.isoformat()
                    elif pd.isna(v):
                        rec[k] = None
            
            # Upsert based on title or url
            for rec in records:
                query = {}
                if rec.get('url'):
                    query['url'] = rec['url']
                elif rec.get('title'):
                    query['title'] = rec['title']
                else:
                    continue
                
                db.documents.update_one(query, {"$set": rec}, upsert=True)
        except Exception as e:
            print(f"Error saving to DB: {e}")

    # ========================================
    # TRL SCORING
    # ========================================
    def heuristic_trl(doc):
        """Calculate TRL heuristically based on funding and progress"""
        funding_text = (doc.get("funding_details") or "")
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
        """Get TRL for a document, using existing TRL or calculating heuristically"""
        try:
            trl = int(doc.get("TRL", 0))
            justification = doc.get("TRL_justification", "")
            if trl and 1 <= trl <= 9:
                return trl, justification or "From analysis"
        except Exception:
            pass
        return heuristic_trl(doc)

    def score_docs_concurrently(docs):
        """Score multiple documents concurrently"""
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

    # ========================================
    # FETCHERS: arXiv, Google Scholar, DB
    # ========================================
    def fetch_arxiv_papers(query, max_results=ARXIV_MAX_RESULTS, timeout=ARXIV_TIMEOUT):
        """Fetch papers from arXiv API"""
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
                    "url": link or f"https://arxiv.org/abs/{entry.find('atom:id', ns).text.split('/')[-1]}" if entry.find('atom:id', ns) is not None else "",
                    "funding_details": "0"
                }
                entries.append(doc)
            
            return entries
        except Exception as e:
            print(f"arXiv fetch error: {e}")
            return []

    def fetch_scholar_via_serpapi(query, api_key=SERPAPI_KEY, max_results=SERPAPI_MAX_RESULTS, timeout=SERPAPI_TIMEOUT):
        """Fetch papers from Google Scholar via SerpAPI"""
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
            organic = j.get("organic_results") or j.get("scholar_results") or j.get("organic") or []
            results = []
            
            for item in organic[:max_results]:
                title = item.get("title") or item.get("headline") or item.get("title_noformat") or ""
                snippet = item.get("snippet") or item.get("citation") or item.get("abstract") or item.get("snippet_highlighted") or ""
                
                authors = []
                pub_info = item.get("publication_info") or {}
                if isinstance(pub_info, dict) and pub_info.get("authors"):
                    try:
                        authors = [a.get("name") if isinstance(a, dict) else str(a) for a in pub_info.get("authors")]
                    except Exception:
                        authors = []
                
                if not authors and item.get("authors"):
                    authors = item.get("authors")
                
                link = item.get("link") or item.get("source") or item.get("url") or ""
                
                # Try to get actual paper link from inline_links or other fields
                if not link and item.get("inline_links"):
                    inline = item.get("inline_links", {})
                    link = inline.get("serpapi_cite_link") or inline.get("cited_by", {}).get("link") or ""
                
                year = ""
                if isinstance(pub_info, dict):
                    year = pub_info.get("year") or pub_info.get("summary") or ""
                
                # Skip entries without valid links
                if not link or link == "":
                    continue
                
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
        except Exception as e:
            print(f"Scholar fetch error: {e}")
            return []

    def fetch_from_db(query, max_results=10):
        """Fetch documents from MongoDB"""
        try:
            query_db = {
                "$or": [
                    {"title": {"$regex": query, "$options": "i"}},
                    {"technologies": {"$regex": query, "$options": "i"}},
                    {"summary": {"$regex": query, "$options": "i"}}
                ]
            }
            db_docs = list(db.documents.find(query_db).sort("published", -1).limit(max_results))
            results = []
            
            for d in db_docs:
                doc = json.loads(json_util.dumps(d))
                results.append({
                    "title": doc.get("title", ""),
                    "summary": doc.get("summary", "") or doc.get("abstract", ""),
                    "published": doc.get("published", ""),
                    "authors": doc.get("authors", []),
                    "source": doc.get("source", "MongoDB"),
                    "url": doc.get("url", ""),
                    "funding_details": doc.get("funding_details", "0"),
                    "TRL": doc.get("TRL"),
                    "TRL_justification": doc.get("TRL_justification"),
                    "technologies": doc.get("technologies"),
                    "progress": doc.get("progress"),
                    "strategic_rating": doc.get("strategic_rating"),
                    "strategic_summary": doc.get("strategic_summary")
                })
            
            return results
        except Exception as e:
            print(f"DB fetch error: {e}")
            return []

    def fetch_combined_papers(query, desired_num=10):
        """
        Fetch papers from multiple sources concurrently:
        1. arXiv
        2. Google Scholar (via SerpAPI)
        3. MongoDB (existing documents)
        
        Deduplicates by URL/title and returns up to desired_num results.
        """
        results = []
        
        # Run all fetchers concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as exe:
            future_arxiv = exe.submit(fetch_arxiv_papers, query, max_results=desired_num, timeout=ARXIV_TIMEOUT)
            future_scholar = exe.submit(fetch_scholar_via_serpapi, query, api_key=SERPAPI_KEY, max_results=desired_num, timeout=SERPAPI_TIMEOUT)
            future_db = exe.submit(fetch_from_db, query, max_results=desired_num)
            
            arxiv_res = []
            scholar_res = []
            db_res = []
            
            try:
                arxiv_res = future_arxiv.result(timeout=ARXIV_TIMEOUT + 1)
            except Exception as e:
                print(f"arXiv future error: {e}")
            
            try:
                scholar_res = future_scholar.result(timeout=SERPAPI_TIMEOUT + 1)
            except Exception as e:
                print(f"Scholar future error: {e}")
            
            try:
                db_res = future_db.result(timeout=5)
            except Exception as e:
                print(f"DB future error: {e}")

        # Deduplicate by URL or title
        seen = set()
        combined = []

        def normalize_key(doc):
            url = (doc.get("url") or "").strip()
            title = (doc.get("title") or "").strip().lower()
            if url:
                return url
            return title

        # Priority: DB first (already analyzed), then arXiv, then Scholar
        for doc in (db_res or []):
            key = normalize_key(doc)
            if key and key not in seen:
                seen.add(key)
                combined.append(doc)
            if len(combined) >= desired_num:
                return combined[:desired_num]

        for doc in (arxiv_res or []):
            key = normalize_key(doc)
            if key and key not in seen:
                seen.add(key)
                combined.append(doc)
            if len(combined) >= desired_num:
                return combined[:desired_num]

        for doc in (scholar_res or []):
            key = normalize_key(doc)
            if key and key not in seen:
                seen.add(key)
                combined.append(doc)
            if len(combined) >= desired_num:
                return combined[:desired_num]

        return combined[:desired_num]

    # ========================================
    # ANALYSIS PIPELINE
    # ========================================
    def run_analysis_pipeline(topic, num_documents=5):
        """
        Complete analysis pipeline:
        1. Fetch papers from multiple sources
        2. Filter and clean
        3. Run Gemini analysis on summaries
        4. Score TRL
        5. Save to database
        6. Return enriched documents
        """
        max_results = max(1, int(num_documents))
        
        # Fetch papers
        papers = fetch_combined_papers(topic, desired_num=max_results)
        
        if not papers:
            return {"status": "complete", "documents": [], "message": "No documents found."}
        
        # Convert to DataFrame for easier processing
        df = pd.DataFrame(papers)
        
        # Normalize published column
        if 'published' in df.columns:
            df['published'] = pd.to_datetime(df['published'], errors='coerce')
        
        # Filter out documents with very short summaries
        MIN_SUMMARY_LENGTH = 80
        df = df[df.get('summary', pd.Series()).str.len() >= MIN_SUMMARY_LENGTH]
        
        if df.empty:
            return {"status": "complete", "documents": [], "message": "No high-quality documents found."}
        
        # Process each document
        processed_docs = []
        for _, row in df.iterrows():
            doc = row.to_dict()
            
            # Convert NaN to None, handle lists/arrays specially
            cleaned = {}
            for k, v in doc.items():
                if isinstance(v, list):
                    cleaned[k] = v
                elif pd.isna(v):
                    cleaned[k] = None
                else:
                    cleaned[k] = v
            doc = cleaned
            
            # Skip if already analyzed (has TRL from DB)
            if doc.get('TRL') and doc.get('TRL_justification'):
                processed_docs.append(doc)
                continue
            
            # Run Gemini analysis if summary is substantial
            summary = doc.get('summary', '')
            if summary and len(summary.split()) >= 20:
                try:
                    analysis = get_gemini_analysis(summary)
                    if isinstance(analysis, dict):
                        doc.update(analysis)
                except Exception as e:
                    print(f"Gemini analysis error: {e}")
                    doc['analysis_error'] = str(e)
            
            processed_docs.append(doc)
        
        # Score TRL for all documents
        scored = score_docs_concurrently(processed_docs)
        enriched = []
        for doc, trl_val, justification in scored:
            doc["TRL"] = trl_val
            if not doc.get("TRL_justification"):
                doc["TRL_justification"] = justification
            if not doc.get("funding_details"):
                doc["funding_details"] = "0"
            enriched.append(doc)
        
        # Save to database
        if enriched:
            try:
                df_enriched = pd.DataFrame(enriched)
                save_to_db(df_enriched)
            except Exception as e:
                print(f"DB save error: {e}")
        
        return {
            "status": "complete",
            "documents": enriched,
            "message": f"Processed {len(enriched)} documents."
        }

    # ========================================
    # API ROUTES
    # ========================================
    @app.route("/api/documents/<topic>", methods=['GET'])
    def get_documents(topic):
        """Get documents from database matching topic"""
        try:
            limit = int(request.args.get("limit", "50"))
            docs = fetch_from_db(topic, max_results=limit)
            return jsonify(docs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyze/<topic>", methods=['POST'])
    def analyze_topic(topic):
        """
        Analyze a topic: fetch papers, run AI analysis, score TRL, save to DB
        Query params:
        - n: number of documents to analyze (default: 5)
        """
        try:
            num = int(request.args.get("n", "5"))
            result = run_analysis_pipeline(topic, num_documents=num)
            return jsonify(result), 200
        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"status": "Analysis failed", "error": str(e)}), 500

    @app.route("/api/health", methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "services": {
                "arxiv": "configured",
                "serpapi": "configured" if SERPAPI_KEY else "not configured",
                "gemini": "configured" if GEMINI_API_KEY else "not configured",
                "mongodb": "connected"
            }
        })

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("API_PORT", 5000))
    print(f"Starting Aetos API Server on port {port}...")
    app.run(debug=True, port=port, host='0.0.0.0')