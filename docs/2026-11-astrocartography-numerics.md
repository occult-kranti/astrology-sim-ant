# Astrocartography numerical review

The world-map geometry passed an independent check against 50 Skyfield/JPL coordinate records and elementary spherical calculations. The check establishes agreement within the stated conventions and sampled dates. It does not validate astrological predictions, destination recommendations or the application's editorial purpose scores.

The executable gate is [astrocartography-independent.mjs](../scripts/tests/astrocartography-independent.mjs); its independent values and source receipts are in [independent-fixtures.json](../research/astrocartography/independent-fixtures.json). It performs 11,304 assertions, many of which check individual displayed points. Those assertions are not 11,304 independent astronomical observations.

## External ephemeris reference

The reference uses **Skyfield 1.54**, **jplephem 2.23** and NASA/JPL's **DE440s** kernel. The downloaded SPK file contains 32,726,016 bytes and has SHA256 `c1c7feeab882263fc493a9d5a5b2ddd71b54826cdf65d8d17a76126b260a49f2`. The kernel spans 1849-12-25 through 2150-01-21; only the following five instants were sampled. All ten displayed bodies were compared at each instant, including the Sun, Moon and outer planets.

| ISO date label | Reference GAST, degrees | Largest observed RA/declination coordinate difference |
| --- | ---: | ---: |
| 1900-01-01 12:00 | 280.681142906604 | 6.9603 arcsec |
| 2000-01-01 12:00 | 280.457072362012 | 9.6308 arcsec |
| 2024-04-08 18:00 | 107.483934073252 | 13.1437 arcsec |
| 2030-12-21 15:00 | 315.230808653762 | 19.6706 arcsec |
| 2099-12-31 00:00 | 99.753352216692 | 15.1007 arcsec |

The largest observed differences across all records were **14.9354 arcsec in right ascension**, **19.6706 arcsec in declination**, **0.10012 arcsec in GAST** and **14.9429 arcsec in MC longitude**. The declared test tolerances are 60 arcsec for each equatorial coordinate, 1 arcsec for GAST and 61 arcsec for MC longitude. The coordinate tolerance follows the bundled Astronomy Engine's approximate one-arcminute design target; it is not a claim that every location, date or crossing has a bounded ground-position error.

The Skyfield operation was:

```python
reference = earth.at(t).observe(target).apparent()
ra, dec, distance = reference.radec(epoch='date')
```

This uses geocentric apparent coordinates referred to the true equator and equinox of date. Skyfield applies light travel time, aberration and gravitational deflection. DE440s supplies body centers for the Sun, Moon, Mercury and Venus; the available system barycenters were used for Mars through Pluto. Those target identities remain explicit in every fixture. The comparison therefore retains small model/correction/center differences rather than describing both implementations as identical ephemerides.

The application uses `GeoVector(body, time, true)`, followed by `Rotation_EQJ_EQD` and `EquatorFromVector`. The actual bundled implementation handles the Moon through a direct `GeoMoon` shortcut, bypassing the other bodies' backdating/aberration path. That exception is disclosed in the product and fixtures. A blanket statement that all bodies follow the same apparent-position pipeline would be inaccurate.

## Time and frame matching

The differential test deliberately matches **both numerical UT1 and TT**. Astronomy Engine takes the numeric civil-UTC date as a universal-time proxy and estimates TT using its internal Espenak/Meeus Delta-T model. For each fixture, the independently generated Skyfield time is constructed with that declared Delta-T and UT1 value:

```python
ts = load.timescale(delta_t=fixture_delta_t_seconds, builtin=True)
t = ts.ut1_jd(fixture_julian_ut1)
```

This arrangement isolates the ephemeris and coordinate-frame comparison. It does not turn the engine's time approximation into an Earth-orientation measurement. In particular:

- At the 2024 eclipse-era sample, the engine's Delta-T is approximately 74.008 seconds; the contemporary UTC-to-TT offset is 69.184 seconds. UT1 and UTC are also distinct. The Moon is especially sensitive to a time mismatch.
- Before the modern UTC standard, a software string ending in `Z` is a retrospective convention. The 1900 fixture is an explicit numerical UT/TT comparison, not a reconstructed historical UTC observation.
- Future leap seconds and Earth rotation are unknown. The alternate Skyfield civil-UTC diagnostics retained in the fixture are not a truth table for 2099. No supplied DUT1, polar-motion or Earth-orientation-parameter solution is used in the application.

Right ascension must use the same of-date equinox as GAST. Mixing J2000 RA with of-date GAST, or substituting GMST without matching the frame, moves the meridians. The five widely separated epochs help detect that class of mistake. A tropical/sidereal zodiac-label choice is separate from these physical equatorial directions and does not move a fixed-instant world line.

## Independent geometric derivation

Let east-positive longitude be λ, latitude φ, right ascension α, declination δ and Greenwich apparent sidereal angle θ. The local hour angle is

`H = θ + λ − α`.

The spherical altitude equation, also given by NOAA as a cosine-of-zenith relation, is

`sin(h) = sin(φ) sin(δ) + cos(φ) cos(δ) cos(H)`.

Upper meridian transit is `H = 0`, giving `λ_MC = α − θ`; lower transit is `H = 180°`, giving the opposite IC half-meridian. MC means upper transit, not overhead at every latitude. For example, a declination of 20° at latitude 45° culminates at altitude 65°. Upper transit can remain below the horizon at sufficiently opposite polar latitudes.

