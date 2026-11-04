# Reading Lab: independent verification, 4 November 2026

The frozen Reading Lab browser candidate passed **185 checks** in real Chromium, with no runtime errors, unexpected external requests or asset changes during the run. Independent source inspection supports **24 listed field comparisons across eight examples**; nine other examples are textual studies and receive no numerical validation credit. The local models still make material errors. Source excerpts remain the default, and generated explanations remain reviewable drafts.

This is a separate QA agent's review, not a human expert certification, a full-book reading, or validation of astrological forecasts. The browser transport tests use an actual loopback **HTTP mock**; the 42 model generations described below are a separate, actual CPU inference experiment.

## Three review rounds

| Round | Evidence inspected | Finding and correction |
|---|---|---|
| 1: contract and baseline | Existing chart/source methods, reading API proposals, model datasets and prior failures | Unified the nine framework IDs; required date-only inputs to omit a clock and observer; kept Christian computus a distinct method within the Lilly group; separated source arithmetic, textual interpretation and personal readings. The reading assistant received a dedicated context union instead of a fabricated natal profile. |
| 2: implemented review | Canonical engine, primary source documents, rendered UI, model outputs | Rejected duplicate case IDs and sparse/getter-bearing arrays; removed unavailable map controls from keyboard order; cleared stale source-match claims on edits. Primary-source inspection found four erroneous inherited Lilly longitudes and unsupported complete-chart verification. The corrected example now explicitly withholds unresolved axes, houses and automated judgment. A corrected provisional browser run passed 166 checks. |
| 3: frozen acceptance | Final public assets, all 17 case flows, exact-quote inspector, 16 heldout model responses | Final browser run passed 185 checks at 320/390/1440/1920 pixels. Literal quotation matching replaced whitespace-normalized matching to agree with the server. Frozen model/configuration hashes still matched after the heldout run; no further training or prompt tuning followed its release. Remaining semantic failures are retained below. |

The first provisional browser run had one harness failure: Playwright `.uncheck()` expected the last selected framework to remain unchecked, whereas the interface correctly restored its at-least-one guard. The harness was corrected to click and assert that one remains. That run is preserved rather than represented as an application failure or silently discarded.

## Source checks

The source lane records [17 cases and 24 source records](../research/reading-lab/source-ledger.json), plus four mechanism notes. QA separately retrieved ten source documents/endpoints, inspected the selected text and rendered HKO tables, and independently inspected the primary Lilly scan. Expected fields were checked against those materials, not merely recalculated with the same project helper.

| Example | Independently checked source fact | Fields |
|---|---|---:|
| Smithsonian Maya | The converter's explanatory prose gives 2012-12-20 as `12.19.19.17.19`, 3 Kawak, 2 K’ank’in. | 5 |
| Christian computus | USCCB's 2024 table gives 31 March; the Coptic calendar gives 5 May under its distinct convention. | 2 |
| Rao, Example 2, printed p.14 | Moon 84°12′ minus Sun 227°46′, normalized, is 216°26′; tithi 19, Krishna Chaturthi. | 2 |
| HKO Chinese New Year 2024 | 10 February is lunar month 1, day 1. | 3 |
| HKO intercalary month 2023 | 20 February starts month 2; 22 March repeats month 2. The leap-month identity is an explicitly labelled inference from that repeated month. | 3 |
| Hebcal | 2024-10-03, before sunset, is 1 Tishrei 5785; the Intl spelling alias `Tishri` is declared. | 3 |
| Lilly cazimi example, printed pp.113–114 | Sun 15°30′ Taurus and Mercury 15°25′ Taurus differ by 5′, within the stated 17′ convention. | 2 |
| Lilly dog figure, primary 1647 printed p.392 | Sun 15°45′ Virgo, Moon 4°10′ Virgo, Mercury 12°20′ Libra, Saturn 18°15′ Taurus. | 4 |
| **Total** | Selected calendar/position fields; no validation of reported outcomes. | **24** |

