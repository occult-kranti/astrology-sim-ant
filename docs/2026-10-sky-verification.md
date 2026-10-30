# Sky explorer verification

This record starts from `fb656a8047e93b8d49227d92aa9edc3e9b1fce50` and covers the new interactive sky explorer, timeline, calendar alignment and source-backed interpretation work. Earlier atlas receipts remain historical evidence for their own product hashes.

## Round 1: acceptance boundaries

The baseline screenshot `docs/evidence/atlas/round5-corrected-final/atlas-1440.png` was inspected. It presents a clear, calculated Sun/Moon plate, a visible time/place form and an explicit longitude convention. It does not yet supply selectable planets, a multi-year timeline, frame-aware overlays or a selected-body interpretation. These are observed scope gaps, not failures of the previous specification.

| Risk | Observable acceptance check | Status |
| --- | --- | --- |
| Mixing coordinate systems | Geocentric apparent positions identify the true ecliptic/equinox of date; the heliocentric view identifies its J2000 frame, physical AU vectors and display scale. | Pending implementation |
| Treating stars as precise 3D points | Named star markers retain their catalogue epoch, precession approximation, missing latitude/distance and modern-variant status. | Pending implementation |
| Sparse timeline implies all transitions | Step size, computed interval, sampling limits and lunar aliasing are visible; only independently refined events claim exact instants. | Pending implementation |
| Timeline changes decoration only | Selecting a sample changes the canonical atlas UTC instant and recalculates the chart, comparison and interpretation. | Pending implementation |
| Wall clocks mistaken for one instant | Same-UTC and same-local-clock modes disclose actual UTC difference, day-boundary changes, and DST ambiguity/nonexistence. | Pending implementation |
| Civil calendars placed on invented angular rings | Angular tracks derive from named ecliptic partitions; civil dates use an aligned legend, with no fabricated degree or agreement score. | Pending implementation |
| Source rules become outcome promises | Reading records identify actual calculated inputs, historical rule/source locator, missing conditions and modern reflection separately. | Pending implementation |
| AI packet leaks personal data or invents integration | Exported prompt bytes omit birth/location by default, disclosure is explicit, retrieved text is untrusted data, and local/hosted/provider states are distinct. | Pending implementation |
| Stale worker or exported results | Editing source inputs invalidates dependent output; cancellation and later jobs cannot restore stale results. | Pending implementation |
| Visual-only control or font-dependent layout | Keyboard activation, narrow reflow, zoom proxy, reduced motion, and actual platform-font diagnostics are checked in real Chromium. | Pending implementation |
| Claimed support exceeds registered tools | Capability coverage names actual callable tools and identifies route/content-only or unavailable capabilities; protocol tests use real transports. | Pending implementation |

The independent browser driver will use fixed test instants, not the computer's current date. Its product manifest and driver hash will distinguish exploratory runs from final unchanged-source acceptance. Screenshots are visual evidence; automated checks do not establish human usability or screen-reader coverage.

## Round 1: implemented candidate and independent journeys

Before browser execution, independent inspection caught and assigned corrections for the following actual integration defects: the first overlay renderer added the Lahiri offset twice; the UI sent numeric worker IDs to a string-only worker contract; invalidation discarded the prior zone before stale timeline checks; timeline-form edits retained previous results; an inherited star marker was described as measured; the lunar alias warning was hidden; and keyboard selection destroyed its focused SVG node. The owner corrected these before the journeys below. An early core probe also found that `stepDays: '14'` was coerced into a number; the core owner added strict typing.

The source audit found a contradiction between an illustrative repository skill and the inherited Sirius nature attribution. The source reviewer inspected Agrippa II.31: the greater Dog-star is described as “Venereal.” The new source record therefore cites II.31 for that nature, independently of II.47's images and of modern astrometric positions. The alternative attribution remains qualified. This is selected-passage evidence, not a full-book reading.

Four real Chromium 145.0.7632.6 phases ran under the `/astrology-sim-ant/` project prefix at 390 and 1440 CSS pixels. Each receipt binds its own driver and product manifest and checks actual downloaded bytes:

| Phase | Checks | Downloads | Receipt | Source state during run |
| --- | ---: | ---: | --- | --- |
| Chart and reading | 119 | 20 | `docs/evidence/sky/round1-chart/receipt.json` | No drift |
| Timeline and recasting | 46 | 8 | `docs/evidence/sky/round1-timeline/receipt.json` | No drift |
| Calendar alignment and ICS | 78 | 18 | `docs/evidence/sky/round1-alignment/receipt.json` | `sky-interpretation.js` changed; explicitly an unfrozen candidate |
| Assistant and mocked stream | 53 | 4 | `docs/evidence/sky/round1-assistant/receipt.json` | No drift |

These are **296 checks and 50 downloads across four evolving candidate phases**, not one frozen acceptance run. The assistant phase made four requests to a local, test-owned SSE fixture. It verified the exact system/user prompt hashes transmitted after consent, inert rendering of markup, detection of an unknown citation ID, cancellation on input change, discarded late text, and memory-only key cleanup. It did not call a model provider or evaluate inference quality. All four phases reported no console/runtime exceptions, missing local resources or implicit external requests.

Chart checks recover each displayed planet's longitude independently from its SVG marker coordinates, compare actual SVG/JSON exports, select all ten bodies, inspect separate modern and inherited star groups, verify source lenses and unsupported outer-planet rules, and preserve physical heliocentric vectors while changing display projection. Timeline checks recast exact hourly sample coordinates, build a calculated ten-year window, expose lunar aliasing, cancel work, reject inverted ranges and invalidate stale zone labels. Alignment checks recover actual ring tick angles, compare date-line clocks, preserve DST fold/gap states and inspect both minimal and expressly disclosed RFC5545 exports.

Inspected screenshots include `deep-chart-1440.png`, `deep-chart-390.png`, `timeline-1440.png`, `alignment-390.png` and `assistant-390.png` within those phase directories. Actual platform fonts were recorded using Chrome DevTools, including Noto Sans, Liberation Serif and DejaVu Sans Mono in this environment. Screenshot review prompted another improvement: a connected 14-day Moon line produced visually dominant aliased zigzags despite a visible warning. The UI owner was asked to use sampled points for that coarse lunar grid and retain a short-window inspection path. The owner independently identified crowded inner-body orbit labels. These changes require the next candidate review.

## Round 2: cross-review, failures and corrections

The second round reviewed the changed artifact. Coarse lunar samples now appear as points rather than a misleading connecting curve, orbital labels use position-preserving callouts, and dirty calculation inputs disable dependent view and body controls. The latter prevents a retained geocentric wheel from being relabelled as an orbital view while recalculation is pending. Actual mobile toolbar text was measured at 13.6px, corrected to 16px, and independently verified with at least 44px targets.

Independent browser review then found a consequential interpretation handoff defect. The visible London → New York **same-local-clock** comparison calculated `2026-10-29T16:00:00.000Z`, 14,400 seconds later than the base. The expressly disclosed AI packet instead contained a default London **same-instant** comparison at `12:00Z`. The failed run is preserved in `docs/evidence/sky/round2-assistant-comparison-probe/receipt.json` (16 checks, three inspected downloads, unchanged product during the run). The correction binds the assistant to the applied zone/mode/fold selection, invalidates its preview on comparison edits, and disables public reading export while the comparison is pending. The corrected run compares the full synchronization objects, not merely a label.

The guide audit identified six major tool routes missing from the capability registry. New descriptors now cover the calendar hub, comparison, date search, symbolic studio, standards and world events, alongside all five atlas family pages. It also prompted visible MCP scope and result fields so a named backend tool is not mistaken for every function on a page. The first actual guide sweep exposed a separate Pages-root bug: `/astrology-sim-ant/index.html` and `/astrology-sim-ant/` did not normalize to the registered homepage, while nested `pages/` routes worked. Its unchanged-source failed receipt remains at `docs/evidence/sky/round2-guides/receipt.json` (one completed check, zero downloads). The owner replaced arbitrary path stripping with the actual application root and added root/prefix tests. The corrected route sweep is recorded separately.

The next guide attempt confirmed root-alias mounting but caught lost immediate focus after the heading shortcut. The disclosure opened, then default fragment navigation moved focus from its summary to `BODY`; pressing Tab reached the summary, so this was not a keyboard trap. The diagnostic receipt and screenshot remain in `docs/evidence/sky/round2-guide-focus-probe/` (five checks, no downloads), alongside the preceding attempt in `round2-guides-corrected/`. The shared shortcut was corrected to preserve deliberate scrolling and focus. The ensuing gate tests both immediate summary focus and Tab continuation into the tool selector.

