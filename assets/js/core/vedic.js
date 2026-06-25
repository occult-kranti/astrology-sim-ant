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
  ASHTAKAVARGA, ASHTAKAVARGA_PLANETS, SHADBALA_REQUIRED,
  NAISARGIKA_VIRUPA, DIG_POWERLESS_OFFSET, NATURAL_RELATION, SAPTAVARGA_TIER, SAPTAVARGA_VARGAS,
  DREKKANA_GROUPS, SHADBALA_BENEFICS, SHADBALA_MALEFICS, NATA_GRAHAS, UNNATA_GRAHAS,
  TRIBHAGA_DAY, TRIBHAGA_NIGHT, AYANA_NORTH_STRONG, MEAN_SPEED, SPECIAL_ASPECTS,
  RASHI_SOURCE, NAKSHATRA_SOURCE, VIMSHOTTARI_SOURCE, DIGNITY_SOURCE, PANCHANGA_SOURCE,
  VARGA_SOURCE, ASHTAKAVARGA_SOURCE, SHADBALA_SOURCE,
} from './data/vedic-data.js';
import { planetaryHour } from './planetary-hours.js';
import {
  GRAHA_MANTRAS, GRAHA_JAPA, GRAHA_DEVATAS, VARA as VARA_REMEDIES, NAKSHATRA_INFO,
  GRAHA_ASANA, VARA_ASANA, GRAHA_YANTRA, REMEDIES_FRAMING,
} from './data/vedic-remedies.js';

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
//  FULL six-fold Ṣaḍbala (Sthāna, Dig, Kāla, Ceṣṭā, Naisargika, Dṛk) per BPHS
//  Ch.27, computed in VIRŪPAS (1 rūpa = 60). Faithful to JHora with documented
//  simplifications (flagged in the returned `note`): Ceṣṭā via the eight
//  motional-states speed mapping; declination via the β≈0 approximation;
//  Abda/Māsa year/month lords from the Sun's sidereal position; Mercury counted
//  benefic for Pakṣa/Dṛk. SEVEN grahas only (the nodes carry no Ṣaḍbala).
// ---------------------------------------------------------------------------
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const r2 = x => Math.round(x * 100) / 100;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const fold180 = a => { const x = norm360(a); return x > 180 ? 360 - x : x; };   // 0..180
const signFold = a => { const x = norm360(a); return x > 180 ? x - 360 : x; };  // -180..180
const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

function declination(tropLon, eps) { return Math.asin(Math.sin(eps * D2R) * Math.sin(tropLon * D2R)) * R2D; }
function rightAscension(tropLon, eps) { return norm360(Math.atan2(Math.cos(eps * D2R) * Math.sin(tropLon * D2R), Math.cos(tropLon * D2R)) * R2D); }

function ojaYugma(p, signIndex) {
  const isOddSign = signIndex % 2 === 0;                  // Aries(idx0) = 1st = odd
  const wantsEven = p === 'Moon' || p === 'Venus';
  return (wantsEven ? !isOddSign : isOddSign) ? 15 : 0;
}
function cheshtaFromSpeed(p, speed) {
  const mean = MEAN_SPEED[p] || 1;
  if (speed == null) return 30;
  if (speed < 0) return 60;                               // Vakra (retrograde) — max effort
  if (Math.abs(speed) < 0.02 * mean) return 15;          // Vikala (stationary)
  const r = speed / mean;
  if (r < 0.5) return 7.5;                                // Mandatara
  if (r < 1.0) return 15;                                 // Manda
  if (r < 1.5) return 30;                                 // Sama / Chara
  return 45;                                              // Atichara
}
// BPHS graha-dṛṣṭi value (virūpas) by separation A (0..360); special full aspects
// are applied separately by the caller.
function drishtiValue(A) {
  if (A >= 30 && A < 60) return (A - 30) * 0.5;           // 30→0 .. 60→15
  if (A >= 60 && A < 90) return 15 + (A - 60) * 0.5;      // 60→15 .. 90→30
  if (A >= 90 && A < 120) return 30 + (A - 90) * 0.5;     // 90→30 .. 120→45
  if (A >= 120 && A < 150) return 45 - (A - 120) * 0.5;   // 120→45 .. 150→30
  if (A >= 150 && A < 180) return 30 + (A - 150);         // 150→30 .. 180→60 (full opposition)
  if (A >= 180 && A < 210) return 60 - (A - 180) * 2;     // 180→60 .. 210→0
  if (A >= 270 && A < 300) return (A - 270) * 0.5;        // 270→0 .. 300→15
  if (A >= 300 && A < 360) return 15 - (A - 300) * 0.25;  // 300→15 .. 360→0
  return 0;
}

