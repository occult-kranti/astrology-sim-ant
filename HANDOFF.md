# Handoff notes — for the next model/build

## Chart relationships — 30 October 2026

Development starts from published `bf27046dd646ac1f7cc25db8770e8dd00ecbb0de` on `feat/chart-relationships`. Read the [design contract](.design/chart-relationships.md), [methods](docs/2026-10-chart-relationships-methods.md), [plan](docs/2026-10-chart-relationships-plan.md) and [review ledger](docs/2026-10-chart-relationships-panel.md) and [verification](docs/2026-10-chart-relationships-verification.md). The pure `core/chart-relationships.js` adapter consumes held canonical outputs; the shared `app/chart-relationships.js` inspector supplies filters, preview, pin and source details. Atlas/family charts and the common Timeline/Newton/Eschatology plate use the same presentation vocabulary. Country sensitivity remains cusps-only.

Keep geometric aspects, Lilly moieties, reception and directed Vedic contacts distinct. Named geometric colors are not outcome classifications. Use full-precision held sidereal rows, never a reconstructed shift from the rounded public ayanamsa. Both displayed endpoints must exist in the chart; the atlas explicitly omits unplotted lunar nodes. No geocentric contact edges belong on the heliocentric projection. Calendar ring colors derive from IDs, and selected/drawn overlay IDs remain distinct under the eight-ring cap.

Hover/focus is presentation-only: no cast, worker, network or storage. The optional atlas Vedic cast has a single-current-frame cache keyed by explicit study context. Clear stale alignment before recasting; guard focus restoration so Escape cannot revive a preview. Preserve canonical export serializers and privacy boundaries; SVG exports may carry public relationship/view state without observer coordinates. Shared CSS stays scoped to avoid existing country `cr-*` class collisions. Root owns final verification/publication, with at most two actual Chromium processes. Development evidence during concurrent edits is diagnostic, not acceptance.

Local acceptance is complete: 733 engine assertions; 134 pages with zero browser errors and two inherited descriptor warnings; all nine generators and the current ledger; 325 held relationship checks with 15 verified actual downloads and 22 root-reviewed images; 3,520 inherited sky checks and 517 inherited date checks. All 543 final gate source entries match. The sky legacy receipt retains download metadata only, whereas date and new relationship bodies are retained. The cloud GitHub credential initially returned HTTP 401, then recovered and allowed the tested branch to be pushed. Actual publication must be checked against the pull request and release receipts. External CI audit and live drivers are ready under `/workspace/setup-validation/chart-relationships/`.

## Date wayfinding — 30 October 2026

Work continues from published `fdc184df829fda685a23d69962d121328b68537e` on `feat/date-wayfinding`. The shared `assets/js/app/date-wayfinding.js` component supplies native indexed sliders, source-labelled color categories, hover/focus/tap details and bounded explicit local bookmarks. Page integrations cover the atlas/five family routes, chart timeline, country histories, event horizon, search, Newton and eschatology. Read the [plan](docs/2026-10-date-wayfinding-plan.md), [design contract](.design/date-wayfinding.md) and [panel ledger](docs/2026-10-date-wayfinding-panel.md).

Keep auxiliary controls inside the existing stale/busy/cancel state machine. Calendar lanes share the selected instant; a date conversion is not a favorable/caution rule. Signed horizon indices do not expose their original mixed contributions and must not acquire invented danger classifications. Historical conflict, traditional caution and source claims remain distinct. Source-year/unknown-date records cannot become precise event days. Country presets select modern observers, not national birth charts. Existing canonical engines and export serializers remain authoritative.

Bookmarks use a separate bounded local namespace and require explicit actions. Do not save private births, notes, raw observer coordinates or provider credentials. Restoring a date/reference must not silently restore another study context. Preserve storage-failure recovery and keyboard/touch alternatives to hover. The new bounded browser journey is wired into Pages alongside every inherited gate. Root owns generated assets and release; retain at most two actual Chromium processes. Development runs with concurrent edits are not final acceptance.

Local acceptance: 732 engine checks, 134-page browser sweep with zero errors and two inherited descriptor warnings, all nine generators, and 517 held date-navigation checks with 10 actual downloads and 26 reviewed screenshots (nine new/changed images directly inspected, 17 identical to the prior accepted images). The inherited Newton suite also passed 1,294 checks over four widths with 84 actual downloads. The held frontend manifest and driver did not change. Read [verification](docs/2026-10-date-wayfinding-verification.md) for the corrected focus/bookmark identities, passive-scroll popup regression, source bindings and retained failed runs. This is local acceptance; release metadata and the pull request record actual publication.

## Eschatology evidence atlas — 30 October 2026

