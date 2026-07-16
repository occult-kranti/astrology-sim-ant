// ============================================================================
//  handcalc.js — "Cast a chart by hand." The classic manual chart-casting
//  workflow (ephemeris + atlas + book of tables) taught in Catherine Urban's
//  "Chart Calculations for the Apocalypse" workshop, Patrick Watson's writing,
//  and The Astrology Podcast ep. 396 — reconstructed as pure functions so every
//  hand step can be CHECKED live against this repo's exact engine (astro.js),
//  with the delta shown. The deltas ARE the pedagogy: they teach where the old
//  book rules diverge from the true sky, and by how little.
//
//  PURE — no DOM, no randomness. The only astronomy is JOINED from astro.js
//  (gast, obliquity, bodyPosition, houses, meanNode); this module adds NO new
//  astronomy, only the arithmetic the hand-calculator performs and the engine
//  comparison. That keeps it headless-testable and lets the engine-test pin the
//  four worked vectors (A, B-Moon, B-Sun, D) directly.
//
//  HONEST FRAMING (locked): this is the REAL part of astrology — astronomy plus
//  arithmetic, reproducible to the arc-second. The interpretive layer that would
//  read meaning into the finished chart remains without demonstrated validity.
//
//  METHOD SOURCES (see data/handcalc-data.js for the full cited kit):
//   • LST = ST@prior-midnight + UT interval + acceleration ± longitude/15
//     — the midnight-ephemeris "American method" (Simply Math / AFA lesson).
//     Acceleration: the book rule is 10 s per hour of clock time, computed
//     (hours×10 + minutes÷6) s; the EXACT mean rate is 9.8565 s/h (236.5554 s of
//     sidereal gain per solar day ÷ 24). The 9.8333 s/h figure some secondary
//     sources print is an imprecise rounding (236 s ÷ 24) and is flagged.
//   • Proportional logarithm  plog(x) = log10(1440 / x-in-minutes)  (DeVore),
//     so plog(dailyMotion) + plog(interval) = plog(requiredMotion): addition of
//     two look-ups replaces a multiplication. Verified to DeVore's printed
//     .22034 / .50035 → 4°34'.
//   • Linear interpolation  pos = pos0 + dailyMotion × interval/24  (the "simple
//     proportion"); the Moon's one-day interpolation carries a ~2–3′ error.
//   • Book-of-Tables double interpolation — rows by sidereal time (4-min rows =
//     1° of RAMC), columns by latitude — the Michelsen Book of Tables (Placidus
//     AND Koch). The 4-minute row spacing is documented in the Michelsen Koch/
//     Placidus table family (carried as a light caveat in the output).
// ============================================================================
import { gast, obliquity, bodyPosition, houses, meanNode, norm360, signOf, SIGNS } from './astro.js';

// The seven traditional planets in ephemeris order (Sun-out), + the mean node.
export const HANDCALC_BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// ---------------------------------------------------------------------------
//  Small pure helpers (time / arc formatting; kept here so the engine-test and
//  the page format identically to the research vectors).
// ---------------------------------------------------------------------------
export const norm24 = h => ((h % 24) + 24) % 24;

// Signed shortest angular difference b−a, folded to (−180, +180].
export function shortestDeg(a, b) { return ((((b - a) % 360) + 540) % 360) - 180; }

// Split hours into { sign, h, m, s } (s carries the fraction).
export function hmsFromHours(hours) {
  const sign = hours < 0 ? -1 : 1;
  let a = Math.abs(hours);
  const h = Math.floor(a); a = (a - h) * 60;
  const m = Math.floor(a); const s = (a - m) * 60;
  return { sign, h, m, s };
}

// "1h 08m 19.7s" (time). secDigits controls the seconds precision.
export function formatHMS(hours, secDigits = 1) {
  const { sign, h, m, s } = hmsFromHours(hours);
  const sec = s.toFixed(secDigits).padStart(secDigits ? 3 + secDigits : 2, '0');
  return `${sign < 0 ? '−' : ''}${h}h ${String(m).padStart(2, '0')}m ${sec}s`;
}

