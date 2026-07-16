// ============================================================================
//  synastry.js — SYNASTRY: the aspect grid BETWEEN two nativities, plus the
//  house-overlay both ways. Both Catherine Urban ("Family Dynamics" multi-chart
//  work) and Patrick Watson (tutors "Synastry") practise relationship astrology;
//  the engine previously had only jung.js's five-point marriage-experiment
//  cross-aspects. This is the full chart-to-chart matrix.
//
//  WHAT IS CLASSICAL vs MODERN (kept explicit, per the site's framing):
//   • CLASSICAL CORE — Ptolemy, Tetrabiblos IV.5 (Robbins, Loeb 1940): marriages
//     "are lasting when in both the genitures the luminaries happen to be in
//     harmonious aspect… and particularly when this comes about by exchange."
//     So the luminary interaspects (Sun/Moon of A to Sun/Moon of B) are the
//     cited classical kernel — surfaced separately as `luminaryContacts`.
//     Dorotheus, Carmen Bk II treats marriage significations.
//   • MODERN CONVENTION — the full planet-by-planet N×N grid is a modern form;
//     it is provided, but LABELLED modern. Jung's 1952 marriage experiment
//     (jung.js) is the historical bridge — and our own wing shows its null
//     result (pages/jung/experiment.html).
//
//  ORBS: reused wholesale from aspects.js (Lilly's PLANET-based orbs and the
//  moiety rule) — no duplicated tables. Modern synastry would use tighter
//  aspect-based orbs; that difference is noted in SYNASTRY_ORB_NOTE.
//
//  HONEST FRAMING: synastry has no demonstrated validity — described, never
//  prescribed. PURE MODULE — no DOM; two cast charts are passed in.
// ============================================================================

import { norm360, signOf, houseOf, formatLon } from './astro.js';
import { aspectBetween } from './aspects.js';

// The seven traditional bodies — the default 7×7 grid.
export const SYNASTRY_BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
// The four angles, offered as optional extra rows/cols.
export const SYNASTRY_ANGLES = ['Ascendant', 'Midheaven', 'Descendant', 'IC'];

export const SYNASTRY_CITATION =
  'Classical core: Ptolemy, Tetrabiblos IV.5 (Robbins, Loeb 1940) — lasting marriage by the two genitures’ luminaries '
  + 'in harmonious aspect, especially by exchange; Dorotheus, Carmen Bk II — marriage significations. The full planet-'
  + 'by-planet grid is a MODERN convention (Jung’s 1952 marriage experiment, jung.js, is the historical bridge — and '
  + 'its result was null: see the Jung wing). Orbs are Lilly’s moieties (aspects.js).';

export const SYNASTRY_ORB_NOTE =
  'Orbs here are Lilly’s planet-based moieties (the sum of the two bodies’ half-orbs — the same rule aspects.js uses '
  + 'for a single chart). Modern synastry typically uses tighter aspect-based orbs (e.g. 8° conj, 6° trine/square, '
  + '4° sextile). The whole-sign column is degree-independent: a sign-to-sign aspect regardless of orb.';

// Whole-sign aspect between two signs by their separation in signs: 0=conj,
// 2=sextile, 3=square, 4=trine, 6=opposition (5 and 1 = aversion → none).
const SIGN_ASPECT = { 0: 'Conjunction', 6: 'Opposition', 4: 'Trine', 3: 'Square', 2: 'Sextile' };
function wholeSignAspect(lonA, lonB) {
  const sep = Math.abs(signOf(lonA).index - signOf(lonB).index);
  const d = Math.min(sep, 12 - sep);
  return SIGN_ASPECT[d] || null;
}

// A body's {lon, speed} from a chart, for planets or the (speed-0) angles.
function bodyOf(chart, name) {
  if (chart.planets && chart.planets[name]) return { lon: chart.planets[name].lon, speed: chart.planets[name].speed || 0 };
  const ANG = { Ascendant: chart.asc, Midheaven: chart.mc, Descendant: norm360(chart.asc + 180), IC: norm360(chart.mc + 180) };
  if (ANG[name] != null) return { lon: ANG[name], speed: 0 };
  return null;
}

