# Evidence Workspace Demo

A public, bilingual business-card app built from the real Evidence Workspace
Atlas snapshot/export code. Visitors can ask about the product and try a
fictional support desk. Each page searches a separate, digest-identified
source snapshot and shows cited excerpts, source locations, ranking hints, and
an explicit offline freshness limit. The 2D/3D source map remains available
after the question flow.

This is a **static demonstration**, not a hosted customer workspace. Its
responses are source excerpts to inspect, not complete verified answers. The
product-documents page cites the project's own descriptions; that is not
independent validation. The support procedures are fictional and have no
connection to Oz-Tal or any other organization. No outside-user outcome or
paid pilot has been established.

## Local build

The sibling `evidence-workspace` checkout supplies the real Atlas engine and
frontend. The demo repository owns its two explicit packs, approved content,
guided page, presentation overlay, tests, and generated static site. Python
3.12+, Node.js 22+, npm, and the product checkout's local dependencies are
needed to rebuild; the published pages need none of them at runtime.

```sh
python3 scripts/build.py
python3 scripts/check_site.py
python3 -m unittest discover -s tests -v
../evidence-workspace/.venv/bin/python tests/browser_smoke.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory site
```

Open `http://127.0.0.1:8000`. A different checkout location can be selected
with `EVIDENCE_WORKSPACE_ROOT`; the value is a local build setting and is not
written into the static site. `build.py` compiles the upstream TypeScript
frontend before exporting. Generated `site/` files are intentionally retained
for local review and eventual static publishing. `build-provenance.json`
records source digests and, only when the relevant product source files are
committed and clean, the product commit ID.

## What a visitor sees

The Hebrew-first landing page offers three entrances: ask what the product
does, try a question on fictional support procedures, and inspect a real
product limit. English is available throughout the visitor journey. Suggested
questions prefill and run the same free-text source search a visitor can use
for their own wording. The top passage is prominent; other candidates can be
expanded. The map is optional, with a 2D/list fallback.

The pages are generated from two packs:

- `packs/about.json` selects only `content/product/` in Hebrew and English.
- `packs/support.json` selects only `content/support/` in Hebrew and English.

The standalone pages embed their selected text. They do not recheck original
files after export, send typed questions to a product server, call a model,
or accept customer documents. Static hosting still receives ordinary page
requests. Email and WhatsApp buttons open external services only when clicked.

## Contact details and publication gate

Copy `contact.example.json` to ignored `contact.json`, then fill the display
name, public email address, and WhatsApp number in international `+...` form.
Without both contact methods, the local preview visibly disables them. The
details will be public in the built HTML, so review them before sharing.

```sh
python3 scripts/build.py --release
python3 scripts/check_site.py --release
```

Release checks require exact source hashes and valid public contact links. The
product checkout presently has no commit, so `product_revision` is null while
the individual build-input digests still identify the bytes used. The
prebuilt static artifact can be reviewed and shared; a reproducible remote
build should wait for an immutable product revision. Rebuild `site/` after
the product revision or approved content changes. Review the embedded source
text and contact details before publication.

`.github/workflows/pages.yml` is a **manual** GitHub Pages publication
workflow. It checks the prebuilt `site/` artifact and uploads only those static
files. Creating a remote repository, committing, pushing, enabling Pages, or
running that workflow requires separate explicit authorization. The expected
remote slug is `verbalogicproject-creator/evidence-workspace-demo`; it has not
been created by this work.

## Customer test

The first business measure is whether an unfamiliar prospect can explain the
workflow, inspect a citation, notice one limit, and name a recurring question
worth testing. Three outside usability sessions and one real problem
conversation are next; the demo's internal tests are not customer evidence.
