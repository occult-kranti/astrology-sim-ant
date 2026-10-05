# Workbench MCP backend

The public Workbench stays on [GitHub Pages](https://occult-kranti.github.io/astrology-sim-ant/). Pages cannot run a server. This directory is a separate, stateless MCP backend using the **official TypeScript SDK server 2.3.1**, researched against the October 5, 2026 release. Its calculations import the same repository modules as Live Symbol Studio; it does not need a paid API, database, browser session or AI API key.

## Local desktop connection

Install Node 22 or newer, clone the **whole repository**, then:

```sh
cd astrology-sim-ant/mcp
npm install
npm test
node stdio.mjs
```

Once a lockfile is present use `npm ci`. The stdio process waits for an MCP client; stdout is reserved for the protocol. Add this to a client that supports MCP stdio, replacing the path:

```json
{"mcpServers":{"workbench":{"command":"node","args":["/absolute/path/astrology-sim-ant/mcp/stdio.mjs"]}}}
```

The client explicitly sends tool arguments. Nothing reads your browser's saved births, readings, API keys or notes. Your chosen AI client/provider can retain the conversation; review its own settings. This is separate from the site's optional browser assistant.

## HTTP and deployment

`npm run http` serves stateless Streamable HTTP at `http://127.0.0.1:3001/mcp`; set `MCP_PORT` to change the port. It binds loopback, validates Host and Origin, refuses batches and requests larger than 64 KiB, and never emits permissive CORS headers. It is for local clients, not a public port.

`worker.mjs` is a web-standard fetch-runtime adapter for an independently hosted backend. Supply **server-side** `MCP_HOSTNAME` and a random `MCP_ACCESS_TOKEN` of at least 32 characters; bundle the SDK and imported repository modules with your runtime's tooling. It requires HTTPS and an exact host; bearer authentication is checked before MCP processing. Keep these environment secrets out of Pages, Git commits and client-side JS. Rotate them in the hosting service. Set request/CPU limits in that service too. No hosting account or service has been purchased.

**Deployment status:** remote hosting is not yet provisioned. The execution environment cannot reach its configured network proxy, so a hosted backend has not been pushed or verified. This adapter's bearer authentication is not an OAuth implementation. A ChatGPT remote connection needs an appropriately hosted OAuth-protected MCP endpoint; do not enter the GitHub Pages URL as an MCP URL. Local stdio and protocol tests are separate evidence from a successful ChatGPT connection.

## Tools and contracts

- `workbench_catalogue`: search the existing capability directory and links.
- `workbench_chart`: Western chart, planetary hour and optional Vedic context, explicit instant and observer; optional birth radix/reference instant.
- `workbench_symbol`: sourced kamea/navagraha grid and Latin/Hebrew trace; standalone SVG and text alternative.
- `workbench_gematria`, `workbench_katapayadi`: explicit letter-number methods.
- `workbench_calendar`, `workbench_julian_day`, `workbench_easter`: civil conversion and named computus conventions.
- `workbench_qibla`, `workbench_prayer_times`: true-north bearing and Adhan method choices.
- `workbench_election`: bounded historical scoring (168 hours, 256 samples maximum).

Read `workbench://methods` for engine, source, range and provenance metadata. All tools are read-only, deterministic for supplied inputs and make no outbound requests. Unknown keys, unsupported methods, implicit-local datetimes and non-finite inputs are rejected. Expensive scans and text are bounded. MCP uses a tighter 256-sample election cap than the local engine’s 2048; synchronous calculation runs to completion within a call, so cancellation cannot interrupt an already-running arithmetic loop. There is no unbounded scan. The catalogue is broader than the exposed MCP allowlist: it is not a promise that every practice has a validated callable implementation.

An unknown birth time cannot support precise houses; use the existing date-only Nativity UI. Calibration means input/convention validation, not fitting a chart to a desired interpretation. Traditional interpretations, editorial scores and mathematical geometry are distinguished from astronomical measurements.

## Verification and maintenance

`node ../scripts/tests/mcp-toolkit.mjs` tests pure tools without dependencies. `npm test` tests real official-SDK HTTP and child-process stdio initialize/list/call/resources, input failures and HTTP guards. Production hosting, OAuth integration and real client installation remain separate checks. SDK dependencies are Apache-2.0; see [upstream release](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/v2.3.1) and the repository's third-party attribution. No copied proprietary graphics or model-generated ephemerides are used.
