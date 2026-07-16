# R28 PLAN — The Chart-Output Deep Dive
## Display + explanation + plain-language translation for EVERY chart/report output on the site

*Plan-only round. Nothing in this document has been written into the repo. This is the spec an
Opus coder builds from, under the locked invariants: honest-science framing (no demonstrated
validity, described never prescribed, CONTESTED flagged both ways), core/** pure (no DOM),
DOM in app/**, DS2 tokens only, reduced-motion-first, registry + engine-test + glossary +
AI-assistant integration for every new capability.*

---

# 0. Executive summary

The site computes more than almost any astrology tool on the web, and explains the *provenance*
of every number impeccably (citations, contested flags, "how it's calculated" links). What it
does NOT yet do is explain the *output itself* to a person who doesn't already read charts.
The audit below found one repeated failure shape across ~24 outputs:

> **Every output is Layer-1 only** (the figure/table, expertly dense, JHora-style), with
> provenance links pointing AWAY from the output. There is no in-place "what the tradition
> computes here" and no "in plain words" translation — except two proofs of concept that
> already exist and work: the Vedic panel's computed **"Conclusions & advice"** section
> (`app/vedic-panel.js` lines 59–64) and the static **`pages/interpret.html`** reference guide.
> The fix is to make that pattern universal, structural, and computed.

The plan: a site-wide **three-layer output standard** (§4), a **hover/tap glossary popover**
riding the existing autolinker + 247-term glossary (§5), a **"read this chart aloud"** narrative
order per chart (§6), two **new figure renderers** the site conspicuously lacks (North/South
Indian rāśi chart; a shared period-timeline strip for daśā/firdāriā/ZR/transits) (§7.5, §7.7),
and a per-chart retrofit table with S/M/L efforts (§7), phased (§9).

---

# 1. Inventory & audit — every chart/report output

Method: read of `assets/js/core/chart.js`, `assets/js/app/*.js` (all 56 modules), the page
HTML, `core/registry.js`, `core/data/glossary.js`, `app/autolink.js`, and the DS2 token layer
in `assets/css/style.css`. For each output: **what it shows / what it fails to explain /
where a layperson gets lost.**

## 1.1 The chart wheel — `core/chart.js` (328 lines, SVG string-of-nodes renderer)
Used by: `workbench.js`, `horary.js`, `book1-master.js`, `book3.js` (nativity), `jung-tool.js`.

**Shows (well):** three rings, faint elemental wash, degree ticks (density-gated at 480/380px),
sign glyphs coloured by element, house cusps (angular cusps heavier), orb-weighted aspect lines
(width/opacity by tightness), dashed = separating, conjunction arc-brackets, midpoint dots on
hard aspects (colour-blind redundancy), cluster-fan collision handling with true-longitude
leaders, ASC/MC/DSC/IC gold triangles, retrograde ℞, embedded `<style>` so exports self-style.
This is genuinely state of the art for a hand-rolled wheel.

**Fails to explain:**
- **No legend anywhere.** Green/red/gold aspect lines, dashed-vs-solid, the elemental wash,
  the aspect-hub disc, glyph colour classes (benefic/malefic/lum/neutral), the ℞ mark, the
  house numbers — all unexplained on every page that embeds the wheel. A layperson sees
  "red lines = bad?" and guesses.
- **Interaction is native `<title>` only** (line 319–321): a delayed browser tooltip,
  invisible on touch, unreachable by keyboard, not styled. There is no click-to-inspect.
- **No reading order.** Nothing says "start at the left horizontal line — that's the
  Ascendant; the wheel is a map of the sky at that instant, east on the left."
- The `aria-label` is static ("Astrological chart wheel") — a screen-reader user gets
  nothing about the content.

**Layperson gets lost at:** the very first glance ("why is Aries not at the top?"), the
aspect-line spaghetti, and the discovery that hovering does nothing obvious.

## 1.2 Workbench panels — `app/workbench.js` (494 lines) + `pages/workbench.html`
Panels rendered per compute: summary strip, verdict banner (`#wb-verdict-banner`), moment
table (`#wb-moment`), dignities (`#wb-dignities`), aspects (`#wb-aspects`), Lots + antiscia
(`#wb-lots`), chart-health (`#wb-cautions`), horary (`#wb-horary`), election (`#wb-election`),
talisman (`#wb-talisman`), natal (`#wb-natal`), reference index, JSON, citations.

**Shows:** everything the `fullReading` spine computes, each panel with registry-driven
"how it's calculated ↗ / open the dedicated tool ↗" links and citations. Verdict banner with
`role="status"` (good a11y precedent). Autolink pass over eight prose panels after compute.

**Fails to explain:**
- **The moment table's columns:** "Ho." (house), "Speed" (degrees/day? no unit, no sign
  convention), "Dignity" (a bare signed integer, no scale — is +8 good? out of what?).
- **Dignity scores have no anchor.** `+5/−5` sums shown with pos/neg colour, but Lilly's
  point scale (domicile +5 … peregrine −5, accidental range roughly −20…+25) is only on
  `pages/book1/dignities.html`. A layperson reads "+12" as a rating out of 100.
- **The autolinker deliberately skips `table.data`** (`autolink.js` line 48) — but ~80% of
  the jargon a novice meets is INSIDE the tables (peregrine, cazimi, partile, antiscion…).
- **Glossary links navigate away** (`glossary.html#slug`) — total context loss mid-reading;
  there is no popover.
- The horary panel's plain-ish sentences are the best prose on the page, but perfection
  jargon ("translation of light", "refranation") arrives unglossed inside `<b>` tags.
- `pages/interpret.html` ("Reading your results") explains every block — but nothing in the
  output links to the RELEVANT SECTION of it panel-by-panel.

**Lost at:** the wall of ten cards; no one tells the user which three matter or in what order
to read them.

## 1.3 Horary master report — `app/horary.js` (239 lines) + `pages/book2/horary.html`
**Shows:** wheel, verdict banner ("the modes of perfection ↓" anchor link — good), planets
table, significators, perfection mode list, aspects, considerations advisories.
**Fails:** the final judgement is never stated as one plain sentence ("the tradition would
read this as: the matter PERFECTS by a direct trine, but the Moon is void — Lilly would
hesitate"). Timing output ("X units") shows Lilly's unit-proportioning without saying what a
"unit" resolves to here. Querent/quesited never defined in-place.
**Lost at:** "what's the answer?" — the tool computes testimonies but makes the user assemble
the verdict themselves.

## 1.4 Nativity report — `app/book3.js` + `book3-master.js`, `pages/book3/*.html`
**Shows:** wheel, planets table, Lord of the Geniture, humoral temperament tally.
**Fails:** temperament arithmetic (sign qualities → hot/cold/dry/moist counts) is shown as
a result without the tally; "Lord of the Geniture" defined only via glossary link; no
natal narrative at all (the `natal-topics.js` core module exists for topics-by-house — check
whether book3 surfaces it; the master report should).
**Lost at:** "so what does my chart say?" — precisely the question the site must answer
honestly: "here is what LILLY's system would compute — and the honest note."

## 1.5 Vedic outputs — `app/vedic-panel.js` (146 lines) shared by `pages/vedic/index.html` + every toggle
**Shows:** graha table (position/bhāva/nakṣatra/dignity), pañcāṅga line, vimśottarī summary
line + mahā list, **D9 as a cryptic glyph string** (`☉Ari ☽Tau …`), SAV as a raw 12-number
list, yogas, full ṣaḍbala table, practice section, and — the site's best existing Layer-3 —
a computed **"Conclusions & advice"** section with an "In sum" callout.
**Fails:**
- **There is NO chart figure at all.** No North-Indian diamond, no South-Indian square —
  the single most recognisable artefact of the whole tradition, and the first thing any
  JHora user looks for. (Grep confirms: no SVG in `vedic-panel.js`/`vedic.js`.)
- Navamsa line and SAV line are unreadable to anyone; ṣaḍbala "rūpas/required/ratio" table
  has a note in a `<details>` but no in-place "what is a rūpa".
- Vimśottarī has no timeline visual; "balance of X yr" unexplained.
**Lost at:** "where's the chart?"

## 1.6 Divisional (varga) outputs
Only D9 surfaces, as the glyph string above. If `core/vedic.js` computes more vargas (README
claims D1–D60), they have no display at all. **Plan treats vargas as part of the new rāśi
chart renderer (§7.5): a varga picker over the same square/diamond figure.**

## 1.7 Daśā / timelords timelines — `app/timelords.js` (226 lines), `pages/timelords.html`
**Shows:** progressions natal/progressed/Δ table, firdāriā table with pill sub-periods and
`◀ now` markers, ZR L1/L2 tables for Spirit and Fortune, honest callouts for the disputed
night-node placement and the 360-day year.
**Fails:**
- All tables, zero timeline graphics. Period data is INHERENTLY a horizontal bar timeline;
  every serious tool draws one.
- Critical info hidden in `title=` attributes (ZR pill hover shows dates + "loosing of the
  bond") — inaccessible on touch and to screen readers.
- `HL` highlight is an inline `style="background:…"` — invisible to assistive tech, and a
  hard-coded style bypassing DS2 classes (same anti-pattern in transits/tajika/kuta/moments).
- "Distribution years", "Naibod arc", "loosing of the bond" explained in dense parentheticals,
  not layered.
**Lost at:** "which period am I in and when does the next start?" — answerable at a glance
only with a drawn timeline.

## 1.8 Transits — `app/transits.js` (221 lines), `pages/transits.html`
**Shows:** natal+window summary with profection overlay, in-force snapshot table
(applying/separating verdict chips — good), exact-hit table (up to hundreds of rows in a
scroll region), stations & ingresses, lunar returns, honest "contested definition" callout.
**Fails:** no month-strip / density view of the hit timeline; "time-lord activated" is again
an inline-style row highlight + a `◀ reason` cell; pass structure ("1-or-3 pass") explained
in prose above but rows just say "2/3"; orbs "Lilly's moieties" unglossed.
**Lost at:** volume — 300 rows with no visual summary of when the busy weeks are.

## 1.9 Synastry — `app/synastry.js` (159 lines), `pages/synastry.html`
**Shows:** the cross-aspect grid between two nativities (Lilly moieties), house overlays both
ways, Jung-experiment honest framing.
**Fails:** a grid of glyph pairs is the least self-explanatory artefact on the site; no
"strongest contacts first" list; overlay tables presume the reader knows what "his Sun in her
7th" is supposed to mean in the tradition.
**Lost at:** the grid itself.

## 1.10 Election / muhūrta verdicts — `app/election-tool.js` (273), `app/muhurta.js` (179), `app/now.js` (277)
**Shows:** verdict badge + fully cited reason list with per-reason `delta` scores (the site's
best evidence-trail pattern); ranked aims table; muhūrta 30-slot day with kālas; "Now"
dashboard.
**Fails:** the `score` scale is unanchored (what range is good?); `gating` sentence is good
honest practice but appears only when triggered; muhūrta slot names (Rudra, Āhi…) unglossed;
the three kālas (Rāhu-kāla etc.) explained on page prose but not at point of use.
**Lost at:** score arithmetic; the muhūrta grid's Sanskrit density.

## 1.11 Tājika / praśna — `app/tajika.js` (248), `app/prasna.js` (199)
**Shows:** varṣaphala (muntha, year-lord candidates, sahams, tājika aspects/yogas — with
contested flags); praśna judgement testimonies each with citation, KP sub-lord option.
**Fails:** these are the two most jargon-saturated outputs on the site (muntha, ithasala,
kambūla…); every testimony is cited but none is translated; KP "sub-lord" arrives cold.
**Lost at:** nearly every noun.

## 1.12 Kūṭa / tithi-praveśa — `app/kuta.js` (156), `app/tithi-pravesha.js` (142)
**Shows:** 36-guṇa table + 10 porutham, both-ways contradictions flagged ⚑ (exemplary);
annual tithi chart data.
**Fails:** the 36-point total invites exactly the misuse the page warns against — the
warning must ride the NUMBER (a "what this number is not" line pinned to the total);
guṇa names unglossed at point of use.

## 1.13 Oracles' casts — `app/tarot.js` (206), `app/iching.js` (226), `app/runes.js` (306), `app/geomancy.js` (257)
**Shows:** tarot positioned board + elemental dignities; I Ching cast lines → primary/
nuclear/relating hexagrams; runes with attested poem stanzas above flagged modern keywords
(exemplary honesty layering); geomancy shield with derivation + house judgement; each has
the divination assistant + cast-hour panel; per-figure "✶ explain this" prefill exists.
**Fails:** the derivations (nuclear hexagram, geomantic algebra, elemental dignities between
neighbours) are computed silently — the *mechanics* layer is the missing one here (the
opposite failure of the astrology tools); spread-position meanings shown once, not on hover.
**Lost at:** "why is THIS the judge?" — show the algebra.

## 1.14 Kabbalah tree — `app/kabbalah.js` (282), `pages/kabbalah.html`
**Shows:** Kircher-layout SVG, click-to-inspect sephira/path panels with DISPUTE panels —
**the site's best figure-interaction pattern; the model for the wheel's inspector (§7.1).**
**Fails:** no "read the tree aloud" order (pillars → triads → lightning flash); the SVG
labels are tiny fixed font sizes; no plain-words layer on the inspector.

## 1.15 Moment scanner — `app/moments.js` (158), `pages/moments.html`
**Shows:** state-change-compressed cross-system table (Lilly verdict / hour / muhūrta / kāla
/ pañcāṅga T-Y-K-N chips), legend line below, honest per-column framing.
**Fails:** the T/Y/K/N chips are the densest cell on the site and depend on `title=` hovers;
column meanings live one screen away; no row-level "why did the verdict flip here?"
**Lost at:** every cell of the pañcāṅga column.

## 1.16 Confluence atlas drawer — `app/confluence.js` (904), `pages/confluence.html`
**Shows:** lanes/nodes/edges SVG underlay + HTML button nodes (roving tabindex, arrow-key
nav), detail drawer, single-column Ledger fallback, thread-walk. **The site's best
overview→zoom→details implementation already** — cite it internally as the pattern.
**Fails:** little; the drawer could take the standard three-layer block for its "technique"
section. Effort here is minimal.

## 1.17 Others in scope for the standard, briefly
- **Cycles** (`app/cycles.js`): conjunction scanner tables + eclipse finder — needs the
  plain-words layer on trigon runs; epistemic labels already exemplary.
- **Trajectory** (`app/trajectory.js`): profection year-by-year table — same timeline-strip
  reuse as §7.7; directions table needs "what a direction is" in place.
- **Hand-calc** (`app/handcalc.js`): already pedagogical by design (station-by-station with
  engine deltas) — the model for Layer-2 mechanics elsewhere; no change beyond glossary tips.
- **Jung tool, rasa yantras, kameas**: standard block + glossary tips only.

## 1.18 Cross-cutting audit findings (the real bugs to fix once)
1. **F-TABLE-GLOSS:** autolinker skips all `table.data` → the jargon-densest DOM is unlinked.
2. **F-TITLE-ONLY:** ~14 places put load-bearing info in `title=` attributes (touch/SR-invisible).
3. **F-INLINE-HL:** the `HL` inline-style highlight (timelords/transits/tajika/kuta/moments/
   tithi-pravesha) is not a DS2 class, not colour-blind safe, not announced.
4. **F-NO-LEGEND:** no figure on the site has an adjacent legend (wheel, tree, shield, board).
5. **F-SCALE-ANCHOR:** every score (dignity totals, election score, guṇa totals, ṣaḍbala
   ratio, SAV) prints unanchored numbers.
6. **F-NAV-AWAY:** every explanation affordance navigates away (glossary page, how-it-works
   page, interpret page) instead of disclosing in place.

---

# 2. Research — how the best tools explain charts (web, July 2026)

- **TimePassages (astrograph.com)** is the reference for plain language: *"point and click on
  any chart feature to open the interpretations window"*; mouseover gives a one-line status
  summary ("Jupiter in Capricorn (2°Cap03′) in the Fifth House"), click gives the full
  interpretive text. Two-tier hover→click disclosure, per chart element. Sources:
  [astrograph.com/astrology-software](https://astrograph.com/astrology-software),
  [Basic edition](https://astrograph.com/timepassages/basic).
- **astro.com (Astrodienst)** layers by *authorship and depth*: free short computed
  interpretations → Liz Greene / Robert Hand long-form texts; AstroClick maps make each
  chart element clickable for a short description. The lesson: the layer boundary is
  editorial (short computed vs long authored), and clickability of every element. Sources:
  [astro.com](https://www.astro.com/index_e.htm),
  [AstroClick Travel](http://www.astro.com/cgi/aclch.cgi?btyp=acm).
- **Astro-Seek** pairs maximal tables with per-page beginner guides and inline explanations —
  the guides live NEXT to the tables, not on a separate reference page. Sources:
  [Beginner's guide](https://horoscopes.astro-seek.com/beginners-guide-to-astrology-search-tools),
  [astro-seek.com](https://www.astro-seek.com/).
- **Jagannatha Hora** is the density ceiling this site already matches: tab-per-technique,
  every value tabulated, no translation layer at all — beginners are told to "start with
  basic chart generation and gradually explore". Confirms: density is fine IF layered.
  Sources: [vedicastrologer.org features](https://www.vedicastrologer.org/jh/features.htm),
  [PyJHora](https://github.com/naturalstupid/PyJHora).
- **Shneiderman's mantra** — *"Overview first, zoom and filter, then details-on-demand"*
  (1996, The Eyes Have It) — is the structural law for §4; tooltips are the canonical
  details-on-demand; overview+detail and focus+context are the named paradigms. Sources:
  [Shneiderman 1996 (PDF)](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf),
  [VisGuides discussion](https://visguides.org/t/visual-information-seeking-mantra/241).
- **Datawrapper annotation practice** — explanatory charts should carry the takeaway in the
  title/annotation, draw leader lines to the annotated point, and on small screens fall back
  to numbered annotations BELOW the figure. Directly applicable to the wheel's narrate mode
  (§6) and the timeline strips (§7.7). Sources:
  [text annotations](https://www.datawrapper.de/academy/how-to-create-text-annotations),
  [responsive annotations](https://www.datawrapper.de/blog/better-more-responsive-annotations-in-datawrapper-data-visualizations),
  [text in datavis](https://www.datawrapper.de/blog/text-in-data-visualizations).

**Synthesis for this site:** TimePassages' two-tier element interaction + astro.com's
short-computed-vs-long-authored layer boundary + Datawrapper's takeaway-first annotation +
Shneiderman's ordering — but with this site's unique twist: the plain-words layer must be
**honest translation, not interpretation-as-truth** ("the tradition would read this as…",
never "you are…"), ending in the locked no-validity note.

---

# 3. Design constraints recap (invariants the coder must hold)

- `core/**` stays pure (Node-testable, no DOM). `chart.js` is the one grandfathered
  DOM-toucher; **do not add more** — new figure renderers return **SVG markup strings**
  (pure string building, unit-testable in `scripts/engine-test.mjs`), and `app/**` injects.
- All colour/spacing/type via DS2 tokens (`--surface-*`, `--text-*`, `--ok/--warn/--bad`,
  `--dg-*` diagram tokens, `--sp-*`, `--rad-*`); no new hex values.
- Reduced-motion-first: popovers and drawers appear without transition under
  `prefers-reduced-motion`; no scroll-jacking; the narrate mode's highlights are opacity
  changes, not movement.
- Every new pure module gets a registry entry + engine-test assertions; every new term goes
  in `core/data/glossary.js`; the AI assistant reads the same serialized objects.
- No build step; vanilla ES modules; `shared.js` chrome injection untouched.

---

# 4. THE THREE-LAYER OUTPUT STANDARD (the core deliverable)

Every chart/report output block on the site becomes one **`explain-block`**:

```
┌─ .card ────────────────────────────────────────────────────────┐
│ <h2> + existing regLinks (unchanged)                           │
│                                                                │
│ (i)  THE FIGURE — existing table/SVG, plus a legend where the  │
│      figure is graphical (new .figure-legend component)        │
│                                                                │
│ (iii) IN PLAIN WORDS — .plain-words callout, ALWAYS VISIBLE,   │
│      2–5 computed sentences: "Read plainly: …" ending with the │
│      standing honesty note (one shared sentence, not repeated  │
│      per block — see §4.4)                                     │
│                                                                │
│ (ii) <details class="layer-mechanics">                        │
│      <summary>What the tradition computes here</summary>       │
│      cited mechanics: the rule, the formula, the source        │
│      edition, the CONTESTED flags — much of this text already  │
│      exists in registry entries, callouts and how-it-works     │
│      anchors; this pulls it to the point of use               │
│      </details>                                                │
└────────────────────────────────────────────────────────────────┘
```

Order on screen: figure → plain words → collapsed mechanics. (Plain words above mechanics
because the audit shows the layperson's question is "what does this say?" before "how was it
computed?"; experts get the summary row and skip.)

### 4.1 New shared components

**`assets/js/app/explain-block.js`** (app, DOM) — one function:
```js
renderExplainBlock(container, {
  plain,        // { text: string, chips?: [{term, slug}], tone?: 'ok'|'warn'|'bad'|null }
  mechanics,    // { html: string, citation: string, contested?: [{claim, positions:[a,b]}] }
  legend,       // optional [{swatchClass|glyph, label}]
  anchorId,     // for deep links & the narrate mode
})
```
Renders the standard skeleton around an existing figure node. Idempotent per compute (panels
already replace innerHTML wholesale).

**`assets/js/core/explain/`** (pure) — one module per family, each exporting
`explainX(readingSlice, opts) -> { text, terms[], tone, citation }`:
- `explain/moment.js` — angles/sect/hour sentence + speed & house column notes.
- `explain/dignities.js` — anchors the scale ("Lilly scores −5…+5 per essential kind;
  totals above +4 he calls 'strong'…" — cite CA Bk I), names the extremes only
  ("Venus is the most dignified body here; Saturn the most afflicted").
- `explain/aspects.js` — top-3 tightest, applying-vs-separating in words.
- `explain/horary.js` — the one-sentence judgement assembly (§7.3).
- `explain/election.js` — score anchoring + the gating sentence always stated.
- `explain/vedic.js` — extends the existing `conclusions` builder in `core/vedic.js`
  (do not duplicate — factor it out so panel and explain-block share it).
- `explain/timelords.js`, `explain/transits.js`, `explain/synastry.js`,
  `explain/tajika.js`, `explain/prasna.js`, `explain/kuta.js`, `explain/oracles.js`
  (tarot/iching/runes/geomancy mechanics sentences), `explain/kabbalah.js`.
Every module: cited, engine-tested (assert non-empty text for reference vectors, assert the
no-validity note is present exactly once per page — see §4.4, assert CONTESTED items render
both positions).

**CSS (append to style.css, DS2 tokens only):**
- `.plain-words` — `background:var(--surface-wash); border-left:3px solid var(--accent);
  padding:var(--sp-3) var(--sp-4); border-radius:var(--rad-2)` with a small-caps
  "In plain words" label (same pattern as the existing `.callout .label`).
- `.layer-mechanics` — a `<details>` restyle: summary with a ⚙ glyph, content in
  `--text-soft`, citations in the existing `.small .muted` idiom.
- `.figure-legend` — flex-wrapped chips: swatch (or glyph) + label, `--fs--1`.
- `.hl-row` — the DS2 replacement for the inline `HL` style: `background:var(--accent-wash);
  box-shadow:inset 3px 0 0 var(--accent)` **plus** a visually-hidden "(current)" span for
  screen readers. Fixes F-INLINE-HL everywhere.

### 4.2 What Layer (ii) contains, concretely
For each block: the computing rule in one paragraph, with the source edition exactly as the
registry already words it, e.g. dignities → "Lilly's table (CA Bk I ch. 18, 1647 ed.),
Ptolemaic terms; discrepancies against the 1647 print flagged in `dignities-data.js`
comments"; plus the block's CONTESTED items, verbatim both positions (formula variants for
Lots, night-node placement for firdāriā, solar vs soli-lunar month for tithi-praveśa, the
North/South 5-9 kūṭa contradiction…). **No new scholarship needed — this is a relocation of
existing cited text to the point of use.** Where text exists on how-it-works.html, Layer (ii)
ends with "full derivation ↗" to the existing anchor.

### 4.3 What Layer (iii) may and may not say (the honesty contract)
- Template voice: **"The tradition reads this as…" / "Lilly would judge…" / "A Jyotiṣī
  would call this…"** — always attributed, never second-person destiny ("you will…" is
  banned; "you" allowed only for chart mechanics: "your birth moment puts the Sun in…").
- Sensitive domains (kūṭa, synastry, abhichāra): plain words describe **what the number is
  and is not** — for kūṭa the layer-3 text is fixed: "36 guṇas is a medieval compatibility
  arithmetic between two Moon positions. It measures agreement between two lists, not
  between two people. The site shows it as history."
- Every page carries the no-validity note **once**, in a fixed position (§4.4), so blocks
  don't stutter it.

### 4.4 The standing honesty note (de-duplication rule)
Today the note is repeated ad hoc per panel. New rule: one `.honesty-standing` strip renders
directly under the FIRST explain-block on a page ("Astrology has no demonstrated validity;
everything below describes what the historical system computes — study, not guidance."),
and individual plain-words blocks add domain-specific caveats only (kūṭa, remedies,
abhichāra). Engine-test asserts exactly one standing note per tool page.

---

# 5. Hover/tap glossary wiring (fixes F-TABLE-GLOSS, F-NAV-AWAY, F-TITLE-ONLY)

The data already exists: `core/data/glossary.js`, **247 terms**, each `{term, cat, def, see}`.
The linker already exists: `app/autolink.js` (first-mention-per-pass, skips tables). Build:

### 5.1 `assets/js/app/glosstip.js` (app, DOM) — the popover layer
- One event-delegated listener on `document` for `.gloss-link` (and the new `.term-chip`,
  below): **hover/focus** shows a popover after 150 ms; **tap/click** toggles it (and
  `preventDefault`s the navigation on first tap — the popover itself contains
  "full glossary entry ↗" preserving the old behaviour); **Esc** closes; focus is not
  trapped (it's a tooltip-pattern, `role="tooltip"`, `aria-describedby` wiring).
- Content: term (bold), `cat` as a small chip, `def`, `see` link if present. Max-width 34ch,
  positioned by simple flip logic (above if no room below); `position:fixed` so it escapes
  `.table-scroll` overflow clipping — **this is why tables can now be linked safely.**
- Reduced-motion: no fade, instant show/hide. Print: popovers never print.
- Build the def lookup from GLOSSARY once (`slugTerm` already exported by autolink.js —
  reuse, don't duplicate).

### 5.2 Autolink extension
- New third entry point `autolinkTables(roots)`: walks `td` text nodes ONLY for a curated
  allowlist of table-safe terms (peregrine, combust, cazimi, partile, retrograde, applying,
  separating, void of course, nakṣatra names NOT — too many), marks with class
  `gloss-link gloss-link--quiet` (dotted underline, `--text-muted`), max one per column per
  table to keep tables calm. Opt-in per panel via existing panel-id lists.
- **Term-chips for column headers:** every `<th>` whose label is jargon gets a
  `<button class="term-chip" data-term="…">ⓘ</button>` appended by the renderer (not the
  autolinker — headers are static strings in each renderer, so this is a mechanical edit
  per renderer). The chip opens the same glosstip. This is the fix for "Ho./Speed/Dignity",
  "Rūpas/Iṣṭa/Kaṣṭa", "T/Y/K/N", "L1/L2", "Sub-lord", "Guṇa"…
- New glossary entries needed (add to `core/data/glossary.js`, cited): ~40 terms currently
  used but missing or Vedic/Tājika-only (muntha, ithasala, kambūla, saham, rūpa, ṣaḍbala,
  aṣṭakavarga/SAV, vimśottarī, antardaśā, tithi, karaṇa, kāla names, porutham, guṇa, KP
  sub-lord, loosing of the bond, distribution years, Naibod arc, nuclear hexagram, Judge/
  Witnesses, elemental dignities, sephira, gematria…). Each with `def` in plain words and
  `see` to its wing. **Run the accuracy-check skill for any contested definition.**

### 5.3 Replace every load-bearing `title=` (F-TITLE-ONLY)
Mechanical sweep: ZR pills, moments chips, muhūrta stars/flags, aspect table hints → move
the text into glosstip popovers (for terms) or visible `.small.muted` text (for data like
date ranges). `title=` may remain as a redundant extra, never the only channel.

---

# 6. "Read this chart aloud" — the narrative order

A new, shared **narrate mode** turns each figure into a guided reading — the layperson's
on-ramp and the screen-reader story (Datawrapper's numbered-annotation fallback pattern).

### 6.1 `assets/js/core/explain/narrate.js` (pure)
`narrateChart(reading) -> [{n, title, text, targets:[selector-hints]}]` — canonical Western
wheel order (each step cites its book anchor):
1. **The frame** — "East is on the left. The heavy line to the left is the Ascendant:
   {label} was rising at {place}." (CA Bk I)
2. **Day or night** — sect, the Sun's hemisphere.
3. **The angles** — MC/IC/DSC in one sentence.
4. **The Moon first** (Lilly's horary habit) — sign, house, next application, VOC if so.
5. **The strongest and the weakest** — dignity extremes (from `explain/dignities.js`).
6. **The tightest aspects** — top 3 by orb, applying/separating in words.
7. **The verdict** — chart-health, one sentence, why.
8. **The honest close** — the standing note.

Per-tool variants: horary (querent → quesited → perfection → timing → judgement), nativity
(temperament → LoG → topics), Vedic (lagna → Moon-nakṣatra → daśā → strongest graha by
ṣaḍbala → yogas), tarot (position order of the spread), geomancy (mothers → judge),
timelords (which period now in each of the three systems), synastry (strongest 3 contacts
→ overlays), kabbalah (pillars → triads → flash).

### 6.2 `assets/js/app/narrate.js` (app, DOM)
- Renders the steps as an ordered list in a `.narrate-rail` beside/below the figure
  ("🔊 Read this chart aloud" toggle button; metaphorical "aloud" — no TTS in v1; the list
  IS the aloud script. Optional stretch: `speechSynthesis` behind a click, muted by default).
- Hover/focus a step → the corresponding wheel elements get `.narrate-lit` (raised opacity,
  others dimmed to 0.35 — opacity only, reduced-motion safe). Requires chart.js to stamp
  `data-el="planet-Sun" data-el="cusp-1" data-el="aspect-Sun-Moon-Trine"` on its groups —
  a small, non-breaking addition (~15 lines).
- Mobile/print: the numbered list below the figure, no highlighting (Datawrapper fallback).
- The same step array is serialized into the reading JSON (`reading.narration`) → the AI
  assistant and the Markdown export inherit the narrative order for free.

---

# 7. Chart-by-chart plan (what Opus codes, element by element)

Efforts: **S** ≤ ½ day, **M** ≈ 1 day, **L** ≥ 2 days (Opus-coder days incl. tests).

| # | Output | Upgrades | Effort |
|---|--------|----------|--------|
| 7.1 | **Wheel** (`core/chart.js` + 5 host pages) | (a) `data-el` stamps; (b) `.figure-legend` under every wheel: aspect colours (soft/hard/conj), dashed=separating, ℞, elemental wash key, gold=angles — one shared `wheelLegend()` in explain-block.js; (c) click-to-inspect: clicking a planet/cusp/aspect opens a small inspector card (kabbalah pattern) with position, dignity rows, aspects of that body, glossary chips — data read from the existing reading object, no recompute; (d) narrate mode (§6). | **L** |
| 7.2 | **Workbench panels** (`workbench.js`) | Wrap all ten panels in explain-blocks; term-chips on all table headers; scale anchors (dignity, election score); autolinkTables on moment/dignities/lots; link each panel header to its `interpret.html` section (`#wb-moment` → `interpret.html#moment`, add anchors there); narrate rail on the wheel card; standing honesty strip. | **L** |
| 7.3 | **Horary master** (`horary.js`) | Explain-blocks; **the judgement sentence**: new `explain/horary.js` assembles "Testimonies for: …; against: …; the tradition's answer here is {yes/no/unclear} — {reason}" with Lilly citation, tone-matched to the verdict banner; timing translated ("{n} units × {house/sign scale} → Lilly would guess {n} {days/weeks/months}", flagged as his estimate); querent/quesited glosstips; narrate variant. | **M** |
| 7.4 | **Nativity** (`book3.js`, `book3-master.js`) | Explain-blocks; temperament tally table shown (the addition is already computed — render the counts); Lord-of-Geniture plain sentence; surface `natal-topics` house topics in the master report; narrate variant. | **M** |
| 7.5 | **Vedic panel + page** (`vedic-panel.js` + new `core/vedic-chart.js`) | **New figure:** `core/vedic-chart.js` (pure, returns SVG strings) with `northIndianChart(rashiPlacements)` (fixed diamond, houses fixed, signs numbered) and `southIndianChart(...)` (fixed signs, lagna marked ↖) — style toggle persisted in localStorage; used for D1 and any varga via a picker (D1/D9 first; more vargas only if `core/vedic.js` already computes them — do NOT add varga math in this round); replaces the glyph-string navamsa line; SAV rendered as a 12-cell bar row (pure SVG string) with the ≥28 line marked; explain-blocks per section (ṣaḍbala "what a rūpa is", pañcāṅga limb-by-limb chips); keep+re-anchor the existing Conclusions as the plain-words layer. Engine-test: both renderers produce valid SVG for reference charts; placement invariants (lagna house 1 contains lagna sign). | **L** |
| 7.6 | **Divisional picker** | Part of 7.5: `<select>` D1/D9 over the same renderer; each varga's traditional domain stated in Layer (ii) with BPHS citation. | **S** (inside 7.5) |
| 7.7 | **Timelords** (`timelords.js` + new `core/timeline-svg.js`) | **New shared figure:** `core/timeline-svg.js` (pure string SVG): horizontal period strip — lanes of coloured segments (DS2 `--dg-*` per lord), "now" rule, labels, `data-el` stamps; render one strip per technique above its existing table (firdāriā majors+subs two-lane; ZR L1/L2 two-lane ×2 lots; progressions get no strip); `.hl-row` replaces HL; ZR pill titles → visible date ranges in the table + glosstips for "loosing"; explain-blocks (plain words: "You are in the {lord} major period ({y1}–{y2}); within it the {lord} sub until {date} — in this system, THAT pair colours the years."); narrate variant. | **L** |
| 7.8 | **Transits** (`transits.js`) | Month-density strip reusing `timeline-svg.js` (one lane per transiting body, a tick per exact hit, "now" rule) linked to table rows via `data-el`; `.hl-row` + visible "time-lord activated" chip (not inline style); pass-structure glosstip; explain-block over the snapshot ("{n} contacts in force; the closest is …"); lunar-returns plain words. | **M** |
| 7.9 | **Synastry** (`synastry.js`) | Keep the grid as Layer (i) but add a **"strongest contacts" ranked list** above it (top 5 by orb, each in words: "Her Moon trine his Sun (orb 1.2°) — the tradition's classic concord testimony (Lilly CA…; Jung's null 1952 experiment counted exactly these)"); overlay tables get plain-words intro; grid cells get glosstip aspect glyphs; sensitive-domain plain-words contract (§4.3). | **M** |
| 7.10 | **Election + Now** (`election-tool.js`, `now.js`) | Explain-blocks; score anchor line ("scores typically run −20…+20 here; ≥+5 with no gate failures is what the tool calls green"— derive the real range from `election.js` weights, don't guess); gating ALWAYS rendered (pass state too: "no hard requirement failed"); ranked-aims table term-chips; Now dashboard gets one plain-words strip ("The hour belongs to {ruler}; the tradition would call this hour fit for {top aim} and unfit for {bottom}"). | **M** |
| 7.11 | **Muhūrta** (`muhurta.js`) | Slot grid: glosstips on every muhūrta name + kāla; explain-block: plain words name the next auspicious window in local time; ⚑ contested flags become glosstips carrying both positions verbatim. | **S** |
| 7.12 | **Tājika** (`tajika.js`) | Term-chips + glosstips over the ~15 Tājika terms (new glossary entries, cited to the Tājikanīlakaṇṭhī trans.); explain-blocks: year-lord candidates in plain words ("Five candidates are weighed; {p} wins because …"); muntha sentence; contested year-lord rules both ways. | **M** |
| 7.13 | **Praśna/KP** (`prasna.js`) | Explain-blocks; each testimony keeps its citation and gains a plain rendering (already close — mostly wrapping); KP number picker gets a "what the 249 sub-arcs are" Layer (ii); judgement synthesis sentence mirroring 7.3. | **M** |
| 7.14 | **Kūṭa** (`kuta.js`) | The fixed "what this number is not" line pinned to the 36-guṇa total (§4.3); glosstips per kūṭa row; both-ways 5-9 contradiction stays verbatim; NO ai-prompt preset changes (sensitive domain: assistant keeps existing guardrails). | **S** |
| 7.15 | **Tithi-praveśa** (`tithi-pravesha.js`) | Explain-block; solar/soli-lunar dispute in Layer (ii); plain words for "your tithi birthday this year falls {date}". | **S** |
| 7.16 | **Tarot** (`tarot.js`) | Layer (ii) is the star: show the **elemental-dignity algebra** between neighbours as a small computed list ("Cups weakens Wands neighbour…" GD citation); position-meaning glosstips on the board; plain-words spread summary exists via AI — add a tiny static one (counts: majors/minors, suit balance, reversals). | **M** |
| 7.17 | **I Ching** (`iching.js`) | Show the derivations: line-by-line "6/7/8/9" table → why each moving line moves; nuclear hexagram derivation drawn (lines 2-3-4 / 3-4-5 bracketed in the figure); glosstips (trigram names); plain-words: "Primary {n} {name}; lines {…} move → relating {n}." | **M** |
| 7.18 | **Runes** (`runes.js`) | Already the honesty exemplar; add glosstips (ætt, stave), Layer (ii) on the poem provenance per rune (which of the three poems attests it), narrate order = draw order. | **S** |
| 7.19 | **Geomancy** (`geomancy.js`) | Layer (ii): the **derivation shown** — mothers→daughters (transposition) and XOR additions drawn as a little diagram (pure SVG string builder in `core/geomancy.js` territory → new `core/explain/geomancy-figure.js`); judge/witnesses plain sentence; house-judgement rows keep citations. | **M** |
| 7.20 | **Kabbalah tree** (`kabbalah.js`) | Add narrate mode (pillars → triads → lightning flash, cited); inspector panels gain plain-words paragraph + glosstips; font sizes to relative units; legend for node/path colour coding. | **M** |
| 7.21 | **Moment scanner** (`moments.js`) | Replace T/Y/K/N title-hovers: the legend line becomes a `.figure-legend`; each chip gets a glosstip with the running limb name + verdict + why; new "what changed here" cell — the compressor already knows which field flipped (diff `sigOf` parts): render "☾→{muhūrta}" style change markers; explain-block above the table. | **M** |
| 7.22 | **Confluence drawer** (`confluence.js`) | Adopt explain-block inside the drawer's technique section; glosstips; nothing else — it is already the pattern. | **S** |
| 7.23 | **Cycles / Trajectory / Jung / Handcalc / Kamea / Rasa** | Standard retrofit only: explain-blocks + term-chips + glosstips + `.hl-row`; trajectory's profection table gets the §7.7 strip (reuse). | **M** (sum) |

---

# 8. AI assistant vs static text — the boundary, per hook

**Static (computed, no model):** everything deterministic — all Layer (iii) plain-words
modules, judgement assembly sentences, scale anchors, legends, narrate scripts. Rationale:
offline-first, verifiable, engine-testable, zero key required. **The plain-words layer must
never require a key.**

**AI (existing panels, BYOK, explicit click):**
- Cross-system synthesis (workbench Interpret preset) — synthesis across rulebooks is
  exactly what static templates can't do honestly.
- Free-form Q&A about a computed reading ("why is Saturn peregrine here?") — the glosstip
  answers the what; the assistant answers the why-in-this-chart.
- Per-element "✶ explain this" (already in oracles) — EXTEND to the wheel inspector (7.1c)
  and every explain-block header: a small ✶ button that prefills the page's existing
  divination-assistant with "Explain the {block} above in plain terms" — uses the existing
  `prefill(text)` contract in `divination-assistant.js`. Where a page has no assistant
  (handcalc by design, rasa by design), no ✶ button.
- New context builders needed in `core/llm-context.js`: `buildSynastryContext`,
  `buildKutaContext` (with the sensitive-domain preamble), `buildVedicContext` (the panel
  currently has none), `buildTransitsContext` exists? (transits page already wires
  `initDivinationAssistant({kind:'transits'})` — verify the kind exists in CTX; the CTX map
  read shows timelords/prasna/muhurta/tajika/cycles/confluence + oracles; **transits kind
  must be added or the wiring is dead** — coder: check and fix).
- `reading.narration` (§6.2) is appended to every context so the model narrates in the
  site's canonical order.

---

# 9. Build order (phases, each ends with the verify-site gate)

1. **P1 — Foundations (no visual change yet):** `explain-block.js` + CSS components +
  `.hl-row` sweep + `glosstip.js` + autolink table extension + ~40 glossary entries
  (accuracy-check contested ones) + `core/explain/` skeleton with moment/dignities/aspects +
  engine tests. *(≈3 days)*
2. **P2 — The flagship three:** Workbench (7.2), Wheel (7.1), Horary (7.3). Interpret.html
  anchors. Narrate v1 (wheel + horary). *(≈4 days)*
3. **P3 — The Vedic figure:** 7.5/7.6 rāśi charts + SAV bar + panel retrofit. *(≈3 days)*
4. **P4 — Time:** `timeline-svg.js`, timelords (7.7), transits (7.8), trajectory strip. *(≈3 days)*
5. **P5 — Pairs & questions:** synastry, kūṭa, tājika, praśna, tithi-praveśa, election/now,
  muhūrta, moments. *(≈4 days)*
6. **P6 — Oracles & trees:** tarot, iching, runes, geomancy, kabbalah, confluence, rest of
  7.23; AI context builders + ✶ buttons sweep. *(≈3 days)*

Per-phase gates (add to `scripts/engine-test.mjs`): every explain module returns non-empty
cited text on reference vectors; exactly one standing honesty note per tool page; every
glossary slug referenced by a term-chip exists; SVG-string renderers parse as XML; registry
entries for `explain/*`, `vedic-chart`, `timeline-svg` resolve. Browser sweep: glosstip
opens/closes by keyboard on every page; zero console errors (existing verify-site skill).

---

# 10. Risks & open questions

- **Text volume drift vs honesty:** plain-words templates can slip into horoscope voice.
  Mitigation: the §4.3 banned-phrase list enforced by an engine test (grep the generated
  text for "you will", "your destiny", "this means you are").
- **Popover a11y is easy to get wrong:** tooltip-vs-toggletip semantics differ
  (hover-tooltip on links, click-toggletip on ⓘ chips). Follow the two patterns strictly;
  test with keyboard in the Chromium sweep.
- **Autolinking inside tables** may still over-link; the allowlist + one-per-column cap is
  a guess — revisit after P2 dogfooding.
- **North/South Indian chart correctness** (house/sign placement conventions, lagna marking)
  is contested-adjacent: verify against JHora screenshots + BPHS conventions via the
  accuracy-check skill before coding; add reference-vector tests.
- **Score anchoring must be derived, not asserted** (election score ranges from
  `election.js` weights; dignity ranges from `dignities.js`) — hard-coded ranges would
  drift. Small pure helpers to compute the theoretical min/max.
- **transits assistant kind** possibly unwired (see §8) — verify early.
- **Scope creep in vargas:** only render what `core/vedic.js` already computes; new varga
  math is a different round.
- **Performance:** glosstip delegation is O(1); narrate highlighting touches ≤ 40 SVG nodes;
  timeline strips are static strings — no risk expected, but the moments scanner page should
  skip autolinkTables on its (large) table.

---

# Appendix A — Element-level notes for the coder (quick reference)

- Panel IDs (existing, keep): workbench `wb-*`; horary `h-*`; nativity `n-*`; timelords
  `tl-prog/tl-fird/tl-zr`; transits `tx-*`; moments `mo-out`; vedic `v-out`; prasna/tajika/
  kuta/tithi per their files.
- `esc()` helpers are duplicated in every app file — do NOT centralize in this round
  (orthogonal cleanup); explain-block.js gets its own.
- `regLinks()` in workbench.js is the model for Layer-(ii) header links; explain-block should
  accept the same string.
- The Vedic conclusions builder lives in `core/vedic.js` (`v.conclusions.sections[]` +
  `.conclusion`) — the factoring target for `explain/vedic.js`.
- `VERDICT_LEGEND` (shared.js) already exists for verdict badges — reuse under every verdict,
  don't re-explain.
- Glossary term "Verdict (green/amber/red)" already disambiguates severity-red vs Mars-red —
  glosstip it wherever a verdict badge renders.

# Appendix B — Research sources
- TimePassages point-and-click interpretations: https://astrograph.com/astrology-software · https://astrograph.com/timepassages/basic
- Astrodienst layering & AstroClick: https://www.astro.com/index_e.htm · http://www.astro.com/cgi/aclch.cgi?btyp=acm
- Astro-Seek beginner guides beside dense tables: https://horoscopes.astro-seek.com/beginners-guide-to-astrology-search-tools · https://www.astro-seek.com/
- Jagannatha Hora feature density: https://www.vedicastrologer.org/jh/features.htm · https://github.com/naturalstupid/PyJHora
- Shneiderman, "The Eyes Have It" (1996): https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf · https://visguides.org/t/visual-information-seeking-mantra/241
- Datawrapper annotation practice: https://www.datawrapper.de/academy/how-to-create-text-annotations · https://www.datawrapper.de/blog/better-more-responsive-annotations-in-datawrapper-data-visualizations · https://www.datawrapper.de/blog/text-in-data-visualizations
