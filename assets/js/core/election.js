// ============================================================================
//  election.js — the Election Engine: the bridge between William Lilly's
//  horary/natal machinery and the Picatrix tradition of astrological magic.
//
//  It answers ONE question — "is this moment fit for operation X?" — by
//  AUTO-CALCULATING every testimony the tradition weighs, and returns a ranked
//  green/amber/red verdict with a fully cited, per-rule breakdown. Nothing is
//  re-implemented: it composes the existing engine —
//    • dignities.js        — the ruling planet's essential & accidental state
//    • cautions.js         — the Moon's condition + the chart's afflictions
//    • planetary-hours.js  — the planetary hour & day (operate in the planet's hour)
//    • data/lunar-mansions — the Moon's mansion and its traditional use (Bk I)
//    • data/decan-faces    — the decan face of the luminaries (Bk II)
//    • data/behenian-stars — fixed-star contacts, precessed to the date (Bk II)
//    • data/planetary-magic— the per-planet correspondences (Bk III)
//
//  CITATIONS: every rule carries a `cite`. Sources are Lilly, *Christian
//  Astrology* (1647); the *Picatrix* (Greer–Warnock / Attrell–Porreca);
//  Agrippa, *Three Books* II; and the validated election checklist in
//  research/SOURCE-DATA.md §5. Presented as historical practice, never advice;
//  astrology has no demonstrated predictive validity.
// ============================================================================
import { norm360, signOf, castChart } from './astro.js';
import { essentialDignity, accidentalDignity } from './dignities.js';
import { chartCautions } from './cautions.js';
import { planetaryHour, dayRuler } from './planetary-hours.js';
import { DOMICILE } from './data/dignities-data.js';
import { mansionOf } from './data/lunar-mansions.js';
import { faceOf } from './data/decan-faces.js';
import { starsInAspect, behenianLongitude } from './data/behenian-stars.js';
import { PLANETARY_MAGIC } from './data/planetary-magic.js';

const MALEFICS = ['Mars', 'Saturn'];
const BENEFICS = ['Jupiter', 'Venus'];
const ANGLES = [1, 4, 7, 10];
const MOON_MEAN = 13.176;
// Mansions whose traditional use is destructive/separative (Agrippa II.33 /
// Picatrix I.4) — fitting for works of decrease/banishing, ill for increase.
const MALEFIC_MANSIONS = [9, 11, 12, 14, 21, 22, 23, 25, 27];
const CITE = {
  hour: 'Picatrix III.7 & Agrippa II — operate in the planet’s own day & hour',
  dignity: 'Lilly, Christian Astrology pp.115-116 — a planet acts strongly only when dignified',
  phase: 'Picatrix I.4 / electional tradition — waxing Moon for increase, waning for decrease',
  moon: 'Lilly CA pp.121-123 (Considerations) — the Moon is weighed above all in elections',
  mansion: 'Agrippa II.33 / Picatrix I.4 — the Moon’s mansion must suit the work',
  dispositor: 'Electional best practice (research/SOURCE-DATA.md §5) — the ruler of the Moon’s sign signifies the outcome',
  via: 'Lilly CA / via combusta — the Moon distressed between 15° Libra–15° Scorpio (Spica exempt)',
  angles: 'Electional tradition — keep malefics off the angles; a benefic angular rectifies an afflicted Moon',
  star: 'Agrippa II — a Behenian fixed star conjunct the significator lends its virtue',
  corr: 'Picatrix III / Agrippa II — the planet’s correspondences for the operation',
};