Current development is `feat/eschatology-evidence-atlas`. Read the [plan](docs/2026-10-eschatology-atlas-plan.md), [methods](docs/2026-10-eschatology-atlas-methods.md), [Pike provenance](docs/2026-10-eschatology-pike-evidence.md), [tradition sources](docs/2026-10-eschatology-tradition-evidence.md), [experience](docs/2026-10-eschatology-atlas-experience.md), [panel](docs/2026-10-eschatology-atlas-panel.md) and [independent review](docs/2026-10-eschatology-atlas-review.md). Previous Newton work was merged in PR10 as `a8359657b652575bfd4ed6bfe10c87e8cbb8b65e`, whose tree matches this branch's starting candidate `5abcf3cde1c226f18f963d020f77310ff9e3047f`. The older pending notes below are historical checkpoints. Production run41090982453passed all jobs; the independent audit passed599checks, and the successful live run passed80checks with24actual downloads and8reviewed images, binding1,400responses across89unique paths to that exact release.

The new page synchronizes a typed evidence graph, date-role timeline, claim ledger and source inspector. Preserve the distinction between curated relationships and generated catalogue-index links. Neither graph distance nor a shared quotation implies affiliation or coordination. Retain six date roles and exact source precision, dependence, reading depth and edition conflicts. The alleged Pike letter is not authenticated by the inspected reproductions; its claimed1871date is not a WWIII target. Carr's narrative and quoted block, and later quote-boundary variants, are distinct. A reported museum reply is not acquired correspondence. Newton2060and2370remain separate conditional arguments.

Calendar frames require explicit source-date or study-date selection, clock, observer, zone, house system and fold policy. Only an eligible documented exact day can be cast directly from a source field. All other source fields stay source-only; deliberate study dates are independently labelled. Available frames reuse canonical1900–2100geometry,13civil conventions and3namedMoon-reading lenses for study. No new tradition-specific prediction calendar, outcome score or national-belief classifier is added. Unknown clocks remain unknown. Dirty/cancelled work must not leave active stale exports or chart links. Reading downloads use held canonical serializers.

The two new strict read-only MCP tools are `workbench_eschatology_atlas` and `workbench_eschatology_frame`. Source support is distinct from hosted deployment or provider inference. Regenerate browser MCP contracts, tool/search catalogues and horizon source bindings after authored changes; the four existing horizon data parts should remain numerically unchanged. Keep the inherited five gates, dedicated independent/browser tests and actual SDK HTTP/stdio tests. Limit actual Chromium concurrency to two. Publication is authorized after exact-head CI and production/live verification, not established by development or local tests alone.

Local atlas acceptance is complete:731full engine checks,275independent semantics,75focused checks,116actual MCP transport checks,134pages withzero browser errors, all9generator checks, and631held atlas browser checks with64downloads/44reviewed images. Root verified unchanged534product files and2drivers. Read [verification](docs/2026-10-eschatology-atlas-verification.md) for retained failures, corrections and exact receipt hashes. All4existing horizon data parts are byte-identical to baseline. The current catalogue is78MCPtools,100capabilities and95guide routes. This records local acceptance; the PR/release metadata identifies actual publication.

## Newton chronology and historical event research — 30 October 2026

Work on `feat/newton-calendar-chronology` starts from published `b7793a47d34e048ebd8f06c8a3998864d5136e13`. Read [the plan](docs/2026-10-newton-plan.md), [source reconstruction](docs/2026-10-newton-sources.md), [comparative source ledger](docs/2026-10-eschatology-comparisons.md), [calculation methods](docs/2026-10-newton-chronology-methods.md), [inverse-method limits](docs/2026-10-calendar-inverse-methods.md), [panel](docs/2026-10-newton-panel.md) and [independent review](docs/2026-10-newton-review.md).

The new page reconstructs two source-bound CE arithmetic branches and retains four unresolved/deleted/unfinished source-only variants. A chosen day is never a Newton prediction. Calendar/sky frames reuse the canonical1900–2100engine; complete365/366date year surveys distinguish first-observed label changes from solved astronomical events. Only two named computus projections are supplied; no complete future religious schedule is inferred. Six selected HKO2060fixtures are a narrow external check, not whole-calendar validation.

The existing country page retains its sixteen founding/status records and adds twenty-eight source-qualified historical records for seven observers. Its committed accepted-research snapshot preserves the previously audited descriptive protocol, thirteen calendar labels, three assumed clocks, shared groups and missing paired data. Use `node assets/data/country-events/generate.mjs --check` and `node assets/data/country-events/verify.mjs`. Do not convert these features into national belief attribution, successful-attack timing, valid p-values or future conflict predictions.

Current generated catalogue:76MCPtools,99capabilities,94guide routes. `workbench_newton_chronology` is strict and stateless; full-year survey remains local. No hosted MCP deployment, model inference/training or Supabase deployment is established. Preserve the source qualifiers and inherited guide focus fix. Keep at most two Chromium processes active. All required gates, independent review, exact-head CI and production/live source identity remain release requirements; development notes alone do not prove deployment.

