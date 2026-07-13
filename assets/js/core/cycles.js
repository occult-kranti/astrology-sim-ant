// ============================================================================
//  cycles.js — the "Cycles of History" engine: Jupiter–Saturn GREAT
//  CONJUNCTIONS (geocentric, tropical of-date, in ecliptic LONGITUDE) with
//  trigon/triplicity runs, the Abū Maʿshar doctrinal MEAN-conjunction overlay,
//  and an honest ECLIPSE-possibility layer (classical NASA/Espenak node-
//  distance limits + the bundled engine's global eclipse search as ground
//  truth).
//
//  PURE MODULE: no DOM, no network, no randomness — dates are passed in.
//  Positions come from the same path the rest of the site uses (astronomy-
//  engine, truncated VSOP87, geocentric apparent TRUE-equinox-of-date
//  longitudes ≈1 arc-minute); range-guarding uses core/calendar.js
//  eraAccuracy (Espenak–Meeus ΔT fit −1999…+3000 — 'refuse' outside it).
//
//  Frames (load-bearing): conjunctions here are LONGITUDE crossings in the
//  tropical zodiac OF DATE — the frame of R. Nolle's astropro table and of a
//  sign-based timeline. Wikipedia's Great-conjunction table is fixed-epoch
//  (J2000) and dated by minimum separation; it differs by accumulated
//  precession (≈1.396°/century) and by 1–2 days. Conjunctions in right
//  ascension differ from conjunctions in longitude by days to weeks.
//  All eclipse criteria are GLOBAL ("somewhere on Earth") — never local.
// ============================================================================

import { bodyPosition, signOf, formatLon, norm360 } from './astro.js';
import { utcDate, eraAccuracy } from './calendar.js';
import { CYCLE_CONSTANTS, ECLIPSE_LIMITS } from './data/cycles-data.js';
import {
  Body, GeoVector, Rotation_EQJ_ECT, RotateVector, SphereFromVector,
  SearchMoonPhase, SearchMoonNode, NextMoonNode, EclipticGeoMoon,
  SearchGlobalSolarEclipse, SearchLunarEclipse,
} from '../lib/astronomy.js';

const D2R = Math.PI / 180;
const DAY_MS = 86400000;
const HOUR_MS = 3600000;

// Signed wrapped difference → (−180, 180].
const wrap180 = x => ((x % 360) + 540) % 360 - 180;

// Sign index % 4 → triplicity (Aries=fire, Taurus=earth, Gemini=air, Cancer=water …).
export const TRIPLICITIES = ['fire', 'earth', 'air', 'water'];
const triplicityOf = signIndex => TRIPLICITIES[signIndex % 4];

// Range guard: the Espenak–Meeus ΔT fit and the planetary series are only
// defensible in −1999…+3000; eraAccuracy grades 'refuse' outside it.
function guardYear(year, fn) {
  const acc = eraAccuracy(year);
  if (acc.grade === 'refuse') {
    throw new Error(`${fn}: year ${year} is outside the supported era −1999…3000 `
      + `(eraAccuracy 'refuse': ${acc.note})`);
  }
  return acc;
}

// Light of-date ecliptic position {lon, lat} — the same GeoVector →
// Rotation_EQJ_ECT path astro.js uses, without the (3×-costlier) speed
// computation, so a multi-century scan stays fast. bodyPosition() is still
// used at each crossing for the retrograde flags.
function eclOfDate(body, date) {
  const vec = GeoVector(body, date, true);              // EQJ, aberration-corrected
  const sph = SphereFromVector(RotateVector(Rotation_EQJ_ECT(date), vec));
  return { lon: norm360(sph.lon), lat: sph.lat };
}

// Great-circle separation in degrees between two {lon, lat} positions.
function gcSepDeg(a, b) {
  const c = Math.sin(a.lat * D2R) * Math.sin(b.lat * D2R)
    + Math.cos(a.lat * D2R) * Math.cos(b.lat * D2R) * Math.cos((a.lon - b.lon) * D2R);
  return Math.acos(Math.min(1, Math.max(-1, c))) / D2R;
}

