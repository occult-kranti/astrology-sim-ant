// Fixed historical records and disclosed calculation assumptions. No date search,
// event-time inference, national birth chart, ranking, or operational objective.
import { COUNTRY_HISTORY_COUNTRIES, COUNTRY_HISTORY_RECORDS, COUNTRY_HISTORY_SOURCES } from './data/country-history-records.js';
import { compareMoment, OBSERVATORY_SOURCES } from './calendar-observatory.js';
import { HOUSE_SYSTEMS } from './instant-boundary.js';
import { civilFields, resolveZonedTime, zonedCivilDay, zonedTimeCandidates, offsetToUTC, validLocation } from './time.js';
import { validateZone } from './cultural-calendars.js';
import { houses } from './astro.js';

export const COUNTRY_HISTORY_SCHEMA_VERSION = 1;
export const COUNTRY_HISTORY_AS_OF = '2026-10-30';
const MAX_RECORDS = 6, HOUR = 3600000;
const clone = value => JSON.parse(JSON.stringify(value));
const NOON_ASSUMPTION = '12:00 local civil reference only; not a sourced event time or an inferred national birth time.';
const SAMPLE_ASSUMPTION = 'Assumed instant for historical civil-day sensitivity only; not a sourced event time.';
const LIMITATIONS = [
  'A country has multiple historical reference events. This catalogue does not establish a single national birth date or time.',
  'Date-only records retain unknown event times. Local noon is an explicit civil-label reference assumption; no event chart is returned.',
  'Optional house samples show sensitivity to assumed times and a named geometric convention. They do not establish historical provenance or predict outcomes.',
  'Complete calendar comparison remains bounded to both UTC and local civil years 1900–2100. Earlier records retain their sources with calculations unavailable.',
  'IANA historical offsets and calendar labels depend on runtime Intl/ICU data. Approximate event coordinates and selected zones are disclosed, not inferred from each other.',
  'Civil labels are proleptic conversions under named conventions, not reconstructions of historical regional adoption or religious observances.',
  'This is a fixed historical study catalogue, not a representative event dataset. Astrology has no demonstrated predictive validity.',
];
const SENSITIVITY_LIMITS = [
  'Every plotted instant is an assumption, including any sample that happens to match a source clock. No sample is selected as a national birth chart.',
  'Hourly elapsed-UTC samples plus the last included second do not locate exact astronomical transitions or extrema.',
  'Repeated local clocks retain UTC offsets and occurrences; nonexistent hourly clocks remain unavailable. Clock changes are located between samples, not at an exact transition instant.',
  'The chosen house system is reused from the canonical astronomy engine. Any fallback or unavailable geometry stays explicit.',
];
const ENGINE_SOURCES = [
  { id:'CH-TIME', title:'Canonical explicit civil-day and IANA clock boundary', url:'assets/js/core/time.js', locator:'civilFields; resolveZonedTime; zonedCivilDay; zonedTimeCandidates', sourceType:'implementation', accessDepth:'Implementation inspected; runtime historical time-zone data is not independent event-time evidence.' },
  { id:'CH-HOUSES', title:'Canonical house geometry', url:'assets/js/core/astro.js', locator:'houses(): Regiomontanus, Placidus, Whole Sign and Equal', sourceType:'implementation', accessDepth:'Implementation inspected and reused; sampled geometry does not validate historical or predictive interpretation.' },
];

function selectedInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || ![Object.prototype,null].includes(Object.getPrototypeOf(input))) throw new TypeError('Choose fixed historical record IDs in a plain JSON object.');
  if (Reflect.ownKeys(input).some(key => !['recordIds','houseSystem','includeDaySensitivity'].includes(key))) throw new RangeError('Only recordIds, houseSystem and includeDaySensitivity are accepted; arbitrary dates and objectives are unavailable.');
  if (!Object.hasOwn(input,'recordIds') || !Array.isArray(input.recordIds) || input.recordIds.length < 1 || input.recordIds.length > MAX_RECORDS || Array.from({length:input.recordIds.length},(_,index) => index).some(index => !Object.hasOwn(input.recordIds,index) || typeof input.recordIds[index] !== 'string' || input.recordIds[index].length > 100)) throw new RangeError('Choose one to six fixed historical record IDs.');
  if (new Set(input.recordIds).size !== input.recordIds.length) throw new RangeError('Choose each historical record only once.');
  const houseSystem = input.houseSystem === undefined ? 'regiomontanus' : input.houseSystem;
  if (!HOUSE_SYSTEMS.includes(houseSystem)) throw new RangeError('Choose regiomontanus, placidus, whole, or equal houses.');
  if (input.includeDaySensitivity !== undefined && typeof input.includeDaySensitivity !== 'boolean') throw new TypeError('includeDaySensitivity must be a boolean.');
  return { recordIds:[...input.recordIds], houseSystem, includeDaySensitivity:input.includeDaySensitivity ?? false };
}

function recordCopy(record) {
  // Explicit projection: undeclared metadata cannot leak into the study export.
  const place = record.eventPlace || {}, time = record.time || {};
  return { id:record.id, countryId:record.countryId, title:record.title, date:record.date,
    eventPlace:{label:place.label ?? null,lat:place.lat ?? null,lon:place.lon ?? null,zone:place.zone ?? null,precision:place.precision ?? null},
    time:{status:time.status,localTime:time.localTime ?? null,qualification:time.qualification ?? null},
    sourceIds:[...(record.sourceIds || [])], source:record.source ?? null, originalCalendar:record.originalCalendar ?? null,
    notes:[...(record.notes || [])], claimType:record.claimType ?? null, eventType:record.eventType ?? null, scopeNote:record.scopeNote ?? null };
}

function recordsById() {
  const result = new Map();
  for (const item of COUNTRY_HISTORY_RECORDS) {
    if (typeof item.id !== 'string' || result.has(item.id)) throw new RangeError('Historical catalogue IDs must be distinct strings.');
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) throw new RangeError('Historical catalogue records require an explicit Gregorian civil-date key.');
    civilFields(item.date);
    if (item.date > COUNTRY_HISTORY_AS_OF) throw new RangeError('Historical catalogue records cannot extend beyond 2026-10-30.');
    if (!COUNTRY_HISTORY_COUNTRIES.some(country => country.id === item.countryId)) throw new RangeError('Historical record country must be in the fixed catalogue.');
    if (!['date-only','source-clock'].includes(item.time?.status)) throw new RangeError('Historical record time precision must be declared.');
    if (item.time.status === 'date-only' && item.time.localTime != null) throw new RangeError('Date-only records cannot contain a clock time.');
    if (item.time.status === 'source-clock') {
      if (typeof item.time.localTime !== 'string') throw new RangeError('A source-clock record must supply its qualified local clock.');
      civilFields(item.date, item.time.localTime);
    }
    result.set(item.id, recordCopy(item));
  }
  return result;
}

function sourceList(records, civilRows = []) {
  const ids = new Set(records.flatMap(record => record.sourceIds));
  civilRows.forEach(row => row.sourceIds?.forEach(id => ids.add(id)));
  ENGINE_SOURCES.forEach(source => ids.add(source.id));
  const all = [...COUNTRY_HISTORY_SOURCES, ...OBSERVATORY_SOURCES, ...ENGINE_SOURCES];
  const seen = new Set();
  return clone(all.filter(source => ids.has(source.id) && !seen.has(source.id) && seen.add(source.id)));
}

