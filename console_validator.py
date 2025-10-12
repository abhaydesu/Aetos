"""
Lightweight console validator (safe, read-only demo).

This script is intentionally conservative: by default it does NOT call
networking or Selenium code from `ingest.py` / `ingest_patents.py`.
Instead it simulates expected outputs and runs schema/consistency checks
for "market trends" and "supplier mapping" to show console validation.

If you want to wire it to real ingest functions later, you can import and
call them manually; the script includes a commented example and keeps
the default behavior non-destructive.

Usage:
  python3 console_validator.py

The script will print a short validation report and sample records.
"""

from typing import Any, Dict, List, Tuple
import argparse
import json
import sys
from console_format import log_step, format_table, hr, suppress_alts_warnings


REQUIRED_RECORD_KEYS = [
    "id",
    "title",
    "summary",
    "published",
    "authors",
    "source",
    "provider_company",
]


def validate_records(records: List[Dict[str, Any]], required_keys: List[str]) -> Tuple[int, List[Dict[str, Any]]]:
    """Return (num_invalid, details) where details list contains missing keys per record."""
    invalid_count = 0
    details: List[Dict[str, Any]] = []
    for i, r in enumerate(records):
        if not isinstance(r, dict):
            invalid_count += 1
            details.append({"index": i, "error": "not-a-dict", "missing": required_keys})
            continue
        missing = [k for k in required_keys if k not in r or r.get(k) in (None, "")]
        if missing:
            invalid_count += 1
            details.append({"index": i, "error": "missing_keys", "missing": missing})
    return invalid_count, details


def validate_supplier_mapping(mapping: Dict[str, Any]) -> Tuple[int, List[str]]:
    """Check supplier mapping structure: keys should be strings, values lists or strings.
    Returns (num_issues, list_of_messages).
    """
    issues = []
    if not isinstance(mapping, dict):
        return 1, ["supplier_mapping is not a dict"]
    for k, v in mapping.items():
        if not isinstance(k, str):
            issues.append(f"key-not-string: {repr(k)}")
        if not (isinstance(v, (list, tuple)) or isinstance(v, str)):
            issues.append(f"value-not-list-or-str for key {k}: {type(v).__name__}")
    return len(issues), issues


def validate_market_trends(trends: List[Dict[str, Any]]) -> Tuple[int, List[str]]:
    """Simple checks for market trends: ensure each trend has a name and score field."""
    msgs = []
    if not isinstance(trends, list):
        return 1, ["market_trends is not a list"]
    for i, t in enumerate(trends):
        if not isinstance(t, dict):
            msgs.append(f"trend[{i}] not-a-dict")
            continue
        if "name" not in t or not t.get("name"):
            msgs.append(f"trend[{i}] missing 'name'")
        if "score" not in t:
            msgs.append(f"trend[{i}] missing 'score'")
        else:
            try:
                _ = float(t.get("score"))
            except Exception:
                msgs.append(f"trend[{i}] score-not-numeric: {t.get('score')}")
    return len(msgs), msgs


