# THE CONFLUENCE ATLAS — UI UPGRADE PLAN (R28)
### Making `pages/confluence.html` beautiful and best-in-class — plan only, nothing written in-repo

**Status:** build-ready plan for Opus coders. Written against the SHIPPED R27 atlas
(`pages/confluence.html`, `assets/js/app/confluence.js` 904 ln, `assets/js/core/confluence.js` 242 ln,
`assets/css/confluence.css` 303 ln, `assets/js/core/data/confluence.js` — 188 entries / 151 edges / 9 lanes)
and the R27 design doc (`scratchpad/r27/timeline-design.md`). Every proposal below is vanilla ES-module
JS, offline, no libraries, no external fonts/tiles, reduced-motion-first, DS2-token-only, and respects
the locked honest-science framing: **influence documented, never validated; described, never prescribed;
CONTESTED shown both ways, never resolved.**

Site invariants that bind every work package (WP):
- `core/**` pure (no DOM/Date/random/network), headless-testable by `scripts/engine-test.mjs`
- DOM only in `app/**`; SVG styled by class + `var(--dg-*, hex)` (chart.js `WHEEL_STYLE` convention)
- DS2 tokens only; `style.css` locked — additions go in `assets/css/confluence.css`
- reduced-motion-first: default state IS the final state; motion gated behind
  `prefers-reduced-motion: no-preference` + `matchMedia` check in JS
- filters never re-layout (spatial memory survives every toggle) — the shipped rule, kept
- every fact also exists as text (never-graphics-alone); every new claim cited; contested flagged
- verify gate: `audit.mjs` + `engine-test.mjs` + Chromium sweep (`verify-site` skill) before ship

---

## 0. GROUND TRUTH — what R27 actually shipped vs. what the spec drew

An audit of the shipped code against `timeline-design.md`. These gaps are the cheapest beauty wins
because the design thinking is already done; several R28 items below are "finish the spec," not new
invention.

| # | Spec'd (R27 §) | Shipped? | Evidence |
|---|---|---|---|
| G1 | Search (`q` in filter state) | **Core only.** `filterEntries()` accepts `q` and searches title/body/place/sources (`core/confluence.js:191-194`); the toolbar has **no search input** — `state.q` is only ever set by `resetFilters()` | half-plumbed: WP-2 is mostly UI |
| G2 | Node clustering `+N` chips (§3.6.4) | **No.** Greedy sub-tracking is unbounded (`rowOffsetIndex` rows 0,−1,+1,−2,+2…) and `rowX` clamps into the lane — rows ≥ ±2 pile up on the lane edges in dense zones | `core/confluence.js:134-136` |
| G3 | Label anti-collision `.is-quiet` (§3.6.5) + per-zoom label policy (§6.2) | **No.** The CSS class exists (`confluence.css:160`) but no JS ever assigns it; labels render at every zoom incl. ×0.6 | dense zones = label soup |
| G4 | Corridor braid offsets + long-haul k-boost (§4.3) | **No.** All edges use identical control-point math; parallel journeys between the same lane pair overlap exactly | `core/confluence.js:159-172` |
| G5 | Edge epistemic labels + citations (§1.2, §4.4) | **No — data gap.** Shipped edge schema is `{from,to,kind,body,sources}`: no `label`, no `cite`-per-claim, no `dateText/sortYear`. The spec's signature honesty device — "a fabricated journey renders faint" — is unimplementable without a data pass | `data/confluence.js` header §SCHEMA |
| G6 | Sticky era headers within band (§2.3.1) | **No.** Era heads are `position:absolute` at band top; they scroll away. The "current era" exists only as small `aria-hidden` toolbar text (`#cfl-era-current`) | WP-4 |
| G7 | The century bracket ⎡100 y⎦ scale sample (§2.3.2) | **No.** Ticks widen down the page (good) but the physical scale sample per band never shipped | WP-4 |
| G8 | Sticky ruler gutter + sticky lane headers (§3.2) | **No.** Tick labels at `x=4` and lane headers at `top:0` both scroll away (lane identity is lost after the first screenful; labels vanish under horizontal scroll at 720–1139 px) | WP-10 |
| G9 | Zoom label policy ×0.6 marks-only (§6.2) | **No** — see G3 | WP-6 |
| G10 | Print/export | Ledger-only print (`@media print` hides the atlas). No SVG export of the map itself | WP-9 |
| G11 | Deep-link filter relaxation "only those" (§6.6) | Blunt: `openDrawer` calls `resetFilters()` wholesale | polish, WP-10 |
| G12 | Minimap, guided tours, rich hover cards | Never spec'd — genuinely new in R28 | WP-1, WP-8, WP-7 |

**Data facts that shape the plan** (computed from the shipped module, 2026-07-16):

- Per-lane totals: confluence **44**, alchemy-west 24, buddhist 22, yoga-vedanta 19, tantra-rasa 19,
  christian 18, kabbalah 18, daoist 17, islamic **7**.
- Densest lane×band cells: confluence×global **21** (836 px tall ⇒ 25 px/entry — at the sub-track
  limit already), confluence×early-modern 10, tantra-rasa×transmission 9 (660 px), kabbalah×early-modern 8,
  buddhist×global 8.
- Corridors: **122 of 151 edges are same-lane** (confluence↔confluence 26!, kabbalah 18, yoga-vedanta 16,
  buddhist 15, daoist 14, alchemy-west 13); heaviest cross-lane corridor alchemy-west↔confluence **13**,
  then confluence↔yoga-vedanta 6, confluence↔kabbalah 4. Edge kinds: influence 91, commentary 18,
  translation 15, adaptation 12, synthesis 8, refutation 7.
- `engine-test.mjs:1677-1722` already asserts: 188 exact count, lane order, slug uniqueness, no dangling
  edges, enum membership, contested ≥2 positions, siteLink files exist, monotonic scale, deterministic
  layout, same-row non-overlap, thread reachability (`sirr-i-akbar → oupnekhat`), stats consistency.

---

## 1. SURVEY — thirteen great timeline/flow/network designs, one stolen idea each

Each row: the reference (with URL), **the ONE idea worth stealing**, and an honest verdict on whether
it survives this site's constraints (vanilla JS, offline, no libraries, reduced-motion-first,
honest-science framing).

### 1.1 The Histomap (John B. Sparks, 1931)
- David Rumsey copy: https://davidrumsey.reprintmint.com/002-1810001.html · Internet Archive scan:
  https://archive.org/details/dr_the-histomap-four-thousand-years-of-world-history-relative-power-of-conte-1810001 ·
  analysis: https://www.visualcapitalist.com/histomap/ and
  https://slate.com/human-interest/2013/08/the-1931-histomap-the-entire-history-of-the-world-distilled-into-a-single-map-chart.html
- **Steal:** vertical time flowing down a tall poster, with lane WIDTH as a data channel — you *see*
  where a civilization is thick or thin without reading a number.