Local acceptance completed:729engine checks;133HTML/316JS audit withzero problems;133-page Chromium sweep withzero errors andtwo inherited warnings;89focusedNewton and122independent semantic checks;1,294held browser checks,84downloads,32directly reviewed screenshots andunchanged526product-file bindings. Source/statistics/UI roles completed three actual review rounds with the corrections recorded in the panel. Read [verification](docs/2026-10-newton-verification.md). This paragraph does not establish publication; require exact-headCI and deployedrelease identity.

## Synchronized chart timeline — 30 October 2026

Work on `feat/peaceful-calendar-timeline` begins from published `ae94fb003f00f3456635121e81f6616a6d6118a3`. The preceding country study was merged in PR8 and production run41026989961 passed all four jobs. Live country/horizon receipts verified410fetched responses and17actual downloads against that release. Older pending statements below are historical checkpoints.

Read [timeline plan](docs/2026-10-calendar-timeline-plan.md), [engine](docs/2026-10-calendar-timeline-engine.md), [study methods](docs/2026-10-calendar-timeline-methods.md), [history sources](docs/2026-10-calendar-timeline-history.md) and [independent review](docs/2026-10-calendar-timeline-review.md). A new page synchronizes the supported sky, tropical/sidereal chart and calendar families through a bounded daily slider. The worker is replaced on edits/cancellation; exact input/clock context and source limits remain attached. Unknown historical clocks are not national nativities. Peaceful study profiles remain editorial; dialogue/ceremony have no invented timing rule. There are no war forecasts, military objectives or future country rankings.

Current source catalogue:75MCPtools,98capabilities,93guide routes,132HTMLpages. `workbench_calendar_timeline_frame` computes one selected frame from explicit inputs; source support does not deploy an authenticated MCP service. No provider inference, training or Supabase deployment is claimed. Source/calendar/year bounds remain1900–2100; a window contains at most3660dates, including unavailable clocks. Source-markers and frame exports are deliberately separate and visibly labelled; historical-record JSON retains the source context.

Follow the five required repository gates, actual MCP transport checks, inherited browser suites and full-grid stress job. Regenerate horizon source bindings after catalogue changes; compare existing data bytes instead of assuming numerical parity. Publishing remains authorized. Require current exact-head CI, production workflow and deployed release/source identity before claiming this new timeline is live.

Three review rounds are complete. The final held timeline passed 2,067 browser assertions and 125 independent semantic checks, with 44 archived real downloads and 32 inspected screenshots across four widths. Root rehashed all 505 product files and both test drivers. Full engine (725), audit (132 HTML/310 JS), all-page sweep (132 pages, zero errors) and eight generator gates passed; two inherited descriptor warnings remain. Read the [panel](docs/2026-10-calendar-timeline-panel.md) and [verification](docs/2026-10-calendar-timeline-verification.md). Production publication is a separate acceptance step recorded in the PR and deployed release metadata.

## Country histories — 30 October 2026

Development branch `feat/country-calendar-history` starts from the verified published `e049fc9dfa51694f254552862f82cd917964676a`. The prior horizon and mobile focus correction are live: production Actions run41017304502 succeeded, deployed `release.json` matched e049fc9, and independent live receipts bound all462 fetched source/data responses to that Git tree. The older “current work” failure notes below describe the preceding diagnosis, not the current production status.

Read [the country plan](docs/2026-10-country-history-plan.md), [methods](docs/2026-10-country-history-methods.md), [engine contract](docs/2026-10-country-history-engine.md) and source ledgers. Six specialist AI agents and the root integrator implement and review sixteen historical markers for six countries. Every source clock remains unknown. The page supports source comparison, civil labels at an explicit assumed local noon, and optional assumed historical-day house geometry. It does not accept arbitrary/future dates or objectives, infer national birth times, or rank military timing. Three pre1900 US markers remain outside the canonical range. Modern city coordinates and IANA zones are qualified approximations. Preserve the Iran translation discrepancy and separate declarations, legal effect, adoption and UN status.

The current source catalogue is74MCPtools,97capabilities,92tool-guide routes and131HTMLpages. `workbench_country_history` is a strict, read-only source adapter accepting one to six curated record IDs, one of four house systems and optional historical sensitivity. It exports no outcome score. Source support is not hosted MCP deployment. Both real SDK HTTP-handler and child-process stdio contracts have a focused test. No provider inference, model training or Supabase deployment is established by this work.

Use the required five verification gates before committing, retain all inherited journeys, and regenerate horizon source bindings after catalogue changes. The user has authorized publication after verification. Confirm the exact candidate and production run, then live `release.json` and the new page; do not infer publication from a local build or a pull-request check.

## Event horizon through 2031 — current work, 30 October 2026

