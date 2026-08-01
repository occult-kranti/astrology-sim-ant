# HANDOFF — paste this to pick the work back up

> Written 2026-07-30 at the end of the loop-integrity round (R35).
> Read `docs/plans/LOOP.md` first — it holds the queue and how a round runs.
> **Verify everything below against the repo before acting on it.** This file is a
> point-in-time note; the loop's whole doctrine is that remembered numbers rot.

---

## The prompt

```
Continue work on The Astrologer's Workbench (c:/Users/mehta/OneDrive/Documents/github/2026/astrology-sim-ant).

Read docs/plans/LOOP.md — it is the operating document: what the loop is, how a
round runs, the ordered queue with reasons, and the loop's own known defects.
Then re-derive current state rather than trusting any number written down:

  NODE=C:/Users/mehta/.conda/envs/astro-workbench/node.exe
  $NODE scripts/audit.mjs                 # → Problems: 0
  $NODE scripts/engine-test.mjs           # → all passed
  $NODE scripts/pristine-check.mjs        # → reproducible from tracked state
  $NODE scripts/opgraph-eig.mjs           # → the ranked roadmap
  $NODE scripts/round-ledger.mjs          # → the two-column ledger + stop conditions

Then take the top item in LOOP.md §4 that is not already done.

Standing rules that have each already been violated once, so they are not
theoretical:
  - Edit repo files ONLY with Write/Edit tools. PowerShell Set-Content/Out-File
    mojibakes the UTF-8, and this corpus is full of diacritics.
  - Never hand-edit assets/js/core/data/opgraph.js. It is generated. Edit the
    slices or gate-decisions.json, then run seed-opgraph-gate.mjs AND
    gen-opgraph.mjs, in that order — running only the second ships a stale gate.
  - READ the gate output before committing. Do not chain `git add` behind it.
  - Verify `git ls-files -v assets/js/app/local-config.js` shows `S` and that the
    file is not staged, before every commit. It holds an API key locally and
    ships empty.
  - Build rounds run in a `git worktree` on their own port. The maintainer's dev
    server reads the main working tree; editing it live has produced a blank page
    for them before.
  - Load-green is not done. A missing figure throws no error. Drive the page in
    Chromium and assert the thing you changed actually rendered.
```

---

## Where things stood

**HEAD was green and pushed**, verified on a pristine export (a fresh `git
worktree` checkout of HEAD), not just in the working tree.

Commits from this round, most recent last:

| commit | what |
|---|---|
| `a06f0f2` | the roadmap was ranking on a witness count that had collapsed to 1 |
| `20e15a4` | check reproducibility against a clone, not against my working tree |
| `48ea754` | a man was labelled with his forger's name — and the rule that did it |
| `11f0c7f` | twelve atlas links pointed at pages that do not exist |
| `4b54050` | the 115 single-witness nodes action A must corroborate |

### In flight when this was written

**The corroboration round** — a background workflow over the 115 single-witness
nodes: 5 finders on disjoint slices → adversarial refuters → integrator. It writes
a **proposal**, not a change:

- `research/opgraph/corroboration-R34.md` — the honest coverage report
- `research/opgraph/corroboration-R34.json` — accepted witnesses, slice-ready

**Check whether those files exist before doing anything else.** If they do, the
next task is applying them (LOOP.md §4 item 2): add each source to its slice's
`meta.sources`, attach the id to the node, set the tier in `gate-decisions.json`,
regenerate through both stages, and re-run the gate. If they do not exist, the
workflow did not finish — its transcript is under
`.claude/projects/…/subagents/workflows/`, and `journal.jsonl` there records what
each agent actually returned.

**Do not accept a witness the refuter rejected**, and do not soften the report's
numbers. The round was explicitly told a confirmed absence is a good result, so a
low accepted count is a real finding and not a reason to re-run it.

---

## The four things worth carrying forward

