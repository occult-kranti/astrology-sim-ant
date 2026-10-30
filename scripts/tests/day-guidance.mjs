import { pathToFileURL } from 'node:url';
import { buildDayGuidance, buildHourlyGuidance, explainCalendarChoice } from '../../assets/js/core/day-guidance.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';

export async function run() {
  const failures = []; let count = 0;
  const ok = (condition, message) => { count++; if (!condition) failures.push(message); };
  const throws = (fn, message, code) => { try { fn(); ok(false, message); } catch (error) { ok(!code || error.code === code, `${message} (${error.code || error.message})`); } };
  const input = { dateISO: '2026-10-29T12:00:00Z', lat: 28.6139, lon: 77.209, timeZone: 'Asia/Kolkata' };
  const guide = buildDayGuidance(input), rules = guide.traditions.flatMap(t => t.items), lookup = id => rules.find(r => r.id === id);
  ok(JSON.stringify(guide) === JSON.stringify(buildDayGuidance(input)), 'Explicit input yields deterministic guidance without a current clock');
  ok(guide.sampleScope.wholeDayValidity === false && rules.every(r => r.wholeDayValidity === false && r.scope === 'sampled-instant'), 'No sample is relabelled as a whole-day verdict');
  ok(new Set(rules.map(r => r.id)).size === rules.length && rules.length === 11, 'Every selected rule has a unique stable identity');
  ok(rules.every(r => ['favorable', 'caution', 'neutral', 'unavailable'].includes(r.classification)), 'Every output uses a bounded named class');
  ok(rules.every(r => r.optionalAction.text && /modern editorial/.test(r.optionalAction.status)), 'Concrete actions are optional editorial reflections, not fabricated book quotations');
  const sources = new Set(guide.sources.map(s => s.id));
  ok(rules.every(r => r.sourceIds.length && r.sourceIds.every(id => sources.has(id)) && Object.keys(r.thresholds).length), 'Every selected class has resolvable sources and explicit thresholds');
  ok(rules.every(r => r.fixedStarsUsed === false && r.housesUsed === false) && guide.sharedMeasurements.fixedStarsUsed.length === 0, 'No historical fixed-star or house output contaminates the selected guide');
  ok(!('score' in guide) && rules.every(r => !('score' in r)), 'No cross-tradition or within-tradition net score is produced');
  const yoga = lookup('DG-J-YOGA');
  ok(yoga.classification === 'unavailable' && yoga.applicability === 'timing-unresolved' && yoga.computed.applicableAtInstant === null, 'Parigha opening portion remains unresolved at Delhi 2026-10-29T12Z');
  ok(yoga.thresholds.openingGhatis === 30 && yoga.thresholds.openingTimingComputed === false, 'Parigha exact inherited rule threshold is retained without inventing its start time');
  ok(lookup('DG-J-TITHI').classification === 'caution' && lookup('DG-J-NAKSHATRA').classification === 'favorable', 'Known Riktā and soft-nakshatra testimonies retain their different classifications');
  ok(guide.tensions.some(t => t.traditionId === 'jyotisha-muhurta' && t.itemIds.includes('DG-J-TITHI') && t.itemIds.includes('DG-J-NAKSHATRA')), 'Competing testimonies remain visible instead of being averaged away');
  ok(lookup('DG-H-TEMPORAL').classification === 'neutral', 'A named planetary hour is not inherently declared favorable or bad');
  ok(lookup('DG-W-SPEED').computed.absoluteSpeedDegreesPerDay >= lookup('DG-W-SPEED').thresholds.referenceMeanDegreesPerDay && lookup('DG-W-SPEED').classification === 'favorable', 'Actual sampled Moon speed meets the displayed favorable study threshold');
  ok(lookup('DG-W-LIGHT').classification === 'neutral' && lookup('DG-W-LIGHT').computed.elongationDegrees >= 180, 'Waning does not become a universal caution/bad-day class');
  for (const id of ['DG-W-APPLY-MARS', 'DG-W-APPLY-SATURN']) {
    const r = lookup(id), a = r.computed.aspect;
    ok(r.classification !== 'caution' || (a?.applying && ['Conjunction', 'Square', 'Opposition'].includes(a.aspect) && a.orb <= a.allowance), `${id} cannot claim a caution without the actual applying in-orb hard aspect`);
    ok(r.thresholds.allowanceDegrees === (r.thresholds.moonFullOrbDegrees + r.thresholds.otherPlanetFullOrbDegrees) / 2, `${id} exposes the actual planetary half-orb allowance`);
  }
  const forged = compareMoment(input); forged.calendars[0].text = 'A bad date'; forged.vedic.traditionalScreens.limbs.yoga.ruleVerdict = 'favourable';
  ok(JSON.stringify(buildDayGuidance(forged)) === JSON.stringify(guide), 'Labels and imported derived claims cannot override recalculation from the explicit context');
  ok(guide.civilCalendarPolicy.includes('no auspiciousness'), 'Civil dates have an explicit non-interpretive boundary');
  const civil = explainCalendarChoice('hebrew', input);
  ok(civil.classification === 'unavailable' && civil.boundary === 'civil-midnight' && civil.limitations.some(x => /sunset/.test(x)), 'Calendar drilldown does not invent a Hebrew fortune or sunset religious date');
  throws(() => explainCalendarChoice('invented', input), 'Unsupported civil-calendar drilldown rejected');
  const eclipse = buildDayGuidance({ ...input, dateISO: '2024-04-08T18:17:00Z' });
  const eclipseRules = eclipse.traditions.flatMap(t => t.items);
  ok(eclipseRules.find(r => r.id === 'DG-W-SOLAR').classification === 'favorable' && eclipseRules.find(r => r.id === 'DG-J-TITHI').classification === 'caution', 'New-Moon solar dignity and tithi caution can disagree without a universal reconciliation');
  ok(eclipse.tensions.some(t => t.id === 'DG-TENSION-CAZIMI-SOURCES' && t.sourceIds.includes('DG-AGRIPPA-29')), 'Actual cazimi sample surfaces the broad Agrippa versus numerical Lilly exception source difference');
  const pole = buildDayGuidance({ ...input, dateISO: '2026-06-21T12:00:00Z', lat: 89, lon: 0, timeZone: 'UTC' });
  ok(pole.traditions.find(t => t.id === 'temporal-hours').items[0].classification === 'unavailable', 'Polar missing solar interval does not produce a planetary-hour action theme');
  throws(() => buildDayGuidance({ ...input, dateISO: '2026-02-30T12:00:00Z' }), 'Invalid date rejected before guidance');
  throws(() => buildDayGuidance({ ...input, dateISO: '2026-10-29T12:00:00' }), 'Implicit local timestamp rejected');
  const hourly = (date, zone = 'America/New_York', lat = 40.71, lon = -74) => buildHourlyGuidance({ ...input, dateISO: `${date}T12:00:00Z`, date, lat, lon, timeZone: zone });
  const normal = hourly('2026-10-29'), spring = hourly('2026-03-08'), fall = hourly('2026-11-01');
  ok(normal.actualDayHours === 24 && normal.rows.length === 24, 'Ordinary local day has 24 real-hour intervals');
  ok(spring.actualDayHours === 23 && spring.rows.length === 23 && spring.clockSlots.find(s => s.localClock === '02:00').status === 'unavailable', 'New York spring gap retains 23 real hours and an explicitly missing 02:00');
  const repeat = fall.rows.filter(r => r.localClock === '01:00:00');
  ok(fall.actualDayHours === 25 && fall.rows.length === 25 && repeat.length === 2, 'New York autumn fold retains both 01:00 intervals in its 25-hour day');
  ok(repeat[0].occurrence === 1 && repeat[1].occurrence === 2 && repeat[0].offsetSeconds === -4 * 3600 && repeat[1].offsetSeconds === -5 * 3600, 'Fold occurrences retain distinct actual UTC offsets');
  const short = hourly('2026-10-04', 'Australia/Lord_Howe', -31.55, 159.08), long = hourly('2026-04-05', 'Australia/Lord_Howe', -31.55, 159.08);
  ok(short.actualDayHours === 23.5 && short.rows.some(r => r.localClock === '02:30:00' && r.durationMinutes === 30), 'Lord Howe half-hour forward shift creates a real 02:30 partial interval');
  ok(long.actualDayHours === 24.5 && long.rows.some(r => r.localClock === '01:30:00' && r.durationMinutes === 30 && r.occurrence === 2), 'Lord Howe half-hour backward shift retains the repeated partial hour');
  for (const report of [normal, spring, fall, short, long]) {
    ok(report.rows[0].startISO === report.startISO && report.rows.at(-1).endISO === report.endISO && report.rows.every((r, i, a) => i === 0 || a[i - 1].endISO === r.startISO), `${report.date}/${report.timeZone} intervals partition the exact civil day without holes/overlaps`);
    ok(report.rows.every(r => r.status === 'unavailable' || r.guidance.context.dateISO === r.startISO), `${report.date}/${report.timeZone} rules use their actual segment-start sample`);
  }
  throws(() => hourly('2011-12-30', 'Pacific/Apia', -13.83, -171.75), 'Skipped Samoa civil date is rejected instead of shifted', 'NONEXISTENT_DATE');
  ok(hourly('2026-10-29', 'Pacific/Kiritimati', 1.87, -157.4).rows[0].localDate === '2026-10-29', 'Date-line hourly guide starts on the selected observer civil date');
  ok(JSON.stringify(fall).length < 1500000, 'Full lazy hourly report remains bounded below the MCP-sized response envelope');
  const tz = process.env.TZ;
  try { process.env.TZ = 'UTC'; const first = JSON.stringify(buildDayGuidance(input)); process.env.TZ = 'Pacific/Honolulu'; ok(first === JSON.stringify(buildDayGuidance(input)), 'Device/host timezone does not alter source-guided classifications'); }
  finally { if (tz === undefined) delete process.env.TZ; else process.env.TZ = tz; }
  return { pass: failures.length === 0, failures, count };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} day guidance: ${result.count} checks`); result.failures.forEach(f => console.error(f)); process.exitCode = result.pass ? 0 : 1;
}
