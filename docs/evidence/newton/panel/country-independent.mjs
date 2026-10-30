// Independent bounded metadata/arithmetic cross-review. Does not run astronomy,
// classify outcomes, inspect new raw historical passages, or alter project data.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const repo = '/workspace/astrology-sim-ant';
const analysis = '/workspace/analysis/country-events-2034';
const receiptPath = '/workspace/setup-validation/newton-calendar/engine-country-cross-review.json';
const started = performance.now();
const digest = b => createHash('sha256').update(b).digest('hex');
const read = path => fs.readFileSync(repo + '/' + path);
const { COUNTRY_EVENT_RESEARCH: meta, COUNTRY_EVENT_RECORDS: records, COUNTRY_EVENT_COUNTRIES: countries, COUNTRY_EVENT_PROFILES: profiles, COUNTRY_EVENT_SOURCES: sources, COUNTRY_EVENT_CALCULATION_SOURCES: calcSources } = await import(pathToFileURL(repo + '/assets/js/core/data/country-event-research.js'));
const provenance = JSON.parse(read('assets/data/country-events/provenance.json'));
const inputPaths = ['assets/js/core/data/country-event-research.js', 'assets/data/country-events/provenance.json', 'docs/2026-10-country-event-research.md', ...Object.values(meta.chunks).map(d => d.path), meta.summary.path].map(path => repo + '/' + path).concat(provenance.originalArtifactBindings.map(d => analysis + '/' + d.path));
const hashes = () => inputPaths.map(path => { const bytes = fs.readFileSync(path); return { path, bytes: bytes.length, sha256: digest(bytes) }; });
const before = hashes();
const sampleMap = new Map(), markers = [];
let n = 0;
const check = (condition, label) => { assert.ok(condition, label); n++; };
check(records.length === 28, '28 records');
check(countries.length === 7, '7 observers');
check(new Set(records.map(r => r.eventGroupId)).size === 23, '23 source-event groups');
check(new Set(records.map(r => r.analysisGroupId)).size === 22, '22 dependence groups');
for (const r of records) {
  check(r.clock.precision === 'date-only' && r.clock.time === null, r.id + ' no clock');
  check(r.sourceIds.every(id => sources.some(s => s.id === id)), r.id + ' source closure');
}
for (const [countryId, d] of Object.entries(meta.chunks)) {
  const b = read(d.path);
  check(b.length === d.bytes && digest(b) === d.sha256, countryId + ' binding');
  const c = JSON.parse(b);
  check(c.markers.length === d.markerRows && Object.keys(c.samples).length === d.samples, countryId + ' counts');
  markers.push(...c.markers);
  for (const [sid, s] of Object.entries(c.samples)) {
    sampleMap.set(sid, s);
    check(s.calendars.length === 13 && new Set(s.calendars.map(c => c.id)).size === 13, sid + ' calendars');
    check(s.inputCertainty.sourceEventClockVerified === false && s.inputCertainty.actualEventLocationVerified === false, sid + ' assumptions');
    check(s.sourceIds.every(id => calcSources.some(t => t.id === id)), sid + ' calculation closure');
  }
}
for (const m of markers) {
  const s = sampleMap.get(m.sampleId), r = records.find(r => r.id === m.eventId);
  check(s && s.dateISO === m.dateISO && s.date === m.date && s.localTime === m.localTime, m.markerId + ' exact sample');
  check(m.eventGroupId === r.eventGroupId && m.analysisGroupId === r.analysisGroupId, m.markerId + ' groups');
  check(JSON.stringify(m.controls.map(c => c.offsetDays)) === JSON.stringify(meta.controlOffsets), m.markerId + ' offsets');
  for (const p of m.profiles) {
    const def = profiles.find(d => d.id === p.id), denom = def.contributions.reduce((a, c) => a + c.weight, 0);
    check(p.eventScoreDenominator === denom && p.controlScoreDenominators.every(d => d === denom), p.id + ' denominator');
    check(p.eventScore === null ? p.eventScoreNumerator === null : p.eventScore === 100 * p.eventScoreNumerator / denom, p.id + ' event arithmetic');
    check(p.availableControls === p.controlScores.filter(Number.isFinite).length, p.id + ' availability');
    if (p.eventScore === null || p.availableControls < 8) {
      check(p.controlMean === null && p.delta === null && p.equalControls === null, p.id + ' complete-pair missingness');
    } else {
      const mean = p.controlScores.reduce((a, b) => a + b, 0) / 8;
      check(Math.abs(mean - p.controlMean) < 1e-10 && Math.abs(p.eventScore - mean - p.delta) < 1e-10, p.id + ' paired arithmetic');
      check(p.equalControls === p.controlScoreNumerators.filter(v => v === p.eventScoreNumerator).length, p.id + ' exact ties');
    }
    if (p.id === 'mercury-hour-study') check([null, 0, 100].includes(p.eventScore) && p.controlScores.every(s => [null, 0, 100].includes(s)), p.id + ' match semantics');
  }
}
const summaryBytes = read(meta.summary.path);
check(summaryBytes.length === meta.summary.bytes && digest(summaryBytes) === meta.summary.sha256, 'summary binding');
const summary = JSON.parse(summaryBytes), reconstructed = [];
for (const p of profiles) {
  const rows = markers.filter(m => m.markerKind === 'start' && m.localTime === '12:00:00').map(m => ({ group: m.analysisGroupId, profile: m.profiles.find(v => v.id === p.id) }));
  const grouped = new Map();
  for (const r of rows) { if (r.profile.delta === null) continue; if (!grouped.has(r.group)) grouped.set(r.group, []); grouped.get(r.group).push(r.profile.delta); }
  const means = [...grouped.values()].map(v => v.reduce((a, b) => a + b, 0) / v.length), mean = means.length ? means.reduce((a, b) => a + b, 0) / means.length : null;
  const stored = summary.primaryDescriptions.find(v => v.profileId === p.id);
  check(stored.completeStartRecords === rows.filter(r => r.profile.delta !== null).length && stored.eligibleAnalysisGroups === grouped.size, p.id + ' group counts');
  check(mean === null ? stored.equalGroupMeanDelta === null : Math.abs(mean - stored.equalGroupMeanDelta) < 1e-10, p.id + ' equal group mean');
  reconstructed.push({ id: p.id, complete: stored.completeStartRecords, groups: grouped.size, mean });
}
check(markers.length === 186 && sampleMap.size === 150, 'retained marker/sample counts');
for (const item of provenance.originalArtifactBindings) {
  const bytes = fs.readFileSync(analysis + '/' + item.path);
  check(bytes.length === item.bytes && digest(bytes) === item.sha256, item.path + ' original held binding');
}
const after = hashes();
assert.deepEqual(after, before, 'Input files remained unchanged during this review');
const driverPath = new URL(import.meta.url).pathname;
const result = {
  schemaVersion: 1, pass: true, assertions: n, inputStabilityVerified: true,
  scope: 'Independent metadata, fixed denominator, exact tie, complete-control missingness, retained sample binding and equal-group arithmetic review. No new astronomy or outcome model was run. No additional full historical source reading is claimed.',
  counts: { markers: markers.length, distinctRetainedSamples: sampleMap.size, retainedCalendarSlots: sampleMap.size * 13, profileComparisons: markers.length * 4, originalBindings: provenance.originalArtifactBindings.length },
  means: reconstructed,
  priorExploratoryExpectationCorrection: 'An initial reviewer-only assertion that every war winner field must be null was too broad. The accepted 1971 eastern-theatre record contains an explicitly attributed, qualified Indian outcome. This is not a universal binary conflict classifier and is not used in the profile arithmetic. The final driver preserves the accepted outcome rather than treating this as a producer defect.',
  runtime: { node: process.version, icu: process.versions.icu, platform: process.platform, elapsedMilliseconds: performance.now() - started },
  driver: { path: driverPath, sha256: digest(fs.readFileSync(driverPath)) },
  inputs: before,
};
fs.writeFileSync(receiptPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ pass: result.pass, assertions: n, counts: result.counts, receiptPath, driverSHA256: result.driver.sha256 }));
