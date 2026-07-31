// ============================================================================
//  scripts/tests/og-eig.mjs — THE ROADMAP READS THE GRAPH CORRECTLY.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs.
//  Deterministic; no DOM, no network.
//
//  WHY THIS FILE EXISTS. `witnesses` has two shapes in this repo: an ARRAY of
//  witness records in the slices and inside seed-opgraph-gate.mjs, and a COUNT
//  in the shipped module, which is what gen-opgraph.mjs collapses it to. The
//  EIG ranker reads the shipped module but was written against the slice shape:
//
//      Array.isArray(x.witnesses) ? x.witnesses.length : x.witnesses ? 1 : 0
//
//  A count of 8 is not an array, and it is truthy, so it returned 1. Every count
//  >= 1 became 1, the whole graph looked single-witness, and the roadmap's
//  top-ranked action was inflated from 115 affected nodes to 347 — ranking it
//  first by 4x when its true margin is 1.4x.
//
//  This was invisible because it was self-consistent: the ranker's OWN output
//  reported the false figure as if it were a finding, and a wrong number that
//  explains itself reads exactly like a right one. The gate never had the bug
//  (it reads the array shape, so the shipped WEIGHTS were always correct) — only
//  the planning layer did, which is the layer with no downstream check.
//
//  The assertions below are therefore about SHAPE AGREEMENT, not about any
//  particular figure. They must not be rewritten to pin today's counts: those
//  move every round by design.
// ============================================================================

import { OPGRAPH_NODES } from '../../assets/js/core/data/opgraph.js';

export async function run() {
  const failures = [];
  const fail = m => failures.push(m);

  const works = OPGRAPH_NODES.filter(n => n.type === 'work');
  const claims = OPGRAPH_NODES.filter(n => n.type === 'procedure-claim');

  // ── 1. The shipped shape is a NUMBER. If gen-opgraph ever starts emitting
  //       the array instead, the ranker's other branch takes over and this test
  //       is what tells us the contract moved.
  const bad = OPGRAPH_NODES.filter(n =>
    n.witnesses !== undefined && typeof n.witnesses !== 'number' && !Array.isArray(n.witnesses));
  if (bad.length) fail(`witnesses is neither number nor array on ${bad.length} node(s), first: ${bad[0].id}`);

  // ── 2. THE REGRESSION ITSELF. Import the live ranker and assert its measured
  //       single-witness counts equal an independent recount. If witCount ever
  //       collapses counts again, these diverge immediately.
  const mod = await import('../opgraph-eig.mjs');
  const truthWorks = works.filter(w => (typeof w.witnesses === 'number' ? w.witnesses : 0) <= 1).length;
  const truthClaims = claims.filter(c => (typeof c.witnesses === 'number' ? c.witnesses : 0) <= 1).length;

  if (typeof mod.M === 'object' && mod.M) {
    if (mod.M.singleWitnessWorks !== truthWorks) {
      fail(`ranker singleWitnessWorks=${mod.M.singleWitnessWorks} but recount=${truthWorks}`);
    }
    if (mod.M.singleWitnessClaims !== truthClaims) {
      fail(`ranker singleWitnessClaims=${mod.M.singleWitnessClaims} but recount=${truthClaims}`);
    }
  } else {
    fail('opgraph-eig.mjs does not export M — the measurements must be inspectable to be testable');
  }

  // ── 3. THE COLLAPSE SIGNATURE. The specific bug made EVERY node single-witness.
  //       A graph where that is literally true is possible in principle, so this
  //       is a warning shaped as an assert: if the recount says 100% of both
  //       populations are single-witness, either the corpus really is that thin
  //       or the count collapsed again. Both deserve a human look.
  if (works.length && truthWorks === works.length && claims.length && truthClaims === claims.length) {
    fail('every work AND every claim reads as single-witness — the exact signature of the '
       + 'witness-count collapse. Verify against the slices before trusting any ranking.');
  }

  // ── 4. The histogram must show real spread, i.e. the field carries information.
  const distinct = new Set(OPGRAPH_NODES
    .filter(n => typeof n.witnesses === 'number').map(n => n.witnesses));
  if (distinct.size < 2) {
    fail(`witness counts take only ${distinct.size} distinct value(s) across the graph — `
       + 'the field is not discriminating, which is what the collapse bug looked like');
  }

  return { pass: failures.length === 0, failures };
}
