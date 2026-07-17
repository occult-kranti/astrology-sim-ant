// ============================================================================
//  thelemic.js — PURE computation for two zero-data museum tools (R29 WP-E1):
//    • eraLegis(date)      — the Thelemic "Anno" date-stamp Aleister Crowley
//                            used in his diaries and published writings.
//    • solarStations(...)  — the four solar moments (sunrise / noon / sunset /
//                            midnight) to which Liber Resh vel Helios (1911)
//                            directs its adorations of the Sun.
//
//  MUSEUM VOICE (binding, per the R29 sourcing covenant): everything here is
//  HISTORICAL DESCRIPTION of a documented practice, never an instruction to the
//  reader and never a claim of astrological validity. The Anno notation is
//  Crowley's calendrical convention; the four stations are astronomy, and the
//  adoration NAMES (Ra / Ahathoor / Tum / Khephra) are cited data from the
//  public-domain text — this module states THAT the tradition performs them, not
//  that anyone should. Witnesses are pre-1931 PD only (Liber Resh, The Equinox
//  I(6), 1911; the calendrical framing of Liber AL vel Legis, 1904/1909).
//
//  No DOM, no data files: pure functions over the existing astronomy engine.
//  Sun/Moon longitudes come from astro.js (bodyPosition); the vernal-equinox
//  instant and the solar culminations come from the shared astronomy library
//  (the same truncated-VSOP87 engine every other tool uses); sunrise & sunset
//  are REUSED from planetary-hours.js (hoursTable) — not reimplemented here.
// ============================================================================
import * as Astronomy from '../lib/astronomy.js';
import { bodyPosition, signOf, formatLon } from './astro.js';
import { hoursTable } from './planetary-hours.js';

// ---------------------------------------------------------------------------
//  Constants of the Thelemic calendar.
//  The New Aeon epoch is the (northern) VERNAL EQUINOX OF 1904 — the year-count
//  begins there. Years are gathered into 22-year cycles called DOCOSADES; a date
//  is written as two Roman numerals, {docosade}{year-within-docosade}, the first
//  upper-case, the second lower-case (so e.g. "Vxii" is unambiguous by case).
// ---------------------------------------------------------------------------
export const NEW_AEON_YEAR = 1904;   // the year of the epochal vernal equinox
export const DOCOSADE = 22;          // years per docosade

// The four Liber Resh stations, with the adoration names as CITED historical
// data from the 1911 public-domain text (Liber Resh vel Helios, sub figurâ CC,
// The Equinox I(6), 1911). `deity` is the classical name the text assigns; the
// hour-angle key documents the astronomy each station is (upper/lower culmination
// or horizon crossing). Museum data — described, never prescribed.
export const RESH_STATIONS = [
  { key: 'sunrise',  label: 'Sunrise',        deity: 'Ra',      astronomy: 'the Sun crosses the eastern horizon (rising)' },
  { key: 'noon',     label: 'Noon',           deity: 'Ahathoor', astronomy: "the Sun's upper culmination (solar transit of the meridian)" },
  { key: 'sunset',   label: 'Sunset',         deity: 'Tum',      astronomy: 'the Sun crosses the western horizon (setting)' },
  { key: 'midnight', label: 'Midnight',       deity: 'Khephra',  astronomy: "the Sun's lower culmination (solar anti-transit, beneath the earth)" },
];

export const RESH_CITATION =
  'Liber Resh vel Helios, sub figurâ CC (Aleister Crowley, 1911; The Equinox I(6)) — public domain.';
export const ERA_LEGIS_CITATION =
  "Crowley's calendrical practice as printed in his diaries and The Equinox; the New-Aeon year-count dates from the vernal equinox of 1904 (Liber AL vel Legis, 1904; first published 1909).";
export const NO_VALIDITY_NOTE =
  'Recorded as history. The Thelemic date-stamp is a calendar notation and the Liber Resh stations are ordinary astronomy; neither carries any demonstrated astrological or magical validity — this is study, not guidance.';

// ---------------------------------------------------------------------------
//  Roman numerals (1–3999 range is far more than enough here).
// ---------------------------------------------------------------------------
const ROMAN = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];
export function toRoman(n) {
  n = Math.trunc(n);
  if (n === 0) return '0';               // no Roman zero — the epoch year renders "0"
  const neg = n < 0; n = Math.abs(n);
  let out = '';
  for (const [v, s] of ROMAN) { while (n >= v) { out += s; n -= v; } }
  return (neg ? '−' : '') + out;
}

// ---------------------------------------------------------------------------
//  The vernal-equinox instant of a calendar year, as a Date (UTC). Uses the
//  shared engine's Seasons() search (VSOP87-grade) — the same astronomy the
//  rest of the site runs on.
// ---------------------------------------------------------------------------
export function vernalEquinox(year) {
  return Astronomy.Seasons(year).mar_equinox.date;
}

