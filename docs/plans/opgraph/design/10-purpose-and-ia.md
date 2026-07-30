# THE OPERATIVE CORPUS — purpose, information architecture, reading order

**Role:** senior web / product designer. **Scope:** what the page is *for*, what goes where, in what order,
and what gets cut. **Date:** 2026-07-30 · repo tip `89e2622` (R32) + the shipped R33 opgraph round.

**Everything numeric below was measured, not recalled.** I read `pages/opgraph.html`,
`assets/js/app/opgraph.js` (1,341 lines), `assets/css/opgraph.css`, `assets/js/core/opgraph.js`
(1,328 lines), the generated `assets/js/core/data/opgraph.js`, and `docs/plans/opgraph/PLAN.md` in full,
then ran the shipped engine headlessly against the shipped data (probes in
`…/scratchpad/probe*.mjs`, node from the conda env per `verify-gate-env`). I also ran the dataviz skill's
`scripts/validate_palette.js` against the eight shipped culture accents. The dataviz skill's procedure is
followed in §6: **form first, colour by job, validator run, anti-patterns checked.**

---

## 0. THE TWELVE MEASUREMENTS THAT DECIDE THIS DOCUMENT

These are facts from the shipped module and the shipped engine. Several of them are not in the plan, not
in the page prose, and — I think — not yet known to anyone.

| # | measurement | how I got it |
|---|---|---|
| **M1** | **`maxRank` = 2.** Work ranks are distributed **72 / 25 / 4**. 71% of all works sit at rank 0. | `E.rankOf()` over all 101 works |
| **M2** | **The layout is width-blind.** `layoutOpgraph({width})` returns an identical **3000 × 2400** canvas at `width` = 390, 700, 1000 and 1440. `width` only reaches the output as `viewportWidth`. | 8 layout calls |
| **M3** | **Uncapped the canvas is 3000 × 13,200 px** and its nine bands hold **43, 46, 72, 219, 25, 67, 4, 5, 27** nodes. One band holds 219 of 508 nodes. | uncapped layout |
| **M4** | **The cap draws 119 and drops 389** — and **27 of the 119 drawn are culture/author gutter chips** (14 + 13) carrying no claim content. Works drawn: 33 of 101. Relation-claims drawn: **5 of 45.** | capped layout, by type |
| **M5** | **217 of 246 procedure-claims (88%) have `completenessBasis: 'genre-norm'`** — the basis the page itself says is "excluded from every headline count". The non-inferred corpus is **29 claims, over 24 works, in 17 cultures**: complete 10 · partial 12 · referenced 7. | census over claims |
| **M6** | **46 of the 56 `complete` grades are genre-norm.** The honest count of read-and-verified `complete` is **10**. | cross-tab |
| **M7** | **`procedureLevel` = 3.** The page's third headline question — *where did that sequence come from?* — is answered three times in the whole dataset. | relation-claim census |
| **M8** | **Seven taught distinctions have zero instances**: `unstable-plural` 0 · `withheld` 0 · `disputed`/`debunked`/`conspiracy` 0 (all 45 relations are `documented`) · `doNotQuote` 0 · `anatomyStagesInferred` 0 · `rankInversions` 0 · `RECONSTRUCTED_THROUGH` 0. The 873 px legend teaches all seven. | `opgraphStats()` + census |
| **M9** | **The eight culture accents fail the palette validator on all-pairs** (`#8a4a22` russet ↔ `#9a5526` sienna, ΔE **4.4** normal-vision, floor 15; `#b83f88` ↔ `#00939c` ΔE 4.0 deutan). And they encode **43 cultures via `i % 8`** — 5–6 unrelated cultures per hue. | `validate_palette.js … --pairs all` |
| **M10** | **The picture has no axis.** The engine computes `bands[]` with human labels (`"transmission rank 0"`, `"procedure types"`, `"cultures"`) and the painter **never renders them**. The prose says "left to right is rank"; nothing on the canvas says which column is which rank. | `stageSVG`/`stageNodesHTML` vs `layout.bands` |
| **M11** | **641 buttons ≈ 508 ledger row-links + 119 node faces + ~14 controls.** Every one of the 508 ledger rows is a `<button class="og-rowlink">` and therefore a tab stop. | `mirrorHTML` |
| **M12** | **The focus subgraph already works and is never called.** `layoutOpgraph({filter:{focus:'gw:heptameron'}})` returns **30 nodes in 2750 × 416 px** — a legible picture. `app/opgraph.js` never sets `focus`. | direct call |

Two more, smaller but load-bearing: **65 of 101 works have `role: null`** (the legend's four role glyphs
apply to 36 works); **16 works carry zero procedure-claims** (books in a "what does this book contain"
graph that contain nothing recorded); **12 works are undated**; **17 are contested**; **12 claims carry
`retypePending`**. Median work label is **51 characters**, max **152**, painted into a ~190 px box with
`white-space:nowrap; text-overflow:ellipsis`.

---

## 1. THE PURPOSE — one paragraph, for a stranger

> **The Operative Corpus is a catalogue of what a hundred historical ritual and contemplative books
> actually contain.** Not what they mean, not whether any of it works, and never how to do any of it. For
> each book it records which *kinds* of procedure are in it — drawn from a fixed vocabulary of 53 terms —
> how completely the book accounts for each one, on what evidence that judgement was reached, and who
> said so. It reproduces no procedure at any point: naming a stage is a map, ordering the sub-steps would
> be a recipe, and nothing here is one. Where a named scholar can say that a *particular procedure* — not
> merely a book's influence — travelled from one text to another, that is recorded too, with the witness.
> The page exists to answer three questions this site could not answer before: **which traditions actually
> set out a complete procedure and which only gesture at one; what a given book contains; and how far the
> evidence behind each of those answers really goes.**

