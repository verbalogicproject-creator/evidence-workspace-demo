"""Contract tests for the public demo build."""

import json
import re
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import build as demo_build
from scripts.build import ROOT, build
from scripts.check_site import check


class DemoBuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.provenance = build()

    def test_separate_digest_identified_corpora(self):
        self.assertNotEqual(self.provenance["snapshots"]["about"], self.provenance["snapshots"]["support"])
        for name, prefix in (("about", "product/"), ("support", "support/")):
            page = (ROOT / "site" / f"{name}.html").read_text(encoding="utf-8")
            match = re.search(r'<script id="atlas-data" type="application/json">(.*?)</script>', page, re.S)
            self.assertIsNotNone(match)
            data = json.loads(match.group(1))
            self.assertFalse(data["backend"])
            self.assertEqual(data["snapshot_digest"], self.provenance["snapshots"][name])
            self.assertTrue(all(source["path"].startswith(prefix) for source in data["sources"]))

    def test_static_review_contract(self):
        check()
        landing = (ROOT / "site" / "index.html").read_text(encoding="utf-8")
        self.assertIn('data-lang="he"', landing)
        self.assertIn('id="lang-en"', landing)
        self.assertIn('href="about.html?view=ask', landing)
        self.assertNotIn("/home/", landing)

    def test_build_is_deterministic(self):
        before = {path.name: path.read_bytes() for path in (ROOT / "site").iterdir() if path.is_file()}
        build()
        after = {path.name: path.read_bytes() for path in (ROOT / "site").iterdir() if path.is_file()}
        self.assertEqual(before, after)

    def test_public_contact_validation(self):
        with tempfile.TemporaryDirectory() as temporary:
            location = Path(temporary)
            details = {"name_en": "Example", "name_he": "דוגמה", "email": "hello@example.org", "whatsapp_e164": "+972501234567"}
            (location / "contact.json").write_text(json.dumps(details), encoding="utf-8")
            with patch.object(demo_build, "ROOT", location):
                self.assertEqual(demo_build._contact(True), details)
                details["whatsapp_e164"] = "0501234567"
                (location / "contact.json").write_text(json.dumps(details), encoding="utf-8")
                with self.assertRaises(SystemExit):
                    demo_build._contact(True)


if __name__ == "__main__":
    unittest.main()
