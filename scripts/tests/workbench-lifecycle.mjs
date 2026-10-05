// Behavioral lifecycle tests. No network, browser globals or provider keys required.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { createAssistantRequests } from '../../assets/js/app/assistant.js';

export async function run() {
  const failures = [], passed = [];
  const test = async (name, fn) => { try { await fn(); passed.push(name); } catch (error) { failures.push(`${name}: ${error.message}`); } };
  await test('replacement aborts old work; late resolution cannot own the current request', async () => {
    const cancelled = [], states = [];
    const jobs = createAssistantRequests({ onCancel: (job, reason) => cancelled.push([job.output, reason]), onChange: busy => states.push(busy) });
    let release;
    const first = jobs.begin('first');
    const deferred = new Promise(resolve => { release = resolve; });
    const writes = [];
    const late = deferred.then(text => { if (jobs.current(first)) writes.push(text); jobs.finish(first); });
    const second = jobs.begin('second');
    assert.equal(first.signal.aborted, true);
    release('old answer'); await late;
    assert.deepEqual(writes, []);
    assert.equal(jobs.current(second), true, 'old finally must not clear the new job');
    assert.equal(states.at(-1), true);
    assert.deepEqual(cancelled, [['first', 'Replaced by a new request.']]);
    jobs.finish(second);
    assert.equal(jobs.current(second), false);
    assert.equal(states.at(-1), false);
  });
  await test('Stop is idempotent and invalidates buffered callbacks', () => {
    const cancelled = [];
    const jobs = createAssistantRequests({ onCancel: job => cancelled.push(job.output) });
    const token = jobs.begin('answer');
    jobs.cancel(); jobs.cancel();
    assert.equal(token.signal.aborted, true);
    assert.equal(jobs.current(token), false);
    assert.deepEqual(cancelled, ['answer']);
    const next = jobs.begin('retry');
    assert.equal(next.signal.aborted, false);
    assert.equal(jobs.current(next), true);
  });
  await test('background and pagehide cancel; visible return never starts a request', () => {
    const doc = new EventTarget(), win = new EventTarget();
    doc.hidden = false;
    const jobs = createAssistantRequests();
    const unbind = jobs.bind(doc, win);
    const first = jobs.begin('stream');
    doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(jobs.current(first), true, 'visible event is harmless');
    doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(first.signal.aborted, true);
    doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(jobs.current(first), false);
    const second = jobs.begin('explicit retry');
    win.dispatchEvent(new Event('pagehide'));
    assert.equal(second.signal.aborted, true);
    unbind();
    const third = jobs.begin('detached');
    win.dispatchEvent(new Event('pagehide'));
    assert.equal(jobs.current(third), true, 'unbinding removes listeners');
    jobs.cancel();
  });
  await test('rebinding removes listeners from the old document', () => {
    const oldDoc = new EventTarget(), oldWin = new EventTarget();
    const doc = new EventTarget(), win = new EventTarget();
    const jobs = createAssistantRequests();
    jobs.bind(oldDoc, oldWin); jobs.bind(doc, win);
    const token = jobs.begin('current');
    oldWin.dispatchEvent(new Event('pagehide'));
    assert.equal(jobs.current(token), true);
    win.dispatchEvent(new Event('pagehide'));
    assert.equal(token.signal.aborted, true);
  });

  const scope = 'https://example.test/astrology-sim-ant/';
  const prefix = 'awb-' + encodeURIComponent('/astrology-sim-ant/') + '-';
  function workerHarness() {
    const listeners = {}, removed = [], navigated = [];
    const names = [prefix + '2020-01-01-shell', prefix + '2026-10-05-shell', prefix + '2026-10-05-runtime', 'skylens-v1', 'awb-%2Fother-project%2F-2020-shell', 'unrelated-cache'];
    const self = { location: new URL('sw.js', scope), addEventListener: (name, fn) => { listeners[name] = fn; },
      registration: { unregister: async () => true }, clients: { claim: async () => {}, matchAll: async () => [{ url: scope, navigate: url => navigated.push(url) }] } };
    const caches = { keys: async () => names, delete: async name => { removed.push(name); return true; } };
    vm.runInNewContext(readFileSync(new URL('../../sw.js', import.meta.url), 'utf8'), { self, caches, URL, Set, Promise });
    return { listeners, removed, navigated };
  }
  await test('service worker activation deletes only this scope’s obsolete caches', async () => {
    const h = workerHarness(); let done;
    h.listeners.activate({ waitUntil: value => { done = value; } }); await done;
    assert.deepEqual(h.removed, [prefix + '2020-01-01-shell']);
  });
  await test('worker kill preserves companion caches', async () => {
    const h = workerHarness(); let done;
    h.listeners.message({ data: { type: 'KILL' }, waitUntil: value => { done = value; } }); await done;
    assert.equal(h.removed.length, 3);
    assert.ok(h.removed.every(name => name.startsWith(prefix)));
  });
  await test('page kill unregisters only its exact scope and preserves other application caches', async () => {
    const removed = [], unregistered = [], messages = [];
    const regs = [scope, 'https://example.test/skylens/', scope + 'nested/'].map(value => ({ scope: value,
      active: { postMessage: data => messages.push([value, data.type]) }, unregister: async () => { unregistered.push(value); return true; } }));
    const sandbox = { URL, Promise, navigator: { serviceWorker: { getRegistrations: async () => regs } },
      caches: { keys: async () => [prefix + 'old-shell', 'skylens-v1'], delete: async key => { removed.push(key); return true; } } };
    sandbox.self = sandbox;
    // Evaluate the real module without changing its logic; substitute only its
    // source URL and ES-module export syntax for the isolated VM environment.
    const source = readFileSync(new URL('../../assets/js/app/sw-register.js', import.meta.url), 'utf8')
      .replaceAll('import.meta.url', JSON.stringify(scope + 'assets/js/app/sw-register.js'))
      .replace(/^export default .*$/gm, '').replaceAll('export ', '');
    vm.runInNewContext(source + '\nglobalThis.kill = killServiceWorker;', sandbox);
    await sandbox.kill();
    assert.deepEqual(unregistered, [scope]);
    assert.deepEqual(messages, [[scope, 'KILL']]);
    assert.deepEqual(removed, [prefix + 'old-shell']);
  });
  return { pass: failures.length === 0, failures, passed };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.pass ? 0 : 1;
}
