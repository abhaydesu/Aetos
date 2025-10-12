from datetime import datetime
def log_intent(topic: str):
    try:
        now = datetime.utcnow().isoformat()
        print(f"[{now}] INTENT - received topic: '{topic}'")
        intent = "analyze_trend"
        confidence = 0.82
        print(f"[{now}] INTENT - inferred intent={intent} confidence={confidence}")
        return {"intent": intent, "confidence": confidence}
    except Exception as e:
        print(f"INTENT - error: {e}")
        return {"intent": "unknown", "confidence": 0.0}
