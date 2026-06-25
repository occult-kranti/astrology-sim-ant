// ============================================================================
//  directions.js — Primary Directions engine for William Lilly's astrology
//  ("Christian Astrology", Book III: directing the significators to come to
//  the promittors, by which the events and accidents of life are timed).
//
//  A primary direction measures the ARC between a SIGNIFICATOR (a radical
//  point — here the Ascendant or Midheaven) and a PROMISSOR (a planet that
//  "promises" an event). That arc, expressed in degrees, is converted into
//  YEARS OF LIFE by a TIME KEY. When the elapsed years equal the arc-in-years,
//  the directed event fructifies.  (Lilly, CA Bk III, on the directions.)
//
//  ── SCOPE & METHOD (read this!) ──────────────────────────────────────────
//  This module implements the SIMPLIFIED ZODIACAL ("in-zodiac") form of the
//  directions: the arc is taken directly along the ecliptic (difference of
//  longitudes), and converted to years with the NAIBOD KEY — the Sun's mean
//  daily motion, 0.985647°/day ≈ 1° per year (mean solar motion). This is an
//  APPROXIMATION and is the default key here.
//
//  The RIGOROUS method — Ptolemaic / Placidian MUNDANE primary directions,
//  which direct points by oblique ascension / proportional semi-arcs in right
//  ascension under the local horizon (Placidus' semi-arc proportion) — is the
//  astronomically correct alternative and is DELIBERATELY OUT OF SCOPE for
//  this file. Treat the figures here as study approximations, not casting-
//  grade mundane directions.
//
//  CITATIONS:
//   • William Lilly, "Christian Astrology" (1647), Book III — the directions
//     (directing significators to promittors; arcs of direction → years).
//   • Naibod key: Valentine Naibod's measure of time = the Sun's mean motion,
//     0.985647°/day ≈ 1° of arc per year of life.
//   • Ptolemy, Tetrabiblos III; Placidus de Titis — mundane directions by
//     semi-arc proportion (the rigorous method NOT implemented here).
//
//  Pure functions only — NO DOM, headless-testable in Node.
// ============================================================================
import { norm360, signOf, formatLon } from './astro.js';

// ---------------------------------------------------------------------------
//  Time keys — degrees of arc that equal ONE year of life.
//   • naibod  : 0.985647°  (the Sun's mean daily motion; Naibod's measure)
//   • ptolemy : 1°         (the simple "a degree for a year" rule)
//  Default key = 'naibod'.
// ---------------------------------------------------------------------------
export const KEYS = { naibod: 0.985647, ptolemy: 1 };

// Convert an arc of direction (degrees) into years of life by a time key.
//   arcDeg : arc in degrees   →   years = arcDeg / KEYS[key]
export function arcToYears(arcDeg, key = 'naibod') {
  return arcDeg / KEYS[key];
}

// ---------------------------------------------------------------------------
//  Direct a significator to a promissor, in-zodiac (simplified).
//
//  Returns the DIRECT arc (the promissor reached by forward succession of the
//  signs, increasing longitude: promissor − significator, 0..360), the
//  CONVERSE arc (the reverse: significator − promissor, 0..360), each with
//  their years, plus the unsigned SHORTEST ecliptic arc `arc` (0..180) as a
//  convenience for aspect-style nearness.
// ---------------------------------------------------------------------------
export function directInZodiac(significatorLon, promissorLon, key = 'naibod') {
  const directArc = norm360(promissorLon - significatorLon);
  const converseArc = norm360(significatorLon - promissorLon);
  // unsigned shortest ecliptic arc, 0..180
  const arc = Math.abs(((promissorLon - significatorLon + 540) % 360) - 180);
  return {
    arc,
    years: arcToYears(arc, key),
    directArc,
    directYears: arcToYears(directArc, key),
    converseArc,
    converseYears: arcToYears(converseArc, key)
  };
}

// ---------------------------------------------------------------------------
//  Primary directions of the seven planets (as promittors) to the two chart
//  angles (as significators: Ascendant & Midheaven), using the DIRECT
//  zodiacal arc. Returns those falling within opts.maxYears (default 90).
//
//  opts: { key = 'naibod', maxYears = 90 }
//  → array of { promissor, significator:'Asc'|'MC', arc, years }
//    sorted ascending by years, filtered to 0 <= years <= maxYears.
// ---------------------------------------------------------------------------
export function directionsToAngles(chart, opts = {}) {
  const key = opts.key || 'naibod';
  const maxYears = opts.maxYears != null ? opts.maxYears : 90;
  const PLANETS7 = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const angles = [
    { significator: 'Asc', lon: chart.asc },
    { significator: 'MC', lon: chart.mc }
  ];
  const out = [];
  for (const ang of angles) {
    for (const promissor of PLANETS7) {
      const p = chart.planets[promissor];
      if (!p) continue;
      const arc = norm360(p.lon - ang.lon); // direct zodiacal arc
      const years = arcToYears(arc, key);
      if (years >= 0 && years <= maxYears) {
        out.push({ promissor, significator: ang.significator, arc, years });
      }
    }
  }
  out.sort((a, b) => a.years - b.years);
  return out;
}
