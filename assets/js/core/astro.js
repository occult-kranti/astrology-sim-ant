// ============================================================================
//  astro.js — Astronomical calculation engine for William Lilly's astrology
//  Computes geocentric apparent ecliptic-of-date (tropical) positions, the
//  Ascendant/Midheaven, and house cusps (Regiomontanus — Lilly's system — plus
//  Placidus, Whole-Sign and Equal), the mean lunar node, and planetary hours.
//
//  Positions come from astronomy-engine (Don Cross, MIT licence), a truncated
//  VSOP87 model accurate to ~1 arc-minute — far below the resolution at which
//  any sign, dignity or house placement changes. House and angle formulae are
//  implemented here and validated against published reference vectors
//  (see /data/ENGINE_VALIDATION.md).
// ============================================================================
import * as Astronomy from '../lib/astronomy.js';

export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;
export const norm360 = x => ((x % 360) + 360) % 360;

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
export const SIGN_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// The seven traditional planets, in Chaldean order (slowest → fastest).
export const CHALDEAN = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

export const PLANET_GLYPHS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄',
  NorthNode: '☊', SouthNode: '☋', Fortune: '⊕'
};

const BODY = {
  Sun: Astronomy.Body.Sun, Moon: Astronomy.Body.Moon, Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus, Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter, Saturn: Astronomy.Body.Saturn
};

// ---------------------------------------------------------------------------
//  Formatting helpers
// ---------------------------------------------------------------------------

// Split an absolute ecliptic longitude into sign index + degrees within sign.
export function signOf(lon) {
  lon = norm360(lon);
  const idx = Math.floor(lon / 30);
  return { index: idx, name: SIGNS[idx], glyph: SIGN_GLYPHS[idx], degInSign: lon - idx * 30 };
}

// "12°34' Leo" style label.
export function formatLon(lon, withSeconds = false) {
  const s = signOf(lon);
  let d = s.degInSign;
  const deg = Math.floor(d);
  const mfloat = (d - deg) * 60;
  const min = Math.floor(mfloat);
  if (withSeconds) {
    const sec = Math.round((mfloat - min) * 60);
    return `${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}" ${s.name}`;
  }
  const minR = Math.round(mfloat);
  // guard against rounding 60'
  if (minR === 60) return `${deg + 1}°00' ${s.name}`;
  return `${deg}°${String(minR).padStart(2, '0')}' ${s.name}`;
}

// ---------------------------------------------------------------------------
//  Core astronomy
// ---------------------------------------------------------------------------

// Geocentric apparent ecliptic longitude in the TRUE equinox of date (the
// tropical zodiac astrologers use). Returns {lon, lat, speed} in degrees;
// speed is degrees/day (negative ⇒ retrograde).
export function bodyPosition(name, date) {
  const body = BODY[name];
  const lon = eclLonOfDate(body, date);
  // numerical speed: central difference over ±6 hours
  const dt = 0.25; // days
  const lonPlus = eclLonOfDate(body, new Date(date.getTime() + dt * 86400000));
  const lonMinus = eclLonOfDate(body, new Date(date.getTime() - dt * 86400000));
  let d = (((lonPlus - lonMinus + 540) % 360) - 180) / (2 * dt);
  const vec = Astronomy.GeoVector(body, date, true);
  const rot = Astronomy.Rotation_EQJ_ECT(date);
  const ecl = Astronomy.RotateVector(rot, vec);
  const sph = Astronomy.SphereFromVector(ecl);
  return { lon: norm360(lon), lat: sph.lat, speed: d, retrograde: d < 0 };
}

function eclLonOfDate(body, date) {
  const vec = Astronomy.GeoVector(body, date, true);          // EQJ, aberration-corrected
  const rot = Astronomy.Rotation_EQJ_ECT(date);              // EQJ → true ecliptic of date
  const ecl = Astronomy.RotateVector(rot, vec);
  return norm360(Astronomy.SphereFromVector(ecl).lon);
}

// True obliquity of the ecliptic (degrees) — includes nutation.
export function obliquity(date) {
  return Astronomy.e_tilt(Astronomy.MakeTime(date)).tobl;
}

// Greenwich Apparent Sidereal Time in degrees.
export function gast(date) {
  return norm360(Astronomy.SiderealTime(date) * 15);
}

// Mean lunar node (Dragon's Head) longitude, degrees. Meeus, Astronomical
// Algorithms ch. 47. Traditional astrology uses the mean node.
export function meanNode(date) {
  const T = Astronomy.MakeTime(date).tt / 36525; // Julian centuries (TT) from J2000
  return norm360(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T
    + (T * T * T) / 467441 - (T * T * T * T) / 60616000);
}

// ---------------------------------------------------------------------------
//  Angles & houses
// ---------------------------------------------------------------------------

// Unified Regiomontanus cusp longitude for an equatorial house-angle H
// (degrees) measured from the RAMC. H=0 → MC (10th), H=90 → Ascendant (1st).
// Reduces exactly to the standard MC and Ascendant formulae, so quadrants are
// handled automatically by atan2 with no manual 180° corrections.
function regioCusp(ramc, eps, phi, H) {
  const a = (ramc + H) * D2R, er = eps * D2R, pr = phi * D2R;
  return norm360(Math.atan2(
    Math.sin(a),
    Math.cos(a) * Math.cos(er) - Math.sin(er) * Math.tan(pr) * Math.sin(H * D2R)
  ) * R2D);
}

