// Independent published fixtures + regressions for the October 2026 fixes.
// Sources/tolerances are recorded in docs/2026-10-calculation-methods.md.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { civilFields, offsetToUTC, resolveZonedTime, validLocation, zonedCivilDay } from '../../assets/js/core/time.js';
import { bodyPosition, castChart, formatLon, houses, untimedPositions } from '../../assets/js/core/astro.js';
import { toSidereal } from '../../assets/js/core/data/vedic-data.js';
import { sunriseDay, planetaryHour } from '../../assets/js/core/planetary-hours.js';
import { aspectBetween } from '../../assets/js/core/aspects.js';
import { castVedic } from '../../assets/js/core/vedic.js';

export async function run() {
  const failures = [], passed = [];
  const test = (name, f) => { try { f(); passed.push(name); } catch (e) { failures.push(`${name}: ${e.message}`); } };
  test('Gregorian parser rejects overflow rather than changing the civil date', () => {
    for (const date of ['2026-02-29', '2024-02-30', '1900-02-29', '2026-04-31', '2026-13-01']) assert.throws(() => civilFields(date, '12:00'), RangeError);
    for (const time of ['24:00', '12:60', '12:30:60', '']) assert.throws(() => civilFields('2026-01-01', time), RangeError);
    assert.equal(civilFields('2000-02-29').day, 29);
  });
  test('Years 0–99 and BCE are preserved; offset rollover is exact', () => {
    assert.equal(offsetToUTC('0042-01-01', '00:00', 0).toISOString(), '0042-01-01T00:00:00.000Z');
    assert.equal(offsetToUTC('0000-02-29', '00:00', 0).getUTCFullYear(), 0);
    assert.equal(offsetToUTC('-000001-01-01', '00:00', 0).getUTCFullYear(), -1);
    assert.equal(offsetToUTC('2026-01-01', '00:00', 5.75).toISOString(), '2025-12-31T18:15:00.000Z');
    for (const off of ['', null, NaN, Infinity, 25]) assert.throws(() => offsetToUTC('2026-01-01', '00:00', off));
  });
  test('Published Temporal LA 2018 fold requires an explicit occurrence', () => {
    assert.throws(() => resolveZonedTime('2018-11-04', '01:30', 'America/Los_Angeles'), e => e.code === 'AMBIGUOUS_TIME');
    assert.equal(resolveZonedTime('2018-11-04', '01:30', 'America/Los_Angeles', { disambiguation: 'earlier' }).instant.toISOString(), '2018-11-04T08:30:00.000Z');
    assert.equal(resolveZonedTime('2018-11-04', '01:30', 'America/Los_Angeles', { disambiguation: 'later' }).instant.toISOString(), '2018-11-04T09:30:00.000Z');
  });
  test('Published missing California hour and Samoa skipped day are rejected', () => {
    assert.throws(() => resolveZonedTime('2018-03-11', '02:30', 'America/Los_Angeles'), e => e.code === 'NONEXISTENT_TIME');
    assert.throws(() => resolveZonedTime('2011-12-30', '12:00', 'Pacific/Apia'), e => e.code === 'NONEXISTENT_TIME');
    assert.throws(() => resolveZonedTime('2026-01-01', '12:00', 'Mars/Olympus'));
    assert.equal(resolveZonedTime('2026-01-01', '00:00', 'Asia/Kathmandu').offsetHours, 5.75);
  });
  test('Date-only intervals include a midnight DST gap and exclude skipped dates', () => {
    const day = zonedCivilDay('2018-11-04', 'America/Sao_Paulo');
    assert.equal(day.start.toISOString(), '2018-11-04T03:00:00.000Z');
    assert.equal(day.end.toISOString(), '2018-11-05T02:00:00.000Z');
    assert.equal(day.end - day.start, 23 * 3600000);
    assert.throws(() => zonedCivilDay('2011-12-30', 'Pacific/Apia'), e => e.code === 'NONEXISTENT_DATE');
    assert.equal(zonedCivilDay('2011-12-29', 'Pacific/Apia').end.toISOString(), '2011-12-30T10:00:00.000Z');
  });
  test('Longitude display rounds through the sign/year boundary', () => {
    assert.equal(formatLon(359.999), "0°00' Aries");
    assert.equal(formatLon(29.9999, true), "0°00'00\" Taurus");
    assert.equal(formatLon(-0.00001, true), "0°00'00\" Aries");
    assert.throws(() => formatLon(Infinity));
  });
  test('Astrodienst 2026 tropical ephemeris: 6 independent planet positions within 0.02°', () => {
    const date = new Date('2026-01-01T00:00:00Z');
    const fixture = { Sun: 280.568611, Moon: 66.716667, Mercury: 268.65, Venus: 279.2, Mars: 282.683333, Saturn: 356.166667 };
    for (const [name, expected] of Object.entries(fixture)) {
      const actual = bodyPosition(name, date).lon;
      assert.ok(Math.abs(actual - expected) < 0.02, `${name}: ${actual} versus ${expected}`);
    }
    assert.ok(Math.abs(toSidereal(bodyPosition('Sun', date).lon, date) - 256.346667) < 0.03, 'Lahiri modern fixture <0.03°; not a historical accuracy claim');
  });
  test('Retrograde convention and circular speed are stable across Aries', () => {
    assert.equal(bodyPosition('Mercury', new Date('2026-03-01T00:00:00Z')).retrograde, true);
    assert.equal(bodyPosition('Mercury', new Date('2026-01-01T00:00:00Z')).retrograde, false);
    const sun = bodyPosition('Sun', new Date('2026-03-20T12:00:00Z'));
    assert.ok(sun.speed > 0.9 && sun.speed < 1.1);
  });
  test('Explicit aspect orbs change the wheel selection without changing traditional defaults', () => {
    const a = { lon: 359, speed: 1 }, b = { lon: 2, speed: 0 };
    assert.equal(aspectBetween('Sun', a, 'Moon', b, { orbOverride: 2 }), null);
    assert.equal(aspectBetween('Sun', a, 'Moon', b, { orbOverride: 3 }).orb, 3);
    assert.ok(aspectBetween('Sun', a, 'Moon', b).allowance > 3);
    assert.throws(() => aspectBetween('Sun', a, 'Moon', b, { orbOverride: NaN }));
  });
  test('House inputs reject nonfinite positions; polar Placidus discloses actual system', () => {
    const date = new Date('2026-01-01T00:00:00Z');
    for (const lat of [NaN, Infinity, 91]) assert.throws(() => validLocation(lat, 0));
    assert.throws(() => houses(date, 0, 0, 'invented'));
    assert.throws(() => houses(date, 90, 0, 'whole'), /undefined/);
    assert.throws(() => houses(date, -90, 0, 'placidus'), /undefined/);
    const polar = houses(date, 70, 0, 'placidus');
    assert.equal(polar.requestedSystem, 'placidus'); assert.equal(polar.system, 'regiomontanus');
    assert.match(polar.houseWarning, /Regiomontanus/);
  });
  test('Independent Swiss Ephemeris Placidus/Regiomontanus: 72 cusps within 0.001°', () => {
    const fixture = JSON.parse(readFileSync(new URL('./fixtures/swiss-houses-2026.json', import.meta.url), 'utf8'));
    for (const item of fixture.cases) {
      const h = houses(new Date(fixture.instant), item.latitude, item.longitude, item.system === 'P' ? 'placidus' : 'regiomontanus');
      item.cusps.forEach((expected, i) => assert.ok(Math.abs(((h.cusps[i + 1] - expected + 540) % 360) - 180) < 0.001, `${item.system} latitude ${item.latitude} cusp ${i + 1}`));
    }
  });
  test('Sect uses actual solar altitude, independent of selected houses', () => {
    // London 1 Jan 2026 09:00 UTC: Sun already above the horizon while whole-sign
    // house placement previously labeled night. Solar altitude ~5.3°, well away
    // from refraction/limb conventions; alternate house systems must agree.
    for (const system of ['whole', 'equal', 'regiomontanus', 'placidus']) {
      const chart = castChart(new Date('2026-01-01T09:00:00Z'), 51.5074, -0.1278, system);
      assert.equal(chart.isDay, true); assert.ok(chart.sunAltitude > 5 && chart.sunAltitude < 6);
    }
  });
  test('Unknown-time output includes a day range and no angles, houses or sect', () => {
    const result = untimedPositions(new Date('2026-01-01T00:00:00Z'), new Date('2026-01-02T00:00:00Z'));
    assert.equal(result.timeKnown, false); assert.equal(Object.keys(result.planets).length, 7);
    for (const forbidden of ['asc', 'mc', 'cusps', 'houses', 'isDay', 'dignities']) assert.equal(forbidden in result, false);
    assert.ok(result.planets.Moon.maxDelta - result.planets.Moon.minDelta > 10);
    assert.throws(() => untimedPositions(new Date(2), new Date(1)));
  });
  test('Sunrise-defined weekday follows location across UTC date line and before sunrise', () => {
    // UTC Wednesday evening is already Thursday morning in Tokyo; Wednesday
    // 20:00Z is before Thursday sunrise, Wednesday 23:00Z is after it.
    const before = sunriseDay(new Date('2026-01-07T20:00:00Z'), 35.6762, 139.6503, { timeZone: 'Asia/Tokyo' });
    const after = sunriseDay(new Date('2026-01-07T23:00:00Z'), 35.6762, 139.6503, { timeZone: 'Asia/Tokyo' });
    assert.equal(before.weekday, 3); assert.equal(after.weekday, 4);
    assert.equal(planetaryHour(new Date('2026-01-07T23:00:00Z'), 35.6762, 139.6503).dayRuler, 'Jupiter');
    assert.equal(sunriseDay(new Date('2026-06-21T12:00:00Z'), 78.2232, 15.6469), null);
  });
  test('Panchang vara is unavailable during polar day instead of inventing a UTC weekday', () => {
    const chart = castChart(new Date('2026-06-21T12:00:00Z'), 78.2232, 15.6469, 'whole');
    const result = castVedic(chart);
    assert.equal(result.panchanga.vara.name, 'Unavailable'); assert.equal(result.panchanga.vara.lord, null);
  });
  return { pass: !failures.length, failures, passed };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.pass ? 0 : 1;
}
