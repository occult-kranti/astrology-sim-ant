# THE LOOP — how a round runs, what state it is in, what is queued

> **This file deliberately contains almost no numbers.**
>
> Every figure about the graph, the roadmap or the ledger is computed by a script
> and printed into a generated file. Copying those numbers here would create a
> second source of truth that goes stale silently — which is the exact failure
> this loop exists to prevent. So this file names **where each number lives** and
> **what it means**; run the command to see the value.
>
> The one thing it does hold is the QUEUE, because a queue is a judgement and
> judgements belong in tracked, hand-authored files.

---

## 1 · What the loop is

Four artifacts, each generated from the one before it. The arrows are real
dependencies, not documentation:

```
  research/opgraph/slices/*.json      hand-authored evidence (the round's output)
  research/opgraph/gate-decisions.json  hand-authored JUDGEMENTS
            │
            │  node scripts/seed-opgraph-gate.mjs        ← arithmetic only
            ▼
  research/opgraph/gate.json          every weight, COMPUTED not argued
            │
            │  node scripts/gen-opgraph.mjs              ← assembly only
            ▼
  assets/js/core/data/opgraph.js      the shipped graph (GENERATED — never hand-edit)
            │
            ├── node scripts/opgraph-eig.mjs --write  →  docs/plans/opgraph/NEXT.md
            │        the ROADMAP, ranked from data statistics
            │
            └── node scripts/round-telemetry.mjs record → docs/telemetry/rounds.jsonl
                     node scripts/round-ledger.mjs      → docs/ROUND-LEDGER.md
                        the LEDGER and its computed stop conditions
```

**The separation that makes it work.** `gate-decisions.json` holds everything
that is a judgement — source tiers, node splits, ejections, minted-author kinds.
`gate.json` holds only what arithmetic produces from those judgements plus the
slices. A weight is therefore never argued into existence; it is recomputed every
run, and `--check` fails loudly if the committed bytes disagree.

**Both generators are dependency-free, idempotent, and have `--check` modes wired
into the gate.** That is what stops `opgraph.js` joining the repo's other orphaned
generated modules, whose generators lived in scratch directories that no longer
exist.

---

## 2 · How a round runs

```bash
NODE=C:/Users/mehta/.conda/envs/astro-workbench/node.exe    # no system node

# 1. edit TRACKED SOURCE only — slices and/or gate-decisions.json
#    (never assets/js/core/data/opgraph.js; it is generated)

# 2. regenerate, IN THIS ORDER — the second stage reads the first's output
$NODE scripts/seed-opgraph-gate.mjs
$NODE scripts/gen-opgraph.mjs

# 3. the gate
$NODE scripts/audit.mjs            # → Problems: 0
$NODE scripts/engine-test.mjs      # → all passed
$NODE scripts/pristine-check.mjs   # → reproducible from tracked state

# 4. the roadmap and the ledger
$NODE scripts/opgraph-eig.mjs --write
$NODE scripts/round-telemetry.mjs record --round Rnn --domain N --tooling M
$NODE scripts/round-ledger.mjs
```

**Running stage 2 alone is a known way to ship red.** It happened: `gate.json`
went stale while `opgraph.js` was rebuilt, and the mismatch was pushed because the
gate's output was not read before committing. Run both, read the output.

**`pristine-check` is not optional and not redundant.** The other checks compare
tracked bytes to generator output *in a tree where the generator just ran*, so
they pass trivially. `pristine-check` exports HEAD into a throwaway worktree and
runs the gate there — it answers "can someone who CLONES this reproduce it?",
which for a while was **no** while every other check said yes.

### Standing rules

- **Repo files are edited only with Write/Edit tools.** PowerShell `Set-Content`
  / `Out-File` mojibakes the UTF-8 in these files, and this corpus is full of
  diacritics.
- **`assets/js/app/local-config.js` is committed EMPTY** and protected with
  `git update-index --skip-worktree`. Verify the `S` flag and that it is not
  staged **before every commit**. Never commit an API key.
- **Build rounds run in a `git worktree`** on their own port, so the working tree
  the dev server reads is never mid-edit. This became standing practice after a
  live edit produced a blank page for the maintainer.
