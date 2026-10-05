# Live Symbol Studio — verification and handoff

Date: October 5, 2026. Repository: `occult-kranti/astrology-sim-ant`; candidate [PR3](https://github.com/occult-kranti/astrology-sim-ant/pull/3). This document records evidence, not assumptions about earlier plans.

## What changed

- Additive Studio: Western/Vedic diagrams, sourced kamea/navagraha squares, Hebrew gematria and Sanskrit numeral study, explicit live/frozen state and method controls, snapshots and SVG/PNG/JSON provenance. The tool directory supports task/tradition entry while preserving existing links.
- Common context: visible controls, URL restore, birth radix, reference instant and exported metadata agree; incomplete/invalid input blocks stale exports. House systems and polar limitations remain visible. Workbench refreshes at5s; focused Studio live context at60s; diagram construction playback does not recompute ephemerides.
- Source corrections: local sunrise weekday, retained civil offset/date-line behavior, Unicode normalization, unsupported-alphabet rejection, bounded scans, disclosed approximate Vedic strength and editorial election scores.
- Lifecycle: cancelled assistant requests cannot write late results; scoped service-worker cleanup cannot remove sibling project caches; malformed saved collections recover valid records.
- MCP:11 strict allowlisted tools, methods resource, official SDK2.3.1 server /2.1.1 Node adapter, stdio and stateless HTTP; server dependencies excluded from Pages.

## Measured performance

Same Linux Node24.19.0, Xeon8573C container. Static import traversal begins at the page's application module; dynamic imports, CSS/fonts, HTTP caching and actual browser timing are excluded. Byte counts are source bytes and summed per-file gzip level9, not a bundled transfer size. Raw evidence is in `docs/evidence/live-studio/`. These measurements describe candidate snapshot `bd170eb`, before subsequent mobile layout and MCP navigation repairs; they are not exact final-release transfer sizes.

| Workload | Baseline | Candidate | Interpretation |
|---|---:|---:|---|
| Workbench static dependency modules |86|57|Optional assistant is now lazy |
| Workbench static dependency bytes |2,623,644|1,282,145|1,341,499 fewer raw bytes (51.1%) |
| Workbench summed gzip9 bytes |810,324|412,970|397,354 fewer bytes |
| Kamea page raw dependency bytes |763,303|861,981|98,678 more for shared Hebrew/export/validation support |
| New Studio static dependency bytes |—|1,135,141|53 modules;366,120 summed gzip9 bytes |
| Chart CPU median |0.456ms|0.343ms|No causal speedup claim; unchanged chart code also varied |
| Vedic from cached chart median |0.272ms|0.273ms|Effectively unchanged |
| Chart + fullReading median |2.159ms|1.878ms|Observed noisy difference; no mobile/FPS inference |

CPU conditions: London2026-01-01T09:00Z; chart/Vedic20 warmups then5 rounds×200; composed reading10 warmups then5×100, no birth chart. Main-thread browser timing, camera FPS and representative-phone memory were not measured here. SkyLens is a separate released app and is not modified by this Workbench change.

## Verification ledger

- Pure suites run locally:13 shared-context groups,11 symbolic-method groups,11 symbol/export/storage groups,7 lifecycle groups,6 MCP toolkit groups,8 strict browser-tool boundary groups, plus existing engine and independent October calculation/calendar fixtures. Engine aggregator includes nested suites, so its printed check-line total is not an independent-test count.
- Static audit:118 HTML pages and244 JS files, zero link/import problems. Generated operation graph and seed checks remain part of the engine gate; round-ledger content is current (C1/C2 pass; C3 lacks sufficient historical evidence and is not silently declared passed).
- Official SDK HTTP and stdio tests pass locally. The final Chromium run at source `ce8534b` passed all 15 focused journey/viewport groups and 118/118 HTML entries in 285,353ms. It includes 320px initial and expanded-birth layouts, five Studio viewports, actual pointer Send/cancellation, exports, saved-state recovery, MCP catalogue/search/clipboard fallback, Pages subpaths and zero page/request/console errors. [Raw browser evidence](evidence/live-studio/browser-release.json) records all pages and download checks. This is automated browser evidence, not physical-device alignment or observed user research.
- Material browser findings were repaired: Send no longer shifts on focus, chart angle labels fit, Vedic houses have text alternatives, the mobile rail leaves the viewing area, and long Workbench reference/save controls wrap at320px. The final root visual confirmation inspected Workbench, Studio and MCP narrow screenshots.
- Earlier candidate CI failed on the now-repaired narrow layout. The final release is governed by [PR3 checks](https://github.com/occult-kranti/astrology-sim-ant/pull/3/checks) and the [Pages workflow](https://github.com/occult-kranti/astrology-sim-ant/actions/workflows/pages.yml). Deployment requires both calculation/browser and MCP jobs. The post-deployment job independently checks the exact commit in [live release.json](https://occult-kranti.github.io/astrology-sim-ant/release.json), Studio HTML, MCP connection HTML and the11-tool manifest; no local build is treated as publication.
- Pages entry points: [Live Symbol Studio](https://occult-kranti.github.io/astrology-sim-ant/pages/studio.html) and [Connect MCP](https://occult-kranti.github.io/astrology-sim-ant/pages/mcp.html). The latter is a static connection/catalogue interface for the separately deployed private backend.

## Remaining external verification

- Real phone, native screen-reader and actual desktop/ChatGPT MCP client validation are separate from automated fixtures.
- Private MCP backend successfully deployed at https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site, using Sites OAuth and owner-only access. Root independently reran bundled Worker tests:70 matching source hashes, all11 tool outputs equal to shared engines, auth/input guards and SSE pass. Actual client OAuth/connect and read-only tool invocation remain pending the user. Backend source `f82e8ecbff9b24f09bcb70bb342c9d81155c8da9`; deployment `appgdep_6ac40e6478ac8191a932072e480b317b`.
- No guessed birth time, arbitrary religion-wide defaults, traditional efficacy claims, validated Śrī Yantra/mandala geometry, arbitrary algebra or PDF/complex-script typography are claimed. These retain specific source/dependency reasons in the integration matrix and roadmap.
- Use README's human-action list and `mcp/README.md` for client setup. Pages Actions are already enabled.
