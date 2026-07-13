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
import { castVedic } from './vedic.js';
import { mansionOf } from './data/lunar-mansions.js';
import { faceOf } from './data/decan-faces.js';
import { prayerFor, PERFECT_NATURE } from './data/picatrix-prayers.js';
// the divination oracles (pure engines; randomness is injected by the app via ctx.rand)
import { castFromTallies, geomanticJudgement } from './geomancy.js';
import { tarotReading, SPREADS } from './tarot.js';
import { DECK_IDS } from './data/tarot-deck.js';
import { linesFromThrows, castReading as castIchingReading } from './iching.js';

const RASHI_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

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
  if (reading.vedic) ids.push('vedic');
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

// The CITE-BOUND output contract, appended to every grounded system prompt:
// the model must tag computed claims with the fact number, so a reader can
// audit every sentence of a reply back to a real engine output.
export const CITE_CONTRACT =
  '\n\nOUTPUT CONTRACT — cite-bound replies: whenever you state a computed value or verdict from the facts above, ' +
  'tag the sentence with the fact number(s) in square brackets, e.g. "the Moon is void of course [F7]". If you draw ' +
  'on general knowledge of the tradition instead of a numbered fact, say so plainly (e.g. "by the tradition, …"). ' +
  'Never attach a fact-tag to a claim the numbered facts do not support.';

