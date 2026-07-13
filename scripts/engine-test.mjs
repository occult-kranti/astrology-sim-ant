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
ok(reading.vedic && reading.vedic.lagna && reading.vedic.ashtakavarga.savTotal === 337, 'fullReading includes the Vedic (sidereal) block with SAV 337');
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

// --- Vedic (Jyotiṣa) engine ------------------------------------------------
import { castVedic } from '../assets/js/core/vedic.js';
import { vargaSign, lahiriAyanamsa, nakshatraOf, RASHIS } from '../assets/js/core/data/vedic-data.js';
// ayanamsa sanity: ~24.2° for 2026
ok(Math.abs(lahiriAyanamsa(new Date(Date.UTC(2026, 5, 25))) - 24.22) < 0.05, `Lahiri ayanamsa ~24.22° in 2026 (got ${lahiriAyanamsa(new Date(Date.UTC(2026,5,25))).toFixed(3)})`);
// nakshatra boundaries
ok(nakshatraOf(0).num === 1 && nakshatraOf(0).pada === 1, 'nakshatraOf(0) = Ashwini pada 1');
ok(nakshatraOf(359.9).num === 27, 'nakshatraOf(359.9) = Revati (27)');
// varga rules — the book's own unit-test vectors (sidereal longitudes)
ok(vargaSign(71, 9) === 9, 'D9 of 11° Gemini → Capricorn (book vector)');
ok(vargaSign(229, 9) === 8, 'D9 of 19° Scorpio → Sagittarius (book vector)');
ok(vargaSign(70, 10) === 5, 'D10 of 10° Gemini → Virgo (book vector)');
ok(vargaSign(229, 10) === 9, 'D10 of 19° Scorpio → Capricorn (book vector)');
ok(vargaSign(71, 24) === 0, 'D24 of 11° Gemini → Aries (book vector)');
ok(vargaSign(229, 24) === 6, 'D24 of 19° Scorpio → Libra (book vector)');
ok(vargaSign(222.9667, 60) === 8, 'D60 of 12°58′ Scorpio → Sagittarius (book vector)');
// full reading on the natal chart
const vd = castVedic(natal, { currentDate: new Date(Date.UTC(2026, 5, 25)) });
ok(vd.system === 'vedic' && vd.lagna && vd.grahas && vd.panchanga && vd.vimshottari && vd.vargas && vd.ashtakavarga, 'castVedic returns all blocks');
ok(Object.keys(vd.grahas).length === 9, 'castVedic has all 9 grahas');
ok(vd.grahas.Sun.nakshatra && vd.grahas.Sun.dignity && vd.grahas.Sun.house >= 1 && vd.grahas.Sun.house <= 12, 'each graha has nakshatra, dignity, whole-sign house');
ok(vd.ashtakavarga.savTotal === 337, `Ashtakavarga SAV checksum = 337 (got ${vd.ashtakavarga.savTotal})`);
ok(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(vd.vimshottari.startLord), 'Vimśottarī start lord is a graha');
ok(vd.vimshottari.balanceYears > 0 && vd.vimshottari.maha.filter(m => m.current).length === 1, 'Vimśottarī has a positive balance & exactly one current mahā');
ok(vd.panchanga.tithi.num >= 1 && vd.panchanga.tithi.num <= 30 && vd.panchanga.yoga.num >= 1 && vd.panchanga.yoga.num <= 27, 'panchanga tithi 1–30 & yoga 1–27');
ok(Array.isArray(vd.yogas) && vd.yogas.length >= 4, 'yogas detected');
let vdRound = false; try { vdRound = !!JSON.parse(JSON.stringify(vd)).lagna; } catch { vdRound = false; }
ok(vdRound, 'castVedic is JSON-serializable');

// --- Geomancy (the Shield Chart) -------------------------------------------
import { GEOMANTIC_FIGURES, figureByRows, EVEN_FIGURES } from '../assets/js/core/data/geomantic-figures.js';
import { addFigures, mothersFromTallies, castShield, castFromTallies, geomancyHouses, geomanticJudgement } from '../assets/js/core/geomancy.js';
ok(GEOMANTIC_FIGURES.length === 16, `16 geomantic figures (got ${GEOMANTIC_FIGURES.length})`);
ok(new Set(GEOMANTIC_FIGURES.map(f => f.rows.join(''))).size === 16, 'all 16 figures have a distinct dot-pattern (a complete bijection)');
ok(figureByRows([1, 1, 1, 1]).key === 'via' && figureByRows([2, 2, 2, 2]).key === 'populus', 'Via=1111, Populus=2222');
ok(figureByRows([1, 2, 2, 1]).key === 'carcer' && figureByRows([2, 1, 1, 2]).key === 'coniunctio', 'Carcer=1221, Coniunctio=2112 (the non-trivial palindromes)');
ok(EVEN_FIGURES.length === 8, `exactly 8 even figures can stand as Judge (got ${EVEN_FIGURES.length})`);
// reverse-pairs are involutions
ok(GEOMANTIC_FIGURES.every(f => figureByRows(GEOMANTIC_FIGURES.find(g => g.key === f.reversedOf).rows).reversedOf === f.key), 'reversedOf is an involution (a↔b)');
// addFigures parity rule: 1+1->2 (even), 1+2->1 (odd), 2+2->2
ok(addFigures(figureByRows([1, 1, 1, 1]), figureByRows([1, 1, 1, 1])).rows.join('') === '2222', 'addFigures(Via,Via) = Populus (1+1 even → double)');
ok(addFigures(figureByRows([1, 1, 1, 1]), figureByRows([2, 2, 2, 2])).rows.join('') === '1111', 'addFigures(Via,Populus) = Via (1+2 odd → single)');
// the Judge-is-always-even theorem (geomancy's checksum) over many casts
let judgeOdd = 0;
for (let s = 0; s < 500; s++) { const sh = castFromTallies(Array.from({ length: 16 }, (_, i) => s * 7 + i * 13 + (i % 5))); if (!sh.judge.even) judgeOdd++; }
ok(judgeOdd === 0, `the Judge is ALWAYS an even figure over 500 casts (odd Judges: ${judgeOdd})`);
const gsh = castShield(mothersFromTallies([3, 5, 2, 8, 1, 4, 7, 2, 9, 3, 6, 1, 2, 2, 5, 4]));
ok(gsh.daughters.length === 4 && gsh.nieces.length === 4 && gsh.judge && gsh.reconciler, 'castShield returns daughters, nieces, judge & reconciler');
ok(gsh.daughters[0].rows.join('') === [gsh.mothers[0].rows[0], gsh.mothers[1].rows[0], gsh.mothers[2].rows[0], gsh.mothers[3].rows[0]].join(''), 'Daughter 1 is the transposition of the Mothers’ heads');
ok(geomancyHouses(gsh).length === 12, 'geomancyHouses lays 12 figures');
const gj = geomanticJudgement(gsh, 7);
ok(['affirmed', 'qualified', 'denied'].includes(gj.tone) && gj.querentFigure && gj.quesitedFigure && Array.isArray(gj.lines), 'geomanticJudgement returns a tone + significators + lines');
// a self-question (the topic IS the querent's house) must NOT fire spurious perfection
const gjSelf = geomanticJudgement(gsh, 1);
ok(gjSelf.perfection.length === 0 && gjSelf.perfects === false && /querent themselves/i.test(gjSelf.toneText), 'a 1st-house self-question skips spurious perfection and is judged on the Judge + house figure');
// over high-entropy casts, self-questions must span all tones — not the old
// 100%-affirmed degeneracy, and not a never-affirmed one either. The shield is
// LINEAR over GF(2) (figure addition is XOR), so structured seeds collapse the
// Judge; we drive it with a seeded LCG stream (deterministic, high-entropy).
let _lcg = 123456789 >>> 0;
const lcg16 = () => { _lcg = (Math.imul(_lcg, 1103515245) + 12345) >>> 0; return (_lcg >>> 16) % 16 + 1; };
const selfTones = { affirmed: 0, qualified: 0, denied: 0 };
for (let s = 0; s < 600; s++) selfTones[geomanticJudgement(castFromTallies(Array.from({ length: 16 }, lcg16)), 1).tone]++;
ok(selfTones.affirmed > 60 && selfTones.denied > 20 && selfTones.qualified > 60, `self-questions span all tones, not the old always-affirmed degeneracy (${JSON.stringify(selfTones)})`);

// --- Tarot (the spread) -----------------------------------------------------
import { TAROT_DECK, cardById, SUITS, MAJORS, MINORS } from '../assets/js/core/data/tarot-deck.js';
import { SPREADS, SPREAD_KEYS, elementalDignity, drawSpread, tarotReading } from '../assets/js/core/tarot.js';
ok(TAROT_DECK.length === 78, `78-card deck (got ${TAROT_DECK.length})`);
ok(MAJORS.length === 22 && MINORS.length === 56, `22 majors + 56 minors (got ${MAJORS.length}+${MINORS.length})`);
ok(new Set(TAROT_DECK.map(c => c.id)).size === 78, 'all 78 card ids are distinct');
ok(['wands', 'cups', 'swords', 'pentacles'].every(s => MINORS.filter(c => c.suit === s).length === 14), 'each suit has 14 cards (Ace–Ten + 4 courts)');
ok(MINORS.every(c => ['Fire', 'Water', 'Air', 'Earth'].includes(c.element)), 'every minor card carries a capitalised suit-element');
ok(cardById('the-fool').number === 0 && cardById('the-world').number === 21, 'Fool=0, World=21');
ok(elementalDignity('Fire', 'Fire').relation === 'reinforce', 'like elements reinforce');
ok(elementalDignity('Fire', 'Air').relation === 'strengthen' && elementalDignity('Fire', 'Water').relation === 'weaken', 'Fire+Air friendly, Fire+Water contrary');
ok(SPREAD_KEYS.length >= 4 && SPREADS.celticCross.count === 10, 'spreads include the 10-card Celtic Cross');
const tdraws = [{ id: 'the-tower', reversed: false }, { id: 'wands-ace', reversed: true }, { id: 'cups-two', reversed: false }];
const tr = tarotReading('three', tdraws, { question: 'a test' });
ok(tr.cards.length === 3 && tr.cards[1].reversed === true && tr.dignities.length === 2, 'tarotReading lays 3 cards, honours reversal, reads 2 dignities');
ok(tr.balance && typeof tr.balance.majors === 'number' && Array.isArray(tr.summaryLines), 'tarotReading reports a balance + summary');
let tThrew = false; try { drawSpread('three', [{ id: 'the-fool', reversed: false }]); } catch { tThrew = true; }
ok(tThrew, 'drawSpread refuses a wrong-length draw');
// the Celtic Cross "crossing" card (position 2, rotated) is always read upright
const cc = drawSpread('celticCross', TAROT_DECK.slice(0, 10).map(c => ({ id: c.id, reversed: true })));
ok(cc.cards[1].reversed === false && cc.cards[0].reversed === true, 'the Celtic Cross crossing card is never reversed (read upright either way)');

