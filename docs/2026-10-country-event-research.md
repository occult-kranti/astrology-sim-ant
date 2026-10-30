# Seven-country historical event research

The country-calendars page now presents the completed historical research alongside the existing founding archive. The 28 source-qualified records cover the United States, Israel, India, Russia, Iran, Palestine and Ukraine. Each country has two elections and two conflict episodes or phases. The original 16 founding records, six-country picker, civil-label comparison, optional house samples and JSON/CSV exports remain on the same route and retain their existing engine.

The seven tabs are public links. For example, [Ukraine](../pages/country-calendars.html?researchCountry=ukraine#cr-title) opens its four records. A record link adds a whitelisted `researchRecord` identifier belonging to that country. Unknown or mismatched values are ignored. The links contain no birth, private note, provider setting or saved personal context.

## What the interface shows

The event slider steps through source records in start-date order. Its evenly spaced stops are indices, not equal intervals of historical time. A visible table retains the start, named episode or voting span, and attributed outcome. The source card distinguishes the main polling date, formal entry into an existing war, episode onset, endpoint and result/report date. Missing endpoints stay missing. Multi-phase elections and shared conflicts retain their original qualifications.

The selected record offers only its documented start, end and result markers. Each has the accepted 09:00, 12:00 and 18:00 local study samples. The fixed city observer, coordinates, IANA zone, assumed UTC instant and dataset's lack of a certified event instant are disclosed. A date-only record does not imply that the historical clock is unknowable; source qualifications retain any selected clock evidence. These are stored calculation snapshots from the completed 30 October 2026 audit. Changing a control selects a retained sample; it does not infer a national birth or event timestamp.

Thirteen named civil-calendar labels appear separately from the four fixed editorial feature comparisons. Every label retains its boundary, calculation method, validation status and source limits. Civil labels do not establish historical adoption, ritual observance or the preferred calendar of a government. The source date convention is shown verbatim. Private religious allegiance, gods or ritual intentions are not identifiable from this sample; no uniquely closest calendar is selected. See [Calendar inverse-problem methods](2026-10-calendar-inverse-methods.md).

## Descriptive quantities and their limits

The accepted study contains 28 records, 23 source-event groups and 22 conservative dependence groups. Across 62 source markers and three assumed clocks it contains 186 marker-clock rows, 744 profile comparisons, 1,488 logical nearby-date uses and 1,323 unique event/control samples. Country duplicates and related conflict phases are correlated observations. Distinct remaining group identifiers do not establish statistical independence.

Each marker uses all eight same-weekday offsets: −28, −21, −14, −7, +7, +14, +21 and +28 days. Nearby dates are not verified non-events. The interface preserves overlap flags, exact ties, declared numerators and denominators, missing rules, and the requirement for all eight nearby values before a paired difference is available. A missing rule is never treated as zero or removed from the denominator.

The visible feature-table introduction identifies the signed −100 to 100 weighted-rule scale, Mercury's restricted 0/100 match, and the distinction between zero and unavailable. A common numerical scale does not make different features or country observers comparable. These definitions remain beside the figures as well as in the expanded source methods.

The global table remains the original noon start-marker description when a country or event filter changes. Complete differences are averaged within conservative groups and then averaged with equal group weight. The Western increase and decrease descriptions are approximately −2.983 and −0.483 index points; the Mercury match description is approximately −2.983. These are arbitrary editorial index differences, not probabilities, validated p-values or election/war success measures. Jyotiṣa has zero complete primary pairs and its grouped difference stays null. Its inherited quality tables also retain pending primary-passage verification. No score or rule has been refitted to historical outcomes.

Western event values change across the three assumed clocks in 10 of 28 records. Equal values at three clocks would not prove whole-day stability. Mercury 100 denotes a known ruler match and zero a known nonmatch; neither means good or bad luck. Shared Moon–Sun quantities and their calendar transformations are mathematically dependent features, not independent witnesses.

No timestamped pre-event outcome classifier or observed ritual-choice variable exists here. Prediction accuracy, success beyond chance and a hidden national belief are not estimable. The finite sample also does not establish that every possible historical association is absent. No future ranking, attack timing, vulnerability forecast or military recommendation is introduced.

## Reproducible compact import

The import uses these committed inputs:

- `assets/data/country-events/accepted-research.json.gz`: a deterministic compressed projection of the accepted source records, comparisons and marker samples.
- `assets/data/country-events/provenance.json`: the snapshot hash, decoded hash, original artifact hashes, runtime and transitive scientific source bindings, with projection and rights limits.
- `assets/data/country-events/generate.mjs`: the dependency-free Node generator, including `--check`.

The generator verifies the committed input hashes and rebuilds the pure `country-event-research.js` data module, seven country JSON chunks and a global summary. It does not read external `/workspace` paths, fetch a source, run astronomy, recompute a calendar, fit an outcome model or search new dates. The compact snapshot was prepared from the completed `country-events-2034` source files and accepted historical audit; their exact hashes remain in the provenance record.

All 28 original source records are retained, with source objects deduplicated into a register and literal `source` citations added per record. The conservative analysis group is imported from the accepted audit. All 186 marker-clock comparisons retain existing arithmetic, missingness, control values and overlap references. The 150 distinct marker samples retain all thirteen civil-label rows, sky facts and planetary-hour data. Tokenized calendar display parts and the full 1,323-sample archive are omitted from the deployed derivative. The larger original analysis bundle remains the complete archival artifact.

No full downloaded report, modern copyrighted PDF or source screenshot is copied into the site. Published source material is limited to already reviewed metadata, factual paraphrases, reading qualifications and links. Existing application and vendor licenses remain in place. The source register does not imply that every underlying work was read in full, that inaccessible original election archives were accessed, or that multiple reproductions are independent evidence.

## Loading, exports and verification

The page imports the small catalogue first and loads one country’s stored samples on demand. Every country chunk and the summary are checked against their exact byte length and SHA-256 before display. Selection changes hide the previous comparison and disable its export immediately. A revision guard discards late responses. A failed load keeps source records readable and permits retry by selecting a record again.

The new JSON download includes the selected source record, full source metadata, fixed observer, selected marker and assumed-clock sample, all eight nearby values and overlap flags, feature definitions, calculation sources and artifact binding. The older founding-study JSON/CSV exports remain separate and unchanged.

Executed local checks:

```sh
node assets/data/country-events/generate.mjs --check
node assets/data/country-events/verify.mjs
node --check assets/js/app/country-calendars.js
```

The focused verifier passed 30 groups: exact generation, 28-record source closure and date-only precision, the unchanged 16-record founding catalogue, seven four-record filters, every marker/sample identity, thirteen civil rows, tie and missingness arithmetic, the accepted 28/23/22 denominators, null Jyotiṣa paired values, and independent reconstruction of the stored pooled means without using source outcomes. Browser verification is performed separately by the shared QA harness; it is not claimed by these headless checks.

The static audit passed with zero link/import problems. The full engine gate was also executed during integration: both original country-history suites and the new import verifier passed. At that point the shared gate still reported two in-progress Newton integration failures (new tool coverage and a not-yet-created independent test script). Final shared-gate and browser results are recorded by the root integration and QA lanes after those parallel changes settle.
