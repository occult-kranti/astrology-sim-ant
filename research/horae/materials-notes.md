# materials — reasoning, gaps and open questions

Dossier: `research/horae/materials.json`
System: the planetary materials matrix (Western/Islamicate)
Compiled 2026-08-01. Research file only — nothing under `assets/` or `pages/` was touched.

---

## 1. The headline result

**The Picatrix column is empty, and that is the finding.**

This dossier was commissioned to draw incense, stone, metal, colour, angel/intelligence/spirit
and offerings from the Picatrix (Greer–Warnock **and** Attrell–Porreca), Agrippa I–II, and the
Heptameron. Two of those three came back rich, checkable and full of usable conflict. The
Picatrix came back **entirely unverified**, for a reason that was foreseeable and is worth
stating plainly rather than burying:

- Greer–Warnock (Adocentyn Press, 2010–11) and Attrell–Porreca (Penn State, 2019) are both **in
  copyright**. Neither was available to me in an authorized copy.
- Full-text copies of both are trivially findable — I hit an `academia.edu` PDF and an
  `archive.org` PDF of the Greer–Warnock Books 3–4 in the course of ordinary searching.
- **I did not open either.** Not to quote, and not even to check a page number. Reading an
  unauthorized reproduction of an in-copyright work in order to produce a citation that implies
  I consulted the authorized one would be a fabricated locator, which is FRAMING §1.2 and rule 7
  of the brief, and the copyright problem does not go away because the use is small.

So every Picatrix cell in the dossier reads `unattested — not verified from an authorized copy`.
The brief said a confirmed gap is a good result; this is the largest one and it is confirmed.

**What this means for the repo, concretely:** the values currently shipping in
`assets/js/core/data/planetary-magic.js` under the source string
`'Picatrix III.7; Agrippa, Three Books II'` — the colours, the prayer-angels, Saturn's `opium`,
the Sun's `diamond` — are, as far as this pass can establish, **tier-C compilation values from
`research/SOURCE-DATA.md` §4, whose own stated upstream is Christopher Warnock's practitioner
site**. Nothing I verified corroborates them. They are not thereby wrong. They are unsupported,
which is a different and more fixable condition.

---

## 2. What *did* come back, and why I trust it

Agrippa and the Heptameron are both available in **public-domain English translations**
(Freake 1651; Turner 1655) in Joseph H. Peterson's Twilit Grotto editions. Under FRAMING §4.1
those are `pd-us` on the plainest possible ground — publication three centuries before the 1930
threshold — so I could work from the text itself rather than from someone's summary of it.

**Method note, and it changed the result.** My first passes used the summarising fetch. It
returned, for the Heptameron, a Sunday hour-angel list beginning *"Raphael, Nakhiel, Giel,
Castor, Malayael, Taphthartharath, Hismael"* and a Sunday day-angel of *Raphael*. **All of that
is fabricated.** `Nakhiel`, `Taphthartharath` and `Hismael` are Agrippa's *planetary-table*
names from a different book by a different author; `Castor` and `Giel` are not Heptameron hour
angels at all. Had I taken it, this dossier would have shipped invented angel names under a
verbatim citation to a 1655 printing — the exact failure mode the brief calls a defect that will
be shipped and trusted.

I therefore **downloaded the raw HTML for every primary page, stripped it, and read the tables
myself.** Everything in the `entries`, `variants` and `goldenValues` blocks was read off the
source text directly. The working files are in the session scratchpad
(`heptamer.txt`, `ag1b.txt`, `op2.txt`, `scale7.txt`, `ag_xliv.txt`, `ag_stones.txt`).

Anyone re-running this: **do not trust a summarised fetch on a table of proper names.** It
produces fluent, plausible, wrong output, and proper names are precisely where you cannot spot
the error by reading.

---

## 3. The seven divergences worth the page

These are the reason this dossier is worth having, and none of them can be rendered as a single
cell. They are in `variants` as V1–V7.

**V1 — Agrippa contradicts himself on metals.** The Scale of Seven (II.10) gives Jupiter *tin*,
Venus *copper*, Mercury *quicksilver*. Twelve chapters later (II.22) the *table* of Jupiter is
**silver**, of Venus **silver**, of Mercury **silver, tin or yellow brass** — and the Moon's is
silver if the work is fortunate, **lead if unfortunate**. Saturn, Mars and the Sun agree. A
single `metal` column silently picks a side for four of seven planets.