// --- I Ching (the Book of Changes) -----------------------------------------
import { HEXAGRAMS, TRIGRAMS, hexagramByLines, hexagramByNum, trigramByLines } from '../assets/js/core/data/iching-hexagrams.js';
import { linesFromThrows, castReading, relatingHexagram, nuclearHexagram, trigramsOf } from '../assets/js/core/iching.js';
ok(HEXAGRAMS.length === 64 && TRIGRAMS.length === 8, `64 hexagrams + 8 trigrams (got ${HEXAGRAMS.length}+${TRIGRAMS.length})`);
ok(new Set(HEXAGRAMS.map(h => h.lines.join(''))).size === 64, 'all 64 hexagrams have a distinct 6-line pattern (a complete bijection)');
ok(HEXAGRAMS.every(h => h.lines.length === 6 && h.lineTexts.length === 6), 'every hexagram has 6 lines and 6 line-texts');
ok(hexagramByNum(1).lines.join('') === '111111' && hexagramByNum(2).lines.join('') === '000000', '#1 Qian all-yang, #2 Kun all-yin');
ok(hexagramByLines([1, 1, 1, 0, 0, 0]).num === 11 && hexagramByLines([0, 0, 0, 1, 1, 1]).num === 12, 'Earth-over-Heaven=11 (Peace), Heaven-over-Earth=12 (Standstill)');
ok(TRIGRAMS.every(t => t.lines.length === 3) && trigramByLines([1, 1, 1]).key === 'qian' && trigramByLines([0, 0, 0]).key === 'kun', 'trigrams: qian=111, kun=000');
// the asymmetric trigrams must be bottom-to-top canonical (zhen=100, gen=001, xun=011, dui=110)
ok(trigramByLines([1, 0, 0]).key === 'zhen' && trigramByLines([0, 0, 1]).key === 'gen' && trigramByLines([0, 1, 1]).key === 'xun' && trigramByLines([1, 1, 0]).key === 'dui', 'asymmetric trigrams canonical: zhen=100, gen=001, xun=011, dui=110');
// every hexagram's DERIVED trigrams (from its lines) must match its named lower/upper
ok(HEXAGRAMS.every(h => { const t = trigramsOf(h.lines); return t.lower && t.upper && t.lower.key === h.lower && t.upper.key === h.upper; }), 'every hexagram’s derived trigrams match its named lower/upper fields');
// throws → lines/changing
const thr = linesFromThrows([9, 7, 8, 6, 7, 8]);
ok(thr.lines.join('') === '110010' && thr.changing.map(c => c ? 1 : 0).join('') === '100100', 'linesFromThrows: 9,7,8,6,7,8 → lines 110010, changing 100100');
let icThrew = false; try { linesFromThrows([5, 7, 8, 6, 7, 8]); } catch { icThrew = true; }
ok(icThrew, 'linesFromThrows rejects an out-of-range throw');
// a full reading + relating/nuclear correctness
const icr = castReading(thr.lines, thr.changing);
const flipped = thr.lines.map((l, i) => (thr.changing[i] ? (l ? 0 : 1) : l));
ok(icr.relating && icr.relating.num === hexagramByLines(flipped).num, 'relating hexagram = the primary with moving lines flipped');
ok(nuclearHexagram([1, 1, 1, 1, 1, 1]).num === 1 && nuclearHexagram([0, 0, 0, 0, 0, 0]).num === 2, 'nuclear of Qian=Qian, of Kun=Kun');
ok(icr.moving.length === 2 && icr.moving.every(m => m.text) && Array.isArray(icr.lines_out), 'castReading reports the moving lines + cited lines');
const icNoMove = castReading([1, 1, 1, 1, 1, 1], [false, false, false, false, false, false]);
ok(icNoMove.relating === null && /stable/i.test(icNoMove.guidance), 'no moving lines → no relating hexagram, stable guidance');

// --- Divination LLM context (the diviner bridge) ---------------------------
import { buildGeomancyContext, buildTarotContext, buildIchingContext, buildGeomancyInterpretPrompt, buildTarotInterpretPrompt, buildIchingInterpretPrompt, geomancyDataBlock, tarotDataBlock, ichingDataBlock, DIVINER_PREAMBLE, buildJungContext, buildJungInterpretPrompt, jungDataBlock, JUNG_PREAMBLE } from '../assets/js/core/llm-context.js';
const gctx = buildGeomancyContext({ kind: 'geomancy', question: 'a test', quesitedHouse: 7, shield: gsh, judgement: gj, houses: geomancyHouses(gsh) });
ok(/pseudoscience|no demonstrated/i.test(gctx.system) && /never\s+prescribe|describe/i.test(gctx.system), 'buildGeomancyContext keeps the honest framing');
ok(gctx.facts.length > 0 && /Judge/i.test(gctx.system), 'buildGeomancyContext grounds the Judge + facts');
ok(gctx.glossary.length > 0 && DIVINER_PREAMBLE.length > 0, 'buildGeomancyContext pulls the geomancy glossary + diviner persona');
const tctx = buildTarotContext({ kind: 'tarot', question: 'a test', spreadKey: 'three', reading: tr });
ok(/pseudoscience|no demonstrated/i.test(tctx.system) && /Tower|Ace of Wands/i.test(tctx.system), 'buildTarotContext keeps the framing + grounds the drawn cards');
ok(/describe|never\s+predict|history/i.test(buildGeomancyInterpretPrompt({ judgement: gj, shield: gsh })) , 'geomancy interpret prompt keeps the caveat');
ok(/Golden Dawn|elemental/i.test(buildTarotInterpretPrompt(tr)) && /never invent|interpret THESE/i.test(geomancyDataBlock({ judgement: gj, shield: gsh, houses: [] })), 'tarot interpret + geomancy data block well-formed');
ok(/interpret THESE cards/i.test(tarotDataBlock({ reading: tr })), 'tarot data block is well-formed');
const ictx = buildIchingContext({ kind: 'iching', question: 'a test', reading: icr });
ok(/pseudoscience|no demonstrated/i.test(ictx.system) && /Hexagram|Judgment/i.test(ictx.system), 'buildIchingContext keeps the framing + grounds the hexagram');
ok(/Yijing|hexagram|never\s+predict|describe/i.test(buildIchingInterpretPrompt(icr)) && /interpret THIS hexagram/i.test(ichingDataBlock({ reading: icr })), 'iching interpret prompt + data block well-formed');
// the first-person "Jung reads it himself" bridge (self-contained — the Jung
// engine block is defined later in the file; import bindings are hoisted)
const _jChart = castChart(new Date(Date.UTC(1875, 6, 26, 19, 32) - JUNG_BIRTH.utcOffset * 3600000), JUNG_BIRTH.lat, JUNG_BIRTH.lon, 'regiomontanus');
const _jr = jungianReading(_jChart);
const jungObj = { kind: 'jung', name: 'C. G. Jung', isJung: true, reading: _jr, asc: formatLon(_jChart.asc), mc: formatLon(_jChart.mc), ascSign: signOf(_jChart.asc).name, mcSign: signOf(_jChart.mc).name };
const jungCtx = buildJungContext(jungObj);
ok(/first person|as Carl Gustav Jung|as C\. G\. Jung|reconstruction/i.test(jungCtx.system) && /pseudoscience|no demonstrated/i.test(jungCtx.system), 'buildJungContext installs the first-person Jung persona ON the honest framing');
ok(jungCtx.facts.length > 5 && /Sol.?Luna|Ascendant/i.test(jungCtx.system) && jungCtx.glossary.length > 0, 'buildJungContext grounds the positions + pulls the Jung glossary');
const jungPrompt = buildJungInterpretPrompt(jungObj);
ok(/first person|CODEBOOK/i.test(jungPrompt) && /coniunctio/i.test(jungPrompt) && /honest word|synchronicity/i.test(jungPrompt) && /\*\*0\./.test(jungPrompt) && /\*\*10\./.test(jungPrompt), 'the Jung codebook prompt is first-person + step-by-step (0–10) + keeps the honest close');
ok(/interpret THESE positions as Jung/i.test(jungDataBlock(jungObj)) && JUNG_PREAMBLE.length > 400, 'jung data block + persona are well-formed');
// the cite-bound output contract: numbered facts + the [F#] tagging rule
ok(/\[F1\]/.test(ctx.system) && /OUTPUT CONTRACT/i.test(ctx.system), 'buildContext numbers the facts [F1..] and appends the cite-bound contract');
ok(/\[F1\]/.test(gctx.system) && /OUTPUT CONTRACT/i.test(gctx.system) && /\[F1\]/.test(jungCtx.system), 'the divination & Jung contexts are cite-bound too');

// --- Jung: the psychological horoscope, synastry & the aeon clock ------------
import { jungianReading, crossAspects, jungAspectHits, experimentBatch as jungBatch, expectedRate as jungRate, aeonClock, JUNG_BIRTH, JUNG_MARRIAGE_ASPECTS, PLATONIC_MONTH } from '../assets/js/core/jung.js';
import { JUNG_TIMELINE, JUNG_EXPERIMENT, JUNG_PLANET_ARCHETYPES } from '../assets/js/core/data/jung-astrology.js';
// Jung's own nativity reproduces the published figures (Baumann-Jung 1975)
const jungUTC = new Date(Date.UTC(1875, 6, 26, 19, 32) - JUNG_BIRTH.utcOffset * 3600000);
const jungChart = castChart(jungUTC, JUNG_BIRTH.lat, JUNG_BIRTH.lon, 'regiomontanus');
ok(signOf(jungChart.planets.Sun.lon).name === 'Leo' && signOf(jungChart.planets.Moon.lon).name === 'Taurus' && signOf(jungChart.asc).name === 'Aquarius',
   `Jung's nativity: Sun Leo, Moon Taurus, Asc Aquarius (got ${signOf(jungChart.planets.Sun.lon).name}/${signOf(jungChart.planets.Moon.lon).name}/${signOf(jungChart.asc).name})`);
