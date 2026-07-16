// ============================================================================
//  tithi-pravesha.js — TITHI-PRAVEŚA: the Vedic annual (and monthly) chart cast
//  for the instant the Moon regains its EXACT natal elongation from the Sun
//  (same tithi AND the same tithi-fraction) while the Sun occupies its natal
//  SIDEREAL sign. Sanjay Rath's Odiśā tradition (srath.com); P.V.R. Narasimha
//  Rao's re-definition matches the SOLI-LUNAR month instead of the solar month.
//  JHora offers both, with SOLAR months as the shipped default — that is the
//  default here; soli-lunar is a documented, flagged variant.
//
//  The chart is cast for the BIRTHPLACE (irrespective of current residence).
//  Elongation matching is AYANĀṀŚA-INDEPENDENT (a difference of longitudes, so
//  the ayanāṁśa cancels); only the month-window edges depend on the ayanāṁśa.
//
//  HONEST FRAMING (locked): tithi-praveśa has NO classical BPHS/Jaimini textual
//  anchor — it is a MODERN LINEAGE teaching (Rath attributes it to his Odiśā
//  tradition). Rath's school also prefers a NON-Lahiri ayanāṁśa (Puṣya-pakṣa /
//  SSS); this engine stays on the site's Lahiri, flagged — and only the window
//  edges depend on that choice. Astrology has no demonstrated validity —
//  described, never prescribed.
//
//  PURE — no DOM. Positions come from astro.js (bodyPosition / castChart), the
//  same engine as the natal radix; the sidereal frame reuses vedic-data.js
//  (toSidereal / lahiriAyanamsa); the sidereal reading reuses vedic.js
//  (castVedic); the horā lord reuses planetary-hours.js.
// ============================================================================
import { bodyPosition, castChart, norm360 } from './astro.js';
import { toSidereal, RASHIS, VARA_LORDS, VARA_NAMES, TITHIS } from './data/vedic-data.js';
import { castVedic } from './vedic.js';
import { planetaryHour } from './planetary-hours.js';

const DAY_MS = 86400000;
const HOUR_MS = 3600000;

// signed difference a − b reduced to (−180, 180]
function wrap180(a, b) { return ((a - b + 540) % 360) - 180; }

// tropical elongation Moon − Sun at t (ayanāṁśa cancels → sidereal is identical)
function elongationAt(t) {
  return norm360(bodyPosition('Moon', t).lon - bodyPosition('Sun', t).lon);
}
// sidereal Sun longitude (for the month window)
function siderealSunLonAt(t) { return toSidereal(bodyPosition('Sun', t).lon, t); }

// tithi (1..30) + name/paksha from an elongation
function tithiOf(elong) {
  const num = Math.floor(norm360(elong) / 12) + 1;
  const paksha = num <= 15 ? 'Śukla (waxing)' : 'Kṛṣṇa (waning)';
  const name = TITHIS[(num - 1) % 15] + (num === 15 ? ' (Pūrṇimā)' : num === 30 ? ' (Amāvāsyā)' : '');
  return { num, name: `${paksha.startsWith('Kṛṣṇa') ? 'Kṛṣṇa' : 'Śukla'} ${TITHIS[(num - 1) % 15]}`.trim(), fullName: name, paksha };
}

// bisect an upward zero-crossing of f(t) = wrap180(elongation(t), E0) in [aMs,bMs]
function bisectElong(E0, aMs, bMs) {
  let a = aMs, b = bMs, da = wrap180(elongationAt(new Date(a)), E0);
  for (let i = 0; i < 60 && b - a > 500; i++) {
    const m = (a + b) / 2, dm = wrap180(elongationAt(new Date(m)), E0);
    if (dm === 0) { a = b = m; break; }
    if (Math.sign(dm) === Math.sign(da)) { a = m; da = dm; } else { b = m; }
    if (Math.abs(dm) < 1e-6) { a = b = m; break; }
  }
  return Math.round((a + b) / 2);
}

