// Descriptive finite-grid comparisons and an explicitly artificial circular-phase
// reference model. These calculations do not estimate real-world event outcomes.
export const TIMELINE_STATISTICS_SOURCES = Object.freeze([
  { id: 'TLS-ASA', title: 'ASA statement on statistical significance and p-values (official release, 2016)', url: 'https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf', locator: 'Page 2, six principles', readingDepth: 'Selected official summary; not the full journal article', rights: 'Reference metadata and original methodological paraphrase only' },
  { id: 'TLS-PHIPSON', title: 'Phipson and Smyth: Permutation P-values Should Never Be Zero', url: 'https://gksmyth.github.io/pubs/permp.pdf', locator: 'Author PDF corrected 9 February 2011; sections 4–6', readingDepth: 'Selected full-text methods sections', rights: 'Reference metadata and original methodological paraphrase only' },
  { id: 'TLS-SURROGATES', title: 'Schreiber and Schmitz: Surrogate time series', url: 'https://arxiv.org/abs/chao-dyn/9909037', locator: 'Sections 1, 3, 4 and 7.2: stated nulls, selection, periodic boundaries and nonstationarity', readingDepth: 'Selected full-text methods and limitations', rights: 'Reference metadata and original methodological paraphrase only' },
  { id: 'TLS-HOLM-R', title: 'R stats: p.adjust documentation and implementation', url: 'https://stat.ethz.ch/R-manual/R-devel/library/stats/html/p.adjust.html', locator: 'Holm method, full n and arbitrary dependence; official p.adjust.R implementation', readingDepth: 'Documentation and source implementation; original Holm paper not accessed', rights: 'Reference metadata and original mathematical implementation; R source is GPL-2-or-later' },
  { id: 'TLS-SCIPY', title: 'SciPy permutation_test documentation', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html', locator: 'Exact/randomized tails, plus-one correction, ties and null assumptions', readingDepth: 'Selected official API documentation', rights: 'Reference metadata and original methodological paraphrase only' },
].map(Object.freeze));

export const TIMELINE_STATISTICS_LIMITS = Object.freeze({ maxSeries: 10, maxSamples: 4096, rotationBudgets: Object.freeze([127, 511, 1023]), defaultRotations: 1023, fixedSeed: 0x51f15eed, tieTolerance: 1e-12 });
const SOURCE_IDS = Object.freeze(TIMELINE_STATISTICS_SOURCES.map(x => x.id));
const LIMITATIONS = Object.freeze([
  'All series are calculations on the declared finite sampling grid. Correlation and exceedance frequency are not probabilities of wars, illness, financial performance or other real-world outcomes.',
  'Calendar labels and rules can share the same Sun, Moon, clock or arithmetic. A strong correlation can be an expected mathematical dependency rather than independent corroboration.',
  'The circular-phase reference assumes a uniformly selected relative rotation on a finite periodic grid. It preserves each complete series and its circular ordering but changes cross-series phase; this artificial model is not established as a data-generating mechanism.',
  'Equal UTC spacing and complete data are necessary eligibility checks here, not proof of stationarity or of the periodic wrap boundary. Trends, annual seasonality, discontinuities and endpoint mismatch can make the reference scientifically inappropriate.',
  'Holm adjustment uses every pair in this requested family, including unavailable pairs as conservative family slots. It does not correct for earlier runs, changed date windows, selected locations, thresholds, alternative rules or undisclosed searches.',
  'A fixed natal map is constant through a date scan; its correlation and phase-reference probability are unavailable. Time-varying map calculations must be explicitly identified as event or transit maps.',
]);
const owns = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const finite = x => typeof x === 'number' && Number.isFinite(x);

function object(raw, allowed, label) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || ![Object.prototype, null].includes(Object.getPrototypeOf(raw)) || Object.getOwnPropertySymbols(raw).length) throw new TypeError(label + ' must be a plain object.');
  const entries = Object.entries(Object.getOwnPropertyDescriptors(raw));
  if (entries.some(([key, d]) => !allowed.includes(key) || !d.enumerable || !owns(d, 'value'))) throw new TypeError(label + ' contains an unsupported field or accessor.');
  return raw;
}
function text(raw, label, max = 160) {
  if (typeof raw !== 'string' || !raw.trim() || raw.length > max || /[\u0000-\u001f\u007f]/.test(raw)) throw new TypeError(label + ' must be a bounded nonempty string.');
  return raw.trim();
}
function values(raw, label = 'Values') {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > TIMELINE_STATISTICS_LIMITS.maxSamples) throw new RangeError(label + ' requires 1–4096 aligned slots.');
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    const d = Object.getOwnPropertyDescriptor(raw, String(i));
    if (!d || !owns(d, 'value') || (d.value !== null && !finite(d.value))) throw new TypeError(label + ' accepts finite numbers or explicit null only; holes/accessors are not data.');
    out.push(d.value);
  }
  return out;
}
function average(xs) {
  if (!xs.length) return null;
  const scale = xs.reduce((maximum, x) => Math.max(maximum, Math.abs(x)), 0);
  return scale ? scale * Math.max(-1, Math.min(1, xs.reduce((sum, x) => sum + x / scale, 0) / xs.length)) : 0;
}
function median(xs) {
  if (!xs.length) return null;
  const ordered = [...xs].sort((a, b) => a - b), middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : ordered[middle - 1] / 2 + ordered[middle] / 2;
}

