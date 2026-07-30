# 00 — FRAME: resolving "the Karpathy graph" + mapping MASTER SETUP DOC v2 onto this repo

Round: R33 pre-work · Written 2026-07-30 · Evidence-first, no assertions without a URL or a file path.
Repo under analysis: `C:/Users/mehta/OneDrive/Documents/github/2026/astrology-sim-ant` (branch `main`, tip `89e2622`).

---

# TASK A — WHAT IS "THE KARPARTHY GRAPH"?

The operator wrote "adopt the karparthy graph" (sic). I did not assume. Below are the three
candidate referents with structural descriptions and URLs, then a ranked interpretation with
confidence, then the part that actually matters: the features worth stealing **regardless of
which one was meant**.

## Candidate (a) — the micrograd `draw_dot` computation-DAG visual

**What it is.** `karpathy/micrograd` ships `trace_graph.ipynb`, whose `draw_dot(root)` renders the
autograd expression graph with Graphviz. It is, by a wide margin, the most-reproduced single image
Karpathy has published — it appears in the README, in the "Neural Networks: Zero to Hero" lecture 1,
and in essentially every reimplementation blog post.

**Structure, precisely** (from the notebook source and README, fetched):

| aspect | value |
|---|---|
| graph attr | `rankdir` = `"LR"` (left→right) or `"TB"`; strict DAG, no cycles |
| value node | `shape='record'`, label `"{ data %.4f \| grad %.4f }"` — in the lecture version prefixed with the variable's own `label`, giving `{ label \| data \| grad }` |
| op node | a **separate, smaller node** created **only if** `n._op` is truthy, labelled with the operator (`+`, `*`, `tanh`, `**`) |
| edge semantics | `predecessor_value → op_node`, then `op_node → result_value`. So there is **never** a direct value→value edge; the operation is always interposed. |
| construction | `trace(root)` walks `v._prev` recursively to collect `nodes`/`edges`; `draw_dot` is a **pure function of the graph** — same expression, same picture, every time |
| layout | Graphviz `dot` hierarchical layering (not force-directed) |
| interaction | none — it is a static SVG/PNG. The *notebook* is the interaction. |
| the pedagogical point | README: "it shows both the data (left number in each node) and the gradient (right number in each node)" |

**URLs**
- https://github.com/karpathy/micrograd
- https://github.com/karpathy/micrograd/blob/master/trace_graph.ipynb
- https://deepwiki.com/karpathy/micrograd
- Third-party confirmations of the structure: https://tuananhbui89.github.io/blog/2025/karpathy-lec01/ · https://willbeckman.com/nn-from-scratch.html

## Candidate (b) — the LLM Wiki / "LLM Knowledge Bases" graph (April 2026)

**What it is.** On **2026-04-02/03** Karpathy posted on X: *"Something I'm finding very useful
recently: using LLMs to build personal knowledge bases for various topics of research interest."*
Two days later he published the gist **`llm-wiki.md`**. The post did ~16M views; the gist has
5,000+ stars/forks. The community coinage that stuck is **"LLM Wiki"** / **"LLM Knowledge Bases"**.

**Structure, precisely** (from the gist, fetched, plus the derivative implementations):

- **Three layers.** (1) *Raw sources* — immutable, never edited by the model. (2) *Wiki* — a
  directory of LLM-generated markdown: entity pages, concept pages, source summaries, syntheses.
  (3) *Schema* — a `CLAUDE.md`-style file declaring conventions and workflows.
- **Two spine artifacts.** `index.md` (every page + one-line summary + metadata, by category;
  rewritten on every ingest) and `log.md` (**append-only**, entries like
  `## [2026-04-02] ingest | Article Title`, deliberately greppable with Unix tools).
- **Three operations.** `ingest` (one source → updates ~10–15 pages → appends a log line),
  `query` (search → synthesize with citations → file the exploration back into the wiki),
  `lint` (periodic health check for **contradictions, stale claims, orphan pages, missing
  cross-references**).
- **The graph.** In the gist itself the graph is *implicit* — it is the `[[wikilink]]`
  cross-reference mesh, visualized by opening the folder in Obsidian's **graph view**
  (force-directed, undirected, untyped, node = file, edge = wikilink). Derivative tools make it
  explicit: **Graphify** replaces the flat wiki with a real graph having **typed nodes, weighted
  edges, confidence scores, and community detection**.
- **Contradictions are recorded, not resolved** — the gist treats a new source that conflicts with
  an existing page as something to *log as a contradiction*, not to overwrite.

