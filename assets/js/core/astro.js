// ============================================================================
//  astro.js — Astronomical calculation engine for William Lilly's astrology
//  Computes geocentric apparent ecliptic-of-date (tropical) positions, the
//  Ascendant/Midheaven, and house cusps (Regiomontanus — Lilly's system — plus
//  Placidus, Whole-Sign and Equal), the mean lunar node, and planetary hours.
//
//  Positions come from astronomy-engine (Don Cross, MIT licence), a truncated
//  VSOP87 model with an upstream design target of ~1 arc-minute. Even a small
//  uncertainty can change a sign/dignity/house assignment near a boundary.
//  House and angle formulae are implemented here; validation evidence and
//  limits are recorded in docs/2026-10-calculation-methods.md.
// ============================================================================
import * as Astronomy from '../lib/astronomy.js';
import { validLocation } from './time.js';

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
  if (!Number.isFinite(lon)) throw new RangeError('Longitude must be finite.');
  const unit = withSeconds ? 3600 : 60;
  const total = Math.round(norm360(lon) * unit) % (360 * unit);
  const sign = Math.floor(total / (30 * unit));
  const within = total % (30 * unit), deg = Math.floor(within / unit);
  const min = withSeconds ? Math.floor((within % 3600) / 60) : within % 60;
  const tail = withSeconds ? `${String(within % 60).padStart(2, '0')}"` : '';
  return `${deg}°${String(min).padStart(2, '0')}'${tail} ${SIGNS[sign]}`;
}

// ---------------------------------------------------------------------------
//  Core astronomy
// ---------------------------------------------------------------------------

// Geocentric apparent ecliptic longitude in the TRUE equinox of date (the
// tropical zodiac astrologers use). Returns {lon, lat, speed} in degrees;
// speed is degrees/day (negative ⇒ retrograde).
export function bodyPosition(name, date) {
  const body = BODY[name];
  if (!body || !(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('Choose a supported planet and valid UTC instant.');
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
    // RA is equatorial: tan(delta) = tan(epsilon) * sin(RA).
    // asin(sin(epsilon)*sin(RA)) would incorrectly treat RA as longitude.
    const decl = Math.atan(Math.tan(er) * Math.sin(ra * D2R));
    let arg = -Math.tan(pr) * Math.tan(decl);
    arg = Math.max(-1, Math.min(1, arg));
    const sa = Math.acos(arg) * R2D; // semi-diurnal arc, degrees
    const next = cfg.night
      ? norm360(ramc + 180 - cfg.f * (180 - sa))
      : norm360(ramc + cfg.f * sa);
    if (Math.abs(((next - ra + 540) % 360) - 180) < 1e-9) { ra = next; break; }
    ra = next;
  }
  return norm360(Math.atan2(Math.sin(ra * D2R), Math.cos(ra * D2R) * Math.cos(er)) * R2D);
}

// Compute all twelve house cusps and the four angles.
// system: 'regiomontanus' (Lilly), 'placidus', 'whole', 'equal'.
export function houses(date, latitude, longitude, system = 'regiomontanus') {
  validLocation(latitude, longitude);
  if (Math.abs(latitude) === 90) throw new RangeError('An ascendant and ordinary houses are undefined at the geographic poles. Choose a location below 90° latitude.');
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('Enter a valid UTC instant.');
  if (!['regiomontanus', 'placidus', 'whole', 'equal'].includes(system)) throw new RangeError('Choose a supported house system.');
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
    if (Math.abs(latitude) > 66) return {
      ...houses(date, latitude, longitude, 'regiomontanus'), requestedSystem: 'placidus',
      houseWarning: 'Placidus is unavailable above 66° in this implementation. The displayed cusps use Regiomontanus; select Whole Sign or Equal explicitly to compare.',
    };
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
  return { asc, mc, desc: norm360(asc + 180), ic: norm360(mc + 180), cusps, ramc, obliquity: eps, system, requestedSystem: system, houseWarning: Math.abs(latitude) > 66 ? 'Polar house geometry is sensitive; compare the selected convention and do not infer ordinary rising/setting behavior.' : null };
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
//  Part of Fortune. CONTESTED FORK: Lilly prints Asc + Moon − Sun for BOTH day
//  and night, so that is the DEFAULT here. The older Ptolemaic rule reverses it
//  by night to Asc + Sun − Moon — pass opts {sectAware:true, isDay} to use it.
//  (The Part of Fortune is a hyleg candidate, so the choice can ripple into the
//  length-of-life reading; see pages/about.)
// ---------------------------------------------------------------------------
export function partOfFortune(asc, sunLon, moonLon, opts = {}) {
  const reverse = opts.sectAware && opts.isDay === false; // night + sect-aware
  return norm360(reverse ? asc + sunLon - moonLon : asc + moonLon - sunLon);
}

// A generalized Arabic Part / Lot: Lot = Asc + (B − C), reduced to [0,360).
// The Part of Fortune is lot(asc, moonLon, sunLon) by day. Exposed for the
// experimental Lots view; the seven Hermetic lots can be built from this.
export function lot(asc, B, C) { return norm360(asc + B - C); }

// ---------------------------------------------------------------------------
//  Antiscia — a point's "shadow" reflected across the 0° Cancer–0° Capricorn
//  (solstitial) axis: the point of EQUAL DECLINATION. For an ecliptic point
//  sin δ = sin ε · sin λ, so λ and 180° − λ share a declination — that is the
//  antiscion (e.g. Taurus↔Leo, Aries↔Virgo), which acts like a hidden
//  conjunction. The CONTRA-antiscion, 360° − λ (reflection across the equinox),
//  has the opposite declination and acts like a hidden opposition.
//  (Corrected 2026-06-30: the two were previously swapped — 360−λ does not
//  reflect across the solstitial axis.)
// ---------------------------------------------------------------------------
export function antiscion(lon) { return norm360(180 - lon); }
export function contraAntiscion(lon) { return norm360(360 - lon); }

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
  // Sect follows the physical horizon, independently of a chosen house system.
  // In whole-sign/equal houses a house boundary need not be the horizon.
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const sun = Astronomy.Equator(Astronomy.Body.Sun, date, observer, true, true);
  const sunAltitude = Astronomy.Horizon(date, observer, sun.ra, sun.dec).altitude;
  const isDay = sunAltitude >= 0; // geometric center, no refraction
  return { date, latitude, longitude, ...h, planets, isDay, sunAltitude, sectMethod: 'geometric solar center above the horizon; no refraction' };
}

// A date-only birth record supports planetary positions across a civil day,
// not angles or houses. Sampling bounds are explicitly estimates; no precise
// chart, sect, dignity score, ascendant or house property is returned.
export function untimedPositions(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date) || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start || end - start > 2 * 86400000) throw new RangeError('Choose a valid civil-day interval.');
  const representative = new Date((start.getTime() + end.getTime()) / 2), planets = {};
  for (const name of Object.keys(BODY)) {
    const samples = Array.from({ length: 25 }, (_, i) => bodyPosition(name, new Date(start.getTime() + (end - start) * i / 24)));
    const mid = bodyPosition(name, representative);
    const deltas = samples.map(p => ((p.lon - mid.lon + 540) % 360) - 180);
    planets[name] = { longitude: mid.lon, minDelta: Math.min(...deltas), maxDelta: Math.max(...deltas), retrogradeAtMidpoint: mid.retrograde };
  }
  return { timeKnown: false, start, end, representative, planets, method: 'Geocentric tropical positions at the civil-day midpoint; 25 sampled positions estimate the day range. Birth time unknown: angles, houses and time-dependent interpretations unavailable.' };
}
