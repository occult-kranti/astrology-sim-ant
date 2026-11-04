# Optional local model and RAG companion

This companion connects the static chart studio to a local language model. It retrieves the public workbench source corpus, optionally recomputes explicitly shared chart inputs, and returns a generated answer with source-ID and proposed-action validation. It never executes a model's action proposals. The browser's separate preview/Apply flow remains responsible for any chart change.

The static website and its extractive reference answers work without this server. A language model is an optional additional interpretation layer. The included CPU setup uses **Qwen3-4B-Instruct-2507 Q4_K_M**, a quantized open-weight model, with **llama.cpp**. It is not state of the art, fine-tuned, clinically validated or a forecasting system. The 4B model improved on an earlier 0.6B experiment, but its three actual evaluation answers still contained explanation errors despite valid source identifiers. The browser therefore starts with reference excerpts. Treat generated interpretations as experimental, inspect their sources and review every action.

## Run the tested CPU configuration

Requirements: Linux x86_64, Node 22+, Python 3.12+, about 4 GB of free disk for the model/runtime/cache and at least 8 GiB of available RAM (a 16 GiB system is recommended). A GPU is not required. The pinned download recipe is for Linux x86_64; other platforms can configure their own local OpenAI-compatible server, but were not tested here.

From the repository root:

```bash
npm ci --prefix local-rag --ignore-scripts
python3 local-rag/setup-model.py
node local-rag/start-model.mjs
```

The setup downloads a 2,497,281,120-byte (2.497 GB) Unsloth quantization of Qwen's model and the pinned llama.cpp CPU release. Both hashes and lengths are verified before use; the runtime archive is extracted with Python's safe data filter. Files go under `~/.cache/astrology-workbench`, outside Git. The model's base license is Apache-2.0; llama.cpp is MIT. Exact repository revisions and download hashes are in `model-manifest.json`.

In a second terminal:

```bash
npm start --prefix local-rag
```

Open **http://127.0.0.1:8844/pages/desktop.html**. Select the local-model provider in the chatbot and check its connection. The bridge probes `/v1/models` on port 8845 and reports ready only when its configured model identifier is present. A reachable server alone does not count as model readiness.

For a different cache directory:

```bash
python3 local-rag/setup-model.py --directory /path/to/model-cache
node local-rag/start-model.mjs --directory /path/to/model-cache
```

No access token or API key is required for the tested local model. Stop either process with Ctrl-C. This cloud session's running loopback service is a test instance, not a publicly hosted endpoint for another computer.

## Optional provider settings

Set variables in the **server process environment**. `.env.example` lists names; `.env` is ignored by Git and is not loaded automatically. With Node 22, an explicitly prepared local file can be used with `node --env-file=local-rag/.env local-rag/server.mjs`. Never put a key in an HTML file, repository, URL or browser storage.

- `RAG_PORT`: bridge port, default 8844; binds 127.0.0.1 only.
- `RAG_LOCAL_BASE_URL`: loopback `/v1/` URL, default `http://127.0.0.1:8845/v1/`. Remote hosts and credential-bearing URLs are rejected.
- `RAG_LOCAL_MODEL`: local served model identifier; default `workbench-qwen3-4b-q4`.
- `RAG_LOCAL_ENABLED=0`: disable local inference without affecting reference retrieval.
- `RAG_TIMEOUT_MS`: 1,000–120,000 ms, default 110,000, leaving margin below the browser’s 120-second request limit.
- `RAG_MAX_TOKENS`: 64–1,500 generated tokens, default 512. This deployment cap applies to the local model and optional API-key provider, not the ChatGPT token-sharing route.
- `RAG_MAX_CONCURRENT`: 1–4, default 1 to match the pinned model’s single inference slot; extra concurrent requests receive a busy response.
- `RAG_PROMPT_PROFILE`: registered prompt configuration; default `scenario-v3`.
- `LOCAL_CONTEXT_PREFLIGHT`: `llama.cpp` or `off`. It defaults to `llama.cpp` only for the pinned default model and default loopback base URL; custom models or endpoints default to `off` for compatibility.
- `LOCAL_CONTEXT_LIMIT`: configured local runtime window, 1,024–131,072 tokens, default 8,192. Set it to the actual runtime setting, not a model card’s larger maximum.
- `RAG_ALLOWED_ORIGINS`: additional exact HTTP(S) origins, comma separated. No wildcard or URL path.
- `RAG_ALLOW_FILE_ORIGIN=1`: explicitly allow `Origin: null` for a downloaded HTML file. Prefer the same-origin localhost page; allowing null origins also permits other local/sandboxed documents that send that origin.

