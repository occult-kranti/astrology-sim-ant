# 20 — HOSTILE AUDIT of the Skinner round

Auditor pass, 2026-07-30. Scope: `10-bio-bibliography.json` + notes, `11-editions-and-contents.json` +
notes, `12-reception-criticism.json` + notes, `13-repo-overlap.json` + notes, `winder-review.pdf`.
Discipline applied: docs/FRAMING.md (adopted 2026-07-30) §1.3, §2.4, §5 A-1/A-2; docs/plans/opgraph/PLAN.md
vocabulary. Living person (Stephen Skinner, b. 1948) — and note that **Peterson, Harms, Karr, Rankine,
Clark, Marathakis, Lycourinos, Véronèse, Theobald and Sneddon are living persons too**, and the same rule
binds every sentence about them.

**Verdict: the round is publishable after the six blockers below are fixed. It is neither an uncritical
nor an unfairly negative treatment — the balance is genuinely good. The failures are concentrated in
identifier hygiene (two wrong shelfmarks, one false ISBN attribution) and in one credential claim that
gets an evidence-grade it has not earned.**

Checks run this pass: 62 discrete verifications — 20 titles/editions, 21 manuscript shelfmarks, 9
quotation/source fidelity checks against retrieved full text, 5 identifiers (thesis handle, company UEN,
ISBNs-in-conflict, journal locators), 7 repo-internal greps/reads.

---

## 1. LIVING-PERSON STRIKES

### LP-1 — BLOCKER. The credential claim is laundered into a provenance class it does not have.

`12-reception-criticism.json` → `part1_continuityThesis.academicResponse.positions[]`, holder
*"Examination process, University of Newcastle"*:

> venue: "PhD in Classics awarded 2014 (repository record uon:13943)"
> position: "…it passed doctoral examination in a Classics program."
> provenance: **"university-repository"**

The repository record does not name the discipline. **Slice 10 establishes exactly this** and says so
plainly ("the repository listing found does not itself name the discipline"; "'PhD in Classics' is
SELF-REPORTED"). Slice 12 then re-states the same label with a `university-repository` stamp — the one
provenance class that would license a page-writer to assert it flatly. This is precisely the failure mode
the brief named: a credential that circulates everywhere and is traceable to self-report.

Verified this pass (raw wikitext, `en.wikipedia.org/w/index.php?title=Stephen_Skinner_(writer)&action=raw`):

> "He received his Ph.D. in classics from the School of Humanities and Social Science at [[University of
> Newcastle (Australia)|University of Newcastle]] in 2014 for a thesis on…<ref>[…ogma.newcastle.edu.au…
> Repository/uon:13943] at NOVA: University of Newcastle Research Online</ref>"

