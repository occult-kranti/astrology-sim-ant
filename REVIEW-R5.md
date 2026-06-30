# Phase R5 — Lilly depth + UX backlog (2026-06-30)

The headline pedagogy round: Lilly's own charts read **live**, horary judged **house by house**, Book III's
**natal topics + rectification**, and the standing UX backlog cleared. A 6-agent research workflow sourced the
worked-chart figures (from the 1647 woodcuts), designed the house-judgement and natal/rectification specs, and
attempted an a11y audit. The honest-science framing (astrology = pseudoscience, *described never prescribed*) is a
**locked requirement** — strengthened here, never weakened.

## What shipped

| Item | Status | Notes |
|---|---|---|
| **Live Lilly worked charts** | ✅ | `core/chart-from-positions.js` + `data/worked-charts.js` + `app/worked-charts.js` → `pages/book2/examples.html`. 4 full figures (stolen fish, ship, marriage, dog), each drawn + dignity-scored + judged beside Lilly's words. Positions from the 1647 woodcuts with per-planet confidence; the "Venus = the dog" myth corrected to **Mercury** (lord of the 6th). |
| **House-by-house horary judgement** | ✅ | `core/horary-judge.js` (`horaryJudgement`) + `data/horary-house-judgement.js` → `pages/book2/houses.html` live reader + 12-house reference (natural significators, perfection-meaning, affirm/deny testimonies). Sickness/death/prison read in the inverted sense; contests by the stronger significator; `opts.sense` override for dual-use houses. |
| **Book III natal-topic readers** | ✅ | `core/natal-topics.js` reads all 12 topics from house-lord + natural significator + occupants → favourable/mixed/afflicted tone. On `pages/book3/master.html`. |
| **Rectification (Animodar + Trutine)** | ✅ | `core/rectification.js` — Ptolemy's Animodar (corrects an angle from the pre-natal lunation's almuten, then scans the clock) and the Trutine of Hermes (birth Asc vs estimated-conception Moon). Both contested; every assumption surfaced; reuse `hyleg.js` `prenatalSyzygy`. |
| **Chat colour scheme redesign** | ✅ | The Claude conversation is now readable labelled bubbles (You = gold-tinted right, Claude = slate left), high contrast on a deep-night log, message body `white-space: pre-wrap` so the model's lists/paragraphs survive. (Was flat off-white-on-near-black — the user's pain point.) |
| **Jargon autolink on dynamic panels** (P1-2) | ✅ | `autolink.js` `autolinkResults()` + `shared.js` `autolinkResultPanels()`, called after each compute in the workbench, horary, Book III master and worked-charts renderers. |
| **Nav grouping** (P1-5) | ✅ | Start • Tools • Books • Reference — faint gilt dividers on desktop, labelled sections in the mobile drop-down. |
| **Election auto-run + live update** (P1-3) | ✅ | Already auto-ran on load with the legend above the form; added live re-judge on aim/house-system change. |
| **a11y pass** (P2-1, P2-3) | ◑ | Global `:focus-visible` ring; `aria-hidden` on the decorative brand glyph & chat role glyphs; responsive `.w-coord`/`.w-offset` inputs; `<caption>` on the worked-charts ledger; the Now dashboard already had `aria-live`. A **full automated audit is still open** — its workflow agent hit a monthly spend limit. |

## Honestly flagged / still open
- **Full a11y sweep** — table `scope`/`caption` across *all* data tables, an `aria-live` review of every live region, and
  a contrast audit were not completed automatically (spend-limit). The high-value fixes above are in; a complete pass
  remains a backlog item.
- **Worked-chart fidelity** — figures are read from 17th-century woodcuts; a few minutes/degrees are low-confidence and
  flagged in-data (e.g. the stolen-fish Venus: woodcut Pisces/12th vs modern Aquarius/11th). The wheel uses equal houses
  from the printed Ascendant; applying/separating uses mean motions — both noted in the "Lilly vs the engine" callout.
- **Remaining depth** (tracked in MASTER-PLAN): Book III topic Lots are described but not all computed; the Picatrix
  Book IV full per-sign liturgies stay summary-only (framing-sensitive); a verdict/CTA uniformity pass across reference
  pages.

## Verification
`audit` **0 problems** (38 HTML / 61 JS) · `engine-test` **all passed** (77 registry exports resolve) · real-Chromium
sweep **38 pages / 0 console errors** · targeted R5 feature check: 4 live worked charts (4 wheels, dog→Mercury), 12
house cards + live reader, 12 natal topics + Animodar/Trutine, redesigned chat log, 4 nav groups — **all present, 0 errors.**
