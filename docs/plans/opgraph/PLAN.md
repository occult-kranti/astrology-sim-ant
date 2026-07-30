# THE OPERATIVE-CONTENT GRAPH — one buildable plan

**Round:** R33 synthesis · **Written:** 2026-07-30 · **Repo tip at writing:** `89e2622` (R32), tree clean.
**Status:** specification. Nothing in this document is shipped. It is the single input to the Opus build round.

**Inputs this plan synthesises** (all in the R33 scratchpad, all read in full):
`00-frame-karpathy-and-v2.md` (Karpathy-reference resolution + v2 mandate map) ·
`01-repo-closed-corpus.json` + notes (prior art, charter, duplication blacklist) ·
five audited research slices `10-indian-tantra.json`, `11-greco-egyptian.json`,
`12-solomonic-western.json`, `13-east-asian.json`, `14-abrahamic-esoteric.json` ·
`20-hostile-audit.md` (**8 strikes, binding — a struck record does not enter the graph**).

**The one-sentence version.** 105 works, 306 procedure rows and 459 typed edges of audited research
become a second, separate graph — never written into `confluence.js` — in which the *relation* is a
first-class node carrying its own type, completeness grade, evidence and citation; the graph is
rebuilt by a tracked idempotent script from a curation gate that computes weights from witnesses;
and the picture is a deterministic layered DAG whose every visual fact is also a table row.

## DECISION REGISTER — the fourteen rulings this plan makes

Each is a place where the inputs left a choice open, disagreed, or asked the synthesizer to rule.

| # | decision | where | why |
|---|---|---|---|
| D1 | **The relation is a node.** 301 procedure-claims + 92 relation-claims are op-nodes; there is never a work→work claim edge. | §2.1.5–6 | micrograd's op-node interposition, and the data is already op-node-shaped |
| D2 | **Procedures hang off works and work-segments only** — with one qualified exception, `kind:'practice-corpus'`, for the Naqshbandī rule-set and the Lurianic corpus. | §2.1.1 | three slices ruled this independently; the exception stops a fictional book-node |
| D3 | **53-term controlled vocabulary in 13 families; 27 occupied, 26 declared empty with warrants.** Re-typing is a research act — `typeAsFiled` is immutable and `retypePending` is explicit. | §2.4 | the generator must never silently retype |
| D4 | **Three completeness axes** (`repoCoverage` / `textCompleteness` / `witnessCompleteness`), **five grades** (+`unstable-plural`), **mandatory `completenessBasis`**, **mandatory `incompletenessKind`**. | §2.5 | strike E3 + the Pandit and Turner-1657 findings |
| D5 | **`null` + `gradeWithheld` is a first-class result**, not a gap. | §2.5 | withholding costs nothing; asserting `complete` about an unopened book is the round's most quotable error |
| D6 | **`asserted:false` is a first-class field**, and a non-asserted claim renders **struck with its reason on the face**, never hidden. | §2.1.6 | audit recommendation 2 — otherwise the audit evaporates on the next pass |
| D7 | **`RECONSTRUCTED_THROUGH` is a separate relation**, excluded from the ranking DAG. | §2.1.6 | philological dependency and historical transmission run in **opposite** directions and need two arrows (strike E2, generalised) |
| D8 | **Split the Dee node; split PDM xiv into recto/verso segments.** | §2.3 | removes the only self-edge, which is what makes acyclicity assertable |
| D9 | **`flagFactor` joins the weight rubric** (1.0 / 0.7 unverified / 0.0 do-not-quote). | §3.2 | mechanises B3 and B4, and stops flag-laundering by arithmetic rather than by memory |
| D10 | **Amendment B: the generator strips at write time; the scan is the backstop.** | §3.4 | two independent detectors, one constructive |
| D11 | **Non-force deterministic layered DAG. X = transmission rank, not calendar year.** | §5.2 | the atlas owns time; rank is a different fact, and rank-vs-year disagreement is a finding |
| D12 | **The default view is a focus subgraph, not the whole graph**, with a hard 140-node cap and a visible counter. | §5.6 | 623 nodes cannot be drawn honestly at once, and saying so beats shipping a hairball |
| D13 | **The ledger is the accessible representation and is default at ≤680 px and in print**, and AT parity is machine-asserted against the layout. | §5.7 | parity that is not asserted is parity that drifts |
| D14 | **Only `opgraph.js` goes behind the artery this round.** `confluence.js` and four other generated modules stay severed — a named deferral (B12). | §4.4 | reconstructing four scratchpad generators badly would rewrite byte-stable shipped data |

---

# §1 THE CHARTER

## 1.1 What this graph is

The **operative-content graph** answers one question the site has never been able to answer:

> *What does this text tell an operator to do, how completely does it say it, and where did that
> sequence come from?*

It has exactly three claim dimensions, and each is genuinely new to this repo:

1. **TYPE** — which *procedure-kinds* a work contains, from a controlled vocabulary (§2.4).
2. **COMPLETENESS** — how complete the account is, on **three separate axes** (§2.5), each with a
   named **basis** and a verbatim **evidence** sentence.
3. **PROPAGATION** — how a *procedure*, not a book, moved. This is a strictly stronger claim than an
   influence edge and needs its own citation. The repo currently contains **exactly one** such claim
   (`amrtasiddhi → dattatreyayogasastra`, Mallinson 2020, which names mahāmudrā / mahābandha /
   mahāvedha). That edge is the schema exemplar and the standard every propagation claim is held to.

## 1.2 What this graph is NOT — the atlas boundary

The Great Confluence (`assets/js/core/data/confluence.js`) is a **transmission map**: 190 entries in
nine frozen lanes, 155 typed edges, each edge claiming only that one thing was demonstrably read,
rendered, answered or absorbed — *"the atlas plots INFLUENCE, never validity."* Its 91 `technique`
fields are one prose sentence apiece: **untyped, ungraded, unsegmented**, and hung indiscriminately
on text, person, event, institution and translation nodes.

**The operative graph must not restate the atlas.** Off-limits, inherited verbatim from the closed-corpus
charter and its duplication blacklist:

- transmission / influence claims as such (the 155 edges own them);
- dating, place, date-certainty, and the 54 contested blocks;
- per-work public-domain verdicts for the 35 Great Works (`pdStatus` / `pdSources` / `quoteSafe`);
- entry epistemic labels; the nine-lane roster;
- the fourteen blacklist items (Gheraṇḍa ch.3, HYP ch.3, the Yoga Sūtras, MN 118, Dhammapada/Metta/Heart,
  the ṣaṭkarman variable system, the 18 saṃskāras, Agrippa's 27 chapter blocks + 7 verified kameas,
  Picatrix III–IV, Corpus Hermeticum I–XVIII, the Enochian system, the atlas itself, the 133
  practitioners, the r29 384-work catalogue with its 15 licence and 10 dating corrections).

**The audit made this binding.** Strike D1 demoted two `event-shangqing-revelations` edges to
`crossReferenceOnly` because they re-derived shipped atlas edges *with no operative-content addition*.
The contrast that defines the line is `cantong-qi → wuzhen-pian`, which is **also** already shipped and
**survives** — because it names the borrowed thing (the fire-phase timing schema, i.e. procedural
grammar) and thereby upgrades a work-level influence claim to a procedure-propagation claim.

> **THE RE-TOUCH RULE.** Re-touching a shipped atlas relation is legitimate **if and only if it changes
> what the relation claims** — from "A influenced B" to "procedure P moved from A to B, and here is the
> witness." Anything less is duplication and is struck.

**Nothing in this program writes to `confluence.js`** (blocker B8). The atlas is at its capacity
tripwires: `confluence × global` sits **at** the WARN line (21), and the `alchemy-west ↔ confluence`
corridor is at 13 of a 16 FAIL cap with all three remaining seats already allocated by the r29 plan.

## 1.3 The join key

**The join key is the Confluence `slug`, verbatim.** Every work that exists in the atlas carries its
atlas slug in `atlasSlug`; the rest mint a namespaced id and set `atlasSlug: null` +
`atlasNeeded: true|false`. Namespaces in use: `tan:` `gem:` `gw:` `ea:` `jew:` `isl:` `theu:` `abh:`
`rasa:` `gwe:` `div:` `coll:` `au:` `cul:` `proc:`.

On that key the two graphs cross-link and **neither owns the other**. The atlas page gains an
"operative content" cross-link where `atlasSlug` matches; the operative page gains an "in the atlas"
cross-link. No data flows between the modules in either direction — the link is an `href`.

Three join facts already settled by the research, to be honoured and not re-derived:

- `Mantramahodadhi` (abhichara wing) ≡ `Mantra Mahodadhi` (vedic-remedies wing) — one work, two
  transliterations, two wings; the mechanism is **taraṅga 15**, the chapter of planetary and ṛṣi mantras.
- `PGM XIV` ≡ `PDM xiv` and `PGM XII` ≡ `PDM XII` (P.Leid. J 384) — the same manuscripts under two of
  Preisendanz's own sequences.
- Four Hekhalot work-nodes (`jew:hekhalot-rabbati`, `jew:sar-ha-torah`, `jew:maaseh-merkavah`,
  `jew:3-enoch`) all point at the **single** corpus-level atlas slug `hekhalot-literature`.
  **Do not create four atlas entries.**

## 1.4 THE OPERATIVE-CONTENT RAZOR — restated as the data contract

This is a *data contract*, not a style guide: it constrains what may exist in a field, and it is
machine-enforced (§7.3, assert R-SCAN).

**The graph MAY record:** that a procedure of a named kind exists in a named work; how many stages it
has; what those stages are *called*; where in the text it sits (chapter, paṭala, line-range, folio);
what is missing and how we know; who says so; what the hazard class is; and where the procedure came
from, with a witness.

**The graph MAY NOT record:** ordered executable sub-steps · quantities, proportions, temperatures,
**durations**, counts, repetitions or timings · mantra / bīja / logos / voces magicae / divine-name
strings in any script · drawable signs, charaktēres, seals, sigils, square-fillings or diagram
templates · substance lists for toxic, psychoactive or harm-capable material · second-person address
or imperative mood.

Two rules, both lifted verbatim from the research because they are the best formulations produced:

> **"Naming a stage is safe; ordering the sub-steps is not."** (slice 14)
> *"Five stages: purification, nyāsa, dhyāna, japa, homa" is a map. "The gates in this order" is a recipe.*

> **"Grading completeness never requires reproducing content."** (slice 14)
> Every `complete` in the corpus is justified structurally — the text enumerates and terminates; the
> edition prints witnesses synoptically; the construction is arithmetically checkable — never by
> quoting steps.

And one rule the audit's only razor strike forces into existence:

> **A COMPLIANCE SENTENCE IS NOT COMPLIANCE.** Strike R1 found a record asserting *"the durations,
> permitted foods, immersion counts … are deliberately NOT reproduced"* in the same sentence that
> reproduced the meal pattern — while two **other** records in the same file printed the duration
> ("the twelve-day enclosure regimen") the first swore it withheld. Therefore: the razor scan is
> **file-global, not record-local**; a withholding assertion in one record is checked against every
> other record in the module; and a record's own compliance prose earns it nothing.

**Ceiling, not floor.** Three shipped modules sit at the razor's outer edge and are named so no agent
mistakes them for licence: `kameas.js SIGIL_METHOD_NOTE` (a four-step sigil-tracing method, honestly
framed and sourced to Nowotny 1949); `vedic-remedies.js` (actual bīja and nāma strings with japa counts);
`picatrix-prayers.js` (prayer excerpts, angel and spirit names, the Perfect Nature frame). Each is
recorded in this graph as *"contains procedure-kind X, repoCoverage: complete"* **without restating any
step**, and **none of them is precedent for a new corpus.** If an agent cites them as precedent, refuse.

**Ethics exclusions, inherited and non-negotiable:** Order of Nine Angles — **total exclusion**, not even
a museum record · Yezidi material — **excluded, this program** · `magicgatebg.com` — pirate mirror,
discovery index only, never cite or ingest · Necronomicon — hoax label mandatory · Grand Grimoire —
one-line record only, expansion requires explicit operator sign-off.

**Framing lock, inherited from the atlas header:** techniques are **described as historical practice,
never prescribed**. Efficacy is asserted nowhere. Where a text claims a result — the Netratantra
conquering death, the Mithras Liturgy claiming *apathanatismos*, a ṣaṭkarman claiming a worldly effect —
the claim is attributed to the text and left there.

---

# §2 THE TYPED SCHEMA

## 2.1 Node types (6)

Every node carries the **common envelope**:

```
id            string, namespaced, /^[a-z0-9]+:[a-z0-9-]+$/ or a bare confluence slug
type          'work' | 'author' | 'culture' | 'procedure-type' | 'procedure-claim' | 'relation-claim'
label         display string (no markup)
weight        number 0..1, 2dp — COMPUTED by the gate, never hand-written (§3.2)
witnesses     integer >= 0 — count of independent witnesses behind the weight
gateRound     'R33' — the round that admitted it
sources       [sourceId, …] — every id resolves to OPGRAPH_META.sources
```

### 2.1.1 `work` — 103 nodes

