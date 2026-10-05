// Whitelist disclosure, exact real transport payload and adversarial lifecycle
// checks. No provider credentials or real network calls are used.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { createStudySession } from '../../assets/js/core/study-session.js';
import { calculateContext } from '../../assets/js/core/calculation-context.js';
import { buildStudyPacket, buildStudyPrompt, studyCitationWarnings } from '../../assets/js/core/study-packet.js';
import { buildSessionStudyRequest, createSessionStudyController } from '../../assets/js/app/session-study.js';

const input = { task: 'kamea', dateISO: '2026-10-05T12:00:00Z', lat: 37.123456, lon: 121.987654, system: 'whole', style: 'north', planet: 'Sun', method: 'latin', text: 'PRIVATELETTERS', followHour: false, locationSource: 'manual' };
const original = { id: 'PRIVATEID', createdAt: '2026-10-05T15:42:13Z', input, lens: 'agrippa', purpose: 'question', title: 'PRIVATETITLE', question: 'PRIVATEQUESTION', observationNotes: 'PRIVATENOTES', hypothesis: 'PRIVATEHYPOTHESIS', reflection: 'PRIVATEREFLECTION', measurement: { expected: 'PRIVATEEXPECTED', observed: 'PRIVATEOBSERVED', uncertainty: 'PRIVATEUNCERTAINTY', unit: 'PRIVATEUNIT', method: 'PRIVATEMETHOD' } };
const fixture = changes => createStudySession({ ...original, ...changes });
const context = calculateContext({ ...input, includeReading: false, includeVedic: true });

