# Evidence Workspace Demo agent instructions

This is the separate public demonstration repository. Its source packs and
generated pages may contain only approved product facts and fictional support
procedures. Never import private customer material, credentials, model files,
or device paths into the static site. The sibling `evidence-workspace` checkout
is the build-time Atlas engine; do not copy its retrieval code into this repo.

The public Ask surface returns cited source excerpts, not verified or complete
answers. Product documentation citing itself is inspectable but not
independently validated. The offline export cannot check current source
freshness. Never present the fictional support workflow as Oz-Tal's policy.

For changes, run `python3 scripts/build.py`, `python3 scripts/check_site.py`,
`python3 -m unittest discover -s tests -v`, and the optional Playwright browser
check documented in `README.md` for UI changes. Before a public release, run
both commands with `--release`, review the embedded text and public contact
details, and obtain fresh explicit authorization for the exact commit, push,
repository creation, and deployment effects.
