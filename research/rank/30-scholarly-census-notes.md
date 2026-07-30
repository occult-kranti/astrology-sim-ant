# 30 — The scholarly-weight census: working notes

Companion to `30-scholarly-census.json`. 27 rows, compiled 2026-07-30.
Governed by `docs/FRAMING.md` v2 as amended 2026-07-30.

---

## 0. The one thing this axis is not

**There is no efficacy axis in this file and none can be derived from it.**

A high band means a text has been read carefully by a lot of people with manuscripts and
apparatus. It means nothing whatsoever about whether the rite in that text does anything.
The *Niśvāsatattvasaṃhitā* has the best editorial pedigree in this census and no demonstrated
operative validity; so does the *Papyri Graecae Magicae*; so does every row here. FRAMING §1.1
says attestation frequency is evidence about transmission and never about efficacy. This census
is the same claim one level up: **density of scholarship is evidence about a modern academy's
priorities, never about a historical claim's truth.**

The JSON encodes this three ways so it survives being cut up:

- a top-level `hardLine` block with an explicit `forbiddenJoins` list;
- a per-row `axisMeaning` string that repeats the disclaimer inside every row, so a row extracted
  alone still carries it (the same reasoning as FRAMING §5 A-5: the note travels inside the
  container, not next to it);
- `hardLine.documentedEffects` set to an explicit out-of-scope statement rather than left absent,
  so nobody later reads a missing field as an empty cell to fill.

**"No study exists" is a first-class value here too.** `criticalEdition.status: "none"` appears on
three rows and is a finding, not a gap.

---

## 1. What I actually did

### The count

I needed one reproducible number per corpus. I used the **OpenAlex REST API**:

```
GET https://api.openalex.org/works?filter=title_and_abstract.search:"<PHRASE>"&per-page=1
→ read meta.count
```

Chosen over Google Scholar because Scholar's numbers are (a) unreproducible from one machine to
the next, (b) inflated by syllabi, PDF mirrors and duplicate records, and (c) uncitable. Anyone
can paste the URLs above and get the same integer. A count nobody can re-run is an assertion
wearing a number's clothes.

**I tried Crossref first and abandoned it.** `api.crossref.org/works?query.bibliographic="Papyri
Graecae Magicae"&rows=0` returns **6368** — the bibliographic query is a fuzzy OR-match and does
not honour phrases at all. Recorded in the JSON so the next round doesn't repeat the attempt.

**Phrase semantics check.** Unquoted `search=Greek magical papyri` → 688. Quoted
`title_and_abstract.search:"Greek magical papyri"` → **153**. The quoted filter is doing real
phrase work. All figures in the JSON are the quoted form.

### The signals that actually decide the band

The count is the *weak* signal and I say so in the file. The band is driven by, in order:

1. **Does a critical edition exist** — who, year, publisher. This is the strongest single
   indicator, because a critical edition is expensive, slow, career-length work that nobody
   undertakes for a text the field does not care about.
2. **Is there a named, funded, multi-year research programme.**
3. **Do three-to-six scholar names recur** across the editions, monographs and reviews. Where no
   name recurs, the "literature" is a scatter of one-offs and the corpus is effectively unowned.

Where counts and signals conflict, **the counts lose**, and the JSON says which rows they lost on.

---

## 2. The biases, measured rather than asserted

The brief required the bias to ship with the axis. Here is each one with the probe that
demonstrates it.

### 2.1 Diacritics — the silent killer

| Probe | Count |
|---|---|
| `"Saradatilaka"` | **0** |
| `"Śāradātilaka"` | **8** |
| `"Hathapradipika"` | 8 |
| `"Haṭhapradīpikā"` | 18 |
| `"Nisvasa"` | 1 |
| `"Niśvāsa"` | 3 |
| `"Kularnava"` | 9 |
| `"Kulārṇava"` | 5 |

An ASCII-only census returns a **hard zero** for a text that has a published BSOAS edition of one
of its chapters. Every Indic row in the JSON carries both figures. Note that the two sets are not
nested — `Kularnava` 9 vs `Kulārṇava` 5 means neither is a superset, so they cannot be summed
without deduplication I did not do.

### 2.2 Homonyms — the count can be nearly all noise

- `"Heptameron"` = **283**. First result: Diffley, *"From Translation to Imitation and beyond: A
  Reassessment of Boccaccio's Role in Marguerite de Navarre's Heptameron"* (1995). The count is
  measuring French Renaissance literature. The grimoire's share is close to nil. Marked **VOID**.
- `"Abulafia"` = **672**; `"Abraham Abulafia"` = **128**. The residue is the medievalist David
  Abulafia and others sharing the surname. Only the disambiguated figure is usable.