The horizon was independently accepted on `7c443690` and merged in PR #6 as `cf4d936a`. Production run41012464661 passed MCP and all45 full-grid stress checks but correctly stopped publication when an inherited Life Trajectory mobile guide focus assertion failed. The exact reviewed code had an asynchronous loading race; passing PR CI did not establish production success. The corrective branch `fix/guide-focus-during-load` preserves the full dataset and changes only shared focus handling plus regression/evidence. Read the [retained failure and correction](docs/evidence/horizon/guide-focus-correction/README.md). The last verified published release at diagnosis was `3f76845f2d516d7a4bd507afa0508e6929c831e2`; require current Actions and `release.json` evidence before claiming the new release is live. **PR #5 was merged and its Pages deployment verified** before this task. Its older draft/hold statements below are historical. The current user explicitly authorizes push and publication after stress testing; no additional permission is needed for the reviewed release.

Read [horizon methods](docs/2026-10-horizon-methods.md), [panel ledger](docs/2026-10-horizon-panel.md) and [verification](docs/2026-10-horizon-verification.md). The new `event-horizon` route uses a complete1525date×3case preset through1January2031, with all13calendar slots and4separate editorial profiles per sample. Custom supported dates begin1January2026. Do not hide unavailable samples, collapse exact score ties, treat local-noon cases as the same instant, or infer a full-day verdict from one clock. Declared counters are top-level orchestration calls; guidance recomputes some chart facts internally.

Keep published observances separate from converter projections and source-only eschatology. HKO/GovHK and the generating ICU78.3/CLDR48 disagree for selected Chinese New Year dates; preserve both and show mismatch. No whole-calendar validation, universal auspiciousness, dated prophecy or exhaustive religious coverage is claimed. The sources retain issuing region, variant, boundary, locator, edition, rights and reading status.

`generate-horizon-preset.mjs` follows the transitive scientific import graph, splits case/astronomy data, and writes source/metadata/exact-manifest fingerprints. The version module is excluded from its own graph. Rebuild MCP contracts before regenerating the preset, then run its `--check`. The loader checks artifact binding and scientific structure; stale mixtures fail visibly. The full-window brute/optimized stress job and inherited verification/MCP jobs all gate Pages deployment. `browser-horizon.mjs` verifies actual complete downloads, cancellation, stale inputs, clocks and integrity at four viewport widths. Keep failed receipts, separate build/test snapshots from publication, and limit Chromium concurrency to two.

Current source catalogue:73MCPtools,96capabilities,91guide routes. Horizon remote scans are bounded31days/twocases; day details require an explicit case/date. The static Pages frontend is not an MCP server. This task does not establish a redeployed authenticated hosted MCP service, Supabase, provider inference or a trained model. Public exact release identity comes from deployed `release.json` and Actions evidence.

## Interactive sky, source interpretations and tool coverage — 30 October 2026

Continue on `feat/mobile-calendar-observatory`, extending `fb656a8047e93b8d49227d92aa9edc3e9b1fce50`, in draft PR #5. Read the new [plan](docs/2026-10-sky-plan.md), [panel ledger](docs/2026-10-sky-panel.md) and [verification](docs/2026-10-sky-verification.md). This is a separate multi-round pass with the same six independent AI-agent perspectives; numerical claims and review counts in older sections below refer to those historical revisions. The coverage JSON and generated MCP catalogue are authoritative for current capability/tool counts.

`sky-dynamics.js` and its worker supply ten apparent geocentric bodies, true heliocentric J2000 vectors, 20 licensed modern catalogue stars, opt-in historical longitude-only markers, and bounded calculated timelines. The frame and accuracy distinctions in [the method report](docs/2026-10-sky-dynamics.md) are load-bearing. Do not double-rotate sidereal overlay sectors, connect coarse lunar points into a misleading trajectory, or label a numerically solved event infinitely precise. The HYG extract has a separate CC BY-SA notice; it is not relicensed as application code.

`sky-explorer.js` extends the existing atlas and all five family pages. Deep chart is the default; the original Sun–Moon view, exports and birth panel remain. Dirty moment/selection/comparison inputs invalidate dependent plots, prompts and exports. The applied comparison zone/mode/fold policy must reach AI packets exactly; a fallback to the default same-zone comparison is a real regression. `calendar-alignment.js` distinguishes same instant, same wall clock, geographic zone correctness and external-provider connection. ICS export is a manual study marker, not an authenticated synchronization service.

`sky-interpretation.js` reuses canonical facts and records selected Lilly/Agrippa/Rao rules, source differences and input certainty. New readings distinguish textual same-sign combustion from legacy separation-only behavior, and Rao's equal sunrise-day hours from Agrippa's reported daylight/night hours. See [source reading and rights](docs/2026-10-sky-sources.md); no full-book reading or human tradition authority is claimed. The reusable `.claude/skills/sky-interpretation-review/SKILL.md` captures these review rules.

The new sky assistant provides local deterministic readings and a separate optional provider response. It requires an exact preview and explicit send, keeps provider keys in memory, omits observer-dependent information by default, cancels on context changes, and inspects citation identifiers without claiming semantic truth. `shared.js` mounts a separate, collapsed tool guide using actual registry routes; that guide never scrapes current charts or saved records. Strict MCP adapters recompute from explicit arguments, and asynchronous tools retain an awaited response envelope. Preserve method fallback, source limits and explicit oracle draws. Renderers and reference-only entries remain distinct from callable calculations.

