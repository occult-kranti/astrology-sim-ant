# Slice 01 — THE CLOSED CORPUS ALREADY IN THIS REPO

**Method.** No external research. Every claim below is re-derivable from the repo at commit
`89e2622` (R32), working tree clean, by loading the named module with node and reading the named
field. Extraction scripts live beside this file (`extract.mjs`, `extract2.mjs`, `extract3.mjs`,
`extract4.mjs`, `build.mjs`); the graph is `01-repo-closed-corpus.json`.

**Headline counts (all verified this round).**

| thing | count | where |
|---|---|---|
| Confluence lanes | 9 (4 west, 1 spine, 4 east) | `CONFLUENCE_LANES` |
| Confluence entries | 190 | `CONFLUENCE_ENTRIES` |
| … of which carry a `technique` field | **91** | 99 carry `technique:null` |
| Confluence edges | 155 | `CONFLUENCE_EDGES` |
| … edges where BOTH endpoints are technique-bearing | **45** | computed |
| Great Works (west) | 9 authors / 24 works / 100 chapter records | `greatworks.js` |
| Great Works (east) | 3 authors / 11 works | `greatworks-east.js` |
| Haṭha mudrā records | 35 (Gheraṇḍa 25 + HYP 10) | `practices/mudras.js` |
| Practices groups | 8 — **1 built**, 5 planned, 1 catalogued, 1 theory-only, 1 "computed" | `MUDRA_GROUPS` |
| Abhicāra texts | 9 | `abhichara-data.js TEXTS` |
| Rasaśāstra texts | 6 (+18 saṃskāras, 15 apparatus) | `rasa-data.js` |
| Practitioners | 133 (west 38 / india 42 / esoteric 53), 4 tiers | `practitioners.js` |
| Procedure-bearing works inventoried here | **127** (103 with an atlas slug, 24 without) | this graph |
| Procedure claims (work × type) | **179** across 16 types | this graph |
| Typed edges emitted | 472 | this graph |

---

## 1. What the Confluence atlas ALREADY is — in detail

This is the closest prior art and the thing the new graph most risks duplicating, so it is
reported precisely.

### 1.1 Schema (from the module header, verbatim structure)

```
CONFLUENCE_LANES   { id, name, glyph, side:'west'|'spine'|'east' }        — 9, fixed order
CONFLUENCE_ENTRIES { slug, lane, title, titleOriginal|null, dateText,
                     sortYear (BCE negative), sortYearEnd|null,
                     dateCertainty:'year'|'decade'|'century'|'range'|'contested',
                     kind:'text'|'person'|'event'|'translation'|'institution',
                     place|null, body, technique:string|null, label,
                     sources:[...], contested:null|{flag,positions:[{source,value}]},
                     siteLink:null|{href,label} }                        — 190, sorted (sortYear, slug)
CONFLUENCE_EDGES   { from, to,
                     kind:'translation'|'influence'|'commentary'|'synthesis'
                          |'refutation'|'adaptation',
                     body, sources:[...],
                     label:'documented'|'disputed'|'debunked'|'conspiracy',
                     bestCitation, note }                                — 155, sorted (from,to,kind)
```

`from` = the earlier work / source of the act; `to` = where it landed.

### 1.2 The lanes

`christian` ✝ · `alchemy-west` ☿ · `kabbalah` א · `islamic` ☪ (west) — `confluence` ✶ (spine) —
`yoga-vedanta` ॐ · `tantra-rasa` ☤ · `buddhist` ☸ · `daoist` ☯ (east).
Lane sizes: confluence 44, alchemy-west 24, buddhist 22, yoga-vedanta 21, tantra-rasa 19,
christian 18, kabbalah 18, daoist 17, **islamic 7 (thinnest)**. The roster is explicitly FROZEN
("no tenth lane, roster frozen", R29 plan §2.1).

### 1.3 Entry kinds and epistemic labels

kinds: text 107 · person 34 · event 26 · translation 17 · institution 6.
labels: **documented 170 · disputed 16 · debunked 4** (`conspiracy` is in the vocabulary but
unused). 54 entries carry a `contested` block with ≥2 cited positions that the site refuses to
resolve. 56 entries carry a `siteLink` into a computing page.

### 1.4 Edge kinds and labels

