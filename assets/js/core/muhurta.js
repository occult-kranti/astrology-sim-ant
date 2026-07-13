// ============================================================================
//  muhurta.js — the MUHŪRTA engine (Indian electional astrology): the 30
//  muhūrtas of the sunrise-to-sunrise day, the three kālas (Rāhu-kāla,
//  Yamaghaṇṭa, Gulika-kāla), and the classical pañcāṅga quality screens.
//
//  PURE — no DOM, no network, no randomness; headless-testable.
//
//  DAY ARITHMETIC: everything is built on planetaryHour() from
//  planetary-hours.js, which already returns { sunrise, sunset, nextSunrise }
//  for the sunrise-bounded day containing the instant — sunrise is NEVER
//  re-derived here.
//    • 30 muhūrtas: day arc (sunrise→sunset) ÷ 15 + night arc (sunset→next
//      sunrise) ÷ 15. Boundaries are computed as sunrise + round(i·arc/15) ms,
//      so the 30 slots partition the sunrise→next-sunrise day EXACTLY (the
//      i-th slot's end IS the (i+1)-th slot's start; slot lengths differ from
//      arc/15 by at most 1 ms of rounding).
//    • kālas: day arc ÷ 8; the weekday octant index comes from the verified
//      tables in data/muhurta-data.js.
//
//  VĀRA CORRECTION (documented): castVedic(...).panchanga.vara is the CIVIL
//  UTC weekday (a flagged simplification at vedic.js:114). For muhūrta the
//  vāra — the weekday that selects the kāla octant — is the SUNRISE-BOUNDED
//  day: it begins at local sunrise and carries the weekday of the local civil
//  date of that sunrise. This module computes it itself from the sunrise
//  instant, approximating the local date by longitude (local mean time =
//  UTC + lon/15 h; no timezone database exists in a pure static module).
//  Sunrise sits ~05–07 LMT, many hours from the midnight boundary, so the
//  few-hour difference between a civil zone and LMT can never flip the
//  weekday — the approximation is exact in practice.
//
//  HONEST FRAMING (locked): the classical rules are DESCRIBED, never
//  prescribed. No muhūrta quality, kāla or pañcāṅga screen has any
//  demonstrated empirical validity.
// ============================================================================
import { planetaryHour } from './planetary-hours.js';
import { castChart } from './astro.js';
import { castVedic } from './vedic.js';
import { VARA_NAMES, VARA_LORDS } from './data/vedic-data.js';
import {
  MUHURTA_NAMES, MUHURTA_NAMES_SOURCE, ABHIJIT, BRAHMA, OCTANT_TABLES,
  TITHI_SCREEN, YOGA_SCREEN, KARANA_SCREEN, NAKSHATRA_CLASSES,
  MUHURTA_CLASSICAL_SOURCE,
} from './data/muhurta-data.js';

export const MUHURTA_CAVEAT =
  'Muhūrta is the Indian electional doctrine: it describes which stretches of the day the classical pañcāṅga '
  + 'tradition graded fit or unfit for beginnings. None of these timing qualities has any demonstrated empirical '
  + 'validity — the rules are reproduced faithfully with their sources, described, never prescribed; contested '
  + 'values are flagged with both positions, never silently resolved.';

const VARA_NOTE =
  'Sunrise-bounded vāra: the muhūrta day (and the weekday used for the kāla octant tables) runs sunrise → '
  + 'sunrise and carries the weekday of the local civil date of that sunrise — computed here from the sunrise '
  + 'instant with a longitude/15h local-mean-time approximation. This corrects the civil-UTC vāra simplification '
  + 'flagged in vedic.js (its pañcāṅga vāra can differ near midnight UTC or far from Greenwich).';

// --- internal helpers --------------------------------------------------------

// n+1 integer-millisecond boundaries dividing [startMs, endMs] into n equal
// parts. boundary(0) = start and boundary(n) = end EXACTLY; interior
// boundaries are rounded to the nearest ms, so parts differ from arc/n by
// at most 1 ms and adjacent slots share their boundary exactly.
function boundaries(startMs, endMs, n) {
  const arc = endMs - startMs, out = [];
  for (let i = 0; i <= n; i++) out.push(startMs + Math.round((i * arc) / n));
  return out;
}

