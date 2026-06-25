# Critical review — coverage, correctness, and a mathematician's lens (2026-06-25)

A structured review of **The Astrologer's Workbench**: is every chapter of the *Picatrix*
and of Lilly's *Christian Astrology* calculated and organised correctly; what is still wrong
or thin; the unifying mathematics; and a prioritised plan. Pairs with `COVERAGE.md`,
`MASTER-PLAN-V2.md`, and the live `pages/how-it-works.html`.

---

## 1. Coverage audit

### Picatrix (Ghāyat al-Ḥakīm), book by book
| Book | Subject | Status | Where / note |
|---|---|---|---|
| **I** — the heavens, the Moon's mansions | the **28 mansions** + uses | ✅ calculated (`mansionOf`, live prec* n/a) | `data/lunar-mansions.js`, [mansions](pages/picatrix/mansions.html) |
| I — the "Perfect Nature", planetary spirits/forms | ⛔ | reference-only; **gap** |
| **II** — celestial figures, faces, fixed stars, images | the **36 decan faces** | ✅ | `data/decan-faces.js`, [faces](pages/picatrix/faces.html) |
| II — the **15 Behenian fixed stars** | ✅ with **live precession** (50.29″/yr) | `data/behenian-stars.js`, [stars](pages/picatrix/stars.html) |
| II — the **planetary images** (talisman figures, II.22–46) | ◑ | the *faces* images are in; the per-planet talisman images are described in the talisman step but not tabled as data — **gap** |
| **III** — planetary properties, suffumigations, colours, spirits | per-planet **correspondences** | ✅ | `data/planetary-magic.js`, [correspondences](pages/picatrix/correspondences.html) |
| III — the planetary **prayers**; the consecrating fumigation | ◑ | prayer-**angel names** only; the prayer texts not included; the **suffumigation-as-consecration step** now in the talisman flow |
| III — the spirit **systems** | ◑ | two of three represented (Picatrix prayer-angel; Agrippa triad). The **Picatrix "Mirror" angels** are flagged but **not yet in data** — gap |
| **IV** — lunar-sign prayers, recipes, natural & alchemical magic | ⛔ | reference-only; framing-sensitive; **gap** |
| **Bridge** — election & talisman over the chart | ✅ | `election.js`, `talisman.js`, [election](pages/picatrix/election.html), [talisman](pages/picatrix/talisman.html) |

**Verdict:** the *computational* heart of Picatrix I–III (mansions, faces, stars,
correspondences, election, talisman) is calculated and organised correctly and cross-linked.
The *textual/ritual* remainder (Perfect Nature, prayer texts, Mirror angels, Book IV, the
distinct planetary-image set) is reference-level or absent — appropriate for an honest study
edition, but the named gaps should be closed for completeness.

### Lilly, *Christian Astrology*, book by book
| Book | Status | Where |
|---|---|---|
| **I** — signs, planets, houses, aspects, **essential & accidental dignity**, almuten, terms/faces/triplicities, fixed stars, Part of Fortune, antiscia, planetary hours, degree tables | ✅ complete | `dignities.js`, `aspects.js`, `planetary-hours.js`, `astro.js`, [Book I](pages/book1/index.html) |
| **II** — horary: considerations/radicality, significators, **perfection** (direct/translation/collection/prohibition/refranation), timing, reception, the Moon's condition, the 12 houses of questions | ✅ mechanics; ◑ examples are static prose | `considerations.js`, `perfection.js`, `cautions.js`, [horary](pages/book2/horary.html), [examples](pages/book2/examples.html) |
| **III** — nativities: Lord of the Geniture, temperament, **profections & Lord of the Year**, **hyleg & alcocoden**, **primary directions**, **solar return** | ✅ core apparatus | `profections.js`, `hyleg.js`, `directions.js`, `solar-return.js`, [Book III Master](pages/book3/master.html) |
| III — rectification; natal topic-chapters (wealth/marriage/children/profession/accidents) | ⛔/◑ | future |

---

## 2. Critical review — open issues (by gravity)

**Method fidelity (Lilly).**
- *Chart-health is a flat severity count* (1 bad ∨ 3 caution ⇒ red), which is alien to Lilly's
  method of *weighing the actual significators of the matter*. Mitigated by an honest caveat in
  the legend; the real fix is to weight flags by whether they touch the querent/quesited
  significators. **(open)**