The ensuing unchanged-source guide sweep passed 487 checks and inspected 35 downloads before stopping on `pages/confluence.html` at 390px. Thirty-two routes completed; the thirty-third opened and focused its guide correctly, but the inherited sticky confluence toolbar intercepted the Prepare button. Independent hit testing and an inspected screenshot measured the toolbar at `y=80`, height `787.875px` in a 900px viewport: the button centre hit `select#cfl-from`. This is pointer obstruction, not a timeout waived by force-clicking. The failed receipt, source-bound bounds and screenshot remain in `docs/evidence/sky/round2-guides-final/`. That directory name describes the attempted sweep, not a pass; the defect requires a corrected candidate before final acceptance.

Peer review of the newly exposed chart adapters confirmed that sparse JavaScript `bodyIds`, `natalPoints` and `aspects` arrays could pass a `forEach` validator. Indexed density validation now rejects them. The house-table fallback also missed exactly +66° latitude: the returned grid included a 67° Regiomontanus corner while claiming Placidus. It now chooses one house method from both grid latitudes and explains the fallback. An independent recheck confirmed all three sparse arrays are rejected, the +66° grid is uniformly Regiomontanus with a grid warning, and the −66° grid remains Placidus. These local issues and the fixed partial-interval transit endpoint are documented in `docs/evidence/sky/round2-chart-adapters.json`; they are not evidence for historical predictive validity.

| Corrected phase | Widths | Checks | Downloads | Receipt |
| --- | --- | ---: | ---: | --- |
| Chart and reading | 320, 390, 1440, 1920 | 237 | 40 | `docs/evidence/sky/round2-chart/receipt.json` |
| Timeline and replacement jobs | 320, 390, 1440, 1920 | 111 | 20 | `docs/evidence/sky/round2-timeline/receipt.json` |
| Alignment and ICS | 320, 390, 1440, 1920 | 153 | 36 | `docs/evidence/sky/round2-alignment/receipt.json` |
| Corrected assistant | 320, 390, 1440, 1920 | 117 | 12 | `docs/evidence/sky/round2-assistant-corrected/receipt.json` |

These four phases passed 618 checks and inspected 108 downloads. Each had no source drift during its own run; the phases still span successive revisions and do not form the final frozen acceptance. The corrected assistant phase used eight local mocked requests, with no provider inference. The 720px check is explicitly a CSS viewport reflow proxy; it is not a measurement of browser zoom or a physical phone.

## Round 3: held-candidate review and targeted corrections

The first held candidate was reopened for concrete defects, before acceptance: the mobile confluence toolbar obstruction above; reading links resolving local sources beneath `/pages/assets/` rather than the application root; and guide inputs that could confuse internal engine arguments with actual MCP adapter arguments. The failed held candidate and subsequent corrections are separate evidence, not multiple accepted rounds of an unchanged artifact.

The source-link correction uses a module-derived application root. Independent `round3-source-link-correction/receipt.json` passed 67 checks and inspected ten downloads at 390px with no source drift, runtime errors, missing resources or external requests. Actual HTTP responses for all four local reading sources were checked from both `/astrology-sim-ant/pages/calendar-atlas.html` and the nested `/astrology-sim-ant/pages/calendars/western.html`; response status, byte length and content hashes are recorded. External scholarly links were inspected as URLs, not fetched by this offline browser gate. The test driver gained these endpoint checks at SHA-256 `ca15791aec243e953cb1943809e95248cf1d6bbb36c3a8abd012afe6cbe0e6fe`; the earlier failed guide attempts retain their original driver hash `3944063ae120b58d56ddc1de62201299fa28cf0bbdefc3a3893295e70bc9231c`.

The corrected guide sweep then passed **1,886 checks and 126 inspected downloads**, completing all 90 registered guide routes at 390px and seven representative routes at 1440px. All 95 capability guides were exported once at 390px. Source/MCP scope, immediate shortcut focus and Tab continuation, private-storage exclusion, preview invalidation and normal pointer activation were verified. The confluence route now passes without force-clicking after its narrow toolbar stopped being sticky. Every available adapter schema was expanded in the browser, parsed and compared with the actual `TOOLS` contract; downloaded and previewed packets retain that same schema. Explicit counterexamples verify that `vedicChart`, `boyMoonSidLon`/`girlMoonSidLon` and `dataset` remain internal engine arguments rather than MCP requirements for Prasna, Kuta and world events. A guide/reference workflow with no adapter retains an empty contract list.

