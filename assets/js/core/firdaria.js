// ============================================================================
//  firdaria.js — FIRDARIA (al-firdārāt), the Persian planetary time-lord
//  periods: life is divided into a repeating 75-year cycle of major periods,
//  one per planet (plus the two lunar nodes), each planetary period subdivided
//  among the seven planets.
//
//  THE SEQUENCES (Abu Ma'shar, "On the Revolutions of the Years of
//  Nativities", trans. B. Dykes, Persian Nativities IV, Cazimi Press):
//   • DAY birth — starts from the Sun, Chaldean order wrapped:
//       Sun 10 · Venus 8 · Mercury 13 · Moon 9 · Saturn 11 · Jupiter 12 ·
//       Mars 7 · North Node 3 · South Node 2   (total 75, then repeats)
//   • NIGHT birth — starts from the Moon:
//       Moon 9 · Saturn 11 · Jupiter 12 · Mars 7 · Sun 10 · Venus 8 ·
//       Mercury 13 · then the nodes.
//
//  NODE-PLACEMENT DISPUTE (flagged IN-DATA; exposed as an option):
//   • DEFAULT ('end') — Abu Ma'shar's own text as read by Dykes, Rob Hand,
//     Steven Birchfield (and Schoener): the nodes close the night sequence
//     too — NN ages 70–73, SN 73–75, exactly as in day charts.
//   • VARIANT ('afterMars') — Bonatti (Book of Astronomy, 13th c.), followed
//     by Robert Zoller and several modern calculators: in night charts the
//     nodes are inserted AFTER MARS — NN 39–42, SN 42–44, then Sun 44–54,
//     Venus 54–62, Mercury 62–75. (Skyscript-forum consensus: Bonatti lacked
//     Abu Ma'shar's full text; every other ancient author puts the nodes
//     last. Note honestly: some respected calculators — e.g. augurine.com —
//     DEFAULT to the Bonatti placement, labelling it "Bonatti/Dykes".)
//   The two orders COINCIDE for day charts (Mars is the last planet before
//   the nodes either way).
//
//  SUB-PERIODS: each PLANETARY major period divides into 7 EQUAL sub-periods;
//  the first sub-lord is the major lord itself, then the sequence continues
//  in the firdaria (Chaldean-wrapped) order SKIPPING the nodes. The node
//  periods (NN 3y, SN 2y) have NO sub-periods (subs = null). E.g. the Sun
//  major (10y): subs of 10/7 ≈ 1.42857y — Sun/Sun, Sun/Venus, Sun/Mercury,
//  Sun/Moon, Sun/Saturn, Sun/Jupiter, Sun/Mars.
//
//  YEAR LENGTH — IMPLEMENTATION CONVENTION, NOT A SOURCED RULE: the sources
//  consulted never specify a day-count for the firdaria "year"; this module
//  uses JULIAN years (365.25 days) for date conversion and says so in-data.
//
//  CITATIONS: Abu Ma'shar, On the Revolutions of the Years of Nativities,
//  trans. B. Dykes (Persian Nativities IV, Cazimi Press); the night-node
//  dispute per Dykes/Hand/Birchfield (nodes at end) vs Bonatti/Zoller (after
//  Mars) — skyscript.co.uk forum threads t=2134 & t=10253; augurine.com/learn/
//  firdaria and 100percentastrology (2020-03-15) document the two calculator
//  conventions.
//
//  HONEST FRAMING: a historical period-lord scheme with no demonstrated
//  validity — described, never prescribed.
//
//  PURE — no DOM, no network, no randomness; dates are passed in.
// ============================================================================

// Period lengths in years (Abu Ma'shar). Total = 75.
export const FIRDARIA_YEARS = {
  Sun: 10, Venus: 8, Mercury: 13, Moon: 9, Saturn: 11, Jupiter: 12, Mars: 7,
  NorthNode: 3, SouthNode: 2,
};

// The 7-planet cycle the sub-periods walk (the firdaria order with the nodes
// skipped, read cyclically from any starting lord). It is the Chaldean order
// wrapped: Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars→(Sun again).
export const FIRDARIA_PLANET_CYCLE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

