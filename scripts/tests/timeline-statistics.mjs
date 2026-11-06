import assert from 'node:assert/strict';
import { analyzeTimelineStatistics, finiteGridExceedance, midranks, spearmanCorrelation, binaryCooccurrence, holmAdjust, TIMELINE_STATISTICS_LIMITS, TIMELINE_STATISTICS_SOURCES } from '../../assets/js/core/timeline-statistics.js';

let checks = 0;
const ok = (condition, label) => { assert.ok(condition, label); checks++; };
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const near = (actual, expected, label, tolerance = 1e-12) => ok(Math.abs(actual - expected) <= tolerance, label + ': ' + actual + ' versus ' + expected);
const rejects = async (fn, pattern, label) => { await assert.rejects(fn, pattern, label); checks++; };
const throws = (fn, pattern, label) => { assert.throws(fn, pattern, label); checks++; };
const times = n => Array.from({ length: n }, (_, i) => new Date(Date.UTC(2028, 0, 1) + i * 86400000).toISOString());
const row = (id, values, kind = 'binary', dependencyGroup = 'shared-lunar-measurement') => ({ id, label: id, kind, dependencyGroup, values });
const analyze = (rows, options = {}) => analyzeTimelineStatistics(rows, { sampleTimesISO: times(rows[0]?.values.length ?? 4), yieldControl: async () => {}, ...options });

const frequency = finiteGridExceedance([3, null, 1, 3, 2]);
equal(frequency.exceedanceCount, [2, null, 4, 2, 3], 'Every exact tie counts in the upper tail');
equal(frequency.exceedanceFrequency, [.5, null, 1, .5, .75], 'Denominator counts observed grid slots, not all slots or distinct scores');
equal([frequency.availableCount, frequency.missingCount], [4, 1], 'Missingness is retained');
equal(finiteGridExceedance([null, null]).exceedanceFrequency, [null, null], 'All missing is not zero or favorable');
equal(finiteGridExceedance([0, 0]).exceedanceFrequency, [1, 1], 'All ties have frequency one');
near(finiteGridExceedance([Number.MAX_VALUE, Number.MAX_VALUE]).mean, Number.MAX_VALUE, 'Finite extremes do not overflow the mean', 0);
near(finiteGridExceedance([Number.MAX_VALUE, -Number.MAX_VALUE]).mean, 0, 'Opposing finite extremes retain finite mean', 0);
equal(midranks([10, 30, 20, 10]), [1.5, 4, 3, 1.5], 'Midrank fixture');
near(spearmanCorrelation([1, 1, 2, 3], [1, 2, 2, 3]), 5 / 6, 'Tie-correct Spearman differs from shortcut rank-difference formula');
near(spearmanCorrelation([1, 2, 3], [3, 2, 1]), -1, 'Negative monotonic association');
near(spearmanCorrelation([1, null, 3, 10], [1, 4, null, 2]), 1, 'Pairwise-complete observations are ranked again');
equal(spearmanCorrelation([2, 2, 2], [1, 2, 3]), null, 'Constant correlations remain unavailable');
equal(spearmanCorrelation([null, 2], [1, null]), null, 'No jointly available observations');
const binary = binaryCooccurrence([1, 1, 0, 0], [1, 0, 1, 0]);
equal([binary.both, binary.leftOnly, binary.rightOnly, binary.neither], [1, 1, 1, 1], 'Binary contingency table');
near(binary.phi, 0, 'Independent balanced binary phi'); near(binary.jaccard, 1 / 3, 'Jaccard union denominator'); near(binary.lift, 1, 'Lift one for balanced independent table');
equal(binaryCooccurrence([0, 0], [0, 0]).jaccard, null, 'Empty union is not perfect similarity');
equal(binaryCooccurrence([1, 1], [1, 0]).phi, null, 'Binary constant marginal has no phi');
equal(holmAdjust([.01, .04, .03]), [.03, .06, .06], 'Known Holm example');
equal(holmAdjust([.01, null, .04]), [.03, null, .08], 'Unavailable hypothesis remains in full family');
equal(holmAdjust([.01], 4), [.04], 'External planned hypotheses cannot shrink the denominator');
equal(holmAdjust([0, 0, 1, null]), [0, 0, 1, null], 'General Holm routine preserves ties and nulls');
equal(holmAdjust([]), [], 'Empty family supported');