/** Exact descriptive upper-tail frequencies within the supplied finite grid.
 * The selected value itself and all ties count. Missing slots stay null. */
export function finiteGridExceedance(raw) {
  const xs = values(raw), known = xs.filter(x => x !== null), ordered = [...known].sort((a, b) => a - b), counts = new Map();
  for (let i = 0; i < ordered.length; i++) if (!counts.has(ordered[i])) counts.set(ordered[i], ordered.length - i);
  return { availableCount: known.length, missingCount: xs.length - known.length, minimum: known.length ? ordered[0] : null, maximum: known.length ? ordered.at(-1) : null, mean: average(known), constant: known.length > 0 && ordered[0] === ordered.at(-1), exceedanceCount: xs.map(x => x === null ? null : counts.get(x)), exceedanceFrequency: xs.map(x => x === null ? null : counts.get(x) / known.length), meaning: 'Fraction of available sampled slots whose value is at least this value, including ties. This is a finite-grid frequency, not a p-value or outcome probability.' };
}

/** Ascending midranks. Exact numerical ties share their average one-based rank. */
export function midranks(raw) {
  const xs = values(raw);
  if (xs.includes(null)) throw new TypeError('Rank only a specified complete subset.');
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x || a.i - b.i), ranks = new Array(xs.length);
  for (let start = 0; start < order.length;) {
    let end = start + 1;
    while (end < order.length && order[end].x === order[start].x) end++;
    const rank = (start + 1 + end) / 2;
    for (let i = start; i < end; i++) ranks[order[i].i] = rank;
    start = end;
  }
  return ranks;
}
function centeredRanks(xs) {
  const ranks = midranks(xs), mean = (ranks.length + 1) / 2, centered = Float64Array.from(ranks, x => x - mean);
  let squares = 0;
  for (const x of centered) squares += x * x;
  return { centered, squares };
}
function correlation(a, b) {
  const denominator = Math.sqrt(a.squares * b.squares);
  if (!(denominator > 0)) return null;
  let numerator = 0;
  for (let i = 0; i < a.centered.length; i++) numerator += a.centered[i] * b.centered[i];
  return Math.max(-1, Math.min(1, numerator / denominator));
}
export function spearmanCorrelation(left, right) {
  const a = values(left), b = values(right);
  if (a.length !== b.length) throw new RangeError('Correlation series lengths differ.');
  const x = [], y = [];
  for (let i = 0; i < a.length; i++) if (a[i] !== null && b[i] !== null) { x.push(a[i]); y.push(b[i]); }
  if (x.length < 2) return null;
  return correlation(centeredRanks(x), centeredRanks(y));
}
export function binaryCooccurrence(left, right) {
  const x = values(left), y = values(right);
  if (x.length !== y.length || [...x, ...y].some(v => v !== null && v !== 0 && v !== 1)) throw new TypeError('Binary series must be aligned 0/1/null values.');
  let both = 0, leftOnly = 0, rightOnly = 0, neither = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] === null || y[i] === null) continue;
    if (x[i] && y[i]) both++; else if (x[i]) leftOnly++; else if (y[i]) rightOnly++; else neither++;
  }
  const n = both + leftOnly + rightOnly + neither, leftHits = both + leftOnly, rightHits = both + rightOnly;
  const denominator = Math.sqrt(leftHits * (n - leftHits) * rightHits * (n - rightHits));
  return { both, leftOnly, rightOnly, neither, validPairs: n, phi: denominator ? (both * neither - leftOnly * rightOnly) / denominator : null, jaccard: both + leftOnly + rightOnly ? both / (both + leftOnly + rightOnly) : null, leftHitRate: n ? leftHits / n : null, rightHitRate: n ? rightHits / n : null, coHitRate: n ? both / n : null, lift: leftHits && rightHits ? both * n / (leftHits * rightHits) : null };
}

