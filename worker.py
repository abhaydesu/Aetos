import os
import time
import pandas as pd
from celery import Celery
from ingest import fetch_arxiv_data
from database import save_to_db
from intelligence import get_gemini_analysis

celery_app = Celery('aetos_tasks', broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"), backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"))

@celery_app.task(name='worker.run_analysis_pipeline_task')
def run_analysis_pipeline_task(topic: str, num_documents: int = 5):
    max_results = max(1, int(num_documents))
    arxiv_df = fetch_arxiv_data(topic, max_results=max_results)
    if arxiv_df is None or arxiv_df.empty:
        return {"status": "complete", "documents": [], "message": "No documents found."}
    arxiv_df['published'] = pd.to_datetime(arxiv_df['published'], errors='coerce')
    arxiv_df.dropna(subset=['summary'], inplace=True)
    MIN_SUMMARY_LENGTH = 80
    arxiv_df = arxiv_df[arxiv_df['summary'].str.len() >= MIN_SUMMARY_LENGTH]
    if arxiv_df.empty:
        return {"status": "complete", "documents": [], "message": "No high-quality documents found."}
    docs = []
    for _, row in arxiv_df.iterrows():
        s = row.get('summary') or ""
        if len(s.split()) < 20:
            continue
        analysis = get_gemini_analysis(s)
        merged = row.to_dict()
        merged.update(analysis)
        docs.append(merged)
    if docs:
        df = pd.DataFrame(docs)
        save_to_db(df)
        return {"status": "complete", "documents": docs, "message": f"Processed {len(docs)} documents."}
    return {"status": "complete", "documents": [], "message": "No documents processed."}
