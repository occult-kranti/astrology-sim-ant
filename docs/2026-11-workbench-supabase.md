# Optional Supabase reference retrieval

The desktop assistant can query a deliberately configured Supabase project for the generated public reference corpus. Local source retrieval continues to work without an account. This extension supplies PostgreSQL full-text search, published-only row access, source identifiers and content hashes. It does not train a model or establish the correctness of a retrieved passage.

## Deployment status

This repository contains a migration, deterministic seed exporter, browser client and executable PostgreSQL tests. **No hosted Supabase deployment has been performed.** The current tool catalogue has no Supabase connector, no Supabase CLI was found on the execution path, and this checkout has no linked Supabase project configuration. No project URL, publishable key or authorized database connection was available. No external project or paid resource was created.

A local test uses pinned `@electric-sql/pglite` 0.5.13, PostgreSQL compiled to WebAssembly. It exercises the real SQL schema, roles, RLS policies and retrieval function. This is SQL/RLS implementation evidence, rather than a hosted Supabase integration result. The current receipt and evaluation results are recorded below after the generated corpus is held stable.

## Data boundary

`assets/js/core/data/workbench-rag-corpus.js` is the selected input. Its manifest records the source graph, reading depth, corpus hash and source-file count. The seed stores each chunk's ID, source ID, title, exact text, category, tags, file, locator, URL, reading-depth description, rights scope, text hash and original source-file hash. Project-relative links and safe HTTP(S) source links remain distinguishable. A source's underlying book may have been catalogued or summarized; the chunk's `source_reading_depth` preserves that distinction.

The schema has no chart, birth-profile, account, chat-log or API-key table. The exporter accepts only the generated public corpus. It never reads browser storage, personal exports or source downloads. Do not extend its allowlist to private material or assume that a downloadable book permits redistribution or training. Existing source rights notices remain attached to every chunk.

The browser RPC request sends the query text, requested result count and optional category to the chosen project. The hosting provider may log requests under its own configuration. Chart records, calculations and chat history are not automatically added to this source request. The user must deliberately choose the remote source search and see its destination. Model-provider configuration is a separate connection.

## Schema and permissions

Apply `supabase/migrations/202611040001_workbench_rag.sql` to an existing project after reviewing it.

- `public.workbench_reference_chunks` uses row-level security. `anon` and `authenticated` receive SELECT access only, subject to `published = true`. They receive no INSERT, UPDATE, DELETE or TRUNCATE privileges.
- Trusted `service_role` administration may curate the public corpus. A service-role or secret key is never accepted by the browser client.
- `public.search_workbench_reference(query_text, match_count, category_filter)` is `SECURITY INVOKER`, with a fixed empty search path. It explicitly restricts results to published chunks even when called by a privileged role.
- Query text is limited to 1,000 characters; result count is 1–12. Empty, stopword-only and unsupported queries return no results. Category identifiers are validated; a valid unknown category returns no results.
- Queries are converted to a bounded disjunction of at most 64 normalized lexemes. English stemming and a simple exact-form track search weighted titles, tags/categories and bodies. Query punctuation is data, not executable SQL or caller-defined `tsquery` syntax.
- Ranking combines normalized English and simple full-text scores, with the English score weighted twice. Ties use the source ID. Scores describe lexical relevance and are not confidence, truth or astrological validity.
- Transformation helpers live in `workbench_private`, outside the default exposed REST schema. Keep that schema out of the project's exposed API schemas. They grant only the access needed by the invoker query and trusted curation.
- GIN indexes support both text-search tracks. Embeddings, vector indexes, semantic rerankers and hosted model inference remain unimplemented.

## Prepare a reviewable seed

From the repository root:

```bash
node scripts/build-workbench-rag.mjs --check
node scripts/export-workbench-rag-sql.mjs > /tmp/workbench-rag-seed.sql
```

The exporter validates IDs, lengths, URLs, relative paths, tags and content hashes before emitting any SQL. SQL values use explicitly escaped string literals. The transaction first marks previously managed `WRAG-…` chunks unpublished, then upserts the current corpus. Removed passages therefore stop appearing without deleting their archived rows. Other administrator-created IDs are untouched.