// bisect the sidereal-Sun crossing of a sign boundary (boundaryDeg) in [aMs,bMs]
function bisectSidBoundary(boundaryDeg, aMs, bMs) {
  const f = ms => wrap180(siderealSunLonAt(new Date(ms)), boundaryDeg);
  let a = aMs, b = bMs, da = f(a);
  for (let i = 0; i < 60 && b - a > 500; i++) {
    const m = (a + b) / 2, dm = f(m);
    if (dm === 0) { a = b = m; break; }
    if (Math.sign(dm) === Math.sign(da)) { a = m; da = dm; } else { b = m; }
    if (Math.abs(dm) < 1e-6) { a = b = m; break; }
  }
  return Math.round((a + b) / 2);
}

// The natal elongation E0 + the natal sidereal Sun sign, from a tropical chart.
export function natalTithiData(natalChart) {
  const date = natalChart.date instanceof Date ? natalChart.date : new Date(natalChart.date);
  const sunTrop = natalChart.planets.Sun.lon, moonTrop = natalChart.planets.Moon.lon;
  const E0 = norm360(moonTrop - sunTrop);
  const sunSid = toSidereal(sunTrop, date);
  const signIndex = Math.floor(sunSid / 30);
  return {
    elongation: +E0.toFixed(4), tithi: tithiOf(E0),
    sunSidereal: +sunSid.toFixed(4), solarSignIndex: signIndex,
    solarSign: RASHIS[signIndex].name, solarSignSanskrit: RASHIS[signIndex].sanskrit,
    solarSignDeg: +(sunSid - signIndex * 30).toFixed(4),
  };
}

// ---------------------------------------------------------------------------
//  siderealSunSignWindow(natalChart, year) — the [ingress, egress] window in
//  the target year during which the Sun occupies its natal sidereal sign.
//  Handles the year-boundary straddle (e.g. Sagittarius Dec→Jan).
// ---------------------------------------------------------------------------
export function siderealSunSignWindow(natalChart, year) {
  const { solarSignIndex } = natalTithiData(natalChart);
  const startBoundary = solarSignIndex * 30;
  const endBoundary = ((solarSignIndex + 1) % 12) * 30;
  const yStart = Date.UTC(year, 0, 1), yEnd = Date.UTC(year + 1, 0, 1);

  // the ingress = the unique upward crossing of the START boundary in the year
  const ingress = findUpwardSidCrossing(startBoundary, yStart, yEnd);
  if (ingress == null) throw new Error(`tithiPravesha: no Sun ingress into ${RASHIS[solarSignIndex].name} found in ${year}`);
  // the egress = the crossing of the END boundary within ~40 days after ingress
  const egress = findUpwardSidCrossing(endBoundary, ingress + HOUR_MS, ingress + 40 * DAY_MS);
  if (egress == null) throw new Error(`tithiPravesha: no Sun egress from ${RASHIS[solarSignIndex].name} found after ${new Date(ingress).toISOString()}`);
  return {
    signIndex: solarSignIndex, sign: RASHIS[solarSignIndex].name,
    ingress: new Date(ingress), egress: new Date(egress),
    ingressISO: new Date(ingress).toISOString(), egressISO: new Date(egress).toISOString(),
    lengthDays: +((egress - ingress) / DAY_MS).toFixed(3),
  };
}

// scan day-by-day for the upward crossing of siderealSunLon over boundaryDeg
function findUpwardSidCrossing(boundaryDeg, fromMs, toMs) {
  let prev = fromMs, dPrev = wrap180(siderealSunLonAt(new Date(prev)), boundaryDeg);
  for (let t = fromMs + DAY_MS; prev < toMs; t += DAY_MS) {
    if (t > toMs) t = toMs;
    const dCur = wrap180(siderealSunLonAt(new Date(t)), boundaryDeg);
    if ((dPrev < 0 && dCur >= 0) && Math.abs(dCur - dPrev) < 90) return bisectSidBoundary(boundaryDeg, prev, t);
    prev = t; dPrev = dCur;
    if (t === toMs) break;
  }
  return null;
}

