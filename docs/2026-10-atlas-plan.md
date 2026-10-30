# Desktop calendar atlas and date/event laboratory

Baseline: `0d115c911ffd744279e3d3640f598d2b8fee3c81`, review branch `feat/mobile-calendar-observatory`. This is an additive desktop workspace; the existing mobile observatory, calculators, journals and stored-record contracts remain available.

## User flow

1. Choose a moment, observer and named time-zone convention. Open the atlas for a large sky diagram and aligned methods, or a dedicated Western/Lilly, Vedic, Egyptian/Coptic, Hebrew/Kabbalah or Chinese page.
2. Compare all available methods or a selected subset. Inspect actual calculation inputs, source passages, variants and unavailable scope. The catalogue distinguishes calendars, astronomical coordinates, named traditional rules and textual arithmetic.
3. Optionally add birth context. Exact time and unknown time have different outputs; an unknown birth time cannot supply a fabricated ascendant or house chart. Personal fields stay in browser memory, outside default shared URLs and exports.
4. Open the date/event laboratory with explicit criteria, a date window and one observer-local sample time per date. Run brute force or an optimized equivalent scan, inspect progress, cancel or recover from invalid input, then open a matching moment in the atlas.
5. Work in either direction: derive inspectable criteria from an event sample, or compare chosen criteria on event dates against explicit control dates. Report dates, source precision, denominators, missingness, selection and shared dependencies. Future favorable/caution concurrence is a count of named historical-rule matches, not a forecast of real-world good or bad outcomes.

## Implementation boundaries

The existing native ES-module stack and canonical astronomy/calendar engines supply calculations. New pure modules separate the atlas catalogue, personal context and search algorithm. A dedicated worker handles longer scans with job identities, progress and cancellation; public export is a deliberate serialization boundary. Optional concurrence ordering retains the true top results across the full window, ordered by one named tradition and classification with date tie-breaking. Known rule counts, unavailable classes and denominators remain separate; no cross-cultural net auspiciousness score is invented. Efficient search must preserve the chosen grid and result semantics, with executed equality checks against brute force. Performance measurements identify the actual input and runtime.

“All variations” is a navigable coverage catalogue, not a claim that every historical or living cultural practice is implemented. Gregorian/Julian civil dates and Christian computus differ from Lilly's chart methods; Hebrew dates differ from Kabbalistic text interpretation; Coptic dates differ from ancient Egyptian reconstructions; a Chinese civil conversion does not implement every BaZi or regional calendar school. Each row identifies its actual scope and source status.

## Six-member panel, five new rounds

| Round | Required artifact and action |
|---|---|
|1|Inspect the existing interface and engines; agree interfaces and scope; implement the first functional atlas, birth component and search laboratory.|
|2|Cross-review the changed calendar/source and personal-context calculations; challenge boundaries and variants; implement accepted corrections.|
|3|Challenge search equivalence, event/control methodology, worker concurrency, imported data and privacy; implement accepted corrections.|
|4|Review the integrated visual design and actual workflows at desktop, narrow widths and zoom; fix interaction, status and recovery defects.|
|5|Freeze the revised product, collect all six acceptance decisions, execute final browser/calculation/protocol gates and verify the pushed branch's CI.|

The members are independent AI-agent roles, not human tradition authorities or research participants. The [panel ledger](2026-10-atlas-panel.md) records actual findings, changes and results. Earlier three-round and four-round reviews are separate history. Source access, reading depth, selected fixtures, numerical testing, human validation and deployment are separate claims.

Root owns navigation, existing-page entry points, test/CI integration, shared documentation and release. Each member owns its new implementation surface and tests; cross-review challenges other members' artifacts. The review branch is pushed only after the required local gates pass. Production and hosted services require their separate release paths.
