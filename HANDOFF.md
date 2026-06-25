# Handoff notes — for the next model/build

This file is the **environment + architecture + ship-procedure** truth. For *what to build
next and in what order*, read **`ROADMAP.md`** (the reconciled, phased plan). For *the data to
encode and its accuracy caveats*, read **`research/SOURCE-DATA.md`**. The long-form vision is
`MASTER-PLAN.md`; `PLAN.md` is the original (archival).

> **Doc map:** `ROADMAP.md` = the plan (phases + gates) · this file = how the box works + how to
> ship · `research/SOURCE-DATA.md` = cited data + caveats · `MASTER-PLAN.md` = vision ·
> `.claude/skills/` = automation (`verify-site`, `add-data-module`, `ship-bundle`, `accuracy-check`).
>
> **Two handoffs were reconciled.** A parallel handoff (`updatehandoff.bundle`) carried an
> excellent forward plan + research data (now folded into `ROADMAP.md` and `SOURCE-DATA.md`) but
> **stale environment notes** — it said `git push` returns 403 and to use Chromium at
> `/opt/pw-browsers/...`. **In THIS container neither is true:** push works; use the puppeteer
> Chromium (see §4 / the `verify-site` skill). When in doubt, trust this file for mechanics.

---

## 1. What this repo is

An interactive, scientifically-honest study edition of **William Lilly's _Christian
Astrology_ (1647)**, with a **real, verified astronomical engine** that runs entirely in the
browser (no backend, no build step). The long-term target (see `MASTER-PLAN.md`) integrates
the **_Picatrix_** (astrological magic) via an **Election Engine** that reuses Lilly's
machinery. The geometry is genuine; the interpretations are Lilly's, framed as history.

## 2. Current state (this build)

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
