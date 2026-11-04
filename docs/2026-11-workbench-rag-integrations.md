# Workbench chatbot, retrieval and connection architecture

Research checked on 4 November 2026 against official documentation. The [source ledger](workbench-rag-integration-sources.json) contains retrieved URLs, final redirects, response hashes, reading depth and the claim-to-source map. This report separates documentation evidence, implemented local code and explicitly identified runtime tests. A documentation fetch alone does not prove a configured account, running model, applied database migration or successful remote tool call.

## Four distinct ways to use a model

| Route | What it supports | What this application must supply |
|---|---|---|
| Local model | A locally installed Ollama or llama.cpp model can explain retrieved notes and canonical calculation output. | A running model, bounded local transport, explicit input disclosure and tested model/template compatibility. |
| Standard OpenAI API | Responses requests and application-executed function calls; remote MCP is also documented for the ordinary API route. | A separately billed API credential held by an authenticated backend, not embedded in static Pages JavaScript. |
| ChatGPT plan through an open-source local companion | Current official Sign in with ChatGPT documentation permits eligible Responses inference after a dedicated OAuth grant. | A local runtime with loopback callback, its own dynamic client registration, PKCE/OIDC validation and protected credential storage. Eligibility and granted scopes must be checked. |
| Workbench tools inside ChatGPT | ChatGPT can connect to an MCP server, discover its tools and call them in a ChatGPT conversation. | A reachable supported MCP transport, correct authentication, actual installation/connection and tool discovery. This is a separate user surface from the website chatbot. |

A fifth, simple path remains useful: preview and copy a source-backed packet, then paste it into ChatGPT. That needs no application API key and does not automatically transfer the conversation back to the workbench.

## Current OpenAI facts: identity, plan usage and API billing

The current documentation contains a supported **Sign in with ChatGPT** product. It would be incorrect to state that every third-party use of a ChatGPT plan is impossible. It would also be incorrect to treat an existing website login or a Codex token as a general-purpose credential for arbitrary endpoints.

### Hosted website identity login