const jr = jungianReading(jungChart);
ok(jr.planets.length === 7 && jr.planets.every(p => p.archetype && p.cite), 'jungianReading: 7 planets, each with archetype + citation');
ok(jr.coniunctio.aspect === 'Square', `Jung's famous Sol–Luna square is detected (got ${jr.coniunctio.aspect})`);
ok(jr.elements.dominant && jr.elements.inferior && /post-Jungian|Greene|Arroyo/i.test(jr.caveat), 'jungianReading reports the function balance + flags post-Jungian doctrine');
// synastry: an exact-conjunction control
const b1 = castChart(new Date(Date.UTC(1980, 0, 1, 12)), 51.5, 0, 'regiomontanus');
const cross11 = crossAspects(b1, b1);
ok(cross11.some(h => h.from === 'Sun' && h.to === 'Sun' && h.aspect === 'Conjunction' && h.orb < 0.01), 'crossAspects: a chart against itself yields exact conjunctions');
ok(jungAspectHits(b1, b1).length === 3 && jungAspectHits(b1, b1).every(h => typeof h.present === 'boolean'), 'jungAspectHits reports the three classic marriage aspects');
ok(JUNG_MARRIAGE_ASPECTS.length === 3 && JUNG_EXPERIMENT.batches.length === 3 && JUNG_EXPERIMENT.totalPairs === JUNG_EXPERIMENT.batches.reduce((s, b) => s + b.pairs, 0), 'experiment data: 3 batches summing to the total pairs');
// the null model: rate ≈ 2·orb/360, and the batch simulator stays near it
ok(Math.abs(jungRate(8) - 16 / 360) < 1e-12, 'expectedRate(8°) = 16/360');
let js = 99 >>> 0; const jrand = () => { js = (Math.imul(js, 1103515245) + 12345) >>> 0; return (js >>> 16) / 65536; };
const jb = jungBatch(jrand, { pairs: 4000 });
ok(Math.abs(jb.rates.moonMoon - jungRate(8)) < 0.02, `null model: Moon☌Moon rate ≈ ${(jungRate(8) * 100).toFixed(1)}% (got ${(jb.rates.moonMoon * 100).toFixed(1)}%)`);
let jThrew = false; try { jungBatch(null); } catch { jThrew = true; }
ok(jThrew, 'experimentBatch refuses to run without an injected rand');
// the aeon clock
const ae = aeonClock(new Date(Date.UTC(2026, 6, 1)));
ok(Math.abs(PLATONIC_MONTH - 2147.7) < 1, `Platonic month ≈ 2148 yr (got ${PLATONIC_MONTH.toFixed(1)})`);
ok(ae.inPisces && ae.pctThroughPisces > 70 && ae.pctThroughPisces < 95, `the vernal point is late in Pisces (${ae.pctThroughPisces}%)`);
ok(ae.aquariusYearLahiri > 2300 && ae.aquariusYearLahiri < 2600 && ae.datings.length >= 3, `Lahiri Aquarius entry in the 25th century (got AD ${ae.aquariusYearLahiri}) + the competing datings listed`);
ok(JUNG_TIMELINE.length >= 10 && JUNG_TIMELINE.every(e => e.cite && e.text && e.kind), 'the Jung timeline entries all carry citations');
ok(JUNG_PLANET_ARCHETYPES.length === 7, 'seven planetary archetypes');

// --- the planetary kameas & sigils -------------------------------------------
import { KAMEAS, kameaByPlanet } from '../assets/js/core/data/kameas.js';
import { validateKamea, sigilFor, letterValues, reduceToCell } from '../assets/js/core/kamea.js';
ok(KAMEAS.length === 7, `7 planetary kameas (got ${KAMEAS.length})`);
ok(KAMEAS.every(k => validateKamea(k.rows).ok), 'EVERY kamea grid is a valid magic square (rows/columns/diagonals + 1..n² bijection)');
ok(KAMEAS.every(k => validateKamea(k.rows).constant === k.magicConstant && validateKamea(k.rows).total === k.totalSum), 'every kamea’s stated constant & total match the computed ones');
ok(kameaByPlanet('Saturn').magicConstant === 15 && kameaByPlanet('Sun').totalSum === 666 && kameaByPlanet('Moon').magicConstant === 369, 'anchor constants: Saturn 15, Sun total 666, Moon 369');
ok(kameaByPlanet('Venus').spirit.value === 175 && /157|misprint|transposition/i.test(kameaByPlanet('Venus').sealNote || '') , 'Kedemel = 175 with the 1651 misprint flagged in-record');
ok(kameaByPlanet('Moon').spiritOfSpirits && kameaByPlanet('Moon').spiritOfSpirits.value === 3321 && /corrupt/i.test(kameaByPlanet('Moon').intelligence.note || ''), 'the Moon’s three names carried, its corrupt printed Hebrew flagged');
ok(reduceToCell(300, 9) === 3 && reduceToCell(45, 9) === 9, 'reduceToCell collapses powers of ten then digit-sums (300→3; 45→9)');
const sig = sigilFor('GABRIEL', kameaByPlanet('Moon'));
ok(sig.steps.length === 7 && sig.steps[0].cellValue === 7 && sig.steps[6].cellValue === 12, 'sigilFor(GABRIEL, Moon) traces deterministically (G→7 … L→12)');
const sigRep = sigilFor('AAB', kameaByPlanet('Saturn'));
ok(sigRep.steps.length === 2 && sigRep.steps[0].repeats === 2, 'a repeated cell collapses into one step with a repeat marker');
ok(/modern|Latin/i.test(sig.methodNote) && /Hebrew|gematria/i.test(sig.note), 'the sigil result flags the Latin adaptation honestly');
ok(letterValues('AZ', 'aiq').map(l => l.value).join(',') === '1,800', 'aiq-style ladder: A=1, Z=800');

// --- the AI oracle tools (randomness injected by the caller, never the core) -
const oracleNames = ['castGeomancy', 'drawTarot', 'castIChing'];
ok(oracleNames.every(n => toolNames().includes(n)), 'toolNames lists the three oracle tools');
ok(oracleNames.every(n => buildToolSchema().some(t => t.function.name === n && /no demonstrated validity/i.test(t.function.description))), 'oracle tool schemas exist and carry the honest framing');
let seed = 42 >>> 0; const testRand = n => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 16) % n; };
const gTool = runTool('castGeomancy', { quesitedHouse: 7 }, { rand: testRand });
ok(['affirmed', 'qualified', 'denied'].includes(gTool.tone) && gTool.judge && gTool.mothers.length === 4, 'runTool(castGeomancy) casts and judges via ctx.rand');
const gFixed = runTool('castGeomancy', { quesitedHouse: 7, tallies: [3, 5, 2, 8, 1, 4, 7, 2, 9, 3, 6, 1, 2, 2, 5, 4] }, {});
ok(gFixed.judge.includes('Gain'), `castGeomancy with explicit tallies is deterministic (judge: ${gFixed.judge})`);
const tTool = runTool('drawTarot', { spreadKey: 'three' }, { rand: testRand });
ok(tTool.cards.length === 3 && tTool.cards.every(c => c.card && c.position), 'runTool(drawTarot) lays a 3-card spread via ctx.rand');
const iTool = runTool('castIChing', { throws: [9, 7, 8, 6, 7, 8] }, {});
ok(iTool.primary.num === 60 && iTool.moving.length === 2 && iTool.relating, 'castIChing with explicit throws is deterministic (9,7,8,6,7,8 → #60 with 2 moving lines)');
let oracleThrew = false; try { runTool('castGeomancy', {}, {}); } catch { oracleThrew = true; }
ok(oracleThrew, 'oracle tools refuse to run without a caller-supplied random source or explicit input');

// ============================================================================
//  THE GOLDEN EXAMPLE CASE — one fixed, externally-verifiable scenario run
//  through the WHOLE pipeline, so "the tools, the calculations and the results"
//  are provably right end-to-end:
//    moment  = J2000.0 (2000-01-01 12:00 UTC) at London — the epoch every
//              ephemeris publishes, so the positions are checkable anywhere;
//    natal   = C. G. Jung's nativity — externally published (Baumann-Jung 1975);
//    horary  = a 7th-house question;  plus the Vedic block and the plain-words
//              AI codebook over the composed reading.
// ============================================================================
import { buildPlainReadingPrompt, PLAIN_STRUCTURE, PLAIN_CODA } from '../assets/js/core/llm-context.js';
import { horaryJudgement } from '../assets/js/core/horary-judge.js';
// lahiriAyanamsa, annualProfection and ageBetween are already imported above.
const goldenProfection = annualProfection, goldenAge = ageBetween;

const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0));
const golden = castChart(J2000, 51.5074, -0.1278, 'regiomontanus');
// External fact 1: the Sun's apparent ecliptic longitude at J2000.0 ≈ 280.37°
// (10° Capricorn) — published in every almanac.
ok(Math.abs(golden.planets.Sun.lon - 280.37) < 0.3, `GOLDEN: Sun at J2000 ≈ 280.37° (got ${golden.planets.Sun.lon.toFixed(2)}°)`);
ok(signOf(golden.planets.Sun.lon).name === 'Capricorn', 'GOLDEN: Sun in Capricorn at J2000');
// External fact 2: the Lahiri ayanāṁśa at 2000.0 ≈ 23°51′ = 23.85°.
ok(Math.abs(lahiriAyanamsa(J2000) - 23.85) < 0.06, `GOLDEN: Lahiri ayanāṁśa at J2000 ≈ 23.85° (got ${lahiriAyanamsa(J2000).toFixed(3)}°)`);
// External fact 3: Jung's natal signs (already proven above) feed the natal leg.
// Internal arithmetic that must hold exactly:
ok(goldenAge(new Date(Date.UTC(1875, 6, 26, 18, 55)), J2000) === 124, 'GOLDEN: Jung’s completed age at J2000 = 124');
ok(goldenProfection(_jChart, 124).activatedHouse === 5, 'GOLDEN: profection at age 124 → the 5th house (124 mod 12 = 4 signs on)');
// The composed reading with EVERY block:
const goldenReading = fullReading(golden, { quesitedHouse: 7, birth: { chart: _jChart } });
ok(goldenReading.moment && goldenReading.dignities && goldenReading.aspects && goldenReading.lots &&
   goldenReading.cautions && goldenReading.election && goldenReading.talisman && goldenReading.horary &&
   goldenReading.natal && goldenReading.vedic, 'GOLDEN: fullReading composes every block (figure→talisman + horary + natal + vedic)');
ok(['green', 'amber', 'red'].includes(goldenReading.cautions.verdict), 'GOLDEN: chart-health verdict valid');
ok(goldenReading.horary.quesitedHouse === 7 && goldenReading.horary.querent && 'modes' in goldenReading.horary.perfection, 'GOLDEN: the horary block carries significators + perfection for house 7');
ok(['affirmed', 'qualified', 'denied'].includes(horaryJudgement(golden, 7).tone), 'GOLDEN: the house-by-house judgement gives a valid tone');
ok(goldenReading.natal.trajectory.currentYear.age === 124, 'GOLDEN: the natal leg reads Jung at age 124');
ok(goldenReading.vedic.ashtakavarga.savTotal === 337, 'GOLDEN: the Vedic SAV checksum holds (337)');
let goldenRT = false; try { goldenRT = !!JSON.parse(JSON.stringify(goldenReading)).meta; } catch { goldenRT = false; }
ok(goldenRT, 'GOLDEN: the composed reading is JSON-serializable');
// The plain-words AI codebook over the golden reading:
const plain = buildPlainReadingPrompt(goldenReading);
ok((plain.match(/\*\*\d+\./g) || []).length === 12, `GOLDEN: the plain-words codebook has 12 steps for the full reading (got ${(plain.match(/\*\*\d+\./g) || []).length})`);
ok(plain.indexOf('honest frame first') > -1 && plain.indexOf('honest frame first') < plain.indexOf('The figure & the hour'), 'GOLDEN: the codebook puts the honest frame FIRST (truncation-safe)');
ok(['In plain words', 'The good', 'The hard', 'Concerns', 'To reflect on'].every(l => plain.includes(l)), 'GOLDEN: the codebook demands all five plain-words labels');
ok(/never as advice|never advice|never as advice, an instruction/i.test(PLAIN_STRUCTURE) && /described, never prescribed/i.test(plain), 'GOLDEN: the plain-words codebook keeps the honest framing');
const goldenCtx = buildContext(goldenReading);
ok(/\[F1\]/.test(goldenCtx.system) && /OUTPUT CONTRACT/i.test(goldenCtx.system), 'GOLDEN: the grounded context is cite-bound');
ok(/In plain words/.test(PLAIN_CODA) && /To reflect on/.test(PLAIN_CODA), 'the oracle interpret prompts end with the plain-words coda');

