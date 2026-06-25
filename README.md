# Christian Astrology — the interactive William Lilly

An interactive, scientifically-honest study edition of **William Lilly's _Christian
Astrology_ (1647)** — the first complete astrology textbook written in English. It
presents Lilly's three books chapter by chapter and backs every technique with a
**working calculator** built on a verified astronomical engine that runs entirely in
the browser.

> **An honest note.** Astrology has no demonstrated predictive validity and is
> classified by the scientific community as a pseudoscience. This project presents
> Lilly's astrology as a landmark of intellectual and cultural history and as a
> fascinating formal system to learn and compute. The **calculations are real and
> verifiable**; the **interpretations are Lilly's**, offered for study — not as
> guidance. See `pages/about/` for the evidence and citations.

## What's here

| Area | Pages / tools |
|------|---------------|
| **Home** | `index.html` — overview, "find your way", the three books, the tools, the science note |
| **The Workbench** | `pages/workbench.html` — the unified tool: one moment runs the **whole engine at once** (the `fullReading` spine), every panel cross-linked via the capability registry, with **JSON/SVG/PNG export**, shareable URLs, and an **"Ask a local model"** assistant (Ollama / in-browser WebLLM). See `WORKBENCH.md` and `docs/LOCAL-LLM.html`. |
| **Workflow & Chapter Map** | `pages/workflow.html` — every chapter of each book → concept → calculation → worked example → tool; the horary & nativity step-flows; the Picatrix election bridge |
| **Tools hub** | `pages/tools.html` — every calculator in one place, with a "what each computes" table |
| **Book I — Fundamentals** | hub, signs/planets/houses reference, **Master Tool** (now with a full **Cautions & chart-health** panel), **Essential Dignity Calculator**, **Planetary Hours**, **Degree Tables** |
| **Book II — Horary** | hub + step-by-step method, **Horary Chart Calculator** (perfection: translation/collection/prohibition/refranation + timing), considerations, house-by-house guide, Lilly's worked charts |
| **Book III — Nativities** | hub + natal method, **Nativity Calculator** (Lord of the Geniture, temperament) |
| **Reference** | **Glossary & Dictionary** (auto-linked in prose), **Master Index**, **Read the Original** (free scans) |
| **About & Sources** | biography, editions, the modern revival, the scientific assessment, technical notes, full citations |

> **For the next contributor:** `HANDOFF.md` has the current state, the architecture rules,
> the verify-in-a-browser harness, and the **bundle-so-it-applies-cleanly** procedure.
> `MASTER-PLAN.md` has the full Lilly × Picatrix vision and the phased roadmap.

### The calculators are real

- **Positions:** geocentric apparent ecliptic longitudes in the *true equinox of
  date* (tropical zodiac) from [`astronomy-engine`](https://github.com/cosinekitty/astronomy)
  (truncated VSOP87, MIT, ≈1 arc-minute), vendored at `assets/js/lib/astronomy.js`.
- **Angles & houses:** Ascendant, Midheaven, and **Regiomontanus** (Lilly's system),
  Placidus, whole-sign and equal cusps — computed in `assets/js/core/astro.js` and
  validated against published reference vectors.
- **Dignities:** Lilly's essential (domicile/exaltation/triplicity/term/face) and
  accidental point system, the almuten of a degree, the Part of Fortune, the mean node.
- **Horary:** significators, applying/separating aspects with Lilly's planet-based
  orbs and moieties, mutual reception, planetary hours, and the considerations before
  judgement.

### Verification

Validated with `node` + headless Chromium:

- mean obliquity matches the standard value to 5 decimal places;
- the Sun is at **0° Aries** at the March equinox and **0° Cancer** at the June solstice;
- the Sun sits on the **Midheaven at local apparent noon**;
- the twelve Regiomontanus cusps come out strictly in zodiacal order, and all house
  systems agree on the Asc/MC;
- every term-row of the dignity table sums to **30°**;
- all 13 pages load with **zero console errors** and all navigation links resolve.

## Run it locally

It's a static site — no build step.

```bash
python3 -m http.server 8003
# then open http://localhost:8003/index.html
```

## Project structure

```
index.html                     home page (with "find your way" hubs)
assets/
  css/style.css                design system (advisories, verdict, chip, flowmap…)
  js/lib/astronomy.js          vendored astronomy-engine (MIT)
  js/core/                     calculation engine (pure, headless-testable in Node)
    astro.js                   positions, angles, houses, Part of Fortune, node, antiscia
    dignities.js               essential + accidental scoring, almuten, reception rulers
    aspects.js                 Ptolemaic aspects, Lilly orbs, applying/separating
    considerations.js          considerations before judgement (radicality)
    perfection.js              translation/collection/prohibition/refranation + timing
    cautions.js                consolidated chart-health engine → severity advisories + verdict
    planetary-hours.js         Chaldean-order day & hour rulers
    election.js · talisman.js · trajectory.js   the Picatrix election/talisman/life-trajectory composers
    reading.js                 fullReading() — composes the WHOLE engine into one serializable, cited object
    registry.js                the capability catalogue (drives the reference index + the LLM tool schema)
    llm-context.js             local-LLM bridge: buildContext() · buildToolSchema() · runTool()
    chart.js                   SVG chart-wheel renderer (the only DOM-touching core file)
    data/                      dignities-data, planets, signs, houses, degree-tables, glossary
  js/app/                      page logic: shared chrome, autolink, horary, book1, book1-master, book3,
                               workbench (the unified tool), assistant (local-LLM panel), state (share/export)
pages/
  workflow.html                chapter map & workflows (per-chapter, all three books)
  tools.html                   tools hub (every calculator + what each computes)
  contents.html                master index · glossary.html · read.html
  book1|book2|book3|about/      content pages & calculators
.github/workflows/pages.yml    GitHub Pages deployment (self-enabling)
MASTER-PLAN.md                 the full Lilly × Picatrix vision and phased roadmap
HANDOFF.md                     state, architecture rules, verify harness, bundle procedure
PLAN.md                        the original plan and feature list
```

## Deployment

Pushing to the development branch triggers `.github/workflows/pages.yml`, which
self-enables GitHub Pages and publishes the site to
`https://occult-kranti.github.io/astrology-sim-ant/`.

## Licence & credits

Educational, non-commercial. Astronomy by Don Cross's astronomy-engine (MIT).
Text and tables after William Lilly, _Christian Astrology_ (1647), cross-checked
against modern editions and traditional-astrology scholarship (see About & Sources).
