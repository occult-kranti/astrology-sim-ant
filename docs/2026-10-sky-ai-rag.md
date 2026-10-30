# Sky interpretation, tool assistance and retrieval

The atlas now offers a source-backed local interpretation and an optional in-site model response. These are different outputs. `sky-interpretation.js` computes the former with named rules; `sky-assistant.js` packages its evidence; `sky-chat-client.js` sends the exact reviewed prompt only after an explicit action. Copy/open handoff to ChatGPT remains available without an API. Neither path inherits the reader's ChatGPT account or this development conversation.

## Calculation → evidence → interpretation

1. Recompute the supplied moment through canonical engines. Reject implicit dates, invented bodies, unknown method IDs and injected precomputed chart objects. Keep apparent geocentric coordinates, geometric heliocentric vectors and calendar conventions separate.
2. Select a body and source lenses. Each interpretation supplies measured input, rule identity, source locator, reading depth and limits. Outer planets can be displayed astronomically without inventing classical Lilly/Agrippa meanings.
3. Retrieve up to four relevant source notes locally. Retrieved prose is reference data, never an instruction, a new calculation or permission to send anything. Textual variants and inherited/unverified source claims remain visible.
4. Prepare an outgoing packet. By default it omits coordinates, IANA zone, houses, sect, horizon and temporal-hour output. Explicit observer disclosure adds those fields and selected calendar alignment. Birth records, saved notes and provider keys are never read automatically. The selected UTC instant and any question typed into the panel are still disclosed.
5. Explain the result as a concise **claim → measured evidence → named rule/source → limitation**. The system prompt asks for a useful reasoning summary, not private chain-of-thought. Three complete mini-input/answer examples cover Rao's worked tithi arithmetic, a synthetic cross-sign solar-rule disagreement, and missing birth-time information. Their `EX-*` citations are quarantined from current-packet citations.
6. Keep the generated answer visibly separate from the local reading. The citation inspector detects absent or unknown identifiers; it does **not** establish that a sentence correctly follows its cited passage. Future-day classifications are named historical testimonies, not empirical event predictions or a combined luck score.

The packet is capped at 120 KB, and the complete prepared provider prompt at 180 KB. Alignment omits repetitive ring drawing sectors while retaining coordinate origins, selected markers, labels, measured differences and sources. A complete overlay JSON is a separate local export. Provider context/token limits can be smaller; select fewer methods or lenses when necessary.

## In-site model transport and lifecycle

The optional provider form reuses `app/llm-core.js` streaming transport. It accepts an explicitly entered OpenAI-compatible endpoint, or Anthropic Messages endpoint, model and optional key. HTTPS is required except for loopback local servers. Credentials/query strings/fragments in endpoint URLs are rejected. The key stays in this tab's memory and is never added to packets or downloads. The new panel does not read the legacy assistant's saved settings.

Configure the destination, prepare the preview, review it, check the send disclosure, then choose **Send reviewed interpretation**. Changing the moment, selection, question, disclosure, endpoint, model or key invalidates the preview and cancels an active request. Stop, page hide, backgrounding and component destruction abort requests; revision checks discard late callbacks. A 90-second timeout and 60,000-character response bound prevent an indefinite visible request. Returned text is rendered as text, not executable HTML.

For a local Ollama server that supports browser access, the endpoint can be `http://localhost:11434/v1/chat/completions`. Supply a model actually installed on that machine. The application does not install, choose, fine-tune or secretly download a model. Local CORS/private-network and browser mixed-content restrictions still apply. A remote endpoint may charge for inference. No live provider or local model inference was performed in this implementation pass; both shared streaming formats, explicit payloads, errors, cancellation and late callbacks were tested with mocked responses.

The model receives precomputed facts and source notes. This panel does not grant autonomous tool execution to generated text. MCP-enabled clients can separately call the named, strictly bounded tools after explicitly supplying their arguments. No arbitrary JavaScript, shell, URL or chart-object dispatch is exposed.

## Assistance for individual tools

`core/tool-guide.js` inventories the actual capability registry and maps each entry to implemented MCP tools, precise supported output paths or an explicitly local/reference-only workflow. The shared page guide is collapsed by default and does not inspect a page's current inputs. It supplies source, input and output explanations plus a preview/copy handoff for a question about that tool. The atlas's separate interpretation panel is the surface that can deliberately disclose the current calculated context.

Guide packets separate `localFunctionInputs` from `mcpContracts`. Internal functions can accept already-computed charts, Moon longitudes or a curated dataset; their MCP adapters instead require explicit moments or use the repository's fixed dataset. Each MCP contract contains the exact generated `TOOLS` input schema. The UI labels local engine arguments separately, lists actual required MCP fields and provides an expandable schema. `build-mcp-coverage.mjs --check` and equality tests detect drift without importing server modules into the browser.

