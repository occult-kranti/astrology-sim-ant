# R28 PLAN — The Buddhist Scriptures Wing (`pages/buddhist/`)

**Word-by-word + sentence translations of a curated Buddhist canon, in the manner of the Yoga Sūtras wing.**
Plan-only round, 2026-07-16. Nothing in this document has been written into the repo.
Builder target: Opus coders under the site invariants (core/** pure & DOM-free, DOM in app/**, DS2 tokens,
reduced-motion-first, registry + engine-test + glossary + AI-assistant integration, honest-science framing LOCKED).

---

## 0. Executive summary

The Yoga Sūtras wing (`pages/yoga/*`, `assets/js/core/yogasutra.js`, `assets/js/core/data/yogasutra/*`)
proved the pattern: per-word gloss tables, whole-sentence translation, a collapsible classical-commentary
gist ("bhāṣya layer"), edition variants flagged never resolved, every record source-stamped, counts computed
live from data. This plan ports that pattern to a **curated** Buddhist canon — the full canon is ~40 printed
volumes and will never be word-by-word'd; honest curation is itself part of the honest framing.

The single most important finding of this round: **the licensing situation is unusually good.** Bhikkhu
Sujato's complete translations of the four Nikāyas + Dhammapada + Suttanipāta on SuttaCentral are dedicated
to the public domain (CC0 1.0), and SuttaCentral declares the root Pāli text (Mahāsaṅgīti Tipiṭaka) public
domain. That gives Tier 1 a modern, accurate, **zero-restriction** translation layer — something the Yoga
wing never had (it had to lean on 1912/1914 prose). The word-by-word gloss layer must still be **written
originally** against the public-domain PTS Pali-English Dictionary (1921–25), with the CC BY-NC-SA Digital
Pāḷi Dictionary used strictly as a *verification instrument, never a source of copied text* (a deliberate
licence firewall, §1.9).

**Tier 1 (full word-by-word):** Metta Sutta (Snp 1.8), Heart Sūtra (shorter Skt + Chinese), Ānāpānasati
Sutta (MN 118), Satipaṭṭhāna Sutta (MN 10), Dhammapada (423 verses, phased by vagga).
**Tier 2 (sentence-by-sentence):** Dhammacakkappavattana (SN 56.11), Diamond Sūtra, Platform Sūtra ch. 1–2
(Wong Mou-lam 1930 — **US-PD as of 1 Jan 2026**), Visuddhimagga meditation-method excerpts (via PD sources
only — Ñāṇamoli is NOT PD; Warren 1896 and Pe Maung Tin vols I–II are).
**Tier 3 (catalogued):** a canon map of all three piṭakas + the chosen Mahāyāna sūtras, one cited paragraph
per collection, deep links to SuttaCentral.

Ship order: infrastructure + Metta + Heart + Dhammapada vagga 1–2 + sources page + canon map first
(cleanest licences, highest value per encoded word); MN 118 and MN 10 second (the refrain/peyyāla data model
is the main design risk, solved in §3.4); the remaining 24 Dhammapada vaggas third (the big encoding grind,
~3,800 word records); Tier 2 last (Platform/Diamond/Visuddhimagga; Path of Purity vol. III becomes US-PD
**1 Jan 2027** and is explicitly deferred until then).

---

## 1. LICENSING AUDIT — the gate (verified 2026-07-16, citations per item)

Site policy baseline (already locked elsewhere in the repo, see `GW_CITATION` in
`assets/js/core/data/greatworks.js` / registry line ~982): *"Public-domain status determined under the US
95-year rule + renewal evidence; PD editions quoted (edition-cited), copyrighted editions cite-only."*
This wing follows the same **US-law** standard and the same quote-safe vs cite-only distinction.
Key date fact used repeatedly below: under 17 U.S.C. §304's 95-year publication term, **works published in
1930 entered the US public domain on 1 January 2026** (today's date is 2026-07-16, so "pre-1931 ⇒ US-PD").

### 1.1 SuttaCentral — Bhikkhu Sujato's translations: **CC0 1.0 (public-domain dedication)** ✅ quote-safe

Verified against the licensing page source text in the SuttaCentral repo
(`suttacentral/suttacentral`, `client/localization/elements/licensing_en.json`, fetched 2026-07-16 —
this is the exact copy rendered at https://suttacentral.net/licensing, which is an SPA):

> *"All original material created by SuttaCentral is dedicated to the Public Domain by means of
> Creative Commons Zero (CC0 1.0 Universal)."* (licensing:6)
> *"This includes all text, design, software, and images created by SuttaCentral or persons working for
> SuttaCentral, on the domain suttacentral.net … unless otherwise specified."* (licensing:7)
> *"You are invited to copy, alter, redistribute, present, perform, convey, or make use of any or all of
> this material in any way you wish."* (licensing:8)

Sujato's four-Nikāya translations, his Dhammapada (*Sayings of the Dhamma*, SuttaCentral 2021, rev. 2023)
and his Suttanipāta are "original material created by SuttaCentral" and are individually marked CC0 in
their publication metadata (see https://suttacentral.net/edition/dhp/en/sujato and the machine-readable
segment files in the `suttacentral/bilara-data` repo). **This is the wing's primary translation layer for
every Pāli Tier-1 text.**

Two caveats to state honestly on the wing's sources page:

1. **Legacy translations on SuttaCentral are NOT CC0.** licensing:14: *"For certain of the material on
   SuttaCentral the copyright has been asserted by third parties. This includes many of the 'legacy'
   translated texts; that is, those that were originally published elsewhere."* (So: Bodhi, Ñāṇamoli,
   Horner, Thanissaro texts hosted there remain under their own terms — never ingest them from SC.)
2. **The AI request.** licensing:27: *"SuttaCentral does not make use of artifically-generated data. We
   politely request that our content not be scraped or used in any way for the creation of datasets for
   generative AI or similar."* CC0 makes this a request, not a licence term, and this wing is a
   hand-curated, attributed, human-verified study edition — not an AI training dataset — but the sources
   page should acknowledge the request and carry a prominent attribution + linkback as the site's answer
   to it. Encoding must be done from the cited editions by hand (which is already the site's discipline).

### 1.2 The root Pāli text — Mahāsaṅgīti Tipiṭaka: **declared public domain** ✅ quote-safe

licensing:24 (same file): *"The original texts of Buddhism in Pali, Chinese, Sanskrit, Tibetan, and other
languages are in the public domain. Such material does not fall within the scope of copyright."* (linked to
the CC Public Domain Mark 1.0). SuttaCentral's Pāli is the **Mahāsaṅgīti Tipiṭaka Buddhavasse 2500**
(World Tipiṭaka, Dhamma Society, Bangkok, 2005; a corrected electronic descendant of the 1956 Chaṭṭha
Saṅgāyana text). Independent mirrors also mark it CC0/PD (e.g. tipitaka2500.github.io: *"This work has been
marked as dedicated to the public domain"*). The honest position to state in-data: the underlying canonical
text is ancient and uncopyrightable; the Mahāsaṅgīti *edition* is distributed as public domain by
SuttaCentral (its publisher-partner); cite it per record as
`Pāli: Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (Dhamma Society, 2005), via SuttaCentral (declared PD)`.
Theoretical residual edition-copyright risk is negligible and mitigated by SC's explicit declaration —
but flag it in one sentence on the sources page rather than hiding it.

### 1.3 Bhikkhu Ānandajoti (ancient-buddhist-texts.net): **CC BY-SA 3.0 Unported** ⚠️ usable with conditions

His Copyright Notice page (https://ancient-buddhist-texts.net/Miscellaneous/Copyright-Notice.htm, fetched
2026-07-16) places his own Pāli editions, introductions, translations, studies and notes under the
**Creative Commons Attribution-ShareAlike 3.0 Unported License**, attribution to "Anandajoti Bhikkhu" —
EXCEPT works he reprints that belong to others (PTS's Mahāvaṁsa/Cūlavaṁsa and Patna Dharmapada; the
Gāndhārī Dharmapada is Motilal Banarsidass's copyright, not PTS's [precision corrected by the 2026-07-16
verification pass against the notice itself]; plus individually-permissioned articles; none of those are
under his licence).

Consequence: his metrical editions and line-by-line studies (e.g. the Safeguard Recitals texts incl. the
Metta Sutta, *The Ways of Attending to Mindfulness* for MN 10) are legally usable **but BY-SA is viral**:
any data module that includes his text verbatim must itself be offered under BY-SA and say so. Since the
whole wing otherwise runs on PD/CC0, the plan's default is **cite-only for Ānandajoti** (use him as a
verification/cross-check source, credited on the sources page) and **do not ingest his prose verbatim** —
keeping every shipped data module licence-uniform. If a builder later wants his metrical markup, it goes in
a clearly-marked separate module with a BY-SA header. This is a policy decision, recorded here.

### 1.4 Old PTS translations (PD by age — but strictly per volume) ⚠️ check each volume

- T.W. & C.A.F. Rhys Davids, *Dialogues of the Buddha* (DN), 3 vols: **1899, 1910, 1921** — all pre-1931 ⇒
  **US-PD** ✅ (relevant if DN 22 Mahāsatipaṭṭhāna or DN 16 excerpts are ever added).
- Lord Chalmers, *Further Dialogues of the Buddha* (MN), 2 vols: **1926, 1927** — **US-PD** ✅ (a useful
  PD control translation for MN 10/118 alongside Sujato).
- C.A.F. Rhys Davids & F.L. Woodward, *Kindred Sayings* (SN): vols I–IV **1917–1927** US-PD ✅; vol V
  **1930** — US-PD **as of 1 Jan 2026** ✅ (vol V contains SN 56.11; note the fresh date in-data).
- F.L. Woodward & E.M. Hare, *Gradual Sayings* (AN), **1932–1936** — **NOT US-PD** ❌ (95-year rule:
  vol 1 clears 1 Jan 2028). Cite-only.
- I.B. Horner, *Middle Length Sayings* (MN), **1954–1959** — **NOT PD** ❌ (and PTS asserts copyright).
  Never ingest. A verifier should specifically check that no Horner phrasing leaks into MN 10/118 records.
- PTS *Pali-English Dictionary* (Rhys Davids & Stede, Chipstead, **1921–1925**) — **US-PD** ✅; free
  digital copies: U. Chicago DSAL (https://dsal.uchicago.edu/dictionaries/pali/), Internet Archive
  (`palitextsocietys00pali`). **This is the wing's quotable gloss authority** (§1.9).

### 1.5 Thanissaro Bhikkhu / dhammatalks.org: **CC BY-NC 4.0 with a hardened NC** ❌ cite-only

Verified from an in-book copyright page (https://www.dhammatalks.org/books/IntoTheStream/Section0002.html,
fetched 2026-07-16): *"This work is licensed under the Creative Commons Attribution-NonCommercial 4.0
International"* plus the added condition *"'Commercial' shall mean any sale, whether for commercial or
non-profit purposes or entities."* (Some earlier works are CC BY-NC 3.0 or bare "for free distribution
only".) The Workbench itself is free, so NC use would arguably be lawful **today** — but ingesting NC text
would (a) break the repo's uniform "anyone may reuse everything" posture and (b) poison downstream reuse of
the data modules. **Decision: never ingest Thanissaro's wording; cite him on the sources page and in
`note` fields as a cross-check translation only.** This mirrors how the site treats Conze, Horner, etc.

### 1.6 Access to Insight: **per-page licences, no blanket permission** ❌ cite-only

Its FAQ (https://www.accesstoinsight.org/faq.html, fetched 2026-07-16) states the pages are protected by
*"one of several kinds of copyright licenses … Some … modern Creative Commons licenses, while some are
home-made licenses"*, shown at the bottom of each page; the FAQ page itself is CC BY 4.0; and *"you must
not sell any texts copied or derived from this website."* Treat ATI as a **finding aid**, never a text
source; each hosted work keeps its own terms (e.g. §1.7 below).

### 1.7 Buddharakkhita's Dhammapada (BPS 1985): **restrictive free-distribution licence** ❌ cite-only

Exact terms from the ATI edition (https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.intro.budd.html,
fetched 2026-07-16): *"©1985 Buddhist Publication Society. You may copy, reformat, reprint, republish, and
redistribute this work in any medium whatsoever, provided that: (1) you only make such copies, etc.
available free of charge and, in the case of reprinting, only in quantities of no more than 50 copies;
(2) you clearly indicate that any derivatives of this work (including translations) are derived from this
source document; and (3) you include the full text of this license in any copies or derivatives of this
work. Otherwise, all rights reserved."* The 50-copy reprint cap and licence-inclusion duty make it
non-uniform with the wing; and it is unnecessary — Sujato's Dhammapada is CC0 and Müller's is PD.
**Cite-only** (it earns a row on the sources page as the most-read modern version).

### 1.8 Mahāyāna texts

- **Heart Sūtra** — F. Max Müller, in *Buddhist Mahâyâna Texts*, **SBE vol. 49 (Oxford, 1894)**: contains
  BOTH the larger and the smaller Prajñā-pāramitā-hṛdaya translated from Sanskrit ⇒ **US-PD** ✅
  (scan: archive.org `wg949` et al.). Sanskrit text: Müller & Bunyiu Nanjio, *Anecdota Oxoniensia*,
  Aryan Series I.3 (**1884**, from the Hōryū-ji palm-leaf ms.) ⇒ PD ✅. A PD translation **from the
  Chinese** (Xuanzang's T 251, the 260-character text): Samuel Beal, JRAS **1865** ⇒ PD ✅.
  **Edward Conze's editions/translations (1948–1975) are NOT PD** ❌ — cite-only, prominently, because
  every modern reader knows his wording ("gone, gone, gone beyond…" is his register).
- **Diamond Sūtra (Vajracchedikā)** — Müller, same SBE 49 (1894), from Sanskrit ⇒ PD ✅; William Gemmell,
  *The Diamond Sutra* (Trübner, **1912**), from Kumārajīva's Chinese ⇒ PD ✅. Conze (1957) ❌.
- **Platform Sūtra** — Wong Mou-lam, *Sutra Spoken by the Sixth Patriarch, Wei Lang* (Yu Ching Press,
  Shanghai, **1930**), the first English translation (of the Zongbao 1291 vulgate recension):
  **US-PD as of 1 January 2026** under the 95-year publication term ✅ — a fresh fact; state the rule and
  date in-data. **WARNING for builders:** use the 1930 Shanghai text (archive.org scans exist) — NOT the
  1944 Luzac & Co. edition "revised by Christmas Humphreys" (Humphreys d. 1983; the revision is a separate
  1944 work, not PD until 2040) and NOT Dwight Goddard's rewritten version in *A Buddhist Bible* (a
  paraphrase, and textually unfaithful). Philip Yampolsky's 1967 Dunhuang-text translation ❌ NOT PD.
- **Dhammapada** — Müller, SBE vol. 10 (**1881**) PD ✅ (the famous Victorian control translation);
  Sujato CC0 ✅ (primary); Buddharakkhita ❌ (§1.7); K.R. Norman (PTS 1997) ❌.

### 1.9 Dictionaries for the word-gloss layer — the licence firewall

- **PTS PED (1921–25): US-PD** ✅ — glosses may be quoted/adapted verbatim, cited per record.
- **Digital Pāḷi Dictionary (dpdict.net, github.com/digitalpalidictionary/dpd-db): CC BY-NC-SA 4.0** ⚠️
  (stated in its docs/repo, verified 2026-07-16). NC-SA is incompatible with the wing's PD/CC0 posture.
  **Policy: DPD is a verification instrument only.** Builders look words up in DPD to *check* grammar
  identifications and sense-choices, but the `gloss` strings shipped in-data are written originally or
  taken from the PD PED. Grammatical *facts* (case, number, root, compound resolution) are
  uncopyrightable facts; expressive definition prose is not. The engine-test cannot check this; the
  sources page must state the discipline, and the verification pass (§6) enforces it by review.
- SC's *New Concise Pali English Dictionary* derives from Buddhadatta (1949, not PD) — avoid quoting.

### 1.10 Visuddhimagga (Tier 2)

- Bhikkhu Ñāṇamoli, *The Path of Purification* (1956; BPS ed. 2010) — **NOT PD** ❌; BPS distributes the
  PDF under free-distribution terms that do not permit re-hosting excerpts in a derivative data module.
  Cite-only.
- Henry Clarke Warren, *Buddhism in Translations* (Harvard Oriental Series 3, **1896**) — **PD** ✅ —
  contains substantial Visuddhimagga excerpts (incl. kasiṇa and dhutaṅga passages). Quote-safe.
- Pe Maung Tin, *The Path of Purity* (PTS Translation Series 11, 17, 21): vol I **1922/23**, vol II
  **1929** ⇒ **US-PD now** ✅; vol III (**1931**) ⇒ **US-PD on 1 Jan 2027** ⏳ — the plan explicitly
  defers any vol-III material (which covers the paññā chapters) to a post-2027 phase, and says so on the
  sources page. (Note the JRAS review dates Part I "[1922]"; some catalogues say 1923 — either way pre-1931.)
- The Pāli Visuddhimagga itself: ancient text, PD (Mahāsaṅgīti / VRI editions).

### 1.11 Licence classes → in-data tag (every record carries one)

| tag | meaning | examples |
|---|---|---|
| `pd-age` | US-PD by the 95-year rule (year stated) | Müller 1881/1894, PED 1921–25, Warren 1896, Wong 1930, Chalmers 1926–27 |
| `cc0` | dedicated to the public domain | Sujato/SuttaCentral translations, Mahāsaṅgīti Pāli (as declared by SC) |
| `original` | written for this wing (gloss/grammar/commentary-gist prose) | word glosses, aṭṭhakathā gists |
| *(cite-only — never a tag on shipped text)* | consulted, quoted ≤ short attributed snippets in notes, or merely cited | Thanissaro, Conze, Horner, Norman, Buddharakkhita, DPD, Ñāṇamoli, Ānandajoti (by policy §1.3) |

The engine-test asserts `licence ∈ {pd-age, cc0, original}` on every text-bearing field's source stamp.

---

## 2. What the Yoga wing pattern gives us (internalized)

From `assets/js/core/yogasutra.js`, `assets/js/core/data/yogasutra/{meta,pada1..4}.js`,
`assets/js/app/yoga.js`, `pages/yoga/*.html`:

1. **Record shape** `{ num, devanagari, iast, words:[{sa,gloss}], translation, bhashya, bhashyaSrc, note, src }`
   — per-word gloss table + whole-unit translation + collapsible classical-commentary gist + per-record
   provenance string + variant notes.
2. **A pure flattening core** (`yogasutra.js`) that imports the data modules, normalizes to ONE shape,
   and exposes `byRef()`, `search()` (diacritic-folded), `counts()` computed **live from the data**.
3. **One app module** (`app/yoga.js`) driving all pages via `init(page)`; client-side filter; anchors
   (`#s2`); numbering toggles for edition disputes.
4. **A sources page** that names the edition stack, states transcription hygiene, flags verified
   corrections, and admits coverage limits ("spot-verified", "the one honestly open item").
5. **Contested = both positions, never resolved** (the III.22 variant, Bhoja's IV numbering, dual totals).
6. Registry entry with `computes/inputs/outputShape/citation/pages/glossaryTerms`; engine-test assertions
   on counts, lookups, and data hygiene; glossary terms; the assistant reads it all via `llm-context.js`.

The Buddhist wing copies all six, with three deltas: (a) Pāli is canonical **in Roman script** (the
Mahāsaṅgīti is a Roman-script edition; no Devanāgarī column — the Heart Sūtra alone gets an optional
Devanāgarī/Siddhaṃ note), (b) prose suttas need a **segment** model, not just numbered verses, and
(c) suttas abbreviate repetitions (**peyyāla**) — the data model must handle refrains honestly (§3.4).

---

## 3. Data model

### 3.1 Directory layout (mirrors `yogasutra/`)

```
assets/js/core/data/buddhist/
  meta.js            — canon map data (Tier 3), edition/counting notes, source stack, citations
  metta.js           — Snp 1.8 (= Khp 9), 10 verses, word-by-word          [Tier 1]
  heart.js           — Prajñāpāramitā-hṛdaya (shorter), Skt word-by-word
                       + the Xuanzang Chinese text + Beal 1865 rendering    [Tier 1]
  dhammapada/
    meta.js          — the 26 vaggas, verse ranges, recension notes
    vagga01.js … vagga26.js — 423 verses, word-by-word, phased             [Tier 1]
  mn118.js           — Ānāpānasati Sutta, segments + refrains               [Tier 1]
  mn10.js            — Satipaṭṭhāna Sutta, segments + refrains              [Tier 1]
  tier2.js           — sentence-aligned texts: SN 56.11, Diamond, Platform
                       ch.1–2, Visuddhimagga excerpts (one shape, §3.5)     [Tier 2]
assets/js/core/buddhist.js  — the PURE reading layer (flatten, byRef, search, counts)
```

### 3.2 Word-by-word record (verse texts: Metta, Dhammapada, Heart)

```js
{
  ref: 'Dhp 1',                 // human ref; Dhp uses verse numbers, Metta 'Snp 1.8 v.1' (+ Sn 143 note)
  vagga: 1,                     // Dhammapada only
  pali: 'manopubbaṅgamā dhammā manoseṭṭhā manomayā …',   // Mahāsaṅgīti, Roman, NFC
  words: [
    { pa: 'manopubbaṅgamā', gloss: 'preceded by mind (mano- + pubbaṅgama)',
      gram: 'adj., nom. pl. m.; cpd.' },
    …
  ],
  translation: '…',             // Sujato (CC0), verbatim, or 'after Sujato' when trivially adjusted
  transSrc: 'Sujato, Sayings of the Dhamma (SuttaCentral, 2021/2023; CC0)',
  altTranslation: '…',          // Müller SBE 10 (1881) — the PD Victorian control, shown collapsed
  altSrc: 'Müller, SBE X (1881; PD)',
  commentary: '…',              // 1–3 sentence gist of the aṭṭhakathā background story/exegesis, ORIGINAL prose
  commentarySrc: 'after the Dhammapada-aṭṭhakathā, trans. Burlingame, Buddhist Legends (HOS 28–30, 1921; PD)',
  note: '',                     // variants/recension flags (e.g. Patna/Gāndhārī parallels), CONTESTED both-ways
  src: 'Pāli: Mahāsaṅgīti (via SuttaCentral, PD); glosses: original, after PED (1921–25, PD), DPD-checked',
  licence: { pali: 'cc0', words: 'original', translation: 'cc0', alt: 'pd-age', commentary: 'original' },
}
```

- `words[].gram` is new vs the Yoga wing (which had `{sa,gloss}` only) — Pāli glossing without case/number
  is half-useless for study, and the grammatical *facts* are licence-clean (§1.9). Keep terse
  (`'nom. sg. m.'`, `'aor. 3 pl. of √gam'`); a one-time legend on the sources page defines abbreviations.
- The **commentary layer** (the wing's analog of the bhāṣya layer) = the aṭṭhakathā gist: for the
  Dhammapada, Buddhaghosa's Dhammapada-aṭṭhakathā via **E.W. Burlingame, Buddhist Legends, HOS 28–30
  (1921) — PD** ✅ (this is the licensing find that makes the layer possible); for MN 10/118, the
  Papañcasūdanī — which has **no complete PD English translation**, so gists there are original paraphrases
  cited to the Pāli aṭṭhakathā (VRI ed.) + Warren/Path-of-Purity where they translate the parallel passage;
  where no PD access exists, `commentary: null` honestly (the Yoga wing already allows a null bhāṣya).
- Heart Sūtra records use `sa:` instead of `pa:` in `words[]`, add `devanagari` (from Müller–Nanjio 1884)
  and a parallel `zh` field on each sentence record carrying Xuanzang's T 251 text, with `translation` =
  after Müller (1894) and `altTranslation` = Beal (1865, from the Chinese). Conze is cite-only in `note`.

### 3.3 Segment record (prose suttas: MN 10, MN 118)

Use **SuttaCentral's Bilara segment IDs as the canonical `ref`** (`'mn10:1.2'`, `'mn118:17.3'`): they are
the community-standard citation grain, they align 1:1 with both the Mahāsaṅgīti Pāli and Sujato's CC0
translation (both distributed as segment-keyed JSON in `suttacentral/bilara-data`), and they make the
verifier's job mechanical.

```js
{
  ref: 'mn118:17.1', section: 'The sixteen aspects', tetrad: 1,   // section headers from the text's own structure
  pali: '…', words: [ {pa, gloss, gram}, … ],   // words[] present on Tier-1 segments
  translation: '…', transSrc: 'Sujato (SuttaCentral, CC0)',
  commentary: null | '…', note: '', src: '…', licence: {…},
}
```

### 3.4 Refrains / peyyāla (the honest-repetition model — the one real design problem)

MN 10's body applies an identical refrain ("Thus he abides contemplating the body internally…") after each
of its ~21 exercises, and the Pāli editions themselves abbreviate with `…pe…`. Expanding every repetition
word-by-word would triple the encoding cost while glossing the same words dozens of times; silently
dropping them would misrepresent the text. Model:

```js
{ id: 'mn10-refrain-body', kind: 'refrain', pali: '…full text…', words:[…], translation: '…', … }
{ ref: 'mn10:5.9', kind: 'refrain-use', refrain: 'mn10-refrain-body', substitutions: { kāye: 'vedanāsu' } }
```

The reading layer expands `refrain-use` records on demand (`expandSegment(ref)`), the page renders them
collapsed by default ("⟲ refrain — contemplating feelings…", expandable to the full glossed table), and the
sources page documents the device, noting that the manuscript tradition's own `…pe…` is the precedent.
The engine-test asserts every `refrain` id referenced exists and every substitution key occurs in the
refrain's `words[]`.

### 3.5 Tier-2 sentence record (no `words[]`)

```js
{ text: 'platform', ref: 'ch.1 §2', original: '…' /* Chinese or Pāli/Skt */, translation: '…',
  transSrc: 'Wong Mou-lam (Yu Ching Press, Shanghai, 1930; US-PD 1 Jan 2026)',
  note: '', src: '…', licence: {…} }
