# Live Symbol Studio and MCP — October 5, 2026

## Baseline and product boundary

Owning repository: `occult-kranti/astrology-sim-ant`. Remote main `1f40e6972805e9a5ed59eedea8b49f043072806c` and recovered local `96a1ca0` have the identical tree `38e4631c28bc65c10307cf0457b72443f562d66f`. The local tree was clean. Work proceeds on `feat/live-studio-mcp-2026-10`; publication will preserve real remote ancestry. SkyLens is a separate, already published application.

The request is to understand and extend the actual Workbench, live sigils/charts, multiple practices, common auto-calculation/calibration, and MCP integration. The existing 116 HTML pages, 81 capability entries and substantial pure engines are the starting point. This release adds one focused Live Symbol Studio, corrects shared-input and method errors, and exposes bounded reusable calculations through MCP. It does not invent universal traditions or replace the existing calculators. The public frontend remains on GitHub Pages; a remote MCP process requires separate server hosting. Local calculations remain usable independently of that service.

## Panel and bounded passes

Independent AI engineering/research perspectives: architecture and calculation-state review; domain-method/source review; live graphics/product integration; UX/accessibility; skeptical QA/performance; lead moderation and MCP/backend. These are not observed user research or religious/professional endorsements.

1. Baseline assessment and source-backed decisions before implementation.
2. Implement, then challenge correctness, state recovery, privacy and calculation consistency; repair material findings.
3. Required tests, one batched responsive screenshot review and one repair confirmation, followed by authorized GitHub/Pages publication and actual backend verification where available.

## Decision and acceptance ledger

| ID / priority | Problem and expected behavior | Owner / affected modules | Implementation and acceptance | Status / evidence |
|---|---|---|---|---|
| B1 P0 | Recover repository truth without losing changes | Lead; repository/docs | Compare source tree with remote main, preserve ancestry and deep links | Complete; matching tree above, clean branch |
| C1 P0 | Pickers, saved state, visible fields and results disagree | Architecture; app/workbench, moment-picker, shared context | Restore atomically before first calculation; unique IDs; retain timezone/fold and method choices; empty optional birth allowed; partial/invalid inputs block stale exports | Panel evidence collected; implementation assigned |
| C2 P0 | Vedic render/export use different radix or evaluation instant | Architecture; reading/vedic-panel/workbench | One explicit chart context and evaluation instant, correct selected house label, deterministic UI/export parity | Panel evidence collected; implementation assigned |
| M1 P0 | UTC weekday and decomposed letters change method results | Domain; election, rasa, yantra | Reuse local sunrise-bounded ruler; NFC text handling; independent Tokyo/New York and Unicode fixtures | Reproduced by domain panel; implementation assigned |
| G1 P0 | Unsupported sigil text silently disappears; exported colors depend on page CSS | Graphics; kamea, core/viz, app/state | Explicit accepted alphabet/normalization/rejections; shared pure SVG presentation; standalone SVG/PNG with exact input/method/source metadata | Panel evidence collected; implementation assigned |
| S1 P1 | Live calculations and diagram tools are scattered | UX + architecture + graphics; new Studio page/app/core modules | Shared validated context; live/frozen time; bounded refresh independent of animation; visibility pause; method-specific inputs; chart/sigil/square/text alternatives; snapshots and exports | Chosen: one reusable Studio, not duplicate calculators |
| T1 P1 | Broad tool catalogue lacks task-first entry | UX; tools/workbench entry points | Search/filter existing capabilities by task/tradition with preserved direct links; method limitations near results | Design: existing study desk, additive focused workspace |
| I1 P1 | Existing browser function schemas are not MCP | Lead/backend; new server/tools/transports | Official-protocol initialize/list/call/resource behavior, shared engines, strict bounded inputs, safe errors, provenance; stdio and deployable stateless HTTP; no embedded secret or implicit data transfer | Architecture/hosting research in progress |
| P1 P0 | Corrupt local JSON can break startup; service-worker cleanup affects sibling apps | Graphics storage + lead cache integration | Validate stored collections, preserve/recover records, scope cache removal to this project; meaningful regression fixtures | Reproduced by QA panel; implementation assigned |
| O1 P1 | Workbench eagerly loads heavy optional modules and repeats work | Architecture + QA; Workbench imports/context | Lazy optional assistant/renderers where justified; reuse chart context; no per-frame ephemerides or autosave history flooding; measure comparable before/after | Baseline module graph and CPU measurements captured |
| Q1 P0 | Current browser release checks omit Workbench and symbolic tools | QA; scripts/tests/browser workflow | Complete browser sweep plus focused main-input/Studio/MCP/export/recovery journeys; independent method cases; responsive/keyboard checks and cancellation | Baseline engine and static audit pass; new gates required |
| D1 P0 | Need real release evidence and usable backend connection | Lead; workflows/docs/README | Tested PR, rules-compliant merge, Pages success and exact live SHA; backend protocol smoke test and connection instructions; exact blocker if hosting unavailable | Pending implementation |

## Accepted boundaries

- Reuse Astronomy Engine and existing sourced Western/Vedic/symbolic modules; no competing astrology engine or SVG framework.
- “Calibration” means explicit time, location, zodiac, house, ayanamsha and rendering/method conventions plus reference-case checks. It does not adjust astronomical positions until a desired interpretation appears.
- Show the difference between measured astronomical coordinates, traditional rules, editorial scoring and contemporary mathematical designs. No claims of magical effectiveness or guaranteed personal events.
- No authenticated server is implied by browser BYOK assistant settings. MCP connection/setup remains distinct and transparent; current birth records and notes are not silently uploaded.
- A contemporary geometric pattern may be labeled as such; a validated traditional mandala/Śrī Yantra, PDF export, arbitrary algebra, and every regional calendar require separate sources/dependencies and are not invented to fill this release.
- Physical-device, native screen-reader and actual external-client checks must be reported separately from mocks and protocol fixtures.

Research sources, actual measurements, method contracts and release results will be added as the bounded work proceeds. README will identify any real account/hosting/client action rather than presenting an undeployed endpoint as live.
