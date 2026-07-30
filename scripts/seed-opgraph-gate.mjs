#!/usr/bin/env node
// ============================================================================
//  scripts/seed-opgraph-gate.mjs — writes research/opgraph/gate.json.
//
//  TRACKED. DEPENDENCY-FREE. IDEMPOTENT. DETERMINISTIC.
//
//  WHY THIS EXISTS SEPARATELY FROM THE ARTERY. gate.json holds one thing the
//  artery must never compute for itself: the ADMISSION DECISION. But it must
//  also hold ~700 weights, and a weight that a human types is a weight that was
//  argued into existence — the exact failure the rubric exists to prevent. So
//  the two halves are split:
//
//    gate-decisions.json  the JUDGEMENTS  — hand-authored: source tiers, endpoint
//                                          dispositions, the eight audit strikes,
//                                          the blockers, the node splits.
//    gate.json            the ARITHMETIC  — generated from decisions + slices by
//                                          this script, and RE-CHECKED on every
//                                          run of the artery (a stored weight that
//                                          disagrees with the recomputed one is a
//                                          hard failure, not an override).
//
//  BOTH FILES ARE APPEND-ONLY IN SPIRIT AND TOMBSTONED IN FACT: a record is
//  never deleted. It moves admitted → ejected, keeping its reason code, its
//  strike id and the round that ejected it. THE FILE IS THE GRAPH'S CONSCIENCE,
//  NOT ITS CONTENT.
//
//  MODES:
//    node scripts/seed-opgraph-gate.mjs           write research/opgraph/gate.json
//    node scripts/seed-opgraph-gate.mjs --check   exit 1 if the committed gate
//                                                 is not this script's output
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ROOT, ROUND_ID, ADMISSION_FLOOR, RUBRIC_VERSION,
  readInputs, buildCandidates, computeWeight, cascade,
} from './gen-opgraph.mjs';

const GATE_PATH = join(ROOT, 'research', 'opgraph', 'gate.json');

const REASON_CODES = ['no-independent-witness', 'witness-retracted', 'misattribution',
  'duplicate', 'out-of-scope', 'debunked-and-not-notable', 'licence-blocked',
  'razor-violation', 'reverses-chronology'];
const EJECTED_BY = ['audit-strike', 'licence', 'superseding-witness', 'razor', 'operator'];

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