/** Missing hypotheses remain null while retaining their place in the family. */
export function holmAdjust(raw, familySize = raw?.length) {
  if (!Array.isArray(raw) || raw.length > 45 || !Number.isInteger(familySize) || familySize < raw.length || familySize > 45) throw new RangeError('Holm requires a declared family of at most 45 hypotheses.');
  const xs = raw.length ? values(raw, 'Reference probabilities') : [];
  if (xs.some(x => x !== null && (x < 0 || x > 1))) throw new RangeError('Reference probabilities must be in [0,1].');
  const order = xs.map((p, i) => ({ p, i })).filter(x => x.p !== null).sort((a, b) => a.p - b.p || a.i - b.i), result = xs.map(() => null);
  let running = 0;
  for (let i = 0; i < order.length; i++) { running = Math.max(running, Math.min(1, (familySize - i) * order[i].p)); result[order[i].i] = running; }
  return result;
}

function gridInfo(raw, n) {
  if (!Array.isArray(raw) || raw.length !== n) throw new TypeError('sampleTimesISO must align with every sampled slot.');
  const times = [];
  for (let i = 0; i < raw.length; i++) {
    const d = Object.getOwnPropertyDescriptor(raw, String(i));
    if (!d || !owns(d, 'value')) throw new TypeError('Sample times cannot have holes or accessors.');
    const value = d.value;
    if (value === null) { times.push(null); continue; }
    if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) throw new TypeError('Sample instants must be explicit UTC ISO strings or null.');
    const instant = new Date(value);
    if (instant.toISOString().slice(0, 19) !== value.slice(0, 19)) throw new TypeError('Sample instant is not a real date.');
    times.push(instant.getTime());
  }
  const available = times.filter(x => x !== null), base = { sampleCount: n, availableInstants: available.length, spacingMilliseconds: null };
  if (n < 4) return { ...base, status: 'unavailable', reason: 'At least four slots are required for the circular-phase sensitivity comparison.' };
  if (available.length !== n) return { ...base, status: 'unavailable', reason: 'The sampled grid contains missing instants; dates are not compressed or imputed.' };
  const spacing = times[1] - times[0];
  if (spacing <= 0 || times.slice(1).some((time, i) => time - times[i] !== spacing)) return { ...base, status: 'unavailable', reason: 'The grid is not strictly increasing at equal UTC intervals. DST changes, repeated instants and unequal spacing are not silently treated as regular.' };
  return { ...base, status: 'eligible', reason: null, spacingMilliseconds: spacing };
}
function offsetsFor(n, budget) {
  const available = n - 1;
  if (available <= budget) return { offsets: Array.from({ length: available }, (_, i) => i + 1), exact: true };
  let state = (TIMELINE_STATISTICS_LIMITS.fixedSeed ^ n) >>> 0;
  const random = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return state >>> 0; };
  const order = Array.from({ length: available }, (_, i) => i + 1);
  // Rejection avoids modulo bias; this is a reproducible computational reference,
  // not a source of empirical randomness or a fitted inferential model.
  for (let i = 0; i < budget; i++) {
    const span = available - i, ceiling = Math.floor(0x100000000 / span) * span;
    let value; do { value = random(); } while (value >= ceiling);
    const j = i + value % span; [order[i], order[j]] = [order[j], order[i]];
  }
  return { offsets: order.slice(0, budget).sort((a, b) => a - b), exact: false };
}
function abortIfNeeded(signal) {
  if (signal?.aborted) { const error = new Error('Timeline statistics cancelled.'); error.name = 'AbortError'; throw error; }
}
const yieldTask = () => new Promise(resolve => setTimeout(resolve, 0));

/** All chosen pairs are audited. Missing/constant pairs stay in the planned Holm
 * family. The permutation budget and seed never adapt to the observed result. */
