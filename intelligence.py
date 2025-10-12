import os
import json
import re
import time
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except Exception:
    GENAI_AVAILABLE = False

def _extract_numeric_funding(text: str):
    if not text:
        return 0
    m = re.search(r'(\d[\d,\.]{0,}\s*(?:million|billion|bn|m|k)?)', text, re.IGNORECASE)
    if m:
        s = m.group(1)
        s = s.replace(',', '').lower().strip()
        if 'billion' in s or 'bn' in s:
            num = float(re.sub(r'[^\d\.]', '', s)) * 1_000_000_000
        elif 'million' in s or 'm' in s:
            num = float(re.sub(r'[^\d\.]', '', s)) * 1_000_000
        elif 'k' in s:
            num = float(re.sub(r'[^\d\.]', '', s)) * 1_000
        else:
            num = float(re.sub(r'[^\d\.]', '', s))
        return int(num)
    m2 = re.search(r'(\d{4,})', text.replace(',', ''))
    if m2:
        return int(m2.group(1))
    return 0

def _local_analyze(text: str):
    txt = (text or "").lower()
    funding_amount = _extract_numeric_funding(text)
    if funding_amount == 0:
        if any(k in txt for k in ["industry", "commercial", "start-up", "venture", "venture capital", "vc"]):
            funding_amount = 500000
        elif any(k in txt for k in ["prototype", "proof of concept", "simulation"]):
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
    if any(k in txt for k in ["commercial", "deployed", "production", "scale", "live"]):
        trl = max(trl, 8)
    elif any(k in txt for k in ["pilot", "trial", "beta"]):
        trl = max(trl, 6)
    elif any(k in txt for k in ["prototype", "demo", "proof of concept", "poc"]):
        trl = max(trl, 4)
    technologies = []
    for tok in ["machine learning", "deep learning", "neural network", "computer vision", "nlp", "robotics", "blockchain", "distributed", "sensor", "uav", "quantum"]:
        if tok in txt:
            technologies.append(tok)
    if not technologies:
        tokens = re.findall(r'\b[a-z0-9\-]{4,}\b', txt)
        technologies = tokens[:3]
    strategic_summary = txt[:200].strip().replace('\n', ' ')
    provider = ""
    mprov = re.search(r'(university|institute|laboratory|lab|company|corp|inc|llc|centre|center)\s*[A-Za-z0-9\-\s\,]{0,40}', text, re.IGNORECASE)
    if mprov:
        provider = mprov.group(0).strip()
    key_relationships = []
    emerging = []
    return {
        "TRL": int(min(max(trl,1),9)),
        "TRL_justification": f"Heuristic: funding_estimate={funding_amount}",
        "strategic_summary": strategic_summary if strategic_summary else "No summary available",
        "technologies": technologies,
        "key_relationships": key_relationships,
        "country": "Unknown",
        "provider_company": provider or "Unknown",
        "funding_details": str(funding_amount)
    }

def get_gemini_analysis(text: str, max_retries: int = 2):
    if not text or len(text.split()) < 20:
        return {"TRL": 0, "strategic_summary": "Not analyzed: Abstract too short."}
    api_key = os.getenv("GEMINI_API_KEY")
    if GENAI_AVAILABLE and api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite"))
            prompt = f'Analyze and return JSON with keys TRL, TRL_justification, strategic_summary, technologies, key_relationships, country, provider_company, funding_details. Text: """{text}"""'
            resp = model.generate_content(prompt)
            raw = getattr(resp, "text", "") or ""
            m = re.search(r'\{.*\}', raw, re.DOTALL)
            if m:
                return json.loads(m.group(0))
        except Exception:
            pass
    return _local_analyze(text)
