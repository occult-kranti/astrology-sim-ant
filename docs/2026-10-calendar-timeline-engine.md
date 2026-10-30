# Synchronized calendar timeline engine

This engine composes existing calculations for a user-selected observer, IANA zone and local sample clock. A daily slider changes the selected civil date; tropical houses, nine Vedic grahas, thirteen civil-calendar rows and ten astronomical sky bodies describe the resulting instant. The module does not infer a country birth, recover a source event clock, forecast conflict or rank military action. Calculated astronomy is distinct from event-outcome prediction; astrology has no demonstrated predictive validity.

Implementation: [`assets/js/core/calendar-timeline.js`](../assets/js/core/calendar-timeline.js). Focused verification: [`scripts/tests/calendar-timeline.mjs`](../scripts/tests/calendar-timeline.mjs).

## Strict request and selected frame

```js
const request = {
  startDate: '2026-10-30', endDate: '2026-11-01',
  time: '12:00', timeZone: 'Europe/London',
  lat: 51.5074, lon: -0.1278, system: 'regiomontanus',
  disambiguation: 'reject',
  includeCatalogStars: false, includeGuidance: true,
};
const grid = buildCalendarTimelineGrid(request);
const frame = buildCalendarTimelineFrame(request, 0);
```

The public functions are:

| Function | Result |
| --- | --- |
| `normalizeCalendarTimelineRequest(raw)` | A new strict request with normalized IANA zone, seconds in the local clock and explicit defaults. |
| `buildCalendarTimelineGrid(raw)` | All inclusive daily clock slots, counts, grid semantics and source qualifications. No astronomical calculation. |
| `buildCalendarTimelineFrame(raw, index)` | A freshly resolved and calculated selected frame, or explicit missing/ambiguous state. |
| `exportCalendarTimelineJSON(raw, index)` | A recomputed selected frame serialized as JSON, with source records and limitations. |
| `exportCalendarTimelineCSV(raw, index)` | Long-form selected-frame CSV containing scope, observer, clock candidates, civil dates, positions, both house systems, Vedic reference, solved events, rules, profiles, tasks and source metadata. |

Only the declared fields are accepted. Input objects must contain ordinary enumerable data properties; unknown names, symbol keys, accessors, nonenumerable fields and custom prototypes are rejected. Dates, clocks and zone IDs require strings; coordinates require finite numbers. There is no coercion from numeric strings, no accepted precomputed geometry, purpose parameter, country identifier, birth record or arbitrary metadata. `time` and `system` are required. The caller explicitly chooses the observer; coordinates do not establish geographic correctness of the supplied zone.

Supported house systems are `regiomontanus`, `placidus`, `whole` and `equal`. Latitude must be strictly between −90° and 90° because the synchronized frame includes an ascendant and houses; pure sky geometry at the exact poles remains available in the separate canonical sky engine. The optional prayer settings use the existing names: `prayerMethod` defaults to `MuslimWorldLeague`, `asr` to `Shafi` and `highLatitude` to `MiddleOfTheNight`. `disambiguation` defaults to `reject`, catalogue stars to `false`, and guidance to `true`. Explicit `null` is not a default.

Local civil dates must be within 1900–2100. Both endpoints are included, with at most 3,660 dates. For example, 1 January 2020 through 7 January 2030 contains 3,660 slots; adding 8 January exceeds the bound. A single-date grid is valid. A frame index must be a number and an integer within the grid; negative, fractional, string and missing indices are rejected. The normalized request contains no derived count that can be forged by a caller.

## Local clocks and missingness

Date arithmetic advances the Gregorian civil label, then the canonical `zonedTimeCandidates` resolves that date's sample clock separately. This is not a fixed 24-hour UTC grid. At New York local noon, the 2026 spring/fall transitions produce adjacent elapsed intervals of 23 and 25 hours.

Every slot has `index`, `localDate`, `localTime`, `status`, `code`, `reason`, `repeatedClock`, `candidates`, `selectedDateISO` and `selectedOccurrence`. Each candidate retains UTC ISO time, actual offset in seconds, repeated-clock occurrence and whether its UTC year is supported. Historical non-hour offsets are preserved.

