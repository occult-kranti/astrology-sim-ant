// Independent bounded composition/performance review; not full ephemeris validation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { compareMoment } from '../../../../assets/js/core/calendar-observatory.js';
import { castChart, norm360, houseOf } from '../../../../assets/js/core/astro.js';
import { castVedic } from '../../../../assets/js/core/vedic.js';
import { lahiriAyanamsa } from '../../../../assets/js/core/data/vedic-data.js';

const root = new URL('../../../../', import.meta.url);
const moduleURL = new URL('assets/js/core/calendar-timeline.js', root);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const original = fs.readFileSync(moduleURL, 'utf8');
const beforeHash = hash(original);
// Instrument only the canonical local-clock boundary. Do not modify application files.
let instrumented = original.replace('civilFields, zonedTimeCandidates, startOfZonedDay', 'civilFields, zonedTimeCandidates as originalCandidates, startOfZonedDay');
instrumented = instrumented.replace(/from '(\.\/[^']+)'/g, (_, p) => `from '${new URL(p, moduleURL).href}'`);
instrumented += '\nlet reviewClockCalls = 0; function zonedTimeCandidates(...args) { reviewClockCalls++; return originalCandidates(...args); } export function getReviewClockCalls() { return reviewClockCalls; }\n';
const instrumentedModule = await import('data:text/javascript;base64,' + Buffer.from(instrumented).toString('base64'));
const { buildCalendarTimelineGrid: grid, buildCalendarTimelineFrame: frame, getReviewClockCalls: calls } = instrumentedModule;
const assertions = [];
const check = (label, valid, detail) => { assertions.push({ label, passed: !!valid, ...(detail === undefined ? {} : { detail }) }); };
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const near = (a, b) => Math.abs(norm360(a - b + 180) - 180) < 1e-9;
const fixtures = [
  { id: 'london-current-regiomontanus', startDate: '2026-10-30', endDate: '2026-10-30', time: '12:00', timeZone: 'Europe/London', lat: 51.5074, lon: -0.1278, system: 'regiomontanus' },
  { id: 'delhi-sidereal-whole', startDate: '1947-08-15', endDate: '1947-08-15', time: '09:30', timeZone: 'Asia/Kolkata', lat: 28.6139, lon: 77.209, system: 'whole' },
  { id: 'tromso-polar-placidus', startDate: '2030-06-21', endDate: '2030-06-21', time: '12:00', timeZone: 'Europe/Oslo', lat: 69.6492, lon: 18.9553, system: 'placidus' },
  { id: 'historical-marker-assumed-observer', startDate: '1994-10-26', endDate: '1994-10-26', time: '18:45:30', timeZone: 'America/New_York', lat: 40.7128, lon: -74.006, system: 'equal' },
];
const measurements = [];
for (const { id, ...request } of fixtures) {
  const clockBefore = calls(), started = performance.now(), f = frame(request, 0), elapsedMs = performance.now() - started;
  const c = compareMoment(f.context), date = new Date(f.context.dateISO);
  const chart = { ...castChart(date, request.lat, request.lon, request.system), timeZone: request.timeZone };
  const vedic = castVedic(chart, { currentDate: date });
  const aya = lahiriAyanamsa(date);
  const shared = f.sky.bodies.filter(p => chart.planets[p.id]);
  check(id + ': one selected clock resolution', calls() - clockBefore === 1);
  check(id + ': exact calendar rows', equal(f.comparison.calendars, c.calendars));
  check(id + ': pane contexts share one instant', [f.comparison, f.atlas, f.sky, f.guidance].every(x => x.context.dateISO === f.context.dateISO));
  check(id + ': seven shared sky longitudes equal chart engine', shared.length === 7 && shared.every(p => near(p.longitude, chart.planets[p.id].lon)));
  check(id + ': twelve tropical cusps equal core', equal(f.charts.tropical.cusps, chart.cusps.slice(1)));
  check(id + ': angles and fallback remain canonical', f.charts.tropical.requestedSystem === request.system && f.charts.tropical.actualSystem === chart.system && near(f.charts.tropical.ascendant, chart.asc) && near(f.charts.tropical.midheaven, chart.mc) && f.charts.tropical.warning === (chart.houseWarning || null));
  check(id + ': all ten sky placements use same cusps', f.charts.tropical.placements.length === 10 && f.charts.tropical.placements.every(p => p.house === houseOf(p.longitude, chart.cusps)));
  check(id + ': nine sidereal grahas equal core', f.charts.vedic.planets.length === 9 && f.charts.vedic.planets.every(p => near(p.longitude, vedic.grahas[p.id].lon) && p.house === vedic.grahas[p.id].house));
  check(id + ': sidereal offset applied exactly once', f.charts.vedic.planets.filter(p => chart.planets[p.id]).every(p => near(chart.planets[p.id].lon - p.longitude, aya)));
  check(id + ': sidereal house1 starts at lagna sign', near(f.charts.vedic.cusps[0], Math.floor(vedic.lagna.lon / 30) * 30));
  check(id + ': no natal output projected', !['vimshottari', 'practice', 'conclusions', 'shadbala', 'vargas'].some(k => k in f.charts.vedic));
  check(id + ': sample/outcome boundaries explicit', f.sampleScope.wholeDayValidity === false && f.sampleScope.eventOutcomePrediction === false && f.purposes.every(p => p.wholeDayValidity === false && p.scoreScale.probability === false));
  measurements.push({ id, dateISO: f.context.dateISO, elapsedMs, actualHouseSystem: chart.system, houseWarning: chart.houseWarning || null, sourceCount: f.sources.length, serializedBytes: Buffer.byteLength(JSON.stringify(f)) });
}
const broad = { startDate: '2026-01-01', endDate: '2036-01-08', time: '12:00', timeZone: 'Europe/London', lat: 51.5074, lon: -0.1278, system: 'regiomontanus', includeGuidance: false };
const clockBefore = calls(), gridStarted = performance.now(), g = grid(broad), gridMs = performance.now() - gridStarted;
check('maximum grid includes exactly 3660 slots', g.slots.length === 3660 && g.counts.total === 3660);
check('maximum grid resolves exactly once per date', calls() - clockBefore === 3660);
const frameClockBefore = calls(), frameStarted = performance.now(), selected = frame(broad, 3659), selectedFrameMs = performance.now() - frameStarted;
check('maximum-range last frame resolves one slot', calls() - frameClockBefore === 1);
check('last frame reaches inclusive endpoint', selected.slot.localDate === broad.endDate);
const oneDay = { ...broad, startDate: broad.endDate, endDate: broad.endDate };
const started = performance.now(), single = frame(oneDay, 0), oneDayFrameMs = performance.now() - started;
check('range width changes no selected facts', equal(selected.comparison, single.comparison) && equal(selected.charts, single.charts) && equal(selected.sky, single.sky));
const afterHash = hash(fs.readFileSync(moduleURL));
check('engine source unchanged during probe', beforeHash === afterHash);
const receipt = { schemaVersion: 1, kind: 'independent-calendar-timeline-composition-review', generatedAt: new Date().toISOString(), environment: { node: process.version, icu: process.versions.icu, platform: process.platform }, source: { path: fileURLToPath(moduleURL), beforeHash, afterHash }, caveat: 'Canonical equality tests establish composition, not independently validated ephemerides, source truth, or predictive validity. Timing describes this single runtime/workload, not a portable performance guarantee.', assertions, measurements, performance: { maximumGridDays: g.slots.length, gridMs, maximumRangeSelectedFrameMs: selectedFrameMs, oneDayFrameMs, selectedFrameClockCalls: calls() - frameClockBefore - 1 } };
fs.writeFileSync(new URL(process.argv[2] || 'numerical-review.json', import.meta.url), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ assertions: assertions.length, failed: assertions.filter(x => !x.passed), performance: receipt.performance, measurements, source: receipt.source }, null, 2));
if (assertions.some(x => !x.passed)) process.exitCode = 1;