That last clause is not modesty. Given **M5** and **M6** it is the page's most important sentence, and it
currently appears nowhere above 10,000 px.

**One paragraph the page must also be able to say, and cannot today:**

> Most of what follows is a *first pass*. 217 of the 246 procedure records grade the book from what its
> genre normally does, not from a reading of the book. Twenty-nine records were read. This page keeps the
> two apart everywhere, and it will not add them together.

---

## 2. WHO ARRIVES

Four arrivals, in descending order of volume. The page is currently built for the fourth.

| | who | arriving from | what they want in the first 15 seconds |
|---|---|---|---|
| **A1** | **The curious reader** — came off `contents.html` or the Confluence atlas | in-site nav, the atlas cross-link | *What is this and is it interesting?* A picture with an answer in it. |
| **A2** | **The comparative reader** — knows one tradition, wants the others | `contents.html`, search, an atlas entry's "operative content" link | *How does my corner compare with the rest?* |
| **A3** | **The looker-up** — has a book in mind (Śāradātilaka, PGM IV, Key of Solomon) | search, an atlas entry, a Great Works page | *That book. What does it say it contains, and how good is the evidence?* |
| **A4** | **The auditor** — a maintainer, a future round agent, a sceptic | the gate prose, `how-it-works.html`, a link to the tombstones | *What did you refuse to claim, and why?* |

**A4 is real and must be served — but it is one reader in fifty, and it currently owns the page.** Tables
D (vocabulary, 27 rows) and E (cultures + authors, 89 rows), the gate strip, the acyclicity report, the
"How this page is built" section and the method-note callout are all A4 surface, sitting inline in the
main reading column ahead of and inside the material A1–A3 came for.

---

## 3. THE THREE INTENTS THIS PAGE MUST SERVE

Each is written as the reader's own sentence, with the shortest honest path to an answer and the failure
mode if the page does not carry it.

### I1 · THE SURVEY — *"Which traditions actually set out a complete procedure, and which only gesture at one?"*

The comparison job, and **the reason this graph exists at all**. It is a magnitude-and-composition
question across ~17–43 named groups, answered by the distribution of `textCompleteness` per culture (or
per work), **split by `completenessBasis`** so that read grades and inferred grades never sum.

*Answer path today:* not available. There is no view that ranks or groups anything. The reader must read
246 rows of table B and tally by hand, and if they do, they get the wrong answer, because table B's
"best grade" column and the index's grade counts both silently include the 217 genre-norm rows.

*This is the intent the page most conspicuously fails, and it is the one its own hero promises first.*

### I2 · THE BOOK — *"What does THIS book contain, and how well is it attested?"*

The lookup job. One work → its claims, their kinds, the three completeness axes, the basis, the verbatim
evidence sentence, the editions and their per-edition PD verdict, the atlas cross-link, and the razor
statement. This is the record the whole schema was built to make citable.

*Answer path today:* **good, once you find it.** `dossierHTML` is genuinely excellent — it is the best
thing on the page. Getting to it is the problem: there is no search, the canvas draws only 33 of 101
works, and the alternative is scrolling into an 11,029 px table.

### I3 · THE WARRANT — *"How far does the evidence behind that actually go?"*

The scepticism job, and the one the site's whole framing constitution exists to serve. It has three sub-
questions: *is this grade read or inferred?* (217 vs 29), *did anyone actually say the procedure moved,
or only that one book influenced another?* (3 vs 42), and *what would change this?*

*Answer path today:* the facts are all present and all buried. `genre-norm` appears as one gloss inside
one index row. The `procedureLevel` distinction appears as a filled-vs-hollow diamond and a table column.
No headline states either.

### I4 · THE GATE — *"Show me what you rejected and why"* → **second page**

1,255 admitted · **102 excluded** · **17 tombstoned** with strike ids, reason codes, superseding
witnesses and revisit conditions. This is, as the plan says, the page's most unusual honest feature. It
is also a *different document with a different audience*, and putting it inline is what turns a map into
an archive. → §8.4.

### The intent I am explicitly demoting

*"Where did this sequence come from?"* is the hero's third promise and it is answered **three times**
(M7). It cannot carry a headline. It becomes a **finding**, not a frame: a small, legible, genuinely
node-link view of the 45 relation-claims, presented as *"the three procedure-level propagation claims in
this corpus, and the 42 work-level relations that were not upgraded to them."* That framing is more
interesting than the promise it replaces, because the 42 non-upgrades are the Mallinson standard doing
its job.

---

## 4. THE VERDICT — plainly

**A 68,196 px document whose instrument is invisible above the fold is a failure of intent, not of
taste.** I will say it in the terms the round itself would accept:

1. **The page does not answer its own first question.** I1 has no view. Not a weak view — none.
2. **The instrument is not an instrument.** It is a fixed 3000 × 2400 px still frame (M2) showing 119 of
   508 records (M4), 27 of which are gutter scaffolding, positioned on an axis with three values (M1)
   that is never labelled (M10), inside a `max-height:70vh` box, below ~9,000 px of prose.
3. **The picture and the ledger are not two views of one thing; they are a thumbnail and an archive.**
   The canvas shows 23% of the records; the ledger shows 100% of them at 43,678 px across two tables.
   AT parity is satisfied and *usability parity is inverted* — the text view is the complete one and the
   picture is the lossy one, which is the right principle and the wrong proportion.
