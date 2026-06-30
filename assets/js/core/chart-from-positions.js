// ============================================================================
//  chart-from-positions.js — build a castChart-shaped object from a set of
//  PRINTED positions (sign + degree), rather than from a date & place.
//
//  This is what makes Lilly's own worked charts "live": his books print the
//  figure (each planet's sign, degree and house, with retrograde marks), so we
//  feed those exact printed values straight into the same engine — dignities,
//  aspects, reception and the modes of perfection — without re-deriving the
//  chart from a date (which would import his ephemeris/calendar error).
//
//  HONEST CAVEATS, surfaced in the returned object and in the UI:
//   • Lilly used REGIOMONTANUS houses and printed all twelve cusps; unless the
//     full printed cusps are supplied, the drawn wheel uses EQUAL houses from
//     the printed Ascendant (`cuspApprox:true`). Each planet's HOUSE is taken
//     from Lilly's own printed assignment when given, so the table stays
//     faithful even when the drawn cusp ring is an approximation.
//   • Applying/separating depends on the bodies' true speeds, which the figures
//     rarely print. We use canonical MEAN daily motions (signed by Lilly's
//     retrograde marks). The headline aspects Lilly cites are robust to this,
//     but a borderline applying/separating call may differ — flagged.
//
//  PURE — no DOM, headless-testable. Mirrors astro.js conventions.
// ============================================================================
import { SIGNS, norm360, signOf, houseOf, partOfFortune, antiscion, contraAntiscion } from './astro.js';

// Canonical mean daily motion (degrees/day), magnitude only; the sign is set by
// the retrograde flag. Sun & Moon never retrograde.
const MEAN_SPEED = {
  Sun: 0.9856, Moon: 13.1764, Mercury: 1.3833, Venus: 1.2000,
  Mars: 0.5240, Jupiter: 0.0831, Saturn: 0.0334,
};

const SIGN_INDEX = {};
SIGNS.forEach((s, i) => { SIGN_INDEX[s.toLowerCase()] = i; });

// Convert a printed position {sign, degree, minute?} → absolute ecliptic longitude.
export function lonFromSignDeg(sign, degree, minute = 0) {
  const idx = SIGN_INDEX[String(sign).toLowerCase()];
  if (idx == null) throw new Error(`unknown sign "${sign}"`);
  return norm360(idx * 30 + (Number(degree) || 0) + (Number(minute) || 0) / 60);
}

// Parse a compact "11 Gemini 33" / "11°33' Gemini" style string → longitude.
export function lonFromLabel(label) {
  if (label == null) return null;
  const s = String(label);
  const sign = SIGNS.find(n => new RegExp(n, 'i').test(s));
  if (!sign) return null;
  const nums = (s.match(/\d+(?:\.\d+)?/g) || []).map(Number);
  return lonFromSignDeg(sign, nums[0] || 0, nums[1] || 0);
}

// ---------------------------------------------------------------------------
//  chartFromPositions(spec)
//
//  spec = {
//    asc, mc,                       // numbers (lon) OR "sign deg min" labels
//    isDay,                         // optional; else derived from Sun's house
//    system,                        // label only (default 'regiomontanus (printed)')
//    cusps,                         // optional full [1..12] printed cusps (lon or labels)
//    planets: [
//      { name, lon|sign+degree(+minute), retrograde?, house?, speed? }, …
//    ],
//    nodeLon, fortuneLon,           // optional points (lon or label)
//  }
//
//  Returns a castChart-shaped object plus { reconstructed:true, cuspApprox }.
// ---------------------------------------------------------------------------
export function chartFromPositions(spec) {
  const toLon = v => (typeof v === 'number' ? norm360(v) : lonFromLabel(v));
  const asc = toLon(spec.asc);
  const mc = spec.mc != null ? toLon(spec.mc) : norm360(asc - 90);

  // House cusps: full printed set if supplied, else EQUAL houses from the Asc.
  let cusps = new Array(13).fill(0);
  let cuspApprox = true;
  if (Array.isArray(spec.cusps) && spec.cusps.length >= 12) {
    for (let i = 1; i <= 12; i++) cusps[i] = toLon(spec.cusps[i - 1] ?? spec.cusps[i]);
    cuspApprox = false;
  } else {
    for (let i = 1; i <= 12; i++) cusps[i] = norm360(asc + (i - 1) * 30);
  }

  const planets = {};
  for (const p of (spec.planets || [])) {
    const lon = p.lon != null ? norm360(p.lon) : lonFromSignDeg(p.sign, p.degree, p.minute);
    const retro = !!p.retrograde;
    const speed = p.speed != null ? p.speed
      : (MEAN_SPEED[p.name] || 1) * (retro ? -1 : 1);
    planets[p.name] = {
      lon, lat: 0, speed, retrograde: retro,
      house: p.house != null ? p.house : houseOf(lon, cusps),
      printedHouse: p.house != null,
      antiscion: { lon: antiscion(lon), label: null },
      contraAntiscion: { lon: contraAntiscion(lon), label: null },
    };
  }

  // Optional points
  if (spec.nodeLon != null) {
    const nn = toLon(spec.nodeLon);
    planets.NorthNode = { lon: nn, lat: 0, speed: -0.0529, retrograde: true, house: houseOf(nn, cusps) };
    planets.SouthNode = { lon: norm360(nn + 180), lat: 0, speed: -0.0529, retrograde: true, house: houseOf(nn + 180, cusps) };
  }
  if (planets.Sun && planets.Moon) {
    const pof = spec.fortuneLon != null ? toLon(spec.fortuneLon)
      : partOfFortune(asc, planets.Sun.lon, planets.Moon.lon);
    planets.Fortune = { lon: pof, lat: 0, speed: 0, retrograde: false, house: houseOf(pof, cusps) };
  }

  const isDay = spec.isDay != null ? !!spec.isDay
    : (planets.Sun ? planets.Sun.house >= 7 : true);

  return {
    date: spec.date || null, latitude: spec.latitude ?? null, longitude: spec.longitude ?? null,
    asc, mc, desc: norm360(asc + 180), ic: norm360(mc + 180),
    cusps, ramc: null, obliquity: 23.44,
    system: spec.system || 'regiomontanus (printed)',
    planets, isDay,
    reconstructed: true, cuspApprox,
  };
}
