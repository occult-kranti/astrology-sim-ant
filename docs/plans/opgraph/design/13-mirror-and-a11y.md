# 13 · The text mirror and the accessibility model

**Role:** accessibility and information-density specialist · **Page:** `pages/opgraph.html` (The Operative Corpus)
**Written against:** `assets/js/app/opgraph.js`, `assets/js/core/opgraph.js`, `assets/js/core/data/opgraph.js`,
`assets/css/opgraph.css`, `docs/plans/opgraph/PLAN.md` §5.6–5.7, `scripts/tests/og-page.mjs`,
and the in-repo precedent `assets/js/app/confluence.js`.
**Skill loaded and followed:** `dataviz` (form first, colour by job, palette validated by script, checked against the anti-patterns catalogue).

---

## 0 · The verdict in one paragraph

The covenant is not the cause of the wall. **The covenant is being over-served in one dimension and
under-served in another, simultaneously.** The ledger renders 246 rows of prose that no pixel on the
diagram encodes — mean citation length 246 characters, mean evidence length 236 characters, per row —
which is what makes table B 32,649 px; and at the same time it omits at least four facts the diagram
*does* encode, including the 8 drawn `HAS_PART`/`SEGMENT_OF` arrows, the entire rank axis the legend
calls "the horizontal axis", and — measurably, today, on one real row — the 400-character `confusedBy`
field that is the whole reason the `NON_EDGE` node type exists. So the fix is not "less text". It is
**re-cut the mirror to the diagram's actual encoding set, keep every remaining fact in the DOM, and
collapse height rather than content.** Parity is *equivalence of access*, not equality of scroll
height. Nothing below removes a single character from the page; the ledger goes from ~44,000 px to
~4,200 px in its default state and every byte of it stays findable by Ctrl-F.

The second half of the brief has a sharper answer than expected: the ledger must **not** move to its
own page. The diagram is `aria-hidden` by design, so if the ledger leaves, the page's primary content
has no accessible representation *in place* and a non-visual reader is told the real thing is
somewhere else. That is a second-class experience and the covenant exists to forbid exactly it. What
*should* be split off is not the mirror but the **archive** — the gate's `excluded` and `ejected`
rows (PLAN §5.7 table E, never built) — which is a different document because it describes records
that are *not in the graph at all*.

---

## 1 · Measured facts (probe, don't impress)

Everything in this section was run against the repo, not estimated.

**Height.** Page 68,196 px at 1440×950. Table A (Works, 101 rows) 11,029 px → **109 px/row**.
Table B (Procedure claims, 246 rows) 32,649 px → **133 px/row**. The legend accordion, shipped with
`open`, is 873 px. 5 tables, 641 buttons, 0 canvases.

**Why a row is 133 px.** Field-length census of the 246 `procedure-claim` nodes
(`node -e` over `assets/js/core/data/opgraph.js`):

| field | in table B? | mean chars | max chars |
|---|---|---:|---:|
| `subject` | yes (col 3) | 26 | 182 |
| `completenessEvidence` | yes (col 10, inside a `<details>`) | **236** | 826 |
| `cite` | yes (col 11) | **246** | 837 |
| `structure` | no | 49 | 872 |

Two columns carry ~480 characters of unwrapped prose per row inside an 11-column table with no
`table-layout: fixed`. At ~19 px line-height that is 6–7 wrapped lines — which is exactly the 133 px
measured. **The wall is two columns, not 246 rows.** A 246-row table with a one-line row budget is
~8,400 px; the same table grouped and collapsed is ~4,000 px. The covenant never asked for either
column to be *laid out flat*; it asked for them to be *available*.

**Data shape.** 508 nodes (101 work · 46 author · 43 culture · 27 procedure-type · 246
procedure-claim · 45 relation-claim); 747 edges (246 CONTAINS · 246 OF_TYPE · 45 REL_FROM ·
45 REL_TO · 83 BELONGS_TO · 74 AUTHORED_BY · 5 HAS_PART · 3 SEGMENT_OF). Flag census:
`unverified` 16 · `doNotQuote` 0 · `anatomyStagesInferred` 0 · `retypePending` 12 ·
`rankInversion` **0** · `asserted:false` 2 · `confusedBy` 1 · `reassertIf` 0 ·
claims carrying `anatomyStages` 49.

**Engine surface already available and unused by the page.** `assets/js/core/opgraph.js` exports
`rankOf(id)`, `rankInversions()`, `strainOf(node)`, `ledgerModel(state)`, `opgraphStats()`.
`app/opgraph.js` calls **none** of them — `mirrorHTML()` builds its rows from `model.kept` by hand.
PLAN §5.7's parity assertion is written against `ledgerModel()`. As shipped, that assertion (where it
exists) compares the engine to itself and the page to nothing.

---

## 2 · Six places the covenant is already broken

These are not style opinions. Each is a fact the renderer paints and the ledger cannot express.
Fix these *before* any density work — a smaller wall that still leaks is worse than the wall.

