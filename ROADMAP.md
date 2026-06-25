# ROADMAP — execution plan (reconciled handoffs)

This is the **authoritative, ordered execution plan**. It reconciles the two parallel handoffs
and sequences the work to the maintainer's stated priority:

> **Complete the entire literature and tools first → organize and link everything → then examples.**

Read with: `HANDOFF.md` (environment + architecture + ship procedure — *environment truth*),
`research/SOURCE-DATA.md` (the cited data to encode + accuracy caveats), `MASTER-PLAN.md`
(the long-form Lilly × Picatrix vision). Skills in `.claude/skills/` automate the gates.

> **Locked decisions (maintainer, this session):**
> 1. **Framing = historical, described not prescribed.** All Picatrix/magical material is
>    presented as documented medieval/Renaissance practice with the honest-science note;
>    describe recipes/spirits/suffumigations but never instruct; flag toxic/illegal historical
>    substances without recommending. (Matches the site's existing tone.)
> 2. **Execution order = literature/data first**, exactly as the phases below (Phase 1 before the
>    Election Engine). Do **not** jump ahead to Phase 2A.

---

## 0. Reconciliation of the two handoffs (read once)

Two handoffs exist. They agree on the vision; they **disagree on the environment**. Use this:

| Topic | Stale note (other handoff, written on Phase A) | **Truth in THIS container (verified)** |
|---|---|---|
| Push | "`git push` returns 403; must bundle" | **`git push origin main` WORKS** (used it; remote `main` = our work). Try direct push first; bundle only if it ever fails. |
| Browser verify | Playwright at `/opt/pw-browsers/chromium-1194/...` | **That path does not exist.** Use **puppeteer** at `~/.cache/puppeteer/chrome/linux-150.*/chrome-linux64/chrome` with apt libs (`libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libnss3 libpango-1.0-0 libcairo2 libasound2t64 …`). The `verify-site` skill encodes this. |
| Server port | 8099 (varies) | **8003** is the running convention here. |
| Already built | lists Phase A/B | **Plus** (this lineage): `core/cautions.js`, the Master-Tool **Cautions panel**, `pages/tools.html`, `pages/workflow.html`. Don't rebuild. |
| Commit signing | impossible; unsigned is cosmetic | Same — **do not churn SHAs** to fix the "Unverified" badge. |

**Net:** follow the *forward plan* and *research data* from the other handoff, but the
*environment/ship mechanics* from `HANDOFF.md` + this table.

**Also unify the docs (Phase 0 task):** there are now two `HANDOFF.md` lineages and several
plan files. Phase 0 consolidates to: `ROADMAP.md` (this, the plan) · `HANDOFF.md` (env/arch +
ship) · `research/SOURCE-DATA.md` (data) · `MASTER-PLAN.md` (vision) · `PLAN.md` (original,
archival). Cross-link them; delete nothing without noting it.

---

## 1. Definition of done & the universal CHECK gate

**Every phase ends by running the `verify-site` skill**, which must report:
- **0 console errors / pageerrors / failed requests** on *every* `*.html` (real Chromium).
- Header/footer chrome injected on every page (`header.site` present).
- **0 broken internal links / ES-module imports** (static audit).
- The **engine headless test** passes (equinox Sun ≈ 0° Aries; `Saturn in Gemini → Belly`;
  `Moon in Aries → Head & knees`; cautions verdict computes).
- For any new **data module**: its headless **data test** passes (counts, boundary math,
  precession sanity, every record has a `source`).

A phase is **not done** until the gate is green and the increment is committed (and pushed or
bundled). No "looks fine" — verify in the browser, every time.

---

## 2. Accuracy mandate (the maintainer's emphasis)

1. **Verify every number** against ≥2 cited sources; store the citation *in the data record*.
2. **Flag discrepancies in-data** (as `degree-tables.js` already does); never silently pick one.
3. **Compute, don't snapshot** time-varying values (fixed-star longitudes → live precession).
4. Use the `accuracy-check` skill before encoding any contested value (Behenian natures, decan
   variants, mansion uses, pitted/azimene degrees).
5. Keep the **honest-science framing** on everything interpretive; describe historical magical
   practice, never instruct; note toxic/illegal historical substances without recommending.

---

## PHASE 0 — Reconcile, preserve, tool up  *(this planning turn)*
**Goal:** a clean, documented base and the automation to move fast safely.
- [x] Inspect & diff the handoff bundle; extract its research data + forward plan.
- [x] Accuracy-validate the riskiest data (web) → `research/SOURCE-DATA.md` §0.
- [x] Preserve embedded data → `research/SOURCE-DATA.md`.
- [x] Write this `ROADMAP.md`.
- [ ] Create skills: `verify-site`, `add-data-module`, `ship-bundle`, `accuracy-check`.
- [ ] Reconcile `HANDOFF.md` (point to ROADMAP + SOURCE-DATA; supersede stale env notes).
**Check:** `verify-site` green (no code changed, so just confirms baseline + new docs link-clean).
**Ship:** commit + push planning artifacts; **pause for maintainer go-ahead before Phase 1.**

---

## PHASE 1 — Complete the LITERATURE (content + data)  *(do first, per maintainer)*
**Goal:** every book's reference material complete and every Picatrix dataset encoded & cited.
Build order within the phase: **data module → reference page → cross-links**.

### 1A. Picatrix & fixed-star data modules (`assets/js/core/data/`)
- `lunar-mansions.js` — 28 mansions (SOURCE-DATA §1): number, tropical start/end, canonical
  name + aliases, indicator star(s), Agrippa use, Picatrix expansion, `source`. Helper
  `mansionOf(moonLon)`.
- `behenian-stars.js` — 15 stars (SOURCE-DATA §3): name, **J2000 longitude**, nature(+source),
  stone, plant, use, `source`. Live **`behenianLongitude(name, date)`** via precession
  (~50.29″/yr). Alkaid canonical; Fomalhaut behind a `modern:true` flag. `starsInAspect(chart, orb)`.
- `decan-faces.js` — 36 faces: reuse `FACES` rulers; add Agrippa II.37 image + Picatrix II.11
  image (flag the ~6 variants), `source`. Helper `faceOf(lon)` (image + ruler).
- `planetary-magic.js` — per planet (SOURCE-DATA §4): governed petitions, suffumigation, colour,
  metal, stone, and the **three spirit-name systems kept separate**, `source`.
**Check:** headless data tests — 28/15/36/7 record counts; `mansionOf` boundaries
(0°→1, 12.857°→2, 359.9°→28); a Behenian longitude precessed to 2020 matches the table ±0.2°;
every record has `source`. Then `verify-site`.

### 1B. Picatrix reference pages (`pages/picatrix/`)
- `index.html` (the four books mapped + honest framing) and browsable pages for **mansions**,
  **decan faces**, **Behenian stars**, **planetary correspondences** — each a sortable/lookup
  table rendered from the data modules, cross-linked to the Glossary and the relevant Lilly tool.
- Add a "where is the Moon's mansion **now**?" and "which Behenian stars are active **now**?"
  read-out (pure display; the live dashboard comes in Phase 2).
**Check:** `verify-site`; every new page in nav/hubs; tables populate from the modules.

### 1C. Close the remaining Lilly-literature gaps
- Verify & finalize the **pitted/azimene/fortune** degree lists in `degree-tables.js` (currently
  flagged "verify") with the `accuracy-check` skill; fill the four blank fortune-degree signs.
- Audit Books I–III pages for any chapter concept named in `MASTER-PLAN.md` but not yet on a page;
  add the missing reference prose (still no examples yet — that's Phase 4).
**Check:** `verify-site`; degree-table tests updated; provenance comments added.

**Phase-1 exit:** all literature + all data modules exist, cited, verified, reachable.

---

## PHASE 2 — Complete the TOOLS (engine + calculators)
**Goal:** every computational tool the project promises, built on the existing engine + new data.

### 2A. The Election Engine (`assets/js/core/election.js`) — the Lilly↔Picatrix bridge
- Pure module: `electionScore(chart, operation, opts) → {verdict:'green|amber|red', score, reasons[], cautions[]}`
  encoding SOURCE-DATA §5. **Reuse `cautions.js` + `dignities.js` + `planetary-hours.js` +
  `lunar-mansions.js`; do not duplicate.** Add the **Moon-dispositor** test and the
  **configurable via-combusta + Spica exception**.
- `findNextElection(operation, fromDate, hoursAhead)` → ranked upcoming windows.
**Check:** headless tests — a known-good Venus-hour waxing-Moon moment scores higher than a
VoC/combust moment; finder returns windows in chronological order; malefic-work inversion flips
the verdict. Then `verify-site`.

### 2B. Election page + the **Live "Right Now" dashboard** (`pages/now.html` + `app/now.js`)
- A dedicated election page (pick an aim + time window → ranked windows + the full caution list).
- The auto-refreshing (30–60 s) dashboard (HANDOFF §6.1): the hour & day; **the Moon now**
  (sign, **mansion + uses**, phase, speed, VoC, via combusta, next application); a **ranked
  "good to do now"** list over ~10 aims; **cautions active now**; planet strengths now;
  **Behenian contacts now**; optional **personalized** layer from `localStorage` birth data
  (annual profection + Lord of the Year, natal almuten, notable transits). Prominent honest note.
**Check:** `verify-site` (incl. the auto-refresh doesn't leak errors); dashboard renders with no
saved birth data and with a sample saved; numbers cross-checked against the Master Tool for the
same instant.

### 2C. Book II & III master tools, then the **Unified Master Tool**
- **Book II master tool:** horary super-view (any quesited house; all modes of perfection;
  timing; considerations; antiscia; the Moon's story) — wraps `perfection.js` + `cautions.js`.
- **Book III master tool:** nativity super-view — hyleg/alcocoden finder, Lord of the Geniture,
  temperament, **annual profection + Lord of the Year**, primary-direction & solar-return
  overview. (Build the missing engine bits: `profections.js`, `directions.js` (Naibod),
  `solar-return.js`, `hyleg.js` — each pure + headless-tested.)
- **Unified Master Tool** (`pages/master.html`): one input → all three books' readings + the
  election layer + all cautions + the live-tracker panel, fully cross-linked.
**Check:** `verify-site`; each engine module headless-tested; unified tool matches the individual
tools for the same input.

**Phase-2 exit:** every tool in `MASTER-PLAN.md` exists and is verified.

---

## PHASE 3 — ORGANIZE & LINK everything
**Goal:** nothing orphaned; every term, page and tool discoverable and cross-linked.
- **Glossary:** add all Picatrix/election terms (mansion, decan/face, Behenian, suffumigation,
  Perfect Nature, the spirit systems, election, profection, hyleg, alcocoden, direction) so
  auto-linking covers them.
- **Hover-cards:** planets/signs/stars/mansions show a linked detail popup wherever named.
- **Navigation:** update nav, the Tools hub, the Workflow chapter-map, and the Master Index to
  include every new page; consistent breadcrumbs; ensure **every page is reachable in ≤2 clicks**.
- **A11y & polish:** ARIA roles, keyboard nav, contrast pass, a **print stylesheet**, and
  **save/share** charts via URL params + **SVG/PNG export**.
**Check:** link-integrity audit = 0 broken; a crawl confirms every `*.html` is linked from nav or
a hub; `verify-site`; a basic a11y assertion (landmarks present, images have alt/aria).

**Phase-3 exit:** the site is a single, fully cross-indexed body — "organized and linked."

---

## PHASE 4 — EXAMPLES (last, per maintainer)
**Goal:** demonstrate every concept with **live, computed, verifiable** results — not prose.
- **Reusable "computed example" component** (`app/example.js`): casts a real chart and renders the
  engine's output inline, so each concept shows live numbers. Standardize on it.
- Apply to concept pages: dignity (live almuten), aspects (live applying/separating), perfection
  (live translation/collection), election (live ranked windows), mansions/faces/stars.
- **Reproduce Lilly's own worked charts as LIVE figures**: the Ship at Sea (Dec 1644, Gemini
  rising), the Stolen Fish, the Marriage — cast from the historical data, draw the wheel, and
  annotate Lilly's reasoning over the *computed* chart. **Verify computed positions against
  Lilly's printed figures within tolerance; note any divergence.**
- **Picatrix election worked examples:** e.g. "elect a Venus talisman for concord" → show the
  engine choosing a window + the correspondences, all flagged historical.
**Check:** each example **recomputes live** (no hardcoded results); Lilly-chart positions match
his text within stated tolerance; `verify-site`.

**Phase-4 exit:** every major concept has a live worked example; the project is feature-complete
against `MASTER-PLAN.md`.

---

## PHASE 5 — Final QA, docs, ship
- Full `verify-site`; spot-check ~10 numbers against external references; a11y + print pass.
- Refresh `README.md`, `MASTER-PLAN.md` status, `HANDOFF.md`, this `ROADMAP.md`.
- Final commit; push to `main` (Pages deploys); produce a clean bundle via `ship-bundle` as a
  portable fallback.

---

## 3. Dependency order (what blocks what)

```
Phase 0 (docs+skills)
   └─> Phase 1 data modules ──┬─> Phase 1 Picatrix pages
                              └─> Phase 2A election.js ──> 2B now.html / election page
   Phase 1C (Lilly gaps)                              └─> 2C master tools ──> unified master
   Phase 2 (all tools) ──> Phase 3 (link/organize) ──> Phase 4 (examples) ──> Phase 5 (ship)
```
Rule of thumb: **a page never ships before the data/engine it renders is headless-tested.**

## 4. Risks & mitigations
- **Data inaccuracy** → the accuracy mandate (§2) + `accuracy-check` skill + in-data provenance.
- **Bundle/merge pain for the next model** → `ship-bundle` builds from `origin/main`; never amend
  shared commits (HANDOFF §5).
- **Scope creep / "perfect chart"** → election ranks, never demands perfection; phases gated.
- **Browser drift** → `verify-site` pins the puppeteer Chromium path + apt libs.
- **Honest-science integrity** → disclaimers stay; magic is framed historically throughout.

---

## STATUS (as built) — Phases 0–2 complete
- **Phase 0** ✅ reconcile/preserve/skills. **Phase 1** ✅ Picatrix data + reference pages.
- **Phase 2A/2B** ✅ Election Engine + Election tool + Right-Now (best-vs-least). **Phase 2C** ✅
  natal engine (profections/hyleg/directions/solar-return) + Book III Master + Unified Master Tool.
- Linking done incrementally (nav/footer/hubs). See `COVERAGE.md` for the full audit.
- **Remaining:** Phase T (talisman workflow — next), Phase 4 (live worked examples), Phase 3 polish
  (a11y/print/share/export), accuracy finishing (flagged degrees, mansion images).

---

## PHASE T — The Talisman track (next)
**Goal:** turn the reference + election layers into a **guided, step-by-step talisman workflow**
that ends in a concrete, historically-sourced **recipe card** — presented strictly as the history
of a practice (described, never prescribed; toxic/illegal historical materials noted, not advised).

### T1 — `core/talisman.js` (pure, cited, headless-tested)
`talismanRecipe(chart, operationKey)` assembles, from engines already built:
- the **aim** and its ruling planet (`election.OPERATIONS`);
- the **election verdict** for this moment (`electionScore`) + the next best window (`findNextElection`);
- the planet's **correspondences** — suffumigation, colour, metal, stone, spirits (`planetary-magic`);
- the **Moon's mansion** + its use (`lunar-mansions`), the **decan face** + image (`decan-faces`),
  any **Behenian star** contact (`behenian-stars`);
- a **design note** (what figure/seal the tradition engraves) and the **timing** (planet's day & hour).
Returns `{ aim, planet, when, verdict, window, materials{…}, mansion, face, stars, design, steps[], citations[] }`.
**Check:** headless test — recipe has all sections, every section carries a citation, steps non-empty.

### T2 — `pages/picatrix/talisman.html` (+ `app/talisman.js`)
A wizard: **(1)** choose an aim → **(2)** confirm/he­lp-find the elected moment (reuses the Election
Engine + "find next window") → **(3)** the assembled **recipe card** (the end result): materials,
timing, mansion/face/star, design, and the numbered ritual steps, each cited, with the disclaimer.
"Print / save" the card (ties into Phase 3 export).
**Check:** `verify-site`; the card renders live for every aim; deep-links from Right-Now/Election.

### T3 — Worked example baked into the page (and `book2/examples`-style)
Ship one fully worked example as the default render + a static narrative:

> **Worked example — "A talisman of Venus for concord & friendship"**
> 1. **Aim:** love/concord → ruler **Venus** (Picatrix III, Venus).
> 2. **Elect the moment:** wait for the **day & hour of Venus**, the **Moon waxing** and **swift**,
>    **not** void-of-course and **not** in the via combusta (Spica exempt); Venus dignified and free of
>    Mars/Saturn; a benefic on an angle. The engine scans the next 72 h and returns the best window.
> 3. **Mansion/face/star:** prefer a **mansion of love/concord** (e.g. Mansion 13, *Al Awwa*); the
>    **decan face** ruled by Venus; **Spica** or **Sirius** conjunct Venus or the Moon if available.
> 4. **Materials (historical):** suffumigation of **aloes, musk & roses**; colour **white/green**;
>    metal **copper**; stone **emerald**; spirit names kept in their distinct systems
>    (Picatrix prayer-angel *Beyteyl*; Agrippa Angel **Haniel** / Intelligence **Hagiel** / Spirit **Kedemel**).
> 5. **Design:** engrave the image of Venus per Agrippa/Picatrix at the elected hour.
> **End result — the recipe card:** *"Venus talisman for concord — cast [elected date/time, place];
> Venus in [sign/dignity], Moon waxing in Mansion 13; copper, emerald, white garment, rose suffumigation;
> Haniel/Hagiel/Kedemel. Verdict: green."* (All historical; not a recommendation.)

**Check:** the example recomputes live (no hard-coded chart); numbers self-consistent with the Election tool.

### Phase-T exit: a maker can follow aim → election → materials → design → a cited recipe card, end to end.
