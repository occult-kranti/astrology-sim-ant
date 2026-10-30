# Ensemble improvement verification

Baseline: `3be3d46`, branch `feat/mobile-calendar-observatory`. This document reports this six-member/three-round improvement pass, not a reuse of the previous release's four rounds.

## Executed baseline

The standards page was rendered in Chromium at 320 px with zero runtime errors and no whole-page horizontal overflow. A real disagreement was reproduced between its “Check these inputs” acceptance and the canonical engine's date range. The baseline source hashes and actual statuses are in [the receipt](evidence/ensemble/baseline-standards.json).

## Executed integration verification

The new `scripts/browser-ensemble.mjs` serves the real project below the GitHub Pages prefix and blocks implicit external requests. All five workflow phases are implemented. The corrected round 2 run passed 271 checks at 320/390/1365 px, with 428 product file hashes unchanged during execution and no runtime errors, missing resources or implicit external requests. [Round2 receipt](evidence/ensemble/round2-corrected/receipt.json).

The integration checks cover canonical standards validation and recovery; source-linked numeric dependencies and JSON export; bounded recipe import, exact geometry replay, SVG provenance and real PNG pixels; independent AI disclosure controls; acknowledged two-event samples, units, date range and stale observer state. A browser-clock advance executes the homepage's minute timer and confirms that an open inspector retains keyboard focus. Native disclosure and consent controls are exercised by keyboard. Download bytes are hashed and their semantics inspected; a nonempty file alone is not acceptance.

The 390 px screenshots were inspected for readable controls, visible source qualifications, recipe provenance and actual table layout. Two confirmed R2 interaction bugs were fixed rather than bypassed: a rotated arrow's large hitbox intercepted the following summary, and automatic inspector refresh dropped keyboard focus. Pair tables gained overflow-only hints and named keyboard scroll regions; a targeted 48-check run confirmed actual Right-arrow scrolling after correcting an inherited table CSS interaction. [Event refinement receipt](evidence/ensemble/round2-event-scroll/receipt.json). Details and the separate AI copy correction are in the [three-round panel ledger](2026-10-ensemble-panel.md).

After the explicit R3 product freeze, the complete final driver passed **288 checks**, with **33 downloaded artifacts** and five inspected 390 px screenshots. The run covered 320/390/1365 px in Chromium 154.0.8037.57, 2026-10-29T23:12:06–23:12:28Z. All 428 product files and the driver itself were unchanged. Runtime/console errors, missing local resources and implicit external requests were all zero. [Final receipt](evidence/ensemble/round3-final/receipt.json).

| Bound artifact | SHA256 |
|---|---|
| `scripts/browser-ensemble.mjs` | `d6ef6eed3c280b8dd4c717af050a8d64c3f9cd00c864284421e5ab3898468136` |
| Sorted 428-file product manifest | `4f9e109fa397849799656a1969ca8f68875ea55bad1f16d574ad370bc15fbbbd` |
| Standards HTML | `5914a644448c99a1fbd92f9221d223086ca1a272dd9c5c90d1a95d6548a52258` |
| Standards app | `8619fff3ff374048186b7c172ff29eba8632b2239e5c41ff22dd8db4b2e9ea65` |
| Standards CSS | `3a36eb7691ed3993d1e431f9d774640816f22573568a9a1a30b9de504e1af871` |

Final screenshots: [standards](evidence/ensemble/round3-final/standards-390.png), [calculation dependencies](evidence/ensemble/round3-final/connections-390.png), [recipe replay](evidence/ensemble/round3-final/recipe-390.png), [AI choices](evidence/ensemble/round3-final/ai-rules-390.png), [event comparison](evidence/ensemble/round3-final/event-pair-390.png). The event screenshot retains the keyboard-scrolled table state; contained table overflow is intentional, while whole-page overflow is checked separately.

All six explicit R3 member dispositions and their actual tests are recorded in the panel ledger. Owner calculations, source fixtures and focused protocol checks are separate from the independent UI workflows.

## Final repository gates

Root ran the inherited gates against the same frozen product candidate with Node24.19.0 and Chromium154.0.8037.57. [Gate logs and receipts](evidence/ensemble/repository-gates/) are retained separately from panel and source-reading evidence.

| Gate | Actual result |
|---|---|
| Full engine and registered module suites | All passed, including the new comparison-evidence suite and existing calendar, guidance, recipe, standards, event and MCP suites |
| Static link/import audit |122 HTML and266 JS files; zero problems |
| Generators | Opgraph, decision gate,58 specialist profiles and source MCP catalogue match authored inputs |
| Historical round ledger | Current; C1/C2 arithmetic passes. C3 remains NOT EVALUABLE; historical claim counts remain unverified |
| Puppeteer repository gate |122 pages; zero page errors. Nine structured descriptors executed with two historical warnings (missing dial target and old recents schema);89 prose descriptors have page-load coverage only |
| Isolated release phases | All six phases passed:15 behavioral journeys plus122 HTML entries under the Pages prefix; actual export, storage, invalid-input, assistant and service-worker checks retained |
| Full observatory suite |121 checks and363 page/viewport visits (121 application routes × three widths); zero errors/missing/external requests; product unchanged |
| Prior studio expansion |331 checks passed at320/390/1365; source-qualified sigils, day/hour rules, standards and events retained |
| New ensemble integration |288 checks,33 inspected downloads;428 product files and final driver unchanged |
| Official MCP transports | HTTP and child-process stdio initialization/list/call/resource and authentication/error bounds pass; current source catalogue has14 tools |
| Pinned SkyLens integration | Exact fixture commit `2b2aa089009db3ddedc2256a7a5456b402b23962`; adapter parity and six fixtures match; five browser session/AI journeys pass |

The root independently compared every frozen product hash and the final browser driver with the final receipt, then checked the staged blobs. [Delivery source binding](evidence/ensemble/delivery-source-binding.json) binds the staged changes and gate evidence, excluding itself to avoid a hash cycle. The current remote commit and independent GitHub Actions result are recorded on [draft PR #5](https://github.com/occult-kranti/astrology-sim-ant/pull/5). Its workflow runs the new suite and retains main-only deployment; a review-branch run does not publish production or update the hosted MCP backend.

## Limits

These are Node/browser and AI-agent reviews, not human usability research, physical-device or screen-reader certification, universal calendar authority, empirical astrology validation, full-book reading, authenticated hosted-model inference or production deployment. Source access, selected fixtures, methods and reading depth remain explicit in their own ledgers.
