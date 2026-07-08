// ============================================================================
//  jung.js — the C. G. Jung astrology engine: the chart-work Jung actually did,
//  computed by the same engine as everything else.
//
//   • jungianReading(chart)      — the "psychological horoscope": Jung cast natal
//     charts for patients as a diagnostic angle (letter to B. V. Raman, 1947).
//     Reads the planets as ARCHETYPAL images (Sol/consciousness, Luna/anima,
//     Mercurius, the senex…), the element→function balance of the four
//     psychological types, the anima/animus significators, and the Sol–Luna
//     coniunctio — every line cited, and post-Jungian doctrine flagged as such.
//   • crossAspects(a, b) / jungAspectHits(a, b) — the SYNASTRY grid of Jung's
//     marriage experiment (Synchronicity, 1952, CW 8): the conjunctions and
//     oppositions between two nativities among Sun, Moon, Venus, Mars, Asc, MC,
//     with the three classic "marriage aspects" (Sun☌Moon, Moon☌Moon, Moon☌Asc)
//     flagged.
//   • experimentBatch(rand, opts) / expectedRate(orb) — the honest NULL MODEL of
//     that experiment: chance pairing gives independent longitudes, so the
//     expected hit-rate of an aspect is just the orb-window over the circle.
//     Jung's own result was not statistically significant, and he said so.
//   • aeonClock(date) — Aion (1951): the precession of the equinoxes, the
//     Platonic year & month, how far the vernal point has moved through Pisces,
//     and the competing datings of the "Age of Aquarius" (Jung's own included).
//
//  PURE — no DOM, no RNG (the experiment takes an injected rand). HONEST
//  FRAMING: Jung USED astrology; he did not validate it. Described, never
//  prescribed.
// ============================================================================
import { signOf, formatLon, norm360, PLANET_GLYPHS } from './astro.js';
import { aspectBetween } from './aspects.js';
import { lahiriAyanamsa } from './data/vedic-data.js';
import {
  JUNG_PLANET_ARCHETYPES, ELEMENT_FUNCTIONS, ANIMA_ANIMUS_NOTE, CONIUNCTIO_NOTE,
  JUNG_EXPERIMENT, AEON, JUNG_BIRTH,
} from './data/jung-astrology.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const angSep = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// ---------------------------------------------------------------------------
//  jungianReading(chart) — the psychological horoscope.
// ---------------------------------------------------------------------------
export function jungianReading(chart, opts = {}) {
  // planets as archetypal images
  const planets = PLANETS7.map(name => {
    const p = chart.planets[name];
    const arch = JUNG_PLANET_ARCHETYPES.find(a => a.planet === name) || {};
    return {
      planet: name, glyph: PLANET_GLYPHS[name] || '', label: formatLon(p.lon),
      sign: signOf(p.lon).name, house: p.house, retrograde: !!p.retrograde,
      archetype: arch.archetype || '', meaning: arch.meaning || '', cite: arch.cite || '',
    };
  });

  // element → function balance (the four psychological types). The mapping of
  // elements to functions is largely POST-Jungian (Greene/Arroyo) — flagged in
  // the data and repeated in the caveat below. Weighted: luminaries 2, Asc 1.
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const ELEMENT_CYCLE = ['Fire', 'Earth', 'Air', 'Water'];   // Aries, Taurus, Gemini, Cancer, …
  const elOf = lon => ELEMENT_CYCLE[signOf(lon).index % 4];
  for (const name of PLANETS7) tally[elOf(chart.planets[name].lon)] += (name === 'Sun' || name === 'Moon') ? 2 : 1;
  tally[elOf(chart.asc)] += 1;
  const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const functions = ELEMENT_FUNCTIONS.map(ef => ({ ...ef, weight: tally[ef.element] }));
  const dominant = ELEMENT_FUNCTIONS.find(ef => ef.element === ranked[0][0]);
  const inferior = ELEMENT_FUNCTIONS.find(ef => ef.element === ranked[ranked.length - 1][0]);
  // Jung's typology pairs the inferior with the superior on an axis (thinking↔
  // feeling, sensation↔intuition). When the chart's weakest ELEMENT is not the
  // dominant's opposite, say so rather than silently equating the two ideas.
  const OPPOSITE = { Intuition: 'Sensation', Sensation: 'Intuition', Thinking: 'Feeling', Feeling: 'Thinking' };
  const axisNote = dominant && inferior && OPPOSITE[dominant.function] !== inferior.function
    ? `Note: in Jung’s typology the inferior function is the DOMINANT’s opposite on its axis (${dominant.function}↔${OPPOSITE[dominant.function]}); this chart’s weakest element points instead at ${inferior.function}, so read “${inferior.function}” as the weakest elemental emphasis, not strictly the Jungian inferior function.`
    : null;

  // the Sol–Luna relation (the coniunctio motif of Mysterium Coniunctionis)
  const sunMoon = aspectBetween('Sun', chart.planets.Sun, 'Moon', chart.planets.Moon);
  const coniunctio = {
    aspect: sunMoon ? sunMoon.aspect : null,
    orb: sunMoon ? sunMoon.orb : null,
    text: sunMoon
      ? `Sol and Luna stand in ${sunMoon.aspect.toLowerCase()} (orb ${sunMoon.orb.toFixed(1)}°) — the tradition Jung mined in Mysterium Coniunctionis read the Sun–Moon relation as the image of the coniunctio, the union of conscious and unconscious.`
      : 'Sol and Luna make no Ptolemaic aspect — in the alchemical image Jung studied, the luminaries stand apart; the coniunctio is not figured in this chart.',
    note: CONIUNCTIO_NOTE,
  };

  // anima/animus significators — era-bound doctrine, flagged
  const moon = chart.planets.Moon, venus = chart.planets.Venus, sun = chart.planets.Sun, mars = chart.planets.Mars;
  const animaAnimus = {
    anima: `Moon at ${formatLon(moon.lon)} (house ${moon.house}) and Venus at ${formatLon(venus.lon)} (house ${venus.house})`,
    animus: `Sun at ${formatLon(sun.lon)} (house ${sun.house}) and Mars at ${formatLon(mars.lon)} (house ${mars.house})`,
    note: ANIMA_ANIMUS_NOTE,
  };

  // the shadow marker: Saturn (the senex) and his hard aspects to the lights
  const saturn = chart.planets.Saturn;
  const satHard = ['Sun', 'Moon'].map(l => {
    const a = aspectBetween('Saturn', saturn, l, chart.planets[l]);
    return a && (a.aspect === 'Conjunction' || a.aspect === 'Square' || a.aspect === 'Opposition') ? `${a.aspect.toLowerCase()} ${l}` : null;
  }).filter(Boolean);
  const shadow = {
    saturn: `Saturn (the senex) at ${formatLon(saturn.lon)}, house ${saturn.house}${saturn.retrograde ? ', retrograde' : ''}`,
    hardAspects: satHard,
    text: satHard.length
      ? `Saturn afflicts the light${satHard.length > 1 ? 's' : ''} (${satHard.join('; ')}) — a placement post-Jungian astrologers read as the shadow pressing on consciousness.`
      : 'Saturn makes no hard aspect to the lights — the senex stands apart from the luminaries in this figure.',
  };

  return {
    planets, elements: { tally, functions, dominant, inferior, axisNote },
    coniunctio, animaAnimus, shadow,
    caveat: 'A psychological horoscope after Jung’s practice: he cast charts as "a further point of view from an entirely different angle" in difficult diagnoses (letter to B. V. Raman, 6 Sept 1947) — a projective, interpretive aid, never a validated instrument. The element→function mapping and the shadow reading are largely post-Jungian doctrine (Greene, Arroyo), flagged as such. Astrology has no demonstrated validity.',
    cite: 'C. G. Jung, Letters vol. 1 (to B. V. Raman, 6 Sept 1947); CW 13 (the spirit Mercurius); CW 14 Mysterium Coniunctionis; post-Jungian: L. Greene, S. Arroyo.',
  };
}