// ---------------------------------------------------------------------------
//  buildContext — the system prompt + the structured fact table.
//  opts.maxFacts (default 60) bounds the size.
// ---------------------------------------------------------------------------
export function buildContext(reading, opts = {}) {
  const presentSet = new Set(presentCapabilityIds(reading));
  const maxFacts = opts.maxFacts ?? 110;
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
  // Picatrix Book III prayer & spirit of the ruling planet (historical text only)
  if (t && t.planet) {
    const pr = prayerFor(t.planet);
    if (pr) add(`Picatrix Book III for the ruling planet ${t.planet}: the III.7 prayer addresses it as ${pr.address.split('.')[0].toLowerCase()}; prayer-angel ${pr.prayerAngel.latin || '(none — the Sun is addressed directly)'}, directional spirit ${pr.spirit.master} (III.9). A prayer-excerpt: "${pr.prayerExcerpt.slice(0, 160)}…" — HISTORICAL TEXT, recorded as doctrine, never an instruction.`, pr.citation);
  }

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

  // vedic (a SEPARATE sidereal system, shown for comparison) — a fuller block so
  // the model can read the Vedic chart in detail and CROSS-COMPARE it with the
  // Western one (the two zodiacs disagree by design; never conflate them).
  if (reading.vedic) {
    const vd = reading.vedic;
    add(`VEDIC SYSTEM (sidereal / Jagannath Hora, Lahiri ayanāṁśa ${vd.ayanamsa}°) — a SECOND, INDEPENDENT reading to COMPARE with the Western chart above, never to merge. The astronomy is identical; only the zodiac (tropical−ayanāṁśa) and the methods differ.`, 'Parāśara BPHS / Jagannath Hora');
    add(`Vedic Lagna ${vd.lagna.label} (lord ${vd.lagna.lord}); Lagna nakṣatra ${vd.lagna.nakshatra.name} pada ${vd.lagna.nakshatra.pada}.`, 'BPHS — the Lagna');
    for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
      const g = vd.grahas[p]; if (!g) continue;
      add(`${p} (Vedic): ${g.label}, bhāva ${g.house}, nakṣatra ${g.nakshatra.name} p${g.nakshatra.pada}, ${g.dignity.state}${g.retrograde && p !== 'Rahu' && p !== 'Ketu' ? ', retrograde' : ''}; kāraka of ${g.karaka}.`, 'BPHS — grahas & Parāśarī dignity');
    }
    const pa = vd.panchanga;
    add(`Pañcāṅga: tithi ${pa.tithi.name} (${pa.tithi.paksha}); vāra ${pa.vara.name} (lord ${pa.vara.lord}); nakṣatra ${pa.nakshatra.name}; yoga ${pa.yoga.name}; karaṇa ${pa.karana.name}.`, 'Classical pañcāṅga');
    const dz = vd.vimshottari;
    add(`Vimśottarī daśā: running ${dz.currentMaha} mahādaśā${dz.currentAntar ? ' / ' + dz.currentAntar + ' antardaśā' : ''} (balance ${dz.balanceYears} yr from the Moon in ${dz.nakshatra.name}); next mahās ${dz.maha.filter(m => !m.current).slice(0, 3).map(m => m.lord).join(' → ')}.`, 'BPHS — Vimśottarī');
    const yp = vd.yogas.filter(y => y.present);
    if (yp.length) add(`Vedic yogas present: ${yp.map(y => `${y.name} (${y.detail})`).join('; ')}.`, 'BPHS — yogas');
    const sav = vd.ashtakavarga.sav, hi = Math.max(...sav), lo = Math.min(...sav);
    add(`Sarvāṣṭakavarga total ${vd.ashtakavarga.savTotal} (checksum 337); strongest sign ${RASHI_NAMES[sav.indexOf(hi)]} (${hi} bindus), weakest ${RASHI_NAMES[sav.indexOf(lo)]} (${lo}). Avg 28 per sign.`, 'BPHS — Aṣṭakavarga');
    if (vd.shadbala && vd.shadbala.perGraha) {
      const s = vd.shadbala, st = s.perGraha[s.strongest], wk = s.perGraha[s.weakest];
      add(`Ṣaḍbala (six-fold strength, rūpas): strongest ${s.strongest} (${st.totalRupa}, ${st.ratio}× its required ${st.required}); weakest ${s.weakest} (${wk.totalRupa}, ${wk.ratio}×). Full order ${s.order.join(' > ')}.`, 'BPHS Ch.27 — Ṣaḍbala (with documented JHora simplifications)');
    }
    // daily (vāra) + birth-keyed traditional practice — CULTURAL/DEVOTIONAL, described, never prescribed.
    if (vd.practice) {
      const pr = vd.practice, vv = pr.vara, bb = pr.birth;
      add(`Traditional practice for the day (${vv.name}/${vv.sanskrit}, a ${vv.graha}-ruled vāra): deity ${vv.deity}; observance ${vv.vrata}; colour ${vv.colour}; mantra "${vv.mantra}" (bīja "${vv.bija}", japa ${vv.japa}); yoga ${vv.yoga} (modern syncretic); yantra ${vv.yantra}. Recorded as cultural/devotional practice, NEVER prescribed.`, vv.source);
      add(`Birth-keyed practice: the remedial focus is ${bb.focusGraha} (${bb.reason}); its mantra "${bb.mantra}" (bīja "${bb.bija}", japa ${bb.japa}, deity ${bb.deity}); yoga ${bb.yoga} (modern); yantra ${bb.yantra}; gem ${bb.gem}. Lagna lord ${bb.lagnaLord}; running daśā lord ${bb.dashaLord}; birth Moon-nakṣatra ${bb.moonNakshatra} (deity ${bb.moonNakshatraDeity}).`, 'Mantra Mahodadhi / Navagraha Stotra / graha-yantra tradition — historical practice only');
    }
  }

  const trimmed = facts.slice(0, maxFacts);
  // opts.maxGlossary caps the definitions for tight free-tier token budgets
  const glossary = relevantGlossary(presentSet).slice(0, opts.maxGlossary ?? 99);

  const system =
    HONEST_SYSTEM_PREAMBLE +
    '\n\nGLOSSARY (for grounding the terms of art):\n' +
    glossary.map(g => `- ${g.term}: ${g.def}`).join('\n') +
    '\n\nCOMPUTED FACTS for this moment (already calculated by the engine; cite these, do not invent). Each fact is numbered:\n' +
    trimmed.map((f, i) => `- [F${i + 1}] ${f.text}${f.cite ? `  [${f.cite}]` : ''}`).join('\n') +
    CITE_CONTRACT;

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
  schema.push({
    type: 'function',
    function: {
      name: 'castVedic',
      description: 'Compute the VEDIC (Jyotiṣa / sidereal, Jagannath Hora) horoscope — Lagna & 9 grahas (nakṣatra, bhāva, dignity), pañcāṅga, Vimśottarī daśā, key vargas, Sarvāṣṭakavarga and the six-fold Ṣaḍbala. A SEPARATE system from the Western chart. Uses the current chart if no date/lat/lon is given.',
      parameters: { type: 'object', properties: { date: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' } }, required: [] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'vedicPractice',
      description: 'Return the traditional daily (vāra) + birth-keyed devotional practice the Jyotiṣa tradition lists for a chart — the weekday deity/mantra/observance and the birth-keyed mantra/yoga/yantra (derived from the weakest graha by Ṣaḍbala, the Lagna lord, the daśā lord and the Moon nakṣatra). HISTORICAL/CULTURAL PRACTICE, described not prescribed; the graha→āsana map is modern/syncretic. Uses the current chart if no date/lat/lon is given.',
      parameters: { type: 'object', properties: { date: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' } }, required: [] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'defineTerm',
      description: 'Look up a term of art in the site\u2019s glossary (Lilly, Picatrix, Vedic, divination, Jung \u2014 every term the site defines). Use it whenever the user asks what a term means, or before explaining jargon, so the definition matches the site exactly. Partial matches return the closest terms.',
      parameters: { type: 'object', properties: { term: { type: 'string', description: 'the term to define, e.g. "combust", "void of course", "synchronicity"' } }, required: ['term'] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'castGeomancy',
      description: 'Cast a geomantic Shield Chart for a question and judge it by house: four random Mothers (thrown by the USER’S BROWSER at their request — you never choose the figures) derive the Daughters, Nieces, Witnesses, Judge and Reconciler; returns the significators, the perfection modes and the tone. Optionally pass 16 explicit tallies to reproduce a cast. HISTORICAL divination of no demonstrated validity — narrate as such.',
      parameters: { type: 'object', properties: { quesitedHouse: { type: 'number', description: 'house 1–12 the question is about (default 7)' }, tallies: { type: 'array', items: { type: 'number' }, description: 'optional: 16 mark-counts to reproduce a specific cast' } }, required: [] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'drawTarot',
      description: 'Shuffle & draw a Tarot spread (the USER’S BROWSER supplies the randomness at their request — you never choose the cards): returns each position’s card (upright/reversed), the Golden Dawn elemental dignities and the balance. HISTORICAL divination of no demonstrated validity — narrate as such.',
      parameters: { type: 'object', properties: { spreadKey: { type: 'string', enum: ['single', 'three', 'horseshoe', 'celticCross'], description: 'the spread (default three)' }, reversals: { type: 'boolean', description: 'include reversed cards (default true)' } }, required: [] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'castIChing',
      description: 'Cast an I Ching hexagram by the three-coin method (the USER’S BROWSER throws the coins at their request — you never choose the lines): returns the primary hexagram with Judgment/Image, the moving lines, the nuclear and the relating hexagram. Optionally pass 6 explicit line-throws (each 6, 7, 8 or 9, bottom to top) to reproduce a cast. HISTORICAL divination of no demonstrated validity — narrate as such.',
      parameters: { type: 'object', properties: { throws: { type: 'array', items: { type: 'number' }, description: 'optional: 6 line values (6=old yin, 7=young yang, 8=young yin, 9=old yang), bottom to top' } }, required: [] },
    },
  });
  schema.push({
    type: 'function',
    function: {
      name: 'picatrixPrayer',
      description: 'Return the Picatrix Book III HISTORICAL prayer & spirits for a planet — the III.7 prayer excerpt + how it is addressed, the III.7 prayer-angel, and the III.9 directional spirits (Liber Antimaquis). Use to recite or explain the prayer the tradition would address to a calculation’s ruling planet. HISTORICAL TEXT for study, described — NEVER prescribed or an instruction.',
      parameters: { type: 'object', properties: { planet: { type: 'string', enum: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] } }, required: ['planet'] },
    },
  });
  return schema;
}

// The set of tool names the dispatcher accepts (callable exports + the extras).
export function toolNames() {
  return [...callableEntries().map(e => e.exportName), 'rankNow', 'findNextElection', 'castVedic', 'vedicPractice', 'picatrixPrayer',
    'castGeomancy', 'drawTarot', 'castIChing', 'defineTerm'];
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
    'The Figure & the planetary hour — the cast of the moment (the place, the day/night sect, the Ascendant & Midheaven, the ruling hour)',
    'Book I — the dignity ledger, the almutens, and the Lord of the Geniture (who is dignified, who is peregrine or fallen, who governs)',
    'Chart health — the considerations & the Moon weighed above all (the verdict, the gravest impediments, the Moon’s condition)',
    'The Lots & antiscia — the hidden geometry (Fortune, Spirit, the shadow-degrees)',
    'Aspects & reception — how the planets regard one another (the tightest applying/separating aspects, any mutual reception)',
    'The Picatrix election — what this hour is fit (and unfit) for (the chosen aim’s verdict, and the best-vs-least ranked aims now)',
    'The talisman — the historical recipe of the ruling planet (timing, materials, mansion, the named powers — recorded as history)',
  ];
  if (has('horary')) sections.push('Book II — the horary significators & the modes of perfection (querent, quesited, how/whether the matter perfects, and the timing)');
  if (has('natal')) sections.push('Book III — the life trajectory, the Lord of the Year, the personal Picatrix layer (the natal signatures, the profected year, the ruling works)');
  if (has('vedic')) sections.push('The Vedic mirror (Jagannath Hora) — the sidereal Lagna & grahas by bhāva and nakṣatra, the Pañcāṅga, the running Vimśottarī daśā, the Ṣaḍbala (who is strong/weak) and the Sarvāṣṭakavarga — read AS A SEPARATE SYSTEM and explicitly COMPARED with the Western chart above (where do the two traditions AGREE, where do they DISAGREE by design?)');
  if (reading && reading.vedic && reading.vedic.practice) sections.push('The day’s practice & the birth-keyed remedy (the vāra deity/mantra/observance for today, and the birth-keyed mantra/yoga/yantra the tradition lists for the weakest graha, the Lagna lord and the daśā lord) — recorded strictly as historical/cultural/devotional PRACTICE, never instruction; note that the graha→āsana map is a modern syncretism');
  return (
    'Compose "THE CODEX OF THIS HOUR" — a deep reading written in the grave, image-rich register of Hermes ' +
    'Trismegistus and the Picatrix, yet RIGOROUSLY TRUTHFUL: every claim drawn only from the computed, cited ' +
    'facts above (the Western chart, the Picatrix layer AND the Vedic chart — both the birth moment and the ' +
    'current place/time given). For EACH section below give: (a) WHAT it measures, plainly; (b) its MEANING for ' +
    'THIS exact figure, citing the actual numbers/positions; (c) how the tradition would BEST USE it (the ' +
    'favourable course of action it counsels, as historical practice). Then — this is the heart of the Codex — ' +
    'a "Concordance of the Hour": SYNTHESISE ACROSS the sections and BOTH systems. Name the PATTERNS that recur ' +
    '(a planet emphasised in dignity AND in Ṣaḍbala AND by aspect; a theme echoed by the Western Lord of the ' +
    'Geniture and the Vedic daśā lord; an agreement or a sharp disagreement between the tropical and sidereal ' +
    'readings). Say what the whole figure, read together, most strongly signifies — and where the testimonies ' +
    'conflict, say so honestly rather than forcing a verdict. Keep each lettered point tight; let the ' +
    'Concordance be the fullest part.\n\nSections:\n' +
    sections.map((s, i) => `${i + 1}. ${s}`).join('\n') +
    '\n\nClose with a single "Caveat of the Adept": one sentence restating that this is a faithful ' +
    'reconstruction of historical, pseudoscientific arts — described for study, never prescribed, ' +
    'and of no demonstrated efficacy; the devotional practices are recorded as culture, not counsel.'
  );
}

// ---------------------------------------------------------------------------
//  buildDataDigest — a compact, COMPLETE JSON object of the computed reading
//  (both systems + the Picatrix layer + the ruling-planet prayer), to be sent in
//  the prompt itself so the model interprets the literal figures (the "upload the
//  values with the prompt" path). Bounded — slims the big arrays.
// ---------------------------------------------------------------------------
export function buildDataDigest(reading) {
  const r = reading, m = r.moment;
  const dig = {
    moment: { date: r.meta.inputs.date, lat: r.meta.inputs.latitude, lon: r.meta.inputs.longitude, asc: m.angles.asc.label, mc: m.angles.mc.label, isDay: m.isDay, planetaryHour: m.planetaryHour ? m.planetaryHour.ruler : null, dayRuler: m.planetaryHour ? m.planetaryHour.dayRuler : null },
    planets: Object.fromEntries(Object.keys(m.planets).map(k => [k, { pos: m.planets[k].label, house: m.planets[k].house, retro: m.planets[k].retrograde, dignity: r.dignities.perPlanet[k] ? r.dignities.perPlanet[k].sumTotal : null }])),
    chartHealth: { verdict: r.cautions.verdict, label: r.cautions.label, cautions: r.cautions.global.slice(0, 6).map(a => a.text) },
    lots: { fortune: r.lots.fortune.label, spirit: r.lots.spirit.label },
    aspects: r.aspects.list.slice(0, 8).map(a => `${a.from} ${a.aspect} ${a.to} ${a.applying ? 'applying' : 'separating'} ${a.orb.toFixed(1)}°`),
    election: r.election.selected ? { aim: r.election.selected.operation.label, ruler: r.election.selected.operation.ruler, verdict: r.election.selected.verdict, score: r.election.selected.score, gating: r.election.selected.gating } : null,
    rankedNow: r.election.rankedNow.map(o => `${o.label}:${o.verdict}`),
    talisman: r.talisman ? { aim: r.talisman.aim, planet: r.talisman.planet, verdict: r.talisman.verdict, materials: r.talisman.materials } : null,
    picatrixPrayer: r.talisman && r.talisman.planet ? (() => { const p = prayerFor(r.talisman.planet); return p ? { planet: r.talisman.planet, prayerAngel: p.prayerAngel.latin, spirit: p.spirit.master, excerpt: p.prayerExcerpt } : null; })() : null,
    horary: r.horary ? { quesitedHouse: r.horary.quesitedHouse, querent: r.horary.querent.lordAsc, quesited: r.horary.quesited.lordQ, shared: r.horary.sharedSignificator } : null,
    natal: r.natal ? { lordOfGeniture: r.natal.trajectory.natal.lordOfGeniture.planet, lordOfYear: r.natal.trajectory.currentYear.lordOfYear, age: r.natal.trajectory.currentYear.age, temperament: r.natal.trajectory.natal.temperament.dominant } : null,
    vedic: r.vedic ? {
      lagna: r.vedic.lagna.label, lagnaLord: r.vedic.lagna.lord,
      grahas: Object.fromEntries(Object.entries(r.vedic.grahas).map(([k, g]) => [k, `${g.label} bhāva${g.house} ${g.dignity.state} (${g.nakshatra.name})`])),
      panchanga: { tithi: r.vedic.panchanga.tithi.name, vara: r.vedic.panchanga.vara.name, yoga: r.vedic.panchanga.yoga.name },
      dasha: { maha: r.vedic.vimshottari.currentMaha, antar: r.vedic.vimshottari.currentAntar },
      shadbala: { order: r.vedic.shadbala.order, strongest: r.vedic.shadbala.strongest, weakest: r.vedic.shadbala.weakest },
      sav: r.vedic.ashtakavarga.sav, yogas: r.vedic.yogas.filter(y => y.present).map(y => y.name),
      practice: r.vedic.practice, conclusions: r.vedic.conclusions,
    } : null,
  };
  return dig;
}

// A ready-to-append data block (a labelled JSON string) for the prompt body.
export function dataBlockFor(reading) {
  return '\n\nCOMPUTED DATA (JSON — already calculated by the engine; interpret THESE figures, never invent):\n' +
    JSON.stringify(buildDataDigest(reading));
}

// ---------------------------------------------------------------------------
//  buildSynthesisPrompt — the PLAIN, systemic interpretation: use ALL the
//  computed interpretations from every tool and BOTH systems, interpret them
//  TOGETHER, find the patterns, and explain + advise plainly (as history).
// ---------------------------------------------------------------------------
export function buildSynthesisPrompt(reading) {
  const has = k => reading && reading[k];
  let n = 0; const step = () => ++n;
  return (
    'INTERPRET THE WHOLE READING TOGETHER, plainly and usefully — for a curious reader, not as a list of numbers. ' +
    'Use the COMPUTED DATA (JSON) below and the cited facts in your context; interpret THOSE, never invent. Cover, ' +
    'in clear prose:\n' +
    `${step()}. The Western figure — the Ascendant & ruling hour, who is dignified or afflicted, the chart-health verdict and the gravest cautions, the Lots, the tightest aspects.\n` +
    `${step()}. The Picatrix layer — what this hour is fit and unfit for (the ranked aims), and the ruling planet's talisman & its historical prayer/spirit (as history only).\n` +
    (has('horary') ? `${step()}. The horary significators — querent, quesited, and whether/how the matter perfects.\n` : '') +
    (has('natal') ? `${step()}. The nativity — the Lord of the Geniture, the temperament, the profected year and Lord of the Year.\n` : '') +
    (has('vedic') ? `${step()}. The VEDIC chart (a SEPARATE sidereal system) — read its own computed conclusions: the Lagna & lord, the strongest/weakest graha by Ṣaḍbala, the running daśā, the supported/strained bhāvas (Aṣṭakavarga), the yogas, and the day/birth practice (as cultural practice).\n` : '') +
    'THEN — the heart of it — SYNTHESISE into ONE reading. Name the PATTERNS that recur across the tools and BOTH ' +
    'systems (a planet emphasised in dignity AND Ṣaḍbala AND aspect; the Western Lord of the Geniture vs the Vedic ' +
    'daśā lord; where the tropical and sidereal readings AGREE or DISAGREE by design). Say what the whole figure most ' +
    'strongly signifies, and what the traditions would ADVISE as the favourable course — framed as historical ' +
    'practice, never a real-world recommendation. Where testimonies conflict, say so honestly.\n\n' +
    'Close with one honest sentence: these are historical, pseudoscientific arts with no demonstrated predictive ' +
    'validity — described for study, never prescribed.'
  );
}

// ---------------------------------------------------------------------------
//  buildPlainReadingPrompt — the "PLAIN WORDS" CODEBOOK: every computed result
//  explained for a complete beginner, panel by panel, in a FIXED five-part
//  structure. The self-reflection part is framed the only honest way this site
//  allows: the symbol as a MIRROR the tradition held up — themes to reflect on,
//  never advice, never prediction, never a fact about the person.
// ---------------------------------------------------------------------------
export const PLAIN_STRUCTURE =
  'For EVERY numbered step below use EXACTLY this five-part structure (keep the bold labels):\n' +
  '- **In plain words:** what this panel measures and what it says here, in everyday language a newcomer understands ' +
  '(no jargon — or explain each term of art in a following parenthesis), citing the fact numbers [F#].\n' +
  '- **The good:** what the tradition counted FAVOURABLE in these figures [F#].\n' +
  '- **The hard:** what it counted DIFFICULT or afflicted [F#].\n' +
  '- **Concerns:** the cautions the tradition would flag before leaning on this panel (including where the computed ' +
  'testimony is weak, mixed, or method-dependent).\n' +
  '- **To reflect on:** ONE theme this symbolism would have a person sit with — phrased as a question or a mirror ' +
  '("the tradition would ask you to consider…"), NEVER as advice, an instruction, a prediction, or a statement about ' +
  'who the person really is.\n';

export function buildPlainReadingPrompt(reading) {
  const has = k => reading && reading[k];
  let n = 0; const step = () => ++n;
  return (
    'EXPLAIN THE WHOLE READING IN PLAIN WORDS — a codebooked walk through every computed panel, for someone who has ' +
    'never read a chart. Use ONLY the COMPUTED DATA (JSON) below and the numbered facts in your context; never invent ' +
    'a value. ' + PLAIN_STRUCTURE + '\nThe steps:\n' +
    `**${step()}. The honest frame first** — open with two plain sentences BEFORE anything else: astrology is a ` +
    'historical symbolic system with no demonstrated predictive validity; everything below is computed faithfully ' +
    'and read as the tradition read it — a structured mirror for reflection, described never prescribed.\n' +
    `**${step()}. The figure & the hour** — the Ascendant, day/night, the planetary hour.\n` +
    `**${step()}. The planets & their dignity** — who is strong, who is weak, and what "dignity" even means.\n` +
    `**${step()}. Chart health** — the green/amber/red verdict and the cautions behind it.\n` +
    `**${step()}. Aspects & reception** — how the planets stand toward one another.\n` +
    `**${step()}. The Lots** — Fortune and Spirit, and what a "Lot" is.\n` +
    `**${step()}. The election** — what the tradition judged this hour fit and unfit FOR (the ranked aims).\n` +
    `**${step()}. The talisman** — the recipe of the hour, strictly as recorded history.\n` +
    (has('horary') ? `**${step()}. The horary question** — querent, quesited, and whether the matter "perfects".\n` : '') +
    (has('natal') ? `**${step()}. The nativity & the year** — the Lord of the Geniture, the profected year, the Lord of the Year.\n` : '') +
    (has('vedic') ? `**${step()}. The Vedic mirror** — a SEPARATE sidereal system: the Lagna, the strongest and weakest graha, the running daśā — compared, never merged, with the Western chart.\n` : '') +
    `**${step()}. The whole picture** — three plain sentences on what the panels, taken together, most strongly ` +
    'emphasise; where they AGREE and where they CONTRADICT each other; then the single strongest "to reflect on" ' +
    'theme of the whole reading.\n\n' +
    'Close with the honest word, in plain language too: none of this predicts or measures anything real — it is a ' +
    'historical symbolic system, computed faithfully, whose worth today is as a structured mirror for reflection; ' +
    'described, never prescribed.'
  );
}

// A compact PLAIN-WORDS coda appended to the oracle interpret prompts, so every
// tool's AI reading ends with the same beginner-friendly, honestly-framed digest.
export const PLAIN_CODA =
  '\n\nEND with a section titled "**In plain words**" using exactly this structure (bold labels): ' +
  '**The good:** what the tradition counted favourable in this cast. ' +
  '**The hard:** what it counted against. ' +
  '**Concerns:** the cautions before leaning on any of it. ' +
  '**To reflect on:** ONE theme the symbolism would have a person sit with — a question or mirror, never advice, ' +
  'never a prediction, never a statement about who they really are.';

// ---------------------------------------------------------------------------
//  buildMomentFinderPrompt — the AUSPICIOUS-MOMENT automation (🎯). The ENGINE
//  does the finding (the app passes findNextElection's ranked windows in —
//  computed, deterministic, never the model's guess); the model's job is the
//  codebooked WALK: for the chosen aim, explain the present verdict, each
//  found window (what changes astrologically to open it), and the book-meaning
//  → literal real-life translation of every testimony — honest frame FIRST,
//  five-part plain-words structure per step, described never prescribed.
// ---------------------------------------------------------------------------
export function buildMomentFinderPrompt(reading, windows = []) {
  const e = (reading && reading.election) || {};
  const op = e.operation || {};
  const inp = (reading && reading.meta && reading.meta.inputs) || {};
  const fmtT = d => new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UT';
  const wlines = windows.slice(0, 3).map((w, i) => {
    const rs = (w.peak && w.peak.reasons) || [];
    const pro = rs.filter(r => r.delta > 0).slice(0, 4).map(r => r.text).join('; ');
    const con = rs.filter(r => r.severity === 'caution' || r.delta < 0).slice(0, 2).map(r => r.text).join('; ');
    return `WINDOW ${i + 1}: ${fmtT(w.start)} → ${fmtT(w.end)}, best verdict ${w.bestVerdict} (score ${w.best}).` +
      (pro ? ` For it: ${pro}.` : '') + (con ? ` Against it: ${con}.` : '');
  }).join('\n');
  return (
    'THE AUSPICIOUS-MOMENT BRIEF. The engine has already scanned the coming days mechanically (30-minute steps, ' +
    'amber-or-better) and ranked the windows the TRADITION would call favourable for the aim below — the times are ' +
    'COMPUTED, not yours to invent. Your job is the translation: book meaning → plain, literal real-life terms. ' +
    PLAIN_STRUCTURE + '\nWalk these steps IN ORDER:\n' +
    '**0. The honest frame first** — open with two plain sentences BEFORE anything else: electional astrology is a ' +
    'historical selection ritual with no demonstrated effect on outcomes; choosing these times changes nothing real, ' +
    'and nothing here is advice or an instruction to schedule anything by the sky.\n' +
    `**1. The aim** — the operation "${op.name || inp.operationKey || 'the chosen aim'}"${op.ruler ? `, ruled by ${op.ruler}` : ''}: ` +
    'what the tradition demanded the sky show for such work, and why — the book meaning, then the plain translation ' +
    'of each demand.\n' +
    `**2. The present moment** — verdict ${e.verdict || 'unknown'} (score ${e.score ?? '?'})${e.label ? `: ${e.label}` : ''}. ` +
    'Take the strongest two or three testimonies FOR and AGAINST right now from the numbered facts; for each, give ' +
    'the book meaning and the literal real-life reading of what the rule is actually looking at (a clock time, a ' +
    'moon phase, a planet\'s sign — physical facts carrying assigned meanings).\n' +
    '**3. The windows the engine found**:\n' + (wlines || 'NO qualifying window was found in the scanned span — say so honestly and explain, from the facts, which testimony blocks every moment.') + '\n' +
    'For EACH window: say in plain words WHAT CHANGES astrologically to open it (the planetary hour turning, the ' +
    'Moon\'s state or mansion, the ascendant moving on), then apply the five-part structure to the window.\n' +
    '**4. What the tradition would then do** — the working as the Picatrix-era sources describe it for this aim ' +
    '(timing, materials, prayer), strictly as recorded historical practice, with its citation.\n' +
    '**5. The real-life implications, gathered** — one plain paragraph: what a person today can LITERALLY take from ' +
    'all of the above (a window is just a time the old rules score well; the value is historical understanding and ' +
    'a structured occasion for reflection or ceremony) — and what they should NOT take from it (no improved odds, ' +
    'no protection, no timing edge for real decisions).\n\n' +
    'Close with the honest word: an election is the tradition\'s answer to "when would the sky approve?", computed ' +
    'faithfully here — and the sky\'s approval, then as now, has no demonstrated effect on anything; described, ' +
    'never prescribed.' + PLAIN_CODA
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
  // A few live values embedded up front, so the model is grounded BEFORE it even
  // calls a tool (the "upload the values with the prompt" path) — it should still
  // call the tools to ground anything it computes fresh.
  const ph = reading && reading.moment && reading.moment.planetaryHour;
  const sel = reading && reading.election && reading.election.selected;
  const grounding = [
    ph ? `the present planetary hour is ${ph.ruler} (a ${ph.dayRuler}-day)` : null,
    sel && sel.moon ? `the Moon is ${sel.moon.phase}, in ${sel.moon.sign}, mansion ${sel.moon.mansion.num}` : null,
    reading && reading.vedic ? `the Vedic vāra is ${reading.vedic.panchanga.vara.name} and the running mahādaśā is ${reading.vedic.vimshottari.currentMaha}` : null,
  ].filter(Boolean).join('; ');
  return (
    `A practitioner asks: "${String(request).trim()}"\n\n` +
    'Answer ONLY from the Lilly + Picatrix (and, where relevant, the Jyotiṣa) traditions this Workbench ' +
    'computes. You do NOT need to browse the website: the engine is available to you AS TOOLS — call them ' +
    'to ground every number (do not invent positions or times). ' +
    (grounding ? `For context, already computed for this moment: ${grounding}. ` : '') +
    'Proceed in five numbered steps:\n' +
    `1. INTERPRET the aim and map it to the CLOSEST catalogued operation — one of: ${aims}. If none ` +
    'truly fits (e.g. weather-working has no exact catalogued aim), say so plainly and choose the ' +
    'nearest by significator (e.g. rain → the Moon & Jupiter; name the editorial leap).\n' +
    `2. FIND THE NEXT FAVOURABLE WINDOW for that operation from now (${when}) at this place (${place}) ` +
    'by calling the `findNextElection` (and/or `rankNow`, `nextAuspiciousTime`, `electionScore`) tools. ' +
    'Report the concrete window the tool returns.\n' +
    '3. WHAT TO CHECK in the master report (the Workbench): name the exact panels & values to verify ' +
    '— the planetary hour, the ruling planet’s dignity, the Moon’s phase/mansion/void-of-course, the ' +
    'election verdict, any fixed-star contact; and, if the aim has a devotional dimension, the Vedic ' +
    'day/birth practice (call `vedicPractice` / `castVedic`).\n' +
    '4. THE HISTORICAL PROCEDURE the tradition would follow: the timing (day & hour), the materials ' +
    'and mansion (call `talismanRecipe` if useful), the design — recorded as historical practice.\n' +
    '5. Point the practitioner to the live tool to watch it themselves: ' +
    `${SITE_URLS.workbench} (source: ${SITE_URLS.repo}).\n\n` +
    'End with one honest sentence: these are historical, pseudoscientific arts with no demonstrated ' +
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
  const slimVedic = v => ({
    system: 'vedic (sidereal / Jagannath Hora)', ayanamsa: v.ayanamsa,
    lagna: `${v.lagna.label} (lord ${v.lagna.lord})`,
    grahas: Object.fromEntries(Object.entries(v.grahas).map(([k, g]) => [k, { position: g.label, bhava: g.house, nakshatra: `${g.nakshatra.name} p${g.nakshatra.pada}`, dignity: g.dignity.state }])),
    panchanga: { tithi: v.panchanga.tithi.name, vara: v.panchanga.vara.name, nakshatra: v.panchanga.nakshatra.name, yoga: v.panchanga.yoga.name, karana: v.panchanga.karana.name },
    dasha: { maha: v.vimshottari.currentMaha, antar: v.vimshottari.currentAntar, balanceYears: v.vimshottari.balanceYears },
    yogas: v.yogas.filter(y => y.present).map(y => y.name),
    sarvashtakavarga: { total: v.ashtakavarga.savTotal, bySign: v.ashtakavarga.sav },
    shadbala: { strongest: v.shadbala.strongest, weakest: v.shadbala.weakest, order: v.shadbala.order, rupas: Object.fromEntries(Object.entries(v.shadbala.perGraha).map(([k, s]) => [k, s.totalRupa])) },
    note: 'A SEPARATE sidereal system from the Western chart; do not conflate the two zodiacs.',
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
    case 'castVedic': { const v = castVedic(args.date != null ? castChart(new Date(args.date), need('lat'), need('lon'), 'whole') : (ctx.birthChart || ctx.chart || chartFromArgs()), { currentDate: new Date() }); return slimVedic(v); }
    case 'vedicPractice': { const v = castVedic(args.date != null ? castChart(new Date(args.date), need('lat'), need('lon'), 'whole') : (ctx.birthChart || ctx.chart || chartFromArgs()), { currentDate: new Date() }); return v.practice; }
    case 'picatrixPrayer': { const pr = prayerFor(need('planet')); if (!pr) throw new Error(`no Picatrix prayer for ${args.planet}`); return { planet: args.planet, prayerExcerpt: pr.prayerExcerpt, address: pr.address, names: pr.names, prayerAngel: pr.prayerAngel, spirit: pr.spirit.master, directions: pr.spirit.directions, motion: pr.spirit.motion, citation: pr.citation, flag: pr.flag || null, note: 'Historical text (Picatrix Bk III) recorded for study — described, never prescribed; never an instruction.' }; }
    // --- the divination oracles. The randomness comes from the CALLER (the
    // app injects ctx.rand, a crypto n→[0,n) function) or from explicit args —
    // never from this pure module, and never from the model itself.
    case 'defineTerm': {
      const q = String(need('term')).toLowerCase().trim();
      const hits = GLOSSARY.filter(g => g.term.toLowerCase().includes(q) || q.includes(g.term.toLowerCase()))
        .slice(0, 5).map(g => ({ term: g.term, category: g.cat, definition: g.def }));
      if (!hits.length) return { term: q, found: false, note: 'No glossary entry matches; explain from the tradition and say the site has no entry.' };
      return { term: q, found: true, entries: hits };
    }
    case 'castGeomancy': {
      const tallies = Array.isArray(args.tallies) && args.tallies.length >= 16 ? args.tallies.slice(0, 16)
        : (typeof ctx.rand === 'function' ? Array.from({ length: 16 }, () => ctx.rand(16) + 1) : null);
      if (!tallies) throw new Error('castGeomancy: supply 16 tallies, or run where the app provides the random cast');
      const sh = castFromTallies(tallies);
      const j = geomanticJudgement(sh, args.quesitedHouse || 7);
      const F = f => `${f.english} (${f.latin}, ${f.nature})`;
      return {
        mothers: sh.mothers.map(m => m.english), querent: F(j.querentFigure), quesited: F(j.quesitedFigure),
        witnesses: { right: F(sh.witnesses.right), left: F(sh.witnesses.left) }, judge: F(sh.judge),
        reconciler: F(sh.reconciler), perfection: j.perfection.map(p => p.name), tone: j.tone, reading: j.toneText,
        note: 'Cast by the user’s browser RNG. Historical divination of no demonstrated validity — described, never prescribed.',
      };
    }
    case 'drawTarot': {
      if (typeof ctx.rand !== 'function') throw new Error('drawTarot: only available where the app provides the random shuffle');
      const spreadKey = args.spreadKey && SPREADS[args.spreadKey] ? args.spreadKey : 'three';
      const ids = DECK_IDS.slice();
      for (let i = ids.length - 1; i > 0; i--) { const k = ctx.rand(i + 1); [ids[i], ids[k]] = [ids[k], ids[i]]; }
      const reversals = args.reversals !== false;
      const draws = ids.slice(0, SPREADS[spreadKey].count).map(id => ({ id, reversed: reversals && ctx.rand(2) === 1 }));
      const r = tarotReading(spreadKey, draws);
      return {
        spread: r.spread.name,
        cards: r.cards.map(c => ({ position: c.position, card: c.card.name, reversed: c.reversed, keywords: c.text.slice(0, 4) })),
        dignities: r.dignities.map(d => ({ between: d.between, relation: d.relation })),
        balance: r.summaryLines,
        note: 'Shuffled by the user’s browser RNG. Historical divination of no demonstrated validity — described, never prescribed.',
      };
    }
    case 'castIChing': {
      const throws = Array.isArray(args.throws) && args.throws.length === 6 ? args.throws
        : (typeof ctx.rand === 'function' ? Array.from({ length: 6 }, () => (ctx.rand(2) + 2) + (ctx.rand(2) + 2) + (ctx.rand(2) + 2)) : null);
      if (!throws) throw new Error('castIChing: supply 6 line-throws (6–9), or run where the app provides the coin toss');
      const { lines, changing } = linesFromThrows(throws);
      const r = castIchingReading(lines, changing);
      return {
        primary: { num: r.primary.num, name: r.primary.name, judgment: r.primary.judgment, image: r.primary.image },
        trigrams: `${r.trigrams.upper.name} over ${r.trigrams.lower.name}`,
        moving: r.moving.map(m => ({ line: m.line, text: m.text })),
        nuclear: `${r.nuclear.num}. ${r.nuclear.name}`,
        relating: r.relating ? { num: r.relating.num, name: r.relating.name, judgment: r.relating.judgment } : null,
        guidance: r.guidance,
        note: 'Coins thrown by the user’s browser RNG. Historical divination of no demonstrated validity — described, never prescribed.',
      };
    }
    default: throw new Error(`unknown tool: ${name}`);
  }
}

// ===========================================================================
//  DIVINATION (Geomancy & Tarot) — the same honest, grounded bridge for the two
//  cartomantic/geomantic tools. PURE: takes a computed reading object the tool
//  produced (not a fullReading) and returns {system, facts} + prompt builders.
//  The model speaks as a learned historian-diviner, yet is bound by the SAME
//  locked honest framing — described never prescribed, a pseudoscience.
// ===========================================================================

// The expert-diviner ("shaman") persona, layered ON TOP of the honest preamble.
export const DIVINER_PREAMBLE =
  '\n\nVOICE: speak as a learned historian-diviner of the Western esoteric tradition — at home with ' +
  'Cornelius Agrippa, the sand-geomancers of the medieval Arabic and Latin worlds, the Picatrix, A. E. Waite ' +
  'and the Hermetic Order of the Golden Dawn. You know the figures and the cards, AND the rituals by which they ' +
  'were cast and read (how a geomancer struck rows of marks in earth or sand; how a reader shuffles, cuts and ' +
  'lays a spread, weighing reversals and elemental dignities). Explain this lore vividly and ACCURATELY, the way ' +
  'a scholar demonstrates a working astrolabe — its craft and its history alive in the telling.\n' +
  'BUT THE FRAMING ABOVE IS ABSOLUTE: these are arts of NO demonstrated validity. You DESCRIBE how the tradition ' +
  'reasons and what it counselled, as HISTORY and symbolism; you NEVER predict the real future, never give ' +
  'real-world advice (medical, legal, financial, relationship, safety) as fact, and never present the casting as ' +
  'truth. If asked to foretell or to act on a reading, decline gently and restate the framing. Ground every claim ' +
  'in the COMPUTED FIGURES below — the cast is fixed; interpret what was actually drawn, never invent cards or ' +
  'figures. Be concise, evocative and honest at once.';

function divinationGlossary(cats) {
  return GLOSSARY.filter(g => cats.includes(g.cat)).map(g => ({ term: g.term, def: g.def }));
}
function assembleSystem(facts, glossary, label, preamble = DIVINER_PREAMBLE) {
  return HONEST_SYSTEM_PREAMBLE + preamble +
    '\n\nGLOSSARY (terms of art):\n' + glossary.map(g => `- ${g.term}: ${g.def}`).join('\n') +
    `\n\nCOMPUTED ${label} (already cast & calculated by the engine; cite these, never invent). Each fact is numbered:\n` +
    facts.map((f, i) => `- [F${i + 1}] ${f.text}${f.cite ? `  [${f.cite}]` : ''}`).join('\n') +
    CITE_CONTRACT;
}

// ---- Geomancy --------------------------------------------------------------
//  g = { kind:'geomancy', question, quesitedHouse, shield, judgement, houses }
export function buildGeomancyContext(g, opts = {}) {
  const j = g.judgement, sh = g.shield;
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  const F = f => `${f.english} (${f.latin}, ${f.nature})`;
  if (g.question) add(`The question: "${g.question}" — read under the ${j.quesitedHouse}th house (${j.topic}).`, 'the querent');
  add(`The four Mothers cast at random: ${sh.mothers.map(m => m.english).join(', ')}.`, 'Agrippa II.48 — the cast');
  add(`Querent (1st house): ${F(j.querentFigure)} — ${j.querentFigure.meaning}`, 'JMG Greer — the significators');
  add(`Quesited (${j.quesitedHouse}th house, ${j.topic}): ${F(j.quesitedFigure)} — ${j.quesitedFigure.meaning}`, 'the topic house');
  add(`Perfection: ${j.perfects ? j.perfection.map(p => p.name).join(', ') : 'none — the significators do not meet'}.`, 'Agrippa II.51 — perfection');
  add(`Right Witness ${F(sh.witnesses.right)} (the querent / the past); Left Witness ${F(sh.witnesses.left)} (the quesited / what follows).`, 'the Witnesses');
  add(`JUDGE: ${F(sh.judge)}, ${sh.judge.points} points (even — the chart checks out) — ${sh.judge.meaning}`, 'the Judge gives the outcome');
  add(`Reconciler (clarifier): ${F(sh.reconciler)}.`, 'the Reconciler');
  add(`The tradition's reading: ${j.toneText}`, j.cite);
  for (const h of (g.houses || [])) add(`House ${h.house} (${(h.signifies || '').split(';')[0]}): ${h.figure.english} (${h.figure.nature}).`, 'the House Chart');
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Geomancy']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'GEOMANTIC FIGURES'), facts: trimmed, glossary };
}

export function buildGeomancyInterpretPrompt(g) {
  return (
    'Interpret this geomantic cast as a master of the art would, FROM THE COMPUTED FIGURES ONLY. In clear prose: ' +
    '(1) name what the question is and the topic house; (2) read the figure of the 1st house (the querent) and of ' +
    'the topic house (the matter); (3) say whether and HOW the matter perfects (occupation, conjunction, mutation, ' +
    'translation) — i.e. whether the parties truly meet; (4) read the two Witnesses as the road (right = the ' +
    'querent and the past, left = the quesited and what follows) and the JUDGE as the outcome, noting its nature; ' +
    '(5) bring in the Reconciler if the Judge is doubtful. THEN give one synthesis: what the whole shield, read ' +
    'together, most strongly signifies — and what the tradition would COUNSEL as the favourable course, framed as ' +
    'historical practice, never a real-world recommendation. Close with one honest sentence: geomancy is a ' +
    'historical, pseudoscientific art of no demonstrated validity — described for study, never prescribed.' + PLAIN_CODA
  );
}
export function geomancyDataBlock(g) {
  const j = g.judgement, sh = g.shield;
  const slim = f => ({ figure: f.english, latin: f.latin, nature: f.nature, points: f.points });
  const dig = {
    question: g.question || '', topicHouse: j.quesitedHouse, topic: j.topic,
    mothers: sh.mothers.map(m => m.english), daughters: sh.daughters.map(m => m.english), nieces: sh.nieces.map(m => m.english),
    querent: slim(j.querentFigure), quesited: slim(j.quesitedFigure),
    witnesses: { right: slim(sh.witnesses.right), left: slim(sh.witnesses.left) },
    judge: slim(sh.judge), reconciler: slim(sh.reconciler),
    perfection: j.perfection.map(p => p.name), tone: j.tone,
    houses: (g.houses || []).map(h => ({ house: h.house, figure: h.figure.english, nature: h.figure.nature })),
  };
  return '\n\nCOMPUTED GEOMANTIC SHIELD (JSON — interpret THESE figures, never invent):\n' + JSON.stringify(dig);
}

// ---- Tarot -----------------------------------------------------------------
//  t = { kind:'tarot', question, spreadKey, reading }  (reading = tarotReading)
export function buildTarotContext(t, opts = {}) {
  const r = t.reading;
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (s, c) => s && facts.push({ text: s, cite: c || '' });
  add(`Spread: ${r.spread.name}${t.question ? ` for the question "${t.question}"` : ''}. ${r.spread.description}`, 'Waite, Pictorial Key');
  for (const c of r.cards) add(`${c.position}: ${c.card.name}${c.reversed ? ' (reversed)' : ''} — ${(c.text || []).join(', ')}. ${c.meaning}`, 'Waite — the card');
  for (const d of r.dignities) add(`Elemental dignity — ${d.between[0]} & ${d.between[1]} (${d.positions.join(' / ')}): ${d.relation}; ${d.note}`, 'Golden Dawn — elemental dignities');
  if (r.balance) add(`Balance: ${r.balance.majors} Major Arcana of ${r.cards.length}${r.balance.dominantSuit ? `, leading suit ${r.balance.dominantSuit}` : ''}${r.balance.dominantElement ? `, leading element ${r.balance.dominantElement}` : ''}, ${r.balance.reversed} reversed.`, 'the spread balance');
  for (const s of (r.summaryLines || [])) add(s, 'the reading');
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Tarot']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'TAROT SPREAD'), facts: trimmed, glossary };
}

export function buildTarotInterpretPrompt(t) {
  return (
    'Read this tarot spread as a reader in the Golden Dawn tradition would, FROM THE DRAWN CARDS ONLY. In clear ' +
    'prose: (1) go position by position — name the card, honour its orientation (a reversal softens, blocks, ' +
    'internalises or delays it), and bind its meaning to what the position asks; (2) weigh the ELEMENTAL ' +
    'DIGNITIES — which neighbouring cards strengthen one another and which are contrary; (3) note the balance ' +
    '(the weight of the Major Arcana = fated forces, the leading suit/element, the reversals). THEN weave it into ' +
    'ONE narrative: the story the spread tells, and what the tradition would COUNSEL — as historical symbolism, ' +
    'never a forecast or real-world advice. Close with one honest sentence: tarot cartomancy has no demonstrated ' +
    'predictive validity — a historical symbolic system described for study, never prescribed.' + PLAIN_CODA
  );
}
export function tarotDataBlock(t) {
  const r = t.reading;
  const dig = {
    question: t.question || '', spread: r.spread.name,
    cards: r.cards.map(c => ({ position: c.position, card: c.card.name, reversed: c.reversed, element: c.card.element, keywords: c.text })),
    dignities: r.dignities.map(d => ({ between: d.between, relation: d.relation })),
    balance: r.balance,
  };
  return '\n\nCOMPUTED TAROT SPREAD (JSON — interpret THESE cards, never invent):\n' + JSON.stringify(dig);
}

// ---- I Ching ---------------------------------------------------------------
//  x = { kind:'iching', question, reading }  (reading = castReading output)
export function buildIchingContext(x, opts = {}) {
  const r = x.reading;
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (s, c) => s && facts.push({ text: s, cite: c || '' });
  const p = r.primary, t = r.trigrams;
  if (x.question) add(`The question: "${x.question}".`, 'the querent');
  add(`Primary hexagram: ${p.num}. ${p.name} (${p.pinyin}) — ${t.upper.name} over ${t.lower.name}.`, 'King Wen sequence');
  add(`Judgment: ${p.judgment}`, 'Legge / the tradition');
  add(`Image: ${p.image}`, 'Legge / the tradition');
  for (const m of r.moving) add(`Moving ${m.position} line (${m.yang ? 'old yang' : 'old yin'}): ${m.text}`, 'the moving line');
  add(`Nuclear (inner) hexagram: ${r.nuclear.num}. ${r.nuclear.name}.`, 'the nuclear figure');
  if (r.relating) add(`Relating hexagram (the tendency of change): ${r.relating.num}. ${r.relating.name} — ${r.relating.judgment}`, 'the relating figure');
  add(r.guidance, 'the reading');
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['I Ching']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'I CHING CAST'), facts: trimmed, glossary };
}

export function buildIchingInterpretPrompt(x) {
  return (
    'Read this I Ching cast as a scholar of the Yijing would, FROM THE COMPUTED HEXAGRAM ONLY. In clear prose: ' +
    '(1) the PRIMARY hexagram — its two trigrams, its Judgment and Image, and what situation the tradition reads in it; ' +
    '(2) the MOVING LINE(S), if any — the pivots of the reading, in order; (3) the NUCLEAR hexagram as the hidden core ' +
    'of the matter; (4) the RELATING hexagram, if any, as the direction the situation tends. THEN synthesise: what the ' +
    'whole cast, read together, most strongly reflects, and what the tradition would COUNSEL — as historical wisdom and ' +
    'a mirror for reflection, never a forecast or real-world advice. Close with one honest sentence: the I Ching is a ' +
    'historical divinatory art of no demonstrated predictive validity — described for study, never prescribed.' + PLAIN_CODA
  );
}
export function ichingDataBlock(x) {
  const r = x.reading;
  const dig = {
    question: x.question || '',
    primary: { num: r.primary.num, name: r.primary.name, upper: r.trigrams.upper.name, lower: r.trigrams.lower.name },
    moving: r.moving.map(m => ({ line: m.line, yang: m.yang, text: m.text })),
    nuclear: { num: r.nuclear.num, name: r.nuclear.name },
    relating: r.relating ? { num: r.relating.num, name: r.relating.name } : null,
  };
  return '\n\nCOMPUTED I CHING CAST (JSON — interpret THIS hexagram, never invent):\n' + JSON.stringify(dig);
}

// ---- Cycles of History ------------------------------------------------------
//  x = { kind:'cycles', scan: { fromY, toY, conjunctions[], runs[] } | null,
//        eclipse: eclipseNear() result | null }  (app/cycles.js currentCyclesReport)
export const HISTORIAN_PREAMBLE =
  '\n\nVOICE: speak as a historian of MUNDANE astrology and ancient astronomy — at home with Abū Maʿshar\'s ' +
  'doctrine of the great conjunctions, Kepler\'s trigon diagram, the Babylonian eclipse omina and the modern ' +
  'ephemerides alike. Two registers, NEVER blurred: (a) the COMPUTED ASTRONOMY below is real, verifiable ' +
  'celestial mechanics — describe it with precision and pleasure; (b) the MEANINGS the tradition attached to it ' +
  '(religions from trigon shifts, plagues from conjunctions, kings\' deaths from eclipses) are DOCUMENTED BELIEFS ' +
  'of no demonstrated validity — narrate them as history, cite them, and never present them as fact or forecast. ' +
  'Eclipse claims are GLOBAL ONLY ("an eclipse occurred or was possible somewhere on Earth") — never local ' +
  'visibility. If asked to predict world events from a conjunction, decline gently and restate the framing. ' +
  'Ground every claim in the numbered facts; never invent dates or positions.';

export function buildCyclesContext(x, opts = {}) {
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  const day = d => new Date(d).toISOString().slice(0, 10);
  if (x.scan && x.scan.conjunctions && x.scan.conjunctions.length) {
    const cs = x.scan.conjunctions, runs = x.scan.runs || [];
    add(`Scan ${x.scan.fromY}…${x.scan.toY}: ${cs.length} geocentric Jupiter–Saturn conjunctions in ecliptic longitude (tropical of-date), in ${runs.length} trigon run${runs.length === 1 ? '' : 's'}.`, 'computed by the engine; cross-verified vs Nolle/NASA');
    for (const r of runs) add(`Trigon run: ${r.triplicity} × ${r.count} conjunction${r.count === 1 ? '' : 's'}, ${new Date(r.start).getUTCFullYear()}–${new Date(r.end).getUTCFullYear()}${r.reversion ? ' — a one-off reversion, not a lasting shift' : ''}.`, 'computed trigon runs');
    const show = cs.length > 14 ? cs.slice(-14) : cs;
    if (cs.length > show.length) add(`(The ${cs.length - show.length} earlier conjunctions are omitted here for space; the count above covers them.)`, 'budget note');
    for (const c of show) add(`${day(c.date)}: conjunction at ${formatLon(c.lon)} (${c.triplicity} trigon)${c.jupiterRetrograde && c.saturnRetrograde ? ', both planets retrograde (a triple-pass member)' : ''}; minimum separation ${c.sep}′ — they pass near, never through.`, 'the engine\'s longitude crossing');
  }
  add('The doctrine (documented belief): Abū Maʿshar tiered the cycle — the ~20-year conjunction, the shift of triplicity (~240 doctrinal years) read for religious & dynastic change, and the full return (960 years medieval; Kepler computed 794 = 40 conjunctions). The doctrine ran on MEAN conjunctions — one per 19.859 years, never triple; the sky gives geocentric singles or triples via retrogradation.', 'Abū Maʿshar, On Historical Astrology (Yamamoto & Burnett, Brill 2000); Kepler, De Stella Nova (1606)');
  if (x.eclipse) {
    const s = x.eclipse.solar, l = x.eclipse.lunar;
    if (s) add(`Nearest NEW moon ${day(s.syzygy)}: node distance ${s.nodeDistanceDeg}° → classical ecliptic-limit verdict "${s.verdict}" (solar: certain <15.39°, impossible >18.59°); ground-truth global search: ${s.groundTruth.sameSyzygy ? `a ${s.groundTruth.kind} solar eclipse at this syzygy (peak ${day(s.groundTruth.peak)})` : 'no eclipse at this syzygy'}.`, 'NASA/Espenak ecliptic limits; the engine\'s global eclipse search');
    if (l) add(`Nearest FULL moon ${day(l.syzygy)}: node distance ${l.nodeDistanceDeg}° → any-type verdict "${l.verdictAny}" (lunar: certain <15.3°, impossible >17.1°), classical umbral verdict "${l.verdictUmbral}" (9°30′/12°15′); ground truth: ${l.groundTruth.sameSyzygy ? `a ${l.groundTruth.kind} lunar eclipse at this syzygy (peak ${day(l.groundTruth.peak)})` : 'no eclipse at this syzygy'}.`, 'NASA/Espenak; Meeus AA ch. 54');
    add('Eclipse claims here are GLOBAL only — visible from SOME location on Earth. Local visibility needs Besselian elements, out of scope.', 'NASA SE/LE periodicity pages');
  }
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Cycles']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'CYCLES OF HISTORY', HISTORIAN_PREAMBLE), facts: trimmed, glossary };
}

export function buildCyclesInterpretPrompt() {
  return (
    'Explain this computed sweep of the cycles of history, FROM THE NUMBERED FACTS ONLY, in clear prose: ' +
    '(1) THE ASTRONOMY — what was scanned and found: how the ~20-year Jupiter–Saturn rhythm shows in the dates, ' +
    'where the trigon (triplicity) runs and shifts fall, and any triple passes (explain retrogradation as the ' +
    'cause, and that the planets only ever pass near each other); (2) THE DOCTRINE — what Abū Maʿshar\'s scheme ' +
    'and Kepler\'s trigon made of exactly these rhythms, as documented historical belief: what a trigon shift was ' +
    'held to signify, and how the mean-conjunction clock differs from the observed sky; (3) THE ECLIPSE CHECK, if ' +
    'present — read the node-distance verdict against the ground-truth search, say plainly whether an eclipse ' +
    'occurred or was possible SOMEWHERE ON EARTH near that date, and connect the method to the Babylonian ' +
    '"eclipse possibility" logic; (4) ONE synthesis — what this stretch of sky actually did, versus what the ' +
    'tradition believed it meant. Close with one honest sentence: mundane astrology\'s meanings are documented ' +
    'beliefs of no demonstrated validity — the astronomy is real, the significations are not.' + PLAIN_CODA
  );
}
export function cyclesDataBlock(x) {
  const day = d => new Date(d).toISOString().slice(0, 10);
  const dig = {
    scan: x.scan ? {
      range: [x.scan.fromY, x.scan.toY],
      conjunctions: (x.scan.conjunctions || []).map(c => ({ date: day(c.date), pos: formatLon(c.lon), tri: c.triplicity, retro: !!(c.jupiterRetrograde && c.saturnRetrograde), sepMin: c.sep })),
      runs: (x.scan.runs || []).map(r => ({ tri: r.triplicity, count: r.count, from: new Date(r.start).getUTCFullYear(), to: new Date(r.end).getUTCFullYear(), reversion: !!r.reversion })),
    } : null,
    eclipse: x.eclipse ? {
      solar: { syzygy: day(x.eclipse.solar.syzygy), D: x.eclipse.solar.nodeDistanceDeg, verdict: x.eclipse.solar.verdict, groundTruth: x.eclipse.solar.groundTruth.sameSyzygy ? x.eclipse.solar.groundTruth.kind : 'none' },
      lunar: { syzygy: day(x.eclipse.lunar.syzygy), D: x.eclipse.lunar.nodeDistanceDeg, any: x.eclipse.lunar.verdictAny, umbral: x.eclipse.lunar.verdictUmbral, groundTruth: x.eclipse.lunar.groundTruth.sameSyzygy ? x.eclipse.lunar.groundTruth.kind : 'none' },
    } : null,
  };
  return '\n\nCOMPUTED CYCLES DATA (JSON — interpret THESE, never invent):\n' + JSON.stringify(dig);
}

// ---- Time-lords -------------------------------------------------------------
//  x = currentTimelordsReport(): { kind:'timelords', meta, progressions,
//      firdaria:{majors,current,...}, releasing:{lots, fromSpirit, fromFortune} }
export function buildTimelordsContext(x, opts = {}) {
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  const m = x.meta || {};
  add(`The nativity: ${String(m.birthUTC || '').replace('T', ' ').slice(0, 16)} UT at ${m.lat}, ${m.lon} — a ${m.isDay ? 'DAY' : 'NIGHT'} birth; Asc ${m.asc}, MC ${m.mc}. Age ${Number(m.ageTropicalYears).toFixed(2)} tropical years as of ${String(m.asOf || '').slice(0, 10)}.`, 'computed nativity');
  const p = x.progressions;
  if (p) {
    add(`Secondary progressions (one ephemeris day after birth ≡ one year of life): the progressed instant is ${p.progressedDate.toISOString ? p.progressedDate.toISOString().replace('T', ' ').slice(0, 16) : String(p.progressedDate).slice(0, 16)} UT.`, 'Valens, Anthology IX.3 (Riley)');
    const nat = p.natal && p.natal.planets ? p.natal.planets : null;
    for (const name of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
      const q = p.planets && p.planets[name];
      if (q) add(`Progressed ${name}: ${formatLon(q.lon)}${q.retrograde ? ' (retrograde)' : ''}${nat && nat[name] ? ` — natal ${formatLon(nat[name].lon)}` : ''}.`, 'the ephemeris at birth + age-in-days');
    }
    add(`Progressed angles by the Naibod arc only (${Number(p.naibodArcDeg).toFixed(2)}° = 0.98564733°/yr × age): MC ${formatLon(p.progressedMC)}, Asc ${formatLon(p.progressedAsc)} (re-derived at the birth latitude).`, 'Naibod, 16th c.; the mean solar rate 59′08″/yr');
  }
  const f = x.firdaria;
  if (f) {
    add(`Firdaria (${f.isDay ? 'day' : 'night'} sequence${!f.isDay ? `, ${f.nightNodes === 'afterMars' ? 'Bonatti nodes-after-Mars variant' : 'Abū Maʿshar nodes-at-end order'}` : ''}): ${(f.majors || []).map(mj => `${mj.lord} ${mj.startAge}–${mj.endAge}`).join(', ')} (a 75-year cycle).`, 'Abū Maʿshar, On the Revolutions of the Years of Nativities (Dykes, Persian Nativities IV)');
    const cf = f.current;
    if (cf && cf.major) add(`The CURRENT firdaria: ${cf.major.lord} major period (ages ${cf.major.startAge}–${cf.major.endAge})${cf.sub ? `, ${cf.sub.lord} sub-period (${Number(cf.sub.startAge).toFixed(1)}–${Number(cf.sub.endAge).toFixed(1)})` : ' (a node period — undivided)'}.`, 'the 7 equal sub-periods, first ruled by the period lord');
    if (!f.isDay) add('The night-chart node placement is genuinely DISPUTED in the sources: Abū Maʿshar (with Hand and Birchfield) puts the nodes at the end (ages 70–75); Bonatti (followed by Zoller) inserts them after Mars (39–44). Both are shown; neither is "correct".', 'the documented dispute, flagged in-data');
  }
  const r = x.releasing;
  if (r) {
    if (r.lots) add(`The Lots (sect-aware, reversing by night as Valens's Lots do): Spirit ${r.lots.spirit.label || formatLon(r.lots.spirit.lon)} (action/career), Fortune ${r.lots.fortune.label || formatLon(r.lots.fortune.lon)} (body).`, 'Valens IV.4 — Fortune the body, Daimon/Spirit the action');
    const cur = (leg, name, topic) => {
      if (!leg || !leg.current) return;
      const c = leg.current;
      if (c.l1) add(`Zodiacal releasing from ${name} (${topic}): the current L1 is ${c.l1.sign} (${c.l1.years} × 360-day years, ${String(c.l1.startDate).slice ? new Date(c.l1.startDate).toISOString().slice(0, 10) : ''}…${new Date(c.l1.endDate).toISOString().slice(0, 10)})${c.l2 ? `; current L2 ${c.l2.sign} (${c.l2.months} × 30-day months)${c.l2.loosed ? ' — reached by LOOSING OF THE BOND (the jump to the opposite sign)' : ''}` : ''}. Distribution age: ${c.distributionAge.years} yr ${Math.floor(c.distributionAge.days)} d in 360-day years.`, 'Valens IV.4–IV.10 (Riley); Capricorn counts 27');
    };
    cur(r.fromSpirit, 'the Lot of Spirit', 'action & career');
    cur(r.fromFortune, 'the Lot of Fortune', 'the body');
  }
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Time-lords']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'TIME-LORD PERIODS', DIVINER_PREAMBLE), facts: trimmed, glossary };
}

export function buildTimelordsInterpretPrompt() {
  return (
    'Read these computed time-lord periods as a learned historian of the Hellenistic and Persian timing doctrines ' +
    'would, FROM THE NUMBERED FACTS ONLY. In clear prose: (1) THE FRAME — whose nativity this is (day or night ' +
    'birth, the age reached) and that three independent classical clocks were computed over it; (2) SECONDARY ' +
    'PROGRESSIONS — read the progressed Sun and Moon against their natal places (the slow arc of the Sun ≈ 1°/year, ' +
    'the Moon\'s ~13°/year sweep), note any progressed station or sign change visible in the positions, and the ' +
    'Naibod-progressed angles; (3) FIRDARIA — name the current major lord and sub-lord and what the Persian ' +
    'tradition read in that pairing; if this is a night birth, state the node-placement dispute honestly; ' +
    '(4) ZODIACAL RELEASING — the current L1 and L2 signs from Spirit (career/action) and Fortune (body), what ' +
    'Valens\'s doctrine made of their ruler-years, and — if a period was reached by loosing of the bond — why the ' +
    'tradition marked such jumps as decisive; (5) ONE synthesis: where the three clocks agree or diverge on "whose ' +
    'time this is", as the tradition would have argued it. Never predict events, never advise; every signification ' +
    'is historical doctrine. Close with one honest sentence: time-lord systems are historical timing conventions ' +
    'of no demonstrated validity — described for study, never prescribed.' + PLAIN_CODA
  );
}
export function timelordsDataBlock(x) {
  const day = d => { try { return new Date(d).toISOString().slice(0, 10); } catch { return String(d).slice(0, 10); } };
  const p = x.progressions, f = x.firdaria, r = x.releasing;
  const leg = l => l && l.current ? {
    l1: l.current.l1 ? { sign: l.current.l1.sign, years: l.current.l1.years, from: day(l.current.l1.startDate), to: day(l.current.l1.endDate) } : null,
    l2: l.current.l2 ? { sign: l.current.l2.sign, months: l.current.l2.months, loosed: !!l.current.l2.loosed } : null,
  } : null;
  const dig = {
    meta: x.meta,
    progressions: p ? {
      progressedDate: day(p.progressedDate), naibodArcDeg: p.naibodArcDeg,
      planets: Object.fromEntries(Object.entries(p.planets || {}).map(([k, v]) => [k, formatLon(v.lon) + (v.retrograde ? ' R' : '')])),
      mc: formatLon(p.progressedMC), asc: formatLon(p.progressedAsc),
    } : null,
    firdaria: f ? {
      isDay: f.isDay, nightNodes: f.nightNodes,
      majors: (f.majors || []).map(mj => `${mj.lord} ${mj.startAge}-${mj.endAge}`),
      current: f.current && f.current.major ? { major: f.current.major.lord, sub: f.current.sub ? f.current.sub.lord : null } : null,
    } : null,
    releasing: r ? { spirit: leg(r.fromSpirit), fortune: leg(r.fromFortune) } : null,
  };
  return '\n\nCOMPUTED TIME-LORD DATA (JSON — interpret THESE periods, never invent):\n' + JSON.stringify(dig);
}

// ---- The Indian mirror: praśna · muhūrta · tājika ---------------------------
//  One shared Jyotiṣa-historian voice; the same absolute honest framing.
export const JYOTISHI_PREAMBLE =
  '\n\nVOICE: speak as a learned historian of Jyotiṣa — at home with Varāhamihira\'s Bṛhat Jātaka, the praśna ' +
  'classics (Ṣaṭpañcāśikā, Praśna Mārga), the muhūrta tradition (Muhūrta Cintāmaṇi), the Tājika synthesis ' +
  '(Samarasiṃha, Nīlakaṇṭha, Balabhadra\'s Hāyanaratna) and Krishnamurti\'s modern paddhati. Explain the rules ' +
  'vividly and ACCURATELY, always naming the text a rule comes from. BUT THE FRAMING ABOVE IS ABSOLUTE: this is ' +
  'a historical symbolic system of NO demonstrated validity. You DESCRIBE what the tradition computed and ' +
  'counselled, as history; you NEVER predict, never give real-world advice, never present a verdict as truth. ' +
  'Where the Indian and Western engines judge the same moment, compare the two rulebooks — never merge them. ' +
  'Ground every claim in the numbered facts; never invent a position or a verse.';

//  x = currentPrasnaReport() (app/prasna.js)
export function buildPrasnaContext(x, opts = {}) {
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  add(`The question${x.question ? `: "${x.question}"` : ' (unstated)'} — read under bhāva ${x.quesitedHouse}${x.quesited && x.quesited.meaning ? ` (${x.quesited.meaning})` : ''}, at ${String(x.momentUTC).replace('T', ' ').slice(0, 16)} UT.`, 'the querent; Praśna Mārga I.47');
  if (x.lagna) add(`The praśna lagna: ${x.lagna.sign}${x.lagna.nakshatra ? `, nakṣatra ${x.lagna.nakshatra.name}` : ''}${x.lagna.shirshodaya ? ' — a śīrṣodaya (head-rising) sign' : ''}${x.lagna.overriddenByKpNumber ? ' (fixed by the querent\'s KP horary number)' : ''}.`, 'the lagna is the querent');
  if (x.moon) add(`The Moon (the querent's mind): house ${x.moon.house}, ${x.moon.sign}${x.moon.nakshatra ? `, ${x.moon.nakshatra.name}` : ''}; tithi ${x.moon.tithi ? x.moon.tithi.name : '—'} (${x.moon.paksha || ''}).`, 'Daivajña Vallabha III.2');
  const cl = x.judgement && x.judgement.classification;
  if (cl) add(`Benefics this moment: ${cl.benefics.join(', ')}; malefics: ${cl.maleficsWithNodes ? cl.maleficsWithNodes.join(', ') : cl.malefics.join(', ')} (the Moon is ${cl.waxing ? 'waxing → benefic' : 'waning → malefic'}).`, 'Bṛhat Jātaka II.5; nodes per Phaladīpikā (flagged layering)');
  for (const t of (x.judgement ? x.judgement.testimonies : []) || []) add(`Testimony ${t.verdict.toUpperCase()}: ${t.rule}${t.detail ? ` — ${t.detail}` : ''}`, t.cite);
  if (x.judgement) add(`The tally: ${x.judgement.counts.for} for, ${x.judgement.counts.against} against, ${x.judgement.counts.neutral} neutral → the tradition's leaning is ${x.judgement.leaning.toUpperCase()}.`, 'a tally of historical rules, not a prediction');
  if (x.kp && x.kp.lagna) add(`The KP chain of the lagna: sign lord ${x.kp.lagna.signLord} → star lord ${x.kp.lagna.starLord} → SUB-LORD ${x.kp.lagna.subLord}${x.kp.cusps && x.kp.cusps[x.quesitedHouse - 1] ? `; the quesited cusp's sub-lord is ${x.kp.cusps[x.quesitedHouse - 1].subLord}` : ''}.`, 'K. S. Krishnamurti, KP Readers IV & VI');
  if (x.horaryNumber) add(`The querent's horary number ${x.horaryNumber.number} fixed the lagna in that sub-arc (No. 1 = 0° Aries … No. 249 = the last sub of Revatī).`, 'KP Reader VI');
  if (x.judgement && x.judgement.outOfScope && x.judgement.outOfScope.length) add(`Out of computable scope (the texts demand them; a website cannot): ${x.judgement.outOfScope.map(o => o.layer).join(', ')}.`, 'declared honestly, each cited in the tool');
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Indian horary']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'PRAŚNA JUDGEMENT', JYOTISHI_PREAMBLE), facts: trimmed, glossary };
}
export function buildPrasnaInterpretPrompt() {
  return (
    'Read this praśna as a historian of the Indian horary art would, FROM THE NUMBERED FACTS ONLY: ' +
    '(1) THE MOMENT AS THE CHART — explain praśna\'s premise (the question\'s instant stands for the question) and ' +
    'name the lagna and the Moon\'s condition, book meaning → plain terms; (2) THE TESTIMONIES — walk each cited ' +
    'rule that fired, for and against, translating what the rule is literally looking at (a sign rising, a planet ' +
    'in an angle, a waning Moon) and what the text counted it to mean; (3) THE KP LAYER — what a sub-lord is (pure ' +
    'Vimśottarī arithmetic on the zodiac) and what Krishnamurti\'s convention reads from the lagna and quesited-cusp ' +
    'sub-lords; (4) THE LEANING — state it as what it is: a tally of historical rules, never an answer to the ' +
    'question; name the ritual layers the texts demand that no engine can compute; (5) THE TWO RULEBOOKS — one ' +
    'plain paragraph comparing how this praśna grammar and Lilly\'s horary would approach the same moment ' +
    '(significators vs lagna-Moon, perfection vs kendra-testimony), compared never merged. Close with one honest ' +
    'sentence: praśna is a historical divinatory art of no demonstrated validity — described, never prescribed.' + PLAIN_CODA
  );
}
export function prasnaDataBlock(x) {
  const dig = {
    question: x.question || '', house: x.quesitedHouse,
    lagna: x.lagna ? { sign: x.lagna.sign, nakshatra: x.lagna.nakshatra && x.lagna.nakshatra.name, kpFixed: !!x.lagna.overriddenByKpNumber } : null,
    moon: x.moon ? { house: x.moon.house, sign: x.moon.sign, tithi: x.moon.tithi && x.moon.tithi.name } : null,
    testimonies: ((x.judgement && x.judgement.testimonies) || []).map(t => ({ rule: t.rule, verdict: t.verdict })),
    leaning: x.judgement && x.judgement.leaning,
    kp: x.kp ? { lagnaSub: x.kp.lagna && x.kp.lagna.subLord, cusps: (x.kp.cusps || []).map(c => `${c.house}:${c.subLord}`) } : null,
    horaryNumber: x.horaryNumber && x.horaryNumber.number,
  };
  return '\n\nCOMPUTED PRAŚNA (JSON — interpret THESE, never invent):\n' + JSON.stringify(dig);
}

//  x = currentMuhurtaReport() (app/muhurta.js)
export function buildMuhurtaContext(x, opts = {}) {
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  const hm = d => { try { return new Date(d).toISOString().slice(11, 16) + ' UT'; } catch { return '—'; } };
  add(`The sunrise-bounded day: sunrise ${hm(x.sunrise)}, sunset ${hm(x.sunset)}, next sunrise ${hm(x.nextSunrise)} — vāra ${x.vara ? `${x.vara.name} (lord ${x.vara.lord})` : '—'}. All divisions below are pure arithmetic on these real sun times.`, 'the pañcāṅga day begins at sunrise');
  if (x.current) add(`The CURRENT muhūrta: #${x.current.num} ${x.current.name} (${hm(x.current.start)}–${hm(x.current.end)}), classically graded ${x.current.quality}${x.current.contested ? ' — a CONTESTED grading (both positions kept in-data)' : ''}.`, x.current.cite || 'the 30-muhūrta table (later jyotiṣa tradition)');
  if (x.abhijit) add(`Abhijit (the 8th day-muhūrta): ${hm(x.abhijit.start)}–${hm(x.abhijit.end)}, midpoint at local apparent noon — the tradition's default-auspicious window${x.abhijit.todayException ? `; ${x.abhijit.todayException}` : ''}.`, x.abhijit.cite || 'the muhūrta tradition');
  if (x.brahma) add(`Brāhma muhūrta (the 29th): ${hm(x.brahma.start)}–${hm(x.brahma.end)} — the pre-dawn study window.`, x.brahma.cite || 'the muhūrta tradition');
  if (x.kalas) for (const k of ['rahu', 'yama', 'gulika']) { const K = x.kalas[k]; if (K) add(`${k === 'rahu' ? 'Rāhu-kāla' : k === 'yama' ? 'Yamaghaṇṭa' : 'Gulika-kāla'}: ${hm(K.start)}–${hm(K.end)} (octant ${K.octant} of the daylight arc, by the weekday table) — classically avoided.`, K.cite || 'the weekday octant tables'); }
  if (x.screens) for (const k of ['tithi', 'yoga', 'karana', 'nakshatra']) { const s = x.screens[k]; if (s) add(`Pañcāṅga screen — ${k}: ${s.value}${s.class ? ` (${s.class})` : ''} → the classical verdict is ${String(s.verdict).toUpperCase()}.`, s.cite); }
  add('These gradings are assigned lore attached to real, checkable sun-and-moon arithmetic; choosing a "good" muhūrta changes nothing real.', 'the honest frame');
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Muhūrta']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'MUHŪRTA DAY-CLOCK', JYOTISHI_PREAMBLE), facts: trimmed, glossary };
}
export function buildMuhurtaInterpretPrompt() {
  return (
    'Explain this muhūrta day as a historian of the Indian electional art would, FROM THE NUMBERED FACTS ONLY: ' +
    '(1) THE FRAME — the sunrise-bounded day and its divisions (30 muhūrtas = each arc ÷ 15; the kālas = the ' +
    'daylight arc ÷ 8 by weekday): real astronomy carrying assigned meanings; (2) THE PRESENT MOMENT — the current ' +
    'muhūrta by name and grading (flag it plainly if the grading is contested between sources), and where Abhijit ' +
    'and Brāhma fall today, book meaning → plain terms; (3) THE AVOIDED HOURS — Rāhu-kāla, Yamaghaṇṭa and ' +
    'Gulika-kāla: what the tradition claimed of them and what they literally are (fixed fractions of daylight ' +
    'picked by the weekday); (4) THE PAÑCĀṄGA SCREENS — each limb\'s value and classical verdict translated; ' +
    '(5) TWO RULEBOOKS — one plain paragraph comparing this system with the Picatrix election engine on the same ' +
    'sky (planetary hours vs muhūrtas, Moon\'s mansion vs nakṣatra screens), compared never merged. Close with one ' +
    'honest sentence: electing times is a historical selection ritual with no demonstrated effect on outcomes — ' +
    'described, never prescribed.' + PLAIN_CODA
  );
}
export function muhurtaDataBlock(x) {
  const hm = d => { try { return new Date(d).toISOString().slice(11, 16); } catch { return null; } };
  const dig = {
    vara: x.vara && x.vara.name,
    current: x.current ? { num: x.current.num, name: x.current.name, quality: x.current.quality } : null,
    kalas: x.kalas ? Object.fromEntries(['rahu', 'yama', 'gulika'].map(k => [k, x.kalas[k] ? [hm(x.kalas[k].start), hm(x.kalas[k].end)] : null])) : null,
    screens: x.screens ? Object.fromEntries(Object.entries(x.screens).map(([k, s]) => [k, s && `${s.value}: ${s.verdict}`])) : null,
    muhurtas: (x.muhurtas || []).map(m => `${m.num} ${m.name} ${m.quality}${m.isAbhijit ? ' ★abhijit' : ''}${m.isBrahma ? ' ★brahma' : ''}`),
  };
  return '\n\nCOMPUTED MUHŪRTA DAY (JSON — interpret THESE, never invent):\n' + JSON.stringify(dig);
}

//  x = currentTajikaReport() (app/tajika.js)
export function buildTajikaContext(x, opts = {}) {
  const max = opts.maxFacts ?? 80;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  const m = x.meta || {};
  add(`The nativity: ${String(m.birthUTC || '').replace('T', ' ').slice(0, 16)} UT; the year chart is for ${m.targetYear} (completed years: ${m.completedYears}).`, 'the varṣaphala inputs');
  if (x.varshaPravesha) add(`The varṣa-praveśa (SIDEREAL solar return): ${String(x.varshaPravesha.instantISO || '').replace('T', ' ').slice(0, 16)} UT — ${Math.round(x.varshaPravesha.driftMinutes)} minutes after the tropical return (real astronomy: the ayanāṁśa drift).`, 'Hāyanaratna ch. 1; the sidereal return');
  if (x.annual && x.annual.lagna) add(`The annual lagna: ${x.annual.lagna.rashi} (${x.annual.lagna.sanskrit || ''}), a ${x.annual.isDay ? 'day' : 'night'} chart.`, 'the annual chart');
  if (x.muntha) add(`The munthā: ${x.muntha.rashi}, house ${x.muntha.house} of the annual chart (natal Asc sign + ${x.muntha.completedYears} completed years, one sign per year).`, x.muntha.cite || 'Samarasiṃha, quoted in Hāyanaratna ch. 5');
  if (x.varsheshvara) {
    add(`The varṣeśvara (year-lord): ${x.varsheshvara.chosen.planet}${x.varsheshvara.chosen.roles ? ` (${x.varsheshvara.chosen.roles.join(' + ')})` : ''}, chosen from the five candidates by the aspect-to-lagna precondition${x.varsheshvara.viaDispute ? ' — NOTE: no candidate aspected the lagna, so the choice fell to the tradition\'s own four-way disputed fallback (Balabhadra\'s verdict implemented, dispute recorded)' : ''}.`, x.varsheshvara.cite || 'Hāyanaratna; Tājikakaustubha tie-chain');
    for (const c of x.varsheshvara.candidates || []) add(`Candidate — ${c.role}: ${c.planet}${c.aspectsLagna ? `, aspects the annual lagna (${c.aspect || 'aspect'})` : ', does NOT aspect the lagna'}${c.chosen ? ' → CHOSEN' : ''}.`, 'the five-candidate rule');
  }
  const pairs = (x.aspects && x.aspects.pairs || []).filter(p => p.verdict === 'itthasala' || p.verdict === 'isarapha').slice(0, 8);
  for (const p of pairs) add(`${p.a}–${p.b}: ${p.verdict === 'itthasala' ? 'itthaśāla (applying — the matter forms)' : 'īsarāpha (separating — the matter dissolves)'}${p.carveOut ? ' [past by <1° — still itthaśāla per the ancient commentator]' : ''}, gap ${Number(p.gap).toFixed(1)}° within the deeptāṁśa orbs.`, 'Tājikabhūṣaṇa 4.10; Hāyanaratna ch. 3');
  if (x.yogas) add(`Year-yogas: ikkavāla ${x.yogas.ikkavala ? 'YES' : 'no'}, induvāra ${x.yogas.induvara ? 'YES' : 'no'}; ${x.yogas.itthasalaCount} itthaśāla and ${x.yogas.isaraphaCount} īsarāpha pairs; nakta/yamayā/kambūla found: ${(x.yogas.naktas || []).length}/${(x.yogas.yamayas || []).length}/${(x.yogas.kambulas || []).length}.`, 'the sixteen-yoga doctrine (core subset computed)');
  for (const s of (x.sahams && x.sahams.sahams || []).slice(0, 12)) add(`Saham ${s.name}: ${s.sign} ${Number(s.degInSign).toFixed(1)}° (house ${s.house})${s.correctionApplied ? ' [+30° correction applied — a rule Viśvanātha\'s Prakāśikā rejected; contested in-data]' : ''}.`, s.cite || 'Saṃjñātantra 3.5 via Hāyanaratna');
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Tājika']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'TĀJIKA YEAR CHART', JYOTISHI_PREAMBLE), facts: trimmed, glossary };
}
export function buildTajikaInterpretPrompt() {
  return (
    'Read this varṣaphala as a historian of the Tājika tradition would, FROM THE NUMBERED FACTS ONLY: ' +
    '(1) THE YEAR-ENTRY — what a varṣa-praveśa is (the Sun regaining its natal sidereal place — real, checkable ' +
    'astronomy) and when this year\'s fell; (2) THE MUNTHĀ — the year-sign and its house, book meaning → plain ' +
    'terms; (3) THE VARṢEŚVARA — how the five candidates competed, why this planet won under the ' +
    'aspect-precondition; if the disputed no-aspect fallback fired, present the four-way disagreement as the ' +
    'tradition\'s own unresolved argument; (4) THE CONFIGURATIONS — the itthaśāla/īsarāpha pairs, and say plainly ' +
    'that these are the Arabic ittiṣāl/inṣirāf — the SAME applying/separating doctrine Lilly\'s horary inherited, ' +
    'surfacing in Sanskrit dress; (5) THE SAHAMS — the year\'s lots, what each named saham was held to govern, and ' +
    'the contested +30° correction where it fired; (6) THE YEAR, GATHERED — what the tradition would have said this ' +
    'year emphasises, strictly as historical doctrine, plus one plain comparison with the Western solar return of ' +
    'the same instant. Close with one honest sentence: the varṣaphala is a historical annual-chart doctrine of no ' +
    'demonstrated validity — described, never prescribed.' + PLAIN_CODA
  );
}
export function tajikaDataBlock(x) {
  const dig = {
    year: x.meta && x.meta.targetYear,
    pravesha: x.varshaPravesha && String(x.varshaPravesha.instantISO || '').slice(0, 16),
    lagna: x.annual && x.annual.lagna && x.annual.lagna.rashi,
    muntha: x.muntha ? `${x.muntha.rashi} h${x.muntha.house}` : null,
    varsheshvara: x.varsheshvara ? { chosen: x.varsheshvara.chosen.planet, viaDispute: !!x.varsheshvara.viaDispute } : null,
    pairs: (x.aspects && x.aspects.pairs || []).filter(p => p.verdict === 'itthasala' || p.verdict === 'isarapha')
      .map(p => `${p.a}-${p.b}:${p.verdict}${p.carveOut ? '(carveout)' : ''}`),
    sahams: (x.sahams && x.sahams.sahams || []).map(s => `${s.name}:${s.sign} ${Number(s.degInSign).toFixed(1)}${s.correctionApplied ? '+30' : ''}`),
  };
  return '\n\nCOMPUTED VARṢAPHALA (JSON — interpret THESE, never invent):\n' + JSON.stringify(dig);
}

// ===========================================================================
//  JUNG — a FIRST-PERSON "C. G. Jung reads your horoscope" bridge. The model
//  speaks AS Jung, in a faithful reconstruction of his documented voice and
//  views, and explains the computed psychological horoscope step by step. Bound
//  by the SAME locked honest framing — which, happily, is Jung's OWN considered
//  position: astrology as projected psychology and synchronicity, never a causal
//  science; his one statistical test came out null and he said so.
// ===========================================================================

// The persona: it is layered on HONEST_SYSTEM_PREAMBLE (which locks the framing).
export const JUNG_PREAMBLE =
  '\n\nVOICE — a FIRST-PERSON RECONSTRUCTION OF C. G. JUNG. You are to speak AS Carl Gustav Jung (1875–1961), in the ' +
  'first person ("I"), reading this horoscope aloud the way he did in his consulting room at Küsnacht — grave, ' +
  'erudite, warm, unhurried, digressive toward myth and alchemy, and scrupulously honest about what astrology can and ' +
  'cannot be. This is a faithful HISTORICAL RECONSTRUCTION of his voice and documented views for study — not a ' +
  'channelling and not the real man; never claim to be conscious, alive, or to have knowledge beyond the computed ' +
  'figures and Jung\'s published thought.\n' +
  'WHAT JUNG ACTUALLY HELD (stay inside it): the planets are ARCHETYPAL IMAGES of the collective unconscious projected ' +
  'onto the sky — "astrology represents the summation of all the psychological knowledge of antiquity" (CW 15). The ' +
  'horoscope is a MIRROR OF THE PSYCHE, a symbolic aid he used "for a further point of view from an entirely different ' +
  'angle" in difficult diagnoses (to B. V. Raman, 1947) — never a determinism. Where it seems to work it works by ' +
  'SYNCHRONICITY (acausal, meaningful coincidence) and PROJECTION, not by rays or forces. Read Sol as consciousness ' +
  'and the ego\'s road to the Self; Luna as the unconscious, the mother, the anima; Mercurius as the trickster-' +
  'psychopomp; Saturn as the senex; the Sol–Luna aspect as the coniunctio, the marriage of conscious and unconscious ' +
  'that is the goal of individuation; the elements as the four functions of consciousness (thinking, feeling, ' +
  'sensation, intuition), the weakest being the INFERIOR FUNCTION, the door through which the unconscious enters.\n' +
  'HONESTY (in your own voice, because it was truly his): you tested astrology once, formally — the marriage ' +
  'experiment of 483 couples in the Synchronicity essay — and it came out NULL; the "significant" aspects were ' +
  'chance, as Fierz\'s statistics showed you, and you said so in print. So: describe the SYMBOLIC, PSYCHOLOGICAL ' +
  'meaning of this figure as a mirror for self-knowledge; NEVER present it as prediction, medical/clinical diagnosis, ' +
  'or fact about the person\'s future or fate. Ground every statement in the COMPUTED POSITIONS below — never invent a ' +
  'placement. Be richly detailed, but every claim must trace to a real position in the chart or to your published ideas.';

// j = { kind:'jung', reading (jungianReading output), asc, mc, ascSign, mcSign, name?, isJung? }
export function buildJungContext(j, opts = {}) {
  const r = j.reading;
  const max = opts.maxFacts ?? 90;
  const facts = []; const add = (t, c) => t && facts.push({ text: t, cite: c || '' });
  if (j.name) add(`The nativity read${j.isJung ? ' (this is my OWN horoscope, as my daughter Gret Baumann-Jung cast it)' : ''}: ${j.name}.`, j.isJung ? 'Baumann-Jung, Spring (1975)' : '');
  add(`The Ascendant rises at ${j.asc} (${j.ascSign}); the Midheaven at ${j.mc} (${j.mcSign}).`, 'the figure');
  for (const p of r.planets) add(`${p.planet} at ${p.label} in ${p.sign}, house ${p.house}${p.retrograde ? ' (retrograde)' : ''} — archetype: ${p.archetype}. ${p.meaning}`, p.cite);
  add(`The four elements as the four functions (weighted): ${r.elements.functions.map(f => `${f.element}/${f.function} ${f.weight}`).join(', ')}. Leading (superior) function: ${r.elements.dominant.element} → ${r.elements.dominant.function}; weakest element → candidate inferior function: ${r.elements.inferior.element} → ${r.elements.inferior.function} (an element→function mapping that is post-Jungian doctrine, not Jung's own).${r.elements.axisNote ? ' ' + r.elements.axisNote : ''}`, r.elements.dominant.cite);
  add(`Sol–Luna: ${r.coniunctio.text}`, 'CW 14 Mysterium Coniunctionis');
  add(`Anima significators: ${r.animaAnimus.anima}. Animus significators: ${r.animaAnimus.animus}.`, 'CW 9ii');
  add(`The senex / shadow: ${r.shadow.saturn}. ${r.shadow.text}`, 'post-Jungian (Hillman, Greene)');
  add(`Honest frame: ${r.caveat}`, r.cite);
  const trimmed = facts.slice(0, max);
  const glossary = divinationGlossary(['Jung']).slice(0, opts.maxGlossary ?? 99);
  return { system: assembleSystem(trimmed, glossary, 'PSYCHOLOGICAL HOROSCOPE', JUNG_PREAMBLE), facts: trimmed, glossary };
}

// THE CODEBOOK — the step-by-step protocol by which "Jung" reads the figure.
// Each numbered step is an explicit instruction; the reply is a first-person,
// extremely detailed reading that walks the figure in this fixed order.
export function buildJungInterpretPrompt(j) {
  const who = j && j.isJung ? 'my own nativity' : (j && j.name ? `the nativity of ${j.name}` : 'this nativity');
  return (
    `Read ${who} ALOUD, in the FIRST PERSON as C. G. Jung, in an extremely detailed psychological horoscope — a full ` +
    `hour in the consulting room. Draw ONLY on the computed positions in your context. Follow this CODEBOOK exactly, ` +
    `step by step, keeping each numbered heading so the reading is a clear protocol:\n\n` +
    `**0. The frame.** Open in your own voice: say plainly what a horoscope is FOR YOU — a mirror of the psyche, the ` +
    `projected god-images of antiquity, to be read for self-knowledge and never as fate or forecast. Two or three ` +
    `sentences.\n` +
    `**1. The whole figure & the Ascendant.** The rising sign as the mask (persona) the world meets, and the overall ` +
    `temper of the chart — is it weighted to fire, earth, air, water; angular or scattered.\n` +
    `**2. Sol — consciousness.** The Sun by sign and house: the conscious standpoint, the ego and its long road toward ` +
    `the Self. What kind of light does this consciousness give?\n` +
    `**3. Luna — the unconscious.** The Moon by sign and house: the nocturnal psyche, the mother-imago, and (in the ` +
    `psychology of a man) the anima. What does the unconscious want here?\n` +
    `**4. The coniunctio — Sol and Luna together.** The exact aspect between the lights (from the context) as the ` +
    `central drama of individuation: the marriage, tension, or opposition of conscious and unconscious. This is the ` +
    `heart of the reading — dwell on it, and connect it to the alchemical coniunctio of Mysterium Coniunctionis.\n` +
    `**5. Mercurius.** Mercury as the trickster-psychopomp, the mediating and translating spirit — how the mind moves ` +
    `between the worlds in this figure.\n` +
    `**6. Eros & the sword — Venus and Mars.** Venus as Eros and relatedness, Mars as the assertive, separating drive; ` +
    `read them also as the anima/animus significators, naming honestly that this significator-scheme is of my era.\n` +
    `**7. The wise king & the senex — Jupiter and Saturn.** Jupiter as the drive to meaning (the religious function); ` +
    `Saturn as the senex, limit and time — and whether Saturn presses hard on the lights, which is the shadow\'s ` +
    `weight demanding integration.\n` +
    `**8. The four functions.** From the element balance in the context: name the SUPERIOR function (the dominant ` +
    `element) and the INFERIOR function (the weakest) — the inferior being the door through which the unconscious, and ` +
    `the whole problem of the personality, enters. This is the typological core.\n` +
    `**9. The synthesis — the individuation task.** Weave steps 1–8 into ONE reading: what this figure shows about the ` +
    `person\'s path toward wholeness — the shadow to be met, the anima/animus to be related to, the coniunctio to be ` +
    `achieved. Speak of the Self, never of fate.\n` +
    `**10. The honest word.** Close in your own true voice: that this is projected psychology and synchronicity, not a ` +
    `causal science; that you tested astrology statistically (the marriage experiment) and found nothing beyond ` +
    `chance, and said so; that the horoscope\'s worth is as a symbolic mirror for the work of self-knowledge — never a ` +
    `prediction, a diagnosis, or a determinism. And acknowledge in one plain sentence that this voice is a modern ` +
    `reconstruction of Jung\'s documented views, not the man himself. One honest paragraph.` + PLAIN_CODA
  );
}

export function jungDataBlock(j) {
  const r = j.reading;
  const dig = {
    name: j.name || '', isJung: !!j.isJung, asc: j.asc, ascSign: j.ascSign, mc: j.mc, mcSign: j.mcSign,
    planets: r.planets.map(p => ({ planet: p.planet, position: p.label, sign: p.sign, house: p.house, retrograde: p.retrograde, archetype: p.archetype })),
    functions: r.elements.functions.map(f => ({ element: f.element, function: f.function, weight: f.weight })),
    dominant: r.elements.dominant.function, inferior: r.elements.inferior.function,
    solLuna: r.coniunctio.aspect, coniunctio: r.coniunctio.text,
    anima: r.animaAnimus.anima, animus: r.animaAnimus.animus, saturn: r.shadow.saturn, shadow: r.shadow.text,
  };
  return '\n\nCOMPUTED PSYCHOLOGICAL HOROSCOPE (JSON — interpret THESE positions as Jung, never invent):\n' + JSON.stringify(dig);
}