// ---------------------------------------------------------------------------
//  The catalogue of operations (election aims). The operation→ruling-planet
//  mapping is an EDITORIAL convenience derived from the planetary
//  correspondences of Picatrix III & Agrippa II (see data/planetary-magic.js) —
//  the source texts give per-planet powers, not this exact list of named aims;
//  the `keywords` (matched against the Moon's mansion use) and the `stars` are
//  likewise an editorial overlay. `polarity`: 'increase' wants a waxing Moon,
//  'decrease' (banishing/binding/endings) wants a waning Moon.
// ---------------------------------------------------------------------------
export const OPERATIONS = [
  { key: 'love',      label: 'Love & concord',           ruler: 'Venus',   polarity: 'increase', book: 'Picatrix III (Venus)',   keywords: ['love', 'concord', 'friendship', 'married', 'goodwill'], stars: ['Spica', 'Sirius'] },
  { key: 'wealth',    label: 'Wealth & gain',            ruler: 'Jupiter', polarity: 'increase', book: 'Picatrix III (Jupiter)', keywords: ['gain', 'treasure', 'merchand', 'riches', 'business', 'harvest', 'herds'], stars: ['Spica', 'Regulus'] },
  { key: 'honour',    label: 'Honour, office & favour',  ruler: 'Sun',     polarity: 'increase', book: 'Picatrix III (Sun)',     keywords: ['kings', 'favour', 'dominion', 'honour'], stars: ['Regulus', 'Capella'] },
  { key: 'knowledge', label: 'Knowledge & eloquence',    ruler: 'Mercury', polarity: 'increase', book: 'Picatrix III (Mercury)', keywords: ['business', 'merchand', 'learning', 'writing', 'science', 'eloquence', 'gain'], stars: ['Procyon'] },
  { key: 'journey',   label: 'Journeys & beginnings',    ruler: 'Moon',    polarity: 'increase', book: 'Picatrix I (Moon)',      keywords: ['journey', 'voyage', 'travel', 'protection'], stars: ['Sirius'] },
  { key: 'victory',   label: 'Victory & courage',        ruler: 'Mars',    polarity: 'increase', book: 'Picatrix III (Mars)',    keywords: ['victory', 'war', 'fear', 'reverence'], stars: ['Regulus', 'Antares'] },
  { key: 'healing',   label: 'Healing & medicine',       ruler: 'Jupiter', polarity: 'increase', book: 'Picatrix / Agrippa',     keywords: ['healing', 'childbirth', 'medicines', 'sickness'], stars: ['Arcturus'] },
  { key: 'protection',label: 'Protection & defence',     ruler: 'Jupiter', polarity: 'increase', book: 'Agrippa II (Behenian)',  keywords: ['protection', 'thieves', 'captives'], stars: ['Algol', 'Procyon'] },
  { key: 'binding',   label: 'Binding & restraint',      ruler: 'Saturn',  polarity: 'decrease', book: 'Picatrix III (Saturn)',  keywords: ['obstruct', 'destroy', 'bind', 'discord'], stars: ['Algol'] },
  { key: 'banishing', label: 'Banishing & separation',   ruler: 'Mars',    polarity: 'decrease', book: 'Picatrix III (Mars)',    keywords: ['separation', 'divorce', 'destruction', 'enmity', 'ruin'], stars: ['Algol', 'Antares'] },
  { key: 'endings',   label: 'Endings & release',        ruler: 'Saturn',  polarity: 'decrease', book: 'Picatrix III (Saturn)',  keywords: ['separation', 'wasting', 'destruction'], stars: ['Deneb Algedi'] },
];
export const operationByKey = k => OPERATIONS.find(o => o.key === k);

// ---------------------------------------------------------------------------
//  Via combusta — configurable bounds with the Spica benefic exception.
//  Default 15° Libra–15° Scorpio (195°–225°). Spica (~24° Libra) is a
//  fortunate "oasis": when the Moon is within `spicaOrb` of Spica's longitude
//  (precessed to the date) the distress is lifted.
// ---------------------------------------------------------------------------
export function isViaCombusta(moonLon, date = new Date(), opts = {}) {
  const [lo, hi] = opts.bounds || [195, 225];
  const spicaOrb = opts.spicaOrb ?? 2;
  const useSpica = opts.spicaException !== false;
  const l = norm360(moonLon);
  const inZone = l >= lo && l <= hi;
  let exemptBySpica = false;
  if (inZone && useSpica) {
    const spica = behenianLongitude('Spica', date);
    if (spica !== undefined) exemptBySpica = Math.abs(norm360(l - spica + 180) - 180) <= spicaOrb;
  }
  return { inZone, exemptBySpica, active: inZone && !exemptBySpica, bounds: [lo, hi] };
}