- **Survives?** The vertical-poster feel: yes (we have it). The width channel: **only in a modified,
  honest form.** Sparks's width encoded an *undefined* "relative power" — the chart's most-criticized
  flaw (Slate, Visual Capitalist above). Our equivalent trap: encoding entry-count-as-width would
  present *our curation density* as *historical importance*. Full assessment and the honest alternative
  in WP-5. Verdict: steal the ambient density signal, refuse the moving lane boundaries.

### 1.2 Knight Lab TimelineJS
- https://timeline.knightlab.com/ · https://github.com/NUKnightLab/TimelineJS3
- **Steal:** the two-part architecture — a detail view plus a persistent, always-visible **"timenav"
  density strip** you can grab and traverse; eras rendered as labeled spans inside the nav.
- **Survives?** Yes, trivially: it's DOM + SVG, no WebGL. Our version is the vertical minimap (WP-1).
  What we *don't* take: TimelineJS's one-event-at-a-time slide model (our atlas is a field, not a
  slideshow) and its Google-Sheets/network dependency.

### 1.3 Histography.io (Matan Stauber, Bezalel)
- https://histography.io · maker: https://cargocollective.com/matanstauber/histography ·
  interview: https://www.smashingmagazine.com/2016/09/interview-with-matan-stauber/
- **Steal:** the bottom **period scrubber with visible dot-density** — the range selector itself shows
  *where history is thick*, so choosing a range is informed, not blind. Also: hovering a dot pulls a
  card without navigation.
- **Survives?** The concept, yes; the implementation, no (Pixi/WebGL, thousands of animated dots,
  motion-heavy). Our From/To `<select>`s are the blind version of this — WP-1's minimap doubles as the
  sighted one. The bouncing-dots aesthetic is explicitly rejected (reduced-motion-first, and popcorn
  motion at 188 nodes reads as noise).

### 1.4 xkcd 657 "Movie Narrative Charts" (Randall Munroe, 2009)
- https://xkcd.com/657/ · large: https://xkcd.com/657/large/ ·
  https://www.explainxkcd.com/wiki/index.php/657:_Movie_Narrative_Charts
- **Steal:** two ideas. (a) Proximity = relationship: lines that converge when characters are together.
  (b) **Hand-placed inline annotations of hinge moments** ("Battle of Helm's Deep") directly on the
  chart surface — the chart narrates itself.
- **Survives?** (a) only partially — our lanes are fixed categorical columns and *must stay fixed*
  (spatial memory, keyboard nav, filter stability). But the *confluence spine* already IS the xkcd move:
  entries that belong to several traditions sit between them. (b) survives perfectly and is cheap:
  era-header annotation prose (WP-4) and story callouts (WP-8) are our hand-lettered moments.

### 1.5 Minard's Carte figurative (1869)
- https://en.wikipedia.org/wiki/Charles_Joseph_Minard ·
  https://www.nationalgeographic.com/culture/article/charles-minard-cartography-infographics-history ·
  Tufte's praise: https://closeread.dev/gallery/examples/minards-map/index.html
- **Steal:** flow **width as an honest aggregate quantity**, plus multiple aligned channels (the
  temperature strip below the map).
- **Survives?** Yes, in one precise place: at low zoom, individual arcs in a heavy corridor
  (alchemy-west↔confluence carries 13) can be *replaced by one labeled ribbon whose width encodes the
  count of documented crossings* — a true, countable number, unlike Sparks's "power" (WP-3c). The
  aligned-channel idea becomes the minimap's per-lane density micro-columns (WP-1).

### 1.6 Observable / D3 brushable timelines (Bostock et al.)
- https://observablehq.com/@d3/gallery · https://observablehq.com/@maritrinez/d3-brushable-timeline ·
  https://observablehq.com/@maritrinez/d3-brushable-timeline-beeswarm
- **Steal:** the **focus+context brush** — the overview strip IS the range control; dragging its
  handles filters the detail view.
- **Survives?** Yes without d3: a brush is pointer-events + two drag handles on an SVG strip. WP-1
  ships the minimap as scroll-proxy first (S), with the brush-as-range-filter as an optional second
  step wired to the *existing* `yearFrom/yearTo` state (the From/To selects stay, as the accessible
  equivalent — a brush is a mouse convenience, never the only path).

### 1.7 Ben Fry / Fathom — "The Preservation of Favoured Traces" (2009)
- https://www.benfry.com/traces/ · https://collection.cooperhewitt.org/objects/1108751253/
- **Steal:** **semantic zoom** — the same data at three sizes is three different *readings* (whole book
  → chapter → sentence), not the same picture scaled. Each zoom level has its own honest grammar.
- **Survives?** Yes — and the shipped atlas already re-renders per zoom level instead of CSS-scaling,
  so the machinery exists. R28 makes the three levels genuinely semantic: ×0.6 = shape-of-history
  (clusters + corridor ribbons + no labels), ×1.0 = the reading view, ×1.6 = the study view (all
  labels, decade ticks). WP-6 + WP-3c.

### 1.8 DensityDesign Lab (Politecnico di Milano)
- https://densitydesign.org/ · e.g. https://densitydesign.org/research/semi-di-futuro-150-years-of-politecnico-di-milano/
- **Steal:** the **poster discipline** — visualization as a designed artifact: legends woven into the
  surface, typographic hierarchy doing wayfinding, annotations as first-class content, print-worthy
  composition.
- **Survives?** Entirely — it's a design stance, not a tech. It drives WP-10 (polish pass) and WP-9
  (the SVG export should look like a DensityDesign poster: title block, covenant line, legend,
  filter-state caption).

### 1.9 British Museum × Google — "The Museum of the World" (2015)
- https://experiments.withgoogle.com/the-museum-of-the-world ·
  https://www.designweek.co.uk/issues/16-22-november-2015/british-museum-moves-its-collection-online-with-museum-of-the-world-timeline/
- **Steal:** click a dot and **relations radiate + a curator speaks** — connection-on-demand paired
  with an authored voice per object, so the network never has to be legible all at once.
- **Survives?** The radiating relations: already shipped (hover lights incident edges). The curator
  voice: yes as *text* — WP-8's guided tours are exactly "curator insight per stop," cited, offline,
  no audio. The WebGL / desktop-only / continent-color aesthetics are rejected (offline + a11y).

### 1.10 Git-graph / commit-DAG rendering
- https://pvigier.github.io/2019/05/06/commit-graph-drawing-algorithms.html ·
  https://github.com/erikbrinkman/d3-dag
- **Steal:** **deterministic lane/column assignment with stable trunks** — every client (GitKraken,
  gitk, Git Extensions) solves "many parallel histories, few columns" with a greedy column allocator
  and accepts curve-only-at-junction. Also: compaction by *reordering within topological constraints*.
- **Survives?** Yes — the shipped greedy sub-tracker is already this family. R28 upgrade: bound the
  columns at 3 and overflow to clusters (WP-6), exactly how git clients bound their lane count; and
  keep the allocator deterministic so engine-test can assert it byte-for-byte.