### 2.3 Reprints count as scholarship

`"Key of Solomon"` = 48. Sample of the first five: *The Key of Solomon the King* (1989), *The Key
of Solomon the King (Clavicula Salomonis)* (2012), *Key of Solomon* (2017), *Key of Solomon*
(2012), *English Translation of The Key of Solomon* (2026). **Five reprints, zero studies.**

For popular grimoires the count measures **occult-market demand**, and using it as a scholarship
proxy *inverts the axis*: the Key of Solomon outscores the Niśvāsa 48 to 3, and the truth is
exactly the reverse.

### 2.4 Modern disciplines flooding an ancient keyword

- `"hatha yoga"` = **1722** — overwhelmingly modern clinical yoga-intervention literature.
- `"rasashastra"` = **512** — overwhelmingly modern Ayurvedic pharmacology and bhasma analytical
  chemistry in Indian journals.
- `"Gheranda"` = 79 — sample returns Mallinson's 2004 edition next to *"A COMPARATIVE STUDY OF
  SHATKARMA ACORDING TO GHERANDA SAMHITA AND HATHA YOGA PRADIPIKA"* (2023) and distance-learning
  course units.

These are disqualified as philology proxies in the JSON and replaced with narrow text-level probes.

### 2.5 English-only searching — quantified

| Corpus | English keyword | Other-language keyword | Ratio |
|---|---|---|---|
| Greek magical papyri | `"Greek magical papyri"` 153 | German `"Zauberpapyri"` 52 | +34% behind German |
| Esoteric Buddhism | `"Shingon"` 731 | Japanese `"密教"` **1602** | **2.2×** |
| Internal alchemy | `"neidan"` 144 | Chinese `"内丹"` **282** | **2.0×** |

And the ritual-specific case: `"goma ritual"` returns **2**, because the literature calls it
護摩 / homa.

**For at least six corpora on this list the primary scholarship is not in English:**

- *Picatrix* — Ritter (Arabic, 1933) and Ritter–Plessner (German, 1962). An English-only reader
  is cut off from the better half of this text's scholarship.
- *Sefer ha-Razim* — the current critical edition (Rebiger & Schäfer 2009) is German.
- Hekhalot — Schäfer's *Synopse*, *Übersetzung* and *Konkordanz* are German.
- *Ars notoria* — Véronèse's critical edition is French, from SISMEL.
- al-Būnī — Coulon, French, CTHS.
- *Baopuzi* — Wang Ming's *jiaoshi* is Chinese, Zhonghua shuju.
- (plus *Vijñānabhairava*: Silburn in French 1961, Ivanov in Russian; Shingon manuals in Japanese.)

**A ranking axis built on English counts will systematically demote exactly these, and the
demotion is an artefact of the instrument.**

### 2.6 Structural undercounting nobody can fix cheaply

OpenAlex indexes DOI-registered works and inherits abstracts from Crossref, which humanities
publishers deposit inconsistently. It largely misses: monographs without DOIs (a large share of
Indological, Sinological and Judaic book literature); pre-1970 scholarship (i.e. the era in which
the German and French philology on several of these corpora was *done*); Festschriften and
conference volumes from small learned presses (SISMEL, Egbert Forsten, IFP/EFEO, Almqvist &
Wiksell, Kaivalyadhama); and non-DOI regional journals.

**Every count in this file is a floor, not an estimate.** "4" for the Khecarīvidyā means "at least
four", not "exactly four".

---

## 3. The honest spread — the actual finding

The brief asked whether some of these have a century of philology and some have essentially none.
They do, and the gap is larger than I expected going in.

**Band 5 — a subfield of their own**
*Papyri Graecae Magicae* · *Picatrix / Ghāyat al-Ḥakīm* · Hekhalot literature ·
*Niśvāsatattvasaṃhitā* · *Haṭhapradīpikā*

**Band 4 — a modern critical edition and a school**
*Ars notoria* · *Liber iuratus Honorii* · *Khecarīvidyā* · *Baopuzi* · *Zhouyi cantong qi* ·
*Sefer ha-Razim* · Abulafia corpus · Shingon canonical layer

**Band 3 — one edition or one literature, not both**
*Śāradātilaka* · rasaśāstra · *Gheraṇḍasaṃhitā* · *Śivasaṃhitā* · *Wuzhen pian* · Tibetan sādhana

**Band 2 — no critical edition, a vulgate, a handful of treatments**
*Key of Solomon* · *Lemegeton* · *Buch Abramelin* · *Mantramahodadhi* · *Kulārṇava* ·
*Vijñānabhairava* · *Shams al-maʿārif*

