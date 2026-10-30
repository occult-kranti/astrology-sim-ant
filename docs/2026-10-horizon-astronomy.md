# Astronomical event inventory through 1 January 2031

This module computes a declared inventory across the whole requested UTC interval. It does not assign favorable/caution scores, infer local eclipse visibility, or claim every possible astrological event. Work extends published baseline `3f76845f2d516d7a4bd507afa0508e6929c831e2` on `feat/event-horizon-2031`.

The source, date-search and accuracy contracts were applied. This is an AI-agent software/astronomy review, not a human observatory certification or validation of astrological prediction.

## Interface and interval

`assets/js/core/horizon-astronomy.js` exports asynchronous `buildHorizonAstronomy({startUTC,endUTC}, hooks)`, `HORIZON_ASTRONOMY_LIMITS` and `HORIZON_ASTRONOMY_SOURCES`. It imports the bundled MIT Astronomy Engine and the canonical exact-instant parser. No network, clock, browser state, observer, birth record or AI provider is read.

The two explicit ISO instants normalize to UTC. Start is inclusive and end exclusive. UTC query years are 1900–2100, with `2101-01-01T00:00:00Z` permitted only as the exclusive endpoint; maximum elapsed duration is 1,831 days. These bounds reuse the site's supported interval, not a claim of fresh all-year validation. Internal six-hour bracketing/derivative padding can extend less than a day outside a requested boundary, using the vendor's wider model domain. Returned events remain strictly inside the requested interval.

The public civil-date study is 2026-10-30 through 2031-01-01 inclusive. London, Delhi and New York require the **union** `2026-10-29T18:30:00Z` through `2031-01-02T05:00:00Z`. The orchestrator selects each case's events by its local civil date. A UTC date is not silently substituted for a case date.

The result contains `events`, `coverage`, `sources`, `stats`, `limitations` and normalized `range`. Each event has a stable identifier, kind/title, `startUTC`, `precision: 'computed-instant'`, bodies, source identifiers, dependency groups, method, details and limits. Numerical bracket precision and model accuracy are separate fields. IDs distinguish event definitions; they do not deduplicate a phase and a related longitude aspect into independent observations.

## What is searched

| Category | Definition and implementation | Completeness qualification |
| --- | --- | --- |
| Lunar phases | Four quarters from `SearchMoonQuarter` / `NextMoonQuarter` | Native solver sequence, filtered by actual event instant. |
| Solar quarters | March/September equinoxes and June/December solstices from `Seasons` | All requested years, with root instants filtered to the interval. No hemisphere-dependent season label. |
| Global solar eclipses | `SearchGlobalSolarEclipse` / `NextGlobalSolarEclipse`; peak when shadow axis is nearest Earth's center | Global solver sequence; partial/annular/total. Hybrid is not a distinct vendor classification. |
| Global lunar eclipses | `SearchLunarEclipse` / `NextLunarEclipse`; peak and phase semi-durations | Global penumbral/partial/total sequence, including very shallow penumbral events. No observer visibility. |
| Tropical ingresses | Apparent longitude crossing each multiple of 30° for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto | Every anchored six-hour interval inspected. Both direct and retrograde crossings. Not IAU constellations. |
| Longitude stations | Zero of a central longitude rate across ±6 hours for Mercury through Pluto | Every six-hour interval inspected; finite-difference definition is explicit. Pluto is a dwarf planet included in the same calculation list. |
| Major longitude aspects | All **45 unordered body pairs**, including Moon; directed targets 0,60,90,120,180,240,270,300° | Both complementary sextile/square/trine directions. Exact zero-orb contacts, not orb-duration intervals. All 45 pairs retain a count, including zero-event pairs. |

The last three categories use the apparent geocentric true ecliptic/equinox-of-date positions from `GeoVector(body,date,true)` and `Rotation_EQJ_ECT`, consistent with the sky chart. The Moon uses the vendor's specialized lunar-model path. An angular separation in three dimensions is calculated at every aspect contact. A longitude conjunction can have several degrees of latitude separation; this feature does not find the minimum sky separation or assert occultation.

Native lunar phases have a **different correction convention**: `MoonPhase` → `PairLongitude` calls `GeoVector(...,false)`. Its frame disclosure explicitly says no aberration correction was requested. Sun–Moon aspect contacts use the apparent-position convention above, so nearby phase/contact times can differ. Both carry `solar-lunar-geometry`; counting them as independent confirmation would be wrong. Global eclipse geometry also shares solar/lunar inputs. No astronomical rows affect a purpose score implicitly.

