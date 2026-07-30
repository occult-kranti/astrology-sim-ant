# 20 — HOSTILE AUDIT of the operative-content graph slices (R33)

**Auditor role:** single hostile auditor with strike authority (operator's Rule 3).
**Date:** 2026-07-30. **Posture:** adversarial by construction. Nothing below is accepted because a
slice author asserted it; every strike names the evidence that voids the record, and every
correction was applied **in place** in the slice files.

**Scope audited**

| file | works | procedure rows | edges |
|---|---:|---:|---:|
| `10-indian-tantra.json` | 19 | 90 | 138 |
| `11-greco-egyptian.json` | 22 | 62 | 121 |
| `12-solomonic-western.json` | 24 | 62 | 68 |
| `13-east-asian.json` | 17 | 49 | 36 |
| `14-abrahamic-esoteric.json` | 23 | 43 | 96 |
| **research total** | **105** | **306** | **459** |
| `01-repo-closed-corpus.json` (prior art, read not struck) | 127 | 179 | 472 |

Plus all six companion notes and `00-frame-karpathy-and-v2.md`. **870 research records examined.**
**18 cited works/editions spot-checked against live sources** (rule 4 required ≥12).

---

## VERDICT IN ONE PARAGRAPH

The round is **not thin**. It produces roughly **48 surviving domain claims** — substantive,
sourced statements about the operative corpus, not about the site — and several of them are of a
quality the repo has not previously reached (the Ullrey meta-ritual finding; the
formulary/applied-text formal marker; the work-vs-PD-witness completeness split). Razor discipline
is, with one exception, genuinely good: I ran pattern scans for mantra syllables, voces magicae,
divine-name strings, second-person imperatives and executable quantities across all five files and
the only true positives were false matches on transliterated Chinese. **But the round is not clean.**
It contains one fabricated composite citation propagated to eight sites on the slice's own
flagship edge; one razor slip that reproduces an executable timing on a harm-flagged fast, in a
record whose own compliance sentence denies doing so; one transmission edge whose endpoints reverse
chronology while carrying a prose note admitting it; two `complete` grades asserted about texts
nobody opened; a public-domain claim that is right about a page and wrong about the half of the
page it was used for; and two edges that re-derive shipped atlas data with no operative content.
**Eight strikes issued. Six edges voided, two grades voided, four citations corrected, one licensing
claim narrowed, two razor reproductions removed.** Eight blockers stand between this material and
anything shipping.

---

## STRIKES

### R1 — RAZOR STRIKE · `14-abrahamic-esoteric.json` · **the round's only razor failure**

**Struck:** the Hekhalot/Sar-Torah preparatory-regimen records reproduce executable operative
detail, and do so in a record that simultaneously claims not to.

The graded row at `jew:hekhalot-rabbati` / `purification` enumerated the regimen as
"…entry into a closed room for a fixed multi-day period without egress; **a single evening meal**;
restriction of both food and drink to named permitted classes…" and then asserted, in the same
sentence, "the durations, permitted foods, immersion counts and the adjuration formulae are
deliberately NOT reproduced." The meal pattern **is** the dietary timing. Worse, the sibling row at
`jew:sar-ha-torah` was titled "**the twelve-day enclosure regimen**", and the vocabulary-gap entry
repeated "the Sar-Torah's twelve-day enclosure" — so the duration the graded row swore it withheld
was published twice elsewhere in the same file.

This matters more than a pedantic reading suggests, because the record's own `harmNote` says
"a multi-day enclosed fast with restricted fluid intake is capable of real physical harm." Duration
plus meal frequency plus restriction classes is the operative core of an ascetic regimen. The razor
forbids "executable ingredient quantities/timings"; this was one.

**Fixed in place.** Rewritten to stage-KINDS only (ablution stage / enclosure stage of stated but
unreproduced duration / dietary-restriction stage / purity-avoidance condition), duration and meal
pattern removed at all three sites, with an `AUDIT-CORRECTED (R1)` marker naming what was removed
and why. The completeness grade (`complete`) is untouched and remains justified — the slice's own
rule is right: *the text enumerates and terminates* is a structural fact that needs no content.

**Everything else passed the razor.** Named for the record, because a hostile auditor who finds
nothing has not looked: slice 11's PGM IV.5–51 slot inventory (purity precondition → compounded
preparation → lunar-day/sunrise timing → ground condition → sacrifice with disposal → immersion →
recited invocation) is the most nearly-usable passage in the round and it is **within** the razor —
it names slots and never fills them. Slice 12's `solomonic-six-stage` anatomy carries the correct
`useNote` and explicitly refuses the circle template and the Almadel measurements. Slice 14's golem
four-stage shape and the Birhatiya bare-naming are exactly the right calibration, and its rule —
*"naming a stage is safe; ordering the sub-steps is not"* — is the best formulation of the razor
produced this round and should be lifted into the schema.

