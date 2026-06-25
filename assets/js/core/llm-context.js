// ============================================================================
//  llm-context.js — the bridge between the engine and a LOCAL language model.
//  PURE (no DOM, no network) so it is headless-testable and identical for every
//  backend (Ollama, in-browser WebLLM, …). It turns a `fullReading` (and the
//  capability registry) into three things the assistant needs:
//
//    • buildContext(reading)  → a SYSTEM prompt that locks the honest-science
//      framing, a relevant glossary, and the COMPUTED, CITED facts of the moment
//      (so the model narrates real numbers instead of inventing them);
//    • buildToolSchema()      → an OpenAI/Ollama-style function schema of the
//      engine's callable capabilities (the agentic mode);
//    • runTool(name, args, ctx) → a safe dispatcher that actually runs an engine
//      function for a tool call and returns plain JSON (refuses unknown tools).
//
//  The honest framing is the SAME canonical string as reading.js, so the model's
//  guardrail can never drift from the site's disclaimer. Astrology has no
//  demonstrated predictive validity; the assistant describes a tradition, it
//  does not advise or predict.
// ============================================================================
import { HONEST_FRAMING } from './reading.js';
import { REGISTRY, toToolSchema, callableEntries } from './registry.js';
import { GLOSSARY } from './data/glossary.js';
// engine functions for runTool (the agentic mode)
import { castChart, signOf, formatLon } from './astro.js';
import { essentialDignity, almuten } from './dignities.js';
import { planetaryHour } from './planetary-hours.js';
import { electionScore, rankNow, findNextElection, OPERATIONS } from './election.js';
import { talismanRecipe } from './talisman.js';
import { annualProfection } from './profections.js';
import { lifeTrajectory } from './trajectory.js';
import { mansionOf } from './data/lunar-mansions.js';
import { faceOf } from './data/decan-faces.js';

// ---------------------------------------------------------------------------
//  The locked guardrail. Prepended (and not removable) as the model's system
//  message. Built on the canonical HONEST_FRAMING so it cannot drift.
// ---------------------------------------------------------------------------
export const HONEST_SYSTEM_PREAMBLE =
  'You are a careful study assistant for "The Astrologer\'s Workbench", a historical reconstruction of ' +
  'William Lilly\'s Christian Astrology (1647) and the medieval Picatrix. ' + HONEST_FRAMING + '\n\n' +
  'RULES:\n' +
  '1. DESCRIBE the tradition\'s reasoning; never PRESCRIBE. Do not present astrology as valid prediction, and do not ' +
  'give real-world advice (medical, legal, financial, relationship, safety) as fact. If asked to predict the future ' +
  'or to act on a reading, decline and restate the framing.\n' +
  '2. Ground every claim in the COMPUTED FACTS below. Do NOT invent positions, dignities or verdicts — cite the facts ' +
  'as given (they carry their source). If a fact is not in the context, say so or call a tool to compute it.\n' +
  '3. Talismanic / magical material is HISTORICAL PRACTICE ONLY; some recipes name toxic or illegal substances — ' +
  'record them as history, never instruct their making or use.\n' +
  '4. Cite Lilly (Christian Astrology, 1647) and the Picatrix by name where relevant. Be concise and plain-spoken.';

// ---------------------------------------------------------------------------
//  Which registry capabilities are present in a given reading (so we only pull
//  the relevant glossary terms — keeps the context small and on-topic).
// ---------------------------------------------------------------------------
function presentCapabilityIds(reading) {
  const ids = ['positions', 'essential-dignity', 'accidental-dignity', 'almuten', 'chart-health',
    'aspects', 'part-of-fortune', 'moon-condition', 'election', 'talisman'];
  if (reading.horary) ids.push('perfection');
  if (reading.natal) ids.push('profections', 'directions', 'solar-return', 'hyleg', 'life-trajectory');
  return ids;
}

function relevantGlossary(presentSet) {
  // gather the glossary terms named by the present capabilities (via the
  // registry), then resolve them to {term, def} from GLOSSARY.
  const wanted = new Set();
  for (const e of REGISTRY) {
    if (presentSet.has(e.id)) for (const t of (e.glossaryTerms || [])) wanted.add(t);
  }
  return GLOSSARY.filter(g => wanted.has(g.term)).map(g => ({ term: g.term, def: g.def }));
}