So Wikipedia's *only* citation for "in classics" is the repository entry — i.e. the discipline label has
**no independent source anywhere in the chain**. Note also that slice 10 mis-describes what Wikipedia says
("Wikipedia says School of Humanities and Social Science", as if the Classics label were his site's alone);
Wikipedia says both, uncited-as-to-discipline. Nowhere in the round is the actual state recorded.

What IS verified: a thesis of that exact title exists at Newcastle under `hdl:1959.13/1041669` (legacy
`uon:13943`, openresearch item 29020349, indexed at OATD). Repository page 403s; ogma host is now dead
(DNS NXDOMAIN, confirmed this pass) — so the 2013-vs-2014 date could not be settled from the record either,
and the "2013, ~450 pp" figures in slice 10 trace to forum/aggregator snippets, not to a repository field.

**Required fix.** One sentence, used identically in every slice: *the thesis is verified; the discipline
label "Classics" is self-reported (sskinner.com) and repeated by Wikipedia with no independent citation;
the award year is given as 2014 by Wikipedia while the thesis is dated 2013 in secondary indexes — unresolved.*

### LP-2 — a third-party characterisation is upgraded into the subject's own stated aim.

`12 … part2_practitionerVsPhilologist.tensionStatedNeutrally`: "Lycourinos records that the restorative aim
is **Skinner's own stated framing**, not an accusation."

I read the Lycourinos preprint in full (CRESARCH/ConTERN, archived 13 Aug 2018). He writes it in his own
voice, with no Skinner locus:

> "Skinner maintains that the core of Western magic can be found in the historical transmission of mainly
> Solomonic grimoires from Byzantium to Europe. … However, this technology has been partly lost due to
> centuries of persecution. **Skinner seeks to restore the core of Western magic by tracing it back to its
> roots.**"

That is Lycourinos characterising Skinner's purpose. Attributing a *purpose* to a living person is exactly
what needs a first-party source, and there is none here. Restate as: "Lycourinos characterises the project
as restorative." (Everything else slice 12 takes from Lycourinos — the "scholar-magician" classification,
the spiritual-technology summary, the nomina/materia formulation — checks out verbatim, as does the Asprem
citation "Despite contemporary claims of an unbroken tradition of Western magic, evidence is scant at
times (Asprem 2015, 382-383)".)

### LP-3 — unsourced pejorative characterisation of a living person's working method.

`11-editions-and-contents-notes.md`: "The series is built by systematically **strip-mining** a small set of
London collections". No source carries this; it is an evaluative verb about how a named living person works.
Same file/JSON: `characterOfTheScholarship.positions[0]` presents "'documentary editions' rather than
critical editions with full apparatus" under the heading *"What the editions demonstrably are"* — that is
the round's own classification wearing a factual hat. No cited reviewer uses it. Either attribute it or
render it neutrally and checkably: *single-witness or small-witness-group transcriptions with
practitioner-facing introductions; the title pages claim transcription, not critical apparatus.*

### LP-4 — motive attribution to living editors.

`11 … swcm-03.relationToPriorEditions[1]`: "Skinner–Rankine **deliberately** edit the witness Peterson **set
aside**". `11 … swcm-10.relationToPriorEditions[0]`: "The Skinner–Clark edition's value-claim **against**
Peterson". Three living people, one imputed intention and one imputed rivalry, nothing cited. The
underlying facts are fine and citable (different base witnesses; the editions state their own bases). Drop
the adverb and the adversarial framing; slice 11's own closing line already says it correctly — "neither
party disputes the other's shelfmarks."

### LP-5 — a position miscited to a named living scholar.

`11 … swcm-02.contested[0].positions[1]` and `swcm-03.contested[0].positions[1]`: "**Peterson** and others
treat the attribution as Smart's (esotericarchives.com/solomon/lemegeton.htm)"; and `swcm-03.manuscripts[0]`
asserts as catalogue fact "BL dates the MS c. 1712, **a Peter Smart copy**."

Verified against the cited page: Peterson dates Harley 6483 "**Dated 1712-3**" and attributes to
"P[eter] Smart" only *an elaborate drawing of the Brass Vessel* — and that in Harley **6482**, not 6483.
He does not call either manuscript a Peter Smart copy, and he does not frame the Rudd ascription as Smart's.
The date is supported; the copyist identification and the attribution of the position to Peterson are not,
on the source given. Fix: keep the 1712–13 dating cited to Peterson's apparatus; source the scribal
identification separately (Harleian catalogue) or drop it.

### What the round got RIGHT on the living-person axis (recorded so the fix pass does not over-correct)

- Provenance classes are declared up front in slices 10, 11 and 12 and are actually used, per-field.
- The "first feng shui book in English in the 20th century" and "brought feng shui to the West" claims are
  labelled rather than asserted. (Worth adding: Wikipedia's two cites for this are occulture.tv — a podcast
  page — and Nevill Drury's *Watkins Dictionary of Magic*, and Drury is Skinner's co-author on *The Search
  for Abraxas*. Independence is weaker than the cite-count suggests.)
- Golden Hoard being his own imprint is stated as a fact of publication channel with **no inference drawn**
  (11 `series.publisherRelationship`). Correct handling.
- No speculation anywhere about motives, beliefs or finances.
- **The round does not dismiss him.** It carries Winder's "a very informative book on a little-known
  subject", Theobald's "probably the most important Western scholar taking the science of Fengshui
  serious[ly]", Karr's "likely to prove among the most significant works of its kind", Harms's "a welcome
  and significant addition to the literature" / "top-notch" / "an important milestone in the history of the
  grimoire tradition", the *Preternature* academic review, and the practitioner reception in full. I looked
  for an unfairly negative reading and did not find one.

---

## 2. BIBLIOGRAPHIC STRIKES

Titles spot-checked: 20 (brief required 12). List and outcome in §5.

### BIB-1 — BLOCKER. One ISBN assigned to two different books; one assignment is false.

`10-bio-bibliography.json`:
- `bibliography.fengShui[]` — "Feng Shui History … Golden Hoard/Llewellyn 2013 (**ISBN 978-0956828552**)"
- `bibliography.deeMaterial[]` — "Key to the Latin of Dr John Dee's Spiritual Diaries … Golden Hoard 2012
  (**ISBN 978-0-9568285-5-2**)"

Same number, 9780956828552. Verified: 9780956828552 is *Key to the Latin of Dr John Dee's Spiritual Diaries
(1583–1608)* (AbeBooks 0956828558; Amazon; Blackwell's, which lists it as "John Dee … Stephen Skinner
(translator)"). The *Feng Shui History* identifier is therefore wrong. A misattributed identifier is a
strike and a blocker under the brief.

### BIB-2 — mismatched ISBN/year pair.

`10 … fengShui[]` — "Advanced Flying Star Feng Shui … Golden Hoard/Llewellyn **2015** (ISBN 978-1912212057)".
9781912212057 is the **2017** Golden Hoard printing (AbeBooks "New (2017)", Green Apple, 358 pp). A separate
ISBN 9780993204203 exists for the earlier issue. The 1-912212-xx block does not begin until 2017, which is
what makes the pairing self-evidently wrong on inspection.

### BIB-3 — BLOCKER. A forthcoming announcement asserted as an existing, dated publication.

`11 … swcm-15.relationToPriorEditions[2]` and `11-editions-and-contents-notes.md`:

> "A competing independent English edition **exists**: Bradley Sneddon & Andreas Erneus, *Summa Sacre Magice
> Book 1: a transcription, critical edition & translation* (**2025**)"

The round's own cited source (Amazon ASIN B0GYJVTVD9, ISBN 9798258305985) gives a release date of
**8 September 2026** — after the round's compile date of 2026-07-30. So: announced, not published; and
the year is wrong. This claim is load-bearing — it is the round's sole evidence that Skinner's Summa now
has a rival modern English treatment, which is a comparative statement about a living person's work.
Restate as "announced for September 2026" or drop.

### BIB-4 — role attribution wrong on the one volume with a peer-reviewed review.

`10 … sourceworksOfCeremonialMagic.volumes[]` vol VI: `"with": "Don Karr"`, role EDITED — reads as
co-editorship. The title page and the *Preternature* review give the actual division:

> *Sepher Raziel, Also Known as Liber Salomonis: A 1564 English Grimoire from Sloane MS 3826* (MS
> **transcribed, annotated, and introduced by Don Karr**; **foreword and modern English version by Stephen
> Skinner**) — rev. Garth D. Reese, *Preternature* 3.2 (2014) 406–408, MUSE 554996.

Slice 11 gets this exactly right (`editors: ["Don Karr (transcription, annotation, introduction)",
"Stephen Skinner (foreword and modern English version)"]`). Slice 10 must be brought into line — author vs
editor vs translator precision is the specific thing the brief flagged, and this is the volume where an
overstated role would be most visible to a reader who follows the citation.

### BIB-5 — ISBN/edition conflations carried without flag (2 counts).

- `11 … swcm-08` Hygromanteia, `isbn: ["978-0-9568285-0-7"]`, year 2011. 9780956828507 is catalogued in the
  trade as a **2010** Golden Hoard issue (446 pp); the 2011 SWCM VIII first edition is **9780956828514**
  (AbeBooks 0956828515). Two bindings are being silently merged into one record.
- `11 … swcm-13` Steganographia, `isbn: [… "978-1-912212-37-8 (UK)"]`, cited to the Weiser Antiquarian
  record. That record — fetched this pass — gives **9781912212385**, Golden Hoard Press, Singapore, 2024,
  "Volume XIII of the Sourceworks of Ceremonial Magic series", Collector's Deluxe limited to 150.

### BIB-6 — publisher/ISBN cross-wiring, plus an unflagged divergence from the round's own primary source.

`10 … editedIntroducedOther[]`: "Michael Psellus, On the Operation of Daemons … **Golden Hoard 2010 (ISBN
978-0738723549** per lists)". 9780738723549 is the **Llewellyn** issue; the Golden Hoard ISBN is
9780955738722 (which slice 11 has correctly). Separately: sskinner.com — a source both slices cite — dates
the Golden Hoard printing **September 2009**, while both slices say 2010 (trade records do support 2010).
The divergence from the round's own primary source is unrecorded.

### BIB-7 — inter-slice date conflict handed to the parent unreconciled.

SWCM 10, *The Clavis … translated by Ebenezer Sibley*: slice 10 says **2018**; slice 11 says **2019**
(field `year: 2019`, note "2018/2019"). Verified: Golden Hoard 9781912212088 = **31 Oct 2018**; Llewellyn
9780738762067 = **2019**; sskinner.com says 8 Jan 2019. Both slices are half-right and neither states the
rule. Give the parent one line: Golden Hoard 2018, Llewellyn 2019.

### Sourceworks volume list — completeness and dating verdict

**Materially complete and correctly ordered I–XV plus "18".** Volume numbers verified independently this
pass, not taken from the round: IX (Stanford SearchWorks 13752379, "Sourceworks of ceremonial magic series,
v. 9"), VIII (AbeBooks/Weiser title page, "Volume VIII"), IV (Waterstones, "Sourceworks of Ceremonial Magic
4"), VI (*Preternature* review, "sixth in the … Series"), XIII (Weiser Antiquarian, "Volume XIII"), and 11 /
12 / 14 / "Vol. XV Series" / 18 from sskinner.com fetched directly. The round's flagged gap survives my
checking: **no vol 16 or 17 exists in any trade, catalogue or publisher listing I could reach** — the gap
between "Vol. XV Series" (Summa 1–2, Nov 2024) and "Vol. 18" (Summa 3–4, Dec 2025) is real and unexplained,
and the round is right to leave it unresolved rather than invent a bridge.

One item the round should ADD to its numbering-confusion dossier, because it leans on this source elsewhere:
**the Lycourinos Brill entry's own bibliography swaps them** —

> "Rankine, David and Skinner, Stephen. **2008**. *The Goetia of Dr. Rudd* (Sourceworks of Ceremonial Magic
> Series Volume **IV**). Singapore: Golden Hoard Press."
> "Skinner, Stephen and Rankine, David. **2007**. *The Veritable Key of Solomon* (Sourceworks of Ceremonial
> Magic Series Volume **III**). Singapore: Golden Hoard Press."

