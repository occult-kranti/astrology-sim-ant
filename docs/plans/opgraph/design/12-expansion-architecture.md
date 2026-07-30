# 12 · The expansion architecture — the whole-page expandable view

**Role:** interaction architect. **Scope:** how the graph becomes a full-viewport workspace and comes
back; what happens to every piece of chrome in each state; how state survives the transition; the URL
contract; the keyboard path; reduced motion; 390 px; print. Then the navigation *inside* the instrument.

**Method note (dataviz skill, binding).** Form first: §1. Colour by job: I introduce **no new categorical
palette** — the one that exists was run through the validator and the result is in §1.4, because
expansion changes how it is read. Checked against the anti-patterns catalogue in §14.

Everything below is written against code I read. File:line citations are load-bearing; where I say
"today" I mean `main` at the time of writing.

---

## 0 · What is actually there now (the ground truth this spec builds on)

These are the facts that decide the architecture. Several are not visible from the measured page metrics.

| # | Fact | Where |
|---|---|---|
| F1 | **The layout is viewport-independent.** `layoutOpgraph()` takes `width` but never uses it for geometry — `width`/`height` are computed from *content extent* (`maxAlong + PAD`), and the passed viewport width is echoed back as an unused `viewportWidth` field. | `core/opgraph.js:1043-1047`, `:1035-1041` |
| F2 | **⇒ Expanding does not require a re-layout.** Growing the viewport is a pure *camera* operation. This removes the single largest risk in "expand without losing the user's position". | follows from F1 |
| F3 | **The engine already implements the focus subgraph (PLAN D12) and the app never calls it.** `filterGraph()` honours `filter.focus` + `filter.hops` and returns an n-hop neighbourhood; `layoutOpgraph` also uses `focus` to rank the render cap by hop distance. `app/opgraph.js` never sets either field. | `core/opgraph.js:702-720`, `:769-784`; `engineFilter()` at `app/opgraph.js:312-320` omits both |
| F4 | **Zoom here is semantic, not just geometric.** Box sizes scale with `zoom`, and the painter's progressive disclosure is driven by the resulting box size — `showPressure = bw >= 175`, `showSub = bh >= 40`. So 0.6 / 1 / 1.6 really are three *levels of content*, exactly as PLAN §5.6 mechanism 4 says. | `core/opgraph.js:910-925`; `app/opgraph.js:463-465` |
| F5 | **Zoom, selection and camera are not in the URL.** `encodeFilter()` serialises facets only. A record cannot be deep-linked. | `app/opgraph.js:273-284` |
| F6 | **There is no `hashchange` / `popstate` listener, and every paint calls `replaceState`.** The back button does nothing on this page. | `app/opgraph.js:1215-1218`; no listener anywhere in the file |
| F7 | **Focus is destroyed on close, and on every filter/zoom change.** `go({type:'close'})` → `paintDetail` → `dr.innerHTML = ''` while `#og-drawer-close` holds focus ⇒ `activeElement` becomes `<body>`. A full `paint()` re-writes `#og-nodes.innerHTML`, destroying the focused node button. **This is the "focus dumped to the top of a 68 k page" failure, live today.** | `app/opgraph.js:1221-1232`, `:1162-1201`, `:1246-1252` |
| F8 | **The 2-D layout has a 1-D keyboard.** ArrowRight and ArrowDown both do `i+1` over a flat DOM list; ArrowLeft and ArrowUp both do `i-1`. Rank and order are not separable by keyboard. | `app/opgraph.js:1263-1275` |
| F9 | **The chain-walk links are inert.** `chainHTML()` emits `<a href="#ogn-…" data-goto="…">` into `#og-chain-host`, and no listener is bound to that host — so a click navigates the hash, which the next `replaceState` overwrites. | `app/opgraph.js:829`, `:1155`; handlers at `:1244-1335` |
| F10 | The frame is `.og-stage-wrap > .og-scroll` at `max-height:70vh`, in a 2-col grid with a 20 rem drawer above 1000 px. Below 680 px the frame is `display:none` and the ledger is the view (D13). Print hides the frame. | `css/opgraph.css:125-134`, `:272-278`, `:281-290` |
| F11 | The first paint "parks" horizontal scroll on the first work, once, guarded by `parked`. There is no vertical parking and no re-park after a filter change. | `app/opgraph.js:1206-1214` |
| F12 | Node hit targets at level 0.6: work `114×28`, procedure-claim `90×20`, relation-claim `77×17` CSS px. **Below the 24 px minimum**, far below 44 px. | `core/opgraph.js:98-107` × 0.6 |
| F13 | The precedent is a *drop-in*: `app/confluence-nav.js` is a complete pan/zoom/fly state machine over `motion.js` whose only atlas-specific couplings are four imports from `core/confluence.js` (`zoomAnchor`, `nearestLevel`, `ZOOM_LEVELS/RANGE/REBASE`) and two `layout.scale` calls. `zoomAnchor` and `nearestLevel` are pure, data-free math. | `app/confluence-nav.js:19-20`, `:40-41`, `:193`, `:200`; `core/confluence.js:138-165` |
| F14 | `motion.js` is the only frame source, and it is already headless-safe: under reduced motion every call resolves synchronously with zero frames. | `app/motion.js:34-38`, `:68-71`, `:78-137`, `:144-205`, `:245-275` |
| F15 | The service worker deliberately keeps every opgraph asset out of the precache shell and lazily runtime-caches it — so new modules cost a `VERSION` bump, nothing more. | `sw.js:34`, `:73-74` |

---

## 1 · Form first, because it decides the container

### 1.1 The form

492 of 747 edges are `CONTAINS` + `OF_TYPE`. The spine is **work → procedure-claim → procedure-type**,
and the horizontal axis is transmission rank (an integer, not time). That is a **layered flow**, and the
engine already lays it out as one: integer rank columns, op-nodes on the odd columns, a 4-down/4-up
barycentre sweep, a type gutter on the right, culture/author gutters on the left
(`core/opgraph.js:810-905`).

So the form question for *my* layer is not "which chart" but **"what shape of container does a layered
flow need?"** The answer is a **banded viewport**: a frame that is wide in the rank direction, that can
be paged band-by-band, and whose position is always describable in words as *"transmission rank k of n"*.
Everything below follows from that — including why the atlas's 2-D minimap is the wrong instrument here
(§11.5) and why the phone answer is a band reader, not a small map (§9).

A force-directed hairball would be the wrong form, and so would a free 2-D pan that treats the vertical
axis as meaningful: **the across-band position is barycentre order, which carries no meaning at all**.
Any affordance that invites reading it as data is a defect. This is the same class of error as the
skill's "value-ramp on nominal categories" — burning a channel on non-information.

### 1.2 Route or mode

**Mode.** Not a route. Three reasons, in order of weight:

1. **The framing constitution forbids the route.** The page is built so the reader meets the standing
   note before any content (`pages/opgraph.html:31-44`). A `/opgraph-map.html` route is a URL a reader
   can arrive at *first*, putting an operative-corpus workspace in front of someone who never met the
   boundary. A mode cannot be entered without the page having been loaded.
2. **F1/F2**: there is nothing to rebuild. A route would duplicate the chrome, the standing note, the
   legend, the index and the ledger, and would then have to keep them in sync.
3. One controller, one model, one `mirrorHTML` — the AT-parity equality that `og-page.mjs` asserts stays
   an equality (`app/opgraph.js:1027-1077`).

**But the mode is URL-addressable and history-addressable** (§4), which is the only property a route
would have bought.

### 1.3 The container element

**`<dialog>` opened with `showModal()`.** Recommended over a hand-rolled `position:fixed` overlay:

| Need | `<dialog showModal>` gives it | Hand-rolled overlay |
|---|---|---|
| Top layer, above the sticky header (`--z-header:50`) and the action bar | free | z-index arms race |
| Rest of document inert (no tab escape, not in the a11y tree) | free | `inert` attribute per sibling + fallback |
| Background scroll lock **without losing page scroll position** | free | store/restore `scrollY`, the classic iOS bug |
| Esc | free — and interceptable via the `cancel` event, which the Esc ladder (§7.3) needs | manual |
| Precedent in this repo | `app/palette.js:184-195` | — |

Cost: `::backdrop` needs a token-only style, and the print rule must hide it (§10). Both are one line.
The dialog is **not** a modal in the "interrupt you" sense — it is a workspace that happens to occupy the
whole viewport, so its accessible name is a workspace name, not an alert (§7.1).

Fullscreen API (§3.3) is layered *on top of* the dialog and is strictly an enhancement, because iOS
Safari has no `Element.requestFullscreen`.

### 1.4 Colour — validator output, since expansion changes how the palette is read

I add no palette. But expansion increases how many culture accents are co-visible at once, which moves
the reading from *adjacent pairs* to *all pairs*. I ran the existing eight accents
(`css/opgraph.css:25-32`) through the skill's validator rather than reasoning about them:

```
--mode light --pairs adjacent (default):   ALL CHECKS PASS
  CVD separation      worst adjacent #8a4a22↔#b83f88  ΔE 13.3 deutan · 9.7 tritan   PASS
  Normal-vision floor worst adjacent #84831c↔#00939c  ΔE 16.2                        PASS
  Contrast vs surface all 8 ≥ 3:1                                                     PASS

--mode light --pairs all:                  FAILED
  CVD separation      worst all-pairs #b83f88↔#00939c ΔE 4.0 deutan · 3.5 tritan     FAIL
  Normal-vision floor worst all-pairs #8a4a22↔#9a5526 ΔE 4.4 (russet vs sienna)      FAIL
```

Per the skill, a normal-vision floor below 15 is a **hard** fail that secondary encoding does not excuse.
This is not a crisis today — 43 cultures share 8 slots, the accent is a 4 px left border, the culture name
is written in the sub-row and the ledger, and the page says in prose *"Colour is a finding aid; the label
is the fact"* (`pages/opgraph.html:100-101`). But it means **the expanded view must not promote accent to
an identity channel.** Concretely, the interaction consequence I own:

> **`Colour by:` is a control in the workspace toolbar, and its default in the expanded state is
> `completeness` (an ordinal ramp on an ordered scale, one hue), not `culture`.** Culture accent stays
> available and stays labelled a finding aid. A third option, `epistemic label`, uses the reserved `--ep-*`
> status palette and only there.

Hand this validator output to whoever owns colour; the accent set itself is their call, not mine.

---

## 2 · The state machine

Four states. Two axes: **presentation** (page / expanded / native fullscreen) and **representation**
(map / bands / ledger). They are orthogonal and both belong in one state object.

```
             ┌───────────────────────────────────────────────┐
             │  S0  PAGE  — the in-page instrument            │
             │      frame ≈ clamp(420px, 62vh, 760px)         │
             └───────┬──────────────────────────▲─────────────┘
        expand ▼     │                          │ collapse (Esc ×n, button, Back)
             ┌───────┴──────────────────────────┴─────────────┐
             │  S1  EXPANDED — <dialog> workspace, 100dvh      │
             │      rep ∈ { map | bands | ledger }             │
             └───────┬──────────────────────────▲─────────────┘
   requestFullscreen ▼                          │ exitFullscreen / Esc¹
             ┌───────┴──────────────────────────┴─────────────┐
             │  S2  FULLSCREEN — S1 + Fullscreen API           │
             │      enhancement only; absent on iOS Safari     │
             └────────────────────────────────────────────────┘

   S3  LEDGER-ONLY — forced when the viewport < 680px in S0, and in print.
       Not a state the user picks; a state the medium picks. (existing D13)

   ¹ the browser eats the first Esc to leave fullscreen. Second Esc collapses. Said in the hint text.
```

### 2.1 The state object (pure, in `core`, serialisable)

Extend the controller state at `app/opgraph.js:1005-1008`. Every field is a plain value; the whole thing
round-trips through the URL grammar in §4 and through `sessionStorage` for the pixel residue.

```js
state = {
  // existing
  filter, zoom, orientation, width, selected, chain, cap, layoutError,

  // NEW — presentation
  view:  'page' | 'expanded',        // S0 / S1. S2 is NOT state — see §3.3.
  rep:   'map' | 'bands' | 'ledger', // representation inside the current view

  // NEW — the camera, and this is the important design decision
  camera: {
    anchorId: string | null,   // the id of the node nearest the viewport centre
    dx: number, dy: number,    // that node's offset from centre, in VIEWPORT px
    level: 0.6 | 1 | 1.6,      // = state.zoom; the resting level
  },

  // NEW — the neighbourhood (PLAN D12; engine already supports it, F3)
  focus: string | null,        // → filter.focus
  hops:  1 | 2 | 3,            // → filter.hops
}
```

### 2.2 Why the camera is an **anchor id**, not a scroll position

This is the load-bearing decision of the whole document, and it is what makes "losing the user's
position on expand" structurally impossible rather than carefully avoided.

A scroll offset is meaningless the moment the world changes shape — and the world changes shape on
zoom-level change, on any filter change, on a focus change, on an orientation flip, and on a re-layout
after a cap change. Today the page has exactly this bug: a filter change re-lays-out and the scroll box
keeps its old pixel offset, which now points somewhere else entirely (`app/opgraph.js:1162-1214`; the
`parked` guard at `:1206` makes sure it is *never* corrected).

An **anchor id + viewport-pixel offset** survives all of it:

```
restore(camera, layout, viewport):
    p = layout.pos.get(camera.anchorId)
    if (!p) p = nearestSurvivor(camera.anchorId, layout)   // pure, engine-side; see §2.3
    if (!p) return fit(layout, viewport)                    // empty or unrecognisable view
    scrollLeft = clamp(p.x * s - (viewport.clientWidth  / 2 + camera.dx), 0, maxL)
    scrollTop  = clamp(p.y * s - (viewport.clientHeight / 2 + camera.dy), 0, maxT)
```