### E1 — EVIDENCE STRIKE · five PARALLELS edges that are resemblance, not dependency

This corpus attracts pan-diffusionist fantasy. A `PARALLELS` edge needs a citation, not a vibe.
Each of these five was flagged as weak *by its own author* — which is honest, and is also exactly
why they must be voided rather than left as edges: a synthesizer reads endpoints, not caveats, and
a flagged edge one round becomes an unflagged edge two rounds later.

| edge | file | why struck |
|---|---|---|
| `gem:cyranides → atlas:sefer-yetzirah` | 11 | basis field reads "structural observation made this round", confidence LOW. A 4th-c. Greek magico-medical compilation and a Hebrew cosmological treatise joined because both index the world by alphabet. |
| `tan:kausikasutra → tan:parasuramakalpasutra` | 10 | cite ends "inference labelled"; evidence says it is "NOT a claim found in a source". Joins a Vedic Atharvan ritual sūtra to a 16th/17th-c. Śrīvidyā digest on the shared property *is a sūtra*. |
| `E-PAR-01 gw:ars-almadel → null` | 12 | evidence ends "I could NOT confirm the etymology from a scholarly-tier source this round"; **and `to` is null** — this is a note with an arrow drawn on it, and it will crash or phantom-node a synthesizer. |
| `isl:ihya-38-muraqaba → external:guigo-ii-scala-claustralium` | 14 | cite reads "structural comparison only; no contact evidence sought or found". |
| `jew:hekhalot-rabbati → jew:sefer-ha-malbush` | 14 | cite reads "(unverified) — flagged", and points at the slice's self-declared weakest node. |

**Fixed in place:** all five now carry `ASSERTED: false` + `VOIDED_BY_AUDIT` with the reason and the
named condition for re-assertion. **The observations are retained as notes** — the Ghazālī/Guigo one
in particular is a genuinely valuable cross-tradition test of the completeness criterion and should
survive as prose. What must not survive is the arrow.

