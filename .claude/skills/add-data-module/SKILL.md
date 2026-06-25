---
name: add-data-module
description: Scaffold a new cited data module for this Lilly/Picatrix astrology site (e.g. lunar-mansions, behenian-stars, decan-faces, planetary-magic). Use when adding any reference dataset to assets/js/core/data/. Enforces the project accuracy discipline — provenance per record, discrepancies flagged in-data, a headless test, and no DOM in core. Run accuracy-check first for any contested value.
---

# add-data-module — sourced data the right way

Follow these steps for any new dataset (see `research/SOURCE-DATA.md` for the data + caveats).

## 1. Validate first
Run the **accuracy-check** skill on any contested value (Behenian star natures/longitudes,
decan-face variants, mansion uses, pitted/azimene degrees). Get ≥2 agreeing sources or flag it.

## 2. Create `assets/js/core/data/<name>.js`
- **Pure data + pure helpers only — no DOM** (core stays headless-testable).
- Header comment: what it is, the source(s), the epoch (for time-varying data), and any caveat.
- **Every record carries a `source` field.** Where sources disagree, include the variants:
  e.g. `nature: 'Mars+Venus', natureAlt: 'Venus', sourceNote: 'Sirius: Mars+Venus (Agrippa) vs Venus (Lilly)'`.
- For time-varying values (fixed-star longitudes) store a **catalog epoch value** and export a
  function that **precesses to the chart date** (≈50.29″/yr) — never hardcode one epoch as "now".
- Export lookup helpers used by pages/engine (e.g. `mansionOf(lon)`, `faceOf(lon)`,
  `behenianLongitude(name, date)`, `starsInAspect(chart, orb)`).

Skeleton:
```js
// <name>.js — <what>. Source: <cite>. Epoch: <if any>. Caveat: <load-bearing flag>.
export const <NAME> = [
  { /* …fields… */, source: '<cite>' },
];
export function <lookup>(/* … */) { /* pure */ }
```

## 3. Add a headless test to `scripts/engine-test.mjs`
Assert: record **count** (28 mansions / 15 Behenian / 36 faces / 7 planets); **boundary math**
(`mansionOf(0)===1`, `mansionOf(359.9)===28`); **precession sanity** (a 2020-precessed longitude
matches the SOURCE-DATA cross-check ±0.2°); **every record has `source`**.

## 4. Verify & wire
`node scripts/engine-test.mjs` green → render it on a page (in `assets/js/app/`, not core) →
run the **verify-site** skill → cross-link from the Glossary and the relevant tool.

## Principles (non-negotiable)
- Fidelity to the cited source; flag where Lilly/Picatrix/Agrippa/modern practice differ.
- Honest framing: magical material is **historical practice**, described not prescribed; note
  toxic/illegal historical substances without recommending them.