and capture is the inverse, run on scroll-settle (not per frame):

```
capture(layout, viewport):
    cx = viewport.scrollLeft + viewport.clientWidth  / 2
    cy = viewport.scrollTop  + viewport.clientHeight / 2
    n  = argmin over drawn nodes of hypot(n.x*s - cx, n.y*s - cy)
    camera = { anchorId: n.id, dx: n.x*s - cx, dy: n.y*s - cy, level: state.zoom }
```

Consequences, all of them good:
- **Expand/collapse preserves position exactly**, even though the viewport changed size — because the
  anchor is a *thing*, not a coordinate, and `dx/dy` clamp harmlessly when the viewport grows.
- **Filter changes stop teleporting the reader.** The same restore runs after every paint.
- The camera is describable in words for the live region: *"centred on ⟨label⟩, transmission rank 3 of 9"*.
- It is short enough to put in a URL (§4), and a shared link reproduces *what you were looking at*
  rather than *your pixel scroll*, which is the correct semantics across viewport sizes.

### 2.3 `nearestSurvivor` — the one new pure engine function the camera needs

When the anchor is filtered out, do not fall back to the origin (that is the teleport). Walk the
incidence map outward from the lost anchor and take the first drawn node in a deterministic order.
Pure, seeded by nothing, belongs in `core/opgraph.js` beside `chainFrom`:

```js
export function nearestDrawn(id, drawnIdSet)  // BFS over `incident`, ids sorted with cmpStr, cap 6 hops
```

The incidence map and `cmpStr` already exist (`core/opgraph.js:202`, `:123`). Determinism is preserved:
no clock, no random, total order on ties.

---

## 3 · The expansion transition, end to end

### 3.1 Expand — the exact sequence

```
onExpand(source /* 'button' | 'key' | 'deeplink' */):
  1.  camera = capture()                       // BEFORE anything moves
  2.  rememberFocus = document.activeElement?.dataset.id
                   ?? document.activeElement?.id ?? null
  3.  state.view = 'expanded'
  4.  history.pushState({og:'expanded'}, '', urlFor(state))    // §4 — ONE history entry
  5.  move the instrument subtree into the dialog:
        #og-workspace <- [ toolbar, ribbon, #og-scroll, #og-drawer, #og-status ]
      by NODE MOVE (appendChild), never by re-serialising innerHTML.
  6.  dialog.showModal()
  7.  restore(camera)                           // §2.2 — viewport is now bigger; anchor unchanged
  8.  focus:  el = byId(rememberFocus) ?? #og-workspace   // see §7.4
      el.focus({ preventScroll: true })         // preventScroll is mandatory
  9.  announce()                                // polite live region, §7.6
```

**Step 5 is a DOM move, not a re-render.** This matters more than it looks:

- it preserves `tabindex`, `aria-expanded`, the roving-tabindex holder, the open/closed state of every
  `<details>` in the filter groups and the ledger, scroll positions of inner boxes, and — critically —
  **the identity of the focused element**, so the focus restore in step 8 usually finds the *same node*
  rather than an id-matched replacement;