| # | The visual fact | Where it is painted | Where it is in text | Instances today |
|---|---|---|---|---:|
| **B1** | `confusedBy` — who conflated the two works | dossier only, but the `NON_EDGE` node is drawn | `mirrorHTML` renders `txt(n.notAssertedReason) \|\| txt(n.confusedBy)` — one column for two fields, and `notAssertedReason` wins | **1 (real)** |
| **B2** | `HAS_PART` / `SEGMENT_OF` arrows (`.og-e-has_part`, `.og-e-segment_of`, dashed) | the SVG | nowhere in any of the five tables | **8 (real)** |
| **B3** | transmission **rank** — the x-axis, which the legend calls the diagram's primary encoding | node x-position + band | nowhere; `band`/`order` are used only as a sort key inside `buildModel` | **101+ (real)** |
| **B4** | `og-dotted` — `unverified` or `anatomyStagesInferred` on a claim face | `nodeFaceHTML` line ~421 | table B has no column for either | **16 (real)** |
| **B5** | `⇄` rank/year inversion badge | `nodeFaceHTML` line ~435 | table C has no column | 0 today — **latent**; one data change makes it real |
| **B6** | `⛔` do-not-quote | `nodeFaceHTML` line ~425 | table B's `harm` column is a different field | 0 today — **latent** |

B1 is the sharpest. `rel:gw-liber-juratus--non-edge--gw-grimoire-pape-honorius` carries *both*
`asserted:false` and a 400-character `confusedBy` explaining that Peterson records the conflation and
that "a graph with no negative-assertion capability will regenerate this error on every pass." The
ledger prints the boilerplate `notAssertedReason` and drops the sentence the node exists for. PLAN
§2.1.6 predicted this failure mode in those words.

**Rule that prevents the class, not the six instances:** a mirror column may never be
`a || b` across two distinct schema fields. One field, one column (or one labelled line in a
row disclosure). Machine-check it (§10, T-M4).

---

## 3 · The redesigned mirror

### 3.1 The principle

> **AT parity is equivalence of access, not equality of layout.** A fact is "available as text" when
> it is in the DOM, in the accessibility tree, reachable by keyboard, and findable by the browser's
> own find — regardless of whether it currently occupies vertical space.

This is not a loophole; it is the distinction native HTML draws itself. A closed `<details>` is a
*disclosure*, not hidden content: its contents are in the accessibility tree, are announced to a
screen reader as an expandable summary with its state, and are revealed by find-in-page in every
current engine. The failure mode the covenant guards against is **content that does not exist**
(a tooltip-only value, an SVG with no text twin, a virtualised row) — not content one keypress away.

### 3.2 The options, evaluated honestly

| Option | Verdict | Why |
|---|---|---|
| **Default-collapsed disclosure groups** | **ADOPT — the spine of the design** | Native, no JS, keyboard-native, Ctrl-F-transparent, print-forcible, zero facts removed. |
| **Summary-first roll-up with drill-down** | **ADOPT — as the grouping, not as a replacement** | The data *is* tripartite (492 of 747 edges are the work→claim→type spine). Grouping claims under their work matches the structure instead of fighting it. But it must be a **partition**, with the flat cross-cutting table one control away, or you lose "show me every `withheld` grade across all corpora". |
| **`content-visibility: auto`** | **ADOPT — this is virtualisation's benefit without its cost** | Skips rendering work for off-screen rows while leaving them in the DOM, in the a11y tree, and findable. Browsers force-render `content-visibility: auto` subtrees for find-in-page and `scrollIntoView`. Requires `contain-intrinsic-size` to stop scrollbar jitter. **Never `content-visibility: hidden`** — that one *does* remove content from find and from the a11y tree, and is the trap. |
| **Pagination** | **REJECT** | Breaks Ctrl-F across the corpus (page 4 of 6 is not in the DOM), breaks deep-linking to a row, and adds a state that must be encoded in the hash alongside the filter. Solves nothing that disclosure does not solve better. |
| **Virtualisation** | **REJECT — and it is the specific thing the brief warned about** | (a) Ctrl-F cannot find what is not in the DOM and no API repairs that. (b) A screen reader's browse-mode buffer is the DOM; `aria-setsize`/`aria-posinset` can patch the *count* but never the *content*, so "find the row mentioning Preisendanz" becomes impossible. (c) It requires scroll-driven DOM mutation, which this repo forbids outside `app/motion.js`. (d) 508 rows is not a virtualisation-scale problem; `content-visibility: auto` gets the same paint budget for free. |
| **Filtered-by-default + "show all"** | **REJECT — it contradicts the page's own constitution** | The page ships `showNotAsserted: true` by default and says why in prose: "hiding a struck record is exactly how a flagged claim becomes an unflagged one two rounds later." A default filter nobody chose is the same mechanism with a friendlier name. A *collapsed* row is still counted, still findable, still printed; a *filtered* row is none of those. |
| **Move the ledger to its own page** | **REJECT for the mirror; ADOPT for the archive** | See §0. The mirror must stay where the `aria-hidden` diagram is. The gate's `excluded`/`ejected` rows (PLAN §5.7 table E — never built) describe records that are *not in the graph*, are therefore not a mirror of anything drawn, and belong on `pages/opgraph/gate.html`, one click away, with its own standing note. |

### 3.3 The chosen form — three registers of disclosure

Everything in the DOM at all times. Three nested levels, all native `<details>`, all Ctrl-F-transparent.