export function buildGate() {
  const inputs = readInputs({ withGate: false });
  const { decisions } = inputs;
  const candidates = buildCandidates(inputs);

  for (const t of decisions.ejected) {
    if (!REASON_CODES.includes(t.reasonCode)) throw new Error(`seed-gate: ejected ${t.id} has reasonCode "${t.reasonCode}" outside the closed enum`);
    if (!EJECTED_BY.includes(t.ejectedBy)) throw new Error(`seed-gate: ejected ${t.id} has ejectedBy "${t.ejectedBy}" outside the closed enum`);
    if (!t.ejectedRound) throw new Error(`seed-gate: ejected ${t.id} has no ejectedRound`);
    if ((t.reasonCode === 'misattribution' || t.reasonCode === 'duplicate') && !t.supersededBy) {
      throw new Error(`seed-gate: ejected ${t.id} has reasonCode ${t.reasonCode}, which REQUIRES supersededBy`);
    }
  }
  for (const x of decisions.excluded) {
    if (!REASON_CODES.includes(x.reasonCode)) throw new Error(`seed-gate: excluded ${x.id} has reasonCode "${x.reasonCode}" outside the closed enum`);
    if (!x.revisitIf) throw new Error(`seed-gate: excluded ${x.id} has no revisitIf. An exclusion without a named condition for reconsideration is a deletion with better manners.`);
  }

  const ejectedIds = new Set(decisions.ejected.map(e => e.id));
  const admitted = [];
  const excluded = [];

  for (const n of [...candidates.nodes.values()].sort((a, b) => cmp(a.id, b.id))) {
    const r = computeWeight({ witnesses: n.witnesses, label: n.label_ || 'documented', contested: n.contested || null, flags: n.flags || [] });
    if (r.weight !== n.weight) throw new Error(`seed-gate: weight recomputation disagreed for ${n.id}`);
    if (ejectedIds.has(n.id)) continue;
    const row = {
      id: n.id, kind: 'node', nodeType: n.type, label: n.label,
      witnesses: n.witnesses.map(w => ({ key: w.key, slice: w.slice, tier: w.tier, cite: w.cite, inherited: w.inherited || undefined })),
      epistemicLabel: n.label_ || 'documented',
      contestedPositions: n.contested ? n.contested.positions.length : 0,
      flags: n.flags || [],
      factors: { witness: r.witness, primaryFactor: r.primaryFactor, contestFactor: r.contestFactor, flagFactor: r.flagFactor },
      weight: r.weight,
      admittedRound: ROUND_ID,
    };
    if (r.weight < ADMISSION_FLOOR) {
      excluded.push({
        id: n.id, kind: 'node', nodeType: n.type, consideredRound: ROUND_ID,
        reasonCode: 'no-independent-witness',
        reason: `Weight ${r.weight} is below the 0.40 admission floor. Computed, not argued: witness ${r.witness} × primary ${r.primaryFactor} × contest ${r.contestFactor} × flag ${r.flagFactor}. ${n.flags && n.flags.length ? `Flags carried: ${n.flags.join(', ')}. ` : ''}${n.witnesses.length === 0 ? 'No citation in this record resolved to a declared source, so it has no witnesses at all.' : `${n.witnesses.length} witness(es): ${n.witnesses.map(w => w.tier).join(', ')}.`}`,
        revisitIf: 'An independent witness is added, or the flag that reduced the weight is cleared at page level.',
        weight: r.weight, factors: row.factors,
      });
      continue;
    }
    admitted.push(row);
  }

  // the cascade: a claim cannot outlive the record it is a claim about
  const rowById = new Map(admitted.map(a => [a.id, a]));
  const { live, removed } = cascade(candidates.nodes, rowById.keys());
  for (const [id, why] of [...removed].sort((a, b) => cmp(a[0], b[0]))) {
    const r = rowById.get(id);
    if (!r) continue;
    excluded.push({
      id, kind: 'node', nodeType: r.nodeType, consideredRound: ROUND_ID,
      reasonCode: 'out-of-scope',
      reason: `Cascaded out of the graph: ${why}. Its own weight was ${r.weight}, at or above the floor — this record was not judged thin, it was left without a record to be a claim about. Removing the record and keeping the claim is how a graph grows phantom nodes.`,
      revisitIf: 'The endpoint that took it is itself admitted.',
      weight: r.weight, factors: r.factors,
    });
  }
  const survived = admitted.filter(a => live.has(a.id));
  admitted.length = 0;
  admitted.push(...survived);
  for (const a of admitted) {
    const n = candidates.nodes.get(a.id);
    if (n && n.type === 'procedure-type') a.occupancy = n.occupancy;
  }

  // held works and the decisions' own exclusions
  for (const [id, h] of Object.entries(decisions.heldWorks)) {
    if (id === '_note') continue;
    excluded.push({ id, kind: 'node', nodeType: 'work', consideredRound: ROUND_ID,
      reasonCode: h.reasonCode, blocker: h.blocker, reason: h.reason, revisitIf: h.revisitIf });
  }
  for (const x of decisions.excluded) {
    excluded.push({ id: x.id, kind: x.kind, consideredRound: x.consideredRound,
      reasonCode: x.reasonCode, blocker: x.blocker || null, reason: x.reason,
      revisitIf: x.revisitIf, shipsAsNonEdge: x.shipsAsNonEdge || undefined });
  }

  // edges are admitted as bookkeeping so W4's count assert is a control, not a document
  const liveNodes = new Set(admitted.map(a => a.id));
  const edgeRows = candidates.edges
    .filter(e => liveNodes.has(e.from) && liveNodes.has(e.to))
    .map(e => ({ id: `${e.kind}|${e.from}|${e.to}`, kind: 'edge', edgeKind: e.kind, admittedRound: ROUND_ID }));
  const seenEdge = new Set();
  const edgesUnique = [];
  for (const e of edgeRows.sort((a, b) => cmp(a.id, b.id))) if (!seenEdge.has(e.id)) { seenEdge.add(e.id); edgesUnique.push(e); }

  const gate = {
    _meta: {
      gate: 'operative-graph',
      rubricVersion: RUBRIC_VERSION,
      lastRound: ROUND_ID,
      admissionFloor: ADMISSION_FLOOR,
      weightRubric: 'weight = witness × primaryFactor × contestFactor × flagFactor  (2dp)',
      rubricTerms: {
        witness: '0.0 none · 0.5 one · 0.8 two independent · 1.0 three+ independent with >=1 primary',
        primaryFactor: '1.0 if >=1 tier:"primary" · 0.85 if all secondary-scholarly · 0.6 if any witness is tertiary or affiliated',
        contestFactor: '1.0 uncontested · 0.9 contested with both positions recorded · 0.5 label:"disputed" · 0.2 label:"debunked"',
        flagFactor: '1.0 clean · 0.7 carries (unverified) · 0.0 carries UNVERIFIED-DO-NOT-QUOTE on a load-bearing claim',
      },
      reasonCodes: REASON_CODES,
      ejectedBy: EJECTED_BY,
      generatedBy: 'scripts/seed-opgraph-gate.mjs',
      decisions: 'research/opgraph/gate-decisions.json',
      note: 'THREE APPEND-ONLY ARRAYS. Every candidate ever considered stays in this file forever. A record is never deleted; it is tombstoned. The file is the graph\'s conscience, not its content.',
      ejectionProtocol: [
        '1. Ejection is proposed ONLY with a named superseding witness or a reason code.',
        '2. The record moves admitted → ejected; it is NEVER deleted. The array is append-only.',
        '3. ejectedRound, ejectedBy and reasonCode are mandatory; supersededBy is mandatory for misattribution and duplicate; retainedAsNote is mandatory when the observation survives as prose.',
        '4. The artery regenerates the shipped data WITHOUT it and PRINTS THE REMOVAL IN THE DIFF. Silent shrinkage is impossible.',
        '5. scripts/tests/og-artery.mjs asserts write-invariant W4. This is what makes the gate load-bearing rather than decorative.',
      ],
      counts: {
        admittedNodes: admitted.length,
        admittedEdges: edgesUnique.length,
        excluded: excluded.length,
        ejected: decisions.ejected.length,
      },
    },
    admitted: [...admitted, ...edgesUnique],
    excluded: excluded.sort((a, b) => cmp(a.id, b.id)),
    ejected: decisions.ejected.map(t => ({ ...t })).sort((a, b) => cmp(a.id, b.id)),
  };
  return { gate, candidates, text: JSON.stringify(gate, null, 1) + '\n' };
}

