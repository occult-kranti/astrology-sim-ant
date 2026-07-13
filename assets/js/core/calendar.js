// ============================================================================
//  calendar.js — Julian ↔ proleptic-Gregorian conversion + the era-accuracy
//  tiers for HISTORICAL chart casting.
//
//  WHY THIS EXISTS. JS `Date` and the bundled astronomy engine both interpret
//  dates as PROLEPTIC GREGORIAN with astronomical year numbering (1 BCE = 0,
//  2 BCE = −1) — the engine's own docs: "Years prior to 1583 are treated as if
//  they are using the modern Gregorian calendar." Historical sources, however,
//  record dates in the JULIAN calendar until the 1582 reform (England & its
//  colonies until 1752). Feeding a Julian date straight into the engine
//  silently misplaces the chart by up to ~10 days (~10° of solar longitude) —
//  era-dependent: the offset is −9 d at year −1000, ZERO through 200–299 CE,
//  and +10 d for 1500–1582. So conversion is the app's responsibility, here.
//
//  ALGORITHMS (integer arithmetic, no floating point):
//   • Julian/Gregorian calendar date → Julian Day Number: Fliegel & Van
//     Flandern (1968), Comm. ACM 11(10); constants 32083 (Julian) / 32045
//     (Gregorian).
//   • JDN → calendar date: E. G. Richards, in Urban & Seidelmann (eds.),
//     "Explanatory Supplement to the Astronomical Almanac", 3rd ed. (2013),
//     ch. 15; constants 32044 / 146097 / 1461 / 153 (Gregorian), 32082
//     (Julian). Same forms as Meeus, "Astronomical Algorithms", ch. 7.
//   • JDN convention: the day number at NOON of the civil day.
//
//  VERIFIED VECTORS (asserted in scripts/engine-test.mjs, each re-derived
//  independently during research review):
//   • Julian 1582-10-04 = Gregorian 1582-10-14 = JDN 2299160; the next day,
//     Gregorian 1582-10-15, is JDN 2299161 (the reform gap).
//   • John Dee's birth: Julian 1527-07-13 = proleptic Gregorian 1527-07-23
//     (+10 days; the 10-day gap holds for Julian 1500-03-01…1700-02-28).
//   • Thales eclipse: Julian −584-05-28 (28 May 585 BCE) = proleptic
//     Gregorian −584-05-22 = JDN 1507900 (−6 days at that epoch); NASA Five
//     Millennium Canon lists the −584 May 28 total eclipse (#03379).
//   • England 1752: Julian 1752-09-02 (JDN 2361221) was followed by Gregorian
//     1752-09-14 (JDN 2361222) — 11 days dropped (Calendar (New Style) Act
//     1750). English dates 1582–1752 remain Julian, and before 1752 the
//     English civil year began 25 March (double-dating, e.g. "1608/9").
//   • Anchors: Gregorian 2000-01-01 = JDN 2451545 (J2000); 1858-11-17 =
//     JDN 2400001 (MJD 0).
//
//  ERA-ACCURACY TIERS. The astronomy-engine README claims "accurate to within
//  ±1 arcminute" vs NOVAS but states NO year range (verified against the raw
//  README — do not cite one). The tier boundaries below are derived from the
//  underlying models instead:
//   • truncated VSOP87 series: Bretagnon & Francou (1988), A&A 202, 309 —
//     stated validity ±4000 yr from J2000 for Mercury–Mars, ±2000 yr for
//     Jupiter/Saturn, ±6000 yr for Uranus/Neptune; the maintainer: outside
//     ±4000 yr the series are "not supported or reliable" (issue #311).
//   • ΔT: the engine implements the Espenak–Meeus piecewise polynomials,
//     documented fit interval −1999…+3000 (eclipse.gsfc.nasa.gov/SEhelp/
//     deltatpoly2004.html). ΔT UNCERTAINTY per Morrison & Stephenson (2004),
//     J. Hist. Astron. 35, 327–336: σ ≈ 0.8·t² s with t = (year−1820)/100
//     (stated valid ~1000 BCE–1200 CE): ±8.5 min of time at −700. The Moon
//     moves 0.549″ per second of time, so ΔT alone blurs the ancient Moon by
//     arcminutes; with series truncation and lunar secular-model spread the
//     honest ancient-Moon bound is ~±¼° (an estimate, labelled as such).
//
//  Pure module: no DOM, no network, no randomness.
// ============================================================================