// Compound (pañcadhā-maitrī) friendship → Saptavargaja tier virūpas, computed once
// between each pair of the 7 grahas (natural + temporary friendship from D1).
function compoundRelations(grahas) {
  const T = SAPTAVARGA_TIER, out = {};
  for (const a of SEVEN) {
    out[a] = {};
    const nat = NATURAL_RELATION[a];
    for (const b of SEVEN) {
      if (a === b) continue;
      const natural = nat.friend.includes(b) ? 'friend' : nat.enemy.includes(b) ? 'enemy' : 'neutral';
      const dist = ((grahas[b].rashiIndex - grahas[a].rashiIndex + 12) % 12) + 1;   // 1..12
      const tempFriend = [2, 3, 4, 10, 11, 12].includes(dist);
      out[a][b] = natural === 'friend' ? (tempFriend ? T.greatFriend : T.neutral)
        : natural === 'neutral' ? (tempFriend ? T.friend : T.enemy)
          : (tempFriend ? T.neutral : T.greatEnemy);
    }
  }
  return out;
}

function shadbala(chart, sid, grahas, lagnaLon, ph) {
  const eps = chart.obliquity != null ? chart.obliquity : 23.4367;
  const ramc = chart.ramc;
  const compound = compoundRelations(grahas);

  // shared temporal quantities (Kāla bala)
  let noonDist = null;                                    // 0 at local noon, 180 at midnight
  if (ramc != null) noonDist = Math.abs(signFold(ramc - rightAscension(chart.planets.Sun.lon, eps)));
  const unnata = noonDist == null ? 30 : (180 - noonDist) / 3;
  const nata = noonDist == null ? 30 : noonDist / 3;
  const moonPhaseBala = fold180(sid.Moon - sid.Sun) / 3;  // 0 (new) .. 60 (full)

  // Abda (year) & Māsa (month) lords from the Sun's sidereal position (~1-day approx)
  const dayMs = 86400000, meanSunSpeed = 0.9856, sunSid = sid.Sun, t0 = chart.date.getTime();
  const yearLord = VARA_LORDS[new Date(t0 - (sunSid / meanSunSpeed) * dayMs).getUTCDay()];
  const monthLord = VARA_LORDS[new Date(t0 - ((sunSid % 30) / meanSunSpeed) * dayMs).getUTCDay()];
  const varaLord = ph ? ph.dayRuler : VARA_LORDS[chart.date.getUTCDay()];
  const horaLord = ph ? ph.ruler : null;
  let tribhagaLord = null;
  if (ph) {
    const part = clamp(Math.floor((ph.isNight ? ph.hourNumber - 13 : ph.hourNumber - 1) / 4), 0, 2);
    tribhagaLord = ph.isNight ? TRIBHAGA_NIGHT[part] : TRIBHAGA_DAY[part];
  }

  const per = {};
  for (const p of SEVEN) {
    const g = grahas[p], ex = EXALTATION[p];
    // ---- Sthāna ----
    const debLon = ((ex.sign + 6) % 12) * 30 + (ex.deg || 0);
    const uccha = fold180(g.lon - debLon) / 3;             // 0..60
    let sapta = 0;
    for (const n of SAPTAVARGA_VARGAS) {
      const vs = vargaSign(sid[p], n), lord = RASHIS[vs].lord;
      sapta += (lord === p) ? (MOOLATRIKONA[p] === vs ? SAPTAVARGA_TIER.moolatrikona : SAPTAVARGA_TIER.own) : compound[p][lord];
    }
    const oja = ojaYugma(p, g.rashiIndex) + ojaYugma(p, vargaSign(sid[p], 9));
    const kendradi = [1, 4, 7, 10].includes(g.house) ? 60 : [2, 5, 8, 11].includes(g.house) ? 30 : 15;
    const drekkana = DREKKANA_GROUPS[Math.min(2, Math.floor(g.deg / 10))].includes(p) ? 15 : 0;
    const sthana = uccha + sapta + oja + kendradi + drekkana;
    // ---- Dig ----
    const dig = fold180(g.lon - norm360(lagnaLon + DIG_POWERLESS_OFFSET[p])) / 3;
    // ---- Ayana (declination) ----
    const decl = declination(chart.planets[p].lon, eps), k = Math.abs(decl);
    const aligned = p === 'Mercury' ? true : AYANA_NORTH_STRONG.includes(p) ? decl >= 0 : decl < 0;
    let ayana = ((aligned ? 24 + k : 24 - k) / 48) * 60;
    if (p === 'Sun') ayana *= 2;
    // ---- Kāla ----
    const natho = p === 'Mercury' ? 60 : NATA_GRAHAS.includes(p) ? nata : unnata;
    const paksha = SHADBALA_BENEFICS.includes(p) ? moonPhaseBala * 2 : (60 - moonPhaseBala);
    const tribhaga = (tribhagaLord === p ? 60 : 0) + (p === 'Jupiter' ? 60 : 0);
    const abda = p === yearLord ? 15 : 0, masa = p === monthLord ? 30 : 0;
    const vara = p === varaLord ? 45 : 0, hora = horaLord === p ? 60 : 0;
    // ---- Ceṣṭā ----
    const cheshta = p === 'Sun' ? ayana : p === 'Moon' ? paksha : cheshtaFromSpeed(p, chart.planets[p].speed);
    // ---- Naisargika ----
    const naisargika = NAISARGIKA_VIRUPA[p];
    // ---- Dṛk ----
    let benefic = 0, malefic = 0;
    for (const a of SEVEN) {
      if (a === p) continue;
      let v = drishtiValue(norm360(g.lon - grahas[a].lon));
      const houseDist = ((g.rashiIndex - grahas[a].rashiIndex + 12) % 12) + 1;
      if (houseDist === 7 || (SPECIAL_ASPECTS[a] && SPECIAL_ASPECTS[a].includes(houseDist))) v = 60;
      if (SHADBALA_BENEFICS.includes(a)) benefic += v; else malefic += v;
    }
    const drik = (benefic - malefic) / 4;
    const kalaNoYuddha = natho + paksha + tribhaga + abda + masa + vara + hora + ayana;
    per[p] = {
      _sthana: { uccha: r2(uccha), saptavargaja: r2(sapta), ojaYugma: oja, kendradi, drekkana, total: r2(sthana) },
      _dig: r2(dig), _kala: { nathonnata: r2(natho), paksha: r2(paksha), tribhaga, abda, masa, vara, hora, ayana: r2(ayana), yuddha: 0 },
      _cheshta: r2(cheshta), _naisargika: r2(naisargika), _drik: r2(drik),
      _uccha: uccha, _cheshtaRaw: cheshta, _kalaSum: kalaNoYuddha, _sixNoYuddha: sthana + dig + kalaNoYuddha + cheshta + naisargika + drik,
    };
  }
  // Yuddha (planetary war) — non-luminary pairs within 1°
  const WAR = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  for (let i = 0; i < WAR.length; i++) for (let j = i + 1; j < WAR.length; j++) {
    const A = WAR[i], B = WAR[j];
    if (fold180(grahas[A].lon - grahas[B].lon) < 1) {
      const d = Math.abs(per[A]._sixNoYuddha - per[B]._sixNoYuddha) / 2;
      const win = grahas[A].lon <= grahas[B].lon ? A : B, lose = win === A ? B : A;
      per[win]._kala.yuddha = r2(per[win]._kala.yuddha + d);
      per[lose]._kala.yuddha = r2(per[lose]._kala.yuddha - d);
    }
  }
  const out = {};
  for (const p of SEVEN) {
    const x = per[p];
    const kalaTotal = r2(x._kalaSum + x._kala.yuddha);
    const totalV = x._sthana.total + x._dig + kalaTotal + x._cheshta + x._naisargika + x._drik;
    const rupas = totalV / 60, required = SHADBALA_REQUIRED[p];
    const uc = clamp(x._uccha, 0, 60), ch = clamp(x._cheshtaRaw, 0, 60);
    out[p] = {
      sthana: x._sthana, dig: x._dig, kala: { ...x._kala, total: kalaTotal }, cheshta: x._cheshta, naisargika: x._naisargika, drik: x._drik,
      totalVirupa: r2(totalV), totalRupa: r2(rupas), required, ratio: r2(rupas / required), strong: rupas >= required,
      ishta: r2(Math.sqrt(uc * ch)), kashta: r2(Math.sqrt((60 - uc) * (60 - ch))),
    };
  }
  const ranked = Object.entries(out).sort((a, b) => b[1].ratio - a[1].ratio).map(([k]) => k);
  return {
    perGraha: out, order: ranked, strongest: ranked[0], weakest: ranked[ranked.length - 1],
    timeLords: { yearLord, monthLord, varaLord, horaLord, tribhagaLord },
    units: 'virūpas (1 rūpa = 60 virūpas); required minimums in rūpas',
    note: 'Full six-fold Ṣaḍbala (Sthāna, Dig, Kāla, Ceṣṭā, Naisargika, Dṛk) per BPHS Ch.27, in virūpas. Faithful to Jagannath Hora with documented simplifications: Ceṣṭā via the eight motional-states (speed) mapping; declination via the β≈0 approximation; the Abda/Māsa year/month lords from the Sun’s sidereal position (~1-day); Mercury counted benefic for Pakṣa/Dṛk. It reproduces the tradition’s own strength ranking — astrology has no demonstrated predictive validity.',
  };
}

