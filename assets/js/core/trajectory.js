// ============================================================================
//  trajectory.js — The LIFE TRAJECTORY engine: a single composed reading that
//  walks a nativity across the whole arc of a life. It does NOT re-implement any
//  technique; it ONLY composes the engines already built and the cited data
//  tables, then assembles their results into one timeline + Picatrix overlay.
//
//  It draws together, for one natal radix:
//    • the natal "signatures"   — sect, almuten of the Ascendant, Lord of the
//      Geniture, sect light, temperament, hyleg & alcocoden (length-of-life);
//    • the year-by-year TIMELINE of annual profections (the Lord of the Year
//      and its natal essential/accidental condition);
//    • the PRIMARY DIRECTIONS of the planets to the angles (life events timed);
//    • the SOLAR RETURN (revolution) of the current year;
//    • a PICATRIX overlay — the native's ruling planets, the magical operations
//      that are "naturally theirs", the operations the current Lord of the Year
//      favours, the best/worst operations for the present moment & place, and a
//      recommended talisman recipe.
//
//  CITATIONS (every asserted rule traces to one of these, recorded per-section
//  and collected into the returned `citations` array):
//   • William Lilly, "Christian Astrology" (1647), Book I — essential &
//     accidental dignity, the almuten/Lord of the Geniture, sect & temperament.
//   • William Lilly, "Christian Astrology" (1647), Book III — profections /
//     Lord of the Year, primary directions, the Solar Revolution, the Hyleg &
//     Alcocoden (length of life).
//   • The "Picatrix" (Ghayat al-Hakim) — the planetary operations of astral
//     magic and the election/talisman tradition layered over the nativity.
//
//  Presented strictly as historical practice — described, never prescribed.
//  Astrology has no demonstrated predictive validity.
//
//  Pure functions only — NO DOM, headless-testable in Node. Mirrors the
//  boxed-comment + export style of data/dignities-data.js. Every sub-technique
//  that may throw (hyleg, alcocoden, solar return, the now-chart election,
//  the talisman) is guarded in try/catch so a normal chart never throws.
// ============================================================================
import { signOf, castChart } from './astro.js';
import { almuten, essentialDignity, accidentalDignity } from './dignities.js';
import { annualProfection } from './profections.js';
import { hyleg, alcocoden } from './hyleg.js';
import { directionsToAngles } from './directions.js';
import { solarReturn } from './solar-return.js';
import { OPERATIONS, rankNow, electionScore } from './election.js';
import { talismanRecipe } from './talisman.js';

// The seven traditional planets — the only valid Lord/almuten/ruler values.
const PLANETS7 = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

// --- Cited source strings (each asserted section names the one it relies on) --
const CITE = {
  almuten:     'Lilly, Christian Astrology Bk I — the almuten (chief dispositor) of a degree by essential dignity.',
  geniture:    'Lilly, Christian Astrology Bk I — the Lord of the Geniture: the planet of greatest dignity in the figure.',
  sect:        'Lilly, Christian Astrology Bk I — sect (day/night) and the sect light (the Sun by day, the Moon by night).',
  temperament: 'A simplified temperament after the Lilly/Ptolemaic complexion doctrine (Tetrabiblos III) — a coarse hot/cold·dry/moist tally over the Ascendant, the Moon and the sect light; not a verbatim Lilly procedure.',
  hyleg:       'Lilly, Christian Astrology Bk III — the Hyleg & Alcocoden (length-of-life judgement; cf. Ptolemy Tetrabiblos III).',
  profection:  'Lilly, Christian Astrology Bk III — annual profections & the Lord of the Year (the annual time-lord).',
  directions:  'Lilly, Christian Astrology Bk III — primary directions of the significators to the promittors (events timed in years).',
  revolution:  'Lilly, Christian Astrology Bk III — the Solar Revolution (the figure for the Sun’s annual return).',
  picatrix:    'The Picatrix (Ghayat al-Hakim) — the seven planetary operations of astral magic, layered over the nativity.',
};

