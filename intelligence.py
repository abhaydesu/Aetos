# src/python/intelligence.py
import os
import json
import re
import logging
from typing import Any, Dict

logger = logging.getLogger("aetos.intelligence")

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except Exception:
    GENAI_AVAILABLE = False

def _safe_json_parse(s: str):
    if not s:
        return None
    try:
        return json.loads(s)
    except Exception:
        try:
            m = re.search(r'(\{[\s\S]*\})', s)
            if m:
                return json.loads(m.group(1))
        except Exception:
            return None
    return None

def _extract_numeric_funding(text: str):
    if not text:
        return 0
    m = re.search(r'(\d[\d,\.]{0,}\s*(?:billion|million|bn|m|k)?)', text, re.IGNORECASE)
    if m:
        s = m.group(1)
        s = s.replace(',', '').lower().strip()
        try:
            if 'billion' in s or 'bn' in s:
                num = float(re.sub(r'[^\d\.]', '', s)) * 1_000_000_000
            elif 'million' in s or (s.endswith('m') and not s.endswith('cm')):
                num = float(re.sub(r'[^\d\.]', '', s)) * 1_000_000
            elif s.endswith('k'):
                num = float(re.sub(r'[^\d\.]', '', s)) * 1_000
            else:
                num = float(re.sub(r'[^\d\.]', '', s))
            return int(num)
        except Exception:
            pass
    m2 = re.search(r'(\d{4,})', text.replace(',', ''))
    if m2:
        try:
            return int(m2.group(1))
        except Exception:
            return 0
    return 0

def _local_analyze(text: str, topic: str = "") -> Dict[str, Any]:
    txt = (text or "").strip()
    lower = txt.lower()
    funding_amount = _extract_numeric_funding(text)
    if funding_amount == 0:
        if any(k in lower for k in ["industry", "commercial", "start-up", "startup", "venture", "vc", "venture capital"]):
            funding_amount = 500000
        elif any(k in lower for k in ["prototype", "proof of concept", "simulation"]):
            funding_amount = 25000
        else:
            funding_amount = 10000
    trl = 1
    if funding_amount >= 50_000_000:
        trl = 8
    elif funding_amount >= 5_000_000:
        trl = 7
    elif funding_amount >= 500_000:
        trl = 6
    elif funding_amount >= 50_000:
        trl = 5
    elif funding_amount >= 5_000:
        trl = 4
    else:
        trl = 3
    if any(k in lower for k in ["commercial", "deployed", "production", "scale", "live"]):
        trl = max(trl, 8)
    elif any(k in lower for k in ["pilot", "trial", "beta"]):
        trl = max(trl, 6)
    elif any(k in lower for k in ["prototype", "demo", "proof of concept", "poc"]):
        trl = max(trl, 4)
    technologies = []
    candidates = ["machine learning", "deep learning", "neural network", "computer vision", "nlp", "robotics", "blockchain", "distributed", "sensor", "uav", "quantum", "satellite"]
    for tok in candidates:
        if tok in lower:
            technologies.append(tok)
    if not technologies:
        tokens = re.findall(r'\b[a-z0-9\-]{4,}\b', lower)
        technologies = list(dict.fromkeys(tokens))[:3]
    strategic_summary = (txt[:400] or "").replace("\n", " ").strip()
    provider = ""
    mprov = re.search(r'([A-Za-z0-9\-\s]{2,40}\s+(?:university|institute|laboratory|lab|company|corp|inc|llc|centre|center|systems|technologies|tech))', text, re.IGNORECASE)
    if mprov:
        provider = mprov.group(0).strip()
    return {
        "ai_summary": strategic_summary or f"Brief summary for {topic or 'document'}.",
        "insights": [
            f"Early-stage research interest in {topic or 'this area'}.",
            "Integration with AI/ML methods frequently mentioned.",
            "Majority of items indicate prototype or pilot activity."
        ],
        "key_players": [provider] if provider else [],
        "country": "",
        "funding_estimate_usd": funding_amount,
        "trend_score": round(min(1.0, (funding_amount / 5_000_000) * 0.2 + 0.2), 2),
        "convergence": [],
        "mock_trl_progression": {"history": [{"year": 2022, "avg_trl": max(1, trl-2)}, {"year": 2023, "avg_trl": trl}], "forecast": [{"year": 2024, "avg_trl": min(9, trl + 1)}]},
        "TRL": int(min(max(trl, 1), 9)),
        "TRL_justification": f"Heuristic: funding_estimate={funding_amount}",
        "strategic_summary": strategic_summary or "No summary available",
        "technologies": technologies,
        "provider_company": provider or "",
        "funding_details": str(funding_amount)
    }

def get_gemini_analysis(text: str, topic: str = "", max_output_tokens: int = 512) -> Dict[str, Any]:
    if not text or len(text.split()) < 20:
        return _local_analyze(text, topic)
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
    if GENAI_AVAILABLE and api_key:
        try:
            genai.configure(api_key=api_key)
            prompt = (
                "Produce a JSON object only (no extra text) with keys: ai_summary (short 2-4 sentence summary), "
                "insights (array of up to 5 concise insights), key_players (array of org/company names), "
                "country (primary country or empty), funding_estimate_usd (approx number or null), "
                "trend_score (0.0-1.0), convergence (array of {tech_1, tech_2, strength}), "
                "mock_trl_progression ({history:[{year,avg_trl}],forecast:[{year,avg_trl}]}), "
                "TRL (int 1-9), TRL_justification (string), strategic_summary (string), technologies (array). "
                f"TOPIC: {topic}\n\nTEXT: {text[:8000]}"
            )
            try:
                response = genai.generate(model=model_name, prompt=prompt, max_output_tokens=max_output_tokens)
            except Exception:
                response = genai.respond(model=model_name, prompt=prompt) if hasattr(genai, "respond") else None
            raw = ""
            if response is None:
                return _local_analyze(text, topic)
            if isinstance(response, dict):
                raw = response.get("candidates") or response.get("output") or response.get("text") or str(response)
                if isinstance(raw, list):
                    raw = raw[0] if raw else ""
            else:
                raw = getattr(response, "text", "") or str(response)
            parsed = _safe_json_parse(raw)
            if parsed and isinstance(parsed, dict):
                parsed.setdefault("ai_summary", parsed.get("ai_summary") or parsed.get("summary") or "")
                parsed.setdefault("insights", parsed.get("insights") or [])
                parsed.setdefault("key_players", parsed.get("key_players") or [])
                parsed.setdefault("country", parsed.get("country") or "")
                parsed.setdefault("funding_estimate_usd", parsed.get("funding_estimate_usd"))
                parsed.setdefault("trend_score", float(parsed.get("trend_score") or 0.0))
                parsed.setdefault("convergence", parsed.get("convergence") or [])
                parsed.setdefault("mock_trl_progression", parsed.get("mock_trl_progression") or {"history": [], "forecast": []})
                parsed.setdefault("TRL", int(parsed.get("TRL") or parsed.get("trl") or 0))
                parsed.setdefault("TRL_justification", parsed.get("TRL_justification") or parsed.get("trl_justification") or "")
                parsed.setdefault("strategic_summary", parsed.get("strategic_summary") or parsed.get("ai_summary") or "")
                parsed.setdefault("technologies", parsed.get("technologies") or [])
                return parsed
            else:
                return _local_analyze(text, topic)
        except Exception as e:
            logger.exception("Gemini call failed, falling back: %s", e)
            return _local_analyze(text, topic)
    else:
        return _local_analyze(text, topic)
