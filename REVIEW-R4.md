# Critical Review & Improvement List — R4 (2026-06-25)

A critical pass over **functionality, usability and flow**, with a prioritized list and what was shipped
this round vs. what remains. Reviewed every page and the main controllers (`shared.js`, `workbench.js`,
`assistant.js`, `vedic-panel.js`, `now.js`, `trajectory.js`) and the CSS. The honest-science framing
(astrology = pseudoscience, *described, never prescribed*) is a **locked requirement** — strengthened
here, never weakened.

**Headline.** The site is a rigorous, honest, well-cited reference *for people who already know astrology*.
Its biggest gap was the **on-ramp**: it taught *calculation*, not *meaning*, and dumped dense results with
no "how to read this." This round adds both, fixes the most-cited friction, and completes two Picatrix data
gaps.

## Status legend
✅ shipped this round · ◑ partly shipped · ⬜ backlog (in MASTER-PLAN)

## P0 — must-fix friction
| # | Item | Status | Notes |
|---|---|---|---|
| P0-1 | **No concepts on-ramp** — the site taught calculation, not meaning | ✅ | New **`pages/basics.html`** — every concept (Western + Picatrix + Vedic) in plain English, no maths; featured first in home "Start here" + nav. |
| P0-2 | **No "how to read your results"** — output dumped, not interpreted | ✅ | New **`pages/interpret.html`** — panel-by-panel guide to the Master-Tool output, with the locked "study, not prediction" frame. |
| P0-3 | **Wide tables overflow on mobile** (no scroll container) | ✅ | `table.data` scrolls horizontally below 680 px (`style.css`). |
| P0-4 | **Assistant model labels contradictory** (two "top" superlatives); Fable refusals fail silently | ✅ | Labels reconciled (Opus 4.8 = recommended default; Fable 5 = most powerful/costly); `stop_reason:"refusal"` now shows a clear message in both the stream and tool-loop paths. |

## P1 — high-value
| # | Item | Status | Notes |
|---|---|---|---|
| P1-1 | Vedic side-by-side hard to discover | ◑ | Last round moved the toggle to the **top** of the Workbench (after the figure); a default-on/affordance is still open. |
| P1-2 | Unexplained jargon on dynamic result panels (autolinker doesn't reach injected DOM) | ⬜ | Run `autolinkGlossary()` over rendered output after each compute. |
| P1-3 | Election tool has no auto-run; legend below the form | ⬜ | Auto-run on load; move the legend above the form. |
| P1-4 | Reference/result pages are one-way (no "next step" CTA) | ◑ | The new pages cross-link; the prayers/mansions pages link to the talisman; a uniform CTA row is still open. |
| P1-5 | Flat 13-item nav, undifferentiated | ⬜ | Group into Start • Tools • Books • Reference (or visual separators). Now 14 with Basics. |
| P1-6 | Workbench form dense; birth fields easy to miss | ⬜ | Light step scaffolding; surface the birth-moment option; collapse export buttons. |

## P2 — polish & accessibility
| # | Item | Status | Notes |
|---|---|---|---|
| P2-1 | a11y: decorative glyphs unlabeled; tables lack `scope`/`caption`; Now not `aria-live` | ⬜ | `aria-hidden` on glyphs; `scope`/`caption`; `aria-live="polite"` on the Now dashboard. |
| P2-2 | Honest-note missing on the glossary & Book I hub | ✅ | Added the standard honest-note callout to both. |
| P2-3 | Inline fixed-width inputs cramp on small screens | ⬜ | Move lat/lon/offset widths to responsive classes. |
| P2-4 | Contested-method flags only on About, not at point-of-use | ⬜ | Inline "contested — see About" markers next to the specific values. |
| P2-5 | Glossary could double as a learning index | ◑ | Glossary now links to Basics at the top; a curated "start with these" block is still open. |

## Coverage completed this round (Picatrix)
- ✅ **Per-mansion talismanic images** (gap #5) — `data/mansion-images.js` (28, Agrippa II.46 + Picatrix IV.9);
  shown on the Mansions page and by the Moon's mansion in the Master Tool. Mansion 22 (single-witness) and
  Mansion 11 (divergence) flagged in-data; toxic/animal/poison materials flagged HISTORICAL-ONLY.
- ✅ **Per-planet planetary images** (gap #12) — `data/planet-images.js` (7, Agrippa II.38–44 + Picatrix
  II.10/III); shown for the ruling planet in the Master Tool's talisman panel.

## What "complete coverage" now means
With this round, **every major technique of Lilly Books I–III and the computable + textual heart of the
Picatrix is now either computed or explained**, and **every concept** has a plain-English entry on
`basics.html` + a glossary definition. The remaining items are depth/pedagogy, tracked in MASTER-PLAN:
Lilly's **live worked charts** and **house-by-house horary judgements**; Book III **rectification** and
**natal topic readers**; the Picatrix **Book IV full per-sign liturgies** (deliberately summary-only); and
the UX P1/P2 backlog above.
