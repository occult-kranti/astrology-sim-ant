# Working-feature skeptical review (pass 2)

Review date: 2026-10-03. Reviewer: camera/astronomy subagent, independently reviewing `/workspace/astrology-sim-ant` without editing its app files. Read working diffs for core astro/chart/vedic/planetary-hours, shared time parser, moment-picker, nativity handling and new cultural-calendars module/page. Ran the existing `node scripts/engine-test.mjs`: all passed. These passing tests did not catch the material findings below. This report records the state inspected, not a claim that fixes below are merged.

## Material findings

### P0 — Placidus intermediate cusps violate their defining temporal arcs

`assets/js/core/astro.js:placidusCusp` computes declination as `asin(sin(eps)*sin(ra))`; for a point on the ecliptic, the needed relation is `tan(dec)=tan(eps)*sin(ra)`. It also uses the semi-diurnal arc for houses 2 and 3, which require the semi-nocturnal arc `180−SDA`.

Reproduced at `2026-01-01T00:00:00Z`, latitude 51.5°, longitude 0°. Existing h2 cusp is 240.8156537409°. Converting that longitude independently to RA and declination yields RA 238.6690091358°, SDA 62.2545132678°. The Placidus h2 condition is `RA=RAMC+180−(2/3)*(180−SDA)` (wrapped), yielding 202.1652451155°, a residual of **36.5037640203°**. H3 residual is **21.7209947939°**; h11/h12 residuals are about 0.36°/0.41° because of the declination error. Southern latitude −33.9° also fails (h2 residual −12.35°, h3 −10.18°). This is a pre-existing engine defect retained in the expanded chart workflow; it must not be described as validated precision.

Required correction: solve the correctly specified day/night arc equations, detect convergence/undefined polar geometry, and add independent condition residual tests. References read during this review:

- https://kerykeion.net/libephemeris/docs/reference/house-systems — explicit day/night arc equations and ecliptic RA/declination relation.
- https://docs.rs/oxiephemeris-astro/latest/src/oxiephemeris_astro/houses.rs.html — independent open-source implementation documents `RA = RAMC + c + g*SDA` with h11 (0,1/3), h12 (0,2/3), h2 (60°,2/3), h3 (120°,1/3).
- https://alexeyborealis.com/blog/placidus-cusps/ — independent derivation of `SDA(RA)=acos(−sin(RA)*tan(latitude)*tan(obliquity))`. The article's introductory house numbering appears inconsistent; use the explicit independently agreed h11/h12 mapping above.

Acceptance: derived residual <1e-7° for regular northern/southern fixtures; independent fixed house-table examples where available; no silent unconverged/polar cusps.

### P0 — Prayer calculation chooses the wrong civil day across the date line

`assets/js/core/cultural-calendars.js:prayerTimes` seeds the engine with UTC components identical to the requested local Gregorian date. This is insufficient when civil zone and longitude straddle the international date line.

Exact reproduction:

```js
prayerTimes({date:'2026-10-03', latitude:-13.83, longitude:-171.75, timeZone:'Pacific/Apia'})
```

All six results have `localDate:'2026-10-04'`, including Dhuhr at 12:17 on October 4. The form label promises the requested local date October 3. `differentDate:true` is useful for genuine dawn/night spillovers but cannot justify an entire wrong solar day.

Required correction: select a candidate calculation day whose calculated solar noon/Dhuhr falls on the requested local civil date, checking neighboring UTC seed dates. Reject a genuinely skipped local date instead of shifting it (e.g. Apia 2011-12-30). Keep day spillovers explicit for Fajr/Isha.

Acceptance: Pacific/Apia and Pacific/Kiritimati date-line fixtures; America/Adak or another opposite side; skipped-date rejection; ordinary London/Delhi fixtures unchanged. Calendar implementation agent received this finding directly.

### P1 — Unknown birth time rejects a valid civil day when local midnight does not exist

`assets/js/app/book3.js` obtains the unknown-time day range by calling `resolveZonedTime(date,'00:00',zone)` and the following midnight. On `2018-11-04` in `America/Sao_Paulo`, midnight is nonexistent due to a DST transition, while the civil date is valid (noon resolves to `2018-11-04T14:00Z`). The date-only birth mode therefore refuses all output even though the record supplies sufficient information for a day range. Repeated midnights cause a similar ambiguity without an input control suited to whole-day boundaries.

Required correction: a shared civil-day interval resolver that selects the first valid instant belonging to the day and the first valid instant of the next day (including midnight gap/fold handling), rejecting a date only if it was entirely skipped. Keep timed births' gap rejection and explicit fold selection unchanged.