Both volume numbers and both years are transposed, in an academically edited reference work. That is
strong corroboration for the round's own corrections (Goetia = vol III, 2007; Veritable Key = vol IV, 2008)
and a useful datum on how unreliable the secondary numbering is.

**Corrections the round made that I independently confirm and that must be kept:** Goetia of Dr Rudd first
ed. **2007** (not the 2009/2010 Llewellyn); Veritable Key first ed. **2008** (not 2011); *Terrestrial
Astrology* publisher = **Routledge & Kegan Paul**, not "Law Book" (Winder review head-matter, read in full);
***The Testament of Cyprian the Mage* is Jake Stratton-Kent, not Skinner** — this one is a genuine save and
must survive into the page.

---

## 3. MANUSCRIPT STRIKES

The shelfmarks are the most checkable claims in the round, and the round's own structural finding is
correct and is its best result: **Golden Hoard title pages name their shelfmarks, and library catalogues
transcribe those title pages verbatim.** I sampled 21 shelfmarks. Nineteen are exactly right. Two are wrong,
and both errors were introduced by the round, not by the books.

### MS-1 — BLOCKER. Wrong base manuscript for SWCM 9, inside a round that elsewhere gets it right.

`10 … sourceworksOfCeremonialMagic.volumes[]` vol IX: *"Edition of **Wellcome MS 3203**, an English
cunning-man's working book."*