// --- The calendar layer (R16): Julian ↔ proleptic Gregorian + era tiers ---
import {
  julianToJDN, gregorianToJDN, jdnToGregorian, jdnToJulian, julianToGregorian,
  julianGregorianOffset, utcDate, isoDate, deltaTSeconds, deltaTSigmaSeconds, eraAccuracy
} from '../assets/js/core/calendar.js';

ok(julianToJDN(1582, 10, 4) === 2299160 && gregorianToJDN(1582, 10, 15) === 2299161,
  'calendar: the Gregorian reform anchor (Julian 1582-10-04 = JDN 2299160; next day Gregorian 1582-10-15)');
{
  const g = julianToGregorian(1582, 10, 4);
  ok(g.y === 1582 && g.m === 10 && g.d === 14, 'calendar: Julian 1582-10-04 → Gregorian 1582-10-14');
  const dee = julianToGregorian(1527, 7, 13);
  ok(dee.y === 1527 && dee.m === 7 && dee.d === 23 && julianGregorianOffset(1527, 7, 13) === 10,
    'calendar GOLDEN: John Dee, Julian 1527-07-13 = proleptic Gregorian 1527-07-23 (+10 days)');
  const th = julianToGregorian(-584, 5, 28);
  ok(th.y === -584 && th.m === 5 && th.d === 22 && julianToJDN(-584, 5, 28) === 1507900,
    'calendar GOLDEN: Thales eclipse, Julian −584-05-28 = Gregorian −584-05-22 = JDN 1507900 (−6 days; 1 BCE = year 0)');
  ok(julianToJDN(1752, 9, 2) === 2361221 && gregorianToJDN(1752, 9, 14) === 2361222,
    'calendar: England 1752 — Julian 09-02 (JDN 2361221) followed by Gregorian 09-14 (11 days dropped)');
  ok(gregorianToJDN(2000, 1, 1) === 2451545 && gregorianToJDN(1858, 11, 17) === 2400001,
    'calendar: external anchors (J2000 = JDN 2451545; MJD 0 = JDN 2400001)');
  let rt = 0;
  for (let j = 1000000; j <= 2500000; j += 1371) {
    const gg = jdnToGregorian(j); if (gregorianToJDN(gg.y, gg.m, gg.d) !== j) rt++;
    const jj = jdnToJulian(j); if (julianToJDN(jj.y, jj.m, jj.d) !== j) rt++;
  }
  ok(rt === 0, 'calendar: JDN round-trips hold across ≈ −2000 BCE…2132 CE (both calendars, ~1100 samples each)');
  ok(utcDate(50, 3, 1).toISOString().startsWith('0050-03-01'), 'calendar: utcDate survives the JS years-0–99 remap trap');
  ok(isoDate(-584, 5, 22) === '-000584-05-22' && isoDate(1527, 7, 23) === '1527-07-23', 'calendar: ISO date forms');
  ok(Math.abs(deltaTSeconds(-700) - 20301) < 60 && Math.abs(deltaTSigmaSeconds(-700) - 508) < 2,
    'calendar: ΔT(−700) ≈ 20,301 s with σ ≈ 508 s (Espenak–Meeus; Morrison & Stephenson 2004)');
  ok(eraAccuracy(2000).grade === 'casting' && eraAccuracy(1527).grade === 'study' &&
     eraAccuracy(-700).grade === 'illustrative' && eraAccuracy(-700).moonWholeDegrees === true &&
     eraAccuracy(-2500).grade === 'refuse' && eraAccuracy(2500).grade === 'study' && eraAccuracy(3100).grade === 'refuse',
    'calendar: era-accuracy tiers (casting 1600–2200 · study 500–1600 & 2200–3000 · illustrative −1999–500 · refuse outside)');
  ok(/no year range stated/i.test(eraAccuracy(0).citation), 'calendar: the tier citation records that the engine README states no year range');
}

// --- The Hermetic Chronology wing (R15) --------------------------------------
import { CHRONOLOGY_ERAS, CHRONOLOGY_ENTRIES, CHRONOLOGY_CITATION } from '../assets/js/core/data/chronology.js';
{
  const chronLabels = new Set(['documented', 'disputed', 'debunked', 'conspiracy']);
  const chronEraIds = new Set(CHRONOLOGY_ERAS.map(e => e.id));
  ok(CHRONOLOGY_ERAS.length === 8, `chronology: 8 eras (got ${CHRONOLOGY_ERAS.length})`);
  ok(CHRONOLOGY_ENTRIES.length === 43, `chronology: 43 entries (got ${CHRONOLOGY_ENTRIES.length})`);
  ok(CHRONOLOGY_ENTRIES.every(e => chronLabels.has(e.label)),
    'chronology: every label is documented/disputed/debunked/conspiracy');
  ok(CHRONOLOGY_ENTRIES.every(e => Array.isArray(e.sources) && e.sources.length >= 1
    && e.sources.every(s => typeof s === 'string' && s.length)),
    'chronology: every entry has >=1 source string');
  ok(CHRONOLOGY_ENTRIES.every(e => chronEraIds.has(e.era)), 'chronology: every referenced era id exists');
  ok(CHRONOLOGY_ENTRIES.every(e => e.title && e.body && e.dateText && Number.isFinite(e.sortYear)),
    'chronology: every entry has title/body/dateText/sortYear');
  const chronCasts = CHRONOLOGY_ENTRIES.filter(e => e.cast);
  ok(chronCasts.length >= 3, `chronology: day-datable cast moments present (got ${chronCasts.length})`);
  ok(chronCasts.every(e => e.cast.calendar === 'julian' || e.cast.calendar === 'gregorian'),
    "chronology: every cast entry's calendar field is julian or gregorian");
  ok(chronCasts.every(e => [e.cast.y, e.cast.m, e.cast.d, e.cast.hour, e.cast.lat, e.cast.lon]
    .every(v => typeof v === 'number' && Number.isFinite(v))
    && e.cast.m >= 1 && e.cast.m <= 12 && e.cast.d >= 1 && e.cast.d <= 31
    && e.cast.hour >= 0 && e.cast.hour <= 23 && e.cast.place && e.cast.note),
    'chronology: every cast has numeric y/m/d/hour/lat/lon + place + note');
  ok(chronCasts.every(e => eraAccuracy(e.cast.y).grade !== 'refuse'),
    'chronology: every cast year is inside the computable era range');
  // golden: the Dee cast (Julian 1527-07-13, London) = proleptic Gregorian 1527-07-23
  const chronDee = chronCasts.find(e => e.cast.y === 1527);
  ok(!!chronDee && chronDee.cast.calendar === 'julian', 'chronology: the Dee cast entry (Julian 1527) is present');
  if (chronDee) {
    const g = julianToGregorian(chronDee.cast.y, chronDee.cast.m, chronDee.cast.d);
    ok(isoDate(g.y, g.m, g.d) === '1527-07-23',
      `chronology: Dee Julian 1527-07-13 → Gregorian ${isoDate(g.y, g.m, g.d)} (expect 1527-07-23)`);
  }
  ok(JSON.stringify(JSON.parse(JSON.stringify(CHRONOLOGY_ENTRIES))) === JSON.stringify(CHRONOLOGY_ENTRIES),
    'chronology: JSON round-trip is lossless');
  ok(typeof CHRONOLOGY_CITATION === 'string' && CHRONOLOGY_CITATION.length > 100,
    'chronology: CHRONOLOGY_CITATION present');
}

// --- Cycles of History: great conjunctions + eclipse finder -----------------
import { conjunctionsBetween, triplicityRuns, meanConjunctionSeries, eclipseNear } from '../assets/js/core/cycles.js';
import {
  CYCLE_CONSTANTS, DOCTRINE, KEPLER, PARIS_1348, BETHLEHEM,
  GOLDEN_CONJUNCTIONS, ECLIPSE_LIMITS, ECLIPSE_VECTORS, BABYLON,
} from '../assets/js/core/data/cycles-data.js';

const cyDays = (d, iso) => { const [y, m, dd] = iso.split('-').map(Number);
  return Math.abs(d.getTime() - utcDate(y, m, dd, 12).getTime()) / 86400000; };

// all 13 golden conjunctions reproduced ±1 day & ±0.2° (tropical of-date),
// with both-retrograde flags on the two triple middle passes
const cyScan = conjunctionsBetween(utcDate(1600, 1, 1, 0), utcDate(2030, 12, 31, 12));
ok(GOLDEN_CONJUNCTIONS.length === 13, `13 golden conjunctions (got ${GOLDEN_CONJUNCTIONS.length})`);
for (const v of GOLDEN_CONJUNCTIONS) {
  let best = null, bd = Infinity;
  for (const c of cyScan) { const d = cyDays(c.date, v.date); if (d < bd) { bd = d; best = c; } }
  ok(best && bd <= 1 && Math.abs(best.lon - v.lon) < 0.2,
    `great conjunction ${v.date} @ ${v.lon}° reproduced ±1d ±0.2° (got ${best && best.lon.toFixed(3)})`);
  if (v.retro) ok(best && best.jupiterRetrograde && best.saturnRetrograde,
    `${v.date} (triple middle pass) both retrograde`);
}

// the 7 BCE (astronomical −6) triple: three crossings in Pisces, sep 55–75′
const cyBC = conjunctionsBetween(utcDate(-7, 6, 1, 0), utcDate(-5, 6, 1, 0));
ok(cyBC.length === 3 && cyBC.every(c => c.sign.name === 'Pisces'),
  `7 BCE triple: 3 crossings, all Pisces (got ${cyBC.length}: ${cyBC.map(c => c.sign.name).join(',')})`);
ok(cyBC.every(c => c.sep >= 55 && c.sep <= 75),
  `7 BCE separations 55–75′ — never a visual merger (got ${cyBC.map(c => c.sep).join(', ')})`);
ok(cyBC[1] && cyBC[1].jupiterRetrograde && cyBC[1].saturnRetrograde, '7 BCE middle pass both retrograde');

// trigon-run machinery: the 1980–81 Libra foray is flagged as a one-off reversion
const cyRuns = triplicityRuns(conjunctionsBetween(utcDate(1900, 1, 1, 0), utcDate(2030, 12, 31, 12)));
const cyLibra = cyRuns.find(r => r.triplicity === 'air' && r.start.getUTCFullYear() === 1980);
ok(cyLibra && cyLibra.count === 3 && cyLibra.reversion === true, '1980–81 Libra triple flagged as one-off reversion');

