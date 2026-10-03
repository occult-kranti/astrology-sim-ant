# Chart and time calculation methods — 2026-10-03

The Workbench preserves its historical interpretive framing. Measured astronomical quantities and traditional rules are different kinds of information; none of the latter establish guaranteed personal events or scientific predictive validity.

## Shared inputs and uncertainty

`core/time.js` accepts a proleptic Gregorian civil date, astronomical year numbering (1 BCE = 0), clock time with optional seconds, and either hours east of UTC or a named IANA zone. Strict parsing rejects impossible dates/times rather than JavaScript rollover; `setUTCFullYear` preserves years 0–99. No input is parsed using the host device zone. Location units are latitude north/longitude east in degrees; valid geographic ranges are ±90/±180.

The shared moment picker offers explicit UTC offset or an IANA zone. Named-zone conversion samples candidate offsets and round-trips every date/time component using browser `Intl` data. Missing clock times are rejected; repeated clock times require an explicit earlier/later choice. A named zone is never inferred from longitude. Browser tzdb versions differ and historical data, particularly pre-1970, may be incomplete. Verify the birth record; this is not a promise to reconstruct historical legal time worldwide. Invalid edits announce that displayed results have not been recalculated; invalid natal calculation clears current chart output.

Nativity's **Unknown birth time** flow calculates a civil-day interval and seven planetary midpoint positions with 25 samples to estimate each day's angular range. It returns no ascendant, Midheaven, cusps, sect, dignities or time-sensitive interpretation. Midnight DST gaps start at the first real instant of the date (São Paulo 2018-11-04 starts at 01:00); completely skipped dates such as Apia 2011-12-30 are rejected. Sampled extrema are estimates, not an exact uncertainty envelope. Other historical chart tools continue to require an exact time; this release does not retrofit a date-only mode into every specialized interpretation.

## Astronomical positions and houses

| Quantity | Engine/convention | Validation and limits |
|---|---|---|
| Planet longitude/latitude | Existing vendored MIT Astronomy Engine; aberration-corrected geocentric EQJ vector rotated to true ecliptic/equinox of date; degrees | Six Astrodienst 2026-01-01 00:00UT tropical table fixtures within 0.02°. Upstream's approximately one-arcminute target is not proof of all application wrappers/dates. |
| Speed/retrograde | Central circular finite difference over ±6 hours, degrees/day; speed <0 means retrograde | Mercury direct/retrograde dates and Aries wrap tested. Near-station timing remains approximate. |
| Angles and Regiomontanus | Local apparent sidereal time, true obliquity and ecliptic/equatorial geometry | Three northern/southern cases independently compared to Swiss Ephemeris; 36 cusps within 0.001°. Exact ±90° latitude rejected as undefined. |
| Placidus | Time-proportional semi-arc trisection; corrected equatorial declination `atan(tan(epsilon) sin(RA))` and nocturnal semi-arc `180° − semiDiurnalArc` | 36 independent Swiss cusps within 0.001°; largest measured error across both systems 0.000018°. The old London cusp 2 differed by 28.49°. Above 66° existing Regiomontanus fallback is explicitly named in metadata, method text and SVG warning. |
| Whole Sign / Equal | Whole-sign cusp at floor(asc/30)×30; Equal starts at exact ascendant, both then 30° increments | Invariants tested by original suite. Polar angles still sensitive; geographic poles rejected. |
| Sect | Actual topocentric geometric solar-center altitude >0; no atmospheric refraction | Independent of house system. London 2026-01-01 09:00UTC counterexample fixes whole-sign house misclassification. This convention differs slightly from visible upper-limb sunrise. |
| Aspects | 0°, 60°, 90°, 120°, 180°. Default Lilly sum of planetary moieties; natal wheel optionally uniform explicit 0–15° orb | Circular separation and custom allowance tested. Applying/separating uses a 0.05-day linear speed projection. Wheel override does not silently rewrite historical reading conventions. |
| Natal/transits/synastry | Existing native chart SVG, transit exact-hit windows and two-chart comparison remain | Dedicated pages preserve their documented filters and conventions. No new transit/synastry engine is claimed. |

