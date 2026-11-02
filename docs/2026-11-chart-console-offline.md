# Chart console and offline edition

The private birth reader now treats its wheel as an instrument: choose a declared
chart frame, select a planet or house, inspect exact calculated positions and
named relationships, change visible layers and export the current image. View
changes do not recalculate the birth or change the canonical JSON report.

## Visual direction and sources

The user requested Star Trek inspiration. The original interface uses segmented
black panels, color-coded rails, prominent labels and adjacent readouts. It keeps
the Workbench's typography, themes, numerical tables and source distinctions.
No franchise artwork, sounds or commercial template code is included.

- [The LCARS site](https://www.thelcars.com/) — visual reference for segmented
  panels; its [custom licence](https://www.thelcars.com/license/) was inspected.
  The template is not redistributed.
- [LCARS CSS framework](https://github.com/joernweissenborn/lcars) — public
  implementation reference with an inspected MIT licence. No framework dependency
  is added; the console is original scoped CSS and native browser controls.
- [Arwes](https://github.com/arwes/arwes) — reference for science-fiction
  interface patterns, not a runtime dependency.

The wheel uses held `report.charts` through the existing native SVG renderer.
No printed-chart reconstruction, mean-speed substitute or inferred extra planet
is introduced. A sidereal display changes the coordinate labels, not the physical
angular separation. Western planetary-moiety aspects remain explicitly named;
they are not silently presented as Jyotisha graha-drishti. Degree labels are
computed coordinates, not claims of second-accurate recorded birth time.

## Three ways to keep the work offline

1. **Save a private HTML reading.** The existing export contains the calculated
   report and inline chart. Open it directly from disk without JavaScript,
   a connection or a local server. It is a snapshot and does not recalculate.
2. **Make the library available offline.** Open the birth reader over HTTPS,
   select the explicit offline download and wait for its verified ready state.
   It stores the public pages, local JS/CSS, calculation engines and reference
   data. Those cached pages can be opened and recalculated without a connection.
   Private birth inputs and derived readings are not part of this pack.
3. **Download the portable ZIP.** Pages CI builds `offline-workbench.zip` from
   the same verified inventory. Extract it and serve the folder on your own
   computer with `python3 -m http.server 8000 --bind 127.0.0.1` (Windows:
   `py -m http.server 8000 --bind 127.0.0.1`). Visit
   `http://localhost:8000/pages/birth-reading.html`. No internet or application
   backend is needed. Modern browser module/worker rules require this local HTTP
   origin; double-clicking an application HTML file is not an equivalent launch.

External source books, live websites and hosted AI/MCP services still require
their own connection. Browsers may evict stored files; keep the ZIP and private
exports separately if long-term access matters. Browser installation alone does
not prove the entire library has downloaded.

## Integrity and lifecycle

`scripts/build-offline-manifest.mjs` inventories only the public static pages and
assets. Each entry has a path, byte count and SHA-256; the inventory has a
deterministic version. It excludes itself, research downloads, source books,
private files, test evidence, backend code and tooling. The finite library is
bounded at 1,500 files and 100 MiB. Its normal current size is shown in the UI.

Run the search-index builder after changing HTML, then run the offline manifest
builder after all public asset edits. Both the manifest freshness gate and
package builder run before publication. The ZIP builder verifies every input
against the inventory and includes the service worker, inventory and local
launch instructions. ZIP bytes are generated at publication, not committed.

The service worker prepares files through an explicit request, checks their
length/hash, and marks a library ready only after the complete operation. A
cancelled or failed preparation cannot be called complete. Requests with query
strings are not persisted. Cache ownership is scoped to the Pages project;
clearing this library must leave unrelated origins/projects alone. Existing
service-worker updates remain explicit so an active private reading is not
silently reloaded.

## Verification boundary

The new `scripts/browser-birth-console.mjs` uses synthetic inputs under the Pages
subpath. It exercises controls, image bytes, keyboard/reflow, clear/stale state,
interrupted preparation, actual offline navigation and worker calculation, and
scoped cache removal. The inherited birth gate and every existing release gate
remain in CI. Receipts bind the browser driver and source manifest. Automated
browser checks are not physical-device or screen-reader testing, source-book
expert review, independent ephemeris validation, or evidence of predictive power.
