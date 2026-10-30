// Rebuild the compact historical view from the committed accepted snapshot.
// This imports fixed calculations; it never reruns astronomy or fits outcomes.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here = new URL('./', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = JSON.parse(readFileSync(new URL('provenance.json', here)));
const zipped = readFileSync(new URL('accepted-research.json.gz', here));
if (sha(zipped) !== provenance.acceptedSnapshot.sha256) throw new Error('Accepted snapshot hash mismatch.');
const raw = gunzipSync(zipped);
if (sha(raw) !== provenance.acceptedSnapshot.decodedSHA256) throw new Error('Decoded snapshot hash mismatch.');
const data = JSON.parse(raw), check = process.argv.includes('--check');
const outputs = new Map(), chunks = {};
const encode = value => JSON.stringify(value) + '\n';
if (data.records.length !== 28 || data.countries.length !== 7 || data.summary.counts.analysisGroups !== 22 || data.summary.counts.sourceEventGroups !== 23) throw new Error('Accepted cohort counts changed.');
if (data.records.some(r => !r.source || r.clock.time !== null || r.clock.precision !== 'date-only')) throw new Error('Source or precision missing.');
for (const country of data.countries) {
  const chunk = data.countryChunks[country.id], text = encode(chunk);
  if (data.records.filter(r => r.countryId === country.id).length !== 4) throw new Error('Four records per country required.');
  chunks[country.id] = { path: `assets/data/country-events/${country.id}.json`, bytes: Buffer.byteLength(text), sha256: sha(text), markerRows: chunk.markers.length, samples: Object.keys(chunk.samples).length };
  outputs.set(new URL(`${country.id}.json`, here), text);
}
const summaryText = encode(data.summary);
outputs.set(new URL('summary.json', here), summaryText);
const meta = { schemaVersion: 1, asOf: data.summary.asOf, counts: data.summary.counts, clocks: data.summary.clocks, primaryClock: data.summary.primaryClock, controlOffsets: data.summary.controlOffsets, chunks, summary: { path: 'assets/data/country-events/summary.json', bytes: Buffer.byteLength(summaryText), sha256: sha(summaryText) }, acceptedSnapshotSHA256: provenance.acceptedSnapshot.sha256, provenancePath: 'assets/data/country-events/provenance.json', source: 'Imported accepted historical research; fixed source records and computed snapshots. See provenance.json for original artifact hashes and projection limits.' };
const declarations = Object.entries({ COUNTRY_EVENT_RESEARCH: meta, COUNTRY_EVENT_COUNTRIES: data.countries, COUNTRY_EVENT_RECORDS: data.records, COUNTRY_EVENT_SOURCES: data.sources, COUNTRY_EVENT_PROFILES: data.profiles, COUNTRY_EVENT_CALCULATION_SOURCES: data.calculationSources }).map(([name, value]) => `export const ${name} = freeze(${JSON.stringify(value)});`).join('\n');
const helpers = `
const ids = new Set(COUNTRY_EVENT_COUNTRIES.map(c => c.id));
export function getCountryEventRecords(countryId, type = 'all') {
  if (!ids.has(countryId) || !['all', 'election', 'war'].includes(type)) throw new RangeError('Choose a catalogue country and event type.');
  return COUNTRY_EVENT_RECORDS.filter(r => r.countryId === countryId && (type === 'all' || r.type === type)).sort((a,b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));
}
export function getCountryEventRecord(id) { return COUNTRY_EVENT_RECORDS.find(r => r.id === id) || null; }
export function validateCountryResearchChunk(chunk, countryId) {
  if (!ids.has(countryId) || chunk?.schemaVersion !== 1 || chunk.countryId !== countryId || !Array.isArray(chunk.markers) || !chunk.samples) throw new TypeError('Historical research chunk does not match the selected country.');
  const expected = COUNTRY_EVENT_RESEARCH.chunks[countryId];
  if (chunk.markers.length !== expected.markerRows || Object.keys(chunk.samples).length !== expected.samples) throw new RangeError('Historical research chunk is incomplete.');
  for (const row of chunk.markers) {
    const record = getCountryEventRecord(row.eventId), sample = chunk.samples[row.sampleId];
    if (!record || record.countryId !== countryId || !['start','end','outcome'].includes(row.markerKind) || !COUNTRY_EVENT_RESEARCH.clocks.includes(row.localTime) || row.assumedClock !== true || !sample || sample.caseId !== countryId || sample.dateISO !== row.dateISO || sample.localTime !== row.localTime || row.controls.length !== 8 || row.profiles.length !== 4) throw new TypeError('Historical marker, observer and assumed sample disagree.');
    const date = row.markerKind === 'start' ? record.startDate : row.markerKind === 'end' ? record.endDate : record.outcome.date;
    if (date !== row.date || sample.date !== date || sample.calendars.length !== 13) throw new TypeError('Source date and stored comparison disagree.');
  }
  return chunk;
}
`;
outputs.set(new URL('../../js/core/data/country-event-research.js', here), `// Generated by assets/data/country-events/generate.mjs. Do not hand edit.\n// Source: accepted 30 October 2026 retrospective audit; dates are not national births.\n// Pure data and lookup helpers. No outcome prediction, inferred religious belief or future ranking.\nconst freeze = value => { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };\n${declarations}\n${helpers}`);
let failed = 0;
for (const [url, text] of outputs) {
  if (check) { if (!existsSync(url) || readFileSync(url, 'utf8') !== text) { console.error(`Drift: ${fileURLToPath(url)}`); failed++; } }
  else writeFileSync(url, text);
}
if (failed) process.exitCode = 1;
else console.log(`Country event research: ${outputs.size} artifacts ${check ? 'match' : 'generated'}; 28 records, 7 countries; accepted calculations imported without refitting.`);
