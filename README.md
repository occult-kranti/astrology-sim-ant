# Christian Astrology — the interactive William Lilly

An interactive, scientifically-honest study edition of **William Lilly's _Christian
Astrology_ (1647)** — the first complete astrology textbook written in English. It
presents Lilly's three books chapter by chapter and backs every technique with a
**working calculator** built on a verified astronomical engine that runs entirely in
the browser.

> **An honest note.** Astrology has no demonstrated predictive validity and is
> classified by the scientific community as a pseudoscience. This project presents
> Lilly's astrology as a landmark of intellectual and cultural history and as a
> fascinating formal system to learn and compute. The **calculations are real and
> verifiable**; the **interpretations are Lilly's**, offered for study — not as
> guidance. See `pages/about/` for the evidence and citations.

## What's here

| Area | Pages / tools |
|------|---------------|
| **Home** | `index.html` — overview, "find your way", the three books, the tools, the science note |
| **The Master Tool (the Workbench)** | `pages/workbench.html` — **the single master tool** (the old "Unified Master" now redirects here): one moment runs the **whole engine at once** (the `fullReading` spine) **plus the Vedic chart side by side** (toggle at the top), every panel cross-linked via the capability registry, with **JSON / Markdown / SVG / PNG export** and **on-device auto-save** (download the report to keep it). Its **AI assistant** (powered by **Claude**, your own key) sends the **whole reading as JSON** and offers two presets — **🔎 Interpret & advise** (a plain cross-system synthesis) and **📜 Codex** (evocative) — plus an agentic **"plan a working"** box and **in-browser engine tools** (Western, Vedic, and the Picatrix prayers); every reply has a **⤓ save**. See `WORKBENCH.md` and `docs/LOCAL-LLM.html`. |
| **Jagannath Hora — Vedic (sidereal)** | `pages/vedic/index.html` — a **second, independent system**: a Vedic (Jyotiṣa) study implementation inspired by JHora, with documented approximations — sidereal zodiac (Lahiri ayanāṁśa), whole-sign houses, the 27 nakṣatras, the **Vimśottarī daśā**, the **Pañcāṅga**, the divisional charts (**vargas** D1–D60), the **Aṣṭakavarga** (SAV), an **approximate six-component Ṣaḍbala study model** (with Iṣṭa/Kaṣṭa), and the traditional **daily & birth practice** (mantra · japa · yoga · yantra · gem — *described, never prescribed*; the graha→āsana map flagged as a modern syncretism). A **🕉 Vedic view** toggle on every calculator shows it **side by side** with the Western chart. Engine in `core/vedic.js` + `core/data/vedic-data.js` + `core/data/vedic-remedies.js`, cited to Parāśara's BPHS and P.V.R. Narasimha Rao. |
| **Workflow & Chapter Map** | `pages/workflow.html` — every chapter of each book → concept → calculation → worked example → tool; the horary & nativity step-flows; the Picatrix election bridge |
| **Tools hub** | `pages/tools.html` — every calculator in one place, with a "what each computes" table |
| **Book I — Fundamentals** | hub, signs/planets/houses reference, **Master Tool** (now with a full **Cautions & chart-health** panel), **Essential Dignity Calculator**, **Planetary Hours**, **Degree Tables** |
| **Book II — Horary** | hub + step-by-step method, **Horary Chart Calculator** (perfection: translation/collection/prohibition/refranation + timing), considerations, house-by-house guide, Lilly's worked charts |
| **Book III — Nativities** | hub + natal method, **Nativity Calculator** (Lord of the Geniture, temperament) |
| **Reference** | **Glossary & Dictionary** (auto-linked in prose), **Master Index**, **Read the Original** (free scans) |
| **About & Sources** | biography, editions, the modern revival, the scientific assessment, technical notes, full citations |

> **For the next contributor:** `HANDOFF.md` has the current state, the architecture rules,
> the verify-in-a-browser harness, and the **bundle-so-it-applies-cleanly** procedure.
> `MASTER-PLAN.md` has the full Lilly × Picatrix vision and the phased roadmap.

### The calculators are real