The procedure-*bearer*. **Procedures hang off works and work-segments only** — this is a ruling, taken
from three slices independently:

- slice 10: all 90 of its procedure rows hang off works; nothing needed a person/event/institution node;
- slice 11: Preisendanz's numbering both **splits** one book (PGM II + VI) and **bundles** multiple
  recensions (PGM XIII holds two or three versions of the Eighth Book of Moses) — so "work" must mean a
  **codicological unit with a shelfmark**, not a corpus numeral;
- slice 01: the two mis-attributions in shipped data are exactly what happens without the rule — the
  Mevlevi samāʿ hung on the *Masnavī* (it was codified after Rumi's death by Sultan Walad), and
  `event-golden-flower-1929`, a *translation* node, restating the work's technique nearly verbatim.

Slice 14 forces one qualified exception, accepted: two of its highest-value procedure-bearers are not
books — the Naqshbandī *kalimāt-i qudsiyya* (a rule-set across many texts with no single edition) and
the Lurianic material (disciple-redactions of a man who wrote almost nothing). Forcing either into a
fictional book-node falsifies the record. **Resolution: `kind` on the work node**, not a person-node
attachment:

```
kind          'work' | 'work-segment' | 'practice-corpus' | 'collection'
atlasSlug     string | null            — THE JOIN KEY
atlasNeeded   boolean                  — true if it deserves an atlas entry it lacks
titleOriginal string | null
dateText      string | null            — prose; the atlas owns precise dating
sortYear      integer | null           — null is legal and means "no date I trust" (Kulārṇava)
cultureIds    [cultureId, …]  >= 1
authorIds     [authorId, …]   >= 0     — 0 is legal (anonymous macroforms)
editions      [{ cite, pd, quoteSafe, locus? }]  >= 1
role          'formulary' | 'applied-text' | 'meta-procedural' | 'record' | 'commentary' | 'scripture'
contested     null | { positions: [{ source, value }] }   — length >= 2 when present
harm          [harmKind, …]
notes         string
```

`role` carries two audit-endorsed findings. **`applied-text`** is slice 11's formulary/applied binary,
detected by a *formal marker* (the "NN son/daughter of NN" placeholder vs a real name) rather than by
prose inference — and applied texts are procedure **outputs**, so grading them is a category error the
schema forbids (assert W3d). **`meta-procedural`** is the role slice 11 needed for *De mysteriis*,
Proclus' *On the Hieratic Art* and Porphyry's *Letter to Anebo* — works that discuss, classify and
justify ritual at length and contain no executable sequence; without the role the graph either falsely
credits them with procedures or falsely records them as procedure-free.

### 2.1.2 `author` — 55 nodes

```
kind          'person' | 'pseudonymous-attribution' | 'anonymous-hand' | 'corporate'
atlasSlug     string | null
attributionNote  string | null
```

`kind` exists because slice 14 found **three separate authorship situations with one shape** — Hekhalot
macroforms (no fixed original), the Lurianic corpus (competing disciple redactions), the corpus Bunianum
(an authentic core under accretion) — all of which defeat a naive `work → AUTHORED_BY → author` edge.
The Shams al-Maʿārif attribution ships as a **`debunked`-labelled** AUTHORED_BY: drawn struck, never
hidden, per the atlas's existing convention.

### 2.1.3 `culture` — 45 nodes

```
region        string
periodText    string
```

Slices 10 and 11 declared 13 culture nodes; slices 12, 13 and 14 reference 32 more as bare `culture:*`
endpoints without declaring them (blocker B6). Minting all 45 is part of the build.

### 2.1.4 `procedure-type` — 27 occupied nodes of a 53-term vocabulary

```
term          string, kebab-case, ASCII only
family        one of the 13 families in §2.4
gloss         one sentence
occupancy     integer — claim count; 0 is legal ONLY with a warrant
warrant       string | null — the slice finding that justifies an empty term
```

### 2.1.5 `procedure-claim` — 301 nodes · **THE OP-NODE**

This is the plan's central structural move and it comes straight from micrograd: in `draw_dot` there is
**never a value→value edge** — the operation is interposed as its own node so it can carry its own
identity. Here, `work --CONTAINS--> claim --OF_TYPE--> procedure-type`. The claim node carries the type,
the three grades, the basis, the evidence, the harm and the citation. **A grade is no longer a label on
a hairline; it is a thing you can click, cite, filter, weight and eject.**

```
workId              → work
typeTerm            → procedure-type
subject             string            — what the procedure is FOR, in the text's own register
structure           string            — stage KINDS and counts only (razor-bound)
anatomyStages       [string, …] | null
anatomyStagesInferred  boolean        — true = derived from genre, not read (strike E3)
repoCoverage        grade | null      — what THIS REPO already records
textCompleteness    grade | null      — the work as scholarship reconstructs it
witnessCompleteness grade | null      — what the edition actually in hand gives
completenessBasis   basis             — MANDATORY wherever any grade is non-null
completenessEvidence string           — non-empty, verbatim where possible
gradeWithheld       string | null     — MANDATORY when textCompleteness === null
incompletenessKind  kind | null       — MANDATORY when grade ∈ {partial, referenced, fragmentary}
harm                [harmKind, …]
harmNote            string | null     — MANDATORY when harm is non-empty
unverified          boolean
doNotQuote          boolean           — the F1 `UNVERIFIED-DO-NOT-QUOTE` flag, first-class
cite                string            — non-empty
```

### 2.1.6 `relation-claim` — 92 nodes · **THE SECOND OP-NODE**

The claim-bearing relations are promoted to nodes; the bookkeeping relations stay as plain edges
(promoting `BELONGS_TO` would be ceremony). Promoted: `TRANSMITS_TO` (49), `PARALLELS` (22),
`COMMENTS_ON` (13), `FOUND_WITH` (7), `RECORDS_TEACHING_OF` (2), `NON_EDGE` (1).

```
relation      'TRANSMITS_TO'|'PARALLELS'|'COMMENTS_ON'|'FOUND_WITH'|'RECORDS_TEACHING_OF'|'NON_EDGE'|'RECONSTRUCTED_THROUGH'
fromId        → node        (never null)
toId          → node        (never null)
asserted      boolean       — FIRST-CLASS, not an annotation
notAssertedReason  string | null   — MANDATORY when asserted === false
reassertIf    string | null — the named condition that would restore it
label         'documented' | 'disputed' | 'debunked' | 'conspiracy'
procedureLevel boolean      — true ONLY if it names the propagated procedure (the Mallinson standard)
propagatedTypeTerm  → procedure-type | null   — MANDATORY when procedureLevel === true
bestCitation  string        — non-empty
note          string        — non-empty
confusedBy    string | null — MANDATORY for NON_EDGE: who conflated the two, with a witness
```

Three schema decisions the audit forces here:

- **`asserted: false` is first-class.** Slice 12 invented it for the Hygromanteia case; the audit made it
  binding (recommendation 2) and applied it to 8 records. *"If the synthesizer does not honour it, this
  audit evaporates on the next pass — which is precisely how a flagged edge becomes an unflagged one."*
  A non-asserted relation-claim is a **node that renders struck with its reason on the face**, and its
  two wiring edges carry `asserted: false` so no traversal, chain-walk or statistic ever counts it.
- **`NON_EDGE` is a claim, not an absence.** Slice 12's E-NON-01 records that the *Liber Iuratus* and the
  18th-c. *Grimoire du Pape Honorius* are **not** related and names who confused them. *"A graph with no
  way to assert 'these are NOT related, and here is who confused them' will regrow the error on every
  pass."* Same for slice 13's two `NEGATIVE-RESULT-ROW` edges (Tuoluoni jijing→Xiuyao jing;
  Baopuzi→Daofa huiyuan) — edges a plausible-sounding later pass would invent, recorded as rejected.
- **`RECONSTRUCTED_THROUGH` is a new relation, and it is the general form of strike E2.** The struck edge
  pointed from the c.317–330 *Baopuzi* to its own 3rd-century sources while carrying a prose field
  admitting the reversal. **A prose disclaimer does not fix a wrongly-directed arrow.** The audit flipped
  the endpoints and moved the real relation (Pregadio reconstructs the Taiqing corpus *through* the
  Baopuzi) into a separate field. Generalised: **philological dependency and historical transmission run
  in opposite directions and need two arrows.** `RECONSTRUCTED_THROUGH` runs modern-scholarship →
  later-witness, is **excluded from the transmission DAG** (so it cannot create a false cycle), and draws
  in a separate dotted channel.

## 2.2 Edge types

Edges here are thin. All the claim content lives in the op-nodes.

```
from, to      node ids — BOTH NON-NULL, BOTH RESOLVING
kind          'CONTAINS' | 'OF_TYPE' | 'REL_FROM' | 'REL_TO'
            | 'BELONGS_TO' | 'AUTHORED_BY' | 'HAS_PART' | 'SEGMENT_OF'
asserted      boolean
```

| kind | shape | n | notes |
|---|---|---:|---|
| `CONTAINS` | work → procedure-claim | 301 | one per claim |
| `OF_TYPE` | procedure-claim → procedure-type | 301 | one per claim |
| `REL_FROM` | node → relation-claim | 92 | |
| `REL_TO` | relation-claim → node | 92 | |
| `BELONGS_TO` | work → culture | 85 | 86 − 1 held |
| `AUTHORED_BY` | work → author | 77 | 79 − 2 held |
| `HAS_PART` | work → work | 5 | the Lemegeton's five books |
| `SEGMENT_OF` | work-segment → work | 2 | PGM line-ranges |
| **total** | | **955** | |

**`HAS_PART` is load-bearing, not cosmetic.** Slice 12: *"Ars Notoria (13th c., devotional,
notae-dependent) and Ars Goetia (17th c., coercive, complete) cannot share a completeness grade"* — the
Lemegeton's five books differ by four centuries in origin. `SEGMENT_OF` is the same argument from
slice 11: the line-range segment is **the native citation unit of the entire Greco-Egyptian corpus**;
without it PGM IV.475–829 and IV.296–466 either vanish or falsely become works.

## 2.3 Two node splits ruled here (so the DAG can be acyclic)

1. **Dee.** Slice 12 recorded a **self-edge** (E-TR-16) for the completeness *inversion* — Dee's compiled
   manuals (De Heptarchia Mystica, the 48 Claves Angelicae, Sloane 3191) grade **more complete** than the
   spiritual diaries they were extracted from — and flagged it: *"a self-edge is a modelling smell; the
   synthesizer should probably split the node in two."* **Accepted.** Two work nodes:
   `gw:dee-spiritual-diaries` (`role: record`) and `gw:dee-compiled-manuals` (`role: formulary`), joined
   by a real `TRANSMITS_TO` relation-claim with `procedureLevel: true`. The inversion becomes a fact the
   graph can *state* instead of a loop it has to tolerate.
2. **PDM xiv.** Slice 11 calls it *"the single best argument in this round for grading per-section, not
   per-work"*: a ruled, orderly 29-column recto (complete-tending) and a verso its own editors call
   *"apparently discontinuous memoranda"* (fragmentary by construction). **Two `work-segment` nodes**
   under one work via `SEGMENT_OF`.

## 2.4 THE CONTROLLED PROCEDURE-TYPE VOCABULARY — final list, 53 terms

**27 are occupied at R33; 26 are declared empty with a warrant.** An empty term is not ceremony — it is
the *reason a later round does not force PGM logos-recitation into `mantra-recitation`*. Every empty
term names the slice finding that warrants it. `occupancy: 0` is legal **only** with a non-empty
`warrant` (assert W3f).

**F1 · SPEECH (5)** — `spoken-formula-recitation`◇ · `mantra-recitation` · `mantra-extraction`◇ ·
`mantra-consecration` · `glossolalic-vocalization`◇
> `spoken-formula-recitation` is slice 11's single highest-value gap (20+ rows): the PGM's core act is
> reciting a *logos* of voces magicae and vowel chains. `mantra-recitation` imports the wrong tradition;
> `invocation-evocation` loses the fact that the formula is a **fixed text copied verbatim in the
> handbook**. `mantra-extraction` (mantroddhāra) is slice 10's finding that the corpus's principal
> *withholding device* is a distinct procedure in its own right.

**F2 · ADDRESS TO POWERS (3)** — `invocation-evocation` · `dismissal-licence-to-depart`◇ ·
`oath-pact-binding`
> `dismissal` must be typeable apart from invocation because **its absence is diagnostic of
> incompleteness** (slice 12) — you cannot count a missing slot you cannot name.

**F3 · INTERIOR DISCIPLINE (6)** — `breath-discipline` · `visualization` ·
`objectless-insight-contemplation` · `figure-inspection-contemplation` ·
`letter-permutation-contemplation`◇ · `graded-scriptural-reading`◇
> `figure-inspection-contemplation`: the Ars Notoria gazes at an **external** diagram; `visualization`
> means internally generated imagery. `graded-scriptural-reading` is Guigo II's four rungs — the repo's
> only shipped `complete` contemplative grade.

**F4 · BODY (3)** — `posture-asana`◇ · `mudra` · `nyasa`

