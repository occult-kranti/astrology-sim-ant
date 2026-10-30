# Independent calendar timeline verification

The review extends published baseline `ae94fb003f00f3456635121e81f6616a6d6118a3` on `feat/peaceful-calendar-timeline`. Its scope is calculated sky geometry, civil calendar conventions, named traditional evidence and documented past history. It does not validate historical source truth, historical time-zone accuracy, cultural authority or predictive efficacy. No future military objective or outcome forecast is part of this review.

The independent QA lane owns only its two new test drivers, this report and evidence under `docs/evidence/calendar-timeline/quality/`. Product findings go to the implementation owners. A diagnostic that permits source changes cannot count as held acceptance.

## Round 1 — independent contract and semantic diagnostics

The reviewer read the inherited horizon and country verification reports, `HANDOFF.md`, the atlas plan and calendar-observatory research, and the local `verify-site`, `date-event-search-review` and `observatory-source-contract` skills. These are software checks by an independent AI-agent role, not human participant research or new primary-source reading.

Independent civil-date expectations use Gregorian arithmetic rather than the new grid implementation. Required fixtures include 1900-01-01 and 2100-12-31, leap day 2028-02-29, non-leap century 2100, the 3660-day bound, New York's missing 2026-03-08 02:30 and repeated 2026-11-01 01:30, and Apia's missing 2011-12-30. Repeated 01:30 must expose 05:30Z and 06:30Z with an explicit occurrence policy. Local dates whose chosen clock resolves outside the supported UTC range must remain unavailable.

Every available frame must preserve one selected UTC instant across the canonical comparison, ten sky bodies, thirteen civil-calendar slots, and twelve named house cusps. The full Vedic chart must retain its own named method. Observer changes may alter houses and local horizon values without inventing a second geocentric sky. Invalid indices, unknown fields, submitted geometry and military-objective fields must reject at the public core/adapter boundary.

The inherited date/time boundary passed **11 pinned expectations** in `quality/round1-baseline/temporal-expectations.json`. The first new-engine diagnostic ran **107 checks**: 106 passed and the pending toolkit registration failed. That retained receipt is `quality/round1-diagnostic/semantic-receipt.json`. After integration, all 109 checks passed; the later expanded suite passes **125 checks**, including calculated frames at both supported extreme dates, all twelve historical records, source closure and the Jordan transcription discrepancy.

An independent direct probe found that the core initially accepted declared accessor and nonenumerable properties while the MCP adapter rejected them. The engine owner added an ordinary-JSON descriptor guard before reading any input. The retained suite now rejects both shapes and confirms a getter is never invoked. The QA lane changed no product files. One later QA assertion incorrectly required every historical record to have a nonempty notes array; the notes are optional while the scope and time qualifications are mandatory. That overly broad test was corrected to require the array and mandatory qualifications; both diagnostic receipts remain.

## Round 2 — browser diagnostics

Planned real-browser checks include native timeline keyboard navigation, stale input invalidation, delayed out-of-order completion, cancellation and error recovery, observer edits, historical date/unknown-clock assumptions, real JSON/CSV download parsing, and local storage/provider privacy. Layout checks cover 320, 390, 1440 and 1920 CSS pixels plus a representative fallback font. The named overflow region itself must receive keyboard scrolling. Actual failed receipts and screenshots are retained.

The first 390px run passed 286 checks and retained six actual downloads before a driver selector became ambiguous after a separate historical-source download button was added. The second run passed 372 checks and retained eight downloads before the delay harness exposed its own duplicate event dispatch: Playwright's range `fill` already fires input, so the extra explicit input created additional pending workers. The driver now changes the value and dispatches exactly one event for its deliberate delay experiment. These were driver corrections, not product defects or relaxed thresholds; both failed receipts remain.

The next run completed the 390px interaction journey, including reversed real-worker completion and cancellation, then found a **38px desktop Cancel button** at 1440px. The existing minimum interaction-height assertion was unchanged. The interface owner corrected the desktop rule to 44px. The failed receipt and screenshot are retained in `quality/round2-interaction-corrected/`.

The corrected 390/1440px diagnostic passed **1,011 checks**, retained **22 actual downloads** and reported no runtime, console, transport or external-request errors. The source and drivers were unchanged during this run, but it remains explicitly diagnostic because edits were permitted. It includes stale JSON-export suppression after an input edit, delayed old-frame rejection, cancellation/recovery, native range keys, month-end stepping, observer changes, all named table scroll regions, DST gap/fold handling, family filtering, historical clock assumptions and separate source-record download integrity. All twelve records retain visible scope, reading status, locators and rights; the Jordan 5755/5775 source difference remains visible. Receipt: `quality/round2-product-corrected/receipt.json`.

## Round 3 — held candidate

Held acceptance requires root's freeze, unchanged product and driver SHA256 maps before and after execution, and retained gzip archives of exact downloaded bytes with independent raw/compressed hashes. The harness supports `TIMELINE_OUTPUT=test-results/calendar-timeline` in CI. Browser execution uses the pinned Playwright/Chromium installation and at most two Chromium instances globally.

