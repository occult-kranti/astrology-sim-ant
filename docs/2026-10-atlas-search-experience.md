# Calendar research lab: experience and implementation

This is the search/public-event member's contribution to the **new five-round, six-agent review**, starting from `0d115c9` on `feat/mobile-calendar-observatory`. It is separate from the earlier three-round event comparison. The reviewers are AI-agent roles, not human tradition authorities or research participants.

## Round 1 — baseline, decisions and candidate

The existing calendar comparison can inspect one moment. The public-date agenda can compare two acknowledged noon samples and export date-only events. Neither surface provided a cancellable date-range search, an explicit brute/optimized comparison, imported event-set preview, or offset-control comparison. These are code-derived findings; they do not establish a measured human task failure.

Read `HANDOFF.md`, `PRODUCT.md`, `DESIGN.md`, the common observatory source contract, the Gregorian specialist profile, canonical day-guidance rules and the existing comparison dependency explanations. Applied the panel-led-product-redesign workflow. The Impeccable skill was read, but its launcher is absent and its referenced resource files could not be loaded through the skill provider; existing product/design context and the atlas owner's stated visual direction were used directly. No new historical rule or calendar authority is inferred from that design guidance.

| Finding and impact | Decision | Acceptance check |
|---|---|---|
| Single-moment views cannot directly answer a bounded date query. | New lab with explicit inclusive civil date range, one local sample clock, observer zone/coordinates and AND criteria; within-criterion values are OR. | Match results preserve the normalized request, sample UTC, unavailable rows and denominator counts. |
| A long calculation must not freeze editing or leave old exports available. | Dedicated module worker with job IDs, revision checks, visible progress, cancellation and worker termination. | Cancel or edit invalidates results and download actions; late messages cannot restore them. |
| A faster implementation can be wrong or merely faster on one run. | Separate semantic equivalence from measured strategy timings. | Benchmark displays compared fields and measured runtimes; disagreement disables exports. |
| Event precision and chosen chart time are easily conflated. | Date-only event sources, explicit sampled-clock acknowledgement, imported-source qualification and independent event-set selection. | No event timestamp is manufactured; imported claims remain unverified; event-derived criteria are labelled selection-conditioned. |
| Counts without denominators can imply an outcome probability. | Feature-frequency tables for event/control samples, missingness, declared offsets and paired-offset sensitivity. | Proportion differences and ratios retain eligible denominators; no outcome probability, p-value or causal claim is shown. |
| Personal context should remain optional and separate from public experiments. | Memory-only personal component receives a selected result instant; default export and atlas links do not read the birth context. | Public JSON/CSV/URLs contain no birth inputs; a selected sample can be inspected personally without changing the public criterion request. |
| Mobile tables need discoverable scrolling. | Native semantic tables inside named keyboard regions, with scroll instructions; a scoped CSS override keeps the wrapper as the actual scroller. | Real keyboard scrolling and document reflow are checked in later browser acceptance. |

The visual direction is an operating research desk: parchment, dark green ink, copper actions, serif display, a narrow experiment rail, central criterion ledger and an event/source rail. Results form a continuous lower ledger, with date-order results rather than a scientific “best day” ranking. At narrower widths the rails reflow into normal document order. Existing routes and saved formats remain untouched.

### Exact contracts

`assets/js/core/calendar-search.js` and `assets/js/workers/calendar-search-worker.js` belong to the source/search engine member. The UI uses their strict request normalizer, criterion catalogue, event parser, numerical results and worker protocol. It does not recreate ephemerides, convert a birth into a fabricated exact clock, or infer source facts from imported titles.

The default date budget is 366 dates; an explicit advanced opt-in enables the engine's bounded 1900–2100 range (up to 73,414 date slots). Returned matches are capped at 1,000, with total matches and truncation disclosed separately. Event imports are bounded to 100 records and 100 KB by the core/UI contract. Advanced searches remain finite, cancellable computations, not a claim of unbounded performance. The worker independently enforces limits.

The direction “event → signature” replaces the criterion list with the selected sampled quantities and requires explicit acknowledgement of the chosen observer and clock. Subsequent matching is exploratory because the criteria came from a known event. The direction “criteria → events” applies the current criteria to the entire selected event set and declared shifted-date controls; the search date range does not silently filter that event set.

“Favorable” and “caution” refer to named inherited historical classifications. Concurrence stays inside a named tradition and counts rules, not independent evidence. Lunar phase, tithi and karaṇa share elongation. Nakṣatra and yoga use different sidereal constructions. Civil date labels supply no auspiciousness. Circular angles, unavailable observations, selected sources and exact rule evidence remain inspectable in the canonical outputs.