// ---------------------------------------------------------------------------
//  elongationMatchesBetween(natalChart, start, end) — every upward crossing of
//  the natal elongation E0 in [start, end], each with the sidereal Sun sign and
//  tithi at that instant. Elongation is strictly increasing, so each crossing is
//  a genuine tithi-return; hourly scan + bisection.
// ---------------------------------------------------------------------------
export function elongationMatchesBetween(natalChart, start, end) {
  const { elongation: E0 } = natalTithiData(natalChart);
  const t0 = (start instanceof Date ? start : new Date(start)).getTime();
  const t1 = (end instanceof Date ? end : new Date(end)).getTime();
  const out = [];
  let prev = t0, dPrev = wrap180(elongationAt(new Date(prev)), E0);
  for (let t = t0 + HOUR_MS; prev < t1; t += HOUR_MS) {
    if (t > t1) t = t1;
    const dCur = wrap180(elongationAt(new Date(t)), E0);
    if ((dPrev < 0 && dCur >= 0) && Math.abs(dCur - dPrev) < 90) {
      const ms = bisectElong(E0, prev, t);
      const when = new Date(ms);
      const sunSid = siderealSunLonAt(when), signIndex = Math.floor(norm360(sunSid) / 30);
      const el = elongationAt(when);
      out.push({
        instant: when, instantISO: when.toISOString(),
        elongation: +el.toFixed(4), elongError: +Math.abs(wrap180(el, E0)).toFixed(6),
        siderealSunLon: +sunSid.toFixed(4), siderealSunSignIndex: signIndex, siderealSunSign: RASHIS[signIndex].name,
        tithi: tithiOf(el),
      });
    }
    prev = t; dPrev = dCur;
    if (t === t1) break;
  }
  return out;
}

// the amānta (soli-lunar) month index of an instant = the sidereal Sun sign at
// the new moon that OPENS the current lunar month (the most recent prior new moon)
function amantaMonthIndex(t) {
  // the previous new moon = the most recent instant ≤ t where elongation ≈ 0⁺
  const tMs = (t instanceof Date ? t : new Date(t)).getTime();
  let prev = tMs, ePrev = elongationAt(new Date(prev));
  for (let s = tMs - DAY_MS; s > tMs - 32 * DAY_MS; s -= DAY_MS) {
    const eCur = elongationAt(new Date(s));
    // downward crossing of 0 going backward = the new moon boundary
    if (eCur > 300 && ePrev < 60) {
      // bracket [s, prev] contains the new moon (elong wraps 360→0 forward)
      const nm = bisectElong(0, s, prev);
      return Math.floor(norm360(siderealSunLonAt(new Date(nm))) / 30);
    }
    prev = s; ePrev = eCur;
  }
  // fallback: the sign the Sun is in now
  return Math.floor(norm360(siderealSunLonAt(new Date(tMs))) / 30);
}