**Band 1 — essentially none**
*Heptameron*

### The three findings I would put on a page

**(a) Fame and philology are uncorrelated, and sometimes anti-correlated.** The four most
reproduced operative books in this census — *Key of Solomon*, *Lemegeton*, *Shams al-maʿārif
al-kubrā*, *Kulārṇava* — are among the **least** edited. Meanwhile the *Ars notoria* and the
*Liber iuratus*, obscure siblings in the very same Solomonic corpus, have excellent modern critical
editions (Véronèse 2007; Hedegård 2002). That the Key of Solomon does not is therefore a fact
about the field's *choices*, not an inevitability of the genre. I put the Ars notoria row into the
census specifically as this control.

**(b) A count-driven ranking would be actively wrong, not merely noisy.**

| Text | OpenAlex | Weight band |
|---|---|---|
| Heptameron | 283 (void) | 1 |
| Key of Solomon | 48 (reprints) | 2 |
| Khecarīvidyā | 4 | 4 |
| Niśvāsatattvasaṃhitā | 1–3 | 5 |

Ranking by count places the two worst-edited texts *above* the two best-edited. This is why
`criticalEdition` dominates the band and counts are a tiebreak only.

**(c) The Niśvāsa row is the standing warning.** A 2015 critical edition by Goodall, Sanderson and
Isaacson — three of the leading Sanskritists alive — from a Franco-German ANR/DFG-funded project,
published jointly by IFP, EFEO and Hamburg, with colour manuscript DVDs, reviewed by Gavin Flood
in JAOS. OpenAlex count: **effectively one.** If the site ever displays a number on this axis,
this row should be displayed beside it.

---

## 4. Research programmes located (all verified this pass)

| Corpus | Programme | Funder / host | Years |
|---|---|---|---|
| PGM | **The Transmission of Magical Knowledge** → GEMF | Neubauer Collegium, University of Chicago (Faraone & Torallas Tovar) | 2015– |
| Haṭha corpus | **The Haṭha Yoga Project** | ERC, SOAS + EFEO Pondicherry (Mallinson PI; Singleton, Birch, Bevilacqua) | 2015–2020 |
| *Haṭhapradīpikā* | Digital critical edition from **200+ manuscripts** | AHRC + DFG; Oxford (Mallinson, Birch) + Marburg (Hanneder, Demoto, Liersch) | ongoing |
| Early tantra | **Early Tantra: … Common Ritual Syntax** | ANR + DFG; EFEO Pondicherry + Hamburg Centre for Tantric Studies | workshops 2008–2010 |
| rasaśāstra | **AyurYog** — *Medicine, Immortality, Mokṣa* | ERC Starting Grant; Vienna + Alberta (D. Wujastyk PI) | 2015–2020 |
| Daoist corpus | **The Taoist Canon / Daozang Project** | ESF-supported; ~30 scholars, 3 decades; Chicago UP 2004 | closed |
| Hekhalot + Sefer ha-Razim | Schäfer's editorial programme (Synopse, Übersetzung, Konkordanz, Geniza, Sefer ha-Razim) | FU Berlin / Princeton, Mohr Siebeck TSAJ | 1981–2009+ |
| Islamicate occult | *Arabica* 64/3–4 (2017) + Brill HdO 140 (2021); Coulon at IRHT–CNRS | emerging cluster | 2017– |
| Shingon | **SAT Daizōkyō Text Database** (Univ. of Tokyo); IBS/GTU as Western node | standing infrastructure | 1990s– |
| Tibetan | **84000** (translation, not editing) + **Treasury of the Buddhist Sciences** (AIBS/Columbia) + BDRC | Khyentse Foundation philanthropy; 165+ grants, >US$8.5m, ~25% of Kangyur in English | ongoing |
| Western esotericism (umbrella) | Chair for History of Hermetic Philosophy, Univ. of Amsterdam (Hanegraaff, since 1999); ESSWE; Societas Magica | standing | 1999– |

**The 84000 caveat matters and is in the JSON.** It is a translation and access initiative funded
largely by Buddhist philanthropy, not a philological editing programme. Conflating "US$8.5m of
translation grants" with "text-critical investment" would be exactly the kind of category error
this census exists to prevent.

---

## 5. Two findings that complicate "scholarly weight" as one number

**5.1 Editions and interpretation come apart.** Two rows are mirror images:

- **Khecarīvidyā** — a Routledge critical edition by one scholar, and an OpenAlex count of 4.
  Excellent edition, almost no secondary literature.
