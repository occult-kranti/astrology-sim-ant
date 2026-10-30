// Finite headless checks for the imported historical view; no astronomy rerun.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { COUNTRY_EVENT_RESEARCH as meta, COUNTRY_EVENT_RECORDS as records, COUNTRY_EVENT_COUNTRIES as countries, COUNTRY_EVENT_SOURCES as sources, getCountryEventRecords, getCountryEventRecord, validateCountryResearchChunk } from '../../js/core/data/country-event-research.js';
import { COUNTRY_HISTORY_RECORDS } from '../../js/core/data/country-history-records.js';
const root = new URL('../../../', import.meta.url), sha = bytes => createHash('sha256').update(bytes).digest('hex');
let checks = 0;
const check = (name, fn) => { fn(); checks++; console.log(`PASS ${name}`); };
const build = spawnSync(process.execPath, [new URL('./generate.mjs', import.meta.url).pathname, '--check'], { encoding: 'utf8' });
check('committed accepted snapshot reproduces every generated artifact', () => assert.equal(build.status, 0, build.stderr));
check('original founding catalogue remains sixteen records', () => assert.equal(COUNTRY_HISTORY_RECORDS.length, 16));
check('seven countries and twenty-eight distinct cited records', () => { assert.equal(countries.length, 7); assert.equal(records.length, 28); assert.equal(new Set(records.map(r => r.id)).size, 28); assert(records.every(r => r.source && r.sourceIds.length && r.sourceIds.every(id => sources.some(s => s.id === id)))); });
check('date precision and source outcomes remain separate', () => { for (const r of records) { assert.deepEqual(r.clock, { precision: 'date-only', time: null }); assert(r.startDate <= meta.asOf); if (r.outcome.status === 'ongoing') { assert.equal(r.outcome.winner, null); assert.equal(r.endDate, null); } } });
check('source metadata and selection stay headless and immutable', () => { assert(Object.isFrozen(records[0].outcome)); assert(sources.every(s => s.locator && s.readingStatus && s.accessStatus && /^[a-f0-9]{64}$/.test(s.contentSHA256))); assert.equal(getCountryEventRecord('unknown'), null); assert.throws(() => getCountryEventRecords('unknown')); assert.throws(() => getCountryEventRecords('usa', 'objective')); });
const rows = [];
for (const country of countries) {
  const descriptor = meta.chunks[country.id], bytes = readFileSync(new URL(descriptor.path, root)), chunk = JSON.parse(bytes);
  check(`${country.id}: hash-bound four-record view and fixed filters`, () => { assert.equal(bytes.length, descriptor.bytes); assert.equal(sha(bytes), descriptor.sha256); assert.equal(getCountryEventRecords(country.id).length, 4); assert.equal(getCountryEventRecords(country.id, 'election').length, 2); assert.equal(getCountryEventRecords(country.id, 'war').length, 2); validateCountryResearchChunk(chunk, country.id); });
  check(`${country.id}: samples preserve thirteen labels and unknown event clock`, () => { for (const sample of Object.values(chunk.samples)) { assert.equal(sample.calendars.length, 13); assert.equal(new Set(sample.calendars.map(c => c.id)).size, 13); assert.equal(sample.inputCertainty.sourceEventClockVerified, false); assert.equal(sample.inputCertainty.actualEventLocationVerified, false); assert(sample.calendars.every(c => c.method && c.boundary && c.sourceIds.length)); } });
  check(`${country.id}: all paired values preserve ties and missingness`, () => { for (const row of chunk.markers) for (const profile of row.profiles) { assert.equal(profile.controlScores.length, 8); const complete = Number.isFinite(profile.eventScore) && profile.controlScores.every(Number.isFinite); if (!complete) { assert.equal(profile.delta, null); assert.equal(profile.controlMean, null); } else { const mean = profile.controlScores.reduce((sum, value) => sum + value, 0) / 8; assert(Math.abs(mean - profile.controlMean) < 1e-10); assert(Math.abs(profile.eventScore - mean - profile.delta) < 1e-10); assert.equal(profile.equalControls, profile.controlScores.filter(value => Math.abs(value - profile.eventScore) < 1e-12).length); } } });
  rows.push(...chunk.markers);
}
check('all 186 marker-clock rows retain the accepted 62 markers', () => { assert.equal(rows.length, 186); assert.equal(new Set(rows.map(r => `${r.eventId}|${r.markerKind}`)).size, 62); assert.equal(rows.filter(r => r.localTime === '12:00:00' && r.markerKind === 'start').length, 28); });
const summaryBytes = readFileSync(new URL(meta.summary.path, root)), summary = JSON.parse(summaryBytes);
check('summary binding and accepted count meanings', () => { assert.equal(sha(summaryBytes), meta.summary.sha256); assert.equal(summary.counts.sourceEventGroups, 23); assert.equal(summary.counts.analysisGroups, 22); assert.equal(summary.counts.logicalControlUses, 1488); assert.equal(summary.counts.uniqueSamples, 1323); assert.equal(summary.predictionAccuracy, null); assert.equal(summary.validInferentialPValue, null); assert.equal(summary.outcomeClassifier, null); });
check('noon grouped means reproduce without fitting outcomes', () => {
  const noon = rows.filter(r => r.localTime === '12:00:00' && r.markerKind === 'start');
  for (const published of summary.primaryDescriptions) {
    const groups = new Map();
    for (const row of noon) { const value = row.profiles.find(p => p.id === published.profileId).delta; if (!groups.has(row.analysisGroupId)) groups.set(row.analysisGroupId, []); groups.get(row.analysisGroupId).push(value); }
    const eligible = [...groups.values()].filter(values => values.every(Number.isFinite));
    assert.equal(eligible.length, published.eligibleAnalysisGroups);
    if (!eligible.length) assert.equal(published.equalGroupMeanDelta, null);
    else { const mean = eligible.map(values => values.reduce((a,b) => a+b, 0) / values.length).reduce((a,b) => a+b, 0) / eligible.length; assert(Math.abs(mean - published.equalGroupMeanDelta) < 1e-10); }
  }
  const jyotisha = summary.primaryDescriptions.find(p => p.profileId === 'jyotisha-classification-study'); assert.equal(jyotisha.completeStartRecords, 0); assert.equal(jyotisha.equalGroupMeanDelta, null);
});
check('source-marker validator rejects a mismatched sample or country', () => { const chunk = JSON.parse(readFileSync(new URL(meta.chunks.usa.path, root))); assert.throws(() => validateCountryResearchChunk(chunk, 'ukraine')); chunk.markers[0].date = '2034-01-01'; assert.throws(() => validateCountryResearchChunk(chunk, 'usa')); });
console.log(`Country event research: ${checks} checks passed.`);