// ---------------------------------------------------------------------------
//  buildContext — the system prompt + the structured fact table.
//  opts.maxFacts (default 60) bounds the size.
// ---------------------------------------------------------------------------
export function buildContext(reading, opts = {}) {
  const presentSet = new Set(presentCapabilityIds(reading));
  const maxFacts = opts.maxFacts ?? 60;
  const facts = [];
  const add = (text, cite) => { if (text) facts.push({ text, cite: cite || '' }); };

  const m = reading.moment, ph = m.planetaryHour;
  add(`Moment: ${fmtDate(reading.meta.inputs.date)} at lat ${reading.meta.inputs.latitude}, lon ${reading.meta.inputs.longitude}; ${m.isDay ? 'a day chart' : 'a night chart'} (${m.system} houses).`, 'astronomy-engine (~1′)');
  add(`Ascendant ${m.angles.asc.label}; Midheaven ${m.angles.mc.label}.`, 'Lilly CA Bk I — the figure');
  if (ph) add(`Planetary hour of ${ph.ruler}; the day is ruled by ${ph.dayRuler}.`, 'Lilly CA / Picatrix III.7 — planetary hours');
  add(`Chart-health verdict: ${reading.cautions.verdict} — ${reading.cautions.label}`, 'Lilly CA Bk II — considerations');
  for (const a of reading.cautions.global.slice(0, 6)) add(`Caution (${a.severity}): ${a.text}`, 'Lilly CA Bk II');

  // planets + dignity
  for (const name of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    const p = m.planets[name]; const d = reading.dignities.perPlanet[name];
    add(`${name}: ${p.label}${p.retrograde ? ' retrograde' : ''}, house ${p.house}; dignity total ${d.sumTotal} (essential ${d.essential.total}, accidental ${d.accidental.total})${d.essential.peregrine ? ', peregrine' : ''}.`, 'Lilly CA Bk I — dignity');
  }
  add(`Almuten of the Ascendant: ${reading.dignities.almutens.ascendant.planet}. Lord of the Geniture: ${reading.dignities.lordOfGeniture.planet}.`, 'Lilly CA Bk I');
  add(`Part of Fortune: ${reading.lots.fortune.label}; Part of Spirit: ${reading.lots.spirit.label}.`, 'Lilly CA Bk I — the Lots');

  // moon condition (from election.selected.moon)
  const sel = reading.election.selected;
  if (sel) {
    const mo = sel.moon;
    add(`The Moon is ${mo.phase}, in ${mo.sign}, mansion ${mo.mansion.num} (${mo.mansion.name}: "${mo.mansion.use}")${mo.voidOfCourse ? ', VOID OF COURSE' : ''}${mo.viaCombusta && mo.viaCombusta.active ? ', in the Via Combusta' : ''}.`, 'Lilly CA Bk II — the Moon');
  }

  // aspects (top few by tightest orb)
  const asp = [...reading.aspects.list].sort((a, b) => a.orb - b.orb).slice(0, 6);
  for (const a of asp) add(`${a.from} ${a.aspect} ${a.to}, ${a.applying ? 'applying' : 'separating'}, orb ${a.orb.toFixed(1)}°.`, 'Lilly CA Bk I — aspects');

  // election + talisman
  if (sel) {
    add(`Election for "${sel.operation.label}" (ruler ${sel.operation.ruler}): verdict ${sel.verdict}, score ${sel.score}${sel.gating && sel.gating.length ? `; hard requirement unmet: ${sel.gating.join('; ')}` : ''}.`, 'Picatrix III / Agrippa II — election');
    for (const r of sel.reasons.slice(0, 5)) add(`Election reason (${r.severity}): ${r.text}`, r.cite);
  }
  const ranked = reading.election.rankedNow;
  if (ranked.length) add(`Aims ranked now (best→worst): ${ranked.map(o => `${o.label} ${o.verdict}`).join('; ')}.`, 'Picatrix — election');
  const t = reading.talisman;
  if (t) add(`Talisman for "${t.aim}" (${t.planet}): verdict ${t.verdict}; suffumigation ${t.materials.suffumigation}, colour ${t.materials.colour}, metal ${t.materials.metal}, stone ${t.materials.stone}.`, 'Picatrix II–III / Agrippa II — historical practice only');

  // horary
  if (reading.horary) {
    const h = reading.horary;
    add(`Horary (house ${h.quesitedHouse}): querent significator ${h.querent.lordAsc}, quesited significator ${h.quesited.lordQ}${h.sharedSignificator ? ' (shared significator)' : ''}.`, 'Lilly CA Bk II — significators');
    const M = h.perfection.modes || {};
    const modes = [];
    if (M.direct) modes.push(`direct ${M.direct.aspect} (${M.direct.applying ? 'applying' : 'separating'})`);
    if (M.translation) modes.push(`translation by ${M.translation.carrier}`);
    if (M.collection) modes.push(`collection by ${M.collection.collector}`);
    if (M.prohibition) modes.push(`prohibition by ${M.prohibition.planet}`);
    if (M.refranation) modes.push(`refranation of ${M.refranation.planet}`);
    if (modes.length) add(`Perfection: ${modes.join('; ')}${h.timing ? `; timing ${h.timing.text}` : ''}.`, 'Lilly CA Bk II — perfection');
  }

  // natal
  if (reading.natal) {
    const tj = reading.natal.trajectory, cy = tj.currentYear, n = tj.natal;
    add(`Nativity: almuten of Ascendant ${n.almutenAsc}, Lord of the Geniture ${n.lordOfGeniture.planet}, temperament ${n.temperament.dominant}.`, 'Lilly CA Bk III');
    add(`This year (age ${cy.age}): profected to ${cy.profectedSign}, ${cy.activatedHouse}th house; Lord of the Year ${cy.lordOfYear}.`, 'Lilly CA Bk III — profections');
    add(`Native ruling planets: ${tj.picatrix.rulingPlanets.join(', ')}.`, 'Picatrix overlay');
  }

  // vedic (a separate sidereal system, shown for comparison)
  if (reading.vedic) {
    const vd = reading.vedic;
    add(`Vedic (sidereal / Jagannath Hora): Lagna ${vd.lagna.label}, Moon in nakṣatra ${vd.grahas.Moon.nakshatra.name}; running Vimśottarī daśā ${vd.vimshottari.currentMaha} mahā${vd.vimshottari.currentAntar ? '/' + vd.vimshottari.currentAntar + ' antar' : ''}; tithi ${vd.panchanga.tithi.name}. (A SEPARATE system from the Western chart — do not conflate the two zodiacs.)`, 'Parāśara BPHS / Jagannath Hora');
  }

  const trimmed = facts.slice(0, maxFacts);
  const glossary = relevantGlossary(presentSet);

  const system =
    HONEST_SYSTEM_PREAMBLE +
    '\n\nGLOSSARY (for grounding the terms of art):\n' +
    glossary.map(g => `- ${g.term}: ${g.def}`).join('\n') +
    '\n\nCOMPUTED FACTS for this moment (already calculated by the engine; cite these, do not invent):\n' +
    trimmed.map(f => `- ${f.text}${f.cite ? `  [${f.cite}]` : ''}`).join('\n');

  return { system, facts: trimmed, glossary };
}

