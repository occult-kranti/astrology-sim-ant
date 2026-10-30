# Event samples: six-member panel improvement

Baseline: `3be3d46`, branch `feat/mobile-calendar-observatory`. This is the public-event/calendar-comparison member's bounded contribution to the new three-round panel.

## Round 1: inspected methods and implementation

Read the shared specialist contract, Gregorian civil-calendar profile, Indian national Saka profile, canonical `world-events.js`, existing agenda/ICS tests, event source ledger and calculation-method notes. The Saka profile explicitly separates the national solar calendar from regional Hindu calendars; the pair comparison retains that distinction instead of treating its civil date as a tithi.

The existing agenda already preserves date-only precision, explicit noon acknowledgement, conditional status and source freshness. It also already rejects unknown country/category filters; a proposed additional validation change was unnecessary and was not implemented. No event record, source-support claim or review timestamp is altered in this pass.

The useful gap was a missing controlled comparison: readers could open one event's study chart but had to copy values manually to compare another. The new `compareWorldEventSamples(firstEvent, secondEvent, options)` computes both samples through the canonical observer/time/calendar engines, fixes the same explicit observer, and keeps both source event records beside their chosen samples.

### Actual source reading

| Source | Access and reading depth | Consequence |
|---|---|---|
| RFC5545, September2009, §§3.3.4–3.3.5 and3.6.1; https://www.rfc-editor.org/rfc/rfc5545.txt | Fresh HTTP200 on2026-10-29T22:52:04Z;345537bytes; SHA256 `c256f809479d98aa23d71bbd1658b3800ea9f13f41ca56e59c8d2de1b31cbfcb`. Read the DATE versus DATE-TIME definitions and the inclusive DTSTART / non-inclusive DTEND passage. | Public event ICS stays date-only; the comparative study export remains separate and explicitly contains observer coordinates and chosen UTC sample instants. |
| Agrippa, *Three Books of Occult Philosophy*, BookII, chapter34, English transcription at https://esotericarchives.com/agrippa/agripp2c.htm | Fresh HTTP200 on2026-10-29T22:52:04Z;105914bytes; SHA256 `3b2a63d41c2b54196e94305bbc0bd361568d846cba6ea5d650e7738c3e306608`. Read chapter34's discussion of twelve daylight/night parts and the alternative ascensional measure. Not a full-book reading or an independent collation of every inherited rule. | The page now distinguishes12:00 civil clock time from a solar transit or temporal planetary-hour boundary. Its existing temporal-hour engine remains one named convention; no ascensional method is invented. |

No new astrological book rule, political forecast, source-date fact or calendar authority is encoded. The source text explains a historical distinction; it does not validate predictive or ritual effects.

### Comparison contract

- Select two different occurrences from the current filtered agenda. No pair is selected automatically. A campaign exposes its own bounded date input; single-day dates remain fixed.
- Acknowledge the editorial12:00 civil-clock sample and choose observer coordinates/IANA zone. Each date is resolved separately, preserving23/25-hour civil-day effects and skipped dates.
- Compare geocentric tropical Sun/Moon longitudes, Moon–Sun elongation and illuminated fraction. Angle differences are the shortest signed B−A displacement in `[−180°,180°)`, not accumulated orbital travel; illumination differences are percentage points.
- Show broad phase, tithi and temporal-hour labels with derivation notes. Phase/tithi reuse lunar elongation; matching labels are not independent corroboration. Two unavailable hour labels do not become agreement.
- Preserve all13 civil displays, methods, boundary/fixture qualifications and source records. Different public events on the same chosen date/observer can produce identical samples; that is a consequence of selected inputs, not event significance.
- Any filter, observer, pair selection or campaign-date edit clears the computed result and disables its JSON export. The ordinary public-date ICS remains free of observer data.

The new comparison is descriptive two-point arithmetic. It does not calculate correlations, significance tests, consensus, favorable-event rankings, exact phase-transition times, campaign outcomes or election winners.

### Executed Round1 checks

`node scripts/tests/world-events.mjs`:84checks pass, including the56 inherited checks and28 new pair checks. New assertions cover source/conditional/precision retention, actual DST elapsed intervals, sign reversal and zero-degree angular wrap, same-date different events, campaign date bounds, duplicate selection, acknowledgement, invalid observer, deterministic output and polar unavailable comparison. Synthetic boundary fixtures are labelled test inputs, not public-event facts.

`scripts/browser-world-events.mjs`: 62 checks passed against the implemented candidate, with the result saved at `/workspace/setup-validation/ensemble-events-round1/verification.json`. The browser exercised actual pair JSON and date-only ICS downloads, explicit acknowledgement, both selected dates, campaign bounds, duplicate selection, observer/filter invalidation, three responsive widths (320, 390 and 1280 pixels), native labels, and zero browser errors or external requests. The downloaded comparison retained both date-only source precisions and unknown event timestamps; the public ICS excluded the observer. This is Chromium emulation, not a physical-phone or screen-reader audit.

### Round 2 cross-review corrections

