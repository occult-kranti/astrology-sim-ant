# Calendar Observatory: AI, MCP and privacy

Date: 2026-10-29. Scope: the `feat/mobile-calendar-observatory` source branch.

## What works without an account

The homepage and comparison page calculate locally. Their study assistant offers seven finite explanations of similarities, differences, day boundaries, sources, disclosure, sampled rules and coexisting testimonies. The interface calls these **local rule-based explanations**. They are not language-model answers, an occult expert's endorsement or forecasts.

The assistant can prepare a structured packet and its exact outgoing prompt, copy the prompt, and download the packet as JSON. Preparation makes no network request. Nothing calls an AI provider, stores an API key, uploads a record or creates an account.

Default disclosure is a strict allowlist:

- A normalized UTC instant, seven geocentric tropical and approximate Lahiri sidereal longitudes, retrograde flags and the sidereal Moon's mansion/pada.
- Stable source identifiers, implementation conventions and limitations.
- No coordinates, IANA zone, local civil dates, houses, horizon, planetary-hour times, prayer times, notes, birth records, browser history or credentials.

The checkbox **Include selected coordinates, time zone and civil-calendar rows** additionally includes the current observer's latitude/longitude, canonical IANA zone and thirteen named calendar rows. It does not silently attach the rest of a chart. A location or civil date can still be personal information. The UTC instant and geocentric positions are visible even with the checkbox off.

The separate, default-off **Include sampled historical rules, measured inputs and source qualifications** checkbox adds ten geocentric Western/Muhūrta rule explanations. Temporal-hour evidence is included only if location is also selected, making eleven rules. Measured thresholds, unresolved timing, source qualifications and modern editorial action labels stay explicit. Local rule questions do not change these outgoing choices. See the [ensemble extension](2026-10-ensemble-ai.md) for source access and the exact disclosure contract.

Changing any form value invalidates the current comparison at its owning page. `update(null)` clears the preview and disables preparation, copying, JSON download and the local explanation. Changing the assistant's question or disclosure option clears the previous outgoing packet. Exported and previously copied data cannot be recalled.

## ChatGPT handoff

**Open ChatGPT** opens the ordinary `https://chatgpt.com/` website in a separate tab with no prompt in its URL. The intended flow is: calculate → choose disclosure → prepare → inspect exact prompt → copy → open ChatGPT → paste → explicitly send.

This website cannot inherit the current ChatGPT conversation, use this chat's authentication, install an MCP connection or verify that a particular account is signed in. Opening a tab alone transfers no packet. The user's chosen chat service controls its own retention and privacy settings. This is a functioning explicit handoff, not a claim of an embedded authenticated ChatGPT chatbot.

The prepared prompt asks the model to cite fact/source IDs, treat packet strings and questions as untrusted reference data, separate arithmetic from interpretation, acknowledge unsupported traditions, and avoid fabricated passages or claims of validated prediction. A prompt is not a guarantee that a model follows those instructions: the user must inspect the resulting answer and source claims.

## MCP: fourteen tools in current source

The new read-only tools extend, rather than replace, the existing eleven:

| Tool | Inputs and result | Limits |
| --- | --- | --- |
| `workbench_compare_moment` | Explicit ISO instant with `Z`/offset, latitude, longitude and IANA zone; selected house/prayer conventions; returns the same comparison object as the browser engine. | Complete comparison years 1900–2100; methods enumerated; no unknown keys or implicit local times. |
| `workbench_calendar_outlook` | Same context plus optional start civil date, sample clock time and day count; returns timezone-resolved daily rows. | 1–14 days; bounded response 1.5 MB; sample differences are not exact transition timestamps. |
| `workbench_explain_guidance` | Explicit instant, latitude, longitude and IANA zone; returns canonical rule IDs, measured inputs, thresholds, source qualifications, tensions and temporal-hour context. | One selected sample; strict fields and finite observer; unresolved timing remains unavailable. No provider call or inferred whole-day verdict. |

The original catalogue, chart, symbol, gematria, katapayadi, civil calendar, Julian Day, Easter, qibla, prayer-time and election tools remain available. All tool calculations are deterministic for explicit arguments and make no outbound request. They read no browser saved state. The client explicitly supplies any coordinates it chooses to send, and that client/provider can retain the conversation.