**F5 · REGIMEN (4)** — `purification` · `ritual-abstinence-regimen`◇ · `ascetic-retreat-regimen` ·
`counted-qualifying-regimen`◇
> **This family exists because collapsing it loses the harm signal.** Folding the Abramelin ordeal, the
> Sar-Torah enclosure or the *Mohe zhiguan*'s constantly-walking samādhi into `purification` erases
> exactly the risk the r29 plan mandates a callout for. `counted-qualifying-regimen` is puraścaraṇa.

**F6 · CONSTRUCTION (7)** — `yantra-construction` · `mandala-construction` ·
`numerical-grid-construction`◇ · `charakteres-sign-drawing`◇ · `figurine-effigy-fabrication`◇ ·
`ritual-enclosure-construction` · `apparatus-construction`◇
> `numerical-grid-construction` (awfāq / magic squares) is slice 14's strongest proposal and the
> schema's most interesting case: **it is the one row in 306 where `complete` is a *demonstrable
> property* rather than a judgement** — a constructed square either satisfies its magic constant or it
> does not, which is precisely what `engine-test.mjs` already does to the seven shipped kameas.
> `ritual-enclosure-construction` is slice 12's #1 gap (9 works): the magic circle is the single most
> characteristic element of the Western corpus and `yantra-construction` cannot absorb it without a
> category error.

**F7 · OBJECT (3)** — `consecration-of-object-talisman` · `amulet-inscription-wearing`◇ ·
`binding-curse-inscription`◇
> Many PGM and Coptic amulets are simply **written and worn**, or folded and deposited — there is no
> consecration act to type.

**F8 · OFFERING (2)** — `offering-homa` · `animal-sacrifice-blood-offering`◇
> `offering-homa` is a Vedic fire-oblation term. Forcing the PGM's bird sacrifice into it **erases both
> the act and the ethical register** — and Iamblichus Books IV–VII is an extended *defence* of animal
> sacrifice, which becomes untypeable.

**F9 · DIVINATION (5)** — `divination-procedure` · `scrying-crystallomancy` ·
`sortilege-by-canonical-text`◇ · `dream-incubation`◇ · `timing-election`
> `timing-election` is a **computable, already-shipped repo procedure** (`cast-hour.js`,
> `election-tool.js`) — 8 works in slice 12 need it, and `divination-procedure` is simply wrong: nothing
> is being divined.

**F10 · SUBSTANCE (3)** — `alchemical-operation` · `craft-recipe`◇ · `sympathetic-materia-selection`◇
> **A synthesizer keying on type names will merge two unrelated things**: "purification" in the
> alchemical papyri means **metal refining**, not ritual purity. `craft-recipe` keeps Leiden X (111
> recipes) and the Stockholm papyrus (154) out of `alchemical-operation`, whose boundary is itself the
> live scholarly question.

**F11 · PASSAGE & LITURGY (6)** — `initiation` · `graded-curriculum` · `funerary-liminal-rite` ·
`liturgical-dance-movement`◇ · `ascent-anagogic-liturgy`◇ · `image-temple-consecration`◇
> `ascent-anagogic-liturgy`: a graded seven-stage ascent with named gates is not `visualization` plus
> `invocation`. `image-temple-consecration` (pratiṣṭhā) is 64 of the Īśānaśivagurudevapaddhati's 119
> paṭalas. `liturgical-dance-movement` is the Mevlevi samāʿ — and typing it correctly is what fixes the
> repo's existing misattribution of the samāʿ to the *Masnavī*.

**F12 · AGGRESSION & PROTECTION (2)** — `coercive-rite` · `apotropaic-rite-for-another`◇
> Filing the Netratantra's court priest acting *for the monarch*, or Kauśika's śāntika/pauṣṭika, under
> `purification` erases the **on-behalf-of** relation, which is the ethically salient fact.

**F13 · PROCEDURE-SHAPED NON-PROCEDURES (4)** — `meta-ritual-parameter-table`◇ ·
`apologetic-treatise-on-procedure`◇ · `cryptographic-concealment` · `procedure-as-session-record`
> **`meta-ritual-parameter-table` is the most important term in the list.** Ullrey (UCSB 2016, pp. 117–142,
> four verbatim quotations at named pages): Mantramahodadhi 25, Śāradātilaka 23.121–45 and Prapañcasāra
> 446–452 contain **no discrete rites** — *"no discrete rituals are found in this section"*, *"a
> second-order text cannot describe a first-order text."* Without this term the corpus's two most-cited
> operative chapters are unfilable, and the repo's abhicāra wing looks timid when it is in fact
> **faithful**: its refusal to assemble the nineteen variables is not editorial restraint but fidelity,
> because *the source chapter has nothing to assemble*. A later round must not "complete" it.
> `cryptographic-concealment` is the *Steganographia* case: a 17th-c. compiler copied the decorative
> surface of a **cryptography textbook** in good faith and transmitted it downstream as angelic
> hierarchy — the graph needs a way to say *"procedure-shaped, but not a procedure."*

◇ = declared empty at R33 (26 terms). Occupied at R33 (27): the vocabulary strings actually used by the
306 rows, after ASCII/diacritic normalisation.

**Re-typing is a research act, not a build act.** The generator carries **both** `typeAsFiled` (the
slice's own string, immutable) and `typeTerm` (the controlled term), joined by a tracked, **total** map
`research/opgraph/vocab-map.json`. Where a correct retype needs the source re-read — e.g. slice 11's 16
rows filed `invocation/evocation` that are plainly `spoken-formula-recitation` by its own §6 argument —
the row keeps the coarse parent term and carries `retypePending: true` with the target named. **The
generator never silently retypes.** Assert W3g: the map is total (every `typeAsFiled` has an entry) and
every `retypePending` row names an existing target term.

## 2.5 The completeness enum — three axes, five grades, six bases, four incompleteness kinds

### Grades (5) + withheld

`complete` · `partial` · `referenced` · `fragmentary` · `unstable-plural` · **`null` + `gradeWithheld`**

**`unstable-plural` is new and earned.** Slice 14 reports **zero fragmentary rows in 23 works** and shows
that is a *substantive result*: this corpus survives by continuous copying in communities that never
stopped reading it, so its characteristic defect is not damage but **instability** — fluid Hekhalot
macroforms, Sefer Ḥasidim's Bologna vs Parma recensions, and Shimmush Tehillim, which Rebiger prints
**synoptically precisely because each recension is internally complete and they disagree.** "Complete
but plural" is a real state the four-value vocabulary cannot express; the slice had to write `complete` +
a prose caveat four times, which loses the signal.

**`null` + `gradeWithheld` is not a gap; it is a result.** Strike E3 voided two `complete` grades: the
Grand Grimoire's, graded *"NOT on any inspection of its contents, which this graph deliberately does not
perform"*, and Clm 849's, derived by syllogism from the text's role (*"a text cannot supply a
reorganisable operative skeleton unless it has one"*) while already carrying `evidenceStrength: low`.
**Withholding costs nothing; asserting "complete" about a book nobody opened would have been the round's
most quotable error.** Slice 12's distribution is therefore complete 24 (not 26) · partial 24 ·
referenced 10 · fragmentary 2 · **UNGRADED 2**. *Any count quoting 26 is quoting a pre-audit number.*

### The three axes — and why they must stay apart

| axis | question | exemplar that proves it comes apart |
|---|---|---|
| `repoCoverage` | what does **this repo** already record? | the abhicāra wing maps all 19 ṣaṭkarman variables exhaustively (`partial`) while the source chapter is a parameter table (`referenced`) |
| `textCompleteness` | what does the **work**, as scholarship reconstructs it, contain? | Liber Juratus is `complete` in Sloane 3854 |
| `witnessCompleteness` | what does the **edition actually in hand** give? | Liber Juratus has **no** PD English witness at all, and the sole English MS *breaks off just before the angel-invocation instructions begin* |

**Keeping `repoCoverage` and `textCompleteness` apart is what stops "the repo says little" being
mistaken for "the text says little"** — the failure mode that would otherwise contaminate the round's key
variable.

**`witnessCompleteness` is the third axis and it earns its keep in two slices independently.**
M.P. Pandit's preface to the standard English Kulārṇava: *"portions relating to rituals, technicalities
of special types of japa, etc. have been kept out of the treatment."* The most-read English witness to an
**already-withholding** text is itself **avowedly redacted** — *anyone grading the Kulārṇava from Pandit
is grading Pandit.* And slice 12 found **19 of 62 rows diverge**, with the PD witness abridged *precisely
at the operative core*: Turner 1657 omits the Ars Notoria's *notae* entirely (the figures **are** the
art); Mathers has 242 squares to the German tradition's 251 and most of his are unfilled; Mathers
deliberately omitted the Key of Solomon's blood operations.

> The honest editorial consequence, and it belongs on the wing page rather than being treated as an
> embarrassment: **for several first-rank works, "we can describe it but cannot quote it" is the correct
> position** — and it aligns exactly with described-never-prescribed.

### `completenessBasis` (6) — MANDATORY on every graded claim

`slot-inventory` · `comparative-recension` · `self-contained-table` · `editorial-statement` ·
`genre-norm` · `arithmetic-verification`

This is the audit's third recommendation, adopted verbatim: *"Strike E3 would have been impossible to
make quietly if every `complete` had to name its basis — `genre-norm` and `slot-inventory` are not the
same strength of claim, and a grade whose basis field would have to read 'the book looks finished' would
never have been written."* `arithmetic-verification` is added for the awfāq case (§2.4 F6).

The rendering makes the basis visible: `genre-norm` grades draw with a **hatched** fill and are excluded
from every headline count on the page. A grade you cannot state the basis of does not exist.

### `incompletenessKind` (4) — MANDATORY when the grade is not `complete`

`constitutive` · `damaged` · `gated` · `truncated` — slice 13's contribution, which the audit singles
out as *"cheap to add now, expensive later,"* carrying most of that slice's analytic value. Each has a
clean exemplar:

- **constitutive** — the text was never going to tell you. *Wuzhen pian*: allusive regulated verse, no
  posture, no session structure, no duration, no success criterion — and the evidence it is deliberate
  is the commentarial apparatus it immediately grew, both titled as though supplying what the base text
  withholds and both still symbolic.
- **damaged** — the text lost it. *Zhen'gao*: Tao Hongjing physically recovered scattered autographs and
  authenticated them by handwriting.
- **gated** — the text has it, you are not initiated. Shingon *shidō kegyō*, the *Dadong zhenjing*'s
  jade formulae, the officiant's silent *neilian*. **Worth saying on the page: here the razor and the
  tradition's own restriction point the same direction — the site is not censoring anything the
  tradition itself publishes.**
- **truncated** — the author stopped. *Mohe zhiguan*: seven chapters in ten fascicles, four frameworks,
  the ten modes worked out in full against only the *first* of the ten objects — a 10×10 matrix executed
  in one row.

**Do not merge `constitutive` and `damaged`.** Flattening them destroys the variable.

## 2.6 Harm kinds — closed enum (14)

The repo has **no procedure-level harm taxonomy** today: harm notes are page-level (`FRAMING.care`,
`RASA_TOXICITY`, Book IV flags, `MAGIC_DISCLAIMER`, `REMEDIES_FRAMING`) plus 6 record-level `harmNote`s
and 26 `textCaution`s among the mudrās. Nothing types the hazard.

`toxic-substance` · `animal-killing` · `hypoxia-breath-retention` · `sleep-deprivation` ·
`ascetic-fasting` · `self-injury` · `coercion-of-a-named-person` · `ritual-aggression` ·
`allegory-misread-as-recipe` · `fire-hazard` · `mortuary-sensitivity` · `living-tradition-sensitivity` ·
`sectarian-defamation-risk` · `reception-distortion`

Two are specific and non-obvious. **`allegory-misread-as-recipe`** (slice 13) — the *Wuzhen pian* itself
rejects mineral elixirs as a "side gate", and the historical harm came from readers taking its emblems
literally: **the text is safer than its readership was.** **`sectarian-defamation-risk`** (slice 14) —
Jewish magical material and the golem have a documented history in antisemitic polemic, as does Sufi
occultism in anti-Sufi polemic.

`harmNote` is mandatory whenever `harm` is non-empty (assert W3e), and no `harmNote` may contain an
executable detail (assert R-SCAN) — which is exactly where strike R1 landed.

## 2.7 THE FOUR WRITE-INVARIANTS

Stated as machine-checkable assertions. Each is implemented in `scripts/tests/r33-opgraph-core.mjs`
(§7.3) and each names the failure it prevents.

### W1 — ENDPOINT CLOSURE
> **Every edge's `from` and `to` resolve to a declared node id in the same generated module; no endpoint
> is null; and no endpoint contains a path separator, a `.js`, a `#`, or a space.**

```js
const ids = new Set(OPGRAPH_NODES.map(n => n.id));
assert(OPGRAPH_EDGES.every(e => e.from && e.to && ids.has(e.from) && ids.has(e.to)));
assert(OPGRAPH_EDGES.every(e => !/[\/\\#\s]|\.js/.test(e.from + e.to)));
```

