# Calendar atlas: methods, sources and five-round review

This is a **new five-round panel task**, starting from `0d115c9` on `feat/mobile-calendar-observatory`. It does not relabel the preceding three-round ensemble as new work. The calendar-method member owns `assets/js/core/calendar-atlas.js`, its focused test suite and this source ledger. These are bounded AI coding/source-review roles, not human tradition experts.

## Round 1 — source investigation and implementation

Read the shared source contract and accuracy-check procedure, the relevant Hebrew, Chinese, Indian national Saka and Coptic profiles, and the Lilly source-work profile. Inspected `compareMoment`, its input normalization and calendar rows, `houses`/`houseOf`, the existing `easter` functions and their inherited selected fixtures. The atlas uses those implementations rather than introducing a second ephemeris or AI-generated calendar arithmetic.

The Round 1 accepted feature set comprised seven family views and 32 named variants: 24 calculated and eight explicitly unavailable at an ordinary supported location/date. **Round 2 adds the sourced solar-term calculation below**, making the ordinary count 25 calculated and seven unimplemented variants. Runtime/calendar availability and polar conditions can change these counts. This is not “all variants of all cultures.”

| Family ID | Calculated methods | Explicitly unavailable atlas methods |
|---|---|---|
| `western` | Gregorian/Julian civil dates; Regiomontanus, Placidus, whole-sign and equal tropical houses; Gregorian/Julian Easter computus; temporal planetary hour | No personal natal or horary judgment is inferred from the moment chart |
| `vedic` | Indian national Saka solar date; sidereal Sun; instantaneous tithi, karaṇa, nakṣatra and nitya yoga; sunrise-bounded vāra | Regional month and festival calendars |
| `egyptian` | Runtime Coptic civil date | Ancient un-intercalated civil-date reconstruction; ancient lunar reconstruction |
| `jewish` | Hebrew civil date | Religious sunset-day date and observance policy; Kabbalistic textual interpretation |
| `chinese` | Chinese lunisolar civil date with leap-month/related-year fields | Four Pillars/BaZi; exact solar-term event times |
| `islamic` | Tabular civil and Umm al-Qura civil dates; selected prayer timetable | Locally observed-crescent religious date |
| `civil` | Thai Buddhist, Persian, Ethiopic, Japanese-era and ROC/Minguo civil displays | No additional regional or religious authority inferred |

All thirteen existing civil displays are preserved. Their validation labels are copied from the canonical rows. In particular, the seven pending independent-display-fixture categories remain pending. A newly arranged atlas view does not upgrade their evidence.

### Stable UI/API contract

```js
import { ATLAS_FAMILIES, ATLAS_VARIANTS, buildCalendarAtlas }
  from './assets/js/core/calendar-atlas.js';

const atlas = buildCalendarAtlas({
  dateISO: '2026-10-29T00:30:00Z',
  lat: 28.6139, lon: 77.209, timeZone: 'Asia/Kolkata'
}, { familyIds: ['western', 'jewish'], variantIds: ['gregory', 'hebrew'] });
```

Input is the canonical explicit-instant/observer contract; `timeKnown:false`, date-only input, missing time-zone offset, unsupported dates or invalid coordinates fail. A source record with no known instant must not be silently converted into this input.

Omitted filters mean all catalogue entries. `familyIds` and `variantIds` intersect when both are present. Unknown IDs, duplicate IDs, unknown option keys and explicit empty/no-overlap selections fail. Returned rows retain catalogue order. The public catalogues are deeply frozen. Returned objects are JSON-safe and do not expose arbitrary caller-supplied metadata.

The return object contains:

- `schemaVersion`, normalized `context` and the fresh canonical `comparison`.
- `families` with selected `variantIds` and selected `rows`; top-level `rows`; selected metadata in `methods`; `selection` with actual family/variant IDs.
- `sources` with resolvable IDs, URLs and actual or explicitly inherited `readingDepth`; `limitations`.