kinds: influence 94 · commentary 19 · translation 15 · adaptation 12 · synthesis 8 · refutation 7.
labels: **documented 145 · disputed 9 · debunked 1**. The single debunked edge is
`corpus-hermeticum → kybalion` (adaptation) — drawn faint and struck, never hidden. Every edge
carries `bestCitation` (one best witness) and a `note` explaining why it grades as it does; the
R28 merge asserts a bijection (every edge labelled, every label row consumed).

### 1.5 The `technique` field — what it is and is NOT

91 entries carry one. It is **a single free-text sentence of prose**. It is:

- **untyped** — no vocabulary, no controlled kind;
- **ungraded** — it never says whether the text gives the whole sequence;
- **unsegmented** — no stages, no loci beyond an occasional chapter number;
- **attached to non-works** — carried by person nodes (`person-abulafia`, `person-naropa`,
  `person-goenka`), institutions (`quanzhen`, `naqshbandi-order`, `centering-prayer`), events
  (`event-shangqing-revelations`, `event-mbsr-1979`, `event-rishikesh-1968`) and translation
  nodes (`event-golden-flower-1929`, `kitab-patanjal`).

Two defects it already contains, both to be corrected rather than copied:

1. **`masnavi`** carries the Mevlevi samāʿ as its technique, while the same field says the samāʿ
   "was codified after Rumi's death by Sultan Walad and standardized … under Pir Adil Çelebi".
   The procedure belongs to the order, not the poem.
2. **`event-golden-flower-1929`** (a translation node) restates
   `secret-of-the-golden-flower`'s technique nearly verbatim — a duplicate the new graph should
   collapse to one CONTAINS_PROCEDURE plus one TRANSMITS_TO.

### 1.6 Honesty rules that bind the new graph too (locked, from the module header)

- The atlas plots **INFLUENCE, never validity**; an edge means "demonstrably read / rendered /
  answered / absorbed", per its own citation.
- Every entry carries an epistemic label; debunked/conspiracy material **stays in the record**,
  drawn recessive, never dressed as documented fact.
- `contested` entries carry ≥2 positions, each with its own citation, verbatim, **never resolved**.
- **Techniques are DESCRIBED as historical practice, never prescribed.**

---

## 2. CHARTER — atlas vs operative-content graph (the one paragraph)

> The Great Confluence is a **transmission map**: 190 entries in nine frozen lanes and 155 typed,
> epistemically-labelled edges whose entire claim is that one thing was demonstrably read,
> rendered, answered or absorbed by another — "the atlas plots INFLUENCE, never validity" — with
> each edge graded documented/disputed/debunked and carrying its single best witness. Its 91
> `technique` fields are one prose sentence apiece: untyped, ungraded, unsegmented, and hung
> indiscriminately on text, person, event, institution and translation nodes. They answer *what
> did this tradition do?* and nothing more. **The operative-content graph answers a different
> question and must not restate the first**: it types WHICH procedure-kinds a work contains
> (controlled vocabulary), HOW COMPLETE the text's own account is (complete / partial /
> referenced / fragmentary, each with the named missing element and the evidence for the grade),
> and HOW A PROCEDURE — not a book — propagates, which is a strictly stronger claim than an
> influence edge and needs its own citation. **The join key is the Confluence `slug`**: every work
> that exists in the atlas carries the atlas slug verbatim (103 of the 127 works inventoried here
> do); the other 24 mint a namespaced id (`abh:`, `rasa:`, `gw:`, `gwe:`, `div:`) and flag that
> they need an atlas entry. On that key the two graphs cross-link and neither owns the other: the
> atlas answers *who read whom*, the operative graph answers *what does this text tell an operator
> to do, how fully, and where did that sequence come from*.

**Never write back into `confluence.js`.** Its header states it is generated by the
`gen-data.mjs` pipeline and reproduces verified files verbatim; hand-edits are forbidden.

**Do not duplicate:** transmission/influence claims (155 edges own them) · dating, place,
date-certainty and the 54 contested blocks · PD verdicts for the 35 Great Works (per-work
`pdStatus` / `pdSources` / `quoteSafe` with a documented verification note) · entry epistemic
labels · the nine-lane roster.

**Genuinely new:** the procedure-type vocabulary · the completeness grade · procedure-level
propagation · works entirely outside the atlas · harm typing at procedure granularity.