const alternating = await analyze([row('a', [1, 0, 1, 0]), row('b', [1, 0, 1, 0])]);
near(alternating.pairs[0].spearman, 1, 'Perfect alternating association');
equal(alternating.method.offsets, [1, 2, 3], 'All nonidentity shifts enumerated on short grid');
equal(alternating.pairs[0].phaseReference.tailProbability, 1, 'Alternating perfect correlation is not unusual under absolute circular correlation');
equal(alternating.pairs[0].phaseReference.effectAboveNullMedian, 0, 'Null median can equal perfect observed correlation');
equal(alternating.pairs[0].dependencyOverlap, ['shared-lunar-measurement'], 'Shared calculation origin remains visible');
const blocks = await analyze([row('a', [1, 1, 0, 0]), row('b', [1, 1, 0, 0])]);
equal(blocks.pairs[0].phaseReference.tailProbability, .5, 'Hand-enumerated absolute correlation tail [1,0,1,0]');
equal(blocks.pairs[0].phaseReference.referenceSamples, 4, 'Identity counted exactly once');
equal(blocks.pairs[0].phaseReference.exact, true, 'Exhaustive phase distribution labelled exact');
equal(blocks.family.minimumRawProbability, .25, 'Exact finite phase probability resolution');
equal(blocks.family.canReachAlpha, false, 'Four samples cannot reach .05 for one pair');
const withConstant = await analyze([row('a', [1, 1, 0, 0]), row('b', [1, 1, 0, 0]), row('fixed-natal-map', [7, 7, 7, 7], 'continuous', 'fixed-natal-angular-geometry')]);
equal(withConstant.family.plannedPairs, 3, 'All selected hypotheses remain planned');
equal(withConstant.family.testedPairs, 1, 'Constant pairs are not tested');
equal(withConstant.pairs[0].phaseReference.adjustedTailProbability, 1, 'Constants do not shrink multiplicity correction');
for (const pair of withConstant.pairs.slice(1)) { equal(pair.spearman, null, 'Constant map correlation unavailable'); equal(pair.phaseReference.tailProbability, null, 'Constant map probability unavailable'); }
const missing = await analyze([row('a', [1, null, 0, 0]), row('b', [1, 1, 0, 1])]);
equal(missing.pairs[0].validPairs, 3, 'Descriptive denominator reports complete pairs');
equal(missing.pairs[0].phaseReference.status, 'unavailable', 'Missing data do not become regularly sampled by compression');
ok(missing.pairs[0].phaseReference.reason.includes('missing values'), 'Missing-series reason');
const gapTimes = times(4); gapTimes[2] = null;
const gap = await analyze([row('a', [1, 0, 1, 0]), row('b', [1, 1, 0, 0])], { sampleTimesISO: gapTimes });
equal(gap.grid.status, 'unavailable', 'Missing instant invalidates circular phase audit');
const irregularTimes = times(4); irregularTimes[2] = new Date(Date.parse(irregularTimes[2]) + 3600000).toISOString();
const irregular = await analyze([row('a', [1, 0, 1, 0]), row('b', [1, 1, 0, 0])], { sampleTimesISO: irregularTimes });
equal(irregular.grid.status, 'unavailable', '23/25-hour UTC intervals do not masquerade as equal spacing');
equal(irregular.pairs[0].spearman, 0, 'Irregular grid retains descriptive association');
const reversed = await analyze([row('a', [1, 0, 1, 0]), row('b', [1, 1, 0, 0])], { sampleTimesISO: times(4).reverse() });
equal(reversed.grid.status, 'unavailable', 'Descending UTC grid rejected for phase comparison');
const tooShort = await analyze([row('a', [1, 0, 1]), row('b', [1, 1, 0])]);
equal(tooShort.pairs[0].phaseReference.status, 'unavailable', 'Short-series eligibility is explicit');
const empty = await analyzeTimelineStatistics([], { sampleTimesISO: times(4), yieldControl: async () => {} });
equal([empty.sampleCount, empty.series.length, empty.pairs.length, empty.family.plannedPairs], [4, 0, 0, 0], 'Calendar-only scans need no fabricated statistical signal');
const singleton = await analyze([row('only', [1, 0, 1, 0])]);
equal(singleton.family.plannedPairs, 0, 'One series has no pairwise hypotheses');

