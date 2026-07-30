#!/usr/bin/env node
// ============================================================================
//  round-ledger.mjs — regenerates docs/ROUND-LEDGER.md from docs/telemetry/
//  rounds.jsonl and PRINTS the stop condition. Dependency-free, node built-ins.
//
//  WHY THE STOP CONDITION IS COMPUTED AND NOT REMEMBERED (PLAN.md §6.4,
//  amendment C). A rule that lives in a person's memory is a rule that is
//  followed exactly as long as the person is not busy. This one is arithmetic
//  over an append-only file, run by the gate, and its hard case exits non-zero —
//  so a round that produced only ceremony CANNOT be committed clean. Nothing in
//  ROUND-LEDGER.md is hand-written; edit rounds.jsonl and re-run this.
//
//    C1  HARD STOP  over the last 3 rounds, sum(domain) === 0 while
//                   sum(tooling) > 0                                   exit 3
//    C2  WARN       trailing-3 domain / (domain + tooling) < 0.20       exit 0
//    C3  WARN       over the last 5 rounds, `excluded` AND `ejected`
//                   both grew by 0 — a gate that never rejects is not
//                   a gate                                              exit 0
//
//  HONESTY RULES BUILT INTO THE ARITHMETIC, not into a comment:
//   · A round whose claim counts are null is NOT in the window and is NOT
//     counted as a zero. Absence of data is not evidence of zero domain output,
//     and treating it as such would trip C1 on nothing but our own silence.
//   · A round whose claims are `verified: false` still counts, but its cells
//     render "(unverified)" and the ledger states how much of the window is
//     unverified. Amendment E: a figure no script in its own round could
//     re-derive is marked, every time it is shown.
//   · C3 requires five rounds carrying gate-census fields. Until the opgraph
//     generator ships them, C3 prints NOT EVALUABLE. It never prints "pass" for
//     a check it did not run.
//
//  USAGE
//    node scripts/round-ledger.mjs            # regenerate + print + exit 0|3
//    node scripts/round-ledger.mjs --check    # print only; do not write the file
// ============================================================================
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRounds, latestPerRound, JSONL_PATH, REPO_ROOT } from './round-telemetry.mjs';

export const LEDGER_PATH = join(REPO_ROOT, 'docs', 'ROUND-LEDGER.md');

const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : null);

// A row is "scorable" when both claim columns are real numbers. Everything else
// is displayed but never enters a window.
export function scorable(rows) {
  return rows.filter(r => r && r.claims &&
    num(r.claims.domain_claims_survived) !== null && num(r.claims.tooling_only) !== null);
}

export function ratioOf(domain, tooling) {
  const total = domain + tooling;
  return total === 0 ? null : domain / total;
}

