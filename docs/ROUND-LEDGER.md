# ROUND LEDGER — two columns, and a stop condition that is computed

**GENERATED FILE. Do not hand-edit.** Source of truth: `docs/telemetry/rounds.jsonl`.
Regenerate with `node scripts/round-ledger.mjs`; append a round with `node scripts/round-telemetry.mjs record --round Rnn …`.
Generated 2026-07-31.

## What the two columns mean

- **`domain_claims_survived`** — a claim **about the subject matter** that entered the graph or the
  site's prose **and survived the gate**: an admitted node or edge at weight ≥ floor · a cited contested
  position · a per-edition public-domain determination · a corrected attribution · **an ejection (+1,
  because removing a false claim is a domain result)**. Excludes anything whose only content is the site itself.
- **`tooling_only`** — renderers, layout, tests, scripts, nav, accessibility, PWA, refactors, count-assert
  updates. Useful; not knowledge.
- **Ambiguous items count as `tooling_only`. The tie goes against us.** That is what keeps this honest.

The columns exist because the round logs structurally *mixed* them: you could not tell from a
MASTER-PLAN entry whether a round produced knowledge or instruments. Now you can, and the number
that embarrasses us is the one this file is for.

## Amendment E — what "(unverified)" means here

Any figure that could not be re-derived from a script **in the round that recorded it** is marked
`(unverified)` every time it is shown. The claim columns are hand-classified by construction — no script
can decide whether a change was knowledge or an instrument — so they are marked on every row. Gate
columns are marked wherever they were transcribed from prose rather than parsed from a live gate run.
A `—` is a figure that does not exist, and it is never rendered as a zero.

## The ledger

| round | date | domain_claims_survived | tooling_only | ratio | gate (audit/engine/browser) |
|-------|------|-----------------------:|-------------:|------:|------------------------------|
| R28 | 2026-07-16 | 11 *(unverified)* | 8 *(unverified)* | 0.58 | clean 0/0/0 *(unverified)* |
| R29 | 2026-07-17 | 8 *(unverified)* | 5 *(unverified)* | 0.62 | · ?/?/? *(unverified)* |
| R30 | 2026-07-17 | 4 *(unverified)* | 6 *(unverified)* | 0.40 | · ?/?/? *(unverified)* |
| R31 | 2026-07-17 | 6 *(unverified)* | 6 *(unverified)* | 0.50 | · ?/?/? *(unverified)* |
| R32 | 2026-07-17 | 9 *(unverified)* | 4 *(unverified)* | 0.69 | · ?/?/? *(unverified)* |
| R33 | 2026-07-30 | 7 *(unverified)* | 9 *(unverified)* | 0.44 | · ?/?/? *(unverified)* |
| R33r | 2026-07-30 | 48 *(unverified)* | 4 *(unverified)* | 0.92 | · ?/?/? *(unverified)* |
| R34 | 2026-07-30 | 2 *(unverified)* | 12 *(unverified)* | 0.14 | clean 0/0/0 |
| R35 | 2026-07-31 | 2 *(unverified)* | 9 *(unverified)* | 0.18 | clean 0/0/0 |
| **all scorable** | | **97** | **63** | **0.61** | |

*1 superseding correction row(s) are on file: `rounds.jsonl` keeps every line and this table
renders the newest row per round. A log may be corrected; it is never rewritten.*

## The stop condition (amendment C) — printed, not remembered

| rule | condition | effect |
|---|---|---|
| **C1 — instrument drift** | over the last 3 scorable rounds, `sum(domain) === 0` while `sum(tooling) > 0` | **HARD STOP, exit 3** |
| **C2 — thinning** | trailing-3 `domain / (domain + tooling) < 0.20` | WARN |
| **C3 — rubber-stamp gate** | over the last 5 rounds, `excluded` **and** `ejected` both grew by 0 | WARN |

This run computed:

```
C1 ok — trailing-3 (R33r, R34, R35): 52 domain, 25 tooling.
C2 ok — trailing-3 domain ratio 0.68 (floor 0.20).
C3 NOT EVALUABLE — 2 of the last 5 rounds carry a curation census (graph.excluded / graph.ejected). C3 cannot pass by default.
NOTE — 3 of the 3 rounds in the C1/C2 window carry (unverified) claim counts (amendment E). The stop condition is computed from figures no script re-derived.
exit 0
```

C1's non-zero exit is what makes it a power gate rather than a note: it is a step of the verify gate,
so a round that produced only ceremony cannot be committed clean.

## Known limits of this file, stated so nobody mistakes it for more than it is

1. **The seeded rows are a hand classification of prose.** R28–R33r were back-filled from `MASTER-PLAN.md`
   (and `docs/plans/opgraph/PLAN.md` §6.3/§8.2 where those state a figure). No script produced them and
   every one is marked `(unverified)`.
2. **Granularity is the load-bearing assumption.** All rows are scored at the coarse "substantive
   statements" granularity that PLAN.md §6.3's own worked example uses for R32 — 9 domain, counting
   102 chapter mappings as roughly one statement and not as 102. Score one round per-record and the
   column stops meaning anything.
3. **Two rounds are numbered R33.** MASTER-PLAN's R33 is the Vedic AI layer; PLAN.md calls the opgraph
   research round R33 as well. They are recorded as `R33` and `R33r`. The collision is real and is
   stated rather than silently renumbered.
4. **Most seeded rounds have no gate figures at all.** Only R28 wrote a gate line into its MASTER-PLAN
   heading. The rest are `—`, which means "not recorded", not "not run".
5. **C2 is a trailing-3 rule, and the round's own ratio is not the rule.** PLAN.md §6.4 predicted that
   the opgraph build round "trips C2" at roughly 0.14 — and its own ratio is 0.14. C2 as specified is
   evaluated over the trailing three rounds, and a heavy research round immediately before a heavy
   build round carries the window. The prediction was about the round; the rule is about the window;
   both are printed above and neither is quietly adjusted to agree with the other.
6. **This file cannot tell you whether the domain claims are true.** It counts claims that survived the
   gate. The gate checks links, imports, engine invariants and console errors. It does not check
   whether a twelfth-century date is right — that is what the curation gate and the hostile audit are
   for, and C3 is the rule that notices when they stop rejecting anything.