### 1.11 Sankey diagrams & Holten edge bundling
- Holten's FDEB paper: https://classes.engineering.wustl.edu/cse557/readings/holten-edgebundling.pdf ·
  critique: "Edge-Path Bundling: A Less Ambiguous Edge Bundling Approach" https://arxiv.org/pdf/2108.05467 ·
  NeatSankey: https://dl.acm.org/doi/10.1016/j.cag.2023.05.001
- **Steal:** the *problem statement* (clutter kills dense node-link charts) — but note the literature's
  own warning: bundling **introduces ambiguity about who-connects-to-whom** (the Edge-Path Bundling
  paper exists because of it). Ambiguity about which book influenced which is an *honesty* failure
  here, not just a UX one.
- **Survives?** True force-directed bundling: **rejected** (ambiguous + iterative solver + needless
  for 151 edges). What survives is the family's honest cousin, already spec'd in R27 §4.3 and unshipped:
  **corridor braiding** (parallel edges offset ±6 px so a heavy corridor reads as a braid, each strand
  still individually hoverable) + Minard-style *labeled aggregate ribbons* only at ×0.6 (WP-3).

### 1.12 Mapping the Republic of Letters (Stanford CESTA)
- http://republicofletters.stanford.edu/ · https://history.stanford.edu/publications/mapping-republic-letters ·
  Voltaire case study: http://republicofletters.stanford.edu/casestudies/voltaire.html ·
  NEH essay: https://www.neh.gov/humanities/2013/novemberdecember/feature/mapping-the-republic-letters
- **Steal:** two ideas. (a) The "Knot" principle — the team deliberately rejected traffic-weighted
  lines so *every connection keeps equal claim* and the user chooses emphasis; (b) **named case
  studies** (Voltaire, Franklin) as curated doors into an otherwise overwhelming network.
- **Survives?** Both, perfectly. (a) endorses the shipped one-ink/0.55-opacity edge design and warns
  WP-3c to keep aggregate ribbons opt-in-at-one-zoom-only. (b) is the strongest precedent for WP-8:
  our "stories" are case studies with prose, and the honest-science covenant is our version of their
  scholarly apparatus.

### 1.13 Deniz Cem Önduygu — "History of Philosophy, Summarized & Visualized"
- https://www.denizcemonduygu.com/philo/ · about: https://www.denizcemonduygu.com/portfolio/the-history-of-philosophy/ ·
  coverage: https://dailynous.com/2018/10/09/gorgeous-interactive-timeline-philosophical-ideas/
- **Steal:** hover a statement and its **agreement (green) / refutation (red) lines light across
  25 centuries** — the argument-thread as the unit of reading; plus the hand-curated, no-AI editorial
  stance stated proudly in the method note.
- **Survives?** The hover-trace: already shipped (edge-hot/dim). The steal for R28 is presentational:
  in the drawer and hover card, render **refutation journeys with their crossbar glyph and a
  distinct "argued against" phrasing** so the disagreement layer is readable as text, not only as a
  dash pattern; and Önduygu's method-note candor endorses our method note verbatim. Colored
  agree/disagree edges are rejected (colour stays reserved for lanes + epistemics — DS2 rule).

**Survey synthesis — the five moves that matter:** (1) a sighted overview strip (TimelineJS +
Histography + Observable brush); (2) semantic zoom, not scaled zoom (Fry); (3) honest aggregate
ribbons where corridors are heavy, never ambiguous bundles (Minard yes, Holten no); (4) curated,
cited stories as doors (Republic of Letters, British Museum); (5) poster-grade finish and
self-annotation (DensityDesign, xkcd). Histomap contributes its *ambition* and one warning label.

---

## 2. WORK PACKAGES — concrete upgrades, each with effort (S/M/L) and risk

Conventions: effort S ≈ half a session, M ≈ a session, L ≈ multi-session. Risk = chance of breaking
shipped behaviour or violating an invariant, with the named mitigation. Every WP lists exact files.
No new pages, no new registry entries (this upgrades an existing tool page); `mountChrome('confluence')`
and the shared AI assistant stay as-is, with report extensions noted where relevant.

### WP-1 · Minimap / scrollbar-density strip — **M, medium risk**
The atlas is ~3,600 px tall; the only overview today is the era-jump `<select>`. Ship a vertical
**minimap** that shows the whole time domain, where entries are dense, where you are, and (click/drag)
takes you there. This is the single highest-leverage beauty+usability item.

- **Design.** A `--cfl-minimap-w: 56px` column, `position: sticky; top: var(--sticky-top)` inside a
  new grid track of `.cfl-stage` (LEFT of the atlas, so it never collides with the right-docked
  drawer). Height = `min(72vh, atlas visible run)`. Contents, drawn as one small SVG:
  - the six era bands as tinted blocks (same `--dg-era` zebra), each with a 2-letter label;
  - **9 micro-columns of per-lane density**: each lane a 3 px column, cells of `heightPx/48` rows,
    cell opacity ∝ entries in that (lane × slice) — the Histomap signal, in miniature, honestly
    labeled by the tooltip "entries in this atlas, per era — a fact about our curation" (§WP-5);
  - the viewport indicator: a `--accent` 1.5 px-stroked rect, updated on scroll (rAF-throttled,
    reusing the existing `onScroll` handler);
  - filtered-out entries drop from the density immediately (recompute on `applyFilters()` — cheap,
    it's ≤ 500 rect opacities via one `innerHTML` build).
- **Interaction.** Click = scroll that year to viewport centre (existing `scrollNodeToCenter` math
  generalized to `scrollYearToCenter(year)`); drag = continuous scrub via pointer events
  (`setPointerCapture`), `behavior:'auto'` always while dragging (motion-safe by construction).
  Optional step 2 (defer if tight): brush handles that set `state.yearFrom/yearTo` — the Observable
  steal — mirrored live into the existing From/To selects, which remain the keyboard/AT path.
- **Honesty & a11y.** The minimap is a scroll proxy: `aria-hidden="true"` SVG + the era-jump select
  and PageUp/PageDown remain the equivalent accessible controls (already shipped). The warp is
  visible in the minimap too (bands have different heights); its tooltip states the compression.
- **Core/app split.** `core/confluence.js` gains pure `minimapModel(layout, visibleSlugs, {rows})`
  → `{bands:[{y,h,label}], cells:[{laneIdx,y,h,alpha}], height}`; app paints it. Engine-test asserts
  cell alphas sum-consistent with entry counts and model determinism.
- **Files.** `core/confluence.js` (+~60 ln), `app/confluence.js` (+~120 ln), `confluence.css`
  (+~40 ln), `pages/confluence.html` (one `<div id="cfl-minimap">`).
- **Risk & mitigation.** Grid/layout collision with the drawer-open state at 1100–1440 px — mitigate:
  minimap hides below 1140 px (`@media`), and the stage grid becomes `56px minmax(0,1fr) [24rem]`.
  Scroll-sync jank — mitigate: reuse the single rAF scroll handler; no new listeners.

### WP-2 · Search with fly-to — **S, low risk**
`filterEntries` already matches `q` against title/original/body/date/place/sources — only the UI is
missing (G1). Search should **fly, not filter**: filtering by text would break spatial memory and
hide the very context the atlas exists to show.

- **Design.** A toolbar `<input type="search" id="cfl-search">` (DS2 `.filterbar` styling, ≥ 44 px
  hit) + a results listbox (`role="listbox"`, max 12 items) rendered beneath it: each row = kind
  glyph · title (serif) · dateText · lane dot. ArrowUp/Down + Enter, or click, = fly-to: cancel any
  thread highlight, `scrollNodeToCenter(slug)`, `openDrawer(slug)`, brief `.is-pulsing` (already
  gated behind motion check). Esc closes the listbox. `/` focuses search when the atlas has focus
  (documented in the visually-hidden instructions paragraph).
- If the target is filter-hidden, show it in results with a muted "hidden by filters" suffix; choosing
  it relaxes **only the offending filter axes** — implement the precise relaxation the spec asked for
  (fixes G11): compute which of {lane, kind, label, range, crossings} exclude it and flip only those.
- **Matching stays in core** (pure `searchEntries(q, limit)` wrapping the existing hay-string
  logic + a rank: title-prefix > title-substring > body; deterministic tiebreak by sortYear). Tested
  headless: `searchEntries('upanis', 12)` returns the Upaniṣad entries first.
- **Ledger mode:** the same input sets `state.q` (there the list IS the view, filtering is honest).
- **Files.** `core/confluence.js` (+~30), `app/confluence.js` (+~90), `confluence.css` (+~30),
  `pages/confluence.html` (input + listbox mount).
- **Risk.** Low. Keyboard-trap potential in the listbox — mitigate with the standard combobox
  pattern (`aria-expanded`, `aria-activedescendant`, focus stays in the input).

### WP-3 · Edge legibility program (braiding, low-zoom treatment, edge honesty) — **M code + M data, medium risk**
The arcs are "the point of the page" and currently: parallel edges overlap exactly (G4), 151 edges at
×0.6 are spaghetti in the confluence spine, and edges carry no epistemic label (G5).

- **3a. Corridor braiding (S).** Implement spec §4.3 in `layoutConfluence`: group edges by unordered
  lane-pair (`from<to` key), sort within group by target y, offset control-point x by
  `(i−(n−1)/2)·6px` (clamp total spread ≤ 0.4·laneW). **Same-lane corridors matter most here** —
  122/151 edges are within-lane (confluence↔confluence = 26): for same-lane edges, braid by bowing
  each successive arc `10+i·7 px` toward the lane's less-crowded side (deterministic: even rows left,
  odd right — computed in core). Engine-test: no two edge path strings identical.