The moment picker retains the existing UI year gate −1999…3000 with era-quality notes; native date inputs may support a narrower entry range. Only the documented modern reference cases were independently revalidated in this release. Older source claims about historical precision are not expanded by these tests. Local horizon effects, terrain, elevation, atmospheric refraction and historical ΔT are not newly calibrated here.

## Vedic methods and sunrise day

The existing Vedic panel uses sidereal = tropical − **linear Lahiri estimate** (23.8531° at J2000 plus 50.2877 arcseconds/year), whole-sign houses and mean lunar nodes. It has one supported ayanamsha, not a selector of unvalidated alternatives. The 2026-01-01 sidereal Sun fixture passes within 0.03°; this does not establish historical Swiss/IAE/JHora equivalence. Small offsets can change a boundary placement.

Instant tithi/paksha, nakshatra, yoga and karana remain existing calculations. Vāra now belongs to the local sunrise-bounded day instead of the UTC weekday. An explicit IANA zone is preferred, then supplied offset, then a disclosed longitude/15 mean-solar date when a legacy caller supplies neither. Before sunrise it retains the preceding sunrise's weekday. No sunrise interval yields unavailable rather than a fabricated polar weekday. Planetary hours, Panchang and daily traditional-practice descriptions share this interval. Reusing one interval inside a compound reading avoids repeated ephemeris searches.

Existing Vimshottari uses a 365.2425-day year; divisional charts and ashtakavarga follow the repository's cited tables. Ṣaḍbala includes documented approximations. These are preserved convention-based study tools, not newly certified reference implementations. Instant Panchang elements do not establish regional festival dates; amanta/purnimanta rules, observational policies and alternative ayanamshas require additional independent fixtures before expansion.

## Independent reference evidence and tolerances

Research/retrieval date: 2026-10-03.

- [Astrodienst 2026 tropical ephemeris](https://www.astro.com/swisseph/ae/2000/ae_2026d.pdf): Jan 1 00:00 UT Sun 280.568611°, Moon 66.716667°, Mercury 268.65°, Venus 279.2°, Mars 282.683333°, Saturn 356.166667°. Threshold 0.02° includes printed rounding. [Sidereal Lahiri table](https://www.astro.com/swisseph/slae/2000/slae_2026d.pdf): Sun 256.346667°, threshold 0.03° for the labeled linear model.
- [Swiss Ephemeris source](https://github.com/aloistr/swisseph/tree/aacf962d19d79f8bc921dbcdaacf306d85be1917), version 2.10.03: independently compiled in `/tmp`, calls `swe_houses(swe_julday(2026,1,1,0,SE_GREG_CAL),lat,lon,'P'/'R',...)` at London, Sydney and New York. Numeric fixtures and exact provenance are `scripts/tests/fixtures/swiss-houses-2026.json`. Swiss code is not bundled or linked into this application. Geographic inputs and tolerance are in the fixture/test. A separate reviewer checked defining semi-arc residuals at latitudes 0, ±33.9/51.5 and ±66; worst 5.984×10⁻¹⁰°.
- [Temporal ambiguity guide](https://tc39.es/proposal-temporal/docs/ambiguity.html): Los Angeles 2018-11-04 01:30 maps to 08:30Z or 09:30Z; 2018-03-11 02:30 does not exist. Exact instant comparisons. Political skipped-day and São Paulo midnight-gap regression cases additionally exercise IANA behavior.
- Sunrise/polar tests are geometric boundary checks, not independent observatory rise/set tables. Physical horizon observations and a broad historical chart reference corpus remain outside this release's evidence.

Run `node scripts/tests/2026-10-calculations.mjs` for 15 grouped checks including the 72 cusp comparisons. The full engine gate also runs this module. Calendar/prayer methods and their independent fixtures are documented separately in `2026-10-calendar-methods.md`.
