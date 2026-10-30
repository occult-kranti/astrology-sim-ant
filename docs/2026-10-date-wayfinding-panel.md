# Date wayfinding review ledger

Baseline: `fdc184df829fda685a23d69962d121328b68537e`. Six AI-agent roles plus the integrating root coordinate the work. These are software/source review perspectives, not human participants or professional endorsements.

## Round 1 — baseline and implementation decisions

Root read the inherited source, verification, date-search and sky-interpretation contracts, current route/state code, and existing design specifications. Root also directly inspected the previous production's `country-history/first-390.png` and `horizon/chart-1440.png`, retained under the exact baseline release evidence. The latter displays the existing dated profile plot, single range control and separate astronomical/observance lists. This is an inspection of actual retained baseline images, not a new live interaction study.

| Finding and evidence | Impact | Decision / owner | Observable acceptance |
| --- | --- | --- | --- |
| The pages use different date controls; source axes, chart samples and country events carry different precision. | A single unlabeled date widget could erase source distinctions. | Shared component with explicit caller-supplied date/category/details; page owners preserve precision. | Alleged/year-only dates remain source records; a study slider never mutates the source date. |
| Existing sliders do not provide a consistent detail/bookmark interaction. | Users must leave the date context to inspect evidence and cannot save a study reference. | Native slider, focus/hover/tap card and bounded explicit local bookmarks / shared role. | Pointer can enter card; keyboard can save/dismiss; reload restores only the explicit reference. |
| Thirteen calendar methods can make repeated controls dominate the page. | A full date list beside every calendar would overwhelm comparison. | Compact synchronized lanes and grouped disclosures / all page owners. | Each applicable calendar remains reachable without thirteen expanded navigation panels. |
| Horizon's compact profile rows omit original favorable/caution contributions. | Signed editorial scores cannot identify mixed rule states. | Keep profile tracks explicitly numeric and neutral/unavailable; color stored astronomy/observance evidence / horizon role. | No signed-score-to-danger or signed-score-to-favorable classification. |
| Search returns a bounded detailed hit set alongside full population counts. | A navigator could imply that retained rows are the whole scan. | Retained-hit scope and truncation stay visible / search role. | Slider count equals retained rows; total scan and matching counts remain separate. |
| Historical country dates include unknown clocks, pre-1900 references and shared events. | Country colors could falsely imply a precise national chart or future threat. | Preserve historical conflict labels, separate country-scoped references and modern observer links / country role. | All seven historical views work; pre-1900 source-only and unknown-time qualifications remain. |
| Existing workers disable stale exports and guard replacement/cancellation. | A new auxiliary slider could bypass that state machine. | Shared disabled state; parent owns all calculations / all page owners. | Editing inputs or cancelling prevents auxiliary casts and stale exports. |

Implementation and subsequent review results will be recorded here against the actual changed artifacts. No completed later round or release is claimed by this initial ledger.

## Round 2 — integrated challenge and corrections

The first changed artifact was reviewed through source/state inspection, shared-component browser fixtures and real page calculations. The following findings changed the implementation; their original failed diagnostics remain outside the product repository under `/workspace/setup-validation/date-wayfinding/` or the named owner probe paths.

| Demonstrated finding | Correction | Verification status at this stage |
| --- | --- | --- |
| Closing a focused detail card immediately reopened it through the trigger's focus handler. | Guard focus restoration; preserve Escape and explicit close behavior. | Shared fixture and page checks exercise dismissal; final held verification remains separate. |
| A later navigator could intercept pointer movement into a desktop hover card. | Portal cards outside component stacking contexts and anchor them to the triggering date. | Original 1440/1920 failures retained; corrected fixture rerun required. |
| An explicit list click on its already-selected first item failed to activate the parent source selection. | Explicit list activation calls the parent even when the widget index is unchanged. | Source-page owner confirmed the state mismatch and reviewed the correction. |
| Busy-state disable/re-enable could lose slider focus; one timeline path tried to focus before revealing the instrument. | Restore only the still-relevant focused control and reveal before focusing. | Consecutive keyboard steps passed the owner and integrated page probes. |
| Bookmarks outside the current range could consume the global limit without a removal path. | Bounded saved-marker manager supports removal across views, including an empty current view. | Fixture checks cover removal without automatic recalculation. |
| Search's selected rule-count text inherited table-only nowrap styling, expanding a 390px document to 405px. | Scoped wrapping on the selected detail region. | Corrected 390px integrated page run passed. |
| The country observer convenience selector compared raw IANA names, losing India/Ukraine after canonical alias normalization. | Compare runtime-normalized zone identities while retaining explicit input and source labels. | Independent seven-country request probes preserve all seven selections. |
| Solved solar-term selection could truncate milliseconds through the visible second-precision clock controls. | Preserve the exact selected instant while those controls match; clear that override on a user edit. | Exact-instant browser regression added before held acceptance. |
| Some rule/sample markers used indices or reusable IDs across changing date windows. | Include source/body and canonical UTC in bookmark identifiers. | Final checks must verify that a saved marker cannot silently alias another date. |
| A long hover card could cover its own trigger in a narrow viewport. | Choose the available side, cap card height to that space, retain a trigger gap and internal scrolling. | Actual hover-then-click confirmation required before release. |

