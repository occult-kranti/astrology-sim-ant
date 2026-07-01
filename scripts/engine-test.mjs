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
import { buildGeomancyContext, buildTarotContext, buildIchingContext, buildGeomancyInterpretPrompt, buildTarotInterpretPrompt, buildIchingInterpretPrompt, geomancyDataBlock, tarotDataBlock, ichingDataBlock, DIVINER_PREAMBLE } from '../assets/js/core/llm-context.js';
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

console.log(`\n[engine-test] ${fails ? fails + ' FAILED' : 'all passed'}`);
process.exit(fails ? 1 : 0);
