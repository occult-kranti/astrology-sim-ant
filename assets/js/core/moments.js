// ============================================================================
//  moments.js — the CROSS-SYSTEM MOMENT SCANNER: one time-range scan showing
//  EACH tradition's verdict on the same sky, side by side — compared, never
//  merged. This module introduces NO new data or doctrine: it only COMPOSES
//  engines that already exist and are verified —
//    • election.js        — electionScore(): the Lilly/Picatrix electional
//                           verdict (green/amber/red) for one catalogued aim;
//    • planetary-hours.js — planetaryHour(): the Chaldean hour & day ruler;
//    • muhurta.js         — muhurtasOf() / kalas(): the 30-muhūrta sunrise-day
//                           and the three avoided kālas; panchangaScreens():
//                           the classical pañcāṅga quality verdicts;
//    • vedic.js           — castVedic(): the sidereal pañcāṅga snapshot;
//    • astro.js           — castChart(): the underlying astronomy.
//
//  PURE — dates in, data out; no DOM, no network, no randomness.
//
//  PERFORMANCE (profiled 2026-07 with node on this machine, London, 30-min
//  steps): castChart ≈0.5 ms, electionScore ≈0.1 ms, planetaryHour ≈0.3 ms,
//  castVedic+panchangaScreens ≈0.4 ms, muhurtasOf+kalas ≈0.5 ms per call.
//  Choices made from those numbers:
//    • muhurtasOf/kalas are computed ONCE per sunrise-day and cached — every
//      step inside that day reuses the same 30 slots and 3 kālas (they are
//      properties of the day, not of the step);
//    • the pañcāṅga is computed PER STEP (not per hour): castVedic proved
//      cheap enough (≈0.4 ms) that a full 168 h/30 min scan costs well under
//      a second, so no per-hour reuse (and its boundary blurring) is needed;
//    • ONE chart is cast per step (Regiomontanus, the election engine's
//      default) and fed to BOTH electionScore and castVedic — castVedic reads
//      only planet longitudes, the ascendant and the date, none of which
//      depend on the house system, so its pañcāṅga is bit-identical to a
//      whole-sign cast (asserted in the headless smoke test);
//    • planetaryHour is computed once per step and passed into electionScore
//      via opts.planetaryHour so it is never recomputed.
//
//  HONEST FRAMING (locked): the columns are separate historical rulebooks;
//  agreement between them means nothing more than a coincidence of
//  conventions. Described, never prescribed — no demonstrated validity.
// ============================================================================
import { castChart } from './astro.js';
import { electionScore, operationByKey, OPERATIONS } from './election.js';
import { planetaryHour } from './planetary-hours.js';
import { muhurtasOf, kalas, panchangaScreens } from './muhurta.js';
import { castVedic } from './vedic.js';

export const MOMENTS_CAVEAT =
  'The columns of this scan are SEPARATE historical rulebooks — the Lilly/Picatrix election, the Chaldean '
  + 'planetary hours, and the Indian muhūrta, kāla and pañcāṅga screens — computed side by side on the same sky '
  + 'and compared, never merged. Agreement between them means nothing more than a coincidence of conventions, '
  + 'and disagreement is the norm; none of these gradings has any demonstrated empirical validity. '
  + 'Described, never prescribed.';

// The catalogued aim used when none is given. The catalogue (election.js
// OPERATIONS) has no generic 'talisman' aim — its keys are the eleven named
// works (love … endings) — so 'talisman' is honoured only if it ever appears
// in the catalogue; otherwise the first catalogued aim stands in.
export const DEFAULT_OPERATION_KEY = operationByKey('talisman') ? 'talisman' : OPERATIONS[0].key;

export const MAX_HOURS_AHEAD = 168;                       // one week — hard cap

const KALA_KEYS = ['rahu', 'yama', 'gulika'];
const inSpan = (t, span) => t >= span.start && t < span.end;

// The sunrise-day cache entry for the day containing `t` (or null in polar
// conditions, where the muhūrta day-division is undefined).
function dayFor(t, lat, lon) {
  const m = muhurtasOf(t, lat, lon);
  if (!m) return { muhurtas: null, kalas: null, start: t.getTime(), until: t.getTime() + 1 };
  return { muhurtas: m, kalas: kalas(t, lat, lon), start: m[0].start.getTime(), until: m[29].end.getTime() };
}

