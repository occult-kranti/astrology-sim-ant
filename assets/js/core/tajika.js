// ============================================================================
//  tajika.js — TĀJIKA VARṢAPHALA: the Indo-Persian annual chart (the sidereal
//  "solar return" of Jyotiṣa), computed on the site's existing engines.
//
//  What it computes, all per Balabhadra's Hāyanaratna (1649; critical edition
//  and translation M. Gansten, The Jewel of Annual Astrology, Brill 2020):
//   · VARṢA-PRAVEŚA — the instant the Sun regains its natal SIDEREAL
//     longitude (the tropical bisection of solar-return.js, re-targeted with
//     the time-dependent Lahiri ayanāṁśa), and the annual chart cast for it.
//   · MUNTHĀ — the natal ascendant sign advanced one sign per completed year.
//   · VARṢEŚVARA — the ruler of the year from the five candidates, with the
//     aspect-to-lagna precondition primary and the no-aspect four-way dispute
//     surfaced, never silently resolved.
//   · TĀJIKA ASPECTS & YOGAS — sign-based aspects with the deeptāṁśa orbs;
//     itthaśāla/īsarāpha (the Arabic applying/separating that Lilly also
//     inherited) including the past-by-<1° carve-out; ikkavāla, induvāra,
//     nakta, yamayā, kambūla.
//   · SAHAMS — the verified core dozen with day formulas, night reversal and
//     the contested +30° correction.
//
//  PURE / HEADLESS: no DOM. HONEST FRAMING (locked): a historical calculation
//  grammar with no demonstrated predictive validity — described, never
//  prescribed; every contested value is flagged in-data (tajika-data.js).
// ============================================================================
import { castChart, norm360, signOf } from './astro.js';
import { solarReturnInstant } from './solar-return.js';
import { castVedic } from './vedic.js';
import { lahiriAyanamsa, toSidereal, RASHIS } from './data/vedic-data.js';
import {
  DEEPTAMSA, DEEPTAMSA_RECORD, TAJIKA_ASPECT_CLASSES, TAJIKA_ASPECT_SOURCE,
  TAJIKA_TRIPLICITY, SIGN_ELEMENTS, MUNTHA_RECORD, VARSHESHVARA_RECORD,
  TAJIKA_YOGAS, SAHAMS, SAHAM_CORRECTION_RECORD, SAHAM_COUNTS_NOTE,
  VARSHA_PRAVESHA_RECORD, TRANSMISSION_NOTE, TAJIKA_CITATION,
} from './data/tajika-data.js';

const SEVEN = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
// Mean daily motions (°/day) — fallback ordering of "swifter" when a speed is
// missing; the live chart's actual speeds take precedence.
const MEAN_SPEED = { Moon: 13.1764, Mercury: 1.3833, Venus: 1.2, Sun: 0.9856, Mars: 0.5240, Jupiter: 0.0831, Saturn: 0.0334 };
const PURNA_ARC = 0.5 / 60; // "within about half a minute of arc" — pūrṇa itthaśāla

// ---------------------------------------------------------------------------
//  Munthā
// ---------------------------------------------------------------------------
// munthā sign index = (natal Asc sign index + completed years) mod 12.
export function munthaSign(natalAscIndex, completedYears) {
  return ((natalAscIndex % 12) + 12 + Math.floor(completedYears)) % 12;
}

// Full munthā record: sign, lord, whole-sign house in the annual chart.
export function muntha(natalAscIndex, completedYears, annualLagnaIndex) {
  const idx = munthaSign(natalAscIndex, completedYears);
  const r = RASHIS[idx];
  return {
    rashiIndex: idx, rashi: r.name, sanskrit: r.sanskrit, lord: r.lord,
    house: ((idx - annualLagnaIndex + 12) % 12) + 1,
    completedYears: Math.floor(completedYears),
    monthlyMotion: MUNTHA_RECORD.monthlyMotion,
    cite: MUNTHA_RECORD.cite,
  };
}

