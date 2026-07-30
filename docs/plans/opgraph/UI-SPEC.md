# UI-SPEC — The Operative Corpus (`pages/opgraph.html`)

**Status:** arbitration ruling, buildable. Supersedes the view layer specified in
`PLAN.md` §5.6–§5.8. The engine contract, the generator, the gate and the framing
constitution are untouched.

**Round:** written against R33 shipped data (`OPGRAPH_META.roundId === 'R33'`).
Every number in this document was measured against that data by
`scratchpad/ogdesign/14-arbiter-probe.mjs` and `…-probe2.mjs`, not estimated.

**Inputs:** four consultant deliverables (`10-purpose-and-ia`, `11-viz-form-and-palette`,
`12-expansion-architecture`, `13-mirror-and-a11y`). Where they disagree, §0 records
which was taken and why. Nothing here is a synthesis; it is a single design.

---

## §0 · THE ARBITRATION — what was chosen, and what was not

Nine conflicts were live. Each is settled here, once, with the measurement that settled it.

### C1 · The primary form — matrix (11) vs per-culture bars (10) vs the incumbent node-link (12)

**Ruling: the seriated work × procedure-type matrix.** Consultant 11.

The decisive measurement, re-run independently:

```
claims: 246   filled cells: 246   collisions: 0   max/cell: 1
works with >=1 claim: 85 of 101 | terms used: 27 of 27
MATRIX GRID: 85 x 27 = 2295 cells; density 10.7%
```

There is never more than one claim per `(work, typeTerm)` cell. The matrix is
therefore not a summary of the claim layer — it is an **isomorphism** of it. The
cell *is* the op-node. D1's op-node discipline survives exactly, and the 492
`CONTAINS`+`OF_TYPE` edges (66% of all 747) stop being drawn because they are pure
rendering overhead: in a matrix, "this work contains a claim of this type" is
expressed by the cell's *position*, which is free.

*Why not consultant 10's per-culture stacked bars.* I ran the query 10 said should
be run before build, and it returns against them:

```
cultures: 44 | singletons: 25 | >=4 works: 7 | median: 1
```

A bar chart with 44 rows, 25 of which have length 1, is not a survey — it is a list
with decoration. Worse, aggregating to the culture destroys the addressable citable
unit (the claim) that this whole dataset is built to expose. 10's *intent* (I1, "which
traditions actually set out a complete procedure") is better served by sorting the
matrix's rows and reading the answer off the row rail.

*Why not the incumbent layered node-link as primary.* Re-measured:

```
maxRank: 2   work rank histogram: {"0":72,"1":25,"2":4}
1440: canvas 3000x2400, drawn 119, capped {shown:119, total:508, dropped:389}
geometry identical 390 vs 1440? true
```

The page's headline claim — "left to right is transmission rank" — spends its entire
primary axis on a three-valued variable with 71% of its mass in one column, and the
canvas draws 119 of 508 nodes at every viewport width. That is not a map.

### C2 · The arbiter's amendment to C1 — **empty cells are not drawn**

Consultant 11 specified the matrix and did not address that it is **89% empty**
(246 filled of 2,295). This collides head-on with the page's own stated limit:
*"Silence in this graph is not evidence of absence; it is evidence about what has
been surveyed."* A conventional heatmap makes 2,049 empty cells the dominant visual
fact, and this page says that fact does not exist.

**Hard clause.** An empty cell has no fill, no border and no grid rule. The grid is
established by the row rail, the column headers, and a hairline rule every fifth row
only. Filled cells are marks on a plane — a punch-card, not a heatmap. The figure
carries one sentence, always visible, never in a tooltip:

> An empty cell is not a claim that the book lacks that procedure. It is a claim
> that this survey has not recorded one.

Two consequences follow, and both are improvements:

- **Works with no claim are not blank rows.** 16 of 101 works carry zero procedure
  claims. The matrix has **85 rows, not 101**. The 16 are named in a sentence beneath
  the figure. Sixteen empty rows would assert exactly the absence the page forbids.
- **Empty vocabulary terms are not blank columns.** 26 of the 53 controlled terms have
  zero occupants (`vocabEmptyWithoutWarrant: 0` — every one carries a warrant). The
  matrix has **27 columns**, being the 27 terms with occupants. The 26 are listed with
  their warrants in the column-axis disclosure. This is consultant 10's rule R1 ("a
  legend entry with zero instances is a vocabulary entry, not a legend entry")
  generalised from the legend to the axes.

### C3 · The mirror — matrix-as-table (11) vs nested `<details>` registers (13) vs virtualisation (10)

**Ruling: 11 and 13 are the same design, and neither knew it. 10 is rejected.**

13's governing rule is *"a mirror column exists iff the diagram encodes that field;
everything else stays in the DOM inside the row's own `<details>`."* Apply that rule
to 11's form and the conflict dissolves: **the matrix is an HTML `<table>`, so the
picture and the text mirror are the same DOM object.** `th[scope=row]` is the work,
`th[scope=col]` is the term, and the cell carries the grade as a word. Parity stops
being a mirror that can drift — 13's stated fear — and becomes an identity.

13's measurement of the wall is confirmed and is what makes this work:

```
cite avg 246 chars, max 837 | evidence avg 236, max 826
total cite+evidence chars: 118,761
```

The 32,649 px wall was never 246 rows; it was two prose columns the diagram does not
encode. Those 118,761 characters move into per-cell `<details>` **and not one
character leaves the DOM.**

*Virtualisation is rejected outright* (consultant 10). Ctrl-F cannot find what is not
in the DOM; a screen reader's browse buffer *is* the DOM; and it requires scroll-driven
DOM mutation this repo forbids outside `motion.js`. `content-visibility: auto` with
`contain-intrinsic-size` buys the same paint budget at none of the cost.
`content-visibility: hidden` is forbidden.

### C4 · Does the ledger move to its own page?

**Ruling: no. One new page ships, and it is the archive, not the mirror.**

Consultants 10 and 13 converged independently: what splits off is material that is
**not a mirror of anything drawn**. That is the gate — `excluded: 102`, `ejected: 17`,
the reason-code table, and the acyclicity report. It goes to
`pages/opgraph-gate.html`.

Consultant 10's *second* new page (a vocabulary page) is **rejected**. The controlled
vocabulary is the matrix's column axis, and the 26 warranted-empty terms are the
page's own argument for why a controlled vocabulary exists. Moving it to another
document weakens the argument it exists to make. It stays as the column-axis
disclosure. One new surface to keep honest, not two — halving 10's stated cost.

### C5 · The expansion mechanism — `<dialog>` (12) vs `position:fixed` + `inert` (10) vs Fullscreen API (11)

**Ruling: `<dialog>` opened with `showModal()`.** Consultant 12.

It gives, for free and without a hand-rolled focus trap: the top layer above
`--z-header:50`, inertness of the rest of the document, background scroll-lock with no
store/restore-`scrollY` hack, and an interceptable `Esc` via the `cancel` event. There
is repo precedent at `app/palette.js`. Consultant 10's hand-rolled version reimplements
all four and owns the bugs.

Consultant 11's `requestFullscreen()` is **rejected** on three counts, two of them 10's
and one of them decisive: no deep-linking; browser-controlled exit breaks focus
restore; and **iOS Safari has no `Element.requestFullscreen`**, so the phone gets a
broken workspace.

Consultant 10's **URL contract is adopted whole** — this is the one thing 12 and 10
agree on and 11 lacks. See §4.4.

### C6 · Above-the-fold prose (10) vs full-viewport mode (12)

**Not a conflict once expansion is a mode and not a route** — 12's framing, which is
also correct on the framing constitution: a route would let a reader arrive at an
operative-corpus workspace without ever meeting the standing note.

