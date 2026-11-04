# Local model methods and measured improvement protocol

Reviewed 4 November 2026. This workbench can run a local language model and can train a small, real LoRA adapter on the available CPU. That establishes execution, not reliable interpretation of every calendar. The experiment keeps numerical calculation in the existing engines, supplies bounded reference passages to the model, and measures mistakes in generated explanations separately from formatting and latency.

The [primary-source ledger](../research/model-lab/sources.json) records 53 retrieval attempts, content hashes, revision pins, licenses, reading depth and failed accesses. Most papers were reviewed at abstract and bibliographic level; selected implementation sections and model-card sections received closer inspection. This is a targeted methods and feasibility review, not an exhaustive state-of-the-art leaderboard or a claim to have read every referenced book.

## What changes, and what does not

| Method | What is changed | Use in this project | What the method does not establish |
| --- | --- | --- | --- |
| Source-grounded prompting and RAG | Prompt and selected external passages | Implemented local lexical retrieval and versioned answer prompts; preserve source IDs and exact quotations | No model weights are trained. A retrieved passage can be irrelevant or misinterpreted. |
| Hybrid retrieval and reranking | Candidate retrieval/ranking, possibly a separate learned ranker | Researched: lexical + dense rank fusion, then a bounded reranker | Researching an embedding model is not generating embeddings or demonstrating better retrieval. |
| LoRA supervised adaptation | Low-rank trainable matrices added to a frozen base | Actual CPU training on Qwen3-0.6B; parameter hashes and raw outputs retained | An adapter for 0.6B does not improve the separate 4B checkpoint. Lower training loss is not answer accuracy. |
| QLoRA | Low-rank adapters over a frozen quantized base | Researched; the executed probe instead uses a BF16 frozen base | A Q4_K_M GGUF used for inference is not a QLoRA training run. |
| DPO | Preference loss changes model/adapter weights using chosen/rejected responses | Researched; no DPO run claimed | Preference optimization needs defensible preferences and can reward persuasive wrong answers. |
| ROME / MEMIT | Direct edits to selected factual-association weights | Researched; no edited checkpoint produced | Editing an association is not learning a calendar algorithm or validating a prediction. |
| Heretic / abliteration / ARA | Behavioral steering through projection or optimized low-rank changes | Current code and mechanism researched; not executed in this experiment | Reduced refusal rate or small KL divergence does not establish mathematical correctness or faithful attribution. |

“Reweighting” needs an object: adjusting a retrieval score, changing a historical dignity table, fitting an adapter, and editing a transformer matrix are different interventions. The historical scores in calendar/chart tools remain attributed conventions, not fitted probabilities that an event will happen.

## Hardware and model selection

The fresh hardware inventory reported an AMD EPYC 9V74, five visible logical CPUs but a cgroup quota of **four CPUs** (`400000 100000`), a **32 GiB** memory limit, and no NVIDIA executable or device. The execution receipts give process memory and timing; the inventory itself is not a stress benchmark. Current bitsandbytes documentation includes CPU support, so the lack of a GPU alone is insufficient to pronounce every quantized training route impossible. This run used the simpler pipeline that was actually tested.

| Candidate | Pinned base revision | Role and limit |
| --- | --- | --- |
| Qwen3-4B-Instruct-2507 | `cdbee75f17c01a7cc42f958dc650907174af0554` | Existing served 4B baseline, quantized through the recorded Unsloth artifact |
| Qwen3.5-4B | `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` | One newer 4B-class challenger within the download budget; compare the same two development requests before any selection |
| Qwen3-0.6B | `c1899de289a04d12100db370d81485cdf75e47ca` | Bounded adapter feasibility and controlled base-versus-adapter experiment |
| Qwen3.8-27B | `1d4bf0f2ff6012fd82039f2fa52739d0dd7c60c0` | A newer official model found in the survey, outside this run’s 3 GB challenger-artifact budget |

