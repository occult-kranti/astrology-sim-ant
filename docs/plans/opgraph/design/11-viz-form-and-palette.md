# 11 · FORM AND PALETTE for The Operative Corpus

**Role:** data-visualization specialist · **Skill followed:** `dataviz` (binding; procedure run in order)
**Target:** `pages/opgraph.html` + `assets/js/app/opgraph.js` + `assets/css/opgraph.css` + `assets/js/core/opgraph.js`
**Written:** 2026-07-30 · repo tip `89e2622`, tree clean · every number below is **computed**, not estimated

Probe scripts that produced the numbers (re-runnable):
`./probe.mjs`, `./probe2.mjs`, `./search.mjs`, `./status.mjs`
Run with `C:\Users\mehta\.conda\envs\astro-workbench\node.exe` (no system Node on this machine).

---

## 0 · THE ONE-PARAGRAPH ANSWER

The spine of this dataset is not a graph. It is a **matrix**, and I can prove it: across all 246
procedure-claims there is **never more than one claim per (work, procedure-type) pair** — 246 filled
cells in an 85 × 27 grid, zero collisions. The 492 CONTAINS + OF_TYPE edges are not structure; they are
the *cost of rendering a table as a node-link diagram*. So: **the primary form is a seriated
work × procedure-type matrix**, in which the cell **is** the op-node — clickable, citable, filterable,
strikable, exactly as D1 demands — and, because a matrix is literally an HTML `<table>`, the picture and
the text mirror become **the same DOM object**, which dissolves the 32,649 px wall without touching the
AT covenant. The genuinely networked 45 relation-claims get a **second, complementary form**: 19 small
"transmission thread" strips (they are 19 disjoint components, largest 9 nodes, max degree 4 — a forest,
not a hairball). Colour: the 8 culture accents are **deleted** — I ran the validator and they FAIL the
all-pairs gate that a node-link canvas requires (ΔE 4.4 under *normal* vision, a hard gate) — and the
freed channel goes to the one ordinal variable that matters, completeness, on a validated single-hue
gold ramp built from shipped tokens. Net result: **the page needs no categorical palette at all.**

---

## 1 · WHAT I MEASURED FIRST (facts, all recomputed from the shipped module)

### 1.1 The structure

| fact | value |
|---|---|
| nodes | 508 — work 101 · author 46 · culture 43 · procedure-type 27 · procedure-claim 246 · relation-claim 45 |
| edges | 747 — CONTAINS 246 · OF_TYPE 246 · REL_FROM 45 · REL_TO 45 · BELONGS_TO 83 · AUTHORED_BY 74 · HAS_PART 5 · SEGMENT_OF 3 |
| **work × type grid** | 85 occupied rows (of 101) × 27 cols = 2,295 cells · **246 filled · 10.7 % density** |
| **cells holding >1 claim** | **0. Max claims per cell = 1.** |
| works with zero claims | 16 |
| claims per work | max 9 · median 3 · min 1 · histogram `1:24 2:18 3:17 4:11 5:8 6:1 7:4 8:1 9:1` |
| corpora (`sliceFile`) | **5** — indian-tantra 19w/78c · greco-egyptian 21w/47c · solomonic-western 24w/51c · abrahamic-esoteric 21w/27c · east-asian 16w/43c |
| cultures | 43, and **every work belongs to exactly one** (0 works in >1); largest culture holds 6 works; 33 distinct `region` strings |
| vocabulary | 53 terms in 13 families · 27 occupied · 26 empty-with-warrant |

### 1.2 The variables

| variable | distribution | statistical type |
|---|---|---|
| `textCompleteness` | partial **107** · referenced **75** · complete **56** · fragmentary **8** · unstable-plural **0** · withheld **0** | **ordinal**, 4 live steps of 5 + a null |
| `repoCoverage` | **null in 239 / 246** | ordinal, 97 % unpopulated |
| `witnessCompleteness` | **null in 205 / 246** | ordinal, 83 % unpopulated |
| `completenessBasis` | **genre-norm 217** · comparative-recension 12 · editorial-statement 6 · slot-inventory 6 · self-contained-table 4 · arithmetic-verification 1 | **binary-with-detail** (inferred vs evidenced) |
| `incompletenessKind` | constitutive 159 · gated 21 · damaged 7 · truncated 3 · n/a 56 | **nominal**, 4 values |
| epistemic `label` | **documented 45 / 45** | **status — zero variance this round** |
| `asserted:false` | 2 · `procedureLevel` 3 · `unverified` 16 · `doNotQuote` **0** · `retypePending` 12 · harm-flagged 45 | flags |
| `weight` | 12 distinct values, min 0.42 · median 0.54 · max 1.00 | quasi-ordinal, low resolution |

### 1.3 The relation-claims — the part that really is a network

TRANSMITS_TO 25 · COMMENTS_ON 9 · PARALLELS 10 · NON_EDGE 1. **All 45 endpoints are `work` nodes**
(59 distinct works). The undirected relation graph has **19 connected components**, sizes
`9, 5, 5, 5, 3, 3, 3, 3, 3, 2×10`; **max degree 4**. 23 cross-culture, 22 same-culture.
The 9-node component is the Solomonic cluster (Clm 849 · Heptameron · Liber Iuratus · Dee ×2 ·
Grimoire du Pape Honorius · Key of Solomon · Hygromanteia · Grimorium Verum) — the best story in the
dataset, currently invisible inside a 508-node canvas.

### 1.4 What the shipped layout actually does — the empirical case against the incumbent

```
maxRank 2 · cycles 0 · cycleBroken 3 · rankInversions 0 · rankUnknown 1
work rank histogram: { 0: 72, 1: 25, 2: 4 }
layoutOpgraph({}) → drawn 119 of 508 (dropped 389) · svg 3000×2400 · 9 bands
bands: cultures 14 | authors 13 | rank-0 23 | claims 39 | rank-1 9 | claims 11 | rank-2 1 | claims 1 | types 8
```

Three findings, all fatal to the current form and none of them a matter of taste:

1. **The principal axis carries almost nothing.** The page's headline claim is *"Left to right is rank,
   not year."* `maxRank = 2`. **72 of 101 works sit at rank 0.** It is a three-column chart presented as
   a transmission map, and 71 % of the corpus is in column one.
2. **The page documents a feature with zero instances.** The legend explains the ⇄ rank-inversion badge;
   `rankInversions = 0`. It never fires.
3. **The default view shows 23 % of works and 16 % of claims** — 23 of 101 works, 39 of 246 claims,
   8 of 27 procedure types, 14 of 43 cultures. The 140-cap is doing exactly what D12 designed it to do,
   which is the tell: *the plan already knew a node-link diagram could not show this dataset*, and
   answered by showing a quarter of it. The honest inference is not "cap harder" — it is "wrong form."

---

## 2 · STEP 1 · PICK THE FORM

The `dataviz` procedure is explicit that the answer may be "not a node-link chart." Here it is, twice
over — and the data has **two jobs**, which one form cannot serve.

> **Job A — distribution.** *Which works contain which kinds of procedure, and how completely is each
> accounted for?* Two categorical dimensions, one ordinal value per intersection. 246 of 2,295 cells.
> **Job B — network.** *What moved between works, and is the claim asserted?* 45 records, 19 components,
> largest 9. A small, fragmented, genuinely relational question.

### 2.1 The candidates, evaluated

#### (a) The current layered node-link DAG — **REJECTED for Job A, KEPT (rescoped) for Job B**