// ---------------------------------------------------------------------------
//  The Tājika day/night triplicity lord (tri-rāśi-pati) of a sign.
// ---------------------------------------------------------------------------
export function tajikaTriplicityLord(signIndex, isDay) {
  const idx = ((signIndex % 12) + 12) % 12;
  return (isDay ? TAJIKA_TRIPLICITY.day : TAJIKA_TRIPLICITY.night)[SIGN_ELEMENTS[idx % 4]];
}

// ---------------------------------------------------------------------------
//  Tājika aspect between two SIGNS (whole-sign counted, inclusive: 1 = same
//  sign … 7 = opposite). Returns the aspect class or null (2/6/8/12 = none).
// ---------------------------------------------------------------------------
export function tajikaAspect(fromSignIndex, toSignIndex) {
  const count = ((toSignIndex - fromSignIndex + 12) % 12) + 1;
  const cls = TAJIKA_ASPECT_CLASSES.find(c => c.offsets.includes(count));
  if (!cls) return null;
  return { count, key: cls.key, name: cls.name, friendly: cls.friendly, strength: cls.strength, cite: cls.cite };
}

export function deeptamsaOrb(planet) { return DEEPTAMSA[planet]; }

// ---------------------------------------------------------------------------
//  tajikaPair — the itthaśāla/īsarāpha judgment for one planet pair.
//  pos = { lon, speed } with lon in the frame of the chart being judged
//  (sidereal for the varṣa chart; the sign relations are frame-consistent).
//
//  Doctrine (Hāyanaratna ch.3 §§3–4): in a Tājika aspect, the SWIFTER planet
//  at fewer degrees (within its sign) than the slower = applying = itthaśāla,
//  within the orbs of light or within 12°; past exactness by a full 1° =
//  īsarāpha (Tājikabhūṣaṇa 4.10); past by LESS than 1° is still itthaśāla per
//  "the ancient commentator" — a documented divergence from the Western
//  applying flag of aspects.js for that sliver.
// ---------------------------------------------------------------------------
export function tajikaPair(nameA, posA, nameB, posB) {
  const sA = signOf(posA.lon), sB = signOf(posB.lon);
  const aspect = tajikaAspect(sA.index, sB.index);
  const base = { a: nameA, b: nameB, aspect, verdict: null, grade: null, carveOut: false, bhavishyat: false, active: false };
  if (!aspect) return base;

  const speed = (name, pos) => {
    const s = pos.speed != null ? Math.abs(pos.speed) : NaN;
    return Number.isFinite(s) && s > 0 ? s : MEAN_SPEED[name] || 0;
  };
  const aFaster = speed(nameA, posA) >= speed(nameB, posB);
  const fast = aFaster ? { name: nameA, s: sA } : { name: nameB, s: sB };
  const slow = aFaster ? { name: nameB, s: sB } : { name: nameA, s: sA };

  const degFast = fast.s.degInSign, degSlow = slow.s.degInSign;
  const diff = degSlow - degFast;               // > 0 ⇒ the swifter is behind (applying)
  const gap = Math.abs(diff);
  const orbFast = DEEPTAMSA[fast.name], orbSlow = DEEPTAMSA[slow.name];
  const withinOwnOrbs = gap <= orbFast && gap <= orbSlow;
  const withinTwelve = gap <= 12;
  const active = withinOwnOrbs || withinTwelve; // the text's own rule, disjunctive — both flags reported
  const halfSum = (orbFast + orbSlow) / 2;      // UNVERIFIED-in-sources convention (≡ the repo's Lilly moiety rule) — comparison only
  const withinHalfSum = gap <= halfSum;

  let verdict = null, grade = null, carveOut = false;
  if (active) {
    if (diff >= 0) {
      verdict = 'itthasala';
      grade = diff <= PURNA_ARC ? 'pūrṇa' : 'vartamāna';
    } else if (gap < 1) {
      // past exactness by LESS than one degree — still itthaśāla ("the ancient
      // commentator", Hāyanaratna ch.3 §4). Diverges from aspects.js applying=false.
      verdict = 'itthasala'; grade = 'vartamāna'; carveOut = true;
    } else {
      verdict = 'isarapha';
    }
  }
  // bhaviṣyat itthaśāla — the swifter planet in the last degree of its sign,
  // about to apply across the boundary (delayed result) — Hāyanaratna ch.3 §3.
  const bhavishyat = degFast >= 29 && !!tajikaAspect((fast.s.index + 1) % 12, slow.s.index);

  return {
    ...base, aspect, active, verdict, grade, carveOut, bhavishyat,
    faster: fast.name, slower: slow.name, degFaster: degFast, degSlower: degSlow, gap,
    orbs: { [fast.name]: orbFast, [slow.name]: orbSlow },
    withinOwnOrbs, withinTwelve, halfSum, withinHalfSum,
    cite: 'Hāyanaratna ch.3 §3 (doc1500905) and §4 (doc1500906), trans. Gansten (Brill 2020).',
  };
}

