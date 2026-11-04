# CPU model training and three-round evaluation

This experiment changes actual LoRA parameters in a small local model, compares complete application configurations, and preserves failures. It does not train the existing 4B model, establish astrological predictive validity, or demonstrate that weakening refusals improves evidence use.

## Models and resources

The training base is `Qwen/Qwen3-0.6B` at revision `c1899de289a04d12100db370d81485cdf75e47ca`, Apache-2.0. Its original safetensors file is 1,503,300,328 bytes, SHA256 `f47f71177f32bcd101b7573ec9171e6a57f4f4d31148d38e382306f42996874b`. The executed model has 596,049,920 parameters and loads locally in BF16 with Transformers 4.51.3, PyTorch 2.6.0+cpu and PEFT 0.15.2. Download and environment receipts live in `research/model-lab/` and `local-rag/model-lab/python-lock.txt`.

The host exposes a four-CPU quota, 32 GiB memory and AMD AVX512-BF16 instructions, with no detected GPU. A two-update feasibility probe took 1.476 s and changed adapter parameters. Training uses rank 4 / alpha 8 LoRA on q_proj/v_proj, 573,440 trainable parameters, AdamW with no weight decay, gradient clipping 1.0, no dropout and seed 20261104. Initial and final safetensors and parameter hashes are retained outside Git. This is parameter-efficient fine-tuning, not a renamed prompt edit or retrieval-weight adjustment.

The reference provider remains the pinned Qwen3-4B-Instruct-2507 Q4_K_M on llama.cpp b12110. A separately pinned Qwen3.5-4B Q4_K_M challenger was downloaded and loaded on the same runtime, and evaluated on two development queries. Its revision, license, exact 2,740,937,888-byte file and SHA256 are recorded in `research/model-lab/challenger-download.json`. Release recency is not evidence of superior accuracy.

## Data boundaries

The dataset has 24 original CC0 training examples and 12 development fixtures, spanning nine named traditions without pretending that every tradition supplies a natal horoscope. Four representative development cases are generated in each round: modular tithi arithmetic, Hebrew sunset-boundary scope, Plato's narrative versus an astrological lot, and missing birth-time abstention. All 12 fixtures receive separate structural checks. These checks are not 12 actual model answers.

Eight independently authored final cases are sealed outside the repository during development. Their hash is committed before final configuration freeze. No private readings, full books, development answers or sealed answers are used as training targets. The fixtures are original evaluation explanations, not quotations newly read from the cited historical books. Retrieval, supplied-context generation and real-world predictive validity are different questions; this experiment fixes the supplied source packet instead of silently changing live retrieval.

## Recorded round changes

| Round | Small-model weights | Prompt/settings | Observed development findings |
| --- | --- | --- | --- |
|1 | Untouched BF16 base | Frozen baseline-v1;512-token output ceiling | The small model gave the wrong 14° elongation and malformed/fenced JSON. The 4B answer contradicted itself with 336° and 24° before ending at tithi 3. Its missing-time abstention was sound but lacked an inline citation. |
|2 |24 actual updates at LR 2e-4 on original targets; 18.128 s; adapter delta L2=1.62104 | Frozen evidence-v2, before canonical numeric-context integration | The small adapter regressed: malformed actions/grounding, a citation-only reply, and invented 12:00 PM birth time. The 4B answer hallucinated 124° / tithi 1 and altered a quotation; other scope answers remained useful. |
|3 | Reset untouched base;24 updates at LR 5e-5 on separately versioned, schema-corrected training-only targets; 28.886 s; delta L2=0.563337 | scenario-v3 plus canonical numeric context; final generation receipts follow the frozen configuration | The 4B returned the correct supplied 24°/tithi 3, scope distinctions and missing-time abstention with inline citations. The adapter improved those facts but retained fenced output, omitted inline citations and contradicted its source support in one answer. |

Round 2 training targets lacked inline citations and grounding objects required by serving prompts. Round 3 fixes that objective mismatch using the same original training questions/evidence and a new training-data hash. Two unsupported training definitions were narrowed rather than importing additional facts. The regressed checkpoint is not continued or silently overwritten. No development answer was added to the targets.

The final adapter file is 2,308,432 bytes with SHA256 `b993f01d7d7bab1cde53b12f8afaa3579a1aa06d1d4ab04b4c4ccb49a952bb4e`. Both trained stages updated actual parameters; their training loss is not evidence of correct answers. The smaller adapter remains an optional experiment unless final evidence warrants a different decision.

## What the measurements establish

Each round preserves exact prompt source, fixed selected cases, final message bytes, model/decoding configuration and raw outputs. Numeric-pattern signals, JSON validity, inline and structured citation IDs, exact quote substrings, prohibited-claim patterns, missing-case/duplicate coverage and truncation are reported separately. A valid ID or exact quotation does not prove that the claim follows from the passage. Manual review is needed to catch contradictions such as 336° versus 24° in the same answer.

The 4B runtime uses JSON grammar; the HF runner does not. The 4B temperatures follow the versioned profiles, while the small-model runner is deterministic greedy. Prompts, calculation context and training targets change between rounds. Consequently these are application-configuration comparisons, not a controlled causal estimate of model size, a general accuracy benchmark or a pure isolated weight-effect study. Development samples are reused intentionally and must not be presented as held-out accuracy.

## Running the adapter

See `local-rag/model-lab/README.md` for pinned setup, configuration-based reproduction and the loopback adapter server. `serve-adapter.py` loads the pinned base and explicit PEFT adapter, exposes a bounded local OpenAI-compatible endpoint, accepts one generation at a time and never executes actions. The companion validates proposals before the separate browser preview/Apply flow. No model weights are embedded in HTML, included in Git or silently uploaded to another provider. The ordinary website and source-excerpt mode remain static and usable without a model server.