**What it prevents, measured.** The five slices as audited contain **113 distinct unresolved endpoints
and 1 null**: 32 bare `culture:*`, 19 `person:*`, 8 `author:*`, 19 `ea:*` placeholders, 16 bare
procedure-type strings, 9 `proc:*`, 3 `external:*`, 2 `atlas:*`, and — the one that makes the invariant
non-negotiable — the literal id `"repo:kameas.js (Agrippa, Three Books II.22)"`. *An edge endpoint may
not be a file path or a sentence.* Blockers B6 and B7, quantified.

**Resolution rule for the build.** Every unresolved endpoint becomes **exactly one** of: (a) a minted
node of a declared type; (b) an `atlasRef` — a cross-link to a confluence slug, **not a node in this
graph**, with the edge dropped and the fact moved to the source node's `notes`; (c) a plain note with
the edge dropped. Every resolution is recorded in `gate.json` as `admitted` or `excluded`. **No endpoint
is resolved by inventing a node.**

### W2 — CITED WORK
> **Every `work` node carries ≥1 `editions[]` entry with a non-empty `cite` and a `pd` verdict from the
> closed enum, and ≥1 `sources[]` id that resolves.**

```js
const PD = new Set(['us-pd','in-copyright','open-access-in-copyright','unresolved']);
assert(works.every(w => w.editions.length >= 1
  && w.editions.every(e => e.cite.trim() && PD.has(e.pd) && typeof e.quoteSafe === 'boolean')
  && w.sources.length >= 1 && w.sources.every(s => sourceIds.has(s))));
```

**Why `open-access-in-copyright` is its own value and not a convenience.** Slice 11: *GEMF vol. 1 is
open access **but in copyright** — open access ≠ PD; linkable and citable, not quotable at length.*
Ullrey's dissertation, likewise. Collapsing it into `us-pd` is the exact error that produces an
infringing quotation.

**Why `pd` is per-EDITION and never per-work.** Preisendanz Bd. 1 (1928) is US-PD; **Bd. 2 (1931) is not
until 1 Jan 2027** — the same split applies to Kropp's Coptic edition. The most-cited Śāradātilaka
edition is **1933** (US-PD 2029) while the far older Prapañcasāra edition (1914) **is** PD: *a round that
assumes "Avalon = public domain" gets this wrong.* And strike L1: Peterson's Grimorium Verum page carries
**two** notices — `CC-BY 4.0` on the grimoire **text** and *"Introduction copyright Joseph H. Peterson,
1999; all rights reserved"* on the editorial introduction — and **every structural fact the research
took from that page comes from the all-rights-reserved half.** The irony belongs on the wing page: *the
CC-BY exception covers precisely the operative text this program does not want, and not the scholarship
it does.* The repo writes its own disclaimer; it does not reuse Peterson's wording.

`quoteSafe` reuses the exact per-edition mechanism already shipped and regression-tested in
`greatworks-east.js`. It gates **quotation itself**, not display.

### W3 — GRADED CLAIM
> **Every procedure-bearing claim carries a completeness grade AND its evidence — or an explicit
> withholding.**

```js
assert(claims.every(c =>
  VOCAB.has(c.typeTerm)
  && (c.textCompleteness === null
        ? (c.gradeWithheld || '').trim().length > 0                            // W3a
        : GRADES.has(c.textCompleteness) && BASES.has(c.completenessBasis))    // W3b
  && (c.completenessEvidence || '').trim().length > 0                          // W3c
  && !(workById(c.workId).role === 'applied-text' && c.textCompleteness !== null) // W3d
  && (c.harm.length === 0 || (c.harmNote || '').trim().length > 0)             // W3e
  && (INCOMPLETE.has(c.textCompleteness) ? KINDS.has(c.incompletenessKind) : true)
));
assert(VOCAB_TERMS.every(t => t.occupancy > 0 || (t.warrant || '').trim().length > 0)); // W3f
assert(FILED_TYPES.every(s => VOCAB_MAP[s]) &&
       claims.filter(c => c.retypePending).every(c => VOCAB.has(c.retypeTarget))); // W3g
```

W3d is slice 11's category-error guard: **applied texts are procedure *outputs*, and grading them is a
category error the schema must prevent.** Kyprianos counts 181 definite formularies against 187 definite
applied texts — this is not a rare edge case.

### W4 — GATE CLOSURE
> **No node enters without passing the gate; no ejected id appears anywhere; shipped counts equal
> admitted counts.**

```js
assert(OPGRAPH_NODES.every(n => admitted.has(n.id) && n.weight >= 0.40));
assert([...ejected, ...excluded].every(id => !shippedIds.has(id)));
assert(OPGRAPH_NODES.length === gate.admitted.filter(a => a.kind === 'node').length);
assert(OPGRAPH_EDGES.length === gate.admitted.filter(a => a.kind === 'edge').length);
```

**This is the assertion that makes the gate load-bearing rather than decorative.** Without the last two
lines, `gate.json` is a document; with them, it is a control.

---

# §3 THE CURATION GATE

**Path:** `research/opgraph/gate.json` — tracked. (`research/` already exists and holds `SOURCE-DATA.md`,
so this follows the repo's own convention for *inputs*, as distinct from `assets/js/core/data/` which
holds *shipped runtime data*.)

## 3.1 File format

Three **append-only** arrays. Every candidate ever considered stays in the file forever. **The file is
the graph's conscience, not its content.**

```jsonc
{
  "_meta": {
    "gate": "operative-graph", "rubricVersion": 1, "lastRound": "R33",
    "admissionFloor": 0.40,
    "weightRubric": "weight = witness × primaryFactor × contestFactor × flagFactor  (2dp)"
  },

  "admitted": [
    { "id": "tan:saradatilaka", "kind": "node", "nodeType": "work",
      "witnesses": [
        { "cite": "Ullrey, Grim Grimoires, PhD diss. UCSB 2016, eScholarship qt4vt6f325, pp. 117-142",
          "tier": "secondary-scholarly", "locus": "pp. 131-134", "quoteSafe": false },
        { "cite": "Bühnemann, BSOAS 74.2 (2011), 205-235, doi S0041977X11000036",
          "tier": "secondary-scholarly", "locus": "ch. 25 edition", "quoteSafe": false }
      ],
      "label": "documented",
      "contested": { "positions": [
        { "source": "Ullrey p. 133", "value": "10th c." },
        { "source": "Sanderson, reported", "value": "12th c." } ] },
      "flags": [], "weight": 0.72, "admittedRound": "R33" }
  ],

  "excluded": [
    { "id": "tan:kausikasutra->tan:parasuramakalpasutra", "kind": "edge",
      "consideredRound": "R33", "reasonCode": "no-independent-witness",
      "reason": "PARALLELS drawn from two genre descriptions; the slice's own evidence field says it is NOT a claim found in a source.",
      "revisitIf": "A scholar asserts the genre parallel in print." }
  ],

  "ejected": [
    { "id": "gem:cyranides->atlas:sefer-yetzirah", "kind": "edge",
      "admittedRound": "R33-slice", "ejectedRound": "R33-audit",
      "ejectedBy": "audit-strike", "strike": "E1",
      "reasonCode": "no-independent-witness",
      "reason": "Basis field reads 'structural observation made this round', confidence LOW. A 4th-c. Greek magico-medical compilation and a Hebrew cosmological treatise joined because both index the world by alphabet.",
      "supersededBy": null, "retainedAsNote": "gem:cyranides.notes",
      "tombstone": true }
  ]
}
```

## 3.2 The weight rubric — evidence-derived, not vibes

Weight is a **function of the witness list**, computed by the artery, so it cannot be argued into
existence.

| term | rule |
|---|---|
| `witness` | `0.0` none · `0.5` one · `0.8` two independent · `1.0` three+ independent with ≥1 primary |
| `primaryFactor` | `1.0` if ≥1 `tier:"primary"` · `0.85` if all `secondary-scholarly` · `0.6` if any witness is `tertiary` or affiliated |
| `contestFactor` | `1.0` uncontested · `0.9` contested with both positions recorded · `0.5` `label:"disputed"` · `0.2` `label:"debunked"` (kept **only** when notable, always rendered as debunked) |
| **`flagFactor`** | **`1.0` clean · `0.7` carries `(unverified)` · `0.0` carries `UNVERIFIED-DO-NOT-QUOTE` on a load-bearing claim** |

`weight = witness × primaryFactor × contestFactor × flagFactor`, 2dp. **Admission floor 0.40.**

**`flagFactor` is this plan's one addition to the frame's rubric, and it is the most important line in
§3.** The audit's own qualifier: *"roughly 30 of the 306 procedure rows carry `(unverified)` flags… The
flags are the round's best feature and its main risk simultaneously: **a flag only works if the next
round honours it rather than laundering it through restatement.**"* `flagFactor` mechanises honouring it.
Worked: one secondary-scholarly witness, uncontested, unverified → `0.5 × 0.85 × 1.0 × 0.7 = 0.30` →
**below floor → excluded automatically.**

**Consequence, stated up front so the build round is not surprised: this ejects work.** Blockers **B3**
(`jew:sefer-ha-malbush`, `jew:or-ha-sekhel` — *"graded on source quality rather than on texts"*) and
**B4** (`ea:meihua-yishu` — *"no scholarly treatment found; hold the node, do not ship it marked thin"*)
fall below the floor **by arithmetic**. The blockers become enforced rather than remembered. Expect
roughly **30–40 of the 306 rows** to land in `excluded` with `no-independent-witness`. That is the gate
working (see stop-condition C3: *a gate that never rejects is not a gate*), and the exact number is
printed by the artery, not asserted here.

**Reason codes (closed enum, so they are countable):** `no-independent-witness` · `witness-retracted` ·
`misattribution` · `duplicate` · `out-of-scope` · `debunked-and-not-notable` · `licence-blocked` ·
`razor-violation` · `reverses-chronology`.

The last two are new and come straight from the strikes: R1 was a razor violation, E2 was a reversed
arrow. Both must be countable, because a gate whose reason codes cannot express its own strike history
is not modelling its own past.

## 3.3 The ejection protocol — who voids, what, and where it is logged

**Who may void.** `ejectedBy` is a closed enum with a named authority:

| `ejectedBy` | authority | R33 instances |
|---|---|---|
| `audit-strike` | the hostile auditor (operator's Rule 3) | 8 strikes: R1, E1×6, E2, E3×2, L1, F1, D1×2, E4×2 |
| `licence` | a public-domain / rights determination | L1 (Peterson introduction) |
| `superseding-witness` | a named better witness | F1 (Tolsa supersedes the fabricated Hallum composite) |
| `razor` | the R-SCAN assert failing | R1 |
| `operator` | explicit human sign-off | — |

**The five steps** (and the tombstone is the point):

1. Ejection is proposed **only** with a named superseding witness or a reason code.
2. The record moves `admitted → ejected`; **it is never deleted.** The array is append-only.
3. `ejectedRound`, `ejectedBy` and `reasonCode` are mandatory. `supersededBy` is mandatory for
   `misattribution` and `duplicate`. `retainedAsNote` is mandatory when the observation survives as
   prose — *"the observations are retained as notes; what must not survive is the arrow."*
4. The artery (§4) regenerates the shipped data **without** it and **prints the removal in the diff.**
   Silent shrinkage is impossible.
5. `engine-test.mjs` asserts W4. This is what makes the gate load-bearing.

## 3.4 AMENDMENT B — the generator imports the gate and strips at write time

> **`scripts/gen-opgraph.mjs` reads `gate.json` FIRST, builds the admitted-id set, and emits ONLY
> admitted records. Excluded and ejected ids are never written to disk at all. The engine-test scan for
> ejected ids in shipped data is the BACKSTOP, not the mechanism.**

This matters because the two failure modes are different. Stripping at write time means a struck record
**cannot** reach the runtime module even if a test is skipped, a test file is deleted, or someone runs
the generator with the harness off. The scan catches the case where someone hand-edits the generated
file — which `--check` also catches, from the other side. Two independent detectors, one of which is
constructive.

Order of operations inside the generator, exactly:

1. read `gate.json` → build `admitted` / `excluded` / `ejected` id sets; recompute every weight from
   witnesses and **fail loudly** if a stored weight disagrees with the computed one (hand-written
   weights are a defect, not an override);
2. read `slices/*.json`; drop every record whose id is not in `admitted`;
3. read `vocab.json` + `vocab-map.json`; normalise `typeAsFiled → typeTerm`; **fail** on an unmapped string;
4. mint op-nodes from `works[].procedures[]` (the authoritative 306) and cross-check against the 193
   `CONTAINS_PROCEDURE` edges; **fail** on a mismatch other than the one known and named reconciliation
   (slice 11: 62 rows vs 61 edges — blocker B9);
5. compute derived fields — rank, `attributionPressure`, `rankInversion` — deterministically;
6. sort everything (`nodes` by `type,id`; `edges` by `kind,from,to`) and write with the GENERATED header;
7. print the diff (§4.3).

---

# §4 THE GRAPH REFRESH ARTERY

## 4.1 Why this is item #1

**The artery is not merely absent — it is severed and the wound is committed.** Every generated data
module in this repo points at an **untracked, session-scoped scratchpad** generator:
`confluence.js:25,78 → scratchpad/r28build/gen-data.mjs` · `practices/mudras.js:5 →
scratchpad/r31build/gen-practices-data.mjs` · `bhava-phala.js:5` · `yoga-rules.js:4` ·
`greatworks-east.js:12 → r32build/gen-greatworks-east.mjs`. **`git ls-files` contains none of them**, so
the flagship 190-node / 155-edge dataset cannot be reproduced from anything in the repo.

Worse, a **committed test hard-codes an absolute temp path**:

```js
// scripts/tests/r28-atlas-labels.mjs:25
const EDGE_LABELS_JSON = 'C:/Users/mehta/AppData/Local/Temp/claude/…/4c4bfebe-…/scratchpad/r28data/edge-labels.json';
```

A committed test depending on a session-scoped temp directory is a live bug that fails on any other
machine or session. Landing this artefact lets that line become
`join(ROOT, 'research/opgraph/slices/r28-edge-labels.json')`.

## 4.2 The script

**Path:** `scripts/gen-opgraph.mjs` — tracked, dependency-free, idempotent, Windows-path-safe
(`node:path` throughout; **never** a hard-coded separator, never an absolute scratchpad path).

**Inputs (all tracked):**
```
research/opgraph/gate.json
research/opgraph/vocab.json
research/opgraph/vocab-map.json
research/opgraph/slices/10-indian-tantra.json … 14-abrahamic-esoteric.json
research/opgraph/slices/01-repo-closed-corpus.json     (prior-art join table, read-only)
research/opgraph/slices/r28-edge-labels.json           (relocated from the scratchpad)
```

**Output:** `assets/js/core/data/opgraph.js` — a GENERATED ES module exporting
`OPGRAPH_META`, `OPGRAPH_NODES`, `OPGRAPH_EDGES`, `OPGRAPH_VOCAB`, `OPGRAPH_GATE_SUMMARY`,
with the header the repo already uses — now pointing at a **tracked** path:

```
//  GENERATED — do not hand-edit.
//  Source of truth: research/opgraph/gate.json + research/opgraph/slices/*.json
//  Regenerate:      node scripts/gen-opgraph.mjs
//  Anti-drift:      node scripts/gen-opgraph.mjs --check   (exit 1 on drift)
```

**Two modes:**
```bash
node scripts/gen-opgraph.mjs           # rebuild on disk + print the diff
node scripts/gen-opgraph.mjs --check   # rebuild to memory; exit 1 if it differs from what is committed
```

**Required properties.**
- **Idempotent** — running twice with no gate change produces a **byte-identical** file and a diff
  reading `no change`. Sort keys are total and explicit. (The repo already values this: R32 log,
  *"existing entries/edges byte-stable, sort order preserved"*.)
- **No `Date`, no randomness, no network** — the same inputs give the same bytes on any machine.
- **`--check` is the anti-drift gate**, and it is what makes hand-editing a generated file a **test
  failure**, which today it silently is not.
- **Exits non-zero on every failure**, matching all three existing gates.

## 4.3 The diff it must print

This is what makes it an artery rather than a build step.

```
[gen-opgraph] rebuilt from research/opgraph/gate.json (rubricVersion 1)

  NODES  0 → 623   (+623 admitted, -0 ejected)
    + work            103   (102 admitted slice works + 1 collection)
    + author           55
    + culture          45
    + procedure-type   27   (of 53 controlled terms; 26 declared empty with warrants)
    + procedure-claim 301   op-nodes
    + relation-claim   92   op-nodes  (9 with asserted:false — drawn struck)

  EDGES  0 → 955   CONTAINS 301 · OF_TYPE 301 · REL_FROM 92 · REL_TO 92
                   BELONGS_TO 85 · AUTHORED_BY 77 · HAS_PART 5 · SEGMENT_OF 2

  GRADES  301 rows = 306 slice rows − 5 on held works; exact per-grade split printed here,
          NOT predicted in the plan. The raw slice census is complete 67 · partial 137 ·
          referenced 92 · fragmentary 8 · unstable-plural 0 · WITHHELD 2 (= 306).
  BASES   per-basis counts printed here; genre-norm is called out separately because
          genre-norm grades are excluded from every headline count on the page (§5.3).
  LABELS  documented … · disputed … · debunked … · conspiracy 0
  WEIGHT  mean 0.71  min 0.40  below-floor 0
          admitted 623 · excluded 41 · ejected 9
  EJECTED THIS ROUND
    - gem:cyranides->atlas:sefer-yetzirah          E1  no-independent-witness   note kept
    - gw:ars-almadel->NULL                          E1  no-independent-witness   (null endpoint)
    - baopuzi->ea:taiqing-corpus…                   E2  reverses-chronology      endpoints flipped
    - gw:grand-grimoire/oath-pact-binding (grade)   E3  no-independent-witness   → gradeWithheld
  STRUCTURE  orphans 0 · cycles 0 · dangling 0 · rank-inversions 0 · null-endpoints 0
  RAZOR      scan clean (0 hits, 14 allowlisted loci printed above)

  WROTE assets/js/core/data/opgraph.js  (new, 4,900 lines)
```

Counts above are the plan's target census (§8.1); the artery prints the real ones and they are the
authority.

## 4.4 How it plugs into the existing gate

The repo's gate is already mature and **needs no fourth test runner** — `scripts/engine-test.mjs`
(1,743 lines, 23 test modules in **isolated child processes**), `scripts/audit.mjs` (every `href`/`src`
and relative import resolves), `scripts/browser-verify.mjs` (three phases in real Chromium: every page
0 console/pageerror/requestfailed, chrome injected, 4 a11y invariants, `__motionStats().running === false`
after 1.2 s idle, then `DRIVES[]`, then reduced-motion + 390 px no-h-scroll + print). Building another
would be pure ceremony.

Five wiring edits, all small:

1. **`scripts/engine-test.mjs`** — register `r33-opgraph-core` and `r33-opgraph-ui` in the existing
   child-process module list (the isolation matters: `motion.js` caches `motionOK()` at module scope).
2. **`scripts/engine-test.mjs`, confluence block** — add the **acyclicity assert** to the *atlas* too.
   The frame is right that it is a free correctness detector: **a transmission graph that contains a
   cycle contains a dating error**, and the block currently asserts unique slugs, no dangling endpoints,
   enums, `sortYearEnd >= sortYear`, layout determinism and no row overlap — but **no cycle check**.
3. **`scripts/engine-test.mjs`** — shell `node scripts/gen-opgraph.mjs --check` and assert exit 0.
4. **`scripts/tests/r28-atlas-labels.mjs:25`** — replace the absolute temp path with the tracked one.
5. **`.claude/skills/verify-site/SKILL.md`** — steps 4 and 5: `gen-opgraph --check`, and
   `round-ledger.mjs` (§6), whose exit 3 is a hard stop.

**Scope honesty, stated as a deferral rather than left implicit:** R33 puts **only `opgraph.js`** behind
the artery. `confluence.js`, `mudras.js`, `bhava-phala.js`, `yoga-rules.js` and `greatworks-east.js`
remain unreproducible. That is blocker B12 and it is deliberate — reconstructing four scratchpad
generators from their outputs is a whole round's work and doing it badly would rewrite byte-stable
shipped data. `gen-opgraph.mjs` is written so `scripts/gen/` can absorb them later without moving.

---

# §5 THE PAGE

**`pages/opgraph.html` — "The Operative Corpus: what these books actually tell you to do."**

## 5.0 The adopted Karpathy features (and the two already met)

The frame resolved "the Karpathy graph" to two non-conflicting referents — micrograd's `draw_dot`
(a **rendering** spec) and the llm-wiki knowledge graph (a **maintenance** spec) — and recommended
building to the union. Six transferable features; here is exactly what this plan does with each:

| # | feature | disposition |
|---|---|---|
| 1 | **op-nodes make the relation a first-class node** — in micrograd there is *never* a value→value edge | **ADOPTED, fully.** §2.1.5–2.1.6: 301 procedure-claims + 92 relation-claims. This is the plan's spine. |
| 2 | **values on the node face** — `{ label \| data \| grad }`, no tooltip | **ADOPTED.** `{ title \| w 0.85 \| ↓0.12 }` — weight and attribution pressure painted on the record, so a weak claim *looks* weak without interaction. |
| 3 | **the DAG is the explanation** — strict LR, acyclic | **ADOPTED**, plus the assert. Here a cycle is a **dating error**, so acyclicity is a free correctness detector. |
| 4 | **forward values / backward gradients** | **ADOPTED as `attributionPressure`** (§5.4). Novel, computable straight off the existing `label` field. |
| 5 | **the picture is a pure function of the graph** | **ALREADY DONE — build nothing.** `engine-test.mjs` already asserts `layoutConfluence` deterministic (two calls deep-equal). §5.2 keeps the property; it does not re-establish it. |
| 6 | **contradictions logged never resolved; index/log/lint** | **ALREADY BETTER THAN THE GIST — build nothing here.** `contested.positions >= 2` is asserted; `greatworks-east.js` keeps both sides of the Varāhamihira dating and the De Michelis/traditionalist dispute; the lint leg is audit + engine-test + browser-verify. Only the **index rebuild** (§4) and the **append-only log** (§6) legs are missing. |

Likewise **evidence-differentiated panels are DONE and are the repo's strongest existing match** —
4-value epistemic edge labels (documented 145 / disputed 9 / debunked 1 / conspiracy 0), each with
`bestCitation` + `note`; `contested.positions` rendered both ways; per-edition PD gating of quotation
itself; `harmNote` + `textCaution`. The new page **reuses the existing `--ep-*` label→style mapping
rather than inventing a second visual vocabulary.**

## 5.1 Hard constraints (non-negotiable, inherited)

Offline-first · **no CDN, no npm, no build step** · vanilla ES modules · **no DOM in `core/`** ·
DS2/DS3 tokens only (`style.css` is LOCKED and untouched; the page's own tokens live scoped in
`assets/css/opgraph.css`, exactly as `confluence.css` scopes its eight lane accents to `.cfl-page`) ·
**reduced-motion-first** (every default state IS the final resting state; all animation inside
`@media (prefers-reduced-motion: no-preference)`) · keyboard-reachable throughout · **390 px honest**
(no horizontal scroll) · print-clean · **AT parity: every visual fact is also available as text.**

## 5.2 Layout — an explicit NON-force layered DAG, and the argument for it

**Decision: no force layout, seeded or otherwise. A deterministic Sugiyama-style layered DAG.**

Four reasons, in order of weight:

1. **The reference implementation is not force-directed.** micrograd's `draw_dot` uses Graphviz `dot`
   hierarchical layering. Force-directed is the *Obsidian graph view* from the other candidate, and the
   frame is explicit that that one is the **maintenance** spec, not the rendering spec.
2. **Determinism is cheaper to *have* than to *defend*.** A seeded force layout is deterministic only if
   iteration count, tick order and float accumulation are stable across engines. Layering plus
   fixed-sweep barycentre ordering is deterministic **by construction** — integer ranks, then a fixed
   4-down/4-up sweep, ties broken by `(sortYear ?? +Inf, id)`. There is no seed to get wrong.
3. **Cost.** ~623 nodes / 955 edges with no `d3-force` available (the only vendored library is
   `d3-ticks`) means hand-writing an O(n²) simulation. Layering is O(V+E); the ordering sweeps are
   O(E log E) each, eight of them, once.
4. **It says something true that a force layout cannot.** X = **transmission rank** (longest-path depth
   over the asserted claim DAG) — *dependency depth*, not calendar time. The atlas owns time (§1.2);
   rank is a different fact. And **where rank and year disagree, that disagreement is a finding**: it is
   exactly strike E2's wrongly-directed arrow, surfaced as a visible badge rather than only as a test
   failure.

**The algorithm, in `assets/js/core/opgraph.js` (PURE — no DOM, no `Date`, no `Math.random`):**

```
layoutOpGraph({ width, zoom, orientation, filter }) -> { ranks[], nodes[], edges[], meta }
```

1. **Rank** — longest-path layering over asserted `TRANSMITS_TO` / `COMMENTS_ON` / `SEGMENT_OF` /
   `HAS_PART` only. `PARALLELS`, `FOUND_WITH`, `NON_EDGE` and `RECONSTRUCTED_THROUGH` are **excluded from
   ranking** (they are not dependencies) and draw as cross-links. Non-asserted claims never rank.
2. **Interpose** — every procedure-claim sits one rank right of its work; every relation-claim sits
   between its endpoints' ranks (micrograd's op-node placement, literally).
3. **Type gutter** — the 27 procedure-type nodes are pinned to a **fixed rightmost rank**, in
   family-then-alphabetical order. This is the single largest legibility win: 301 `OF_TYPE` edges become
   short parallel runs into a sorted column instead of 301 long chords.
4. **Order within rank** — 4 down-sweeps + 4 up-sweeps of median/barycentre crossing reduction; ties by
   `(sortYear ?? +Infinity, id)`. Fixed count, no convergence test, no randomness.