**Partial strike, same rule:** `jew:hekhalot-rabbati → external:pgm-greek-magical-papyri` was
labelled `documented` while its cite says the witness (Bohak 2008) was "NOT consulted this round;
(unverified)". A `documented` label asserts a witness was read. **Label downgraded to `disputed`**;
the edge survives because slice 11 independently records the same kinship from its own side with a
real citation (Margalioth/Morgan on Sefer ha-Razim's Greek terminology and closing Helios prayer).

**Not struck, and named so the exercise is legible as discrimination rather than reflex:** the four
other slice-10 parallels are scholar-asserted (Bühnemann's three-text ṣaṭkarman parallel, Türstig
independently, Ullrey's Varanasi/Bengal/Kerala grouping); slice 11's `pgm-pdm-xii ↔ pdm-xiv` rests
on published scribal-hand identification (*Symbolae Osloenses* 98.1, 2025 — verified this round) and
is Mallinson-grade; slice 13's `huangting-jing ↔ dadong-zhenjing` rests on Robinet. Those stand.

### E2 — EVIDENCE STRIKE · `13-east-asian.json` · a transmission edge that reverses chronology

`baopuzi → ea:taiqing-corpus-cited-in-baopuzi`, type `TRANSMITS_TO`, carrying a field reading
`"direction": "REVERSED — the Taiqing scriptures are Ge Hong's SOURCE, not his dependents"`.

Under the repo's own edge semantics (`from` = the earlier work / source of the act; `to` = where it
landed — `confluence.js` header), this arrow points from a c.317–330 text to its own 3rd-century
sources. **A prose disclaimer does not fix a wrongly-directed arrow.** Rule 2 names this exactly.

**Fixed in place:** endpoints flipped to `ea:taiqing-corpus-cited-in-baopuzi → baopuzi`. The real
relation the author was trying to preserve — that Pregadio reconstructs the Taiqing corpus *through*
the Baopuzi — is a dependency of **modern scholarship on a later witness**, not a transmission, and
is now recorded in a separate `witnessRelation` field where it cannot corrupt the graph's direction
semantics. This distinction is worth generalising: *philological dependency* and *historical
transmission* run in opposite directions and the schema currently has one arrow for both.

### E3 — EVIDENCE STRIKE · `12-solomonic-western.json` · two `complete` grades with no evidence

`complete` is the strongest claim this schema makes. Two rows made it without opening the book.

- **`gw:grand-grimoire` / `oath-pact-binding`, graded `complete`** — evidence field, verbatim:
  "Graded complete on the basis that the printed text is a finished, self-contained working document
  — **NOT on any inspection of its contents**, which this graph deliberately does not perform."
  The refusal to inspect is *correct* (this is the corpus's ethical outer edge and the r29 ruling
  holds). The grade is not. **Voided to `null` + `gradeWithheld`.** Withholding costs nothing;
  asserting "complete" about a book nobody opened would have been the round's most quotable error.
- **`gw:clm-849` / `invocation/evocation`, graded `complete`** — derived by syllogism from the text's
  *role*: "a text cannot supply a reorganisable operative skeleton unless it has one." The row
  already carried `evidenceStrength: low, unverified: true`. **Voided to `null`**; its inferred
  five-stage `anatomyStages` list is now marked `anatomyStagesInferred: true`. Kieckhefer,
  *Forbidden Rites* (1997) settles it in one pass and is named as the blocker.

**Consequence to carry downstream:** slice 12's completeness distribution is now
**complete 24 · partial 24 · referenced 10 · fragmentary 2 · UNGRADED 2** (was complete 26). Any
count that quotes 26 is quoting a pre-audit number.

Not struck, but on the record: slice 12's `gw:pseudo-agrippa-fourth-book` `complete` grade is
genre-inferred and carries `unverified: "stage-by-stage confirmation not performed"`. It survives
because the Fourth Book's *function* as the practical supplement is itself well attested (Weyer's
1563 denunciation presupposes it). It must not harden into fact by restatement.

### L1 — LICENSING STRIKE · `12-solomonic-western.json` · the Peterson CC-BY claim is right about the page and wrong about the half that was used

Slice 12 recorded, as a finding of the round: *"Peterson's Grimorium Verum page is CC-BY 4.0, not
all-rights-reserved"*, and proposed adopting Peterson's disclaimer wording "as the repo's precedent."

**Re-fetched `esotericarchives.com/solomon/gv.htm`, 2026-07-30.** The page carries **two** notices:

- `License CC-BY 4.0` — governing the grimoire **text**;
- `Introduction copyright Joseph H. Peterson, 1999; all rights reserved.` — governing the
  **editorial introduction**.

Every structural fact slice 12 draws from S5 — Wellcome MS 983 and MS 4667, the Alibeck c.1817 first
print, the Blocquel/Bestetti/Muzzi print history, the three-part structure, the Key-of-Solomon and
Heptameron dependencies — comes from the **introduction**, i.e. from the all-rights-reserved half.
And the disclaimer sentence proposed for adoption is introduction text too.

The irony is sharp and worth stating on the wing page: **the CC-BY exception covers precisely the
operative text this program does not want, and not the scholarship it does.**

**Fixed in place:** S5's `rights` field rewritten to state both notices, to rule cite-not-quote for
all S5-derived structural facts (same treatment as S1–S4), and to record that the repo must write
its own disclaimer rather than reuse Peterson's.

