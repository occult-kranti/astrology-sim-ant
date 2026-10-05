# Live Symbol Studio and MCP — October 5, 2026

## Baseline and product boundary

Owning repository: `occult-kranti/astrology-sim-ant`. Remote main `1f40e6972805e9a5ed59eedea8b49f043072806c` and recovered local `96a1ca0` have the identical tree `38e4631c28bc65c10307cf0457b72443f562d66f`. The local tree was clean. Work proceeds on `feat/live-studio-mcp-2026-10`; publication will preserve real remote ancestry. SkyLens is a separate, already published application.

The request is to understand and extend the actual Workbench, live sigils/charts, multiple practices, common auto-calculation/calibration, and MCP integration. The existing 116 HTML pages, 81 capability entries and substantial pure engines are the starting point. This release adds one focused Live Symbol Studio and a Pages MCP connection/catalogue page, corrects shared-input and method errors, and exposes bounded reusable calculations through MCP. It does not invent universal traditions or replace the existing calculators. The public frontend remains on GitHub Pages; a remote MCP process requires separate server hosting. Local calculations remain usable independently of that service.

## Panel and bounded passes

Independent AI engineering/research perspectives: architecture and calculation-state review; domain-method/source review; live graphics/product integration; UX/accessibility; skeptical QA/performance; lead moderation and MCP/backend. These are not observed user research or religious/professional endorsements.

1. Baseline assessment and source-backed decisions before implementation.
2. Implement, then challenge correctness, state recovery, privacy and calculation consistency; repair material findings.
3. Required tests, one batched responsive screenshot review and one repair confirmation, followed by authorized GitHub/Pages publication and actual backend verification where available.

## Decision and acceptance ledger

| ID / priority | Problem and expected behavior | Owner / affected modules | Implementation and acceptance | Status / evidence |
|---|---|---|---|---|
| B1 P0 | Recover repository truth without losing changes | Lead; repository/docs | Compare source tree with remote main, preserve ancestry and deep links | Complete; matching tree above, clean branch |
| C1 P0 | Pickers, saved state, visible fields and results disagree | Architecture; app/workbench, moment-picker, shared context | Restore atomically before first calculation; unique IDs; retain timezone/fold and method choices; empty optional birth allowed; partial/invalid inputs block stale exports | Implemented; shared-context and symbol/storage suites pass locally |
| C2 P0 | Vedic render/export use different radix or evaluation instant | Architecture; reading/vedic-panel/workbench | One explicit chart context and evaluation instant, correct selected house label, deterministic UI/export parity | Implemented; shared-context and symbol/storage suites pass locally |
| M1 P0 | UTC weekday and decomposed letters change method results | Domain; election, rasa, yantra | Reuse local sunrise-bounded ruler; NFC text handling; independent Tokyo/New York and Unicode fixtures | Implemented; 11 independent symbolic-method groups pass |
| G1 P0 | Unsupported sigil text silently disappears; exported colors depend on page CSS | Graphics; kamea, core/viz, app/state | Explicit accepted alphabet/normalization/rejections; shared pure SVG presentation; standalone SVG/PNG with exact input/method/source metadata | Implemented; shared-context and symbol/storage suites pass locally |
| S1 P1 | Live calculations and diagram tools are scattered | UX + architecture + graphics; new Studio page/app/core modules | Shared validated context; live/frozen time; bounded refresh independent of animation; visibility pause; method-specific inputs; chart/sigil/square/text alternatives; snapshots and exports | Implemented; six focused tasks, provenance exports, live/frozen/snapshots; final local browser gate passes; 15 focused groups +118 entry points |
| T1 P1 | Broad tool catalogue lacks task-first entry | UX; tools/workbench entry points | Search/filter existing capabilities by task/tradition with preserved direct links; method limitations near results | Implemented; task/tradition filters and shared navigation; batched mobile/desktop visual review and repair confirmation complete |
| I1 P1 | Existing browser function schemas are not MCP | Lead/backend; new server/tools/transports | Official-protocol initialize/list/call/resource behavior, shared engines, strict bounded inputs, safe errors, provenance; stdio and deployable stateless HTTP; no embedded secret or implicit data transfer | 11 allowlisted tools + official SDK adapters implemented; 6 pure groups pass; HTTP/stdio + source/bundled Worker tests pass; private Sites OAuth backend deployed, actual client connect pending |
| P1 P0 | Corrupt local JSON can break startup; service-worker cleanup affects sibling apps | Graphics storage + lead cache integration | Validate stored collections, preserve/recover records, scope cache removal to this project; meaningful regression fixtures | Implemented; storage recovery and 7 lifecycle groups pass |
| O1 P1 | Workbench eagerly loads heavy optional modules and repeats work | Architecture + QA; Workbench imports/context | Lazy optional assistant/renderers where justified; reuse chart context; no per-frame ephemerides or autosave history flooding; measure comparable before/after | Measured initial dependency graph86→57 modules,2.62→1.28MB; see dated verification, CPU no causal speedup claim |
| Q1 P0 | Current browser release checks omit Workbench and symbolic tools | QA; scripts/tests/browser workflow | Complete browser sweep plus focused main-input/Studio/MCP/export/recovery journeys; independent method cases; responsive/keyboard checks and cancellation | Integrated Node engine/static audit and final118-page browser sweep pass; responsive interactions and exports verified; see raw browser evidence |
| D1 P0 | Need real release evidence and usable backend connection | Lead; workflows/docs/README | Tested PR, rules-compliant merge, Pages success and exact live SHA; backend protocol smoke test and connection instructions; exact blocker if hosting unavailable | PR3 is the integration; backend deployment and transport verified. Frontend publication is gated by both CI jobs and post-deployment exact-SHA/Studio/MCP checks; live release.json is the canonical published commit |