Dee's selected main-body theorems III–VI were checked as symbolic geometry: solar circle and visible central point, lunar semicircle above, and right-angled cross. Jung's selected 1923 definitions of feeling and individuation were inspected as textual frameworks. These are not numerical day predictors. The Plato comparison distinguishes a narrative about choosing lives from a later named Lot of Spirit calculation. No numerical score or whole-tradition validation is assigned to these textual readings.

The Lilly correction matters beyond the new page. The inherited [worked examples page](../pages/book2/examples.html) now labels four printed longitudes as checked and three other planetary rows as inherited/unverified. The wheel, dignity ledger, axes, house assignments and automated full judgment are withheld. Lilly's recovery narrative is labelled his reported outcome, not an independently established event. The source ledger retains the before/after discrepancy.

Independent source receipt: `/tmp/reading-lab-qa/sources/retrieval-receipt.json`. Selected-field audit: `/tmp/reading-lab-qa/source-audit.json`. Primary scan SHA-256: `0245b83baf50febaabeb17eb0acdf4375c2aac8b3cd319b9ca4e551e9fe2cbc9`. Raw source downloads are outside the repository; their availability does not grant redistribution or model-training rights.

## Browser and server acceptance

Reproduce the browser gate with [the committed driver](../scripts/browser-reading-lab.mjs), installed Playwright and a fresh output directory:

```bash
PLAYWRIGHT_PKG=/path/to/playwright/index.mjs \
READING_LAB_OUTPUT=/tmp/reading-lab-qa/fresh-run \
node scripts/browser-reading-lab.mjs
```

The driver serves the actual repository and a separate loopback mock, hashes all `assets/`, `pages/`, `index.html` and itself before and after, captures native exports and screenshots, and refuses to overwrite a receipt. Do not set `READING_LAB_ALLOW_MUTATIONS=1` for acceptance; that option is only for explicitly provisional reviews.

Final environment: Node `v24.19.0`, bundled Chromium `151.0.7922.34`, Playwright package at `/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`. Final receipt: `/tmp/reading-lab-qa/round-3-final/receipt.json`, completed `2026-11-04T21:09:07.828Z`.

| Receipt field | Value |
|---|---|
| Checks / acceptance | 185 / true |
| Runtime errors / unexpected external requests | 0 / 0 |
| Changed files during run | 0 |
| Receipt SHA-256 | `5e89718845a76cdebd84f07be329349566eff149446c11ce1f2bac588c4c16a0` |
| Before and after source-manifest SHA-256 | `d58fcbe6056ea0fc584bf8b8942a53e684692488ac0892717280fd5dba7ad433` |

The meaningful journeys cover:

- All nine frameworks and all 17 public examples, explicit Load/Calculate, exact case identity in export, and `outcomeEvaluable:false`.
- Date-only studies without invented instants, clocks, observers or houses; untimed textual examples with blank date/zone; edits removing stale reference-match credit and disabling held exports.
- Common-range rejection, the skipped Apia civil date 2011-12-30, New York's nonexistent 2024-03-10 02:30, and the repeated 2024-11-03 01:30 with exact earlier/later UTC instants of 05:30Z and 06:30Z.
- A known clock without coordinates, geographic-pole limitations, out-of-range latitude, inert markup in a synthetic place label, CSV formula neutralization, and absence of automatic custom-study storage.
- Keyboard map activation/focus, a CDP accessibility-tree button check, unavailable map controls removed from tab order, at-least-one selection, filtered cases, and mobile/desktop reflow.
- No provider call on opening the assistant or using local retrieval. Study inclusion is off by default. Source-only request bodies exclude the synthetic private date. Opted-in date-only requests use `context.reading` without fabricated time/coordinates; source examples send only their registered case ID.
- The actual mock HTTP body equals the reviewed JSON. Edited context invalidates prepared requests and late responses. The reading bridge rejects chart-changing actions. Malformed action JSON never becomes applicable.
- `MODEL DRAFT` presentation; valid exact quotations; fabricated, unknown-ID, whitespace-altered and overlength quotations requiring review; inert model claim markup. An exact excerpt match explicitly does **not** establish semantic support.
- The existing Lilly dog example's partial-source notice, four checked and three unverified rows, withheld wheel/judgment, and attributed historical outcome.