// ---------------------------------------------------------------------------
//  ageBetween — whole completed years between two dates (a Date or anything
//  Date-coercible). Returns a non-negative integer; 0 when `when` precedes the
//  birth date by less than a year (clamped to 0, never negative).
// ---------------------------------------------------------------------------
export function ageBetween(birthDate, when) {
  const b = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const w = when instanceof Date ? when : new Date(when);
  let years = w.getUTCFullYear() - b.getUTCFullYear();
  // Subtract one if the birthday (month/day, then time) has not yet arrived.
  const beforeBirthday =
    w.getUTCMonth() < b.getUTCMonth() ||
    (w.getUTCMonth() === b.getUTCMonth() &&
      (w.getUTCDate() < b.getUTCDate() ||
        (w.getUTCDate() === b.getUTCDate() && w.getTime() < makeSameDay(b, w))));
  if (beforeBirthday) years -= 1;
  return years < 0 ? 0 : years;
}

// Helper: the birth instant's time-of-day mapped onto `when`'s date, for the
// "is it past the exact birth moment on the birthday" comparison.
function makeSameDay(birth, when) {
  return Date.UTC(
    when.getUTCFullYear(), when.getUTCMonth(), when.getUTCDate(),
    birth.getUTCHours(), birth.getUTCMinutes(), birth.getUTCSeconds(), birth.getUTCMilliseconds()
  );
}

// ---------------------------------------------------------------------------
//  Elemental qualities of the twelve signs (Lilly Bk I): each sign is hot|cold
//  and dry|moist by triplicity. Fire = hot+dry, Air = hot+moist, Earth =
//  cold+dry, Water = cold+moist. Index 0=Aries … 11=Pisces.
// ---------------------------------------------------------------------------
const SIGN_QUALITY = [
  { hot: true,  dry: true  }, // Aries  (Fire)
  { hot: false, dry: true  }, // Taurus (Earth)
  { hot: true,  dry: false }, // Gemini (Air)
  { hot: false, dry: false }, // Cancer (Water)
  { hot: true,  dry: true  }, // Leo    (Fire)
  { hot: false, dry: true  }, // Virgo  (Earth)
  { hot: true,  dry: false }, // Libra  (Air)
  { hot: false, dry: false }, // Scorpio(Water)
  { hot: true,  dry: true  }, // Sagittarius (Fire)
  { hot: false, dry: true  }, // Capricorn   (Earth)
  { hot: true,  dry: false }, // Aquarius    (Air)
  { hot: false, dry: false }, // Pisces      (Water)
];

// A coarse temperament from three traditional significators of complexion — the
// Ascendant sign, the Moon's sign, and the sect light's sign. This is a SIMPLIFIED
// tally after the Lilly/Ptolemaic complexion doctrine (Tetrabiblos III), not a
// verbatim Lilly rule; it counts hot-vs-cold and dry-vs-moist and reports the
// dominant pairing. (Lilly's own method also weighs the planets aspecting the
// Ascendant, the Moon's phase, and the season.)
function temperamentOf(birthChart, sectLight) {
  const idxs = [
    signOf(birthChart.asc).index,
    signOf(birthChart.planets.Moon.lon).index,
    signOf(birthChart.planets[sectLight].lon).index,
  ];
  let hotN = 0, dryN = 0;
  for (const i of idxs) { if (SIGN_QUALITY[i].hot) hotN++; if (SIGN_QUALITY[i].dry) dryN++; }
  const hot = hotN >= 2;              // majority hot ⇒ hot, else cold
  const dry = dryN >= 2;              // majority dry ⇒ dry, else moist
  const therm = hot ? 'Hot' : 'Cold';
  const hum = dry ? 'Dry' : 'Moist';
  // Choleric=Hot/Dry, Sanguine=Hot/Moist, Melancholic=Cold/Dry, Phlegmatic=Cold/Moist
  const dominant =
    hot && dry ? 'Choleric (Hot & Dry)'
    : hot && !dry ? 'Sanguine (Hot & Moist)'
    : !hot && dry ? 'Melancholic (Cold & Dry)'
    : 'Phlegmatic (Cold & Moist)';
  return { hot, dry, dominant, summary: `${therm} & ${hum}` };
}

