# Phase R6–R9 — fidelity, personalization, the honest-science explainers, accuracy & quality (2026-06-30)

The full post-R5 roadmap, shipped in four verified waves (each pushed to `origin/main`). A 5-agent research
workflow sourced the Lot formulas, the Picatrix-personalization scholarship, the significator-weighting design, the
four blank fortune-degree signs, and the glossary terms. The honest-science framing (astrology = pseudoscience,
*described never prescribed*) is **locked** — strengthened here.

## Wave 1 — R6 fidelity + personalization (`e5637a3`)
| Item | Notes |
|---|---|
| **Significator-weighted chart health** (gap #1) | `core/cautions.js` weights each caution by whether it touches the matter's significators (Lord of the Asc + Moon + sect light + quesited's lord = primary; natural significators = secondary). A grave flaw on a primary significator is decisive; flaws on unrelated planets fall away. Returns the significator sets, which are afflicted, and a weighted impediment. |
| **The seven Hermetic Lots + sect toggle** (gap #2) | `core/lots.js` — Fortune, Spirit, Eros, Necessity, Courage, Victory, Nemesis (Paulus) + the natal topic Lots (Marriage m/w, Children, Father, Mother), each Asc + A − B, sect-aware toggle. Wired into the reading, the natal-topics reader (computes the Lots it names), and the Workbench Lots panel. |
| **"Tuned to a specific person"** + the birthdate/Picatrix answer | `core/personalization.js` — the **almuten figuris** (the planet of the Perfect Nature, over the 5 hylegiacal places), the native's ruling planets, and a per-aim **radix-harmony** fit (suits/caution/neutral), Picatrix III.5–6. Surfaced in the Workbench election panel ("Tuned to this nativity" + a "For you" column) when a birth moment is present. **Answer: Picatrix magic is primarily electional, but the birth chart tunes *which* works suit you.** |
| **Person profiles** | `app/person.js` + `state.js` — save/load named PEOPLE (birth moments) on-device; a picker on the Workbench birth section fills the fields. |
| **"Use my location & time"** | `shared.js`/`location.js` — present-moment place pickers (workbench/horary/election/houses) also set date/time to *now* + the nearest-city offset on geolocate. Birth pickers unchanged. |
| **Glossary +15** | Election, Profection, Lord of the Year, Solar Return, Sect Light, Almuten Figuris, Naibod, Lot/Arabic Part, Lot of Spirit, Lot of Eros, Decumbiture, Suffumigation, Behenian, Joys, Profected Sign. |

## Wave 2 — R7 honest-science explainers (`d9f1d47`)
- **Falsification demo** (`experiment.html`, gap #14) — permute the moment across a window, plot the score's null
  distribution (inline SVG histogram), the chosen moment's percentile, and a sensitivity check (+7 min flips the verdict).
- **Structure & patterns** (`structure.html`, gap #13) — the planetary-week theorem (24 ≡ 3 mod 7), harmonic aspects,
  the divisor structure, and antiscia, each demonstrated by computation.
- **Election heat-map** (gap #15) — a 7-day × 24-hour grid; the weekly planetary-hour periodicity emerges as a diagonal.

## Wave 3 — R8 polish & accuracy (`b2b0b53`)
- **Antiscion fix** — `astro.js` antiscion/contra were **swapped**; the antiscion is the equal-declination point (180−λ,
  Taurus↔Leo). Corrected.
- **Antiscia in judgement** (gap #17) — `horary-judge.js` detects a significator on the other's antiscion/contra-antiscion.
- **Fortune degrees** (gap #23) — the 4 blank signs filled from Lilly p.116 (re-read from the scan); all 12 signs complete.
- **Election keyword precision** (gap #6) — word-boundary + negation-aware mansion-fitness match.

## Wave 4 — R9 quality & ship (this commit)
- **a11y** (gap #25) — a site-wide table-`scope` fixer in `mountChrome` (static + dynamically-rendered tables, via an
  observer); `:focus-visible`, `aria-hidden` glyphs and responsive inputs from R5. The **verify gate now asserts a11y
  landmarks** (one `<main>`, skip link, labelled nav, every data-table `th` has a scope) across all 40 pages.
- **Navigation** (gap #16) — `correspondences.html` un-dead-ended with a "use these correspondences" CTA row; the two
  explorers linked from the Tools hub + footer.
- **Export/share** (gap #24) — SVG/PNG export + copy-link added to the Horary tool (the Workbench already had the full set).
- **Docs** — MASTER-PLAN marks R6–R9 + the relevant gaps done; this review.

## Still open / deliberately deferred
- **Marriage worked chart** reads `denied` live (the Moon is void and the engine's mean-speed model misses the
  translation of light Lilly used) — the "Lilly vs the engine" callout explains exactly this limit; a teaching point,
  not a bug. A higher-fidelity speed model is out of scope.
- **Full export/share on every dedicated tool** — added to Horary + Workbench; the rest (book3, trajectory) still rely on
  their own state. **aria-live** on more live regions, and a contrast audit, remain nice-to-haves.
- **Out of scope (unchanged):** rigorous Placidian mundane directions; the Picatrix Book IV full per-sign liturgies.

## Verification
Each wave: `audit` 0 problems · `engine-test` all passed (84 registry exports) · real-Chromium sweep **40 pages, 0
errors, now including a11y-landmark assertions**.