This targeted sweep is `docs/evidence/sky/round3-guide-correction/receipt.json`, SHA-256 `83ca587325c2c6c458e9bfecc4d78b2476df2fdff07f9447e5aa73f0883347f4`, bound to driver `6741c55c5c58f75a1aedc643088c19d11bc0e73e19581568864aee1cb230856a` and 470 product files. It reported no source drift, runtime exceptions, missing local files or implicit external requests. Its 390px and 1440px screenshots were inspected. Route coverage verifies the shared guide integration; it does not replace calculator regression tests or establish hosted MCP availability.

An additional UI-owner desktop probe exposed a remaining shortcut issue outside that sweep's seven desktop representatives: Confluence retained its desktop sticky toolbar over the focused summary, despite clearing the global header. The prior passing receipt remains scoped to its actual routes and checks. A page-specific scroll margin corrected shortcut arrival; a subsequent reverse-Tab probe still found the Open ChatGPT control behind the toolbar. The shared guide therefore gained a scoped focus-scroll correction. The independent driver now includes Confluence among desktop representatives, hit-tests the focused summary against the real topmost element, and traverses its enabled controls forward and backward using actual Tab keys. It verifies focused controls after an animation frame and records their bounds and topmost hit target. These additions are bound to driver `2588a5d5694a63693ef6f6f36264dcebd3d102f8a4ad7986389a46f9a5f01275`; the prior 1,886-check pass is not relabelled as covering them.

The first combined attempt against corrected manifest `8942ae7cb3c3ab3c79a82ecb28401419765f463ae1e6710aab3e7c2fd7766eba` stopped after 755 checks and 92 downloads on a further real obstruction: the 390px Book I master route's sticky results rail covered the focused guide summary. The summary occupied `y=129.094–178.891px`, while `nav.rail` occupied `y=80–230.969px`; centre hit-testing reached the rail. Its failed receipt is retained at `docs/evidence/sky/round3-corrected-final/receipt.json`, with independent bounds and an inspected diagnostic screenshot in the same directory. Despite the attempted directory name, this is **not an accepted final run**. It had no source drift, runtime exceptions, missing files or external requests. The source/driver gates were not reached after the failure; drift was still recorded by cleanup. Static follow-up identified shared rail and filter-bar patterns on other routes, requiring a general visible-obstruction correction and another unchanged-source combined attempt.

The general correction also made the guide span both columns on desktop pages with results rails. Driver `9c0d8a0c6ee4654f1fef4467fb33af76d4509ceac478cd3c4a2f0b6d302b92df` adds actual grid geometry and Book I desktop coverage, measuring focus after the animation-frame correction. Its first guide-only attempt, `round3-generic-guides/receipt.json`, caught a further regression after 636 passing checks, one failing check and 36 downloads: following actual export and question invalidation on Confluence at 390px, forward Tab moved the focused preview textarea below the viewport (`y=907.578–1115.094px`). This differed from the preceding owner's initial-state probe. The owner reproduced the exact state and confirmed that the fixed bottom navigation's computed `top` resolved to `832px`, not `auto`, causing it to be misclassified as a top obstruction. The failed receipt records no source drift, errors, missing files or external requests; it is retained for correction of that classification.

## Final unchanged-source acceptance

The corrected obstruction handling classifies the actual covering element by its nearest viewport edge. The subsequent four-width guide-only gate passed **2,801 checks and 194 inspected downloads**, completing 117 visits: all 90 registered routes at 390px, plus nine representative routes at each of 320, 1440 and 1920px. This is `docs/evidence/sky/round3-guides-accepted-candidate/receipt.json`, SHA-256 `5cb20fecb739a7bf57f49c09ef2137e8ec56da5be1aedd0d035fda36b2efe817`. It includes actual focused-summary hit tests, forward/reverse keyboard paths, full-width desktop grid geometry, exact schemas and real exported bytes. It reported no source drift or browser errors.

The final **combined** gate then ran from `2026-10-30T02:49:26.598Z` to `02:51:19.911Z` in Chromium `145.0.7632.6`, at all four widths, and passed **3,417 checks with 302 actual downloads** totalling 17,011,158 bytes. These are one unchanged-source run's counts; earlier attempts are not added to them. The receipt is `docs/evidence/sky/round3-final/receipt.json`, SHA-256 `a198a2cc5b4b8732adf107fe69c8ee851656e80c5f0b2994315c56090d874671`.