## Accepted boundaries

- Reuse Astronomy Engine and existing sourced Western/Vedic/symbolic modules; no competing astrology engine or SVG framework.
- “Calibration” means explicit time, location, zodiac, house, ayanamsha and rendering/method conventions plus reference-case checks. It does not adjust astronomical positions until a desired interpretation appears.
- Show the difference between measured astronomical coordinates, traditional rules, editorial scoring and contemporary mathematical designs. No claims of magical effectiveness or guaranteed personal events.
- No authenticated server is implied by browser BYOK assistant settings. MCP connection/setup remains distinct and transparent; current birth records and notes are not silently uploaded.
- A contemporary geometric pattern may be labeled as such; a validated traditional mandala/Śrī Yantra, PDF export, arbitrary algebra, and every regional calendar require separate sources/dependencies and are not invented to fill this release.
- Physical-device, native screen-reader and actual external-client checks must be reported separately from mocks and protocol fixtures.

Research sources, measured snapshots and method contracts are recorded in the linked documents. README identifies the real client OAuth and physical-device checks. The private backend is deployed; the frontend release gate remains separately tracked.

## Implementation evidence

Local contributor commits: `006e6d3` domain methods, `04e2cc9` context/clock, `7dc041c` Studio/UI, `eef7a94` symbols/exports, `bd170eb` lifecycle/browser gates, and lead MCP/integration commits. Public ancestry is preserved by a connector-created commit on the recovered remote main tree, not by force-pushing recovered local history. [PR3](https://github.com/occult-kranti/astrology-sim-ant/pull/3) is the reviewable integration.

See [integration matrix](2026-10-05-integration-decisions.md), [symbol methods](2026-10-05-symbol-methods.md), [domain methods](2026-10-05-domain-methods.md), [verification/performance/handoff](2026-10-05-live-studio-verification.md) and [MCP connection guide](../mcp/README.md). Physical-device and actual client checks remain distinct from automated checks.
