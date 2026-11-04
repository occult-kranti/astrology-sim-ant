# Astrocartography: independent verification, 4 November 2026

The canonical engine and independent astronomical/geometric suite passed **65,545** and **11,304** checks respectively. A separate QA analytic challenge passed **18** checks. The final frozen browser candidate passed **126 checks**, with zero runtime errors, zero unexpected external requests and no public-source changes during the run.

This review was performed by a separate AI QA agent. It tests source conventions, astronomical coordinates, spherical geometry and application behavior. It does not validate astrological predictions, relocation outcomes, safety ratings, or an entire religious or textual tradition.

## Three review rounds

| Round | Evidence and challenges | Result |
|---|---|---|
| 1: contract | Known clocks, UTC identity, geocentric apparent frame, ascending/descending half-arcs, meridian polarity, singularities, source scope, scoring | Required explicit time-zone resolution, distinct half-arc distances, no invented polar/circumpolar orientations, purpose weights labelled editorial, and an opt-in study context. Calendar frameworks remain separate readings of the same instant. |
| 2: implementation | Source passages, independent elementary geometry, external Skyfield/JPL fixtures, rendered map, native exports and interaction flows | Found compact exports exceeding the 24 KiB limit and a source-rights field mismatch. The engine now uses declared compact scope and normalizes rights. Crossing selection now highlights both member paths. Exact-pole inspectors suppress arbitrary nearest-line interpretation. Revised mobile controls reduce initial page density. A settled-radius blur redundantly recalculated and swallowed the first export click; a committed-value guard fixed that real interaction failure. Retained non-UTC place labels now name the actual zone. |
| 3: frozen acceptance | Final whole-asset hash, focused browser journeys, screenshots and downloads | A first frozen run passed 122 functional checks. Actual screenshot inspection then found a decimal score wrapping across lines; CSS prevents numeric wrapping, and the final gate adds four layout assertions. The corrected frozen run passed **126 checks**, including the four no-wrap assertions. Receipt below. |

An early provisional browser run reported a missing-clock assertion failure because its driver read the error before the calculation's animation-frame yield completed. The driver now waits for the error. That receipt is retained; the race was not evidence that the application fabricated a clock.

## Independent source and mathematical checks