```
LEDGER  (h2#mirror)
├─ [ Open everything ] [ Find in the ledger: ______ ]  (row/match counter, role=status)
│
├─ <details open>  A · Works — 101 in this view
│    └─ flat <table>, 101 rows, ONE LINE EACH
│         each row's last cell: <details> ▸ editions, PD verdicts, notes
│
├─ <details>  B · Procedure claims — 246 in this view, in 101 works   [group by: work ▾]
│    ├─ <details> Śāradātilaka — 4 claims · ▰▰▱○ · rank 3
│    │    └─ <table> 4 rows, one line each
│    │         each row's last cell: <details> ▸ evidence sentence · citation · stages · flags
│    ├─ <details> PGM IV — 11 claims · …
│    └─ … 101 groups
│
├─ <details>  C · Propagation and relation claims — 45 in this view
├─ <details>  D · Procedure-type vocabulary — 53 terms (27 occupied, 26 warranted empty)
└─ <details>  E · Cultures and authors — 89 in this view
```

**Register A is open by default** so the ledger is never an empty stack of closed boxes; B–E are
closed and each states its own count in its summary. **A collapsed thing must always print its size** —
a summary that reads `B · Procedure claims — 246 in this view, in 101 works` is a fact, and it is
strictly *more* information than 246 unlabelled rows.

**Grouping is a control, not a shape.** `[group by: work ▾]` on register B offers
`work (default) · procedure-type · culture · completeness grade · flat`. Every option is a **partition
of the identical 246 rows** — the sum of the group counts is printed next to the control and must
equal the register count. `flat` is the current table (one line per row, no groups) and is what the
"Open everything" control and print produce. This preserves cross-cutting reading ("every `withheld`
grade") which a work-grouping alone would destroy.

### 3.4 The column budget, and the prose-demotion rule

> **A mirror column exists if and only if the diagram encodes that field.** Fields the diagram does
> not encode are still in the DOM, in the row's own disclosure, one keypress away — they are the
> *record*, not the *picture*.

That single rule removes both prose columns from table B's grid without removing one character from
the page, and it is *principled*: no pixel on the canvas shows a citation.

**A · Works** (grid): work · rank · kind · culture · date · role · claims · grade profile · weight ·
↓pressure · witnesses · in/out · drawn?
→ row disclosure: editions + PD verdict + `quoteSafe` + atlas slug + notes + **parts / segment-of** (fixes B2).
*New:* `rank` (fixes B3, available from `rankOf()`), `kind` (work/segment/collection/practice-corpus),
`in/out` degree, `grade profile` as glyph run (`▰▰▱○`) instead of a single "best grade" — a work with
one `complete` and three `referenced` claims currently reads as `complete`, which is the exact
laundering the three-axis design exists to prevent.

**B · Procedure claims** (grid): work · type · repo · text · witness · basis · incompleteness ·
flags · harm
→ row disclosure: `subject` · `structure` · `anatomyStages` (+ inferred marker) · `completenessEvidence` ·
`cite` · `typeAsFiled` / `retypePending → target`.
*New:* a single `flags` column rendering `unverified` / `do-not-quote` / `stages-inferred` /
`retype-pending` as **word chips, not glyphs** (fixes B4, B6).

**C · Relations** (grid): from · relation · to · asserted? · level · propagated type · label ·
rank-inversion · in-atlas?
→ row disclosure: `bestCitation` · `note` · `notAssertedReason` · `reassertIf` · **`confusedBy` as its
own labelled line** (fixes B1, B5).

**D · Vocabulary** (grid): term · family · occupancy → row disclosure: `gloss` · `warrant`.

**E · Cultures and authors** (grid): name · kind · region / attribution kind · works
→ row disclosure: `periodText` · `attributionNote`.

Row-height budget: **one line per grid row.** Enforce with `table-layout: fixed` + a `max-width` and
`text-overflow: ellipsis` on the two longest grid cells (work title, type term) — with the untruncated
string always present as the row disclosure's first line, never only in a `title=` attribute.
(Anti-patterns catalogue: *"a label clipped by `overflow:hidden`"* — permitted only when the full text
is elsewhere in the DOM, which here it is.)

### 3.5 Mechanics — the two traps

**Trap 1: `<details>` cannot wrap `<tr>`.** HTML forbids it. Two legal shapes:

- **(i) one `<table>` per group inside the group's `<details>`.** Each group gets its own `<thead>`,
  so a screen reader announces column headers correctly in every group. Cost: 101 table-start/end
  announcements when everything is open.
- **(ii) `<tbody hidden="until-found">` per group**, with a group header `<tr>` carrying a
  `<button aria-expanded>`.

**Adopt (i) for register B's groups** (each group is 1–11 rows; a small table with real headers is
the better AT artefact, and it degrades with JS off). **Adopt `hidden="until-found"` for the per-row
disclosures inside a `<td>`** where a `<details>` is legal but produces a nested-interactive mess —
actually `<details>` *is* legal and simpler in a `<td>`, so use `<details>` there too and keep
`hidden="until-found"` in reserve for the group headers if (ii) is ever needed. One primitive, three
levels, no bespoke widget.

**Trap 2: closed `<details>` and find-in-page.** Chromium ≥ 102, Safari ≥ 17 and Firefox ≥ 139 open a
closed `<details>` when find-in-page matches inside it. Older engines do not. Therefore the design
must not *depend* on it:

1. A persistent **"Open everything in the ledger"** button at the top of the mirror, which is also
   the state serialised as `#…&all=1` (so a linked view can be pre-expanded), and which is announced
   through the existing house pattern `role="status" aria-live="polite"`.
2. A **"Find in the ledger"** input that is a real DOM filter — case-insensitive substring over a
   precomputed searchable string per row, which toggles `hidden` on non-matching rows and
   **auto-opens the full ancestor `<details>` chain of every match**, and reports
   `"37 rows match “Preisendanz” — in 12 works"` in the live region. It is a *supplement* to Ctrl-F,
   never a replacement: with the box empty, no row is `hidden`, so Ctrl-F sees the whole corpus.