**URLs**
- Gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Coverage: https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an
- https://academy.dair.ai/blog/llm-knowledge-bases-karpathy
- Graph-ified derivatives: https://www.analyticsvidhya.com/blog/2026/04/graphify-guide/ ·
  https://github.com/lucasastorian/llmwiki · https://github.com/Astro-Han/karpathy-llm-wiki ·
  https://community.obsidian.md/plugins/karpathywiki

## Candidate (c) — a community coinage naming a graph *style* after him

**Finding: NOT FOUND. This is a negative result, reported as such.** Searches for `"Karpathy
graph"` as a named visualization style return no term of art. What the community *did* coin from
his work is **"LLM Wiki" / "LLM Knowledge Bases"** (candidate b) — a *system* name, not a *layout*
name. The closest thing to a style-eponym in circulation is informal reference to "the micrograd
graph" or "the Karpathy-style computation graph" for candidate (a).

Also checked and **negative**: no force-directed / concept-map artifact is attributable to
**arxiv-sanity** (it is a ranked-list + search UI, not a graph), and the **"LLM OS"** diagram is a
*block/systems* diagram (CPU=LLM, RAM=context window, disk=filesystem, peripherals=tools), not a
knowledge graph — it has boxes and buses, not nodes and typed edges. Neither is a plausible
referent for "the graph".

## RANKED INTERPRETATION

| rank | referent | confidence | why |
|---|---|---|---|
| **1** | **(a) micrograd `draw_dot` DAG** | **~50%** | "The Karpathy graph" with no qualifier, in a sentence about *adopting a graph*, most naturally names his single most-famous graph image. It is a **visual/structural** adoption request: record-nodes, op-nodes, strict LR DAG. |
| **2** | **(b) LLM Wiki knowledge graph** | **~35%** | The operator's own MASTER SETUP DOC v2 is *structurally the llm-wiki pattern* — ingest/curate gate, refresh artery ≈ `index.md` rebuild, telemetry ≈ `log.md`, regression harness ≈ `lint`, "contradictions recorded not resolved". If the v2 doc descends from the gist, "the Karpathy graph" means "the graph the Karpathy pattern produces." The date fit is strong (gist Apr 2026, this doc Jul 2026). |
| **3** | (c) a style coinage | **~10%** | No such coinage exists in the searched record. Most likely the operator is *loosely* using this to mean (a). |
| **4** | LLM-OS / arxiv-sanity | **<5%** | Structurally wrong artifacts; reported for completeness. |

**Honest recommendation: do not force the choice.** Ranks 1 and 2 are not in conflict — (a) is a
*rendering* spec and (b) is a *maintenance* spec, and the transferable set below takes the useful
half of each. Ask the operator one clarifying question (see GAPS) but **build to the union**,
because the union is strictly better than either.

## THE TRANSFERABLE FEATURES (this is the part that matters)

Six ideas, each with the repo-specific move. Marked ✅ where this repo **already does it** — do not
rebuild these.

1. **Op-nodes make the RELATION a first-class node.** In micrograd there is *never* a value→value
   edge; the operation is interposed as its own node, so the operation can carry its own identity.
   **Transfer:** a *transmission claim* (X translated Y; A refuted B) becomes a **clickable node**
   with its own citation, epistemic label and note — not a hairline between two circles.
   **Repo status: HALF-ADOPTED.** `assets/js/core/data/confluence.js` edges already carry
   `kind` ∈ {translation, influence, commentary, synthesis, refutation, adaptation}, `label` ∈
   {documented, disputed, debunked, conspiracy}, `bestCitation` and `note` — the data is already
   op-node-shaped. What is missing is the *rendering*: `assets/js/app/confluence.js` draws edges as
   arcs. Promoting them to nodes is a pure view change over existing verified data. **Highest
   leverage, near-zero data cost.**

2. **Every node displays its own computed values inline.** `{ label | data | grad }` in a record
   shape — no tooltip, no drawer, the numbers are on the node face.
   **Transfer:** `{ name | weight | witnesses }` — the curation weight and the independent-witness
   count are painted on the node, so a weak claim *looks* weak at a glance without interaction.
   **Repo status: ABSENT.** Weights don't exist yet (see Artefact 1); the atlas currently reveals
   evidence only on drawer-open.

