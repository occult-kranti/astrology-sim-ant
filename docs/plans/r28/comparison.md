# R28 Plan — The Honest Comparison: landscape survey + spec for `pages/compare.html`

**Round:** R28 (plan-only — nothing in this document has been written into the repo)
**Survey window:** 2026-07 (all competitor facts below were checked via live web search on 2026-07-16; every claim carries its source URL)
**Inventory basis:** `assets/js/core/registry.js` (61 capability entries) + `pages/tools.html` (the human-facing tool catalogue)

---

## 0. Why this page, and the bar it must clear

The site's LOCKED framing means the comparison page is the most dangerous page we could build: one puffed claim ("the most honest astrology site on the internet") and the page fails the site's own epistemic standard. So the governing rule for `pages/compare.html` is:

> **Every cell in the matrix is a checkable factual claim about software, not a value judgement.** Every competitor row carries the date it was surveyed and at least one source URL. Every novelty claim is phrased so a reader can falsify it in under a minute. The "what others do better" column is mandatory and non-empty for every competitor.

This mirrors how the site treats Lilly: describe, cite, flag disagreement, never resolve. Here the "primary sources" are vendor pages, app-store listings, and project repositories, and the "CONTESTED" mechanism becomes the **UNVERIFIED** cell state (we could not confirm a fact from a public source — shown as `?`, never guessed).

---

## 1. What this site actually has (the inventory to compare)

From `assets/js/core/registry.js` (61 entries) and `pages/tools.html`, grouped the way the matrix will group them:

- **Western traditional engine (Lilly CA I–III):** castChart (7 planets + nodes, 4 house systems, ~1′ via astronomy-engine), essential/accidental dignity + almuten, aspects with Lilly's moieties & reception, lots/antiscia (Paulus' Hermetic lots, sect toggle), chart-health/considerations, horary perfection + house-by-house judgement, Lilly's own worked charts re-run from printed positions (`chart-from-positions`), natal topics, profections, primary directions (in-zodiac Naibod, flagged simplified), solar/lunar/planetary returns, secondary progressions, firdaria (night-node dispute exposed as a toggle), zodiacal releasing, hyleg/alcocoden (flagged CONTESTED), rectification (Animodar + Trutine, flagged CONTESTED), transits with profection overlay, synastry (Ptolemaic core flagged vs modern grid), life trajectory.
- **Picatrix/Agrippa magical layer (described, never prescribed):** election engine with cited testimonies, talisman recipes with `TALISMAN_DISCLAIMER`, 28 mansions + images, 36 decan faces, 15 Behenian stars (precessed live), planetary prayers/spirits/Perfect Nature, kameas + sigil tracer, personalization (almuten figuris).
- **Indian mirror:** full Jyotiṣa reading modelled on Jagannath Hora (Lahiri sidereal, nakṣatras, pañcāṅga, Vimśottarī, vargas D1–D60, Aṣṭakavarga, six-fold Ṣaḍbala), KP 249 sub-lords, praśna, muhūrta, tājika varṣaphala, tithi-praveśa, kūṭa matching, ṣaṭkarman timing, rasaśāstra yantra-math.
- **Oracles:** geomancy shield chart (cast & judged, Judge-parity checksum), tarot, I Ching, Elder Futhark runes.
- **Other wings:** Kabbalah Tree of Life + gematria, Jung (psychological horoscope + the null 1952 marriage experiment + aeon clock), Hermetic Chronology, Cycles of History (great conjunctions + honest eclipse finder), the **Great Confluence cross-tradition atlas**, the **Moment Scanner** (every rulebook, one timeline), the **hand-cast teaching tool** (`pages/handcalc.html` — every manual step checked live against the engine with the delta shown), the Grand Orchestrator (BYOK Claude agent over ~a dozen engine tools), Yoga Sūtras and Great Works study wings, glossary, how-it-works, Library.
- **Infrastructure that matters for the comparison:** static/offline/no-build; per-capability `citation` field on all 61 registry entries; anti-drift `scripts/engine-test.mjs` asserting registry↔code↔glossary↔pages coherence; the honest-science banner site-wide; BYOK AI assistant on every tool.

---

## 2. The survey (all facts as of 2026-07; cite-per-claim)

Legend for the three honesty questions asked of each product:
**EXPLAIN?** = does it teach the method, or only output results? · **CITES?** = does it name primary sources/editions for its rules? · **VALIDITY?** = does it state anywhere that astrology/divination has no demonstrated empirical validity?

### 2.1 Western — general purpose

