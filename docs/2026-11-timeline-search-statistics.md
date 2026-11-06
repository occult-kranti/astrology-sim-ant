# Timeline search: frequencies, correlations and a skeptical phase reference

Updated 5 November 2026. The statistical layer describes calculated values on an explicit, bounded date grid. It does not estimate the probability of a war, blackout, election result, successful move, illness, financial return or other real-world outcome. No outcome labels, prospective forecasts or held-out outcome observations enter these calculations.

The executable implementation is [timeline-statistics.js](../assets/js/core/timeline-statistics.js). The source ledger is [statistical-sources.json](../research/timeline-search/statistical-sources.json). The statistics are a project-authored sensitivity analysis informed by the cited methods; they are not a reproduction of a published astrology-validation experiment.

## What the different numbers mean

| Output | Question answered | Important limit |
|---|---|---|
| Within-grid exceedance frequency | How many available sampled slots have a value at least as large as this slot? | A finite descriptive fraction, not a p-value or an outcome probability. |
| Spearman correlation | Do two calculated series have a similar rank order on their jointly available slots? | Shared astronomy, a common clock or a calendar relabeling can create the association directly. |
| Binary counts, phi and Jaccard | How often do two declared rule conditions coincide, differ or both fail? | Different denominators answer different questions; a calendar rule is not an observed human outcome. |
| Circular-phase reference probability | Under the explicitly artificial reference rotations, how often is absolute rank correlation at least this large? | Conditional on that reference construction; it does not establish a real data-generating mechanism or predictive calibration. |
| Holm-adjusted phase reference | How does that reference fraction change when accounting for every pair in this requested family? | Does not correct undisclosed prior runs, edited windows, places, thresholds or rule choices. |

The ASA's six principles explain why a small p-value is neither the probability that a hypothesis is true nor the size or importance of an effect. Its official release was read; the source ledger does not pretend the release is the full journal article. The interface therefore uses “phase reference” rather than a “significant day” badge.

## Frozen inputs and denominators

Each series has a distinct identifier, label, `binary` or `continuous` kind, declared calculation-dependency groups, and one finite number or explicit `null` for every grid slot. Binary data must be exactly 0, 1 or null. Zero is an observed non-hit, not a substitute for unavailable calculation. All series must align with the complete array of UTC sample instants, whose missing entries remain null.

The statistics kernel accepts zero to ten series and 1–4,096 slots. The enclosing search may impose a tighter limit. Zero series is valid for a calendar-label ledger; one series has no pairwise hypotheses. The planned family contains every unordered pair of selected series, `m = k(k−1)/2`, with zero represented as ordinary numerical zero. At most ten series produce 45 pairs. The current search can supply up to eight binary criteria and two map aggregates. Its 40 angular lines remain individually inspectable; they do not secretly become 40 extra significance tests.

The full chosen family is fixed before its results are computed. Sorting the result table, displaying only its strongest rows, or finding a constant series does not reduce the correction denominator. Every pair retains jointly available and missing counts. Shared dependency-group identifiers remain visible; those groups are disclosures, not proof that remaining groups are independent.

A fixed natal astrocartography map is constant across a future date scan. Its location-to-line distances must not move when only the comparison date changes. Constant map aggregates have unavailable correlations and reference probabilities. A genuinely changing map series must be explicitly an event or transit map at each sampled instant. Changing a civil calendar label or zodiac convention is not an independent movement of a physical planetary line.

## Finite-grid frequency and ties

For available values `x₁,…,xₙ`, the upper-tail count at a displayed value `xᵢ` is

`Cᵢ = Σⱼ 1[xⱼ ≥ xᵢ]`, and `Fᵢ = Cᵢ / n`.

All exact ties and the selected value itself count. Missing slots retain null counts/frequencies, and the denominator is the number of available slots, not distinct values or the original grid length. Thus `[3, null, 1, 3, 2]` has frequencies `[0.5, null, 1, 0.5, 0.75]`. An all-equal series has frequency one at every available slot; an all-missing series has no frequency. The smallest possible fraction for an observed maximum is `1/n`, and ties can raise it.

