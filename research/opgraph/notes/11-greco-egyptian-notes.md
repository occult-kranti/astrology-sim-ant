# Slice 11 — Greco-Egyptian & late-antique operative papyri and theurgy

**Companion to:** `11-greco-egyptian.json` (validated; 22 works, 8 authors, 6 cultures, 1 collection,
62 procedure rows, 121 typed edges of which 61 are CONTAINS_PROCEDURE).
**Round date:** 2026-07-17. **Repo access:** READ-ONLY. Nothing was written into the repo.

---

## 0. The one-paragraph version

This slice holds the richest surviving step-by-step ritual literature in the ancient
Mediterranean and — verified this round — **the repo records essentially none of it**. Of twenty
in-slice works, exactly one (Iamblichus' *De mysteriis*) is shipped, and it is shipped with zero
procedure typing and zero completeness grading. Three more (`pgm-corpus`, `chaldean-oracles`,
`sefer-ha-razim`) are admitted in the R29 plan and confirmed absent from shipped data. The
remaining sixteen — including the single longest magical handbook from antiquity, the principal
Demotic magical book, a 500–600-manuscript Coptic corpus, and two craft-recipe papyri with 265
recipes between them — have no repo existence of any kind.

The slice also turns out to carry the round's most useful **methodological** finding, which is not
about content at all: magical papyrology already operates a hard binary (**formulary vs applied
text**) that the completeness dimension half-reinvents, and it detects it by a **formal marker**
(the placeholder name) rather than by prose inference.

---

## 1. The structural deliverable: the anatomy of a recipe

The assignment asked for the praxis/logos distinction. What the sources actually support is
finer-grained: a PGM formulary entry is assembled from a small repeating set of **slots**.

| # | Slot | Notes |
|---|---|---|
| 1 | Title / claim of effect | The "for X" heading |
| 2 | Materia | Includes an *ousia*, a substance sympathetically linked to the target |
| 3 | Apparatus / support | Lamp, bowl, tablet, ring, papyrus strip, figurine |
| 4 | Action | What is done |
| 5 | Timing | Hour, lunar day, planetary day, sunrise/sunset |
| 6 | Place & purity condition | Often a multi-day abstinence regimen *preceding* the act |
| 7 | **Logos** | The fixed spoken/written formula |
| 8 | Dismissal / closing note | Frequently absent |

**Why this matters for grading.** *Slot-count filled* is the only objective completeness metric
this corpus supports, and it is the basis of most grades in the JSON. It also lets the razor be
obeyed cleanly: the graph records *which slots a text fills* and never *what fills them*.

**The praxis/logos boundary is physically marked in the manuscripts.** In the bilingual books the
division is functional and consistent — **Greek carries the ritual instructions, Egyptian
(Demotic, hieratic or Old Coptic) carries the invocations**. In PGM III this is even a *scribal
division of labour*: Scribe A wrote monolingual Greek, Scribe B added the bilingual material. In
GEMF 15 the principal bilingual scribe copied the Demotic himself and brought in three
Greek-trained assistants for the Greek. This is the strongest evidence available that ancient
compilers *themselves* distinguished "what is done" from "what is said" — it is not a modern
analytic imposition.

---

## 2. The completeness spectrum, worked

The slice happens to contain a clean example of every grade, which makes it a good calibration set
for the whole program.

- **complete** — PGM IV.5–51, the bilingual direct-vision recipe: fills every slot (purpose,
  multi-day purity precondition, compounded preparation with named applicator, lunar-day + sunrise
  timing, ground condition, sacrifice with disposal, immersion with departure condition, recited
  invocation). Nothing deferred to an initiator, nothing marked withheld.
- **complete (different basis)** — PGM VII's Homeromanteion. A sortilege table is *self-contained*:
  the table **is** the procedure. This is the only procedure in the slice gradable without any
  judgement about tacit knowledge.
- **complete (genre basis)** — Leiden X (111 recipes) and the Stockholm papyrus (154). Their
  missing logos slot is absent *by genre*, not by omission.
- **partial** — the Mithras Liturgy's breath-discipline: the technique is invoked as a component,
  never taught as a graded training.
- **referenced (with positive evidence)** — *De mysteriis*. It names, classifies and defends
  invocation, sacrifice, statue-animation, divination and possession across ten (editorial) books
  and sets out **none** of them. Discussed at book length, given nowhere.
- **fragmentary** — the Chaldean Oracles. ~300 fragments surviving only as quotations, *and* every
  ancient commentary lost.
- **split-grade in one shelfmark** — PDM xiv: a ruled, orderly 29-column recto (complete-tending)
  and a verso its own editors call "apparently discontinuous memoranda, prescriptions and short
  invocations" (fragmentary by construction). **The single best argument in this round for grading
  per-section, not per-work.**

---

## 3. Five findings I would put in front of the auditor first

**(1) The formulary / applied-text binary is prior art for the completeness dimension — from a
neighbouring discipline, with a machine-detectable marker.** A *formulary* is a handbook of
recipes and marks its target with a placeholder ("NN son/daughter of NN"). An *applied text* is
the object actually produced and carries a real name ("Jacob son of Euphemia"), often folded for
wearing or deposit. Kyprianos counts, as reported by the Würzburg project: **181 definite
formularies, 187 definite applied texts, 132 unclear**, plus 45 uncertain formularies and 99
uncertain applied. Two consequences: applied texts are procedure **outputs**, not procedure-bearing
works, and grading them is a category error the schema must prevent; and the placeholder is a
*formal* completeness signal far better than prose inference. The same project also notes
practitioners **adapted** formularies rather than executing them — so even a "complete" recipe was
not a closed algorithm to its own users.

**(2) "PGM" is a modern editorial construct and the numerals are not work-identities.** Preisendanz's
Roman numerals are shelf-order. They **split one book** (PGM II + PGM VI argued to be one
manuscript by one hand) and **bundle multiple recensions** (PGM XIII holds two — or three — versions
of the Eighth Book of Moses). Meanwhile GEMF is actively renumbering the entire corpus. Any node
must carry both identifiers or become uncitable within a decade. *Verified concordances this round
(and only these): GEMF 15 = PGM/PDM XII, GEMF 16 = PGM/PDM XIV, GEMF 30 = PGM II, GEMF 31 = PGM I,
GEMF 55 = PGM III, GEMF 57 = PGM IV.* The rest must not be guessed.

**(3) PD discipline: two corrections and two windfalls.**
- **Correction A.** The R29 plan's "Greek PD (Preisendanz 1928)" is **too coarse**. Preisendanz
  Bd. 1 (1928) is US-PD; **Bd. 2 (1931) is not PD in the US until 1 Jan 2027**. Split by volume.
  The same split applies to Kropp's Coptic edition (1930 vol. PD now, 1931 vol. not until 2027).
- **Correction B.** GEMF vol. 1 is **open access but in copyright**. Open access ≠ PD. Linkable and
  citable, not quotable at length.
- **Windfall A.** **Griffith & Thompson, *The Demotic Magical Papyrus of London and Leiden*
  (1904–09), is fully PD** with complete scans. The principal *Demotic* magical book has a
  quotable scholarly edition while the Greek corpus's standard English (Betz 1986/92) is locked.
  **The repo has a fully-PD path into Greco-Egyptian ritual through the Demotic side that it does
  not have through the Greek side.** This is the most actionable finding in the slice.
- **Windfall B.** Caley's English translations of Leiden X (1926) and the Stockholm papyrus (1927)
  are US-PD. Bidez's Greek text of Proclus' hieratic treatise (CMAG VI, 1928) is US-PD.

**(4) The `pgm-corpus → lemegeton` edge in the R29 plan is wrong in both endpoints.** The verified
chain is **PGM V.96–172** ("Stele of Jeu the Hieroglyphist", originally an *exorcism*) → **C. W.
Goodwin, "Fragment of a Graeco-Egyptian Work Upon Magic", Cambridge Antiquarian Society, 1852**
(PD) → Mathers/GD (1887–1903) → **Crowley's "Preliminary Invocation" prefixed to his 1904 *Book of
the Goetia*** → *Liber Samekh* (1929/30). The source is a **segment**, not the corpus; and the
target is **Crowley's 1904 addition to his edition**, not the Lemegeton text. Fix before shipping.

**(5) Two works that are procedure-central and procedure-empty need a node role the schema lacks.**
*De mysteriis* and Proclus' *On the Hieratic Art* discuss, classify and justify ritual at length
and contain no executable sequence; Porphyry's *Letter to Anebo* is entirely *about* rites and is
itself only fragments. Without a "meta-procedural" role the graph either falsely credits them with
procedures or falsely records them as procedure-free. Proclus is the sharper case: his
*sunthēmata*/*sympatheia* doctrine is precisely the **theory of the papyri's materia slot** — an
illuminating juxtaposition that is **doctrinal correspondence, not transmission** (the papyri
mostly predate him and nothing shows either read the other). The JSON flags it accordingly.

---

## 4. Contested blocks (≥2 positions, none resolved)

| Question | Positions | Where |
|---|---|---|
| Is PGM IV.475–829 Mithraic? | **Four**: Dieterich 1903 (yes, named it so); Cumont (no — lacks Mithraic eschatology and the seven-sphere passage); Betz (a Greek/Egyptian/Mithraic intersection, ascent = early Hermeticism); Meyer (genuine Mithraic connections). The R29 plan anticipated only two. | `gem:pgm-iv-475-829.titleDispute` |
| How many recensions in PGM XIII? | Morton Smith: **three**. Klutz 2011, reviving pre-Smith scholarship: **two**. Consequence: *the number of procedure-instances in the work is itself contested.* | `gem:pgm-xiii.recensionDispute` |
| Was there a "Theban Magical Library"? | Traditional single-find model vs **Dosoo 2016** (BASP 53, 251–274): ten papyri probably associable, **nine excluded** that others have assigned to it. All 7 FOUND_WITH edges carry `contested:true`. | `coll:theban-magical-library` |
| Are Leiden X / Stockholm "alchemy"? | Artisanal craft chemistry with no transmutational theory (the "alchemy" label goes back to Berthelot's 1888 title) vs continuous with the Greco-Egyptian alchemical tradition and its Theban milieu. | `gem:p-leid-x.genreDispute` |
| Date of Sefer ha-Razim | Margalioth: late 3rd / early 4th c. vs later redaction (R29 plan already both-ways). Compounding problem noted: **a reconstructed text cannot be dated independently of the reconstruction.** | `gem:sefer-ha-razim.dateDispute` |
| Date of PGM VII | 3rd c. vs 4th c. CE. | `gem:pgm-vii.dateClaim` |
| Line range of the *philtrokatadesmos* | 296–434 (Faraone's title) vs 296–466 (common citation). An editorial fact worth recording. | `gem:pgm-iv-296-466.scholarship` |

Plus two **editorial impositions** on *De mysteriis*, only one of which the repo currently states:
the **title** is Ficino's (the work is the *Reply to Porphyry's Letter to Anebo*) — new this round;
the **ten-book division** is Scutelli's, 1556 Rome ed., undone only by Saffrey–Segonds 2013 —
already in `greatworks.js`. They belong side by side.

---

## 5. Harm taxonomy (the repo has none; this slice needs four kinds)

Per-procedure hazard kinds, following the abhicāra-wing precedent (map the variables exhaustively,
never assemble them):

- **coercion** — erotic-compulsion and binding rites (PGM IV.296–466, PGM III, PDM xiv, Sefer
  ha-Razim, Coptic curse tablets). The *agōgē* is by definition aimed at a named non-consenting
  person. `gem:pgm-iv-296-466` is the slice's highest-sensitivity record: it is graded **complete**
  *and* it is the one record where completeness and harm coincide — which is exactly why the grade
  is recorded and the content is not. It should never be surfaced as an artefact of "romance".
- **animal-killing** — bird sacrifice and blood use in PGM recipes; Iamblichus Bks IV–VII is an
  extended *defence* of animal sacrifice.
- **hypoxia / breath-holding** — the Mithras Liturgy's breath manipulation aimed at an altered state.
- **toxic-substance** — Leiden X / Stockholm work with mercury, arsenic sulphides and lead
  compounds (hazardous by inhalation as well as ingestion); PDM xiv's editors list **poisons**
  among the recto's four content categories; the Cyranides is a magico-medical compilation. The
  repo's `RASA_TOXICITY` and Picatrix Book IV precedents apply directly.

An **ethics/framing** note, not a harm note: the Coptic corpus is a corpus of **Christian** ritual
texts (3rd–12th c.) and partly fills the repo's flagged "no Christian ritual beyond contemplative
prayer" gap. It should be presented as ordinary late-antique religious practice, in the Würzburg
project's own register ("texts of ritual power"), not as "magic" pejoratively.

---

## 6. Controlled-vocabulary gaps — 15 distinct

The controlled list was built from an Indic-and-contemplative baseline and this corpus breaks it in
fifteen places. Full rationale in `procedureVocabulary.vocabGaps`; the load-bearing ones:

1. **spoken-formula-recitation** — the corpus's core act is reciting a *logos* of voces
   magicae / divine-name chains / vowel sequences. `mantra-recitation` imports the wrong tradition;
   `invocation/evocation` loses the fact that the formula is a **fixed text copied verbatim in the
   handbook**. This single gap affects 20+ rows.
2. **animal sacrifice / blood offering** — `offering/homa` is a Vedic fire-oblation term. Forcing
   the PGM's bird sacrifice into it erases both the act and the ethical register.
3. **ascent / anagogic liturgy** — a graded seven-stage ascent with named gates is not
   "visualization" plus "invocation".
4. **glossolalic / phonetic vocalization** — hissing and popping sounds; no type covers non-lexical
   sound-production.
5. **binding/curse inscription (defixio)** and **figurine/effigy fabrication (kolossos)** —
   `coercive-rite` names the intent, not the two media.
6. **lecanomancy / lychnomancy / scrying** — confirms the inventory agent's flagged gap; collapsing
   into `divination-procedure` loses the apparatus.
7. **sortilege by canonical text** — the Homeromanteion; structurally the Sortes/bibliomancy family.
8. **sympathetic-materia selection (*ousia*)** — the theoretical heart of both the Cyranides
   (letter → plant/bird/fish/stone tetrad) and Proclus' *sunthēmata*.
9. **craft recipe (metallurgical/dyeing/gem-imitation)** — not `alchemical-operation`; the boundary
   is itself the scholarly question.
10. **apologetic / theoretical treatise ON procedure** — the meta-procedural role (§3.5).

Also flagged: **dream-incubation**, **ritual-abstinence regimen (*agneia*)**, **amulet inscription
& wearing (phylactery)**, **charaktēres drawing** (typed `yantra-construction` *faute de mieux*;
no Indic diagrammatic geometry involved — and deliberately not reproduced anywhere in the JSON),
and a cross-slice observation that the Cyranides' letter→substance rule is the same **formal**
move as the letter-permutation family (Abulafia, Sefer Yetzirah, kamea) that the inventory agent
already flagged — recorded as a `PARALLELS` edge with **confidence: LOW** and an explicit "not a
transmission claim" flag, for the synthesizer to downgrade or drop.

---

## 7. Schema proposals (six)

1. **`SEGMENT_OF`** (work-segment → work). The line-range segment is the **native citation unit of
   this entire corpus**; without it, PGM IV.475–829 and IV.296–466 either vanish or falsely become
   works.
2. **`FOUND_WITH`** + a `collection` node kind. Archival co-provenance is a first-class, contested,
   citable fact here and fits none of the six given edge types.
3. A **`meta-procedural` node role** (§3.5).
4. An **`outputArtefact`** node kind or an explicit exclusion rule for applied texts (§3.1).
5. A **`completenessBasis`** enum on every CONTAINS_PROCEDURE edge —
   `{slot-inventory, comparative-recension, self-contained-table, editorial-statement, genre-norm}`.
   Every grade in this file rests on one of those five and **they are not equally strong**;
   recording the basis is what stops the grade being an opinion.
6. **Ruling on the inventory agent's open question:** procedures should hang off **works and
   work-segments only**. This slice supplies the decisive case — Preisendanz's numbering both
   splits one book and bundles multiple recensions, so "work" must mean a **codicological unit with
   a shelfmark**, not a corpus numeral.

---

## 8. Join keys

- **Already shipped — extend, do not duplicate:** `greatworks.js` author id `iamblichus` →
  `au:iamblichus`; work id `de-mysteriis` → `theu:de-mysteriis`. (Work-level coverage is complete
  there — edition, PD status, Scutelli flag, four chapter-groups, site mappings — and
  procedure-level coverage is **absent**. It is the cleanest illustration of the inventory agent's
  "untyped and ungraded" finding.)
- **Planned, not shipped — inherit the verdicts:** `pgm-corpus`, `chaldean-oracles`,
  `sefer-ha-razim`.
- **De-duplication warnings:** *PGM XIV and PDM xiv are the same manuscript* under two of
  Preisendanz's own sequences — an exact analogue of the repo's existing
  Mantramahodadhi/"Mantra Mahodadhi" duplication. Likewise PGM XII / PDM XII (P.Leid. J 384). And
  **"purification" in the alchemical papyri means metal refining, not ritual purity** — a
  synthesizer keying on the type name will merge two unrelated things.
- **Downstream tool impact:** R29 tool **T24** (Chaldean Oracles fragment browser, scheduled R33)
  is built on Westcott 1895. Westcott's arrangement and numbering **do not correspond to the des
  Places numbering that all modern scholarship uses**. T24 must ship a numbering-concordance
  warning or it will silently mis-cite. The plan already flags Westcott's *redaction*; this is a
  second, separate defect.

---

## 9. What I did not do (limits on every grade above)

- **No lacuna audit.** Grades rest on genre norms, editors' own statements and slot inventories —
  never on line-by-line damage assessment, which would require the editions.
- **No recipe itemisation** for PGM I, II, III, V, XII, XIII. Counted from sources this round only:
  PGM VII (67 ritual instructions), PGM IV (>50 sections, 3,274 lines, 66 inscribed pages),
  P.Leid. X (111 recipes), P.Holm. (154 recipes), Sefer ha-Razim (c. 30 counsels, 700+ angel names),
  PDM xiv (29 ruled recto columns), PGM XIII (1,078 lines).
- **No in-copyright edition consulted.** Nothing here comes from Betz, GEMF, Majercik, Morgan,
  Halleux, Kaimakis, Clarke–Dillon–Hershbell or Saffrey–Segonds. Every figure traces to an
  encyclopaedic, publisher, project or review source consulted this round, or to the repo's
  inherited verdicts. Items I could not re-derive are marked **(unverified)** inline.
- **Out of slice, deliberately untouched:** Testament of Solomon, the Greek *Hygromanteia*, the
  Sword of Moses, Hekhalot literature, and everything Solomonic/Thelemic downstream of the 1852
  Goodwin publication.

---

## 10. Razor compliance statement

This file and its JSON name procedure **types**, count recipes, grade **completeness**, and
inventory structural **slots**. They contain: no voces magicae or divine-name strings; no formula
text in any language; no charaktēres or drawable signs; no quantities, proportions or temperatures;
no substance lists for the toxic material; no ordered executable sequences; and no second-person
address. Where sources supplied operational detail — materia identities, effigy treatment, dye
chemistry — it was abstracted to slot-level description. Efficacy is asserted nowhere: the Mithras
Liturgy **claims** *apathanatismos*, the Oracles **claim** revelation in trance, Sefer ha-Razim
**claims** descent from Raziel through Noah to Solomon. All three are recorded as the traditions'
own claims about themselves.
