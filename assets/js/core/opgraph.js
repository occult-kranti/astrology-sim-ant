// ============================================================================
//  core/opgraph.js  ·  The Operative-Content Graph — geometry & query engine
//  (R33 / OPGRAPH). PURE: no DOM, no network, no clock, no chance. Every
//  function here is a total function of its arguments and of the GENERATED data
//  module `core/data/opgraph.js`; the app layer (app/opgraph.js) only paints
//  what these functions return, and the ledger reads the same model the canvas
//  does so the two cannot drift (PLAN §5.7).
//
//  THE STRUCTURAL RULE THIS FILE ENFORCES — THE RELATION IS A NODE.
//  Adopted from micrograd's `draw_dot`, where there is never a value→value
//  edge: the operation is interposed as its own node so it can carry its own
//  identity. Here a work never points at another work with a claim edge.
//  Instead:
//        work --CONTAINS--> procedure-claim --OF_TYPE--> procedure-type
//        node --REL_FROM--> relation-claim  --REL_TO---> node
//  so a grade, a citation, an `asserted:false` and an ejection all hang on a
//  thing you can address, filter, weight and strike. `assertOpNodeInvariant()`
//  states this structurally rather than by convention.
//
//  THE X AXIS IS TRANSMISSION RANK, NOT CALENDAR TIME (PLAN §5.2, D11).
//  The atlas (core/confluence.js) owns time; rank is longest-path depth over
//  the asserted claim DAG. Where rank and year disagree, that disagreement is a
//  finding, surfaced by `rankInversions()` — not smoothed away.
//
//  A CYCLE IS A DATING ERROR (PLAN §7.3 C7). `assertAcyclic()` reports the
//  actual cycles it finds; nothing in this file silently breaks one. Layout
//  must still draw, so a cycle-closing arc is excluded from *ranking only*, and
//  every such exclusion is listed in `layout.meta.cycleBroken` and in the
//  layout's `cycles` field. Silence is the failure mode being designed against.
//
//  ATTRIBUTION PRESSURE — the backward pass (PLAN §5.4). One sentence:
//    a record's pressure is the weight-weighted share of the claims attached to
//    it that are themselves disputed, struck, unverified or thinly witnessed,
//    carried forward at 0.6 decay from whatever the record is said to descend
//    from — a repo-computed heuristic, never a scholarly finding.
//  Formally, over the asserted ranking DAG, in reverse-topological order:
//
//    strain(c)      claim-local defect in [0,1] — the maximum of:
//                     1.00  label 'debunked' | 'conspiracy' | asserted === false
//                                            | doNotQuote
//                     0.60  label 'disputed' | unverified
//                     0.40  completenessBasis 'genre-norm' | anatomyStagesInferred
//                     (0.60 − weight) / (0.60 − 0.40), clamped, for any claim
//                           admitted below 0.60
//    local(n)     = Σ weight(c)·strain(c) / Σ weight(c)  over claims incident to n
//    inherited(n) = max over asserted ranking relation-claims r with r.toId === n
//                   of  DECAY · max( strain(r), pressure(r.fromId) )
//    pressure(n)  = min(1, max(local(n), inherited(n))),  DECAY = 0.6, 2 dp
//
//  and for the op-nodes themselves, computed after their endpoints:
//    pressure(procedure-claim c) = max(strain(c), DECAY·pressure(c.workId))
//    pressure(relation-claim  r) = max(strain(r), DECAY·pressure(r.fromId))
//
//  The metric is monotone by construction (weighted means and maxima are both
//  monotone in strain) and is asserted so in scripts/tests/og-engine.mjs.
//  `NON_EDGE` and `RECONSTRUCTED_THROUGH` claims are excluded from pressure
//  entirely: a recorded non-relation and a philological reconstruction are
//  curatorial results, not weak supports (PLAN §2.1.6, D7).
// ============================================================================
import { OPGRAPH_NODES, OPGRAPH_EDGES, OPGRAPH_VOCAB, OPGRAPH_META } from './data/opgraph.js';

// ---- closed enums, mirrored from PLAN §2 -----------------------------------
export const OP_NODE_TYPES = Object.freeze(['procedure-claim', 'relation-claim']);
export const NODE_TYPES = Object.freeze([
  'work', 'author', 'culture', 'procedure-type', 'procedure-claim', 'relation-claim',
]);
export const CLAIM_EDGE_KINDS = Object.freeze(['CONTAINS', 'OF_TYPE', 'REL_FROM', 'REL_TO']);
export const BOOKKEEPING_EDGE_KINDS = Object.freeze(['BELONGS_TO', 'AUTHORED_BY', 'HAS_PART', 'SEGMENT_OF']);
// relations that carry dependency and therefore rank (PLAN §5.2 step 1)
export const RANKING_RELATIONS = Object.freeze(['TRANSMITS_TO', 'COMMENTS_ON']);
// relations deliberately kept OUT of the ranking DAG: they are not dependencies,
// and RECONSTRUCTED_THROUGH runs the opposite way on purpose (strike E2 / D7).
export const NON_RANKING_RELATIONS = Object.freeze([
  'PARALLELS', 'FOUND_WITH', 'RECORDS_TEACHING_OF', 'NON_EDGE', 'RECONSTRUCTED_THROUGH',
]);
export const GRADES = Object.freeze(['complete', 'partial', 'referenced', 'fragmentary', 'unstable-plural']);
export const COMPLETENESS_BASES = Object.freeze([
  'slot-inventory', 'comparative-recension', 'self-contained-table',
  'editorial-statement', 'genre-norm', 'arithmetic-verification',
]);
export const INCOMPLETENESS_KINDS = Object.freeze(['constitutive', 'damaged', 'gated', 'truncated']);
export const ADMISSION_FLOOR = 0.40;
export const PRESSURE_DECAY = 0.6;

// The one-sentence, site-voice gloss the page prints beside the number. It
// describes what the repository computed; it instructs nobody and predicts
// nothing (FRAMING §3.1).
export const ATTRIBUTION_PRESSURE_NOTE =
  'Attribution pressure is a number this repository computes, not a scholarly finding: it reports '
  + 'what share of the claims attached to a record are themselves disputed, struck, unverified or '
  + 'thinly witnessed, and it carries a decayed share of that same pressure forward from whatever '
  + 'the record is said to descend from.';
export const ATTRIBUTION_PRESSURE_FORMULA =
  'pressure(n) = min(1, max( Σ weight(c)·strain(c) / Σ weight(c) over claims incident to n , '
  + '0.6 · max over asserted ranking claims r into n of max(strain(r), pressure(r.from)) ))';

// ---- geometry constants (shared with the engine test's overlap assert) ------
export const NODE_BOX = Object.freeze({
  'work': { w: 190, h: 46 },
  'procedure-claim': { w: 150, h: 34 },
  'relation-claim': { w: 128, h: 28 },
  'procedure-type': { w: 150, h: 26 },
  'author': { w: 150, h: 26 },
  'culture': { w: 150, h: 26 },
});
const MAX_BOX_W = 190;
const MAX_BOX_H = 46;
const COL_GAP = 60;
const ROW_GAP = 14;
const PAD = 40;
export const ZOOM_LEVELS = Object.freeze([0.6, 1, 1.6]);
export const RENDER_CAP = 140;              // PLAN §5.6 mechanism 5 (D12)

// ---- glyph tables: every colour channel also has a text/glyph twin (§5.3) ---
export const GRADE_GLYPH = Object.freeze({
  'complete': '▰', 'partial': '▰▱', 'referenced': '○',
  'fragmentary': '◌', 'unstable-plural': '≠', 'withheld': '⊘',
});
export const ROLE_GLYPH = Object.freeze({
  'formulary': '▤', 'record': '▥', 'applied-text': '✎', 'meta-procedural': '❓',
  'commentary': '❡', 'scripture': '§',
});

// ---- small deterministic helpers -------------------------------------------
const cmpStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const num = v => (typeof v === 'number' && v === v ? v : 0);
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const round2 = v => Math.round(v * 100) / 100;
const arr = v => (Array.isArray(v) ? v : []);
const yearKey = n => (n && typeof n.sortYear === 'number' ? n.sortYear : Infinity);