**Arbiter's amendment, taken from neither:** consultant 10 puts four stat tiles in a
band *above* the instrument (~140 px) so a reader who leaves early leaves with the
right impression. Instead, **the four stat tiles are the instrument's own readout
strip** — inside the figure, above the matrix. They are above the fold *and* part of
the instrument *and* they recompute under the filter (which 10 wanted and a static
band cannot do). Saves ~140 px and one section.

### C7 · The row axis — culture (10's recommendation) or work?

**Ruling: work.** 10 flagged this as the one IA question it could not settle and asked
for the query to be run before build. It has been run (see C1): 44 cultures, 25
holding exactly one work, median 1. Region is worse — 33 distinct regions, almost all
singletons. Culture is a row **grouping** (optional, off by default) and a filter
facet. It is never the row axis.

### C8 · The family collapse — 27 terms → 13 families

Consultant 11 shipped this as an unresolved editorial question. Measured:

```
family cells: 231   multi-claim cells: 14   max: 3
multi cells where the GRADES DISAGREE: 8 of 14
```

**Ruling: it ships, off by default, and a multi-claim cell shows the count and the
WORST grade — not the best.** Worst-not-best because the razor this whole page rests
on is that a strong grade must never launder a weak one. The cell's accessible name
enumerates every claim it merges. A silent merge is forbidden; that is the quiet data
lie 11 correctly refused to ship.

### C9 · The camera, momentum pan, spring zoom and the minimap (12)

**Ruling: all cut.** Consultant 12 designed an excellent camera for an unbounded
node-link canvas. The C1 form ruling removed the canvas. A matrix has no unbounded
plane: its navigation is sort, filter, and native scroll, and at full viewport nothing
is off-screen to be lost in.

This is the single largest simplification in the spec, and it deletes three of 12's
own stated risks:

- `core/viewport.js` is **not** extracted. `confluence-nav.js` is **untouched**.
  `ui3-atlas.mjs` stays green by construction, not by care.
- `layoutOpgraph()` is **not changed to consume width/height**. Consultant 10 named
  that engine change as an external dependency its whole restructure rested on. It is
  descoped, because `layoutOpgraph` stops being the primary view and becomes the focus
  drill-down (§2.3), where its content is 6–30 nodes and its fixed extent is correct.
- No second motion system, no new rAF, no new nav module.

What is kept from 12, because it is right and is cheap: the `<dialog>`, the Esc
ladder, the focus-preserved-by-id rule, the `focus({preventScroll:true})` rule, the
URL contract, and the five live bugs it found (§9.6).

---

## §1 · PURPOSE

### 1.1 · What this page is, stated for a stranger

> **The Operative Corpus is a catalogue of what a hundred historical ritual and
> contemplative books contain** — which kinds of procedure, from a fixed vocabulary of
> 53 terms; how completely each book accounts for each one; on what evidence that
> judgement rests; and who said so.
>
> **It never says how to perform anything, and it never says anything works.**

The third clause — *how far the evidence behind each answer really goes* — is promoted
from footnote to headline, per consultant 10, and the data forces it:

```
basis: genre-norm 217 | comparative-recension 12 | editorial-statement 6 |
       slot-inventory 6 | self-contained-table 4 | arithmetic-verification 1
EVIDENCED (non genre-norm): 29 of 246
```

**217 of 246 grades are inferred from what the genre usually does.** The generated
module already excludes genre-norm from every headline count. The page must lead with
that number rather than with `complete: 56`, which its own rule forbids it to claim.

### 1.2 · The hero's third promise is demoted

The shipped lede promises *"where did that sequence come from?"*. Measured, that
question is answered **3 times in 45** (`procedureLevel: 3 of 45`). It cannot carry a
headline. It becomes a **finding**: *"3 relation-claims name the procedure that moved;
42 record only that one work stands behind another."* That is a more interesting
sentence than the promise it replaces, and it is true.

### 1.3 · The intents, and who arrives

| | Intent | Served by |
|---|---|---|
| **I1** | *The survey* — which traditions actually set out a complete procedure, and which only gesture at one? | The matrix, sorted; the readout strip |
| **I2** | *The book* — what does **this** book contain, and how well is it attested? | The row rail → the record dossier |
| **I3** | *The warrant* — how far does the evidence go? | The readout strip; the evidence ring; the basis filter |
| **I4** | *The gate* — what was rejected, and why? | `pages/opgraph-gate.html` (second page) |