**Checked and clean** on the brief's named licensing traps: Betz 1986 is nowhere claimed PD (slice 11
states outright that no in-copyright edition was consulted); Ware 1966 is marked CITE-ONLY with
Kroll's criticism attached; Peterson's other four pages are correctly marked editorial-copyright;
Kaplan's *Sefer Yetzirah* appears nowhere; no post-1930 Arabic/Persian translation is claimed PD
(Harris 1981 and the ITS 2015 Ghazālī are both correctly in-copyright). Slice 11's PD arithmetic is
**correct and is an improvement on the r29 plan**: Preisendanz Bd.1 (1928) US-PD, Bd.2 (1931) not
until 1 Jan 2027 (1931 + 95), same split for Kropp; GEMF vol.1 open-access-but-in-copyright. Slice
10's is correct too, including the trap it names: the standard Śāradātilaka edition (*Tantrik Texts*
XVI–XVII, **1933**) is not US-PD until 2029 while the older Prapañcasāra (III, 1914) is — a round
that assumes "Avalon = public domain" gets this wrong.

### F1 — FABRICATION STRIKE · `14-abrahamic-esoteric.json` · a composite citation on the slice's flagship edge — **and a blocker**

Cited eight times across the file, including in the `contested` block, the `editions` array, and the
`cite` fields of the two edges the slice calls "the highest-value join in my slice":

> Bink Hallum, 'The Earliest Arabic Magic Squares', *Suhayl* 18 (2020-21), 7-24 (WRAP/Warwick
> open-access copy)

**This is a composite of two different works by two different authors.** Verified against
raco.cat, Dialnet (record 7689032) and wrap.warwick.ac.uk:

- **Cristian TOLSA**, "The earliest Arabic magic squares", *Suhayl* 18 (2020–21), **7–24** — open
  access at raco.cat. Its abstract treats *exactly* al-Ṭabarī, Jābir ibn Ḥayyān, the *Ghāyat
  al-Ḥakīm* and the Brethren of Purity — i.e. **this is the article whose content was used**.
- **B. C. HALLUM**, "New light on early Arabic Awfāq literature", in Leoni/Melvin-Koushki/Saif/Yahya
  (edd.), *Islamicate Occult Sciences in Theory and Practice* (Brill, 2020), **57–161** — **this** is
  the work with the WRAP/Warwick open-access copy.

The author name and the repository detail belong to Hallum's Brill chapter; the title, journal,
volume, page range and content belong to Tolsa's article. Neither citation as written exists.

This is the worst finding in the round, for three reasons. It is **load-bearing**: it carries the
"HONEST LIMIT" on the awfāq → Ghāya → Agrippa → `kameas.js` chain, the one join that would give the
repo's shipped planetary squares an upstream. It is **self-propagating**: eight occurrences, in the
fields a synthesizer harvests. And it is **exactly the shape** a downstream model reproduces without
checking, because it names a real scholar who really works on this exact subject.

**Fixed in place** at all eight sites: reattributed to Tolsa, Hallum's actual chapter added as a
separate correct record with its own rights note, and the derived claim — *that the astrological
attribution of squares to planets emerged later within the Islamic tradition* — marked
**`UNVERIFIED-DO-NOT-QUOTE`** at every site, because it could not be confirmed at page level in
either author's text this round. The transmission claim itself survives (the *Ghāya* as the channel
by which the seven-square set reached Latin Europe is independently attested); the dating nuance
does not.

### D1 — DUPLICATION STRIKE · `13-east-asian.json` · two edges that re-derive shipped atlas data

`event-shangqing-revelations → zhengao` (confluence.js ~5745) and
`event-shangqing-revelations → huangting-jing` (confluence.js ~5732). Both are re-derivations of
already-shipped atlas edges. Neither adds a procedure type, a completeness grade, or a
procedure-level propagation claim — and the second's only substantive content (the Inner/Outer
priority caveat) is itself lifted from the repo's own existing note. The charter is explicit that
the operative graph "must not restate" the atlas's transmission claims, and blacklist item 12 puts
the atlas out of bounds for re-derivation.

**Fixed in place:** both `ASSERTED: false` + `crossReferenceOnly: true`, so the join key survives and
the second arrow does not.

**Deliberately not struck, and the contrast is the point:** `cantong-qi → wuzhen-pian` is *also*
already shipped, and it **survives** — because it names the borrowed thing (the fire-phase timing
schema, i.e. procedural grammar) and thereby upgrades a work-level influence claim to a
procedure-propagation claim on the Mallinson exemplar's standard. That is the line: re-touching a
shipped edge is legitimate if and only if it changes what the edge *claims*.