4. **The page's headline numbers contradict the page's own stated rule.** It says genre-norm grades are
   "excluded from every headline count on this page." The index counts 56 `complete`; 46 of those are
   genre-norm (M6). Either the sentence or the number has to go, and it must be the number.
5. **The legend teaches seven things that never occur** (M8) and the filter bar offers an "Epistemic
   label" group with four facets of which three return zero rows. A reader who learns the vocabulary
   learns mostly about a dataset that does not exist yet.
6. **Colour is doing no job.** 43 cultures cycled through 8 hues (M9) is the skill's named anti-pattern —
   *"never solve too many series by generating more hues"* — in its worst form, because `i % 8` puts five
   or six unrelated cultures on the same accent, and the palette fails all-pairs validation anyway.
7. **The standing note is right and is in the wrong shape.** Its content is a covenant. Its 12-line
   single-paragraph form consumes most of the first screen and is therefore skimmed, which is the one
   outcome a covenant cannot afford.

### Why it happened — the honest diagnosis

**The round shipped data-first with the mirror as the deliverable, and the picture as a rendering of the
schema rather than as an answer to a question.** Four specific mechanisms:

- **The plan's §5.7 made the ledger the accessible representation and its parity assertion the test.** So
  the ledger got built to completeness — five tables, every field, every row, always rendered. Nothing in
  the plan or the tests ever asked *how tall is the page*, so nothing stopped it at 68,196 px. **The
  covenant was engineered; the reading experience was not specified.**
- **§5.6's D12 — "the default view is a FOCUS SUBGRAPH, not the whole graph", opening on the Heptameron's
  2-hop neighbourhood — was specified, is supported by the engine, and was not wired up** (M12). What
  shipped is exactly the thing D12 forbade: the whole graph behind a cap, i.e. a density map presented as
  a diagram. The `focus` parameter is one argument away.
- **The form was chosen against a predicted census, not the real one.** §5.2 argues for a layered DAG
  because rank is a real fact. It is — for **34 relations**. The plan predicted 92 relation-claims and 623
  nodes; 45 and 508 shipped, and the ranking relations (`TRANSMITS_TO` 25 + `COMMENTS_ON` 9) rank only 29
  of 101 works. **A layered DAG spends its entire primary axis on a variable with three values, 71% of
  them in the first**, and gives the other axis a 219-node column. That is not a bad implementation of the
  form; it is the wrong form for the data that actually arrived.
- **Nobody wrote down who arrives.** Every section on the page is defensible in isolation. The page is the
  sum of eight defensible sections in source order — hero, standing note, legend, structural report,
  index, graph, ledger, limits, build note, method note — which is a table of contents for the *build*,
  not a reading order for a *reader*.

None of this is a criticism of the data work. The schema, the gate, the three axes, the op-node
discipline and the dossier are all first-rate. **The problem is that the round produced an archive and
labelled it a map.**

---

## 5. WHAT SHOULD BE CUT

Named plainly, because "a page that tries to be a map, a ledger, an evidence archive and a policy
statement at once is why it is 68,000 px tall."

| cut | what happens to it | px recovered (measured/est.) |
|---|---|---|
| **Table B rendered in full, always** (246 rows, 32,649 px) | becomes the **Records list**: virtualised/paged, filtered, one row per claim, opened in the dock. Complete on demand and in print; not 246 rows of always-live DOM. | ~31,000 |
| **Table A rendered in full, always** (101 rows, 11,029 px) | same list, `type=work` | ~10,000 |
| **Table D · vocabulary** (27 drawn + 26 empty terms with warrants) | → **`pages/opgraph-vocabulary.html`** | ~2,500 |
| **Table E · cultures & authors** (89 rows) | 43 cultures become the survey's row axis (they are a *facet*, not graph content); 46 authors go to the vocabulary/appendix page | ~3,000 |
| **The gate strip + acyclicity report + `#structure` prose** | → **`pages/opgraph-gate.html`**; one result line stays on the page | ~1,400 |
| **"How this page is built" (2 ¶)** | → `pages/how-it-works.html` (it already exists and already carries this genre) + one link | ~600 |
| **The bottom method-note callout** | merged into the compressed standing note; the duplicated charter sentences deleted | ~500 |
| **"What this dataset cannot answer" as 7 hand-written `<li>`** | rendered **from `OPGRAPH_META.dataCeiling`** (7 items, already in the data), 3 shown + 4 disclosed | ~400 + a drift class removed |
| **The legend's six always-open panels** (873 px) | → §10 | ~700 |
| **The `Small / Normal / Large` zoom seg** | meaningless while the canvas is width-blind and capped; replaced by the instrument's own two-level semantic zoom | — |
| **The "Epistemic label" filter group** | 3 of 4 facets are empty (M8). Replaced by the **Basis** filter, which splits the data 217/29 and is the filter this dataset actually needs | — |
| **Colour-by-culture (8 accents, `i % 8`)** | deleted as an encoding (M9). Culture becomes a row axis and a filter facet, both of which carry the name in text | — |
| **The culture and author gutters as drawn columns** | 27 of 119 drawn nodes (M4) removed from the canvas; they are facets | — |
| **The 508 ledger row `<button>`s as permanent tab stops** (M11) | list rows become links within a virtualised list; the tab order stops being 500+ deep | — |

**Target: the document falls from 68,196 px to ≈ 6,000–7,000 px** with the instrument at the top of it,
and everything cut is still reachable — one control, one disclosure, or one link away. **Nothing above is
deleted from the site.** That is the whole test.

---

## 6. THE FORM DECISION (dataviz step 1 — done before colour, and it is allowed to say "not a node-link chart")

**The top-level view is not a node-link chart.**

