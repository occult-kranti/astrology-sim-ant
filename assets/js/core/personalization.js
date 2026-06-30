// ============================================================================
//  personalization.js — "tuned to a specific person." Picatrix astral magic is
//  primarily ELECTIONAL (the power is in the chosen moment), but the tradition
//  TUNES the work to the native's own chart (Picatrix III.5: “if the planet is
//  the dispositor of the nativity of the magician, or the almuten ruling it,
//  your work will be even more complete”). This module computes, from a natal
//  chart, what the tradition would use to personalise an election/talisman:
//
//   • the ALMUTEN FIGURIS — the almuten over the five hylegiacal places
//     (Ascendant, Sun, Moon, Part of Fortune, pre-natal syzygy); Zoller/Warnock
//     identify this with the planet of the PERFECT NATURE (Picatrix III.6);
//   • the native's RULING PLANETS (almuten figuris, almuten of the Ascendant,
//     Lord of the Geniture, the Ascendant lord, the sect light);
//   • per magical AIM, a RADIX-HARMONY fit — “suits you” when the aim’s ruling
//     planet is one of yours / a dignified friend; “caution” when it is an
//     afflicted malefic in your chart or afflicts your Ascendant lord (the
//     prohibitive limb — do not strengthen a signifier of harm in your nativity).
//
//  HONEST FRAMING: historical doctrine, described never prescribed; astrology
//  has no demonstrated validity. PURE — no DOM, headless-testable.
// ============================================================================
import { signOf, partOfFortune } from './astro.js';
import { essentialDignity, accidentalDignity, almuten } from './dignities.js';
import { aspectBetween } from './aspects.js';
import { DOMICILE } from './data/dignities-data.js';
import { prenatalSyzygy } from './hyleg.js';
import { OPERATIONS } from './election.js';

const PLANETS7 = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const BENEFIC = new Set(['Jupiter', 'Venus']);
const MALEFIC = new Set(['Mars', 'Saturn']);

// The four barbarous names of the Perfect Nature (Picatrix III.6) — voces, not
// chart points. Kept here so the panel can name them; the COMPUTABLE element is
// the associated planet (the almuten figuris).
export const PERFECT_NATURE_NAMES = ['Meegius (Tamāghīs)', 'Betzahuech (Baghdīswād)', 'Vacdez (Waghdās)', 'Nufeneguediz (Nūfānāghādīs)'];

// The almuten over the five hylegiacal places — the "almuten figuris".
export function almutenFiguris(birthChart) {
  const isDay = birthChart.isDay;
  const places = [
    { name: 'Ascendant', lon: birthChart.asc },
    { name: 'Sun', lon: birthChart.planets.Sun.lon },
    { name: 'Moon', lon: birthChart.planets.Moon.lon },
    { name: 'Part of Fortune', lon: birthChart.planets.Fortune ? birthChart.planets.Fortune.lon
        : partOfFortune(birthChart.asc, birthChart.planets.Sun.lon, birthChart.planets.Moon.lon) },
  ];
  let syzNote = '';
  try { const s = prenatalSyzygy(birthChart.date); places.push({ name: 'Pre-natal syzygy', lon: s.lon }); }
  catch (e) { syzNote = ' (syzygy omitted: ' + (e && e.message ? e.message : 'n/a') + ')'; }

  const totals = {}; for (const p of PLANETS7) totals[p] = 0;
  for (const place of places) {
    const all = almuten(place.lon, isDay).all;   // {planet: positive-dignity score at that degree}
    for (const p of PLANETS7) totals[p] += all[p] || 0;
  }
  let best = null, bestScore = -1;
  for (const p of PLANETS7) if (totals[p] > bestScore) { bestScore = totals[p]; best = p; }
  return { planet: best, score: bestScore, totals, places: places.map(p => p.name), note: syzNote };
}

function lordOfGeniture(birthChart) {
  let best = null, bestScore = -Infinity;
  for (const planet of PLANETS7) {
    const p = birthChart.planets[planet]; if (!p) continue;
    let score = -Infinity;
    try { score = essentialDignity(planet, p.lon, birthChart.isDay).total + accidentalDignity(planet, birthChart).total; } catch { /* skip */ }
    if (score > bestScore) { bestScore = score; best = planet; }
  }
  return best;
}