- **Encoding cost.** A claim cell carries three facts (work, type, grade). The node-link form spends one
  box + two bezier edges per fact-triple: **246 boxes + 492 edges** to say what 246 non-overlapping
  table cells say with **zero** connective ink. That is the definition of a low data-ink ratio.
- **The axis is empty** (§1.4 finding 1). A layered DAG whose layering has three values and 71 % mass in
  one layer is not a layered DAG; it is a list with extra geometry.
- **It cannot answer Job A at all.** "Which corpora concentrate in which families?" requires seeing all
  246 claims at once. The form's own cap forbids it.
- **Path-following is the one task node-link wins** (Ghoniem–Fekete–Castagliola, and the density
  literature generally: above roughly 20 nodes the matrix beats node-link on nearly every task *except*
  path-following). Job A involves **no paths** — the spine is depth-2 and every path is
  `work → claim → type`, which is precisely the trivial case. Job B *is* path-following — so node-link
  is right there, and only there.
- **Palette failure, computed** (§4.2): the 8 culture accents fail the all-pairs CVD gate.

**Verdict:** the right form for 45 records, applied to 508. Rescope it to the 45.

#### (b) Sankey / layered flow for the spine — **REJECTED**

`corpus(5) → family(13) → grade(4)` is drawable (147 culture→family ribbons of 559 possible), and it
would look impressive. It is the wrong instrument on this site for three reasons:

- **Ribbon width would be an honesty hazard.** The flow quantity is *claim count*, which is a count of
  **research rows from five differently-sized slices** (78 / 51 / 47 / 43 / 27). Painting that as flow
  magnitude invites "South Asian tantra has more procedure than the Latin West" — a statement about
  survey effort, on a page whose own §limits says *"Silence in this graph is not evidence of absence; it
  is evidence about what has been surveyed."* A Sankey would contradict the page's own disclaimer in the
  loudest channel available.
- **It dissolves the addressable unit.** A ribbon is an aggregate; a claim is a citable, strikable
  record. Aggregating destroys exactly what D1 built.
