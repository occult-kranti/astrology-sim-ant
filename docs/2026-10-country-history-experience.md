# Historical country/calendar experience

30 October 2026 · `pages/country-calendars.html` · scoped Design Partner `create` pass.

The page compares documented past reference events for USA, Israel, India, Russia, Iran and Palestine. A declaration, constitutional milestone and institutional status are separate records. None is silently promoted to a country's unique birth. Historical facts remain qualified by their source and event scope.

## Composition and behavior

The interface extends the existing engraved-paper vocabulary: green-black ink, copper, serif headings and a stable comparison ledger. It reuses `frontispiece('astrolabe')` and shared `mountChrome('countrycalendars')`. It adds only the page, its scoped stylesheet and its app module; shared navigation and route registries are integrated by the lead.

The first view selects one historical variant per country. Native labelled checkboxes allow up to six records, including multiple variants of a single country. An empty selection or more than six records produces a focused error while preserving the selections. A successful comparison moves focus to the ledger heading. Native details expose additional variants, method limits and sources; citations open the source register before navigating to their entry. Tables use labelled keyboard-focusable local scrolling regions.

Each selected event carries its date, time precision, reference location, IANA zone, coordinate qualification, original calendar, source links and source uncertainty. Record-level source/precision disclosures are open by default, so single-source caveats and unresolved variant discrepancies are initially visible beside the result; readers may collapse them. Civil labels use a visible, expressly assumed 12:00 local reference. Those columns represent different instants. Date-only events keep an unknown clock; source-only USA records before 1900 retain their dates and citations with unavailable calculations.

Optional day sensitivity samples only the selected documented past day. A record selector and keyboard-operable slider traverse canonical elapsed-UTC hourly samples plus the day's final included second. The selected house convention is one of Regiomontanus, Placidus, whole sign and equal; changing it requires a fresh comparison. The SVG and adjacent twelve-cusp/angle table show canonical geometry for the selected assumed instant. Actual fallback system, unavailable values, offsets, clock occurrence, gaps/folds and sample limitations remain visible. No extrapolated date, event-time inference, country ranking or outcome prediction is exposed.

Twelve visible house reference entries retain descriptive source meanings and qualified editorial civic analogies. The method catalogue explains calendar and tradition distinctions. Civic/archive study cards list information and source requirements; they do not calculate a date recommendation.

## Exports and state

Any record, house convention or sensitivity change clears the previous calculation and immediately disables JSON/CSV export. An asynchronous render revision prevents an obsolete pending calculation from publishing a result. Changing only the displayed sample does not change the exported study: the complete declared sample set remains the artifact.

JSON is the canonical `buildCountryHistoryStudy()` envelope. The CSV is long-form with explicit record, calendar, unavailable-calendar, sensitivity-status and assumed-house-sample row types. Source record precision, source metadata, raw cusp values, assumption notes, sampling method, clock slots/changes and limits are retained. Numeric nulls serialize as empty cells, never invented zeros. Display rounding to three decimals does not alter export values.

The study stays in memory; there is no network inference, location detection, persistent personal profile, date search, external account or automatic share action.

## Verification status

Source contract read: `.claude/skills/observatory-source-contract/SKILL.md`, including date-only precision, named methods, canonical engine reuse, source/edition/reading distinctions and unavailable scope. Existing design record `.design/calendar-atlas.md` and Design Partner foundations, accessibility, mode and verification references informed implementation.

Round 1 implementation: app syntax check passed. Actual Chromium under `/astrology-sim-ant/` passed 40 owner checks: six default contexts, thirteen civil rows, twelve house references, opt-in sensitivity, source-only pre-1900 availability, no page overflow at 1440/390/320/720 CSS pixels, empty/over-limit selection errors and focus, immediate stale-result/export invalidation, keyboard slider operation, all four house conventions, source-register navigation, reduced motion and two actual downloads. There were no page exceptions or automatic external requests. The downloaded JSON retained all unknown event clocks and all declared day samples; CSV retained labelled sample rows and civil boundaries. A separate Python CSV parse compared all 125 assumed-sample rows against the downloaded JSON: every raw cusp, ascendant and midheaven matched exactly; unknown event-clock cells stayed empty and pre-1900 USA rows had neither an assumed reference instant nor house samples. The 198-row export receipt is `ui-round1/export-precision.json`.

