# Live Symbol Studio — verification and handoff

Date: October 5, 2026. Repository: `occult-kranti/astrology-sim-ant`; candidate [PR3](https://github.com/occult-kranti/astrology-sim-ant/pull/3). This document records evidence, not assumptions about earlier plans.

## What changed

- Additive Studio: Western/Vedic diagrams, sourced kamea/navagraha squares, Hebrew gematria and Sanskrit numeral study, explicit live/frozen state and method controls, snapshots and SVG/PNG/JSON provenance. The tool directory supports task/tradition entry while preserving existing links.
- Common context: visible controls, URL restore, birth radix, reference instant and exported metadata agree; incomplete/invalid input blocks stale exports. House systems and polar limitations remain visible. Workbench refreshes at5s; focused Studio live context at60s; diagram construction playback does not recompute ephemerides.
- Source corrections: local sunrise weekday, retained civil offset/date-line behavior, Unicode normalization, unsupported-alphabet rejection, bounded scans, disclosed approximate Vedic strength and editorial election scores.
- Lifecycle: cancelled assistant requests cannot write late results; scoped service-worker cleanup cannot remove sibling project caches; malformed saved collections recover valid records.
- MCP:11 strict allowlisted tools, methods resource, official SDK2.3.1 server /2.1.1 Node adapter, stdio and stateless HTTP; server dependencies excluded from Pages.

## Measured performance

Same Linux Node24.19.0, Xeon8573C container. Static import traversal begins at the page's application module; dynamic imports, CSS/fonts, HTTP caching and actual browser timing are excluded. Byte counts are source bytes and summed per-file gzip level9, not a bundled transfer size. Raw evidence is in `docs/evidence/live-studio/`.

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
- Static audit:117 HTML pages and243 JS files, zero link/import problems before the final boundary module. Generated operation graph and seed checks remain part of the engine gate; round-ledger content is current (C1/C2 pass; C3 lacks sufficient historical evidence and is not silently declared passed).
- Local shell networking fails connecting to the configured proxy. Browser and SDK installation/protocol checks run in GitHub Actions, not a claimed local browser.
- Candidate CI run [37367056407](https://github.com/occult-kranti/astrology-sim-ant/actions/runs/37367056407): pending at initial documentation write. Final results, repairs and exact deployed SHA will replace this status before handoff.

## Remaining external verification

- Real phone, native screen-reader and actual desktop/ChatGPT MCP client validation are separate from automated fixtures.
- No remote MCP endpoint has been provisioned. The shell cannot reach its configured proxy, preventing a separate backend source push. The packaged local stdio server does not need an account. Remote ChatGPT use requires a reachable hosted MCP endpoint with compatible OAuth; the provided generic bearer adapter is not OAuth.
- No guessed birth time, arbitrary religion-wide defaults, traditional efficacy claims, validated Śrī Yantra/mandala geometry, arbitrary algebra or PDF/complex-script typography are claimed. These retain specific source/dependency reasons in the integration matrix and roadmap.
- Use README's human-action list and `mcp/README.md` for client setup. Pages Actions are already enabled.