Slice 14's `picatrix` rows sit just on the right side of the same line. Two of its three procedure
rows restate what `picatrix-prayers.js` and the Picatrix wing already carry, and they say so; they
survive because the completeness grade is a dimension the repo has zero prior art for. They are the
weakest survivors in the file and should be the first thing a synthesizer drops if space is tight.

### E4 — EVIDENCE STRIKE (structural) · contested blocks with no named position-holder

The repo's standard is `contested.positions[]` each with its own cited source, engine-test-enforced.
Two blocks meet it formally and fail it substantively:

- `ea:meihua-yishu` — the sceptical position against the Shao Yong attribution is held by "Popular
  reprints and the tradition". The slice author states plainly: "I could not source the sceptical
  position to a named scholar this round."
- `isl:naqshbandi-kalimat-qudsiyya` — the counter-position is "The critical-historical reading",
  unattributed. The slice author flags it: "A contested block with an unnamed position is weaker
  than the repo's standard and must be fixed or dropped."

Both authors called this on themselves; the auditor's job is to make it binding. **Not rewritten in
place** — there is no correct text to write, only a source to find. Both are **blockers** below.
(`cantong-qi`'s "traditional neidan lineage reading" is *not* struck: there the unnamed tradition
genuinely *is* the position-holder, which is a different thing.)

---

## CORRECTIONS APPLIED IN PLACE (non-strike)

Four citation errors found during the fabrication spot-check and fixed at source:

1. **`12` — Reeds 1998 page range.** Given as *Cryptologia* 22:4 (1998), **291–317**. Actual:
   **291–313** (Taylor & Francis / ACM, doi 10.1080/0161-119891886948).
2. **`11` — Klutz 2011 journal.** Given as **JSNT**. Actual: **Journal for the Study of the
   Pseudepigrapha** 21.2 (2011), 133–159. The doi prefix `0951820` in the slice's own URL is JSP's,
   not JSNT's — the error was self-detectable.
3. **`10` — Bühnemann's Śāradātilaka ch.25 edition, an `(unverified)` now closed.** Verified as
   *Bulletin of the School of Oriental and African Studies* **74.2 (June 2011), 205–235**
   (doi S0041977X11000036). The citation flag is cleared; the slice's *separate* open question —
   whether ch.25's yoga sequence is internally step-complete — is **not** resolved and stays open.
4. **`13` — Yixue qimeng date.** The file dated it "1186–1188 (conventionally dated 1188)" and then
   used **1188** in two other places. Adler — the translator the slice relies on — dates it **1186**.
   1188 is unsupported by the source consulted; corrected with the reasoning inline.

**JSON validity re-verified after every edit: all six files parse.**

---

## SPOT-CHECK LEDGER (rule 4: ≥12 required; 18 performed)

| # | citation as given | verdict |
|---|---|---|
| 1 | Ullrey, *Grim Grimoires*, PhD diss. UCSB 2016, eScholarship qt4vt6f325 | ✅ exact |
| 2 | Kavaleuskaya, 'Extraction of Mantras', *Etnografia* 4(10) 2020, 59–79 | ✅ exact |
| 3 | Dosoo 2016, 'A History of the Theban Magical Library', BASP 53, 251–274 | ✅ exact |
| 4 | Rebiger, *Sefer Shimmush Tehillim*, TSAJ 137, Mohr Siebeck 2010, ISBN 978-3-16-149774-2 | ✅ exact |
| 5 | Hedegård, *Liber Iuratus Honorii*, Studia Latina Stockholmiensia 48, 2002 | ✅ exact |
| 6 | Véronèse, *L'Ars notoria au Moyen Âge*, SISMEL 2007, >50 MSS | ✅ exact |
| 7 | Greenup, *The Almadel of Solomon* … Sloane MS 2731, ex *Occult Review* | ✅ exact (Occult Review 22.2, Aug 1915) |
| 8 | *Symbolae Osloenses* 98.1 (2025), 'Bilingual Scribes…' GEMF 15/16 | ✅ exact, open access |
| 9 | Caley, Leyden Papyrus X (1926) & Stockholm Papyrus (1927), *J. Chem. Educ.* | ✅ exact |
| 10 | Dosoo & Preininger, *Papyri Copticae Magicae* I, De Gruyter 2023, ISBN 9783111079790 | ✅ exact |
| 11 | Adler, *Introduction to the Study of the Classic of Change*, Global Scholarly 2002 | ✅ exact |
| 12 | DZ 508 = *Wushang huanglu dazhai lichengyi*, Jiang Shuyu, on Du Guangting / Liu Yongguang | ✅ exact |
| 13 | Griffith & Thompson 1904–09, *Demotic Magical Papyrus of London and Leiden* | ✅ exact, PD, scans confirmed |
| 14 | LoC 11031418 — Turner 1655 six-work composite | ✅ exact |
| 15 | Peterson: Goetia ← Scot **1665** by inherited unique errors/spellings | ✅ verified against the source page |
| 16 | Bühnemann, BSOAS ch.25 edition | ⚠️ **volume/year were `(unverified)`** → resolved, see Corrections 3 |
| 17 | Reeds, *Cryptologia* 22:4 (1998) | ⚠️ **page range wrong** → corrected |
| 18 | Klutz 2011 | ⚠️ **journal wrong** → corrected |
| 19 | **Hallum, 'The Earliest Arabic Magic Squares', Suhayl 18** | ❌ **FABRICATED COMPOSITE** → strike F1 |

