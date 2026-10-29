# Handoff notes — for the next model/build

## Six-member, three-round improvement pass — 29 October 2026

Continue on `feat/mobile-calendar-observatory`, extending baseline `3be3d46`. Read the [panel ledger](docs/2026-10-ensemble-panel.md), [verification](docs/2026-10-ensemble-verification.md), and five linked method/source reports before expanding claims. These are six AI-agent roles with bounded source reading; selected passages, source failures and unresolved authority questions remain explicit.

`core/comparison-evidence.js` recomputes the canonical context and explains frame offsets, circular residuals, shared lunar derivations and differing conventions. Its app component supports stale invalidation, lazy homepage mounting and same-observer focus preservation. It is included in comparison JSON/Markdown. Shared inputs are dependencies, not independent corroboration; exact partition boundaries retain the engine's floating-point qualification.

Recipe import validates bounded geometry and strict field types, never inserts supplied SVG, and labels imported provenance unverified. Private restoration requires explicit consent and a geometry match. AI packets independently recompute civil rows and rules; location and rule-evidence controls are separate and default off. The default minimal packet remains unchanged. Source MCP now has 14 tools including `workbench_explain_guidance`; hosted deployment/authentication and external inference are separate work.

Two-event study samples preserve source precision, acknowledged observer-local civil noon, actual UTC elapsed hours and shortest signed angular displacement. Event records/review dates were not refreshed by this comparison feature. Mobile tables use named keyboard scroll regions and overflow hints. Standards validation uses the canonical engine, with direct profile navigation, search recovery and stale-task clearing.

Direct civil conversion now checks both UTC and observer-local1900–2100 years. Selected Chinese2025 leap-sixth-month fixtures cite HKO and Taiwan CWA as distinct issuing authorities. Seven pending-family statuses remain unchanged. Edit `.claude/skills/observatory-source-contract/profiles.json` before regenerating profiles; never hand-edit generated profiles. The common specialist contract now covers imported provenance, strict schemas and source/table discrepancies.

Preserve all inherited gates. The new `scripts/browser-ensemble.mjs` exercises five workflows at320/390/1365px, validates actual downloads and binds its driver/product hashes. It is wired into Pages CI. Run it after final asset generation with `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium` when using this environment's installed browser. The `ensemble` evidence directory records this pass separately from prior releases. PR #5 remains a review branch; production publication still requires verified main.

## Symbolic studio and explainable almanac extension — 29 October 2026

Continue on `feat/mobile-calendar-observatory`; this work extends the previous review branch. New routes are `pages/sigil-studio.html`, `pages/world-events.html` and `pages/standards.html`. The older Live Symbol Studio and every existing calculator remain separate and intact.

`core/sigil-design.js` reuses the existing squares/symbol engines, provides deterministic geometry and source-labelled paper study recipes. Artwork from `image_gen` is in `assets/img/studio/`, separately identified from procedural SVG output. The optional `mcp/sigil-image-provider.mjs` is a standalone protected adapter, not a mounted MCP tool or live service; configure its model on the server and never insert provider keys into the static app.

`core/day-guidance.js` composes selected existing rule engines without their aggregate score. `app/day-guidance.js` exports `mountDayGuidance(container, comparisonOrInput)` with `update(null)` invalidation and `destroy()`. Hourly work is lazy, partitions real local civil days, and preserves repeated/absent clocks. Opening-portion yoga remains timing-unresolved. No fixed-star alignment is inferred; the displayed rules name what they actually use. Editorial reflection actions are distinct from source quotations. Homepage weekly links lose their href while inputs are stale and are restored only after a valid calculation.

World event dates retain precision, source status, coverage and review age. A local-noon chart requires explicit acknowledgement and an observer; it is not a poll-opening or outcome timestamp. Annual observances and conditional elections remain labelled. Rechecking a URL does not establish the event fact is still current.

Standards and specialist task contracts live in `core/data/observatory-standards.js` and `.claude/skills/`, with reusable agent templates. Keep generated profile outputs synchronized through their committed builder. Node checks are registered in `scripts/engine-test.mjs`; new mobile/export/privacy journeys run through `scripts/browser-studio-expansion.mjs`. Preserve all prior engine, audit, browser and MCP gates. Read the dated source, panel and verification documents linked in README before making stronger interpretation, coverage, deployment or AI claims.

## Calendar Observatory branch — 29 October 2026

Current development: `feat/mobile-calendar-observatory`, based on `5f030c0`.
The redesign preserves all 117 original application routes and adds
`pages/calendar-compare.html`. Read the new dated research, plan, AI, panel and
verification documents linked at the top of README before changing its methods.

The frontend remains a zero-build static ES-module site. Run from this checkout:

```bash
python3 -m http.server 8030 --bind 127.0.0.1
node scripts/engine-test.mjs
node scripts/audit.mjs
node scripts/round-ledger.mjs --check
npm ci --ignore-scripts --prefix mcp
npm test --prefix mcp
```