function fmtDate(d) { try { return new Date(d).toISOString().replace('.000Z', 'Z'); } catch { return String(d); } }

// ---------------------------------------------------------------------------
//  buildToolSchema — the engine's callable capabilities as a function schema.
//  Adds two convenience tools (rankNow, findNextElection) the registry folds
//  under the election entry, so the agentic mode can use them by name too.
// ---------------------------------------------------------------------------
export function buildToolSchema() {
  const schema = toToolSchema();
  schema.push({
    type: 'function',
    function: {
      name: 'rankNow',
      description: 'Rank all Picatrix election aims (best→worst) for a moment & place. Uses the current chart if no date/lat/lon is given.',
      parameters: { type: 'object', properties: { date: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' } }, required: [] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'findNextElection',
      description: 'Scan forward for the best upcoming windows for an election aim.',
      parameters: {
        type: 'object',
        properties: {
          operationKey: { type: 'string', enum: OPERATIONS.map(o => o.key) },
          date: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' },
          hoursAhead: { type: 'number' },
        },
        required: ['operationKey'],
      },
    },
  });
  return schema;
}

// The set of tool names the dispatcher accepts (callable exports + the two extras).
export function toolNames() {
  return [...callableEntries().map(e => e.exportName), 'rankNow', 'findNextElection'];
}

// The live tool's public locations — given to the model so it can point a user
// at the hosted Workbench and the source.
export const SITE_URLS = {
  hosted: 'https://occult-kranti.github.io/astrology-sim-ant/',
  workbench: 'https://occult-kranti.github.io/astrology-sim-ant/pages/workbench.html',
  repo: 'https://github.com/occult-kranti/astrology-sim-ant',
};

// Convert the OpenAI/Ollama-style function schema to the Anthropic Messages tool
// shape ({name, description, input_schema}) for the Claude backend.
export function toAnthropicTools() {
  return buildToolSchema().map(t => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters,
  }));
}

