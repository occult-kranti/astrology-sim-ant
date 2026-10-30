import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { CALENDAR_TIMELINE_LIMITS, normalizeCalendarTimelineRequest, buildCalendarTimelineGrid, buildCalendarTimelineFrame, exportCalendarTimelineJSON, exportCalendarTimelineCSV } from '../../assets/js/core/calendar-timeline.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { buildSkySnapshot } from '../../assets/js/core/sky-dynamics.js';
import { castChart, houseOf } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import { toSidereal } from '../../assets/js/core/data/vedic-data.js';

const BASE = { startDate: '2026-10-30', endDate: '2026-10-30', time: '00:00', timeZone: 'Europe/London', lat: 51.5074, lon: -.1278, system: 'regiomontanus' };
const delta = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const grid = patch => buildCalendarTimelineGrid({ ...BASE, ...patch });
const frame = patch => buildCalendarTimelineFrame({ ...BASE, ...patch }, 0);
function sourceReferences(value, out = []) {
  if (value && typeof value === 'object') {
    if (Array.isArray(value.sourceIds)) out.push(...value.sourceIds);
    for (const child of Object.values(value)) sourceReferences(child, out);
  }
  return out;
}

export async function run() {
  let count = 0; const failures = [];
  const check = (label, fn) => { count++; try { fn(); } catch (error) { failures.push(label + ': ' + error.message); } };
  const rejected = (patch, label) => check(label, () => assert.throws(() => normalizeCalendarTimelineRequest({ ...BASE, ...patch })));
  check('Explicit normalized defaults and no caller mutation', () => {
    const before = JSON.stringify(BASE), result = normalizeCalendarTimelineRequest(BASE);
    assert.equal(result.time, '00:00:00'); assert.equal(result.disambiguation, 'reject'); assert.equal(result.includeCatalogStars, false); assert.equal(result.includeGuidance, true);
    assert.deepEqual(normalizeCalendarTimelineRequest(result), result); assert.equal(JSON.stringify(BASE), before);
  });
  for (const [field, values] of Object.entries({ lat: [null, '51', NaN, Infinity, 90, -90, 91], lon: [null, '0', NaN, 181], time: [null, 12, '2:00', '24:00', '12:00:60', '12:00Z'], timeZone: [null, '', 'Made/Up'], system: [undefined, null, 'whole-sign'], disambiguation: [null, 'compatible'], includeGuidance: [null, 1, 'true'], includeCatalogStars: [null, 0, 'false'], prayerMethod: [null, 'invented'], asr: [null, 'invented'], highLatitude: [null, 'invented'] })) {
    for (const value of values) rejected({ [field]: value }, 'Reject malformed ' + field + ' ' + String(value));
  }
  for (const patch of [{ startDate: '2026-02-30' }, { startDate: '1900-02-29' }, { startDate: '1899-12-31' }, { endDate: '2101-01-01' }, { startDate: '2026-10-31' }, { startDate: new Date('2026-10-30') }, { startDate: '2026-1-1' }, { startDate: '2020-01-01', endDate: '2030-01-08' }]) rejected(patch, 'Reject invalid or oversized civil range ' + JSON.stringify(patch));
  for (const key of ['purpose', 'militaryPurpose', 'country', 'birth', 'dateISO', 'comparison', 'stepDays', 'sampleTime']) rejected({ [key]: 'not-accepted' }, 'Reject undeclared field ' + key);
  check('Symbol, nonenumerable and accessor request fields rejected before getter execution', () => {
    assert.throws(() => normalizeCalendarTimelineRequest({ ...BASE, [Symbol('extra')]: true }));
    assert.throws(() => normalizeCalendarTimelineRequest(Object.defineProperty({ ...BASE }, 'includeGuidance', { value: true })));
    let reads = 0;
    assert.throws(() => normalizeCalendarTimelineRequest(Object.defineProperty({ ...BASE }, 'lat', { enumerable: true, get() { reads++; return 51; } })));
    assert.equal(reads, 0);
    assert.throws(() => normalizeCalendarTimelineRequest(Object.assign(Object.create({ hidden: true }), BASE)));
  });
  check('The maximum grid contains 3660 inclusive slots', () => {
    const result = grid({ startDate: '2020-01-01', endDate: '2030-01-07' });
    assert.equal(result.counts.total, CALENDAR_TIMELINE_LIMITS.maxDays); assert.equal(result.slots.at(-1).localDate, '2030-01-07');
    assert.equal(result.counts.available + result.counts.ambiguous + result.counts.unavailable, 3660);
    assert.ok(result.slots.every(s => !Object.hasOwn(s, 'comparison')));
  });
  check('Leap dates and non-leap century retain inclusive civil arithmetic', () => {
    assert.deepEqual(grid({ startDate: '2028-02-28', endDate: '2028-03-01' }).slots.map(s => s.localDate), ['2028-02-28', '2028-02-29', '2028-03-01']);
    assert.equal(grid({ startDate: '2100-02-28', endDate: '2100-03-01' }).slots.length, 2);
    assert.equal(grid({}).slots.length, 1);
  });
  check('NY spring gap stays unavailable for every disambiguation choice', () => {
    for (const disambiguation of ['reject', 'earlier', 'later']) {
      const result = grid({ startDate: '2026-03-08', endDate: '2026-03-08', time: '02:30', timeZone: 'America/New_York', disambiguation }).slots[0];
      assert.equal(result.status, 'unavailable'); assert.equal(result.code, 'NONEXISTENT_TIME'); assert.equal(result.selectedDateISO, null); assert.deepEqual(result.candidates, []);
    }
  });
  check('NY fall fold preserves both candidates; explicit occurrence selects without discarding either', () => {
    const request = { startDate: '2026-11-01', endDate: '2026-11-01', time: '01:30', timeZone: 'America/New_York' };
    const ambiguous = grid(request).slots[0]; assert.equal(ambiguous.status, 'ambiguous'); assert.equal(ambiguous.code, 'AMBIGUOUS_TIME'); assert.equal(ambiguous.selectedDateISO, null);
    assert.deepEqual(ambiguous.candidates.map(c => c.dateISO), ['2026-11-01T05:30:00.000Z', '2026-11-01T06:30:00.000Z']);
    assert.deepEqual(ambiguous.candidates.map(c => c.offsetSeconds), [-14400, -18000]);
    for (const [disambiguation, occurrence] of [['earlier', 1], ['later', 2]]) {
      const selected = grid({ ...request, disambiguation }).slots[0]; assert.equal(selected.selectedOccurrence, occurrence); assert.equal(selected.selectedDateISO, ambiguous.candidates[occurrence - 1].dateISO); assert.equal(selected.candidates.length, 2);
    }
  });
  check('Apia skipped civil day remains in place between its neighbors', () => {
    const result = grid({ startDate: '2011-12-29', endDate: '2011-12-31', time: '12:00', timeZone: 'Pacific/Apia' });
    assert.equal(result.slots[1].code, 'NONEXISTENT_DATE'); assert.equal(result.slots[1].index, 1); assert.equal(result.slots[2].localDate, '2011-12-31'); assert.equal(result.counts.unavailable, 1);
  });
  check('Fixed local noon has 23/25-hour elapsed intervals over DST transitions', () => {
    for (const [startDate, endDate, hours] of [['2026-03-07', '2026-03-08', 23], ['2026-10-31', '2026-11-01', 25]]) {
      const result = grid({ startDate, endDate, time: '12:00', timeZone: 'America/New_York' });
      assert.equal((Date.parse(result.slots[1].selectedDateISO) - Date.parse(result.slots[0].selectedDateISO)) / 3600000, hours); assert.equal(result.sampling.fixedElapsedUTCStep, false);
    }
  });
  check('Half-hour DST fold retains actual 30-minute difference', () => {
    const result = grid({ startDate: '2026-04-05', endDate: '2026-04-05', time: '01:45', timeZone: 'Australia/Lord_Howe' }).slots[0];
    assert.equal(result.status, 'ambiguous'); assert.equal((Date.parse(result.candidates[1].dateISO) - Date.parse(result.candidates[0].dateISO)) / 60000, 30);
  });
  check('A supported local boundary may resolve outside UTC coverage without substitution', () => {
    for (const patch of [{ startDate: '1900-01-01', endDate: '1900-01-01', time: '00:00', timeZone: 'Pacific/Auckland' }, { startDate: '2100-12-31', endDate: '2100-12-31', time: '23:59', timeZone: 'Pacific/Honolulu' }]) {
      const result = grid(patch).slots[0]; assert.equal(result.code, 'UTC_RANGE'); assert.equal(result.status, 'unavailable'); assert.ok(result.selectedDateISO); assert.equal(result.candidates[0].withinSupportedUTC, false);
    }
  });
  for (const index of [undefined, null, '0', NaN, .5, -1, 1]) check('Reject noninteger/out-of-range selected index ' + String(index), () => assert.throws(() => buildCalendarTimelineFrame(BASE, index)));
  const selected = frame({ includeCatalogStars: true }), input = selected.context;
  check('Selected frame shares normalized instant, observer and convention across engines', () => {
    for (const block of [selected.comparison, selected.atlas, selected.sky, selected.guidance]) for (const key of ['dateISO', 'lat', 'lon', 'timeZone']) assert.equal(block.context[key], input[key]);
    assert.equal(selected.slot.selectedDateISO, input.dateISO); assert.equal(selected.sampleScope.eventOutcomePrediction, false); assert.equal(selected.sampleScope.wholeDayValidity, false);
  });
  check('Canonical comparison and sky preserve complete numerical and provenance outputs', () => {
    assert.deepEqual(selected.comparison, compareMoment(input));
    assert.deepEqual(selected.sky, buildSkySnapshot(input, { includeCatalogStars: true }));
    assert.equal(selected.comparison.calendars.length, 13); assert.equal(selected.sky.bodies.length, 10); assert.equal(selected.sky.catalogStars.length, 20); assert.equal(selected.sky.catalogue.license, 'CC BY-SA 4.0');
  });
  const fixtures = JSON.parse(readFileSync(new URL('./fixtures/sky-horizons-angles.json', import.meta.url))).fixtures.filter(f => f.dateISO === '2026-10-30T00:00:00Z');
  for (const fixture of fixtures) check('Inherited independent JPL selected-date fixture, 1 arcminute: ' + fixture.body, () => {
    const body = selected.sky.bodies.find(b => b.id === fixture.body);
    assert.ok(delta(body.longitude, fixture.longitude) < 1 / 60); assert.ok(Math.abs(body.latitude - fixture.latitude) < 1 / 60);
  });
  for (const system of ['regiomontanus', 'placidus', 'whole', 'equal']) check('All ten planets use canonical twelve-cusp geometry: ' + system, () => {
    const result = frame({ system, includeGuidance: false }), chart = castChart(new Date(result.context.dateISO), BASE.lat, BASE.lon, system);
    assert.deepEqual(result.charts.tropical.cusps, chart.cusps.slice(1)); assert.equal(result.charts.tropical.placements.length, 10);
    for (const p of result.charts.tropical.placements) assert.equal(p.house, houseOf(p.longitude, chart.cusps));
    assert.equal(result.guidance, null); assert.equal(result.guidanceStatus, 'not-requested'); assert.deepEqual(result.purposes, []);
  });
  check('Nine compact Vedic grahas and whole-sign cusps match canonical cast; no natal outputs', () => {
    const date = new Date(input.dateISO), canonical = castVedic({ ...castChart(date, input.lat, input.lon, input.system), timeZone: input.timeZone }, { currentDate: date });
    assert.equal(selected.charts.vedic.planets.length, 9); assert.deepEqual(selected.charts.vedic.lagna, canonical.lagna); assert.deepEqual(selected.charts.vedic.panchanga, canonical.panchanga);
    for (const p of selected.charts.vedic.planets) { assert.equal(p.longitude, canonical.grahas[p.id].lon); assert.equal(p.house, canonical.grahas[p.id].house); }
    for (const p of selected.charts.vedic.planets.filter(p => !['Rahu', 'Ketu'].includes(p.id))) assert.ok(delta(p.longitude, toSidereal(selected.sky.bodies.find(b => b.id === p.id).longitude, date)) < 1e-10);
    assert.equal(selected.charts.vedic.cusps[0], canonical.lagna.rashiIndex * 30); assert.equal(selected.charts.vedic.cusps.length, 12);
    for (const key of ['vimshottari', 'vargas', 'shadbala', 'practice', 'conclusions']) assert.equal(Object.hasOwn(selected.charts.vedic, key), false);
  });
  check('Polar missing hours and requested/actual house fallback remain explicit', () => {
    const polar = frame({ startDate: '2026-06-21', endDate: '2026-06-21', time: '12:00', timeZone: 'Arctic/Longyearbyen', lat: 78.2232, lon: 15.6469, system: 'placidus' });
    assert.equal(polar.charts.tropical.requestedSystem, 'placidus'); assert.equal(polar.charts.tropical.actualSystem, 'regiomontanus'); assert.equal(polar.charts.tropical.status, 'partial'); assert.ok(polar.charts.tropical.warning);
    assert.equal(polar.comparison.planetaryHours.status, 'unavailable'); const profile = polar.purposes.find(p => p.id === 'mercury-hour-study'); assert.equal(profile.score, null); assert.equal(profile.scoreDenominator, 1); assert.equal(profile.missing.length, 1);
  });
  check('Unresolved opening-portion yoga remains missing in complete-case editorial profile', () => {
    const result = frame({ startDate: '2026-10-29', endDate: '2026-10-29', time: '17:30', timeZone: 'Asia/Kolkata', lat: 28.6139, lon: 77.209 });
    const profile = result.purposes.find(p => p.id === 'jyotisha-classification-study'); assert.equal(profile.score, null); assert.equal(profile.scoreDenominator, 6); assert.ok(profile.missing.some(m => m.id === 'DG-J-YOGA'));
  });
  check('Unavailable selected clock carries no invented chart and keeps rule missingness', () => {
    const missing = frame({ startDate: '2026-03-08', endDate: '2026-03-08', time: '02:30', timeZone: 'America/New_York' });
    for (const key of ['context', 'comparison', 'atlas', 'sky', 'charts', 'guidance', 'astronomicalEvents']) assert.equal(missing[key], null);
    assert.equal(missing.purposes.length, 4); assert.ok(missing.purposes.every(p => p.score === null && p.missing.length === p.total));
    assert.ok(missing.studyTasks.filter(t => t.profileId).every(t => t.status === 'unavailable' && t.score === null));
  });
  check('Source IDs close over inherited qualified ledgers; disabled guidance remains sourced', () => {
    for (const result of [selected, frame({ includeGuidance: false })]) {
      const ids = new Set(result.sources.map(s => s.id)); assert.equal(ids.size, result.sources.length);
      for (const id of sourceReferences(result)) assert.ok(ids.has(id), id);
      assert.ok(result.sources.find(s => s.id === 'OBS-MUHURTA').primaryPassageVerification === 'pending');
    }
  });
  check('Study tasks are mapped to named profiles, with dialogue and ceremony unimplemented', () => {
    assert.equal(selected.studyTasks.length, 5);
    for (const task of selected.studyTasks.filter(t => t.profileId)) assert.equal(task.score, selected.purposes.find(p => p.id === task.profileId).score);
    for (const id of ['dialogue', 'ceremony']) { const task = selected.studyTasks.find(t => t.id === id); assert.equal(task.status, 'unimplemented'); assert.equal(task.score, null); }
  });
  check('Nearby astronomy uses solved lunar quarters/seasons within bounded window', () => {
    const result = frame({ startDate: '2026-03-20', endDate: '2026-03-20', time: '12:00', timeZone: 'UTC' }).astronomicalEvents;
    assert.equal(Date.parse(result.endISO) - Date.parse(result.startISO), 32 * 86400000); assert.ok(result.events.some(e => e.kind === 'solar-quarter')); assert.ok(result.events.some(e => e.kind === 'lunar-quarter'));
    assert.ok(result.events.every(e => e.dateISO >= result.startISO && e.dateISO <= result.endISO));
    const equinox = result.events.find(e => e.label === 'March equinox'); assert.ok(Math.abs(Date.parse(equinox.dateISO) - Date.parse('2026-03-20T14:46:00Z')) < 120000);
  });
  check('Boundary frames stay supported and nearby event windows clip explicitly', () => {
    for (const date of ['1900-01-01', '2100-12-31']) { const result = frame({ startDate: date, endDate: date, timeZone: 'UTC', time: '12:00', includeGuidance: false }); assert.equal(result.status, 'available'); assert.equal(result.astronomicalEvents.clippedToSupportedRange, true); assert.ok(result.astronomicalEvents.events.every(e => e.dateISO >= '1900-' && e.dateISO < '2101-')); }
  });
  check('Export recomputes exact frame and CSV retains scope, units, provenance and unavailable evidence', () => {
    const request = { ...BASE, includeCatalogStars: true };
    assert.deepEqual(JSON.parse(exportCalendarTimelineJSON(request, 0)), selected);
    const csv = exportCalendarTimelineCSV(request, 0); assert.ok(csv.includes('civil-calendar')); assert.ok(csv.includes('catalog-star')); assert.ok(csv.includes('editorial-profile')); assert.ok(csv.includes('CT-METHODS')); assert.ok(csv.includes('not a whole-day verdict')); assert.ok(csv.endsWith('\r\n'));
    assert.throws(() => exportCalendarTimelineJSON({ ...request, comparison: selected.comparison }, 0));
    const missing = exportCalendarTimelineCSV({ ...BASE, startDate: '2011-12-30', endDate: '2011-12-30', timeZone: 'Pacific/Apia', time: '12:00' }, 0); assert.ok(missing.includes('NONEXISTENT_DATE')); assert.ok(missing.includes('unavailable')); assert.ok(!missing.includes('"sky-body"'));
  });
  check('Host timezone and network/current clock state do not determine explicit frames', () => {
    const oldTZ = process.env.TZ, oldFetch = globalThis.fetch;
    try { globalThis.fetch = () => { throw new Error('Unexpected network access'); }; process.env.TZ = 'Pacific/Honolulu'; const first = frame({ includeGuidance: false }); process.env.TZ = 'Asia/Tokyo'; assert.deepEqual(frame({ includeGuidance: false }), first); }
    finally { globalThis.fetch = oldFetch; if (oldTZ === undefined) delete process.env.TZ; else process.env.TZ = oldTZ; }
  });
  return { pass: failures.length === 0, count, failures };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} calendar timeline: ${result.count} checks`); result.failures.forEach(f => console.error(f)); process.exitCode = result.pass ? 0 : 1;
}
