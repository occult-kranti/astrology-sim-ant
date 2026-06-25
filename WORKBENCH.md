# The Workbench — unifying the engine + a local LLM (results, conclusions, design)

_Added 2026-06-25. Pairs with `REVIEW.md` (the experimental-features proposals), `COVERAGE.md`
(what's computed) and `MASTER-PLAN-V2.md` (status). Everything below is built, verified, and
gated by the project's `verify-site` checks._

This round did four things the maintainer asked for: **(1)** tried the existing/experimental
features and recorded results; **(2)** organised every computed function & datum into one
machine-readable catalogue; **(3)** linked all of it into a single tool — **The Workbench**
(`pages/workbench.html`); and **(4)** added a **local-LLM** bridge so a model on your own machine
can explain and drive the tool. No cloud, no build step, honest-science framing intact.

---

## 1. Trying the features — results & conclusions

The engine is pure ES modules and headless-runnable, so I exercised it directly under Node
(`scripts/engine-test.mjs` + ad-hoc dumps) at **2026-06-25 12:00 UTC, London** — a deliberately
un-cherry-picked "now."

| Feature | Tried | Result | Conclusion |
|---|---|---|---|
| **Cast a figure** (`astro.js castChart`) | full chart for the moment | Asc 2°29′ Libra, MC 3°14′ Cancer, day chart; Sun 3°58′ Cancer (10th), Moon 14°44′ Scorpio (2nd), Saturn 13°55′ Aries angular in the 7th | positions/houses/sect/Fortune all coherent; the central **chart object** is exactly what every other module consumes |
| **Dignities** (`dignities.js`) | Sun + almuten of Asc | Sun **peregrine** (−5); almuten of the Ascendant **Saturn** (score 9) | essential/accidental/almuten ledgers match Lilly's shape; composable |
| **Chart health** (`cautions.js`) | verdict + advisories | **red** — Moon void-of-course **and** in the Via Combusta, Saturn in the 7th, slow Moon | the "flat severity count" is honest but blunt (already flagged in `REVIEW.md`); good signal here |
| **Election** (`election.js`) | `electionScore('love')`, `rankNow` | love = **red** (score −3; void Moon, via combusta, weak timing); **all 11 aims red** at this moment | faithful: a genuinely bad electional moment ranks badly across the board — it *ranks*, it doesn't fake a green |
| **Gating** | `electionScore('banishing')` | red, **gating: "Mars is in detriment"** | the R1 hard-requirement gate fires correctly (no green over a debilitated ruler) |
| **Talisman** (`talisman.js`) | `talismanRecipe('love')` | Venus recipe: aloes/mastic/roses, copper, emerald/coral, Haniel/Hagiel/Kedemel, 8 cited steps | the full historical "recipe card" assembles from the correspondence data; every step cited |
| **Life trajectory** (`trajectory.js`) | natal 1990-05-15 | Lord of the Geniture **Jupiter** (+21); age 36, profected to Virgo, **Lord of the Year Mercury**; ruling planets Mercury/Jupiter/Sun; 49-row timeline | the heaviest composer works; one call yields the whole-life apparatus |
| **Experimental proposals** (`REVIEW.md §4`) | reviewed | none of structure-explorer / falsification-demo / lots / heat-map / concordance existed as pages | these remain open ideas; this round did **not** build them — it built the *unification + LLM* the maintainer prioritised, which is a better substrate for them (see §5) |

**Conclusion.** The computational heart (Lilly Bk I–III + Picatrix I–III) is complete, correct,
and already heavily composed — `electionScore` reuses cautions+dignities+hours+mansions+faces+stars;
`lifeTrajectory` reuses almost everything. The gap was **not** more calculation: it was that
(a) no single pure function returned the *whole* computed state as data, and (b) nothing catalogued
the capabilities for discovery or for a machine. Both are now fixed.

---

## 2. What was added (six files, all reuse — nothing re-implemented)

| File | Layer | Purpose |
|---|---|---|
| `assets/js/core/reading.js` | core (pure) | **`fullReading(chart, opts)`** — composes the UNION of every computation into one serializable, cited object: figure · dignity ledger · aspects/reception · lots/antiscia · chart health · horary perfection · election · talisman · life-trajectory. The single source of truth for the UI, the JSON export and the LLM. Exports the canonical `HONEST_FRAMING`. |
| `assets/js/core/registry.js` | core (pure) | **The capability catalogue** — one entry per computation: module, export, what it computes, inputs/outputs, citation, the page(s) that surface it, the how-it-works anchor, and glossary terms. Drives the Workbench's Reference index and the LLM tool schema. |
| `assets/js/core/llm-context.js` | core (pure) | The **local-LLM bridge**: `buildContext(reading)` (locked honest-framing system prompt + relevant glossary + the computed, cited facts), `buildToolSchema()` (the engine's callable capabilities as a function schema), and `runTool(name,args,ctx)` (a safe dispatcher that runs the real engine and refuses unknown tools). |
| `assets/js/app/state.js` | app (DOM) | Generalised **share/export**: `encodeState/decodeState` (pure, tested), `writeStateToURL/readStateFromURL/copyShareLink`, `downloadJSON`, and `downloadSVG`/`svgToPNG` chart export (the long-open `REVIEW.md` backlog item). |
| `assets/js/app/workbench.js` | app (DOM) | The Workbench controller: one input → `fullReading` once → every panel rendered, every cross-link generated from the registry, plus JSON/SVG/PNG export and shareable URL. |
| `assets/js/app/assistant.js` | app (DOM) | The "Ask a local model" panel (Ollama + in-browser WebLLM; Explain + Tools modes). |

Plus `pages/workbench.html` (the page), `docs/LOCAL-LLM.html` (the how-to), and wiring into the
nav/footer (`shared.js`), the Tools hub and `master.html`. `scripts/engine-test.mjs` gained test
blocks for all of the above.

**The spine, visually:**

```
            castChart(moment, place)         [+ optional birth chart, quesited house]
                      │
                      ▼
        fullReading(chart, opts)   ← reuses dignities/aspects/cautions/hours/
            one cited JSON object       election/talisman/trajectory + the data modules
            ┌─────────┼───────────────────────────┐
            ▼         ▼                             ▼
   pages/workbench  Copy/Download JSON     core/llm-context.buildContext()
   (every panel,     (the export surface)   → local model (Ollama / WebLLM)
    registry-linked)                          → narrates the cited facts;
                                               may call runTool() → real engine
```

---

## 3. Organising & linking — how "everything" is now one tool

- **One computation, many consumers.** The Workbench casts the chart and calls `fullReading`
  *once*; the on-screen panels, the JSON download, and the LLM all read the same object. No panel
  re-calls the engine, so they can never disagree.
- **The registry is the index.** Every panel header links to its dedicated tool + its step-by-step
  explanation; the foot of the page renders the whole **Reference index** (21 capabilities across
  Books I–III + Picatrix) from `registry.js`. An anti-drift test asserts every referenced export,
  page, how-it-works anchor and glossary term really exists — so the map can't rot.
- **Share & export everywhere.** The trajectory page's bespoke URL round-trip is now a shared
  `state.js`; the Workbench round-trips its full input in the URL, downloads the reading as JSON,
  and exports the wheel as SVG/PNG.
- **Discoverable.** Added to the top nav, the footer, the Tools hub (as the flagship card), and
  linked from the Master tool as its superset.

`pages/master.html` stays as the quick "subset glance"; the Workbench is the full union.

---

## 4. The local LLM — design, modes, guardrails

**Why local.** The site is static, offline-first and privacy-respecting; a local model keeps that
promise. The engine computes the chart in your browser, builds a small **grounded, cited fact
sheet**, and the model turns those facts into prose — narrating *real* numbers, not inventing them.

**Two backends** (`assets/js/app/assistant.js`):
- **Ollama** (recommended) — `POST http://localhost:11434`. You run `ollama serve` with
  `OLLAMA_ORIGINS` set so the page may reach it (the CORS step is documented in `docs/LOCAL-LLM.html`).
- **WebLLM** — a model in the browser tab via WebGPU; lazy-loaded only when you choose it.

**Two modes:**
- **Explain (RAG)** — the model is given the cited facts and narrates them. Works with any small model.
- **Tools (agentic)** — a tool-capable model may call the engine itself (`runTool`): cast a chart for
  another time, `rankNow`, `findNextElection`, look up a mansion/face, score an election. The tools
  come from the registry; the dispatcher refuses anything not on the list.

**Guardrails (defense in depth):** the system prompt is the **locked** canonical honest-framing
(`HONEST_SYSTEM_PREAMBLE`, built on `reading.js`'s `HONEST_FRAMING`, so it can't drift); the facts are
engine-computed and **cited**; tool calls return real engine output; a visible disclaimer sits in the
panel. The model describes a historical, pseudoscientific tradition — it does not advise or predict,
and magical material stays historical-only.

**Verify-gate contract.** The assistant makes **no network request on load** — detection and chat fire
only on an explicit click, every fetch wrapped so a refusal updates the panel text. That is what keeps
the real-browser sweep green (there is no local model in CI).

---

## 5. How to run & verify (this Windows machine)

Node is provided by a conda env (`astro-workbench`, Node 26). The standard `verify-site` gate passes,
adapted to Windows:

```powershell
# from the repo root
$node = "C:\Users\<you>\.conda\envs\astro-workbench\node.exe"
& $node scripts/audit.mjs          # → Problems: 0   (links + ES imports)
& $node scripts/engine-test.mjs    # → all passed    (engine + reading + registry + llm-context)

# real-browser sweep (Chromium via puppeteer installed in the scratchpad)
python -m http.server 8003         # serve the static site
$env:PUPPETEER_PKG = "file:///.../pptr/node_modules/puppeteer/lib/puppeteer/puppeteer.js"
$env:BASE = "http://localhost:8003"
& $node scripts/browser-verify.mjs # → 34 pages, 0 errors; hdr✓ on every page
```

**Verified this round:** audit `Problems: 0`; engine-test `all passed` (incl. the new
reading/registry/llm-context blocks); browser sweep **34 pages, 0 errors**; a content assertion
confirms the Workbench renders every panel (7 dignity rows, 11 ranked elections, 8 talisman steps,
21 registry items, the natal block on adding a birth moment) with **0 network calls on load**; and an
end-to-end assistant test against a mock Ollama confirms detect → streamed Explain reply → Tools-mode
**tool-call that executes the real engine** → narration, with 0 console errors.

To try the LLM for real: install Ollama, `ollama pull llama3.1`, start it with `OLLAMA_ORIGINS=*`,
then open the Workbench → **Ask a local model** → Detect / connect. See `docs/LOCAL-LLM.html`.

---

## 6. What this sets up next

The unification is the right substrate for the `REVIEW.md §4` experiments: a **falsification demo**
permutes `fullReading` over jittered birth times; **generalised Lots** slot into `reading.lots`; an
**election heat-map** reuses `rankNow` over a time grid; a **structure explorer** reads the registry.
Each is now a small addition over one object and one catalogue rather than a new silo.