The structural fact the brief names — 492 of 747 edges are `CONTAINS` + `OF_TYPE`, a tripartite
work → claim → type spine — is right, and it means "not a hairball". But the measurements push one step
further: **the spine is not a flow either.** A flow needs depth. This has `maxRank` 2 with 72/25/4 (M1).
Drawing work → claim → type as a layered graph draws a **three-column bipartite fan with a 219-node
column** (M3): 101 works fanning to 246 claims fanning into 27 chips. A node-link diagram of a fan is a
worse table.

Per the skill's job → form table:

| intent | the reader's job | **form** | colour's job |
|---|---|---|---|
| **I1 · Survey** | compare magnitude + composition across many long-named categories | **horizontal stacked bars, one row per culture (or per work), sorted by count**, faceted into **"read" (29) and "inferred" (217)** — small multiples, never summed | **sequential, one hue, light→dark** over the 4 occupied ordinal grades. Completeness is *ordinal*, not identity |
| **I1b · Coverage** | which of the 13 procedure families × which traditions | **heatmap** (13 families × top cultures), count per cell | sequential, same hue |
| **I2 · Book** | read one record | **not a chart** — a record card (the existing dossier, promoted) | none; ink tokens only |
| **I3 · Warrant** | one number that reframes the page | **stat tiles / hero figure** — `29 read · 217 inferred`, `3 procedure-level · 42 work-level` | status/emphasis: one accent, rest gray |
| **I3b · Propagation** | see the shape of 45 relations over ~60 works | **node-link — here it is correct.** 45 op-nodes, 3 ranks, ≈100 endpoints, legible at 2750 × 416 (M12) | epistemic label tokens (`--ep-*`) — but all 45 are `documented`, so **emphasis** on the 3 procedure-level + 2 struck |

**Colour by job, and the job is not culture.** Culture has 43 values — far past the skill's 7–8 token
ceiling — and the shipped `i % 8` cycle is the named anti-pattern *"cycling / generating hues past 8"*,
compounded by an all-pairs validator FAIL (M9). Culture becomes a **row axis** (self-labelling, unlimited
cardinality, free) and a **filter facet**. The freed colour channel goes to the one variable that actually
needs it and has ordinal structure: **completeness grade**, one hue, light→dark, four occupied steps —
with the glyph and the word carried alongside exactly as today, so nothing is colour-only.

**Basis is texture, not hue**: `genre-norm` keeps its 45° hatch (this is the skill's legitimate texture
case — it means "this value is inferred") **and** is separated by facet, so no chart ever adds a read
grade to an inferred one. The existing `og-hatched` rule survives verbatim.

**Anti-patterns cleared by this choice:** no dual axis · no recolour-on-filter (grade follows the entity)
· no hue cycling past 8 · no value-ramp on nominal categories (grades are ordinal) · no rainbow · no >7
meaning-bearing colour classes · a table twin always exists · every value is direct-labelled or in the
list, never tooltip-gated. **Two anti-patterns the current page hits and this fixes:** *"a label clipped
by a too-small mark"* (median 51-char titles ellipsed into 190 px boxes) and, in spirit, *"a container
whose fixed height excludes the axis band"* — the current stage has **no axis band at all** (M10).

**Where the Confluence precedent applies, and where it does not.** The atlas's *instrument frame* —
contained viewport, minimap + draggable lens, momentum pan, search-with-fly-to, forced single-column
Ledger under 720 px — is the right chassis and should be reused wholesale for the expandable view.
Its *semantics* do not transfer: the atlas's X axis is calendar time, which is continuous, dense and
meaningful at every scale, so zoom and pan buy real information. This dataset's X is a 3-valued rank, so
**pan/zoom over the whole graph buys nothing** — the minimap would be a picture of a fan. What transfers
is the frame, the search, the drawer, the keyboard model and the Ledger-mode discipline. What replaces
semantic-zoom-clustering is **faceting**: the reader changes *what is on the axis*, not *how far away
they are standing*.

---

## 7. THE WHOLE-PAGE EXPANDABLE VIEW (firm requirement)

**The instrument is a first-class, full-viewport workspace that the document hosts but does not
constrain.** One component, two states.

### 7.1 The two states

- **Docked** (default, in-document): the frame sits directly under the hero at a fixed `min(72vh, 720px)`,
  full content width, with its own internal three-pane grid.
- **Expanded** (the requirement): `<html class="opg-expanded">` → the same frame becomes
  `position:fixed; inset:0; z-index:var(--z-modal)`; document scroll is locked; the rest of `<main>` gets
  `inert`. **Same component, same DOM, same state object — only the containing box changes.** No second
  renderer, no second layout path, no second set of bugs.

### 7.2 Why a CSS state and not the Fullscreen API

The Fullscreen API is rejected as the base mechanism: it needs a user-gesture chain, it hides the browser
chrome (so the reader loses Back), its exit is browser-controlled (breaking the focus-restore contract),
and it cannot be entered from a deep link. A CSS state is offline-native, deep-linkable, print-safe,
keyboard-restorable and testable in the existing Chromium sweep. *Optional enhancement only:* offer
`requestFullscreen()` as a second, separate control if anyone wants it later. Not this round.