// ---------------------------------------------------------------------------
//  buildPractice — the traditional daily (vāra) + birth-based devotional practice,
//  DERIVED from the chart (not hardcoded): the day's weekday-lord drives the daily
//  mantra/āsana/observance; the WEAKEST graha by Ṣaḍbala (the one the remedial
//  tradition would propitiate), the Lagna lord, the running daśā lord and the
//  birth Moon's nakṣatra drive the birth practice. CULTURAL/DEVOTIONAL PRACTICE,
//  DESCRIBED — NOT PRESCRIBED. The graha→āsana map is modern/syncretic (flagged).
// ---------------------------------------------------------------------------
function buildPractice(chart, grahas, lagnaR, dasha, shad, currentDate) {
  const wd = (currentDate instanceof Date ? currentDate : new Date()).getUTCDay();
  const vr = VARA_REMEDIES[wd], dayLord = vr.lord;
  const dayM = GRAHA_MANTRAS[dayLord], dayA = GRAHA_ASANA[dayLord], dayY = GRAHA_YANTRA[dayLord];
  const vara = {
    name: vr.name, sanskrit: vr.sanskrit, graha: dayLord, deity: vr.deity, vrata: vr.vrata,
    colour: vr.colour, offering: vr.offering, popular: !!vr.popular,
    mantra: dayM.namaIAST, bija: dayM.bijaIAST, japa: dayM.japa,
    yoga: dayA ? `${dayA.primaryIAST} (${dayA.primaryEN})` : null,
    yantra: dayY ? dayY.yantraName : null, source: vr.source,
  };
  const focusGraha = (shad && shad.weakest) || lagnaR.lord;
  const fm = GRAHA_MANTRAS[focusGraha], fa = GRAHA_ASANA[focusGraha], fy = GRAHA_YANTRA[focusGraha];
  const moonNak = grahas.Moon.nakshatra, nakInfo = NAKSHATRA_INFO[moonNak.num - 1];
  const dashaLord = dasha ? dasha.currentMaha : null;
  const birth = {
    focusGraha,
    reason: shad && shad.perGraha[focusGraha] ? `the weakest graha by Ṣaḍbala (${shad.perGraha[focusGraha].ratio}× its required strength) — the one the remedial tradition would propitiate` : 'the Lagna lord',
    lagnaLord: lagnaR.lord, dashaLord,
    moonNakshatra: moonNak.name, moonNakshatraDeity: nakInfo ? nakInfo.deity : moonNak.deity,
    moonNakshatraMeaning: nakInfo ? nakInfo.significance : '',
    mantra: fm.namaIAST, bija: fm.bijaIAST, japa: fm.japa, deity: fm.mainDeity,
    yoga: fa ? `${fa.primaryIAST} (${fa.primaryEN})` : null,
    yantra: fy ? `${fy.yantraName} (magic-square constant ${fy.yantraConstant})` : null,
    gem: fy ? fy.gem : null, metal: fy ? fy.metal : null,
    dashaMantra: dashaLord && GRAHA_MANTRAS[dashaLord] ? GRAHA_MANTRAS[dashaLord].namaIAST : null,
  };
  return {
    vara, birth, asanaIsModern: true, framing: REMEDIES_FRAMING,
    source: 'Mantra Mahodadhi / Navagraha Stotra (mantras & japa); Purāṇic vāra-vrata calendar (weekday deity/vrata/colour); graha-yantra & ratna tradition (yantra/gem/metal); modern astro-yoga (āsana — flagged classical:false). Cultural/devotional practice recorded for study, never prescribed.',
  };
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
//  buildVedicConclusions(v) — a COMPUTED, described-not-prescribed interpretive
//  layer. Pure deterministic templates filled from the reading `v` (NO LLM).
//  Turns the numbers into the tradition's own language, BPHS-cited, then closes
//  with the honest caveat. Astrology has no demonstrated predictive validity;
//  this DESCRIBES how Jyotiṣa reads a chart — it never prescribes or forecasts.
// ---------------------------------------------------------------------------
// GRAHA → one-line significance (kāraka role). Source: BPHS — graha kāraka.
const GRAHA_SIGNIFICANCE = {
  Sun:     { sig: 'the soul, father, authority and vitality',        verb: 'self-expression, confidence and standing' },
  Moon:    { sig: 'the mind, mother, emotion and the public',        verb: 'mental ease, receptivity and rapport' },
  Mars:    { sig: 'energy, courage, siblings and conflict',          verb: 'drive, initiative and the capacity to act' },
  Mercury: { sig: 'intellect, speech, commerce and learning',        verb: 'reasoning, communication and skill' },
  Jupiter: { sig: 'wisdom, children, wealth and dharma',             verb: 'growth, faith, guidance and good fortune' },
  Venus:   { sig: 'love, marriage, art and pleasure',                verb: 'harmony, affection and refinement' },
  Saturn:  { sig: 'discipline, longevity, labour and delay',         verb: 'endurance, structure and patient effort' },
  Rahu:    { sig: 'obsession, foreignness, illusion and sudden rise', verb: 'ambition and unconventional reach' },
  Ketu:    { sig: 'detachment, the past, and mokṣa',                  verb: 'withdrawal, insight and letting-go' },
};
// BHĀVA (1..12) → life-area (Parāśarī bhāvādhyāya). Source: BPHS.
const BHAVA_LIFE_AREA = [
  { n: 1, name: 'Tanu (body/self)', area: 'the self, body, vitality and overall life-direction' },
  { n: 2, name: 'Dhana (wealth)', area: 'wealth, family, speech and accumulated resources' },
  { n: 3, name: 'Sahaja (siblings)', area: 'courage, siblings, effort and skill of hand' },
  { n: 4, name: 'Sukha (home/heart)', area: 'home, mother, land, vehicles and inner contentment' },
  { n: 5, name: 'Putra (children/mind)', area: 'children, intelligence, creativity and past merit' },
  { n: 6, name: 'Ari (adversity)', area: 'illness, debt, enemies and daily obstacles overcome' },
  { n: 7, name: 'Yuvati (partnership)', area: 'marriage, the spouse and open dealings with others' },
  { n: 8, name: 'Randhra (transformation)', area: 'longevity, upheaval, the hidden, inheritance and the occult' },
  { n: 9, name: 'Dharma (fortune)', area: 'fortune, the father, dharma, the guru and higher learning' },
  { n: 10, name: 'Karma (career)', area: 'career, status, public action and one’s work in the world' },
  { n: 11, name: 'Lābha (gains)', area: 'gains, income, networks and fulfilled desires' },
  { n: 12, name: 'Vyaya (loss/release)', area: 'expenditure, loss, foreign lands, seclusion and mokṣa' },
];
const ELEMENT_NATURE = { Fire: 'ardent and self-driving', Earth: 'grounded and practical', Air: 'communicative and relational', Water: 'feeling and receptive' };
const MODE_NATURE = { Movable: 'initiating and restless', Fixed: 'steady and persevering', Dual: 'adaptable and dual-natured' };
const ORD12 = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const ordinal = n => ORD12[n] || `${n}th`;

export function buildVedicConclusions(v) {
  const sections = [], g = v.grahas;
  // (a) Lagna & its lord
  const lr = v.lagna.lord, lrG = g[lr], lagRashi = RASHIS[v.lagna.rashiIndex];
  const rashiNature = `${ELEMENT_NATURE[lagRashi.element]}, ${MODE_NATURE[lagRashi.mode]}`;
  const lordBhava = BHAVA_LIFE_AREA[lrG.house - 1];
  const dignityClause = d => d.state === 'Neutral' ? '' : d.state === 'Debilitated' ? ', and there weakened (debilitated)' : `, and there well-placed (${d.state.toLowerCase()})`;
  sections.push({ title: 'The Lagna and its lord', text: `The Lagna is ${v.lagna.rashi} (${v.lagna.sanskrit}) — a ${rashiNature} sign — rising in nakṣatra ${v.lagna.nakshatra.name}, so the chart's temperament and body are read through ${lr}, its lord. ${lr} sits in the ${ordinal(lrG.house)} bhāva (${lordBhava.name}: ${lordBhava.area})${dignityClause(lrG.dignity)}, turning the life's main emphasis toward ${lordBhava.area.split(',')[0]}. (BPHS — the Lagna as the chart's foundation; its lord's bhāva colours the whole life.)` });
  // (b) Strongest & weakest graha by Ṣaḍbala
  const sb = v.shadbala, st = sb.strongest, wk = sb.weakest, sS = sb.perGraha[st], sW = sb.perGraha[wk];
  const weakNuance = sW.kashta > sW.ishta ? ' Its Kaṣṭa exceeds its Iṣṭa — the classic profile of a graha the texts single out for propitiation.' : ' Even so its Iṣṭa is not eclipsed.';
  sections.push({ title: 'Strength of the grahas (Ṣaḍbala)', text: `By the six-fold Ṣaḍbala the strongest graha is ${st} (${sS.ratio}× its required strength; Iṣṭa ${sS.ishta} vs Kaṣṭa ${sS.kashta}), so ${GRAHA_SIGNIFICANCE[st].sig} are expressed most freely — a capacity for ${GRAHA_SIGNIFICANCE[st].verb}. The weakest is ${wk} (${sW.ratio}× required; Iṣṭa ${sW.ishta} vs Kaṣṭa ${sW.kashta}) — governing ${GRAHA_SIGNIFICANCE[wk].sig} — the graha the remedial tradition would seek to strengthen.${weakNuance} (BPHS Ch. 27 — required minimums; Iṣṭa = benefic yield, Kaṣṭa its difficult counterpart.)` });
  // (c) Running Vimśottarī mahā / antar daśā
  const mh = v.vimshottari.currentMaha, an = v.vimshottari.currentAntar;
  const antarClause = an ? `, presently sub-coloured by the ${an} antardaśā (${GRAHA_SIGNIFICANCE[an].sig})` : '';
  const antarNuance = (an && an !== mh) ? `The antara lord is the near-term tone within the mahā's larger arc — here, ${GRAHA_SIGNIFICANCE[mh].verb} inflected by ${GRAHA_SIGNIFICANCE[an].verb}.` : `The mahā lord also runs its own antara, doubling its emphasis.`;
  sections.push({ title: 'The current daśā period', text: `The running mahādaśā is ${mh} (the sequence balanced from the Moon in ${v.vimshottari.nakshatra.name}), so the tradition reads this long chapter of life through ${mh}'s themes — ${GRAHA_SIGNIFICANCE[mh].sig}${antarClause}. ${antarNuance} (BPHS — the Vimśottarī daśā unfolds the kāraka of the period-lord.)` });
  // (d) Aṣṭakavarga by bhāva
  const bhavaSav = [];
  for (let n = 1; n <= 12; n++) { const si = (v.lagna.rashiIndex + n - 1) % 12; bhavaSav.push({ n, bindus: v.ashtakavarga.sav[si] }); }
  const top = bhavaSav.reduce((a, b) => (b.bindus > a.bindus ? b : a)), low = bhavaSav.reduce((a, b) => (b.bindus < a.bindus ? b : a));
  const topArea = BHAVA_LIFE_AREA[top.n - 1], lowArea = BHAVA_LIFE_AREA[low.n - 1];
  sections.push({ title: 'Aṣṭakavarga — the supported & the strained bhāvas', text: top.n === low.n ? `The Sarvāṣṭakavarga is unusually even across the bhāvas (around the per-bhāva mean of 28); no single area stands out. (BPHS Ch. 66–67.)` : `Reckoning the Sarvāṣṭakavarga by bhāva from the Lagna, the best-supported is the ${ordinal(top.n)} (${topArea.name}, ${top.bindus} bindus — above the mean of 28), favouring ${topArea.area}. The least-supported is the ${ordinal(low.n)} (${lowArea.name}, ${low.bindus} bindus), the area the tradition reads as needing most care: ${lowArea.area}. (BPHS Ch. 66–67 — the SAV grades each bhāva; 28 is the per-bhāva mean.)` });
  // (e) Present yogas
  const present = (v.yogas || []).filter(y => y.present);
  sections.push({ title: 'Yogas present in the chart', text: present.length ? `The chart shows ${present.length === 1 ? 'one classical yoga' : present.length + ' classical yogas'}: ${present.map(y => `${y.name} — ${y.detail}`).join('; ')} (named planetary combinations of classical Jyotiṣa / BPHS).` : `None of the yogas this engine checks (Gajakesarī, Budha-Āditya, Candra-Maṅgala, Kemadruma) are formed in this chart.`, yogas: present.map(y => ({ name: y.name, detail: y.detail })) });
  // (f) Birth Moon's nakṣatra
  const mn = g.Moon.nakshatra, nakInfo = NAKSHATRA_INFO[mn.num - 1] || {};
  sections.push({ title: 'The mind — the Moon’s nakṣatra', text: `The Moon — kāraka of the mind (manas), mother and emotion — lies in ${mn.name} (pada ${mn.pada}), whose devatā is ${nakInfo.deity || mn.deity}. The tradition reads the native's instinctive mind through this mansion's theme: ${nakInfo.significance || ''} (TS 4.4.10 nakṣatra-devatā list as carried in BPHS; the Moon as kāraka of manas.)`.trim() });
  // (g) Final honest conclusion
  const dashaLabel = (an && an !== mh) ? `${mh}–${an}` : mh;
  const conclusion = `Drawing the threads together: this chart's native strength lies with ${st} (${GRAHA_SIGNIFICANCE[st].sig}); it is presently living its ${dashaLabel} daśā (${GRAHA_SIGNIFICANCE[mh].sig}); and the tradition's remedial attention would fall on ${wk} as the weakest significator (${GRAHA_SIGNIFICANCE[wk].sig}). Read in the tradition's own terms, the emphasis is on ${GRAHA_SIGNIFICANCE[st].verb} carried through a period of ${GRAHA_SIGNIFICANCE[mh].verb}. However — and this is essential — Vedic astrology, like all astrology, has no demonstrated predictive validity. Everything above is a faithful reconstruction of how the Jyotiṣa tradition DESCRIBES a chart, offered for study and cultural interest. It is described, never prescribed: nothing here forecasts your life, and no decision should rest on it.`;
  return { sections, conclusion };
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
  let ph = null; try { ph = planetaryHour(date, chart.latitude, chart.longitude); } catch { ph = null; }
  const shad = shadbala(chart, sid, grahas, lagnaLon, ph);
  const yogas = detectYogas(grahas);
  // traditional daily (vāra) + birth-based devotional practice — derived from the
  // chart (weekday lord, weakest graha by Ṣaḍbala, Lagna lord, daśā lord, Moon
  // nakṣatra). Cultural/devotional practice, described — never prescribed.
  const practice = buildPractice(chart, grahas, lagnaR, dasha, shad, currentDate);

  const citations = [
    'Sidereal positions = tropical (astronomy-engine) − Lahiri ayanāṁśa.',
    RASHI_SOURCE, NAKSHATRA_SOURCE, VIMSHOTTARI_SOURCE, DIGNITY_SOURCE, PANCHANGA_SOURCE,
    VARGA_SOURCE, ASHTAKAVARGA_SOURCE, SHADBALA_SOURCE,
    'Modelled on Jagannath Hora (P.V.R. Narasimha Rao); whole-sign houses; mean nodes for Rāhu/Ketu.',
  ];

  const out = {
    system: 'vedic', ayanamsa: +ayanamsa.toFixed(4), ayanamsaName: 'Lahiri (Citrāpakṣa)',
    lagna: { lon: lagnaLon, label: fmtSid(lagnaLon), rashiIndex: lagnaR.index, rashi: lagnaR.name, sanskrit: lagnaR.sanskrit, lord: lagnaR.lord, deg: lagnaR.deg, nakshatra: nakshatraOf(lagnaLon) },
    grahas, panchanga: pancha, vimshottari: dasha, vargas,
    navamsa: vargas.D9, ashtakavarga: av, shadbala: shad, yogas, practice,
    citations,
    notes: 'Lahiri ayanāṁśa; whole-sign houses; Rāhu/Ketu from the mean node; full six-fold Ṣaḍbala (with documented JHora simplifications). JHora-modelled.',
  };
  // computed interpretive conclusions & advice (deterministic, described-not-prescribed)
  try { out.conclusions = buildVedicConclusions(out); } catch { out.conclusions = null; }
  return out;
}
