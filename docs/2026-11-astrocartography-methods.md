# Astrocartography workbench: geometry, data and interpretive scope

Updated 4 November 2026. The workbench maps where a selected astronomical body is on a geometric horizon or meridian at one explicit UTC instant. Its geographic calculations, historical or modern interpretive vocabulary, and project-authored comparison weights are separate layers. A matching calculation does not establish predictive validity or determine where someone should live.

The source ledger is [research/astrocartography/source-ledger.json](../research/astrocartography/source-ledger.json). Public data and interpretive notes are in [astrocartography-data.js](../assets/js/core/data/astrocartography-data.js). The offline map contains actual Natural Earth geography. No online geocoder, map tiles, personal profile upload or model service is needed to calculate or display these data.

## One instant and two different questions

A world angular map asks where the selected body is rising, setting or crossing an upper/lower meridian at that instant. The birthplace is needed to resolve a stated local birth clock and to identify the original location, but it does not independently change a global map after the UTC instant is fixed. A different actual birth time does change the map. A relocated chart retains that instant and planetary sky positions while recomputing the local angles and houses at another location.

Selecting a civil calendar or a tropical/sidereal zodiac label does not change the physical planetary direction. Sidereal offsets describe another longitude convention; they must not be applied as an arbitrary rotation of the actual sky vector. The present modern Western angular-map vocabulary is not an ancient Maya, Egyptian, Dee, Chinese, Hebrew or Vedic relocation system. Those calendar and textual frameworks may be compared separately with their own rules and limits. House-system changes affect a relocated horoscope, not the geographic horizon/meridian loci defined below.

A precise IANA time zone is required when converting a local clock. A repeated daylight-saving clock needs explicit earlier/later disambiguation, and a nonexistent local clock must be rejected. The city catalogue supplies a time-zone identifier, not a guaranteed historical birth record. Date-only or uncertain times do not justify inventing a precise angular map.

## Geometry and coordinate conventions

The canonical engine uses geocentric body-centre directions. Astronomy Engine’s `GeoVector` returns a geocentric J2000 equatorial vector. Its non-lunar branch backdates positions for light travel and optionally corrects aberration; the bundled implementation has a separate Moon branch returning `GeoMoon` directly. The documentation’s generic light-time statement must not be assumed to describe that lunar branch identically. `Rotation_EQJ_EQD` rotates the vector to the true equator of date. Its Greenwich apparent sidereal time must be paired with that frame. `Equator` is a different, topocentric API that applies observer parallax, so substituting it without changing the model would silently change the question. NASA/JPL Horizons independently distinguishes true-equator/equinox-of-date apparent directions and airless versus refraction-adjusted products.

Let latitude be φ, east-positive longitude λ, declination δ, right ascension α and Greenwich apparent sidereal angle θ. All angles must use compatible units and frames. Local hour angle is

`H = θ + λ − α`, wrapped consistently.

The spherical altitude relationship is

`sin(h) = sin(φ) sin(δ) + cos(φ) cos(δ) cos(H)`.

NOAA’s published solar-zenith equation has the same trigonometric geometry, with altitude the complement of zenith distance. The workbench sets the body centre at **h = 0°**, with no atmospheric refraction, solar/lunar limb radius, terrain or topocentric parallax. NOAA’s separate visible-sunrise approximation uses **zenith 90.833°**, combining refraction and the solar disc; that value is not used for these geometric lines. NOAA also expresses its sunrise solution with its own hour-angle sign arrangement; signs must be checked within the chosen convention rather than copied in isolation.

For ordinary nondegenerate directions, `cos(H) = −tan(φ) tan(δ)` describes the horizon. A real solution requires the corresponding geometric domain. In the east-positive hour-angle convention, the eastern/rising branch has negative H and the western/setting branch positive H. At a tangency the rising/setting distinction degenerates. Circumpolar or never-rising geometry must not be replaced by a fabricated horizon event.

The upper-meridian locus has `H = 0`, so `λ = α − θ`; the lower-meridian locus has `H = 180°`. A body on the MC line is **not generally overhead**: zenith also requires latitude equal to its declination. Similarly, the lower-meridian passage is not necessarily below the horizon for every latitude. Geographic poles require special treatment because ordinary longitude and meridian orientation become degenerate.

In Earth-fixed vectors, a body direction **b** and location direction **p** give the horizon plane `p · b = 0`. The rising and setting branches are closed semicircles distinguished by their east/west orientation. MC and IC likewise occupy opposite halves of a meridian great circle. The engine retains these branch constraints: distance to a complete, unbounded great circle would wrongly identify the opposite branch as nearby.