- **`assets/js/core/**` is PURE** — no DOM, no network, no RNG, no `Date`. DOM
  lives only in `assets/js/app/**`.

---

## 3 · Where each number lives

| question | run this | it writes |
|---|---|---|
| what is in the graph? | `node scripts/gen-opgraph.mjs` | prints node/edge census |
| what should the next round do? | `node scripts/opgraph-eig.mjs` | `docs/plans/opgraph/NEXT.md` |
| is the loop producing knowledge or instruments? | `node scripts/round-ledger.mjs` | `docs/ROUND-LEDGER.md` |
| is it reproducible from a clone? | `node scripts/pristine-check.mjs` | stdout only |
| which nodes still need a second witness? | `research/opgraph/corroboration-targets.json` | (snapshot — re-derive if stale) |

---

## 4 · The queue

Ordered. Each entry says **why it sits where it does**, because a queue without
reasons is just a list and gets reordered by whoever is nearest.

### Now

1. **The corroboration round (roadmap action A).** The single largest
   score in `NEXT.md`. The witness term is the only rubric factor a research pass
   can move, and it is at its floor on the single-witness nodes. Targets are
   pinned in `corroboration-targets.json`, disjoint by slice.
   *Blocked on nothing. In flight.*

2. **Apply the corroboration proposal.** `research/opgraph/corroboration-R34.json`
   (81 accepted of 115) is a PROPOSAL — a human attaches the sources, sets tiers
   in `gate-decisions.json`, and regenerates. Nothing in the round edited the
   graph; `git status` after it showed only the two new files.

   **IT CANNOT BE APPLIED MECHANICALLY. The five slices have five different
   source-table shapes**, which the round under-reported as "13 and 14 are
   unkeyed":

   | slice | `meta.sources` shape |
   |---|---|
   | `10-indian-tantra` | array of `{key, cite, accessed, pd}` — keyed on **`key`** |
   | `11-greco-egyptian` | **object map** `{S1: "cite string", …}` (27 entries) |
   | `12-solomonic-western` | array of `{id, cite, rights}` — keyed on **`id`** |
   | `13-east-asian` | **`string[]`, unkeyed** (32) |
   | `14-abrahamic-esoteric` | **`string[]`, unkeyed** (24) |

   So `proposedSourceId` means something different in each file, and for 13/14
   it means nothing yet. **Normalise the source tables first, or apply per-slice
   by hand.** Two traps: slice 10's `proposedSourceId: "S20"` means *attach the
   EXISTING S20*, not create it — Goudriaan & Gupta is already in that table —
   and slice 11's existing S1/S2 are **Wikipedia**, i.e. tertiary, which lowers
   the weight rather than raising it.

   *This same shape-drift bit twice in one day: an `x.id` lookup returned nothing
   on slice 10 because it keys on `key`, and check M's first regex matched 0
   slugs because `confluence.js` quotes its keys. Assume nothing about shape;
   print it.*

### ✅ CLOSED — the inherited-witness defect (fixed and shipped 2026-08-01)

**Shipped.** The cap is live, the cascade is closed, and the fix was in neither
place I first looked. Kept below because the two dead ends are worth more than
the answer: both were plausible, both were wrong, and the third guess only
worked because the first two had been *tested* rather than argued about.

*The actual cause.* A `procedure-type` node is an AGGREGATE — its witnesses are
the union of its member claims' witnesses. Those arrived still carrying
`inherited: true`, so the cap fired on the aggregate: `type:divination-procedure`
computed `witness 0.5 × primary 0.6 = 0.30`, fell under the 0.40 floor, and was
excluded while six live claims still carried its term. "Inherited" describes a
CLAIM's relation to its work; it is meaningless for an aggregate whose whole
evidence *is* its members'. The marker is now stripped on the way up.

*Fixed at the cause, not around it* — not by relaxing the floor, not by
special-casing the op-node invariant. The defect was in neither.

```
                 before        after
inherited        117 @ 0.634    65 @ 0.491
own evidence     129 @ 0.556   129 @ 0.556
inherited >= 0.8  40             0
proc:baopuzi-3   1.00          0.50   (parent work 0.60)
graph            509 nodes     457 · 27 type nodes · 0 orphaned terms
                               0 vocab-occupancy mismatches
```

