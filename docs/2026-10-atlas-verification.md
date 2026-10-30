# Calendar atlas verification

Baseline: `0d115c9`. All five atlas rounds and six bounded final member acceptances are complete. This work is separate from the earlier ensemble release.

## Executed baseline

[The baseline receipt](evidence/atlas/baseline.json) contains actual Chromium observations, timestamps and unchanged hashes for the seven inspected source files. Four page/viewport cases were rendered: homepage 1440px, comparison 1920px, comparison 390px and calendar tools 320px. Five screenshots were inspected. No runtime errors, implicit external requests or whole-page overflow were observed in this sample.

## Candidate integration

The first real candidate run completed 322 assertions at 320/390/1440/1920 and inspected 44 downloaded artifacts. Runtime errors, missing resources and implicit external requests were zero. It is explicitly unfrozen because the personal core changed during execution. [R1 candidate receipt](evidence/atlas/round1-candidate/receipt.json). Six screenshots were visually inspected; a mobile SVG letterboxing issue was reported and corrected by its owner, with a bounding-box regression added for the next run.

The designated Round 2 candidate completed **394 checks and 52 downloaded artifacts** at 320/390/1440/1920. Selected JSON and copied links were inspected semantically, including all seven family views and explicit shared sky quantities. The mobile SVG was square; unknown birth time did not produce exact houses or returns. The 24-row solar-term inspector and association independence from scan bounds passed. Zero runtime errors, missing resources and implicit external requests were recorded. [R2 receipt](evidence/atlas/round2-candidate/receipt.json).

This run is explicitly unfrozen because only `mcp/toolkit.mjs` changed during execution. It is domain/UI acceptance, not the later frozen release gate. Driver SHA-256: `2e3e3433353a232bf14bf2ff7d96533c81817ccf9f7a250c8ffb9b03e99c4979`. Corrected mobile and desktop screenshots were visually inspected. Independent correction receipts are linked in the [panel ledger](2026-10-atlas-panel.md).

The Round 3 focused research phase completed **79 checks and 16 downloads** at 390/1440 with no source changes, runtime errors, missing resources or external requests. It compared actual ranked JSON/CSV with a complete brute-force export and checked event-reference lineage, inactive imported markup, birth-data omission and unavailable-signature recovery. [Receipt](evidence/atlas/round3-research/receipt.json). Its two screenshots were visually inspected; tall mobile table rows were recorded for the next visual round.

The separate [35-assertion statistical probe](evidence/atlas/round3-statistics.json) validates specified duplicate/overlap/paired-denominator examples, zero-control ratios, dependency grouping and Chinese field capability. The [25-check independent lifecycle receipt](evidence/atlas/personal-worker-r3.json) labels controlled stale-message/delayed-read probes separately from native worker execution. These are bounded computational findings, not outcome-model validation. The full Round 4 integration completed **612 checks and 85 downloads** on held, regenerated product sources, with zero changes/errors/missing resources/external requests. [Receipt](evidence/atlas/round4-integration/receipt.json). It adds actual 320/390/1440/1920 table scrolling and row-height assertions, cold-open desktop Calculate visibility, short-desktop keyboard cancellation, task anchors, 16px personal actions, optional return exports and visible historical time-zone qualifications. Seven current screenshots were inspected. Driver SHA-256: `2e077c67e6d89b46e10100c03729252e7a8a6616e11b91596675b88c1b8e1fb7`. The frozen Round 5 run passed **612 checks and 85 actual downloads** from 00:25:25 to 00:26:10 UTC on 2026-10-30. All **446 product files** and the driver match the accepted R4 hashes; no source changed during execution. Runtime errors, missing resources and implicit external requests remained zero. Seven final screenshots were inspected. [Final receipt](evidence/atlas/round5-final/receipt.json), [source binding](evidence/atlas/final-source-binding.json).

The binding covers the driver plus product index, service worker, manifest, assets, pages and MCP JS/JSON. The moderator separately owns repository-wide staged binding, broader inherited gates and publication. The receipt does not itself claim remote CI or deployment.

## Changed-feature verification contract

The new `scripts/browser-atlas.mjs` exercises the actual Pages-prefixed site with real DOM controls and downloaded artifact bytes. Its implemented phases cover atlas/family routes, all/selected/focused views, calculation-driven SVG, personal known/unknown-time states and private-data disclosure, search progress/cancellation/stale state, benchmark interpretation and source-qualified event/control results. Viewports are 1440/1920 and 320/390, plus keyboard checks and a half-width CSS-viewport reflow proxy for 200% zoom. The proxy is not a physical-browser zoom measurement. Core formula fixtures remain with the method owners; the browser driver does not duplicate the engine's implementation as an apparent independent proof.

Final evidence must bind the driver and product hashes, identify actual versus simulated clocks or controlled worker delays, record failures/corrections and inspect screenshots. No unimplemented phase or merely nonempty export is counted as passing. The candidate receipts above cover implemented phases. Additional challenges and final unchanged-source verification remain tied to their designated rounds.

## Limits

Browser/Node checks are not physical-device, screen-reader or human usability studies. A calculated geometry, shared calendar dependency, finite search match or selected event association does not validate astrology or establish causation. Unknown birth time, runtime calendar support, source-reading depth and unsupported traditions remain explicit. A local test does not imply that a remote model, account, MCP service or deployment was exercised.


## Moderator release gates — 30 October 2026

All **20 recorded local gate commands exited zero** on the final product, from 00:25:46 to 00:39:25 UTC. The [execution manifest](evidence/atlas/release/manifest.json) retains exact commands, times, exit codes and artifact hashes; its adjacent text logs and browser receipts are the actual outputs.

| Gate | Executed result |
|---|---|
| Engine, static audit and generators | Full engine passed; 129 HTML / 274 JavaScript files, zero audit problems; operation graph, gate and 58 specialist profiles stayed synchronized. |
| Historical ledger freshness | Current. C3 remains NOT EVALUABLE; the C1/C2 window retains its unverified-count qualification. This is not a newly verified curation census. |
| MCP | Nine toolkit groups and actual HTTP/stdio exchanges passed for the 15-tool local source. |
| Existing release journeys | All six isolated phases passed: 15 behavioral journeys and a 129-entry Pages-prefix sweep. |
| Observatory | 121 assertions and 384 route/viewport visits passed, with no errors or implicit external requests. |
| Studio and ensemble | 331 studio checks / 51 downloads and 288 ensemble checks / 33 downloads passed. |
| Required independent Puppeteer gate | 129 pages, zero page errors, valid shared chrome; reduced-motion, narrow and print passes completed. Nine structured descriptors executed with two inherited warnings; 89 prose descriptors retain page-load coverage only. |
| Pinned SkyLens | Matching adapter source and six fixtures; five session/AI-disclosure journeys passed against commit `2b2aa089009db3ddedc2256a7a5456b402b23962`. Providers and hardware permissions use declared test controls, not actual model or camera services. |

The moderator independently recomputed all 446 browser product hashes plus the driver after the gates and checks the Git index against them before committing. The [staged source binding](evidence/atlas/staged-source-binding.json) covers every changed staged file except itself, avoiding a circular digest. Final atlas numerical suites comprise 90 atlas assertions, 11 personal groups and 94 search checks; these are part of the full engine gate, not additional independent observations.

The local evidence does not assert that remote CI or production deployment ran. The exact pushed-commit Actions result is recorded on [draft PR #5](https://github.com/occult-kranti/astrology-sim-ant/pull/5). Production Pages and the hosted MCP service remain separate release paths.