// Split a signed degree amount into { sign, d, m, s } of arc.
export function dmsFromDeg(deg) {
  const sign = deg < 0 ? -1 : 1;
  let a = Math.abs(deg);
  const d = Math.floor(a); a = (a - d) * 60;
  const m = Math.floor(a); const s = (a - m) * 60;
  return { sign, d, m, s };
}

// "13°21'48\"" (arc). A bare amount, not a zodiacal position.
export function formatDMS(deg, secDigits = 0) {
  const { sign, d, m, s } = dmsFromDeg(deg);
  const sec = secDigits ? `${s.toFixed(secDigits).padStart(3 + secDigits, '0')}"` : `${String(Math.round(s)).padStart(2, '0')}"`;
  return `${sign < 0 ? '−' : ''}${d}°${String(m).padStart(2, '0')}'${sec}`;
}

// A zodiacal position "15°38'12\" Pisces" from an absolute ecliptic longitude.
export function formatZodiac(lon, withSeconds = true) {
  const s = signOf(lon);
  const d = Math.floor(s.degInSign);
  let rest = (s.degInSign - d) * 60;
  const m = Math.floor(rest);
  if (withSeconds) {
    const sec = Math.round((rest - m) * 60);
    if (sec === 60) return `${d}°${String(m + 1).padStart(2, '0')}'00" ${SIGNS[s.index]}`;
    return `${d}°${String(m).padStart(2, '0')}'${String(sec).padStart(2, '0')}" ${SIGNS[s.index]}`;
  }
  const mr = Math.round(rest);
  return `${d}°${String(mr).padStart(2, '0')}' ${SIGNS[s.index]}`;
}

// Difference between two sidereal-time hour values, in SECONDS of sidereal time,
// taking the shortest way round the 24-h clock (so 23.9 vs 0.1 reads as +0.2 h).
export function stSecondsBetween(h1, h2) {
  let d = ((((h1 - h2) % 24) + 24) % 24);   // [0,24)
  if (d > 12) d -= 24;                       // fold to (−12,12]
  return d * 3600;
}

// The prior-midnight (0h UT) instant of a date.
export function midnightUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

// UT interval (hours) since prior midnight UT.
export function intervalHoursOf(dateUTC) {
  return (dateUTC.getTime() - midnightUTC(dateUTC).getTime()) / 3600000;
}

// ---------------------------------------------------------------------------
//  STEP 2 — Local Sidereal Time, by hand and exact.
// ---------------------------------------------------------------------------

// The book acceleration on a UT interval, in SECONDS of sidereal time, at a
// given rate (s per hour of clock time). The published book rule (rate 10) is
// taught as (hours×10 + minutes÷6) s — which equals 10 × intervalHours exactly;
// the exact mean rate is 9.8565 s/h. Both are just rate × intervalHours; the
// (h×10 + m÷6) shortcut is surfaced (for rate 10) as the way the books teach it.
export function accelerationSeconds(intervalHours, rate = 10) {
  return rate * intervalHours;
}