**V2 — the Michael/Raphael swap.** Agrippa II.10: **Raphael = Sun, Michael = Mercury**. The
Heptameron: **Michael = Sun, Raphael = Mercury** — provable from its own Sunday table, where
day-hour 1 (a Sun hour) reads Michael and day-hour 3 (a Mercury hour) reads Raphael. This is the
single most consequential conflict in the dossier because both texts are canonical and the names
are the ones every downstream practitioner source uses. Crucially, **the comparison is not
mine**: Peterson states it in his headnote to §XXV — the Heptameron "swaps Raphael and Michael"
relative to CLM 849 and Vat. lat. Reg. 1115. That gives the row a `claimedBy` under FRAMING
§2.4, which is what makes it publishable at all.

**V3 — two documented translator's errors, both in the perfume column.** Sunday's Latin is
*Sandalum rubeum* (red sandalwood); Turner's **1655** printing gives **"Red Wheat"**, having
confused *sandalum* with *sandala*, a white wheat — and Turner's **own 1665 printing corrects it**
to "Red Sanders". Friday's Latin is *Costus*; Turner gives "Pepperwort"; Peterson identifies
*Costus* as probably *Saussurea lappa*, not *Lepidium*. This is the best single argument in the
dossier for **edition as a data field rather than a footnote**: "Heptameron, Sunday, red wheat"
and "Heptameron, Sunday, red sandalwood" are the same datum in two printings by the same man,
and a row that does not say which is unfalsifiable.

**V4 — Agrippa I.xliv holds three mutually inconsistent schemes in one chapter.** The seven
compound fumes; a class-of-matter list (roots→Saturn, fruits→Jupiter, woods→Mars, gums→Sun,
flowers→Venus, peels/seeds→Mercury, leaves→Moon); and the seven-aromatic compound he credits to
Hermes. They collide: saffron is Venus's in the Hermes list but opens the *Sun's* compound;
lignum aloes is Mars's in the Hermes list but sits in the *Sun's* and *Venus's* compounds.
Practitioner literature habitually quotes the Hermes list as "Agrippa's planetary incenses",
which quietly promotes scheme 3 over schemes 1 and 2. Agrippa does not rank them.

**V5 — a granularity mismatch a shared schema will hide.** The Heptameron supplies **seven**
perfumes, one per weekday, **none per hour**. Agrippa's attach to the planet and therefore change
with the hour. Rendering a Heptameron perfume in a per-hour column asserts something the
Heptameron does not say. The weekday→planet mapping is safe only because the Heptameron names
each day's planet itself; it does not run backwards into hours.

**V6 — the spelling recension.** Freake 1651 prints *Johphiel, Nachiel, Barzabel, Malcha
betharsisim*, and *Zaphiel* (Peterson emends to *Zaphkiel* and says so). The repo carries
*Iophiel, Nakhiel, Bartzabel, Malka betharsisim, Zaphkiel* — Golden Dawn-era standardisations.
Not wrong, but not Agrippa's translator either, and currently printed under an Agrippa citation.

**V7 — a provenance error in the repo's own header.** `planetary-magic.js` states that Angel,
Intelligence and Spirit are "roles WITHIN a single system … Agrippa's ONE triad per planet."
They are printed **twelve chapters apart under different rubrics**: Intelligence and Spirit
belong to the planetary *tables* (II.22, with divine names and a table metal); the Angel comes
from the Scale of Seven (II.10), row label "Seven Angels which stand in the presence of God".
Whether Agrippa meant them as one system is a fair question. That they are one *locus* is not —
they aren't. The header's fidelity note is right in spirit (keep the systems apart) and wrong on
this specific claim.

---

## 4. The toxicity handling, and one substantive correction to shipped data

Every one of Agrippa's seven compound fumes is harm-flagged, because **every one of them is bound
with animal brain or blood**. Two are bound with **human blood** — Mars ("the blood of a Man")
and the Moon ("Menstruous blood"). Beyond that:

- **Saturn** — henbane (*Hyoscyamus niger*) and mandrake root (*Mandragora*), both tropane-alkaloid
  deliriants; black poppy seed.
- **Mars** — euphorbium (*Euphorbia resinifera* latex, a severe vesicant); **the roots of both
  hellebores**, which is two unrelated cardiotoxic genera (*Helleborus niger* and *Veratrum album*)
  sharing one archaic name — a conflation that is itself a documented poisoning pathway; sulphur.
- **Moon** — white poppy seed; camphor (neurotoxic, a recognised paediatric poisoning agent).
- **Mercury** — the hazard is the *metal*: quicksilver, whose vapour is absorbed by inhalation at
  room temperature. Worth recording that **Agrippa himself supplies the workaround** — II.22 lets
  the Mercury table be made in silver, tin or brass.