The local retrieval corpus and optional Supabase full-text-search migration are described in [AI/RAG setup](docs/2026-10-sky-ai-rag.md). Neither a local SQL test nor a prepared migration is a hosted deployment. Regenerate MCP discovery, adapter coverage, tool coverage, the source-reference pack and search index from their authored inputs; run their `--check` gates before freezing. No real provider inference or model fine-tuning is established by mocked transport tests.

Three review rounds are complete, with six final scope acceptances. The unchanged-source combined sky suite passed 3,417 checks and inspected 302 downloads across four widths, including 117 guide visits. The dated panel/verification reports retain earlier failures and their corrections; all 25 required release commands passed, with two inherited descriptor warnings retained. Release evidence is under `docs/evidence/sky/release-gates/`; exact-head remote CI belongs to the PR/delivery record. Preserve all inherited gates and run `scripts/browser-sky.mjs` as well as the retained atlas/site/MCP suites. Keep at most two Chromium processes active. Prefer CI-pinned Playwright 1.58.2/Chromium 145 and record actual platform fonts. A draft PR is separate from production Pages, hosted MCP and Supabase deployment.

## Desktop calendar atlas and event laboratory — 29–30 October 2026

Continue on `feat/mobile-calendar-observatory`, extending `0d115c9`, in draft PR #5. The new [five-round atlas ledger](docs/2026-10-atlas-panel.md) and [verification](docs/2026-10-atlas-verification.md) are separate from the earlier review passes below. Six independent AI-agent roles provide source, calculation, implementation and cross-review evidence; they are not human cultural authorities. The [plan](docs/2026-10-atlas-plan.md) records flows and deliberately unavailable scope.

Seven new routes add `pages/calendar-atlas.html`, `pages/calendar-search.html` and five `pages/calendars/` family pages. The zero-build static stack and all original routes remain. The atlas has seven families and 32 variants, including 24 Chinese solar terms with selected 2026 CWA minute/HKO day fixtures. Seven variant implementations remain unavailable; this is distinct from the seven pending civil-family validation statuses, which are unchanged. `exportCalendarAtlas` is the public serialization boundary: it retains only selected rows/methods/referenced sources plus explicitly named shared astronomy. Do not export internal `.comparison` accidentally.

`personal-calendar.js` keeps known and unknown birth times distinct. Unknown time samples 25 points through the actual zoned civil day, ending one millisecond before its exclusive boundary; it does not infer an ascendant, houses, exact returns or Vimśottarī sequence. Exact-time returns are opt-in. Birth data is memory-only, omitted from default public URLs and exports, and never implicitly sent to an AI provider.

`calendar-search.js` and its worker own bounded local scans, exact-grid reference/optimized equality, source-qualified event signatures and descriptive shifted-control comparisons. Default windows allow 366 dates; advanced scans explicitly allow up to the supported 1900–2100 grid. Returned rows are capped separately from scanned/matched totals. Missing/ambiguous samples, cancellation, stale results, control overlap and shared inputs stay visible. Nine event examples are a documented convenience set, not a representative outcome dataset. See the reusable `.claude/skills/date-event-search-review/SKILL.md` and its agent template before extending inference or ranking.

At that historical atlas revision, source MCP had **15 read-only allowlisted tools**, including `workbench_calendar_atlas` with selected-method output and explicit prayer options. It rejects birth fields. Actual stdio/HTTP tests are separate from hosted service availability; the earlier hosted service has not been updated by this branch. Pages only serves the frontend.

All five atlas rounds are complete, with six explicit final acceptances. The frozen atlas gate passed 612 checks and inspected 85 downloads; 20 local release commands passed, including both 129-page browser sweeps. The legacy harness retains two documented descriptor warnings, and the historical ledger retains C3 NOT EVALUABLE. Initial CI exposed a font-dependent ranked-row height failure. The CSS correction retains full count text within horizontal scrolling; corrected Chromium 145 runs passed 612 full checks and 178 focused DejaVu checks. Seven required local gate commands, including the 129-page sweep, passed again. Read the verification report’s reopened R5 section and corrected source binding rather than treating the initial local run as proof of remote success. The new `scripts/browser-atlas.mjs` is wired into Pages verification alongside all inherited engine, browser, MCP and pinned SkyLens gates. Final acceptance requires an unchanged product/driver snapshot and actual exported-byte checks. Keep no more than two Chromium processes active in this environment. Regenerate search/MCP catalogues after relevant changes. Review-branch CI and production deployment remain separate; this task does not merge or publish main. Counts and status statements in the historical snapshots below describe those earlier revisions; that atlas revision had 15 MCP tools. The current generated catalogue supersedes this historical count.


## Previous six-member, three-round improvement pass — 29 October 2026

