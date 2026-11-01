# Celestial timeline bookmarks

This update adds visible equinox/solstice presets, lunar-phase icons, colored event rails and explicit saved bookmarks to the shared date navigator. Atlas calendar rows, synchronized Timeline rows, the sampled Sky timeline and calculated Newton survey lanes use the same presentation contract. Historical manuscript/source-year rails remain source references.

## Data and precision

The DOM-free `core/celestial-navigation.js` adapter reuses the existing `buildSkyTimelineSync()` solar-season and lunar-quarter numerical searches. Each cached UTC year uses at most three sampled Sun/Moon positions and 64 solved events; the view cache is bounded to 24 year/zone entries and the existing 1900–2100/3,660-day supported window. It does not hardcode seasonal dates or calculate ephemerides on pointer movement.

Sampled phase icons use held canonical Moon–Sun elongation or existing sampled Sun/Moon longitudes. They do not invent an illuminated fraction when none is supplied. Their eight schematic shapes describe phase vicinity; exact lunar-quarter markers retain the solver's event label and UTC. A phase does not determine local crescent visibility, a religious calendar boundary, an eclipse or an outcome.

March/September equinoxes and June/December solstices avoid hemisphere-dependent season names. The same astronomical UTC event appears across the calendar lanes; its shared appearance is not independent agreement between traditions. Details retain the observer's civil date, clock and IANA zone. Multiple events on one civil day keep distinct event identities.

## Navigation and storage

The four focus-year season presets stay visible even outside a short slider window. The proportional event rail is separate from the indexed study-day slider; crowded rail markers are thinned, and the complete event set remains in a paged list. Hover/focus only opens a preview. Atlas/Sky explicit actions cast the exact supplied UTC, including milliseconds. Daily Timeline/Newton actions explicitly select a study day at its retained clock, or open a declared one-day range when the season lies outside the window. The event's solved instant is never relabeled as the study sample.

Automatic presets do not create persistent saved bookmarks. Explicit saves use the existing public reference/date/kind schema and 250-entry cap. Saved birthdays, notes, provider keys and other private records are not read or copied into a bookmark. Storage errors preserve current calculations and disclose tab-only recovery.

## Review and validation

Six AI engineering perspectives cover integration, data adapters, shared interaction, styling, browser verification and independent review. Sixteen exact-baseline images and twenty implementation images support the first two review rounds. Pure adapter checks pass 58 cases, including phase wrap, missing data, exact event identity, UTC/local-date separation, leap years and range bounds; the eight existing date-navigation unit checks also pass.

The first real-page diagnostic verified visible annual presets, exact millisecond casting, London daylight-saving conversion, calculated phase across calendar rows, explicit retained-clock actions and unchanged canonical JSON after bookmarking. Dense fixtures exercise collision lists, keyboard navigation, save/remove/reload, storage failure and the cap. A CSS-zoom diagnostic exposed an oversized floating card. Placement now converts rendered and local CSS coordinates consistently, bounds the card to the viewport and preserves internal scrolling. The corrected 640×1,000 zoom fixture fits within left/right 12/628 and top/bottom 12/653.27 pixels; focused event and bookmark actions remain reachable. Diagnostic runs are retained separately.

The final eight-journey celestial suite passes 229 checks with sixteen actual screenshots and fourteen retained downloads. It verifies visible annual presets, exact millisecond casts, retained-clock navigation, phase data, collision lists, explicit save/remove/reload, the 250-entry cap, storage failure, privacy, keyboard/tap behavior, 320px/zoom, reduced motion and forced colors. Five before/after bookmark export pairs are byte-identical. A screenshot-only follow-up clears hover and frames the seasonal strip; the final frozen driver is retained with its source manifests.

Local regression gates pass: 734 engine assertions; 134 HTML/328 JS files with zero static problems; all nine generators and the current ledger; all 134 pages with zero browser errors; 517 inherited date-wayfinding checks; 3,717 theme checks over 171 states; 3,520 sky, 1,294 Newton, 239 Black-chart, 192 neon-chart, 2,067 timeline and 631 source-atlas checks. The inherited page sweep retains two UI-drive descriptor warnings; the ledger retains its inherited C3-not-evaluable qualification. Neither is counted as a new successful validation claim.

The Pages workflow retains every existing gate and adds the celestial bookmark journeys. Exact workflow artifacts and the deployed `release.json` bind publication to its tested commit. Emulated viewport/keyboard checks do not establish physical-device usability, screen-reader compatibility, exhaustive case coverage or observational accuracy of event times.