// The native's ruling planets (deduped, ordered by tradition's weight).
export function rulingPlanets(birthChart) {
  const isDay = birthChart.isDay;
  const af = almutenFiguris(birthChart).planet;
  const almAsc = almuten(birthChart.asc, isDay).planet;
  const log = lordOfGeniture(birthChart);
  const ascLord = DOMICILE[signOf(birthChart.asc).index];
  const sectLight = isDay ? 'Sun' : 'Moon';
  const order = [af, almAsc, log, ascLord, sectLight];
  const out = [];
  for (const r of order) if (r && PLANETS7.includes(r) && !out.includes(r)) out.push(r);
  return out;
}

// Condition of a planet in the natal chart (for radix-harmony judgement).
function natalCondition(birthChart, planet) {
  const p = birthChart.planets[planet]; if (!p) return null;
  const ed = essentialDignity(planet, p.lon, birthChart.isDay);
  const ad = accidentalDignity(planet, birthChart);
  return { essential: ed.total, combust: ad.rows.some(r => r.kind === 'Combust'), retrograde: !!p.retrograde, lon: p.lon };
}

// ---------------------------------------------------------------------------
//  personalize(birthChart) — the full personalization object.
// ---------------------------------------------------------------------------
export function personalize(birthChart) {
  if (!birthChart || !birthChart.planets) return null;
  const af = almutenFiguris(birthChart);
  const rulers = rulingPlanets(birthChart);
  const ruleSet = new Set(rulers);
  const ascLord = DOMICILE[signOf(birthChart.asc).index];
  const ascLordPos = birthChart.planets[ascLord];

  const aims = OPERATIONS.map(o => {
    const R = o.ruler;
    const cond = natalCondition(birthChart, R) || { essential: 0, combust: false, retrograde: false };
    // does the aim's ruler afflict the native's Ascendant lord by a hard aspect?
    let afflictsAsc = false;
    if (R !== ascLord && ascLordPos && birthChart.planets[R]) {
      const a = aspectBetween(R, birthChart.planets[R], ascLord, ascLordPos);
      if (a && (a.aspect === 'Square' || a.aspect === 'Opposition' || a.aspect === 'Conjunction') && MALEFIC.has(R) && cond.essential < 0) afflictsAsc = true;
    }
    let fit, reason;
    if (ruleSet.has(R)) {
      fit = 'suits';
      reason = `${R} is one of this nativity’s ruling planets${R === af.planet ? ' (the almuten figuris — the planet of the Perfect Nature)' : ''}, so the tradition counts ${o.label.toLowerCase()} among the works naturally yours — “your work will be even more complete” (Picatrix III.5).`;
    } else if ((MALEFIC.has(R) && cond.essential < 0) || afflictsAsc) {
      fit = 'caution';
      reason = `${R} is ${afflictsAsc ? 'an afflicting malefic upon your Ascendant lord' : 'an ill-dignified malefic in your nativity'} — the tradition warns AGAINST strengthening a planet that signifies harm in your own chart (the prohibitive limb of radix-harmony).`;
    } else if (BENEFIC.has(R) && cond.essential >= 0) {
      fit = 'suits';
      reason = `${R} is a dignified benefic in your nativity — a friendly planet, fit to work with.`;
    } else {
      fit = 'neutral';
      reason = `${R} is neither a ruling planet nor an afflicted malefic in your nativity — the work is electionally driven, neither specially favoured nor warned against for you.`;
    }
    return { key: o.key, label: o.label, ruler: R, fit, reason, natalEssential: cond.essential };
  });

  return {
    almutenFiguris: { planet: af.planet, score: af.score, places: af.places, note: af.note },
    rulingPlanets: rulers,
    ascLord,
    perfectNature: {
      planet: af.planet,
      names: PERFECT_NATURE_NAMES,
      description: `The Perfect Nature (al-Ṭibāʿ al-Tāmm, Picatrix III.6) is the practitioner’s personal celestial guardian — the spirit linking the sage to “the planet that governs him.” For this nativity that planet (the almuten figuris) is ${af.planet}. The Perfect Nature itself is reached by rite, not calculation; its four names are barbarous voces, not chart points.`,
    },
    aims,
    citation: 'Picatrix III.5 (work the dispositor/almuten of your nativity) & III.6 (the Perfect Nature); the almuten figuris after Ibn Ezra / Zoller–Warnock. Historical doctrine, described never prescribed.',
  };
}
