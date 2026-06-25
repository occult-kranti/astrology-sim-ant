// ============================================================================
//  hyleg.js — The Hyleg (apheta / "giver of life") and the Alcocoden
//  ("giver of years"), after William Lilly's Christian Astrology, Book III,
//  the chapter "Of the Hyleg and Alcocoden" (length-of-life judgement), itself
//  drawn from Ptolemy, Tetrabiblos III ("Of the Length of Life").
//
//  ⚠ CONTESTED TECHNIQUE — READ THIS.
//  Length-of-life judgement is one of the most disputed procedures in the whole
//  tradition. Authors disagree on (a) which houses are "aphetic" / hylegiacal,
//  (b) the exact order of examining the candidates, (c) whether the hyleg must
//  hold ESSENTIAL DIGNITY in its place or merely OCCUPY an aphetic place, and
//  (d) how the prenatal syzygy is treated. This module implements ONE clearly
//  scoped, citable Lilly/Ptolemaic reading and DOCUMENTS every choice it makes,
//  both in these comments and in the returned `reason` / `assumptions` fields.
//  It is NOT presented as the only correct reading. Where a reasonable author
//  would differ, that fork is called out explicitly.
//
//  Sources (cross-checked against multiple transcriptions; see /pages/about):
//   • Lilly, Christian Astrology, Bk III, "Of the Hyleg and Alcocoden" — the
//     order of examining Sol, Luna, Ascendant, Pars Fortunae and the prenatal
//     conjunction/opposition, and the rule that the giver of life must be in an
//     aphetical place AND have essential dignity there.
//   • Ptolemy, Tetrabiblos III.10–11 ("Of the Length of Life") — the aphetic
//     (prorogative) places: houses 1, 7, 9, 10, 11 (the "aphetai"); and the
//     alcocoden (oikodektor) as the planet ruling the prorogator's place, whose
//     planetary "years" set the span of life.
//   • Traditional planetary YEARS (greatest / mean / least) — Ptolemy III.11 and
//     Lilly Bk III; the same canonical figures used across the Arabic and
//     Renaissance authors (Bonatti, al-Biruni, Lilly).
//
//  Pure functions, no DOM, headless-testable in Node. Mirrors the header/export
//  style of dignities-data.js.
// ============================================================================
import { signOf, norm360, bodyPosition } from './astro.js';
import { essentialDignity, almuten } from './dignities.js';

// ---------------------------------------------------------------------------
//  Aphetic / hylegiacal houses.
//
//  We use the common Lilly/Ptolemy set: houses 1, 7, 9, 10, 11.
//  ASSUMPTION / CONTESTED: Some authors also admit part of the 8th (the upper
//  half) or treat the 7th/9th/11th unequally, and a few restrict the set
//  further (e.g. dropping the 7th). We deliberately use the canonical five
//  "aphetai" of Tetrabiblos III and Lilly Bk III and nothing else. Documented
//  here and surfaced in every result's `assumptions` string.
// ---------------------------------------------------------------------------
export const HYLEGIACAL_HOUSES = [1, 7, 9, 10, 11];

// ---------------------------------------------------------------------------
//  Traditional planetary YEARS — greatest / mean / least.
//  (Ptolemy, Tetrabiblos III.11; Lilly, Christian Astrology Bk III.)
//  The alcocoden bestows one of these spans on the native depending on its
//  accidental condition (angular ⇒ greatest, succedent ⇒ mean, cadent ⇒ least;
//  that conditional choice is left to the caller — we return all three).
// ---------------------------------------------------------------------------
export const PLANETARY_YEARS = {
  Saturn:  { greatest: 57,  mean: 43.5, least: 30 },
  Jupiter: { greatest: 79,  mean: 45.5, least: 12 },
  Mars:    { greatest: 66,  mean: 40.5, least: 15 },
  Sun:     { greatest: 120, mean: 69.5, least: 19 },
  Venus:   { greatest: 82,  mean: 45,   least: 8  },
  Mercury: { greatest: 76,  mean: 48,   least: 20 },
  Moon:    { greatest: 108, mean: 66.5, least: 25 }
};

