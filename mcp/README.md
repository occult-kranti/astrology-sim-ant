# Workbench MCP backend

The public Workbench stays on [GitHub Pages](https://occult-kranti.github.io/astrology-sim-ant/). Pages cannot run a server. This directory is a separate, stateless MCP backend using the **official TypeScript SDK server 2.3.1**, researched against the October 5, 2026 release. Its calculations import the same repository modules as Live Symbol Studio; it does not need a paid API, database, browser session or AI API key.

## Local desktop connection

Install Node 22 or newer, clone the **whole repository**, then:

```sh
cd astrology-sim-ant/mcp
npm ci
npm test
node stdio.mjs
```

The committed lockfile pins the tested dependency tree. The stdio process waits for an MCP client; stdout is reserved for the protocol. Add this to a client that supports MCP stdio, replacing the path:

```json
{"mcpServers":{"workbench":{"command":"node","args":["/absolute/path/astrology-sim-ant/mcp/stdio.mjs"]}}}
```

The client explicitly sends tool arguments. Nothing reads your browser's saved births, readings, API keys or notes. Your chosen AI client/provider can retain the conversation; review its own settings. This is separate from the site's optional browser assistant.

## HTTP and deployment

`npm run http` serves stateless Streamable HTTP at `http://127.0.0.1:3001/mcp`; set `MCP_PORT` to change the port. It binds loopback, validates Host and Origin, refuses batches and requests larger than 64 KiB, and never emits permissive CORS headers. It is for local clients, not a public port.

`worker.mjs` is a web-standard fetch-runtime adapter for an independently hosted backend. Supply **server-side** `MCP_HOSTNAME` and a random `MCP_ACCESS_TOKEN` of at least 32 characters; bundle the SDK and imported repository modules with your runtime's tooling. It requires HTTPS and an exact host; bearer authentication is checked before MCP processing. Keep these environment secrets out of Pages, Git commits and client-side JS. Rotate them in the hosting service. Set request/CPU limits in that service too. No hosting account or service has been purchased.

**Deployment status:** the private OAuth-protected Sites backend is published at [https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site](https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site), with MCP endpoint `https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site/mcp`. Sites deployment `appgdep_6ac40e6478ac8191a932072e480b317b` succeeded from backend source `f82e8ecbff9b24f09bcb70bb342c9d81155c8da9`. `sites-worker.mjs` uses Sites' authenticated identity headers behind its private access policy; the generic bearer adapter above is a separate optional deployment path.

Connect the provisioned Workbench plugin under **Plugins → Personal → Created by you** and complete OAuth. If it has not appeared, use the published Site's connection controls when available; do not enter the Pages frontend URL as an MCP URL. A real client tool invocation remains pending your authenticated connection; the earlier deployment documented 11 tools. The current branch has additional local tools and adapters below; remote availability requires a new authenticated tools/list check after deployment. Local source and official-SDK tests are separate from remote readiness.


## Tools and contracts

- `workbench_catalogue`: search the existing capability directory and links.
- `workbench_chart`: Western chart, planetary hour and optional Vedic context, explicit instant and observer; optional birth radix/reference instant.
- `workbench_symbol`: sourced kamea/navagraha grid and Latin/Hebrew trace; standalone SVG and text alternative.
- `workbench_gematria`, `workbench_katapayadi`: explicit letter-number methods.
- `workbench_calendar`, `workbench_julian_day`, `workbench_easter`: civil conversion and named computus conventions.
- `workbench_qibla`, `workbench_prayer_times`: true-north bearing and Adhan method choices.
- `workbench_election`: bounded historical scoring (168 hours, 256 samples maximum).
- `workbench_compare_moment`: one explicit instant/observer across named civil calendar, sky, zodiac, planetary-hour and prayer conventions.
- `workbench_calendar_outlook`: 1–14 daily timezone-resolved study snapshots, not validated forecasts.
- `workbench_explain_guidance`: one explicit instant and observer, with the canonical historical rule classifications, measured inputs, thresholds, source qualifications, coexisting testimonies and modern reflection labels. Returns the supplied observer and temporal-hour context; it does not read browser state or call a model.
- `workbench_calendar_atlas`: one explicit instant and observer across catalogued calendar and chart variants. Optional `family` or `variant` selects one named scope; omitted selection compares the catalogue. Unavailable methods retain their source limits. Birth records and arbitrary notes are not accepted arguments. Longer date scans run in the browser's separate cancellable worker.

The generated [static catalogue](../assets/data/mcp-catalogue.json) contains the current source tool names and exact schemas; use its count rather than historical deployment counts. It does not establish that the previously deployed private backend has been updated. See [the Calendar Observatory AI contract](../docs/2026-10-calendar-observatory-ai.md), [the source-guided explanation extension](../docs/2026-10-ensemble-ai.md), [the desktop atlas plan](../docs/2026-10-atlas-plan.md) and [sky interpretation/RAG contract](../docs/2026-10-sky-ai-rag.md).

## Sky, interpretation and per-tool coverage

- `workbench_sky_snapshot` returns apparent geocentric bodies and separately framed heliocentric vectors, with optional bounded stellar layers and explicit precision/projection limits.
- `workbench_sky_timeline` calculates a dynamic past/future grid with at most 512 samples and 1,024 refined solar/lunar-quarter events. It does not promise every transit or ingress between samples.
- `workbench_calendar_alignment` compares selected calendar methods at one instant, or intentionally the same local clock in another IANA zone. Gaps/folds, day boundaries, method differences and unavailable results are data, not hidden corrections. External-calendar connection is not implied.
- `workbench_sky_interpretation` recomputes source-attributed Lilly, Agrippa and Jyotiṣa evidence. `workbench_source_search` retrieves selected original source paraphrases with edition, rights and reading depth; neither fabricates a personal forecast or a full-book corpus.
- `workbench_full_reading` supplies the canonical composed reading, including dignity, aspects, cautions and lots. Exact birth and quesited-house arguments activate only their documented conditional branches.
- `workbench_tool_guide` reports every registered capability's input/output/source contract, routes, exact supported MCP subset and output paths. Catalogue/reference/rendering entries are distinguished from callable calculators.
- Sixteen fixed `workbench_calc_*` adapters reuse the original browser-callable registry functions. They require explicit moment/place arguments where a browser could previously supply current-page context. The life-trajectory adapter rejects evaluation before birth or beyond 150 calendar years. Polar house fallback and missing solar-station intervals are explicit.
- Dedicated chart, calendar, oracle and observatory adapter modules expose additional bounded canonical calculators with supplied inputs/draws. Consult their exact published schemas and coverage qualifiers. A model cannot submit arbitrary executable code or a forged trusted chart object.

The browser's minimal handoff and the MCP calculation have different input boundaries. The browser omits location by default and needs a separate location opt-in to include temporal hours. An MCP caller explicitly supplies `dateISO`, `lat`, `lon` and `timeZone`; `workbench_explain_guidance` returns that calculation's full context. Neither route inherits a ChatGPT login or conversation. MCP `structuredContent` is deterministic server data, not generated model output; the same JSON is supplied as a text content block for compatibility.

Read `workbench://methods` for engine, source, range and provenance metadata. Calculation tools are read-only and make no outbound requests. Unknown keys, unsupported methods, implicit-local datetimes and non-finite inputs are rejected. Expensive scans and text are bounded. MCP uses a tighter 256-sample election cap than the local engine’s 2048; synchronous calculation runs to completion within a call, so cancellation cannot interrupt an already-running arithmetic loop. Bounded asynchronous adapters resolve through the same 1.5 MB output boundary; asynchronous transport is not a promise of interruption inside every canonical calculation. There is no unbounded scan. The catalogue is broader than the execution allowlist: each guide names actual support rather than promising that every practice or visual helper has a validated callable implementation.

An unknown birth time cannot support precise houses; use the existing date-only Nativity UI. Calibration means input/convention validation, not fitting a chart to a desired interpretation. Traditional interpretations, editorial scores and mathematical geometry are distinguished from astronomical measurements.

## Verification and maintenance

`node ../scripts/tests/mcp-toolkit.mjs` tests pure tools without dependencies. `npm test` tests real official-SDK HTTP and child-process stdio initialize/list/call/resources, input failures and HTTP guards. Production hosting, OAuth integration and real client installation remain separate checks. SDK dependencies are Apache-2.0; see [upstream release](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/v2.3.1) and the repository's third-party attribution. No copied proprietary graphics or model-generated ephemerides are used.
