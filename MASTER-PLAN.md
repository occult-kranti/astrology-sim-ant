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
- ✅ **Per-panel "✶ explain this" on the Workbench** — every result panel (figure, horary, dignities, aspects, lots,
  cautions, election, talisman, natal) carries a chip that pre-fills a scoped, grounded question into the assistant
  (the chip only NAMES the panel; the values come from the grounded context, so nothing can be misquoted).
- ✅ **The AI can cast the oracles** — `castGeomancy` / `drawTarot` / `castIChing` are engine tools (Claude agentic
  mode): the randomness is injected by the APP layer (`ctx.rand`, crypto) — never chosen by the model, never generated
  in the pure core — or reproduced from explicit tallies/throws; every tool result carries the honest framing.
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
### I Ching — ✅ **SHIPPED** *(the third divination oracle: the Book of Changes)*
The **Yijing** — a hexagram cast at the moment of asking.
- **DATA** `core/data/iching-hexagrams.js` — the 8 trigrams + the 64 hexagrams in the **King Wen sequence** (name, pinyin,
  the six lines bottom→top, Judgment, Image, six changing-line texts, keywords), generated from a research/verify workflow.
  Line texts are **original paraphrases after James Legge** (SBE XVI, 1899, public domain), NOT the copyrighted
  Wilhelm–Baynes. The 64 line-patterns are a verified complete, distinct bijection.
- **CORE** `core/iching.js` (PURE, no RNG) — `linesFromThrows` (the 6/7/8/9 three-coin mapping), `castReading` (primary +
  moving lines + **nuclear** inner hexagram + **relating** hexagram by flipping the moving lines). The coin toss lives in
  `app/iching.js` (crypto RNG, or set the lines by hand).
- **PAGE** `pages/iching.html` + `app/iching.js` (the hexagram lines drawn primary→relating, the reading, the diviner
  panel, the 8-trigram + 64-hexagram reference). Registered in `registry.js`; `engine-test.mjs` asserts the 64-hexagram
  bijection, the 6/7/8/9 mapping, relating/nuclear correctness, and that **every hexagram's derived trigrams match its
  named lower/upper** (a cross-check that caught a swapped-trigram data bug, found live).

### AI — provider trim ✅ **SHIPPED**
The assistant now offers **only Claude + Groq**, with **Groq the default** (`llm-core.js` `PROVIDERS`/`PROV_ORDER`). A
git-skipped **`app/local-config.js`** (committed EMPTY — no secret) lets the maintainer pre-fill their own key as the
default on their own device (`git update-index --skip-worktree`) without ever exposing it in the public repo.

### R11 — Organise & integrate ✅ **SHIPPED** (2026-07-01)
A whole-site organisation + cross-feature integration pass:
- **Navigation & indexes** — an **Oracles** entry in the main nav (→ `tools.html#divination`); the Master Index
  (`contents.html`) completed with Picatrix, Vedic, Oracles and AI-assistant cards (it had only the three Books +
  Reference); the Picatrix hub cross-links "the daughters of astrology"; the live **Now** dashboard links "cast an
  oracle at this hour".
- **"The hour of the cast"** (`app/cast-hour.js`) — the oracle pages now surface the astrology engine's own timing
  lore: the planetary day & hour, the Moon's sign/phase/mansion, void-of-course and Via-Combusta flags — the tradition's
  practice (geomancers cast in the hour of the matter; Lilly warns against judging under a void Moon), shown for study.
- **AI integration** (see the Deepen list above): per-panel explain chips on the Workbench; the three oracle tools.
- **Copy refresh** — "ask Claude (Anthropic API)" → "the AI assistant (Groq free tier or Claude)" across
  workbench/tools/docs; the assistant panels no longer advertise removed providers; `docs/LOCAL-LLM.html` rewritten for
  the two-backend reality + the diviner.