// ---------------------------------------------------------------------------
//  Prenatal syzygy — the degree of the last Sun–Moon conjunction (if the birth
//  Moon is waxing, elongation < 180°) or opposition (if waning) BEFORE birth.
//
//  Per Lilly, the syzygy point used is the MOON's longitude at that conjunction
//  or opposition (the "place of the preceding New or Full Moon"). We bracket
//  the crossing by scanning backward day-by-day (up to 31 days) until the
//  signed elongation crosses 0° (for a conjunction) or 180° (for an
//  opposition), then bisect for precision. Wrapped in try/catch by the caller;
//  if anything fails the candidate is omitted and noted in the result.
// ---------------------------------------------------------------------------
function prenatalSyzygy(date) {
  // elongation = Moon − Sun, normalised to [0,360). Waxing < 180, waning >= 180.
  const elong = d => norm360(bodyPosition('Moon', d).lon - bodyPosition('Sun', d).lon);
  const e0 = elong(date);
  const seekConjunction = e0 < 180; // waxing ⇒ last event was the New Moon

  // For a conjunction we track elongation around 0° via a signed value in
  // (-180,180]; for an opposition we track (elongation − 180) similarly. The
  // target crossing is where this signed value changes sign (passes through 0).
  const signed = d => {
    let x = elong(d);
    if (!seekConjunction) x = x - 180;          // centre on the opposition
    return ((x + 540) % 360) - 180;             // wrap to (-180, 180]
  };

  let hi = date;                 // most recent (birth)
  let sHi = signed(hi);
  // Step backward in 1-day increments to bracket the sign change.
  let lo = null, sLo = null;
  for (let i = 1; i <= 31; i++) {
    const d = new Date(date.getTime() - i * 86400000);
    const s = signed(d);
    if (s === 0) { lo = d; sLo = s; hi = d; sHi = s; break; }
    if (s * sHi < 0) { lo = d; sLo = s; break; } // sign change between lo..hi
    hi = d; sHi = s;
  }
  if (lo === null) throw new Error('syzygy not bracketed within 31 days');

  // Bisection between lo (earlier) and hi (later) for the crossing instant.
  let a = lo, b = hi, sa = sLo;
  for (let i = 0; i < 40; i++) {
    const mid = new Date((a.getTime() + b.getTime()) / 2);
    const sm = signed(mid);
    if (sm === 0) { a = mid; break; }
    if (sa * sm < 0) { b = mid; } else { a = mid; sa = sm; }
    if (b.getTime() - a.getTime() < 1000) break; // 1-second tolerance
  }
  const inst = new Date((a.getTime() + b.getTime()) / 2);
  // Per Lilly, the syzygy POINT is the Moon's longitude at that instant.
  return { lon: norm360(bodyPosition('Moon', inst).lon), date: inst, type: seekConjunction ? 'conjunction' : 'opposition' };
}

// Does a planet hold any essential dignity (domicile/exalt/triplicity/term/
// face) AT this longitude? Used for the luminaries (a luminary that is its own
// ruler/exalt/… in its place). Sect-aware via essentialDignity.
function planetDignifiedAt(planet, lon, isDay) {
  return essentialDignity(planet, lon, isDay).rows.some(r => r.score > 0);
}

// Is the degree itself "dignified" — i.e. does ANY of the seven planets hold a
// positive essential dignity there (always true) — that is not the right test
// for Asc/PoF/Syzygy. Instead we ask: is the planet that disposes this degree
// (its almuten) actually present with real dignity? For the abstract points
// (Ascendant, Part of Fortune, Syzygy) Lilly treats the place as "fortified"
// when its almuten has substantial dignity there, which it does by construction
// (every degree has term & face rulers). We therefore record the almuten's
// total essential-dignity score and call the point "dignified" when that score
// exceeds the bare term+face minimum (3), i.e. the place is ruled by a planet
// with domicile/exaltation/triplicity strength, not merely term or face.
function pointDignified(lon, isDay) {
  const a = almuten(lon, isDay); // {planet, score, all}
  // term(2)+face(1) = 3 is the unavoidable minimum any degree confers; require
  // more than that for an abstract point to count as "dignified".
  return a.score > 3;
}

