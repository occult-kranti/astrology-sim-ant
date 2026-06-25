// ============================================================================
//  reading.js — the UNIFIED READING SPINE. ONE pure function, `fullReading`,
//  that composes the WHOLE engine for a single moment (and, optionally, a birth
//  radix and a horary quesited house) into one clean, serializable, citation-
//  bearing object. It RE-IMPLEMENTS NOTHING — every value is produced by the
//  existing modules; this file only assembles their results into a stable shape.
//
//  This object is the single source of truth consumed by:
//    • pages/workbench.html  (the one unified tool — renders every block),
//    • the JSON export        (Copy / Download as JSON),
//    • core/llm-context.js    (the local-LLM system context & fact table).
//
//  It composes:
//    astro.js            — signOf, formatLon, antiscion/contra, partOfFortune, lot
//    dignities.js        — essential & accidental dignity, almuten, dignityRulersAt
//    aspects.js          — allAspects, aspectBetween, mutualReception
//    cautions.js         — chartCautions (chart-health verdict)
//    planetary-hours.js  — planetaryHour
//    perfection.js       — modesOfPerfection, timeToPerfection (horary block)
//    election.js         — electionScore, rankNow (the Picatrix layer)
//    talisman.js         — talismanRecipe (the historical recipe)
//    trajectory.js       — lifeTrajectory (the natal arc, when birth data given)
//
//  PURE — no DOM, headless-testable in Node. Never throws for a normal chart:
//  every sub-technique that can throw is guarded. Astrology has no demonstrated
//  predictive validity; this is a historical/computational study artefact —
//  described, never prescribed.
// ============================================================================
import { signOf, formatLon, antiscion, contraAntiscion, partOfFortune, lot, PLANET_GLYPHS } from './astro.js';
import { essentialDignity, accidentalDignity, almuten, dignityRulersAt } from './dignities.js';
import { allAspects, aspectBetween, mutualReception } from './aspects.js';
import { chartCautions } from './cautions.js';
import { planetaryHour } from './planetary-hours.js';
import { modesOfPerfection, timeToPerfection } from './perfection.js';
import { OPERATIONS, electionScore, rankNow } from './election.js';
import { talismanRecipe } from './talisman.js';
import { lifeTrajectory } from './trajectory.js';
import { castVedic } from './vedic.js';
import { DOMICILE } from './data/dignities-data.js';
import { HOUSES } from './data/houses.js';

// The canonical honest-science framing — the SINGLE source of truth, reused by
// the LLM system context so the disclaimer can never drift from the UI.
export const HONEST_FRAMING =
  'Astrology has no demonstrated predictive validity and is regarded by the scientific ' +
  'community as a pseudoscience. The astronomical positions here are computed and verifiable; ' +
  'the interpretations are those of William Lilly (Christian Astrology, 1647) and the Picatrix ' +
  'tradition, presented for historical study — described, never prescribed. Magical and ' +
  'talismanic material is recorded as historical practice only and is never a recommendation.';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// Per-block citation strings (the techniques' own citations are also collected).
const CITE = {
  positions: 'Positions: geocentric apparent ecliptic longitude in the equinox of date (astronomy-engine, ~1 arc-minute).',
  houses: 'Lilly, Christian Astrology Bk I — erecting the figure: the Ascendant, Midheaven and the (Regiomontanus) houses.',
  hours: 'Lilly CA Bk I / Picatrix III.7 — the planetary day & hour in the Chaldean order.',
  dignity: 'Lilly, Christian Astrology Bk I — essential & accidental dignity, the almuten of a degree, the Lord of the Geniture.',
  aspects: 'Lilly, Christian Astrology Bk I — the Ptolemaic aspects with Lilly’s planet-based orbs & moieties; mutual reception.',
  lots: 'Lilly CA Bk I — the Part of Fortune and the Arabic Parts (a Lot is the affine point Asc + B − C; sect-aware).',
  cautions: 'Lilly, Christian Astrology Bk II — the considerations before judgement and the Moon’s condition (chart health).',
  horary: 'Lilly, Christian Astrology Bk II — significators of querent & quesited, the modes of perfection, and timing.',
  election: 'Picatrix III / Agrippa II — election: is this moment fit for the work? It ranks, never demands a flawless chart.',
  talisman: 'Picatrix II–III / Agrippa II — the talisman recipe, recorded as historical practice (described, not prescribed).',
  trajectory: 'Lilly CA Bk III + Picatrix — the life trajectory: profections, primary directions, the solar return, the Picatrix overlay.',
  vedic: 'Parāśara BPHS / Jagannath Hora — the Vedic (sidereal) reading: a SEPARATE system shown for comparison.',
};

const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };
const point = lon => ({ lon, label: formatLon(lon), sign: signOf(lon).name, degInSign: signOf(lon).degInSign });