### Data and reading scope

Curated event dates, source receipts and selection limits are provided by the engine member's `calendar-search-events.js`; this UI does not independently refresh or widen those factual claims. Local imported records are previewed before replacing the event set and remain caller-supplied provenance. The earlier RFC5545/Agrippa passage reads in `2026-10-ensemble-events.md` are inherited context, not fresh readings for this new pass. No full-book study, empirical predictive validity or independent tradition endorsement is claimed here.

### Executed checks

The first UI candidate passes `node --check assets/js/app/calendar-search.js`. Runtime integration and real-browser journeys await the engine/member modules, then will be recorded with their actual results. This initial syntax check does not establish calculation correctness, performance, source validation or browser usability.

Rounds 2–5 will be appended after the moderator's explicit triggers and actual changed-artifact reviews. No future round is counted in advance.

## Round 2 — domain cross-review and corrections

The moderator explicitly opened Round 2 after the first candidate. The experience member's integrated Round 1 browser run executed 322 checks and 44 actual downloads across the atlas, personal and search workflows, with no runtime, missing-resource or external-request errors. Its [receipt](evidence/atlas/round1-candidate/receipt.json) is candidate evidence: the personal core changed during that run, so it is not a frozen release receipt. Search checks covered strategy equivalence and DST missingness, actual JSON/CSV bytes, caps, imported event/control denominators, cancellation and stale-result blocking.

The search owner then inspected desktop/phone screenshots and completed a focused 14-check browser pass. It exercised event-signature acknowledgement, recovery of the source event's chosen sample, an unavailable Apia 2011-12-30 signature retaining existing criteria, exact atlas moment/method links, actual keyboard scrolling, and a locally applied unknown-time birth absent from the downloaded public result. There were no runtime errors or external requests. Receipt and top-workspace screenshots: `/workspace/setup-validation/atlas-search-owner-round1/`. This is Chromium emulation, not a physical-device or screen-reader study.

The first screenshot showed an unnecessarily long generic limitations list beneath results. Full inherited limits now live in a native disclosure; feature denominators, declared controls, shared inputs and selection dependence remain beside the controls or results they qualify. Public atlas links now explicitly carry the calculation method parameters as well as instant/observer. No birth context is used to build those URLs.

| Independent finding | Impact and accepted correction | Verification |
|---|---|---|
| Experience reviewer: the source record omits a historical clock, but “the event time is unknown” could claim that no such clock is documented anywhere. | Acknowledgement and signature copy now say **this record supplies no event time**. A chosen study clock remains separate from any documented historical event timestamp. | Source dataset's `dateConvention` and actual UI copy checked; explicit acknowledgement retained. |
| Atlas/symbol reviewer: association with a valid event set failed when the unrelated search end date preceded its start. | Association now constructs its own event-study request, independent of the scan range, range budget and returned-row cap. The Add criterion flow also uses the core's new strict criterion normalizer, removing its accidental dependency on scan dates. | Actual browser reproduction `/tmp/atlas-r2-independent-report.json`; corrected app passes syntax and six independent Chromium retest checks. Reversed or oversized scan ranges and an invalid unrelated result cap no longer block criterion editing or event association; actual association JSON omits scan bounds. Retest receipt `/tmp/atlas-r2-search-retest-report.json`; no runtime errors. |

The corrected search app SHA256 is `682da545584ccc72b49d173963053a940ade03d2b03e290da99f5bc1d3ad4fd2`; page `71a64e35a729d9812940295367af70ce829746650848580d980220d3d5706133`; CSS `ec1f0e41366b616e28e5477a1bd1a699669525d87cb60321094c9f5c9c82a085`.

### Independent domain review performed by this member

Reviewed the personal-calendar core/app and atlas core/app, its five family routes, selected/all catalogue handling, canonical source rows and the Hebrew civil profile. The personal core's corrected unknown-time interval samples through the last included millisecond, retaining its true exclusive end and an explicit sampled-envelope qualification. It requires a fold occurrence for ambiguous recorded clocks; unknown-time output has no houses, ascendant, Vimśottarī or exact returns. Public defaults contain method metadata rather than derived personal results; explicit private export recomputes the supplied valid input.

