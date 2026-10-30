# Historical country/calendar study engine

Implementation date: 30 October 2026. The engine composes a fixed, source-labelled historical reference catalogue with existing civil-calendar and house-geometry calculations. It does not infer one national birth date or time. The catalogue, historical-source evidence and calculation fixtures are separate evidence layers.

## Public input and output

`assets/js/core/country-history.js` exports `getCountryHistoryCatalogue()` and `buildCountryHistoryStudy({recordIds, houseSystem, includeDaySensitivity})`. The study accepts one to six distinct curated IDs. `houseSystem` is `regiomontanus` (default), `placidus`, `whole` or `equal`; sensitivity defaults to `false` and requires a Boolean. Unknown fields, arbitrary dates, imported records, unknown IDs, duplicate IDs and additional objectives are rejected. All catalogue dates must be valid Gregorian comparison keys on or before the fixed cutoff **2026-10-30**.

The catalogue returns `schemaVersion`, `asOf`, `countries`, `records`, `sources`, `houseSystems`, `maxRecords` and `limitations`. The study returns `schemaVersion`, `kind: historical-country-calendar-study`, `asOf`, `selection`, `records`, `sources` and `limitations`. Each study entry contains:

- `record`: explicit source-record fields only, including the original-calendar description, place precision, time status, self-contained citation string, source IDs, notes and scope.
- `coverage`: availability of the declared date/place/zone inputs, reason and preserved qualification warnings.
- `civilComparison`: status, reason, reference assumption, canonical civil rows and limitations.
- `daySensitivity`: opt-in status, actual day interval, assumed samples, local-clock slots, offset changes, method, sources and limitations.

The study object is the public JSON serialization boundary. It never contains the internal `compareMoment()` result, a selected event chart, planetary positions, symbolic rule verdicts, an outcome score, a ranking or a future search. Callers should serialize this object rather than reach into internal dependencies. `record.time` preserves source precision independently of the reference and samples.

## Civil labels and range

For each supported record, `resolveZonedTime(date, '12:00', zone)` supplies an explicit **local-noon reference assumption**. Ambiguous or nonexistent noon remains unavailable; the engine does not choose a fold occurrence or replace the clock. The canonical `compareMoment()` receives that explicit UTC instant, selected reference coordinates, zone and house convention. Only its `calendars` rows are retained, with all source IDs, calendar methods, runtime statuses, validation qualifications and limitations. The internally computed astrology and prayer objects are discarded.

The public reference identifies `dateISO`, `localDate`, `localTime`, `timeZone`, `timeStatus: declared-reference-assumption` and the statement that noon is not a sourced event time. Even a record with a qualified source clock uses this separately declared noon reference for civil labels. No historical event timestamp is silently manufactured.

Both local and UTC years retain the canonical **1900–2100** comparison boundary. The fixed historical cutoff additionally prevents future catalogue records. A 1776 reference remains visible with its source data; its civil rows and house samples are unavailable. On a local 1900 boundary date, hourly samples falling in UTC 1899 stay explicitly unavailable. No numeric engine range is widened.

Calendar output describes named proleptic civil conventions. It does not reconstruct regional historical adoption, sunset-based religious dates, observed crescents, festivals or the source's exact original-calendar terminology. Original source labels remain attached to the historical record. Missing source metadata and missing original-calendar labels produce coverage warnings. Missing coordinates or zone block dependent computation instead of substituting a capital or UTC.

## Assumed-time sensitivity

`zonedCivilDay()` supplies the actual IANA interval. Sampling starts at its first real instant, advances by one elapsed UTC hour and adds the final included second. An ordinary day has 25 samples; an ordinary one-hour spring gap has 24, and an autumn fold 26. Half-hour and historical non-hour offsets are retained. No sample occurs at the exclusive next-day boundary. The bounded sampler rejects civil intervals longer than 48 hours.

