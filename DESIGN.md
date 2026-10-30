# Workbench design direction

## Calendar Observatory revision — 2026-10-29

The redesign branch uses an ivory paper, dark green ink, rust actions and muted
gold rules, with serif headings and readable sans-serif controls. The shared
`observatory.css` layer changes presentation across existing pages without
changing their route IDs, numerical engines or saved formats. The earlier Studio
contracts below still describe their interactions; this section supersedes their
navy-navigation presentation where the new shared shell applies.

Mobile starts with Today, Compare, Tools, Library and Menu in a bottom dock,
alongside the compact header's search and complete grouped navigation. The full
feature catalogue is retained. Tables and large diagrams scroll locally when
necessary; ordinary content reflows. Controls target at least 44px with 16px form
text. Native date/time fields occupy a full row below 480px so complete dates,
seconds and day periods remain visible. Sticky chrome, keyboard focus, reduced
motion and print output are checked alongside the numerical results.

The homepage composes an editable context, current source-labelled reading,
two-week almanac, study paths and optional AI disclosure. Comparison aligns the
same instant across named methods, keeping boundaries and validation notes near
each result. Details reveal secondary provenance without turning an untimed
classification into an active instruction. Editing invalidates exports and AI
previews while retaining the previous labelled result for recovery.

See `.design/observatory-mobile.md` and the dated Observatory verification/panel
documents for the actual browser evidence and remaining scope limitations.

Updated 2026-10-05. Live Studio surface mode: **Operate**. Preserve the incumbent scholarly study-desk identity: parchment page, navy navigation, gold actions, serif titles, sans-serif controls and monospaced exact values. Use the existing DS2 semantic tokens and renderer conventions, without a new framework or font service.

## Layout

A short purpose statement leads into common time/location controls and a focused task selector. The main diagram and adjacent facts form a working spread on wide screens. On phones, controls, diagram, facts and methods follow normal document flow. Avoid fixed stacked controls that leave only a narrow strip for results. Existing Workbench section anchors and full reading remain available.

Live/Frozen is an explicit mode, independent from display task. State shows the exact UTC instant and observer; the action names what happens: Start live, Pause, Resume live, Update view, Save snapshot. Typing a different time suspends live updates. Saving and exporting capture a stable result; a live tick never creates history or sends data.

The figure is followed by readable values and disclosed mechanics. Symbol diagrams expose their square validation, letter sequence, reduction method, trace count and source. Playback changes only the visible trace frame, not the arithmetic. Whole charts and traditional images are not recast as visual recognition, prediction or proof of efficacy.

## Components and access

Reuse the shared chrome, buttons, fieldsets, figure renderers and export utilities. Input groups change with the chosen task; irrelevant required fields are disabled. Touch targets are at least 44px. Form text remains 16px at narrow widths. Native controls, a stable polite status, clear error text, visible focus and text alternatives support nonpointer workflows. No continuous motion starts automatically; reduced motion uses step controls. Draft or invalid inputs retain the previous labeled figure and disable save/export until a successful calculation.

Method choices are specific: Western house convention, sidereal Lahiri/whole-sign Vedic convention, Latin reconstruction versus Hebrew reduction, final-letter gematria variant, and IAST Kaṭapayādi input. Do not display unsupported choices as working controls. Connected MCP tools and the existing BYOK LLM assistant are different connection types.

## Verification

Prior CI artifacts establish Nativity/Calendar visual identity only. The new Studio requires actual browser journeys at 320px, 390px, landscape and desktop/reflow. Verify restored input/result agreement, live/frozen transitions, no per-tick persistence/network, all figure/export types, malformed input, blocked storage, keyboard and native-hidden semantics. One integrated screenshot batch and one material repair confirmation bound visual review.

## Connected session extension

The same Studio route gains five task anchors: Observe, Cast, Compare, Symbol, Journal. The original six calculators stay reachable through their existing task selector. Task anchors guide a finite workflow without making hidden panels prerequisites or creating another navigation hub. Source lenses, comparison and measurement details use native disclosures; the primary figure remains the central artifact. The mobile reading rail is normal document flow, preserving viewing space.

A captured sky banner states original time, coordinates, current/simulated provenance and whether the displayed calculation has since changed. Live/Frozen describes the local calculation clock, never an unimplemented cross-app connection. Question purpose disables live actions. Chart comparison aligns tropical and sidereal rows at one instant and retains separate house conventions. Journal actions save immutable snapshots; edits do not change older entries.

Connection copy distinguishes fragment-based sky sharing from the full Workbench's query-based time/location transfer. The study assistant is loaded explicitly, preserves preview/request parity and stays visibly separate from external MCP setup. UI text never presents camera projection as image recognition, source authority as scientific validation, or numerical measurement differences as evidence of astrological efficacy.

The preceding Studio/Workbench release passed its browser journeys and received a bounded visual repair confirmation. These new session interactions require their own integrated browser and visual gate; source checks alone do not establish their runtime usability.
