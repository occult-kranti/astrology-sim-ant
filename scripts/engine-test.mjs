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

console.log(`\n[engine-test] ${fails ? fails + ' FAILED' : 'all passed'}`);
process.exit(fails ? 1 : 0);