| Condition | Behavior |
| --- | --- |
| Ordinary local clock | `available`; the unique UTC instant is selected. |
| Repeated clock with `reject` | `ambiguous` / `AMBIGUOUS_TIME`; all candidates are retained, no instant selected. |
| Repeated clock with `earlier` or `later` | Explicit occurrence selected; both candidates remain in the slot. |
| Missing clock | `unavailable` / `NONEXISTENT_TIME`; no shift to another clock. |
| Entire skipped civil date | `unavailable` / `NONEXISTENT_DATE`; its dated slot is retained. |
| Valid local date resolving beyond UTC 1900–2100 | `unavailable` / `UTC_RANGE`; actual selected UTC value is retained as evidence, no chart calculated. |

The skipped-date distinction uses canonical `startOfZonedDay` only after the selected clock has no candidates. Gaps remain missing under every disambiguation policy. A fold is not silently classified as favorable or dropped from the count. Missing selected frames expose no comparison, sky, chart, guidance or solved-event object; their four requested editorial profiles retain null scores, full denominators and missing contributions. Task cards retain unavailable or unimplemented states.

## Canonical numerical composition

The selected frame resolves only its own date, regardless of grid length. It does not call the full-grid function or calculate a year of rich daily frames. The UI can build the clock grid once and compute selected frames in a replaceable worker.

1. `buildCalendarAtlas(input)` returns the canonical comparison, thirteen civil calendars, named variants and source ledger. The frame exposes `.comparison` separately; `.atlas` omits its redundant internal comparison field. Unimplemented atlas variants, partial timetable output and unsupported runtime calendars remain as returned.
2. `buildSkySnapshot(input, { includeCatalogStars })` supplies all ten apparent geocentric bodies and optional twenty HYG catalogue stars. It retains geocentric, topocentric, heliocentric and stellar frame labels, omissions, licence and provenance. The ten bodies include the Sun, Moon and dwarf planet Pluto; they are not ten physical planets.
3. `charts.tropical` uses the selected canonical atlas house row, including twelve cusps, ascendant, midheaven, requested system, actual system, fallback status and warning. All ten sky longitudes receive house numbers through canonical `houseOf`. The placements use the sky engine's apparent true-ecliptic/equinox-of-date angles, not a new ephemeris.
4. `charts.vedic` uses canonical `castChart` and `castVedic` at that same explicit instant, with `currentDate` equal to the selected date. Only the nine grahas, lagna, linear Lahiri estimate, instantaneous Pañcāṅga and twelve whole-sign cusps are retained. The seven shared bodies use the canonical apparent positions; Rāhu and Ketu use the canonical mean nodes. No personal daśā, varga interpretation, remedy, strength score or natal counsel is exposed. Sidereal cusps and graha angles have already had the coordinate transformation applied; renderers must not subtract the ayanāṃśa again.
5. Optional `buildDayGuidance` and `evaluateHorizonPurposes` preserve inherited traditional-rule evidence and the four named editorial profiles. Full denominators, dependency groups, unresolved timing and individual contributions remain attached. `buildTimelineStudyTasks` supplies the five source-qualified task cards. Beginning, finishing and studying map to existing named editorial profiles; dialogue and ceremony remain unimplemented.

Disabling guidance produces `guidanceStatus: 'not-requested'`, null guidance and no profile results. The task definitions and their original source records still exist, with implemented cards explicitly unavailable because guidance was disabled. There is no zero score standing in for omitted calculation.

Overall frame `status: 'available'` means the clock resolved and canonical composition completed. It does not mean every calendar, prayer boundary, house variant or traditional rule is available. Inspect the nested method status and warning. For example, polar Placidus requests can retain canonical Regiomontanus fallback geometry as `partial`, while missing sunrise-dependent hours remain unavailable.

## Astronomical events and sample scope

`astronomicalEvents` supplies a bounded window of sixteen elapsed days on either side of the selected instant, explicitly clipped at UTC coverage limits. It reuses canonical `buildSkyTimelineSync` with only two endpoint position samples and at most sixteen event records. Solar seasons and lunar quarters are numerically solved by the canonical search APIs. The endpoint samples are not exported as event times or a continuous trajectory.

Each event retains UTC and observer-local labels, type, angle, definition, frame and search method. The selected atlas also retains its canonical annual list of twenty-four Chinese solar terms, declared Hong Kong reference year and observer-zone labels. Neither list supplies planetary stations, every aspect, eclipses, regional festivals, religious prophecy or personal/geopolitical outcome predictions. Solver milliseconds are not a claim of millisecond observational accuracy. A daily sample does not establish persistence of a rule between slider positions.

## Sources and export semantics