For browser gates use the existing Playwright installation, or the workflow's
pinned `playwright@1.58.2` with its Chromium. Run `scripts/browser-release.mjs`
and `scripts/browser-observatory.mjs`. Integration journeys additionally use
SkyLens commit `2b2aa089009db3ddedc2256a7a5456b402b23962` via `SKY_LENS_ROOT`;
do not substitute a moving branch and call it the pinned test.
Regenerate the source-backed catalogues with
`node scripts/build-mcp-catalogue.mjs` and `node scripts/build-search-index.mjs`
when their inputs change. The service worker version is bumped for this release;
its lifecycle fixture derives the current version while retaining obsolete-cache
and other-project preservation checks.

`calendar-observatory.js` owns pure, bounded same-instant comparisons and
1–14 local-date snapshots. `instant-boundary.js` isolates unchanged strict parsing;
`calculation-context.js` re-exports the prior public API. The homepage aligns its
two groups to Monday–Sunday using `observatory-schedule.js`. Live refresh reads
the actual unambiguous instant rather than re-resolving a repeated wall clock.
Dirty/frozen inputs suspend automatic updates and invalidate export/AI packets.
No timer runs while the site is closed, and no unattended cloud job is claimed.

All new symbolic quality rows are historical classifications, not active outcome
verdicts. Opening-portion yoga rules have `applicability: timing-unresolved`;
primary-text verification is incomplete, and modern secondary provenance and
citation flags must remain visible. Civil conversions do not infer sunset days,
observed crescents, festivals, personal births, or every culture's calendar.

The new ChatGPT flow previews/copies/exports a minimal source-labelled packet.
It makes no provider call, inherits no ChatGPT session, and excludes geographic
information by default. The source MCP now has 14 tools; the previously hosted
remote endpoint has not been redeployed or authenticated as part of this branch.
Do not claim its three added tools are remotely available until separately verified.
No Supabase connection is needed or present. Existing saved records and older
assistants retain their own documented formats and behaviour.

The branch and PR are review artifacts. The existing workflow publishes only
verified `main`; creating this branch does not replace the production website.
Retained historical handoff notes below refer to earlier releases.

This file is the **environment + architecture + ship-procedure** truth. For *what to build
next and in what order*, read **`ROADMAP.md`** (the reconciled, phased plan). For *the data to
encode and its accuracy caveats*, read **`research/SOURCE-DATA.md`**. The long-form vision is
`MASTER-PLAN.md`; `PLAN.md` is the original (archival).

> **Doc map:** `ROADMAP.md` = the plan (phases + gates) · this file = how the box works + how to
> ship · `research/SOURCE-DATA.md` = cited data + caveats · `MASTER-PLAN.md` = vision ·
> `.claude/skills/` = automation (`verify-site`, `add-data-module`, `ship-bundle`, `accuracy-check`).
>
> **Current environment evidence (2026-10-05):** the historical machine notes below are archival, not portable guarantees. Initial shell networking was unavailable; it was later enabled. Local Node, official MCP transports and Chromium checks now run successfully, with independent GitHub Actions release gates. Never expose credentials or assume a local source commit shares recovered remote ancestry. The remote/source tree match and live-studio release evidence are in `docs/2026-10-05-live-studio-roadmap.md` and the dated verification document.

---

## 1. What this repo is

An interactive, scientifically-honest study edition of **William Lilly's _Christian
Astrology_ (1647)**, with a **real, verified astronomical engine** that runs entirely in the
browser (no frontend build step). The optional `mcp/` backend is a separate process; Pages cannot execute it. The long-term target (see `MASTER-PLAN.md`) integrates
the **_Picatrix_** (astrological magic) via an **Election Engine** that reuses Lilly's
machinery. The geometry is genuine; the interpretations are Lilly's, framed as history.

## 2. Historical build snapshot (superseded by dated release documentation)

Done and **verified in a real browser (0 console errors on all 20 pages)**:

- **Core engine** (`assets/js/core/`): positions, 4 house systems, dignities (essential +
  accidental), almuten, aspects with Lilly's orbs, considerations, planetary hours,
  perfection (translation/collection/prohibition/refranation) + timing, degree tables.
- **New this build:**
  - `assets/js/core/cautions.js` — a single reusable **chart-health engine** combining
    Lilly's considerations + the Moon's electional condition + per-planet accidental
    afflictions (combust, retrograde, cadent, peregrine, besieged) into severity-tagged
    advisories and a green/amber/red **verdict**. This is the seed of the Election Engine.
  - **Master Tool** (`pages/book1/master.html` + `assets/js/app/book1-master.js`) now shows
    the full **Cautions & chart health** panel, per-planet afflictions, and the **ascending
    degree** read by the supplementary tables.
  - **`pages/tools.html`** — a hub linking every calculator + a "what each computes" table.
  - **`pages/workflow.html`** — the **chapter map**: every chapter of each book → concept →
    calculation → worked example → tool, plus the horary/nativity step-flows and the
    Picatrix bridge forward-map.
  - Navigation reworked in `assets/js/app/shared.js`: top nav is now
    `Home · Workflow · Book I · Book II · Book III · Tools · Glossary · About`. The Master
    Index (`pages/contents.html`) and Horary live in the footer + hubs.
  - CSS: advisory/verdict/flowmap/chip classes appended to `assets/css/style.css`.

