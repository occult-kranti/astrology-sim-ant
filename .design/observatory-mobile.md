# Calendar Observatory: mobile redesign contract

Updated 2026-10-29. Mode: **Redesign**, with a shared operating and reading shell. This extends the existing Studio and session briefs; existing calculation methods, route URLs, deep anchors, saved-person formats, Workbench panels, exports and local journals remain invariants.

The visitor's first task is to choose a moment and place, inspect a reproducible reading, then compare the named conventions. The new home and comparison surfaces are implemented separately. The shared layer makes the existing tools and books feel like the same working collection, without moving their content into a replacement app.

## Direction and decisions

The visual direction is a field almanac: warm ivory sheets, dark green ink, rust actions, restrained gold reference accents, serif display titles and sans-serif controls. Diagram colours retain their existing meaning. No font service or new UI framework is required.

- A compact masthead gives the site identity, search and the complete grouped navigation. Every original navigation destination remains named in the registry; Today and the new moment comparison are added to the same registry.
- On phones, a five-item bar keeps Today, Compare, Tools, Library and the same Menu in thumb reach. It has safe-area padding and at least 44px targets. It does not contain a duplicate menu catalogue.
- The menu remains a nonmodal disclosure: sections are native buttons, links remain links, expanded states are synchronized, ArrowDown enters a group, Escape closes the current group and then the drawer with focus restoration. Search keeps the existing native dialog and keyboard shortcut.
- Form controls have at least 16px text and 44px height. Layouts recompose into one column where necessary; data tables retain all columns in local horizontal scroll areas. The bottom action bar clears the new navigation.
- Reading surfaces use quiet boundaries and a consistent hierarchy. Historical source and science notices remain visible. Light heroes have light-surface links; live sky figures and numerical renderers keep their existing data and controls.
- A skip link resolves the actual main ID, including the new home’s `observatory-home`, rather than assuming `content`.

## Baseline and revisions

Round 1 observed a 125px mobile header before any task content. Existing Incense and Jung tool pages overflowed at narrow widths. Baseline screenshots are retained under `docs/evidence/calendar-observatory/baseline/` by the independent review agent.

The shared implementation reduces the observed header to 77px at 320px and 390px, adds the task bar, and applies semantic tokens, component states, table scrolling and mobile form sizing through `assets/css/observatory.css`. `mountChrome()` loads that layer from the module-derived site root, so nested routes and GitHub Pages project prefixes resolve consistently.

Round 2 corrected observed narrow-layout defects: Incense’s legacy `tbl` tables, Jung’s inline no-wrap saved-person controls, Vedic’s long evidence badge, and the operative graph’s long culture labels. The graph also needed a positioned scroll container: absolute screen-reader-only labels otherwise enlarged the root page even though visible content was clipped. These fixes preserve the table contents and hidden labels. The independent full-route sweep then exposed long URLs/transliterated compounds, a min-content chronology selector and a nine-column Sarvatobhadra grid; wrapping the actual source text, releasing the selector minimum and locally scrolling the grid corrected those cases. The book links in the footer are now a native disclosure, initially collapsed on phones and expanded on wider screens, preserving all twelve links.

## Executed verification

Author browser checks used system Chromium through Playwright on the local static server. At 320px, 390px and 1365px, the sampled Tools, Calendar, Studio, Library, Incense and Jung routes retained their shared header and had no horizontal root overflow or page errors. Vedic and Operative Corpus were rechecked at 320px after their specific corrections and measured exactly 320px document width.

An interaction run verified bottom Menu opening the existing navigation, the comparison link, group and drawer Escape/focus behavior, the existing search dialog opening and closing, a valid skip destination and all five bottom targets at least 44px. Reduced-motion mode was used for this run. The new core palette was calculated at 12.08:1 for body text, 5.86:1 for secondary text, 6.12:1 for rust links and 6.61:1 for primary-button text; the input boundary is 3.29:1 against its sheet and the focus colour is 5.49:1 against the page. This does not certify every inherited chart/inline style. `node --check assets/js/app/shared.js` and the owned-file whitespace check pass. The existing `BROWSER_PHASE=studio` release harness subsequently passed all five small/mobile/landscape/desktop/reflow journeys, including nonempty partial traces, save/reload, strict alphabets, polar-hour states, exports and live/pause. Both the Saturn/Latin `AAB` and Sun/AIQ `SECRETSUN` partial-trace states were separately measured at 320px with no root overflow. Broader integration, full-route sweeps and screenshots are recorded by the independent QA panel in the dated evidence directory.

This is browser automation and AI design review, not a human user study, screen-reader test, physical phone test or accessibility certification. The entire tradition library is preserved, not revalidated by the presentation changes. New calendar/AI capabilities and their source limits are owned by the corresponding engine and integration workstreams.
