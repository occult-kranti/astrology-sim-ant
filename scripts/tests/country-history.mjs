import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { houses } from '../../assets/js/core/astro.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { COUNTRY_HISTORY_METHODS, COUNTRY_HISTORY_HOUSES, COUNTRY_HISTORY_TASKS, COUNTRY_METHOD_SOURCES, countryMethodSourcesFor } from '../../assets/js/core/data/country-history-methods.js';

const engineURL = new URL('../../assets/js/core/country-history.js',import.meta.url);
const makeRecord = (id,date,zone='America/New_York',extra={}) => ({
  id,countryId:'usa',title:`Boundary fixture ${id}`,date,
  eventPlace:{label:'Synthetic calculation-test reference',lat:40.7,lon:-74,zone,precision:'test coordinates'},
  time:{status:'date-only',localTime:null,qualification:'No event time is asserted by this synthetic fixture.'},
  sourceIds:['TEST-SOURCE'],source:'Synthetic boundary fixture; no historical source claim.',originalCalendar:'Gregorian test key',notes:[],claimType:'test-fixture',eventType:'test-fixture',scopeNote:'Test data only; not a historical source claim.',...extra,
});

// Replace only the fixed catalogue dependency for boundary fixtures. Production
// exposes no arbitrary-date or caller-supplied-record calculation entry point.
async function fixtureEngine(records) {
  const fixture = `export const COUNTRY_HISTORY_COUNTRIES = [{id:'usa',label:'Test catalogue'}];\nexport const COUNTRY_HISTORY_RECORDS = ${JSON.stringify(records)};\nexport const COUNTRY_HISTORY_SOURCES = [{id:'TEST-SOURCE',title:'Synthetic fixture',url:'docs/2026-10-country-history-engine.md'}];`;
  const dataURL = `data:text/javascript;base64,${Buffer.from(fixture).toString('base64')}`;
  const source = (await readFile(engineURL,'utf8')).replace(/from '(\.[^']+)'/g,(_,path) => `from '${path === './data/country-history-records.js' ? dataURL : new URL(path,engineURL).href}'`);
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

