// Versioned local study snapshots. Explicit input only: no clock, DOM or network.
import { calculateContext, parseExplicitInstant } from './calculation-context.js';
import { getStudyLens } from './data/study-lenses.js';
import { buildSkyHandoff, parseSkyHandoff } from './sky-handoff.js';

export const STUDY_SCHEMA_VERSION = 1;
export const STUDY_JOURNAL_KEY = 'wb-study-sessions-v1';
export const STUDY_JOURNAL_LIMIT = 20;
const tasks = ['western', 'vedic', 'kamea', 'yantra', 'gematria', 'katapayadi'];
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
const lenses = ['lilly', 'agrippa', 'hermetic', 'newton'];
const ownObject = value => value && typeof value === 'object' && !Array.isArray(value);
function text(value, name, max, fallback = '') {
  value ??= fallback;
  if (typeof value !== 'string' || Array.from(value).length > max) throw new RangeError(`${name} must be text of at most ${max} characters.`);
  return value.normalize('NFC');
}
function choice(value, list, name, fallback) {
  value ??= fallback;
  if (!list.includes(value)) throw new RangeError(`Choose a supported ${name}.`);
  return value;
}
function instant(value, label, studyRange = false) {
  const date = parseExplicitInstant(value);
  if (studyRange && (date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100)) throw new RangeError(`${label} must be in1900–2100.`);
  return date.toISOString();
}
function coordinate(value, bound, name) {
  if (!Number.isFinite(value) || Math.abs(value) > bound) throw new RangeError(`${name} must be finite geographic degrees within ±${bound}.`);
  return value;
}
function inputSnapshot(input) {
  if (!ownObject(input)) throw new TypeError('A Studio input snapshot is required.');
  const task = choice(input.task, tasks, 'task', 'western');
  const methods = task === 'gematria' ? ['standard','gadol'] : task === 'katapayadi' ? ['iast'] : task === 'yantra' ? ['navagraha'] : ['latin','aiq','hebrew-standard','hebrew-gadol'];
  const method = choice(input.method, methods, 'letter method', methods[0]);
  const planet = choice(input.planet, planets, 'planet', 'Saturn');
  if (task === 'kamea' && ['Rahu','Ketu'].includes(planet)) throw new RangeError('Planetary kameas use the seven classical planets.');
  if (input.followHour != null && typeof input.followHour !== 'boolean') throw new TypeError('Planetary-hour following must be a boolean.');
  return { task, dateISO: instant(input.dateISO, 'Study moment', true), lat: coordinate(input.lat,90,'Latitude'), lon: coordinate(input.lon,180,'Longitude'),
    system: choice(input.system,['regiomontanus','placidus','whole','equal'],'house convention','regiomontanus'),
    style: choice(input.style,['north','south'],'Vedic diagram','north'), planet, method, text: text(input.text,'Symbol text',256), followHour: input.followHour === true,
    locationSource: choice(input.locationSource,['demo','device','manual','saved','skylens'],'location provenance','manual') };
}
function observationSnapshot(value) {
  if (value == null) return null;
  // The same strict contract governs browser handoff and saved provenance.
  return parseSkyHandoff(new URL(buildSkyHandoff(value, 'studio')).hash);
}

