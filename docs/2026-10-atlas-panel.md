# Calendar atlas: six members, five new rounds

Baseline: `0d115c9`, branch `feat/mobile-calendar-observatory`. This ledger concerns a new five-round implementation and review sequence. The preceding three-round ensemble is retained in its own documents and is not counted again.

The initial five-round local review completed on 2026-10-30; Round 5 was subsequently reopened for the remote CI correction recorded below. The six members are independently assigned AI coding/review roles, coordinated by a root moderator. They are not human cultural authorities, historical authors, observed usability participants or trained specialist models. Reading a selected passage is recorded separately from implementing a formula and from verifying that formula against independent references.

| Member | Owned work and review perspective |
|---|---|
| `calendar_precision` | Calendar-atlas methods and explicitly named variants |
| `ai_explanations` | Personal solar/lunar context, known/unknown birth-time contracts and privacy |
| `source_connections` | Bounded calendar search, worker and event/control evidence |
| `symbol_methods` | Desktop atlas and five individual calendar-family routes |
| `events_comparison` | Search, benchmark and event-association interface |
| `experience_review` | Independent mobile/desktop, statistical-claim and privacy QA; this ledger and browser evidence |

Root owns shared navigation, registration and release gates. Product ownership is separate from cross-review. No more than two browser processes run concurrently.

## Round 1 — baseline, decisions and implementation acceptance

The experience reviewer rendered the current homepage at 1440px, comparison at 1920px and 390px, and calendar tools at 320px. Source hashes stayed unchanged during the baseline; no runtime errors, implicit external requests or whole-page horizontal overflow were observed. This was a four-page/viewport sample, not a complete accessibility audit. [Receipt](evidence/atlas/baseline.json).

At 1920px, the existing comparison's main region is 1120px wide and presents 13 civil-calendar rows with date text, source-status qualifications and disclosures. The sampled main regions contain no SVG data diagram. The existing comparison has no method-variant selection, no focused family routes or unknown-birth-time interval study flow. Existing natal personalization elsewhere assumes a supplied chart and is not an uncertainty-aware substitute. The mobile comparison retains readable 44px inputs and deliberate source framing; these established behaviors are to remain available.

| R1 decision | Acceptance to execute on the changed implementation |
|---|---|
| Add a separate desktop atlas while retaining existing pages | Real 1440/1920px layout has a usable comparison workspace and computed graphic; all controls remain reachable at 320/390px and enlarged text. No decorative mark is presented as measured unless tied to actual engine output. |
| Add one atlas and five family routes | `calendar-atlas.html` and `calendars/{western,vedic,egyptian,hebrew,chinese}.html` load directly under a Pages project prefix; each carries its own named method, source status and unimplemented boundaries. |
| Support all/selected comparison and focused reading | Native keyboard selection, empty selection recovery and subset exports agree. Unsupported methods remain unavailable instead of silently substituting another tradition. |
| Add personal solar/lunar context with explicit time knowledge | Known time resolves a real instant with zone/fold errors. Unknown time represents a bounded civil-day interval and uncertainty; no invented exact Moon, ascendant or houses. No automatic birth storage, query-string persistence or AI disclosure. Actual exported bytes enforce default privacy. |
| Add bounded search with an optimized and reference path | Worker lifecycle is observable; invalid input does not launch work; cancellation and editing invalidate old jobs/results/exports. Search limits, sample counts, truncation and unavailable samples are visible. Reference/optimized result equality is checked separately from environment-specific timing. |
| Add event matches and baseline/control comparisons | Event source, date precision, eligibility, denominator, comparison window and control construction remain inspectable. Date matches are not correlations or outcome predictions. Small selected event sets, reused inputs and multiple searches cannot be presented as independent evidence. |

Experience review applies the existing Design Partner/source-contract instructions and the Data validation skill's six main criteria: question/evidence, data fitness, consequential calculations, faithful presentation, supported conclusions and bounded reporting. The Data skill's linked helper resources could not be read through the skill provider; its main workflow was available and used. This does not block the authorized implementation.