const fl = Math.floor;

// --- calendar date → Julian Day Number (valid for all y; m 1–12, d 1–31) ---

export function julianToJDN(y, m, d) {
  const a = fl((14 - m) / 12), y2 = y + 4800 - a, m2 = m + 12 * a - 3;
  return d + fl((153 * m2 + 2) / 5) + 365 * y2 + fl(y2 / 4) - 32083;
}

export function gregorianToJDN(y, m, d) {
  const a = fl((14 - m) / 12), y2 = y + 4800 - a, m2 = m + 12 * a - 3;
  return d + fl((153 * m2 + 2) / 5) + 365 * y2 + fl(y2 / 4) - fl(y2 / 100) + fl(y2 / 400) - 32045;
}

// --- Julian Day Number → calendar date (Richards inverse) ---

export function jdnToGregorian(jdn) {
  const a = jdn + 32044;
  const b = fl((4 * a + 3) / 146097);
  const c = a - fl(146097 * b / 4);
  const d = fl((4 * c + 3) / 1461);
  const e = c - fl(1461 * d / 4);
  const m = fl((5 * e + 2) / 153);
  return {
    y: 100 * b + d - 4800 + fl(m / 10),
    m: m + 3 - 12 * fl(m / 10),
    d: e - fl((153 * m + 2) / 5) + 1
  };
}

export function jdnToJulian(jdn) {
  const c = jdn + 32082;
  const d = fl((4 * c + 3) / 1461);
  const e = c - fl(1461 * d / 4);
  const m = fl((5 * e + 2) / 153);
  return {
    y: d - 4800 + fl(m / 10),
    m: m + 3 - 12 * fl(m / 10),
    d: e - fl((153 * m + 2) / 5) + 1
  };
}

// --- calendar ↔ calendar ---

export function julianToGregorian(y, m, d) { return jdnToGregorian(julianToJDN(y, m, d)); }
export function gregorianToJulian(y, m, d) { return jdnToJulian(gregorianToJDN(y, m, d)); }

// Days the proleptic Gregorian date runs AHEAD of the Julian date at a given
// Julian-calendar date (+10 in 1582; 0 through 200–299 CE; negative earlier).
export function julianGregorianOffset(y, m, d) {
  const g = julianToGregorian(y, m, d);
  return gregorianToJDN(g.y, g.m, g.d) - gregorianToJDN(y, m, d);
}

// --- JS Date construction that survives the 0–99 CE trap -------------------
//  Date.UTC(y,…) and new Date(y,…) remap years 0–99 to 1900+y (ECMAScript
//  MakeDay), so charts for the Roman era MUST go through setUTCFullYear.
//  y/m/d are PROLEPTIC GREGORIAN (astronomical year numbering); hours UT.

export function utcDate(y, m, d, hours = 12) {
  const date = new Date(0);
  date.setUTCFullYear(y, m - 1, d);
  const h = fl(hours), min = Math.round((hours - h) * 60);
  date.setUTCHours(h, min, 0, 0);
  return date;
}

