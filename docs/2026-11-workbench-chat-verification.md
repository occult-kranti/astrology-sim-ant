# Workbench source assistant — independent verification

4 November 2026. The integrated source assistant passed **83 browser checks** across HTTP, a real loopback mock companion, 320px mobile layout, and the actual downloadable HTML opened through `file://` with networking disabled. There were no unexpected runtime errors, automatic external requests, or changes to the inspected source files during the accepted run.

The separate actual-model experiments have a different result: **both local Qwen runtimes answered, but neither sampled explanation was fully supported and accurate**. The 4B sample improved the explanation and citation format while retaining an astronomical error. The browser acceptance result does not establish model quality. Local source excerpts remain the default; generated synthesis requires a deliberate reviewed request.

## Accepted evidence

| Item | Value |
|---|---|
| Browser driver | `scripts/browser-workbench-chat.mjs` |
| Browser / Node | Chromium 151.0.7922.34 / v24.19.0 |
| Browser receipt | `/tmp/workbench-chat-qa/run-05/receipt.json` |
| Receipt SHA-256 | `3d58f7cffd8481c2449607ee306d97f10e81a716bbf3319cdaa74bb3c59fa1a1` |
| Completion | `2026-11-04T20:22:24.931Z` |
| Source inventory SHA-256, before and after | `3dd3ec6e6bb32fff99e19c0a9a98f10de6c3e91eba50f35ded9943be13037492` |
| Indexed corpus | 3,327 chunks from 188 public repository files |
| Corpus SHA-256 | `91bd1dc12078430a9ac2737054d6eab2e58f9328a5fc79e135d22d3eaf31a8b6` |
| Standalone HTML size | 4,955,297 bytes |
| Standalone SHA-256, before and after | `c75ad73bdf93e91f601f4b2a29417e05c2e08a8254331d774b1ec00eb105aa96` |

The source inventory covers `assets/`, `pages/`, `index.html`, and the browser driver. The receipt retains the exact HTTP mock requests, screenshots, downloaded study files, and hashes. Mock responses exercise the transport and UI contract; they are explicitly marked as fixtures and are not evidence of real model inference.

## Browser behavior checked

- Local search for `Lilly houses` returns identifiers from the actual selected corpus. The expanded source excerpt exactly equals its bounded retrieved passage. Source IDs and reading depth remain visible. An unsupported unique query yields no invented citations.
- `switch to whole sign` initially produces a proposal. Clicking Apply changes the exported canonical chart: every house cusp has the expected whole-sign boundary. The offline file passes the same calculation check.
- Manual chart edits invalidate an earlier proposal, including an unsaved change. A retained disabled DOM button cannot override that edit. Structured JSON edits, failed parsing, unknown action types, and new source searches invalidate older proposals. A model reply with no `actions` property removes prior action cards.
- The model settings make no automatic connection. Health is requested only through Check connection. Plain HTTP away from loopback, credential-bearing URLs, paths, and query-bearing origins are rejected before Send can be enabled.
- Preparing a request sends nothing. The actual HTTP body is identical to the displayed JSON. Private chart inclusion starts off; the source-only body omits the synthetic test profile. Explicit inclusion displays and sends the selected canonical chart inputs. Editing the question invalidates the prepared request.
- The `open_tool` action for the MCP guide resolves to the exact HTTP site route or canonical HTTPS destination in the standalone file. A narrow test capture of the deliberate `window.open` call checks `noopener,noreferrer` and verifies that no chart data is appended in a URL query or fragment; the test does not navigate to an external service.
- A valid model action still requires Apply. An action with an extra arbitrary URL is rejected even when a forged server audit claims acceptance. Hostile answer markup stays literal text. Source titles and links are resolved from canonical chunks rather than accepting hostile response metadata.
- A fabricated citation is flagged despite a claimed valid server audit. A source identifier check is not treated as proof that the answer follows from the source.
- Stop, an unsaved manual chart edit, and a new structured action review prevent a delayed model response from replacing the current state. HTTP 503 and malformed JSON leave no applicable response action; a subsequent valid request recovers.
- A mock Supabase RPC receives only `query_text`, `match_count`, and `category_filter`, without chart fields. Starting that search disables earlier chart proposals. A delayed Supabase result cannot overwrite a newer local answer. This verifies the browser RPC contract, not a deployed Supabase project.
- The chat does not silently persist the synthetic private chart or conversation in browser local/session storage. Provider secrets are absent from the browser fixture.
- At 320 CSS pixels, source results and expanded model controls remain within the viewport. The prepare button is keyboard focusable. The reviewer visually inspected the final desktop source answer, mobile settings, and standalone source answer screenshots.

The fixes prompted by independent review are covered by regressions: stale structured JSON proposals, failed structured review retaining a previous Apply button, and responses without actions inheriting previous proposals. The final accepted run contains all of those regressions, plus the integration fix for opening an absolute tool destination from the standalone catalogue.

## Actual offline file

The accepted artifact was `/workspace/artifacts/desktop-workbench/desktop-chart-studio.html`. The browser context starts offline and opens that exact `file://` URL. A separate **test-only** network probe fails with `net::ERR_INTERNET_DISCONNECTED`; that probe is not part of the delivered app. The recorded requests consist only of the HTML file and this explicit probe.