Screenshots inspected: [home1440](evidence/atlas/baseline-home-1440.png), [comparison1920](evidence/atlas/baseline-comparison-1920.png), [comparison results1920](evidence/atlas/baseline-comparison-1920-results.png), [comparison390](evidence/atlas/baseline-comparison-390.png), [tools320](evidence/atlas/baseline-calendars-320.png).

The calendar member implemented seven families and 32 named variants, retaining all 13 civil rows; at an ordinary observer 24 variants calculate and eight remain explicitly unavailable. New source work read the short UCL Egyptian/Coptic page, selected Britannica paragraphs, fresh HKO explanation and selected Hebcal conversion documentation. UCL/Britannica chronology differences do not become an invented ancient conversion epoch. The 53-group core check passed; seven pending civil-family verification statuses remain unchanged. [Methods/source report](2026-10-atlas-methods.md).

The personal member implemented known-time charts and explicitly sampled unknown-time intervals, separate private export review, optional return calculations and memory-only input handling. The search members implemented a bounded reference/optimized worker, event signatures, declared shifted-date comparisons, file preview and cancellation. The desktop member implemented the atlas and five direct routes, with all-family selections and generated SVG provenance. Source `readingDepth` was added visibly after experience review found that the first source renderer omitted that field.

The first integrated candidate run executed all three real phases at 320/390/1440/1920: 322 checks and 44 downloaded artifacts, with no runtime errors, missing resources or implicit external requests. Its receipt explicitly records an unfrozen candidate: `personal-calendar.js` changed during execution. It is not final acceptance or a later-round result. [Candidate receipt](evidence/atlas/round1-candidate/receipt.json).

Six candidate screenshots were inspected. The mobile plate showed large blank bands because an SVG with intrinsic 640px height was narrowed only in width. The desktop owner accepted this rendered finding and added proportional height; the driver now asserts a square rendered bounding box. That correction was subsequently verified in Round 2. The desktop owner’s 27-check focused R1 receipt and the search owner’s 14-check flow receipt complement this candidate run; their scopes and subsequent corrections are recorded in their member reports.

## Round 2 — domain cross-review

The moderator formally triggered Round 2 after the changed R1 implementation. All six members completed bounded reviews; these are domain and interaction dispositions, not a frozen release claim.

| Reviewer | Actual challenge, correction and bounded disposition |
|---|---|
| Calendar methods | Reviewed personal interval boundaries and selected atlas/MCP output; 20 independent assertions and 87 atlas, 11 personal and 9 MCP groups passed. Unknown-time sampling now ends at the last included millisecond while retaining the true exclusive boundary. ACCEPT. [Receipt](evidence/atlas/calendar-review-round2.json). |
| Personal/privacy | Found selected-only JSON embedded the entire internal comparison. The new export helper emits selected rows/methods and explicitly shared astronomical values. All 32 single-variant exports and 209 visited source references were checked; no unselected comparison remained. ACCEPT. [Report](2026-10-atlas-personal.md). |
| Search methods | Independently checked named prayer configuration, selected Julian output, nested source joins and MCP parity: 12 correction assertions, 87 atlas and 9 MCP groups passed. ACCEPT. [Receipt](evidence/atlas/search-review-atlas-round2.json). |
| Desktop experience | Found event association and Add criterion incorrectly validated unrelated search bounds/cap. After correction, six fresh browser checks accepted reversed/oversized scan ranges and invalid search caps without adding them to the association request. Personal uncertainty/fold checks also passed. ACCEPT. [Initial independent report](evidence/atlas/round2-desktop-independent.json), [correction retest](evidence/atlas/round2-search-correction.json). |
| Search experience | Reviewed personal and atlas source/scope contracts; 11 personal and 53 then-current atlas groups passed. Corrected dataset wording to “this record supplies no event time,” avoiding a claim that the historical event time is unknown. ACCEPT within reviewed scope. [Report](2026-10-atlas-search-experience.md). |
| Independent experience/statistical QA | Executed the revised browser driver at 320, 390, 1440 and 1920 pixels: 394 checks, 52 actual downloads, zero runtime errors, missing resources or implicit external requests. ACCEPT for the domain/UI workflows below. [Receipt](evidence/atlas/round2-candidate/receipt.json). |