// "1527-07-23" style ISO date string (proleptic Gregorian) for share-links.
export function isoDate(y, m, d) {
  const yy = y < 0 ? '-' + String(-y).padStart(6, '0') : String(y).padStart(4, '0');
  return `${yy}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// --- ΔT and its published uncertainty --------------------------------------

// ΔT in seconds for a calendar year, via the same Espenak–Meeus polynomials
// the bundled engine uses internally (documented fit −1999…+3000).
import { DeltaT_EspenakMeeus } from '../lib/astronomy.js';
export function deltaTSeconds(year) {
  // DeltaT_EspenakMeeus takes UT days since J2000; it converts back to a year
  // as y = 2000 + (ut − 14)/365.2421… — invert that mapping exactly.
  return DeltaT_EspenakMeeus((year - 2000) * 365.2421875 + 14);
}

// 1-σ ΔT uncertainty in seconds. Morrison & Stephenson (2004) parabola for
// the pre-telescopic era (floored at the 1500s table value so σ never dips
// BELOW a later, better-observed era on the way back); conservative
// published-table figures for the telescopic/modern eras; and for years
// beyond the observation-constrained present the same quadratic growth law
// is applied forward from ~2035 as an EXTRAPOLATION HEURISTIC (there is no
// future data — ΔT forecasts decades out are genuinely uncertain).
export function deltaTSigmaSeconds(year) {
  if (year < 1500) { const t = (year - 1820) / 100; return Math.max(0.8 * t * t, 20); }
  if (year < 1600) return 20;
  if (year < 1700) return 10;
  if (year < 1800) return 5;
  if (year < 1900) return 2;
  if (year <= 2035) return 1;
  const u = (year - 2035) / 100;
  return 1 + 0.8 * u * u;
}

// --- era-accuracy tiers -----------------------------------------------------
//  Display policy, not a computation change: precision claims are gated by
//  the era. Grades: 'casting' | 'study' | 'illustrative' | 'refuse'.

export function eraAccuracy(year) {
  const dT = year >= -1999 && year <= 3000 ? deltaTSeconds(year) : null;
  const sigma = deltaTSigmaSeconds(year);
  const base = {
    year, deltaTSeconds: dT, deltaTSigmaSeconds: sigma,
    citation: 'Bretagnon & Francou 1988 (VSOP87 validity); Morrison & Stephenson 2004 (ΔT σ); '
      + 'Espenak–Meeus ΔT polynomials (fit −1999…+3000); astronomy-engine README (±1′ design accuracy, no year range stated).'
  };
  if (year < -1999 || year > 3000) {
    return {
      ...base, grade: 'refuse', label: 'out of range',
      showArcminutes: false, moonWholeDegrees: true,
      note: 'Outside the Espenak–Meeus ΔT fit (−1999…+3000) and beyond defensible use of the truncated planetary series — '
        + 'no numeric positions are shown for this era.'
    };
  }
  if (year >= 1600 && year <= 2200) {
    return {
      ...base, grade: 'casting', label: 'casting-grade',
      showArcminutes: true, moonWholeDegrees: false,
      note: 'Engine design accuracy ±1 arcminute vs NOVAS; ΔT observation-constrained to seconds of time.'
    };
  }
  if (year >= 500) { // 500–1600 and 2200–3000
    return {
      ...base, grade: 'study', label: 'study-grade',
      showArcminutes: true, moonWholeDegrees: false,
      note: 'Positions good to a few arcminutes; ΔT uncertain by seconds to minutes of time at this epoch '
        + '(Morrison & Stephenson 2004 for the past; extrapolated growth for the far future). '
        + 'Sign and degree are reliable; treat arcminutes as approximate.'
    };
  }
  return {
    ...base, grade: 'illustrative', label: 'illustrative only',
    showArcminutes: false, moonWholeDegrees: true,
    note: 'ΔT is uncertain by ±2–9 minutes of time at this epoch (Morrison & Stephenson 2004) and the planetary series '
      + 'run near or beyond their stated validity. Whole degrees only; the Moon is honest to roughly ±¼° — '
      + 'sign placement is safe, arcminutes are meaningless. (The ±¼° lunar bound is a derived estimate, not a documented engine figure.)'
  };
}

export const CALENDAR_CITATION =
  'Fliegel & Van Flandern 1968 (calendar→JDN); E. G. Richards, Explanatory Supplement 3rd ed. (2013) ch. 15 / '
  + 'Meeus, Astronomical Algorithms ch. 7 (JDN→calendar); Gregorian reform: Inter gravissimas 1582 '
  + '(4 Oct Julian → 15 Oct Gregorian); England: Calendar (New Style) Act 1750 (2 Sep 1752 → 14 Sep 1752, '
  + 'civil year formerly beginning 25 March). Astronomical year numbering throughout (1 BCE = year 0).';