// ---------------------------------------------------------------------------
//  eraLegis(date, opts) — the Thelemic Anno date-stamp.
//
//  opts.mode:
//    'exact'    (DEFAULT) — the Thelemic year turns at the EXACT vernal-equinox
//                           instant of each year.
//    'march20'            — the CONVENTIONAL fixed civil boundary many modern
//                           Thelemites use: March 20 (00:00 UTC).
//  Both are encoded because the year-start is CONTESTED; the two differ only for
//  moments falling between March 20 00:00 and the true equinox instant.
//
//  Returns a fully-serialisable object (no Date-only fields beyond `date`/
//  `yearStart`, which the app formats): docosade / year-within, their Roman
//  numerals, the combined `anno` string, and the Sun/Moon "stamp".
// ---------------------------------------------------------------------------
export function eraLegis(date, opts = {}) {
  const mode = opts.mode === 'march20' ? 'march20' : 'exact';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) throw new Error('eraLegis: invalid date');

  // Which Thelemic year contains this instant? Compare against this calendar
  // year's boundary; if the instant precedes it, the Thelemic year began the
  // previous calendar year.
  const Y = d.getUTCFullYear();
  const boundaryOf = y => mode === 'march20'
    ? new Date(Date.UTC(y, 2, 20, 0, 0, 0))   // month 2 = March
    : vernalEquinox(y);
  const thisBoundary = boundaryOf(Y);
  const startYear = d.getTime() >= thisBoundary.getTime() ? Y : Y - 1;
  const yearStart = startYear === Y ? thisBoundary : boundaryOf(startYear);

  const yearsSince = startYear - NEW_AEON_YEAR;           // 0 at the 1904 epoch
  const docosade = Math.floor(yearsSince / DOCOSADE);     // floor works for <1904 too
  const yearWithin = ((yearsSince % DOCOSADE) + DOCOSADE) % DOCOSADE;
  const docosadeRoman = toRoman(docosade);
  const yearRoman = toRoman(yearWithin).toLowerCase();
  // The two Roman numerals, concatenated (case distinguishes them). The epoch
  // year 1904 renders "00"; before the epoch a "−" prefix marks the negative
  // docosade (the notation is not historically used pre-1904, but stays honest).
  const anno = `${docosadeRoman}${yearRoman}`;

  const sunP = bodyPosition('Sun', d);
  const moonP = bodyPosition('Moon', d);
  const stampBody = p => {
    const s = signOf(p.lon);
    return {
      lon: p.lon, sign: s.name, glyph: s.glyph, degInSign: s.degInSign,
      label: formatLon(p.lon),                       // "12°34' Leo"
    };
  };
  const sun = stampBody(sunP);
  const moon = stampBody(moonP);
  // Crowley's stamp form: ☉ in <deg> Sign : ☽ in <deg> Sign.
  const stamp = `☉ in ${sun.label} : ☽ in ${moon.label}`;

  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DIES = ['dies Solis', 'dies Lunae', 'dies Martis', 'dies Mercurii', 'dies Jovis', 'dies Veneris', 'dies Saturni'];
  const wd = d.getUTCDay();

  return {
    date: d, mode,
    yearStart,                 // the equinox / March-20 boundary that began this year
    yearsSince, docosade, yearWithin,
    docosadeRoman, yearRoman, anno,
    sun, moon, stamp,
    weekday: WEEKDAYS[wd], dies: DIES[wd],
    citation: ERA_LEGIS_CITATION,
    noValidity: NO_VALIDITY_NOTE,
  };
}

// ---------------------------------------------------------------------------
//  Internal: solar upper (noon) & lower (midnight) culminations at a place,
//  searched forward from a reference instant. The upper culmination after
//  sunrise is solar noon; the lower culmination after that noon is the solar
//  midnight that closes the day (so sunrise < noon < sunset < midnight). This is
//  a single library culmination search (SearchHourAngle) — the site's rise/set
//  math is reused via hoursTable in solarStations(), not touched here.
// ---------------------------------------------------------------------------
function culmination(afterDate, lat, lon, hourAngle) {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const ev = Astronomy.SearchHourAngle(
    Astronomy.Body.Sun, observer, hourAngle, new Astronomy.AstroTime(afterDate), +1);
  return ev.time.date;
}

// ---------------------------------------------------------------------------
//  solarStations(date, lat, lon) — the four Liber Resh moments for the solar
//  day that begins at the sunrise of the given date & place.
//
//  Returns { sunrise, noon, sunset, midnight } Dates plus a `stations` array
//  pairing each moment with its cited adoration name and the astronomy it is.
//  Returns null when the Sun does not rise/set that day (polar day/night) — the
//  horizon stations are then undefined; callers show the honest note.
// ---------------------------------------------------------------------------
export function solarStations(date, lat, lon) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) throw new Error('solarStations: invalid date');

  const t = hoursTable(d, lat, lon);   // REUSE: sunrise / sunset / nextRise
  if (!t) return null;                 // polar edge — no ordinary rise/set

  const sunrise = t.sunrise;
  const sunset = t.sunset;
  const noon = culmination(sunrise, lat, lon, 0);      // upper culmination after sunrise
  const midnight = culmination(noon, lat, lon, 12);    // lower culmination after noon

  const times = { sunrise, noon, sunset, midnight };
  const stations = RESH_STATIONS.map(s => ({
    key: s.key, label: s.label, deity: s.deity, astronomy: s.astronomy,
    time: times[s.key],
  }));

  return {
    date: d, lat, lon,
    ...times,
    stations,
    citation: RESH_CITATION,
    noValidity: NO_VALIDITY_NOTE,
  };
}