The selected challenger is `unsloth/Qwen3.5-4B-GGUF`, revision `e87f176479d0855a907a41277aca2f8ee7a09523`, file `Qwen3.5-4B-Q4_K_M.gguf`: **2,740,937,888 bytes**, SHA-256 `00fe7986ff5f6b463e62455821146049db6f9313603938a70800d1fb69ef11a4`. Its official base model and quantizer card declare Apache-2.0. The pinned llama.cpp `b12110` architecture registry lists `qwen35`; architecture registration and a verified download are preliminary evidence, while successful loading and inference require their own receipts. The text experiment does not use its vision component.

The official Qwen3.5 card reports MMLU-Pro 79.1 and GPQA Diamond 76.2 under its evaluation conditions. Those are vendor-reported benchmarks, not results reproduced here. A tiny local set cannot establish that this candidate is globally best. Qwen3.8-Flash-Next’s advertised active parameter count also does not describe its total weight storage: its card lists a much larger total architecture. Newer naming and sparse activation are insufficient reasons to download it into this CPU experiment.

Model-card licenses apply to their respective artifacts. Quantization provenance, runtime version, tokenizer/chat template, context size, decoding settings and the downloaded-file hash must accompany a comparison. Base-model and adapter weights stay outside Git; the website remains static and the optional model runs in the local companion.

## What the methods literature supports

