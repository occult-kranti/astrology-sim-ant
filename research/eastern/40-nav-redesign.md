# 40 — THE TOP BAR, REDESIGNED FOR 70+ DESTINATIONS

**Written:** 2026-07-30 · **Repo tip:** `89e2622` (R32), tree clean apart from the two untracked
opgraph specs · **Status:** design proposal. Nothing here is shipped.

**What was read, in full, before any regrouping was proposed:**
`assets/js/app/shared.js` (all 557 lines — `NAV_GROUPS`, `currentSection`, `mountChrome`, the footer) ·
`assets/css/style.css` lines 43–120 + 1062–1066 (the whole nav block) ·
`assets/js/app/next-up.js` (`SECTION_KEYS`, `NEXT_UP`, `GROUP_DEFAULTS`, `FALLBACK_GROUP`, `allHrefs`) ·
`assets/js/app/palette.js` (`buildIndex`) · `scripts/tests/ui3-motion-controls.mjs` §2d–2e ·
`scripts/browser-verify.mjs` · the R33 menu-drive harness (`…/scratchpad/r33build/menu-drive.mjs`) ·
the opgraph nav probe (`…/scratchpad/ogbuild/og-nav-check.mjs`) ·
`docs/plans/opgraph/PLAN.md` §5, §7.1–7.3 and `RANKING-SPEC.md` §5 ·
the `<h1>` + `<meta description>` of **all 113 HTML pages**, the `<h2>/<h3>` outlines of
`pages/contents.html` and `pages/tools.html`, the outbound links of the Vedic / Confluence /
Practices hubs, and **all 112 breadcrumb trails** (machine-extracted, tallied below).

**Everything numeric below was measured in real Chromium** (puppeteer 150, the project's own gate
browser) against the canonical tree served on `:8461`. The probes are next to this file:
`_measure.mjs`, `_wrap.mjs`, `_trunc.mjs`, `_sixgroup.mjs`, `_wide3.mjs`, `_crumbs.mjs`, `_orphan.mjs`.

---

## 0 · THE MEASUREMENTS THIS DESIGN IS BUILT ON

Nothing in this document is asserted from taste where a number was available.

| fact | measured value | why it constrains the design |
|---|---|---|
| Header content column | `--maxw` → `.wrap` caps at **1080 px**, less `2 × 1.2rem` padding = **1041.6 px usable** | the bar can never get wider by making the window wider |
| Brand block | **536 px** (fixed — logo + title + the uppercase strapline) | 51 % of the usable width is spent before the menu starts |
| Current 5-group bar | **368 px** (`Start 57 · Cast 56 · Traditions 87 · Oracles 74 · Reference 88` + 4 × 1.6 px gaps) | |
| Current total row usage | **≈ 969.6 px** of 1041.6 | **72 px of headroom, full stop** |
| Minimum viewport with no header wrap, today | **1008 px** (measured by binary search) | below it the header is two rows / 117 px tall |
| Same, with a 6th `Atlas` button | **1069 px** | the two-row band widens from 1008–880 to 1069–880 |
| Same, with a 6th `Compare` button (84 px) | **never fits** — needs 1055 px of a 1041.6 px column | **the 6th label must be ≤ ~70 px wide** |
| Same, with a 6th `Cross-corpus` button (107 px) | never fits | |
| Same, with 7 groups | never fits | **7 top-level groups is not available at this brand width** |
| Wide (2-col) panel | 452 px, **cell = 217 px**, row ≈ 36 px | ≈ **32 characters** before the label ellipsises |
| Narrow panel | min 232 / max 300 px, cell ≤ 288 px | ≈ **43 characters** |
| Panel vertical cap | `max-height: 78vh` → 599 px at 1366×768 | Traditions today: 24 items → 434 px (fits) |
| **Labels visually ellipsised today** | **3 of 60** | `Thelemic times — era legis & Liber Resh` (needs 251 px), `Buddhist scriptures — word by word` (230), `Practices — the museum of methods` (232) |
| Mobile drawer @390×844 | cap 658 px; collapsed 207 px; **Traditions open → 1004 px panel / 1212 px drawer** | ~2 screens of scroll for the biggest group |
| Pages named in the menu | **60 of 113** | the other **53 are wing sub-pages whose only entry point is their hub** |
| Breadcrumb trails on disk | **112** | second segment: **Traditions 70 · Cast 19 · Reference 12 · Start 6 · Oracles 4 · "Tools" 1** |

> **The single hardest constraint, stated once:** the header row has **72 px of slack and no way to
> earn more**. That is enough for exactly one more group button, and only if its label is short. Every
> proposal below is written against that number.

---

# §1 · AUDIT OF THE FIVE GROUPS AS THEY STAND

## 1.1 What each group is actually for (as opposed to what it is named)

**`Start` (7) — the on-ramp.** Home, Basics, Learn, How to read results, How it's calculated, Chapter
map, Master Index. Coherent: it is "you have not used this site before." It is the only group whose
membership I would not change by a single item.

**`Cast` (16, wide) — "give the engine a moment and a place."** Already the best-organised group on
the site: three CSS kickers (*This moment* / *A person* / *By hand & meta*) turn a flat 16 into three
readable runs. Six of its items physically live inside `pages/book1/`, `book2/`, `book3/` and
`picatrix/` — i.e. inside tradition folders — and `currentSection()` carries **six explicit
special-cases** (`shared.js:113–119`) so those tools light up **Cast**, not their folder's wing.

> That block of six special-cases is the most important thing in the file, and its own comment says
> why it exists: *"the few tool pages that live inside a book/picatrix folder but belong (by name) to
> the Cast group — those resolve to their Cast item so the Cast group lights up when you are actually
> using that tool."* **The site has already ruled that function beats folder.** It just never applied
> the ruling east of Baghdad. That is the whole audit in one sentence.

**`Traditions` (24, wide) — the dumping ground.** Not a category; a residue. Membership rule, in
practice: *not a Lilly-side calculator, not an oracle, not orientation, not meta*. It currently holds
**five different kinds of object**:

| kind | members | count |
|---|---|---|
| (a) study wings over a primary corpus | Book I, Book II, Book III, Picatrix, Vedic, Yoga Sūtras, Buddhist, Abhicāra, Chronology, Jung, Great Works, Practices | 12 |
| (b) **calculators that take a moment + place** | Praśna, Muhūrta, Tājika, Tithi-praveśa, Kūṭa, Vedic yogas, Thelemic times | **7** |
| (c) **cross-corpus instruments** | The Great Confluence atlas | 1 |
| (d) browsers / datasets / courses | Bhāva delineations, Vedic course, Rasaśāstra, Kabbalah | 4 |

Two independent tells that this is arrival-order, not meaning-order:

1. **The panel is ordered by round.** Books → Picatrix → the Vedic cluster → the Indian extras → the
   esoteric wings → then, appended in shipping order, `confluence · yoga · buddhist · practices ·
   greatworks`. The next round appends again. That is what a dumping ground looks like from the inside.
2. **It has no kickers.** Cast, at 16 items, earned three. Traditions, at 24, has none — because there
   is no honest sub-heading you could write over `Tājika varṣaphala` and `Buddhist scriptures — word
   by word` at the same time.