// Jupiter−Saturn longitude difference, signed, wrapped.
const jsDiff = ms => wrap180(
  eclOfDate(Body.Jupiter, new Date(ms)).lon - eclOfDate(Body.Saturn, new Date(ms)).lon);

// ---------------------------------------------------------------------------
//  conjunctionsBetween(startDate, endDate, opts?) → conjunction records
//
//  Scans the signed wrapped difference lonJupiter − lonSaturn in ~20-day steps,
//  detects zero crossings (ignoring the ±180° wrap at opposition), and bisects
//  each to under 1 hour. Because triples arise from apparent retrogradation,
//  a single synodic period can yield 1 or 3 crossings — all are returned.
//
//  Each hit: {
//    date              JS Date (UT) of the longitude crossing (±30 min),
//    lon               ecliptic longitude, tropical of-date (degrees),
//    label             formatLon(lon), e.g. "0°29' Aquarius",
//    sign              signOf(lon) → { index, name, glyph, degInSign },
//    triplicity        'fire' | 'earth' | 'air' | 'water' (sign index % 4),
//    jupiterRetrograde, saturnRetrograde   apparent-motion flags at the hit,
//    sep               minimum great-circle separation (arcmin) near the
//                      crossing — sampled ±10 days at 6-hour steps using
//                      latitude too (the planets pass near, not through,
//                      each other).
//  }
//  Throws if either end of the range leaves −1999…3000 (calendar.js
//  eraAccuracy grades that era 'refuse').
// ---------------------------------------------------------------------------
export function conjunctionsBetween(startDate, endDate, opts = {}) {
  if (!(startDate instanceof Date) || isNaN(startDate) || !(endDate instanceof Date) || isNaN(endDate)) {
    throw new Error('conjunctionsBetween: startDate and endDate must be valid Dates');
  }
  if (endDate.getTime() <= startDate.getTime()) {
    throw new Error('conjunctionsBetween: endDate must be after startDate');
  }
  guardYear(startDate.getUTCFullYear(), 'conjunctionsBetween');
  guardYear(endDate.getUTCFullYear(), 'conjunctionsBetween');

  const stepMs = (opts.stepDays || 20) * DAY_MS;
  const t0 = startDate.getTime(), t1 = endDate.getTime();
  const hits = [];

  // A grazing retrograde loop can dip through zero TWICE inside one coarse
  // step (verified: October 979 BCE — two crossings 6 days apart, same sign at
  // both step samples). So besides sign changes, any low-|f| sample triplet
  // that brackets a local minimum is re-scanned at fine resolution.
  const fineScan = (aMs, bMs) => {
    const fine = 2 * DAY_MS;
    let pT = aMs, pF = jsDiff(aMs);
    for (let t = aMs + fine; pT < bMs; t += fine) {
      if (t > bMs) t = bMs;
      const f = jsDiff(t);
      if ((pF === 0 || pF * f < 0) && Math.abs(f - pF) < 90) hits.push(bisectCrossing(pT, t, pF));
      pT = t; pF = f;
      if (t === bMs) break;
    }
  };

  let prevT = t0, prevF = jsDiff(t0);
  let prev2F = null; // the sample before prevF, for local-minimum detection
  for (let t = t0 + stepMs; prevT < t1; t += stepMs) {
    if (t > t1) t = t1;
    const f = jsDiff(t);
    // Zero crossing — but NOT the ±180° wrap at opposition: the relative
    // motion is ≤ ~0.25°/day, so a genuine crossing changes f by only a few
    // degrees per step, while the opposition wrap jumps by ~360°.
    if ((prevF === 0 || prevF * f < 0) && Math.abs(f - prevF) < 90) {
      hits.push(bisectCrossing(prevT, t, prevF));
    } else if (prev2F !== null && Math.abs(prevF) < 3
      && Math.abs(prevF) <= Math.abs(prev2F) && Math.abs(prevF) <= Math.abs(f)
      && Math.abs(f - prevF) < 90 && Math.abs(prevF - prev2F) < 90) {
      // same-sign local minimum under 3° at prevT: a possible grazing double
      // crossing hides between the neighbours — probe the bracket finely.
      fineScan(prevT - stepMs, t);
    }
    prev2F = prevF; prevT = t; prevF = f;
    if (t === t1) break;
  }
  hits.sort((a, b) => a.date - b.date);
  // the fine probe may re-find a crossing the coarse branch already caught
  return hits.filter((h, i) => !i || h.date.getTime() - hits[i - 1].date.getTime() > 36 * HOUR_MS);
}

