"""Inspect the built static site before sharing or publishing it."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"


def check(release: bool = False) -> None:
    expected = ("index.html", "about.html", "support.html", "build-provenance.json", ".nojekyll")
    for name in expected:
        if not (SITE / name).is_file():
            raise ValueError(f"Missing site artifact: {name}")
    landing = (SITE / "index.html").read_text(encoding="utf-8")
    provenance = json.loads((SITE / "build-provenance.json").read_text(encoding="utf-8"))
    if set(provenance["snapshots"]) != {"about", "support"}:
        raise ValueError("Expected separate product and fictional-support snapshots")
    expected_sources = {str(path.relative_to(ROOT)) for path in (ROOT / "content").rglob("*.md")}
    if set(provenance.get("demo_source_files", {})) != expected_sources:
        raise ValueError("Built content manifest does not match demo source files")
    for name, expected_digest in provenance["demo_source_files"].items():
        if hashlib.sha256((ROOT / name).read_bytes()).hexdigest() != expected_digest:
            raise ValueError(f"Demo source changed after build: {name}")
    if "{{" in landing or "<script src=" in landing:
        raise ValueError("Landing page contains an unfilled marker or external script")
    for name, allowed in (("about", "product/"), ("support", "support/")):
        page = (SITE / f"{name}.html").read_text(encoding="utf-8")
        embedded = re.search(r'<script id="atlas-data" type="application/json">(.*?)</script>', page, re.S)
        if not embedded:
            raise ValueError(f"Missing digest-identified snapshot in {name}.html")
        data = json.loads(embedded.group(1))
        if data.get("backend") is not False or data.get("snapshot_digest") != provenance["snapshots"][name]:
            raise ValueError(f"Invalid offline identity in {name}.html")
        if not data["sources"] or any(not source["path"].startswith(allowed) for source in data["sources"]):
            raise ValueError(f"Unexpected source corpus in {name}.html")
        if "id=\"demo-ribbon\"" not in page or "id=\"demo-he\"" not in page:
            raise ValueError(f"Missing bilingual demo UI in {name}.html")
        if "/home/" in page or "EVIDENCE_WORKSPACE_ROOT" in page:
            raise ValueError(f"Local path or build setting leaked into {name}.html")
    if release:
        if not provenance.get("product_files") or any(
            not re.fullmatch(r"[0-9a-f]{64}", value)
            for value in provenance["product_files"].values()
        ):
            raise ValueError("Release requires exact product source hashes")
        if not re.search(r'href="mailto:[^"#?]+\?subject=', landing):
            raise ValueError("Release requires a working email link")
        if not re.search(r'href="https://wa\.me/[1-9][0-9]{7,14}\?text=', landing):
            raise ValueError("Release requires a working WhatsApp link")
        if "if('false'!=='true')" in landing:
            raise ValueError("Contact links are still disabled")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--release", action="store_true")
    args = parser.parse_args()
    check(args.release)
    print("PASS: static site corpus separation, offline identity, and release boundary")