A geocentric center-horizon line has `h = 0`. Away from poles and tangencies, the altitude time derivative has the sign of `−sin(H)`: the negative-hour-angle branch rises and the positive branch sets. ASC and DSC are therefore distinct half-arcs, not interchangeable copies of their supporting great circle. This is spherical geometric center angularity. Observed sunrise/moonrise also involves refraction, limb radius, topocentric parallax, terrain and local conditions. NOAA's usual sunrise zenith of 90.833° illustrates why its physical sunrise convention is different from the map's 90° geometric center horizon.

For distance verification, the test does not reuse the engine's vector projection. It independently solves the scalar horizon equation for latitude as a function of hour angle, uses the haversine central angle, and minimizes over the selected half-arc with a sampled bracket and golden-section refinement. Meridians are independently parameterized by latitude. Across 192 selected place/line combinations, the maximum disagreement was approximately `6.11×10⁻¹³` degrees, well inside the `10⁻⁶`-degree algorithmic tolerance. This is agreement between spherical algorithms; it is not a claim of submillimeter astronomical or geographic accuracy.

The map uses a mean-radius sphere of **6371.0088 km**. WGS84's semi-major axis and flattening imply `(2a+b)/3 = 6371.008771415… km`; rounding that radius does not convert a spherical distance into an ellipsoidal geodesic. Supplied geographic latitudes are treated as coordinates on the sphere. Surveying, terrain and ellipsoidal-distance accuracy are outside this calculation.

## Singularities and rendering checks

The independent suite checks the following specific cases:

- With RA = GAST = declination = 0°, the meridians are MC 0°, IC 180°, ASC −90° and DSC +90°. A point on the opposite branch is 90° from the selected closed half-arc via its endpoint; treating the full great circle as the line would incorrectly return zero.
- At declination +30° and latitude +45°, the rising/setting hour angles are approximately ±125.264389683°. Finite changes in sidereal time confirm the altitude-slope sign independently.
- At latitude +70° the same body is circumpolar above the horizon. At latitude +60° and hour angle 180°, altitude only touches zero and has the same sign on either side. The closure is a grazing boundary, not an ordinary rising/setting crossing.
- Celestial declination ±90° makes RA-defined angular orientation degenerate. The implementation now omits all four angular lines for that synthetic case and supplies a warning.
- Geographic poles have no unique longitude or ordinary meridian/rising sense. Their shared closures do not become ordinary isolated crossings. Distances to closed arc endpoints remain mathematically defined.
- Coincident or numerically near-parallel supporting planes are reported as unresolved, with no invented crossing point. Near-parallel crossings above the numerical threshold satisfy both independent altitude equations, but their location can be highly sensitive to small input errors.
- Antipodal supporting-circle intersections are filtered by the selected half-arcs. Tests cover a valid MC/ASC intersection, its IC/DSC antipode and a pair whose supporting-circle point is outside the selected branch.
- Every rendered point is checked against the independent altitude or meridian equation. MC/IC retain their limiting meridian through both map edges; zero-declination ASC/DSC retain their ±90° limiting meridians at geographic-pole closures. No within-segment longitude jump exceeds 180°.
- A synthetic setting line crosses the date line at latitude `atan(1.5) = 56.309932474…°`. Its paired ±180° seam endpoints are tested against that independent value, preventing a spurious horizontal or diagonal wrap segment.

The review challenged two singularity behaviors before the final test: arbitrary MC/IC lines at a synthetic celestial pole, and a status that described numerically near-parallel circles as exactly coincident. The engine agent corrected both. No engine or UI code was edited by this numerical-review lane.

Angular world lines use the body's actual equatorial direction. Existing chart house assignment uses ecliptic-longitude projections onto cusps. A body with nonzero ecliptic latitude can cross its astronomical meridian without its projected zodiac longitude being exactly equal to the zodiacal MC cusp. Both coordinate conventions should remain visible when inspecting a relocated chart.

## Reproduce

The normal repository test needs only Node and the committed independent fixture:

```bash
ASTROCARTOGRAPHY_NUMERICS_OUTPUT=/tmp/astrocartography-numerics.json \
  node scripts/tests/astrocartography-independent.mjs
```

To regenerate external positions, create an isolated Python environment, install `skyfield==1.54` and `jplephem==2.23`, and download the [DE440s kernel](https://ssd.jpl.nasa.gov/ftp/eph/planets/bsp/de440s.bsp). Verify its size and SHA256 above. Load it with `load_file`, use each fixture's declared UT1/Delta-T values, and run the operations shown in the reference/time sections. No network, Python package or SPK download is performed by the committed test. An attempted Swiss Ephemeris installation could not build because the environment lacked its configured compiler; Swiss Ephemeris supplied none of the expected values and is not counted as a second reference implementation.

Primary method references:

- [Skyfield positions](https://rhodesmill.org/skyfield/positions.html): astrometric/apparent corrections and of-date coordinate options.
- [Skyfield time scales](https://rhodesmill.org/skyfield/time.html): UTC, UT1, TT and leap-second distinctions.
- [JPL planetary ephemerides](https://ssd.jpl.nasa.gov/planets/eph_export.html): DE440/DE441 method and coverage.
- [JPL Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html): apparent true-equator/equinox-of-date and separate refraction conventions.
- [NOAA solar calculation details](https://gml.noaa.gov/grad/solcalc/solareqns.PDF): east-positive longitude, hour angle, zenith equation and physical sunrise convention.
- [GeographicLib constants](https://geographiclib.sourceforge.io/html/python/code.html#geographiclib.constants.Constants): WGS84 axis/flattening values.

The fixture records retrieved-source hashes and the limited passages read. These are numerical-method references, not endorsements of astrocartography's interpretive claims.