The integrated checks verified all seven family views, five direct family routes, selected-only JSON and actual clipboard-link roundtrips, unknown-birth omission from public artifacts, absence of exact houses/returns for unknown time, square mobile SVG, 24 solar-term rows, source reading-depth visibility, cancellation and event association independent of scan bounds. Corrected 390px and 1920px screenshots were visually inspected. The driver SHA-256 is `2e3e3433353a232bf14bf2ff7d96533c81817ccf9f7a250c8ffb9b03e99c4979`.

During this candidate run only `mcp/toolkit.mjs` changed; the receipt marks it explicitly unfrozen. The moderator separately ran corrected MCP unit and actual HTTP/stdio checks. The browser receipt is not evidence of a frozen MCP release.

Round 2 also added source-backed Chinese solar-term calculation and its readable 24-event inspector. Fresh HKO angular/name documentation, all 24 CWA 2026 minute fixtures and the HKO day table support the bounded 2026 checks. The catalogue now has 25 ordinary-location calculated variants and seven explicitly unimplemented variants. These are separate from the seven civil-calendar fixture families whose pending validation status is unchanged. [Methods and source limits](2026-10-atlas-methods.md).

## Round 3 — search, statistics and privacy

Formally triggered after all six Round 2 dispositions. This round examines search/ranking completeness, unavailable denominators, repeated controls, imported-data boundaries, cancellation and birth-data privacy.

The independent experience reviewer ran [35 explicit statistical/source-boundary assertions](evidence/atlas/round3-statistics.json), with a [standalone reproducible probe](evidence/atlas/round3-statistics-probe.mjs). A fixture with four event records on three dates and eight shifted controls on six dates preserves one missing fold sample and two event/control date overlaps. Its pooled feature difference is 0.25; both paired-offset differences are zero after excluding the unresolved pair. The distinction is expected: the two summaries use different eligibility rules and denominators. Neither is a randomized baseline. Zero control frequency leaves the ratio undefined; dependent Western light/proximity and Vedic tithi/karaṇa rules share one named input group.

The review also challenged a capability gap: Chinese runtime calendar parts expose `relatedYear` and `yearName`, while a generic `year` could look like a negative search. The owner added explicit calendar-specific field choices, rejects unsupported combinations and counts missing requested calendar fields separately. The final probe accepts explicit `relatedYear` and confirms generic Chinese `year` rejection. It does not relabel the sexagenary name as a Gregorian year.

A new focused browser phase then executed **79 checks and 16 actual downloads** at 390/1440, with unchanged product sources and zero runtime errors, missing local resources or implicit external requests. [R3 research receipt](evidence/atlas/round3-research/receipt.json). Its driver SHA-256 is `c95a56a5a1bcfda7d8ebbaebf7a3c91cb5932c26e09cf3bbdf3d24a014160f4b`; inspected search core is `a4799ab46d4265aaec962db9748c12f3206f6ae91f989968084a9b20c3acc7ae`.

The ranked top three exported dates equal an independently sorted, uncapped 31-day brute export; the fixture requires later dates beyond the first three chronological hits. The optimized and brute strategies retain all match identities and counts; actual CSV rows preserve the same ranks and named-rule denominators. This verifies ordering by one chosen historical classification, not an outcome forecast or universal cross-calendar score.

Actual event-signature workflows preserved the original UTC/context when the observer changed, flagged later criterion edits and retained the reference after replacing the event dataset. An unavailable Apia civil date preserved existing criteria and disabled stale exports. Imported HTML-like titles remained inert text; supplied verification badges and private fields did not propagate. Separately applied birth details were absent from public JSON/CSV. **Experience review: ACCEPT within this statistical/privacy scope.**

