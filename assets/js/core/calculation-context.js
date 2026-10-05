// Shared, headless calculation boundary. No clock reads, DOM, storage or network.
import { castChart } from './astro.js';
import { fullReading } from './reading.js';
import { castVedic } from './vedic.js';
import { planetaryHour } from './planetary-hours.js';
import { civilFields, offsetToUTC, validLocation } from './time.js';
import { eraAccuracy } from './calendar.js';
import { OPERATIONS } from './election.js';

export const CONTEXT_SCHEMA_VERSION = 1;
export const HOUSE_SYSTEMS = ['regiomontanus', 'placidus', 'whole', 'equal'];

export function parseExplicitInstant(value) {
  if (typeof value !== 'string') throw new RangeError('Use an ISO date and time with Z or an explicit UTC offset.');
  const m = /^((?:\d{4}|[+-]\d{6})-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!m) throw new RangeError('Use an ISO date and time with Z or an explicit UTC offset.');
  if (m[1].startsWith('-000000-')) throw new RangeError('ISO astronomical year zero is 0000, not −000000.');
  const clock = m[2] + ':' + (m[3] || '00');
  civilFields(m[1], clock);
  let offset = 0;
  if (m[5] !== 'Z') {
    const hours = Number(m[5].slice(1, 3)), minutes = Number(m[5].slice(4));
    if (hours > 23 || minutes > 59) throw new RangeError('Invalid ISO UTC offset.');
    offset = (hours + minutes / 60) * (m[5][0] === '-' ? -1 : 1);
  }
  const date = offsetToUTC(m[1], clock, offset);
  date.setUTCMilliseconds(Number((m[4] || '').padEnd(3, '0')));
  if (date.getUTCFullYear() < -1999 || date.getUTCFullYear() > 3000) throw new RangeError('Supported study dates are years −1999 through 3000; precision varies by epoch.');
  return date;
}

function moment(input, defaultSystem = 'regiomontanus') {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('A dated, located calculation input is required.');
  if (input.timeKnown === false) throw new RangeError('This calculation requires an exact time. Use the date-only Nativity view for unknown birth time; houses cannot be inferred.');
  const dateISO = parseExplicitInstant(input.dateISO).toISOString();
  validLocation(input.lat, input.lon);
  const system = input.system ?? defaultSystem;
  if (!HOUSE_SYSTEMS.includes(system)) throw new RangeError('Choose a supported house system.');
  let timeZone = null;
  if (input.timeZone != null && input.timeZone !== '') {
    if (typeof input.timeZone !== 'string' || input.timeZone.length > 120) throw new RangeError('Enter a valid IANA time zone.');
    timeZone = input.timeZone.trim();
    new Intl.DateTimeFormat('en', { timeZone }).format(new Date(dateISO));
  }
  // A non-Z ISO suffix is useful civil provenance as well as an instant.
  // Retain it when the caller has not supplied a separate observer offset.
  const suffix = /([+-])(\d{2}):(\d{2})$/.exec(input.dateISO);
  const isoOffset = suffix ? (Number(suffix[2]) + Number(suffix[3]) / 60) * (suffix[1] === '-' ? -1 : 1) : null;
  const utcOffset = input.utcOffset ?? isoOffset;
  if (utcOffset !== null && (!Number.isFinite(utcOffset) || Math.abs(utcOffset) > 24)) throw new RangeError('UTC offset must be finite hours east of UTC, between −24 and +24.');
  const disambiguation = input.disambiguation ?? 'reject';
  if (!['reject', 'earlier', 'later'].includes(disambiguation)) throw new RangeError('Choose reject, earlier or later for a repeated local time.');
  return { dateISO, lat: input.lat, lon: input.lon, system, timeZone, utcOffset, disambiguation };
}