Selecting the highest-ranked date after scanning does not turn its rank into statistical evidence. A result described as “one in 366 sampled dates” concerns that grid and rule only. It is not a one-in-366 probability of an event, and it does not describe unexamined hours between daily samples. There is no binomial confidence interval attached to a deterministic census of the chosen grid.

## Descriptive association

Spearman correlation is the ordinary correlation of ascending midranks. Exact tied values share their average one-based rank. Missing pairs are excluded only for this descriptive calculation, after which both remaining subsets are ranked again. The shortcut formula using squared rank differences is not used because it requires tie qualifications. Fewer than two complete pairs or a constant complete subset gives null correlation with a reason.

For binary inputs, let `a` be both hit, `b` left only, `c` right only, and `d` neither on jointly available slots. Then

`phi = (a d − b c) / sqrt((a+b)(c+d)(a+c)(b+d))`;

`Jaccard = a / (a+b+c)`;

`lift = a(a+b+c+d) / ((a+b)(a+c))`.

A zero phi denominator is unavailable. An empty Jaccard union is unavailable, not perfect agreement. Lift is unavailable if either marginal has no hits. Marginal hit fractions and the co-hit fraction are reported beside these summaries. These are descriptive associations, not causal effects. Two different religious/civil labels derived from the same underlying date do not create independent evidence by appearing in separate columns.

## Circular-phase sensitivity

The optional reference comparison requires at least four complete, strictly increasing, equally spaced UTC instants and two nonconstant, complete series. It is unavailable if either series contains a missing value, if a selected clock is unavailable, or if a daylight-saving change produces unequal UTC spacing. No dates are compressed, interpolated, re-clocked, or silently changed to UTC to obtain an eligible result. Descriptive associations may remain available even when the reference comparison is unavailable.

For complete sequences `x` and `y` of length `n`, a phase offset `s` forms `yₛ[i] = y[(i+s) mod n]`. The statistic is `Tₛ = |Spearman(x,yₛ)|`. Absolute correlation treats either sign as potentially extreme; it is not SciPy's alternative convention of doubling the smaller one-sided tail. A tolerance of `10⁻¹²` in the correlation statistic counts numerical near-ties conservatively. Exact value ties in the original series still use exact midranks.

The identity orientation is included once. The configured nonidentity budget is fixed at 127, 511 or 1,023, default 1,023. If all `n−1` nonidentity rotations fit, they are enumerated and `exact` refers to exhaustive evaluation of this finite phase-reference set. Otherwise the kernel selects the configured number of distinct offsets without replacement, using a documented fixed xorshift32 seed `0x51f15eed XOR n` and partial Fisher–Yates sampling with rejection to avoid modulo bias. The seed is not a user tuning control. The lexicographically later series identifier is always the rotated member, so reordering interface columns does not change a sampled result.

If `b` of `B` selected nonidentity rotations are at least as extreme as the observed statistic, the reported reference tail is

`P_ref = (1+b)/(1+B)`.

This equals the full finite-phase tail when every rotation is enumerated. It never produces a zero value merely because none of the sampled rotations exceeded the observation. The author version of Phipson and Smyth was read, including its distinctions between sampling with and without replacement; SciPy's official documentation also explains the identity/plus-one convention and inclusive tails. Those sources do not establish that calendar data satisfy this application's artificial reference model.

The reference effect is `T_observed − median(T_reference)`, with the identity included in that median. Both components and the difference remain visible; the difference may be negative. It is an effect on absolute rank correlation, not a causal effect on human life. Raw rotated values are not repeated in every pair result; the chosen offsets are exported once, along with sample counts, tail counts and exact/subsampled status.

The model preserves each series' values and circular order, including its **circular** autocorrelation, while changing their relative phase. It introduces a wrap between the final and first samples. Equal UTC spacing is only a necessary eligibility check: it does not establish stationarity, exchangeability, plausible periodic boundaries, or absence of trends and seasonal forcing. Schreiber and Schmitz specifically discuss limitations of surrogate nulls, endpoint mismatches, nonstationarity and selecting statistics after examining data. This implementation does not claim to implement their Fourier-surrogate or TISEAN algorithms.