- **Abulafia** — ~128 disambiguated works, several major monographs (Idel ×2, Wolfson, Hames,
  Sagerman), and *most of the primary corpus circulating in non-critical Amnon Gross printings*.
  Large literature, weak text-critical base.

These are two independent quantities and the band collapses them. If the site ever wants a second
dimension, `criticalEditionStrength` and `secondaryLiteratureVolume` are the two to split out.

**5.2 "Peer reviewed" names one academy.** What this axis measures is attention from a largely
Euro-American, largely post-1900, largely secular-philological establishment. The Chinese
commentarial tradition on the *Cantong qi* (Weng Baoguang, Chen Zhixu, Lu Xixing), the Japanese
sectarian scholarship of Kōyasan and Taishō universities, and the Sanskrit commentarial tradition
on the tantras (Kṣemarāja, Rāghavabhaṭṭa) are all rigorous, cumulative, peer-scrutinised bodies of
work — and this axis registers them at close to zero. If the axis ships with the label "peer
reviewed" unqualified, that is a claim the site fails. Recommend labelling it **"modern academic
attention"** and putting §5.2 on the methods page.

---

## 6. Where this touches FRAMING directly

- **§4.4 (the philological cost of the PD constraint) gets its evidence here.** The census makes
  the cost concrete and per-text: the site may quote Sinh (1914) for the *Haṭhapradīpikā* but must
  cite-without-quoting a digital critical edition built on 200+ manuscripts. It may quote Vasu
  (1895/1914) for *Gheraṇḍa Saṁhitā* 3.25 but must cite-without-quoting Mallinson (2007), which is
  where the four-part harm apparatus FRAMING §5.1 adopts actually lives. Every row's
  `criticalEdition` block is the "name the better edition anyway" obligation, pre-filled.
- **§2.5 / §9.8 confirmed from the outside.** Greer–Warnock's *Picatrix* (Adocentyn, 2010–11) is
  logged in the Picatrix row as `cite-only`, with a note that `assets/js/core/data/picatrix-prayers.js`
  currently quotes it in violation. The census independently reaches the same verdict FRAMING does.
- **§1.3 (contested claims carry every position).** Flagged in-row for the Hekhalot corpus, where
  Schäfer's synoptic method is itself a contested scholarly position against Scholem's and
  Boustan's readings, and for the *Shams al-maʿārif*, where Coulon's anachronism argument against
  al-Būnī's authorship is a live claim and must be printed as his, not as fact.
- **§7.2 (initiation-gated material described as scholarship describes it).** Bites hardest on the
  Tibetan sādhana row, where a large part of the literature is lineage-restricted. Recorded as a
  dated, sourced fact about the texts; not adjudicated.
- **§4.3 (PD is per-volume).** Recorded on the PGM row: Preisendanz vol. 1 (1928) is PD-US;
  **vol. 2 (1931) is not until 1 January 2027.**

---

## 7. Citation honesty — what is verified and what is not

Every exemplar citation carries a `verified` field:

- `web-2026-07-30` — bibliographic facts confirmed against a source retrieved in this pass, with
  the retrieval named (ISBN, DOI read out of a retrieved URL, repository handle, or the catalogue
  page).
- `unverified-this-pass` — asserted from compiler knowledge and **must be checked before it
  reaches a shipped page**.

**29 of roughly 110 citations are flagged unverified.** FRAMING §1.2 says no claim rests on a work
the compiler has not seen; one research pass cannot honour that for every citation, so the file
marks the gap instead of hiding it. That list is the next round's checking queue.

**No DOI was invented.** Every DOI in the file was read out of a URL returned by a search. Where
none was retrieved, the identifier is an ISBN, a series number, a repository handle, or `null`.

---

## 8. What I would fix next, in order

1. **Verify the 29 flagged citations.** Cheapest, highest value.
2. **Sample the unsampled counts.** Nine rows carry `sampled: false` on their headline count.
   `"Gheranda"`, `"Baopuzi"`, `"Hekhalot"`, `"Shingon"` and `"al-Buni"` are the ones most likely
   to be contaminated in ways I have not checked.
3. **Do the diacritic-union dedup properly.** Pull full result sets for the paired Indic probes and
   compute the real union instead of reporting two numbers side by side.
4. **Add a French and an Italian language control**, to sit beside the German, Japanese and Chinese
   ones. Both matter for the Solomonic and Picatrix rows and neither was probed.
5. **Decide the axis label.** "Peer reviewed" is not accurate for what this measures (§5.2).
   "Modern academic attention" is.
6. **Never ship the raw counts without the contamination note in the same DOM node.** The
   Heptameron row is what happens when a number travels without its caveat.