For the separate OpenAI **API-key** route, set both `OPENAI_API_KEY` and `OPENAI_MODEL`. Requests use the fixed HTTPS Responses endpoint, `store:false`, and a bounded answer length. API credentials and billing are separate from a ChatGPT website subscription. The health endpoint reports credential configuration rather than pretending that a live API request was verified. No paid API inference was run in the cloud validation.

For the official optional **Sign in with ChatGPT** local-companion route, see the repository's SIWC integration note and `chatgpt-login.mjs`. Sign-in is explicitly initiated; this companion does not read Codex credentials, browser sessions or another application's tokens. Set `CHATGPT_MODEL` to a model actually offered to the authorized account. Authorization does not prove entitlement to a guessed model. The reviewed request contract uses `stream:true`, `store:false` and an input array; success requires `response.completed`. Access/refresh/ID tokens remain in process memory. A separate owner-only file stores an opaque host ID and validated registration metadata. Signing in and real account inference require the user's own browser authorization and were not performed by the automated tests.

Remote provider requests use Undici's environment-aware proxy agent with the inherited CA trust. Local inference remains loopback. The bridge does not remove managed-network proxy settings or accept a request-supplied upstream URL.

## Request contract

`GET /api/health` returns safe readiness fields for the local model, API-key configuration, ChatGPT connection and local retrieval, including the loaded corpus hash and chunk count. It never returns credentials. An explicitly requested `GET /api/chatgpt/models` lists models offered to an authorized account; it does not change `CHATGPT_MODEL`. Sign-in and sign-out POSTs require the companion’s exact 127.0.0.1 origin and `X-Workbench-Request: 1`; downloaded-file and hosted-page users should open the companion URL to manage that connection.

`POST /api/chat` accepts JSON:

```json
{
  "question": "Why do the house systems disagree?",
  "provider": "local",
  "requestId": "a-client-generated-id"
}
```

`provider` is `local`, `openai` or `chatgpt`. The question is limited to 3,000 characters; reference retrieval uses its first 2,000 characters and reports truncation. Requests are limited to 64 KiB. Optional `context` is `{ "inputs": <canonical desktop study inputs>, "selection": { "body": "Sun", "frame": "primary" } }`. Inputs include the two explicit profiles, mode, zodiac, house system and orb. Selection is optional. The server validates inputs and recalculates positions; browser-provided derived planetary rows are rejected. No chart is inferred when context is absent.

Responses include:

- `answer`: model-generated text, distinct from deterministic chart output.
- `citations`: accepted source objects; `retrievedSources`: all retrieved source objects.
- `citationAudit`: cited/valid/unknown IDs and formatting status. This checks identifiers, not whether each claim follows from the cited passage.
- `actions`: at most three structurally valid proposals. `actionAudit` explicitly states that none were executed; rejected proposals are reported.
- `provider`, `model`, `usage`, `contextIncluded`, `requestId`, `timing` and retrieval details.

Errors return a non-200 status with `{ "error": { "code": "…", "message": "…" } }`. Input errors, unavailable providers, rate limits, aborted requests and timeouts are distinct. The client must discard stale responses by its held chart/revision identity. The server aborts upstream work when the client disconnects or the timeout expires. ChatGPT logout or account replacement also aborts active requests across tabs; a session revision check discards late token acquisition and provider responses.

## Boundaries

Only public `pages/`, `assets/` and `docs/` files, plus a few static root files, are served. No directory listing, `.git`, environment file, private reading or model cache is exposed. Host validation limits DNS-rebinding paths; CORS uses an exact origin allowlist and JSON-only requests. The server is intended for one user's local machine, not shared public hosting. It has no account authentication, rate billing or multi-user isolation suitable for an internet deployment.

The RAG corpus is local lexical BM25 retrieval over an allowlist of public repository notes and reference records. It is not an embedding model, model training, full-book acquisition or proof that all cited books were read. Retrieved text is treated as untrusted reference data. No source passage or model output is executed. Private chart inputs are held only during their request and are not logged or stored. Model weights are not included in Git or the static HTML.

## Verification

```bash
node scripts/tests/local-rag-server.mjs
node scripts/tests/chatgpt-login.mjs
```

The server tests use mock providers for reproducible HTTP, CORS, request limits, privacy, source/action validation, timeout and Responses/SSE behavior. The SIWC tests use generated test keys and mocked identity responses; they do not establish live authorization.

Separate actual Qwen smoke artifacts are retained under `/workspace/artifacts/workbench-rag/` in the execution environment. They record the pinned model/runtime, hardware limits, real latency, raw public-input outputs and quality limitations. The observed cloud machine had a four-CPU quota, 32 GiB memory limit and no detected GPU. These few cases are not an accuracy benchmark or professional-astrology validation.

