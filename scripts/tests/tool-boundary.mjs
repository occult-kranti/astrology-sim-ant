// Browser assistant calls are untrusted JSON. Test the actual dispatcher before
// allowing expensive scans, explicit oracle values or current-chart fallback.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { buildToolSchema, runTool, toolNames } from '../../assets/js/core/llm-context.js';
import { castChart } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import { filterEntries } from '../../assets/js/core/confluence.js';

export async function run() {
  const failures = [], passed = [];
  const test = (name, fn) => { try { fn(); passed.push(name); } catch (e) { failures.push(`${name}: ${e.message}`); } };
  const place = { date: '2026-10-05T13:00:00+13:00', lat: -13.8333, lon: -171.75, system: 'whole' };
  const chart = castChart(new Date('2026-10-05T00:00Z'), place.lat, place.lon, 'whole'); chart.utcOffset = 13;
  const birthChart = castChart(new Date('1990-01-01T05:00Z'), 28.6139, 77.209, 'whole'); birthChart.timeZone = 'Asia/Kolkata';
  const ctx = { chart, birthChart };

  test('Every advertised tool has a strict JSON boundary and consistent public names', () => {
    const schemas = buildToolSchema();
    assert.equal(new Set(schemas.map(t => t.function.name)).size, schemas.length);
    assert.deepEqual([...new Set(toolNames())].sort(), schemas.map(t => t.function.name).sort());
    for (const { function: f } of schemas) {
      assert.equal(f.parameters.additionalProperties, false);
      for (const args of [null, [], 'not an object', { unexpected: true }]) assert.throws(() => runTool(f.name, args, ctx));
    }
    assert.throws(() => runTool('__proto__', {}));
    assert.throws(() => runTool('rankNow', Object.create({ inherited: true }), ctx));
  });
  test('Registry chart-shaped signatures are replaced by actual scalar inputs or context', () => {
    for (const name of ['electionScore', 'talismanRecipe', 'annualProfection', 'lifeTrajectory', 'detectYogas']) {
      const p = buildToolSchema().find(t => t.function.name === name).function.parameters;
      assert.ok(p.properties.date && p.properties.lat && p.properties.lon);
      assert.equal(p.properties.chart, undefined); assert.equal(p.properties.birthChart, undefined); assert.equal(p.properties.opts, undefined);
    }
    assert.ok(runTool('electionScore', { operationKey: 'healing' }, ctx).scoreMethod.includes('editorial'));
    assert.deepEqual(runTool('rankNow', {}, ctx), runTool('rankNow', place));
    assert.deepEqual(runTool('rankNow', { system: 'equal' }, ctx), runTool('rankNow', { ...place, system: 'equal' }));
    assert.equal(ctx.chart.system, 'whole', 'tool options must not mutate the current page chart');
    for (const args of [{ date: place.date }, { lat: 0 }, { date: place.date, lon: 0 }, { chart: {} }]) assert.throws(() => runTool('rankNow', args, ctx));
    assert.throws(() => runTool('rankNow', {}), /current chart/);
  });
  test('Civil dates require valid explicit instants and strict numeric geographic coordinates', () => {
    for (const date of ['2026-10-05', '2026-10-05T12:00', '2026-02-30T12:00Z', '0042-02-29T12:00Z', '2026-01-01T24:00Z', '3001-01-01T00:00Z']) {
      assert.throws(() => runTool('castChart', { ...place, date }));
    }
    for (const lat of [NaN, Infinity, '28.6', null, 91]) assert.throws(() => runTool('castChart', { ...place, lat }));
    for (const extra of [{ lon: 181 }, { system: 'koch' }, { utcOffset: Infinity }, { timeZone: 'Mars/Olympus' }]) assert.throws(() => runTool('castChart', { ...place, ...extra }));
    assert.equal(runTool('planetaryHour', { ...place }).dayRuler, 'Moon');
    assert.equal(runTool('planetaryHour', { date: '2026-06-21T12:00Z', lat: 90, lon: 0 }), null);
  });
  test('Boolean, enum, bounded text and integer arguments are never coerced', () => {
    for (const isDay of [1, 'false', null]) assert.throws(() => runTool('essentialDignity', { planet: 'Sun', lon: 10, isDay }));
    for (const args of [{ planet: 'Pluto', lon: 10, isDay: true }, { planet: 'Sun', lon: Infinity, isDay: true }]) assert.throws(() => runTool('essentialDignity', args));
    assert.throws(() => runTool('bhavaPhala', { graha: 'Moon', bhava: 1.2 }));
    assert.throws(() => runTool('annualProfection', { age: 151 }, ctx));
    assert.throws(() => runTool('defineTerm', { term: 'x'.repeat(2001) }));
    assert.throws(() => runTool('electionScore', { operationKey: 'talisman' }, ctx));
    assert.ok(runTool('mansionOf', { lon: 210 }).num > 0);
  });
  test('Election request of zero hours stays one instant; bounded scans reject before work', () => {
    const result = runTool('findNextElection', { ...place, operationKey: 'healing', hoursAhead: 0 });
    assert.equal(result.length, 1); assert.equal(+result[0].start, +chart.date); assert.equal(+result[0].end, +chart.date);
    for (const extra of [{ hoursAhead: -1 }, { hoursAhead: 169 }, { hoursAhead: NaN }, { stepMinutes: 0 }, { stepMinutes: Infinity }, { hoursAhead: 168, stepMinutes: 1 }]) {
      assert.throws(() => runTool('findNextElection', { operationKey: 'healing', ...extra }, ctx));
    }
    assert.throws(() => runTool('findNextElection', { ...place, date: '3000-12-31T23:59Z', operationKey: 'healing', hoursAhead: 168 }));
    assert.throws(() => runTool('momentScan', { fromISO: place.date, lat: 0, lon: 0, hours: 169 }));
    assert.throws(() => runTool('momentScan', { fromISO: place.date, lat: 0, lon: 0, hours: 0 }));
    assert.throws(() => runTool('greatConjunctions', { fromYear: -1999, toYear: 3000 }), /200-year/);
    assert.throws(() => runTool('timelords', { birthISO: place.date, lat: 0, lon: 0, ageYears: Infinity }));
    assert.throws(() => runTool('transitHits', { birthISO: place.date, lat: 0, lon: 0, months: '12' }));
  });
  test('Oracle arrays reject nonfinite, sparse, duplicate and wrong-count values before RNG', () => {
    let draws = 0; const rng = { rand: () => { draws++; return 0; } };
    for (const throws of [[6, 7, 8, 9, NaN, 6], [6, 7, 8, 9, 5, 6], [6, 7, 8, 9, '6', 6], new Array(6), [6]]) {
      assert.throws(() => runTool('castIChing', { throws }, rng));
    }
    for (const tallies of [new Array(16), Array(16).fill(Infinity), Array(16).fill(0), Array(17).fill(1)]) assert.throws(() => runTool('castGeomancy', { tallies }, rng));
    for (const seedDraws of [[1, 1, 2], [0, 1, 24], [1], [1, NaN, 2]]) assert.throws(() => runTool('castRunes', { count: 3, seedDraws }, rng));
    assert.equal(draws, 0);
    assert.ok(runTool('castIChing', { throws: [9, 7, 8, 6, 7, 8] }).primary.num > 0);
    assert.equal(runTool('castRunes', { count: 1, seedDraws: [0] }).staves.length, 1);
    assert.throws(() => runTool('drawTarot', {}, { rand: () => NaN }), /RNG/);
  });
  test('Legacy atlas export dispatches the advertised filtered query with real cited data', () => {
    const result = runTool('layoutConfluence', { q: 'Sirr' });
    assert.equal(result.count, filterEntries({ q: 'Sirr' }).length);
    assert.ok(result.entries.some(e => e.slug === 'sirr-i-akbar'));
    assert.deepEqual(result, runTool('confluence_atlas', { q: 'Sirr' }));
    assert.ok(result.citation && result.caveat);
  });
  test('Vedic chart, practice and yoga tools use explicit or current-chart reference time', () => {
    const expected = castVedic(birthChart, { currentDate: chart.date });
    const v = runTool('castVedic', {}, ctx);
    assert.equal(v.referenceDateISO, chart.date.toISOString());
    assert.equal(v.dasha.maha, expected.vimshottari.currentMaha); assert.equal(v.dasha.antar, expected.vimshottari.currentAntar);
    assert.match(v.methodNote, /not validated numerical equivalence/); assert.doesNotMatch(v.system, /Jagannath Hora/);
    const referenceDate = '2027-04-01T00:00:00Z';
    const expectedLater = castVedic(birthChart, { currentDate: new Date(referenceDate) });
    const later = runTool('castVedic', { referenceDate }, ctx);
    assert.equal(later.referenceDateISO, '2027-04-01T00:00:00.000Z'); assert.equal(later.dasha.antar, expectedLater.vimshottari.currentAntar);
    const practice = runTool('vedicPractice', { referenceDate }, ctx);
    assert.deepEqual(practice.vara, expectedLater.practice.vara);
    assert.equal(runTool('detectYogas', { referenceDate }, ctx).referenceDateISO, later.referenceDateISO);
    const explicit = runTool('castVedic', place);
    assert.equal(explicit.referenceDateISO, chart.date.toISOString());
    assert.deepEqual(runTool('castVedic', place), explicit);
  });
  return { pass: !failures.length, failures, passed };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.pass ? 0 : 1;
}
