// ============================================================================
//  solar-return.js — The Solar Return (Revolution of the Year) for William
//  Lilly's astrology. Computes the exact UTC moment each year when the
//  transiting Sun returns to its natal ecliptic longitude, and casts the
//  chart ("revolution") for that instant.
//
//  Lilly, Christian Astrology Bk III treats "Revolutions" — the annual
//  solar revolution being the figure erected for the moment the Sun, by
//  transit, regains the precise place it held at nativity. That return
//  chart is then judged for the year's accidents, the natal radix remaining
//  the perpetual significator. The classical method takes the SAME natal
//  longitude (the tropical place of the Sun at birth) rather than a fixed
//  calendar birthday; the instant drifts ~6h later each year (and a day at
//  leap years), which this module locates astronomically.
//
//  Pure / headless: no DOM. Positions come from astro.js (bodyPosition),
//  which is the same engine used for the natal radix, so the returned Sun
//  matches the natal Sun to sub-arc-second precision after bisection.
// ============================================================================
import { bodyPosition, castChart, norm360 } from './astro.js';

// Signed angular difference a − b, reduced to (−180, 180]. Positive when a is
// "ahead" of b. Used to bracket the zero-crossing of sunLon(t) − natalSunLon.
function angleDiff(a, b) {
  return ((a - b + 540) % 360) - 180;
}

const DAY_MS = 86400000;

// ---------------------------------------------------------------------------
//  solarReturnInstant — find the UTC Date in `year` when the Sun's ecliptic
//  longitude equals natalSunLon (mod 360).
//
//  Method: scan day-by-day to bracket the single sign change of the signed
//  difference d(t) = angleDiff(sunLon(t), natalSunLon) (the Sun moves
//  ~0.985°/day, so exactly one crossing per calendar year), then bisect to
//  <0.0005° precision. opts.aroundMonth/opts.aroundDay narrow the scan window
//  around the expected birthday for speed; otherwise the whole year is swept.
// ---------------------------------------------------------------------------
export function solarReturnInstant(natalSunLon, year, opts = {}) {
  const target = norm360(natalSunLon);
  const sunLon = t => bodyPosition('Sun', t).lon;
  const d = t => angleDiff(sunLon(t), target);

  // Establish the scan window. When a hint is given, search a generous ±20-day
  // span around it; the crossing is guaranteed within ~1 day of the same
  // calendar date each year, so this comfortably contains it.
  let start, end;
  if (opts.aroundMonth != null) {
    const day = opts.aroundDay ?? 1;
    const centre = Date.UTC(year, opts.aroundMonth, day, 12, 0, 0);
    start = new Date(centre - 20 * DAY_MS);
    end = new Date(centre + 20 * DAY_MS);
  } else {
    start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0));
  }

  // Step day-by-day to bracket where d(t) crosses zero (sign change).
  let lo = start;
  let dLo = d(lo);
  let hi = null;
  for (let t = start.getTime() + DAY_MS; t <= end.getTime(); t += DAY_MS) {
    const cur = new Date(t);
    const dCur = d(cur);
    if (dLo === 0) { return lo; }
    // A crossing lies in [lo, cur] when the signed difference changes sign.
    // Guard against the ±180 wrap by requiring the gap to be small (the Sun
    // advances <1.1° per day, so a genuine crossing is a tiny step).
    if (Math.sign(dCur) !== Math.sign(dLo) && Math.abs(dCur - dLo) < 180) {
      hi = cur;
      break;
    }
    lo = cur;
    dLo = dCur;
  }

  if (hi === null) {
    throw new Error(`solarReturnInstant: no Sun return to ${target}° found in ${year}`);
  }

  // Bisect the bracket to high precision (~30 iterations ⇒ well below 0.0005°).
  let a = lo.getTime();
  let b = hi.getTime();
  let da = d(new Date(a));
  for (let i = 0; i < 30; i++) {
    const mid = (a + b) / 2;
    const dm = d(new Date(mid));
    if (dm === 0) { a = b = mid; break; }
    if (Math.sign(dm) === Math.sign(da)) { a = mid; da = dm; }
    else { b = mid; }
    if (Math.abs(dm) < 0.0005) { a = b = mid; break; }
  }
  return new Date((a + b) / 2);
}

// ---------------------------------------------------------------------------
//  solarReturn — compute the revolution-of-the-year chart for a nativity.
//
//  Takes the natal Sun's tropical longitude from natalChart, finds the
//  return instant in `year`, and casts the return figure for the location.
//  Lilly casts the revolution by default in his quadrant system; we default
//  to Regiomontanus (his houses) at the natal place unless overridden.
//
//  Returns { instant, chart, natalSunLon }.
// ---------------------------------------------------------------------------
export function solarReturn(natalChart, year, opts = {}) {
  const natalSunLon = natalChart.planets.Sun.lon;
  const t = solarReturnInstant(natalSunLon, year, opts);
  const lat = opts.lat ?? natalChart.latitude;
  const lon = opts.lon ?? natalChart.longitude;
  const system = opts.system ?? 'regiomontanus';
  const chart = castChart(t, lat, lon, system);
  return { instant: t, chart, natalSunLon };
}