- it means the graph is never "rebuilt on expand", so there is no skeleton flash and no layout jump
  (the skill's *"skeleton flash on refetch"* anti-pattern, transposed);
- it is only legal because of F1/F2. Say so in the code comment, because a future round that makes
  layout viewport-dependent must revisit this and nothing else will tell them.

**One caveat to design for:** moving a subtree into the top layer blows away CSS that depended on
ancestors (`.opg-page` scoping, the `--og-c*` accents, `--sticky-top`). Fix by putting the dialog
*inside* `main.wrap.opg-page` in the markup (a `<dialog>` is a normal flow element until `showModal()`
promotes it to the top layer, and the top layer keeps inherited styles from its DOM parent). Verify this
in the Chromium sweep; it is the one thing here that a browser could surprise us on.

### 3.2 Collapse — the exact sequence

```
onCollapse(source /* 'button' | 'esc' | 'popstate' | 'print' */):
  1.  camera = capture()
  2.  state.view = 'page'
  3.  if source !== 'popstate': history.back()   // let popstate do the rest; ONE path, not two
      else: continue
  4.  dialog.close()
  5.  move the subtree back into .og-stage-wrap
  6.  restore(camera)                             // viewport is smaller; dx/dy clamp
  7.  focus: the expand toggle, focus({preventScroll:true});
      then if it is outside the viewport, scrollIntoView({block:'center'}) EXPLICITLY.
      Never a bare focus() — on a 68 k page a bare focus() is a 60 000 px jump.
  8.  announce()
```

Step 3 routing collapse through `history.back()` means there is exactly one collapse code path and the
Back button and the ✕ button are literally the same action. This is what stops the classic bug where
Back leaves the dialog open with the URL saying `page`.

### 3.3 Native fullscreen (S2) — enhancement, never state

- The workspace toolbar shows a **Full screen** button *only if* `dialogEl.requestFullscreen` exists.
  iOS Safari has no `Element.requestFullscreen`, so the button is simply absent there — S1 already fills
  `100dvh`, so nothing is lost.
- **Fullscreen is never in the URL and never in `sessionStorage`.** It is a device state, it requires a
  user gesture, and a link that tried to request it would fail by spec. A deep link to `v=x` lands in S1.
- `fullscreenchange` handler: if we left fullscreen but `state.view === 'expanded'`, **stay in S1**.
  Do not collapse. The visible hint reads: *"Esc — leave full screen · Esc again — close the map."*
- `fullscreenerror` → toast the failure in words and stay in S1. Never a silent no-op.

### 3.4 Reduced motion

The default state **is** the final state, so the transition has no animated middle to remove — steps
3.1/3.2 are already instant. Under `prefers-reduced-motion: no-preference` **only** these are allowed,
and all three run through `motion.js`:

| What | How | Budget |
|---|---|---|
| the dialog's presence | `animatePresence(el,'in',SPRINGS.gentle,'y',12)` (`motion.js:318`) | opacity+12 px, ≤ 180 ms |
| the frame growing to the viewport | `flip(frame, mutate, SPRINGS.snappy)` (`motion.js:290`) — transform only, never width/height | ≤ 320 ms |
| camera restore after a *level* change | the existing zoom-settle spring (§11.2) | preset-bounded |

Nothing else. Under reduced motion `flip()` and `animatePresence()` return immediately after mutating
(`motion.js:292`, `:319`), so there is one code path. **`__motionStats().running === false` within 1.2 s
idle must hold in both states** — the browser sweep already asserts this site-wide, so the expanded state
must be added to the sweep's page list as a *second visit with `#v=x`*, not left untested (§13).

---

## 4 · The URL contract

### 4.1 Grammar

Extends the existing `k=v&k=v` hash (`app/opgraph.js:273-303`) — backward compatible, old links keep
working, unknown keys ignored.

| key | meaning | in history as | default |
|---|---|---|---|
| `c,t,g,l,w,harm,na` | the existing facets | `replaceState` | — |
| `v=x` | view = expanded | **`pushState`** | page |
| `r=bands` / `r=ledger` | representation inside the view | `replaceState` | `map` |
| `z=0.6\|1\|1.6` | zoom level | `replaceState` | `1` |
| `n=<id>` | the open record | `replaceState` | none |
| `a=<id>` | the camera anchor | `replaceState` | none → fit |
| `f=<id>` | the focus root (PLAN D12) | `replaceState` | none |
| `h=1\|2\|3` | hops | `replaceState` | 2 |

`dx/dy` are **not** in the URL — they are pixel residue, they are meaningless at another viewport size,
and they would make every shared link look like line noise. They live in `sessionStorage` under
`og:camera` so a same-session reload is pixel-exact, and a shared link is *record-exact*.

### 4.2 History policy — one entry, and only one

- **`pushState` exactly once: on expand.** Back collapses. That is the behaviour every user already
  has from every full-screen thing they have used, and it is the reason to have history at all here.
- **`replaceState` for everything else** — filters, zoom, selection, camera, representation. Matching
  the atlas (`app/confluence.js:659`, `:672`). A pan that pushes history is a back-button trap.
- Debounce the camera's `replaceState` to the scroll-settle callback. Never per frame.
- **Add the missing listeners (F6):**
  - `popstate` → reconcile `state.view` with the URL; if the URL says `page` and the dialog is open,
    run collapse steps 4-8 (skipping the `history.back()`).
  - `hashchange` → for links pasted into the address bar of an already-open page: re-decode, and if the
    view changed, transition. Guard against the self-inflicted loop with a `suppressHash` flag around
    our own `replaceState`.

### 4.3 Deep-link behaviour

`opgraph.html#v=x&f=gw:heptameron&h=2&z=1&n=gw:heptameron` must land as: expanded, 2-hop neighbourhood of
the Heptameron, level 1, that record open, camera centred on it.

Ordering matters — resolve in this order so nothing fights:

```
decode → filter+focus+hops → layout → camera(a ?? n ?? first work) → view → selection → focus()
```

Two rules the atlas already learned and this page must copy:

1. **A deep-linked record that the deep-linked filter hides must relax the filter, not fail.** The atlas
   relaxes *only the axes hiding it* and says so (`app/confluence.js:638`, `relaxFiltersFor`). Do the
   same; a blunt reset is worse than the bug.
2. **A cold-load fly-to is instant, not animated.** The atlas passes `{source:'coldload'}` and skips the
   spring (`app/confluence-nav.js:269`). Same here — arriving at a page that is already moving is
   disorienting and reads as jank.

### 4.4 The fragment-vs-filter collision (existing bug, must be fixed by this work)

`decodeFilter` parses the hash as key=value pairs, and the dossier/chain builders emit
`href="#ogn-<id>"` (`app/opgraph.js:693`, `:700`, `:727-728`, `:829`). A click on one of those (a) is
handled in the drawer but (b) is **not** handled in `#og-chain-host` (F9), so it writes a hash that is
not valid filter syntax and is then silently clobbered by the next `replaceState`. Fix as part of this
work: bind `#og-chain-host` with the same delegated `[data-goto]` handler the drawer has
(`app/opgraph.js:1296-1297`), and change the `href` to the canonical addressable form `#n=<id>` so the
no-JS fallback is a valid link into the same view rather than a raw element anchor.

---

## 5 · What happens to every piece of chrome, in every state

| Element | S0 page | S1 expanded (map) | S1 (bands) | S1 (ledger) | S3 ≤680 px / print |
|---|---|---|---|---|---|
| Site header, crumb, hero, standing note, legend accordion, limits, method note | in the flow | **inert behind the dialog** — present, not destroyed | same | same | in the flow |
| **The framing strip** (`describes, never prescribes · no demonstrated validity · no operative text`) | in the standing note | **pinned in the workspace footer, non-dismissible**, links back to the standing note | pinned | pinned | in the standing note |
| Toolbar (zoom seg, colour-by, fit, expand/exit, search, `?` help) | one row above the frame | one row at the top of the workspace, `position:sticky` inside the dialog | same, zoom replaced by band step | search + colour-by only | zoom hidden (already) |
| Filter groups (4 `<details>` + weight/harm/struck strip) | above the frame, in the flow | **a left rail inside the workspace**, collapsible to a chip row; the *same DOM nodes*, moved | same rail | same rail | in the flow, above the ledger |
| The counter (`Drawing 140 of 508 …`) | under the toolbar | in the workspace status bar, always visible | same | replaced by the row count | under the toolbar |
| The index (counts by kind/culture/grade/basis/label) | in the flow | **stays on the page, not in the workspace**; a "Counts" link in the workspace scrolls to it on collapse | same | same | in the flow |
| The drawer (`aside#og-drawer`) | 20 rem sticky column ≥1000 px; below that, in the flow | a right pane inside the workspace, resizable-by-nothing (fixed 24 rem), `role="complementary"` | same | same | a bottom sheet, `role="dialog" aria-modal` (the atlas pattern, `app/confluence.js:645-647`) |
| The rank ribbon (§11.5) | a slim strip above the frame | a strip above the viewport | **is** the navigation | hidden | hidden |
| **The mirror / ledger** | in the flow, complete, unchanged | **not duplicated** — `r=ledger` renders `mirrorHTML(model)` for the *current view* into the workspace, and a permanent link reads *"the complete ledger is on the page below"* | same | the pane itself | **is** the view |
| The chain `<ol>` | `#og-chain-host` in the flow | inside the drawer pane, below the dossier | same | same | in the flow |
| The `Skip the diagram — go to the ledger` link | present | becomes `Close the map — go to the ledger`, which collapses *and* scrolls | same | n/a | present |

Two rules in that table are non-negotiable and worth restating:

- **The workspace never contains a second copy of the ledger data.** One `model.kept`, one `mirrorHTML`.
  Otherwise the AT-parity equality that `og-page.mjs` asserts becomes an approximation, and the whole
  covenant degrades into a promise.
- **The framing strip is pinned.** In S1 the standing note is off-screen; a wing whose entire ethical
  posture is "describes, never instructs" cannot have a state where none of that is on screen.

---

## 6 · The expand control itself

```html
<button type="button" id="og-expand" class="btn-secondary"
        aria-pressed="false"
        aria-controls="og-workspace">
  <span aria-hidden="true">⛶</span> Expand the map
  <span class="og-vh"> — opens the diagram as a full-viewport workspace</span>
</button>
```

- **`aria-pressed`, not `aria-expanded`.** `aria-expanded` promises the controlled region is *adjacent
  disclosure*; this is a mode toggle. (The node faces already use `aria-expanded` correctly for the
  drawer at `app/opgraph.js:468`.)
- It lives in the toolbar (`pages/opgraph.html:128-135`), **left of the zoom seg**, because it is the
  control that makes the zoom seg worth using.
- A **second** entry point: the empty-ish first screen problem. The measured page shows nothing of the
  graph above the fold. The frame in S0 gets a persistent, always-visible corner affordance (`⛶`, 44 px,
  labelled) inside the frame's top-right, so the reader who has scrolled to the graph does not scroll
  back up to expand it.
- In S1, the exit control is `✕ Close the map` **plus** the keyboard hint text, both in the workspace
  toolbar, both always visible (never a hover-revealed control).
- At ≤680 px the S0 control reads **"Open the map full screen"** and is the *only* way to a diagram, which
  is honest: the in-flow diagram genuinely is not drawn there.

---

## 7 · The keyboard and focus path

### 7.1 Semantics

```html
<dialog id="og-workspace" class="og-workspace" aria-labelledby="og-ws-title">
  <h2 id="og-ws-title" class="og-vh">The Operative Corpus — map workspace</h2>
  …
  <p id="og-status" class="og-status" role="status" aria-live="polite" aria-atomic="true"></p>
</dialog>
```

A `<dialog>` gets `role="dialog"` and, under `showModal()`, `aria-modal`. That is the correct role: while
it is open it *is* the whole application view. The name is a workspace name, not an alert.

### 7.2 The key map (every key is also a visible button — keys are accelerators, never the only path)

| Key | Action | Note |
|---|---|---|
| `←` / `→` | previous / next **rank band**, keeping the nearest order position | **fixes F8** — the 2-D layout gets a 2-D keyboard |
| `↑` / `↓` | previous / next node **within the band** | |
| `Home` / `End` | first / last band | |
| `PgUp` / `PgDn` | ± one viewport of bands | |
| `Enter` / `Space` | open the record | existing (`app/opgraph.js:1256`) |
| `Esc` | the ladder, §7.3 | |
| `f` | focus this node's neighbourhood (`filter.focus = id`) | the D12 lever, F3 |
| `Shift+F` | clear the focus, back to the whole filtered view | |
| `c` | follow the transmission chain from here | `chainFrom`, exists |
| `+` / `-` | zoom level up/down | discrete, §11.2 |
| `0` | fit to view | camera-only, §11.3 |
| `x` | expand / collapse | |
| `/` | search | the atlas's binding, `app/confluence.js:1207-1210` |
| `?` | the keyboard help sheet | **mandatory** — a map this long needs a printed key list |
| `Ctrl`+wheel | continuous zoom bridge | plain wheel always scrolls, never zooms |

Arrow keys move *node focus*, never the pixels. Panning is a consequence of focus moving
(`scrollIntoView({block:'nearest'})`), which is the only model where a screen-reader user and a sighted
keyboard user are looking at the same thing.

### 7.3 The Esc ladder (precedence, top match wins)

```
1. a search listbox is open            → close the listbox, keep focus in the input
2. the ? help sheet is open            → close it, restore focus
3. the drawer is open                  → close drawer, RETURN FOCUS TO THE ORIGINATING NODE   ← fixes F7
4. a chain walk is active              → clear the chain highlight, keep the <ol>
5. native fullscreen is on             → the browser handles it; we only observe fullscreenchange
6. view === 'expanded'                 → collapse (§3.2)
7. otherwise                           → do not preventDefault; let the site chrome / cmdk have it
```

Implement rung 6 by listening for the dialog's **`cancel`** event and `preventDefault()`-ing it whenever
a higher rung matches; otherwise let it close and run the collapse tail. Do not add a second global
`keydown` — the page already has one at `app/opgraph.js:1327-1329` and it must be folded into this ladder,
not run alongside it.

### 7.4 Focus management — the three rules

1. **Focus is preserved by id across every transition and every repaint.** Before any innerHTML write or
   subtree move: `const keep = activeElement.dataset.id || activeElement.id`. After: refocus
   `[data-id="keep"]` (or `#keep`), `{preventScroll:true}`; if it is gone, fall back to the *nearest
   surviving node* by the same `nearestDrawn` walk as the camera (§2.3), so focus and camera never
   disagree. This is the single fix that ends F7, and it must be applied to `paint()` and `paintDetail()`
   alike, not only to expand/collapse.
2. **`focus({preventScroll:true})` everywhere, followed by an explicit `scrollIntoView` only when the
   target is genuinely off-screen.** A bare `focus()` on this page is a 68 000 px jump.
3. **No hand-rolled focus trap.** `showModal()` provides it. If a future round replaces the dialog with a
   plain overlay, the substitute is the `inert` attribute on the workspace's siblings — *not* a
   keydown-based tab loop, which is a bug farm and always misses shadow content and iframes.

### 7.5 The tab order inside the workspace

```
[dialog] → toolbar (expand/exit, zoom seg, colour-by, fit, search, ?)
        → filter rail (each <details> summary; the rail itself has a collapse toggle)
        → rank ribbon (one tab stop; ←/→ moves the lens, Enter flies)
        → the graph viewport (ONE tab stop; roving tabindex inside — existing model, :1192-1201)
        → the drawer pane (close, then its links)
        → the status bar (a live region; not focusable)
```

Seven tab stops to reach any node. That is the whole point of the roving tabindex and it is already
correct in the current code; it must survive the subtree move (it does, because the move preserves
`tabIndex` — §3.1).

### 7.6 The live region — this is where camera state becomes text

`#og-status` is `role="status" aria-live="polite"`, updated on: view change, level change, camera settle,
focus/hops change, filter change, representation change. Wording template:

> *Expanded. Map view, level 1 of 3. Centred on transmission rank 3 of 9 — 18 records in this band.
> Drawing 140 of the 508 records this filter selects. Colour by completeness.*

**This is the AT parity of the new visual facts I am introducing.** The covenant is not satisfied by the
ledger alone once the page acquires a camera: *where you are* is a visual fact, so it gets words. It is
`aria-live="polite"` and debounced to the settle callback so it does not chatter during a pan.

---

## 8 · Reduced motion, restated as a contract

- Default state = final state. In S0, S1 and S3 the resting render is a genuine `layoutOpgraph()` output;
  the world transform is `none` and the world element carries `.is-resting` (the atlas's observable
  contract, `app/confluence-nav.js:79`, `css/confluence.css:341-343`). **A `transform` on the world can
  only mean an in-flight gesture** — which is what makes the reduced-motion promise testable rather than
  asserted.
- Every animated path is behind `motionOK()` (`motion.js:68`) and resolves synchronously when it is false.
- **No `requestAnimationFrame` outside `motion.js`'s conductor.** The nav module uses `createSpring` /
  `startMomentum` only; the zoom-settle debounce uses `setTimeout`, which is not a frame source and has
  precedent (`app/confluence-nav.js:177-181`).
- The conductor warns past 8 concurrent tasks (`motion.js:101-103`). Budget: at most 3 concurrent here
  (fly-x, fly-y, rubber). Never a spring per node.
- Assertion: `window.__motionStats().running === false` within 1.2 s idle, in **both** S0 and S1.

---

## 9 · 390 px — the decision, and why it is the best version

**Decision: a full-viewport *pixel graph* on a phone is the worst version of this. A full-viewport
*band reader* is the best version, and it is what S1 opens at ≤ 680 px.**

### 9.1 Why not the pixel graph

| | |
|---|---|
| Touch targets | At level 0.6 a relation-claim node is **77 × 17 px** and a procedure-claim is 90 × 20 (F12) — under the 24 px minimum, let alone 44. Level 1.0 fixes the works (190×46) and still leaves relation-claims at 128×28. |
| Orientation | The engine's `TB` mode is real and honest (`core/opgraph.js:764`, `:908-928`), but in TB the *across* axis carries `MAX_BOX_W = 190`, so the row pitch is 204 px: **390 px shows 1.9 nodes across**. A band of four is 816 px wide. You would be panning sideways to read a column. |
| The form | A layered flow's value is seeing a band's contents *and its neighbours* at once. 390 px cannot. Rendering it anyway is precisely the "shrunken desktop" the brief forbids. |
| The across-axis trap | Panning a 2-D surface where the across axis is barycentre order invites reading a meaningless channel (§1.1). On a phone, where you only ever see a slice, that misreading is near-certain. |

### 9.2 What the band reader is

One **rank band per screen**, full viewport, stepped horizontally:

```
┌─────────────────────────────────────┐
│ ⛶ ✕   Transmission rank 3 of 9      │  ← toolbar; band position in words
│ ◀   ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮   ▶          │  ← the rank ribbon, as a step control
├─────────────────────────────────────┤
│ 18 records in this band              │
│ ┌─────────────────────────────────┐ │
│ │ Heptameron            w 0.82 ↓.15│ │  ← the SAME node face, one column,
│ │ ▤ formulary · Western · 13c      │ │     at level 1.0 (46 px tall = touchable)
│ │ ← 2 in   ·   3 out →             │ │  ← edges as counted, tappable links
│ └─────────────────────────────────┘ │
│ … (virtualised only if it must be)   │
├─────────────────────────────────────┤
│ describes · no demonstrated validity │  ← the pinned framing strip
└─────────────────────────────────────┘
```

- Bands come straight from `layout.bands`, which the engine already publishes with `rank`, `label`,
  `count`, `kind` and `ids` (`core/opgraph.js:1013-1033`). **Nothing new is computed.**
- Edges become in-card links: *"contains 3 procedure claims →"*, *"transmits to Sworn Book →"*. Every
  edge in the drawn set is reachable in ≤ 2 taps, which is more than the pixel graph offers at 390 px.
- Tapping a card opens the drawer as a bottom sheet — the atlas's existing mobile pattern
  (`app/confluence.js:645-647`, `:1163`).
- Swipe left/right, or the ◀▶ buttons, or `←/→`, step bands. Same key map as desktop (§7.2).

### 9.3 Why this is not a third representation

It is a projection of `layout.bands` × `model.drawn` — the same two objects the map paints. Parity holds
by construction, exactly as the ledger's does. And it is worth offering **on desktop too**, as the third
tab (`r=bands`), for low-vision readers and for anyone who wants the structure without the geometry.

### 9.4 What ≤ 680 px keeps from today

The existing D13 behaviour is unchanged: in **S0** at ≤680 px the diagram is not drawn and the ledger is
the view (`css/opgraph.css:272-278`), with the prose that says so (`pages/opgraph.html:141-143`). The band
reader is opt-in behind an explicit control. Nobody is routed through a map to reach the record.

---

## 10 · Print

- **The workspace never prints.** `@media print { dialog.og-workspace, dialog.og-workspace::backdrop { display:none !important } }`. The underlying page is still fully in the DOM (inert ≠ removed), so printing from S1 produces exactly the page's print output — today's ledger-only sheet (`css/opgraph.css:281-290`).
- **No state change on print.** Do *not* collapse on `beforeprint`: changing the user's view because they
  pressed Ctrl+P is the kind of surprise that makes people distrust an instrument. The CSS rule is
  sufficient and is observable in the stylesheet, which `og-page.mjs` already reads as text
  (`scripts/tests/og-page.mjs:9`, `:399`).
- Print keeps carrying the *ledger*, which is complete where the diagram is capped — the existing,
  correct inversion. Add one line to the print sheet: the current filter and focus, in words, so a
  printed ledger says which view it is. A printout with no statement of its own narrowing is a document
  that will be quoted wrongly.
- The band reader does not print either; it is a navigation shell over the same rows.

---

## 11 · Navigation inside the instrument

### 11.1 Pan

Copy the atlas exactly (`app/confluence-nav.js:90-148`), because it is already correct and already
asserted:

- **Mouse drag** on the viewport, 6 px slop before it counts as a drag (so a click is still a click),
  pointer capture, `is-dragging` cursor.
- **Touch is native scroll** — `if (e.pointerType === 'touch') return` (`:95`). Do not reimplement
  momentum the OS already does better.
- **Release → `startMomentum`** with the tracked velocity (`motion.js:245`, `trackVelocity` at `:211`).
- **Rubber-band past the bounds** via `rubberband()` (`motion.js:280`), motion-only; under reduced motion
  the position simply clamps (`:116` of the nav module).
- **Both axes.** The atlas only glides vertically because its world is a timeline; here the *rank* axis is
  the long one, so momentum must be applied to `scrollLeft` in LR and `scrollTop` in TB. This is the one
  genuine change to the nav module's behaviour and it is a two-line generalisation.

### 11.2 Zoom — three discrete levels with a continuous bridge: **yes, adopt it**

The atlas's model applies here *for a different but equally good reason*. In the atlas the levels change
what is rendered (semantic clustering). Here they change **what is written on a node face** — F4: the
box grows, and the painter adds the pressure cell at `bw ≥ 175` and the sub-row at `bh ≥ 40`. So:

| level | box (work) | what the face carries |
|---|---|---|
| 0.6 | 114 × 28 | title · weight |
| 1.0 | 190 × 46 | title · weight · **pressure** · marks · **sub-row** |
| 1.6 | 304 × 74 | all of the above, with room for the evidence cell (PLAN §5.6 mech. 4) |

That is genuine semantic zoom, so the levels are the truth and the in-between is a *view* of the truth.
Adopt the atlas's contract verbatim: **every resting frame is a genuine engine render; a `transform` on
the world can only mean an in-flight gesture**; `Ctrl`+wheel and pinch drive a continuous `s`; a quiet
timer rebases mid-gesture and springs to `nearestLevel(v)` at settle (`app/confluence-nav.js:150-253`).

Two adjustments:
- **`ZOOM_RANGE` should be tighter here** than the atlas's `{min:0.5,max:1.8}`. Below ~0.75 the sub-row
  disappears and node faces stop being readable records — which is a *content* change, not a magnification,
  so it should not be reachable by a continuous gesture that snaps back. Propose `{min:0.55, max:1.75}`
  and let `nearestLevel` do the rest.
- **Hit-target expansion at level 0.6** (F12): a transparent `::after { inset:-11px }` on `.og-node`,
  exactly the atlas's cluster-pill trick (`css/confluence.css` cluster rule). One line, fixes the
  24 px minimum for the small op-nodes at every level.

### 11.3 Fit to view

**Camera-only. It does not invent a fourth zoom level and it does not lie.**

```
fit():  level = 0.6; camera.anchorId = centre-most drawn node; dx = dy = 0
        then, in the status line, state the residue in words:
        "Fitted to width. 3 of 9 bands are off-screen — pan or open the ledger."
```

Scaling until 140 nodes fit would produce 3 px text, which is a picture of a graph rather than a graph.
The honest move is to fit what fits and say what does not, which is the same discipline as the render cap
counter (`app/opgraph.js:530-537`).

### 11.4 Focus a node — the biggest single win, and it is already built

`filter.focus` + `filter.hops` exist in the engine, are deterministic, are hop-ranked in the cap, and are
**never called** (F3). Wire them:

- `f` on a focused node, or **Focus this neighbourhood** in the dossier, sets `state.focus = id`.
- `engineFilter()` (`app/opgraph.js:312-320`) gains `if (f.focus) s.focus = f.focus, s.hops = f.hops`.
- The counter already renders `narrowedBy`, and the engine already pushes `"2-hop around <id>"` into it
  (`core/opgraph.js:720`) — so the disclosure is free and in words the moment the wiring exists.
- A **Focus** chip appears in the toolbar with the root's label and a ✕ (`Shift+F`).
- `hops` is a 1/2/3 segmented control beside it.
- **PLAN D12 says this should be the page's default**, opening on the Heptameron's 2-hop neighbourhood
  with the whole-graph view behind a control labelled *"a density map, not a readable diagram"*. I agree,
  and note it is a decision for the form architect, not me — but the *interaction* for it is specified
  here and costs nothing extra.

This is what turns 140-of-508 into 20-of-25, which is the difference between a diagram and a texture.

### 11.5 Minimap: **no. A rank ribbon instead.**

The atlas has a minimap and it is right to. Here it would be wrong, for a specific reason:

> **The atlas's minimap is a 2-D thumbnail because both of its axes carry meaning** (lane = tradition,
> y = year). **In this world only one axis carries meaning.** Position along the band axis is transmission
> rank; position across it is barycentre sweep output — an artefact of edge-crossing minimisation, with no
> referent. A 2-D thumbnail of that surface would draw an unreadable smear *and* invite reading the across
> axis as data.

