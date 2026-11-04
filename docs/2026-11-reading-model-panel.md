# Reading coverage and local-model improvement panel

Baseline: `a024d46320be63bcf3cff4b604ebd82835561971`. The preceding model experiments ran successfully but produced inaccurate house and zodiac explanations. A valid citation ID did not establish source support. This update therefore evaluates calculation, reference agreement, retrieval, generated explanation and action execution separately.

Six independent AI-agent lanes cover source research, canonical calculation, interface design, model-method research/evaluation design, CPU training/runtime, and critical/browser QA. These are engineering and source-review perspectives, not human practitioner research or professional endorsement.

## Acceptance contract

- Nine stable family IDs: Egyptian, Maya, Dee, historical Western/Lilly, Vedic, Chinese, Hebrew, Jung and Plato. Christian computus is a separate named method in the historical Western family; it is not a claim that Christianity teaches Lilly's astrology. Textual/psychological frameworks remain typed as such.
- Public worked examples carry precise source locators, convention, input precision and independent expected fields where available. Missing external comparators remain unevaluable. Printed-chart reconstruction, arithmetic fixtures and observed-life narratives are different forms of evidence.
- Readings explain a named rule, a conditional everyday example, an alternative explanation, an observable check and an optional reversible action. They do not enumerate an unknowable complete set of future events or turn descriptive calendars into causal predictions.
- Date-only inputs never acquire an invented birth clock. Boundary, time-zone, leap-month, sunset and polar limitations are explicit. Shared inputs are not counted as independent corroboration.
- The public example store and RAG index are reproducible. Supabase integration remains optional unless a real authorized project is configured. Private profiles are excluded.
- Three measured model rounds retain prompt/data/configuration hashes and raw outputs. Training, development and held-out cases are separated. Real weight updates must be recorded as such; prompt changes or quantization alone are not fine-tuning.
- Source-only operation and offline packaging remain available. A CPU companion supplies optional generation. Browser-native model execution is claimed only if actually tested, not inferred from a WebGPU library's existence.

## Round 1: baseline, research and bounded implementation

| Finding | Decision / implementation | Acceptance evidence |
|---|---|---|
| Calendar and philosopher names were being treated as one kind of system | Freeze nine family IDs with explicit calendar/astrology/textual/reflection types | Shared case, engine and UI contract; numerical fields absent for textual frameworks |
| Independent lanes initially proposed incompatible IDs | Adopt `egyptian,mayan,dee,lilly,vedic,chinese,hebrew,jung,plato`; separate Christian computus by method | Integration tests must resolve every case and filter to the same registry |
| Prior 4B explanation overstated what its passage supported | Introduce versioned prompts and exact-quote/source checks; retain prior answer failures | Frozen baseline and later raw model replies, with manual semantic review |
| CPU resources do not establish feasibility of full 4B retraining | Measure a bounded rank-4 LoRA probe on the original 0.6B model; preserve the stronger reference model | Actual trainable-weight changes, runtime and adapter load checks required |
| A newer release or reduced refusal is not a domain-accuracy result | Research current compact models and Heretic's actual objective; compare one feasible newer challenger | Source-pinned architecture/license records and the same development questions |
| A single passage's citation is not a personal forecast | Use sourced conditional scenarios and counter-explanations | Browser examples and held-out missing-information/unsupported-inference cases |

## Round 2: independent challenges and corrections

| Finding | Changed implementation | Measured evidence |
|---|---|---|
| Four inherited planetary positions disagreed with Lilly’s printed p. 392 figure | Correct Mercury, Sun, Moon and Saturn from the scan; mark other inherited values unverified and withhold derived house/judgment output | Three independent agent inspections; the four selected fields change from 0/4 to 4/4 agreement. This is partial reconstruction, not a verified complete chart or outcome. |
| Repeated public case IDs could inflate the comparison denominator | Reject duplicate IDs and caller-authored expected fields in public adapters | Canonical and actual MCP protocol regression cases |
| Source and edited-study states could appear to refer to the same inputs | Invalidate prepared requests on edits; separate source example, custom calculation, unavailable time and textual methods | Provisional real-browser pass: 166 checks,  no runtime errors or unexpected external requests |
| The first adapter learned inconsistent answer formatting and invented noon | Preserve the failed adapter, reset to the untouched base, correct original answer targets and reduce the training rate for round 3 | Round 2: 24 real updates,  573,440 trainable parameters, delta norm 1.62104. Raw malformed/citation-only/noon outputs retained. |
| The enhanced 4B prompt still miscomputed the circular difference | Retain the failure and move supplied-longitude arithmetic into the canonical calculation helper | Round 2 wrongly returned124° / tithi 1. Correctly formatted JSON did not make that answer correct. |

## Round 3: frozen configuration and acceptance

The final development configuration supplies canonical arithmetic, a shorter conditional-answer structure and bounded quoted support. Its four development responses use valid JSON and inline source IDs, preserve missing-time abstention and return the supplied 24° / tithi 3 result. Two quotations exceed the requested length. The helper result was absent from rounds 1–2: this is a comparison of complete configurations, not evidence that the model learned the arithmetic or that one isolated prompt change caused improvement.

The final adapter was trained afresh for 24 updates at a lower learning rate; its nonzero parameter delta norm is 0.563337. It still returns fenced JSON, omits inline IDs and makes a contradictory Hebrew-source claim. It remains experimental. A newer Qwen3.5-4B challenger was actually downloaded, loaded and tested on the same two development cases; it handled those cases but took 35.612s / 30.524s against 21.603s / 13.634s for the retained 4B configuration. Two samples cannot establish general superiority.

The selection and exact settings were frozen before eight independently authored cases were opened. Both final contenders then receive one pass with the same sealed evidence. Unassisted numerical failures in this set are retained: the 4B model miscalculates a 40-period difference and a nakshatra boundary, while the adapter also misstates calendar and leap-month details. No post-holdout prompt or weight tuning is allowed under the held-out label. The final model report contains raw responses, separate strict/normalized JSON checks,  exact-quote checks and independent manual content review.

Source-qualified deterministic readings, public examples and extractive retrieval remain the product’s default behavior. Optional generated responses are displayed as drafts. A quotation match proves only that the quoted string appears in the selected evidence; it does not prove the associated claim, a practical recommendation or a predicted outcome.

Final acceptance receipts are recorded in the Reading Lab verification report and the model-training report. The all-page sweep, complete engine gate and final portable artifacts are separate integration gates; their results must be recorded before release.

## Release gate and telemetry scope

The complete integration gates passed: 749 engine checks, 137 pages with zero browser errors, and the static audit with zero problems. Two inherited UI3 descriptor warnings remain in the all-page log. The focused Reading Lab browser acceptance passed 185 checks against unchanged public assets. The independently recorded source database tests passed 65 checks; the separate RAG database passed 104 checks and retrieved a matching source file for 8 of 10 authored queries. See the preserved gate stdout and hashes in `docs/evidence/reading-model-release/manifest.json`.

The append-only R40 telemetry row records this combined release, which contains the three internal review/model rounds above. Its nine domain groups are the nine named source-qualified framework families. Its eight tooling groups are canonical engine/exports, UI/chat context, public database, retrieval, MCP/discovery, model/runtime experiments, verification, and offline/CI packaging. These coarse hand classifications are explicitly unverified claim counts; they are not the 24 independent field checks or a model-accuracy metric. No new operational-graph curation census is claimed, so the historical C3 gate remains not evaluable.
