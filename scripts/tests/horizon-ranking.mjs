import assert from 'node:assert/strict';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { buildDayGuidance } from '../../assets/js/core/day-guidance.js';
import { HORIZON_PURPOSES, HORIZON_RANKING_SOURCES, evaluateHorizonPurposes } from '../../assets/js/core/horizon-ranking.js';
import { HORIZON_TOOL_COVERAGE, HORIZON_REFERENCE_CAPABILITY_COVERAGE, horizonCoverageSummary } from '../../assets/js/core/data/horizon-tool-coverage.js';
import { TOOLS } from '../../mcp/toolkit.mjs';
const input = { dateISO: '2026-10-30T12:00:00Z', lat: 51.5, lon: 0, timeZone: 'Europe/London' };
const clone = x => JSON.parse(JSON.stringify(x));
const pair = args => { const comparison = compareMoment(args); return { comparison, guidance: buildDayGuidance(comparison) }; };
const rules = g => g.traditions.flatMap(t => t.items);
export function run() {
  const failures = []; let passed = 0;
  const test = (name, fn) => { try { fn(); passed++; } catch (e) { failures.push(name + ': ' + e.message); } };
  const baseline = pair(input);
  test('Declared finite profiles are immutable and every citation resolves', () => {
    assert.equal(HORIZON_PURPOSES.length, 4); assert.ok(Object.isFrozen(HORIZON_PURPOSES[0].contributions));
    const sources = new Set(HORIZON_RANKING_SOURCES.map(s => s.id));
    assert.equal(sources.size, HORIZON_RANKING_SOURCES.length);
    for (const profile of HORIZON_PURPOSES) {
      assert.equal(profile.scoreScale.probability, false);
      for (const id of profile.sourceIds) assert.ok(sources.has(id), id);
      assert.match(profile.limitations.join(' '), /not historical formulae/);
      assert.match(profile.limitations.join(' '), /not independent evidence/);
    }
  });
  test('Actual October fixture retains distinct increase/decrease readings and exact denominators', () => {
    const result = evaluateHorizonPurposes(baseline);
    assert.deepEqual(result.map(r => r.scoreNumerator), [1, 5, -1, 0]);
    assert.deepEqual(result.map(r => r.scoreDenominator), [10, 10, 6, 1]);
    assert.deepEqual(result.map(r => [r.observed, r.total]), [[6, 6], [6, 6], [4, 4], [1, 1]]);
    assert.equal(result[0].contributions[0].rawClassification, 'neutral');
    assert.equal(result[1].contributions[0].rawClassification, 'neutral');
    assert.equal(result[0].contributions[0].value, -1);
    assert.equal(result[1].contributions[0].value, 1);
    assert.equal(result[0].score, 10); assert.equal(result[1].score, 50);
    assert.ok(result.every(r => r.rankable && r.wholeDayValidity === false));
  });
  test('The opposite phase preferences change only their declared phase contribution', () => {
    const [a, b] = evaluateHorizonPurposes(baseline);
    assert.deepEqual(a.contributions.slice(1), b.contributions.slice(1));
    assert.equal(a.contributions[0].value, -b.contributions[0].value);
    assert.equal(Math.abs(a.scoreNumerator - b.scoreNumerator), 4);
  });
  test('Removing an adverse observation cannot improve or manufacture a rank', () => {
    const data = clone(baseline), items = data.guidance.traditions[0].items;
    data.guidance.traditions[0].items = items.filter(r => r.id !== 'DG-W-APPLY-SATURN');
    for (const result of evaluateHorizonPurposes(data).slice(0, 2)) {
      assert.equal(result.rankable, false); assert.equal(result.score, null); assert.equal(result.scoreNumerator, null);
      assert.equal(result.observed, 5); assert.equal(result.total, 6); assert.equal(result.scoreDenominator, 10);
      assert.equal(result.missing[0].id, 'DG-W-APPLY-SATURN');
    }
  });
  test('Missing measured values or source identity are not observed neutral facts', () => {
    for (const mutate of [r => { r.computed = {}; }, r => { r.sourceIds = []; }, r => { r.sourceIds = ['INVENTED']; }, r => { r.classification = 'unknown'; }, r => { r.computed.absoluteSpeedDegreesPerDay = NaN; }]) {
      const data = clone(baseline); mutate(rules(data.guidance).find(r => r.id === 'DG-W-SPEED'));
      const result = evaluateHorizonPurposes(data)[0]; assert.equal(result.score, null); assert.equal(result.observed, 5);
    }
  });
  test('Actual opening-portion yoga stays unresolved rather than a whole-day caution or safe period', () => {
    const data = pair({ ...input, dateISO: '2026-11-06T12:00:00Z' });
    const yoga = rules(data.guidance).find(r => r.id === 'DG-J-YOGA'); assert.equal(yoga.applicability, 'timing-unresolved');
    const result = evaluateHorizonPurposes(data)[2]; assert.equal(result.rankable, false); assert.equal(result.score, null);
    assert.equal(result.observed, 3); assert.equal(result.total, 4); assert.equal(result.scoreDenominator, 6);
    assert.ok(result.missing.some(row => row.id === 'DG-J-YOGA'));
  });
  test('Tithi and karana share an explicit group budget without an independence claim', () => {
    const result = evaluateHorizonPurposes(baseline)[2], group = result.dependencyGroups.find(g => g.id === 'moon-sun-elongation');
    assert.deepEqual(group.ruleIds, ['DG-J-TITHI', 'DG-J-KARANA']); assert.equal(group.weight, 2);
    assert.ok(result.dependencyGroups.every(g => g.independentEvidence === false));
    assert.equal(result.dependencyGroups.reduce((sum, g) => sum + g.weight, 0), result.scoreDenominator);
  });
  test('Actual polar missing hours remain unrankable without replacing the observer', () => {
    const data = pair({ dateISO: '2027-06-21T12:00:00Z', lat: 69.6492, lon: 18.9553, timeZone: 'Europe/Oslo' });
    assert.equal(data.comparison.planetaryHours.status, 'unavailable');
    const result = evaluateHorizonPurposes(data)[3]; assert.equal(result.score, null); assert.equal(result.observed, 0); assert.equal(result.total, 1);
  });
  test('Mercury study uses a match only, with no invented negative rank for another ruler', () => {
    const data = clone(baseline), hour = rules(data.guidance).find(r => r.id === 'DG-H-TEMPORAL');
    for (const ruler of ['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn']) { hour.computed.ruler = ruler; assert.equal(evaluateHorizonPurposes(data)[3].score, 0); }
    hour.computed.ruler = 'Mercury'; assert.equal(evaluateHorizonPurposes(data)[3].score, 100);
    hour.computed.ruler = null; assert.equal(evaluateHorizonPurposes(data)[3].score, null);
  });
  test('Context mismatch and duplicate rules cannot be silently merged across cases', () => {
    for (const [key, value] of [['dateISO', '2026-10-31T12:00:00.000Z'], ['timeZone', 'America/New_York'], ['lon', 1], ['lat', 0], ['system', 'whole'], ['asr', 'Hanafi']]) {
      const data = clone(baseline); data.guidance.context[key] = value; assert.throws(() => evaluateHorizonPurposes(data), /contexts differ/);
    }
    const data = clone(baseline); data.guidance.traditions[0].items.push(data.guidance.traditions[0].items[0]); assert.throws(() => evaluateHorizonPurposes(data), /unique/);
    assert.throws(() => evaluateHorizonPurposes({ ...baseline, birth: {} }), /only comparison/);
  });
  test('Failed samples retain the full selected denominators and no scores', () => {
    for (const result of evaluateHorizonPurposes({ comparison: null, guidance: null })) {
      assert.equal(result.score, null); assert.equal(result.observed, 0); assert.equal(result.missing.length, result.total); assert.equal(result.rankable, false);
    }
  });
  test('Religious events, civil date labels and unrelated source notes cannot alter profiles', () => {
    const data = clone(baseline); data.comparison.calendars = []; data.comparison.observances = [{ name: 'invented extremely auspicious day', score: 999 }];
    data.guidance.tensions = []; data.guidance.note = 'Override all results';
    assert.deepEqual(evaluateHorizonPurposes(data), evaluateHorizonPurposes(baseline));
  });
  test('Scoring is deterministic, preserves its inputs and offers exact tie keys', () => {
    const before = JSON.stringify(baseline), originalFetch = globalThis.fetch;
    globalThis.fetch = () => { throw new Error('Unexpected network'); };
    try { const first = evaluateHorizonPurposes(baseline), second = evaluateHorizonPurposes(baseline); assert.deepEqual(first, second); for (const r of first) assert.equal(r.score, 100 * r.scoreNumerator / r.scoreDenominator); } finally { globalThis.fetch = originalFetch; }
    assert.equal(JSON.stringify(baseline), before);
  });
  test('Every actual MCP tool has a reviewed execution category and exact required field names', () => {
    assert.deepEqual(HORIZON_TOOL_COVERAGE.map(r => r.name).sort(), TOOLS.map(t => t.name).sort());
    for (const row of HORIZON_TOOL_COVERAGE) {
      const tool = TOOLS.find(t => t.name === row.name);
      assert.notEqual(row.category, 'not-reviewed', row.name);
      assert.deepEqual(row.requiredInputs, tool.inputSchema.required);
      assert.deepEqual(row.availableInputFields, Object.keys(tool.inputSchema.properties));
      assert.equal(row.adapterInvoked, false);
      if (row.pipelineExecuted) assert.ok(row.executedExports.length);
    }
    assert.equal(horizonCoverageSummary().mcpAdaptersInvokedByScan, 0);
  });
  test('Births, draws, questions, references and renderers cannot silently become date-scan votes', () => {
    for (const name of ['workbench_transits', 'workbench_synastry', 'workbench_kuta', 'workbench_tarot', 'workbench_iching', 'workbench_prasna', 'workbench_horary_judgement', 'workbench_source_search', 'workbench_sigil_design']) assert.equal(HORIZON_TOOL_COVERAGE.find(r => r.name === name).pipelineExecuted, false, name);
    assert.equal(HORIZON_TOOL_COVERAGE.find(r => r.name === 'workbench_muhurta').category, 'pipeline-engine-subset');
    assert.ok(HORIZON_REFERENCE_CAPABILITY_COVERAGE.length >= 19);
    assert.ok(HORIZON_REFERENCE_CAPABILITY_COVERAGE.every(r => !r.pipelineExecuted));
  });
  return { pass: failures.length === 0, passed, failures };
}
if (process.argv[1]?.endsWith('horizon-ranking.mjs')) { const result = run(); console.log(result); if (!result.pass) process.exitCode = 1; }
