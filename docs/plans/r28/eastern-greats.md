# R28 PLAN — THE EASTERN GREATS expansion
### People-and-books depth for the Eastern traditions, mirroring the Great Works wing

**Status:** PLAN ONLY — nothing in this document has been written into the repo.
**Prepared:** 2026-07-16, by fan-out web research + repo audit. Every licensing verdict below is either
(a) verified against a named source this round, (b) derived from the stated US/India term rules with the
derivation shown, or (c) explicitly flagged `UNVERIFIED — builder must check`. A verifier should attack
the flags first; they are the honest edges.

---

## 0. What exists already (repo audit, so the builder doesn't duplicate)

| Asset | Path | Relevant contents |
|---|---|---|
| Great Works wing | `assets/js/core/data/greatworks.js` + `pages/greatworks/*.html` | 8 Western authors (Hall, Hermes, Crowley, Dee, Agrippa, Lévi, Ficino, Iamblichus, Regardie). Record shape: `{id, name, dates, glyph, who, line, siteLinks, studyPath[], works:[{id, title, subtitle, year, unit, edition, quoteSafe, pdStatus, pdSources[], flags[], spellsMagic[], chapters:[{ref, title, gist, siteMapping[], flag?, toolsCharts?}]}]}` plus `GW_CITATION` / `GW_METHOD_NOTE`. |
| Practitioners' Library | `assets/js/core/data/practitioners.js` | Already has Library records for: Parāśara (attrib.), Varāhamihira, Kalyāṇa Varma, Vaidyanātha Dīkṣita, Mantreśvara, B. V. Raman, K. N. Rao, Jaimini-school moderns (Sanjay Rath, Foss, Rangāchārya), Pṛthuyaśas, Rāma Daivajña, Nīlakaṇṭha, yoga/rasa scholars (Mallinson & Singleton, Birch, Maas, D. & D. Wujastyk, White, Bühnemann), Wilhelm/Baynes and Legge (I Ching). Tier vocab: canon/respected/niche/academic. |
| Yoga Sūtras wing (full) | `pages/yoga/*` + `assets/js/core/data/yogasutra/` | Complete sūtra-by-sūtra treatment. Patañjali is DONE — excluded from this catalog. |
| Practices entries | `rasa-data.js`, `abhichara-data.js`, HYP/Gheraṇḍa entries, `vedic-*`, `prasna-data.js` (cites Bṛhat Jātaka II.5 Aiyar/Sastri and Praśna Mārga Raman trans.), `kuta-data.js`, `muhurta-data.js`, `tajika-data.js` | Eastern *practice* data exists; *people-and-books* depth does not. |
| Confluence atlas | `assets/js/core/data/confluence.js` (188 entries) | Person entries EXIST for: `person-nagarjuna`, `person-nagarjuna-siddha` (disambiguated, contested block), `person-ge-hong`, `person-shankara`, `person-matsyendranatha`, `person-abhinavagupta`, `person-gorakhnath`, `person-longchenpa`. Text/event entries EXIST for: `visuddhimagga`, `wuzhen-pian`, `bardo-thodol`, `hathayogapradipika`, `gheranda-samhita`, `secret-of-the-golden-flower`, `event-golden-flower-1929`, `tibetan-book-of-the-dead`, `autobiography-of-a-yogi`, `event-chicago-1893` (Vivekananda at the Parliament). NO person entries yet for: Buddhaghosa, Varāhamihira, Parāśara, Jaimini, Kalyāṇavarman, Mantreśvara, Vaidyanātha, Kṣemarāja, Svātmārāma, Milarepa, Tsongkhapa (mentions only — verify), Dōgen (mention only), Kūkai, Hakuin, Zhang Boduan (text exists, person doesn't), Liu Yiming, Vivekananda (event only), Yogananda (book only), Sivananda, Aurobindo, Ramana, Śāntideva, Padmasambhava/Karma Lingpa (books only), Gopi Krishna, Kazi Dawa-Samdup. |
| Evans-Wentz overlay flag | R27 | The Theosophical-overlay hazard on Evans-Wentz volumes is already flagged in-data; reuse that flag text, don't restate differently. |

---

## 1. Method & licence rules used throughout (copy into the module's METHOD_NOTE)

1. **US 95-year rule:** anything first published **1929 or earlier** is US public domain now (2026).
   Publications of **1930** entered US PD 2026-01-01; **1931** publications enter US PD **2027-01-01**.
2. **US renewal rule (1930–1963 US publications):** PD earlier if copyright was not renewed — every such
   verdict below requires a **Stanford Copyright Renewal Database / CCE search logged in-data**, exactly as
   `greatworks.js` did for STOAA.
3. **URAA restoration (foreign works):** a work first published abroad 1930+, still in copyright in its
   source country on **1996-01-01**, had US copyright restored to the full 95-year term, *no renewal needed*.
   This is the trap for Indian publications of the 1930s–50s: "no US formalities" does NOT make them PD.
4. **India:** term is **life + 60** (Copyright Act 1957 as amended 1992). Aurobindo & Ramana (d. 1950) → PD
   in India since **2011-01-01**; Sivananda (d. 14 July 1963) → PD in India since **2024-01-01**. India-PD
   does not make a work quote-safe for a US-hosted site; record both statuses.
5. **Free-to-read ≠ public domain:** DLS (Sivananda), BPS (Ñāṇamoli), Sri Ramanasramam, Shasta Abbey
   (Nearman's Shōbōgenzō) all give away PDFs while retaining copyright. Treat as **cite-only**, link as
   `pdSources`-style *citations* with an explicit "free download, © retained" label.
6. **quoteSafe discipline** identical to `greatworks.js`: `quoteSafe:true` only for verified US-PD
   editions; everything else cite-only, described never quoted, no images.
7. **Honest-science framing (LOCKED):** every figure below carries a `hazards` note — miracle claims are
   *claims*, hagiography is *hagiography*, living organizations' doctrinal positions are *positions*,
   contested dates get a `contested` block with both positions and no resolution.

**PD-flip calendar (build a small `pdCalendar` export so future rounds auto-upgrade):**

| Date | What flips to US PD |
|---|---|
| 2027-01-01 | *Secret of the Golden Flower* (Baynes English, 1931); *Path of Purity* vol. III (1931); B. V. Narasimha Swami, *Self Realization* (1931) |
| 2028-01-01 | *Jātaka Pārijāta* trans. Sastri vol. I (1932) |
| 2029-01-01 | Sastri *Jātaka Pārijāta* vol. II (1933) |
| 2030-01-01 | Bagchi's Sanskrit ed. of *Kaulajñānanirṇaya* (1934) |
| 2031-01-01 | Evans-Wentz, *Tibetan Yoga and Secret Doctrines* (1935) |
| 2033-01-01 | *Phaladīpikā* trans. Sastri 1st ed. (1937 — year itself flagged, see §2.4) |
| 2034-01-01 | Leidecker's *Pratyabhijñāhṛdayam* (Adyar, 1938); Briggs, *Gorakhnāth and the Kānphaṭa Yogīs* (1938) |
| 2035/2036 | *The Life Divine* revised book edition (1939/1940) |

---

## 2. THE RANKED CATALOG — 25 individuals

Ranking = **value to the site × licence-cleanliness** (a figure with a clean, verified PD edition that maps
onto existing engines outranks a more famous figure who is cite-only). Tiers:
**(A)** Great Works chapter-by-chapter wing page · **(B)** Library record + cite-only ·
**(C)** Practices-wing book treatment · **(D)** Confluence-atlas entry/edges only.

### CLUSTER I — Classical jyotiṣa

#### 1. Varāhamihira — TIER A (flagship of the whole expansion)
- **Dates:** c. 505 – 587 CE, Ujjain (traditional death date Śaka 509 = 587 CE; flag as traditional).
- **Why:** the one classical Indian author with TWO independently verified US-PD English translations of his
  natal masterwork, whose content the site already *computes* (praśna, muhūrta, the vedic wing) and already
  *cites* (`prasna-data.js` quotes Bṛhat Jātaka II.5 in both translations). Highest value, cleanest licence.
- **Works:**
  1. **Bṛhajjātaka** (c. 550 CE). Best PD editions — BOTH quote-safe:
     - N. Chidambaram Iyer, *The Brihat Jataka of Varaha Mihira*, Madras, **1885** (2nd ed. 1905) — **US PD** (pre-1930). Scan: archive.org `wg1079` ("1885 - The Brihat Jataka Of Varaha Mihira").
     - V. Subrahmanya Sastri, *Varahamihira's Brihat Jataka*, Government Branch Press, Mysore, **1929** —
       **US PD as of 2025-01-01** (95-year rule; URAA-restored term also expired). HathiTrust record 006938775; archive.org `BrihatJataka2ndEd.ByVSubrahmanyaSastri` (2nd ed. — cite the 1929 1st ed. for PD quotes; 2nd-ed year must be checked before quoting from that scan).
     - Cite-only comparison ed.: P. S. Sastri reprints; modern eds.
  2. **Bṛhat Saṁhitā** (encyclopedic omens/mundane). PD edition: N. Chidambaram Iyer, 2 vols, Madura/Madras,
     **1884** (vol. II 1885?) — **US PD**; archive.org `bihatsahitvarah00iyergoog`. Partial earlier PD: H. Kern's
     JRAS serial translation (1870–75). Cite-only: V. Subrahmanya Sastri & M. Ramakrishna Bhat, Bangalore,
     **1946** (URAA-restored → US PD 2042) — the task prompt's "V. Subrahmanya Sastri 1946" belongs to the
     *Saṁhitā*, not the Jātaka; M. Ramakrishna Bhat's MLBD 2-vol ed. (1981–82) also cite-only.
  3. **Pañcasiddhāntikā** — ed./trans. G. Thibaut & Sudhākara Dvivedī, Benares, **1889** — US PD. Maps to the
     "learn the math" / hand-calc pages (the astronomy layer).
  4. (Secondary, list-only): *Laghujātaka*, *Yogayātrā* — **no verified PD English translation found; say so**;
     Sanskrit eds. PD.
- **Chapter plan:** Bṛhajjātaka's 25–28 adhyāyas (recensions differ — Iyer 28 ch vs Sastri numbering; FLAG,
  spot-check both scans) mapped chapter-by-chapter: ch. I saṁjñā → `basics.html`/`vedic/index.html`; ch. II
  (planet natures) → `prasna-data` (already cited); horā/varga chapters → vedic vargas; daśā chapters →
  `timelords.html` analogy noted as *analogy*; yātrā/military chapters described-only.
- **Hazards:** predictive claims (longevity computation, death chapters) — described as the text's method,
  never as valid; caste-frame verses in ch. on birth-castes — present verbatim-cited, historicized, not endorsed.

#### 2. Parāśara (attributed) — TIER A-hybrid (chapter guide on a cite-only translation + PD Sanskrit)
- **Dates:** legendary Vedic sage; the *Bṛhat Parāśara Horā Śāstra* as we have it is a much later compilation.
  **Contested block required:** Pingree dates a Horāśāstra core c. 600–750 CE; practitioners treat the received
  97-chapter text as ancient; scholars note the received text was assembled from manuscripts in the 19th–20th c.
  and inflated between editions. Present both, never resolve.
- **Why:** BPHS is THE root text of the site's entire vedic wing (vargas, daśās, kūṭas already computed).
- **The translation-licensing answer (the question the task poses):**
  - **R. Santhanam trans., Ranjan Publications, Delhi, 1984, 2 vols** — the first **complete** English
    translation (97-chapter recension) — **IN COPYRIGHT, cite-only** (archive.org scans exist but are not
    licence evidence). Precision added 2026-07-16: an earlier PARTIAL English translation exists —
    **N.N.K. Rao & V.B. Choudhari, 2 vols, 1963, ~25 chapters, without ślokas** (per the Wikipedia BPHS
    editions table) — also in copyright, cite-only; "first complete" stands, "first English" would not.
  - **G. C. Sharma trans., Sagar Publications** (80-chapter recension) — in copyright, cite-only.
  - **"Chidambaram" — a ghost:** no BPHS translation by N. Chidambaram Iyer exists; he translated Varāhamihira
    (Bṛhat Saṁhitā 1884, Bṛhat Jātaka 1885). The plan explicitly corrects this conflation in-data (mirroring the
    greatworks.js practice of recording refuted attributions).
  - **PD path:** Sanskrit printed editions — Khemrāj Śrīkṛṣṇadās / Venkateshwar Steam Press, Bombay (1905 era)
    and other pre-1930 Indian printings — **US PD**; 19th-c. Bengali editions are REPORTED to exist but
    **UNVERIFIED — builder must locate an actual scan+date before citing one** (task prompt's "PD Bengali"
    stays a flag, not a fact).
- **Treatment:** chapter-by-chapter guide keyed to the Santhanam chapter LIST (titles and loci are citable
  facts), gist in our own words, Sanskrit terms transliterated from PD editions, **zero English quotation**;
  every chapter mapped to the computing page (vargas → vedic wing; daśās → timelords/vedic; ariṣṭa chapters →
  described-only with the honest-framing note).
- **Hazards:** the recension question (97 vs 80 chapters — flag, both positions); remedial chapters
  (gemstones, mantras) → museum-piece treatment like `vedic-remedies.js` already does; "spurious late
  chapters" claims — flagged, unresolved.

#### 3. Jaimini (attributed) — TIER B now, A later if the first-edition date verifies
- **Dates:** attributed to the Mīmāṃsā sūtrakāra (c. 4th–2nd c. BCE); scholarship treats the *Jaimini
  (Upadeśa) Sūtras* as a much later astrological text. Contested block: tradition vs. Pingree-line dating.
- **Why:** the kāraka/rāśi-daśā system the Library's Jaimini moderns (Rath, Foss) teach; site computes
  chara-kārakas? (verify — if not, mapping is descriptive only).
- **Key edition — the B. Suryanarain Rao question answered:** Rao (1856–1937) published *Jaiminisutras* with
  English translation and notes; **archive.org's earliest scan is the 1949 edition** (DLI 2015.486584; also a
  1955 printing); Motilal reprints are edited by B. V. Raman. **First-edition year UNVERIFIED** (a pre-1930
  first edition is plausible but no scan/record was found this round — do NOT assert it).
  - **India:** PD (author d. 1937; term expired under life+50 before the 1992 extension, stayed expired).
  - **US:** flagged analysis — the 1949 posthumous edition was already PD-in-India on the URAA date, hence NOT
    restored; pre-1978 foreign publication without US formalities → **plausibly US-PD, but treat quote-cautious
    (cite-only) until the first-edition year and US formalities are pinned**. This is the honest verdict.