So: a **rank ribbon** — one dimension, the meaningful one.

```
cultures │ authors │ r0 │ ● │ r1 │ ● │ r2 │ ● │ r3 │ … │ r9 │ types
         ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔[═══lens═══]▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

- One cell per band, straight from `layout.bands` — `rank`, `label`, `count`, `kind` all already computed
  (`core/opgraph.js:1013-1033`). Band height/opacity encodes `count` as a **single-hue sequential** ramp
  (no categorical palette, so no validator run applies; contrast against the surface still does).
- Gutter bands (`cultures`, `authors`, `procedure types`) are visually distinct because `bands[].kind`
  already distinguishes them — they are not ranks and must not look like ranks.
- A draggable **lens** = the viewport's current band range. Dragging pans. Clicking a band flies to it.
- **Keyboard**: one tab stop; `←/→` moves the lens by a band; `Enter` flies; `Home/End` to the ends.
- **AT**: each band is a real `<button>` whose accessible name is
  *"transmission rank 3 — 18 records — currently in view"*. The ribbon **is** the text version of the
  camera, which is why it satisfies the parity covenant rather than needing a separate mirror.
- It also solves the measured "nothing of the graph is visible at the top of the page" problem in S0: the
  ribbon is 28 px tall and gives the reader the whole shape before they scroll.

### 11.6 Search with fly-to

Needs one new **pure** engine function — the atlas has `searchEntries` and this engine has nothing:

```js
export function searchOpgraph(q, limit = 12)
// normalised (NFKD, lowercased, diacritic-stripped) substring match over, in priority order:
//   work.label, work.titleOriginal, procedure-type.term, procedure-claim.typeTerm,
//   culture.label, author.label, relation-claim.relation
// ties broken by (priority, -weight, cmpStr(id)) — total, deterministic, no fuzz, no clock
// returns [{ id, type, label, sub, band }]
```

No fuzzy matching. A fuzzy score is a hidden ranking model, and on a page whose entire posture is
"the number is computed by a published rubric" an unpublished relevance score would be off-key.

UI: the atlas's combobox verbatim (`app/confluence.js:1173-1215`) — `role="combobox"`,
`aria-expanded`, `aria-activedescendant`, `aria-controls`, arrow keys, Enter, Esc, `/` to focus. Picking a
result sets `camera.anchorId`, opens the record, and writes `a=<id>&n=<id>` to the URL.

Fly-to uses the nav module's `flyTo` with the atlas's **teleport cap** — never cruise more than three
viewports; jump to 1.5 viewports out and spring the rest (`app/confluence-nav.js:272-277`). A 20-second
glide across a 4 800 px world is not delightful, it is a hostage situation.

### 11.7 Follow a chain

`chainFrom` exists and returns ordered stops with `via` (`core/opgraph.js:1066-1090`). Add a **stepper**:

- `Next stop` / `Previous stop` buttons + `c` to start, `n`/`p` to step.
- Each step: fly the camera to the stop, open its record, highlight the path edges.
- **The `<ol>` stays and is the source of truth** (`app/opgraph.js:820-838`) — the stepper is a camera
  over the list, not a replacement for it.
- The stepper's position is announced: *"Step 2 of 5 — TRANSMITS_TO → Sworn Book of Honorius,
  procedure-level: goetic-invocation."*
- **Fix F9 while here**: bind `#og-chain-host`.

