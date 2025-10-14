import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime

load_dotenv()

def get_db_connection():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client.aetos_db
    db.documents.create_index([("title", ASCENDING)])
    db.documents.create_index([("technologies", ASCENDING)])
    db.documents.create_index([("published", ASCENDING)])
    db.documents.create_index([("source", ASCENDING)])
    return db

def save_to_db(df: pd.DataFrame) -> int:
    if df.empty:
        return 0
    try:
        db = get_db_connection()
        records = df.to_dict('records')
        for record in records:
            record['updated_at'] = datetime.utcnow()
            if 'authors' in record and isinstance(record['authors'], list):
                record['authors'] = [str(a) for a in record['authors']]
        inserted_count = 0
        for record in records:
            result = db.documents.update_one({'id': record.get('id')}, {'$set': record}, upsert=True)
            if getattr(result, "upserted_id", None) or getattr(result, "modified_count", 0) > 0:
                inserted_count += 1
        return inserted_count
    except Exception:
        return 0
