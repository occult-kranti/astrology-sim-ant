// ============================================================================
//  progressions.js — SECONDARY PROGRESSIONS: the "day-for-a-year" symbolic
//  time-map. The classical statement is Vettius Valens, Anthology IX.3 (trans.
//  M. Riley): "add a number of days to the birth date equivalent to the age
//  (in years) of the native… cast a horoscope for that day." The modern
//  formalization is conventionally credited to Placidus (17th c.) — with
//  Salmasius as a rival claimant, and M. Gansten cautioning that Placidus's
//  own variant may have been lunar-month-based — so the attribution is an
//  open question, flagged here rather than asserted.
//
//  CONVENTIONS IMPLEMENTED (the standard modern ones):
//   • Progressed instant = birth instant + ageYears DAYS, where the age is in
//     TROPICAL years: age = elapsed_ms / (365.2422 × 86 400 000 ms). One real
//     ephemeris day after birth ≡ one tropical year of life.
//   • Planets: real ephemeris positions (bodyPosition) at the progressed
//     instant — nothing is re-derived symbolically.
//   • Angles: progressed by the NAIBOD ARC ONLY — the Sun's MEAN daily motion,
//     360°/365.2422 = 0.98564733°/yr = 59′08″ per year (Valentin Naibod,
//     16th c.; matches this workbench's primary-directions Naibod key in
//     directions.js). Progressed MC = natal MC + Naibod arc; the progressed
//     Ascendant is RE-DERIVED from that MC through the birth latitude and the
//     natal obliquity (see ascFromMC below). The recognized alternatives —
//     solar-arc MC, solar arc in right ascension, mean quotidian — are
//     deliberately OUT OF SCOPE for this module.
//
//  CITATIONS:
//   • Valens, Anthologies IX.3, trans. Mark T. Riley (2010; free PDF,
//     csus.edu; annotated ed. github.com/janegca/latex-valens) — the classical
//     day-for-a-year statement.
//   • Naibod rate 0.98564733°/yr = 59′08″/yr: standard references (e.g.
//     Forrest, "How to calculate progressed angles"; iPhemeris progression-
//     types documentation lists Naibod among the angle keys).
//   • Placidus/Salmasius attribution question: T. Louis, "Reflections on
//     secondary progressions" (2019), citing M. Gansten.
//
//  HONEST FRAMING: a symbolic mapping of days onto years — a historical
//  technique with no demonstrated predictive validity. Described, never
//  prescribed.
//
//  PURE — no DOM, no network, no randomness; dates are passed in.
// ============================================================================
import { castChart, bodyPosition, norm360, D2R, R2D } from './astro.js';

// One tropical year in days (mean, J2000 epoch value used across this repo).
export const TROPICAL_YEAR_DAYS = 365.2422;

// The Naibod rate: the Sun's mean daily motion, degrees per year of life.
// 360 / 365.2422 = 0.98564733…° = 0°59′08.33″.
export const NAIBOD_DEG_PER_YEAR = 360 / TROPICAL_YEAR_DAYS;

export const PROGRESSIONS_CITATION =
  'Day-for-a-year: Valens, Anthologies IX.3 (trans. M. Riley, 2010) — "add a number of days to the birth date '
  + 'equivalent to the age (in years) of the native… cast a horoscope for that day"; modern formalization '
  + 'conventionally credited to Placidus (17th c.; Salmasius a rival claimant — Gansten, via T. Louis 2019, '
  + 'cautions the attribution). Angles by the Naibod arc only: 360°/365.2422 = 0.98564733°/yr = 59′08″/yr '
  + '(Valentin Naibod, 16th c.). Alternatives (solar-arc MC, solar arc in RA, mean quotidian) are out of scope.';

// The seven traditional planets progressed by ephemeris.
const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// ---------------------------------------------------------------------------
//  Age in TROPICAL years between two instants (fractional; negative if
//  onDate precedes birthDate).
// ---------------------------------------------------------------------------
export function ageFromDates(birthDate, onDate) {
  return (onDate.getTime() - birthDate.getTime()) / (TROPICAL_YEAR_DAYS * 86400000);
}

// The Naibod arc (degrees) accumulated by a given age in years.
export function naibodArc(ageYears) {
  return NAIBOD_DEG_PER_YEAR * ageYears;
}

// ---------------------------------------------------------------------------
//  Ascendant from a Midheaven, latitude and obliquity (all degrees).
//  First recover the RAMC from the MC (inverse of the standard MC formula,
//  quadrant-safe):      RAMC = atan2( sin MC · cos ε, cos MC )
//  then the Ascendant:  Asc  = atan2( sin(RAMC+90°),
//                                     cos(RAMC+90°)·cos ε − sin ε·tan φ )
//  These are exactly the H=0 and H=90 cases of the unified cusp formula in
//  astro.js, so at age 0 this reproduces the natal Asc to floating precision.
// ---------------------------------------------------------------------------
export function ascFromMC(mcLon, latitudeDeg, obliquityDeg) {
  const er = obliquityDeg * D2R, pr = latitudeDeg * D2R, mr = mcLon * D2R;
  const ramc = Math.atan2(Math.sin(mr) * Math.cos(er), Math.cos(mr)) * R2D;
  const a = (ramc + 90) * D2R;
  return norm360(Math.atan2(
    Math.sin(a),
    Math.cos(a) * Math.cos(er) - Math.sin(er) * Math.tan(pr)
  ) * R2D);
}

// ---------------------------------------------------------------------------
//  progressedPositions(birthDate, lat, lon, ageYears, opts?)
//  → {
//      ageYears, progressedDate,
//      planets: { Sun:{lon,lat,speed,retrograde}, … },   // ephemeris at the
//                                                        // progressed instant
//      naibodArcDeg,                                     // 0.98564733 × age
//      progressedMC, progressedAsc,                      // Naibod-arc angles
//      natal,                                            // the natal chart
//      angleMethod, citation
//    }
//  opts.system: house system for the natal cast (default 'regiomontanus').
// ---------------------------------------------------------------------------
export function progressedPositions(birthDate, lat, lon, ageYears, opts = {}) {
  const system = opts.system || 'regiomontanus';
  const natal = castChart(birthDate, lat, lon, system);
  const progressedDate = new Date(birthDate.getTime() + ageYears * 86400000);

  const planets = {};
  for (const name of PLANETS7) planets[name] = bodyPosition(name, progressedDate);

  const naibodArcDeg = naibodArc(ageYears);
  const progressedMC = norm360(natal.mc + naibodArcDeg);
  const progressedAsc = ascFromMC(progressedMC, lat, natal.obliquity);

  return {
    ageYears, progressedDate, planets, naibodArcDeg, progressedMC, progressedAsc, natal,
    angleMethod: 'Naibod arc (mean Sun, 0.98564733°/yr) applied to the natal MC; Ascendant re-derived '
      + 'from the progressed MC through the birth latitude and natal obliquity. Solar-arc MC, solar arc '
      + 'in RA and mean quotidian are recognized alternatives, out of scope here.',
    citation: PROGRESSIONS_CITATION,
  };
}