5. **Assign** — `x = rank × colPitch(zoom)`, `y = order × rowPitch(zoom)`; edges as cubic beziers with
   control points derived only from endpoints.
6. **Orientation** — `LR` (default, micrograd's `rankdir`) or `TB`. The app picks `TB` below 680 px
   because **a 390 px viewport cannot honour LR honestly**. Both are pure functions of the same input.

**Asserted by engine-test:** `JSON.stringify(layoutOpGraph(a)) === JSON.stringify(layoutOpGraph(a))`,
and that the layout places every filtered node and every filtered edge — mirroring the confluence asserts
exactly.

## 5.3 Visual encoding

Three channels, each **also written as text** on the node or in the ledger. The atlas's rule holds:
*colour is a finding aid; the label is the fact.*

**Work node — a record shape, three cells** (micrograd's `shape='record'`):

```
┌──────────────────────────────┬─────────┬──────────┐
│ Śāradātilaka                 │ w 0.72  │  ↓ 0.15  │
└──────────────────────────────┴─────────┴──────────┘
   title                          weight    attribution pressure
   ▏culture accent (4px left border) + culture NAME in the sub-row
```

- **culture** → a 4 px left accent from an 8-hue set scoped to `.opg-page` (same discipline as
  `confluence.css`'s lane accents, validated for the parchment surfaces only), **plus** the culture name
  written in the node's second text row. Never colour-only.
- **weight** → the printed number **and** stroke width in 3 steps (≥0.80 / ≥0.60 / ≥0.40). Below-floor
  never renders because it is never admitted.
- **`role`** → a one-glyph badge: ▤ formulary · ▥ record · ✎ applied-text · ❓ meta-procedural, each with
  a `<title>`/visually-hidden label.

**Procedure-claim (op-node) — a lozenge, smaller, interposed:**

- **completeness** → fill wash from a new `--cg-*` token family **plus a glyph**, so it is never
  colour-only: `▰` complete · `▰▱` partial · `○` referenced · `◌` fragmentary · `≠` unstable-plural ·
  `⊘` withheld.
- **`completenessBasis: genre-norm`** → **hatched** fill, and excluded from every headline count on the
  page. This is strike E3 rendered: a grade whose basis is "the genre usually does this" must not look
  like a grade whose basis is a slot inventory.
- **`anatomyStagesInferred`** or **`unverified`** → a dotted outline + `(unverified)` on the face.
- **`doNotQuote`** → a solid ⛔ marker; the drawer refuses to render the claim's evidence as quotable and
  says why (this is strike F1's residue made visible).
- **harm** → a small ⚠ with the harm-kind list in text; the drawer carries `harmNote` verbatim.

**Relation-claim (op-node) — a small diamond on the arc:**

- **`label`** → the **existing** `--ep-doc/disp/deb/con` tokens. No second vocabulary.
- **`asserted: false`** → dashed stroke, strikethrough label, ⊘, and `notAssertedReason` on the face at
  zoom ≥1. **Never hidden.** Nine such records ship at R33.
- **`procedureLevel: true`** → a filled diamond and the propagated type named on the arc
  (`fire-phase timing schema`); `false` → hollow. **The filled/hollow distinction is the Mallinson
  standard made visible** — 1 such claim exists in shipped data today, and the whole point of this graph
  is to add more without silently upgrading the 44 both-endpoints-procedure-bearing edges that are
  merely work-level.
- **`rankInversion: true`** → a red ⇄ badge, which is strike E2 as UI.

**Procedure-type node — a chip in the gutter**, labelled with the controlled term and its family, with
the occupancy count. Empty terms do **not** appear on the canvas; they appear in ledger Table D with
their warrant.

## 5.4 `attributionPressure` — the backward gradient

micrograd's real content is that each node holds two numbers flowing in opposite directions. Forward here
is transmission (already modelled). Backward is:

> **`attributionPressure(n)`** = the weight-weighted share of claims *incident to n* whose own label is
> `disputed`/`debunked`, or whose weight is below 0.60, or which carry `unverified`/`doNotQuote`.
> Range 0..1, 2dp, printed as `↓0.15`. Higher is worse.

*A work whose own page looks clean but which is attested only by shaky claims shows a bad gradient.*
Pure, deterministic, computed in `core/opgraph.js`, asserted by engine-test to be in `[0,1]` and stable
across two calls.

**The page must state, in prose next to the number, that this is a repo-computed heuristic and not a
scholarly finding.** The site's honesty rules forbid dressing a computed number as evidence, and a metric
this suggestive is exactly the kind that gets quoted out of context.

## 5.5 Interaction model

- **Filter bar** (checkbox groups, `aria-pressed`, all keyboard-operable, no hover-only affordances):
  **culture** (45, grouped by region) · **procedure-type** (27, grouped by the 13 families) ·
  **completeness** (6) · **basis** (6) · **harm** (14) · **≥ weight** (0.40 / 0.60 / 0.80) ·
  **asserted only** (default **off** — non-asserted records are visible by default, because hiding them
  is how a struck edge becomes an unstruck one).
- **Filters serialise to the URL hash**, so a view is linkable and reproducible — and so a page bug is
  reportable.
- **Click / Enter a node → the dossier drawer** (the atlas drawer pattern, reused): title + original ·
  culture(s) · date prose · role · **editions with per-edition PD verdict and quoteSafe** · the **three
  completeness axes side by side** with basis and verbatim evidence · `incompletenessKind` with its
  one-line gloss · harm block with `harmNote` verbatim · **contested positions both ways, never
  resolved** · the gate row (weight, the witness list, `admittedRound`) · atlas cross-link when
  `atlasSlug` is set · "what this record does NOT contain" — the razor statement, per record.
- **Follow a transmission chain** — `chainFrom(id)` walks the asserted claim DAG forward and renders the
  chain **both** as a highlighted path on the canvas **and** as an ordered `<ol>` of steps, each step
  naming its relation, its propagated procedure-type and its citation. (The atlas's `threadFrom`
  analogue; the `<ol>` is the AT-parity half and is not optional.)
- **Roving tabindex** over rendered nodes; ←→ move by rank, ↑↓ by order within rank, Enter opens the
  drawer, Esc closes — the atlas's exact keyboard model, so the site has one navigation idiom.
- **Zoom**: three discrete steps `0.6 / 1 / 1.6` (the atlas's `ZOOMS`), never continuous — continuous
  zoom is a determinism hazard and a reduced-motion hazard.
- **Motion**: none by default. Under `prefers-reduced-motion: no-preference`, only drawer presence and
  chain-highlight fades, both ≤180 ms, and `__motionStats().running === false` within 1.2 s idle
  (browser-verify asserts this on every page).

## 5.6 The dense-graph legibility strategy

**623 nodes and 955 edges cannot be drawn at once and the honest thing is to say so rather than ship a
hairball with a zoom control.** Six mechanisms, ordered by how much they buy:

1. **The default view is a FOCUS SUBGRAPH, not the whole graph.** The page opens on a chosen work (the
   Heptameron — three inbound and two outbound propagation claims, the highest-degree node in the
   Western corpus, and the point where *manuscript magic enters print*) and draws its **2-hop
   neighbourhood**. The whole-graph view exists behind a control and is explicitly labelled *"a density
   map, not a readable diagram."*
2. **The type gutter** (§5.2 step 3) removes 301 long chords by construction.
3. **Bundling** — `OF_TYPE` edges from the same rank into the same type chip draw as one spline with a
   count label (`×12`); expanding a chip unbundles it.
4. **Progressive disclosure by weight** — at zoom 0.6 only `weight ≥ 0.80` nodes are labelled; at 1.0 all
   rendered nodes are labelled; at 1.6 the evidence cell is added to the record.
5. **A hard render cap with an honest counter** — at most **140 nodes** drawn, with a persistent line
   reading `showing 140 of 623 — narrowed by: culture(3), weight ≥0.60`. **There is no silent
   truncation**, and the counter is a real DOM text node, not a title attribute.
6. **The ledger is always one control away** and is the *complete* view. The canvas is the summary; the
   table is the record. That inversion is what lets the canvas stay legible without lying.

## 5.7 THE TEXT MIRROR — AT parity, and how it is enforced

The canvas is `aria-hidden="true"` (the atlas's existing, correct choice: an SVG of 900 shapes is not
navigable). **The ledger is the accessible representation, and it is the default view at ≤ 680 px and in
print.** Five tables, each carrying *the same facts as the canvas for the current filter*:

| table | columns |
|---|---|
| **A · Works** | work · culture(s) · date · role · claims · best grade · weight · ↓pressure · witnesses · atlas slug · PD / quoteSafe |
| **B · Procedure claims** | work · type (+ family) · subject · repoCoverage · textCompleteness · witnessCompleteness · basis · incompletenessKind · harm · evidence (disclosure) · cite |
| **C · Propagation** | from · relation · to · asserted? · procedure-level? · propagated type · label · citation · note · `notAssertedReason` |
| **D · Vocabulary** | term · family · gloss · occupancy · warrant (for the 26 empty terms) |
| **E · Gate** | admitted (id, weight, witnesses, round) · excluded (id, reasonCode, reason, revisitIf) · **ejected (id, ejectedBy, strike, reasonCode, supersededBy, retainedAsNote)** |

Table E is not a debug view. **It is the page's most unusual honest feature**: a public list of what was
considered and rejected, and what was admitted and then struck, with the strike id. Most projects of this
kind ship only their survivors.

**AT parity is machine-asserted, not promised.** In `r33-opgraph-core.mjs`:

```js
const m = ledgerModel({});            // no filter
const l = layoutOpGraph({ width: 1280, zoom: 1, orientation: 'LR', filter: {}, cap: Infinity });
assert(m.works.length      === l.nodes.filter(n => n.type === 'work').length);
assert(m.claims.length     === l.nodes.filter(n => n.type === 'procedure-claim').length);
assert(m.propagation.length=== l.nodes.filter(n => n.type === 'relation-claim').length);
assert(m.gate.ejected.length === OPGRAPH_GATE_SUMMARY.ejected);
```

Both views read the same pure model; neither can drift from the other without a red test.

---

# §6 TELEMETRY + THE TWO-COLUMN LEDGER

## 6.1 Why anything at all — the current state, stated fairly

Telemetry is **partial and prose-only**. Every `MASTER-PLAN.md` round heading already carries real
numbers — *"(verified: audit 0 · engine-test all passed (77 registry exports) · Chromium sweep 38 pages
0 errors)"*, R2 through R32. **That is telemetry.** It is simply hand-typed into a 122 KB markdown file,
so it is neither machine-readable nor trendable.

The two-column ledger is **absent**, and the round logs structurally *mix* the columns: the R32 entry
blends 2 atlas person-nodes, 4 documented edges, 102 chapter mappings and the SRF v. Ananda PD
determination (**domain**) with renderer reuse via 5 exported helpers, a registry entry, a new test file
and count-assert updates (**tooling**) in one paragraph. **You cannot tell from the log whether a round
produced knowledge or instruments.**

## 6.2 `docs/telemetry/rounds.jsonl`

**Append-only, one JSON object per line** — the llm-wiki `log.md` idea made machine-parsable. It survives
merges (no conflicts), it trends (`node -e` over the file gives weight-mean drift and label-distribution
drift across rounds), and it is the input to §6.3.

**Writer:** `scripts/round-telemetry.mjs`, which **shells the gates that already exist and parses their
existing stdout.** It computes nothing new. That is the whole design: a telemetry script that computes
its own numbers is a second source of truth.

```jsonc
{"round":"R34","date":"2026-08-01","commit":"…",
 "gates":{"audit_problems":0,"engine_test_checks":438,"engine_test_fails":0,
          "browser_pages":97,"browser_errors":0,"drive_warnings":0},
 "graph":{"nodes":623,"edges":955,
          "byType":{"work":103,"author":55,"culture":45,"procedure-type":27,
                    "procedure-claim":301,"relation-claim":92},
          "grades":{"complete":0,"partial":0,"referenced":0,"fragmentary":0,
                    "unstable-plural":0,"withheld":0},
          "bases":{"slot-inventory":0,"comparative-recension":0,"self-contained-table":0,
                   "editorial-statement":0,"genre-norm":0,"arithmetic-verification":0},
          "labels":{"documented":0,"disputed":0,"debunked":0,"conspiracy":0},
          "weight_mean":0.71,"weight_min":0.40,"below_floor":0,
          "admitted":623,"excluded":41,"ejected":9,
          "orphans":0,"cycles":0,"rank_inversions":0,"not_asserted":9,
          "razor_hits":0,"vocab_occupied":27,"vocab_empty":26},
 "claims":{"domain_claims_survived":48,"tooling_only":4},
 "cost":{"files_changed":16,"loc_added":0,"loc_removed":0,"wall_minutes":0},
 "eig_top":[{"id":"gw:heptameron","score":0.78,
   "why":"highest-degree Western node (3 in / 2 out); Peterson documents its Liber Iuratus + Clavicula + Clm 849 dependencies with elements 'systematically reorganised'; Turner 1655 is a PD composite so evidence is cheap; the manuscript→print hinge is contested = high information"}]}
```

The object above is a **shape specification**: the `graph.*` numbers are written by `gen-opgraph.mjs`,
the `gates.*` numbers by the three existing gates, and the zeros are placeholders — no value in it is a
prediction. Only `claims`, `cost.wall_minutes` and `eig_top` are hand-entered by the round agent.

**EIG stays hand-scored for ~5 rounds.** `eig_top[]` is filled by the round agent against a stated
3-term rubric — **structural connectivity × evidence obtainability × contestedness** — *before* any
ranker is coded. Building the ranker first is ceremony; five rounds of hand-scored data is what a ranker
would need to calibrate against anyway.

## 6.3 `docs/ROUND-LEDGER.md` + `scripts/round-ledger.mjs`

**Definitions, sharp enough that they cannot be gamed:**

- **`domain_claims_survived`** — a claim **about the subject matter** that entered the graph or the
  site's prose **and survived the gate**: an admitted node/edge at weight ≥ floor · a cited contested
  position · a per-edition PD determination · a corrected attribution · **an ejection (+1, because
  removing a false claim is a domain result)**. Excludes anything whose only content is the site itself.
- **`tooling_only`** — renderers, layout, tests, scripts, nav, a11y, PWA, refactors, count-assert updates.
  Useful; not knowledge.
- **Ambiguous items count as `tooling_only`. The tie goes against us.** That is what keeps the ledger
  honest.

```markdown
| round | date  | domain_claims_survived | tooling_only | ratio | gate     |
|-------|-------|------------------------|--------------|-------|----------|
| R32   | 07-17 | 9                      | 4            | 0.69  | ✅ 0/0/0 |
| R33   | 07-30 | 48                     | 4            | 0.92  | ✅ 0/0/0 |
```

## 6.4 AMENDMENT C — the machine-printed stop condition

Evaluated over a trailing window, printed verbatim by `scripts/round-ledger.mjs`.

| rule | condition | printed | exit |
|---|---|---|---|
| **C1 — instrument drift (HARD STOP)** | over the **last 3 rounds**, `sum(domain) === 0` while `sum(tooling) > 0` | `STOP-CONDITION C1 TRIPPED — rounds R34–R36 produced 0 domain claims and 11 tooling items. The next round MUST be domain-only: no new scripts, no new renderers.` | **3** |
| **C2 — thinning (WARN)** | trailing-3 `domain / (domain + tooling) < 0.20` | `WARN C2 — trailing-3 domain ratio 0.14 (floor 0.20). The system is building instruments faster than knowledge.` | 0 |
| **C3 — rubber-stamp gate (WARN)** | over the **last 5 rounds**, `excluded` **and** `ejected` both grew by 0 | `WARN C3 — the curation gate has rejected nothing in 5 rounds. A gate that never rejects is not a gate.` | 0 |

**C1's non-zero exit is what makes it a power gate.** It becomes step 5 of `verify-site/SKILL.md`, so a
round that produced only ceremony **cannot be committed clean**.

**Predicted and declared in advance, because the ledger is worthless if written after the fact:** the
Opus **build** round is by construction tooling-heavy — one generator, one pure engine, one page, one
app, one stylesheet, two test modules, two telemetry scripts. Its honest count is roughly
**2 domain | 12 tooling ≈ 0.14**, which **trips C2**. That is correct and should be recorded, not
engineered around. C1 will not trip, because the build round admits the 48 R33 claims into shipped data
and because ejections count. **The round after the build must be domain-only.**

---

# §7 THE BUILD SPEC

Every file, its responsibility, and whether it is new or edited. Order follows the frame's
smallest-thing-unblocks-the-most rule: **artery → gate → asserts → telemetry → page.**

## 7.1 New files (22 — of which 6 are relocated inputs, not new authorship)

| # | path | responsibility |
|---|---|---|
| 1 | `research/opgraph/gate.json` | The curation gate. `_meta` + `admitted[]` / `excluded[]` / `ejected[]`, append-only. Every R33 candidate, every audit strike as a tombstone with `ejectedBy` + strike id. **The graph's conscience.** |
| 2 | `research/opgraph/vocab.json` | The 53 controlled terms: `term`, `family`, `gloss`, `warrant` (mandatory for the 26 empty ones). |
| 3 | `research/opgraph/vocab-map.json` | Total map `typeAsFiled → typeTerm` (+ optional `retypeTarget`). Generator fails on an unmapped string. |
| 4–8 | `research/opgraph/slices/1{0,1,2,3,4}-*.json` | The five audited slices, moved in **verbatim, post-strike**. Tracked. **These are inputs, never runtime data.** |
| 9 | `research/opgraph/slices/01-repo-closed-corpus.json` | Prior-art join table (127 works, 103 atlas slugs). Read-only input; the generator uses it **only** to populate `atlasSlug` and to refuse duplication. |
| 10 | `research/opgraph/slices/r28-edge-labels.json` | Relocated from the session scratchpad. **Kills the hard-coded absolute path at `scripts/tests/r28-atlas-labels.mjs:25`.** |
| 11 | `scripts/gen-opgraph.mjs` | **The artery** (§4). Dependency-free, idempotent, `node:path` only, two modes, prints the diff, exits non-zero on any failure. |
| 12 | `assets/js/core/data/opgraph.js` | **GENERATED.** `OPGRAPH_META`, `OPGRAPH_NODES`, `OPGRAPH_EDGES`, `OPGRAPH_VOCAB`, `OPGRAPH_GATE_SUMMARY`. Header points at the tracked source of truth. Never hand-edited (`--check` enforces). |
| 13 | `assets/js/core/opgraph.js` | **PURE engine.** No DOM, no `Date`, no `Math.random`, no network. Exports `layoutOpGraph`, `filterGraph`, `nodeById`, `chainFrom`, `opgraphStats`, `ledgerModel`, `vocabOccupancy`, `attributionPressure`, `rankInversions`, `cycleCheck`. All arithmetic lives here so it is headless-testable — the `core/confluence.js` contract, reused. |
| 14 | `pages/opgraph.html` | The page (§5). Hero + honest-note callout + "how to read this" legend + filter bar + canvas + ledger + drawer shells. Prose states the charter, the razor, and that `attributionPressure` is repo-computed. |
| 15 | `assets/js/app/opgraph.js` | The painter. **DOM only, zero geometry arithmetic.** Measures the container, asks the engine, paints an `aria-hidden` SVG underlay + an HTML node layer of `<button>`s with roving tabindex, the drawer, the five ledger tables, the chain walk, filter wiring, hash serialisation. |
| 16 | `assets/css/opgraph.css` | Scoped to `.opg-page`. New `--cg-*` completeness tokens (6) + 8 culture accents + record-node geometry + the hatch pattern for `genre-norm` + the struck style for `asserted:false`. **Built only on shipped DS2/DS3 tokens; `style.css` untouched.** Reduced-motion-first; print addendum; 390 px block. |
| 17 | `scripts/tests/r33-opgraph-core.mjs` | Invariants + razor + determinism + AT parity (§7.3). Exports `async run() -> {pass, failures[]}`. |
| 18 | `scripts/tests/r33-opgraph-ui.mjs` | The DOM/`DRIVES[]` module, following the shipped `r3x-*-ui.mjs` pattern. Installs its own DOM/rAF mocks. |
| 19 | `scripts/round-telemetry.mjs` | Shells audit + engine-test + browser-verify + `gen-opgraph`, parses their stdout, appends one line to `rounds.jsonl`. Computes nothing new. |
| 20 | `scripts/round-ledger.mjs` | Reads `rounds.jsonl`, regenerates `docs/ROUND-LEDGER.md`, prints Amendment C verbatim, **exits 3 on C1**. |
| 21 | `docs/telemetry/rounds.jsonl` | Append-only. Seeded with R32 (back-filled from the MASTER-PLAN heading) and R33. |
| 22 | `docs/ROUND-LEDGER.md` | Generated from the JSONL. |

## 7.2 Edited files (7) — all small, all additive

| path | edit |
|---|---|
| `scripts/engine-test.mjs` | register `r33-opgraph-core` + `r33-opgraph-ui` in the child-process list; add the **atlas acyclicity assert**; shell `gen-opgraph --check` |
| `scripts/tests/r28-atlas-labels.mjs` | line 25 — absolute temp path → `join(ROOT, 'research/opgraph/slices/r28-edge-labels.json')` |
| `assets/js/app/shared.js` | one `NAV_GROUPS` item under **Traditions** |
| `pages/contents.html` | one card |
| `assets/js/core/registry.js` | one capability entry for `layoutOpGraph` / `ledgerModel` (the anti-drift test asserts `exportName`, `module`, `pages`, `howItWorks` anchor and glossary terms all resolve — so this edit is checked) |
| `sw.js` | precache `pages/opgraph.html`, `assets/css/opgraph.css`, the two JS modules, the data module |
| `.claude/skills/verify-site/SKILL.md` | step 4 `gen-opgraph --check`; step 5 `round-ledger.mjs` (exit 3 = hard stop) |

Plus one regeneration: `node scripts/build-search-index.mjs` → `assets/search-index.json`.

## 7.3 Engine-test assertions

**A · The four write-invariants (§2.7)**

1. **W1** every edge endpoint resolves; none null; none contains `/ \ # space .js`.
2. **W2** every work has ≥1 edition with non-empty `cite`, `pd ∈ enum`, boolean `quoteSafe`; ≥1 resolving `sources[]`.
3. **W3a–g** grade/basis/evidence/withheld/harmNote/incompletenessKind/applied-text/vocab-warrant/vocab-map-total.
4. **W4** every node admitted at `weight ≥ 0.40`; no excluded or ejected id shipped; shipped counts === admitted counts.

**B · The razor (R-SCAN) — file-global, per §1.4**

5. **R-SCAN** over every string field of `OPGRAPH_NODES`: no `\b\d+\s*[- ]?(day|days|night|nights|hour|hours|minute|times|repetitions|breaths|drops|grams|drams|dirhams?)\b`; no `first.*then.*then` within one field; no `\byou (must|should|shall|will)\b` and no leading bare imperative; no run of >2 consecutive non-Latin-script tokens in `structure` / `anatomyStages` / `harmNote`; no term from a curated deny-list of formula fragments.
   **The allowlist is explicit and printed.** Permitted: chapter/verse/paṭala loci, folio and shelfmark numbers, MS counts, dates, page ranges, verse and recipe counts, **stage counts** ("four stages"). Every allowlisted hit is printed by the test so a reviewer sees exactly what was let through — the R1 failure mode was a hit nobody looked at.
6. **R-SCAN-GLOBAL** — for every record asserting it withholds a fact class, no *other* record in the module publishes that class. (Directly: the Sar-Torah duration was withheld in one row and printed in two others.)

**C · Structure**

7. `cycleCheck()` over the asserted transmission DAG returns `[]`. **A cycle is a dating error.**
8. **`RECONSTRUCTED_THROUGH` is excluded from the DAG** and cannot create or hide a cycle.
9. Every `TRANSMITS_TO` with both endpoints dated runs monotone in `sortYear`; undated endpoints return `unknown`, **never** `ok`.
10. Zero orphans: every node has ≥1 edge, except procedure-type nodes with `occupancy 0`, which must not be nodes at all.
11. Every `asserted:false` record carries a non-empty `notAssertedReason`; every `NON_EDGE` carries `confusedBy` + a citation.
12. Every `procedureLevel:true` relation-claim names `propagatedTypeTerm` and it resolves.
13. Every `contested` block has ≥2 positions, **each with its own named source** — no unattributed position-holder. (This is strike E4 made binding, and it is the repo's own engine-test-enforced standard.)

**D · Determinism, parity, drift**

14. `layoutOpGraph` deterministic — two calls deep-equal (mirrors the shipped confluence assert).
15. Layout places every filtered node and every filtered edge; no two same-rank same-order nodes overlap.
16. **AT parity** — `ledgerModel({}).{works,claims,propagation}.length` equals the uncapped canvas node counts per type (§5.7).
17. `attributionPressure ∈ [0,1]` for every node and stable across two calls.
18. `node scripts/gen-opgraph.mjs --check` exits 0. **Hand-editing a generated file is now a test failure.**
19. Every `atlasSlug` resolves to a real `CONFLUENCE_ENTRIES` slug; **`CONFLUENCE_ENTRIES` and `CONFLUENCE_EDGES` are byte-identical to the R32 tip** (blocker B8 asserted, not merely promised).
20. Counts assert: nodes, edges, per-type, per-grade, per-basis, occupied vocabulary — the repo's existing exact-count discipline.

**E · Existing atlas, one addition**

21. Acyclicity over `CONFLUENCE_EDGES` (the free correctness detector the frame identified; currently unchecked).

## 7.4 Build order

1. Move the slices + `r28-edge-labels.json` into `research/opgraph/`; fix `r28-atlas-labels.mjs:25`. **Green the existing gate before adding anything.**
2. Write `vocab.json` + `vocab-map.json`; resolve the 113 unresolved endpoints per the W1 rule; reconcile slice 11's 62-vs-61 row count.
3. Write `gate.json` — every candidate, every weight computed, every strike a tombstone.
4. Write `scripts/gen-opgraph.mjs`; generate `opgraph.js`; **read the printed diff before trusting it.**
5. Write `core/opgraph.js` + `r33-opgraph-core.mjs`; green all 21 asserts.
6. Add the two engine-test wirings (acyclicity, `--check`).
7. Write the page + app + css + `r33-opgraph-ui.mjs`; run the full three-gate sweep.
8. Telemetry + ledger; wire steps 4–5 into `verify-site`.
9. Regenerate the search index; nav + contents + registry + `sw.js`.

---

# §8 HONEST LEDGER

## 8.1 The census this plan targets

| node type | n | derivation |
|---|---:|---|
| `work` | **103** | 105 slice works − **3 held** (B3 ×2, B4) = 102, **+ 1** collection node (`coll:theban-magical-library`) |
| `author` | **55** | 19 declared + 15 `person:` + 4 atlas `person-*` + 8 `author:` + 9 `ea:author-*` |
| `culture` | **45** | 13 declared + 32 referenced-but-undeclared |
| `procedure-type` | **27** | occupied, of 53 controlled terms (26 declared empty with warrants) |
| `procedure-claim` | **301** | 306 rows − 5 on held works (`jew:sefer-ha-malbush` 3, `jew:or-ha-sekhel` 1, `ea:meihua-yishu` 1) |
| `relation-claim` | **92** | 94 claim-bearing edges − 2 touching held works; **9 with `asserted:false`** |
| **TOTAL NODES** | **623** | |

**Plus a `+3` delta the build adds, tracked separately so the derivation stays checkable:** the Dee split
(§2.3.1) replaces one node with two (**+1**) and the PDM xiv recto/verso split (§2.3.2) mints two
`work-segment` nodes under the existing work (**+2**). Slice 11's two PGM IV line-range segments are
already work nodes and are already inside the 105. **Post-split census: 626 nodes / 961 edges**
(+1 `TRANSMITS_TO` relation-claim for the Dee inversion → +2 wiring edges, +2 `SEGMENT_OF`, +2
`BELONGS_TO` for the segments). The artery prints whichever is true on the day.

| edge kind | n | derivation |
|---|---:|---|
| `CONTAINS` / `OF_TYPE` | 301 / 301 | one pair per procedure-claim |
| `REL_FROM` / `REL_TO` | 92 / 92 | one pair per relation-claim |
| `BELONGS_TO` | 85 | 86 − 1 (`jew:sefer-ha-malbush` → its culture) |
| `AUTHORED_BY` | 77 | 79 − 2 (`ea:meihua-yishu`, `jew:or-ha-sekhel`) |
| `HAS_PART` / `SEGMENT_OF` | 5 / 2 | the Lemegeton's five books; two PGM IV line-ranges |
| **TOTAL EDGES** | **955** | |

**This is a census, not a promise.** The gate's weight rubric (§3.2) will move an estimated **30–40
procedure-claims** into `excluded` at generation time, because `flagFactor` puts every `(unverified)` row
with a single witness below the 0.40 floor. The artery prints the real numbers and **they, not this
table, are the authority.**

## 8.2 This round's two-column count

| | |
|---|---|
| **`domain_claims_survived`** | **48** |
| **`tooling_only`** | **4** |
| **ratio** | **0.92** |

The 48 is the hostile auditor's own figure, counting only substantive sourced statements **about the
operative corpus**: slice 01 → 1 · slice 10 → 9 · slice 11 → 10 · slice 12 → 11 · slice 13 → 8 ·
slice 14 → 9. The 4 tooling items are: the closed-corpus inventory (about the repo, therefore tooling by
definition), the Karpathy-reference resolution, the v2 mandate map + four-artefact specification, and
this plan.

**What I am deliberately NOT claiming.** Under the ledger's own definitions the round's **8 ejections**
(+8) and **6 corrected attributions** (F1 Tolsa; Reeds 291–313 not 291–317; Klutz's journal is JSP not
JSNT; Bühnemann BSOAS 74.2 (2011) 205–235; Yixue qimeng 1186 not 1188; the L1 licensing narrowing) would
add **+14**, for 62. I am not claiming them, because they were produced by auditing *this same round's*
output and counting them risks double-entry. **The tie goes against us** — that rule is the ledger's only
defence.

**And the qualifier the auditor attached, carried forward verbatim:** roughly **30 of the 306 procedure
rows carry `(unverified)`**, concentrated in slice 10 (Niśvāsa, Svacchanda, Bṛhat Tantrasāra, Merutantra,
Īśānaśivagurudevapaddhati — ~15 rows resting partly on a wisdomlib digest of an unnamed thesis), slice 12
(7 rows + 4 genre-inferred grades), slice 13 (`ea:meihua-yishu`, T.901's coercive rows), slice 14
(`jew:sefer-ha-malbush`, `jew:or-ha-sekhel`). **Those are not among the 48**, and `flagFactor` (§3.2) is
what stops the next round laundering them through restatement.

## 8.3 THE DATA CEILING — what this corpus provably cannot answer

Stated so no later round mistakes a boundary for a gap to close.

1. **Whether anything works.** Efficacy is not a field and never will be. Where a text claims a result,
   the graph attributes the claim to the text and stops.
2. **How to perform anything.** By contract (§1.4). Every `complete` grade is a claim about the *text's*
   structure, never about a reader's ability to execute — and slice 11 records that even ancient
   practitioners *adapted* formularies rather than executing them, **so even a "complete" recipe was not
   a closed algorithm to its own users.**
3. **The date of several of its own nodes.** The Kulārṇava has **no date** the research would trust;
   the Śāradātilaka has four positions (11th / 12th / 10th / 8th c., the last recorded as *rejected*);
   the Merutantra's date and extent are both contested. **Rank-vs-year inversion detection therefore
   returns `unknown` for undated nodes** — and `unknown` must never render as `ok`.
4. **Any of the ~74 contested questions it carries.** 54 atlas blocks + 10 kabbalah DISPUTES + this
   round's own (Yijing authorship; Rasārṇava and Rasaratnasamuccaya dating; the Nāgārjuna
   *Rasaratnākara* ghost; khecarī / vajrolī / yoni-mudrā / māṇḍukī; Perfect Nature four-vs-one;
   Prapañcasāra attribution; the Śāradātilaka ṣaṭkarman locus; the Mithraic identity of PGM IV.475–829,
   which has **four** positions; PGM XIII's two-or-three recensions; the Theban Magical Library;
   whether Leiden X / Stockholm are "alchemy"). **Resolving one breaks a locked rule.**
5. **Any grade whose only accessible witness is redacted.** `witnessCompleteness` exists precisely to
   make that *visible* rather than silently laundered — Pandit's Kulārṇava, Turner 1657's Ars Notoria
   without the *notae*, Mathers's 242 unfilled squares, the sole English Liber Juratus MS breaking off
   before the invocation instructions begin.
6. **The Latin channel from the *Ghāya* to Agrippa.** The repo's shipped `kameas.js` — seven planetary
   squares, arithmetically verified by its own engine test — has **no upstream**, and this round does not
   give it one (B1).
7. **Anything requiring quotation from a locked witness.** Betz 1986/92 for the PGM Greek; Pingree 1986
   and Attrell/Porreca 2019 for the Picatrix; Hedegård 2002 for the Liber Juratus; Ritter 1933 for the
   *Ghāya*; Kieckhefer's *Forbidden Rites* for Clm 849; **Goudriaan & Gupta 1981** — the standard survey,
   unreachable, and *"the single biggest hole; one clean copy would firm up perhaps a dozen rows at once."*
8. **Anything in a culture with zero coverage.** Mesoamerican · Sub-Saharan African (**the repo computes
   geomancy and never names the ʿilm al-raml → Ifá question**) · Mesopotamian · Greco-Roman mystery cult ·
   Indigenous American / Siberian / Central Asian shamanic (which would need a living-tradition ethics
   posture the repo has not written) · Shintō / Shugendō · Korean / Vietnamese / SE Asian · Zoroastrian /
   Mandaean · Slavic / Baltic / Finnic · Christian ritual beyond contemplative prayer · Islamic beyond
   Sufi dhikr and samāʿ. **The graph's silence there is not evidence of absence**, and the page says so.
9. **Whether Śrīvidyā's withheld content is what the graph guesses.** It is practised now; the research
   mapped structure and named what is withheld and did **not** characterise it. *A later round must not
   treat "the graph has a gap here" as a task to close.*

## 8.4 OPEN BLOCKERS

**Inherited from the audit — nothing ships past these.**

- **B1 · The awfāq → *Ghāya* → Agrippa → `kameas.js` join must not ship.** Three open conditions: the
  *Ghāya* chapter carrying the seven planetary squares is `(unverified)` and needs **Ritter 1933**; the
  "astrological attribution emerged later" nuance is `UNVERIFIED-DO-NOT-QUOTE` after strike F1; and the
  Latin channel is **not established at all — there is a gap in the middle of the best edge.**
- **B2 · Peterson is quotable nowhere.** Five of slice 12's eighteen sources are his editorial
  introductions, and after L1 that includes the Grimorium Verum page's. Cite for every structural fact
  taken from him; ingest nothing; **do not reuse his disclaimer wording**; never ingest his *Index
  Verborum*.
- **B3 · `jew:sefer-ha-malbush` (3 rows) and `jew:or-ha-sekhel` do not ship** without Bohak, *Ancient
  Jewish Magic* (CUP 2008) or equivalent. *(Now also enforced by arithmetic — §3.2.)*
- **B4 · `ea:meihua-yishu` does not ship.** No scholarly treatment of its compilation history was found;
  its contested block has no named holder for the sceptical position. **Hold the node; do not ship it
  "marked thin."** *(Also enforced by arithmetic.)*
- **B5 · `isl:naqshbandi-kalimat-qudsiyya`'s contested block needs a named scholar** for the
  silsila-retrojection reading, or the block is dropped. The node may ship without the block; the block
  may not ship unattributed. *(Assert C13.)*
- **B6 · Slice 12 declares no `authors` and no `cultures` arrays** — 31 endpoints resolve to nothing,
  plus the null-target E-PAR-01. **Structural; fix before merge.**
- **B7 · Placeholder endpoints must become ids or notes** — ~19 `ea:*` targets that are not modelled
  works, and `"repo:kameas.js (Agrippa, Three Books II.22)"` used as a node id. **An edge endpoint may
  not be a file path or a sentence.**
- **B8 · Nothing here goes into `confluence.js`.** Capacity tripwires; ONA total exclusion; Yezidi
  excluded; magicgatebg.com discovery-index only. *(Assert C19 makes the byte-stability machine-checked.)*

**Added by this plan.**

- **B9 · Slice 11's arithmetic must reconcile before the generator runs** — 62 procedure rows against 61
  `CONTAINS_PROCEDURE` edges, *"the only arithmetic discrepancy in the round."* One orphan row is
  unexplained, and the generator's step-4 cross-check will fail on it by design.
- **B10 · The 113 unresolved endpoints + 1 null must all resolve** under the W1 rule, each recorded in the
  gate as admitted or excluded. This is B6 + B7 quantified, and it is the single largest mechanical task
  in the build.
- **B11 · `vocab-map.json` must be total before the generator runs**, and each of the 26 empty controlled
  terms must carry a warrant. Empty-without-warrant fails W3f.
- **B12 · The artery covers `opgraph.js` only.** `confluence.js`, `mudras.js`, `bhava-phala.js`,
  `yoga-rules.js` and `greatworks-east.js` stay unreproducible from tracked inputs. **A deliberate
  deferral, named so it is not mistaken for done.**

## 8.5 Standing risks

1. **Vocabulary inflation.** 53 terms with 26 empty is a real design risk. The mitigation is the warrant
   requirement (W3f) plus ledger Table D, which puts occupancy in public. If a later round finds an empty
   term still empty after five rounds, **eject the term** with `reasonCode: out-of-scope` — the gate works
   on the vocabulary too.
2. **Grade laundering.** The audit's central worry: *"a flag only works if the next round honours it."*
   Three defences: `flagFactor`, the mandatory `completenessBasis` (a grade whose basis would have to read
   "the book looks finished" is one nobody writes), and the hatched rendering of `genre-norm`.
3. **`procedure-as-session-record` may be a slice-local artefact.** It solves Dee. Whether it generalises
   to Hekhalot vision reports or Tibetan namthar is not judgeable from inside one slice. Shipped with
   occupancy 1 and flagged for review at R38.
4. **The 190-entry atlas and the 623-node operative graph will look like rivals** on a nav bar. The page
   prose must lead with the charter sentence, and every cross-link must say which question it answers.
5. **The build round trips C2** (§6.4). Recorded in advance so it reads as a prediction rather than an
   excuse; the round after it must be domain-only.
6. **Living-tradition sensitivity is unevenly distributed.** Śrīvidyā, Shingon, Naqshbandī and Zhengyi /
   Quanzhen material is practised now; slice 14's whole corpus is. `living-tradition-sensitivity` is a
   record-level harm kind, not a page banner, precisely so it cannot be satisfied by a footer.