// Placidus intermediate cusp via time-proportional semi-arc trisection.
function placidusCusp(ramc, eps, phi, house) {
  const er = eps * D2R, pr = phi * D2R;
  // fraction of semi-arc and which semi-arc, per house
  const cfg = {
    11: { f: 1 / 3, ra0: ramc + 30, night: false },
    12: { f: 2 / 3, ra0: ramc + 60, night: false },
    2:  { f: 2 / 3, ra0: ramc + 120, night: true },
    3:  { f: 1 / 3, ra0: ramc + 150, night: true }
  }[house];
  let ra = cfg.ra0;
  for (let i = 0; i < 100; i++) {
    const decl = Math.asin(Math.sin(er) * Math.sin(ra * D2R));
    let arg = -Math.tan(pr) * Math.tan(decl);
    arg = Math.max(-1, Math.min(1, arg));
    const sa = Math.acos(arg) * R2D; // semi-diurnal arc, degrees
    const next = cfg.night
      ? norm360(ramc + 180 - (house === 2 ? 2 / 3 : 1 / 3) * sa)
      : norm360(ramc + cfg.f * sa);
    if (Math.abs(((next - ra + 540) % 360) - 180) < 1e-9) { ra = next; break; }
    ra = next;
  }
  return norm360(Math.atan2(Math.sin(ra * D2R), Math.cos(ra * D2R) * Math.cos(er)) * R2D);
}

// Compute all twelve house cusps and the four angles.
// system: 'regiomontanus' (Lilly), 'placidus', 'whole', 'equal'.
export function houses(date, latitude, longitude, system = 'regiomontanus') {
  const eps = obliquity(date);
  const ramc = norm360(gast(date) + longitude); // local apparent sidereal time, degrees
  const mc = regioCusp(ramc, eps, latitude, 0);
  const asc = regioCusp(ramc, eps, latitude, 90);
  const cusps = new Array(13).fill(0); // 1-indexed

  if (system === 'whole') {
    const start = Math.floor(asc / 30) * 30;
    for (let i = 1; i <= 12; i++) cusps[i] = norm360(start + (i - 1) * 30);
  } else if (system === 'equal') {
    for (let i = 1; i <= 12; i++) cusps[i] = norm360(asc + (i - 1) * 30);
  } else if (system === 'placidus') {
    cusps[1] = asc; cusps[10] = mc; cusps[7] = norm360(asc + 180); cusps[4] = norm360(mc + 180);
    // Placidus undefined near the poles — fall back to Regiomontanus there.
    if (Math.abs(latitude) > 66) return houses(date, latitude, longitude, 'regiomontanus');
    cusps[11] = placidusCusp(ramc, eps, latitude, 11);
    cusps[12] = placidusCusp(ramc, eps, latitude, 12);
    cusps[2]  = placidusCusp(ramc, eps, latitude, 2);
    cusps[3]  = placidusCusp(ramc, eps, latitude, 3);
    cusps[5] = norm360(cusps[11] + 180); cusps[6] = norm360(cusps[12] + 180);
    cusps[8] = norm360(cusps[2] + 180);  cusps[9] = norm360(cusps[3] + 180);
  } else { // regiomontanus
    for (let i = 1; i <= 12; i++) {
      const H = ((i - 10) * 30 + 360) % 360; // house 10→H0, 11→30, …, 1→90, …
      cusps[i] = regioCusp(ramc, eps, latitude, H);
    }
  }
  return { asc, mc, desc: norm360(asc + 180), ic: norm360(mc + 180), cusps, ramc, obliquity: eps, system };
}

// Which house (1–12) does an ecliptic longitude fall in, given the cusps?
export function houseOf(lon, cusps) {
  lon = norm360(lon);
  for (let i = 1; i <= 12; i++) {
    const a = cusps[i], b = cusps[i === 12 ? 1 : i + 1];
    const span = norm360(b - a);
    const off = norm360(lon - a);
    if (off < span || span === 0) return i;
  }
  return 1;
}

// ---------------------------------------------------------------------------
//  Part of Fortune (Lilly's practice: Asc + Moon − Sun for BOTH day and night)
// ---------------------------------------------------------------------------
export function partOfFortune(asc, sunLon, moonLon) {
  return norm360(asc + moonLon - sunLon);
}

// ---------------------------------------------------------------------------
//  Full chart
// ---------------------------------------------------------------------------
export function castChart(date, latitude, longitude, system = 'regiomontanus') {
  const h = houses(date, latitude, longitude, system);
  const planets = {};
  for (const name of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    const p = bodyPosition(name, date);
    planets[name] = { ...p, house: houseOf(p.lon, h.cusps) };
  }
  const nn = meanNode(date);
  planets.NorthNode = { lon: nn, lat: 0, speed: -0.0529, retrograde: true, house: houseOf(nn, h.cusps) };
  planets.SouthNode = { lon: norm360(nn + 180), lat: 0, speed: -0.0529, retrograde: true, house: houseOf(nn + 180, h.cusps) };
  const pof = partOfFortune(h.asc, planets.Sun.lon, planets.Moon.lon);
  planets.Fortune = { lon: pof, lat: 0, speed: 0, retrograde: false, house: houseOf(pof, h.cusps) };
  // Day chart when the Sun is above the horizon (houses 7–12).
  const isDay = planets.Sun.house >= 7;
  return { date, latitude, longitude, ...h, planets, isDay };
}
