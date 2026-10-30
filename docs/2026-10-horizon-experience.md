# Event horizon interface and review

Baseline `3f76845f2d516d7a4bd507afa0508e6929c831e2`; branch `feat/event-horizon-2031`. This is the UI role in a six-agent panel, not participant research or religious authority. Scope: one new event-horizon page; existing search, atlas and personal tools remain unchanged.

## Round 1 diagnosis and design contract

The existing Calendar Research Lab is an experiment builder. Its three setup columns expose useful criteria and methods, but results follow substantial setup. It also inherits a default 366-date guard and a retained-result cap; neither can stand in for the complete 2026-10-30 through 2031-01-01 horizon. The new page is an exploration surface over complete calculations rather than a second experiment-building hub.

Design Partner `create` mode was applied after reading the existing atlas/mobile design records, the mode contract, foundations and accessibility instructions. The established warm-paper, green-black ink and restrained copper identity remains. Serif date headings, aligned numerical evidence and a real daily profile plot supply the visual character. No new framework, external font, decorative three-dimensional scene or unsupported universal score is introduced.

The first task is choosing a public case, a named purpose and a civil date. The main instrument puts the date, sample instant, declared profile and its evidence together. A native daily slider and date field reach every date, including unavailable samples. The plot is a view of the chosen profile; no curve is drawn across missing results. Astronomical events and observances are contextual rows and filters, never additional favorable or caution contributions.

The complete ranked ledger retains ties, missingness and source-qualified contributions. Pagination limits only visible rows; it never silently caps the computed or exported date set. A comparison disclosure places public cases and purpose profiles on the same civil-date label while exposing their different actual UTC instants.

Advanced observer, clock and date-range changes form a separate local recomputation workflow. Editing these settings invalidates exports and labels any retained view stale. A worker run has visible progress, cancellation and recovery; late replies cannot reactivate an obsolete result. Cancellation does not publish a partial ranking. Static reviewed cases are a distinct, recoverable starting state.

The date evidence panel is an in-flow native disclosure, adjacent on desktop and beneath the instrument on narrow screens. It avoids a focus-trapping modal or a new sticky toolbar. Forms retain visible labels, 16px mobile text and 44px controls; true two-dimensional tables scroll locally. Keyboard alternatives duplicate all chart navigation. Current inherited fixed navigation must be measured during actual focus testing.

Unscheduled eschatology is an attributed reference disclosure below the date workflow. It retains each record's scope, status, source locators and limitations; it neither assigns dates nor changes ranks. Source URLs resolve from the module-derived application root so nested GitHub Pages paths remain correct.

## Round 1: actual local-worker integration

An initial skeleton inspection on pinned Chromium 145 at 1440, 390 and 320px confirmed no root overflow and 16px controls with 46–50px heights. It also exposed inherited chapter-heading margins pushing the date instrument downward. Scoped heading rules and a native explanatory disclosure corrected that hierarchy while preserving the shared shell. The skeleton's missing data-module state was explicit and is not presented as a validated calculation. [Skeleton measurements](evidence/horizon/ui-round1/skeleton.json).

After the canonical worker arrived, a real short-window run passed **45 checks with ten actual downloads and zero runtime errors** at those three widths. It verified all four profiles, exact rendered values against exported computations, every-date slider endpoints, complete JSON/CSV, previewed ICS, stale-settings invalidation, recalculation recovery and an ambiguous New York clock retained as an unranked civil date. [Worker receipt](evidence/horizon/ui-round1/worker.json). The full preset was not yet available during this run; the test deliberately used the real local worker, without a mocked dataset.

The first test read the date field before the slider's scheduled animation frame. Its failed [seven-check receipt](evidence/horizon/ui-round1/worker-before-raf.json) is retained. Waiting for actual browser painting fixed that test timing without changing product behavior or weakening the asserted date correspondence.

## Round 2: complete horizon and cross-review corrections

Specialist and QA review produced these substantive corrections:

- Named rankings are **modern editorial study profiles**, with index points and fixed denominators. They are not historical score formulas, probabilities or whole-day verdicts. Different purposes remain separate, including Mercury-hour preference values that do not classify another ruler as adverse.
- The rank helper deliberately returns only rankable dates. The UI adds the original unavailable rows with no rank, preserving a complete date ledger and slider. Ties retain the helper's exact competition-rank policy.
- Advanced input dates support 2026-01-01 through 2031-01-01, while the published default still starts on 2026-10-30. A repeated-clock selector declares rejection, earlier occurrence or later occurrence. Missing clocks remain visible data.
- Unavailable observance calculations cannot pass a “named observance” filter. They appear separately in context and date evidence. Published-source versus stored calendar disagreement is distinct from stored-versus-current-browser calendar disagreement; both are shown.
- Astronomical evidence uses **calculated event UTC**, exposes frame and model details, dependency groups and search limitations, and distinguishes native sequence searches from bounded crossing searches. Numerical root precision is not described as observational accuracy.
- Dirty, cancelled or unresolved samples cannot launch a stale atlas casting link. Export and date controls follow the same readiness state. Loader failures are visible at the top of the instrument.
- The public-case/purpose comparison remains open while changing dates. A requested hourly drill-down uses the actual civil-day segments and UTC offsets; it does not alter the stored daily ledger or imply intraday persistence.