// Exact finite-null calibration check. The observations here are every possible
// orientation of a deliberately synthetic sequence, not astrological outcomes.
const base = [1, 1, 0, 0, 0, 0], probabilities = [];
for (let shift = 0; shift < base.length; shift++) {
  const rotated = base.map((_, i) => base[(i + shift) % base.length]);
  probabilities.push((await analyze([row('a', base), row('b', rotated)])).pairs[0].phaseReference.tailProbability);
}
for (let numerator = 0; numerator <= base.length; numerator++) {
  const alpha = numerator / base.length;
  ok(probabilities.filter(p => p <= alpha + 1e-14).length / base.length <= alpha + 1e-14, 'Exact finite phase test is not anticonservative over its own complete synthetic null at ' + alpha);
}
const n = 1030, a = Array.from({ length: n }, (_, i) => i % 13), b = Array.from({ length: n }, (_, i) => (i * 7) % 19);
const sampled = await analyze([row('a', a, 'continuous'), row('b', b, 'continuous')], { rotations: 127 });
const replay = await analyze([row('a', a, 'continuous'), row('b', b, 'continuous')], { rotations: 127 });
equal(sampled, replay, 'Complete deterministic replay including fixed unique offsets');
equal(sampled.method.offsets.length, 127, 'Requested sampled budget honored');
equal(new Set(sampled.method.offsets).size, 127, 'Sampled phase shifts are unique');
ok(sampled.method.offsets.every(offset => offset >= 1 && offset < n), 'Sample excludes duplicate identity and invalid phases');
equal(sampled.pairs[0].phaseReference.exact, false, 'Subset is not called exhaustive');
ok(sampled.pairs[0].phaseReference.tailProbability >= 1 / 128, 'No zero Monte Carlo reference probability');
equal(sampled.pairs[0].phaseReference.referenceSamples, 128, 'Plus-one identity correction denominator');
equal(JSON.parse(JSON.stringify(sampled)), sampled, 'Result is exact JSON data without hidden infinities or undefined fields');
const reordered = await analyze([row('b', b, 'continuous'), row('a', a, 'continuous')], { rotations: 127 });
near(reordered.pairs[0].spearman, sampled.pairs[0].spearman, 'Observed correlation is symmetric');
equal(reordered.pairs[0].phaseReference, sampled.pairs[0].phaseReference, 'Canonical ID orientation makes sampled phase audit invariant to UI column order');

