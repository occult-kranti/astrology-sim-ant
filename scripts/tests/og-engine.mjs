// ============================================================================
//  scripts/tests/og-engine.mjs — the OPGRAPH pure-engine tests (builder B).
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs, plus DRIVES
//  (empty: this builder owns no page; the page's DOM lives in the UI module).
//  Deterministic; no DOM, no network, no clock.
//
//  WHAT IT ASSERTS, and why each one exists rather than being assumed:
//   1  PURITY — the engine source contains no clock and no chance call, and no
//      DOM global. Determinism that is not grepped is determinism that rots.
//   2  DETERMINISM — layout is deep-equal across two calls AND across two
//      independently constructed engines, at every zoom step and orientation.
//   3  THE OP-NODE INVARIANT — stated structurally: there is no work→work claim
//      edge, every claim edge has exactly one op-node endpoint, and every claim
//      node's endpoints resolve and agree with their wiring edges.
//   4  ACYCLICITY — assertAcyclic() is clean on the shipped data, and when a
//      cycle IS present the reported path is verified to be a real cycle in the
//      arc set. A cycle is a dating error and must be reported, never broken.
//   5  RANK-vs-YEAR — `unknown` never renders as `ok`.
//   6  ATTRIBUTION PRESSURE — in [0,1], stable across two calls, and MONOTONE:
//      degrading any one claim never lowers any node's pressure.
//   7  GEOMETRY — no two node boxes overlap within a band, and every selected
//      node and every drawable edge is placed.
//   8  AT PARITY — the ledger model and the uncapped canvas agree per type.
//   9  STATS — every headline number is recomputed here from the raw arrays and
//      compared, so `opgraphStats()` cannot drift from the data it describes.
//
//  If assets/js/core/data/opgraph.js has not been generated yet, the module
//  binds the SAME engine source to a fixture named by OG_FIXTURE, so the engine
//  is under test before the artery has run and identical afterwards.
// ============================================================================
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
const ENGINE_SRC = resolve(REPO, 'assets/js/core/opgraph.js');
const DATA_MODULE = resolve(REPO, 'assets/js/core/data/opgraph.js');

const OP_TYPES = ['procedure-claim', 'relation-claim'];
const CLAIM_EDGE_KINDS = ['CONTAINS', 'OF_TYPE', 'REL_FROM', 'REL_TO'];
const PART_KINDS = ['HAS_PART', 'SEGMENT_OF'];

async function loadEngine() {
  const src = readFileSync(ENGINE_SRC, 'utf8');
  if (existsSync(DATA_MODULE)) {
    return { mod: await import(pathToFileURL(ENGINE_SRC).href), src, bound: 'shipped' };
  }
  const fixture = process.env.OG_FIXTURE;
  if (!fixture || !existsSync(fixture)) return { mod: null, src, bound: 'none' };
  const rewritten = src.replace(
    /from '\.\/data\/opgraph\.js'/,
    `from ${JSON.stringify(pathToFileURL(fixture).href)}`);
  const shim = resolve(dirname(fixture), '.og-engine-fixture-bound.mjs');
  writeFileSync(shim, rewritten, 'utf8');
  return { mod: await import(`${pathToFileURL(shim).href}?len=${rewritten.length}`), src, bound: 'fixture' };
}

