# Private Workbench MCP deployment — 2026-10-05

The application stays on GitHub Pages. Its optional MCP companion is deployed separately as a private Sites Worker, using the same calculation source and the official Model Context Protocol SDK.

## Verified release

- Site: https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site
- MCP endpoint and OAuth resource: https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site/mcp
- Sites-provisioned private plugin: `plugin_asdk_app_sites_ab7a0baf5c90819192660e1894ff76b2` (returned by `get_site` after publication; connection remains a user action).
- Native deployment status: **succeeded**, `has_mcp: true`, at `2026-10-05T20:54:05.546954+00:00`.
- Project: `appgprj_6ac40d911ac481919ed8dbf01f454391`.
- Deployment: `appgdep_6ac40e6478ac8191a932072e480b317b`.
- Saved version: `appgprj_6ac40d911ac481919ed8dbf01f454391~appgver_6059b1b15c7c8191b32a32dda89af144`.
- Exact pushed Sites source commit: `f82e8ecbff9b24f09bcb70bb342c9d81155c8da9`.
- Access was checked after publishing: owner role, custom policy with one allowed user, zero external visitors. The private audience was preserved.

## Architecture and source parity

`mcp/sites-worker.mjs` is the Sites-only adapter. Sites dispatch owns OAuth, authenticates each user, and overwrites the trusted identity headers. The adapter requires both authenticated user ID and email before processing MCP requests. Do not deploy this adapter behind an untrusted proxy that passes client-supplied identity headers. The ordinary local/standalone server remains a separate adapter.

No API key, database, mandatory paid API, external birth-record transfer, scheduled task or automatic browser upload was added. Only explicitly supplied MCP arguments are calculated. The MCP client/provider may retain its conversation. The Site does not store calculation requests or account records, log inputs or make outbound calculation calls. The public browser application continues to calculate locally.

The host source preserves 70 exact upstream files, each recorded by SHA-256 in its `UPSTREAM.json`. The dependency graph was checked against the Workbench immediately before publication. It includes the shared context, symbolic geometry, calendar/prayer engines, bounded toolkit, HTTP guards and SDK server. The host package lock pins `@modelcontextprotocol/server` 2.3.1; the SDK owns protocol negotiation. The source and bundle preserve dependency license notices, including the MCP Apache-2.0/MIT transition notice, Zod MIT, Astronomy Engine MIT and Adhan MIT notices.

The adjunct source checkout is `/workspace/workbench-mcp-host`. Its `scripts/sync-upstream.mjs` copies the controlled graph; `scripts/build.mjs` produces the Worker; `scripts/test.mjs` verifies source hashes and transport parity. Its configured Sites source repository is separate from the public GitHub repository. Future changes must refresh the graph, run checks, push the exact source, package that source and deploy a new saved version.

Reproduce the checked bundle locally with `npm ci`, `npm run build`, and `node scripts/test.mjs --built` in that checkout. The tests inject fixture identity headers only inside the local Worker adapter; they do not bypass production OAuth.

## Verification actually performed

- Source and bundled Worker: MCP initialization, discovery of all 11 tools, and successful calls to all 11 tools; results exactly match the shared toolkit after JSON serialization.
- Denied missing user identity, missing email, plain HTTP, cross-origin requests, oversized JSON, unsupported HTTP method and invalid election step.
- Confirmed legacy MCP 2025-11-25 SSE responses remain readable before the per-request server closes.
- Confirmed user identity values do not appear in tool results.
- Confirmed all 70 source hashes match the current Workbench and the source pushed to Sites matches the returned commit SHA.
- Native Sites deployment succeeded with MCP enabled. This verifies publication; it does not claim an OAuth client has already connected.

Worker JavaScript is **743,859 bytes**, measured after minification with esbuild 0.27.4. The deployment archive is **244,487 bytes** including legal notices and manifest. Archive SHA-256: `82811dc5a825ee23689c4b774fa7f3bac8e7ce59212385147a0d0ccbf3a8592c`. These are backend build sizes, not a frontend load-time or phone-performance claim.

## Human action

Connect the private Site’s provisioned MCP plugin using the supported Sites/ChatGPT installation flow. No new backend account or secret API key is required. Once connected, call `workbench_catalogue` or `workbench_gematria` with `{"text":"חי"}`; the latter should return 18. That live OAuth tool call is pending user connection and is deliberately separate from the completed local transport tests and deployment verification.

## Limits

The host exposes an explicit 11-tool allowlist, not every one of the larger browser catalogue’s practices. It shares the Workbench’s calculation conventions, reference coverage and disclosed historical approximations. It does not establish efficacy of traditional interpretations. The hosted endpoint requires authenticated user access even for a platform service caller; service access does not invent a user identity. Deployment automation and frontend-to-backend browser data synchronization were not added.