// Moon phase from elongation (waxing < 180°).
export function moonPhase(chart) {
  const elong = norm360(chart.planets.Moon.lon - chart.planets.Sun.lon);
  const waxing = elong < 180;
  return { elongation: elong, waxing, label: waxing ? 'waxing' : 'waning' };
}

// The Moon's dispositor (ruler of her sign) and its condition — the outcome.
export function moonDispositor(chart) {
  const planet = DOMICILE[signOf(chart.planets.Moon.lon).index];
  if (!planet || !chart.planets[planet]) return { planet: null };
  const ed = essentialDignity(planet, chart.planets[planet].lon, chart.isDay);
  const ad = accidentalDignity(planet, chart);
  return { planet, essential: ed.total, accidental: ad.total, peregrine: ed.peregrine };
}

// ---------------------------------------------------------------------------
//  electionScore — the headline. Auto-calculates the full testimony for one
//  operation at the moment/place of `chart`. Returns a verdict + cited reasons.
// ---------------------------------------------------------------------------
export function electionScore(chart, operationKey, opts = {}) {
  const op = operationByKey(operationKey);
  if (!op) throw new Error(`unknown operation: ${operationKey}`);
  const reasons = [];
  let score = 0;
  const add = (delta, severity, text, cite) => { score += delta; reasons.push({ severity, text, cite, delta }); };

  // --- planetary hour & day (operate in the ruling planet's hour) ----------
  const ph = opts.planetaryHour || planetaryHour(chart.date, chart.latitude, chart.longitude);
  const dRuler = dayRuler(chart.date);
  const hourMatch = ph && ph.ruler === op.ruler;
  const dayMatch = dRuler === op.ruler;
  if (hourMatch && dayMatch) add(+3, 'good', `It is both the day AND hour of ${op.ruler} — the strongest timing for this work.`, CITE.hour);
  else if (hourMatch) add(+2, 'good', `It is the hour of ${op.ruler}, the ruler of this work.`, CITE.hour);
  else if (dayMatch) add(+1, 'note', `It is the day of ${op.ruler} but not its hour — wait for ${op.ruler}'s hour for best effect.`, CITE.hour);
  else add(-1, 'caution', `It is neither the day nor hour of ${op.ruler} — timing is weak.${ph ? ` (Now: hour of ${ph.ruler}, day of ${dRuler}.)` : ''}`, CITE.hour);

  // --- the ruling planet's dignity & affliction ----------------------------
  const ed = essentialDignity(op.ruler, chart.planets[op.ruler].lon, chart.isDay);
  if (ed.total >= 5) add(+3, 'good', `${op.ruler} is strongly dignified (+${ed.total}) — well able to act.`, CITE.dignity);
  else if (ed.total > 0) add(+1, 'note', `${op.ruler} has some essential dignity (+${ed.total}).`, CITE.dignity);
  else if (ed.peregrine) add(-2, 'caution', `${op.ruler} is peregrine — wandering, without dignity to act surely.`, CITE.dignity);
  else add(-3, 'bad', `${op.ruler} is essentially debilitated (${ed.total}) — feeble for this work.`, CITE.dignity);

  const cau = chartCautions(chart, { hourRuler: ph && ph.ruler });
  const rulerFlags = cau.planets[op.ruler]?.flags || [];
  for (const f of rulerFlags) {
    if (f.severity === 'bad') add(-3, 'bad', `${op.ruler}: ${f.text}`, CITE.dignity);
    else if (f.severity === 'caution') add(-1, 'caution', `${op.ruler}: ${f.text}`, CITE.dignity);
    else if (f.severity === 'good') add(+1, 'good', `${op.ruler}: ${f.text}`, CITE.dignity);
  }

  // Hard requirements (gating): the tradition will NOT call a work fit while its
  // ruling planet is retrograde, combust, or essentially debilitated — however
  // high the additive score. These cap a "green" verdict at amber.
  const gating = [];
  const isLuminary = op.ruler === 'Sun' || op.ruler === 'Moon';
  if (!isLuminary && chart.planets[op.ruler].retrograde) gating.push(`${op.ruler} is retrograde`);
  if (rulerFlags.some(f => /combust/i.test(f.text))) gating.push(`${op.ruler} is combust`);
  if (ed.rows.some(r => r.kind === 'Detriment')) gating.push(`${op.ruler} is in detriment`);
  if (ed.rows.some(r => r.kind === 'Fall')) gating.push(`${op.ruler} is in fall`);

  // --- the Moon: phase, condition, mansion, dispositor ---------------------
  const moon = chart.planets.Moon;
  const phase = moonPhase(chart);
  const wantWax = op.polarity === 'increase';
  if (phase.waxing === wantWax) add(+2, 'good', `The Moon is ${phase.label}, which suits ${wantWax ? 'increase & beginnings' : 'decrease, release & banishing'}.`, CITE.phase);
  else add(-1, 'caution', `The Moon is ${phase.label}, against this work (${wantWax ? 'increase wants a waxing Moon' : 'decrease wants a waning Moon'}).`, CITE.phase);

  const spd = Math.abs(moon.speed);
  if (spd >= MOON_MEAN) add(+1, 'good', `The Moon is swift (${spd.toFixed(1)}°/day) — matters move briskly.`, CITE.moon);
  else if (spd < 12) add(-1, 'caution', `The Moon is slow (${spd.toFixed(1)}°/day) — matters drag.`, CITE.moon);

  // void of course (reuse the cautions/considerations result)
  const voc = cau.global.find(a => /void of course/i.test(a.text));
  if (voc && voc.severity === 'caution') add(-3, 'bad', voc.text, CITE.moon);
  else if (voc) add(-1, 'caution', voc.text, CITE.moon);

  // via combusta with Spica exception
  const via = isViaCombusta(moon.lon, chart.date, opts.viaCombusta);
  if (via.active) add(-2, 'caution', 'The Moon is in the Via Combusta (the "burning way") — distressed.', CITE.via);
  else if (via.inZone && via.exemptBySpica) add(0, 'note', 'The Moon is in the Via Combusta but conjunct Spica — the distress is lifted (the fortunate oasis).', CITE.via);

  // under the Sun's beams / eclipse / applying to a malefic (from cautions)
  for (const a of cau.global) {
    if (/under the Sun.?s beams/i.test(a.text)) add(-2, 'caution', a.text, CITE.moon);
    else if (/eclipse season/i.test(a.text)) add(-3, 'bad', a.text, CITE.moon);
    else if (/applying to a hard aspect of (Mars|Saturn)/i.test(a.text)) add(-2, 'caution', a.text, CITE.moon);
  }

  // mansion fitness (Bk I) — keyword match, plus malefic-mansion awareness:
  // a destructive mansion suits decrease/banishing but harms a work of increase.
  const mansion = mansionOf(moon.lon);
  const useText = (mansion.use || '').toLowerCase();
  const mansionHit = op.keywords.some(k => useText.includes(k));
  const malefMansion = MALEFIC_MANSIONS.includes(mansion.num);
  if (mansionHit) add(+2, 'good', `The Moon is in Mansion ${mansion.num} (${mansion.name}), whose use — “${mansion.use}” — suits this work.`, CITE.mansion);
  else if (malefMansion && wantWax) add(-1, 'caution', `The Moon is in a destructive mansion (${mansion.num}, ${mansion.name}: “${mansion.use}”) — ill-suited to a work of increase.`, CITE.mansion);
  else if (malefMansion && !wantWax) add(+1, 'good', `The Moon is in a destructive mansion (${mansion.num}, ${mansion.name}: “${mansion.use}”) — fitting for a work of decrease/banishing.`, CITE.mansion);
  else add(0, 'note', `The Moon is in Mansion ${mansion.num} (${mansion.name}); use: “${mansion.use}”.`, CITE.mansion);

  // the Moon's dispositor — the outcome
  const disp = moonDispositor(chart);
  if (disp.planet) {
    const t = (disp.essential || 0) + (disp.accidental || 0);
    if (t > 0) add(+1, 'good', `The Moon's dispositor (${disp.planet}) is well placed (${t >= 0 ? '+' : ''}${t}) — the outcome is supported.`, CITE.dispositor);
    else add(-1, 'caution', `The Moon's dispositor (${disp.planet}) is weak (${t}) — the outcome may falter.`, CITE.dispositor);
  }

  // --- malefics / benefics on the angles -----------------------------------
  for (const m of MALEFICS) {
    if (ANGLES.includes(chart.planets[m].house)) add(-2, 'caution', `${m} is angular (${chart.planets[m].house}th house) — a malefic on an angle troubles the work.`, CITE.angles);
  }
  const benAngular = BENEFICS.filter(b => ANGLES.includes(chart.planets[b].house));
  if (benAngular.length) add(+2, 'good', `${benAngular.join(' & ')} angular — a benefic on an angle rectifies an unfortunate Moon.`, CITE.angles);

  // --- Behenian fixed-star contacts (Bk II) --------------------------------
  const contacts = starsInAspect(chart, opts.starOrb ?? 6);
  for (const c of contacts) {
    if (op.stars.includes(c.star) && (c.planet === op.ruler || c.planet === 'Moon'))
      add(+1, 'good', `${c.planet} is conjunct the fixed star ${c.star} (within ${c.sep.toFixed(1)}°) — lends its virtue to this work.`, CITE.star);
  }

  // --- verdict from score, but never green over a hard caution OR a gating fail
  const bad = reasons.filter(r => r.severity === 'bad').length;
  const cautions = reasons.filter(r => r.severity === 'caution').length;
  let verdict, label;
  if (bad >= 1 || score <= -2) { verdict = 'red'; label = 'Unfavourable — strong testimony against this work now.'; }
  else if (score >= 5 && cautions === 0 && gating.length === 0) { verdict = 'green'; label = 'Favourable — the testimonies agree.'; }
  else { verdict = 'amber'; label = 'Mixed — some support, some impediment; weigh the cautions.'; }
  // a failed hard requirement caps a high score at amber and is stated plainly
  if (gating.length) {
    if (verdict === 'green') verdict = 'amber';
    label += ` Hard requirement unmet (${gating.join('; ')}) — the tradition would not call this fit, however high the score.`;
    reasons.push({ severity: 'caution', text: `Hard requirement unmet: ${gating.join('; ')}.`, cite: CITE.dignity, delta: 0 });
  }

  // sort reasons worst-first for display
  const RANK = { bad: 3, caution: 2, note: 1, good: 0 };
  reasons.sort((a, b) => RANK[b.severity] - RANK[a.severity]);

  return {
    operation: op, verdict, label, score, gating,
    ruler: { planet: op.ruler, essential: ed.total, peregrine: ed.peregrine },
    hour: ph ? { ruler: ph.ruler, dayRuler: dRuler, hourMatch, dayMatch } : null,
    moon: {
      lon: moon.lon, sign: signOf(moon.lon).name, speed: spd, phase: phase.label,
      mansion: { num: mansion.num, name: mansion.name, use: mansion.use },
      viaCombusta: via, voidOfCourse: !!(voc && voc.severity === 'caution'),
      dispositor: disp, face: faceOf(moon.lon),
    },
    sunFace: faceOf(chart.planets.Sun.lon),
    stars: contacts,
    correspondences: PLANETARY_MAGIC[op.ruler],
    reasons,
  };
}

