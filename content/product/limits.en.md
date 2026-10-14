# Current limits and data boundaries

## Is this a verified answer engine?

No. The public offline demo searches a saved source snapshot and presents candidate excerpts. An excerpt may be partial or irrelevant. Its citation makes it inspectable; it does not prove the source claim is true. When no passage matches, the app says no supporting passage was found; when passages match, a reader still needs to judge whether they answer the question.

## Does the demo check whether a source changed today?

No. A standalone HTML export contains the selected source text as it was when exported. It cannot check the original files afterward. The separate local connected development service can check selected file digests when answering; that service is not this public site.

## What leaves the browser?

The public demo does not send typed questions to an Evidence Workspace server or model API. The static hosting provider still receives ordinary page requests. Choosing an email or WhatsApp contact link opens that external service. All source text embedded in a public page must be approved for public release.

## Can each employee see only their permitted documents?

The current local service grants an authorized viewer access to the selected snapshot's records; it does not enforce document-by-document authorization. Private customer documents must not be loaded into this public demo. Customer deployment needs a reviewed access and operating design.

## What if two procedures disagree?

A declared contradiction requires human review. The public offline search may surface both passages, but it does not determine which procedure is current or correct. A person must resolve the disagreement using approved source and ownership rules.