// CYCLE_CONSTANTS invariants (frame-tagged)
ok(CYCLE_CONSTANTS.synodicJulianYears === 19.859, 'synodic period 19.859 Julian yr');
ok(CYCLE_CONSTANTS.meanAdvance.tropicalDeg === 242.98 && CYCLE_CONSTANTS.meanAdvance.siderealDeg === 242.7,
  'mean advance 242.98° tropical / 242.70° sidereal (frame-tagged)');
ok(CYCLE_CONSTANTS.fullReturn.medievalYears === 960 && CYCLE_CONSTANTS.fullReturn.keplerYears === 794
  && CYCLE_CONSTANTS.fullReturn.keplerConjunctions === 40, 'full return 960 yr medieval vs Kepler 794 yr (40 conjunctions)');
ok(CYCLE_CONSTANTS.triples.countBetween1200and2400 === 7 && /2238/.test(CYCLE_CONSTANTS.triples.next),
  '7 J–S triples 1200–2400, next 2238–39');

// doctrinal mean series: anchored at 2020 = 300.487°, advancing exactly +242.98°
const cyMean = meanConjunctionSeries(1900, 2100);
ok(cyMean.some(m => m.year === 2020 && Math.abs(m.lon - 300.487) < 1e-9), 'mean series anchored 2020 → 300.487°');
ok(cyMean.every((m, i) => !i
  || Math.abs((((m.lon - cyMean[i - 1].lon) % 360) + 360) % 360 - CYCLE_CONSTANTS.meanAdvance.tropicalDeg) < 1e-6),
  'mean series advances exactly +242.98° tropical per step');

// eclipse vectors: 9 positives through BOTH layers, 2 negatives rejected by BOTH
for (const v of ECLIPSE_VECTORS) {
  const [y, m, d] = v.date.split('-').map(Number);
  const r = eclipseNear(utcDate(y, m, d, 12));
  const s = v.kind === 'solar' ? r.solar : r.lunar;
  if (v.negative) {
    ok(s.verdict === 'impossible' && !s.groundTruth.sameSyzygy,
      `eclipse NEGATIVE ${v.date} (${v.kind}): rejected by both layers (D=${s.nodeDistanceDeg}°)`);
  } else {
    ok(s.groundTruth.sameSyzygy && s.groundTruth.kind === v.type && cyDays(s.groundTruth.peak, v.date) <= 1,
      `eclipse ${v.date} ${v.kind}: ground truth ${v.type}, peak within 1 day (got ${s.groundTruth.kind})`);
    ok(s.verdict === 'certain' || s.verdict === 'possible',
      `eclipse ${v.date}: classical limits say certain/possible (got ${s.verdict}, D=${s.nodeDistanceDeg}°)`);
  }
}

// data discipline: every record cited; the classical solar-limit discrepancy is flagged
const cyRecords = [CYCLE_CONSTANTS, DOCTRINE, KEPLER, PARIS_1348, BETHLEHEM, ECLIPSE_LIMITS,
  ...GOLDEN_CONJUNCTIONS, ...ECLIPSE_VECTORS, ...BABYLON];
ok(cyRecords.every(r => typeof r.cite === 'string' && r.cite.length > 10), 'cycles-data: every record has .cite');
const cyFlag = ECLIPSE_LIMITS.classicalSolarDiscrepancy;
ok(cyFlag && cyFlag.status === 'UNRESOLVED' && cyFlag.flag.includes('15°21′') && cyFlag.flag.includes('15°31′'),
  'cycles-data: 15°21′/15°31′ classical solar-limit discrepancy flagged UNRESOLVED in ECLIPSE_LIMITS');
ok(!JSON.stringify(cyRecords).includes('historicalastrology.com'), 'cycles-data: hijacked domain cited nowhere');

// range guard: refuses (with the era citation) outside −1999…3000
let cyThrew = false;
try { conjunctionsBetween(utcDate(-2100, 1, 1, 0), utcDate(-2050, 1, 1, 0)); }
catch (e) { cyThrew = /−1999…3000/.test(e.message); }
ok(cyThrew, 'conjunctionsBetween refuses outside −1999…3000 (citing eraAccuracy)');

// --- Time-lords: progressions · firdaria · zodiacal releasing ---------------
import { progressedPositions, ageFromDates, naibodArc } from '../assets/js/core/progressions.js';
import { firdaria, currentFirdaria } from '../assets/js/core/firdaria.js';
import { zodiacalReleasing, distributionAge, unitTable, SIGN_PERIODS, PERIOD_SUM, LOOSING_L1_SIGNS } from '../assets/js/core/releasing.js';
import { norm360 } from '../assets/js/core/astro.js';

const tlBirth = new Date(Date.UTC(1990, 0, 5, 12, 0)); // fixed: 1990-01-05 12:00 UT, London
const tlNear = (a, b, tol) => Math.abs(a - b) <= tol;

// (1) firdaria day-chart boundaries (Abu Ma'shar via Dykes; sums verified)
const tlFd = firdaria(tlBirth, true);
const tlExpDay = [['Sun',0,10],['Venus',10,18],['Mercury',18,31],['Moon',31,40],['Saturn',40,51],
  ['Jupiter',51,63],['Mars',63,70],['NorthNode',70,73],['SouthNode',73,75]];
ok(tlFd.majors.length === 9 && tlExpDay.every(([l,s,e],i) =>
  tlFd.majors[i].lord === l && tlFd.majors[i].startAge === s && tlFd.majors[i].endAge === e),
  'firdaria day boundaries: Sun 0-10 … Mars 63-70, NN 70-73, SN 73-75');

// (2) night, nodes at END (Abu Ma'shar default)
const tlFn = firdaria(tlBirth, false);
const tlExpN = [['Moon',0,9],['Saturn',9,20],['Jupiter',20,32],['Mars',32,39],['Sun',39,49],
  ['Venus',49,57],['Mercury',57,70],['NorthNode',70,73],['SouthNode',73,75]];
ok(tlExpN.every(([l,s,e],i) =>
  tlFn.majors[i].lord === l && tlFn.majors[i].startAge === s && tlFn.majors[i].endAge === e),
  "firdaria night 'end': Moon 0-9 … Mercury 57-70, NN 70-73, SN 73-75");

// (3) night, Bonatti 'afterMars' variant
const tlFa = firdaria(tlBirth, false, { nightNodes: 'afterMars' });
const tlExpA = [['Moon',0,9],['Saturn',9,20],['Jupiter',20,32],['Mars',32,39],['NorthNode',39,42],
  ['SouthNode',42,44],['Sun',44,54],['Venus',54,62],['Mercury',62,75]];
ok(tlExpA.every(([l,s,e],i) =>
  tlFa.majors[i].lord === l && tlFa.majors[i].startAge === s && tlFa.majors[i].endAge === e),
  "firdaria night 'afterMars' (Bonatti): NN 39-42, SN 42-44, Sun 44-54, Venus 54-62, Mercury 62-75");

// (4) Sun-major sub-periods at 10/7 boundaries; node majors undivided
const tlSun = tlFd.majors[0], tlSubLords = ['Sun','Venus','Mercury','Moon','Saturn','Jupiter','Mars'];
ok(tlSun.subs.length === 7 && tlSun.subs.every((s, i) => s.lord === tlSubLords[i]
    && tlNear(s.startAge, i * 10 / 7, 1e-9) && tlNear(s.endAge, (i + 1) * 10 / 7, 1e-9)),
  'firdaria Sun-major subs: 7 equal 10/7-yr parts, Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars');
ok(tlFd.majors[7].subs === null && tlFd.majors[8].subs === null
    && tlFa.majors[4].subs === null && tlFa.majors[5].subs === null,
  'firdaria node majors have subs === null');
const tlCf = currentFirdaria(tlFd.majors, 30.5);
ok(tlCf.major && tlCf.major.lord === 'Mercury' && tlCf.sub && tlCf.sub.lord === 'Venus',
  'currentFirdaria(30.5): Mercury major / Venus sub (7th sub, 29.143-31)');

// (5) ZR sign years: sum 211; CAPRICORN 27, not 30 (Valens IV.6)
ok(PERIOD_SUM === 211 && SIGN_PERIODS.reduce((a, b) => a + b, 0) === 211, 'ZR sign years sum to 211');
ok(SIGN_PERIODS[9] === 27 && SIGN_PERIODS[10] === 30 && SIGN_PERIODS[3] === 25,
  'ZR Capricorn = 27 (half of half of the Moon’s 108 — Valens IV.6), Aquarius 30, Cancer 25');

// (6) Cancer L1 from 2012-01-01: 9000 days, ends 2036-08-22 (T. Louis example)
const tlZrB = new Date(Date.UTC(2012, 0, 1));
const tlZr = zodiacalReleasing(3, tlZrB, { maxYears: 100 });
const tlC1 = tlZr.l1[0];
ok(tlC1.sign === 'Cancer' && tlC1.endDay - tlC1.startDay === 9000
    && tlC1.endDate.toISOString().slice(0, 10) === '2036-08-22',
  `ZR Cancer L1 from 2012-01-01: 25×360 = 9000 d, ends ${tlC1.endDate.toISOString().slice(0, 10)} (2036-08-22, NOT 2037-01-01)`);

// (7) Cancer L1 L2 chain + loosing of the bond at month 211 → CAPRICORN
const tlL2 = tlC1.l2;
const tlExpL2 = [['Cancer',25],['Leo',19],['Virgo',20],['Libra',8],['Scorpio',15],['Sagittarius',12],
  ['Capricorn',27],['Aquarius',30],['Pisces',12],['Aries',15],['Taurus',8],['Gemini',20]];
ok(tlExpL2.every(([s, m], i) => tlL2[i].sign === s && tlL2[i].months === m)
    && tlNear(tlL2[11].endDay - tlC1.startDay, 211 * 30, 1e-6),
  'ZR Cancer L1: first 12 L2s Cancer 25m … Gemini 20m, cumulative 211 months');
ok(tlL2[12] && tlL2[12].sign === 'Capricorn' && tlL2[12].loosed === true
    && tlNear(tlL2[12].startDay - tlC1.startDay, 211 * 30, 1e-6)
    && tlL2[13].sign === 'Aquarius' && tlL2[14].sign === 'Pisces',
  'ZR loosing of the bond: 13th L2 = CAPRICORN (opposite sign) at month 211, then Aquarius, Pisces…');
const tlLast = tlL2[tlL2.length - 1];
ok(tlNear(tlLast.endDay - tlC1.startDay, 300 * 30, 1e-6) && tlLast.truncated === true,
  'ZR Cancer L1 L2 chain truncated at month 300 (the parent’s end)');
ok(JSON.stringify(LOOSING_L1_SIGNS) === JSON.stringify([2, 3, 4, 5, 9, 10]),
  'ZR loosing-eligible L1 signs (number ≥ 19): Gemini, Cancer, Leo, Virgo, Capricorn, Aquarius');

