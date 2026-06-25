// engine-test.mjs — dependency-free headless sanity check of the calculation engine.
// Run from repo root: `node scripts/engine-test.mjs`  → exits non-zero on any failure.
// Imports the repo's own ES modules (pure, no DOM). Extend with new modules as they land.
import { castChart, formatLon, signOf } from '../assets/js/core/astro.js';
import { essentialDignity, accidentalDignity, almuten } from '../assets/js/core/dignities.js';
import { chartCautions } from '../assets/js/core/cautions.js';
import { planetaryHour } from '../assets/js/core/planetary-hours.js';
import { bodyPartOf } from '../assets/js/core/data/degree-tables.js';

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++; };

// Equinox: Sun ≈ 0° Aries (allow the boundary display 29.9° Pisces / 0.x° Aries).
const eq = castChart(new Date(Date.UTC(2024, 2, 20, 3, 6)), 51.5074, -0.1278, 'regiomontanus');
const sun = signOf(eq.planets.Sun.lon);
ok((sun.name === 'Aries' && sun.degInSign < 1) || (sun.name === 'Pisces' && sun.degInSign > 29),
   `equinox Sun near 0° Aries (got ${formatLon(eq.planets.Sun.lon)})`);

// Solstice: Sun ≈ 0° Cancer.
const sol = signOf(castChart(new Date(Date.UTC(2024, 5, 20, 20, 51)), 51.5, 0, 'regiomontanus').planets.Sun.lon);
ok((sol.name === 'Cancer' && sol.degInSign < 1) || (sol.name === 'Gemini' && sol.degInSign > 29),
   `solstice Sun near 0° Cancer (got ${sol.name} ${sol.degInSign.toFixed(1)}°)`);

// Body-parts generating rule (Lilly's own checks).
ok(bodyPartOf('Saturn', 2) === 'Belly', 'Saturn in Gemini → Belly');
ok(bodyPartOf('Moon', 0) === 'Head & knees', 'Moon in Aries → Head & knees');

// Dignity + almuten produce sane shapes.
const ed = essentialDignity('Mars', eq.planets.Mars.lon, eq.isDay);
ok(typeof ed.total === 'number' && Array.isArray(ed.rows), 'essentialDignity returns {total, rows}');
ok(almuten(eq.asc, eq.isDay).planet !== undefined, 'almuten of Asc resolves a planet');
ok(typeof accidentalDignity('Saturn', eq).total === 'number', 'accidentalDignity returns a total');

// Cautions engine produces a verdict.
const ph = planetaryHour(new Date(Date.UTC(2024, 2, 20, 3, 6)), 51.5074, -0.1278);
const cau = chartCautions(eq, { hourRuler: ph && ph.ruler });
ok(['green', 'amber', 'red'].includes(cau.verdict), `cautions verdict is green/amber/red (got ${cau.verdict})`);

// --- Picatrix data modules (Phase 1) ---------------------------------------
import { LUNAR_MANSIONS, MANSION_ARC, mansionOf } from '../assets/js/core/data/lunar-mansions.js';
ok(LUNAR_MANSIONS.length === 28, `28 lunar mansions (got ${LUNAR_MANSIONS.length})`);
ok(mansionOf(0).num === 1 && mansionOf(359.9).num === 28, 'mansionOf boundaries (0->1, 359.9->28)');
ok(Math.abs(MANSION_ARC - 360 / 28) < 1e-9, 'mansion arc = 360/28');
ok(LUNAR_MANSIONS.every(m => m.source && m.use), 'every mansion has source + use');

import { BEHENIAN_STARS, behenianLongitude, starsInAspect } from '../assets/js/core/data/behenian-stars.js';
ok(BEHENIAN_STARS.filter(s => !s.modern).length >= 15, `>=15 canonical Behenian stars`);
const alkaid = BEHENIAN_STARS.find(s => s.name.includes('Alkaid'));
const foma = BEHENIAN_STARS.find(s => s.name.includes('Fomalhaut'));
ok(alkaid && !alkaid.modern, 'Alkaid present and canonical (not modern)');
ok(!foma || foma.modern === true, 'Fomalhaut, if present, flagged modern');
ok(Math.abs(behenianLongitude('Algol', new Date(Date.UTC(2020, 0, 1))) - 56.43) < 0.4,
   `Algol ~56.43° at 2020 (got ${behenianLongitude('Algol', new Date(Date.UTC(2020,0,1)))?.toFixed(2)})`);
