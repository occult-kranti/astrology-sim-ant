# Date wayfinding design contract

Design Partner interaction/recolor mode, extending the current parchment, green-black ink and copper instrument design. Baseline `fdc184df829fda685a23d69962d121328b68537e`.

The primary job is to locate a date, understand why it is marked, compare the same instant across methods, and save a public study reference. Existing source-led diagrams, tables and exports remain the main artifacts. The enhancement must not turn every calendar into another large independent dashboard.

Use a compact date rail beside each applicable chart or selected calendar lane, a clearly named selected-date control, and a readable anchored detail card. Detailed lists and saved-date management may use disclosures. Reuse native range controls, buttons and semantic headings. Show both the selected convention and the synchronization status. Keep calculation state outside optional panels.

Assign color by the underlying record category rather than by tradition, country or an implied universal good/bad scale. Pair color with words and shapes. Keep source-date precision and assumed-clock context close to the colored marker. Uncomputed dates remain neutral; partial results remain partial.

Cards work by pointer hover, keyboard focus and explicit tap. Their bookmark controls remain reachable; moving between trigger and card must not dismiss them. Escape closes the card and focus is restored only when appropriate. A disabled or stale instrument cannot cast a new result through an auxiliary slider. Important controls target 44 CSS pixels; narrow-screen inputs remain at least 16px. Long labels wrap without whole-page overflow. Charts and tables may retain explicitly named local scrolling.

Local saved markers use a dedicated bounded namespace and explicit actions. They do not inherit personal data or imply cloud/calendar sync. Storage failures must leave the current calculation usable and explain that the bookmark was not saved.

See the implementation and acceptance scope in [the plan](../docs/2026-10-date-wayfinding-plan.md). Actual rendered findings and corrections will be recorded against their respective revisions.