Sixteen original callable registry capabilities now have fixed stateless adapters in `mcp/registry-adapters.mjs`. They reuse the browser dispatcher, require explicit date/place arguments where the browser previously accepted page context, and preserve source status. Trajectory evaluation requires a reference from birth through 150 calendar years later; requested versus actual polar house conventions and unavailable solar stations are explicit. A composed `workbench_full_reading` additionally supplies the dignity ledger, aspects, cautions, lots, and the documented conditional natal/horary branches. Dedicated chart, calendar and oracle adapters extend this coverage; the generated MCP catalogue is the authoritative current name/schema list, not an old prose tool count.

Every capability is not the same as a remotely callable calculator: render helpers, historical catalogues, imported-chart replay and a fully parameterized calculation can require different contracts. The guide states the implemented subset and output path. The current source catalogue does not establish that the previously hosted MCP backend has been updated. Real HTTP/stdio protocol tests and remote deployment are separate evidence.

## Local RAG reference pack

The reference pack contains original, short paraphrases of selected source passages, with source IDs, edition, locator, URL, rights, reading depth, tags and per-text SHA-256. It does not redistribute the downloaded books. Free availability of Rao's copyrighted PDF is not an open training licence. Review each edition's rights before expanding a training corpus.

```bash
node scripts/build-sky-reference.mjs
node scripts/build-sky-reference.mjs --check
node scripts/query-sky-reference.mjs "Why do tropical and sidereal signs differ?"
```

Outputs are `research/sky-reference/chunks.jsonl` and `manifest.json`. A local RAG application can retrieve the top source notes, recompute numerical inputs with these tools, and pass the notes plus facts through the same prompt contract. This is retrieval context, not fine-tuning. No embedding vectors, model weights or training run are claimed.

The browser implementation uses deterministic BM25-style lexical overlap over this small corpus, with explicit title/tag weighting and a maximum of eight returned notes. No query match yields an empty result and a missing-source explanation. Relevance is not confidence or truth. Six authored regression questions each retrieved the expected source chunk in the top three; these are convenience checks, not held-out user research or an assessment of model answer quality.

## Optional Supabase reference hosting

Supabase is useful if a team needs one centrally updated public source-note collection. It does not improve the astronomical calculations. The current environment has no configured Supabase project, credential or callable connector; no hosted database was created or deployed. The local reference library already works without it.

`supabase/migrations/202610300001_sky_reference.sql` implements a public **curated-reference-only** table, weighted PostgreSQL full-text index and bounded `search_sky_reference` RPC. It stores no births, charts, questions, keys or user identities. Anonymous and authenticated clients can select published rows only; insert/update/delete are denied. The function is `SECURITY INVOKER`, uses an empty search path and qualified relations, and has explicit execute grants. Publishing requires a privileged server/admin path; service-role credentials never belong in Pages.

Generate a reviewable seed file with:

```bash
node scripts/export-sky-reference-sql.mjs > /tmp/sky-reference-seed.sql
```

Apply the migration and seed to an intentionally selected, authenticated Supabase project using its migration/SQL workflow. Then run actual project RLS checks and a public RPC test before connecting any frontend. No project identifier, API key or deployment claim is supplied here. The local UI deliberately has no fake connected-state switch.

The migration and seed were executed against PostgreSQL in WASM using **PGlite 0.5.13**, including idempotent migration, anonymous/authenticated published-only reads, denied writes, hidden-row exclusion, RPC limits and injection-as-data checks. This is executable SQL evidence, not hosted Supabase verification:

```bash
npm install --prefix /tmp/sky-rag-test --no-audit --no-fund @electric-sql/pglite@0.5.13
PGLITE_PKG=/tmp/sky-rag-test/node_modules/@electric-sql/pglite/dist/index.js \
  node scripts/test-sky-reference-db.mjs
```

On the same six authored questions, local overlap retrieval found all six expected chunks in its first three results; PostgreSQL `websearch_to_tsquery` found two. The latter uses conjunctive query semantics unless the caller explicitly uses `OR`, and the indexes weight different fields. This is a diagnostic comparison, not a semantic retrieval benchmark. It gives no basis to claim hosted retrieval improves these results; local retrieval remains the default.

Official Supabase full-text-search, RLS and database-function documentation was retrieved and its relevant generated-index, invoker, grant and policy sections inspected on 30 October 2026. References: [full-text search](https://supabase.com/docs/guides/database/full-text-search), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [database functions](https://supabase.com/docs/guides/database/functions). Ollama's [OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility) and [FAQ](https://docs.ollama.com/faq) are the local-server configuration references; endpoint/model availability belongs to the user's installation.

## Verification boundaries

Run `scripts/tests/tool-guide.mjs`, `scripts/tests/sky-assistant.mjs`, `scripts/tests/sky-chat-client.mjs`, the adapter suites, `scripts/tests/mcp-toolkit.mjs` and `mcp/test-protocol.mjs`. Browser evidence must cover real preview/download bytes, observer opt-in, stale state, clipboard fallback, actual provider cancellation and late responses. Each panel round records the candidate tested; passing one local round does not certify a later changed artifact.

No human usability study, screen-reader study, complete book reading, cultural-authority review, model fine-tuning, live provider accuracy evaluation or hosted Supabase/MCP deployment follows from these checks.
