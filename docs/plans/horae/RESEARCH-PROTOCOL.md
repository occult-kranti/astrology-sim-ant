# THE RESEARCH PROTOCOL — why round 1 fabricated, and what changes

> Written after Horae Mundi phase 1 returned six dossiers, none usable.
> The maintainer's ruling: **fix the fabrication problem before trusting any of
> the data.** This document is that fix. It applies to every research round in
> this repo, not only to Horae Mundi.

---

## 1 · The measurement

Re-derived from the run's own journal, not from its summary:

```
verdicts total   132
accepted          77
rejected          55   (42%)

  fabricated-citation   15  ┐
  invented-attribution  13  ┘  28 = 51% of rejections, 21% of ALL claims
  merged-conflict        9
  unverifiable           7
  tier-inflation         4
  verbatim-copyright     3
  (no kind set)          3
  efficacy-claim         1
```

**One claim in five was pinned to a source that does not support it.** Not
wrong facts — mostly *right facts with invented provenance*, which is worse,
because the claim survives spot-checking while the citation rots underneath it.

Three further findings from the round:

- **Three of six dossiers fabricated a CONFIRMED GAP** — asserted "nothing
  attests this" without having looked. A fabricated gap is worse than a
  fabricated row: a missing row invites a search, a confirmed gap closes it.
- **Four of six shipped a machine-readable field contradicting the prose beside
  it.** A renderer reads the field, not the caveat.
- The verifier itself set `failureKind` to `none` on 3 rejections, so even the
  audit layer leaked.

---

## 2 · The root cause

The round-1 prompt said, in bold, the right thing:

> *"Every citation needs a locator someone can follow: a URL you actually
> fetched... You must have SEEN the source say the thing."*

**And then nothing checked it.** The agent self-reported `fetched: true` and
wrote a locator string. Both fields are free text produced by the same process
that produced the claim. A citation recalled from training data and a citation
read off a fetched page are *indistinguishable in the output format*.

So the instruction was an honour system, and the schema made compliance
optional. **This is the same defect as the witness-count collapse and the
dangling `atlasSlug`: a machine-readable field asserting something no mechanism
verified.** The repo keeps finding this shape. It is worth naming as a class:

> **A field that records a claim about evidence is not evidence. If nothing can
> fail when the field is wrong, the field is decoration.**

---

## 3 · The four changes

### C1 — Evidence artifact, not assertion  *(schema-enforced)*

Every claim carries a **`snippet`**: the actual words from the source that
support it, ≤ 25 words, plus the URL fetched and where on the page it sits.
`snippet` is `required`. A claim without one is **dropped, not downgraded** —
downgrading preserves the claim and loses only the confidence, which is exactly
backwards.

Twenty-five words keeps the snippet inside fair quotation for verification
purposes even where the source is in copyright; it never reaches the shipped
data, only the research file.

### C2 — A gap carries the same burden as a claim  *(schema-enforced)*

`gaps[]` becomes objects, not strings:

```
{ claimedAbsent, searchedWhere[], searchTermsUsed[], whatWasFound, confidence }
```

"I could not find X" is only publishable with *where you looked*. This is the
direct fix for three dossiers inventing a settled absence.

### C3 — Split the fetcher from the compiler  *(structural — the load-bearing one)*

Round 1 had one agent search **and** write. That agent could emit a citation
from memory and dress it with a plausible locator at zero cost.

Now:

- **FETCHER** retrieves and quotes only. It returns a *source ledger*: URL,
  fetch outcome, and verbatim snippets. It makes no claims about the subject.
- **COMPILER** builds the dossier and **may cite only snippet IDs the fetcher
  returned.** It cannot introduce a source.
- A mechanical check rejects any `sourceRef` absent from the fetcher's ledger.

Fabrication now requires forging a *prior agent's artifact* rather than writing
a plausible string — and the mechanical check catches that too.

### C4 — Field and prose may not disagree  *(mechanical)*

A validator over each dossier: if a note contains a hedge
(`unattested`, `uncertain`, `not verified`, `approximate`, `disputed`) while the
field beside it states a bare value, that pair is a failure. The renderer reads
the field; the caveat must live *in* the field or the row does not ship.

---

## 4 · What does NOT change

The adversarial pass stays, and stays instructed to default to rejected. It
worked: it caught 55 problems including a paraphrase presented as a quotation.
**It is not the weak link — the input to it was.**

Two cautions, both learned this round from checking the verifier's own output:

- **The adversary over-rejects, and that must be verified too.** Its "hard
  blocker: Parker 1950 quoted verbatim" did not survive checking — the
  substantive quotation was Budge 1905, correctly identified as public domain
  and correctly quoted. Rejections need spot-checking exactly like acceptances.
- **An auditor can commit the error it audits for.** The materials dossier's
  opium finding is real pharmacology (Agrippa I.xliv names black poppy *seed*;
  opium is the latex of the unripe capsule) but it was aimed at a repo value
  that cites **Picatrix III.7, not Agrippa** — a merged-conflict error committed
  while auditing for merged-conflict errors.

---

## 5 · Ruling carried forward

**The grid is asymmetric and the absence is taught** (maintainer, 2026-08-01).
Of six systems, one has a Tier A ruler column (Vedic horā), one Tier C
(Choghadiya), and four — Babylonian, shichen, zmanim, Egyptian — have none and
must not render one. The Egyptian dossier currently fills that column with
Amduat hour-goddesses on a system whose own scope note says it has no rulers;
that must be emptied before build.

The asymmetry is the teaching, not a defect to design around: **the shape of
the table is itself a finding about the traditions.**