The official [website integration](https://developers.openai.com/siwc/website) says this route is a limited trial for selected commercial partners. It requires an issued client ID, exact registered callbacks, OAuth Authorization Code with PKCE, OIDC ID-token verification and a backend that creates the application's own session. [Request a client ID](https://developers.openai.com/siwc/request-client-id) provides the interest form. These website instructions cover identity scopes; they explicitly separate the plan-usage authorization flow below.

Therefore a static GitHub Pages button alone cannot implement this integration. No issued website client or partner enrollment was observed during this research. A setup link can accurately explain the requirement; an active login button must wait for a real configured flow.

### Open-source local companion using the user's plan

The official [overview](https://developers.openai.com/siwc/token-sharing-open-source) documents an optional plan-usage capability for open-source, locally hosted apps. Paid or remotely hosted apps are directed to the interest form. This grant **does not give access to existing ChatGPT conversations or other account context**.

The [registration instructions](https://developers.openai.com/siwc/token-sharing-open-source/sign-in) specify:

1. Generate and persist an opaque host identifier, such as `urn:uuid:<UUIDv4>`, for this installation. Start an HTTP callback listener on **127.0.0.1** before opening the system browser. A callback such as `http://127.0.0.1:1455/auth/callback` is the documented form; do not substitute `localhost`.
2. Generate fresh state, nonce and a PKCE verifier/challenge for each attempt. Initial registration uses `client_id=dynamic_agent_client`, the stable `ext_agent_host_id` and the app's actual `agent_name_hint`. Returning sign-ins use the issued client ID, not that bootstrap identifier.
3. Request `openid profile email offline_access resource.invoke chatgpt.tokens.use.direct`, with `resource=https://api.openai.com/v1`. The user authorizes in the browser. This direct public-client flow requires neither a client secret nor a partner API key.
4. Validate callback state and obtain the issued client ID. Exchange the code with that ID, the verifier and the exact callback URI. Validate the ID token's JWKS signature, issuer, audience, expiry and nonce. A valid identity token alone is insufficient: the returned granted scopes must include `chatgpt.tokens.use.direct` before inference is enabled.
5. Keep each account/client registration separate. Store the companion's own tokens atomically in protected local storage, with owner-only file permissions where applicable. Never read another application's authentication cache or put tokens in browser storage, repository files, URLs, logs or exported chart packets.
6. Serialize refreshes of rotating refresh tokens. Stop active work on sign-out and attempt revocation through the discovered endpoint. Report when local sign-out succeeds but remote revocation could not be confirmed. See [accounts and sessions](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions).

The public [OIDC discovery document](https://auth.openai.com/.well-known/openid-configuration) was fetched successfully and identifies the issuer, authorization/token/revocation endpoints, JWKS URI, RS256 signing and S256 PKCE support. Its advertised identity scopes are not themselves evidence that a particular account received the separate plan-usage scope. No authorization, token exchange or inference was performed in this research.

The [inference guide](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference) uses **`https://api.openai.com/v1/responses`**, not ChatGPT's `backend-api`. It documents account-specific model discovery via `/v1/models`, with visible model entries in `models`, `visibility: "list"`, `display_name` and `slug`. Do not replace this with a stale hard-coded model list.

Current [preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations) are consequential:

- HTTP inference requires `store: false`, `stream: true` and an `input` array carrying the needed history. Use `instructions` or developer messages.
- HTTP `previous_response_id`, persistent `conversation`, `max_output_tokens`, `temperature`, `top_p` and other listed fields are unsupported on this route. Do not reuse an ordinary API request body unchanged.
- Hosted MCP/connectors, file search, Code Interpreter, image generation and Responses `tool_search` are unsupported. Client-side function/custom tools have a supported route with the documented namespace or `additional_tools` structure. Local retrieval and explicit local calculation dispatch remain viable.
- Success requires a terminal `response.completed`. A stream may start and later fail because of plan limits. Preserve `response.failed`, incomplete streams and interrupted requests as different states. Eligibility and workspace restrictions can also deny use.

There is no compulsory special SDK for this direct flow. The official examples use HTTP or the standard OpenAI Python SDK, passing the OAuth access token as the bearer credential. A maintained OIDC/JWT library is appropriate for validation; the website sample uses Node crypto and `jose`. The documented [Codex app-server option](https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server) accepts **the companion's own authorized token**, has a specific Responses provider configuration and requires the companion to manage renewal. Ordinary `codex login` is a supported CLI authentication action, not permission to extract its tokens for another client.

Recommended delivery: keep the static site's deterministic reading available; offer a clearly labelled **local companion setup** for this optional plan route. A separately hosted inference backend should use ordinary API billing unless its own approved plan-usage integration is configured. [OpenAI's billing help](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform) distinguishes standard API billing from ChatGPT billing. No billing fallback should occur silently.

## MCP inside ChatGPT and through the ordinary API

The former Apps SDK URLs currently redirect to the [Plugins documentation](https://developers.openai.com/plugins/build/mcp-server). The [connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt) supports public HTTPS with Streamable HTTP, usually `/mcp`, or the official Secure MCP Tunnel for private/local development. A development tunnel is not the public endpoint required for plugin submission. Account and workspace policies apply.

The current documented ChatGPT flow is Plugins → add custom MCP server → configure connection and authentication → create as a plugin → review discovered tools. After a server change, refresh metadata and verify the tool list in a new conversation. The website's Pages URL is not an MCP endpoint.

For authenticated servers, [OAuth 2.1 guidance](https://developers.openai.com/plugins/build/auth) requires protected-resource metadata, authorization-server discovery, resource/audience validation and PKCE. Supported client-identification approaches include CIMD, dynamic client registration and predefined OAuth clients. A single fixed bearer secret in a static site is not a substitute for this user authorization flow.

The standard Responses API [remote MCP guide](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) documents Streamable HTTP or HTTP/SSE, selected tool import, authorization and approval handling. These standard-API capabilities must not be conflated with the narrower plan-usage preview. Likewise, an OAuth access token for Workbench's MCP server is not an OpenAI inference credential.

The initial inspected repository catalogue contained **78 tools**. The current source catalogue now contains **81**, including `workbench_rag_search`, `workbench_desktop_chart` and `workbench_desktop_action_preview`. Its README records an older private Sites MCP deployment, while explicitly warning that the newer source catalogue does not prove the deployed backend was updated. Retain that distinction. Required remote acceptance is authenticated initialize → tools/list → representative tools/call, with the deployed revision and schema compared to the intended release. Existing local protocol tests do not replace it.

## Retrieval architecture: keep arithmetic in tools

The existing source pack and `workbench_source_search` already provide a useful local baseline. Expand those conventions rather than introducing a second untracked corpus.

1. Resolve the user's declared instant, coordinates, time zone and method through the canonical engines or validated MCP adapters. Do not ask a language model to invent planetary positions or infer missing birth times.
2. Retrieve only source chunks relevant to the question and declared tradition. Each chunk should retain a stable ID, work, author, edition/translation, precise locator, source URL, rights, reading depth, original/derived status, content hash and retrieval version. Track variant rules separately.
3. Build a bounded evidence packet with computed facts, relevant sources and explicit missing information. Retrieved passages and external documents are **untrusted reference data**; they cannot alter system instructions, grant permissions, request secrets, choose external endpoints or trigger tools by themselves.
4. Generate a readable answer using **claim → computed evidence → named rule/source → limitation**. Request concise explanations, not private chain-of-thought. Distinguish astronomy, traditional interpretation and practical reflection in the answer.
5. Resolve cited IDs against the supplied packet and show the source passage/locator. Identifier validation alone does not prove that the passage supports the sentence. Test that relationship separately, including abstention when evidence is missing.

If tools are model-selected, expose a narrow allowlist of read-only adapters with strict schemas and bounds. Validate every call independently of the model. Keep calculation outputs tagged as canonical data; reject arbitrary code, shell commands, URLs or a user-forged trusted chart object. Cap calls, total work, context and output; cancel stale work when the selected chart changes. A model should not gain autonomous access to saved charts or private notes because retrieval is enabled.

Evaluate retrieval and answers separately: held-out questions, exact arithmetic agreement, source/locator support, correct tradition selection, appropriate abstention, prompt-injection resistance, latency and memory. Compare lexical, vector and hybrid retrieval on the same frozen corpus. Fine-tuning is a later, separate experiment with a rights-cleared training set; it is not achieved by adding a document to RAG.

## Supabase: optional shared public-reference store

Official [full-text search](https://supabase.com/docs/guides/database/full-text-search) supports generated `tsvector` columns, GIN indexes and ranked RPC queries. [Vector columns](https://supabase.com/docs/guides/ai/vector-columns) use pgvector with dimensions matched to the selected embedding model. The [hybrid search guide](https://supabase.com/docs/guides/ai/hybrid-search) combines lexical and semantic results using reciprocal-rank fusion. These are storage/retrieval mechanisms, not automatic improvements to answer accuracy.

The repository already includes a curated-public-reference table, published-only read policy, bounded security-invoker RPC and reproducible seed generator. Its prior PGlite tests and small retrieval comparison are local evidence, not an applied hosted migration. Local retrieval previously outperformed the tested PostgreSQL query on that small authored set; this report supplies no new quality result.

For a hosted deployment:

- Keep public source notes separate from private charts, questions and journals. The latter are outside the existing public-reference schema.
- Enable RLS on every exposed table, revoke unnecessary grants, and grant only the operations each role needs. Policies do not remove broad grants. Validate anonymous, authenticated and privileged paths against actual deployed data.
- A publishable key can be used by a browser only with correct grants/RLS. `service_role` bypasses RLS and must stay server-side. Do not put model credentials into client JavaScript or database rows readable by clients.
- Preserve local retrieval as the offline fallback. Show which retrieval backend answered, when its corpus was updated and whether it failed or returned no matches.
- When adding vectors, store embedding model/revision/dimension with each index version. Query with the same embedding model and rebuild deliberately when changing it; do not mix incompatible spaces.

Reference: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). No Supabase project was connected or migrated by this research lane.

## Local model options and actual environment observations

[Ollama](https://docs.ollama.com/api/introduction) documents a local API at `http://localhost:11434/api`, OpenAI-compatible endpoints under `/v1`, tool calls and embeddings. Local service requests do not require a cloud API key; cloud models are a separate route. Its [embedding guide](https://docs.ollama.com/capabilities/embeddings) requires the same embedding model for indexing and querying. Its [FAQ](https://docs.ollama.com/faq) documents loopback binding and explicit allowed origins. Avoid exposing an unauthenticated local inference server to the public network; a local companion can mediate permitted browser requests.

[llama.cpp](https://github.com/ggml-org/llama.cpp) documents CPU, GPU and mixed inference, quantized GGUF models and an OpenAI-compatible server. The [server documentation](https://github.com/ggml-org/llama.cpp/tree/master/tools/server) includes chat, dedicated embedding mode, authentication and configurable CORS. Use an explicitly selected current build and compatible chat template; endpoint shape alone does not prove correct tool calling.

The official `QwenLM/Qwen3.5` README currently covers Qwen3.5, Qwen3.6 and Qwen3.8. Calling Qwen3.5 the latest state of the art would therefore be inaccurate. For a bounded first experiment, the exact [Qwen3.5-4B model card](https://huggingface.co/Qwen/Qwen3.5-4B) specifies a 4B language model with a vision encoder and Apache-2.0 licensing. The maintained llama.cpp documentation explicitly supports the Qwen3.5 series. This identifies a candidate, not a tested local model or quality recommendation. Select a specific model revision and quantization, retain its licence and hash, and benchmark a modest context before attempting long contexts or images.

The initial read-only environment inspection on this date observed five visible logical CPUs, a cgroup quota of four CPU equivalents, a 32 GiB memory limit, no NVIDIA/DRI device nodes, and no `ollama`, `llama-server` or `nvidia-smi` executable on PATH. That describes the research lane's initial inspection, not the environment after implementation by other agents.

The separate local-model implementation lane subsequently downloaded pinned **Qwen3-0.6B Q4_K_M** weights and llama.cpp, verified their hashes and ran real CPU inference. See [the local companion guide](../local-rag/README.md) and its [exact model/runtime manifest](../local-rag/model-manifest.json). Actual smoke and follow-up records were inspected at `/workspace/artifacts/workbench-rag/actual-model-smoke.json` and `actual-model-followup.json`; these are execution-environment artifacts, not a claim of public model hosting. The small model produced weak explanations and at least one incorrect claim about changing the chart, documented in the companion guide. Those runs establish actual local inference, not state-of-the-art quality, fine-tuning, scientific predictive validity or a broad benchmark. The 4B candidate discussed above was not the model used in those tests.

## Required evidence before showing a connection as working

For each provider, record the configured transport separately from actual successful inference. Exercise unavailable service, malformed response, timeout, cancellation, late callback and changed-chart states. For OAuth, additionally test wrong state/nonce/audience, expired tokens, missing plan scope, rotating refresh, denied consent and sign-out. Protect credentials in every error path. For MCP, verify actual remote discovery and bounded calls. For Supabase, verify deployed grants/RLS and retrieval results. None of these is established merely by a successful documentation fetch or an enabled UI control.

## Local SIWC adapter implemented in this pass

`local-rag/chatgpt-login.mjs` implements the reviewed local companion flow with an injected, environment-aware HTTP transport. Its default state is disconnected. The adapter exposes explicit sign-in, callback, status, sign-out, server-only token access and an on-demand account model catalogue. It stores only an opaque host ID and validated client/subject registration in its own owner-only file under the user's configuration directory; access, refresh and ID tokens remain in process memory. Restarting requires sign-in again and reuses the validated registration. No other application's session file is inspected.

The optional route wrapper requires the exact companion Origin and `X-Workbench-Request: 1` for login/logout mutations. Its callback uses the one-time state/PKCE/OIDC transaction. A server integrating these functions directly must provide its own equivalent explicitly scoped origin/CSRF checks, Host validation and rate/size bounds. Tokens returned by `getAccessToken()` are for the server's provider call only and must never be copied into a browser response.

`node scripts/tests/chatgpt-login.mjs` passed **124 assertions across 28 scenarios**. Fixtures use real generated 2048-bit RSA keys and RS256 signatures; invalid signatures, issuer/audience/nonce/expiry, replay, denied scopes, unexpected discovery, file permissions/symlinks, serialized rotating refresh, bounded revocation and sign-out races are exercised. Late code/refresh responses cannot reactivate a signed-out session; discarded code grants and late rotated refresh credentials are revoked. Sign-out reports outstanding code-exchange revocation separately. Synchronous session-invalidation subscriptions and revision numbers let the server abort inference across tabs when authorization changes. An expired initial code retains the issued registration only in memory for a new attempt, without accepting it as an identity. The source ledger records tested-file hashes.

These tests use mocked HTTP responses. No actual user completed OAuth, no live model entitlement was established, and no ChatGPT plan inference was performed by this lane. A real `response.completed` from the selected account/model remains required before describing inference as verified.

### User sign-in quickstart for the implemented companion

1. From the repository root, run `npm ci --prefix local-rag --ignore-scripts`, then `npm start --prefix local-rag`. A local language model is not required for the ChatGPT plan route.
2. Open **http://127.0.0.1:8844/pages/desktop.html**. Use the **Research & chart assistant** section, select **ChatGPT plan · local companion login**, and choose **Sign in with ChatGPT**. Follow **Continue to official ChatGPT sign-in** and complete the account's consent. If started on the public website, its button first offers the exact local companion link: login mutations deliberately require the companion's own origin.
3. After the loopback callback, return to the local workbench and choose **Check connection**. Authorization and model configuration are shown separately. A source search works without either.
4. While authorized, open **http://127.0.0.1:8844/api/chatgpt/models** or run `curl --fail http://127.0.0.1:8844/api/chatgpt/models`. This endpoint returns available model names/slugs and the selected configuration, never the OAuth token. Choose a returned `slug`.
5. The current server selects the model through its environment. Stop that server and restart it with `CHATGPT_MODEL='model-slug-from-catalog' npm start --prefix local-rag`, replacing the quoted example with the actual returned slug. Because tokens are memory-only, repeat sign-in after this restart; its saved client/host registration is reused. Do not assume that merely setting this variable establishes model entitlement.
6. Ask a question, choose **Prepare model request**, inspect the exact destination and shared data, and choose **Send reviewed request**. Including chart inputs is separately optional. Only a completed provider response establishes that this account/model worked for that request. **Sign out** clears the local session, cancels related requests and attempts remote revocation.

This deliberate two-stage setup avoids guessing a model before the account-specific catalogue is available. A future persisted model preference can remove the configuration restart without persisting OAuth tokens. The current steps remain accurate for the implemented server routes.
