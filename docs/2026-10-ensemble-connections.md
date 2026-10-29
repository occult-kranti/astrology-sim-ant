# Calculation connections and source differences

Baseline: `3be3d46`, branch `feat/mobile-calendar-observatory`. This is the comparative-traditions/source member's contribution to the new six-member, three-round panel. The component explains existing calculations; it adds no new astronomical engine, historical rule, calendar authority or empirical correlation.

## Round 1: finding, decision and contract

The existing comparison already distinguished calendar conventions in prose, but did not expose numerical frame residuals or the shared dependencies behind phase, tithi and karaṇa. Counting those three labels as independent agreement would count one elongation repeatedly. A calendar label, a prayer schedule and a historical electional rule also answer different questions.

Read the shared observatory source contract, Indian calendar profile, Lilly, Agrippa and Muhūrta work profiles, accuracy skill, existing astronomy/sidereal/calendar/day-guidance code, existing source ledger and design brief. The inherited Muhūrta numeric classifications remain secondary summaries pending primary-passage collation. This work did not claim to read an entire book or add classifications from a title or catalogue entry.

The implementation provides:

- `buildComparisonEvidence(inputOrComparison)` in `assets/js/core/comparison-evidence.js`. Accepts the explicit `compareMoment` input or its `{context}` snapshot. Rebuilds from the validated context and ignores imported derived positions, names or scores. The result has `schemaVersion: 1`, `frames`, `sharedLunarGeometry`, `quantities`, `graph`, `boundaries`, `sourceDifferences`, `sources` and `limitations`.
- Actual tropical and sidereal Sun/Moon coordinates, the canonical full-precision linear Lahiri estimate, and circular residuals. The displayed four-decimal offset is not reused as if exact. Zero residual means internal algebraic consistency, not independent ephemeris validation.
- Five formula disclosures: eight centered phase sectors, 30 tithis, 60 half-tithi slots, 27 equal-arc nakṣatras and 27 nitya-yoga intervals. Tithi/karaṇa use the same longitude difference; nakṣatra depends on the chosen sidereal origin; yoga uses the angular sum and twice the offset.
- A 16-node/18-edge exportable dependency graph, presented as five readable transformation paths and formula disclosures. Edges indicate calculation or convention, not influence or cultural transmission. Civil-midnight, sunrise and prayer-method boundaries remain distinct.
- `mountComparisonEvidence(container, initialInput)` in `assets/js/app/comparison-evidence.js`, returning `update(inputOrComparison)`, `update(null)` and `destroy()`. It makes no external request and uses text nodes. Native disclosure state survives a minute refresh for the same observer/method; stale clear, error, changed observer or destruction resets it. The parent mounts it in comparison and a lazy homepage disclosure.

## Source reading ledger

Fetched through the existing permitted network configuration on 2026-10-29. Full downloaded HTML and retrieval receipts remain outside the repository in `/workspace/setup-validation/ensemble-connections-sources/`. Only bounded paraphrases and access metadata are incorporated here; modern editorial material is not republished wholesale.