// ---------------------------------------------------------------------------
//  crossAspects(a, b) — the synastry grid of the marriage experiment. Jung
//  tallied the conjunctions & oppositions of Sun, Moon, Mars, Venus, ASCENDANT
//  and DESCENDANT between the spouses' charts (CW 8 §878; MC/IC deliberately
//  omitted, §878 n.3). A conjunction with the Descendant IS an opposition with
//  the Ascendant, so the conj+opp grid over the five points below covers his
//  contact set exactly, without double-counting the axis.
// ---------------------------------------------------------------------------
export const SYNASTRY_POINTS = ['Sun', 'Moon', 'Venus', 'Mars', 'Asc'];
const pointLon = (chart, name) => name === 'Asc' ? chart.asc : name === 'MC' ? chart.mc : chart.planets[name].lon;

export function crossAspects(chartA, chartB, opts = {}) {
  const orb = opts.orb ?? JUNG_EXPERIMENT.orb;
  const points = opts.points || SYNASTRY_POINTS;
  const hits = [];
  for (const pa of points) for (const pb of points) {
    const la = pointLon(chartA, pa), lb = pointLon(chartB, pb);
    const sep = angSep(la, lb);
    if (sep <= orb) hits.push({ from: pa, to: pb, aspect: 'Conjunction', glyph: '☌', orb: sep });
    else if (Math.abs(sep - 180) <= orb) hits.push({ from: pa, to: pb, aspect: 'Opposition', glyph: '☍', orb: Math.abs(sep - 180) });
  }
  return hits.sort((x, y) => x.orb - y.orb);
}