Acceptance: São Paulo midnight gap, midnight fold where supported, ordinary 23/25-hour DST days, and Apia skipped civil date. Unknown-time output still contains no angles/houses/sect/precise interpretations.

### P1 — Exact-pole houses return contradictory and degenerate cusps

`houses(new Date('2026-01-01T00:00Z'),90,0,'placidus')` returns fallback Regiomontanus with many duplicated cusps. `ic` is 279.8002956832°, but cusp4 is 237.5127180496° from catastrophic pole geometry; `houseOf` treats a zero-width cusp span as an immediate match. A broad warning that polar geometry is sensitive is not sufficient for an internally inconsistent chart.

Required correction: explicit unavailable/rejection for singular exact-pole angles/house geometry, or a deliberately specified convention that avoids computing unphysical ordinary rising houses. Reject nonfinite/degenerate cusp sets instead of deriving dignity/house claims.

Acceptance: ±90° inputs do not produce ordinary house assignments; near-polar output is explicitly qualified and non-degenerate for the permitted convention.

## Checks that passed and should be preserved

- Native time parser rejects invalid civil dates and does not map year 0099 to 1999.
- 2018-11-04 01:30 America/Los_Angeles is rejected as ambiguous by default; the spring 02:30 gap is rejected. The caller has explicit earlier/later selection.
- Unknown birth time with an ordinary day suppresses houses/ascendant/Midheaven/Fortune and displays sampled planetary ranges, with midpoint and sampling disclosed.
- Sect now uses the astronomical geometric solar horizon, not whole-sign house number.
- New calendar outputs name method IDs and civil-midnight boundaries; runtime calendar support is checked. Hebrew/Islamic dates are not described as authority-issued observance determinations.
- New prayer wrapper keeps unresolved polar rise/set events unavailable (tested Tromsø June and December solstices), exposes method/Asr/twilight adjustments and does not auto-invent Ramadan adjustments.
- Qibla labels true-north spherical bearing, with pole/destination/antipodal unavailable states.
- Vedic notes now disclose linear Lahiri, mean nodes, dasha year length and instantaneous Panchang scope instead of claiming exact JHora equivalence.

## Evidence limits

The existing comprehensive engine suite passed on the inspected working tree, but it was not independent evidence for Placidus accuracy. The precise defects above were found by checking definitions and adversarial date/location inputs. The new UI is still under active implementation and has not been personally browser-tested in this review; local browser capability is blocked in this environment. No screenshots, physical-device checks or deployed-version verification are claimed here. Recheck only the material repaired paths before release; this is a bounded pass, not an open-ended styling review.

## Repair verification update

Re-ran the targeted working-tree suites after the implementation team repaired the reported time and boundary defects:

- `node scripts/tests/2026-10-calculations.mjs`: all 13 named checks passed, including São Paulo's 23-hour civil day, Samoa's skipped day, and exact ±90° house rejection.
- `node scripts/tests/cultural-calendars.mjs`: all 58 checks passed, including the exact Apia 2026-10-03 regression, Kiritimati, skipped Samoa date, host-zone invariance, and preserved ordinary timetable fixtures.

Those three findings are repaired in the working tree and independently rechecked by this reviewer. Placidus is still pending independent fixed-source comparison and correction at the time of this update; the existing targeted suite has not yet acquired that regression. The calendar lead is compiling a pinned Swiss Ephemeris source for an independent comparison, not shipping that dependency in the app.

## Final pass-2 disposition

All four reported material findings are now repaired and rechecked in the working tree. After the Placidus correction, `node scripts/tests/2026-10-calculations.mjs` passes **14 checks**, including **72 cusps** compared with the pinned Swiss Ephemeris C reference at 0.001° tolerance. The generated reference fixture records source/version and inputs; Swiss Ephemeris remains a validation-only reference, not a shipped app dependency.

This reviewer additionally recomputed each corrected Placidus cusp's ecliptic-to-equatorial coordinates and independently checked its defining semi-arc equation at latitudes 0°, 51.5°, −33.9°, +66° and −66° at 2026-01-01T00:00Z, longitude 0°. Worst angular residual was **5.984e-10°** across 20 intermediate-cusp checks (required <1e-7°). This verifies the formerly incorrect day/night geometry directly as well as against the second implementation.

No remaining material numerical blocker was found within the bounded review scope. Full integrated UI/browser, accessibility and deployment gates belong to the release pass and are not inferred from these calculation tests.
