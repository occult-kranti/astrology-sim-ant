# Calendar timeline experience — 30 October 2026

## Implemented view

`pages/calendar-timeline.html` is a date-first view of one canonical frame. Its default inclusive civil range is 30 October 2026 through 1 January 2031: 1,525 dates. One native range input, a date field and previous/next controls share a selected index. Previous/next may step by day, month or year; month/year movement clamps the original day to the destination month's last day before clamping to the applied range. Native slider arrows always move one civil date; Home and End reach the range boundaries.

The settings explicitly retain local time, observer latitude/longitude, IANA zone, tropical house system and repeated-clock policy. They accept the core's bounded 1900–2100 interval and at most 3,660 inclusive dates per grid. A civil date can remain selectable while its clock is ambiguous, missing, skipped or outside the supported UTC interval. The unavailable view displays the actual reason and both repeated-clock candidates. It does not choose another instant.

The layout uses the site's parchment, green ink and copper palette. The desktop view presents two adjacent engraved instruments; mobile stacks them. The mobile section links scroll within their own navigation region. Tables have named, keyboard-focusable overflow regions. Controls retain native keyboard and touch behavior, visible focus, labels and a minimum 44 px action height. Reduced motion is respected. A second, compact toolbar immediately before the linked instruments repeats the current date and offers previous/next civil-day buttons plus a return link to the main date controls. It uses the same cursor, adds no second slider and remains in normal document flow. The toolbar keeps focus while an aria-hidden placeholder reserves the former output height during recalculation, so hidden stale instruments do not cause a scroll jump. There is no autoplay.

## Calculated content

The page presents these outputs from the same `frame.context.dateISO`:

- A ten-body tropical wheel with canonical requested/actual house-system disclosure and twelve cusps.
- A sidereal wheel with seven traditional bodies plus the mean Rāhu/Ketu nodes, canonical whole-sign cusps and the linear Lahiri qualification. The renderer never subtracts the ayanāṃśa again.
- Numerical companions with ten tropical body positions, twelve pairs of house cusps and nine traditional sidereal grahas. Display rounding does not alter download precision.
- All 32 atlas method records in seven selectable families, including explicit unavailable implementations. Civil dates are not assigned invented zodiac angles. Family selection filters display only; the export disclosure states that frame downloads retain all methods.
- Eleven inherited guidance-rule records, their algorithm, numerical inputs, thresholds, source IDs, source status and limits.
- Five peaceful study cards. Three retain their existing editorial profiles, evidence and fixed denominator. Dialogue and ceremony retain explicit unimplemented status without fabricated scores.
- Canonically solved nearby lunar/solar quarters and the separately labeled annual solar-term convention, including UTC instants and observer-local dates. Broad lunar phase sectors remain distinct from exact event searches.

`calendarTimelinePlateSVG` is a pure presentation function. It renders only canonical longitudes and cusps, uses separate rings for legibility rather than physical distance, and includes numerical metadata plus text alternatives. The app does not implement an ephemeris, calendar converter or house algorithm.

## Asynchronous state and stale prevention

`assets/js/workers/calendar-timeline-worker.js` invokes the canonical grid, frame and export helpers. Each operation owns a worker. Replacement, cancellation, input changes and page suspension terminate that worker. A monotonically changing request identifier also rejects late replies. A selected frame is applied as one DOM update sequence; the linked output stays hidden until that frame is complete.

Changing calculation inputs immediately clears the applied grid/request, hides all dependent instruments, disables exports and resets the moment link. The visible stale message requires Apply settings. Date navigation retains the applied grid but hides the old frame while calculating the replacement. Cancellation clears the frame and its source pane. Missing Worker support, a worker load error or a calculation error opens settings and gives an explicit retry route. Export generation recomputes the same fresh request/index through the canonical serializer; a context change terminates that export operation.

The app exposes `data-state` on its main element and `data-date-iso` on the output, instruments, numerical tables and linked evidence panes for read-only verification. It has no mutable testing hook. No private saved records, geolocation permission, provider inference or server write is used.