ok(behenianLongitude('Algol', new Date(Date.UTC(2092, 0, 1))) - behenianLongitude('Algol', new Date(Date.UTC(2020, 0, 1))) > 0.9,
   'Algol precesses ~1° over 72yr');
ok(BEHENIAN_STARS.every(s => s.source), 'every Behenian star has source');
ok(Array.isArray(starsInAspect(eq, 6)), 'starsInAspect returns an array');

import { DECAN_FACES, faceOf } from '../assets/js/core/data/decan-faces.js';
import { faceRulerAt } from '../assets/js/core/data/dignities-data.js';
ok(DECAN_FACES.length === 36, `36 decan faces (got ${DECAN_FACES.length})`);
ok(faceOf(0).ruler === 'Mars' && faceOf(0).decan === 1, 'Aries-1 face = Mars, decan 1');
ok(faceOf(359).sign === 'Pisces' && faceOf(359).decan === 3, 'last face = Pisces decan 3');
ok(DECAN_FACES.every(f => f.ruler === faceRulerAt(f.signIndex, (f.decan - 1) * 10)), 'face rulers match dignities-data FACES');
ok(DECAN_FACES.every(f => f.image && f.source), 'every face has image + source');

import { PLANETARY_MAGIC, magicFor } from '../assets/js/core/data/planetary-magic.js';
ok(Object.keys(PLANETARY_MAGIC).length === 7, '7 planets in PLANETARY_MAGIC');
ok(magicFor('Venus').agrippa.angel === 'Haniel', "Venus's Agrippa angel = Haniel");
ok(Object.values(PLANETARY_MAGIC).every(p => p.governs && p.suffumigation && p.source && p.agrippa?.angel),
   'every planet has governs + suffumigation + source + agrippa.angel');

// --- Election engine (Phase 2A) --------------------------------------------
import { OPERATIONS, isViaCombusta, moonPhase, moonDispositor, electionScore, rankNow, findNextElection, nextAuspiciousTime } from '../assets/js/core/election.js';
ok(OPERATIONS.length >= 10 && OPERATIONS.every(o => o.ruler && o.keywords && o.polarity), `>=10 operations, each with ruler+keywords+polarity`);

// via combusta + Spica exception (Spica ~204.1° = 24°06' Libra)
ok(isViaCombusta(210, new Date(Date.UTC(2026, 0, 1))).active === true, 'Moon at 210° is in active via combusta');
ok(isViaCombusta(100, new Date(Date.UTC(2026, 0, 1))).active === false, 'Moon at 100° is not in via combusta');
const spicaTest = isViaCombusta(204.1, new Date(Date.UTC(2026, 0, 1)));
ok(spicaTest.inZone && spicaTest.exemptBySpica && spicaTest.active === false, 'Moon on Spica (~204°) is in-zone but exempt (active=false)');

// real chart, full election readout
const eDate = new Date(Date.UTC(2026, 5, 25, 12, 0));
const eChart = castChart(eDate, 51.5074, -0.1278, 'regiomontanus');
ok(typeof moonPhase(eChart).waxing === 'boolean', 'moonPhase returns waxing boolean');
ok(moonDispositor(eChart).planet !== undefined, 'moonDispositor resolves a planet');
const love = electionScore(eChart, 'love');
ok(['green', 'amber', 'red'].includes(love.verdict), `electionScore verdict valid (got ${love.verdict})`);
ok(love.reasons.length > 0 && love.reasons.every(r => r.cite && r.text && r.severity), 'every election reason has severity+text+cite');
ok(love.moon.mansion && love.moon.mansion.num >= 1 && love.moon.mansion.num <= 28, 'election reports the Moon mansion');
ok(love.hour && love.hour.ruler, 'election reports the planetary hour');
ok(love.correspondences && love.correspondences.agrippa, 'election reports the planet correspondences');

// rankNow scores every operation, sorted best-first
const ranked = rankNow(eChart);
ok(ranked.length === OPERATIONS.length, `rankNow scores all ${OPERATIONS.length} operations`);
const VR = { green: 2, amber: 1, red: 0 };
ok(ranked.every((r, i) => i === 0 || VR[ranked[i - 1].verdict] >= VR[r.verdict]), 'rankNow is sorted by verdict (best first)');

