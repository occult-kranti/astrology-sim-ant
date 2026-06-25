# Master Plan — Lilly × Picatrix integrated platform

This plan models the **complete** target system: William Lilly's *Christian Astrology*
(the astrology) integrated with the *Picatrix* (the astrological magic), as one
well-structured, cross-indexed, interface-driven learning-and-calculation site.

It maps **functionality per chapter of each book**, defines the **master tools** (one
per book, then a unified master tool), and specifies the **election engine** that is the
true bridge between Lilly and Picatrix.

> **Execution order (per the user): finish Book I to the last line first.** Picatrix and
> Books II–III deepen afterwards. Picatrix research is complete and captured below so the
> plan is whole; building follows the phases at the end.
>
> **Historical justification for pairing them:** a Picatrix manuscript demonstrably passed
> through Lilly's own circle (Simon Forman → Richard Napier → Elias Ashmole → William
> Lilly, BL MS). Lilly's astrology *is* the apparatus Picatrix assumes for its elections.

---

## 0. Status legend
✅ done · 🔧 in progress · ⏳ planned

Core engine ✅ · Books I–III content + 4 calculators ✅ · Glossary ✅ · Master Index ✅ ·
Book I Master Tool ✅ · **Cautions/chart-health engine ✅** · **Tools hub + Workflow chapter-map ✅** ·
Phase A (degree tables, body-parts, auto-linking, reader) ✅ · Phase B perfection+timing ✅ ·
Picatrix research ✅ · Election engine ⏳ · Picatrix data modules ⏳.

> **Build log (latest):** Phase A bundle merged to `main`; added `core/cautions.js` (the
> consolidated chart-health engine, the seed of the Election Engine), wired the full
> **Cautions & chart-health** panel + ascending-degree readout into the Master Tool, and added
> two navigation hubs — `pages/tools.html` (all calculators) and `pages/workflow.html` (the
> per-chapter map + worked examples + horary/nativity step-flows + Picatrix forward-map). Nav
> reworked; all 20 pages verified at 0 console errors. See `HANDOFF.md`.

---

## 1. The integration model

```
                         ┌──────────────────────────────┐
                         │   ELECTION ENGINE (the bridge)│
                         │  dignities + Moon condition +  │
                         │  planetary hour + mansion +    │
                         │  cautions  →  "is this moment  │
                         │  fit for X?"                   │
                         └───────────────┬────────────────┘
            Lilly (astrology) ───────────┤────────── Picatrix (magic)
   signs/planets/houses/dignities/       │   talismans, planetary spirits,
   aspects/horary/nativities             │   suffumigations, 28 mansions,
                                         │   36 decan faces, Behenian stars
                         ┌───────────────┴────────────────┐
                         │   UNIFIED MASTER TOOL           │
                         │  one chart → every reading +    │
                         │  every election + every caution │
                         └─────────────────────────────────┘
```

The site already computes the left side. The election engine reuses that exact
dignity/aspect/Moon machinery to drive the right side. Nothing is duplicated.

---

## 2. Functionality map — LILLY, chapter by chapter

### Book I — An Introduction to Astrology (chs. I–XXI)
| Chapter(s) | Concept | Functionality | Status |
|---|---|---|---|
| I–VI | Ephemeris, erecting a figure, the houses, terms of art | Chart engine; house systems; glossary of terms | ✅ |
| VII | The 12 houses & significations | Houses reference; house-by-house data | ✅ |
| VIII–XV | The 7 planets; shapes & colours | Planets reference; planet data | ✅ |
| XVI–XVII | The 12 signs; **antiscia**; sign classifications | Signs reference; antiscia calc | ✅ |
| XVIII | **Table of Essential Dignities** | Dignity table + Dignity Calculator + almuten | ✅ |
| XIX | Aspects, orbs, application/separation, **combustion, cazimi, reception**; **degree tables** (masculine/feminine, light/dark/smoky/void, pitted, azimene, fortunate); **body-parts grid** | Aspects engine ✅; combustion/cazimi ✅; reception ✅; **degree-tables lookup ⏳**; **7×12 body-parts grid ⏳** |
| XX–XXI | Considerations; significator/querent/quesited | Considerations engine; significator finder | ✅ |
| — | **Book I Master Tool** | Unified Book I calc | ✅ |

