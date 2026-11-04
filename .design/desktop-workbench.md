# Desktop chart studio

4 November 2026. Baseline 39d622394bed9f8d370695502a9e753478695434. New branch feat/desktop-astrology-workbench. Design Partner create/surface workflow in the existing static ES-module stack.

## Job and composition

The primary job is sustained chart work: enter or recall a record, declare the calculation method, compare another chart, inspect exact positions and aspects, move time and keep a portable study. The calculated wheel is the dominant artifact. A persistent library sits left; the calculation and view controls sit above the wheel; a source-aware selection inspector sits right. The time navigator belongs immediately below the chart. Existing specialist tools remain discoverable through a searchable catalogue, without duplicating their calculations in the new shell.

The direction is an original black instrument desk with cool cyan actions, amber comparison ring B, stable planet colors and named aspect colors. Ring letters and dashed/solid strokes supplement color. Exact-degree leaders connect fanned labels to true longitudes. Whole-page hero art, decorative statistics and copied commercial assets are excluded. Official feature pages and two vendor screenshots informed work patterns, not a claim to have used the paid applications.

## Scope and invariants

- Single natal/event chart, transits with a frozen A, and synastry comparison; four house systems and tropical/linear-Lahiri display.
- Separate calculation controls from display-only layers and wheel/table/matrix views. Pending settings mark held results stale and disable exports/time operations.
- Explicit known local clock, IANA zone and repeated-clock choice. Gaps fail; actual polar fallback remains visible. Sidereal display does not imply a complete Jyotisa interpretation.
- Chart library is opt-in local storage, capped at 200 records and 1 MiB imports. User names are text, never HTML. No private data is written to URLs or automatically sent to a provider. Import validates and recomputes instants; library and calculated-study export formats are distinct.
- AI handoff is editable, reviewable, copied/downloaded only. Existing AI and MCP setup remains linked; no hosted model or new public MCP endpoint is claimed.
- All 134 pre-existing application destinations remain accessible. Specialist tools open separately without receiving private inputs automatically.
- Existing homepage remains. The new branch is published through the retained gates only when the Pages environment accepts it. No private research files are included.

## Adaptive behavior

At wide widths, keep three columns and a chart height that responds to the viewport. The inspector scrolls locally for long evidence. At medium widths, move inspection below the wheel. At narrow widths, put the chart first, then inspection, then the library; keep forms at least 16px. Aspect matrices scroll within a labelled view. All chart actions have button/table alternatives. Native dialogs preserve keyboard interaction, and redraw restores focused chart objects. Reduced motion does not remove information. Print excludes navigation and controls while retaining chart context.

## Review record

The implementation panel comprised source research, calculation adapter, chart/library catalogue, SVG visualization, independent browser QA and release review, integrated by root. These are AI engineering perspectives, not human user-study participants. Early review identified explicit setting invalidation, ambiguous clocks, inert imports and private input isolation. Rendered review found inherited page sizing that made the work surface too tall, SVG focus replacement and a table overflow issue on phones. Those issues were corrected before final acceptance. Exact executed checks and any unresolved limitations belong in the verification report.
