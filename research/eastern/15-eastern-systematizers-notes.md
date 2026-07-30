# S15 — Eastern systematizers, compilers, popularizers: method, gaps, and the auditor's attack list

Companion to `15-eastern-systematizers.json`. Written 2026-07-30 under the standing discipline
(`docs/FRAMING.md`, adopted 2026-07-30). **This round ships no quoted operative text.**

---

## 1. What this slice is, and what it deliberately is not

The brief asked for the Indic functional counterparts of Manly P. Hall, Crowley and Stephen Skinner:
the people who **mediated** the operative corpus rather than the corpus itself. So this file records a
**mediation layer** — who put what into English, from what base text, with what apparatus, under what
licence, and with what documented dependence on whom.

Two exclusions were held strictly:

- **The primary Sanskrit corpus is not covered.** S10 (`10-indian-tantra.json`) owns it. Where a
  primary text appears here it appears as the *object* of a mediation row (e.g. the Kulārṇava appears
  only as "what Rai 1983 translated"), never as a corpus row of its own. `sortYear` on every row is the
  **mediation's** year, not the source text's.
- **The criticism literature is not covered.** A third agent has it. Taylor (2001) is the single
  exception, and she is in the file as an *instrument* — the study that changes what the Woodroffe rows
  mean — not as a specimen of criticism.

## 2. Method

**Sourcing.** WebSearch/WebFetch against, in descending order of weight I gave them:

1. **Library catalogues** — Wellcome Collection's per-volume record for *Tantrik Texts* (T2) is the
   only catalogue-grade evidence in the file for the series' per-volume editors and imprints.
2. **Institutional primary sources** — the Australian Royal Commission's own case-study page (T10);
   the Divine Life Society's own download catalogue (T22); the Fondation Alain Daniélou's own
   *Transcultural Dialogues* (T24, with a hostile-source caveat attached in the JSON).
3. **Publisher / bookseller records** — Exotic India's Prachya Prakashan listing (T6) and Weiser
   Antiquarian's TG 11 / TG 12 records (T25). These are trade sources; they are reliable about
   *attribution and imprint* and unreliable about *dates*, and I treated them that way.
4. **Wikipedia and Banglapedia** — used as **pointers to dated bibliography**, never as the
   evidentiary ground for a contested claim. Every contested block in the file names a non-Wikipedia
   holder for each position, or says explicitly that it could not.
5. **One full-text primary-scholarship read** — the repo scratchpad already holds a `pdftotext`
   extraction of Ullrey, *Grim Grimoires* (UCSB 2016) at `scratchpad/ullrey.txt`. I grepped it this
   round. It supplied the only hard evidence in the file about how Ram Kumar Rai's translations are
   actually *used* (n.45, the Ḍāmara six-acts verse), the Bagchi–Magee base-text relation, and
   Ullrey's n.109 remark on Avalon's Indian reception.

**Grading.** `textCompleteness` grades the **source text or the mediating work's own extent**, with
`completenessBasis` stating what is missing and how I know. Three grades in the file rest on positive
evidence rather than absence and those are the ones worth trusting:

- `sys:rai-damara-1988` = **partial**, because Ullrey quotes a verse that specifies *which finger for
  which of the six acts* and nothing about sequence, mantra or timing. A component spec without a
  sequence is partial, demonstrably.
- `sys:magee-vamakesvarimatam-1986` = **partial**, because the volume's own framing says the tantra has
  two parts and this is the five-paṭala first part; the missing three paṭalas are the Yoginīhṛdaya and
  they are named and counted.
- `sys:lakshmanjoo-secret-supreme-1985` = **partial**, because the book itself says it presents what
  Lakshmanjoo considered the *most important chapters* of the Tantrāloka, orally.

**Edges.** `ASSERTED: true` was reserved for documented dependency. 20 of 30 edges are asserted. The
strongest is a **printed permissions line**: Osho's 1977 Harper Colophon edition acknowledging that the
sūtras are Paul Reps's "Centering", used by permission. The ten `ASSERTED: false` edges are kept in the
file on purpose — several are *negative* results and one, `sys:js-vijnanabhairava-1979 →
sys:osho-book-of-secrets`, is **falsified by chronology** (Singh is 1979; Osho commented in 1972–73)
and is retained because a dated refutation is worth more than a missing row.

**The razor.** Ullrey reproduces Rai's English of the ṣaṭkarma finger-assignment verse verbatim, in
both languages, in a footnote. I read it and did not carry it. That asymmetry is deliberate and is
recorded in the JSON: a dissertation is an argument with a critical apparatus; this file is an index.