def sample_simulated_outputs(topic: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """Create small, safe sample outputs that mimic ingest.* functions.
    These are used so the demo never performs network or starts browsers by default.
    """
    arxiv = [
        {
            "id": f"arxiv:{topic.replace(' ', '_')}:1",
            "title": f"Sample paper about {topic}",
            "summary": "This is a simulated abstract that is long enough to pass naive checks.",
            "published": "2023-10-01",
            "authors": ["Alice Example", "Bob Example"],
            "source": "arxiv",
            "provider_company": "N/A",
        }
    ]
    patents = [
        {
            "id": f"patent:{topic.replace(' ', '_')}:1",
            "title": f"Sample patent about {topic}",
            "summary": "Simulated patent abstract describing apparatus and methods.",
            "published": "2022-06-15",
            "authors": ["Inventor A"],
            "source": "google_patents",
            "provider_company": "ACME Corp",
        }
    ]
    return arxiv, patents


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Console validator demo (safe, read-only)")
    parser.add_argument("--topic", "-t", default="quantum cryptography", help="Topic used for example records")
    parser.add_argument("--call-ingest", action="store_true", help="(disabled by default) If set, attempt to call ingest functions. Use only if you want live calls.")
    args = parser.parse_args(argv)

    hr("═")
    log_step("Console Validator (demo)", "INFO")
    log_step("NOTE: This script is safe by default and will not perform network or modify data.", "INFO")
    log_step(f"Using topic: {args.topic!r}", "INFO")

    # Market trends and supplier mapping are example inputs the api might accept.
    market_trends = [
        {"name": "AI acceleration", "score": 0.87},
        {"name": "Edge compute demand", "score": "0.65"},
    ]

    supplier_mapping = {
        "ACME Corp": ["acme@example.com"],
        "Example Supplies": "contact@example.com",
    }

    # If the user explicitly asks, we could try to call real ingest functions.
    # By default we use simulated outputs to avoid network/selenium.
    arxiv_records, patent_records = sample_simulated_outputs(args.topic)

    if args.call_ingest:
        log_step("Attempting to import and call ingest functions (may do network)", "WARN")
        suppress_alts_warnings()  # Suppress ALTS warnings
        try:
            # import here to avoid module load during normal safe demo
            from ingest import fetch_arxiv_data  # type: ignore
            from ingest_patents import fetch_patent_data  # type: ignore

            try:
                log_step("Fetching arXiv data (max_results=1)...", "INFO")
                arxiv_df = fetch_arxiv_data(args.topic, max_results=1)
                # try to convert DataFrame-like objects to list of dicts safely
                if hasattr(arxiv_df, "to_dict"):
                    arxiv_records = list(arxiv_df.to_dict(orient="records"))
                else:
                    arxiv_records = list(arxiv_df) if arxiv_df else arxiv_records
            except Exception as e:
                log_step(f"fetch_arxiv_data failed: {e}", "ERROR")

            try:
                log_step("Fetching patent data (max_results=1)...", "INFO")
                patents_df = fetch_patent_data(args.topic, max_results=1)
                if hasattr(patents_df, "to_dict"):
                    patent_records = list(patents_df.to_dict(orient="records"))
                else:
                    patent_records = list(patents_df) if patents_df else patent_records
            except Exception as e:
                log_step(f"fetch_patent_data failed: {e}", "ERROR")

        except Exception as e:
            log_step(f"Could not import ingest functions: {e}", "ERROR")

    # Validate records
    hr()
    log_step("Validating arXiv Records", "INFO")
    bad_arxiv, details_arxiv = validate_records(arxiv_records, REQUIRED_RECORD_KEYS)
    if bad_arxiv:
        log_step(f"Found {bad_arxiv} invalid records out of {len(arxiv_records)}", "WARN")
        if details_arxiv:
            format_table(["Index", "Error", "Missing Fields"], 
                [[d["index"], d["error"], ", ".join(d["missing"])] for d in details_arxiv],
                "Invalid arXiv Records")
    else:
        log_step(f"All {len(arxiv_records)} arXiv records are valid", "SUCCESS")

    hr()
    log_step("Validating Patent Records", "INFO")
    bad_patents, details_patents = validate_records(patent_records, REQUIRED_RECORD_KEYS)
    if bad_patents:
        log_step(f"Found {bad_patents} invalid records out of {len(patent_records)}", "WARN")
        if details_patents:
            format_table(["Index", "Error", "Missing Fields"],
                [[d["index"], d["error"], ", ".join(d["missing"])] for d in details_patents],
                "Invalid Patent Records")
    else:
        log_step(f"All {len(patent_records)} patent records are valid", "SUCCESS")

    hr()
    log_step("Validating Market Trends", "INFO")
    mt_issues, mt_msgs = validate_market_trends(market_trends)
    if mt_issues:
        log_step(f"Found {mt_issues} issues in market trends", "WARN")
        for m in mt_msgs:
            log_step(m, "WARN")
    else:
        log_step(f"All {len(market_trends)} market trends are valid", "SUCCESS")
        format_table(["Trend", "Score"],
            [[t["name"], t["score"]] for t in market_trends],
            "Market Trends")

    hr()
    log_step("Validating Supplier Mapping", "INFO")
    sm_issues, sm_msgs = validate_supplier_mapping(supplier_mapping)
    if sm_issues:
        log_step(f"Found {sm_issues} issues in supplier mapping", "WARN")
        for m in sm_msgs:
            log_step(m, "WARN")
    else:
        log_step(f"All {len(supplier_mapping)} supplier mappings are valid", "SUCCESS")
        format_table(["Company", "Contact"],
            [[k, v if isinstance(v, str) else ", ".join(v)] for k, v in supplier_mapping.items()],
            "Supplier Mapping")

    # Display sample records
    hr()
    if arxiv_records:
        log_step("Sample arXiv Record", "INFO")
        record = arxiv_records[0]
        arxiv_id = record.get("id", "").replace("arxiv:", "")
        format_table(["Field", "Value"],
            [
                ["Title", record["title"]],
                ["Authors", ", ".join(record["authors"])],
                ["Published", record["published"]],
                ["ArXiv Link", f"https://arxiv.org/abs/{arxiv_id}" if arxiv_id else "N/A"]
            ],
            "arXiv Record Details")
    
    if patent_records:
        hr()
        log_step("Sample Patent Record", "INFO")
        record = patent_records[0]
        format_table(["Field", "Value"],
            [
                ["Title", record["title"]],
                ["Authors", ", ".join(record["authors"])],
                ["Published", record["published"]],
                ["Provider", record["provider_company"]]
            ],
            "Patent Record Details")

    hr("═")
    log_step("Validation complete. No files were written and no external state was changed.", "SUCCESS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