// ---------------------------------------------------------------------------
//  tithiPravesha(natalChart, year, opts) — the ANNUAL tithi-praveśa.
//   opts.monthRule : 'solar' (default) | 'soliLunar'
//   opts.lat, opts.lon : the chart place (defaults to the birthplace)
// ---------------------------------------------------------------------------
export function tithiPravesha(natalChart, year, opts = {}) {
  const monthRule = opts.monthRule === 'soliLunar' ? 'soliLunar' : 'solar';
  const lat = opts.lat != null ? opts.lat : natalChart.latitude;
  const lon = opts.lon != null ? opts.lon : natalChart.longitude;
  const natal = natalTithiData(natalChart);
  const window = siderealSunSignWindow(natalChart, year);

  // SOLAR: every elongation match strictly inside the Sun-in-natal-sign window.
  const solarCandidates = elongationMatchesBetween(natalChart, window.ingress, window.egress);

  let chosen, ambiguity, variantSelection = null;
  if (monthRule === 'solar') {
    if (solarCandidates.length === 1) { chosen = solarCandidates[0]; ambiguity = { flag: false }; }
    else if (solarCandidates.length === 0) {
      // the tithi return skipped this (short) solar month — surface the nearest match
      const wide = elongationMatchesBetween(natalChart, new Date(window.ingress.getTime() - 5 * DAY_MS), new Date(window.egress.getTime() + 5 * DAY_MS));
      chosen = nearest(wide, (window.ingress.getTime() + window.egress.getTime()) / 2);
      ambiguity = { flag: true, reason: 'ZERO matches inside the solar window (a short sidereal month can skip the tithi return). The NEAREST match just outside is surfaced — never silently chosen. ⚑' };
    } else {
      chosen = solarCandidates[0];
      ambiguity = { flag: true, reason: `${solarCandidates.length} matches inside the solar window (a long sidereal month can contain two). ALL are returned in candidates[]; JHora's month convention would pick per its definition. ⚑` };
    }
  } else {
    // SOLI-LUNAR (PVR variant): the elongation match whose amānta month matches
    // the natal amānta month, searched across the anniversary neighbourhood.
    const natalDate = natalChart.date instanceof Date ? natalChart.date : new Date(natalChart.date);
    const natalAmanta = amantaMonthIndex(natalDate);
    const scanStart = new Date(window.ingress.getTime() - 35 * DAY_MS);
    const scanEnd = new Date(window.egress.getTime() + 15 * DAY_MS);
    const wide = elongationMatchesBetween(natalChart, scanStart, scanEnd)
      .map(m => ({ ...m, amanta: amantaMonthIndex(m.instant) }));
    const matched = wide.filter(m => m.amanta === natalAmanta);
    chosen = matched.length ? nearest(matched, window.ingress.getTime()) : nearest(wide, window.ingress.getTime());
    variantSelection = {
      natalAmantaSign: RASHIS[natalAmanta].name,
      matchesInNatalMonth: matched.length,
      note: 'SOLI-LUNAR VARIANT (P.V.R. Narasimha Rao): the tithi return is matched in the same AMĀNTA (soli-lunar) month as birth, not the solar sign-month. This is a documented alternative, NOT the JHora default. It can select a different instant than the solar rule (the classic demonstration case). ⚑',
    };
    ambiguity = { flag: matched.length !== 1, reason: matched.length === 1 ? undefined : `${matched.length} matches in the natal amānta month — surfaced for inspection. ⚑` };
  }

  // cast the chart at the chosen instant for the BIRTHPLACE, read it sidereally
  const chart = castChart(chosen.instant, lat, lon, 'whole');
  const vedic = castVedic(chart);
  let ph = null; try { ph = planetaryHour(chosen.instant, lat, lon); } catch { ph = null; }
  const wd = chosen.instant.getUTCDay();

  const readings = {
    tpLagna: { label: vedic.lagna.label, rashi: vedic.lagna.rashi, sanskrit: vedic.lagna.sanskrit, lord: vedic.lagna.lord, nakshatra: vedic.lagna.nakshatra.name, note: 'The TP lagna is judged like a natal lagna for the year (Rath).' },
    weekdayLord: { lord: VARA_LORDS[wd], vara: VARA_NAMES[wd], note: 'The weekday lord of the TP day (Vedic vāra begins at sunrise — a minor civil-day simplification).' },
    horaLord: { lord: ph ? ph.ruler : null, note: 'The horā lord at the TP instant = the "lord of the year" (his houses in the rāśi and vargas gain special importance). Reuses the Chaldean planetary-hour engine.' },
    panchanga: vedic.panchanga,
  };

  return {
    system: 'tithi-pravesha', kind: 'annual', monthRule, year,
    natal,
    window: { ...window, ingress: undefined, egress: undefined }, // ISO strings kept; Date objects dropped for cleanliness
    windowDates: { ingress: window.ingress, egress: window.egress },
    candidates: solarCandidates,
    match: chosen, ambiguity, variantSelection,
    place: { lat, lon },
    chart, vedic, readings,
    tithiAshtottariNote: 'The tradition pairs the TP chart with the compressed Tithi-Aṣṭottarī daśā (Vimśottarī being reserved for the natal chart). This is a READING-LAYER convention (Rath / PVR), DOCUMENTED here but NOT computed — it has no BPHS anchor and its span-apportionment varies by lineage. ⚑',
    anchorNote: 'HONEST ANCHOR NOTE: tithi-praveśa has NO classical BPHS/Jaimini textual anchor — it is a MODERN LINEAGE teaching (Rath attributes it to his Odiśā tradition; PVR Narasimha Rao refined it). The solar-vs-soli-lunar month choice is genuinely contested (Rao himself cautions neither convention always wins); JHora ships solar as the default, which is the default here. Rath\'s school prefers a NON-Lahiri ayanāṁśa (Puṣya-pakṣa / SSS) — this engine stays on Lahiri, and ONLY the month-window edges depend on that choice (the elongation match is ayanāṁśa-independent). ⚑',
    citations: [
      'Sanjay Rath, "Tithi Pravesha", https://srath.com/jyoti%E1%B9%A3a/tithi-pravesa/tithi-pravesha/ (the definition + the birthplace rule).',
      'P.V.R. Narasimha Rao, "TP Solar vs Soli-lunar Example", https://jyotish-blog.blogspot.com/2009/08/tp-solar-vs-soli-lunar-example.html (the soli-lunar re-definition; JHora\'s solar-months default checkbox).',
      'JHora features + PVR Lesson #50 (annual/monthly/daily TP; the Tithi-Aṣṭottarī pairing), https://www.vedicastrologer.org/jh/features.htm.',
      'Anthony Louis, "The Tithi Pravesh and its monthly and daily iterations", tonylouis.wordpress.com (2022).',
    ],
    notes: 'Elongation matching is ayanāṁśa-independent; the sidereal Sun-sign window uses Lahiri (flagged). The chart is cast for the birthplace, whole-sign, on the site\'s verified engine.',
  };
}