- Protected species appear throughout (eagle, stork, swallow); the Sun's fume names eagle brain,
  and possession of eagle parts is a statutory offence in the US.

**Record-not-recipe was enforced structurally, not by tone.** Every harm-flagged entry carries
`substance` populated, `quantity: null`, `processParam: null`, an explicit `withheldReason`, and
`normalised: false`. Agrippa's chapter *does* carry a proportion phrase and a preparation form.
**Neither is transcribed anywhere in the dossier**, and the edition that carries them is named,
per FRAMING §4.4 — the record is a pointer, not a substitute. A grep of the finished JSON for
`g|mg|kg|ml|°C|°F` and for bare numeric quantities returns nothing.

### The correction: Saturn's "opium" is not in Agrippa

`planetary-magic.js` gives Saturn `suffumigation: 'opium, etc.'` and attaches a harm note
entirely about opium — alkaloids, respiratory depression, controlled-substance status. But
**Agrippa I.xliv says "the seed of black Poppy"**, and poppy seed is not opium: opium is the
dried latex of the unripe capsule, a different part of the same plant with a different alkaloid
load. The module's `source` field claims Picatrix III.7 *and* Agrippa; the Agrippa half does not
support it.

This matters more than a normal citation slip because the site is currently **harm-noting a
controlled substance that its own cited primary text does not name.** If "opium" came from the
Picatrix it may be perfectly correct — and that is exactly what could not be checked. Flagged in
`contestedPoints`; **not** silently corrected, because silently deleting it would be as much an
unsourced edit as leaving it.

---

## 5. Golden values — what phase 2 can actually test

Six, in `goldenValues`. One thing needs saying about place and date, because the brief asked for
them and the honest answer is a bit awkward:

**The materials matrix has no clock of its own.** It is a lookup keyed on a ruling planet that
`planetary-hours.js` has already computed. So place and date are not load-bearing *for this
dossier* — the tables are place- and date-independent, and I have said so in each entry rather
than inventing a sunrise time to make the field look full. Fabricating a boundary timestamp to
satisfy a schema field would be exactly the "fabricated number carrying the site's authority"
that FRAMING §5 C-1 forbids in a different context.

What GV1 and GV2 *do* give is a genuine end-to-end test, because the Heptameron's hour-angel
tables are **the Chaldean sequence with angel names substituted**:

- **GV1, Sunday** (concrete date 2026-08-02, weekday verified). Day-hours 1–12: Michael, Anael,
  Raphael, Gabriel, Cassiel, Sachiel, Samael, Michael, Anael, Raphael, Gabriel, Cassiel.
  Night-hours 1–12: Sachiel, Samael, Michael, Anael, Raphael, Gabriel, Cassiel, Sachiel, Samael,
  Michael, Anael, Raphael.
  This tests **both layers at once**: `hoursTable()` must yield Sun, Venus, Mercury, Moon,
  Saturn, Jupiter, Mars … for a Sunday, and the Heptameron map must be
  `{Sun:Michael, Venus:Anael, Mercury:Raphael, Moon:Gabriel, Saturn:Cassiel, Jupiter:Sachiel,
  Mars:Samael}`. The night sequence **continuing into Jupiter at night-hour 1** rather than
  restarting is the assertion that catches an engine that resets the cycle at sunset.
- **GV2, Monday** (2026-08-03, verified) catches an off-by-one in the weekday→first-hour-ruler map
  that Sunday alone cannot catch, since Sunday is index 0 in most implementations.
- **GV3** pins the seven weekday perfumes *and* forces the 1655/1665 divergence into the API: a
  correct implementation takes the edition as an input and cannot return Sunday's value without
  one.
- **GV5** carries the assertion I care most about: **assert that the Jupiter, Venus and Mercury
  table-metals are NOT equal to their Scale-of-Seven metals.** That is a test whose whole job is
  to fail if a future round tidies the two columns into one.
- **GV6** (the Hermes seven-aromatic) can additionally assert that the returned object contains
  **no numeric field and no unit token**, pinning the C-1 ceiling at the data layer.

---

## 6. Open questions for a human

In `contestedPoints`; the four that actually block work:

1. **Does the engine emit both Sun-angels or pick one?** Raphael (Agrippa) and Michael
   (Heptameron) are both canonical. Emitting one silently is the only unacceptable option.
2. **Is `metal` one column or two?** It cannot be one without an editorial choice for four
   planets.