export function normalizeCalculationInput(input) {
  const main = moment(input);
  const operationKey = input.operationKey ?? 'love';
  if (!OPERATIONS.some(o => o.key === operationKey)) throw new RangeError('Choose a supported election operation.');
  const quesitedHouse = input.quesitedHouse ?? null;
  if (quesitedHouse !== null && (!Number.isInteger(quesitedHouse) || quesitedHouse < 1 || quesitedHouse > 12)) throw new RangeError('The quesited house must be 1–12.');
  for (const key of ['sectAwareFortune', 'includeVedic', 'includeReading']) {
    if (input[key] != null && typeof input[key] !== 'boolean') throw new TypeError(`${key} must be a boolean.`);
  }
  return { ...main, birth: input.birth == null ? null : moment(input.birth, main.system), operationKey, quesitedHouse,
    referenceDateISO: parseExplicitInstant(input.referenceDateISO ?? main.dateISO).toISOString(),
    sectAwareFortune: input.sectAwareFortune ?? false, includeVedic: input.includeVedic ?? true,
    includeReading: input.includeReading ?? true };
}

export function calculateContext(input) {
  const inputs = normalizeCalculationInput(input);
  const cast = m => ({ ...castChart(new Date(m.dateISO), m.lat, m.lon, m.system),
    ...(m.timeZone ? { timeZone: m.timeZone } : {}), ...(m.utcOffset !== null ? { utcOffset: m.utcOffset } : {}) });
  const chart = cast(inputs), birthChart = inputs.birth ? cast(inputs.birth) : null;
  const referenceDate = new Date(inputs.referenceDateISO), diagnostics = [];
  let hour = null, vedic = null;
  try {
    hour = planetaryHour(chart.date, chart.latitude, chart.longitude, { timeZone: inputs.timeZone, utcOffset: inputs.utcOffset });
    if (!hour) diagnostics.push({ block: 'planetaryHour', message: 'No valid sunrise–sunset interval at this latitude and instant; planetary hour is unavailable.' });
  }
  catch (error) { diagnostics.push({ block: 'planetaryHour', message: error.message }); }
  if (inputs.includeVedic) {
    try { vedic = castVedic(birthChart || chart, { currentDate: referenceDate }); }
    catch (error) { diagnostics.push({ block: 'vedic', message: error.message }); }
  }
  const era = eraAccuracy(chart.date.getUTCFullYear());
  const methods = {
    engine: 'Astronomy Engine (vendored); geocentric apparent ecliptic-of-date positions',
    zodiac: 'tropical', houseSystem: chart.system, requestedHouseSystem: inputs.system,
    houseWarning: chart.houseWarning || null, birthHouseSystem: birthChart?.system || null,
    birthHouseWarning: birthChart?.houseWarning || null,
    lots: inputs.sectAwareFortune ? 'Ptolemaic/Hermetic night reversal' : 'Lilly both-sects Fortune',
    vedic: { included: inputs.includeVedic, available: !!vedic, chartSource: birthChart ? 'birth' : 'moment',
      latitude: (birthChart || chart).latitude, longitude: (birthChart || chart).longitude,
      timeZone: (inputs.birth || inputs).timeZone, utcOffset: (inputs.birth || inputs).utcOffset,
      ayanamsha: 'Linear Lahiri estimate; 23.8531° at J2000 + 50.2877 arcseconds/year',
      houses: 'whole-sign', nodes: 'mean', referenceDateISO: inputs.referenceDateISO },
    time: { calendar: 'proleptic Gregorian; astronomical year numbering', dateISO: inputs.dateISO,
      timeZone: inputs.timeZone, utcOffset: inputs.utcOffset, disambiguation: inputs.disambiguation },
    supportedYears: [-1999, 3000], era,
    accuracy: 'Modern reference cases are validated in docs/2026-10-calculation-methods.md. The approximately one-arcminute upstream position target is not a blanket historical or interpretive accuracy guarantee.',
    diagnostics,
  };
  const reading = inputs.includeReading ? fullReading(chart, { operationKey: inputs.operationKey,
    quesitedHouse: inputs.quesitedHouse, sectAwareFortune: inputs.sectAwareFortune,
    birth: birthChart ? { chart: birthChart } : null, includeVedic: inputs.includeVedic,
    vedicCurrentDate: referenceDate, trajectoryOpts: { currentDate: referenceDate },
    precomputed: { planetaryHour: hour, vedic } }) : null;
  if (reading) {
    reading.meta.normalizedInputs = inputs;
    reading.meta.methods = methods;
  }
  return { schemaVersion: CONTEXT_SCHEMA_VERSION, inputs, chart, birthChart, vedic,
    planetaryHour: hour, reading, methods };
}
