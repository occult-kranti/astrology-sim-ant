// ============================================================================
//  releasing.js — ZODIACAL RELEASING (Valens, Anthology IV.4–IV.10, trans.
//  M. Riley): the Hellenistic time-lord technique that "releases" periods
//  through the signs from the Lot of Spirit (Daimon — employment, rank,
//  action/career) or the Lot of Fortune (the body, health, injuries).
//
//  SIGN PERIODS = the ruler's MINOR YEARS (Valens IV.6):
//    Aries 15 · Taurus 8 · Gemini 20 · Cancer 25 · Leo 19 · Virgo 20 ·
//    Libra 8 · Scorpio 15 · Sagittarius 12 · CAPRICORN 27 · Aquarius 30 ·
//    Pisces 12.        (Sum of all twelve = 211.)
//  CAPRICORN IS 27, NOT 30 — Valens IV.6 derives it as half of half of the
//  Moon's 108-year maximum, Capricorn being the sign opposite Cancer.
//  Encoding 30 would be wrong.
//
//  TIME UNITS (Valens IV.9–IV.10): the distribution YEAR = 360 days ("the
//  universal year has 365¼ days, while the year with respect to the
//  distribution has 360" — IV.9); each level is 1/12 of the one above:
//    L1 = number × 360 days · L2 = number × 30 days · L3 = number × 2.5 days ·
//    L4 = number × 5 hours.
//  Valens's own table (IV.10): Mars 15 → 37½d / 3d3h; Sun 19 → 47½d / 3d23h;
//  Moon 25 → 62½d / 5d5h; Saturn 30 → 75d / 6d6h; Capricorn 27 → 67½d / 5d15h;
//  Jupiter 12 → 30d / 2d12h; Venus 8 → 20d / 1d16h; Mercury 20 → 50d / 4d4h.
//  C. Brennan (Hellenistic Astrology, 2017; Astrology Podcast ep. 192)
//  confirms the 360-day-year / 30-day-month convention as the modern standard.
//  360-day years mean L1 boundaries DRIFT against calendar years: a Cancer L1
//  beginning 2012-01-01 ends 25 × 360 = 9000 real days later on 2036-08-22,
//  not 2037-01-01 (T. Louis's worked example; asserted in the engine test).
//
//  PROCEDURE (Valens IV.4–IV.5): L1 starts from the WHOLE SIGN holding the
//  chosen Lot (the degree is irrelevant); the first period IS that sign,
//  lasting its number of 360-day years; subsequent periods follow in
//  zodiacal order. Each L2 cycle starts from its parent L1 sign (the first
//  sub-period = the sign itself), proceeds zodiacally, truncated at the
//  parent's end. LOOSING OF THE BOND (R. Schmidt's term): when a subdivision
//  completes all 12 signs and would repeat its start sign — the 13th
//  sub-period — it JUMPS TO THE OPPOSITE SIGN instead and continues
//  zodiacally (Valens IV.4 annotation: "We're back to Gemini so jump to its
//  opposite sign, Sagittarius"). One full L2 cycle = 211 months = 17y 7m of
//  360-day time, so loosing occurs only inside L1 signs whose number ≥ 19:
//  Gemini, Cancer, Leo, Virgo, Capricorn, Aquarius.
//
//  DOCTRINAL NOTE, NOT IMPLEMENTED: Valens IV.4 — Fortune distributes the
//  bodily matters, Daimon/Spirit the matters of action and rank; and "if the
//  Lot of Fortune or its ruler are badly situated, the Lot of Daimon will
//  distribute both", and vice versa. That chart-condition swap rule is
//  recorded here in-data; this module computes both releasings and leaves
//  the judgement to the reader.
//
//  CITATIONS: Valens, Anthologies IV.4 ("The Distribution of the
//  Chronocratorships Starting with the Lot of Fortune and with Daimon"),
//  IV.6, IV.9, IV.10, trans. M. Riley (free PDF, csus.edu; annotated ed.
//  github.com/janegca/latex-valens); C. Brennan, Hellenistic Astrology (2017)
//  and Astrology Podcast ep. 192 (the modern 360-day/30-day standard);
//  "loosing of the bond" is Robert Schmidt's term.
//
//  HONEST FRAMING: a 2nd-century period-lord scheme with no demonstrated
//  validity — described, never prescribed.
//
//  PURE — no DOM, no network, no randomness; dates are passed in.
// ============================================================================
import { SIGNS } from './astro.js';