### Actual CPU model evaluation

The final optional setup uses the pinned 4B model above, an 8,192-token runtime context, four generation threads and one inference slot. Three sequential public-input queries took **26.442, 28.525 and 27.295 seconds** on the observed four-CPU-quota host. Process RSS/high-water memory after the first two queries was about **5.65 GiB**; this is an observation, not a worst-case capacity guarantee. The local provider has a bounded timeout and can be slower on another machine.

| Public-input case | Observed result | Remaining limitation |
| --- | --- | --- |
| Placidus versus Whole Sign | Identified different division methods and returned a valid source ID | Described Placidus imprecisely and said the first Whole Sign house begins at the ascendant, without specifying 0° of the rising sign; the explanation is not validated. |
| Recomputed Greenwich example chart: Sun longitude and house | Returned 222.08° and house 11, matching canonical engine values at displayed precision | One factual extraction sample does not establish general interpretation accuracy. |
| Tropical versus sidereal, independently reviewed | Improved equinox/star reference explanation, approximate 24° offset, explicit source limits and a valid inline citation | Incorrectly linked a fixed stellar frame to the celestial equator; the passage did not support that claim. |

Earlier Qwen3-0.6B outputs and their failures remain in the external evidence artifacts. The 4B run also changed the prompt to explicitly request inline citation IDs; this is a comparison of configurations, not an isolated model-size experiment. Two startup requests returned unavailable-provider errors before readiness and did not produce model answers; those receipts are preserved separately. No further model calls were made to tune these three results. Those earlier 4B smoke tests involved no model training, professional validation, paid API inference or live ChatGPT authorization. A subsequent, separate CPU experiment trained a small Qwen3-0.6B LoRA adapter; it does not alter the 4B base model or establish predictive validity.

### Separate experimental adapter training

The later three-round model laboratory performs actual parameter-efficient training on 24 original CC0 examples, compares frozen development configurations and reserves eight independently authored cases for a final sealed evaluation. See [the training report](../docs/2026-11-model-training.md) and [reproduction/adapter instructions](model-lab/README.md). The regressed first adapter and corrected final adapter are preserved with parameter hashes and raw model failures. The smaller adapter is an optional experiment; it is not the selected default. No base weights are embedded in the website or committed to Git.

### Reading Lab context and the current prompt

The companion now defaults to the frozen `scenario-v3` prompt in `model-prompt.mjs`: local temperature 0 and up to five retrieved excerpts within the retrieval estimator’s 2,100-token budget. Deployment caps output at 512 tokens without changing the frozen profile’s text or evaluation settings. `RAG_PROMPT_PROFILE` can explicitly select the registered `baseline-v1`, `evidence-v2` or `scenario-v3` configuration. Health responses identify the selected profile, actual output cap, timeout, concurrency and retrieval limits; chat responses identify the profile actually used. These are prompt configurations, not three independently trained models. The optional ChatGPT route retains its reviewed Responses/SSE parameters; the local temperature and output-token settings are not silently added to that route.

In addition to desktop chart context, an explicitly approved request can disclose a Reading Lab study:

```json
{
  "question": "Explain this civil-date conversion and its scheduling limits.",
  "provider": "local",
  "context": {
    "reading": {
      "dateISO": "2024-10-03",
      "timeZone": "UTC",
      "frameworks": ["hebrew"]
    }
  }
}
```

For a public worked example, use `"context": {"reading": {"caseId": "vedic-rao-tithi-example-2"}}`. The two reading forms are exclusive. Reading context cannot be mixed with desktop `inputs` or `selection`, and the server rejects caller-supplied results, expected values, source claims or extra fields. It recomputes a bounded export through the canonical Reading Lab engine. Omitted clocks remain omitted: a date-only study cannot acquire a birth instant, ascendant or houses. A textual source example cannot become a numerical prediction score.

All calculated facts and current method limitations are retained in the compact export; one shortened explanatory source example per family is included. Serialized canonical context is limited to 32 KiB, and the complete provider JSON payload to 96 KiB. Oversized requests receive an explicit error asking for fewer selected frameworks; the server does not silently discard chart facts. Byte limits alone are not tokenizer guarantees.