// The three aspects that topped Jung's three batches. His tallies were
// DIRECTIONAL (batch 1's maximum was "the wife's Moon conjunct the husband's
// Sun", 18 of 180 — CW 8 §880 and the appendix); the tool below reports the
// CLOSEST of either direction for display, labelled as such.
export const JUNG_MARRIAGE_ASPECTS = [
  { a: 'Sun', b: 'Moon', aspect: 'Conjunction', label: 'Sun ☌ Moon', batch: 1 },
  { a: 'Moon', b: 'Moon', aspect: 'Conjunction', label: 'Moon ☌ Moon', batch: 2 },
  { a: 'Moon', b: 'Asc', aspect: 'Conjunction', label: 'Moon ☌ Ascendant', batch: 3 },
];

export function jungAspectHits(chartA, chartB, opts = {}) {
  const orb = opts.orb ?? JUNG_EXPERIMENT.orb;
  return JUNG_MARRIAGE_ASPECTS.map(m => {
    const seps = [
      angSep(pointLon(chartA, m.a), pointLon(chartB, m.b)),
      angSep(pointLon(chartA, m.b), pointLon(chartB, m.a)),
    ];
    const best = Math.min(...seps);
    return { ...m, present: best <= orb, orb: best, sense: 'closest of either direction' };
  });
}

// ---------------------------------------------------------------------------
//  The experiment's honest null model. Chance pairing makes the partners'
//  longitudes independent and (near enough) uniform, so the probability that
//  one DIRECTIONAL cross-conjunction (e.g. wife's Moon on husband's Sun — the
//  statistic Jung and Fierz actually counted) falls within ±orb is 2·orb/360
//  ≈ 4.4% at 8°. experimentBatch simulates one batch of chance "marriages"
//  with an injected rand(), tallying the three classical aspects one-way,
//  exactly as the experiment did.
// ---------------------------------------------------------------------------
export const expectedRate = orb => (2 * orb) / 360;

export function experimentBatch(rand, opts = {}) {
  if (typeof rand !== 'function') throw new Error('experimentBatch: needs an injected rand() (the app supplies randomness)');
  const pairs = opts.pairs ?? 80;
  const orb = opts.orb ?? JUNG_EXPERIMENT.orb;
  const counts = { sunMoon: 0, moonMoon: 0, moonAsc: 0 };
  for (let i = 0; i < pairs; i++) {
    const A = { sun: rand() * 360, moon: rand() * 360, asc: rand() * 360 };
    const B = { sun: rand() * 360, moon: rand() * 360, asc: rand() * 360 };
    if (angSep(A.moon, B.sun) <= orb) counts.sunMoon++;     // one direction, as tallied
    if (angSep(A.moon, B.moon) <= orb) counts.moonMoon++;
    if (angSep(A.moon, B.asc) <= orb) counts.moonAsc++;
  }
  return {
    pairs, orb, counts,
    rates: { sunMoon: counts.sunMoon / pairs, moonMoon: counts.moonMoon / pairs, moonAsc: counts.moonAsc / pairs },
    expected: { single: expectedRate(orb) },
  };
}

