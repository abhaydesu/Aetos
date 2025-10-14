import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import json_util
import json
import concurrent.futures
import re
from worker import run_analysis_pipeline_task

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
MAX_SCORING_WORKERS = int(os.getenv("MAX_SCORING_WORKERS", "4"))
SINGLE_SCORE_TIMEOUT = float(os.getenv("SINGLE_SCORE_TIMEOUT", "6.0"))

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
            num = int(request.args.get("n", "5"))
            result = run_analysis_pipeline_task(topic, num_documents=num)
            docs = result.get("documents", []) if isinstance(result, dict) else []
            plain_docs = []
            for d in docs:
                try:
                    doc = dict(d)
                except Exception:
                    doc = {"title": str(d)}
                plain_docs.append(doc)
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
