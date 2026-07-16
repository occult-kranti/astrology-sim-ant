# R28 PLAN — THE PRACTICES WING
## `pages/practices/` — the practice-grouped deep dive (practice → author → complete book explained), with the complete mudrā catalogs

**Status:** PLAN ONLY — nothing in this document has been written into the repo.
**Planned by:** research/planning agent, 2026-07-16.
**Builds on (read, verified in-repo):** Great Works (`assets/js/core/data/greatworks.js` — the author→book→chapter pattern, PD discipline, `quoteSafe` flags), the Yoga Sūtras wing (`assets/js/core/data/yogasutra/*`, `pages/yoga/*` — the per-record schema + the inline-SVG posture diagrams in `pages/yoga/theory.html`), abhichara (`core/abhichara.js` — the strictly-academic screen pattern), rasa (`data/rasa-data.js` — `RASA_CAVEAT` + `RASA_TOXICITY`, theory-only), the Confluence atlas (`data/confluence.js` — 9 lanes, `technique` field), the registry anti-drift contract (`core/registry.js` + `scripts/engine-test.mjs`), the mega-menu (`app/shared.js`), the Library (`pages/library/*`).

---

## 0. What this wing is

The Great Works wing answers *"who wrote what?"* (author → book → chapter). The Practices wing is its **transpose**: *"what did people actually DO, and which book defines it?"* (practice group → practice → defining book → complete book explained, chapter by chapter). It is a **museum of practices** — every record is a description of what a historical text instructs, cited to a real edition, never a manual. Its flagship dataset is the **mudrā catalog**: ~60 per-source records across the three distinct mudrā families, each with a generated line-art diagram in the site's existing schematic-SVG style.

**Route:** `pages/practices/` (index + one page per practice group + one page per fully-treated book).
**Nav:** a new mega-menu entry in `app/shared.js` beside Great Works and The Library — proposed group: the "study wings" group that already holds Great Works / Library / Confluence / Yoga.

### 0.1 The locked framing, restated for this wing (non-negotiable)

Inherits the site-wide rule verbatim and adds four wing-specific clauses:

1. **Descriptive voice, always.** Every practice record is written as *"the text instructs its practitioner to…"* / *"the tradition claims…"* — never imperative, never second-person ("you"). An engine-test lint (see §7) greps the data for forbidden openings (`^(Sit|Breathe|Hold|Place|Press|Repeat|Inhale|Exhale|Visualize|Recite)\b`) in `textDescription`/`claimedPurpose` fields to enforce this mechanically.
2. **The standing note on every page** (a `PRACTICES_CAVEAT` constant, pattern of `RASA_CAVEAT`): these are historical religious/esoteric disciplines of **no demonstrated supernatural validity**; physiological claims made by the texts are the texts' claims; nothing here is health, medical, or spiritual advice; the site describes, it never prescribes.
3. **Harm flags are mandatory, not optional.** Where a text instructs something physically dangerous (khecarī's frenulum-cutting, vajrolī, the ṣaṭkarmas' catheters and cloth-swallowing, breath retention, mercury operations), the record carries a `riskNote` rendered as a red-bordered flag BEFORE the textual description — the instruction is presented as *history*, the harm named explicitly, in the exact manner `RASA_TOXICITY` and the mansion-images `HISTORICAL-ONLY` flags already do.
4. **Laboratory alchemy stays theory-only.** The waidan / rasaśāstra / spagyria group page never lists quantities, temperatures, durations, or sequences as extractable procedure; rasaśāstra content LINKS to the existing `pages/rasa.html` rather than duplicating it.
5. **CONTESTED stays contested.** Dating disputes (Gheraṇḍa's date, HYP's compilation), attribution disputes (Svātmārāma), and divergences between texts (HYP khecarī cuts the frenum, Gheraṇḍa's khecarī does not) are flagged with both positions and never resolved — same mechanics as `contested` blocks in `confluence.js` and `flags` in `greatworks.js`.

---

## 1. INFORMATION ARCHITECTURE — the practices taxonomy

Eight practice groups, fixed order. Each group page = (a) what the practice IS (2–3 paragraphs, cited), (b) the defining books table with PD status per book, (c) the practice records themselves (or, for the mudrā group, the catalog browser), (d) the cross-link footer (§6). Groups whose material the site already computes or hosts (7, 8) are **hub pages** that describe + link, not rebuilds.

### Group 1 — `breath-posture` · Breath & posture (prāṇāyāma, āsana, bandha, ṣaṭkarma)

The haṭha corpus. Defining books (all three get the **complete-book chapter treatment**, §2):

| Book | Date | Structure | PD translation (verified) |
|---|---|---|---|
| **Haṭhayogapradīpikā** (Svātmārāma) | 15th c. CE | 4 upadeśas (~389 verses): I āsana, II prāṇāyāma/ṣaṭkarma, III mudrā, IV samādhi/nādānusandhāna | **Pancham Sinh, Pāṇini Office, Allahabad, 1914 — US PD** (pre-1930). Full text mirrored at sacred-texts.com/hin/hyp/ and archive.org. `quoteSafe:true`. |
| **Gheraṇḍa Saṁhitā** | late 17th–early 18th c. CE | 7 lessons (saptasādhana, ~351 verses): 1 ṣaṭkarma, 2 āsana (32), 3 mudrā (25), 4 pratyāhāra, 5 prāṇāyāma, 6 dhyāna, 7 samādhi | **Rai Bahadur Śrīśa Chandra Vasu, Sacred Books of the Hindus vol. XV pt. 2, Pāṇini Office, 1914–15 — US PD.** **VERIFIER CORRECTION (2026-07-16): the archive.org scan `b28140102` (Wellcome copy) is Vasu's EARLIER 1895 Bombay edition ("Tatva-Vivechaka" Press) — also US-PD, but a different edition with potentially different verse numbering. Builders must either locate a genuine SBH XV pt. 2 (1914–15) scan or pin the in-data verse numbering to the 1895 edition actually linked — do not cite one edition while linking the other.** `quoteSafe:true` (both editions PD by age). |
| **Śiva Saṁhitā** | c. 15th–17th c. (contested) | 5 chapters (~545 verses) | **Vasu, SBH XV pt. 1, Pāṇini Office, 1914 — US PD.** `quoteSafe:true`. Modern critical trans. James Mallinson (2007, YogaVidya) — **cite-only**. |

Practice records in this group: the 8 (HYP) / 8 (GS ch.5) kumbhakas as *described practices* (sūryabhedana, ujjāyī, sītkārī, śītalī, bhastrikā, bhrāmarī, mūrcchā, plāvinī — HYP II.44–70), the ṣaṭkarmas (dhauti, basti, neti, trāṭaka, nauli, kapālabhāti — HYP II.21–38; Gheraṇḍa's expanded set, GS ch.1) with **hard riskNotes** (cloth-swallowing, water/air enemas — described as history, flagged as genuinely injurious), and a *pointer* to the 32 Gheraṇḍa āsanas (rendered on the book page, reusing the yoga wing's schematic-figure SVG style). Cross-link: Yoga Sūtras II.46–55 (āsana/prāṇāyāma sūtras already word-by-word on site).
**Modern scholarship (cite-only):** James Mallinson & Mark Singleton, *Roots of Yoga* (Penguin 2017); Mallinson, *The Khecarīvidyā of Ādinātha* (Routledge 2007).

### Group 2 — `mudra` · MUDRĀ — the three families, kept distinct (flagship; full spec §3)

The wing's centerpiece. **Three families that the literature routinely conflates and this site will NOT:**
- **2a. Haṭha-yogic seals** — whole-body/energetic techniques the haṭha texts call mudrā: the Gheraṇḍa Saṁhitā's **25** (GS ch. 3) and the HYP's **10** (HYP III.6–7). These are practices *on* the body (locks, inversions, tongue seals), not hand gestures.
- **2b. Iconographic hand mudrās** — the canonical gestures of Buddhist & Hindu sacred art (dhyāna, bhūmisparśa, dharmacakra, abhaya, varada, añjali…): meanings carried by *statues and paintings*, catalogued by art history. ~15 records.
- **2c. Tantric ritual hand mudrās** — gestures *performed in pūjā/ritual* as acts of offering, invocation and sealing (āvāhanī, dhenu, yoni, matsya, kūrma…), per the Mahānirvāṇa Tantra and the tantric ritual manuals. ~10 records.

Defining sources: GS + HYP as above; **Mahānirvāṇa Tantra**, trans. Arthur Avalon (John Woodroffe), *Tantra of the Great Liberation*, Luzac & Co., London, **1913 — US PD**, `quoteSafe:true`; **Alice Getty, *The Gods of Northern Buddhism*, Clarendon Press, 1914 — US PD** (archive.org, marked out-of-copyright); **Benoytosh Bhattacharyya, *The Indian Buddhist Iconography* (based on the Sādhanamālā), OUP, 1924 — US PD** under the 95-year rule (entered PD 1 Jan 2020; the title-page notice is irrelevant post-expiry — note this in-data). **Cite-only:** E. Dale Saunders, *Mudrā: A Study of Symbolic Gestures in Japanese Buddhist Sculpture* (Bollingen/Princeton 1960); Gudrun Bühnemann, *Pūjā: A Study in Smārta Ritual* (Vienna 1988).

### Group 3 — `mantra-sound` · Mantra & sound (japa · dhikr · the Jesus Prayer as parallel)

Framed explicitly as a **comparative** group: three traditions that independently formalized repetitive short-formula prayer — presented side by side as parallel *historical practices*, with the comparison flagged as the site's own juxtaposition (a modern comparative frame, à la the Confluence atlas), never as a claim of shared origin.

| Practice | Defining book(s) | PD status |
|---|---|---|
| **Japa** (praṇava/mantra repetition) | Yoga Sūtras I.27–29 (already word-by-word on site); the vāra/graha mantra tradition (already in `data/vedic-remedies.js`) | Built — cross-link only |
| **Dhikr** (Sufi remembrance) | al-Ghazālī, *Iḥyāʾ ʿulūm al-dīn* (described via) **Claud Field trans., *The Alchemy of Happiness*, 1909 — US PD**; scholarly treatments (Schimmel, *Mystical Dimensions of Islam* 1975) **cite-only** | Field 1909 `quoteSafe:true` |
| **The Jesus Prayer / hesychast rope-prayer** | ***The Way of a Pilgrim***, trans. **R. M. French, SPCK, 1930 — entered US PD 1 Jan 2026** under the 95-year term. **Verifier note (2026-07-16): first publication 1930 confirmed (SPCK's own catalogue, Wikipedia, archive.org `wayofpilgrim00fren`); the URAA concern is bounded — a URAA-restored foreign work receives the same 95-years-from-publication term, which for 1930 expired 2025-12-31, so US-PD holds on either path. Keep the build-time `accuracy-check` as belt-and-braces; treat as quoteSafe after it.** **The sequel** (*The Pilgrim Continues His Way*, French trans. 1943) — **cite-only until 2039.** The English *Philokalia* (Kadloubovsky–Palmer 1951; Palmer–Sherrard–Ware 1979–95) — **cite-only.** | French 1930: flagged-PD |

**Complete-book treatment:** *The Way of a Pilgrim* (four tales, French 1930) — 4 chapter records. The dhikr and japa entries are practice records + Library cross-links (no full book this round).

### Group 4 — `visualization` · Visualization & imaginal practice

| Practice | Defining book(s) | PD status |
|---|---|---|
| **Shangqing Daoist inner visualization** (cún 存, "actualizing" body gods, sun/moon absorption) | Primary corpus (Huangting jing, Dadong zhenjing) has **no PD English translation** — describe from **cite-only scholarship**: Isabelle Robinet, *Taoist Meditation* (SUNY 1993); Paul Kroll's chapters. Flag honestly: "no quotable PD edition exists; this section is described from cited scholarship, not quoted." | cite-only |
| **Tantric sādhana** (deity generation from the dhyāna verse) | **Sādhanamālā** dhyānas as carried in **Bhattacharyya 1924 (US PD)**; Avalon, *Shakti and Shâkta* (1918, US PD) for the ritual frame | `quoteSafe:true` (Bhattacharyya, Avalon) |
| **Ignatian composition of place** (compositio loci) | **Ignatius of Loyola, *Spiritual Exercises*, trans. Elder Mullan S.J., 1914 — US PD** (sacred-texts, archive.org, ccel mirrors). Exx. 47, 65–71, 112–117 etc. | `quoteSafe:true` |

**Complete-book treatment:** the *Spiritual Exercises* (Mullan 1914) — structured as Annotations (1–20) + Four Weeks + the three methods of prayer + the Rules (discernment, scruples, "thinking with the Church") ≈ 10 chapter records. Framed as a 16th-c. Catholic retreat manual, described historically.

### Group 5 — `concentration-insight` · Concentration & insight (śamatha–vipaśyanā · zuowang · hesychia)

| Practice | Defining book(s) | PD status |
|---|---|---|
| **Śamatha–vipaśyanā** (the 40 kammaṭṭhānas, the jhānas) | **Buddhaghosa, *Visuddhimagga*** — trans. **Pe Maung Tin, *The Path of Purity*, Pali Text Society: Pt I 1923 (US PD), Pt II ("Of Concentration" — the kammaṭṭhāna/jhāna chapters, the ones this wing needs) 1929 (US PD since 1 Jan 2025), Pt III 1931 — NOT US PD until 1 Jan 2027.** Ñāṇamoli's *Path of Purification* (1956/1975) — **cite-only.** | Pts I–II `quoteSafe:true`; Pt III flagged cite-only-until-2027 |
| **Zuowang** ("sitting in oblivion") | Zhuangzi ch. 6 (the Yan Hui dialogue) — **James Legge trans. 1891 (Sacred Books of the East 39) — US PD**; the Tang *Zuowang lun* — English only in Livia Kohn, *Seven Steps to the Tao* (1987) / *Sitting in Oblivion* (2010) — **cite-only** | Legge `quoteSafe:true`; Kohn cite-only |
| **Hesychia** (stillness; the psychosomatic method) | *Way of a Pilgrim* (Group 3, shared); the pseudo-Symeon "Method of Holy Prayer and Attention" — scholarly translations in copyright, **cite-only**; note the 14th-c. Palamite controversy as the historical debate about this very practice | see Group 3 |
| **The Golden Flower circulation-of-light** | *Taiyi jinhua zongzhi* — Wilhelm German 1929 (**US PD since 1 Jan 2025**); **Cary F. Baynes English 1931 — NOT US PD until 1 Jan 2027**; Cleary 1991 cite-only. Already an entry + edges on the Confluence atlas — cross-link. | flagged; describe, quote nothing from Baynes until 2027 |

**Complete-book treatment (phase 4):** *Path of Purity* Part II — the concentration book (Visuddhimagga ch. III–XI): taking a meditation subject, the 10 kasiṇas, the 10 recollections, the brahmavihāras, the jhāna ladder — ~9 chapter records, all describable from the PD 1929 volume.

### Group 6 — `letters-numbers` · Letter & number contemplation (Abulafia · gematria · kamea work)

| Practice | Defining book(s) | PD status |
|---|---|---|
| **Abulafian letter-permutation** (ḥokhmat ha-tseruf, ḥazkarah) | Abraham Abulafia, *Ḥayyei ha-Olam ha-Ba* / *Or ha-Sekhel* — **no PD English translation exists**; Hebrew editions & Jellinek's 19th-c. German excerpts are PD but untranslated. Describe from **cite-only** scholarship: Moshe Idel, *The Mystical Experience in Abraham Abulafia* (SUNY 1988); Scholem, *Major Trends* (1941 — **not** US PD until 2037). Flag the gap honestly. | cite-only |
| **Gematria / notariqon / temurah** | Agrippa, *Three Books* III (1651 Eng. — PD, already the basis of `pages/kabbalah.html`'s computed gematria) | built — cross-link |
| **Sefer Yetzirah contemplation** | **W. Wynn Westcott trans., 1887 — US PD**; Isidor Kalisch 1877 — US PD | `quoteSafe:true` |
| **Kamea work** (magic-square derived seals) | Agrippa II.22 — already computed at `pages/picatrix/kameas.html` | built — cross-link |

**Complete-book treatment (phase 5):** *Sefer Yetzirah* (Westcott 1887, 6 chapters) — with the recension problem (Short/Long/Saadian) flagged CONTESTED.

### Group 7 — `lab-alchemy` · Laboratory alchemy — waidan · rasaśāstra · spagyria (THEORY-ONLY hub)

Described with toxicity notes, **never operationalized** — the `RASA_TOXICITY` pattern extended West and East:
- **Waidan** (Chinese external alchemy; the Baopuzi's elixir chapters) — Ge Hong via James Ware trans. (1966) **cite-only**; Fabrizio Pregadio, *Great Clarity* (2006) **cite-only**. Records: the cyclically-transformed elixir idea, the huandan claim, and the documented historical elixir-poisoning of Tang emperors (cited to Needham SCC vol. V — cite-only) as the harm flag.
- **Rasaśāstra** — LINK ONLY to the existing `pages/rasa.html` (the 18 saṃskāras + apparatus already built, cited to P.C. Ray 1902/1909 PD). No duplication.
- **Spagyria** (Paracelsian plant/mineral alchemy) — **A. E. Waite, *The Hermetic and Alchemical Writings of Paracelsus*, 2 vols., 1894 — US PD**, `quoteSafe:true`; describe the tria prima frame and the archidoxes' "quintessence" operations as history; mercury/antimony/lead preparations carry the toxicity flag.
Cross-links: `pages/chronology/alchemy.html`, Confluence `alchemy-west` + `daoist` + `tantra-rasa` lanes.

### Group 8 — `talismanic-astral` · Talismanic & astral ritual (COMPUTED hub)

The one group the site already *computes*: Picatrix elections (`pages/picatrix/election.html` + `core/election.js`), the Talisman Workshop, kameas, planetary prayers (described), mansion images, abhichara screens. This group page is a **short curatorial essay + link table**: what an "astral ritual" was claimed to be (Picatrix I–II frame), which parts are arithmetic (elections — computed) vs. ritual (prayers, suffumigations — described-only), and where each lives on the site. New records: none. Effort: small.

### Taxonomy notes

- **Practice-first ⇄ author-first symmetry:** every book row above that also exists in Great Works or the Library gets a bidirectional link (§6). Books treated chapter-by-chapter in THIS wing (HYP, GS, ŚS, Way of a Pilgrim, Spiritual Exercises, Path of Purity II, Sefer Yetzirah, Mahānirvāṇa Tantra) live under `pages/practices/` because their organizing identity here is the practice, not the author — Great Works pages link across rather than duplicate.
- Groups deliberately excluded this round (candidates for later): divinatory practice (already its own wings), sweat/ordeal practices, Ignatian examen as separate from Group 4, Kabbalistic yiḥudim.

---

## 2. THE COMPLETE-BOOK PATTERN (reused from Great Works)

Each fully-treated book = one page `pages/practices/<book-id>.html` + one data module `assets/js/core/data/practices/book-<id>.js` following the `greatworks.js` work schema exactly:

```js
{ id, title, titleOriginal, date, dateContested|null, unit: 'Lesson'|'Upadeśa'|'Week'|'Chapter'|'Tale',
  edition,             // the exact PD edition string, e.g. 'Trans. Pancham Sinh, Pāṇini Office, Allahabad, 1914.'
  quoteSafe: true|false,
  pdStatus,            // the verified PD reasoning, greatworks-style
  pdSources: [{path,label}...],   // CITATION links (archive.org, sacred-texts, wisdomlib) — never fetched assets
  flags: [...],        // unresolved issues, kept flagged
  practiceNote,        // the group-level framing sentence for this book
  chapters: [ { ref, title, gist,          // 2-4 sentence chapter explanation
                practices: ['mudra:gs-khecari', ...],  // ids of practice/mudrā records defined in this chapter
                riskNote|null, flag|null,
                siteMapping: [{path,label}] } ] }
```

Chapter counts planned: HYP 4 upadeśas (rendered as 4 chapter records with verse-range sub-blocks, ~16 sub-blocks total) · Gheraṇḍa 7 lessons · Śiva Saṁhitā 5 chapters · Way of a Pilgrim 4 tales · Spiritual Exercises ~10 divisions · Path of Purity II ~9 chapters · Sefer Yetzirah 6 chapters · Mahānirvāṇa Tantra 14 chapters. The renderer is a parameterized clone of `app/greatworks.js`'s work-page renderer (same card/accordion components, DS2 tokens, `.filterbar` search).

**Vajrolī clause (build rule):** HYP III.83–103 (vajrolī/sahajolī/amarolī) is sexually explicit and physically dangerous; Pancham Sinh himself left portions untranslated "for moral reasons" — the chapter record states exactly that (a fact about the 1914 edition, itself historically interesting), summarizes at one-sentence altitude, carries a riskNote, and quotes nothing.

---

## 3. MUDRĀ CATALOG SPEC

### 3.1 Data modules

```
assets/js/core/data/practices/mudra.js        — the ~60 records, PURE DATA, cited per record
assets/js/core/practices.js                   — pure lookups: mudraById, mudrasByFamily,
                                                 searchPractices, practiceGroups, crosswalk  (no DOM)
assets/js/app/practices.js                    — renderer (catalog browser, filters, cards)
assets/js/app/practices-art.js                — the SVG diagram builders (DOM layer; see 3.4)
pages/practices/mudra.html                    — the catalog page (family tabs + search + crosswalk table)
```

### 3.2 Per-mudrā record schema

```js
{
  id: 'gs-khecari',                    // family-prefixed slug
  name: 'Khecarī Mudrā',
  iast: 'khecarī mudrā',
  devanagari: 'खेचरीमुद्रा' | null,     // where the source supplies it; not required for iconographic
  family: 'hatha-gheranda' | 'hatha-hyp' | 'iconographic' | 'tantric-ritual',
  sourceText: 'Gheraṇḍa Saṁhitā',       // + edition via `cite`
  sourceRef: 'GS 3.25–27',              // chapter.verse, per the cited edition's numbering
  textDescription: '…',                 // what the text instructs, DESCRIPTIVE voice, after the PD translation
  claimedPurpose: '…',                  // the purpose THE TRADITION claims — always attributed ("the text claims…")
  textCautions: '…' | null,             // contraindications/warnings THE TEXTS THEMSELVES state (e.g. HYP II.15-17
                                        //   on wrongly-performed prāṇāyāma; GS dietary restrictions)
  riskNote: '…' | null,                 // the site's OWN harm flag where texts/scholarship document danger
                                        //   (khecarī frenum-cutting, vajrolī, basti) — rendered first, red-bordered
  image: { kind: 'svg', artId: 'khecari' }                                  // generated line-art (3.4), AND/OR
         | { kind: 'museum', href, label, museum: 'Met'|'CMA', accession, license: 'CC0' } | null,
  crosswalk: ['hyp-khecari'],           // same-named records in other families/texts
  contested: null | { flag, positions: [{source, value}] },
  cite: '…'                             // full edition citation string
}
```

### 3.3 The census — ~60 records

**Family 2a-i — Gheraṇḍa Saṁhitā, ch. 3: the 25 mudrās (GS 3.1–3 name-list; each then defined in the chapter).** One record each:
mahāmudrā · nabho-mudrā · uḍḍīyāna-bandha · jālandhara-bandha · mūlabandha · mahābandha · mahāvedha · khecarī · viparītakaraṇī · yoni-mudrā · vajroṇī (vajrolī) · śakticālanī · tāḍāgī · māṇḍukī · śāmbhavī · the pañca-dhāraṇā five (pārthivī · āmbhasī · āgneyī/vaiśvānarī · vāyavī · ākāśī) · aśvinī · pāśinī · kākī · mātaṅgī · bhujaṅginī. *(Name list and verse refs to be pinned against the Vasu 1914–15 edition at build via `accuracy-check` — GS verse numbering varies slightly between editions; keep Vasu's numbering as canonical in-data, flag divergences.)*

**Family 2a-ii — Haṭhayogapradīpikā, ch. III: the 10 (HYP III.6–7).** One record each:
mahāmudrā · mahābandha · mahāvedha · khecarī · uḍḍīyāna-bandha · mūlabandha · jālandhara-bandha · viparītakaraṇī · vajrolī · śakticālana.
Nine names overlap Gheraṇḍa's list — **deliberately kept as separate per-source records** (each family stores its own text's description verbatim-derived), joined by `crosswalk`, and surfaced in a rendered **crosswalk table** whose star exhibit is khecarī: *HYP III.32–37 instructs cutting the frenum "a hair's breadth at a time" with a snuhī-leaf-shaped blade over months; the Gheraṇḍa's khecarī omits the cutting* (per Mallinson's khecarī scholarship) — riskNote on both records, divergence in `contested`.

**Family 2b — Iconographic hand mudrās (~15).** Sources: Getty 1914 (PD), Bhattacharyya 1924 (PD), Saunders 1960 (cite-only naming authority for the Japanese forms), Met/CMA object records:
dhyāna (samādhi) · bhūmisparśa · dharmacakra-pravartana · abhaya · varada · vitarka · añjali (namaskāra — one record, both usages noted) · uttarabodhi · tarjanī · karaṇa · vajra/bodhyaṅgī (the Vairocana fist) · jñāna/cin-mudrā (the Hindu/yogic teaching gesture — distinct from vitarka, note the conflation) · kaṭaka-hasta · gaja-hasta (daṇḍa-hasta) · vismaya. For these, `sourceRef` cites the iconographic handbook page/plate (e.g. "Getty 1914, pp. xxx–xxxii + pl. …") and, where used, a museum object ("Met 38965, Gupta Buddha in abhaya-mudrā"). `claimedPurpose` = the iconographic meaning as the handbooks state it; `textCautions`/`riskNote` = null (gestures in art carry no physical risk — the fields render only when present).

**Family 2c — Tantric ritual mudrās (~10).** Anchor edition: Mahānirvāṇa Tantra trans. Avalon 1913 (the pūjā chapters, esp. ch. V–VI, + Avalon's introduction §Mudrā, which enumerates the worship gestures). Candidate set to pin at build with `accuracy-check` against the 1913 text:
āvāhanī (invoking) · sthāpanī (installing) · sannidhāpanī (bringing-near) · sannirodhinī (detaining) · sammukhīkaraṇī (facing) · dhenu (the cow, for nectar-transformation) · matsya (fish) · kūrma (tortoise) · yoni (the ritual yoni — a **separate record** from GS yoni-mudrā, crosswalked with an explicit "same name, different practice" note) · galinī or the añjali-of-offering (final pick per what the 1913 text actually enumerates with a citable verse — do not pad the count; if the text yields 8 well-cited records, ship 8).

**Total: 25 + 10 + ~15 + ~10 ≈ 60 records.** Engine-test asserts exact counts per family once pinned.

### 3.4 Image strategy

**Primary — generated line-art in the site's existing style.** Precedent verified: `pages/yoga/theory.html` renders seated postures as inline schematic SVGs — `viewBox="0 0 120 140"`, stroke-only figures (circle head + line/path limbs), `role="img"` + a descriptive `aria-label`. The mudrā catalog extends this with two parameterized builders in `app/practices-art.js` (app layer — SVG is presentation; `core/` stays DOM-free and the data module stores only `artId`):
- **`bodyFigure(spec)`** — the yoga-wing stick figure, for the haṭha seals (viparītakaraṇī = inverted figure; mahāmudrā = seated, one leg extended, forward fold; uḍḍīyāna = torso with drawn-in abdomen arc; khecarī = head profile with tongue-to-palate arc — schematic, deliberately non-instructional).
- **`handFigure(spec)`** — a new hand template for families 2b/2c: a palm outline + five digit strokes, each digit independently `straight | folded | touching(thumb)`, plus wrist orientation (up/down/facing) and a paired-hands mode (añjali, dhyāna, dharmacakra). ~15 named specs cover family 2b; family 2c reuses it with paired/interlocked variants where drawable, and falls back to `image:null` + text-only where a gesture is too complex to draw honestly (dhenu's interlaced fingers may be one — an honest "not diagrammed" note beats a wrong diagram).
- All diagrams: `currentColor` strokes (theme-safe), no animation (reduced-motion-first is trivially met), every `aria-label` written as a *description of the diagram*, not an instruction.
- Each SVG caption carries: "Schematic diagram generated for this site — not from the source text."

**Secondary — PD museum iconography as CITATIONS (family 2b).** Both the Met (Open Access, 2017) and the Cleveland Museum of Art (Open Access, 2019) release public-domain object images under **CC0**. Per the repo's locked `pdSources` discipline ("citations, never fetched assets") and the offline-first rule, phase 1–2 ships these as **cited links** on the record card (museum, object title, accession number, URL) — e.g. Met 38965 (Gupta Buddha offering protection, abhaya-mudrā); Met 38198 (Mathurā standing Buddha); CMA 1973.15 (Dvāravatī Buddha). **Optional later decision (flagged, not assumed):** vendor ≤15 small CC0 JPEG thumbnails into `assets/img/mudra/` with a `CREDITS.md` (CC0 legally permits local copies) — but this changes the repo's zero-binary-assets character, so it needs the maintainer's explicit sign-off; the plan's default is cite-only links.

### 3.5 Catalog page UX (`pages/practices/mudra.html`)

Family tabs (the four families, never merged) → record cards: name + IAST (+ Devanāgarī where sourced), the SVG diagram, riskNote-first ordering, textDescription, claimedPurpose ("the text claims…"), textCautions, source + verse chip, crosswalk chips, museum citation links. A `.filterbar` search over name/IAST/description (reusing the DS2 components the yoga wing migrated to). The crosswalk table (GS↔HYP nine shared seals) renders below the haṭha families. The standing `PRACTICES_CAVEAT` renders at top, khecarī-class records additionally carry the red flag block.

---

## 4. DATA & CODE LAYOUT (invariant-compliant)

```
assets/js/core/data/practices/
  index.js            — PRACTICE_GROUPS (8 groups: id, name, glyph, lede, books[], crossLinks), PRACTICES_CAVEAT, citations
  mudra.js            — the mudrā catalog (§3)
  practices-records.js— non-mudrā practice records (kumbhakas, ṣaṭkarmas, dhikr, Jesus Prayer, kammaṭṭhāna summary rows…)
                        same record shape as mudrā minus family/image
  book-hyp.js, book-gheranda.js, book-shiva.js, book-pilgrim.js, book-exercises.js,
  book-purity2.js, book-yetzirah.js, book-mahanirvana.js        — complete-book modules (§2), phased
assets/js/core/practices.js   — pure lookups/search (Node-testable, no DOM/Date/random)
assets/js/app/practices.js    — page renderers (group page, book page, catalog)
assets/js/app/practices-art.js— SVG builders (§3.4)
assets/css/practices.css      — wing CSS (pattern: yoga.css — loaded after style.css, DS2 tokens only)
pages/practices/
  index.html          — the wing hub: the 8 groups as cards, the standing caveat, the how-it-works block
  <group>.html        — 8 group pages (breath-posture, mudra, mantra-sound, visualization,
                        concentration-insight, letters-numbers, lab-alchemy, talismanic-astral)
  <book>.html         — one page per fully-treated book (phased)
```

Rules honored: no build step; relative imports; chrome via `mountChrome`; **no hard-coded absolute paths**; `core/**` pure (engine-test runs it under Node); DOM only in `app/**`; data cited in-file with discrepancies flagged; reuse `app/greatworks.js` renderer patterns and the DS2 `.filterbar`/`.seg`/card components rather than invent new ones.

---

## 5. REGISTRY · GLOSSARY · ASSISTANT · TESTS (the per-tool integration contract)

**Registry** (`core/registry.js`) — one new entry, modeled on the existing `yoga-sutras` reference entry:
```
id: 'practices', title: 'The Practices wing (museum of practices + mudrā catalog)',
module: 'assets/js/core/practices.js', exportName: 'searchPractices',
exports: ['mudraById', 'mudrasByFamily', 'practiceGroups', 'crosswalk'],
callable: true,
inputs: [ {name:'q', type:'string'}, {name:'group', type:'enum', values:[8 group ids]},
          {name:'family', type:'enum', values:[4 mudrā families]} ],
outputShape: '{ hits:[{id,name,group,family?,sourceText,sourceRef,claimedPurpose,riskNote?}], caveat }',
citation: PRACTICES_CITATION, pages: ['pages/practices/index.html','pages/practices/mudra.html'],
howItWorks: 'pages/practices/index.html#hiw-practices', glossaryTerms: [see below]
```
The tool's output **always carries the caveat string** (the pattern `vedic` practice output already uses), so the assistant repeats the framing when answering.

**Assistant** (`core/llm-context.js`) — register `search_practices` as a callable tool (auto via `buildToolSchema()` once the registry entry exists — verify the callable list `'…castRunes', 'confluence_atlas'` includes it); its description states "historical practice, described never prescribed" exactly as the `vedic` practice tool's description already does. The assistant system framing (§578-style section) gains one line for the wing.

**Glossary** (`data/glossary.js`, cat: 'Practices') — new terms (each must exist because registry `glossaryTerms` is engine-test-asserted): Mudrā · Bandha · Prāṇāyāma · Kumbhaka · Ṣaṭkarma · Khecarī Mudrā · Haṭha Yoga · Japa · Dhikr · Jesus Prayer / Hesychasm · Kammaṭṭhāna · Śamatha & Vipaśyanā · Zuowang · Composition of Place · Sādhana · Gematria (exists — extend `see`) · Spagyria · Waidan.

**Engine-test** (`scripts/engine-test.mjs`) additions:
1. counts: mudrā records per family = the pinned census (25/10/15/10 or as pinned); total ≥ 58;
2. schema: every record carries non-empty `cite`, `sourceRef`, `claimedPurpose`; `family` ∈ enum; ids unique;
3. crosswalk integrity: every `crosswalk` id resolves; GS↔HYP shared-name pairs all crosswalked;
4. **descriptive-voice lint** (§0.1) over `textDescription`/`claimedPurpose`;
5. riskNote presence asserted for the known-dangerous ids (gs-khecari, hyp-khecari, hyp-vajroli, gs-vajroni, the basti/dhauti records);
6. every `siteMapping`/crossLink path resolves against `pages/` (the existing greatworks smoke-test pattern);
7. registry anti-drift picks up the new entry automatically (exports exist, pages resolve, glossary terms real).
**Verify gate:** run the `verify-site` skill (per `memory/verify-gate-env.md`) — every new page loads with 0 console errors + chrome injected.

---

## 6. CROSS-LINKS (each practice → its books → its lane → its tool)

Per practice-group page, a standing "Where this lives on the site" footer table:

| Group | Great Works / Library | Confluence lane(s) | Computed tool |
|---|---|---|---|
| breath-posture | Library → indian shelf; (HYP/GS/ŚS book pages live in this wing) | `yoga-vedanta` | — (Yoga Sūtras wing = the study tool) |
| mudra | Library indian shelf; Getty/Bhattacharyya added to Library esoteric/indian shelves | `yoga-vedanta`, `tantra-rasa`, `buddhist` | — |
| mantra-sound | Library western+esoteric (Way of a Pilgrim, Field's Ghazālī added) | `christian`, `islamic`, `yoga-vedanta` | `vedic` daily-practice panel (mantra/japa — computed, described) |
| visualization | Great Works → hermetica (contemplative-ascent parallel, CH XIII); Library | `daoist`, `buddhist`, `christian` | — |
| concentration-insight | Library; Confluence golden-flower entries | `buddhist`, `daoist`, `christian` | — |
| letters-numbers | Great Works → agrippa; Library esoteric | `kabbalah` | `kabbalah.html` gematria + `picatrix/kameas.html` (both computed) |
| lab-alchemy | Great Works → hermetica/agrippa; `chronology/alchemy.html`; `rasa.html` | `alchemy-west`, `daoist`, `tantra-rasa` | rasa yantra-math layer (computed) |
| talismanic-astral | Great Works → agrippa; `picatrix/*` | `alchemy-west` (Picatrix entry) | election engine, talisman workshop, moment scanner — **all computed** |

Reciprocal edits (small, surgical): Great Works author pages gain "practices described in this book" chips where a book overlaps (hermetica ↔ visualization); the Library shelves gain the new PD editions as entries; the Confluence atlas entries for HYP/Gheraṇḍa/Visuddhimagga/Way-of-a-Pilgrim-adjacent nodes gain `siteLink` values pointing into `pages/practices/` (the `siteLink` field already exists, mostly null — do NOT regenerate confluence data by hand; follow its DO-NOT-HAND-EDIT note and patch via its generator or an additive override map read by the app layer — **decision for the builder, flagged**).

---

## 7. PHASING & EFFORT (each phase ends green on `verify-site` + engine-test)

| Phase | Scope | New files | Effort (Opus-coder) |
|---|---|---|---|
| **P1 — Shell + haṭha mudrās** | Wing hub, taxonomy data (`index.js`), the mudrā catalog page with families 2a-i + 2a-ii (35 records, all with `bodyFigure` SVGs), crosswalk table, registry/glossary/assistant/engine-test integration, mega-menu entry | ~8 files | **L** (the accuracy-check passes on 35 verse refs dominate) |
| **P2 — The full catalog** | Families 2b + 2c (~25 records), `handFigure` builder, museum CC0 citation links, family tabs complete | ~3 files | **M** |
| **P3 — The haṭha books** | `book-hyp.js` + `book-gheranda.js` + pages (complete chapter-by-chapter), breath-posture group page with kumbhaka/ṣaṭkarma records + risk flags; Śiva Saṁhitā if budget allows | ~6 files | **L** |
| **P4 — Contemplative groups** | mantra-sound, visualization, concentration-insight group pages; *Way of a Pilgrim* (pending the P1-scheduled PD re-verification), *Spiritual Exercises*, *Path of Purity II* book pages | ~8 files | **L** |
| **P5 — Letters, lab, astral + closure** | letters-numbers, lab-alchemy, talismanic-astral hub pages; *Sefer Yetzirah* + *Mahānirvāṇa Tantra* book pages; reciprocal Great Works/Library/Confluence link edits; COVERAGE.md/ROADMAP.md updates | ~7 files | **M** |

Total ≈ 4 L + 2 M ≈ a full round (R28) with P4/P5 spillover acceptable into R29. Every phase independently shippable.

---

## 8. RISKS & OPEN QUESTIONS (kept flagged for the builder)

1. **PD edge cases (highest risk).** (a) *Way of a Pilgrim* French 1930: 95-year US term puts it PD 1 Jan 2026, but it's a UK (SPCK) publication — run `accuracy-check` on URAA/renewal before quoting; ship describe-only if unresolved. (b) *Path of Purity* Pt III (1931) and Baynes's *Golden Flower* (1931): **not** US PD until 1 Jan 2027 — data modules must carry per-volume `quoteSafe` flags, and P4 must not quote either. (c) Bhattacharyya 1924 carries a copyright notice but is 95-years-expired — record the reasoning in `pdStatus`.
2. **Verse-numbering drift.** GS and HYP verse numbers differ across editions (Vasu vs. Adyar vs. modern critical). Rule: the cited PD edition's numbering is canonical in-data; divergences noted per-record — same discipline as the Yoga Sūtras wing's 194/195/196 handling.
3. **Tantric family census.** The Mahānirvāṇa Tantra's exact enumerated worship-mudrā set must be pinned from the 1913 text itself (Avalon's introduction + pūjā chapters); do not pad to 10 if the citable set is smaller.
4. **Explicit/dangerous content** (vajrolī; khecarī; ṣaṭkarma instruments). Handled by §0.1 clauses 1–3 and the §2 vajrolī clause; the abhichara wing proves the site can carry darker material academically — reuse its tone.
5. **Sensitive living traditions.** Iconographic and tantric mudrās are living religious practice; the museum frame plus attributed claims ("the tradition holds…") is the mitigation — never parody, never endorse.
6. **No-PD-translation gaps** (Shangqing corpus, Abulafia). The honest move is an explicit "no quotable PD edition exists" note + cite-only scholarship — a *feature* of the wing's honesty, not a hole to paper over.
7. **Confluence data is generated** — its `siteLink` additions need the generator route or an app-layer override; decide at build (flagged in §6).
8. **Binary assets decision** — CC0 thumbnails in-repo vs. cite-only links (§3.4); default cite-only pending maintainer sign-off.

---

## 9. SOURCES CONSULTED FOR THIS PLAN (web, 2026-07-16)

- Gheraṇḍa Saṁhitā, Vasu trans.: [archive.org/details/b28140102](https://archive.org/details/b28140102) — **verifier note 2026-07-16: this scan is the 1895 Bombay ("Tatva-Vivechaka" Press) first edition of Vasu's translation, NOT the 1914–15 SBH XV pt. 2 printing (both US-PD; see §1 correction)** · [Wellcome record](https://wellcomecollection.org/works/xvh3z8ex) · [Wikipedia — 32 āsanas / 25 mudrās structure](https://en.wikipedia.org/wiki/Gheranda_Samhita)
- Haṭhayogapradīpikā, Pancham Sinh trans. 1914: [sacred-texts.com/hin/hyp/](https://sacred-texts.com/hin/hyp/index.htm) · ch. III mudrā list + khecarī frenum-cutting: [sacred-texts hyp05](https://www.sacred-texts.com/hin/hyp/hyp05.htm) · [wisdomlib title page](https://www.wisdomlib.org/hinduism/book/hatha-yoga-pradipika-english/d/doc7971.html)
- Mahānirvāṇa Tantra, Avalon trans. 1913 (Luzac): [archive.org](https://archive.org/details/TheGreatLiberationMahanirvanaTantraArthurAvalon) · [Wellcome record](https://wellcomecollection.org/works/a2nrx4rv)
- Getty, *The Gods of Northern Buddhism* (1914, PD): [archive.org/details/godsofnorthernbu00gettrich](https://archive.org/details/godsofnorthernbu00gettrich); Bhattacharyya, *The Indian Buddhist Iconography* (1924): [archive.org/details/indianbuddhistic00bhat](https://archive.org/details/indianbuddhistic00bhat)
- *The Way of a Pilgrim*, R. M. French 1930: [Wikipedia](https://en.wikipedia.org/wiki/The_Way_of_a_Pilgrim) · [archive.org](https://archive.org/details/wayofpilgrim00fren)
- Visuddhimagga / *Path of Purity*, Pe Maung Tin, PTS 1923/1929/1931: [Pali Text Society](https://palitextsociety.org/product/the-path-of-purity/) · [archive.org vol. 1](https://archive.org/details/pathofpuritybein01budduoft) · vol. 2 (1929) scan via phuocson.org
- *Spiritual Exercises*, Mullan trans. 1914 (PD): [sacred-texts](https://sacred-texts.com/chr/seil/seil00.htm) · [archive.org](https://archive.org/details/TheSpiritualExercisesIgnatius)
- Museum open access (CC0): [Met Open Access](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access) · [CMA Open Access](https://www.clevelandart.org/open-access) · [Creative Commons on CMA CC0 (2019)](https://creativecommons.org/2019/01/23/cleveland-museum/) · example objects: [Met 38965](https://www.metmuseum.org/art/collection/search/38965), [Met 38198](https://www.metmuseum.org/art/collection/search/38198), [CMA 1973.15](https://www.clevelandart.org/art/1973.15)