// ---------------------------------------------------------------------------
//  buildCodexPrompt — the "Codex of the Hour": a user message that asks the
//  model to narrate the computed master report tool-by-tool in an evocative
//  Hermes-Trismegistus / Picatrix codebook register — meaning + best historical
//  use of each — while keeping the honest framing. The cited facts are supplied
//  separately in the system context (buildContext); this only sets the task.
// ---------------------------------------------------------------------------
export function buildCodexPrompt(reading) {
  const has = k => reading && reading[k];
  const sections = [
    'The Figure & the planetary hour — the cast of the moment',
    'Book I — the dignity ledger, the almutens, and the Lord of the Geniture',
    'Chart health — the considerations & the Moon weighed above all',
    'The Lots & antiscia — the hidden geometry',
    'Aspects & reception — how the planets regard one another',
    'The Picatrix election — what this hour is fit (and unfit) for',
    'The talisman — the historical recipe of the ruling planet',
  ];
  if (has('horary')) sections.push('Book II — the horary significators & the modes of perfection');
  if (has('natal')) sections.push('Book III — the life trajectory, the Lord of the Year, the personal Picatrix layer');
  return (
    'Compose "THE CODEX OF THIS HOUR" — written in the grave, image-rich register of Hermes ' +
    'Trismegistus and the Picatrix, yet TRUTHFUL: every claim drawn only from the computed, cited ' +
    'facts above. For EACH section below give three short lines — (a) WHAT it measures, plainly; ' +
    '(b) its MEANING for this exact moment, citing the figures; (c) how the tradition would BEST ' +
    'USE it (the favourable course of action it counsels, framed as historical practice). Keep each ' +
    'section tight (3–5 sentences total). Number the sections.\n\nSections:\n' +
    sections.map((s, i) => `${i + 1}. ${s}`).join('\n') +
    '\n\nClose with a single "Caveat of the Adept": one sentence restating that this is a faithful ' +
    'reconstruction of a historical, pseudoscientific art — described for study, never prescribed, ' +
    'and of no demonstrated efficacy.'
  );
}

// ---------------------------------------------------------------------------
//  buildOperationPrompt — the agentic "ask the Workbench to do a working" meta-
//  prompt (the "conjure rain" pattern). It frames a free-form magical aim as a
//  tool-using task: map the aim to a catalogued operation, find the next
//  favourable window with the engine tools, say what to check in the master
//  report, and lay out the historical procedure — all described, not prescribed.
// ---------------------------------------------------------------------------
export function buildOperationPrompt(reading, request, opts = {}) {
  const inp = (reading && reading.meta && reading.meta.inputs) || {};
  const place = `lat ${inp.latitude}, lon ${inp.longitude}`;
  const when = fmtDate(inp.date);
  const aims = OPERATIONS.map(o => `${o.key} (${o.label})`).join(', ');
  return (
    `A practitioner asks: "${String(request).trim()}"\n\n` +
    'Answer ONLY from the Lilly + Picatrix tradition this Workbench computes, and USE THE ENGINE ' +
    'TOOLS to ground every number (do not invent positions or times). Proceed in five numbered steps:\n' +
    `1. INTERPRET the aim and map it to the CLOSEST catalogued operation — one of: ${aims}. If none ` +
    'truly fits (e.g. weather-working has no exact catalogued aim), say so plainly and choose the ' +
    'nearest by significator (e.g. rain → the Moon & Jupiter; name the editorial leap).\n' +
    `2. FIND THE NEXT FAVOURABLE WINDOW for that operation from now (${when}) at this place (${place}) ` +
    'by calling the `findNextElection` (and/or `rankNow`, `nextAuspiciousTime`) tools. Report the ' +
    'concrete window the tool returns.\n' +
    '3. WHAT TO CHECK in the master report (the Workbench): name the exact panels & values to verify ' +
    '— the planetary hour, the ruling planet’s dignity, the Moon’s phase/mansion/void-of-course, the ' +
    'election verdict, any fixed-star contact.\n' +
    '4. THE HISTORICAL PROCEDURE the tradition would follow: the timing (day & hour), the materials ' +
    'and mansion (call `talismanRecipe` if useful), the design — recorded as historical practice.\n' +
    '5. Point the practitioner to the live tool to watch it themselves: ' +
    `${SITE_URLS.workbench} (source: ${SITE_URLS.repo}).\n\n` +
    'End with one honest sentence: this is a historical, pseudoscientific art with no demonstrated ' +
    'efficacy — described for study, never a recommendation to act.'
  );
}