// ---------------------------------------------------------------------------
//  hyleg(chart)
//
//  Returns:
//    { hyleg, lon, house, dignified, reason, candidatesExamined, assumptions }
//  where hyleg ∈ {'Sun','Moon','Ascendant','Part of Fortune','Syzygy', null}.
//
//  Candidate order is by SECT (Lilly's order of examination):
//    DAY:   Sun, Moon, Ascendant, Part of Fortune, Syzygy
//    NIGHT: Moon, Sun, Ascendant, Part of Fortune, Syzygy
//
//  The hyleg is the FIRST candidate that is BOTH in a hylegiacal house AND
//  dignified there. If none qualifies strictly, we FALL BACK to the first
//  candidate that merely occupies a hylegiacal house (documented in `reason`).
//  If not even that exists, hyleg is null.
// ---------------------------------------------------------------------------
export function hyleg(chart) {
  const assumptions =
    'Hylegiacal houses = {1,7,9,10,11} (Ptolemy Tetrabiblos III.10 / Lilly CA Bk III); ' +
    'some authors also admit the 8th — not used here. ' +
    'Candidate order is sect-based (DAY: Sun, Moon, Asc, PoF, Syzygy; NIGHT: Moon, Sun, Asc, PoF, Syzygy). ' +
    'Strict hyleg requires both an aphetic house AND essential dignity in its place; ' +
    'for the luminaries that means the planet rules/exalts/etc. its own degree, ' +
    'for the abstract points (Asc, Part of Fortune, Syzygy) it means the place is ' +
    'disposed by a planet with more than bare term+face dignity (almuten score > 3). ' +
    'If nothing qualifies strictly we fall back to the first candidate merely in an ' +
    'aphetic house (noted in reason). Syzygy = Moon’s longitude at the last ' +
    'pre-natal New (waxing) or Full (waning) Moon, per Lilly.';

  const isDay = chart.isDay;
  const cusps = chart.cusps;
  const houseOfLon = lon => require_houseOf(lon, cusps);

  // Build the candidate list in sect order.
  const cands = [];
  const sun = chart.planets.Sun, moon = chart.planets.Moon;
  if (isDay) {
    cands.push({ name: 'Sun', lon: sun.lon });
    cands.push({ name: 'Moon', lon: moon.lon });
  } else {
    cands.push({ name: 'Moon', lon: moon.lon });
    cands.push({ name: 'Sun', lon: sun.lon });
  }
  cands.push({ name: 'Ascendant', lon: chart.asc });
  cands.push({ name: 'Part of Fortune', lon: chart.planets.Fortune.lon });

  // Prenatal syzygy — optional; omit and note if computation fails.
  let syzygyNote = '';
  try {
    const syz = prenatalSyzygy(chart.date);
    cands.push({ name: 'Syzygy', lon: syz.lon });
  } catch (e) {
    syzygyNote = ` Syzygy candidate omitted (computation failed: ${e && e.message ? e.message : 'unknown error'}).`;
  }

  // Evaluate each candidate.
  const candidatesExamined = cands.map(c => {
    const house = houseOfLon(c.lon);
    const hylegiacal = HYLEGIACAL_HOUSES.includes(house);
    let dignified;
    if (c.name === 'Sun' || c.name === 'Moon') {
      dignified = planetDignifiedAt(c.name, c.lon, isDay);
    } else {
      // Ascendant, Part of Fortune, Syzygy — abstract points: judge the place.
      dignified = pointDignified(c.lon, isDay);
    }
    return { name: c.name, lon: c.lon, house, hylegiacal, dignified };
  });

  // Strict: first candidate both in an aphetic house and dignified there.
  let chosen = candidatesExamined.find(c => c.hylegiacal && c.dignified) || null;
  let reason;
  if (chosen) {
    reason = `${chosen.name} chosen as hyleg: first candidate (in sect order) that is BOTH ` +
      `in a hylegiacal house (house ${chosen.house}) AND essentially dignified there.` + syzygyNote;
  } else {
    // Fallback: first candidate merely in a hylegiacal house.
    chosen = candidatesExamined.find(c => c.hylegiacal) || null;
    if (chosen) {
      reason = `FALLBACK: no candidate was both in a hylegiacal house and essentially ` +
        `dignified there, so the hyleg is the first candidate (sect order) merely ` +
        `occupying a hylegiacal house — ${chosen.name} in house ${chosen.house}. ` +
        `This is a documented fallback, not a strict Lilly/Ptolemy qualification.` + syzygyNote;
    } else {
      reason = `No hyleg: no candidate falls in any hylegiacal house {1,7,9,10,11}. ` +
        `Some authors would then judge the chart unable to give life, or relax the ` +
        `aphetic-house set; we return null rather than guess.` + syzygyNote;
    }
  }

  return {
    hyleg: chosen ? chosen.name : null,
    lon: chosen ? chosen.lon : null,
    house: chosen ? chosen.house : null,
    dignified: chosen ? chosen.dignified : false,
    reason,
    candidatesExamined,
    assumptions
  };
}

// ---------------------------------------------------------------------------
//  alcocoden(chart, hylegResult=null)
//
//  The alcocoden ("giver of years", Ptolemy's oikodektor) is the planet with
//  the most essential dignity AT the hyleg's degree — i.e. the almuten of the
//  hyleg's place. Its traditional planetary years set the span of life.
//
//  Returns { alcocoden, hylegLon, years: { greatest, mean, least } }.
//  If there is no hyleg, returns nulls.
//
//  ASSUMPTION: "most essential dignity at the degree" is computed via
//  almuten(hylegLon, isDay) from dignities.js (the planet with the highest sum
//  of positive essential dignities there). Lilly sometimes selects the
//  alcocoden by the strongest dignity *with aspect to* the hyleg; we use the
//  simple degree-almuten reading and document it.
// ---------------------------------------------------------------------------
export function alcocoden(chart, hylegResult = null) {
  const hres = hylegResult || hyleg(chart);
  if (!hres || hres.hyleg == null || hres.lon == null) {
    return { alcocoden: null, hylegLon: null, years: null };
  }
  const hylegLon = hres.lon;
  const a = almuten(hylegLon, chart.isDay); // {planet, score, all}
  const planet = a.planet;
  const years = (planet && PLANETARY_YEARS[planet]) ? { ...PLANETARY_YEARS[planet] } : null;
  return { alcocoden: planet, hylegLon, years };
}

// ---------------------------------------------------------------------------
//  Local houseOf — astro.js exports houseOf, but to keep this module's import
//  surface minimal and avoid coupling to its signature, we re-implement the
//  same cusp-span lookup here. (Matches astro.js houseOf exactly.)
// ---------------------------------------------------------------------------
function require_houseOf(lon, cusps) {
  lon = norm360(lon);
  for (let i = 1; i <= 12; i++) {
    const a = cusps[i], b = cusps[i === 12 ? 1 : i + 1];
    const span = norm360(b - a);
    const off = norm360(lon - a);
    if (off < span || span === 0) return i;
  }
  return 1;
}