export async function run() {
  const failures = [], passed = [];
  const test = async (name, fn) => { try { await fn(); passed.push(name); } catch (e) { failures.push(`${name}: ${e.message}`); } };
  await test('Default packet never serializes optional text, identity, coordinates, history or credentials', () => {
    const session = { ...fixture(), apiKey: 'SECRETKEY', birth: { name: 'PRIVATEPERSON' }, history: ['PRIVATEHISTORY'] };
    const dirty = { ...context, methods: { ...context.methods, note: 'METHODSECRET', vedic: { latitude: input.lat, longitude: input.lon, note: 'NESTEDSECRET' } }, authorization: 'SECRETHEADER' };
    const packet = buildStudyPacket(session, dirty), serialized = JSON.stringify(packet);
    for (const secret of ['PRIVATE', 'SECRET', String(input.lat), String(input.lon), original.createdAt, 'ascendant', 'midheaven', 'cusps', 'hourNumber']) assert.ok(!serialized.includes(secret), `Leaked ${secret}`);
    assert.ok(packet.facts.some(f => f.kind === 'computed-astronomy'));
    assert.ok(Object.isFrozen(packet) && Object.isFrozen(packet.facts[0].value));
    assert.throws(() => buildStudyPacket(session, { ...context, birthChart: context.chart }), /birth charts/);
  });
  await test('Each disclosure grants only its explicit category, including derived location quantities', () => {
    const s = fixture();
    const located = JSON.stringify(buildStudyPacket(s, context, { includeLocation: true }));
    assert.ok(located.includes(String(input.lat)) && located.includes(String(input.lon)) && located.includes('ascendant'));
    assert.ok(!located.includes('PRIVATE'));
    const notes = JSON.stringify(buildStudyPacket(s, context, { includeNotes: true }));
    for (const expected of ['PRIVATENOTES', 'PRIVATEEXPECTED', 'PRIVATEHYPOTHESIS', 'PRIVATEREFLECTION']) assert.ok(notes.includes(expected));
    for (const absent of ['PRIVATEQUESTION', 'PRIVATETITLE', 'PRIVATELETTERS', String(input.lat)]) assert.ok(!notes.includes(absent));
    const question = JSON.stringify(buildStudyPacket(s, context, { includeQuestion: true }));
    assert.ok(question.includes('PRIVATEQUESTION') && question.includes('PRIVATETITLE')); assert.ok(!question.includes('PRIVATENOTES'));
    const symbolic = JSON.stringify(buildStudyPacket(s, context, { includeSymbolText: true }));
    assert.ok(symbolic.includes('PRIVATELETTERS')); assert.ok(!symbolic.includes('PRIVATEQUESTION'));
  });
  await test('Source IDs resolve; immutable time and method provenance survive without session bookkeeping', () => {
    const p = buildStudyPacket(fixture(), context);
    assert.equal(p.scope.instantUTC, new Date(input.dateISO).toISOString()); assert.equal(p.scope.lensId, 'agrippa');
    const sourceIds = new Set(p.sources.map(s => s.id));
    assert.ok(sourceIds.has('AGR-II-22'));
    for (const fact of p.facts) assert.ok(fact.sourceIds.every(id => sourceIds.has(id)));
    assert.deepEqual(buildStudyPacket(fixture({ id: 'another', createdAt: '2026-10-06T00:00Z' }), context), p);
    assert.throws(() => buildStudyPacket(fixture({ input: { ...input, dateISO: '2026-10-05T13:00Z' } }), context), /stale/);
    assert.throws(() => buildStudyPacket(fixture(), context, { includeNotes: 'yes' }));
    assert.throws(() => buildStudyPacket(fixture(), context, { includeBirth: true }));
    const prompt = buildStudyPrompt(p);
    assert.ok(prompt.user.endsWith(JSON.stringify(p, null, 2))); assert.match(prompt.system, /untrusted data/);
    assert.deepEqual(studyCitationWarnings('Supported [F1] and [AGR-II-22], unknown [F999] [WB-FAKE].', p).length, 2);
  });
  await test('Imported SkyLens selection is labelled as selection, never visual proof; coordinates stay gated', () => {
    const observation = { dateISO: input.dateISO, lat: input.lat, lon: input.lon, mode: 'simulated', locationSource: 'selected', names: 'en', object: { id: 'body:Moon', name: 'Moon', kind: 'moon' } };
    const s = fixture({ observation });
    const fact = buildStudyPacket(s, context).facts.find(f => f.kind === 'imported-selection');
    assert.equal(fact.value.mode, 'simulated'); assert.match(fact.value.note, /does not establish/);
    assert.equal(fact.value.latitude, undefined); assert.equal(fact.value.longitude, undefined);
    assert.equal(buildStudyPacket(s, context, { includeLocation: true }).facts.find(f => f.kind === 'imported-selection').value.latitude, input.lat);
  });
  await test('All six Studio tasks produce a useful packet without unsupported name tracing', () => {
    for (const task of ['western', 'vedic', 'kamea', 'yantra', 'gematria', 'katapayadi']) {
      const method = ({ yantra: 'navagraha', gematria: 'standard', katapayadi: 'iast' })[task] || 'latin';
      const text = ({ yantra: '', gematria: 'חי', katapayadi: 'dhīra' })[task] ?? 'SOL';
      const s = fixture({ input: { ...input, task, method, text } });
      const p = buildStudyPacket(s, context, { includeLocation: true, includeSymbolText: true });
      assert.ok(p.facts.length >= 8); assert.doesNotThrow(() => JSON.stringify(p));
    }
  });
  await test('Explicit comparison carries both geocentric conventions, without granting location disclosure', () => {
    const session = fixture({ input: { ...input, task: 'western' } });
    const selected = buildStudyPacket(session, context);
    assert.equal(selected.scope.comparison, false);
    assert.equal(selected.facts.some(f => f.label === 'Moon sidereal position'), false);
    const comparison = buildStudyPacket(session, { ...context, studyComparison: true });
    assert.equal(comparison.scope.task, 'western'); assert.equal(comparison.scope.comparison, true);
    assert.ok(comparison.facts.some(f => f.label === 'Moon sidereal position'));
    for (const secret of [String(input.lat), String(input.lon), 'ascendant', 'cusps', 'hourNumber']) assert.ok(!JSON.stringify(comparison).includes(secret), secret);
    assert.throws(() => buildStudyPacket(session, { ...context, vedic: null, studyComparison: true }), /unavailable/);
    assert.deepEqual(buildStudyPacket(session, { ...context, studyComparison: false }), selected);
  });
  await test('Preparing makes no requests; Groq and Anthropic transports send the exact preview body', async () => {
    const oldFetch = globalThis.fetch, calls = [];
    try {
      globalThis.fetch = async (url, opts) => {
        calls.push({ url, opts });
        const anthropic = String(url).includes('anthropic');
        const event = anthropic ? { type: 'content_block_delta', delta: { type: 'text_delta', text: 'A grounded answer [F1].' } } : { choices: [{ delta: { content: 'A grounded answer [F1].' } }] };
        return new Response(`data: ${JSON.stringify(event)}\n\ndata: [DONE]\n\n`, { headers: { 'content-type': 'text/event-stream' } });
      };
      for (const provider of ['groq', 'anthropic']) {
        const before = calls.length, request = buildSessionStudyRequest(buildStudyPacket(fixture(), context), { provider, model: 'test-model' });
        assert.equal(calls.length, before, 'preparation must stay offline');
        const controller = createSessionStudyController();
        assert.equal(await controller.send(request, 'MEMORY-ONLY-KEY'), 'A grounded answer [F1].');
        const sent = calls.at(-1);
        assert.equal(sent.url, request.destination); assert.deepEqual(JSON.parse(sent.opts.body), request.body);
        assert.ok(!JSON.stringify(request).includes('MEMORY-ONLY-KEY'));
        assert.ok(!sent.opts.body.includes('PRIVATE'));
        assert.equal(Object.hasOwn(JSON.parse(sent.opts.body), 'tools'), false);
        controller.destroy();
      }
    } finally { globalThis.fetch = oldFetch; }
  });
  await test('Cancellation and replacement ignore late chunks, resolution and old cleanup', async () => {
    const pending = [], writes = [], statuses = [];
    const c = createSessionStudyController({ transport: opts => new Promise(resolve => pending.push({ opts, resolve })), onText: t => writes.push(t), onStatus: s => statuses.push(s) });
    const request = buildSessionStudyRequest(buildStudyPacket(fixture(), context), { provider: 'groq', model: 'test-model' });
    const first = c.send(request, 'key'); pending[0].opts.onDelta('first partial'); c.cancel('Changed session');
    assert.equal(pending[0].opts.signal.aborted, true);
    const second = c.send(request, 'key');
    pending[0].opts.onDelta('STALE CHUNK'); pending[0].resolve('STALE ANSWER'); assert.equal(await first, null);
    assert.equal(c.busy, true, 'old finally must not clear new request');
    pending[1].opts.onDelta('new partial'); pending[1].resolve('new answer'); assert.equal(await second, 'new answer');
    assert.deepEqual(writes, ['first partial', 'new partial', 'new answer']); assert.equal(c.busy, false);
    const third = c.send(request, 'key'); c.destroy(); pending[2].opts.onDelta('AFTER DESTROY'); pending[2].resolve('AFTER DESTROY');
    assert.equal(await third, null); assert.ok(!writes.includes('AFTER DESTROY')); assert.ok(statuses.includes('Changed session'));
  });
  await test('60-second timeout and output bounds stop work without saving a late answer', async () => {
    let expire, finish, opts; const status = [];
    const c = createSessionStudyController({ setTimer: (fn, ms) => { assert.equal(ms, 60000); expire = fn; return 1; }, clearTimer() {},
      transport: value => new Promise(resolve => { opts = value; finish = resolve; }), onStatus: s => status.push(s) });
    const request = buildSessionStudyRequest(buildStudyPacket(fixture(), context), { provider: 'groq', model: 'test-model' });
    const timed = c.send(request, 'key'); expire(); assert.equal(opts.signal.aborted, true); finish('late'); assert.equal(await timed, null); assert.match(status.at(-1), /timed out/);
    const huge = c.send(request, 'key'); opts.onDelta('a'.repeat(32001)); finish('late'); assert.equal(await huge, null); assert.match(status.at(-1), /32,000/); c.destroy();
  });
  await test('Provider 401/429 and offline failures remain visible without echoing server secrets', async () => {
    const oldFetch = globalThis.fetch;
    try {
      const request = buildSessionStudyRequest(buildStudyPacket(fixture(), context), { provider: 'groq', model: 'test-model' });
      for (const status of [401, 429, 413, 500, 0]) {
        const messages = [];
        globalThis.fetch = async () => { if (!status) throw new Error('offline SECRET'); return new Response('SERVER-SECRET-KEY', { status }); };
        const c = createSessionStudyController({ onStatus: s => messages.push(s) });
        assert.equal(await c.send(request, 'MEMORY-ONLY-KEY'), null); assert.equal(c.busy, false);
        const message = messages.at(-1); assert.ok(!message.includes('SECRET') && !message.includes('MEMORY'));
        if ([401, 429, 413].includes(status)) assert.ok(message.includes(String(status)), message);
        else assert.match(message, /failed|interrupted/);
        c.destroy();
      }
    } finally { globalThis.fetch = oldFetch; }
  });
  return { pass: !failures.length, failures, passed };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.pass ? 0 : 1;
}
