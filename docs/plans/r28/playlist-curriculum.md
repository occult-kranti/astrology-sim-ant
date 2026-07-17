# R28 Plan — The Vasishtha Playlist Curriculum → Two New Pages

**Deliverable of the R28 plan-only round.** Nothing in this document has been written into the repo.
**Inputs:** `scratchpad/r28plan/playlist-inventory.md` (132/132 entries recovered, 100%); full read of `assets/js/core/vedic.js`, `assets/js/core/data/vedic-data.js`, `assets/js/core/data/vedic-remedies.js`, `assets/js/core/registry.js` (Indian-wing entries), `assets/js/core/{kuta,kp,prasna,muhurta,tajika,tithi-pravesha}.js`, `assets/js/app/{vedic,vedic-panel}.js`, `pages/vedic/index.html`, `pages/learn.html` (M6), `pages/tools.html`, `pages/library/indian.html`, `scripts/engine-test.mjs`.
**Date:** 2026-07-16.

---

## 0. Framing lock (restated, binding on the build round)

- The playlist ("Astrology Classes", Vasishtha Astrologer, 132 videos as enumerated 2026-07-16; the adversarial verification pass later the same day found the live count at 133 — one un-enumerated new entry, see the inventory's verifier correction; the curriculum blocks below are unaffected) is a **teaching-order witness only**. The teacher cites no text, no edition, no lineage; his About text markets astrology as "solving complicated issues" — the Workbench must never reproduce that claim. Every rule taught in the videos is re-grounded below in citable classical editions, and **the pages must cite the texts, never the videos** (the playlist may be acknowledged once, on Page A, as the pedagogical-order source, with the inventory's identification).
- Every esoteric system is a historical symbolic system with **no demonstrated validity**. Everything DESCRIBED, never prescribed. Genuine intra-tradition disagreements are flagged **CONTESTED** with both positions and never resolved.
- Build invariants: `core/**` pure (no DOM), DOM only in `app/**`; DS2 tokens; reduced-motion-first; every new engine wired through `registry.js` + `scripts/engine-test.mjs` + glossary terms + the AI-assistant (`llm-context.js`) integration; pages pass `verify-site` (audit + engine test + Chromium sweep).

### Canonical editions used throughout this plan

