// ============================================================================
//  scripts/tests/r29-thelemic.mjs — R29 WP-E1 (B-thelemic) headless tests.
//  Exports `async run() -> {pass, failures[]}` for engine-test.mjs and a
//  `DRIVES` array for the Chromium sweep. Deterministic; no DOM, no network.
//
//  Covers core/thelemic.js:
//    • eraLegis  — a KNOWN Anno for a fixed date in BOTH modes; the docosade /
//      year-within arithmetic; the contested year-start fork; the Sun/Moon
//      stamp; the 1904 epoch; determinism.
//    • solarStations — monotonic sunrise < noon < sunset < midnight (the
//      anti-transit), the four cited adoration names, determinism.
// ============================================================================
import {
  eraLegis, solarStations, toRoman, vernalEquinox,
  NEW_AEON_YEAR, DOCOSADE, RESH_STATIONS,
} from '../../assets/js/core/thelemic.js';

export async function run() {
  const failures = [];
  const ok = (cond, msg) => { if (!cond) failures.push(msg); };

  // ---- 1. Roman numerals (incl. the no-Roman-zero convention) -------------
  ok(toRoman(0) === '0', 'toRoman(0) === "0" (no Roman zero — epoch renders 0)');
  ok(toRoman(5) === 'V' && toRoman(12) === 'XII' && toRoman(22) === 'XXII', 'toRoman basic values');
  ok(toRoman(-1) === '−I', 'toRoman negative prefixes − (pre-epoch honesty)');

  // ---- 2. eraLegis KNOWN vector: 2026 post-equinox = Vxii -----------------
  // The plan's worked example. 2026 − 1904 = 122; 122 = 5·22 + 12 → docosade V,
  // year-within xii. Verified in BOTH modes for a mid-year date (well clear of
  // the contested March window, so the two modes agree).
  const midYear = new Date(Date.UTC(2026, 5, 20, 12, 0, 0));   // 20 Jun 2026
  const exact = eraLegis(midYear);                             // default mode
  const march = eraLegis(midYear, { mode: 'march20' });
  ok(exact.mode === 'exact', 'default mode is exact');
  ok(exact.anno === 'Vxii', `2026 post-equinox anno === "Vxii" (got ${exact.anno})`);
  ok(march.anno === 'Vxii', `2026 post-equinox anno === "Vxii" in march20 mode (got ${march.anno})`);
  ok(exact.docosade === 5 && exact.yearWithin === 12, 'docosade 5 / year-within 12');
  ok(exact.yearsSince === 122, 'yearsSince 122 from the 1904 epoch');
  ok(exact.docosadeRoman === 'V' && exact.yearRoman === 'xii', 'Roman parts V + xii (case-distinguished)');

  // ---- 3. The Sun/Moon stamp is computed & well-formed --------------------
  ok(/^☉ in .+ : ☽ in .+$/.test(exact.stamp), 'stamp has the ☉ … : ☽ … form');
  ok(exact.sun && typeof exact.sun.lon === 'number' && exact.sun.sign, 'sun stamp carries lon + sign');
  ok(exact.moon && typeof exact.moon.lon === 'number' && exact.moon.sign, 'moon stamp carries lon + sign');
  // On 20 Jun 2026 the Sun is at the very end of Gemini (pre-solstice).
  ok(exact.sun.sign === 'Gemini', `Sun in Gemini on 2026-06-20 (got ${exact.sun.sign})`);
  ok(exact.dies && /^dies /.test(exact.dies), 'Latin dies weekday present');

  // ---- 4. CONTESTED year-start fork: the two modes DIVERGE in-window ------
  // The 2026 vernal equinox is 2026-03-20 ~14:45 UTC. A moment at 12:00 UTC on
  // March 20 is BEFORE the true equinox (still the prior Thelemic year, xi) but
  // AFTER the conventional March-20 00:00 boundary (already the new year, xii).
  const eqx = vernalEquinox(2026);
  ok(eqx.getUTCMonth() === 2 && eqx.getUTCDate() === 20, 'vernalEquinox(2026) falls on 20 March');
  const inWindow = new Date(Date.UTC(2026, 2, 20, 12, 0, 0));
  const wExact = eraLegis(inWindow);
  const wMarch = eraLegis(inWindow, { mode: 'march20' });
  ok(wExact.anno === 'Vxi', `contested window: exact mode = prior year Vxi (got ${wExact.anno})`);
  ok(wMarch.anno === 'Vxii', `contested window: march20 mode = new year Vxii (got ${wMarch.anno})`);
  ok(wExact.anno !== wMarch.anno, 'the two conventions genuinely diverge inside the window');

  // ---- 5. The 1904 epoch renders "00" (docosade 0, year 0) ----------------
  const epoch = eraLegis(new Date(Date.UTC(1904, 5, 1)));   // after the 1904 equinox
  ok(epoch.yearsSince === 0 && epoch.docosade === 0 && epoch.yearWithin === 0, 'epoch = year 0');
  ok(epoch.anno === '00', `epoch anno renders "00" (got ${epoch.anno})`);
  ok(NEW_AEON_YEAR === 1904 && DOCOSADE === 22, 'constants: 1904 epoch, 22-year docosade');

  // ---- 6. Determinism: identical inputs → identical serialisation ---------
  ok(JSON.stringify(eraLegis(midYear)) === JSON.stringify(eraLegis(midYear)), 'eraLegis is deterministic');

  // ---- 7. solarStations monotonic & fully labelled ------------------------
  const ss = solarStations(midYear, 51.5074, -0.1278);   // London
  ok(ss && ss.sunrise && ss.noon && ss.sunset && ss.midnight, 'solarStations returns the four moments');
  ok(ss.sunrise < ss.noon, 'sunrise < noon (solar transit)');
  ok(ss.noon < ss.sunset, 'noon < sunset');
  ok(ss.sunset < ss.midnight, 'sunset < midnight (anti-transit closes the day)');
  ok(ss.stations.length === 4, 'four stations');
  ok(ss.stations.map(s => s.deity).join(',') === 'Ra,Ahathoor,Tum,Khephra',
    'the four cited adoration names in order (Ra/Ahathoor/Tum/Khephra)');
  ok(ss.stations.every(s => s.time && s.astronomy && s.label), 'each station carries time + astronomy + label');
  ok(/Liber Resh/.test(ss.citation) && /1911/.test(ss.citation), 'Liber Resh 1911 citation present');
  ok(RESH_STATIONS.length === 4, 'RESH_STATIONS export has the four stations');

  // determinism at a location
  const j1 = JSON.stringify(solarStations(midYear, 51.5074, -0.1278));
  const j2 = JSON.stringify(solarStations(midYear, 51.5074, -0.1278));
  ok(j1 === j2, 'solarStations is deterministic');

  // ---- 8. A second latitude keeps the ordering (southern hemisphere) ------
  const sy = solarStations(midYear, -33.8688, 151.2093);   // Sydney
  ok(sy && sy.sunrise < sy.noon && sy.noon < sy.sunset && sy.sunset < sy.midnight,
    'ordering holds in the southern hemisphere');

  return { pass: failures.length === 0, failures };
}

// -- Chromium sweep drive descriptor (integrator wires into browser-verify) --
export const DRIVES = [
  {
    page: 'pages/thelemic-times.html',
    actions: ['compute'],
    asserts: [
      'no console error / pageerror',
      'both panels compute (the Era Legis anno stamp and the four Liber Resh stations render)',
      'the Liber Resh 1911 and Era Legis citations are present',
    ],
  },
];

export default { run, DRIVES };
