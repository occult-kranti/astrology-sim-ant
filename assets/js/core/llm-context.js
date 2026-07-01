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
    'castGeomancy', 'drawTarot', 'castIChing'];
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
function assembleSystem(facts, glossary, label) {
  return HONEST_SYSTEM_PREAMBLE + DIVINER_PREAMBLE +
    '\n\nGLOSSARY (terms of art):\n' + glossary.map(g => `- ${g.term}: ${g.def}`).join('\n') +
    `\n\nCOMPUTED ${label} (already cast & calculated by the engine; cite these, never invent):\n` +
    facts.map(f => `- ${f.text}${f.cite ? `  [${f.cite}]` : ''}`).join('\n');
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
    'historical, pseudoscientific art of no demonstrated validity — described for study, never prescribed.'
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
    'predictive validity — a historical symbolic system described for study, never prescribed.'
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
    'historical divinatory art of no demonstrated predictive validity — described for study, never prescribed.'
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