- **Hazards:** authorship conflation with the Mīmāṃsā Jaimini (both positions in-data); Rao's own theosophical-era
  interpolations noted by later editors — flag.

#### 4. Kalyāṇavarman — TIER B (Library upgrade + atlas entry)
- **Dates:** c. 800 CE (fl. — contested within 6th–9th c.; keep the Library record's "c. 800 CE").
- **Why:** *Sārāvalī* is the bridge between Bṛhajjātaka and the medieval synthesis; heavily cited in kuta/vedic data.
- **Editions:** R. Santhanam trans., Ranjan, **1983** — in copyright, **cite-only**. Sanskrit ed. (Bombay,
  Nirṇaya Sāgara era printings, pre-1930) — US PD; **no PD English translation found — say so.**
- **Hazards:** none special beyond standard predictive-claims framing.

#### 5. Mantreśvara — TIER B
- **Dates:** disputed, 13th–16th c. (Library record already says "disputed" — keep, both positions:
  Kerala tradition ~13th c.; scholarship often 16th c.).
- **Why:** *Phaladīpikā* is the standard results-text; muhurta/kuta pages touch it.
- **Editions:** V. Subrahmanya Sastri trans., 1st ed. **1937 (year FLAGGED — verify against a scan;
  the verified scan is the 2nd ed., Bangalore 1950**, wisdomlib hosts the OCR) — URAA-restored → US PD
  2033 (1st ed.) / 2046 (2nd ed.); **cite-only**. K. S. Charak and Kapoor translations — in copyright, cite-only.
  **No PD English — say so.**

#### 6. Vaidyanātha Dīkṣita — TIER B
- **Dates:** c. 15th–16th c. (Library record concurs).
- **Why:** *Jātaka Pārijāta* — the third leg of the classical natal triad; the Library record exists, needs
  edition depth.
- **Editions:** V. Subrahmanya Sastri trans., **vol. I 1932, vol. II 1933** (V. B. Soobiah & Sons,
  Bangalore / Government Branch Press Mysore printings; archive.org `JatakaParijata1932`,
  `JatakaParijataVolIOfIIByVSubrahmanyaSastri`, and a 1933 vol. II scan). **US: URAA-restored → PD
  2028/2029-01-01; cite-only until then** (note in pdCalendar). India: depends on Sastri's death year —
  **UNVERIFIED — builder should attempt to source V. Subrahmanya Sastri's death date; if he died before 1936
  the URAA restoration analysis changes; keep flagged either way.**

#### 7. Praśna Mārga (anonymous) — text record, NOT one of the 25 people (see drops §3)
- Kerala, **1649**; authorship traditionally assigned to a Nampūtiri of Edakkāṭ — flag as traditional.
- Trans. B. V. Raman, MLBD, 2 vols (1980/1985) — in copyright, **cite-only** — exactly as `prasna-data.js`
  already handles it (including the TOC-vs-stanza numbering trap it documents). Treatment: Library text
  record + atlas entry `text-prasna-marga` with an edge to `prasna.html`.

### CLUSTER II — Haṭha & tantra masters

#### 8. Svātmārāma — TIER A-lite (clean-PD chapter guide; upgrade of existing practices entries)
- **Dates:** 15th c. CE.
- **Why:** *Haṭhayogapradīpikā* already has a practices entry and an atlas entry; a 4-upadeśa
  chapter guide is fully PD-buildable.
- **Editions:** Pancham Sinh trans., *The Hatha Yoga Pradipika*, Panini Office, Allahabad (Sacred Books of
  the Hindus), **1914–15** — **US PD, quote-safe**. Earlier: T. R. Srinivasa Iyangar (Bombay Theosophical,
  **1893**) — US PD. Cite-only moderns: Brahmānanda-commentary Adyar trans. (1972), Akers (2002),
  Mallinson (2011-era work).
- **Hazards:** physical-practice chapters (ṣaṭkarma, prāṇāyāma, mudrās incl. vajrolī) — described as the
  text's historical claims with the site's existing "never instruct" practice framing; health claims flagged.

#### 9. Gheraṇḍa (attributed teacher) — TIER C (exists; upgrade to 7-chapter guide)
- **Dates:** text c. 1700 CE; "Gheraṇḍa" himself is a frame-story teacher — flag as literary.
- **Editions:** Rai Bahadur Srisa Chandra Vasu trans., *The Gheranda Samhita* (Bombay **1895**; Panini Office
  Sacred Books of the Hindus **1914–15**) — **US PD, quote-safe**. Cite-only: Mallinson (2004).
- **Hazards:** same as HYP (ṣaṭkarma described-only).

#### 10. Abhinavagupta — TIER B (no PD English; the only complete English translation is recent and in copyright)
- **Dates:** c. 950 – 1016 CE, Kashmir.
- **Why:** the summit of Kashmir Śaiva tantra; atlas person entry exists; rasa/abhichara wings touch Kaula ritual.
- **CORRECTED 2026-07-16 (the earlier draft of this section was WRONG):** a complete published English
  translation of the Tantrāloka **now exists** — **Mark Dyczkowski, *Tantrāloka: The Light on and of the
  Tantras*, 11 volumes, with Jayaratha's Viveka commentary and extensive notes, independently published,
  first volumes 2023** — **in copyright, cite-only**. (Verification: anuttaratrikakula.org/tantraloka-translation
  — "the translation of the Tantrāloka has been completed … eleven volumes"; Amazon listing "TANTRALOKA THE
  LIGHT ON AND OF THE TANTRAS — VOLUME ONE", 2023.) The honest in-data record is therefore: "no PD English;
  the first complete English translation (Dyczkowski, 11 vols, 2023–) is recent and in copyright — cite-only."
  Do NOT ship the older claim that no complete English exists. Gnoli's complete *Luce delle Sacre Scritture*
  (Italian, UTET 1972) — in copyright. Earlier partial English chapter translations scattered in academic
  monographs — all in copyright.
  - PD path: **KSTS Sanskrit editions** (*Tantrāloka* with Jayaratha's viveka, Kashmir Series of Texts and
    Studies, 12 vols, Srinagar/Bombay **1918–1938**) — pre-1930 volumes US PD; 1930s volumes flip through 2034.
  - *Tantrasāra*: H. N. Chakravarty English trans. (ed. Marjanovic, 2012) — cite-only. KSTS Sanskrit (1918) PD.
- **Hazards:** living-lineage sensitivities (Lakshmanjoo lineage orgs); tantric ritual (kula rites) —
  museum-piece treatment; the site must not read like a Kaula manual.

#### 11. Kṣemarāja — TIER B
- **Dates:** c. 1000–1050 CE (Abhinavagupta's pupil).
- **Why:** *Pratyabhijñāhṛdayam* is the standard digest of Recognition philosophy; pairs with the yoga wing's
  theory page.
- **Editions — the "Singh is NOT PD; older?" question answered:** Jaideva Singh, *Pratyabhijñāhṛdayam: The
  Secret of Self-Recognition* (MLBD, 1963) — **in copyright, cite-only**. OLDER EXISTS: **Kurt F. Leidecker,
  *The Secret of Recognition (Pratyabhijñāhṛdayam)*, Adyar Library, Madras, 1938** (English, made from Emil
  Baer's German) — verified real (archive.org scan `PratyabhijnaHrdayamTheSecretOfRecognitionKurtLeideckerF.Adyar`);
  **URAA-restored → US PD 2034-01-01; cite-only until then** (pdCalendar). Also: *Śivasūtravimarśinī* English
  by P. T. Shrinivas Iyengar (Indian Thought series, Allahabad, **1912**) — **REPORTED PD-clean; UNVERIFIED —
  builder must locate the scan before marking quote-safe.**
- **Hazards:** none special; philosophy described, "recognition" soteriology as the school's claim.

#### 12. Matsyendranātha — TIER B upgrade (atlas person entry already exists with a contested block)
- **Dates:** c. 9th–10th c., contested (atlas already carries the Haraprasad Sastri position — reuse).
- **Works:** *Kaulajñānanirṇaya* — Sanskrit ed. P. C. Bagchi (Calcutta Sanskrit Series 3, **1934**) —
  URAA-restored → US PD 2030; **cite-only**. English trans. Michael Magee/"Lokanath" (Prachya Prakashan,
  1986) — in copyright and of contested scholarly standing — cite-only with a quality flag. **No PD English — say so.**
- **Hazards:** legend-vs-history (fish-belly nativity legend described as legend); Kaula sexual ritual content —
  described in scholarly register only.

#### 13. Gorakhnāth — TIER B upgrade (atlas person entry exists)
- **Dates:** c. 11th–13th c., contested — keep the atlas's existing contested handling.
- **Works:** *Gorakṣaśataka* (and the śataka/saṁhitā tangle — flag: which "Gorakṣaśataka" is meant differs by
  manuscript; Mallinson's scholarship distinguishes them). Best citable: G. W. Briggs, *Gorakhnāth and the
  Kānphaṭa Yogīs* (YMCA Publishing, Calcutta, **1938**) — contains a Gorakṣaśataka translation —
  URAA-restored → US PD 2034; **cite-only**. *Gorakh-bānī* (Hindi verses, ed. P. D. Barthwal, 1930s) — no PD
  English; say so.
- **Hazards:** Nāth hagiography (immortality claims) described as tradition.

### CLUSTER III — Buddhist masters

#### 14. Buddhaghosa — TIER A (gated: two of three volumes quote-safe today)
- **Dates:** fl. early 5th c. CE, Anurādhapura (Sri Lanka); biography semi-legendary (Mahāvaṁsa account) — flag.
- **Why:** the *Visuddhimagga* is the systematic meditation-map of Theravāda; the atlas has a text entry;
  the yoga wing's samādhi/jhāna comparisons want exactly this (described, both traditions' own terms).
- **Editions — the task's question answered precisely:**
  - **Pe Maung Tin, *The Path of Purity*, PTS Translation Series 11/17/21, 3 vols: 1923 (Part I — JRAS's
    review dates it "[1922]"; FLAG the 1922-vs-1923 discrepancy in-data), 1929 (Part II), 1931 (Part III).**
    **US status: vols I–II PD NOW; vol. III PD 2027-01-01** (95-year rule; UK publication → URAA makes renewal
    moot). Scans: archive.org `pathofpuritybein01budduoft` (vol. I) etc. → quote-safe for vols I–II only;
    gate vol. III quotes until 2027 (pdCalendar).
  - **Ñāṇamoli, *The Path of Purification* (1956; BPS eds.) — NOT PD**; BPS distributes a free PDF with ©
    retained — cite-only, label "free download, © BPS".
  - Pāli text: PTS ed. (C.A.F. Rhys Davids, 1920–21) — PD.
- **Chapter plan:** 23 chapters in three parts (sīla I–II, samādhi III–XIII, paññā XIV–XXIII); map the
  kasiṇa/jhāna chapters to the yoga wing's meditation-states comparison; the iddhi (supernormal powers)
  chapter XII maps to the Yoga Sūtras vibhūti-pāda page — *both texts' power-claims described as claims,
  side by side* — this is the wing's best honest-framing showcase.
- **Hazards:** iddhi claims; Mahāvaṁsa hagiography of Buddhaghosa (the palm-leaf legend) described as legend.

#### 15. Milarepa (via Gtsang-smyon Heruka's *Life*) — TIER A-lite / C
- **Dates:** 1040–1123 (trad.; variant 1052–1135 — contested block with both).
- **Why:** freshly PD flagship (Evans-Wentz/Kazi Dawa-Samdup, *Tibet's Great Yogi Milarepa*, OUP **1928** —
  **US PD since 2024-01-01**), and the biography's early **black-magic episode** (Milarepa's sorcery and
  repentance) cross-links directly to the abhichara wing's framing — a described-never-prescribed exemplar
  from within a tradition itself.
- **Editions:** Evans-Wentz 1928 (quote-safe; reuse the R27 Theosophical-overlay flag; credit **Kazi
  Dawa-Samdup (1868–1922)** as the actual translator — see atlas additions). The underlying Tibetan text is
  Gtsang-smyon Heruka's 1488 *Life* — attribute correctly. Chang's *Hundred Thousand Songs* (1962) and
  Lhalungpa (1977) — cite-only.
- **Chapter plan (if A-lite):** the *Life*'s 12 chapters (2 + 10 per the text's own jātaka-style division) —
  sorcery chapters → `abhichara/` wing; tummo/yogic-feat chapters → described as hagiographic claims.
- **Hazards:** miracle narratives (flight, tummo) = hagiography; Evans-Wentz overlay (R27 flag); sectarian
  (Kagyü) framing described.

#### 16. Śāntideva — TIER C + Library
- **Dates:** c. 685–763 CE, Nālandā (dates approximate — flag).
- **Why:** *Bodhicaryāvatāra* is the most-read Mahāyāna practice poem; clean partial-PD path.
- **Editions — the task's Barnett question answered with the necessary asterisk:** L. D. Barnett, *The Path
  of Light* (Wisdom of the East, John Murray, **1909**) — **US PD, quote-safe — BUT ABRIDGED** (verified
  2026-07-16 against Barnett's own front matter via sacred-texts: he omitted passages "where it seemed
  needlessly prolix" and "the whole of the scholastic disputation which makes up the bulk of the ninth
  chapter" — the wisdom chapter; commonly reckoned at roughly half the text) — flag prominently; never
  present Barnett as the whole text. Full PD alternative in French: La Vallée Poussin (1907). **Full English PD bonus:** Bendall
  & Rouse, *Śikṣā-samuccaya* (John Murray, **1922**) — US PD, quote-safe, complete. Cite-only: Crosby &
  Skilton (1995), Padmakara (1997/2006), Wallace (1997).
- **Hazards:** the Tuṣita-descent hagiography described as legend; bodhisattva vow described, not prescribed.

#### 17. Nāgārjuna (philosopher) — TIER B (atlas person entry exists; the site already disambiguates the alchemist)
- **Dates:** c. 150–250 CE (atlas concurs).
- **Why:** Madhyamaka underpins the Buddhist entries' philosophy lane; the existing
  `person-nagarjuna-siddha` disambiguation is a site asset — the new Library record must POINT AT it.
- **Editions — the honest MMK answer:** **no complete PD English translation of the Mūlamadhyamakakārikā
  exists.** Partial PD: Th. Stcherbatsky, *The Conception of Buddhist Nirvāṇa* (Leningrad, **1927**) —
  translates MMK chs. 1 & 25 with Candrakīrti's Prasannapadā — pre-1930 → **US PD, quote-safe for those
  chapters only** (flag Stcherbatsky's dated "monist" reading as an interpretive overlay). Complete,
  cite-only: Inada (1970), Garfield (1995), Siderits & Katsura (2013).
- **Hazards:** the two-Nāgārjunas conflation (already handled — link, don't duplicate).

#### 18. Padmasambhava / Karma Lingpa (terma) — TIER B (atlas strengthening; books already in atlas)
- **Dates:** Padmasambhava 8th c. (semi-legendary — flag); Karma Lingpa 14th c. (terma revealer).
- **The Evans-Wentz volumes' status (task question):**
  - *The Tibetan Book of the Dead* (OUP **1927**) — **US PD** (atlas entries + Jung-commentary edge already exist).
  - *Tibet's Great Yogi Milarepa* (**1928**) — US PD (see #15).
  - *Tibetan Yoga and Secret Doctrines* (**1935**) — **NOT PD; US PD 2031-01-01** (pdCalendar).
  - *The Tibetan Book of the Great Liberation* (**1954**) — NOT PD (2050).
- **Treatment:** person entry for Padmasambhava with the terma-authorship contested block (tradition:
  concealed 8th-c. treasure; scholarship: 14th-c. composition attributed via terma convention); Library
  record for the terma corpus keyed to the two PD volumes.
- **Hazards:** Evans-Wentz overlay (R27 flag); terma authorship contested — both positions, unresolved.

#### 19. Tsongkhapa — TIER B (record whose honest core is "no PD; cite-only")
- **Dates:** 1357–1419.
- **Works:** *Lam rim chen mo* — trans. Lamrim Chenmo Translation Committee (Cutler ed.), 3 vols, Snow Lion,
  **2000–2004** — in copyright, cite-only. **No PD English of any major Tsongkhapa work — say so.**
- **Why keep despite dirty licence:** Gelug systematization; atlas mentions exist; cheap Library record.
- **Hazards:** Gelug/Kagyü polemics — described neutrally.

#### 20. Longchenpa — TIER B/D (atlas person entry exists)
- **Dates:** 1308–1364.
- **Works:** *Seven Treasuries*; *Trilogy of Rest*. **No PD English whatsoever** — Guenther, *Kindly Bent to
  Ease Us* (Dharma Publishing, 1975–76), Padmakara and Tulku Thondup translations all in copyright —
  cite-only. Say so plainly; upgrade the existing atlas entry with the works list, no new wing.
- **Hazards:** Dzogchen described in scholarly register; no pointing-out-instruction paraphrase.

#### 21. Dōgen — TIER B (the honest "no complete PD Shōbōgenzō" record)
- **Dates:** 1200–1253.
- **The task's question answered:** **there is NO complete public-domain English Shōbōgenzō.** The first
  complete English translations are Nishiyama & Stevens (1975–83), then Nearman (Shasta Abbey, 2007 — free
  PDF, © retained), Tanahashi/SFZC (2010), Sōtō Zen Text Project (ongoing, BDK). All cite-only. Nishiari
  (task prompt) is a Japanese commentator (Nishiari Bokusan), whose commentary reaches English only in
  modern copyrighted editions — record that correction.
- **Treatment:** Library record + atlas person entry; fascicle LIST is citable fact; map *Uji* (Being-Time)
  to the site's time-philosophy notes if any (else no mapping — don't force it).
- **Hazards:** none special; Sōtō institutional readings described.

#### 22. Kūkai — TIER D+ (atlas entry + one strong edge; Library stub)
- **Dates:** 774–835.
- **Why kept despite no PD:** the **Sukuyōdō hook** — Kūkai's importation of the *Xiuyao jing* (Amoghavajra's
  nakṣatra-astrology digest, 759 CE) into Japan is a genuine East-Asian-astrology confluence edge the atlas
  currently lacks, tying the jyotiṣa lane to East Asia with clean scholarly citations (Yano Michio,
  *Mikkyō senseijutsu*; Bill Mak's papers — Mak is already a Library record).
- **Works:** Hakeda, *Kūkai: Major Works* (Columbia UP, 1972) — cite-only. **No PD English — say so.**
- **Hazards:** Shingon institutional sensitivity; sokushin-jōbutsu doctrine described.

#### 23. Hakuin — TIER D (atlas entry/edges only)
- **Dates:** 1686–1769 (Ekaku; dates solid).
- **Works:** *Orategama*, *Yasen kanna* — English: Shaw & Schiffer (Monumenta Nipponica, 1957), Shaw *The
  Embossed Tea Kettle* (1963), Waddell translations — all cite-only. **No PD English — say so.**
- **Why atlas-only:** the *Yasen kanna* "Zen sickness"/naikan episode is a good practices-history entry
  (inner-heat visualization parallel to tummo — an atlas edge), but without a PD text a wing is unjustified.
- **Hazards:** health-cure narrative described as autobiography, not medicine.

### CLUSTER IV — Chinese masters

#### 24. Ge Hong — TIER B upgrade (atlas person entry exists; rasa-page Chinese lane ties in)
- **Dates:** 283–343 CE.
- **The task's question answered:** Ware, *Alchemy, Medicine, Religion in the China of A.D. 320* (MIT, 1966)
  — **NOT PD, cite-only**. **Partial older translations exist:** Eugene Feifel, *Pao-p'u tzu nei-p'ien*
  chs. 1–3 in *Monumenta Serica* 6 (**1941**) 113–211; ch. 4 in MS 9 (**1944**); ch. 11 in MS 11 (**1946**);
  and Tenney L. Davis & Ch'en Kuo-fu, "The Inner Chapters of Pao-p'u-tzu", *Proceedings of the American
  Academy of Arts and Sciences* 74 (**1941**) 297–325 (chs. 8 & 11 + summaries of the rest).
  **US status: renewal-dependent (1941–46 US-circulated periodicals; Monumenta Serica then published in
  Peking adds a URAA wrinkle) — UNVERIFIED; builder must run a Stanford-renewal/CCE search and log it, else
  keep cite-only.** This mirrors the greatworks.js renewal-evidence discipline exactly.
- **Hazards:** elixir toxicology (the rasa page's existing toxin note pattern applies verbatim); immortality
  claims described.

#### 25. Zhang Boduan — TIER B (person entry to pair with the existing `wuzhen-pian` atlas text entry)
- **Dates:** c. 987–1082.
- **The task's Davis & Chao question answered:** Tenney L. Davis & Chao Yün-ts'ung, "Chang Po-tuan of
  T'ien-t'ai, his Wu Chen P'ien, Essay on the Understanding of the Truth", *Proceedings of the American
  Academy of Arts and Sciences* **73, no. 5 (July 1939)** (verification 2026-07-16: volume, issue number 5
  and July-1939 date confirmed via reprint/bookseller listings; the 97–117 page span still rests on secondary
  listings — **verify against the volume**). Bonus fact found this round: Davis & Chao published a second
  Chang Po-tuan piece, "The Four Hundred Word Chin Tan …", PAAAS **73, no. 13 (1940), pp. 371–399** — same
  renewal gate if ever used. Same renewal-search gate as Ge Hong:
  **cite-only until a logged renewal search comes back empty**, then quote-safe. Cleary, *Understanding
  Reality* (1987) — cite-only.
- **Hazards:** neidan sexual-energy language — scholarly register; "inner elixir" efficacy claims described.

### CLUSTER V — Modern Indian masters

#### 26. Swami Vivekananda — TIER A (cleanest modern figure)
- **Dates:** 1863–1902.
- **Why:** everything published in his lifetime and the early Complete Works volumes are pre-1930 → US PD;
  the atlas already has `event-chicago-1893`; *Raja Yoga* contains his Yoga Sūtras rendering → direct
  cross-link into the finished yoga wing.
- **Works:** *Raja Yoga* (**July 1896** — imprint varies between the New York Vedanta-circle issue and
  Longmans, Green (London printing 1896/97); PD either way, so cite whichever scan is used) — quote-safe;
  *Karma Yoga* (1896), *Jnana Yoga* (lectures, 1899-era eds.) — PD; **Complete Works** (Advaita Ashrama, Mayavati Memorial Edition, vols from **1907**) —
  pre-1930 printings PD; **flag:** the modern 9-volume set contains posthumously added/edited matter —
  quote only from pre-1930 printings, cite the exact volume/year.
- **Chapter plan:** *Raja Yoga*'s structure (lectures + sūtra translation) mapped lecture-by-lecture; his
  prāṇa/ākāśa physics-language flagged as period vitalism, described.
- **Hazards:** hagiography; Neo-Vedānta debates (De Michelis's "Modern Yoga" thesis vs. traditionalist
  reading) — both positions, unresolved; Ramakrishna-lineage organizational sensitivities.

#### 27. Paramahansa Yogananda — TIER A (PD verdict verified this round)
- **Dates:** 1893–1952.
- **The famous case, answered precisely (VERIFIED 2026-07-16 against the 9th Cir. opinion text and 2002
  verdict coverage):** *Autobiography of a Yogi*, **Philosophical Library, New York, December 1946 — the
  FIRST EDITION is US public domain.** What *SRF v. Ananda*, 206 F.3d 1322 (9th Cir. 2000) actually held:
  (a) Yogananda's books were **not "works for hire"** and the "corporate body" doctrine did not apply
  ("a single, identifiable individual rather than a faceless corporate mass"); (b) the court **affirmed
  summary judgment for Ananda on the books' renewal-term copyrights** — books are not "periodical,
  encyclopedic, [or] composite works," the only class a non-author proprietor may renew — so renewal rights
  vested in the author's statutory successors and SRF's 1974 renewal registration of the 1946 edition was
  ineffective. Caveat for the wing text: the opinion discusses the "books" generically and does not analyze
  the Autobiography by name; the PD status of the 1946 text is the settled practical consequence (Project
  Gutenberg hosts it as ebook #7452; Ananda/Crystal Clarity reprint it as "the original 1946 edition").
  (c) Assignment questions on other works were remanded; per the **2002 final judgment**, SRF **retained**
  copyrights in nine article series/works from its magazine (1943–1976), six 1949–51 sound recordings, and
  unpublished writings while unpublished; **Ananda won all the disputed photographs**, and the jury awarded
  SRF only $29,000 (on the recordings). Record the whole split, not just "SRF lost."
  **Quote-safe: 1946 FIRST EDITION ONLY.** Later SRF editions (3rd ed. 1951 onward, heavily revised; current
  13th) are copyrighted — never quote or reproduce their changes/photos. Record the litigation NEUTRALLY
  (court outcome as fact; SRF's and Ananda's positions as positions).
- **Other works:** *Songs of the Soul* (1923), *The Science of Religion* (1924), *Whispers from Eternity*
  (**1929**) — pre-1930 → US PD (verify exact first-edition years against scans before marking quote-safe);
  *The Second Coming of Christ* (SRF, 2004) — cite-only.
- **Chapter plan:** the Autobiography's 48/49 chapters (first-edition count — verify: 48 in 1946) —
  the astrology chapter ("Outwitting the Stars", ch. 16) maps to `vedic-remedies.js` (the bangle passage is
  the classic gem-remedy claim → museum-piece framing); the Lahiri Mahasaya / Babaji chapters flagged as
  miracle claims described.
- **Hazards (heavy — this figure is the framing stress-test):** miracle claims (Babaji's materializations,
  Giri Bala's non-eating, Sri Yukteswar's resurrection ch.) — described AS CLAIMS with page cites; SRF vs
  Ananda organizational dispute — described neutrally; "Kriya Yoga" term collision with Yoga Sūtras II.1
  kriyā-yoga → glossary disambiguation entry REQUIRED (see §6).

#### 28. Sri Aurobindo — TIER B/C (per-work split is the whole point)
- **Dates:** 1872–1950.
- **The task's per-work analysis:**
  - **India:** lifetime-published works PD since **2011-01-01** (life+60); *posthumously published* works
    (much of the Record of Yoga, letters compilations) remain in copyright in India — the Ashram Trust's own
    position (auro-ebooks copyright page documents the split).
  - **US:** pre-1930 publications are PD — this includes the **Arya-period serializations (1914–1921)**:
    *The Life Divine* (Arya version), *The Synthesis of Yoga* (Arya, unfinished), *Essays on the Gita*
    (Arya; book ed. 1922/1928) — quote-safe FROM THE ARYA/pre-1930 EDITIONS ONLY.
  - The **revised book editions** — *The Life Divine* (1939–40) → US PD 2035/36; *Savitri* (1950–51) →
    ~2046/47 — cite-only. The CWSA (Complete Works, 1997–) editorial text — cite-only.
- **Treatment:** Library record with the two-column licence table; possible later C-tier treatment of
  *Essays on the Gita* (clean PD).
- **Hazards:** evolution-of-consciousness claims described; Auroville/Ashram organizational sensitivities;
  nationalist-period politics contextualized.

#### 29. Ramana Maharshi — TIER B
- **Dates:** 1879–1950 (d. 14 April 1950) → PD in India since 2011 for lifetime works.
- **Works & the ashram-terms answer:** *Nāṉ Yār?* (Who Am I?) — Sivaprakasam Pillai's Q&A record, first
  published in Tamil **1923** (pre-1930 → the Tamil original is US PD; flag: exact 1923 edition to verify).
  The standard English translations (T. M. P. Mahadevan; ashram editions) are **© Sri Ramanasramam,
  offered as free PDFs — free-to-read, NOT PD → cite-only**. *Ulladu Narpadu*, *Upadeśa Sāram* — same
  pattern. Early English witness: B. V. Narasimha Swami, *Self Realization* (**1931**) → US PD 2027-01-01
  (pdCalendar); Brunton's *A Search in Secret India* (1934, UK) — cite-only (URAA).
- **Hazards:** ashram sensitivities; self-enquiry described as the taught method, never prescribed as
  therapy; hagiographic death-experience narrative described as his reported account.

#### 30. Swami Sivananda — TIER B
- **Dates:** 1887 – 14 July 1963.
- **The DLS-terms answer:** **PD in India since 2024-01-01** (life+60). **US: NOT PD** — works 1930s–50s are
  URAA-restored (95 years from each publication; e.g., mid-1930s titles → US PD late 2020s–2030s; verify
  per-work first-publication years — DLS reprints obscure them; FLAG). DLS (dlshq.org) hosts free PDFs and
  its Free Literature Section "distributes freely", but **republication requires writing to the General
  Secretary — that is permission-based distribution, not a licence** → cite-only in the US, with the India
  status recorded. Candidate works for records: *Kundalini Yoga* (1935?), *Concentration and Meditation*
  (1936?), *Practice of Yoga* (1929? — if a genuine 1929 first edition verifies, THAT volume is US-PD;
  worth one targeted check at build time).
- **Hazards:** volume of health/efficacy claims — described; DLS organizational terms respected; the
  hagiographic biography described.

*(Also in Cluster V but resolved differently: B. V. Raman — already a canon Library record, works in
copyright, NO new wing, atlas person entry optional; Gopi Krishna and Swami Rama — see drops.)*

### The cross-cluster ADD (makes the count 25 with the drops below)

#### 25b. Ādi Śaṅkara — TIER C (added; atlas person entry already exists)
- **Dates:** trad. 788–820 CE; scholarship c. 700–750 — contested block, both positions.
- **Why added:** the yoga wing's theory page and Vivekananda's wing both lean on Advaita; the licence is
  exceptionally clean: G. Thibaut, *Vedānta-Sūtras with Śaṅkara's commentary*, SBE 34 (**1890**) & 38
  (**1896**) — US PD; Swāmi Mādhavānanda, *Vivekacūḍāmaṇi* (Advaita Ashrama, **1921**) — US PD.
  Attribution flag: *Vivekacūḍāmaṇi*'s Śaṅkara authorship is doubted by modern scholarship (Hacker line) —
  contested block, unresolved.
- **Hazards:** sectarian Advaita-vs-others framing described.

---

## 3. ADD / DROP decisions (with reasons)

| Candidate | Decision | Reason |
|---|---|---|
| Praśna Mārga | **Demote to text record** (not one of the 25 people) | Anonymous; the site already cites it deeply in `prasna-data.js`; a Library text record + atlas entry captures all value. |
| Richard Wilhelm (as an "Eastern great") | **Fold, don't add** | He is a translator, already a Library record (I Ching row); Golden Flower coverage lives on the existing atlas entries + the 2027 pdCalendar flip. |
| Liu Yiming | **Tier D only** | No PD or even early English (all Cleary, ©); atlas entry + edge to `wuzhen-pian` suffices. |
| Gopi Krishna | **Tier D only** | Single copyrighted book (Kundalini, 1967); one atlas entry (his 1937 kuṇḍalinī-experience account, described as his claim) + edge to the kuṇḍalinī glossary term. |
| Swami Rama | **DROP entirely** | All works ©; the 1997 civil-jury verdict against him (sexual abuse) makes any neutral "master" record a framing minefield disproportionate to site value. If ever added: Library record with the documented controversy stated, per the site's contested-facts rule. |
| Kūkai, Hakuin | **Keep but demote to D** | No PD texts; kept for the Sukuyōdō astrology edge (Kūkai) and the tummo-parallel practices entry (Hakuin) — atlas value only. |
| B. V. Raman | **No new record** | Already canon in the Library; works © (d. 1998) — cite-only stands. |
| Ādi Śaṅkara | **ADD (Tier C)** | Clean PD editions; anchors Vivekananda/yoga-theory lineage; atlas person entry already exists to hang it on. |
| Kazi Dawa-Samdup | **ADD as atlas person entry only** | The actual translator behind the PD Evans-Wentz volumes (d. 1922); crediting him is both honest and useful (his translations are the PD substrate). |
| Patañjali | **Excluded** | Wing already complete. |

**Final count toward "~25":** 7 jyotiṣa + 6 haṭha/tantra + 10 Buddhist (incl. the two demoted-to-D) +
2 Chinese full records (+1 D) + 5 modern (+2 D, 1 drop) + Śaṅkara = **25 full catalog records**, with
Praśna Mārga as a text record and 4–5 atlas-only figures alongside.

---

## 4. RANKED BUILD ORDER (value × licence-cleanliness) and phasing

**New module:** `assets/js/core/data/greatworks-east.js` — exports `EASTERN_GREATS` in the EXACT
`GREAT_WORKS` record shape (so `pages/greatworks/` renderer code is reused), plus `EG_CITATION`,
`EG_METHOD_NOTE`, and the `EG_PD_CALENDAR` table from §1. Follow the `add-data-module` skill discipline
(provenance per record, headless smoke test asserting every `siteMapping.path` resolves under `pages/`,
no DOM). Run `accuracy-check` on: Varāhamihira's dates, BPHS recension chapter-counts, Milarepa's dates,
Pe Maung Tin vol. I's 1922/1923, Rao's Jaimini first edition.

**Phase E1 — "The Jyotiṣa Masters" (highest value, cleanest licences):**
1. Varāhamihira wing page (`pages/greatworks/varahamihira.html`) — quote-safe ×2.
2. Parāśara/BPHS hybrid wing page — Sanskrit-PD + cite-only English, recension flag.
3. Library upgrades (edition/licence blocks added to EXISTING `practitioners.js` records — do not
   duplicate records): Kalyāṇavarman, Mantreśvara, Vaidyanātha, + Jaimini/Rao record, + Praśna Mārga text record.
4. Atlas: person entries for Varāhamihira, Parāśara (as "attributed author" entry), Jaimini + edges (§5).

**Phase E2 — "Yoga & Vedānta greats":**
5. Vivekananda wing (Raja Yoga chapter guide; link every sūtra reference into `pages/yoga/`).
6. Yogananda wing (1946-first-edition guide; the licensing story itself is a chapter of the method note).
7. Śaṅkara Tier-C treatment; Svātmārāma + Gheraṇḍa chapter-guide upgrades on the practices pages.
8. Aurobindo, Ramana, Sivananda Library records with the two-jurisdiction licence tables.

**Phase E3 — "The Buddhist shelf":**
9. Buddhaghosa wing (23-chapter guide; vol-III quote gate wired to `EG_PD_CALENDAR`).
10. Milarepa A-lite guide (+ abhichara cross-link), Śāntideva Tier-C (Barnett-abridged flag),
    Nāgārjuna / Padmasambhava–Karma Lingpa / Tsongkhapa / Longchenpa / Dōgen Library records
    (the four honest "no PD — say so" records), Kūkai & Hakuin atlas entries.

**Phase E4 — "China & the flip-watch":**
11. Ge Hong & Zhang Boduan records — SHIP AS CITE-ONLY, each carrying a "renewal search pending" flag;
    a follow-up task runs the Stanford renewal DB searches and, if empty, flips `quoteSafe`.
12. 2027-01-01 tickler: Golden Flower + Path of Purity vol. III + Narasimha Swami flip to quote-safe;
    roadmap stub for the upgrade round.

---

## 5. Confluence-atlas additions (entries + edges; every one cited)

New **person entries** (schema per existing atlas records — slug, lane, dateText/sortYear,
dateCertainty, kind:'person', body, sources[], contested where flagged above, siteLink):
`person-varahamihira` (lane: jyotisha — verify lane vocabulary against CONFLUENCE_LANES),
`person-parashara-attrib` (contested block: Pingree vs tradition),
`person-jaimini-attrib` (contested), `person-kalyanavarman`, `person-mantresvara` (contested date),
`person-vaidyanatha`, `person-buddhaghosa`, `person-santideva`, `person-padmasambhava` (terma contested),
`person-karma-lingpa`, `person-milarepa` (contested dates), `person-tsangnyon-heruka`,
`person-kazi-dawa-samdup`, `person-tsongkhapa` (verify no existing entry), `person-dogen`, `person-kukai`,
`person-hakuin`, `person-zhang-boduan`, `person-liu-yiming`, `person-ksemaraja`, `person-svatmarama`,
`person-vivekananda`, `person-yogananda`, `person-aurobindo`, `person-ramana-maharshi`,
`person-sivananda`, `person-gopi-krishna`; text entries `text-prasna-marga`, `text-bphs`,
`text-jaimini-sutras`, `text-saravali`, `text-phaladipika`, `text-jataka-parijata`.

High-value new **edges** (cite each):
- `person-kukai` ↔ `text-xiuyao-jing` (new) ↔ the jyotiṣa nakṣatra lane: Amoghavajra's Xiuyao jing (759 CE)
  carried Indian nakṣatra astrology to China/Japan; Kūkai's school ran Sukuyōdō. Cite: Bill M. Mak's HSSA
  papers (Mak already a Library record) + Yano Michio, *Mikkyō senseijutsu*.
- `person-milarepa` → abhichara wing: the *Life*'s sorcery-and-repentance episode. Cite: Evans-Wentz 1928, chs. on the black art.
- `person-buddhaghosa` → `visuddhimagga` (exists) → yoga-wing jhāna/samādhi comparison page. Cite: Pe Maung Tin vols.
- `person-kazi-dawa-samdup` → `bardo-thodol` / `tibetan-book-of-the-dead` / Milarepa entries: "the translator
  behind the Evans-Wentz volumes, d. 1922". Cite: Evans-Wentz's own prefaces (1927, 1928).
- `person-vivekananda` → `event-chicago-1893` (exists) → `pages/yoga/` (his Raja Yoga sūtra rendering).
- `person-yogananda` → `autobiography-of-a-yogi` (exists) + a new `event-srf-ananda-ruling-2000` entry
  (kind:'event'; the copyright ruling as a documented event — cite 206 F.3d 1322).
- `person-shankara` (exists) → `person-vivekananda` (Advaita lineage claim — label the lineage-claim as the
  tradition's own framing).
- `person-zhang-boduan` → `wuzhen-pian` (exists); `person-liu-yiming` → `wuzhen-pian` (his commentary);
  `person-ge-hong` (exists) → rasa page Chinese lane (edge likely exists — verify).
- `person-ksemaraja` → `person-abhinavagupta` (exists; teacher–pupil, documented).
- `person-hakuin` → tummo/inner-heat parallel entry (describe as PARALLEL, not influence — no documented
  transmission; label "typological parallel", cite Shaw & Schiffer 1957).

---

## 6. Glossary & practice cross-links

- **REQUIRED disambiguation:** *kriyā-yoga* (Yoga Sūtras II.1: tapas–svādhyāya–īśvarapraṇidhāna) vs
  *Kriya Yoga* (Lahiri Mahasaya/Yogananda lineage technique) — one glossary entry with both senses,
  cross-linked from `pages/yoga/pada2.html` and the Yogananda wing.
- New/updated glossary terms (each cited to the catalog's editions): ṣaḍbala & aṣṭakavarga (BPHS →
  vedic wing), cara-kāraka (Jaimini), jhāna + kasiṇa (Visuddhimagga → yoga samādhi comparison),
  iddhi/vibhūti (paired entry — both traditions' power-claims described), bardo, terma/tertön, tummo
  (gtum-mo), bodhicitta, pratyabhijñā, spanda, neidan/jindan (Wuzhen pian), ṣaṭkarma (HYP/Gheraṇḍa),
  sokushin jōbutsu (Kūkai, if atlas entry ships), nāḍī-śodhana.
- Practices-wing hooks: Milarepa→`pages/abhichara/`; Visuddhimagga ch. XII ↔ `pages/yoga/pada3.html`
  (vibhūti); HYP/Gheraṇḍa guides on their existing pages; Yogananda ch. 16 ↔ `vedic-remedies.js` framing.

---

## 7. Builder's verification checklist (the flags a verifier will attack — resolve or keep flagged)

1. Rao's *Jaiminisutras* FIRST-edition year (pre-1930?) — until pinned, US status stays "plausibly PD, cite-only".
2. Pe Maung Tin vol. I: 1922 vs 1923 (JRAS review says "[1922]"; PTS catalog says 1923) — keep flagged in-data.
3. V. Subrahmanya Sastri's death year (drives India/URAA status of the 1932–33 and 1937/1950 translations).
4. *Phaladīpikā* Sastri 1st-edition year (1937 commonly given; only the 1950 2nd ed. was sighted this round).
5. Stanford-renewal/CCE searches: PAAAS 73 (1939) & 74 (1941); Monumenta Serica 6/9/11 (1941–46);
   Golden Flower 1931 (moot after 2027-01-01 but honest to log).
6. Exact page span of Davis & Chao 1939 (97–117 — still from secondary listings; vol. 73 **no. 5, July 1939** was confirmed 2026-07-16).
7. Yogananda's pre-1930 minor works' first-edition years (*Songs of the Soul* 1923, *Science of Religion*
  1924, *Whispers from Eternity* 1929) against scans before marking quote-safe; Autobiography first-edition
  chapter count (48).
8. P. T. Shrinivas Iyengar's *Śivasūtravimarśinī* (1912) — locate a scan before marking quote-safe.
9. A genuine 1929 first edition of Sivananda's *Practice of Yoga* (would be his one US-PD title).
10. 19th-c. Bengali BPHS edition — locate an actual dated scan or drop the claim.
11. Confirm no existing atlas entries for Tsongkhapa/Dōgen persons (mentions were seen at lines ~1252, ~2363,
   ~2796 of `confluence.js`) before adding slugs.
12. CONFLUENCE_LANES vocabulary — reuse existing lane keys (e.g. `tantra-rasa`) rather than inventing new ones
   without updating the lanes export.

---

## 8. Sources consulted this round

- Project Gutenberg, *Autobiography of a Yogi* (first ed.) — gutenberg.org/files/7452 (PD statement)
- Wikipedia, "Autobiography of a Yogi" (publication history; SRF v. Ananda, 206 F.3d 1322); Wikisource talk page (renewal 1974, ruled invalid)
- Ananda/Crystal Clarity "original 1946 edition" pages — ananda.org/autobiography; crystalclarity.com publisher's notes
- archive.org: `wg1079` (Bṛhat Jātaka, Iyer 1885); `bihatsahitvarah00iyergoog` (Bṛhat Saṁhitā, Iyer 1884); `BrihatJataka2ndEd.ByVSubrahmanyaSastri`; HathiTrust 006938775 (Sastri Bṛhajjātaka, Mysore Govt Branch Press 1929); `JatakaParijata1932` + vol II 1933 scans; `in.ernet.dli.2015.486584` (Jaimini Sutras, Rao, 1949); `PratyabhijnaHrdayamTheSecretOfRecognitionKurtLeideckerF.Adyar` (Adyar 1938); `pathofpuritybein01budduoft`
- Pali Text Society product page, *The Path of Purity* (3 vols, 1923/1929/1931); Cambridge Core JRAS reviews of Parts I & II
- Wikipedia, "The Secret of the Golden Flower" (1931 Baynes English; 1962 revised ed.)
- Wikipedia + Theosophy Wiki, "Walter Evans-Wentz" (1927/1928/1935/1954 OUP volumes; Kazi Dawa-Samdup)
- Wikipedia, "Baopuzi" (Feifel MS 6/9/11 1941–46; Davis & Ch'en PAAAS 74 (1941) 297–325; Ware 1966)
- Secondary listings for Davis & Chao Yün-ts'ung, PAAAS 73 (1939) on Chang Po-tuan's Wu Chen P'ien
- auro-ebooks.com, "Copyright on Sri Aurobindo and the Mother Works" (lifetime works PD in India; posthumous ©); Wikimedia Commons, "Copyright rules by territory/India" (life+60)
- dlshq.org (free downloads; republication by permission of the General Secretary)
- wisdomlib.org (Phaladeepika 2nd ed. 1950 Sastri OCR; Bṛhat Saṁhitā English)
- Wikipedia, "Brihat Parashara Hora Shastra" (97-chapter Santhanam 1984 = first complete English; recensions)
- Repo files: `assets/js/core/data/greatworks.js`, `practitioners.js`, `confluence.js`, `prasna-data.js`, `kuta-data.js`, `muhurta-data.js`, `rasa-data.js`, `vedic-remedies.js`; `pages/greatworks/`, `pages/yoga/`
- Duke Law Public Domain Day pages (95-year rule — method inherited from greatworks.js); US Copyright Office Circular 38B (URAA) — rule statements

**Adversarial verification pass (2026-07-16) — sources used for the corrections and confirmations above:**
- *SRF v. Ananda* 2000 opinion text via FindLaw (caselaw.findlaw.com/court/us-9th-circuit/1082695.html) — work-for-hire/corporate-body rejected; books' renewal summary judgment affirmed for Ananda; assignment issues remanded
- Wikisource, "US District Court Jury Verdict SRF v Ananda 2002" + yoganandafortheworld.com — 2002 final split (nine magazine series 1943–76 + six 1949–51 recordings + unpublished works to SRF; all photographs to Ananda; $29k on recordings)
- anuttaratrikakula.org/tantraloka-translation + Amazon listing (Vol. One, 2023) — Dyczkowski's complete 11-volume English Tantrāloka IS published → §2.10 corrected
- palitextsociety.org product page + Cambridge Core JRAS reviews — Path of Purity 3 vols 1923 ("[1922]" per JRAS)/1929/1931 confirmed
- Wikipedia "Brihat Parashara Hora Shastra" — Rao & Choudhari 1963 partial English precedes Santhanam; 97-chapter Santhanam standard
- sacred-texts.com/bud/tpol/ (Barnett front matter) — abridgment specifics (prolix omissions; bulk of ch. IX omitted)
- sivanandaonline.org "Copyright of all the Books of The Divine Life Society" + dlshq.org — © vests in The Divine Life Trust Society; republication by written permission of the General Secretary (free-to-read ≠ licence) — CONFIRMS §2.30
- auro-ebooks.com "Copyright on Sri Aurobindo and the Mother" — lifetime works PD in India, posthumous works still © — CONFIRMS §2.28
- encyclopedia.com "Rao, Bangalore Suryanarain (1856–1937)" — dates confirmed; first-edition year of *Jaiminisutras* still unpinned (earliest scan remains the 1949 DLI item) — flag stands
- Wikipedia "The Secret of the Golden Flower" — Baynes English 1931; revised ed. Harcourt, Brace & World 1962 — CONFIRMS the 2027-01-01 flip entry
- Wikipedia "Walter Evans-Wentz" — 1927/1928/1935/1954 OUP volumes and Kazi Dawa-Samdup (1868–1922) confirmed
- archive.org/details/wg1079 — Iyer 1885 Bṛhat Jātaka scan confirmed; archive.org/details/BrihatJataka2ndEd.ByVSubrahmanyaSastri + HathiTrust 006938775 — Sastri Mysore Govt Branch Press 1929 confirmed (HathiTrust record itself returned 403 this round; title match seen via search snippet)
- Wikipedia/Dharmawiki "Raja Yoga (book)" — first published July 1896; imprint varies (Vedanta-circle NY issue vs Longmans, Green)