export async function run() {
  const failures = []; let count = 0;
  const ok = (condition,message) => { count++; if (!condition) failures.push(message); };
  const throws = (fn,message) => { try { fn(); ok(false,message); } catch { ok(true,message); } };
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  ok(COUNTRY_HISTORY_METHODS.length === 5 && new Set(COUNTRY_HISTORY_METHODS.map(method => method.id)).size === 5,'Five named method families remain separately identified');
  ok(same(COUNTRY_HISTORY_HOUSES.map(house => house.number),Array.from({length:12},(_,index) => index + 1)),'House reference covers each of the twelve houses exactly once in order');
  ok(COUNTRY_HISTORY_TASKS.length === 4 && COUNTRY_HISTORY_TASKS.every(task => task.requiredInformation.length && task.sourceRequirements.length && task.limits),'Four civic-study tasks retain information requirements, source requirements and limits');
  const methodRows = [...COUNTRY_HISTORY_METHODS,...COUNTRY_HISTORY_HOUSES,...COUNTRY_HISTORY_TASKS];
  ok(methodRows.every(row => typeof row.source === 'string' && row.source.trim() && row.sourceIds.length && countryMethodSourcesFor(row.sourceIds).length === new Set(row.sourceIds).size),'Every method, house and task retains its citation and resolves each declared source');
  ok(COUNTRY_METHOD_SOURCES.length === 11 && COUNTRY_METHOD_SOURCES.every(source => ['id','title','url','sourceType','accessDepth','locator','checkedAt','rights','source'].every(key => typeof source[key] === 'string' && source[key].trim())),'Method sources retain identity, reading depth, locator, review date and rights');
  throws(() => countryMethodSourcesFor(['unknown-source']),'Unknown method-source IDs remain explicit lookup errors');
  const fixtures = [
    makeRecord('ordinary','2024-01-15'),makeRecord('spring','2024-03-10'),makeRecord('fall','2024-11-03'),
    makeRecord('midnight-gap','2018-11-04','America/Sao_Paulo'),
    makeRecord('skipped','2011-12-30','Pacific/Apia'),
    makeRecord('half-hour-gap','2024-10-06','Australia/Lord_Howe'),
    makeRecord('half-hour-fold','2024-04-07','Australia/Lord_Howe'),
    makeRecord('old','1776-07-04'),makeRecord('lower-bound','1900-01-01','Asia/Kolkata'),
    makeRecord('missing-place','2000-01-01','UTC',{eventPlace:{label:'Unknown',lat:null,lon:null,zone:null,precision:'unavailable'}}),
    makeRecord('source-clock','2000-01-01','UTC',{time:{status:'source-clock',localTime:'04:15',qualification:'Synthetic source-clock test only.'}}),
    makeRecord('polar','2000-01-01','UTC',{eventPlace:{label:'Synthetic high latitude',lat:70,lon:0,zone:'UTC',precision:'test coordinates'}}),
    makeRecord('missing-source','2000-01-01','UTC',{sourceIds:['UNAVAILABLE'],originalCalendar:null}),
  ];
  const engine = await fixtureEngine(fixtures);
  const study = (recordIds,extra={}) => engine.buildCountryHistoryStudy({recordIds,...extra});
  const ordinary = study(['ordinary']);
  ok(ordinary.schemaVersion === 1 && ordinary.kind === 'historical-country-calendar-study' && ordinary.asOf === '2026-10-30','Historical study has a fixed version, kind and review-date cutoff');
  ok(same(ordinary,study(['ordinary'])),'Fixed records and options produce deterministic output');
  ok(ordinary.records[0].record.time.status === 'date-only' && ordinary.records[0].record.time.localTime === null,'Date-only source precision is retained without an inferred event clock');
  ok(ordinary.records[0].record.source === fixtures[0].source,'Self-contained historical citation strings survive the explicit record projection');
  const civil = ordinary.records[0].civilComparison;
  ok(civil.reference.localTime === '12:00:00' && civil.reference.timeStatus === 'declared-reference-assumption' && /not a sourced event time/.test(civil.reference.assumption),'The civil label reference declares local noon as an assumption');
  const canonical = compareMoment({dateISO:civil.reference.dateISO,lat:40.7,lon:-74,timeZone:'America/New_York',system:'regiomontanus'});
  ok(same(civil.rows,canonical.calendars),'Civil rows preserve every canonical value, status, source and qualification');
  ok(same(Object.keys(civil).sort(),['limitations','reason','reference','rows','status']),'Civil export projects only civil rows and its declared reference metadata');
  ok(ordinary.records[0].daySensitivity.status === 'not-requested' && ordinary.records[0].daySensitivity.samples.length === 0,'House geometry is opt-in and absent by default');
  ok(same(Object.keys(ordinary.records[0]).sort(),['civilComparison','coverage','daySensitivity','record']),'Study entry has no internal chart or rule-output payload');
  const sourceIds = new Set(ordinary.sources.map(source => source.id));
  ok(civil.rows.every(row => row.sourceIds.every(id => sourceIds.has(id))),'Every civil-row source ID resolves in the public study sources');

  for (const houseSystem of ['regiomontanus','placidus','whole','equal']) {
    const row = study(['ordinary'],{houseSystem,includeDaySensitivity:true}).records[0];
    ok(row.daySensitivity.samples.length === 25 && row.daySensitivity.day.elapsedHours === 24,`${houseSystem}: ordinary day has 24 hourly points plus its last included second`);
    ok(row.daySensitivity.samples.every(sample => {
      const expected = houses(new Date(sample.dateISO),40.7,-74,houseSystem);
      return sample.assumption === true && sample.status === 'available' && sample.ascendantDegrees === expected.asc && sample.midheavenDegrees === expected.mc && same(sample.cusps,expected.cusps.slice(1)) && sample.houseSystem === expected.system;
    }),`${houseSystem}: all twelve cusps and both angles reproduce the canonical geometry at every explicitly assumed sample`);
    ok(new Set(row.daySensitivity.samples.map(sample => sample.ascendantDegrees)).size > 20,`${houseSystem}: day sensitivity changes angles instead of substituting one exact event chart`);
  }
  for (const [id,hours,samples,kind] of [['spring',23,24,'gap'],['fall',25,26,'fold'],['half-hour-gap',23.5,25,'gap'],['half-hour-fold',24.5,26,'fold']]) {
    const value = study([id],{includeDaySensitivity:true}).records[0].daySensitivity;
    ok(value.status === 'available' && value.day.elapsedHours === hours && value.samples.length === samples,`${id}: actual zoned-day duration and bounded elapsed-time sample count are retained`);
    ok(value.clockChanges.some(change => change.kind === kind && change.precision === 'between-samples'),`${id}: offset change is preserved without claiming an exact transition search`);
    ok(value.samples.every((sample,index,list) => sample.localDate === fixtures.find(record => record.id === id).date && new Date(sample.dateISO) < new Date(value.day.endExclusiveISO) && (!index || new Date(sample.dateISO) > new Date(list[index - 1].dateISO))),`${id}: every sample is unique, increasing in UTC and inside the actual selected civil day`);
  }
  const spring = study(['spring'],{includeDaySensitivity:true}).records[0].daySensitivity;
  ok(spring.clockSlots.find(slot => slot.localTime === '02:00:00').status === 'unavailable' && !spring.samples.some(sample => sample.localTime.startsWith('02:')),'Spring DST gap remains absent in both local-clock slots and sampled geometry');
  const fall = study(['fall'],{includeDaySensitivity:true}).records[0].daySensitivity;
  const repeated = fall.samples.filter(sample => sample.localTime === '01:00:00');
  ok(repeated.length === 2 && same(repeated.map(sample => sample.occurrence),[1,2]) && new Set(repeated.map(sample => sample.utcOffsetMinutes)).size === 2,'Autumn repeated clocks retain both instants, offsets and occurrence numbers');
  const midnight = study(['midnight-gap'],{includeDaySensitivity:true}).records[0].daySensitivity;
  ok(midnight.day.elapsedHours === 23 && midnight.samples[0].localTime === '01:00:00' && midnight.clockSlots[0].status === 'unavailable','Midnight DST gap starts at the first real instant without inventing midnight');
  const skipped = study(['skipped'],{includeDaySensitivity:true}).records[0];
  ok(skipped.civilComparison.status === 'unavailable' && skipped.daySensitivity.status === 'unavailable' && skipped.daySensitivity.samples.length === 0,'A completely skipped IANA civil date has neither a noon reference nor invented samples');
  const old = study(['old'],{includeDaySensitivity:true}).records[0];
  ok(old.record.date === '1776-07-04' && old.record.sourceIds[0] === 'TEST-SOURCE' && old.coverage.status === 'unavailable' && old.civilComparison.reference === null && old.civilComparison.rows.length === 0 && old.daySensitivity.samples.length === 0,'Pre-1900 source record survives while all unsupported numerical output stays unavailable');
  const lower = study(['lower-bound'],{includeDaySensitivity:true}).records[0];
  ok(lower.civilComparison.status === 'available' && lower.daySensitivity.status === 'partial' && lower.daySensitivity.samples.some(sample => sample.status === 'unavailable' && sample.dateISO.startsWith('1899-') && sample.cusps.length === 0),'Local 1900 day retains unavailable 1899 UTC boundary samples without widening the canonical range');
  const missing = study(['missing-place'],{includeDaySensitivity:true}).records[0];
  ok(missing.coverage.status === 'unavailable' && missing.record.eventPlace.lat === null && missing.daySensitivity.samples.length === 0,'Missing coordinates and zone remain missing and block dependent calculations');
  const sourceClock = study(['source-clock'],{includeDaySensitivity:true}).records[0];
  ok(sourceClock.record.time.localTime === '04:15' && sourceClock.civilComparison.reference.localTime === '12:00:00' && sourceClock.daySensitivity.samples.every(sample => sample.assumption),'A source clock stays in provenance while civil reference and all sensitivity points remain separately declared assumptions');
  const polar = study(['polar'],{houseSystem:'placidus',includeDaySensitivity:true}).records[0].daySensitivity;
  ok(polar.samples.every(sample => sample.requestedHouseSystem === 'placidus' && sample.houseSystem === 'regiomontanus' && sample.warnings.some(warning => /unavailable above 66/.test(warning))),'Canonical Placidus fallback preserves actual system, requested system and its warning on every sample');
  const missingSource = study(['missing-source']).records[0];
  ok(missingSource.coverage.warnings.some(warning => /UNAVAILABLE/.test(warning)) && missingSource.coverage.warnings.some(warning => /original source-calendar/.test(warning)),'Missing source metadata and original calendar labels remain visible');

  const invalid = [null,{},[],{recordIds:[]},{recordIds:['unknown']},{recordIds:['ordinary','ordinary']},{recordIds:new Array(1)},{recordIds:['ordinary'],houseSystem:null},{recordIds:['ordinary'],houseSystem:'unsupported'},{recordIds:['ordinary'],includeDaySensitivity:'true'},{recordIds:['ordinary'],includeDaySensitivity:null},{recordIds:['ordinary'],date:'2027-01-01'},{recordIds:['ordinary'],objective:'rank'},Object.create({recordIds:['ordinary']}),Object.assign(new Date(),{recordIds:['ordinary']})];
  invalid.forEach((input,index) => throws(() => engine.buildCountryHistoryStudy(input),`Strict request boundary rejects invalid input ${index + 1}`));
  const inheritedIds = new Array(1); Object.setPrototypeOf(inheritedIds,Object.assign(Object.create(Array.prototype),{0:'ordinary'}));
  throws(() => engine.buildCountryHistoryStudy({recordIds:inheritedIds}),'An inherited array index cannot substitute for an explicitly selected record ID');
  throws(() => study(fixtures.slice(0,7).map(record => record.id)),'Public study cannot exceed six selected fixed records');
  ok(study(fixtures.slice(0,6).map(record => record.id)).records.length === 6,'Public study accepts the exact six-record bound');
  ok(same(engine.buildCountryHistoryStudy(Object.assign(Object.create(null),{recordIds:['ordinary']})),ordinary),'A plain null-prototype JSON record preserves the same strict contract');
  for (const bad of [makeRecord('future','2026-10-31'),makeRecord('impossible','2024-02-30'),makeRecord('bad-clock','2000-01-01','UTC',{time:{status:'date-only',localTime:'12:00'}}),makeRecord('missing-clock','2000-01-01','UTC',{time:{status:'source-clock'}})]) {
    const badEngine = await fixtureEngine([bad]);
    throws(() => badEngine.getCountryHistoryCatalogue(),`${bad.id}: malformed or future curated source data fails the fixed-catalogue boundary`);
  }
  const copy = engine.getCountryHistoryCatalogue(); copy.records[0].eventPlace.lat = 0; copy.records[0].time.status = 'source-clock'; copy.sources[0].title = 'Changed';
  ok(same(ordinary,study(['ordinary'])),'Catalogue mutation cannot alter subsequent source records, assumptions or computations');
  ok(same(JSON.parse(JSON.stringify(ordinary)),ordinary),'Public study is JSON serializable without Date instances, undefined fields or nonfinite geometry');
  const previousTZ = process.env.TZ;
  try { process.env.TZ = 'Pacific/Honolulu'; ok(same(ordinary,study(['ordinary'])),'Host timezone cannot alter explicit-zone historical calculations'); }
  finally { if (previousTZ === undefined) delete process.env.TZ; else process.env.TZ = previousTZ; }

  const actual = await import(engineURL.href), catalogue = actual.getCountryHistoryCatalogue();
  ok(catalogue.countries.length === 6 && new Set(catalogue.records.map(record => record.id)).size === catalogue.records.length,'Production catalogue has the six declared countries and distinct record IDs');
  ok(catalogue.records.length > 0 && catalogue.records.every(record => record.date <= catalogue.asOf),'Every production reference record is on or before the fixed historical cutoff');
  const actualSourceIds = new Set(catalogue.sources.map(source => source.id));
  ok(catalogue.records.every(record => record.sourceIds.length >= 1 && record.sourceIds.every(id => actualSourceIds.has(id)) && typeof record.source === 'string' && record.source.trim()),'Every production record retains a self-contained citation and resolves its declared source metadata');
  ok(catalogue.records.filter(record => record.sourceIds.length < 2).every(record => /single/i.test(record.notes.join(' ')) && /pending|unverified|unresolved/i.test(record.notes.join(' '))),'Single-source records explicitly retain unresolved corroboration; source counts are not treated as independence evidence');
  const raw = await import(new URL('../../assets/js/core/data/country-history-records.js',import.meta.url).href);
  ok(catalogue.records.every(record => same(record.sourceIds,raw.COUNTRY_HISTORY_RECORDS.find(item => item.id === record.id).sourceIds)),'The engine preserves source lineage IDs exactly instead of inventing corroborating references');
  for (const id of ['india-independence-1947','russia-sovereignty-declaration-1990','iran-republic-proclamation-1979']) {
    const row = actual.buildCountryHistoryStudy({recordIds:[id]}).records[0];
    const qualification = row.record.notes.find(note => /single/i.test(note));
    ok(row.record.sourceIds.length === 1 && /pending|unverified|unresolved/i.test(qualification || '') && row.coverage.warnings.includes(qualification),`${id}: the known single-lineage evidence limit survives in provenance and visible calculation warnings`);
  }
  for (const record of catalogue.records) {
    const result = actual.buildCountryHistoryStudy({recordIds:[record.id]}).records[0];
    ok(same(result.record,record) && result.daySensitivity.samples.length === 0,`${record.id}: public calculation retains provenance and leaves optional geometry off`);
  }
  return {pass:failures.length === 0,failures,count};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} country history: ${result.count} checks`);
  result.failures.forEach(failure => console.error(failure)); process.exitCode = result.pass ? 0 : 1;
}