---

## 3. Inventory — where procedure-bearing works live

Full rows in the JSON `works` array. Summary by home:

| home | works | note |
|---|---|---|
| `confluence.js` only (technique-bearing) | 91 nodes → 103 joined works | the bulk; prose technique only |
| `greatworks.js` | 24 works / 100 chapter records; **10 carry `spellsMagic`** | Hall, Hermetica, Crowley, Dee, Agrippa, Lévi, Ficino, Iamblichus, Regardie |
| `greatworks-east.js` | 11 works; Varāhamihira / Yogananda / Vivekananda | Bṛhat Saṁhitā is the only operative-adjacent one |
| `practices/mudras.js` | 35 records, 2 source texts | the ONLY built practice records in the repo |
| `abhichara-data.js` | 9 texts — **8 have no atlas slug** | the deepest variable-mapping in the repo |
| `rasa-data.js` | 6 texts — **3 have no atlas slug** | 18 saṃskāras + 15 apparatus enumerated |
| `picatrix-prayers.js` / `planetary-magic.js` | Picatrix III.6/III.7/III.9 + Book IV | prayers, angel & spirit names, hazard flags |
| `kameas.js` | Agrippa II.22 + III.30 | 7 squares + the sigil-tracing note |
| `vedic-remedies.js` | Mantra Mahodadhi + Navagraha Stotra (uncited as works) | bīja mantras + japa counts printed |
| `yogasutra/*.js` | Yoga Sūtras, complete | 3 edition counts recorded |
| `buddhist/*.js` | MN 118, Dhammapada, Metta, Heart | full texts with licence provenance |
| `geomantic-figures.js` / `runes-data.js` / `tarot-deck.js` / `iching-hexagrams.js` | 4 divination engines the site actually computes | |

Coverage of the 179 procedure claims, on the two axes:

- **repoCoverage** (what the repo records — verified): complete 16 · partial 29 · referenced 133 · fragmentary 1.
- **textCompleteness** (the source text's own completeness): complete 9 · partial 6 · referenced 2 · **null 162**.

That `null 162` is the honest headline: **the repo has no completeness dimension at all.** The 17
grades I could set were all derivable from the repo's own words — e.g. the Kaṭha Upaniṣad
technique says the text "presents this as Death's teaching to Naciketas, **not as a stepwise
manual**" (→ `referenced`, verified); the Kriya Yoga technique says "an **initiation-only**
prāṇāyāma discipline" (→ `referenced`); the TM technique says "an **individually assigned**
Sanskrit mantra" (→ `partial`, element withheld); the Ignatian technique says the retreatant
proceeds "**under a director**" (→ `partial`); Guigo II's four rungs are fully enumerated (→
`complete`). Everything else is left null on purpose.

---

## 4. DUPLICATION BLACKLIST

Do **not** re-derive. Read the record, then extend only the operative dimension.

1. **Gheraṇḍa Saṁhitā ch.3** — 25 mudrā records, GS 3.6–3.93 continuous, Vasu 1895 PD scan
   `b28140102` pinned, verse numbering cross-checked against siva.sh, and the plan's
   edition/scan mismatch already resolved in `PRACTICES_META.editionResolution`.
2. **Haṭhayogapradīpikā ch.3** — 10 mudrā records, HYP 3.10–3.125, Sinh 1914 PD; the 10-vs-9
   overlap with Gheraṇḍa settled in-data (vajrolī/vajroṇī flagged **name-only**: GS 3.45 is an
   inverted posture, HYP 3.83+ a genito-urinary practice).
3. **Yoga Sūtras** — every sūtra word-by-word; `YS_META` carries all three edition counts
   (196 / 195 / 194) with the editions that produce each, six sources, and the Maas dating note.
4. **Ānāpānasati Sutta (MN 118)** — 154 segment records + 6 refrains + 13 substitution glosses,
   root Pāli + CC0 Sujato, with fetch dates.
5. **Dhammapada (395) / Metta (43) / Heart (16)** — with per-text licence provenance.
6. **The ṣaṭkarman variable system (Mantramahodadhi ch.25)** — 6 acts with Bühnemann's MMU
   25.1–3 definitions verified verbatim; the **19 variables** of MMU 25.4–5 each with Sanskrit,
   IAST and gloss; per-act directions+deities promoted to VERIFIED on 2026-07-16 against two
   independent full-text sources; correspondences, ghaṭikā cycle, day-parts, and 4 cited ETHICS
   blocks. Adversarially re-verified.