**Book I remaining (the "every line" pass):** ⏳ supplementary degree tables (azimene/pitted/
fortunate/masculine-feminine/light-dark-smoky-void) as data + a reference page + flags in the
Master Tool; ⏳ full planet×sign body-parts grid; ⏳ in-text auto-linking of every term to the
Glossary; ⏳ per-chapter reader pages keyed to the free scans.

### Book II — The Resolution of All Questions
| Topic | Functionality | Status |
|---|---|---|
| The method; considerations; significators | Step-by-step method; Horary Calculator | ✅ |
| Perfection: conjunction/aspect | Aspect applying/separating | ✅ |
| **Translation / collection of light** | Detector in horary output | ⏳ (engine pieces exist) |
| **Prohibition / refranation / frustration** | Detector in horary output | ⏳ |
| Reception & mutual reception | Reception in horary | ✅ |
| **Timing of events** | Degrees→time engine (sign mode + house) | ⏳ |
| House-by-house questions | Questions guide | ✅ |
| Worked charts | Case studies page | ✅ (live reproduction ⏳) |
| Decumbiture (6th, illness) | Decumbiture mode | ⏳ |
| **Book II Master Tool** | Horary super-view | ⏳ |

### Book III — The Judgement of Nativities
| Topic | Functionality | Status |
|---|---|---|
| Nativity, dignities, Lord of Geniture, temperament | Nativity Calculator | ✅ |
| Rectification (Trutine, Animodar, accidents) | Rectification helper | ⏳ |
| Hyleg / Alcocoden | Hyleg/alcocoden finder | ⏳ |
| **Primary directions (Naibod)** | Directions tool | ⏳ |
| **Annual profections** | Profection tool (Lord of the Year) | ⏳ |
| **Solar revolutions** | Solar-return chart | ⏳ |
| **Book III Master Tool** | Nativity super-view | ⏳ |

---

## 3. Functionality map — PICATRIX, chapter by chapter

*(Source: the four-book outline from research. Each becomes reference content + data; the
practical chapters feed the election/talisman engine. Presented as historical practice.)*

### Picatrix Book I — Foundations
| Ch. | Content | Functionality | Status |
|---|---|---|---|
| I.1–3 | Philosophy of magic; talisman theory; the spheres | Reference essay | ⏳ |
| **I.4** | **The 28 Mansions of the Moon + talismans** | **Mansions data + "Moon's mansion now" + per-mansion uses** | ⏳ |
| I.5 | Favourable constellations for images | Reference | ⏳ |
| I.6–7 | Microcosm; chain of being; *Hyle* | Reference essay | ⏳ |

### Picatrix Book II — Celestial sphere, decans, election theory
| Ch. | Content | Functionality | Status |
|---|---|---|---|
| II.2, 11, 12 | **The 36 decan faces + images** | **Decan-face reference + "face of a degree" lookup** | ⏳ |
| II.3 | **Election theory; lunar impediments; eclipses** | **Feeds the election engine** | ⏳ |
| II.10 | Planetary talismans, stones, metals, engraved figures | Talisman reference per planet | ⏳ |