3. A one-sentence statement of the contract in the ledger's own prose, because the site states its
   mechanisms rather than relying on them.

### 3.6 The height arithmetic

| | now | after |
|---|---:|---:|
| "How to read this graph" accordion (ships `open`) | 873 | ~48 (closed; it is a legend, and every word of it is repeated in the ledger's column headers and glosses) |
| A · Works | 11,029 | ~3,600 (101 × ~34 px + head) |
| B · Procedure claims | 32,649 | ~4,100 open / **~48 closed** (101 group summaries when opened) |
| C · Relations | — | ~1,700 open / ~48 closed |
| D · Vocabulary | — | ~1,900 open / ~48 closed |
| E · Cultures & authors | — | ~3,100 open / ~48 closed |
| **ledger, default state (A open, B–E closed)** | **~44,000** | **≈ 3,900** |
| **ledger, "open everything"** | ~44,000 | ≈ 14,400 |

Page total drops from 68,196 px to roughly 12,000–14,000 px in the default state, with **zero
characters removed from the DOM**.

---

## 4 · The in-page find contract

State it as four assertions the build must satisfy:

1. **Every character of every record in the current filter is in the DOM at all times.** No
   pagination, no virtualisation, no `content-visibility: hidden`, no JS-on-demand rendering of
   ledger content. (The *dossier* may be rendered on demand — it is a detail view of a row that is
   already fully present in the ledger.)
2. **Ctrl-F with the find box empty reaches every one of those characters**, either because the
   engine auto-opens `<details>` or because the reader used "Open everything" — and the page says so.
3. **The find box never deletes a row.** It sets `hidden` on non-matches and clears it on empty.
4. **Landing on a row from anywhere opens its ancestors.** From the diagram, from the dossier's
   `data-goto` links, from a `#og-row-<id>` hash on load, and from the find box. Precedent:
   `confluence.js:902 scrollLedgerTo()`; extend it to open the chain first, then
   `scrollIntoView({ block: 'center' })`, then move focus to the row's opener.

---

## 5 · The screen-reader experience of the graph itself

### 5.1 What a non-visual user gets today

`#og-svg-host` is `aria-hidden="true"` — correct, and the atlas made the same call. But
`#og-nodes` is a `role="group"` containing **140 focusable buttons**, each with a ~120-character
`aria-label` *and* the identical string as a `title` attribute. So the reality is:

- a non-visual user meets a 140-item unstructured group that duplicates the ledger with **less**
  information and no headers;
- every node has a native tooltip 120 characters long, which is a hover nuisance and redundant to
  the accessible name;
- **the accessible name says nothing about the node's connections.** 747 edges are drawn and the
  node layer communicates zero of them. A graph without its edges is a list.

### 5.2 The ruling

**The node layer should not try to be the accessible representation.** It is a keyboard-operable
*instrument* (WCAG 2.1.1 obliges that; making it non-focusable would be a regression, and
`aria-hidden` on focusable content is invalid). The ledger is the representation. Therefore:

- **Keep `role="group"`** — not `role="tree"`, not `role="application"`. The spine work→claim→type
  is tree-shaped downward, but type chips are shared across claims, so a tree is a lie about the
  structure; and `role="application"` would suppress browse mode, which is the mode in which the
  ledger below is usable. Give the group a label that carries the counts and the cap:
  `"Diagram — 140 of 508 records drawn; the ledger below carries all 508."`
- **Sub-group by rank band**: each band in its own `<div role="group" aria-label="Rank 3 — 41 records">`.
  Rank is the diagram's primary axis; announcing it is how a non-visual user learns the layout has a
  meaning.
- **Put the edges into the accessible name set.** Each node button gains `aria-describedby` → a
  `.og-vh` span reading `"2 arrows in: Amṛtasiddhi, Haṭhapradīpikā · 1 arrow out: purification"`
  (cap 3 names each way, then "and N more"; the full list is in the dossier). At ~1.5 in + 1.5 out
  per node this is cheap, and it is the single largest AT gap on the page.
- **Add the dossier's missing "Wired to" block** — every incident edge, by kind and endpoint. This is
  what makes all 747 edges text-available for the first time.
- **Build the two bridges that are missing in both directions:** a `Show this record in the ledger`
  action on every node (key `L`), and a `Show on the diagram` action on every drawn ledger row. Today
  a reader who finds a node cannot get to its row and vice versa; both views exist and neither knows
  about the other.
- **Drop the `title=` attribute** from the node face. It is a duplicate accessible name and a
  120-character native tooltip.

### 5.3 Does the atlas's roving-tabindex composite transfer?

**The keyboard mechanism transfers verbatim. The arrow-key semantics must not.**

What transfers, and should be lifted directly from `app/confluence.js`:

- one tab stop per composite, roving `tabIndex` over real `<button>`s (`confluence.js:791 focusNode`,
  `:1024`); `Enter`/`Space` activate; `Home`/`End`; `Escape` with an explicit priority ladder
  (`:846 onEscape` — pinned card → thread → drawer → highlight);
- **never strand focus on re-render.** `confluence.js:369–373` re-seats the roving holder when its
  token is absorbed by clustering, and refocuses only if focus was inside. The opgraph's
  `paint()` (app/opgraph.js:1192–1201) re-seats `tabIndex` but does **not** restore focus, and
  `paint()` runs on every filter change — so changing a filter with the keyboard throws focus to
  `<body>`. That is a real defect and the atlas already solved it.

What does **not** transfer: the atlas's arrows are *spatial* (↑↓ = within a lane by year, ←→ = to the
nearest node in the adjacent lane), because its layout is a genuine 2-D scatter over (lane, year).
The opgraph is a layered DAG with a tripartite spine, so its arrows should be **structural**:

| key | opgraph meaning |
|---|---|
| ↑ / ↓ | previous / next sibling **within the same rank band** |
| → | follow the spine outward: work → its claims → the type chip |
| ← | follow the spine inward: type → the claims of that type → their works |
| `PageUp` / `PageDown` | previous / next **rank band** (the atlas's era jump, re-pointed at rank) |
| `Enter` | open the dossier · `L` jump to the ledger row · `T` follow the transmission chain |

This gives a keyboard-only or non-visual user *the graph's structure*, which the atlas never had to
provide because its structure was time. It is also the honest answer to "where does this data need
something different": the atlas's minimap, momentum pan and spring zoom are viewport instruments and
transfer to the whole-page expandable view unchanged; its **navigation semantics do not**, because
rank is not a coordinate you scrub, it is a relation you traverse.

### 5.4 The whole-page expandable view — the mirror's obligation inside it

The firm requirement to make the graph a whole-page expandable view creates one covenant hazard:
**if the expanded frame covers the ledger, the page's only accessible representation is off-screen
while the instrument is in use.** Non-negotiable consequences:

1. The expanded frame carries its own **`[ Diagram | Text ]`** switch that reveals the same ledger
   DOM (moved, not duplicated — one node, `appendChild`d into the frame, so no second copy can drift).
   If "moved, not duplicated" proves impractical, then the diagram half must simply not cover the
   ledger and the frame must be a viewport, not an overlay.
2. If the expanded frame is implemented as an overlay it is `role="dialog" aria-modal="true"` with a
   focus trap and `Escape` to exit — the atlas already switches its drawer between
   `role="complementary"` and `role="dialog" aria-modal` by breakpoint (`confluence.js:646–649`);
   reuse that exact code path.
3. Entering and leaving the expanded view **must not lose the roving focus holder**, and leaving must
   return focus to the control that entered it.
4. The Fullscreen API is a nice-to-have, not the mechanism. A CSS-only expanded state (fixed inset,
   `z-index` token) is offline-safe, print-safe and does not fight the browser chrome.

---

## 6 · Focus order through 641 buttons

**Census.** 140 node faces (already a roving composite — 1 tab stop) + **508 `.og-rowlink` buttons,
one per ledger row (508 tab stops)** + ~4 filter-group summaries + ~30 checkboxes + 3 zoom + 3 weight
+ 2 checkboxes + reset + skip-link + chrome. The ledger is the entire problem: **a keyboard user who
wants the "What this dataset cannot answer" section below the ledger presses Tab 508 times.**

**Fix, in priority order:**

1. **Roving tabindex over the row openers, per register.** `tabindex="-1"` on all but one opener in
   each table; ↑/↓ move between rows, `Home`/`End`, `Enter` opens the dossier, `→` opens the row's
   own disclosure, `←` closes it. This keeps **native `<table>` semantics intact** — the buttons are
   still `<button>`s inside `<th scope="row">`, so a screen reader's table-navigation commands are
   untouched — and it takes the ledger from 508 tab stops to **5**. Do *not* reach for `role="grid"`:
   it buys the same keyboard model at the cost of the native table reading model, and this is a
   reading artefact first.
2. **Collapsed registers contribute zero tab stops** automatically — a closed `<details>` is not
   focusable. This is a second, independent reason the disclosure design is the right one.
3. **Re-seat the roving holder on every re-render and never strand focus** (§5.3). The candidate list
   must be recomputed after any filter or find change and must skip `hidden` rows.
4. **A "Skip the ledger" link** paired with the existing "Skip the diagram — go to the ledger", so
   both directions are one keypress. Add `→ #limits`.
5. **Landmarks, so browse-mode users never Tab at all.** The mirror gets
   `<section aria-labelledby="mirror">`; each register keeps its `<h3>` so the heading list is the
   real navigation. A screen-reader user should reach any register by heading, not by Tab.

---

## 7 · Colour-independence — measured, per the skill

The skill forbids reasoning about palettes. Both categorical scales on this page were run through
`scripts/validate_palette.js` against the card surface `#fffdf8`.

**The eight culture accents** (`--og-c0…7`, the only literal colours in `opgraph.css`):

```
--pairs adjacent : ALL PASS   (worst adjacent #8a4a22↔#b83f88 ΔE 13.3 deutan; normal-vision worst 16.2)
--pairs all      : FAIL       CVD  worst #b83f88↔#00939c ΔE 4.0 deutan · 3.5 tritan
                   FAIL       NORMAL-VISION worst #8a4a22↔#9a5526 ΔE 4.4 — below the hard floor of 15
```

`--pairs all` is the correct mode for a node-link diagram: any two nodes can end up adjacent on
screen, so the adjacent-pair result is not the test that matters. **Russet (`--og-c6 #8a4a22`) and
sienna (`--og-c1 #9a5526`) are indistinguishable to full-colour vision**, and magenta/cyan-teal are
indistinguishable under deutan. Worse: **43 cultures are cycled through 8 hues** (`indexGraph`:
`accentOf = cultureIds.sort()[i % 8]`), so five or six cultures share each hue by construction. The
skill's non-negotiable — *"assign categorical hues in fixed order, never cycled"* — is violated, and
the anti-patterns entry *"cycling / generating hues past 8"* applies exactly.

**Ruling.** Culture is **not** an identity channel here and must stop claiming to be one. The page's
own legend already says the honest thing — *"colour is a finding aid; the label is the fact"* — so
make the implementation match the sentence:

- demote the accent from a hue-per-culture to a **hue-per-culture-FAMILY** (the ~5 corpora the plan
  names: Indian tantra · Greco-Egyptian · Solomonic/Western · East Asian · Abrahamic-esoteric), which
  is ≤ 8 and can pass `--pairs all`; **re-run the validator on whatever set is chosen and paste the
  output into the commit message**;
- retire `#8a4a22` (russet) — it is a duplicate of `#9a5526` by measurement;
- keep the culture **name** in the node sub-row and in the ledger, which is already done and is what
  makes this recoverable rather than fatal.

**The six completeness washes** (`--cg-complete … --cg-withheld`, painted as node backgrounds):

```
Lightness band     FAIL  all six at L 0.93–0.98
Chroma floor       FAIL  all six read as gray (C 0.010–0.047)
CVD separation     FAIL  worst all-pairs #efe6d2↔#d8efd6 ΔE 0.6 deutan
Normal-vision      FAIL  worst all-pairs #e7eef7↔#eef5fa ΔE 2.1
Contrast v surface WARN  1.05–1.22 : 1
```

`referenced` and `complete` differ by **ΔE 0.6** under deutan. This is not a colour encoding; it is
decoration that *looks* like an encoding, which is strictly worse than no fill at all, because a
reader who learns "green means complete" will read the inset wash as complete. Two further faults:
completeness is an **ordered** scale (complete → partial → referenced → fragmentary), and it is
painted with six *semantic* washes drawn from the ok/warn/info/disputed families — the anti-patterns
entry *"rainbow / non-neighbor sequential"* and *"status color used for a non-status series"*, both.

**Ruling.** Either (a) drop the fill entirely and let the glyph + the sub-row word carry the grade, or
(b) replace the six washes with a **single-hue sequential ramp, light→dark, validated with
`--ordinal`**, with `withheld` **outside** the ramp as a distinct hatched/neutral state (it is a
result, not a low grade — the page says so, and putting it at the dark end of a ramp would say the
opposite). I prefer (b) for the map and (a) for anything under 40 px, and either way the redundant
channel must carry it.

**The redundant channels must themselves be discriminable.** `▰` vs `▰▱` differ by one appended
character; `○` (referenced) vs `◌` (fragmentary) are near-identical below ~14 px. Recommendation: in
the ledger the grade is always the **word**, never the glyph alone; on the diagram the glyph is
accompanied by the word in the sub-row wherever the box height allows (it already is, at `bh ≥ 40`) —
and where it does not allow, the box is too small to encode a grade at all and should not try.

**Every encoding, and its redundant channel:**

| encoding | colour/shape channel | redundant channel | status |
|---|---|---|---|
| culture | accent stripe | name in sub-row + ledger column | OK once §7's demotion lands |
| completeness | fill wash | glyph + word in sub-row + 3 ledger columns | wash is non-functional; word is load-bearing |
| basis = genre-norm | 45° hatch | `basis` word in ledger + dossier | OK (but see §8 — hatch is fragile in forced-colors) |
| epistemic label | border colour | `label` word in ledger + badge text | OK |
| not asserted | dashed border + `opacity:.85` | `line-through` + "NOT asserted" ledger cell | OK; **fix the opacity** (§8) |
| procedure-level | `◆` vs `◇` + 2px border | "procedure-level" / "work-level" word | OK |
| weight | border-top width, 3 steps | printed `w 0.72` on the face + ledger column | OK — a model for the rest |
| attribution pressure | `--bad-ink` colour on the cell | printed `↓0.15` | OK |
| rank | x-position | **nothing** | **B3 — add the column** |

---

## 8 · forced-colors and print

**forced-colors: there is no `@media (forced-colors: active)` block anywhere in the repo.** In Windows
High Contrast every one of the following collapses simultaneously:

- all eight culture accents → `CanvasText`;
- all six completeness washes → `Canvas` (they were already ΔE 0.6 apart; now they are identical);
- `.og-dnq`'s `box-shadow: inset 0 0 0 2px var(--bad)` → **`box-shadow` is not rendered in
  forced-colors**, so the do-not-quote ring vanishes entirely;
- `.og-struck`'s `opacity: .85` → invisible as a signal;
- `.og-hatched`'s `repeating-linear-gradient` → a background *image*, whose survival in forced-colors
  is engine-dependent and must not be relied on.

Required block (page-scoped, `opgraph.css`, which is not the locked file):

```css
@media (forced-colors: active) {
  .opg-page .og-node { border: 1px solid CanvasText; background: Canvas; }
  .opg-page .og-sub  { display: block !important; }        /* the word carries what the wash cannot */
  .opg-page .og-struck .og-cell-title { text-decoration: line-through; }  /* text-decoration survives */
  .opg-page .og-struck { opacity: 1; border-style: dashed; }
  .opg-page .og-dnq::after,
  .opg-page .og-hatched::after { content: attr(data-flagword); }  /* the flag becomes a word */
  .opg-page .og-node:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
}
```

The governing rule: **in forced-colors, every encoding degrades to text, never to nothing.** The
ledger is unaffected — it was already words — which is a third independent argument for the mirror
staying on the page.

**Print.** The existing print block is right in intent (hide diagram, hide toolbar, show ledger) but
has one mechanical bug and one new requirement:

- `@media print { .og-ev p { display: block } }` is the current trick for forcing a closed
  `<details>` open. Modern Chromium hides `<details>` content with `content-visibility`, which
  `display: block` on a descendant does not defeat. **Do not build the new three-level disclosure on
  a CSS force-open.** Use a `beforeprint` listener that sets `open` on every `<details>` inside
  `#og-mirror` and an `afterprint` that restores the prior state (recording it first). `beforeprint`
  is an event listener, not a clock and not a rAF, so it is inside the repo's rules.
- Print must also render the **rank column**, the **flags column** and the **row disclosures'
  contents** — i.e. print is exactly the "open everything" state. Print of this page should be the
  complete record, because print is the last representation with no interaction budget at all.
- Keep `@page` margins and `font-size: 8pt` as shipped. Expect ~60–90 pages; state the page count in
  the ledger's own prose so nobody prints it by accident.

---

## 9 · 390 px, honestly

At ≤ 680 px the diagram is not drawn and the ledger *is* the view — that ruling (D13) is right and
must survive this redesign. Consequences specific to the mirror:

- At 390 px a 13-column grid is a horizontal scroll inside `og-scroll`, which is honest but poor.
  **Below 680 px, register A and B's grid rows become a two-line stacked row** (line 1: title +
  grade glyph run + weight; line 2: culture · date · rank · flags), with the same row disclosure.
  This is a layout change, not a content change — same DOM order, same cells, same text.