// ---------------------------------------------------------------------------
//  runTool — execute an engine function for a tool call. `ctx` may carry the
//  page's current { chart, birthChart, lat, lon } so tools that need a chart can
//  use it without the model re-supplying everything. Returns plain JSON; THROWS
//  on an unknown tool or a missing required argument. Magical/talisman output is
//  still historical-only — the system prompt enforces the framing.
// ---------------------------------------------------------------------------
export function runTool(name, args = {}, ctx = {}) {
  const need = (k) => { if (args[k] == null) throw new Error(`tool ${name}: missing argument "${k}"`); return args[k]; };
  const chartFromArgs = () => {
    if (args.date != null && args.lat != null && args.lon != null)
      return castChart(new Date(args.date), args.lat, args.lon, args.system || 'regiomontanus');
    if (ctx.chart) return ctx.chart;
    throw new Error(`tool ${name}: need a current chart or date+lat+lon`);
  };
  const slimChart = c => ({
    asc: formatLon(c.asc), mc: formatLon(c.mc), isDay: c.isDay, system: c.system,
    planets: Object.fromEntries(Object.entries(c.planets).map(([k, p]) => [k, { position: formatLon(p.lon), house: p.house, retrograde: !!p.retrograde }])),
  });
  const slimElection = e => ({
    operation: e.operation.label, ruler: e.operation.ruler, verdict: e.verdict, score: e.score,
    gating: e.gating, reasons: e.reasons.slice(0, 8).map(r => ({ severity: r.severity, text: r.text, cite: r.cite })),
    moon: { sign: e.moon.sign, phase: e.moon.phase, mansion: e.moon.mansion, voidOfCourse: e.moon.voidOfCourse },
  });

  switch (name) {
    case 'castChart': return slimChart(castChart(new Date(need('date')), need('lat'), need('lon'), args.system || 'regiomontanus'));
    case 'planetaryHour': return planetaryHour(new Date(need('date')), need('lat'), need('lon'));
    case 'essentialDignity': return essentialDignity(need('planet'), need('lon'), !!args.isDay);
    case 'almuten': return almuten(need('lon'), !!args.isDay);
    case 'mansionOf': return mansionOf(need('lon'));
    case 'faceOf': return faceOf(need('lon'));
    case 'electionScore': return slimElection(electionScore(chartFromArgs(), need('operationKey')));
    case 'talismanRecipe': { const r = talismanRecipe(chartFromArgs(), need('operationKey')); return { aim: r.aim, planet: r.planet, verdict: r.verdict, materials: r.materials, steps: r.steps.map(s => s.text), disclaimer: r.disclaimer }; }
    case 'annualProfection': return annualProfection(ctx.birthChart || chartFromArgs(), need('age'));
    case 'lifeTrajectory': { const tj = lifeTrajectory(ctx.birthChart || chartFromArgs(), {}); return { natal: tj.natal, currentYear: tj.currentYear, rulingPlanets: tj.picatrix.rulingPlanets }; }
    case 'rankNow': return rankNow(chartFromArgs()).map(r => ({ aim: r.operation.label, ruler: r.operation.ruler, verdict: r.verdict, score: r.score }));
    case 'findNextElection': return findNextElection(need('operationKey'), args.date ? new Date(args.date) : (ctx.chart ? ctx.chart.date : new Date()), args.lat ?? (ctx.chart && ctx.chart.latitude), args.lon ?? (ctx.chart && ctx.chart.longitude), { hoursAhead: args.hoursAhead || 72 }).map(w => ({ start: w.start, end: w.end, bestScore: w.best, bestVerdict: w.bestVerdict }));
    default: throw new Error(`unknown tool: ${name}`);
  }
}