A planet exactly on a physical horizon can have a different ecliptic longitude from the relocated ecliptic Ascendant, because the planet can have nonzero ecliptic latitude. A physical rising-body line and an aspect to a chart’s zodiacal Ascendant are therefore distinct techniques. This map does not silently replace one with the other.

## Distance, radius and time sensitivity

Distances use a sphere with radius **6,371.0088 km**. This is the rounded WGS84-derived arithmetic mean `(2a + b)/3`, with `a = 6,378,137 m`, flattening `f = 1/298.257223563`, and `b = a(1−f)`. GeographicLib supplies the WGS84 constants; GeoPy explicitly gives the IUGG mean-radius convention and approximately 6,371.0087714150598 km. It is **not an IAU nominal radius**. This correction is recorded in the ledger.

For a selected closed arc, the geographic distance is the minimum spherical angular separation from the location to a valid point on that arc, multiplied by the radius. The closest great-circle projection must satisfy the semicircle constraint; otherwise an endpoint can be the closest valid point. The calculation is analytic in the engine and does not estimate distance from the coarseness of the drawn polyline. These are spherical surface distances with supplied geographic latitude treated as spherical latitude, not ellipsoidal geodesics or terrain measurements.

The map’s 1:110 million coastline, gazetteer city points, approximate astronomical model, Earth-orientation treatment and uncertainty in the entered clock all limit meaningful precision. Rounded kilometre displays are appropriate; extra decimal places would not make the input or model more accurate. One minute of Earth rotation corresponds approximately to a quarter degree of longitude, or roughly 28 km along the equator. This is an illustration of clock sensitivity, not an exact error bar for every body and latitude or a measured range of influence. Planetary motion and the actual time/frame conversion remain part of a full recalculation.

The default 500 km comparison radius and supported 1–3,000 km controls are interface choices. They are not a historically unanimous orb or an empirically calibrated physical influence range. Jim Lewis’s selected practitioner text gives approximate mile/degree orb statements that should not be treated as spherical-distance identities: its 700-mile/8-degree and 450-mile/5-degree pairings do not match the WGS84-derived great-circle arithmetic. No such statement is used to calibrate the workbench’s kernel.

## Offline geography and gazetteer

**Land:** Natural Earth `ne_110m_land.geojson`, release `v5.1.2`, commit `f1890d9f152c896d250a77557a5751a93d494776`. The tag and commit downloads were independently fetched and have the same SHA-256, `9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`. The official repository `LICENSE.md` declares the dataset public domain and permits modification and redistribution. The website terms URL returned HTTP 406; the repository licence was actually read instead.

The asset is [astrocartography-land.json](../assets/data/astrocartography-land.json): a GeoJSON FeatureCollection with 127 land polygons and 5,144 vertices, approximately 133 kB. No additional geometric simplification or coordinate rounding was performed. One `[0, −90]` vertex was inserted between the Antarctic closing edge’s `[180, −90]` and `[−180, −90]` endpoints. All three coordinates identify the same geographic pole; the intermediate point lets a flat map close along its bottom boundary without a single 360° longitude jump. Other upstream geometry is retained. Ring closure, finite bounds, minimum ring size and adjacent-longitude differences of at most 180° were checked. No full independent topology certification is claimed. Credit: **Made with Natural Earth.**

**Cities:** a curated 40-row subset of GeoNames `cities15000.zip`, retrieved 4 November 2026; the server’s Last-Modified value is 4 November 2026 at 02:47:55 GMT. Dataset SHA-256: `1d7cf2e7b0920b5203a5c0f2b3825e5e5d6e721e3802593cb51b438877796847`. Coordinates, GeoNames IDs, row modification dates and IANA zone IDs are preserved. Display names, human country labels and selection are project editorial choices. The list includes Binghamton, Indore, Mumbai and Greenwich and is not a comprehensive worldwide location search. All 40 zone IDs were accepted by the runtime’s `Intl.DateTimeFormat` during validation.

| Selected place | GeoNames ID | Latitude | Longitude | IANA zone |
|---|---:|---:|---:|---|
| Binghamton |5109177|42.09869|−75.91797|America/New_York|
| Indore |1269743|22.71792|75.8333|Asia/Kolkata|
| Mumbai |1275339|19.07283|72.88261|Asia/Kolkata|
| Greenwich |2647937|51.47785|−0.01176|Europe/London|