### 7.3 The expanded layout — three panes

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ◈ The Operative Corpus        [ Survey | Coverage | Propagation | Records ]  │
│  29 read · 217 inferred                                    [ Exit ⤡ ] [ ? ]  │
├──────────────┬───────────────────────────────────────────┬───────────────────┤
│ RAIL         │  STAGE                                    │  DOCK             │
│ search…      │                                           │  the record, or   │
│ Culture ▸    │  the current view, sized to this pane     │  the list of what │
│ Procedure ▸  │  and re-laid-out on resize                │  is on the stage  │
│ Completeness │                                           │                   │
│ Basis  ▸     │                                           │  [ as a list ]    │
│ ─────────    │                                           │  [ as a record ]  │
│ 24 of 101    │                                           │                   │
│ [Reset]      │                                           │                   │
├──────────────┴───────────────────────────────────────────┴───────────────────┤
│ scope line (role="status"):  Showing 24 works · 29 read grades · filtered by… │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Rail** ≤ 260 px, collapsible, holds every filter + search. One filter row/rail for everything it
  scopes (skill rule: never per-chart filters).
- **Stage** takes the remaining box **and the engine is finally told what it is** — `layoutOpgraph` must
  consume `width`/`height` rather than returning 3000 × 2400 regardless (M2). That is an engine change and
  it is the single highest-value one in the round.
- **Dock** ≈ 380 px, two tabs: **`as a list`** (the rows for exactly what is on the stage — this is where
  AT parity lives in expanded mode) and **`as a record`** (the dossier). Under 1000 px the dock becomes a
  bottom sheet; under 680 px the stage is not drawn and the expanded view *is* the list, full-viewport,
  with sticky filters — which is a genuinely better 390 px experience than a 32,649 px table.

### 7.4 The contract (non-negotiable behaviours)

| | |
|---|---|
| **Enter** | the `Expand` button; or a deep link with `#…&view=full` |
| **Exit** | `Esc`; the `Exit` button; browser Back (the state is a hash entry) |
| **Focus** | on enter → the frame's `<h2>` (`tabindex="-1"`); on exit → **the Expand button**, always |
| **Reachability** | rest of `<main>` gets `inert` + `aria-hidden` while expanded; `<body>` scroll locked without a layout jump |
| **Announcement** | the scope line is `role="status" aria-live="polite"`; entering announces the view name and the count |
| **Linkable** | `view=full`, the active view, and every filter serialise into the hash — a defect in a view is reportable, which is already this page's rule |
| **Motion** | **none.** The expanded state is a state, not a transition. The default state IS the final state. Any fade lives inside `prefers-reduced-motion: no-preference`, ≤180 ms, through `app/motion.js` only |
| **Print** | `.opg-expanded` prints as the Records list, never as a fixed overlay |
| **Parity** | the dock's list is asserted equal to the stage's contents by the same test that today asserts `ledgerModel` vs layout. The covenant does not weaken in expanded mode — **it is the reason the dock exists** |

---

## 8. THE RESTRUCTURED IA

### 8.1 Above the fold (target: everything below fits 1440 × 950 with the stage visible)

```
1  crumb
2  H1 + one-sentence lede (2 lines, not 6)
3  THE HONEST HEADLINE — 4 stat tiles                       ~90px
      101 works · 246 procedure records
      29 read   ·  217 inferred from genre
      3 procedure-level propagation claims · 42 work-level
      102 rejected · 17 struck        → the gate page
4  THE STANDING NOTE — compressed to 3 sentences + disclosure   ~110px
5  THE INSTRUMENT — docked frame, min(72vh,720px), [Expand ⤢]
      view tabs: Survey · Coverage · Propagation · Records
      inline 3-line key + [How to read this ▸]
```

**Item 3 is new and it is the most important change in this document.** It is a KPI row, not a chart
(skill: *"a handful of headline numbers → a KPI row of stat tiles"*), and it does I3's whole job in 90 px.
It is also what resolves the contradiction in §4.4: the page stops publishing a headline `complete: 56`
and starts publishing `29 read / 217 inferred`, which is both true and more interesting.

### 8.2 Below the fold, in reading order

```
6  What the survey found — 3–5 sentences of prose, written against the Survey view
     (the derived findings of §16a: the read layer is 29 claims spread over 17
      cultures, no culture holding more than 4; the ten read `complete` grades are
      mostly Jewish and Islamic and mostly reached by comparing recensions; the
      densest tradition in the corpus is also among the least read; and 16 works
      record no procedure at all)
7  What this cannot answer — 3 items rendered from OPGRAPH_META.dataCeiling
      + [all seven ▸]
8  Where this sits — the atlas cross-link, the vocabulary page, the gate page,
      Sources & Science, How it works                          (a 3-card strip)
9  pager
```

That is the whole document. **Six sections, ~6,000 px, instrument above the fold.**

### 8.3 What collapses (and the rule)

> **A disclosure is legitimate when the reader can predict what is inside it from its summary. It is a
> lie when it hides an obligation.**

Collapsed by default: the full standing note (its 3-sentence core is not collapsed) · the "How to read
this" key beyond three lines · the four remaining data-ceiling items · every filter group (as today) ·
per-claim evidence in the list (as today, `<details>`).

**Never collapsed:** the honest headline · the standing note's three sentences · the scope line · a
non-asserted record's reason · a harm note in an open record · the razor statement in a record.

### 8.4 The two second pages

| page | title | contents | audience |
|---|---|---|---|
| `pages/opgraph-gate.html` | **What this survey refused** | the 102 excluded with reason codes and revisit conditions · the 17 tombstones with strike id, `ejectedBy`, superseding witness, retained note · the reason-code census · the weight rubric · the acyclicity result | A4 |
| `pages/opgraph-vocabulary.html` | **The fifty-three kinds of procedure** | the 13 families · 27 occupied terms with gloss and occupancy · **the 26 empty terms with their warrants** · the authors and cultures appendix · the `retypePending` list | A2, A4 |

