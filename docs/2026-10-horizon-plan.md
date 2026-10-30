# Event horizon through 1 January 2031

Baseline: published main `3f76845f2d516d7a4bd507afa0508e6929c831e2`. Work branch: `feat/event-horizon-2031`. The user authorizes research, implementation, parallel agent review, stress testing, push and production publication. Earlier review-branch-only restrictions describe prior tasks, not this release.

## Question and initial coverage

Compute every civil date from **2026-10-30 through 2031-01-01 inclusive**. Default public cases are London, Delhi and New York, each at explicit local noon. Each case has its own IANA clock resolution and observer. Dates, clocks and observers remain editable within the supported horizon. Compare separate, declared purpose profiles rather than a universal luck or danger score. Every profile exposes its rule contributions, dependencies, missingness and tie policy.

The new focused `pages/event-horizon.html` surface will combine a day slider, purpose/case comparison, best-to-worst ordering under that profile, exact astronomical events where a solver exists, and source-qualified religious observances. Existing search, atlas, birth tools and routes remain available. No civil calendar, religion, eclipse or eschatological text receives an invented favorable/caution verdict. Unscheduled eschatologies belong in an attributed reference layer, not fabricated calendar events.

“All” is an inventory and a coverage question: enumerate supported astronomical searches, all 13 existing civil-calendar conversions, named historical rule engines, selected observance traditions and every registered tool's batchability. Tools requiring a birth, explicit oracle draw, chosen question or another missing input cannot be silently brute-forced. Regional festival variants, lunar sightings, unavailable methods and unvalidated fixtures stay visible. The catalogue is extensible and must not claim exhaustive coverage of every religion or astrological school.

## Implementation interfaces and ownership

| Owner | Exclusive primary surfaces | Contract |
| --- | --- | --- |
| Astronomy agent | `core/horizon-astronomy.js`, its numerical tests and research report | `buildHorizonAstronomy({startUTC,endUTC}, hooks)` returns `{events,coverage,sources,stats,limitations}`; start inclusive/end exclusive; rows have stable id, kind, title, `startUTC`, precision, bodies, sourceIds, method and limits. Reuse bundled astronomy engines. |
| Calendar/observance agent | `core/horizon-observances.js`, `core/data/horizon-observances.js`, tests and sources | `observancesForDate({date,calendars,observer})` returns date-only observance rows with stable ids, family/variant, boundary, region, sourceIds and status. Calendars are canonical `compareMoment().calendars`. Export source/coverage catalogue separately. |
| Source/eschatology agent | `core/data/horizon-traditions.js`, source receipts/report | Named tradition coverage and selected attributed eschatology summaries with exact locators, rights, access status and no invented dates. Coordinate common family/source ids with observance owner. |
| Ranking/tool agent | `core/horizon-ranking.js`, `mcp/horizon-adapters.mjs`, focused tests/report | `evaluateHorizonPurposes({comparison,guidance})` returns named profile results with contributions, observed/total, missing and dependency groups. Export `HORIZON_PURPOSES`; no universal forecast or missing-is-good rule. Tool coverage uses actual schemas. |
| UI agent | `pages/event-horizon.html`, `app/event-horizon.js`, `css/event-horizon.css`, design notes | Functional timeline, case/purpose filters, transparent rankings, evidence drawer, exports, progress/cancel/stale handling and responsive keyboard use. Root supplies orchestration/worker and reviewed static-data loader contract. |
| QA agent | `scripts/browser-horizon.mjs`, independent review/stress checks and evidence | Challenge actual results, baseline versus optimized equivalence, date boundaries, missingness, worker lifecycle, artifacts, full-horizon performance and public release. |
| Root | `core/event-horizon.js`, worker, build/stress scripts, generated artifact, shared registry/nav/MCP integration, release | Own shared interfaces; coordinate sources, canonical sampling, precomputed-case manifest, bounded costs, cross-review and publication. |

Module paths are relative to `assets/js/` unless a prefix is shown. Do not edit another owner's files without coordination. No agents commit independently. Keep at most two Chromium processes active globally.

## Three substantive review rounds

1. Inspect actual engines and previous UI; research primary/official sources; implement a first integrated candidate with explicit source and coverage boundaries.
2. Cross-review the changed artifact and full-range results; fix semantic, performance, ranking, source and interaction defects. Compare complete meaningful outputs from brute and optimized modes on the same grid, including unavailable dates. Record actual timings and sizes.
3. Hold the corrected source, run numerical and full-horizon stress checks plus browser journeys and inherited release gates, inspect actual exports, obtain six scoped acceptances, push and publish through the main Pages workflow. Verify live release identity, source bytes and desktop/mobile interactions. Preserve real failed attempts and limitations.

## Release requirements

No silent partial range or result cap. No arbitrary oracle inputs or implicit personal data. Different local-noon cases are different instants; geographic zone correctness remains unverified. Daily samples do not classify whole days; event roots and optional hourly drill-down have separate precision. A faster identical algorithm is not independent predictive validation. Fresh online source receipts distinguish a retrieved page from a checked factual passage. Stress evidence must include actual dates/cases/profile counts, timing, bytes, browser/Node versions, source hashes and cancellation/recovery.

This is six independent AI-agent perspectives with an integration moderator, not human religious authority or participant research.