function coverageFor(record) {
  const warnings = [record.time.qualification, record.scopeNote, ...record.notes].filter(Boolean);
  const missingSourceIds = record.sourceIds.filter(id => !COUNTRY_HISTORY_SOURCES.some(source => source.id === id));
  if (missingSourceIds.length) warnings.push(`Historical source metadata is unavailable for: ${missingSourceIds.join(', ')}.`);
  if (!record.sourceIds.length) warnings.push('This record has no linked historical source metadata.');
  if (!record.originalCalendar) warnings.push('The original source-calendar label is unavailable.');
  if (record.eventPlace.precision) warnings.push(`Event-place precision: ${record.eventPlace.precision}. Coordinates and zone describe the selected reference location.`);
  warnings.push('Historical IANA offsets depend on the runtime time-zone database; coordinates do not independently establish a civil zone.');
  const year = civilFields(record.date).year;
  if (year < 1900 || year > 2100) return {status:'unavailable',reason:'The historical date is outside the canonical 1900–2100 calendar-comparison range. No replacement date or geometry is calculated.',warnings};
  try { validLocation(record.eventPlace.lat, record.eventPlace.lon); validateZone(record.eventPlace.zone); }
  catch (error) { return {status:'unavailable',reason:error.message,warnings}; }
  return {status:'available',reason:null,warnings};
}

function civilComparison(record, coverage, houseSystem) {
  const base = {status:'unavailable',reason:coverage.reason,reference:null,rows:[],limitations:[NOON_ASSUMPTION,'Civil-midnight labels do not establish sunset religious dates, festivals, or historical regional calendar adoption.']};
  if (coverage.status === 'unavailable') return base;
  try {
    const resolved = resolveZonedTime(record.date, '12:00', record.eventPlace.zone);
    const comparison = compareMoment({dateISO:resolved.instant.toISOString(),lat:record.eventPlace.lat,lon:record.eventPlace.lon,timeZone:record.eventPlace.zone,system:houseSystem});
    // Deliberately retain civil rows only, never comparison/chart/rules/scores.
    return {...base,status:comparison.calendars.some(row => row.status !== 'available') ? 'partial' : 'available',reason:null,
      reference:{dateISO:comparison.context.dateISO,localDate:comparison.context.localDate,localTime:comparison.context.localTime,timeZone:comparison.context.timeZone,timeStatus:'declared-reference-assumption',assumption:NOON_ASSUMPTION},
      rows:clone(comparison.calendars)};
  } catch (error) { return {...base,reason:`Civil reference unavailable: ${error.message}`}; }
}

function localClock(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const p = Object.fromEntries(fmt.formatToParts(date).map(part => [part.type,part.value]));
  const localDate = `${p.year}-${p.month}-${p.day}`, localTime = `${p.hour}:${p.minute}:${p.second}`;
  const utcOffsetMinutes = (offsetToUTC(localDate,localTime,0).getTime() - date.getTime()) / 60000;
  const candidates = zonedTimeCandidates(localDate,localTime,timeZone);
  return {localDate,localTime,utcOffsetMinutes,occurrence:candidates.length > 1 ? candidates.findIndex(candidate => candidate.getTime() === date.getTime()) + 1 : null};
}