---

## 3. Corrections to the brief — three, and two of them matter

1. **Prachya Prakashan is a two-translator house.** The brief attributes the Prachya English operative
   corpus to Ram Kumar Rai. *Vāmakeśvarīmatam* (Tantra Granthamālā 11) and *Kaulajñāna-nirṇaya* (TG 12),
   both Varanasi 1986, both **first English editions**, are **Mike Magee's**. Filing them under Rai
   would have mis-attributed the first English Śrīvidyā manual and the first English Kaulajñānanirṇaya.
2. **Rai did not translate the Śāradātilaka into English.** The brief lists it among his works. I
   searched for it specifically and found no such edition. The Śāradātilaka's Sanskrit is Tantrik Texts
   XVI–XVII (1933–, and therefore **not** PD-US); the widely circulating modern editions are Sudhakar
   Malaviya's (Hindi/Sanskrit) and the Shri Garib Das Oriental Series *Sharada Tilaka Tantram with
   notes and translations by many scholars*. Rai's actual list, from the publisher's own catalogue, is:
   Kulārṇava (1983), Mahīdhara's Mantramahodadhi (2 vols), Ḍāmara Tantra (1988), *Dictionaries of Tantra
   Śāstra* / Tantrābhidhānam, Śiva Svarodaya, Mātṛkābheda Tantra (1983), Śrīvidyārṇava Tantra (1989),
   Kāmaratna Tantra, Śāktānandataraṅgiṇī, Nārada Pañcarātra, Dhanada Tantra, Mantra Rāmāyaṇa (TG 15),
   *Hindi Mantra Mahārṇava* (3 vols, ed.), *Encyclopedia of Yoga*, *Encyclopedia of Indian Erotics*.
3. **Dyczkowski's 2023 Tantrāloka is self-published at Varanasi, not Indica Books.** Indica published
   his *A Journey in the World of the Tantras* (2004). The 2023 volumes carry no trade imprint. Not
   fully resolved — Indica may have handled Indian distribution — and the JSON says so.

---

## 4. Gaps — what this file does not know

**G1 — Ram Kumar Rai has no dates.** No birth year, no death year, no biography, no obituary located.
The single most important modern translator of the operative tantras into English is, on the open
record, a name on a title page. This is the largest gap in the slice.

**G2 — Nobody has assessed Rai's translation method in print, in either direction.** I searched
specifically for Bühnemann, Ullrey and general scholarly assessment. Nothing. The strongest thing that
can be said is Ullrey's *revealed preference*: he cites and quotes Rai in argument, and supplies the
Sanskrit in the same footnote. That is a working scholar using him as a pointer and checking him. It is
not a verdict on his method, and the JSON does not dress it up as one.

**G3 — Rai's base texts are unidentified.** Whether his 1983 Kulārṇava Sanskrit *is* Tārānātha
Vidyāratna's 1917 Tantrik Texts V is unresolved, and it is the highest-value cheap check in the whole
slice: if it is, the PD 1917 Sanskrit is quotable while Rai's English is not, which is a real and usable
asymmetry for the site. One look at Rai's preface settles it. I did not have the volume.

**G4 — Taylor (2001) was not read.** Every Woodroffe/Ghosh claim in the file rests on reported
summaries of her findings. The per-volume division of labour between Woodroffe, Ghose and the Sanskrit
editors is exactly the thing the file most needs and least has.

**G5 — The Royal Commission report PDF was not read.** The fetch timed out. Everything in the
`sys:kundalini-tantra-1984` contested block is from the Commission's own landing page plus press
reporting. The distinction the file draws — conviction and adverse findings as to **Akhandananda** and
the institution; evidence given but ruled out of scope and untested, and **no finding**, as to
**Satyananda** — is the one the sources support, and it is the one thing in this file I would least
like to be wrong about. **Verify before printing.**

**G6 — The Tantrik Texts per-volume PD boundary rests on one non-academic aggregation.** T3
(sanskritebooks.org) is the only source giving all 22 volumes with years. It contradicts the Wellcome
catalogue on volume I (T2: Tārānātha Vidyāratna 1913; T3: Pañcānana Bhaṭṭācārya 1937). The obvious
reconciliation is a 1937 re-edition, but nothing states that, and **the PD/non-PD line for volumes
XVI–XXII depends on T3's dates being right**. Do not ship a per-volume PD chip on this evidence.