Flat sibling filenames (repo precedent: `how-it-works.html`, `tithi-pravesha.html`) so `opgraph.html`'s
URL, `sw.js` precache entry and search-index row stay stable.

Both are prose-plus-table documents that need no instrument, and both are things this project should be
*proud* to have as standalone pages. "Here is what we threw away and why" is a better link to hand
someone than a table anchor.

---

## 9. READING ORDER

### First-time visitor

1. **H1 + lede** — one sentence: this is about *what books contain*, not what they mean.
2. **The honest headline** — before any claim, the size and the reliability of the corpus. A reader who
   leaves here leaves with the correct impression, which is the definition of a good fold.
3. **The standing note (3 sentences)** — the boundary, met before any content. Unchanged in force.
4. **The instrument, already showing the Survey view with real bars.** Nothing to click to see an answer.
5. First click is almost always a bar → the dock opens with that culture's works.
6. Second click is a work → the dossier. **The dossier is where a first-time visitor should end up, and
   today it is four scroll-screens and a lucky click away.**
7. *Only then* the prose findings, the limits, and the onward links.

**The first-run state is a view with an answer already in it.** Not an empty frame with filters, not a
density map, not a legend.

### Returning visitor

Arrives on a hash (`#c=…&view=full`) or from search. Wants: their view restored, or a specific book.
Their order is: **restore → search → record → cite.** Their needs are: the hash round-trips exactly
(already true); search reaches all 101 works and all 43 cultures by name and by original title
(**new — the page has no search at all today, and the atlas has an excellent one to copy**); the record
has a stable anchor and prints; the citation is copyable.

They should never re-read the standing note. It is compact enough that they do not have to skip much, and
its disclosure state is *not* persisted — the covenant is not a cookie.

---

## 10. THE STANDING NOTE — the honest compression

The note carries the site's covenant and cannot be deleted, moved below the content, or made
click-to-reveal. But 12 lines in one paragraph, above everything, is skimmed, and **a skimmed covenant is
a broken one**. The compression rule: **the boundary is still first and still unavoidable; the full text
is one disclosure away and is also repeated per-record where it actually binds** (which the dossier's
`RAZOR_LINE` block already does — that is the covenant's real load-bearing site, and it is excellent).

**Shipping copy — replaces the current `#og-standing-note` block:**

> **Standing note — please read first**
> This wing records **that** a named work contains a procedure of a named kind: its type, how many stages
> it has, what those stages are called, where in the text it sits, what is missing and how that is known,
> and who says so. **It reproduces no operative text whatever** — no ordered sub-steps, no quantities,
> durations or counts, no formula, mantra or divine-name strings, no drawable signs or seals, no
> substance lists. Every technique here is **described as historical practice, never prescribed**; these
> traditions have **no demonstrated predictive or operative validity**, and where a text claims a result
> that claim is attributed to the text and left there.
> [**The rest of the standing note** ▸]

Inside the disclosure, verbatim from the current text, nothing lost:

> Naming a stage is a map; ordering the sub-steps would be a recipe, and nothing here is one. Several
> first-rank works can be described here but not quoted anywhere on this site, because the only
> public-domain witness is abridged at precisely the operative core — that limit is stated on the record
> rather than hidden. Nothing on this page is health, medical, legal or safety advice.

**Measured effect:** ~110 px visible instead of ~340 px; not one clause deleted; the two sentences that
name the two hardest boundaries (no operative text; described-never-prescribed) are *promoted* into the
visible part, where today they sit in the middle of a wall. The bottom method-note callout's duplicated
charter sentences are deleted outright — they restate the hero and the standing note a third time.

---

## 11. THE 873 px LEGEND — the honest compression

Six always-open panels teaching, among other things, **seven distinctions with zero instances in the
shipped data** (M8). Three rules:

> **R1 — A legend entry with zero instances is not a legend entry; it is a vocabulary entry.** It moves to
> `opgraph-vocabulary.html` under *"What this graph can record and has not yet recorded"* — which is a
> better home, because that list is genuinely a finding (a schema that can express `unstable-plural` and
> has no instance of it is telling you something about the corpus).
>
> **R2 — A legend is generated from the data, not written into HTML.** Then it cannot teach a mark that
> no longer renders, and the next round's data changes it for free.
>
> **R3 — Teach at the mark, not at the top.** Each mark's meaning lives in its own accessible name and in
> the record it opens (both already complete). The top-of-page key carries only what a reader needs
> *before* their first click.

**What stays visible — the inline key, 3 lines, ~90 px, beside the instrument:**

> **Reading this view.** Each bar is one tradition; its segments are completeness grades —
> ▰ complete · ▰▱ partial · ○ referenced · ◌ fragmentary. **Hatched segments are grades inferred from
> what the genre usually does, not from a reading of the text; they are counted separately and never
> added in.** Colour is a finding aid — the label is the fact.

**What stays behind `[How to read this ▸]` (closed by default), reduced from six panels to three:**

1. **The relation is a node.** (unchanged in substance — this is the schema's identity and a reader needs
   it before the Propagation view)
2. **Completeness has three axes, and a grade names its basis.** (the current panels 3 and 4 merged; they
   are one idea and were split by accident)
3. **Values are on the face** — weight and attribution pressure, **with the repo-computed disclaimer kept
   verbatim.** Non-negotiable: `attributionPressure` is exactly the kind of number that gets quoted out of
   context, and the plan says so.

**Deleted from the legend, relocated:** "Struck records stay visible" (0 debunked, 0 do-not-quote,
2 not-asserted — it becomes a *note on the two records themselves*, where it is stronger) · "Left to right
is rank, not year" (there is no left-to-right in the Survey view; it becomes the Propagation view's own
axis label, which is where §6/M10 says it belonged all along).

