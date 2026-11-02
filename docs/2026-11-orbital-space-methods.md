# Orbital Space: frames, events, color and source interpretation

This update extends the Calendar Atlas's **Orbital space** view. The calculation contract is `assets/js/core/orbital-events.js`; the display is `assets/js/app/orbital-space.js`. Existing apparent-position, house, dignity, Vedic and civil-calendar engines remain the calculation authorities for their own outputs. The view is a static local instrument, not a streamed ephemeris or remote AI service.

## Compare origins before comparing readings

| View or measurement | Definition | Interpretation boundary |
| --- | --- | --- |
| Earth-view | Earth-center apparent vectors to other supported bodies, rotated from J2000 equatorial into true ecliptic/equinox of date | Earth is the origin and has no direction from itself. These are geocentric directions, not a selected observer's topocentric visibility. |
| Sun-centered view | Simultaneous geometric heliocentric vectors in J2000 mean ecliptic axes, in AU | Earth can be compared with another planet. No light-time or aberration correction is applied. This angle is not silently substituted for a traditional geocentric aspect. |
| True 3D separation | Angle between the two full vectors, in degrees | Includes latitude. A visually close pair need not be an exact longitude conjunction. |
| Longitude separation | Shortest circular difference of the two ecliptic longitudes | Omits latitude. A longitude conjunction alone does not imply an occultation, eclipse or exact physical collinearity. |
| Sun–Earth–target triangle | Angles and distances between simultaneous geometric heliocentric vertices | Useful for Earth-inclusive comparisons. It uses a different light-time convention from apparent Earth-view directions. |
| Camera, turn and tilt | Projection of the selected coordinates onto the screen | An apparent straight line in the projection is not evidence of a true alignment. |
| Compressed distances and marker sizes | Display aids | The numeric AU values and vector angles retain their physical calculation; symbols and compressed drawing lengths are not physical sizes or distances. |

The underlying `HelioVector`, `GeoVector`, `Rotation_EQJ_ECT`, `Rotation_EQJ_ECL`, `SphereFromVector` and angular definitions are the existing vendored Astronomy Engine APIs. In particular, **`EclipticLongitude` is a heliocentric routine**; its name must not be treated as a generic geocentric longitude function. Geographic observer coordinates do not change a geocentric direction. A selected IANA zone changes the event's civil label, not its UTC instant.

A nearest major longitude aspect uses the explicitly displayed uniform orb. This is an interface geometry classification, distinct from Lilly's planet-specific moieties and Jyotiṣa drishti. Civil-calendar labels keep their conventions and boundaries; they are not assigned invented orbital angles.

## Bounded event inventory

The orbital search accepts an explicit supported pair and origin, inclusive UTC start, and exclusive UTC end. The engine supports UTC years 1900–2100, at most **366 elapsed days** per request, and at most **512 returned events**. The inventory records its actual request, methods, frame, sources and coverage limits. A completed inventory means that the requested algorithm finished, not that every astronomical phenomenon was discovered.

- Pair contacts search conjunction, sextile, square, trine and opposition in the **selected origin's longitude frame**. Six-hour brackets are anchored to an absolute UTC grid and a sign crossing is refined by bisection to a one-second bracket. The reported true 3D separation is a separate measurement. Tangencies or two crossings within one bracket can be missed; true-sky closest-approach minima are not solved.
- Lunar quarters use `SearchMoonQuarter` and `NextMoonQuarter`; the native Moon-phase convention is retained explicitly. New/full Moon bookmarks are not relabelled as eclipses.
- Equinoxes and solstices use `Seasons`. The longitude targets are global astronomical instants; seasonal names depend on hemisphere.
- Solar eclipses use `SearchGlobalSolarEclipse` and its next-event API. Lunar eclipses use `SearchLunarEclipse` and its next-event API. The recorded timestamp is the model's **global peak**, not a local contact time.
- Searches expose progress and cancellation. Callers must discard superseded results and preserve an explicit stale state when the atlas moment changes.

