# Event horizon through 1 January 2031

This instrument calculates a complete, reproducible daily ledger, then lets the reader inspect separate purpose profiles, astronomical events and religious observances. It does not predict outcomes or assign a universal religious verdict to a date. The branch extends the existing calendar atlas and date/event laboratory; their tools remain available.

## Window and cases

The published request covers **30 October 2026 through 1 January 2031 inclusive**: 1,525 dates, three public local-noon cases (London, Delhi and New York), 4,575 samples and 59,475 civil-calendar slots. Four purpose results are retained for every sample, including unrankable results. Editable calculations support 1 January 2026 through 1 January 2031, at most 1,827 dates and four cases. These are explicit computational bounds, not a claim to cover every possible calendar, cultural variant or chart.

A sample is one declared local clock with an IANA time zone, coordinates, house convention and repeated-clock policy. Distinct local noons are distinct UTC instants. Missing and ambiguous clocks remain rows with structured missing reasons. Coordinate-to-zone geographical correctness is not inferred. No birth record, private question, oracle draw or saved browser context is supplied.

## What is calculated

The existing canonical moment engine produces thirteen civil calendars, astronomical measurements and the approximate Lahiri sidereal pañcāṅga. The guidance engine supplies selected historical rule evidence. Calendar conversion is not festival determination, and a whole calendar family is not validated by selected fixtures. The [tool inventory](../assets/js/core/data/horizon-tool-coverage.js) maps every current source MCP schema and reference capability to its actual scope; the scan calls shared engines, not every MCP adapter.

The [ranking method](2026-10-horizon-ranking.md) defines four separate modern editorial profiles: Western increasing-light study, decreasing-light/completion study, the inherited Jyotiṣa quality classification, and Mercury temporal-hour match. Each uses a fixed denominator and exposes dependencies. A missing required rule makes the result unrankable; it is never silently dropped. Scores are index points, not probabilities. Exact rational ties share a competition rank. Dates break display ties only. Compare ranks within one case and one profile; the shared numerical scale does not establish cultural commensurability. There is no learned, empirically calibrated or outcome-validated prediction model.

The [astronomy method](2026-10-horizon-astronomy.md) documents all 45 body pairs, five major ecliptic aspects, tropical ingresses, apparent stations, lunar phases, solar quarters and global eclipses. Event searches use the bounding union of requested civil-day intervals, start inclusive and end exclusive. The default interval is 2026-10-29T18:30Z through 2031-01-02T05:00Z. Display assigns each event back to the selected observer's civil date. A global eclipse is not a claim of local visibility. Refined crossings are numerical event estimates, not unlimited-precision timestamps. Bracket width, frame conventions, tangency and coverage limits remain with each event and in the method.

## Research and religious dates

Fresh online research uses issuing authorities and named primary passages where available. [Observance methods](2026-10-horizon-observances.md) distinguish computus, converter-derived projections, published regional facts and unavailable date rules. [Tradition references](2026-10-horizon-traditions.md) retain the exact selected scope of each text and source reading. Retrieval receipts record status, hash, locator, reading depth and failed requests. A reachable source is not itself proof of every claim on its page.

Selected Christian, Jewish, Islamic, Chinese, Hindu, Buddhist, Sikh, Jain, Bahá’í, Zoroastrian and Shinto/seasonal records are catalogued. Coverage and variants are explicit. Saka civil dates do not supply Hindu festival dates; a Buddhist civil era does not determine Vesak. Future sighting decisions and unavailable regional rules remain unresolved. Some primary sources explicitly reject date-setting or auspicious-day practices; those disagreements remain visible.

Official HKO/GovHK Chinese festival dates disagree with the generating ICU78.3/CLDR48 converter for selected New Year dates in 2027 and 2030. Published facts and runtime labels are both retained, with mismatch records. The canonical converter is not silently patched. Recomputing a selected sample in another browser can produce another difference, shown separately from official-source discrepancies.

Eschatological passages without sourced modern dates remain attributed references. Textual signs or astronomical configurations are not converted into uniquely dated prophecies. None contributes to the purpose scores.

## Brute force and optimization

Both strategies visit the same complete date/case grid. The brute reference independently recomputes a canonical comparison/guidance pair for each requested purpose. The optimized strategy shares that pair across purposes at each sample. It does not skip less promising dates, narrow the denominator, or truncate low-ranking results. Guidance internally recomputes some chart facts; reported call counters are top-level orchestration calls, not total primitive engine operations.

The benchmark compares complete rows, missingness, exact scores, events, observances, coverage, sources and limitations. It excludes mode labels, timing/call counters and generation timestamps. A measured speed ratio describes that runtime and workload only. Algorithmic equivalence does not establish the empirical validity of astrological predictions. The [full-horizon stress job](2026-10-horizon-stress.md) is a separate publication dependency; shorter independent fixtures cover edge cases and mutations.

## Artifact, interface and refresh

The checked-in preset has one case part per observer and an astronomy part. The manifest binds exact bytes and a transitive scientific source graph. The generated version module binds the manifest, metadata and source fingerprints; that version module is excluded from its own source graph to avoid a circular hash. A checksum is release-integrity evidence, not an external signature or numerical validation. The loader also checks exact case context, thirteen unique calendar identities, completeness/score invariants, observance cross-indices and event interval membership. It consumes the original response natively while monitoring a cloned byte stream; oversized responses abort through a linked controller. Caller cancellation and specific limit errors are preserved. These are transfer-byte bounds, not a claim that parsed objects, clones and exports use only that much memory.

Every date is reachable with the slider and date field. Pagination changes displayed rows only. JSON exports the complete ledger; CSV exports every date for the selected case/profile. Optional hourly detail is recomputed for the selected actual civil day. A selected-day ICS preview represents one calculated study instant; it does not claim a festival boundary or connected calendar synchronization. Custom work runs in a cancellable worker, and changed inputs invalidate old results.

After scientific sources or source MCP contracts change:

```sh
node scripts/build-mcp-coverage.mjs
node scripts/build-mcp-catalogue.mjs
node scripts/build-tool-coverage.mjs
node scripts/generate-horizon-preset.mjs
node scripts/generate-horizon-preset.mjs --check
node scripts/stress-horizon.mjs --output test-results/horizon-stress/receipt.json
node scripts/engine-test.mjs
node scripts/browser-horizon.mjs
```

The bounded MCP scan accepts at most 31 dates and two cases; the day tool recomputes one explicit case/date with optional hourly detail. Local source tools and Pages discovery metadata are distinct from a hosted MCP deployment. GitHub Pages does not serve an MCP transport or Supabase database. See the [panel ledger](2026-10-horizon-panel.md) and [verification record](2026-10-horizon-verification.md) for actual reviewed artifacts, tests and outstanding limitations.