// LST BY HAND (the midnight American method). Returns the LST in hours plus a
// full, displayable step breakdown so the page can show each term.
//   dateUTC          — the birth instant in UT (kept for reference/labelling)
//   midnightSTHours  — sidereal time printed for 0h UT of the birth date (hours)
//   intervalHours    — UT interval since that midnight (hours)
//   lonDeg           — geographic longitude in °E (WEST is negative); the term
//                      is lonDeg/15, so East adds and West subtracts, as taught.
//   opts.rate        — 10 (book rule) | 9.8565 (exact mean) | any s/h
export function lstHand(dateUTC, midnightSTHours, intervalHours, lonDeg, opts = {}) {
  const rate = opts.rate == null ? 10 : opts.rate;
  const accelSeconds = accelerationSeconds(intervalHours, rate);
  const accelHours = accelSeconds / 3600;
  const lonHours = lonDeg / 15;                 // East + / West − (arc→time at 15°/h)
  const raw = midnightSTHours + intervalHours + accelHours + lonHours;
  const lstHours = norm24(raw);

  // The book's teaching shortcut for the rate-10 acceleration: h×10 + m÷6.
  const hInt = Math.floor(intervalHours);
  const mRem = (intervalHours - hInt) * 60;
  const bookShortcut = {
    hoursInt: hInt, minutesRem: mRem,
    hoursTerm: hInt * 10,             // hours × 10
    minutesTerm: mRem / 6,            // minutes ÷ 6  (= (m/60)×10)
    // only meaningful as literally taught when rate === 10
    applies: rate === 10,
  };

  return {
    dateUTC, rate,
    midnightSTHours, intervalHours, lonDeg,
    accelSeconds, accelHours, lonHours,
    bookShortcut,
    rawHours: raw, wrapped: raw >= 24 || raw < 0,
    lstHours,
    // convenience formatted terms
    parts: {
      midnight: formatHMS(midnightSTHours),
      interval: formatHMS(intervalHours),
      acceleration: `+${accelSeconds.toFixed(1)}s`,
      longitude: `${lonHours < 0 ? '−' : '+'}${formatHMS(Math.abs(lonHours))}`,
      lst: formatHMS(lstHours),
    },
  };
}

// LST EXACT, from the engine. RAMC (Right Ascension of the Medium Coeli, i.e.
// the local apparent sidereal time expressed in degrees) = gast(date) + lonDeg;
// the LST in hours is simply RAMC/15. This is the SAME quantity houses() forms
// internally as its `ramc`, so the hand LST and the engine's angle machinery are
// checked against one identical number.
export function lstExact(date, lonDeg) {
  const ramcDeg = norm360(gast(date) + lonDeg);
  return ramcDeg / 15;               // hours in [0,24)
}

// Convenience: the engine RAMC (degrees) for a moment & place.
export function ramcExact(date, lonDeg) { return norm360(gast(date) + lonDeg); }

// Sidereal time at prior midnight (0h UT), in hours — what the ephemeris page's
// "Sid. Time" column prints, reproduced from the engine's gast().
export function siderealTimeAtMidnight(date) {
  return norm360(gast(midnightUTC(date))) / 15;
}

// ---------------------------------------------------------------------------
//  STEP 3 — Proportional logarithms & interpolation.
// ---------------------------------------------------------------------------

// The Diurnal Proportional Logarithm (DeVore): plog(x) = log10(1440 / x_in_min),
// i.e. log10(24h / x). Works identically for a time and an arc because both are
// counts of minutes measured against the same 1440 (24h = 1440 min). The
// table-top constant plog(1 min) = log10(1440) = 3.1584 is the first printed
// entry. NOTE: this is the ASTROLOGICAL prop-log — NOT the nautical proportional
// logarithm log10(10800/seconds), a different constant.
export function plog(minutes) {
  return Math.log10(1440 / minutes);
}

// Invert a proportional logarithm back to minutes.
export function plogInverse(logValue) {
  return 1440 / Math.pow(10, logValue);
}

// The log-addition interpolation: plog(dailyMotion) + plog(interval) yields
// plog(requiredMotion), so the correction to add is read straight off the sum.
// Returns the required motion (degrees, sign of dailyMotion preserved) plus the
// breakdown, matching the DeVore / book worked examples.
export function plogInterp(dailyMotionDeg, intervalHours) {
  const sign = dailyMotionDeg < 0 ? -1 : 1;
  const dmMinutes = Math.abs(dailyMotionDeg) * 60;   // arc → arc-minutes
  const intMinutes = intervalHours * 60;             // time → time-minutes
  const plogDm = plog(dmMinutes);
  const plogInt = plog(intMinutes);
  const sum = plogDm + plogInt;
  const motionMinutes = plogInverse(sum);            // arc-minutes
  const motionDeg = sign * motionMinutes / 60;
  return { dailyMotionDeg, intervalHours, dmMinutes, intMinutes, plogDm, plogInt, sum, motionMinutes, motionDeg };
}

