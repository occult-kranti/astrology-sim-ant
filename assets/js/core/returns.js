// ============================================================================
//  returns.js — RETURNS BEYOND THE SOLAR: the LUNAR (monthly) return and the
//  generic PLANETARY return, generalizing solar-return.js's guarded bisection
//  to any body and any target longitude. Catherine Urban sells "monthly return
//  charts"; the Saturn return and other planetary returns fall out of the same
//  finder.
//
//  A return is the instant a transiting body regains a stored natal longitude —
//  the solar revolution is the classical archetype (Dorotheus, Carmen IV;
//  Abū Maʿshar, Revolutions). Two things are flagged in-data, never resolved:
//   • CONTESTED — the medieval "monthly revolution" was NOT simply the modern
//     lunar return: it was computed several ways (the Sun reaching the same
//     degree it held at the year's revolution each month; or the Moon returning
//     to its natal place). The modern Moon-to-natal-Moon reading is one option.
//     (Abū Maʿshar's monthly-revolution method: Dykes, Persian Nativities IV,
//     2019 — the portion missing from the older Latin PN III.)
//   • MODERN FRAMING — the "Saturn return" as a named rite of passage is a
//     modern emphasis on the classical doctrine of a planet transiting its own
//     natal place (the ages doctrine: Ptolemy, Tetrabiblos IV.10, Robbins 1940).
//
//  HONEST FRAMING: no demonstrated validity — described, never prescribed.
//  PURE MODULE — no DOM. Positions come from astro.js (bodyPosition), the same
//  engine as the natal radix, so a solved return matches the natal degree to
//  sub-arc-second precision.
// ============================================================================

import { bodyPosition, castChart, norm360, signOf, formatLon } from './astro.js';

const DAY_MS = 86400000;

// Signed difference a − b in (−180, 180]. The zero-crossing of
// d(t)=angleDiff(bodyLon(t), natalLon) is a return.
function angleDiff(a, b) { return ((a - b + 540) % 360) - 180; }

// A body-appropriate coarse scan step (days). The Moon returns once per sidereal
// month (~27.3 d, never retrograde → one crossing); the slow planets can
// retrograde-triple across their own place, so a small step resolves all three.
export const RETURN_PERIOD_DAYS = { Moon: 27.321661, Sun: 365.2422, Mercury: 87.969, Venus: 224.701, Mars: 686.980, Jupiter: 4332.59, Saturn: 10759.22 };
function stepDaysFor(body) {
  if (body === 'Moon') return 1;
  if (body === 'Sun' || body === 'Mercury' || body === 'Venus') return 3;
  return 10; // Mars, Jupiter, Saturn — fine enough to split a retrograde triple
}

const CONTESTED_MONTHLY =
  'CONTESTED (flagged, not resolved): the medieval "monthly revolution" was computed several ways — the Sun regaining '
  + 'the degree it held at the year’s solar revolution each month, OR the Moon returning to its natal place. The modern '
  + 'lunar return (Moon→natal-Moon) is one reading only. Abū Maʿshar’s monthly method: Dykes, Persian Nativities IV (2019).';
const SATURN_FRAMING =
  'MODERN FRAMING (flagged): the "Saturn return" as a named life-stage is a modern emphasis on the classical doctrine of '
  + 'a planet transiting its own natal place (ages doctrine: Ptolemy, Tetrabiblos IV.10, Robbins 1940).';

export const RETURNS_CITATION =
  'Solar revolution: Dorotheus, Carmen IV; Abū Maʿshar, On the Revolutions (Dykes, Persian Nativities IV, 2019). '
  + CONTESTED_MONTHLY + ' ' + SATURN_FRAMING;

// ---------------------------------------------------------------------------
//  returnInstant(body, natalLon, aroundDate, opts?) — the exact instant of the
//  return NEAREST to aroundDate. Brackets the crossing by stepping outward in
//  both directions from aroundDate, then bisects to high precision.
// ---------------------------------------------------------------------------
export function returnInstant(body, natalLon, aroundDate, opts = {}) {
  const target = norm360(natalLon);
  const d = t => angleDiff(bodyPosition(body, t).lon, target);
  const stepMs = (opts.stepDays || stepDaysFor(body)) * DAY_MS;
  const maxSpan = (opts.maxSpanDays || (RETURN_PERIOD_DAYS[body] || 400) * 1.5) * DAY_MS;

  const centre = aroundDate.getTime();
  // Walk outward alternately to find the first sign-changing bracket.
  let bestLo = null, bestHi = null, bestDist = Infinity;
  for (let off = 0; off <= maxSpan; off += stepMs) {
    for (const side of (off === 0 ? [0] : [-1, 1])) {
      const aMs = centre + side * off;
      const bMs = aMs + stepMs;
      const da = d(new Date(aMs)), db = d(new Date(bMs));
      if ((da === 0 || da * db < 0) && Math.abs(db - da) < 90) {
        const dist = Math.abs((aMs + bMs) / 2 - centre);
        if (dist < bestDist) { bestDist = dist; bestLo = aMs; bestHi = bMs; }
      }
    }
    if (bestLo !== null && off > bestDist + stepMs) break; // nearest found
  }
  if (bestLo === null) throw new Error(`returnInstant: no ${body} return to ${target.toFixed(3)}° found near ${aroundDate.toISOString()}`);
  return new Date(bisect(body, target, bestLo, bestHi));
}