| Product | What it does | License / price | Platform | EXPLAIN? | CITES? | VALIDITY? |
|---|---|---|---|---|---|---|
| **astro.com (Astrodienst)** | The de-facto standard free web chart service since 1996 (~9M visitors/mo per their site); Extended Chart Selection (many chart types, house systems, asteroids), 9000-year online ephemeris, hosts the **Swiss Ephemeris** (JPL-DE-based, the precision standard) and the AstroDatabank collection of timed birth data | Free core; ASTRODIENST PLUS subscription removes ads, ~2000 stored data sets | Web | Partial — extensive articles, but the calculators output without teaching the method | Rarely per-rule; Swiss Ephemeris itself is meticulously documented | No — presents astrology as a working practice |
| **Astro-Seek** | Free web calculators with an unusually deep **traditional module**: 7 planets, whole-sign, terms, antiscia, prenatal syzygy, profections, firdaria, decennials, zodiacal releasing, lots; plus transits, progressions, returns, synastry, astrocartography; tropical/sidereal toggle | Free, ad-supported | Web | Mostly compute-only; some explanatory notes | No per-rule primary citations observed | No |
| **TimePassages (Astrograph)** | Modern psychological astrology; point-and-click interpretations by Henry Seltzer; natal, transits, progressions, compatibility | Desktop from $79; mobile free + Pro subscription $7.99/mo or $59.99/yr (App Store listing; corrected from $9.99/mo by the 2026-07-16 verification pass) | Windows, macOS, iOS, Android | Interpretation text, not method teaching | No | No |
| **Solar Fire (Astrolabe/Esoteric Technologies)** | The professional Windows standard: huge calculation set (medieval, esoteric, Cosmobiology, fixed stars, asteroids, astromapping, Vedic, financial), TimeMap, animation, report writers, ACS atlas | Commercial, $360 list at Alabe (upgrades from $99; re-verified 2026-07-16 — the ~$306 lower bound came from the solarfireastrology.com order form in the original survey) | Windows | Compute + canned reports | Not per-rule | No |
| **Astro Gold (Esoteric Technologies)** | Solar Fire's mobile/Mac sibling; professional calculations + report add-ons | macOS US$249.99 (astrogold.io — corrected from $229.99 by the 2026-07-16 verification pass); iOS free download + subscription or lifetime unlock | macOS, iOS | Compute + reports | Not per-rule | No |
| **Time Nomad** | Free offline-capable iOS charts (DE-430 ephemeris), electional tools | Free + optional IAP | iOS/iPadOS | Compute + blog articles | No | No |
| **Astrolog (Walter Pullen)** | FOSS veteran distributed with source since 1991: 23 house systems, 24 aspect types, asteroids/TNOs/Uranian points/**27 planetary moons**, ~50 fixed stars, sidereal & heliocentric modes, real-time chart animation, exoplanet transits; CLI + GUI | GPL, free | Windows, macOS, Linux, CLI anywhere | Compute-only; helpfile documents switches, not doctrine | No | No |

Sources: [astro.com free charts](https://www.astro.com/free/free_chart_e.htm) · [Swiss Ephemeris](https://www.astro.com/swisseph/swephinfo_e.htm) · [astro.com 9000-yr ephemeris](https://www.astro.com/swisseph/swepha_e.htm) · [Astro-Seek traditional](https://horoscopes.astro-seek.com/traditional-astrology) · [Astro-Seek advanced tools](https://horoscopes.astro-seek.com/advanced-astrology-chart-tools-tables) · [TimePassages](https://astrograph.com/astrology-software) · [TimePassages mobile](https://astrograph.com/timepassages/mobile) · [Solar Fire order form](https://www.solarfireastrology.com/solarfireorderform.htm) · [Astrolabe Solar Fire V9](https://alabe.com/solarfireV9.html) · [Astro Gold macOS](https://www.astrogold.io/get-astro-gold/for-macos/) · [Astro Gold iOS](https://www.astrogold.io/get-astro-gold/for-ios/) · [Time Nomad](https://timenomad.app/) · [astrolog.org](https://www.astrolog.org/astrolog.htm) · [Astrolog (Wikipedia)](https://en.wikipedia.org/wiki/Astrolog)

### 2.2 Vedic

| Product | What it does | License / price | Platform | EXPLAIN? | CITES? | VALIDITY? |
|---|---|---|---|---|---|---|
| **Jagannatha Hora (P.V.R. Narasimha Rao)** | The freeware standard our Vedic wing is modelled on: full-install ephemeris 12899 BC–16900 AD, **2.5M-city atlas**, dozens of daśā systems (Vimśottarī, Yogini, Chara…), all vargas, Aṣṭakavarga, Ṣaḍbala, muhūrta tools | Freeware (not open source) | Windows | Author's free book + lectures exist separately; software mostly computes | Rooted in BPHS tradition; not per-rule in-app | No — devotional framing |
| **Parashara's Light (GeoVision)** | Commercial Vedic suite: "5000 calculations", interpretive reports, rectification, varshaphal, praśna, built-in world atlas; markets "100% accurate calculations certified" | ₹5,000 (Personal) – ₹30,000 (Professional) | Windows, Android | Reports, some classical-text quotation | Quotes classics in reports | No — marketing claims of certified accuracy |
| **Maitreya / Maitreya9** | FOSS Vedic + Western: vargas, daśās (graphical), KP, parts of Jaimini, Sarvatobhadra, Tajaka, Uranian; the original project is active again (release 8.2, 2025-09-30, with Oct 2025 updates per saravali.github.io — "unmaintained" corrected by the 2026-07-16 verification pass); the community fork Maitreya9 also exists | GPL, free | Windows, Linux, macOS, FreeBSD | Compute-only; separate documentation | Yoga view references Parasara/Saravali/Brihat Jataka | No |
| **Drik Panchang** | The reference web pañcāṅga: 100k+ cities, festival/vrat calendars, muhūrta (choghadiya, horā, abhijit…), kundali D1–D60 in North/South/East Indian formats, kūṭa matching | Free, ad-supported; apps with IAP | Web, iOS, Android | Good conceptual articles on pañcāṅga elements | Not to critical editions | No — devotional framing |
| **AstroSage** | Mass-market free kundli portal + panchang; monetizes via paid consultations, gemstone/remedy recommendations | Free + paid services | Web, iOS, Android | Horoscope content, minimal method | No | No — actively sells remedies |

Sources: [vedicastrologer.org/jh](https://www.vedicastrologer.org/jh/) · [JHora on archive.org](https://archive.org/details/jh_full_install) · [parashara.com](http://www.parashara.com/home.html) · [Parashara's Light pricing (Techjockey)](https://www.techjockey.com/detail/parasharas-light-commercial-edition) · [Maitreya9 fork](https://github.com/robinrodricks/Maitreya9) · [Saravali/Maitreya](https://saravali.github.io/) · [drikpanchang.com](https://www.drikpanchang.com/) · [Drik Panchang utilities](https://www.drikpanchang.com/utilities/astrology-utilities.html) · [AstroSage panchang](https://panchang.astrosage.com/)

### 2.3 Traditional / horary / Hellenistic

| Product | What it does | License / price | Platform | EXPLAIN? | CITES? | VALIDITY? |
|---|---|---|---|---|---|---|
| **Morinus (+ Traditional Morinus / Valens forks)** | FOSS Python traditional software; Swiss Ephemeris (5000 BC–5000 AD); **accurate Placidian mundane primary directions**, antiscia on-wheel, in-mundo progressions, revolutions, syzygy; Python-3 community fork exists | GPLv3, free | Windows, Linux, macOS (anywhere Python runs) | Compute-only | No in-app; community docs reference traditional method | No |
| **Delphic Oracle (Zoidiasoft / Curtis Manwaring)** | "Gold standard of traditional programs" (Hank Friedman, TMA): Hellenistic→early-Modern techniques built on the **Project Hindsight translations** (Valens, Dorotheus, Hephaistio, Māshā'allāh, Bonatti, Lilly…), time-lord systems, graphic ephemeris, Swiss Ephemeris 4713 BCE–5399 CE | Commercial; WL license $100, XPF tiers higher | Windows, macOS | Wizards guide technique use; the closest competitor to "explains its provenance" | **Yes — names ancient authors/translations**, the strongest citing culture in the field | No |
| **Skyscript (Deborah Houlding)** | Not software: the reference free web library for traditional astrology — historical research articles, horary course, forum, STA school | Free articles; paid courses | Web | **Yes — teaching is the whole point** | Yes, scholarly citations in articles | No — practitioner stance |

Sources: [pymorinus](https://sites.google.com/site/pymorinus/) · [Morinus SourceForge](https://sourceforge.net/projects/morinus/) · [Morinus Py3 edition](https://ingenieriaastrologica.github.io/Morinus/) · [Seven Stars on Morinus](https://sevenstarsastrology.com/astrology-free-software-1-charts-morinus/) · [Delphic Oracle download/pricing](https://www.astrology-x-files.com/delphicoracle-download.html) · [Delphic Oracle WL](https://www.astrology-x-files.com/software/delphicoracle-wl.html) · [Project Hindsight page](http://www.projecthindsight.com/products/delphicoracle.html) · [skyscript.co.uk](https://www.skyscript.co.uk/)

### 2.4 Oracles (tarot, I Ching, geomancy, runes)

| Product | What it does | License / price | Platform | EXPLAIN? | CITES? | VALIDITY? |
|---|---|---|---|---|---|---|
| **Labyrinthos (Tina Gong)** | Gamified tarot school (also Lenormand, runes): structured lessons, quizzes, leveling | Free app + paid decks/courses | Web, iOS, Android | **Yes — teaching-first** | Light; not edition-level | No |
| **Biddy Tarot** | The most-cited card-meanings reference + commercial courses | Free meanings; paid courses | Web | Yes (meanings) | No | No |
| **Tarot.com** | Commercial readings: tarot + numerology + **I Ching** | Freemium | Web | Minimal | No | No |
| **Trusted Tarot / free-reading sites** | Instant free draws, no account | Free, ads | Web | No | No | No |
| **Online Clarity (Hilary Barrett)** | Free I Ching readings using a **named translation by a named translator** (Barrett's own), active community forum, podcast — the rare oracle site with real provenance | Free readings; paid books/courses | Web | Yes — commentary distinguishes translated text from interpretation | **Partial — names its translation** | No |
| **Geomancy web tools** | Free shield-chart generators exist: PsychicScience.org (full shield + house chart with interpretation), Tarotsmith (step-by-step classic method), OracleSanctum (shield→house mapping), Geomancy.me, small GitHub-pages tools. None found that both **teach the algebra** (daughters by transposition, the even-Judge checksum) *and* cite Agrippa/the Latin tradition per figure | Free, ads on some | Web | Partial (Tarotsmith walks the method) | No | No (PsychicScience sits within a parapsychology-framed site) |
| **Rune-casting sites** | Numerous free Elder Futhark casters; none surfaced in this survey citing the rune-poem sources (Old English / Old Icelandic / Norwegian) per rune | Free, ads | Web | No | No | No |

Sources: [labyrinthos.co](https://labyrinthos.co/) · [biddytarot.com](https://biddytarot.com/) · [Taroscoper comparison](https://www.taroscoper.com/guides/best-tarot-apps-and-sites-compared) · [Taro's Tarot roundup](https://tarostarot.com/blog/best-free-tarot-reading-sites) · [onlineclarity.co.uk](https://www.onlineclarity.co.uk/) · [free I Ching reading](https://www.onlineclarity.co.uk/reading/free-online-i-ching/) · [psychicscience.org/geomancy](https://psychicscience.org/geomancy) · [tarotsmith.com/geomancy](https://tarotsmith.com/geomancy/) · [oraclesanctum.com/geomancy](https://oraclesanctum.com/geomancy/) · [Geomancy.me shield generator](https://www.weisschoice.org/geomancy/geomancy-shield-generator)

### 2.5 Kabbalah tree explorers

Interactive trees exist ([kabbalistic.com](https://www.kabbalistic.com/sephirot/), [kabbala-study.com](https://kabbala-study.com/) with gematria, [Servants of the Light](https://www.servantsofthelight.org/knowledge/tree-of-life/), [archetypes.kaabalah.com](https://archetypes.kaabalah.com/) 3D, [FindYourFate's calculator](https://www.findyourfate.com/ai/kabbalah-calculator-fyf.php) — notable for *selectable* Golden Dawn/Kircher **vs** Gra path-mappings and multiple gematria ciphers, [Cosmos Daily's "birth-chart pathways"](https://cosmosdaily.co/tree-of-life-calculator) — an invented astrology-Kabbalah syncretism sold as a personal reading, plus a commercial [Kabbalah REST API](https://astrology-api.io/p/kabbalah)). The pattern: Golden-Dawn attributions presented as *the* Tree, almost never flagging that the GD letter/path/tarot attributions are a 19th-century innovation and that Gra/Ari/Kircher arrangements genuinely disagree — exactly the CONTESTED point our Kabbalah page flags. None observed distinguishing Jewish Kabbalah from Hermetic Qabalah with citations; none states validity limits. Our differentiator is the cited-and-flagged treatment, not interactivity per se (FindYourFate's selectable systems are the closest partial precedent — say so in the matrix rowNote).

### 2.6 Hand-calculation teaching

The Astrology Podcast **ep. 396** (Urban & Watson, 2023-04) is a *discussion* of hand-calculation, pointing to Michelsen/Pottenger ephemerides and books of tables — explicitly *not* a tutorial ([transcript](https://theastrologypodcast.com/transcripts/ep-396-transcript-calculating-astrology-charts-by-hand/)). Catherine Urban sells a hand-calculation course ("Chart Calculations for the Apocalypse", [course page](https://catherine-urban.squarespace.com/courses-and-webinars/chart-calculations-for-the-apocalypse)); **Demetra George** sells a video course, "How to Calculate a Chart by Hand" ([Astrology University](https://www.astrologyuniversity.com/shop/search-by-astrologer/demetra-george/how-to-calculate-a-chart-by-hand/)) — ephemeris + Table of Houses + arithmetic. The book route is Margaret Hone's *Modern Text-Book of Astrology* and similar, and Patrick Watson's essay debates whether the skill still matters ([patrickwatsonastrology.com](https://patrickwatsonastrology.com/should-astrologers-know-how-to-calculate-natal-charts-by-hand/)). **No free interactive in-browser tool that checks each hand step against a live engine and shows the delta surfaced in this survey** — that is `pages/handcalc.html`'s verifiable niche.

### 2.7 Cross-tradition timeline atlases — does anything like the Confluence exist?

- **Knight Lab TimelineJS** — FOSS timeline *authoring tool* (spreadsheet-driven), not a content atlas ([timeline.knightlab.com](https://timeline.knightlab.com/)).
- **Histography** (Matan Stauber, Bezalel) — WebGL timeline of 14 billion years driven by Wikipedia; online-only, no sourcing beyond Wikipedia, no computation ([project page](https://cargocollective.com/matanstauber/histography)).
- **Academic esotericism:** Amsterdam's HHP centre ([amsterdamhermetica.nl](https://www.amsterdamhermetica.nl/research/)) and the Ritman Library's **Hermetically Open Archive** (25k+ occult texts scanned) are scholarly portals/scan archives — cited, honest, but not interactive and not computational.
- **Conclusion (phrase exactly this way on the page):** *"In our July 2026 survey we found timeline tools (TimelineJS, Histography) and scholarly archives (HHP, Ritman), but no interactive atlas that places multiple divination traditions on one computed, per-event-cited timeline. If you know of one, tell us and we will list it."* Never claim "nothing like it exists."

### 2.8 AI astrology products

| Product | Method | Honesty posture |
|---|---|---|
| **Co-Star** | Computes natal chart from JPL/NASA data, then generates daily lines with language models trained on interpretation corpora; criticized for opacity, negativity-tuning, and Big-Three-only depth | Presents output as astrology that works; methodology opaque; no citations; no BYOK — your data on their servers |
| **The Pattern** | Reviewers report it does **not** cast a chart at all — algorithmic psychological profiling from birth data; methodology unpublished | Opaque by design |
| **KundliGPT (and clones)** | Free/pro Vedic chatbot on OpenAI models: kundli readings, daśā timing, yoga analysis, 15 languages, tropical/sidereal toggle; **gives remedy advice — prescriptive** | Vendor-hosted, vendor key; "cites the astrological logic" per its own marketing but not editions; no validity statement |
| **AstroSage "AI astrologer"** | AI consultation layer over the AstroSage kundli portal, feeding into paid human consultations and remedy commerce | Opaque; prescriptive; monetizes belief directly |
| **ChatGPT-wrapper astrology apps (2025–26 wave)** | Server-side LLM + chart API; subscription | Same pattern: no citations, no validity statement, no key ownership |

**2026 reviewer criticisms worth citing (as attributed reviews, not facts):** Co-Star's paywall creep and recycled AI phrasing; The Pattern's $14.99/mo compatibility gate and reviewer reports of non-reproducible outputs across runs. Note when citing that several of these reviewers are themselves competing apps — attribute accordingly.

Sources: [ASAP/Review on Co-Star](https://asapjournal.com/node/as-above-so-below-astrological-data-in-the-age-of-co-star/) · [leaveit2ai Co-Star review](https://leaveit2ai.com/ai-tools/astrology/co-star) · [ERA 2026 comparison](https://eraastrology.ai/blog/best-ai-astrology-apps-2026/) · [Aurae Co-Star review](https://www.auraeastrology.com/blog/co-star-app-review-2026-an-astrologers-honest-opinion) · [Unstar 2026 app ranking](https://unstar.app/blog/co-star-sanctuary-pattern-nebula-stellium-astrology-apps-ranked-2026) · [kundligpt.com](https://kundligpt.com/) · [AstroSage AI](https://www.astrosage.com/)

### 2.9 The landscape's honesty gap (the one pattern that licenses this page)

Across all ~30 products surveyed: **zero** state that astrology/divination has no demonstrated empirical validity (the closest found anywhere is a boilerplate disclaimer page on a minor vendor, [goastrologer.com](https://goastrologer.com/page/disclaimer), and the scientific-consensus statements live off-site at [Wikipedia](https://en.wikipedia.org/wiki/Astrology_and_science) and [undsci.berkeley.edu](https://undsci.berkeley.edu/astrology-is-it-scientific/)); **one** (Delphic Oracle) systematically names its primary-source provenance, and Online Clarity names its I Ching translation; **none** flag intra-tradition disagreements as unresolved (FindYourFate's selectable Kircher-vs-Gra mappings are the nearest partial gesture); **none** publish an anti-drift test tying rules to sources. That gap — not feature count — is what `compare.html` documents.

---

## 3. The spec — `pages/compare.html`

### 3.1 Page identity

- **Title:** "How this site compares — an honest survey of the landscape"
- **Location/nav:** under the About wing (`pages/about/` sibling or top-level `pages/compare.html` as tasked — use `pages/compare.html`), linked from `pages/about/index.html`, `pages/tools.html` footer, and the mega-menu's About group.
- **Lede honesty note (verbatim spirit):** "These are factual observations about other software, surveyed on the dates shown. Prices and features change; every row carries its source and survey date. Most of these products are excellent at what they do — the last column of every card says what they do better than us."

### 3.2 Architecture (site invariants)

1. **`assets/js/core/data/competitors.js`** — pure data module (no DOM, no fetch), following the `add-data-module` discipline:
   ```js
   export const SURVEY_STAMP = '2026-07'; // page-level "surveyed" stamp
   export const COMPETITORS = [ {
     id: 'astro-com', name: 'astro.com (Astrodienst)',
     category: 'western',            // western | vedic | traditional | oracle | kabbalah | teaching | atlas | ai
     what: '…one-paragraph factual description…',
     license: 'Free core; PLUS subscription', price: 'free / subscription',
     platforms: ['web'],
     explains: 'partial', cites: 'rare', statesValidity: false,   // the three honesty axes
     betterAtThanUs: ['Swiss Ephemeris sub-arcsecond precision', 'AstroDatabank', '…'], // REQUIRED non-empty
     surveyed: '2026-07-16',
     sources: ['https://www.astro.com/free/free_chart_e.htm', …],  // REQUIRED ≥1
     notes: '…', unverified: ['…claims we could not confirm…'],
   }, … ];
   export const FEATURE_MATRIX = { features: [ { id:'offline', label:'Works fully offline', cite:'…', rowNote:'…' }, … ],
     cells: { 'offline': { site:'full', 'astro-com':'none', 'jhora':'full', … } } };   // full|partial|none|unknown
   export const NOVELTY_CLAIMS = [ { claim:'…verifiable phrasing…', verify:'…how to check…', qualifier:'…who else partially has it…' }, … ];
   export function competitorById(id) { … }  // tiny pure helper
   ```
2. **`assets/js/app/compare.js`** — all DOM: renders the matrix, cards, filters, staleness badges (compares `surveyed` to `Date.now()` in the app layer so core stays pure/deterministic). DS2 tokens only; reduced-motion-first (no animation needed at all — prefer none); the wide matrix lives in an `overflow-x:auto` container with a sticky first column; `<caption>`, `scope="col"/"row"` for accessibility.
3. **Registry entry** (keeps the "every new tool is registered" invariant):
   ```js
   id: 'comparison', title: 'The honest comparison (landscape survey)',
   module: 'assets/js/core/data/competitors.js', exportName: 'COMPETITORS',
   exports: ['FEATURE_MATRIX', 'NOVELTY_CLAIMS', 'SURVEY_STAMP', 'competitorById'],
   computes: 'Reference: the surveyed landscape of astrology/divination software … every record dated & sourced; the honest feature matrix and the verifiable novelty claims.',
   inputs: [{ name:'id', type:'string', desc:'competitor id', required:false }],
   callable: true,   // so the AI assistant can answer "how does this compare to Solar Fire?"
   citation: 'Vendor pages & repositories as linked per record; surveyed 2026-07.',
   pages: ['pages/compare.html'], howItWorks: 'pages/compare.html#method',
   glossaryTerms: ['Swiss Ephemeris', 'Ephemeris'],
   ```
   → requires adding **'Swiss Ephemeris'** (and 'Ephemeris' if absent) to the glossary with citation to astro.com/swisseph — engine-test enforces this automatically.
4. **AI assistant integration:** the registry `callable:true` surfaces a `comparison` tool in `buildToolSchema()`; add a small system-prompt note in `core/llm-context.js` that comparisons must be quoted with their survey date.
5. **engine-test additions (anti-drift for facts):**
   - every competitor record has non-empty `betterAtThanUs`, ≥1 `sources` URL (https), a `surveyed` ISO date not in the future, and a known `category`;
   - every `FEATURE_MATRIX.cells` key matches a feature id; every column id is `site` or a competitor id; every cell value ∈ {full, partial, none, unknown};
   - every `NOVELTY_CLAIMS` entry has a non-empty `verify` string;
   - deterministic only — **no** wall-clock staleness assertion in the test (staleness is a rendered badge, not a test failure).

### 3.3 Page sections (top to bottom)

1. **Method & honesty note** (`#method`) — how the survey was done, what the cell states mean (● full · ◐ partial · ○ absent · ? unverified), the `SURVEY_STAMP`, the correction invitation ("found an error? the sources are one click away — tell us").
2. **The matrix** (`#matrix`) — features × tools, ~22 feature rows × ~14 columns (this site + astro.com, Astro-Seek, TimePassages, Solar Fire, Astro Gold, Astrolog, JHora, Parashara's Light, Maitreya, Drik Panchang, Morinus, Delphic Oracle, Co-Star). Suggested feature rows: Swiss-Ephemeris-grade precision; outer planets & asteroids; 7-planet traditional engine; essential-dignity ledger; horary perfection engine; Hellenistic time-lords; primary directions (mundane vs zodiacal noted in rowNote); Vedic vargas/daśās/Ṣaḍbala; pañcāṅga & muhūrta; KP sub-lords; election engine; talisman/magic layer (described-only flagged); oracles (geomancy/tarot/I Ching/runes); Kabbalah explorer; cross-tradition timeline atlas; hand-calculation teaching with live checking; per-rule primary-source citations; validity stated honestly; CONTESTED flags; works fully offline; open code, no build, no account/tracking; BYOK AI with auditable tool calls; mobile native app; built-in atlas & historical timezones; printable/PDF reports; chart-file/client management. Each row's `cite` renders as a footnote link + per-row survey date.
3. **Per-competitor cards** (`#landscape`, filterable by category) — the §2 tables as cards; each card MUST render `betterAtThanUs` under the heading **"What it does better than this site"**, plus license/price with "as surveyed <date>", platforms, the three honesty axes, sources.
4. **What this site can truthfully claim** (`#claims`) — the novelty claims (§3.4), each with its "verify it yourself" line and its qualifier.
5. **What others do better — the summary** (`#humility`) — the generous column aggregated (§3.5), so the page ends on it.

### 3.4 Novelty claims — exact verifiable phrasings (no puffery)

Each claim ships with a *verify* instruction and a *qualifier*; the page must render all three parts.

1. **"All 61 computed capabilities carry a named primary-source citation in the machine-readable registry."** Verify: open `core/registry.js`, every entry has `citation`. Qualifier: Delphic Oracle also names its ancient authors; per-capability machine-readable citation is what we found nowhere else.
2. **"Every page states that these systems have no demonstrated empirical validity."** Verify: the honest-science banner; the browser sweep asserts chrome injection on every page. Qualifier: none surveyed does this at all.
3. **"Genuine disagreements are flagged CONTESTED with both positions and left unresolved"** (firdaria night order as a toggle, hyleg rules, rectification assumptions, sect-aware lots). Verify: the toggles and flags on the named pages. Qualifier: competitors typically pick one convention silently.
4. **"Historical practices are described, never prescribed"** — `TALISMAN_DISCLAIMER` on every recipe; ṣaṭkarman/abhicāra screens describe only. Qualifier: AstroSage actively sells remedies; most magic sites prescribe.
5. **"Runs entirely from static files: no server, no build step, no account, no tracking; works offline after first load."** Verify: DevTools network tab; view-source. Qualifier: Time Nomad (iOS) also computes offline; JHora/Morinus are offline desktop apps — "offline *web*, with the whole engine readable as unminified ES modules" is the precise novelty.
6. **"A cross-tradition atlas and Moment Scanner that run every rulebook over one timeline, each event cited."** Verify: `confluence.html`, `moments.html`. Qualifier: phrased as §2.7 — "we found no comparable tool in our 2026-07 survey," with the correction invitation.
7. **"A hand-calculation teacher that checks each manual step against the engine live and shows the delta."** Verify: `handcalc.html`. Qualifier: courses and podcast ep. 396 teach the method; we found no interactive checker.
8. **"BYOK AI on every tool: your own key, browser-direct, every engine call shown as an auditable tool-call line."** Verify: the Orchestrator's `⚙ toolName(args)` lines; no server between you and the provider. Qualifier: Co-Star/The Pattern run opaque server-side models; no BYOK product surfaced.
9. **"An anti-drift test suite ties every registry entry to real exports, pages, glossary terms and citations."** Verify: `scripts/engine-test.mjs` in the repo. Qualifier: FOSS competitors have unit tests; none tie rules to citations.
10. **"Lilly's own 1647 charts re-computed from their printed positions, with confidence caveats."** Verify: `book2/examples.html`. Qualifier: unique in this survey; Delphic Oracle covers the same authors' *techniques*.
11. **"This comparison page itself lists what every competitor does better than us, with sources and survey dates."** Verify: scroll up. (The reflexive claim — cheap to verify, sets the tone.)

**Anti-puffery rules (enforced in review):** no superlatives ("best", "most honest", "only" without the survey qualifier); "we found none in our <date> survey" instead of "nothing exists"; no claims about competitors' internals beyond what their public pages state; UNVERIFIED (`?`) whenever a fact could not be confirmed.

### 3.5 What others do better (the generous column — content to ship)

- **Precision:** Swiss Ephemeris (astro.com, Solar Fire, Astro Gold, Morinus, Delphic Oracle, Maitreya) is sub-arcsecond over ±5000+ years; our astronomy-engine is ~1 arc-minute — fine for degree-based traditional work, honest about it.
- **Bodies:** outer planets, Chiron, asteroids, Uranian points, thousands of fixed stars vs our 7 planets + nodes + 15 Behenian stars; Astrolog alone computes 27 planetary moons and 23 house systems vs our 4.
- **FOSS pedigree:** free-software astrology is not our invention — Astrolog has shipped with source since 1991; Morinus and Maitreya are GPL. Our novelty is the honesty layer, not the openness.
- **Atlas & historical timezones:** JHora's 2.5M-city atlas; Solar Fire's ACS atlas; Drik Panchang's 100k+ cities. We require manual lat/lon and UTC — the single biggest practical gap.
- **Primary directions:** Morinus and Delphic Oracle do true Placidian *mundane* directions; ours are in-zodiac Naibod, flagged simplified.
- **Vedic depth:** JHora's dozens of daśā systems and research options; Parashara's Light's interpretive reports and rectification suite; Maitreya's Jaimini/KP breadth beyond our KP table.
- **Panchang breadth:** Drik Panchang's festival/vrat calendars and regional variants.
- **Native mobile apps, notifications, sync** (TimePassages, Astro Gold, Co-Star, Drik Panchang).
- **Client work:** chart databases, file management, print-quality wheels, PDF report writers (Solar Fire, Astro Gold, Parashara's Light); AstroDatabank's Rodden-rated birth data (astro.com).
- **Community & longevity:** astro.com since 1996; Skyscript's forum; decades of practitioner shakedown vs our young engine.
- **Astrocartography/relocation** (Astro-Seek, Solar Fire) — we have none.
- **Gamified learning** (Labyrinthos) — our study wings are text-first.
- **Hellenistic completeness** (Delphic Oracle's time-lord wizards beyond our four systems).

### 3.6 Maintenance plan (competitor facts go stale)

- **Per-record `surveyed` date + `sources`** (schema-enforced by engine-test, §3.2.5). Page-level `SURVEY_STAMP` rendered in the lede and above the matrix.
- **Staleness badge:** `app/compare.js` renders "surveyed N months ago" per card and turns the badge amber past 12 months, red past 24 — computed client-side, never in core, never a test failure.
- **Price policy:** prices appear only on cards (never in the matrix), always as "as surveyed <date>", with currency; the lede states prices change.
- **Re-survey checklist** committed as a comment block at the top of `competitors.js`: for each record, reload each `sources` URL, update `surveyed`, move anything unconfirmable to `unverified`, and re-run the §2.7-style "does a Confluence-like atlas now exist?" search — claims 6 and 7 are the perishable ones.
- **Correction channel:** the method section invites corrections; treat an inbound correction like a CONTESTED flag — update the record, keep the old value in a `history` note if it changed materially.
- **Dead links:** verify-site's audit only checks internal links; add a manual step to the re-survey checklist for external URLs (do NOT make the CI gate fetch the network).

### 3.7 Acceptance criteria

1. `verify-site` passes (page loads with chrome injected, no console errors, matrix scrolls horizontally inside its container, body never scrolls sideways).
2. engine-test passes with the new schema assertions; registry entry resolves; 'Swiss Ephemeris' glossary term exists and is cited.
3. Every competitor card shows a non-empty "What it does better than this site" list, a survey date, and ≥1 source link.
4. Every novelty claim renders claim + verify + qualifier; a reviewer can execute each verify step.
5. No superlative or unqualified "only/first/best" string appears (grep review: `only|best|first|unmatched|unrivaled` — allow "only" strictly in the qualifier form "the only one *we found in the <date> survey*").
6. The page reads correctly in light and dark DS2 themes and under `prefers-reduced-motion` (trivially — no motion).

---

## 4. Risks

1. **Staleness is structural, not incidental** — prices/features WILL be wrong within a year. Mitigation is the dated-per-row design; residual risk accepted and disclosed on-page.
2. **Unverifiable competitor internals** (e.g. "The Pattern casts no chart" comes from reviewers, not the vendor) — must render as attributed observation ("reviewers report…") or `?`, never as flat fact.
3. **Legal/tonal risk of naming competitors negatively** — mitigated by facts-only cells, mandatory better-than-us column, sources on every row, and the correction invitation.
4. **The reflexive honesty trap** — if even one claim is puffed the page discredits the whole site's framing; the anti-puffery grep and the claim/verify/qualifier triple are the guard.
5. **Novelty claims 6–7 are falsifiable by a single new product** — the "in our <date> survey" phrasing plus the re-survey checklist keeps them honest over time.
6. **The oracle rows compare across product categories** — geomancy/tarot/I Ching/rune sites (verified: PsychicScience, Tarotsmith, OracleSanctum, Online Clarity, Labyrinthos…) are web toys/schools, not chart software; keep them in the §3.3 cards (category `oracle`), never as matrix columns, or the grid becomes an apples-to-oranges dishonesty.
7. **Scope creep** — the matrix wants to grow columns; cap at ~14 tools and push the rest to the cards, or the table becomes unusable on mobile even with overflow scroll.