Every sample includes `assumption: true`, an explicit assumption note, UTC instant, local date/clock, UTC offset in minutes, and fold occurrence when relevant. Geometry comes directly from `houses()` and exposes all **12** cusps as a zero-indexed array whose index 0 is House 1, plus ascendant and midheaven in degrees. `requestedHouseSystem`, actual `houseSystem`, warnings, status and reason preserve canonical fallback and missingness. A caller must check a sample's status before drawing its geometry. The source clock, if present, does not privilege any sampled point as a birth chart.

The 24 `clockSlots` describe integer local-clock hours separately: missing clocks remain unavailable and repeated clocks retain both UTC occurrences. Offset changes report their surrounding sample instants and `precision: between-samples`; this is not an exact time-zone transition search. The grid also does not locate exact astronomical transitions or guarantee extrema between samples.

## Source and method reading

Read for implementation: repository `HANDOFF.md`; local `observatory-source-contract`, `date-event-search-review` and `accuracy-check` skills; Calendar Observatory research and atlas-plan documents; and the canonical `calendar-observatory.js`, `instant-boundary.js`, `time.js`, `astro.js`, `personal-calendar.js`, `day-guidance.js` and comparison-evidence test contracts. This was implementation and method review, not a fresh primary historical-source investigation. Historical records and source-access depth are supplied by the separate source research lanes and retained in the catalogue.

Canonical method references:

- [`time.js`](../assets/js/core/time.js): strict Gregorian fields, local-clock candidates and actual IANA civil-day boundaries.
- [`calendar-observatory.js`](../assets/js/core/calendar-observatory.js): same-instant civil rows, source references, validation qualifications and 1900–2100 limits.
- [`astro.js`](../assets/js/core/astro.js): existing Regiomontanus, Placidus, Whole Sign and Equal geometry, including high-latitude fallback.
- [Calendar method qualifications](2026-10-calendar-methods.md) and [Observatory source research](2026-10-calendar-observatory-research.md): inherited selected-fixture and runtime limitations.

## Verification

`scripts/tests/country-history.mjs` follows the repository `run()` contract. It substitutes a fixed synthetic catalogue dependency inside a test-only module instance for boundary checks. Production exports no arbitrary-date or synthetic-record API. The fixtures test canonical equality for all 12 cusps and both angles under all four systems, canonical civil-row equality, ordinary/gap/fold/midnight-gap/skipped/half-hour days, historical and UTC range boundaries, missing inputs and metadata, qualified source clocks, Placidus fallback, strict public inputs, the fixed cutoff, export projection, output mutation isolation, JSON round trips and host-zone independence. Production checks also inspect each curated record and source closure.

The initial test-only boundary run passed **66 checks** before the historical-source aggregator was available; R1 source-string/plain-object corrections and method provenance checks brought that run to **75**. The first full-catalogue run exposed an incorrect test assumption that every record had two sources. India independence (1947), Russia sovereignty (1990) and Iran republic proclamation (1979) each retain one documented source lineage with explicit unresolved corroboration. The corrected test requires resolved metadata and a self-contained citation for every record, preserves those three qualifications and their visible warnings, and checks that the engine adds no invented historical source IDs. A source count never establishes independence: multiple institutional copies or translations can share one lineage.

The R2 full production-catalogue run passed **99 checks** with `node scripts/tests/country-history.mjs`. A separate read-only interface probe first reconstructed the drawn cusp directions and house labels from 100 SVGs for the Israel declaration reference, then covered all **1,300 SVGs** across the 13 supported records, four systems and 25 assumed samples each. Every direction and house number matched the engine, and the twelve forward sector arcs summed to one circle. The three pre-1900 records stayed unavailable; an unavailable sample returned no drawing. Browser behavior and later review rounds are recorded separately in the project verification ledger. Selected boundary checks establish software behavior, not numerical validation of every historical timezone or civil-calendar date, historical source truth, cultural authority, or astrology's predictive validity.

R3 self-review tightened dense-array validation to require each selected ID as an own array element, matching the MCP adapter. A prototype-provided element cannot fill a missing selection. The focused suite then passed **100 checks**. This changes no ordinary JSON or interface result.
