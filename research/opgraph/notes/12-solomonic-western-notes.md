# Slice 12 — Western grimoire / ritual magic (medieval–early modern)

Companion notes to `12-solomonic-western.json`. Round date 2026-07-17.
**24 works · 62 work×procedure-type rows · 68 edges · 15 procedure-types (8 of them proposed vocabulary) · 18 sources.**

---

## 0. What I did and did not do

**Inherited without re-deriving** (per the round's prior-art rule): the PD verdicts in
`docs/plans/r29/esoteric-libraries.md` — the pre-1931 US wall, Mathers 1889/1898/1904, Turner
1655/56/57, Steganographia 1606, Peterson's editorial copyright, the ISTA "1888" mislabel, the
Kollatsch 2021 Abramelin dating, the admitted-edge list. These are marked `S18` and are not
claimed as this round's findings.

**Derived this round**: five Esoteric Archives editorial introductions fetched (ksol, lemegeton,
juratus, heptamer, gv) and eight targeted searches. Introductions only — I never requested and
never received operative text.

**Marked `(unverified)`**: 7 procedure rows plus the Perrone Compagni edition details, the
Almadel/al-mandal etymology, and the Liber Juratus 28-day figure. Each carries the flag in-file.

---

## 1. The finding I would lead with: the Lemegeton transmits a cipher manual as angelology

Two of the Lemegeton's five books take their spirit hierarchies and seals from Trithemius's
*Steganographia* — Theurgia-Goetia from Book 1, Ars Paulina from Book 2 — and Peterson records
that the seals **match Trithemius's exemplars exactly** (S2). Seal-identity is a material
fingerprint, not a resemblance argument, so the dependency is about as solid as this corpus gets.

But the *Steganographia*'s spirit-invocations are not procedures. The 1606 first printed edition
carried a key showing that the invocations of Books I and II were **coded instructions for
implementing ciphers**; Book III held out until Thomas Ernst (1996) and Jim Reeds (1998,
*Cryptologia* 22:4) independently solved it, and the recovered plaintexts are banal — one is the
Latin analogue of a pangram (S7).

So a 17th-century compiler copied the decorative surface of a cryptography textbook in good
faith and transmitted it downstream as angelic hierarchy. This is a **documented
transmission-by-misreading chain**, and I know of no cleaner one anywhere in Western esoteric
literature. It is also the case that breaks the completeness schema: the graph needs a way to say
*"procedure-shaped, but not a procedure"* — hence the proposed `cryptographic-concealment` type.

---

## 2. The methodological result: work-completeness and witness-completeness come apart, hard

I carried `workCompleteness` (the text as modern critical scholarship reconstructs it) separately
from `pdWitnessCompleteness` (what the pre-1931 witness the repo may actually *quote* contains).
**19 of 62 rows diverge.** This is a third axis on top of the inventory agent's
`repoCoverage` / `textCompleteness` split, and this slice is where it earns its keep — because in
the Solomonic corpus the public-domain witness is very often abridged *precisely at the operative
core*:

| Work | work | PD witness | What is missing from the witness, and how I know |
|---|---|---|---|
| **Ars Notoria** | partial | **fragmentary** | The *notae* — the figures gazed at during recitation — **are** the art. Turner's 1657 English, and earlier versions, **omit the drawings entirely**. The one text the repo may quote is void at the exact centre. MS transmission of the figures is independently documented as corrupted. |
| **Abramelin** (squares) | partial | **fragmentary** | **242 squares in Mathers vs 251 in the German tradition, and most Mathers squares are not completely filled in** — the French text left the letters blank (S8). The PD witness is short by nine squares *and* incomplete inside the ones it has. |
| **Liber Juratus** | complete (Sloane 3854) | **none** | No PD English text exists at all. And the sole English MS, Royal 17Axlii, **breaks off just after the beginning of chapter CXV — before the angel-invocation instructions commence** (S3). The English witness stops where the operation starts. |
| **Key of Solomon** | complete | partial | Mathers deliberately omitted blood operations and material he judged interpolated from the *Grimorium Verum* (S1). The abridgement is at the material-practice layer. |
| **Picatrix** | complete | **none** | Pingree 1986 and Attrell/Porreca 2019 both in copyright. |

The practical upshot for the repo: **for several first-rank works, "we can describe it but cannot
quote it" is the honest position** — and that constraint happens to align perfectly with the
described-never-prescribed framing. Worth saying out loud on the wing page rather than treating
as an embarrassment.

---

## 3. Arbatel: the slice's cleanest completeness exhibit

Printed Basel 1575 by Pietro Perna, the leading Paracelsus publisher there. Planned as **nine
tomes**; only the first — the *Isagoge*, "which in fourty and nine Aphorisms comprehendeth the
most general Precepts of the whole Art" (49 = 7×7) — was ever published or, so far as anyone
knows, written (S6).

This forces a distinction the grading schema needs and does not yet have:

- the surviving *Isagoge* is **complete as a book** — all 49 aphorisms present;
- the **work** is **fragmentary at 1/9**;
- and the procedure-type row grades **`referenced`** on independent grounds — the surviving book
  is aphoristic and preceptive, naming the seven Olympic Spirits and their governances without
  setting out an operative frame.

Three different completeness statements about one text, all true. I recorded them separately
rather than collapsing them. Arbatel is also the corpus's ethical outlier — the repo plan's
"unusual ethical register", piety and warning rather than compulsion — which makes it the natural
counterweight to the Goetia on any page that shows both.

---

## 4. Agrippa is the corpus's great non-manual

The *Three Books of Occult Philosophy* (1533) is the most influential book in Western magic and
it contains **essentially no complete procedure**. Book III is titled for ceremonial magic and
delivers doctrine — divine names, angelic orders, the theory of efficacy — with Agrippa's own
framing making ceremonial magic depend on inner transformation rather than mechanical rite.
**None of the six anatomy stages is set out.** All three of its procedure rows grade `referenced`.

Set that against **Picatrix**, which for a talismanic operation supplies the astrological
condition *and* the material recipe *and* the invocatory prayer — end to end (S11). Same century's
reading list, opposite ends of the completeness axis. That contrast is a page.

And it explains the **spurious Fourth Book** (Marburg 1559, denounced by Weyer — Agrippa's own
pupil — in 1563 as not in his master's style, a verdict "rarely questioned"): the reference work
everyone owned did not tell them what to do. *(That causal reading is mine, offered as hypothesis,
not sourced.)*

---

## 5. Two skeptics in the demon chain — and the repo should say so

The 72-spirit Goetia descends through **Weyer → Scot → Ars Goetia**, and Peterson establishes the
second link by **inherited unique errors and spellings** from Scot's 1665 edition (S2) — proof by
mistake, the philological gold standard, not by resemblance.

Both intermediaries were debunkers. Weyer printed his 69-spirit catalog inside an argument that
accused witches were deluded rather than effective; Scot translated it inside *The Discoverie of
Witchcraft*. **The canonical demon list of Western magic was published twice by people trying to
discredit it, and both are PD and quotable.** Add Waite 1911's denunciation and Crowley's own 1904
preface reading the spirits as "portions of the human brain," and the repo has **four
public-domain skeptical voices, three of them from inside the tradition**, for its highest-harm
material. The museum voice is already written; it just needs quoting.

---

## 6. The Heptameron is the hinge of the whole corpus

Peterson documents it drawing substantially on the *Liber Iuratus*, the *Clavicula Salomonis*, and
**Clm 849** (a 15th-c. necromancer's manual), with elements "systematically reorganised" (S4) —
and it in turn supplies the ritual skeleton the 18th–19th-c. cheap prints copy (S5, S18).

**Manuscript magic enters print at the Heptameron and leaves through the Bibliothèque bleue.** It
is also the shortest text in the slice that supplies all six anatomy stages, which is precisely
why it was the one worth copying wholesale. Three inbound and two outbound TRANSMITS_TO edges —
the highest-degree node in my slice.

---

## 7. Dee: the completeness contrast the slice was asked for, doubly fragmented

The diaries are **records, not manuals**, and they are fragmentary on two independent grounds:

- **by genre** — a transcript of what happened on a given afternoon is not a sequence anyone can
  follow; the operative frame must be inferred across sittings. Dee never wrote the manual for the
  thing he did most (the shew-stone practice is everywhere performed, nowhere set out);
- **by physical loss** — Dee admitted **burning roughly nine years of angelic actions (1591–1600)**,
  and further papers were destroyed in domestic use (S14). Sloane 3189 is separately noted as
  incomplete for not repeating earlier material.

The interesting wrinkle: **the compiled manuals grade *more* complete than their source.** De
Heptarchia Mystica and the 48 Claves Angelicae (Sloane 3191) are Dee's own extractions from the
records. A completeness *inversion* — worth naming as a general phenomenon, since it is how a
practice becomes a text. I recorded it as a self-edge (E-TR-16) and flagged that a self-edge is a
modelling smell: the synthesizer should probably split the node in two rather than accept my hack.

And the Dee↔Liber Juratus link (E-TR-15) is the strongest provenance edge in the slice: not
stylistic influence but **Sloane 313 bearing marginal annotations in Dee's own hand**, from which
he derived his Sigillum Dei Aemeth (S3).

---

## 8. Vocabulary: 8 of my 15 procedure-types are proposed, not existing

The controlled vocabulary was built for Indic and East Asian material and does not survive contact
with this corpus. `yantra-construction` cannot absorb the magic circle without a category error.
Ranked by how much they cost to omit:

1. **`ritual-enclosure-construction`** (9 works) — the single most characteristic element of the
   corpus, currently untypeable.
2. **`timing-election`** (8 works) — planetary-hour/lunar-phase election, a *computable* and
   already-shipped repo procedure (`cast-hour.js`, `election-tool.js`). `divination-procedure` is
   wrong: nothing is being divined.
3. **`oath-pact-binding`** — covers the Sworn Book's transmission-gating oath *and* the Grand
   Grimoire's pact frame. `initiation` covers neither and drops the harm signal.
4. **`ascetic-retreat-regimen`** — re-flagging the inventory agent's gap with hard evidence:
   folding the Abramelin ordeal into `purification` erases exactly the risk the repo plan mandates
   a callout for.
5. **`dismissal-licence-to-depart`** — its *absence* is diagnostic of incompleteness, so it must be
   typeable apart from invocation.
6. **`figure-inspection-contemplation`** — the Ars Notoria gazes at an *external* diagram;
   `visualization` means internally generated imagery.
7. **`scrying-crystallomancy`** — Almadel wax tablet, pseudo-Trithemian crystal, Dee's shew-stone:
   one technique family, currently all collapsed into `divination-procedure`.
8. **`cryptographic-concealment`** and **`procedure-as-session-record`** — the two cases (§1, §7)
   where the corpus contains things that have procedure-form but are not procedures, or record a
   procedure without prescribing it.

Also proposed: two **edge**-type extensions. `HAS_PART` (the Lemegeton's five books differ by four
centuries in origin and cannot share one grade) and `NON_EDGE` (§10).

---

## 9. New this round, not in the r29 plan

- **Turner 1655 is a six-work composite.** LoC catalog record 11031418 confirms one binding
  containing the Fourth Book, *Of Geomancy*, the Magical Elements of Peter de Abano (= Heptameron),
  Astronomical Geomancy, Pictorius's *Nature of Spirits*, and the **Arbatel**. Three separately
  graded works in this slice, one quotable PD English volume. **Any repo work on this corpus should
  start here.**
- **Peterson's Grimorium Verum page is CC-BY 4.0**, not all-rights-reserved. The plan noted the
  CC-BY exception only for the Ars Notoria; there are at least two.
- **A. W. Greenup produced a PD English Almadel** ("according to the text of the Sloane MS. 2731",
  extracted from the *Occult Review*). The plan attaches Greenup only to Sefer ha-Levanah. This is
  a free PD witness for a book that otherwise had none.
- **Peterson's Grimorium Verum disclaimer** — "presented for historical purposes only… does not
  suggest or condone any criminal, unethical, or coercive practices" — is the precedent wording the
  plan wanted, in his own words, under a licence that permits reuse with attribution.

---

## 10. Two things the graph cannot currently say, and should be able to

**Negative claims.** Peterson records that the *Liber Iuratus*'s reputation prompted the
fabrication of the later "ridiculous" *Grimoire du Pape Honorius*, "despised by Eliphas Levi and
A. E. Waite" (S3). The two are routinely conflated on the name alone, and one is a serious 14th-c.
devotional Latin work while the other is 18th-c. cheap print under a false Roman imprint. **A graph
with no way to assert "these are NOT related, and here is who confused them" will regrow the error
on every pass.** Recorded as `E-NON-01`, type `NON_EDGE`.

**Contested edges that must not be drawn.** `E-CONTESTED-01` (Hygromanteia → Key of Solomon) is
recorded with `ASSERTED: false`. Marathakis 2011 subtitles his edition *The Ancestor of the Key of
Solomon*; the shared-tradition reading holds that common Solomonic features evidence a common
reservoir, and notes the surviving Greek MSS start in the 15th c. while the Trente KOS fragment is
dated 1380–1410. **Drawing the edge would resolve the contest.** It renders as a both-ways note on
both works and never as a line.

---

## 11. Risks I want on the record

- **The Grand Grimoire entry is deliberately hollow.** One line, no structure, per the r29 ruling.
  It exists so the transmission map is not silently incomplete. If a later round wants to expand
  it, that should require explicit operator sign-off — it is the corpus's ethical outer edge.
- **Peterson dependency is heavy and structural.** Five of my eighteen sources are his editorial
  introductions. His transcriptions are the scholarly reference host for this corpus and there is
  no substitute — but every structural fact I took from him is a fact *he* established, and the
  repo must cite him for it rather than presenting it as neutral background. His *Index Verborum*
  is original scholarship and must never be ingested.
- **The Liber Juratus chapter count is internally inconsistent** in my source: S3 gives 93 chapters
  in four sections yet also has Royal 17Axlii breaking off "just after the beginning of chapter
  CXV". Numbering evidently differs between witnesses. Flagged in-file, not reconciled — Hedegård
  2002 would settle it and I did not have the volume.
- **Four grades rest on genre inference rather than text inspection**: the pseudo-Agrippa Fourth
  Book's six-stage anatomy, Clm 849, the Hygromanteia rows, and the Grand Grimoire. All carry
  `unverified: true` or `evidenceStrength: low`. Do not let them harden into fact through
  restatement.
- **Sub-book granularity may collide with the neighbouring slice.** If another agent graded "the
  Lemegeton" as one work, the merge will need my five `HAS_PART` children reconciled against their
  single node. My grades are not transferable to a collapsed node — the whole point is that
  Ars Notoria (13th c., devotional, notae-dependent) and Ars Goetia (17th c., coercive, complete)
  cannot share a completeness grade.
- **`procedure-as-session-record` may be a slice-local artefact.** It solves Dee. Whether it
  generalises — to Hekhalot vision reports, to Tibetan namthar, to any tradition whose evidence is
  testimony rather than instruction — I cannot judge from inside one slice. Offered for the
  synthesizer to accept or discard.
