// ============================================================================
//  aspects.js — Ptolemaic aspects with Lilly's planet-based orbs and the
//  moiety (half-orb) rule, plus applying/separating determination.
//
//  Lilly assigns orbs to PLANETS, not aspects. Two planets are in a platic
//  aspect when their angular distance from the exact aspect is less than the
//  sum of their two moieties (half-orbs). An aspect is "applying" when the
//  faster planet is moving toward exactitude, "separating" when moving away.
// ============================================================================
import { norm360 } from './astro.js';
import { moiety } from './data/dignities-data.js';

export const ASPECTS = [
  { name: 'Conjunction', glyph: '☌', angle: 0,   nature: 'neutral' },
  { name: 'Sextile',     glyph: '⚹', angle: 60,  nature: 'easy' },
  { name: 'Square',      glyph: '□', angle: 90,  nature: 'hard' },
  { name: 'Trine',       glyph: '△', angle: 120, nature: 'easy' },
  { name: 'Opposition',  glyph: '☍', angle: 180, nature: 'hard' }
];

// Smallest separation (0..180) between two longitudes.
function sep(a, b) { return Math.abs(((a - b + 540) % 360) - 180); }

// Find the aspect (if any) between two bodies, with orb & applying/separating.
// pA/pB are {lon, speed} objects; nameA/nameB used for moiety lookup.
export function aspectBetween(nameA, pA, nameB, pB) {
  const distance = sep(pA.lon, pB.lon);
  const allowance = moiety(nameA) + moiety(nameB);
  for (const asp of ASPECTS) {
    const orbOff = Math.abs(distance - asp.angle);
    if (orbOff <= allowance) {
      // applying vs separating: compare current separation-from-exact now vs a
      // short time ahead, using relative motion.
      const dt = 0.05;
      const futA = pA.lon + (pA.speed || 0) * dt;
      const futB = pB.lon + (pB.speed || 0) * dt;
      const futOff = Math.abs(sep(futA, futB) - asp.angle);
      const applying = futOff < orbOff;
      return {
        aspect: asp.name, glyph: asp.glyph, nature: asp.nature, angle: asp.angle,
        orb: orbOff, exact: orbOff < 0.0167 * allowance, // ~partile
        partile: Math.floor(((pA.lon % 30))) === Math.floor((pB.lon % 30)) && orbOff < 1,
        applying, separating: !applying, allowance
      };
    }
  }
  return null;
}

// All aspects among a set of named bodies {name: {lon, speed}}.
export function allAspects(bodies) {
  const names = Object.keys(bodies);
  const out = [];
  for (let i = 0; i < names.length; i++)
    for (let j = i + 1; j < names.length; j++) {
      const a = aspectBetween(names[i], bodies[names[i]], names[j], bodies[names[j]]);
      if (a) out.push({ from: names[i], to: names[j], ...a });
    }
  return out;
}

// Mutual reception: do two planets each sit in a dignity ruled by the other?
// dignityFns.rulersAt(lon) should return {domicile, exaltation, triplicity, term, face}.
export function mutualReception(nameA, lonA, nameB, lonB, rulersAt) {
  const ra = rulersAt(lonA), rb = rulersAt(lonB);
  const inB = Object.entries(ra).filter(([, v]) => v === nameB).map(([k]) => k); // A is in B's dignity
  const inA = Object.entries(rb).filter(([, v]) => v === nameA).map(([k]) => k);
  if (inB.length && inA.length) return { byA: inB, byB: inA };
  return null;
}