Four arrivals: the **curious reader** (has never heard of a grimoire), the
**comparative reader** (wants two traditions side by side), the **looker-up** (knows
the book's name), the **auditor** (wants the citation). The page as shipped is built
entirely for the fourth. This spec builds the first three a way in and leaves the
fourth's route intact.

### 1.4 · Findings are generated, never typed

Consultant 10 recorded a self-correction worth promoting to a build rule: it drafted a
plausible prose finding, checked it against the data, and it was **wrong**.

**Rule.** Every quantitative sentence on this page is emitted from the model at render
time and phrased as a fact *about this dataset*, not about the traditions. A
hand-typed finding is the same defect class as a hand-written weight, and this repo
already treats that as a test failure.

Two findings that qualify, both measured here, both new:

- *Six of the 41 claims that carry a witness grade have a witness grade that
  **disagrees** with the text grade.* This is the evidence that the third completeness
  axis earns its keep, and no consultant surfaced it.
- *The read layer is 29 claims: 10 complete, 12 partial, 7 referenced. No single
  culture holds more than four of them.* There is no well-surveyed corner.

---

## §2 · THE FORM DECISION

### 2.1 · Primary — the seriated work × procedure-type matrix

**Form:** a heatmap over a grid, which the dataviz skill's form table routes to a
sequential single hue; and simultaneously, because 27 procedure types and 101 works are
"more than ~7 classes that all carry meaning", a **table**. Those are the same object
here. The skill's two answers converge.

**Geometry.** 85 rows × 27 columns. Rows are works with ≥1 claim; columns are the 27
occupied vocabulary terms. Cells are the 246 claims, one per cell, no collisions.

**Seriation** (deterministic, in core, no clock, no random):

- Rows sort by `(claims desc, evidenced-claims desc, bestGrade rank asc, label asc)`.
  The top of the rail is therefore the answer to I1 without the reader doing anything.
- Columns sort by `(family number asc, occupancy desc, term asc)`, so the 13 families
  form contiguous, labelled bands across the top.
- Row order is re-derived, never cached, and the sort key is a total order — two runs
  on the same data give the same picture on any machine.

**Optional row groupings** (a `<select>`, not tabs): *none* (default) · *by corpus*
(5 slice files: 78/51/47/43/27 claims) · *by culture* (44, groups printed as words).
Grouping costs zero colour; a group is a `<tbody>` with a `<th colspan>` caption.

**Cell contents by size** — progressive disclosure driven by cell height, which is the
same discipline the shipped painter already uses (`showPressure at bw>=175`,
`showSub at bh>=40`):

| Cell box | Renders |
|---|---|
| < 22 px (docked, all 27 cols) | ramp fill + grade glyph (`▰ ▰▱ ○ ◌`) |
| ≥ 22 px (expanded) | ramp fill + glyph + the grade **word** |
| ≥ 40 px (expanded, filtered) | + the basis word |

The grade word inside the cell is the mandatory relief channel for the sub-3:1 contrast
band and is not optional at any size where it fits.

### 2.2 · Rejected primary forms, with the reason

| Rejected | Reason (measured) |
|---|---|
| **Layered node-link (incumbent)** | `maxRank 2`, ranks 72/25/4; draws 119 of 508 at every width; the primary axis is three-valued |
| **Force-directed** | 492 of 747 edges are the tripartite spine; a flow drawn as a hairball is a lie about its structure |
| **Sankey / layered flow** | ribbon width would encode claim count — a count of *research rows* from five differently-sized slices — painting survey effort as magnitude in the loudest channel, directly contradicting the page's "silence is not absence" limit. Also cannot draw absence, and dissolves the citable unit |
| **Per-culture stacked bars** | 44 cultures, 25 singletons, median 1 (§0 C1) |
| **Small multiples by culture** | 43–44 panels, median 1 work |
| **Bipartite node-link (work ↔ type)** | strictly dominated by the matrix: same information, 492 fewer drawn edges |
| **Chord / arc diagram over relations** | 45 edges in 19 disjoint components with near-zero crossings need no bundling, and bundling would destroy the component structure, which *is* the finding |

### 2.3 · Complementary views — two, and both are warranted

**(a) The transmission threads.** The 45 relation-claims get the node-link, because
this is where node-link is honest. Measured:

```
rel endpoints (distinct works): 59   components: 19
sizes: 9,5,5,5,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2
non-work endpoints: 0   procedureLevel: 3 of 45   asserted false: 2
relation kinds: TRANSMITS_TO 25, COMMENTS_ON 9, PARALLELS 10, NON_EDGE 1
```

A forest of 19 disjoint components, max size 9, max degree 4. It is drawn as **19 small
multiples**, each a mini-DAG, from a new pure `layoutThreads()` (§7.1). The op-node
discipline is preserved: the relation-claim is drawn as a node between its two works,
never as a labelled hairline.

**(b) The focus neighbourhood.** The single highest-value unrealised asset in the
repo. `filterGraph` already supports `focus` + `hops`, `layoutOpgraph` already
hop-ranks the render cap, and the app **never calls either** (`engineFilter` in
`app/opgraph.js` omits `focus`, `hops`, `q`, `bases`, `families`, `harm`). Measured
with the real ids:

```
focus gw:heptameron h1: selected 11, drawn 11, canvas 2500x300,  capped=false
focus gw:heptameron h2: selected 30, drawn 30, canvas 2750x416,  capped=false
focus picatrix      h2: selected  6, drawn  6, canvas 2000x180,  capped=false
```

Thirty nodes in a 2750×416 strip is the difference between a diagram and a texture,
and the engine's `narrowedBy` prose (`"2-hop around gw:heptameron"`) is emitted for
free. **This is wiring, not engineering.** It is reached from any cell, row or dossier
("show what this is wired to") and it uses `layoutOpgraph` unchanged.

### 2.4 · Not a chart — the readout strip

Per the skill's "is it even a chart?" table, a handful of headline numbers is a **KPI
row of stat tiles**, never a chart. A stacked bar of the six completeness bases was
considered and rejected as a measured label-clipping anti-pattern: counts
217/12/6/6/4/1 are five sub-1% slivers.

Four tiles, all recomputed under the current filter, all also present as a sentence:

1. **101 works · 246 procedure claims** *(85 works carry at least one)*
2. **29 grades rest on read evidence** *· 217 are inferred from genre norm*
3. **3 of 45 relation-claims name the procedure that moved** *· 42 are work-level*
4. **41 claims carry a witness grade** *· in 6 of them the witness disagrees with the text*

---

## §3 · THE LAYOUT

### 3.1 · Default state, 1440 × 950, top to bottom

| # | Block | ~px | Note |
|---|---|---|---|
| 1 | Crumb | 40 | unchanged |
| 2 | H1 + 2-line lede + epistemic badge strip | 190 | lede rewritten per §1.2 |
| 3 | **The standing note, compressed** | 110 | §3.3 |
| 4 | **THE INSTRUMENT** — readout strip, view tabs, rail, stage, dock | 760 | docked; top edge ≈ 380 px |
| 5 | The derived survey finding (generated prose, §1.4) | 170 | |
| 6 | What this dataset cannot answer — rendered from `OPGRAPH_META.dataCeiling` | 300 | was a hand-written 7-item list |
| 7 | Onward links strip + pager | 180 | |

Six sections. **The instrument's top edge sits at ≈380 px, so ≥ 500 px of it is above
the fold at 950 px, already showing an answer.** That is the acceptance assertion in
§9.4, and it is the whole point of the restructure.

### 3.2 · The instrument, in detail

```
┌─ <figure class="og-fig"> ────────────────────────────────────────────────┐
│ READOUT STRIP  [101 works · 246 claims] [29 read / 217 inferred]         │
│                [3 of 45 procedure-level] [41 witness · 6 disagree]        │
├──────────────────────────────────────────────────────────────────────────┤
│ VIEW TABS   ( The survey ) ( Transmission threads ) ( Records )   [⤢ Expand] │
├────────────┬─────────────────────────────────────────────────────────────┤
│ RAIL       │ STAGE                                                       │
│ search     │  ┌ sticky family band ────────────────────────────────────┐ │
│ culture    │  │ F1·Speech │ F2·Address │ F3·Interior │ …               │ │
│ family     │  ├─ sticky term headers (rotated 90° docked, level ≥1) ───┤ │
│ term       │  │  work ▸ │ ▰ │   │ ▰▱│   │ ○ │ … 27 cols                │ │
│ grade      │  │  work ▸ │   │ ▰ │   │   │   │                          │ │
│ BASIS ★    │  │  … 85 rows, scrolls inside its own box                 │ │
│ harm       │  └────────────────────────────────────────────────────────┘ │
│ weight     │  "An empty cell is not a claim that the book lacks that     │
│ struck     │   procedure. It is a claim that this survey has not         │
│            │   recorded one."                                            │
├────────────┴─────────────────────────────────────────────────────────────┤
│ DOCK   ( Record ) ( Everything as text )                                 │
│        the dossier for the selected cell / row                           │
└──────────────────────────────────────────────────────────────────────────┘
```

- The **rail** replaces the four collapsed 34 px filter groups. The **Epistemic-label
  group is deleted** — measured `labels: {"documented": 45}`, one value, so three of
  its four facets are empty and it cannot narrow anything. It is replaced by
  **★ Basis**, which is the facet that actually splits the data **217 / 29**.
- The rail gains a **search box** reaching all 101 works by `label` and
  `titleOriginal`. The engine already implements it (`filterGraph`'s `q`); the app has
  never passed it. Copy the atlas's search-with-fly-to.
- The **stage** is finally told its real size: `min(72vh, 720px)` docked.
- The **dock** has two tabs. *Record* is the dossier. *Everything as text* is the
  matrix re-projected as a flat one-row-per-claim list — the same `model.kept`, a
  fourth projection, never a second model.

### 3.3 · The standing note — honest compression

Not deleted. Not moved below the content. Not click-to-reveal. The **two hardest
boundaries are promoted into three always-visible sentences**; every remaining clause
goes verbatim into one `<details>` whose summary names what is inside; the per-record
`RAZOR_LINE` block in the dossier — the covenant's real load-bearing site — is
untouched.

Visible (≈110 px, from ≈340 px):

> **Standing note — please read first.** This wing records **that** a named work
> contains a procedure of a named kind, and **reproduces no operative text whatever**
> — no ordered sub-steps, no quantities or timings, no formula, mantra or divine-name
> strings, no drawable signs or seals, no substance lists. Every technique is
> **described as historical practice, never prescribed**; these traditions have **no
> demonstrated predictive or operative validity** and no plausible mechanism.
> ▸ *The full standing note — the redaction limit, the abridged-witness rule, and the
> advice disclaimer (4 further sentences)*

**This requires explicit owner sign-off and must not pass in a diff.** It is a change
to the site's constitution, and although not one clause is deleted, the judgement that
four sentences may sit one keypress away is the owner's to make, not a consultant's.
The `<details>` open-state is deliberately **not persisted**: the covenant is not a
cookie.

### 3.4 · The legend — 873 px → ~90 px, zero facts lost

Three rules, from consultant 10, ratified:

- **R1.** A legend entry with zero instances is a *vocabulary* entry. Seven taught
  distinctions have zero shipped instances — verified: `unstable-plural 0`,
  `gradeWithheld 0`, `textCompleteness null 0`, `doNotQuote 0`, `rankInversions 0`,
  `inferredStages 0`, and the disputed/debunked/conspiracy epistemic labels
  (`labels: {documented: 45}`). Seven fictions removed.
- **R2.** The legend is **generated from the data**, so it can never teach a mark that
  no longer renders.
- **R3.** Teach at the mark, not at the top.

Result: a 3-line always-visible inline key (~90 px) — the ramp with its four grade
words, the evidence ring, the struck style — plus three disclosed panels. Six panels
became three: *"Completeness has three axes"* and *"A grade names its basis"* were one
idea split by accident, and *"Left to right is rank"* is deleted with the axis it
described.

### 3.5 · Expanded state

Identical DOM, moved into the `<dialog>` (§4). Same three panes. The stage is told a
viewport-sized box, so cells cross 22 px and the grade **word** prints inside every
cell. That is the load-bearing rule consultant 11 stated and it is kept: **expanding
changes what is drawn, not only how big it is.**

### 3.6 · Mobile, ≤ 680 px — honest, not shrunk

27 columns at the 24 px coarse-pointer pitch is 648 px; the matrix cannot be drawn at
390 px. **It is not drawn — it is reflowed.**

At ≤ 680 px, CSS reflows `table/thead/tbody/tr/th/td` to `display: block` and each row
becomes a **work card**: the work as the card heading, its claims as chips carrying the
ramp fill and the grade **word**, empty cells still undrawn. Explicit ARIA roles
(`role="table" / "rowgroup" / "row" / "columnheader" / "rowheader" / "cell"`) are set
in the markup so the table semantics survive the display change.

This is a **CSS projection of the same DOM, not a second view** — which deletes
consultant 11's stated risk that the phone view is "the view most likely to drift".
There is nothing to drift: it is the same nodes. Estimated ~7,600 px for the whole
dataset, against 43,678 px of tables today.

The threads view at ≤ 680 px becomes a stepped list of the 19 components, one per
screen. The focus view scrolls horizontally inside its own box, which is already how
the shipped `.og-scroll` behaves and is correct for a 2750×416 strip.

### 3.7 · Print

The `<dialog>` and its `::backdrop` are `display:none` in `@media print`, and **there
is no state change on `beforeprint`** — collapsing a reader's view because they pressed
Ctrl+P is the kind of surprise that makes an instrument untrustworthy. The page beneath
is inert, not removed, so it prints as the matrix plus the records list.

A `beforeprint`/`afterprint` listener opens every `<details>` and restores the previous
state afterwards (an event listener, so inside the repo's no-rAF/no-clock rule). The
CSS-only `.og-ev p { display:block }` trick no longer force-opens `<details>` in
modern Chromium.

The ledger prose must state the page count, because 246 claims with their evidence is
60–90 printed pages and somebody will do it by accident. The current filter and focus
print in words at the top.

---

## §4 · THE EXPANSION MODEL

### 4.1 · States

Two, and only two. **One component, one state object; only the containing box changes.**

| State | Container | Stage box |
|---|---|---|
| **Docked** (default) | in-document `<figure>` | `min(72vh, 720px)` |
| **Expanded** | `<dialog class="og-frame">` opened with `showModal()` | full viewport minus 96 px of chrome |

`<dialog>`+`showModal()` supplies the top layer above `--z-header:50`, inertness of the
rest of the document, background scroll-lock without the store/restore-`scrollY` hack,
and an interceptable `Esc` via `cancel`. **No hand-rolled focus trap anywhere.**

The `<dialog>` element lives **inside `main.wrap.opg-page`** so that `.opg-page`-scoped
CSS still inherits from its DOM parent when the element is promoted to the top layer.
This is the one clause a browser could genuinely surprise us on and it is asserted in
the real-Chromium sweep, not reasoned about (§9.5).

### 4.2 · The transition is a DOM move, not a re-render

`dialogBody.appendChild(instrumentRoot)` on expand; `dockedHost.appendChild(instrumentRoot)`
on collapse.

A move preserves, for free and without a single line of restore code: `tabindex`
values, the roving-tabindex holder, every `<details>` open state, inner scroll
positions, the selected cell, and **the identity of the focused element**. A re-render
preserves none of them and has to fake all of them.

### 4.3 · What is *not* preserved, and why that is right

Nothing. There is no camera, no zoom level and no pan offset to preserve, because
there is no unbounded canvas (§0 C9). Scroll position inside the stage is preserved by
the DOM move. Consultant 12's `{anchorId, dx, dy, level}` camera and its
`nearestDrawn()` fallback are **cut with the canvas** — with one exception: the
`nearestDrawn(id, drawnIds)` walk is still needed for **focus restoration after a
repaint**, so it is built (§7.1) and used for that alone.

### 4.4 · URL and history

Extends the existing `k=v` hash. Backward compatible; existing links keep working.

- `pushState` **exactly once**, on expand, so the browser **Back** button collapses.
- `replaceState` for everything else — filters, view tab, selection, grouping.
- Collapse routes through `history.back()`, so the **✕** button and the **Back** button
  are literally one code path.
- `#…&view=full` deep-links into the expanded state. The page still renders the
  standing note beneath (inert), so the framing constitution holds: expansion is a
  mode, not a route.
- The page currently has **no `popstate` and no `hashchange` listener**. Both are added.
- Deep-linking to a record hidden by the current filter uses the atlas's
  `relaxFiltersFor` behaviour: relax **only** the axes hiding it, and **say so** in the
  live region. A blunt filter reset is the tempting shortcut and is worse than the bug.

### 4.5 · Keyboard, focus, and the Esc ladder

**Roving tabindex, one tab stop per composite.** The 508 permanent ledger tab stops
retire. This is an accessibility *improvement*, not a regression: parity means every
fact is available as text, not that every fact is a tab stop.

**Arrow semantics are structural, not spatial** — and unlike the atlas, this grid is
genuinely 2-D:

| Key | In the matrix |
|---|---|
| ← → | previous / next **occupied** cell in the row |
| ↑ ↓ | previous / next **occupied** cell in the column |
| Home / End | first / last occupied cell in the row |
| PgUp / PgDn | previous / next family band |
| Enter / Space | open the record in the dock |

This fixes the shipped bug where `ArrowRight` and `ArrowDown` both do `i + 1`
(`app/opgraph.js:1266-1267`) — a 2-D layout with a 1-D keyboard.

**Focus, three rules:**

1. Preserved **by id** across every transition *and* every repaint. Capture
   `document.activeElement`'s `data-id` before any `innerHTML` write; restore after;
   fall back to `nearestDrawn()`.
2. `focus({ preventScroll: true })` everywhere, with an explicit `scrollIntoView` only
   when genuinely off-screen. A bare `focus()` on this page is a several-thousand-pixel
   jump.
3. No hand-rolled trap — `showModal()` owns it.

**The Esc ladder**, top match wins, implemented by `preventDefault()`-ing the dialog's
`cancel` event on the higher rungs:

1. search listbox open → close it
2. legend/help disclosure open → close it
3. dock drawer open → close it, **returning focus to the originating cell**
4. focus-neighbourhood active → clear it, return to the survey
5. expanded → collapse (via `history.back()`)
6. otherwise → bubble to site chrome

The existing global keydown at `app/opgraph.js:1327-1329` **folds into** this ladder
and never runs alongside it.

### 4.6 · Reduced motion

**The default state is the final state.** Expanding with `prefers-reduced-motion:
reduce` is an instant swap: the dialog opens, the subtree moves, done. No transition
runs, no rAF is scheduled, and `window.__motionStats().running` is `false` within
1.2 s in **both** states — asserted in the sweep (§9.8).

Under `no-preference`, the only motion is `animatePresence(dialog, 'in', SPRINGS.gentle)`
on open and `attachSegThumb()` on the view tabs, both from `app/motion.js`'s existing
conductor. **No momentum, no spring zoom, no second conductor, no rAF outside
`motion.js`.**

### 4.7 · Mobile expansion

`showModal()` on a phone is a full-screen sheet, which is the correct phone answer and
needs no special case. The reflowed work-card list fills it. There is no
`requestFullscreen` anywhere, so iOS Safari is not a special case either.

---

## §5 · THE ENCODING AND THE VALIDATED PALETTE

### 5.1 · The verdict first

**This page needs no categorical palette at all.** Every categorical variable in the
dataset either exceeds the 8-hue ceiling (culture 44, family 13), has zero variance
(epistemic label: `{documented: 45}`), or is better served by position, line style or
words. Exactly **one** palette ships: a four-step ordinal ramp for completeness.

Net literal colours in `opgraph.css` go from **14** (8 culture accents + 6 grade
washes) to **4**.

### 5.2 · Channel table — every channel with its redundant channel

| Variable | Card. | Channel | Redundant channel (mandatory) |
|---|---|---|---|
| **Completeness grade** | 4 live | **ordinal ramp fill** (§5.5) | the grade **glyph** always; the grade **word** at ≥22 px cell and in every cell's accessible name |
| Work | 85 | row position | `th[scope=row]`, the label in words |
| Procedure type | 27 | column position | `th[scope=col]`, the term in words |
| Family | 13 | column **band** + caption | the family name in words |
| Culture | 44 | row grouping + filter facet | the culture name in words |
| Corpus (slice) | 5 | row grouping caption | the corpus name in words |
| **Evidence basis** | 2 (29 / 217) | **2 px surface ring** on the 29 evidenced cells | the basis word in the accessible name; the ★ Basis filter; a readout tile |
| Relation kind | 4 | **line style** (`stroke-dasharray`) | the relation name printed on the op-node face |
| Epistemic label | 1 | **none — reserved and unspent** | the legend says so, rather than inventing contrast the data does not contain |
| Asserted = false | 2 | strike + dashed border | `text-decoration: line-through` + the reason in the cell record |
| Harm / do-not-quote | status | reserved status tokens (`--bad`) | **always icon + label**, never colour alone |
| Attribution pressure | continuous | **opt-in only**, never default | its disclaimer inline: a repo-computed heuristic must not get the loudest channel |

**The evidence ring inverts the shipped hatch.** Today `.og-hatched` textures the
*genre-norm* grades — that is 217 of 246 cells, 88% of the figure, which is a
vestibular-risk anti-pattern and makes the *default* state the loud one. The ring
emphasises the **29**, which is both the smaller set and the more interesting one.
Emphasis, not texture.

### 5.3 · The incumbent palette FAILS — validator output, pasted

Run with the dataviz skill's `scripts/validate_palette.js`.

**(a) The 8 culture accents, adjacent pairs** — the test the page currently passes,
and the wrong test:

```
$ node scripts/validate_palette.js "#3a6cb0,#9a5526,#6a4aa0,#00939c,#84831c,#b83f88,#8a4a22,#2f7ca8" \
      --mode light --surface "#fffdf6"

Palette (light, surface #fffdf6, categorical): 8 slots
  [PASS] Lightness band         all 8 inside L 0.43–0.77
  [PASS] Chroma floor           all 8 >= 0.1
  [PASS] CVD separation         worst adjacent #8a4a22↔#b83f88 ΔE 13.3 (deutan) · tritan 9.7
  [PASS] Normal-vision floor    worst adjacent #84831c↔#00939c ΔE 16.2 (normal)
  [PASS] Contrast vs surface    all 8 >= 3:1

  → ALL CHECKS PASS
EXIT=0
```

**(b) The same 8 accents under `--pairs all`** — the correct test, because on a canvas
or a matrix **any two cultures can be co-visible**:

```
$ node scripts/validate_palette.js "#3a6cb0,#9a5526,#6a4aa0,#00939c,#84831c,#b83f88,#8a4a22,#2f7ca8" \
      --mode light --surface "#fffdf6" --pairs all

Palette (light, surface #fffdf6, categorical): 8 slots
  [PASS] Lightness band         all 8 inside L 0.43–0.77
  [PASS] Chroma floor           all 8 >= 0.1
  [FAIL] CVD separation         worst all-pairs #b83f88↔#00939c ΔE 4.0 (deutan) · tritan 3.5
  [FAIL] Normal-vision floor    worst all-pairs #8a4a22↔#9a5526 ΔE 4.4 (normal) —
                                below 15, hard to tell apart even with full color vision
  [PASS] Contrast vs surface    all 8 >= 3:1

  → FAILED — fix the marked checks
EXIT=1
```

A normal-vision ΔE of 4.4 between russet `#8a4a22` and sienna `#9a5526` is a hard gate
that **secondary encoding does not excuse**. Compounding it, the accents are assigned
`i % 8` over 44 sorted culture ids, so the hue is not merely hard to read — it is
**noise**. Cycling past the 8-hue ceiling is the skill's named never-do.

**(c) The 6 completeness washes.** These are the encoding that actually carries
meaning on this page. Tested as the ordinal scale they claim to be:

```
$ node scripts/validate_palette.js "#d8efd6,#faedcb,#efe6d2,#eef5fa" \
      --mode light --surface "#fffdf6" --ordinal
# complete=--ok-wash | partial=--warn-wash | referenced=--surface-inset | fragmentary=--info-wash

Palette (light, surface #fffdf6, ordinal ramp): 4 slots
  [FAIL] Lightness monotone     out of order — L values [0.928,0.948,0.927,0.966]
  [FAIL] Adjacent ΔL            steps too close:
                                [["#d8efd6","#faedcb",0.019],["#faedcb","#efe6d2",0.021],
                                 ["#efe6d2","#eef5fa",0.04]]
  [FAIL] Light-end contrast     #eef5fa at 1.08:1 vs surface — below 2:1 floor
  [FAIL] Single hue             hue spread 152° — >40°, not a one-hue ramp

  → FAILED — fix the marked checks
EXIT=1
```

And tested as the categorical palette they visually are:

```
$ node scripts/validate_palette.js "#d8efd6,#faedcb,#efe6d2,#eef5fa" \
      --mode light --surface "#fffdf6" --pairs all

  [FAIL] Lightness band         outside band: all four L ≈ 0.93–0.97
  [FAIL] Chroma floor           below floor (reads gray): 0.041, 0.047, 0.028, 0.010
  [FAIL] CVD separation         worst all-pairs #efe6d2↔#d8efd6 ΔE 0.6 (deutan) · tritan 2.0
  [FAIL] Normal-vision floor    worst all-pairs #efe6d2↔#faedcb ΔE 2.8 (normal)
  [WARN] Contrast vs surface    below 3:1 — relief required:
                                1.20, 1.14, 1.22, 1.08

  → FAILED — fix the marked checks
EXIT=1
```

**Eight FAILs and a WARN.** `referenced` and `complete` are ΔE **0.6** apart under
deuteranopia — indistinguishable. All four sit at 1.08–1.22:1 against the card: a
0.14 maximum separation. This is not an encoding; it is decoration that looks like
one. It is also three counts of the skill's rules at once: a rainbow on an ordered
scale, four hues where the story is one number, and **status colours (`--ok-wash`
green, `--info-wash` blue) reused for a non-status series** — which reads "complete"
as *good* and "fragmentary" as *informational*, a moral reading of a structural fact.

### 5.4 · Rulings from (a)–(c)

- **The 8 `--og-c*` culture accents are deleted.** Culture becomes a row grouping in
  words, a filter facet, and a ledger column — all three self-labelling and all three
  unbounded in cardinality.
- **The 6 `--cg-*` completeness washes are deleted** and replaced by §5.5.
- Deleting the culture accents removes colour continuity with the Confluence atlas,
  which uses the same 8 lane hues. That link was spurious — the atlas's 8 lanes *mean*
  eight things; opgraph's were `i % 8` over 44 cultures — but it is a visible change
  and belongs in the owner's sign-off alongside §3.3.

### 5.5 · The shipping palette — one validated ordinal ramp

**Slot order** is the engine's own `bestGrade` order, so the picture and
`ledgerModel()` cannot disagree. More complete = darker.

| Step | Grade | Hex | Live count |
|---|---|---|---|
| 1 (lightest) | `fragmentary` | `#bd8a33` | 8 |
| 2 | `referenced` | `#a3741f` | 75 |
| 3 | `partial` | `#7a5719` | 107 |
| 4 (darkest) | `complete` | `#51390e` | 56 |

**`unstable-plural` and `withheld` are deliberately OUTSIDE the ramp.** Both have zero
instances today (`unstable-plural: 0`, `gradeWithheld: 0`, `textCompleteness null: 0`).
They are statements about the *shape of the evidence*, not about how much of the
procedure is present, so putting them on a magnitude scale would be a category error.
If either ever appears it renders as an unfilled cell with a dashed ring, its glyph
(`≠` / `⊘`) and its word — and the ramp never needs re-validating.

**Validator output — all four surfaces the cell can ever sit on:**

```
$ node scripts/validate_palette.js "#bd8a33,#a3741f,#7a5719,#51390e" --mode light --ordinal \
      --surface <each>

--- surface #fffdf6  (--dg-fill, the matrix cell bed)
  [PASS] Lightness monotone     steps read light→dark
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #bd8a33 at 3.01:1 vs surface
  [PASS] Single hue             hue spread 1°
  → ALL CHECKS PASS                                                    EXIT=0

--- surface #fffdf8  (--surface-card)
  [PASS] Lightness monotone     steps read light→dark
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #bd8a33 at 3.02:1 vs surface
  [PASS] Single hue             hue spread 1°
  → ALL CHECKS PASS                                                    EXIT=0

--- surface #fbf7ee  (--surface-wash, zebra + hover)
  [PASS] Lightness monotone     steps read light→dark
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #bd8a33 at 2.87:1 vs surface
  [PASS] Single hue             hue spread 1°
  → ALL CHECKS PASS                                                    EXIT=0

--- surface #efe6d2  (--surface-inset, worst case)
  [PASS] Lightness monotone     steps read light→dark
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #bd8a33 at 2.47:1 vs surface
  [PASS] Single hue             hue spread 1°
  → ALL CHECKS PASS                                                    EXIT=0
```

**Sixteen PASSes, four surfaces, zero WARNs, zero FAILs, exit 0 throughout.**

This is a deliberate improvement on the ramp consultant 11 selected
(`#cfa14e/#b8862b/#8a6420/#5f4712`). That ramp passes on `--dg-fill` at 2.33:1 but
**FAILs on `--surface-inset` at 1.91:1**, which 11 flagged as a non-dismissable WARN
obligating a CSS constraint that matrix cells may only ever sit on `--dg-fill` or
`--surface-wash`. A darker light end removes the constraint and the whole risk class:
if a later round moves the matrix onto an inset panel, **nothing silently degrades**.
The cost is that steps 2 and 3 are no longer exactly `--gold-500` / `--gold-700`. That
is the right trade — `opgraph.css` is the established home for page-scoped literal
colours (`confluence.css` does the same for its lane accents), and we are removing ten
literals to add four.

Because all four steps sit in the 2.47–3.02:1 relief band rather than clearing 3:1 on
every surface, **the grade word and glyph are mandatory relief and are not optional at
any size where they fit.** That obligation is discharged by §5.2's redundant-channel
column and asserted in §9.6.

### 5.6 · Forced colors and print

The repo has **no `@media (forced-colors: active)` block anywhere**. In Windows High
Contrast the ramp, the evidence ring, `.og-dnq`'s box-shadow and `.og-struck`'s opacity
all collapse simultaneously and the figure becomes uniform.

**Governing rule: every encoding degrades to TEXT, never to nothing.** In
`forced-colors: active`: the ramp fill is dropped and the grade **word** is forced
visible in every cell; the evidence ring becomes a `▲` prefix; struck uses
`text-decoration: line-through`; all flags become words. A new
`@media (forced-colors: active)` block ships in `opgraph.css` and is asserted.

### 5.7 · Anti-patterns cleared

Seven live anti-patterns in the shipped page, all resolved by the form + palette
change, none needing a library, a build step or a `style.css` edit:

1. cycling hues past 8 (`i % 8` over 44 cultures) → culture is not a colour
2. rainbow on a sequential scale → one-hue ordinal ramp
3. status colour on a non-status series (`--ok-wash` for "complete") → own ramp
4. eight hues when the story is one number → one ramp, one hero number
5. >7 colour classes carrying meaning → a table, which is now literally the form
6. a fixed 3000×2400 container inside a 70vh box → the stage is told its real size
7. texture on by default at 88% coverage → an emphasis ring on 12%

---

## §6 · THE MIRROR

### 6.1 · Parity is now an identity, not a mirror

**The matrix is a `<table>`. The picture and the text are the same DOM object.**

```html
<table class="og-matrix" role="table">
  <caption>246 procedure claims across 85 works and 27 procedure types.</caption>
  <thead>
    <tr><th scope="col">Work</th><th scope="colgroup" colspan="4">F1 · Speech</th>…</tr>
    <tr><th scope="col">Work</th><th scope="col">mantra-recitation</th>…</tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><button class="og-rowlink" data-id="gw:heptameron">Heptameron</button></th>
      <td class="og-cell og-g3 og-evidenced" data-id="proc:gw-heptameron-1">
        <span class="og-glyph" aria-hidden="true">▰▱</span>
        <span class="og-word">partial</span>
        <span class="og-vh">— basis: comparative recension; evidence read</span>
        <details><summary>evidence &amp; citation</summary>…</details>
      </td>
      <td class="og-cell og-empty"></td>
      …
    </tr>
  </tbody>
</table>
```

Every visual fact is a text fact **in the same element that carries it**. There is no
projection to keep in step, because there is no projection.

### 6.2 · The wall is deleted, not shrunk

| | Today | After |
|---|---|---|
| Table B — "Procedure claims", 246 rows | **32,649 px** | **0** — the matrix *is* it |
| Table A — "Works", 101 rows | **11,029 px** | the row rail (85 rows, inside the stage box) |
| Table D — vocabulary, 53 rows | in flow | the column-axis `<details>` |
| Table E — culture register | in flow | the row-grouping option + the gate page |
| Gate strip + acyclicity report | in flow | `pages/opgraph-gate.html` |

The 118,761 characters of `cite` + `completenessEvidence` move into per-cell
`<details>`. **Zero characters leave the page.**

### 6.3 · The in-page find contract — four assertions

1. Every character of the current filter is in the DOM at all times.
2. Ctrl-F with the find box empty reaches all of it — via `hidden="until-found"` where
   supported, and via the explicit **"Open everything"** control, which is also the
   `#…&all=1` state and the print state, everywhere else. The design never *depends*
   on `hidden="until-found"`.
3. The rail's own search sets `hidden`; it never deletes a row.
4. Landing on a cell from anywhere — matrix, rail, `data-goto`, hash, find — opens its
   full ancestor chain, **then** scrolls, **then** moves focus. In that order.

### 6.4 · Six measured covenant breaches, fixed before any density work

From consultant 13, verified against the shipped code:

| | Breach | Fix |
|---|---|---|
| **B1** | `mirrorHTML` renders `notAssertedReason \|\| confusedBy` in **one** column. On `rel:gw-liber-juratus--non-edge--gw-grimoire-pape-honorius` the 400-char `confusedBy` — the whole reason the NON_EDGE exists — **is dropped today** | two fields, two cells |
| **B2** | 5 `HAS_PART` + 3 `SEGMENT_OF` edges are drawn and appear in no table | a "Parts" row in the work dossier |
| **B3** | transmission **rank** — the legend's own primary axis — has no column, though `rankOf()` is exported | a rank column in the records list |
| **B4** | `og-dotted` (unverified) is painted on 16 claims with no column | `unverified: 16` becomes a flag column |
| **B5–B6** | ⇄ rank-inversion and ⛔ do-not-quote are latent (0 instances) | R1: not legend entries; still columns when non-zero |

**Generalised rule: no mirror cell may be `a || b` across two schema fields.** That is
an assertion, not a review note (§9.6).

### 6.5 · The mirror is rebuilt on `ledgerModel()`

`core/opgraph.js` exports `ledgerModel(state)`, `rankOf()`, `rankInversions()` and
`strainOf()`, and **the app calls none of them** — `mirrorHTML` hand-rolls a second
projection from `model.kept`. PLAN §5.7's parity assertion is written against
`ledgerModel`, so as shipped **it compares the engine to itself and the page to
nothing.**

The matrix, the records list, the dock list and the dossier are all built from
`ledgerModel(state)`. One array, four projections. And the parity assertion must
compare **ID SETS, not counts** — `og-page.mjs:449` currently asserts
`rows === m.kept.length`, which two different sets of the same size satisfy.

Expect a real rendered diff when the mirror moves onto `ledgerModel` (its row shape
differs from `mirrorHTML`'s — e.g. `bestGrade` ordering vs `GRADES.find`). Review it
deliberately rather than discovering it in the sweep.

---

## §7 · CORE vs APP

### 7.1 · New pure geometry — `assets/js/core/opgraph.js`

DOM-free, deterministic, no `Date`, no `Math.random`, all iteration orders total.

| Export | Returns | Notes |
|---|---|---|
| `matrixModel(state)` | `{ rows[], cols[], cells[], families[], counts, absent }` | the seriation of §2.1. `rows` are the 85 works with claims; `cols` the 27 occupied terms; `cells` keyed `workId\|term`; `absent` names the 16 claimless works and the 26 empty terms **as data**, so the prose in §2 is generated |
| `matrixModel(state, {collapse:'family'})` | same shape, 13 cols | a multi-claim cell carries `{count, worstGrade, claimIds[]}` — §0 C8 |
| `layoutThreads(state)` | `{ components: [{ id, works[], relNodes[], edges[], w, h }] }` | 19 small DAGs; rank within component; deterministic component id = lexicographically smallest member id |
| `nearestDrawn(id, drawnIds)` | `id \| null` | the focus-restoration walk. **Never falls back to the origin** — that *is* the teleport |

**`layoutOpgraph()` is unchanged.** It is no longer the primary view; it draws the
focus neighbourhood (§2.3), where its fixed extent is correct because the content is
6–30 nodes. This descopes the riskiest engine change in the whole consultation.

### 7.2 · What the app paints

`assets/js/app/opgraph.js` (rewritten view layer; the controller and its action model
survive) plus one new module `assets/js/app/opgraph-frame.js` (the dialog, the DOM
move, the Esc ladder, the hash).

The app measures its container, asks the engine, and paints. **The numbers on a cell
are the engine's, not the painter's.** Superseded and deleted: the node-face painter,
the 8-accent CSS block, and both mirror tables.

### 7.3 · Motion — exactly two calls, no new systems

From `app/motion.js`'s existing conductor:

- `animatePresence(dialogEl, 'in' | 'out', SPRINGS.gentle, 'y', 12)` — dialog open/close
- `attachSegThumb(viewTabsEl)` — the view tab thumb

Both inside `@media (prefers-reduced-motion: no-preference)`. **No `startMomentum`, no
`createSpring` for zoom, no `flip`, no rAF outside `motion.js`, no second conductor,
no `core/viewport.js`, and `confluence-nav.js` is not touched.**

---

## §8 · VENDORING

**None.**

The form chosen removes the only plausible library pressure. A matrix needs a total
comparator, a grouping pass and a four-entry `grade → step` lookup. `layoutThreads()`
needs connected components and a longest-path rank over ≤ 9 nodes. There is no force
layout, no bezier maths beyond what `layoutOpgraph` already ships, no scale inversion,
no tick generation. `d3-array`'s `ticks` (the repo's one vendored module, ISC, ~2 KB)
is not needed either — the matrix has no continuous axis.

Any future proposal to vendor for this page must first show a hand-rolled equivalent
that is longer than the library's ESM entry. None exists today.

---

## §9 · THE BUILD SPEC

### 9.1 · Files and responsibilities

| File | Change | Responsibility |
|---|---|---|
| `assets/js/core/opgraph.js` | **+~180 lines** | `matrixModel`, `layoutThreads`, `nearestDrawn`. `layoutOpgraph` untouched |
| `assets/js/app/opgraph.js` | **rewrite view layer** | matrix/threads/records painters on `ledgerModel`; rail; readout; roving tabindex; structural arrows |
| `assets/js/app/opgraph-frame.js` | **new, ~220 lines** | `<dialog>`, DOM move, Esc ladder, `pushState`/`popstate`/`hashchange`, focus preservation |
| `assets/css/opgraph.css` | **rewrite** | matrix grid, 4 ramp literals, evidence ring, ≤680 px reflow, `forced-colors` block, print. `style.css` untouched |
| `pages/opgraph.html` | **restructure** | six sections (§3.1); compressed standing note; generated legend host; `<dialog>` inside `main.wrap.opg-page` |
| `pages/opgraph-gate.html` | **new** | 102 excluded + 17 ejected + reason codes + acyclicity report |
| `assets/js/app/opgraph-gate.js` | **new, ~120 lines** | renders the gate page from `OPGRAPH_GATE_SUMMARY` |
| `scripts/tests/og-engine.mjs` | **+assertions** | E1–E6 below |
| `scripts/tests/og-page.mjs` | **+assertions** | P1–P7 below |
| `scripts/browser-verify.mjs` | **+opgraph drive** | B1–B9 below |
| `sw.js`, nav, `contents.html`, search index, registry | **+1 row** | the gate page, and only it |

`assets/js/core/data/opgraph.js` is **not touched** — it is generated, and
`gen-opgraph.mjs --check` already makes hand-editing a test failure.

### 9.2 · Sequencing — six steps, each green on its own

1. **The five live bugs** (§9.6 B-list) — they are bugs and should not wait for an
   architecture.
2. **`matrixModel` + `layoutThreads` in core**, with E1–E6. No UI change yet.
3. **The matrix replaces the two mirror tables** in the docked figure, on
   `ledgerModel`. P1–P5. This is where the 68,196 px falls.
4. **The rail, the readout, the search, the focus wiring.** P6–P7.
5. **The `<dialog>`**, the DOM move, the Esc ladder, the hash. B4–B7.
6. **The gate page**, the generated legend, the `dataCeiling` render, the compressed
   standing note (**after owner sign-off**).

Do not skip to step 5 before step 3: expanding a node-link that is about to be deleted
is throwaway work.

### 9.3 · Engine assertions — `scripts/tests/og-engine.mjs`

- **E1** `matrixModel({}).cells.length === 246` and every key `workId|term` is unique
  — the isomorphism, asserted rather than assumed.
- **E2** `matrixModel({}).rows.length === 85` and `.cols.length === 27`; `absent.works.length === 16`
  and `absent.terms.length === 26`.
- **E3** `matrixModel` is deterministic: two calls deep-equal, and the row order equals
  the documented total key.
- **E4** `matrixModel(s, {collapse:'family'})` yields 13 columns, exactly 14 cells with
  `count > 1`, and every such cell's `worstGrade` is the **weakest** of its members.
- **E5** `layoutThreads({}).components.length === 19`, sizes
  `[9,5,5,5,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2]`, and every endpoint is a `work`.
- **E6** **Parity as ID SETS, not counts.** The id set of `matrixModel(s).cells` equals
  the id set of `ledgerModel(s).claims`, for the empty state **and** for four non-empty
  filter states. Extended to the dock list and the records list **in the same commit**.

### 9.4 · Page-controller assertions — `scripts/tests/og-page.mjs`

- **P1** The rendered matrix contains one `<td data-id>` per kept claim, and the id set
  equals `ledgerModel(state).claims`.
- **P2** Every rendered cell contains its grade **word** as text — not only a glyph and
  not only a fill. (Discharges the §5.5 relief obligation.)
- **P3** Empty cells carry `class="og-empty"` and **no** `data-id`, **no** fill and
  **no** grade text — the §0 C2 clause, machine-checked.
- **P4** The collapsed DOM contains every one of the 246 `cite` and 246
  `completenessEvidence` strings **byte-for-byte**. *This is strict and will fail on
  any future "just truncate this one long field" edit. That is the point; do not soften
  it to a substring check.*
- **P5** No mirror cell is built from `a || b` across two schema fields — assert that
  `notAssertedReason` and `confusedBy` render in **separate** cells, using
  `rel:gw-liber-juratus--non-edge--gw-grimoire-pape-honorius` as the fixture (B1).
- **P6** `engineFilter` round-trips `focus`, `hops`, `q`, `bases`, `families` and
  `harm` — the six the app silently drops today.
- **P7** Every readout tile's number also appears as a sentence in the DOM.

### 9.5 · Browser assertions — `scripts/browser-verify.mjs`, at 1440×950 and 390×844

- **B1 · HEIGHT.** `document.documentElement.scrollHeight < 9000` at 1440×950 in the
  default (all-collapsed) state. *Today: 68,196.* Expected ≈ 4,000; the ceiling is set
  with headroom so it fails on a regression, not on a font-metric wobble.
- **B2 · ABOVE THE FOLD.** `figure.og-fig`'s `getBoundingClientRect().top < 420` **and**
  at least 480 px of it is inside the first viewport, **and** it contains ≥ 1 element
  matching `td.og-cell[data-id]` — i.e. the instrument is not merely present but is
  already showing an answer.
- **B3 · NO SIDEWAYS PAGE.** `scrollWidth - clientWidth === 0` at 390 **and** 1440, in
  **both** docked and expanded states. (The sweep already asserts this at
  `browser-verify.mjs:176`; it must now run in the expanded state too.)
- **B4 · EXPANSION PRESERVES STATE.** Apply a filter, open a `<details>`, scroll the
  stage, select a cell, focus a cell → expand → assert the filter, the open
  `<details>`, the scroll offset, the selection **and** `document.activeElement`'s
  `data-id` are all unchanged. Collapse → assert the same, **and** that focus is on the
  Expand button.
- **B5 · BACK COLLAPSES.** Expand, `history.back()`, assert collapsed and the hash no
  longer carries `view=full`. Assert `pushState` fired **exactly once**.
- **B6 · DEEP LINK.** Load `#…&view=full&sel=proc:gw-heptameron-1`; assert expanded,
  that record selected, and — if a filter hid it — that only the hiding axes were
  relaxed and that the live region **says so**.
- **B7 · CTRL-F FINDS A CLAIM.** With everything collapsed, assert
  `document.body.innerText` contains the full `completenessEvidence` string of
  `proc:baopuzi-1` and of the longest-evidence claim (826 chars).
- **B8 · 390 HONEST.** At 390 px assert the matrix has reflowed to work cards
  (`.og-matrix` computed `display: block`), that ARIA roles `table`/`row`/`cell` are
  still reported in the a11y tree, that no cell is under 24 px in its smaller
  dimension, and that the page carries the same claim id set as at 1440.
- **B9 · REDUCED MOTION + ZERO ERRORS.** With `prefers-reduced-motion: reduce`,
  `window.__motionStats().running === false` within 1.2 s in **both** states, and zero
  console errors, pageerrors and failed requests on `opgraph.html` **and**
  `opgraph-gate.html`.

### 9.6 · The five live bugs, fixed in step 1

All verified in the shipped source:

- **(a)** Focus is destroyed on drawer close — `paintDetail` writes `dr.innerHTML` while
  `#og-drawer-close` holds focus, so `activeElement` becomes `<body>`
  (`app/opgraph.js:1219-1222`). This is exactly the "focus dumped to the top of a
  68,000 px page" failure, shipping today.
- **(b)** Every full `paint()` rewrites `#og-nodes.innerHTML`, destroying the focused
  node.
- **(c)** A 2-D layout with a 1-D keyboard: `ArrowRight` and `ArrowDown` both do `i + 1`
  (`app/opgraph.js:1266-1267`).
- **(d)** The chain-walk links are inert — `#og-chain-host` has no listener, so a click
  writes a hash the next `replaceState` clobbers (`app/opgraph.js:1224` + the
  `replaceState` at `:1213`).
- **(e)** Node hit targets at zoom 0.6 are 77 × 17 px, under the 24 px minimum.

(a), (b) and (c) are subsumed by the rewrite but must be asserted so they cannot
return. (d) and (e) are fixed outright — (e) by the `Small` zoom segment being deleted
along with the canvas.

### 9.7 · Gate — the project's existing CHECK, unchanged

`node scripts/audit.mjs` → `Problems: 0` · `node scripts/engine-test.mjs` →
`all passed` · `node scripts/browser-verify.mjs` → `0 errors`.

---

## §10 · WHAT WAS CUT

Nothing is deleted from the site. Everything below is one control, one disclosure or
one link away.

| Cut | px today | Where it goes |
|---|---|---|
| Table B — "Procedure claims", 246 rows | 32,649 | **the matrix is it** |
| Table A — "Works", 101 rows | 11,029 | the row rail |
| "How to read this graph" accordion | 873 | generated inline key (~90 px) + 3 disclosures |
| Standing note, 8 clauses | ~340 | 3 visible sentences + 1 verbatim disclosure (~110 px) |
| Table D — vocabulary, 53 rows | — | the column-axis disclosure |
| Table E — culture register | — | the row-grouping option |
| Gate strip + acyclicity report | — | `pages/opgraph-gate.html` |
| "How this page is built" | — | the existing `how-it-works.html` |
| The bottom method-note callout | — | deleted — third restatement of the charter |
| Hand-written 7-item limits list | — | rendered from `OPGRAPH_META.dataCeiling` |
| Small / Normal / Large zoom segment | — | deleted with the canvas |
| Epistemic-label filter group | — | deleted — `{documented: 45}`, one value, 3 of 4 facets empty. Replaced by **★ Basis**, which splits 217/29 |
| Colour by culture (8 accents) | — | deleted — FAILs `--pairs all`; culture is a grouping and a facet |
| The 6 completeness washes | — | deleted — FAIL every check; replaced by the validated ramp |
| Culture and author gutters as drawn columns | — | 27 of 119 drawn nodes; deleted with the canvas |
| 508 permanent ledger tab stops | — | roving tabindex, 5 stops |
| The 2-D camera, momentum pan, spring zoom, minimap | — | **never built** — §0 C9 |
| `core/viewport.js` extraction | — | **never built** — `confluence-nav.js` untouched |
| `layoutOpgraph` width/height consumption | — | **descoped** — no longer the primary view |
| A second vocabulary page | — | **not built** — the vocabulary is the column axis |
| Ledger virtualisation | — | **rejected** — Ctrl-F cannot find what is not in the DOM |

**Net:** 68,196 px → target ≈ 4,000 px (ceiling 9,000), while showing **all 246
claims** instead of the 39 the diagram draws today, with 118,761 characters of
citation and evidence still byte-for-byte in the DOM.

---

## §11 · WHAT MUST BE SIGNED OFF, NOT DIFFED

Three items are the owner's call and must not pass in a review:

1. **The compressed standing note** (§3.3). Not one clause is deleted and the two
   hardest boundaries are promoted, but this is the site's constitution.
2. **Retiring the 8 culture accents** (§5.4). It breaks a visual link with the
   Confluence atlas. The link was spurious; it was also visible.
3. **Leading with "217 of 246 grades are inferred"** (§1.1). It makes the round look
   thinner than the current ledger implies. It is true, already admitted on
   `contents.html`, and required by this site's own rules. The honest framing is that
   **the survey is complete and the reading has begun, 29 records deep** — a stronger
   position than a `complete: 56` headline the page's own rule forbids.