- **Positions:** geocentric apparent ecliptic longitudes in the *true equinox of
  date* (tropical zodiac) from [`astronomy-engine`](https://github.com/cosinekitty/astronomy)
  (truncated VSOP87, MIT, ≈1 arc-minute), vendored at `assets/js/lib/astronomy.js`.
- **Angles & houses:** Ascendant, Midheaven, and **Regiomontanus** (Lilly's system),
  Placidus, whole-sign and equal cusps — computed in `assets/js/core/astro.js` and
  validated against published reference vectors.
- **Dignities:** Lilly's essential (domicile/exaltation/triplicity/term/face) and
  accidental point system, the almuten of a degree, the Part of Fortune, the mean node.
- **Horary:** significators, applying/separating aspects with Lilly's planet-based
  orbs and moieties, mutual reception, planetary hours, and the considerations before
  judgement.

### Verification

Validated with `node` + headless Chromium:

- mean obliquity matches the standard value to 5 decimal places;
- the Sun is at **0° Aries** at the March equinox and **0° Cancer** at the June solstice;
- the Sun sits on the **Midheaven at local apparent noon**;
- the twelve Regiomontanus cusps come out strictly in zodiacal order, and all house
  systems agree on the Asc/MC;
- every term-row of the dignity table sums to **30°**;
- the release browser harness sweeps every current HTML page and exercises the primary calculators; current results are recorded in the dated verification documents.

## Run it locally

It's a static site — no build step.

```bash
python3 -m http.server 8003
# then open http://localhost:8003/index.html
```

## Project structure

```
index.html                     home page (with "find your way" hubs)
assets/
  css/style.css                design system (advisories, verdict, chip, flowmap…)
  js/lib/astronomy.js          vendored astronomy-engine (MIT)
  js/core/                     calculation engine (pure, headless-testable in Node)
    astro.js                   positions, angles, houses, Part of Fortune, node, antiscia
    dignities.js               essential + accidental scoring, almuten, reception rulers
    aspects.js                 Ptolemaic aspects, Lilly orbs, applying/separating
    considerations.js          considerations before judgement (radicality)
    perfection.js              translation/collection/prohibition/refranation + timing
    cautions.js                consolidated chart-health engine → severity advisories + verdict
    planetary-hours.js         Chaldean-order day & hour rulers
    election.js · talisman.js · trajectory.js   the Picatrix election/talisman/life-trajectory composers
    reading.js                 fullReading() — composes the WHOLE engine into one serializable, cited object
    registry.js                the capability catalogue (drives the reference index + the LLM tool schema)
    llm-context.js             local-LLM bridge: buildContext() · buildToolSchema() · runTool()
    chart.js                   SVG chart-wheel renderer (the only DOM-touching core file)
    data/                      dignities-data, planets, signs, houses, degree-tables, glossary
  js/app/                      page logic: shared chrome, autolink, horary, book1, book1-master, book3,
                               workbench (the unified tool), assistant (local-LLM panel), state (share/export)
pages/
  workflow.html                chapter map & workflows (per-chapter, all three books)
  tools.html                   tools hub (every calculator + what each computes)
  contents.html                master index · glossary.html · read.html
  book1|book2|book3|about/      content pages & calculators
.github/workflows/pages.yml    GitHub Pages deployment (self-enabling)
MASTER-PLAN.md                 the full Lilly × Picatrix vision and phased roadmap
HANDOFF.md                     state, architecture rules, verify harness, bundle procedure
PLAN.md                        the original plan and feature list
```

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`. Node validation and real browser journeys must pass before the protected Pages job publishes the site to
`https://occult-kranti.github.io/astrology-sim-ant/`.

## October 2026 calculator release

The existing [nativity calculator](pages/book3/nativity.html) now supports explicit unknown birth time, IANA daylight-saving ambiguity handling, house-system warnings and configurable wheel aspect orbs. Placidus intermediate cusp formulas, horizon-based sect, date overflow and years 0–99 are corrected. The [calendar tools](pages/calendars.html) provide named civil calendars, Gregorian/Julian/JD conversion, Gregorian/Julian Easter, Qibla and local Adhan prayer calculations with method choices.

Use [Skylens](https://occult-kranti.github.io/skylens/) for the companion camera sky experience; it is a separate repository. See the [living roadmap](docs/2026-10-roadmap.md), [calculation methods](docs/2026-10-calculation-methods.md), [calendar methods](docs/2026-10-calendar-methods.md), [research matrix](docs/2026-10-research.md) and [verification/handoff](docs/2026-10-verification.md). Research breadth does not imply every cultural tradition has a validated calculator.

Run `node scripts/engine-test.mjs` and `node scripts/audit.mjs`. Regenerate the local search index with `node scripts/build-search-index.mjs` after page changes. Browser checks and deployment status must be verified separately from a successful local Node run.

## Licence & credits

Educational, non-commercial project framing. Third-party components retain their own licenses: astronomy-engine by Don Cross (MIT), and the new local Adhan prayer library (MIT; retained copyright and source provenance in `assets/vendor/adhan/`). See `docs/2026-10-third-party.md`.
Text and tables after William Lilly, _Christian Astrology_ (1647), cross-checked
against modern editions and traditional-astrology scholarship (see About & Sources).

## Live Symbol Studio and MCP

**Pages connection page:** https://occult-kranti.github.io/astrology-sim-ant/pages/mcp.html — setup, endpoint copying and the searchable tool catalogue. This static page links to the separately hosted authenticated MCP process.

[Live Symbol Studio](pages/studio.html) connects the existing chart, planetary-square and name-trace engines with explicit time/location/method controls, live or frozen calculation, pause/resume, text alternatives and SVG/PNG/JSON exports. [Tools](pages/tools.html) remains the directory for the broader study collection. See the [panel decisions and roadmap](docs/2026-10-05-live-studio-roadmap.md), [product brief](PRODUCT.md), [design contract](DESIGN.md) and [MCP setup](mcp/README.md).

The MCP backend is a separate Node/fetch-runtime process with 11 allowlisted tools. GitHub Pages serves the frontend only. No account or paid API is needed for local calculations or local MCP. Saved personal records remain in the browser unless you explicitly export or send them through the assistant/client. Calibration validates inputs and conventions; it does not infer an unknown birth time or establish symbolic efficacy.

### Observatory sessions: from the sky to a study record

The existing [Studio](pages/studio.html) now follows **Observe → Cast → Compare → Symbol → Journal**. Capture a selected object in [SkyLens](https://occult-kranti.github.io/skylens/) and open its frozen time/place in the Studio; compare tropical and documented sidereal conventions, construct a planetary square, then save a source-linked journal snapshot. Return links preserve the selected object and Hindi naming preference without starting the camera or sensors.

Choose a **Lilly, Agrippa, Hermetic or Newton study lens** to see relevant source passages, prompts and existing tools. Newton supplies an observation/hypothesis/measurement workflow, not an invented astrology algorithm. Planetary hours name the implemented sunrise/sunset division; alternative historical conventions remain distinct. See the [session roadmap](docs/2026-10-05-observatory-sessions.md) and [reviewed sources](docs/2026-10-05-study-sources.md).

**Explain this snapshot** prepares a minimal, source-labelled AI packet. Exact coordinates, personal notes, the recorded question and entered symbol text are excluded unless selected. Review the outgoing request, then explicitly Send using your chosen provider—or copy/export it for your existing AI/MCP client. This Studio panel keeps API keys in memory, and changing context cancels stale answers. The separate legacy Workbench assistant still offers an explicit Remember option. Journal records remain local; no cloud sync or camera-frame transfer is implied.

### Human actions and pending external checks

- [ ] Repository owner: in **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Actions are enabled, but the Pages source still reports legacy branch publication. Both the integration and the deployment job's `pages:write` token received HTTP403 when updating this administration setting on2026-10-05. The workflow can deploy verified artifacts; selecting Actions prevents competing legacy builds. No new account is needed.
- [ ] If using desktop MCP, install Node 22+, clone the full repository, run `npm ci` in `mcp/` and add the documented stdio command to your MCP client. No server account is needed.
- [ ] To use remote MCP, connect the private Workbench plugin through **Plugins → Personal → Created by you** and complete OAuth. Published backend: [https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site](https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site); endpoint `https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site/mcp`. Then run a read-only `workbench_catalogue` call to verify the actual client connection. No new paid account is needed.
- [ ] Optional browser AI: obtain your own Groq or Anthropic API access and enter a supported model/key in the Studio. Availability, quotas and billing are controlled by that provider; no account is needed for local tools or copying/exporting a study prompt. Do not commit keys. Real provider calls have not been verified with your account.
- [ ] Check the Studio on an actual phone and with your screen reader: input controls, live/pause behavior, chart/text parity, orientation/reflow and SVG/PNG downloads. Browser automation is separate evidence.
- [ ] Have a knowledgeable tradition-specific reviewer verify any new historical plate or regional method before expanding its validation claims. The catalogue intentionally distinguishes sourced arithmetic, editorial reconstructions and unimplemented methods.

GitHub Actions are enabled; the one-time Pages source choice above is a separate repository setting. No repeat account setup is required for the frontend.