| Binding or evidence | Final result |
| --- | --- |
| Start manifest | `docs/evidence/sky/round3-final-start.json`, SHA-256 `0633f9d9be867e8e40c903d23872446405cbcd851abf09601449c6b4e35c892e` |
| Browser driver | `9c0d8a0c6ee4654f1fef4467fb33af76d4509ceac478cd3c4a2f0b6d302b92df` |
| Product manifest digest | `d53f8e5cdf02c5d0ade48950230597a2effb4736e9b08139a3924bf433d7e342` |
| Product binding | All 470 source hashes match the start manifest, receipt and post-run files; no drift |
| Runtime, missing resources, implicit external requests | Zero |
| Guide coverage | 117 completed visits; all 95 capability exports at 390px; exact contracts for actual registered tools |
| Local source navigation | 20 nonempty HTTP 200 file responses, content hashes recorded, including the nested western-family route |
| Provider transport | Eight requests to the local test-owned SSE fixture; exact reviewed prompt hashes, cancellation and memory-only key behavior checked |
| Visual evidence | All 13 final screenshots inspected: desktop/mobile circle, orbit, timeline, alignment, assistant, tool guide and reverse-focus state |
| Font evidence | Ten actual platform-font diagnostics, no warnings |

**QA verdict: ACCEPT for the exercised sky explorer and shared-guide integration at this exact manifest.** The baseline matrix's geometry, sampling, recasting, alignment, source attribution, consent, stale-state, keyboard and actual-tool-coverage conditions now have passing combined evidence. Earlier failed receipts remain intact and are explicitly labelled above. Repository-wide release gates and remote CI are reported separately by the integration owner; this browser receipt does not claim their execution.

The final gate does not establish historical predictive validity, whole-book expertise, human usability or complete accessibility certification. No live language-model inference, remote Supabase deployment, connected-calendar write, physical-phone or screen-reader test was performed. The 720px check is ordinary viewport reflow, not actual browser zoom. Hosted MCP/provider availability must still be verified in its configured deployment. The preceding atlas's 612 checks and 85 downloads are not reused as evidence for this explorer.


## Inherited release integration

The retained sigil-studio browser test initially used a page-global ChatGPT-link selector. The new guide adds a second legitimate handoff link, so Playwright correctly rejected the ambiguous locator after 33 checks and six downloads. The assertion now scopes the same href to the existing `.sg-ai-section`; no expected value or interaction was removed. Independent QA reviewed the exact selector-only change and confirmed all 470 product files and the sky driver were unchanged. The failed receipt and the complete corrected phase are retained with the release-gate evidence. This test correction does not reopen the accepted calculation/UI source snapshot.


All **25 required release commands passed** on the accepted product snapshot. The command ledger retains 26 attempts, including the original ambiguous sigil selector and its passing correction. [Release summary and file hashes](evidence/sky/release-gates/summary.json) and [exact executed commands](evidence/sky/release-gates/executed-gates.jsonl) bind these results; logs and receipts are retained alongside them.

| Gate | Observed result |
| --- | --- |
| Source audit, full engine and numerical/adapter suites | Pass; audit scanned 129 HTML and 289 JavaScript files, zero problems |
| Source/catalogue/coverage/profile/opgraph/round-ledger freshness | Pass |
| MCP toolkit and actual HTTP/stdio transports | Pass with 71 discoverable tools |
| Six inherited Playwright phases | Pass, including all 129 HTML routes under the Pages prefix |
| Observatory | 121 checks passed |
| Symbolic studio expansion | Corrected complete phase: 331 checks, 51 downloads |
| Cross-method ensemble | 288 checks, 33 downloads |
| Original atlas and event search | 612 checks, 85 downloads on this source snapshot |
| Independent Puppeteer sweep | 129 pages, zero errors; nine structured drives executed, two inherited descriptor warnings retained; 89 prose descriptors are page-load coverage |
| Pinned SkyLens contract and browser integration | Pass against `2b2aa089009db3ddedc2256a7a5456b402b23962` |

The accepted product and sky driver remained unchanged across these gates. The legacy sigil driver correction is separately hashed in the release summary. The historical panel's C3 remains **NOT EVALUABLE**; this work does not convert an unavailable prior validation into a pass. No further local application changes followed acceptance. Exact-head remote CI and its downloaded artifact binding are reported in draft PR #5 and the delivery record; production deployment is not implied by a review-branch run.