The source/connections reviewer independently inspected the comparison arithmetic, acknowledged sample instants, calendar-label comparison, unavailable hours, and the read Agrippa/RFC passage scope. Two wording corrections were accepted: the phase rule now names **centered** 45° sectors, and the result status calls its values **calculated differences**, avoiding an implication that they are independent observations. No numerical method or event fact changed.

After those corrections, the 84 event checks passed again. The source/connections reviewer independently re-read the corrected core (`80ddeadec1c64ddeced6795d537dfa9a39c3b64581ab6354a6d8f44054582c81`) and app (`3425f461395cdefc23cb13bdb471f8d9f756caae06c156c49f845587616df6f8`) and reported no unresolved comparison-source blocker.

The experience reviewer then identified a distinct mobile discoverability issue in the integrated screenshot: the contained wide comparison tables showed the first columns but gave no cue that the remaining columns could be scrolled into view. The app now makes each scroll container a labelled, keyboard-focusable region and shows a concise scroll/arrow-key instruction only when actual horizontal overflow is present. Resize and disclosure changes recompute the hint; clearing a comparison disconnects its size observer. The first browser retest exposed a shared shell CSS rule that made the table itself the scroll container; a scoped override now retains native table layout and places scrolling on the named outer region. This retains native table captions and header relationships. App syntax passed. The experience member's corrected targeted browser run passed 48 checks at 320, 390 and 1365 pixels, including visible overflow-only hints and real ArrowRight scrolling of the named region at the two phone widths, with no runtime errors, missing resources, external requests or product/driver changes. Receipt: [Round 2 event-scroll verification](evidence/ensemble/round2-event-scroll/receipt.json).

As the assigned independent Round 2 reviewer for the standards member, this agent inspected the held standards app (`8619fff3ff374048186b7c172ff29eba8632b2239e5c41ff22dd8db4b2e9ea65`), page (`5914a644448c99a1fbd92f9221d223086ca1a272dd9c5c90d1a95d6548a52258`) and CSS (`3a36eb7691ed3993d1e431f9d774640816f22573568a9a1a30b9de504e1af871`). Both the explicit input check and calendar task preparation reuse the canonical comparison engine, including UTC and observer-local year bounds. The filter reset retains the reviewed packet; editing context clears stale previews/actions. The catalogue continues to call all 58 entries scoped repository instructions, with inherited fixture/reading qualifications, rather than authenticated experts or new full-book readings. No blocking defect was found in that scope. Independent executions passed 337 standards core checks and 46 Chromium checks at 320, 390 and 1365 pixels. The browser receipt is `/workspace/setup-validation/ensemble-standards-independent-round2/receipt.json`; it records no browser errors, external requests or product changes during the run. This does not substitute for the final integrated release check.

## Round 3: final held-candidate acceptance

**ACCEPT within this member's assigned scope.** On the moderator's formal Round 3 trigger, this agent re-inspected the final pair arithmetic, shared observer, chosen civil dates, conditional/source precision, public ICS versus comparison JSON, and stale-result invalidation. The final app clears both the stored pair and its download action whenever event/date/observer/filter context changes; its scroll observers are disconnected when the pair is cleared. The numerical core uses the canonical calculations and shortest signed angle differences, and continues to report unavailable labels as unavailable comparisons. No blocking defect remained in that review.

Executed again on the held candidate: 84 event checks, app syntax validation, and 337 standards checks all passed. The independently reviewed standards app/page/CSS hashes still match the Round 2 candidate above; canonical UTC and selected-zone civil bounds and scoped profile packets remain intact. No additional browser was launched in Round 3 by this agent: the experience member owns the final integrated run, with the already verified actual-scroll correction included.

| Final reviewed file | SHA256 |
|---|---|
| `assets/js/core/world-events.js` | `80ddeadec1c64ddeced6795d537dfa9a39c3b64581ab6354a6d8f44054582c81` |
| `assets/js/app/world-events.js` | `9839120b0e220d10abb6c6d9e34ade81c8f0c2ca3a209806dcdbd9e8d59d4b53` |
| `assets/css/world-events.css` | `6225706a5e0776727a88be99f7b2461a83f0fcfecdfbdc2348d38d9720503201` |
| `pages/world-events.html` | `0505b04d99b1e68ff036bf51584c38eb1fdb2a331241650bb09693995170294e` |
| `scripts/tests/world-events.mjs` | `dc5c5bfe5447e71a9db925b774b19dd9abb7945aa1f8ba0751fa4261e6b9088c` |
| `assets/data/world-events.json` | `182e0780a7711bc3b178081194337cfd864afefc1f64c57224d72b58de8be4fc` |

The data and refresh script are unchanged from the starting commit. The retained dataset has 16 curated records, 38 source records and the original `2026-10-29T22:17:04.277Z` review timestamp with a 14-day freshness window. Recomputing a date window or a study pair does not revalidate public dates or guarantee that an election schedule remains current. The limited RFC/Agrippa readings above do not establish complete textual coverage, broad calendar accuracy, religious authority or predictive efficacy. Source event timestamps remain unknown; the 12:00 civil instants are chosen study samples. Shared lunar derivations are dependent, and two samples do not establish a statistical correlation or predict election outcomes. Physical-device and screen-reader behavior, live external services and broader country coverage remain outside this bounded validation.