Final screenshots were actually viewed: `desktop-1920-initial.png`, `mobile-320-source.png`, `provider-1440-quote-review.png`, and `inherited-figure-1440-partial-source.png`, in the final receipt directory. The three-panel desktop layout remains distinct; mobile text and source controls reflow; draft/quote warnings and the inherited-chart limits are visible. The receipt includes all 13 screenshot hashes. This is not a physical-device, screen-reader or multi-browser certification.

Independent command reruns also passed:

- `node scripts/tests/reading-lab.mjs`: **8,166 assertions**, 36 casts, 17 cases, 24 listed reference fields. Most assertions are boundary/consistency checks, not 8,166 independent gold standards.
- `node scripts/tests/local-rag-server.mjs`: **109 HTTP/mock checks** after the final context-budget and deployment-runtime changes, including the reading/desktop context union, bounded canonical recomputation, selected-excerpt quote validation and retained auth/concurrency behavior. This command performs no actual model inference.

Static review confirmed that deployed inference now uses the frozen `scenario-v3` prompt builder, profile temperature and retrieval settings, with those settings disclosed in health output. Browser and server both require literal selected-excerpt substrings. The server bounds quotes to two items and 12–180 characters and explicitly returns `semanticSupportValidated:false`. The final product runtime caps output at **512 tokens**, admits **one request at a time**, and uses a **110-second server deadline** within the browser's 120-second bound. Explicit bounded environment overrides remain available. The immutable prompt profile still records its original 1,000-token recommendation; the deployment cap is a separate runtime limit. The controlled model experiment used 512 tokens from the outset.

The final server-only guard was independently rerun after browser acceptance: its pinned llama.cpp default renders the actual chat template, tokenizes it, and reserves the output budget plus 32 boundary tokens against the explicitly configured 8,192-token window. Oversized or unavailable configured preflight fails before generation; it does not silently remove calculated facts. Custom providers default to a disclosed `off` mode with no tokenizer-specific fit claim. This is a request-size check, not an answer-quality check, and does not change the browser assets covered by the receipt.

### Separate post-benchmark integration correction

Two public integration calls followed the 42 frozen benchmark generations. The Rao response returned the correct supplied numbers, approximately 216.43° and tithi 19, but described the formula incorrectly using an absolute difference and omitting the floor operation. Its exact-quote check passed, demonstrating again that substring validation does not validate reasoning. The Hebrew date-only call timed out at the prior 60-second server deadline.

The runtime was then adjusted from 1,000 output tokens/two admissions/60 seconds to 512 tokens/one admission/110 seconds. The prompt, weights and source corpus remained unchanged. Exactly one authorized retry of that failed **integration** request returned HTTP 200 in 37.357 seconds. QA independently compared the saved provider request messages: they were identical; the output-token cap was the only changed provider-payload field. This retry is not an additional heldout test and does not alter the frozen benchmark totals or dispositions.

Transport recovery did not make the reading reliable. The retry incorrectly suggested that 3 October 2024 before sunset could still be 29 Elul, conflating the previous civil day's transition, and assumed that 6 PM was before sunset despite the absent location. It also lacked inline source IDs and had a rejected quotation. No further retries or tuning are justified as part of this sealed evaluation. The UI retains the draft and source-review warnings.

Receipts are preserved under `/workspace/artifacts/reading-lab-integration/final-corpus/` and `/workspace/artifacts/reading-lab-integration/runtime-correction/receipt.json`. Final reviewed server SHA-256: `4b579ed44a4792bf71544c55ba8a567a0b8e63d90ec0481def892e31cc65ffb3`. The prompt SHA-256 remains `b1abb14bd9738633579e2afbd8fca3c9a619027cd4a543fcc4cd4cd96731dd0e`. These server-only changes leave the 185-check browser asset receipt applicable.

