// Domain boundaries, not a claim of predictive/ritual efficacy.
// Reference conventions and fixture provenance: docs/2026-10-05-domain-methods.md.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { castChart } from '../../assets/js/core/astro.js';
import { castVedic } from '../../assets/js/core/vedic.js';
import { VARA_LORDS } from '../../assets/js/core/data/vedic-data.js';
import { electionScore, rankNow, findNextElection, nextAuspiciousTime, ELECTION_SCAN_LIMITS } from '../../assets/js/core/election.js';
import { planetaryHour } from '../../assets/js/core/planetary-hours.js';
import { offsetToUTC } from '../../assets/js/core/time.js';
import { katapayadiDecode, buildSarvatobhadra, sarvatobhadraVedha } from '../../assets/js/core/yantra.js';

// Exercise the production DOM controller with a minimal DOM, not a second
// implementation of its weekday rules. Only module import wiring is replaced.
function rasaRun({ date, time, lat, lon, offset }) {
  const nodes = new Map();
  const get = id => { if (!nodes.has(id)) nodes.set(id, { value: '', innerHTML: '', textContent: '' }); return nodes.get(id); };
  for (const [key, value] of Object.entries({ date, time, lat, lon, offset })) get(`ry-sbc-${key}`).value = String(value);
  const source = readFileSync(new URL('../../assets/js/app/rasa.js', import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?;\n/gm, '').replace(/^export /gm, '');
  const context = vm.createContext({ document: { getElementById: get }, castChart, castVedic, VARA_LORDS,
    toUTC: offsetToUTC, buildSarvatobhadra, sarvatobhadraVedha, autolinkResultPanels() {} });
  vm.runInContext(`${source}\nSBC = buildSarvatobhadra(); runSBC();`, context, { timeout: 5000 });
  return { summary: get('ry-sbc-summary').innerHTML, grid: get('ry-sbc-grid').innerHTML,
    vedha: get('ry-sbc-vedha').innerHTML, status: get('ry-sbc-status').textContent };
}

export async function run() {
  const failures = [], passed = [];
  const test = (name, f) => { try { f(); passed.push(name); } catch (e) { failures.push(`${name}: ${e.message}`); } };
  test('Tokyo Thursday after sunrise is Jupiter day despite Wednesday UTC', () => {
    const chart = castChart(new Date('2026-01-07T23:00:00Z'), 35.6762, 139.6503, 'whole');
    chart.timeZone = 'Asia/Tokyo';
    const result = electionScore(chart, 'wealth');
    assert.equal(result.hour.weekday, 4); assert.equal(result.hour.dayRuler, 'Jupiter'); assert.equal(result.hour.dayMatch, true);
    assert.match(result.hour.weekdayMethod, /Asia\/Tokyo/);
    assert.ok(rankNow(chart).every(r => r.hour.dayRuler === 'Jupiter'));
  });
  test('Tokyo pre-sunrise and New York evening keep their sunrise-bounded day', () => {
    const tokyo = castChart(new Date('2026-01-07T20:00:00Z'), 35.6762, 139.6503, 'whole');
    assert.equal(electionScore(tokyo, 'knowledge', { timeZone: 'Asia/Tokyo' }).hour.dayRuler, 'Mercury');
    const ny = castChart(new Date('2026-10-06T01:00:00Z'), 40.7128, -74.006, 'whole'); ny.utcOffset = -4;
    const result = electionScore(ny, 'journey');
    assert.equal(result.hour.dayRuler, 'Moon'); assert.equal(result.hour.weekday, 1); assert.equal(result.hour.dayMatch, true);
    assert.match(result.hour.weekdayMethod, /supplied UTC offset -4/);
  });
  test('Civil Apia offset/zone overrides mean-solar fallback across the date line', () => {
    const chart = castChart(new Date('2026-10-05T00:00:00Z'), -13.8333, -171.75, 'whole');
    assert.equal(electionScore(chart, 'journey').hour.dayRuler, 'Sun'); // disclosed LMT Sunday
    chart.utcOffset = 13;
    const explicit = electionScore(chart, 'journey');
    assert.equal(explicit.hour.dayRuler, 'Moon'); assert.equal(explicit.hour.weekday, 1);
    assert.equal(electionScore(chart, 'journey', { timeZone: 'Pacific/Apia', utcOffset: -11 }).hour.dayRuler, 'Moon');
  });
  test('Polar day supplies no fabricated planetary weekday or timing bonus', () => {
    const chart = castChart(new Date('2026-06-21T12:00:00Z'), 78.2232, 15.6469, 'whole');
    assert.equal(planetaryHour(chart.date, chart.latitude, chart.longitude), null);
    const result = electionScore(chart, 'honour', { timeZone: 'Arctic/Longyearbyen' });
    assert.equal(result.hour, null);
    const reason = result.reasons.find(r => /No weekday timing score/.test(r.text));
    assert.equal(reason?.delta, 0); assert.equal(reason?.severity, 'caution'); assert.notEqual(result.verdict, 'green');
    assert.ok(rankNow(chart).every(r => r.hour === null));
  });
  test('Election scan preserves civil weekday and valid zero-hour single sample', () => {
    const start = new Date('2026-10-05T00:00:00Z');
    const windows = findNextElection('healing', start, -13.8333, -171.75, {
      hoursAhead: 0, timeZone: 'Pacific/Apia', system: 'whole', planetaryHour: { dayRuler: 'Saturn', ruler: 'Saturn' },
    });
    assert.equal(windows.length, 1); assert.equal(windows[0].start.getTime(), start.getTime());
    assert.equal(windows[0].end.getTime(), start.getTime()); assert.equal(windows[0].peak.hour.dayRuler, 'Moon');
    assert.equal(nextAuspiciousTime(start, 0, 0, { hoursAhead: 0 }), null);
  });
  test('Sub-step horizons never sample after the requested end', () => {
    const start = new Date('2026-10-05T00:00:00Z');
    const windows = findNextElection('healing', start, -13.8333, -171.75,
      { hoursAhead: 0.1, stepMinutes: 20, utcOffset: 13, system: 'whole' });
    assert.equal(windows.length, 1); assert.equal(windows[0].end.getTime(), start.getTime());
    assert.equal(nextAuspiciousTime(start, 0, 0, { hoursAhead: 0.1, stepMinutes: 20 }), null);
  });
  test('Both scan APIs reject nonfinite, zero-step and excessive work before scanning', () => {
    assert.deepEqual(ELECTION_SCAN_LIMITS, { maxHoursAhead: 168, minStepMinutes: 1, maxStepMinutes: 1440, maxSamples: 2048 });
    const date = new Date('2026-10-05T00:00:00Z');
    const scans = [o => findNextElection('healing', date, 0, 0, o), o => nextAuspiciousTime(date, 0, 0, o)];
    for (const scan of scans) {
      for (const stepMinutes of [0, -1, NaN, Infinity, '30', 1441]) assert.throws(() => scan({ stepMinutes }), RangeError);
      for (const hoursAhead of [-1, NaN, Infinity, '24', 169]) assert.throws(() => scan({ hoursAhead }), RangeError);
      assert.throws(() => scan({ hoursAhead: 168, stepMinutes: 1 }), /2048 samples/);
      for (const utcOffset of [NaN, Infinity, '5.5', 25]) assert.throws(() => scan({ utcOffset }), RangeError);
      for (const timeZone of ['', 'Mars/Olympus']) assert.throws(() => scan({ timeZone }), RangeError);
    }
    for (const [dateValue, lat, lon] of [[new Date(NaN), 0, 0], [date, NaN, 0], [date, 91, 0], [date, 0, 181]]) {
      assert.throws(() => findNextElection('healing', dateValue, lat, lon), RangeError);
      assert.throws(() => nextAuspiciousTime(dateValue, lat, lon), RangeError);
    }
    assert.deepEqual(findNextElection('talisman', date, 0, 0), []); // preserved legacy unknown-key contract
  });
  test('Kaṭapayādi reference prefixes and π verse survive NFC/NFD input equivalence', () => {
    for (const [text, expected] of [['śa', '5'], ['ṣa', '6'], ['dhīra', '29'], ['meca', '65'],
      ['bhadrāmbudhisiddhajanmagaṇitaśraddhāsmayadbhūpagīḥ', '314159265358979324']]) {
      for (const normalized of [text.normalize('NFC'), text.normalize('NFD')]) assert.equal(katapayadiDecode(normalized).value, expected);
    }
    assert.deepEqual(katapayadiDecode('dhīra'.normalize('NFD')).trace, katapayadiDecode('dhīra').trace);
  });
  test('Sarvatobhadra production UI uses the same sunrise day as the pañcāṅga', () => {
    for (const fixture of [
      { date: '2026-01-08', time: '08:00', lat: 35.6762, lon: 139.6503, offset: 9, weekday: 'Thu' },
      { date: '2026-10-05', time: '21:00', lat: 40.7128, lon: -74.006, offset: -4, weekday: 'Mon' },
      { date: '2026-10-05', time: '05:30', lat: 28.6139, lon: 77.209, offset: 5.5, weekday: 'Sun' },
      { date: '2026-10-05', time: '13:00', lat: -13.8333, lon: -171.75, offset: 13, weekday: 'Mon' },
    ]) {
      const result = rasaRun(fixture);
      assert.equal(result.status, ''); assert.ok(result.summary.includes(`(${fixture.weekday}) → weekday cell`), result.summary);
      assert.ok(result.summary.includes(`supplied UTC offset ${fixture.offset}`));
      const weekdayCell = new RegExp(`class="sc sc-tv[^\"]*sc-hi[^\"]*"[^>]*>[^<]+<span class="n">[^<]*${fixture.weekday}`);
      assert.match(result.grid, weekdayCell);
    }
  });
  test('Sarvatobhadra polar UI keeps positions but marks weekday unavailable', () => {
    const result = rasaRun({ date: '2026-06-21', time: '14:00', lat: 78.2232, lon: 15.6469, offset: 2 });
    assert.equal(result.status, ''); assert.match(result.summary, /Unavailable — no weekday cell highlighted/);
    assert.match(result.summary, /No sunrise-bounded day/); assert.doesNotMatch(result.summary, /undefined|null/);
    assert.match(result.summary, /nakṣatra/); assert.match(result.vedha, /computable reconstruction/);
  });
  test('Sarvatobhadra source warnings are visible and invalid offset cannot silently become UTC', () => {
    const fixture = { date: '2026-10-05', time: '12:00', lat: 28.6139, lon: 77.209, offset: 5.5 };
    const result = rasaRun(fixture);
    const flags = buildSarvatobhadra().accuracyFlags;
    assert.ok(result.grid.includes(flags.weekdayTithi.replaceAll('&', '&amp;').replaceAll('"', '&quot;')));
    assert.match(result.grid, /ring-2|ring 2/i);
    for (const offset of ['', 'nonsense', '5.5oops', 25]) {
      const invalid = rasaRun({ ...fixture, offset });
      assert.match(invalid.status, /explicit UTC offset/); assert.equal(invalid.summary, ''); assert.equal(invalid.vedha, '');
    }
  });
  return { pass: !failures.length, failures, passed };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.pass ? 0 : 1;
}