// findNextElection returns ranked, well-formed windows
const wins = findNextElection('love', eDate, 51.5074, -0.1278, { hoursAhead: 12, stepMinutes: 60 });
ok(Array.isArray(wins), 'findNextElection returns an array');
ok(wins.every(w => w.start <= w.end), 'each window has start <= end');
ok(wins.every((w, i) => i === 0 || wins[i - 1].best >= w.best), 'windows ranked by best score');

// nextAuspiciousTime: returns null or an improving, in-window result
const na = nextAuspiciousTime(eDate, 51.5074, -0.1278, { hoursAhead: 24, target: 'amber', stepMinutes: 60 });
ok(na === null || (na.time > eDate && ['amber', 'green'].includes(na.verdict)), 'nextAuspiciousTime: null or a later amber/green moment');

// R1: election gating — a green verdict requires no hard-requirement failure
ok(Array.isArray(love.gating), 'electionScore exposes a gating array');
ok(love.gating.length === 0 || love.verdict !== 'green', 'a gating failure forbids a green verdict');
ok(rankNow(eChart).every(r => r.gating.length === 0 || r.verdict !== 'green'), 'no operation is green over a gating failure');

// R1: sect-aware Part of Fortune + generalized Lot
import { partOfFortune, lot } from '../assets/js/core/astro.js';
ok(partOfFortune(100, 10, 40) === ((100 + 40 - 10) % 360), 'Part of Fortune default = Asc + Moon - Sun (both sects)');
ok(partOfFortune(100, 10, 40, { sectAware: true, isDay: false }) === ((100 + 10 - 40 + 360) % 360), 'sect-aware night Part of Fortune reverses to Asc + Sun - Moon');
ok(lot(100, 40, 10) === 130, 'generalized lot(asc,B,C) = Asc + B - C');

// --- Natal engine modules (Phase 2C) ---------------------------------------
const natal = castChart(new Date(Date.UTC(1990, 4, 15, 12, 0)), 51.5074, -0.1278, 'regiomontanus');