function bisectCrossing(aMs, bMs, fa) {
  while (bMs - aMs > HOUR_MS) {
    const m = (aMs + bMs) / 2;
    const fm = jsDiff(m);
    if (fm === 0) { aMs = m; bMs = m; break; }
    if (fa * fm < 0) bMs = m; else { aMs = m; fa = fm; }
  }
  const tc = new Date(Math.round((aMs + bMs) / 2));

  const jup = bodyPosition('Jupiter', tc);
  const sat = bodyPosition('Saturn', tc);
  const lon = norm360(jup.lon);
  const sign = signOf(lon);

  // Minimum great-circle separation (arcmin) near the crossing: the planets
  // differ in ecliptic LATITUDE, so the true minimum is nonzero and can fall
  // a day or two off the longitude crossing. Sample ±10 days at 6-hour steps.
  let minSep = Infinity;
  for (let k = -40; k <= 40; k++) {
    const d = new Date(tc.getTime() + k * 6 * HOUR_MS);
    const s = gcSepDeg(eclOfDate(Body.Jupiter, d), eclOfDate(Body.Saturn, d));
    if (s < minSep) minSep = s;
  }

  return {
    date: tc,
    lon,
    label: formatLon(lon),
    sign,
    triplicity: triplicityOf(sign.index),
    jupiterRetrograde: jup.retrograde,
    saturnRetrograde: sat.retrograde,
    sep: Math.round(minSep * 60 * 10) / 10,   // arcmin, 0.1′ resolution
  };
}

// ---------------------------------------------------------------------------
//  triplicityRuns(conjunctions) → runs of consecutive same-triplicity
//  conjunctions, in order, with shift markers — the rows of a trigon table.
//
//  Each run: { triplicity, count, start, end, conjunctions[], shiftFrom
//  (previous run's triplicity or null), reversion? } — `reversion: true`
//  marks a short run (≤3 crossings, i.e. at most one conjunction event even
//  if triple) sandwiched between two runs of the SAME triplicity: a one-off
//  foray, not a true trigon shift. Examples the flag exists for: the 1980–81
//  Libra triple inside the 1842–2000 earth run, and the 1821 Aries reversion
//  after the first earth entry of 1802.
// ---------------------------------------------------------------------------
export function triplicityRuns(conjunctions) {
  const runs = [];
  for (const c of conjunctions) {
    const last = runs[runs.length - 1];
    if (last && last.triplicity === c.triplicity) {
      last.conjunctions.push(c); last.count++; last.end = c.date;
    } else {
      runs.push({
        triplicity: c.triplicity, count: 1, start: c.date, end: c.date,
        conjunctions: [c], shiftFrom: last ? last.triplicity : null,
      });
    }
  }
  for (let i = 1; i < runs.length - 1; i++) {
    if (runs[i].count <= 3 && runs[i - 1].triplicity === runs[i + 1].triplicity) {
      runs[i].reversion = true;
    }
  }
  return runs;
}

