# Calculated sky, stellar directions and timeline methods

This extension adds a calculated geometry layer to the desktop atlas. It reuses the vendored Astronomy Engine and the established seven-body apparent-position convention; it does not replace the historical chart, dignity, house or calendar engines. The data, geometry and interpretation layers remain distinguishable.

## Inputs and coordinate frames

`buildSkySnapshot({dateISO,timeZone,lat,lon}, options)` requires an explicit UTC/offset timestamp, a runtime-recognized IANA zone and valid coordinates. UTC and observer civil years must both be within 1900–2100. Unknown birth time is rejected: the existing personal-calendar interval tool is the appropriate alternative. Geographic coordinates affect the horizon calculation, not geocentric planetary longitude. A zone does not establish that it belongs to the coordinates.

The ten supported geocentric bodies are Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto. Sun is identified as a star, Moon as a natural satellite and Pluto as a dwarf planet. These ten include all eight planets only when Earth is counted in the separate heliocentric model; Earth cannot have a geocentric sky direction from its own center. Asteroids, every moon, hypothetical planets and the entire stellar sky are not implied.

| Output | Origin and axes | Method and scope |
|---|---|---|
| Planet longitude/latitude | Geocentric, apparent, true ecliptic/equinox of date | `GeoVector(body,date,true)` → `Rotation_EQJ_ECT(date)` → spherical coordinates; same path as the canonical seven-body `bodyPosition` |
| Distance | Geocentric AU | Length of the apparent geocentric vector; finite light-time conventions belong to that vector |
| Speed / retrograde | Geocentric longitude, degrees/day | Central wrapped angular difference at ±6 hours; this projected motion does not reverse a physical orbit |
| Horizon | Topocentric equator/equinox of date to local altitude/azimuth | `Equator(...,true,true)` and `Horizon`, height 0 m, **no atmospheric refraction**; altitude alone is not visibility |
| Heliocentric xyz | Sun center, geometric J2000 mean ecliptic, AU | `HelioVector` → `Rotation_EQJ_ECL`; no light-time or aberration correction; Sun is exactly the origin |
| Modern stellar direction | Propagated J2000 catalogue direction → true ecliptic/equinox of date | Cartesian space-motion approximation, then coordinate rotation; **geometric**, without annual aberration or parallax |
| Historical Behenian marker | Approximate longitude only | Inherited rounded ~2020 longitude plus linear 50.29 arcsec/year precession; not an astrometric 3D star model |

A visual projection may rotate the physical xyz coordinates. A logarithmic/compressed distance scale or enlarged body symbols must be labelled. Physical vectors are instantaneous ephemerides, not an N-body integration, circular-orbit fit or a physical-size model. Stellar directions must never be inserted into the AU orbital model as if they were planetary positions. Equal 30° zodiac signs are separate from the unequal IAU constellations.

The optional aspect list uses conjunction/sextile/square/trine/opposition and an explicit uniform 0–10° orb (3° default). Applying/separating is an instantaneous derivative classification from the sampled speeds. This is geometry, **not Lilly's planet-specific moieties, full horary judgement or an outcome forecast**.

## Two distinct star layers

The default modern layer has **20 familiar named stars**, selected to make the visualization useful while preserving a small reviewable, licensed dataset: Achernar, Polaris, Aldebaran, Rigel, Capella, Betelgeuse, Canopus, Sirius, Procyon, Pollux, Regulus, Acrux, Spica, Hadar, Arcturus, Antares, Vega, Altair, Deneb and Fomalhaut. It is not a magnitude-complete, all-sky or culturally exhaustive selection.

The source is **HYG 4.1**, pinned to commit `c7f7f883fe678cc7680169a50ccd7dcc49b060ce`. The selected numerical data is separately licensed **CC BY-SA 4.0** and credited to David Nash / Astronexus and HYG contributors. See [the explicit data license and changes](../assets/js/core/data/bright-star-catalog.LICENSE.md). The application code retains its existing license.

The HYG documentation defines `x,y,z` as equatorial J2000 Cartesian positions in parsecs and `vx,vy,vz` as parsecs/year derived from proper motion and available radial velocity. For elapsed Julian years `t = AstroTime.tt / 365.25`, the application computes:

`r(t) = r(J2000) + v × t`

It then normalizes that vector to a direction and applies the existing EQJ→ECT rotation. This avoids guessing whether a raw `pmra` field represents α̇ or μα cos δ. No selected distance has HYG's `>=100000` invalid/uncertain-parallax sentinel. Binary orbital motion, acceleration, annual parallax/aberration, gravitational deflection and new uncertainty propagation are omitted. A catalogue distance shown to several digits is not a new precise distance measurement.

A separate **historical layer is opt-in** (`includeStars:true`). It retains the existing fifteen Behenian records and their qualified approximate longitude model. `includeModernStars:true` adds the existing, explicitly modern Fomalhaut substitution as a sixteenth marker. This does not change the historical fifteen. The catalogue and historical marker can disagree because they are different position models and source purposes; neither is silently substituted for the other.

A newly checked detail: Agrippa II.31 calls the greater Dog-star *Venereal*, agreeing with the inherited Sirius/Venus entry. The inherited Jupiter + Mars alternative remains unattributed by this new reading. II.47 describes the stellar images; it is not the citation for their planetary natures. Historical chapter longitudes are not used as modern ephemerides. No full-book reading or verification of all inherited natures is claimed.

To expand the catalogue, retain source identifiers, epoch, frame, units, motion convention, uncertainties/missingness, redistribution terms and representative propagation tests. Do not fabricate a current coordinate from a star name or reuse a symbolic longitude as a spatial vector.

## Timeline calculation and limits

`normalizeSkyTimelineRequest`, `buildSkyTimelineSync` and async `buildSkyTimeline` share one calculation generator. The module worker exposes one active, cancellable job with a bounded `jobId`; progress/result/error/cancelled messages retain that identity. A new generation in the UI must ignore results from an old job and may terminate its worker immediately.

The default window is the selected center **minus five calendar years through plus five calendar years**, computed at runtime. A February 29 anniversary clamps to February 28 in non-leap years. A centered window is explicitly clipped to 1900–2100; an explicitly supplied out-of-range endpoint is rejected. There are no hardcoded current planetary positions or year-specific timeline tables.

Supply either `stepDays` or `stepHours`, always numeric. Defaults are 14 elapsed days and all ten bodies. The UTC sample grid includes both endpoints; its last interval may be shorter. Local labels use the selected IANA zone, so a fixed UTC step may change its displayed local clock across DST. This is intentionally different from a local-noon calendar search.

- Maximum span: 3,660 elapsed days.
- Minimum step: one hour; maximum 8,760 hours.
- Async/UI maximum: 4,096 samples. Default synchronous/MCP maximum: 512 samples; service callers retain their stricter configured cap.
- Maximum solved events: 1,024.
- Hourly views therefore require a smaller range. Daily samples across the default ten-year window fit the UI cap, but do not fit the default synchronous service cap.

Every sample is independently computed. Coarse points are not a continuous trajectory. In particular, 14-day Moon samples alias its path and may omit multiple signs or a whole revolution. The result exposes that warning and reports `continuousTrajectory:false` and `allTransitionsDetected:false`. Zoom to daily/hourly samples for shorter spans. Drawing a line between sparse samples must not imply that intermediate loops or crossings were solved.

A separate event layer uses `Seasons`, `SearchMoonQuarter` and `NextMoonQuarter` to solve the four annual solar-quarter longitudes and the four repeating lunar-quarter phase angles. These are model event instants, not hardcoded table dates, and retain UTC plus observer-zone labels. A lunar phase is not automatically an eclipse. This layer does not exhaustively search planetary ingresses, stations, every aspect, eclipses or historical outcomes. Source/model precision applies even though the serialized timestamp has milliseconds.

## New references and executed checks