## Training execution and split audit

The [model methods](2026-11-local-model-methods.md), [training report](2026-11-model-training.md), [raw rounds](../research/model-lab/rounds/) and [final freeze](../research/model-lab/final-freeze.json) preserve the executed experiment. There are **42 actual generations**: 24 primary development outputs (four scenarios × two configurations × three rounds), two Qwen3.5 challenger outputs and 16 final heldout outputs. Twelve development fixtures exist, but only D05/D07/D09/D10 were generated in each primary round; do not imply all twelve were repeatedly evaluated.

The final LoRA was genuinely trained on CPU: 573,440 trainable parameters, 24 updates, 28.886 seconds and nonzero parameter delta L2 of `0.5633369998964586`. Its 2,308,432-byte adapter SHA-256 is `b993f01d7d7bab1cde53b12f8afaa3579a1aa06d1d4ab04b4c4ccb49a952bb4e`. The base Qwen3-0.6B revision is pinned; initial/final adapters and weight-delta receipts are retained outside public assets. The final adapter was loaded through its actual loopback inference server. This establishes execution and reloadability, not improved reading accuracy.

QA authored eight unseen scenarios covering all nine frameworks, outside the public corpus and training directory. The set was sealed at `2026-11-04T20:41:12.506222+00:00`, SHA-256 `da92b50c805396af7decbc437d250164ab8106295633b844cc1088f079829b39`. Final model/prompt/runtime configurations were frozen at `2026-11-04T20:57:13.574786+00:00` before release to the inference agent. The frozen source/config hashes still matched at independent review. No further tuning followed release.

The dataset audit found 24 original training records, 12 development records and eight heldout records. All final training rows are labelled training; the v3 changes affect assistant targets, not training questions. No exact heldout-question duplicates or shared five-word question shingles were found against training/development questions. Generic evidence-use and provenance skills deliberately overlap. This is **unseen-scenario transfer**, not source-disjoint, domain-disjoint or pretraining-independent evaluation.

The development failures remain material: the initial small model produced 14° instead of 24° elongation; the initial 4B response mixed 336° and 24°; round two's 4B gave 124°/tithi 1; round two's adapter invented noon and houses for an unknown clock. Round three's adapter denied that a source supported its answer while also listing real source citations and quotations.

Round three simultaneously changed the prompt, training targets, learning rate and reset checkpoint. Crucially, its D05 request added a canonical `computedPartition` containing **24° and tithi 3**, absent in rounds one and two. Restored numbers can be copying a supplied calculation; they do not demonstrate learned arithmetic or an isolated benefit from the weight update. The 4B inference also uses JSON grammar whereas the HF adapter does not, and model precisions differ. Fixed source packets test supplied-context generation, not live retrieval quality.

## Independent heldout answer review

Each answer was read against the question and supplied evidence; mechanical ID/substring counts were kept separate. “Adequate” means the core requested factual and scope answer is supplied without a material semantic error. “Partial” means required content is missing or an unsupported qualification needs editing. “Incorrect” means a material mathematical, identity or interpretation error remains. These are heterogeneous convenience-sample dispositions, **not an accuracy estimate** or a validated ranking score.