The personal/privacy reviewer independently passed 25 lifecycle checks, distinguishing native worker completion/termination from controlled stale-message and delayed-file-read probes. Actual downloads, oversize-file recovery, private-data isolation, clear and destroy behavior passed. [Independent lifecycle receipt](evidence/atlas/personal-worker-r3.json). The desktop reviewer independently accepted 14 additional hostile-title/source, actual CSV, partial-count ranking and private-clipboard checks on unchanged reviewed sources, with zero errors or external calls. [Receipt](evidence/atlas/round3-desktop-boundaries.json). The search-interface member explicitly accepted the completed 79-check integration and its own provenance correction; no additional browser run is implied. The calendar reviewer independently accepted 35 checks after correcting two defects: exact-pole observers now fail before either search strategy, and association rejects missing-rule status as an observed outcome while date search retains availability filters. Its review also covered calendar-field semantics, seven boundary-equivalence cases, top-K reconstruction, duplicate controls and direct/MCP solar-year boundaries. [Calendar R3 receipt](evidence/atlas/calendar-review-round3.json). The search-core member explicitly accepted its 94-check candidate and the calendar reviewer’s 35-check correction receipt. All six Round 3 members therefore accepted their stated scopes; this does not substitute for the separate visual round and final freeze.

Two ranked-result screenshots were inspected. The mobile table’s last rule-count column wraps enough text to make tall rows; this is a concrete visual follow-up for the designated Round 4, while the numeric/data checks above pass. The moderator subsequently triggered the separate Round 4 below.

## Round 4 — visual and edge interactions

Formally triggered after all six Round 3 dispositions. The members inspected the rendered mobile/desktop flows before making targeted changes:

- The independent reviewer’s R3 mobile ranking screenshot showed excessively tall rows. The search owner replaced concatenated rule counts with real per-tradition groups, widened their table column and kept UTC timestamps unbroken within the named horizontal scroller.
- The desktop member measured Calculate at y=1334 on cold-open desktop layouts. A compact control/action layout and heading-scope correction were accepted for implementation, with explicit visibility and occlusion checks required afterward.
- The personal member measured 14.4px action labels in the search sidebar at 390px. Further inspection disproved the initial base-text inheritance explanation: body text was already 16px, and a later observatory stylesheet overrode the action font. A scoped action-font correction preserves the existing body size. The corrected 390×844 flow passed 14 checks, including 16px visible inputs/actions, targets of at least 45px, no overflow and known→unknown→cancel→clear recovery. [Personal R4 receipt](evidence/atlas/personal-flow-r4.json).
- Short desktop search cancellation was actually reachable: at 1440×600, keyboard focus brought Cancel to y=381–425 and status to y=440–483. The owner retained the working rail and added a result-to-controls anchor instead of claiming a defect that the probe did not reproduce.
- Source review distinguished historical Hong Kong IANA offsets from a constant UTC+08:00; the selected 2026 fixtures use +08:00, while historical displayed clocks must keep their actual offset.

The search-method member explicitly accepted eight bounded pure checks for advanced-request cancellation, immutable field capabilities and malformed-import recovery, then inspected the revised interface’s unchanged arithmetic/disclosure contract. [Receipt](evidence/atlas/search-round4-boundaries.json). This is separate from a browser run or a completed 73,414-date scan.

After owner holds and regenerated assets, the independent reviewer executed the full revised integration: **612 checks and 85 actual downloads**, from 00:23:05 to 00:23:47 UTC on 2026-10-30. No inspected product changed, and runtime errors, missing resources and implicit external requests were zero. [R4 integration receipt](evidence/atlas/round4-integration/receipt.json).

At 320/390/1440/1920, ranked rows measured 171.27px and the named table regions responded to horizontal keyboard navigation. The Calculate action was visible on cold-open 1440×800 and 1920×900 layouts; short-desktop Cancel was fully visible after keyboard focus and Enter cancelled the real worker job. Five atlas section jumps and the search edit-experiment anchor preserved calculated context. Public/private artifact boundaries, selected variants, all seven families, source notes and new ranking semantics still passed. Optional known-time solar/lunar returns produced actual calculated instants with finite longitude residuals; unknown time continued withholding exact returns.