---

## 12 · Module plan

| # | File | What | Why |
|---|---|---|---|
| 1 | `assets/js/core/viewport.js` **(new, pure)** | `zoomAnchor`, `nearestLevel`, `ZOOM_LEVELS/RANGE/REBASE` moved here verbatim; `core/confluence.js` **re-exports them** so no shipped import changes | The atlas's zoom math is data-free and generic (F13). Moving it is the difference between reuse and a fork. The re-export keeps `ui3-atlas.mjs` green. |
| 2 | `assets/js/app/graph-nav.js` **(new)** | `app/confluence-nav.js` generalised: `viewport/world/canvas`, `render(L)`, `getLayout/getLevel/setLevel`, `nodeXY(id)`, hooks — **plus** momentum on both axes (§11.1) and the anchor-id camera (§2.2). `confluence-nav.js` becomes a thin adapter over it, or stays as-is if the risk is judged too high in one round. | One motion system, one nav system. Writing a second pan/zoom module is how a codebase acquires two. |
| 3 | `assets/js/core/opgraph.js` | **+** `nearestDrawn(id, drawnIds)` (§2.3); **+** `searchOpgraph(q, limit)` (§11.6); **+** `fitCamera(layout, vw, vh)` returning `{anchorId, level}`. All pure, all deterministic, all testable headlessly. | Geometry and selection belong in core. The app must not compute a camera. |
| 4 | `assets/js/app/opgraph.js` | the view/rep/camera/focus state; the expand & collapse sequences; the Esc ladder; the focus-preserving `paint()`; `popstate`/`hashchange`; the ribbon, the band reader, the search box, the chain stepper; `engineFilter()` gains `focus`/`hops` | |
| 5 | `assets/css/opgraph.css` | `.og-workspace` (dialog, `100dvh`, grid: toolbar / rail / viewport / drawer / status), `::backdrop`, `:fullscreen`, the ribbon, the band reader, the `::after` hit expander, the print rule | Page-scoped file; `style.css` untouched. |
| 6 | `pages/opgraph.html` | the `<dialog>` shell, the expand button, the ribbon host, the search box, the `?` sheet | |
| 7 | `sw.js` | `VERSION` bump only | F15 — opgraph assets are deliberately runtime-cached, not precached. |
| 8 | `scripts/tests/og-page.mjs`, `scripts/tests/og-engine.mjs`, `scripts/browser-verify.mjs` | §13 | |