For deterministic astronomical/calendar sequences, the conditional phase comparison is a skeptical reference exercise. Rejecting or finding a small tail under this artificial model could simply reveal their expected common solar/lunar cause. A fixed reproducible phase subset is also not an empirical calibration study. Neither raw nor adjusted reference fractions are advertised as validated real-world Type-I error rates or outcome probabilities.

## Multiplicity and numerical resolution

For the `m` predeclared pair hypotheses, order their available raw reference values `p_(1) ≤ …`. The Holm formula is

`q_(i) = min(1, max_{j≤i} ((m−j+1) p_(j)))`.

Unavailable hypotheses are conservatively equivalent to additional `p=1` family slots for this arithmetic, but stay displayed/exported as null with their reasons. The official R documentation and source implementation were inspected. They describe Holm's family-wise adjustment and arbitrary-dependence validity when its inputs are valid p-values. This application does not use that statement to assume that its artificial phase-reference model is scientifically valid for actual calendar-generated events.

Examples: `[.01,.04,.03]` adjusts to `[.03,.06,.06]`. A family `[.01,null,.04]` adjusts to `[.03,null,.08]`; removing the unavailable hypothesis would incorrectly give the surviving tests a smaller family.

The raw resolution floor is `1/(B+1)`. The smallest first Holm-adjusted value is at least `min(1,m/(B+1))`; ties can make the attainable minimum larger. With 45 pairs and 1,023 nonidentity rotations, this floor is `45/1024 ≈ .043945`. With 45 pairs and 127 rotations it is `45/128 ≈ .351563`. On a shorter fully enumerated grid, substitute its complete `n` orientations. The interface can show whether the fixed reference budget could reach the conventional .05 marker, but this is a resolution diagnostic, not a significance declaration. The kernel never increases its budget because a result appears promising.

Holm does not repair selectively chosen date windows, locations, calendar variants, parameter thresholds or unreported earlier searches. A saved result must preserve those inputs, the family, source/method versions, missingness and reference budget. Changing them begins a new analysis. Honest real-world probability estimates would additionally need clearly defined observed outcomes, a predeclared prediction horizon, independent prospective/held-out outcomes, appropriate baseline rates, and calibration/error assessment. None is supplied by this feature.

## Verification scope

The authored [statistics suite](../scripts/tests/timeline-statistics.mjs) checks hand-calculated ties, pairwise-complete reranking, constant and missing series, constant-series behavior required for fixed natal maps, calendar-only zero-series scans, binary contingency denominators, Holm families with unavailable pairs, skipped/irregular/reversed UTC grids, deterministic replay, column-order invariance, input-accessor rejection and cancellation during phase evaluation. It also checks an exact six-orientation synthetic null at every attainable alpha threshold. That last check verifies finite-reference arithmetic on its own synthetic null; it is not empirical astrology calibration.

Two useful skeptical examples are `[1,0,1,0]` versus itself, whose observed Spearman is one but whose absolute correlation is one under every rotation (`P_ref=1`), and `[1,1,0,0]` versus itself, whose absolute reference values are `[1,0,1,0]` (`P_ref=.5`). Perfect observed correlation therefore need not be rare under the stated phase model.

The bounded stress case evaluates 3,660 slots, ten continuous synthetic series, all 45 pairs and 1,023 nonidentity rotations. Its recorded computation time uses an immediate-yield test callback; actual browser task scheduling adds latency. There are cooperative checkpoints at each pair and every 64 rotations. Exact timing, source hashes, independent fixtures and browser acceptance belong to the release verification receipts rather than being assumed from the formulas.

Primary documents were retained outside Git for selected-section review. The committed source ledger records URLs, retrieval hashes, actual reading depth, rights and blocked acquisition attempts. Full copyrighted papers are not redistributed as part of the public source corpus.
