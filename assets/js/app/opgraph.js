// ============================================================================
//  opgraph.js (app) — THE OPERATIVE CORPUS graph page (pages/opgraph.html).
//
//  WHAT THIS PAGE CLAIMS. It maps THAT a named work contains a procedure of a
//  named kind, how many stages that procedure has, how completely the text and
//  the edition in hand account for it, and — where a scholar names the moved
//  thing — that a procedure propagated from one work to another. It reproduces
//  no operative text. Types, structure, completeness, evidence and citation
//  only. The prose here is descriptive throughout: it reports what an edition
//  or a scholar records, and it never addresses a reader as an operator.
//
//  THE KARPATHY UNION, as this module implements it:
//   • micrograd's RENDERING discipline — strict left→right layered DAG; every
//     node is a RECORD SHAPE whose computed values are painted on its own face
//     ({ title | w 0.72 | ↓0.15 }), never hidden behind a hover; and an OP-NODE
//     is interposed on every claim, so a relation is a thing that can be
//     clicked, cited, filtered and ejected rather than a hairline.
//   • the llm-wiki MAINTENANCE discipline — the graph is a VIEW OVER THE GATE,
//     so the page carries an index (counts by type, culture, grade, basis,
//     label) and every node links to its own evidence sentence and citation.
//
//  DIVISION OF LABOUR. All geometry lives in the pure engine core/opgraph.js;
//  all data in the generated core/data/opgraph.js. This file selects, projects
//  and PAINTS. The builders below are pure string/model functions with no DOM
//  reference at all, so the headless test drives exactly the code the browser
//  runs; initOpgraph() is the only DOM-aware function in the file.
//
//  AT PARITY BY CONSTRUCTION. The canvas and the text mirror are painted from
//  ONE array — `model.kept`. The canvas draws the first 140 of it and says so
//  in a real text node; the mirror carries all of it. The mirror can therefore
//  never fall behind the picture, and scripts/tests/og-page.mjs asserts the
//  equality rather than trusting it.
//
//  No requestAnimationFrame; no Date; no Math.random; no network. Every default
//  state is the final resting state (reduced-motion-first).
// ============================================================================

/* eslint-env browser */

// ---------------------------------------------------------------------------
//  small helpers (pure)
// ---------------------------------------------------------------------------
export const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const arr = v => (Array.isArray(v) ? v : []);
const txt = v => (typeof v === 'string' ? v.trim() : '');
const two = v => (typeof v === 'number' && isFinite(v) ? v.toFixed(2) : '—');

// ---------------------------------------------------------------------------
//  vocabularies the page paints (each channel is ALSO written as text)
// ---------------------------------------------------------------------------
export const NODE_TYPES = ['work', 'author', 'culture', 'procedure-type', 'procedure-claim', 'relation-claim'];

// EVERY node type the engine lays out is painted, and every painted type has a
// ledger table — that is what makes AT parity an exact equality rather than an
// approximation. Works/claims/relations/types get tables A–D; the culture and
// author gutters get table E. Nothing the engine places is left out of the text.
export const DRAWN_TYPES = NODE_TYPES;

// THE GEOMETRY CONVENTION, stated once. `layoutOpgraph()` returns node boxes
// anchored at their CENTRE (`x`,`y`) with `w`,`h`, and edges as cubic beziers
// given as endpoint + control points (`x1,y1,c1x,c1y,c2x,c2y,x2,y2`). This
// painter converts centre→top-left for absolute positioning and assembles the
// `d` string; it derives no geometry of its own. Both are the engine's.

export const GRADES = ['complete', 'partial', 'referenced', 'fragmentary', 'unstable-plural', 'withheld'];
export const GRADE_GLYPH = {
  complete: '▰', partial: '▰▱', referenced: '○', fragmentary: '◌',
  'unstable-plural': '≠', withheld: '⊘',
};
export const GRADE_GLOSS = {
  complete: 'the text enumerates its stages and terminates',
  partial: 'some of the account is present, some is not',
  referenced: 'the procedure is named or pointed at, not set out',
  fragmentary: 'what survives is broken',
  'unstable-plural': 'complete in each recension, and the recensions disagree',
  withheld: 'no grade is asserted, and the record says why',
};

export const BASES = ['slot-inventory', 'comparative-recension', 'self-contained-table',
  'editorial-statement', 'genre-norm', 'arithmetic-verification'];
export const BASIS_GLOSS = {
  'slot-inventory': 'the slots of the rite were counted in the text',
  'comparative-recension': 'the recensions were compared',
  'self-contained-table': 'the section is a table that closes on itself',
  'editorial-statement': 'the edition’s own editor states it',
  'genre-norm': 'inferred from what the genre usually does — the weakest basis on the page',
  'arithmetic-verification': 'the construction was checked arithmetically',
};

export const INCOMPLETENESS = ['constitutive', 'damaged', 'gated', 'truncated'];
export const INCOMPLETENESS_GLOSS = {
  constitutive: 'the text was never going to say it',
  damaged: 'the text lost it',
  gated: 'the text has it and the tradition restricts it',
  truncated: 'the author stopped',
};

export const LABELS = ['documented', 'disputed', 'debunked', 'conspiracy'];
export const LABEL_CSS = { documented: 'doc', disputed: 'disp', debunked: 'deb', conspiracy: 'con' };

export const ROLE_GLYPH = {
  formulary: '▤', record: '▥', 'applied-text': '✎', 'meta-procedural': '❓',
  commentary: '❡', scripture: '✧',
};
export const ROLE_GLOSS = {
  formulary: 'a handbook that sets out procedures',
  record: 'a record of sessions, not a manual',
  'applied-text': 'an OUTPUT of a procedure — grading it would be a category error',
  'meta-procedural': 'it discusses and classifies ritual and sets out no sequence',
  commentary: 'a commentary on another work',
  scripture: 'scripture that carries procedure incidentally',
};

export const RELATION_GLOSS = {
  TRANSMITS_TO: 'the procedure moved from the first work to the second',
  PARALLELS: 'a named scholar sets the two side by side',
  COMMENTS_ON: 'the second glosses the first',
  FOUND_WITH: 'the two were found in one archaeological or codicological context',
  RECORDS_TEACHING_OF: 'the work records a named teacher’s instruction',
  NON_EDGE: 'the two are NOT related, and the record names who confused them',
  RECONSTRUCTED_THROUGH: 'modern scholarship reconstructs the first through the second — philological dependency, which runs opposite to transmission',
};

export const CULTURE_ACCENTS = 8;   // 8 accent hues, scoped to .opg-page; the name is always written too
export const NODE_CAP = 140;        // the hard render cap; the counter states it in text
export const ZOOMS = [0.6, 1, 1.6];

// The razor, stated once and shown on every dossier.
export const RAZOR_LINE =
  'This record carries the kind of procedure, its stage count, where it sits in the text, what is missing '
  + 'and how that is known, and who says so. It carries no ordered sub-steps, no quantities, durations or '
  + 'repetitions, no formula or divine-name strings, no drawable signs or seals, and no substance lists.';

// ---------------------------------------------------------------------------
//  INDEX — one pass over the generated module, so every later projection is O(1)
// ---------------------------------------------------------------------------
export function indexGraph(nodes, edges) {
  const byId = new Map();
  const byType = new Map(NODE_TYPES.map(t => [t, []]));
  for (const n of arr(nodes)) {
    if (!n || !n.id) continue;
    byId.set(n.id, n);
    if (!byType.has(n.type)) byType.set(n.type, []);
    byType.get(n.type).push(n);
  }
  const incident = new Map();
  const pushInc = (id, e) => { if (!incident.has(id)) incident.set(id, []); incident.get(id).push(e); };
  for (const e of arr(edges)) {
    if (!e || !e.from || !e.to) continue;
    pushInc(e.from, e); pushInc(e.to, e);
  }
  // claims grouped by their bearing work
  const claimsByWork = new Map();
  for (const c of (byType.get('procedure-claim') || [])) {
    const w = c.workId || (arr(edges).find(e => e.kind === 'CONTAINS' && e.to === c.id) || {}).from;
    if (!w) continue;
    if (!claimsByWork.has(w)) claimsByWork.set(w, []);
    claimsByWork.get(w).push(c);
  }
  // works that name an author, so an author node inherits its works' cultures
  const worksByAuthor = new Map();
  for (const w of (byType.get('work') || [])) {
    for (const a of arr(w.authorIds)) {
      if (!worksByAuthor.has(a)) worksByAuthor.set(a, []);
      worksByAuthor.get(a).push(w);
    }
  }
  // deterministic culture accent: sorted culture ids, index mod 8 (never colour-only)
  const cultureIds = (byType.get('culture') || []).map(c => c.id).sort();
  const accentOf = new Map(cultureIds.map((id, i) => [id, i % CULTURE_ACCENTS]));
  const label = id => (byId.get(id) ? txt(byId.get(id).label) || id : id);

  return { byId, byType, incident, claimsByWork, worksByAuthor, accentOf, cultureIds, label,
    nodes: arr(nodes), edges: arr(edges) };
}

// The cultures a node belongs to — for a work directly, for a claim through its
// work, for a relation-claim through whichever endpoint resolves to a work.
export function culturesOf(node, idx) {
  if (!node) return [];
  if (node.type === 'culture') return [node.id];
  if (node.type === 'work') return arr(node.cultureIds);
  if (node.type === 'procedure-claim') return culturesOf(idx.byId.get(node.workId), idx);
  if (node.type === 'relation-claim') {
    const a = culturesOf(idx.byId.get(node.fromId), idx);
    const b = culturesOf(idx.byId.get(node.toId), idx);
    return [...new Set([...a, ...b])];
  }
  if (node.type === 'author') {
    const ws = idx.worksByAuthor.get(node.id) || [];
    return [...new Set(ws.flatMap(w => arr(w.cultureIds)))];
  }
  return [];
}