Roadmap moved with it: B falls 217 → 169 affected, D rises 24 → 36.

<details><summary>The two hypotheses that were killed on the way (kept)</summary>

*H1 — a later pass rewrites `typeTerm`, so pass 6 counts the wrong term.*
KILLED: all six claims had `retypePending: false`, no `retypeTarget`, and
`typeAsFiled === typeTerm`. The term never changed.

*H2 — the liveness prune drops the type node because its claims went first.*
KILLED: the prune iterates `[...live].sort()`, `proc:` sorts before `type:`, and
the claims survive — so its `used` test would have found them. That is what
proved the node was excluded UPSTREAM of the prune, which is what pointed at the
gate, which is what found it.
</details>

### ⚠ SUPERSEDED — the original diagnosis (kept for the record)

**The shipped graph's weights are inverted, and some claims display a citation
that is not among their sources.** Found by the RAG architecture round; every
figure below I re-derived myself against `a7b3cf1`.

`gen-opgraph.mjs:175` `citeText()` flattens an **entire record** — every string
value at any depth — into one blob, and `witnessesFor()` substring-matches source
anchors against that blob. So a procedure-claim nested in a work record inherits
any source named anywhere in its parent, **including prose about a different
procedure**.

```
procedure-claims                246
  witnessesInherited: true      117  (47.6%)   mean weight 0.634
  own evidence                  129             mean weight 0.556
  inherited at weight >= 0.8     40
```

**Claims that inherited their evidence outrank claims that have their own.**
That inverts the one thing the weighting rubric exists to do.

Worked case, confirmed to the digit:

```
proc:baopuzi-3   weight 1.00 (maximum)   witnesses 4   inherited: true
  citeText  "Pregadio 2006"
  sources   13:S10 (Kohn) · 13:S19 (Donner/Stevenson) · 13:S5 (Ware) · 13:S6 (Wang Ming)
  Pregadio is 13:S1 — NOT among this node's sources.
```

This is the fabricated-provenance class again — the fourth instance of the same
shape — but this time **in shipped data, not in a research round**. The sound
join is unaffected: `sources[] → OPGRAPH_META.sources` is 123 sources, 1,307
refs, **0 dangling**, and `witnesses === sources.length` on 509/509. The rot is
in how a claim acquires those sources, not in the resolution.

Related, from the same round: **B14, the artery onto a stump** — `scripts/`
holds exactly one `gen-*` script, while `bhava-phala.js` and `greatworks-east.js`
declare themselves GENERATED. Those two cannot be rebuilt from tracked state.

**THE FIX IS DESIGNED, IMPLEMENTED AND VERIFIED — AND NOT SHIPPED.** It is held
at `…/scratchpad/gen-opgraph-WITHCAP.mjs` and `og-artery-WITHCAP.mjs` because it
cascades further than one round could close honestly. Everything below was
measured, not estimated:

*The cap.* In `computeWeight`, a claim whose witnesses are **all** inherited is
treated as single-witness at best (`witness = min(raw, 0.5)`). The rubric's
witness term asks how many independent witnesses attest **this assertion**;
inherited witnesses attest the **work**, and a well-attested book is not evidence
for one procedure inside it.

*Measured result — the inversion closes:*

```
                 before            after
inherited        117  mean 0.634   65  mean 0.491
own evidence     129  mean 0.556  129  mean 0.556
inherited >= 0.8  40                0
proc:baopuzi-3   1.00 (parent 0.60)  0.50
graph            509 nodes / 246 claims → 454 / 194
```

*Two secondary defects it exposed, both fixed in the held copy:*
1. The shipped `witnessesInherited` flag used `.some()` while the cap keys on
   `.every()`. A mixed-witness claim therefore shipped flagged-but-uncapped.
   Both now use `every`.
2. The anti-drift test rebuilds a witness list from `OPGRAPH_META.sources`, and
   a **source record carries no notion of inheritance** — that is a property of
   the claim's relation to the source. So the test recomputed uncapped and
   reported drift that was not there. `computeWeight` now accepts an explicit
   `allInherited`, which the test passes from the shipped flag.