// The sunrise-bounded weekday (vāra), 0=Sunday..6=Saturday: the weekday of
// the LOCAL civil date of the sunrise instant, approximated by local mean
// time (UTC + lon/15 h). See the VĀRA CORRECTION note in the header.
function sunriseWeekday(sunrise, lon) {
  return new Date(sunrise.getTime() + (lon / 15) * 3600000).getUTCDay();
}

// The sunrise-bounded day containing `date`, straight from planetaryHour —
// sunrise/sunset/nextSunrise are computed there once and reused everywhere.
function sunriseDay(date, lat, lon) {
  const ph = planetaryHour(date, lat, lon);
  if (!ph) return null;                       // polar day/night: no rise/set
  const weekday = sunriseWeekday(ph.sunrise, lon);
  return {
    sunrise: ph.sunrise, sunset: ph.sunset, nextSunrise: ph.nextSunrise,
    weekday, vara: { name: VARA_NAMES[weekday], lord: VARA_LORDS[weekday] },
  };
}

// ---------------------------------------------------------------------------
//  muhurtasOf(date, lat, lon) — the 30 muhūrtas of the sunrise-day containing
//  `date`: nos. 1–15 divide sunrise→sunset into 15, nos. 16–30 divide
//  sunset→next-sunrise into 15. Returns null in polar conditions.
// ---------------------------------------------------------------------------
export function muhurtasOf(date, lat, lon) {
  const d = sunriseDay(date, lat, lon);
  if (!d) return null;
  const dayB = boundaries(d.sunrise.getTime(), d.sunset.getTime(), 15);
  const nightB = boundaries(d.sunset.getTime(), d.nextSunrise.getTime(), 15);
  return MUHURTA_NAMES.map(rec => {
    const i = rec.num - 1, isDay = i < 15;
    const start = isDay ? dayB[i] : nightB[i - 15];
    const end = isDay ? dayB[i + 1] : nightB[i - 14];
    const m = {
      num: rec.num, name: rec.name, quality: rec.quality, cite: rec.cite,
      start: new Date(start), end: new Date(end), isDay,
      isAbhijit: rec.num === ABHIJIT.dayMuhurta,
      isBrahma: rec.num === BRAHMA.overallMuhurta,
    };
    if (rec.variants) m.variants = rec.variants;
    if (rec.condition) m.condition = rec.condition;
    if (rec.contested) m.contested = rec.contested;
    return m;
  });
}

// ---------------------------------------------------------------------------
//  kalas(date, lat, lon) — Rāhu-kāla, Yamaghaṇṭa & Gulika-kāla for the
//  sunrise-day containing `date`: day arc ÷ 8, the octant picked by the
//  SUNRISE-BOUNDED weekday from the verified tables (DAY tables only).
// ---------------------------------------------------------------------------
export function kalas(date, lat, lon) {
  const d = sunriseDay(date, lat, lon);
  if (!d) return null;
  const b = boundaries(d.sunrise.getTime(), d.sunset.getTime(), 8);
  const mk = key => {
    const k = OCTANT_TABLES[key][d.weekday];
    return { start: new Date(b[k - 1]), end: new Date(b[k]), octant: k, cite: OCTANT_TABLES.cites[key] };
  };
  return {
    rahu: mk('rahu'), yama: mk('yama'), gulika: mk('gulika'),
    weekday: d.weekday, vara: d.vara,
    sunrise: d.sunrise, sunset: d.sunset,
    note: OCTANT_TABLES.note, varaNote: VARA_NOTE,
  };
}