- *Part of Fortune* is computed Asc+Moon−Sun for both sects; the older rule reverses by night.
  Now flagged as a contested fork; a **sect-aware toggle** is still pending. **(open)**
- *Hyleg/alcocoden* and *primary directions* are simplified (documented). Directions are
  in-zodiac Naibod, not Placidian mundane. **(documented, acceptable)**

**Fidelity (Picatrix).**
- *Election is a weighted scorer, not a hard-constraint elector* — a high score can sit over a
  combust/retrograde ruler. Now reframed in copy as "ranks, not elects"; **gating filters**
  (never green if the ruler is retrograde/combust/in detriment) are still **(open)**.
- *Mansion fitness uses naive substring match* and treats malefic mansions as neutral. **(open)**
- *Mirror angels / planetary-image data / Book IV* not yet included (see audit). **(open)**

**Honesty.**
- Strong overall (disclaimers everywhere; "described not prescribed"; the verdict-colour
  disambiguation). The one missing *opportunity*: a **quantitative falsification demo** that
  shows, in-tool, that the metrics carry no out-of-sample signal (see experimental #5). **(open)**

**UX / software.**
- Fixed this round: the home **nested-anchor** layout bug; the nav **substring active-state**
  bug; a **skip link**; the Right-Now **Calculate** button; **per-result explanations** on the
  Book III master + how-it-works deep-links.
- Still open: **mobile nav collapse** (12 items); **SVG/PNG export**; **generalised URL-share**
  across all tools; the Picatrix correspondences page is a reference dead-end.

---

## 3. The mathematician's lens — one structure under many doctrines

The whole system is **modular arithmetic on the 360° circle plus a few finite cyclic groups**.
Seeing this unifies the code and suggests features.

**(a) Equal partitions of the circle → `floor(lon / arc)`.** Signs (30°, ×12), decan **faces**
(10°, ×36), **lunar mansions** (360⁄28 = 12.857°, ×28) are the *same operation* with a
different modulus; Ptolemaic **terms** are the only unequal ecliptic partition (5 per sign,
Σ = 30°), and **houses** the only non-ecliptic one (great-circle, Regiomontanus). One
abstraction — `partitionAt(lon)` returning {sign, face, term, mansion} — underlies four data
modules. *Common point:* a "every partition at this degree" view is one function away.

**(b) The Chaldean order is a cyclic group ℤ/7, and the planetary week is a theorem.**
Planetary **hours** walk the 7-cycle: `ruler(h) = CHALDEAN[(start + h) mod 7]`. Because a day is
24 hours and **24 ≡ 3 (mod 7)**, consecutive **day-rulers step by +3**: Saturn→Sun→Moon→Mars→
Mercury→Jupiter→Venus = Saturday…Friday — the order of the **week**. Since **gcd(3, 7) = 1**, the
+3 walk visits all seven, so the week is *forced* by number theory, not convention. This is a
genuine gem and the centre-piece of a "structure" explainer.

**(c) Profections are a ℤ/12 action.** profected sign = (ascSign + age) mod 12; activated house =
(age mod 12) + 1; period 12. The Lord-of-the-Year sequence is the ruler pulled back through this
map — a clean discrete dynamical system.

**(d) Precession is an affine time-map.** star_lon(t) = lon₀ + k·(t − t₀), k ≈ 50.29″/yr. The
Behenian longitudes are a straight line in time; everything "precesses" by the same k.

**(e) Dignity, cautions and election are the *same shape*: a linear scorecard + a threshold.**
score = Σ wᵢ·1[conditionᵢ] (dignity weights 5/4/3/2/1 and −5/−4/−5; election/cautions add their
own weighted testimonies), then a **traffic-light decision boundary** (green/amber/red). The
**almuten** is `argmax` of the positive part over the seven planets. So "dignity", "chart
health", "election verdict" and "best-vs-least now" are one classifier evaluated with different
weight vectors — which is exactly why the engine could reuse `dignities`→`cautions`→`election`.

**(f) Aspects are harmonics; antiscia are reflections; Lots are affine combinations.**
Ptolemaic aspects test |Δλ − 360/n| ≤ orb for n ∈ {1,2,3,4,6} — the divisor-harmonics of the
circle. **Antiscion** λ ↦ (360 − λ) is reflection across the solstitial (0° Cancer/Capricorn)
axis; **contra-antiscion** λ ↦ (180 − λ) is reflection across the equinoctial axis — the two
symmetries of the declination sine. The **Part of Fortune** is one point of the affine lattice
of **Arabic Parts**: Lot = Asc + (B − C).

**Common points between Lilly and Picatrix (the bridge, formally).** Both are *scoring functions
over one shared chart object*. The Moon's condition (VoC, via combusta, speed, phase) is the same
sub-engine for Lilly's considerations and Picatrix election; **dignity** (Lilly Bk I) is the
strength input to Picatrix ruler-fitness. The two traditions differ only in their weight vectors
and which house/aim they read — not in their primitives.

---

## 4. Experimental features (mathematician-flavoured, implementable)

Ranked by value × tractability. Each is honest-framing-safe.

1. **Structure / Patterns explorer** (`pages/structure.html`). Visualise (b)–(f): the stacked
   modular partitions at a chosen degree; the Chaldean 7-cycle and the **planetary-week theorem**
   (24 ≡ 3 mod 7, gcd = 1); the antiscia reflection axes; aspects as harmonics. Pure teaching,
   showcases the unification. *Cost: 1 page + small helpers.* **(recommended first)**
2. **Generalised Arabic Parts / Lots** (`core/lots.js`). `lot(asc, A, B, sect)`; Part of Fortune
   becomes one instance; expose Spirit, Eros, Necessity, Victory, etc. Clean affine math; also
   resolves the sect-fork honestly (a toggle). *Cost: small module + UI rows.*
3. **Election heat-map / time-scan** — score an aim across the next **7 days × 24 hours** as a
   grid; the weekly planetary-hour periodicity *emerges visually*. Reuses `electionScore`. *Cost:
   one canvas/SVG grid on the election page.*
4. **Falsification demo** (`pages/experiment.html`) — the honest-science centre-piece. Take a
   chart, then **permute the birth time** N times and plot the distribution of its dignity/verdict
   score; show that the real chart is unremarkable in the null distribution → a Carlson-style,
   in-tool demonstration that the metric has no out-of-sample signal. *Cost: one page; reuses the
   engine; mathematically and rhetorically strong.*
5. **Concordance graph** — the bipartite planet ↔ {mansion, face, star, operation} graph;
   surfaces the "common points" structurally (which items share a ruler). *Cost: derive from
   existing data; one view.*
6. **Dignity heat-wheel** — colour the zodiac by a planet's essential-dignity score λ ↦ score(λ);
   shows the piecewise/triplicity structure. *Cost: small SVG.*
7. **Harmonics view** — 5th/7th/9th-harmonic aspects (a natural extension of (f); clearly labelled
   modern). *Cost: extend `aspects.js`.*

---

## 5. Next-steps plan (prioritised)

**Phase R1 — correctness & fidelity (highest value).**
- Election **gating filters** (never green over a retrograde/combust/detriment ruler); expose
  SOURCE-DATA §5 hard requirements.
- Chart-health: **weight flags by the significators** of the matter (demote the flat count).
- **Sect-aware Part of Fortune** toggle (ties into Lots, #2 above).
- Mansion fitness: replace substring with a curated keyword map; down-weight malefic mansions.

**Phase R2 — the mathematician features.**
- Build #1 **Structure explorer** and #4 **Falsification demo** (the two with the most
  educational/honesty payoff), then #2 **Lots** and #3 **election heat-map**.

**Phase 3 (carried) — polish.** SVG/PNG export; generalised URL-share; mobile nav collapse;
finish a11y landmarks; un-dead-end the correspondences page.

**Phase 4 (carried) — live worked examples.** Convert Lilly's static charts (Ship at Sea, Stolen
Fish, Marriage) to recomputed, annotated figures, verified against his printed positions.

**Picatrix completeness.** Add the **Mirror-angel** data, the per-planet **talisman-image** table
(II.22–46), and a sourced selection of **Book IV** lunar prayers (historical framing).

**Accuracy finishing.** `accuracy-check` the flagged pitted/azimene/fortune degrees; add Picatrix
I.4 per-mansion talismanic images.

Every item ends at the **`verify-site`** gate (audit + engine test + 0-console-error sweep).
