// ============================================================================
//  vedic-hora.js — the jyotiṣa HORĀ.
//
//  PURE: no DOM, no network, no RNG, no Date. The caller supplies the instant.
//
//  THE CONVERGENCE, AND WHY IT IS A SOURCED CLAIM AND NOT AN INFERENCE.
//  The horā is the same arithmetic as the Western planetary hour: the day
//  divided in twelve from sunrise to sunset and the night in twelve from sunset
//  to sunrise, the grahas taken in descending order (Saturn · Jupiter · Mars ·
//  Sun · Venus · Mercury · Moon), and the first horā of each day ruled by that
//  weekday's lord.
//
//  It would be easy — and wrong — to assert that from the shape alone. The
//  claim is carried because a source states it: al-Bīrūnī, writing c. AD 1030
//  and reporting Indian practice, says the dominants are arranged according to
//  the HORÆ TEMPORALES, that each day and each night has twelve hours, and that
//  the hours used in the theory of the dominants are horæ obliquæ temporales.
//  That is the seasonal-hour definition, stated of the Indian system, by a
//  witness to it.
//
//  So this module does NOT re-implement the division. It calls the existing
//  planetary-hours engine and re-labels the result, because computing the same
//  arithmetic twice would let the two drift apart and invent a difference the
//  sources do not report. Where the traditions genuinely diverge — and on the
//  materia they diverge completely — that lives elsewhere.
//
//  DAY START: sunrise, for both systems, with the civil (sāvana) day running
//  sunrise to sunrise — Sūrya Siddhānta, and al-Bīrūnī quoting Vijayanandin's
//  Karaṇatilaka.
//
//  Source dossier: research/horae/v2/vedic-hora-choghadiya.json (Tier A for the
//  horā; its Choghadiya layer is Tier C and is NOT implemented here).
// ============================================================================

import { hoursTable, planetaryHour } from './planetary-hours.js';

/** The grahas in descending order — the order the sources give. */
export const HORA_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

/** Devanāgarī / IAST names, for display beside the English. */
export const GRAHA = {
  Saturn: { iast: 'Śani', dev: 'शनि' },
  Jupiter: { iast: 'Guru (Bṛhaspati)', dev: 'गुरु' },
  Mars: { iast: 'Maṅgala', dev: 'मङ्गल' },
  Sun: { iast: 'Sūrya (Ravi)', dev: 'सूर्य' },
  Venus: { iast: 'Śukra', dev: 'शुक्र' },
  Mercury: { iast: 'Budha', dev: 'बुध' },
  Moon: { iast: 'Candra (Soma)', dev: 'चन्द्र' },
};

export const HORA_SOURCE =
  'al-Bīrūnī, Kitāb fī taḥqīq mā li-l-Hind (c. AD 1030), tr. Sachau 1910 — the dominants are '
  + 'arranged according to the horæ temporales; each day and each night has twelve hours; the hours '
  + 'used in the theory of the dominants are horæ obliquæ temporales. Day-start (sunrise, civil '
  + 'sāvana reckoning): Sūrya Siddhānta, and al-Bīrūnī quoting Vijayanandin\'s Karaṇatilaka.';

export const HORA_CONVERGENCE =
  'The horā and the Western planetary hour are the SAME arithmetic — seasonal hours, twelve by day '
  + 'and twelve by night from sunrise, grahas in descending order, the weekday\'s lord opening the '
  + 'day. This site states that because al-Bīrūnī states it of the Indian system, not because the '
  + 'two tables happen to look alike.';

/**
 * The horā covering `instant` at a place, or null where no sunrise/sunset
 * bounds the day (the seasonal division is undefined there, not merely
 * unavailable — say so rather than falling back to clock hours).
 */
export function vedicHora(instant, lat, lon) {
  // USE planetaryHour, NOT hoursTable. hoursTable anchors its 24-hour window on
  // the instant's UTC CALENDAR DATE, so at far-east longitudes the window can
  // fail to contain the instant at all — Sydney at 2026-05-05T11:30Z (21:30
  // local) fell straight through it and returned null. planetaryHour does the
  // day-boundary branching properly. Found by the test, not by a reader.
  const h = planetaryHour(instant, lat, lon);
  if (!h || !h.ruler) return null;

  const g = GRAHA[h.ruler] || null;
  const perHalf = h.hourNumber != null ? (((h.hourNumber - 1) % 12) + 1) : null;
  return {
    graha: h.ruler,
    iast: g ? g.iast : null,
    devanagari: g ? g.dev : null,
    night: Boolean(h.isNight),
    indexInHalf: perHalf,
    hourLengthMinutes: h.hourLengthMinutes ?? null,
    sunrise: h.sunrise ?? null,
    sunset: h.sunset ?? null,
    dayLord: h.dayRuler || null,
    tier: 'A',
    source: HORA_SOURCE,
    convergence: HORA_CONVERGENCE,
    // Stated so no caller mistakes silence for absence of a materia tradition.
    materia: null,
    materiaNote: 'No Indian incense/materia table is carried by this repo. It is not asserted here '
      + 'from general knowledge; it needs its own sourced round.',
  };
}

/** The full 24 horās of the day containing `instant`, in order. */
export function horaTable(instant, lat, lon) {
  const t = hoursTable(instant, lat, lon);
  if (!t || !Array.isArray(t.rows) || !t.rows.length) return null;
  return {
    dayLord: t.dayRuler || null,
    sunrise: t.sunrise, sunset: t.sunset, nextRise: t.nextRise,
    tier: 'A',
    source: HORA_SOURCE,
    rows: t.rows.map((r, i) => ({
      n: i + 1,
      graha: r.ruler,
      iast: (GRAHA[r.ruler] || {}).iast || null,
      night: Boolean(r.night),
      indexInHalf: (i % 12) + 1,
      start: new Date(r.start),
      end: new Date(i < t.rows.length - 1 ? t.rows[i + 1].start : t.nextRise),
    })),
  };
}