// ---------------------------------------------------------------------------
//  synastryGrid(chartA, chartB, opts?)
//
//  opts:
//    bodies        the bodies to grid (default SYNASTRY_BODIES → 7×7)
//    includeAngles add Asc/MC/Desc/IC as extra rows & cols          [false]
//    overlayBodies the bodies counted in the house overlays (default the 7)
//
//  Returns {
//    rows, cols,                        // parallel name arrays (rows=A, cols=B)
//    cells:[[cell|null]],               // cells[i][j]: A.rows[i] × B.cols[j]
//    hits:[{ bodyA, bodyB, aspect, glyph, nature, angle, orb, applying,
//            separating, wholeSign }],  // the non-null cells, flattened
//    luminaryContacts:[…hits where both bodies ∈ {Sun,Moon}],  // Ptolemy IV.5
//    counts:{ aspects, byAspect:{} },
//    houseOverlay:{ aInB:{ list, byHouse }, bInA:{ list, byHouse } },
//    orbNote, citation
//  }
//  Symmetry contract: synastryGrid(B,A).cells is the transpose of
//  synastryGrid(A,B).cells, with each cell's aspect & orb preserved.
// ---------------------------------------------------------------------------
export function synastryGrid(chartA, chartB, opts = {}) {
  if (!chartA || !chartB || !chartA.planets || !chartB.planets) {
    throw new Error('synastryGrid: two cast charts (with .planets) are required');
  }
  const base = opts.bodies || SYNASTRY_BODIES;
  const names = opts.includeAngles ? [...base, ...SYNASTRY_ANGLES] : base.slice();

  const cells = [];
  const hits = [];
  const byAspect = {};
  for (let i = 0; i < names.length; i++) {
    const a = bodyOf(chartA, names[i]);
    const row = [];
    for (let j = 0; j < names.length; j++) {
      const b = bodyOf(chartB, names[j]);
      if (!a || !b) { row.push(null); continue; }
      const asp = aspectBetween(names[i], a, names[j], b);
      const ws = wholeSignAspect(a.lon, b.lon);
      if (!asp && !ws) { row.push(null); continue; }
      const cell = asp ? {
        bodyA: names[i], bodyB: names[j], aspect: asp.aspect, glyph: asp.glyph,
        nature: asp.nature, angle: asp.angle, orb: asp.orb,
        applying: asp.applying, separating: asp.separating, allowance: asp.allowance,
        wholeSign: ws,
      } : {
        bodyA: names[i], bodyB: names[j], aspect: null, glyph: null, nature: null,
        angle: null, orb: null, applying: null, separating: null, wholeSign: ws, wholeSignOnly: true,
      };
      row.push(cell);
      if (asp) { hits.push(cell); byAspect[asp.aspect] = (byAspect[asp.aspect] || 0) + 1; }
    }
    cells.push(row);
  }

  const luminaryContacts = hits.filter(h =>
    (h.bodyA === 'Sun' || h.bodyA === 'Moon') && (h.bodyB === 'Sun' || h.bodyB === 'Moon'));

  const overlayBodies = opts.overlayBodies || SYNASTRY_BODIES;
  const houseOverlay = {
    aInB: overlay(chartA, chartB, overlayBodies),   // A's planets in B's houses
    bInA: overlay(chartB, chartA, overlayBodies),   // B's planets in A's houses
  };

  return {
    rows: names.slice(), cols: names.slice(), cells, hits,
    luminaryContacts,
    counts: { aspects: hits.length, byAspect },
    houseOverlay,
    orbNote: SYNASTRY_ORB_NOTE, citation: SYNASTRY_CITATION,
  };
}

// Which of `who`'s bodies fall in which of `host`'s houses.
function overlay(who, host, bodies) {
  const list = [];
  const byHouse = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  for (const name of bodies) {
    const p = who.planets[name];
    if (!p) continue;
    const house = houseOf(p.lon, host.cusps);
    list.push({ body: name, lon: p.lon, label: formatLon(p.lon), house });
    byHouse[house].push(name);
  }
  return { list, byHouse, total: list.length };
}