## Historical markers and downloads

The twelve marker records come from `assets/js/core/data/timeline-history.js`. The historical section retains event type, date precision, meaning, scope notes, original-calendar variants, unknown source clock, source lineage and source access/reading qualifications. The Jordan source's 5775/5755 discrepancy remains visible in its notes; it is not silently repaired by a computed conversion.

Study this date centers a short date range on the marker and retains the entered observer, zone and local clock. A visible banner identifies all of those as assumptions rather than certified event time/place. Manual slider/date/step/context changes clear that marker banner. Source metadata does not become a national birth input.

The two frame buttons download the canonical JSON/CSV for one selected frame. Their disclosure says historical markers navigate the timeline and are not attached to those frame downloads. A separate Source record · JSON action downloads the curated historical record, its full referenced source objects, catalogue coverage and limitations, with `calculationIncluded: false` and `assumedClockIncluded: false`. These local files do not connect a calendar provider or send a record anywhere.

## Review record

1. Flow and API coordination established a single civil-date cursor, explicit observer/clock/fold controls, simultaneous canonical panes and selected-frame exports. Independent review checked the distinction between source-only history and entered observer assumptions.
2. Independent calculation review reconstructed the actual SVG body/cusp angles (34 checks across eight plates). A source-disclosure review identified omitted history notes and reading statuses; these were added to the history records, source records and main source pane. Nearby solved-event display and separate historical-source downloads were integrated.
3. Owner visual checks loaded the real page in Chromium 145 at 1440, 390 and 320 px, with zero console/page errors and no page-wide overflow. They confirmed 10 tropical rows, 12 cusp rows, 9 graha rows, 32 atlas records, 11 rule blocks, 5 study tasks and 12 historical markers. The desktop instruments and mobile 320/390 px screens were inspected visually. A compact mobile heading/navigation adjustment brought the date slider into the first 900 px at 320 px width; named table scrollers retain wider numerical columns. Root visual review requested navigation beside the charts; the bounded linked-instrument day toolbar and pending-height placeholder were added for that journey. The independent browser run subsequently found a 38 px desktop Cancel control; its minimum height was corrected to 44 px before the final run. The focused chart-toolbar check at 390 px retained scrollY 991 and focus on Next day, updated the date to 31 October 2026 and every pane to `2026-10-31T12:00:00.000Z`, then returned to 30 October with Previous day; all three relevant controls measured 44 px. The focused independent browser harness and repository-wide release gates are recorded separately by the QA/integration owners; this owner check does not claim those gates or publication.

The independent final browser run passed 2,055 checks and verified 44 downloads, then visual inspection of the 320 px DejaVu fallback-font image found the main Previous label split inside the word. Root reopened only that transport layout. A CSS-only correction gives its previous/next buttons a 6 rem minimum inline size, keeps labels on one line, prevents the step group from shrinking, and lets complete controls wrap naturally below 420 px. All action targets retain their 44 px minimum height. The prior `quality/round3-first` receipt is retained as pre-correction evidence; the strengthened label-geometry rerun belongs to the QA owner. No calculation or interaction logic changed.

Owner screenshots and the ephemeral visual harness are in `/tmp/calendar-timeline-owner/` and `/tmp/calendar-timeline-owner.mjs`; they are working evidence, not a publication receipt. The initial Puppeteer launch lacked its default Chrome cache; the successful runs selected the already installed Chromium executable at `/tmp/atlas-ci-browsers/chromium-1208/chrome-linux64/chrome`. Each successful owner process closed its browser before returning. No more than the two coordinated team browser slots were used.

## Files

- `pages/calendar-timeline.html`
- `assets/css/calendar-timeline.css`
- `assets/js/app/calendar-timeline.js`
- `assets/js/workers/calendar-timeline-worker.js`

Navigation, tool registries, canonical engine/data and shared verification scripts are owned by the integration, engine, source and QA lanes rather than this view.