**`Oracles` (4) — divination by lot.** Geomancy, Tarot, I Ching, Runes. Perfectly coherent and the
smallest group. Its existence is the proof that a 4-item top-level group is acceptable on this site —
which is the precedent the new group needs.

**`Reference` (9) — three unlike things wearing one label.** A dictionary (`glossary`), catalogues
(`library`, `read`, `tools`), honesty apparatus (`about`, `experiment`, `structure`, `roadmap`), and
one survey instrument that is not a reference at all (`compare`).

## 1.2 Items that are misfiled **today** — with the in-repo evidence, not an opinion

| # | item | filed under | belongs in | the evidence |
|---|---|---|---|---|
| M1 | `pages/prasna.html` | Traditions | **Cast** | takes a moment + place, runs the sidereal engine, prints a judgement — structurally identical to `book2/horary.html`, which is in Cast. And **the Vedic hub does not link to it**: `pages/vedic/index.html` links out only to `course.html`, `delineation.html`, `yogas.html`. No wing owns praśna. |
| M2 | `pages/muhurta.html` | Traditions | **Cast** | it is *the Indian election tool*; `picatrix/election.html` is in Cast. Same verb, opposite groups. |
| M3 | `pages/tajika.html` | Traditions | **Cast** | a sidereal solar return computed from a birth moment — the Indian twin of `timelords.html`. |
| M4 | `pages/tithi-pravesha.html` | Traditions | **Cast** | an annual return; same argument. |
| M5 | `pages/kuta.html` | Traditions | **Cast** | two birth moments → a compatibility score. `synastry.html` is the Western twin and is in Cast. |
| M6 | `pages/vedic/yogas.html` | Traditions | **Cast** | *"from a birth moment it evaluates 36 cited yoga rules … predicate by predicate"*. It is a detector. |
| M7 | `pages/thelemic-times.html` | Traditions | **Cast** | its own description: *"two zero-data museum **tools** on the site's astronomy engine"* — a date-stamp and a four-times-a-day solar clock. It is `planetary-hours.html` in a different robe. Also: **`pages/tools.html` files it under `#divination`, with the oracles** — the site's own tool index already disagrees with the menu. |
| M8 | `pages/confluence.html` | Traditions | **cross-corpus** | it is a map *of* nine traditions. Filing it as one of them is a category error the page itself refuses: *"the atlas plots INFLUENCE, never validity."* |
| M9 | `pages/compare.html` | Reference | **cross-corpus** | a dated, cited survey of ~30 products with staleness badges and `?` glyphs. `RANKING-SPEC.md` §Inputs names it as **the pattern the new ranked view reuses** — the two are siblings and are two groups apart. |
| M10 | `pages/tools.html` | Reference | **Cast** | **19 breadcrumbs already point their second segment at `tools.html` and label it "Cast."** The menu says Reference. The crumbs have been right and the menu wrong since R29. |
| M11 | `pages/kabbalah.html` | Traditions | (stays) | flagged because `tools.html` files it under `#divination` with the oracles. Traditions is still the better home — it is a doctrinal diagram, not cast by lot — but the disagreement should be resolved in one direction on purpose, not left as drift. |

**Two structural inconsistencies that are not item-level and will outlive any regrouping:**

- **I1 — `contents.html` is the Traditions hub in the crumbs and a Start item in the menu.** 70 of 112
  crumbs run `Home › Traditions › …` and link that segment to `../contents.html`, a page the mega-menu
  files under **Start** and calls "Master Index". Additionally `contents.html` **has no `id` attributes
  at all**, so those 70 crumbs cannot even deep-link to the Traditions slice of it. (The Oracles crumbs
  manage `tools.html#divination`, which does exist — so the pattern is known, just unapplied.)
- **I2 — `book1/master.html` and `book3/master.html` crumb to "Cast" and highlight "Traditions".**
  Their crumbs read `Home › Cast › Master Tool`; `currentSection()` catches them with the folder rules
  `/pages/book1/` → `book1` and `/pages/book3/` → `book3`, so the **Traditions** button lights up. They
  are not menu destinations, so `menu-drive` never sees it — a silent, live mismatch.

## 1.3 The legibility bug nobody is testing for

Three of the 60 labels are **visually truncated with an ellipsis right now**, because `.nav-menu a`
sets `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` and a wide-panel cell is a fixed
217 px. A user reads *"Practices — the museum of me…"*.

The menu-drive harness reads `a.textContent`, which is the **full** string — so the assertion "every
destination is exposed **by name**" **passes while the name is not legible**. That is a false green,
and it will get worse as labels get longer with each wing. §4.4 adds the assertion that closes it.

---

# §2 · THE PROPOSED GROUPING

## 2.1 The cut: intent or tradition? — the argument, not the assertion

**The honest starting point is that the current bar is already a hybrid**, and the hybrid is exactly
where it fails. `Start` / `Cast` / `Reference` are **verbs** (orient, compute, look up). `Traditions`
and `Oracles` are **corpora**. Everything that is a corpus falls into one bucket regardless of what
you do with it, so the corpus bucket grows without bound while the verb buckets stay tidy. 24 vs 4.

**The case for a pure intent cut (cast / study / explore / reference):** it never runs out of room,
because "study" absorbs any number of wings; it matches how the site is *entered* (the palette, the
next-up band, and `HOME_TRIO` all offer verbs); and it is the cut the code already enforces for the
Western tools via those six `currentSection` special-cases.

**The case against, and it is real:** **53 of 113 pages have no menu entry at all.** Picatrix has 6
sub-pages, Great Works 10, Yoga Sūtras 6, Jung 5, Chronology 5, Buddhist 5, Book II 4 — every one of
them reachable *only through its wing hub*. The wing is not a label on a shelf; it is a **container
with a door**, and the top bar is where the door is. A reader who wants "the Buddhist scriptures" is
not choosing a verb — they are choosing a shelf, and if the shelf is not in the bar, 5 pages become
unreachable in one click. A pure-intent bar that dissolves the wings into "Study" keeps the doors but
loses the fact that the door leads somewhere with rooms.

**The resolution — and it is the one the repo already chose:**

> **Cut by INTENT at the top level. Express the corpus axis as the wing hubs *inside* one group,
> sub-divided by kickers.** A page is a Cast item if it **takes a moment (and usually a place) and
> runs the engine**; it is a Traditions item if it is **a shelf you read**, wing hub or wing page.
> This is not new policy — it is `shared.js:113–119` applied consistently instead of only to the
> Western wings.

The test is one question — *does it need a moment?* — and it is decidable for every page on the site.
It also explains, without special pleading, why `book1/dignities.html` is in Cast and
`book1/reference.html` is not; why `picatrix/election.html` is in Cast and `picatrix/faces.html` is
not; and therefore why `prasna.html` must be in Cast and `vedic/index.html` must not.

**The one place the intent cut does not reach — and why it earns its own group.** Four destinations
answer to neither verb. The Confluence, the operative graph, the ranked view and the compare survey
do not compute a chart and are not a shelf: their **unit of analysis is the relation between corpora**,
and all four are **dated, graded survey instruments with an explicit epistemic apparatus** — the atlas's
4-value epistemic edge labels, the graph's three completeness axes with mandatory `completenessBasis`,
the ranking's five axes with mandatory `biasNote` and its refusal of an efficacy column, compare's `?`
glyph and staleness badge. Nothing in Traditions has that apparatus; nothing in Reference is an
instrument. Filing the atlas under *Traditions* asserts that it **is** a tradition. Filing compare
under *Reference* asserts that it is a lookup. Both are false, and the current bar has no way to say
so. **That is the grouping the redesign buys.**