Greenwich here is the GeoNames locality point, not an assertion that the Royal Observatory or prime meridian is at the exact same coordinates. Users can enter another explicit location. City data attribution: **GeoNames, CC BY 4.0**, [geonames.org](https://www.geonames.org/), [licence](https://creativecommons.org/licenses/by/4.0/). Only the selected public rows are redistributed; no private address or birth profile is included.

## Interpreting a line without turning it into a forecast

Jim Lewis’s 1994 principles and Maya White’s 2006 angle discussion supply the named modern interpretive context: ASC/presentation, DSC/relationship, MC/public role and IC/private roots. Erin Sullivan’s selected 2000 excerpt distinguishes the broad angular map from a more detailed relocated chart and discusses practical considerations of moving. These are practitioner sources, not independent evidence that a map predicts outcomes. Claims of guaranteed accuracy, medical effects, supernatural events and geopolitical destiny in those sources are not adopted.

The seven traditional bodies use original neutral thematic prompts informed by selected planetary passages in Lilly’s *Christian Astrology*, Book I. Uranus, Neptune and Pluto use clearly modern vocabulary from the named reference pages. Lilly did not provide those outer-planet rules or this geographic ranking. “Planet” here is astrological shorthand: the selected astronomical bodies include the Sun, Moon and Pluto.

The displayed questions and actions are **project-authored conditional exercises**, not quoted historical prescriptions. For example, Mercury/MC can prompt someone to investigate an actual learning or communication opportunity; it does not predict that an employer will hire them. Moon/IC can prompt a comparison of housing, routine and support; it does not establish that a city will feel like home. Saturn can prompt a sustainable commitment rather than a fear-based warning. A location with no nearby lines is not a bad or empty location.

## Transparent editorial scoring

The six purposes are `overview`, `career`, `relationships`, `home`, `study` and `structure`. Their signed planet weights lie between −2 and 2 and their angle weights between 0 and 1. Every weight is visible in the data and available to the inspector. These numbers are authored design choices, not a historical table, fitted model, successful-outcome frequency or clinical/safety measure.

For a selected purpose and comparison radius `r`, let each body/angle distance be `d`, proximity `p = max(0, 1 − d/r)`, signed planet weight `w`, and nonnegative angle weight `a`.

1. For each selected body, choose the angle maximizing `a × p`. A zero-weight nearby angle must not suppress a more relevant weighted angle. Ties use distance, then stable line ID.
2. The body contribution is `w × a × p` for that angle. A body contributes once, so multiple angular lines do not count it repeatedly.
3. Divide the sum by the fixed sum of absolute planet weights for all selected bodies and multiply by 100. Distant or missing influence does not shrink the denominator and inflate a score.
4. Report per-body contributions, radius and selected purpose with the result. The separate unweighted proximity score describes closeness, not thematic fit.

Positive and negative values mean only fit or friction within this chosen symbolic rubric. Selecting fewer bodies changes the denominator and the question being asked; scores from different selections are not automatically comparable. The place list ranks the selected 40-reference-city subset, not every place on Earth. Pole degeneracies receive no favorable-location judgment. A higher score is not a better city, a probability, a causal effect or a recommendation to relocate. Cost, legal access, actual opportunities, health needs, relationships and the person’s own preferences remain separate practical evidence.

Geometric line intersections are intersections at the chosen instant. They are not a separately validated all-day paran catalogue, guaranteed “power spots” or an event forecast. No scores from different religions/calendars are blended into an apparently scientific confidence measure.

## Verification and remaining limits

The source pass fetched and read the specific listed passages, verified two maintained references for the mean-radius arithmetic, and compared NOAA’s horizon equation with Astronomy Engine and NASA/JPL coordinate definitions. It recorded unsuccessful or irrelevant responses: the AstroClick introduction returned a JavaScript browser-check page, the Natural Earth terms endpoint returned 406, and an attempted Uranus product page returned 404. No success is inferred from those responses.

The land and 40-city structural checks are recorded in the source ledger. The engine and independent QA lanes test angular geometry, branch selection, crossings, distance and time-zone cases separately. Passing those tests establishes bounded implementation behavior; it does not establish predictive validity. The present model omits observer parallax, atmospheric refraction, actual terrain horizons, precise survey geography, a complete historical time-zone atlas, rectification of uncertain birth clocks and universal cultural interpretation. No complete books were read or redistributed in this pass.