The engine reads existing source ledgers from the atlas, sky, day-guidance, horizon-profile and study-task modules. Source identifiers close over the frame's merged source list, including unavailable frames and explicitly disabled guidance. The timeline adds two project-method records, `CT-METHODS` and `CT-CLOCK`. No new historical numerical rule or source quotation is encoded by this composition.

Inherited qualification is preserved: the Muhūrta primary-passage verification remains pending, HYG retains CC BY-SA 4.0 attribution and catalogue limits, runtime calendar support is not religious authority, and selected JPL/HKO/Hebcal/season fixtures do not establish full-range validation. Relevant inherited ledgers are [sky dynamics](2026-10-sky-dynamics.md), [sky sources](2026-10-sky-sources.md), [atlas methods](2026-10-atlas-methods.md), [calendar observatory research](2026-10-calendar-observatory-research.md) and [horizon ranking](2026-10-horizon-ranking.md).

Both export helpers accept the strict request and index, then recompute. Submitted frame objects or calculated rows cannot masquerade as canonical results. JSON contains the complete selected frame and no host-clock timestamp. CSV represents selected facts in rows, includes local/UTC sample scope and source records, quotes every cell and protects formula-leading text. Explicit observer coordinates are included in this user-invoked study export. No browser storage, network request, provider call or saved birth record is read by the engine.

## Verification and review

Round 1 implemented the strict grid, selected-frame composition, source closure and export helpers. Its focused suite passed **96 checks** with `node scripts/tests/calendar-timeline.mjs` on 30 October 2026. Checks include spring gaps, fall folds, a thirty-minute Lord Howe fold, Apia's skipped date, 23/25-hour daily intervals, leap and century dates, both UTC edges, the exact 3,660-date cap, strict descriptors and indices, ten selected-date JPL longitude/latitude fixtures within one arcminute, all four house systems, nine canonical Vedic grahas, polar missingness/fallback, unresolved yoga denominators, source closure, task states, nearby equinox timing, export recomputation and host-zone independence.

Round 2 independent review found a strictness gap: initially a declared accessor or nonenumerable field was accepted by the core. The core now rejects those descriptors before reading them; a getter invocation count of zero is verified. Independent numerical review passed 54 checks of canonical civil rows, twelve cusps and angles, seven shared tropical positions, nine sidereal grahas and the once-applied ayanāṃśa. Its instrumented boundary recorded 3,660 local-clock resolver calls for the grid and one call for the selected last frame, confirming bounded frame resolution. Evidence: [`docs/evidence/calendar-timeline/review/numerical-review.json`](evidence/calendar-timeline/review/numerical-review.json). That receipt applies to its recorded source hashes; later held verification is a separate gate.

Observed first-pass Node timings were about 74 ms for the first London frame without stars and 329 ms for a 3,660-date London clock grid, before nearby event/task additions. The independent review measured a 330 ms full clock grid and 11.2 ms selected broad-window frame versus 10.7 ms single-date frame with guidance disabled, in Node 24. These are observed local orchestration measurements with the stated options, not browser responsiveness, network-service or universal performance guarantees. The final engine's additional bounded event search and task serialization require their own recorded timings if a new performance claim is made.

Round 3 held integration verification passed **21/21 checks** against unchanged core SHA-256 `4b3b71f570a1191346f450e92678c32f5e7e29b0c94c5d94929115dc95f35e27`; the independent [methods receipt](evidence/calendar-timeline/methods/round3-receipt.json) records before/after hashes, canonical adapter equality, range and clock boundaries, strict inputs, disabled/missing guidance and task/source closure. Independent numerical review repeated its [54 composition and per-frame call checks](evidence/calendar-timeline/review/numerical-review-final.json), then added 18 core checks of the exact clipped event window, event bounds, solved phase/season angular residuals below 0.002°, task missingness and source closure at both range endpoints and the selected 2026 date. The [combined held core/source receipt](evidence/calendar-timeline/review/held-core-source-review.json) records those additional core checks alongside ten source checks, with the engine unchanged before/after. The focused 96 checks and inherited observatory 59 / horizon-ranking 15 checks also passed on that engine version.

An additional final engine measurement in Node 24.19.0 resolved 3,660 London noon dates in 340 ms and calculated selected index 3,659 in 62 ms with guidance and twenty catalogue stars enabled. The selected frame contained thirteen calendars, ten astronomical bodies, nine grahas, four nearby events, five task cards and 315,104 UTF-8 JSON bytes. These are one-run local measurements with that selected date and options, not a browser or service-level performance promise. Independent browser acceptance, complete repository gates, publication and live deployment require their separate evidence.
