// Fixture integrity and selected arithmetic checks. This never runs a model or
// opens the sealed set, and passing it is not an answer-quality result.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gregorianToJDN } from '../../assets/js/core/calendar.js';
import { panchangaFromLongitudes } from '../../assets/js/core/vedic.js';
import { easter } from '../../assets/js/core/cultural-calendars.js';
import { DOMICILE, DIGNITY_SCORES } from '../../assets/js/core/data/dignities-data.js';
import { normalizeDesktopProfile } from '../../assets/js/core/desktop-workbench.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const sha = value => createHash('sha256').update(value).digest('hex');
const dataset = read('research/model-lab/evaluation-cases.json');
const corrected = read('research/model-lab/training-v3.json');
const sources = read('research/model-lab/sources.json');
const traditions = ['egyptian', 'mayan', 'dee', 'lilly', 'vedic', 'chinese', 'hebrew', 'jung', 'plato'];
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const equal = (a, b, message) => { assert.deepEqual(a, b, message); checks++; };
equal(dataset.schemaVersion, 1, 'Known fixture schema');
equal(dataset.traditions, traditions, 'Stable tradition IDs');
equal(dataset.development.length, 12, 'Twelve development scenarios');
equal(dataset.training.length, 24, 'Twenty-four original training examples');
equal(dataset.actualGenerationSubset, ['D05', 'D09', 'D07', 'D10'], 'Frozen generation subset');
equal(dataset.heldout.count, 8, 'Sealed scenario count');
equal(dataset.heldout.sha256, 'da92b50c805396af7decbc437d250164ab8106295633b844cc1088f079829b39', 'Independent sealed commitment');
check(!('questions' in dataset.heldout) && !('cases' in dataset.heldout), 'Public metadata does not unseal cases');
const ids = new Set(), groups = new Set(), covered = new Set(), questions = new Set();
for (const item of dataset.development) {
  check(/^D\d{2}$/.test(item.id) && !ids.has(item.id), `Unique dev ID ${item.id}`); ids.add(item.id);
  equal(item.split, 'development', `Explicit split ${item.id}`);
  check(typeof item.group === 'string' && !groups.has(item.group), `Unique scenario ${item.id}`); groups.add(item.group);
  check(item.question.length > 20 && !questions.has(item.question), `Distinct question ${item.id}`); questions.add(item.question);
  check(item.traditions.length > 0 && item.traditions.every(id => traditions.includes(id)), `Known traditions ${item.id}`);
  item.traditions.forEach(id => covered.add(id));
  const evidenceIds = new Set();
  for (const source of item.evidence) {
    check(source.id.startsWith(`EVAL-${item.id}-`) && !evidenceIds.has(source.id), `Distinct supplied evidence ${source.id}`); evidenceIds.add(source.id);
    check(source.text.length > 20 && source.sourceLocator.length > 5, `Evidence and locator ${source.id}`);
    equal(source.readingDepth, 'original-evaluation-fixture', 'Fixtures are not mislabelled book quotations');
    if (/^https:\/\//.test(source.sourceFile)) {
      const url = new URL(source.sourceFile);
      check(!url.username && !url.password, 'Public reference URL has no embedded credentials');
    } else {
      const path = resolve(root, source.sourceFile);
      check(path.startsWith(root.endsWith(sep) ? root : root + sep) && existsSync(path), `Public source locator exists: ${source.sourceFile}`);
      check(!/private|evidence\/telemetry|node_modules/.test(source.sourceFile), 'No private source locator');
    }
  }
  check(item.expected.requiredCitationIds.every(id => evidenceIds.has(id)), `Citations name supplied evidence ${item.id}`);
  check(['none', 'scope-limited', 'missing-input'].includes(item.expected.abstention), `Explicit abstention scope ${item.id}`);
  check(Array.isArray(item.expected.scenarioCriteria), `Separate scenario review criteria ${item.id}`);
  for (const field of [...item.expected.facts, ...item.expected.numeric]) {
    check(field.anyOf.length > 0 && field.anyOf.every(pattern => new RegExp(pattern, 'iu')), `Compilable screening hints ${item.id}/${field.id}`);
  }
  for (const number of item.expected.numeric) check(Number.isFinite(number.value) && number.tolerance >= 0 && number.unit, `Numerical rubric has value and unit ${item.id}`);
}
equal([...covered].sort(), [...traditions].sort(), 'All nine traditions represented by development fixtures');

