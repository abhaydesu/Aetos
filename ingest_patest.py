from datetime import datetime
from rich.console import Console
from rich.table import Table

console = Console()

def log_ingest_preview(source: str, topic: str, count: int = 1):
    now = datetime.utcnow().isoformat()
    print(f"[{now}] ▸ Processing search query: {topic}")
    simulated = []
    summaries = {
        "night camera": [
            "Breakthrough in Low-Light CMOS Technology: Novel architecture achieving sub-lux sensitivity with 120dB dynamic range. Implementation demonstrates 0.002 lux performance under starlight conditions. https://arxiv.org/abs/2310.12345",
            "Quantum-Enhanced Night Vision Arrays: Scalable fabrication of superconducting nanowire arrays achieving single-photon detection. Field tests show 94% quantum efficiency. https://arxiv.org/abs/2310.12346",
            "AI-Driven Low-Light Image Enhancement: Deep learning pipeline for real-time denoising and contrast enhancement. Validated on ImageNet-Dark with 45% quality improvement. https://arxiv.org/abs/2310.12347"
        ],
        "drones": [
            "Advanced UAV Control Systems: Novel hierarchical architecture for autonomous navigation in GPS-denied environments. Real-world validation across 1000+ flight hours.",
            "Next-Generation Drone Platform: Carbon-fiber composite design with 45-minute flight endurance. Integrated 8K sensing package with real-time edge processing.",
            "Distributed Drone Networks: Mesh-networked UAV system for wide-area monitoring. Successfully tested with 12-node deployment."
        ]
    }
    
    topic_summaries = summaries.get(topic.lower(), [
        f"Advanced research in {topic} technology with focus on commercial applications.",
        f"Novel {topic} system with enhanced capabilities and market potential.",
        f"A foundational study exploring the core principles of {topic}, with potential for broad applications.",
        f"This paper presents a novel methodology for {topic}, improving efficiency by over 25% in benchmark tests.",
        f"A comprehensive review of the current state of {topic}, identifying key challenges and future research directions."
    ])
    
    for i in range(count):
        doc = {
            "id": f"sim:{source}:{topic}:{i+1}",
            "title": f"Advanced {topic.title()} Technology - Generation {i+1}",
            "summary": topic_summaries[i % len(topic_summaries)],
            "published": "2024-01-01",
            "authors": ["Research Team Alpha", "Innovation Labs"],
            "source": source,
            "provider_company": "TechCorp International",
            "funding_details": f"Series {chr(65+i)} funding: $5,000,000",
            "TRL": 6 + (i % 3),
            "TRL_justification": "Based on development stage and market validation",
            "technologies": [topic.lower(), "artificial intelligence", "machine learning"],
            "strategic_summary": f"Market-ready {topic} technology with demonstrated commercial viability.",
            "progress": "Beta testing with selected customers"
        }
        simulated.append(doc)

    table = Table(title=f"Simulated Patent Ingest for '{topic.title()}'", style="cyan", title_style="bold magenta")
    table.add_column("ID", style="dim", width=12)
    table.add_column("Title", style="bold")
    table.add_column("TRL", justify="right", style="green")
    table.add_column("Summary", justify="left", no_wrap=False)

    for doc in simulated:
        table.add_row(
            doc["id"], doc["title"], str(doc["TRL"]), doc["summary"]
        )

    console.print(table)
    return simulated
