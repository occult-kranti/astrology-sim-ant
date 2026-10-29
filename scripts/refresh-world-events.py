#!/usr/bin/env python3
"""Bounded availability probe; never rewrites event dates or review timestamps.

Run deliberately, then inspect changed official content before updating the data.
Normal urllib proxy/CA settings are retained. No challenge is solved or retried.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
import json
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]

def probe(source):
    receipt = {"id": source["id"], "url": source["url"], "probedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "claimVerification": "not-performed"}
    try:
        request = urllib.request.Request(source["url"], headers={"User-Agent": "CalendarObservatory source availability check"})
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read(2_000_001)
            if len(body) > 2_000_000:
                receipt.update(status="body-limit-exceeded", httpStatus=response.status)
                return receipt
            digest = hashlib.sha256(body).hexdigest()
            receipt.update(status="received", httpStatus=response.status, bytes=len(body), finalURL=response.url, sha256=digest, matchesCapturedBody=digest == source.get("sha256"))
    except (urllib.error.URLError, TimeoutError, ValueError) as error:
        receipt.update(status="failed", error=str(error))
    return receipt

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True, help="New local receipt path; no publication occurs.")
    parser.add_argument("--source", action="append", default=[], help="Repeat to probe selected source IDs; default is only date-supporting sources.")
    arguments = parser.parse_args()
    dataset = json.loads((ROOT / "assets/data/world-events.json").read_text())
    sources = [source for source in dataset["sources"] if source["id"] in arguments.source] if arguments.source else [source for source in dataset["sources"] if source["status"] in ["verified-date-support", "conflicting-page-elements"]]
    if arguments.source and set(arguments.source) != {source["id"] for source in sources}:
        raise SystemExit("An unknown source ID was requested.")
    if len(sources) > 24:
        raise SystemExit("Select at most 24 sources for this bounded probe.")
    if arguments.output.exists():
        raise SystemExit("Choose a new output path; existing evidence is not overwritten.")
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        receipts = list(pool.map(probe, sources))
    output = {"schemaVersion": 1, "datasetReviewedAt": dataset["reviewedAt"], "method": "One HTTPS availability request per selected source, inherited proxy and normal TLS; bounded body and timeout, no retries.", "claimVerification": "not-performed", "note": "Availability or byte equality does not establish that a schedule remains current. Inspect changed text and source date support; this script never updates event records, source verification or the public review timestamp.", "receipts": receipts}
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(receipts)} availability receipts; no event dates or verified timestamps were changed.")

if __name__ == "__main__":
    main()