// (8) L3/L4 unit table = Valens IV.10 (n × 2.5 d, n × 5 h)
const tlUt = unitTable(); const tlU = s => tlUt.find(u => u.sign === s);
ok([['Aries', 37.5, '3d3h'], ['Leo', 47.5, '3d23h'], ['Cancer', 62.5, '5d5h'], ['Aquarius', 75, '6d6h'],
    ['Capricorn', 67.5, '5d15h'], ['Sagittarius', 30, '2d12h'], ['Taurus', 20, '1d16h'], ['Gemini', 50, '4d4h']]
  .every(([s, l3, l4]) => { const u = tlU(s); return tlNear(u.l3Days, l3, 1e-9) && `${u.l4.days}d${u.l4.hours}h` === l4; }),
  'ZR unit table matches Valens IV.10 (Mars 37.5d/3d3h · Sun 47.5d/3d23h · Moon 62.5d/5d5h · Aqu 75d/6d6h · Cap 67.5d/5d15h · Jup 30d/2d12h · Ven 20d/1d16h · Mer 50d/4d4h)');

// (9) distribution age: Valens IV.9's own arithmetic — 11,903 days = 33 yr + 23 d
const tlDa = distributionAge(tlZrB, new Date(tlZrB.getTime() + 11903 * 86400000));
ok(tlDa.years === 33 && tlNear(tlDa.days, 23, 1e-9), 'ZR distributionAge(11,903 d) = 33 yr + 23 d (Valens IV.9)');

// (10) secondary progressions, 1990-01-05 12:00 UT London
const tlP30 = progressedPositions(tlBirth, 51.5074, -0.1278, 30);
const tlNatal = tlP30.natal;
const tlSunAdv = norm360(tlP30.planets.Sun.lon - tlNatal.planets.Sun.lon);
ok(tlSunAdv >= 28.6 && tlSunAdv <= 30.6, `progressed Sun at 30 = natal + ${tlSunAdv.toFixed(2)}° (28.6–30.6)`);
const tlMoonAdv = norm360(tlP30.planets.Moon.lon - tlNatal.planets.Moon.lon) + 360;
ok(tlNear(tlMoonAdv, 395, 5), `progressed Moon at 30 = natal + ${tlMoonAdv.toFixed(1)}° (395 ± 5, mod 360 handled)`);
const tlP0 = progressedPositions(tlBirth, 51.5074, -0.1278, 0);
ok(Math.abs(((tlP0.progressedMC - tlNatal.mc + 540) % 360) - 180) < 0.01
    && Math.abs(((tlP0.progressedAsc - tlNatal.asc + 540) % 360) - 180) < 0.01,
  'progressions at age 0 reproduce the natal MC & Asc to < 0.01°');
ok(tlNear(naibodArc(30), 29.5694, 1e-4), `naibodArc(30) = ${naibodArc(30).toFixed(5)}° (29.5694 ± 0.0001)`);
ok(tlNear(ageFromDates(tlBirth, new Date(Date.UTC(2020, 0, 5, 12, 0))), 30, 0.03),
  'ageFromDates: 1990-01-05 → 2020-01-05 ≈ 30 tropical years');

// --- AI: the cycles & timelords assistant kinds (cite-bound, plain coda) ----
import { buildCyclesContext, buildCyclesInterpretPrompt, buildTimelordsContext, buildTimelordsInterpretPrompt } from '../assets/js/core/llm-context.js';
{
  const cyc = buildCyclesContext({ kind: 'cycles',
    scan: { fromY: 1990, toY: 2030, conjunctions: cyScan.filter(c => c.date.getUTCFullYear() >= 1990), runs: [] },
    eclipse: null });
  ok(/\[F1\]/.test(cyc.system) && /OUTPUT CONTRACT/i.test(cyc.system), 'AI cycles: the grounded context is cite-bound');
  ok(/documented beliefs/i.test(buildCyclesInterpretPrompt()) && /In plain words/.test(buildCyclesInterpretPrompt()),
    'AI cycles: interpret prompt keeps the honest framing + the plain-words coda');
  const tlx = { kind: 'timelords',
    meta: { birthUTC: tlBirth.toISOString(), lat: 51.5074, lon: -0.1278, isDay: true, ageTropicalYears: 30, asOf: '2020-01-05', asc: 'x', mc: 'y' },
    progressions: tlP30,
    firdaria: { ...tlFd, current: tlCf },
    releasing: {
      lots: { spirit: { lon: 100, label: "10°00' Cancer" }, fortune: { lon: 200, label: "20°00' Libra" } },
      fromSpirit: { ...tlZr, current: { l1: tlC1, l2: tlC1.l2[0], distributionAge: { years: 14, days: 255 } } },
      fromFortune: null,
    } };
  const tlc = buildTimelordsContext(tlx);
  ok(/\[F1\]/.test(tlc.system) && /OUTPUT CONTRACT/i.test(tlc.system), 'AI timelords: the grounded context is cite-bound');
  ok(tlc.facts.some(f => /CURRENT firdaria: Mercury/i.test(f.text)), 'AI timelords: the current-firdaria fact carries the computed lords');
  ok(/no demonstrated validity/i.test(buildTimelordsInterpretPrompt()) && /To reflect on/.test(buildTimelordsInterpretPrompt()),
    'AI timelords: honest close + the plain-words coda');
}

// --- AI: the 🎯 auspicious-moment finder prompt (engine finds, model translates) ---
import { buildMomentFinderPrompt } from '../assets/js/core/llm-context.js';
{
  const wins = findNextElection('talisman', J2000, 51.5074, -0.1278, { hoursAhead: 24, stepMinutes: 60 });
  const mp = buildMomentFinderPrompt(goldenReading, wins);
  ok(mp.indexOf('honest frame first') > -1 && mp.indexOf('honest frame first') < mp.indexOf('The aim'),
    'moment finder: the honest frame is step 0, FIRST');
  ok(wins.length === 0 || /WINDOW 1: \d{4}-\d{2}-\d{2} \d{2}:\d{2} UT/.test(mp),
    'moment finder: computed windows are embedded with real UT times (never the model\'s guess)');
  ok(/changes nothing real/i.test(mp) && /To reflect on/.test(mp) && /never\s+prescribed/i.test(mp),
    'moment finder: honest framing + five-part coda locked in');
  const mpEmpty = buildMomentFinderPrompt(goldenReading, []);
  ok(/NO qualifying window/.test(mpEmpty), 'moment finder: the empty-scan case is stated honestly');
}

// --- Praśna (Indian horary) + KP sub-lords ----------------------------------
import { buildSubLordTable, subLordOf, kpForNumber, kpSignificators } from '../assets/js/core/kp.js';
import { prasnaJudgement, classifyGrahas, arudhaFromDirection } from '../assets/js/core/prasna.js';
import { castChart as prCastChart } from '../assets/js/core/astro.js';
import { castVedic as prCastVedic } from '../assets/js/core/vedic.js';
{
  const sec = (d, m, s) => d * 3600 + m * 60 + s;
  const kpt = buildSubLordTable();
  ok(kpt.length === 249, `KP table has exactly 249 entries (got ${kpt.length})`);
  ok(kpt.filter(e => e.split).length === 12, 'exactly 6 split subs (12 flagged half-entries)');
  const kpSplits = kpt.filter(e => e.split && e.fromSec % 108000 === 0);
  ok(kpSplits.map(e => e.sign).join(',') === 'Taurus,Cancer,Virgo,Scorpio,Capricorn,Pisces',
    'the 6 splits sit at 0° Ta/Cn/Vi/Sc/Cp/Pi');
  ok(kpSplits.every(e => (e.starLord === 'Sun' && e.subLord === 'Rahu') || (e.starLord === 'Jupiter' && e.subLord === 'Moon')),
    'split pattern: Rāhu sub in Sun stars, Moon sub in Jupiter stars');
  ok(kpt[0].fromSec === 0 && kpt[248].toSec === 1296000 && kpt.every((e, i) => i === 0 || e.fromSec === kpt[i - 1].toSec),
    'KP arcs tile 0°→360° with no gaps or overlaps');
  ok(Math.abs(kpt.reduce((a, e) => a + (e.toDeg - e.fromDeg), 0) - 360) < 1e-9, 'KP arc widths sum to 360°');
  const ladder = [[2800, 'Ketu'], [10800, 'Venus'], [13200, 'Sun'], [17200, 'Moon'], [20000, 'Mars'],
    [27200, 'Rahu'], [33600, 'Jupiter'], [41200, 'Saturn'], [48000, 'Mercury']];
  ok(ladder.every(([end, lord], i) => kpt[i].toSec === end && kpt[i].subLord === lord && kpt[i].starLord === 'Ketu'),
    'Aśvinī ladder at the verified boundaries (Ketu →0°46′40″, Venus →3°00′, Sun →3°40′ …)');
  const kpRow = (n, sign, fromS, toS, nak, star, sub) => {
    const e = kpt[n - 1];
    ok(e.sign === sign && e.fromSec === fromS && e.toSec === toS && e.nakshatra === nak && e.starLord === star && e.subLord === sub,
      `KP No.${n} = ${sign} ${nak} ${star}/${sub} (published row, re-derived)`);
  };
  kpRow(1, 'Aries', 0, sec(0, 46, 40), 'Ashwini', 'Ketu', 'Ketu');
  kpRow(10, 'Aries', sec(13, 20, 0), sec(15, 33, 20), 'Bharani', 'Venus', 'Venus');
  kpRow(22, 'Aries', sec(29, 13, 20), 108000, 'Krittika', 'Sun', 'Rahu');
  kpRow(23, 'Taurus', 108000, 108000 + sec(1, 13, 20), 'Krittika', 'Sun', 'Rahu');
  kpRow(40, 'Taurus', 108000 + sec(26, 6, 40), 108000 + sec(27, 53, 20), 'Mrigashira', 'Mars', 'Jupiter');
  kpRow(76, 'Cancer', 324000 + sec(18, 33, 20), 324000 + sec(19, 20, 0), 'Ashlesha', 'Mercury', 'Ketu');
  kpRow(108, 'Virgo', 540000 + sec(3, 0, 0), 540000 + sec(5, 6, 40), 'Uttara Phalguni', 'Sun', 'Saturn');
  kpRow(124, 'Virgo', 540000 + sec(27, 53, 20), 648000, 'Chitra', 'Mars', 'Saturn');
  ok(!kpt[123].split, 'No.124 ends EXACTLY at 30° Virgo — Citrā never splits (Mars+Rāhu+Jupiter+Saturn = 400′)');
  kpRow(125, 'Libra', 648000, 648000 + sec(1, 53, 20), 'Chitra', 'Mars', 'Mercury');
  kpRow(200, 'Capricorn', 972000 + sec(17, 46, 40), 972000 + sec(19, 40, 0), 'Shravana', 'Moon', 'Mercury');
  kpRow(249, 'Pisces', 1188000 + sec(27, 53, 20), 1296000, 'Revati', 'Mercury', 'Saturn');
  ok([1, 76, 125, 200, 249].every(n => {
    const k = kpForNumber(n);
    return subLordOf((k.entry.fromDeg + k.entry.toDeg) / 2).entry.num === n && subLordOf(k.ascLon).entry.num === n;
  }), 'subLordOf round-trips kpForNumber at arc start & midpoint');
  ok(kpForNumber(0) === null && kpForNumber(250) === null, 'kpForNumber rejects out-of-range numbers');

  // Bṛhat Jātaka II.5 classification (verified vector)
  const prFake = moonLon => ({ grahas: {
    Sun: { lon: 0, rashiIndex: 0 }, Moon: { lon: moonLon, rashiIndex: Math.floor(moonLon / 30) },
    Mercury: { lon: 150, rashiIndex: 5 }, Venus: { lon: 200, rashiIndex: 6 },
    Mars: { lon: 250, rashiIndex: 8 }, Jupiter: { lon: 100, rashiIndex: 3 }, Saturn: { lon: 310, rashiIndex: 10 },
    Rahu: { lon: 50, rashiIndex: 1 }, Ketu: { lon: 230, rashiIndex: 7 } } });
  const prWax = classifyGrahas(prFake(90));
  ok(prWax.waxing && prWax.benefics.slice().sort().join() === 'Jupiter,Mercury,Moon,Venus'
    && prWax.malefics.slice().sort().join() === 'Mars,Saturn,Sun',
    'BJ II.5: elongation 90° → benefics {Jup,Ven,Moon,Merc}, malefics {Sun,Mars,Sat}');
  ok(!classifyGrahas(prFake(270)).waxing && classifyGrahas(prFake(270)).malefics.includes('Moon'),
    'elongation 270° → the waning Moon joins the malefics');
  ok(prWax.maleficsWithNodes.includes('Rahu') && prWax.flags.some(f => /Phalad/i.test(f)),
    'Rāhu/Ketu malefic only under the flagged Phaladīpikā extension');

  // ārūḍha needs a supplied direction (PM II.7–11) — never inferred
  ok(arudhaFromDirection('east').rashis.join() === 'Aries,Taurus'
    && arudhaFromDirection('south-east').rashis.join() === 'Gemini'
    && arudhaFromDirection(null) === null, 'ārūḍha: east→{Meṣa,Vṛṣabha}, SE→Mithuna, none→null');

  // the judgement on a fixed moment — every testimony carries a cite
  const prChart = prCastChart(new Date(Date.UTC(2026, 0, 5, 12, 0)), 51.5074, -0.1278, 'whole');
  const prV = prCastVedic(prChart, { currentDate: new Date(Date.UTC(2026, 0, 5, 12, 0)) });
  const prJ = prasnaJudgement(prV, { quesitedHouse: 7, question: 'engine test' });
  ok(prJ.testimonies.length >= 6, `prasnaJudgement returns testimonies (got ${prJ.testimonies.length})`);
  ok(prJ.testimonies.every(t => t.cite && t.cite.length > 10), 'every testimony carries a cite');
  ok(prJ.testimonies.every(t => ['for', 'against', 'neutral'].includes(t.verdict))
    && ['favourable', 'unfavourable', 'mixed'].includes(prJ.leaning), 'verdicts & leaning use the fixed vocabularies');
  ok(/no demonstrated/.test(prJ.caveat) && prJ.outOfScope.length >= 4 && prJ.outOfScope.every(o => o.cite),
    'the locked caveat + cited out-of-scope layers (omens, breath, tāmbūla…) ride along');
  ok(prJ.counts.for + prJ.counts.against + prJ.counts.neutral === prJ.testimonies.length, 'testimony counts reconcile');
  const prJ125 = prasnaJudgement(prV, { quesitedHouse: 7, kpNumber: 125 });
  ok(prJ125.kpNumber === 125 && prJ125.lagna.sign === 'Libra' && prJ125.lagna.overriddenByKpNumber,
    'KP horary number 125 fixes the praśna lagna at 0° Libra');
  const prKp = kpSignificators(prV);
  ok(prKp.cusps.length === 12 && prKp.planets.length === 9
    && prKp.lagna.subLord === subLordOf(prV.lagna.lon).subLord && prKp.cusps[0].subLord === prKp.lagna.subLord,
    'kpSignificators: 12 cusps + 9 grahas, lagna sub-lord consistent with subLordOf');
  ok(prKp.flags.length >= 5 && /Placidus/i.test(prKp.cuspNote), 'KP convention flags (Placidus, ayanāṁśa, +1″, nodes) stored in-data');
}