The seed can be several megabytes. Review its corpus count/hash and source rights before applying it. Run the migration followed by the seed using the project's SQL editor or a trusted administrative database connection. For an already authorized `psql` environment, using a connection variable rather than printing its value:

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -f supabase/migrations/202611040001_workbench_rag.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -f /tmp/workbench-rag-seed.sql
```

Keep the connection string and administrative credentials out of Git, browser settings and shared reports. These commands are instructions for an authorized project; they were not run against a hosted database during this implementation.

Verify the public role separately:

```sql
begin;
set local role anon;
select count(*) from public.workbench_reference_chunks;
select id, title, file_path, reading_depth, source_reading_depth, rank
from public.search_workbench_reference('cazimi combustion Lilly', 6, null);
rollback;
```

## Browser configuration contract

The caller imports:

```js
import {
  normalizeWorkbenchSupabase,
  searchWorkbenchSupabase,
} from './workbench-supabase.js';

const config = normalizeWorkbenchSupabase({
  url: projectBaseURL,
  publishableKey,
});
// Execute only from the user's explicit remote-search action.
const result = await searchWorkbenchSupabase(config, question, {
  limit: 6,
  category: null,
  signal: abortController.signal,
});
```

The project base URL must use HTTPS, or HTTP on an explicit loopback host for local development. Paths, embedded credentials, query strings and fragments are rejected. Configuration stays in the caller's memory; the module has no persistence API. Supported credentials are a new `sb_publishable_…` key or a legacy JWT whose decoded role is `anon`. Decoding checks the key's declared type; Supabase verifies authentication. Secret, service-role and authenticated-user keys are rejected here.

The request uses the fixed `rest/v1/rpc/search_workbench_reference` path with redirects disabled, browser credentials omitted, no referrer and no cache. A new publishable key is sent in `apikey`; a legacy anon key also supplies its bearer header. The response is bounded to one megabyte and the requested row count. Every row is validated and each text SHA-256 is recomputed in the secure browser context before it is returned. Cancellation, timeouts, HTTP errors, malformed data and stale-content hashes surface as explicit errors. The client does not silently substitute a different provider or local result.

The result is `{ rows, method, destination, query, category }`. Rows preserve the corpus's camelCase source fields and add `score` and `retrievalMethod`. Relative source URLs are relative to the project root, not the current nested page. The rendering layer must resolve them against its existing site-root helper and render source text as text, not executable HTML.

## Reproduce the local verification

Install the test dependency outside the product checkout:

```bash
npm install --prefix /tmp/workbench-rag-db --no-package-lock \
  @electric-sql/pglite@0.5.13
PGLITE_PKG=/tmp/workbench-rag-db/node_modules/@electric-sql/pglite/dist/index.js \
WORKBENCH_DB_RECEIPT=/tmp/workbench-rag-db/receipt.json \
  node scripts/test-workbench-rag-db.mjs
```

Use a fresh receipt path for each run. The suite checks migration and seed repeatability; exact round trips for every source; coexistence with the retained sky schema; hidden/retired rows; anonymous/authenticated write denial; service-role curation; function privileges; parameter and size bounds; category filtering; SQL-like input; repeated-query limits; browser URL/key validation; exact outbound payload; response hashes; redirects, timeout and cancellation behavior. Browser transport checks inject a synthetic `fetch`; no external query or credential is used.

Ten authored source-file retrieval questions report whether an expected source appears in the first five results. The evaluation is a diagnostic regression set, not a held-out benchmark. Misses must remain visible and are not an excuse to remove failed examples. This suite does not measure hosted latency, model-generated answers, end-user judgment or predictive validity.

## Executed implementation check

On 2026-11-04, the local PostgreSQL/client suite passed **104 checks** against **3,327 chunks from 188 source files**, corpus SHA-256 `91bd1dc12078430a9ac2737054d6eab2e58f9328a5fc79e135d22d3eaf31a8b6`. The full corpus round-tripped through the SQL seed, including text and provenance hashes. No hosted database or real credential was used. The release process must regenerate and rerun this check when its allowlisted source files change; the JSON receipt binds the exact tested corpus and code hashes.

The ten authored queries placed one of their expected source files in the first five SQL results in **8 of 10 cases**. The two misses remain recorded: “Jung feeling individuation” returned other Jung pages, and “Yoga Sutras editions” returned the Eastern great-works catalogue. This score measures a selected file-ranking expectation, rather than answer correctness. It does not establish an improvement over the local retriever.

A deliberately noisy query containing “penguin” returned genuine Penguin publisher references. Broad lexical OR search can therefore return partially relevant passages for an otherwise unsupported question. The assistant must inspect the evidence and may need to abstain; a nonempty source list is insufficient proof that the question has been answered. A separate query with tokens absent from the corpus returned no sources.