const J = v => JSON.stringify(v);

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  const { mod, src, bound } = await loadEngine();

  // ---- 1 · purity of the source, checked before anything is executed -------
  ok(!/\bnew\s+Date\b|\bDate\s*\.\s*(now|parse|UTC)\b/.test(src),
    'core/opgraph.js reads no clock (no `new Date` / `Date.now`)');
  ok(!/\bMath\s*\.\s*random\b|getRandomValues/.test(src),
    'core/opgraph.js draws no random numbers');
  ok(!/\bdocument\s*\.|\bwindow\s*\.|\blocalStorage\b|\brequestAnimationFrame\b/.test(src),
    'core/opgraph.js touches no DOM global (core/** is DOM-free)');
  ok(!/\bfetch\s*\(|XMLHttpRequest/.test(src), 'core/opgraph.js makes no network call');
  ok(/from '\.\/data\/opgraph\.js'/.test(src),
    'core/opgraph.js imports the GENERATED data module and nothing else');

  if (!mod) {
    failures.push(
      'assets/js/core/data/opgraph.js has not been generated yet (scripts/gen-opgraph.mjs — the artery). '
      + 'Set OG_FIXTURE=<path to a shape-identical fixture> to exercise the engine before the artery runs.');
    return { pass: false, failures };
  }

  const {
    createOpgraph, layoutOpgraph, layoutOpGraph, nodeById, nodesOfType, claimsFor,
    relationClaims, assertAcyclic, assertOpNodeInvariant, attributionPressure,
    attributionPressures, opgraphStats, ledgerModel, filterGraph, chainFrom,
    rankInversions, vocabOccupancy, strainOf,
    ADMISSION_FLOOR, RENDER_CAP, ZOOM_LEVELS, ATTRIBUTION_PRESSURE_NOTE, ATTRIBUTION_PRESSURE_FORMULA,
  } = mod;

  for (const [name, fn] of Object.entries({
    createOpgraph, layoutOpgraph, layoutOpGraph, nodeById, nodesOfType, claimsFor,
    relationClaims, assertAcyclic, assertOpNodeInvariant, attributionPressure,
    opgraphStats, ledgerModel, filterGraph, chainFrom, rankInversions, vocabOccupancy,
  })) ok(typeof fn === 'function', `core/opgraph.js exports ${name}()`);

  // The bound module is the authority. Its node array is recovered through the
  // typed accessors rather than re-imported, so the test reads the graph the
  // same way the page does.
  const nodes = [
    ...nodesOfType('work'), ...nodesOfType('author'), ...nodesOfType('culture'),
    ...nodesOfType('procedure-type'), ...nodesOfType('procedure-claim'),
    ...nodesOfType('relation-claim'),
  ];
  const byId = new Map(nodes.map(n => [n.id, n]));
  const claims = nodesOfType('procedure-claim');
  const rels = nodesOfType('relation-claim');
  const works = nodesOfType('work');
  const types = nodesOfType('procedure-type');

  ok(nodes.length > 0, 'the graph carries at least one node');
  ok(claims.length > 0, 'the graph carries procedure-claim op-nodes');
  ok(rels.length > 0, 'the graph carries relation-claim op-nodes');

  // rebuild a second, independent engine over the same data for the
  // cross-instance determinism check and the monotonicity perturbations
  const rebuiltData = () => ({
    nodes: nodes.map(n => ({ ...n })),
    edges: layoutEdgeSource().map(e => ({ ...e })),
    vocab: vocabOccupancy().map(v => ({ term: v.term, family: v.family, gloss: v.gloss, warrant: v.warrant })),
    meta: opgraphStats().meta,
  });
  // the edge array is not exported by name; recover it from an uncapped layout,
  // which places every edge whose endpoints are drawn.
  function layoutEdgeSource() {
    const L = layoutOpgraph({ cap: Infinity, filter: {} });
    return L.edges.map(e => ({ from: e.from, to: e.to, kind: e.kind, asserted: e.asserted }));
  }

  // ---- 2 · determinism ----------------------------------------------------
  const cases = [
    { width: 1280, zoom: 1, orientation: 'LR', filter: {}, cap: Infinity },
    { width: 1280, zoom: 0.6, orientation: 'LR', filter: {}, cap: RENDER_CAP },
    { width: 390, zoom: 1.6, orientation: 'TB', filter: {}, cap: RENDER_CAP },
    { width: 1280, zoom: 1, orientation: 'LR', filter: { minWeight: 0.60 }, cap: Infinity },
    { width: 1280, zoom: 1, orientation: 'LR', filter: { focus: works.length ? works[0].id : null, hops: 2 }, cap: Infinity },
  ];
  for (const c of cases) {
    const a = layoutOpgraph(c), b = layoutOpgraph(c);
    ok(J(a) === J(b), `layoutOpgraph deterministic across two calls (${c.orientation} z${c.zoom} cap ${c.cap})`);
  }
  ok(J(layoutOpgraph(cases[0])) === J(layoutOpGraph(cases[0])),
    'layoutOpgraph and the plan-spelled layoutOpGraph are the same pure function');

  const twin = createOpgraph(rebuiltData());
  ok(J(twin.layoutOpgraph(cases[0]).nodes.map(n => [n.id, n.band, n.order, n.x, n.y]))
    === J(layoutOpgraph(cases[0]).nodes.map(n => [n.id, n.band, n.order, n.x, n.y])),
    'layout is deterministic across two independently constructed engines');

  ok(ZOOM_LEVELS.length === 3 && ZOOM_LEVELS[1] === 1, 'three discrete zoom steps, never continuous');
  ok(ADMISSION_FLOOR === 0.40, 'the admission floor is the gate’s 0.40');

  // ---- 3 · the op-node invariant, structurally ----------------------------
  const inv = assertOpNodeInvariant();
  ok(inv.ok, `the op-node invariant holds (${inv.violations.length} violation(s): `
    + inv.violations.slice(0, 5).map(v => `${v.kind} ${v.edge} — ${v.why}`).join(' | ') + ')');

  // and again from the outside, over the edge array itself, so the invariant is
  // not merely whatever the engine chose to check
  const edgeRows = layoutEdgeSource();
  const opSet = new Set(OP_TYPES);
  let workToWork = 0, badClaimEdge = 0, dangling = 0;
  for (const e of edgeRows) {
    const a = byId.get(e.from), b = byId.get(e.to);
    if (!a || !b) { dangling++; continue; }
    if (a.type === 'work' && b.type === 'work' && !PART_KINDS.includes(e.kind)) workToWork++;
    if (CLAIM_EDGE_KINDS.includes(e.kind) && opSet.has(a.type) === opSet.has(b.type)) badClaimEdge++;
  }
  ok(workToWork === 0, `NO work→work claim edge exists — the relation is a node (found ${workToWork})`);
  ok(badClaimEdge === 0, `every claim edge has exactly one op-node endpoint (found ${badClaimEdge} that do not)`);
  ok(dangling === 0, `every drawn edge endpoint resolves (found ${dangling} dangling)`);

  // every claim node's endpoints resolve
  for (const c of claims) {
    ok(byId.has(c.workId), `${c.id}: workId ${c.workId} resolves`);
    ok(types.some(t => (t.term || t.id) === c.typeTerm), `${c.id}: typeTerm ${c.typeTerm} resolves to a procedure-type node`);
  }
  for (const r of rels) {
    ok(byId.has(r.fromId), `${r.id}: fromId ${r.fromId} resolves`);
    ok(byId.has(r.toId), `${r.id}: toId ${r.toId} resolves`);
    ok(r.fromId != null && r.toId != null, `${r.id}: neither endpoint is null`);
    if (r.asserted === false) {
      ok((r.notAssertedReason || '').trim().length > 0,
        `${r.id}: asserted:false carries a notAssertedReason (D6 — struck on the face, never hidden)`);
    }
    if (r.relation === 'NON_EDGE') {
      ok((r.confusedBy || '').trim().length > 0, `${r.id}: NON_EDGE names who conflated the two`);
      ok((r.bestCitation || '').trim().length > 0, `${r.id}: NON_EDGE carries a citation`);
    }
    if (r.procedureLevel === true) {
      ok((r.propagatedTypeTerm || '').trim().length > 0,
        `${r.id}: procedureLevel:true names its propagated type (the Mallinson standard)`);
      ok(types.some(t => (t.term || t.id) === r.propagatedTypeTerm),
        `${r.id}: propagatedTypeTerm ${r.propagatedTypeTerm} resolves`);
    }
  }
  for (const w of works) {
    if (w.contested) {
      const pos = Array.isArray(w.contested.positions) ? w.contested.positions : [];
      ok(pos.length >= 2, `${w.id}: a contested block carries ≥2 positions`);
      ok(pos.every(p => p && String(p.source || '').trim().length > 0),
        `${w.id}: every contested position names its own source (strike E4)`);
    }
  }

  // ---- 4 · acyclicity — reported, never silently broken --------------------
  const cyc = assertAcyclic();
  ok(cyc.acyclic,
    `assertAcyclic() is clean over TRANSMITS_TO — a cycle is a DATING ERROR. Cycles found: `
    + J(cyc.cycles.slice(0, 3)));
  ok(cyc.excluded.includes('RECONSTRUCTED_THROUGH'),
    'RECONSTRUCTED_THROUGH is declared out of the ranking DAG (D7) and cannot hide or create a cycle');
  // …and it is excluded even when a caller explicitly asks for it. D7 is not a
  // default that a later round can flip by passing an option; philological
  // dependency runs the opposite way from transmission and must never rank.
  const rt = rels.filter(r => r.relation === 'RECONSTRUCTED_THROUGH');
  if (rt.length) {
    const withRT = assertAcyclic({ relations: ['TRANSMITS_TO', 'RECONSTRUCTED_THROUGH'] });
    ok(withRT.arcCount === cyc.arcCount,
      `asking for RECONSTRUCTED_THROUGH by name still adds no arc to the DAG `
      + `(${withRT.arcCount} vs ${cyc.arcCount}) — the exclusion is structural, not a default`);
    ok(withRT.acyclic === cyc.acyclic, 'and it can therefore neither create nor hide a cycle');
  }

  // the detector is real: plant a cycle and check the reported path IS a cycle
  const seed = rels.find(r => r.relation === 'TRANSMITS_TO' && r.asserted !== false && r.fromId !== r.toId);
  if (seed) {
    const d = rebuiltData();
    const back = { ...seed, id: `${seed.id}::planted-reverse`, fromId: seed.toId, toId: seed.fromId };
    d.nodes.push(back);
    d.edges.push({ from: back.fromId, to: back.id, kind: 'REL_FROM', asserted: true });
    d.edges.push({ from: back.id, to: back.toId, kind: 'REL_TO', asserted: true });
    const bent = createOpgraph(d);
    const bc = bent.assertAcyclic();
    ok(!bc.acyclic && bc.cycles.length >= 1, 'a planted reversed arrow is detected as a cycle');
    if (bc.cycles.length) {
      const path = bc.cycles[0];
      const arcSet = new Set();
      for (const r of d.nodes.filter(n => n.type === 'relation-claim' && n.relation === 'TRANSMITS_TO' && n.asserted !== false)) {
        arcSet.add(`${r.fromId}>${r.toId}`);
      }
      let real = path.length >= 2 && path[0] === path[path.length - 1];
      for (let i = 0; i + 1 < path.length; i++) if (!arcSet.has(`${path[i]}>${path[i + 1]}`)) real = false;
      ok(real, `the reported cycle is an actual cycle in the arc set: ${J(path)}`);
    }
    // and the layout still draws, disclosing which arc it set aside
    const bl = bent.layoutOpgraph({ cap: Infinity, filter: {} });
    ok(bl.nodes.length > 0, 'layout still draws when a cycle is present');
    ok(Array.isArray(bl.meta.cycleBroken) && bl.meta.cycleBroken.length >= 1,
      'the arc excluded from RANKING is named in layout.meta.cycleBroken — no silent break');
    ok(J(bl.cycles) === J(bc.cycles), 'the layout carries the same cycle report the assertion makes');
  }

  // ---- 5 · rank-vs-year — `unknown` is never `ok` -------------------------
  const invs = rankInversions();
  for (const x of invs) {
    const a = byId.get(x.fromId), b = byId.get(x.toId);
    const dated = a && b && typeof a.sortYear === 'number' && typeof b.sortYear === 'number';
    ok(dated ? x.status !== 'unknown' : x.status === 'unknown',
      `${x.id}: an undated endpoint reports 'unknown', never 'ok'`);
    if (dated) ok(x.status === (a.sortYear > b.sortYear ? 'inverted' : 'ok'), `${x.id}: rank-vs-year status is correct`);
  }

  // ---- 6 · attribution pressure -------------------------------------------
  const p1 = attributionPressures(), p2 = attributionPressures();
  ok(J([...p1.entries()].sort()) === J([...p2.entries()].sort()),
    'attributionPressure is stable across two calls');
  let outOfRange = 0, notRounded = 0;
  for (const n of nodes) {
    const p = attributionPressure(n.id);
    if (!(p >= 0 && p <= 1)) outOfRange++;
    if (Math.abs(p * 100 - Math.round(p * 100)) > 1e-9) notRounded++;
  }
  ok(outOfRange === 0, `attributionPressure ∈ [0,1] for every node (${outOfRange} outside)`);
  ok(notRounded === 0, `attributionPressure is reported to 2dp (${notRounded} not)`);
  ok(typeof ATTRIBUTION_PRESSURE_NOTE === 'string' && ATTRIBUTION_PRESSURE_NOTE.length > 80,
    'the one-sentence, site-voice gloss on attribution pressure is exported for the page');
  ok(/repository computes, not a scholarly finding/.test(ATTRIBUTION_PRESSURE_NOTE),
    'the gloss says on its face that the number is repo-computed, not a scholarly finding');
  ok(!/\byou\b|\byour\b/i.test(ATTRIBUTION_PRESSURE_NOTE),
    'the gloss never addresses the reader in the second person (FRAMING §3.1)');
  ok(typeof ATTRIBUTION_PRESSURE_FORMULA === 'string' && /pressure\(n\)/.test(ATTRIBUTION_PRESSURE_FORMULA),
    'the formula itself is exported so the page can print it');

  // MONOTONE: degrading one claim never lowers any node's pressure.
  const base = createOpgraph(rebuiltData());
  const basePress = base.attributionPressures();
  const worsenTargets = [];
  const softClaim = claims.find(c => !c.doNotQuote);
  if (softClaim) worsenTargets.push([softClaim.id, { doNotQuote: true }]);
  const softRel = rels.find(r => r.asserted !== false && r.label !== 'debunked');
  if (softRel) worsenTargets.push([softRel.id, { label: 'debunked' }]);
  const heavyClaim = claims.find(c => (c.weight || 0) > 0.60);
  if (heavyClaim) worsenTargets.push([heavyClaim.id, { weight: 0.41 }]);
  for (const [id, patch] of worsenTargets) {
    const d = rebuiltData();
    d.nodes = d.nodes.map(n => (n.id === id ? { ...n, ...patch } : n));
    const worse = createOpgraph(d);
    const wp = worse.attributionPressures();
    let regressions = 0, moved = 0;
    for (const n of nodes) {
      const a = basePress.get(n.id) || 0, b = wp.get(n.id) || 0;
      if (b + 1e-9 < a) regressions++;
      if (b > a + 1e-9) moved++;
    }
    ok(regressions === 0,
      `attributionPressure is monotone: degrading ${id} (${J(patch)}) lowered ${regressions} node(s)`);
    ok(moved > 0, `degrading ${id} (${J(patch)}) raises pressure somewhere — the metric is live, not inert`);
  }
  // a clean, well-witnessed leaf must sit at zero, or the metric says nothing
  const cleanLeaf = works.find(w => {
    const cs = claimsFor(w.id);
    return cs.length > 0 && cs.every(c => (base.strainOf(c) || 0) === 0)
      && relationClaims({ involving: w.id }).every(r => (base.strainOf(r) || 0) === 0);
  });
  if (cleanLeaf) ok(attributionPressure(cleanLeaf.id) === 0,
    `a work with no strained claim and no strained ancestry reads ↓0.00 (${cleanLeaf.id})`);
  ok(typeof strainOf === 'function' && strainOf(null) === 0, 'strainOf() is total and safe on a missing node');

  // ---- 7 · geometry --------------------------------------------------------
  for (const c of cases) {
    const L = layoutOpgraph(c);
    const byBand = new Map();
    for (const n of L.nodes) {
      if (!byBand.has(n.band)) byBand.set(n.band, []);
      byBand.get(n.band).push(n);
    }
    let overlaps = 0, firstOverlap = '';
    for (const [band, list] of byBand) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i], b = list[j];
          const dx = Math.abs(a.x - b.x) < (a.w + b.w) / 2;
          const dy = Math.abs(a.y - b.y) < (a.h + b.h) / 2;
          if (dx && dy) { overlaps++; if (!firstOverlap) firstOverlap = `${a.id} × ${b.id} in band ${band}`; }
        }
      }
    }
    ok(overlaps === 0, `no two node boxes overlap within a band (${c.orientation} z${c.zoom}): ${overlaps} — ${firstOverlap}`);
    // every placed node has a real box and a real band
    ok(L.nodes.every(n => n.w > 0 && n.h > 0 && Number.isFinite(n.x) && Number.isFinite(n.y)
      && Number.isInteger(n.band) && Number.isInteger(n.order)),
      `every laid-out node carries a finite box, band and order (${c.orientation} z${c.zoom})`);
    // the values a node displays travel ON the node (micrograd's record shape)
    ok(L.nodes.every(n => typeof n.weightText === 'string' && typeof n.pressureText === 'string'),
      `every node carries its weight and pressure inline (${c.orientation} z${c.zoom})`);
    // strict left→right by band in LR: a later band never starts left of an earlier one
    if (c.orientation === 'LR') {
      const bandX = new Map();
      for (const n of L.nodes) if (!bandX.has(n.band) || n.x < bandX.get(n.band)) bandX.set(n.band, n.x);
      const keys = [...bandX.keys()].sort((a, b) => a - b);
      let monotone = true;
      for (let i = 1; i < keys.length; i++) if (bandX.get(keys[i]) <= bandX.get(keys[i - 1])) monotone = false;
      ok(monotone, `bands run strictly left→right (${c.orientation} z${c.zoom})`);
    }
    ok(L.bands.length === byBand.size, 'the reported bands are exactly the occupied bands');
    ok(L.bands.every(b => b.ids.length === b.count), 'every band’s count matches its own id list');
    ok(L.width > 0 && L.height > 0, 'the layout reports a positive extent');
  }

  // uncapped layout places every selected node, and every edge between two of them
  const full = layoutOpgraph({ cap: Infinity, filter: {} });
  const sel = filterGraph({});
  ok(full.nodes.length === sel.ids.size,
    `the uncapped layout places every selected node (${full.nodes.length} of ${sel.ids.size})`);
  ok(full.capped === null, 'an uncapped layout reports no cap');
  const drawn = new Set(full.nodes.map(n => n.id));
  const expectedEdges = edgeRows.filter(e => drawn.has(e.from) && drawn.has(e.to)).length;
  ok(full.edges.length === expectedEdges,
    `the layout places every edge whose endpoints are drawn (${full.edges.length} vs ${expectedEdges})`);

  // the render cap is honest: it reports what it dropped, and never lies about it
  const smallCap = layoutOpgraph({ cap: 8, filter: {} });
  if (sel.ids.size > 8) {
    ok(smallCap.capped && smallCap.capped.shown === smallCap.nodes.length,
      'the capped layout counts what it actually drew');
    ok(smallCap.capped.total === sel.ids.size && smallCap.capped.shown <= 8,
      `the cap counter states shown-of-total honestly (${J(smallCap.capped)})`);
    // closure: no op-node is drawn without both its endpoints
    const s = new Set(smallCap.nodes.map(n => n.id));
    ok(smallCap.nodes.every(n =>
      n.type !== 'procedure-claim' ? true : s.has(n.workId)),
      'a capped view never draws a procedure-claim whose work was dropped');
    ok(smallCap.nodes.every(n =>
      n.type !== 'relation-claim' ? true : (s.has(n.fromId) && s.has(n.toId))),
      'a capped view never draws a relation-claim missing an endpoint');
  }

  // ---- 8 · AT parity — the ledger and the canvas read one model -----------
  const led = ledgerModel({});
  const countType = t => full.nodes.filter(n => n.type === t).length;
  ok(led.works.length === countType('work'),
    `AT parity · works: ledger ${led.works.length} = canvas ${countType('work')}`);
  ok(led.claims.length === countType('procedure-claim'),
    `AT parity · claims: ledger ${led.claims.length} = canvas ${countType('procedure-claim')}`);
  ok(led.propagation.length === countType('relation-claim'),
    `AT parity · propagation: ledger ${led.propagation.length} = canvas ${countType('relation-claim')}`);
  ok(led.vocab.length >= types.length,
    'the vocabulary table carries at least every occupied term (the empty ones live only in the table)');
  ok(led.vocab.every(v => v.occupancy > 0 || (v.warrant || '').trim().length > 0),
    'every empty controlled term carries a warrant (W3f) — an empty term is a reason, not ceremony');
  for (const t of ['completenessEvidence', 'cite']) {
    ok(led.claims.every(c => typeof c[t] === 'string'), `the ledger exposes claim.${t} as text`);
  }
  ok(led.propagation.every(r => r.asserted || (r.notAssertedReason || '').length > 0),
    'the ledger prints a struck relation’s reason on its face rather than hiding the row');

  // a filtered view keeps parity too — parity that only holds unfiltered drifts
  const fState = { minWeight: 0.60 };
  const fLed = ledgerModel(fState), fCan = layoutOpgraph({ cap: Infinity, filter: fState });
  ok(fLed.works.length === fCan.nodes.filter(n => n.type === 'work').length,
    'AT parity holds under a filter, not only unfiltered');
  ok(fCan.meta.narrowedBy.length > 0 && J(fCan.meta.narrowedBy) === J(fLed.narrowedBy),
    'the canvas and the ledger state the same narrowing in the same words');

  // ---- 9 · stats recomputed here, from the raw arrays ---------------------
  const st = opgraphStats();
  ok(st.nodes === nodes.length, `stats.nodes ${st.nodes} = ${nodes.length}`);
  ok(st.edges === edgeRows.length, `stats.edges ${st.edges} = ${edgeRows.length}`);
  for (const t of ['work', 'author', 'culture', 'procedure-type', 'procedure-claim', 'relation-claim']) {
    ok(st.byType[t] === nodesOfType(t).length, `stats.byType.${t} matches nodesOfType('${t}')`);
  }
  const gradeCount = {};
  for (const c of claims) {
    const g = c.textCompleteness == null ? 'withheld' : c.textCompleteness;
    gradeCount[g] = (gradeCount[g] || 0) + 1;
  }
  for (const [g, n] of Object.entries(gradeCount)) ok(st.grades[g] === n, `stats.grades.${g} ${st.grades[g]} = ${n}`);
  ok(Object.values(st.grades).reduce((a, b) => a + b, 0) === claims.length,
    'every procedure-claim lands in exactly one grade bucket, withheld included');
  ok(st.notAsserted === rels.filter(r => r.asserted === false).length, 'stats.notAsserted matches the data');
  ok(st.procedureLevel === rels.filter(r => r.procedureLevel).length, 'stats.procedureLevel matches the data');
  ok(st.unverified === claims.filter(c => c.unverified).length, 'stats.unverified matches the data');
  ok(st.doNotQuote === claims.filter(c => c.doNotQuote).length, 'stats.doNotQuote matches the data');
  ok(st.belowFloor === nodes.filter(n => (n.weight || 0) < ADMISSION_FLOOR).length, 'stats.belowFloor matches the data');
  ok(st.belowFloor === 0, `no shipped node sits below the admission floor (${st.belowFloor} do)`);
  ok(st.cycles === cyc.cycles.length, 'stats.cycles agrees with assertAcyclic()');
  ok(st.rankInversions === invs.filter(x => x.status === 'inverted').length, 'stats.rankInversions matches the data');
  ok(st.rankUnknown === invs.filter(x => x.status === 'unknown').length, 'stats.rankUnknown matches the data');
  ok(st.vocabEmptyWithoutWarrant === 0,
    `every empty controlled term has a warrant (${st.vocabEmptyWithoutWarrant} do not)`);
  ok(st.orphans.length === 0 || st.orphans.every(id => byId.get(id) && byId.get(id).type === 'procedure-type'),
    `no node is orphaned except, at worst, an unused type chip: ${J(st.orphans.slice(0, 5))}`);
  ok(st.pressureMax >= 0 && st.pressureMax <= 1, 'stats.pressureMax is in range');
  const grand = Object.values(st.byEdgeKind).reduce((a, b) => a + b, 0);
  ok(grand === edgeRows.length, 'the per-kind edge counts sum to the edge total');

  // ---- 10 · accessors and the chain walk ----------------------------------
  ok(nodeById('no-such-node-id') === null, 'nodeById returns null for an unknown id, never undefined');
  ok(nodesOfType('work').every(n => n.type === 'work'), 'nodesOfType filters by type');
  if (works.length) {
    const w = works[0];
    ok(claimsFor(w.id).every(c => c.workId === w.id), 'claimsFor returns only that work’s claims');
    const chain = chainFrom(w.id);
    ok(Array.isArray(chain.stops) && chain.stops.length >= 1, 'chainFrom returns an ordered list of stops');
    ok(chain.stops[0].id === w.id && chain.stops[0].via === null, 'the chain starts at its own node');
    ok(chain.stops.slice(1).every(s => s.via && s.via.claimId && s.via.relation),
      'every chain step names the relation-claim it walked and its citation');
    ok(new Set(chain.stops.map(s => s.id)).size === chain.stops.length, 'the chain never revisits a node');
    ok(J(chainFrom(w.id)) === J(chain), 'chainFrom is deterministic');
  }
  ok(relationClaims({ asserted: false }).every(r => r.asserted === false), 'relationClaims({asserted:false}) filters');
  ok(relationClaims({ relation: 'TRANSMITS_TO' }).every(r => r.relation === 'TRANSMITS_TO'),
    'relationClaims({relation}) filters');
  ok(J(relationClaims({})) === J(relationClaims({})), 'relationClaims is deterministic');

  // filtering never invents a node, and always closes over its endpoints
  const fs = filterGraph({ minWeight: 0.60 });
  ok([...fs.ids].every(id => byId.has(id)), 'filterGraph only ever returns real ids');
  ok(fs.claims.every(c => fs.ids.has(c.workId)), 'a surviving claim’s work survives with it');
  ok(fs.relationClaims.every(r =>
    (byId.get(r.fromId).type !== 'work' || fs.ids.has(r.fromId))
    && (byId.get(r.toId).type !== 'work' || fs.ids.has(r.toId))),
    'a surviving relation-claim keeps both of its work endpoints');

  if (bound === 'fixture') {
    failures.push(
      'NOTE-AS-FAILURE: the engine was exercised against OG_FIXTURE, not against '
      + 'assets/js/core/data/opgraph.js. This must not be green in a shipped tree.');
  }

  return { pass: failures.length === 0, failures };
}

// This builder owns no page; the opgraph page's DOM behaviour is driven by the
// UI test module. An empty DRIVES is a statement, not an omission.
export const DRIVES = [];

export default { run, DRIVES };