### R12 — The Jung wing ✅ **SHIPPED** (2026-07-07)
A complete study wing + tool for C. G. Jung's actual astrological practice, from a 6-agent deep-research workflow
(web-verified against the primary texts: CW paragraph numbers, the Freud/Jung letters verbatim, the experiment's
figures from CW 8 §§872–915 + appendix):
- **DATA** `core/data/jung-astrology.js` — the 7 planetary archetypes (Jung vs post-Jungian flagged per record), the
  element→function mapping (honestly credited to Arroyo 1975/Greene 1977), the VERIFIED marriage-experiment record
  (batches 180/220/83 = 483 pairs; orb 8°; the 32,220-pair control at 5.3%; the Fierz-correction story; Frey-Rohn),
  the Aion aeon datings (Jung's own: "between AD 2000 and AD 2200", n. to §149), Jung's nativity (Baumann-Jung 1975,
  flagged as a family reconstruction), and a 23-entry cited timeline (1875 → Tarnas 2006).
- **ENGINE** `core/jung.js` (PURE) — `jungianReading` (archetypes, function balance, coniunctio, anima/animus, senex);
  `crossAspects`/`jungAspectHits` (the experiment's grid: conj/opp of Sun, Moon, Mars, Venus, Asc–Desc per CW 8 §878);
  `experimentBatch`/`expectedRate` (the honest null model — injected rand); `aeonClock` (Platonic month ≈2148 yr,
  Lahiri Aquarius ≈ AD 2440). Engine-test reproduces Jung's own chart (Sun 3° Leo, Moon 15° Taurus, Asc early
  Aquarius — his famous Sol–Luna square detected).
- **PAGES** `pages/jung/` — index (hub), timeline (rendered from the cited data module), theory (8 sections, CW-cited),
  experiment (the real figures + a live 200-batch Monte-Carlo showing chance produces his ~10% maxima), sources (the
  full bibliography incl. Rossi & Le Grice 2017), tool.
- **TOOL** `app/jung-tool.js` + `pages/jung/tool.html` — the psychological horoscope (wheel + archetype table +
  typology + coniunctio + shadow; one click loads Jung's own nativity), the marriage-experiment synastry grid with the
  three classic aspects flagged and the honest chance-rate callout, and the aeon clock.
- **AI** — "Let Jung read it himself": a first-person C. G. Jung persona (`JUNG_PREAMBLE`, layered ON the locked honest
  framing — explicitly a historical reconstruction, never prediction/diagnosis) with a STEP-BY-STEP CODEBOOK interpret
  prompt (`buildJungInterpretPrompt`: numbered steps 0–10 — the frame, Sol, Luna, the coniunctio, Mercurius,
  Venus/Mars, Jupiter/Saturn, the four functions, the individuation synthesis, the honest word), grounded in the
  computed report via `buildJungContext`/`jungDataBlock`, wired through the shared divination assistant (Claude
  recommended at 8192 tokens; free Groq fits at 4096). Live-tested on Groq: in-character, grounded, 0 errors.
- Wired: nav "Jung" (Books group), tools hub (2 cards), Master Index card, About-page science item + sources line,
  10 glossary terms, registry entry, engine-test asserts.

### R13 — Kameas & sigils + cite-bound AI + oracle share/export ✅ **SHIPPED** (2026-07-07)
- **Kameas** (`core/data/kameas.js` + `core/kamea.js` + `app/kamea.js` + `pages/picatrix/kameas.html`): the seven
  planetary magic squares exactly as Agrippa prints them (II.22), from a research workflow whose grids were verified
  cell-for-cell against the 1651 printing AND re-proven arithmetically three independent times (the workflow's verifier,
  the generator script, and `validateKamea` in the engine-test + live on the page). Intelligence/spirit names with
  independently-computed gematria (the 1651 "Kedemel 157" misprint and the Moon's corrupt printed Hebrew flagged
  in-record, not silently fixed); engraving metals & Agrippa's recorded uses; and a **sigil tracer** — any name drawn on
  the square by the aiq-bekar method (III.30), start-circle, end-bar, repeat-wave, with Latin letter-values honestly
  flagged as a modern convenience. The cast-hour strip ties it to the Election Engine (links now root-based, fixed for
  any page depth).
- **Cite-bound AI output** — every grounded system prompt (Workbench + all diviners + Jung) now numbers its facts
  `[F1..]` and carries an OUTPUT CONTRACT requiring computed claims to be tagged; the fact previews show the numbers.
- **Oracle share & export** — geomancy/tarot/iching casts travel in the URL (mothers / exact draws / line-throws) and
  restore deterministically; every oracle page gains "Copy shareable link" + "Download reading (MD)".

### R14 — Plain-words AI over everything + the golden example case ✅ **SHIPPED** (2026-07-08)
- **🗣 Plain words** — a new one-click, CODEBOOKED reading on the Workbench assistant that walks EVERY computed panel
  (figure/hour, dignities, chart health, aspects, lots, election, talisman, + horary/natal/vedic when present) in a
  fixed five-part structure per step: **In plain words** (jargon translated), **The good**, **The hard**, **Concerns**,
  **To reflect on** (a mirror/question — never advice, prediction or a claim about the person). The honest frame is
  step 0, FIRST, so free-tier truncation can never lose it; replies are cite-bound ([F#]). The same five-part
  **plain-words coda** now ends every oracle interpret (geomancy/tarot/iching) and the Jung reading (`PLAIN_CODA`).
- **`defineTerm`** — a glossary tool for the agentic mode: the model can look any term up so its definitions match the
  site exactly (fuzzy, top-5).
- **Free-tier budget hardening** — `buildContext` gained `maxGlossary`; the one-click flows drop the JSON digest and
  cap output at 3072 tokens on free providers (the numbered facts already ground them); the Workbench assistant got
  the same assistant-first-history fix and history-truncation the diviner review mandated.
- **THE GOLDEN EXAMPLE CASE** — one fixed, externally-verifiable scenario through the ENTIRE pipeline, asserted on
  every test run and documented on the About page with a one-click reproduction link: J2000 (2000-01-01 12:00 UT) at
  London + Jung's published nativity + a 7th-house question. Externals: Sun 280.37° (10°22′ Capricorn — textbook),
  Lahiri ayanāṁśa 23.853°, Jung's Leo/Taurus/Aquarius figures; internals: age 124 → 5th-house profection, SAV 337,
  every block composed, JSON round-trip, the 12-step plain-words codebook. Live E2E (real Chromium + real Groq):
  the share-link computes the case, the plain-words reply arrives with the honest frame first, all five labels,
  [F#] tags, zero console errors.

### R15–R18 — The Hermetic Chronology merger & the historical-calculation layer ✅ **SHIPPED** (2026-07-12)
*(planned & built after a 10-agent research workflow: 2 inventory + 4 web-research + 4 adversarial verifiers; every
load-bearing numeric claim cross-checked against primary sources AND recomputed with our own engine. Verified:
engine-test all passed · audit 0 · Chromium 58 pages 0 errors · cast-link E2E chronology→workbench ALL PASS.
Also shipped: the **🎯 Auspicious moment** one-click on the Workbench assistant — the ENGINE scans 72 h ahead with
findNextElection (deterministic, 30-min steps) and the model translates each found window through a codebooked
walk, book meaning → literal real-life terms, honest frame first, five-part plain-words coda.)*

**The second tool.** `occult-kranti/hermetic-timeline` — "The Hermetic Chronology" — is a 7-page static sourced
timeline of Hermetic philosophy/magic/occult (Babylon → the academy), 43 entries in 8 eras, each carrying an
epistemic label (*documented / disputed / debunked / conspiracy*), plus alchemy / rituals / hermetica / field-guide /
library companion pages. Same honest-framing philosophy as this site; shared citations (Pingree, Agrippa, Picatrix).
Its only external dependency is Google Fonts (stripped in the port — this site is offline-first, system fonts only).

- **R15 — The Chronology wing** (`pages/chronology/`, 6 pages): timeline data → `core/data/chronology.js`
  (verbatim bodies + sources + labels, pure data), rendered/filtered by `app/chronology.js` (search, era, label
  chips, reveal animation honoring `prefers-reduced-motion`); companion pages ported onto the site design system;
  epistemic-label legend as a reusable component; the library merged as the wing's sources page; cross-links into
  Picatrix/Lilly/Jung/oracle pages; glossary terms + registry + engine-test invariants (43 entries, labels ∈ 4-set,
  every entry cited).
- **R16 — The historical-calculation layer** (`core/calendar.js`): Julian↔proleptic-Gregorian conversion
  (Fliegel–Van Flandern/Richards, verified vectors: reform 1582-10-04→10-14 = JDN 2299160; Dee 1527-07-13→07-23
  (+10d); Thales −584-05-28→05-22 (−6d, and our engine independently places that eclipse's syzygy at 14:00 UT that
  day); England 1752 (+11d, Lady-Day double-dating cautioned); ~11k-sample round-trip). Era-accuracy tiers derived
  from the underlying models (the astronomy-engine README states **no** year range — verified): **casting-grade
  1600–2200 · study-grade 500–1600 & 2200–3000 · illustrative −1999–500 · refuse outside** (Espenak–Meeus ΔT fit
  −1999…+3000; ΔT σ per Morrison & Stephenson 2004 = 0.8t², ±8.5 min of time at −700 → Moon honest to ~±¼°).
  Precision is gated by tier at DISPLAY time; historical charts show classical planets only + a ΔT line; timeline
  entries with defensible dates get **"cast this moment"** share-links (calendar-converted).
- **R17 — Cycles of History** (`pages/cycles.html`, `core/cycles.js`): geocentric tropical-of-date Jupiter–Saturn
  **great conjunctions** by bisection (our engine matched all 13 almanac vectors 1603–2020 to the arcminute, incl.
  the 1940-41/1980-81 triples & retrograde flags, and the 7 BCE Pisces triple at ~1° separation); triplicity/trigon
  classification with the doctrinal mean-cycle overlay (19.859 yr; ~220 yr/trigon astronomical vs 240 doctrinal;
  960 medieval vs Kepler's 794 = 40 conjunctions); the **eclipse finder** — the bundled lib already ships
  `SearchGlobalSolarEclipse`/`SearchLunarEclipse` (ground truth) and we teach the classical **ecliptic-limit**
  criterion on top (NASA: solar 15.39–18.59°, lunar 15.3–17.1°, umbral 9°30′/12°15′ classical; global claims ONLY,
  never local visibility). Doctrine layer cited to Abu Ma'shar (Yamamoto & Burnett, Brill 2000), Kepler *De Stella
  Nova* (1606), the Paris 1348 report (the 1345 Aquarius triple — engine-confirmed — as *documented belief,
  debunked cause*), Star of Bethlehem as *disputed* (Hughes 1976), Babylonian eclipse divination (Rochberg 1988/
  2004, Steele 2000, Parpola 1983: EAE 15–22, the 223-month cycle, šar pūhi).
- **R18 — Time-lords & progressions** (`pages/timelords.html`): **secondary progressions** (day-for-a-year, Valens
  IX.3; angles by Naibod arc 0.98564733°/yr only), **firdaria** (day Sun 10 · Venus 8 · Mercury 13 · Moon 9 ·
  Saturn 11 · Jupiter 12 · Mars 7 · NN 3 · SN 2 = 75; night starts Moon; Abu Ma'shar nodes-at-end default with the
  Bonatti nodes-after-Mars night variant as a documented toggle — the dispute flagged in-data; 7 equal sub-periods
  from the lord, nodes never sub-lords), **zodiacal releasing** from Spirit/Fortune (Valens IV.4–IV.10: sign years
  with **Capricorn 27**, 360-day years / 30-day months / 2.5-day / 5-hour units, loosing of the bond → opposite
  sign, only in signs ≥ 19). All ten verified test vectors become engine asserts.
- **AI integration**: `cycles` and `timelords` assistant kinds on the shared diviner engine — cite-bound, codebooked
  interprets ending in the five-part plain-words coda; honest frame first, always.

### NEXT PHASES — R19–R21 *(planned 2026-07-12; each data layer REQUIRES the research + adversarial-verify
workflow before encoding — the R15–R18 discipline: primary sources fetched, every load-bearing number recomputed)*

- **R19 — Praśna, Muhūrta & Tājika: the Indian horary/election mirror.** ✅ **SHIPPED** (2026-07-13; research
  workflow: 1 inventory + 4 research + 4 adversarial verifiers, everything checked against the primary texts —
  KP's 249-entry table re-derived from first principles, Tājika verbatim vs Gansten's Hāyanaratna (Brill 2020),
  the muhūrta octant tables vs two independent published tables + a live pañcāṅga. Three tools on pages/prasna,
  /muhurta, /tajika with cited testimonies, contested values flagged in-data, AI assistants in the
  Jyotiṣa-historian voice, ~120 new engine-test asserts. Verified: engine-test all passed · audit 0 ·
  Chromium 61 pages 0 errors.) Original plan: the Vedic wing already computes the
  sidereal chart, nakṣatras, pañcāṅga, Vimśottarī daśā and the solar return — these three classical layers reuse
  exactly those calculations (excellent engine fit):
  1. **Praśna** (Indian horary): the query chart judged by lagna/ārūḍha, Moon's condition, and the praśna-specific
     rules. Niche primary sources to research & verify: *Praśna Mārga* (Kerala, 1649 — trans. B. V. Raman),
     *Ṣaṭpañcāśikā* of Pṛthuyaśas (56 verses, the praśna classic), *Daivajña Vallabhā*. Also **KP (Krishnamurti
     Paddhati)** as the modern niche system: the 249 sub-lord table is PURE Vimśottarī proportion arithmetic
     (self-verifiable, like the kameas) — cite Krishnamurti's six Readers.
  2. **Muhūrta** (Indian election, the direct mirror of the Picatrix engine): the 30 muhūrtas of the day,
     Rāhu-kāla/Yama-ghaṇṭa/Gulika periods (pure day-arc arithmetic), tithi/vāra/nakṣatra/yoga/karaṇa quality
     screens. Source: *Muhūrta Cintāmaṇi* of Rāma (1600 CE, trans. G. C. Sharma).
  3. **Tājika varṣaphala** (the Indo-Persian annual chart — the bridge tradition BETWEEN Lilly's solar return and
     the Vedic wing): tājika aspects, the year-lord (varṣeśvara), sahams (the Arabic Lots, Sanskritised — reuses
     lots.js!). Source: *Tājika-nīlakaṇṭhī* of Nīlakaṇṭha (1587, trans. M. Ramakrishna Bhat / Dykes scholarship).
- **R20 — The Kabbalah Tree of Life explorer.** The 10 sephiroth / 22 paths as an interactive map wired into the
  engines that already exist: the 7 doubles ↔ planets (→ kameas), the 12 simples ↔ signs, the 3 mothers ↔ elements
  (*Sefer Yetzirah*'s 3-7-12 division — trans. A. Kaplan), the Golden Dawn path↔tarot-trump attribution (→ the
  tarot deck), and a **gematria calculator** built on kamea.js's existing letterValues. Sources: Sefer Yetzirah,
  GD *777* (with the attribution disputes flagged in-data), Agrippa Book III, Regardie. Version differences
  (Ari vs GD tree, trump attributions) recorded as disputes, never silently resolved.
- **R21 — The auspicious-moment automation, deepened.** V1 SHIPPED with R15–R18 (the 🎯 one-click below). Next:
  the **cross-system moment scanner** — one time-range scan showing each tradition's verdict SEPARATELY and
  honestly (Lilly/Picatrix election · pañcāṅga quality · planetary hour · post-R19 muhūrta screen — compared,
  never merged), plus the per-tool deep codebooks rolled out everywhere: every testimony explained as
  *book meaning → literal real-life translation → implications*, the pattern the 🎯 prompt establishes.

### R22 — The by-hand layer, the Indian alchemy wing, practitioner tools & the runes ✅ **SHIPPED** (2026-07-15)
*(four tools built in parallel — each engine module pure/headless, cited per record, contested values flagged
in-data — then integrated together. Verified: engine-test all passed · audit Problems: 0 (68 HTML, 125 JS) ·
real-Chromium sweep 68 pages, 0 errors.)*

- **Rasaśāstra & the yantra-mathematics** (`pages/rasa.html`, `core/yantra.js`, `data/rasa-data.js`): the Indian
  mercury-alchemy as history of chemistry only (18 saṃskāras + the rasaśālā apparatus; the Wujastyk "alchemical
  ghost" dispute flagged; mercury toxic, described never prescribed) beside the *provable* magic-square mathematics
  — the 9 navagraha 3×3 squares verified live (constants 15–39, grand total 729; flagged the modern printed
  tradition), Varāhamihira's sum-18 and the Khajuraho **Chautisa** most-perfect square, a **kaṭapayādi**
  encoder/decoder, and the 81-cell **Sarvatobhadra Chakra** cast for any date. The Indian sibling of the Picatrix
  kameas — the same mathematics with the opposite planetary logic (Sūrya, not Saturn, takes the 3×3).
- **Cast a chart by hand** (`pages/handcalc.html`, `core/handcalc.js`, `data/handcalc-data.js`): the classic
  ephemeris + atlas + book-of-tables workflow in five stations (per *The Astrology Podcast* ep. 396 / *Simply Math*
  2005), each hand step checked LIVE against the engine with the delta shown — clock→UT, Local Sidereal Time (the
  10 s/h book rule beside the exact 9.8565 s/h rate), planetary positions by linear interpolation AND proportional
  logarithms, and house cusps by double interpolation (Placidus). DeVore's printed plog values reproduced to 5 dp.
- **Practitioner-gap tools: transits · synastry · returns** (`core/transits.js`, `core/synastry.js`,
  `core/returns.js`; `pages/transits.html`, `pages/synastry.html`): the transit-to-natal timeline (exact-hit aspect
  perfections, retrograde 1-or-3 passes, stations & ingresses) with the profection overlay (the modern-Hellenistic
  "time-lord activated" filter, flagged); the chart-to-chart synastry aspect grid (Ptolemaic luminary core,
  *Tetrabiblos* IV.5; the full grid flagged modern, Jung's null 1952 experiment as the bridge) plus the house
  overlays both ways; and the lunar (monthly) / Saturn returns generalizing Lilly's solar revolution. Surfaced
  because Catherine Urban & Patrick Watson publicly attest their continued use — only the classical techniques and
  their primary sources are reproduced.
- **Elder Futhark runes** (`pages/runes.html`, `core/runes.js`, `data/runes-data.js`): the 24-stave oracle on the
  shared diviner engine — the Tacitus scatter-cast (*Germania* 10, framed a disputed PROTOTYPE only) or a single /
  three-rune draw, each drawn stave reading its ATTESTED medieval rune-poem stanza (Old English for all 24, Norse
  for exactly 16) ABOVE its flagged MODERN 20th-c. keyword, the two never blended; verified Unicode codepoints
  (gebo = U+16B7, no futhorc CEN), in-data disputes (⚑), no blank rune. The AI diviner (`buildRunesContext` /
  `buildRunesInterpretPrompt` / `runesDataBlock`) narrates the cast — cite-bound, the honest close, the five-part
  plain-words coda.

### R23 — The Grand Orchestrator, the abhicāra wing & the Yoga Sūtras ✅ **SHIPPED** (2026-07-16)
*(three deliverables built in parallel — a meta AI layer over every engine + two self-contained study wings —
then integrated together. Verified: engine-test all passed · audit Problems: 0 (80 HTML, 136 JS) · real-Chromium
sweep 80 pages, 0 errors.)*

- **The Grand Orchestrator** (`pages/autopilot.html`, `app/autopilot.js`; additive edits to `core/llm-context.js`):
  one prompt, every engine. The user pastes their own **Claude** key (browser-direct, the shared `wb-llm-key-anthropic`
  store) and asks *any* question — simple→advanced, past or future date — and Claude drives **12 agentic tools** over
  the whole site (`listCapabilities` · `fullChart` · `vedicChart` · `transitHits` · `synastryPair` · `annualChart` ·
  `prasnaNow` · `muhurtaDay` · `momentScan` · `greatConjunctions` · `timelords` · `castRunes`), computing the real
  figures then explaining them **codebooked** — honest frame FIRST, each tradition kept separate. A self-contained
  12-round tool loop renders each call as an auditable `⚙ toolName(args)` note; the wrappers are **pure** (randomness
  from `ctx.rand`, mirroring the oracles). It adds **no new astrology** — it's the meta layer over the registry, so a
  **3-step future-tool recipe** (registry row → one tool schema + one `runTool` case → nothing else) makes any new
  engine join automatically. Skips a registry entry deliberately (double-counting the meta layer).
- **The abhicāra / ṣaṭkarman wing** (`pages/abhichara/*`, `core/abhichara.js`, `data/abhichara-data.js`): the Indian
  ritual-magic tradition as scholarship treats it — the Vedic **abhicāra** of the Atharvaveda and its tantric
  systematization into the **six acts** (śānti, vaśīkaraṇa, stambhana, vidveṣaṇa, uccāṭana, māraṇa), with every
  verified correspondence table (colours, mudrās, rosaries, finger-holds, the left-hand rule, the dark-fortnight
  timing) and the two **conflicting season/time schemes shown side by side (⚑)** — the texts' own disputes flagged,
  never resolved — plus Mahīdhara's 19-item apparatus schema and the Atharvan hostile/counter-charm layer. A pure,
  read-only **ṣaṭkarman timing screen** (ṛtu from the sidereal Sun · ghaṭikā-cycle block & day-part from sunrise ·
  pañcāṅga fortnight · a "does now match the prescription?" check, every row cited). **Described, never prescribed;**
  no operational output, no demonstrated validity — the eastern mirror of the Picatrix magic.
- **The Yoga Sūtras study wing** (`pages/yoga/*`, `core/yogasutra.js` + 4 data modules): all **196 sūtras** of the
  Pātañjala Yoga-sūtra rendered **word-by-word** across the four pādas — Devanāgarī (Vedic accents stripped), IAST,
  Sanskrit→gloss tables after Rama Prasada (1912) and whole-sūtra translations after Woods (1914) — with a live
  **dual-numbering** counts-by-edition table (194/195/196; Book III's disputed variant sūtra, Book IV's Bhoja
  numbering), a cross-book search, the aṣṭāṅga (eight-limb) map, and an **honest āsana layer** (the YS defines āsana
  only as *sthira-sukham āsanam* and names NO posture — the familiar postures are later haṭha/commentary layers) with
  5 inline SVG diagrams. Dating/authorship follow Maas (c. 325–425 CE); the siddhi (vibhūti) claims are the text's
  own, described never prescribed.
- **Verify gate** (all green, run with the conda `astro-workbench` node): `engine-test.mjs` → **all passed** ·
  `audit.mjs` → **Problems: 0** (80 HTML, 136 JS) · `browser-verify.mjs` real-Chromium sweep → **80 pages, 0 errors**.

### R24 — The expert library, the mega-menu, the bhāṣya layer & the verified directions ✅ **SHIPPED** (2026-07-16)
*(four deliverables — a new reference wing, a site-wide navigation overhaul, a content layer over an existing wing, and
an accuracy promotion — built in parallel and integrated together. Verified: engine-test all passed · audit Problems: 0
(85 HTML, 138 JS) · real-Chromium sweep 85 pages, 0 errors.)*

- **(a) The Practitioners' Library** (`pages/library/*`, `core/data/practitioners.js`, `app/library.js`): the expert
  catalog of the people and books behind every practice on the site — **133 verified records** across three wings
  (Western 38 · Indian 42 · esoteric 53), grouped by practice and graded by a **practitioner-recognition tier**
  (canon / respected / niche / academic; a `TIER_DEFS` + `TIER_VOCAB_NOTE` vocabulary, Dummett/Kaplan-anchored). Each
  record carries verified works `{title, year, publisher}`, optional journal papers, the **step-by-step method as its
  author teaches it** (never prescribed), honest-framing/belief flags and where the person↔work pairing was verified.
  Built by a **two-pass adversarial method** — an expert catalog compiled from named sources, then an independent
  re-check of every pairing against publisher/ISBN records and the figures' own sites, **hunting for invented people or
  books**: confirmed corrections applied, unverifiable entries dropped (e.g. a "Bruce Robertson" with no traceable
  works). A `callable:false` data-module registry entry; ~15 engine-test asserts; described never prescribed, no
  validity claimed.
- **(b) The mega-menu navigation overhaul** (`app/shared.js`): the flat grouped bar became a **five-group mega-menu**
  (Start · Cast · Traditions · Oracles · Reference) — desktop dropdown panels (wide groups in two columns), a mobile
  accordion drawer — that lists **47+ destinations BY NAME**, so nothing hides behind an "All Tools" page; the active
  page and its group light up via `currentSection()`. Paired with a new **roadmap page** (`pages/roadmap.html`) that
  names the planned subsections. Accessible: disclosure buttons with `aria-expanded`, arrow-key entry, Escape-to-close,
  focus management.
- **(c) The Yoga Sūtras bhāṣya layer** (`core/yogasutra.js` flatten + the 4 data modules, `app/yoga.js`, `yoga.css`):
  every sūtra now carries a **one-to-three-sentence gist of the classical Vyāsa-bhāṣya** — an original paraphrase
  *after the Vyāsa-bhāṣya, trans. Woods (1914)* — shown in a **collapsible block beneath the translation** (**196
  gists**; the one disputed variant sūtra has none, which is exactly why the vulgate omits it — a one-line note says
  so). Threaded through the ALL_SUTRAS flatten so `sutraByRef`/search carry it too; 4 new engine-test invariants
  (bhashyaSrc XOR variant-null; exactly one null; every non-variant non-empty; the exact source string).
- **(d) The abhicāra DIRECTIONS_DEITIES promotion** (`core/data/abhichara-data.js`): the six-acts directional
  deity/quarter rows (§6) were **promoted from candidates to VERIFIED** against two independent full-text sources —
  Bühnemann's Tables 26.1–26.2 ("The Six Rites of Magic", in White ed., *Tantra in Practice*) and M. Ullrey's UCSB
  dissertation — the accuracy-check discipline applied to a previously provisional table.
- **Verify gate** (all green, conda `astro-workbench` node): `engine-test.mjs` → **all passed** · `audit.mjs` →
  **Problems: 0** (85 HTML, 138 JS) · `browser-verify.mjs` real-Chromium sweep → **85 pages, 0 errors**. Two extra
  Chromium drives: a yoga pāda page's Vyāsa-bhāṣya `<details>` opens with text (51 blocks, 458-char gist), and
  `library/western.html` renders its 38 practitioner cards — both pass, 0 console errors.

### R25 — The revamp (WP1+WP2), the Great Works, the Learn curriculum & the first roadmap stubs ✅ **SHIPPED (2026-07-16)**
*(five parallel deliverables — two site-wide craft passes and three new wings — built by separate work-packages and
integrated together via three manifests. Verified: engine-test all passed · audit Problems: 0 · real-Chromium sweep of
every page, 0 errors.)*

- **(a) Design System 2.0** (`assets/css/*` token + component layer, the export path): a **token layer**
  (colour / space / type / radius / `--sticky-top`) and a reusable **component layer** landed *under* the existing look
  with **zero visual drift**, plus the **chart/reading export-styling fix** (exports now carry the site's own CSS
  instead of rendering bare) and a sweep of quick wins. Purely additive — every prior page renders identically, so the
  85-page Chromium baseline stayed green.
- **(b) The chart-wheel beauty pass** (`app/chart.js` + the SVG diagram family): the wheel renderer gained **cluster
  fans** (stacked planets fan out instead of overprinting), **orb-weighted aspect lines** (a tighter orb draws a
  stronger stroke), **conjunction brackets**, **degree ticks** and an **elemental wash** behind the signs — and the
  same visual grammar was carried across the diagram family, so every chart on the site now reads as one system.
- **(c) The Great Works wing** (`core/data/greatworks.js`, `app/greatworks.js`, `pages/greatworks/*` — 7 pages):
  author→book→chapter study guides for the primary texts behind the esoteric wings — **9 authors · 23 works · 145
  chapters/treatises · 126 chapter cross-links · 71 study-path links** — each chapter mapped to the tool that *computes*
  what it describes. Public-domain status decided **per record** under the US 95-year rule (PD editions quoted &
  edition-cited; copyrighted editions cite-only), contested/spurious material flagged (the Corpus Hermeticum **XV**
  numbering gap shown, never renumbered; the spurious Fourth Book kept apart). A `callable:false` registry entry + an
  engine-test section that asserts **every** siteMapping/studyPath link resolves and the refuted mappings stay absent.
  Described, never prescribed.
- **(d) Learn — astrology & the mathematics** (`pages/learn.html`, `app/learn.js`): a step-by-step curriculum — **8
  modules · 31 numbered lessons · 4 milestones** — from the honest frame to every wing, with the **mathematics made
  first-class** (each lesson states the real formula, verified) and **localStorage progress** ticks (per-module counts,
  an aria-live progress bar, reset). Works fully with JS disabled (progressive enhancement); promoted to the **gold
  flagship of the home "Start here" band**.
- **(e) Tithi-praveśa + Kūṭa matching** (`core/tithi-pravesha.js`, `core/kuta.js` + `data/kuta-data.js`, two pages): the
  first two **planned Vedic roadmap stubs shipped**. *Tithi-praveśa* — the annual/monthly tithi return (the Moon
  regaining its exact natal elongation in its natal sidereal sign), **verified to the second** against JHora
  (2026 ⇒ 2026-10-09 11:56 UT); a modern-lineage technique with **no classical BPHS anchor** (flagged), the
  solar/soli-lunar month fork shown honestly. *Kūṭa matching* — the North's aṣṭakūṭa (36 guṇa) + the Tamil South's ten
  porutham, **every table cited**, contested values flagged and never resolved (the varṇa air/earth swap, the nāḍī
  exempt lists, the bhakūṭa points-restoration dispute, and the **North/South 5-9 contradiction shown both ways**). A
  sensitive-domain custom: what the tradition computes, never advice. Two `callable:false` registry entries + a
  20-assertion engine-test section on the verified vectors.
- **Verify gate** (all green, conda `astro-workbench` node): `engine-test.mjs` → **all passed** · `audit.mjs` →
  **Problems: 0** (95 HTML, 146 JS) · `browser-verify.mjs` real-Chromium sweep → **95 pages, 0 errors**; the mega-menu
  drive re-run after the four new nav items (Learn · Great Works · Tithi-praveśa · Kūṭa Matching) — all appear, no group
  overflow.

### R26 — The revamp, phase 3: the page sweeps ✅ **SHIPPED (2026-07-16)**
*(six parallel page-sweeps over the DS2 token/component layer, integrated in one working tree and verified whole-site.)*

- **(a) Chrome & footer diet + hero** — the shared header/mega-menu tightened, the footer put on a `footer-diet`, and the home hero reworked so the top of every page reads as one system.
- **(b) The mega-calculators** — a sticky **results-rail** (`app/rail.js`, opt-in per `section.panel[id]`) + **verdict banners** across Workbench, the Book I/III masters, Kūṭa, transits & the rest, so a long tool page navigates itself and states its bottom line up top.
- **(c) The scanners** — **filterbars** + **sticky `.table-scroll` tables** on Cycles, Moments & the Library, so big result sets stay scannable.
- **(d) The oracles** — a **staged casting reveal** (reduced-motion-first: colour/opacity only, instant-reveal escape) + the **unified `.chat`** diviner panel shared across Geomancy, Runes, Tarot & the I Ching.
- **(e) The reading-room study wings** — the Yoga, Great Works & Library wings gained the in-page **workrail** and a consistent reading column.
- **(f) The explorers** — **diagram-token + badge migrations** across Kabbalah, Chronology & Jung, so every diagram and status chip draws from the shared DS2 tokens.
- **Verify gate** (conda `astro-workbench` node): `engine-test.mjs` → **all passed** · `audit.mjs` → **Problems: 0** (95 HTML, 147 JS) · `browser-verify.mjs` real-Chromium sweep → **95 pages, 0 errors** (Book III master re-checked ×6 for the mid-flight `insertBefore` race — clean); the mega-menu drive + eight interaction spot-drives all pass. Mobile sanity at 390 px greened Home/Workbench/Yoga (two scoped fixes: yoga IAST/Devanāgarī `overflow-wrap`, and a `fieldset` shrink guard for the AI-connect panels); the Geomancy 12-house shield grid flagged as a known residual.

### R27 — The Great Confluence: the cross-tradition atlas ✅ **SHIPPED (2026-07-16)**
*(a new wing that lays nine wisdom traditions side by side on one era-warped vertical time axis and draws the **documented transmissions** between them as directed arcs — influence mapped, never validity. Sister to the Hermetic Chronology: the Chronology reads one tradition's story in order; the Confluence sees the whole map. Built by two parallel builders + an integrator over an adversarially-verified research corpus.)*

**The research corpus.** Nine independent research domains (kabbalah, yoga-vedānta, tantra-rasaśāstra, Buddhist, Daoist, Western alchemy/Hermetica, Abrahamic mysticism, and two cross-tradition "confluence" sets) were compiled and adversarially verified across 19 agents; the verification pass logged **109 corrections** and resolved a 189→**188 entries** / **153→151 edges** merge (5 duplicate entry-copies dropped with their unique sources unioned, 4 edge endpoints repointed, edges deduped on `(from,to,kind)`). Bodies, sources and contested blocks are reproduced **verbatim**; four synthesis entries (Jung, Corpus Hermeticum, Picatrix, Yijing) were authored to resolve cross-domain references, cited to the same standard.

- **Data** — `assets/js/core/data/confluence.js`: 188 cited entries (texts/people/events/translations/institutions) across 9 lanes + 151 transmission edges (29 cross-lane), each entry and arc labelled **documented / disputed / debunked / conspiracy**, contested points carrying both positions. Generated from the domain JSONs + `synthesis-additions.json` by applying `merge-instructions.md` exactly (Pico text↔event pair found already linked, so per merge §4 no synthetic edge forced — logged, not fabricated).
- **Engine** — `assets/js/core/confluence.js`: **PURE** (no DOM/Date/random). `ERA_BANDS` + `timeScale(zoom)` — a piecewise-linear era-warp (30→380 px/century, `totalHeight` ≈ 3626 px, monotonic, exact inverse); `layoutConfluence` collision-stacks nodes into non-overlapping sub-track rows and builds vertical-tangent Bézier edge geometry; `filterEntries` (lane/kind/label/century/text/crossings-only); `threadFrom` (deterministic chronological transmission chain); `entryBySlug`; `confluenceStats`. Nine lanes in the fixed crossing-minimising order christian→alchemy-west→kabbalah→islamic→[confluence spine]→yoga-vedanta→tantra-rasa→buddhist→daoist.
- **The page** — `pages/confluence.html` + `assets/js/app/confluence.js` + `assets/css/confluence.css`: the atlas shell paints **only** from `layoutConfluence()` output (SVG underlay of era zebra, lane washes, ruler, certainty bands + all 151 Bézier edges; HTML layer of kind-shaped, epistemic-coloured entry buttons). Roving-tabindex keyboard nav, hover/focus path-lighting, a detail drawer (contested panel verbatim, in/out Journeys, described-never-prescribed technique block), filters that hide/dim without re-layout, three zoom levels with year-re-anchor, a "follow this thread" walk with `#thread=`/`#slug` deep links, and a semantic single-column **Ledger** mode (forced <720 px, and the print view). Page-scoped CSS on DS2 tokens, reduced-motion-first.
- **Integration (this round).** `shared.js` nav (Traditions group + `currentSection`); a new **18-assert** `engine-test.mjs` section (188 entries, 9 exact lanes, all edges resolve, enum membership, sortYearEnd≥sortYear, contested≥2, every siteLink on disk, monotonic `timeScale` + height, deterministic overlap-free layout, crossings filter, `threadFrom('sirr-i-akbar')→'oupnekhat'`, stats totals); registry capability `confluence-atlas` (callable); an **8-term** glossary category `Confluence` (Transmission (textual), Prisca theologia, Neidan, Dhikr, Hesychasm, Lectio divina, Vipassanā, Era-warped scale); the **13th Grand Orchestrator tool** `confluence_atlas` + the honest-frame-first `buildConfluenceContext` / `…InterpretPrompt` / `confluenceDataBlock` and the `confluence` divination-assistant kind; a `#hiw-confluence` how-it-works section (the era-warp px/century table, the layout algorithm, the provenance) and cross-links from Contents, Tools, About & the Chronology.
- **The honest frame (locked).** The atlas plots **INFLUENCE** — who demonstrably read, rendered, answered or absorbed whom, with a citation on every link — and **never** doctrinal validity; debunked and conspiracy claims stay on the map, drawn faint, because false belief is also history; contested datings and directions show both positions and are **never resolved**.

### R28 — "The Deep Study Program" planning round ✅ **PLANNED (2026-07-16, plan-only — no code)**
*(Eleven Fable research agents across two verified workflows; 88 claims web-checked by adversarial
verifiers, 23 corrections applied in place. All specs live in **`docs/plans/r28/`** — the
authoritative phased roadmap is **`docs/plans/r28/ROADMAP.md`**, execution model: Opus codes
phase N while Fable researches phase N+1.)*

- **The 132-video Vedic playlist decoded** (Vasishtha Astrologer; 100% of titles + per-session topics recovered from metadata; live count now 133) → a two-page plan: `vedic/course.html` (9 sections, every rule re-grounded to BPHS Santhanam / Phaladīpikā Sareen — the anonymous teacher is a teaching-order witness only) + an 18-tool build list **T1–T18** (8 are surfacing jobs: the engine already computes pañcadhā-maitrī, graha-dṛṣṭi, 14 vargas, aṣṭakavarga, full ṣaḍbala — but shows no N/S-Indian chart figure at all). A do-NOT-build list keeps remedies/gemstones descriptive-only.
- **The three-layer chart-output standard** for all ~24 outputs (figure+legend → always-visible "In plain words" with a banned-phrase engine test → collapsed cited mechanics), glossary hover-popovers over the 247 terms, a narrate mode, the shared period-strip renderer for the five timing outputs (~20 coder-days, 6 gated phases).
- **The honest comparison page** (`compare.html`): ~30 products surveyed & cited; the licensing fact — zero state no-demonstrated-validity; 11 novelty claims each shipped as claim+verify+qualifier; a mandatory "what they do better" column; staleness badges + yearly re-survey.
- **The Buddhist scriptures wing**: licensing verified (SuttaCentral/Sujato **CC0**, Mahāsaṅgīti Pāli PD, Wong Mou-lam 1930 fresh-PD; NC/SA firewall for DPD/Thanissaro); tiered word-by-word scope measured at ~7× the Yoga-Sūtras wing (Dhammapada alone ~5,600 gloss slots); refrain/peyyāla model; per-record licence tags engine-tested.
- **The Practices wing**: 8 practice groups, the ~60-mudrā catalog (Gheraṇḍa 25 + HYP 10 + iconographic + tantric) with parameterized stroke-SVG hand/body art, 8 complete-book modules, a descriptive-voice lint. **Blocker logged:** the Gheraṇḍa archive scan b28140102 is the 1895 Bombay edition, not the cited 1914–15 SBH printing — re-pin before any record ships.
- **The atlas upgrade plan**: 13 reference designs surveyed; Histomap breathing-lane widths **rejected with argument** (width would encode curation as importance); 11 work packages (minimap, search-fly-to, edge-legibility program + per-edge epistemic labels, semantic-zoom clustering, guided-tour stories, SVG poster export) + a data-growth contract for the coming wings.
- **The dynamic-site decision memo**: the architecture ladder analyzed (PWA → tiny sync backend → SSR → full dynamic); verdict **stay static** — adopt PWA + Pagefind now; the Hono+D1+passkeys+E2E-blob sync backend is fully pre-designed but **trigger-gated**; SSR/full-dynamic rejected; Swiss Ephemeris stays out (AGPL/CHF 700 vs MIT astronomy-engine); BYOK AI stays browser-direct (birth data never transits an operator). Plus the fully-static learn×handcalc **cast-along program** (9 stations, graded deltas against engine-test's pinned vectors, 7 seeded drill types, 31 named diagrams).
- **The Eastern greats expansion**: 25 ranked figures in 5 clusters with exact PD verdicts — Varāhamihira the flagship (two US-PD Bṛhajjātaka translations); Yogananda's 1946 **first edition** verified PD (SRF v. Ananda, 206 F.3d 1322, holdings recorded precisely); BPHS has NO PD English (Santhanam cite-only); honest "no PD — say so" verdicts for Tantrāloka (Dyczkowski's 2023 complete translation is copyrighted — the verifier caught the plan's false "none exists"), Śōbōgenzō, Lamrim Chenmo; a PD-flip calendar 2027–2036 wired to quote-gating; ~26 new atlas entries + edges (incl. Kūkai↔Xiuyao-jing).

### UI3 — The Interaction Revamp: physics, instruments & the illuminated observatory ✅ **SHIPPED (2026-07-16)**
*(A five-expert consultation — web designer, artist, physics-interaction designer, data-viz expert, atlas expert — synthesized by an arbiter into one spec + a six-builder partition, built by six parallel Opus builders + integrator, then a fresh-eyes final verifier whose NOT-GREEN verdict bounced nine precise defects back to their owners before the round could ship. The full loop: experts → arbiter → build → integrate → verify → fix → re-verify → green.)*

- **The physics foundation** — `app/motion.js`: the site's ONE spring/momentum conductor (critically-damped springs, presets snappy/gentle/molasses engine-tested as exact constants, velocity-tracked drag, rubber-band, settle-detection that stops the rAF loop — `__motionStats().running === false` at idle is now asserted on all 96 pages). No motion library vendored: with no build step there is no tree-shaking, and ~280 hand-rolled lines beat every candidate. Physics is BANNED from information (no reveal-stagger on results, no parallax, no scroll-hijack — recorded as law).
- **The control language** — the shared **moment-picker** (the site's most-repeated interaction built once: named IANA offsets verified against July-2026 data incl. Cairo DST and Mexico City's abolition, recent-places memory, throw-at-mount legacy-id guard, 13 pages migrated), the sticky **action bar** with compute choreography (banner focus → RM-gated scroll; export buttons moved out of forms), the **Ctrl-K command palette** over NAV_GROUPS + REGISTRY, dial inputs (component shipped; page opt-ins deferred where no zodiacal input exists), one-primary-button-per-region law, 94 breadcrumb trails rewritten to menu geography.
- **The instruments** — the chart wheel is now a focusable, click-to-inspect, **rotate-with-momentum instrument** (snap-to-planet detents, pin cards with the Lilly −5..+5 dignity line, aspect-hover path lighting); NEW pure renderers: North/South-Indian rāśi charts (conventions verified against ≥3 authorities before coding), the shared brushable **period-strip** (firdāriā, zodiacal releasing, transit hits with crosshair + brushed row-filtering), weekly transit **heat table**, anchored **score bars** whose domains derive from the exported weight tables (never guessed). ONE vendored file in the whole round: d3-array's `ticks.js` (ISC, ~2 KB, verbatim + LICENSE).
- **The Illuminated Observatory** (art layer) — body grain + aurora washes, 15 engraving-style wing frontispieces (Lilly's wings get his actual square horary figure), a ≥40-glyph stroke icon sprite, epistemic labels as TEXTURE (documented=solid, disputed=hatched, debunked=faded+strike), and pure `core/skyart.js`: exact-terminator moon phases, the unequal-hours planetary dial (with pre-sunrise day-rollback fixed and pinned by a mocked 03:00 drive), a deterministic starfield — the Now page is an instrument panel. Home hero: one gold CTA + the three doors; the covenant moved byte-identically (diff-proven).
- **The atlas as showpiece** — momentum pan in a contained instrument frame, continuous spring zoom bridging the three layout levels without lying about positions, semantic-zoom cluster pills, the minimap with draggable lens, search-with-fly-to, rich hover cards, sticky lane heads: 53/53 drives green incl. RM MutationObserver zero-world-transform and idle asserts.
- **The verification story (the round's real lesson):** the integrator's load-level gate was green while six interaction deliverables were silently missing — only the final verifier's hand-driven §10.2 drives caught the workbench wheel's wrong-shape crash (the site's ONE console error), timelords/transits strips imported-but-never-called, synastry's missing figure-root + roving, the unmounted oracle action bars, the inert vedic inspect, and the Now-dial disagreement. A two-fixer bounce-back round repaired all of it with per-fix drive proofs; the re-verifier closed at **GREEN: 8/8 failed drives now pass, zero console errors site-wide** (last residual: `setPointerCapture` guards). Load-only gates cannot see missing figures; interaction drives are now part of the standing gate (six `ui3-*.mjs` suites wired into engine-test + browser-verify).
- **Gate:** engine-test all passed (incl. 6 new UI3 suites + the 18 confluence asserts) · audit 96 HTML / 175 JS, 0 problems · Chromium 96 pages 0 errors (load + drives + RM/390/print passes) · menu-drive 53 destinations · framing byte-lock diff-proven on every moved block.

### FURTHER ROADMAP (after R21, in rough value order)
1. **Runes (Elder Futhark)** — a 24-stave oracle on the shared diviner engine (medium fit).
2. **Streaming-markdown AI replies** with copy/regenerate.
3. Numerology beyond gematria remains a *weak* engine fit.
4. **Tithi-praveśa + Nakṣatra porutham (kūṭa matching)** — ✅ **SHIPPED (R25, 2026-07-16)**: the two Vedic
   returns-&-compatibility roadmap stubs are now live (`pages/tithi-pravesha.html`, `pages/kuta.html`), both flagged
   for their contested tables and modern-lineage/sensitive-domain framing.

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