7. **The 18 saṃskāras of mercury** — enumerated with IAST/English/function/group/cite; 15
   apparatus-yantras; the Nāgārjuna *Rasaratnākara* "ghost" (Wujastyk 1984) and the Rasārṇava
   8th-vs-11th-century dispute already recorded as unresolved.
8. **Agrippa, *De occulta philosophia*** — 27 chapter blocks + 7 computed, checksum-verified
   kameas + `SIGIL_METHOD_NOTE`; refuted site-mappings already dropped in review.
9. **Picatrix III–IV** — 7 planetary prayers with angel/spirit names, the 9-chapter Book IV
   summary with three hazard flags, Perfect Nature with its unresolved four-vs-one reading.
10. **Corpus Hermeticum I–XVIII** — all treatises, the visible XV gap explained, CH XI/XIII
    operative passages already flagged.
11. **The Enochian system** — 48 Calls, 21-letter alphabet, Loagaeth 49×49, Great Table
    letter-position derivation, Heptarchia + 30 Aethyrs.
12. **The atlas itself** — 190 entries / 155 labelled edges from nine adversarially-verified
    domains with 109 logged corrections. Contradicting it is a defect, not a finding.
13. **133 practitioners** in four tiers (including an `academic` tier explicitly defined as
    scholarship-not-practice).
14. **`docs/plans/r29/esoteric-libraries.md`** — the 384-work catalog (58 + 61 + 48 + 130 + 87)
    with 15 licence attacks and 10 dating attacks already resolved and **no fabrications found**.
    Its corrections are load-bearing and must be cited, not re-derived: Mathers KOS **1889** (ISTA
    mislabels 1888) · Abramelin **1898** (2nd ed. 1900) · Steganographia first printed **1606** ·
    Weyer's Pseudomonarchia **1577** · Ars Notoria transcription **CC-BY 4.0, transcription only**
    · rolling US PD wall **pre-1931**.

---

## 5. THE BIGGEST FINDING — planned ≠ shipped

`docs/plans/r29/esoteric-libraries.md` admits **48 atlas entries** (21 pre-1800 for R30, 24 modern
for R32, 3 Balkan for R33), ~24 edges, and **44 practices records in five groups**.

Checked against shipped data this round: **47 of the 48 slugs are absent** from
`CONFLUENCE_ENTRIES`. The one present (`person-ibn-arabi`) pre-dates the plan. **Zero** of the 44
practices records exist; `MUDRA_GROUPS` shows only the mudrā group `built:true`. The rounds that
actually shipped (R29–R32) were the Vedic course, the Buddhist wing, the Practices wing (mudrās
only), and the Eastern Greats.

**Consequence:** the entire Western operative corpus is unmapped in shipped data — Key of Solomon
family, Lemegeton/Goetia, Ars Notoria, Liber Juratus, Ars Almadel, Abramelin, Heptameron, Arbatel,
Steganographia, Weyer, Scot, Magical Calendar, Sefer ha-Razim, Sefer Raziel, Sword of Moses, PGM,
Chaldean Oracles, Testament of Solomon, Barrett, Waite 1911; the whole Thelema/GD ritual set
(Liber Resh, Star Ruby, Liber E, Liber III, Liber Astarté, Liber Samekh, Liber XV, Neophyte 0=0,
Liber 536); the whole chaos-magic set (sigilization, Death Posture, gnosis taxonomy, Liber MMM,
servitors, Gnostic Pentagram, Ouranian Barbaric, TOPY regimen); Bardon's ten steps; Paneurhythmy;
dhikr litanies; Mevlevi samāʿ; nianfo; daoyin; gṛhya nakṣatra rites; fāl-e Ḥāfeẓ; the Wiccan
material.

**Instruction to research agents:** read §1–§3 of that plan before touching any of these, inherit
its verdicts, and inherit its harm callouts **verbatim** — Abramelin ordeal (isolation/fasting,
obsessive harm, modern psychiatric framing) · Liber III razor self-cutting · Death Posture
self-induced hypoxia/syncope · Goetia curse-and-compel (mirroring six-acts.html; Weyer's
deliberate mutilation as counter-voice) · TOPY bodily-fluid/sexual content · Grand Grimoire
one-line record only · **Order of Nine Angles: total exclusion, not even a museum record** ·
**Yezidi material: excluded this program** · Necronomicon: hoax label mandatory.