function sensitivity(record, coverage, selected) {
  const result = {status:selected.includeDaySensitivity ? 'unavailable' : 'not-requested',reason:selected.includeDaySensitivity ? coverage.reason : null,
    day:null,samples:[],clockSlots:[],clockChanges:[],sourceIds:['CH-TIME','CH-HOUSES'],
    method:'One sample per elapsed UTC hour from the real IANA civil-day start, plus its last included second; canonical houses() under the selected convention.',limitations:[...SENSITIVITY_LIMITS]};
  if (!selected.includeDaySensitivity || coverage.status === 'unavailable') return result;
  try {
    const interval = zonedCivilDay(record.date,record.eventPlace.zone), begin = interval.start.getTime(), end = interval.end.getTime();
    if (end - begin <= 0 || end - begin > 48 * HOUR) throw new RangeError('The civil day exceeds the bounded 48-hour sampling interval.');
    result.day = {startISO:interval.start.toISOString(),endExclusiveISO:interval.end.toISOString(),elapsedHours:(end - begin) / HOUR};
    for (let hour = 0; hour < 24; hour++) {
      const localTime = `${String(hour).padStart(2,'0')}:00:00`;
      const times = zonedTimeCandidates(record.date,localTime,record.eventPlace.zone).filter(date => date >= interval.start && date < interval.end);
      result.clockSlots.push({localTime,status:times.length ? 'available' : 'unavailable',occurrences:times.map(date => ({dateISO:date.toISOString(),...localClock(date,record.eventPlace.zone)}))});
    }
    const instants = [];
    for (let ms = begin; ms < end; ms += HOUR) instants.push(ms);
    if (instants.at(-1) !== end - 1000) instants.push(end - 1000);
    for (const ms of instants) {
      const date = new Date(ms), clock = localClock(date,record.eventPlace.zone);
      const sample = {dateISO:date.toISOString(),...clock,status:'available',reason:null,assumption:true,assumptionNote:SAMPLE_ASSUMPTION,
        ascendantDegrees:null,midheavenDegrees:null,cusps:[],houseSystem:null,requestedHouseSystem:selected.houseSystem,warnings:[]};
      try {
        if (date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100 || clock.localDate !== record.date) throw new RangeError('This sample is outside the declared date or canonical UTC range.');
        const geometry = houses(date,record.eventPlace.lat,record.eventPlace.lon,selected.houseSystem);
        const cusps = geometry.cusps.slice(1);
        if (![geometry.asc,geometry.mc,...cusps].every(Number.isFinite) || cusps.length !== 12) throw new RangeError('The selected convention returned unavailable house geometry.');
        Object.assign(sample,{ascendantDegrees:geometry.asc,midheavenDegrees:geometry.mc,cusps,houseSystem:geometry.system,warnings:geometry.houseWarning ? [geometry.houseWarning] : []});
      } catch (error) { sample.status = 'unavailable'; sample.reason = error.message; }
      const previous = result.samples.at(-1);
      if (previous && previous.utcOffsetMinutes !== sample.utcOffsetMinutes) result.clockChanges.push({kind:sample.utcOffsetMinutes > previous.utcOffsetMinutes ? 'gap' : 'fold',fromDateISO:previous.dateISO,toDateISO:sample.dateISO,fromLocalTime:previous.localTime,toLocalTime:sample.localTime,fromOffsetMinutes:previous.utcOffsetMinutes,toOffsetMinutes:sample.utcOffsetMinutes,precision:'between-samples'});
      result.samples.push(sample);
    }
    const available = result.samples.filter(sample => sample.status === 'available').length;
    result.status = available === result.samples.length ? 'available' : available ? 'partial' : 'unavailable';
    result.reason = available === result.samples.length ? null : 'Some or all sampled geometry is unavailable; inspect each sample reason.';
    return result;
  } catch (error) { return {...result,status:'unavailable',reason:error.message}; }
}

/** Copies only the curated past-date catalogue; no external records are accepted. */
export function getCountryHistoryCatalogue() {
  const records = [...recordsById().values()];
  return {schemaVersion:COUNTRY_HISTORY_SCHEMA_VERSION,asOf:COUNTRY_HISTORY_AS_OF,countries:clone(COUNTRY_HISTORY_COUNTRIES),records,sources:sourceList(records),houseSystems:[...HOUSE_SYSTEMS],maxRecords:MAX_RECORDS,limitations:[...LIMITATIONS]};
}

/** Explicit public serialization boundary: source records, civil rows, and
 * optional assumed house samples only. No hidden comparison/chart property. */
export function buildCountryHistoryStudy(input) {
  const selection = selectedInput(input), available = recordsById();
  const records = selection.recordIds.map(id => {
    const record = available.get(id);
    if (!record) throw new RangeError(`Unknown historical record ID: ${id}. Choose from the fixed catalogue.`);
    const coverage = coverageFor(record);
    return {record,coverage,civilComparison:civilComparison(record,coverage,selection.houseSystem),daySensitivity:sensitivity(record,coverage,selection)};
  });
  return {schemaVersion:COUNTRY_HISTORY_SCHEMA_VERSION,kind:'historical-country-calendar-study',asOf:COUNTRY_HISTORY_AS_OF,selection,records,
    sources:sourceList(records.map(row => row.record),records.flatMap(row => row.civilComparison.rows)),limitations:[...LIMITATIONS]};
}