// Linear ("simple proportion") interpolation of a position within the day:
//   pos = pos0 + dailyMotion × interval/24.
// Returns the interpolated absolute longitude (normalised) and the correction.
export function linearInterp(pos0Deg, dailyMotionDeg, intervalHours) {
  const correction = dailyMotionDeg * intervalHours / 24;
  return { correction, lon: norm360(pos0Deg + correction) };
}

// The signed daily motion pos1−pos0 (next midnight − this midnight), folded to
// the short way so retrograde motion reads negative. This is the ephemeris
// "subtract two successive lines" step.
export function dailyMotionBetween(pos0Deg, pos1Deg) {
  return shortestDeg(pos0Deg, pos1Deg);
}

// ---------------------------------------------------------------------------
//  The mini-ephemeris — what the American Ephemeris midnight page would show,
//  reproduced from OUR verified engine (honest: printed by us, not scanned from
//  the book). For `ndays` consecutive dates from the date's 0h UT: the sidereal
//  time at 0h, each traditional planet's longitude at 0h and its daily motion,
//  and the mean node.
// ---------------------------------------------------------------------------
export function miniEphemeris(date, ndays = 2) {
  const start = midnightUTC(date);
  const n = Math.max(1, ndays | 0);
  // compute n+1 midnights so every displayed row has a daily-motion value
  const days = [];
  for (let i = 0; i <= n; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const bodies = {};
    for (const name of HANDCALC_BODIES) bodies[name] = bodyPosition(name, d).lon;
    days.push({ date: d, st0h: norm360(gast(d)) / 15, bodies, node: meanNode(d) });
  }
  const rows = [];
  for (let i = 0; i < n; i++) {
    const today = days[i], next = days[i + 1];
    const bodies = {};
    for (const name of HANDCALC_BODIES) {
      bodies[name] = { lon: today.bodies[name], motion: dailyMotionBetween(today.bodies[name], next.bodies[name]) };
    }
    rows.push({
      date: today.date,
      st0h: today.st0h,
      bodies,
      node: { lon: today.node, motion: dailyMotionBetween(today.node, next.node) },
    });
  }
  return { start, ndays: n, rows };
}

// A convenience wrapper that runs BOTH interpolation routes for one body on the
// birth date and checks them against the engine's exact position — the payload
// the "positions" station renders per planet. `interval` is the UT interval
// (hours) since midnight; `date` is the exact birth instant in UT.
export function interpolateBody(name, date, interval) {
  const mid = midnightUTC(date);
  const nextMid = new Date(mid.getTime() + 86400000);
  const pos0 = bodyPosition(name, mid).lon;
  const pos1 = bodyPosition(name, nextMid).lon;
  const dm = dailyMotionBetween(pos0, pos1);
  const lin = linearInterp(pos0, dm, interval);
  const pl = plogInterp(dm, interval);
  const plLon = norm360(pos0 + pl.motionDeg);
  const exact = bodyPosition(name, date).lon;
  return {
    name, pos0, pos1, dailyMotion: dm,
    linear: { correction: lin.correction, lon: lin.lon, errorMin: shortestDeg(exact, lin.lon) * 60 },
    plog: { ...pl, lon: plLon, errorMin: shortestDeg(exact, plLon) * 60 },
    exact,
    // the two hand routes agree with each other to working precision:
    routesAgreeMin: shortestDeg(plLon, lin.lon) * 60,
  };
}

