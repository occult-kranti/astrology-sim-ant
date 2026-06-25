# Project Plan — Christian Astrology, the interactive William Lilly

## Vision

Turn William Lilly's _Christian Astrology_ (1647) — the foundational English text of
horary, natal and elemental astrology — into an interactive, **chapter-by-chapter**
learning site where every concept is **explained, cited, and made computable**. Each
calculation is run by a **verified astronomical engine** and judged by **Lilly's own
rules**, with worked, step-by-step examples. The site is **scientifically honest**:
it presents astrology as history and as a formal system, not as validated prediction.

## Guiding principles

1. **Fidelity to Lilly.** Use what Lilly actually printed (1647), cross-checked against
   the 1659 second edition and the modern Regulus/Astrology-Classics/Houlding editions.
   Where later authors diverge, follow Lilly and flag the difference.
2. **Real, verified computation.** No hand-waving. Positions from a respected ephemeris;
   house/angle math validated against reference vectors; dignity tables checked to sum
   correctly.
3. **Intellectual honesty.** State plainly, and repeatedly, that astrology has no
   demonstrated predictive validity, with citations to the primary skeptical literature.
4. **No backend.** A static site that runs entirely client-side, deployable on GitHub
   Pages, with no tracking and no data leaving the browser.

## Architecture

- **Static site**, vanilla JS + native ES modules, **no build step** (robust on GitHub
  Pages). Shared chrome injected by a module that computes the site root from its own
  URL, so links work at any depth and under the Pages subpath.
- **Calculation engine** (`assets/js/core/`): `astro.js` (positions, sidereal time,
  obliquity, Asc/MC, Regiomontanus/Placidus/whole/equal houses, Part of Fortune, mean
  node), `dignities.js`, `aspects.js`, `considerations.js`, `planetary-hours.js`,
  `chart.js` (SVG wheel), and `data/` (the tables and descriptive text from Lilly).
- **Ephemeris:** `astronomy-engine` (MIT) vendored into the repo — no runtime CDN.

## Feature list

### ✅ Phase 1 — Foundation & core experience (COMPLETE)

- [x] Deep research across all three books, the tech stack, the dignity tables, the
      editions, the modern revival, and the scientific assessment (cited).
- [x] Verified calculation engine (positions, angles, four house systems, node,
      Part of Fortune) with documented validation.
- [x] Lilly's dignity data hard-coded and verified (Ptolemaic terms summing to 30°,
      faces, exaltations, two-ruler triplicities with Mars/Mars water, orbs, accidental
      table, 1647 fixed-star positions).
- [x] Descriptive data for the 7 planets, 12 signs, 12 houses from Lilly's text.
- [x] Design system + responsive layout (celestial-parchment theme).
- [x] Home page with honest framing.
- [x] **Book I:** hub (chapters, dignity table, aspects/orbs, worked example),
      signs/planets/houses reference, **Essential Dignity Calculator**, **Planetary
      Hours** tool.
- [x] **Book II:** hub (step-by-step method, modes of perfection), **Horary Chart
      Calculator** (significators, dignities, aspects, considerations, wheel),
      considerations page, house-by-house question guide, Lilly's worked charts.
- [x] **Book III:** hub (full natal method), **Nativity Calculator** (Lord of the
      Geniture, temperament).
- [x] **About & Sources:** biography, editions, revival, the science (Carlson,
      Forer/Barnum, time-twins, Gauquelin, mechanism), internal debates, technical
      notes, citations.
- [x] GitHub Pages workflow (self-enabling).
- [x] End-to-end verification in headless Chromium (all pages clean; calculators
      produce correct output).

### ⏳ Phase 2 — Deeper interactivity (roadmap)

- [ ] **Reproduce Lilly's worked charts as live figures** — cast the Ship-at-Sea
      (Dec 1644) and others from approximate data and overlay Lilly's reasoning on the
      computed wheel.
- [ ] **Timing engine** for horary (degrees-to-time, scaled by sign mode & house) with
      a worked illustration.
- [ ] **Translation / collection / prohibition detector** surfaced explicitly in the
      horary output (the engine already has the pieces).
- [ ] **Antiscia & contra-antiscia**, and the fixed-star conjunctions panel.
- [ ] **Decumbiture** mode for the 6th house (illness) with the critical-days method.
- [ ] **Save / share a chart** via URL parameters; export the wheel as SVG/PNG.

### ⏳ Phase 3 — Scholarship & completeness (roadmap)

- [ ] Per-chapter reader pages keyed to the free Archive.org / Wikisource scans, with
      Lilly's text in modern spelling beside the interactive tools.
- [ ] The supplementary Book I degree tables (masculine/feminine, light/dark/smoky/void,
      pitted, azimene, fortunate) and the body-parts grid as interactive lookups.
- [ ] **Primary directions** (Naibod measure), **annual profections**, and **solar
      return** tools for Book III.
- [ ] Glossary of terms of art, with cross-links throughout.
- [ ] Accessibility pass (ARIA, keyboard, contrast) and print stylesheet.

## Fidelity decisions (and why)

| Topic | Choice | Why |
|-------|--------|-----|
| Terms | Ptolemaic (Lilly's printed table) | Lilly used Ptolemaic, not Egyptian, terms |
| Triplicity | Two rulers (day/night); Water = Mars/Mars | Exactly as Lilly prints, omitting the participating ruler |
| Orbs | 9/9/7/15/7/7/12 (Sat…Moon) | Lilly's primary column, the conventional "Lilly orbs" |
| Part of Fortune | Asc + Moon − Sun, day **and** night | Lilly does not reverse by sect |
| Houses | Regiomontanus default | Lilly's own system; Placidus/whole/equal offered too |
| Planets | Seven only | The outer planets were unknown to Lilly |
| Node | Mean node | What the period tradition used |
| Fixed stars | 1647 longitudes | Period-correct for Lilly's table |

## Deployment & verification workflow

Research → encode data → build engine → **validate numerically** → build UI →
**verify in a real browser** → commit → push → Pages deploys → confirm live. Repeat
per book/feature. (At the time of writing, the managed git relay and the GitHub App
integration are returning 403 for writes, so pushes are pending; all work is committed
locally and the Pages workflow is in place to deploy automatically once a write path is
restored.)