Continue on `feat/mobile-calendar-observatory`, extending baseline `3be3d46`. Read the [panel ledger](docs/2026-10-ensemble-panel.md), [verification](docs/2026-10-ensemble-verification.md), and five linked method/source reports before expanding claims. These are six AI-agent roles with bounded source reading; selected passages, source failures and unresolved authority questions remain explicit.

`core/comparison-evidence.js` recomputes the canonical context and explains frame offsets, circular residuals, shared lunar derivations and differing conventions. Its app component supports stale invalidation, lazy homepage mounting and same-observer focus preservation. It is included in comparison JSON/Markdown. Shared inputs are dependencies, not independent corroboration; exact partition boundaries retain the engine's floating-point qualification.

Recipe import validates bounded geometry and strict field types, never inserts supplied SVG, and labels imported provenance unverified. Private restoration requires explicit consent and a geometry match. AI packets independently recompute civil rows and rules; location and rule-evidence controls are separate and default off. The default minimal packet remains unchanged. Source MCP now has 14 tools including `workbench_explain_guidance`; hosted deployment/authentication and external inference are separate work.

Two-event study samples preserve source precision, acknowledged observer-local civil noon, actual UTC elapsed hours and shortest signed angular displacement. Event records/review dates were not refreshed by this comparison feature. Mobile tables use named keyboard scroll regions and overflow hints. Standards validation uses the canonical engine, with direct profile navigation, search recovery and stale-task clearing.

Direct civil conversion now checks both UTC and observer-local1900–2100 years. Selected Chinese2025 leap-sixth-month fixtures cite HKO and Taiwan CWA as distinct issuing authorities. Seven pending-family statuses remain unchanged. Edit `.claude/skills/observatory-source-contract/profiles.json` before regenerating profiles; never hand-edit generated profiles. The common specialist contract now covers imported provenance, strict schemas and source/table discrepancies.

Preserve all inherited gates. The new `scripts/browser-ensemble.mjs` exercises five workflows at320/390/1365px, validates actual downloads and binds its driver/product hashes. It is wired into Pages CI. Run it after final asset generation with `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium` when using this environment's installed browser. The `ensemble` evidence directory records this pass separately from prior releases. PR #5 remains a review branch; production publication still requires verified main.

## Symbolic studio and explainable almanac extension — 29 October 2026

Continue on `feat/mobile-calendar-observatory`; this work extends the previous review branch. New routes are `pages/sigil-studio.html`, `pages/world-events.html` and `pages/standards.html`. The older Live Symbol Studio and every existing calculator remain separate and intact.

`core/sigil-design.js` reuses the existing squares/symbol engines, provides deterministic geometry and source-labelled paper study recipes. Artwork from `image_gen` is in `assets/img/studio/`, separately identified from procedural SVG output. The optional `mcp/sigil-image-provider.mjs` is a standalone protected adapter, not a mounted MCP tool or live service; configure its model on the server and never insert provider keys into the static app.

`core/day-guidance.js` composes selected existing rule engines without their aggregate score. `app/day-guidance.js` exports `mountDayGuidance(container, comparisonOrInput)` with `update(null)` invalidation and `destroy()`. Hourly work is lazy, partitions real local civil days, and preserves repeated/absent clocks. Opening-portion yoga remains timing-unresolved. No fixed-star alignment is inferred; the displayed rules name what they actually use. Editorial reflection actions are distinct from source quotations. Homepage weekly links lose their href while inputs are stale and are restored only after a valid calculation.

World event dates retain precision, source status, coverage and review age. A local-noon chart requires explicit acknowledgement and an observer; it is not a poll-opening or outcome timestamp. Annual observances and conditional elections remain labelled. Rechecking a URL does not establish the event fact is still current.

Standards and specialist task contracts live in `core/data/observatory-standards.js` and `.claude/skills/`, with reusable agent templates. Keep generated profile outputs synchronized through their committed builder. Node checks are registered in `scripts/engine-test.mjs`; new mobile/export/privacy journeys run through `scripts/browser-studio-expansion.mjs`. Preserve all prior engine, audit, browser and MCP gates. Read the dated source, panel and verification documents linked in README before making stronger interpretation, coverage, deployment or AI claims.

## Calendar Observatory branch — 29 October 2026

Current development: `feat/mobile-calendar-observatory`, based on `5f030c0`.
The redesign preserves all 117 original application routes and adds
`pages/calendar-compare.html`. Read the new dated research, plan, AI, panel and
verification documents linked at the top of README before changing its methods.

The frontend remains a zero-build static ES-module site. Run from this checkout:

```bash
python3 -m http.server 8030 --bind 127.0.0.1
node scripts/engine-test.mjs
node scripts/audit.mjs
node scripts/round-ledger.mjs --check
npm ci --ignore-scripts --prefix mcp
npm test --prefix mcp
```