// ---------------------------------------------------------------------------
//  THE STOP CONDITION. A pure function of the rows — which is the whole point:
//  the test feeds it a synthetic history and proves C1 trips, so the printed
//  sentence is arithmetic and not a sentence someone typed once.
// ---------------------------------------------------------------------------
export function stopConditions(rows) {
  const s = scorable(rows);
  const out = { c1: null, c2: null, c3: null, exit: 0, lines: [] };

  const w3 = s.slice(-3);
  const d3 = w3.reduce((a, r) => a + r.claims.domain_claims_survived, 0);
  const t3 = w3.reduce((a, r) => a + r.claims.tooling_only, 0);
  const ids3 = w3.map(r => r.round);
  const unverified3 = w3.filter(r => r.claims.verified === false).length;

  // ---- C1 — instrument drift (HARD STOP) ----------------------------------
  if (w3.length < 3) {
    out.c1 = { tripped: false, evaluable: false };
    out.lines.push(`C1 NOT EVALUABLE — ${w3.length} scorable round(s) on file; the window needs 3.`);
  } else if (d3 === 0 && t3 > 0) {
    out.c1 = { tripped: true, evaluable: true, rounds: ids3, domain: d3, tooling: t3 };
    out.exit = 3;
    out.lines.push(`STOP-CONDITION C1 TRIPPED — rounds ${ids3[0]}–${ids3[ids3.length - 1]} produced 0 domain claims and ${t3} tooling items. The next round MUST be domain-only: no new scripts, no new renderers.`);
  } else {
    out.c1 = { tripped: false, evaluable: true, rounds: ids3, domain: d3, tooling: t3 };
    out.lines.push(`C1 ok — trailing-3 (${ids3.join(', ')}): ${d3} domain, ${t3} tooling.`);
  }

  // ---- C2 — thinning (WARN) -----------------------------------------------
  const r3 = w3.length ? ratioOf(d3, t3) : null;
  if (w3.length < 3) {
    out.c2 = { tripped: false, evaluable: false, ratio: r3 };
    out.lines.push('C2 NOT EVALUABLE — the window needs 3 scorable rounds.');
  } else if (r3 !== null && r3 < 0.20) {
    out.c2 = { tripped: true, evaluable: true, ratio: r3 };
    out.lines.push(`WARN C2 — trailing-3 domain ratio ${r3.toFixed(2)} (floor 0.20). The system is building instruments faster than knowledge.`);
  } else {
    out.c2 = { tripped: false, evaluable: true, ratio: r3 };
    out.lines.push(`C2 ok — trailing-3 domain ratio ${r3 === null ? 'n/a' : r3.toFixed(2)} (floor 0.20).`);
  }

  // ---- C3 — rubber-stamp gate (WARN) --------------------------------------
  // Needs the curation-gate census the opgraph generator writes. Until five
  // rounds carry it, this prints NOT EVALUABLE — never "ok".
  const w5 = rows.slice(-5).filter(r => r.graph && num(r.graph.excluded) !== null && num(r.graph.ejected) !== null);
  if (w5.length < 5) {
    out.c3 = { tripped: false, evaluable: false, have: w5.length };
    out.lines.push(`C3 NOT EVALUABLE — ${w5.length} of the last 5 rounds carry a curation census (graph.excluded / graph.ejected). C3 cannot pass by default.`);
  } else {
    const grewExcluded = w5[w5.length - 1].graph.excluded - w5[0].graph.excluded;
    const grewEjected = w5[w5.length - 1].graph.ejected - w5[0].graph.ejected;
    if (grewExcluded === 0 && grewEjected === 0) {
      out.c3 = { tripped: true, evaluable: true };
      out.lines.push('WARN C3 — the curation gate has rejected nothing in 5 rounds. A gate that never rejects is not a gate.');
    } else {
      out.c3 = { tripped: false, evaluable: true };
      out.lines.push(`C3 ok — over the last 5 rounds excluded grew by ${grewExcluded} and ejected by ${grewEjected}.`);
    }
  }

  if (unverified3) out.lines.push(`NOTE — ${unverified3} of the ${w3.length} rounds in the C1/C2 window carry (unverified) claim counts (amendment E). The stop condition is computed from figures no script re-derived.`);
  const skipped = rows.length - s.length;
  if (skipped) out.lines.push(`NOTE — ${skipped} recorded round(s) carry no claim counts and are shown in the table but excluded from every window. Absence of data is not counted as zero.`);

  return out;
}

// ---------------------------------------------------------------------------
//  The rendered ledger.
// ---------------------------------------------------------------------------
const cell = (v, unverified) => (v === null || v === undefined ? '—' : `${v}${unverified ? ' *(unverified)*' : ''}`);

function gateCell(r) {
  const g = r.gates || {};
  const bits = [
    g.audit_problems == null ? '?' : String(g.audit_problems),
    g.engine_test_fails == null ? '?' : String(g.engine_test_fails),
    g.browser_errors == null ? '?' : String(g.browser_errors),
  ].join('/');
  const clean = g.audit_problems === 0 && g.engine_test_fails === 0 && g.browser_errors === 0;
  const mark = bits.includes('?') ? '·' : (clean ? 'clean' : 'RED');
  return `${mark} ${bits}${r.gates_verified ? '' : ' *(unverified)*'}`;
}

