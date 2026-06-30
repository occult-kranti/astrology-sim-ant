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

**What genuinely remains** (see the **NEXT STEPS** roadmap below) is not core astronomy — it is
**(1)** two fidelity refinements: *significator-weighted chart health* and the *seven Hermetic Lots +
sect-aware Part of Fortune* (which also feeds the new natal-topic reader); **(2)** the proposed
mathematician's-lens **explainers** (falsification demo, structure/patterns, election heat-map);
**(3)** Lilly/Picatrix polish (election gating, antiscia-in-judgement, accuracy degrees, glossary
completion); and **(4)** the quality sweep (a full **a11y** audit, navigation finish, export/share,
final QA). *(The Lilly-depth pedagogy — **live worked charts**, **house-by-house judgement**, **natal
topic readers**, **rectification** (gaps #3/#4/#19/#20) — was **shipped 2026-06-30, Phase R5**; the
**six-fold Ṣaḍbala**, **Vedic glossary + remedies**, **Picatrix images** and **mobile-nav collapse**
were shipped earlier. See the round notes.)*

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

### Shipped this round — "Phase R3", 2026-06-25 *(verified: audit 0 · engine-test all passed · 36-page Chromium sweep 0 errors)*
A consolidation + integration round:
- **One master tool.** The redundant "Unified Master Tool" (`master-unified.js`) is folded into **the Workbench**, which
  is now *the* master tool. `pages/master.html` is a redirect; nav collapses to a single **Master Tool** entry (now 13
  items); all home/tools/footer/page links retargeted. The book-scoped Book I & III calculators remain (clearly book-scoped).
- **Workbench reorganised.** The **🕉 Vedic toggle moved to the top** (right after the figure); **horary moved up** and the
  "question about house" field removed from the form — the horary card now shows the **general** querent+Moon state by default,
  with an **in-card house picker** for a specific quesited.
- **Vedic conclusions & advice** (gap toward #19 in spirit) — `vedic.js` `buildVedicConclusions()` adds a COMPUTED,
  deterministic interpretive layer (Lagna & lord, strongest/weakest graha, the running daśā, supported/strained bhāvas by
  Aṣṭakavarga, yogas, the Moon's nakṣatra, and a synthesised conclusion + caveat). Rendered on every Vedic panel & the JSON.
- **Picatrix Book III & IV** (gaps #11 + #21) — new `data/picatrix-prayers.js`: the seven planetary **prayers** (III.7), the
  **directional spirits** of the Liber Antimaquis (III.9 — the third spirit system, kept distinct), the **Perfect Nature**
  (III.6), and a **Book IV** summary (toxic/animal/poison items flagged HISTORICAL-ONLY). New page `picatrix/prayers.html`;
  the ruling planet of a talisman links to its prayer; a `picatrixPrayer` tool lets the assistant recite/explain it;
  3 glossary terms + a registry entry. Greer–Warnock translation, cross-checked.
- **Assistant prompts redesigned** — data-first: the **whole computed reading is sent as JSON** in the prompt. Two presets
  (🔎 *Interpret & advise — everything together*, a plain cross-system synthesis; 📜 *Codex*, evocative) **plus** the custom
  "plan a working" box; **every reply has a ⤓ save** (raw → Markdown). The Vedic & prayer tools are available to the agentic loop.
- **Save simplified** — the GitHub-Gist publish was removed (messy); the report is **downloaded** (JSON/Markdown) and
  auto-saved on-device.

### Shipped this round — "Phase R4", 2026-06-25 *(verified: audit 0 · engine-test all passed · Chromium sweep 0 errors)*
A teaching, interpretation & coverage round (with an independent UX review — see `REVIEW-R4.md`):
- **The on-ramp** (the review's #1 gap) — new **`pages/basics.html`** explains *every concept* (Western + Picatrix +
  Vedic) in plain English with no maths, featured first in the home "Start here" and the nav; new
  **`pages/interpret.html`** is a panel-by-panel "how to read your results" guide. Every concept now has a basics
  entry + a glossary definition.
- **Picatrix images completed** — **per-mansion talismanic images** (gap #5, `data/mansion-images.js`, 28, Agrippa
  II.46 + Picatrix IV.9 — shown on the Mansions page & by the Moon's mansion in the Master Tool) and the
  **per-planet planetary-image set** (gap #12, `data/planet-images.js`, 7, Agrippa II.38–44 — shown for the ruling
  planet in the talisman panel). Single-witness/divergent records and toxic/animal materials flagged.
- **UX fixes** (from the review): the AI conversation text is now **white** on the dark log; **wide tables scroll** on
  mobile; the **assistant model labels** were reconciled and Fable **refusals are handled gracefully**; honest-note
  callouts added to the **glossary** and the **Book I hub**.
- The remaining UX backlog (jargon autolink on dynamic panels, election auto-run, nav grouping, a11y pass) is tracked
  in `REVIEW-R4.md` and the gap list below.

### Shipped this round — "Phase R5", 2026-06-30 *(verified: audit 0 · engine-test all passed (77 registry exports) · Chromium sweep 38 pages 0 errors)*
The Lilly-depth round (the headline pedagogy gap) + the UX backlog (researched by a 6-agent workflow — see `REVIEW-R5.md`):
- **Live Lilly worked charts** — Lilly's OWN horary figures (the stolen fish, the ship at sea, the marriage, the lost
  dog) are now read **live** from the positions he printed in the 1647 woodcuts: `core/chart-from-positions.js` feeds
  the printed figure into the engine, `data/worked-charts.js` holds the sourced positions (with per-planet confidence
  & honest caveats), and `pages/book2/examples.html` draws each wheel, scores every dignity and runs the judgement
  **beside Lilly's words and the recorded outcome**. (The common "Venus in Libra = the dog" retelling was corrected: the
  dog is **Mercury**, lord of the 6th.)
- **House-by-house horary judgement** — `core/horary-judge.js` (`horaryJudgement`) identifies the significators, runs
  the modes of perfection, reads the Moon, and reduces to an affirmed/qualified/denied tone with the cited Book II rule
  (sickness/death/prison read in the inverted sense, contests by the stronger significator). `data/horary-house-judgement.js`
  is the reference layer; `pages/book2/houses.html` gains a **live judgement reader** + the 12 houses with their
  natural significators, perfection-meaning and affirm/deny testimonies.
- **Book III natal-topic readers + rectification** — `core/natal-topics.js` reads each of the 12 Book III topics from
  three testimonies into a tone; `core/rectification.js` adds the **Animodar** (Ptolemy) and **Trutine of Hermes**
  (both contested, every assumption surfaced; the Animodar/Trutine reuse the hyleg engine's pre-natal syzygy). Both are
  surfaced on `pages/book3/master.html`.
- **UX backlog cleared** — the **Claude chat** is redesigned into readable, high-contrast labelled bubbles (You = gold,
  Claude = slate, pre-wrap body); **jargon autolinks** now reach dynamically-rendered result panels (workbench, horary,
  Book III master, worked charts); the **nav is grouped** Start • Tools • Books • Reference (faint dividers on desktop,
  labelled sections on mobile); the **election tool** re-judges live on aim/house-system change; and an **a11y pass**
  added a global `:focus-visible` ring, `aria-hidden` on decorative glyphs, responsive coordinate inputs, and table
  `<caption>` on the worked-charts ledger. (A full automated a11y audit is still open — its workflow agent hit a spend
  limit; tracked in `REVIEW-R5.md`.)
- Registry gains `horary-judgement`, `worked-charts`, `chart-from-positions`, `natal-topics`, `rectification`; glossary
  gains Significator, Rectification, Animodar, Trutine of Hermes.

---

## NEXT STEPS — the post-R5 roadmap *(planned 2026-06-30; **R6–R9 all shipped 2026-06-30**)*

✅ **ALL FOUR PHASES SHIPPED (2026-06-30)** — see the round notes below; verified each wave at the `verify-site`
gate (audit 0 · engine-test all passed · Chromium sweep 40 pages 0 errors, now with **a11y landmark assertions**)
and pushed to `origin/main` (R6 `e5637a3`, R7 `d9f1d47`, R8 `b2b0b53`, R9 this commit). The plan below is kept for
the record with each phase marked done.

R5 closed the Lilly-depth pedagogy (worked charts, house-by-house judgement, natal topics, rectification — gaps
#3, #4, #19, #20) and cleared most of the UX backlog (chat redesign, autolink-on-dynamic, nav grouping, election
live-update, a partial a11y pass). What remained, in **priority order**:

### Phase R6 — Fidelity & the Lots ✅ **DONE** *(+ personalization & "here-and-now")*
- **R6-1 · Significator-weighted chart health** — gap #1. Weight each caution by whether it touches the
  querent/quesited (or natal) significators, instead of a flat severity count. The single most-cited fidelity
  defect; the flat count is alien to Lilly's method. `core/cautions.js` → flows into every verdict badge.
- **R6-2 · The seven Hermetic Lots + sect-aware Part of Fortune toggle** — gap #2. New `core/lots.js` (Fortune,
  Spirit, Eros, Necessity, Victory, Courage, Nemesis — *plus* the topic Lots of Marriage / Children / Father that
  the **R5 natal-topics reader already names but does not yet compute**), a sect toggle, and `reading.lots`
  exposing them all. Directly upgrades the R5 reader and underpins Phase R7.

### Phase R7 — The honest-science explainers ✅ **DONE** *(the locked framing, made interactive)*
- **R7-1 · Falsification demo** — gap #14. `pages/experiment.html`: permute the birth time N× through
  `fullReading`, plot the verdict/dignity **null distribution** in-tool. The strongest honesty feature —
  mathematically and rhetorically clean, and core to the non-negotiable framing.
- **R7-2 · Structure / Patterns explorer** — gap #13. `pages/structure.html`: the modular-week theorem, antiscia
  reflection and aspect harmonics as one teaching view of the system's hidden symmetry.
- **R7-3 · Election heat-map** — gap #15. A 7-day × 24-hour `rankNow` grid on the election page; the weekly
  planetary-hour periodicity emerges visually. Cheap; reuses `electionScore`.

### Phase R8 — Lilly / Picatrix polish & accuracy ✅ **DONE** *(+ fixed the swapped antiscion labels)*
- **R8-1 · Election gating polish** — gap #6. Curated mansion-fitness keyword map (replace the naive substring),
  down-weight malefic mansions — removes a known false-positive path in the elector.
- **R8-2 · Antiscia woven into judgement** — gap #17. Treat antiscia/contra-antiscia as hidden contacts in the
  perfection/aspect search (Lilly judges by them; currently display-only).
- **R8-3 · Accuracy finishing** — gap #23. `accuracy-check` the pitted/azimene/fortune degrees; fill the 4 blank
  fortune signs (Taurus/Leo/Sagittarius/Capricorn); record provenance in-data.
- **R8-4 · Glossary completion** — gap #10. The remaining Western/Picatrix terms (Election, Profection,
  Suffumigation, Behenian, Perfect Nature, the two spirit systems).
- *(Optional)* Decumbiture mode (gap #18); magic squares / kāmeas, clearly flagged Agrippa (gap #22).

### Phase R9 — Quality & ship ✅ **DONE**
- **R9-1 · Complete the a11y pass** — gap #25. Finish what the R5 audit agent could not (it hit a spend limit):
  table `scope`/`caption` across **all** data tables, an `aria-live` review of every live region, a contrast
  audit, and extend the verify gate to assert landmarks/labels.
- **R9-2 · Navigation finish** — gap #16. Breadcrumbs, every page ≤2 clicks, un-dead-end `correspondences.html`.
- **R9-3 · Export / share sweep** — gap #24. SVG/PNG export + URL-share across **all** tools (mostly done in the
  Workbench/`state.js`; sweep the rest).
- **R9-4 · Final QA** — spot-check ~10 numbers vs external references; refresh `README.md` / `COVERAGE.md` / this
  plan; ship.

### Deliberately out of scope *(unless explicitly promoted)*
- Rigorous **Placidian mundane** primary directions (semi-arc) — the Naibod approximation stays, self-flagged.
- The **Picatrix Book IV** full per-sign liturgies & incense recipes — framing-sensitive, kept summary-only.

**Dependency:** R6-2 (Lots) underpins both the R5 natal-topics reader and the R7 explainers — do it before R7.

---

## FURTHER ROADMAP — AI integration & the next oracle *(planned 2026-06-30, after a 3-agent research workflow)*

### AI integration — provider-agnostic ✅ **SHIPPED**, then deepen
- ✅ **Provider-agnostic assistant** — `app/assistant.js` now supports **Claude** (recommended, agentic tools) **and
  OpenAI-compatible** backends so users can bring a **free-tier** key: **Groq, Google Gemini, OpenRouter, Cerebras,
  Mistral** (all five **verified browser-direct CORS** by the research, with current 2026 model IDs) + a custom base
  URL. Streaming `/chat/completions` parsing; the grounded honest-framing system prompt flows through both paths;
  tools stay Claude-only. **Tested end-to-end against a local mock OpenAI server** (no account): no network on load,
  the grounded prompt reaches the provider, the reply streams into a bubble. *(No key is ever bundled — embedding one
  in a public static repo would be scraped/abused; free tiers are rate-limited and need a personal signup. BYOK is the
  right pattern.)*
### Deepen the AI — ✅ **SHIPPED** (the diviner), then continue
- ✅ **Shared transport** — extracted `app/llm-core.js` (the provider table + the live-tested Anthropic & OpenAI-compatible
  streaming + the agentic Claude tool-loop), and refactored `app/assistant.js` onto it (behaviour-preserving). Both the
  Workbench assistant and the new **divination assistant** (`app/divination-assistant.js`) now share ONE transport.
- ✅ **Expert-diviner persona + grounding** — `core/llm-context.js` gained `DIVINER_PREAMBLE` (a learned-historian voice,
  layered on the LOCKED `HONEST_FRAMING`) and `buildGeomancyContext` / `buildTarotContext` + interpret-prompt & data-block
  builders, so the AI narrates the **computed, cited** cast and never invents figures/cards. **Free-tier-aware** context
  (Groq 8000 TPM): a leaner fact/glossary budget and no JSON data block for OpenAI-compatible keys. **Live-tested on the
  real Groq free tier** (geomancy + tarot interpret): HTTP 200, grounded replies, 0 console errors.
- ✅ **Per-panel "✶ Explain this"** — every geomancy shield-figure / house and every dealt tarot card carries an explain
  chip that pre-fills a focused, grounded question into the diviner chat.
- ⬜ **Still to deepen:** a cite-bound output contract (`[F#]` fact tags); a glossary-aware `defineTerm` tool + inline
  term links; a structured talisman walk-through renderer; streaming-markdown rendering with copy/regenerate.

### Geomancy — ✅ **SHIPPED** *(the research's top pick: heavy occult usage × excellent engine fit)*
Western/Arabic **geomancy** (ʿilm al-raml) — Agrippa's "daughter of astrology": four random Mothers → the **Shield**
(Daughters by transposition, Nieces, two Witnesses, the **Judge** — always an even figure, the built-in checksum — and
the Reconciler) and the **House Chart** judged horary-style. Almost entirely computable: the whole Shield is boolean
algebra; only the final narrative is interpretive.
- **DATA** `core/data/geomantic-figures.js` — the 16 figures as a **provably-complete, distinct bijection** of the 2⁴
  dot-patterns (derived by exhaustive elimination — the 4 palindromes, the 6 reverse-pairs, the planetary rulers and the
  even/odd parity — after both research agents *and* a web transcription each introduced duplicate patterns; cited Agrippa
  II.48–53 + Greer).
- **CORE** `core/geomancy.js` (PURE, no RNG) — `addFigures` (row-wise parity), `mothersFromTallies`, `castShield`,
  `geomancyHouses`, `geomanticJudgement` (the four modes of perfection → an affirmed/qualified/denied tone). The cast's
  randomness lives only in `app/geomancy.js` (crypto RNG, or strike the marks by hand).
- **PAGE** `pages/geomancy.html` + `app/geomancy.js` (the Shield in tiers, the 12-house chart, the judgement, the diviner
  panel, the 16-figure reference). Registered in `registry.js`; `engine-test.mjs` asserts the 16-figure bijection, the
  parity rule, and the **Judge-is-always-even theorem over 500 casts**.

### Tarot — ✅ **SHIPPED** *(the strong follow-on: very-high usage, good fit via the Golden Dawn correspondences)*
The **78-card** Rider–Waite–Smith / Golden Dawn deck.
- **DATA** `core/data/tarot-deck.js` — 22 Major (with the GD Hebrew-letter & astrological attributions) + 56 Minor (four
  suits × Ace–Ten + 4 courts), each with a normalised element, upright/reversed keywords and a Waite-register meaning
  (generated from a verified research table; cited Waite 1911 + Book T).
- **CORE** `core/tarot.js` (PURE, no RNG) — the canonical spreads (single, Past/Present/Future, Horseshoe, the 10-card
  **Celtic Cross**) with positioned cards, the Golden Dawn **elemental dignities**, and a balance summary. The shuffle/draw
  lives only in `app/tarot.js` (crypto RNG, optional reversals).
- **PAGE** `pages/tarot.html` + `app/tarot.js` (a laid-out board, per-position reading, dignities, the diviner panel, the
  78-card reference). Registered in `registry.js`; `engine-test.mjs` asserts the 78 distinct cards, 14-per-suit, the
  dignity rules, and the Celtic Cross.
- **Runners-up (future):** Sigils/planetary kameas (good fit, Agrippa II); the Kabbalah Tree of Life (medium). I Ching,
  numerology and gematria score *weak* on engine fit.

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

### A.2 — Lilly **Book II** (Horary) → mechanics, house-by-house judgement & live worked charts complete *(R5)*

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
| **House-by-house judgement** (Lilly's per-house question chapters, II.xvii–end) | ✅ | `core/horary-judge.js` `horaryJudgement` + `data/horary-house-judgement.js` (12-house affirm/deny + perfection-meaning) → live reader & reference on `book2/houses.html`; also drives the worked charts |
| **Lilly's worked example charts** (live, from his printed figures) | ✅ | `core/chart-from-positions.js` + `data/worked-charts.js` (4 figures from the 1647 woodcuts) → `book2/examples.html` draws the wheel, scores dignities, runs the judgement beside his words |
| Decumbiture (6th house, illness, critical days) | ⛔ | not built (named in early plan) |
| Antiscia *used in judgement* (as hidden aspects in horary) | ◑ | antiscia computed/displayed; **not woven into the perfection/aspect search** |

### A.3 — Lilly **Book III** (Nativities) → core apparatus, the 12 topic readers & rectification complete *(R5)*

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
| **Natal topic readers** (wealth/marriage/children/profession/honour to the 12 houses) | ✅ | `core/natal-topics.js` `natalTopicReading` — each topic from house-lord + natural significator + occupants → favourable/mixed/afflicted tone, on `book3/master.html`. *(Topic Lots described; computing them is R6-2)* |
| **Rectification** (Trutine of Hermes, Animodar) | ✅ | `core/rectification.js` — both contested, every assumption surfaced, reusing the hyleg pre-natal syzygy; on `book3/master.html` |
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
| Spirit-name systems | ✅ | **3 of 3** — Picatrix III.7 prayer-angel + the Picatrix III.9 directional spirits (Liber Antimaquis) + the Agrippa Angel/Intelligence/Spirit triad, kept distinct (`data/picatrix-prayers.js`, `data/planetary-magic.js`) — *2026-06-25* |
| **Per-mansion talismanic images** (Agrippa II.46 / Picatrix IV.9) | ✅ | `data/mansion-images.js` (28, cited; mansion 22 single-witness & 11 divergence flagged); on `picatrix/mansions.html` & the Master Tool — *2026-06-25* |
| **Per-planet planetary-image set** (the talisman figures, Agrippa II.38–44 / Picatrix II.10 & III, distinct from decan-face images) | ✅ | `data/planet-images.js` (7, cited); in the Master Tool's talisman panel — *2026-06-25* |
| **Planetary prayers / invocation texts** (Picatrix III.7 Sabian prayers) | ✅ | the seven prayers (short cited excerpts + epithets + names) in `data/picatrix-prayers.js`; page `picatrix/prayers.html`; linked from the talisman; `picatrixPrayer` AI tool — historical text only — *2026-06-25* |
| **The "Perfect Nature"** (Picatrix III.6) | ✅ | the four names + Hermes' account + the rite framing, with the "four spirits vs one/four-powers" ambiguity flagged in-data — *2026-06-25* |
| **Book IV** — the 12 lunar-sign prayers; incense recipes; natural & alchemical magic | ◑ | a cited **summary** of IV.1–IV.9 (toxic/animal/poison items flagged HISTORICAL-ONLY); the full per-sign liturgies & recipes deliberately not reproduced — *2026-06-25* |
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
| 3 | ✅ **DONE (2026-06-30)** — **Lilly's worked charts as LIVE figures** (Stolen Fish, Ship at Sea, Marriage, Lost Dog) read from the 1647 woodcuts via `chart-from-positions.js`, wheel + dignities + judgement beside his words. `data/worked-charts.js`, `pages/book2/examples.html` | Lilly II | L | **High** | The headline pedagogy gap — shipped (the dog corrected to Mercury, lord of the 6th) |
| 4 | ✅ **DONE (2026-06-30)** — **House-by-house horary judgement** — `core/horary-judge.js` (`horaryJudgement`) + a live reader & 12-house reference on `pages/book2/houses.html` (inverted sense for sickness/death/prison; contests by the stronger significator) | Lilly II | L | **High** | Book II's bulk — shipped |
| 5 | ✅ **DONE (2026-06-25)** — **Per-mansion talismanic images** (`data/mansion-images.js`, Agrippa II.46 + Picatrix IV.9) on the Mansions page & the Master Tool | Picatrix I/IV | M | Med | The acknowledged "second pass" — completed |
| 6 | **Election gating polish** — already gates retrograde/combust/detriment/fall; add **curated mansion-fitness keyword map** (replace naive substring) and **down-weight malefic mansions** | Picatrix | M | Med | REVIEW open item; removes a known false-positive path in the elector |
| 7 | ✅ **DONE (2026-06-25)** — **Full six-fold Ṣaḍbala** (Kāla, Ceṣṭā, Dṛk added) + Iṣṭa/Kaṣṭa phala | Jyotiṣa | L | Med | The flagged Vedic follow-up; finishes the JHora strength model. `vedic.js` `shadbala()` |
| 8 | ✅ **DONE (2026-06-25)** — **Vedic glossary terms** folded into the auto-linker | Jyotiṣa | S | Med | Closes the cross-link gap. 20 terms in `glossary.js`, wired to registry |
| 9 | ✅ **DONE (2026-06-25)** — **Vedic daily/birth remedies** (mantra/japa/deity/yantra/gem; āsana flagged modern; selection algorithmic) | Jyotiṣa | M | Med | The flagged Vedic remedy follow-up; kept historical-described. `data/vedic-remedies.js` + `buildPractice()` |
| 10 | **Glossary completion (Western/Picatrix)** — Election, Profection, Suffumigation, Behenian, Perfect Nature, the two spirit systems | cross | S | Med | Auto-linking is wired; the terms simply need entries |
| 11 | ✅ **DONE (2026-06-25)** — **Picatrix III.9 directional spirit system** (3rd system, Liber Antimaquis) in `data/picatrix-prayers.js`, kept distinct | Picatrix III | S | Med | Completes "two of three". Done with the prayers module |
| 12 | ✅ **DONE (2026-06-25)** — **Per-planet planetary-image set** (`data/planet-images.js`, Agrippa II.38–44 + Picatrix II.10/III), distinct from decan-face images; in the talisman panel | Picatrix II | M | Med | Completed — the talisman design note now has a backing image |
| 13 | **Structure / Patterns explorer** page — the modular-partition + planetary-week-theorem (24≡3 mod 7, gcd=1) + antiscia-reflection + aspect-harmonics teaching view | cross | M | Med-High | REVIEW's recommended-first experimental; pure teaching, showcases the unification |
| 14 | **Falsification demo** page — permute birth time N× over `fullReading`, plot the verdict/dignity null distribution → in-tool, honest-science centre-piece | cross | M | Med-High | The strongest honesty feature; mathematically + rhetorically clean |
| 15 | **Election heat-map** (7 days × 24 h grid of `rankNow` for an aim; the weekly planetary-hour periodicity emerges) | Picatrix | S | Med | Cheap, visual, reuses `electionScore` |
| 16 | ◑ **PARTLY DONE (2026-06-25)** — **Mobile nav collapse** shipped (14-item bar → accessible hamburger < 880 px, `shared.js`+`style.css`). **Remaining:** breadcrumbs, "every page ≤2 clicks", un-dead-end `correspondences.html` | cross | M | Med | The standing UX debt |
| 17 | **Antiscia woven into judgement** (treat antiscia/contra-antiscia as hidden contacts in the perfection/aspect search) | Lilly II | S | Low-Med | Lilly uses them in judgement; currently display-only |
| 18 | **Decumbiture mode** (6th-house illness, critical days) | Lilly II | M | Low-Med | A named early-plan feature; niche |
| 19 | ✅ **DONE (2026-06-30)** — **Natal topic readers** — `core/natal-topics.js` reads all 12 Book III topics (house-lord + natural significator + occupants → favourable/mixed/afflicted tone) on `pages/book3/master.html` | Lilly III | L | Med | Book III's back half — shipped (topic Lots described; computing them is R6-2) |
| 20 | ✅ **DONE (2026-06-30)** — **Rectification helper** — `core/rectification.js`: Animodar (Ptolemy) + Trutine of Hermes, both contested, every assumption surfaced, reusing the hyleg pre-natal syzygy; on `pages/book3/master.html` | Lilly III | L | Low-Med | Completeness — shipped |
| 21 | ◑ **MOSTLY DONE (2026-06-25)** — **planetary prayer texts** (III.7) ✅ + **Perfect Nature** (III.6) ✅ + a **Book IV** cited summary ✅; still optional: the full per-sign Book IV liturgies & incense recipes (deliberately not reproduced — framing-sensitive) | Picatrix III–IV | M | Low-Med | Describe-never-instruct; the heart is shipped |
| 22 | **Magic squares / kāmeas + planetary seals** (flag as Agrippa II.22, not strictly Picatrix) | (Agrippa) | M | Low | Frequently expected by users; clearly label provenance |
| 23 | **Accuracy finishing** — `accuracy-check` the pitted/azimene/fortune degrees; fill the 4 blank fortune signs; record provenance in-data | Lilly I | S | Med | Closes the only Book I data holes, on the accuracy mandate |
| 24 | **SVG/PNG export + generalised URL-share across all tools** | cross | S | Low-Med | Mostly done in `app/state.js`/Workbench; sweep the remaining tools |
| 25 | ◑ **PARTLY DONE (2026-06-30)** — global `:focus-visible` ring, `aria-hidden` decorative glyphs, responsive coordinate inputs, `<caption>` on the worked-charts ledger, `aria-live` on the Now dashboard. **Remaining:** table `scope`/`caption` across *all* tables, full `aria-live`/contrast review, extend `verify-site` to assert landmarks (the R5 audit agent hit a spend limit) | cross | M | Med | Standing quality debt — Phase R9-1 |

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
7. ✅ **DONE (2026-06-25)** — **Picatrix III.9 directional spirit system** (3rd system) — gap #11.
8. **Per-planet planetary-image set** (Picatrix II.22–46) — gap #12.
9. ◑ **MOSTLY DONE (2026-06-25)** — **Perfect Nature** ✅, **planetary prayer texts** ✅, **Book IV** summary ✅ — gap #21 (still optional: the full per-sign Book IV liturgies & incense recipes — describe-never-instruct; toxic/illegal substances flagged, never recommended).
10. *(Optional, clearly provenance-flagged as Agrippa)* **magic squares / kāmeas + seals** — gap #22.

### Phase 3 — The mathematician's-lens explainers *(REVIEW R2; teaching + honesty payoff)*
11. **Structure / Patterns explorer** (`pages/structure.html`) — gap #13.
12. **Falsification demo** (`pages/experiment.html`) — gap #14.
13. **Election heat-map** (time-scan grid on the election page) — gap #15.
   *(Lots from Phase 1 #2 feed these; each is a small addition over `fullReading` + the registry.)*

### Phase 4 — Lilly depth: live examples & judgements ✅ **DONE (2026-06-30, Phase R5)**
14. ✅ **DONE** — **Reusable computed-figure path** — `core/chart-from-positions.js` + `app/worked-charts.js` cast a printed figure and render engine output inline.
15. ✅ **DONE** — **Lilly's worked charts as LIVE figures** (Stolen Fish, Ship at Sea, Marriage, Lost Dog) from the 1647 woodcuts — gap #3.
16. ✅ **DONE** — **House-by-house horary judgement** (`horary-judge.js` + live reader) — gap #4.
17. **Antiscia woven into judgement** — gap #17 *(carried to Phase R8-2)*.
18. *(Optional)* **Decumbiture mode** — gap #18 *(carried, optional)*.

### Phase 5 — Book III depth & the Vedic strength/remedy layer ✅ **DONE**
19. ✅ **DONE (2026-06-25)** — **Full six-fold Ṣaḍbala** (+ Iṣṭa/Kaṣṭa phala) — gap #7.
20. ✅ **DONE (2026-06-25)** — **Vedic daily/birth remedies** (historical-only) — gap #9.
21. ✅ **DONE (2026-06-30)** — **Natal topic readers** (12 houses) — gap #19.
22. ✅ **DONE (2026-06-30)** — **Rectification helper** (Trutine + Animodar) — gap #20.
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