function methodProvenance(input, lens) {
  const context = calculateContext({...input,includeReading:false,includeVedic:false});
  return {engine:context.methods.engine, zodiac:'tropical', requestedHouseSystem:input.system,
    actualHouseSystem:context.methods.houseSystem, houseWarning:context.methods.houseWarning,
    planetaryHours:'Sunrise/sunset division into12day and12night hours; not the alternative ecliptic-ascension method.',
    observerCivilZone:'Unknown; the supplied clock is UTC. Traditional day uses the engine’s mean-solar fallback.',
    symbolMethod:input.method, sourceLedger:'docs/2026-10-05-study-sources.md',
    sourceIds:getStudyLens(lens).sources.map(source=>source.id)};
}
function provenanceSnapshot(value, input, lens) {
  if(value == null) return methodProvenance(input,lens);
  if(!ownObject(value) || !Array.isArray(value.sourceIds) || value.sourceIds.length>20) throw new TypeError('Invalid study provenance.');
  const allowedSources=new Set(getStudyLens(lens).sources.map(source=>source.id));
  if(value.sourceIds.some(id=>typeof id!=='string'||!allowedSources.has(id))) throw new RangeError('Unknown source reference for this study lens.');
  return {engine:text(value.engine,'Calculation engine',300),zodiac:choice(value.zodiac,['tropical'],'zodiac','tropical'),
    requestedHouseSystem:choice(value.requestedHouseSystem,['regiomontanus','placidus','whole','equal'],'requested house method'),
    actualHouseSystem:choice(value.actualHouseSystem,['regiomontanus','placidus','whole','equal'],'calculated house method'),
    houseWarning:value.houseWarning==null?null:text(value.houseWarning,'House warning',1200),
    planetaryHours:text(value.planetaryHours,'Planetary-hour convention',500),observerCivilZone:text(value.observerCivilZone,'Civil-zone provenance',500),
    symbolMethod:text(value.symbolMethod,'Symbol method',80),sourceLedger:'docs/2026-10-05-study-sources.md',sourceIds:[...value.sourceIds]};
}
function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
export function normalizeStudySession(value) {
  if (!ownObject(value)) throw new TypeError('A study session record is required.');
  if (value.schemaVersion !== STUDY_SCHEMA_VERSION) throw new RangeError('Unsupported study session version.');
  const id = text(value.id,'Session ID',80);
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) throw new RangeError('Session ID must contain letters, digits, underscores or dashes.');
  const measurement = value.measurement ?? {};
  if (!ownObject(measurement)) throw new TypeError('Measurement notes must be an object.');
  const input=inputSnapshot(value.input), lens=choice(value.lens,lenses,'historical lens','lilly');
  const traceStep=value.traceStep ?? null;
  if(traceStep!==null && (!Number.isInteger(traceStep)||traceStep<0||traceStep>256)) throw new RangeError('Trace frame must be a whole step from0through256.');
  if(value.purpose==='question' && !text(value.question,'Recorded question',1000).trim()) throw new RangeError('Record the question before saving a question chart.');
  // Build a whitelist. Imported records never carry arbitrary nested histories or keys.
  return freeze({schemaVersion:STUDY_SCHEMA_VERSION,id,createdAt:instant(value.createdAt,'Saved timestamp'),
    input,lens,traceStep,provenance:provenanceSnapshot(value.provenance,input,lens),purpose:choice(value.purpose,['moment','question'],'study purpose','moment'),
    title:text(value.title,'Session title',160,'Untitled study'),question:text(value.question,'Recorded question',1000),observationNotes:text(value.observationNotes,'Observation notes',4000),
    hypothesis:text(value.hypothesis,'Hypothesis',2000),reflection:text(value.reflection,'Reflection',4000),
    measurement:{expected:text(measurement.expected,'Expected value',120),observed:text(measurement.observed,'Observed value',120),uncertainty:text(measurement.uncertainty,'Uncertainty',120),unit:text(measurement.unit,'Unit',80),method:text(measurement.method,'Measurement method',1000)},
    observation:observationSnapshot(value.observation)});
}
export function createStudySession(value) { return normalizeStudySession({...value,schemaVersion:STUDY_SCHEMA_VERSION}); }
export function readStudyJournal(storage) {
  try {
    const raw = storage.getItem(STUDY_JOURNAL_KEY);
    if (raw == null) return {records:[],skipped:0,error:null};
    if (raw.length > 600000) throw new Error('Saved study journal exceeds its supported size. Export or clear only this journal to recover.');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Saved study journal is not a record list.');
    const records = [], seen = new Set(); let skipped = Math.max(0,data.length-STUDY_JOURNAL_LIMIT);
    for (const entry of data.slice(0,STUDY_JOURNAL_LIMIT)) {
      try { const record=normalizeStudySession(entry); if(seen.has(record.id)) throw new Error('Duplicate record'); seen.add(record.id); records.push(record); }
      catch { skipped++; }
    }
    return {records,skipped,error:skipped?'Some invalid saved entries were skipped; valid studies remain available.':null};
  } catch(error) { return {records:[],skipped:0,error:error.message || 'Browser storage is unavailable.'}; }
}
export function appendStudySession(storage, value) {
  const record = normalizeStudySession(value), previous = readStudyJournal(storage);
  if (previous.records.some(item=>item.id===record.id)) throw new Error('This snapshot ID already exists. Save a new snapshot to preserve the earlier study.');
  const records = [record,...previous.records].slice(0,STUDY_JOURNAL_LIMIT);
  // A failed write throws, leaving the previous saved value intact.
  storage.setItem(STUDY_JOURNAL_KEY,JSON.stringify(records));
  return {records,skipped:previous.skipped};
}
export function deleteStudySession(storage, id) {
  if (typeof id !== 'string') throw new TypeError('A session ID is required.');
  const previous=readStudyJournal(storage), records=previous.records.filter(record=>record.id!==id);
  storage.setItem(STUDY_JOURNAL_KEY,JSON.stringify(records)); return {records};
}
export function buildWorkbenchStudyURL(value) {
  const session=normalizeStudySession(value), i=session.input;
  const url = new URL('https://occult-kranti.github.io/astrology-sim-ant/pages/workbench.html');
  const params = {date:i.dateISO.slice(0,10),time:i.dateISO.slice(11,19),offset:'0',lat:String(i.lat),lon:String(i.lon),system:i.system,solar:'1'};
  for (const [key,val] of Object.entries(params)) url.searchParams.set(key,val);
  return url.href;
}

// A numerical discrepancy is descriptive only; it does not validate an interpretation.
export function measurementDifference(measurement) {
  if (!ownObject(measurement)) return {status:'incomplete'};
  const numeric = value => typeof value === 'string' && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()) && Number.isFinite(Number(value));
  if (!String(measurement.expected ?? '').trim() || !String(measurement.observed ?? '').trim()) return {status:'incomplete'};
  if (!numeric(measurement.expected) || !numeric(measurement.observed)) return {status:'descriptive'};
  const delta=Number(measurement.observed)-Number(measurement.expected);
  if (!Number.isFinite(delta)) return {status:'descriptive'};
  return {status:'numeric',delta,unit:text(measurement.unit,'Measurement unit',80),convention:'observed minus expected; no circular-angle or uncertainty propagation implied'};
}