Seven current screenshots were inspected: 320/390 ranking, 1440/1920 atlas, the solar-term inspector, personal390 and short-desktop cancellation. The visual checks are rendered model-agent inspection, not human usability research. [Desktop 25-check flow receipt](evidence/atlas/round4-desktop-flow.json) separately records hit-testing/focus and the original below-fold defect. The calendar member accepted 38 bounded checks and 90 atlas checks, and inspected the desktop owner’s clock table evidence; the final integration also verified the new historical-offset sentence visibly.

**Experience-review R4 disposition: ACCEPT.** Desktop, personal, calendar and search-method members also explicitly accepted their stated scopes. The search-interface member explicitly accepted the measured row-height, keyboard-anchor and final rendered corrections; all six R4 dispositions are complete. The driver SHA-256 is `2e077c67e6d89b46e10100c03729252e7a8a6616e11b91596675b88c1b8e1fb7`. The final release round remains separate.

## Round 5 — frozen acceptance

Formally triggered after all six R4 dispositions. Product, driver and generated assets remained held while the independent browser run and the moderator’s inherited release gates ran separately.

The final full browser run passed **612 checks and 85 actual downloads** from 00:25:25 to 00:26:10 UTC on 2026-10-30. All **446 product-file hashes** matched the accepted R4 manifest, with no changes during R5. Driver SHA-256 remained `2e077c67e6d89b46e10100c03729252e7a8a6616e11b91596675b88c1b8e1fb7`. Runtime errors, missing local resources and implicit external requests were zero. Seven final screenshots were inspected. [Final receipt](evidence/atlas/round5-final/receipt.json), [source/driver binding](evidence/atlas/final-source-binding.json).

**Experience-review R5: ACCEPT.** Its scope is actual atlas, personal, search and research workflows at 320/390/1440/1920, short desktop cancellation, a half-width reflow proxy, keyboard controls, precise public/private export behavior and the stated finite statistical fixtures. The personal/privacy member explicitly accepted the final known/unknown/DST, disclosure, public JSON/CSV/link, clear, return and action outcomes after checking its held source hashes. The search-interface member independently compared all 446 R4/R5 product hashes and accepted ranking, event-reference lineage, denominator, keyboard/cancel and privacy contracts. The desktop member accepted 13 fresh read-only checks plus the actual final browser receipt and nine held route/app/core/style hashes. [Desktop freeze receipt](evidence/atlas/round5-desktop-freeze.json). The calendar member accepted 16 read-only final artifact checks, the 24-term/source-note/selected-only/reading-depth browser assertions and the unchanged manifest, while retaining seven pending civil validation categories. The search-core member accepted 11 bounded final integrity/review groups, including all 446 current product hashes, held search/interface hashes, driver/receipt bindings and the actual ranking/missingness/lineage/privacy results. [Search-core final receipt](evidence/atlas/search-round5-acceptance.json). All six members explicitly accepted their stated R5 scopes; all five new rounds are complete.

| R5 member | Final acceptance evidence; counts are not added to the shared browser total |
|---|---|
| Calendar methods | 16 read-only final artifact checks; [receipt](evidence/atlas/calendar-review-round5.json) |
| Personal/privacy | Held-source and actual final disclosure/certainty review; [report](2026-10-atlas-personal.md) |
| Search methods | 11 integrity/review groups; [receipt](evidence/atlas/search-round5-acceptance.json) |
| Desktop experience | 13 read-only checks and held route/app/core/style binding; [receipt](evidence/atlas/round5-desktop-freeze.json) |
| Search experience | Current hashes, 446-file manifest equality and actual final search interactions; [report](2026-10-atlas-search-experience.md) |
| Independent experience QA | Executed 612 browser checks and 85 downloads; seven final screenshots inspected; [receipt](evidence/atlas/round5-final/receipt.json) |

