# Six-member ensemble: calendrical precision

Executed 2026-10-29 by the calendrical-precision coding agent, member 1. This is an AI code/source review, not human calendrical or religious certification. Baseline: `3be3d464a718d4562d3d1eb0254f90b706a7327f` on `feat/mobile-calendar-observatory`. The three rounds below record actual work separately; later rounds are not presumed complete.

## Round 1 — inspect, source-check, implement

Applied the repository shared source contract, calendar-method-reviewer template, accuracy-check procedure and Chinese, Julian, Islamic-civil and Persian family profiles. Inspected the canonical calendar, civil-calendar, observatory and time modules and their tests. No new calendar engine, regional observance rule or predictive interpretation was added.

**Confirmed defect.** `calendarAtInstant` checked the UTC year but not the observer's Gregorian civil year. At `1900-01-01T00:00:00Z` in `Pacific/Honolulu`, it returned Buddhist December 31, 2442 BE (Gregorian 1899). At `2100-12-31T23:30:00Z` in `Pacific/Kiritimati`, it returned January 1, 2644 BE (Gregorian 2101). Both conflict with the direct API's declared 1900–2100 range, and with the existing `compareMoment` guard. The accepted change validates both years before returning a calendar display. The public signature and successful result schema are unchanged. Regression checks reject both cases and retain valid adjacent instants.

**Selected fixture improvement.** Added four manually transcribed, independently published UTC+8 Chinese lunisolar dates around the 2025 leap sixth month. They are compared with the `Intl` output in `Asia/Hong_Kong` and `Asia/Taipei`, retaining the leap-month label and `relatedYear`; two additional checks exercise the July 24/25 civil-midnight transition at `2025-07-24T16:00:00Z`. Civil midnight is this API's declared display boundary, not a statement that the astronomical new moon occurs then.

| Gregorian date | Lunar month | Day | HKO / CWA agreement |
|---|---|---:|---|
| 2025-07-24 | Sixth, regular | 30 | Both explicitly list it |
| 2025-07-25 | Sixth, leap | 1 | HKO Chinese edition says 閏六月; CWA says 閏6/1 |
| 2025-08-22 | Sixth, leap | 29 | Both explicitly list it |
| 2025-08-24 | Seventh, regular | 2 | Both explicitly list it |

The fixture is `scripts/tests/fixtures/chinese-leap-month-2025.json`; its expectations originate in the source tables, not values generated from the tested engine. The English runtime spelling may use “bis” or “leap”; the test allows these labels while requiring the correct numbered month and day. We chose August 24 because CWA's August 23 cell prints a solar-term name in place of its lunar date. HKO directly supplies August 23 = seventh month day 1, but that was not represented as a directly matching two-table cell.

## Sources actually accessed and read

Receipts, including unsuccessful discovery attempts, are in [calendar-source-access.json](evidence/ensemble/calendar-source-access.json). SHA-256 values identify the exact fetched response bytes. HTML method documentation is not an independent date fixture. Protected full PDFs/pages and rendered source images remain in the cloud workspace; the repository contains citations and small factual transcriptions only.