The six-hour grid is anchored to UTC epoch multiples, rather than the caller's first instant. This preserves the same brackets when a window is subdivided. Signed-angle checks reject ±180° branch-cut jumps, and bisection handles both increasing and decreasing crossings to a bracket of at most one second. The full final partial interval is inspected. A tangency or two crossings wholly inside one interval may be missed: `rangeCovered: true` records that the declared grid was completed, while crossing categories retain `exhaustive: false`. A small root residual is numerical consistency, not an observational error bound.

Not searched: fixed-star contacts, true-sky closest approaches, heliocentric alignments, perihelia/aphelia, lunar apsides, nodes, meteor showers, occultations, planetary transits, local eclipse paths/visibility and natal events. These are explicit unavailable categories, not zero-event claims. The module does not use `SearchRelativeLongitude` to impersonate an apparent sky conjunction: that vendor API solves a heliocentric Earth–planet longitude relation.

## Bounds, cancellation and output size

Twenty thousand events and one million position evaluations are hard failure limits, not silent output caps. Event/root/sequence failure throws; no partial successful result is returned. Sequence loops also have finite safety guards. All events are returned chronologically, with complete counts and zero-result aspect-pair coverage.

Hooks accept `shouldCancel`/`isCancelled`, optional `AbortSignal`, `onProgress` and `yieldControl`. Work yields between native-event batches and every sixteen crossing intervals. Cancellation throws `AbortError` with `code: 'CANCELLED'`; each invocation owns its state, and a subsequent call is unaffected. The parent worker remains responsible for job replacement and stale UI results.

The first corrected full-horizon run on Node **v24.19.0** took **2.812 seconds**, performing **227,639 position evaluations over 6,102 brackets**. It returned **5,883 events**: 4,691 aspects, 871 ingresses, 77 stations, 207 lunar phases, 17 solar quarters, 10 solar and 10 lunar eclipses. Its JSON measured about **5.81 MB**. Later disclosure-only metadata additions slightly change bytes. These are local observations, not browser performance promises. Full event output is intentionally larger than the MCP service's usual small-response budget; an adapter must disclose its selected scope/summary rather than silently truncate this result.

Two searched pairs, Saturn–Uranus and Saturn–Neptune, have no exact major longitude crossing in this interval. An initial test wrongly expected all 45 pairs to produce a root. The failed receipt is retained; the assertion was corrected and the coverage schema now exposes every pair's count, including zero. The numerical algorithm was not changed to manufacture those events.

## Fresh authoritative checks and reading depth

HTTPS requests used the normal environment network. Request URLs, timestamps, statuses, byte counts and response hashes are in `docs/evidence/horizon/astronomy-research/source-fetches.json`. Selected factual fixtures are in `scripts/tests/fixtures/horizon-astronomy.json`; checked eclipse rows and three original JPL JSON responses are retained with the receipts. Full downloaded NASA pages, upstream API prose and HKO PDF remain outside the repository; their hashes establish the fetched versions. HKO page artwork is not redistributed.

