# Calendar Observatory: independent agent review ledger

This is an AI-agent technical and design panel, not human usability research or endorsement by a tradition's practitioners. The review separates astronomical arithmetic, named calendar conventions, historical symbolic rules, and future-outcome claims.

## Review loop 1 — baseline assessment

Reviewed artifact: repository `5f030c0`, independently exported with `git archive` to an immutable local baseline; no checkout changes. Baseline Chromium route sweep: all117 root/application routes at390CSSpx. Six screenshots captured. Every route returned200, injected chrome, one main landmark, a valid skip target, and zero runtime exceptions, missing local resources, or attempted external requests. `node scripts/engine-test.mjs` and `node scripts/audit.mjs` passed; audit scanned118HTML and249JS files. The extra HTML file is documentation, not an application route.

| Finding | Evidence and impact | Decision/owner | Acceptance check |
|---|---|---|---|
| Date/location task absent from the first useful homepage viewport | `baseline/before-390-index.png`:125px header and introduction fill the viewport; there is no editable moment or upcoming-day result | Accepted; root owns a contextual homepage with clear time/place and weekly observations | An explicit, editable context and computed results are available without another tool's setup |
| Shared chrome consumes125px on mobile | The same screenshot and calendar screenshot; less working area for forms/results | Accepted; mobile-shell agent implements compact header and a reachable primary mobile dock | Header and nav stay usable at 320px; no hidden destinations or clipped focus |
| Existing page overflow in two routes | Full sweep: `pages/incense.html`611px document at 390px; `pages/jung/tool.html`403px at 390px | Accepted; mobile-shell agent to repair responsive constraints | No whole-page horizontal overflow at320/390/1365px; true 2-D data may scroll locally |
| Existing calendar caveats must survive comparison | `pages/calendars.html` names midnight civil display, sunset observance limitations, timezone, lunar-sighting differences and regional scope | Preserve; engine/compare/source agents | Method, boundary, approximation/unavailable state and sources remain adjacent to results |
| Client and backend capabilities must remain distinct | Static Pages frontend, separately hosted/stdio MCP, no inherited ChatGPT session API | Accepted; AI/MCP agent implements explicit source packet and manual handoff | No implicit cloud send, no simulated provider response, no credentials stored by new flow |
| Existing release checks assume11MCPtools | `.github/workflows/pages.yml`, currenttool catalogue | Accepted; root+MCP agent update expected count while preserving original tools | Generated catalogue and backend toolset agree; existing journeys remain meaningful |

Round1 implementation produces a contextual homepage, cross-calendar moment engine and comparison route, redesigned shared chrome, source-aware AI handoff, and new MCP tools. The next loop reviews these changed artifacts; the baseline is retained and is not relabelled as a candidate test.

## Review loop 2 — changed implementation

Reviewed the implemented shared shell, contextual home, comparison engine/page and explicit AI handoff. The new mobile header measured 77px; all original destinations and the new comparison route remained reachable. An independent 24-assertion arithmetic verifier checked offset-equivalent instants, the 12-degree tithi partition, tropical/sidereal zero-point identity, New York 23-hour spring days and both autumn occurrences, invalid-clock rejection, Apia’s skipped civil date and polar unavailable states. This is an implementation review, not independent empirical evidence of astrology.

The expanded browser sweep covered118 application routes at 320, 390 and 1365 CSS px (354 loads). It found no runtime exceptions, missing local resources or external requests, but exposed additional narrow-layout defects in source URLs/transliteration, Confluence controls, library actions, the Rasa grid, and several rendered tools. The shell owner fixed these with wrapping, shrinkable controls, correctly positioned local scrolling containers and constrained action buttons. No global overflow-hiding rule was used. Existing Studio symbol/trace journeys exposed a separate 320px overflow after calculation; the same targeted responsive corrections fixed the actual populated state. The final candidate is swept again in loop 3.

| Finding | Decision and actual revision | Acceptance check |
|---|---|---|
| New homepage main ID did not initially match the injected skip target | Shared shell derives the skip target from the actual main ID | Follow injected skip link on every route |
| Several pre-existing long URLs and specialist controls failed 320px reflow | Shared shell wraps prose/citations and locally scrolls genuinely two-dimensional data; library actions and named controls shrink within their containers | Full354page/viewport sweep, populated Studio states and retained text alternatives |
| Cross-tool links retained the instant but forced the Workbench observer zone to UTC | Comparison owner now supplies actual local fields, offset and fold for the selected IANA zone; Vedic offset-only link explicitly names its separate weekday convention | Kiritimati and repeated-clock links preserve instant and applicable context |
| A historical yoga rule applied only to an opening portion but lacked limb transition times | Domain owner changed new classification wrappers to `applicableAtInstant:null`, `verdict:null` and explicit `timing-unresolved`; UI displays the limitation and secondary-source/primary-text-verification status | Parigha regression at Delhi 2026-10-29T12:00Z cannot become an unconditional active avoidance outcome |
| Service-worker lifecycle fixture assumed the previous release version remained current | Root updated the test to derive the current cache identity while retaining obsolete-scope cache deletion checks | Existing lifecycle test and complete engine gate |
| A driver tried to select a control inside a closed disclosure | Corrected the test to open the native disclosure as a user would; this was not a product defect | Corrected109-check UI journey run passes |

The corrected primary journeys passed 109 checks across320,390and 1365px: automatic minute/midnight/Monday rollover, frozen and live DST handling,14-day export, 13 named civil conventions, stale-output guards, explicit geolocation, default/minimal and opt-in AI disclosure, clipboard failure, manual ChatGPT handoff, full mobile navigation and the original collection disclosure. That run had zero runtime exceptions, missing resources or outgoing requests. It was followed by the final source-bound run below.

## Review loop 3 — final release candidate

Final product owners froze their files after the loop 2 corrections. The final browser harness records SHA-256 hashes of all product assets, pages, root documents and MCP source/lock files before and after its run, verifies they remained unchanged, and binds its own script hash. Documentation/evidence writes are deliberately outside that product manifest.

A final visual review found that two-column native date/time inputs clipped their contents at 320px even though document-level reflow passed. Root and comparison owners stacked those controls at 480px and below, then the independent harness added minimum readable-value space, type size and target-size checks. The final corrected source-bound run passed 354 page/viewport loads and 121 checks, including those 8 new checks, on an unchanged 406-file product manifest. The strict request gate also exposed missing inline favicons; those were added before the final run.

All 6 isolated release phases passed 15 modern user journeys plus 119 HTML entries. The original one-process all-mode failure is retained, not relabelled. The legacy Puppeteer gate returned 0 page errors across 119 HTML files, while 2 of 9 structured historical descriptors remained warnings; 89 prose entries were not executed semantic journeys. Current Workbench flows have separate modern journey evidence. No test assertion or page was dropped to hide a product failure.

Final gate results are recorded in [the verification report](2026-10-calendar-observatory-verification.md). Screenshots are rendered Chromium evidence; automated checks do not constitute a human mobile study, screen-reader audit, tradition-specific scholarly review, or scientific validation of predictions. The new remotely hosted MCP tools, personal ChatGPT connection, optional external account calls, all-cultural coverage, and background activity after the browser closes are not claimed as verified.