*Why it is not shipped — the cascade.* Capping drops 52 claims below the 0.40
admission floor (`no-independent-witness` 89 → 144). That is the rubric working:
a claim with only inherited, tertiary-tier evidence genuinely is weak. But the
exclusions **empty out vocabulary terms**, and the invariants that guard
"an empty term is not ceremony" then fire — 22 op-node violations
(`consecration-of-object-talisman`, `divination-procedure` and others left with
claims but no procedure-type node) plus 4 artery failures.

**The remaining work is the cascade, not the cap.** The cap is proven. What is
not yet found is *why* the cascade happens, and two plausible explanations have
already been tested and killed — recorded here so the next attempt does not
re-walk them:

*The symptom, exactly.* Under the cap, six claims carry
`typeTerm: "divination-procedure"` and survive into the shipped graph, while
**no `procedure-type` node exists for that term**. `OPGRAPH_VOCAB` ships
`occupancy: 0` for it. Same shape for `consecration-of-object-talisman` and
`scrying-crystallomancy`. Result: 22 op-node violations + 4 artery failures.

*Hypothesis 1 — a later pass rewrites `typeTerm`, so pass 6 counts the wrong
term.* **KILLED.** All six claims have `retypePending: false`, no
`retypeTarget`, and `typeAsFiled === typeTerm === "divination-procedure"`. The
term never changes.

*Hypothesis 2 — the liveness prune (`gen-opgraph.mjs` ~965) drops the type node
because its claims were dropped first in the same pass.* **KILLED.** The prune
iterates `[...live].sort()`, and `proc:` sorts before `type:`, so claims are
evaluated first; these claims survive, so `used` would be true. The type node is
therefore **never in `live` to begin with** — it is excluded upstream of the
prune, not by it.

*Where to look next:* pass 6 builds each type node's witnesses from its claims
(`dedupeWitnesses(claims.flatMap(c => c.witnesses))`) and the gate then weighs
it. Check whether the type node's own computed weight falls below the admission
floor once its claims are capped — i.e. whether the cap propagates into
type-node weight through that witness roll-up. That is the one path consistent
with "excluded before the prune".

**Verified NOT live on HEAD:** 0 vocab-occupancy mismatches across 53 terms and
0 occupied terms missing a node. This is latent, and the cap surfaces it.

**Nothing new joins the artery until this lands**, because every dataset added
under the current rule inherits the flaw.

### The Horae track  *(maintainer-directed, runs alongside the graph queue)*

**H0. The research protocol is hardened and must be used.** Phase 1 measured a
**21% fabrication-class rate** — 28 of 132 claims carried a citation that does
not support them. Root cause: one agent both searched and wrote, and
`fetched: true` was free text nothing checked. See
[RESEARCH-PROTOCOL.md](horae/RESEARCH-PROTOCOL.md); enforced by
`node scripts/research-validate.mjs --dir research/horae --strict`.
**No Horae data enters the site until it passes.**

**H1. HORARIUM — the per-hour, per-materia, per-location table.**
[Spec](horae/HORARIUM-SPEC.md). Two traditions deep, with the materia column.
Ships in three stages because two of its five columns do not exist:

| stage | scope | blocker |
|---|---|---|
| 1 | Western hours + location + live refresh + materia | none — **can start now** |
| 2 | + Vedic horā ruler column | horā's division rule is CONTESTED; research v2 must name it with a snippet |
| 3 | + Vedic materia | nothing in the repo; needs its own research round |

Stage 1 has one precondition: **resolve the Saturn `'opium, etc.'` row** (§4 of
the spec) — it is the page's most prominent harm-flagged cell, its Picatrix
III.7 citation is already queued as a suspected III.3 conflation, and Agrippa
I.xliv names black poppy *seed*, which is not opium.

**H2. Horae Mundi — the seven-system comparison.** The wider instrument.
Phase 1 returned six dossiers, **all `overallUsable: false`**, so it is stopped
at the research gate. Grid ruling (maintainer, 2026-08-01): **asymmetric, and
the absence is taught** — only Vedic horā (Tier A) and Choghadiya (Tier C) get a
ruler column; zmanim, shichen, Egyptian and Babylonian render none. Two parts
are BLOCKED on acquiring a source and must not be built: the Babylonian watches,
and the Picatrix column of the materials matrix.

### Next — the open defect queue