For browser gates use the existing Playwright installation, or the workflow's
pinned `playwright@1.58.2` with its Chromium. Run `scripts/browser-release.mjs`
and `scripts/browser-observatory.mjs`. Integration journeys additionally use
SkyLens commit `2b2aa089009db3ddedc2256a7a5456b402b23962` via `SKY_LENS_ROOT`;
do not substitute a moving branch and call it the pinned test.
Regenerate the source-backed catalogues with
`node scripts/build-mcp-catalogue.mjs` and `node scripts/build-search-index.mjs`
when their inputs change. The service worker version is bumped for this release;
its lifecycle fixture derives the current version while retaining obsolete-cache
and other-project preservation checks.

`calendar-observatory.js` owns pure, bounded same-instant comparisons and
1–14 local-date snapshots. `instant-boundary.js` isolates unchanged strict parsing;
`calculation-context.js` re-exports the prior public API. The homepage aligns its
two groups to Monday–Sunday using `observatory-schedule.js`. Live refresh reads
the actual unambiguous instant rather than re-resolving a repeated wall clock.
Dirty/frozen inputs suspend automatic updates and invalidate export/AI packets.
No timer runs while the site is closed, and no unattended cloud job is claimed.

All new symbolic quality rows are historical classifications, not active outcome
verdicts. Opening-portion yoga rules have `applicability: timing-unresolved`;
primary-text verification is incomplete, and modern secondary provenance and
citation flags must remain visible. Civil conversions do not infer sunset days,
observed crescents, festivals, personal births, or every culture's calendar.

The new ChatGPT flow previews/copies/exports a minimal source-labelled packet.
It makes no provider call, inherits no ChatGPT session, and excludes geographic
information by default. The source MCP now has 14 tools; the previously hosted
remote endpoint has not been redeployed or authenticated as part of this branch.
Do not claim its three added tools are remotely available until separately verified.
No Supabase connection is needed or present. Existing saved records and older
assistants retain their own documented formats and behaviour.

The branch and PR are review artifacts. The existing workflow publishes only
verified `main`; creating this branch does not replace the production website.
Retained historical handoff notes below refer to earlier releases.

This file is the **environment + architecture + ship-procedure** truth. For *what to build
next and in what order*, read **`ROADMAP.md`** (the reconciled, phased plan). For *the data to
encode and its accuracy caveats*, read **`research/SOURCE-DATA.md`**. The long-form vision is
`MASTER-PLAN.md`; `PLAN.md` is the original (archival).

> **Doc map:** `ROADMAP.md` = the plan (phases + gates) · this file = how the box works + how to
> ship · `research/SOURCE-DATA.md` = cited data + caveats · `MASTER-PLAN.md` = vision ·
> `.claude/skills/` = automation (`verify-site`, `add-data-module`, `ship-bundle`, `accuracy-check`).
>
> **Current environment evidence (2026-10-05):** the historical machine notes below are archival, not portable guarantees. Initial shell networking was unavailable; it was later enabled. Local Node, official MCP transports and Chromium checks now run successfully, with independent GitHub Actions release gates. Never expose credentials or assume a local source commit shares recovered remote ancestry. The remote/source tree match and live-studio release evidence are in `docs/2026-10-05-live-studio-roadmap.md` and the dated verification document.

---

## 1. What this repo is

An interactive, scientifically-honest study edition of **William Lilly's _Christian
Astrology_ (1647)**, with a **real, verified astronomical engine** that runs entirely in the
browser (no frontend build step). The optional `mcp/` backend is a separate process; Pages cannot execute it. The long-term target (see `MASTER-PLAN.md`) integrates
the **_Picatrix_** (astrological magic) via an **Election Engine** that reuses Lilly's
machinery. The geometry is genuine; the interpretations are Lilly's, framed as history.

## 2. Historical build snapshot (superseded by dated release documentation)

Done and **verified in a real browser (0 console errors on all 20 pages)**:

- **Core engine** (`assets/js/core/`): positions, 4 house systems, dignities (essential +
  accidental), almuten, aspects with Lilly's orbs, considerations, planetary hours,
  perfection (translation/collection/prohibition/refranation) + timing, degree tables.
- **New this build:**
  - `assets/js/core/cautions.js` — a single reusable **chart-health engine** combining
    Lilly's considerations + the Moon's electional condition + per-planet accidental
    afflictions (combust, retrograde, cadent, peregrine, besieged) into severity-tagged
    advisories and a green/amber/red **verdict**. This is the seed of the Election Engine.
  - **Master Tool** (`pages/book1/master.html` + `assets/js/app/book1-master.js`) now shows
    the full **Cautions & chart health** panel, per-planet afflictions, and the **ascending
    degree** read by the supplementary tables.
  - **`pages/tools.html`** — a hub linking every calculator + a "what each computes" table.
  - **`pages/workflow.html`** — the **chapter map**: every chapter of each book → concept →
    calculation → worked example → tool, plus the horary/nativity step-flows and the
    Picatrix bridge forward-map.
  - Navigation reworked in `assets/js/app/shared.js`: top nav is now
    `Home · Workflow · Book I · Book II · Book III · Tools · Glossary · About`. The Master
    Index (`pages/contents.html`) and Horary live in the footer + hubs.
  - CSS: advisory/verdict/flowmap/chip classes appended to `assets/css/style.css`.

