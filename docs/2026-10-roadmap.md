# October 2026 calculator recovery and release roadmap

Created 2026-10-03 before implementation. Owning repository: `occult-kranti/astrology-sim-ant`, the independent Astrologer's Workbench; Skylens lives in the separately inspected `occult-kranti/skylens`. Preserve both applications and link coherent workflows instead of duplicating this repository's 115 pages of source-backed study tools inside Skylens.

## Recovered baseline

- Remote main: `3a3ce9953e47a078e659723a52187648f1f08486` (2026-08-02). No open issues or pull requests; main is unprotected. Pages workflow runs 30729460682 and 30729460390 succeeded for that exact SHA.
- Authorized connector recovered all 520 text files (16,183,077 bytes), independently verifying their Git blob SHA before writing. Shell cloning was unavailable. Local recovery commit `5752eeb` is a snapshot commit, **not** the upstream commit; publishing must preserve the remote main parent through the connector.
- Working branch `improve/2026-10-calculations-calendars`. No user changes existed in this new snapshot.
- Baseline `node scripts/engine-test.mjs`: all passed. Baseline `node scripts/audit.mjs`: 115 HTML/215 JS, 0 problems. These passing tests do not validate every advertised calculation.
- Existing pure core, native ES modules, static relative URLs, vendored MIT Astronomy Engine. No package/build step. Existing architecture and historical-source framing remain.

## Product brief and flows

The Workbench supports transparent study of chart methods and cultural dates. Preserve the chart and library navigation; add an accessible Calendars & Tools destination and a clear link to the companion live sky. Reuse one exact-time/coordinate model. Chart users enter birth date, place, time certainty and either an IANA zone or an explicit UTC offset, review ambiguous times, and then read a chart or a deliberately limited date-only position table. Calendar users choose a civil date, time zone/location where required, and a named method, then compare real calculated results with a method explanation.

Controls must use labels and keyboard access; errors are announced and invalidate stale results. Unknown birth time must hide angles, houses, day/night-dependent dignities and derived precise interpretations. Mobile inputs wrap; result tables scroll within their container. Existing design tokens and chrome are reused. Unavailable dates, unsupported calendars and polar conditions explain the missing result rather than inventing a number.

## Milestones and acceptance gates

P0 = incorrect core results/release blockers; P1 = central requested workflows; P2 = validated useful extensions; P3 = speculative work. Owners are bounded: lead owns existing calculator integration and time/core fixes; calendar helper owns only new cultural-calendars core/app/page/tests/method document. Root coordinator owns cross-project integration and remote release.