**Net: 873 px → ~90 px visible, ~380 px disclosed, zero facts lost, seven fictions removed.**

---

## 12. ENTRY POINTS, FIRST-RUN AND EMPTY STATES

### Entry points in

- **Nav** — `shared.js` already lists it as *"The Operative Corpus — graph"*. **Change to "The Operative
  Corpus — what books contain"**; "graph" names the implementation, and after §6 it is not even accurate.
- **`contents.html` card** — already good and already honest about the 217/29 split. Reorder so the split
  is the **second** bullet, not the third, matching the new headline.
- **The Confluence atlas** — a per-entry cross-link wherever `atlasSlug` matches (34 works). The link text
  must state which question it answers, per the plan's standing risk 4: **"What this book contains →"**.
- **Deep links** — `#w=…` for a work, `#c=…` for a culture, `&view=full`. Both new pages link back.
- **Search index** — regenerate; index the 101 work labels *and* `titleOriginal`.

### First-run (no hash)

Survey view, all 101 works, no filters, sorted descending, **the read/inferred facet already split**. Two
lines of orientation copy above the stage:

> **This view ranks every tradition in the survey by how many procedure records it carries, and splits
> each one by how completely the text accounts for the procedure.** The right-hand panel holds the
> inferred grades — 217 of 246 records — and is kept apart from the left, which holds the 29 that were
> read. Select any bar to see its books.

### Empty state (a filter combination matches nothing)

One message, in the dock and on the stage — not the current five per-table messages:

> **Nothing matches.** No record satisfies *culture (2), completeness (1), basis: read*. The nearest
> loosening is **basis** — dropping it returns 34 records. [Drop that filter] · [Reset everything]

Naming the *nearest loosening* is worth the small engine addition (it is a re-count with one facet
dropped, pure and cheap) and it is the difference between a dead end and a path.

### Degraded states — all three already handled well, keep the copy

`layoutError` (the callout that says the ledger still carries everything), the module-load failure, and
`<noscript>`. **Add one:** in the expanded view, if the stage cannot draw, the frame opens on the
**Records** tab rather than showing an empty stage with an error.

---

## 13. COPY BOOK — every new affordance

| affordance | visible | accessible name / helper |
|---|---|---|
| Expand button | `Expand ⤢` | `Open the full-window view of this graph` · `aria-expanded` |
| Exit button | `Exit ⤡` | `Close the full-window view and return to the page` |
| View tabs | `Survey` · `Coverage` · `Propagation` · `Records` | `Choose a view` (tablist); each tab's panel is `aria-labelledby` its tab |
| Scope line (`role="status"`) | `Showing 24 of 101 works · 29 read grades · 217 inferred · narrowed by culture (2)` | live-polite; replaces the current counter, keeps its honesty and adds the read/inferred split |
| Basis facet | `Read` (29) / `Inferred from genre` (217) | `Filter by how the completeness grade was reached` |
| Basis explainer under the facet | `An inferred grade says what books of this kind usually do. It is not a reading of this book, and this page never adds the two together.` | — |
| Search | placeholder `a book, a tradition, a kind of procedure…` | combobox pattern, copied from `cfl-search` |
| Focus control (in a record) | `Show what this book connects to` | `Draw the neighbourhood of {label} in the Propagation view` — **this is the D12 affordance, finally reachable** |
| Dock tabs | `as a list` / `as a record` | `Show these records as a list` / `Show the open record` |
| Stat tile 2 | `29 read · 217 inferred` with sub-label `procedure records, by how the grade was reached` | the tile is a link to the Basis facet |
| Stat tile 3 | `3 procedure-level · 42 work-level` sub-label `propagation claims` | links to the Propagation view |
| Stat tile 4 | `102 rejected · 17 struck` sub-label `at the curation gate` | links to `opgraph-gate.html` |
| Gate page H1 | **What this survey refused** | — |
| Vocabulary page H1 | **The fifty-three kinds of procedure** | — |
| Empty vocabulary section | `Twenty-six terms with no occupant` + `An empty term is the reason a later round does not fold an unlike procedure into a near-enough one. Each one names the finding that keeps its slot open.` | (this sentence already exists in the app; it deserves a heading, not a table footnote) |
| The one-line finding under the Survey | `Ten completeness grades in this survey rest on a reading rather than on a genre expectation. Seven of them are Jewish and Islamic works, and five were reached by comparing recensions — the corpora that never stopped being copied are the ones where completeness can be checked at all.` | derived and verified against shipped data (§16a); re-derive on every data change rather than hard-coding |

---

## 14. 390 px — honest, not shrunk

The current rule (`≤680 px → no diagram, the ledger is the view`) is **correct and stays**. What changes
is what "the ledger" means at that width: not 43,678 px of five tables, but the **Records list** —
full-viewport when expanded, sticky filter bar, virtualised, one card per record, opened in place. The
Survey view *does* work at 390 px (horizontal bars with long category names is precisely the form the
skill recommends for many long-named categories), so **at 390 the page keeps the Survey and drops only
the Propagation node-link** — which is more honest than dropping the whole instrument, and materially
better than what ships today.

The narrow-screen note stays, retargeted:

> On a narrow screen the propagation diagram is not drawn: a layered graph cannot be laid out honestly in
> this width, and a squashed one would misstate the ranks. The survey and the records are complete here,
> and they carry every claim the diagram would have shown.

---

## 15. THE COVENANT — how AT parity survives all of this

Stated explicitly because this restructure touches the one thing that cannot be traded.