// --- Muhūrta (Indian electional) --------------------------------------------
import { muhurtasOf, kalas, panchangaScreens, muhurtaReport, scanDay } from '../assets/js/core/muhurta.js';
import { MUHURTA_NAMES, OCTANT_TABLES, TITHI_SCREEN, YOGA_SCREEN, KARANA_SCREEN, NAKSHATRA_CLASSES } from '../assets/js/core/data/muhurta-data.js';

{
  const when = new Date(Date.UTC(2026, 6, 13, 6, 30));            // Ujjain, Monday 2026-07-13, 12:00 IST
  const ms = muhurtasOf(when, 23.1793, 75.7849);
  ok(ms.length === 30, 'muhūrta: 30 slots');
  ok(ms.every((m, i) => i === 29 || m.end.getTime() === ms[i + 1].start.getTime()) && ms.every(m => m.start < m.end),
    'muhūrta: the 30 slots partition sunrise→next-sunrise exactly (no gaps, monotone)');
  const dayArc = ms[14].end - ms[0].start, nightArc = ms[29].end - ms[14].end;
  ok(ms.slice(0, 15).every(m => Math.abs((m.end - m.start) - dayArc / 15) <= 1)
    && ms.slice(15).every(m => Math.abs((m.end - m.start) - nightArc / 15) <= 1),
    'muhūrta: every slot = its arc/15 within 1 ms');
  const abhi = ms[7];
  ok(abhi.isAbhijit && Math.abs((abhi.start.getTime() + abhi.end.getTime()) / 2
      - (ms[0].start.getTime() + ms[14].end.getTime()) / 2) <= 120000,
    'muhūrta: Abhijit is slot 8, midpoint = the mid-day point (±2 min)');
  ok(ms[28].isBrahma, 'muhūrta: Brāhma is slot 29');
  ok(!!ms[15].contested && ms[15].contested.positions.length >= 2
    && !!ms[21].contested && ms[21].contested.positions.length >= 2 && !!ms[7].contested,
    'muhūrta: contested flags on #16 Girīśa, #22 Agni and the Abhijit weekday exception (both positions kept)');
  ok(MUHURTA_NAMES.length === 30 && MUHURTA_NAMES.every(r => r.cite)
    && YOGA_SCREEN.avoid.every(y => y.cite) && TITHI_SCREEN.groups.every(g => g.cite)
    && NAKSHATRA_CLASSES.every(c => c.cite) && !!KARANA_SCREEN.avoid.cite
    && !!OCTANT_TABLES.cites.rahu && !!OCTANT_TABLES.cites.yama && !!OCTANT_TABLES.cites.gulika,
    'muhūrta: every data record carries .cite');
  // the three verified octant tables, intact + the Gulika Saturn-part derivation
  ok(OCTANT_TABLES.rahu.join() === '8,2,7,5,6,4,3' && OCTANT_TABLES.yama.join() === '5,4,3,2,1,7,6'
    && OCTANT_TABLES.gulika.join() === '7,6,5,4,3,2,1', 'muhūrta: the three verified octant tables are intact');
  ok(OCTANT_TABLES.gulika.every((k, w) => {
      let s = -1; for (let p = 0; p < 7; p++) if ((w + p) % 7 === 6) s = p + 1; return s === k;
    }), "muhūrta: Gulika = Saturn's part — the lord-derivation reproduces the table for all 7 weekdays");
  const kk = kalas(when, 23.1793, 75.7849);                       // Monday → Rāhu = 2nd octant
  const arc = kk.sunset - kk.sunrise;
  ok(kk.weekday === 1 && kk.rahu.octant === 2
    && kk.rahu.start.getTime() === kk.sunrise.getTime() + Math.round(arc / 8)
    && kk.rahu.end.getTime() === kk.sunrise.getTime() + Math.round(2 * arc / 8)
    && kk.yama.octant === 4 && kk.gulika.octant === 6,
    'muhūrta: Monday kālas = octants 2/4/6 of the real day (sunrise-bounded vāra)');
  // screens: the verified synthetic avoid-day (Riktā 14, Vyatīpāta, Viṣṭi, Mūla)
  const s = panchangaScreens({ tithi: { num: 14, name: 'Caturdaśī', paksha: 'Śukla (waxing)' },
    yoga: { num: 17, name: 'Vyatīpāta' }, karana: { num: 8, name: 'Viṣṭi' },
    nakshatra: { num: 19, name: 'Mula', sanskrit: 'Mūla' }, vara: {} });
  ok(['tithi', 'yoga', 'karana', 'nakshatra'].every(k => s[k].verdict === 'avoid' && !!s[k].cite),
    'muhūrta: synthetic avoid-day flags all four screens negative, with cites');
  ok(YOGA_SCREEN.avoid.map(y => y.num).join() === '1,6,9,10,13,15,17,19,27'
    && YOGA_SCREEN.avoid.find(y => y.num === 15).ghatis === 3
    && YOGA_SCREEN.avoid.filter(y => y.scope === 'whole').map(y => y.num).join() === '17,27',
    'muhūrta: nine avoided yogas; Vajra = 3 ghaṭīs (the verified correction); mahā-doṣa tier = 17 + 27');
  const rep = muhurtaReport(when, 23.1793, 75.7849);
  ok(!rep.error && /never prescribed/.test(rep.caveat) && rep.citations.length >= 8,
    'muhūrta: report composes with the honest caveat + citations');
  const sc = scanDay(when, 23.1793, 75.7849);
  ok(sc.rows.length === 30 && sc.rows.filter(r => r.kalas.length).every(r => r.isDay),
    'muhūrta: scanDay overlays the kālas on day rows only');
}

// --- Tājika varṣaphala (the Indo-Persian annual chart) ----------------------
import {
  munthaSign, muntha, tajikaTriplicityLord, tajikaAspect, deeptamsaOrb,
  tajikaPair, computeSaham, computeSahams, varshaphala,
} from '../assets/js/core/tajika.js';
import { aspectBetween } from '../assets/js/core/aspects.js';
import {
  DEEPTAMSA, DEEPTAMSA_RECORD, TAJIKA_ASPECT_CLASSES, TAJIKA_TRIPLICITY,
  MUNTHA_RECORD, VARSHESHVARA_RECORD, TAJIKA_YOGAS, SAHAMS,
  SAHAM_CORRECTION_RECORD, VARSHA_PRAVESHA_RECORD, TRANSMISSION_NOTE,
} from '../assets/js/core/data/tajika-data.js';