Precedent for the label: `pages/contents.html` already titles its Confluence section **"Atlas · The
Great Confluence"**. The word is in the site's vocabulary; it measures **59 px**; it fits the 72 px
budget with 11 px to spare. (Runners-up measured: `Maps` 63 · `Canon` 68 · `Survey` 69 · `Library` 70.
Rejected on width: `Corpus` 72 · `Explore` 73 · `Compare` 84 · `Instruments` 99 · `Cross-corpus` 107.)

## 2.2 Rejected moves, and why (so they are not re-proposed next round)

- **`pages/vedic/course.html` → Start, next to `learn.html`.** Tempting: both are curricula, and today
  nothing shows they are the same kind of object. **Rejected** — the Vedic hub links to it, so a wing
  owns it; and a first-time Western reader opening *Start* would meet a Sanskrit syllabus. It stays in
  Traditions under the Jyotiṣa kicker, one row below its hub, where the wing's own geography puts it.
- **`pages/moments.html` → Atlas.** It is literally *"every rulebook, one timeline"* — cross-corpus by
  content. **Rejected** — it takes a moment and a range and runs five engines. It is the purest
  possible Cast item and the rule must not bend for a good title. It stays in Cast, under *This moment*.
- **`pages/structure.html` / `pages/experiment.html` → Atlas.** **Rejected** — `tools.html` already
  groups them as *"Honest-science explorers"*, and they are claims about **this site's own output**,
  not surveys of the corpus. They stay in Reference, which is where the honesty apparatus lives.
- **Renaming `Traditions` → `Study` or `Wings`.** Would free 24 px and make the bar fully verb-shaped.
  **Rejected** — it costs a rewrite of **70 breadcrumb trails** to buy width we do not need (the Atlas
  button fits without it), and it discards the strongest muscle-memory anchor on the site.
