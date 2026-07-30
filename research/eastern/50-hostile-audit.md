# 50 — HOSTILE AUDIT of the Eastern-counterpart round (east2)

**Auditor:** hostile, with strike authority. **Date:** 2026-07-30.
**Governing document:** `docs/FRAMING.md` (adopted 2026-07-30, in force).
**Under audit:** `15-indian-grimoire.json` + notes · `15-eastern-systematizers.json` + notes ·
`16-criticism-reception.json` + notes · `40-nav-redesign.md` and the eleven measurement scripts.

**Verdict in one line.** The round is **not thin** — 508 quality-filtered domain claims survive — and the
razor holds absolutely. **Twelve strikes are logged. Two are shipping blockers**, and both are in the
EVIDENCE column, exactly where the brief predicted: the round's most attractive finding (Bhūtaḍāmara ↔
Goetia) is filed in a way that cannot survive contact with the shipped graph, and one slice has inverted the
polarity of the field that decides whether an edge is a claim or a refusal.

---

## 0. What was actually checked, and how

| Check | Method | Result |
|---|---|---|
| RAZOR | seven-pattern mechanical scan of all three JSON files (bīja/seed-syllable strings, repetition counts, clock and nth-day timings, second-person imperatives, quantities+units, operative substances, yantra templates, target-substitution formulae) | **0 true positives.** Three hits, all false: a footnote number `n.108`, the English words *aim*/*Āgam* inside longer strings, and a description of *what a book describes* |
| Harm coverage | every `procedures[]` row whose text touches ṣaṭkarman / māraṇa / vaśīkaraṇa / abhicāra / hostile / coercive | 34 hostile-touching rows, 5 without a `harmNote`; **all five inspected and all five defensible** (two are explicit *negative* findings, one is temple liturgy, one is counter-sorcery, one is magic-square arithmetic) |
| LICENSING | every `editions[]` entry in all three slices read against the named-house list and the 1930 threshold | Rai, Magee, Dyczkowski, Jaideva Singh, Satyananda/Bihar School, Sivananda/DLS, Daniélou, Frawley, Osho, Reps, Lakshmanjoo, Raman: **all `cite-only`, correctly.** Woodroffe/Avalon and Tarkaratna carry **per-volume** verdicts. Two defects found (S5, S6) and one policy gap (S7) |
| FABRICATION | **18** cited works/editions/attributions spot-checked live, weighted to the grimoire slice | **0 fabrications.** Every one resolved to a real publication with the stated metadata. Three were *more conservative than the record warranted* — see §3 |
| EVIDENCE | every edge in all 172 read; the Goetia comparison read in full; the shipped `assets/js/core/data/opgraph.js` relation vocabulary and relation-claim field set read for comparison | 4 strikes, 2 of them blockers |
| LIVING-DISPUTE | the Kripal, Doniger, Malhotra/Nicholson, Sivananda, Satyananda, Osho, Caldwell, Frawley, Daniélou and Brooks rows read in full | Discipline is **excellent** — allegation → response → outcome, holders named, nothing adjudicated, absence-of-finding recorded as absence. 4 strikes, all rewrite-in-place, none structural |

Verification ran against live sources this round. Node was resolved at `C:\Program Files\nodejs\node.exe`
(the conda path in the standing memory note is not the only one present).

---

## 1. THE STRIKES

### ■ S1 — EVIDENCE · **BLOCKER** · the Bhūtaḍāmara ↔ Ars Goetia edge is *the site's own comparison* and does not exist under §2.4

`15-indian-grimoire.json`, edge `gri:bhutadamara-buddhist —STRUCTURAL_ANALOGUE_OF→ gw:ars-goetia`,
`ASSERTED: true`. Its own field says it:

> `"assertionScope": "The edge asserts a STRUCTURAL PARALLEL as an observation of this slice."`

FRAMING §2.4: *"Every parallel, every direction of borrowing and every priority statement is **attributed to
a named scholar, work, year and page**… Every parallel edge carries `claimedBy: { author, work, year,
locus }`. **An edge without it does not render.**"* FRAMING §8.2: *"**Where no scholar has made the
comparison, there is no row.**"*

The edge has no `claimedBy` and no scholar behind the comparison. Unpacking the four correspondences
confirms it. Correspondences (1)–(3) are Ullrey's descriptions **of the Bhūtaḍāmaratantra alone** (U1 pp.
552, 575–576, 600). The comparison in each case is the clause the compiler appended — *"Compare the Ars
Goetia's ranked, individually named and individually rited spirit list"*, *"Compare the Goetic constraint"*,
*"Compare the Goetic office-and-service structure."* Correspondence (4) is anchored in a **Jain** verse
(Bhairavapadmāvatīkalpa 3.24) and the slice itself records that no source read locates a dismissal rubric
inside the Bhūtaḍāmara at all. The only printed linkage between this corpus and the Goetia that anyone has
published is Ullrey's semantic aside on √ḍam / *goēs* — which the slice correctly files as a **declined**
edge, quoting his own governing rule (*"Etymology similarities in titles does not establish connection"*,
p. 192) and his J. Z. Smith caution that comparison yields affinity, not influence (p. 193 n.117).

**The compiler wrote the fence and then walked past it.** Ullrey's methodological rule is quoted, in this
file, on the edge immediately below — and the four-point comparison is asserted anyway.

**Aggravating, and this is what makes it a blocker rather than a note.** The fence cannot survive
normalisation. The shipped `assets/js/core/data/opgraph.js` relation-claim record has exactly these fields:
`asserted, bestCitation, confusedBy, contested, endpointsLabel, epLabel, fromId, gateRound, id, label,
notAssertedReason, note, procedureLevel, propagatedTypeTerm, reassertIf, relation, sliceFile, sourceTiers,
sources, toId, type, weight, witnesses`. **There is no `assertionScope` key and no `claimedBy` key.** The
shipped relation vocabulary is exactly four values — `TRANSMITS_TO` (25), `COMMENTS_ON` (9), `PARALLELS`
(10), `NON_EDGE` (1). `STRUCTURAL_ANALOGUE_OF` has no home but `PARALLELS`, and every shipped `PARALLELS`
edge is scholar-asserted — one of them says so in terms: *"exactly the edge type the brief asks for and the
only one in this slice with a named scholar asserting it."* So the edge normalises to
`asserted:true, relation:"PARALLELS"`, the `assertionScope` string is dropped on the floor, and the atlas
draws an arc between a 7th–8th-century Buddhist tantra and a 17th-century English compilation **on a map
whose stated subject is who read whom**. To any reader that arc is a transmission claim. Three fences in
prose lose to one dropped key.

**Verdict: VOID as an asserted edge.** Refile as `relation: NON_EDGE` with
`notAssertedReason: "structural resemblance only; no published comparison exists"` — the shipped vocabulary
already carries the construct and the repo already uses it once — or hold it out of the graph entirely as an
open research question. The declined `TRANSMISSION_DEPENDENCY` edge is correct and stays exactly as written;
it is the best single paragraph in the round.

*The slice's own A2 asked whether four points with one fenced leg is worth publishing. That was the wrong
question. A three-point parallel with no fenced leg is equally inadmissible, because the defect is not the
fourth leg — it is that nobody but this site has drawn the comparison.*

---

### ■ S2 — EVIDENCE · **BLOCKER** · `ASSERTED` has inverted polarity in S16 against both sister slices and the shipped graph

Three definitions of the same field name, in one round:

| File | `ASSERTED: true` means | `ASSERTED: false` means |
|---|---|---|
| `15-indian-grimoire.json` (`meta.assertedField`) | "this slice asserts the relation holds and `evidence` names the documentation" | "a CANDIDATE that this slice explicitly DECLINES to assert" |
| `15-eastern-systematizers.json` (notes §2) | "reserved for documented dependency" (20 of 30) | negative results and one chronological falsification |
| **`16-criticism-reception.json`** (`meta.assertedEdges`) | **"16 of 88 edges carry ASSERTED=true. Every one names itself as a compiler inference"** | **the 72 documented edges** |
| shipped `opgraph.js` | documented relation-claim | declined; paired with `relation: "NON_EDGE"` |

S16 has redefined the field to mean its opposite. Its `ASSERTED: false` set contains its **best** material —
Bharati's own 1970 paper naming the Maharishi movement and ISKCON as pizza-effect cases; Taylor's
documentary finding from Woodroffe's own prefaces. Its `ASSERTED: true` set is, by its own declaration,
exactly the compiler's unverified inferences.

**A generator merging these three files into the shipped graph will invert 88 edges** — suppressing the
documentary ones as non-edges and rendering the site's own guesses as asserted claims. That is S1's failure
mode reproduced 16 times over, automatically, without anyone deciding to do it.

**Verdict: the field is VOID in S16 as named.** Rename to `compilerInference: true` (which is what it
actually records), restore `ASSERTED` to the sister slices' polarity across all 88 edges, and pin the
semantics in `meta` on every future slice. Nothing else in the file needs to move.

---

### ■ S3 — EVIDENCE · a `REFUTES` edge between two living scholars neither of whom was shown to have engaged the other

`crit:white-kiss-yogini —REFUTES→ crit:brooks-secret-three-cities`, basis
`"opposed-readings-of-the-same-corpus"`. The notes admit it (§7.5): *"neither author was verified to have
engaged the other. The opposition is real at the level of readings; the **edge** is mine."*

This is §2.4 again, with a BLP edge on it: David Gordon White and Douglas Brooks are both living, and the
edge asserts a public scholarly refutation that may not exist in print. An opposition *at the level of
readings* is a **PARALLELS** relation at most, and only if a scholar has stated it.

**Verdict: VOID.** One degree weaker, same treatment for `crit:wedemeyer —REFUTES→ crit:white-kiss-yogini`
— Wedemeyer's three-fallacies framing is real and published, but the notes concede *"that White is the
target of the first is my reading."* Downgrade to `COMMENTS_ON` with the reading attributed to the compiler
in-field, or cut.

---

### ■ S4 — EVIDENCE · four incompatible edge vocabularies in one round, none of them the shipped one

- shipped: `TRANSMITS_TO · COMMENTS_ON · PARALLELS · NON_EDGE` (four values, total).
- S15-grimoire: 20 SCREAMING_SNAKE kinds (`MEMBER_OF_CORPUS`, `SOURCE_OF_RECENSION`, `PRINTED_IN`,
  `IS_TRANSMISSION_CHANNEL_FOR`, `STRUCTURAL_ANALOGUE_OF`, …).
- S15-systematizers: 10 lowercase-hyphen kinds (`acknowledged-textual-source`, `edited-series-of`,
  `initiated-by`, `pupil-of`, `lexicographic-dependency`, …).
- S16: 10 kinds under a declared `meta.edgeVocabularyExtension` (`REFUTES` ×35, `REFRAMES` ×14,
  `CRITICISES_TRANSLATION`, `ALLEGES_PLAGIARISM`, `LEGAL_ACTION_AGAINST`, `SUPERSEDED_BY_COLLABORATION`, …).

Only S16 declares an extension, and it declares it against the shipped set without supplying the collapse
mapping. **Every slice must ship a declared, total mapping onto the four shipped relations**, and S1 shows
why: the mapping is where the epistemic distinctions die.

---

### ■ S5 — LICENSING · the AHRQ verdict states the wrong mechanism

`crit:ospina-ahrq-meditation-2007`: `pdStatus: "US federal work — the report itself is not under
copyright"`, `quoteSafe: true`. Verified this round: AHRQ Evidence Report/Technology Assessment No. 155
(2007), PMID 17764203 — real, correctly cited. But EPC evidence reports are **prepared under contract by an
Evidence-based Practice Center**, not by federal officers in the course of their duties, so 17 U.S.C. §105
does not apply automatically. What AHRQ actually supplies is a front-matter dedication —
*"This document is in the public domain and may be used and reprinted without permission except those
copyrighted materials noted for which further reproduction is prohibited…"* FRAMING §4.3 requires a
**checkable mechanism**; "US federal work" is not the mechanism operating here, and it is the kind of
plausible-sounding ground §4.3 exists to refuse.

Second defect in the same neighbourhood: the DARE/CRD structured abstracts the slice uses as locators
(`NBK74759` for Ospina, `NBK70827` for Canter & Ernst) carry **"Copyright © 2014 University of York"** and
are separately in copyright.

**Verdict: rewrite in place.** Record the AHRQ dedication sentence verbatim as `pdBasis.ground`, note the
contractor authorship, and add a line that the CRD abstracts are not covered.

---

### ■ S6 — LICENSING · verbatim text from a cite-only edition, inside the record that says it isn't there

`sys:rai-damara-1988` is the round's cleanest razor decision and it is *almost* airtight. It refuses the
ṣaṭkarma finger-assignment verse that Ullrey prints in full in both languages, and says so:

> "The verse itself is NOT reproduced in this file, in either language, notwithstanding that a scholarly
> source reproduces it."

That sentence is not quite true of its own record, which carries the Sanskrit colophon string
`iti ṣaṭkarmaṇi aṅgulinirṇayaḥ samāptaḥ` and Rai's English rendering `Liquidation` for *māraṇa* — both from
Rai 1988, Prachya Prakashan, **cite-only**. Volume is de minimis and neither is operative content. But §4.1
is absolute (*"no quoted text and no translation text… never, however important to the argument"*), and the
whole force of that record is that it says exactly what it withholds.

**Verdict: rewrite in place.** Drop both strings, or restate the sentence to describe what is actually
withheld. Thirty seconds' work on the record that most deserves to be unimpeachable.

---

### ■ S7 — LICENSING · nothing in FRAMING caps quotation of in-copyright *secondary* scholarship, and this round leans on one dissertation

FRAMING §4.5's five caps (120 words / 700 codepoints, paired 180/900, never a complete operative unit, per-work
5%-or-20, non-contiguity, one-locus-one-edition) all govern **primary quoted text**. There is no rule at all
about quoting the scholarship.

`15-indian-grimoire.json` carries **~295 verbatim spans** from Ullrey's dissertation (U1, `pd: false`, open
access but in copyright), longest genuine ones running 30–40 words. That is normal, defensible scholarly
quotation. It is also **unbudgeted, uncapped and unmeasured**, and if `evidence` strings flow to rendered
pages the site will carry several thousand words of one work. The slice's whole epistemic position — one
source read in full, everything traced through it — makes this concentration structural rather than
incidental.

**Verdict: policy gap, logged against FRAMING, not against the slice.** A secondary-quotation clause is
needed before this material renders. The round is not at fault for obeying a rule that was never written.

---

### ■ S8 — RAZOR-adjacent · **no row in the round carries the accusation-violence record FRAMING §9.5 makes mandatory**

The razor itself is clean and I want that on the record: seven patterns, three files, **zero true
positives**, against a principal source that prints all of it by explicit methodological choice (U1 p. 146:
*"I translate mantras, deity names, ingredients, and procedures in full"*). Fifty-nine harm notes, specific,
naming the category and the target class. `gri:udd-corpus` names murder as the corpus's harm centre;
`gri:bazaar-print-corpus` names the sharpest point — lethal and subjugating material at pavement prices with
no gatekeeping. That is good work.

What is missing is the thing FRAMING §9.5 says in terms is *"the true present-day harm of this material"*:
India's NCRB record of deaths linked to witchcraft accusation and superstition-related violence, and the
**Maharashtra Prevention of Witch Hunting, Evil and Aghori Practices and Black Magic Act, 2013**, which
criminalises both practising black magic for gain **and accusing someone of being a witch**. Verified this
round: NCRB figures put such killings above 2,500 across the relevant window, concentrated in Assam, Bihar,
Chhattisgarh, Jharkhand, Odisha, Rajasthan and Maharashtra among others; the 2013 Act is real and in force.

The bazaar-print note gets within one sentence of it — *"the point at which harm ceases to be historical"* —
and then names no figure and no statute. This is the round that catalogues the Indian ṣaṭkarman corpus at
scale; the note belongs to it.

**Verdict: rewrite in place** on `gri:udd-corpus`, `gri:bazaar-print-corpus` and `gri:brhat-indrajala`.

*Noted for the maintainer, not charged to this round: `grep -rn "NCRB|witchcraft accus|Maharashtra Act|
superstition" pages/ assets/js/core/data/abhichara-data.js` returns nothing. FRAMING §9.5 has not been
applied to the shipped abhicāra wing either.*

---

### ■ S9 — LIVING-DISPUTE · the Frawley hostile characterisations are un-traced

`sys:frawley-astrology-of-seers-1990` carries, attributed to two named living academics:

- Sudeshna Guha (Cambridge) — *"a sectarian non-scholar"*, proponent of a nationalist-history scheme;
- Irfan Habib — *"a Hindutva pamphleteer"* who *"telescoped the past to serve the present"* and is *"not
  minimally definable as a scholar of any kind."*

The record flags this itself, in capitals, as an audit warning. **A flagged untraced hostile
characterisation of a living person is still an untraced hostile characterisation**, and this is the exact
class of statement where being wrong about who said it is worse than being wrong about the content. My own
trace this round reached only the same tertiary layer the slice reached — the formulations reproduce
verbatim from an encyclopedia article, and neither Guha's nor Habib's underlying publication was located.

**Verdict: rewrite in place**, per the compiler's own A6: reduce to *"criticised on grounds not traced this
round"*, or trace to Guha's and Habib's actual works with pages. Nothing else in that block moves — the
Frawley/AIVS position, the D.Litts, the Padma Bhushan 2015 and the descriptive middle position are all
properly held and properly attributed, and the Out-of-India block is exemplary.

---

### ■ S10 — LIVING-DISPUTE · the Daniélou charge is sourced only to the defendant's own foundation

`sys:danielou-hindu-polytheism-1964` records the *"abuse in the field of comparative religion"* charge and
the *"unacceptable speculation"* charge as summarised by the **Fondation Alain Daniélou's own**
*Transcultural Dialogues*, with the rebuttal in the adjacent position — also the Fondation's. Two of the
three positions in that block have the same author, and the record says so and calls it laundering if left
unmarked.

Marking it is necessary and not sufficient. A contested block whose critic-position is written by the
defence is not a two-position block.

**Verdict: rewrite in place.** Reduce to *"criticised on grounds this round could not source
independently"*, or find a named critic. The cross-reference construction on
`sys:danielou-shiva-dionysos-1979` (positions held once, pointed to rather than duplicated) is correct and
should stay — but flag for the view builder that a row rendered alone will show an empty contested block.

---

### ■ S11 — LIVING-DISPUTE / accuracy · Keith Cantú's field is mischaracterised, to the slice's own cost

`15-indian-grimoire-notes.md` §5.3: *"A search this round for Cantú on Ḍāmara material found nothing — his
published work is on Bengali Sufism and Bāul song."*

Verified this round: **Keith Edward Cantú is a historian of South Asian yoga and tantra.** PhD, Religious
Studies (South Asian religions), **UC Santa Barbara, 2021** — Ullrey's own department. Postdoctoral fellow
in Asian Religious Traditions, Center for the Study of World Religions, Harvard Divinity School. Author of
*Like a Tree Universally Spread: Sri Sabhapati Swami and Śivarājayoga* (Oxford University Press, 2023), of
an analysis of a **Middle Bengali text on tantric yoga** ("The Garland of Bones"), and of the Oxford
Bibliographies annotated bibliography of haṭhayoga. Bāul and Bengali Sufism are one strand of a South Asian
tantra portfolio, not the whole of it.

Two consequences. **First**, the characterisation understates a living scholar's competence in precisely the
area at issue, on a search that did not find him. **Second**, it costs the slice: the
`gri:bhutadamara-saiva → gri:damarutantra-bengali` edge is graded `confidence: low` partly on the ground
that the personal communication behind it is from someone outside the field. He is not outside the field; he
is a UCSB South Asian tantra PhD who read the Bengali table of contents. The edge is still thin — a contents
list plus an unpublished conversation is still a contents list plus an unpublished conversation — but it is
thin for the right reason now.

**Verdict: rewrite in place.** The fix strengthens the round.

---

### ■ S12 — LIVING-DISPUTE · `crit:brooks-anusara-entanglement` is struck, as its own author recommended

Sole source: February 2012 yoga-press journalism (elephantjournal, yogadork). Two living people. Scholarly
payload: one structural observation about scholar-practitioner entanglement that the file makes elsewhere
with better sourcing. The row's own `auditFlag` reads *"WEAKEST-SOURCED ROW IN THE FILE… Strike-candidate"*
and its `harmNote` invites the auditor to strike it.

I accept the invitation. The row is careful — it states plainly that no allegation against Douglas Brooks is
recorded or implied and that the misconduct allegations concerned John Friend and are out of scope — and
carefulness is not the test. The test is whether journalism about a movement's collapse, naming two living
people, earns its place on evidentiary grounds. It does not.

**Verdict: STRUCK**, row and edge together.

---

## 2. WHAT SURVIVES, AND WHAT IS GENUINELY GOOD

The strike list is long because the standard is hostile, not because the round is weak. Named for the record:

1. **The razor holds absolutely**, mechanically verified, against sources that print everything the round
   withholds. `15-eastern-systematizers` reads Ullrey's footnote reproducing Rai's ṣaṭkarma verse in both
   languages and carries none of it. `15-indian-grimoire` describes the target-substitution **slot** and
   withholds the tokens. That is the C-5 rule executed correctly without being told.
2. **SF8 — shared error, not shared content, is what makes a dependency.** The one strong transmission edge
   in the grimoire slice (Buddhist → Śaiva Bhūtaḍāmara) rests on Śaiva manuscripts reproducing errors found
   in *late* Buddhist versions postdating the Tibetan translation. That is the same standard the repo's own
   S12 slice already calls *"the corpus's methodological gold standard for a transmission claim"* for the
   Scot → Goetia descent. Two slices, two continents, one criterion, arrived at independently. **This, not
   the Goetia parallel, is the round's headline finding.**
3. **SF2 + SF4 together** — a magic tantra's index verse does not describe it, and the surviving witnesses
   are commercial prints of undetermined manuscript provenance — are a genuine methodological result with
   teeth: they invalidate a whole class of confident statement about "the Uḍḍīśa Tantra" currently in
   circulation, including statements sourced to printed editions with commentaries.
4. **The systematizers slice is clean on the EVIDENCE axis, end to end.** Every asserted edge is a documented
   dependency — a printed permissions line (Osho 1977 Harper Colophon acknowledging Reps), a title page, a
   dated initiation record, a doctoral supervision. Every resemblance edge is **declined with the
   resemblance-is-not-dependency reason stated**, including the one the compiler most wanted
   (Serpent Power → Kundalini Tantra) and the one that is chronologically impossible (Singh 1979 → Osho
   1972–73, retained *as a dated refutation*). The `lexicographic-dependency` non-edge — noticing the
   temptation to draw "everyone used Monier-Williams" edges across the graph and refusing it in-file — is
   the single most disciplined decision in the round.
5. **The living-dispute discipline is the best I have audited in this repo.** Allegation → response →
   outcome, in that order, every time. Withdrawal recorded as not a finding; republication recorded as not a
   finding; ending a reply recorded as not conceding; institutional position stated as a fact about the
   source and never used to discount; the four kinds of objection to *Kālī's Child* kept separate; Narasingha
   Sil filed correctly as an objector *from inside* the psychoanalytic method rather than with the Order's
   defenders; Singleton/Mallinson given an edge type of its own so a scope correction is not rendered as a
   feud. The Sivananda row's closing sentence — *"If the site cannot carry this with all four positions and
   the explicit no-finding line intact, it must not carry it at all"* — is the correct instinct.
6. **Per-edition PD discipline is real, not decorative.** The 1947 KSTS Uḍḍāmareśvara is refused with the
   right reason (*"the archive.org uploader's CC0 tag is an UPLOADER CLAIM, not a rights determination"* —
   URAA-restored foreign publication). The Īśānaśivagurudevapaddhati is **split per printing** (TSS 69, 1920:
   PD; Bharatiya Vidya Prakashan 1988–89 with N. P. Unni: not) with the observation that the non-PD printing
   is the one actually in circulation and the one the archive.org scans of vols III–IV really are. The
   Tantrik Texts series is split at the 1930 threshold volume by volume. The Tarkaratna row records that
   "quotable" there means **quotable in Bengali**, which the site cannot check — a limit nobody asked for.
7. **The negative findings are the round's most under-rated product.** Ten declined edges in the grimoire
   slice, ten in the systematizers, and the Kerala result (SF6) that the two manuals the brief expected to
   be operative are temple-ritual paddhatis — recorded as *declined membership* rather than omitted, so the
   absence is legible and a later round cannot re-derive the error from silence.

---

## 3. CORRECTIONS *IN THE ROUND'S FAVOUR*, verified this round

The fabrication sweep found no fabrications and, in six places, found the round more conservative than the
record warranted. These are free upgrades:

| Slice's position | What the record actually says |
|---|---|
| U4: Bhattacharyya, "The Cult of Bhūtaḍāmara" (1933) — *"VENUE UNVERIFIED… do not print a venue"* | **Resolved.** *Proceedings and Transactions of the Sixth All-India Oriental Conference*, Patna, December 1930 (published Patna, 1933), pp. 349–370. The venue can be printed |
| U16: ĪŚGDP vols 2–4 TSS numbers *"commonly given as 72, 77, 83, NOT verified"* | **Vol. 2 = TSS 72 (1921) confirmed.** Two remain open |
| U8: Indrajālavidyāsaṃgraha 1915 — *"editorship UNRESOLVED"* | **Corroborated independently of archive.org's collection label:** Aśubodha Vidyābhūṣaṇa and Nityabodha Vidyāratna Bhaṭṭācārya, and the five constituent texts are exactly the five the slice lists (indrajālaśāstra, kāmaratna, dattātreyatantra, ṣaṭkarmadīpikā, siddhanāgārjunakakṣapuṭa) |
| U6: Bühnemann II, *"IIJ 43 (2000), pp. 27-43"* | **Correct as printed** — Bühnemann's own publication list gives 27–43. Secondary indexes giving 27–48 are wrong. Do not "correct" this |
| `crit:urban-tantra-2003 COMMENTS_ON crit:bharati-tantric-tradition` — notes: *"if Urban does not in fact engage Bharati, this edge is simply wrong. I did not verify it"* | **Verified.** Urban (2003) explicitly re-evaluates Bharati's *pizza effect* as a frame for India–West exchange. No longer a compiler inference |
| `crit:demichelis → repo:raja-yoga-1896` — *"applied from a subtitle. Low confidence"* | **Verified.** Vivekananda's *Rāja Yoga* (1896) is the seminal text of De Michelis's whole argument — that it reconfigured the *Yoga Sūtras* along emerging occultist/New Age lines. Upgrade the confidence |

**Also verified as cited, exactly:** Ullrey, *Grim Grimoires* (UCSB 2016, eScholarship qt4vt6f325, White
chair) · Yamano, JICPBS **XVII (2013)**, from p. 61 (the 61–118 / 61–99 end-page conflict is genuine and
correctly left open) · Bühnemann I, IIJ 42.4 (1999) 303–334 · Zadoo, Uḍḍāmareśvaratantra, KSTS **LXX**,
Research Dept, Srinagar, 1947 · Kāmaratnam, ed. Jvālāprasāda Miśra, Khemarāja Śrīkṛṣṇadāsa, 1899
(archive `b30095050`) · Kāmaratna Tantra, ed. Hemchandra Goswami Tattvabhushan, Assam Government Press,
Shillong, 1928, **110 pp. + 20 pp. diagrams** (JRAS review record) · Īśānaśivagurudevapaddhati, TSS 69,
T. Ganapati Sastri, 1920 · Bhairavapadmāvatīkalpa, ed. Jhavery, Sarabhai Manilal Nawab, Ahmedabad, 1944,
with Bandhuṣeṇa's commentary · Tantrasārasaṃgraha, ed. N. V. P. Unithiri, University of Calicut, 2002,
32 chapters · Sanderson, "The Śaiva Age," in Einoo (ed.), *Genesis and Development of Tantrism*, Tokyo,
2009, **Special Series 23, pp. 41–350** · Magee, *Vāmakeśvarīmatam*, Tantra Granthamālā **11**, Prachya
Prakashan, 1986, first English edition · Magee, *Kaulajñāna-nirṇaya*, TG **12**, on Bagchi's Sanskrit ·
Rai, *Ḍāmara Tantra*, TG **13**, Prachya Prakashan, 1988 · Dyczkowski, *Tantrāloka*, 11 vols, all 37
āhnikas, self-published Varanasi, 2023 · Royal Commission Case Study 21 (Akhandananda oversaw from c. 1974;
convicted 1989, **2 years 4 months**; no child-protection policy 1975–1989; report 2016) · Bharati, JAS
**29.2 (1970), 267–287** · Ospina et al., AHRQ Evidence Report No. 155 (2007), PMID 17764203 · Canter &
Ernst, *J Hypertens* **22.11 (2004)** · BBC World Service *Guru* (Ishleen Kaur; ~15 months; the exact
phrase "cruelty, coercion, rape and… the sexual assault of a child"); Julie Salter's testimony, December
2019 · Malhotra: JNU honorary visiting professorship, October 2018; the Young/Nicholson allegation, July
2015; HarperCollins declining to withdraw; the 2016 revised edition with Nicholson references reduced.

**18 checks. 0 fabrications.**

---

## 4. THE DOMAIN-CLAIM COUNT, AND WHETHER THE ROUND IS THIN

Counted mechanically, with quality filters (editions must carry a real year *and* publisher; procedure rows
must carry both a `completenessBasis` and an `evidence` string over 40 chars; edges must carry evidence over
40 chars *and* a source key; contested positions must carry a named holder *and* a substantive claim):

| | editions | procedure rows | edges | structural findings | named contested positions | **subtotal** |
|---|---|---|---|---|---|---|
| `15-indian-grimoire` | 19 | 45 | 53 | 8 | 29 | **154** |
| `15-eastern-systematizers` | 49 | 32 | 28 | 10 | 42 | **161** |
| `16-criticism-reception` | 47 | 7 | 87 | 0 | 52 | **193** |
| **total** | **115** | **84** | **168** | **18** | **123** | **508** |

Across 109 work rows, 172 edges and 87 source keys. Strikes void or remove roughly five of these (S1's
edge, S3's two, S12's row and edge); the remaining strikes are rewrites in place and do not reduce the
count. **≈503 domain claims survive.**

**Is the round thin? No — not in volume.** 500+ sourced domain claims is a substantial round by this repo's
standards, and the grimoire slice in particular delivers a genre analysis (SF1), a methodological
prohibition (SF2), a transmission-channel finding (SF4), a dependency criterion (SF8) and a corpus-shape
correction (SF6) that the repo did not have.

**It is thin in depth, in one specific and correctly-declared way.** Across all three slices, **exactly one
source was read in full** — Ullrey's dissertation. **34 source keys are marked NOT READ.** **24 of 87 source
keys (28%) are tertiary** — Wikipedia, Banglapedia, wisdomlib, and in one case a bookseller's copy.

That last figure is unevenly distributed, and the distribution is worth stating because one slice's notes do
not:

- `15-indian-grimoire`: 3 of 24 tertiary (13%), 15 NOT READ, 1 read in full. **The notes state this
  plainly** and the grades are hedged accordingly.
- `16-criticism-reception`: 9 of 38 tertiary (24%), 16 NOT READ. **The notes state it in the first sentence
  of §3** — *"I read no monograph in this slice. Not one."* That is the correct way to file a weak base.
- `15-eastern-systematizers`: **12 of 25 tertiary — 48%.** The notes describe a sourcing hierarchy with
  library catalogues weighted first and Wikipedia used only "as pointers to dated bibliography." That is
  true of the *use*, but it understates the *base*: nearly half the source list is Wikipedia-family. **This
  is the round's one honesty gap of self-description**, and it should be corrected in the notes rather than
  argued about — the slice's findings survive it, because its asserted edges rest on title pages, printed
  acknowledgments and dated records rather than on the tertiary layer.

The single highest-value cheap check in the round remains the one its own author identified: **whether Ram
Kumar Rai's 1983 Kulārṇava Sanskrit is Tārānātha Vidyāratna's Tantrik Texts V (1917)**. If it is, the 1917
Sanskrit is PD-US and quotable while Rai's English is not — a real and usable asymmetry. One look at Rai's
preface settles it, and no one has looked.

---

## 5. THE SHIPPING GATE

| | Condition | Status |
|---|---|---|
| **B-east2-1** | The Bhūtaḍāmara ↔ Goetia edge must not render as an asserted parallel. Refile as `NON_EDGE` or withhold. | **BLOCKING** (S1) |
| **B-east2-2** | `ASSERTED` polarity must be uniform across all three slices and the shipped graph before any merge. | **BLOCKING** (S2) |
| **B-east2-3** | Every slice must declare a total mapping from its edge vocabulary onto `TRANSMITS_TO / COMMENTS_ON / PARALLELS / NON_EDGE`. | required before merge (S4) |
| **B-east2-4** | The FRAMING §9.5 accusation-violence harm note must land on the corpus-level and bazaar-print rows. | required before render (S8) |
| **B-east2-5** | Un-traced hostile characterisations of living people (Frawley; Daniélou-via-Daniélou) must be traced or reduced. | required before render (S9, S10) |
| — | No quoted operative text ships this round. | **HELD.** All three slices state it; the razor scan confirms it; FRAMING §10 B1–B4 remain uncleared and are not touched by this round |

**Nothing in this round breaches the razor, and nothing in it reproduces operative instruction.** The
blockers are both about *what the graph will say when it renders*, not about what the files contain — which
is the right place for the danger to be, and the reason the brief put EVIDENCE at the top.

---

## 6. `40-nav-redesign.md` — read, and out of scope for four of the five strike categories

It is an engineering document: measurements, groupings, exact `NAV_GROUPS` code, migration risk, test
deltas. It carries **no domain claims** about the corpus, so it contributes nothing to the §4 count, and it
is clean on RAZOR, LICENSING, FABRICATION and LIVING-DISPUTE by construction. Three observations against
FRAMING, none of them a strike:

1. **The one FRAMING interface rule it could have broken, it doesn't.** FRAMING §5 C-5 forbids a "cast",
   "generate" or "perform" affordance *anywhere hostile material appears*, and §5 A-1 forbids a
   `purpose`/`act`/`aim` facet. The new `pages/grimoires/index.html` destination — the one this round's
   grimoire slice feeds — is filed under **Traditions** (item 45), alongside `pages/abhichara/index.html`,
   **not** under `Cast`. There is no purpose facet anywhere in the document. Correct on both counts, and
   deliberately so.
2. **The redesign moves ten items and does not touch the one destination FRAMING §10 B1 names.**
   `pages/picatrix/talisman.html` — "Talisman Workshop" — stays in `Cast`, unchanged (item 28). That is
   defensible for a nav document, but B1 (`talismanRecipe()` emitting a numbered imperative personalised
   protocol naming opium, in site voice, exposed as a callable returning `steps`) is still open, and the
   grimoires destination this round populates will ship into a bar that still advertises it two groups
   away.
3. **`Cast` as a top-level group label is an imperative verb, and item 29 reads "Cast a chart by hand."**
   Both are pre-existing shipped strings, not introduced here, and FRAMING §3.2 is explicit that the strip
   test *is* V1 ∧ V3 ∧ D4 ∧ V6 and that anything passing them is a style note rather than a violation — nav
   labels are not record fields. Logged as a style note only, and logged at all because a bar whose second
   group is an imperative sits oddly beside §3.1's headline claim that the site's own voice never
   instructs.