| Text | Edition to cite |
|---|---|
| Bṛhat Parāśara Horā Śāstra (BPHS) | R. Santhanam trans., 2 vols., Ranjan Publications, Delhi 1984 (97-chapter recension; chapter numbers below follow it). Contested-recension caveat: the Sharma (Sagar) and Chaukhambha editions differ in chapter division — flag once, globally. |
| Phaladīpikā (Mantreśvara, c. 16th c.) | S.S. Sareen trans., Sagar Publications; cross-check G.S. Kapoor (Ranjan). Chapter (adhyāya) numbers below follow Sareen/wisdomlib. |
| Sārāvalī (Kalyāṇavarman, c. 8th c.) | R. Santhanam trans., 2 vols., Ranjan Publications 1983. |
| Jātaka Pārijāta (Vaidyanātha Dīkṣita) | V. Subrahmanya Sastri trans., 3 vols. |
| Bṛhat Jātaka (Varāhamihira, 6th c.) | trans. V. Subrahmanya Sastri; also N.C. Iyer. Already cited by `prasna.js`. |
| Laghu Parāśarī (Uḍudāya-pradīpa) | any dual-text ed. (e.g. Girdhari Lal Sharma / trans. in K.K. Pathak); the functional-benefic doctrine's locus classicus. |
| Uttara Kālāmṛta (attrib. Kālidāsa) | V. Subrahmanya Sastri trans. — the counter-position on kendrādhipati. |
| Jaimini Sūtras (for chara kārakas / ārūḍha only) | P.S. Sastri trans.; cross-check Sanjay Rath, *Jaimini Maharishi's Upadesa Sutra*. |
| Modern derivative (the playlist's actual register) | B.V. Raman, *How to Judge a Horoscope*, 2 vols., Motilal Banarsidass — cited **as a modern witness**, never as the primary. |

Every uncertain numeric value (combustion arcs, exaltation degrees already done, avasthā boundaries, upagraha formulae) goes through the **accuracy-check skill** before encoding, per house rules.

---

## 1. The taught curriculum (what the playlist actually teaches)

The 131 lessons (132 minus the promo at position 42) group into **seven blocks**, exactly as the inventory's §6 course map dictates. The playlist's own order *is* the curriculum order for Page A.

| Unit | Playlist positions | Content taught |
|---|---|---|
| **U1 Foundations** | 1–12 | What Jyotiṣa is; planets/stars/rāśis; planetary motion & characteristics; varṇas, elements, gender, tridoṣas; rulerships (numbers, days, trees); colours, stones, metals; planet–human governance; natural benefic/malefic; **karaka grahas** (4 sessions) |
| **U2 Rāśis** | 13–19 | The 12 rāśis; characteristics (elements, "castes", body types, benefic/malefic signs); divā-bali/rātri-bali, śīrṣodaya/pṛṣṭhodaya, dvipada/catuṣpada; Sun through the 12 signs; sun sign vs lagna vs Moon sign |
| **U3 Chart mechanics** | 20–26 | Names of the 12 bhāvas; reading the North Indian and South Indian chart formats; their differences; house lords (bhāveśa) and how to address them ("lord of X in Y") |
| **U4 Graha bala (elementary)** | 27–32 | Exaltation/debilitation; strong/weak planets; combustion; retrogression; naisargika maitrī (natural friendship); [session 32 unconfirmed — plausibly tātkālika/pañcadhā maitrī; class 33 absent — both flagged as inference in the inventory] |
| **U5 Grahas in bhāvas** | 33–112 | House-by-house delineation, 1st→12th, planet by planet (12th house: overview only; 2nd house: partial coverage — a real gap in the source, noted honestly) |
| **U6 House classifications** | 113–119 | Kendra/trikoṇa; **yogakāraka**; graha dṛṣṭi (aspects); trika (duḥsthāna) houses & lords; triṣaḍāya/upachaya; **māraka** grahas; **kendrādhipati doṣa** |
| **U7 Yogas & synthesis** | 120–132 | Yogas intro; Budha-Āditya; Gaja-Kesarī (+ the teacher's own effectiveness critique, session 124); conjunctions; two full chart-analysis walkthroughs; Dhana yoga; Rājayoga; Vipreet Rājayoga (Harṣa/Sarala/Vimala); retrogrades revisited; Nīca-bhaṅga Rājayoga |

**What the playlist does NOT teach (verified absence across all 132 titles + 48 descriptions):** daśās, nakṣatras (beyond passing mention), divisional charts, ṣaḍbala/aṣṭakavarga as systems, transits/gocara, praśna, muhūrta, remedies-as-a-unit. Page A therefore ends with a **Unit 8 "Where this course stops"** section that (a) states the absence honestly and (b) hands off to the site's existing engines (vimśottarī, vargas, aṣṭakavarga, ṣaḍbala, pañcāṅga are all already computed by `castVedic`). The task's Page B mandate ("every computable tool the curriculum implies") is read as: the tools the taught units directly imply **plus** the standard Parāśarī apparatus the course's own trajectory points at (daśā timeline, ṣoḍaśavarga, aṣṭakavarga, ṣaḍbala, kārakas, ārūḍhas, upagrahas, avasthās) — each tagged `taught` vs `implied` below.

---

## 2. Topic → classical source → site status (the master table)

Legend: **HAVE** = computed today; **PART** = partially computed / computed but not surfaced; **MISS** = absent. File references are the ground truth found in this round's read.

| # | Topic (unit) | Primary classical source (edition) | Site status |
|---|---|---|---|
| 2.1 | Grahas, their characters, natures, castes, colours, metals, deities (U1) | BPHS Ch. 3 "Graha Characters and Description" (Santhanam vol. 1); Bṛhat Jātaka Ch. 2 | **PART** — `vedic-data.js` has `GRAHAS`, `GRAHA_SANSKRIT`, `KARAKAS` (one-line each); `vedic-remedies.js` has colours/gems/metals/deities per graha (cited). No varṇa/tridoṣa/gender/element per graha; no consolidated profile data module. |
| 2.2 | Natural benefic/malefic incl. the conditional cases (waxing/waning Moon; Mercury by association) (U1) | BPHS Ch. 3.24–25; Bṛhat Jātaka 2.5 (already the `prasna.js` classifier: `classifyGrahas`) | **PART** — `prasna.js` implements BJ 2.5 with the Phaladīpikā Rāhu/Ketu layer flagged; not exposed for natal use; `SHADBALA_BENEFICS` hardcodes Mercury benefic (documented simplification). |
| 2.3 | Kāraka (significator) roles of the grahas (U1) | BPHS Ch. 32 (kārakatvas) & Ch. 3; Uttara Kālāmṛta Ch. 5 (the long lists — flag as the maximalist witness) | **PART** — `KARAKAS` one-liners + `GRAHA_SIGNIFICANCE` in `vedic.js`. No structured multi-karakatva table. |
| 2.4 | The 12 rāśis & lords (U2) | BPHS Ch. 4 "Zodiacal Rasis Described" | **HAVE** — `RASHIS` (name, Sanskrit, lord, element, mode). |
| 2.5 | Rāśi characteristics: divā/rātri-bali, śīrṣodaya/pṛṣṭhodaya/ubhayodaya, dvipada/catuṣpada, "castes", body types, benefic/malefic signs (U2) | BPHS Ch. 4.4–30; Bṛhat Jātaka 1.10–20; Sārāvalī Ch. 3 | **MISS** as data — except śīrṣodaya, which `prasna.js` uses internally for the ṢPŚ I.4 lagna rule (so a partial list exists there; unify!). |
| 2.6 | Sun through the 12 signs (U2) | Bṛhat Jātaka Ch. 20 (planets in rāśis); Sārāvalī Chs. 21–29 | **MISS** — no planet-in-sign delineation data. |
| 2.7 | Sun sign vs Moon sign vs lagna (U2/U3) | BPHS Ch. 5 (lagna); pedagogical distinction, modern register (Raman) | **HAVE** computationally (lagna, sidereal Sun, Moon all in `castVedic`); **MISS** as an explainer. |
| 2.8 | The 12 bhāvas, names & significations (U3) | BPHS Ch. 11 "Effects of the Bhavas" intro + Chs. 12–23 (Tanu→Vyaya, one per bhāva); Phaladīpikā Ch. 1.17–19 | **PART** — `BHAVA_LIFE_AREA` (12 one-liners, in-code in `vedic.js`); whole-sign house of every graha computed. |
| 2.9 | North vs South Indian chart formats (U3) | Diagrammatic convention, not a śāstra doctrine — cite as regional scribal tradition (modern witnesses: Raman; JHora docs) | **MISS** — the vedic panel renders **tables only** (`app/vedic-panel.js`, 146 lines, no SVG). No diamond/grid chart renderer anywhere. |
| 2.10 | House lords (bhāveśa): "lord of X placed in Y" (U3) | BPHS Ch. 24 "Effects of the Bhava Lords" (144 combinations); Phaladīpikā Ch. 20 | **MISS** — lagna lord only (`lagna.lord`, used in conclusions). No bhāveśa grid. |
| 2.11 | Exaltation/debilitation/own/mūlatrikoṇa (U4) | BPHS Ch. 3.49–54 (Santhanam); the Rāhu/Ketu exaltation dispute already flagged in-data | **HAVE** — `EXALTATION`, `OWN_SIGNS`, `MOOLATRIKONA`, `dignityOf()`. |
| 2.12 | Combustion (asta) (U4) | Combustion arcs: Sūrya-Siddhānta 9.6–9; Phaladīpikā Ch. 8/9 carries the same set (Moon 12°, Mars 17°, Mercury 14° direct/12° retro, Jupiter 11°, Venus 10° (9° retro variant), Saturn 15°) — **CONTESTED between sources; run accuracy-check** | **MISS in the Vedic engine** — the Western engine has combustion (`dignities.js` accidental dignity), but `castVedic` never flags asta; `cheshtaFromSpeed` handles retro only. |
| 2.13 | Retrogression (vakra) as strength (U4 & U7 session 131) | BPHS Ch. 27 (Ceṣṭā-bala); Phaladīpikā 2.? (retrograde = cesta strength); the "retro malefics stronger for harm" position (Sārāvalī/JP) — CONTESTED | **HAVE** — retro flag per graha; Ceṣṭā 60 virūpas for vakra in ṣaḍbala. |
| 2.14 | Naisargika maitrī (natural friendship) (U4) | BPHS 3.55–57 (already the citation anchor of `kuta.js`) | **HAVE** — `NATURAL_RELATION` in vedic-data; reused by kūṭa graha-maitrī. |
| 2.15 | Tātkālika + pañcadhā (compound) maitrī (U4, inferred session 32) | BPHS 3.58–60 (temporary by 2,3,4,10,11,12 from each other; compound five-fold) | **PART** — `compoundRelations()` inside `shadbala()` computes exactly this but is **not exported and not surfaced**. |
| 2.16 | Grahas in bhāvas — delineations (U5, ~80 sessions) | Phaladīpikā Ch. 8 (the classic 9×12 set, wisdomlib-verifiable verse by verse); Sārāvalī Chs. 30–38; BPHS bhāva chapters passim; Raman HTJAH as modern witness | **MISS** — no delineation corpus. The single biggest data build. |

> **CORRECTION (2026-07-16, verified):** the Sārāvalī locus above ("Chs. 30–38") is wrong. On research verification, Kalyāṇavarman's Sārāvalī treats **planets in bhāvas in the single chapter 30** ("Effects of Planets in Bhāvas", Santhanam trans. — Sun vv. 2–13 … Saturn vv. 74–85); there is no 31–38 span for this material. The shipped `BHAVA_PHALA` corpus (108 records) therefore keeps **two witnesses — Phaladīpikā ch. 8 and Sārāvalī ch. 30 only**, never merged. **Rāhu/Ketu single-witness note:** Sārāvalī ch. 30 does **not** treat the nodes in houses, so the 24 node records (Rāhu ×12, Ketu ×12) are **single-witness — Phaladīpikā 8.25–33 only** — carried with `agreement: null` and an explicit absence note rather than a fabricated Sārāvalī reading. Original planning text kept above for the record.


| 2.17 | Kendra/trikoṇa/trika/triṣaḍāya/upachaya classes (U6) | BPHS Ch. 34 "Yogakarakas" (functional nature of lords per lagna) + Laghu Parāśarī 6–13; kendra def already in glossary (`glossary.js` line 216, praśna-scoped) | **MISS** as an analyzer — grep confirms zero occurrences of māraka/kendrādhipati/yogakāraka/upachaya/triṣaḍāya in core. |
| 2.18 | Yogakāraka planets per lagna (U6) | BPHS Ch. 34.13–20 (Mars for Cancer/Leo, Venus for Capricorn/Aquarius, Saturn for Taurus/Libra); Laghu Parāśarī | **MISS**. |
| 2.19 | Graha dṛṣṭi — full & special aspects (U6) | BPHS Ch. 26 (aspects of the rāśis/grahas; special aspects Mars 4/8, Jupiter 5/9, Saturn 3/10); the **whole-sign vs degree-graded (sphuta dṛṣṭi) presentation is CONTESTED** — BPHS Ch. 26 gives the graded virūpa scheme, popular teaching (incl. this playlist) uses whole-sign | **PART** — `drishtiValue()` + `SPECIAL_ASPECTS` live inside ṣaḍbala's Dṛk computation; no exposed aspect grid. |
| 2.20 | Māraka grahas (U6) | BPHS Ch. 44 "Maraka Planets" (Santhanam vol. 2): 2nd & 7th lords/occupants as death-inflicters, with the Venus/Saturn special clauses | **MISS**. Framing note: māraka = "the tradition's death-timing doctrine"; described with the strongest possible non-predictive caveat, cf. how `hyleg.js` (length-of-life) is already framed. |
| 2.21 | Kendrādhipati doṣa (U6) | Laghu Parāśarī 6–7 (benefics owning kendras lose beneficence); BPHS Ch. 34; **Uttara Kālāmṛta counter-position (benefic kendra-lords fine in 2/3/11/kendras) — CONTESTED, show both** | **MISS**. |
| 2.22 | Conjunction (yuti) reading (U7 session 123) | BPHS Ch. 36? (two-graha yogas per bhāva); Sārāvalī Chs. 13–17 (2–7 planet conjunctions — the fullest classical corpus) | **MISS** as a browser; conjunction detection trivial from `grahas[].rashiIndex`. |
| 2.23 | Budha-Āditya, Gaja-Kesarī, Candra-Maṅgala, Kemadruma (U7) | Gaja-Kesarī: Phaladīpikā 6.14; Jātaka Pārijāta 7.116; BPHS Ch. 36 (stricter conditions — **the strength-conditions dispute the teacher's own session 124 engages: CONTESTED, encode both the bare rule and the conditioned rule**). Budha-Āditya: modern name; the Sun–Mercury yuti effects are BPHS Ch. 36 / Sārāvalī 13; **flag that the name is late**. Kemadruma + cancellations: Phaladīpikā 6.? / Bṛhat Jātaka 13.3–5 | **HAVE (minimal)** — `detectYogas()` does exactly these 4, whole-sign, no strength conditions, no Kemadruma-cancellation. |
| 2.24 | Dhana yogas (U7) | BPHS Chs. 41–42 (Dhana/combinations for wealth); Phaladīpikā Ch. 6 | **MISS**. |
| 2.25 | Rājayogas (kendra-trikoṇa lord sambandha) (U7) | BPHS Chs. 39–40 (Raja Yogas); Laghu Parāśarī's dharma-karma-adhipati doctrine | **MISS**. |
| 2.26 | Vipreet Rājayoga — Harṣa/Sarala/Vimala (U7) | BPHS Ch. 36.13–16 (trika lords in trika houses; Santhanam numbering) — **the "must not associate with other lords" rider is a later gloss: CONTESTED** | **MISS**. |

> **CORRECTION (2026-07-16, verified):** the Vipreet-Rājayoga locus above ("BPHS Ch. 36.13–16") is **not** where the R28 build sourced this trio. On research verification the named individual yogas — **Harṣa** (6th lord in 6/8/12), **Sarala** (8th lord in 6/8/12), **Vimala** (12th lord in 6/8/12) — trace to **Mantreśvara, Phaladīpikā 6.63 / 6.65 / 6.69** (per the S.S. Sareen / Sastri numbering), with the general Vipreet principle also in **Uttara Kālāmṛta 4.22**. BPHS ch. 36 treats other yogas and does not carry the Harṣa/Sarala/Vimala triad under these names; the shipped `YOGA_RULES` records cite Phaladīpikā 6.63/6.65/6.69 + UK 4.22 accordingly. Original planning text kept above for the record.


| 2.27 | Nīca-bhaṅga Rājayoga (U7) | Cancellation condition sets differ: Phaladīpikā (dispositor/exaltation-lord in kendra from lagna **or Moon**), Jātaka Pārijāta (lord of the occupied sign in kendra/trikoṇa), plus mutual-exchange & aspected-by-dispositor variants — **CONTESTED across all three texts; encode as labelled condition list, never a boolean** | **MISS**. |
| 2.28 | Full-chart walkthrough method (U7 sessions 125–126) | No single classical locus — a modern pedagogical synthesis (Raman, *How to Judge a Horoscope*, gives the canonical modern procedure) | **PART** — `buildVedicConclusions()` already produces a 7-section deterministic walkthrough; not stepwise/didactic. |
| — | *Implied, not taught:* Vimśottarī daśā | BPHS Chs. 46–48 | **HAVE** (mahā+antar, balanced from Moon; no pratyantar). |
| — | *Implied:* nakṣatras & pañcāṅga | BPHS Ch. 3/nakṣatra lists; TS 4.4.10 devatās (already cited) | **HAVE**. |
| — | *Implied:* ṣoḍaśavarga | BPHS Chs. 6–7 | **PART** — 14 of the 16 śoḍaśavarga computed (`VARGA_LIST`); **D40 (Khavedāṁśa) and D45 (Akṣavedāṁśa) missing**; no vargottama flag; no viṁśopaka bala. |
| — | *Implied:* Aṣṭakavarga | BPHS Chs. 66–67 | **HAVE** (BAV/SAV, checksum 337); no UI grid, no śodhana (trikoṇa/ekādhipatya reductions), no transit overlay. |
| — | *Implied:* Ṣaḍbala | BPHS Ch. 27 | **HAVE** (full six-fold, documented simplifications); no bar-chart UI. |
| — | *Implied:* Avasthās | BPHS Ch. 45 (bālādi, jāgradādi, dīpta-ādi, śayanādi) | **MISS**. |
| — | *Implied:* Upagrahas (Gulika/Māndi, Dhūma etc.) | BPHS Ch. 3.61–70 + Ch. 25; **Gulika-vs-Māndi identity and the day-eighth formula are CONTESTED** (muhurta.js already computes Gulika-kāla as a time span — the natal upagraha longitude is a different, absent computation) | **MISS** (natal). |
| — | *Implied:* Jaimini chara kārakas & ārūḍha padas | Jaimini Sūtras 1.1; BPHS Ch. 32 (chara kārakas) & Ch. 29 (ārūḍha) — **7-kāraka vs 8-kāraka (with Rāhu) schemes CONTESTED (Parāśara-vs-Jaimini-school split; Rath vs Iranganti); ārūḍha 1st/7th exception rule also CONTESTED** | **MISS** (the playlist has zero Jaimini markers — mark these tools `implied/extension`, lowest priority). |

---

## 3. Page A spec — `pages/vedic/course.html` ("The Parāśarī Course")

**Identity.** Title: *"The Parāśarī course — Jyotiṣa as it is actually taught"*. One page, 9 sections (8 units + sources), long-scroll with a sticky left in-page nav (the pattern of `pages/learn.html`). Registered in the mega-menu under the Vedic/Indian wing, linked from `pages/contents.html`, `pages/learn.html` M6 (new lesson chips), `pages/vedic/index.html` header, and `pages/library/indian.html`.

**Section template (every unit).** Each unit = a `<section class="card">` containing, in order:
1. **Concept prose** — what the tradition teaches, in the unit's own order (§1 above).
2. **Classical citation block** — the §2 sources, styled like the existing `citations` lists; contested items carry the site's CONTESTED chip with both positions.
3. **Honest-framing note** — one per unit, varied not boilerplate (e.g. U1: "the graha–gem–metal correspondences are cultural attributions with no physical mechanism"; U6: "māraka is the tradition's death-timing doctrine; nothing here predicts anything").
4. **Tool links** — chips to the Page B tool(s) and existing engines that compute the unit's material ("drive: …" chips, same idiom as learn.html).
5. **Provenance line** — "Teaching order after the 132-lesson 'Astrology Classes' playlist (Vasishtha Astrologer, YouTube, enumerated 2026-07-16) — a modern pedagogical witness, not an authority; all rules cited to the editions above."

**Unit-by-unit outline.**

| Section | Contents | Links out |
|---|---|---|
| **Intro** | What this page is; the provenance line; how it relates to Jagannath-Hora page (that page = the computed reading; this page = the taught theory); the global honest-framing banner | `vedic/index.html`, `basics.html#vedic`, `learn.html#m6` |
| **U1 Grahas** | Nine grahas; natures; conditional benefics (Moon/Mercury — CONTESTED chip on the tithi threshold); kārakas; the correspondence tables (varṇa/doṣa/colour/metal/gem/day/number/tree) presented as *cultural attributions*, gems explicitly not-prescribed | T3 graha profiles; existing 🕉 panel |
| **U2 Rāśis** | 12 rāśis; the classification grid (odd/even, movable/fixed/dual, elements, divā/rātri-bali, śīrṣodaya/pṛṣṭhodaya, dvipada/catuṣpada); Sun-in-signs; the "which sign am I" disambiguator (tropical sun sign ≠ sidereal ≠ Moon sign ≠ lagna — the one place the page touches Western astrology, linking the ayanāṁśa math in learn.html M6L1) | T2 rāśi explorer; T17 delineation browser (Sun-in-signs tab) |
| **U3 The chart** | The 12 bhāvas & names; North vs South formats side by side (the new renderer, T1, with the same chart in both); bhāveśa ("lord of X in Y") | T1 renderer; T5 bhāveśa mapper; handcalc.html (cast by hand) |
| **U4 Strength (elementary)** | Exaltation/debilitation/own/mūlatrikoṇa; combustion (arc table, CONTESTED values); retrogression; naisargika + tātkālika + pañcadhā maitrī matrices; honest note that "session 32/33 of the source playlist are unconfirmed/absent — the compound-friendship doctrine is included from BPHS 3.58–60 regardless" | T4 strength snapshot; existing ṣaḍbala (as the "grown-up version" pointer) |
| **U5 Grahas in bhāvas** | How delineation literature works (formulaic effects, contradictions between texts as a feature to display, the 12th-house/2nd-house gaps of the source playlist stated); the browser embedded or linked | T17 delineation browser |
| **U6 House classifications** | kendra/trikoṇa/trika/triṣaḍāya/upachaya; yogakāraka per lagna; graha dṛṣṭi; māraka (strongest framing note on the page); kendrādhipati doṣa with the Laghu-Parāśarī vs Uttara-Kālāmṛta CONTESTED pair | T6 classifier; T7 aspect grid |
| **U7 Yogas & synthesis** | Each taught yoga with definition + citation + the Gaja-Kesarī effectiveness debate (the teacher's own session 124 mirrors JP 7.116's extra conditions — a genuinely contested rule, shown both ways); Nīca-bhaṅga condition sets side by side; the step-by-step walkthrough method | T8 yoga detector; T18 walkthrough; `vedic/index.html` worked example |
| **U8 Where this course stops** | Honest gap list (no daśās, nakṣatras, vargas, transits, remedies in the source); hand-off paragraphs to the site's existing engines: vimśottarī (T9), vargas (T10), aṣṭakavarga (T11), ṣaḍbala (T12), pañcāṅga, tājika, tithi-praveśa, praśna, muhūrta, kūṭa | timelords/vedic/tajika/tithi-pravesha/prasna/muhurta/kuta pages |
| **Sources & method** | The edition table (§0); the playlist identification block from the inventory; the CONTESTED register (every flagged dispute on one list, cross-linked) | library/indian.html; glossary |

**Interlinking obligations (both directions).**
- `learn.html` M6 gains one lesson card: "6.4 — The Parāśarī course (theory in teaching order)" with chips to `vedic/course.html` and `vedic/tools.html` (needs: 6.2).
- `pages/vedic/index.html` gets a header cross-link ("theory: the Parāśarī course").
- `tools.html` §"The Indian mirror" gets both new pages' cards.
- Glossary additions (see §6): Kendra (generalize the existing praśna-scoped entry), Trikoṇa, Trika/Duḥsthāna, Triṣaḍāya, Upachaya, Yogakāraka, Māraka, Kendrādhipati doṣa, Yoga (combination), Rājayoga, Dhana yoga, Vipreet Rājayoga, Nīca-bhaṅga, Kemadruma, Gaja-Kesarī, Budha-Āditya, Bhāveśa, Naisargika/Tātkālika maitrī, Asta (combustion), Vakra, Avasthā, Upagraha, Gulika/Māndi, Chara kāraka, Ātmakāraka, Ārūḍha pada, Vargottama, Viṁśopaka.
- AI assistant: `llm-context.js` gains the course-page summary + each new tool's context blurb (house pattern).

---

## 4. Page B spec — `pages/vedic/tools.html` ("Vedic tools & charts")

One page hosting the tool UIs (some embedded, some deep-linking to existing pages). All engines in `core/**` (new module `assets/js/core/vedic-analysis.js` + data modules under `core/data/`), DOM in `assets/js/app/vedic-tools.js`. Every tool: registry entry, engine-test cases, glossary terms, assistant context. Person/state reuse via `app/person.js` + `app/state.js` like other tool pages.

Statuses: `taught` (directly from the playlist) / `implied` (standard apparatus the course points at). Effort: S ≤ ½ day, M ≈ 1–2 days, L ≥ 3 days for an Opus coder.

| ID | Tool | Status | Inputs → Outputs | Data needed | Contested flags | Effort | Builds on |
|---|---|---|---|---|---|---|---|
| **T1** | **North/South Indian chart renderer** (SVG; D1 + any varga; both formats side-by-side toggle) | taught | `{lagnaSign, placements{graha→sign}, format:'north'\|'south'}` → inline SVG (diamond fixed-house N; fixed-sign grid S) | none new (pure layout) | none (conventions, cite as regional scribal tradition) | **M** | `castVedic().grahas/vargas`; app-layer only — this is a **renderer**, lives in `app/` (a pure layout helper computing cell coordinates may sit in core for testability) |
| **T2** | **Rāśi profile explorer** (all 12 classification axes) | taught | sign (or none = full table) → profile record | NEW `core/data/rashi-profiles.js`: odd/even, bali (divā/rātri), udaya (śīrṣa/pṛṣṭha/ubhaya), pada-count, varṇa, body-type, benefic/malefic, per-record cite (BPHS Ch. 4; BJ 1.10–20) | Scorpio udaya class varies by text; "caste" labels kept in quotes with a social-history note | **S** | `RASHIS`; must **unify** with the śīrṣodaya list already inside `prasna.js` (single source of truth) |
| **T3** | **Graha profile / kārakatva explorer** | taught | graha → consolidated profile (nature, conditional rules, karakatvas, correspondences) | NEW `core/data/graha-profiles.js` (BPHS Ch. 3 + Ch. 32; UK Ch. 5 as maximalist witness); reuse `vedic-remedies.js` correspondences | Moon's benefic tithi-threshold (śukla-pakṣa vs "within 72° of Sun" formulations); Mercury-by-association | **S** | `KARAKAS`, `classifyGrahas` (prasna.js — refactor to shared export) |
| **T4** | **Graha-bala snapshot** (dignity + combustion + retro + maitrī matrices) | taught | chart → per-graha {dignity (have), asta:{is, arc, cite}, vakra, natural/temporary/compound relation matrix} | NEW combustion-arc table (accuracy-check first: SS 9.6–9 vs Phaladīpikā set; retro-Mercury/Venus variants) | combustion arcs CONTESTED; **export `compoundRelations()`** from vedic.js instead of duplicating | **S–M** | `vedic.js` (dignityOf, compoundRelations, NATURAL_RELATION), `chart.planets[].speed` |
| **T5** | **Bhāveśa mapper** ("lord of X sits in Y" 12×grid + functional nature per lagna) | taught | vedic chart → 12 rows {house, lord, placedIn, functionalTags[]} | none beyond T6's classification data | functional-benefic rules are Laghu-Parāśarī doctrine, not BPHS-uniform — cite precisely | **M** | `RASHIS.lord`, `castVedic().lagna/grahas`; feeds T6/T8 |
| **T6** | **House-classification analyzer** (kendra/trikoṇa/trika/triṣaḍāya/upachaya + yogakāraka + māraka + kendrādhipati) | taught | vedic chart → per-house class set; per-graha {yogakaraka?, maraka?, kendradhipatiDosha?} with rule text + cite | NEW `core/data/bhava-classes.js`: class lists; yogakāraka per lagna (BPHS 34.13–20); māraka rules (BPHS Ch. 44); kendrādhipati (LP 6–7) | kendrādhipati: LP vs UK positions BOTH shown; māraka framed as historical death-timing doctrine (echo hyleg.js framing); 8th-lord-as-māraka variants | **M** | T5; whole-sign houses from `castVedic` |
| **T7** | **Graha dṛṣṭi grid** (aspects) | taught | vedic chart → 9×9 grid {aspects, type:full/special, mode:'whole-sign'\|'sphuta'} | `SPECIAL_ASPECTS` (have); `drishtiValue` (have, inside shadbala — **export it**) | whole-sign (taught/popular) vs BPHS Ch. 26 graded virūpa scheme — a real CONTESTED presentation choice; ship both modes | **S** | `vedic.js` internals, refactored to named exports |
| **T8** | **Yoga detector, expanded** (the playlist's canon: Budha-Āditya, Gaja-Kesarī bare + conditioned, Candra-Maṅgala, Kemadruma + cancellations, Dhana set, Rājayoga kendra-trikoṇa sambandha, Vipreet Harṣa/Sarala/Vimala, Nīca-bhaṅga as labelled condition list) | taught | vedic chart → `[{yoga, present, variant, conditionsMet[], conditionsFailed[], cite, contested?}]` | NEW `core/data/yoga-rules.js` — each yoga as data: definition variants + cites (BPHS Chs. 36/39–42; Phaladīpikā Ch. 6; JP 7.116) | Gaja-Kesarī strength conditions (bare Phaladīpikā 6.14 vs conditioned BPHS/JP) — **never a plain boolean**; Nīca-bhaṅga: three condition sets (BPHS/Phaladīpikā/JP) reported separately; Vipreet "no association" rider flagged as later gloss; sambandha definition (yuti/mutual dṛṣṭi/parivartana) enumerated | **L** | extends `detectYogas()`; T5/T6 functional tags; engine-test with fixture charts per yoga (constructed positions via `chart-from-positions.js`) |
| **T9** | **Vimśottarī daśā timeline** (visual; add pratyantar level) | implied | vedic chart + date → existing output + pratyantar; UI: horizontal timeline bars w/ now-marker | none | daśā epoch depends on ayanāṁśa choice → nakṣatra fraction; note Lahiri-only implementation (site-wide flag already) | **S–M** | `vimshottari()` (have); timeline UI reuses firdaria/timelords page idioms |
| **T10** | **Ṣoḍaśavarga completion + viewer** (add D40, D45; vargottama; viṁśopaka bala) | implied | vedic chart → all 16 vargas rendered via T1; per-graha vargottama flag; viṁśopaka score | extend `VARGA_LIST` + `vargaSign()` for n=40, 45 (BPHS Chs. 6–7 rules — accuracy-check the odd/even sign starting-points); viṁśopaka weight tables (BPHS Ch. 7) | D40/D45 computation rules differ across BPHS editions; Horā/Drekkāṇa alternative schemes (Parāśara vs Jagannātha) — flag | **M** | `vargaSign`, T1 renderer |
| **T11** | **Aṣṭakavarga grid + transit overlay** | implied | vedic chart (+ optional transit date) → BAV/SAV heat-grid; transit graha positions overlaid on SAV bins | none (BAV/SAV computed, checksum-tested) | śodhana (reductions) NOT implemented — either add (BPHS Ch. 68, +M effort) or explicitly scope out on-page; kakṣyā subdivision optional | **M** | `ashtakavarga()` (have), `transits.js` for current positions; dataviz skill for the grid |
| **T12** | **Ṣaḍbala strength bars** | implied | vedic chart → stacked bars per graha (six components), required-minimum line, Iṣṭa/Kaṣṭa | none (fully computed) | documented JHora simplifications already in `note` — surface them verbatim | **S** | `shadbala()` (have); dataviz skill |
| **T13** | **Avasthās** (bālādi + jāgradādi + dīpta-ādi; śayanādi optional phase 2) | implied | vedic chart → per-graha avasthā states + cite | NEW small tables (BPHS Ch. 45): bālādi by 6° quintiles (odd/even sign reversal), jāgradādi by dignity, dīpta-ādi ninefold | śayanādi's calculation is genuinely intricate & edition-divergent — scope to phase 2 or omit with note | **S** (without śayanādi) | `castVedic().grahas` |
| **T14** | **Upagrahas — natal Gulika/Māndi (+ Dhūma set)** | implied | date/place → upagraha longitudes placed in the chart | day-eighth lord tables (partially shared with `muhurta.js` kāla octants — reuse!); Dhūmādi arithmetic offsets from Sun (BPHS Ch. 3.61–70) | **Gulika vs Māndi identity CONTESTED** (start-of-Saturn's-portion vs middle; South Indian usage); rise-time vs portion-start variants — show the variants, default JHora convention | **M** | `muhurta.js` octant tables, `planetary-hours.js` sunrise math, `astro.js` |
| **T15** | **Kārakas — naisargika + Jaimini chara** | implied (extension; zero playlist markers — label clearly) | vedic chart → naisargika table (have) + chara kāraka assignment (AK…DK) | degree-within-sign ranking; **7-scheme vs 8-scheme (Rāhu included, 30−deg reversal) CONTESTED — ship both, default 8 (BPHS Ch. 32 Santhanam), flag Jaimini-school 7** | the tie-break (equal degrees) rules also vary | **S** | `castVedic().grahas[].deg` |
| **T16** | **Ārūḍha padas** | implied (extension) | vedic chart → A1–A12 (+AL emphasized) | counting rule (as far from lord as lord from house); **the 1st/7th-position exception (Jaimini 1.1.30 gloss: pada in own/7th → 10th/4th shift) CONTESTED — toggle with cite** | exception rule; whether nodes can own (Scorpio/Aquarius co-lords) — variants | **S–M** | T5 bhāveśa logic |
| **T17** | **Planet-in-bhāva / planet-in-rāśi delineation browser** (the U5 corpus) | taught | (graha, house) or (graha, sign) → the classical delineations **side by side per text**, verbatim-summary + cite per record | NEW LARGE `core/data/bhava-phala.js`: 9 grahas × 12 bhāvas × ≥2 texts (Phaladīpikā Ch. 8 as backbone — wisdomlib verse-checkable; Sārāvalī Chs. 30–38 second witness; BJ Ch. 20 for rāśi placements). ~200+ records, each `{graha, bhava, text, verse, gist, cite}` | Deliberately show **inter-text contradiction** as the honest display (e.g. Venus-in-8th glowing in Sārāvalī vs harsher elsewhere); never merge into one "meaning" | **L** (data-heavy; use add-data-module skill; consider 2 phases: Phaladīpikā first, Sārāvalī second) | none computational — pure data + lookup; T1/T5 link each cell to the user's own chart |
| **T18** | **"Analyse a horoscope" step-by-step walkthrough** (sessions 125–126 as a guided checklist) | taught | vedic chart → ordered didactic steps (lagna & lord → Moon/nakṣatra → dignities → bhāveśa grid → classifications → yogas → daśā), each step rendering the relevant tool's output with "what the tradition looks for" prose | none new — composes T1–T12 | none (method is modern-pedagogical; cite Raman HTJAH as witness) | **M** | everything above; the natural centerpiece of the course page's U7 |

**Suggested build order (dependency-respecting):** T2, T3, T4, T7 (S refactors + data) → T1 (renderer) → T5, T6 → T8 (yogas; needs 5/6) → T12, T9, T11 (surfacing existing engines) → T10, T13, T14 → T18 → T17 (long-tail data) → T15, T16 (extensions, clearly labelled beyond-the-course).

**Registry plan.** New engine module `core/vedic-analysis.js` (T4–T8, T13–T16 exports) + `core/data/{rashi-profiles,graha-profiles,bhava-classes,yoga-rules,bhava-phala}.js`; registry entries one per tool-cluster (est. 6 new entries: `vedic-chart-renderer` (callable:false, app), `vedic-classifications`, `vedic-yogas`, `vedic-avasthas-upagrahas`, `jaimini-karakas-arudhas`, `bhava-phala-browser`), each with `computes/inputs/outputShape/citation/pages/glossaryTerms` in the established house style. Engine-test: fixture charts with hand-verified expected yoga/classification outputs; ashtakavarga-style checksums where possible (e.g. chara kāraka: 7 vs 8 scheme both sum-tested; T10: D40/D45 spot-verified against JHora).

---

## 5. What the site must NOT build (and the honest alternative)

1. **Gemstone/metal prescriptions ("wear an emerald for weak Mercury").** U1 sessions 5–6 teach the correspondence tables. Build: the tables as *cultural attributions with cites* (mostly already in `vedic-remedies.js`, `classical:true/false` flagged). Do NOT build: any input→"your gem" recommender. The existing `buildPractice()` sits at the very edge of this line (it selects a "focus graha" and lists its gem/mantra); the course page must not go further, and Page A's U1 should link it with its framing intact, not amplify it.
2. **Remedial upāya recommender / "fix your doṣa" flows.** Describe the tradition's remediation logic (why the weakest graha is propitiated, the vāra-vrata calendar) — the `REMEDIES_FRAMING` layer already does this. No new remedial surface.
3. **Māraka / longevity prediction as output.** Compute and display the *classification* (which grahas the doctrine labels māraka) — never a date, span, or "danger period". Same policy the site already applies to hyleg/alcocoden.
4. **Kūṭa/marriage advice via the course.** U7's walkthroughs touch marriage houses; link to `kuta.html` which already carries the SENSITIVE-DOMAIN framing; add nothing prescriptive.
5. **The teacher's marketing frame.** "Astrology… helps in solving a no. of complicated issues" and "decision making" must appear, if at all, only as a *quoted example of practitioner marketing*, in the Sources section, explicitly counter-framed.
6. **Medical claims.** Tridoṣa attributions (U1) are historical humoral theory — describe as such; no health mapping tool.
7. **No horoscope-of-the-user "results" language anywhere on Page A** — the course page teaches rules; the tools page computes classifications; neither ever says "you will…".

---

## 6. Glossary, assistant & verification checklist (for the build round)

- Glossary: ~28 new terms (list in §3); generalize the praśna-scoped `Kendra` entry rather than duplicating.
- `llm-context.js`: add course-page + per-tool contexts (house pattern).
- `engine-test.mjs`: new block per registry entry; yoga fixtures constructed via `chart-from-positions.js`; checksum-style invariants where available.
- `verify-site` at the end of every phase (per memory: conda node + puppeteer sweep).
- Accuracy-check skill runs required before encoding: combustion arcs; D40/D45 rules; Gulika/Māndi formula; bālādi boundaries; yogakāraka lagna list; nīca-bhaṅga condition sets; chara-kāraka scheme defaults.

## 7. Risks

1. **T17's corpus size** (9×12×2 texts ≈ 216 cited records) is the round's schedule risk — phase it (Phaladīpikā-only first) and enforce per-record cites via the add-data-module discipline.
2. **Contested-rule sprawl in T8:** yoga rules as *data with variants* (not code branches) or the detector becomes unmaintainable; the "never a plain boolean" requirement must be in the registry `computes` text so later rounds don't regress it.
3. **Refactor hazard:** exporting `compoundRelations`/`drishtiValue` from `vedic.js` touches a tested engine — engine-test must pin current ṣaḍbala outputs before the refactor.
4. **Framing drift:** planet-in-house delineations are the most horoscope-like content the site will ever host; the side-by-side-contradiction display + per-record cites is the load-bearing defense and must not be simplified to single "meanings".
5. **Source-playlist gaps** (missing class 33, unconfirmed 32, thin 2nd/12th house coverage) must stay visible on Page A as stated inferences, or the page silently over-claims its witness.

## 8. Web sources consulted this round

- BPHS Santhanam scans & contents: [archive.org BPHS vol. 1/2 (Santhanam)](https://archive.org/details/BPHSEnglish), [vedpuran.net BPHS contents PDF](https://vedpuran.net/wp-content/uploads/2021/04/brihat_parashara_hora_shastra_english_v.pdf), [BPHS Ch. 44 Maraka](http://bphs.blogspot.com/2010/08/ch-44-maraka-planets.html), [BPHS Chs. 34–45 (sanskritdocuments)](https://sanskritdocuments.org/doc_z_misc_sociology_astrology/horaashaastraEng34-45.html), [BPHS Ch. 36 Many Other Yogas](http://bphs.blogspot.com/2008/03/ch-36-many-other-yogas.html)
- Gaja-Kesarī sources incl. JP 7.116 & Phaladīpikā 6.14: [navamsa.com Mathematics of Yogas pt. 3](https://www.navamsa.com/?p=2959), [steer.coach yogas overview](https://steer.coach/yogas-in-vedic-astrology/)
- Nīca-bhaṅga condition variance (Phaladīpikā vs Jātaka Pārijāta): [indiadivine.org thread quoting JP](https://www.indiadivine.org/content/topic/1201321-neecha-bhanga-cancellation-of-debilitation/), [theastroking.com NBRY guide](https://www.theastroking.com/articles/neechabhanga-raja-yoga)
- Kendrādhipati doṣa loci (LP, UK, Phaladīpikā, Bhāva Mañjarī): [planetarypositions.com](https://planetarypositions.com/yoga/2014/08/25/kendradhipati-dosha/), [jyotishbootcamp substack](https://jyotishbootcamp.substack.com/p/kendrathipathi-dosha)
- Phaladīpikā Ch. 8 (planets in houses; combustion arcs): [wisdomlib Phaladeepika Ch. 8](https://www.wisdomlib.org/hinduism/book/phaladeepika-by-mantreswara-text-and-translation/d/doc1621580.html), [jyotishvidya.com Phaladeepika PDF](https://jyotishvidya.com/HTMLobj-9415/Mantreswara_s__Phaladeeplka_.pdf)
- Sārāvalī (Santhanam trans., planets in bhāvas): [Saravali vol. 1 PDF](https://static1.squarespace.com/static/5e5b12e392faf542399f9528/t/6444ef10e62dac013a8d316a/1682239298930/Saravali+-+R+Santhanam+-+Vol-1.pdf), [Saravali chs. 1–10](https://lakshminarayanlenasia.com/articles/Saravali.pdf)
- Playlist identification & enumeration: `playlist-inventory.md` (this scratchpad), itself sourced to the playlist/watch-page `ytInitialData` fetched 2026-07-16.