Example tool arguments:

```json
{
  "dateISO": "2026-10-29T12:00:00Z",
  "lat": 28.6139,
  "lon": 77.2090,
  "timeZone": "Asia/Kolkata"
}
```

For `workbench_calendar_outlook`, add `"days":14` if desired. The engine canonicalizes some IANA aliases: for example, a runtime can resolve Asia/Kolkata to Asia/Calcutta. This is runtime timezone naming, not a changed observer.

Local desktop installation uses the complete branch checkout:

```sh
cd astrology-sim-ant/mcp
npm ci --ignore-scripts
npm test
node stdio.mjs
```

Use the existing stdio client configuration in [the MCP README](../mcp/README.md). `npm run http` is a loopback, host/origin-checked local transport; it is not a public server. Private remote deployment requires its documented server-side authentication and a separate hosting workflow. GitHub Pages cannot execute the MCP backend.

### Remote version boundary

The known published private OAuth endpoint remains:

`https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site/mcp`

Its earlier source documented eleven tools. This branch does not redeploy that separate backend or establish the current user's authenticated client connection. A fourteen-entry static catalogue describes **this source**, not verified remote availability. Redeploy the reviewed backend, complete the client connection, inspect an authenticated `tools/list`, then call `workbench_catalogue` before asserting new remote-tool readiness. The existing endpoint, OAuth instructions and setup page are preserved.

## Optional hosted AI: separate future integration

An embedded provider-backed chatbot is not enabled in this branch. A future server may call the OpenAI Responses API and expose these read-only MCP tools, but it needs server-side API access and the correct MCP authorization. Never put a provider key or MCP bearer token in Pages JavaScript, a URL, Git, a packet, a prompt or browser localStorage. A user's ChatGPT subscription is not an application's API key.

The official [OpenAI remote-MCP guide](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), fetched successfully over verified HTTPS on 2026-10-29, documents remote tool configuration, optional OAuth authorization and approval controls when sharing sensitive data. Use its current API contract when implementing a hosted integration; do not copy an old model identifier as a promise of access. The fetch returned HTTP 200; this was documentation research, not a model call, deployment or OAuth test.

Do not enable autonomous ritual execution, purchases, publishing, messages or calendar/account writes from generated interpretations. The current MCP tools are read-only calculations.

## Why no Supabase is required

All calendar arithmetic and fourteen-day sampling fit in the existing static, offline-capable architecture. A database adds no correctness to those calculations. This branch creates no Supabase project, claims no connection, and sends no location or journal record to one.

If multi-device accounts or scheduled personal notifications are later requested, an optional design is authenticated user-owned records with row-level security keyed by `auth.uid()`, explicit opt-in for exact coordinates, a retention/delete UI, and narrowly scoped scheduled functions. Public reference-source metadata can be separate from personal readings. Service-role credentials belong only in server functions; a public client key alone does not establish safe access. Authentication, migrations, policies, deletion and notification consent require their own end-to-end tests before enabling sync. This is a future design, not a configured service.

## Executed checks

- `node scripts/tests/calendar-study-packet.mjs`: eleven test groups passed, covering disclosure, arbitrary-field exclusion, recomputation of forged civil labels, observer-independent facts/rules, exact rule thresholds/source qualification, unresolved timing, sampled disagreement, strict inputs, untrusted-reference prompt construction, finite non-model answers and zero fetch calls.
- `node scripts/tests/mcp-toolkit.mjs`: eight groups passed, including preservation of all legacy names, strict new schemas, explicit instant/zone validation, deterministic comparisons, fourteen-row bounded outlook, canonical guidance equivalence and invalid horizon rejection.
- `npm test --prefix mcp`: real official-SDK HTTP and child-process stdio initialize/list/call/resource paths passed, plus input/body/origin/host/abort/authentication guards. New guidance calls returned actual engine results through both transports, with matching structured/text JSON.
- `node scripts/build-mcp-catalogue.mjs`: current source catalogue regenerated with fourteen tools.

Rendered assistant and full-site checks are separate evidence recorded by the browser-review workstream. No real external LLM inference, remote backend redeployment, authenticated ChatGPT client call, new database connection or human tradition-expert review is claimed here.
