// ============================================================================
//  vedic.js — the VEDIC (Jyotiṣa / sidereal) engine, modelled on Jagannath
//  Hora. It is a SEPARATE system from the Western/tropical engine and is meant
//  to be shown SIDE BY SIDE with it. It does NOT re-do the astronomy: it takes
//  a tropical chart (from astro.js `castChart`) and the cited Vedic data
//  (data/vedic-data.js) and produces a full sidereal reading —
//    • the Lagna & the 9 grahas in sidereal rāśis, with nakṣatra+pada, house
//      (whole-sign), and Parāśarī dignity;
//    • the Pañcāṅga (tithi, vāra, nakṣatra, yoga, karaṇa);
//    • the Vimśottarī daśā (mahā + antar), balanced from the Moon;
//    • the divisional charts (vargas D1…D60);
//    • the Aṣṭakavarga (BAV + SAV, checksum 337);
//    • a partial Ṣaḍbala (Naisargika + Dig + Uccha) — flagged;
//    • a handful of yogas.
//
//  PURE — no DOM, headless-testable. Sidereal = tropical − Lahiri ayanāṁśa.
//  Astrology has no demonstrated predictive validity; this is a cultural/
//  computational study system, described — never prescribed.
// ============================================================================
import {
  lahiriAyanamsa, toSidereal, RASHIS, NAKSHATRA_ARC, nakshatraOf, VIMSHOTTARI,
  EXALTATION, OWN_SIGNS, MOOLATRIKONA, GRAHAS, GRAHA_SANSKRIT, KARAKAS,
  TITHIS, YOGAS, KARANAS_MOVABLE, VARA_LORDS, VARA_NAMES, vargaSign, VARGA_LIST,
  ASHTAKAVARGA, ASHTAKAVARGA_PLANETS, NAISARGIKA_BALA, DIG_BALA_STRONG_HOUSE, SHADBALA_REQUIRED,
  RASHI_SOURCE, NAKSHATRA_SOURCE, VIMSHOTTARI_SOURCE, DIGNITY_SOURCE, PANCHANGA_SOURCE,
  VARGA_SOURCE, ASHTAKAVARGA_SOURCE, SHADBALA_SOURCE,
} from './data/vedic-data.js';

const norm360 = x => ((x % 360) + 360) % 360;
const YEAR_MS = 365.2425 * 86400000;
const fmtSid = lon => {
  const l = norm360(lon), si = Math.floor(l / 30), d = l - si * 30;
  const deg = Math.floor(d), min = Math.round((d - deg) * 60);
  return `${min === 60 ? deg + 1 : deg}°${String(min === 60 ? 0 : min).padStart(2, '0')}′ ${RASHIS[si].name}`;
};
const rashiOf = lon => { const l = norm360(lon), i = Math.floor(l / 30); return { index: i, name: RASHIS[i].name, sanskrit: RASHIS[i].sanskrit, lord: RASHIS[i].lord, deg: l - i * 30 }; };

// Parāśarī dignity of a graha at a sidereal rāśi/degree.
function dignityOf(graha, rashiIndex, deg) {
  const ex = EXALTATION[graha];
  if (ex && ex.sign === rashiIndex) return { state: 'Exalted', score: 5 };
  if (ex && (ex.sign + 6) % 12 === rashiIndex) return { state: 'Debilitated', score: -5 };
  if (MOOLATRIKONA[graha] === rashiIndex) return { state: 'Mūlatrikoṇa', score: 4 };
  if ((OWN_SIGNS[graha] || []).includes(rashiIndex)) return { state: 'Own sign', score: 4 };
  return { state: 'Neutral', score: 0 };
}

