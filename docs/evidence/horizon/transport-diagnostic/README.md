# Horizon preset transport diagnosis

These are preserved diagnostic experiments, including rejected candidates. They are not replacement release gates. The original product was commit `c956473ea6f9ceec85db224557381bc9f1b46410`; its `assets/js/core/event-horizon.js` SHA-256 was `427165f7c0e91db41ce91d2efd6719d065cff067ab54e502ba470be3c75c2d9f`.

Pinned Playwright Chromium `145.0.7632.6` ran on the actual complete preset, with an HTTP server at a GitHub Pages style project subpath. The default viewport was 1365×900, reduced motion was enabled, and service workers were blocked. Browser transport events were captured before page teardown. Controlled candidate changes were applied only to the module bytes returned by the diagnostic server; the product files were unchanged until the final proof passed.

## Reproduction and rejected hypotheses

The inherited release sweep reported all five preset requests as `net::ERR_ABORTED` before closing the page. The dedicated horizon driver had monitored runtime, console and HTTP errors but had not subscribed to `requestfailed`; its earlier functional and visual acceptance did not establish a clean transport lifecycle.

[`receipt.json`](receipt.json) and [`probe.mjs`](probe.mjs) retain the four-way comparison of `Content-Length` present/absent and Playwright routing enabled/disabled. Those runs produced respectively 3, 4, 2 and 3 failed-request events. All five manual readers reached EOF, checksum/schema validation completed, and the full ledger activated in every case. Instrumented `AbortController.abort`, reader cancellation, reader errors and page lifecycle hooks showed no application cancellation preceding the failures. Thus neither a missing response length, request routing nor intentional page teardown explained the reproduced failures.

[`stream-experiment.json`](stream-experiment.json) preserves the controlled reader changes. Explicit `reader.releaseLock()` still produced three failures in each of two runs; yielding after EOF produced four. Native `arrayBuffer()` on the original response produced none. [`lifetime-experiment.json`](lifetime-experiment.json) tested retaining the response wrapper: one run had no failure, the next had four, so retention was not accepted as a fix. Three further native-consumption runs had no failures.

[`native-pipeline-proof.json`](native-pipeline-proof.json) is a rejected bounded `TransformStream` consumed through a newly constructed `Response`: its first clean load still produced two failed requests. Native consumption of the original fetched response was the material distinction in these tests. The underlying browser implementation mechanism is not established by this evidence.

## Accepted bounded-fetch candidate

[`native-monitor-proof.json`](native-monitor-proof.json) passed **24 checks** across five scenarios:

- Three complete loads, two with chunked responses and one with `Content-Length`: all five requests finished, zero requests failed, the 1,525-date ledger activated, and no hidden abort occurred.
- A chunked case file with one byte beyond its declared limit: the byte-limit error was retained and exports remained disabled.
- Delayed part responses followed by an ordinary Cancel click: the visible state stayed cancelled and exports remained disabled. A fresh restore completed all five requests with no spontaneous abort. The four failed requests caused by the explicit cancellation remain in the receipt.

The candidate consumes the original response using `arrayBuffer()` while a clone is read concurrently to count received bytes. A per-request controller aborts transport on overflow and is linked to the caller's cancellation signal. The caller listener is removed on settlement. The existing header guard, final byte-count check, hashes and schema validation remain. If overflow rejection races with the native abort rejection, the specific byte-limit error takes precedence; explicit caller cancellation retains `AbortError`.

The earlier error-precedence failure is preserved in [`native-monitor-overflow-message.json`](native-monitor-overflow-message.json) with its exact script. It rejected the oversized response but displayed the generic native abort message. It was corrected before the accepted proof.

This protects accepted payload size and requests cancellation when the monitor observes overflow. It is not a claim of an exact peak-memory bound: browser networking and the stream tee can buffer bytes before JavaScript observes them.

Accepted proof SHA-256: `0c13932c447230cba31199882ec744c88c472220bc506a7576360e50d965b6e1`. The served experiment module SHA-256 was `984b60f49975e9eeb420e81b0e010089b1a89b533844792fabbda967cb6282e5`. The integrated helper has the same control flow with expanded formatting and comments; integrated core SHA-256: `3dcfe2dc0b45546013d3bce7ebead5a714b9a9fc26abfed4bab472755d805222`.

## Replaying the diagnostic

The archived scripts retain their original machine paths, `/workspace/astrology-sim-ant` and `/workspace/setup-validation/horizon-fetch-diagnostic`, and the pinned Playwright installation under `/tmp/atlas-ci-playwright`. They expect the original commit's core module so their served-byte substitutions can be applied; they intentionally reject a substitution that does not match. Use an isolated checkout of the recorded baseline and adjust those explicit paths if reproducing elsewhere. Run with `PLAYWRIGHT_BROWSERS_PATH=/tmp/atlas-ci-browsers` and the corresponding pinned Playwright package. [`files.sha256.json`](files.sha256.json) binds the archived scripts and raw receipts.

The integrated product must be tested separately after regenerating its source-bound preset. The root release record and strict loader/browser regression receipts supply that subsequent acceptance; these served-module experiments alone do not assert deployment readiness.