- The register summaries and the "Open everything" control stay full-width and thumb-sized (≥ 44 px).
- The find box is *more* important at 390 px than at 1440, because scrolling is the expensive verb.
  Put it above register A, sticky within the mirror section.
- **Do not collapse register A at 390 px.** On narrow screens the ledger is the whole page; opening
  with everything closed would be a page that appears empty.

---

## 10 · Acceptance tests — phrased as assertions

Written for the repo's existing harness style: `T-S*` are static-source assertions for
`scripts/tests/og-page.mjs`; `T-M*` drive the pure model headlessly; `T-B*` are measured in the real
Chromium sweep (`scripts/browser-verify.mjs`).

**Parity — the covenant, machine-asserted**

- **T-M1** For every node type the engine lays out, `mirrorModel(filter)` returns a row, and
  `rows.length === layoutOpgraph({cap: Infinity, filter}).nodes.length`. *(Strengthens PLAN §5.7 from a
  per-type count to a per-id set equality: assert the two **id sets** are equal, not their sizes.)*
- **T-M2** The mirror is built from `core/opgraph.js`'s `ledgerModel(state)`, not from a second
  hand-rolled projection. Assert `app/opgraph.js` references `eng.ledgerModel`.
- **T-M3 (the encoding-set test)** For every CSS class the node painter can emit
  (`og-hatched`, `og-dotted`, `og-dnq`, `og-struck`, `og-inverted`, `og-proclevel`, `og-g-*`,
  `og-wt-*`, `data-cult`), the mirror HTML for the same filter contains a corresponding **word**.
  Drive it from a fixture that sets every flag to true. *(This is the test that would have caught
  B4/B5/B6.)*
