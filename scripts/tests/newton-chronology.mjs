import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { buildNewtonChronology, buildNewtonExplorationFrame, buildNewtonYearSurvey, exportNewtonExplorationJSON, exportNewtonExplorationCSV, serializeNewtonExplorationCSV, exportNewtonYearSurveyJSON, exportNewtonYearSurveyCSV } from '../../assets/js/core/newton-chronology.js';
import { NEWTON_CHRONOLOGY_SCENARIOS, NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS } from '../../assets/js/core/data/newton-chronology-sources.js';
import { buildCalendarTimelineFrame } from '../../assets/js/core/calendar-timeline.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { easter } from '../../assets/js/core/cultural-calendars.js';
import { gregorianToJDN, julianToJDN } from '../../assets/js/core/calendar.js';
import { startOfZonedDay } from '../../assets/js/core/time.js';
import { SunPosition, MoonPhase } from '../../assets/js/lib/astronomy.js';

const FRAME = { date: '2060-07-01', time: '12:00', timeZone: 'Europe/London', lat: 51.5074, lon: -.1278, system: 'regiomontanus', disambiguation: 'reject' };
const SURVEY = { year: 2060, time: '12:00', timeZone: 'Europe/London', lat: 51.5074, lon: -.1278, system: 'regiomontanus', disambiguation: 'reject' };
const angularDelta = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
function sourceRefs(value, ids = []) { if (value && typeof value === 'object') { if (Array.isArray(value.sourceIds)) ids.push(...value.sourceIds); for (const child of Object.values(value)) sourceRefs(child, ids); } return ids; }
function forbiddenKeys(value) { if (!value || typeof value !== 'object') return []; return Object.entries(value).flatMap(([key, child]) => [...(['guidance', 'purposes', 'studyTasks', 'score', 'ranking'].includes(key) ? [key] : []), ...forbiddenKeys(child)]); }