// All 21 pairs of the seven planets. bodies = { name: { lon, speed } }.
export function tajikaAspectTable(bodies) {
  const out = [];
  for (let i = 0; i < SEVEN.length; i++) for (let j = i + 1; j < SEVEN.length; j++) {
    if (bodies[SEVEN[i]] && bodies[SEVEN[j]])
      out.push(tajikaPair(SEVEN[i], bodies[SEVEN[i]], SEVEN[j], bodies[SEVEN[j]]));
  }
  return out;
}

// ---------------------------------------------------------------------------
//  The named yogas over the annual chart (whole-sign houses from lagnaIndex).
//  Nakta/yamayā/kambūla are scanned GENERICALLY across the seven planets; the
//  classical statements bind them to the rulers of the ascendant and of the
//  matter sought — the page says so.
// ---------------------------------------------------------------------------
export function detectTajikaYogas(bodies, lagnaIndex) {
  const CADENT = [3, 6, 9, 12];
  const houseOfP = name => ((signOf(bodies[name].lon).index - lagnaIndex + 12) % 12) + 1;
  const houses = {}; for (const p of SEVEN) if (bodies[p]) houses[p] = houseOfP(p);
  const hs = Object.values(houses);
  const ikkavala = hs.length === 7 && hs.every(h => !CADENT.includes(h));
  const induvara = hs.length === 7 && hs.every(h => CADENT.includes(h));

  const spd = name => {
    const s = bodies[name].speed != null ? Math.abs(bodies[name].speed) : NaN;
    return Number.isFinite(s) && s > 0 ? s : MEAN_SPEED[name] || 0;
  };
  const naktas = [], yamayas = [], kambulas = [];
  const pairs = tajikaAspectTable(bodies);
  const itthasalas = pairs.filter(p => p.verdict === 'itthasala');

  for (let i = 0; i < SEVEN.length; i++) for (let j = i + 1; j < SEVEN.length; j++) {
    const A = SEVEN[i], B = SEVEN[j];
    if (!bodies[A] || !bodies[B]) continue;
    if (tajikaAspect(signOf(bodies[A].lon).index, signOf(bodies[B].lon).index)) continue; // yogas require NO mutual aspect
    for (const C of SEVEN) {
      if (C === A || C === B || !bodies[C]) continue;
      // NAKTA — a swifter intermediary separates from one and applies to the other.
      if (spd(C) > spd(A) && spd(C) > spd(B)) {
        const ca = tajikaPair(C, bodies[C], A, bodies[A]);
        const cb = tajikaPair(C, bodies[C], B, bodies[B]);
        if (ca.verdict === 'isarapha' && cb.verdict === 'itthasala') naktas.push({ from: A, to: B, via: C });
        if (cb.verdict === 'isarapha' && ca.verdict === 'itthasala') naktas.push({ from: B, to: A, via: C });
      }
      // YAMAYĀ — a slower collector receives the application of both.
      if (spd(C) < spd(A) && spd(C) < spd(B)) {
        const ac = tajikaPair(A, bodies[A], C, bodies[C]);
        const bc = tajikaPair(B, bodies[B], C, bodies[C]);
        if (ac.verdict === 'itthasala' && bc.verdict === 'itthasala') yamayas.push({ pair: [A, B], collector: C });
      }
    }
  }
  // KAMBŪLA — an itthaśāla pair assisted by a lunar itthaśāla with either member.
  for (const p of itthasalas) {
    if (p.a === 'Moon' || p.b === 'Moon') continue;
    const withA = tajikaPair('Moon', bodies.Moon, p.a, bodies[p.a]);
    const withB = tajikaPair('Moon', bodies.Moon, p.b, bodies[p.b]);
    if (withA.verdict === 'itthasala' || withB.verdict === 'itthasala') {
      kambulas.push({ pair: [p.a, p.b], moonWith: withA.verdict === 'itthasala' ? p.a : p.b, gradingNote: TAJIKA_YOGAS.find(y => y.key === 'kambula').grading });
    }
  }
  return {
    houses, ikkavala, induvara, naktas, yamayas, kambulas,
    itthasalaCount: itthasalas.length,
    isaraphaCount: pairs.filter(p => p.verdict === 'isarapha').length,
    definitions: TAJIKA_YOGAS,
    scanNote: 'Nakta/yamayā/kambūla are scanned generically across the seven planets; the classical statements bind them to the rulers of the ascendant and of the matter sought.',
    cite: 'Hāyanaratna ch.3 (doc1500902–1500918), trans. Gansten (Brill 2020).',
  };
}