False. Stanford SearchWorks 13752379, fetched this pass:

> "A cunning man's grimoire: the secret of secrets: **being Rawlinson MS. D. 253**" — Stephen Skinner and
> David Rankine (transcribers and editors), Golden Hoard Press, Singapore, 2018, ISBN 9781912212101 /
> 9780738760728, "Sourceworks of ceremonial magic series, v. 9".

Wellcome MS 3203 belongs to **SWCM 3** — it is one of the supplementary witnesses named on the *Goetia of
Dr Rudd*'s own title page (WorldCat 637468388, Biblio, and Don Karr's survey, all read this pass:
"…from Harley MS 6483, with other pertinent extracts from manuscripts Harley MS 6482, Sloane MS 3824 and
Wellcome MS 3203"). Slice 11 carries the correct reading **and files an explicit correction against exactly
this error** (`explicitCorrections[1]`) — and slice 10 states the error anyway. The round contradicts itself
on the single most checkable fact class it handles.

### MS-2 — BLOCKER. A real shelfmark mangled into a non-existent one.

`12 … part2_practitionerVsPhilologist.academicSideReception[3]`: "…the Skinner–Rankine *Goetia of Dr Rudd*
is valued for containing 'much material which no other version does' (Harley MS 6483, with Harley 6482,
Sloane 3824, **Wellcome MS 32**)."