Serialized milliseconds or a one-second numerical bracket do not establish equivalent physical accuracy. The inherited engine and UTC-as-UT1 approximation apply. The new event inventory does not implement every planetary ingress, station, occultation, solar-disc transit or possible alignment.

## Eclipse geometry and local visibility

NASA's selected eclipse explanation states that a solar eclipse occurs when the Moon passes between the Sun and Earth, casting a shadow over parts of Earth. A lunar eclipse occurs around full Moon when Earth is between the Sun and Moon and Earth's shadow reaches the Moon. The Moon's inclined orbit prevents every new or full Moon from producing an eclipse.

NASA describes total, annular, partial and hybrid solar appearances. The selected Astronomy Engine global API returns its supported `partial`, `annular` or `total` label and does not separately classify hybrid events. A global solar type describes the event's maximum somewhere on Earth; it does not mean that every location experiences that type. A lunar eclipse's global peak likewise does not establish that the Moon is above a chosen observer's horizon.

Local visibility, local solar obscuration, local maximum/contact times, atmospheric conditions and weather are unavailable in this orbital event layer. They must not be inferred from a global bookmark or from the projected orbit drawing. The separate upstream local solar API would require a deliberately implemented observer workflow and its own tests before such claims can be displayed.

## Color roles and historical readings

Color is assigned by information role and accompanied by text, icons, line patterns or selected-state outlines. Astronomical events and historical testimonies use different semantic channels:

| Information role | Intended cue | Meaning |
| --- | --- | --- |
| Selected origin / sightline | Cyan plus an origin label and line | Geometry reference |
| Pair contact | Named aspect and angle, with connector or marker | Selected frame's longitude event |
| Eclipse | Distinct eclipse symbol and explicit global/type text | Shadow geometry; no automatic danger verdict |
| Lunar quarter | Phase icon and phase name | Calculated lunar angle |
| Equinox / solstice | Solar-quarter symbol and named target | Calculated solar-quarter event |
| Favorable testimony | Favorable label and supporting rule/source | The named historical rule at the sampled moment |
| Caution testimony | Caution label and supporting rule/source | The named historical rule at the sampled moment |
| Mixed / unresolved | Explicit mixed, missing or unresolved text | No invented aggregate verdict |

The existing Lilly, Agrippa and Jyotiṣa lenses remain separate. Their readings retain actual measured inputs, thresholds, source locators, reading depth and unresolved conditions. Agrippa II.29's multi-condition checklist is not a universal numerical alignment score. A heliocentric contact cannot inherit a geocentric aspect judgment by sharing its name. Calendar conversions, lunar phase and tithi often reuse the same astronomy; their agreement is not independent confirmation of a personal outcome.

The interface may say that a source rule is favorable or cautionary. These categories are historical testimonies, not probabilities, hazard forecasts or a classification of a person or religion. No eclipse is automatically labeled a bad day.

## Offline source retrieval and chatbot context

The existing local retrieval corpus is extended rather than replaced:

- `assets/js/core/data/sky-reading-sources.js` gains two source records: `SKY-ORBITAL-ENGINE` and `SKY-NASA-ECLIPSES`.
- Four original paraphrase chunks cover origin/frame distinctions, true separation versus longitude, eclipse geometry, and the separation of orbital events from named favorable/caution testimonies.
- `assets/js/core/sky-source-retrieval.js` remains deterministic local lexical retrieval. No embedding model, network request, model training or new database is required.
- `node scripts/build-sky-reference.mjs` regenerates `research/sky-reference/chunks.jsonl` and `manifest.json`. `--check` verifies these artifacts against the authored sources.
- Orbital source queries should include the `astronomy` retrieval lens. Historical interpretation calculators keep their own supported lens IDs; adding a retrieval lens is not adding a new historical-rule engine.

Retrieved notes are reference data, not instructions or numerical ephemerides. An assistant packet should recompute a selected pair and origin through the canonical orbital module and retain exact frame/method metadata. Caller-supplied calculated rows must not be promoted to locally computed facts. Earth at a heliocentric endpoint is not a classical geocentric interpretation planet. The existing preview, observer disclosure and explicit-send rules continue to apply. A copy/open handoff to ChatGPT does not connect the site to this conversation or make remote inference work offline.

