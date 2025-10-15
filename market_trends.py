# market_trends.py
import logging
from typing import List, Dict, Any
from datetime import datetime
from rich.console import Console
from rich.table import Table
import re

logger = logging.getLogger("aetos.market_trends")
console = Console()

try:
    from intelligence import get_gemini_analysis
except Exception:
    def get_gemini_analysis(text: str, *a, **k):
        return {
            "ai_summary": (text or "")[:300],
            "insights": [],
            "key_players": [],
            "trend_score": 0.0,
            "convergence": [],
            "mock_trl_progression": {"history": [], "forecast": []},
            "funding_estimate_usd": None,
        }

def _aggregate_docs_text(docs: List[Dict[str, Any]], max_chars: int = 25000) -> str:
    parts = []
    for d in docs:
        t = d.get("title") or ""
        s = d.get("summary") or d.get("abstract") or d.get("strategic_summary") or ""
        parts.append(f"{t}\n{s}")
        if sum(len(p) for p in parts) > max_chars:
            break
    text = "\n\n".join(parts)
    return text[:max_chars]

def _derive_trendiness_from_docs(records: List[Dict[str, Any]]) -> float:
    if not records:
        return 0.0
    total = len(records)
    recent_count = 0
    for r in records:
        pub = r.get("published") or r.get("published_date") or ""
        if isinstance(pub, str) and re.match(r"20\d{2}", pub):
            if pub.startswith("202"):
                recent_count += 1
        else:
            try:
                # handle dict with $date
                if isinstance(pub, dict) and "$date" in pub:
                    if str(pub["$date"]).startswith("202"):
                        recent_count += 1
            except Exception:
                pass
    avg_title_len = sum(len(r.get("title", "")) for r in records) / max(1, total)
    score = min(1.0, max(0.0, (recent_count / max(1, total)) * 0.9 + (avg_title_len / 100.0) * 0.1))
    return round(score, 2)

def log_market_trends(topic: str, records: List[Dict[str, Any]]) -> Dict[str, Any]:
    now = datetime.utcnow().isoformat()
    console.print(f"[{now}] ▸ Market trend analysis for: {topic} ({len(records)} records)")
    text_blob = _aggregate_docs_text(records)
    try:
        # Try best-effort call: some intelligence.get_gemini_analysis variants accept topic arg
        try:
            gem = get_gemini_analysis(text_blob, topic=topic)
        except TypeError:
            gem = get_gemini_analysis(text_blob)
    except Exception as e:
        logger.exception("gemini analysis failed: %s", e)
        gem = {}

    ai_summary = gem.get("ai_summary") or gem.get("summary") or ""
    insights = gem.get("insights") or []
    key_players = gem.get("key_players") or []
    convergence = gem.get("convergence") or []
    mock_trl = gem.get("mock_trl_progression") or gem.get("mock_trl") or {"history": [], "forecast": []}
    funding_estimate = gem.get("funding_estimate_usd") if isinstance(gem.get("funding_estimate_usd", None), (int, float)) else None
    trend_score = gem.get("trend_score") or gem.get("trendiness") or _derive_trendiness_from_docs(records)

    # Defensive normalizations
    if not isinstance(insights, list):
        insights = [str(insights)]
    if not isinstance(key_players, list):
        key_players = [str(key_players)] if key_players else []
    if not isinstance(convergence, list):
        convergence = []

    table = Table(title=f"Market Trend — {topic}", show_lines=True)
    table.add_column("Metric", style="cyan", justify="left")
    table.add_column("Value", style="magenta")
    table.add_row("Trend Score", f"{trend_score:.2f}")
    table.add_row("Documents Analyzed", str(len(records)))
    table.add_row("AI Summary (excerpt)", (ai_summary or "")[:200])
    sample_insight = insights[0] if insights else ""
    table.add_row("Sample Insight", sample_insight)
    console.print(table)

    return {
        "trend_score": float(trend_score or 0.0),
        "insights": insights,
        "ai_summary": ai_summary,
        "key_players": key_players,
        "convergence": convergence,
        "mock_trl_progression": mock_trl,
        "funding_estimate_usd": funding_estimate,
        "sample": records[:5]
    }