| ID / priority | Problem → expected behavior | Owner; files | Dependencies / approach | Acceptance and validation | Status / evidence |
|---|---|---|---|---|---|
| R0 / P0 | Unverified prior claims → recover actual sources and deployed SHA | Lead; external baseline manifest, docs | Connector pinned snapshot, hash every blob | Exact files; existing engine/audit run | Done; evidence above |
| R1 / P1 | Broad feature request overlaps extensive existing tools → preserve coherent coverage | Lead; research/method matrix | Current primary sources and actual inventory | Existing/improved/deferred status for every requested family | Done; `2026-10-research.md` + joined coverage decisions below |
| T0 / P0 | `Date.UTC(42,…)` becomes 1942 and invalid dates overflow → strict civil date parsing | Lead; new core/time.js, app/shared.js, picker | Existing calendar helpers; preserve explicit offsets | Year 42 exact; Feb 30 rejected; signed years and invalid inputs tested | Done; strict parser + Gregorian leap/year42 fixtures in 2026-10-calculations |
| T1 / P1 | Current-era offset presets hide historical DST ambiguity → named IANA zone with gap/fold handling | Lead; core/time.js, moment-picker.js | Intl formatter, explicit candidate-instant search; no new dependency | Published California repeated/missing-hour fixtures; manual offset remains | Done; named-zone picker, explicit fold choice and rejected gap fixtures |
| T2 / P1 | Unknown birth time still produces precise houses → date-only natal workflow | Lead; book3.js, nativity.html | Strict time input + planetary core | No asc/MC/houses/day/night interpretations; labeled representative positions | Done; seven planetary day ranges; no angles/houses/sect; midnight-gap date boundaries tested |
| A0 / P0 | Rounding produces 30° Pisces or 59′60″ → normalized next-sign display | Lead; core/astro.js | Circular total-minute/second rounding | 359.999° → 0° Aries; minute/second carry tests | Done; degree/minute/second carry fixtures |
| A1 / P0 | Placidus intermediate cusps use wrong declination/night arc and silently switch above 66° → correct formulas, independently matched cusps, explicit system notice | Lead; astro.js and chart display | Correct equatorial declination/nocturnal arc; retain explicit polar fallback; reject undefined geographic-pole angles | Polar fallback named; valid system selection; no silently mislabeled chart | Done; corrected two Placidus semi-arc formulas and exposed polar fallback; 72 independent Swiss cusps within 0.001°; exact poles rejected |
| A2 / P0 | Sect inferred from whole-sign house instead of horizon → actual geometric solar altitude | Lead; astro.js | Existing AE observer/horizon calculation | Independent geometric criterion; house-system invariance; 2026 London sunrise counterexample | Done; actual solar-center altitude, house-system invariance regression |
| A3 / P1 | Panchang vāra uses UTC day → local sunrise-defined day or explicit unavailable | Lead; vedic.js | Reuse planetary-hours sunrise-day logic | East/west longitudes and before-sunrise tests; no invented polar weekday | Done; explicit zone/offset or disclosed mean-solar date; before-sunrise/UTC-date-line/polar tests |
| C0 / P1 | Cultural-calendar catalogue lacks usable calculations → organized converter page | Helper; new cultural-calendars files | Reuse calendar.js; native supported Intl calendars | Hebrew and Chinese primary fixtures, Julian boundary fixtures, capability errors | Done; 6 native method IDs, Gregorian/Julian/JD converter; primary date fixtures and capability errors |
| C1 / P1 | Christian movable dates absent → named Gregorian and Julian computus | Helper; cultural-calendars.js | Independent published integer algorithms | USNO 2010/1954/1962 reference cases and century boundaries | Done; both computus conventions, USNO examples and century boundaries |
| C2 / P1 | Direction/prayer tools absent → real Qibla and vetted prayer calculation if available | Helper; new module/page | Qibla great-circle geometry; prayer vendor only with compatible license and reference cases | True-north label, singularity/high-latitude handling, timetable evidence | Done; 7 Adhan methods, Asr/high-latitude/Isha controls; retained independent Ankara timetable ±2min; date-line and unavailable cases |
| I0 / P1 | New tools must be discoverable and offline policy consistent | Lead; shared.js, tools.html, sw.js/search index | New calculator page ready | Relative links under Pages base; cache version and search updated | Done; Cast navigation and tools hub; companion link; refreshed 116-page search index and versioned service worker |
| Q0 / P0 | Existing assertions miss meaningful scientific bugs → independent regression fixtures | Lead/helper; new suites registered in engine-test | Astrodienst 2026 primary table; Temporal/USNO/HKO/Hebcal sources | Independent tolerances, invalid input, horizon, unknown-time UI tests | Done; 15 new calculation groups plus 58 calendar checks; all original tests pass |
| Q1 / P1 | Integration must remain usable → browser, accessibility and responsive checks | Lead/root; browser harness, docs | Combined app ready | End-to-end natal/calendar flows; no console errors; 390/1280 px screenshots | Complete; real CI run 37095869504 passed mobile/desktop natal/calendar journeys and all four screenshots were inspected |
| P0 / P1 | Performance claims unmeasured → record actual baseline and after costs | Lead; verification doc | Same Node/browser conditions | Measured source/page bytes and representative calculation timings; no invented mobile result | Done; same-host before/after microbenchmarks and source byte counts in 2026-10-verification.md; mobile/browser metrics unmeasured |
| D0 / P0 | Local build is not deployment → publish tested remote-parent commit and verify Pages | Root coordinator | Checks pass; authorized connector | Workflow success at expected SHA + live content | Complete; PR #2 merged as 0f7a7a3b; main run 37096030705 passed and live release.json independently matched. Legacy publisher cleanup is an admin follow-up |

## Feature coverage decisions