- **A 7th group (splitting Reference, or giving Cast's Indian tools their own group).** **Rejected on
  measurement:** 7 buttons do not fit in 1041.6 px at any viewport width (§0).
- **Cross-listing an item in two groups.** Technically survivable — duplicate `[href, label, key]`
  tuples both get `aria-current`, `querySelector` returns the first, and the labels match — but only
  the first group gets `.has-current`, so the second group silently never highlights. **Do not.**

## 2.3 THE FULL TABLE — every destination assigned, nothing orphaned

63 destinations (60 today + `opgraph` + the ranked view + the queued Indian-grimoires hub).
**`key` is unchanged for every existing item** — see §5.1 for why that is the point.

### Group 1 · `Start` — 7 items (narrow) — **unchanged, byte for byte**

| # | href | label | key | today | note |
|---|---|---|---|---|---|
| 1 | `index.html` | Home | `home` | Start | |
| 2 | `pages/basics.html` | The Basics — every concept | `basics` | Start | |
| 3 | `pages/learn.html` | Learn — astrology & the math | `learn` | Start | |
| 4 | `pages/interpret.html` | How to read results | `interpret` | Start | |
| 5 | `pages/how-it-works.html` | How it's calculated | `howitworks` | Start | |
| 6 | `pages/workflow.html` | Chapter map & workflows | `workflow` | Start | |
| 7 | `pages/contents.html` | Master Index | `contents` | Start | see I1 — gains section `id`s (§5.4) |

### Group 2 · `Cast` — 24 items (wide, 4 kickers) — *"give it a moment, it runs the engine"*

| # | href | label | key | today | note |
|---|---|---|---|---|---|
| | | ***kicker: This moment*** | | | |
| 8 | `pages/workbench.html` | The Workbench — Master Tool | `workbench` | Cast | |
| 9 | `pages/now.html` | Right Now — live sky | `now` | Cast | |
| 10 | `pages/book2/horary.html` | Horary — a question | `horary` | Cast | |
| 11 | `pages/picatrix/election.html` | Election — choose a moment | `election` | Cast | |
| 12 | `pages/prasna.html` | Praśna — Indian horary | `prasna` | **Traditions** | **M1** — sits beside its Western twin |
| 13 | `pages/muhurta.html` | Muhūrta — Indian election | `muhurta` | **Traditions** | **M2** |
| 14 | `pages/moments.html` | Moment Scanner — all rulebooks | `moments` | Cast | relabelled (was 14 chars, now says what it does) |
| 15 | `pages/cycles.html` | Cycles of History | `cycles` | Cast | |
| | | ***kicker: A person*** | | | |
| 16 | `pages/book3/nativity.html` | Nativity — a birth chart | `nativity` | Cast | |
| 17 | `pages/trajectory.html` | Life Trajectory | `trajectory` | Cast | |
| 18 | `pages/transits.html` | Transits to a natal | `transits` | Cast | |
| 19 | `pages/synastry.html` | Synastry — chart to chart | `synastry` | Cast | |
| 20 | `pages/timelords.html` | Time-lords & progressions | `timelords` | Cast | |
| 21 | `pages/tajika.html` | Tājika varṣaphala — the year | `tajika` | **Traditions** | **M3** |
| 22 | `pages/tithi-pravesha.html` | Tithi-praveśa — the tithi year | `tithipravesha` | **Traditions** | **M4** |
| 23 | `pages/vedic/yogas.html` | Vedic yogas — the detector | `vedicyogas` | **Traditions** | **M6** |
| 24 | `pages/kuta.html` | Kūṭa matching — compatibility | `kuta` | **Traditions** | **M5** |
| | | ***kicker: Hours, tables & talismans*** | | | |
| 25 | `pages/book1/dignities.html` | Essential Dignities | `dignities` | Cast | |
| 26 | `pages/book1/planetary-hours.html` | Planetary Hours | `phours` | Cast | |
| 27 | `pages/thelemic-times.html` | Thelemic times — Resh & Era | `thelemictimes` | **Traditions** | **M7** — also fixes a 251 px clipped label |
| 28 | `pages/picatrix/talisman.html` | Talisman Workshop | `talisman` | Cast | |
| | | ***kicker: By hand & meta*** | | | |
| 29 | `pages/handcalc.html` | Cast a chart by hand | `handcalc` | Cast | |
| 30 | `pages/autopilot.html` | Grand Orchestrator (AI) | `autopilot` | Cast | |
| 31 | `pages/tools.html` | All the calculators, compared | `tools` | **Reference** | **M10** — silently corrects 19 crumbs |

### Group 3 · `Traditions` — 17 items (wide, 4 kickers) — *"a shelf you read"*

| # | href | label | key | today | note |
|---|---|---|---|---|---|
| | | ***kicker: Lilly — Christian Astrology*** | | | |
| 32 | `pages/book1/index.html` | Book I — Introduction | `book1` | Traditions | |
| 33 | `pages/book2/index.html` | Book II — Horary | `book2` | Traditions | |
| 34 | `pages/book3/index.html` | Book III — Nativities | `book3` | Traditions | |
| | | ***kicker: The Hermetic west*** | | | |
| 35 | `pages/picatrix/index.html` | Picatrix — astral magic | `picatrix` | Traditions | |
| 36 | `pages/kabbalah.html` | Kabbalah — Tree of Life | `kabbalah` | Traditions | see M11 |
| 37 | `pages/chronology/index.html` | The Hermetic Chronology | `chronology` | Traditions | |
| 38 | `pages/greatworks/index.html` | Great Works — the authors | `greatworks` | Traditions | the Eastern-masters shelf lives inside it |
| 39 | `pages/jung/index.html` | Jung & astrology | `jung` | Traditions | |
| | | ***kicker: India — Jyotiṣa & the tantras*** | | | |
| 40 | `pages/vedic/index.html` | Vedic — Jyotiṣa (sidereal) | `vedic` | Traditions | |
| 41 | `pages/vedic/course.html` | Vedic course — the theory | `vediccourse` | Traditions | kept here on purpose (§2.2) |
| 42 | `pages/vedic/delineation.html` | Bhāva delineations | `vedicdelineation` | Traditions | |
| 43 | `pages/rasa.html` | Rasaśāstra & yantras | `rasa` | Traditions | |
| 44 | `pages/abhichara/index.html` | Abhicāra — ritual magic | `abhichara` | Traditions | |
| 45 | `pages/grimoires/index.html` | Indian grimoires | `grimoires` | **new (queued)** | needs a `currentSection` route — §4.3 |
| | | ***kicker: The contemplative texts*** | | | |
| 46 | `pages/yoga/index.html` | The Yoga Sūtras | `yoga` | Traditions | |
| 47 | `pages/buddhist/index.html` | Buddhist scriptures | `buddhist` | Traditions | shortened — fixes a 230 px clipped label |
| 48 | `pages/practices/index.html` | Practices — methods museum | `practices` | Traditions | shortened — fixes a 232 px clipped label |

### Group 4 · `Oracles` — 4 items (narrow) — **unchanged**

| # | href | label | key | today |
|---|---|---|---|---|
| 49 | `pages/geomancy.html` | Geomancy — the Shield | `geomancy` | Oracles |
| 50 | `pages/tarot.html` | Tarot — the spread | `tarot` | Oracles |
| 51 | `pages/iching.html` | I Ching — the Changes | `iching` | Oracles |
| 52 | `pages/runes.html` | Runes — Elder Futhark | `runes` | Oracles |

### Group 5 · `Atlas` — 4 items (narrow) — **NEW** — *"instruments that look across every corpus at once"*

| # | href | label | key | today | note |
|---|---|---|---|---|---|
| 53 | `pages/confluence.html` | The Great Confluence — the map | `confluence` | **Traditions** | **M8** |
| 54 | `pages/opgraph.html` | The Operative Corpus — graph | `opgraph` | **new (R33)** | PLAN §7.2 currently says *"one NAV_GROUPS item under **Traditions**"* — **change that line to Atlas** |
| 55 | `pages/opgraph.html#view=ranked` | The five columns — ranked | `opgraphrank` | **new (R34)** | needs a hash-aware route — §4.3, and it is the one genuinely tricky bit |
| 56 | `pages/compare.html` | How this site compares | `compare` | **Reference** | **M9** — reunited with the view that reuses its pattern |

### Group 6 · `Reference` — 7 items (narrow)

| # | href | label | key | today | note |
|---|---|---|---|---|---|
| 57 | `pages/glossary.html` | Glossary & Dictionary | `glossary` | Reference | |
| 58 | `pages/library/index.html` | The Library | `library` | Reference | |
| 59 | `pages/about/index.html` | Sources & Science | `about` | Reference | |
| 60 | `pages/read.html` | Read the originals | `read` | Reference | |
| 61 | `pages/structure.html` | Structure & patterns | `structure` | Reference | |
| 62 | `pages/experiment.html` | Test it yourself | `experiment` | Reference | |
| 63 | `pages/roadmap.html` | The Roadmap — planned | `roadmap` | Reference | |

**Nothing is orphaned.** 63 named destinations; the other 50 HTML files are wing sub-pages whose
hub is in the table above (verified page-by-page with `_orphan.mjs`). Two known exceptions, both
pre-existing and both worth a line in the round notes: `docs/LOCAL-LLM.html` (has a crumb, is in no
group, resolves to `''` → nothing highlights) and `pages/master.html` (a "moved" notice that resolves
to `workbench`).

## 2.4 Where the next ~10 destinations go — the growth policy

| queued thing | group | at what cost |
|---|---|---|
| Eastern authors (Varāhamihira, Vivekananda, Yogananda) | **none** — sub-pages of `greatworks/east.html` | 0 |
| Indian grimoires wing | Traditions, *India* kicker | 1 row → 18 items → 418 px panel |
| `pages/quoted/` survey wing (SURVEY-SPEC) | **Atlas** — 6 corpora, one PD/quote gate; it is an instrument, not a shelf | 5 items, panel 190 px |
| new oracles (roadmap §3) | Oracles, up to ~8 | narrow panel, 8 × 36 = 302 px |
| Western-depth tools (roadmap §1) | Cast | **this is the pressure point** — see below |

**The trigger to write down now:** when `Cast` exceeds **26 links**, switch it from `wide` (2-col) to
`wide3` (3-col). Measured: **28 links + 4 kickers in 3 columns = 672 × 399 px, cell still 217 px, no
label clipped, panel fully on-screen down to a 1024 px viewport.** The CSS is six lines (§4.2) and it
buys Cast room to ~40 items. Traditions gets the same treatment past ~26.

---

# §3 · IS A SIXTH TOP-LEVEL GROUP WARRANTED?

## **Yes — exactly one, and its label must be ≤ 70 px.**

### 3.1 The case for

1. **It is the only grouping that says something the current bar cannot.** Traditions can grow
   kickers; Reference can be pruned; but there is no place in a five-group bar where "an instrument
   that surveys every corpus at once" can live without lying about itself. Both the opgraph PLAN and
   the RANKING-SPEC are built on refusals (*no work→work edge · no efficacy axis · the atlas boundary*),
   and a menu that files those pages next to `Kūṭa Matching` undoes the framing before the reader
   arrives.
2. **The alternative is worse and is already failing.** Keeping the graph and the ranked view under
   Traditions takes it to 27 items — the panel it is already too big for, and the one the round-order
   append pattern will keep feeding.
3. **The precedent exists.** Oracles is a 4-item top-level group and has never been questioned. Atlas
   ships at 4 and has a named queue (§2.4).
4. **The five-group bar is not actually preserved by refusing.** Traditions at 27 items is a different
   object from Traditions at 24, and users notice panel size long before they notice button count.

### 3.2 The costs, each measured, none hand-waved

| cost | measurement | verdict |
|---|---|---|
| **Menu width** | bar 368 → **429 px**; usage 969.6 → **1030.2 px** of a hard 1041.6 px column | **fits — with 11.4 px left.** The bar is now full. A seventh group is arithmetically impossible; say so in the code comment so nobody tries. |
| **No-wrap threshold** | 1008 px → **1069 px** | the two-row header band widens from 1008–880 to 1069–880 (a 61 px-wide band of viewports newly affected, chiefly **1024 px — iPad landscape and split-screen laptops**). Degradation is graceful: a 67 px header becomes 117 px, exactly as it already does below 1008. |
| **Panel overflow** | **Atlas is the 5th of 6 buttons — its panel must be right-anchored or it overflows the viewport at ≤ 1100 px.** Measured `offRight = YES` at 1100/1024/960 without the rule, `no` with it | a one-selector CSS fix (§4.2). **This is the single easiest thing to forget and it breaks the "fit" assertion.** |
| **Wide-group 2-column layout** | Cast 16→24 items = 505 px tall (cap 599 at 1366×768) · Traditions 24→17 = 434→**399 px** | both fit with no vertical scroll at every tested viewport down to 1100 × 700. No CSS change needed **yet**; the `wide3` escape hatch is specified for when Cast passes 26. |
| **Mobile drawer height** @390×844, cap 658 px | collapsed 207 → **249 px** (+1 accordion header). Tallest single panel: Traditions **1004 px** → Cast **1107 px**; drawer content 1212 → 1356 px | **an honest small regression.** The worst-case group gets ~100 px taller, because Cast absorbs 8 items. Mitigations that already exist: the accordion is single-open (`closeMenus(g)`), so only one panel is ever expanded, and Cast's four kickers give the scroll landmarks Traditions never had. Both before and after, the worst case is ~2 screens of scroll. |
| **5-group muscle memory** | the labels appear in **112 breadcrumb trails** and in the footer's 5-link "Explore" column | mitigated by design: **`Start`, `Cast`, `Traditions`, `Oracles` keep their names, their order and their positions 1–4.** Atlas is inserted at position **5**, so only `Reference` shifts right by one. No group is renamed, so **0 of the 70 "Traditions" crumbs are forced to change.** |

### 3.3 Where Atlas goes in the bar, and why not next to Traditions

`Start · Cast · Traditions · Oracles · **Atlas** · Reference`.

Semantically `Traditions · Atlas` reads better — corpus, then the maps over the corpus. **Position 5
wins anyway** because it is the only insertion point that moves nothing a returning user has memorised
except the last item, and because Atlas *is* a bridge between the corpus groups and the meta group, so
sitting between Oracles and Reference is defensible on its own terms. If the maintainer prefers the
semantic order, the cost is one shifted position for Oracles and it changes no measurement.

---

# §4 · THE EXACT CODE

## 4.1 `assets/js/app/shared.js` — `NAV_GROUPS`

Replace lines 17–101. The 4th tuple slot is the existing kicker; the new `cols: 3` group flag is
inert until used.

```js
// Grouped navigation — a MEGA-MENU. Six groups (Start · Cast · Traditions ·
// Oracles · Atlas · Reference); each group is a dropdown that lists EVERY
// destination BY NAME, so nothing hides behind an "All Tools" page. On desktop
// the group label is a button opening a dropdown panel (wide groups run in two
// columns, `cols: 3` in three); on mobile the same groups become accordion
// sections in the hamburger drawer.
//
// THE CUT IS BY INTENT, NOT BY CULTURE. A page is a `cast` item if it takes a
// moment (and usually a place) and runs the engine; a `traditions` item if it is
// a shelf you read. That is why book1/dignities.html and picatrix/election.html
// have always been Cast (see the special-cases at the top of currentSection),
// and it is why prasna / muhurta / tajika / tithi-pravesha / kuta / vedic-yogas
// are Cast too. `atlas` is the third kind: instruments whose unit of analysis is
// the relation BETWEEN corpora, each with its own epistemic apparatus.
//
// WIDTH BUDGET — MEASURED, DO NOT EXCEED:
//   · the header content column is capped at --maxw (1080px) => 1041.6px usable;
//     the brand block takes 536px. The six group buttons total 429px and the row
//     uses 1030.2px. THERE IS ROOM FOR NO SEVENTH GROUP at any viewport width.
//   · a label in a `wide`/`cols:3` panel ellipsises past ~32 characters (217px
//     cell); in a narrow panel past ~43 (288px). Keep labels under those.
//
// Each item is [href, label, key, kicker?]; `key` matches a value returned by
// currentSection() so the active page (and its group) light up. Exported so
// palette.js / next-up.js can index destinations without duplicating the
// catalogue (read-only imports; the array itself is not mutated).
export const NAV_GROUPS = [
  { label: 'Start', key: 'start', items: [
    ['index.html', 'Home', 'home'],
    ['pages/basics.html', 'The Basics — every concept', 'basics'],
    ['pages/learn.html', 'Learn — astrology & the math', 'learn'],
    ['pages/interpret.html', 'How to read results', 'interpret'],
    ['pages/how-it-works.html', "How it's calculated", 'howitworks'],
    ['pages/workflow.html', 'Chapter map & workflows', 'workflow'],
    ['pages/contents.html', 'Master Index', 'contents'],
  ] },
  // Everything that takes a moment and runs the engine — Western and Indian
  // alike. Four labelled column-groups; the 4th tuple slot renders a
  // `.nav-menu-kicker` before that item (CSS-only grouping, no key changes).
  { label: 'Cast', key: 'cast', wide: true, items: [
    ['pages/workbench.html', 'The Workbench — Master Tool', 'workbench', 'This moment'],
    ['pages/now.html', 'Right Now — live sky', 'now'],
    ['pages/book2/horary.html', 'Horary — a question', 'horary'],
    ['pages/picatrix/election.html', 'Election — choose a moment', 'election'],
    ['pages/prasna.html', 'Praśna — Indian horary', 'prasna'],
    ['pages/muhurta.html', 'Muhūrta — Indian election', 'muhurta'],
    ['pages/moments.html', 'Moment Scanner — all rulebooks', 'moments'],
    ['pages/cycles.html', 'Cycles of History', 'cycles'],
    ['pages/book3/nativity.html', 'Nativity — a birth chart', 'nativity', 'A person'],
    ['pages/trajectory.html', 'Life Trajectory', 'trajectory'],
    ['pages/transits.html', 'Transits to a natal', 'transits'],
    ['pages/synastry.html', 'Synastry — chart to chart', 'synastry'],
    ['pages/timelords.html', 'Time-lords & progressions', 'timelords'],
    ['pages/tajika.html', 'Tājika varṣaphala — the year', 'tajika'],
    ['pages/tithi-pravesha.html', 'Tithi-praveśa — the tithi year', 'tithipravesha'],
    ['pages/vedic/yogas.html', 'Vedic yogas — the detector', 'vedicyogas'],
    ['pages/kuta.html', 'Kūṭa matching — compatibility', 'kuta'],
    ['pages/book1/dignities.html', 'Essential Dignities', 'dignities', 'Hours, tables & talismans'],
    ['pages/book1/planetary-hours.html', 'Planetary Hours', 'phours'],
    ['pages/thelemic-times.html', 'Thelemic times — Resh & Era', 'thelemictimes'],
    ['pages/picatrix/talisman.html', 'Talisman Workshop', 'talisman'],
    ['pages/handcalc.html', 'Cast a chart by hand', 'handcalc', 'By hand & meta'],
    ['pages/autopilot.html', 'Grand Orchestrator (AI)', 'autopilot'],
    ['pages/tools.html', 'All the calculators, compared', 'tools'],
  ] },
  // The shelves. Wing hubs and the wing pages promoted by name; 53 further pages
  // live behind these doors and have no other entry point.
  { label: 'Traditions', key: 'traditions', wide: true, items: [
    ['pages/book1/index.html', 'Book I — Introduction', 'book1', 'Lilly — Christian Astrology'],
    ['pages/book2/index.html', 'Book II — Horary', 'book2'],
    ['pages/book3/index.html', 'Book III — Nativities', 'book3'],
    ['pages/picatrix/index.html', 'Picatrix — astral magic', 'picatrix', 'The Hermetic west'],
    ['pages/kabbalah.html', 'Kabbalah — Tree of Life', 'kabbalah'],
    ['pages/chronology/index.html', 'The Hermetic Chronology', 'chronology'],
    ['pages/greatworks/index.html', 'Great Works — the authors', 'greatworks'],
    ['pages/jung/index.html', 'Jung & astrology', 'jung'],
    ['pages/vedic/index.html', 'Vedic — Jyotiṣa (sidereal)', 'vedic', 'India — Jyotiṣa & the tantras'],
    ['pages/vedic/course.html', 'Vedic course — the theory', 'vediccourse'],
    ['pages/vedic/delineation.html', 'Bhāva delineations', 'vedicdelineation'],
    ['pages/rasa.html', 'Rasaśāstra & yantras', 'rasa'],
    ['pages/abhichara/index.html', 'Abhicāra — ritual magic', 'abhichara'],
    // ['pages/grimoires/index.html', 'Indian grimoires', 'grimoires'],   // ← this round
    ['pages/yoga/index.html', 'The Yoga Sūtras', 'yoga', 'The contemplative texts'],
    ['pages/buddhist/index.html', 'Buddhist scriptures', 'buddhist'],
    ['pages/practices/index.html', 'Practices — methods museum', 'practices'],
  ] },
  { label: 'Oracles', key: 'oracles', items: [
    ['pages/geomancy.html', 'Geomancy — the Shield', 'geomancy'],
    ['pages/tarot.html', 'Tarot — the spread', 'tarot'],
    ['pages/iching.html', 'I Ching — the Changes', 'iching'],
    ['pages/runes.html', 'Runes — Elder Futhark', 'runes'],
  ] },
  // Instruments whose unit of analysis is the relation BETWEEN corpora. Not a
  // tradition (they map traditions) and not a reference (they are dated, graded
  // surveys with their own epistemic apparatus). Label kept to 5 characters
  // because the header row has 11px of slack — see the width budget above.
  { label: 'Atlas', key: 'atlas', items: [
    ['pages/confluence.html', 'The Great Confluence — the map', 'confluence'],
    ['pages/opgraph.html', 'The Operative Corpus — graph', 'opgraph'],
    ['pages/opgraph.html#view=ranked', 'The five columns — ranked', 'opgraphrank'],
    ['pages/compare.html', 'How this site compares', 'compare'],
  ] },
  { label: 'Reference', key: 'reference', items: [
    ['pages/glossary.html', 'Glossary & Dictionary', 'glossary'],
    ['pages/library/index.html', 'The Library', 'library'],
    ['pages/about/index.html', 'Sources & Science', 'about'],
    ['pages/read.html', 'Read the originals', 'read'],
    ['pages/structure.html', 'Structure & patterns', 'structure'],
    ['pages/experiment.html', 'Test it yourself', 'experiment'],
    ['pages/roadmap.html', 'The Roadmap — planned', 'roadmap'],
  ] },
];
```

## 4.2 `assets/css/style.css` — three edits, all additive

**(a) REQUIRED — right-anchor the Atlas panel** (line 76–79). Without this the panel overflows the
viewport at ≤ 1100 px; measured.

```css
.nav-group[data-group="cast"] > .nav-menu,
.nav-group[data-group="traditions"] > .nav-menu,
.nav-group[data-group="oracles"] > .nav-menu,
.nav-group[data-group="atlas"] > .nav-menu,          /* ← ADD */
.nav-group[data-group="reference"] > .nav-menu { left: auto; right: 0; }
```

**(b) OPTIONAL NOW, REQUIRED PAST 26 CAST ITEMS — the 3-column panel.** Insert after the `.wide` rule
(source order decides; same specificity). Measured at 28 links + 4 kickers: 672 × 399 px, cell 217 px,
0 clipped, on-screen down to 1024 px.

```css
.nav-group.open > .nav-menu.wide3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 .25rem;
  min-width: 672px; max-width: min(672px, calc(100vw - 1.5rem)); }
```

and in the `@media (max-width: 880px)` block, extend the two existing selectors so the drawer keeps
collapsing it to one column:

```css
  .nav-menu, .nav-menu.wide, .nav-menu.wide3 { position: static; /* …unchanged… */ }
  .nav-group.open > .nav-menu,
  .nav-group.open > .nav-menu.wide,
  .nav-group.open > .nav-menu.wide3 { display: block; grid-template-columns: 1fr; }
```

**(c) No change to `--maxw`, the 880 px breakpoint, `78vh`, or the brand block.** All four were
checked against the proposal and none needs to move.

## 4.3 `currentSection()` — the routes that must be added

**Moving an item between groups changes no route** — `currentSection` maps *path → key*, and every
existing key is preserved. Only genuinely new pages need routes.

```js
  // --- ADD, in the "Traditions — wing hubs" block (order matters: it must come
  // BEFORE the bare /index.html fallthrough at the bottom) ---
  if (m(/\/pages\/grimoires\//)) return 'grimoires';        // the queued Indian-grimoires wing

  // --- ADD, in a new "Atlas" block, next to the confluence route ---
  // The ranked view is a HASH view of the same page (RANKING-SPEC §5.1: "No new
  // URL"), so the route has to read the hash. Two keys, one path.
  if (m(/\/pages\/opgraph\.html$/))
    return /(^|[#&])view=ranked(&|$)/.test(location.hash) ? 'opgraphrank' : 'opgraph';
```

Three traps, all real:

1. **The `home` fallthrough will silently steal any new wing.** The last rule is
   `if (m(/(\/index\.html$|\/$)/)) return 'home';`. A new `pages/grimoires/index.html` **without** its
   route resolves to `home`, so the **Start** group lights up and `Home` is marked current — and
   `menu-drive` fails with the confusing message *"Indian grimoires: marks 'Home' current instead"*.
   A new leaf page without a route resolves to `''` and fails with *"nothing marked aria-current"*.
   Different symptom, same cause.
2. **Two menu items must never share a key.** `mountChrome` marks by `key === active`, so a shared key
   produces **two** `aria-current="page"` nodes; `menu-drive`'s
   `document.querySelector('… a[aria-current="page"]')` returns the first, and the second item fails
   its label check. This is exactly why the ranked view needs `opgraphrank` and cannot simply reuse
   `opgraph`.
3. **`currentSection()` runs once, at mount.** The harness navigates to the full URL including the
   hash, so the load-time read is enough to pass — but a user toggling **Graph · Ledger · Ranked**
   in-page changes the hash and the highlight would stall. Fix it properly with 4.4(b).

## 4.4 `mountChrome()` — two small changes

**(a) emit the column class and a data key** (line 218–220):

```js
`<div class="nav-menu${g.cols === 3 ? ' wide3' : g.wide ? ' wide' : ''}" id="navmenu-${g.key}" aria-label="${g.label}">${
  g.items.map(([href, label, key, kicker]) =>
    (kicker ? `<b class="nav-menu-kicker">${kicker}</b>` : '') +
    `<a href="${R(href)}" data-nav-key="${key}"${key === active ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('')}</div>`
```

**(b) re-mark on `hashchange`** — insert after `document.body.prepend(header);`:

```js
  // The ranked view is a hash view of pages/opgraph.html (two keys, one path),
  // so the active marking has to follow the hash, not just the load. Data-driven
  // off data-nav-key, so it stays correct if the catalogue changes.
  const markActive = () => {
    const key = currentSection() || activeKey;
    const gk = groupOf(key);
    header.querySelectorAll('.nav-menu a').forEach(a => {
      const on = a.dataset.navKey === key;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    header.querySelectorAll('.nav-group').forEach(g => g.classList.toggle('has-current', g.dataset.group === gk));
  };
  window.addEventListener('hashchange', markActive);
```

(It must not throw — `menu-drive` fails the page on any `pageerror`.)

**(c) the footer "Explore" column** (line 315–323) lists one link per nav group and is hard-coded at
five. Add the sixth, between Oracles and Reference:

```html
        <li><a href="${R('pages/confluence.html')}">Atlas — the maps across the corpora</a></li>
```

## 4.5 The menu-drive assertions that must still pass — and the four to add

**Still green, unchanged (the harness is count-agnostic — verify by reading, not by hoping):**

| # | assertion | status under this design |
|---|---|---|
| A1 | enumerate `header.site .nav-group` → prints `N groups, M items` | 6 / 63 (was 5 / 60). No numeric assert; the log line changes. |
| A2 | **every group opens on click**: `.open` present **and** `aria-expanded="true"` | ✅ `groupEls` is `querySelectorAll('.nav-group')` — count-agnostic. |
| A3 | every item navigates, `resp.status() < 400` | ⚠️ **`pages/opgraph.html` must exist in the same commit as its nav item**, or every run 404s. |
| A4 | exactly one `<main>` per destination | ✅ |
| A5 | `header.site` injected | ✅ |
| A6 | something carries `aria-current="page"` | ⚠️ requires the two new routes (§4.3). |
| A7 | **its `textContent` equals the menu item's label** | ⚠️ requires **unique keys** — the reason `opgraphrank` exists. |
| A8 | the owning `.nav-group` has `.has-current` | ✅ `groupOf` finds `opgraphrank` in `atlas`. |
| A9 | zero console / pageerror / requestfailed | ⚠️ the `hashchange` listener must be exception-free. |
| A10 | Escape closes the open dropdown and returns focus to its button | ✅ the handler iterates `groupEls`; a 6th group needs no code. |
| A11 | (`og-nav-check.mjs`) `contents.html` and `tools.html` carry a card link to any newly named page | ⚠️ one card each for `opgraph.html`; and `tools.html` moving into Cast does not change that. |

**Add these four — the redesign is not verified without them:**

```js
// F1 · FIT — no panel may leave the viewport, and none may push the document
//      sideways. This is the assertion the Atlas right-anchor CSS exists for.
for (const vw of [1400, 1280, 1100, 1024]) {
  await pg.setViewport({ width: vw, height: 900 });
  await pg.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });
  const bad = await pg.evaluate(() => {
    const out = [];
    for (const g of document.querySelectorAll('.nav-group')) {
      g.classList.add('open');
      const r = g.querySelector('.nav-menu').getBoundingClientRect();
      if (r.right > innerWidth + 1 || r.left < -1) out.push(`${g.dataset.group} off-screen (${Math.round(r.left)}…${Math.round(r.right)} of ${innerWidth})`);
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`${g.dataset.group} causes horizontal document overflow`);
      g.classList.remove('open');
    }
    return out;
  });
  bad.forEach(bad_ => bad(`@${vw}px: ${bad_}`));
}

// F2 · NO CLIPPED LABEL — closes the false green: "exposed BY NAME" currently
//      passes on three labels that render as "Practices — the museum of me…".
const clipped = await pg.evaluate(() => {
  const out = [];
  for (const g of document.querySelectorAll('.nav-group')) {
    g.classList.add('open');
    for (const a of g.querySelectorAll('.nav-menu a'))
      if (a.scrollWidth > a.clientWidth + 1) out.push(`${a.textContent.trim()} (needs ${a.scrollWidth}px, has ${a.clientWidth}px)`);
    g.classList.remove('open');
  }
  return out;
});
clipped.forEach(c => bad('menu label ellipsised: ' + c));

// F3 · EXACTLY ONE aria-current per page (a duplicate key is otherwise silent)
//      — fold into the per-destination walk:
//      const n = document.querySelectorAll('header.site .nav-menu a[aria-current="page"]').length;
//      if (n !== 1) misses.push(`${it.label}: ${n} aria-current nodes`);

// F4 · THE DRAWER — at 390×844 the hamburger opens, every accordion opens, and
//      the document never scrolls sideways. (Only the drawer scrolls, vertically.)
```

---

# §5 · MIGRATION RISK LIST

## 5.1 The property that makes this cheap: **no URL and no key changes**

- **No file moves on disk.** Every `href` in the proposal already exists except `pages/opgraph.html`
  (new this round) and `pages/grimoires/index.html` (queued). External links and bookmarks are
  unaffected. **Zero redirects needed.**
- **Every `key` string is preserved.** `prasna` stays `prasna`; only its *group* changes. Therefore:
  `currentSection()` needs **no edits** for any of the ten moved items; `NEXT_UP`'s per-key entries
  keep resolving; `palette.js` rows keep their hrefs; deep links `…#…` are untouched.
- **The only new key strings** are `opgraph`, `opgraphrank`, `grimoires`.
- **The only new group key** is `atlas`.

## 5.2 Files that must change, with the size of the change

| file | change | size |
|---|---|---|
| `assets/js/app/shared.js` | `NAV_GROUPS` rewritten (§4.1); 2 new routes (§4.3); `data-nav-key` + `markActive` + `hashchange` (§4.4a–b); footer Explore gains 1 row (§4.4c) | ~90 lines, one file |
| `assets/css/style.css` | 1 selector added (required); 6 lines of `wide3` (optional now) | 7 lines |
| `assets/js/app/next-up.js` | **`GROUP_DEFAULTS.atlas` must be added** (else any `atlas` page without an explicit `NEXT_UP` row falls all the way through to `HOME_TRIO`); `FALLBACK_GROUP` updated for the 10 moved keys + 3 new; `SECTION_KEYS` gains `opgraph`, `opgraphrank`, `grimoires` | see 5.3 |
| `pages/contents.html` | one card for the graph (PLAN §7.2); **plus 6 section `id`s** (§5.4) | small |
| `pages/tools.html` | one card for the graph; its own crumb second segment `Reference` → `Cast` | small |
| 9 pages | breadcrumb second segment relabelled (§5.4) | 9 one-line edits |
| `sw.js` | **bump `VERSION`** (currently `awb-2026-07-16`) | 1 line |
| `assets/search-index.json` | regenerate: `node scripts/build-search-index.mjs` | generated |

## 5.3 The test-facing landmine: `SECTION_KEYS` has already drifted

`scripts/tests/ui3-motion-controls.mjs:190` asserts that **every** key in `next-up.js`'s
`SECTION_KEYS` resolves to ≥ 2 rows. That list is documented as *"kept in sync with shared.js"* and
**is not**: it is already missing `compare`, `buddhist`, `practices`, `thelemictimes`, `vedicyogas`,
`vedicdelineation`, `vediccourse` — seven keys that have been live since R29–R31 and are therefore
untested. Adding three more without fixing the drift compounds it.

**Do in the same commit:** add the 7 missing + 3 new keys to `SECTION_KEYS`, add `GROUP_DEFAULTS.atlas`,
and confirm each of the 10 resolves through the fallback chain. The failure mode if skipped is not a
red test — it is a **"Where next" band that quietly shows the generic home trio** on the newest pages.
Also note `allHrefs()` is asserted on-disk, so any href added to `GROUP_DEFAULTS.atlas` must be a real
file (`pages/confluence.html`, `pages/opgraph.html`, `pages/compare.html` all are).

## 5.4 Breadcrumbs — the actual number, measured, not estimated

R29 rewrote ~94 trails to menu geography; **112 exist today**, second segments tallying
**Traditions 70 · Cast 19 · Reference 12 · Start 6 · Oracles 4 · "Tools" 1**.

| category | count | work |
|---|---|---|
| **Must change** — the item's group changed and it has no sub-pages | **9** | `prasna`, `muhurta`, `tajika`, `tithi-pravesha`, `kuta`, `vedic/yogas`, `thelemic-times` → `Traditions` → **`Cast`** (7); `compare` → `Reference` → **`Atlas`** (1); `tools` → `Reference` → **`Cast`** (1). Each is a single `<p class="crumb">` line. |
| **Silently corrected at zero cost** | **19** | the crumbs already reading `Home › Cast › …` and linking `tools.html` become true the moment `tools.html` joins the Cast group. |
| **Forced by a group rename** | **0** | no group is renamed. This is the whole reason `Traditions` keeps its name (§2.2). |
| **Untouched** | **84** | including all 70 `Traditions › contents.html` trails. |
| **New** | 2 + wing | `opgraph.html` needs `Home › Atlas › The Operative Corpus`; the ranked view is the same page so its crumb needs a view-aware suffix or none; the grimoires wing needs its own hub + sub-page trails. |

**So: 9 forced crumb edits, not 94.** The design was chosen partly to make that true.

**Two optional crumb-hygiene items, costed so they can be scheduled rather than forgotten:**

- **contents.html has no `id`s.** Add six (`#start`, `#cast`, `#traditions`, `#oracles`, `#atlas`,
  `#reference`) to its existing `<h2>` sections so the 70 Traditions crumbs can deep-link the way the
  4 Oracles crumbs already do via `tools.html#divination`. **Cost: 6 attributes + optionally 70
  one-character href edits** (`../contents.html` → `../contents.html#traditions`). Recommend shipping
  the ids now and the href sweep whenever a script is already touching those files.
- **I2 — `book1/master.html` / `book3/master.html`** crumb to `Cast` but highlight `Traditions`. Either
  add two `currentSection` special-cases (alongside the six that already exist) pointing them at
  `workbench`, or change their crumbs to `Traditions`. **Cost: 2 lines either way.** Not urgent — they
  are not menu destinations, so no harness catches it.

## 5.5 Everything else that could bite

| # | risk | mitigation |
|---|---|---|
| R1 | **The opgraph PLAN §7.2 says the nav item goes "under **Traditions**".** If R33 lands first and this lands second, the item moves twice and the crumb is written twice. | Amend that one table row to **Atlas** *before* the R33 build starts. One word. |
| R2 | **Nav item shipped before the page.** `menu-drive` A3 fails hard on HTTP 404 for every run. | The `NAV_GROUPS` line and `pages/opgraph.html` must land in the same commit. Same for the grimoires wing (keep the line commented until the page exists — as written in §4.1). |
| R3 | **Stale service worker** serves the old 5-group `shared.js` beside a new `opgraph.html`, so the page loads with no nav entry and nothing marked current. | Bump `sw.js` `VERSION`. Localhost no-ops, so the gate will not catch this — it is a production-only failure. |
| R4 | **The hash route is fragile to spec drift.** If `RANKING-SPEC` ever changes the hash key from `view=ranked`, the `opgraphrank` item silently stops highlighting and A7 fails on a run that looks unrelated. | Export the token once (`export const RANKED_HASH = 'view=ranked';`) and have both the painter and `currentSection` read it. |
| R5 | **Palette "kind" chips** now show a sixth value, `Atlas`. `buildIndex()` grows 60 → 63 rows. | Cosmetic; the test asserts only `> 40`. Worth an eyeball in the palette UI. |
| R6 | **Three labels get shorter** (`Buddhist scriptures`, `Practices — methods museum`, `Thelemic times — Resh & Era`). Anything matching on the old strings breaks. | `grep -rn "word by word\|museum of methods\|era legis & Liber Resh" scripts/ assets/` before committing. The pages' own `<h1>`s are unchanged — only the menu labels shrink. |
| R7 | **Mobile drawer regression is real**, not zero: worst-case panel 1004 → 1107 px. | Accepted and documented (§3.2). If it ever bites, the fix is to split Cast's *A person* run into its own group — which the width budget forbids — or to make drawer kickers sticky, a 3-line CSS change. |
| R8 | **1024 px viewports get a two-row header** where they had one. | Graceful (67 → 117 px), already the behaviour below 1008 px, and no content is lost. Screenshot at 1024 before/after so the reviewer sees it deliberately. |
| R9 | **Someone tries a seventh group later.** It cannot fit and the failure looks like a CSS bug. | The width budget is written into the `NAV_GROUPS` comment (§4.1) precisely so the next round finds it before measuring. |

---

# §6 · THE SHORT VERSION

1. **Traditions is a residue, not a category** — 24 items of five different kinds, ordered by shipping
   round, with no kickers because no honest sub-heading spans them.
2. **The site already solved this once**, for the Western tools, in the six `currentSection`
   special-cases at `shared.js:113`. Apply the same rule east: *does it take a moment? → Cast.* That
   moves seven items out and reunites `praśna` with `horary`, `muhūrta` with `election`, `kūṭa` with
   `synastry`.
3. **Cut by intent at the top; carry the corpus axis as wing hubs inside one group, sub-divided by
   kickers** — because 53 of 113 pages have no entry point except their wing hub, so the wings must
   stay in the bar.
4. **Add exactly one sixth group, `Atlas`** (Confluence · operative graph · ranked view · compare) —
   the one thing a five-group bar cannot say, and the only label class the 72 px of header slack allows.
5. **Cost, measured:** bar 368 → 429 px of a hard 1041.6 px column (11 px left, no seventh group ever);
   one-row header down to 1069 px instead of 1008; Traditions panel 434 → 399 px; Cast 364 → 505 px;
   mobile worst-case panel 1004 → 1107 px; **9 breadcrumb edits, 19 crumbs silently corrected, 0 URL
   changes, 0 key changes.**
6. **Do not ship without** the Atlas right-anchor CSS, the two `currentSection` routes (one hash-aware),
   `GROUP_DEFAULTS.atlas`, the `SECTION_KEYS` drift fix, and the four new menu-drive assertions —
   especially **F2**, which catches the three labels that are truncated on screen today while the
   harness reports them as "exposed by name".