Executed the 11 personal test groups and 53 atlas checks successfully. Final reviewed personal core: `06a25c33883c74ba23ceab1df7f9131c03eeaf6e0f79471671308a5d29f4a812`; personal app: `14f602f27719feb20944a2bea29c542ab27e57f29d43ad0abb8ee4a636e20dcb`. Atlas core: `43b923d18ee604ec205ec838eb4f258927932406de723011a0a21077585d1ed5`; atlas app: `b44b298520cef78673b9bb30357204bd5be1cb2c2879744658f098833df27302`. No additional blocker was found in this bounded domain/privacy/source-scope review. Later atlas changes need their own recorded review.

The Egyptian family retains the computed Coptic convention and explicitly unavailable ancient civil/lunar reconstructions; it does not rename the Coptic result as an ancient date. Hebrew civil midnight, religious sunset and Kabbalistic interpretation remain separate. Source entries retain actual reading depth, pending source/fixture status and the distinction between an article and its unread cited books. A fresh independent UCL calendar request in this review returned HTTP 403; therefore this agent makes **no fresh UCL passage-reading claim**. The inherited source ledger was inspected instead. Named historical rule counts remain distinct from civil date results and do not supply scientific favorability verdicts.

## Round 3 — bounded count ordering and research-state integrity

The moderator explicitly opened Round 3 and accepted an additional ordering mode. Date order remains the default. **Highest known chosen-rule count** requires one named tradition, one favorable/caution classification and a minimum count. The core evaluates the entire requested sampled window before retaining its capped result set; this UI never sorts an already truncated first page. Dates break count ties. Every ranked row exposes position, known count, total rules, unavailable rules and whether the chosen tradition's count is partial. It is not a combined all-calendar score, a complete maximum when rules are unavailable, or an event-outcome prediction. JSON and CSV retain the order, exact chosen count and cap metadata.

The UI now derives each civil-calendar field menu from the engine catalogue. Chinese `relatedYear` and `yearName` remain distinct, explicitly labelled civil fields; an unsupported generic `year` or `era` is not offered for that display. When the engine reports resolved samples missing a selected display part, the summary shows that count and the criterion-level detail. Zero matches must not disguise missing calendar values. Searchable unavailable historical classes remain distinct from observed-feature event/control analysis.

The owner's late-result review confirmed job IDs, revision guards and worker termination prevent a cancelled or edited job from reviving results; pending file reads also compare their starting revision. A separate provenance defect was found: changing event sets or editing criteria dropped an event-derived reference, while the old explanatory text could still describe it as the current selected clock. The accepted correction retains an immutable reference event, UTC sample, public observer and clock. Criterion edits explicitly mark that reference as modified; changing a dataset or current observer does not silently recalculate or erase it. Reloading starts a new workspace without the stored reference. The reference itself does not establish an independent validation sample or undo exploratory selection.

The reviewed personal component still stores birth inputs only in page memory. The search exports never call its `getValue()` or serialize a component result. Public sample URLs use an explicit allowlist of instant, observer and calculation method parameters. The optional component clears prepared previews when its inputs or selected comparison change; disclosure remains a separate explicit preview/download flow. No additional private-data blocker was found by this member's Round 3 code review. The planned integrated browser assertions also inspect actual exported bytes after a birth is applied.

Candidate UI SHA256: app `a8ee4649539144f36c725205837d9ebb7c52a61237c066976683d973b3ce29bc`, page `7008086baf22ddac1bc513ce8921fef317528fb367af80c9abc43a15ca46d7f9`, CSS `ec1f0e41366b616e28e5477a1bd1a699669525d87cb60321094c9f5c9c82a085`. Syntax passed. The subsequent held-candidate browser acceptance below verifies full-window ordering, immutable reference lineage and private-data omission through actual interactions and downloaded bytes.

Round 3 browser acceptance completed: the experience member's [held research receipt](evidence/atlas/round3-research/receipt.json) passed **79 checks with 16 actual downloads**, no runtime/missing-resource/external-request errors and no product drift. It independently sorted an uncapped reference month and verified that capped ranked JSON/CSV retained the true full-window top three, including a later date absent from the first three chronological hits. It also checked unchanged original seed UTC/observer after current-observer edits, explicit modified-reference metadata, unavailable-signature preservation, inert imported text, actual private-birth exclusion and Chinese display-field choices.

**Round 3 disposition: ACCEPT for the search member's assigned scope.** Ranking and state/provenance corrections are verified; no numerical or privacy blocker remains in these checks. The 390-pixel ranked table exposes a readability follow-up—long multi-tradition counts wrap into tall rows—reserved for the moderator's separately triggered Round 4 interaction/visual pass. Desktop cancel/status reachability at a short viewport also awaits that actual Round 4 interaction, rather than being inferred from CSS.