Roadmap (not yet built) — Picatrix data modules, the Election Engine, Book II/III depth
tools (decumbiture, rectification, hyleg, profections, directions, solar returns), and the
unified master tool. Phases D–F in `MASTER-PLAN.md`.

## 3. Architecture you must respect

- **No build step.** Vanilla ES modules. Pages import from `assets/js/...` with relative
  paths. Shared chrome is injected by `assets/js/app/shared.js`, which computes the site
  root from its own URL (`import.meta.url`) so links work at any depth and under the GitHub
  Pages subpath. **Never hard-code absolute site paths.**
- **Engine is pure & headless-testable.** Everything in `assets/js/core/` (except `chart.js`,
  which touches the DOM) runs under Node directly — no DOM, no globals. Keep it that way:
  put DOM rendering in `assets/js/app/`, computation in `assets/js/core/`.
- **Data is sourced & flagged.** Tables live in `assets/js/core/data/`, transcribed from the
  1647 text with discrepancies noted in comments. Keep that discipline; cite in-file.
- **Reuse, don't duplicate.** `cautions.js` composes `considerations.js` + `dignities.js` +
  `aspects.js`. The Election Engine should compose `cautions.js` + planetary hours + the
  (future) mansion data — do not re-implement dignity/Moon logic.

## 4. How to run & verify (do this before every commit)

```bash
# serve
python3 -m http.server 8003      # → http://localhost:8003/index.html

# headless engine sanity (pure Node, no browser needed) — see section 6 for a template
node ./__enginetest.mjs

# full browser verification (install once, then reuse)
cd /tmp && npm i puppeteer && node node_modules/puppeteer/install.mjs
# then run the harness in section 6; it loads every page and fails on any console error
```

The browser harness must report **0 total errors** and `hdr✓` (chrome injected) on every
page. The engine test must print the equinox Sun at ~0° Aries and the body-part checks
(`Saturn in Gemini → Belly`, `Moon in Aries → Head & knees`).

## 5. How to ship so the bundle applies cleanly (IMPORTANT)

The maintainer applies your work as a **git bundle** that must fast-forward from the current
**remote `main` tip**. To avoid the conflicts that plagued earlier rounds:

1. Branch from the **current remote main** (`git fetch origin && git switch -c <branch> origin/main`).
2. Commit your work there.
3. Create the bundle against the **remote main tip** as the prerequisite:
   ```bash
   git bundle create update-phaseX.bundle origin/main..<branch>
   # verify it lists origin/main as "requires" and your branch as the head
   git bundle verify update-phaseX.bundle
   ```
4. Hand over the `.bundle`. The maintainer runs:
   ```bash
   git fetch <bundle> '<branch>:refs/remotes/bundle/phaseX'
   git merge --no-edit bundle/phaseX && git push origin main
   ```
5. **Do not** `--amend`/`rebase` already-shared commits — it changes SHAs and breaks the
   prerequisite. Keep `*.bundle` out of commits (add to `.gitignore` if needed).

If you can push directly to `origin/main`, just do that and skip the bundle.

## 6. Verification harness templates

**Engine (`__enginetest.mjs`, run from repo root, then delete):**
```js
import { castChart, formatLon } from './assets/js/core/astro.js';
import { chartCautions } from './assets/js/core/cautions.js';
import { planetaryHour } from './assets/js/core/planetary-hours.js';
const d = new Date(Date.UTC(2024,2,20,3,6));
const c = castChart(d, 51.5074, -0.1278, 'regiomontanus');
const ph = planetaryHour(d, 51.5074, -0.1278);
console.log('Sun', formatLon(c.planets.Sun.lon));
console.log('verdict', chartCautions(c,{hourRuler:ph&&ph.ruler}).verdict);
```

**Browser (`/tmp/verify.mjs`):** launch puppeteer
(`puppeteer.launch({args:['--no-sandbox']})`), walk every `*.html`, `page.goto` with
`waitUntil:'networkidle0'`, collect `console`(error)/`pageerror`/`requestfailed`, assert
`header.site` exists, and exit non-zero on any error. (Chromium needs system libs:
`libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libnss3 libpango-1.0-0 libcairo2
libasound2t64 …`.)

## 7. Conventions for new pages

- Copy the `<head>` (charset, viewport, title, description, favicon data-URI, the relative
  `style.css` link) and the closing `<script type="module">` that imports `mountChrome` from
  the correct relative depth and passes an `activeKey` matching the nav.
- Use existing CSS: `.wrap .lede .card .grid.cols-N .data .callout(.lilly/.science) .steps
  .step .pill .chip(.done/.tool/.soon) .advisories .adv-* .verdict .flow-node`.
- Add the page to the nav (`shared.js`) and/or the hubs (`tools.html`, `workflow.html`,
  `contents.html`) so it is reachable.
- Keep the honest-science framing on anything interpretive.
