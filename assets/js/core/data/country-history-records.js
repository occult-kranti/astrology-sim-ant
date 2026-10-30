// Curated historical reference markers, reviewed 30 October 2026.
// These records do not establish a unique national birth or an event clock.
// Source metadata and uncertainty are authored in the two specialist datasets.
import { COUNTRY_WEST_RECORDS, COUNTRY_WEST_SOURCES } from './country-history-west.js';
import { COUNTRY_EAST_RECORDS, COUNTRY_EAST_SOURCES } from './country-history-east.js';

const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const COUNTRY_HISTORY_COUNTRIES = freeze([
  { id: 'usa', label: 'United States', shortLabel: 'USA' },
  { id: 'israel', label: 'Israel', shortLabel: 'Israel' },
  { id: 'india', label: 'India', shortLabel: 'India' },
  { id: 'russia', label: 'Russia', shortLabel: 'Russia' },
  { id: 'iran', label: 'Iran', shortLabel: 'Iran' },
  { id: 'palestine', label: 'Palestine', shortLabel: 'Palestine' },
].map(country => ({ ...country, source: 'Editorial catalogue organization; factual event assertions and institutional status remain attached to each cited record.' })));

export const COUNTRY_HISTORY_SOURCES = freeze([...COUNTRY_WEST_SOURCES, ...COUNTRY_EAST_SOURCES]);
export const COUNTRY_HISTORY_RECORDS = freeze([...COUNTRY_WEST_RECORDS, ...COUNTRY_EAST_RECORDS]);

const sourceIds = new Set(), recordIds = new Set();
for (const source of COUNTRY_HISTORY_SOURCES) {
  if (!source.id || sourceIds.has(source.id) || !source.title || !source.locator || !source.readingStatus) throw new TypeError('Historical sources require distinct IDs and explicit reading metadata.');
  if (!['https:', 'http:'].includes(new URL(source.url).protocol)) throw new TypeError('Historical source URLs must be ordinary web references.');
  sourceIds.add(source.id);
}
for (const record of COUNTRY_HISTORY_RECORDS) {
  if (!record.id || recordIds.has(record.id) || !COUNTRY_HISTORY_COUNTRIES.some(country => country.id === record.countryId)) throw new TypeError('Historical records require distinct IDs and a known country.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date) || record.date > '2026-10-30' || Number.isNaN(Date.parse(record.date + 'T12:00:00Z')) || new Date(record.date + 'T12:00:00Z').toISOString().slice(0, 10) !== record.date) throw new RangeError('Historical records require a valid past Gregorian date key.');
  if (!record.source || !Array.isArray(record.sourceIds) || !record.sourceIds.length || record.sourceIds.some(id => !sourceIds.has(id))) throw new TypeError('Every historical record requires a citation and resolvable source IDs.');
  if (!record.scopeNote || !record.eventType || !record.originalCalendar || !Array.isArray(record.notes)) throw new TypeError('Historical event scope and calendar provenance must remain explicit.');
  if (!['date-only', 'source-clock'].includes(record.time?.status) || !record.time.qualification || (record.time.status === 'date-only' && record.time.localTime !== null)) throw new TypeError('Unknown historical event clocks must remain explicitly unknown.');
  const place = record.eventPlace;
  if (!place?.label || !place.precision || !place.zone || !Number.isFinite(place.lat) || !Number.isFinite(place.lon) || Math.abs(place.lat) > 90 || Math.abs(place.lon) > 180) throw new TypeError('Historical reference places require qualified, bounded coordinates and a zone label.');
  recordIds.add(record.id);
}