// ---------------------------------------------------------------------------
//  Sahams
// ---------------------------------------------------------------------------
// The shared evaluator: saham = minuend − subtrahend + added (mod 360), plus
// the between-arc +30° correction keyed on the ADDED point: if it does not
// lie in the arc from the subtrahend FORWARD to the minuend, add one sign.
// Both the degree-granular (operational) and sign-granular readings are
// computed; the record notes whether they agree (they do on all test vectors).
export function computeSaham(minuendLon, subtrahendLon, addedLon) {
  const raw = norm360(minuendLon - subtrahendLon + addedLon);
  const arc = norm360(minuendLon - subtrahendLon);
  const pos = norm360(addedLon - subtrahendLon);
  const inside = pos <= arc;
  const sM = Math.floor(norm360(minuendLon) / 30), sS = Math.floor(norm360(subtrahendLon) / 30), sC = Math.floor(norm360(addedLon) / 30);
  const insideSign = ((sC - sS + 12) % 12) <= ((sM - sS + 12) % 12);
  const lon = inside ? raw : norm360(raw + 30);
  return { raw, lon, inside, correctionApplied: !inside, granularityAgrees: inside === insideSign };
}

// Compute the core dozen. positions = { Asc, Sun … Saturn } (one consistent
// frame — the sidereal varṣa chart here; the affine formula commutes with a
// constant ayanāṁśa offset). opts = { isDay, lagnaSignIndex }.
export function computeSahams(positions, opts = {}) {
  const isDay = opts.isDay !== false;
  const lagnaSignIndex = opts.lagnaSignIndex != null ? opts.lagnaSignIndex : Math.floor(norm360(positions.Asc) / 30);
  const lagnaLordName = RASHIS[lagnaSignIndex].lord;
  const ctx = { punya: null };
  const resolve = ref => {
    if (ref === 'Asc') return positions.Asc;
    if (ref === 'punya') return ctx.punya;
    if (ref === 'lagnaLord') return positions[lagnaLordName];
    return positions[ref];
  };
  const out = [];
  for (const rec of SAHAMS) {
    let minu = rec.minuend, sub = rec.subtrahend, added = rec.added, formulaNote = '';
    if (rec.dayNight) {                    // Gaurava: explicit day/night forms
      const f = isDay ? rec.dayNight.day : rec.dayNight.night;
      minu = f.minuend; sub = f.subtrahend; added = f.added;
      formulaNote = isDay ? 'explicit day form' : 'explicit night form (not a mechanical reversal)';
    } else if (rec.exception && rec.key === 'samarthya' && lagnaLordName === 'Mars') {
      minu = 'Jupiter'; sub = 'Mars'; added = 'Asc';
      formulaNote = 'Mars rules the Lagna → Jupiter − Mars + Asc at all times (the stated exception)';
    } else if (!isDay && rec.nightReverses) {
      [minu, sub] = [sub, minu];
      formulaNote = 'night: minuend/subtrahend swapped';
    }
    const A = resolve(minu), B = resolve(sub), C = resolve(added);
    const r = computeSaham(A, B, C);
    if (rec.key === 'punya') ctx.punya = r.lon;
    const s = signOf(r.lon);
    out.push({
      key: rec.key, name: rec.name,
      formula: `${minu === 'punya' ? 'Puṇya-saham' : minu === 'lagnaLord' ? `Lagna lord (${lagnaLordName})` : minu} − ${sub === 'punya' ? 'Puṇya-saham' : sub === 'lagnaLord' ? `Lagna lord (${lagnaLordName})` : sub} + ${added}`,
      formulaNote,
      lon: r.lon, raw: r.raw, correctionApplied: r.correctionApplied, granularityAgrees: r.granularityAgrees,
      signIndex: s.index, sign: RASHIS[s.index].name, sanskrit: RASHIS[s.index].sanskrit, degInSign: s.degInSign,
      house: ((s.index - lagnaSignIndex + 12) % 12) + 1,
      betweenCheckPoint: added,
      nightReverses: rec.dayNight ? 'explicit night form' : rec.nightReverses,
      contested: rec.contested || null, note: rec.note || (rec.betweenCheck ? `Between-check point: ${rec.betweenCheck}` : ''),
      cite: rec.cite,
    });
  }
  return {
    isDay, lagnaLord: lagnaLordName, sahams: out,
    correction: SAHAM_CORRECTION_RECORD, countsNote: SAHAM_COUNTS_NOTE,
    cite: SAHAM_CORRECTION_RECORD.cite,
  };
}