// ============================================================================
//  THE FACTORY — every function is built over an explicit {nodes, edges, …}
//  so the engine is testable against a fixture as well as against the shipped
//  module, and so nothing here reaches for a global.
// ============================================================================
export function createOpgraph(data) {
  const nodes = arr(data && data.nodes).slice();
  const edges = arr(data && data.edges).slice();
  const vocab = arr(data && data.vocab).slice();
  const meta = (data && data.meta) || {};

  // ---- indexes (built once, all iteration orders total) --------------------
  const byId = new Map();
  for (const n of nodes) if (n && n.id != null && !byId.has(n.id)) byId.set(n.id, n);

  const sortedNodes = nodes.slice().sort((a, b) => cmpStr(a.type, b.type) || cmpStr(a.id, b.id));
  const byType = new Map(NODE_TYPES.map(t => [t, []]));
  for (const n of sortedNodes) {
    if (!byType.has(n.type)) byType.set(n.type, []);
    byType.get(n.type).push(n);
  }

  const sortedEdges = edges.slice().sort(
    (a, b) => cmpStr(a.kind, b.kind) || cmpStr(a.from, b.from) || cmpStr(a.to, b.to));

  const claims = byType.get('procedure-claim') || [];
  const relClaims = byType.get('relation-claim') || [];
  const works = byType.get('work') || [];
  const typeNodes = byType.get('procedure-type') || [];

  const claimsByWork = new Map();
  for (const c of claims) {
    if (!claimsByWork.has(c.workId)) claimsByWork.set(c.workId, []);
    claimsByWork.get(c.workId).push(c);
  }
  for (const list of claimsByWork.values()) {
    list.sort((a, b) => cmpStr(a.typeTerm || '', b.typeTerm || '') || cmpStr(a.id, b.id));
  }

  const claimsByTerm = new Map();
  for (const c of claims) {
    const t = c.typeTerm || '';
    if (!claimsByTerm.has(t)) claimsByTerm.set(t, []);
    claimsByTerm.get(t).push(c);
  }

  // relation-claims touching a node id, in both directions
  const relByEndpoint = new Map();
  const touch = (id, r) => {
    if (id == null) return;
    if (!relByEndpoint.has(id)) relByEndpoint.set(id, []);
    relByEndpoint.get(id).push(r);
  };
  for (const r of relClaims) { touch(r.fromId, r); touch(r.toId, r); }
  for (const list of relByEndpoint.values()) list.sort((a, b) => cmpStr(a.id, b.id));

  // bookkeeping lookups
  const worksOfCulture = new Map();
  const worksOfAuthor = new Map();
  for (const w of works) {
    for (const cid of arr(w.cultureIds)) {
      if (!worksOfCulture.has(cid)) worksOfCulture.set(cid, []);
      worksOfCulture.get(cid).push(w);
    }
    for (const aid of arr(w.authorIds)) {
      if (!worksOfAuthor.has(aid)) worksOfAuthor.set(aid, []);
      worksOfAuthor.get(aid).push(w);
    }
  }

  // undirected incidence over ALL edges — the focus-neighbourhood walk
  const incident = new Map();
  const addInc = (a, b) => {
    if (a == null || b == null) return;
    if (!incident.has(a)) incident.set(a, new Set());
    incident.get(a).add(b);
  };
  for (const e of sortedEdges) { addInc(e.from, e.to); addInc(e.to, e.from); }

  // ==========================================================================
  //  1 · ACCESSORS
  // ==========================================================================
  const nodeById = id => byId.get(id) || null;
  const nodesOfType = t => (byType.get(t) || []).slice();
  const claimsFor = workId => (claimsByWork.get(workId) || []).slice();

  function relationClaims(opts = {}) {
    const o = opts || {};
    const relSet = o.relation ? new Set([].concat(o.relation)) : null;
    const labelSet = o.label ? new Set([].concat(o.label)) : null;
    return relClaims.filter(r => {
      if (relSet && !relSet.has(r.relation)) return false;
      if (labelSet && !labelSet.has(r.label)) return false;
      if (o.asserted != null && (r.asserted !== false) !== !!o.asserted) return false;
      if (o.procedureLevel != null && !!r.procedureLevel !== !!o.procedureLevel) return false;
      if (o.involving != null && r.fromId !== o.involving && r.toId !== o.involving) return false;
      if (o.rankingOnly && !RANKING_RELATIONS.includes(r.relation)) return false;
      return true;
    }).slice().sort((a, b) => cmpStr(a.id, b.id));
  }

  // ==========================================================================
  //  2 · THE OP-NODE INVARIANT, STATED STRUCTURALLY
  //  A claim edge always has exactly one op-node endpoint, and no edge outside
  //  the two bookkeeping part-relations ever joins two `work` nodes. That pair
  //  of statements IS "there is no work→work claim edge" — asserted, not meant.
  // ==========================================================================
  function assertOpNodeInvariant() {
    const violations = [];
    const opSet = new Set(OP_NODE_TYPES);
    const partKinds = new Set(['HAS_PART', 'SEGMENT_OF']);
    for (const e of sortedEdges) {
      const a = byId.get(e.from), b = byId.get(e.to);
      if (!a || !b) {
        violations.push({ kind: 'dangling', edge: `${e.kind} ${e.from}→${e.to}`,
          why: `endpoint ${!a ? e.from : e.to} does not resolve` });
        continue;
      }
      const aOp = opSet.has(a.type), bOp = opSet.has(b.type);
      if (CLAIM_EDGE_KINDS.includes(e.kind) && aOp === bOp) {
        violations.push({ kind: 'claim-edge-shape', edge: `${e.kind} ${e.from}→${e.to}`,
          why: 'a claim edge must have exactly one op-node endpoint' });
      }
      if (a.type === 'work' && b.type === 'work' && !partKinds.has(e.kind)) {
        violations.push({ kind: 'work-to-work', edge: `${e.kind} ${e.from}→${e.to}`,
          why: 'the relation is a node: a work never claims at another work directly' });
      }
    }
    // every relation-claim's declared endpoints must be wired, and must resolve
    const wired = new Map();
    for (const e of sortedEdges) {
      if (e.kind !== 'REL_FROM' && e.kind !== 'REL_TO') continue;
      const cid = e.kind === 'REL_FROM' ? e.to : e.from;
      const other = e.kind === 'REL_FROM' ? e.from : e.to;
      if (!wired.has(cid)) wired.set(cid, { from: null, to: null });
      wired.get(cid)[e.kind === 'REL_FROM' ? 'from' : 'to'] = other;
    }
    for (const r of relClaims) {
      const w = wired.get(r.id) || { from: null, to: null };
      if (!byId.has(r.fromId)) violations.push({ kind: 'endpoint', edge: r.id, why: `fromId ${r.fromId} does not resolve` });
      if (!byId.has(r.toId)) violations.push({ kind: 'endpoint', edge: r.id, why: `toId ${r.toId} does not resolve` });
      if (w.from !== r.fromId) violations.push({ kind: 'wiring', edge: r.id, why: `REL_FROM wiring (${w.from}) disagrees with fromId (${r.fromId})` });
      if (w.to !== r.toId) violations.push({ kind: 'wiring', edge: r.id, why: `REL_TO wiring (${w.to}) disagrees with toId (${r.toId})` });
    }
    for (const c of claims) {
      if (!byId.has(c.workId)) violations.push({ kind: 'endpoint', edge: c.id, why: `workId ${c.workId} does not resolve` });
      const term = typeNodes.find(t => t.term === c.typeTerm || t.id === c.typeTerm);
      if (!term) violations.push({ kind: 'endpoint', edge: c.id, why: `typeTerm ${c.typeTerm} has no procedure-type node` });
    }
    violations.sort((a, b) => cmpStr(a.kind, b.kind) || cmpStr(a.edge, b.edge) || cmpStr(a.why, b.why));
    return { ok: violations.length === 0, violations };
  }

  // ==========================================================================
  //  3 · ACYCLICITY — over TRANSMITS_TO by default; the cycles are REPORTED
  //  A cycle here is a DATING ERROR, so the answer is the cycle itself, not a
  //  boolean and not a quietly-deleted arc.
  // ==========================================================================
  function rankingArcs(relations, includeNonAsserted, includeStructural) {
    const rels = new Set(relations && relations.length ? relations : ['TRANSMITS_TO']);
    const out = [];
    for (const r of relClaims) {
      if (!rels.has(r.relation)) continue;
      if (r.relation === 'RECONSTRUCTED_THROUGH') continue;   // D7: never in the DAG
      if (!includeNonAsserted && r.asserted === false) continue;
      if (r.fromId == null || r.toId == null) continue;
      if (!byId.has(r.fromId) || !byId.has(r.toId)) continue;
      out.push({ from: r.fromId, to: r.toId, via: r.id });
    }
    // structural part-relations rank too (PLAN §5.2 step 1): the whole precedes
    // its part, the work precedes its segment. They are NOT part of the default
    // acyclicity question, which is about transmission and therefore about dates.
    if (includeStructural) {
      for (const e of sortedEdges) {
        if (e.kind === 'HAS_PART') out.push({ from: e.from, to: e.to, via: `edge:HAS_PART:${e.from}:${e.to}` });
        else if (e.kind === 'SEGMENT_OF') out.push({ from: e.to, to: e.from, via: `edge:SEGMENT_OF:${e.from}:${e.to}` });
      }
    }
    out.sort((a, b) => cmpStr(a.from, b.from) || cmpStr(a.to, b.to) || cmpStr(a.via, b.via));
    return out;
  }

  // Tarjan SCC over the arc set, iterative, adjacency in sorted order → the
  // same components in the same order on every machine.
  function stronglyConnected(arcs) {
    const adj = new Map();
    const seen = [];
    for (const a of arcs) {
      if (!adj.has(a.from)) { adj.set(a.from, []); seen.push(a.from); }
      if (!adj.has(a.to)) { adj.set(a.to, []); seen.push(a.to); }
      adj.get(a.from).push(a.to);
    }
    for (const list of adj.values()) list.sort(cmpStr);
    const order = seen.slice().sort(cmpStr);
    const index = new Map(), low = new Map(), onStack = new Set();
    const stack = [];
    let counter = 0;
    const comps = [];
    for (const root of order) {
      if (index.has(root)) continue;
      const work = [{ v: root, i: 0 }];
      index.set(root, counter); low.set(root, counter); counter++;
      stack.push(root); onStack.add(root);
      while (work.length) {
        const frame = work[work.length - 1];
        const kids = adj.get(frame.v) || [];
        if (frame.i < kids.length) {
          const w = kids[frame.i++];
          if (!index.has(w)) {
            index.set(w, counter); low.set(w, counter); counter++;
            stack.push(w); onStack.add(w);
            work.push({ v: w, i: 0 });
          } else if (onStack.has(w)) {
            if (index.get(w) < low.get(frame.v)) low.set(frame.v, index.get(w));
          }
        } else {
          work.pop();
          if (work.length) {
            const parent = work[work.length - 1].v;
            if (low.get(frame.v) < low.get(parent)) low.set(parent, low.get(frame.v));
          }
          if (low.get(frame.v) === index.get(frame.v)) {
            const comp = [];
            for (;;) {
              const w = stack.pop(); onStack.delete(w); comp.push(w);
              if (w === frame.v) break;
            }
            comp.sort(cmpStr);
            comps.push(comp);
          }
        }
      }
    }
    comps.sort((a, b) => cmpStr(a[0], b[0]));
    return { comps, adj };
  }

  // one concrete cycle inside a component, found by DFS in sorted order
  function cycleInComponent(comp, adj) {
    if (comp.length > 200) return comp.concat([comp[0]]);   // report the set, not a path
    const inComp = new Set(comp);
    const start = comp[0];
    const path = [];
    const onPath = new Set();
    const visited = new Set();
    const walk = v => {
      path.push(v); onPath.add(v); visited.add(v);
      for (const w of (adj.get(v) || [])) {
        if (!inComp.has(w)) continue;
        if (w === start) { path.push(start); return true; }
        if (onPath.has(w) || visited.has(w)) continue;
        if (walk(w)) return true;
      }
      path.pop(); onPath.delete(v);
      return false;
    };
    return walk(start) ? path.slice() : comp.concat([comp[0]]);
  }

  function assertAcyclic(opts = {}) {
    const relations = opts.relations && opts.relations.length ? opts.relations : ['TRANSMITS_TO'];
    const arcs = rankingArcs(relations, !!opts.includeNonAsserted, !!opts.includeStructural);
    const { comps, adj } = stronglyConnected(arcs);
    const selfLoops = arcs.filter(a => a.from === a.to)
      .map(a => [a.from, a.from]).sort((x, y) => cmpStr(x[0], y[0]));
    const cycles = [];
    for (const comp of comps) if (comp.length > 1) cycles.push(cycleInComponent(comp, adj));
    for (const s of selfLoops) cycles.push(s);
    cycles.sort((a, b) => cmpStr(a.join('>'), b.join('>')));
    return {
      acyclic: cycles.length === 0,
      cycles,
      relations: relations.slice().sort(cmpStr),
      excluded: NON_RANKING_RELATIONS.slice(),
      arcCount: arcs.length,
    };
  }
  const cycleCheck = opts => assertAcyclic(opts).cycles;
  // memoised default answer — layout asks for it on every call
  let ACYCLIC_DEFAULT = null;
  const acyclicDefault = () => (ACYCLIC_DEFAULT || (ACYCLIC_DEFAULT = assertAcyclic()));

  // ==========================================================================
  //  4 · RANK — longest-path layering over the asserted claim DAG
  //  Cycle-closing arcs are excluded from RANKING ONLY, deterministically, and
  //  every exclusion is returned so the page can say which arc it set aside.
  // ==========================================================================
  const rankCache = (() => {
    const arcs = rankingArcs(RANKING_RELATIONS, false, true);
    // deterministic feedback-arc removal: DFS in sorted id order; an arc back
    // into the current path is a cycle closer and is set aside, never deleted.
    const adj = new Map();
    const idsSeen = [];
    for (const a of arcs) {
      if (!adj.has(a.from)) { adj.set(a.from, []); idsSeen.push(a.from); }
      if (!adj.has(a.to)) { adj.set(a.to, []); idsSeen.push(a.to); }
      adj.get(a.from).push(a);
    }
    for (const list of adj.values()) list.sort((x, y) => cmpStr(x.to, y.to) || cmpStr(x.via, y.via));
    const roots = idsSeen.slice().sort(cmpStr);
    const state = new Map();          // id → 1 on path, 2 done
    const broken = [];
    const kept = [];
    for (const root of roots) {
      if (state.has(root)) continue;
      const stack = [{ v: root, i: 0 }];
      state.set(root, 1);
      while (stack.length) {
        const f = stack[stack.length - 1];
        const outs = adj.get(f.v) || [];
        if (f.i < outs.length) {
          const a = outs[f.i++];
          const s = state.get(a.to);
          if (s === 1) { broken.push(a); continue; }
          kept.push(a);
          if (s === undefined) { state.set(a.to, 1); stack.push({ v: a.to, i: 0 }); }
        } else { state.set(f.v, 2); stack.pop(); }
      }
    }
    broken.sort((a, b) => cmpStr(a.via, b.via));
    // longest-path ranks over the kept (acyclic) arc set
    const keptAdj = new Map();
    const indeg = new Map();
    const ids = new Set();
    for (const a of kept) {
      ids.add(a.from); ids.add(a.to);
      if (!keptAdj.has(a.from)) keptAdj.set(a.from, []);
      keptAdj.get(a.from).push(a.to);
      indeg.set(a.to, (indeg.get(a.to) || 0) + 1);
      if (!indeg.has(a.from)) indeg.set(a.from, indeg.get(a.from) || 0);
    }
    for (const list of keptAdj.values()) list.sort(cmpStr);
    const rank = new Map();
    for (const n of nodes) if (n.type !== 'procedure-claim' && n.type !== 'relation-claim') rank.set(n.id, 0);
    for (const id of ids) if (!rank.has(id)) rank.set(id, 0);
    // Kahn, longest-path: a node is dequeued only once every predecessor has
    // been relaxed, so `rank` is final at that point and the queue order cannot
    // change the answer. No tie-break is needed and none is invented.
    const queue = [...ids].filter(id => (indeg.get(id) || 0) === 0).sort(cmpStr);
    const deg = new Map(indeg);
    let head = 0;
    while (head < queue.length) {
      const v = queue[head++];
      for (const w of (keptAdj.get(v) || [])) {
        const cand = (rank.get(v) || 0) + 1;
        if (cand > (rank.get(w) || 0)) rank.set(w, cand);
        deg.set(w, (deg.get(w) || 0) - 1);
        if (deg.get(w) === 0) queue.push(w);
      }
    }
    let maxRank = 0;
    for (const v of rank.values()) if (v > maxRank) maxRank = v;
    return { rank, maxRank, broken, arcs };
  })();

  const rankOf = id => rankCache.rank.get(id) || 0;

  // ==========================================================================
  //  5 · RANK-vs-YEAR — the disagreement is a finding, and `unknown` is not `ok`
  // ==========================================================================
  function rankInversions() {
    const out = [];
    for (const r of relClaims) {
      if (r.relation !== 'TRANSMITS_TO') continue;
      const a = byId.get(r.fromId), b = byId.get(r.toId);
      const ya = a && typeof a.sortYear === 'number' ? a.sortYear : null;
      const yb = b && typeof b.sortYear === 'number' ? b.sortYear : null;
      let status;
      if (ya == null || yb == null) status = 'unknown';
      else if (ya > yb) status = 'inverted';
      else status = 'ok';
      out.push({
        id: r.id, fromId: r.fromId, toId: r.toId, fromYear: ya, toYear: yb,
        asserted: r.asserted !== false, status,
      });
    }
    out.sort((a, b) => cmpStr(a.id, b.id));
    return out;
  }
  const invertedIds = (() => {
    const s = new Set();
    for (const x of rankInversions()) if (x.status === 'inverted') s.add(x.id);
    return s;
  })();

  // ==========================================================================
  //  6 · ATTRIBUTION PRESSURE — the backward pass (formula in the header)
  // ==========================================================================
  const REL_LABEL_STRAIN = { documented: 0, disputed: 0.6, debunked: 1, conspiracy: 1 };
  const PRESSURE_EXEMPT_RELATIONS = new Set(['NON_EDGE', 'RECONSTRUCTED_THROUGH']);

  function strainOf(node) {
    if (!node) return 0;
    let s = 0;
    const bump = v => { if (v > s) s = v; };
    if (node.type === 'relation-claim') {
      if (PRESSURE_EXEMPT_RELATIONS.has(node.relation)) return 0;
      bump(REL_LABEL_STRAIN[node.label] != null ? REL_LABEL_STRAIN[node.label] : 0.6);
      if (node.asserted === false) bump(1);
    } else if (node.type === 'procedure-claim') {
      if (node.doNotQuote) bump(1);
      if (node.unverified) bump(0.6);
      if (node.completenessBasis === 'genre-norm') bump(0.4);
      if (node.anatomyStagesInferred) bump(0.4);
    } else return 0;
    const w = num(node.weight);
    if (w < 0.60) bump(clamp01((0.60 - w) / (0.60 - ADMISSION_FLOOR)));
    return clamp01(s);
  }

  const strainById = new Map();
  for (const c of claims) strainById.set(c.id, strainOf(c));
  for (const r of relClaims) strainById.set(r.id, strainOf(r));

  // claims incident to a non-op node, for the LOCAL term
  function incidentClaims(node) {
    if (!node) return [];
    const out = [];
    if (node.type === 'work') {
      for (const c of (claimsByWork.get(node.id) || [])) out.push(c);
      for (const r of (relByEndpoint.get(node.id) || [])) out.push(r);
    } else if (node.type === 'procedure-type') {
      for (const c of (claimsByTerm.get(node.term || node.id) || [])) out.push(c);
      for (const r of (relByEndpoint.get(node.id) || [])) out.push(r);
    } else if (node.type === 'culture' || node.type === 'author') {
      const ws = node.type === 'culture' ? (worksOfCulture.get(node.id) || []) : (worksOfAuthor.get(node.id) || []);
      for (const w of ws) for (const c of (claimsByWork.get(w.id) || [])) out.push(c);
      for (const r of (relByEndpoint.get(node.id) || [])) out.push(r);
    }
    return out.filter(c => !(c.type === 'relation-claim' && PRESSURE_EXEMPT_RELATIONS.has(c.relation)))
      .sort((a, b) => cmpStr(a.id, b.id));
  }

  const pressureCache = (() => {
    const p = new Map();
    // LOCAL term for every non-op node
    const local = new Map();
    for (const n of sortedNodes) {
      if (OP_NODE_TYPES.includes(n.type)) continue;
      const inc = incidentClaims(n);
      let wSum = 0, sSum = 0;
      for (const c of inc) {
        const w = num(c.weight) || ADMISSION_FLOOR;
        wSum += w;
        sSum += w * (strainById.get(c.id) || 0);
      }
      local.set(n.id, wSum > 0 ? clamp01(sSum / wSum) : 0);
    }
    // INHERITED term, in topological order over the kept ranking arcs
    const supports = new Map();     // toId → [{fromId, viaClaimId}]
    for (const r of relClaims) {
      if (!RANKING_RELATIONS.includes(r.relation)) continue;
      if (r.asserted === false) continue;
      if (!byId.has(r.fromId) || !byId.has(r.toId)) continue;
      if (!supports.has(r.toId)) supports.set(r.toId, []);
      supports.get(r.toId).push({ fromId: r.fromId, via: r.id });
    }
    for (const list of supports.values()) list.sort((a, b) => cmpStr(a.via, b.via));
    // rank order is a valid topological order of the kept arcs by construction
    const order = sortedNodes
      .filter(n => !OP_NODE_TYPES.includes(n.type))
      .slice()
      .sort((a, b) => (rankOf(a.id) - rankOf(b.id)) || cmpStr(a.id, b.id));
    for (const n of order) {
      let inherited = 0;
      for (const s of (supports.get(n.id) || [])) {
        if (rankOf(s.fromId) >= rankOf(n.id)) continue;   // a set-aside cycle closer
        const via = strainById.get(s.via) || 0;
        const up = p.get(s.fromId) || 0;
        const cand = PRESSURE_DECAY * Math.max(via, up);
        if (cand > inherited) inherited = cand;
      }
      p.set(n.id, clamp01(Math.max(local.get(n.id) || 0, inherited)));
    }
    // the op-nodes themselves, computed after their endpoints
    for (const c of claims) {
      p.set(c.id, clamp01(Math.max(strainById.get(c.id) || 0, PRESSURE_DECAY * (p.get(c.workId) || 0))));
    }
    for (const r of relClaims) {
      p.set(r.id, clamp01(Math.max(strainById.get(r.id) || 0, PRESSURE_DECAY * (p.get(r.fromId) || 0))));
    }
    return p;
  })();

  const attributionPressure = id => round2(pressureCache.get(id) || 0);
  const attributionPressures = () => {
    const out = new Map();
    for (const n of sortedNodes) out.set(n.id, round2(pressureCache.get(n.id) || 0));
    return out;
  };

  // ==========================================================================
  //  7 · FILTERING — one pipeline, shared by the canvas and the ledger, so AT
  //  parity is structural rather than promised (PLAN §5.7, D13).
  // ==========================================================================
  function filterGraph(state = {}) {
    const s = state || {};
    const set = v => (Array.isArray(v) && v.length ? new Set(v) : null);
    const cultures = set(s.cultures);
    const terms = set(s.types);
    const families = set(s.families);
    const grades = set(s.completeness);
    const bases = set(s.bases);
    const harm = set(s.harm);
    const minWeight = typeof s.minWeight === 'number' ? s.minWeight : 0;
    const assertedOnly = !!s.assertedOnly;
    const q = s.q ? String(s.q).toLowerCase().trim() : '';
    const narrowedBy = [];

    const termFamily = new Map(typeNodes.map(t => [t.term || t.id, t.family || '']));

    // --- works
    let keptWorks = works.filter(w => {
      if (num(w.weight) < minWeight) return false;
      if (cultures && !arr(w.cultureIds).some(c => cultures.has(c))) return false;
      if (q) {
        const hay = `${w.label || ''} ${w.titleOriginal || ''} ${w.dateText || ''} ${w.notes || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (cultures) narrowedBy.push(`culture(${cultures.size})`);
    if (minWeight > 0) narrowedBy.push(`weight ≥${minWeight.toFixed(2)}`);
    if (q) narrowedBy.push(`text “${q}”`);

    let workIds = new Set(keptWorks.map(w => w.id));

    // --- claims (claim-level facets ALSO narrow the works they hang on, so a
    //     work with no surviving claim under a claim filter drops out too)
    const claimFilterActive = !!(terms || families || grades || bases || harm);
    let keptClaims = claims.filter(c => {
      if (!workIds.has(c.workId)) return false;
      if (num(c.weight) < minWeight) return false;
      if (terms && !terms.has(c.typeTerm)) return false;
      if (families && !families.has(termFamily.get(c.typeTerm) || '')) return false;
      if (grades) {
        const g = c.textCompleteness == null ? 'withheld' : c.textCompleteness;
        if (!grades.has(g)) return false;
      }
      if (bases && !bases.has(c.completenessBasis)) return false;
      if (harm && !arr(c.harm).some(h => harm.has(h))) return false;
      return true;
    });
    if (terms) narrowedBy.push(`type(${terms.size})`);
    if (families) narrowedBy.push(`family(${families.size})`);
    if (grades) narrowedBy.push(`completeness(${grades.size})`);
    if (bases) narrowedBy.push(`basis(${bases.size})`);
    if (harm) narrowedBy.push(`harm(${harm.size})`);

    if (claimFilterActive) {
      const withClaims = new Set(keptClaims.map(c => c.workId));
      keptWorks = keptWorks.filter(w => withClaims.has(w.id));
      workIds = new Set(keptWorks.map(w => w.id));
      keptClaims = keptClaims.filter(c => workIds.has(c.workId));
    }

    // --- relation-claims: both endpoints must survive
    const endpointOk = id => {
      const n = byId.get(id);
      if (!n) return false;
      if (n.type === 'work') return workIds.has(id);
      return true;
    };
    let keptRels = relClaims.filter(r => {
      if (assertedOnly && r.asserted === false) return false;
      if (num(r.weight) < minWeight) return false;
      return endpointOk(r.fromId) && endpointOk(r.toId);
    });
    if (assertedOnly) narrowedBy.push('asserted only');

    // --- focus subgraph (D12: the default view is a neighbourhood, not the lot)
    if (s.focus && byId.has(s.focus)) {
      const hops = typeof s.hops === 'number' ? s.hops : 2;
      const reach = new Set([s.focus]);
      let frontier = [s.focus];
      for (let h = 0; h < hops; h++) {
        const next = [];
        for (const id of frontier.slice().sort(cmpStr)) {
          for (const nb of [...(incident.get(id) || [])].sort(cmpStr)) {
            if (!reach.has(nb)) { reach.add(nb); next.push(nb); }
          }
        }
        frontier = next;
      }
      keptWorks = keptWorks.filter(w => reach.has(w.id));
      workIds = new Set(keptWorks.map(w => w.id));
      keptClaims = keptClaims.filter(c => reach.has(c.id) && workIds.has(c.workId));
      keptRels = keptRels.filter(r => reach.has(r.id) && endpointOk(r.fromId) && endpointOk(r.toId));
      narrowedBy.push(`${hops}-hop around ${s.focus}`);
    }

    // --- derived node sets
    const usedTerms = new Set(keptClaims.map(c => c.typeTerm));
    const keptTypes = typeNodes.filter(t => usedTerms.has(t.term || t.id));
    const usedCultures = new Set();
    const usedAuthors = new Set();
    for (const w of keptWorks) {
      for (const c of arr(w.cultureIds)) usedCultures.add(c);
      for (const a of arr(w.authorIds)) usedAuthors.add(a);
    }
    const keptCultures = (byType.get('culture') || []).filter(c => usedCultures.has(c.id));
    const keptAuthors = (byType.get('author') || []).filter(a => usedAuthors.has(a.id));

    const ids = new Set();
    for (const list of [keptWorks, keptClaims, keptRels, keptTypes, keptCultures, keptAuthors]) {
      for (const n of list) ids.add(n.id);
    }
    return {
      ids,
      works: keptWorks, claims: keptClaims, relationClaims: keptRels,
      types: keptTypes, cultures: keptCultures, authors: keptAuthors,
      narrowedBy,
      counts: {
        work: keptWorks.length, 'procedure-claim': keptClaims.length,
        'relation-claim': keptRels.length, 'procedure-type': keptTypes.length,
        culture: keptCultures.length, author: keptAuthors.length,
      },
    };
  }

  // ==========================================================================
  //  8 · LAYOUT — deterministic layered DAG, strictly left→right by rank band.
  //  Seeded by nothing, because there is no seed: integer ranks, then a fixed
  //  4-down / 4-up barycentre sweep, ties broken by (sortYear ?? +Inf, id).
  // ==========================================================================
  const GUTTER_CULTURE = -4;
  const GUTTER_AUTHOR = -2;

  function layoutOpgraph(opts = {}) {
    const o = opts || {};
    const zoom = typeof o.zoom === 'number' && o.zoom > 0 ? o.zoom : 1;
    const width = typeof o.width === 'number' && o.width > 0 ? o.width : 1280;
    const orientation = o.orientation === 'TB' ? 'TB' : 'LR';
    const cap = typeof o.cap === 'number' ? o.cap : RENDER_CAP;
    const sel = filterGraph(o.filter || {});

    // ---- 8.1 the render cap, applied by a total priority order --------------
    const focus = o.filter && o.filter.focus ? o.filter.focus : null;
    const hopOf = (() => {
      if (!focus || !byId.has(focus)) return () => 0;
      const dist = new Map([[focus, 0]]);
      let frontier = [focus];
      for (let h = 1; h <= 6 && frontier.length; h++) {
        const next = [];
        for (const id of frontier.slice().sort(cmpStr)) {
          for (const nb of [...(incident.get(id) || [])].sort(cmpStr)) {
            if (!dist.has(nb)) { dist.set(nb, h); next.push(nb); }
          }
        }
        frontier = next;
      }
      return id => (dist.has(id) ? dist.get(id) : 99);
    })();

    const all = [...sel.works, ...sel.claims, ...sel.relationClaims, ...sel.types, ...sel.cultures, ...sel.authors];
    const totalSelected = all.length;
    let chosen = all;
    let capped = null;
    if (Number.isFinite(cap) && totalSelected > cap) {
      const ranked = all.slice().sort((a, b) =>
        (hopOf(a.id) - hopOf(b.id)) || (num(b.weight) - num(a.weight)) || cmpStr(a.id, b.id));
      const keep = new Set(ranked.slice(0, cap).map(n => n.id));
      // closure to a fixed point: an op-node without both its endpoints is not
      // drawable, and dropping one can orphan another.
      for (let pass = 0; pass < 8; pass++) {
        let changed = false;
        for (const n of ranked) {
          if (!keep.has(n.id)) continue;
          if (n.type === 'procedure-claim' && !keep.has(n.workId)) { keep.delete(n.id); changed = true; }
          if (n.type === 'relation-claim' && !(keep.has(n.fromId) && keep.has(n.toId))) { keep.delete(n.id); changed = true; }
        }
        if (!changed) break;
      }
      chosen = all.filter(n => keep.has(n.id));
      capped = { shown: chosen.length, total: totalSelected, cap, dropped: totalSelected - chosen.length };
    }
    const shownIds = new Set(chosen.map(n => n.id));

    // ---- 8.2 columns: works by rank, op-nodes interposed on the odd columns --
    // work column = 2·rank keeps every odd column free for the interposed
    // op-node, which is exactly micrograd's placement: the operation sits
    // between the things it relates and never between nothing.
    const col = new Map();
    for (const w of chosen) {
      if (w.type === 'work') col.set(w.id, 2 * rankOf(w.id));
      else if (w.type === 'culture') col.set(w.id, GUTTER_CULTURE);
      else if (w.type === 'author') col.set(w.id, GUTTER_AUTHOR);
    }
    for (const c of chosen) {
      if (c.type !== 'procedure-claim') continue;
      const base = col.has(c.workId) ? col.get(c.workId) : 2 * rankOf(c.workId);
      col.set(c.id, base + 1);
    }
    for (const r of chosen) {
      if (r.type !== 'relation-claim') continue;
      const a = col.has(r.fromId) ? col.get(r.fromId) : 2 * rankOf(r.fromId);
      const b = col.has(r.toId) ? col.get(r.toId) : 2 * rankOf(r.toId);
      // the op-node sits BETWEEN its endpoints — the nearest odd column to the
      // midpoint, clamped inside the gap. Where there is no gap (equal ranks, or
      // an inversion — both of which are findings, not layout problems) it sits
      // immediately right of its source and the inversion badge says why.
      const lo = a + 1, hi = b - 1;
      let c = a + 1;
      if (hi >= lo) {
        let odd = 2 * Math.round(((a + b) / 2 - 1) / 2) + 1;
        if (odd < lo) odd = (lo % 2 === 1) ? lo : lo + 1;
        if (odd > hi) odd = (hi % 2 === 1) ? hi : hi - 1;
        c = (odd >= lo && odd <= hi) ? odd : lo;
      }
      col.set(r.id, c);
    }
    // the type gutter: one fixed rightmost column, family-then-term ordered
    let maxCol = 0;
    for (const v of col.values()) if (v > maxCol) maxCol = v;
    const gutterCol = maxCol + 2;
    for (const t of chosen) if (t.type === 'procedure-type') col.set(t.id, gutterCol);
    // normalise so the leftmost column is 0; the shift is kept so a band can
    // still name its TRUE transmission rank rather than its screen column.
    let minCol = 0;
    for (const v of col.values()) if (v < minCol) minCol = v;
    if (minCol !== 0) for (const [k, v] of col) col.set(k, v - minCol);
    const colShift = minCol;

    // ---- 8.3 order within a column: 4 down + 4 up barycentre sweeps ----------
    const columns = new Map();
    for (const n of chosen) {
      const c = col.get(n.id) || 0;
      if (!columns.has(c)) columns.set(c, []);
      columns.get(c).push(n);
    }
    const colKeys = [...columns.keys()].sort((a, b) => a - b);
    // the seed order — total, and the tie-break the plan names
    for (const k of colKeys) {
      columns.get(k).sort((a, b) => (yearKey(a) - yearKey(b)) || cmpStr(a.type, b.type) || cmpStr(a.id, b.id));
    }
    const pos = new Map();
    const reindex = () => {
      for (const k of colKeys) columns.get(k).forEach((n, i) => pos.set(n.id, i));
    };
    reindex();

    // adjacency restricted to what is drawn
    const nbrIn = new Map(), nbrOut = new Map();
    for (const e of sortedEdges) {
      if (!shownIds.has(e.from) || !shownIds.has(e.to)) continue;
      if (!nbrOut.has(e.from)) nbrOut.set(e.from, []);
      if (!nbrIn.has(e.to)) nbrIn.set(e.to, []);
      nbrOut.get(e.from).push(e.to);
      nbrIn.get(e.to).push(e.from);
    }
    for (const m of [nbrIn, nbrOut]) for (const list of m.values()) list.sort(cmpStr);

    const bary = (n, side) => {
      const list = (side === 'in' ? nbrIn : nbrOut).get(n.id) || [];
      let sum = 0, c = 0;
      for (const id of list) { if (pos.has(id)) { sum += pos.get(id); c++; } }
      return c ? sum / c : null;
    };
    const sweep = side => {
      const keys = side === 'in' ? colKeys : colKeys.slice().reverse();
      for (const k of keys) {
        const list = columns.get(k);
        const key = new Map(list.map(n => [n.id, bary(n, side)]));
        list.sort((a, b) => {
          const ka = key.get(a.id), kb = key.get(b.id);
          if (ka == null && kb == null) return (yearKey(a) - yearKey(b)) || cmpStr(a.id, b.id);
          if (ka == null) return 1;
          if (kb == null) return -1;
          return (ka - kb) || (yearKey(a) - yearKey(b)) || cmpStr(a.id, b.id);
        });
        reindex();
      }
    };
    for (let i = 0; i < 4; i++) { sweep('in'); sweep('out'); }

    // ---- 8.4 assign geometry ------------------------------------------------
    // The band axis carries whichever box dimension runs along it, so TB is a
    // real orientation rather than a transposed LR that overlaps.
    const alongBox = orientation === 'LR' ? MAX_BOX_W : MAX_BOX_H;
    const acrossBox = orientation === 'LR' ? MAX_BOX_H : MAX_BOX_W;
    const colPitch = Math.round((alongBox + COL_GAP) * zoom);
    const rowPitch = Math.round((acrossBox + ROW_GAP) * zoom);
    const pressures = pressureCache;
    const termFamily = new Map(typeNodes.map(t => [t.term || t.id, t.family || '']));

    const outNodes = [];
    for (const k of colKeys) {
      const list = columns.get(k);
      for (let i = 0; i < list.length; i++) {
        const n = list[i];
        const box = NODE_BOX[n.type] || { w: 140, h: 28 };
        const w = Math.round(box.w * zoom), h = Math.round(box.h * zoom);
        const along = PAD + k * colPitch + Math.round(alongBox * zoom / 2);
        const across = PAD + i * rowPitch + Math.round(acrossBox * zoom / 2);
        const x = orientation === 'LR' ? along : across;
        const y = orientation === 'LR' ? across : along;
        const pressure = round2(pressures.get(n.id) || 0);
        const weight = round2(num(n.weight));
        // every node carries the values it displays — no tooltip is load-bearing
        const cell = {
          id: n.id, type: n.type, label: n.label || n.id,
          band: k, order: i, x, y, w, h,
          weight, weightText: `w ${weight.toFixed(2)}`,
          pressure, pressureText: `↓${pressure.toFixed(2)}`,
          witnesses: num(n.witnesses),
          strokeStep: weight >= 0.80 ? 3 : weight >= 0.60 ? 2 : 1,
        };
        if (n.type === 'work') {
          cell.rank = rankOf(n.id);          // the transmission rank, as a number on the face
          cell.role = n.role || null;
          cell.roleGlyph = ROLE_GLYPH[n.role] || '·';
          cell.cultureIds = arr(n.cultureIds).slice();
          cell.cultureNames = arr(n.cultureIds).map(c => (byId.get(c) ? byId.get(c).label : c));
          cell.dateText = n.dateText || null;
          cell.sortYear = typeof n.sortYear === 'number' ? n.sortYear : null;
          cell.atlasSlug = n.atlasSlug || null;
          cell.kind = n.kind || 'work';
          cell.claimCount = (claimsByWork.get(n.id) || []).length;
        } else if (n.type === 'procedure-claim') {
          const g = n.textCompleteness == null ? 'withheld' : n.textCompleteness;
          cell.workId = n.workId;
          cell.typeTerm = n.typeTerm;
          cell.family = termFamily.get(n.typeTerm) || null;
          cell.grade = g;
          cell.gradeGlyph = GRADE_GLYPH[g] || '·';
          cell.gradeText = n.textCompleteness == null
            ? `withheld — ${n.gradeWithheld || 'no basis stated'}` : g;
          cell.basis = n.completenessBasis || null;
          cell.hatched = n.completenessBasis === 'genre-norm';
          cell.dotted = !!(n.unverified || n.anatomyStagesInferred);
          cell.doNotQuote = !!n.doNotQuote;
          cell.harm = arr(n.harm).slice();
          cell.strain = round2(strainById.get(n.id) || 0);
        } else if (n.type === 'relation-claim') {
          cell.relation = n.relation;
          cell.fromId = n.fromId; cell.toId = n.toId;
          cell.epLabel = n.label || 'documented';
          cell.asserted = n.asserted !== false;
          cell.struck = n.asserted === false;
          cell.notAssertedReason = n.asserted === false ? (n.notAssertedReason || null) : null;
          cell.procedureLevel = !!n.procedureLevel;
          cell.propagatedTypeTerm = n.propagatedTypeTerm || null;
          cell.rankInversion = invertedIds.has(n.id);
          cell.strain = round2(strainById.get(n.id) || 0);
        } else if (n.type === 'procedure-type') {
          cell.term = n.term || n.id;
          cell.family = n.family || null;
          cell.occupancy = num(n.occupancy);
        } else if (n.type === 'culture' || n.type === 'author') {
          cell.region = n.region || null;
          cell.kind = n.kind || null;
        }
        outNodes.push(cell);
      }
    }
    outNodes.sort((a, b) => (a.band - b.band) || (a.order - b.order) || cmpStr(a.id, b.id));
    const geoById = new Map(outNodes.map(n => [n.id, n]));

    // ---- 8.5 edges: cubic beziers whose controls come only from endpoints ----
    const outEdges = [];
    for (const e of sortedEdges) {
      const a = geoById.get(e.from), b = geoById.get(e.to);
      if (!a || !b) continue;
      const lr = orientation === 'LR';
      const x1 = lr ? a.x + a.w / 2 : a.x;
      const y1 = lr ? a.y : a.y + a.h / 2;
      const x2 = lr ? b.x - b.w / 2 : b.x;
      const y2 = lr ? b.y : b.y - b.h / 2;
      const span = lr ? Math.abs(x2 - x1) : Math.abs(y2 - y1);
      const k = Math.max(24, Math.min(140, Math.round(span * 0.4)));
      const c1x = lr ? x1 + k : x1, c1y = lr ? y1 : y1 + k;
      const c2x = lr ? x2 - k : x2, c2y = lr ? y2 : y2 - k;
      outEdges.push({
        from: e.from, to: e.to, kind: e.kind, asserted: e.asserted !== false,
        x1, y1, x2, y2, c1x, c1y, c2x, c2y,
        midX: 0.125 * x1 + 0.375 * c1x + 0.375 * c2x + 0.125 * x2,
        midY: 0.125 * y1 + 0.375 * c1y + 0.375 * c2y + 0.125 * y2,
      });
    }

    // ---- 8.6 bands: the columns, as text, for the ledger and the AT layer ----
    const bands = colKeys.map(k => {
      const list = columns.get(k);
      const along = PAD + k * colPitch;
      const isGutter = list.length > 0 && list.every(n => n.type === 'procedure-type');
      const isCulture = list.length > 0 && list.every(n => n.type === 'culture');
      const isAuthor = list.length > 0 && list.every(n => n.type === 'author');
      const trueCol = k + colShift;
      const rank = trueCol >= 0 && trueCol % 2 === 0 ? trueCol / 2 : null;
      return {
        band: k,
        rank: isGutter || isCulture || isAuthor ? null : rank,
        x: orientation === 'LR' ? along : PAD,
        y: orientation === 'LR' ? PAD : along,
        along, count: list.length,
        ids: list.map(n => n.id),
        label: isGutter ? 'procedure types' : isCulture ? 'cultures' : isAuthor ? 'authors'
          : (rank != null ? `transmission rank ${rank}` : 'interposed claims'),
        kind: isGutter ? 'type-gutter' : isCulture || isAuthor ? 'source-gutter'
          : (rank != null ? 'work-rank' : 'op-rank'),
      };
    });

    let maxAlong = 0, maxAcross = 0;
    for (const n of outNodes) {
      const a1 = (orientation === 'LR' ? n.x + n.w / 2 : n.y + n.h / 2);
      const a2 = (orientation === 'LR' ? n.y + n.h / 2 : n.x + n.w / 2);
      if (a1 > maxAlong) maxAlong = a1;
      if (a2 > maxAcross) maxAcross = a2;
    }
    const cyc = acyclicDefault();
    return {
      nodes: outNodes, edges: outEdges, bands,
      width: Math.round((orientation === 'LR' ? maxAlong : maxAcross) + PAD),
      height: Math.round((orientation === 'LR' ? maxAcross : maxAlong) + PAD),
      viewportWidth: width,
      orientation, zoom, colPitch, rowPitch,
      capped,
      cycles: cyc.cycles,
      meta: {
        selected: totalSelected,
        drawn: outNodes.length,
        narrowedBy: sel.narrowedBy.slice(),
        maxRank: rankCache.maxRank,
        gutterBand: colKeys.length ? colKeys[colKeys.length - 1] : 0,
        // arcs set aside for ranking ONLY, and named — never silently dropped
        cycleBroken: rankCache.broken.map(a => ({ from: a.from, to: a.to, via: a.via })),
      },
    };
  }

  // ==========================================================================
  //  9 · CHAIN WALK — the AT half of "follow a transmission chain"
  // ==========================================================================
  function chainFrom(id) {
    if (!byId.has(id)) return { stops: [] };
    const stops = [{ id, via: null }];
    const seen = new Set([id]);
    let cur = id;
    for (;;) {
      const outs = relClaims.filter(r =>
        r.fromId === cur && r.asserted !== false && RANKING_RELATIONS.includes(r.relation) && !seen.has(r.toId));
      outs.sort((a, b) => (yearKey(byId.get(a.toId)) - yearKey(byId.get(b.toId))) || cmpStr(a.id, b.id));
      const next = outs[0];
      if (!next) break;
      seen.add(next.toId);
      stops.push({
        id: next.toId,
        via: {
          claimId: next.id, relation: next.relation, label: next.label || 'documented',
          procedureLevel: !!next.procedureLevel,
          propagatedTypeTerm: next.propagatedTypeTerm || null,
          bestCitation: next.bestCitation || '', note: next.note || '',
        },
      });
      cur = next.toId;
    }
    return { stops };
  }

  // ==========================================================================
  //  10 · VOCABULARY + LEDGER MODEL
  // ==========================================================================
  function vocabOccupancy() {
    const rows = vocab.length
      ? vocab.map(v => ({ term: v.term, family: v.family || '', gloss: v.gloss || '', warrant: v.warrant || null }))
      : typeNodes.map(t => ({ term: t.term || t.id, family: t.family || '', gloss: t.gloss || '', warrant: t.warrant || null }));
    // families are numbered F1…F13, so they sort by their number rather than
    // by their string — otherwise F10 files between F1 and F2 in the table.
    const famNum = f => { const m = /^F(\d+)/.exec(String(f || '')); return m ? Number(m[1]) : 999; };
    return rows.map(r => ({
      ...r,
      occupancy: (claimsByTerm.get(r.term) || []).length,
      onCanvas: typeNodes.some(t => (t.term || t.id) === r.term),
    })).sort((a, b) => (famNum(a.family) - famNum(b.family))
      || cmpStr(a.family, b.family) || cmpStr(a.term, b.term));
  }

  function ledgerModel(state = {}) {
    const sel = filterGraph(state);
    const termFamily = new Map(typeNodes.map(t => [t.term || t.id, t.family || '']));
    const bestGrade = w => {
      const order = ['complete', 'unstable-plural', 'partial', 'referenced', 'fragmentary'];
      let best = null;
      for (const c of (claimsByWork.get(w.id) || [])) {
        const g = c.textCompleteness;
        if (g == null) continue;
        if (best == null || order.indexOf(g) < order.indexOf(best)) best = g;
      }
      return best;
    };
    const worksRows = sel.works.map(w => ({
      id: w.id, label: w.label, kind: w.kind || 'work',
      cultureIds: arr(w.cultureIds).slice(),
      cultureNames: arr(w.cultureIds).map(c => (byId.get(c) ? byId.get(c).label : c)),
      dateText: w.dateText || null, sortYear: typeof w.sortYear === 'number' ? w.sortYear : null,
      role: w.role || null, roleGlyph: ROLE_GLYPH[w.role] || '·',
      claims: (claimsByWork.get(w.id) || []).length,
      bestGrade: bestGrade(w),
      weight: round2(num(w.weight)), pressure: attributionPressure(w.id),
      witnesses: num(w.witnesses),
      atlasSlug: w.atlasSlug || null,
      editions: arr(w.editions).map(e => ({ cite: e.cite, pd: e.pd, quoteSafe: !!e.quoteSafe, locus: e.locus || null })),
      contested: w.contested || null,
      harm: arr(w.harm).slice(),
      notes: w.notes || '',
    })).sort((a, b) => cmpStr(a.label || '', b.label || '') || cmpStr(a.id, b.id));

    const claimRows = sel.claims.map(c => ({
      id: c.id, workId: c.workId,
      workLabel: byId.get(c.workId) ? byId.get(c.workId).label : c.workId,
      typeTerm: c.typeTerm, family: termFamily.get(c.typeTerm) || '',
      typeAsFiled: c.typeAsFiled || null,
      retypePending: !!c.retypePending, retypeTarget: c.retypeTarget || null,
      subject: c.subject || '', structure: c.structure || '',
      anatomyStages: arr(c.anatomyStages).slice(),
      anatomyStagesInferred: !!c.anatomyStagesInferred,
      repoCoverage: c.repoCoverage == null ? null : c.repoCoverage,
      textCompleteness: c.textCompleteness == null ? null : c.textCompleteness,
      witnessCompleteness: c.witnessCompleteness == null ? null : c.witnessCompleteness,
      completenessBasis: c.completenessBasis || null,
      completenessEvidence: c.completenessEvidence || '',
      gradeWithheld: c.gradeWithheld || null,
      incompletenessKind: c.incompletenessKind || null,
      harm: arr(c.harm).slice(), harmNote: c.harmNote || null,
      unverified: !!c.unverified, doNotQuote: !!c.doNotQuote,
      cite: c.cite || '',
      weight: round2(num(c.weight)), pressure: attributionPressure(c.id),
      strain: round2(strainById.get(c.id) || 0),
      gradeGlyph: GRADE_GLYPH[c.textCompleteness == null ? 'withheld' : c.textCompleteness] || '·',
    })).sort((a, b) => cmpStr(a.workLabel || '', b.workLabel || '') || cmpStr(a.typeTerm || '', b.typeTerm || '') || cmpStr(a.id, b.id));

    const invByClaim = new Map(rankInversions().map(x => [x.id, x.status]));
    const propagationRows = sel.relationClaims.map(r => ({
      id: r.id, relation: r.relation,
      fromId: r.fromId, fromLabel: byId.get(r.fromId) ? byId.get(r.fromId).label : r.fromId,
      toId: r.toId, toLabel: byId.get(r.toId) ? byId.get(r.toId).label : r.toId,
      asserted: r.asserted !== false,
      notAssertedReason: r.asserted === false ? (r.notAssertedReason || null) : null,
      reassertIf: r.reassertIf || null,
      label: r.label || 'documented',
      procedureLevel: !!r.procedureLevel,
      propagatedTypeTerm: r.propagatedTypeTerm || null,
      bestCitation: r.bestCitation || '', note: r.note || '',
      confusedBy: r.confusedBy || null,
      rankStatus: invByClaim.get(r.id) || 'n/a',
      weight: round2(num(r.weight)), pressure: attributionPressure(r.id),
    })).sort((a, b) => cmpStr(a.fromLabel || '', b.fromLabel || '') || cmpStr(a.id, b.id));

    const gate = (meta && meta.gate) || (meta && meta.gateSummary) || null;
    return {
      works: worksRows,
      claims: claimRows,
      propagation: propagationRows,
      vocab: vocabOccupancy(),
      gate,
      narrowedBy: sel.narrowedBy.slice(),
      counts: sel.counts,
    };
  }

  // ==========================================================================
  //  11 · STATS
  // ==========================================================================
  function opgraphStats() {
    const byTypeCount = {};
    for (const t of NODE_TYPES) byTypeCount[t] = (byType.get(t) || []).length;
    const byEdgeKind = {};
    for (const e of sortedEdges) byEdgeKind[e.kind] = (byEdgeKind[e.kind] || 0) + 1;

    const grades = { complete: 0, partial: 0, referenced: 0, fragmentary: 0, 'unstable-plural': 0, withheld: 0 };
    const bases = {};
    for (const b of COMPLETENESS_BASES) bases[b] = 0;
    const incompleteness = {};
    for (const k of INCOMPLETENESS_KINDS) incompleteness[k] = 0;
    const harmCounts = {};
    let unverified = 0, doNotQuote = 0, retypePending = 0, inferredStages = 0;
    for (const c of claims) {
      const g = c.textCompleteness == null ? 'withheld' : c.textCompleteness;
      grades[g] = (grades[g] || 0) + 1;
      if (c.completenessBasis) bases[c.completenessBasis] = (bases[c.completenessBasis] || 0) + 1;
      if (c.incompletenessKind) incompleteness[c.incompletenessKind] = (incompleteness[c.incompletenessKind] || 0) + 1;
      for (const h of arr(c.harm)) harmCounts[h] = (harmCounts[h] || 0) + 1;
      if (c.unverified) unverified++;
      if (c.doNotQuote) doNotQuote++;
      if (c.retypePending) retypePending++;
      if (c.anatomyStagesInferred) inferredStages++;
    }

    const labels = { documented: 0, disputed: 0, debunked: 0, conspiracy: 0 };
    const relations = {};
    let notAsserted = 0, procedureLevel = 0;
    for (const r of relClaims) {
      labels[r.label || 'documented'] = (labels[r.label || 'documented'] || 0) + 1;
      relations[r.relation] = (relations[r.relation] || 0) + 1;
      if (r.asserted === false) notAsserted++;
      if (r.procedureLevel) procedureLevel++;
    }

    let wSum = 0, wMin = Infinity, wMax = -Infinity, belowFloor = 0;
    for (const n of sortedNodes) {
      const w = num(n.weight);
      wSum += w;
      if (w < wMin) wMin = w;
      if (w > wMax) wMax = w;
      if (w < ADMISSION_FLOOR) belowFloor++;
    }

    const degree = new Map();
    for (const e of sortedEdges) {
      degree.set(e.from, (degree.get(e.from) || 0) + 1);
      degree.set(e.to, (degree.get(e.to) || 0) + 1);
    }
    const orphans = sortedNodes.filter(n => !degree.has(n.id)).map(n => n.id);

    const voc = vocabOccupancy();
    const inv = rankInversions();
    const cyc = acyclicDefault();
    let pSum = 0, pMax = 0;
    for (const n of sortedNodes) {
      const p = pressureCache.get(n.id) || 0;
      pSum += p;
      if (p > pMax) pMax = p;
    }

    return {
      nodes: sortedNodes.length, edges: sortedEdges.length,
      byType: byTypeCount, byEdgeKind,
      grades, bases, incompleteness, harm: harmCounts,
      labels, relations,
      notAsserted, procedureLevel, unverified, doNotQuote, retypePending, inferredStages,
      weightMean: sortedNodes.length ? round2(wSum / sortedNodes.length) : 0,
      weightMin: sortedNodes.length ? round2(wMin) : 0,
      weightMax: sortedNodes.length ? round2(wMax) : 0,
      belowFloor,
      orphans,
      pressureMean: sortedNodes.length ? round2(pSum / sortedNodes.length) : 0,
      pressureMax: round2(pMax),
      cycles: cyc.cycles.length,
      cycleList: cyc.cycles,
      rankInversions: inv.filter(x => x.status === 'inverted').length,
      rankUnknown: inv.filter(x => x.status === 'unknown').length,
      maxRank: rankCache.maxRank,
      cycleBroken: rankCache.broken.length,
      vocabOccupied: voc.filter(v => v.occupancy > 0).length,
      vocabEmpty: voc.filter(v => v.occupancy === 0).length,
      vocabEmptyWithoutWarrant: voc.filter(v => v.occupancy === 0 && !(v.warrant || '').trim()).length,
      meta: {
        generatedFrom: meta.generatedFrom || null,
        rubricVersion: meta.rubricVersion != null ? meta.rubricVersion : null,
        roundId: meta.roundId || null,
      },
    };
  }

  return {
    // accessors
    nodeById, nodesOfType, claimsFor, relationClaims, vocabOccupancy,
    // structure
    assertOpNodeInvariant, assertAcyclic, cycleCheck, rankInversions, rankOf,
    // pressure
    strainOf, attributionPressure, attributionPressures,
    // views
    filterGraph, layoutOpgraph, chainFrom, ledgerModel, opgraphStats,
    // raw, for the tests and the generator's diff
    raw: { nodes: sortedNodes, edges: sortedEdges, vocab, meta },
  };
}

// ============================================================================
//  THE SHIPPED BINDING — the same engine, applied to the GENERATED module.
// ============================================================================
const SHIPPED = createOpgraph({
  nodes: OPGRAPH_NODES, edges: OPGRAPH_EDGES, vocab: OPGRAPH_VOCAB, meta: OPGRAPH_META,
});

export const nodeById = id => SHIPPED.nodeById(id);
export const nodesOfType = t => SHIPPED.nodesOfType(t);
export const claimsFor = workId => SHIPPED.claimsFor(workId);
export const relationClaims = opts => SHIPPED.relationClaims(opts);
export const vocabOccupancy = () => SHIPPED.vocabOccupancy();
export const assertOpNodeInvariant = () => SHIPPED.assertOpNodeInvariant();
export const assertAcyclic = opts => SHIPPED.assertAcyclic(opts);
export const cycleCheck = opts => SHIPPED.cycleCheck(opts);
export const rankInversions = () => SHIPPED.rankInversions();
export const rankOf = id => SHIPPED.rankOf(id);
export const strainOf = node => SHIPPED.strainOf(node);
export const attributionPressure = id => SHIPPED.attributionPressure(id);
export const attributionPressures = () => SHIPPED.attributionPressures();
export const filterGraph = state => SHIPPED.filterGraph(state);
export const layoutOpgraph = opts => SHIPPED.layoutOpgraph(opts);
// the plan spells it `layoutOpGraph`; both names address the same pure function
// so neither the page nor a later round has to guess which casing shipped.
export const layoutOpGraph = opts => SHIPPED.layoutOpgraph(opts);
export const chainFrom = id => SHIPPED.chainFrom(id);
export const ledgerModel = state => SHIPPED.ledgerModel(state);
export const opgraphStats = () => SHIPPED.opgraphStats();