The moderator’s repository-wide staged binding, inherited tests, push, remote CI and publication are separate release gates. This panel does not claim a hosted model call, model training, a full 73,414-date scan, physical-device/screen-reader testing, human expert endorsement or validated predictive performance. Selected source passages and 2026 solar-term fixtures do not establish whole-book or full-range validation; the seven pending civil-calendar verification families remain pending.


### Round 5 correction — remote typography failure

GitHub Actions run **40981346448** at head **6c62c10** failed the atlas mobile row-height assertion after 147 checks: the three ranked rows were 230.75px tall, beyond the unchanged 220px readability bound. Earlier local R5 evidence measured 171.27px. The original local acceptance and failed remote receipt are both retained; the failure is not rewritten as a passing sixth round. [Original CI receipt, log and run metadata](evidence/atlas/ci-first-failure/receipt.json).

Independent reproduction used the archived product bytes at `6c62c10`, CI-pinned Playwright 1.58.2 / Chromium 145.0.7632.6, and an isolated fallback-font configuration. It reproduced **230.75px exactly**. CDP reported DejaVu Math TeX Gyre in this controlled probe; this does **not** identify the GitHub runner’s actual font. Each of three count sentences occupied two 19.84px lines inside a 390.41px content width. [Failed reproduction receipt](evidence/atlas/round5-ci-reproduction/receipt.json), [environment and limitations](evidence/atlas/round5-ci-reproduction/environment.json).

The search owner’s correction keeps only each compact count sentence on one line within the existing named horizontal scroller. It does not clip values, reduce text size or relax the 220px assertion. The independent driver now records computed font/line metrics, cell/group dimensions and actual Chromium font information, and captures screenshots before a height failure. Failed runs also retain the product manifest. A second old-product reproduction explicitly selected **DejaVu Sans**, verified by Chromium font diagnostics, and again measured 230.75px. This ordinary Linux font provides a clearer old/new regression than the first accidental Math TeX fallback. [DejaVu failure receipt](evidence/atlas/round5-ci-linux-sans-reproduction/receipt.json), [configuration and scope](evidence/atlas/round5-ci-linux-sans-reproduction/environment.json). An attempted full run with the unusual Math fallback stopped at a separate 4px Chinese-page overflow; it is retained as [diagnostic evidence](evidence/atlas/round5-math-fallback-layout/environment.json), not a passing gate or proof of a CI-image clone.

The corrected product then passed two distinct held-source checks:

| Corrected R5 check | Actual result |
|---|---|
| Full atlas/personal/search/research driver, pinned Chromium 145, normal local browser fonts | **612 checks / 85 downloads passed**; CDP identified Noto Sans for count text; rows were 171.27px at all four widths. [Receipt](evidence/atlas/round5-corrected-final/receipt.json). |
| Focused research regression, same pinned browser and verified DejaVu Sans as the old-product failure | **178 checks / 32 downloads passed**; rows were 171.27px at 320/390/1440/1920, and each count sentence occupied one 19.83px line. [Receipt](evidence/atlas/round5-corrected-dejavu/receipt.json). |
| Search owner’s focused font stress | **28 checks passed** across Arial/Georgia/monospace and 320/390/1440; actual keyboard scrolling tested where overflow exists. [Receipt](evidence/atlas/round5-font-correction/owner-receipt.json). |

Both independent corrected runs had zero runtime errors, missing resources or implicit external requests, and no product/driver changes during execution. Their 446-file product manifests agree. Only `assets/css/calendar-search.css` differs from the original local R5 product; the driver separately adds diagnostics while retaining the 220px assertion. [Corrected source binding](evidence/atlas/round5-corrected-source-binding.json). Representative corrected mobile and solar-inspector screenshots were inspected.

**Experience-review correction disposition: ACCEPT for the tested local scope.** The original five-round record and first failed CI run remain intact. Fresh remote CI on the corrected pushed commit remains a separate moderator confirmation; a pinned browser alone does not reproduce the complete GitHub Actions image.