export async function analyzeTimelineStatistics(rawSeries, rawOptions) {
  const options = object(rawOptions, ['sampleTimesISO', 'rotations', 'signal', 'onProgress', 'yieldControl'], 'Statistics options');
  const budget = owns(options, 'rotations') ? options.rotations : TIMELINE_STATISTICS_LIMITS.defaultRotations;
  if (!TIMELINE_STATISTICS_LIMITS.rotationBudgets.includes(budget)) throw new RangeError('Choose 127, 511 or 1023 fixed nonidentity rotations.');
  for (const key of ['onProgress', 'yieldControl']) if (owns(options, key) && typeof options[key] !== 'function') throw new TypeError(key + ' must be a function when supplied.');
  if (!Array.isArray(rawSeries) || rawSeries.length > 10) throw new RangeError('Choose 0–10 aligned series.');
  const series = [], seen = new Set(); let sampleCount;
  for (let index = 0; index < rawSeries.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(rawSeries, String(index));
    if (!descriptor || !owns(descriptor, 'value')) throw new TypeError('Series cannot have holes or accessors.');
    const raw = object(descriptor.value, ['id', 'label', 'kind', 'dependencyGroup', 'dependencyGroups', 'values'], 'Series');
    const id = text(raw.id, 'Series ID', 100), label = text(raw.label, 'Series label');
    if (seen.has(id)) throw new TypeError('Series IDs must be distinct.'); seen.add(id);
    if (!['binary', 'continuous'].includes(raw.kind)) throw new TypeError('Series kind must be binary or continuous.');
    const xs = values(raw.values); sampleCount ??= xs.length;
    if (xs.length !== sampleCount || raw.kind === 'binary' && xs.some(v => v !== null && v !== 0 && v !== 1)) throw new TypeError('Series must align; binary values must be 0,1 or null.');
    const groups = owns(raw, 'dependencyGroups') ? raw.dependencyGroups : owns(raw, 'dependencyGroup') ? [raw.dependencyGroup] : [];
    if (!Array.isArray(groups) || groups.length > 16) throw new TypeError('Supply at most sixteen dependency groups.');
    const checkedGroups = [];
    for (let i = 0; i < groups.length; i++) {
      const d = Object.getOwnPropertyDescriptor(groups, String(i));
      if (!d || !owns(d, 'value')) throw new TypeError('Dependency groups cannot have holes or accessors.');
      checkedGroups.push(text(d.value, 'Dependency group', 100));
    }
    const dependencyGroups = [...new Set(checkedGroups)].sort();
    series.push({ id, label, kind: raw.kind, dependencyGroups, values: xs });
  }
  abortIfNeeded(options.signal);
  if (sampleCount === undefined) {
    if (!Array.isArray(options.sampleTimesISO) || options.sampleTimesISO.length < 1 || options.sampleTimesISO.length > TIMELINE_STATISTICS_LIMITS.maxSamples) throw new RangeError('Supply 1–4096 sampled instants even when no statistical series were requested.');
    sampleCount = options.sampleTimesISO.length;
  }
  const grid = gridInfo(options.sampleTimesISO, sampleCount), plannedPairs = series.length < 2 ? 0 : series.length * (series.length - 1) / 2;
  const reference = offsetsFor(sampleCount, budget), offsets = grid.status === 'eligible' ? reference.offsets : [];
  const summaries = series.map(({ values: xs, ...row }) => ({ ...row, ...finiteGridExceedance(xs) }));
  const rankCache = series.map(row => row.values.includes(null) ? null : centeredRanks(row.values));
  const doubleCache = rankCache.map(rank => rank ? Float64Array.from([...rank.centered, ...rank.centered]) : null);
  const pairs = [], pause = options.yieldControl ?? yieldTask;
  const progress = () => options.onProgress?.({ stage: 'statistics', completed: pairs.length, total: plannedPairs });
  progress(); await pause(); abortIfNeeded(options.signal);
  for (let left = 0; left < series.length; left++) for (let right = left + 1; right < series.length; right++) {
    abortIfNeeded(options.signal);
    const a = series[left], b = series[right], x = [], y = [];
    for (let k = 0; k < sampleCount; k++) if (a.values[k] !== null && b.values[k] !== null) { x.push(a.values[k]); y.push(b.values[k]); }
    const value = x.length > 1 ? correlation(centeredRanks(x), centeredRanks(y)) : null;
    const descriptiveReason = x.length < 2 ? 'Fewer than two jointly available samples.' : value === null ? 'At least one series is constant on the jointly available samples.' : null;
    const row = { id: JSON.stringify([a.id, b.id]), leftId: a.id, rightId: b.id, leftLabel: a.label, rightLabel: b.label, validPairs: x.length, missingPairs: sampleCount - x.length, spearman: value, descriptiveStatus: descriptiveReason ? 'unavailable' : 'available', descriptiveReason, binary: a.kind === 'binary' && b.kind === 'binary' ? binaryCooccurrence(a.values, b.values) : null, dependencyOverlap: a.dependencyGroups.filter(group => b.dependencyGroups.includes(group)), phaseReference: null };
    let reason = grid.status !== 'eligible' ? grid.reason : x.length !== sampleCount ? 'At least one series has missing values. No complete-case compression, imputation or shifting of missingness is used.' : value === null ? descriptiveReason : null;
    if (reason) row.phaseReference = { status: 'unavailable', reason, tailProbability: null, adjustedTailProbability: null, observedAbsCorrelation: value === null ? null : Math.abs(value), nullMedianAbsCorrelation: null, effectAboveNullMedian: null, referenceSamples: 0, exact: null };
    else {
      // Canonical ID orientation makes a sampled audit invariant to UI column
      // order without pretending the selected offsets form a complete group.
      const referenceLeft = a.id < b.id ? left : right, referenceRight = a.id < b.id ? right : left;
      const observed = Math.abs(value), nullValues = [observed], ar = rankCache[referenceLeft], br = rankCache[referenceRight], doubled = doubleCache[referenceRight], denominator = Math.sqrt(ar.squares * br.squares);
      let atLeastAsExtreme = 1;
      for (let index = 0; index < offsets.length; index++) {
        let sum = 0; const offset = offsets[index];
        for (let i = 0; i < sampleCount; i++) sum += ar.centered[i] * doubled[i + offset];
        const absolute = Math.min(1, Math.abs(sum / denominator)); nullValues.push(absolute);
        if (absolute >= observed - TIMELINE_STATISTICS_LIMITS.tieTolerance) atLeastAsExtreme++;
        if ((index + 1) % 64 === 0) { await pause(); abortIfNeeded(options.signal); }
      }
      const nullMedian = median(nullValues);
      row.phaseReference = { status: 'available', reason: null, tailProbability: atLeastAsExtreme / nullValues.length, adjustedTailProbability: null, observedAbsCorrelation: observed, nullMedianAbsCorrelation: nullMedian, effectAboveNullMedian: observed - nullMedian, referenceSamples: nullValues.length, atLeastAsExtreme, exact: reference.exact };
    }
    pairs.push(row); progress(); await pause(); abortIfNeeded(options.signal);
  }
  const adjusted = holmAdjust(pairs.map(row => row.phaseReference.tailProbability), plannedPairs);
  pairs.forEach((row, i) => { row.phaseReference.adjustedTailProbability = adjusted[i]; });
  const testedPairs = pairs.filter(row => row.phaseReference.status === 'available').length;
  const resolution = grid.status === 'eligible' && testedPairs > 0 ? 1 / (offsets.length + 1) : null;
  const minimumAdjusted = resolution === null || !plannedPairs ? null : Math.min(1, plannedPairs * resolution);
  return { schemaVersion: 1, kind: 'timeline-statistics', sampleCount, grid, series: summaries, pairs,
    family: { plannedPairs, testedPairs, unavailablePairs: plannedPairs - testedPairs, adjustment: 'Holm', unavailablePolicy: 'Unavailable hypotheses retain a p=1 slot for family correction and remain null in displayed results.', minimumRawProbability: resolution, minimumAdjustedProbability: minimumAdjusted, alpha: 0.05, canReachAlpha: minimumAdjusted === null ? null : minimumAdjusted <= 0.05, resolutionScope: 'Theoretical smallest first Holm-adjusted value for this family and reference budget; ties can raise the attainable minimum. This is not a significance or outcome claim.' },
    method: { id: 'circular-phase-reference-v1', requestedRotations: budget, actualRotations: testedPairs ? offsets.length : 0, seed: TIMELINE_STATISTICS_LIMITS.fixedSeed, offsets: testedPairs ? offsets : [], identityIncluded: true, exact: testedPairs ? reference.exact : null, statistic: 'Absolute Spearman correlation using midranks; two-sided in correlation sign', orientation: 'The lexicographically later series ID is rotated, independent of displayed column order.', tieTolerance: TIMELINE_STATISTICS_LIMITS.tieTolerance, denominator: 'One identity orientation plus every unique selected nonidentity rotation; ties count as at least as extreme.', probabilityMeaning: 'Reference probability under a uniformly rotated finite periodic series; not a calibrated real-world event probability.', assumptions: ['Complete series on a strictly increasing equal-UTC grid', 'Uniform relative circular phase is the explicitly artificial reference model', 'No claim of stationarity, valid periodic boundary or independence of calendar rules', 'All selected pairs belong to the correction family before any result is displayed'], fixedBudget: true, outcomeProbabilityAvailable: false },
    limitations: [...LIMITATIONS], sourceIds: [...SOURCE_IDS] };
}