Karr's survey — the cited source, retrieved and read this pass — quotes the title page in full and gives
**Wellcome MS 3203**. "Wellcome MS 32" does not designate this manuscript. The error sits inside a
parenthesis attached to a quotation, which is the worst place for it: a reader will take it as Karr's.

### MS-3 — BLOCKER. The repo's own wrong shelfmark passes through the round unflagged.

`13-repo-overlap.json` R5 quotes `research/opgraph/slices/12-solomonic-western.json:346` —

> "The repo plan records a 1564 English MS (**Sloane 3846**)."

I read that line in the repo; it says 3846. The 1564 English *Sepher Raziel / Liber Salomonis* is **BL
Sloane MS 3826** — the book's own title, the Wellcome/WorldCat records, the *Preternature* review title, and
slice 11 all say 3826. Sloane 3846 is a real but unrelated magical manuscript, which is why the error is
silent. Slice 13 is repo-internal by design and cannot be blamed for not researching externally — but
**slice 11 established 3826 in the same round**, nobody reconciled the two, and slice 13's action line
invites the Skinner page to carry the edition fact "cited to the slice". The parent would ship a wrong
shelfmark. Fix in the repo file and add a cross-slice note.

### Manuscript sample verified CLEAN (19/21)

| Claim | Verified against |
|---|---|
| SWCM 1: BL Sloane 307, Sloane 3821; Bodl. Rawlinson D.1067, D.1363 | Wellcome Collection `dybm955y`, title-page transcription — exact match, all four |
| SWCM 2: BL Sloane 3825 + Harley 6482 + Sloane 3821, 3824, 3628 + Rawlinson D.1363 | Wellcome `dnyxk7rj` — exact match, all six |
| SWCM 3: Harley 6483 + Harley 6482, Sloane 3824, Wellcome 3203 | WorldCat 637468388 / Biblio / Karr — exact match |
| SWCM 4: Wellcome 4669, 4670 (Fyot, 1796), +6 others | Wellcome `qcxnb9nj`; bookseller title page ("translation of Wellcome MS 4669 and Wellcome MS 4670 by Paul Harry Barron … supplemented from six other manuscripts") |
| SWCM 8: Harleianus 5596, Bononiensis 3632, Atheniensis 1265, Gennadianus 45, Atheniensis 115, Parisinus 2419, Monacensis Gr. 70 | AbeBooks title-page transcription — exact match, all seven |
| SWCM 9: Bodl. Rawlinson D.253 | Stanford SearchWorks 13752379 |
| SWCM 12: BnF lat. 9336 | publisher copy, consistent across retailers |
| SWCM 15/18: Kassel UB **4° Ms. astron. 3**, Ganell, 1346 | Kassel ORKA record; Gehr/Veenstra literature |
| SWCM 11: Yale Beinecke **Mellon MS 1** | Beinecke pre-1600 MSS catalogue: *Ars notoria, sive Flores aurei*, France/N. Italy, c. 1225 — a real and correctly identified Ars Notoria witness |
| SWCM 5: Wellcome MS 2000 | Wellcome `ubnsv47n` (round's cite; consistent with the known unique witness) |

Unverified but honestly flagged by the round, and I concur it should stay flagged: SWCM 10's base is an
unnamed private manuscript with no public shelfmark, and the "45% longer" figure is self-reported. That is
correctly recorded as the weakest provenance point in the corpus — an observation about an *edition*, not
about the person, so it clears the living-person bar.

---

## 4. THESIS STRIKES

### TH-1 — the thesis itself is handled correctly. No strike.

The continuity claim is stated as **his** claim throughout (`whatSkinnerClaims`), with the two Techniques
volumes as its published form, and both slices that touch it refuse to resolve it. Slice 13 R4 correctly
inherits the repo's existing `E-CONTESTED-01` non-resolution and instructs the page not to adjudicate.
The `claimedBy` shape required by FRAMING §2.4 is explicitly named in slice 12's `statusForThisSite`.

Critic fidelity checked verbatim against the retrieved posts — **no strawmanning**:

- Harms, 13 Jul 2015: "It's not a new hypothesis, but Skinner's achievement here is to lay out the evidence
  thoroughly, by going through both works systematically to identify the commonalities among them." /
  "One notable omission is a comparison of the actual prayers, invocations, and other religious texts used
  in the Hygromanteia and the Clavicula." — slice 12's paraphrase is accurate and, importantly, carries
  Harms's *positive* verdict alongside ("an excellent" work, "an important milestone").
- Asprem via Lycourinos, pp. 382–383 — verbatim match, and slice 12 correctly flags it as a second-hand
  citation and correctly carries Lycourinos's own qualifier that this "does not imply that there is no
  continuity whatsoever".
- Winder, *Medical History* 26:1 (1982) 107–108 — I read the full scan. Slice 12's rendering of the merit
  ("brought together versions of geomancy described in various eastern and western cultures, studied
  separately but never compared before"), the criticism (unused and unlisted Wellcome MSS 10, 394, 531),
  the verdict ("a very informative book on a little-known subject") and the three diffusion routes are all
  accurate.
- Karr on Peterson — Karr's actual sentence is "Peterson's *Lesser Key* by far the best edition available of
  a **'complete'** Lemegeton", with scare quotes on *complete*. Slice 12 drops them. Trivial, but restore.

### TH-2 — the one place a critic's position is asserted without a locus, and it cuts AGAINST him.

`11 … swcm-08.contested[0].positions[1]`: "Academic treatments (**Torijano**; **R. Greenfield**'s work on
Byzantine demonology) describe a more complex multi-recension relationship without a single line of descent".

No work, no year, no page, no quotation — and neither name appears in that record's `sources[]`, which are
an AbeBooks listing and two Wikipedia articles. Torijano's *Solomon the Esoteric King* (Brill 2002) is cited
elsewhere in the same record for its *scope*, not for this position. This is the mirror image of LP-1: a
substantive scholarly position asserted at a grade the evidence in hand does not support, this time on the
side opposing Skinner. Under the brief's fifth clause — an unfairly negative reading is as much a failure as
an uncritical one — this must be sourced or removed. If it cannot be sourced, the honest form is: *no
located academic statement directly contests the ancestry claim; the field's standard treatments (Torijano
2002; Greenfield) describe the corpus without adopting it.*