// ---------------------------------------------------------------------------
//  meanConjunctionSeries(fromYear, toYear) → the DOCTRINAL overlay.
//
//  Abū Maʿshar's historical astrology (and the medieval tables generally) is
//  built on MEAN conjunctions computed from mean planetary motions: EXACTLY
//  one conjunction per 19.859-Julian-year synodic period, each +242.98°
//  (tropical) from the last, 12 per triplicity, 960 years round the cycle —
//  and NEVER a triple. Observation instead gives geocentric conjunctions in
//  apparent longitude, which retrogradation can split into three passes over
//  ~6–7 months. Showing BOTH series on one timeline is the teaching point:
//  the doctrine periodized history with an idealized clock, not the sky.
//
//  The series is anchored at the engine-verified 2020-12-21 18:26 UT crossing
//  (300.487°, 0°29′ Aquarius) and stepped by exactly
//  CYCLE_CONSTANTS.synodicJulianYears (19.859 Julian years) and
//  +CYCLE_CONSTANTS.meanAdvance.tropicalDeg (242.98°, tropical frame) per
//  step, both ways in time.
//
//  Returns [{ k, year, date, lon, sign, triplicity }] for every mean
//  conjunction whose UTC year falls in [fromYear, toYear]. Throws outside
//  −1999…3000 (eraAccuracy 'refuse').
// ---------------------------------------------------------------------------
export function meanConjunctionSeries(fromYear, toYear) {
  if (!Number.isFinite(fromYear) || !Number.isFinite(toYear) || toYear < fromYear) {
    throw new Error('meanConjunctionSeries: need finite years with fromYear <= toYear');
  }
  guardYear(fromYear, 'meanConjunctionSeries');
  guardYear(toYear, 'meanConjunctionSeries');

  const A = CYCLE_CONSTANTS.anchor2020;
  const anchor = utcDate(A.y, A.m, A.d, A.hourUT);
  const stepMs = CYCLE_CONSTANTS.synodicJulianYears * 365.25 * DAY_MS;
  const advance = CYCLE_CONSTANTS.meanAdvance.tropicalDeg;

  const k0 = Math.floor((utcDate(fromYear, 1, 1, 0).getTime() - anchor.getTime()) / stepMs) - 1;
  const k1 = Math.ceil((utcDate(toYear, 12, 31, 12).getTime() - anchor.getTime()) / stepMs) + 1;

  const out = [];
  for (let k = k0; k <= k1; k++) {
    const date = new Date(anchor.getTime() + k * stepMs);
    const year = date.getUTCFullYear();
    if (year < fromYear || year > toYear) continue;
    const lon = norm360(A.lonDeg + k * advance);
    const sign = signOf(lon);
    out.push({ k, year, date, lon, sign, triplicity: triplicityOf(sign.index) });
  }
  return out;
}

// ---------------------------------------------------------------------------
//  eclipseNear(date) → the honest eclipse layer, TWO WAYS at once.
//
//  Layer 1 — the CLASSICAL ecliptic-limit criterion (teachable; it is the
//  same "eclipse possibility" logic the Babylonians ran on the 223-month
//  cycle): find the new moon and the full moon nearest `date`; for each,
//  measure D = the Moon's angular distance in ecliptic longitude from the
//  nearer lunar node (node crossings from SearchMoonNode/NextMoonNode
//  bracketing the syzygy), and classify against the NASA/Espenak limits:
//    SOLAR:  certain D < 15.39°, impossible D > 18.59°, else 'possible';
//    LUNAR (any type incl. penumbral): certain D < 15.3°, impossible > 17.1°;
//    LUNAR umbral (classical): certain D < 9.5°, impossible > 12.25°.
//
//  Layer 2 — GROUND TRUTH: the bundled engine's global searches
//  (SearchGlobalSolarEclipse / SearchLunarEclipse) started just before the
//  syzygy; the result reports the eclipse kind and peak, and whether it is
//  the SAME syzygy (peak within ~3 days) — i.e. whether an eclipse actually
//  occurred at this new/full moon.
//
//  Every criterion here is GLOBAL: the only honest claim is "an eclipse
//  occurred / was possible SOMEWHERE ON EARTH near this date" — local
//  visibility needs Besselian elements and is never asserted.
//
//  Returns {
//    date,
//    solar: { syzygy, moonLon, nodeDistanceDeg, verdict, groundTruth },
//    lunar: { syzygy, moonLon, nodeDistanceDeg, verdictAny, verdictUmbral,
//             verdict (= verdictAny), groundTruth },
//    era        the eraAccuracy record for the year (display gating),
//    framing    the locked global-claims-only wording (from ECLIPSE_LIMITS).
//  }
//  where groundTruth = { eclipse (bool: same syzygy), kind, peak, sameSyzygy }.
// ---------------------------------------------------------------------------
export function eclipseNear(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('eclipseNear: date must be a valid Date');
  }
  const era = guardYear(date.getUTCFullYear(), 'eclipseNear');

  const solar = syzygyReport(0, date);
  const lunar = syzygyReport(180, date);
  return { date, solar, lunar, era, framing: ECLIPSE_LIMITS.framing };
}