// Sign periods (the ruler's minor years), Aries → Pisces. Sum = 211.
// Capricorn = 27 (Valens IV.6: half of half of the Moon's 108), NOT 30.
export const SIGN_PERIODS = [15, 8, 20, 25, 19, 20, 8, 15, 12, 27, 30, 12];

// Sum of the twelve sign periods — one full 12-sign cycle (211 units).
export const PERIOD_SUM = SIGN_PERIODS.reduce((a, b) => a + b, 0);

// Time units (Valens IV.9–IV.10): each level is 1/12 of the one above.
export const YEAR_DAYS = 360;       // L1 unit: the distribution year
export const MONTH_DAYS = 30;       // L2 unit: the distribution month
export const L3_UNIT_DAYS = 2.5;    // L3 unit
export const L4_UNIT_HOURS = 5;     // L4 unit

// Sign indexes where loosing of the bond can occur inside an L1 (number ≥ 19,
// since a full L2 cycle = 211 months = 17y 7m of 360-day time): Gemini,
// Cancer, Leo, Virgo, Capricorn, Aquarius. Derived, not hardcoded.
export const LOOSING_L1_SIGNS = SIGN_PERIODS
  .map((n, i) => ({ n, i })).filter(x => x.n >= 19).map(x => x.i);

export const RELEASING_CITATION =
  'Valens, Anthologies IV.4 ("The Distribution of the Chronocratorships Starting with the Lot of Fortune and '
  + 'with Daimon" — Fortune = body/health, Spirit/Daimon = employment, rank, action), IV.6 (sign years; '
  + 'Capricorn 27 as half of half of the Moon\'s 108), IV.9 (the 360-day distribution year), IV.10 (the '
  + 'years→months→days→hours table), trans. M. Riley (free PDF, csus.edu). C. Brennan, Hellenistic Astrology '
  + '(2017) & Astrology Podcast ep. 192 — the modern 360-day/30-day implementation standard. "Loosing of the '
  + 'bond" is R. Schmidt\'s term.';

export const RELEASING_NOTES = {
  lots:
    'Releasing from the Lot of SPIRIT (Daimon) reads employment, rank and action (career); from the Lot of '
    + 'FORTUNE, the body and health. The L1 start sign is the WHOLE SIGN holding the Lot — its degree is '
    + 'irrelevant (Valens IV.4).',
  swapRule:
    'DOCTRINAL NOTE, not implemented here: Valens IV.4 — "if the Lot of Fortune or its ruler are badly '
    + 'situated, the Lot of Daimon will distribute both the bodily and the active qualities", and vice versa. '
    + 'This tool computes both releasings and leaves that chart-condition judgement to the reader.',
  yearLength:
    'All periods use Valens\'s 360-day distribution year and 30-day month (IV.9–IV.10; the modern standard '
    + 'per Brennan), so period boundaries drift against calendar years — e.g. a Cancer L1 beginning '
    + '2012-01-01 ends 9000 real days later on 2036-08-22, not 2037-01-01.',
  loosing:
    'LOOSING OF THE BOND (Schmidt\'s term): when a subdivision completes all 12 signs and would repeat its '
    + 'start sign, the 13th sub-period jumps to the OPPOSITE sign and continues zodiacally. It can only occur '
    + 'inside L1 signs with number ≥ 19: Gemini, Cancer, Leo, Virgo, Capricorn, Aquarius.',
};

// ---------------------------------------------------------------------------
//  Valens's IV.10 unit table, computed from the constants: for each sign,
//  the L1/L2/L3/L4 durations (L4 also split into whole days + hours, matching
//  the "3d3h" style of the Anthology's table).
// ---------------------------------------------------------------------------
export function unitTable() {
  return SIGN_PERIODS.map((n, i) => ({
    signIndex: i, sign: SIGNS[i], number: n,
    l1Years: n, l1Days: n * YEAR_DAYS,
    l2Months: n, l2Days: n * MONTH_DAYS,
    l3Days: n * L3_UNIT_DAYS,
    l4Hours: n * L4_UNIT_HOURS,
    l4: { days: Math.floor((n * L4_UNIT_HOURS) / 24), hours: (n * L4_UNIT_HOURS) % 24 },
  }));
}