| Requested family | Existing evidence | Decision this release / remaining gate |
|---|---|---|
| Natal positions, four house systems, chart SVG | astro.js/chart.js/book3.js | Preserve, fix input/rounding/polar-system disclosure; independent positions fixtures |
| Tropical/sidereal, ayanamsha | AE tropical; linear Lahiri in vedic-data.js | Preserve named linear Lahiri estimate with honest accuracy/range. No fake extra options; a second validated method requires independent references |
| Aspects and orb conventions | aspects.js (Lilly moieties), transits.js, synastry.js | Preserve working specialized views; natal wheel now offers named Lilly moieties or explicit 0–15° fixed orb; readings keep their own conventions |
| Retrograde | ±6-hour circular finite difference in astro.js | Retain, document station-resolution limitation, validate signs/wrap |
| Vedic nakshatra/Panchang/dasha/vargas | vedic.js + cited vedic-data.js | Preserve extensive existing convention-based modules; fix UTC vāra; distinguish instant elements from festival policy |
| Advanced Vedic strength and predictions | Ṣaḍbala includes documented approximations; daśā uses 365.2425-day year | Do not claim Swiss/JHora exact equivalence; document assumptions, preserve historical interpretive framing |
| Time zones / unknown time | Manual decimal offsets and no unknown-time flow | Implement strict shared conversion, named zones, fold/gap choice, limited natal results |
| Gregorian/Julian | core/calendar.js handles proleptic conversion/JDN, signed years | Reuse, add accessible converter and date validation |
| Islamic calendar/prayer/Qibla | No corresponding calculator found | Implemented named Intl civil/Umm al-Qura comparison, true-north Qibla and local MIT Adhan prayer calculation with method choices and reference checks |
| Hebrew | Research text, no civil converter | Native supported date display with sunset distinction; detailed observance policies deferred until Israel/diaspora and boundary fixtures sourced |
| Hindu/Panchang | Existing instantaneous elements and muhūrta/horā | Reuse; full regional festival calendars remain unimplemented until amanta/purnimanta/local rules validated |
| Buddhist/Chinese/Indian Saka | Buddhist historical library, no broad civil converter | Named native civil conversions and HKO fixture; no universal Buddhist holiday claim |
| Jain/Sikh | No validated community-specific calendar engine found | Explicit catalogue/deferred status; authority/region/version needed, no invented output |
| Christian observances | No calculator found | Gregorian and Julian Easter; label convention, not universal denomination |
| Camera/astronomy/simulation | Owned by companion occult-kranti/skylens | Coordinate integration by root; no duplication inside this historical workbench |

## Three bounded review passes

1. Architecture/feasibility: complete baseline inspection; preserve static ES modules and existing engine; review unknown-time and calendar method boundaries before edits.
2. Skeptical working review: independent fixtures, invalid-date/DST cases, true horizon sect, polar and cultural-boundary handling; fix material findings.
3. Release review: full existing suites, new suites, browser journeys, generated artifacts, relative URL/service-worker behavior and actual remote deployment evidence.

Physical camera/device validation belongs to the companion repository and cannot be proven by these calculator checks. Remaining unsupported traditions and approximation limits must stay visible in the final handoff. No paid services or mandatory external runtime API are introduced.

## Release coverage and deliberate remaining work

All feasible P0/P1 calculation work in this workstream is implemented and locally checked. Required UI journeys passed in real Chromium and the tested PR was merged; the deployment record is maintained in the verification document. Existing transits/synastry, favourites/saved readings and Vedic panels remain in their original pages. The owning application is linked from Skylens, avoiding a second competing implementation.

P2 limitations remain explicit: additional independently validated ayanamshas; broad historical ephemeris/house reference grids; unknown-time modes for every specialized historical tool; complete authority-specific Hebrew observances, regional Hindu festivals, Jain/Sikh calendars and East Asian regional variants. They need conventions and independent references, not decorative placeholder screens. Native civil calendars and instantaneous Panchang must not be described as those broader modules. No proprietary or incompatible-licensed engine has been copied into the application.

Review pass 1 established native static ES modules, preserved existing corpus and bounded new code ownership. Review pass 2 found four material bugs (Placidus equations, exact-pole angles, date-only midnight gaps and prayer date-line anchoring); all were repaired and independently rechecked in `2026-10-skeptical-review.md`. Review pass 3 requires remote CI browser success and matching GitHub Pages content; final deployment evidence is maintained by the release coordinator.