// Nearest syzygy (targetLon 0 = new moon, 180 = full moon) to `date`.
function nearestSyzygy(targetLon, date) {
  let t = SearchMoonPhase(targetLon, new Date(date.getTime() - 40 * DAY_MS), 80);
  if (!t) throw new Error('eclipseNear: syzygy search failed');
  let best = t;
  for (;;) {
    const next = SearchMoonPhase(targetLon, t.AddDays(1), 40);
    if (!next) break;
    if (Math.abs(next.date.getTime() - date.getTime()) <= Math.abs(best.date.getTime() - date.getTime())) {
      best = next; t = next;
    } else break;
  }
  return best;                                  // AstroTime
}

// D = Moon's distance in ecliptic longitude from the nearer node, measured at
// the syzygy. The node longitudes are read off the Moon itself at the node
// crossings bracketing the syzygy (nodes are ~13.6 days apart, so starting
// the search 20 days early always brackets it).
function nodeDistanceAt(syzygy) {
  let node = SearchMoonNode(syzygy.AddDays(-20));
  let prev = null;
  while (node.time.ut < syzygy.ut) { prev = node; node = NextMoonNode(node); }

  const moonLon = EclipticGeoMoon(syzygy).lon;
  const dist = t => Math.abs(wrap180(moonLon - EclipticGeoMoon(t).lon));
  const candidates = [dist(node.time)];
  if (prev) candidates.push(dist(prev.time));
  return { moonLon: norm360(moonLon), distanceDeg: Math.min(...candidates) };
}

const classify = (D, certain, impossible) =>
  D < certain ? 'certain' : D > impossible ? 'impossible' : 'possible';

function syzygyReport(targetLon, date) {
  const t = nearestSyzygy(targetLon, date);
  const nd = nodeDistanceAt(t);
  const D = nd.distanceDeg;
  const L = ECLIPSE_LIMITS;

  const report = {
    syzygy: t.date,
    moonLon: nd.moonLon,
    nodeDistanceDeg: Math.round(D * 100) / 100,
  };

  let found;
  if (targetLon === 0) {
    report.verdict = classify(D, L.solar.certainDeg, L.solar.impossibleDeg);
    found = SearchGlobalSolarEclipse(t.AddDays(-3));
  } else {
    report.verdictAny = classify(D, L.lunarAny.certainDeg, L.lunarAny.impossibleDeg);
    report.verdictUmbral = classify(D, L.lunarUmbralClassical.certainDeg, L.lunarUmbralClassical.impossibleDeg);
    report.verdict = report.verdictAny;
    found = SearchLunarEclipse(t.AddDays(-3));
  }

  const sameSyzygy = Math.abs(found.peak.date.getTime() - t.date.getTime()) < 3 * DAY_MS;
  report.groundTruth = {
    eclipse: sameSyzygy,                        // an eclipse occurred at THIS syzygy
    sameSyzygy,
    kind: String(found.kind),                   // kind of the eclipse the search found
    peak: found.peak.date,                      // …which is a later syzygy if !sameSyzygy
  };
  return report;
}
