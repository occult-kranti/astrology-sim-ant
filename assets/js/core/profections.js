// ============================================================================
//  profections.js — Annual & monthly PROFECTIONS, the traditional time-lord
//  technique for natal timing. Each completed year of life advances the
//  Ascendant forward one whole sign; the domicile ruler of the profected sign
//  becomes the "Lord of the Year" (annual time-lord) whose natal condition
//  colours the themes and fortunes of that year.
//
//  Sources:
//   • Traditional Hellenistic / Perso-Arabic profections (ennea­decaeteris-free
//     whole-sign advance: year 0 = the natal Ascendant sign / 1st house,
//     completing a full circuit every 12 years). See Vettius Valens, Anthology
//     Bk IV; Abū Maʿshar; cross-checked vs Hellenistic-tradition transcriptions.
//   • Lilly, "Christian Astrology" Bk III (Directions & Revolutions) — the
//     timing framework within which the Lord of the Year and its essential /
//     accidental condition are judged for the native's annual fortunes.
//
//  Pure functions — NO DOM, fully headless-testable in Node.
// ============================================================================
import { SIGNS, signOf } from './astro.js';
import { DOMICILE } from './data/dignities-data.js';
import { essentialDignity, accidentalDignity } from './dignities.js';

// ---------------------------------------------------------------------------
//  Annual profection.
//  age = whole years since birth (integer >= 0). Year 0 activates the natal
//  Ascendant sign and the 1st house; each subsequent year advances one sign
//  / one house, completing the 12-sign circuit every 12 years.
// ---------------------------------------------------------------------------
export function annualProfection(chart, age) {
  const natalAscSign = signOf(chart.asc).index;
  const profectedSignIndex = (natalAscSign + age) % 12;
  const activatedHouse = (age % 12) + 1;   // year 0 -> 1st house, year 1 -> 2nd, ...
  const lordOfYear = DOMICILE[profectedSignIndex];

  // Condition of the Lord of the Year in the natal chart (guard if missing).
  const p = chart.planets ? chart.planets[lordOfYear] : undefined;
  const lordCondition = {
    essential: p ? essentialDignity(lordOfYear, p.lon, chart.isDay).total : null,
    accidental: p ? accidentalDignity(lordOfYear, chart).total : null
  };

  return {
    age,
    profectedSignIndex,
    profectedSign: SIGNS[profectedSignIndex],
    activatedHouse,
    lordOfYear,
    lordCondition
  };
}

// ---------------------------------------------------------------------------
//  Convenience: just the Lord of the Year.
// ---------------------------------------------------------------------------
export function lordOfYear(chart, age) {
  return annualProfection(chart, age).lordOfYear;
}

// ---------------------------------------------------------------------------
//  Monthly profection.
//  Within a single profection year the time-lord advances one sign per ~month,
//  starting from the annual profected sign (monthIndex 0 = the annual sign).
// ---------------------------------------------------------------------------
export function monthlyProfection(chart, age, monthIndex) {
  const { profectedSignIndex } = annualProfection(chart, age);
  const profMonthSign = (profectedSignIndex + monthIndex) % 12;
  return {
    monthIndex,
    profectedSign: SIGNS[profMonthSign],
    lord: DOMICILE[profMonthSign]
  };
}