**1. A number that explains itself reads exactly like a number that is right.**
The EIG ranker computed the roadmap, printed its own statistics as findings, and
nothing checked them. `witnesses` is an array in the slices and a *count* in the
shipped module; the ranker used the array logic on the count, so every count ≥ 1
became 1. It reported "every node in the graph is single-witness" for a full round
and inflated the top action from 115 affected nodes to 347. The graph was never
wrong — the gate reads the array shape correctly, so every shipped weight held.
Only the planning layer was wrong, and it was the layer with nothing downstream.

**2. Working-tree green is not repository green.** The generators write LF, git
checked out CRLF, and a fresh clone therefore held bytes that could never equal
generator output. Every test passed; every clone failed. `scripts/pristine-check.mjs`
now runs the gate in a throwaway worktree of HEAD. Keep using it.

**3. Automate the detection; keep the judgement.** `person:agrippa` was labelled
"pseudo-Agrippa; anonymous" because the generator picks the *shortest* author
string and cannot tell a short name from a denial of the name. The obvious fix —
prefer a non-denial variant — was tested and **rejected**: it would have
relabelled `au:anonymous` with a prose sentence. The slices' `author` field is
overloaded, so no automatic rule is safe. The fix was structural (give the forgery
its own node, matching what the corpus already did for pseudo-Peter of Abano and
pseudo-Majrīṭī), plus a *detector* — check L — which then immediately caught a
second case, `ea:author-kukai`, that nobody had looked at.

**4. Guard the check's own parse.** Check M validates that every shipped
`atlasSlug` resolves in the atlas. Its first regex expected `slug: 'x'` while
`confluence.js` writes `"slug": "x"` — it matched **0 slugs** and would have
passed vacuously forever. The `> 100` guard caught it. A check that finds nothing
looks exactly like a check that finds nothing wrong.

---

## The Horae track — read this before touching it

Two deliverables, one protocol, and a hard-won reason for the protocol.

**The protocol is the point.** Horae phase 1 produced six dossiers and **not one
was usable** — `overallUsable: false` across the board, 41 blockers. Measured
from the run's own journal: **28 of 132 claims (21%) carried a citation that
does not support them.** Not wrong facts — right facts with invented provenance,
which survives spot-checking while the citation rots underneath.

The cause was structural: one agent searched *and* wrote, so a citation recalled
from training data was indistinguishable from one read off a page. The fix is
[RESEARCH-PROTOCOL.md](horae/RESEARCH-PROTOCOL.md) — fetcher/compiler split,
`snippet` required, gaps carry a search burden, field may not contradict its
note — enforced by `scripts/research-validate.mjs`. **Run it with `--strict`
before believing any dossier.**

**H1 · HORARIUM** ([spec](horae/HORARIUM-SPEC.md)) — the per-hour, per-materia,
per-location table, Western + Vedic. **Stage 1 (Western) is unblocked and is the
best next build.** Stage 2 waits on the horā division rule, which is genuinely
contested — two readings give different answers for the same moment, so it must
not be guessed. Stage 3 (Vedic materia) has *nothing* in the repo to build on.

**H2 · Horae Mundi** — the seven-system comparison, stopped at the research
gate. Grid ruling: asymmetric, absence taught.

**The trap in the materia column:** `planetary-magic.js` is built around FRAMING
§5 C-1, the operable triple — `substance`, `quantity`, `processParam` live in
three typed fields precisely so the third has nowhere to live. **Render the
fields; never interpolate them into a sentence.** A prose template re-creates the
triple in free text and defeats the whole design.

## Two open questions the next session should decide

**D1 — the round numbering has collided twice.** `R33` is a MASTER-PLAN round and
`R33r` the opgraph research round; `R34` appears as both an advance declaration
and its superseding row. Two series share one identifier space. Either name the
series in the id or collapse to one. Undecided on purpose — it is the
maintainer's call.

**D2 — the ratio is thinning and it is being recorded, not hidden.** R34 declared
2 domain / 12 tooling; R35 is 2 / 9. Two consecutive instrument-heavy rounds. C1
and C2 do not trip yet because R33r's 48 domain claims are still in the trailing-3
window — but they will fall out. The corroboration round is the domain round;
**if it lands thin, the next round must be domain-only**, not another instrument.
That is exactly what the two columns exist to make impossible to miss.
