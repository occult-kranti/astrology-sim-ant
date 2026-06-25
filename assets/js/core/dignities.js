// ============================================================================
//  dignities.js — Essential & accidental dignity scoring, à la Lilly (CA Bk 1).
//  Produces the same "ledger" Lilly builds in his worked examples: a list of
//  dignities/debilities with point values, plus the net total.
// ============================================================================
import { signOf, norm360 } from './astro.js';
import {
  DOMICILE, DETRIMENT, EXALTATION, EXALT_BY_SIGN, TRIPLICITY_BY_SIGN, DIGNITY_SCORES,
  termRulerAt, faceRulerAt, FIXED_STARS, SOLAR, ORBS
} from './data/dignities-data.js';

// --- Essential dignity of a planet at a longitude, given chart sect (isDay) ---
export function essentialDignity(planet, lon, isDay) {
  const s = signOf(lon);
  const si = s.index, d = s.degInSign;
  const rows = [];

  // Domicile (+5) — only meaningful for the 7 planets
  if (DOMICILE[si] === planet) rows.push({ kind: 'Domicile', score: DIGNITY_SCORES.domicile });

  // Exaltation (+4)
  const ex = EXALTATION[planet];
  if (ex && ex.sign === si) rows.push({ kind: 'Exaltation', score: DIGNITY_SCORES.exaltation });

  // Triplicity (+3) — day/night ruler per Lilly
  const tri = TRIPLICITY_BY_SIGN[si];
  if (tri && ((isDay && tri.day === planet) || (!isDay && tri.night === planet)))
    rows.push({ kind: 'Triplicity', score: DIGNITY_SCORES.triplicity });

  // Term (+2)
  if (termRulerAt(si, d) === planet) rows.push({ kind: 'Term', score: DIGNITY_SCORES.term });

  // Face (+1)
  if (faceRulerAt(si, d) === planet) rows.push({ kind: 'Face', score: DIGNITY_SCORES.face });

  // Debilities
  let inDetriment = false, inFall = false;
  if (DETRIMENT[si] === planet) { rows.push({ kind: 'Detriment', score: DIGNITY_SCORES.detriment }); inDetriment = true; }
  // a planet's fall = the sign opposite its exaltation
  const oppEx = Object.entries(EXALTATION).find(([, e]) => (e.sign + 6) % 12 === si);
  if (oppEx && oppEx[0] === planet) { rows.push({ kind: 'Fall', score: DIGNITY_SCORES.fall }); inFall = true; }

  // Peregrine: a planet with NO essential dignity of its own AND not already
  // debilitated by detriment or fall (so we never double-count a debility).
  const hasDignity = rows.some(r => r.score > 0);
  let peregrine = false;
  if (!hasDignity && !inDetriment && !inFall) {
    peregrine = true;
    rows.push({ kind: 'Peregrine', score: DIGNITY_SCORES.peregrine });
  }

  const total = rows.reduce((a, r) => a + r.score, 0);
  return { rows, total, peregrine, dispositor: DOMICILE[si] };
}

// --- Accidental dignity, given the cast chart and a planet name ---
// Returns the list of accidental fortitudes/debilities with point values.
export function accidentalDignity(planet, chart) {
  const p = chart.planets[planet];
  const rows = [];
  const add = (kind, score) => rows.push({ kind, score });
  const house = p.house;
  const sun = chart.planets.Sun;

  // House placement
  const HOUSE_SCORE = { 1: 5, 10: 5, 7: 4, 4: 4, 11: 4, 2: 3, 5: 3, 9: 2, 3: 1, 12: -5, 8: -2, 6: -2 };
  if (HOUSE_SCORE[house] !== undefined) {
    const sc = HOUSE_SCORE[house];
    add(`In the ${ordinal(house)} house`, sc);
  }

  // Direct / retrograde / speed (luminaries excluded from direct/retro)
  if (planet !== 'Sun' && planet !== 'Moon' && planet !== 'NorthNode' && planet !== 'SouthNode' && planet !== 'Fortune') {
    if (p.retrograde) add('Retrograde', -5); else add('Direct', +4);
    const mean = MEAN_SPEED[planet];
    if (mean) {
      if (Math.abs(p.speed) > mean) add('Swift in motion', +2); else add('Slow in motion', -2);
    }
  } else if (planet === 'Moon') {
    if (Math.abs(p.speed) > MEAN_SPEED.Moon) add('Swift in motion', +2); else add('Slow in motion', -2);
  }
  if (planet === 'Moon') {
    // increasing in light (waxing) when 0–180° ahead of the Sun
    const elong = norm360(p.lon - sun.lon);
    if (elong < 180) add('Increasing in light', +2); else add('Decreasing in light', -2);
  }

  // Combustion / cazimi / under the beams (not for the Sun itself)
  if (planet !== 'Sun' && planet !== 'NorthNode' && planet !== 'SouthNode' && planet !== 'Fortune') {
    const sep = Math.abs(((p.lon - sun.lon + 540) % 360) - 180); // angular distance 0..180
    const dist = 180 - sep; // distance from the Sun, 0..180
    const fromSun = Math.min(norm360(p.lon - sun.lon), norm360(sun.lon - p.lon));
    if (fromSun <= SOLAR.cazimi) add('Cazimi (heart of the Sun)', +5);
    else if (fromSun <= SOLAR.combust) add('Combust', -5);
    else if (fromSun <= SOLAR.underBeams) add('Under the Sun’s beams', -4);
    else add('Free from combustion & the Sun’s beams', +5);
  }

  // Fixed-star conjunctions (Lilly's three table stars)
  for (const star of FIXED_STARS) {
    const orb = star.name.includes('Algol') ? 5 : 2;
    if (Math.min(norm360(p.lon - star.lon), norm360(star.lon - p.lon)) <= orb)
      add(`Conjunct ${star.name}`, star.score);
  }

  const total = rows.reduce((a, r) => a + r.score, 0);
  return { rows, total };
}

// Mean daily motion (degrees/day) used for the swift/slow accidental test.
const MEAN_SPEED = { Saturn: 0.034, Jupiter: 0.083, Mars: 0.524, Venus: 1.2, Mercury: 1.383, Moon: 13.176 };

function ordinal(n) {
  return { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 8: '8th', 9: '9th', 10: '10th', 11: '11th', 12: '12th' }[n];
}

// --- The five dignity rulers at a longitude (for reception tests) ---
export function dignityRulersAt(lon, isDay) {
  const s = signOf(lon), si = s.index, d = s.degInSign;
  const tri = TRIPLICITY_BY_SIGN[si];
  return {
    domicile: DOMICILE[si],
    exaltation: EXALT_BY_SIGN[si] ? EXALT_BY_SIGN[si].planet : null,
    triplicity: isDay ? tri.day : tri.night,
    term: termRulerAt(si, d),
    face: faceRulerAt(si, d)
  };
}

// --- Almuten of a degree: the planet with most essential dignity there ---
export function almuten(lon, isDay) {
  const scores = {};
  for (const planet of ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon']) {
    const ed = essentialDignity(planet, lon, isDay);
    scores[planet] = ed.rows.filter(r => r.score > 0).reduce((a, r) => a + r.score, 0);
  }
  let best = null, bestScore = -1;
  for (const [p, sc] of Object.entries(scores)) if (sc > bestScore) { bestScore = sc; best = p; }
  return { planet: best, score: bestScore, all: scores };
}