## Final sealed evaluation and selection

The final configuration was frozen before the eight independently authored cases were opened. The sealed file hash, release time, request snapshots, model settings and after-run source/config integrity check are retained in `final-freeze.json`, `heldout-unseal.json`, `rounds/heldout/` and `post-evaluation-integrity.json`. Both contenders received one pass over the same eight source packets. No prompt, training or generation-setting change followed those answers.

Across the laboratory there were **42 actual generations**: 24 main development answers, two current-model challenger answers and 16 final held-out answers. The final adapter was exercised through its real loopback OpenAI-compatible HTTP server, confirming that the exported weights can be loaded for inference. Two separately authorized product integration smoke requests, if reported elsewhere, are not part of this 42-answer experiment.

| Final contender | Strict JSON | JSON after outer-fence removal | Required inline source IDs | Median / range of latency |
| --- | --- | --- | --- | --- |
| Qwen3-4B-Instruct-2507, scenario-v3 | 8/8 | 8/8 | 8/8; one reply also invented a structured citation ID | 20.079 s / 13.863–23.855 s |
| Final Qwen3-0.6B LoRA, scenario-v3 | 0/8 | 7/8 | 1/8 | 22.601 s / 17.654–35.143 s |

These are protocol counts, **not accuracy percentages**. The 4B model incorrectly calculated forty times 0.2422 as 96.88 rather than 9.688 and reversed the period comparison; it also mislabeled the exact 40° nakshatra boundary. The adapter returned a single-period difference for the forty-period task, repeated a false Maya-correlation premise, failed to classify a boundary, and confused a Chinese intercalary-month identity. Correct-looking quotations did not repair those answers. The independent review retains additional case-level limitations.

On two shared development requests, Qwen3.5-4B gave clearer scope/quotation responses but took 35.612 and 30.524 seconds, versus 21.603 and 13.634 seconds for the existing 2507 provider. Two selected cases do not establish superiority. The selection therefore remains: browser source excerpts first; the 2507 model as an optional experimental interpretation provider; the small trained adapter and newer challenger as documented alternatives that were **not promoted**. Mathematical/calendar facts must come from the canonical calculators, not model arithmetic.

The training process executed 50 optimizer updates in total: a two-step feasibility probe, 24 updates for the regressed stage, and 24 updates from a reset base for the final stage. Only the last 24 updates belong to the released final adapter. Its stored adapter tensors are float32; the frozen base used BF16. The stages shared the same initial adapter-parameter hash, confirming the reset. The final archive contains the adapter, its configuration/training receipt, Apache-2.0 license and pinned-base instructions; the base weights remain a separate download.

`research/model-lab/results-summary.json` provides the raw-output hashes, timing distribution and separate format/citation/quote signals. Supplied-context generation is distinct from the later public RAG corpus rebuild; the benchmark never fetched changing corpus passages during a run. The results support a working reproducible training/evaluation/inference pipeline and expose limitations. They do not establish professional interpretation quality, general model accuracy or real-world astrological prediction.

## Independent agent review

The completed [case-level review](../research/model-lab/independent-review.json) was performed by a separate QA model agent, **not independent human experts**. It manually examined all 24 primary development outputs and the final eight cases per contender. Its dispositions were 3 adequate / 3 partial / 2 incorrect for the 4B provider, and 1 adequate / 3 partial / 4 incorrect for the adapter. These describe a small, deliberately selected convenience set; they are not general accuracy estimates or a validated ranking.

| Final case | 4B review | Adapter review |
| --- | --- | --- |
| H01: Egyptian period comparison | Incorrect: decimal and direction errors; invented structured source ID | Incorrect: uses one period instead of forty |
| H02: Maya correlation constants | Partial: correct two-day difference, missing requested JDN values | Incorrect: repeats the false contradiction premise; omits JDN values |
| H03: 1900 leap-day import | Adequate: Julian/Gregorian distinction and missing-convention request | Partial: core validity is right, but convention request and century rule are missing |
| H04: Nakshatra boundary | Incorrect: wrong sector at exactly 40° | Partial: lists names without classifying points or padas |
| H05: Chinese intercalary-month identity | Partial: refuses merging but omits leap marker from its minimum-field list | Incorrect: contradicts the supplied leap-month identity |
| H06: Hebrew numbering scheme | Adequate: keeps the two schemes distinct and date unresolved | Incorrect: malformed JSON, omitted alternative and false Gregorian uniqueness |
| H07: Dee diagram fidelity | Adequate: retains supported geometry and rejects unsupported additions | Partial: omits central point and explicit classification of additions |
| H08: Jung/Plato quotation provenance | Partial: correct provenance but adds unsupported psychological speculation | Adequate core provenance/reflection boundary; wording remains awkward |

The reviewer verified independent arithmetic (9.688 days earlier; JDN 1,970,761 versus 1,970,763; Krittika / index 3 / pada 4 just before 40° and Rohini / index 4 / pada 1 at 40°), unchanged freeze hashes, and no tuning after release. The sealed scenarios were not source- or domain-disjoint: generic citation, provenance and calendar reasoning intentionally overlap with development/training. No exact held-out questions or shared five-word question fragments were found in those sets, which does not establish semantic independence or absence from pretraining.

This review also explains why keyword and quote checks are insufficient: listing every nakshatra name can match a regex without answering the classification question, and an exact quotation can sit beside an incorrect mathematical claim. Mechanical signals and manual dispositions therefore remain separate throughout the report.
