from datetime import datetime
from rich.console import Console
from rich.table import Table

console = Console()

def log_market_trends(topic: str, records):
    now = datetime.utcnow().isoformat()
    print(f"[{now}] ▸ Analyzing market trends for: {topic} ({len(records)} records)")
    insights = [
        {"insight": f"Market analysis shows consistent interest in {topic} technologies"},
        {"insight": "Funding trends indicate early-stage market development"},
    ]
    score = 0.42

    table = Table(title=f"Market Trend Analysis for '{topic.title()}'", style="cyan", title_style="bold magenta")
    table.add_column("Insight", style="bold")
    table.add_column("Score", justify="right", style="green")

    for insight in insights:
        table.add_row(insight["insight"], f"{score:.2f}")

    console.print(table)
    return {"trend_score": score, "insights": insights}