// munthā vectors (Hāyanaratna ch.5 §1, Samarasiṃha's rule)
ok(munthaSign(4, 25) === 5 && munthaSign(4, 0) === 4 && munthaSign(4, 12) === 4,
  'muntha: (Leo,25)→Virgo, (Leo,0)→Leo, (Leo,12)→Leo');
ok(/Tājikamuktāvali/.test(muntha(4, 25, 5).monthlyMotion.attribution),
  'muntha ~2.5°/month attributed to Tājikamuktāvali-as-quoted-by-Balabhadra');

// saham vectors (research verbatim; Saṃjñātantra 3.5 + Balabhadra's gloss)
const tjV1 = computeSaham(110, 275, 10), tjV2 = computeSaham(160, 50, 10), tjV3 = computeSaham(50, 160, 10);
ok(tjV1.lon === 205 && !tjV1.correctionApplied, 'saham vector 1: 205.0 = Libra 25, no +30');
ok(tjV2.raw === 120 && tjV2.lon === 150 && tjV2.correctionApplied, 'saham vector 2: 120 → +30 → 150.0 = Virgo 0');
ok(tjV3.lon === 260 && !tjV3.correctionApplied, 'saham vector 3 (night, swapped): 260.0 = Sagittarius 20');
ok(tjV1.granularityAgrees && tjV2.granularityAgrees && tjV3.granularityAgrees,
  'saham between-check: degree- and sign-granular readings agree on all vectors');

// deeptāṁśa table as data (Daivajñālaṃkṛti 8.9 = Tājikasāra 88)
ok(DEEPTAMSA.Sun === 15 && DEEPTAMSA.Moon === 12 && DEEPTAMSA.Mars === 8 && DEEPTAMSA.Mercury === 7 &&
  DEEPTAMSA.Jupiter === 9 && DEEPTAMSA.Venus === 7 && DEEPTAMSA.Saturn === 9 && deeptamsaOrb('Mars') === 8,
  'deeptāṁśa orbs = 15/12/8/7/9/7/9 (Mars 8, not the vedastro-12 error)');
ok(DEEPTAMSA_RECORD.variants.some(v => v.planet === 'Rahu' && v.orb === 12 && v.flagged) &&
  DEEPTAMSA_RECORD.knownErrors.length > 0 &&
  DEEPTAMSA_RECORD.combinationRule.primary === 'within their own orbs of light, or within twelve degrees' &&
  DEEPTAMSA_RECORD.combinationRule.halfSum.contested === true,
  'deeptāṁśa record: Rāhu-12 variant flagged, Mars-12 error recorded, primary rule verbatim, half-sum flagged unverified');

// itthaśāla truth-table incl. the <1° carve-out (documented aspects.js divergence)
const tjSat = { lon: 135, speed: 0.033 }, tjM = d => ({ lon: d, speed: 0.52 });
const tjA = tajikaPair('Mars', tjM(10), 'Saturn', tjSat), tjWA = aspectBetween('Mars', tjM(10), 'Saturn', tjSat);
const tjB = tajikaPair('Mars', tjM(15.5), 'Saturn', tjSat), tjWB = aspectBetween('Mars', tjM(15.5), 'Saturn', tjSat);
const tjC = tajikaPair('Mars', tjM(16), 'Saturn', tjSat), tjWC = aspectBetween('Mars', tjM(16), 'Saturn', tjSat);
ok(tjA.verdict === 'itthasala' && !tjA.carveOut && tjA.withinOwnOrbs && tjA.halfSum === 8.5 && tjWA.applying === true,
  'Mars Ar10/Saturn Le15: itthaśāla (gap 5 ≤ own orbs & half-sum 8.5); aspects.js agrees applying');
ok(tjB.verdict === 'itthasala' && tjB.carveOut === true && tjWB.applying === false,
  'Mars Ar15°30′: STILL itthaśāla (past <1°, ancient commentator) while aspects.js applying=false — documented divergence');
ok(tjC.verdict === 'isarapha' && tjWC.applying === false, 'Mars Ar16: īsarāpha (1° past, Tājikabhūṣaṇa 4.10)');
ok(tajikaAspect(0, 5) === null && tajikaAspect(0, 6).strength === 1 && tajikaAspect(0, 4).strength === 0.75 &&
  tajikaAspect(0, 2).strength === 0.25 && tajikaAspect(0, 3).strength === 0.5,
  'Tājika aspects: none at 2/6/8/12; Vāmana strengths ¼ (3/11), ½ (4/10), ¾ (5/9), full (7)');

// Tājika triplicity table (NOT sign rulership)
ok(tajikaTriplicityLord(0, true) === 'Sun' && tajikaTriplicityLord(1, true) === 'Venus' &&
  tajikaTriplicityLord(2, true) === 'Saturn' && tajikaTriplicityLord(3, true) === 'Venus' &&
  tajikaTriplicityLord(0, false) === 'Jupiter' && tajikaTriplicityLord(1, false) === 'Moon' &&
  tajikaTriplicityLord(2, false) === 'Mercury' && tajikaTriplicityLord(3, false) === 'Mars',
  'Tājika triplicity lords day Sun/Venus/Saturn/Venus · night Jupiter/Moon/Mercury/Mars');

// day/night saham behaviour on synthetic positions
const tjPos = { Asc: 10, Sun: 275, Moon: 110, Mercury: 100, Venus: 200, Mars: 300, Jupiter: 40, Saturn: 250 };
const tjDay = computeSahams(tjPos, { isDay: true, lagnaSignIndex: 0 });
const tjNight = computeSahams(tjPos, { isDay: false, lagnaSignIndex: 0 });
ok(tjDay.sahams.length === 12 && tjDay.sahams.find(s => s.key === 'punya').lon === 205,
  'computeSahams: core dozen; Puṇya = 205 on the day vector');
ok(/^Jupiter/.test(tjNight.sahams.find(s => s.key === 'bhratri').formula) &&
  /^Jupiter/.test(tjNight.sahams.find(s => s.key === 'putra').formula) &&
  /^Jupiter − Sun \+ Moon/.test(tjNight.sahams.find(s => s.key === 'gaurava').formula),
  'night: Bhrātṛ & Putra unreversed; Gaurava uses the EXPLICIT night form (not a mechanical reversal)');
ok(/Jupiter − Mars/.test(tjDay.sahams.find(s => s.key === 'samarthya').formula),
  'Sāmarthya: Mars-rules-Lagna exception (Aries lagna) → Jupiter − Mars + Asc at all times');
ok(tjDay.sahams.find(s => s.key === 'mitra').betweenCheckPoint === 'Venus', 'Mitra between-check point = Venus');

// the sidereal return + varṣeśvara on a live nativity
const tjBirth = new Date(Date.UTC(1984, 8, 24, 3, 30));
const tjNatal = castChart(tjBirth, 28.6139, 77.2090, 'whole');
const tjR = varshaphala(tjNatal, 2026);
ok(tjR.varshaPravesha.siderealMatchDeg < 0.01,
  `varṣa-praveśa: annual SIDEREAL Sun = natal sidereal Sun to <0.01° (Δ ${tjR.varshaPravesha.siderealMatchDeg.toExponential(1)})`);
ok(tjR.varshaPravesha.driftMinutes > 0, 'sidereal return later than the tropical return of the same year');
ok(tjR.varsheshvara.candidates.length === 5 &&
  tjR.varsheshvara.candidates.some(c => c.planet === tjR.varsheshvara.chosen.planet),
  'varṣeśvara: exactly five candidates; chosen among them');
ok(tjR.varsheshvara.candidates.some(c => c.aspectsLagna)
    ? (tjR.varsheshvara.chosen.aspectsLagna === true && tjR.varsheshvara.viaDispute === false)
    : (tjR.varsheshvara.viaDispute === true),
  'varṣeśvara aspect precondition respected (dispute fallback flagged when it fires)');
ok(tjR.aspects.pairs.length === 21 && !(tjR.yogas.ikkavala && tjR.yogas.induvara),
  'aspect table 21 pairs; ikkavāla/induvāra mutually exclusive');
ok(tjR.sahams.sahams.length === 12 && tjR.sahams.sahams.every(s => s.lon >= 0 && s.lon < 360),
  'all 12 sahams computed on the live annual chart');

// data discipline: every record cited; the three contested flags exist
ok(SAHAMS.every(s => s.cite) && TAJIKA_YOGAS.every(y => y.cite) && TAJIKA_ASPECT_CLASSES.every(c => c.cite) &&
  [DEEPTAMSA_RECORD, TAJIKA_TRIPLICITY, MUNTHA_RECORD, VARSHESHVARA_RECORD, SAHAM_CORRECTION_RECORD,
    VARSHA_PRAVESHA_RECORD, TRANSMISSION_NOTE].every(r => r.cite),
  'tajika-data: every record has .cite');
ok(SAHAM_CORRECTION_RECORD.contested.visvanatha.contested === true,
  'contested flag: Viśvanātha (Prakāśikā 1629) rejects the +30° correction — in-data');
ok(SAHAMS.find(s => s.key === 'mitra').contested.phrasing.contested === true,
  'contested flag: Mitra "lot of the teacher" phrasing ambiguity — in-data');
ok(VARSHESHVARA_RECORD.noAspectDispute.contested === true && VARSHESHVARA_RECORD.noAspectDispute.positions.length === 4,
  'contested flag: the four-way no-aspect varṣeśvara dispute — in-data');

// --- AI: the Indian-mirror assistant kinds (cite-bound, plain coda) ---------
import {
  buildPrasnaContext, buildPrasnaInterpretPrompt,
  buildMuhurtaContext, buildMuhurtaInterpretPrompt,
  buildTajikaContext, buildTajikaInterpretPrompt, JYOTISHI_PREAMBLE,
} from '../assets/js/core/llm-context.js';
{
  const px = buildPrasnaContext({ kind: 'prasna', question: 'test?', quesitedHouse: 7, momentUTC: '2026-01-05T12:00:00Z' });
  const mx = buildMuhurtaContext({ kind: 'muhurta' });
  const tx = buildTajikaContext({ kind: 'tajika', meta: { birthUTC: '1984-09-24T03:30:00Z', targetYear: 2026, completedYears: 42 } });
  ok([px, mx, tx].every(c => /\[F1\]/.test(c.system) && /OUTPUT CONTRACT/i.test(c.system)),
    'AI Indian mirror: all three grounded contexts are cite-bound');
  ok(/NO demonstrated validity/i.test(JYOTISHI_PREAMBLE) && /never merge/i.test(JYOTISHI_PREAMBLE),
    'AI Indian mirror: the Jyotiṣa-historian voice keeps the locked framing + compare-never-merge');
  ok([buildPrasnaInterpretPrompt(), buildMuhurtaInterpretPrompt(), buildTajikaInterpretPrompt()]
    .every(p => /no demonstrated validity|no demonstrated effect/i.test(p) && /To reflect on/.test(p) && /never prescribed/i.test(p)),
    'AI Indian mirror: all three interpret prompts carry the honest close + the plain-words coda');
}

console.log(`\n[engine-test] ${fails ? fails + ' FAILED' : 'all passed'}`);
process.exit(fails ? 1 : 0);
