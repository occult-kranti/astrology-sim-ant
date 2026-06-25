# Master Plan — The Astrologer's Workbench (Lilly × Picatrix × Jyotiṣa)

**Coverage audit + phased roadmap. Authoritative master plan, refreshed 2026-06-25.**

This is the project's spine document. It supersedes the original vision plan (preserved in git
history) with a **verified** coverage audit — every status below was checked against the actual
code in `assets/js/core/` and the pages in `pages/`, not just prior docs. It pairs with
`COVERAGE.md` (the short audit), `REVIEW.md` (the critical + mathematician's-lens review),
`MASTER-PLAN-V2.md` (the round-by-round build log), `HANDOFF.md` (environment + ship), and
`research/SOURCE-DATA.md` (the cited data).

> **Honest framing (load-bearing, non-negotiable).** Astrology has no demonstrated predictive
> validity and is classified as a pseudoscience. This project reconstructs Lilly's *Christian
> Astrology* (1647), the *Picatrix*, and Jyotiṣa as **historical formal systems** — described,
> never prescribed. The **astronomy is real and verifiable**; the **interpretations are the
> tradition's**, offered for study. "Coverage" below means **fidelity to the historical texts'
> own techniques**, never predictive accuracy. The canonical disclaimer lives in
> `core/reading.js` (`HONEST_FRAMING`) and is locked into the LLM system prompt.

> **The registry is the spine of "what exists."** `assets/js/core/registry.js` catalogues 21
> capabilities, each naming the module, export, citation, surfacing page, how-it-works anchor,
> and glossary terms. An anti-drift test in `scripts/engine-test.mjs` asserts every referenced
> export/page/anchor/term actually resolves — so the map cannot silently rot. This audit uses it
> as the index and verifies each entry against the implementation.

Legend: ✅ **IMPLEMENTED** (working calculator) · ◑ **PARTIAL** (works but simplified/flagged, or
data incomplete) · 📖 **EXPLAINED ONLY** (content, no tool) · ⛔ **MISSING**.

---

## Status at a glance

The computational heart is **built and verified**: Lilly Books I–III, Picatrix I–III (the
computable parts), the Lilly↔Picatrix election/talisman bridge, a whole-life trajectory, a
unified `fullReading` spine, a capability registry, a Claude-powered grounded assistant, and a
**second independent system** (Jyotiṣa / Jagannath Hora). Verified each round via `verify-site`
(audit `Problems: 0`; engine-test `all passed`; real-Chromium sweep of 35 pages, 0 console errors).

**What genuinely remains** is not core astronomy — it is **(1)** a handful of fidelity/correctness
refinements already flagged in REVIEW; **(2)** the *textual/ritual* remainder of Picatrix (Book IV
prayers, the Mirror-angel spirit system, per-mansion talismanic images, the per-planet planetary-image
set); **(3)** Lilly's Book II **house-by-house worked judgements** and **live** reproductions of his
printed charts; **(4)** Book III **rectification** and **natal topic** chapters; and **(5)** the
proposed mathematician's-lens explainers (structure, lots, falsification, heat-map). *(The
**full six-fold Ṣaḍbala**, the **Vedic glossary + remedies**, and the **mobile-nav collapse** — gaps
#7/#8/#9/#16 below — were **shipped 2026-06-25**; see the round note.)*

### Shipped this round — "Phase R2", 2026-06-25 *(verified: audit 0 · engine-test all passed · 35-page Chromium sweep 0 errors)*
A user-driven round that completed several roadmap gaps and deepened the assistant + the second system:
- **Full six-fold Ṣaḍbala** (gap #7) — `vedic.js` `shadbala()` now computes Sthāna, Dig, Kāla, Ceṣṭā,
  Naisargika and Dṛk bala in **virūpas**, with required minimums, ratios, and Iṣṭa/Kaṣṭa phala (BPHS Ch. 27;
  documented JHora simplifications flagged). Rendered as a table on every Vedic panel.
- **Vedic glossary** (gap #8) — 20 Jyotiṣa terms (Sidereal Zodiac, Ayanāṁśa, Lagna, Graha, Nakṣatra,
  Vimśottarī Daśā, Pañcāṅga, Varga, Navāṁśa, Aṣṭakavarga, Ṣaḍbala, Bhāva, Kāraka, Bīja Mantra, Yantra…)
  in `data/glossary.js`, auto-linked and wired into the registry's `vedic` entry.
- **Vedic daily/birth remedies** (gap #9) — `data/vedic-remedies.js` (navagraha bīja+nāma mantras & japa,
  vāra observances, nakṣatra devatās, graha→yantra/gem, and a **modern-flagged** graha→āsana map), composed
  by `vedic.js` `buildPractice()` into `castVedic().practice`. The *selection* is algorithmic — the day's
  vāra lord, the **weakest graha by Ṣaḍbala**, the Lagna lord, the daśā lord and the Moon nakṣatra drive it —
  never hardcoded. Described, never prescribed; the āsana map is loudly labelled modern syncretism.
- **Mobile nav collapse** (gap #16, partial) — the 14-item bar now collapses behind an accessible hamburger
  below 880 px (`shared.js` + `style.css`); breadcrumbs/≤2-click reachability remain.
- **Deeper Claude assistant** (beyond the roadmap) — the Codex now embeds the **whole** computed reading
  (both systems + the daily/birth practice) and asks for a cross-system **Concordance** (pattern-finding,
  agree/disagree between tropical & sidereal); the agentic flow gained `castVedic`/`vedicPractice` tools so a
  custom prompt computes via the **in-browser engine** instead of browsing the site; richer Vedic facts in
  `buildContext`.
- **Unified Master birth moment** — `master.html` gained an optional birth-moment block (+ a prominent
  📍 use-my-location button), so Book III and the Vedic chart read from an **actual birth**.
- **Save & publish** — the Workbench silently auto-saves each reading's inputs to `localStorage`, exports a
  **Markdown** summary, and can publish a reading to a **secret GitHub Gist** with the user's own token
  (the honest browser path to "send it to GitHub" — a static site has no backend).
- **Workbench superset** — added the Picatrix moment-correspondences (mansion / decan faces / Behenian stars)
  it previously lacked, so it is now a true superset of the Master tool.

---

## (A) COVERAGE TABLES

### A.1 — Lilly, *Christian Astrology*, **Book I** (Introduction) → essentially complete

| Technique (Lilly's matter) | Status | Evidence |
|---|---|---|
| Erecting the figure; positions of the 7 planets + nodes | ✅ | `core/astro.js` `castChart`/`bodyPosition` (VSOP87, ~1′); registry `positions` |
| Houses — Regiomontanus (default), Placidus, whole, equal | ✅ | `astro.js` `houses` (`regioCusp`/`placidusCusp`) |
| The 7 planets, their natures, significations | ✅ | `data/planets.js` (7, ~20 fields each); `book1/reference.html` (live render) |
| The 12 signs & classifications | ✅ | `data/signs.js` (12 + ELEMENTS/MODES) |
| The 12 houses & significations | ✅ | `data/houses.js` (12, incl. joys/co-significators/questions) |
| Aspects, orbs, moieties, applying/separating | ✅ | `core/aspects.js` `aspectBetween`/`allAspects` (Lilly's planet-based orbs + moiety rule) |
| Combustion, cazimi, under-the-beams | ✅ | `dignities.js` `accidentalDignity`; `cautions.js` |
| Reception & mutual reception | ✅ | `aspects.js` `mutualReception` (all 5 dignity kinds) |
| **Table of Essential Dignities** (domicile/exalt/trip/term/face + detriment/fall/peregrine) | ✅ | `dignities.js` `essentialDignity`; `data/dignities-data.js` (terms verified to sum 30°/sign); tool `book1/dignities.html` |
| Accidental dignity (house/speed/retro/combust/star) | ✅ | `dignities.js` `accidentalDignity`; `book1/master.html` |
| Almuten of a degree | ✅ | `dignities.js` `almuten` (argmax of essential dignity) |
| Part of Fortune; antiscia/contra-antiscia; mean node | ✅ | `astro.js` `partOfFortune`/`antiscion`/`contraAntiscion`/`meanNode` |
| Planetary day & hour (Chaldean order, sunrise-based) | ✅ | `core/planetary-hours.js` `planetaryHour`/`hoursTable`; tool `book1/planetary-hours.html` |
| Fixed stars (Lilly's accidental-dignity set: Regulus/Spica/Algol) | ✅ | `dignities-data.js` FIXED_STARS (3) |
| Degree tables — masculine/feminine; light/dark/smoky/void; body-parts grid | ✅ | `data/degree-tables.js` (12 signs each); tool `book1/degrees.html` |
| Degree tables — **fortunate degrees** | ◑ | `degree-tables.js` FORTUNE_DEG — **4 signs blank** (Taurus/Leo/Sagittarius/Capricorn, left empty not guessed) |
| Degree tables — **pitted (deep) & azimene degrees** | 📖/⛔ | deliberately **not encoded** (transcriptions conflict); shown for reference only, `degree-tables.js` ~L106-108 |

**Book I verdict:** complete to "every line" except the deliberately-deferred pitted/azimene
lists and 4 blank fortune-degree signs — both held back on **accuracy** grounds, awaiting an
`accuracy-check` pass.

### A.2 — Lilly **Book II** (Horary) → mechanics complete; judgements & live examples open

| Technique | Status | Evidence |
|---|---|---|
| Considerations before judgement (radicality) | ✅ | `core/considerations.js` (all 8); `book2/considerations.html` (📖 prose) |
| Significators of querent & quesited; the 12 houses of questions | ✅ | `app/horary.js`; `data/houses.js` `questions`; `book2/houses.html` (live grid) |
| The Moon's condition — void of course (with exceptions), via combusta | ✅ | `considerations.js` `moonVoidOfCourse`/`moonInViaCombusta`; `election.js` `isViaCombusta` (configurable bounds + **Spica exception**) |
| **Perfection** — direct, translation, collection, prohibition, refranation, reception | ✅ | `core/perfection.js` `modesOfPerfection` (all six detected) |
| Timing of the event (degrees → time by sign-mode + house) | ✅ | `perfection.js` `timeToPerfection` |
| Chart-health verdict (consolidated cautions) | ◑ | `core/cautions.js` `chartCautions` — works, but a **flat severity count**, not weighted by the *actual* significators of the matter (REVIEW open) |
| Horary calculator (one moment + quesited house → full judgement) | ✅ | `book2/horary.html` → `app/horary.js` |
| **Lilly's worked charts** (Ship at Sea, Stolen Fish, Marriage, Lost Dog) | 📖 | `book2/examples.html` is **static prose only** — imports `shared.js` (chrome) only, no engine; positions are narrated, not computed |
| **House-by-house judgement guidance** (Lilly's per-house question chapters, II.xvii–end) | 📖/◑ | houses described in data; **no dedicated per-house judgement walkthroughs** with the relevant significator/perfection logic surfaced per topic |
| Decumbiture (6th house, illness, critical days) | ⛔ | not built (named in early plan) |
| Antiscia *used in judgement* (as hidden aspects in horary) | ◑ | antiscia computed/displayed; **not woven into the perfection/aspect search** |

### A.3 — Lilly **Book III** (Nativities) → core apparatus complete; topics & rectification open

| Technique | Status | Evidence |
|---|---|---|
| The natal figure, positions, dignity ledger | ✅ | `book3/nativity.html` → `app/book3.js`; `book3/master.html` |
| Lord of the Geniture | ✅ | computed in `trajectory.js`/Book III master (greatest-dignity planet) |
| Temperament (humoral) | ◑ | `trajectory.js` ~L54/111 — explicitly **SIMPLIFIED** (coarse Asc+Moon+sect-light tally, not Lilly's full rule); citation hedged |
| Annual profection & Lord of the Year (ℤ/12) | ✅ | `core/profections.js` `annualProfection`/`lordOfYear`/`monthlyProfection` |
| Hyleg & Alcocoden (length of life) | ◑ | `core/hyleg.js` — full sect-ordered candidate logic, **contested**, every disputed choice surfaced in `assumptions`/`reason` |
| Primary directions | ◑ | `core/directions.js` — **simplified in-zodiac Naibod**, self-flagged "study approximations, not casting-grade"; **not** Placidian mundane (semi-arc) |
| Solar revolution (return) | ✅ | `core/solar-return.js` `solarReturn`/`solarReturnInstant` (bracket + bisect) |
| Whole-life trajectory (profection timeline + directions + SR + Picatrix overlay) | ✅ | `core/trajectory.js` `lifeTrajectory`; `trajectory.html` |
| **Rectification** (Trutine of Hermes, Animodar, accidents) | ⛔ | not built |
| **Natal topic chapters** (wealth/marriage/children/profession/honour/accidents to the 12 houses) | 📖/◑ | derivable from dignities+houses; **no dedicated topic readers** doing the per-house natal judgement |
| Rigorous Placidian **mundane** primary directions (semi-arc) | ⛔ | out of scope, documented in `directions.js` |

### A.4 — Cross-cutting (all three books)

| Capability | Status | Evidence |
|---|---|---|
| Unified `fullReading` spine (one moment → the whole engine, serializable + cited) | ✅ | `core/reading.js` `fullReading` |
| Unified Master Tool / Workbench | ✅ | `pages/master.html` (`master-unified.js`), `pages/workbench.html` (`workbench.js`) — JSON/SVG/PNG export, shareable URL |
| Live "Right Now" dashboard | ✅ | `pages/now.html` (`now.js`, auto-refresh) |
| Capability registry + anti-drift test | ✅ | `core/registry.js`; `scripts/engine-test.mjs` |
| Grounded AI assistant (Claude; Explain / Tools / Codex / Plan-a-working) | ✅ | `app/assistant.js` + `core/llm-context.js` (`buildContext`/`runTool`/codex/operation prompts) |
| Glossary / dictionary (auto-linked) | ◑ | `data/glossary.js` (92 terms) — **missing**: Election, Profection, Suffumigation, Behenian, Perfect Nature, the spirit-system terms |
| **Generalised Arabic Parts / Lots** (Eros, Necessity, Victory, Basis, …) | ◑ | `astro.js` `lot()` exists; `reading.lots` exposes **only Fortune + Spirit** — the seven Hermetic lots not surfaced |
| **Sect-aware Part of Fortune** (reverse by night) | ◑ | engine supports it (`partOfFortune({sectAware})`) but `castChart` calls it **non-sect-aware**; **no UI toggle** |

### A.5 — The **Picatrix** (Ghāyat al-Ḥakīm)

| Technique | Status | Evidence |
|---|---|---|
| **28 lunar mansions** + Moon's mansion now + uses | ✅ | `data/lunar-mansions.js` (28, cited) `mansionOf`; `picatrix/mansions.html` (live) |
| **36 decan faces** + face-of-a-degree + images (Agrippa, 3 Picatrix variants flagged) | ✅ | `data/decan-faces.js` (36, `imageAlt` variants); `faceOf`; `picatrix/faces.html` (live) |
| **15 Behenian fixed stars** with **live precession** (50.29″/yr); Alkaid canonical, Fomalhaut flagged modern | ✅ | `data/behenian-stars.js` `behenianLongitude`/`starsInAspect`; `picatrix/stars.html` (live) |
| Planetary hours (shared with Lilly) | ✅ | `planetary-hours.js`; cross-linked |
| **Per-planet correspondences** — suffumigation, colour, metal, stone, spirit-names | ✅ | `data/planetary-magic.js` (7); `picatrix/correspondences.html` (📖 reference render) |
| **Election engine** (is this moment fit for aim X?) — 11 operations, gating filters, ranking, find-next-window | ✅ | `core/election.js` `electionScore`/`rankNow`/`findNextElection`/`nextAuspiciousTime`/`OPERATIONS`; `picatrix/election.html` |
| **Talisman recipe** (aim → election → correspondences → mansion/face/star → design → cited steps) | ✅ | `core/talisman.js` `talismanRecipe`/`allRecipes`; `picatrix/talisman.html` (wizard + worked example) |
| Spirit-name systems | ◑ | **2 of 3** present (Picatrix prayer-angel + Agrippa Angel/Intelligence/Spirit triad). **Picatrix "Mirror" angels** flagged but **not in data** |
| **Per-mansion talismanic images** (Picatrix I.4) | ⛔ | `lunar-mansions.js` header: "image/spirit/suffumigation to be added in a second pass" — **uses present, images absent** |
| **Per-planet planetary-image set** (the talisman figures, Picatrix II.22–46, distinct from decan-face images) | 📖/⛔ | described in the talisman step; **not tabled as data** |
| **Planetary prayers / invocation texts** (Picatrix III.7–9 Sabian prayers) | 📖/⛔ | **angel names only**; prayer texts absent |
| **The "Perfect Nature"** (Picatrix III.6) | 📖/⛔ | reference-level/absent — gap |
| **Book IV** — the 12 lunar-sign prayers; incense recipes; natural & alchemical magic | ⛔ | not encoded (framing-sensitive; historical-only if added) |
| Magic squares / kāmeas; planetary seals/sigils | ⛔ | **not present** (note: kāmeas are Agrippa II.22, not strictly Picatrix — flag clearly if added) |

**Picatrix verdict:** the **computable** heart (mansions, faces, Behenian stars, correspondences,
election, talisman) is implemented and cross-linked. The **textual/ritual remainder** (Mirror
angels, prayer texts, Perfect Nature, mansion images, the planetary-image set, Book IV, magic
squares) is reference-level or absent — acceptable for an honest study edition, but the named
gaps are the Picatrix-completion backlog.

### A.6 — Jyotiṣa (Vedic) — the second, independent system

| Technique | Status | Evidence |
|---|---|---|
| Sidereal chart (Lahiri ayanāṁśa, live precession), whole-sign houses, 9 grahas + nakṣatra/pada | ✅ | `core/vedic.js` `castVedic`; `data/vedic-data.js`; `pages/vedic/index.html` + 🕉 side-by-side toggle on every tool |
| Pañcāṅga (tithi, vāra, nakṣatra, yoga, karaṇa) | ✅ | `vedic.js` |
| Vimśottarī daśā (mahā + antar, balanced from Moon) | ✅ | `vedic.js` (120-yr cycle verified) |
| Vargas D1–D60 (book unit-test vectors pass) | ✅ | `vedic-data.js` `vargaSign` |
| Aṣṭakavarga (BAV + SAV, checksum 337) | ✅ | `vedic.js` |
| Parāśarī dignities; core yogas | ✅ | `vedic.js` |
| **Ṣaḍbala** | ✅ | **Full six-fold** (Sthāna/Dig/Kāla/Ceṣṭā/Naisargika/Dṛk) in virūpas + required minimums + Iṣṭa/Kaṣṭa (`vedic.js` `shadbala()`, BPHS Ch. 27; JHora simplifications flagged in `note`) — *shipped 2026-06-25* |
| **Vedic glossary** (sidereal zodiac, ayanāṁśa, nakṣatra, daśā, varga, graha, ṣaḍbala terms) | ✅ | 20 terms in `data/glossary.js`, auto-linked, wired into registry `vedic` — *shipped 2026-06-25* |
| **Daily / birth remedies** (mantra/japa, vāra observance, yantra/gem, āsana — historical/cultural) | ✅ | `data/vedic-remedies.js` + `vedic.js` `buildPractice()` → `castVedic().practice`; selection algorithmic (vāra lord, weakest graha by Ṣaḍbala, Lagna/daśā lord, Moon nakṣatra). Described not prescribed; āsana map flagged modern — *shipped 2026-06-25* |

---

## (B) RANKED GAP LIST (value × effort)

Effort: **S** ≤ ½ day · **M** 1–2 days · **L** 3+ days. Value reflects fidelity-to-text and
educational payoff (never predictive worth).

| # | Gap | Book/Work | Effort | Value | Why it matters |
|---|---|---|---|---|---|
| 1 | **Significator-weighted chart health** — weight cautions by whether the flag touches the querent/quesited (or natal) significators, not a flat count | Lilly II | M | **High** | The flat count is *alien to Lilly's method*; this is the single most-cited fidelity defect (REVIEW §2) |
| 2 | **Sect-aware Part of Fortune toggle + generalised Lots view** (`core/lots.js`: Spirit, Eros, Necessity, Victory, Basis, Courage, Nemesis) | Lilly I | S→M | **High** | Resolves the sect-fork honestly; clean affine math; unlocks a whole class of Hermetic technique already half-wired |
| 3 | **Lilly's worked charts as LIVE figures** (Ship at Sea, Stolen Fish, Marriage, Lost Dog) — recompute from historical data, draw the wheel, annotate his reasoning; verify vs his printed positions | Lilly II | L | **High** | The headline pedagogy gap; `examples.html` is currently prose-only |
| 4 | **House-by-house horary judgement walkthroughs** — per-topic (lost objects, marriage, sickness, travel, lawsuits…) flows that surface the right significators + perfection per question | Lilly II | L | **High** | This *is* Book II's bulk; currently only house data + a generic calculator |
| 5 | **Per-mansion talismanic images** (Picatrix I.4) into `lunar-mansions.js` | Picatrix I | M | Med | The acknowledged "second pass"; completes the mansion records the talisman flow already wants |
| 6 | **Election gating polish** — already gates retrograde/combust/detriment/fall; add **curated mansion-fitness keyword map** (replace naive substring) and **down-weight malefic mansions** | Picatrix | M | Med | REVIEW open item; removes a known false-positive path in the elector |
| 7 | ✅ **DONE (2026-06-25)** — **Full six-fold Ṣaḍbala** (Kāla, Ceṣṭā, Dṛk added) + Iṣṭa/Kaṣṭa phala | Jyotiṣa | L | Med | The flagged Vedic follow-up; finishes the JHora strength model. `vedic.js` `shadbala()` |
| 8 | ✅ **DONE (2026-06-25)** — **Vedic glossary terms** folded into the auto-linker | Jyotiṣa | S | Med | Closes the cross-link gap. 20 terms in `glossary.js`, wired to registry |
| 9 | ✅ **DONE (2026-06-25)** — **Vedic daily/birth remedies** (mantra/japa/deity/yantra/gem; āsana flagged modern; selection algorithmic) | Jyotiṣa | M | Med | The flagged Vedic remedy follow-up; kept historical-described. `data/vedic-remedies.js` + `buildPractice()` |
| 10 | **Glossary completion (Western/Picatrix)** — Election, Profection, Suffumigation, Behenian, Perfect Nature, the two spirit systems | cross | S | Med | Auto-linking is wired; the terms simply need entries |
| 11 | **Picatrix Mirror-angel spirit system** (3rd system) into `planetary-magic.js`, kept distinct | Picatrix III | S | Med | Completes "two of three"; pure cited data add |
| 12 | **Per-planet planetary-image set** (Picatrix II.22–46) as data, distinct from decan-face images | Picatrix II | M | Med | The talisman *design* note currently has no backing image table |
| 13 | **Structure / Patterns explorer** page — the modular-partition + planetary-week-theorem (24≡3 mod 7, gcd=1) + antiscia-reflection + aspect-harmonics teaching view | cross | M | Med-High | REVIEW's recommended-first experimental; pure teaching, showcases the unification |
| 14 | **Falsification demo** page — permute birth time N× over `fullReading`, plot the verdict/dignity null distribution → in-tool, honest-science centre-piece | cross | M | Med-High | The strongest honesty feature; mathematically + rhetorically clean |
| 15 | **Election heat-map** (7 days × 24 h grid of `rankNow` for an aim; the weekly planetary-hour periodicity emerges) | Picatrix | S | Med | Cheap, visual, reuses `electionScore` |
| 16 | ◑ **PARTLY DONE (2026-06-25)** — **Mobile nav collapse** shipped (14-item bar → accessible hamburger < 880 px, `shared.js`+`style.css`). **Remaining:** breadcrumbs, "every page ≤2 clicks", un-dead-end `correspondences.html` | cross | M | Med | The standing UX debt |
| 17 | **Antiscia woven into judgement** (treat antiscia/contra-antiscia as hidden contacts in the perfection/aspect search) | Lilly II | S | Low-Med | Lilly uses them in judgement; currently display-only |
| 18 | **Decumbiture mode** (6th-house illness, critical days) | Lilly II | M | Low-Med | A named early-plan feature; niche |
| 19 | **Natal topic readers** (wealth/marriage/children/profession/accidents to the 12 houses) | Lilly III | L | Med | Book III's back half; derivable but not surfaced as topic flows |
| 20 | **Rectification helper** (Trutine of Hermes, Animodar, accidents-based) | Lilly III | L | Low-Med | Completeness; lower demand |
| 21 | **Picatrix Book IV** (12 lunar-sign prayers, incense recipes) + **Perfect Nature** + **planetary prayer texts** — historical-only | Picatrix III–IV | M | Low-Med | Framing-sensitive; reference-level, describe-never-instruct |
| 22 | **Magic squares / kāmeas + planetary seals** (flag as Agrippa II.22, not strictly Picatrix) | (Agrippa) | M | Low | Frequently expected by users; clearly label provenance |
| 23 | **Accuracy finishing** — `accuracy-check` the pitted/azimene/fortune degrees; fill the 4 blank fortune signs; record provenance in-data | Lilly I | S | Med | Closes the only Book I data holes, on the accuracy mandate |
| 24 | **SVG/PNG export + generalised URL-share across all tools** | cross | S | Low-Med | Mostly done in `app/state.js`/Workbench; sweep the remaining tools |
| 25 | **A11y pass** (ARIA landmarks, keyboard nav, contrast, alt on glyphs; extend `verify-site` to assert landmarks) | cross | M | Med | Standing quality debt |

---

## (C) PHASED ROADMAP

Ordering integrates the already-planned items (REVIEW's R1/R2, the carried Phase 3/4, the
accuracy backlog) with the gaps above, by value/effort. **Every phase ends at the `verify-site`
gate** (audit `Problems: 0` + engine/data headless tests + 0-console-error Chromium sweep) and is
committed (push direct to `origin/main`, or `ship-bundle` if blocked). Run `accuracy-check` before
encoding any contested datum; new data modules use `add-data-module` (provenance per record,
in-data discrepancy flags, a headless test, no DOM in core).

### Phase 1 — Fidelity & correctness *(highest value, mostly REVIEW R1)*
Make the existing engine *truer to the texts* before adding surface area.
1. **Significator-weighted chart health** — gap #1.
2. **Sect-aware Part of Fortune + generalised Lots** (`core/lots.js`, sect toggle, `reading.lots` exposes the seven Hermetic lots) — gap #2.
3. **Election polish** — curated mansion-fitness keyword map; down-weight malefic mansions — gap #6.
4. **Glossary completion** (Western/Picatrix terms) + **Vedic glossary terms** — gaps #10, #8.
5. **Accuracy finishing** — `accuracy-check` the pitted/azimene/fortune degrees; fill 4 blank fortune signs — gap #23.

### Phase 2 — Picatrix completion *(close the named magic-layer gaps; historical framing throughout)*
6. **Per-mansion talismanic images** (Picatrix I.4) — gap #5.
7. **Mirror-angel spirit system** (3rd system) — gap #11.
8. **Per-planet planetary-image set** (Picatrix II.22–46) — gap #12.
9. *(Optional, framing-sensitive)* **Perfect Nature**, **planetary prayer texts**, and a sourced selection of **Book IV** lunar prayers — gap #21 (describe-never-instruct; note toxic/illegal historical substances without recommending).
10. *(Optional, clearly provenance-flagged as Agrippa)* **magic squares / kāmeas + seals** — gap #22.

### Phase 3 — The mathematician's-lens explainers *(REVIEW R2; teaching + honesty payoff)*
11. **Structure / Patterns explorer** (`pages/structure.html`) — gap #13.
12. **Falsification demo** (`pages/experiment.html`) — gap #14.
13. **Election heat-map** (time-scan grid on the election page) — gap #15.
   *(Lots from Phase 1 #2 feed these; each is a small addition over `fullReading` + the registry.)*

### Phase 4 — Lilly depth: live examples & judgements *(the headline pedagogy, carried Phase 4)*
14. **Reusable computed-example component** (`app/example.js`) that casts a real chart and renders engine output inline.
15. **Lilly's worked charts as LIVE figures** (Ship at Sea, Stolen Fish, Marriage, Lost Dog), verified vs his printed positions within tolerance — gap #3.
16. **House-by-house horary judgement walkthroughs** (per-topic flows) — gap #4.
17. **Antiscia woven into judgement** — gap #17.
18. *(Optional)* **Decumbiture mode** — gap #18.

### Phase 5 — Book III depth & the Vedic strength/remedy layer
19. ✅ **DONE (2026-06-25)** — **Full six-fold Ṣaḍbala** (+ Iṣṭa/Kaṣṭa phala) — gap #7.
20. ✅ **DONE (2026-06-25)** — **Vedic daily/birth remedies** (historical-only) — gap #9.
21. **Natal topic readers** (wealth/marriage/children/profession/accidents to the 12 houses) — gap #19.
22. *(Optional)* **Rectification helper** (Trutine/Animodar) — gap #20.
23. *(Documented out-of-scope unless promoted)* rigorous **Placidian mundane** primary directions.

### Phase 6 — Organize / link / UX / ship *(carried Phase 3 polish)*
24. ◑ **Mobile nav collapse DONE (2026-06-25)**; still: breadcrumbs, ≤2-click reachability, un-dead-end `correspondences.html` — gap #16.
25. **SVG/PNG export + generalised URL-share** swept across all tools — gap #24.
26. **A11y pass** (landmarks/keyboard/contrast/alt; extend `verify-site` to assert) — gap #25.
27. **Final QA** — spot-check ~10 numbers vs external references; refresh `README.md`/`COVERAGE.md`/this plan; ship.

---

## Dependency notes
- Phase 1 #2 (**Lots**) underpins Phase 3 (the structure/falsification explorers read the lots + registry).
- Phase 2 data adds feed the talisman/election layers already built — **reuse, never re-implement**
  (compose `cautions.js`→`election.js`→`talisman.js`; compose the data modules into `fullReading`).
- Phase 4 #14 (example component) is a prerequisite for #15/#16.
- New capabilities must be added to `registry.js` (the anti-drift test enforces export/page/anchor/term existence) and surfaced in nav/Tools-hub/Workflow so nothing is orphaned.

## Architecture invariants (do not break)
- **No build step**; vanilla ES modules; shared chrome from `app/shared.js` computing root via `import.meta.url`. Never hard-code absolute site paths.
- **Engine stays pure & headless-testable** — computation in `assets/js/core/` (except `chart.js`), DOM in `assets/js/app/`.
- **Data is sourced & flagged** in `assets/js/core/data/` — provenance per record; discrepancies flagged in-data, never silently chosen.
- **Honest framing on everything interpretive**; magic described as history, never prescribed.
