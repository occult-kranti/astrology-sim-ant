// ============================================================================
//  rectification.js — two classical, CONTESTED methods for correcting an
//  uncertain birth time, from Lilly's Book III and its sources:
//
//   • the ANIMODAR of Ptolemy (Tetrabiblos III.2): take the degree of the
//     pre-natal New or Full Moon, find its almuten (the planet with most
//     dignity there); the degree that almuten occupies WITHIN its sign should
//     be the degree of the nearest angle (Ascendant or Midheaven). We then find
//     the clock time near the stated birth at which the Ascendant reaches that
//     corrected degree, and report the suggested shift.
//
//   • the TRUTINE OF HERMES (Trutina Hermetis): the degree of the Moon at
//     conception equals the degree of the Ascendant at birth, and the degree of
//     the Ascendant at conception equals the degree of the Moon (or its
//     opposite) at birth — over a "standard" gestation of ~273 days. We cast a
//     chart for birth − 273 days as an estimate of conception and report how
//     closely the relation holds, as an explanatory CHECK.
//
//  ⚠ BOTH ARE CONTESTED. Rectification has no demonstrated validity; authors
//  differ on the almuten count, which angle to correct, and the gestation
//  length, and conception is in any case unknown. Every assumption is returned
//  in the result and surfaced in the UI. Described for study, never prescribed.
//
//  PURE — no DOM, headless-testable. Composes astro.js + dignities.js + hyleg.js.
// ============================================================================
import { castChart, houses, signOf, formatLon, norm360 } from './astro.js';
import { almuten } from './dignities.js';
import { prenatalSyzygy } from './hyleg.js';

const angleSep = (a, b) => Math.abs(((a - b + 540) % 360) - 180);   // 0..180

// ---------------------------------------------------------------------------
//  animodar(chart) — Ptolemy's correction of the Ascendant.
// ---------------------------------------------------------------------------
export function animodar(chart) {
  const assumptions =
    'Almuten of the syzygy degree counted by ESSENTIAL dignity only (domicile/exalt/triplicity/term/face), ' +
    'as elsewhere in this engine — Ptolemy also weighs aspect to the syzygy and being angular; ' +
    'documented simplification. The angle corrected is whichever of the Ascendant or MC the syzygy ' +
    'sits closer to. The pre-natal syzygy is the Moon’s degree at the last New (waxing) or Full ' +
    '(waning) Moon before birth.';
  if (!chart.date || chart.latitude == null || chart.longitude == null) {
    return { ok: false, reason: 'Animodar needs a dated, located chart (it re-casts the Ascendant against time).', assumptions };
  }
  let syz;
  try { syz = prenatalSyzygy(chart.date); }
  catch (e) { return { ok: false, reason: 'pre-natal syzygy could not be computed: ' + (e && e.message), assumptions }; }

  const al = almuten(syz.lon, chart.isDay);                 // {planet, score, all}
  const alLon = chart.planets[al.planet] ? chart.planets[al.planet].lon : null;
  if (alLon == null) return { ok: false, reason: 'almuten planet position unavailable', assumptions };
  const degInSign = signOf(alLon).degInSign;                // 0..30 — the corrected degree

  // Which angle is the syzygy nearer — the Asc or the MC?
  const nearMC = angleSep(syz.lon, chart.mc) < angleSep(syz.lon, chart.asc);
  const angleName = nearMC ? 'Midheaven' : 'Ascendant';
  const currentAngle = nearMC ? chart.mc : chart.asc;
  // Corrected angle keeps its current SIGN but takes the almuten's degree-in-sign.
  const correctedAngle = norm360(Math.floor(currentAngle / 30) * 30 + degInSign);

  // Find the clock time near birth where that angle reaches the corrected degree.
  const angleAt = t => {
    const h = houses(t, chart.latitude, chart.longitude, chart.system === 'whole' || chart.system === 'equal' ? 'regiomontanus' : chart.system);
    return nearMC ? h.mc : h.asc;
  };
  const t0 = chart.date.getTime();
  let bestT = t0, bestErr = angleSep(angleAt(chart.date), correctedAngle);
  // scan ±4 hours at 1-minute resolution
  for (let m = -240; m <= 240; m++) {
    const t = new Date(t0 + m * 60000);
    const err = angleSep(angleAt(t), correctedAngle);
    if (err < bestErr) { bestErr = err; bestT = t.getTime(); }
  }
  const deltaMin = Math.round((bestT - t0) / 60000);

  return {
    ok: true,
    syzygy: { type: syz.type, lon: syz.lon, label: formatLon(syz.lon), date: syz.date },
    almuten: al.planet, almutenScore: al.score, almutenLon: alLon, almutenLabel: formatLon(alLon),
    correctedDegInSign: degInSign,
    angle: angleName, currentAngle, currentAngleLabel: formatLon(currentAngle),
    correctedAngle, correctedAngleLabel: formatLon(correctedAngle),
    suggestedTime: new Date(bestT), deltaMinutes: deltaMin, residualDegrees: +bestErr.toFixed(3),
    assumptions,
    citation: 'Ptolemy, Tetrabiblos III.2 (the “Animodar”); Lilly, Christian Astrology Bk III.',
  };
}

