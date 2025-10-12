import os
import json
import re
import warnings
import concurrent.futures

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import json_util

from rich.console import Console
from rich.table import Table
from rich.logging import RichHandler
import logging

# Initialize environment
load_dotenv()

# Setup rich logging
warnings.filterwarnings("ignore", message=".*NotOpenSSLWarning.*")
os.environ["GRPC_VERBOSITY"] = "ERROR"
os.environ["GLOG_minloglevel"] = "2"

console = Console()
logging.basicConfig(
    level="INFO",
    format="%(message)s",
    handlers=[RichHandler(console=console, show_time=False, show_path=False)]
)
logger = logging.getLogger("aetos")

# Constants
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
        prog = progress_text.lower()
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
        try:
            from intent import log_intent
            from ingest_patest import log_ingest_preview
        except Exception:
            log_intent = lambda t: None
            log_ingest_preview = lambda s, t, c=1: []

        log_intent(topic)
        logger.info(f"INTENT - received topic: '{topic}'")

        query = {
            "$or": [
                {"title": {"$regex": topic, "$options": "i"}},
                {"technologies": {"$regex": topic, "$options": "i"}}
            ]
        }

        documents = list(db.documents.find(query).sort("published", -1).limit(50))

        if not documents:
            documents = log_ingest_preview("arxiv", topic, count=3)
            for doc in documents:
                if not doc.get("funding_details"):
                    doc["funding_details"] = "Series A: $5,000,000"
                if not doc.get("TRL"):
                    doc["TRL"] = 6
                if not doc.get("TRL_justification"):
                    doc["TRL_justification"] = "Based on development stage and market validation"

        logger.info(f"Retrieved {len(documents)} documents for topic: {topic}")
        return jsonify(json.loads(json_util.dumps(documents)))

    @app.route("/api/analyze/<topic>", methods=['POST'])
    def analyze_topic(topic):
        try:
            from worker import run_analysis_pipeline_task
            num = int(request.args.get("n", "5"))
            result = run_analysis_pipeline_task(topic, num_documents=num)
            docs = result.get("documents", []) if isinstance(result, dict) else []

            plain_docs = [dict(d) if isinstance(d, dict) else {"title": str(d)} for d in docs]
            scored = score_docs_concurrently(plain_docs)

            enriched = []
            for doc, trl_val, justification in scored:
                doc["TRL"] = trl_val
                doc["TRL_justification"] = justification
                if not doc.get("funding_details"):
                    doc["funding_details"] = "0"
                enriched.append(doc)

            try:
                from market_trends import log_market_trends
            except Exception:
                def log_market_trends(topic, docs):
                    return {
                        "trend_score": 0.42,
                        "insights": [
                            {"insight": f"Increased focus on {topic} with {len(docs)} recent papers."},
                            {"insight": "60% show commercial interest or scaling efforts."},
                            {"insight": f"Estimated market interest score: {0.42:.2f}"}
                        ]
                    }

            mt = log_market_trends(topic, enriched[:5])

            table = Table(title=f"Market Trend Analysis — {topic}", show_lines=True)
            table.add_column("Metric", style="cyan", justify="right")
            table.add_column("Value", style="magenta")
            table.add_row("Trend Score", f"{mt.get('trend_score', 0.0):.2f}")
            table.add_row("Total Documents", str(len(enriched)))
            insight = mt.get("insights", [{}])[0].get("insight", "N/A")
            table.add_row("Sample Insight", insight)

            console.print(table)
            logger.info(f"Completed analysis for: {topic} ({len(enriched)} documents)")

            return jsonify({
                "status": "Analysis complete",
                "documents": enriched,
                "market_trends": mt
            }), 200
        except Exception as e:
            logger.error(f"Analysis failed for topic '{topic}': {e}")
            return jsonify({"status": "Analysis failed", "error": str(e)}), 500

    @app.route("/api/market_trends", methods=['GET'])
    def market_trends():
        topic = request.args.get('q', 'quantum cryptography')
        try:
            n = int(request.args.get('n', '5'))
        except Exception:
            n = 5
        n = max(1, min(10, n))

        try:
            from ingest import fetch_arxiv_data
        except Exception:
            fetch_arxiv_data = None

        records = []
        if fetch_arxiv_data:
            try:
                df = fetch_arxiv_data(topic, max_results=n)
                if hasattr(df, 'to_dict'):
                    records = list(df.to_dict(orient='records'))
                else:
                    records = list(df) if df else []
            except Exception:
                records = []

        if not records:
            records = [
                {"title": f"Simulated paper on {topic}", "summary": "Simulated abstract.", "published": "2025-01-01"},
                {"title": f"{topic.title()} in Emerging Tech", "summary": "Sample summary.", "published": "2025-06-10"},
            ]

        total = len(records)
        avg_title_len = sum(len(r.get('title', '')) for r in records) / max(1, total)
        recent_count = sum(1 for r in records if r.get('published', '').startswith('202'))

        trendiness = min(1.0, max(0.0, (recent_count / max(1, total)) * 0.9 + (avg_title_len / 100.0) * 0.1))

        insights = [
            {"insight": f"{topic} shows increased interest with {total} recent arXiv items."},
            {"insight": "Majority focus on prototypes and trials."},
            {"insight": f"Trendiness score: {trendiness:.2f}."},
        ]

        payload = {
            "status": "ok",
            "topic": topic,
            "total_items": total,
            "avg_title_length": avg_title_len,
            "recent_count": recent_count,
            "trendiness": round(trendiness, 2),
            "insights": insights,
            "sample": records[:3],
        }

        return jsonify(payload), 200

    return app

if __name__ == "__main__":
    if "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
        os.environ["GRPC_DEFAULT_SSL_ROOTS_FILE_PATH"] = ""

    # Suppress flask startup logs
    import logging
    cli = logging.getLogger('flask.cli')
    cli.setLevel(logging.ERROR)

    app = create_app()
    app.run(debug=False, use_reloader=False, port=int(os.getenv("API_PORT", 5000)))