| Retrieved source | What was actually checked | Fixture scope |
| --- | --- | --- |
| [Astronomy Engine JS API](https://raw.githubusercontent.com/cosinekitty/astronomy/master/source/js/README.md), HTTP200 | Selected search/frame definitions; corresponding bundled implementation inspected, including `PairLongitude`, `GeoVector`, global eclipse loops and `SunPosition`. Upstream documentation is a retrieved snapshot, not a replacement dependency. | API semantics, not independent astronomical validation. |
| [NASA solar catalogue](https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html), HTTP200 | All ten rows in the declared horizon, including 2027-08-02 and 2028-07-22 total eclipses; eclipse-type and greatest-eclipse definitions. | All ten types and peaks within a 60-second test tolerance after the time-scale conversion below. |
| [NASA lunar catalogue](https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html), HTTP200 | All ten horizon rows, including 2027-07-18 penumbral magnitude 0.0014 and 2028-12-31 total eclipse. | All ten types and peaks, same 60-second selected-fixture tolerance. |
| [NASA delta-T explanation](https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html), HTTP200 | `ΔT = TD − UT`; UTC/UT distinction. | Catalogue peak times are TD, **not UTC**. Each fixture subtracts its row's published rounded ΔT (76–78s). Future Earth rotation is not known exactly. |
| [NASA phase table](https://eclipse.gsfc.nasa.gov/phase/phases2001.html), HTTP200 | UT heading, phase definition, January 2027 and January 2030 rows. | Eight rounded-minute phase fixtures; tolerance90s. |
| [HKO 2027 conversion table](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2027e.pdf), HTTP200 | Solar-term column: equinoxes March21/September23 and solstices June21/December22 in Hong Kong's civil convention. | Four UTC+8 civil dates, not second-precision reference roots. Distinct issuing authority; no claim of an independently derived dynamical model. |
| [NASA JPL Horizons](https://ssd.jpl.nasa.gov/horizons/manual.html), three successful API requests | Geocentric observer quantity31: Sun near 2027-01-01 contact, Mars on three days around its 2027-01-10 station, Moon around 2026-10-30 Cancer ingress. Response headers and numerical rows checked. | Seven apparent-longitude/latitude samples within1arcminute; Mars longitude maximum brackets the station and Moon longitude is near90°. JPL/engine model differences remain. No independent timing validation of every aspect/station. |

Source access failures are preserved: USNO 2027 seasons API HTTP503; an HKO solar-eclipse URL HTTP404; the selected Mercury Horizons request HTTP503. They did not supply verified facts. No successful Mercury conjunction fixture is claimed. NASA's eclipse and phase pages share an issuing authority; they are not three independent experimental validations. Published catalogue agreement and JPL spot checks do not validate personal/historical predictions or every event in1900–2100.

## Verification and review state

Run `node scripts/tests/horizon-astronomy.mjs`. Optional `HORIZON_ASTRONOMY_RECEIPT=/path/to/receipt.json` writes timing, exact input, counts, bytes and failures. The focused suite covers the full case-union horizon,39 official numerical/date fixtures, all-pair coverage, root residuals, actual station direction changes, nonzero sky separation at a longitude conjunction, explicit aberration conventions, partial intervals, partition membership, equivalent offsets, strict invalid inputs, progress, cancellation in every stage and recovery.

R1 evidence is under `docs/evidence/horizon/astronomy/`. Initial failed and corrected attempts are distinct. Independent QA has also checked exact native phase/eclipse partition membership and found only a ~3×10⁻⁹km shadow-distance change under different search seeds; a1×10⁻⁶km tolerance for that scalar is harmless and does not relax timestamps, classification, visibility or method semantics. R2/R3 integration, actual browser exports, full shared release gates and deployment are owned by the parent review and are not established by this module's tests.

## R2 integration and R3 scoped acceptance

The independent astronomy-owner integration review passed **17 checks** against actual short computations and controlled index-boundary markers. UTC+14 and UTC−11 observers retained correct event membership and the full case-union interval: the same global eclipse can fall outside one case's selected civil dates while remaining inside another's. Midnight endpoints remained half-open, counts and the canonical validator agreed, and caller cancellation stopped at the astronomy handoff.

The initial UI omitted astronomical details and used “Exact event UTC.” The UI owner corrected it to “Calculated event UTC,” exposed coordinate frames, timing/physical-accuracy details, true angular separation and dependency groups, and surfaced astronomical limitations. The review here verified source wiring; actual DOM/export checks belong to the separate QA receipt. No astronomical numerical code changed during this cross-review.

The full stress run established exact default brute/optimized equivalence and **44 valid checks**, plus one **test field-path mistake**. The test read house fields from the compact phase-summary record rather than the detailed Western chart. It was not a conditional engine fallback or an astronomy defect. The corrected helper independently inspected all **1,827** Tromsø detailed charts, preserving requested Placidus, actual Regiomontanus and the warning on every row. The failed full receipt and passing focused correction are both retained. See `docs/2026-10-horizon-stress.md` for counts, runtime, memory and the precise correction.

**R3 astronomy/stress scope: ACCEPT, conditional on the corrected full CI stress gate before publication.** No new numerical blocker remains. This acceptance binds astronomy module SHA-256 `8d7ed7be397dd54c2e4e4003d563d0c784eae39a6f8d2c4123a5d8bb81261c01`, integration core `427165f7c0e91db41ce91d2efd6719d065cff067ab54e502ba470be3c75c2d9f`, and corrected stress driver `a835216bc9348d01ff85ed88334168f23f0a06e9a4397d3abc5cfb1a505b36da`. The parent must bind its final held product/QA receipt and actual CI result separately. This is not a claim that the entire corrected full driver has already passed locally or that deployment has occurred.