- **3b. Long-haul depth (S).** Edges spanning ≥3 lanes get `k × 1.3` (spec §4.3) so trans-continental
  arcs dive below local chatter. One-line core change + test (k monotone in lane distance).
- **3c. Semantic-zoom edge treatment at ×0.6 (M).** The Fry/Minard steal, the Republic-of-Letters
  warning respected:
  - rest opacity drops `.55 → .35`, stroke −0.2 px (CSS via a `data-zoom="0.6"` attribute on
    `.cfl-atlas` — zero JS in the hot path);
  - corridors with **≥ 8 edges** collapse to ONE aggregate ribbon: a single Bézier at the corridor
    centreline, `stroke-width: 2 + 1.5·ln(n)`, same `--dg-edge` ink at 0.30, **labeled at mid-path**
    with a small `.cfl-corridor-chip` HTML pill: "13 crossings ⌕". Hover = tooltip listing the count
    by kind ("6 influence · 4 translation · 3 commentary"); click = zoom to ×1.0 anchored on the
    corridor's midpoint year (reuses the existing zoom re-anchoring). The ribbon is explicitly an
    aggregate — the chip label and tooltip say so; at ×1.0 and ×1.6 every edge is individual, always.
  - Core: `corridorSummary(edges)` → `[{laneA,laneB,count,byKind,midYear,d}]`, pure, tested.