---

## 6. HONEST GAP LIST

### 6.1 In-repo works with zero operative mapping (99 entries have `technique:null`)

The high-value ones: `bardo-thodol` (a liminal-rite manual!), `sefer-yetzirah`, `zohar`,
`yoga-bhasya` (the commentary that operationalises Patañjali), `nisvasatattvasamhita` (the
earliest surviving Śaiva tantra in the repo), `emerald-tablet`, `turba-philosophorum`,
`ibn-umayl-silvery-water`, `splendor-solis`, `atalanta-fugiens`, `mutus-liber` (a **wordless**
plate-book — a unique completeness case), `chymical-wedding`, `platform-sutra`, `daodejing`,
`zhengao`, `brhadaranyaka-upanisad`, `rigveda`, `sefer-ha-bahir`, `shaarei-orah`,
`pardes-rimmonim`. Cheapest high-value targets in the whole program.

### 6.2 Controlled-vocabulary gaps (15 distinct, flagged per-procedure as `vocabGap`)

posture/āsana · objectless & apophatic seated meditation · bare-attention/insight contemplation
(the largest practice family in the atlas!) · letter-permutation & gematria contemplation ·
graded scriptural reading (lectio divina) · graded doctrinal curriculum (lamrim) ·
thought-observation/discernment · liturgical dance/movement rite · musical/tonal rite ·
scrying/crystallomancy (currently collapsed into divination-procedure) · ascetic regimen
(currently forced into purification, which **loses the harm signal**) · emblem/geometrical
construction · apparatus-construction as distinct from operation.

### 6.3 Cultures with no coverage at all

Mesoamerican · Sub-Saharan African (**Ifá/Odu — the repo computes geomancy but never names the
ʿilm al-raml → Ifá question**) · Mesopotamian (šuilla, namburbi, extispicy — only Thompson 1900 is
even named, and only inside the plan) · Ancient Egyptian (PGM planned-not-shipped) · Greco-Roman
mystery cult · Indigenous American / Siberian / Central Asian shamanic (would need a
living-tradition ethics posture the repo has not written) · Japanese Shintō / Shugendō / Shingon
(no mikkyō ritual, despite Guhyasamāja being present) · Korean / Vietnamese / SE Asian ·
Jewish practical kabbalah beyond Hekhalot & Lurianic kavvanot · Zoroastrian / Mandaean
(Yazidi **explicitly excluded on ethics grounds — honour it**) · Slavic / Baltic / Finnic
(planned R33) · Christian ritual beyond contemplative prayer (no liturgical, sacramental,
exorcistic or folk-Catholic coverage) · Islamic beyond Sufi dhikr/samāʿ (no ʿilm al-ḥurūf, no
taʿwīdh, no Shiʿi ritual; the islamic lane is the thinnest at 7).

### 6.4 Structural gaps

- **No completeness dimension exists anywhere in shipped data.** Zero prior art to inherit.
- Techniques hang off person/event/institution/translation nodes; the new graph must rule on
  whether that is legal, and must fix the two mis-attributions in §1.5.
- **Exactly one edge in the repo is a genuine procedure-propagation claim**:
  `amrtasiddhi → dattatreyayogasastra`, whose body names the practices (mahāmudrā, mahābandha,
  mahāvedha) and cites Mallinson 2020. The other 44 both-endpoints-procedure-bearing edges are
  work-level influence claims and **must not be silently upgraded**. Use the Mallinson edge as the
  schema exemplar.
- **No cross-module identity layer.** `Mantramahodadhi` (abhichara) and `Mantra Mahodadhi`
  (vedic-remedies) are the same work under two transliterations in two wings;
  `mudras.js source:"gheranda"|"hyp"` resolves to atlas slugs only by human inference.
- **No procedure-level harm taxonomy.** Harm notes are page-level (`FRAMING.care`,
  `RASA_TOXICITY`, Book IV flags, `MAGIC_DISCLAIMER`, `REMEDIES_FRAMING`) plus 6 record-level
  `harmNote`s and 26 `textCaution`s among the mudrās. Nothing types the hazard kind.