### TH-3 — two "unresolved" items are resolvable with sources the round already located.

Slice 12 states three times that no peer-reviewed review of either *Techniques* volume was found, and
correctly labels this "an absence-of-located-evidence finding, not a proven absence." Good discipline.
But: the Theobald *EASTM* 37 (2013) review, whose **criticisms of a living person's book** slice 12 reports
from the abstract only after a Brill 403, is openly available in full — CORE 228877453 and academia.edu
33870913, both of which the round's own search surfaced. Reporting named defects in someone's work from an
abstract, when the text is one click away, is not acceptable at this bar. Either fetch it or mark every
Theobald criticism "per the published abstract" at point of use, not merely in the `unresolved[]` list a
page-writer will not read.

---

## 5. RAZOR / LICENCE

### RZ-1 — `quoteSafe` missing on one of the four artefacts.

`13-repo-overlap.json` carries no `quoteSafe` and no `livingPerson` field; `13-repo-overlap-notes.md`
likewise. The brief says quoteSafe:false on everything. Slices 10, 11 and 12 all carry it (11 also carries
an explicit `operativeRazor` statement, which is the right pattern). Add both fields to 13.

### RZ-2 — operative razor: CLEAN. No strike.

I looked specifically for: formulae, divine-name strings, drawable templates, substance lists with
quantities, seals, sigils, correspondence tables, orations. **None present in any of the four artefacts.**
Contents are described at procedure-TYPE / structural-anatomy / completeness level exactly as the opgraph
vocabulary requires. The structural counts that do appear (72 spirits, 28 mansions, four cardinal kings,
seven treatises, 76 tables, five books, 103 titles in the Trithemius catalogue) are catalogue-level facts,
not operative content.

Two places sit closest to the line and should be watched by whoever writes the page, because expanding
either would cross it: `11 … swcm-06.textEdited` enumerates the seven treatise names of Sloane 3826, and
`11 … swcm-03.operativeContents.procedureTypes` enumerates the Lemegeton's apparatus sections. Both are
still anatomy. Neither may be expanded into contents.

### RZ-3 — no in-copyright Skinner text reproduced. No strike.