QA separately downloaded and inspected selected passages in NOAA's [solar equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF), the [JPL Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html), and [GeographicLib's constants](https://geographiclib.sourceforge.io/html/python/code.html). The source receipt and raw downloads remain outside Git at `/workspace/artifacts/astrocartography/qa/sources/`. Two unavailable USNO endpoints are recorded as failures, not sources read.

| Source | SHA-256 | Selected relevance |
|---|---|---|
| NOAA solar equations | `7fa1fdb5f6b5c05ab1ec3ffde92e6fb2d5df98bf1a87055075ae2c3c1240a627` | Zenith/hour-angle relation; conventional apparent sunrise uses 90.833°, distinct from the map's geometric 90° horizon. |
| JPL Horizons manual | `be45b0137b37068c48760bbaf306f52a72c10239c175ba91119a30eb30612a81` | True equator/equinox of date, airless versus refracted quantities, Earth orientation/time conventions. |
| GeographicLib documentation | `36dcde8c41b2c955eca290c82e3e2ee8209ae0ef389d3ab3cd873f8763ba3a13` | WGS84 semi-major axis and flattening; independent arithmetic gives `(2a+b)/3 = 6371.008771415… km`. |

The implemented 6371.0088 km sphere is the rounded WGS84-derived arithmetic mean radius. It is neither an IAU nominal-radius convention nor an ellipsoidal geodesic. Apparent geocentric body directions do not include topocentric parallax, local terrain or atmospheric refraction. The method notes also disclose Astronomy Engine's direct Moon vector branch. MC means upper meridian transit, not generally the zenith.

The separate QA analytic worksheet used elementary Python/JavaScript trigonometry rather than calling the engine to generate its expected answers. At RA = GAST = declination = 0, it expects MC 0°, IC 180°, ASC −90°, DSC +90°. A point on DSC at longitude +90° remains 90° (10,007.557 km) from the *ASC half-arc*, despite sharing the complete great circle. At declination 30° and latitude 45°, the independent horizon roots are ±125.26438968°. Latitude 70° has no root; latitude 60° is a grazing boundary. It also checks null orientation at a synthetic celestial pole, non-unique coincident geometry, unchanged line geometry for equivalent UTC inputs/other birthplace/house system/radius, and a one-body 500 km half-radius score of 50 under explicitly unit editorial weights. Receipt: `/workspace/artifacts/astrocartography/qa/round-2-analytic.json`.

The committed [independent numerical suite](../scripts/tests/astrocartography-independent.mjs) uses **50 external body-position fixtures at five epochs** from Skyfield 1.54 with JPL DE440s. Its 11,304 assertions include many rendered-coordinate checks; they are not 11,304 independent astronomical observations. Fixture SHA-256: `5793bde92dc837f79aeddef9632a667492483cc6f065b1998eaa2919e84a34de`.

| Quantity | Largest observed difference | Declared tolerance |
|---|---:|---:|
| Right ascension | 14.9354 arcsec | 60 arcsec |
| Declination | 19.6706 arcsec | 60 arcsec |
| GAST | 0.10012 arcsec | 1 arcsec |
| MC longitude | 14.9428 arcsec | 61 arcsec |

These fixtures match numerical UT/TT between the engines to isolate their frame and ephemeris behavior. They do not establish historical or future civil UTC/Earth-rotation truth. Read the [numerical review](2026-11-astrocartography-numerics.md) for the matching convention and tolerances. Five sampled epochs do not validate every supported date.

The canonical suite additionally passed 252 extreme compact exports, maximum 24,294 UTF-8 bytes. Separate engine-lane stress checks covered 200 further deterministic high-latitude/long-zone/fractional-coordinate cases, reported maximum 24,309 bytes. Those latter 200 cases are reported by the engine lane; QA independently reran the committed 65,545-check suite. Full user-initiated browser downloads intentionally contain more than the compact API context and are not subject to that 24 KiB compact-schema limit.

## Browser verification

Run the committed driver with installed Playwright and a fresh output directory:

```bash
PLAYWRIGHT_PKG=/path/to/playwright/index.mjs \
ASTROCARTOGRAPHY_OUTPUT=/workspace/artifacts/astrocartography/qa/fresh-run \
node scripts/browser-astrocartography.mjs
```

`ASTROCARTOGRAPHY_ALLOW_MUTATIONS=1` marks a run provisional; omit it for acceptance. The driver serves the repository under a non-root URL prefix, hashes all public assets/pages and itself before and after, records runtime errors and external requests, retains native JSON/CSV downloads compressed outside Git, and refuses to overwrite a receipt.

The journeys cover declared public defaults, required clock, spring DST gaps/autumn folds, the skipped Apia date, range rejection and recovery, birth and destination poles, map projection after zoom/pan and near both sides of the dateline, keyboard controls, crossing pair selection, minimum line filters, purpose/radius changes, city search and pagination, session bookmarks, export invalidation, CSV formula safety, inert labels, explicit saved-library load and malformed-library rejection, private-context preview and reviewed tool navigation. The local assistant source search is exercised; no model provider request is sent by this browser gate. All required resources are served locally and service workers are deliberately blocked in this driver. This demonstrates local static operation, not installation or recovery of an offline service-worker cache; release-package smoke checks are separate.

Screenshots are captured at 320, 390, 1440 and 1920 pixels. QA inspected the initial desktop and mobile map screenshots, including geographic outlines, text/shape encodings in the legend, and the absence of whole-document horizontal scrolling. A first frozen 122-check receipt is retained at `/workspace/artifacts/astrocartography/qa/round-3-final/receipt.json`; it predates the decimal-score visual fix and is not the final source version. QA inspected the corrected 1440-pixel crossing inspector and 320-pixel place-result screenshot: decimal scores are intact, their editorial qualification stays adjacent, and the nearest-line distances remain legible. The 390-pixel map and 1920-pixel map screenshots were also inspected. The frozen run captured 19 screenshots and seven explicit downloads. Automated layout checks are not a physical-device or screen-reader certification.


Final environment: Node `v24.19.0`, bundled Chromium `151.0.7922.34`. Final receipt: `/workspace/artifacts/astrocartography/qa/round-3-visual-final/receipt.json`, completed `2026-11-04T21:55:40.136Z`.

| Receipt field | Value |
|---|---|
| Checks / acceptance | 126 / true |
| Runtime errors / unexpected external requests | 0 / 0 |
| Public-source changes during run | 0 |
| Receipt SHA-256 | `de728ae156874709ce6bb94a8592d06175c2ec2d97a80348ca878e81b2e13248` |
| Before and after source-manifest SHA-256 | `4e2b8996fc5c9b94998d67349db2fb53a7dad3ce0623baa548a2c3fd2fc445e2` |

Representative final screenshots, retained outside Git:

- `/workspace/artifacts/astrocartography/qa/round-3-visual-final/map-1440-selected.png`: score37.3 stays on one line, the selected line has a named condition and source-method explanation, and distances remain separate from thematic points.
- `/workspace/artifacts/astrocartography/qa/round-3-visual-final/mobile-320-place-result.png`: score12.8, its qualification, and nearest paths fit the narrow inspector.
- `/workspace/artifacts/astrocartography/qa/round-3-visual-final/mobile-390-map.png`: compact initial controls, accessible zoom and the local land map.
- `/workspace/artifacts/astrocartography/qa/round-3-visual-final/desktop-1920-map.png`: wide chart workspace with moment and location panels.

The earlier expanded provisional run is retained at `/workspace/artifacts/astrocartography/qa/round-2-expanded/receipt.json`. Its real radius/export failure led to the committed-value correction; its public assets changed during concurrent integration, so it never qualified as acceptance. No failed receipt was silently overwritten.

## Remaining limits

- Calendar/source readings share a UTC instant and declared display zone; they are not nine separate astrocartography geometries or a consensus forecast.
- Scores are project-authored thematic comparisons. Their signs, weights and distance radius do not encode outcome probabilities, migration advice, financial performance or safety.
- The map is equirectangular. Pixel distances distort strongly at high latitude; the distance engine uses spherical half-arcs rather than screen lengths.
- Exact poles, grazing boundaries, celestial-pole degeneracy and coincident geometry have explicit limitations. A unique interpretation is withheld where the geometry does not support one.
- No all-browser, assistive-technology, device-hardware or predictive-validity claim follows from these checks. Model semantics and external deployment behavior have separate evidence.