3. **`picatrix-prayers.js` — FRAMING §9.8, and it is fully live.** Re-verified
   2026-07-30: `pdBasis` occurs **0 times** in the module, so neither of §9.8's
   two required fixes has landed, and the verbatim Greer–Warnock excerpts
   (Adocentyn Press, 2010–11, in copyright) reach **five** call sites:

   | site | what leaves |
   |---|---|
   | `llm-context.js:172` | 160 chars auto-injected into the assistant context |
   | `llm-context.js:622` | the full excerpt in a structured payload |
   | `llm-context.js:929` | a tool returning the full `prayerExcerpt` |
   | `app/picatrix-prayers.js:23` | the full excerpt rendered on the page |
   | `app/workbench.js:631` | 150 chars on the workbench |

   **This ranks first among the defects** because three of those five ship
   in-copyright text to a third-party API on every relevant request — an
   ongoing external disclosure, not a static page problem. §9.8's fixes are
   specific: add `pdBasis` to every prayer record and either re-source to the
   Latin / a PD translation (the site already does this for Dee's *Monas*) or
   mark `cite-only` and substitute the site's own summary; then gate the
   injection on `pdBasis.verdict !== 'cite-only'`. **Paraphrase is not one of
   the options** — a close paraphrase of a translation is still derivative of it.

4. **7 category-confused work→person/event joins.** Same family as the Agrippa
   and `scot-discoverie` findings: an edge whose endpoints are different kinds of
   thing. Checks L and M now catch two shapes of this; these seven are not yet
   covered by a check, which is the argument for doing them as a group and
   writing the check that would have caught them.

5. **Remaining accuracy patchset** — `docs/plans/accuracy/70-PATCHSET.md`:
   the Picatrix III.3-vs-III.7 conflation in `planetary-magic.js` (the harm note
   must follow the hemlock), and the Gheraṇḍa `numberingMapping` provenance
   scoping (P10/P11).

6. **The gate's "2 drive warnings" are two real defects, not noise.** They have
   been riding in every browser sweep as a constant. Root-caused 2026-07-30:

   **(a) `assets/js/app/dial.js` is dead code, and its test can never fail.**
   Nothing imports it — the only other `dial` hits in the repo are `now.js`'s
   unrelated `n-dial` planetary-hours host and the orphaned `.dial` CSS block in
   `style.css`. The drive *"dial arrow keys move the bound input"* runs against
   `pages/handcalc.html`, where `.dial` and `.dial-face` **do not exist**: the
   focus is a no-op, `readValue` returns `null`, ArrowUp goes nowhere, and the
   assertion compares `"null"→"null"` and emits a WARN. A test that cannot pass
   and cannot fail is the same vacuous-check pattern the check-M parse guard was
   written to catch. *Decide: wire the dial, or delete the module, its CSS and
   the drive together. Do not leave it warning.*

   **(b) The workbench records a "recent place" the user never chose.** The page
   renders a default chart on load; that render path ends in
   `picker.commitRecent()` (e.g. `book1-master.js:213`), which pushes the current
   field values into `wb-recent-places`. So the default London coordinates are
   written to recents on every bare page load and always occupy chip 0. Verified
   in Chromium: seed storage with one entry, load the page, and storage comes
   back `[London(fresh ts), Testville]`.
   The chip mechanism itself is **fine** — clicking it filled both lat and lon
   correctly. Two separate things to settle: recents that record places you never
   picked is arguably wrong product behaviour (a maintainer judgement, not a bug
   report), and the drive's assumption that chip 0 is its seeded entry is wrong
   regardless and should target the chip by name.

7. **Confluence lane accents fail the palette validator.** russet `#8a4a22` vs
   sienna `#9a5526` is ΔE 4.4 against a floor of 15 for normal vision — a hard
   FAIL, not a CVD-only warning. 43 cultures cycling 8 hues is the categorical
   anti-pattern; the fix is fold-to-Other or facet, not more hues.

### Then — the three stalled specs

Their research is **complete and tracked**; only the synthesis died on a session
limit. None needs new research to start.

8. **UI-SPEC arbitration** — `docs/plans/opgraph/design/10..13` are four
   independent panel documents that were never arbitrated into one spec. The
   opgraph page is a 68,196px scroll that should be a viewport-filling expandable
   instrument.
9. **EASTERN-SPEC** from `research/eastern/*` (8 files, incl. a hostile audit and
   a nav redesign).
10. **SKINNER-SPEC** from `research/skinner/*` (9 files). No `docs/plans/skinner/`
   exists yet.

### Held deliberately

11. **The locator.** Audited **DO NOT BUILD AS SPECIFIED** (37 strikes, 11
    blockers) — see `docs/plans/locator/PLAN.md`. Its Phase 0 was data-integrity
    preconditions, and those shipped with the repairs above. The deep locator
    ships **with no AI at all** and is useful alone; the AI layer stays gated
    behind pre-registered thresholds with a no-ship fallback fixed in advance.

12. **Roadmap action F — a silent culture.** Mesoamerican, sub-Saharan African,
    Mesopotamian, Shintō/Shugendō, Slavic. The EIG proxy scores it **0 by
    construction** because it ranks over rows that exist and these have none.
    Kept on the board by hand precisely so a metric that can only ever promote
    filling in what is already started does not quietly close the shelf.

---

## 5 · The loop's own defects

Stated here because a loop that measures the work but not itself is the thing it
was built to prevent.

**D1 — the round numbering has collided twice.** `R33` is a MASTER-PLAN round and
`R33r` is the opgraph research round; `R34` appears twice (an advance declaration
and its superseding row). Two numbering series are being pushed through one
identifier space. The ledger survives it — it renders the newest row per round and
keeps every line — but a reader cannot tell which series a bare "R33" means.
*Fix: name the series in the round id, or keep one series. Not yet decided.*

**D2 — stop condition C3 has never been evaluable.** It needs five consecutive
rounds carrying the curation census (`graph.excluded` / `graph.ejected`), and only
one round has ever carried it, because the census is read from the shipped graph
module and most rounds predate it. C3 correctly prints `NOT EVALUABLE` rather than
passing by default. It becomes live after four more rounds record normally — so
**do not pass `--skip-graph`** without a stated reason.

**D3 — every claim count in the ledger is `(unverified)`.** The two columns are
hand-classified by construction; no script can decide whether a change was
knowledge or an instrument. The ledger says so on every row and the stop condition
prints a NOTE that it is computed from figures no script re-derived. This is an
accepted limit, not a bug — but it means C1/C2 are advisory, not authoritative.

**D5 — the round recorder stamps UTC, the operator works in EDT.** R35 was
recorded at `2026-07-30 22:27 EDT` and landed in the ledger as **`2026-07-31`**.
Any round recorded after 20:00 EDT gets the next day's date. This is cosmetic for
trend analysis and wrong for a dated record, and it is logged rather than quietly
patched because rewriting past rows in an append-only ledger is worse than an
off-by-one date. *Fix, if taken: stamp local date at record time; do NOT rewrite
existing rows — append a correction row, which the ledger already supports.*

**D4 — the roadmap had no reader but itself.** `opgraph-eig.mjs` computed the
queue, printed its own statistics as findings, and nothing checked them. A witness
count that had silently collapsed to 1 therefore reported "every node in the graph
is single-witness" for a full round, inflating the top action's affected set from
115 to 347. Now guarded by `scripts/tests/og-eig.mjs`, which recounts
independently. **The general lesson is the one to keep: a number that explains
itself reads exactly like a number that is right.**

---

## 6 · The stop conditions

Computed on every ledger run and printed into `docs/ROUND-LEDGER.md`.

| rule | condition | effect |
|---|---|---|
| **C1 — instrument drift** | over the last 3 scorable rounds, `sum(domain) === 0` while `sum(tooling) > 0` | **HARD STOP, exit 3** |
| **C2 — thinning** | trailing-3 `domain / (domain + tooling) < 0.20` | WARN |
| **C3 — rubber-stamp gate** | over the last 5 rounds, `excluded` **and** `ejected` both grew by 0 | WARN |

C1 and C2 exist because the honest failure mode of a project like this is not
wrong claims — it is a long, satisfying run of building instruments and calling it
research. **Ambiguous items count as `tooling_only`; the tie goes against us.**
C3 exists because a curation gate that never rejects anything is not a gate.

Run `node scripts/round-ledger.mjs` for what they currently say.