for (const invalid of [[1, undefined], [1, NaN], [1, Infinity], [1, '2'], Array(2), []]) throws(() => finiteGridExceedance(invalid), /finite|aligned|holes/, 'Reject invalid/missing-without-null inputs');
throws(() => midranks([1, null]), /complete/, 'Do not rank an unspecified missing subset');
throws(() => binaryCooccurrence([1, 2], [1, 0]), /Binary/, 'Reject nonbinary values in binary table');
throws(() => holmAdjust([.01, .1], 1), /family/, 'Reject shrinking the planned family');
throws(() => holmAdjust([-.1]), /\[0,1\]/, 'Reject invalid raw probability');
for (const rotations of [null, 0, 10, 128, 2048, '127']) await rejects(() => analyze([row('a', [1, 0, 1, 0])], { rotations }), /127, 511 or 1023/, 'Reject adaptive/arbitrary rotation budget');
await rejects(() => analyze([row('same', [1, 0]), row('same', [0, 1])]), /distinct/, 'Distinct IDs required');
await rejects(() => analyze([row('a', [1, 0]), row('b', [1, 0, 1])]), /align/, 'Aligned series required');
await rejects(() => analyze([row('a', [1, 0])], { sampleTimesISO: ['2028-02-30T00:00:00Z', '2028-03-01T00:00:00Z'] }), /real date/, 'Invalid normalized date rejected');
await rejects(() => analyze([row('a', [1, 0])], { sampleTimesISO: ['2028-01-01', '2028-01-02'] }), /explicit UTC/, 'Date-only clock cannot become an instant');
const accessor = { id: 'a', label: 'a', kind: 'binary', get values() { throw Error('must not execute'); } };
await rejects(() => analyzeTimelineStatistics([accessor], { sampleTimesISO: times(2) }), /accessor/, 'Untrusted accessor never executes');
const hidden = row('a', [1, 0]); Object.defineProperty(hidden, 'extra', { value: 3, enumerable: false });
await rejects(() => analyze([hidden]), /unsupported/, 'Hidden input fields rejected');
const controller = new AbortController(); controller.abort();
await rejects(() => analyze([row('a', [1, 0])], { signal: controller.signal }), { name: 'AbortError' }, 'Already-cancelled request rejects');
const midController = new AbortController(); let yielded = 0;
await rejects(() => analyze([row('a', a, 'continuous'), row('b', b, 'continuous')], { signal: midController.signal, yieldControl: async () => { if (++yielded === 2) midController.abort(); } }), { name: 'AbortError' }, 'Cancellation interrupts the phase loop before completion');
equal(yielded, 2, 'No background continuation after cancellation');
const mutable = [row('a', [1, 1, 0, 0]), row('b', [1, 1, 0, 0])]; let changed = false;
const copied = await analyze(mutable, { yieldControl: async () => { if (!changed) { mutable[0].values.fill(null); changed = true; } } });
equal(copied.pairs[0].phaseReference.tailProbability, .5, 'Held values copied before asynchronous yields');
ok(TIMELINE_STATISTICS_SOURCES.every(source => source.id && source.url.startsWith('https:') && source.readingDepth && source.rights), 'Method source ledger explicitly qualifies reading depth and rights');
equal(TIMELINE_STATISTICS_LIMITS.defaultRotations, 1023, 'Fixed default budget recorded');

// Complete ten-series worst scanner shape: 45 pairs, 3660 daily samples and the
// fixed 1023 nonidentity references. This is a computational stress test only.
const stressLength = 3660, stressSeries = Array.from({ length: 10 }, (_, j) => row('stress-' + j, Array.from({ length: stressLength }, (_, i) => Math.sin(i / (13 + j)) + (i % (7 + j)) / 10), 'continuous', 'synthetic-' + j));
const start = performance.now(); let progressCalls = 0, stressYields = 0;
const stress = await analyze(stressSeries, { onProgress: event => { ok(event.completed <= event.total && event.total === 45, 'Bounded progress'); progressCalls++; }, yieldControl: async () => { stressYields++; } });
const stressMs = performance.now() - start;
equal([stress.sampleCount, stress.family.plannedPairs, stress.family.testedPairs], [3660, 45, 45], 'Worst permitted scanner family fully evaluated');
equal(stress.method.actualRotations, 1023, 'Worst family uses fixed full budget');
ok(stress.family.minimumAdjustedProbability === 45 / 1024, 'Family-adjusted reference resolution displayed');
ok(stressYields >= 45 && progressCalls === 46, 'Long statistics work supplies cooperative checkpoints');
ok(stress.pairs.every(pair => pair.phaseReference.tailProbability > 0 && pair.phaseReference.adjustedTailProbability >= pair.phaseReference.tailProbability), 'Full family has positive and multiplicity-adjusted reference values');
const mcpStress = await analyze(stressSeries.map(s => ({ ...s, values: s.values.slice(0, 366) })));
const mcpBytes = new TextEncoder().encode(JSON.stringify(mcpStress)).length;
ok(mcpBytes < 128 * 1024, 'Statistics alone fit the bounded MCP summary for366days');
console.log(JSON.stringify({ status: 'PASS', checks, stress: { samples: stressLength, series: 10, pairs: 45, nonidentityRotations: 1023, elapsedMs: Math.round(stressMs), cooperativeYields: stressYields }, statisticsBytesAt366Days: mcpBytes, scope: 'Synthetic numerical and boundary fixtures; not astrological-outcome calibration or predictive validation.' }, null, 2));
