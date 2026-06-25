# Master Plan v2 — refreshed (2026-06-25)

The original handoff plan (`ROADMAP.md`) is **executed through Phase T**. This file is the
authoritative, current status + the remaining step-by-step work, including the two features
added this round (Location service, Life Trajectory). Pairs with `COVERAGE.md` (audit) and
`HANDOFF.md` (environment/ship). Every phase ends at the **`verify-site`** gate.

> **Verified each round:** `node scripts/audit.mjs` (0 problems), `node scripts/engine-test.mjs`
> (all pass — now incl. trajectory + location), and the 31-page real-Chromium sweep (0 console errors).

---

## ✅ DONE & verified
- **Phase 0** — docs reconciled (ROADMAP/HANDOFF/COVERAGE), skills in `.claude/skills/`.
- **Phase 1** — Picatrix/fixed-star data (28 mansions, 15 Behenian w/ live precession, 36 faces,
  7-planet magic) + reference pages.
- **Phase 2A/2B** — `core/election.js` (electionScore/rankNow/findNextElection, via-combusta+Spica,
  moonDispositor) + Election page + live `now.html`.
- **Phase 2C** — natal engine (`profections`, `hyleg`+alcocoden, `directions`, `solar-return`) +
  Book III Master + Unified Master Tool.
- **Phase T** — `core/talisman.js` + the guided Talisman Workflow page.
- **This round — Location service** (`app/location.js`): `useMyLocation()`, offline `nearestCity()`,
  `attachGeolocate()`. **Wired into `shared.js` `wireCitySelect`**, so *every* tool now shows a
  "📍 Use my location" button + nearest-city readout (no external geocoding; coordinates only).
- **This round — Life Trajectory** (`core/trajectory.js` + `pages/trajectory.html`): a birth chart
  for **anywhere by lat/lon** (or "use my location") read across a life — natal signatures, the
  year-by-year **profection timeline & Lord of the Year**, **primary directions**, the **solar
  return**, and a **personalised Picatrix layer** (ruling planets → works the tradition counts as
  the chart's; the year's significations; how the election rules score the sky now; the
  highest-scoring talisman). **Shareable via URL** (`history.replaceState` round-trips the birth
  data) and **printable** (new `@media print` stylesheet).
- Headless tests extended (trajectory + location); adversarial review run; all confirmed findings
  fixed (framing → historical voice; temperament citation hedged; talisman pick scores all
  affinities; page linked from nav/footer/Tools hub).

---

## ▶ REMAINING — step by step

### Phase 3 finish — organize / link / share / export
1. **SVG/PNG export** of the chart wheel — `XMLSerializer` for SVG, `canvas.toDataURL` for PNG;
   a "Download chart" button on the wheel in horary / master / trajectory / now. *(not started)*
2. **Generalise save/share** — lift the trajectory page's URL round-trip into a shared
   `encodeState/decodeState` helper and add a "Copy link" control to master / election / now.
   *(trajectory done; others pending)*
3. **A11y pass** — `role`/`aria-label` on the chrome injected by `shared.js`, alt/aria on glyph
   imagery, keyboard nav, contrast check; extend `verify-site` to assert landmarks. *(not started)*
4. **Print CSS** — ✅ done this round (recipe cards, readings). Sweep remaining pages for print
   clutter.
5. **Glossary/hover-card completeness** — confirm every Picatrix/election/natal term auto-links.

### Phase 4 — live worked examples *(not started)*
6. Reusable `app/example.js` that casts a real chart and renders engine output inline.
7. Convert `pages/book2/examples.html` (Ship at Sea, Stolen Fish, Marriage) from static prose to
   **recomputed, annotated** figures; verify against Lilly's printed positions within tolerance.
8. A live Picatrix election worked example driven by the engine (the talisman page's worked
   example already recomputes live — extend the pattern).

### Accuracy finishing *(open)*
9. `accuracy-check` the flagged pitted/azimene/fortune degrees in `data/degree-tables.js`; fill the
   4 blank fortune-degree signs; record provenance in-data.
10. Add Picatrix I.4 per-mansion talismanic images to `data/lunar-mansions.js` (uses present;
    images pending).

---

## Honest status
The literature, tools, talisman track, the **location feature**, and the **life-trajectory
feature** are built and verified. What remains is **Phase 3 polish** (export, generalised
share, a11y), **Phase 4 live examples**, and **accuracy finishing** — all additive and gated by
`verify-site`. The astronomy/engine layer is complete; the remaining work is presentation,
shareability, and sourcing rather than new computation.