### Picatrix Book III — Planetary properties, spirits, correspondences
| Ch. | Content | Functionality | Status |
|---|---|---|---|
| III.1–2 | Planetary & sign dominions; planetary hours | Cross-link to planetary hours ✅ | 🔧 |
| **III.3** | **Colours, garments, materials, suffumigations** | **Per-planet correspondence tables** | ⏳ |
| III.5–6 | Spirits/*pneumata*; the "Perfect Nature" | Reference (3 spirit-name systems, kept distinct) | ⏳ |
| **III.7–9** | **Sabian planetary prayers + angel names** | Per-planet ritual reference | ⏳ |
| III.10–11 | Protective talismans, charms | Reference | ⏳ |

### Picatrix Book IV — Spirits, lunar prayers, recipes
| Ch. | Content | Functionality | Status |
|---|---|---|---|
| IV.2 | Moon prayers in the 12 signs; magical characters | Reference | ⏳ |
| IV.6–9 | Incense recipes; the practical "recipe" catalogue | Talisman recipe reference | ⏳ |

### Complementary (NOT in Picatrix — flag clearly)
| Source | Content | Functionality | Status |
|---|---|---|---|
| *De Quindecim Stellis* / Agrippa II.47 | **The 15 Behenian fixed stars** (canonical list has **Alkaid**, not Fomalhaut) | Behenian-star data + "stars in aspect now" | ⏳ |
| Agrippa II.33 | Mansion magical virtues | Cross-reference with Picatrix mansion uses | ⏳ |
| Agrippa "Scale of Seven" | Angel / Intelligence / Spirit triads | Spirit cross-reference table | ⏳ |

---

## 4. The ELECTION ENGINE (the bridge) ⏳

A single module `election.js` answering: *"Is moment T at place P fit for operation O?"*
Reusing the existing dignity/aspect/Moon/planetary-hour code. Checks (from Picatrix III.4–5,
II.3, cross-checked with Lilly's considerations):

1. **Planet of the work** dignified (domicile/exaltation/triplicity/term), **direct**, **not
   combust**, **not cadent**, oriental/angular, free of Mars–Saturn squares.
2. **Planetary day + hour** of the operation's planet.
3. **Moon condition:** waxing (benefic) / waning (banishing); speed ≥ 12°/day; **not combust /
   under-beams (±12°)**; **not in the Via Combusta** (configurable 8° Libra–3° Scorpio or
   15°–15°); not conjunct/applying to a malefic; not cadent from the MC; applying by
   trine/sextile to the relevant benefic.
4. **Moon's mansion** appropriate to the operation (28-mansion table).
5. **Cautions panel:** lists every failing condition; the **Jupiter/Venus-on-angle override**
   ("rectify an unfortunate Moon"); the **inversion note** for malefic work.
6. **Election finder:** scan forward to suggest the next window satisfying the rules.

Output: a green/amber/red verdict + the full caution list + the talisman correspondences for
the chosen planet/mansion/decan/star.

---

## 5. Data modules to add ⏳
- `lunar-mansions.js` — 28 mansions: number, tropical boundary, Arabic & Picatrix/Agrippa
  names, principal stars, Picatrix + Agrippa uses, image/spirit/suffumigation.
- `decan-faces.js` — 36 faces: ruler (Chaldean), Agrippa image, Picatrix image (flag variants).
- `behenian-stars.js` — 15 stars (Alkaid canonical; Fomalhaut flagged modern): name, ~longitude
  (compute live), nature, stone, plant, use. Mark precession caveat.
- `planetary-magic.js` — per planet: spirit names (3 systems, kept separate), suffumigation,
  colour, metal, stone, plants, animals, garment/approach, governed petitions, ring image.
- `degree-tables.js` — masculine/feminine, light/dark/smoky/void, pitted, azimene, fortunate.

All sourced from the research reports (Warnock/Renaissance Astrology, Agrippa at
esotericarchives, Wikipedia Behenian, the Greer–Warnock & Attrell–Porreca Picatrix), with
discrepancies flagged in-data.

---

## 6. Cross-cutting: indexing, dictionary, linking (the user's emphasis) 🔧
- Glossary/Dictionary ✅ and Master Index ✅ done.
- ⏳ Auto-link every glossary term where it appears in body text (a small `autolink.js`).
- ⏳ Extend the Glossary to cover all Picatrix terms (mansion, decan, suffumigation, Behenian,
  Perfect Nature, the spirit systems).
- ⏳ Every planet/sign/star/mansion gets a hover-card / linked detail popup wherever named.
- ⏳ Per-chapter reader pages linked to the free public scans (Archive.org/Wikisource).

---

## 7. Phased roadmap

- **Phase A — Finish Book I (current):** degree tables + body-parts grid + flags in Master Tool;
  auto-linking of terms; per-chapter reader scaffolding. ⏳
- **Phase B — Book II depth:** translation/collection/prohibition/refranation/frustration
  detection; timing engine; decumbiture; Book II Master Tool; live worked-chart reproduction. ⏳
- **Phase C — Book III depth:** rectification, hyleg/alcocoden, profections, directions, solar
  returns; Book III Master Tool. ⏳
- **Phase D — Picatrix data + reference:** mansions, decan faces, Behenian stars, planetary
  correspondences/spirits; reference pages for all four Picatrix books. ⏳
- **Phase E — Election engine:** the bridge module + UI + caution system + election finder. ⏳
- **Phase F — Unified Master Tool:** one input → all readings + all elections + all cautions,
  with full cross-linking. ⏳

Each phase: research-verify → encode data → build → **verify in a real browser** → commit →
(bundle for manual upload while the managed push path is blocked).
