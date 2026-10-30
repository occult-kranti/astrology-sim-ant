# Full-horizon stress and the polar assertion correction

The authorized local stress run used Node **24.19.0**, ICU **78.3** and time-zone data **2026b**. It ran the complete default brute/optimized comparison once, followed by the maximum editable four-case grid. The parent reported concurrent QA browser activity; these were not isolated CPU measurements.

`scripts/stress-horizon.mjs` writes a summary receipt with runtime, complete requests/counts, timings, memory, driver hash and before/after scientific-source hashes. Large ledgers stay in memory and are not written into the repository. The source list is a core/library/worker dependency superset. The generated preset-loader version module is explicitly excluded because that binding is not used by the calculation paths; the final release manifest binds the preset separately.

## Complete default comparison

Both strategies calculated **1,525 dates × 3 cases × 4 profiles**: 4,575 sampled instants, 59,475 calendar slots and 18,300 profile results. Astronomy and selected observances were enabled. All meaningful outputs were **exactly identical**, including unavailable values, complete rows, observances, astronomical events, source qualifications and coverage. Mode, execution counters/timings and generation metadata were excluded from equivalence.

The brute strategy made 18,300 top-level comparison/guidance calls, versus 4,575 shared calls for the optimized strategy. These counters do not count every nested chart/ephemeris call: guidance itself recomputes canonical facts. Measured durations were **195.063 s** and **51.159 s**, a local ratio of **3.813**. Equivalent output and lower computation cost do not establish independent astronomical or predictive validity.

The independent stress checks validated both complete ledgers, every profile's ranks/ties against score-frequency counts, and every optimized event's local-date index against an independently constructed `Intl` formatter. All 167 bound scientific-source files were unchanged during this run.

## Maximum date/case grid

The second stage calculated **1,827 dates × 4 cases × 1 hour-dependent profile**: 7,308 samples, 95,004 calendar slots and 7,308 profile results. Its endpoints were 2026-01-01 and 2031-01-01, both included. Astronomy and observances were explicitly disabled in this extra grid; those layers were already covered twice in the complete default comparison.

| Case | Clock availability | Profile availability |
| --- | --- | --- |
| London, noon | All 1,827 samples | All 1,827 rankable |
| New York, 02:30, reject gaps | Five annual missing spring clocks | 1,822 rankable; five retained missing |
| New York, 01:30, reject folds | Five annual ambiguous autumn clocks | 1,822 rankable; five retained missing |
| Tromsø, noon, requested Placidus | All 1,827 clocks available | 1,231 rankable; 596 missing planetary-hour evidence |

The complete run took **325.457 s** including comparison and validation, with a process lifetime maximum RSS of **2,875,998,208 bytes**. It completed **44 valid checks** and failed one incorrectly written test assertion. That failed result is retained, not relabelled as a passing full run.

## What failed, and how it was corrected

The assertion read `requestedHouseSystem` and `houseSystem` from `row.astronomy`. That compact field stores the phase/position summary. House conventions belong to `getHorizonDayDetail(...).comparison.western`. The assertion therefore compared missing properties, rather than detecting a numerical house failure.

Only the test was corrected. The corrected helper recomputes the canonical detailed chart for **every** polar row; it does not weaken the requirement to “some fallback exists.” A separate focused run rebuilt all 1,827 Tromsø dates and inspected all 1,827 detailed Western charts. Every one requested Placidus, used Regiomontanus and retained the explicit above-66° fallback warning. All 1,827 clocks remained valid; the 596 missing hour-profile results stayed distinct from clock failures.

That corrected full-polar check passed in **38.572 s**, including **19.150 s** for detailed chart inspections. Relevant product and corrected-driver hashes stayed unchanged. The full local brute/optimized benchmark was not repeated. The complete corrected stress driver is required again in CI before publication; the focused correction does not pretend to be that CI result.

## Receipts and execution

- `docs/evidence/horizon/stress/round2-full-initial.json`: compact, unchanged-status projection of the original full run; retains its failing assertion and raw receipt hash.
- `docs/evidence/horizon/stress/round2-polar-correction.json`: corrected helper, all 1,827 actual chart-field checks, request, timings and source/driver hashes.
- `docs/evidence/horizon/astronomy/round2-integration-review.json`: 17 separate integration probes for UTC+14/−11 membership, half-open day boundaries, counts, cancellation and source-level presentation fixes. This was not a browser run.

Run the complete corrected gate with:

```sh
node scripts/stress-horizon.mjs --output test-results/horizon-stress/receipt.json
```

The numerical fixture suite and astronomical search limits are documented separately in `docs/2026-10-horizon-astronomy.md`. No browser, live deployment, real AI inference or universal astrological validation is established by these stress receipts.
