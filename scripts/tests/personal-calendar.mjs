import assert from 'node:assert/strict';
import { normalizeBirthContext, buildPersonalCalendar, exportPersonalCalendar } from '../../assets/js/core/personal-calendar.js';
import { bodyPosition, castChart } from '../../assets/js/core/astro.js';
import { lahiriAyanamsa } from '../../assets/js/core/data/vedic-data.js';

export function run() {
  const failures = []; let passed = 0;
  const test = (name, fn) => { try { fn(); passed++; } catch (e) { failures.push(`${name}: ${e.message}`); } };
  const birth = { date: '1990-07-15', timeKnown: true, time: '12:30', timeZone: 'Asia/Kolkata', lat: 28.61391, lon: 77.20901 };
  const selectedInstant = '2026-10-29T12:00:00Z', input = { birth, selectedInstant };
  const delta = (a, b) => ((a - b + 540) % 360) - 180;
  test('exact local record resolves to UTC, canonical houses and independently referenced positions', () => {
    const result = buildPersonalCalendar(input);
    assert.equal(result.birthContext.instantUTC, '1990-07-15T07:00:00.000Z');
    assert.equal(result.western.houseCuspsDegrees.length, 12);
    const original = castChart(new Date(result.birthContext.instantUTC), birth.lat, birth.lon, 'regiomontanus');
    assert.equal(result.western.ascendantDegrees, original.asc);
    const fixture = buildPersonalCalendar({ ...input, birth: { ...birth, date: '2026-01-01', time: '00:00', timeZone: 'UTC' } });
    assert.ok(Math.abs(fixture.western.bodies[0].longitudeDegrees - 280.568611) < .02, 'Astrodienst 2026 tropical Jan 1 Sun');
    assert.ok(Math.abs(fixture.western.bodies[1].longitudeDegrees - 66.716667) < .02, 'Astrodienst 2026 tropical Jan 1 Moon');
    assert.ok(Math.abs(fixture.vedic.bodies[0].longitudeDegrees - 256.346667) < .03, 'Inherited selected Lahiri fixture and documented model tolerance');
    assert.ok(Object.isFrozen(result.birthInput)); assert.ok(Object.isFrozen(result.western.bodies));
  });
  test('repeated birth clock requires explicit occurrence and gaps remain rejected', () => {
    const repeated = { ...birth, date: '2026-11-01', time: '01:30', timeZone: 'America/New_York' };
    assert.throws(() => normalizeBirthContext(repeated), e => e.code === 'AMBIGUOUS_TIME');
    const early = buildPersonalCalendar({ ...input, birth: { ...repeated, disambiguation: 'earlier' } });
    const late = buildPersonalCalendar({ ...input, birth: { ...repeated, disambiguation: 'later' } });
    assert.equal(early.birthContext.instantUTC, '2026-11-01T05:30:00.000Z');
    assert.equal(late.birthContext.instantUTC, '2026-11-01T06:30:00.000Z');
    assert.equal(early.birthContext.repeatedLocalTime, true);
    assert.notEqual(early.western.ascendantDegrees, late.western.ascendantDegrees);
    assert.throws(() => normalizeBirthContext({ ...repeated, date: '2026-03-08', time: '02:30', disambiguation: 'later' }), e => e.code === 'NONEXISTENT_TIME');
  });
  test('unknown birth time preserves actual 23, 25 and fractional-hour civil days', () => {
    for (const [date, timeZone, hours] of [['2026-03-08', 'America/New_York', 23], ['2026-11-01', 'America/New_York', 25], ['2026-10-04', 'Australia/Lord_Howe', 23.5], ['2018-11-04', 'America/Sao_Paulo', 23]]) {
      const result = buildPersonalCalendar({ ...input, birth: { date, timeZone, timeKnown: false }, includeReturns: true });
      assert.equal(result.birthContext.actualHours, hours);
      assert.equal(Date.parse(result.birthContext.sampleEndUTC), Date.parse(result.birthContext.endUTCExclusive) - 1);
      assert.equal(result.birthContext.representativeIsBirthTime, false);
      for (const key of ['western', 'vedic']) {
        assert.equal(Object.hasOwn(result[key], 'ascendantDegrees'), false);
        assert.equal(Object.hasOwn(result[key], 'houseCuspsDegrees'), false);
        assert.equal(Object.hasOwn(result[key], 'vimshottari'), false);
        assert.ok(result[key].bodies.every(b => !Object.hasOwn(b, 'house') && !Object.hasOwn(b, 'longitudeDegrees') && b.representativeIsBirthPosition === false && b.sampleCount === 25));
      }
      assert.equal(result.returns.solar.status, 'unavailable'); assert.equal(result.returns.lunar.status, 'unavailable');
    }
    assert.throws(() => normalizeBirthContext({ date: '2011-12-30', timeZone: 'Pacific/Apia', timeKnown: false }), e => e.code === 'NONEXISTENT_DATE');
    const edge = buildPersonalCalendar({ ...input, birth: { date: '2100-12-31', timeKnown: false, timeZone: 'UTC' } });
    assert.equal(edge.birthContext.endUTCExclusive, '2101-01-01T00:00:00.000Z');
    assert.equal(edge.birthContext.sampleEndUTC, '2100-12-31T23:59:59.999Z');
    const moon = edge.western.bodies.find(b => b.body === 'Moon');
    assert.ok(Math.abs(delta(moon.arcEndDegrees, bodyPosition('Moon', new Date(edge.birthContext.sampleEndUTC)).lon)) < 1e-9);
  });
  test('unknown-time arcs retain wrap and multiple possible signs without guessing a natal sign', () => {
    let selectedDate;
    for (let day = 1; day <= 31; day++) {
      const date = `2026-01-${String(day).padStart(2, '0')}`;
      const at = new Date(date + 'T00:00:00Z'), end = new Date(at.getTime() + 86400000);
      if (bodyPosition('Moon', at).lon > bodyPosition('Moon', end).lon) { selectedDate = date; break; }
    }
    assert.ok(selectedDate);
    const result = buildPersonalCalendar({ ...input, birth: { date: selectedDate, timeKnown: false, timeZone: 'UTC' } });
    const moon = result.western.bodies.find(b => b.body === 'Moon');
    assert.equal(moon.crossesZero, true); assert.ok(moon.sampleSigns.includes('Pisces') && moon.sampleSigns.includes('Aries'));
    assert.ok(moon.estimatedSpanDegrees > 10 && moon.estimatedSpanDegrees < 16);
    assert.equal(Object.hasOwn(moon, 'sign'), false);
  });
  test('frame differences retain changing ayanamsha instead of treating the frames as independent evidence', () => {
    const result = buildPersonalCalendar(input), natalAt = new Date(result.birthContext.instantUTC), now = new Date(result.selectedInstant);
    const change = lahiriAyanamsa(now) - lahiriAyanamsa(natalAt);
    for (const offset of result.offsets) assert.ok(Math.abs(delta(offset.siderealDegrees, offset.tropicalDegrees - change)) < 1e-9);
    for (const system of ['placidus', 'whole', 'equal']) {
      const variant = buildPersonalCalendar({ ...input, houseSystem: system });
      assert.equal(variant.western.requestedHouseSystem, system);
      assert.equal(variant.vedic.houseSystem, 'whole-sign');
      assert.deepEqual(variant.vedic.bodies, result.vedic.bodies);
    }
  });
  test('Vimshottari never presents the engine first-period fallback outside the birth timeline', () => {
    assert.equal(buildPersonalCalendar({ ...input, selectedInstant: '1980-01-01T12:00:00Z' }).vedic.vimshottari.status, 'unavailable');
    const old = { ...birth, date: '1900-01-01', timeZone: 'UTC' };
    assert.equal(buildPersonalCalendar({ birth: old, selectedInstant: '2100-01-01T12:00:00Z' }).vedic.vimshottari.status, 'unavailable');
    const current = buildPersonalCalendar(input).vedic.vimshottari;
    assert.equal(current.status, 'traditional-calculation');
    assert.ok(new Date(selectedInstant) >= new Date(current.startUTC) && new Date(selectedInstant) < new Date(current.endUTC));
  });
  test('actual optional solar and lunar returns have bounded brackets, small residuals and real crossings', () => {
    const normal = buildPersonalCalendar(input);
    assert.equal(normal.returns.solar.status, 'unavailable'); assert.equal(normal.returns.lunar.status, 'unavailable');
    const result = buildPersonalCalendar({ ...input, includeReturns: true });
    const solar = result.returns.solar, lunar = result.returns.lunar;
    assert.equal(solar.status, 'calculated'); assert.equal(new Date(solar.instantUTC).getUTCFullYear(), 2026);
    assert.ok(Math.abs(solar.residualDegrees) < .0005);
    assert.equal(lunar.status, 'calculated'); assert.ok(Math.abs(lunar.residualDegrees) < .0002);
    assert.ok(new Date(lunar.instantUTC) > new Date(selectedInstant));
    assert.ok(new Date(lunar.instantUTC) - new Date(selectedInstant) < 32 * 86400000);
    assert.ok(new Date(lunar.bracketStartUTC) <= new Date(lunar.instantUTC) && new Date(lunar.instantUTC) <= new Date(lunar.bracketEndUTC));
    assert.ok(new Date(lunar.bracketEndUTC) - new Date(lunar.bracketStartUTC) <= 6 * 3600000);
    const at = new Date(lunar.instantUTC).getTime();
    assert.ok(delta(bodyPosition('Moon', new Date(at - 60000)).lon, lunar.targetLongitudeDegrees) < 0);
    assert.ok(delta(bodyPosition('Moon', new Date(at + 60000)).lon, lunar.targetLongitudeDegrees) > 0);
  });
  test('lunar recurrence excludes the current birth instant and the opposite-longitude discontinuity', () => {
    const natal = buildPersonalCalendar(input).birthContext.instantUTC;
    const result = buildPersonalCalendar({ ...input, selectedInstant: natal, includeReturns: true });
    const days = (new Date(result.returns.lunar.instantUTC) - new Date(natal)) / 86400000;
    assert.ok(days > 25 && days < 30, `lunar recurrence was ${days} days`);
    assert.ok(Math.abs(result.returns.lunar.residualDegrees) < .0002);
    const edge = buildPersonalCalendar({ ...input, selectedInstant: '2100-12-31T23:59:59.999Z', includeReturns: true });
    assert.equal(edge.returns.lunar.status, 'unavailable');
  });
  test('strict schemas, numeric types, invalid dates and supported ranges are enforced', () => {
    for (const extra of [{ timeKnown: 'false' }, { date: '2026-02-30' }, { date: '1899-12-31' }, { lat: '28' }, { lon: Infinity }, { lat: 90 }, { timeZone: 'Unknown/Zone' }, { disambiguation: 'guess' }, { notes: 'PRIVATE' }]) assert.throws(() => normalizeBirthContext({ ...birth, ...extra }));
    assert.throws(() => normalizeBirthContext({ date: '1900-01-01', time: '00:00', timeKnown: true, timeZone: 'Asia/Tokyo', lat: 35, lon: 139 }));
    assert.throws(() => normalizeBirthContext({ date: '2100-12-31', timeKnown: false, timeZone: 'Pacific/Honolulu' }));
    for (const extra of [{ selectedInstant: '2026-10-29' }, { selectedInstant: '2101-01-01T00:00Z' }, { includeReturns: 'true' }, { houseSystem: 'unknown' }, { apiKey: 'PRIVATE' }]) assert.throws(() => buildPersonalCalendar({ ...input, ...extra }));
    assert.throws(() => normalizeBirthContext({ date: birth.date, timeKnown: false, timeZone: birth.timeZone, time: '12:00' }));
    assert.throws(() => normalizeBirthContext({ date: birth.date, timeKnown: false, timeZone: birth.timeZone, lat: '28', lon: 77 }));
    assert.throws(() => normalizeBirthContext({ date: birth.date, timeKnown: false, timeZone: birth.timeZone, disambiguation: {} }));
  });
  test('default exports omit birth and all derived personal data; explicit exports recompute', () => {
    const exported = exportPersonalCalendar(input), text = JSON.stringify(exported);
    for (const value of [birth.date, birth.timeZone, String(birth.lat), String(birth.lon), 'ascendantDegrees', 'birthInput', 'vimshottari', 'returns']) assert.ok(!text.includes(value), value);
    const privateExport = exportPersonalCalendar(input, { includeBirth: true });
    assert.equal(privateExport.birthInput.date, birth.date); assert.equal(privateExport.birthInput.lat, birth.lat);
    assert.ok(privateExport.western.bodies.length === 2);
    assert.throws(() => exportPersonalCalendar({ ...input, western: { reading: 'Forged personal prediction' } }, { includeBirth: true }));
    assert.throws(() => exportPersonalCalendar(input, { includeBirth: 'yes' }));
    assert.throws(() => exportPersonalCalendar(input, { includeNotes: true }));
  });
  test('all calculations are deterministic, offline and independent of host timezone', () => {
    const oldFetch = globalThis.fetch, previous = process.env.TZ; let calls = 0;
    globalThis.fetch = () => { calls++; throw new Error('No network allowed'); };
    try {
      process.env.TZ = 'UTC'; const first = buildPersonalCalendar({ ...input, includeReturns: true });
      process.env.TZ = 'Pacific/Honolulu'; assert.deepEqual(buildPersonalCalendar({ ...input, includeReturns: true }), first);
      exportPersonalCalendar(input); assert.equal(calls, 0);
    } finally { globalThis.fetch = oldFetch; if (previous == null) delete process.env.TZ; else process.env.TZ = previous; }
  });
  return { pass: failures.length === 0, passed, failures };
}
if (process.argv[1]?.endsWith('personal-calendar.mjs')) { const result = run(); console.log(result); if (!result.pass) process.exitCode = 1; }