The first held run passed **2,055 browser checks** and **125 semantic checks**, retaining **44 actual downloads** and **32 screenshots** at 320, 390, 1440 and 1920 pixels. All 505 product files and both independent drivers were unchanged. The product fingerprint was `f3b6cf7d1a12d6a7320ed5480ca8f1bf141a186d623f5a3ce44aa3d67d56972a`. Reopening and decompressing all 44 archives verified every raw/compressed byte count and SHA256: 11,276,272 raw bytes and 1,619,204 compressed bytes.

All 32 screenshots were inspected. The 320px DejaVu fallback view exposed a visual defect missed by the initial geometry assertions: the top “Previous” control split its word across two lines. This run remains intact under `quality/round3-first/`, with the finding recorded in `independent-reinspection.json`. Visual acceptance was held for a correction and a new retained candidate; no numerical or layout threshold was relaxed.

The scoped transport CSS correction passed a second held run with **2,067 browser checks**, **125 semantic checks**, 44 downloads and 32 screenshots. The added assertions require each date-navigation label to fit on one line within its control under both ordinary and DejaVu fonts. Seventeen changed screenshots were inspected directly; fifteen were byte-identical to previously inspected images. All were accepted. This candidate is retained under `quality/round3-transport-corrected/` with product fingerprint `08adb4c79ecc7f8cefa2b16354e007a4fdfecd6744551bae8415182b6cb96360`. Root then reopened only the study-task source metadata to fulfill the repository's literal `source` field contract; the final candidate below binds that metadata.

**Final held candidate: ACCEPT for the bounded timeline software scope.** The final run passed **2,067 browser assertions** and **125 independent semantic checks**, retaining **44 exact downloads** and **32 screenshots**. No runtime/console errors, failed requests, missing local responses, implicit external requests, private-record reads, storage writes or geolocation calls occurred. The receipt reports `pass: true` and `acceptanceEligible: true`. Both source maps contain the same 505 product files, with SHA256 `9e01d3405b84e94b82f9e8484a6deb69b3c5f8caa3d25e3317c976e1262df50a`.

| Independent driver | SHA256 |
|---|---|
| `scripts/browser-calendar-timeline.mjs` | `17650c3f2101a3a627467d592d461334aaf6eff53771e67bf123ded6a0a62b6f` |
| `scripts/tests/calendar-timeline-independent.mjs` | `e18d081cd6f0c740bc5feffafeb3f8f5f6c348049278ce447e5cee8b5b96c62d` |

The environment was Linux x64, Node 24.19.0 / ICU 78.3, Playwright 1.58.2 and Chromium 145.0.7632.6. Platform-font capture confirms Liberation Serif, Liberation Sans and Noto Sans for the ordinary presentation and DejaVu Serif/Sans for the fallback pass. The 320/390px transport correction preserves whole control labels and 44px interaction heights. Chart-side day controls update every instrument while retaining button focus. No remaining visual or functional blocker was found within this review scope.

Independent reinspection decompressed all 44 final archives and verified every raw/compressed byte count and SHA256: **11,355,532 raw bytes**, retained as **1,625,188 gzip bytes**. Historical source downloads retain their full source record and unknown clock, independently of the calculated-frame downloads. The frame exports retain exact observer/clock/method/source metadata and the complete recomputed selected frame. CSV is independently parsed in the browser harness, including all body/cusp numeric values and source records.

Thirty final screenshots are byte-identical to previously inspected accepted views. The two changed views, `tables-320.png` and `unavailable-1920.png`, were inspected directly; their differences concern scrolling/render capture rather than a new product defect. The [final browser receipt](evidence/calendar-timeline/quality/round3/receipt.json), [semantic receipt](evidence/calendar-timeline/quality/round3/semantic-receipt.json), [independent archive/image reinspection](evidence/calendar-timeline/quality/round3/independent-reinspection.json), source maps and immutable driver copies are retained under `docs/evidence/calendar-timeline/quality/round3/`.

Reproduce from the repository root with a fresh output directory so accepted evidence is not overwritten:

```bash
node scripts/tests/calendar-timeline-independent.mjs
PLAYWRIGHT_PKG=/tmp/atlas-ci-playwright/node_modules/playwright/index.mjs \
PLAYWRIGHT_BROWSERS_PATH=/tmp/atlas-ci-browsers \
TIMELINE_OUTPUT=test-results/calendar-timeline \
node scripts/browser-calendar-timeline.mjs
```

Do not set `TIMELINE_ALLOW_EDITS` for an acceptance run. These are independent AI-agent software checks, not screen-reader testing, physical-device testing, human usability research, fresh primary-source verification, historical time-zone validation or predictive validation.

Repository-wide gates, exact-head CI and live publication identity are separate evidence owned by the root integrator.