// The three major-period sequences (each sums to 75 years).
export const SEQUENCE_DAY = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'NorthNode', 'SouthNode'];
export const SEQUENCE_NIGHT_NODES_END = ['Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'NorthNode', 'SouthNode'];
export const SEQUENCE_NIGHT_NODES_AFTER_MARS = ['Moon', 'Saturn', 'Jupiter', 'Mars', 'NorthNode', 'SouthNode', 'Sun', 'Venus', 'Mercury'];

export const FIRDARIA_CYCLE_YEARS = 75;

// Year length used ONLY to convert ages to calendar dates. An implementation
// convention (Julian year, 365.25 d) — the sources do not specify one.
export const FIRDARIA_YEAR_DAYS = 365.25;

export const FIRDARIA_CITATION =
  'Abu Ma\'shar, On the Revolutions of the Years of Nativities, trans. B. Dykes (Persian Nativities IV, '
  + 'Cazimi Press). Night-node dispute: nodes-at-end per Dykes/Hand/Birchfield (augurine.com/learn/firdaria; '
  + 'skyscript.co.uk t=2134, t=10253) vs nodes-after-Mars per Bonatti, Book of Astronomy, followed by Zoller '
  + '(100percentastrology, 2020-03-15). The two coincide for day charts.';

// Convention notes, surfaced verbatim in the UI (flag-in-data discipline).
export const FIRDARIA_NOTES = {
  nodePlacement:
    'CONTESTED (night charts only): Abu Ma\'shar — as read by Dykes, Rob Hand and Steven Birchfield — puts the '
    + 'nodes at the END of the night sequence (North Node ages 70–73, South Node 73–75): the DEFAULT here. '
    + 'Bonatti (Book of Astronomy), followed by Robert Zoller and several modern calculators (augurine.com '
    + 'defaults to it as "Bonatti/Dykes"), inserts them AFTER MARS (NN 39–42, SN 42–44, then Sun 44–54, '
    + 'Venus 54–62, Mercury 62–75): the documented VARIANT. Day charts are identical either way, Mars being '
    + 'the last planet before the nodes in both orders.',
  subPeriods:
    'Each PLANETARY major period divides into 7 EQUAL sub-periods; the first sub-lord is the major lord '
    + 'itself, then the firdaria order continues, skipping the nodes. Node periods have no sub-periods.',
  yearLength:
    'Ages are converted to dates with JULIAN years (365.25 days) — an implementation convention of this '
    + 'module, not a sourced rule: the consulted sources never specify a day-count for the firdaria year.',
};

// Date at a given (fractional) firdaria age, by the Julian-year convention.
export function firdariaDate(birthDate, ageYears) {
  return new Date(birthDate.getTime() + ageYears * FIRDARIA_YEAR_DAYS * 86400000);
}

// The major-period sequence for a sect + night-node option.
// nightNodes: 'end' (Abu Ma'shar — default) | 'afterMars' (Bonatti variant).
export function firdariaSequence(isDay, nightNodes = 'end') {
  if (isDay) return SEQUENCE_DAY.slice();
  return (nightNodes === 'afterMars' ? SEQUENCE_NIGHT_NODES_AFTER_MARS : SEQUENCE_NIGHT_NODES_END).slice();
}

// ---------------------------------------------------------------------------
//  firdaria(birthDate, isDay, opts?)  — the full 75-year table.
//  opts.nightNodes: 'end' | 'afterMars' (ignored for day charts).
//  → {
//      isDay, nightNodes, sequence, cycleYears, yearDays,
//      majors: [{ lord, years, startAge, endAge, startDate, endDate,
//                 subs: [{lord, startAge, endAge, years}] | null }],
//      notes, citation
//    }
//  Ages are years from birth; the cycle repeats every 75 years (see
//  currentFirdaria for natives past 75).
// ---------------------------------------------------------------------------
export function firdaria(birthDate, isDay, opts = {}) {
  const nightNodes = opts.nightNodes === 'afterMars' ? 'afterMars' : 'end';
  const sequence = firdariaSequence(isDay, nightNodes);
  const majors = [];
  let age = 0;
  for (const lord of sequence) {
    const years = FIRDARIA_YEARS[lord];
    const startAge = age, endAge = age + years;
    const isNode = lord === 'NorthNode' || lord === 'SouthNode';
    let subs = null;
    if (!isNode) {
      subs = [];
      const from = FIRDARIA_PLANET_CYCLE.indexOf(lord);
      const len = years / 7;
      for (let i = 0; i < 7; i++) {
        subs.push({
          lord: FIRDARIA_PLANET_CYCLE[(from + i) % 7],
          startAge: startAge + i * len,
          endAge: startAge + (i + 1) * len,
          years: len,
        });
      }
    }
    majors.push({
      lord, years, startAge, endAge,
      startDate: firdariaDate(birthDate, startAge),
      endDate: firdariaDate(birthDate, endAge),
      subs,
    });
    age = endAge;
  }
  return {
    isDay, nightNodes: isDay ? null : nightNodes, sequence,
    cycleYears: FIRDARIA_CYCLE_YEARS, yearDays: FIRDARIA_YEAR_DAYS,
    majors, notes: FIRDARIA_NOTES, citation: FIRDARIA_CITATION,
  };
}

// ---------------------------------------------------------------------------
//  currentFirdaria(majors, ageYears) — the running major & sub period.
//  The 75-year cycle repeats, so ages ≥ 75 wrap (cycle counts from 0).
//  → { major, sub, cycle, ageInCycle }  (major/sub null if age < 0)
// ---------------------------------------------------------------------------
export function currentFirdaria(majors, ageYears) {
  if (!(ageYears >= 0)) return { major: null, sub: null, cycle: 0, ageInCycle: ageYears };
  const cycle = Math.floor(ageYears / FIRDARIA_CYCLE_YEARS);
  const a = ageYears - cycle * FIRDARIA_CYCLE_YEARS;
  const major = majors.find(m => a >= m.startAge && a < m.endAge) || null;
  const sub = major && major.subs ? (major.subs.find(s => a >= s.startAge && a < s.endAge) || null) : null;
  return { major, sub, cycle, ageInCycle: a };
}
