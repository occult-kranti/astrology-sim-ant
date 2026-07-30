# S10 — Indian Tantra / Mantra / Yantra: research notes

Companion to `10-indian-tantra.json`. Round date 2026-07-17. Repo treated as READ-ONLY.

**Counts:** 19 works · 90 work×procedure-type rows · 138 edges (90 CONTAINS_PROCEDURE, 19 BELONGS_TO, 19 AUTHORED_BY, 5 PARALLELS, 4 COMMENTS_ON, 1 TRANSMITS_TO) · 15 distinct procedure-types used · 7 cultures · 11 author nodes.

---

## 0. The headline number: **zero `complete` grades in 90 rows**

54 partial · 35 referenced · 1 fragmentary · **0 complete**.

This is not timidity and it is not a defect in the corpus. It is the corpus's defining
property, and it falls out of the evidence in four distinct ways:

1. **Genre ellipsis.** The Kauśika Sūtra fits its rites into the darśapūrṇamāsa frame and
   never restates the frame. The Paraśurāmakalpasūtra is aphorism by definition.
2. **Encoding.** The mantra — the one element without which nothing runs — is transmitted
   by coded extraction, not written.
3. **Initiation-gating.** Śāradātilaka puts dīkṣā at paṭala 4, ahead of every operative
   chapter. Kulārṇava forbids part of itself to part of its readers.
4. **Commentary-dependence.** Six of my nineteen works are read through a commentary whose
   title admits the root text does not get you across ("the Boat", "the Lamp on the order
   of the ritual application").

The nearest thing to a `complete` in the slice is the **Nityotsava** (64 upacāras, seven
chapters, a final chapter of elements common to all). I withheld the grade for one stated
reason — the sources consulted do not say the Śrīvidyā mantras appear in plain form — and
flagged it as promotable by a scholar with the edition in hand. That is the honest shape of
this slice: everything is *nearly* complete and something specific is always missing, and
naming *what* is missing is the entire value of the exercise.

---

## 1. The finding that should change how the repo reads its own abhicāra wing

**Mantramahodadhi 25, Śāradātilaka 23.121–45 and Prapañcasāra 446–452 contain no rites.
They are parameter tables.**

I downloaded Ullrey's UCSB dissertation (the repo's own most-cited source for this
material), converted it with `pdftotext`, and read pp. 117–142. Verbatim:

> "Full rituals, as opposed to systematic verses, are scattered throughout the text, but
> **no discrete rituals are found in this section**. Chapter 25 describes nineteen variables
> or 'nineteen items' that the practitioner should know before performing a rite." (p. 134)

> "the Śāradātilaka sample is **meta-text** that describes variations within ritual to
> coordinate with a specific results, **not full discrete rituals with specific ends**. A
> second-order text cannot describe a first-order text." (p. 131 n. 44)

> "That meta-ritual lore is **not connected to a larger set of practices (sādhana)**
> dedicated to a single deity." (p. 133)

> "Mantramahodadhi 25 and Śāradātilaka 23 — source texts for Bühnemann and Türstig —
> **deviate from the texts' overall content**." (p. 134)

Consequences, in order of importance:

- **The repo's abhicāra wing is more faithful than S1 credited it.** S1 read the wing's
  refusal to assemble the nineteen variables as editorial restraint. It is restraint *and*
  fidelity: **the source chapter has nothing to assemble.** The wing stops where the text
  stops. Do not let a later round "complete" it.