// The FAITHFUL batch statistic: Jung reported each batch's BEST-scoring aspect
// out of all FIFTY cross-aspects (the conj+opp of 5 points against 5 points,
// direction distinguished — CW 8 §878). experimentBatchFull simulates a chance
// batch and returns the max over the same fifty tallies, which is the number
// his ~10% maxima must honestly be compared against.
export function experimentBatchFull(rand, opts = {}) {
  if (typeof rand !== 'function') throw new Error('experimentBatchFull: needs an injected rand()');
  const pairs = opts.pairs ?? 180;
  const orb = opts.orb ?? JUNG_EXPERIMENT.orb;
  const counts = new Array(50).fill(0);
  for (let i = 0; i < pairs; i++) {
    const A = [rand() * 360, rand() * 360, rand() * 360, rand() * 360, rand() * 360];
    const B = [rand() * 360, rand() * 360, rand() * 360, rand() * 360, rand() * 360];
    for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) {
      const sep = angSep(A[a], B[b]);
      if (sep <= orb) counts[a * 5 + b]++;
      if (Math.abs(sep - 180) <= orb) counts[25 + a * 5 + b]++;
    }
  }
  const maxCount = Math.max(...counts);
  return { pairs, orb, maxCount, maxRate: maxCount / pairs };
}

// ---------------------------------------------------------------------------
//  aeonClock(date) — Aion: the precession clock.
// ---------------------------------------------------------------------------
export const PRECESSION_ARCSEC_PER_YEAR = 50.28796;               // IAU general precession in longitude
export const PLATONIC_YEAR = 360 * 3600 / PRECESSION_ARCSEC_PER_YEAR;   // ≈ 25,772 yr
export const PLATONIC_MONTH = PLATONIC_YEAR / 12;                        // ≈ 2,148 yr

const SIDEREAL_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export function aeonClock(date = new Date(Date.UTC(2026, 0, 1))) {
  const ay = lahiriAyanamsa(date);                     // ° the tropical zodiac has slipped against the sidereal
  const vernalSidereal = norm360(360 - ay);            // sidereal longitude of the vernal point
  const vernalSign = SIDEREAL_SIGNS[Math.floor(vernalSidereal / 30)];
  const inPisces = vernalSign === 'Pisces';            // equal-sign sidereal Pisces = 330–360°
  const degIntoPisces = inPisces ? ay : null;          // ° travelled backward from the Aries boundary
  const degToAquarius = inPisces ? 30 - ay : 0;
  const yearsToAquarius = degToAquarius * 3600 / PRECESSION_ARCSEC_PER_YEAR;
  const year = date.getUTCFullYear() + (date.getUTCMonth() + 0.5) / 12;
  return {
    date: date.toISOString().slice(0, 10),
    ayanamsa: +ay.toFixed(4),
    vernalSiderealLon: +vernalSidereal.toFixed(4),
    vernalSign,                                               // valid for ANY date, not only the Pisces window
    platonicYear: Math.round(PLATONIC_YEAR),
    platonicMonth: Math.round(PLATONIC_MONTH),
    inPisces,
    degIntoPisces: inPisces ? +degIntoPisces.toFixed(3) : null,
    pctThroughPisces: inPisces ? +((degIntoPisces / 30) * 100).toFixed(1) : null,
    degToAquarius: +degToAquarius.toFixed(3),
    yearsToAquarius: inPisces ? Math.round(yearsToAquarius) : 0,
    aquariusYearLahiri: inPisces ? Math.round(year + yearsToAquarius) : null,  // the equal-sign (Lahiri) reckoning
    datings: AEON.datings,                                    // the competing datings, Jung's own included
    note: AEON.note,
    cite: AEON.cite,
  };
}

// Jung's own nativity (as his daughter, the astrologer Gret Baumann-Jung, cast
// it) — exposed so the tool can load it with one click.
export { JUNG_BIRTH, JUNG_EXPERIMENT };