// ---------------------------------------------------------------------------
//  Varṣeśvara — the ruler of the year from the five candidates.
// ---------------------------------------------------------------------------
export function varsheshvara(annualVedic, natalVedic, munthaIndex, isDay) {
  const lagnaIdx = annualVedic.lagna.rashiIndex;
  const lumSign = annualVedic.grahas[isDay ? 'Sun' : 'Moon'].rashiIndex;
  const roles = [
    { role: 'Munthā lord', planet: RASHIS[munthaIndex].lord },
    { role: 'Natal lagneśa', planet: RASHIS[natalVedic.lagna.rashiIndex].lord },
    { role: 'Annual lagneśa', planet: RASHIS[lagnaIdx].lord },
    { role: `Tri-rāśi-pati (Tājika ${isDay ? 'day' : 'night'} triplicity lord of the annual lagna)`, planet: tajikaTriplicityLord(lagnaIdx, isDay) },
    { role: isDay ? 'Lord of the Sun’s sign (day varṣa-praveśa)' : 'Lord of the Moon’s sign (night varṣa-praveśa)', planet: RASHIS[lumSign].lord },
  ];
  const shad = annualVedic.shadbala && annualVedic.shadbala.perGraha ? annualVedic.shadbala.perGraha : {};
  const candidates = roles.map(r => {
    const pSign = annualVedic.grahas[r.planet].rashiIndex;
    const aspect = tajikaAspect(pSign, lagnaIdx);
    return {
      ...r, planetSignIndex: pSign, planetSign: RASHIS[pSign].name,
      aspectsLagna: !!aspect, aspect,
      strengthRatio: shad[r.planet] ? shad[r.planet].ratio : null,
      chosen: false,
    };
  });

  // dedupe by planet, keeping the best aspect found for it
  const byPlanet = new Map();
  for (const c of candidates) {
    const cur = byPlanet.get(c.planet);
    if (!cur || (c.aspect ? c.aspect.strength : 0) > (cur.aspect ? cur.aspect.strength : 0)) byPlanet.set(c.planet, c);
  }
  const distinct = [...byPlanet.values()];
  const munthaLord = RASHIS[munthaIndex].lord;
  const strength = c => (c.strengthRatio != null ? c.strengthRatio : -1);

  let chosen = null, viaDispute = false, tieBreakUsed = 'aspect to the annual lagna (primary precondition)';
  const aspecting = distinct.filter(c => c.aspectsLagna);
  if (aspecting.length) {
    const maxAsp = Math.max(...aspecting.map(c => c.aspect.strength));
    let pool = aspecting.filter(c => c.aspect.strength === maxAsp);
    if (pool.length > 1) {
      tieBreakUsed = 'equal aspects → greater strength (Ṣaḍbala, the site’s available measure)';
      const maxS = Math.max(...pool.map(strength));
      pool = pool.filter(c => strength(c) === maxS);
      if (pool.length > 1) {
        // "more claims among the five dignities (pañcavargī)" — documented, not
        // computed (no pañcavargīya-bala module); fall to the munthā lord.
        tieBreakUsed = 'still tied → munthā lord (the pañcavargī step of the Tājikakaustubha chain is documented, not computed)';
        pool = pool.some(c => c.planet === munthaLord) ? pool.filter(c => c.planet === munthaLord) : pool;
      }
    }
    chosen = pool[0];
  } else {
    // The documented four-way dispute. Implemented default = Balabhadra's
    // verdict: strongest in ṣaḍbala; if equal, the munthā lord.
    viaDispute = true;
    tieBreakUsed = 'NO candidate aspects the annual lagna → Balabhadra’s verdict: strongest in ṣaḍbala (tie → munthā lord); the four-way dispute is shown';
    const maxS = Math.max(...distinct.map(strength));
    let pool = distinct.filter(c => strength(c) === maxS);
    if (pool.length > 1 && pool.some(c => c.planet === munthaLord)) pool = pool.filter(c => c.planet === munthaLord);
    chosen = pool[0];
  }
  for (const c of candidates) c.chosen = c.planet === chosen.planet;

  return {
    candidates, chosen: { ...chosen, roles: candidates.filter(c => c.planet === chosen.planet).map(c => c.role) },
    viaDispute, dispute: VARSHESHVARA_RECORD.noAspectDispute,
    aspectPrecondition: VARSHESHVARA_RECORD.aspectPrecondition,
    tieChain: VARSHESHVARA_RECORD.tieChain, tieBreakUsed,
    strengthNote: VARSHESHVARA_RECORD.strengthNote,
    cite: VARSHESHVARA_RECORD.cite,
  };
}