Every quoted string I sampled is one of: a title page (catalogue-transcribed, factual, unprotectable),
a labelled paraphrase of publisher copy, or a third-party reviewer's own words. Nothing from the body of any
Skinner book, edition, table, transcription or translation appears anywhere. Slice 12's `risks[]` states
this explicitly and correctly.

One transcription slip inside a quotation: `12 … part3` renders Winder's Wellcome MS 10 title as
*"Geomantiae astronomicae"*; the printed review (p. 108, read in full) has *"Geomantica astronomica"*.

---

## 6. BLOCKERS (must clear before the Skinner page is written)

1. **LP-1** — slice 12 gives the "PhD in Classics" discipline label `university-repository` provenance.
   Downgrade to self-reported/tertiary-uncited; unify the wording across slices 10 and 12.
2. **BIB-1** — ISBN 9780956828552 is assigned to both *Feng Shui History* and *Key to the Latin of Dr John
   Dee's Spiritual Diaries* in slice 10. It belongs to the latter; the former's identifier is false.
3. **BIB-3** — Sneddon & Erneus *Summa Sacre Magice Book 1* is asserted to "exist" as a 2025 publication;
   the round's own cited listing gives a release date of 8 September 2026.
4. **MS-1** — slice 10 gives *A Cunning Man's Grimoire* (SWCM 9) as an edition of Wellcome MS 3203. It is
   **Bodleian Rawlinson MS D.253**. Slice 11 already carries the correction; slice 10 must adopt it.
5. **MS-2** — slice 12 gives "Wellcome MS 32" where Karr's quoted title page gives **Wellcome MS 3203**.
6. **MS-3** — `research/opgraph/slices/12-solomonic-western.json:346` records the 1564 English Sepher Raziel
   MS as "Sloane 3846"; it is **Sloane 3826**. Fix in-repo and cross-note in slice 13 before the page links
   the edition fact.

## 7. NON-BLOCKING STRIKES

LP-2 (restorative aim mis-attributed as self-description) · LP-3 ("strip-mining"; "documentary editions" as
fact) · LP-4 ("deliberately", "against Peterson") · LP-5 (Peter Smart copyist claim miscited to Peterson) ·
BIB-2 (Advanced Flying Star ISBN/year) · BIB-4 (Sepher Raziel role attribution in slice 10) · BIB-5
(Hygromanteia and Steganographia ISBN/binding conflations) · BIB-6 (Psellus ISBN/publisher cross-wiring;
2009-vs-2010 divergence from sskinner.com unrecorded) · BIB-7 (SWCM 10 date, 2018 vs 2019, unreconciled
between slices) · TH-2 (Torijano/Greenfield position asserted with no locus) · TH-3 (Theobald criticisms
sourced from abstract when full text is open) · RZ-1 (13-repo-overlap missing quoteSafe/livingPerson) ·
Winder title micro-misquote.

## 8. WHAT SURVIVES INTACT AND SHOULD BE TREATED AS THE ROUND'S RESULT

- The shelfmark method and 19 of 21 shelfmarks. The finding that Golden Hoard title pages name their
  witnesses and that library catalogues transcribe them is correct, load-bearing and independently
  reproducible — it is what makes a bibliographic treatment of this subject possible at all.
- The four first-edition corrections against both Wikipedia and sskinner.com (Goetia 2007; Veritable Key
  2008; *Terrestrial Astrology* = RKP; series numbering unresolved), all confirmed.
- The Stratton-Kent correction — *The Testament of Cyprian the Mage* is not Skinner's.
- The reception picture: two peer-reviewed journal reviews located and correctly located (Winder 1982;
  Theobald 2013), one academic-reference classification (Lycourinos), one academic review of a Sourceworks
  volume (Reese, *Preternature* 3.2, 406–408 — the round has the citation but should add reviewer and pages),
  one credentialed scholar-blogger across three reviews, one bibliographic survey, and a practitioner side
  that is documented rather than editorialised.
- The FRAMING §5 A-1/A-2 observation in slice 12 — that practitioner reviewers read the comparative
  apparatus as a licence for cross-grimoire gap-filling and recombination — is the single most useful thing
  in the round for this repo, is properly sourced (Spiral Nature, Frater 232, 23 May 2016, verbatim
  verified), and is correctly framed as *reception to report*, not a method to model.
- Slice 13's repo map, including its incidental find that ten Solomonic `atlasSlug` values in `opgraph.js`
  dangle against `confluence.js`. That defect is real and worth its own ticket.