// ---------------------------------------------------------------------------
//  STEP 4 — the Book of Tables double interpolation (Placidus).
//
//  The tables are entered by SIDEREAL TIME (rows) and LATITUDE (columns). One
//  row per 4 minutes of sidereal time = exactly 1° of RAMC. We reproduce the
//  four surrounding grid cells with the ENGINE's own houses() by holding the
//  obliquity of the birth date fixed and synthesising the longitude that puts
//  the engine's RAMC on each integer-degree row (equivalent to the research's
//  "solve the UT instant whose LST is this row"). Then we bilinearly interpolate
//  and compare to the engine's exact ASC/MC — the delta the page displays.
//
//  `date` fixes the obliquity (and joins the engine); `ramcDeg` is the exact
//  RAMC of the birth chart, `latDeg` the birth latitude.
// ---------------------------------------------------------------------------
export const HOUSE_TABLE_ROW_CAVEAT =
  'Table rows are spaced one per 4 minutes of sidereal time (= 1° of RAMC) and columns per 1° of latitude. ' +
  'That 4-minute spacing is documented in the Michelsen Koch/Placidus table family (AstroAmerica sample: blocks at ' +
  '22h24m, 22h28m, 22h32m… for latitudes 0– 60°N); we reproduce the grid cells from our engine rather than a ' +
  'scanned page, so treat the exact printed spacing of the 168-page Book of Tables as verified-by-family, not by a physical copy.';

function cuspsAtRamc(date, targetRamcDeg, latDeg, system) {
  // houses() forms ramc = norm360(gast(date) + lon); choose lon to hit the row.
  const lonSynth = targetRamcDeg - norm360(gast(date));
  const h = houses(date, latDeg, lonSynth, system);
  return { asc: h.asc, mc: h.mc, cusps: h.cusps.slice() };
}

// Interpolate an angle a→b by fraction f the short way round the circle.
function interpAngle(a, b, f) { return norm360(a + shortestDeg(a, b) * f); }

export function tableOfHousesDemo(ramcDeg, latDeg, date, opts = {}) {
  const system = opts.system || 'placidus';
  const rowLoRamc = Math.floor(ramcDeg);          // 4-min ST rows = integer degrees of RAMC
  const rowHiRamc = rowLoRamc + 1;
  const latLo = Math.floor(latDeg);
  const latHi = latLo + 1;
  const rowFrac = ramcDeg - rowLoRamc;            // 0..1 between the two ST rows
  const latFrac = latDeg - latLo;                 // 0..1 between the two latitude columns

  // four grid corners from the engine
  const c = {
    loLo: cuspsAtRamc(date, rowLoRamc, latLo, system),
    loHi: cuspsAtRamc(date, rowLoRamc, latHi, system),
    hiLo: cuspsAtRamc(date, rowHiRamc, latLo, system),
    hiHi: cuspsAtRamc(date, rowHiRamc, latHi, system),
  };

  // bilinear interpolation for any cusp index: across rows first (per latitude),
  // then across latitude.
  const bilinear = pick => {
    const atLatLo = interpAngle(pick(c.loLo), pick(c.hiLo), rowFrac);
    const atLatHi = interpAngle(pick(c.loHi), pick(c.hiHi), rowFrac);
    return interpAngle(atLatLo, atLatHi, latFrac);
  };
  const ascInterp = bilinear(x => x.asc);
  // MC is latitude-independent: interpolate across rows only.
  const mcInterp = interpAngle(c.loLo.mc, c.hiLo.mc, rowFrac);
  const cuspsInterp = new Array(13).fill(0);
  for (let i = 1; i <= 12; i++) cuspsInterp[i] = bilinear(x => x.cusps[i]);

  // the engine's EXACT angles at the true RAMC & latitude
  const exact = cuspsAtRamc(date, norm360(ramcDeg), latDeg, system);

  return {
    system,
    grid: {
      rowLoRamc, rowHiRamc, latLo, latHi, rowFrac, latFrac,
      // sidereal-time labels for the two rows (RAMC° / 15 → hours)
      rowLoST: rowLoRamc / 15, rowHiST: rowHiRamc / 15,
      corners: c,
    },
    interpolated: { asc: ascInterp, mc: mcInterp, cusps: cuspsInterp },
    exact,
    delta: {
      ascMin: shortestDeg(exact.asc, ascInterp) * 60,
      mcMin: shortestDeg(exact.mc, mcInterp) * 60,
    },
    rowCaveat: HOUSE_TABLE_ROW_CAVEAT,
  };
}
