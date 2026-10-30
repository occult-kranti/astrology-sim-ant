# Chart relationships — verification

Baseline: published `bf27046dd646ac1f7cc25db8770e8dd00ecbb0de`. Branch: `feat/chart-relationships`. Evidence is retained under `/workspace/setup-validation/chart-relationships/`; these local workspace paths are not published download URLs.

## New semantics and browser acceptance

`node scripts/chart-relationships-test.mjs` passes **13 grouped checks / 180 synthetic cases**. Coverage includes the five geometric angles, exact/inside/boundary/outside allowances, 0°/360° wrapping, reversal, full-turn rotation, phase, strict context binding, bounded inputs, safe sources, no input mutation and actual canonical casts. Independent source review separately recorded 19 canonical checks, ten adapter checks and strict boundary follow-ups. Those counts are separate suites, not additive claims of exhaustive coverage.

The full frozen `scripts/browser-chart-relationships.mjs` run passes **325 checks across eleven journeys**, with **15 actual downloads and 22 screenshots**. It covers 320/390/1440/1920px fixtures, pointer/keyboard/touch emulation, 200% CSS zoom, forced colors, empty/unavailable/destroyed states, long/inert source strings, both endpoint and connector coordinates, directed arrows, stable ring colors, exact displayed instant, paired SVG exports, unchanged canonical JSON, overlay-on date recasting and stale-control handling. It visits the atlas, Western family, Timeline tropical/sidereal, Newton and eschatology source charts.

The 200-transition presentation fixture holds at most eight rendered list rows, preserves its held frame and starts no fetches or workers. Its measured 34.8ms is one Chromium/container observation, not a general performance promise. All 541 source/driver manifest entries match before/after and at root audit. Root directly inspected all 22 PNGs and independently checked every compressed and expanded download hash and JSON/SVG parse.

| Evidence | SHA-256 |
| --- | --- |
| `qa-held-1/receipt.json` | `d4c7612bd428c753d228f6cf224db3e32be3beef45af2347735952368e6d7cc2` |
| `qa-held-1/source-before.json` | `3eda12c0a8d716ace6a4f53115da6838b39b62792a386b1b58c0b24ee7a0b551` |

The receipt's canonical compact-map digest is `8562d8bddfb15d9052d7470ad96a870e3da4b25353684a34b1c4a040d880289b`; this differs from the pretty-printed file's byte hash by serialization, not source content. `qa-held-1/root-independent-audit.json` records the independent asset/download checks.

## Broader gates

The full engine suite passes **733 assertions**. Static audit reports **134 HTML / 324 JavaScript files, zero problems**. All nine required generator `--check` commands pass. The round ledger is current; its inherited C3 curation census remains **not evaluable**, rather than silently passing. Canonical numerical modules, previous scientific datasets and export serializers are unchanged.

The unchanged inherited sky driver passes **3,520 checks** and the unchanged date-navigation driver passes **517 checks**, with no declared source/driver drift. The date suite retains ten actual download bodies, independently verified. The legacy sky suite records 307 download metadata entries without retaining those bodies; they cannot be retrospectively byte-verified. The final all-page Chromium sweep passes **134 pages / zero errors**, with two inherited descriptor warnings. Its 543-file held manifest is unchanged. The UI and QA roles directly reviewed all seventeen inherited sky PNGs and twenty-six date-navigation PNGs; all differ from the old production baseline, so none received hash-equality review reuse. The final required gates are recorded in `local-held-2/root-gate-receipt.json`; the earlier `local-held-1` run overlapped the demonstrated mobile CSS correction and is retained as development evidence. The new numerical child gate is registered in `engine-test.mjs`, and the bounded relationship browser gate is added to Pages alongside every inherited workflow gate.

## Retained failures and scope

Development receipts retain the narrow long-title overflow, the mobile host-CSS specificity conflict and the forced-colors test's missing keyboard modality. Independent review also corrected allowance widening, callback teardown, stale alignment binding and Escape-triggered preview restoration. Page tests were strengthened for actual connector endpoints and active selection before invalidation. See the [three-round ledger](2026-10-chart-relationships-panel.md).

These are bounded model-agent and automated-browser checks. They do not establish physical-phone behavior, a screen-reader certification, human usability results, fresh complete-book collation or predictive validity. Country sensitivity remains explicitly cusp-only. No broader calendar/tradition method becomes supported merely by receiving a color.

## Publication state

The configured cloud GitHub credential initially returned HTTP 401. The connection recovered before release and the tested feature branch was pushed successfully. No secret was printed or requested in chat. Local acceptance and a pushed branch do not establish a live deployment. External fetch/audit and seven-context live verification drivers are prepared; the pull request and actual release receipts record subsequent exact-head CI, Pages publication and live verification.