export function main(argv = process.argv.slice(2)) {
  const check = argv.includes('--check');
  const { gate, text } = buildGate();
  const prev = existsSync(GATE_PATH) ? readFileSync(GATE_PATH, 'utf8') : null;
  if (check) {
    if (prev !== text) {
      process.stderr.write('[seed-gate] --check FAILED: research/opgraph/gate.json is not this script\'s output.\n');
      return 1;
    }
    process.stdout.write('[seed-gate] --check OK.\n');
    return 0;
  }
  const m = gate._meta.counts;
  process.stdout.write(`[seed-gate] admitted ${m.admittedNodes} nodes + ${m.admittedEdges} edges · excluded ${m.excluded} · ejected ${m.ejected}\n`);
  const byCode = {};
  for (const e of [...gate.excluded, ...gate.ejected]) byCode[e.reasonCode] = (byCode[e.reasonCode] || 0) + 1;
  process.stdout.write(`           reason codes: ${Object.entries(byCode).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}\n`);
  if (prev === text) process.stdout.write('           NO CHANGE — gate.json is already byte-identical.\n');
  else { writeFileSync(GATE_PATH, text); process.stdout.write(`           WROTE research/opgraph/gate.json (${text.length} bytes)\n`); }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try { process.exit(main()); }
  catch (err) { process.stderr.write(`[seed-gate] FAILED: ${err.message}\n`); process.exit(1); }
}