```

Tier-2 texts each get a header record in `tier2.js` with `textMeta` (recension, translator, licence story,
CONTESTED blocks — e.g. the Platform Sūtra's Dunhuang-vs-vulgate problem, §7).

### 3.6 The pure reading layer — `assets/js/core/buddhist.js`

Mirrors `yogasutra.js`: imports all data modules; exports
`ALL_TEXTS` (per-text metadata + records), `textByRef('Dhp 24')` / `segByRef('mn10:5.9')` (accepts
`'Dhp 24'`, `'dhp24'`, `'MN 10 §5.9'`, Bilara ids), `searchBuddhist(q)` (diacritic-folded across
pali/gloss/translation — reuse the `fold()` idiom), `expandSegment(ref)` (peyyāla resolution),
`counts()` (live: 423 Dhp verses across 26 vaggas, 10 Metta verses, segment/word totals per text — never
hard-typed), and `BUDDHIST_CITATION`. No DOM, no side effects.

---

## 4. Scope tiers & honest effort estimates

Word-record counts below are estimated from the actual texts (Mahāsaṅgīti word counts, refrains deduped);
the Yoga wing's 196 sūtras ≈ 1,300 word entries is the calibration unit ("1 YS").

| Text | Unit count | ~word records | ≈ YS units | Notes |
|---|---|---|---|---|
| **T1** Metta Sutta (Snp 1.8) | 10 verses | ~90 | 0.07 | The cheap, beloved opener. |
| **T1** Heart Sūtra (shorter) | ~16 sentences | ~260 (Skt) | 0.2 | + Chinese parallel text (not word-glossed; sentence-aligned). |
| **T1** Ānāpānasati (MN 118) | ~110 segments | ~1,300 unique + 4 refrains | 1.0 | Sixteen aspects / four tetrads structure is highly repetitive → refrain model shines. |
| **T1** Satipaṭṭhāna (MN 10) | ~150 segments | ~1,900 unique + 2 refrains | 1.5 | The longest Tier-1 item. |
| **T1** Dhammapada | 423 verses / 26 vaggas | ~3,800 | 3.0 | THE grind. Phased per vagga; counts() exposes per-vagga completeness so partial shipping is honest ("vaggas 1–2 of 26 glossed; all 423 translations present"). |
| **T2** SN 56.11 | ~40 sentences | — | 0.1 | Sentence-only. |
| **T2** Diamond Sūtra | 32 chapters | — | 0.3 | Müller/Gemmell sentence pairs, chapter-level. |
| **T2** Platform Sūtra ch. 1–2 | ~120 sentences | — | 0.3 | Wong 1930; rest of chapters Tier 3-style summaries. |
| **T2** Visuddhimagga excerpts | ~6 passages | — | 0.2 | Warren 1896 + Path of Purity I–II only until 2027. |
| **T3** Canon map | ~45 catalogue rows | — | 0.3 | Three piṭakas → nikāyas → notable suttas, one cited ¶ each + SC links. |

Total ≈ **7 YS units** — i.e. the full wing is several rounds of work. Hence the phasing in §8: nothing
ships half-glossed *silently*; the data model carries per-text `coverage` so pages and the registry state
exactly what is and isn't done (the Yoga sources page's "coverage & limits" section is the template).

**Curation rationale (goes on the index page, cited):** the Pāli canon alone is ~40 volumes in the PTS
edition; this wing selects (a) the two suttas that define Buddhist meditation method (MN 10, MN 118 — both
already entries in the Confluence atlas's buddhist lane), (b) the two most-memorized short texts (Metta,
Dhammapada), and (c) the two Mahāyāna texts that dominate East-Asian practice (Heart, Diamond) + the one
Chan classic with a fresh-PD translation (Platform). Everything else is catalogued, not encoded — stated
plainly, with SuttaCentral links for the rest.

---

## 5. Pages (`pages/buddhist/`) + app module

```
pages/buddhist/
  index.html        — wing home: what/why/curation-honesty, live counts table (per-text, per-vagga
                      coverage), site-wide search box (searchBuddhist), tier map
  metta.html        — Tier-1 browser (verse cards: Pāli → word table → translation → ⌄ commentary → note)
  heart.html        — Tier-1 browser + the three-column view (Skt | Chinese | English), origins CONTESTED panel
  dhammapada.html   — one page, vagga picker + client-side filter (423 cards is fine — the Confluence
                      page renders 188 rich nodes; keep cards light, lazy-render below the fold)
  mn118.html        — segment browser with tetrad nav rail + collapsible refrains
  mn10.html         — segment browser with section nav rail + collapsible refrains
  canon.html        — Tier 3: the canon map (piṭakas/nikāyas/Mahāyāna shelf), SC deep links
  texts2.html       — Tier 2 reader (SN 56.11 · Diamond · Platform · Visuddhimagga excerpts), text picker
  sources.html      — THE LICENSING/EDITIONS PAGE (the §1 audit rendered for readers: the edition stack
                      table with quote-safe vs cite-only columns, the licence-firewall statement, the
                      SC AI-request acknowledgment, transcription hygiene, coverage & limits)