export async function run() {
  let count = 0; const failures = [];
  const test = (label, fn) => { count++; try { fn(); } catch (error) { failures.push(label + ': ' + error.message); } };
  const chronology = buildNewtonChronology();
  test('Only two sourced arithmetic branches, with separate referents and bounds', () => {
    assert.equal(chronology.scenarios.length, 2); assert.deepEqual(chronology.scenarios.map(s => s.id), NEWTON_CHRONOLOGY_SCENARIOS.map(s => s.id));
    const lower = chronology.scenarios.find(s => s.id === 'newton-2060-lower-bound'), upper = chronology.scenarios.find(s => s.id === 'newton-2370-upper-bound');
    assert.equal(lower.derivation.computedYear, 2060); assert.equal(lower.interval.lowerInclusiveCEYear, 2060); assert.equal(lower.interval.upperInclusiveCEYear, null);
    assert.equal(upper.derivation.computedYear, 2370); assert.equal(upper.interval.lowerInclusiveCEYear, null); assert.equal(upper.interval.upperInclusiveCEYear, 2370); assert.equal(upper.explorationSupport.resultYearWithinCanonicalRange, false);
    assert.equal(Object.hasOwn(chronology, 'combinedInterval'), false); assert.equal(Object.hasOwn(chronology, 'prediction'), false);
    for (const s of chronology.scenarios) { assert.equal(s.interval.exactDate, null); assert.equal(s.interval.exactInstantUTC, null); assert.equal(s.explorationSupport.automaticallySelectedDate, null); assert.equal(s.derivation.arithmeticAgreement, true); }
  });
  test('Symbolic days, day-year interpretation and CE arithmetic have distinct units', () => {
    const steps = chronology.scenarios[0].derivation.steps;
    assert.equal(steps.find(s => s.id === 'symbolic-months').result, 42 * 30);
    assert.equal(steps.find(s => s.id === 'equivalent-symbolic-years').result, 3.5 * 360);
    const interpretation = steps.find(s => s.id === 'day-year-interpretation'); assert.equal(interpretation.inputUnit, 'symbolic days'); assert.equal(interpretation.outputUnit, 'interpreted years'); assert.equal(interpretation.physicalUnitConversion, false);
    assert.equal(steps.at(-1).expression, '800 + 1260 = 2060');
    assert.ok(chronology.limitations.some(x => x.includes('360-day') && x.includes('1260')));
  });
  test('Textual difficulties are copied unchanged rather than repaired or combined', () => {
    assert.deepEqual(chronology.textualVariants, NEWTON_CHRONOLOGY_TEXTUAL_VARIANTS); assert.equal(chronology.textualVariants.length, 4);
    assert.ok(chronology.textualVariants.every(v => v.calculationEligible === false));
    const text = JSON.stringify(chronology.textualVariants); assert.ok(text.includes('2090')); assert.ok(text.includes('1374')); assert.ok(text.includes('2132'));
    assert.ok(!chronology.scenarios.some(s => [2016, 2034, 2090, 2132].includes(s.resultYear)));
  });
  test('Anchor perturbation is a labelled modern sensitivity check, not a historical alternative', () => {
    const values = chronology.scenarios[0].sensitivity; assert.deepEqual(values.map(x => x.calculatedCEYear), [2059, 2060, 2061]); assert.deepEqual(values.map(x => x.historicalClaim), [false, true, false]);
    assert.equal(chronology.identifiability.identifiableFromCalendarLabels, false); assert.ok(chronology.identifiability.nullControl.includes('belief is not an input'));
  });
  test('Selecting one branch does not change source data or fabricate source claims', () => {
    const before = JSON.stringify(NEWTON_CHRONOLOGY_SCENARIOS), one = buildNewtonChronology({ scenarioIds: ['newton-2370-upper-bound'] });
    assert.equal(one.scenarios.length, 1); one.scenarios[0].anchor.year = 1; assert.equal(JSON.stringify(NEWTON_CHRONOLOGY_SCENARIOS), before);
  });
  for (const raw of [null, [], { anchorYear: 800 }, { scenarioIds: [] }, { scenarioIds: null }, { scenarioIds: ['missing'] }, { scenarioIds: ['newton-2060-lower-bound', 'newton-2060-lower-bound'] }]) test('Reject malformed/undeclared chronology selection ' + JSON.stringify(raw), () => assert.throws(() => buildNewtonChronology(raw)));
  test('Nested scenario array accessors, holes, symbols, custom keys and prototypes never execute', () => {
    let reads = 0; const ids = ['newton-2060-lower-bound']; Object.defineProperty(ids, 0, { enumerable: true, get() { reads++; return 'newton-2060-lower-bound'; } }); assert.throws(() => buildNewtonChronology({ scenarioIds: ids })); assert.equal(reads, 0);
    for (const bad of [new Array(1), Object.assign(['newton-2060-lower-bound'], { extra: true }), Object.assign(['newton-2060-lower-bound'], { [Symbol.iterator]: () => { throw new Error('Must not execute'); } }), new (class extends Array {})('newton-2060-lower-bound')]) assert.throws(() => buildNewtonChronology({ scenarioIds: bad }));
  });
  for (const [fn, base] of [[buildNewtonExplorationFrame, FRAME], [buildNewtonYearSurvey, SURVEY]]) {
    for (const field of Object.keys(base)) test(`${fn.name}: missing explicit ${field} rejected`, () => { const raw = { ...base }; delete raw[field]; assert.throws(() => fn(raw)); });
    for (const field of ['belief', 'deity', 'militaryObjective', 'purpose', 'country', 'birth', 'chart', 'comparison', 'dateISO', 'includeGuidance']) test(`${fn.name}: unknown ${field} rejected`, () => assert.throws(() => fn({ ...base, [field]: 'untrusted' })));
    test(`${fn.name}: outer descriptor guards precede getter invocation`, () => { let reads = 0; assert.throws(() => fn(Object.defineProperty({ ...base }, 'lat', { enumerable: true, get() { reads++; return 51; } }))); assert.equal(reads, 0); assert.throws(() => fn({ ...base, [Symbol('hidden')]: true })); assert.throws(() => fn(Object.defineProperty({ ...base }, 'timeZone', { enumerable: false, value: 'UTC' }))); assert.throws(() => fn(Object.assign(Object.create({ inherited: true }), base))); });
  }
  for (const patch of [{ date: '2060-02-30' }, { date: '1900-02-29' }, { date: '2100-02-29' }, { date: '2370-01-01' }, { date: '0000-01-01' }, { date: '0800-01-01' }, { time: null }, { time: '24:00' }, { lat: '51' }, { lat: 90 }, { lon: Infinity }, { timeZone: 'Invalid/Zone' }, { system: 'made-up' }, { disambiguation: null }, { includeCatalogStars: 'true' }]) test('Frame rejects invalid supported arithmetic/context ' + JSON.stringify(patch), () => assert.throws(() => buildNewtonExplorationFrame({ ...FRAME, ...patch })));
  for (const year of [null, '2060', 2060.5, 0, -1, 800, 1899, 2101, 2370]) test('Survey rejects unsupported/noninteger year ' + year, () => assert.throws(() => buildNewtonYearSurvey({ ...SURVEY, year })));
  const frame = buildNewtonExplorationFrame({ ...FRAME, includeCatalogStars: true });
  test('Frame preserves canonical astronomy/calendars at an explicitly assumed sample', () => {
    const canonical = buildCalendarTimelineFrame({ startDate: FRAME.date, endDate: FRAME.date, time: FRAME.time, timeZone: FRAME.timeZone, lat: FRAME.lat, lon: FRAME.lon, system: FRAME.system, disambiguation: FRAME.disambiguation, includeCatalogStars: true, includeGuidance: false }, 0);
    for (const key of ['context', 'comparison', 'atlas', 'sky', 'charts', 'slot', 'astronomicalEvents']) assert.deepEqual(frame[key], canonical[key]);
    assert.equal(frame.comparison.calendars.length, 13); assert.equal(frame.sky.bodies.length, 10); assert.equal(frame.sky.catalogStars.length, 20); assert.equal(frame.assumption.newtonSuppliedDay, false); assert.equal(frame.assumption.newtonSuppliedClock, false); assert.equal(frame.scope.outcomeScoreCalculated, false); assert.deepEqual(forbiddenKeys(frame), []);
  });
  test('Explicit Julian/Gregorian and Julian-day-noon conventions survive composition', () => {
    const j2000 = buildNewtonExplorationFrame({ ...FRAME, date: '2000-01-01', time: '12:00', timeZone: 'UTC' }); assert.equal(j2000.comparison.astronomy.julianDayUTC, 2451545);
    const parts = Object.fromEntries(j2000.comparison.calendars.find(c => c.id === 'julian').parts.map(p => [p.type, p.value])); assert.equal(julianToJDN(+parts.year, +parts.month, +parts.day), gregorianToJDN(2000, 1, 1));
    assert.equal(buildNewtonExplorationFrame({ ...FRAME, date: '2000-02-29', timeZone: 'UTC' }).status, 'available');
  });
  test('Both computus examples retain canonical values and unavailable authority scope', () => {
    for (const event of frame.projectedObservances) { const canonical = easter(2060, event.nativeCalendar); assert.equal(event.date, `${canonical.gregorian.y}-${String(canonical.gregorian.m).padStart(2, '0')}-${String(canonical.gregorian.d).padStart(2, '0')}`); assert.equal(event.exactStartUTC, null); assert.equal(event.publishedCommunitySchedule, false); }
    assert.deepEqual(frame.projectedObservances.map(e => e.date), ['2060-04-18', '2060-04-25']); assert.equal(frame.observanceCoverage.otherReligiousObservances, 'unavailable');
  });
  test('Unresolved fold is not an assumed event instant; explicit later occurrence is preserved', () => {
    const raw = { ...FRAME, date: '2027-11-07', time: '01:30', timeZone: 'America/New_York' }, unresolved = buildNewtonExplorationFrame(raw), later = buildNewtonExplorationFrame({ ...raw, disambiguation: 'later' });
    assert.equal(unresolved.status, 'ambiguous'); assert.equal(unresolved.context, null); assert.equal(unresolved.slot.candidates.length, 2); assert.equal(later.context.dateISO, '2027-11-07T06:30:00.000Z'); assert.equal(later.slot.candidates.length, 2);
  });
  const survey = buildNewtonYearSurvey(SURVEY);
  test('Leap-year survey retains every daily date and thirteen calendar slots', () => {
    assert.equal(survey.rows.length, 366); assert.equal(survey.rows[0].date, '2060-01-01'); assert.equal(survey.rows.at(-1).date, '2060-12-31'); assert.ok(survey.rows.some(r => r.date === '2060-02-29'));
    assert.equal(survey.counts.calendarSlots, 366 * 13); assert.equal(survey.counts.truncated, false); assert.equal(survey.coverage.length, 13); assert.ok(survey.rows.every(r => r.calendars.length === 13)); assert.deepEqual(forbiddenKeys(survey), []);
    for (const c of survey.coverage) assert.equal(c.availableSamples + c.unavailableSamples, 366);
    assert.equal(survey.assumption.selectedDate, null); assert.equal(survey.assumption.datePrecision, 'user-selected-year-daily-samples'); assert.equal(frame.assumption.datePrecision, 'user-selected-day');
  });
  test('Selected survey samples match independent canonical comparison calls', () => {
    for (const date of ['2060-01-01', '2060-02-29', '2060-07-01', '2060-12-31']) {
      const row = survey.rows.find(r => r.date === date), canonical = compareMoment({ dateISO: row.dateISO, lat: FRAME.lat, lon: FRAME.lon, timeZone: FRAME.timeZone, system: FRAME.system });
      for (const calendar of canonical.calendars) { const stored = row.calendars.find(c => c.id === calendar.id); assert.equal(stored.text, calendar.text); assert.deepEqual(stored.parts, calendar.parts); assert.equal(stored.status, calendar.status); }
      assert.equal(row.astronomy.sunLongitude, canonical.astronomy.sunLongitude); assert.equal(row.astronomy.moonLongitude, canonical.astronomy.moonLongitude); assert.deepEqual(row.panchanga, canonical.vedic.panchanga);
    }
  });
  test('Calendar transition rings use actual first-observed civil-date indices and exclude day-only changes', () => {
    const gregorian = survey.calendarChanges.filter(c => c.calendarId === 'gregory'); assert.equal(gregorian.length, 11); assert.equal(gregorian[0].date, '2060-02-01'); assert.equal(gregorian[0].index, 31); assert.equal(gregorian[1].index, 60);
    for (const transition of survey.calendarChanges) { assert.equal(survey.rows[transition.index].date, transition.date); assert.notDeepEqual(transition.previousFields, transition.currentFields); assert.equal(transition.religiousObservance, false); assert.ok(!transition.currentFields.some(p => p.type === 'day')); }
  });
  test('Solved full-year astronomical markers retain UTC, local-year bounds and angle definitions', () => {
    const events = survey.astronomicalEvents.events; assert.ok(events.length >= 52 && events.length <= 56); assert.equal(events.filter(e => e.kind === 'solar-quarter').length, 4);
    for (const event of events) { assert.ok(event.localDate.startsWith('2060-')); assert.ok(event.dateISO >= survey.astronomicalEvents.startISO && event.dateISO <= survey.astronomicalEvents.endISO); const actual = event.kind === 'solar-quarter' ? SunPosition(new Date(event.dateISO)).elon : MoonPhase(new Date(event.dateISO)); assert.ok(angularDelta(actual, event.angle) < .002); }
    assert.equal(survey.sampling.exactSignTransitionsSearched, false); assert.equal(survey.sampling.calendarChangesAreObservances, false);
  });
  const gapSurvey = buildNewtonYearSurvey({ ...SURVEY, year: 2027, time: '02:30', timeZone: 'America/New_York' });
  test('Non-leap year gap slot stays missing with all thirteen calendar statuses', () => {
    assert.equal(gapSurvey.rows.length, 365); const missing = gapSurvey.rows.find(r => r.date === '2027-03-14'); assert.equal(missing.status, 'unavailable'); assert.equal(missing.code, 'NONEXISTENT_TIME'); assert.equal(missing.astronomy, null); assert.equal(missing.calendars.length, 13); assert.ok(missing.calendars.every(c => c.status === 'unavailable' && c.parts.length === 0));
    assert.equal(gapSurvey.counts.availableSamples, 364); assert.equal(gapSurvey.counts.unavailableSamples, 1); for (const c of gapSurvey.coverage) assert.equal(c.availableSamples + c.unavailableSamples, 365);
  });
  const skippedYearEnd = buildNewtonYearSurvey({ ...SURVEY, year: 1994, timeZone: 'Pacific/Kiritimati', lat: 1.87, lon: -157.4, system: 'whole' });
  test('Skipped final civil date remains missing while astronomy uses the actual next-year boundary', () => {
    assert.equal(skippedYearEnd.rows.length, 365); assert.equal(skippedYearEnd.counts.availableSamples, 364); assert.equal(skippedYearEnd.counts.unavailableSamples, 1);
    const last = skippedYearEnd.rows.at(-1); assert.equal(last.date, '1994-12-31'); assert.equal(last.status, 'unavailable'); assert.equal(last.code, 'NONEXISTENT_DATE'); assert.equal(last.calendars.length, 13); assert.ok(last.calendars.every(c => c.status === 'unavailable'));
    assert.equal(skippedYearEnd.astronomicalEvents.endISO, new Date(+startOfZonedDay('1995-01-01', 'Pacific/Kiritimati') - 1).toISOString());
    assert.ok(skippedYearEnd.astronomicalEvents.events.every(e => e.localDate.startsWith('1994-')));
    for (const c of skippedYearEnd.coverage) assert.equal(c.availableSamples + c.unavailableSamples, 365);
  });
  const boundary = buildNewtonExplorationFrame({ ...FRAME, date: '1900-01-01', time: '00:00', timeZone: 'Asia/Tokyo' });
  test('Out-of-range resolved UTC sample remains missing without changing the assumed civil date', () => { assert.equal(boundary.status, 'unavailable'); assert.equal(boundary.slot.code, 'UTC_RANGE'); assert.equal(boundary.explorationRequest.date, '1900-01-01'); assert.equal(boundary.comparison, null); });
  test('Every source reference resolves for chronology, valid/missing frames and year surveys', () => {
    for (const result of [chronology, frame, boundary, survey, gapSurvey, skippedYearEnd]) { const ids = new Set(result.sources.map(s => s.id)); assert.equal(ids.size, result.sources.length); for (const id of sourceRefs(result)) assert.ok(ids.has(id), id); }
  });
  test('Exports recompute canonical facts, preserve missingness and exclude score outputs', () => {
    assert.deepEqual(JSON.parse(exportNewtonExplorationJSON({ ...FRAME, includeCatalogStars: true })), frame); const csv = exportNewtonExplorationCSV(FRAME); assert.ok(csv.includes('assumed-sample')); assert.ok(csv.includes('computus-projection')); assert.ok(csv.includes('civil-calendar')); assert.ok(csv.endsWith('\r\n'));
    const missingCSV = exportNewtonExplorationCSV({ ...FRAME, date: '2027-03-14', time: '02:30', timeZone: 'America/New_York' }); assert.ok(missingCSV.includes('unavailable')); assert.ok(!missingCSV.includes('"sky-body"'));
    assert.throws(() => exportNewtonExplorationJSON({ ...FRAME, comparison: frame.comparison }));
  });
  test('Held-frame CSV serialization matches strict recomputation with context and limits', () => {
    assert.equal(serializeNewtonExplorationCSV(frame), exportNewtonExplorationCSV({ ...FRAME, includeCatalogStars: true }));
    assert.equal(serializeNewtonExplorationCSV(boundary), exportNewtonExplorationCSV({ ...FRAME, date: '1900-01-01', time: '00:00', timeZone: 'Asia/Tokyo' }));
    const csv = serializeNewtonExplorationCSV(frame); assert.ok(csv.includes('"calculation-context"')); assert.ok(csv.includes('"limits"')); assert.ok(csv.includes('Future IANA'));
    assert.throws(() => exportNewtonExplorationCSV(frame));
  });
  test('Year JSON and CSV retain the entire Gregorian daily grid and solved events', () => {
    assert.deepEqual(JSON.parse(exportNewtonYearSurveyJSON(SURVEY)), survey); const csv = exportNewtonYearSurveyCSV(SURVEY); assert.equal(csv.split('\r\n').filter(line => line.startsWith('"sample",')).length, 366); assert.equal(csv.split('\r\n').filter(line => line.startsWith('"civil-calendar",')).length, 4758); assert.ok(csv.includes('solved-astronomical-event')); assert.ok(csv.includes('2060-12-31'));
  });
  test('Future zone rules, time scales and observational uncertainty stay visible', () => { for (const result of [frame, survey]) assert.ok(result.limitations.some(x => x.includes('Future IANA') && x.includes('TT/ΔT'))); });
  return { pass: failures.length === 0, count, failures };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} Newton chronology: ${result.count} checks`); result.failures.forEach(f => console.error(f)); process.exitCode = result.pass ? 0 : 1; }