**One invented citation in nineteen.** That is a real defect rate on the round's most consequential
edge, and it is why rule 4 exists.

---

## WHAT SURVIVED, AND WHY I AM NOT STRIKING IT

A hostile auditor who only subtracts is as useless as a panel that only agrees. The following are
the strongest records in the round and I could not break them:

- **Slice 10's Ullrey finding.** Mantramahodadhi 25, Śāradātilaka 23.121–45 and Prapañcasāra
  446–452 contain **no discrete rites** — they are meta-ritual parameter tables. Supported by four
  verbatim quotations at named pages from a full-text source the agent actually downloaded and
  converted. This *vindicates* the repo's abhicāra wing: its refusal to assemble the nineteen
  variables is not editorial restraint but fidelity, because **the source chapter has nothing to
  assemble**. A later round must not "complete" it.
- **Slice 10's third completeness axis.** Pandit's preface to the standard English Kulārṇava admits
  that "portions relating to rituals, technicalities of special types of japa, etc. have been kept
  out". The most-read English witness to an already-withholding text is *itself* avowedly redacted.
  Anyone grading the Kulārṇava from Pandit is grading Pandit. `witnessCompleteness` is a real and
  necessary third axis and this is the proof.
- **Slice 11's formulary/applied-text binary.** A neighbouring discipline already operates the
  completeness distinction and detects it by a **formal marker** (the "NN son/daughter of NN"
  placeholder) rather than by prose inference. Applied texts are procedure *outputs* and grading
  them is a category error the schema should forbid.
- **Slice 11's PD windfall.** Griffith & Thompson (1904–09) is fully PD with complete scans — **the
  repo has a fully-PD path into Greco-Egyptian ritual through the Demotic side that it does not have
  through the Greek side**, where Betz is locked. Most actionable finding in the round.
- **Slice 12's work-vs-witness divergence.** 19 of 62 rows diverge, and the PD witness is abridged
  *precisely at the operative core*: Turner 1657 omits the Ars Notoria's notae entirely; Mathers has
  242 squares to the German tradition's 251 and most of his are unfilled; the sole English Liber
  Juratus MS breaks off just before the invocation instructions begin. "We can describe it but
  cannot quote it" is the honest position for several first-rank works — and it happens to align
  perfectly with described-never-prescribed. Say it on the wing page.
- **Slice 12's proof-by-mistake.** Both the Steganographia seal-identity and the Scot-1665 inherited
  errors are material fingerprints, not resemblance arguments. I verified the second against
  Peterson directly. This is the standard every transmission edge in this program should be held to.