---

## 7. RISKS — including three razor tensions already in shipped data

1. **`kameas.js SIGIL_METHOD_NOTE` reproduces an executable four-step sigil-tracing method**
   (Hebrew name → gematria values → aiq-bekar chamber reduction → continuous cell-to-cell trace,
   circle at the head, cross-bar at the end). Honestly framed, sourced to Nowotny (JWCI 12, 1949),
   and it flags the Latin-alphabet variant as a modern post-GD convenience. It is nevertheless the
   most nearly *usable* procedure in the repo, and the hostile auditor will find it. Record it as
   *"contains yantra-construction, repoCoverage: complete"* **without restating the steps**, and do
   not treat it as licence to add comparable step-lists elsewhere.
2. **`vedic-remedies.js` prints actual bīja and nāma mantra strings** (IAST + Devanāgarī) for all
   nine grahas, with japa counts and a note on when the tradition energises a yantra. Gated by
   `REMEDIES_FRAMING` and by `classical:false` on the syncretic rows — but the syllables are
   there. Record *"mantra-recitation, complete"*; **do not extend this pattern to any new corpus.**
   If an agent cites it as precedent for reproducing mantra text, refuse.
3. **`picatrix-prayers.js` reproduces prayer excerpts, angel names (Latin + Arabic), six
   directional spirit names per planet, and the Perfect Nature rite's frame** (Moon at 0° Aries,
   four names invoked seven times, three named aromatics). Bounded by HISTORICAL-ONLY flags. Treat
   as the **ceiling, never the floor**.
4. **Contradiction risk.** 54 atlas contested blocks + 10 kabbalah DISPUTES are deliberately
   unresolved (Yijing authorship; Rasārṇava and Rasaratnasamuccaya dating; the Nāgārjuna
   *Rasaratnākara* ghost; khecarī, vajrolī, yoni-mudrā, māṇḍukī; Perfect Nature four-vs-one;
   Prapañcasāra attribution; Śāradātilaka dating; Bhairavapadmāvatīkalpa attestation; the
   Uḍḍīśatantra's legendary Rāvaṇa attribution). Resolving one breaks a locked rule.
5. **Harm-material drift.** 6 mudrā records already carry `harmNote` (mahāvedha, khecarī incl.
   frenum-cutting at HYP 3.33–37, vajroṇī/vajrolī, pāśinī, mātaṅginī) and 26 carry `textCaution`.
   The planned chaos-magic and Thelema groups carry far sharper hazards; the plan already
   specifies the callouts — use them, do not soften them.
6. **Atlas capacity is nearly spent.** Engine-test tripwires: entries 450, edges 400, lane×band
   WARN 21 / FAIL 30; `confluence × global` sits **at the WARN line (21)**; the
   `alchemy-west ↔ confluence` corridor is at 13 of a 16 FAIL cap with all three remaining seats
   already allocated by the R29 plan. **The operative graph is a separate artifact and must add
   nothing to `confluence.js`.**
7. **Provenance asymmetry.** Shipped modules had an adversarial pass (109 corrections; abhichara
   re-verified 2026-07-16 against full-text primaries). New rows this round have not. Mark
   per-row provenance so unverified rows never sit unmarked beside verified ones.
8. **Live source blockers** (from the plan, still open): sacred-texts.com 403s automated fetchers
   and four renewal-UNVERIFIED items still need a Stanford CCE search (Trachtenberg 1939,
   Kepler-Wallis 1939, Gateless Gate 1934, Trinosophia 1933) · philhine.org.uk serves an expired
   TLS certificate · hermetic.com is a JS-rendering DokuWiki needing a real browser for per-essay
   titles · **magicgatebg.com is a pirate mirror — discovery index only, never cite or ingest.**

---

## 8. Recommended schema for the synthesizer

Carry **two** completeness fields, not one:

- `repoCoverage` — what this repo already records. Verifiable today. (16 complete / 29 partial /
  133 referenced / 1 fragmentary here.)
- `textCompleteness` — the source text's own completeness. **null until an agent evidences it.**

Keeping them apart is what stops a research agent from mistaking "the repo says little" for "the
text says little" — the failure mode that would otherwise contaminate the round's key variable.