// ---------------------------------------------------------------------------
//  returnsBetween(body, natalLon, start, end, opts?) — ALL returns in a window
//  (handles retrograde triple-passes for the slow planets). Scans the signed
//  difference at the body's step, bisects each sign change.
//
//  A crossing coincident with the window START (within a minute) is treated as
//  the anchor, NOT a return — so a NATAL-ANCHORED year (start = the natal
//  instant, when the body already sits on natalLon) yields the recurrences only:
//  exactly 13 lunar returns, never 14. Pass opts.includeStart to keep it.
//
//  Returns [{ instant(Date), instantISO, lon, label, sign, retrograde }].
// ---------------------------------------------------------------------------
export function returnsBetween(body, natalLon, start, end, opts = {}) {
  if (!(start instanceof Date) || isNaN(start) || !(end instanceof Date) || isNaN(end)) {
    throw new Error('returnsBetween: start and end must be valid Dates');
  }
  if (end.getTime() <= start.getTime()) throw new Error('returnsBetween: end must be after start');
  const target = norm360(natalLon);
  const stepMs = (opts.stepDays || stepDaysFor(body)) * DAY_MS;
  const d = t => angleDiff(bodyPosition(body, new Date(t)).lon, target);

  const out = [];
  const t0 = start.getTime(), t1 = end.getTime();
  let prevT = t0, prevD = d(t0);
  for (let t = t0 + stepMs; prevT < t1; t += stepMs) {
    if (t > t1) t = t1;
    const cur = d(t);
    if ((prevD === 0 || prevD * cur < 0) && Math.abs(cur - prevD) < 90) {
      const ms = bisect(body, target, prevT, t);
      if (opts.includeStart || ms - t0 > 60000) {  // skip the anchor itself
        const when = new Date(ms);
        const pos = bodyPosition(body, when);
        out.push({ instant: when, instantISO: when.toISOString(), lon: pos.lon, label: formatLon(pos.lon), sign: signOf(pos.lon), retrograde: pos.retrograde });
      }
    }
    prevT = t; prevD = cur;
    if (t === t1) break;
  }
  out.sort((a, b) => a.instant - b.instant);
  return out;
}

// Bisect a bracketed return crossing to sub-arc-second precision (<1e-5°).
function bisect(body, target, aMs, bMs) {
  const d = ms => angleDiff(bodyPosition(body, new Date(ms)).lon, target);
  let a = aMs, b = bMs, da = d(a);
  for (let i = 0; i < 60 && b - a > 200; i++) {
    const m = (a + b) / 2, dm = d(m);
    if (dm === 0) { a = b = m; break; }
    if (Math.sign(dm) === Math.sign(da)) { a = m; da = dm; } else { b = m; }
    if (Math.abs(dm) < 1e-5) { a = b = m; break; }
  }
  return Math.round((a + b) / 2);
}

// ---------------------------------------------------------------------------
//  lunarReturnsBetween(natalChart, start, end, opts?) — the monthly-return
//  convenience: Moon→natal-Moon returns in a window (~13 per year), each with
//  its cast return chart if opts.castCharts is set.
// ---------------------------------------------------------------------------
export function lunarReturnsBetween(natalChart, start, end, opts = {}) {
  const natalMoon = natalChart.planets.Moon.lon;
  const list = returnsBetween('Moon', natalMoon, start, end, opts);
  const lat = opts.lat ?? natalChart.latitude;
  const lon = opts.lon ?? natalChart.longitude;
  const system = opts.system ?? 'regiomontanus';
  const returns = list.map(r => ({
    instant: r.instant, instantISO: r.instantISO, moonLon: r.lon, moonLabel: r.label,
    chart: opts.castCharts ? castChart(r.instant, lat, lon, system) : null,
  }));
  return {
    body: 'Moon', natalMoonLon: natalMoon, natalMoonLabel: formatLon(natalMoon),
    count: returns.length, returns,
    contested: CONTESTED_MONTHLY, citation: RETURNS_CITATION,
  };
}

// ---------------------------------------------------------------------------
//  returnChart(natalChart, body, instant, opts?) — cast the return figure.
// ---------------------------------------------------------------------------
export function returnChart(natalChart, body, instant, opts = {}) {
  const lat = opts.lat ?? natalChart.latitude;
  const lon = opts.lon ?? natalChart.longitude;
  const system = opts.system ?? 'regiomontanus';
  return castChart(instant, lat, lon, system);
}

// ---------------------------------------------------------------------------
//  planetReturns(natalChart, body, start, end, opts?) — a named planetary
//  return finder (Saturn return, Jupiter return, …), reporting every pass
//  (1 or, through a retrograde loop, 3) with the modern-framing flag.
// ---------------------------------------------------------------------------
export function planetReturns(natalChart, body, start, end, opts = {}) {
  const natalLon = natalChart.planets[body] ? natalChart.planets[body].lon : null;
  if (natalLon == null) throw new Error(`planetReturns: natal chart has no ${body}`);
  const passes = returnsBetween(body, natalLon, start, end, opts);
  return {
    body, natalLon, natalLabel: formatLon(natalLon),
    passCount: passes.length, passes,
    framing: body === 'Saturn' ? SATURN_FRAMING : undefined,
    citation: RETURNS_CITATION,
  };
}