| Heldout case | Qwen3-4B-Instruct-2507, scenario-v3 | Final Qwen3-0.6B LoRA |
|---|---|---|
| H01: forty-period civil drift | **Incorrect:** 96.88 days later; the stipulated calculation is 9.688 days earlier. Also invents a structured source ID. | **Incorrect:** 0.2422 days earlier, missing the factor of forty. |
| H02: Long Count correlation sensitivity | **Partial:** correctly explains a two-day convention difference, but omits requested JDNs 1,970,761 and 1,970,763. | **Incorrect:** omits the JDNs and repeats the claim of arithmetic contradiction despite the different conventions. |
| H03: Julian/Gregorian century leap | **Adequate:** correct separate validity, century rule and request for the calendar convention. | **Partial:** correct validity and no silent normalization; does not explicitly request the missing convention. |
| H04: exact nakshatra boundary | **Incorrect:** A is correct; B at 40° is wrongly Bharani/index 2, rather than Rohini/index 4/pada 1. | **Partial:** lists all supplied names for both points without classifying either point or its pada. |
| H05: intercalary-month identity | **Partial:** correctly refuses merging but omits the leap flag from its minimum-identity sentence. | **Incorrect:** contradicts itself about the leap flag and calls its supplied status unknown. |
| H06: Hebrew numbering ambiguity | **Adequate:** Tishri/Adar II alternatives, no unique date without the numbering scheme. | **Incorrect:** malformed JSON, omitted Tishri alternative and false permission for a unique Gregorian date. |
| H07: faithful Dee components | **Adequate:** preserves specified components and limits historical/predictive scope. | **Partial:** restores semicircle/cross but omits the central point and explicit adaptation classification. |
| H08: reader text versus author quotation | **Partial:** preserves reader authorship and no diagnosis/destiny, but adds unsupported psychological-projection speculation. | **Adequate core:** reader attribution, reflection label, no diagnosis/destiny; wording remains awkward. |

Disposition counts are 4B **3 adequate / 3 partial / 2 incorrect**, adapter **1 / 3 / 4**. No general success percentage is inferred. The eight scenarios were selected deliberately; there are no repeated seeds, confidence intervals or independent human annotations.

Mechanical results illustrate why separate review is necessary:

| Check | 4B, eight responses | Adapter, eight responses |
|---|---:|---:|
| Strict JSON | 8 | 0 |
| JSON after outer-fence removal only | 8 | 7 |
| All required inline source IDs | 8 | 1 |
| Responses with unknown source IDs | 1 | 0 among parsed answers |
| Median generation time | 20.079 s | 22.601 s |

The malformed adapter H06 receives no parsed-content credit. Exact quoted text can accompany a wrong answer, as H01/H04 show. A regex can find both expected names in a list that never classifies either point, as adapter H04 shows. The evaluator preserves strict format failure and separately permits only outer-fence removal for content review; it does not repair arbitrary JSON. Numeric pattern signals are not arithmetic tolerance tests or entailment judgments.

The two Qwen3.5 development answers preserve the central D05/D09 distinctions, but D05 also receives the calculated helper. D09's supporting paraphrase shortens “order in which lives are chosen” to “select lives.” Two cases and longer observed latency do not establish general superiority, so that challenger remains experimental.

Raw heldout receipts: [4B](../research/model-lab/rounds/heldout-4b.json), SHA-256 `1a0bfe7b5f923d8939ef6eca4ced2a1ca0e5e360600fe46ecdc0f5e5caf3e898`; [adapter](../research/model-lab/rounds/heldout-adapter.json), SHA-256 `f910dad8ebaeb70078af6b5276beba284759a789f56053b70bf244e58eb31738`. [Independent detailed audit](../research/model-lab/independent-review.json), SHA-256 `07d972d286bc24b0b2892e35c25bce20ef70e80a9421362554758c961037ab9e`, is the hash-verified copy of QA's `/tmp/reading-lab-qa/model-semantic-review.json`. The document's case table also preserves its conclusions.

The acceptance decision is to keep source excerpts as the browser default, optional 4B synthesis labelled as a draft, and both the trained adapter and two-case challenger explicitly experimental. Numerical results should come from checked calculators; model prose does not establish an event forecast, life outcome, diagnosis or historical attribution.

## Scope remaining

This receipt covers the HTTP Reading Lab and the existing worked-example correction. Standalone/full-offline packaging, the complete site sweep, the MCP protocol gate and database integration have separate release receipts. No hosted Supabase deployment or browser-embedded generative model is claimed here. The reviewed public RAG manifest contains 3,417 chunks, 191 files and 235 source units, corpus SHA-256 `79c889ae1919357b48063efc64b21590483ba5186ed08f40859714e7b8168a63`; those are project excerpts and source notes, not the complete referenced books.