| Source / edition and locator | Actual reading depth | Use and limits |
|---|---|---|
| [Hong Kong Observatory, 2025 Gregorian–Lunar Calendar Conversion Table](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2025e.pdf), one-page English PDF; SHA-256 `2fd4da167d25c376809888bfee0da74dcc01e66822afd8bd9ee803e2f8373f54` | Extracted text and visually inspected rendered table, especially June–August and legend | Selected date fixture. The English repeated month is clarified by its Chinese edition. |
| [HKO, 2025 公曆與農曆日期對照表](https://www.hko.gov.hk/tc/gts/time/calendar/pdf/files/2025.pdf), one-page Chinese PDF; SHA-256 `4037b1060e379c3f554408f6ab2aae4319707e3db7ae50febec068c6b9e8f87b` | Extracted text and visually inspected rendered July row with 閏六月 | Same issuing authority as the English table, not a second independent authority. |
| [Taiwan Central Weather Administration, 中華民國114年日曆資料表](https://www.cwa.gov.tw/Data/astronomy/2025cal.pdf), 2025, page 1 July/August grids; SHA-256 `785f9ea9465f5508d723a1b83bf7df1bc65fa3a8798709f9688ed553d7f356fb` | Extracted text; visually inspected page 1; read page 2 UTC+8 time convention and selected phase rows | Second issuing authority, independent of this implementation. Explicitly marks leap sixth month. This does not prove its astronomical calculations are independent of all other almanac sources. |
| [HKO, The Chinese Agricultural Calendar (Nongli)](https://www.hko.gov.hk/en/gts/time/calendarinfo.htm), current webpage; SHA-256 `9e5e3fd0e2a9c579c925390ec9fd15f552f476103673be2bf8ae1382db9476cb` | Read explanatory paragraphs on lunisolar structure, new moons and leap months | Supports preserving lunar/solar distinctions. Not a third independent dated table. |
| [Unicode ICU User Guide, Calendar](https://unicode-org.github.io/icu/userguide/datetime/calendar/), current webpage; SHA-256 `79f4798a1cfd5e6484a598d8aa43243a53ca855b60f9c334080e35f7c1788293` | Read “Representation and Conversion” and “Context Management,” inspected supported-calendar overview | Explains UTC instant versus calendar/time-zone field context. Runtime method documentation, not independent astronomical accuracy evidence. |
| [National Diet Library, The Japanese Calendar — Calendar History 1](https://www.ndl.go.jp/koyomi/e/history/index.html), web exhibition; SHA-256 `8e36a850c83bb58393df32631ac14a3028d2d3ddaeac7c3aa5e3c4f6ab88a719` | Read opening “The Source” passage and its Nihonshoki bibliographic entry; inspected page for modern-era date evidence | Historical context only. No original chronicle or full book was read; no Japanese-era fixture was accepted from this page. |

Discovery limits: the attempted USNO Islamic page and Fourmilab page returned HTTP 503; attempted Kantei/Reiwa pages returned 404. Google returned challenge pages; Bing returned unrelated results. These responses are not evidence of the requested calendar facts. The CWA calendar-index and year-PDF guesses returned 404; the cited `2025cal.pdf` succeeded. No block or challenge was bypassed.

## Executed acceptance evidence

Round 1 on Node `v24.19.0`, ICU `78.3`, tzdata `2026b`:

- `node scripts/tests/cultural-calendars.mjs` — **80 checks passed** (58 baseline plus 4 range and 18 selected leap-month/zone checks).
- `node scripts/tests/calendar-observatory.mjs` — **59 checks passed**.
- Reviewed source PDFs using `pdftotext -layout` plus actual rendered-image inspection; no PDF parsing package or new runtime dependency installed.

This is selected conversion evidence, not exhaustive 1900–2100 validation or proof of observance/predictive validity. The existing seven runtime calendar families with pending independent fixtures keep that status. Existing historical release evidence is unchanged. Browser compatibility and the integrated release gate remain separate lead-run checks.

## Round 2 — independent cross-review

The moderator assigned this member to independently review the new `comparison-evidence` core and app components, owned by the source-connections member. On 2026-10-29 at 23:01:03 UTC, **53 focused checks passed**. The [JSON receipt](evidence/ensemble/calendar-review-comparison.json) contains exact file hashes, cases, results and the observed numerical boundary issue. This is internal numerical/canonical-engine comparison, not independent ephemeris verification.

Checks cover 0/360° wraps; exactly representable 6°, 12° and 45° partition boundaries; points ±10⁻⁸ degrees from a 27-part arc boundary; full-precision Sun/Moon frame-transform residuals; canonical tithi, karaṇa, nakṣatra and yoga indices; six observer/time cases; civil versus sunrise days; polar unavailability; and both New York DST-fold instants. Delhi at 2026-10-29T00:30Z is civil Thursday but retains Wednesday's sunrise-bounded vāra; at 09:00Z its vāra becomes Thursday. The report preserves that difference rather than calling it disagreement between predictions.

**Finding and correction accepted.** `explainLunarPartitions(0, 360/27, 0)` and the canonical `nakshatraOf(360/27)` both return index 1 rather than ideal mathematical index 2; a similar machine-precision case occurs at `4*(360/27)`. This comes from inherited floating-point normalization. The new explanation initially described ideal half-open intervals without explaining how rounded printed endpoints and machine arithmetic can differ. The owner added `lunarBoundaryPrecisionNote` to the exported report and to the visible five-formula disclosure. Inspected and accepted that correction. No tolerance snapping or silent change to the canonical algorithm was requested or introduced.

Reviewed code explicitly limits zero frame residuals to an internal identity, calls linear Lahiri an approximation, separates dependent lunar derivations, and declines historical-transmission or equivalent-cultural-meaning claims. No false independence or new authentic-tradition claim was found. Source book passage-reading claims remain the source owner's evidence; this review did not pretend to reread those books.

Reviewed hashes: core `10ce5451c758941715158e300b5d5445e524a4af33dc6aff0ae6c7da68d5ab21`; app `16dc95119f70ae3f22022df50c91f0db0ce9bdc52c4c356b212c49c26e3deb7b`. Later owner edits require the integrated release gate; these hashes identify this review's actual scope.

## Round 3 — final review

**ACCEPT** for the reviewed calendar and numerical dependency-boundary scope. Per the moderator's formal final-round instruction, re-inspected the held calendar diff, the dependency core and visible precision-note integration, and executed the final narrow checks:

- `node scripts/tests/cultural-calendars.mjs` — **80 passed**.
- `node scripts/tests/calendar-observatory.mjs` — **59 passed**.
- `node scripts/tests/comparison-evidence.mjs` — **44 passed**.

The [final-round receipt](evidence/ensemble/calendar-round3.json) records execution time, final code/test hashes and hashes recomputed from the three frozen downloaded source PDFs. All three match their original access receipts. The calendar code and fixture hashes remain unchanged from Round 1; the dependency core remains unchanged from the accepted Round 2 correction. Its app now also contains the owner's separately reviewed focus-preservation fixes, while retaining the inspected numerical-boundary note. No browser review was run by this member in Round 3.

Confirmed the current runtime still labels these **seven** independent-display-fixture gaps explicitly: `islamic-civil`, `islamic-umalqura`, `persian`, `coptic`, `ethiopic`, `japanese`, `roc`. Chinese selected fixtures remain a bounded category, with runtime dependence and incomplete full-range coverage. Source reading consists of the named table rows, rendered tables and selected documentation passages above, not whole books or original-language tradition expertise. Civil labels do not establish religious observance; numerical agreement does not establish predictive validity. Exact lunar-limb end-time searches and full regional Pañcāṅga remain outside the implementation.
