// Shared context and live clock contracts. Published Swiss Ephemeris numeric
// fixtures are independent of our house implementation; no second engine ships.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { calculateContext, normalizeCalculationInput, parseExplicitInstant } from '../../assets/js/core/calculation-context.js';
import { createLiveClock } from '../../assets/js/app/live-clock.js';
import { resolveZonedTime } from '../../assets/js/core/time.js';
import { renderVedicPanel } from '../../assets/js/app/vedic-panel.js';

const BASE = { dateISO: '2026-10-05T12:00:00Z', lat: 51.5074, lon: -0.1278 };
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
function harness(options = {}) {
  let id = 0, instant = Date.parse(BASE.dateISO);
  const timers = new Map(), results = [], states = [];
  const clock = createLiveClock({ now: () => instant, setTimer: (fn, ms) => { timers.set(++id, { fn, ms }); return id; },
    clearTimer: key => timers.delete(key), onTick: date => date.toISOString(), onResult: result => results.push(result),
    onState: state => states.push(state), ...options });
  return { clock, timers, results, states, async advance() { const [key, value] = timers.entries().next().value; timers.delete(key); instant += value.ms; value.fn(); await flush(); } };
}

export async function run() {
  const failures = [], passed = [];
  const test = async (name, fn) => { try { await fn(); passed.push(name); } catch (e) { failures.push(`${name}: ${e.message}`); } };
  await test('explicit offsets normalize without host-zone parsing, preserving seconds and milliseconds', () => {
    assert.equal(parseExplicitInstant('2026-10-05T17:30:12.125+05:30').toISOString(), '2026-10-05T12:00:12.125Z');
    assert.equal(parseExplicitInstant('2026-10-05T08:00-04:00').toISOString(), '2026-10-05T12:00:00.000Z');
    for (const dateISO of ['2026-10-05', '2026-10-05T12:00', '2026-02-30T12:00Z', '2026-10-05T24:00Z', '2026-10-05T12:00+24:00', '2026-10-05T12:00+05:99']) assert.throws(() => parseExplicitInstant(dateISO));
  });
  await test('signed astronomical years retain the historical study range without claiming modern precision', () => {
    for (const iso of ['-001999-01-01T00:00:00.000Z', '-000043-03-15T12:00:00.000Z', '0000-01-01T00:00:00.000Z', '3000-12-31T23:59:59.000Z']) assert.equal(parseExplicitInstant(iso).toISOString(), iso);
    for (const iso of ['-002000-12-31T23:59Z', '3001-01-01T00:00Z', '-000000-01-01T00:00Z']) assert.throws(() => parseExplicitInstant(iso));
    const context = calculateContext({ ...BASE, dateISO: '-000043-03-15T12:00Z', includeReading: false, includeVedic: false });
    assert.notEqual(context.methods.era.grade, 'casting');
    assert.match(context.methods.accuracy, /not a blanket historical/);
  });
  await test('strict input boundary rejects coercion, incomplete birth, unknown time and unsupported methods', () => {
    for (const bad of [{ lat: '' }, { lon: NaN }, { lat: 91 }, { system: 'invented' }, { includeReading: 'false' }, { quesitedHouse: 0 }, { operationKey: 'unknown' }, { timeZone: 'Mars/Olympus' }, { utcOffset: Infinity }, { disambiguation: 'guess' }, { timeKnown: false }, { birth: {} }, { birth: { ...BASE, timeKnown: false } }]) assert.throws(() => normalizeCalculationInput({ ...BASE, ...bad }));
    assert.equal(normalizeCalculationInput(BASE).birth, null);
  });
  await test('date-line ISO civil offset is retained instead of silently assigning mean-solar Sunday', () => {
    const input = { dateISO: '2026-10-05T13:00:00+13:00', lat: -13.8333, lon: -171.75, system: 'whole', includeReading: false, includeVedic: false };
    const context = calculateContext(input);
    assert.equal(context.inputs.dateISO, '2026-10-05T00:00:00.000Z');
    assert.equal(context.inputs.utcOffset, 13);
    assert.equal(context.planetaryHour.dayRuler, 'Moon');
    assert.match(context.planetaryHour.weekdayMethod, /supplied UTC offset 13/);
    assert.deepEqual(normalizeCalculationInput(context.inputs), context.inputs);
    assert.equal(calculateContext(context.inputs).planetaryHour.dayRuler, 'Moon');
  });
  await test('DST fold resolves explicitly and its choice survives normalized inputs and export', () => {
    assert.throws(() => resolveZonedTime('2026-11-01', '01:30', 'America/New_York'));
    const early = resolveZonedTime('2026-11-01', '01:30', 'America/New_York', { disambiguation: 'earlier' });
    const late = resolveZonedTime('2026-11-01', '01:30', 'America/New_York', { disambiguation: 'later' });
    assert.equal(late.instant - early.instant, 3600000);
    const context = calculateContext({ ...BASE, dateISO: late.instant.toISOString(), timeZone: 'America/New_York', utcOffset: late.offsetHours, disambiguation: 'later', sectAwareFortune: true });
    assert.equal(context.inputs.dateISO, '2026-11-01T06:30:00.000Z');
    assert.equal(context.reading.meta.normalizedInputs.disambiguation, 'later');
    assert.equal(context.reading.meta.inputs.sectAwareFortune, true);
    assert.equal(context.reading.lots.sectAware, true);
    assert.match(context.planetaryHour.weekdayMethod, /America\/New_York/);
    assert.throws(() => resolveZonedTime('2026-03-08', '02:30', 'America/New_York'));
  });
  await test('independent Swiss house fixtures pass through the shared public calculation boundary', () => {
    const fixture = JSON.parse(readFileSync(new URL('./fixtures/swiss-houses-2026.json', import.meta.url), 'utf8'));
    for (const item of fixture.cases) {
      const context = calculateContext({ dateISO: fixture.instant, lat: item.latitude, lon: item.longitude,
        system: item.system === 'P' ? 'placidus' : 'regiomontanus', includeReading: false, includeVedic: false });
      item.cusps.forEach((expected, i) => assert.ok(Math.abs(((context.chart.cusps[i + 1] - expected + 540) % 360) - 180) < 0.001));
    }
  });
  await test('actual polar house fallback and unavailable sunrise remain explicit', () => {
    const context = calculateContext({ ...BASE, dateISO: '2026-06-21T12:00Z', lat: 80, system: 'placidus' });
    assert.equal(context.methods.requestedHouseSystem, 'placidus');
    assert.equal(context.methods.houseSystem, context.chart.system);
    assert.notEqual(context.chart.system, 'placidus');
    assert.ok(context.methods.houseWarning);
    assert.equal(context.planetaryHour, null);
    assert.equal(context.reading.moment.planetaryHour, null);
    assert.throws(() => calculateContext({ ...BASE, lat: 90 }));
  });
  await test('birth Vedic source and reference instant are shared with reading and panel', async () => {
    const input = { ...BASE, birth: { dateISO: '1990-01-01T05:00Z', lat: 28.6139, lon: 77.209, timeZone: 'Asia/Kolkata', utcOffset: 5.5 }, referenceDateISO: '2027-04-01T00:00Z' };
    const context = calculateContext(input);
    assert.equal(context.reading.vedic, context.vedic);
    assert.equal(context.methods.vedic.chartSource, 'birth');
    assert.equal(context.methods.vedic.referenceDateISO, '2027-04-01T00:00:00.000Z');
    assert.equal(context.birthChart.date.toISOString(), '1990-01-01T05:00:00.000Z');
    const body = { innerHTML: '', querySelector: () => null };
    assert.equal(renderVedicPanel(body, context.birthChart, { precomputedVedic: context.vedic, currentDate: new Date(context.inputs.referenceDateISO) }), context.vedic);
    assert.ok(body.innerHTML.includes('Reference day'));
    const later = calculateContext({ ...input, referenceDateISO: '2028-04-01T00:00Z' });
    assert.equal(later.chart.planets.Sun.lon, context.chart.planets.Sun.lon, 'reference time must not move chart instant');
    assert.notDeepEqual(later.vedic.vimshottari, context.vedic.vimshottari);
    await flush();
  });
  await test('optional calculations can be omitted without false results and serialized snapshots retain their instant', () => {
    const context = calculateContext({ ...BASE, includeReading: false, includeVedic: false });
    assert.equal(context.reading, null); assert.equal(context.vedic, null);
    assert.equal(context.methods.vedic.included, false);
    const exported = JSON.parse(JSON.stringify(context));
    assert.equal(exported.chart.date, exported.inputs.dateISO);
    const body = { innerHTML: '' };
    assert.equal(renderVedicPanel(body, context.chart, { precomputedVedic: null }), null);
    assert.match(body.innerHTML, /unavailable/);
  });
  await test('clock starts once, updates without overlap and cancels its timer on pause', async () => {
    const h = harness(); h.clock.start(); h.clock.start(); await flush();
    assert.equal(h.results.length, 1); assert.equal(h.timers.size, 1);
    await h.advance(); assert.equal(h.results.length, 2);
    h.clock.pause(); assert.equal(h.timers.size, 0); assert.equal(h.clock.state.status, 'paused');
    h.clock.resume(); await flush(); assert.equal(h.results.length, 3); h.clock.stop();
    assert.equal(h.timers.size, 0); assert.equal(h.clock.state.status, 'idle');
  });
  await test('pause/settings replacement suppresses late async results and invalidates their signal', async () => {
    const jobs = [];
    const h = harness({ onTick: (date, token) => new Promise(resolve => jobs.push({ resolve, token })) });
    h.clock.start(); assert.equal(h.timers.size, 0);
    h.clock.pause(); assert.equal(jobs[0].token.signal.aborted, true);
    h.clock.resume(); jobs[0].resolve('stale settings'); await flush();
    assert.deepEqual(h.results, []); assert.equal(h.clock.state.status, 'running');
    jobs[1].resolve('new settings'); await flush(); assert.deepEqual(h.results, ['new settings']);
    assert.equal(h.timers.size, 1); h.clock.stop();
  });
  await test('hidden suspension cancels pending work; manual paused state stays distinct', async () => {
    const h = harness(); h.clock.start(); await flush(); h.clock.suspend();
    assert.equal(h.clock.state.status, 'suspended'); assert.equal(h.timers.size, 0);
    h.clock.resume(); await flush(); assert.equal(h.results.length, 2);
    h.clock.pause(); h.clock.suspend(); assert.equal(h.clock.state.status, 'paused'); h.clock.stop();
  });
  await test('clock failures stop scheduling and require an explicit resume', async () => {
    let fail = true; const errors = [];
    const h = harness({ onTick: () => { if (fail) throw new Error('invalid input'); return 'recovered'; }, onError: e => errors.push(e.message) });
    h.clock.start(); await flush(); assert.equal(h.clock.state.status, 'error');
    assert.equal(h.timers.size, 0); assert.deepEqual(errors, ['invalid input']);
    fail = false; h.clock.resume(); await flush(); assert.deepEqual(h.results, ['recovered']); h.clock.stop();
    assert.throws(() => createLiveClock({ onTick() {}, intervalMs: 0 }));
  });
  return { pass: failures.length === 0, failures, passed };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.pass ? 0 : 1;
}