- **It cannot draw absence.** The 16 claimless works and the 26 warranted-empty vocabulary terms are
  load-bearing meaning here (D3: *"an empty term is the reason a later round does not force PGM
  logos-recitation into mantra-recitation"*). A flow diagram has no way to show a channel that carries
  nothing on purpose. A matrix has: an empty column.

#### (c) Bipartite node-link (works left, types right) — **REJECTED (dominated)**

This is the matrix with its cells replaced by 246 crossing lines. Strictly worse: 246 crossings instead
of 246 non-overlapping cells, no place to put the ordinal value, and no seriation. It is the matrix's
dominated cousin and there is no configuration in which it wins.

#### (d) Small multiples faceted by culture — **REJECTED as faceted, ADOPTED as row-grouping**

43 cultures with a median of 1 work is 43 panels, most containing one row. Non-starter.
But faceted by **corpus (`sliceFile`, 5 values)** it is exactly right — and it does not *compete* with
the matrix, it *is* the matrix's row grouping. Adopted as a modifier (§3.1), not an alternative.
Note this also means the 5 corpora are separated by **position and heading**, not hue — so faceting here
costs zero colour and never triggers the all-pairs series cap.

#### (e) Arc / edge-bundled diagram for the 45 relation-claims — **RIGHT JOB, WRONG DEVICE**

The job is right: the relation-claims deserve their own view. The device is wrong at this scale. Edge
bundling exists to tame hundreds of crossing edges; **45 edges across 19 disjoint components with max
degree 4 have essentially no crossings to tame**, and bundling would actively destroy the most legible
fact in the data — that the transmission record is 19 separate small stories, not one web. Replaced by
small chain strips (§3.2), which are the same information with the component structure *preserved*.

#### (f) Matrix / heatmap, work × procedure-type, cell = completeness — **★ RECOMMENDED PRIMARY**

The decisive argument is not the density literature. It is this:

> **Exactly one claim per (work, type) cell. Zero collisions in 246 claims.**
> The matrix is not a *summary* of the spine. It is an isomorphism.

Consequences, each of which solves a stated problem:

1. **The cell IS the op-node.** No aggregation, no ambiguity, nothing lost. `work --CONTAINS--> claim
   --OF_TYPE--> type` renders as: row, cell, column. D1's discipline is *strengthened* — the claim is
   still the addressable thing, it has simply stopped needing two wires to say where it hangs.
2. **The picture and the ledger become one object.** A matrix in HTML is a `<table>` with
   `<th scope="row">` = work and `<th scope="col">` = term. AT parity stops being a *mirror that can
   drift* (D13's stated fear) and becomes an **identity**. The 32,649 px "Procedure claims" table is not
   shrunk — it is **deleted**, because the picture already is it. 85 rows ≈ 1,400 px replaces
   43,678 px of duplicated tables.
3. **Sparsity is a feature.** At 10.7 % the eye reads the *pattern of occupancy* — which is the finding.
   Seriated by corpus × family it states, without a word: Latin West concentrates in Address-to-powers
   (19) and Object (11); South Asian in Speech (18), Interior discipline (11), Offering (9);
   Greco-Egyptian in Address-to-powers (8), Regimen (7), Divination (7). That comparison is currently
   unavailable at any zoom level of the shipped page.
4. **Absence is drawable.** Empty rows = the 16 claimless works. Empty columns = the 26 warranted terms.
   Both become visible facts instead of table rows nobody scrolls to.
5. **It removes the only library pressure.** A matrix needs sorting (a total comparator — already this
   file's house style), grouping, and a 4-entry grade→step lookup. **No d3, no force layout, no bezier
   maths, no vendoring.** The recommended form is the one that keeps the offline-first constraint free.
6. **It is trivially expandable** (the owner's firm requirement), because a grid has no
   viewport-dependent layout to break — see §6.

**Cost, stated honestly:** 27 columns × 24 px minimum touch pitch = 648 px, so the matrix cannot be the
390 px view. That is a real limit and §7 answers it with something better than a shrunken desktop.

---

### 2.2 THE RECOMMENDATION

| # | view | job | form | colour job |
|---|---|---|---|---|
| **1** | **The Corpus Matrix** | A — distribution | seriated **work × procedure-type matrix**, rows grouped by corpus (5), columns grouped by family (13), cell = the procedure-claim | **ordinal**, one hue |
| **2** | **Transmission Threads** | B — network | **19 small chain strips** (small multiples), works as rects, relation-claims as interposed lozenges | **none** — status reserved, unspent |
| **3** | **The Evidence Meter** | headline | **hero figure + meter + small table** — *not a chart* | one hue, same ramp |

View 3 is the skill's "is it even a chart?" answer applied to the page's most important and most buried
number: **217 of 246 grades (88 %) rest on `genre-norm`**, and the PLAN rules that genre-norm grades are
*excluded from every headline count*. So the headline count is **29, not 246**. That is one number with
one ratio → per `choosing-a-form.md`, a hero figure + meter, never a chart.
This is also why I did *not* propose a stacked bar for the six bases: counts are `217 / 12 / 6 / 6 / 4 /
1`, so five segments would be sub-1 % slivers with clipped labels — a direct hit on the
"label clipped by a too-small stacked segment" anti-pattern. Meter + a six-row table instead.

---

## 3 · THE THREE VIEWS, SPECIFIED

### 3.1 View 1 — The Corpus Matrix

**Geometry.** Rows = works (85 with ≥1 claim, plus the 16 empty ones shown greyed in their corpus block
so absence is visible). Columns = 27 occupied terms, grouped into the 13 families in shipped `familyId`
order (F1…F13). Optional ghost strip below for the 26 warranted-empty terms.

**Seriation (deterministic, no eigenvectors, one sentence to explain).**
Default rows: **corpus block (`sliceFile`, 5, fixed order) → claim count desc → label → id.**
Default columns: **family (F1…F13, fixed) → occupancy desc → term.**
Alternate row sorts offered as controls: label A–Z · claim count · best grade · weight · attribution
pressure. **Sorting never repaints anything** — colour follows the grade, which follows the claim; the
"recolor-on-filter" anti-pattern cannot occur here by construction.

**Cell encoding.**

| channel | carries | why |
|---|---|---|
| **row position** | the work | node kind by position, never hue |
| **column position** | the procedure-type; column *group* = the family | ditto; 13 families > 8-hue ceiling, so position is the only legal answer |
| **cell fill** | `textCompleteness` — **ordinal ramp, 4 live steps** (§4.3) | the one variable whose whole point is *degree* |
| **cell empty** | no claim — bare surface + hairline grid | absence is a fact, not a gap |
| **⊘ + neutral hatch** | `textCompleteness === null` (withheld) — **0 today, slot reserved** | D5: "a withheld grade is a result, not a gap" — it must never look like an empty cell |
| **≠ overprint on darkest step** | `unstable-plural` — **0 today, reserved** | it is *off* the ramp (complete-but-plural), so it must not be a 5th ramp step |
| **2 px inset ring in `--dg-strong`** | `completenessBasis !== 'genre-norm'` — **the 29 evidenced claims** | **emphasis form**: mark the 29 that count, don't hatch the 217 that don't |
| **⚠ corner notch, `--bad`** | `harm` non-empty (45) | status colour for status meaning — legal per the collision rule |
| **dotted cell edge** | `unverified` (16) | flag, secondary channel |
| **small ↻** | `retypePending` (12) | flag |
| — | `doNotQuote` (0) — reserved, unused; say so in the legend | |

**Why the emphasis inversion matters.** `opgraph.css` currently hatches genre-norm grades. At 217 of 246
that means **88 % of the matrix would be hatched** — a dense 45° field across nearly the whole grid,
which `marks-and-anatomy.md` names a vestibular risk and which would read as decoration, not meaning.
Inverting it (ring the 29 evidenced) is quieter, truer to "genre-norm is excluded from every headline
count", and puts the emphasis on the thing the page should be proud of.

**Row rail.** Work title (truncated, full text in `title` + the drawer), role glyph (`ROLE_GLYPH`,
already shipped), claim count, and the culture **named in words** — never a hue.

**Column head.** Family group headers horizontal (F1 · Speech …). **Per-term labels are NOT rotated** at
inline size — rotated 27-label axes are the label-collision anti-pattern. Terms appear (a) in the
hover/focus band readout, (b) in the ledger, (c) as real horizontal labels **at fullscreen**, where the
column pitch grows enough to fit them. That is the reward for expanding.

**Grouping bands, not colour.** Alternating family groups get a 1.05:1 surface tint
(`--dg-fill` / `--surface-wash`) plus a 2 px gap. That is grouping-by-position with a whisper of
surface; it encodes nothing and is legible in `forced-colors`.

**Second cell variable — a view toggle, never a second scale.** One control, in the filter row:
`Cell shows: Completeness (default) · Evidence basis · Incompleteness kind · Attribution pressure`.
Each swaps the *whole* encoding and its legend. Never two at once, never a dual scale.
Two rules on the alternates:
- **`incompletenessKind` is NOMINAL** (constitutive / damaged / gated / truncated) — it must **not** get
  a ramp ("a value-ramp on nominal categories"). It renders as 4 glyphs on a single neutral field with
  direct labels at fullscreen.
- **`attributionPressure` is a repo-computed heuristic**, explicitly "not a scholarly finding". Giving a
  self-computed number the loudest channel by default would be this page's worst honesty failure. It is
  **opt-in only**, gets its own second single-hue ramp with a scale legend, and prints
  `ATTRIBUTION_PRESSURE_NOTE` inline whenever it is active.

### 3.2 View 2 — Transmission Threads

19 strips in a responsive flow (`grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr))`), ordered
by component size desc then by first label. Each strip is a small left-to-right chain:

```
[ Hygromanteia ]  ⇢( TRANSMITS_TO · not asserted )⇠  [ Key of Solomon ]
                       reason on the face, struck
```

- **Works** = rects. **Relation-claims** = interposed lozenges. The op-node discipline rendered
  literally — this is the layered DAG D11 asked for, applied only to the 45 records that *are* a DAG, at
  a size (≤9 nodes) where layering means something. `maxRank = 2` is fine inside a 9-node strip; it was
  never fine as the axis of a 508-node canvas.
- **Colour: none.** All 45 are `label: 'documented'` — the status channel has **zero variance this
  round**. Painting 45 lozenges gold would imply a contrast that does not exist. The legend says so
  explicitly: *"all 45 relations in this dataset are labelled documented; the disputed / debunked /
  conspiracy tokens are reserved and unused this round."* That sentence is worth more than the ink.
- What *does* vary gets **shape and text**: relation kind → glyph + word (⇢ transmits · ❡ comments ·
  ∥ parallels · ≠ non-edge); `asserted:false` (2) → dashed + strikethrough + `notAssertedReason` on the
  face (never hidden — D6); `procedureLevel:true` (3) → doubled border + the `propagatedTypeTerm`
  printed, since that is the Mallinson standard and there are only three of them.
- The single `NON_EDGE` gets its own strip with `confusedBy` on the face.
- `weight` → the existing 3-step border thickness **beside the printed number** (there is room here;
  there is not in a 14 px cell).

### 3.3 View 3 — The Evidence Meter (not a chart)

```
        29                        of 246 procedure claims rest on inspected evidence
   ▇▇▏░░░░░░░░░░░░░░░░░░░░░░░░░   the other 217 are graded by genre-norm and are
                                  excluded from every headline count on this page
```

Hero figure **29** ≥48 px, **in the sans, not the serif** (a serif hero is the "display face on the hero
figure" anti-pattern), **proportional figures** (`tabular-nums` only in the table below it). Meter fill
= ramp step 1 with a **4 px rounded data-end, square at the baseline**; track = the ramp's lightest step
(same-ramp track, per `marks-and-anatomy.md`). Below it, a six-row basis table with `tabular-nums`.

Two companion tiles, same treatment, same measured honesty:
`repoCoverage recorded on 7 of 246` · `witnessCompleteness recorded on 41 of 246`.
These are the three-axis promise measured against itself; the current page implies three live axes and
two of them are 97 % and 83 % null.

---

## 4 · STEPS 2 & 3 · THE COLOUR WORK

### 4.1 Harvested token ramps (what the repo already owns)

| family | steps | source |
|---|---|---|
| surfaces (parchment) | `--paper-0 #fffdf8` · `--paper-50 #fbf7ee` · `--paper-100 #f6efe0` · `--paper-200 #efe6d2` · `--paper-300 #e6dabf` | `style.css` |
| **diagram surface** | `--dg-fill #fffdf6` · `--dg-fill-2 #fbf4e3` | `style.css` — the surface I validate against |
| **gold ramp** | `--gold-100 #f7ecce` · `--gold-300 #d9b15a` · `--gold-500 #b8862b` · `--gold-700 #8a6420` | `style.css` |
| ink / rule | `--ink-900 #20242e` · `--ink-700 #494334` · `--ink-500 #6b6354` · `--ink-300 #9b8e6e` · `--rule-300 #d8cbac` · `--rule-500 #c2b48f` | `style.css` |
| diagram ink | `--dg-grid #c2b48f` · `--dg-tick #b3a37e` · `--dg-label #9b8e6e` · `--dg-strong #8a6a2a` · `--dg-ink #2a2419` | `style.css` |
| **status / epistemic** | `--ep-doc #b8862b` · `--ep-disp #4a68a8` · `--ep-deb #b23b2e` · `--ep-con #b06f1f` (+ wash/ink each) | `style.css` — **reserved** |
| verdict triad | `--ok #2f7d4f` · `--warn #b8862b` · `--bad #b23b2e` · `--info #2f7ca8` | `style.css` — **reserved for verdicts** |
| confluence lanes | 8 hues, `--lane-chr … --lane-dao` | `confluence.css`, page-scoped |
| opgraph culture accents | 8 hues `--og-c0 … --og-c7`, **identical to the confluence lane hues** | `opgraph.css`, page-scoped |

**Theme:** the site is **single-theme parchment** — `confluence.css` §10.3 states it, `style.css` has no
`prefers-color-scheme` block. **That stands here.** I validate against the surface actually targeted
(`--dg-fill #fffdf6`) and, per the brief, also run `--mode dark` against the surface a dark theme *would*
target (`--surface-inverse` = `--night-800 #0e1430`) so the ramp is portable if one ever ships (§4.5).

### 4.2 THE INCUMBENT PALETTE — validated, and it FAILS

The 8 `--og-c*` culture accents are assigned `i % 8` over 43 sorted culture ids
(`app/opgraph.js:173`). Before any aesthetic argument, two computed results:

**Adjacent pairlist** (the wrong test here, shown for completeness — it passes):

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
```

**All-pairs pairlist** — the *correct* test, because on a free node-link canvas (and in small multiples,
which the skill names explicitly) **any two nodes can end up side by side**:

```
$ node scripts/validate_palette.js "#3a6cb0,#9a5526,#6a4aa0,#00939c,#84831c,#b83f88,#8a4a22,#2f7ca8" \
    --mode light --surface "#fffdf6" --pairs all

Palette (light, surface #fffdf6, categorical): 8 slots
  [PASS] Lightness band         all 8 inside L 0.43–0.77
  [PASS] Chroma floor           all 8 >= 0.1
  [FAIL] CVD separation         worst all-pairs #b83f88↔#00939c ΔE 4.0 (deutan) · tritan 3.5
  [FAIL] Normal-vision floor    worst all-pairs #8a4a22↔#9a5526 ΔE 4.4 (normal)
                                — below 15, hard to tell apart even with full color vision
  [PASS] Contrast vs surface    all 8 >= 3:1
  → FAILED — fix the marked checks
exit=1
```

**Two hard FAILs.** Russet `#8a4a22` vs sienna `#9a5526` at **ΔE 4.4 under normal vision** is a hard
gate the skill says secondary encoding cannot excuse; magenta vs cyan-teal collapse to ΔE 4.0 under
deuteranopia. Per `color-formula.md` check 4, an all-pairs floor failure across eight series is *the
series cap binding* — the fix is fewer series or facets, **not** a re-order (the all-pairs pairlist does
not depend on order, so no permutation can rescue it).

And that is before the semantic problem, which is worse: **`i % 8` over 43 cultures**. Two adjacent
culture ids get different hues; ids eight apart get the *same* hue. `culture:latin-christian-renaissance`
and `culture:jewish-lurianic-safed` can share an accent. **The hue is noise wearing the costume of
identity.** Per `choosing-a-form.md` — *"More than ~7 classes that all carry meaning → a table, not more
colors"* — and the "cycling / generating hues past 8" anti-pattern.

**Ruling: delete the 8 culture accents from the encoding.** Culture becomes (a) a row-group label in
words, (b) a filter facet, (c) a ledger column, (d) drawer text. Nothing is lost — the CSS comment
already admits *"NOTHING is encoded by colour alone: every accent is accompanied by the culture's name."*
If the name was always doing the work, the hue was always decoration.

**Rejected alternative, stated:** borrow the Confluence atlas's 9 frozen lane hues via `atlasSlug`.
No — only **34 of 101** works carry an `atlasSlug`, so 67 works would be uncoloured, and re-using the
atlas's lane semantics for a *different* partition would make two pages disagree about what a hue means.
Cross-page consistency argues *against* borrowing here, not for it.

### 4.3 THE PRIMARY ENCODING — completeness, an ORDINAL ramp

`textCompleteness` is ordinal (`complete > partial > referenced > fragmentary`), so per
`color-formula.md`: **one hue, monotone lightness, more-is-darker. Never categorical hues.**

**What ships today is wrong in two separate ways**, and I measured both:

```
=== CURRENT completeness fills in opgraph.css — contrast vs card #fffdf8 ===
  cg-complete    = --ok-wash        #d8efd6   1.20:1     ← GREEN
  cg-partial     = --warn-wash      #faedcb   1.15:1     ← GOLD
  cg-referenced  = --surface-inset  #efe6d2   1.22:1     ← NEUTRAL
  cg-fragmentary = --info-wash      #eef5fa   1.08:1     ← BLUE
  cg-unstable    = --ep-disp-wash   #e7eef7   1.15:1     ← BLUE
  cg-withheld    = --surface-wash   #fbf7ee   1.05:1
```

1. **Four hues on an ordinal variable** — the reader cannot see the order in the colour, which is the
   entire purpose of an ordinal ramp.
2. **Borrowed from the verdict/status triad** (`--ok-wash`, `--warn-wash`, `--info-wash`) — the skill's
   collision rule, violated head-on. It paints `complete` **green/good** and `fragmentary`
   **blue/informational**, which is a *moral* reading of a *structural* fact. A fragmentary papyrus is
   not a failure; the site's own doctrine says a withheld grade is a **result**. This is the single most
   important colour change on the page, and it is a framing fix as much as a design fix.
3. And all six sit at **1.05–1.22:1** — a maximum separation of 0.17 contrast units. They are, in
   practice, **not distinguishable at all**.

**Candidate ramps tested** (all on `--dg-fill #fffdf6`, `--ordinal`):

| ramp | steps | result |
|---|---|---|
| A | site gold tokens as-is `#f7ecce,#d9b15a,#b8862b,#8a6420` | **FAIL** light-end 1.16:1 |
| B | `#ecd8a8,#d2a94f,#a87c22,#6f5216` | **FAIL** light-end 1.38:1 |
| C | `#e3cd9e,#c9a04a,#9c7420,#5f4712` | **FAIL** light-end 1.53:1 |
| D | warm-grey `#ded0b4,#bfa377,#8f7440,#57451f` | **FAIL** light-end 1.50:1 |
| E | `#d9b15a,#b8862b,#8a6420,#4f3a0e` | **FAIL** light-end 1.99:1 (0.01 short) |
| F | `#cfa14e,#a87c22,#7a5814,#4d380e` | PASS (light-end 2.33:1, hue spread 1°) |
| G | `#d3a751,#ab7c26,#7d5a16,#4a350c` | PASS (light-end 2.19:1) |
| **H** | **`#cfa14e,#b8862b,#8a6420,#5f4712`** | **PASS — SELECTED** |

Diagnosis of A–E: parchment is a near-white surface (`#fffdf6`), so any *wash*-weight light step is
below the 2:1 ordinal floor. The measured break-even is between `#d9b15a` (1.99:1) and `#cfa14e`
(2.33:1). **H is chosen over F and G because it reuses two shipped tokens verbatim** — `--gold-500` and
`--gold-700` — so only two new page-scoped steps are minted, exactly the `confluence.css` precedent.

**Selected ramp, validated:**

```
$ node scripts/validate_palette.js "#cfa14e,#b8862b,#8a6420,#5f4712" --ordinal --mode light --surface "#fffdf6"

Palette (light, surface #fffdf6, ordinal ramp): 4 slots
  [PASS] Lightness monotone     steps read light→dark
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #cfa14e at 2.33:1 vs surface
  [PASS] Single hue             hue spread 5°
  → ALL CHECKS PASS
```

**Slot assignment** (more-is-darker: darkest = the text accounts for most):

| token | hex | grade | n | contrast on `--dg-fill` | glyph (AT twin, already shipped) |
|---|---|---|---|---:|---|
| `--og-grade-4` | `#cfa14e` (new) | `fragmentary` | 8 | 2.33:1 | `◌` |
| `--og-grade-3` | `#b8862b` = **`--gold-500`** | `referenced` | 75 | 3.18:1 | `○` |
| `--og-grade-2` | `#8a6420` = **`--gold-700`** | `partial` | 107 | 5.26:1 | `▰▱` |
| `--og-grade-1` | `#5f4712` (new) | `complete` | 56 | 8.61:1 | `▰` |
| off-ramp | `--surface-inset` + 45° hatch | `withheld` (null) | **0, reserved** | 1.91:1 | `⊘` |
| off-ramp | `--og-grade-1` + `≠` overprint | `unstable-plural` | **0, reserved** | — | `≠` |
| off-ramp | bare surface + hairline | no claim | 2,049 cells | — | (empty `<td>`) |

Verified against **every** parchment surface a cell can land on, so the ramp cannot silently drop below
floor when a cell sits on a zebra row or an inset panel:

```
  #cfa14e  fragmentary   dg-fill=2.33  card=2.33  wash=2.22  inset=1.91  page=2.07
  #b8862b  referenced    dg-fill=3.18  card=3.19  wash=3.03  inset=2.61  page=2.83
  #8a6420  partial       dg-fill=5.26  card=5.26  wash=5.00  inset=4.31  page=4.67
  #5f4712  complete      dg-fill=8.61  card=8.62  wash=8.20  inset=7.06  page=7.65
```

⚠ **One WARN-class finding, and it is not dismissable.** On `--surface-inset #efe6d2` the lightest step
falls to **1.91:1**, under the 2:1 ordinal floor. Two obligations, both cheap: **(a)** matrix cells sit
only on `--dg-fill` / `--surface-wash` — never on `--surface-inset` (a one-line CSS constraint);
**(b)** the relief channel ships regardless — the grade **word and glyph** are in every tooltip, every
drawer, every ledger row, and inside the cell itself at fullscreen. Per the skill, a sub-floor step
obligates a relief channel; it has one, and it is the site's own AT covenant.

### 4.4 The status palette — reserved, verified, and deliberately UNSPENT

```
=== --ep-* : WCAG text-contrast check (skill scope note: status is not judged by the categorical six) ===
  ep-doc  documented   mark #b8862b vs card 3.19:1 | ink #6b4d0c on its own wash 6.63:1 | on card 7.67:1
  ep-disp disputed     mark #4a68a8 vs card 5.38:1 | ink #2b4a6b on its own wash 7.83:1 | on card 9.00:1
  ep-deb  debunked     mark #b23b2e vs card 5.81:1 | ink #7a1d1d on its own wash 7.84:1 | on card 10.22:1
  ep-con  conspiracy   mark #b06f1f vs card 4.02:1 | ink #7a4a06 on its own wash 6.21:1 | on card 7.35:1
```

All marks ≥ 3.19:1, all inks ≥ 6.21:1 on their own washes. **The palette is sound and it is reserved.**
It is also **unused this round**: all 45 relation-claims are `documented`, so no epistemic distinction
exists to paint. The legend states that in words. Reserving a validated palette and declining to spend
it is the correct move; inventing contrast that isn't in the data is not.

`--bad` (`#b23b2e`, 5.81:1) is spent on exactly one status meaning — the 45 harm flags — always with
the ⚠ icon and the harm label, never colour-alone, never as a fill competing with the ordinal ramp.

**Grid / hairline tokens confirmed recessive** (one step off the surface, solid, never dashed):

```
  border         #d8cbac  1.58:1     ← cell hairlines
  dg-grid        #c2b48f  2.02:1     ← group rules
  dg-label       #9b8e6e  3.18:1     ← axis text
  dg-strong      #8a6a2a  4.94:1     ← the evidenced-cell emphasis ring
```

### 4.5 Dark mode — the decision, and the answer if it ever changes

**Decision: single-theme parchment stands.** `style.css` is DO-NOT-TOUCH and has no
`prefers-color-scheme` block; introducing a dark theme on one page would fork the design system. The
skill's dark-mode requirement is met by *selecting* the dark steps now and documenting them, so a future
theme is a substitution, not a redesign.

```
$ node scripts/validate_palette.js "#cfa14e,#b8862b,#8a6420,#5f4712" --ordinal --mode dark --surface "#0e1430"
  [PASS] Lightness monotone · [PASS] Adjacent ΔL · [PASS] Light-end contrast #5f4712 at 2.06:1 · [PASS] Single hue
  → ALL CHECKS PASS

$ node scripts/validate_palette.js "#7a5a1c,#a3781e,#cfa14e,#e3cd9e" --ordinal --mode dark --surface "#0e1430"
  [PASS] Lightness monotone · [PASS] Adjacent ΔL · [PASS] Light-end contrast #7a5a1c at 2.85:1 · [PASS] Single hue
  → ALL CHECKS PASS
```

The light ramp technically survives on `--night-800` at 2.06:1 — a 0.06 margin, i.e. an accident, not a
design. The **selected** dark ramp re-anchors the direction (more-is-*brighter* on a dark ground) and
clears at **2.85:1**: `complete #e3cd9e · partial #cfa14e · referenced #a3781e · fragmentary #7a5a1c`
(7.63 / 4.53 / 2.85 · and 11.62:1 at the top). Ship as commented tokens; do not activate.

### 4.6 The result: **no categorical palette is required**

| variable | statistical type | channel | hues spent |
|---|---|---|---|
| completeness | **ordinal** | single-hue ramp, 4 steps | 1 hue |
| node kind | nominal | **position** (row / column / cell / lozenge) | 0 |
| culture (43) | nominal, >7 classes | **words + filter + row group** | 0 |
| corpus (5) | nominal | **facet: row blocks + headings** | 0 |
| family (13) | nominal, >8 | **column groups + gap + header** | 0 |
| epistemic label | **status** | reserved, zero variance → unspent | 0 |
| harm / doNotQuote | **status** | `--bad` + ⚠ + label | (status, reserved) |
| basis (evidenced) | binary | **emphasis ring**, `--dg-strong` | 0 |
| asserted / procedureLevel / unverified | flags | stroke style + glyph + text | 0 |
| weight | quasi-ordinal | printed number + 3-step stroke (threads only) | 0 |
| attributionPressure | heuristic | opt-in second ramp, own legend + disclaimer | 1 hue, opt-in |

**One hue does the whole page.** The eight-hue categorical palette that fails the all-pairs gate is not
replaced by a better eight — it is **not needed**, because no variable in this dataset does identity
work across more than the position channel can carry. That is the cleanest possible resolution of the
`--pairs all` series cap: not a palette change, a *form* change, exactly as `color-formula.md` prescribes.

---

## 5 · MARK SPECS

| element | spec |
|---|---|
| **cell** | 14 × 14 px inline · **2 px surface gap** (never a border — the gap is the separator) · `--rad-1` 4 px |
| **cell, fullscreen** | `clamp(18px, (availW − rail) / 27 − 2, 40px)`; at ≥ 26 px the grade glyph prints inside the cell, ink or paper chosen by fill luminance |
| **cell, coarse pointer** | minimum **24 px** pitch (`@media (pointer: coarse)`); if 27 × 24 = 648 px does not fit, the matrix does not draw — §7 |
| **hit target** | ≥ **24 px** transparent hit rect centred on every cell (includes the 2 px gap), plus a full-row and full-column hover band so the pointer only has to be *near* |
| **grid / rules** | 1 px **solid** hairline, `--border` (1.58:1); family rules `--dg-grid` (2.02:1). **Never dashed** — dashing reads as "threshold" |
| **emphasis ring** | 2 px **inset** ring `--dg-strong`, on the 29 evidenced cells only |
| **row rail** | left-aligned, `text-overflow: ellipsis`, full text in `title` + drawer. **Never clipped by `overflow:hidden` mid-glyph** |
| **direct labels** | **selective**: family group headers always; per-term labels only at fullscreen; **never a value in every cell** |
| **legend** | always present — the 4-step ordinal scale with its glyphs and words, the reserved slots named, the emphasis ring and the ⚠/⊘/≠/↻ glyphs |
| **meter** | fill = ramp step 1, **4 px rounded data-end, square at the baseline**; track = ramp step 4 (same-ramp track) |
| **hero figure** | ≥ 48 px, **sans** (`--font-sans`), **proportional** figures |
| **numbers in columns** | `tabular-nums` (ledger, axis, basis table) — and nowhere else |
| **text colour** | always a text token (`--text` / `--text-muted` / `--text-faint`). **Text never wears the ramp colour.** The only exception: a glyph *inside* a filled cell at fullscreen, chosen by luminance |
| **threads: works** | rect, `--rad-1`, `--surface-card`, 1 px `--border-strong`; weight → 1/2/3 px top border **beside the printed number** |
| **threads: relation-claims** | lozenge, `--rad-3`; struck = dashed + `line-through` + reason; procedureLevel = 2 px border + printed term |
| **texture** | **opt-in only** — `forced-colors`, print, and an explicit a11y setting; 45°/135° only; ordered on the value scale. Never the default (the current 88 %-hatch would be exactly the anti-pattern) |

---

## 6 · THE HOVER / TOOLTIP LAYER, AND THE WHOLE-PAGE EXPANDABLE VIEW

### 6.1 Hover & focus (per `interaction.md`: on cells, the mark is the hit target — no crosshair)

- **Cell hover/focus** lights the cell (outline lift), and illuminates its **row band and column band**
  so the reader can trace back to both headers without moving the eye off the cell. That is the
  matrix's equivalent of the crosshair, and it is what makes a 27-wide grid readable without rotated
  axis labels.
- **Tooltip**, identical on `pointermove` and `focus`, **value-first**: grade word + glyph (Strong) →
  work · term · family → basis (and "genre-norm — excluded from headline counts" when it is) →
  incompletenessKind → weight → harm → the verbatim `completenessEvidence` sentence → `cite`.
- **`textContent` only.** Every label here is generated data carrying diacritics, quotes and long
  scholarly titles. Never `innerHTML` string concatenation — the current painter builds node faces by
  string concat, which is a pattern not to carry forward into the tooltip.
- **Tooltips never gate.** Enter/click opens the existing drawer with the full record; the ledger row
  carries the same values as text; print expands everything.
- **Keyboard**: roving `tabindex` on the grid (the page already does this for nodes), arrows move by
  cell, Home/End by row, PageUp/Down by corpus block, Enter opens the drawer, Escape returns focus.
- **Filters: one row, above everything they scope** — already true, and it must scope **all three
  views** so matrix, threads, meter and ledger always agree. The existing 4 collapsed facet groups +
  weight/harm/struck strip stay; add `Cell shows:` and `Sort rows by:`.
- **No skeleton flash** on re-filter: hold the previous render at reduced opacity. Because the default
  state must be the final state, the cross-fade lives **only** inside
  `@media (prefers-reduced-motion: no-preference)` and runs through `app/motion.js`'s conductor —
  reduced-motion gets an instant, jump-free swap.

### 6.2 Whole-page expandable — treated as the firm requirement it is

Three states on one `<figure class="og-frame">`, driven by one `aria-pressed` toggle group:

| state | height | what changes **in the data**, not just the size |
|---|---|---|
| `inline` | ~60 vh, frame owns its own scroll | 14 px cells; family headers; row rail truncated |
| `tall` | ~90 vh | 18–22 px cells; row rail widened; column terms abbreviated |
| **`full`** | **viewport** | **cap lifted — all 85 rows, all 27 columns**; cells 26–40 px so the **grade glyph prints inside the cell**; **per-term column labels become real horizontal text**; a side rail carries the selected record; the ledger scrolls beside it |

**The load-bearing rule:** *expanding must change what is drawn, not merely how big it is.* Anything
less is a zoom button. The reward for going fullscreen is per-term labels and in-cell glyphs — real
information that does not fit at 14 px.

**Implementation, offline-first, no library:** `requestFullscreen()` on the `<figure>` with `:fullscreen`
CSS, **and** a `position:fixed; inset:0; z-index:var(--z-toast)` `.og-expanded` class as the fallback
path, so it works where the API is blocked or unsupported. Escape exits both; focus returns to the
toggle; `aria-pressed` and a live-region announcement carry the state. The frame **never** lets content
scroll the page sideways — it owns `overflow` in both axes, which the page's existing `.og-scroll`
discipline already establishes.

**All geometry stays in `core/`.** Add one pure function beside `layoutOpgraph`:

```
layoutOpMatrix({ width, height, cellMin, cellMax, rowSort, colGroup, filter })
  → { rows[], cols[], colGroups[], rowGroups[], cells[], cell, pitch, meta }
```

Deterministic, DOM-free, no `Date`, no `Math.random`, total comparators throughout — identical in style
to what is already there, and *simpler*, because a matrix needs sorting and grouping where the DAG
needed Tarjan SCC, feedback-arc removal, Kahn longest-path and a 4×2 barycentre sweep. `layoutOpgraph`
**stays** — rescoped to View 2, where it is finally the right tool, over 45 records instead of 508.

### 6.3 AT parity — strengthened, and the 32,649 px wall removed

The covenant is *"every visual fact must also be available as text."* It has never required 43,678 px of
expanded duplicate tables. The matrix satisfies it more strongly than a mirror can:

- The matrix **is** an HTML `<table>`: `<th scope="row">` = work, `<th scope="col">` = term, `<caption>`
  = the current filter. Screen-reader table navigation announces both headers per cell natively.
- Each filled `<td>` carries its grade as **text** (visually-hidden inline at small sizes, printed
  in-cell at fullscreen). **The visual fact and the textual fact are the same DOM node — they cannot
  drift.** That retires D13's stated fear rather than policing it.
- The 246-row × 15-column **"Procedure claims" table is deleted** (32,649 px). Its deep fields
  (evidence, cite, basis, incompleteness kind, harm note, stages) live in the drawer, reachable by
  Enter, and in a `<details>` per row — detail-on-demand, which is not a parity violation; the
  anti-pattern is a tooltip being the *only* path, and it is not.
- The 101-row "Works" table (11,029 px) becomes the matrix's **row rail** — same information, zero
  duplication.
- The threads view is a `<ol>` of 19 `<li>` chains; the meter is a `<figure>` with a `<figcaption>`
  stating both numbers.
- **Print CSS expands everything** — the ledger remains the print view, as today.
- Estimated page height: **~68,196 px → ~6,000 px**, with *more* of the dataset visible (all 246 claims
  instead of 39) rather than less.
- **Machine assertion, keep and extend** (D13): assert that the set of `(workId, typeTerm, grade)`
  triples in the rendered matrix equals `ledgerModel(state).claims` exactly. With the two now being one
  object, the assertion becomes near-tautological — which is the point.

---

## 7 · 390 px, HONESTLY

27 columns × 24 px coarse-pointer pitch = **648 px**. The matrix cannot be honestly drawn at 390 px, and
a 7 px cell would be a shrunken desktop — forbidden. The page already makes this ruling for the diagram
(`@media (max-width: 680px)` hides it); the replacement is what changes.

**Narrow view = a work-card list**, not a 32,649 px table:

```
┌──────────────────────────────────────────────┐
│ Kulārṇava Tantra              ▤ formulary    │
│ Kaula (Kulamārga) · c. 11th c. · 8 claims    │
│ ▰▱ partial   mantra-recitation    F1 Speech  │
│ ▰▱ partial   purification         F5 Regimen │
│ ○  referenced initiation          F11 …      │
│ … 5 more ▾                                   │
└──────────────────────────────────────────────┘
```

Each chip: the ramp step as fill, **the grade word as its text** (colour never alone), family named.
Same filter, same counter, same drawer, same records. 85 cards ≈ 7,600 px for the **whole** dataset,
against 43,678 px of tables that show the same thing today. The threads view survives at 390 px
unchanged (a 9-node strip wraps to two lines); the meter is already narrow-native.

---

## 8 · THE CONFLUENCE PRECEDENT — where it transfers and where it must not

| atlas mechanism | verdict here |
|---|---|
| **The contained "instrument frame"** — a viewport owning its own scroll, never scrolling the page | **ADOPT.** `.cfl-instrument` is exactly the shell the matrix needs; the expand states hang off it. |
| **Forced single-column "Ledger" mode under 720 px** | **ADOPT**, with the card list (§7) as its content instead of raw tables. |
| **Sticky readout strip** (`.cfl-ledger-era`) | **ADOPT** as a sticky column-family header + a live count of what the filter shows. |
| **Search with fly-to** | **ADOPT**, retargeted: fly-to-**row**, scroll into the frame, flash the row band. |
| **Momentum pan** | **REJECT.** A matrix has no unbounded canvas to fling across. Its navigation is *sort, filter, scroll-to* — semantic, not spatial. |
| **Three-level spring zoom with a continuous bridge** | **REJECT** as zoom; **REPLACE** with the three expand states (§6.2), which change *what is drawn*, not the scale factor. |
| **Minimap with a draggable lens** | **REJECT.** A minimap is a wayfinding aid for a canvas larger than any view. The matrix at fullscreen shows **all 85 × 27** at once — there is nothing to be lost in, so a lens would be furniture. |
| **Semantic-zoom clustering** | **REJECT as implemented; REPLACE with a data operation.** The matrix's "zoom out" is collapsing 27 terms → 13 families. ⚠ **This has a real consequence I measured: work × family has 14 cells holding >1 claim (max 3).** A collapsed cell must therefore show a **count**, and its grade must be the *best* grade with the count visible — never a silent merge. State it in the legend or don't ship the collapse. |
| **8 lane hues** | **REJECT for this page** (§4.2) — and note the opgraph accents are literally the same 8 hues, which is how the modulo-43 bug got in. |

**Where this data needs something the atlas never did:** the atlas plots ~190 entries on a real
**time** axis in nine curated lanes — a genuine 2-D spatial structure where pan, zoom and a minimap
earn their keep. This dataset has **no honest spatial axis at all**: rank has three values, the atlas
owns time (§1.2 of the PLAN), and culture is 43-way nominal. A dataset with no spatial axis should not
be given a spatial instrument. It should be given a **table with a visual channel** — which is a matrix.

---

## 9 · ANTI-PATTERNS CHECK, ITEM BY ITEM

**Colour & encoding**

| # | anti-pattern | status |
|---|---|---|
| 1 | Dual-axis (two y-scales) | ✅ **Clear.** No dual scale anywhere. The multiple cell measures are a *view toggle* — one encoding, one legend at a time — explicitly instead of overlaying two. |
| 2 | Recolour-on-filter | ✅ **Clear by construction.** Fill follows the claim's grade, which is a property of the entity. Sorting and filtering re-order rows; no survivor is ever repainted. |
| 3 | Cycling / generating hues past 8 | ⛔ **PRESENT TODAY — FIXED.** `i % 8` over 43 cultures (`app/opgraph.js:173`). Removed entirely; culture moves to words + facet + filter. |
| 4 | Eyeballing colourblind-safety | ✅ **Computed, not reasoned.** Validator run 12 times across the incumbent (adjacent + all-pairs), 8 candidate ordinal ramps, 2 modes; every table pasted in §4. |
| 5 | Value-ramp on nominal categories | ✅ **Clear, and guarded.** The ramp carries `textCompleteness`, which is genuinely ordinal. `incompletenessKind` is nominal and is explicitly **denied** a ramp (glyphs on a neutral field). |
| 6 | Rainbow / non-neighbour sequential | ⛔ **PRESENT TODAY — FIXED.** Current grades run green → gold → neutral → blue → blue. Replaced with one hue, 5° spread, light→dark. |
| 7 | Hue at a diverging midpoint / two cool poles | ✅ **N/A.** Nothing here is diverging; there is no baseline to be on two sides of. |
| 8 | Status colour for a non-status series | ⛔ **PRESENT TODAY — FIXED.** `--ok-wash` / `--warn-wash` / `--info-wash` currently encode completeness, which is structural, not a verdict. Status tokens are returned to status use only (harm, and the reserved `--ep-*`). |

**Form**

| # | anti-pattern | status |
|---|---|---|
| 9 | Eight categorical hues when the story is one number | ⛔ **PRESENT TODAY — FIXED.** The story *is* one number — **29 of 246** rest on inspected evidence — and it is currently absent from the page while eight hues encode a cycled culture index. Answered with a hero figure + meter (View 3) and the emphasis ring. |
| 10 | One-bar bar chart / 2-slice pie | ✅ **Clear.** The 29/246 ratio is a meter; the six bases are a table, not a 5-sliver stack. |
| 11 | Donut/pie for close values | ✅ **Clear.** None used. |
| 12 | More than ~7 colour classes carrying meaning | ✅ **Clear** — 4 live ramp steps + 2 reserved off-ramp states. (Today: 8 cycled hues + 6 grade hues = 14. ⛔ fixed.) |

**Marks & chrome**

| # | anti-pattern | status |
|---|---|---|
| 13 | Thick saturated blocks, heavy grid, no breathing room | ✅ **Clear.** Saturated fills only on 14 px cells (the skill's sanctioned "small marks" case); hairline solid rules at 1.58–2.02:1; 2 px gaps throughout. |
| 14 | Dashed gridlines / axis rules | ✅ **Clear.** All rules solid. Dashing is reserved for *meaning* — struck relations and `RECONSTRUCTED_THROUGH` — which is what dashing should signal. |
| 15 | A number on every data point | ✅ **Clear.** No per-cell values inline; family headers + hover band + tooltip + ledger carry them. In-cell glyphs appear only at fullscreen, where they fit with padding. |
| 16 | A border drawn around marks to separate them | ✅ **Clear.** 2 px **surface gap** is the separator. The one stroke that exists — the evidenced-cell ring — is *encoding a variable*, not separating marks. |
| 17 | Label clipped by / overflowing a too-small mark | ✅ **Clear, measured.** In-cell glyphs only at ≥26 px cells. Row-rail titles ellipsise with full text in `title`, drawer and ledger — never `overflow:hidden` mid-glyph. **This is also why per-term column labels are horizontal-at-fullscreen rather than rotated-always.** |
| 18 | Fixed container height excluding the axis band | ✅ **Clear.** The frame sizes to plot + column-header band + rail; the frame scrolls internally, never a nested mini-scrollbar. (Today: a fixed 3000 × 2400 SVG inside a `max-height:70vh` box — ⛔ exactly this.) |
| 19 | Display/serif face on the hero figure | ✅ **Clear.** Hero in `--font-sans`, on a serif-first site — called out because the temptation here is strong. |
| 20 | `tabular-nums` on a large standalone number | ✅ **Clear.** Proportional on hero and tiles; `tabular-nums` only in ledger columns, the basis table and axis ticks. |
| 21 | Texture on by default / as decoration | ⛔ **PRESENT TODAY — FIXED.** `og-hatched` would hatch **217 of 246** cells (88 %). Inverted to an emphasis ring on the 29; texture demoted to opt-in (`forced-colors`, print, a11y setting), 45°/135° only. |

**Interaction & accessibility**

| # | anti-pattern | status |
|---|---|---|
| 22 | Tooltip as the only way to read a value | ✅ **Clear.** Every value is in the cell text, the drawer, the ledger and print. Keyboard focus shows exactly what hover shows. |
| 23 | Pinpoint hover targets | ✅ **Clear.** ≥24 px hit rect per cell including the gap; row/column bands make "near" sufficient; coarse pointers force a 24 px pitch or fall to cards. |
| 24 | Per-chart filters / filters inside a chart card | ✅ **Clear.** One filter row above all three views; every view and the ledger re-render against the same `filterGraph(state)`. |
| 25 | Skeleton flash on refetch | ✅ **Clear.** Previous render held at reduced opacity; the fade is inside `prefers-reduced-motion: no-preference` and runs through `app/motion.js` — reduced-motion default is an instant swap with no layout jump. |
| 26 | No table view / colour-only on a continuous scale | ✅ **Best-in-class.** The table view is not a twin — **it is the same object**. Grade word + glyph accompany every fill everywhere. |

**Seven live anti-patterns in the shipped page** (#3, #6, #8, #9, #12, #18, #21). All seven are resolved
by the form change plus the palette change; none needs a new library, a build step, or a `style.css`
edit.

---

## 10 · WHAT I DID NOT RESOLVE (for the owner / next round)

1. **The 26 warranted-empty vocabulary terms** — I propose a ghost strip below the matrix. Whether they
   belong as ghost *columns* (in-grid, honest but visually noisy at 53 columns) or a separate strip
   (quieter, slightly demoted) is an editorial call about how load-bearing D3 is meant to look.
2. **The 16 claimless works** — shown greyed in their corpus block. Alternative: a separate
   "surveyed, no procedure typed" list. Same question: how loud should absence be?
3. **Family collapse arithmetic** — 14 work×family cells hold >1 claim (max 3). The collapsed view needs
   a stated rule (best grade + count). If the owner does not want a merge rule at all, drop the collapse.
4. **`repoCoverage` (7/246) and `witnessCompleteness` (41/246)** — I surface them as stat tiles rather
   than as encodings, because 97 % / 83 % null cannot honestly drive a visual channel. If a later round
   populates them, they become two more `Cell shows:` options at zero design cost.

---

## APPENDIX · EVERY VALIDATOR INVOCATION, VERBATIM

```
# skill base
S="C:/Users/mehta/AppData/Local/Temp/claude/bundled-skills/2.1.220/b9e646d39a5edfc4de6d3cffd3c22ad6/dataviz"
N="C:/Users/mehta/.conda/envs/astro-workbench/node.exe"

# 1 · incumbent 8 culture accents — adjacent (passes) then all-pairs (FAILS, exit 1)
$N $S/scripts/validate_palette.js "#3a6cb0,#9a5526,#6a4aa0,#00939c,#84831c,#b83f88,#8a4a22,#2f7ca8" \
   --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#3a6cb0,#9a5526,#6a4aa0,#00939c,#84831c,#b83f88,#8a4a22,#2f7ca8" \
   --mode light --surface "#fffdf6" --pairs all        # → FAIL ×2, exit 1

# 2 · ordinal ramp candidates A–H on the diagram surface  (A–E FAIL light-end; F,G,H PASS)
$N $S/scripts/validate_palette.js "#f7ecce,#d9b15a,#b8862b,#8a6420" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#ecd8a8,#d2a94f,#a87c22,#6f5216" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#e3cd9e,#c9a04a,#9c7420,#5f4712" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#ded0b4,#bfa377,#8f7440,#57451f" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#d9b15a,#b8862b,#8a6420,#4f3a0e" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#cfa14e,#a87c22,#7a5814,#4d380e" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#d3a751,#ab7c26,#7d5a16,#4a350c" --ordinal --mode light --surface "#fffdf6"
$N $S/scripts/validate_palette.js "#cfa14e,#b8862b,#8a6420,#5f4712" --ordinal --mode light --surface "#fffdf6"  # ★ SELECTED

# 3 · dark mode (documented, not activated — single-theme parchment stands)
$N $S/scripts/validate_palette.js "#cfa14e,#b8862b,#8a6420,#5f4712" --ordinal --mode dark --surface "#0e1430"
$N $S/scripts/validate_palette.js "#7a5a1c,#a3781e,#cfa14e,#e3cd9e" --ordinal --mode dark --surface "#0e1430"  # ★ if dark ever ships

# 4 · status palette + surface sweep + incumbent grade fills (contrast() from the validator)
$N ./status.mjs
```

**Tokens to add, page-scoped in `assets/css/opgraph.css` — the only literal colours in the file:**

```css
.opg-page {
  /* ORDINAL completeness ramp — single hue, validated on --dg-fill #fffdf6.
     Light-end 2.33:1 · hue spread 5° · all four ordinal checks PASS.
     Two steps ARE shipped tokens; two are minted here (confluence.css precedent). */
  --og-grade-1:#5f4712;              /* complete        8.61:1  ▰   n=56  */
  --og-grade-2:var(--gold-700);      /* partial     #8a6420  5.26:1  ▰▱  n=107 */
  --og-grade-3:var(--gold-500);      /* referenced  #b8862b  3.18:1  ○   n=75  */
  --og-grade-4:#cfa14e;              /* fragmentary     2.33:1  ◌   n=8   */
  /* off-ramp, reserved, 0 occurrences at R33 — NOT ramp steps: */
  --og-grade-withheld:var(--surface-inset);   /* + 45° hatch + ⊘ */
  --og-grade-unstable:var(--og-grade-1);      /* + ≠ overprint    */
  --og-evidenced-ring:var(--dg-strong);       /* the 29           */

  /* DELETED: --og-c0 … --og-c7. Eight hues cycled i%8 over 43 cultures;
     FAILS --pairs all (normal-vision ΔE 4.4, deutan ΔE 4.0). Culture is
     carried by row-group label, filter facet, ledger column and drawer text. */
}
```