// The single completeness grade a claim is filed under on the page: the text
// axis where it is asserted, otherwise the explicit withholding.
export function gradeOf(claim) {
  if (!claim) return null;
  if (claim.type !== 'procedure-claim') return null;
  const g = claim.textCompleteness;
  return g == null ? 'withheld' : g;
}

export function typeTermOf(node, idx) {
  if (!node) return null;
  if (node.type === 'procedure-type') return node.term || node.id;
  if (node.type === 'procedure-claim') return node.typeTerm || null;
  if (node.type === 'relation-claim') return node.propagatedTypeTerm || null;
  if (node.type === 'work') {
    const cs = idx.claimsByWork.get(node.id) || [];
    return cs.length ? cs[0].typeTerm : null;
  }
  return null;
}

function typeTermsOf(node, idx) {
  if (node && node.type === 'work') return (idx.claimsByWork.get(node.id) || []).map(c => c.typeTerm).filter(Boolean);
  const t = typeTermOf(node, idx);
  return t ? [t] : [];
}

// ---------------------------------------------------------------------------
//  FILTER — pure, and serialised into the URL hash so a view is linkable
// ---------------------------------------------------------------------------
export function defaultFilter() {
  return {
    cultures: [],          // [] = every culture
    types: [],             // [] = every procedure-type term
    grades: [],            // [] = every completeness grade
    labels: [],            // [] = every epistemic label
    minWeight: 0,          // 0 / 0.6 / 0.8
    harmOnly: false,
    showNotAsserted: true, // ON by default — hiding a struck record is how a strike evaporates
  };
}

export function passesFilter(node, f, idx) {
  if (!node) return false;
  if (num(node.weight, 1) < num(f.minWeight, 0)) return false;

  if (node.type === 'relation-claim' && node.asserted === false && !f.showNotAsserted) return false;

  if (arr(f.cultures).length) {
    const cs = culturesOf(node, idx);
    if (!cs.some(c => f.cultures.includes(c))) return false;
  }
  if (arr(f.types).length) {
    const ts = typeTermsOf(node, idx);
    // culture and author nodes are scaffolding — a type filter should not delete them
    if (node.type !== 'culture' && node.type !== 'author') {
      if (node.type === 'procedure-type') { if (!f.types.includes(node.term || node.id)) return false; }
      else if (!ts.some(t => f.types.includes(t))) return false;
    }
  }
  if (arr(f.grades).length) {
    if (node.type === 'procedure-claim') { if (!f.grades.includes(gradeOf(node))) return false; }
    else if (node.type === 'work') {
      const cs = idx.claimsByWork.get(node.id) || [];
      if (cs.length && !cs.some(c => f.grades.includes(gradeOf(c)))) return false;
    }
  }
  if (arr(f.labels).length) {
    if (node.type === 'relation-claim' && !f.labels.includes(node.label)) return false;
  }
  if (f.harmOnly && !arr(node.harm).length) return false;
  return true;
}

export function encodeFilter(f) {
  const p = [];
  const d = defaultFilter();
  if (arr(f.cultures).length) p.push('c=' + f.cultures.join(','));
  if (arr(f.types).length) p.push('t=' + f.types.join(','));
  if (arr(f.grades).length) p.push('g=' + f.grades.join(','));
  if (arr(f.labels).length) p.push('l=' + f.labels.join(','));
  if (num(f.minWeight) !== d.minWeight) p.push('w=' + f.minWeight);
  if (f.harmOnly) p.push('harm=1');
  if (f.showNotAsserted !== d.showNotAsserted) p.push('na=' + (f.showNotAsserted ? '1' : '0'));
  return p.join('&');
}

export function decodeFilter(hash) {
  const f = defaultFilter();
  const s = String(hash || '').replace(/^#/, '');
  if (!s) return f;
  for (const part of s.split('&')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i), v = decodeURIComponent(part.slice(i + 1));
    if (k === 'c') f.cultures = v.split(',').filter(Boolean);
    else if (k === 't') f.types = v.split(',').filter(Boolean);
    else if (k === 'g') f.grades = v.split(',').filter(Boolean);
    else if (k === 'l') f.labels = v.split(',').filter(Boolean);
    else if (k === 'w') f.minWeight = Number(v) || 0;
    else if (k === 'harm') f.harmOnly = v === '1';
    else if (k === 'na') f.showNotAsserted = v !== '0';
  }
  return f;
}

// ---------------------------------------------------------------------------
//  MODEL — one filtered array feeding both the canvas and the mirror
// ---------------------------------------------------------------------------
// The ENGINE FILTER ADAPTER. The page's filter object and the engine's `state`
// use different names for two of their fields; mapping them here means the
// engine's own selection, its render cap and its op-node closure see the same
// narrowing the page shows, instead of the two disagreeing quietly.
export function engineFilter(f) {
  const s = {};
  if (arr(f.cultures).length) s.cultures = f.cultures.slice();
  if (arr(f.types).length) s.types = f.types.slice();
  if (arr(f.grades).length) s.completeness = f.grades.slice();
  if (num(f.minWeight)) s.minWeight = f.minWeight;
  if (f.showNotAsserted === false) s.assertedOnly = true;
  return s;
}

// `layoutFull` is the UNCAPPED layout and defines the ledger — the complete set
// of records this filter selects. `layoutDraw` is the CAPPED layout and defines
// the picture. Two calls into a pure, deterministic engine, so the cap is the
// engine's (it keeps an op-node only when both its endpoints survive) and the
// page never invents a truncation rule of its own.
export function buildModel({ idx, layoutFull, layoutDraw, filter, cap = NODE_CAP, pressure }) {
  const f = filter || defaultFilter();
  const layout = layoutFull || layoutDraw || null;
  const inFull = layoutFull && Array.isArray(layoutFull.nodes)
    ? new Set(layoutFull.nodes.map(n => n.id)) : null;
  const pos = new Map();
  if (layoutDraw && Array.isArray(layoutDraw.nodes)) for (const n of layoutDraw.nodes) pos.set(n.id, n);

  // The engine has already applied the filter; re-applying is idempotent and
  // makes the page correct whether it did or not — and it covers the two facets
  // the engine's state has no field for (epistemic label, any-harm).
  const kept = idx.nodes.filter(n => passesFilter(n, f, idx) && (!inFull || inFull.has(n.id)));
  const scaffold = [];

  const order = id => {
    const p = pos.get(id);
    return p ? (num(p.band, 0) * 100000 + num(p.order, 0)) : 1e12;
  };
  const sorted = kept.slice().sort((a, b) => order(a.id) - order(b.id) || (a.id < b.id ? -1 : 1));
  const drawn = layoutDraw ? sorted.filter(n => pos.has(n.id)).slice(0, cap) : [];
  const drawnIds = new Set(drawn.map(n => n.id));

  const counts = {};
  for (const t of NODE_TYPES) counts[t] = 0;
  for (const n of [...kept, ...scaffold]) counts[n.type] = (counts[n.type] || 0) + 1;

  const byCulture = new Map();
  const byGrade = new Map(GRADES.map(g => [g, 0]));
  const byBasis = new Map(BASES.map(b => [b, 0]));
  const byLabel = new Map(LABELS.map(l => [l, 0]));
  for (const n of kept) {
    for (const c of culturesOf(n, idx)) byCulture.set(c, (byCulture.get(c) || 0) + 1);
    if (n.type === 'procedure-claim') {
      const g = gradeOf(n); byGrade.set(g, (byGrade.get(g) || 0) + 1);
      const b = txt(n.completenessBasis); if (b) byBasis.set(b, (byBasis.get(b) || 0) + 1);
    }
    if (n.type === 'relation-claim') byLabel.set(n.label, (byLabel.get(n.label) || 0) + 1);
  }

  const p = id => {
    if (typeof pressure !== 'function') return null;
    try { const v = pressure(id); return typeof v === 'number' && isFinite(v) ? v : null; } catch { return null; }
  };

  const edges = layoutDraw && Array.isArray(layoutDraw.edges)
    ? layoutDraw.edges.filter(e => drawnIds.has(e.from) && drawnIds.has(e.to))
    : [];

  return {
    filter: f, kept, scaffold, sorted, drawn, drawnIds, counts, edges,
    byCulture, byGrade, byBasis, byLabel, pos, pressure: p,
    total: idx.nodes.length, cap,
    truncated: Math.max(0, kept.length - drawn.length),
    bands: layoutDraw && Array.isArray(layoutDraw.bands) ? layoutDraw.bands : [],
    width: layoutDraw ? num(layoutDraw.width, 0) : 0,
    height: layoutDraw ? num(layoutDraw.height, 0) : 0,
    layout,
  };
}

// ---------------------------------------------------------------------------
//  THE NODE FACE — micrograd's record shape, values painted ON the node
// ---------------------------------------------------------------------------
function faceCells(n, model, idx) {
  const w = `w ${two(n.weight)}`;
  const pr = model.pressure(n.id);
  const grad = pr == null ? '' : `↓${pr.toFixed(2)}`;
  return { w, grad };
}