**No new dependency.** Nothing here needs a library: the springs exist, the zoom math exists, the layout
exists, the search is a substring match over 508 records. The one vendored module in this repo
(d3-array's `ticks`, ~2 KB, ISC) sets the bar, and nothing in this spec clears it.

### 12.1 Sequencing (so each step ships green)

1. **Fixes first, no new surface**: focus preservation in `paint`/`paintDetail` (F7), the 2-D keyboard
   (F8), the chain-host binding (F9), the `::after` hit expander (F12). These are bugs; they should not
   wait for an architecture.
2. **The camera** (`nearestDrawn`, capture/restore, replacing the `parked` hack at `:1206-1214`). Visible
   improvement on its own: filter changes stop teleporting.
3. **The URL contract + `popstate`/`hashchange`** (§4), including `z`, `n`, `a`.
4. **The dialog and the expand/collapse sequences** (§3) — the deliverable.
5. **Focus subgraph wiring** (§11.4) — the biggest legibility win, smallest diff.
6. **The ribbon** (§11.5), then **`graph-nav`** (pan/zoom bridge, §11.1-2), then **search** (§11.6),
   then the **band reader** (§9), then the **chain stepper** (§11.7).

---

## 13 · How this gets verified (it is not done until these pass)

Extend the existing gate rather than inventing one — `verify-site` runs audit + engine-test + Chromium sweep.

**`og-engine.mjs`** (pure):
- `nearestDrawn` is total, deterministic across two calls, and returns `null` only for an empty set.
- `searchOpgraph('hept')` is stable across two calls and its order is a total order.
- `fitCamera` is a pure function of `(layout, vw, vh)`.
- `layoutOpgraph({focus:'…',hops:2})` yields a subgraph strictly contained in `hops:3`'s.

**`og-page.mjs`** (pure builders, no DOM — the existing pattern):
- `urlFor(decode(urlFor(s))) === urlFor(s)` for a grid of states (round-trip).
- `v=x` sets `view==='expanded'`; an unknown key is ignored; an old-format link still decodes.
- the workspace's ledger pane and the page ledger are built from **one** `model.kept` (assert identity,
  not similarity — this is the parity covenant, and it is already asserted at `:695`).