import { annualProfection, lordOfYear, monthlyProfection } from '../assets/js/core/profections.js';
ok(annualProfection(natal, 0).activatedHouse === 1, 'profection year 0 -> 1st house');
ok(annualProfection(natal, 0).profectedSignIndex === signOf(natal.asc).index, 'profection year 0 -> Asc sign');
ok(annualProfection(natal, 12).profectedSignIndex === annualProfection(natal, 0).profectedSignIndex, 'profection 12-year cycle');
ok(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'].includes(lordOfYear(natal, 30)), 'lordOfYear is a planet');
ok(monthlyProfection(natal, 0, 0).lord === lordOfYear(natal, 0), 'monthly profection month 0 = lord of year');

import { solarReturn } from '../assets/js/core/solar-return.js';
const sr = solarReturn(natal, 2026);
const srDiff = Math.abs(((sr.chart.planets.Sun.lon - natal.planets.Sun.lon + 540) % 360) - 180);
ok(srDiff < 0.01, `solar return Sun matches natal Sun (diff ${srDiff.toFixed(4)}°)`);
ok(sr.instant.getUTCFullYear() === 2026, 'solar return instant is in target year');

import { hyleg, alcocoden, HYLEGIACAL_HOUSES, PLANETARY_YEARS } from '../assets/js/core/hyleg.js';
const hy = hyleg(natal);
ok([null,'Sun','Moon','Ascendant','Part of Fortune','Syzygy'].includes(hy.hyleg), `hyleg is a valid candidate (got ${hy.hyleg})`);
ok(Array.isArray(hy.candidatesExamined) && hy.candidatesExamined.length > 0, 'hyleg lists candidates examined');
ok(hy.reason && hy.assumptions, 'hyleg documents reason + assumptions (contested technique)');
const al = alcocoden(natal, hy);
ok(al.alcocoden === null || (al.years && typeof al.years.mean === 'number'), 'alcocoden gives years when a planet is found');

import { arcToYears, directInZodiac, directionsToAngles, KEYS } from '../assets/js/core/directions.js';
ok(Math.abs(arcToYears(KEYS.naibod) - 1) < 1e-6, 'Naibod: 1 year per 0.9856° arc');
ok(arcToYears(30, 'ptolemy') === 30, 'Ptolemy key: 1°=1yr');
ok(directInZodiac(10, 40).directArc === 30, 'directInZodiac direct arc 10->40 = 30°');
const dirs = directionsToAngles(natal, { maxYears: 90 });
ok(Array.isArray(dirs) && dirs.every((d, i) => i === 0 || dirs[i - 1].years <= d.years) && dirs.every(d => d.years <= 90),
   'directionsToAngles sorted ascending, all <= 90yr');

// --- Talisman workflow (Phase T) -------------------------------------------
import { talismanRecipe, allRecipes, TALISMAN_DISCLAIMER } from '../assets/js/core/talisman.js';
const rec = talismanRecipe(eChart, 'love');
ok(rec.aim && rec.planet === 'Venus', 'recipe: love -> Venus');
ok(rec.materials && rec.materials.suffumigation && rec.materials.metal && rec.materials.stone, 'recipe has materials (suffumigation/metal/stone)');
ok(rec.materials.spirits && rec.materials.spirits.agrippa && rec.materials.spirits.agrippa.angel === 'Haniel', 'recipe spirits: Venus Agrippa angel Haniel');
ok(rec.moon && rec.moon.mansion && rec.moon.mansion.num >= 1, 'recipe reports the Moon mansion');
ok(Array.isArray(rec.steps) && rec.steps.length >= 6 && rec.steps.every(s => s.text && s.cite), 'recipe has >=6 cited steps');
ok(Array.isArray(rec.citations) && rec.citations.length > 0, 'recipe collects citations');
ok(['green','amber','red'].includes(rec.verdict), 'recipe carries an election verdict');
ok(typeof TALISMAN_DISCLAIMER === 'string' && /historical/i.test(TALISMAN_DISCLAIMER), 'talisman disclaimer present');
ok(allRecipes(eChart).length === OPERATIONS.length, 'allRecipes covers every operation');

// --- Life trajectory + location (round: trajectory & location) -------------
import { lifeTrajectory, ageBetween } from '../assets/js/core/trajectory.js';
ok(ageBetween(new Date(Date.UTC(1990, 4, 15, 12, 0)), new Date(Date.UTC(2026, 5, 25, 12, 0))) === 36, 'ageBetween 1990-05-15 -> 2026-06-25 = 36');
ok(ageBetween(new Date(Date.UTC(1990, 4, 15)), new Date(Date.UTC(1990, 0, 1))) === 0, 'ageBetween clamps to 0 before birth');
const tj = lifeTrajectory(natal, { currentDate: new Date(Date.UTC(2026, 5, 25, 12, 0)) });
ok(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'].includes(tj.natal.lordOfGeniture.planet), 'trajectory: Lord of Geniture is a planet');
ok(Array.isArray(tj.timeline) && tj.timeline.length > 0 && tj.timeline.filter(t => t.current).length === 1, 'trajectory: timeline has exactly one current year');
ok(Array.isArray(tj.directions), 'trajectory: directions is an array');
ok(Array.isArray(tj.picatrix.rulingPlanets) && tj.picatrix.rulingPlanets.length >= 1, 'trajectory: >=1 ruling planet');
ok(Array.isArray(tj.picatrix.affinities), 'trajectory: affinities is an array');
ok(tj.recommendedTalisman === undefined || tj.picatrix.recommendedTalisman === null || (tj.picatrix.recommendedTalisman && tj.picatrix.recommendedTalisman.aim), 'trajectory: recommended talisman is null or has an aim');
ok(Array.isArray(tj.citations) && tj.citations.length > 0, 'trajectory: citations collected');

import { nearestCity } from '../assets/js/app/location.js';
const nc = nearestCity(51.5, -0.12);
ok(nc && typeof nc.name === 'string' && nc.name.length > 0, `nearestCity returns a name (got ${nc && nc.name})`);
ok(nc && typeof nc.distanceKm === 'number' && nc.distanceKm >= 0, 'nearestCity returns a numeric distance');

// --- Unified reading spine (Phase A1) --------------------------------------
import { fullReading, HONEST_FRAMING } from '../assets/js/core/reading.js';
const reading = fullReading(eChart);
ok(reading && reading.meta && reading.moment && reading.dignities && reading.aspects &&
   reading.lots && reading.cautions && reading.election && reading.talisman,
   'fullReading returns all core blocks');
ok(reading.horary === null && reading.natal === null, 'fullReading: horary & natal null without their opts');
let roundTrip = false;
try { roundTrip = !!JSON.parse(JSON.stringify(reading)).meta; } catch { roundTrip = false; }
ok(roundTrip, 'fullReading is JSON-serializable (round-trips)');
ok(Array.isArray(reading.citations) && reading.citations.length > 0, 'fullReading collects a flat citations array');
ok(/pseudoscience|no demonstrated/i.test(reading.meta.framing) && reading.meta.framing === HONEST_FRAMING,
   'fullReading carries the canonical HONEST_FRAMING');
ok(reading.moment.planets.Sun.antiscion.lon === antiscion(eChart.planets.Sun.lon),
   'fullReading reuses antiscion (not re-derived)');
ok(['green', 'amber', 'red'].includes(reading.cautions.verdict), 'fullReading.cautions has a verdict');
ok(reading.dignities.lordOfGeniture.planet && typeof reading.dignities.lordOfGeniture.score === 'number',
   'fullReading reports the Lord of the Geniture');
ok(reading.election.rankedNow.length === OPERATIONS.length, 'fullReading.election ranks every operation');
const readingH = fullReading(eChart, { quesitedHouse: 7 });
ok(readingH.horary && readingH.horary.quesitedHouse === 7 && readingH.horary.perfection &&
   'modes' in readingH.horary.perfection, 'fullReading: quesitedHouse populates the horary block');
const readingN = fullReading(eChart, { birth: { chart: natal } });
ok(readingN.natal && readingN.natal.trajectory && Array.isArray(readingN.natal.trajectory.timeline) &&
   readingN.natal.trajectory.timeline.length > 0, 'fullReading: birth chart populates the natal/trajectory block');
import { antiscion } from '../assets/js/core/astro.js';

// --- Capability registry: anti-drift sync test (Phase A2) ------------------
import { REGISTRY, allExports, toToolSchema, OP_KEYS, callableEntries } from '../assets/js/core/registry.js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

ok(JSON.stringify(OP_KEYS) === JSON.stringify(OPERATIONS.map(o => o.key)),
   'registry OP_KEYS matches election.js OPERATIONS');

let regExportFails = 0;
for (const { module, exportName, id } of allExports()) {
  if (!existsSync(resolve(REPO_ROOT, module))) { console.log(`  ✗ registry[${id}]: module missing ${module}`); regExportFails++; continue; }
  let mod;
  try { mod = await import('../' + module); } catch (e) { console.log(`  ✗ registry[${id}]: import failed ${module} (${e.message})`); regExportFails++; continue; }
  if (!(exportName in mod)) { console.log(`  ✗ registry[${id}]: ${module} has no export "${exportName}"`); regExportFails++; }
}
ok(regExportFails === 0, `every registry export resolves (${allExports().length} checked)`);

let regLinkFails = 0;
for (const e of REGISTRY) {
  for (const pg of (e.pages || [])) if (!existsSync(resolve(REPO_ROOT, pg))) { console.log(`  ✗ registry[${e.id}]: page missing ${pg}`); regLinkFails++; }
  if (e.howItWorks) {
    const [file, anchor] = e.howItWorks.split('#');
    if (!existsSync(resolve(REPO_ROOT, file))) { console.log(`  ✗ registry[${e.id}]: hiw file missing ${file}`); regLinkFails++; }
    else if (anchor && !readFileSync(resolve(REPO_ROOT, file), 'utf8').includes(`id="${anchor}"`)) { console.log(`  ✗ registry[${e.id}]: anchor #${anchor} not found`); regLinkFails++; }
  }
}
ok(regLinkFails === 0, 'every registry page & how-it-works anchor resolves');

import { GLOSSARY } from '../assets/js/core/data/glossary.js';
const TERMS = new Set(GLOSSARY.map(g => g.term));
let regTermFails = 0;
for (const e of REGISTRY) for (const t of (e.glossaryTerms || [])) if (!TERMS.has(t)) { console.log(`  ✗ registry[${e.id}]: glossary term not found: "${t}"`); regTermFails++; }
ok(regTermFails === 0, 'every registry glossary term exists in GLOSSARY');

const toolSchema = toToolSchema();
ok(toolSchema.length === callableEntries().length && toolSchema.every(t => t.function && t.function.name && t.function.parameters),
   `toToolSchema well-formed for every callable capability (${toolSchema.length})`);

// --- Share-state helpers: pure encode/decode round-trip (Phase A3) ---------
import { encodeState, decodeState } from '../assets/js/app/state.js';
const st = { date: '2026-06-25', time: '12:00', lat: '51.5074', lon: '-0.1278', empty: '', nil: null };
const enc = encodeState(st);
const dec = decodeState('?' + enc);
ok(!/empty=|nil=/.test(enc), 'encodeState drops empty/null values');
ok(dec.date === '2026-06-25' && dec.lat === '51.5074' && !('empty' in dec), 'decodeState round-trips the kept keys');

// --- Local-LLM context bridge (Phase B1) -----------------------------------
import { HONEST_SYSTEM_PREAMBLE, buildContext, buildToolSchema, runTool, toolNames } from '../assets/js/core/llm-context.js';
import { HONEST_FRAMING as HF } from '../assets/js/core/reading.js';
ok(HONEST_SYSTEM_PREAMBLE.includes(HF), 'LLM preamble embeds the canonical HONEST_FRAMING');
const ctx = buildContext(fullReading(eChart, { quesitedHouse: 7 }));
ok(/pseudoscience|no demonstrated/i.test(ctx.system) && /never\s+prescribe/i.test(ctx.system), 'buildContext system locks the honest framing');
ok(ctx.facts.length > 0 && ctx.facts.every(f => typeof f.text === 'string'), 'buildContext returns labelled facts');
ok(/Ascendant|Chart-health verdict/i.test(ctx.system), 'buildContext system carries the computed facts');
ok(Array.isArray(ctx.glossary) && ctx.glossary.length > 0, 'buildContext includes a relevant glossary');
const tools = buildToolSchema();
ok(tools.length >= 10 && tools.every(t => t.function && t.function.name && t.function.parameters), 'buildToolSchema is well-formed');
ok(toolNames().includes('electionScore') && toolNames().includes('rankNow'), 'toolNames lists the callable tools');
const tElect = runTool('electionScore', { operationKey: 'love' }, { chart: eChart });
ok(['green', 'amber', 'red'].includes(tElect.verdict) && Array.isArray(tElect.reasons), 'runTool(electionScore) returns a verdict + reasons');
ok(runTool('mansionOf', { lon: 210 }).num >= 1, 'runTool(mansionOf) returns a mansion');
ok(Array.isArray(runTool('rankNow', {}, { chart: eChart })), 'runTool(rankNow) returns ranked aims');
let threw = false; try { runTool('definitely-not-a-tool', {}); } catch { threw = true; }
ok(threw, 'runTool refuses an unknown tool');

// Claude tool format + the codex / operation meta-prompts (Phase 5/6)
import { toAnthropicTools, buildCodexPrompt, buildOperationPrompt, SITE_URLS } from '../assets/js/core/llm-context.js';
const aTools = toAnthropicTools();
ok(aTools.length >= 10 && aTools.every(t => t.name && t.description && t.input_schema), 'toAnthropicTools maps to {name,description,input_schema}');
const codex = buildCodexPrompt(fullReading(eChart, { birth: { chart: natal } }));
ok(/Codex of this Hour/i.test(codex) && /never prescribed|no demonstrated efficacy/i.test(codex), 'buildCodexPrompt is Hermetic + keeps the honest caveat');
ok(/Lord of the Year|life trajectory/i.test(codex), 'buildCodexPrompt includes the natal section when birth data present');
const opPrompt = buildOperationPrompt(fullReading(eChart), 'when is the next best time to attempt to call rain, and how would the tradition do it?');
ok(/findNextElection/.test(opPrompt) && opPrompt.includes(SITE_URLS.workbench), 'buildOperationPrompt directs tool use + cites the live tool');
ok(/never a recommendation|no demonstrated efficacy/i.test(opPrompt), 'buildOperationPrompt keeps the honest caveat');

console.log(`\n[engine-test] ${fails ? fails + ' FAILED' : 'all passed'}`);
process.exit(fails ? 1 : 0);
