# Vedic horā & Choghadiya — research notes, reasoning, gaps, open questions

Compiled 2026-08-01. Companion to `vedic-hora-choghadiya.json`. Research pass only — no
engine code, nothing under `assets/` or `pages/` touched.

---

## 0. The one-paragraph version

Two systems share one arithmetic input and have completely different provenance. **Horā**
is the jyotiṣa planetary hour: sunrise-bounded day, day arc ÷ 12 and night arc ÷ 12,
Chaldean order, first hour of the day = the weekday's lord. It is attested in a datable
Sanskrit primary text with a public-domain critical translation, and it is **arithmetically
identical** — not similar, identical — to the Chaldean planetary hour the repo already
computes in `planetary-hours.js`. **Choghadiya** is the eightfold day/night division of the
western-Indian pañcāṅga: same sunrise-bounded day, same weekday seed, same Chaldean step,
but eighths instead of twelfths, and seven names instead of seven planets. For horā I found
Tier A text. **For Choghadiya I found no primary text at all**, and that confirmed gap is
the most important thing in this dossier.

---

## 1. What I actually did

Every source in the JSON marked `fetched: true` was opened in this session. The two
substantive claims that could be checked by computation were checked by computation rather
than asserted, with throwaway scripts under the session scratchpad:

- `verify-chog.mjs` — takes the repo's own `CHALDEAN` and `VARA_LORDS` constants, applies my
  derived day and night stepping rules, and compares the result cell-by-cell against the
  published 7×8 day table and 7×8 night table transcribed from mpanchang. Result:
  **`PASS: derived rules reproduce all 112 published cells`**. It then reconstructs the
  boundary times of three dated published tables from their own printed sunrise/sunset.
- `verify-hora.mjs` — same idea for the horā: reconstructs all 24 lords and all 25 boundaries
  of drikpanchang's New Delhi 2026-08-01 table. Result: **lords PASS, day boundaries PASS,
  night boundaries PASS**, exact.

I am recording that these were *run*, not *reasoned about*, because a stepping rule that
looks right and is off by one on Thursdays is exactly the defect this project exists to not
ship. The two scripts are reproducible from the JSON alone; they are not part of the
deliverable and were not copied into the repo.

Node on this machine is `C:\Users\mehta\.conda\envs\astro-workbench\node.exe` (there is no
system Node) — noted for whoever writes the phase-2 test.

---

## 2. Horā — the findings, and how far each is load-bearing

### 2.1 The primary text, and why this one

