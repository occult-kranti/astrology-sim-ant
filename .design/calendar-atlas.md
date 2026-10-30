# Calendar atlas design contract

2026-10-29 · Design Partner `create` mode in the existing native JavaScript stack. Read the current mobile/Studio/session design records and Design Partner foundations, accessibility and verification instructions. No existing `*-report.md` file was present. The inherited mobile fixes remain constraints, while this new surface leads with desktop comparison.

## Identity and primary task

The Workbench is a source-labelled calculation and study instrument. Its user chooses an explicit moment and observer, compares named methods, then inspects the calculation and its limits. The central artifact is the **same-instant comparison ledger**, accompanied by a computed astronomical plate. A decorative zodiac, an unsupported agreement score or a simulated personal prediction would obscure that job.

## Art direction

An engraver's spread: parchment, green-black ink and restrained copper; serif display type; sans-serif controls; tabular monospaced measures. Wide layouts place a control rail, an engraved Sun/Moon longitude dial and a measured-data index in one spread. The lower ledger aligns method, result, boundary and evidence in stable columns. No uniform card grid, gradient hero, external font service or new framework is introduced.

Semantic local colours: paper `#f6f1e7`, ink `#263b36`, copper `#9a482e`, secondary text `#60695d`, rule `#c8c5b6`. Colour is supported by explicit available/partial/unavailable text. The plate uses real canonical tropical longitudes, zero Aries at top and increasing clockwise. Separate ring radii are disclosed as a diagram convention, not physical distance. Accessible title/description and visible measures duplicate the numerical content. Exported SVG metadata carries the actual UTC and longitudes.

## Functional structure

- Main route: `pages/calendar-atlas.html`; five real family routes under `pages/calendars/`: Western, Vedic, Egyptian, Hebrew and Chinese. Islamic and further-civil family views use explicit `family` filtering on the main route.
- Public context: local date/time, IANA zone, observer, repeated-time resolution, house convention and prayer-method controls. Controls invalidate exports immediately; invalid calculations preserve the labelled previous plate.
- Catalogue: canonical `buildCalendarAtlas()` rows only. Selection is independent of moment calculation; compare all or selected rows, switch to one-method inspection, and inspect actual result JSON and source qualifications. An empty selection remains an explicit state.
- Solar/lunar tabs show genuine shared geocentric measurements. They do not invent a family-specific calendar algorithm. Tabs support click, ArrowLeft/Right, Home and End with roving focus.
- Personal component: optional, separate memory-only birth workflow owned by the personal-calculation member. Main atlas JSON/SVG/share payloads never serialize that state.
- Hebrew route: separate bounded letter study using existing `gematria()` standard/gadol methods, with per-letter values, totals and an ignored-character notice. It is not a calendar or birth interpretation; entered text is excluded from public exports.
- Public moment links preserve UTC, coordinates, zone and named conventions only; copying is an explicit user action. Variant IDs and optional family filter support reproducible selection. Default SVG excludes observer coordinates; public JSON includes the visible observer with a disclosure.

## Responsive and interaction constraints

At desktop widths, the plate is the dominant visual artifact and the comparison ledger retains aligned columns. Below 1100px, the measured-data index moves below the plate. Below 760px, controls stack above the instrument; input text remains at least 16px and primary targets at least 44px. Genuine two-dimensional tables retain local horizontal scrolling without whole-page overflow. Native labels, links, buttons, fieldsets and details preserve ordinary keyboard behavior; generated summaries do not gain oversized pseudo-element hit targets. Reduced-motion mode does not remove any function.

## Round 1 evidence

Real Chromium run: 27 checks passed on the initial candidate, including all six routes, 32 canonical rows, selected/all/single workflows, tabs with keyboard, invalid input preservation, actual SVG/JSON longitude equality, unknown-time personal integration and export exclusion, and standard 40/gadol 600 Hebrew final-mem arithmetic. No root overflow at 1440 / 1920 / 390 / 320; zero runtime errors or automatic external requests. Screenshots at 1440, 1920 and 390 were visually inspected. Receipt `/tmp/atlas-ui-r1-report.json`; screenshots `/tmp/atlas-r1-{1440, 1920, 390}.png`.

The subsequent main-route Islamic/further-civil family-filter completion awaits the next independent workflow run. This is browser automation and model-agent review, not a human usability study, physical-device or screen-reader certification. Further rounds will retain concrete findings and corrections in `docs/2026-10-atlas-experience.md`.

## Round 4 refinement and verification

Retained the engraved plate and comparison-ledger direction. A measured desktop cold-open defect placed Calculate below both tested viewports; the inherited shared heading rule also made the control rail too tall. The same form's existing action/status now appears first, with a scoped compact heading, short-height desktop spacing and a sticky action rail. Moment and personal-return anchors preserve current values. This is a task-flow correction, with no new calculation or privacy behavior.

Fresh Chromium evidence: 25 checks passed, including 1440×600, 1440×800 and1920×900 action visibility; keyboard focus unobscured by the sticky action at320/390/720/1440; private entry preserved on return; no root overflow; actual24-term clock rows and the unavailable Hong Kong2101 boundary. Final1440 and term-table screenshots were visually inspected. The720px run tests reflow, not actual browser zoom. Durable receipt and before/after images are linked in `docs/2026-10-atlas-experience.md`. Product held for independent integration and the fifth panel round.

## Round 5 held-candidate acceptance

ACCEPT after a read-only13-check specialist review and inspection of the independent final612-check/85-download browser receipt. No additional product edit or browser run was made by this member. Atlas app/CSS/core and all six route hashes match that receipt; the446-file product manifest was unchanged between R4 and R5. The actual action, family, selection, source and private-boundary workflows remain covered. Detailed evidence and limitations are recorded in `docs/2026-10-atlas-experience.md`.