The role read selected API sections for [Astronomy Engine](https://github.com/cosinekitty/astronomy/tree/master/source/js), [Horizons output definitions](https://ssd.jpl.nasa.gov/horizons/manual.html), [Agrippa II.31](https://esotericarchives.com/agrippa/agripp2c.htm#chap31), [II.47](https://esotericarchives.com/agrippa/agripp2d.htm), the pinned [HYG field documentation](https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/README.md) and its license. Downloaded documents are not counted as complete readings. Source URL/hash/access receipts are in [the research ledger](evidence/sky/research/source-fetches.json).

Fresh NASA JPL Horizons requests retained their exact query URLs, response hashes and complete response text:

- **13 apparent-angle fixtures**: all ten bodies at 2026-10-30 00:00 UTC, plus Sun at 1900-01-01, Neptune at 2000-01-01 and Pluto at 2100-12-31. Quantity 31 is observer-centered IAU76/80 apparent ecliptic-of-date longitude/latitude, with some model differences from the bundled engine. The largest measured component residual was **0.004756°**; tests use a **1 arcminute** bound. These are selected independent ephemeris checks, not full-range validation.
- **Four heliocentric vector fixtures**: Earth, Mars, Neptune and Pluto, 2026-10-30 00:00 **UT explicitly requested**, geometric `VEC_CORR=NONE`, J2000 ecliptic ICRF, AU. The largest 3D residual was **0.002243 AU** (Neptune). Checks use both a 0.003 AU absolute vector bound and 1 arcminute directional bound. The AU bound is a selected-fixture regression tolerance, not a general accuracy promise.
- **Nine independent-software stellar propagation fixtures**: PyERFA **2.0.1.5**, ERFA/SOFA `pmsafe`, Arcturus/Sirius/Polaris at 1900, 2050 and 2100. Independent spherical inputs use HYG RA/Dec, μα cos δ divided by cos δ, parallax and radial velocity; the application uses HYG's Cartesian position/velocity fields. The maximum directional difference was **0.557 arcsec**. Tests allow 1 arcsec for the selected catalogue precision/model difference. This tests propagation conventions and pole-near/high-motion cases; **it is the same source catalogue and is not independent observational validation**. The comparison uses the same target TT epochs to avoid confusing propagation differences with ΔT.

The fixtures are under `scripts/tests/fixtures/sky-*.json`; the seventeen raw Horizons responses are retained under `docs/evidence/sky/research/`. PyERFA was used only to generate development references in `/tmp/sky-erfa`; no Python or astronomy package dependency was added to the website or required tests.

`node scripts/tests/sky-dynamics.mjs` passed **116 checks** in the first implementation round. They include seven-body canonical parity, the references above, frames/units, source IDs, stellar separation, equivalent UTC offsets, polar horizon, unknown-time rejection, DST sample labels, leap-day windows, both range ends, strict numeric types, oversized-request rejection, async/sync parity, source-free deterministic outputs and actual worker busy/cancel/recovery behaviour.

One observed Node 24 daily ten-year calculation returned 3,653 samples, 534 quarter events and 36,530 body positions in approximately 615 ms with 530 progress checkpoints and a 7.24 MB JSON result. The default 14-day timeline returned 262 samples, 534 events and about 702 KB. These are local observations, not browser performance guarantees. The UI/worker path and visual projection require their separate browser review; this core report does not claim that review happened.


## First-round integration cross-review

The astronomy role inspected the first assembled `sky-explorer.js` implementation as code, without claiming browser observation. Its orbital projection uses the physical J2000 xyz vectors, explicitly labels linear versus square-root distance scales and symbolic body sizes, and excludes stellar directions from orbital space. Three presentation corrections were sent to the UI owner: distinguish the geometric catalogue star frame from apparent geocentric planets in wheel captions/metadata and the inspector; display the actual uniform 3° aspect orb and distinguish it from Lilly moieties; replace “Exact phase events” with calculated/numerically solved language. These are first-round integration findings, not a claim that a second formal panel round had already begun.

Additional integration checks exercised cancellation during sample, solar-event and lunar-event phases, worker-wide shutdown, and event caps of 1, 4 and 10. Every cap returned an explicit error rather than silently truncating. Cancelled operations emitted no result and cleared their active worker token. The retained JPL vector response headers were rechecked: `TIME_TYPE=UT` actually produced UT-labelled timestamps, geometric Cartesian states, AU-D units and the J2000 ecliptic frame. This avoids comparing TDB-labelled midnight as though it were UTC.