assets/js/app/buddhist.js  — one module, initBuddhist(page), mirrors app/yoga.js (filter, anchors,
                             refrain expand/collapse — <details> so it's reduced-motion-safe by default)
assets/css/buddhist.css    — clone yoga.css grammar (word-table, card, filterbar) on DS2 tokens
```

UI details carried over: anchor per record (`#dhp24`, `#seg-17-1`); diacritic-folded filter; "N records"
live count; pager between sibling pages; every card footer shows its `src` string. New: a small
`licence` chip per card (PD / CC0 / original) — the wing's distinguishing honesty feature, cheap to render.

**Cross-links:** index.html links the Confluence atlas buddhist lane (existing slugs
`satipatthana-sutta`, `anapanasati-sutta`, `heart-sutra` if present — verify slugs at build time) via
`pages/confluence.html#<slug>`; MN 118/MN 10 pages link back to those atlas entries and to the
Practitioners' Library indian domain rows for meditation teachers; the Yoga wing's theory page ↔ MN 118
(breath-work described in both traditions — a described-never-prescribed comparison note, not a claim of
equivalence). Add the wing to the mega-menu (`pages/contents.html`), `how-it-works`, and the roadmap page.

---

## 6. Integration & verification (the site invariants)

1. **Registry** (`assets/js/core/registry.js`): one entry
   `id: 'buddhist-canon', module: 'assets/js/core/buddhist.js', exportName: 'textByRef',
   exports: ['searchBuddhist','counts','expandSegment','ALL_TEXTS']`, `callable: false` (reference wing,
   like `yoga-sutras`), `computes` naming the tiers + the described-never-prescribed line, `citation` =
   `BUDDHIST_CITATION`, `pages` + `howItWorks: 'pages/buddhist/sources.html#hiw-buddhist'`,
   `glossaryTerms` (below).
2. **Engine-test** (`scripts/engine-test.mjs`, new section like line ~1533's YS block):
   - counts: Dhammapada = 423 over 26 vaggas (live), Metta = 10, MN segment totals > 0 and match meta;
   - `textByRef('Dhp 1').pali` starts `'manopubbaṅgamā'`; `segByRef('mn118:1.1')` resolves;
   - every record: non-empty `src`, `licence` values ∈ {pd-age, cc0, original}, `words[]` entries all
     have `pa|sa` + `gloss`; NFC-normalized (assert `s === s.normalize('NFC')`); no Vedic-accent
     codepoints; no smart-quote mojibake;
   - refrain integrity per §3.4; `expandSegment` roundtrip;
   - search: `searchBuddhist('mindfulness')` hits MN 10; folded `'anapanasati'` matches `'ānāpānassati'`;
   - CONTESTED blocks (heart-sutra origins, platform recension) each carry ≥ 2 positions with sources.
3. **Glossary** (`assets/js/core/data/glossary.js`, cat `'Buddhist canon'`): Tipiṭaka, Nikāya, Sutta,
   Satipaṭṭhāna, Ānāpānasati, Jhāna, Mettā, Dukkha / Anicca / Anattā (three marks), Nibbāna,
   Peyyāla (repetition), Aṭṭhakathā, Prajñāpāramitā, Śūnyatā, Pāramitā, Vagga. (Vipassanā already exists
   via the Confluence wing — extend `see:` rather than duplicate.)
4. **AI assistant**: the registry entry flows into `llm-context.js` automatically; verify the assistant
   can answer "look up Dhp 5" from `computes`/`outputShape` phrasing (mirror the YS entry's style).
5. **Autolink**: add the wing's terms to `app/autolink.js` maps if that's how other wings do it (check at
   build time).
6. **Verify gate**: run the `verify-site` skill (Chromium sweep + audit + engine test) per MEMORY's
   `verify-gate-env.md` at the end of every phase.

**Gloss verification strategy (the per-word discipline):** every `words[]` entry is checked by the builder
against **PED** (DSAL page cited by headword) and **DPD** (lookup-only, §1.9); a second adversarial pass
(the site's accuracy-check pattern) samples ≥ 15% of word records per text + 100% of grammatically hard
ones (aorists, absolutives, compounds — greppable from `gram`), and 100% of `translation` strings are
diffed against the CC0 Bilara segment JSON (mechanical, since refs are Bilara ids). Discrepancies land in
`note`, never silently fixed — the Yoga wing's "Glosses mapped by content, not by number" hygiene note is
the model.

---

## 7. Honest framing — the CONTESTED ledger (both positions, never resolved)

Rendered as callout blocks on the relevant pages, stored in-data with two-position structure:

1. **Heart Sūtra origins** — Jan Nattier, "The Heart Sūtra: A Chinese Apocryphal Text?", *JIABS* 15.2
   (1992): the shorter text was composed in China (extracted from Kumārajīva's Large Sūtra) and
   back-translated into Sanskrit. vs. Indian-origin defenses (Harada Wasō; Ishii Kōsei's critiques;
   Red Pine's traditionalist position) and Attwood's recent philology largely supporting Nattier.
   FLAG CONTESTED — never resolved. (This block is the heart.html centerpiece.)
2. **Platform Sūtra recensions** — the Dunhuang ms. (~12k chars, c. 780) vs the Zongbao/Deqing vulgate
   (~22k chars, 1291) that Wong Mou-lam translated; scholarship (Yampolsky) treats the vulgate as heavily
   expanded. The wing translates what its PD source translates and says so.
3. **Dhammapada recensions** — Pāli 423 vv. vs Gāndhārī Dharmapada, Patna Dharmapada, Udānavarga (~1000
   vv.): shared verse-stock, different collections; no "original Dhammapada" is recoverable.
4. **MN 10 vs DN 22** — DN 22 = MN 10 + the expanded four-truths exposition; text-critical arguments
   (e.g. Sujato, *A History of Mindfulness*, and Anālayo's comparative studies vs the traditional view)
   that the satipaṭṭhāna texts grew by accretion. Both positions, cited.
5. **Dating & orality** — the canon was transmitted orally for centuries (traditional First-Council
   account vs. modern text-historical scepticism); the wing dates texts as ranges with positions cited
   (align with the Confluence atlas's existing buddhist-lane entries to avoid intra-site contradiction —
   engine-test can cross-check shared slugs' dateText).
6. **Practice claims** — jhāna states, awakening factors, kammic results: the texts' own claims,
   DESCRIBED never prescribed, no demonstrated validity as claims about the world; meditation
   instructions are presented as *what the historical text says*, with the site's standard rule-callout
   (clone the Yoga sources page's "The rule, again" block; link `pages/about/index.html`).

---

## 8. Phasing (each phase ends green on the verify gate)

- **Phase A — the frame + the clean wins** (ships first; ~1.5 YS units):
  core `buddhist.js` + meta + **Metta** (full word-by-word) + **Heart** (full, with the Nattier CONTESTED
  panel) + **Dhammapada vaggas 1–2** (Yamaka + Appamāda, 32 verses glossed; all 423 Sujato translations
  may ship at once — CC0 — with `words: null` on unglossed verses and the coverage counter honest about
  it) + **canon.html** (Tier 3) + **sources.html** (the §1 audit) + registry/engine-test/glossary/menu.
  Highest value per word, cleanest licences, establishes every pattern.
- **Phase B — the meditation suttas** (~2.5 YS): **MN 118** then **MN 10** (refrain model built in B,
  hardest engineering first on the shorter text) + confluence/practitioners cross-links + the Yoga-wing
  comparison note.
- **Phase C — the Dhammapada grind** (~2.5 YS): vaggas 3–26 in batches of ~4 vaggas per session, with the
  per-vagga adversarial gloss check; Burlingame aṭṭhakathā gists added per batch.
- **Phase D — Tier 2** (~1 YS): SN 56.11, Diamond (Müller + Gemmell dual), Platform ch. 1–2 (Wong 1930),
  Visuddhimagga excerpts via Warren + Path of Purity I–II. **Post-2027-01-01 rider:** Path of Purity
  vol. III material becomes US-PD — a dated TODO in meta.js.

---

## 9. Risks & mitigations

1. **Licence attack surface** — the two fresh-PD claims (Wong 1930 → PD 2026-01-01; Kindred Sayings V
   1930 → same) rest on the 95-year rule; state the rule + year in-data so a verifier can re-derive.
   The Mahāsaṅgīti "PD" status rests on SuttaCentral's declaration (licensing:24) — quoted verbatim on
   sources.html. DPD contamination risk → firewall policy (§1.9) + review-pass enforcement. Ānandajoti
   BY-SA virality → cite-only policy (§1.3).
2. **Scale honesty** — the Dhammapada is 3 YS units by itself; the coverage counters + phased vaggas keep
   partial states truthful (never "silently half-glossed").
3. **Gloss quality** — Pāli morphology is harder than YS Sanskrit lists (verbs abound); mitigations: the
   `gram` field forces explicitness, PED citations per headword, the ≥15% adversarial sample, and DPD
   lookup verification.
4. **Peyyāla model complexity** — contained in §3.4's two record kinds + one `expandSegment()` function +
   two engine-test assertions; build it in Phase B on MN 118 (fewer, more regular refrains) before MN 10.
5. **Intra-site consistency** — the Confluence atlas already asserts dates/claims for MN 10/MN 118;
   cross-check at build time so the two wings never disagree.
6. **SuttaCentral goodwill** — honor licensing:27 with prominent attribution, linkbacks per text, and
   hand-encoding; consider a courtesy note on the SC forum when the wing ships (optional, good citizenship).

---

## 10. Source-of-record URL list (for the builders' sources.html)

- SuttaCentral licensing copy: `suttacentral/suttacentral` repo, `client/localization/elements/licensing_en.json` (rendered at suttacentral.net/licensing) — CC0 declaration, PD root texts, legacy-copyright note, AI request.
- Sujato Dhammapada edition page: suttacentral.net/edition/dhp/en/sujato (CC0 statement in front matter).
- Segmented CC0 data: github.com/suttacentral/bilara-data (Pāli + Sujato translations, segment-keyed JSON).
- Mahāsaṅgīti mirror with PD mark: tipitaka2500.github.io.
- Ānandajoti copyright notice: ancient-buddhist-texts.net/Miscellaneous/Copyright-Notice.htm (CC BY-SA 3.0 + exceptions).
- Thanissaro terms: dhammatalks.org book copyright pages, e.g. /books/IntoTheStream/Section0002.html (CC BY-NC 4.0 + hardened "Commercial").
- Access to Insight FAQ: accesstoinsight.org/faq.html (per-page licences; no-sale rule).
- Buddharakkhita terms: accesstoinsight.org/tipitaka/kn/dhp/dhp.intro.budd.html (©1985 BPS free-distribution licence, verbatim in §1.7).
- DPD licence: github.com/digitalpalidictionary/dpd-db + digitalpalidictionary.github.io (CC BY-NC-SA 4.0).
- PED: dsal.uchicago.edu/dictionaries/pali/ + archive.org `palitextsocietys00pali` (1921–25, PD).
- Müller SBE 10 (1881), SBE 49 (1894): archive.org (e.g. item `wg949`); Müller–Nanjio 1884 Anecdota Oxoniensia.
- Gemmell, The Diamond Sutra (1912); Beal, JRAS 1865 (Heart from Chinese); Warren, Buddhism in Translations (HOS 3, 1896); Burlingame, Buddhist Legends (HOS 28–30, 1921); Chalmers, Further Dialogues (1926–27); Rhys Davids, Dialogues I–III (1899/1910/1921) — all archive.org, all pre-1931 ⇒ US-PD.
- Wong Mou-lam, Sutra of Wei Lang (Yu Ching Press, Shanghai, 1930) — archive.org scans of the 1930 printing; PD 2026-01-01; avoid the 1944 Luzac/Humphreys revision.
- Pe Maung Tin, Path of Purity I–III (PTS 1922/23, 1929, 1931) — archive.org `pathofpuritybein01budduoft` etc.; vol III PD 2027-01-01.
- Nattier, "The Heart Sūtra: A Chinese Apocryphal Text?", JIABS 15.2 (1992) — the CONTESTED anchor.

---

## Appendix A — MEASURED corpus metrics (computed from `suttacentral/bilara-data`, branch `published`, 2026-07-16)

A second research pass fetched the actual Mahāsaṅgīti root JSON files and counted them, so the effort
estimates in §4 rest on ground truth, not guesses. (Method: `root/pli/ms/**` segment files; a "word" is a
whitespace token; "unique forms" is case-folded, punctuation-stripped distinct tokens.)

| Text (bilara file) | Segments | Pāli word tokens | Unique word forms |
|---|---|---|---|
| Metta Sutta — `kp9` and `snp1.8` (identical text, both files verified) | 44 / 43 | **138** | 110 |
| MN 10 Satipaṭṭhāna — `mn10` | **235** | **2,522** | **549** |
| MN 118 Ānāpānasati — `mn118` | **154** | **1,551** | **350** |
| Dhammapada — 26 vagga files (`dhp1-20` … `dhp383-423`) | **2,234** | **5,618** | **3,041** |

Corrections these numbers impose on §4's estimates (builders: trust this table):

- **MN 10 is 235 segments, not ~150; MN 118 is 154, not ~110** — but the *unique-form* counts (549 / 350)
  are far below the "~1,900 / ~1,300 word records" estimates, because tokens repeat heavily. With the
  refrain model (§3.4) deduplicating the repetitions, the real glossing load is bounded below by unique
  forms and above by tokens-outside-refrains; plan MN 118 ≈ 1 YS unit and MN 10 ≈ 1.5 YS units as §4 says,
  with confidence rather than hope.
- **The Dhammapada is ~5,600 word tokens (3,041 unique forms), not ~3,800** — the grind is ~15–20% bigger
  than §4 estimated. Keep the three-tranche phasing of §8 Phase C and do not compress it.

**Canonical Dhammapada vagga boundaries** (encode in `dhammapada/meta.js`; the engine test must assert the
shipped vaggas match these verse ranges exactly, and that shipped vaggas are contiguous from 1):
1–20, 21–32, 33–43, 44–59, 60–75, 76–89, 90–99, 100–115, 116–128, 129–145, 146–156, 157–166, 167–178,
179–196, 197–208, 209–220, 221–234, 235–255, 256–272, 273–289, 290–305, 306–319, 320–333, 334–359,
360–382, 383–423 (= the 26 bilara file ranges, verified; total 423).

**One additional engine-test assertion (strongly recommended):** for every Tier-1 record, the concatenation
of `words[].pa` — after stripping the parenthesized compound-member notes, punctuation, and NFC/case
normalization — must reconstruct the record's `pali` string. This is the single strongest automatic check
that no word was silently skipped in glossing, and it is exactly the kind of live-from-data invariant the
YS wing's `counts()` established as house style.

**One additional licence anchor:** the CC0 status of the Bilara translations is ALSO asserted at repo level —
`suttacentral/bilara-data`, `LICENSE.md` (branch `published`), verbatim: *"All translations created in
Bilara and supported by SuttaCentral are dedicated to the Public Domain by means of the Creative Commons
Public Domain (CC0) license."* Quote both this and licensing:6/24 on sources.html so the claim is doubly
sourced.

**Kindred Sayings exact volume years** (sharpening §1.4): I 1917, II 1922, III 1924, IV 1927, V 1930 —
all US-PD as of 2026-01-01 (vol V freshly).

**Repo integration facts verified against the working tree** (so builders don't re-derive):
`assets/js/core/registry.js` exists and carries the `yoga-sutras` reference-wing entry at ~line 945 (the
template for `buddhist-canon`); the Confluence atlas slugs `satipatthana-sutta` and `anapanasati-sutta`
exist in `assets/js/core/data/confluence.js` (lines ~255, ~314) with `from:` edges — the cross-link targets
named in §5 are real; the mega-menu + `currentSection()` registry lives in `assets/js/app/shared.js`
(Traditions group ~line 50–70, section regexes ~line 115); the YS engine-test block to mirror starts at
`scripts/engine-test.mjs` ~line 1534.
