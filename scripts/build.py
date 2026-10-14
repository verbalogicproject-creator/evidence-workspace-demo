"""Build the public, source-backed static demonstration from Evidence Workspace."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PRODUCT = Path(os.environ.get("EVIDENCE_WORKSPACE_ROOT", ROOT.parent / "evidence-workspace")).resolve()
ATLAS = PRODUCT / "packages" / "atlas-workspace"
sys.path.insert(0, str(ATLAS / "src"))


def _digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _contact(release: bool) -> dict[str, str]:
    path = ROOT / "contact.json"
    if not path.exists():
        if release:
            raise SystemExit("Release build needs contact.json with public email and WhatsApp number")
        return json.loads((ROOT / "contact.example.json").read_text(encoding="utf-8"))
    contact = json.loads(path.read_text(encoding="utf-8"))
    required = ("name_en", "name_he", "email", "whatsapp_e164")
    if any(not isinstance(contact.get(key), str) for key in required):
        raise SystemExit("contact.json needs name_en, name_he, email, whatsapp_e164 strings")
    if release and (not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", contact["email"])
                    or not re.fullmatch(r"\+[1-9][0-9]{7,14}", contact["whatsapp_e164"])):
        raise SystemExit("Release build needs a valid email and E.164 WhatsApp number")
    return contact


def build(release: bool = False) -> dict:
    if not (ATLAS / "src" / "atlas_workspace" / "core.py").is_file():
        raise SystemExit("Evidence Workspace source is missing; set EVIDENCE_WORKSPACE_ROOT")
    frontend = ATLAS / "frontend"
    subprocess.run(["npm", "--prefix", str(ATLAS), "run", "build"], check=True, capture_output=True)
    if not (frontend / "dist" / "app.js").is_file():
        raise SystemExit("Build the product frontend first: npm --prefix packages/atlas-workspace run build")
    from atlas_workspace.core import build_snapshot, load_pack, verify_snapshot
    from atlas_workspace.storage import render

    contact = _contact(release)
    site = ROOT / "site"
    site.mkdir(exist_ok=True)
    snapshots = {}
    for name in ("about", "support"):
        snapshot = build_snapshot(ROOT / "content", load_pack(ROOT / "packs" / f"{name}.json"))
        verify_snapshot(snapshot)
        document = render(snapshot, frontend)
        overlay = (ROOT / "scripts" / "workspace-overlay.js").read_text(encoding="utf-8")
        decoration = (
            '<style>.demo-ribbon{position:relative;z-index:30;display:flex;gap:1rem;align-items:center;justify-content:space-between;padding:.6rem 1rem;background:#101c28;color:#fff;font:600 14px system-ui}.demo-ribbon a{color:#98e8d8}.demo-ribbon button{background:transparent;color:#fff;border:1px solid #6f8c9b;border-radius:.5rem;padding:.25rem .6rem;cursor:pointer}.demo-ribbon button[aria-pressed=true]{border-color:#98e8d8;color:#98e8d8}.demo-ribbon .fiction{color:#ffd99a}</style>'
            f'<div class="demo-ribbon" id="demo-ribbon" data-corpus="{name}">'
            '<a href="index.html" id="demo-back">← חזרה להדגמה</a>'
            '<span id="demo-corpus-label"></span>'
            '<span><button type="button" id="demo-he" aria-pressed="true">עברית</button> '
            '<button type="button" id="demo-en" aria-pressed="false">English</button></span></div>'
        )
        document = document.replace('<body>', '<body>' + decoration, 1)
        document = document.replace('</body>', '<script>' + overlay.replace('</script', '<\\/script') + '</script></body>', 1)
        (site / f"{name}.html").write_text(document, encoding="utf-8")
        snapshots[name] = snapshot["snapshot_digest"]

    landing = (ROOT / "scripts" / "landing.html").read_text(encoding="utf-8")
    email = contact["email"]
    phone = contact["whatsapp_e164"]
    def email_link(subject: str, body: str) -> str:
        return "mailto:" + quote(email) + "?subject=" + quote(subject) + "&body=" + quote(body) if email else "#contact"

    def whatsapp_link(message: str) -> str:
        return "https://wa.me/" + phone.removeprefix("+") + "?text=" + quote(message) if phone else "#contact"

    values = {
        "{{NAME_EN}}": html.escape(contact["name_en"]),
        "{{NAME_HE}}": html.escape(contact["name_he"]),
        "{{EMAIL_URL_HE}}": html.escape(email_link("Evidence Workspace — שיחה קצרה", "שלום, ראיתי את ההדגמה. אשמח לשיחה של 15 דקות על שאלה חוזרת בצוות שלנו."), quote=True),
        "{{EMAIL_URL_EN}}": html.escape(email_link("Evidence Workspace — short conversation", "Hello, I saw the Evidence Workspace demo. Could we discuss a recurring team question for 15 minutes?"), quote=True),
        "{{WHATSAPP_URL_HE}}": html.escape(whatsapp_link("שלום, ראיתי את ההדגמה של Evidence Workspace. אפשר לדבר 15 דקות על שאלה חוזרת בצוות?"), quote=True),
        "{{WHATSAPP_URL_EN}}": html.escape(whatsapp_link("Hello, I saw the Evidence Workspace demo. Could we discuss a recurring team question for 15 minutes?"), quote=True),
        "{{CONTACT_READY}}": "true" if email and phone else "false",
    }
    for key, value in values.items():
        landing = landing.replace(key, value)
    if "{{" in landing:
        raise SystemExit("Unfilled landing-page placeholder")
    (site / "index.html").write_text(landing, encoding="utf-8")
    (site / ".nojekyll").write_text("", encoding="utf-8")

    product_files = [
        ATLAS / "src" / "atlas_workspace" / "core.py",
        ATLAS / "src" / "atlas_workspace" / "storage.py",
        frontend / "app.ts", frontend / "shell.html", frontend / "style.css",
        frontend / "dist" / "app.js", ATLAS / "package-lock.json",
    ]
    revision = subprocess.run(
        ["git", "-C", str(PRODUCT), "rev-parse", "HEAD"],
        capture_output=True, text=True, check=False,
    )
    source_files = [path for path in product_files if path != frontend / "dist" / "app.js"]
    status = subprocess.run(
        ["git", "-C", str(PRODUCT), "status", "--porcelain", "--untracked-files=all", "--",
         *(str(path.relative_to(PRODUCT)) for path in source_files)],
        capture_output=True, text=True, check=False,
    )
    clean_revision = revision.stdout.strip() if revision.returncode == 0 and status.returncode == 0 and not status.stdout.strip() else None
    provenance = {
        "schema": "evidence-workspace-demo-build/1.0",
        "product_revision": clean_revision,
        "product_files": {str(path.relative_to(PRODUCT)): _digest(path) for path in product_files},
        "snapshots": snapshots,
        "demo_source_files": {str(path.relative_to(ROOT)): _digest(path) for path in sorted((ROOT / "content").rglob("*.md"))},
    }
    (site / "build-provenance.json").write_text(
        json.dumps(provenance, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8"
    )
    return provenance


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--release", action="store_true", help="Require public contact details")
    args = parser.parse_args()
    print(json.dumps(build(args.release)["snapshots"], indent=2))