// nearest match to a target ms
function nearest(list, targetMs) {
  if (!list.length) throw new Error('tithiPravesha: no elongation match found near the window');
  return list.reduce((best, m) => Math.abs(m.instant.getTime() - targetMs) < Math.abs(best.instant.getTime() - targetMs) ? m : best);
}

// ---------------------------------------------------------------------------
//  monthlyPravesha(natalChart, fromDate, months, opts) — the MONTHLY praveśas:
//  the recurrence of the natal elongation once per (solar) month, giving the
//  successive ~29.5-day tithi-returns from fromDate. Each carries the sidereal
//  Sun sign it falls in (the solar month it belongs to).
// ---------------------------------------------------------------------------
export function monthlyPravesha(natalChart, fromDate, months = 12, opts = {}) {
  const from = fromDate instanceof Date ? fromDate : new Date(fromDate);
  const n = Math.max(1, Math.min(24, months | 0));
  const end = new Date(from.getTime() + (n + 1) * 30.6 * DAY_MS);
  const all = elongationMatchesBetween(natalChart, from, end);
  const list = all.slice(0, n).map(m => ({
    instant: m.instant, instantISO: m.instantISO, elongation: m.elongation, elongError: m.elongError,
    siderealSunSign: m.siderealSunSign, siderealSunSignIndex: m.siderealSunSignIndex, tithi: m.tithi,
  }));
  return {
    system: 'tithi-pravesha', kind: 'monthly', monthRule: 'solar',
    natal: natalTithiData(natalChart), from, count: list.length, praveshas: list,
    note: 'Monthly tithi-praveśa = the recurrence of the natal elongation once per (solar) month (~12–13 per year). Each row is the exact tithi-return instant and the sidereal sign the Sun then occupies. The chart for any one row can be cast with tithiPravesha or castVedic. ⚑ soli-lunar monthly variant not computed here.',
    citation: 'JHora / PVR Lesson #50 (monthly TP); Anthony Louis (2022).',
  };
}
