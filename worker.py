# worker.py
import os
import time
import pandas as pd
from database import save_to_db
from intelligence import get_gemini_analysis


def run_analysis_pipeline_task(topic: str, num_documents: int = 5):
    """
    Synchronous analysis pipeline:
      - fetches papers via ingest.fetch_combined_papers (imported locally to avoid circular import)
      - filters and cleans
      - runs get_gemini_analysis on summaries
      - saves results to DB via save_to_db
      - returns a dict with status and documents
    """
    max_results = max(1, int(num_documents))

    try:
        from ingest import fetch_combined_papers
    except Exception as e:
        return {"status": "complete", "documents": [], "message": f"failed to import fetcher: {e}"}

    try:
        arxiv_list = fetch_combined_papers(topic, desired_num=max_results)
    except Exception as e:
        return {"status": "complete", "documents": [], "message": f"fetch_combined_papers failed: {e}"}

    arxiv_df = pd.DataFrame(arxiv_list) if arxiv_list else pd.DataFrame()

    if arxiv_df is None or arxiv_df.empty:
        return {"status": "complete", "documents": [], "message": "No documents found."}

    # Normalize published column and remove empty summaries
    arxiv_df['published'] = pd.to_datetime(arxiv_df.get('published', None), errors='coerce')
    arxiv_df.dropna(subset=['summary'], inplace=True)

    MIN_SUMMARY_LENGTH = 80
    arxiv_df = arxiv_df[arxiv_df['summary'].str.len() >= MIN_SUMMARY_LENGTH]
    if arxiv_df.empty:
        return {"status": "complete", "documents": [], "message": "No high-quality documents found."}

    docs = []
    for _, row in arxiv_df.iterrows():
        s = row.get('summary') or ""
        # ensure enough content
        if len(s.split()) < 20:
            continue
        # Gemeni analysis may raise; guard it
        try:
            analysis = get_gemini_analysis(s)
        except Exception as e:
            analysis = {"analysis_error": str(e)}
        merged = row.to_dict()
        # ensure merged has plain python types
        merged = {k: (v if pd.notna(v) else None) for k, v in merged.items()}
        # merge analysis results (if any)
        if isinstance(analysis, dict):
            merged.update(analysis)
        else:
            merged["analysis"] = str(analysis)
        docs.append(merged)

    if docs:
        try:
            df = pd.DataFrame(docs)
            save_to_db(df)
        except Exception as e:
            # DB save failed but still return processed docs
            return {"status": "complete", "documents": docs, "message": f"Processed {len(docs)} documents; save_to_db failed: {e}"}
        return {"status": "complete", "documents": docs, "message": f"Processed {len(docs)} documents."}

    return {"status": "complete", "documents": [], "message": "No documents processed."}