// ---------------------------------------------------------------------------
//  Vimśottarī daśā — balanced from the Moon's nakṣatra; mahā timeline + the
//  antardaśās of the running mahā. `currentDate` selects the running periods.
// ---------------------------------------------------------------------------
function vimshottari(moonSidLon, epoch, currentDate) {
  const nak = nakshatraOf(moonSidLon);
  const startIdx = VIMSHOTTARI.findIndex(v => v.lord === nak.lord);
  const startLord = VIMSHOTTARI[startIdx];
  const balance = startLord.years * (1 - nak.fraction);   // years of the 1st mahā that remain
  const maha = [];
  let t = epoch.getTime();
  for (let i = 0; i <= 9; i++) {
    const v = VIMSHOTTARI[(startIdx + i) % 9];
    const years = i === 0 ? balance : v.years;
    const start = new Date(t), end = new Date(t + years * YEAR_MS);
    const fullStart = i === 0 ? new Date(epoch.getTime() - (startLord.years - balance) * YEAR_MS) : start;
    maha.push({ lord: v.lord, start, end, years, fullStart, fullYears: v.years });
    t += years * YEAR_MS;
  }
  const cur = currentDate.getTime();
  const currentMaha = maha.find(m => cur >= m.start.getTime() && cur < m.end.getTime()) || maha[0];
  // antardaśās of the running mahā, laid across its FULL theoretical span
  const mIdx = VIMSHOTTARI.findIndex(v => v.lord === currentMaha.lord);
  const antars = [];
  let at = currentMaha.fullStart.getTime();
  for (let j = 0; j < 9; j++) {
    const av = VIMSHOTTARI[(mIdx + j) % 9];
    const aspan = (currentMaha.fullYears * av.years / 120) * YEAR_MS;
    antars.push({ lord: av.lord, start: new Date(at), end: new Date(at + aspan) });
    at += aspan;
  }
  const currentAntar = antars.find(a => cur >= a.start.getTime() && cur < a.end.getTime()) || null;
  return {
    startLord: startLord.lord, balanceYears: +balance.toFixed(3), nakshatra: nak,
    maha: maha.map(m => ({ lord: m.lord, start: m.start, end: m.end, years: +m.years.toFixed(2), current: m === currentMaha })),
    currentMaha: currentMaha.lord,
    antardashas: antars.map(a => ({ lord: a.lord, start: a.start, end: a.end, current: a === currentAntar })),
    currentAntar: currentAntar ? currentAntar.lord : null,
  };
}

// ---------------------------------------------------------------------------
//  Pañcāṅga — tithi, vāra, nakṣatra, yoga, karaṇa.
// ---------------------------------------------------------------------------
function panchanga(sunSidLon, moonSidLon, date) {
  const elong = norm360(moonSidLon - sunSidLon);
  const tNum = Math.floor(elong / 12) + 1;                      // 1..30
  const paksha = tNum <= 15 ? 'Śukla (waxing)' : 'Kṛṣṇa (waning)';
  const tName = TITHIS[(tNum - 1) % 15] + (tNum === 15 ? ' (Pūrṇimā)' : tNum === 30 ? ' (Amāvāsyā)' : '');
  const yNum = Math.floor(norm360(moonSidLon + sunSidLon) / NAKSHATRA_ARC) + 1; // 1..27
  const half = Math.floor(elong / 6) + 1;                       // 1..60
  let karana;
  if (half === 1) karana = 'Kiṁstughna';
  else if (half >= 58) karana = ['Śakuni', 'Catuṣpāda', 'Nāga'][half - 58];
  else karana = KARANAS_MOVABLE[(half - 2) % 7];
  const wd = date.getUTCDay();
  return {
    tithi: { num: tNum, name: tName, paksha },
    vara: { name: VARA_NAMES[wd], lord: VARA_LORDS[wd] },        // civil weekday (Vedic vāra begins at sunrise — minor simplification)
    nakshatra: nakshatraOf(moonSidLon),
    yoga: { num: yNum, name: YOGAS[yNum - 1] },
    karana: { num: half, name: karana },
  };
}

