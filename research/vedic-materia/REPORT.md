# Vedic materia round — result

**2026-08-01.** Three tracks (graha samidha · nakṣatra-vanaspati · graha dhūpa),
fetcher → compiler → adversary each, under
[RESEARCH-PROTOCOL.md](../../docs/plans/horae/RESEARCH-PROTOCOL.md).
Governed by [FRAMING §11](../../docs/FRAMING.md).

## 1 · The measurement — recounted independently from the journal

```
verdicts                     52
REFUSED                      17
fabricationCount fields sum  14
```

| failure kind | round 1 | this round |
|---|---:|---:|
| **fabricated-citation** — a source never read | **15** | **0** |
| snippet-does-not-support — a real source over-read | — | 10 |
| invented-attribution | 13 | 3 |
| tier-inflation | 4 | 2 |
| fabricated-gap | 3 dossiers | 1 |
| unverifiable | 7 | 1 |
| merged-conflict | 9 | **0** |
| verbatim-copyright | 3 | **0** |
| efficacy-claim | 1 | **0** |
| **tradition-conflation** (added for this round) | — | **0** |

**The 17-vs-14 gap the integrator flagged as unexplained is resolved here.** It
reported that *"none of the three files says which three"* refusals were excluded
from the fabrication class. Recounting by kind answers it: the fabrication-class
kinds are `snippet-does-not-support` 10 + `invented-attribution` 3 +
`fabricated-gap` 1 = **14**. The other three are `tier-inflation` ×2 and
`unverifiable` ×1 — correctly *not* fabrication-class. Nothing was quietly
dropped.

**Do not read 27% (14/52) against round 1's 21% (28/132) as a regression.** The
denominators count different things — claims there, adversary verdicts here, and
several verdicts cover nine rows at once. The comparable figure is the one that
motivated splitting the roles, and it is **15 → 0**.

**What the remaining defects are.** Overwhelmingly precision, not invention: a
verse-count of three where the text says seven, a "heads" where the snippet reads
*second*, an "identical" where two witnesses differ by a particle. That is a
cheaper problem than round 1 had — and still a real one for a page that prints
"cited" beside every cell, because a reader who checks one number and finds it
wrong has no way to know the rest are right.

## 2 · The finding that matters most

**The conflation risk is not in the data. It is in the cell.**

All three dossiers kept samidha, vanaspati and dhūpa apart — `tradition-conflation`
is **0**. But the live cell in `assets/js/app/incense.js` is a **suffumigation**
cell keyed to the **planetary-hour ruler**, and only one of the three tracks fits
that shape:

| track | produced | fits the cell? |
|---|---|---|
| graha samidha | 18 rows, Tier A, five Sanskrit witnesses | **No** — samidha is homa *fuel*, not suffumigation |
| nakṣatra-vanaspati | 27 rows, Tier A names | **No** — indexed by lunar mansion, not by hour ruler |
| graha dhūpa | one substance for all nine grahas, plus a documented absence | **Yes — and it is a negative** |

A renderer that drops the samidha list into that cell would commit the exact
merge this round was convened to prevent — **at build time, out of three
individually clean files.** The empty cell's current copy names three absent
things; after this round it should name one absence and two category mismatches.

## 3 · Tier reality, stated rather than buried

68 rows ship: **48 Tier A · 0 Tier B · 20 Tier C.** That looks strong and is
misleading, because `tier` grades **the attribution of a plant NAME to a graha by
a named text at a named locus** — not the botanical identification, which is what
a page would print beside a Western plant name.

- **nakṣatra-vanaspati: zero Tier A binomials anywhere.** 8 of 27 rows carry one;
  all 8 are B or C. 19 are empty and the file forbids a renderer filling them.
- **samidha: 13 of 18 carry a binomial** — Monier-Williams 1899 (graded A, which
  is generous for a lexicon and flagged as such), Boddupalli & Sastri 2015 (B),
  IJCRT 2026 (C). Four are empty because Cologne returned 429/403, not because
  the tradition is silent.
- **dhūpa: 14 of 23 `botanical` fields are COMPILER-SUPPLIED** — the compiler's
  own gloss, correctly labelled in-field, attributed to no source.

**The graha↔name attributions are genuinely Tier A. The plant identifications are
not Tier A anywhere in this round.** Any page printing a binomial owes a tier
label on the *binomial*, not on the row.

## 4 · The best single decision in the round

**Jupiter's botanical cell is empty.** Every Tier A witness reads *pippala*, not
*aśvattha*; the ledger holds no entry equating them; so no *Ficus religiosa* was
written. That is the one cell where the well-known answer and the sourced answer
come apart, and the dossier refused it.

**Do not let a later round "fix" this.**

## 5 · Verdict

**Not fit to render as a filled cell.** The round did something better than fill
it: it established what the cell should say, and the dhūpa track's honest content
is a *documented absence* rather than a list.

The empty Vedic cell already shipping on the incense page remains correct. It
should be revised to distinguish "we have no source" from "that tradition answers
a different question".

Per-track: samidha **NEEDS-REWORK** (seven text edits, no new research) ·
vanaspati **NEEDS-REWORK** · dhūpa **NEEDS-REWORK**.

> The integrator's full report — per-track blockers, all contested points, and the
> numbered maintainer questions — is in this round's task output. The three
> dossiers and their notes are the tracked artifacts beside this file.