- **3d. Edge epistemic labels — the data pass (M, content).** Extend each of the 151 edge records
  with `label` ('documented'|'disputed'|'debunked'|'conspiracy') **+ `cite`** (one verbatim citation
  for the *transmission claim itself*), preserving the R27 rule "edges carry their OWN label."
  Default hypothesis: most shipped edges are documented (they came from the adversarially-verified
  research pass) — the work is confirming and citing, plus hunting the handful that are not (e.g.
  any Rosenkreuz/Fez-type journeys if present; the Wilhelm→Jung Golden-Flower *reading* is documented
  as an event but Jung's interpretive claims are the disputed layer). Run the `accuracy-check` skill
  on every non-documented verdict. Rendering (S, already spec'd §4.2): `disputed` edge opacity .35;
  `debunked/conspiracy` .25 in `--ep-deb`/`--ep-con`-tinted ink, hidden when their label chip is off.
  Data regeneration goes through the `gen-data.mjs` pattern (the data file header forbids hand-edits).
  Engine-test: every edge has a label in the enum; every non-documented edge has ≥1 cite.
- **Files.** `core/confluence.js` (+~90), `core/data/confluence.js` (regenerated), `app/confluence.js`
  (+~60), `confluence.css` (+~35), `scripts/engine-test.mjs` (+~10 assertions).
- **Risk.** Medium: braid offsets could collide with node marks in narrow lanes — mitigate by
  clamping spread and adding an engine-test that no edge control point enters another lane's node
  sub-track band at ×1. The 3d data pass is the schedule long pole; it can ship one release later
  than 3a–3c without blocking them (renderer defaults absent label → 'documented' with a TODO test
  exemption list, explicitly temporary).

### WP-4 · "Century you are in" ambient header + the scale bracket — **S, low risk**
You should always know *when* you are. Today that knowledge lives in a tiny `aria-hidden` toolbar
span (G6) and the era headers scroll away.

- **The ambient pill.** Promote `#cfl-era-current` into a visible, quietly-styled pill pinned at the
  right end of the sticky toolbar (it's already sticky): `EARLY MODERN · 1500–1800` in `--fs-label`
  small-caps, plus **six era progress dots** (filled up to the current band — a 6-dot mini-Histomap
  of where you are in the scroll). Driven by the existing rAF scroll handler — zero new listeners.
  Add the same year-precision readout on the minimap indicator (WP-1). Keep `aria-hidden` (it
  duplicates the era headers, which remain in-document for AT); the dots are decorative.
- **Sticky-in-band era headers — assessed and NOT recommended as CSS-sticky.** True
  `position:sticky` within a band needs per-band wrapper elements, restructuring the absolutely-
  positioned `.cfl-over` layer (medium risk to node math for a small win, since the pill now carries
  the orientation). Instead: the era header row gets a subtle upgrade — full-width hairline +
  band-name repeated at the END of long bands (a second, mid-band whisper label at `--text-faint`
  when `heightPx > 2·viewport`) — pure absolute positioning, no restructure. (The xkcd/DensityDesign
  steal lands here too: each era header gains one curated sentence of "what is happening here" prose,
  ≤18 words, citation-free (it summarizes entries already cited below it) — e.g. TRANSMISSION AGE:
  "Greek learning re-enters Europe through Arabic; tantra and Chan cross the Himalaya.")
- **The century bracket (G7).** Ship spec §2.3.2: in the 64 px ruler gutter, one vertical bracket per
  band spanning exactly 100 y of that band's px, labeled "100 y". Adjacent brackets visibly differ —
  the warp is *seen*. ~20 lines in `buildUnder` + tokens already exist (`--dg-tick/--dg-label`).
- **Files.** `app/confluence.js` (+~50), `confluence.css` (+~30), era prose strings in
  `core/confluence.js` band definitions (pure const).
- **Risk.** Low. Toolbar wrap on medium screens — pill collapses to band name only below 900 px.

### WP-5 · Histomap breathing lanes — the honest assessment — **recommended alternative: S/M**
**The question:** should lane ribbons' WIDTH breathe with entry density (true Histomap), replacing
the fixed nine equal columns?

**Assessment — full breathing widths FAIL four ways here; recommend NO:**
1. **Honesty.** Sparks's width channel encoded an undefined "relative power" — the most-criticized
   aspect of the 1931 chart (see §1.1 sources). Our only available width datum is *entries in this
   curated atlas*, which measures **our editorial attention, not historical weight** (islamic lane: 7
   entries — because the R27 research pass was thin there, not because Sufi Islam mattered less).
   Width-as-importance would be a quiet lie of exactly the kind the covenant forbids.
2. **Geometry.** Lane x-positions anchor node buttons, edge endpoints, keyboard lane-nav, and the
   filter-never-relayouts invariant. Width varying with y makes `laneX` a function of time —
   a 2-D warp: every node/edge/keyboard computation gains a y-dependency, sub-track math breaks in
   thin regions, and lane boundaries become curves that must be hit-tested.
3. **Spatial memory.** The shipped design promises "positions computed from the full dataset;
   hidden nodes keep their slots." Breathing widths would re-shape lanes as filters change density —
   or dishonestly freeze on all-data density while showing filtered data.
4. **Reduced-motion & cost.** The delight of Histomap streams is the flowing boundary — which begs
   for animated transitions we won't ship, and static breathing boundaries mostly read as "this
   column is drawn wrong."

**What survives (the recommended S/M package, "density made ambient"):**
- **Lane density wash (S):** per lane × era-band, wash alpha steps 3%/6%/9%/12% by entry-count
  quartile (precomputed in core: `laneDensity()` → alphas; painted as per-band wash rects instead of
  one full-height rect). The lane *glows* where it is thick — the Histomap signal with zero geometry
  change. Method-note sentence added: "a lane's shading shows how many entries this atlas holds
  there — a fact about our curation, not about historical importance."
- **Minimap micro-columns (in WP-1):** the true stream-graph silhouette, safely miniaturized.
- **Lane-header counts already shipped** (the numeric channel).
- Optional third voice (defer): in the SVG export only (WP-9), a static per-lane density sparkline in
  the poster margin — a poster can afford annotation the screen cannot.
- **Files.** `core/confluence.js` (+~25), `app/confluence.js` (+~15), `confluence.css` (tokens for
  4 alpha steps). Engine-test: density quartiles deterministic, alphas within [0.03, 0.12].
- **Risk.** Low. Contrast check: 12 % lane hue wash under `--ep-*` node marks — re-run the dataviz
  validator spot-check for mark-on-wash contrast (the R27 validation covered 6 % washes).

### WP-6 · Node clustering at ×0.6 + per-zoom label policy — **M, medium risk**
Finish spec §3.6.4–5 (G2, G3, G9). This is what makes ×0.6 a *view* instead of a casualty.

- **Clustering (core).** Bound sub-tracks at 3 (centre, ±0.28·laneW — the shipped fractions). If all
  three are blocked within `MIN_GAP`, open a cluster: collect every subsequent same-lane entry whose
  y falls within `CLUSTER_SPAN = 28px` of the cluster seed; emit
  `{clusterId, laneId, x: laneCx, y: meanY, members:[slugs], label:'+N'}`; member nodes get
  `clusterOf: clusterId` and are not painted. Deterministic (sorted input, greedy). At ×1.6 the same
  algorithm usually dissolves clusters naturally (more px per year). At ×0.6, additionally *lower*
  the trigger (`MIN_GAP×1.2`) so the compact view clusters eagerly — confluence×global (21 entries)
  becomes ~4 clusters + singles.
- **Cluster chip (app).** A `.cfl-cluster` button (pill, `.badge--plain` recipe, `+5`), in the tab
  order at its y-position, `aria-label: "5 entries near 1900 CE in the Confluence lane — opens a
  list"`. Click/Enter → drawer in **cluster-list mode**: titled list (`Near 1900 · Confluence lane`),
  each row = kind glyph + title + dateText + label badge, each opening its own record. Esc returns
  to the chip. Deep-link to a clustered slug: the drawer opens normally (drawer never needs the
  node); the chip containing it gets the `.is-selected` ring. Keyboard lane-nav treats a chip as one
  stop. Filters: a chip hides only when ALL members are filtered out; its count shows
  `visible/total` ("3 of 5") when partially filtered — honest, no re-layout.
- **Label policy per zoom (core computes, app paints).**
  - ×0.6: all labels `.is-quiet` (hover/focus only), marks 10 px (`data-zoom` CSS).
  - ×1.0: core runs the spec's anti-collision — labels on adjacent sub-tracks whose y-distance
    < 14 px: later one flagged `labelQuiet:true` → `.is-quiet` (visible on hover/focus/selection —
    CSS already shipped, G3).
  - ×1.6: all labels, 2-line clamp, decade ticks added to the ruler (extend `timeScale` ticks with
    `minor10` when `pxPerCentury·zoom ≥ 300`).
- **Tests.** engine-test: (a) at zoom 1, no two *painted* same-lane marks overlap > 4 px (the spec
  §9.4-5 assertion, finally implementable); (b) cluster membership deterministic; (c) every entry is
  either painted or in exactly one cluster; (d) labelQuiet flags deterministic.
- **Files.** `core/confluence.js` (+~80), `app/confluence.js` (+~90), `confluence.css` (+~25).
- **Risk.** Medium: thread mode medallions on clustered stops (paint the medallion on the chip;
  thread panel lists the real entry) — needs explicit handling + a test; keyboard model must not
  strand focus when zoom change re-clusters under the focused node (fallback: focus the cluster chip
  that absorbed it — keep a `slug → clusterId` map per layout).

### WP-7 · Hover cards richer than the tip — **S/M, low risk**
The shipped tooltip is two lines. Make hovering feel like touching a card in a curator's drawer —
without stealing the drawer's job.

- **Node card** (max-width 20rem, same `.cfl-tip` shell upgraded to `.cfl-card`): title (serif,
  `--fs-1`) + `titleOriginal` with proper `lang`/`dir` beneath in the script font; meta line
  dateText · certainty phrase · place; **first sentence of `body`** (core provides
  `excerpt(body, 140)` — sentence-boundary truncation, pure + tested); a journeys mini-row: up to 4
  kind glyphs with counts ("↳ 2 influence · 1 translation"), phrased "argued against" for refutation
  (the Önduygu steal); epistemic badge; footer whisper "Enter opens · t follows the thread"
  (`--text-faint`, hidden on coarse pointers).
- **Edge card:** A —kind→ B (both serif), the edge `body` (≤25 words, shipped), and after WP-3d its
  label badge + cite count. For refutation: "A argued against B" phrasing.
- **Behaviour.** 220 ms hover delay (richer card = stronger flicker guard), instant on keyboard
  focus, `aria-hidden` stays (node `aria-label` already speaks everything). Position: prefer right
  of node, flip left near the drawer edge; never under the cursor. Max height clamp + overflow
  hidden — a hover card never scrolls.
- **Files.** `app/confluence.js` (+~60), `core/confluence.js` (+~15 for `excerpt`),
  `confluence.css` (+~30).
- **Risk.** Low. Watch: card overlapping the tooltip-triggering node at high zoom (offset by mark
  size + 8 px, tested in the Chromium sweep).

### WP-8 · Guided-tour mode — curated, cited stories — **M code + L content, low technical risk**
The Republic-of-Letters case-study steal: named journeys with prose, built on the shipped thread
machinery. The auto-thread walks *chronology*; a story walks an *argument*.

- **Data.** New module `assets/js/core/data/confluence-stories.js` (separate file so `gen-data.mjs`
  regeneration never clobbers curated prose — pure data, cited):
  ```js
  // CONFLUENCE_STORIES — each:
  // { id,                      // kebab, deep-link (#story=<id>)
  //   title, lede,             // ≤22-word lede, honest-science voice
  //   stops: [{ slug,          // entry slug (must exist — engine-tested)
  //             viaEdge|null,  // edge key that brought us here (must exist)
  //             prose }],      // 60–120 words, curator voice; cites live on the
  //                            //   underlying entry/edge — prose may add NO new
  //                            //   factual claim without its own source string
  //   closing,                 // one paragraph; restates the covenant where apt
  //   sources: [] }            // story-level additional citations if any
  ```
- **Launch set (4 stories, all walkable on existing edges — verified feasible):**
  1. **"The journey of the Upaniṣads West"** — Bṛhadāraṇyaka → Dārā Shikōh's *Sirr-i-Akbar* →
     Anquetil-Duperron's *Oupnek'hat* → Schopenhauer → … (the chain engine-test already proves:
     `threadFrom('sirr-i-akbar')` reaches `oupnekhat`). The task brief's named example; the prose
     exists in embryo in the edge bodies.
  2. **"Greek → Arabic → Latin"** — the double translation movement through the islamic lane and
     Toledo (alchemy-west↔confluence corridor, 13 edges to draw from).
  3. **"The Golden Flower, misread"** — Daoist neidan → Wilhelm 1929 → Jung's commentary: a story
     whose *point* is a documented transmission carrying a disputed interpretation (epistemic labels
     do the talking).
  4. **"The fabricated journeys"** — a tour OF debunked/conspiracy entries and (post-WP-3d) edges:
     the honest-science showcase; prose states plainly why each is on the map yet drawn faint.
- **UI.** A "Stories" control in the toolbar (a select is cheapest and wraps best; four styled
  buttons under the hero is the prettier variant — decide in build). Entering a story = thread mode
  with hand-ordered stops: medallions, dim, `n`/`p` stepping — all shipped; the thread panel becomes
  the **story panel**: story title, per-stop prose above the entry summary, stop list, progress
  ("stop 3 of 7"), Leave. `#story=<id>` deep link (extends `applyHash`, exactly like `#thread=`).
  Story state joins `currentConfluenceReport()` so the AI assistant can discuss the tour the user
  is on.
- **Honesty gates.** Every stop's prose reviewed against the covenant (described-not-prescribed;
  disagreements CONTESTED-both-ways); run `accuracy-check` on any new factual claim; story 4's framing
  reviewed extra-carefully (it *describes* fabrications as discourse history). Engine-test: every
  story stop slug + viaEdge resolves; every story has ≥3 stops; prose word-count bounds; stories with
  claims not covered by stop sources carry story-level sources.
- **Files.** new `core/data/confluence-stories.js` (~200 ln), `core/confluence.js` (+~20 validation
  helpers), `app/confluence.js` (+~80), `pages/confluence.html` (+ control), `confluence.css` (+~15);
  add a "guided tour / story" line to the site glossary data if the term surfaces in chrome.
- **Risk.** Technical low (machinery shipped). Content is the long pole — schedule the 4 stories as
  the R28 content task, parallel to code.

### WP-9 · Print / SVG export — **M, medium risk**
The ledger prints; the *map* deserves a poster (the DensityDesign steal).

- **"Download the map (SVG)"** button in the toolbar (`.btn-quiet`). Builds a **standalone SVG
  string**: everything currently in `#cfl-under` PLUS nodes/labels/era-headers re-rendered as SVG
  `<g>`/`<text>` (the HTML layer can't serialize), PLUS a poster chrome: title block ("THE GREAT
  CONFLUENCE — influence documented, never validated"), the four-label legend, lane legend,
  date + **filter-state caption** ("Showing 163 of 188 entries · lanes: all · labels: documented,
  disputed" — an export that silently omitted filtered entries would be dishonest), and the method
  note in the footer margin.
- **Architecture.** Pure builder in a new `core/confluence-export.js`: `exportSvg(layout,
  visibleSlugs, palette, meta)` → string. No DOM: the app resolves ~20 token values once via
  `getComputedStyle(document.documentElement)` into a plain `palette` object and passes it in — core
  stays pure and the builder is headless-testable (assert: parses as XML, contains N node groups,
  contains the covenant string). Fonts: `font-family` strings referencing system stacks
  (Georgia/serif etc.) — acceptable for an offline artifact; no font embedding.
- **Download** via `Blob` + `URL.createObjectURL` + programmatic `<a download="confluence-atlas.svg">`
  — fully offline. File ≈ 300–600 KB.
- **Print CSS** stays ledger-first (correct — a 3,600 px map cannot paginate honestly), but add a
  one-line hint in the method note: "For the map itself, use Download SVG."
- **Files.** new `core/confluence-export.js` (~150 — separate module keeps the geometry engine lean),
  `app/confluence.js` (+~40), `pages/confluence.html` (button), engine-test (+3 assertions).
- **Risk.** Medium: SVG text metrics (no `measureText` in the builder) — mitigate with generous
  fixed label boxes and the already-known laneW; label overflow in the poster clips at lane edge.
  Verify the artifact opens in browser + Inkscape during the sweep.

### WP-10 · Light-theme polish — the parchment finish pass — **S/M, low risk**
The site is single-theme parchment; "light-theme polish" = making the one theme sing. A punch list,
each item ≤ 20 lines of CSS/JS; ship as one batch:

1. **Sticky lane headers** (G8): lane header row becomes `position:sticky; top:<toolbar-h>` in a thin
   full-width strip above the atlas scroll box (restructure: headers move OUT of `.cfl-over` into a
   sibling `.cfl-lane-strip` that shares the horizontal scroll offset — one `scroll` listener syncing
   `transform:translateX(-scrollLeft)`, rAF-throttled). Lane identity never scrolls away. *(the one
   M-sized item here)*
2. **Sticky ruler labels** (G8): tick labels move to a `position:sticky; left:0` 64 px gutter div
   (HTML, not SVG) so dates survive horizontal scroll at 720–1139 px.
3. **Spine framing**: implement the spec's double-gilt rule (two 1 px `--accent-soft` lines 3 px
   apart each side) — shipped is single lines; the "meeting ground" should read framed.
4. **Era zebra**: drop to 45 % opacity as spec'd (shipped rect uses raw `--dg-era`); hairline
   `--border` top rule already present — keep.
5. **Node marks**: add `shape-rendering:geometricPrecision`; keep mark stroke 2 px consistently;
   no `:hover` mark scale (motion-adjacent; the ring + label reveal is enough).
6. **Focus/selection rings**: `.is-selected` ring offset −3 px → −4 px so it clears 2 px strokes;
   verify `--focus` ring visible on all four `--ep-*-wash` fills (contrast spot-check).
7. **Toolbar composure**: group separators (`border-left: 1px solid var(--border)` between
   `.cfl-group`s), and on < 1200 px collapse kind+label chips into a `<details class="acc">`
   "More filters" — the shipped toolbar wraps to 4 rows on a 1024 px screen; 2 rows max after.
8. **Tooltip → card shell** shared with WP-7 (`--shadow-2`, 1 px `--border`, `--rad-2`, small caret).
9. **Ledger**: zebra rows at 3 % wash; sticky era headers already shipped — add entry-count per era
   in the header ("EARLY MODERN · 34 shown").
10. **Deep-link relaxation** (G11): replace `resetFilters()` with per-axis relaxation (shared with
    WP-2's logic).
11. **Empty-state**: add the one-click "Reset filters" button inside the atlas viewport too (shipped
    only in ledger).
12. **`title` truncation honesty**: any clamped label gets `title=` full text (spec'd, partially
    shipped — audit and complete).
- **Risk.** Low each; the lane-strip restructure (item 1) is the only one touching layout math —
  gate it with the Chromium sweep at 3 widths (390/1024/1440).

### WP-11 · Performance guardrails — **S, low risk**
Current scale (188 + 151) is far under budget; the guardrails exist so data growth (§3) can't
silently rot the page.

- **Engine-test tripwires** (headless, exact): entries ≤ **450**, edges ≤ **400**, painted DOM
  estimate `(entries·2 + edges·2 + chrome) ≤ 2,500`; per-lane×band count vs. capacity model (§3.1)
  with WARN at 70 % and FAIL at 100 %; corridor width ≤ **16** edges before mandatory ribboning
  (WP-3c threshold check). Each failure message names the remedy ("split the lane's band entries or
  raise cluster eagerness — see r28plan/atlas-ui.md §3").
- **Runtime**: layout memo Map already keyed `zoom|width` — cap at 12 entries (clear on the 12th
  insert; resize storms otherwise grow it unbounded). Filters keep the toggle-only path (never
  re-layout — re-assert in a comment + a test that `applyFilters` mutates only attributes). Minimap
  repaint ≤ 1/frame (shared rAF). One-time `performance.now()` paint log in dev (`?perf=1` query,
  console.info only) to keep the <25 ms repaint claim testable by hand.
- **Browser sweep**: add `#slug` and `#story=` deep-link URLs of the confluence page to the sweep
  list so cold-load paths are exercised in real Chromium.
- **Files.** `scripts/engine-test.mjs` (+~25), `app/confluence.js` (+~15).

---

## 3. HOW NEW DATA LANDS — the growth path for the Buddhist-canon & practices wings

R28+ wings will add entries and edges. The atlas must grow *gracefully* — and refuse growth that
would break its legibility.

### 3.1 Capacity model (encode in `core/confluence.js`, assert in engine-test)
Per lane × era-band, the legible ceiling at zoom 1 is:

```
capacity(band) = floor(band.heightPx / MIN_GAP) × 3 sub-tracks     // hard geometric ceiling
legible(band)  = floor(band.heightPx / 34) × 2                     // labels readable, 2 tracks
```

| band | heightPx | hard cap | legible | densest today |
|---|---|---|---|---|
| antiquity | 360 | 48 | 21 | 4 (yoga-vedanta) |
| classical | 630 | 85 | 37 | 7 (daoist) |
| transmission | 660 | 90 | 38 | 9 (tantra-rasa) |
| scholastic | 480 | 65 | 28 | 5 (kabbalah) |
| early modern | 660 | 90 | 38 | 10 (confluence) |
| global | 836 | 114 | 49 | **21 (confluence)** |

Working rule: **≤ 30 entries per lane-band** (the R27 assumption) = comfortable with clusters;
engine-test WARNs at 21 (70 %) and FAILs at 30. The confluence×global cell is already at the WARN
line — WP-6 clustering is therefore a *prerequisite* for any data growth, and new spine entries in
1800–2020 need the strictest admission bar.

### 3.2 Admission bar — what earns an atlas seat
The wings hold depth; the atlas holds crossings. A new wing record becomes a CONFLUENCE entry only if:
1. it is an endpoint of a **documented cross-lane edge** (it traveled), OR
2. it anchors the lane's internal spine — the ≤ ~8 per band texts/people a reader needs to follow the
   lane at all, OR
3. it is a confluence-lane event (a meeting point itself).
Everything else lives in its wing and links here via the shipped `siteLink`/chronology `links`
mechanism (one-way: wing page → `confluence.html#slug` requires the slug to exist; audit.mjs already
checks hrefs). Expected Buddhist-canon delta under this bar: ~15–25 entries (canon formations,
Tibetan + Chinese translation events, Pali Text Society, the 1893 Parliament thread), not the wing's
full roster — buddhist lane 22 → ~40, still under caps everywhere; watch buddhist×global (8 →
mid-teens: fine).

### 3.3 Edge growth rules
- New edges must name **kind + label + cite** (post-WP-3d schema) at authoring time — the regenerator
  (`gen-data.mjs` pattern) rejects unlabeled edges; `accuracy-check` for anything non-documented.
- **Corridor budget:** > 8 edges in one lane-pair corridor triggers ×0.6 ribboning automatically
  (WP-3c); > 16 fails engine-test — at that point the corridor needs editorial consolidation (are
  five "influence" edges really one synthesis event + one edge?) rather than more ink. The
  buddhist↔daoist corridor (Chan/Zen material) is the likely first tester.
- Same-lane edge chains (lineage successions) prefer **chronology-wing narration** over atlas edges:
  the atlas edge is for *crossings*; a lane's internal genealogy beyond spine-anchor links thickens
  the braid without adding map information.

### 3.4 When a filter preset becomes a named story
Add `#f=` filter-state deep links (S: serialize `filterState()` into the hash, restore in
`applyHash` — the URL-shareable preset). Then the promotion rule:

> A preset stays a preset while it merely *selects*. It becomes a **story**
> (`confluence-stories.js`) the moment it needs to *say* something — an ordering, a beginning and an
> end, prose at the stops. Presets are free; stories cost citations and an accuracy pass.

Practical pipeline: ship notable presets as three "quick view" chips above the atlas ("Only the
crossings", "The fabrications", "The modern exchange") — each just a canned `filterState`; when a
preset keeps needing narration (readers asking "what am I looking at"), promote it to a story in the
next content round. The Buddhist-canon wing arrives with one preset ("The dharma moves east") that is
the designated story candidate for R29.

### 3.5 Test & data hygiene under growth
- Replace the brittle `entries.length === 188` exact assertions with counts exported by the
  regenerator (`export const CONFLUENCE_COUNTS = {entries, edges}` written into the data module);
  engine-test asserts internal consistency + the §3.1 capacity model instead of magic numbers.
- Lane roster is **frozen at nine** — a tenth lane breaks the validated 8-hue palette, the crossing-
  minimized order, and lane-width math. New traditions join an existing lane or the spine; the data
  file header documents this as a design invariant. (If a future wing truly demands a tenth lane,
  that is a redesign round, not a data drop.)
- Stories file is never regenerated; entry/edge data only via the regenerator; the `DO NOT hand-edit`
  header stays.

---

## 4. BUILD ORDER FOR OPUS (dependencies honored)

| Phase | Contents | Gate |
|---|---|---|
| 1. Core foundations | WP-6 clustering + label policy; WP-3a/3b braid + long-haul; WP-11 capacity model + tripwires | engine-test green (new assertions in) |
| 2. Navigation | WP-2 search + precise filter-relax; WP-4 ambient pill + bracket + era prose; WP-1 minimap (scroll-proxy first, brush optional) | Chromium sweep at 390/1024/1440 |
| 3. Depth & polish | WP-7 hover cards; WP-3c ×0.6 edge treatment + corridor ribbons; WP-10 punch list (lane strip first); WP-5 density wash | dataviz-validator spot-check on new washes; sweep |
| 4. Content & export | WP-3d edge label data pass (accuracy-check per non-documented edge); WP-8 stories ×4; WP-9 SVG export | accuracy-check logs; engine-test story/edge assertions; full `verify-site` |

Phases 1–3 are pure code and independent of the data pass; Phase 4's two content tasks (edge labels,
stories) can run in parallel with Phase 2–3 coding. Nothing here touches `assets/css/style.css`,
`core/data/*` other than the confluence regenerator + the new stories module, or any other page
except the optional chronology cross-link already shipped.

Acceptance (beyond the standing gate): keyboard-only run reaches a cluster chip, opens its list,
enters a story, steps it, exports the SVG (button reachable), and exits — zero animation under
reduced motion; `#story=`, `#f=`, `#slug` deep links all cold-load correctly; ×0.6 shows no label
soup and no identical overlapping edges; the minimap never traps focus (it has none).

## 5. RISK REGISTER (top six)

1. **Edge-label data pass (WP-3d) is the schedule long pole** — 151 edges to confirm/cite. Mitigate:
   renderer defaults to 'documented' with a temporary test-exempt list; ship visuals first.
2. **Clustering × thread/deep-link interactions** (WP-6) — medallions and focus on absorbed nodes.
   Mitigate: `slug→clusterId` map per layout + explicit tests + sweep script hitting `#thread=`.
3. **Minimap/stage grid collisions** 1100–1440 px with drawer open. Mitigate: hide < 1140 px; sweep
   at the boundary widths; minimap is enhancement-only (page fully usable without it).
4. **Lane-strip restructure** (WP-10.1) touches the paint model. Mitigate: do it first in Phase 3,
   isolated commit, sweep before stacking further polish on top.
5. **Aggregate ribbons misread as data** (WP-3c) — the Holten ambiguity trap. Mitigate: ribbons only
   at ×0.6, always chip-labeled with the count, click-to-dissolve, never claiming more than a count;
   Republic-of-Letters equal-weight principle governs ×1.0/×1.6.
6. **Story prose drifting from the covenant** (WP-8, esp. "The fabricated journeys"). Mitigate:
   accuracy-check per claim; the covenant reviewer pass listed in Phase 4's gate; prose adds no
   uncited facts by schema rule (engine-tested word bounds + sources field).

---

### Sources (survey)
- Histomap: https://davidrumsey.reprintmint.com/002-1810001.html · https://archive.org/details/dr_the-histomap-four-thousand-years-of-world-history-relative-power-of-conte-1810001 · https://www.visualcapitalist.com/histomap/ · https://slate.com/human-interest/2013/08/the-1931-histomap-the-entire-history-of-the-world-distilled-into-a-single-map-chart.html
- TimelineJS: https://timeline.knightlab.com/ · https://github.com/NUKnightLab/TimelineJS3
- Histography: https://histography.io · https://cargocollective.com/matanstauber/histography · https://www.smashingmagazine.com/2016/09/interview-with-matan-stauber/
- xkcd 657: https://xkcd.com/657/ · https://www.explainxkcd.com/wiki/index.php/657:_Movie_Narrative_Charts
- Minard: https://en.wikipedia.org/wiki/Charles_Joseph_Minard · https://www.nationalgeographic.com/culture/article/charles-minard-cartography-infographics-history · https://closeread.dev/gallery/examples/minards-map/index.html
- Observable brushable timelines: https://observablehq.com/@d3/gallery · https://observablehq.com/@maritrinez/d3-brushable-timeline · https://observablehq.com/@maritrinez/d3-brushable-timeline-beeswarm
- Ben Fry: https://www.benfry.com/traces/ · https://collection.cooperhewitt.org/objects/1108751253/
- DensityDesign: https://densitydesign.org/ · https://densitydesign.org/research/semi-di-futuro-150-years-of-politecnico-di-milano/
- British Museum / Google: https://experiments.withgoogle.com/the-museum-of-the-world · https://www.designweek.co.uk/issues/16-22-november-2015/british-museum-moves-its-collection-online-with-museum-of-the-world-timeline/
- Git-graph algorithms: https://pvigier.github.io/2019/05/06/commit-graph-drawing-algorithms.html · https://github.com/erikbrinkman/d3-dag
- Edge bundling / Sankey: https://classes.engineering.wustl.edu/cse557/readings/holten-edgebundling.pdf · https://arxiv.org/pdf/2108.05467 · https://dl.acm.org/doi/10.1016/j.cag.2023.05.001
- Republic of Letters: http://republicofletters.stanford.edu/ · https://history.stanford.edu/publications/mapping-republic-letters · https://www.neh.gov/humanities/2013/novemberdecember/feature/mapping-the-republic-letters
- Önduygu: https://www.denizcemonduygu.com/philo/ · https://www.denizcemonduygu.com/portfolio/the-history-of-philosophy/
