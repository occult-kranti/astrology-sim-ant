// ============================================================================
//  perfection.js — Lilly's modes by which a horary matter is brought to pass
//  (Book II): direct aspect, translation of light, collection of light,
//  prohibition, refranation; plus the timing of the event from the degrees to
//  perfection scaled by sign-mode and house. Approximates Lilly's discursive
//  method; intended as study support, surfaced as findings (not verdicts).
// ============================================================================
import { aspectBetween } from './aspects.js';
import { signOf } from './astro.js';
import { SIGNS } from './data/signs.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
// fastest → slowest (mean motion order)
const SPEED_ORDER = ['Moon', 'Mercury', 'Venus', 'Sun', 'Mars', 'Jupiter', 'Saturn'];
const faster = (a, b) => SPEED_ORDER.indexOf(a) < SPEED_ORDER.indexOf(b);

// Detect the modes of perfection between two significators A and B.
// rulersAt(lon) → {domicile,exaltation,triplicity,term,face} (for reception).
export function modesOfPerfection(chart, A, B, rulersAt) {
  const pA = chart.planets[A], pB = chart.planets[B];
  const out = { direct: null, translation: null, collection: null, prohibition: null, refranation: null, reception: null };
  if (!pA || !pB || A === B) return out;
  const others = PLANETS7.filter(n => n !== A && n !== B);

  // Direct aspect between the significators
  const d = aspectBetween(A, pA, B, pB);
  if (d) out.direct = d;

  // Reception between A and B (mutual or one-way)
  const rA = rulersAt(pA.lon), rB = rulersAt(pB.lon);
  const aInB = Object.entries(rB).filter(([, v]) => v === A).map(([k]) => k);
  const bInA = Object.entries(rA).filter(([, v]) => v === B).map(([k]) => k);
  if (aInB.length || bInA.length) out.reception = { mutual: aInB.length && bInA.length, aReceivedByB: bInA, bReceivedByA: aInB };

  // Translation of light: a lighter planet separates from one significator and
  // applies to the other.
  for (const C of others) {
    const pC = chart.planets[C];
    const aCA = aspectBetween(C, pC, A, pA), aCB = aspectBetween(C, pC, B, pB);
    if (aCA && aCB) {
      if (aCA.separating && aCB.applying && faster(C, A)) out.translation = { carrier: C, from: A, to: B };
      else if (aCB.separating && aCA.applying && faster(C, B)) out.translation = { carrier: C, from: B, to: A };
    }
  }

  // Collection of light: both significators apply to a heavier planet that
  // receives them in its dignities.
  for (const C of others) {
    if (faster(C, A) || faster(C, B)) continue; // C must be slower (heavier) than both
    const pC = chart.planets[C];
    const aAC = aspectBetween(A, pA, C, pC), aBC = aspectBetween(B, pB, C, pC);
    if (aAC && aAC.applying && aBC && aBC.applying) {
      const rC = rulersAt(pC.lon);
      const received = Object.values(rC).includes(A) && Object.values(rC).includes(B);
      out.collection = { collector: C, received };
    }
  }

  // Prohibition: while A and B apply, a third planet perfects with one of them
  // first (closer orb, and faster), cutting the matter off.
  if (d && d.applying) {
    for (const C of others) {
      const pC = chart.planets[C];
      const aCA = aspectBetween(C, pC, A, pA), aCB = aspectBetween(C, pC, B, pB);
      if (aCA && aCA.applying && aCA.orb < d.orb && faster(C, A)) { out.prohibition = { planet: C, target: A }; break; }
      if (aCB && aCB.applying && aCB.orb < d.orb && faster(C, B)) { out.prohibition = { planet: C, target: B }; break; }
    }
  }

  // Refranation: a significator about to perfect turns retrograde.
  if (d && d.applying) {
    if (pA.retrograde) out.refranation = { planet: A };
    else if (pB.retrograde) out.refranation = { planet: B };
  }
  return out;
}

// Timing: count = degrees to exact aspect; unit scaled by sign-mode & house.
// A practical synthesis of Lilly's method (he "proportions a mean").
const TIMING = {
  Movable: { Angular: 'days', Succedent: 'weeks', Cadent: 'months' },
  Common:  { Angular: 'weeks', Succedent: 'months', Cadent: 'months' },
  Fixed:   { Angular: 'months', Succedent: 'years', Cadent: 'years' }
};
export function houseType(house) {
  if ([1, 4, 7, 10].includes(house)) return 'Angular';
  if ([2, 5, 8, 11].includes(house)) return 'Succedent';
  return 'Cadent';
}
export function timeToPerfection(orbDegrees, lon, house) {
  const mode = SIGNS[signOf(lon).index].mode; // Movable / Fixed / Common
  const unit = (TIMING[mode] || TIMING.Common)[houseType(house)];
  const count = Math.max(0.5, Math.round(orbDegrees * 2) / 2); // half-degree precision
  return { count, unit, mode, house: houseType(house),
    text: `about ${count} ${unit}` };
}