**RAG and hybrid retrieval.** [Lewis et al.](https://arxiv.org/abs/2005.11401) combine parametric and non-parametric memory. The workbench’s existing corpus is much narrower: public project documents, selected original source notes, tool descriptions and book metadata with declared reading depth. A catalogue entry is not the full book. Keeping exact source IDs and quotations helps inspection but does not prove that an answer follows from the passage.

A reasonable next retrieval experiment would compare BM25 alone with dense retrieval, then [reciprocal rank fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf): `score(d) = Σ 1 / (k + rank(d))`. The reviewed first-page definition fixes `k = 60`; a local system must still choose and evaluate its parameters. Rank fusion avoids directly adding incomparable BM25 and embedding scores. The official Qwen3-Embedding-0.6B and Qwen3-Reranker-0.6B cards were reviewed as possible bounded candidates, not executed here by this research task. Evaluate source recall, correct-rule coverage, conflicting-edition retention, no-match behavior, latency and memory before claiming an improvement. Do not use source titles or language similarity as a substitute for entailment.

**LoRA and QLoRA.** [Hu et al.](https://arxiv.org/abs/2106.09685) parameterize a change as `ΔW = (α/r) BA`, with low-rank matrices trained while the base weights remain frozen. The actual probe uses rank 4, alpha 8, and `q_proj`/`v_proj` adapters. [QLoRA](https://arxiv.org/abs/2305.14314) adds frozen 4-bit quantization and memory-saving techniques such as NF4, double quantization and paged optimizers. Its published GPU memory demonstration cannot be transplanted into a CPU timing claim. The tested local adapter uses PyTorch CPU and a BF16 frozen base; neither a full fine-tune nor QLoRA is claimed.

An adapter is a real parameter update, but not a standalone model. The original compatible base, tokenizer and configuration are required to use it. Training receipts record initial/final parameter hashes, nonzero update norm, training-data hash, losses, time, memory and serialized adapter hashes. A changed hash establishes changed bytes; useful generalization still requires evaluation.

**Direct Preference Optimization.** [Rafailov et al.](https://arxiv.org/abs/2305.18290) optimize chosen/rejected response preferences without separately fitting a reward model in that formulation. For this product, preferences should reward correct calculation, supported explanation, appropriate missing-input handling and useful conditional advice separately. Neither confidence nor length should define preference quality. Building a preference dataset from the same exposed development questions and then calling those questions held-out would be invalid. No DPO training is represented by the current prompt changes or LoRA probe.

**ROME and MEMIT.** [ROME](https://arxiv.org/abs/2202.05262) studies localized factual-association edits, and [MEMIT](https://arxiv.org/abs/2210.07229) scales such memory editing. The inspected original ROME README describes GPU-only execution and GPT-2 XL/GPT-J support; the MEMIT abstract reports GPT-J and GPT-NeoX experiments. These are not evidence of a drop-in CPU editor for this Qwen model. Editing “author—work—year” associations would still need locality, paraphrase generalization and collateral-change tests. Date boundaries, timezone conversion and circular-angle arithmetic belong in explicit tools, where their inputs and rules can be inspected.

**Heretic and abliteration.** [Arditi et al.](https://arxiv.org/abs/2406.11717) analyze a behavioral refusal direction. That mechanism motivates directional ablation, but current [Heretic 2.x](https://github.com/p-e-w/heretic/tree/f4cf5354032419178584e7c52af6de6c138de856) is broader than a single-direction description. Its README introduces pluggable modifiers/scorers and an Optuna TPE outer search. Its default Arbitrary-Rank Ablation (ARA) implementation attaches low-rank matrices, captures module input/output, and optimizes a module-output objective using L-BFGS. The reviewed objective preserves outputs for one supplied set while steering outputs for another toward selected reference outputs and away from the original outputs; optional normalization changes the applied update. Classic directional abliteration is a separate modifier.

Although the author describes the approach as “training-free,” the inspected ARA code performs numerical optimization of adapter matrices. It is useful to distinguish that module-level procedure from ordinary end-to-end supervised fine-tuning, rather than implying that no weights change. The repository’s refusal/KL objectives, or other configurable behavioral scorers, do not directly measure calendar arithmetic, fabricated citations, historical accuracy or useful life interpretation. The cited ARA work is described as forthcoming in the inspected README; this review does not call it peer reviewed. No Heretic run or checkpoint was produced. Its code is AGPL-3.0; no Heretic code was incorporated into the app by this research pass.

## Nine traditions, specific tasks

The [public evaluation definitions](../research/model-lab/evaluation-cases.json) separate numerical tasks, historical attribution, missing inputs and everyday interpretation. The nine IDs organize named methods; they do not imply comprehensive coverage of every religion or practice.

| ID | Development scope | Boundary that a useful answer must preserve |
| --- | --- | --- |
| `egyptian` | Coptic civil labels and their relation to Egyptian calendrical history | A modern civil label does not reconstruct an ancient personal auspicious-day reading. |
| `mayan` | Supplied GMT Long Count anchor and cycle completion | A calendar correspondence does not forecast an apocalypse or individual fate. |
| `dee` | John Dee, *Monas Hieroglyphica*, publication and textual scope | An attributed symbolic work is not automatically an implemented personal date algorithm. |
| `lilly` | One Lilly domicile testimony; separately, Christian computus | A +5 testimony is not a success probability. Ecclesiastical Easter arithmetic is distinct from Lilly’s astrology; neither represents all Christians. |
| `vedic` | Wrapped Sun–Moon elongation and one-based tithi | A correct partition alone is not a complete muhūrta judgment or a life forecast. |
| `chinese` | A solar term versus a lunisolar month boundary | Solar longitude does not by itself identify Chinese New Year. |
| `hebrew` | Civil display versus observance at a local day boundary | A missing observer, instant or convention prevents a precise local observance verdict. |
| `jung` | Element counts and the limits of psychological analogy | A chart count is not a clinical measure of emotional capacity or Jungian function. |
| `plato` | Life choice in the Myth of Er versus later angular lots | Literary/philosophical lots are not interchangeable with a natal Spirit formula. |

Cross-cutting cases test an unknown birth time, the same instant in different timezones and named computus methods. References in these fixtures are **original supplied evaluation notes**, with repository or primary-source locators. Their `EVAL-…` IDs are not fetched `WRAG-…` chunks and must not be displayed as if they were independent archival citations. The historical source-review scope is recorded separately in [the reading-lab source methods](2026-11-reading-lab-sources.md).

## Three rounds with retained failures

The experiment freezes exact prompts, selected evidence, request messages and model settings before each generation round. The same four exposed cases—`D05`, `D09`, `D07`, `D10`—are generated for each scheduled contender. All twelve development fixtures also receive structural and selected arithmetic checks. The actual benchmark output cap is **512 tokens** for all contenders, even when the general serving profile has a larger cap; truncation remains in the record.

| Round | Disclosed intervention | Interpretation |
| --- | --- | --- |
| R1 | Existing baseline prompt, existing 4B model, unadapted 0.6B model | Establish raw outputs before tuning. Malformed JSON and wrong arithmetic remain failures. |
| R2 | Explicit evidence/quotation prompt; 24-step rank-4 adapter training on original teaching records | An actual changed configuration, not a second report about R1. A regression was observed: the adapted small model invented noon for an unknown birth time. It was not promoted. |
| R3 | Scenario-oriented prompt and canonical numeric-context grounding; reset-base adapter experiment with corrected training targets and lower learning rate | Test a disclosed correction. Prompt, tool grounding, learning rate and target schema change together, so this is a system iteration, not an isolated causal ablation of LoRA. |

In the frozen R3 `D05` request, the server adds `computedPartition` with **elongationDegrees: 24**, **tithiNumber: 3** and the tithi name. R1/R2 did not receive those computed fields. A restored numerical answer in R3 can therefore be correct copying of a tool result; it is not evidence that the model learned the arithmetic or that a weight update caused the correction. This difference is retained in the frozen request artifacts.

The initial CPU feasibility probe completed **two updates in 1.476 seconds**. R2 completed **24 updates in 18.128 seconds**, with **573,440 trainable parameters**, nonzero adapter-update norm **1.62104**, and a **2,308,432-byte** adapter safetensors artifact. These are training measurements, not interpretation accuracy. See the [probe receipt](../research/model-lab/training-probe.json), [R2 training receipt](../research/model-lab/rounds/round-2-training.json), and [raw round artifacts](../research/model-lab/rounds/).

The corrected R3 adapter run also executed: **24 updates in 28.886 seconds**, learning rate **0.00005**, maximum training length **256 tokens**, and nonzero update norm **0.563337**. It reset to the unchanged base instead of continuing the regressed R2 adapter. Its [training receipt](../research/model-lab/rounds/round-3-training.json) records the actual configuration and parameter hashes. Improvement claims still depend on the retained generated outputs and independent review, not this successful optimizer run.

The R2 failure review found an objective mismatch: all 24 original assistant targets listed citation IDs in a structured array but omitted the inline citations and quote-grounding objects required by the served prompt. R3 uses a **new** [training-v3.json](../research/model-lab/training-v3.json), preserving all original questions and evidence. Each target was reviewed individually; inline IDs and short exact quotations were added. Two targets were narrowed because their sources did not actually define the requested background mechanism. No development or sealed answer was added. The original dataset and failed outputs remain available. The new training-file SHA-256 is `8a4d6d786fd4f7922c5a84afb01bd64ddfe65d47862409d12c54f81d435d1cf3`.

The 24 short examples teach formatting, elementary calculation and disciplined use of evidence. They are not a full-text corpus of the nine traditions. The 0.6B training experiment is separate from the served 4B prompt experiment; their different runtime precision and grammar support must remain visible. In particular, the GGUF path uses JSON grammar while the small Transformers path does not. Raw format differences cannot be attributed exclusively to model intelligence or adapter weights.

For reproducible commands, dependency pins and adapter use, see [the local model-lab README](../local-rag/model-lab/README.md). Runtime results and independent review should be read together; a receipt’s existence alone does not mean a candidate passed.

The completed run contains **42 actual benchmark generations**: 24 development answers across three rounds and two configurations, two Qwen3.5 challenger answers, and 16 final held-out answers across the two frozen contenders. The [result summary](../research/model-lab/results-summary.json) and [training report](2026-11-model-training.md) retain separate format, source, timing and content findings. Held-out median latency was **20.079 seconds** for the existing 4B model and **22.601 seconds** for the small adapter on this host. Both retained substantive arithmetic or identity errors; the adapter was not promoted. [Post-evaluation integrity checks](../research/model-lab/post-evaluation-integrity.json) record unchanged frozen configurations and adapter weights after evaluation.

## Split integrity and scoring

The independent reviewer sealed **eight scenarios spanning all nine traditions** before final evaluation. Only count, group-level metadata and SHA-256 `da92b50c805396af7decbc437d250164ab8106295633b844cc1088f079829b39` were shared during tuning. The private file is excluded from browser retrieval and training. Final contenders must be frozen before the reviewer invokes it; once answers are inspected, that set cannot remain an untouched holdout for further tuning. General provenance and evidence-use skills overlap training objectives, so the set measures unseen scenarios, not wholly unseen skills or source-disjoint generalization.

Keep these measures separate:

1. **Numerical facts:** correct result, units, frame and method, including exact-boundary behavior where specified. Repeating an expected digit elsewhere in the answer does not pass the calculation.
2. **Source fidelity:** exact available citation IDs, an exact short supporting quote, and independent review that the quote entails the associated claim. Identifier and substring checks alone do not establish support.
3. **Missing inputs and unsupported conclusions:** no invented birth clock, houses, source definition, historical claim, event probability or definite personal outcome. A definite wrong answer cannot be compensated by polished prose.
4. **Everyday usefulness:** when the evidence permits it, a conditional ordinary-life example, a plausible alternative explanation, an observable check and a small reversible next step. When it does not, name the missing rule and offer an explicitly labelled reflection rather than inventing a prediction.
5. **Operational behavior:** valid schema, requested action scope, output truncation, complete case coverage, elapsed time, token counts and memory.

Regex patterns are screening hints. A contradiction can contain all expected keywords; a correct paraphrase can miss them. No single aggregate score hides these differences. The sample is too small and authored for broad statistical claims, cultural authority, calibrated risk or state-of-the-art status. The four selected generation cases do not establish generated-answer quality for the other eight development cases.

Run the inexpensive integrity checks with:

```bash
node scripts/tests/model-lab-fixtures.mjs
```

That command validates the 12 development fixtures, 24 original and 24 corrected training targets, citation/quotation structure, source-ledger metadata and selected canonical arithmetic anchors. It neither opens the sealed file nor runs a model. Its 791 checks must not be presented as 791 successful model predictions.

The separate [public Reading Lab example database](../assets/data/reading-lab-examples.json) contains the authored historical/calendar cases, source metadata, field checks and result summaries. It excludes this model-training and model-evaluation dataset. `node scripts/build-reading-lab-database.mjs --check` verifies its deterministic build; optional SQL export uses `--sql-dir /path/to/artifacts`. The [local database receipt](../research/reading-lab/database-receipt.json) verifies published-only reads and denied client writes in PostgreSQL-in-WASM. It does not establish that a hosted Supabase project was deployed.

## Source and rights boundaries

Original training/evaluation prose is CC0-1.0. Referenced historical works, translations, papers, documentation and code retain their own rights; a public URL does not grant unrestricted training or republication permission. This methods task commits source metadata and original summaries, not downloaded books, full papers or third-party implementation bodies. The ledger distinguishes successful reads from the two failed fetches and records that abstract review is not full-paper review.

Future improvements should expand independent worked cases and human source review before scaling training. A dense retriever, a larger adapter, preference optimization or a direct weight edit remains a candidate intervention until an actual frozen comparison shows what improved and what regressed. Calculated dates and attributed symbolic readings remain separate from evidence about what will happen in someone’s life.