- **On the text axis these rows grade `referenced`, not `partial`.** S1's `repoCoverage:
  partial` for Mantramahodadhi × coercive-rite is correct on its own axis and is not in
  conflict — the repo maps the variables exhaustively precisely because variables are all
  there is. Keeping the two axes apart, exactly as S1 argued, is what makes this legible.
- **The controlled vocabulary has no term for this and needs one.** See §4.

---

## 2. Withholding is structured. Six mechanisms, not one

The brief asked me to treat withholding as a finding. It decomposes:

| # | Mechanism | Best-evidenced instance |
|---|---|---|
| M1 | **mantroddhāra encoding** — mantra derivable by grid/code-word, never written | Kavaleuskaya, *Etnografia* 4(10) 2020, 59–79, naming Tantrāloka, Mālinīvijayottara, Kubjikāmata, **Svacchandatantra**, Jayadrathayāmala etc.; "obstacles to understanding the process of decryption were probably created intentionally". Ullrey on the Uḍḍ-corpus: the Hindu recension "resolves ambiguity of techniques but **encodes the mantras**" |
| M2 | **dīkṣā prerequisite as architecture** | Śāradātilaka: dīkṣā = paṭala 4, before all 18 operative chapters |
| M3 | **explicit in-text reading prohibition** | Kulārṇava 17.103 — Avalon: "a remarkable passage (v. 103) **prohibiting (ordinary persons) from reading** the portions of this work dealing with Asavollasa" |
| M4 | **oral-only transmission claim** | Kulārṇava III: "It is not to be known from Vedas or Agamas or Sastras or Puranas, however exhaustive they may be… It can be known **only through the mouth of the Guru**" |
| M5 | **commentary-dependence** | Padārthādarśa, Naukā, Uddyota, Dīpikā, Ṛjuvimarśinī, Prayogakramadīpikā |
| M6 | **modern editorial/translator redaction** | see below |

### M6 deserves its own schema field

M.P. Pandit's preface to the standard English Kulārṇava:

> "**Portions relating to rituals, technicalities of special types of japa, etc. have been
> kept out of the treatment** so as not to tax the aspirant of the present times… it is
> possible to achieve the same results by more psychological means suited to the modern age."

The most-read English Kulārṇava is an **avowedly redacted** rendering of an
**already-withholding** text. Anyone grading the Kulārṇava's completeness from Pandit is
grading Pandit.

**Schema recommendation:** `textCompleteness` needs a sibling `witnessCompleteness` — what
the *edition or translation actually in hand* gives. S1 already separated
`repoCoverage` from `textCompleteness`; this is the third axis, and without it the whole
corpus's grades are silently contaminated by twentieth-century editorial choices.

Related, same axis: the 1981 Mantramahodadhi carries a publisher's liability disclaimer
about readers acting on "the Yantras as provided in this book" (quoted at Ullrey pp. 141–42
n. 9). Indian tantra publishing has had a harm-framing convention for decades. The repo's
own framing is not an outlier.

---

## 3. Ritual syntax: attested, at three granularities — don't merge them

The brief proposed snāna→nyāsa→dhyāna→āvāhana→upacāra→japa→homa→visarjana. It is real.
It is also three nested things:

- **Five-fold core, stated *in a text*, with a locus.** Ullrey p. 576 n. 51 translating
  *Bhairavapadmāvatīkalpa* 3.24: "The wise declare the five worship acts of the goddess to be
  invocation (āhvānaṃ), depositing (stāpanaṃ), gaining her attention (sannidhīkaraṇa),
  worship (pūjā), and dismissal (visarjanaṃ)." This is tradition-internal ritual syntax, not
  scholarly reconstruction — the strongest such statement I found in the slice.
- **Sixteen upacāras** expanding the fourth act (Bühnemann, *Pūjā*, 1988), "preceded by the
  performance of nyāsa".
- **Sixty-four upacāras** in the Śrīvidyā paddhati (Nityotsava ch. 3).

Cross-cutting: antaryāga (bhūtaśuddhi→nyāsa→dhyāna) **always precedes** bahiryāga.

**Independent corroboration that the template is real and not imposed:** the Śāradātilaka
runs the *same internal cycle* — mantra, nyāsa of letters, dhyāna, pūjāvidhi, puraścaraṇa,
yantra, homa — through roughly eighteen consecutive per-deity chapters (paṭalas 6–23). A
template repeated eighteen times by one author is structural evidence, not inference.

**Graph implication:** `CONTAINS_PROCEDURE` should carry a **slot** (position in the syntax).
Otherwise nyāsa-in-Śāradātilaka and nyāsa-in-Mantramahodadhi look like unrelated facts
instead of the same slot in the same template — and the whole point of a typed graph is lost.

---

## 4. Controlled-vocabulary gaps found in this slice (6)

1. **META-RITUAL / PARAMETER-TABLE** — the most important. Without it the corpus's two
   most-cited operative chapters are unfilable. Ullrey's *first-order* vs *second-order*
   distinction is the ready-made scholarly warrant.
2. **mantra-extraction (mantroddhāra)** — a distinct procedure *and* the corpus's principal
   withholding device. `mantra-consecration` does not cover it.
3. **puraścaraṇa** — the counted qualifying regimen. Named as a discrete topic in
   Śāradātilaka 6/10/13, Mantramahodadhi, Kulārṇava XV.
4. **pratiṣṭhā** — image/temple consecration, as against talisman consecration. 64 of the
   Īśānaśivagurudevapaddhati's 119 paṭalas are essentially this.
5. **apotropaic/protective rite performed on behalf of a third party** — Netratantra
   (Sauthoff's court priest acting for the monarch), Kauśika's śāntika/pauṣṭika. Filing it
   under `purification` erases the *on-behalf-of* relation.
6. **commentary-as-completeness-raiser** — `COMMENTS_ON` cannot express that the Nityotsava
   is what makes the Paraśurāmakalpasūtra performable.

---

## 5. Contested points carried with ≥2 positions, unresolved

- **Śāradātilaka date** — four positions: 11th c. (most common) · 12th c. (Sanderson,
  reported) · 10th c. (Ullrey p. 133) · 8th c. (tertiary digest only; recorded as rejected).
- **Śāradātilaka ṣaṭkarman locus ⚑** — scholarship (Bühnemann via Ullrey, cross-checked
  against Türstig p. 102) says **23.121–45**; the tertiary chapter digest puts abhicāra
  mantras in paṭala **22** and makes 23 the Tryambaka chapter. Scholarly locus preferred,
  digest recorded not merged.
- **Prapañcasāra ↔ Śāradātilaka priority ⚑** — Bühnemann: PS earlier, ST "based on" it.
  Ullrey p. 133: "the tenth and eleventh centuries, **respectively**" for ST and PS, i.e. the
  reverse. Dependency direction follows Bühnemann (argued from shared content); date order
  left open.
- **Mantramahodadhi date — a contradiction *inside the repo's own cited source* ⚑.** Ullrey
  p. 117 n. 25: "a **fifteenth-century** compilation"; Ullrey p. 132: "composed by Mahīdhara
  in **1588**". 1588 is sixteenth-century and is corroborated by Bühnemann. Recording this
  because the repo cites Ullrey heavily and a hostile auditor will find it.
- **Śāradātilaka extent** — 3,500 vs 4,500 stanzas.
- **Nityāṣoḍaśikārṇava extent** — "400 verses in five chapters" vs "Yoginīhṛdaya = the last
  three chapters of the Vāmakeśvaratantra".
- **Nityotsava author** — Umānandanātha (two Śrīvidyā sources) vs an outlier attributing it
  to "Jagannātha Paṇḍita, 1745". Umānandanātha adopted, outlier recorded.
- **Merutantra** — date (17th c., itself question-marked in its source, vs MS range
  1700–1850) and extent (witnesses of 10, 25 and 35 prakāśas).

---

## 6. Edition & public-domain layer (usable directly)

**PD in the US (pre-1930):** Bloomfield, *Kauśika Sūtra*, JAOS 14 (1890) · Caland,
*Altindisches Zauberritual* (1900) · Whitney–Lanman HOS 7–8 (1905) · Bloomfield SBE 42
(1897) · Avalon, *Tantrik Texts* III Prapañcasāra (1914) & V Kulārṇava Sanskrit text (1917)
& XVIII (1919) · T. Gaṇapati Śāstrī, *Īśānaśivagurudevapaddhati*, TSS, 4 vols (1920–25) ·
Kavirāj, *Yoginīhṛdaya* with Dīpikā + Setubandha, Sarasvatī Bhavana Texts 7 (1924) ·
Netratantra KSTS 46 (1926) · Svacchandatantra KSTS volumes through 1929.

**NOT PD in the US — do not quote text:** Śāradātilaka + Padārthādarśa, *Tantrik Texts*
XVI–XVII (**1933**; US PD in 2029) · Prapañcasāra *Tantrik Texts* XIX (1935) ·
Svacchandatantra KSTS volumes 1930–35 · Netratantra KSTS 61 (1939) · Brown, HOS 43 (1958) ·
Lakṣmīdhara ed. Mysore (1953) · Pandit's Kulārṇava readings (1965) · Dvivedī's
Nityāṣoḍaśikārṇava (1968) · the 1981 Mantramahodadhi · all Bühnemann, Padoux, Goodall,
Sanderson. Ullrey's dissertation is in copyright but open-access on eScholarship.

**Trap worth naming:** the most-cited Śāradātilaka edition is 1933 and therefore *not*
quotable, while the far older Prapañcasāra edition *is*. A round that assumes "Avalon =
public domain" will get this wrong.

---

## 7. De-duplication resolved with evidence

- **Mantramahodadhi ≡ "Mantra Mahodadhi"** (`abhichara-data.js` ↔ `vedic-remedies.js`
  `GRAHA_MANTRA_SOURCE`). S1 flagged these as probably the same work under two
  transliterations. **Confirmed, with the mechanism:** taraṅga **15** is the chapter of
  planetary (graha) and ṛṣi mantras — exactly what `vedic-remedies.js` draws on. One work,
  one slug, two wings.
- Kauśika Sūtra, Prapañcasāra, Śāradātilaka, Mantramahodadhi and the Atharvaveda each carry
  a `dedupWith` naming the repo record and stating what this row **adds or corrects** rather
  than restates.
- The atlas slug `rigveda` is a **different work** from the Atharvaveda — flagged against
  careless merging.

---

## 8. Procedure-node attachment — a ruling for the synthesizer

S1 noted the repo has never decided whether procedures may hang off non-work nodes.
**In this slice, every one of 90 procedure rows hangs off a work** (commentaries counted as
works, which they are). Nothing needed a person, event, institution or translation node.

**Recommendation:** restrict `CONTAINS_PROCEDURE` to work-nodes; express a person's or
school's practice as *work → CONTAINS_PROCEDURE* plus *person → TRANSMITS/PRACTISES → work*.
The two mis-attributions S1 found (Mevlevi samāʿ hung on the Masnavī; the golden-flower
*translation* node restating the text's technique) are exactly what happens without this rule.

---

## 9. Harm / ethics posture applied

Every row that touches harm-capable material carries a named `harmNote` and is admitted only
as academic religious history, per the abhicāra-wing precedent:

- **ṣaṭkarman rows** (Śāradātilaka, Mantramahodadhi, Prapañcasāra, Bṛhat Tantrasāra,
  Kulārṇava XVI) — five of six acts hostile, one is "the taking of life".
- **Śāradātilaka paṭala 24's 36-yantra list** — includes māraṇa- and stambhana-class items
  and items aimed at coercing a spouse. Catalogued by *purpose only*: no template, no
  measurement, no inscription.
- **Kulārṇava V/VII/VIII** — kaula substances (wine, meat), śakti-worship and the cakra rite,
  which in this tradition includes ritualised sexual content. Named at chapter level only.
- **Niśvāsa Guhyasūtra** — prose siddhi-recipe literature; nothing inspected, nothing
  reproduced.
- **Atharvan ābhicārika/cātana gaṇas** — hostile-rite classes named, no hymn or formula given.
- **Śrīvidyā (Nityāṣoḍaśikārṇava, Yoginīhṛdaya, Nityotsava, Saundaryalaharī apparatus)** —
  carries an additional **living-tradition** note: structure is describable; the vidyā is not
  ours to supply and is also not something an outsider source could responsibly verify.

Efficacy is nowhere asserted. Where the Netratantra claims to conquer death, or Kṣemarāja
argues that dīkṣā bestows liberation, or a ṣaṭkarman claims a worldly result, the claim is
attributed to the text or the commentator and left there.

---

## 10. Gaps and risks in *my own* work this round

**Gaps**

1. **Goudriaan & Gupta, *Hindu Tantric and Śākta Literature* (1981) — the standard survey —
   was not reachable.** The archive.org full text served only the opening classificatory
   chapters; the per-text entries for Merutantra, Bṛhat Tantrasāra, Mantramahodadhi,
   Śāradātilaka and Kulārṇava never loaded. This is the single biggest hole. Getting one
   clean copy would firm up perhaps a dozen rows at once.
2. **Merutantra is near-empty and I left it that way.** One procedure row, catalogue-level.
   Padding it would have been easy and dishonest.
3. **Kulārṇava has no date** — I found none in a source I trust.
4. **Sanderson's *The Śaiva Literature* (2012–13) was located but not read** (academia.edu
   403). It is the authoritative chronology for Niśvāsa/Svacchanda/Netra and would replace
   several tertiary date claims.
5. **Śāradātilaka ch. 25 (Bühnemann's edition + translation) not obtained** — volume and year
   are marked `(unverified)`, and the yoga chapter's internal step-completeness is unresolved.
6. **Niśvāsa Guhyasūtra publication status** — the largest and most operative book of the
   earliest Śaiva tantra. I graded it `fragmentary` **on edition grounds, not textual damage**,
   and flagged it for revisit; a volume may have appeared since the sources I could reach.
7. **Bṛhat Tantrasāra's 150–170 cited texts are unmined** — the richest single
   transmission-edge source in the slice, and I only have the aggregate count.
8. **Chapter-level structure for Svacchanda (15 paṭalas?) and NṢA (4 or 5 chapters?)**
   never firmed up.

**Risks**

1. **Tertiary sourcing.** The Śāradātilaka and Īśānaśivagurudevapaddhati chapter summaries
   come from a wisdomlib digest of an unnamed thesis. Marked `tertiary` throughout, and
   where it conflicts with Ullrey/Bühnemann I keep both — but a hostile auditor is entitled
   to discount every row resting on it alone. The same digest asserts an 8th-century
   Śāradātilaka, which no scholarly source supports; I recorded that as *rejected*, which is
   also a fair measure of the source's reliability.
2. **One near-miss on provenance.** A vivid statement that the Yoginīhṛdaya "omits much of
   the information as tantric rites are intended to be secret" turned out to come from a
   **reader review**, not from Padoux. It is recorded as `(unverified)` and **explicitly not
   used to set the grade**; the grades rest on the initiate-address and commentary-dependence,
   which are attested. Flagging it because it is exactly the kind of quotation that reads as
   scholarship and is not.
3. **Two edges are my inference, labelled as such.** `kausikasutra PARALLELS
   parasuramakalpasutra` is a *genre* parallel I drew from the two genre descriptions, not a
   claim found in a source. It is marked `"inference labelled"`. Everything else in PARALLELS
   is scholar-asserted (Bühnemann's three-text ṣaṭkarman parallel; Türstig independently;
   Ullrey's Varanasi/Bengal/Kerala grouping).
4. **`(unverified)` appears on roughly 15 rows.** Concentrated in Niśvāsa, Svacchanda,
   Bṛhat Tantrasāra, Merutantra and the Īśānaśivagurudevapaddhati's internal sequences.
   That is the honest boundary of what one round could re-derive.
5. **Living-tradition sensitivity.** Śrīvidyā is practised now. I mapped structure and
   named what is withheld; I did not attempt to characterise the withheld content, and a
   later round should not treat "the graph has a gap here" as a task to close.

---

## 11. Cheapest high-value next moves

1. Get **Goudriaan & Gupta 1981** properly — fixes ~12 rows and probably the Merutantra.
2. Get **Sanderson 2012–13** — replaces tertiary dates for the three Śaiva scriptures.
3. Mine the **Bṛhat Tantrasāra's citation apparatus** — a ready-made transmission graph.
4. Add the **META-RITUAL / PARAMETER-TABLE** type before merging slices; it is cheap now and
   expensive later, because every ṣaṭkarman row in the repo depends on the distinction.
5. Add **`witnessCompleteness`** alongside `textCompleteness`. The Pandit Kulārṇava proves
   the two axes come apart, and every English-only grade in the merged graph is suspect
   until they do.
