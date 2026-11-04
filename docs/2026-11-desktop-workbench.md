# Desktop chart studio: use and methods

Open [the studio](../pages/desktop.html). It is a free static browser application built from the existing Workbench modules. Its original design uses professional desktop work patterns documented in the [research](2026-11-desktop-research.md). It is not an implementation of proprietary software or a claim of equivalent numerical precision or feature coverage.

## A chart session

1. Start with the clearly named public Greenwich example, or choose New chart. Enter a known local date/time, IANA time zone and signed latitude/longitude. The separate birth reader supports date-only exploration when the clock is unknown.
2. Choose Single chart, Transits or Synastry, a zodiac, house method and a uniform geometric aspect orb. After changing these settings, choose Calculate. The previous result remains labelled stale until recalculated; exports and time stepping are disabled.
3. In comparison mode, edit B or load a saved chart as B. A is the inner solid ring, B the outer dashed ring. Transits advance B while keeping A fixed. Synastry compares two epochs and does not invent applying/separating motion between natal charts.
4. Select a planet or aspect. The inspector shows exact calculated values, the actual house method, motion and qualified source evidence. Position and house tables provide an alternative to the drawing; aspect-grid cells inspect the same held calculations.
5. Step an hour/day/month/year or use the ±365-day slider. Hours and days are elapsed UTC intervals. Months and years clamp the day in UTC. Local clocks can change across daylight saving. Reset restores the reference profile; editing a profile or choosing Now sets a new reference.
6. Choose Save chart A to persist that profile in this browser. Export library makes a portable collection; Import JSON accepts that library format. Study JSON is a calculated evidence export and intentionally is not a library backup. SVG preserves the actual displayed geometry/selection. Print uses the browser's PDF capability.
7. Use the tool catalogue for returns, progressions, date searches, cultural calendars, orbital geometry, historical/source research, sigils, Jung and other retained features. Each existing specialist page retains its input and source contract. Links open another tab and do not automatically transfer the private chart.

## Calculation boundary

`assets/js/core/desktop-workbench.js` composes the existing chart, sky, house, time, dignity and aspect modules. It supplies ten calculated sky bodies and two mean lunar nodes. The supported local and UTC years are 1900–2100. Geographic poles are rejected; a high-latitude house fallback reports requested and actual methods. Regiomontanus, Placidus, whole-sign and equal houses are available.

Tropical longitudes use the existing apparent geocentric equinox-of-date frame. The optional sidereal display uses the inherited linear Lahiri estimate, not a full Swiss/IAE precession model. Whole-sign sidereal cusps begin at the sidereal rising-sign boundary. A sidereal wheel with Western geometric aspect angles is not a complete Vedic judgment. Selecting tropical classical bodies exposes the inherited Lilly dignity table as historical rule evidence; outer planets and nodes do not acquire invented classical dignities.

Aspect matching uses one explicit 0–10° allowance for conjunction, sextile, square, trine and opposition. This differs from Lilly's planet-specific moieties. Phase labels use short linear motion, not a solved future exact contact. Synastry has no phase judgment. Positions truncate labels to a minute within the calculated sign; raw exported digits are computational precision, not a promise of observational accuracy. Node opposition is a geometric identity and should not be counted as independent evidence of a life outcome.

The wheel fans nearby labels to avoid collisions, while ticks, leaders and aspect endpoints remain attached to their true longitudes. Marker sizes and ring radii are drawing conventions, not physical planet size or distance. Uniformly colored aspects identify geometry, not a measured good/bad outcome. Source rules, astronomy and suggested reflection remain distinct.

## Storage, AI and offline use

Calculations require no server, account, provider key or database. No profile is autosaved. Explicit saves use the separate `astrologers-workbench.desktop-library.v1` namespace (the module's exported constant is authoritative), bounded at 200 charts and 1 MiB per import. Invalid or blocked storage reports a recoverable message and preserves existing data. Names are inserted as text. The standalone study/AI packet includes private input data; the user chooses when to export or share it.

AI study packet constructs an editable prompt plus canonical results and source IDs. It asks for concise checkable reasons and clear uncertainty. Copy/download is deliberate; no model request is sent. ChatGPT website login is not an API credential. The existing MCP and model connection page explains supported external setup; this static release does not host an MCP service.

The Offline edition section explicitly downloads and verifies the public app and data through the existing service worker. External books, websites and hosted models still require connectivity. Browser caches can be cleared or evicted. The portable ZIP runs with a local static server; ES modules do not run reliably by opening the app's HTML directly as a file. Neither offline package contains saved profiles or private research artifacts.

## Release and verification

The old homepage and all existing routes are preserved. Development is on `feat/desktop-astrology-workbench`; deployment uses the existing Pages site and environment. Read [publication status](2026-11-desktop-release.md) and [executed checks](2026-11-desktop-verification.md). The numerical stress suite tests adapter behavior across the supported settings; it is not independent observational validation over the whole century range or evidence of astrological predictive validity.