// ---------------------------------------------------------------------------
//  distributionAge(birthDate, onDate) — real days lived, converted to
//  360-day distribution years (Valens IV.9; his own check: 11,903 days
//  = 33 years + 23 days). → { totalDays, years, days }
// ---------------------------------------------------------------------------
export function distributionAge(birthDate, onDate) {
  const totalDays = (onDate.getTime() - birthDate.getTime()) / 86400000;
  const years = Math.floor(totalDays / YEAR_DAYS);
  return { totalDays, years, days: totalDays - years * YEAR_DAYS };
}

// ---------------------------------------------------------------------------
//  zodiacalReleasing(lotSignIndex, birthDate, opts?)
//  lotSignIndex: 0 = Aries … 11 = Pisces (the whole sign holding the Lot).
//  opts.maxYears: real calendar years of life to cover (default 100).
//  → { lotSignIndex, lotSign, l1: [{ signIndex, sign, years, startDay,
//       endDay, startDate, endDate, loosed,
//       l2: [{ signIndex, sign, months, startDay, endDay, startDate, endDate,
//              loosed, truncated }] }], … }
//  Days count real 86 400 000-ms days from birth; dates = birth + days.
// ---------------------------------------------------------------------------
export function zodiacalReleasing(lotSignIndex, birthDate, opts = {}) {
  const maxYears = opts.maxYears != null ? opts.maxYears : 100;
  const maxDays = maxYears * 365.25;              // cover real years of life
  const birthMs = birthDate.getTime();
  const mkDate = d => new Date(birthMs + d * 86400000);
  const EPS = 1e-9;

  const l1 = [];
  let day = 0;
  // L1 walk gets the same generic loosing counter as L2 for correctness,
  // though a full L1 cycle (211 × 360 d ≈ 208 real years) exceeds any life.
  let sign = lotSignIndex, count = 0, cycleStart = lotSignIndex, nextLoosed = false;
  while (day < maxDays) {
    const years = SIGN_PERIODS[sign];
    const start = day, end = day + years * YEAR_DAYS;

    // --- L2 sub-periods: start from the parent's own sign, zodiacal order,
    //     loosing of the bond on the 13th, truncated at the parent's end.
    const l2 = [];
    let d2 = start, s2 = sign, c2 = 0, cyc2 = sign, loose2 = false;
    while (d2 < end - EPS) {
      const months = SIGN_PERIODS[s2];
      const full = d2 + months * MONTH_DAYS;
      const pEnd = Math.min(full, end);
      l2.push({
        signIndex: s2, sign: SIGNS[s2], months,
        startDay: d2, endDay: pEnd, startDate: mkDate(d2), endDate: mkDate(pEnd),
        loosed: loose2, truncated: pEnd < full - EPS,
      });
      d2 = full;
      c2++;
      if (c2 === 12) { s2 = (cyc2 + 6) % 12; cyc2 = s2; c2 = 0; loose2 = true; }
      else { s2 = (s2 + 1) % 12; loose2 = false; }
    }

    l1.push({
      signIndex: sign, sign: SIGNS[sign], years,
      startDay: start, endDay: end, startDate: mkDate(start), endDate: mkDate(end),
      loosed: nextLoosed, l2,
    });

    day = end;
    count++;
    if (count === 12) { sign = (cycleStart + 6) % 12; cycleStart = sign; count = 0; nextLoosed = true; }
    else { sign = (sign + 1) % 12; nextLoosed = false; }
  }

  return {
    lotSignIndex, lotSign: SIGNS[lotSignIndex], maxYears,
    yearDays: YEAR_DAYS, monthDays: MONTH_DAYS,
    l1, notes: RELEASING_NOTES, citation: RELEASING_CITATION,
  };
}

// ---------------------------------------------------------------------------
//  currentReleasing(result, birthDate, onDate) — the running L1 & L2 periods
//  at a real date. → { daysLived, distributionAge, l1, l2 }
// ---------------------------------------------------------------------------
export function currentReleasing(result, birthDate, onDate) {
  const daysLived = (onDate.getTime() - birthDate.getTime()) / 86400000;
  const p1 = result.l1.find(p => daysLived >= p.startDay && daysLived < p.endDay) || null;
  const p2 = p1 ? (p1.l2.find(p => daysLived >= p.startDay && daysLived < p.endDay) || null) : null;
  return { daysLived, distributionAge: distributionAge(birthDate, onDate), l1: p1, l2: p2 };
}