const trainingQuestions = new Set();
for (const item of dataset.training) {
  check(/^T\d{2}$/.test(item.id) && !ids.has(item.id), `Unique training ID ${item.id}`); ids.add(item.id);
  check(/CC0-1.0/.test(item.rights), 'Original training rights declared');
  equal(item.messages.map(row => row.role), ['system', 'user', 'assistant'], 'Training role structure');
  const user = item.messages[1].content;
  const match = /^Evidence \[([^\]]+)\]: (.*?)\nQuestion: (.+)$/s.exec(user);
  check(Boolean(match), `Explicit training evidence/question ${item.id}`);
  const [, sourceId, , question] = match;
  check(!questions.has(question) && !trainingQuestions.has(question), 'No exact train/dev question duplicate'); trainingQuestions.add(question);
  const target = JSON.parse(item.messages[2].content);
  equal(target.actions, [], 'Training never executes a chart action');
  check(target.citations.every(id => id === sourceId), 'Original targets use only supplied source IDs');
}
equal(corrected.training.length, dataset.training.length, 'V3 retains training size');
equal(corrected.parentTrainingRecordsSHA256, sha(JSON.stringify(dataset.training)), 'V3 commits to unchanged original training records');
for (let index = 0; index < corrected.training.length; index++) {
  const current = corrected.training[index], original = dataset.training[index];
  equal(current.id, original.id, 'V3 retains training IDs');
  equal(current.messages[1].content, original.messages[1].content, 'V3 retains exact questions and evidence');
  equal(current.split, 'training', 'V3 split is explicit');
  const [, sourceId, sourceText] = /^Evidence \[([^\]]+)\]: (.*?)\nQuestion: (.+)$/s.exec(current.messages[1].content);
  const target = JSON.parse(current.messages[2].content);
  equal(Object.keys(target).sort(), ['actions', 'answer', 'citations', 'grounding'], 'V3 uses the served answer schema');
  equal(target.actions, [], 'No automatic actions');
  check(target.citations.every(id => id === sourceId && target.answer.includes(`[${id}]`)), 'Listed citations appear inline');
  equal(target.grounding.length, target.citations.length, 'One grounding item per supplied training citation');
  for (const row of target.grounding) {
    check(row.sourceId === sourceId && target.citations.includes(row.sourceId), 'Grounding refers to exact supplied ID');
    check(row.quote.length >= 12 && sourceText.includes(row.quote), 'Grounding quote is a nontrivial exact substring');
    check(typeof row.claim === 'string' && row.claim.length > 10, 'Grounding claim is explicit');
  }
}

// Independent known arithmetic anchors, distinct from matching generated prose.
const byId = Object.fromEntries(dataset.development.map(row => [row.id, row]));
equal(gregorianToJDN(2012, 12, 21) - 584283, 13 * 144000, 'D02: supplied GMT anchor gives thirteen baktuns');
equal(DOMICILE[0], 'Mars', 'D04: Aries domicile ruler');
equal(DIGNITY_SCORES.domicile, byId.D04.expected.numeric[0].value, 'D04: one domicile testimony is five points');
const { sunLongitude, moonLongitude } = byId.D05.context;
equal(((moonLongitude - sunLongitude) % 360 + 360) % 360, 24, 'D05: wrapped elongation');
equal(panchangaFromLongitudes(sunLongitude, moonLongitude).tithi.num, 3, 'D05: canonical tithi partition');
check(readFileSync(resolve(root, 'assets/js/core/calendar-atlas.js'), 'utf8').includes("['Severe Cold','大寒']"), 'D06: atlas names the same solar term with an English translation variant');
assert.throws(() => normalizeDesktopProfile({ timeKnown: false }), /known time/); checks++;
const clock = zone => new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(byId.D11.context.instant));
equal(clock('Asia/Kolkata'), '17:30', 'D11: Indian local clock for the supplied instant');
equal(clock('America/New_York'), '07:00', 'D11: New York local clock after the 2026 DST change');
equal(easter(2027, 'gregorian').gregorian, { y: 2027, m: 3, d: 28 }, 'D12: Gregorian computus');
equal(easter(2027, 'julian').native, { y: 2027, m: 4, d: 19 }, 'D12: Julian native date');
equal(easter(2027, 'julian').gregorian, { y: 2027, m: 5, d: 2 }, 'D12: converted Julian Pascha');

const sourceIds = new Set();
for (const source of sources.sources) {
  check(!sourceIds.has(source.id), `Unique research receipt ${source.id}`); sourceIds.add(source.id);
  check(source.url.startsWith('https://') && source.readingDepth && source.claim, 'Source has URL and honest reading scope');
  if (source.status === 200) check(/^[a-f0-9]{64}$/.test(source.sha256) && source.bytes > 0, 'Successful retrieval has byte receipt');
  else check(/failed|not read/i.test(source.readingDepth), 'Failed retrieval is not described as read');
}
console.log(JSON.stringify({
  status: 'PASS', checks, kind: 'fixture-integrity-and-selected-arithmetic',
  developmentScenarios: dataset.development.length, trainingExamples: dataset.training.length,
  correctedTrainingExamples: corrected.training.length, selectedGenerationCases: dataset.actualGenerationSubset,
  traditions: [...covered], sealedCount: dataset.heldout.count, sealedSHA256: dataset.heldout.sha256,
  researchReceipts: sourceIds.size,
  limits: ['No model inference occurred in this check.', 'The private held-out file was never opened.', 'Regex, citation and exact-quote matches do not establish semantic correctness.', 'Source-file existence is not independent verification of all historical claims.']
}, null, 2));