// ---------------------------------------------------------------------------
//  Aṣṭakavarga — BAV per planet (per sign, 0–8) + SAV; checksum savTotal = 337.
// ---------------------------------------------------------------------------
function ashtakavarga(rashiByGraha, lagnaIndex) {
  const pos = { ...rashiByGraha, Asc: lagnaIndex };
  const bav = {}, sav = new Array(12).fill(0);
  for (const p of ASHTAKAVARGA_PLANETS) {
    const arr = new Array(12).fill(0), table = ASHTAKAVARGA[p];
    for (const c of Object.keys(table)) {
      if (pos[c] == null) continue;
      for (const h of table[c]) arr[(pos[c] + h - 1) % 12] += 1;
    }
    bav[p] = arr;
    for (let s = 0; s < 12; s++) sav[s] += arr[s];
  }
  return { bav, sav, savTotal: sav.reduce((a, b) => a + b, 0) };
}

// ---------------------------------------------------------------------------
//  Partial Ṣaḍbala — Naisargika + Dig + Uccha (exaltation) bala only. The
//  Kāla / Ceṣṭā / Dṛk balas are computation-heavy and OMITTED here; this is
//  flagged and should be read as indicative, not authoritative.
// ---------------------------------------------------------------------------
function shadbalaPartial(grahas) {
  const per = {};
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    const g = grahas[p];
    const naisargika = NAISARGIKA_BALA[p];
    const strong = DIG_BALA_STRONG_HOUSE[p];
    const opp = ((strong + 6 - 1) % 12) + 1;
    const housesFromOpp = Math.min((g.house - opp + 12) % 12, (opp - g.house + 12) % 12); // 0..6
    const dig = housesFromOpp / 6;                                 // 0..1 rūpa (whole-sign approx)
    const ex = EXALTATION[p];
    const debilLon = ((ex.sign + 6) % 12) * 30 + (ex.deg || 0);
    const uccha = Math.abs(norm360(g.lon - debilLon + 180) - 180) / 180; // 0..1 rūpa
    const total = naisargika + dig + uccha;
    const required = SHADBALA_REQUIRED[p];
    per[p] = {
      naisargika: +naisargika.toFixed(3), dig: +dig.toFixed(3), uccha: +uccha.toFixed(3),
      total: +total.toFixed(3), required, ratio: +(total / required).toFixed(2), strong: total >= required,
    };
  }
  return { perGraha: per, note: 'Partial Ṣaḍbala — Naisargika + Dig + Uccha (exaltation) bala only, at whole-sign granularity; Kāla/Ceṣṭā/Dṛk balas omitted (heavy). Indicative, not authoritative.' };
}

// ---------------------------------------------------------------------------
//  A handful of yogas (whole-sign), core rules only.
// ---------------------------------------------------------------------------
function detectYogas(grahas) {
  const sign = p => grahas[p].rashiIndex;
  const moon = sign('Moon');
  const jupFromMoon = ((sign('Jupiter') - moon + 12) % 12) + 1;
  const adj = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].some(p => { const d = (sign(p) - moon + 12) % 12; return d === 0 || d === 1 || d === 11; });
  return [
    { name: 'Gajakesarī Yoga', present: [1, 4, 7, 10].includes(jupFromMoon), detail: 'Jupiter in a kendra from the Moon — wisdom, virtue, repute.' },
    { name: 'Budha-Āditya Yoga', present: sign('Sun') === sign('Mercury'), detail: 'Sun & Mercury together — intelligence & eloquence.' },
    { name: 'Candra-Maṅgala Yoga', present: sign('Moon') === sign('Mars'), detail: 'Moon & Mars together — drive & earning (can be harsh).' },
    { name: 'Kemadruma Yoga', present: !adj, detail: 'The Moon with no graha in her 2nd/12th nor conjunct — isolation (often cancelled).' },
  ];
}