- **Slice 13's `incompletenessKind`.** Constitutive / damaged / gated / truncated, each with a clean
  exemplar (Wuzhen pian / Zhen'gao / Shingon shidō kegyō / Mohe zhiguan). Cheap to add now,
  expensive later, and it carries most of the slice's analytic value.
- **Slice 13's negative-result rows.** Two edges a plausible-sounding later pass would invent,
  recorded as *rejected* so nobody rediscovers their absence. This is the ejection discipline the
  frame document says the repo entirely lacks — and it is here, unprompted, in the data.
- **Slice 14's Sefer Yetzirah ruling.** SY is the ancestor of the Jewish half and is **itself not
  operative**; every procedure attached to it arrives in the commentary tradition. The atlas's
  `technique: null` on that slug is therefore *correct*, and attaching golem-making to it later
  would be a regression. A rare case of an audit confirming a null.
- **Slice 14's `unstable`/`plural` fifth grade.** Zero fragmentary rows is a substantive result: this
  corpus survives by continuous copying, so its defect is instability, not damage. Rebiger prints
  Shimmush Tehillim synoptically *because* each recension is internally complete and they disagree —
  "complete but plural" is a real state the vocabulary cannot express.
- **Counts hold.** I recomputed every headline figure in every notes file against its JSON. Slice 10
  (19/90/138, 54-35-1-0), slice 12 (24/62/68), slice 13 (17/49/36, 9-19-19-2), slice 14 (23/42+1/96,
  edge-type breakdown to the unit) all reconcile exactly. Slice 11's "62 procedure rows / 61
  CONTAINS_PROCEDURE" leaves one orphan row unexplained — the only arithmetic discrepancy in the
  round, and it is minor.

---

## DOMAIN CLAIMS SURVIVING (operator's Rule 5)

Counting only **substantive, sourced statements about the operative corpus** — excluding anything
whose content is the site, the schema, the tooling, or the round's own process.

| slice | surviving domain claims | notes |
|---|---:|---|
| `01` repo closed corpus | 1 | Almost all of this file is inventory *about the repo* = tooling by definition. The one genuine domain claim is the `masnavi` misattribution (the Mevlevi samāʿ belongs to the order, codified after Rumi's death, not to the poem). |
| `10` Indian tantra | 9 | Meta-ritual finding; six withholding mechanisms; Pandit redaction; five-fold syntax with an in-text locus; MMU≡"Mantra Mahodadhi" via taraṅga 15; the Ullrey-internal 15th-c./1588 contradiction; the ṣaṭkarman locus dispute; the 1933-vs-1914 PD trap; the Nityotsava withheld grade. |
| `11` Greco-Egyptian | 10 | Formulary/applied binary; PGM numerals are not work-identities; two PD corrections; the Demotic PD windfall; the corrected `pgm-corpus→lemegeton` chain; the physically-marked praxis/logos boundary; PDM xiv's split grade; Westcott vs des Places; the meta-procedural role. |
| `12` Solomonic | 11 | Cipher-manual-as-angelology; the 19-row work/witness divergence; Arbatel's three true grades; Agrippa as non-manual vs Picatrix; the Weyer→Scot→Goetia stemma; Turner 1655 composite; the Greenup PD Almadel; the Heptameron hinge; Dee's double fragmentation + completeness inversion; the Honorius non-edge; the Hygromanteia edge that must not be drawn. |
| `13` East Asian | 8 | Four incompleteness kinds; the Xici's insufficiency and Zhu Xi's reconstruction; the ganying pian is a shanshu not a manual; DZ 508's compilational dependency; the Xiuyao jing→Sukuyōdō join; two negative results; the fire-phase upgrade; the framing result that the famous classics mostly withhold. |
| `14` Abrahamic | 9 | SY not operative; instability-not-damage; the two distinct grounds for `partial`; the awfāq→Ghāya→Agrippa chain (**blocked, see B1**); construction-vs-completeness provability; Iḥyāʾ 38 is not occult literature; three authorship shapes defeating AUTHORED_BY; the missing *Risālat al-anwār*; `practice-corpus` as a node kind. |
| **TOTAL** | **48** | |

**Is the round thin? No — plainly not.** 48 domain claims against a tooling output that is
essentially five JSON files and a schema proposal is a strong ratio, and it is the opposite of the
instrument-drift failure the frame document's Amendment C is designed to catch. This round produced
knowledge, not instruments.

**But the honest qualifier:** roughly **30 of the 306 procedure rows carry `(unverified)` flags**,
concentrated in slice 10 (Niśvāsa, Svacchanda, Bṛhat Tantrasāra, Merutantra,
Īśānaśivagurudevapaddhati — ~15 rows resting partly on a wisdomlib digest of an unnamed thesis),
slice 12 (7 rows + 4 genre-inferred grades), slice 13 (`ea:meihua-yishu`, T.901's coercive rows) and
slice 14 (`jew:sefer-ha-malbush`'s three rows, `jew:or-ha-sekhel`). Those are not among the 48. The
flags are the round's best feature and its main risk simultaneously: **a flag only works if the next
round honours it rather than laundering it through restatement.**

---

## BLOCKERS — nothing ships past these

1. **B1 · The awfāq→kameas join is blocked.** Two independent conditions, both open: the *Ghāya*
   chapter carrying the seven planetary squares is `(unverified)` and must be checked against Ritter
   1933; and the "astrological attribution emerged later" nuance is now `UNVERIFIED-DO-NOT-QUOTE`
   after strike F1. Additionally the Latin channel between the *Ghāya* and Agrippa is not
   established at all — there is a gap in the middle of the slice's best edge.
2. **B2 · Peterson is quotable nowhere.** Five of slice 12's eighteen sources are his editorial
   introductions, and after strike L1 that includes the Grimorium Verum page's introduction. Cite
   him for every structural fact taken from him; ingest nothing; and do not reuse his disclaimer
   wording. His *Index Verborum* must never be ingested.
3. **B3 · `jew:sefer-ha-malbush` (3 rows) and `jew:or-ha-sekhel` do not ship** without Bohak,
   *Ancient Jewish Magic* (CUP 2008) or an equivalent. Both are graded on source quality, not on
   texts, and one of them was the anchor of a now-voided edge.
4. **B4 · `ea:meihua-yishu` does not ship** (strike E4). No scholarly treatment was found, and its
   contested block has no named holder for the sceptical position. Hold the node; do not ship it
   "marked thin".
5. **B5 · `isl:naqshbandi-kalimat-qudsiyya`'s contested block needs a named scholar** for the
   silsila-retrojection reading, or the block must be dropped. It is below the repo's own enforced
   standard.
6. **B6 · Slice 12 declares no `authors` and no `cultures` arrays.** 31 edge endpoints
   (`person:*`, `culture:*`) resolve to nothing, plus the null-target E-PAR-01. A synthesizer will
   silently drop those edges or mint phantom nodes. Structural — fix before merge.
7. **B7 · Placeholder endpoints must become ids or notes.** Slice 13 has ~11 `ea:*` targets that are
   not modelled works; slice 14 uses `"repo:kameas.js (Agrippa, Three Books II.22)"` as a node id.
   An edge endpoint may not be a file path or a sentence.
8. **B8 · Nothing here goes into `confluence.js`.** Slice 01 §7.6 records the atlas at its capacity
   tripwires: `confluence × global` sits **at** the WARN line (21) and the alchemy-west↔confluence
   corridor is at 13 of a 16 FAIL cap with all three remaining seats already allocated by the r29
   plan. The operative graph is a separate artifact. Also inherited and non-negotiable: **Order of
   Nine Angles — total exclusion**; **Yezidi material — excluded**; **magicgatebg.com — pirate
   mirror, discovery index only, never cite or ingest**.

---

## THREE RECOMMENDATIONS THE STRIKES IMPLY

1. **Add a cycle check and a direction check to the harness.** Strike E2 was a wrongly-directed
   arrow carrying a prose note admitting it — a class of error only a machine catches reliably. The
   frame document already identifies acyclicity as an unchecked, free correctness detector; add
   alongside it an assert that every `TRANSMITS_TO` runs monotone in `sortYear` where both endpoints
   are dated, and that no edge has a null or unresolvable endpoint.
2. **Make `ASSERTED: false` a first-class field, not an audit annotation.** Slice 12 invented it for
   the Hygromanteia case and it is exactly right: some relations must be *recorded as not drawn*.
   Six edges now carry it. If the synthesizer does not honour it, this audit evaporates on the next
   pass — which is precisely how a flagged edge becomes an unflagged one.
3. **Require a `completenessBasis` on every graded row** (slice 11's proposal:
   `slot-inventory | comparative-recension | self-contained-table | editorial-statement | genre-norm`).
   Strike E3 would have been impossible to make quietly if every `complete` had to name its basis —
   `genre-norm` and `slot-inventory` are not the same strength of claim, and a grade whose basis
   field would have to read "the book looks finished" would never have been written.