- **T-M4 (the no-fallback-column test)** No mirror cell is produced by `a || b` across two distinct
  schema fields. Assert by fixture: a record with **both** `notAssertedReason` and `confusedBy`
  produces both strings in the mirror HTML. *(Catches B1.)*
- **T-M5** Every edge kind in `OPGRAPH_EDGES` is represented in the mirror for the unfiltered view —
  including `HAS_PART` (5) and `SEGMENT_OF` (3). *(Catches B2.)*
- **T-M6** Every drawn node's `rankOf(id)` appears as text in its mirror row. *(Catches B3.)*
- **T-M7** The sum of the per-group counts printed by register B equals the register count for every
  value of `group by`, for at least three distinct filters. *(A partition can never lose a row.)*

**Density**

- **T-B1** At 1440×950 with the default filter and no interaction, `document.body.scrollHeight < 16000`.
- **T-B2** No single `<table>` in `#og-mirror` exceeds **6,000 px** in its default state.
- **T-B3** After activating "Open everything", the ledger's total text content length is **byte-identical**
  to the concatenation of `ledgerModel(filter)`'s serialised fields — the collapsed state hid nothing.
- **T-B4** Mean rendered row height in every mirror grid `< 44 px` at 1440 px.

**Find and disclosure**

- **T-B5** `#og-mirror` contains **zero** elements with `content-visibility: hidden` and zero
  `aria-hidden="true"` ancestors of any ledger row.
- **T-B6** With the find box empty, `document.querySelectorAll('#og-mirror [hidden]').length === 0`.
- **T-B7** Typing a string present only inside a collapsed register's collapsed group's collapsed row
  disclosure produces ≥ 1 match, opens all three ancestors, and the match is visible in the viewport
  after the scroll.
- **T-B8** `#og-mirror` textContent contains every one of the 246 `cite` strings and every one of the
  246 `completenessEvidence` strings, in the default (collapsed) state. *(The DOM-completeness test —
  this is the assertion that makes "the covenant is intact" a fact rather than a claim.)*