// ---------------------------------------------------------------------------
//  panchangaScreens(vedicPanchanga) — the classical quality verdicts for a
//  pañcāṅga snapshot (the object castVedic(chart).panchanga returns:
//  { tithi:{num,name,paksha}, nakshatra:{num,…}, yoga:{num,name},
//    karana:{num,name}, vara:{…} }). Verdicts are the TRADITION'S — each
//  carries its citation. The snapshot is instantaneous: limb end-times are
//  not computed, so opening-ghaṭī rules are stated, not clocked.
// ---------------------------------------------------------------------------
export function panchangaScreens(p) {
  if (!p || !p.tithi || !p.yoga || !p.karana || !p.nakshatra) return null;
  const out = {};

  // — tithi: fivefold Nandā…Pūrṇā cycle within the paksha; amāvāsyā override —
  const within = ((p.tithi.num - 1) % 15) + 1;                  // 1..15 in-paksha
  const g = TITHI_SCREEN.groups[(within - 1) % 5];
  const amavasya = p.tithi.num === 30;
  out.tithi = {
    limb: 'Tithi', value: `${p.tithi.num} — ${p.tithi.name}, ${p.tithi.paksha}`,
    class: g.name + (amavasya ? ' (amāvāsyā)' : ''), meaning: g.meaning,
    verdict: amavasya ? TITHI_SCREEN.amavasya.verdict : g.verdict,
    detail: amavasya ? TITHI_SCREEN.amavasya.detail : g.detail,
    cite: amavasya ? TITHI_SCREEN.amavasya.cite : g.cite,
  };

  // — yoga: the nine avoided nitya-yogas, tiered whole vs opening ghaṭīs —
  const y = YOGA_SCREEN.avoid.find(e => e.num === p.yoga.num);
  out.yoga = y ? {
    limb: 'Yoga', value: `${p.yoga.num} — ${p.yoga.name}`,
    class: y.scope === 'whole' ? 'mahā-doṣa (whole duration)' : 'avoided (opening portion)',
    verdict: 'avoid',
    detail: y.scope === 'whole'
      ? 'one of the two mahā-doṣa yogas — classically avoided for its WHOLE duration'
      : (y.detail || `classically the opening ${y.ghatis} ghaṭīs (${y.ghatis * 24} min from the yoga's start) are avoided`)
        + '; variant — some authorities avoid the whole yoga',
    cite: y.cite,
  } : {
    limb: 'Yoga', value: `${p.yoga.num} — ${p.yoga.name}`,
    class: 'not in the avoid-list', verdict: 'neutral',
    detail: 'not among the nine classically avoided nitya-yogas',
    cite: YOGA_SCREEN.cite,
  };

  // — karaṇa: Viṣṭi (Bhadrā) is the standard avoid —
  const isVishti = p.karana.name === KARANA_SCREEN.avoid.name;
  out.karana = isVishti ? {
    limb: 'Karaṇa', value: `${p.karana.num} — ${p.karana.name} (${KARANA_SCREEN.avoid.alias})`,
    class: 'Viṣṭi / Bhadrā', verdict: KARANA_SCREEN.avoid.verdict,
    detail: KARANA_SCREEN.avoid.detail, cite: KARANA_SCREEN.avoid.cite,
  } : {
    limb: 'Karaṇa', value: `${p.karana.num} — ${p.karana.name}`,
    class: 'not Viṣṭi', verdict: 'neutral',
    detail: 'not the avoided Viṣṭi (Bhadrā) karaṇa', cite: KARANA_SCREEN.cite,
  };

  // — nakṣatra: the sevenfold Muhūrta-Cintāmaṇi classification —
  const cls = NAKSHATRA_CLASSES.find(c => c.members.some(m => m.num === p.nakshatra.num));
  out.nakshatra = cls ? {
    limb: 'Nakṣatra',
    value: `${p.nakshatra.num} — ${p.nakshatra.sanskrit || p.nakshatra.name}`,
    class: `${cls.name} ("${cls.meaning}")`, verdict: cls.verdict,
    detail: cls.uses + (cls.weekday ? ` — held strongest on ${cls.weekday}` : ''),
    cite: cls.cite,
  } : {
    limb: 'Nakṣatra',
    value: `${p.nakshatra.num} — ${p.nakshatra.sanskrit || p.nakshatra.name}`,
    class: 'unclassified', verdict: 'neutral',
    detail: 'not found in the sevenfold classification (data error — every one of the 27 should match)',
    cite: NAKSHATRA_CLASSES[0].cite,
  };

  return out;
}