Desktop and mobile first-view and sensitivity screenshots were inspected. The test's initial stops were harness issues (CommonJS import and a live unselected-checkbox locator whose target changed after checking), corrected in the harness; these were not product failures. The successful receipt and screenshots are retained under `docs/evidence/country-history/ui-round1/`. The 720px case is reflow evidence, not actual 200% browser zoom. No physical-device or screen-reader run is claimed.

Round 2 independent model-agent source review accepted the visible noon/unknown-time distinction, separate local reference instants, twelve descriptive houses, civic requirements, five named method groups, source edition/access/rights data and exports. Independent engine/UI review reconstructed SVG cusp-line angles for 25 samples across all four systems (100 samples) with zero cusp/number mismatches. That review found one wording defect: the SVG description said “exact values” while the visible table rounds to three decimals. The description now says “Rounded numerical values” and identifies full precision in JSON/CSV. Numerical geometry and exports were unchanged. The held-candidate root browser/release review remains separate.

A source or browser check is not historical-author participation, predictive validation, a physical-device test or a screen-reader audit.

## Round 3 correction and held candidate

Independent browser review found a real mobile keyboard defect: the shared narrow-screen stylesheet made `table` itself a horizontally scrolling block, so the labelled focusable wrapper had no overflow and ArrowRight did nothing. Prior no-page-overflow checks had not established that keyboard interaction. The scoped country-page override restores native table layout and makes the named region the sole horizontal scroller. The independent diagnostic is retained at `docs/evidence/country-history/independent-diagnostic-2/`.

After the correction, a targeted owner Chromium run focused the named region and pressed ArrowRight at 390, 320 and 1440 CSS pixels; scrolling occurred in all three cases. Nine associated width/native-layout/no-document-overflow assertions passed. Receipt: `ui-round1/scroll-correction.json`. Independent full held-candidate retest remains pending; no broader acceptance is inferred from this targeted correction check.

## Frozen UI role acceptance

**ACCEPT within the UI implementation role.** The three owned product files are frozen at the following SHA-256 values. Source/precision distinctions, bounded past-record controls, canonical geometry, full-precision exports, stale-input invalidation and the corrected named-region keyboard scrolling have no remaining known UI-role blocker. The 40-check owner run, independent source review, 100-sample SVG reconstruction and targeted nine-check keyboard correction are the bounded evidence described above. The lead's separate four-width source-bound browser run and root visual sweep are in progress; this role acceptance does not claim those runs have completed, or that anything is deployed.

| Owned file | SHA-256 |
| --- | --- |
| `pages/country-calendars.html` | `a24738fd14468e8daa7a4a5f7f007e46761721a90b803abcbac3c30ac73efbee` |
| `assets/js/app/country-calendars.js` | `28a96906b054ecf1cfe11b6e70bc94b7fd09d291750f88227a41de9dfac29f3f` |
| `assets/css/country-calendars.css` | `beae95f635d3d413657620e7c7799467605d2692096ebd18a0c9d3c7e814c25d` |

The root visual sweep subsequently found two-digit house-reference ordinals wrapping vertically. The authorized scoped correction reserves a 2.75rem ordinal column and prevents number wrapping. The CSS hash above is the corrected candidate; page and app hashes are unchanged. Independent QA is checking all twelve text line boxes and non-overlap under default and DejaVu fonts at four widths before the final source-bound acceptance. No other product change was made. Physical-device, screen-reader and actual browser-zoom coverage remain unclaimed. The runtime-dependent historical calendar/zone limitations remain part of the product, rather than acceptance defects to hide.