**Focus and keyboard**

- **T-B9** `document.querySelectorAll('#og-mirror [tabindex="0"], #og-mirror button:not([tabindex="-1"])').length <= 5`
  in the default state — one roving holder per register.
- **T-B10** Total tab stops between the `#mirror` heading and the `#limits` heading `<= 12`.
- **T-B11** After any filter change made from the keyboard, `document.activeElement !== document.body`
  and is inside the control that was operated. *(The atlas's §7.4 rule, currently violated by
  `paint()`.)*
- **T-B12** Every interactive element in `#og-mirror` and `#og-nodes` has a visible `:focus-visible`
  outline of ≥ 3 px, and a hit area ≥ 24×24 px.
- **T-B13** From a node face, pressing `L` moves focus to that record's ledger row; from a drawn
  ledger row, the "Show on the diagram" action moves focus to that node face. Round-trip preserves
  the roving holder in both composites.

**Screen reader / ARIA**

- **T-S1** `#og-svg-host` has `aria-hidden="true"`; **no focusable element** has an `aria-hidden`
  ancestor. *(Assert by DOM walk, not by regex.)*
- **T-S2** Every `.og-node` has a non-empty `aria-label` **and** an `aria-describedby` resolving to a
  non-empty element naming its inbound and outbound arrows. No `.og-node` has a `title` attribute.
- **T-S3** `#og-nodes`'s label states both the drawn count and the total, and each rank band is its
  own labelled `role="group"`.
- **T-S4** Every ledger register is a `<section>` with an `<h3>`; the page's heading outline has no
  skipped level between `h1` and any `h3`.
- **T-S5** The row-count / match-count readout is `role="status" aria-live="polite"` (the house
  pattern) and updates on every filter and find change.
- **T-S6** Every `<details>` summary states its own count, and no `<details>` summary is empty text.

**Colour, forced-colors, print**

- **T-S7** `scripts/validate_palette.js` passes `--pairs all` on whatever culture palette ships, at
  the light card surface, and the output is quoted in the commit message. Ship the invocation in
  `scripts/` so it is re-runnable.
- **T-S8** `opgraph.css` contains a `@media (forced-colors: active)` block; no encoding in the sheet
  is carried by `box-shadow` or `opacity` alone.
- **T-B14** In an emulated forced-colors rendering, every node face still exposes its grade word, its
  culture name and its flags as text.
- **T-B15** A simulated `beforeprint` opens every `<details>` under `#og-mirror`; `afterprint`
  restores the exact prior open/closed set.
- **T-B16** At 390 px: `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal
  page scroll), register A is open, and every grid row renders in ≤ 2 lines.

**Framing (existing gates that must keep passing)**

- **T-S9** No second-person address, no imperative openings, no operative text — `og-framing.mjs`
  must still pass over every new string, including the new column headers, the disclosure summaries,
  and the find box's placeholder.

---

## 11 · What I would explicitly not do

- **Not** move the mirror to its own page (§0, §3.2).
- **Not** virtualise, paginate, or default-filter (§3.2).
- **Not** use `role="grid"`, `role="tree"` or `role="application"` anywhere on this page (§5.2, §6).
- **Not** use `content-visibility: hidden` — only `auto` (§3.2).
- **Not** vendor a table or virtual-list library. Everything above is `<details>`, `<table>`,
  `hidden`, `content-visibility`, a roving `tabIndex`, one `role="status"` node and two event
  listeners. No new dependency is justified against that.
- **Not** rely on the browser to open `<details>` for find-in-page (§3.5).
- **Not** let the expanded whole-page view cover the ledger without carrying it (§5.4).

---

## 12 · Risks

1. **Three levels of disclosure is three clicks to one evidence sentence.** Mitigated by the find box
   auto-opening the ancestor chain, by "Open everything", by the dossier (one click from any row),
   and by register A being open by default — but it is a real cost and the build should measure
   clicks-to-fact, not just pixels.
2. **The roving tabindex inside a `<table>` is unusual.** It is safe for screen-reader table
   navigation (the table semantics are untouched) but it will surprise a sighted keyboard user who
   expects Tab to walk rows. Mitigate with a visible one-line instruction above each register and
   `aria-keyshortcuts`, exactly as the node layer's `role="group"` label already does.
3. **`hidden="until-found"` and find-in-page auto-open are recent platform features.** The design
   never depends on them (§3.5, §4) — but if the "Open everything" control regresses, the fallback
   goes with it. T-B7 and T-B8 are the guards; keep them.
4. **The palette work is not optional and it is not mine to finish.** `--pairs all` fails today.
   Whoever owns the visual encoding must pick a ≤ 8 family palette and re-run the validator; if that
   specialist's proposal keeps 43 cycled hues, the culture accent must be removed rather than shipped
   as a false identity channel.
5. **Building the mirror on `ledgerModel()` will change the rendered ledger.** The engine's row shape
   is not identical to `mirrorHTML`'s current one (e.g. `bestGrade` ordering differs from
   `GRADES.find`). Expect a real diff, and diff it deliberately rather than discovering it.
6. **T-B8 (byte-completeness of the collapsed DOM) is a strict test** and will fail on any future
   "just truncate this one long field" edit. That is the point; do not weaken it to a substring check.
7. **Print becomes 60–90 pages.** Correct, and stated — but somebody will print it by accident.
   Say the page count in the ledger prose and consider a print-time confirmation line in the header.