// ---------------------------------------------------------------------------
//  muhurtaReport(date, lat, lon) — the full composed reading: the 30 muhūrtas,
//  the three kālas, the sunrise-bounded vāra, the pañcāṅga snapshot & screens,
//  Abhijit & Brāhma, the honest caveat and every citation.
// ---------------------------------------------------------------------------
export function muhurtaReport(date, lat, lon) {
  const d = sunriseDay(date, lat, lon);
  if (!d) {
    return { system: 'muhurta', error: 'No sunrise/sunset could be computed for this latitude and date (polar day or night) — the muhūrta day-division is undefined there.', caveat: MUHURTA_CAVEAT };
  }
  const muhurtas = muhurtasOf(date, lat, lon);
  const k = kalas(date, lat, lon);
  const chart = castChart(date, lat, lon, 'whole');
  const vedic = castVedic(chart);
  const screens = panchangaScreens(vedic.panchanga);
  const current = muhurtas.find(m => date >= m.start && date < m.end) || null;

  const abhijitSlot = muhurtas[ABHIJIT.dayMuhurta - 1];
  const brahmaSlot = muhurtas[BRAHMA.overallMuhurta - 1];
  // the contested weekday exception, applied descriptively to TODAY's vāra
  let todayException = null;
  if (d.weekday === 3) {
    todayException = 'Today is Wednesday: drikpanchang rules Abhijit malefic on Wednesdays — but the table sources except Mondays and Fridays instead (contested; both positions kept).';
  } else if (d.weekday === 1 || d.weekday === 5) {
    todayException = `Today is ${d.weekday === 1 ? 'Monday' : 'Friday'}: the Wikipedia/VEDA table excepts muhūrta 8 on Mondays and Fridays — but drikpanchang instead excepts Wednesday (contested; both positions kept).`;
  }

  return {
    system: 'muhurta',
    instant: date, place: { lat, lon },
    sunrise: d.sunrise, sunset: d.sunset, nextSunrise: d.nextSunrise,
    dayArcMs: d.sunset - d.sunrise, nightArcMs: d.nextSunrise - d.sunset,
    vara: {
      weekday: d.weekday, name: d.vara.name, lord: d.vara.lord,
      note: VARA_NOTE,
      civilUTCVara: vedic.panchanga.vara.name,
      differsFromCivilUTC: vedic.panchanga.vara.name !== d.vara.name,
    },
    muhurtas, current, kalas: k,
    abhijit: {
      ...abhijitSlot,
      midpoint: new Date(Math.round((abhijitSlot.start.getTime() + abhijitSlot.end.getTime()) / 2)),
      rule: ABHIJIT.rule, tradition: ABHIJIT.tradition,
      contested: ABHIJIT.contested, todayException, cite: ABHIJIT.cite,
    },
    brahma: { ...brahmaSlot, rule: BRAHMA.rule, cite: BRAHMA.cite },
    panchanga: vedic.panchanga, screens,
    ayanamsa: vedic.ayanamsa, ayanamsaName: vedic.ayanamsaName,
    notes: [
      VARA_NOTE,
      'The pañcāṅga is an instantaneous snapshot at the chosen moment — limb end-times are not computed, so the tithi/yoga/karaṇa/nakṣatra may change within the day.',
      OCTANT_TABLES.note,
    ],
    caveat: MUHURTA_CAVEAT,
    citations: [
      MUHURTA_NAMES_SOURCE, ABHIJIT.cite, BRAHMA.cite,
      OCTANT_TABLES.cites.rahu, OCTANT_TABLES.cites.yama, OCTANT_TABLES.cites.gulika,
      TITHI_SCREEN.cite, YOGA_SCREEN.cite, KARANA_SCREEN.cite, NAKSHATRA_CLASSES[0].cite,
      MUHURTA_CLASSICAL_SOURCE,
    ],
  };
}

// ---------------------------------------------------------------------------
//  scanDay(date, lat, lon) — the day's timeline for rendering: all 30 muhūrtas
//  with the three kālas overlaid (each row lists which kālas intersect it;
//  the kālas live inside the day arc, so only rows 1–15 can be marked).
// ---------------------------------------------------------------------------
export function scanDay(date, lat, lon) {
  const muhurtas = muhurtasOf(date, lat, lon);
  if (!muhurtas) return null;
  const k = kalas(date, lat, lon);
  const overlaps = (m, w) => m.start < w.end && w.start < m.end;
  const KALA_LABELS = { rahu: 'Rāhu-kāla', yama: 'Yamaghaṇṭa', gulika: 'Gulika-kāla' };
  const rows = muhurtas.map(m => ({
    ...m,
    kalas: ['rahu', 'yama', 'gulika'].filter(key => overlaps(m, k[key])).map(key => KALA_LABELS[key]),
  }));
  return {
    rows, kalas: k,
    sunrise: k.sunrise, sunset: k.sunset, nextSunrise: muhurtas[29].end,
    weekday: k.weekday, vara: k.vara,
    caveat: MUHURTA_CAVEAT,
  };
}