// ---------------------------------------------------------------------------
//  scanMoments(fromDate, hoursAhead, lat, lon, opts) — the headline. Steps
//  from `fromDate` to `fromDate + hoursAhead` (capped at 168 h) in
//  `opts.stepMinutes` (default 30) strides and, at every step, records what
//  EACH tradition says about that instant:
//    rows: [{ time,
//             lilly:    { verdict, score, topReason },      — election.js
//             hour:     { ruler, isNight },                 — planetary-hours.js
//             muhurta:  { num, name, quality, isAbhijit, isBrahma, contested },
//             kala:     null | 'rahu' | 'yama' | 'gulika',  — muhurta.js
//             panchanga:{ tithi, nakshatra, yogaVerdicts } }] — vedic.js + screens
//    meta: { operation, from, to, stepMinutes, place, caveat, notes }
//  In polar conditions (no sunrise/sunset) muhurta and kala are null and a
//  note is added; the other columns still compute.
// ---------------------------------------------------------------------------
export function scanMoments(fromDate, hoursAhead, lat, lon, opts = {}) {
  const opKey = opts.operationKey || DEFAULT_OPERATION_KEY;
  const op = operationByKey(opKey);
  if (!op) throw new Error(`unknown operation: ${opKey}`);
  const hours = Math.min(MAX_HOURS_AHEAD, Math.max(0, Number(hoursAhead) || 0)) || 24;
  const stepMin = Math.max(1, Number(opts.stepMinutes) || 30);
  const from = new Date(fromDate.getTime());
  const steps = Math.round((hours * 60) / stepMin);

  const rows = [];
  let day = null;                                          // sunrise-day cache
  let polar = false;

  for (let i = 0; i <= steps; i++) {
    const t = new Date(from.getTime() + i * stepMin * 60000);
    const tm = t.getTime();

    // — the sunrise-day (30 muhūrtas + 3 kālas), computed once per day —
    if (!day || tm >= day.until || tm < day.start) day = dayFor(t, lat, lon);
    let muhurta = null, kala = null;
    if (day.muhurtas) {
      const m = day.muhurtas.find(s => inSpan(t, s));
      if (m) muhurta = { num: m.num, name: m.name, quality: m.quality, isAbhijit: m.isAbhijit, isBrahma: m.isBrahma, contested: !!m.contested };
      const k = KALA_KEYS.find(key => inSpan(t, day.kalas[key]));
      kala = k || null;
    } else polar = true;

    // — one chart per step, shared by the Western and the sidereal engines —
    const ph = planetaryHour(t, lat, lon);
    const hour = ph ? { ruler: ph.ruler, isNight: ph.isNight } : null;
    const chart = castChart(t, lat, lon, 'regiomontanus');

    const es = electionScore(chart, op.key, { ...opts, planetaryHour: ph });
    const lilly = {
      verdict: es.verdict, score: es.score,
      topReason: es.reasons.length ? es.reasons[0].text : '',   // reasons come worst-first
    };

    const p = castVedic(chart).panchanga;                  // house-system-independent (see header)
    const s = panchangaScreens(p);
    const panchanga = {
      tithi: `${p.tithi.num} — ${p.tithi.name}`,
      nakshatra: `${p.nakshatra.num} — ${p.nakshatra.sanskrit || p.nakshatra.name}`,
      yogaVerdicts: {
        tithi: s.tithi.verdict, yoga: s.yoga.verdict,
        karana: s.karana.verdict, nakshatra: s.nakshatra.verdict,
        summary: `tithi ${s.tithi.verdict} · yoga ${s.yoga.verdict} · karaṇa ${s.karana.verdict} · nakṣatra ${s.nakshatra.verdict}`,
      },
    };

    rows.push({ time: t, lilly, hour, muhurta, kala, panchanga });
  }

  const notes = [
    'The pañcāṅga is an instantaneous snapshot at each step — limb end-times are not clocked, so a limb can change between steps.',
    'Muhūrtas and kālas are properties of the sunrise-bounded day and are computed once per day; the kālas live inside the daylight arc only.',
  ];
  if (polar) notes.push('No sunrise/sunset could be computed for part of this range (polar day or night) — the muhūrta and kāla columns are blank there.');

  return {
    rows,
    meta: {
      operation: { key: op.key, label: op.label, ruler: op.ruler, polarity: op.polarity },
      from, to: new Date(from.getTime() + steps * stepMin * 60000),
      stepMinutes: stepMin, place: { lat, lon },
      caveat: MOMENTS_CAVEAT, notes,
    },
  };
}