3. **Does the Sun's `diamond` survive?** Attested at no Agrippa locus I checked; Agrippa gives
   the diamond to Mars twice. It may be sound for the Picatrix — unverifiable here. Deleting it
   discards a possibly-good datum; keeping it under the present source string asserts an Agrippa
   attestation that does not exist.
4. **Are `Raucayehil` (Jupiter) and `Raucahehil` (Mars) two names or one corrupted twice?** They
   differ by one letter. A transcription slip upstream is at least as likely as two genuinely
   near-identical angel names. **These should not ship as distinct data until someone reads an
   actual Picatrix.**

---

## 7. What I would do next, in order

1. **Get an authorized Picatrix.** Attrell–Porreca (Penn State, 2019, ISBN 978-0-271-08212-7) is
   the one to buy — it is the academic edition, translated from Pingree's Latin, and it is the
   one whose page numbers a reader can follow. One copy unblocks the colour, offering,
   suffumigation and prayer-angel columns and settles items 3 and 4 above. Nothing else in this
   dossier is blocked on anything.
2. **Fix `planetary-magic.js`'s source strings before adding a single new row.** Splitting
   `SOURCE` into per-field loci (`agrippa I.xliv`, `agrippa II.x`, `agrippa II.xxii`,
   `heptameron §XXV`) is a small change that makes every later disagreement expressible. Doing it
   after the Horae page ships means doing it twice.
3. **Deal with `picatrix-prayers.js` (FRAMING §9.8).** I confirmed the live violation while
   scoping this work: `prayerExcerpt` holds verbatim Greer–Warnock, an in-copyright translation,
   with no `pdBasis` of any kind, and it is piped into the assistant context. This dossier does
   not repeat it — the Picatrix appears here as a cited node with no text — but the existing
   defect is unaffected by my not repeating it.
4. Capture the Agrippa II.22 divine names for Venus, Mercury and the Moon. Small, and the page is
   already downloaded.

---

## 8. Sources actually fetched

All four were downloaded as raw HTML and read directly, not summarised.

| id | what | URL | PD |
|---|---|---|---|
| S1 | Agrippa Bk I ch. xxiii–xxix, xliii–xliv (Freake 1651, ed. Peterson) | `esotericarchives.com/agrippa/agripp1b.htm`, `…/agripp1c.htm` | `pd-us` — published 1651 |
| S2 | Agrippa Bk II ch. x (Scale of Seven), ch. xxii (planetary tables) | `esotericarchives.com/agrippa/op2.htm`, `…/agripp2b.htm` | `pd-us` — published 1651 |
| S3 | Heptameron, weekday Considerations + §XXV hour tables (Turner 1655/1665, Lat. Marburg 1559, ed. Peterson) | `esotericarchives.com/solomon/heptamer.htm` | `pd-us` — published 1655 |
| S4 | Peterson's editorial apparatus (the swap, the two translation errors, the *ambra* gloss, the Zaphiel emendation) | in situ on the above | **in copyright — attributed claim, not reproduced** |

Cite-only, never quoted, not consulted in an authorized copy: **S5** Greer–Warnock (Adocentyn,
2010–11, 312 pp.), **S6** Attrell–Porreca (Penn State, 2019, xii+372), **S7** Pingree's Latin
edition (Warburg, 1986), **S8** Kieckhefer, *Forbidden Rites* (Penn State, 1997) — cited via
Peterson for CLM 849.

**S9** is the repo's own `planetary-magic.js` + `SOURCE-DATA.md` §4, treated as **tier C** and
audited against the primaries rather than used as evidence of what the Picatrix says.

---

## 9. Framing compliance, briefly

- **No verbatim Greer–Warnock or Attrell–Porreca**, anywhere, in any field. The Picatrix appears
  only as a cited node.
- **Quoted material is confined to short PD ingredient lists** from Freake 1651 and Turner 1655,
  which are `pd-us` on a stated mechanism and year (FRAMING §4.3).
- **Toxicity: existence and citation only.** Substance named; `quantity` and `processParam` null
  with stated reasons; `normalised: false`; no preparation step reproduced for any planet.
- **Conflicts kept, never merged.** Seven variants preserved with both sides attributed; no
  consensus row was constructed that no source states.
- **No efficacy claim.** Purposes are reported as the sources' claims. `honestLimits` says in the
  page's own voice that this system cannot claim the correspondences are real, cannot supply a
  recipe, and cannot tell the time.
- **Comparative claims carry `claimedBy`.** V2 and V3 are Peterson's philology, named as his.
  V4's internal inconsistency is claimed only as visible in the text, and says so.