// ---------------------------------------------------------------------------
//  varshaphala — the main entry: the full Tājika annual reading for a
//  nativity and target year.
//
//  natalChart = a tropical castChart(...) result (any house system; the
//  sidereal layer is derived). opts: { lat, lon } — the place of the annual
//  chart (defaults to the natal place).
// ---------------------------------------------------------------------------
export function varshaphala(natalChart, targetYear, opts = {}) {
  const birth = natalChart.date instanceof Date ? natalChart.date : new Date(natalChart.date);
  const birthYear = birth.getUTCFullYear();
  if (!Number.isFinite(targetYear) || targetYear < birthYear) {
    throw new Error('varshaphala: the target year cannot precede the birth year');
  }
  const lat = opts.lat != null ? opts.lat : natalChart.latitude;
  const lon = opts.lon != null ? opts.lon : natalChart.longitude;
  const completedYears = targetYear - birthYear;

  const natalVedic = castVedic(natalChart);
  const natalSidSun = toSidereal(natalChart.planets.Sun.lon, birth);

  // --- varṣa-praveśa: the SIDEREAL return via the tropical bisector ---------
  // Target the tropical longitude at which the sidereal longitude repeats:
  // target = natal sidereal Sun + ayanāṁśa(t_return). The ayanāṁśa moves
  // ~50.29″/yr, so iterating the target converges in 1–2 passes.
  const hints = { aroundMonth: birth.getUTCMonth(), aroundDay: birth.getUTCDate() };
  let tGuess = new Date(Date.UTC(targetYear, hints.aroundMonth, hints.aroundDay, 12, 0, 0));
  let instant = null;
  for (let i = 0; i < 4; i++) {
    const target = norm360(natalSidSun + lahiriAyanamsa(tGuess));
    const next = solarReturnInstant(target, targetYear, hints);
    if (instant && Math.abs(next.getTime() - instant.getTime()) < 1000) { instant = next; break; }
    instant = next; tGuess = next;
  }
  // the tropical return of the same year — Lilly's revolution (Book III), for
  // the honest side-by-side ("the same return, two rulebooks").
  let tropicalInstant = null;
  try { tropicalInstant = solarReturnInstant(norm360(natalChart.planets.Sun.lon), targetYear, hints); } catch { tropicalInstant = null; }

  const annualChart = castChart(instant, lat, lon, 'whole');
  const annualVedic = castVedic(annualChart, { currentDate: instant });
  const isDay = annualChart.isDay;

  const fold = x => { const d = norm360(x); return d > 180 ? 360 - d : d; };
  const siderealMatchDeg = fold(annualVedic.grahas.Sun.lon - natalSidSun);

  // --- the pieces ------------------------------------------------------------
  const mun = muntha(natalVedic.lagna.rashiIndex, completedYears, annualVedic.lagna.rashiIndex);
  const yearLord = varsheshvara(annualVedic, natalVedic, mun.rashiIndex, isDay);

  const bodies = {};
  for (const p of SEVEN) bodies[p] = { lon: annualVedic.grahas[p].lon, speed: annualChart.planets[p].speed };
  const pairs = tajikaAspectTable(bodies);
  const yogas = detectTajikaYogas(bodies, annualVedic.lagna.rashiIndex);

  const positions = { Asc: annualVedic.lagna.lon };
  for (const p of SEVEN) positions[p] = annualVedic.grahas[p].lon;
  const sahams = computeSahams(positions, { isDay, lagnaSignIndex: annualVedic.lagna.rashiIndex });

  const grahas = {};
  for (const p of Object.keys(annualVedic.grahas)) {
    const g = annualVedic.grahas[p];
    grahas[p] = { lon: g.lon, label: g.label, rashiIndex: g.rashiIndex, rashi: g.rashi, deg: g.deg, retrograde: g.retrograde, house: g.house };
  }

  return {
    system: 'tajika',
    meta: {
      birthUTC: birth.toISOString(), birthYear, targetYear, completedYears, lat, lon,
      ayanamsaName: 'Lahiri (Citrāpakṣa) — a modern convention, flagged: Balabhadra’s own constants are Sūrya-siddhānta era',
    },
    varshaPravesha: {
      instant, instantISO: instant.toISOString(),
      tropicalInstant, tropicalInstantISO: tropicalInstant ? tropicalInstant.toISOString() : null,
      driftMinutes: tropicalInstant ? (instant.getTime() - tropicalInstant.getTime()) / 60000 : null,
      expectedDriftNote: VARSHA_PRAVESHA_RECORD.drift,
      ayanamsa: +lahiriAyanamsa(instant).toFixed(4),
      natalSiderealSun: natalSidSun, annualSiderealSun: annualVedic.grahas.Sun.lon, siderealMatchDeg,
      cite: VARSHA_PRAVESHA_RECORD.cite,
    },
    annual: {
      isDay,
      lagna: { ...annualVedic.lagna },
      grahas,
      houseSystem: 'whole-sign (sidereal)',
    },
    muntha: mun,
    varsheshvara: yearLord,
    aspects: {
      orbs: DEEPTAMSA, orbRecord: DEEPTAMSA_RECORD, pairs,
      aspectClasses: TAJIKA_ASPECT_CLASSES, cite: TAJIKA_ASPECT_SOURCE,
    },
    yogas,
    sahams,
    comparison: {
      note: TRANSMISSION_NOTE.note, cite: TRANSMISSION_NOTE.cite,
      westernPage: 'pages/book3/master.html',
    },
    citations: [
      TAJIKA_CITATION,
      VARSHA_PRAVESHA_RECORD.cite,
      MUNTHA_RECORD.cite,
      VARSHESHVARA_RECORD.cite,
      DEEPTAMSA_RECORD.cite,
      SAHAM_CORRECTION_RECORD.cite,
      'Sidereal positions = tropical (astronomy-engine) − Lahiri ayanāṁśa (assets/js/core/data/vedic-data.js).',
    ],
    notes: 'A historical calculation grammar reproduced faithfully for study — described, never prescribed; no demonstrated predictive validity. Contested values (the +30° saham correction and Viśvanātha’s dissent, the Mitra phrasing, the no-aspect varṣeśvara dispute, the Gaurava night form, the Putra reversal, the half-sum orb convention) are flagged in-data, never silently resolved.',
  };
}