// ---------------------------------------------------------------------------
//  castVedic(chart, opts) — the composed sidereal reading. `chart` is a
//  tropical castChart result. opts.currentDate selects the running daśā
//  (default = the chart moment). Never throws for a normal chart.
// ---------------------------------------------------------------------------
export function castVedic(chart, opts = {}) {
  const date = chart.date instanceof Date ? chart.date : new Date(chart.date);
  const currentDate = opts.currentDate instanceof Date ? opts.currentDate : date;
  const ayanamsa = lahiriAyanamsa(date);

  // sidereal longitudes of the 9 grahas + the Lagna
  const sid = {};
  for (const p of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) sid[p] = toSidereal(chart.planets[p].lon, date);
  const rahuLon = chart.planets.NorthNode ? toSidereal(chart.planets.NorthNode.lon, date) : toSidereal(chart.asc, date);
  sid.Rahu = rahuLon; sid.Ketu = norm360(rahuLon + 180);
  const lagnaLon = toSidereal(chart.asc, date);
  const lagnaR = rashiOf(lagnaLon);

  const grahas = {};
  const rashiByGraha = {};
  for (const p of GRAHAS) {
    const lon = sid[p], r = rashiOf(lon), nak = nakshatraOf(lon);
    const house = ((r.index - lagnaR.index + 12) % 12) + 1;
    const retro = p === 'Rahu' || p === 'Ketu' ? true : !!(chart.planets[p] && chart.planets[p].retrograde);
    rashiByGraha[p === 'Rahu' || p === 'Ketu' ? p : p] = r.index;
    grahas[p] = {
      lon, label: fmtSid(lon), sanskrit: GRAHA_SANSKRIT[p],
      rashiIndex: r.index, rashi: r.name, rashiSanskrit: r.sanskrit, deg: r.deg,
      retrograde: retro, nakshatra: nak, house,
      dignity: dignityOf(p, r.index, r.deg), karaka: KARAKAS[p],
    };
  }
  // Aṣṭakavarga uses only the 7 grahas + Lagna
  const avRashi = {}; for (const p of ASHTAKAVARGA_PLANETS) avRashi[p] = grahas[p].rashiIndex;

  // divisional charts
  const vargas = {};
  for (const v of VARGA_LIST) {
    const m = { lagna: vargaSign(lagnaLon, v.n) };
    for (const p of GRAHAS) m[p] = vargaSign(sid[p], v.n);
    vargas[v.key] = m;
  }

  const pancha = panchanga(sid.Sun, sid.Moon, date);
  const dasha = vimshottari(sid.Moon, date, currentDate);
  const av = ashtakavarga(avRashi, lagnaR.index);
  const shad = shadbalaPartial(grahas);
  const yogas = detectYogas(grahas);

  const citations = [
    'Sidereal positions = tropical (astronomy-engine) − Lahiri ayanāṁśa.',
    RASHI_SOURCE, NAKSHATRA_SOURCE, VIMSHOTTARI_SOURCE, DIGNITY_SOURCE, PANCHANGA_SOURCE,
    VARGA_SOURCE, ASHTAKAVARGA_SOURCE, SHADBALA_SOURCE,
    'Modelled on Jagannath Hora (P.V.R. Narasimha Rao); whole-sign houses; mean nodes for Rāhu/Ketu.',
  ];

  return {
    system: 'vedic', ayanamsa: +ayanamsa.toFixed(4), ayanamsaName: 'Lahiri (Citrāpakṣa)',
    lagna: { lon: lagnaLon, label: fmtSid(lagnaLon), rashiIndex: lagnaR.index, rashi: lagnaR.name, sanskrit: lagnaR.sanskrit, lord: lagnaR.lord, deg: lagnaR.deg, nakshatra: nakshatraOf(lagnaLon) },
    grahas, panchanga: pancha, vimshottari: dasha, vargas,
    navamsa: vargas.D9, ashtakavarga: av, shadbala: shad, yogas,
    citations,
    notes: 'Lahiri ayanāṁśa; whole-sign houses; Rāhu/Ketu from the mean node; Ṣaḍbala is partial (flagged). JHora-modelled.',
  };
}