For the default pinned local setup, each request sends its actual messages to llama.cpp’s `/apply-template`, then counts the rendered prompt through `/tokenize`. Generation starts only when prompt tokens + configured output reserve + a 32-token boundary margin fit `LOCAL_CONTEXT_LIMIT`. An oversized request returns `CONTEXT_WINDOW_EXCEEDED`; an unavailable configured tokenizer returns `LOCAL_CONTEXT_PREFLIGHT_UNAVAILABLE`. Neither case starts generation. For a generic local endpoint such as a differently configured Ollama service, explicitly leaving this check off preserves compatibility; health and response metadata disclose that token fit was not verified. The byte bounds still apply, and provider failures remain explicit errors.

A measured nine-family exact-moment example used 6,747 prompt tokens plus the reserved 1,000 output tokens and 32-token margin in the pinned model’s 8,192-token context: 7,779 total. Its date-only counterpart used 5,193 + 1,000 + 32 = 6,225. Both were rechecked against final corpus `79c889ae1919357b48063efc64b21590483ba5186ed08f40859714e7b8168a63`; serialized canonical contexts were 20,873 and 17,693 bytes respectively. Different questions, text and retrieval packets change the budget, so the live per-request check is authoritative for the selected configuration. The pinned llama.cpp runtime reports context shifting disabled by default.

The response now includes `grounding`, a bounded array of `{sourceId, quote, claim}`, and `groundingAudit`. At most two quotations of 12–180 characters can pass, and each must be an exact substring of the **selected excerpt actually sent to the model**. A quote found only in omitted source text fails. Unknown source IDs, missing inline markers and failed quotation checks remain visible. Accepted quotation strings are returned so the browser can inspect them independently. Exact text agreement does not establish that the claim follows from the quotation: `semanticSupportValidated` remains false, and every generated response remains a draft with a warning. Action proposals still require a separate review and Apply step.

Public Reading Lab integration smoke receipts are stored separately from the sealed model evaluation under `/workspace/artifacts/reading-lab-integration/` in the execution environment. They preserve requests, canonical-context sizes, actual tokenizer measurements, corpus/profile identifiers and raw outputs, including failures. Those transport smoke calls do not expand the sealed evaluation or establish interpretation or predictive accuracy.

On 4 November 2026, two initial authorized public smoke calls used the frozen `scenario-v3` prompt, the final corpus above and the existing Qwen3-4B server. They ran sequentially through a temporary companion on port 8847 after the independent model evaluation finished. Their initial deployment settings were a 1,000-token output cap and a 60-second timeout; both original receipts remain preserved below.

| Public input | Calculated context and observed result | Limitation retained |
| --- | --- | --- |
| Rao’s source-worked longitude example | 3,528 context bytes; 2,165 prompt tokens; HTTP 200 after 54.481 seconds. Reported 216.43° and tithi 19; one exact excerpt quotation passed. No birth clock was supplied. | The model nevertheless wrote an incorrect absolute-value formula and omitted the floor operation from its generalized tithi formula. A valid quote did not detect these semantic errors. |
| Date-only Hebrew civil study, 2024-10-03 UTC | 3,419 context bytes; 2,071 prompt tokens; tokenizer fit passed. No birth instant, houses or sunset religious date was inferred. | HTTP 504 after 60.029 seconds: the default provider timeout produced no completed model answer. The failed response and request are retained; it was not retried or counted as a correct interpretation. |

Complete receipts, raw provider output where a response completed, and API failures are in `final-corpus/` under that artifact directory. Prompt file SHA-256: `b1abb14bd9738633579e2afbd8fca3c9a619027cd4a543fcc4cd4cd96731dd0e`. These two smoke outcomes are separate from deterministic calculation checks and from the sealed model evaluation.

After these two integration calls, deployment defaults were corrected to a 512-token output cap, one concurrent request and a 110-second timeout. This aligns admission with the single local inference slot and uses the output cap already exercised by the separate frozen model laboratory. The prompt, weights, model choice, retrieval settings and sealed evaluation were unchanged. Exactly one additional verification of the previously timed-out Hebrew public input was authorized; its new receipt is separate from the retained 504 and is not a held-out score or prompt-tuning trial.

That one repeat completed with HTTP 200 in 37.357 seconds, using 2,071 prompt tokens and 449 output tokens. Its complete message array was byte-identical after JSON serialization to the previous request, and the canonical context still had `timeKnown:false` and `instantISO:null`. It used 2,070 cached prompt tokens, so elapsed times do not isolate the effects of the runtime changes. The answer correctly named 1 Tishrei 5785 but incorrectly described the pre-sunset day boundary and assumed a 6 PM event was before sunset without a location. One quotation failed the exact-excerpt audit and an inline citation was missing; the response remained a flagged draft. The new receipt and raw outputs are under `runtime-correction/`. Total integration generations: three, with no further retries or model/prompt tuning. These retained interpretation failures limit the chatbot’s role even though transport and calculation checks pass.