// ---------------------------------------------------------------------------
//  rankNow — score EVERY operation for one moment, best first (the dashboard).
// ---------------------------------------------------------------------------
export function rankNow(chart, opts = {}) {
  const ph = planetaryHour(chart.date, chart.latitude, chart.longitude);
  const VRANK = { green: 2, amber: 1, red: 0 };
  return OPERATIONS
    .map(o => electionScore(chart, o.key, { ...opts, planetaryHour: ph }))
    .sort((a, b) => (VRANK[b.verdict] - VRANK[a.verdict]) || (b.score - a.score));
}

// ---------------------------------------------------------------------------
//  findNextElection — scan forward and return the best upcoming windows for an
//  operation. Optimization, not perfection: returns ranked windows, never a
//  demand for a flawless chart. Coarsely steps `stepMinutes`, groups contiguous
//  amber/green moments into windows, and ranks by best score.
// ---------------------------------------------------------------------------
export function findNextElection(operationKey, fromDate, lat, lon, opts = {}) {
  const hoursAhead = opts.hoursAhead ?? 72;
  const stepMin = opts.stepMinutes ?? 30;
  const system = opts.system || 'regiomontanus';
  const minVerdict = opts.minVerdict || 'amber'; // 'amber' includes amber+green
  const ok = v => (minVerdict === 'green' ? v === 'green' : v !== 'red');

  const windows = [];
  let cur = null;
  const steps = Math.ceil((hoursAhead * 60) / stepMin);
  for (let i = 0; i <= steps; i++) {
    const t = new Date(fromDate.getTime() + i * stepMin * 60000);
    let res;
    try { res = electionScore(castChart(t, lat, lon, system), operationKey, opts); }
    catch { res = null; }
    if (res && ok(res.verdict)) {
      if (!cur) cur = { start: t, end: t, best: res.score, bestVerdict: res.verdict, peak: res };
      else { cur.end = t; if (res.score > cur.best) { cur.best = res.score; cur.bestVerdict = res.verdict; cur.peak = res; } }
    } else if (cur) { windows.push(cur); cur = null; }
  }
  if (cur) windows.push(cur);
  windows.sort((a, b) => b.best - a.best);
  return windows;
}