Each row contains `id`, `familyId`, `label`, `kind`, `description`, `method` and `summary` strings; `boundary`, `sourceIds`, `validation`, `limitations`; `status` (`available`, `partial`, `unavailable`); and JSON-safe `result`. Catalogue `implementation` is `implemented` or `unavailable`, distinct from a runtime result's status. Unimplemented historical/interpretive variants return `result:null` and a specific reason. A calculated method whose required horizon events are missing can retain a structured result explaining that unavailability.

The canonical `comparison` remains a full calculation context even for a selected subset; selection controls the atlas's `rows`, not a claim that its shared astronomical inputs become independent or hidden. `comparison.astronomy` retains `sunLongitude`, `moonLongitude`, `moonSunElongation`, `moonIlluminatedFraction` and `phaseLabel` for a shared artistic sky view. Such a sky view is not automatically a tradition-specific calendar.

### Implemented distinctions

House rows call the existing `houses` function and use `houseOf` on the same canonical planetary longitudes. Results expose `requestedSystem`, `actualSystem`, twelve `cusps`, `ascendant`, `midheaven`, `placements` and any warning. At latitude above the engine's 66° Placidus limit, the canonical Regiomontanus fallback remains labelled **partial**, with requested and actual methods separated. It is never presented as a successfully calculated Placidus chart.

Computus uses the observer's selected Gregorian civil **year**, which can differ from the UTC year. It retains both the native ecclesiastical calendar date and the Gregorian correspondence. “Gregorian/Julian computus” is a narrower, reproducible claim than saying all Western/Eastern churches follow one date. Computus, Lilly-style chart study, a personal nativity and a horary question remain different tasks.

Vedic solar and lunar views preserve the linear Lahiri approximation and the existing instantaneous partition rules. They do not rename a sidereal solar position as a regional solar calendar date. Vāra retains the existing sunrise boundary and polar unavailability. Shared Sun/Moon quantities are not counted as several independent confirmations.

Hebrew civil midnight, a religious sunset date and Kabbalistic interpretation have separate entries. The unavailable rows do not reuse a civil date and invent religious or textual meaning. Chinese civil conversion likewise does not synthesize BaZi or exact solar-term instants. Existing letter-study and specialist tools can remain separately linked by the UI.

## Fresh source investigation

Exact response receipts, including failed requests, are retained in [calendar-source-access.json](evidence/atlas/calendar-source-access.json). These requests were executed for this new task. The preceding HKO/CWA date fixtures remain inherited evidence; rereading a general HKO page does not create a new independent fixture set. Full copyrighted pages stay in the workspace; only source metadata, short factual summaries and hashes are committed.