Traditional caution now uses amber, distinct from historical conflict's dark red. The shared palette was measured against its actual tints; source labels and symbols remain required. This does not assign predictive validity to either category.

The country and horizon/search roles cross-reviewed each other's observer, source precision, context and invalidation contracts. The original three pre-1900 US references remain unavailable to the canonical astronomical engine. Horizon's signed profiles remain numeric; Search's favorable/caution/mixed categories come from its actual named rule counts.

Harness corrections are recorded separately from product defects: a mistyped pre-1900 selector, an incorrect JSON nesting expectation, hidden first-atlas-control targeting and insufficient waiting for native disclosure toggles. No product assertion was waived to accept these mistakes. An initially suspected interrupted run was subsequently confirmed to have completed normally; no browser process was killed in that diagnostic.

## Round 3 — held candidate and acceptance

The final focus challenge reproduced a sequence where focusing a New Moon mark scrolled the document beneath a stationary pointer. A neighboring First Quarter hover could replace the card's return anchor before it was pinned. The shared lock now respects the keyboard-focused original trigger as well as pinned/focused cards, across navigator instances. Deliberate focus movement and explicit activation still select a different record. The exact source-owner reproduction passed 54 checks on the corrected module, including Escape returning to the original New Moon mark and distinct same-day Easter/Pascha references.

An earlier full run passed 453 functional checks but correctly rejected acceptance when that correction changed the shared module during execution. The receipt remains preserved. The final unchanged candidate passed **463 browser checks**, retained **10 real downloads and 25 screenshots**, and had no product/driver drift or runtime errors. Root, the independent verification role and the source-page role directly reviewed all 25 final screenshots. Compact controls, readable source details, semantic labels, scrolling and mobile layouts had no remaining blocking finding in those views.

The full engine suite passed 732 top-level checks; the all-page Chromium sweep passed 134 pages with zero errors and its two inherited descriptor warnings. All nine generator contracts and the static/round-ledger checks passed. Existing scientific and historical datasets remain unchanged. See [the verification record](2026-10-date-wayfinding-verification.md) for source bindings, limitations and the distinction between local acceptance and actual publication.

## Release regression review

The first pull-request workflow found a further real 320-pixel defect after the initial local acceptance: scrolling a passive source card's trigger offscreen could clamp the card over Newton's existing next-day control. Root inspected the actual failed CI screenshot; the component role reproduced the blocked normal click. Passive cards now dismiss when outer scrolling moves their anchor or focus moves elsewhere, while deliberate pinning and keyboard/card interaction remain stable. An independent reviewer checked the exact correction and negative/positive page evidence. The dedicated regression role added an actual 320-pixel journey and scroll/focus preservation checks without removing prior assertions. Initial regression-driver pointer/focus setup mistakes remain recorded as rejected runs; the publication gate still requires the full corrected suites and exact CI.

The corrected held run passed 517 checks, retaining all 463 prior assertion occurrences plus 54 regression checks. Actual downloads and screenshots were rehashed; all nine changed/new images were directly reviewed and 17 retained the previously reviewed bytes. The unchanged inherited Newton suite passed 1,294 checks over four widths with 84 actual downloads and no source drift. These results replace the rejected candidate for local acceptance; CI and publication are independently checked against the new commit.