**G7 — Named criticisms of living or recently-living people are search-summary grade.** The Guha
("sectarian non-scholar") and Habib ("Hindutva pamphleteer") formulations about **David Frawley, who is
alive**, were not traced to page-level citations. The Daniélou critique is known to me only through the
**Fondation Alain Daniélou's own summary of his critics** — i.e. the defendant characterising the
charge. Both facts are recorded in the JSON; neither should be printed until traced.

**G8 — Dates missing or unverified:** Ram Kumar Rai (all), Mike Magee (all), Tārānātha Vidyāratna
(all), Rai's Mantramahodadhi (commonly 1984, unconfirmed), Sivananda's *Kundalini Yoga* (none),
Kaviraj's *Tāntrik Vāṅmaya meṃ Śāktadṛṣṭi* publisher, B. V. Raman's bibliography (Wikipedia lists 20+
titles with **no years and no publishers** — his dated bibliography is thinner than it looks).

**G9 — Panchanan Tarkaratna and tantra: possible name collision, unresolved.** Banglapedia's list of
his edited works is Purāṇic, Smṛti and epic — **no tantra**. Meanwhile a "Pañcānana Bhaṭṭācārya" edits
Tantrik Texts I (1937 re-ed.) and XXI (*Tārābhaktisudhārṇava*, 1940). The dates are compatible and the
name is common. **No edge was drawn on this.** An auditor with Bengali-language sources should settle it.

**G10 — Not covered at all, and arguably in scope:** Swami Vivekananda's *Raja Yoga* (1896) — the
prototype of the whole systematizer mode, and PD — is in the repo's existing atlas and was left there.
Also uncovered: Sir Woodroffe's *The World as Power* series; M. P. Pandit (Woodroffe's popularizer,
who bridges to the Sri Aurobindo Ashram and whose 1965 Kulārṇava "readings" S10 already grades); Georg
Feuerstein as a systematizer in his own right; Harish Johari; and the Śrī Vidyā popularizers.

---

## 5. What the auditor should attack, in priority order

**A1. The completeness grades that rest on genre rather than examination.** Six rows are graded from
what I know about the *kind* of book rather than from the book: `sys:serpent-power-1918` (partial),
`sys:js-siva-sutras` (referenced), `sys:js-pratyabhijnahrdayam` (referenced),
`sys:danielou-yoga-reintegration-1949` (partial, explicitly flagged as provisional),
`sys:magee-kaulajnananirnaya-1986` (referenced), `sys:sivananda-corpus` (partial). Each `evidence`
field says so. Attack the ones where the genre inference is doing all the work.

**A2. The `sortYear` on `sys:sivananda-kundalini-yoga` is a guess (1935) with `year: null` in the
edition.** That is an inconsistency I left visible rather than papering over. Either find the date or
strip the sortYear.

**A3. The Satyananda contested block.** See G5. Read the report. The precise question is whether the
published report says anything at all about Satyananda personally, or whether the "out of scope and
untested" characterisation comes only from secondary reporting.

