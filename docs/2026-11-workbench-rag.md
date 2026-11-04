# Research chat and canonical chart controls

The desktop studio now has a source-first research assistant. Open `pages/desktop.html`, choose **Research chat**, and ask about a calendar, chart method, named book or tool. **Search local sources** returns excerpts, stable citation IDs, source locators and reading-depth labels without an account, network request or language model. Example commands such as “Switch to whole-sign houses” also prepare a chart action. **Apply to chart** is a separate action against the current calculated state.

## What is indexed

The reproducible public allowlist covers page explanations, method documents, source notes, book/practitioner catalogues, glossary and selected Vedic tables, and actual MCP tool metadata. It spans ten categories: charts, calendars, timing, Vedic methods, symbols, books, research, software, tools and sources. See the generated [manifest](../research/workbench-rag/manifest.json) and [coverage report](../research/workbench-rag/coverage.json) for exact counts and hashes.

This is not the full text of every referenced book or repository. `full-text` marks the complete **project-authored document** inspected; `reference-note` and `metadata` retain their different scope. External URLs are citations, not proof that the external work was ingested. Private readings, saved chart libraries, downloaded videos, credentials and research telemetry are excluded. New acquisitions require a deliberate public allowlist entry with rights and reading depth, followed by regeneration and review.

The local retrieval layer uses title/tag-weighted BM25 with bounded evidence and source diversity. It is deterministic lexical retrieval, not a trained embedding model. The optional language model synthesizes the retrieved evidence. No fine-tuning was performed. A source-ID match checks provenance identifiers; it cannot establish that a model's sentence follows from the source or that an astrological prediction is reliable.

## A complete interaction

1. Search locally and expand **Retrieved passages & provenance**. A no-match response remains visible rather than substituting an unsupported answer.
2. To generate prose, start the [local companion](../local-rag/README.md), select a provider and check its connection. The tested CPU option is a pinned llama.cpp runtime with Qwen3-4B-Instruct-2507 Q4_K_M, with remaining explanation errors documented in testing. Other compatible models can be configured separately.
3. Optionally include the current chart inputs. This checkbox starts off. It sends explicit profile dates, clocks, time zones, coordinates and selected methods, not a saved chart library. The server recalculates using the canonical engines and rejects browser-supplied derived positions.
4. **Prepare model request** displays the exact outbound JSON, provider and destination. **Send reviewed request** performs that request. A new question, edited chart or cancellation invalidates the pending response and proposals.
5. Inspect the answer and its source passages. Any chart action is normalized through a strict finite schema, previewed by the canonical engine and applied only after a separate click. Changing the chart invalidates an earlier proposal. Responses are displayed as inert text.

Chat questions, conversation content and provider keys are not persisted by this panel. The initial version processes one explicit question at a time; include the relevant context in a follow-up. There is no hidden cross-question memory or private chart retrieval.

## Chart action surface and MCP

The ten action types cover natal/transit/synastry mode, tropical/Lahiri zodiac, four house systems, bounded orb, selected body, wheel/position/aspect view, bounded time steps, reset time, complete new chart profiles, and navigation to an allowlisted toolkit page. Creating a chart requires all seven profile fields: name, local date, local time, IANA time zone, latitude, longitude and DST disambiguation policy. The engine retains explicit polar fallback and unresolved-clock behavior. A proposal cannot delete a chart, browse a private library, execute JavaScript, fetch an arbitrary URL or install software.

The existing toolkit remains callable through its normal MCP transports. New tools are `workbench_rag_search`, `workbench_desktop_chart` and `workbench_desktop_action_preview`; these return data or previews and cannot operate a browser. The catalogue records **81 local tools**. This does not establish that an older remote deployment exposes the new tools. See the [MCP guide](../mcp/README.md) and [current integration research](2026-11-workbench-rag-integrations.md). The website assistant does not autonomously dispatch every MCP tool or control every specialist page.

## Optional connections

The [Supabase migration](../supabase/migrations/202611040001_workbench_rag.sql), seed exporter and browser search client provide a shared public-reference store. Published-only reads, denied client writes, bounded security-invoker search and source-content hashes are tested locally. Configure a project URL and publishable/anon key explicitly; service-role keys are rejected by the browser client. No project was available for a live migration in this session. Supabase stores reference passages, not this user's conversations or chart profiles. It is not itself a deployed language model.

An ordinary OpenAI API connection uses server-side credentials and separate API billing. The official open-source local-app **Sign in with ChatGPT** route uses the companion's own OAuth grant with a loopback callback, PKCE and OIDC verification; it does not reuse another application's login. Eligibility, consent and model entitlement remain account-specific. Website identity login and MCP installation are separate routes. Source-linked requirements and fixture-test limitations are recorded in the integration report. No live OpenAI API call or user ChatGPT authorization is claimed.

## Evaluation and delivery

Retrieval tests check corpus identity, source location, no-match behavior, budgets and bounded latency. Action tests compare canonical calculations and reject unsafe schemas. Browser tests exercise actual requests, disclosure, stale-state prevention, cancellation, source IDs, inert model text, keyboard use and narrow-screen layout. Database and OAuth protocol tests are recorded separately from the real CPU-model smoke test. The initial 0.6B experiment found vague house-system explanations and a false claim that an action had already occurred; the UI never executed those claims. The subsequent 4B configuration copied a provided Sun longitude/house correctly and improved the zodiac answer, but still added inaccurate or unsupported explanations. Both the model and citation instructions changed. Neither configuration is validated as a reliable interpreter. Local source excerpts remain the default.

The single HTML download includes the chart studio and reference retrieval. The static-library ZIP includes the existing workspaces. The local-companion ZIP adds the backend, setup recipe and MCP source; model weights download separately and remain outside Git. None of these artifacts is a newly hosted ChatGPT website. The feature branch remains `feat/desktop-astrology-workbench`; GitHub Pages publication is deferred under the previously discussed branch policy.

To update the corpus, run `node scripts/build-workbench-rag.mjs` after changing allowlisted sources. Then regenerate the optional SQL seed and offline inventory, run their `--check` gates and the relevant tests, and rebuild the standalone download. Preserve actual file hashes and distinguish a code build, a configured service and a successful live connection.