## Actual source reading and access record

Selected source sections were inspected on **2 November 2026**. This is not a claim of reading every book, all upstream documentation, a complete NASA catalogue, or community-authority review.

| Source | Actual scope | Retrieved-byte SHA-256 |
| --- | --- | --- |
| [NASA Science, Types of Solar Eclipses](https://science.nasa.gov/eclipses/types/) | Opening geometry; total, annular, partial and hybrid sections; lunar-eclipse section | `3723ee2c525da3c9b809ca772731145f41d2f71caf89615f118d3d248a90f9d0` |
| [Astronomy Engine JavaScript reference](https://github.com/cosinekitty/astronomy/tree/master/source/js) | Selected vector, ecliptic and global/local eclipse API sections, compared with vendored functions | `e49cf79d108df343e37747be8cf187e379c1709deeb2ff94ffa3dcb7e1b315de` for the retrieved upstream README |
| [Agrippa II.29](https://esotericarchives.com/agrippa/agripp2c.htm#chap29) | Reused previously checked selected chapter and its recorded edition/limits | Existing `SKY-AGRIPPA-29` record; not a new full-book reading |

A separate attempted `https://science.nasa.gov/moon/lunar-eclipses/` request returned HTTP 404. No claim relies on that unavailable URL; the successful NASA types page includes the selected lunar geometry description. Research response bytes and access receipts remain outside the application under `/workspace/setup-validation/orbital-sources/`; no downloaded NASA page, image or modern book is redistributed in the RAG corpus.

New corpus prose is original and short. Astronomy Engine software/documentation is MIT-licensed; underlying author/book rights remain attached to existing source records. Retrieval is not an expanded training licence.

## Executed source/retrieval checks

At the authored-source candidate, the generated reference pack contained **17 chunks and 14 source records**. `node scripts/build-sky-reference.mjs --check` passed. The actual query “How does Earth-view orbital alignment differ from heliocentric separation and eclipse visibility?” returned the new separation, frame and eclipse chunks in its first three results.

`node scripts/tests/sky-assistant.mjs` passed **17 checks**, including all six existing authored retrieval regression queries retaining their expected top-three note. `node scripts/tests/sky-interpretation.mjs` passed **61 checks**. These checks establish source/packet and calculation consistency; visual review, orbital numerical tests, browser lifecycle tests and deployment evidence belong to their separate verification records. No live AI inference, physical-device, screen-reader or predictive-validity study is claimed by this source review.

### Focused 8 April 2024 eclipse reference

A separate direct NASA catalogue check supports the focused numerical/browser fixture. [NASA's 2001–2100 solar catalogue](https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html), row **09561**, lists **2024 Apr 08, TD 18:18:29, ΔT 74 seconds, type T (total)**. The actual column headings were read. [NASA's delta-T explanation](https://eclipse.gsfc.nasa.gov/SEcat5/deltat.html) defines **ΔT = TD − UT**. Subtracting the row's rounded 74 seconds gives an approximate UT comparison instant of **18:17:15 on 8 April 2024**. This is a published-catalogue UT approximation, not an independently verified exact UTC timestamp. A 60-second numerical fixture tolerance accommodates this comparison; it does not establish local visibility.

The retrieved catalogue HTML SHA-256 is `a9c08f5b4b51d5c85ccfa18d8bfccd98ec8a7d93f06e2d40691943b4105acf9e`; the delta-T explanation HTML SHA-256 is `5dbd35cf96eb25034ea9c0ac73b2f3ce9c13c93aef792494768e630d2c603d09`. The actual row, headings, conversion, source URLs and HTTP status are recorded outside the application in `/workspace/setup-validation/orbital-sources/nasa-2024-eclipse-check.json`. This is one selected eclipse fixture; it does not validate every event throughout 1900–2100.