// ---------------------------------------------------------------------------
//  fullReading(chart, opts) — the union of everything the engine computes.
//
//  opts:
//    operationKey?  one of OPERATIONS[].key (default 'love') — the election /
//                   talisman aim shown in detail.
//    quesitedHouse? 1..12 — when given, the horary block (significators +
//                   perfection + timing for that house) is included.
//    birth?         { chart: <castChart result> } — when given, the natal block
//                   (the full lifeTrajectory) is included.
//    trajectoryOpts? passed through to lifeTrajectory.
//    generatedAt?   ISO string stamped into meta (the app layer supplies it;
//                   omitted here so the function stays pure/deterministic).
//
//  Returns a stable, JSON-serializable object (see the assembled shape below).
// ---------------------------------------------------------------------------
export function fullReading(chart, opts = {}) {
  const isDay = chart.isDay;
  const operationKey = OPERATIONS.some(o => o.key === opts.operationKey) ? opts.operationKey : 'love';
  const quesitedHouse = Number.isInteger(opts.quesitedHouse) && opts.quesitedHouse >= 1 && opts.quesitedHouse <= 12
    ? opts.quesitedHouse : null;
  const hasBirth = !!(opts.birth && opts.birth.chart);

  const ph = safe(() => planetaryHour(chart.date, chart.latitude, chart.longitude));
  const cites = new Set();
  const addCite = c => { if (c) cites.add(c); };

  // ---- moment: the figure itself --------------------------------------------
  const planets = {};
  for (const name of Object.keys(chart.planets)) {
    const p = chart.planets[name];
    planets[name] = {
      lon: p.lon, label: formatLon(p.lon), sign: signOf(p.lon).name, degInSign: signOf(p.lon).degInSign,
      house: p.house, speed: p.speed, retrograde: !!p.retrograde, glyph: PLANET_GLYPHS[name] || '',
      antiscion: point(antiscion(p.lon)), contraAntiscion: point(contraAntiscion(p.lon)),
    };
  }
  const moment = {
    asc: chart.asc, mc: chart.mc, desc: chart.desc, ic: chart.ic,
    ramc: chart.ramc, obliquity: chart.obliquity, system: chart.system, isDay,
    cusps: chart.cusps,
    angles: { asc: point(chart.asc), mc: point(chart.mc), desc: point(chart.desc), ic: point(chart.ic) },
    planets,
    planetaryHour: ph
      ? { ruler: ph.ruler, dayRuler: ph.dayRuler, hourNumber: ph.hourNumber, isNight: ph.isNight, hourLengthMinutes: ph.hourLengthMinutes }
      : null,
    citations: [CITE.positions, CITE.houses, CITE.hours],
  };
  [CITE.positions, CITE.houses, CITE.hours].forEach(addCite);

  // ---- dignities: the Book-I ledger -----------------------------------------
  const perPlanet = {};
  let log = { planet: null, score: -Infinity };
  for (const name of PLANETS7) {
    const p = chart.planets[name];
    const ed = essentialDignity(name, p.lon, isDay);
    const ad = accidentalDignity(name, chart);
    const sumTotal = ed.total + ad.total;
    perPlanet[name] = { essential: ed, accidental: ad, sumTotal };
    if (sumTotal > log.score) log = { planet: name, score: sumTotal };
  }
  const dignities = {
    perPlanet,
    almutens: { ascendant: almuten(chart.asc, isDay), midheaven: almuten(chart.mc, isDay) },
    lordOfGeniture: log.planet ? log : { planet: null, score: 0 },
    citations: [CITE.dignity],
  };
  addCite(CITE.dignity);

  // ---- aspects & reception --------------------------------------------------
  const bodies7 = {};
  for (const n of PLANETS7) bodies7[n] = chart.planets[n];
  const aspectList = allAspects(bodies7);
  const receptions = [];
  for (let i = 0; i < PLANETS7.length; i++)
    for (let j = i + 1; j < PLANETS7.length; j++) {
      const A = PLANETS7[i], B = PLANETS7[j];
      const mr = mutualReception(A, chart.planets[A].lon, B, chart.planets[B].lon, l => dignityRulersAt(l, isDay));
      if (mr) receptions.push({ a: A, b: B, byA: mr.byA, byB: mr.byB });
    }
  const aspects = { list: aspectList, receptions, citations: [CITE.aspects] };
  addCite(CITE.aspects);

  // ---- lots / Arabic parts (affine points) ----------------------------------
  const sunLon = chart.planets.Sun.lon, moonLon = chart.planets.Moon.lon;
  const fortuneLon = chart.planets.Fortune ? chart.planets.Fortune.lon
    : partOfFortune(chart.asc, sunLon, moonLon);
  // Spirit is the reflection of Fortune: by day Asc + Sun − Moon, reversed by night.
  const spiritLon = isDay ? lot(chart.asc, sunLon, moonLon) : lot(chart.asc, moonLon, sunLon);
  const lots = {
    fortune: { ...point(fortuneLon), formula: 'Asc + Moon − Sun' },
    spirit: { ...point(spiritLon), formula: isDay ? 'Asc + Sun − Moon (day)' : 'Asc + Moon − Sun (night)' },
    citations: [CITE.lots],
  };
  addCite(CITE.lots);

  // ---- chart health (cautions) ----------------------------------------------
  const cau = chartCautions(chart, { hourRuler: ph && ph.ruler });
  const cautions = {
    verdict: cau.verdict, label: cau.label, lordAsc: cau.lordAsc,
    global: cau.global, planets: cau.planets, counts: cau.counts,
    citations: [CITE.cautions],
  };
  addCite(CITE.cautions);

  // ---- horary (only when a quesited house is supplied) ----------------------
  let horary = null;
  if (quesitedHouse) {
    const lordAsc = DOMICILE[signOf(chart.asc).index];
    const lordQ = DOMICILE[signOf(chart.cusps[quesitedHouse]).index];
    const querentSig = chart.planets[lordAsc];
    const quesitedSig = chart.planets[lordQ];
    const modes = safe(() => modesOfPerfection(chart, lordAsc, lordQ, l => dignityRulersAt(l, isDay)));
    const timing = (modes && modes.direct && modes.direct.applying && querentSig)
      ? safe(() => timeToPerfection(modes.direct.orb, querentSig.lon, querentSig.house))
      : null;
    // the Moon's next applying aspect — the drift of the matter
    const moon = chart.planets.Moon;
    let best = null;
    for (const name of PLANETS7) {
      if (name === 'Moon') continue;
      const a = aspectBetween('Moon', moon, name, chart.planets[name]);
      if (a && a.applying && (!best || a.orb < best.orb)) best = { to: name, aspect: a.aspect, glyph: a.glyph, orb: a.orb };
    }
    horary = {
      quesitedHouse,
      quesitedSignifies: HOUSES[quesitedHouse - 1] ? HOUSES[quesitedHouse - 1].signifies : '',
      sharedSignificator: lordAsc === lordQ,
      querent: querentSig ? {
        lordAsc, lon: querentSig.lon, label: formatLon(querentSig.lon), house: querentSig.house,
        essentialTotal: essentialDignity(lordAsc, querentSig.lon, isDay).total,
      } : { lordAsc },
      quesited: quesitedSig ? {
        lordQ, lon: quesitedSig.lon, label: formatLon(quesitedSig.lon), house: quesitedSig.house,
        essentialTotal: essentialDignity(lordQ, quesitedSig.lon, isDay).total,
      } : { lordQ },
      moonCoSignificator: { lon: moon.lon, label: formatLon(moon.lon), house: moon.house, voidOfCourse: !best, nextAspect: best },
      perfection: { modes, timing },
      citations: [CITE.horary],
    };
    addCite(CITE.horary);
  }

  // ---- election (Picatrix) --------------------------------------------------
  const selected = safe(() => electionScore(chart, operationKey));
  const rankedNow = safe(() => rankNow(chart).map(r => ({
    key: r.operation.key, label: r.operation.label, ruler: r.operation.ruler, verdict: r.verdict, score: r.score,
  })), []);
  if (selected) selected.reasons.forEach(r => addCite(r.cite));
  const election = { operationKey, rankedNow, selected, citations: [CITE.election] };
  addCite(CITE.election);

  // ---- talisman -------------------------------------------------------------
  const talisman = safe(() => talismanRecipe(chart, operationKey));
  if (talisman) (talisman.citations || []).forEach(addCite);
  addCite(CITE.talisman);

  // ---- natal arc (only when birth data supplied) ----------------------------
  let natal = null;
  if (hasBirth) {
    const trajectory = safe(() => lifeTrajectory(opts.birth.chart, {
      currentDate: chart.date, nowPlace: { lat: chart.latitude, lon: chart.longitude }, ...(opts.trajectoryOpts || {}),
    }));
    if (trajectory) {
      natal = { trajectory };
      (trajectory.citations || []).forEach(addCite);
      addCite(CITE.trajectory);
    }
  }

  // ---- vedic (Jyotiṣa) — a parallel sidereal system, for side-by-side study --
  let vedic = null;
  if (opts.includeVedic !== false) {
    vedic = safe(() => castVedic(chart, { currentDate: opts.vedicCurrentDate instanceof Date ? opts.vedicCurrentDate : chart.date }));
    if (vedic) addCite(CITE.vedic);
  }

  const meta = {
    schemaVersion: 1,
    engine: 'astronomy-engine (~1 arc-minute)',
    framing: HONEST_FRAMING,
    generatedAt: opts.generatedAt || null,
    inputs: {
      date: chart.date, latitude: chart.latitude, longitude: chart.longitude,
      system: chart.system, isDay, quesitedHouse, operationKey, hasBirth,
    },
  };

  return {
    meta, moment, dignities, aspects, lots, cautions,
    horary, election, talisman, natal, vedic,
    citations: [...cites],
  };
}