- the stylesheet text contains the print rule hiding `dialog.og-workspace`, the `100dvh` rule, and the
  `prefers-reduced-motion` gate around every workspace transition (the file is already read as text at `:9`).

**`browser-verify.mjs`** (real Chromium):
- visit `pages/opgraph.html` **and** `pages/opgraph.html#v=x&f=…&z=1` — 0 console errors on both.
- after expand: `document.activeElement` is inside `#og-workspace` and is **not** `<body>`.
- after collapse: `document.activeElement === #og-expand`, and `window.scrollY` is unchanged from before
  the expand (± 2 px). **This is the test that proves the position is not lost.**
- `__motionStats().running === false` within 1.2 s of settle, in both states.
- `#og-status` textContent is non-empty and changes on a level change (the live region is real).
- at a 390 × 780 emulated viewport: `document.documentElement.scrollWidth <= 390` in every state
  (the 390-honesty rule), and the band reader renders.
- Esc twice from fullscreen-off: first Esc closes an open drawer, second collapses.

---

## 14 · Checked against the dataviz anti-patterns

| Anti-pattern | Status |
|---|---|
| Tooltip as the only way to read a value | **Clear** — values are on the node face by construction (`app/opgraph.js:397-477`); the camera's own state is in the live region and the ribbon's button names. |
| Pinpoint hover targets | **Was violated** at level 0.6 (77×17, F12); fixed by the `::after` hit expander (§11.2). |
| Per-chart filters / filters inside a chart card | **Clear** — one filter set, moved not duplicated (§5); it scopes the map, the bands and the ledger identically. |
| Skeleton flash on refetch | **Clear** — expand is a DOM move, not a re-render (§3.1). |
| No table view | **Clear** — the ledger is the record and is complete where the map is capped; the workspace does not fork it. |
| Colour-only encoding | **Clear** — every accent has its name in text; and §1.4 demotes accent from the default in the state where most of it is co-visible. |
| Eyeballing colourblind-safety | **Clear** — validator run, output in §1.4, `--pairs all` failure reported rather than reasoned around. |
| A value-ramp on nominal categories / meaning in a channel that has none | **The live risk here** — the across-band axis carries no meaning. Mitigation: no minimap (§11.5), the ribbon is 1-D, and the band reader names the band rather than drawing a position. |
| Recolour-on-filter | **Clear** — the accent index is `sorted(cultureIds).indexOf(id) % 8`, global and filter-independent (`app/opgraph.js:171-173`). Worth keeping that comment there; it is the thing a later round would break. |

---

## 15 · Open questions for the other architects

1. **Does the page default to the focus subgraph (PLAN D12)?** I have specified the interaction either
   way; the default is a form decision. My recommendation: yes, and label the whole-graph view exactly as
   the plan words it.
2. **The mirror's wall** (11 k px + 32 k px of tables) is not mine, but the expansion model has one
   requirement of whatever solves it: **the disclosure state must be part of the view state**, so that
   expanding, collapsing or deep-linking does not re-collapse a table the reader opened.
3. **The render cap in the expanded state.** I recommend it stays 140 — expansion buys legibility per
   node, not more nodes, and a cap that moves with the viewport makes the counter's promise unstable.
4. **Colour-by default in the expanded state** (§1.4) — I propose `completeness`; the palette owner
   decides, with the validator output in hand.