export function nodeFaceHTML(n, model, idx) {
  const { w, grad } = faceCells(n, model, idx);
  const cult = culturesOf(n, idx);
  const accent = cult.length ? (idx.accentOf.get(cult[0]) ?? 0) : 0;
  const cultName = cult.length ? cult.map(c => idx.label(c)).join(' · ') : '';
  const p = model.pos.get(n.id) || { x: 95, y: 23, w: 190, h: 46 };
  // engine boxes are centre-anchored; absolute positioning wants the top-left
  const bw = num(p.w, 190), bh = num(p.h, 46);
  const left = Math.round(num(p.x) - bw / 2), top = Math.round(num(p.y) - bh / 2);
  const cls = ['og-node', `og-t-${n.type}`];
  const bits = [];
  let sub = '';
  let aria = '';

  if (n.type === 'work') {
    const role = txt(n.role);
    if (role) bits.push(`<span class="og-role" title="${esc(ROLE_GLOSS[role] || role)}">${esc(ROLE_GLYPH[role] || '▤')}<span class="og-vh"> ${esc(role)}</span></span>`);
    sub = [cultName, txt(n.dateText)].filter(Boolean).join(' · ');
    cls.push(`og-wt-${n.weight >= 0.8 ? '3' : n.weight >= 0.6 ? '2' : '1'}`);
    aria = `${txt(n.label)} — work${role ? ', ' + role : ''}${cultName ? ', ' + cultName : ''}, weight ${two(n.weight)}${grad ? ', attribution pressure ' + grad.slice(1) : ''}`;
  } else if (n.type === 'procedure-claim') {
    const g = gradeOf(n);
    cls.push('og-op', `og-g-${g}`);
    if (txt(n.completenessBasis) === 'genre-norm') cls.push('og-hatched');
    if (n.unverified || n.anatomyStagesInferred) cls.push('og-dotted');
    if (n.doNotQuote) cls.push('og-dnq');
    bits.push(`<span class="og-grade">${esc(GRADE_GLYPH[g] || '·')}<span class="og-vh"> ${esc(g)}</span></span>`);
    if (arr(n.harm).length) bits.push('<span class="og-harm">⚠<span class="og-vh"> harm-flagged</span></span>');
    if (n.doNotQuote) bits.push('<span class="og-dnq-mark">⛔<span class="og-vh"> flagged do-not-quote</span></span>');
    sub = [txt(n.typeTerm), g, txt(n.completenessBasis)].filter(Boolean).join(' · ');
    aria = `${txt(n.typeTerm) || 'procedure'} in ${idx.label(n.workId)} — completeness ${g}, basis ${txt(n.completenessBasis) || 'unstated'}, weight ${two(n.weight)}`;
  } else if (n.type === 'relation-claim') {
    cls.push('og-op', 'og-rel', `og-ep-${LABEL_CSS[n.label] || 'doc'}`);
    if (n.asserted === false) cls.push('og-struck');
    if (n.procedureLevel) cls.push('og-proclevel');
    if (n.rankInversion) cls.push('og-inverted');
    bits.push(`<span class="og-diamond" aria-hidden="true">${n.procedureLevel ? '◆' : '◇'}</span>`);
    if (n.asserted === false) bits.push('<span class="og-struck-mark">⊘<span class="og-vh"> not asserted</span></span>');
    if (n.rankInversion) bits.push('<span class="og-inv-mark">⇄<span class="og-vh"> rank/year inversion</span></span>');
    sub = [txt(n.relation), n.procedureLevel ? `procedure-level: ${txt(n.propagatedTypeTerm)}` : 'work-level', txt(n.label)].filter(Boolean).join(' · ');
    aria = `${txt(n.relation)} from ${idx.label(n.fromId)} to ${idx.label(n.toId)} — ${txt(n.label)}, ${n.asserted === false ? 'NOT asserted' : 'asserted'}, weight ${two(n.weight)}`;
  } else if (n.type === 'procedure-type') {
    cls.push('og-chip');
    sub = [txt(n.family), `${num(n.occupancy)} claim${num(n.occupancy) === 1 ? '' : 's'}`].filter(Boolean).join(' · ');
    aria = `procedure type ${txt(n.term) || txt(n.label)} — family ${txt(n.family)}, ${num(n.occupancy)} claims`;
  } else {
    cls.push('og-scaffold');
    sub = n.type === 'culture' ? [txt(n.region), txt(n.periodText)].filter(Boolean).join(' · ') : txt(n.attributionNote);
    aria = `${txt(n.label)} — ${n.type}`;
  }

  // An op-node's face names the OPERATION, not its operands — micrograd's `+`
  // is labelled `+`, not `a + b`. The endpoints are the arrows into and out of
  // it, and they are spelled out in the accessible name, the dossier and the
  // ledger row, none of which is abbreviated.
  const title = n.type === 'relation-claim'
    ? txt(n.relation).toLowerCase().replace(/_/g, ' ')
    : n.type === 'procedure-claim'
      ? (txt(n.typeTerm) || txt(n.label) || n.id)
      : (txt(n.label) || n.id);

  // PROGRESSIVE DISCLOSURE, driven by the engine's own box rather than by a
  // zoom number the painter would have to re-derive: a 26 px chip has room for
  // a title and a weight, a zoomed 74 px record has room for everything. What
  // a small box drops is never lost — it is in the accessible name, in the
  // dossier and in the ledger row, all three of which are complete.
  const showPressure = grad && bw >= 175;
  const showSub = sub && bh >= 40;
  if (!showPressure) cls.push('og-face-tight');

  return `<button type="button" class="${cls.join(' ')}" id="ogn-${esc(n.id)}" data-id="${esc(n.id)}"`
    + ` data-cult="${accent}" data-type="${esc(n.type)}" tabindex="-1" aria-expanded="false"`
    + ` style="left:${left}px;top:${top}px;width:${bw}px;height:${bh}px"`
    + ` title="${esc(aria)}" aria-label="${esc(aria)}">`
    + `<span class="og-cell og-cell-title">${esc(title)}</span>`
    + `<span class="og-cell og-cell-w">${esc(w)}</span>`
    + (showPressure ? `<span class="og-cell og-cell-g">${esc(grad)}</span>` : '')
    + (bits.length ? `<span class="og-cell og-cell-marks">${bits.join('')}</span>` : '')
    + (showSub ? `<span class="og-sub">${esc(sub)}</span>` : '')
    + `</button>`;
}

// ---------------------------------------------------------------------------
//  THE CANVAS — an aria-hidden SVG of edges under an HTML layer of node faces
// ---------------------------------------------------------------------------
// The engine emits each edge as a cubic bezier in endpoint + control-point form.
// Assembling the `d` string is transcription, not geometry: no control point is
// computed here.
function edgePath(e) {
  if (typeof e.path === 'string' && e.path) return e.path;
  if (typeof e.d === 'string' && e.d) return e.d;
  if ([e.x1, e.y1, e.c1x, e.c1y, e.c2x, e.c2y, e.x2, e.y2].every(v => typeof v === 'number' && isFinite(v))) {
    const r = v => Math.round(v * 100) / 100;
    return `M${r(e.x1)} ${r(e.y1)} C${r(e.c1x)} ${r(e.c1y)} ${r(e.c2x)} ${r(e.c2y)} ${r(e.x2)} ${r(e.y2)}`;
  }
  if (Array.isArray(e.points) && e.points.length >= 2) {
    return e.points.map((pt, i) => `${i ? 'L' : 'M'}${num(pt[0])} ${num(pt[1])}`).join(' ');
  }
  return '';
}

export function stageSVG(model, idx) {
  if (!model.drawn.length) return '';
  let out = '';
  for (const e of model.edges) {
    const d = edgePath(e);
    if (!d) continue;
    const cls = ['og-edge', `og-e-${esc(String(e.kind || 'link')).toLowerCase()}`];
    if (e.asserted === false) cls.push('og-e-struck');
    if (e.kind === 'RECONSTRUCTED_THROUGH') cls.push('og-e-recon');
    out += `<path class="${cls.join(' ')}" d="${esc(d)}" marker-end="url(#og-arrow)"/>`;
  }
  return `<svg class="og-svg" width="${Math.max(1, Math.round(model.width))}" height="${Math.max(1, Math.round(model.height))}"`
    + ` viewBox="0 0 ${Math.max(1, Math.round(model.width))} ${Math.max(1, Math.round(model.height))}" aria-hidden="true" focusable="false">`
    + '<defs><marker id="og-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6"'
    + ' orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke"/></marker></defs>'
    + `<g class="og-edges">${out}</g></svg>`;
}

export function stageNodesHTML(model, idx) {
  return model.drawn.map(n => nodeFaceHTML(n, model, idx)).join('');
}

export function counterHTML(model) {
  const nar = [];
  const f = model.filter;
  if (arr(f.cultures).length) nar.push(`culture(${f.cultures.length})`);
  if (arr(f.types).length) nar.push(`procedure-type(${f.types.length})`);
  if (arr(f.grades).length) nar.push(`completeness(${f.grades.length})`);
  if (arr(f.labels).length) nar.push(`label(${f.labels.length})`);
  if (num(f.minWeight)) nar.push(`weight ≥ ${f.minWeight}`);
  if (f.harmOnly) nar.push('harm-flagged only');
  if (!f.showNotAsserted) nar.push('asserted only');
  const drawn = model.drawn.length;
  const head = model.width
    ? `Drawing ${drawn} of the ${model.kept.length} works, procedure claims, relation claims and type chips this filter selects, out of ${model.total} in the graph.`
    : `The diagram is not drawn in this view. ${model.kept.length} of ${model.total} records are in the ledger below.`;
  const trunc = model.truncated
    ? ` <b>${model.truncated} filtered node${model.truncated === 1 ? ' is' : 's are'} not drawn</b> — the cap is ${model.cap}; the ledger below carries every one of them.`
    : '';
  return `<p class="og-counter" id="og-counter">${head}${trunc} Narrowed by: ${nar.length ? esc(nar.join(', ')) : 'nothing'}.</p>`;
}