Roadmap (not yet built) — Picatrix data modules, the Election Engine, Book II/III depth
tools (decumbiture, rectification, hyleg, profections, directions, solar returns), and the
unified master tool. Phases D–F in `MASTER-PLAN.md`.

## 3. Architecture you must respect

- **No build step.** Vanilla ES modules. Pages import from `assets/js/...` with relative
  paths. Shared chrome is injected by `assets/js/app/shared.js`, which computes the site
  root from its own URL (`import.meta.url`) so links work at any depth and under the GitHub
  Pages subpath. **Never hard-code absolute site paths.**
- **Engine is pure & headless-testable.** Everything in `assets/js/core/` (except `chart.js`,
  which touches the DOM) runs under Node directly — no DOM, no globals. Keep it that way:
  put DOM rendering in `assets/js/app/`, computation in `assets/js/core/`.
- **Data is sourced & flagged.** Tables live in `assets/js/core/data/`, transcribed from the
  1647 text with discrepancies noted in comments. Keep that discipline; cite in-file.
- **Reuse, don't duplicate.** `cautions.js` composes `considerations.js` + `dignities.js` +
  `aspects.js`. The Election Engine should compose `cautions.js` + planetary hours + the
  (future) mansion data — do not re-implement dignity/Moon logic.

## 4. How to run & verify (do this before every commit)

```bash
# serve
python3 -m http.server 8003      # → http://localhost:8003/index.html

# headless engine sanity (pure Node, no browser needed) — see section 6 for a template
node ./__enginetest.mjs

# full browser verification (install once, then reuse)
cd /tmp && npm i puppeteer && node node_modules/puppeteer/install.mjs
# then run the harness in section 6; it loads every page and fails on any console error
```

The browser harness must report **0 total errors** and `hdr✓` (chrome injected) on every
page. The engine test must print the equinox Sun at ~0° Aries and the body-part checks
(`Saturn in Gemini → Belly`, `Moon in Aries → Head & knees`).

## 5. How to ship so the bundle applies cleanly (IMPORTANT)

The maintainer applies your work as a **git bundle** that must fast-forward from the current
**remote `main` tip**. To avoid the conflicts that plagued earlier rounds:

1. Branch from the **current remote main** (`git fetch origin && git switch -c <branch> origin/main`).
2. Commit your work there.
3. Create the bundle against the **remote main tip** as the prerequisite:
   ```bash
   git bundle create update-phaseX.bundle origin/main..<branch>
   # verify it lists origin/main as "requires" and your branch as the head
   git bundle verify update-phaseX.bundle
   ```
4. Hand over the `.bundle`. The maintainer runs:
   ```bash
   git fetch <bundle> '<branch>:refs/remotes/bundle/phaseX'
   git merge --no-edit bundle/phaseX && git push origin main
   ```
5. **Do not** `--amend`/`rebase` already-shared commits — it changes SHAs and breaks the
   prerequisite. Keep `*.bundle` out of commits (add to `.gitignore` if needed).

If you can push directly to `origin/main`, just do that and skip the bundle.

## 6. Verification harness templates

**Engine (`__enginetest.mjs`, run from repo root, then delete):**
```js
import { castChart, formatLon } from './assets/js/core/astro.js';
import { chartCautions } from './assets/js/core/cautions.js';
import { planetaryHour } from './assets/js/core/planetary-hours.js';
const d = new Date(Date.UTC(2024,2,20,3,6));
const c = castChart(d, 51.5074, -0.1278, 'regiomontanus');
const ph = planetaryHour(d, 51.5074, -0.1278);
console.log('Sun', formatLon(c.planets.Sun.lon));
console.log('verdict', chartCautions(c,{hourRuler:ph&&ph.ruler}).verdict);
```

**Browser (`/tmp/verify.mjs`):** launch puppeteer
(`puppeteer.launch({args:['--no-sandbox']})`), walk every `*.html`, `page.goto` with
`waitUntil:'networkidle0'`, collect `console`(error)/`pageerror`/`requestfailed`, assert
`header.site` exists, and exit non-zero on any error. (Chromium needs system libs:
`libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libnss3 libpango-1.0-0 libcairo2
libasound2t64 …`.)

## 7. Conventions for new pages

- Copy the `<head>` (charset, viewport, title, description, favicon data-URI, the relative
  `style.css` link) and the closing `<script type="module">` that imports `mountChrome` from
  the correct relative depth and passes an `activeKey` matching the nav.
- Use existing CSS: `.wrap .lede .card .grid.cols-N .data .callout(.lilly/.science) .steps
  .step .pill .chip(.done/.tool/.soon) .advisories .adv-* .verdict .flow-node`.
- Add the page to the nav (`shared.js`) and/or the hubs (`tools.html`, `workflow.html`,
  `contents.html`) so it is reachable.
- Keep the honest-science framing on anything interpretive.