export function renderLedger(rows, stops, { now = null, superseded = 0 } = {}) {
  const s = scorable(rows);
  const totalD = s.reduce((a, r) => a + r.claims.domain_claims_survived, 0);
  const totalT = s.reduce((a, r) => a + r.claims.tooling_only, 0);
  const totalR = ratioOf(totalD, totalT);

  const lines = [];
  lines.push('# ROUND LEDGER — two columns, and a stop condition that is computed');
  lines.push('');
  lines.push('**GENERATED FILE. Do not hand-edit.** Source of truth: `docs/telemetry/rounds.jsonl`.');
  lines.push('Regenerate with `node scripts/round-ledger.mjs`; append a round with `node scripts/round-telemetry.mjs record --round Rnn …`.');
  if (now) lines.push(`Generated ${now}.`);
  lines.push('');
  lines.push('## What the two columns mean');
  lines.push('');
  lines.push('- **`domain_claims_survived`** — a claim **about the subject matter** that entered the graph or the');
  lines.push('  site\'s prose **and survived the gate**: an admitted node or edge at weight ≥ floor · a cited contested');
  lines.push('  position · a per-edition public-domain determination · a corrected attribution · **an ejection (+1,');
  lines.push('  because removing a false claim is a domain result)**. Excludes anything whose only content is the site itself.');
  lines.push('- **`tooling_only`** — renderers, layout, tests, scripts, nav, accessibility, PWA, refactors, count-assert');
  lines.push('  updates. Useful; not knowledge.');
  lines.push('- **Ambiguous items count as `tooling_only`. The tie goes against us.** That is what keeps this honest.');
  lines.push('');
  lines.push('The columns exist because the round logs structurally *mixed* them: you could not tell from a');
  lines.push('MASTER-PLAN entry whether a round produced knowledge or instruments. Now you can, and the number');
  lines.push('that embarrasses us is the one this file is for.');
  lines.push('');
  lines.push('## Amendment E — what "(unverified)" means here');
  lines.push('');
  lines.push('Any figure that could not be re-derived from a script **in the round that recorded it** is marked');
  lines.push('`(unverified)` every time it is shown. The claim columns are hand-classified by construction — no script');
  lines.push('can decide whether a change was knowledge or an instrument — so they are marked on every row. Gate');
  lines.push('columns are marked wherever they were transcribed from prose rather than parsed from a live gate run.');
  lines.push('A `—` is a figure that does not exist, and it is never rendered as a zero.');
  lines.push('');
  lines.push('## The ledger');
  lines.push('');
  lines.push('| round | date | domain_claims_survived | tooling_only | ratio | gate (audit/engine/browser) |');
  lines.push('|-------|------|-----------------------:|-------------:|------:|------------------------------|');
  for (const r of rows) {
    const c = r.claims || {};
    const d = num(c.domain_claims_survived), t = num(c.tooling_only);
    const unv = c.verified === false;
    const ratio = (d === null || t === null) ? null : ratioOf(d, t);
    lines.push(`| ${r.round} | ${r.date} | ${cell(d, unv)} | ${cell(t, unv)} | ${ratio === null ? '—' : ratio.toFixed(2)} | ${gateCell(r)} |`);
  }
  lines.push(`| **all scorable** | | **${totalD}** | **${totalT}** | **${totalR === null ? '—' : totalR.toFixed(2)}** | |`);
  lines.push('');
  if (superseded) {
    lines.push(`*${superseded} superseding correction row(s) are on file: \`rounds.jsonl\` keeps every line and this table`);
    lines.push('renders the newest row per round. A log may be corrected; it is never rewritten.*');
    lines.push('');
  }
  lines.push('## The stop condition (amendment C) — printed, not remembered');
  lines.push('');
  lines.push('| rule | condition | effect |');
  lines.push('|---|---|---|');
  lines.push('| **C1 — instrument drift** | over the last 3 scorable rounds, `sum(domain) === 0` while `sum(tooling) > 0` | **HARD STOP, exit 3** |');
  lines.push('| **C2 — thinning** | trailing-3 `domain / (domain + tooling) < 0.20` | WARN |');
  lines.push('| **C3 — rubber-stamp gate** | over the last 5 rounds, `excluded` **and** `ejected` both grew by 0 | WARN |');
  lines.push('');
  lines.push('This run computed:');
  lines.push('');
  lines.push('```');
  for (const l of stops.lines) lines.push(l);
  lines.push(`exit ${stops.exit}`);
  lines.push('```');
  lines.push('');
  lines.push('C1\'s non-zero exit is what makes it a power gate rather than a note: it is a step of the verify gate,');
  lines.push('so a round that produced only ceremony cannot be committed clean.');
  lines.push('');
  lines.push('## Known limits of this file, stated so nobody mistakes it for more than it is');
  lines.push('');
  lines.push('1. **The seeded rows are a hand classification of prose.** R28–R33r were back-filled from `MASTER-PLAN.md`');
  lines.push('   (and `docs/plans/opgraph/PLAN.md` §6.3/§8.2 where those state a figure). No script produced them and');
  lines.push('   every one is marked `(unverified)`.');
  lines.push('2. **Granularity is the load-bearing assumption.** All rows are scored at the coarse "substantive');
  lines.push('   statements" granularity that PLAN.md §6.3\'s own worked example uses for R32 — 9 domain, counting');
  lines.push('   102 chapter mappings as roughly one statement and not as 102. Score one round per-record and the');
  lines.push('   column stops meaning anything.');
  lines.push('3. **Two rounds are numbered R33.** MASTER-PLAN\'s R33 is the Vedic AI layer; PLAN.md calls the opgraph');
  lines.push('   research round R33 as well. They are recorded as `R33` and `R33r`. The collision is real and is');
  lines.push('   stated rather than silently renumbered.');
  lines.push('4. **Most seeded rounds have no gate figures at all.** Only R28 wrote a gate line into its MASTER-PLAN');
  lines.push('   heading. The rest are `—`, which means "not recorded", not "not run".');
  lines.push('5. **C2 is a trailing-3 rule, and the round\'s own ratio is not the rule.** PLAN.md §6.4 predicted that');
  lines.push('   the opgraph build round "trips C2" at roughly 0.14 — and its own ratio is 0.14. C2 as specified is');
  lines.push('   evaluated over the trailing three rounds, and a heavy research round immediately before a heavy');
  lines.push('   build round carries the window. The prediction was about the round; the rule is about the window;');
  lines.push('   both are printed above and neither is quietly adjusted to agree with the other.');
  lines.push('6. **This file cannot tell you whether the domain claims are true.** It counts claims that survived the');
  lines.push('   gate. The gate checks links, imports, engine invariants and console errors. It does not check');
  lines.push('   whether a twelfth-century date is right — that is what the curation gate and the hostile audit are');
  lines.push('   for, and C3 is the rule that notices when they stop rejecting anything.');
  lines.push('');
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
//  CLI
// ---------------------------------------------------------------------------
const INVOKED_DIRECTLY = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (INVOKED_DIRECTLY) {
  const checkOnly = process.argv.includes('--check');
  if (!existsSync(JSONL_PATH)) {
    console.error(`[round-ledger] no ${JSONL_PATH}. Run: node scripts/round-telemetry.mjs seed`);
    process.exit(1);
  }
  const all = readRounds();
  const rows = latestPerRound(all);
  const stops = stopConditions(rows);
  const md = renderLedger(rows, stops, { now: new Date().toISOString().slice(0, 10), superseded: all.length - rows.length });
  if (!checkOnly) {
    mkdirSync(dirname(LEDGER_PATH), { recursive: true });
    writeFileSync(LEDGER_PATH, md, 'utf8');
    console.log(`[round-ledger] wrote docs/ROUND-LEDGER.md (${rows.length} rounds).`);
  } else {
    const current = existsSync(LEDGER_PATH) ? readFileSync(LEDGER_PATH, 'utf8') : '';
    // The generated-on date line is the one volatile row; compare without it.
    const strip = t => t.split('\n').filter(l => !l.startsWith('Generated ')).join('\n');
    if (strip(current) !== strip(md)) {
      console.error('[round-ledger] --check: docs/ROUND-LEDGER.md is STALE. Run node scripts/round-ledger.mjs');
      process.exit(1);
    }
    console.log('[round-ledger] --check: ROUND-LEDGER.md is current.');
  }
  console.log('');
  for (const l of stops.lines) console.log(l);
  process.exit(stops.exit);
}
