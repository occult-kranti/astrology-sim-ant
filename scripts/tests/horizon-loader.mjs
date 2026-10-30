// Independent integration checks: native HTTP fetch, actual release bytes and
// actual AbortSignals. These are transport/integrity tests, not fresh astronomy.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { loadHorizonPreset } from '../../assets/js/core/event-horizon.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const pause = ms => new Promise(ok => setTimeout(ok, ms));
const deferred = () => { let resolve; const promise = new Promise(ok => { resolve = ok; }); return { promise, resolve }; };
async function within(promise, label, ms = 15000) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, no) => { timer = setTimeout(() => no(Error(label + ' timed out')), ms); })]); }
  finally { clearTimeout(timer); }
}

export async function run() {
  const manifestPath = 'assets/data/horizon-2031-manifest.json';
  const manifestBytes = await readFile(resolve(root, manifestPath)), manifest = JSON.parse(manifestBytes);
  const assets = new Map([['horizon-2031-manifest.json', manifestBytes]]);
  for (const part of manifest.parts) assets.set(part.path, await readFile(resolve(root, 'assets/data', part.path)));
  const target = manifest.parts.find(part => part.id.startsWith('case-'));
  assert.ok(target, 'actual preset has a case part');
  const sourcePaths = ['assets/js/core/event-horizon.js', 'assets/js/core/data/horizon-preset-version.js', manifestPath, ...manifest.parts.map(p => 'assets/data/' + p.path)];
  const source = async () => Object.fromEntries(await Promise.all(sourcePaths.map(async p => [p, sha(await readFile(resolve(root, p)))])));
  const receipt = { schemaVersion: 1, kind: 'native-http-horizon-loader', startedAt: new Date().toISOString(), runtime: process.versions, driverSHA256: sha(await readFile(fileURLToPath(import.meta.url))), sourceBefore: await source(), checks: [], scenarios: [] };
  const scenarios = new Map(); let sequence = 0, origin;
  const server = createServer(async (request, response) => {
    const [, id, ...segments] = new URL(request.url, 'http://localhost').pathname.split('/');
    const scenario = scenarios.get(id), path = segments.join('/'), original = assets.get(path);
    if (!scenario || !original) { response.writeHead(404).end(); return; }
    const special = path === scenario.target, config = special ? scenario.config : {};
    let body = original;
    if (config.corrupt) { body = Buffer.from(original); const i = body.indexOf('2026-10-30'); assert.ok(i >= 0); body[i + 9] = body[i + 9] === 48 ? 49 : 48; }
    if (config.truncate) body = body.subarray(0, body.length - 17);
    const intendedBytes = config.overflow ? (config.limit + 2 * 1024 * 1024) : body.length;
    const state = { path, intendedBytes, sentBytes: 0, streaming: !!config.stream, closedEarly: false, finished: false }, closed = deferred();
    scenario.requests.push(state);
    response.on('finish', () => { state.finished = true; });
    response.on('close', () => { state.closedEarly = !response.writableEnded; closed.resolve(); });
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
    if (!config.stream) headers['Content-Length'] = body.length;
    response.writeHead(200, headers);
    if (!config.stream) { state.sentBytes = body.length; response.end(body); return; }
    try {
      const chunkSize = 16 * 1024;
      for (let offset = 0; offset < intendedBytes && !response.destroyed; offset += chunkSize) {
        const size = Math.min(chunkSize, intendedBytes - offset);
        const chunk = config.overflow ? Buffer.alloc(size, 32) : body.subarray(offset, offset + size);
        state.sentBytes += chunk.length;
        const flushed = response.write(chunk);
        scenario.firstChunk.resolve(state);
        if (!flushed && !response.destroyed) await new Promise(ok => {
          const done = () => { response.off('drain', done); response.off('close', done); ok(); };
          response.once('drain', done); response.once('close', done);
        });
        if (!response.destroyed) await pause(config.delayMs ?? 1);
      }
      if (!response.destroyed) response.end();
    } catch (error) { state.serverError = error.message; response.destroy(); }
    finally { await closed.promise; scenario.streamClosed.resolve(state); }
  });
  async function test(label, fn) {
    try { await fn(); receipt.checks.push({ label, pass: true }); }
    catch (error) { receipt.checks.push({ label, pass: false, message: error.message }); }
  }
  function scenario(name, config = {}, path = target.path) {
    const id = 's' + ++sequence, item = { id, name, target: path, config, requests: [], calls: [], firstChunk: deferred(), streamClosed: deferred() };
    scenarios.set(id, item);
    item.fetchImpl = (url, options) => {
      const rel = new URL(url).pathname.split('/assets/data/').at(-1);
      assert.ok(assets.has(rel), 'loader requests a declared release file');
      assert.ok(options.signal instanceof AbortSignal, 'real native fetch receives an AbortSignal');
      item.calls.push({ path: rel, signalAbortedAtStart: options.signal.aborted });
      return fetch(origin + '/' + id + '/' + rel, options);
    };
    return item;
  }
  const rejectLoad = async (item, expected, signal) => {
    let caught;
    try { await loadHorizonPreset({ fetchImpl: item.fetchImpl, signal }); }
    catch (error) { caught = error; }
    assert.ok(caught, 'invalid or cancelled load cannot return a result');
    if (expected === 'AbortError') assert.equal(caught.name, expected);
    else if (expected === 'RangeError') { assert.equal(caught.name, expected); assert.match(caught.message, /byte limit/); }
    else assert.match(caught.message, expected);
    item.rejection = { name: caught.name, message: caught.message };
  };
  try {
    await new Promise(ok => server.listen(0, '127.0.0.1', ok)); origin = 'http://127.0.0.1:' + server.address().port;
    await test('Actual 35MB release loads through native HTTP with complete checked counts', async () => {
      const item = scenario('valid'), result = await loadHorizonPreset({ fetchImpl: item.fetchImpl });
      assert.equal(result.provenance.checksumVerified, true);
      assert.equal(result.counts.processedSamples, 4575); assert.equal(result.counts.calendarRows, 59475);
      assert.equal(result.counts.profileResults, 18300); assert.equal(result.counts.eventCount, 5883);
      assert.equal(item.calls.length, 5); assert.equal(item.requests.reduce((n, r) => n + r.sentBytes, 0), [...assets.values()].reduce((n, b) => n + b.length, 0));
    });
    await test('Chunked manifest above 1MiB aborts the server before the oversized source finishes', async () => {
      const item = scenario('oversized-manifest', { stream: true, overflow: true, limit: 1024 * 1024 }, 'horizon-2031-manifest.json');
      await rejectLoad(item, 'RangeError'); const state = await within(item.streamClosed.promise, 'manifest connection close');
      assert.ok(state.closedEarly && !state.finished && state.sentBytes < state.intendedBytes);
      assert.ok(state.sentBytes > 1024 * 1024); assert.equal(item.calls.length, 1);
    });
    await test('Chunked part over descriptor bytes preserves RangeError before checksum or AbortError', async () => {
      const item = scenario('oversized-part', { stream: true, overflow: true, limit: target.bytes });
      await rejectLoad(item, 'RangeError'); const state = await within(item.streamClosed.promise, 'part connection close');
      assert.ok(state.closedEarly && !state.finished && state.sentBytes < state.intendedBytes);
      assert.ok(state.sentBytes > target.bytes); assert.equal(item.calls.length, 5);
    });
    await test('Already aborted caller signal reaches native fetch and emits no HTTP request', async () => {
      const item = scenario('pre-aborted'), controller = new AbortController(); controller.abort();
      await rejectLoad(item, 'AbortError', controller.signal); await pause(20);
      assert.equal(item.requests.length, 0); assert.ok(item.calls.every(call => call.signalAbortedAtStart));
    });
    await test('Real mid-read caller cancellation returns no result and closes the server early', async () => {
      const item = scenario('mid-read-cancel', { stream: true, delayMs: 3 }), controller = new AbortController();
      const outcome = rejectLoad(item, 'AbortError', controller.signal);
      await within(item.firstChunk.promise, 'first actual part chunk'); controller.abort(); await outcome;
      const state = await within(item.streamClosed.promise, 'cancelled connection close');
      assert.ok(state.closedEarly && !state.finished && state.sentBytes > 0 && state.sentBytes < state.intendedBytes);
    });
    await test('Clean native HTTP load recovers after cancellation without a partial prior ledger', async () => {
      const item = scenario('recovery'), result = await loadHorizonPreset({ fetchImpl: item.fetchImpl });
      assert.equal(result.cases.length, 3); assert.ok(result.cases.every(c => c.rows.length === 1525));
      assert.equal(result.counts.processedSamples, 4575); assert.equal(result.counts.truncated, false); assert.equal(item.calls.length, 5);
    });
    await test('A shorter successfully transported part is rejected by actual byte integrity', async () => {
      await rejectLoad(scenario('truncated-part', { truncate: true }), /checksum/i);
    });
    await test('A same-length changed part is rejected by the actual SHA256 check', async () => {
      await rejectLoad(scenario('checksum-corrupt-part', { corrupt: true }), /checksum/i);
    });
  } finally { server.closeAllConnections(); await new Promise(ok => server.close(ok)); }
  receipt.scenarios = [...scenarios.values()].map(({ name, target, config, requests, calls, rejection }) => ({ name, target, config, requests, calls, rejection }));
  receipt.sourceAfter = await source();
  await test('Loader source and all actual preset bytes stayed unchanged during verification', () => assert.deepEqual(receipt.sourceAfter, receipt.sourceBefore));
  receipt.pass = receipt.checks.every(c => c.pass); receipt.count = receipt.checks.length;
  receipt.failures = receipt.checks.filter(c => !c.pass).map(c => c.label + ': ' + c.message); receipt.completedAt = new Date().toISOString();
  if (process.env.HORIZON_LOADER_RECEIPT) { const path = resolve(process.env.HORIZON_LOADER_RECEIPT); await mkdir(dirname(path), { recursive: true }); await writeFile(path, JSON.stringify(receipt, null, 2) + '\n'); }
  return receipt;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await run(); console.log(JSON.stringify({ pass: result.pass, count: result.count, failures: result.failures }, null, 2));
  if (!result.pass) { console.error(result.failures.join('\n')); process.exitCode = 1; }
}