1. **Parity is a property of the model, not of the DOM.** Today it holds because canvas and mirror are
   painted from one `model.kept`. That stays. The Records list is `model.kept`; the Survey's bars are
   aggregates *of* `model.kept`; the dock list is the stage's subset. **One array, four projections.**
2. **Virtualising is not hiding — but it must be proven so.** A paged list satisfies parity only if
   (a) every record is reachable by filter or search, (b) the full set is emitted in print and in the
   no-JS/export path, and (c) the count is stated. All three are testable and must be tested; the existing
   `ledgerModel` vs layout assertion extends to `dockModel` and `surveyModel`.
3. **Every aggregate is also a number in text.** A bar segment is never the only place a count lives:
   the segment carries its value, the scope line carries the totals, and the row expands to its records.
4. **The expanded view keeps its own text half** (the dock's `as a list`) so parity is never contingent on
   the reader collapsing the instrument.
5. **The 508 permanent tab stops go away** (M11) and that is *also* an accessibility improvement, not only
   a performance one. Parity means every fact is available as text; it does not mean every fact is a tab
   stop.

---

## 16. HANDOFF — what the other specialists must decide

- **Engine:** `layoutOpgraph` must consume `width`/`height` (M2) — the single highest-value change.
  `focus` must be reachable from the app (M12). `bands[]` must be painted as an axis (M10). New pure
  aggregations for the Survey/Coverage views (`surveyModel`, `coverageModel`) belong in `core/`,
  deterministic, and are the natural home for the "nearest loosening" count.
- **Visual designer:** the 8 culture accents are retired as an encoding; the sequential grade ramp needs
  building from DS2/DS3 tokens and **must be run through `validate_palette.js --ordinal`** against both
  parchment surfaces before it ships. The `--cg-*` family currently maps grades onto four *unrelated*
  status washes (ok/warn/inset/info) — that is a rainbow on an ordinal scale and fails the skill's
  sequential rule; it needs re-stepping on one hue.
- **Open question I could not settle from the data:** whether the Survey's default row axis should be
  **culture** (43 rows, 5 top-level regions available for grouping) or **work** (101 rows). Culture answers
  I1 as literally worded; work is what readers can name. My recommendation is **culture, grouped by
  region, with a `by work` toggle** — but it should be checked against how the regions actually
  distribute, which the culture nodes' `region` field can settle in one query.

---

## 16a. THE SURVEY FINDING, DERIVED (so §8.2 item 6 is not a placeholder)

I drafted a plausible-sounding finding, then checked it against the data and **it was wrong** — which is
itself the argument for generating this paragraph from the model rather than writing it. What the data
actually says (`probe5.mjs`):

- **The read layer is spread paper-thin, not clustered.** The 29 non-inferred claims sit in **17
  different cultures**, and **no culture holds more than four**. There is no "well-surveyed corner" of
  this corpus. Any headline implying otherwise is false.
- **The ten read `complete` grades are mostly Abrahamic-esoteric**: 4 Jewish, 3 Islamic, 2
  Greco-Egyptian, 1 Latin-Christian Renaissance (the Heptameron).
- **Five of those ten were reached by `comparative-recension`**, and one — the awfāq squares — by
  `arithmetic-verification`. **The corpora where completeness can be checked at all are the ones that
  never stopped being copied**, because that is what puts two recensions side by side. That confirms, from
  the shipped data rather than from the plan's prediction, the reasoning behind `unstable-plural` (§2.5 of
  the plan) — even though the grade itself has zero instances.
- **The densest tradition is among the least read**: the Śākta digest line (Prapañcasāra → Śāradātilaka →
  Mantramahodadhi) carries 24 claims, the most of any culture, and **not one is graded `complete` on a
  reading**; it holds 4 read claims in total.

That is a better paragraph than the one I invented, and it is one query away from being regenerated
whenever the data changes. **Generate it; do not type it.**

---

## 17. RISKS OF THIS PROPOSAL

- **R1 · Compressing the standing note will read to some as weakening it.** Mitigation: not one clause is
  deleted; the two hardest boundaries are *promoted* into the visible three sentences; the per-record
  razor block is untouched. But this is a judgement call on a covenant and the owner should sign it off
  explicitly rather than let it pass in a diff.
- **R2 · Virtualising the ledger touches the round's one machine-asserted covenant.** If the parity test
  is not extended *in the same commit*, this trades a 68,000 px page for a silently lossy one. **Do not
  ship the list without the assertion.**
- **R3 · Leading with "217 of 246 are inferred" makes the round look thinner than the ledger claims.**
  It is also true, already admitted on `contents.html`, and precisely what this site's rules require. The
  honest framing is that the *survey* is complete and the *reading* has begun — 29 records deep. Stating
  that is a stronger position than a `complete: 56` headline that the page's own rule forbids.
- **R4 · Any prose finding on this page is a claim about the corpus and will rot.** I proved this on
  myself: my first draft of the Survey finding was plausible, well-phrased and **wrong** (§16a). Every
  such sentence must be generated from the model, phrased as a fact *about this dataset* rather than about
  the traditions, and re-derived on every data change. A hand-typed finding on a generated dataset is the
  same defect class as a hand-written weight.
- **R5 · Two new pages is two more surfaces to keep honest** (nav, contents, `sw.js`, search index,
  registry, audit). Real cost, and cheaper than the alternative, which is a 68,000 px page nobody reaches
  the bottom of.
- **R6 · The expanded view is a modal-shaped thing** and modal-shaped things are where focus management
  and `inert` regressions live. The contract in §7.4 is written to be testable; the Chromium sweep should
  assert enter/exit focus restoration and `__motionStats().running === false` in both states.