// ---------------------------------------------------------------------------
//  THE INDEX — the llm-wiki maintenance surface, in text
// ---------------------------------------------------------------------------
// A culture label in this dataset can be a full descriptive clause. The index
// is a strip of counts, not a glossary, so a long name is trimmed at its first
// natural break for the chip and carried whole in the title and in ledger E.
export const SHORT_LABEL_CAP = 34;
const SHORT = SHORT_LABEL_CAP;
export function shortLabel(s) {
  const t = txt(s);
  if (t.length <= SHORT) return t;
  const cut = t.search(/\s[—–(;:]/);
  const head = cut > 8 && cut <= SHORT + 6 ? t.slice(0, cut) : t.slice(0, SHORT).replace(/\s+\S*$/, '');
  return (head || t.slice(0, SHORT)) + '…';
}

function countRow(label, pairs, gloss) {
  const cells = pairs.map(([k, v]) =>
    `<span class="og-count" title="${esc(k)}"><b>${esc(String(v))}</b> ${esc(shortLabel(k))}</span>`).join('');
  return `<div class="og-index-row"><p class="og-index-label">${esc(label)}</p><div class="og-count-strip">${cells}</div>`
    + (gloss ? `<p class="small muted">${gloss}</p>` : '') + '</div>';
}

export function indexHTML(model, idx, meta, gate) {
  const byType = NODE_TYPES.map(t => [t, model.counts[t] || 0]).filter(([, v]) => v > 0);
  const cults = [...model.byCulture.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, 12).map(([c, v]) => [idx.label(c), v]);
  const grades = GRADES.map(g => [g, model.byGrade.get(g) || 0]).filter(([, v]) => v > 0);
  const bases = BASES.map(b => [b, model.byBasis.get(b) || 0]).filter(([, v]) => v > 0);
  const labels = LABELS.map(l => [l, model.byLabel.get(l) || 0]).filter(([, v]) => v > 0);

  const genre = model.byBasis.get('genre-norm') || 0;
  let out = '<div class="og-index">';
  out += countRow('Nodes by kind', byType.length ? byType : [['none in view', 0]]);
  out += countRow('Cultures in view (largest twelve)', cults.length ? cults : [['none in view', 0]]);
  out += countRow('Completeness of the text axis', grades.length ? grades : [['none in view', 0]],
    'Each grade names its own basis; a grade with no basis does not exist here.');
  out += countRow('Basis of the grade', bases.length ? bases : [['none in view', 0]],
    genre ? `<b>${genre}</b> of these rest on <i>genre-norm</i> — inferred from what the genre usually does. Those are drawn hatched and are excluded from every headline count on this page.`
      : 'No grade in this view rests on a genre inference.');
  out += countRow('Epistemic label on the propagation claims', labels.length ? labels : [['none in view', 0]],
    'The label is the atlas’s: <i>documented</i> is kept visibly apart from <i>disputed</i> and <i>debunked</i>, and a debunked claim stays on the page, drawn struck.');
  if (meta) {
    const bits = [];
    if (txt(meta.roundId)) bits.push(`round ${esc(txt(meta.roundId))}`);
    if (meta.rubricVersion != null) bits.push(`weight rubric v${esc(String(meta.rubricVersion))}`);
    if (txt(meta.generatedFrom)) bits.push(`generated from <code>${esc(txt(meta.generatedFrom))}</code>`);
    if (bits.length) out += `<p class="small muted og-index-meta">This view is a projection of a generated module — ${bits.join(' · ')}. Nothing on this page is hand-written into the runtime data.</p>`;
  }
  if (gate) {
    const g = [];
    if (gate.admitted != null) g.push(['admitted', gate.admitted]);
    if (gate.excluded != null) g.push(['excluded', gate.excluded]);
    if (gate.ejected != null) g.push(['ejected', gate.ejected]);
    if (g.length) out += countRow('The curation gate', g,
      'Every candidate ever considered stays in the gate file. What was rejected, and what was admitted and then struck, is part of the record.');
  }
  out += '</div>';
  return out;
}

// ---------------------------------------------------------------------------
//  THE STRUCTURAL REPORT — the acyclicity result, said out loud either way
// ---------------------------------------------------------------------------
export function structureHTML(res, idx) {
  if (!res || typeof res.acyclic !== 'boolean') {
    return '<div class="callout" id="og-structure-note"><span class="label">Acyclicity — not computed</span>'
      + 'The engine did not return an acyclicity result for this build, so this page reports none. '
      + 'An unreported check is not a passed check.</div>';
  }
  if (res.acyclic) {
    return '<div class="callout" id="og-structure-note"><span class="label">Acyclicity — no cycle found</span>'
      + 'The asserted transmission relation contains <b>no cycle</b>. That is worth stating plainly: a cycle in a '
      + 'transmission graph is a <b>dating error</b>, not a drawing problem — it would mean a text is recorded as '
      + 'transmitting to something that transmits back to it. The check is run on every build, and its result is '
      + 'printed here whichever way it comes out.</div>';
  }
  const cycles = arr(res.cycles);
  const list = cycles.map(c => `<li><code>${esc(arr(c).map(id => idx.label(id)).join(' → '))}</code></li>`).join('');
  return '<div class="callout bad" id="og-structure-note"><span class="label">Acyclicity — FAILED: '
    + `${cycles.length} cycle${cycles.length === 1 ? '' : 's'} in the transmission relation</span>`
    + 'The asserted transmission relation contains a cycle. <b>This is a finding, not a rendering fault.</b> A cycle '
    + 'means the corpus as recorded has a text transmitting to something that transmits back to it, which is a '
    + 'dating or a direction error somewhere in the chain below. It is printed here rather than hidden, and it is '
    + `named as an open defect of this dataset.<ol class="og-cycles">${list}</ol></div>`;
}

// ---------------------------------------------------------------------------
//  THE DOSSIER — what it is, its grade WITH the evidence, its citation, its
//  weight, its witnesses, its harm note, and what it does NOT contain
// ---------------------------------------------------------------------------
function kv(k, v) { return v ? `<div class="og-kv"><dt>${esc(k)}</dt><dd>${v}</dd></div>` : ''; }

function axesTable(c) {
  const row = (name, g, note) => {
    const val = g == null ? '<i>withheld</i>' : `${esc(GRADE_GLYPH[g] || '')} ${esc(g)}`;
    return `<tr><th scope="row">${esc(name)}</th><td>${val}</td><td class="small">${esc(note)}</td></tr>`;
  };
  return '<div class="og-scroll"><table class="og-axes"><caption class="og-vh">The three completeness axes</caption>'
    + '<thead><tr><th scope="col">axis</th><th scope="col">grade</th><th scope="col">what the axis asks</th></tr></thead><tbody>'
    + row('repoCoverage', c.repoCoverage, 'what this site already records')
    + row('textCompleteness', c.textCompleteness, 'what the work, as scholarship reconstructs it, contains')
    + row('witnessCompleteness', c.witnessCompleteness, 'what the edition actually in hand gives')
    + '</tbody></table></div>';
}

export function dossierHTML(n, ctx) {
  if (!n) return '';
  const { idx, model, pressureNote } = ctx;
  const out = [];
  out.push('<button type="button" class="og-drawer-close" id="og-drawer-close" aria-label="Close this record">✕</button>');

  const title = n.type === 'relation-claim'
    ? `${esc(idx.label(n.fromId))} → ${esc(idx.label(n.toId))}`
    : esc(txt(n.label) || n.id);
  out.push(`<h3 id="og-drawer-title">${title}</h3>`);
  out.push(`<p class="og-drawer-kind"><span class="badge badge--plain">${esc(n.type)}</span>`
    + (txt(n.titleOriginal) ? ` <span class="og-orig">${esc(txt(n.titleOriginal))}</span>` : '') + '</p>');

  const dl = [];

  // ---- the gate row: weight, witnesses, round -----------------------------
  const pr = model.pressure(n.id);
  dl.push(kv('Weight', `<b>${two(n.weight)}</b> <span class="small muted">— computed by the curation gate from the witness list, never hand-written. `
    + `Witnesses behind it: <b>${esc(String(num(n.witnesses)))}</b>${txt(n.gateRound) ? `; admitted in round ${esc(txt(n.gateRound))}` : ''}.</span>`));
  if (pr != null) {
    // the engine owns the gloss where it publishes one, so the page and the
    // engine cannot drift into two different accounts of the same number
    const gloss = pressureNote
      || 'the weighted share of claims touching this record that are themselves disputed, debunked, '
       + 'under-weight or flagged unverified. This is a number this site computes, not a scholarly '
       + 'finding, and it is meaningless outside this dataset.';
    dl.push(kv('Attribution pressure', `<b>↓${pr.toFixed(2)}</b> <span class="small muted">— ${esc(gloss)}</span>`));
  }

  // ---- work ---------------------------------------------------------------
  if (n.type === 'work') {
    const cs = arr(n.cultureIds).map(c => esc(idx.label(c))).join(' · ');
    dl.push(kv('Culture', cs));
    dl.push(kv('Date', esc(txt(n.dateText)) + (n.sortYear == null ? ' <span class="small muted">(no year this dataset trusts)</span>' : '')));
    dl.push(kv('Kind', esc(txt(n.kind))));
    dl.push(kv('Role', txt(n.role) ? `${esc(ROLE_GLYPH[n.role] || '')} ${esc(n.role)} <span class="small muted">— ${esc(ROLE_GLOSS[n.role] || '')}</span>` : ''));
    const auth = arr(n.authorIds).map(a => esc(idx.label(a))).join(' · ');
    dl.push(kv('Attributed to', auth || '<i>no author node — an anonymous macroform, which is itself a finding</i>'));
    const eds = arr(n.editions).map(e => `<li><cite>${esc(txt(e.cite))}</cite> <span class="badge badge--plain">${esc(txt(e.pd) || 'unresolved')}</span>`
      + ` <span class="badge ${e.quoteSafe ? 'badge--doc' : 'badge--plain'}">${e.quoteSafe ? 'quotable' : 'cite-only'}</span>`
      + (txt(e.locus) ? ` <span class="small muted">${esc(txt(e.locus))}</span>` : '') + '</li>').join('');
    if (eds) dl.push(kv('Editions', `<ul class="og-eds">${eds}</ul><p class="small muted">The public-domain verdict is per EDITION and is a <b>United States</b> verdict. It gates quotation, not display — and this page quotes no operative text at all.</p>`));
    if (n.atlasSlug) dl.push(kv('In the Confluence atlas', `<a href="confluence.html#${esc(n.atlasSlug)}">${esc(idx.label(n.id))} in the atlas</a> <span class="small muted">— the atlas answers <i>who read whom</i>; this graph answers <i>what the book tells an operator to do</i>. Neither owns the other.</span>`));
    // NOT a link. A proposed slug is the entry someone should CREATE; rendering
    // it as an anchor is what shipped twelve dead links into confluence.html in
    // the first place. Naming it makes the gap actionable without asserting it
    // has been filled.
    else if (n.atlasNeeded) dl.push(kv('In the Confluence atlas', '<i>not present, and it arguably deserves an entry</i>'
      + (txt(n.proposedAtlasSlug) ? ` <span class="small muted">— the slug it would take is <code>${esc(txt(n.proposedAtlasSlug))}</code>, held as a proposal rather than a link because the atlas has no such entry yet.</span>` : '')));
    const claims = idx.claimsByWork.get(n.id) || [];
    if (claims.length) {
      dl.push(kv('Procedures recorded', `<ul class="og-claimlist">${claims.map(c =>
        `<li><a href="#ogn-${esc(c.id)}" data-goto="${esc(c.id)}">${esc(txt(c.typeTerm))}</a> — ${esc(gradeOf(c))}`
        + `${txt(c.completenessBasis) ? ` <span class="small muted">(basis: ${esc(c.completenessBasis)})</span>` : ''}</li>`).join('')}</ul>`));
    }
  }

  // ---- procedure-claim ----------------------------------------------------
  if (n.type === 'procedure-claim') {
    dl.push(kv('In', `<a href="#ogn-${esc(n.workId)}" data-goto="${esc(n.workId)}">${esc(idx.label(n.workId))}</a>`));
    dl.push(kv('Procedure kind', esc(txt(n.typeTerm)) + (n.retypePending ? ` <span class="badge badge--warn">re-typing pending → ${esc(txt(n.retypeTarget))}</span> <span class="small muted">re-typing is a research act, so the coarse term stands until the source is read again</span>` : '')));
    dl.push(kv('What it is for', esc(txt(n.subject))));
    dl.push(kv('Structure', esc(txt(n.structure))));
    const stages = arr(n.anatomyStages);
    if (stages.length) {
      dl.push(kv('Stages named', `<ol class="og-stages">${stages.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`
        + `<p class="small muted">${n.anatomyStagesInferred
          ? '<b>These stage names are inferred from the genre, not read off the text.</b> They are flagged as such rather than presented as a reading.'
          : 'Stage KINDS and counts only. Naming a stage is a map; ordering the sub-steps would be a recipe, and this record does not carry one.'}</p>`));
    }
    dl.push(kv('Completeness', axesTable(n)));
    dl.push(kv('Basis of the grade', txt(n.completenessBasis)
      ? `<b>${esc(n.completenessBasis)}</b> <span class="small muted">— ${esc(BASIS_GLOSS[n.completenessBasis] || '')}</span>`
      : '<i>none stated</i>'));
    dl.push(kv('The evidence for that grade', txt(n.completenessEvidence)
      ? `<blockquote class="og-evidence">${esc(txt(n.completenessEvidence))}</blockquote>`
      : '<i>none recorded</i>'));
    if (txt(n.gradeWithheld)) dl.push(kv('Why no grade is asserted', `<b>${esc(txt(n.gradeWithheld))}</b> <span class="small muted">— a withheld grade is a result, not a gap. Asserting <i>complete</i> about a book nobody opened would be the worse error.</span>`));
    if (txt(n.incompletenessKind)) dl.push(kv('Kind of incompleteness', `<b>${esc(n.incompletenessKind)}</b> <span class="small muted">— ${esc(INCOMPLETENESS_GLOSS[n.incompletenessKind] || '')}</span>`));
    if (n.unverified) dl.push(kv('Flag', '<span class="badge badge--warn">unverified</span> <span class="small muted">the underlying witness was not read at page level in the round that filed this row.</span>'));
    if (n.doNotQuote) dl.push(kv('Flag', '<span class="badge badge--bad">⛔ do-not-quote</span> <span class="small muted">this claim is recorded and is <b>not</b> available for quotation anywhere on this site; it could not be confirmed at page level.</span>'));
  }

  // ---- relation-claim -----------------------------------------------------
  if (n.type === 'relation-claim') {
    dl.push(kv('Relation', `<b>${esc(txt(n.relation))}</b> <span class="small muted">— ${esc(RELATION_GLOSS[n.relation] || '')}</span>`));
    dl.push(kv('From', `<a href="#ogn-${esc(n.fromId)}" data-goto="${esc(n.fromId)}">${esc(idx.label(n.fromId))}</a>`));
    dl.push(kv('To', `<a href="#ogn-${esc(n.toId)}" data-goto="${esc(n.toId)}">${esc(idx.label(n.toId))}</a>`));
    dl.push(kv('Epistemic label', `<span class="badge badge--${LABEL_CSS[n.label] || 'plain'}">${esc(txt(n.label))}</span>`));
    dl.push(kv('Is it asserted?', n.asserted === false
      ? `<b>No — this relation is recorded as NOT drawn.</b> <span class="small muted">${esc(txt(n.notAssertedReason))}</span>`
        + (txt(n.reassertIf) ? `<p class="small">It would be re-asserted if: ${esc(txt(n.reassertIf))}</p>` : '')
        + '<p class="small muted">It stays on the page, struck, because a flagged relation that is hidden is how a struck claim becomes an unstruck one.</p>'
      : 'Yes.'));
    dl.push(kv('Procedure-level?', n.procedureLevel
      ? `<b>Yes</b> — it names the moved procedure: <b>${esc(txt(n.propagatedTypeTerm))}</b>. <span class="small muted">That is the stronger claim: not that one book influenced another, but that a named procedure travelled, with a witness.</span>`
      : 'No — this is a work-level relation. <span class="small muted">It is not upgraded to a procedure-propagation claim, because no source names the moved thing.</span>'));
    if (txt(n.confusedBy)) dl.push(kv('Who conflated the two', esc(txt(n.confusedBy)) + ' <span class="small muted">— recorded so the error is not rediscovered as a finding.</span>'));
    if (n.rankInversion) dl.push(kv('Rank / year disagreement', '<b>⇄ the transmission rank and the recorded years disagree here.</b> <span class="small muted">That disagreement is left visible rather than resolved; it usually means a date, a direction, or both, is wrong.</span>'));
    dl.push(kv('Citation', txt(n.bestCitation) ? `<cite>${esc(txt(n.bestCitation))}</cite>` : '<i>none recorded</i>'));
    dl.push(kv('Note', esc(txt(n.note))));
  }

  // ---- procedure-type -----------------------------------------------------
  if (n.type === 'procedure-type') {
    dl.push(kv('Controlled term', `<code>${esc(txt(n.term) || n.id)}</code>`));
    dl.push(kv('Family', esc(txt(n.family))));
    dl.push(kv('Gloss', esc(txt(n.gloss))));
    dl.push(kv('Occupancy', `<b>${esc(String(num(n.occupancy)))}</b> claims`));
    if (txt(n.warrant)) dl.push(kv('Warrant for an empty term', esc(txt(n.warrant)) + ' <span class="small muted">— an empty term is the reason a later round does not force an unlike procedure into a near-enough one.</span>'));
  }

  // ---- culture / author ---------------------------------------------------
  if (n.type === 'culture') {
    dl.push(kv('Region', esc(txt(n.region))));
    dl.push(kv('Period', esc(txt(n.periodText))));
  }
  if (n.type === 'author') {
    dl.push(kv('Kind of attribution', `<b>${esc(txt(n.kind))}</b>`));
    dl.push(kv('Note on the attribution', esc(txt(n.attributionNote))));
  }

  // ---- harm, contested, sources, the razor --------------------------------
  if (arr(n.harm).length) {
    out.push('<div class="og-harm-block"><p class="og-harm-title">Harm flag — ' + esc(arr(n.harm).join(', ')) + '</p>'
      + `<p>${esc(txt(n.harmNote) || 'A harm kind is recorded on this record and no note accompanies it; that is a defect in the data, and it is shown rather than suppressed.')}</p>`
      + '<p class="small muted">Recorded as a fact about the practice and its documented history. Nothing here is health, medical, legal or safety advice.</p></div>');
  }
  if (n.contested && arr(n.contested.positions).length) {
    out.push('<div class="og-contested"><p class="og-contested-title">⚑ The sources disagree — both positions, unresolved</p><ul>'
      + arr(n.contested.positions).map(p => `<li><b>${esc(txt(p.value))}</b> — ${esc(txt(p.source))}</li>`).join('')
      + '</ul><p class="small muted">This site prints the positions and does not pick.</p></div>');
  }
  if (txt(n.cite)) dl.push(kv('Citation', `<cite>${esc(txt(n.cite))}</cite>`));
  if (arr(n.sources).length) dl.push(kv('Sources', arr(n.sources).map(s => `<code>${esc(String(s))}</code>`).join(' · ')));
  if (txt(n.notes)) dl.push(kv('Notes', esc(txt(n.notes))));

  out.push(`<dl class="og-dl">${dl.filter(Boolean).join('')}</dl>`);
  out.push(`<div class="og-razor"><p class="og-razor-title">What this record does not contain</p><p class="small">${esc(RAZOR_LINE)}</p></div>`);
  if (n.type === 'work' || n.type === 'relation-claim') {
    out.push('<p class="og-drawer-actions"><button type="button" class="btn-secondary og-chain-btn" data-chain="'
      + esc(n.id) + '">Follow the transmission chain from here</button></p>');
  }
  return out.join('');
}

// ---------------------------------------------------------------------------
//  THE CHAIN WALK — highlighted on the canvas AND written as an ordered list
// ---------------------------------------------------------------------------
// The engine owns the walk where it publishes one — `chainFrom(id)` returns
// `{stops:[{id, via}]}` and its `via` carries the relation, the propagated
// type and the citation, which is exactly what the ordered list prints. This
// adapter exists so the page never keeps a second, quietly diverging idea of
// what a transmission chain is.
export function adaptChain(res, startId) {
  const stops = arr(res && res.stops);
  if (!stops.length) return { start: startId, steps: [] };
  return {
    start: stops[0].id || startId,
    steps: stops.slice(1).map(s => ({ to: s.id, via: s.via || {} })),
  };
}

export function walkChain(startId, idx, limit = 24) {
  const steps = [];
  const seen = new Set([startId]);
  let cur = startId;
  const rels = idx.byType.get('relation-claim') || [];
  while (steps.length < limit) {
    const next = rels.find(r => r.fromId === cur && r.asserted !== false
      && (r.relation === 'TRANSMITS_TO' || r.relation === 'COMMENTS_ON') && !seen.has(r.toId));
    if (!next) break;
    steps.push({ via: next, to: next.toId });
    seen.add(next.toId);
    cur = next.toId;
  }
  return { start: startId, steps };
}

export function chainHTML(chain, idx) {
  if (!chain) return '';
  if (!chain.steps.length) {
    return `<div class="og-chain" id="og-chain"><h3>Transmission chain from ${esc(idx.label(chain.start))}</h3>`
      + '<p class="small">No asserted transmission or commentary relation leaves this node. That is a fact about the '
      + 'dataset, not a rendering failure: the corpus records no onward step here.</p></div>';
  }
  const li = chain.steps.map(s => {
    const r = s.via;
    return `<li><b>${esc(txt(r.relation))}</b> → <a href="#ogn-${esc(s.to)}" data-goto="${esc(s.to)}">${esc(idx.label(s.to))}</a>`
      + (r.procedureLevel ? ` <span class="badge badge--doc">procedure-level: ${esc(txt(r.propagatedTypeTerm))}</span>` : ' <span class="badge badge--plain">work-level</span>')
      + `<br><cite class="small">${esc(txt(r.bestCitation))}</cite></li>`;
  }).join('');
  return `<div class="og-chain" id="og-chain"><h3>Transmission chain from ${esc(idx.label(chain.start))}</h3>`
    + `<ol class="og-chain-steps">${li}</ol>`
    + '<p class="small muted">Each step is a separate claim with its own citation. A step marked <i>work-level</i> claims '
    + 'only that one work is behind another; a step marked <i>procedure-level</i> names the procedure that moved, which is '
    + 'the stronger claim and the one this graph exists to record.</p></div>';
}

// ---------------------------------------------------------------------------
//  THE TEXT MIRROR — the same claims as a filterable ledger. This is the
//  accessible representation and the mobile/print view, and it is complete
//  where the canvas is capped.
// ---------------------------------------------------------------------------
function tbl(id, caption, head, rows, note) {
  return `<section class="og-table-wrap" aria-labelledby="${id}-h">`
    + `<h3 id="${id}-h">${esc(caption)}</h3>`
    + (note ? `<p class="small muted">${note}</p>` : '')
    + `<div class="og-scroll"><table class="og-table" id="${id}">`
    + `<thead><tr>${head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>`
    + `<tbody>${rows.join('')}</tbody></table></div></section>`;
}

export function mirrorHTML(model, idx) {
  const kept = model.kept;
  const works = kept.filter(n => n.type === 'work');
  const claims = kept.filter(n => n.type === 'procedure-claim');
  const rels = kept.filter(n => n.type === 'relation-claim');
  const vocab = kept.filter(n => n.type === 'procedure-type');
  const scaf = kept.filter(n => n.type === 'culture' || n.type === 'author');

  const drawnMark = n => model.drawnIds.has(n.id) ? '<span class="og-vh">drawn on the diagram</span>' : '<span class="og-vh">not drawn — beyond the diagram cap</span>';

  const wRows = works.map(n => {
    const cs = idx.claimsByWork.get(n.id) || [];
    const best = GRADES.find(g => cs.some(c => gradeOf(c) === g)) || '—';
    const pr = model.pressure(n.id);
    return '<tr data-row="' + esc(n.id) + '">'
      + `<th scope="row"><button type="button" class="og-rowlink" data-id="${esc(n.id)}">${esc(txt(n.label))}</button>${drawnMark(n)}</th>`
      + `<td>${esc(arr(n.cultureIds).map(c => idx.label(c)).join(' · '))}</td>`
      + `<td>${esc(txt(n.dateText))}</td>`
      + `<td>${esc(txt(n.role))}</td>`
      + `<td>${cs.length}</td>`
      + `<td>${esc(best)}</td>`
      + `<td>${two(n.weight)}</td>`
      + `<td>${pr == null ? '—' : '↓' + pr.toFixed(2)}</td>`
      + `<td>${esc(String(num(n.witnesses)))}</td>`
      + `<td>${n.atlasSlug ? `<a href="confluence.html#${esc(n.atlasSlug)}">${esc(n.atlasSlug)}</a>` : '—'}</td>`
      + `<td>${arr(n.editions).map(e => esc(txt(e.pd)) + (e.quoteSafe ? ' · quotable' : ' · cite-only')).join('; ') || '—'}</td>`
      + '</tr>';
  });

  const cRows = claims.map(n => {
    const g = gradeOf(n);
    return '<tr data-row="' + esc(n.id) + '">'
      + `<th scope="row"><button type="button" class="og-rowlink" data-id="${esc(n.id)}">${esc(idx.label(n.workId))}</button>${drawnMark(n)}</th>`
      + `<td>${esc(txt(n.typeTerm))}</td>`
      + `<td>${esc(txt(n.subject))}</td>`
      + `<td>${n.repoCoverage == null ? 'withheld' : esc(n.repoCoverage)}</td>`
      + `<td>${n.textCompleteness == null ? 'withheld' : esc(n.textCompleteness)}</td>`
      + `<td>${n.witnessCompleteness == null ? 'withheld' : esc(n.witnessCompleteness)}</td>`
      + `<td>${esc(txt(n.completenessBasis) || '—')}</td>`
      + `<td>${esc(txt(n.incompletenessKind) || '—')}</td>`
      + `<td>${arr(n.harm).length ? '⚠ ' + esc(arr(n.harm).join(', ')) : '—'}</td>`
      + `<td><details class="og-ev"><summary>${esc(g)} — the evidence</summary>`
      + `<p>${esc(txt(n.completenessEvidence) || txt(n.gradeWithheld) || 'none recorded')}</p>`
      + (arr(n.harm).length ? `<p class="og-ev-harm">${esc(txt(n.harmNote))}</p>` : '')
      + '</details></td>'
      + `<td><cite>${esc(txt(n.cite))}</cite></td>`
      + '</tr>';
  });

  const rRows = rels.map(n => '<tr data-row="' + esc(n.id) + '"' + (n.asserted === false ? ' class="og-row-struck"' : '') + '>'
    + `<th scope="row"><button type="button" class="og-rowlink" data-id="${esc(n.id)}">${esc(idx.label(n.fromId))}</button>${drawnMark(n)}</th>`
    + `<td>${esc(txt(n.relation))}</td>`
    + `<td>${esc(idx.label(n.toId))}</td>`
    + `<td>${n.asserted === false ? 'NOT asserted' : 'asserted'}</td>`
    + `<td>${n.procedureLevel ? 'procedure-level' : 'work-level'}</td>`
    + `<td>${esc(txt(n.propagatedTypeTerm) || '—')}</td>`
    + `<td>${esc(txt(n.label))}</td>`
    + `<td><cite>${esc(txt(n.bestCitation))}</cite></td>`
    + `<td>${esc(txt(n.note))}</td>`
    + `<td>${esc(txt(n.notAssertedReason) || txt(n.confusedBy) || '—')}</td>`
    + '</tr>');

  const vRows = vocab.map(n => '<tr data-row="' + esc(n.id) + '">'
    + `<th scope="row"><button type="button" class="og-rowlink" data-id="${esc(n.id)}">${esc(txt(n.term) || txt(n.label))}</button></th>`
    + `<td>${esc(txt(n.family))}</td>`
    + `<td>${esc(txt(n.gloss))}</td>`
    + `<td>${esc(String(num(n.occupancy)))}</td>`
    + `<td>${esc(txt(n.warrant) || '—')}</td>`
    + '</tr>');

  const sRows = scaf.map(n => '<tr data-row="' + esc(n.id) + '">'
    + `<th scope="row"><button type="button" class="og-rowlink" data-id="${esc(n.id)}">${esc(txt(n.label))}</button>${drawnMark(n)}</th>`
    + `<td>${esc(n.type)}</td>`
    + `<td>${esc(txt(n.region) || txt(n.kind) || '—')}</td>`
    + `<td>${esc(txt(n.periodText) || txt(n.attributionNote) || '—')}</td>`
    + `<td>${n.type === 'culture'
      ? (idx.byType.get('work') || []).filter(w => arr(w.cultureIds).includes(n.id)).length
      : (idx.worksByAuthor.get(n.id) || []).length}</td>`
    + '</tr>');

  return '<div class="og-mirror" id="og-mirror-body">'
    + tbl('og-tbl-works', `A · Works (${works.length})`,
      ['work', 'culture', 'date', 'role', 'claims', 'best grade', 'weight', 'pressure', 'witnesses', 'atlas slug', 'edition / quotation'],
      wRows.length ? wRows : ['<tr><td colspan="11">No work matches the current filter.</td></tr>'],
      'One row per procedure-bearing work in the current view. Selecting a title opens the same record the diagram opens.')
    + tbl('og-tbl-claims', `B · Procedure claims (${claims.length})`,
      ['work', 'type', 'what it is for', 'repo', 'text', 'witness', 'basis', 'incompleteness', 'harm', 'evidence', 'citation'],
      cRows.length ? cRows : ['<tr><td colspan="11">No procedure claim matches the current filter.</td></tr>'],
      'The three completeness axes are kept apart on purpose: what this site records, what the work contains, and what the edition in hand gives are three different questions, and they come apart.')
    + tbl('og-tbl-prop', `C · Propagation and relation claims (${rels.length})`,
      ['from', 'relation', 'to', 'asserted?', 'level', 'propagated type', 'label', 'citation', 'note', 'why not asserted / who confused them'],
      rRows.length ? rRows : ['<tr><td colspan="10">No relation claim matches the current filter.</td></tr>'],
      'Rows marked <b>NOT asserted</b> are relations the record refuses to draw, kept visible with their reason. A <b>NON_EDGE</b> row is a claim that two works are <i>not</i> related, naming who confused them.')
    + tbl('og-tbl-vocab', `D · Procedure-type vocabulary (${vocab.length})`,
      ['term', 'family', 'gloss', 'occupancy', 'warrant'],
      vRows.length ? vRows : ['<tr><td colspan="5">No vocabulary term matches the current filter.</td></tr>'],
      'A term with an occupancy of zero carries a warrant — the finding that justifies keeping an empty slot rather than folding an unlike procedure into a near-enough one.')
    + tbl('og-tbl-scaffold', `E · Cultures and authors (${scaf.length})`,
      ['name', 'kind', 'region / attribution kind', 'period / note', 'works'],
      sRows.length ? sRows : ['<tr><td colspan="5">No culture or author node matches the current filter.</td></tr>'],
      'These sit in the diagram’s side gutters. An author node’s <i>kind</i> records the shape of the attribution — a person, a pseudonymous attribution, an anonymous hand, or a corporate body — because three of those defeat a naive work→author arrow, and a rejected attribution is kept and drawn struck rather than deleted.')
    + '</div>';
}

// ---------------------------------------------------------------------------
//  THE FILTER BAR — checkbox groups; every control is keyboard-operable and
//  nothing is hover-only
// ---------------------------------------------------------------------------
function group(name, key, items, selected, open) {
  const on = new Set(selected);
  const body = items.map(([val, label, count]) =>
    `<label class="og-check"><input type="checkbox" data-fgroup="${esc(key)}" value="${esc(val)}"${on.has(val) ? ' checked' : ''}>`
    + `<span>${esc(label)}${count == null ? '' : ` <span class="og-n">${esc(String(count))}</span>`}</span></label>`).join('');
  return `<details class="og-fgroup"${open ? ' open' : ''}><summary>${esc(name)}${on.size ? ` <span class="og-n">${on.size} on</span>` : ''}</summary>`
    + `<div class="og-fbody">${body || '<p class="small muted">nothing to filter on</p>'}</div></details>`;
}

export function filtersHTML(model, idx) {
  const f = model.filter;
  const cults = (idx.byType.get('culture') || []).slice()
    .sort((a, b) => (txt(a.region) + txt(a.label)) < (txt(b.region) + txt(b.label)) ? -1 : 1)
    .map(c => [c.id, `${txt(c.label)}${txt(c.region) ? ` (${txt(c.region)})` : ''}`, model.byCulture.get(c.id) || 0]);
  const types = (idx.byType.get('procedure-type') || []).slice()
    .sort((a, b) => (txt(a.family) + txt(a.term)) < (txt(b.family) + txt(b.term)) ? -1 : 1)
    .map(t => [txt(t.term) || t.id, `${txt(t.term) || txt(t.label)} — ${txt(t.family)}`, num(t.occupancy)]);
  const grades = GRADES.map(g => [g, `${GRADE_GLYPH[g]} ${g} — ${GRADE_GLOSS[g]}`, model.byGrade.get(g) || 0]);
  const labels = LABELS.map(l => [l, l, model.byLabel.get(l) || 0]);

  return '<div class="og-filters" id="og-filters">'
    + group('Culture', 'cultures', cults, f.cultures, false)
    + group('Procedure type', 'types', types, f.types, false)
    + group('Completeness', 'grades', grades, f.grades, false)
    + group('Epistemic label', 'labels', labels, f.labels, false)
    + '<div class="og-fgroup og-fgroup-flat">'
    + '<p class="og-flabel" id="og-weight-label">Minimum weight</p>'
    + `<div class="seg" role="group" aria-labelledby="og-weight-label">${[0, 0.6, 0.8].map(v =>
      `<button type="button" data-weight="${v}" aria-pressed="${num(f.minWeight) === v}">${v === 0 ? 'all (≥ 0.40)' : '≥ ' + v}</button>`).join('')}</div>`
    + `<label class="og-check"><input type="checkbox" id="og-harm-only"${f.harmOnly ? ' checked' : ''}><span>Harm-flagged records only</span></label>`
    + `<label class="og-check"><input type="checkbox" id="og-show-na"${f.showNotAsserted ? ' checked' : ''}><span>Show relations recorded as <b>not asserted</b></span></label>`
    + '<p class="small muted">Non-asserted relations are shown by default. Hiding them is how a struck claim quietly becomes an unstruck one.</p>'
    + '<p><button type="button" class="btn-secondary" id="og-reset">Reset every filter</button></p>'
    + '</div></div>';
}

// ---------------------------------------------------------------------------
//  THE CONTROLLER — one reducer, one render, no DOM. The browser shell and the
//  headless test drive exactly this.
// ---------------------------------------------------------------------------
export function createOpgraph({ nodes, edges, vocab, meta, gate, engine, width = 1280,
  orientation = 'LR', cap = NODE_CAP }) {
  const idx = indexGraph(nodes, edges);
  const state = {
    filter: defaultFilter(), zoom: 1, orientation, width,
    selected: null, chain: null, cap, layoutError: null,
  };
  const eng = engine || {};

  const layoutFn = typeof eng.layoutOpgraph === 'function' ? eng.layoutOpgraph
    : (typeof eng.layoutOpGraph === 'function' ? eng.layoutOpGraph : null);

  function layoutNow(cap) {
    if (!layoutFn) { state.layoutError = 'no layout function'; return null; }
    try {
      const lo = layoutFn({
        width: state.width, zoom: state.zoom, orientation: state.orientation,
        filter: engineFilter(state.filter), cap,
      });
      if (!lo || !Array.isArray(lo.nodes)) { state.layoutError = 'layout returned no nodes'; return null; }
      state.layoutError = null;
      return lo;
    } catch (e) { state.layoutError = (e && e.message) || 'layout threw'; return null; }
  }

  function model() {
    const full = layoutNow(Infinity);
    const draw = full ? layoutNow(state.cap) : null;
    return buildModel({
      idx, layoutFull: full, layoutDraw: draw, filter: state.filter, cap: state.cap,
      pressure: typeof eng.attributionPressure === 'function' ? eng.attributionPressure : null,
    });
  }

  function acyclic() {
    if (typeof eng.assertAcyclic !== 'function') return null;
    try { return eng.assertAcyclic(); } catch { return null; }
  }

  const pressureOf = id => {
    if (typeof eng.attributionPressure !== 'function') return null;
    try { const v = eng.attributionPressure(id); return typeof v === 'number' && isFinite(v) ? v : null; } catch { return null; }
  };

  // The DETAIL render — the dossier and the chain only. Opening a record must
  // not rebuild several hundred ledger rows and re-lay-out the graph; it also
  // means the node layer survives, so keyboard focus is not thrown away by the
  // act of using the keyboard.
  function detail() {
    const sel = state.selected ? idx.byId.get(state.selected) : null;
    return {
      dossier: sel ? dossierHTML(sel, {
        idx, model: { pressure: pressureOf }, pressureNote: txt(eng.ATTRIBUTION_PRESSURE_NOTE),
      }) : '',
      chain: state.chain ? chainHTML(state.chain, idx) : '',
      selected: state.selected,
    };
  }

  function render() {
    const m = model();
    const sel = state.selected ? idx.byId.get(state.selected) : null;
    return {
      model: m,
      index: indexHTML(m, idx, meta, gate),
      filters: filtersHTML(m, idx),
      structure: structureHTML(acyclic(), idx),
      svg: stageSVG(m, idx),
      nodes: stageNodesHTML(m, idx),
      counter: counterHTML(m),
      mirror: mirrorHTML(m, idx),
      dossier: sel ? dossierHTML(sel, { idx, model: m, meta, pressureNote: txt(eng.ATTRIBUTION_PRESSURE_NOTE) }) : '',
      chain: state.chain ? chainHTML(state.chain, idx) : '',
      layoutError: state.layoutError,
    };
  }

  // actions that change only which record is open — never the selection set
  const DETAIL_ACTIONS = new Set(['activate', 'select', 'close', 'chain']);

  function apply(a) {
    const t = a && a.type;
    if (t === 'activate' || t === 'select') {
      if (idx.byId.has(a.id)) state.selected = a.id;
    } else if (t === 'close') {
      state.selected = null;
    } else if (t === 'chain') {
      if (!idx.byId.has(a.id)) state.chain = null;
      else if (typeof eng.chainFrom === 'function') {
        try { state.chain = adaptChain(eng.chainFrom(a.id), a.id); }
        catch { state.chain = walkChain(a.id, idx); }
      } else state.chain = walkChain(a.id, idx);
    } else if (t === 'filter') {
      const f = state.filter;
      if (Array.isArray(f[a.group])) {
        const set = new Set(f[a.group]);
        if (a.on) set.add(a.value); else set.delete(a.value);
        f[a.group] = [...set];
      } else { f[a.group] = a.value; }
    } else if (t === 'zoom') {
      state.zoom = ZOOMS.includes(a.value) ? a.value : 1;
    } else if (t === 'width') {
      state.width = Math.max(320, num(a.value, 1280));
    } else if (t === 'hash') {
      state.filter = decodeFilter(a.value);
    } else if (t === 'reset') {
      state.filter = defaultFilter(); state.selected = null; state.chain = null;
    }
    return state;
  }

  const dispatch = a => { apply(a); return render(); };

  return {
    state, idx, model, render, detail, apply, dispatch, DETAIL_ACTIONS,
    hash: () => encodeFilter(state.filter),
  };
}

// ---------------------------------------------------------------------------
//  THE DOM SHELL — the only DOM-aware code in this module
// ---------------------------------------------------------------------------
const $ = id => (typeof document === 'undefined' ? null : document.getElementById(id));

export async function initOpgraph() {
  if (typeof document === 'undefined') return null;
  let data, engine;
  try {
    data = await import('../core/data/opgraph.js');
    engine = await import('../core/opgraph.js');
  } catch (e) {
    const host = $('og-stage-host');
    if (host) {
      host.innerHTML = '<div class="callout bad"><span class="label">The dataset is not on this build</span>'
        + 'The generated operative-graph module could not be loaded, so this page has nothing to draw and says so '
        + 'rather than rendering an empty frame.</div>';
    }
    return null;
  }

  const measure = () => {
    const sc = $('og-scroll');
    return Math.max(360, Math.round(sc && sc.clientWidth ? sc.clientWidth : 1280));
  };

  const ctl = createOpgraph({
    nodes: data.OPGRAPH_NODES, edges: data.OPGRAPH_EDGES,
    vocab: data.OPGRAPH_VOCAB, meta: data.OPGRAPH_META,
    // the gate summary is optional and is read two ways, because a named export
    // that does not exist is a link error while a missing property is just null
    gate: data.OPGRAPH_GATE_SUMMARY
      || (data.OPGRAPH_META && (data.OPGRAPH_META.gate || data.OPGRAPH_META.gateSummary)) || null,
    engine, width: measure(),
  });

  if (typeof location !== 'undefined' && location.hash) ctl.dispatch({ type: 'hash', value: location.hash });

  let focusId = null;
  let parked = false;

  function paint(out) {
    const set = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
    set('og-index', out.index);
    set('og-filters-host', out.filters);
    set('og-structure', out.structure);
    set('og-svg-host', out.svg);
    set('og-nodes', out.nodes);
    set('og-counter-host', out.counter);
    set('og-mirror', out.mirror);
    set('og-chain-host', out.chain);

    const stage = $('og-stage');
    if (stage) {
      stage.style.width = out.model.width ? out.model.width + 'px' : '';
      stage.style.height = out.model.height ? out.model.height + 'px' : '';
    }
    const warn = $('og-layout-warning');
    if (warn) {
      warn.hidden = !out.layoutError;
      if (out.layoutError) {
        warn.innerHTML = '<div class="callout bad"><span class="label">The diagram was not drawn</span>'
          + 'The layout engine returned nothing for this view, so no picture is shown. The ledger below carries every '
          + 'claim in full; a missing diagram costs the picture, not the record.</div>';
      }
    }
    const dr = $('og-drawer');
    if (dr) {
      dr.innerHTML = out.dossier;
      dr.hidden = !out.dossier;
    }
    // roving tabindex over the painted node faces
    const layer = $('og-nodes');
    if (layer) {
      const btns = Array.from(layer.querySelectorAll('.og-node'));
      if (btns.length) {
        const cur = btns.find(b => b.dataset.id === focusId) || btns[0];
        focusId = cur.dataset.id;
        for (const b of btns) b.tabIndex = b === cur ? 0 : -1;
      }
    }
    // The engine parks the culture and author gutters at the far left, so the
    // first screenful of an unscrolled stage is scaffolding. Park the viewport
    // on the first WORK instead — a scroll offset, not a change to the layout,
    // and only on the first paint, so it never fights a reader who has scrolled.
    if (!parked) {
      const sc = $('og-scroll');
      const first = out.model.drawn.find(n => n.type === 'work');
      const p = first ? out.model.pos.get(first.id) : null;
      if (sc && p) {
        sc.scrollLeft = Math.max(0, Math.round(num(p.x) - num(p.w, 190) / 2 - 24));
        parked = true;
      }
    }
    if (typeof history !== 'undefined' && history.replaceState) {
      const h = ctl.hash();
      try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch { /* non-fatal */ }
    }
  }

  function paintDetail(d) {
    const dr = $('og-drawer');
    if (dr) { dr.innerHTML = d.dossier; dr.hidden = !d.dossier; }
    const ch = $('og-chain-host'); if (ch) ch.innerHTML = d.chain;
    const layer = $('og-nodes');
    if (layer) {
      for (const b of layer.querySelectorAll('.og-node')) {
        b.classList.toggle('og-selected', b.dataset.id === d.selected);
        b.setAttribute('aria-expanded', b.dataset.id === d.selected ? 'true' : 'false');
      }
    }
  }

  // Opening a record repaints the record, not the page: the ledger can run to
  // several hundred rows and the layout is two engine calls, so rebuilding them
  // to open a drawer would be waste the reader feels.
  const go = a => {
    ctl.apply(a);
    if (ctl.DETAIL_ACTIONS.has(a && a.type)) paintDetail(ctl.detail());
    else paint(ctl.render());
  };

  // ---- delegated interaction ----------------------------------------------
  const stageHost = $('og-nodes');
  if (stageHost) {
    stageHost.addEventListener('click', ev => {
      const b = ev.target.closest && ev.target.closest('.og-node');
      if (!b) return;
      focusId = b.dataset.id;
      go({ type: 'activate', id: b.dataset.id, via: 'click' });
      const close = $('og-drawer-close'); if (close) close.focus();
    });
    stageHost.addEventListener('keydown', ev => {
      const b = ev.target.closest && ev.target.closest('.og-node');
      if (!b) return;
      if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
        ev.preventDefault();
        focusId = b.dataset.id;
        go({ type: 'activate', id: b.dataset.id, via: 'key' });
        const close = $('og-drawer-close'); if (close) close.focus();
        return;
      }
      const btns = Array.from(stageHost.querySelectorAll('.og-node'));
      const i = btns.indexOf(b);
      let j = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') j = Math.min(btns.length - 1, i + 1);
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') j = Math.max(0, i - 1);
      else if (ev.key === 'Home') j = 0;
      else if (ev.key === 'End') j = btns.length - 1;
      if (j >= 0) {
        ev.preventDefault();
        for (const x of btns) x.tabIndex = -1;
        btns[j].tabIndex = 0; btns[j].focus();
        focusId = btns[j].dataset.id;
      }
    });
  }

  const mirror = $('og-mirror');
  if (mirror) {
    mirror.addEventListener('click', ev => {
      const b = ev.target.closest && ev.target.closest('.og-rowlink');
      if (!b) return;
      go({ type: 'activate', id: b.dataset.id, via: 'click' });
      const close = $('og-drawer-close'); if (close) close.focus();
    });
  }

  const drawerHost = $('og-drawer');
  if (drawerHost) {
    drawerHost.addEventListener('click', ev => {
      const t = ev.target;
      if (t.closest && t.closest('#og-drawer-close')) { go({ type: 'close' }); return; }
      const ch = t.closest && t.closest('.og-chain-btn');
      if (ch) { go({ type: 'chain', id: ch.dataset.chain }); return; }
      const gt = t.closest && t.closest('[data-goto]');
      if (gt) { ev.preventDefault(); go({ type: 'activate', id: gt.dataset.goto, via: 'click' }); }
    });
  }

  const filtersHost = $('og-filters-host');
  if (filtersHost) {
    filtersHost.addEventListener('change', ev => {
      const t = ev.target;
      if (t.dataset && t.dataset.fgroup) { go({ type: 'filter', group: t.dataset.fgroup, value: t.value, on: t.checked }); return; }
      if (t.id === 'og-harm-only') { go({ type: 'filter', group: 'harmOnly', value: t.checked }); return; }
      if (t.id === 'og-show-na') { go({ type: 'filter', group: 'showNotAsserted', value: t.checked }); }
    });
    filtersHost.addEventListener('click', ev => {
      const w = ev.target.closest && ev.target.closest('[data-weight]');
      if (w) { go({ type: 'filter', group: 'minWeight', value: Number(w.dataset.weight) }); return; }
      if (ev.target.closest && ev.target.closest('#og-reset')) go({ type: 'reset' });
    });
  }

  const zoomHost = $('og-zoom');
  if (zoomHost) {
    zoomHost.addEventListener('click', ev => {
      const z = ev.target.closest && ev.target.closest('[data-zoom]');
      if (z) {
        for (const b of zoomHost.querySelectorAll('[data-zoom]')) b.setAttribute('aria-pressed', String(Number(b.dataset.zoom) === Number(z.dataset.zoom)));
        go({ type: 'zoom', value: Number(z.dataset.zoom) });
      }
    });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && ctl.state.selected) go({ type: 'close' }); });
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      const w = measure();
      if (Math.abs(w - ctl.state.width) > 24) go({ type: 'width', value: w });
    });
  }

  paint(ctl.render());
  return ctl;
}

export default { initOpgraph, createOpgraph };