// ---------------------------------------------------------------------------
//  nextAuspiciousTime — scan forward for the next moment the CHART-HEALTH
//  verdict (cautions.js) reaches `target` ('amber' = amber-or-better, the
//  default; or 'green'). Used by the chart-health panels to answer "if now is
//  impeded, when does the sky next clear?". Returns {time, verdict, label,
//  hoursFromNow, changed[]} or null if nothing qualifies within the window.
//  This is the electional tradition's habit of WAITING for a better hour —
//  presented as method, not advice.
// ---------------------------------------------------------------------------
export function nextAuspiciousTime(fromDate, lat, lon, opts = {}) {
  const hoursAhead = opts.hoursAhead ?? 48;
  const stepMin = opts.stepMinutes ?? 20;
  const system = opts.system || 'regiomontanus';
  const RANK = { red: 0, amber: 1, green: 2 };
  const want = RANK[opts.target] ?? RANK.amber;
  const baseline = (() => {
    try {
      const c = castChart(fromDate, lat, lon, system);
      const ph = planetaryHour(fromDate, lat, lon);
      return chartCautions(c, { hourRuler: ph && ph.ruler });
    } catch { return null; }
  })();
  const base = baseline ? RANK[baseline.verdict] : -1;
  const steps = Math.ceil((hoursAhead * 60) / stepMin);
  for (let i = 1; i <= steps; i++) {
    const t = new Date(fromDate.getTime() + i * stepMin * 60000);
    let cau;
    try {
      const c = castChart(t, lat, lon, system);
      const ph = planetaryHour(t, lat, lon);
      cau = chartCautions(c, { hourRuler: ph && ph.ruler });
    } catch { continue; }
    // the next moment that both meets the target AND improves on right now
    if (RANK[cau.verdict] >= want && RANK[cau.verdict] > base) {
      return { time: t, verdict: cau.verdict, label: cau.label, hoursFromNow: (i * stepMin) / 60, baseline: baseline ? baseline.verdict : null };
    }
  }
  return null;
}
