# Date wayfinding verification

Baseline: `fdc184df829fda685a23d69962d121328b68537e`. The change adds presentation, navigation and local saved references; canonical scientific engines, historical datasets and calculation export serializers remain unchanged.

## Initial held interaction checks

`scripts/browser-date-wayfinding.mjs` passed **463 checks** on the corrected held candidate, retaining **10 actual downloads and 25 screenshots**. It exercised shared fixtures at 320, 390, 1440 and 1920 CSS pixels, a 200% fixture zoom, simulated touch, and real page journeys at 390 and 1440 pixels. The 512-file frontend manifest and driver were unchanged throughout. Runtime, console and local-response error counts were zero. Downloads and screenshots were independently rehashed against their recorded bytes and SHA-256 values.

The actual journeys cover native range keyboard use, synchronized chart/calendar selection, all seven country research filters, source-date precision, exact solved-event milliseconds, distinct same-day observances, bookmark identity across dates and ranges, storage corruption/unavailability, removal outside the current view, stale controls, actual exports and monitored private-data boundaries. Hover, focus, tap, card scrolling, same/cross-navigator selection, Escape and original-trigger focus restoration are exercised. A final source-owner run independently passed 54 checks on the same corrected shared module, including the original New Moon focus regression and the two distinct 2025 Easter/Pascha references.

Held evidence: `/workspace/setup-validation/date-wayfinding/final-held-v2/receipt.json`.

| Binding | SHA-256 |
| --- | --- |
| Browser receipt | `f82d207a323826c19f1858becfacbca7a2af34c70a1bb225841a8ee6290895c8` |
| Browser driver | `64b3fe9a577b5aa80eb7a1a3b905ec0826f92f53c47cdddf2b001e0286c5acbc` |
| Frontend manifest | `1d9b78eaa105f6d781f1d29dc0566fb3be242c2c722f7830c4071f510004546d` |
| Corrected shared module | `cbc3075678b888962cbb6978422192c65d55d575dcb3358a7ccfc28c59445488` |
| Shared stylesheet | `da65f2779027e3331313a77d88d3eb998ad12be9164b377cd25606bcf3b562dd` |

## Calculation and repository checks

The full engine suite passed **732 top-level checks**, including the new eight-case component input/storage boundary test. The static audit checked 134 HTML and 322 JavaScript files with zero problems. All nine generator checks passed; the horizon and historical-country datasets did not need regeneration. The search index was regenerated from the changed page text. The existing round ledger check passed; its inherited C3 remains not evaluable.

The full-site Chromium sweep passed **134 pages with zero errors**; its two inherited descriptor warnings remain recorded. Root's broader 536-file product manifest was unchanged during the sweep. Root and the two reviewing roles directly inspected all **25 final screenshots**, with no blocking visual finding. Combined visual receipt SHA-256: `2de131065bbebe2984e3fa12ba6a94341c77c19f804c367022a70963af4ad72a`.

These initial local checks passed, but the first pull-request run subsequently found the narrow-screen scrolling regression recorded below. Exact corrected-candidate CI, production artifact verification and live behavior remain separate release checks, recorded in the pull request and deployment evidence after publication.

## Retained failures and corrections

Development receipts are not release acceptance. The first purported held browser run passed 453 functional checks but correctly rejected acceptance because the shared module changed during execution. It remains untouched under `final-held/`; the successful `final-held-v2/` run uses the final driver and unchanged source files.

Earlier diagnostics retain actual defects and their fixes: popup stacking, trigger overlap, pinned/focused-marker hover replacement, focus loss during rebuild, mutable bookmark identities, same-day observance ID collisions, source-group activation, mobile rule-text overflow, country time-zone aliases and exact-event truncation. Driver mistakes—incorrect selectors/schema paths, hidden controls and disclosure timing—are separately documented in the [panel ledger](2026-10-date-wayfinding-panel.md). No failed functional assertion was removed to produce acceptance.

## Scope of the evidence

This is automated Chromium verification and model-agent visual review. It is not a human usability study, screen-reader certification, physical-device test or cross-browser certification. The new interaction driver uses fresh contexts with service workers and external requests blocked. Monitored storage tests do not prove every possible privacy property. Local bookmarks are reference records in this browser; they do not create cloud or calendar synchronization.

The checks establish software behavior and preserved source/calculation contracts. They do not establish predictive validity, physical danger or protection, historical-source authenticity, national beliefs, hosted MCP, provider inference or model training. Existing source and numerical validation limits remain visible in the product.

## Release regression correction

PR run `41111639842` failed the inherited Newton browser journey at 320 pixels: a passive source preview could follow its offscreen anchor and cover the existing next-day button. The actual failed log, archive, screenshot and receipt are retained under `/workspace/setup-validation/date-wayfinding/ci/pr-failure-41111639842/`. That run did not execute the later eschatology, date-navigation or session gates and was not accepted.

A deterministic actual-page reproduction confirmed the overlap. Passive previews now dismiss when an outer scroll moves their anchor or focus moves elsewhere. Pinned cards, the original keyboard-focused trigger, card focus and internal card scrolling remain supported. An already-queued scroll event cannot dismiss a newly opened card whose anchor has not moved. The corrected module SHA-256 is `ed546f735e309734d5c322cd4b7381c362b51a6d133d429b80c842785778e76e`. Independent code review and the source-owner's 320-pixel reproduction confirmed normal next-day activation; the scoped inherited run passed 332 checks and retained 21 downloads.

The added regression driver retains its rejected `final-held-v3` run. Two setup mistakes were corrected separately from the product: a simulated pointer must actually leave before re-entering a hovered button, and a focus assertion must move focus from another control. The original assertions remain required, including a dedicated real Newton 320-pixel journey.

The corrected frozen `final-held-v4` run passed **517 checks**, retaining **10 actual downloads and 26 screenshots**, with no product/driver drift, runtime errors or failed local responses. It preserves every prior 463 assertion occurrence and adds 54 checks, including the dedicated real 320-pixel Newton case. All download and image bodies were independently rehashed. Nine new/changed images were directly reviewed; the other 17 match the previously reviewed bytes exactly. The unchanged inherited Newton driver additionally passed **1,294 checks across 320/390/1440/1920 pixels**, with **84 actual downloads** and no source drift.

| Corrected held binding | SHA-256 |
| --- | --- |
| Browser receipt | `709728fe1cdae8aa81fff7389f00935b9daeadd1ad40b7e0e681699ad995dfd7` |
| Browser driver | `12ed2bfad110e4954a0c69e502eae381291f03036e7a07cd4894891193a1ee5f` |
| Frontend manifest | `9da8407c6de8cc30bb439019c784bfbc5a00892ec5541394dcc57fbd67251b11` |
| Visual acceptance | `35e71ed64848032635cf3dddc04ada3148ec455d0832f514e6e0ab7b5f99f936` |