Local retrieval returns the same bounded excerpts as the current corpus module. Source links resolve to deliberate HTTPS references rather than broken sibling-file paths. Source search, no-match handling, proposal review, Apply, and native study download work without a server. There are no external script or stylesheet dependencies and no automatic provider, remote, or sibling-file requests. Optional generative models still need a running companion; the model weights are not embedded in the HTML. The file is a downloadable local app, not a ChatGPT-hosted website.

This report verifies the new assistant against the new artifact. The earlier [standalone verification](2026-11-desktop-standalone-verification.md) records a different, pre-assistant artifact hash and must not be mistaken for evidence about this build. Broader original chart and storage checks are described in [desktop verification](2026-11-desktop-verification.md).

## Actual local-model experiment: runtime succeeds, quality fails

An independent request was sent to the running loopback companion at `127.0.0.1:8844`, backed by the pinned llama.cpp/Qwen3-0.6B Q4_K_M setup. It used provider `local`, no chart context, and this public question:

> Explain the difference between tropical and sidereal zodiacs using the provided sources. State any limits of that explanation.

The response was HTTP 200 from `workbench-qwen3-0.6b-q4`, in **8,433 ms**. No actions were returned or applied. Its prose incorrectly said that the sidereal zodiac is based on the Earth's rotation, then contradicted its own account of tropical and sidereal definitions. It also repeated statements and supplied no inline source identifiers. The independent citation audit returned `valid: false`, `missing: true`, although the response included a structured source object. The original companion prompt requested a separate `citations` array without explicitly requiring inline markers; the UI's stricter inline check therefore exposes a format mismatch. That mismatch is separate from the factual failure. A source object alone does not make unsupported prose accurate.

Raw evidence: `/tmp/workbench-chat-qa/actual-model/receipt.json`, SHA-256 `a25be07949885ebbc6909d9f2d86c941d7eeae07364090ee4413500436551445`. This is a single sampled failure, not a comparative model benchmark. It demonstrates that the runtime executes, while **the small model is not validated as a trustworthy interpreter**. The app's separate tests show that absent or fabricated answer citations remain visible as unverified, and that prose cannot itself execute chart actions. More capable models need their own source-grounded evaluations; neither a different model nor a successful HTTP call should be assumed to fix this result.

### Stronger-model regression: improved, still not fully accurate

The same exact public question was subsequently sent once to **Qwen3-4B-Instruct-2507 Q4_K_M**, alias `workbench-qwen3-4b-q4`, using four CPU threads, an 8,192-token context and a bounded 700-token response setting. The companion prompt had also been updated to request inline bracketed source IDs in addition to its structured citation array. Because both prompt and model changed, this is a regression sample, not an isolated experiment on model size or a held-out benchmark.

The response was HTTP 200 in **27,295 ms**, with no actions and a valid inline source identifier. It correctly distinguished an equinox reference from a stellar reference, described the approximately 24° offset used by this site's Lahiri convention, and identified limitations of the supplied source and predictive interpretation. However, it also said the sidereal zodiac is “fixed relative to the celestial equator and the constellations.” The celestial equator's orientation precesses relative to the stars; the cited passage does not support that assertion. The sample therefore improves on the 0.6B answer without passing complete factual or source-entailment review. A valid citation identifier did not prevent unsupported prose.

Raw evidence is retained separately at `/tmp/workbench-chat-qa/actual-model-4b/receipt.json`, SHA-256 `58fed4e82a4a5f45ad362e44b4744b9e68112ef4a28bea462cabb51aec0f8a09`; the original 0.6B receipt is unchanged. The exact three public retrieval passages used for manual review are archived in `/tmp/workbench-chat-qa/actual-model/source-evidence.json`. No private birth chart was supplied in either independent regression request. Neither local model is certified as an authoritative interpreter by this work.

## Scope limits

The corpus contains project explanations, reference notes, catalogue metadata, and public project-document text. Its reading-depth labels distinguish those classes. The work does not establish that third-party books were ingested in full or that a model was trained or fine-tuned. Retrieval rank is relevance, not factual confidence. Astrology's predictive accuracy and source entailment are not validated by these tests.

No real OpenAI API generation, authenticated ChatGPT subscription generation, hosted Supabase deployment, screen-reader session, physical mobile device, or non-Chromium browser was exercised by this QA lane. The loopback mock verifies browser handling of those protocol shapes, not credentials, provider availability, or hosted-service quality. The actual-model experiment above is separate and preserves its unsuccessful semantic result.

## Reproduce

With an installed Playwright package and Chromium:

```sh
WORKBENCH_CHAT_OUTPUT=/tmp/workbench-chat-qa/new-run \
WORKBENCH_CHAT_STANDALONE_HTML=/workspace/artifacts/desktop-workbench/desktop-chart-studio.html \
node scripts/browser-workbench-chat.mjs
```

`PLAYWRIGHT_PKG` may select an existing package by absolute path and `CHROME_PATH` an installed Chromium binary. The standalone variable is optional; omitting it runs only the HTTP browser journeys and must not be reported as offline-file acceptance. Use a new output directory because the harness refuses to overwrite an existing receipt. Rebuild and reverify if any bundled source changes.