| Source | Actual access and reading depth | Consequence and limit |
|---|---|---|
| [Agrippa, Book II, chapter 34](https://esotericarchives.com/agrippa/agripp2c.htm#chap34), 1651 English “J.F.” translation; Joseph H. Peterson digital edition | HTTP 200 at `2026-10-29T22:51:00.007602Z`; 105914 bytes; SHA-256 `3b2a63d41c2b54196e94305bbc0bd361568d846cba6ea5d650e7738c3e306608`. Read chapter 34, including both the temporal division and ascensional alternative. | The passage describes twelve divisions of daylight and twelve of night, and also reports a method using 15° of ecliptic ascension and regional oblique ascension tables. Only the temporal method is implemented. No ascensional result, ritual efficacy, settled translator identity or full-book reading is asserted. |
| [Lilly, Christian Astrology](https://en.wikisource.org/wiki/Christian_Astrology), 1659 second edition, John Macock | HTTP 200 at `2026-10-29T22:51:00.023177Z`; 472719 bytes; SHA-256 `86322ad09836088fca055da930b798892978b47aad75d464148cf11fab2e2d57`. Read title page, relevant opening of “To the Reader”, and Book I figure-erection instructions at pp. 32–33. | The title distinguishes introduction, questions and nativities; the instructions use year/month/day/hour, ephemeris and house tables. The page explicitly warns of imported, unproofread OCR. The title says second edition; the site's contradictory “First published” metadata is not adopted. No scan collation, 1647-text substitution or fresh numeric-threshold verification is claimed. |
| [ICU calendar services](https://unicode-org.github.io/icu/userguide/datetime/calendar/) | HTTP 200 at `2026-10-29T22:50:59.767595Z`; 63860 bytes; SHA-256 `79f4798a1cfd5e6484a598d8aa43243a53ca855b60f9c334080e35f7c1788293`. Read Overview, Representation and Conversion, and Context Management. | UTC instant representation is distinct from calendar/time-zone context and displayed fields. This is technical documentation, not religious authority. Outdated locale-default examples are not treated as fresh current policy. |
| [USNO Moon phases FAQ](https://aa.usno.navy.mil/faq/moon_phases) | HTTP 503 at `2026-10-29T22:51:04.579082Z`. No response body read. | Not used as a freshly verified source. Existing implementation formula and its explicit broad-sector scope remain the evidence for this component. |

The source comparison concerns what the selected passages actually ask and which method is implemented. It does not establish historical transmission between authors or equivalence of cultural meaning. Optional user reflections elsewhere in the product remain separate from source quotations and calculated quantities.

## Round 1 executed checks

`node scripts/tests/comparison-evidence.mjs` initially passed 43 checks. The test covers deterministic explicit input; range fixtures in 1900, 2000, 2024, 2026 and 2100; full-precision frame residuals; canonical partition matches; 0°/360°, 6°, 12°, 22.5° and 180° boundaries; changing ayanāṁśa; observer independence of geocentric quantities; before-sunrise weekday distinction; polar unavailable states; poisoned imported output; graph/source resolution; and invalid/implicit/out-of-range input.

These are regression and internal-consistency checks. They do not extend the existing independent astronomical or calendar fixture coverage.

## Round 2: independent review and corrections

The calendar member found a meaningful precision edge: normalization of exactly `360/27` in JavaScript can place it just below the ideal mathematical boundary, and the inherited canonical helper behaves the same way. This inspector must not silently fix one side of an existing calculation or claim rounded endpoints are exact transition times. Added `lunarBoundaryPrecisionNote` to the export and the five-formula disclosure, documenting rounded endpoints and machine-precision behavior. Added a regression against the canonical `nakshatraOf` helper. The focused suite now passes **44 checks**.

This member independently reviewed the event-comparison candidate: core SHA-256 `89a2a7156dddea5dbcd0dab4a8dcb1915d5a01966aeac78c08e02fbe8eabc533`, app `95bd89c3e559ec3bd585ba5d48cbb0c4a8b500d220e3136c9a2603fe831a14ce`, source ledger `d47e4caebad6b2a175c44705594de9b2f899555e13182121a51bb8945b72ced7`. `node scripts/tests/world-events.mjs` passed 84 checks. The implementation explicitly uses shortest signed angular displacement, not accumulated lunar travel; preserves chosen noon sample versus unknown event timestamp; keeps civil labels separate from agreement; and does not equate two unavailable hour labels. Its Agrippa chapter 34 reading agrees with the independently read passage above. The RFC 5545 ledger confines its reading to date/date-time and event-boundary semantics, consistent with the separate date-only ICS export.

Requested two bounded event wording corrections: describe phase sectors as **centered** 45° sectors, and call generated differences **calculated differences** rather than measurements. No invented event outcome, empirical correlation or historical rule was found in that candidate.

The calendar member independently passed 53 focused checks after the precision correction, including exact representable lunar boundaries, nearby 27-arc boundaries, six observer/time cases, Delhi sunrise, polar absence, New York's fold and Hong Kong midnight. Receipt: `docs/evidence/ensemble/calendar-review-comparison.json`; reviewed core SHA-256 `10ce5451c758941715158e300b5d5445e524a4af33dc6aff0ae6c7da68d5ab21`.

The UX member found two material browser issues, independently reproducing the mobile issue in this member's focused browser run. At 390 px, a rotated arrow inherited the full grid-column width and its 326 px transformed hitbox intercepted the following disclosure. The arrow now has a bounded 22 px width, is centered, cannot intercept pointer events, and is hidden from the accessibility tree as decoration. A live same-observer refresh preserved open disclosures but dropped keyboard focus to the body. The component now restores the focused logical disclosure summary or source link with `preventScroll` after a valid same-context refresh; a stale clear or changed observer does not restore old focus. The original failure and independent bounds/focus evidence remain in `docs/evidence/ensemble/round2-candidate/receipt.json` and `docs/evidence/ensemble/round2-independent-review.json`.

After those corrections, the focused Chromium browser pass completed **53 checks** at 320, 390 and 1365 px under `/astrology-sim-ant/`. It exercised real map/formula clicks, expanded reflow, visible precision qualification, every local source link, native open-state and nested-summary focus retention across a minute update, changed-observer/null/error clears, recovery and destruction. There were no browser JavaScript errors or automatic external requests. The 390 px screenshot was inspected. Receipt and image: `/workspace/setup-validation/ensemble-connections-sources/browser-receipt-final.json` and `comparison-390.png`; the parent retains the shared integration receipts in the repository. Corrected app SHA-256 `b8937d233f932695e38c1ea0f3101d38c289bdd9ad1be74e80eec3377905e165`; CSS `e6dc67baa00d678d9a7fe2bedc73e4253d6fe2e36849cf57ebef3890f5f4c6b7`.

Event owner corrections were independently checked: core `80ddeadec1c64ddeced6795d537dfa9a39c3b64581ab6354a6d8f44054582c81`, app `3425f461395cdefc23cb13bdb471f8d9f756caae06c156c49f845587616df6f8`; the two requested phrases are corrected and the event suite still passes 84 checks.

## Round 3: held-candidate acceptance

**ACCEPT** for the bounded calculation/source comparison and the independently reviewed final event-comparison semantics. No unresolved blocking defect was found in this member's scope. Re-read the held dependency formulas, snapshot reconstruction, UI state restoration, source/edition qualifications and final event arithmetic/rendering after the Round 2 fixes. Re-executed `node scripts/tests/comparison-evidence.mjs` (**44 passed**) and `node scripts/tests/world-events.mjs` (**84 passed**). No additional browser session was started in this round; the experience member owns the full final integration pass. The corrected focused browser evidence above remains 53 passing checks against unchanged component code.

| Held file | SHA-256 |
|---|---|
| `assets/js/core/comparison-evidence.js` | `10ce5451c758941715158e300b5d5445e524a4af33dc6aff0ae6c7da68d5ab21` |
| `assets/js/app/comparison-evidence.js` | `b8937d233f932695e38c1ea0f3101d38c289bdd9ad1be74e80eec3377905e165` |
| `assets/css/comparison-evidence.css` | `e6dc67baa00d678d9a7fe2bedc73e4253d6fe2e36849cf57ebef3890f5f4c6b7` |
| `assets/js/core/world-events.js` | `80ddeadec1c64ddeced6795d537dfa9a39c3b64581ab6354a6d8f44054582c81` |
| `assets/js/app/world-events.js` | `9839120b0e220d10abb6c6d9e34ade81c8f0c2ca3a209806dcdbd9e8d59d4b53` |

The final event app additionally exposes named, focusable horizontal-scroll regions and instructions; those changes retain the reviewed arithmetic and source text. Final event Sun/Moon/elongation differences are circular shortest signed displacements, illumination differences are percentage points, and elapsed hours come from the two separately resolved UTC noon samples. They do not become accumulated lunar travel, election timestamps, correlations, forecasts or favorable-event rankings. Civil display equality remains a label comparison; unavailable temporal hours do not become agreement.

The final connections component still distinguishes internal identities from independent corroboration. It recomputes imported snapshots from their explicit canonical context, uses the unrounded linear offset for residuals, and discloses inherited machine-precision lunar boundaries. No unsupported consensus, probability, source transmission, exact Lahiri equivalence, individual fixed-star observation, religious observance, or new primary-book numerical rule is introduced.

Remaining limits are explicit, not release blockers for this scope: selected source passages rather than full books; Lilly's 1659 OCR is not scan-collated or substituted for a 1647 numerical source; Muhūrta primary-passage verification and opening-portion timing remain pending; the USNO request failed and supplied no fresh evidence; ascensional planetary hours are unimplemented; internal consistency is not broader independent astronomical validation. Round 3 re-read the held implementation and earlier source receipts rather than claiming a new full-book or external-source reading. The parent’s final release pass is still required for integrated UI/generated assets and deployment; this member did not commit, push or deploy.