**A4. Every `ASSERTED: false` edge — try to promote or delete it.** Especially:
- `sys:tantrik-texts-series → sys:rai-kularnava-1983` (G3, cheap to settle);
- `sys:serpent-power-1918 → sys:kundalini-tantra-1984` (check Kundalini Tantra's own bibliography);
- `sys:wilson-religious-sects → sys:mw-brahmanism-hinduism-1891` (both texts are PD and full-text
  searchable on archive.org — this is a fifteen-minute check);
- `sys:serpent-power-1918 → au:jung-cg` (Leland 2016 should have the page).

**A5. The `lexicographic-dependency` non-edge.** I left one Monier-Williams edge in the file with
`ASSERTED: false` and a note saying the temptation to draw "everyone used MW" edges across the graph was
noticed and refused. Check that I refused it consistently — if any *other* row implies that dependency
in prose, it is a violation.

**A6. The Daniélou provenance problem.** The JSON attaches the caveat, but an auditor should decide
whether a charge known only through the defendant's summary belongs in the file at all, or whether it
should be reduced to "criticised on grounds not verified this round".

**A7. Schema drift.** The brief specified `works[{id,title,titleOriginal,author,culture,dateText,
sortYear,editions[{translator,year,publisher,pdStatus,quoteSafe}],procedures[{typeAsFiled,
textCompleteness,completenessBasis,evidence,harmNote}],sources[],contested}]` and
`edges[{from,to,kind,basis,evidence,sources,ASSERTED}]`. **That is what this file emits, exactly.**
Note that the *existing* slices in `scratchpad/opgraph/` are mutually inconsistent — S10 uses
`date`/`editions[{cite,pd}]`/`procedures[{type,...}]`, S11 uses `dateClaim`/`authorId`, S12 has no
`editions` at all, S13 uses `dateText`/`completeness`, S14 uses `textCompleteness`/`harm`. I matched the
**brief**, not any one predecessor, because no two predecessors agree. If the generator normalises,
this file needs a mapper like the rest; if it does not, the predecessors need migrating, not this one.
I have added, beyond the specified shape: `meta`, `authors[]`, `structuralFindings[]`, and per-work
`correctsBrief` on one row. All are additive.

**A8. Two contested blocks are cross-references, not restatements.** `sys:danielou-shiva-dionysos-1979`
points at `sys:danielou-hindu-polytheism-1964` rather than duplicating the positions. That is
deliberate (duplicated positions drift apart), but it means a renderer that shows one row without the
other will show an empty contested block. Flag for whoever builds the view.

---

## 6. The findings I would defend hardest

1. **The public-domain inversion is total in this slice.** Every quotable thing is Orientalist framing
   (Wilson 1819–1840, Monier-Williams 1872/1891/1899) or Woodroffe's pre-1930 volumes — most of which
   are **Sanskrit only**, so quotability confers no capability on an English reader. Every modern
   English gateway is cite-only without exception: Rai, Magee, Jaideva Singh, Dyczkowski, Lakshmanjoo,
   Satyananda, Sivananda, Daniélou, Frawley, Osho. FRAMING §4.4 predicts the PD constraint selects the
   worst witnesses; here it selects them at ~100%.

2. **The systematizers didn't just transmit the operative corpus — they completed it.** On this graph's
   own grades, the Sanskrit sources are overwhelmingly `referenced` or `partial`: they presume a teacher.
   The rows graded `complete` are almost all **modern**: APMB (1969), Kundalini Tantra (1984), Yoga Nidra
   (1976), Hindu Predictive Astrology (1938), Astrology of the Seers (1990), The Yoga of Herbs (1986),
   Reps's Centering (1957). The executability is the mediator's contribution.

3. **There are two distinct faithfulness failures and conflating them is the standard error.**
   *Selection* failure — Woodroffe made the late, reformist Mahānirvāṇa the flagship, so the most-read
   tantra in English is atypical of its corpus. *Construction* failure — Satyananda's yoga nidrā and
   Frawley's "Vedic astrology" are modern builds under ancient labels. Neither is a mistranslation. A
   review that only asked "is the rendering accurate?" would clear both.

4. **Completeness is level-relative, and the Vijñānabhairava proves it.** The *set* of 112 dhāraṇās is
   complete in Singh, in Reps and in Osho; every *individual* dhāraṇā is `referenced` in all three,
   because each is a one-line pointer. Any scheme assigning one completeness value per work gets this
   text wrong in both directions simultaneously.

5. **Rai's *Dictionaries of Tantra Śāstra* publishes the mantroddhāra key.** FRAMING §2.2 cites
   mantroddhāra — publish the whole, encode the operative key so it is unusable without the lineage — as
   the tradition's own internal precedent for the site's whole approach. A printed English bīja-lexicon
   removes that gate. Woodroffe did the same lexicon in Sanskrit in 1913 (Tantrik Texts I); Rai did it in
   English. The harm profile is purely *compositional* under C-7: the lexicon plus an operative text is a
   capability neither is alone. The site holds neither, and should keep it that way.

6. **The one fully documented transmission chain is three nodes long:** Lakshman Joo (oral, Kashmir) →
   Reps, *Centering* (1957) → Osho, *The Book of the Secrets* (1972–74). Every link has a printed
   artefact; the last is a permissions line. It is also, note, a chain in which the text loses its
   apparatus at every step — no Sanskrit, no loci, no notes by the time it reaches a mass readership —
   and gains an operative addition nobody in the Sanskrit tradition supplied: Osho's *selection layer*,
   the method for choosing which of the 112 suits a given person.

7. **The honoured Indian scholarship is not in English.** Kaviraj's Sahitya Akademi-winning tantra study
   (1964) is Hindi with no English edition; Tarkaratna's corpus is Bengali; Rai's *Mantra Mahārṇava* is
   Hindi. The anglophone default authorities on tantra are a British judge writing 1913–1922 and a
   Varanasi publisher's 1980s English list. That is not incidental to the field's shape — it *is* the
   field's shape, and it is the reason a site like this one has the sources it has.
