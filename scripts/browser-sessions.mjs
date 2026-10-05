// Observatory-session integration journeys. No real provider, camera or sensor calls.
// npm install --no-save --package-lock=false playwright@1.58.2
// SKY_LENS_ROOT=/path/to/skylens node scripts/browser-sessions.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skyRoot = resolve(process.env.SKY_LENS_ROOT || process.env.SKYLENS_ROOT || resolve(root, '../skylens'));
await access(resolve(skyRoot, 'index.html'));
const output = resolve(root, 'test-results', 'sessions');
await mkdir(output, { recursive: true });
const phase = process.env.SESSION_PHASE || 'all';
if (!['all', 'journeys', 'ai'].includes(phase)) throw new Error('Unknown SESSION_PHASE.');
const pkg = process.env.PLAYWRIGHT_PKG ? await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href) : await import('playwright');
const chromium = pkg.chromium || pkg.default?.chromium;
const SITE = 'https://occult-kranti.github.io';
const STUDIO = SITE + '/astrology-sim-ant/pages/studio.html';
const SKY = SITE + '/skylens/';
const FIXTURE = { dateISO: '2026-10-05T12:34:56.000Z', lat: 28.6139, lon: 77.209, mode: 'simulated', names: 'hi' };
const fragment = (object = { id: 'body:Moon', name: 'Moon', kind: 'moon' }) => '#' + new URLSearchParams({ skyV: '1', skyAt: FIXTURE.dateISO.replace('.000Z', 'Z'), lat: String(FIXTURE.lat), lon: String(FIXTURE.lon), skyMode: FIXTURE.mode, skyLoc: 'selected', skyNames: FIXTURE.names, skyObject: object.id, skyName: object.name, skyKind: object.kind });
const fixtureKey = 'test-session-key-never-stored';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const servedRequests = [];
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    servedRequests.push(url.pathname + url.search);
    const project = [['/astrology-sim-ant/', root], ['/skylens/', skyRoot]].find(([prefix]) => url.pathname.startsWith(prefix));
    if (!project) return response.writeHead(404).end('Project path required');
    const [prefix, directory] = project;
    let rel = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!rel || rel.endsWith('/')) rel += 'index.html';
    const path = resolve(directory, rel);
    if (!path.startsWith(directory + sep) || rel.split('/').some(part => part.startsWith('.'))) return response.writeHead(403).end('Forbidden');
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch { response.writeHead(404).end('Not found'); }
});
let browser, failure;
const completed = [], screenshots = [], diagnostics = [], requests = [];
const ai = (page, name) => page.locator(`[data-session-ai="${name}"]`);
async function includes(page, selector, text) { await page.waitForFunction(({ selector, text }) => document.querySelector(selector)?.textContent.includes(text), { selector, text }); }
async function loadStudio(page) {
  await page.waitForSelector('#sessionObservation');
  await page.waitForFunction(() => document.querySelector('#studioFigure svg') && document.querySelector('#studioStatus')?.dataset.error !== 'true');
}
async function frozenFixture(page) {
  assert.equal(await page.locator('#studioTime').inputValue(), FIXTURE.dateISO.slice(0, 19));
  assert.equal(Number(await page.locator('#studioLat').inputValue()), FIXTURE.lat);
  assert.equal(Number(await page.locator('#studioLon').inputValue()), FIXTURE.lon);
  assert.equal(await page.locator('#studioClockStatus').getAttribute('data-mode'), 'frozen');
}
async function layout(page, label) {
  const info = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth, main: document.querySelectorAll('main').length }));
  assert.equal(info.main, 1, label + ': main landmark');
  assert.ok(info.scroll <= info.viewport + 1, label + ': no horizontal page overflow ' + JSON.stringify(info));
  const path = resolve(output, label + '.png'); await page.screenshot({ path, fullPage: true }); screenshots.push(path);
}
async function viewportShot(page, label, selector) {
  if (selector) await page.locator(selector).evaluate((el, block) => el.scrollIntoView({ block }), selector === '#studioFigure' || selector.includes('preview') ? 'center' : 'start');
  else await page.evaluate(() => scrollTo(0, 0));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 1, label + ': no horizontal overflow');
  const path = resolve(output, label + '.png');
  await page.screenshot({ path, fullPage: false }); screenshots.push(path);
}
async function downloadJSON(page, locator) {
  const waiting = page.waitForEvent('download'); await locator.click();
  const download = await waiting; assert.equal(await download.failure(), null);
  return JSON.parse(await readFile(await download.path(), 'utf8'));
}
function sse(text) { return `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\ndata: [DONE]\n\n`; }
async function until(condition, label) {
  const deadline = Date.now() + 15000;
  while (!condition()) {
    if (Date.now() >= deadline) throw new Error('Timed out: ' + label);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

try {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const local = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  async function contextFor(viewport) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block', acceptDownloads: true });
    const state = { providerRequests: [], unexpected: [], errors: [], mode: 'success', pending: null, settled: null };
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === SITE) {
        const response = await route.fetch({ url: local + url.pathname + url.search });
        if (response.status() >= 400 && !url.pathname.endsWith('favicon.ico')) state.errors.push(`${response.status()} ${url.pathname}`);
        return route.fulfill({ response });
      }
      if (url.origin === 'https://api.groq.com' && url.pathname === '/openai/v1/chat/completions') {
        const body = JSON.parse(route.request().postData());
        state.providerRequests.push({ url: url.href, body }); requests.push({ viewport: viewport.width, destination: url.href, model: body.model });
        const mode = state.mode;
        if (mode === 'offline') return route.abort('internetdisconnected');
        let settled;
        if (mode === 'delay') {
          state.settled = new Promise(resolve => { settled = resolve; });
          await new Promise(resolve => { state.pending = resolve; });
        }
        try {
          if (mode === '401' || mode === '429') return await route.fulfill({ status: Number(mode), contentType: 'application/json', body: JSON.stringify({ error: { message: mode === '401' ? 'Fixture unauthorized' : 'Fixture rate limited' } }) });
          return await route.fulfill({ status: 200, contentType: 'text/event-stream', body: sse(mode === 'delay' ? 'STALE RESPONSE MUST NOT APPEAR' : '<img src=x onerror="window.__unsafeSessionHTML=true"> A sourced comparison, not a prediction.') });
        } catch (error) { if (mode !== 'delay') throw error; }
        finally { settled?.(); }
        return;
      }
      if (['data:', 'blob:'].includes(url.protocol)) return route.continue();
      state.unexpected.push(url.href); return route.abort('blockedbyclient');
    });
    await context.addInitScript(() => {
      window.__sessionCapabilities = { camera: 0, location: 0, motion: 0 };
      if (!localStorage.getItem('wb-studio-v1')) localStorage.setItem('wb-studio-v1', JSON.stringify({ task: 'western', dateISO: '2001-01-01T00:00:00.000Z', lat: 51.5074, lon: -.1278, system: 'regiomontanus', style: 'north', planet: 'Saturn', method: 'latin', text: '', followHour: false, locationSource: 'demo' }));
      Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => { window.__sessionCapabilities.camera++; throw new DOMException('Fixture denies camera', 'NotAllowedError'); } } });
      Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition: (_ok, reject) => { window.__sessionCapabilities.location++; reject({ code: 1, message: 'Fixture denies location' }); } } });
      if (window.DeviceOrientationEvent) Object.defineProperty(window.DeviceOrientationEvent, 'requestPermission', { configurable: true, value: async () => { window.__sessionCapabilities.motion++; return 'denied'; } });
    });
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    page.on('pageerror', error => { state.errors.push(error.message); diagnostics.push({ viewport, message: error.message }); });
    return { context, page, state };
  }

  // UI journeys are added below against the shared panel contract.
  for (const viewport of phase === 'ai' ? [] : [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    const { context, page, state } = await contextFor(viewport);
    try {
      await page.goto(SKY + fragment(), { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#skyHandoffStatus');
      await includes(page, '#skyHandoffStatus', 'Frozen shared observation');
      await page.waitForSelector('#castSkyObject');
      assert.deepEqual(await page.evaluate(() => window.__sessionCapabilities), { camera: 0, location: 0, motion: 0 }, 'incoming observation never requests permissions');
      assert.equal(await page.locator('#viewControls').getAttribute('data-camera'), 'off');
      assert.equal(await page.locator('#viewControls').getAttribute('data-tracking'), 'off');
      await page.locator('#castSkyObject').click();
      await page.waitForURL(url => url.pathname === '/astrology-sim-ant/pages/studio.html');
      await loadStudio(page); await frozenFixture(page);
      await includes(page, '#sessionObservation', 'Moon');
      await viewportShot(page, `session-${viewport.width}-top`);
      assert.equal(state.providerRequests.length, 0);
      await page.locator('#sessionCompare > summary').click();
      await page.waitForSelector('#sessionCompareTable tbody tr');
      assert.ok(await page.locator('#sessionCompareTable tbody tr').count() >= 7, 'comparison contains classical planets');
      await frozenFixture(page);
      await page.locator('#sessionSymbol').click();
      assert.equal(await page.locator('#studioTask').inputValue(), 'kamea');
      await page.locator('#studioPlanet').selectOption('Sun');
      await page.locator('#studioSymbolMethod').selectOption('aiq');
      await page.locator('#studioText').fill('SECRETSUN');
      await page.locator('#studioApply').click();
      await includes(page, '#studioFacts', '111'); await frozenFixture(page);
      await page.locator('#studioTraceStep').focus();
      await page.locator('#studioTraceStep').press('Home');
      await page.locator('#studioTraceStep').press('ArrowRight');
      await page.locator('#studioTraceStep').press('ArrowRight');
      assert.equal(await page.locator('#studioTraceStep').inputValue(), '2', 'partial trace frame can be selected by keyboard');
      await viewportShot(page, `session-${viewport.width}-figure`, '#studioFigure');
      await page.locator('#sessionTitle').fill('Delhi captured-moment study');
      await page.locator('#sessionPurpose').selectOption('question');
      await page.locator('#sessionQuestion').fill('PRIVATE_QUESTION_628 test question?');
      assert.equal(await page.locator('#studioStartLive').isDisabled(), true, 'question chart cannot drift with live time');
      await page.locator('#sessionLens').selectOption('newton');
      await page.locator('#sessionObservationNotes').fill('PRIVATE_NOTES_628 clear eastern horizon');
      await page.locator('#sessionHypothesis').fill('PRIVATE_HYPOTHESIS_628 repeat the observation');
      await page.locator('#sessionReflection').fill('PRIVATE_REFLECTION_628 separate measurement and interpretation');
      await page.getByText('Record a measurement', { exact: true }).click();
      await page.locator('#sessionExpected').fill('20'); await page.locator('#sessionObserved').fill('21');
      await page.locator('#sessionUncertainty').fill('2'); await page.locator('#sessionUnit').fill('degrees');
      await page.locator('#sessionMeasurementMethod').fill('Manual reference with stated uncertainty');
      assert.equal(await page.evaluate(() => localStorage.getItem('wb-study-sessions-v1')), null, 'journal never saves automatically');
      await page.locator('#sessionSave').click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('wb-study-sessions-v1') || '[]').length === 1);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('wb-study-sessions-v1'))[0]);
      assert.equal(stored.input.dateISO, FIXTURE.dateISO); assert.equal(stored.input.method, 'aiq');
      assert.equal(stored.traceStep, 2, 'journal captures the exact partial diagram frame');
      assert.equal(stored.observation.object.id, 'body:Moon'); assert.equal(stored.lens, 'newton');
      assert.equal(stored.measurement.unit, 'degrees');
      await page.locator('#studioTraceReset').click();
      await page.locator('#studioTime').fill('2027-01-02T03:04:05'); await page.locator('#studioApply').click();
      await page.locator('#sessionObservationNotes').fill('Unsaved changed notes');
      const restore = page.locator('#sessionJournal').getByRole('button', { name: /restore/i }).first();
      await restore.focus(); await restore.press('Enter');
      await frozenFixture(page);
      assert.equal(await page.locator('#sessionObservationNotes').inputValue(), stored.observationNotes);
      assert.equal(await page.locator('#studioSymbolMethod').inputValue(), 'aiq');
      assert.equal(await page.locator('#studioTraceStep').inputValue(), '2', 'journal restore preserves the displayed trace frame');
      await viewportShot(page, `session-${viewport.width}-journal`, '#sessionJournalTitle');
      const exported = await downloadJSON(page, page.locator('#sessionExport'));
      const exportText = JSON.stringify(exported);
      assert.equal(exported.traceStep, 2, 'session JSON exports the preserved trace frame');
      assert.ok(exportText.includes(FIXTURE.dateISO) && exportText.includes('PRIVATE_NOTES_628') && exportText.includes('newton'));
      assert.ok(exported.provenance.sourceIds.length > 0 && typeof exported.provenance.methods.engine === 'string', 'export includes source IDs and calculation method provenance');
      assert.ok(!exportText.includes(fixtureKey));
      await layout(page, `session-${viewport.width}`);
      const returnURL = await page.locator('#sessionSkyLink').getAttribute('href');
      assert.equal(new URL(returnURL).origin, SITE); assert.equal(new URL(returnURL).pathname, '/skylens/');
      assert.equal(new URLSearchParams(new URL(returnURL).hash.slice(1)).get('skyAt'), FIXTURE.dateISO.replace('.000Z', 'Z'));
      assert.equal(new URLSearchParams(new URL(returnURL).hash.slice(1)).get('skyObject'), 'body:Moon');
      await page.locator('#sessionSkyLink').click();
      await page.waitForURL(url => url.pathname === '/skylens/');
      await includes(page, '#skyHandoffStatus', 'Frozen shared observation');
      assert.equal(await page.locator('#viewControls').getAttribute('data-camera'), 'off');
      assert.equal(await page.locator('#viewControls').getAttribute('data-tracking'), 'off');
      assert.deepEqual(await page.evaluate(() => window.__sessionCapabilities), { camera: 0, location: 0, motion: 0 }, 'return to sky never restarts capabilities');
      assert.equal(state.providerRequests.length, 0, 'complete non-AI workflow stays local');
      assert.deepEqual(state.unexpected, [], 'no unexpected outgoing requests');
      assert.deepEqual(state.errors, [], 'no browser errors');
      completed.push(`SkyLens → frozen Studio → comparison → AIQ symbol → journal restore/export at ${viewport.width}px`);
    } finally { await context.unrouteAll({ behavior: 'ignoreErrors' }); await context.close(); }
  }

  if (phase !== 'ai') {
    const { context, page, state } = await contextFor({ width: 1280, height: 900 });
    try {
      const starFragment = fragment({ id: 'star:unlisted-fixture', name: 'Unlisted fixture star', kind: 'star' });
      await page.goto(STUDIO + starFragment, { waitUntil: 'domcontentloaded' }); await loadStudio(page); await frozenFixture(page);
      await includes(page, '#sessionObservation', 'Unlisted fixture star');
      await page.locator('#sessionSymbol').click();
      assert.equal(await page.locator('#studioPlanet').inputValue(), 'Saturn', 'star context never silently selects a classical planet');
      assert.equal(await page.locator('#studioFollowHour').isChecked(), false);
      await page.locator('#studioApply').click();
      await page.goto(STUDIO + starFragment + '&lat=0', { waitUntil: 'domcontentloaded' }); await loadStudio(page);
      assert.equal(await page.locator('#sessionObservation').getAttribute('data-error'), 'true', 'duplicate bridge fields fail visibly');
      await frozenFixture(page);
      await page.goto(STUDIO + fragment().replace('skyMode=simulated', 'skyMode=current'), { waitUntil: 'domcontentloaded' }); await loadStudio(page);
      await page.locator('#studioTime').fill('2027-01-02T03:04:05'); await page.locator('#studioApply').click();
      assert.equal(new URLSearchParams(new URL(await page.locator('#sessionSkyLink').getAttribute('href')).hash.slice(1)).get('skyMode'), 'simulated', 'changing a then-current observation produces simulated outbound context');
      const apia = new URLSearchParams({ skyV: '1', skyAt: '2026-01-01T00:30:00Z', lat: '-13.833', lon: '-171.75', skyMode: 'simulated', skyLoc: 'selected', skyNames: 'en' });
      await page.goto(STUDIO + '#' + apia, { waitUntil: 'domcontentloaded' }); await loadStudio(page);
      await page.locator('#sessionWorkbenchLink').click();
      await page.waitForURL(url => url.pathname === '/astrology-sim-ant/pages/workbench.html');
      await page.waitForFunction(() => document.querySelector('#wb-status')?.dataset.contextInstant === '2026-01-01T00:30:00.000Z');
      const before = await page.evaluate(async () => { const m = await import('/astrology-sim-ant/assets/js/app/workbench.js'); const c = m.getContext(); return { inputs: c.inputs, weekdayMethod: c.planetaryHour.weekdayMethod }; });
      assert.equal(before.inputs.utcOffset, null); assert.equal(before.inputs.timeZone, null);
      assert.match(before.weekdayMethod, /mean-solar/); assert.equal(await page.locator('#wb-observer-zone-note').isVisible(), true);
      await page.locator('#wb-mp-coords > summary').click(); await page.locator('#wb-mp-off').selectOption('13');
      await page.waitForFunction(async () => (await import('/astrology-sim-ant/assets/js/app/workbench.js')).getContext().inputs?.utcOffset === 13);
      assert.equal(await page.locator('#wb-observer-zone-note').isVisible(), false, 'visible explicit offset replaces unknown observer zone');
      assert.equal(new URL(page.url()).searchParams.get('solar'), '0');
      await page.locator('#wb-mp-off').selectOption('custom'); await page.locator('#wb-mp-offnum').fill('12.75');
      await page.waitForFunction(async () => (await import('/astrology-sim-ant/assets/js/app/workbench.js')).getContext().inputs?.utcOffset === 12.75);
      assert.deepEqual(state.unexpected, []); assert.deepEqual(state.errors, []);
      completed.push('Unknown-star correspondence, malformed-fragment recovery, simulated-time provenance and Apia observer-zone/offset transfer');
    } finally { await context.unrouteAll({ behavior: 'ignoreErrors' }); await context.close(); }
  }

  // One focused provider-mock journey; the three viewports above cover core layout.
  if (phase !== 'journeys') {
    const { context, page, state } = await contextFor({ width: 390, height: 844 });
    try {
      await page.goto(STUDIO + fragment(), { waitUntil: 'domcontentloaded' }); await loadStudio(page);
      await page.locator('#sessionPurpose').selectOption('question');
      await page.locator('#sessionQuestion').fill('PRIVATE_QUESTION_628 test question?');
      await page.locator('#sessionObservationNotes').fill('PRIVATE_NOTES_628 private observer notes');
      await page.locator('#sessionHypothesis').fill('PRIVATE_HYPOTHESIS_628 hypothesis');
      await page.locator('#sessionReflection').fill('PRIVATE_REFLECTION_628 reflection');
      await page.locator('#sessionOpenAI').click();
      await ai(page, 'key').fill(fixtureKey);
      assert.equal(state.providerRequests.length, 0, 'opening/configuring AI sends nothing');
      await ai(page, 'prepare').click();
      await page.waitForFunction(() => document.querySelector('[data-session-ai="preview"]')?.textContent.includes('messages'));
      const preview = JSON.parse(await ai(page, 'preview').textContent());
      const previewText = JSON.stringify(preview);
      assert.ok(previewText.includes(FIXTURE.dateISO), 'prepared packet captures the chosen instant');
      for (const forbidden of ['PRIVATE_QUESTION_628', 'PRIVATE_NOTES_628', 'PRIVATE_HYPOTHESIS_628', 'PRIVATE_REFLECTION_628', fixtureKey, '28.6139', '77.209']) assert.ok(!previewText.includes(forbidden), `default packet excludes ${forbidden}`);
      assert.equal(state.providerRequests.length, 0, 'preparing preview sends nothing');
      await ai(page, 'send').click();
      await includes(page, '[data-session-ai="response"]', 'A sourced comparison');
      assert.equal(state.providerRequests.length, 1);
      assert.deepEqual(state.providerRequests[0].body, preview.body, 'actual provider JSON equals the exact immutable preview');
      assert.equal(state.providerRequests[0].url, preview.destination, 'preview shows the actual destination');
      assert.equal(await ai(page, 'response').locator('img').count(), 0, 'model output is rendered as text');
      assert.equal(await page.evaluate(() => window.__unsafeSessionHTML), undefined);
      assert.equal(await page.evaluate(key => [...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => value.includes(key)), fixtureKey), false, 'API key is never persisted');
      const answerExport = await downloadJSON(page, ai(page, 'export-answer'));
      assert.deepEqual(answerExport.request.body, preview.body, 'saved answer remains tied to its approved packet');
      assert.ok(!JSON.stringify(answerExport).includes(fixtureKey), 'answer export excludes the authorization key');
      await ai(page, 'model').fill('fixture-other-model');
      assert.equal(await ai(page, 'send').isDisabled(), true, 'model changes invalidate the prepared request');
      await ai(page, 'provider').selectOption('anthropic');
      assert.equal(await ai(page, 'key').inputValue(), '', 'changing provider clears the in-memory key');
      assert.equal(await ai(page, 'send').isDisabled(), true);
      await ai(page, 'provider').selectOption('groq'); await ai(page, 'key').fill(fixtureKey);
      assert.equal(state.providerRequests.length, 1, 'provider/model changes do not trigger a request');
      await ai(page, 'notes').check(); await ai(page, 'location').check(); await ai(page, 'question').check();
      assert.equal(await ai(page, 'send').isDisabled(), true, 'changed disclosure invalidates prepared send');
      await ai(page, 'prepare').click();
      const optIn = JSON.parse(await ai(page, 'preview').textContent());
      assert.ok(JSON.stringify(optIn).includes('PRIVATE_NOTES_628') && JSON.stringify(optIn).includes('28.6139') && JSON.stringify(optIn).includes('PRIVATE_QUESTION_628'), 'opt-in disclosures appear in the preview');
      assert.equal(state.providerRequests.length, 1, 'new disclosure preview alone makes no provider call');
      state.mode = 'delay'; await ai(page, 'send').click();
      await page.waitForFunction(() => !document.querySelector('[data-session-ai="stop"]')?.disabled);
      await until(() => state.pending, 'delayed provider request');
      await page.locator('#studioLat').fill('28.5');
      assert.equal(await ai(page, 'send').isDisabled(), true, 'editing context invalidates the request and preview immediately');
      state.pending(); await state.settled;
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.ok(!(await ai(page, 'response').textContent()).includes('STALE RESPONSE'), 'late response cannot write into changed context');
      await page.locator('#studioApply').click();
      for (const mode of ['401', '429', 'offline']) {
        state.mode = mode;
        const before = state.providerRequests.length;
        await ai(page, 'prepare').click(); await ai(page, 'send').click();
        await until(() => state.providerRequests.length > before, mode + ' mocked provider call');
        await page.waitForFunction(() => document.querySelector('[data-session-ai="stop"]')?.disabled === true);
        const status = await ai(page, 'status').textContent();
        assert.match(status, mode === 'offline' ? /network|fetch|offline|connection|failed/i : new RegExp(mode), mode + ' failure is visible and recoverable: ' + status);
      }
      state.mode = 'delay'; state.pending = null;
      await ai(page, 'prepare').click(); await ai(page, 'send').click();
      await until(() => state.pending, 'request to stop explicitly');
      await ai(page, 'stop').click(); state.pending(); await state.settled;
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.ok(!(await ai(page, 'response').textContent()).includes('STALE RESPONSE'), 'explicit Stop drops late provider chunks');
      await layout(page, 'session-ai-390');
      for (const viewport of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 1280, height: 900 }]) {
        await page.setViewportSize(viewport);
        await viewportShot(page, `session-${viewport.width}-ai`, '#sessionStudyHost');
        await viewportShot(page, `session-${viewport.width}-ai-preview`, '[data-session-ai="preview"]');
      }
      assert.deepEqual(state.unexpected, []); assert.deepEqual(state.errors, []);
      completed.push('AI preview/body equality, default minimization, explicit disclosure, text-only output, cancellation, 401/429/offline and memory-only key');
    } finally { state.pending?.(); await context.unrouteAll({ behavior: 'ignoreErrors' }); await context.close(); }
  }
  assert.ok(servedRequests.every(path => !path.includes('skyAt') && !path.includes('skyObject')), 'fragment-only handoff never enters HTTP requests');
} catch (error) { failure = error; }
finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ completed, screenshots, diagnostics, requests, failure: failure?.stack || null }, null, 2));
}
if (failure) { console.error(failure.stack); process.exitCode = 1; }
else console.log(`PASS ${completed.length} session journeys\n${completed.join('\n')}`);