// ---------------------------------------------------------------------------
//  Lord of the Geniture — the planet with the greatest TOTAL dignity (essential
//  + accidental) in the figure (Lilly Bk I). We score all seven and pick the
//  best; ties broken by Chaldean (slowest-first) order via the array sequence.
// ---------------------------------------------------------------------------
function lordOfGeniture(birthChart) {
  let best = null, bestScore = -Infinity;
  for (const planet of PLANETS7) {
    const p = birthChart.planets[planet];
    if (!p) continue;
    let score = 0;
    try {
      const ed = essentialDignity(planet, p.lon, birthChart.isDay).total;
      const ad = accidentalDignity(planet, birthChart).total;
      score = ed + ad;
    } catch { score = -Infinity; }
    if (score > bestScore) { bestScore = score; best = planet; }
  }
  return { planet: best, score: bestScore === -Infinity ? 0 : bestScore };
}

// ---------------------------------------------------------------------------
//  lifeTrajectory(birthChart, opts) — the composed reading. See header for the
//  full returned shape. NEVER throws for a normal chart: every sub-technique
//  that can throw is guarded.
// ---------------------------------------------------------------------------
export function lifeTrajectory(birthChart, opts = {}) {
  const currentDate = opts.currentDate instanceof Date ? opts.currentDate : new Date();
  const years = opts.years != null ? opts.years : 90;
  const system = opts.system || 'regiomontanus';
  const nowPlace = opts.nowPlace || { lat: birthChart.latitude, lon: birthChart.longitude };

  const citationsUsed = new Set();
  const use = key => { citationsUsed.add(CITE[key]); return CITE[key]; };

  const isDay = birthChart.isDay;
  const ageNow = ageBetween(birthChart.date, currentDate);

  // --- NATAL signatures ----------------------------------------------------
  use('almuten');
  const almAsc = almuten(birthChart.asc, isDay);          // {planet, score, all}
  const almutenAsc = almAsc.planet;

  use('geniture');
  const log = lordOfGeniture(birthChart);

  use('sect');
  const sectLight = isDay ? 'Sun' : 'Moon';

  use('temperament');
  const temperament = temperamentOf(birthChart, sectLight);

  // Hyleg / alcocoden — contested, may throw (prenatal syzygy etc.). Guarded.
  use('hyleg');
  let hylegRes = null, alcoRes = null;
  let hylegNote = '';
  try {
    hylegRes = hyleg(birthChart);
  } catch (e) {
    hylegNote = `hyleg() failed: ${e && e.message ? e.message : 'unknown'}`;
    hylegRes = null;
  }
  try {
    alcoRes = alcocoden(birthChart, hylegRes);
  } catch (e) {
    hylegNote = (hylegNote ? hylegNote + '; ' : '') + `alcocoden() failed: ${e && e.message ? e.message : 'unknown'}`;
    alcoRes = null;
  }

  const natal = {
    asc: birthChart.asc,
    mc: birthChart.mc,
    isDay,
    almutenAsc,
    lordOfGeniture: log,
    sectLight,
    temperament,
    hyleg: hylegRes,
    alcocoden: alcoRes,
  };

  // --- TIMELINE of annual profections -------------------------------------
  // ages 0 .. min(years, ageNow+12), bounded to <= ~102 entries.
  use('profection');
  const maxAge = Math.min(years, ageNow + 12);
  const upper = Math.min(maxAge, 101); // keep length (0..upper) <= 102 entries
  const baseYear = birthChart.date instanceof Date
    ? birthChart.date.getUTCFullYear()
    : new Date(birthChart.date).getUTCFullYear();
  const timeline = [];
  for (let age = 0; age <= upper; age++) {
    let prof;
    try { prof = annualProfection(birthChart, age); }
    catch { continue; }
    const lord = prof.lordOfYear;
    const lp = birthChart.planets ? birthChart.planets[lord] : undefined;
    let lordEssential = null, lordAccidental = null;
    try { if (lp) lordEssential = essentialDignity(lord, lp.lon, isDay).total; } catch { /* leave null */ }
    try { if (lp) lordAccidental = accidentalDignity(lord, birthChart).total; } catch { /* leave null */ }
    timeline.push({
      age,
      year: baseYear + age,
      profectedSign: prof.profectedSign,
      activatedHouse: prof.activatedHouse,
      lordOfYear: lord,
      lordEssential,
      lordAccidental,
      current: age === ageNow,
    });
  }

  // --- PRIMARY DIRECTIONS to the angles -----------------------------------
  use('directions');
  let directions = [];
  try { directions = directionsToAngles(birthChart, { maxYears: 90 }); }
  catch { directions = []; }

  // --- CURRENT YEAR (profection + solar return) ---------------------------
  let curProf = null;
  try { curProf = annualProfection(birthChart, ageNow); } catch { curProf = null; }

  use('revolution');
  let sr = null;
  try {
    const r = solarReturn(birthChart, currentDate.getUTCFullYear());
    const sunH = r.chart && r.chart.planets && r.chart.planets.Sun ? r.chart.planets.Sun.house : null;
    sr = { instant: r.instant, asc: r.chart.asc, mc: r.chart.mc, sunHouse: sunH };
  } catch (e) {
    sr = { instant: null, asc: null, mc: null, sunHouse: null, error: e && e.message ? e.message : 'solar return failed' };
  }

  const currentYear = {
    age: ageNow,
    lordOfYear: curProf ? curProf.lordOfYear : null,
    profectedSign: curProf ? curProf.profectedSign : null,
    activatedHouse: curProf ? curProf.activatedHouse : null,
    solarReturn: sr,
  };

  // --- PICATRIX overlay ----------------------------------------------------
  use('picatrix');
  // Ruling planets: almuten of Asc, Lord of the Geniture, sect light — deduped,
  // preserving order, keeping only real planet names.
  const rulingPlanets = [];
  for (const r of [almutenAsc, log.planet, sectLight]) {
    if (r && PLANETS7.includes(r) && !rulingPlanets.includes(r)) rulingPlanets.push(r);
  }

  // Affinities: operations whose ruler is one of the native's ruling planets.
  const affinities = OPERATIONS
    .filter(o => rulingPlanets.includes(o.ruler))
    .map(o => ({
      operationKey: o.key,
      label: o.label,
      ruler: o.ruler,
      reason: `${o.ruler} is among the chart's ruling planets (almuten of the Ascendant / Lord of the Geniture / sect light), so the tradition would count ${o.label.toLowerCase()} among the works naturally suited to this nativity.`,
    }));

  // Year focus: operations the current Lord of the Year rules.
  const yearLord = currentYear.lordOfYear;
  const yearFocus = OPERATIONS
    .filter(o => yearLord && o.ruler === yearLord)
    .map(o => ({ operationKey: o.key, label: o.label, ruler: o.ruler }));

  // Now best/worst: rank every operation for the present moment & place.
  let nowChart = null;
  try { nowChart = castChart(currentDate, nowPlace.lat, nowPlace.lon, system); }
  catch { nowChart = null; }

  let best = [], worst = [];
  if (nowChart) {
    try {
      const ranked = rankNow(nowChart);
      const slim = r => ({ label: r.operation.label, ruler: r.operation.ruler, verdict: r.verdict, score: r.score, operationKey: r.operation.key });
      best = ranked.slice(0, 3).map(slim);
      worst = ranked.slice(-3).reverse().map(slim);
    } catch { best = []; worst = []; }
  }
  const nowBestWorst = {
    at: { date: currentDate, lat: nowPlace.lat, lon: nowPlace.lon },
    best,
    worst,
  };

  // Recommended talisman: of the native's affinity operations, the one that
  // scores best for the present moment (score every affinity directly, not just
  // the top/bottom-3 of rankNow), preferring green > amber > red. Falls back to
  // the first affinity, else 'love'. Built on the now-chart.
  let recommendedTalisman = null;
  if (nowChart) {
    const VR = { green: 2, amber: 1, red: 0 };
    let chosenKey = (affinities[0] && affinities[0].operationKey) || 'love';
    let bestRank = -1;
    for (const a of affinities) {
      try {
        const e = electionScore(nowChart, a.operationKey);
        const rank = (VR[e.verdict] || 0) * 1000 + e.score;   // verdict dominates, score breaks ties
        if (rank > bestRank) { bestRank = rank; chosenKey = a.operationKey; }
      } catch { /* skip an operation that fails to score */ }
    }
    try { recommendedTalisman = talismanRecipe(nowChart, chosenKey); }
    catch { recommendedTalisman = null; }
  }

  const picatrix = {
    rulingPlanets,
    affinities,
    yearFocus,
    nowBestWorst,
    recommendedTalisman,
  };

  return {
    natal,
    ageNow,
    timeline,
    directions,
    currentYear,
    picatrix,
    citations: [...citationsUsed],
    notes: hylegNote || undefined,
  };
}