3. **The DAG *is* the explanation** — strict `rankdir=LR`, acyclic, so reading order = argument
   order and no prose is needed.
   **Transfer:** the atlas is *already* time-ordered (era bands, `timeScale()` monotone in year), so
   left→right already means "earlier→later". **But acyclicity is not asserted anywhere.** Grep of
   `scripts/engine-test.mjs` shows the confluence block asserts unique slugs, no dangling endpoints,
   lane/kind/label enums, `sortYearEnd >= sortYear`, layout determinism, no same-lane-same-row
   overlap — **but no cycle check**. A transmission graph that contains a cycle contains a dating
   error. **Add one assert; it is a free correctness detector.**

4. **Forward values / backward gradients — the duality.** micrograd's real content is that each node
   holds *two* numbers flowing in opposite directions.
   **Transfer to humanities:** forward = **transmission** (chronological influence, already
   modelled). Backward = **attribution pressure**: how much a node's standing depends on downstream
   claims about it. A figure cited only by works that themselves grade `disputed` should show a bad
   "grad" even if its own page looks clean. This is a genuinely novel, computable, honest metric and
   it falls straight out of the existing `label` field.

5. **The picture is a pure function of the graph.** `draw_dot` is deterministic — same expression,
   same SVG.
   **Repo status: ✅ ALREADY DONE.** `scripts/engine-test.mjs` asserts
   `JSON.stringify(cfLayout(...)) === JSON.stringify(cfLayout(...))` ("layoutConfluence deterministic
   (two calls deep-equal)"). This mandate is satisfied; say so and move on.

6. **From llm-wiki: contradictions are logged, never silently resolved; and the index/log/lint
   triad.**
   **Repo status: ✅ PARTLY DONE, and better than the gist.** `confluence.js` records
   `contested.positions[]` and `engine-test.mjs` asserts *every contested entry carries ≥2
   positions*. `greatworks-east.js` keeps both sides of the Varāhamihira dating and the
   De Michelis/traditionalist dispute. The **lint** leg is done (audit + engine-test +
   browser-verify). The **index rebuild** and **append-only log** legs are the missing ones —
   they are precisely Artefacts 2 and 3 below.

---

# TASK B — MAPPING MASTER SETUP DOC v2 ONTO THIS REPO

## What this repo already is (read before proposing anything)

This is **not** a greenfield. It is a ~393-tracked-file, no-build, vanilla-ES-module static site
with an unusually strong verification culture:

- **`scripts/engine-test.mjs`** — 1,743 lines, dependency-free, DOM-free. Imports the site's own
  core modules and asserts *domain* facts (equinox Sun ≈ 0° Aries, Algol precesses ~1°/72yr,
  36 faces cross-checked against `dignities-data` FACES, every record has a `source`). Its tail
  spawns **23 per-round test modules** (`scripts/tests/*.mjs`) each in an **isolated child process**
  — with a comment explaining exactly why (module-scope `motionOK()` caching leaks across modules).
  That is mature harness engineering.
- **`scripts/audit.mjs`** — 45 lines, zero deps: every HTML `href`/`src` and every relative JS import
  must resolve. Exits non-zero. Deliberately skips `${…}` template literals.
- **`scripts/browser-verify.mjs`** — 196 lines, three phases in real Chromium: (1) every page,
  0 console/pageerror/requestfailed, chrome injected, 4 a11y invariants, plus the signature
  `__motionStats().running === false` after 1.2 s idle; (2) executes the test modules' exported
  `DRIVES[]`; (3) reduced-motion, 390 px no-h-scroll, and print passes.
- **`.claude/skills/verify-site/SKILL.md`** — the three gates written down as *the* commit gate.
- **`.claude/skills/add-data-module/SKILL.md`** — "Every record carries a `source` field… Where
  sources disagree, include the variants… Add a headless test asserting count, boundary math,
  precession sanity, and every record has `source`." This is a curation discipline already.
- **The operative graph already exists.** `assets/js/core/data/confluence.js` — **190 entries,
  155 edges, 9 lanes**; every edge labelled `documented(145)/disputed(9)/debunked(1)/conspiracy(0)`
  with `bestCitation` + `note`; contested entries carry both positions; `siteLink` hrefs are
  `existsSync`-checked against disk by the engine-test. `assets/js/core/confluence.js` is the pure
  geometry engine (`timeScale`, `layoutConfluence`, `filterEntries`, `threadFrom`,
  `confluenceStats`, `minimapModel`, `laneDensity`, `edgeSparkline`, `searchEntries`).

**Consequence for v2: most of the "harness" mandates are already met. The gap is not testing —
it is provenance plumbing and honest accounting.**

## MANDATE MAP

> **Caveat, stated plainly:** I do not have the literal text of MASTER SETUP DOC v2 — only the
> operator's enumeration in the task brief. Rows below are mapped against that enumeration. Rows
> marked **⚠ UNRESOLVED** need the source text. See GAPS.

| # | v2 mandate | verdict | proof / evidence in this repo | minimal concrete implementation here |
|---|---|---|---|---|
| 1 | **Five rules** (the standing invariants) | **PARTIAL** | The rules exist but are scattered and prose-only: `MASTER-PLAN.md` §"Architecture invariants (do not break)" (line 894); the LOCKED FRAMING / HONESTY RULES headers in `assets/js/core/data/confluence.js` (l.28+) and `greatworks-east.js` (l.15–33); `.claude/skills/add-data-module/SKILL.md` §"Principles (non-negotiable)". | One tracked `RULES.md` at repo root, five numbered rules, each with **the assert that enforces it** named by file:line. Any rule with no enforcing assert is marked `UNENFORCED` in the file itself. ~40 lines. |
| 2 | **Curation gate with ejection path** | **PARTIAL → the ejection path is ABSENT** | *Present:* per-record `source`/`sources[]` asserted by engine-test; the 4-value edge `label` enum; `bestCitation` + `note` non-empty asserted; `contested.positions.length >= 2` asserted; `.claude/skills/accuracy-check/SKILL.md` is a real pre-encode gate. *Absent:* **no weights**, **no exclusions file** (things considered and rejected leave no trace), **no ejection protocol** — and the repo's stated data discipline is *append-only* (R32 log: "`confluence.js` edited by **append only** (existing entries/edges byte-stable)"). Nothing can currently leave the graph with a recorded reason. | **Artefact 1** below. |
| 3 | **Graph refresh artery** (idempotent rebuild) | **ABSENT in-repo — and actively broken** | The generators exist but are **untracked, in an ephemeral session scratchpad**. `confluence.js:25,78` → "regenerate via `scratchpad/r28build/gen-data.mjs`"; `practices/mudras.js:5` → `scratchpad/r31build/gen-practices-data.mjs`; `bhava-phala.js:5`, `yoga-rules.js:4` likewise; `greatworks-east.js:12` → `r32build/gen-greatworks-east.mjs`. `git ls-files` contains **none** of them. Worse: **`scripts/tests/r28-atlas-labels.mjs:25` hard-codes an absolute path** `C:/Users/.../4c4bfebe-.../scratchpad/r28data/edge-labels.json` — a *committed test* depending on a *session-scoped temp directory*. The artery is severed: the shipped data cannot be reproduced from anything in the repo. | **Artefact 2** below. This is the single highest-value item in the whole map. |
| 4 | **Regression harness** | **✅ DONE** | `scripts/engine-test.mjs` (1,743 lines, 23 isolated child-process modules) + `scripts/audit.mjs` + `scripts/browser-verify.mjs` (3 phases) + `.claude/skills/verify-site/SKILL.md`. Confluence-specific regressions already covered: exact counts, enum legality, no dangling endpoints, unique slugs, monotone time scale, layout determinism, no row overlap, `siteLink` on-disk. | **Build nothing.** Add exactly **two** asserts to the existing confluence block: (i) **the DAG is acyclic** (currently unchecked — a cycle = a dating error); (ii) `gen-opgraph --check` is clean (anti-drift, once Artefact 2 lands). |
| 5 | **Telemetry** | **PARTIAL — prose only, hand-typed** | Every `MASTER-PLAN.md` round heading carries real numbers: *"(verified: audit 0 · engine-test all passed (77 registry exports) · Chromium sweep 38 pages 0 errors)"* — R2 through R32. That *is* telemetry; it is just typed by hand into a 122 KB markdown file and not machine-readable or trendable. | **Artefact 3** below. Emit the same numbers as JSONL from the scripts that already compute them. |
| 6 | **Two-column round ledger** (`domain_claims_survived \| tooling_only`) | **ABSENT** | Round logs are **one-column narrative** and structurally mix the two. E.g. the R32 entry blends *domain* output (2 atlas person-nodes, 4 documented edges, 102 chapter mappings, the SRF v. Ananda PD determination) with *tooling* output (renderer reuse via 5 exported helpers, a registry entry, `r32-atlas-east.mjs`, count-assert updates) in the same paragraph. You cannot tell from the log whether a round produced knowledge or instruments. | **Artefact 4** below. |
| 7 | **Power gates** | **PARTIAL** | A hard *process* gate exists and is honoured (`verify-site`, all three exit non-zero). But every gate checks **shape**, not **evidentiary standing**: nothing blocks a round that adds 40 well-formed nodes with one weak witness each, and nothing blocks a round that ships **zero domain claims**. | Two new gate conditions, both cheap: (i) `gen-opgraph --check` must be clean (blocks hand-edited generated data); (ii) `round-ledger.mjs` exits non-zero when Amendment C trips (Artefact 4). Wire both into `verify-site/SKILL.md` as steps 4 and 5. |
| 8 | **EIG ranking** (expected information gain) | **ABSENT** | Closest existing artifact is hand-ranked and unscored: `MASTER-PLAN.md` §"(B) RANKED GAP LIST (value × effort)" (l.800) and the deferred phases in `docs/plans/r28/eastern-greats.md` (E2–E4: Parāśara/BPHS, Buddhaghosa/Milarepa, Ge Hong/Zhang Boduan). | Do **not** build a scoring engine yet. Add an `eig_top: [{id, score, why}]` array to the telemetry JSONL (Artefact 3) filled by the round agent, with a stated 3-term rubric (**structural connectivity** × **evidence obtainability** × **contestedness**). Promote to code only once ~5 rounds of hand-scored data exist to calibrate against. Building the ranker first is ceremony. |
| 9 | **Evidence-differentiated panels** | **✅ DONE — this is the repo's strongest existing match** | The atlas drawer differentiates by epistemic `label`, with the single `debunked` edge (corpus-hermeticum→kybalion) citing Deslippe; `contested.positions[]` renders both sides and is never resolved; `greatworks-east.js` drives **quote-safe vs cite-only badges off per-edition PD determinations** (`quoteSafe` true/false); `practices/mudras.js` carries `harmNote` + `textCaution`. All of it is regression-tested (`r28-atlas-labels.mjs`, `r32-atlas-east.mjs`, `r31-practices-*.mjs`). | **Build nothing.** When op-nodes land (transferable feature #1), reuse the *existing* label→style mapping rather than inventing a second visual vocabulary. |
| 10 | **Amendments A, B, D, E** | **⚠ UNRESOLVED** | Not enough information — only Amendment **C** (machine-printed stop condition) was described in the brief, and it is implemented in Artefact 4. | Request the literal v2 text before implementing. Do not guess at four amendments. |

### Where this repo already satisfies a mandate — stated plainly, so we don't build ceremony

- **The regression harness is done and is better than most.** Three gates, isolated child
  processes, real Chromium, a11y + reduced-motion + print + 390 px. Adding a fourth test runner
  would be pure ceremony.
- **Evidence-differentiated presentation is done and shipped.** Four-value epistemic edge labels
  with per-edge best-witness citations, both-positions-kept contested blocks, and per-edition
  public-domain gating of *quotation itself*. Most "knowledge graph with provenance" projects never
  reach this. It needs no redesign.
- **Determinism of the layout is already asserted.** The micrograd "picture is a pure function of
  the graph" property is met.
- **Per-record provenance discipline is already codified as a skill** (`add-data-module`) and
  enforced by asserts (`every mansion has source + use`, `every Behenian star has source`, `every
  face has image + source`, `every edge carries a non-empty bestCitation`).

**The real gap is narrow and specific: the graph's inputs are not in the repo, nothing can be
ejected, nothing is counted over time, and nothing distinguishes knowledge from instruments.**
That is exactly the four artefacts.

---

# THE FOUR ARTEFACTS TO ADD

Design constraints inherited from the repo, non-negotiable: **no build step**, **no npm
dependencies** in `scripts/` (all three existing gates are dependency-free except puppeteer, which
is ephemeral and env-injected), **pure data / no DOM in `core/`**, **ES modules**, **every script
exits non-zero on failure**, **Windows-path-safe** (use `node:path`, never hard-code separators —
and never hard-code an absolute scratchpad path, cf. the `r28-atlas-labels.mjs:25` defect).

## Artefact 1 — the CURATION GATE file

**Path:** `research/opgraph/gate.json` (tracked). `research/` already exists and already holds
`SOURCE-DATA.md`, so this follows the repo's own convention for *inputs* as distinct from
`assets/js/core/data/` which holds *shipped runtime data*.

**Shape** — one flat array of decisions; every candidate ever considered stays in the file forever.
The file is the graph's conscience, not its content.

```jsonc
{
  "_meta": {
    "gate": "operative-graph",
    "rubricVersion": 1,
    "lastRound": "R33",
    "weightRubric": "weight = min(witness, 1.0) * primaryFactor * contestFactor  (see below)"
  },

  "admitted": [
    {
      "id": "person-vivekananda",
      "kind": "node",                       // node | edge
      "lane": "yoga-vedanta",
      "weight": 0.85,
      "witnesses": [
        { "cite": "De Michelis, A History of Modern Yoga (2004), pp. 149-80",
          "tier": "secondary-scholarly", "locus": "ch. 5", "quoteSafe": false,
          "verbatim": null },
        { "cite": "Vivekananda, Raja Yoga (New York, 1896)",
          "tier": "primary", "locus": "preface", "quoteSafe": true,
          "verbatim": "…" }
      ],
      "label": "documented",                // documented | disputed | debunked | conspiracy
      "contested": {
        "positions": [
          "De Michelis: Raja Yoga is a modern synthesis mediated by Western esotericism",
          "Traditionalist: Raja Yoga is a faithful rendering of Patañjali"
        ]
      },
      "admittedRound": "R32"
    }
  ],

  "excluded": [
    {
      "id": "person-blavatsky-vedanta-edge",
      "kind": "edge",
      "consideredRound": "R32",
      "reasonCode": "no-independent-witness",
      "reason": "Only witness is a 20th-c. Theosophical house history restating its own claim; no non-affiliated source attests the reading.",
      "revisitIf": "A pre-1900 non-Theosophical witness surfaces."
    }
  ],

  "ejected": [
    {
      "id": "edge-example-slug",
      "kind": "edge",
      "admittedRound": "R28",
      "ejectedRound": "R34",
      "reasonCode": "misattribution",
      "reason": "The 'translation' was of a different work of the same title; Deslippe's collation shows no textual dependence.",
      "supersededBy": "edge-corrected-slug",
      "tombstone": true
    }
  ]
}
```

**The weight rubric — evidence-derived, not vibes.** Weight must be a *function of the witness
list*, computable by the artery, so it cannot be argued into existence:

| term | rule |
|---|---|
| `witness` | `0.0` none · `0.5` one witness · `0.8` two independent · `1.0` three+ independent, at least one primary |
| `primaryFactor` | `1.0` if ≥1 `tier:"primary"` witness · `0.85` if all `secondary-scholarly` · `0.6` if any witness is `tertiary`/affiliated |
| `contestFactor` | `1.0` uncontested · `0.9` `contested` with both positions recorded · `0.5` `label:"disputed"` · `0.2` `label:"debunked"` (kept **only** when notable, and always rendered as debunked) |

`weight = witness × primaryFactor × contestFactor`, rounded to 2 dp. **Admission floor: 0.40.**
Anything computing below the floor must move to `excluded` with a `reasonCode`, or gain a witness.

**Reason codes (closed enum, so they are countable):**
`no-independent-witness` · `witness-retracted` · `misattribution` · `duplicate` · `out-of-scope` ·
`debunked-and-not-notable` · `licence-blocked` (cannot be sourced without infringing quotation).

**Ejection protocol (5 steps, and the tombstone is the point):**
1. Ejection is proposed **only** with a named superseding witness or a reason code.
2. The record moves `admitted → ejected`; it is **never deleted** — the array is append-only.
3. `ejectedRound` and `reasonCode` are mandatory; `supersededBy` mandatory for `misattribution` and
   `duplicate`.
4. The artery (Artefact 2) regenerates the shipped data **without** it and **prints the removal in
   the diff** — silent shrinkage is impossible.
5. `engine-test.mjs` asserts: **no `ejected[].id` appears in any shipped data module**, and
   `shipped node count === admitted nodes`, `shipped edge count === admitted edges`. This makes the
   gate load-bearing rather than decorative.

## Artefact 2 — the GRAPH REFRESH ARTERY

**Path:** `scripts/gen-opgraph.mjs` (tracked, dependency-free, idempotent).
**Inputs:** `research/opgraph/gate.json` + `research/opgraph/slices/*.json` (the verified research
slices — the tracked successors of today's untracked `r28data/`, `r31data/`, `r32data/`).
**Output:** the generated data module(s) under `assets/js/core/data/`.

```bash
node scripts/gen-opgraph.mjs            # rebuild + print the diff
node scripts/gen-opgraph.mjs --check    # rebuild to memory; exit 1 if it differs from what's committed
```

**Required properties**
- **Idempotent.** Running twice with no gate change produces a byte-identical file and a diff that
  says `no change`. (Sort keys deterministically; the repo already values byte-stability — R32 log:
  "existing entries/edges byte-stable, sort order preserved".)
- **Emits the header the repo already uses** — `GENERATED — do not hand-edit. Source of truth: …`
  now pointing at a **tracked** path instead of a scratchpad one.
- **`--check` is the anti-drift gate.** Wired into `engine-test.mjs`, it makes hand-editing a
  generated file a *test failure* — which today it silently is not.
- **Fixes the severed artery** by moving `r28build/gen-data.mjs`, `r31build/gen-practices-data.mjs`,
  `r32build/gen-greatworks-east.mjs`, `gen-bhava-phala.mjs`, `gen-yoga-rules.mjs` into this one
  script (or `scripts/gen/` if they must stay separate), and by relocating
  `scratchpad/r28data/edge-labels.json` into `research/opgraph/slices/` so
  **`scripts/tests/r28-atlas-labels.mjs:25` can stop hard-coding an absolute temp path**.

**The diff it must print** (this is what makes it an artery and not a build step):

```
[gen-opgraph] rebuilt from research/opgraph/gate.json (rubricVersion 1)

  NODES  190 → 193   (+4 admitted, -1 ejected)
    + person-buddhaghosa        lane=buddhist      w=0.85  documented   [R33]
    + person-ge-hong            lane=daoist        w=0.80  documented   [R33]
    + work-visuddhimagga        lane=buddhist      w=1.00  documented   [R33]
    + work-baopuzi              lane=daoist        w=0.68  disputed     [R33]
    - edge-example-slug         EJECTED  misattribution -> edge-corrected-slug

  EDGES  155 → 160   (+5, -0)
  LABELS documented 145→149 (+4) · disputed 9→10 (+1) · debunked 1 · conspiracy 0
  WEIGHT mean 0.79 → 0.80   below-floor(<0.40): 0   admitted:193  excluded:11  ejected:1
  ORPHANS 0     CYCLES 0     DANGLING 0

  WROTE assets/js/core/data/confluence.js  (+412 lines, existing records byte-stable)
```

## Artefact 3 — TELEMETRY

**Path:** `docs/telemetry/rounds.jsonl` — **append-only, one JSON object per line**, greppable and
`tail`-able. (Deliberately the `log.md` idea from the llm-wiki gist, in a machine-parsable form.)
**Writer:** `scripts/round-telemetry.mjs`, which *shells the gates that already exist* and parses
their existing stdout — it computes nothing new.

```jsonc
{"round":"R33","date":"2026-07-31","commit":"89e2622",
 "gates":{"audit_problems":0,"engine_test_checks":412,"engine_test_fails":0,
          "browser_pages":96,"browser_errors":0,"drive_warnings":3},
 "graph":{"nodes":193,"edges":160,"lanes":9,
          "labels":{"documented":149,"disputed":10,"debunked":1,"conspiracy":0},
          "weight_mean":0.80,"weight_min":0.42,"below_floor":0,
          "admitted":193,"excluded":11,"ejected":1,"orphans":0,"cycles":0},
 "claims":{"domain_claims_survived":9,"tooling_only":4},
 "cost":{"files_changed":11,"loc_added":612,"loc_removed":48,"wall_minutes":97},
 "eig_top":[{"id":"person-milarepa","score":0.72,
             "why":"connects buddhist<->tibetan lanes (currently 0 cross-edges); PD 1928 Evans-Wentz translation makes evidence cheap; dating contested = high information"}]}
```

**Why JSONL and not a table:** it survives merges (append-only, no conflicts), it trends
(`node -e` over the file gives you weight-mean drift and label-distribution drift across rounds),
and it is the input to Artefact 4. `docs/` is already tracked and already carries `docs/plans/**`.

## Artefact 4 — the TWO-COLUMN ROUND LEDGER + the machine-printed stop condition (Amendment C)

**Paths:** `docs/ROUND-LEDGER.md` (human-readable, regenerated) + `scripts/round-ledger.mjs`
(reads `rounds.jsonl`, prints the ledger and **the stop condition**, exits non-zero when tripped).

**Definitions — sharp, so they cannot be gamed:**

- **`domain_claims_survived`** — a claim *about the subject matter* that entered the graph or the
  site's prose **and survived the gate**: an admitted node/edge at weight ≥ floor, a resolved-and-
  cited contested position, a per-edition PD determination, a corrected attribution, an **ejection**
  (removing a false claim is a domain result and counts +1). *Excludes* anything whose only content
  is the site itself.
- **`tooling_only`** — renderers, layout, tests, scripts, nav, a11y, PWA, refactors, count-assert
  updates. Useful, but not knowledge.
- Ambiguous items count as `tooling_only`. **The tie goes against us** — that is what keeps the
  ledger honest.

**The ledger:**

```markdown
| round | date | domain_claims_survived | tooling_only | ratio | gate |
|-------|------|------------------------|--------------|-------|------|
| R30   | 07-17 | 6                      | 5            | 0.55  | ✅ 0/0/0 |
| R31   | 07-17 | 4                      | 6            | 0.40  | ✅ 0/0/0 |
| R32   | 07-17 | 9                      | 4            | 0.69  | ✅ 0/0/0 |
| R33   | 07-31 | 9                      | 4            | 0.69  | ✅ 0/0/0 |
```

**Amendment C — the stop condition, machine-printed.** Three rules, evaluated over the trailing
window, printed verbatim by `scripts/round-ledger.mjs`:

| rule | condition | print | exit |
|---|---|---|---|
| **C1 — instrument drift (HARD STOP)** | over the **last 3 rounds**, `sum(domain_claims_survived) === 0` while `sum(tooling_only) > 0` | `STOP-CONDITION C1 TRIPPED — rounds R33–R35 produced 0 domain claims and 11 tooling items. The next round MUST be domain-only: no new scripts, no new renderers.` | **3** |
| **C2 — thinning (WARN)** | trailing-3 ratio `domain/(domain+tooling) < 0.20` | `WARN C2 — trailing-3 domain ratio 0.14 (floor 0.20). The system is building instruments faster than knowledge.` | 0 |
| **C3 — rubber-stamp gate (WARN)** | over the **last 5 rounds**, `excluded` and `ejected` both grew by **0** | `WARN C3 — the curation gate has rejected nothing in 5 rounds. A gate that never rejects is not a gate.` | 0 |

C1's non-zero exit is what makes it a **power gate**: add it to `.claude/skills/verify-site/SKILL.md`
as a fourth step, so a round that produced only ceremony **cannot be committed clean**.

---

## RECOMMENDED ORDER (smallest thing that unblocks the most)

1. **Artefact 2 first** (`gen-opgraph.mjs` + move the slices into `research/opgraph/`). It converts
   a repo whose flagship data is *unreproducible* into one that is. It also lets
   `r28-atlas-labels.mjs:25` drop its hard-coded temp path — a live bug.
2. **Artefact 1** (`gate.json`) — the artery needs an input, and the weights unlock transferable
   feature #2 (values on the node face).
3. **Two asserts into `engine-test.mjs`** — acyclicity, and `gen-opgraph --check`.
4. **Artefacts 3 + 4** together (telemetry writes what the ledger reads).
5. **Only then** the op-node rendering (transferable feature #1) — it is a view over data that will
   by then be gate-backed.

---

## Sources

- [karpathy/micrograd](https://github.com/karpathy/micrograd) · [trace_graph.ipynb](https://github.com/karpathy/micrograd/blob/master/trace_graph.ipynb) · [DeepWiki: karpathy/micrograd](https://deepwiki.com/karpathy/micrograd)
- [Karpathy Series — Building Micrograd (Tuan-Anh Bui)](https://tuananhbui89.github.io/blog/2025/karpathy-lec01/) · [Re-writing Micrograd (Will Beckman)](https://willbeckman.com/nn-from-scratch.html)
- [karpathy gist — llm-wiki.md](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [VentureBeat — Karpathy shares 'LLM Knowledge Base' architecture that bypasses RAG](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an)
- [DAIR.AI Academy — LLM Knowledge Bases](https://academy.dair.ai/blog/llm-knowledge-bases-karpathy)
- [Analytics Vidhya — From Karpathy's LLM Wiki to Graphify](https://www.analyticsvidhya.com/blog/2026/04/graphify-guide/)
- [Nodus Labs — Supercharging LLM Wiki with Knowledge Graphs](https://support.noduslabs.com/hc/en-us/articles/26724863249180-Supercharging-LLM-Wiki-with-Knowledge-Graphs-Build-a-Self-Evolving-Research-System)
- [lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki) · [Astro-Han/karpathy-llm-wiki](https://github.com/Astro-Han/karpathy-llm-wiki) · [Obsidian plugin: karpathywiki](https://community.obsidian.md/plugins/karpathywiki)
