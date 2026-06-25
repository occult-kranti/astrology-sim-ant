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
| **Home** | `index.html` — overview, the three books, the tools, the science note |
| **Book I — Fundamentals** | hub, signs/planets/houses reference, **Essential Dignity Calculator**, **Planetary Hours** |
| **Book II — Horary** | hub + step-by-step method, **Horary Chart Calculator**, considerations before judgement, house-by-house question guide, Lilly's worked charts |
| **Book III — Nativities** | hub + natal method, **Nativity Calculator** (Lord of the Geniture, temperament) |
| **About & Sources** | biography, editions, the modern revival, the scientific assessment, technical notes, full citations |

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
python3 -m http.server 8099
# then open http://localhost:8099/index.html
```

## Project structure

```
index.html                     home page
assets/
  css/style.css                design system
  js/lib/astronomy.js          vendored astronomy-engine (MIT)
  js/core/                     calculation engine
    astro.js                   positions, angles, houses, Part of Fortune, node
    dignities.js               essential + accidental scoring, almuten, reception rulers
    aspects.js                 Ptolemaic aspects, Lilly orbs, applying/separating
    considerations.js          considerations before judgement
    planetary-hours.js         Chaldean-order day & hour rulers
    chart.js                   SVG chart-wheel renderer
    data/                      dignities-data, planets, signs, houses (from Lilly's text)
  js/app/                      page logic: shared chrome, horary, book1, book3
pages/book1|book2|book3|about/ content pages
.github/workflows/pages.yml    GitHub Pages deployment (self-enabling)
PLAN.md                        the full plan, feature list and roadmap
```

## Deployment

Pushing to the development branch triggers `.github/workflows/pages.yml`, which
self-enables GitHub Pages and publishes the site to
`https://occult-kranti.github.io/astrology-sim-ant/`.

## Licence & credits

Educational, non-commercial. Astronomy by Don Cross's astronomy-engine (MIT).
Text and tables after William Lilly, _Christian Astrology_ (1647), cross-checked
against modern editions and traditional-astrology scholarship (see About & Sources).