| Source and edition | Actually read | Evidence and implementation consequence |
|---|---|---|
| [UCL Digital Egypt, “The Egyptian–Coptic calendar”](https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/calendar.html), 2003 web exhibit | Full short page: opening paragraph, month-name/Julian-date table, five epagomenal days and intercalary sixth-day note | Describes the Coptic/Alexandrian year as the ancient 365-day structure with an additional day every four years. The table's modern dates are explicitly **Julian**, not Gregorian. Its cited von Beckerath (1980) and Cody (1991:433) works were not retrieved or read. |
| [Encyclopaedia Britannica, “Egyptian calendar”](https://www.britannica.com/science/Egyptian-calendar), editors; updated by Teagan Wolter; current web article | Selected civil/lunar calendar paragraphs and final reform paragraph | Independently describes twelve 30-day civil months plus five extra days and distinguishes historical lunar reckoning. No ancient conversion epoch or modern equivalent-date fixture is supplied by the passages read. |
| [Hong Kong Observatory, “The Chinese Agricultural Calendar (Nongli)”](https://www.hko.gov.hk/en/gts/time/calendarinfo.htm), current explanatory webpage | Lunar/solar/lunisolar definitions, new-moon and leap-month paragraphs | Supports explaining a lunisolar calendar as distinct from a solar-only or lunar-only model. Does not supply a BaZi implementation or an exact event-search fixture. |
| [Hebcal HDate API reference](https://hebcal.github.io/api/hdate/classes/HDate.html), current generated documentation | Class description and constructor/conversion section, including the 15 Cheshvan 5769 example | The documented `Date` constructor uses local Gregorian date fields and ignores the time fields. The atlas does **not** import that library or copy this device-local behavior: it preserves the canonical explicit-IANA `Intl` conversion. Documentation is not a Kabbalistic source or religious sunset computation. |

**Agreement and divergence.** UCL and Britannica agree on the ancient 365-day civil structure and its distinction from lunar reckoning. Their compressed reform narratives differ: UCL dates the Alexandrian civil-year adoption in Egypt to 30–26 BCE; Britannica's final paragraph attributes a leap-year alteration to Julius Caesar around 46 BCE. The atlas encodes neither adoption chronology and does not silently combine these accounts. A named ancient reconstruction would additionally need a justified epoch/era, historical/astronomical year numbering, drift/intercalation policy and independently anchored conversion examples. No such epoch was established here, so the ancient numerical entries stay unavailable. The existing Coptic runtime date remains useful without being passed off as that reconstruction.

Fresh USNO calendar, Easter and calendar-chapter requests returned HTTP 503. The inherited USNO examples retain their original source qualification; they are not described as freshly retrieved. A St Andrews calendar URL returned 404. The UCL chronology index was fetched for discovery, not accepted as an independent conversion anchor. Source failures and divergent accounts are retained rather than replaced with guessed formulas.

## Round 1 acceptance checks

`node scripts/tests/calendar-atlas.mjs` — **53 checks passed** on Node 24.19.0 / ICU 78.3 / tzdata 2026b.

Checks exercise the complete thirteen-calendar inventory, resolvable source/reading-depth records, explicit unavailable distinctions, seven unchanged pending fixture categories, subset/intersection semantics, malformed and untimed inputs, host-zone invariance, house-system geometry/fallback disclosure, before-sunrise vāra, the inherited USNO 2010 Easter coincidence and Julian native date, observer-year computus at the international date line, and rejection of caller-supplied forged/private output fields. This suite tests core behavior; it does not claim browser, deployment, human tradition or new broad-range numerical validation.

## Round 2

**ACCEPT for this member's reviewed scope.** The moderator assigned independent review of personal-calendar inputs/returns and the atlas MCP wrapper, and authorized implementing Chinese solar terms only if the source checks supported it.

### Independent personal-calendar and MCP review

Found and reported a half-open unknown-birth-day issue: the validation checked the final included millisecond, but sampling included the exclusive endpoint. An unknown birth on `2100-12-31` in `UTC` therefore sampled `2101-01-01T00:00:00Z`. The personal-calendar owner changed both the canonical sampled-position call and the explicit tropical/sidereal samples to end at `end − 1 ms`, retained the true `endUTCExclusive`, and added `sampleEndUTC`. Inspected and accepted the correction. Unknown-time records still withhold houses, ascendant, Vimśottarī and exact returns. Their sampled envelopes remain estimates rather than certified extrema.

Verified recorded-time DST ambiguity/gap rejection, civil-versus-UTC birth-year boundaries, signed degree units, the distinction between a solar return in the selected UTC year and a next lunar return after the selected instant, and default personal-export omission. No new numerical ephemeris certification is claimed.

A peer review correctly identified that the atlas's internal full `comparison` was being serialized beneath a selected-method export. Added **`exportCalendarAtlas(input, options)`**: it recomputes the report, omits `comparison`, retains only selected family/variant result blocks and their recursively referenced sources, and includes an explicit `sharedAstronomy` object for the shared sky plate. That object contains Sun/Moon longitudes, elongation, illumination, broad phase, its source ID and a scope label; it contains no unselected tradition, calendar or prayer reading. Internal `buildCalendarAtlas` remains unchanged for the UI's calculation context. The UI and root's MCP tool now use the selected-export helper.

The MCP wrapper was independently checked against the helper with `Egyptian` prayer method, `Hanafi` Asr and `SeventhOfTheNight` high-latitude convention. It forwards all three controls, rejects private/unknown request fields and preserves selected-only result scope. No saved birth data, provider call or hosted MCP deployment is implied.

Actual independent review receipt: [calendar-review-round2.json](evidence/atlas/calendar-review-round2.json), **20 checks passed**, no remaining failures. Executed suites after correction: **87 atlas checks**, **11 personal-calendar groups**, **9 MCP-toolkit groups**, all passed. Transport and browser gates are the lead/QA members' separate evidence, not claimed as run by this member.

### Sourced 24-term event calculation

Freshly retrieved and read [HKO's “The 24 Solar Terms”](https://www.hko.gov.hk/en/gts/time/24solarterms.htm), especially **Table 1** and its angular definition. It explicitly supplies all 24 English names, the 0° vernal-equinox origin, successive 15° longitudes and alternating major/minor columns. This table supports event definitions; its simplified lunar-month summary and zodiac discussion were not converted into additional calendar or BaZi rules.

Freshly retrieved [Taiwan CWA's 2026 calendar data](https://www.cwa.gov.tw/Data/astronomy/2026cal.pdf), **page 2, 一、節氣**, published February 2025. Read all 24 rows and visually inspected the rendered page. The table explicitly uses Taiwan time, UTC+8, and supplies Chinese names and minute-resolution times. Separately retrieved and visually inspected [HKO's 2026 English conversion table](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2026e.pdf); all 24 date-level entries in its Solar Terms column agree with the CWA dates. HKO and CWA are distinct issuing authorities; the HKO table supplies days, not independent minute-level times.

| Newly read source | SHA-256 of fetched bytes | Actual evidence |
|---|---|---|
| HKO 24-term webpage | `2bf78b365fd8e53ae52c36560fc7d46114fe4a6403861824ecd1ef54b234e62f` | Names, angles and major/minor classification |
| CWA 2026 PDF | `88a8ab2a59e7ca51835820ab7b56a71b816299972ba8a970a4cb164ac56a043b` | All 24 UTC+8 minute fixtures and Chinese names |
| HKO 2026 PDF | `f74b6da727e8025896b8c370f45a9f9da935aa48604680381bd5cf22bb525224` | Independent issuing-authority day-level comparison |

The existing `chinese-solar-terms` variant now calls the vendored Astronomy Engine's **`SearchSunLongitude`**, whose implementation and API comments were inspected. It computes crossings of apparent geocentric tropical longitude; it uses twenty-day consecutive brackets rather than asking the rootfinder to search an excessively wide year at once. The first target after January 1 is derived from the engine's solar longitude. The result provides 24 events for the selected instant's **Hong Kong reference year**, their UTC instants, `Asia/Hong_Kong` dates/times, selected-observer dates/times, and the strictly next event. Annual grouping and observer dates are explicitly different fields. Historical reference-clock offsets follow the runtime's IANA time-zone data; they are not uniformly UTC+8. The selected 2026 published fixtures specifically use UTC+8.

All 24 2026 calculated times are compared with the independently published CWA minute rows, using a **two-minute selected-fixture tolerance**; the maximum observed absolute difference was **60.316 seconds**. Their Hong Kong reference dates match all HKO entries. This does not establish full-range accuracy or millisecond physical accuracy: retained milliseconds are solver output. The engine's own small root-search tolerance is not an uncertainty estimate for the underlying astronomical model.

Tests also cover the next event when the selected instant equals a computed event; crossing into the next reference year; withholding a 2101 next event while preserving the 2100 annual list; a Hong Kong reference year outside the supported range; and an equinox whose UTC+8 date differs from the selected observer's date. The annual list remains bounded to 1900–2100. BaZi, lunar-month assignment, regional observance and a claim to calculate all Chinese variants remain absent. **The seven inherited civil-display validation gaps are unchanged**, independently of the number of unimplemented atlas variants.

The selected sources, complete fresh-access receipts and failed alternate HKO URL are included in the updated source-access JSON. No full book was newly read or claimed.

## Round 3

**ACCEPT after corrections.** Independently challenged the search/statistical-method member's candidate, then executed **35 bounded checks** against the corrected held files. [calendar-review-round3.json](evidence/atlas/calendar-review-round3.json) records the actual cases, outcome and hashes. This was a separate review of small requests, not a whole-range scan or a claim of statistical/predictive validity.

Two confirmed defects were sent to the owner and corrected:

1. At an exact geographic pole, a full canonical comparison could not define houses. The reference search threw that error, while a cheap false weekday criterion let the optimized path return an apparently successful empty result. The common observer normalizer now rejects both poles before either strategy or event-study path runs. Verified both signs and both search modes.
2. Association analysis accepted a rule target of `unavailable`, while also excluding unavailable rules from observed denominators. Such a target could never be an observed match, making its zero frequency misleading. Association now rejects both pure and mixed unavailable-target lists with an explanation. Ordinary date search retains the useful ability to find explicitly unavailable states. Verified both behaviors.

The owner's additional Chinese-field correction exposes `relatedYear`/`yearName` explicitly instead of accepting a missing Chinese `year` field. Verified related-year plus leap-month filtering and rejection of the unsupported field. Missing-calendar-field accounting is separate from an unavailable local sample; the implementation records it before early rejection.

Optimized/reference equality was checked at Tokyo's lower UTC-year edge, Honolulu's upper UTC-year edge, a New York repeated clock, Lord Howe's half-hour gap, Apia's skipped civil date, the 2025 Chinese leap month and a new-moon angular wrap. All matched, including unavailable-sample counts.

Reconstructed the new capped rank independently from an uncapped 21-day reference scan's **raw rule rows**, using a Jyotiṣa caution count. The retained top three matched descending known count and chronological tie-breaking; all candidate identities and total match counts remained equal between strategies beyond the retained cap. Checked total/available/unavailable rule denominators and the retained shared-lunar-input warning. This is a count within one selected tradition/class, not a cross-tradition goodness score or ranking of outcomes.

For a synthetic three-event set containing two distinct records on the same Thursday and one Friday, a Thursday criterion gives 2/3 event matches. Its six ±1-day control rows give 1/6 matches, four unique control dates and two control dates overlapping the event dates. The implementation retained those event-weighted denominators, per-offset paired denominators and the undefined ratio for zero control frequency. An out-of-range control remained missing, not a non-match. No p-value or randomized-control interpretation was added.

Finally checked direct/public MCP equality and selected-only payloads for solar-term years 1900, 2099 crossing into 2100, the partial 2100 list with next event withheld, and the unavailable Hong Kong reference year 2101. The public responses contain no internal full comparison or birth record. Reviewed search core hash: `a4799ab46d4265aaec962db9748c12f3206f6ae91f989968084a9b20c3acc7ae`. Atlas code remains unchanged from Round 2; no browser or future-round review is claimed here.

## Round 4

**ACCEPT after one precision clarification.** Independently reviewed the integrated atlas's calendar/solar-term presentation and executed **38 bounded Node checks**, all passing. [calendar-review-round4.json](evidence/atlas/calendar-review-round4.json) records the actual cases, source-byte verification, runtime and held hashes. The focused atlas suite also passes **90 checks**. No broad gate or new source retrieval was run by this member in this round.

Found a qualification error in this ledger: it described the `Asia/Hong_Kong` reference clock as UTC+8 throughout the supported range. The existing code correctly follows historical IANA offsets, which include local mean time and summer time. With moderator approval, corrected this prose and added a visible sentence to the solar-term precision note. The convention, public API and numerical results remain unchanged; the selected 2026 published fixtures use UTC+8. Added behavior regressions for the 1950 Hong Kong summer-time offset, per-event London daylight-saving offsets and invariant UTC events across observers. These are runtime-policy checks, not newly sourced historical or astronomical accuracy fixtures.

The independent probes compare displayed event clocks with explicit offset arithmetic for London, New York, Lord Howe, Chatham and Kathmandu around March/April changes, including half-hour and quarter-hour offsets. They verify that all 24 UTC instants stay identical across observers; that the observer's annual computus year can differ from the Hong Kong solar-term reference year; that the 2100 annual list remains partial when its next event is withheld; and that Hong Kong reference year 2101 is unavailable even while the selected New York civil year is 2100. Polar sunrise-dependent methods remain unavailable, the Placidus fallback remains partial with requested/actual systems distinguished, and geocentric solar terms remain calculated.

Inspected `renderOne`, `renderRows` and `renderSources` in the held atlas app: the table uses the core's UTC, reference and observer fields directly; method/validation, source links and unavailable states are preserved. Separately **viewed the desktop member's actual [Round 4 Chinese-table screenshot](evidence/atlas/round4-solar-london.png) and read their [25-check browser receipt](evidence/atlas/round4-desktop-flow.json)**. Its March 20 and April 4 rows agree with the independent core probes and expose London's changed offset; its recorded New York upper-year case visibly explains the unavailable Hong Kong year. That browser was executed by the desktop member, not this reviewer. Their receipt asserts the original numerical qualification; the newly added historical-clock sentence was checked in the current source mapping and is not retroactively attributed to that earlier browser assertion. Subsequently inspected QA's [final 1440px screenshot](evidence/atlas/round4-integration/solar-terms-1440.png), which visibly includes the historical-clock sentence, and the four corresponding passing width assertions in the [final integration receipt](evidence/atlas/round4-integration/receipt.json). That final browser gate belongs to QA; this member did not rerun it.

Retained source bytes still match all seven freshly checked source records. No source-reading depth, independent-authority claim, selected-fixture tolerance or any of the **seven pending civil-display fixture categories** was promoted. Held atlas core: `917ff26c071b78a665cea9bdf145abd584cb8b2f2fbf5a7203099e91a25d62f6`; tests: `b173bc215d73f14d4648abe85177d597f7aba004fd958ad4fec1df5f6a7455e6`; app inspected: `614dfd5654e334ef24990a896232dae4e379995ae0fc5d91a46234c9bfe4eba8`.

## Round 5

**ACCEPT for the calendar member's frozen scope.** Per the formal final-round instruction, performed a read-only artifact, source-limit and handoff review; no new numerical suite, external retrieval or browser run was executed by this member. [calendar-review-round5.json](evidence/atlas/calendar-review-round5.json) records **16 passing artifact checks** and the exact evidence hashes.

The held core, tests, app, style, Chinese route and source-access receipt match this member's Round 4 review. QA's designated [Round 5 receipt](evidence/atlas/round5-final/receipt.json) records 612 successful assertions, 85 downloaded artifacts and no source drift, runtime errors, missing resources or external requests. Verified its receipt/driver binding and all 446 product-manifest entries against Round 4. Read the final four-width assertions for the 24-event table, historical-clock qualification, selected-only serialization and visible reading depth. The final solar-term screenshot is byte-identical to the final Round 4 image actually viewed by this member. This is evidence inspection of QA's browser run, not a second browser execution or an independent numerical proof.

README and HANDOFF preserve the seven-family/32-variant scope, ordinary 25 calculated variants, seven unimplemented variants and separate seven pending civil-fixture categories. The selected public export still excludes the internal full comparison and private birth records. Source passages and source-access failures remain bounded to the actual reading recorded above. In particular, the 2026 CWA minute fixtures and HKO day-level table do not validate every supported year; runtime time-zone regressions do not become independently sourced historical assertions. No full-book reading, authentic cultural transmission, predictive efficacy, hosted-service deployment or production publication is implied by this acceptance.