The locus is **Sūrya-Siddhānta xii.78–79**. I went looking for it because the Wikipedia
"Vāra (astronomy)" article pointed at it, then fetched the full OCR of Burgess's 1860
translation from the Internet Archive and read the passage in place rather than trusting the
pointer. That mattered: the wording Wikipedia gives ("The Lords of the days are to reckoned
in order fourth from Saturn downwards…") is **not Burgess's**, and Wikipedia does not say
whose it is. Burgess's actual rendering, on p. 252, is in the JSON as a PD quotation. If the
site had cited "Burgess" for Wikipedia's wording it would have mis-attributed a translation.

The Sanskrit, from vedaseek's edition of the same verses, is
`horeśāḥ sūryatanayād adho'dhaḥ kramaśas tathā` — "the lords of the horās, from the son of
the Sun [Saturn], likewise in successive downward order." That is the Chaldean sequence
stated as a rule, in a primary text, and it is what makes the horā a Tier A datum where
Choghadiya is not.

Two supporting loci matter for the engine:

- **xii.31** gives the seven planets in order of distance from the earth — Saturn, Jupiter,
  Mars, Sun, Venus, Mercury, Moon. That is byte-for-byte the repo's `CHALDEAN` constant in
  `astro.js:26`. The repo's array is already the Sūrya-Siddhānta's array.
- **i.51–52 and its notes** carry the derivation that closes the loop: assign the 24 hours in
  succession through that order and the 25th hour — the first of the next day — lands on the
  next weekday's lord, so the day is named for the planet owning its first hour. The note
  refers this to Ideler's *Handbuch der mathematischen und technischen Chronologie* i.178 ff.
  This is the identity `first horā = vāra lord`, which is exactly what `planetaryHour()`
  implements with `CHALDEAN.indexOf(dayRuler)`.

**PD status.** Published 1860 in *JAOS* vol. VI; term long expired; well under FRAMING §4.3's
1930 threshold. Quotable, and the JSON quotes it — bounded, two verses plus one note
sentence, with locus and edition.

**Two honesty flags on the quotations**, both recorded in-data rather than silently fixed:
the OCR damaged three characters in the verse text (`tne`→`the`, `hard)i`→`(horā),`), which I
normalised and disclosed; and the Greek word ὥρα is garbled in the scan at the point where
Whitney's note needs it, so I restored it in brackets from the same word's legible occurrence
in the Concluding Note and said so. No word was supplied.

### 2.2 Same arithmetic, or merely similar? — **the same, and it is checkable**

The brief asked for a ruling on this. The answer is *identical*, on five independent axes:

| | jyotiṣa horā | repo `planetary-hours.js` |
|---|---|---|
| day start | local sunrise | local sunrise |
| division | day arc ÷ 12, night arc ÷ 12, unequal | same |
| order | Saturn→Jupiter→Mars→Sun→Venus→Mercury→Moon | `CHALDEAN`, same array |
| seed | first hour of day = weekday lord | `CHALDEAN.indexOf(dayRuler)` |
| sunset | sequence continues unbroken | same |

And it is not an argument from tables of correspondences — I ran the repo's constants against
a published jyotiṣa horā table and got all 24 lords and all 25 boundaries exact. **Phase 2
needs no second code path.** One hours engine serves the Hellenistic hour and the Vedic horā;
what differs is the naming, the attached qualities, and the uses — not the clock. That is
itself a publishable finding for the comparison page, and it is a *computational* finding,
which is the category this site treats as checkable.

The `hoursTable()` function already returns everything a horā view needs. The only thing it
does not do correctly for a jyotiṣa presentation is the **vāra**: `hoursTable` takes the
weekday from `sunrise.getUTCDay()`, whereas `muhurta.js` already established (its VĀRA
CORRECTION header) that the vāra should be the weekday of the *local civil date* of the
sunrise, approximated by longitude. For India that is a real difference — sunrise at ~06:00
IST is ~00:30 UTC, so `getUTCDay()` happens to agree; but it will not agree everywhere, and
the muhūrta module already solved this. Phase 2 should reuse `muhurta.js`'s `sunriseWeekday`
rather than re-derive.

### 2.3 The transmission question — a real disagreement, printed in one volume

This is the best §1.3 material in the dossier and I want to flag how lucky it is.

Whitney's note to xii.78–79 (pp. 252–253) says the name horā "is the Greek [ὥρα], betraying
the source whence the whole system was introduced into India." That is not a hedged remark —
it is a whole-system transmission claim, from a major philologist, in the standard
nineteenth-century edition. Modern scholarship agrees: Gansten (Brill, 2020) treats horā as a
Greek loanword within the Hellenistic transmission into Indian horoscopy, resting on Pingree.

And **Burgess, the translator of the very volume, dissents in it.** His "Concluding Note by
the Translator" (pp. 382 ff.) opens by saying his investigations led him to opinions differing
from Whitney's, and point 4 argues the priority lies between the Hindus and the Chaldeans
rather than with the Greeks; that the few Greek and Arabic terms were late introductions; that
Greek/Sanskrit shared vocabulary may descend from a common source; and he cites Herodotus
II.109 — that the Greeks received the twelvefold division of the day from the Babylonians —
against a Greek origin for the hour itself.

So the site can print a genuine, attributable, contemporaneous scholarly disagreement,
**both halves of it public domain and quotable**, on the exact question the comparison page is
about. Rule 4 is satisfied without any work.

I have escalated rather than decided the editorial question: Burgess's dissent is 166 years
old and the field went the other way. My recommendation in the JSON is *print both, date both,
say the modern consensus follows Whitney, do not delete Burgess* — because quoting a
volume's translation while suppressing that volume's translator's dissent is selective
quotation, and this site's whole identity is refusing the true-but-misleading construction.
But that is the maintainer's call.

### 2.4 The etymology, and the register problem

The tradition derives horā from *ahorātra* ("day-and-night") with its first and last syllables
dropped — BPHS 4.1–2. Contemporary almanacs still print this in their own voice; drikpanchang's
horā page does. The philological objection is that the derivation violates Sanskrit
word-formation rules.

Two cautions, both in the JSON:

1. **I did not open BPHS.** The locus 4.1–2 is carried *as reported by Wikipedia*. Someone
   should verify it against a real edition or the claim should be struck. Citing a verse
   number I have not seen would be exactly the "this book surely covers it" failure Rule 7
   names.
2. **The objection is unattributed.** Wikipedia states it without naming a scholar. Under
   §2.4 that fails `claimedBy` and cannot render as a scholarly position until someone names
   one. Gansten's loanword statement *is* attributable and can carry the weight instead.

There is also a register question I cannot settle alone (§5, living traditions): the ahorātra
derivation is the tradition's own account of its own vocabulary, still in daily use. Printing
the consensus against it is required by §1.3; printing it in a way that reads as correcting
a superstition is the exoticising register §5 forbids. Flagged for a human.

### 2.5 The three senses of *horā* — a trap for phase 2

Practitioner sources conflate these constantly and the page must not:

- **horā = the planetary hour.** What this dossier documents. Attested SS xii.79.
- **horā = the D-2 varga**, the half-sign, in the standard divisional-chart scheme.
- **horā-śāstra = the predictive branch of jyotiṣa** — the sense in the *title*
  *Bṛhat Parāśara Horā Śāstra*, and the sense Wikipedia's "Hora (astrology)" article
  actually documents.

myzodiaq cites "Bṛhat Parāśara Horā Śāstra" as the authority for the planetary hour and gives
no chapter or verse — it is almost certainly reasoning from the word in the title. I kept that
page in the sources deliberately, marked as a **negative control**: it also states the Chaldean
order ascending (Moon…Saturn) and then works its own example descending, contradicting itself
inside one page. It is the cleanest available evidence for why Tier C attribution of this
material cannot be trusted, and it is cited for that and nothing else.

I did **not** find a BPHS locus for the planetary hour, and I am careful in the JSON not to
say there is none — only that the sources invoking BPHS supply none.

---

## 3. Choghadiya — the tables, the derivation, and the hole where the source should be

### 3.1 The starting-index table (the thing the brief asked for)

Base cycle, day order, index 0–6:

`Udveg(Sun) → Chal(Venus) → Labh(Mercury) → Amrit(Moon) → Kaal(Saturn) → Shubh(Jupiter) → Rog(Mars)`

That is the Chaldean order rotated to begin at the Sun. Starting indices into it:

| weekday | idx | day start | night start |
|---|---|---|---|
| Sunday | 0 | **0** Udveg | **5** Shubh |
| Monday | 1 | **3** Amrit | **1** Chal |
| Tuesday | 2 | **6** Rog | **4** Kaal |
| Wednesday | 3 | **2** Labh | **0** Udveg |
| Thursday | 4 | **5** Shubh | **3** Amrit |
| Friday | 5 | **1** Chal | **6** Rog |
| Saturday | 6 | **4** Kaal | **2** Labh |

Stepping: **day advances +1** through the base cycle per slot; **night advances −2**. Eight
slots over a seven-name cycle means slot 8 always repeats slot 1 — every published table shows
this and it is not a printing error.

Equivalently, in the repo's own constants, with `c0 = CHALDEAN.indexOf(VARA_LORDS[wd])`:

- day slot *k* → `CHALDEAN[(c0 + k) mod 7]`
- night slot *k* → `CHALDEAN[(c0 + 5*(k+1)) mod 7]`

The day rule is the horā recurrence exactly. The night start is equivalently "the lord of the
fifth weekday counted inclusively from today" — `VARA_LORDS[(wd + 4) mod 7]`.

**Provenance discipline on the above.** The *tables* are the sourced datum (mpanchang's 7×8
grids, cross-checked against three dated drikpanchang tables and astrosage's Saturday). The
*closed forms and the stepping rules are my derivation.* No source consulted states them in
words — the almanacs print the grid and explain nothing. I verified the derivation against all
112 cells, and the JSON labels it `DERIVED, NOT SOURCED` in both places it appears. Phase 2 may
implement the closed form (it is cheaper and it is proven equivalent), but the page must
attribute the *table*, not the formula.

### 3.2 Name→planet mapping

`Udveg=Sun, Chal=Venus, Labh=Mercury, Amrit=Moon, Kaal=Saturn, Shubh=Jupiter, Rog=Mars`,
explicit at mpanchang. drikpanchang does not print a mapping but its benefic/malefic grouping
(Venus and Mercury benefic; Sun, Mars, Saturn malefic; Moon and Jupiter benefic) is consistent
with it. This mapping is what makes the base cycle legible as the Chaldean order; without it
the seven names look arbitrary.

### 3.3 The confirmed gap — say it out loud

**No primary text was found for Choghadiya.** I looked:

- Wikipedia's article has maintenance banners from 2012 and 2023 and exactly one reference —
  *Encyclopaedia of Buddhism: Glossary of Buddhism Terms* vol. 21 (APH, 2005), p. 87. A
  Buddhist glossary, cited for a Hindu almanac division.
- drikpanchang, mpanchang, astrosage and shubhpanchang give etymology and tables and **no
  source text, no author, no date**.
- Targeted searching against the named Sanskrit muhūrta corpus (*Muhūrta Cintāmaṇi*,
  *Muhūrta Mārtaṇḍa*) returned the texts but no attachment of Choghadiya to either.
- Every "rooted in ancient Vedic texts" phrase I encountered was practitioner assertion with
  no locus. One page asserted "at least several centuries of continuous use" with nothing
  behind it; I did not carry it.

This is a good result, not a failure — it is a confirmed gap, and per Rule 1 the cells stay
visibly empty. The practical consequences for phase 2 are concrete: **every Choghadiya row
ships Tier C**, the page states plainly that no primary attestation was located, and the
comparison view must not let a Tier A horā row lend its dignity to a Tier C Choghadiya row
sitting next to it (FRAMING §5, C-6's "evidential dignity" failure). Whether the tier badge
alone is enough, or whether Choghadiya needs a standing note on the comparison view itself, is
escalated to the maintainer.

The one substantive provenance datum anybody gave me: astrosage records that Choghadiya is
used **mostly in the western states of India**. That is consistent with the Gujarati/Marathi
almanac tradition the name comes from, and it is a reason to think a primary attestation may
exist in *vernacular* pañcāṅga literature this pass could not reach — a reason to keep
looking, never a reason to imply attestation now.

### 3.4 The 96-minute trap

"Cho-ghaḍiyā" = four ghaḍī = 4 × 24 = 96 minutes, and Wikipedia's lede even fixes the period
at 98 minutes. **Every published table divides the arc by 8 instead.** drikpanchang says so
outright: the sunrise-to-sunset span of 30 ghaṭī is divided into 8, i.e. 3.75 ghaṭī, and "four
ghaṭī" is admitted as an approximation. A literal 96-minute block gives 7.5 slots in a
12-hour day and a ragged remainder that no almanac prints. I recorded this as variant
`V1-choghadiya-nominal-96min` specifically because it is the mistake the etymology invites and
an implementer following Wikipedia's lede number would ship it.

### 3.5 Something I found and deliberately did not characterise

mpanchang labels some of its slots `Kaal Kaal Vela`, `Labh Vaar Vela`, `Kaal Vaar Vela`,
`Labh Kaal Ratri`. That is a **second doṣa layer riding on the same eightfold grid** —
Kālavelā / Vāravelā / Kālarātri — and drikpanchang and astrosage print no such layer. I did
not establish which octants they occupy on which weekdays and I did not guess. It is flagged
as variant `V3` and as a gap so phase 2 does not mistake those compound labels for Choghadiya
name variants. Given that the repo already carries Rāhu-kāla / Yamaghaṇṭa / Gulika octant
tables, this is most likely a fourth member of that same family and belongs to whoever revisits
`muhurta-data.js`, not to this dossier.

---

## 4. Golden values — and the one thing phase 2 must get right about them

Five are in the JSON. **GV1 (Choghadiya, Ahmedabad, Saturday 2026-08-15) is the primary one**
and it is unusually clean: day arc 776 min ÷ 8 = **97 min exactly**, night arc 664 min ÷ 8 =
**83 min exactly**. All eighteen boundaries and all sixteen names reproduce with zero rounding
ambiguity. **GV2 (horā, New Delhi, Saturday 2026-08-01)** is equally clean: 24 lords and 25
boundaries exact under round-half-up. GV3 pins a non-Saturday (Wednesday) so the weekday offsets
are actually tested and not just the one column Saturday exercises.

**The methodological point, which is load-bearing.** These tests must **feed the published
sunrise and sunset in as inputs**, not re-derive them from Astronomy Engine. Two reasons:

1. It is the *division rule* under test here. The ephemeris is tested elsewhere. Coupling them
   means a one-minute sunrise difference fails a Choghadiya test, and the failure message
   points at the wrong module.
2. Published almanacs disagree with each other about sunrise. GV5 exists precisely to record
   this: for New Delhi on 2026-08-01, drikpanchang gives 05:42/19:12 and mpanchang gives
   05:45/19:07 — same date, same city, ~3 and ~5 minutes apart, and **neither page states its
   solar-disc or refraction convention**. They agree completely on the rule and on the names
   and disagree on the argument to it. GV5 asserts the name agreement and asserts *that the
   boundary disagreement exists*; it must not average them or pick a winner.

Related: drikpanchang publishes to whole minutes but computes to seconds, so reconstructing its
interior boundaries from its own *displayed* whole-minute sunrise can land ±1 minute off when
the arc does not divide evenly. That happens on four of GV3's night boundaries and two of GV4's
day boundaries, and it is a display artifact, not a disagreement about the rule. Those rows are
marked ±1 minute in the JSON. **Do not chase it** — and do not "fix" it by inventing a
truncation convention, because the same publisher's other tables round the other way. GV1 and
GV2 exist so the suite has cases with zero tolerance.

---

## 5. Polar behaviour

No source addresses it — not the primary text, not the scholarship, not one almanac. Both
systems are defined exclusively by sunrise→sunset and sunset→next sunrise. Above the Arctic
and below the Antarctic circles around the solstices, neither arc exists and there is no
attested fallback, because none of these traditions was formulated for those latitudes.

**Refuse.** The repo already does exactly the right thing: `planetaryHour()` returns `null`
when `SearchRiseSet` finds no event, and `muhurtaReport()` surfaces an explicit "polar day or
night — the division is undefined there" error. Reuse that. Do not substitute civil midnight,
do not substitute a nominal 12-hour arc, do not interpolate from a neighbouring date. Each of
those would be inventing a rule and attributing it to the tradition.

The subtler failure, which I want on the record because it **degrades silently instead of
erroring**: at high but sub-polar latitudes the day arc can fall under two hours, at which
point the eight Choghadiyas are twelve-minute slots and the twelve day-horās are under ten
minutes each. That is arithmetically well-defined and completely unattested. A UI that prints
it without a warning is manufacturing usage no source sanctions. My recommendation is a
declared arc-length threshold below which the view says "outside all attested usage" — but the
threshold is an editorial choice and I have not invented a number for it.

---

## 6. Open questions for a human

1. **How much weight does Burgess's 1860 dissent get** against the modern consensus? (§2.3.)
2. **Register for the ahorātra etymology** — how to print the philological consensus without
   writing a living tradition's account of its own vocabulary off as error. (§2.4, FRAMING §5.)
3. **May the horā/Choghadiya arithmetic identity be shown at all?** I verified it across 112
   cells; it is true and checkable and *nobody has published the comparison*. FRAMING §2.4 says
   where no scholar has made the comparison there is no row. My reading is that a purely
   arithmetical, self-verified, `direction: 'unknown'` structural note with an explicit "no
   source asserts a historical relationship" line is permissible where a transmission claim is
   not — but that is exactly the judgement §2.4 reserves, so I escalated rather than decided.
4. **Tier asymmetry in the comparison view** — is a tier badge enough next to a Tier A row, or
   does Choghadiya need a standing note? (§3.3.)
5. **Chal or Chara; cala or cara?** Sources print Chal, Char and Chara without comment, and
   drikpanchang grades it Neutral where four other sources count it among the auspicious four.
   Display decision, not a truth decision, but it needs making.

## 7. Verification debts someone should clear

- Open a real **BPHS** edition and confirm or strike the 4.1–2 ahorātra locus.
- Read **Pingree** directly for a horā-specific page reference; the loanword claim currently
  reaches us at one remove through Gansten.
- Obtain **Dikshit, *Bharatiya Jyotish Shastra* Part I, p. 138** — cited by Wikipedia as its
  authority for the horā/weekday derivation. Marked `fetched: false` in the JSON; nothing in
  the dossier rests on it.
- Search **vernacular Gujarati/Marathi pañcāṅga literature** for a Choghadiya attestation.
  This pass reached only English-language material and the gap may be an artifact of that.
