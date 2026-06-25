# Coverage audit — Lilly's *Christian Astrology* & the *Picatrix*

Snapshot of what the site computes vs. what the source texts contain, and where the
gaps are. Pairs with `ROADMAP.md` (the plan) and `research/SOURCE-DATA.md` (the data).
Legend: ✅ done & verified · ◑ partial · ⛔ not yet.

---

## William Lilly, *Christian Astrology* (1647)

### Book I — An Introduction to Astrology  → **✅ essentially complete**
| Lilly's matter | Status | Where |
|---|---|---|
| The 7 planets, their natures | ✅ | `data/planets.js`, [book1/reference](pages/book1/reference.html) |
| The 12 signs & their qualities | ✅ | `data/signs.js`, reference |
| The 12 houses & significations | ✅ | `data/houses.js`, [book2/houses](pages/book2/houses.html) |
| Aspects & Lilly's orbs | ✅ | `aspects.js`, `data/dignities-data.js` (ORBS) |
| Essential dignity (domicile/exalt/trip/term/face) | ✅ | `dignities.js`, [dignities tool](pages/book1/dignities.html) |
| Accidental dignity (house/speed/combust/etc.) | ✅ | `dignities.js`, Master Tool |
| Almuten of a degree | ✅ | `dignities.js` |
| Fixed stars (Lilly's table) | ✅ | `dignities-data.js` (FIXED_STARS) |
| Part of Fortune, nodes, antiscia | ✅ | `astro.js`, Master Tool |
| Planetary hours & day | ✅ | `planetary-hours.js`, [tool](pages/book1/planetary-hours.html) |
| Degree tables (masc/fem, light/dark, fortunate, body parts) | ✅ | `data/degree-tables.js`, [degrees](pages/book1/degrees.html) |
| Setting/erecting the figure | ✅ | `astro.js` (Regiomontanus + 3 systems), all tools |
| **Gap:** pitted/azimene/fortune degrees flagged "verify" | ◑ | `degree-tables.js` — needs `accuracy-check` pass |

### Book II — The Resolution of all manner of Questions (Horary)  → **✅ mechanics; ◑ examples**
| Lilly's matter | Status | Where |
|---|---|---|
| Questions house-by-house (1st–12th) | ✅ | [book2/houses](pages/book2/houses.html) |
| Significators of querent & quesited | ✅ | `horary.js` |
| Considerations before judgement (radicality) | ✅ | `considerations.js`, [page](pages/book2/considerations.html) |
| Perfection (direct/translation/collection/prohibition/refranation) | ✅ | `perfection.js`, Horary tool |
| Timing of the event | ✅ | `perfection.js` (`timeToPerfection`) |
| Reception / mutual reception | ✅ | `aspects.js` (`mutualReception`) |
| The Moon's condition (VoC, via combusta, etc.) | ✅ | `cautions.js`, `considerations.js` |
| Lilly's worked charts | ◑ **static** | [book2/examples](pages/book2/examples.html) — 4 charts, prose only |
| **Gap:** worked charts as **live, computed** figures | ⛔ | ROADMAP Phase 4 |

### Book III — The Judgement of Nativities  → **✅ core apparatus complete**
| Lilly's matter | Status | Where |
|---|---|---|
| The natal figure, positions & dignities | ✅ | [nativity](pages/book3/nativity.html), [Book III Master](pages/book3/master.html) |
| Lord of the Geniture | ✅ | `book3.js` / Book III Master |
| Temperament (humoral) | ✅ | Book III Master |
| Annual profection & Lord of the Year | ✅ | `profections.js` |
| Hyleg & Alcocoden (length of life) | ✅ *(contested, flagged)* | `hyleg.js` |
| Primary directions (Naibod) | ✅ *(approx., flagged)* | `directions.js` |
| Solar return (revolution) | ✅ | `solar-return.js` |
| **Gap:** rectification | ⛔ | future |
| **Gap:** natal topics (wealth/marriage/children/profession/accidents from the radix) | ◑ | partially via dignities + houses; no dedicated topic pages |
| **Gap:** mundane (Naibod) → rigorous Placidian mundane directions | ◑ | documented as out of scope in `directions.js` |

**Cross-cutting (all books):** the [Unified Master Tool](pages/master.html) reads one moment through
all three books at once; [Right Now](pages/now.html) does it live. Chart wheel, glossary auto-linking,
honest-science framing throughout.

---

## The *Picatrix* (Ghāyat al-Ḥakīm)  → **✅ reference + election; ⛔ talisman workflow**

| Picatrix matter | Status | Where |
|---|---|---|
| Bk I — the 28 Mansions of the Moon + uses | ✅ | `data/lunar-mansions.js`, [mansions](pages/picatrix/mansions.html) |
| Bk II — the 36 decan faces + images | ✅ | `data/decan-faces.js`, [faces](pages/picatrix/faces.html) |
| Bk II — the 15 Behenian fixed stars (live precession) | ✅ | `data/behenian-stars.js`, [stars](pages/picatrix/stars.html) |
| Bk III — per-planet correspondences (suffumigation/colour/metal/stone/spirits) | ✅ | `data/planetary-magic.js`, [correspondences](pages/picatrix/correspondences.html) |
| The election bridge (is this moment fit for X?) | ✅ | `election.js`, [Election](pages/picatrix/election.html) |
| Best-vs-least advised now | ✅ | [Right Now](pages/now.html) |
| **Bk II/III — the talisman *construction workflow*** (aim → election → correspondences → image → consecration → **recipe**) | ⛔ | **ROADMAP Phase T (next)** |
| Mansion images (Picatrix I.4) as talisman designs | ◑ | uses present; images per mansion ⛔ |
| Bk IV — the 12 lunar-sign prayers; ritual recipes | ⛔ | reference only; framing-sensitive |

---

## Headline gaps, in priority order
1. **Talisman construction workflow** — the explicit next step: a guided, step-by-step
   elector that assembles the full historical "recipe" and shows the end result. (ROADMAP **Phase T**.)
2. **Live worked examples** — turn Lilly's 4 horary charts (and natal/election examples) into
   recomputed, annotated figures. (ROADMAP **Phase 4**.)
3. **Accuracy finishing** — `accuracy-check` pass on the flagged pitted/azimene/fortune degrees;
   add Picatrix I.4 mansion images.
4. **Organize/link polish** — a11y, print stylesheet, save/share via URL, SVG/PNG export.
   (ROADMAP **Phase 3**; nav/hub linking already done incrementally.)