// ---------------------------------------------------------------------------
//  trutineOfHermes(chart) — the conception/birth relation, as a CHECK.
// ---------------------------------------------------------------------------
const GESTATION_DAYS = 273;        // the classical "standard" (~10 sidereal months)

export function trutineOfHermes(chart) {
  const assumptions =
    `Conception is ESTIMATED as birth − ${GESTATION_DAYS} days (the classical "standard" gestation); ` +
    'real gestation varies by weeks, and conception is unknown, so this is an explanatory check, not a measurement. ' +
    'The Trutine holds when the natal Ascendant degree ≈ the Moon’s degree at conception, and the natal Moon ' +
    'degree ≈ the Ascendant (or Descendant) at conception.';
  if (!chart.date || chart.latitude == null || chart.longitude == null) {
    return { ok: false, reason: 'The Trutine needs a dated, located chart.', assumptions };
  }
  let conc;
  try {
    const cdate = new Date(chart.date.getTime() - GESTATION_DAYS * 86400000);
    conc = castChart(cdate, chart.latitude, chart.longitude, chart.system === 'whole' || chart.system === 'equal' ? 'regiomontanus' : chart.system);
  } catch (e) {
    return { ok: false, reason: 'conception chart could not be cast: ' + (e && e.message), assumptions };
  }

  const natalAsc = chart.asc, natalMoon = chart.planets.Moon.lon;
  const concMoon = conc.planets.Moon.lon, concAsc = conc.asc, concDesc = norm360(conc.asc + 180);

  const d1 = angleSep(natalAsc, concMoon);                              // Asc(birth) vs Moon(conception)
  const d2 = Math.min(angleSep(natalMoon, concAsc), angleSep(natalMoon, concDesc)); // Moon(birth) vs Asc/Desc(conception)
  const agree = (d1 + d2) / 2;
  const verdict = agree < 8 ? 'close' : agree < 20 ? 'loose' : 'poor';

  return {
    ok: true, gestationDays: GESTATION_DAYS, conceptionDate: conc.date,
    natalAsc: { lon: natalAsc, label: formatLon(natalAsc) },
    natalMoon: { lon: natalMoon, label: formatLon(natalMoon) },
    conceptionMoon: { lon: concMoon, label: formatLon(concMoon) },
    conceptionAsc: { lon: concAsc, label: formatLon(concAsc) },
    ascVsConcMoon: +d1.toFixed(2), moonVsConcAscDesc: +d2.toFixed(2),
    agreementDegrees: +agree.toFixed(2), verdict,
    assumptions,
    citation: 'The Trutina Hermetis (Trutine of Hermes); cf. Ptolemy & Lilly, Christian Astrology Bk III.',
  };
}

// Convenience: run both, for the UI.
export function rectify(chart) {
  return { animodar: animodar(chart), trutine: trutineOfHermes(chart) };
}