The complete preset owner run passed **119 checks with zero runtime errors**, at 1440×900, 1920×1080, 390×844 and 320×900. The monitored UI, orchestrator and manifest hashes remained stable during the run. It exercised all three cases and four profiles, the full **1,525-date** slider, endpoints, date ordering, context filters, comparison continuity, hourly detail, stale casting/export controls and reflow. Local readiness took **1.47–1.61 seconds** on the tested machine; this is a local measurement, not a general network performance claim. [Receipt and file bindings](evidence/horizon/ui-round2/receipt.json).

Actual exports contained the complete **4,575 samples**, **18,300 profile results** and **59,475 calendar rows** with no truncation. The JSON download was 63,476,406 bytes; the selected case/profile CSV was 4,231,284 bytes and included both range endpoints. The ICS file represented the selected study instant, with coordinates omitted. The original generated files total approximately 35MB because they use compact serialization; export formatting accounts for the larger JSON download.

The Chinese source-disagreement check uses the actual published **2027-02-06** date. The first probe mistakenly selected February 7, when that observance does not occur; the failed [28-check receipt](evidence/horizon/ui-round2/receipt-before-source-date.json) is retained. Correcting the test date exposed the intended source/runtime comparison without changing the product. A separate real custom run for **New York, 2027-03-14 at 02:30** confirmed that unavailable native-calendar records do not create a named festival, while the unresolved civil date remains accessible.

Visually inspected the complete [desktop instrument](evidence/horizon/ui-round2/instrument-1440.png) and [390px initial view](evidence/horizon/ui-round2/cold-390.png), as well as the earlier [desktop local calculation](evidence/horizon/ui-round1/worker-cold-1440.png) and [390px instrument](evidence/horizon/ui-round1/worker-instrument-390.png). The daily trace is explicitly a connection between discrete samples; it is not an intraday trajectory. The narrow layout retains native controls and an in-flow evidence panel, with full data tables scrolling locally.

## Round 3: held candidate review

The first independent four-width R3 suite passed 503 functional checks and 24 downloads with no runtime errors or source drift. Its receipt SHA-256 is `8032525f3549fd708a0589aedb4e04fa6d8b3dbdc0fc6f1fdc70b2864b528989`. Subsequent screenshot inspection rejected that candidate: in a three-date DST-gap example, the available +50 and +60 samples on either side of the missing date produced only SVG move commands and were invisible. An all-available long-window trace did not reveal this defect. A passing functional suite did not override the visible missing data.

The renderer now paints explicit dots for isolated observed samples, including a one-date available run. Their coordinates use the unchanged date/index scale; a missing interval remains unconnected. The selected-date marker is separately identified. SVG metadata records observed and isolated sample counts, and each isolated mark carries its actual date and score. The correction changes presentation only; scientific outputs, ranks, source records and generated artifacts are unchanged. Corrected renderer SHA-256: `a87e4eb7c1a1ecba43b9790ff2afb11e3f806fc2056380d022cf3723b95b6fc9`.

The independent focused correction run passed **93 checks and eight actual downloads** at 320 and 1440px, with zero errors, missing assets or product drift. It independently verifies isolated marker dates, values, painted radii and coordinates against the actual exported ledger, as well as a one-date observed sample and a finite all-missing chart. [Focused receipt](evidence/horizon/round3-isolated-focused/receipt.json). The UI owner also inspected the corrected [desktop](evidence/horizon/round3-isolated-focused/isolated-gap-chart-1440.png) and [320px](evidence/horizon/round3-isolated-focused/isolated-gap-chart-320.png) charts: both observed values are visible, and the missing date remains a gap.

### Final R3 UI acceptance

**ACCEPT within the implemented UI scope.** The corrected independent four-width [final receipt](evidence/horizon/round3-corrected-final/receipt.json) passed **695 checks and 28 actual downloads**, including the isolated-point regression, with zero runtime errors, missing assets, unexpected external requests or source drift. Read-only verification confirms that all **488 held product files** still match its final source map, including the corrected renderer. The complete-date workflow, evidence boundaries, missingness, exports, worker lifecycle and responsive interactions have no remaining UI blocker in the reviewed scope.

- Corrected receipt SHA-256: `e7c9a7948e1b885f22d637fdd2540c0f1f01f7f5995d0f6fbe46f9c7f9401b3d`.
- Product fingerprint before and after the run: `92e3d5279e26983ad0b0bf5559de6b2f6aa8fa54947f7fe0b7528dd4a44f01be`.

This acceptance is bound to the held product and local evidence, not a publication claim. No real provider inference, calendar-provider write, physical-phone, screen-reader or human usability study is claimed. Inherited release gates and live deployment verification remain part of the root release record. Product files remain held after this documentation-only acceptance.