## Round 4 — readable ledgers and reachable controls

The moderator opened Round 4 after all six Round 3 dispositions. The ranked phone screenshot showed very tall rows because several traditions' counts collapsed into one narrow paragraph. The accepted correction uses separate DOM groups with catalogue-derived tradition names, a 26-rem count column inside the existing horizontal scroll region, and an unbroken UTC value. The selected ranking count remains near the left. Values, order, missingness and export arithmetic are unchanged.

A source reviewer also identified an explicit unknown-value edge: the benchmark engine can return `speedRatio: null` when its timing denominator is unavailable, but coercing it through `Number()` displayed `0.00`. The UI now displays **Unavailable** unless the ratio is a finite number; it does not invent a measured zero.

The owner actually launched an advanced worker at **1440 × 600** and inspected the rail: Cancel occupied y=381–425, status y=440–483 and progress y=503–519. Tab reached Cancel, and Enter cancelled the real worker. No runtime error occurred. Thus the suspected cancellation-access blocker was not reproduced; the rail was not unnecessarily restructured. The initial probe waited for an obsolete six-event fixture while the source member's catalogue now held nine records; correcting that driver readiness condition resolved the timeout and was not counted as a product defect. Receipt: `/workspace/setup-validation/atlas-search-owner-round4-baseline/receipt.json`.

The result header now has compact native links back to the experiment and pattern headings, both valid keyboard focus targets. This supports another iteration without adding a new settings surface or changing a running calculation.

Held UI SHA256: app `12aa71c06359cdefb46142d6d4bbc0846a4874e819504e8d361cf38e98f55733`, CSS `a80f5519fd3f8c1012c3ab9854de104065c84d8cdbe16c052a0fb9bf737f12c2`, page `7cf5eff39c750df012231177b076c1e244a5fc3a9a8bbad38c3f566dff90e51c`. App syntax passed. The full Round 4 browser gate will verify actual phone row height, keyboard horizontal scrolling, return links and the integrated controls after root asset generation. A physical-device or screen-reader claim is still outside this evidence.

**Round 4 disposition: ACCEPT.** The [full integration receipt](evidence/atlas/round4-integration/receipt.json) passed **612 checks and 85 actual downloads** with no source drift. Ranked rows measured 171.27 pixels at 320, 390, 1440 and 1920 widths; the named region scrolls with ArrowRight, and the result-to-experiment link focuses its heading without erasing the computed result. The independent 1440 × 600 interaction confirmed visible Cancel and successful Enter cancellation. Existing public export/privacy and ranking CSV checks remained intact. The owner inspected the resulting 390-pixel screenshot and confirmed the materially shorter rows. No further UI revision is proposed before the final freeze.

## Round 5 — frozen-source acceptance

The moderator explicitly froze the reviewed product. This member performed a read-only final inspection of ranking, immutable event reference metadata, criterion/source import recovery, pooled and paired denominators, keyboard/cancel state and the public/private export boundary. The three owned UI files exactly match the Round 4 and Round 5 product receipts; app syntax passed. No new product code or browser process was introduced by this member in Round 5.

**Final disposition: ACCEPT within the search member's assigned scope.** The [final Round 5 receipt](evidence/atlas/round5-final/receipt.json) passed **612 checks with 85 actual downloads**, with no product drift, runtime errors, missing resources or external requests. This member verified that all reported checks pass, the owned current files match the receipt, and the complete 446-file product mapping is identical between Round 4 and Round 5. [Final source binding](evidence/atlas/final-source-binding.json) ties the integrated evidence to those files. Actual final ranking/CSV, immutable reference lineage, 320/390 table row height and keyboard scrolling, return-anchor focus and 1440 × 600 cancellation checks remained successful.

Final held owned-file hashes remain:

- `assets/js/app/calendar-search.js`: `12aa71c06359cdefb46142d6d4bbc0846a4874e819504e8d361cf38e98f55733`
- `assets/css/calendar-search.css`: `a80f5519fd3f8c1012c3ab9854de104065c84d8cdbe16c052a0fb9bf737f12c2`
- `pages/calendar-search.html`: `7cf5eff39c750df012231177b076c1e244a5fc3a9a8bbad38c3f566dff90e51c`

This accepts the bounded implementation, not scientific predictive validity, universal culture coverage, a representative event sample, complete source-book reading, a physical-phone/screen-reader audit, a hosted external model connection or deployed production verification. The root agent owns broad repository gates, commit/push and CI/deployment status. No commit or push was performed by this member.
