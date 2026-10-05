// Strict release journeys under the GitHub Pages project path.
// Browser-only tooling: npm install --no-save --package-lock=false playwright@1.58.2
// npx playwright install chromium && node scripts/browser-release.mjs
// These checks exercise user workflows; scientific reference vectors live in engine-test.mjs.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'test-results');
await mkdir(output, { recursive: true });
async function loadPlaywright() {
  if (process.env.PLAYWRIGHT_PKG) return import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href);
  try { return await import('playwright'); }
  catch {
    try { return await import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js'); }
    catch { return import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs'); }
  }
}
const { chromium } = await loadPlaywright();
const prefix = '/astrology-sim-ant/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith(prefix)) { response.writeHead(404).end('Project prefix required'); return; }
    let rel = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!rel || rel.endsWith('/')) rel += 'index.html';
    const path = resolve(root, rel);
    if (!path.startsWith(root + sep) || rel.split('/').some(p => p.startsWith('.'))) {
      response.writeHead(403).end('Forbidden'); return;
    }
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch { response.writeHead(404).end('Not found'); }
});
let browser, failure;
const completed = [], pageSweep = [], journeyTimings = [], downloadEvidence = [];
const started = performance.now();
try {
  await new Promise((ok, no) => { server.once('error', no); server.listen(0, '127.0.0.1', ok); });
  const origin = 'http://127.0.0.1:' + server.address().port;
  const base = origin + prefix;
  browser = await chromium.launch({ headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  async function textIncludes(page, selector, value) {
    await page.waitForFunction(({ selector, value }) => (document.querySelector(selector)?.textContent || '').includes(value), { selector, value });
  }
  async function submit(page, id) {
    await page.locator(id + ' button[type="submit"]').first().click();
  }
  async function accessibility(page) {
    assert.equal(await page.locator('main').count(), 1, 'one main landmark');
    assert.ok(await page.locator('nav.main[aria-label]').count(), 'primary navigation labelled');
    assert.ok(await page.evaluate(() => {
      const link = document.querySelector('a.skip-link');
      return link && document.querySelector(link.getAttribute('href'));
    }), 'skip link resolves to existing main target');
    const layout = await page.evaluate(() => ({
      viewport: innerWidth, document: document.documentElement.scrollWidth,
      overflowing: [...document.querySelectorAll('body *')].map(el => {
        const rect = el.getBoundingClientRect();
        return { tag: el.tagName, id: el.id, classes: el.className?.baseVal ?? el.className,
          left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
      }).filter(el => el.width && (el.right > innerWidth + 1 || el.left < -1))
        .sort((a, b) => b.right - a.right).slice(0, 10),
    }));
    assert.ok(layout.document <= layout.viewport + 1, 'no horizontal page overflow: ' + JSON.stringify(layout));
  }
  async function download(page, selector, label) {
    const pending = page.waitForEvent('download');
    await page.locator(selector).click();
    const item = await pending;
    const error = await item.failure(); assert.equal(error, null, 'download succeeds');
    const body = await readFile(await item.path());
    downloadEvidence.push({ label, filename: item.suggestedFilename(), bytes: body.length });
    assert.ok(body.length > 100, 'nonempty calculation export');
    return body;
  }
  async function usable(page, selector) {
    const target = page.locator(selector);
    await target.scrollIntoViewIfNeeded();
    const result = await target.evaluate(el => {
      const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
      const hit = document.elementFromPoint(x, y);
      return { width: r.width, height: r.height, visible: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
        hit: !!hit && (el === hit || el.contains(hit)) };
    });
    assert.ok(result.visible && result.hit && result.width >= 24 && result.height >= 24, selector + ' reachable and unobscured: ' + JSON.stringify(result));
  }
  async function verifySVG(page, selector, body) {
    const source = body.toString();
    assert.match(source, /<svg\b/);
    assert.doesNotMatch(source, /var\s*\(/i, 'SVG export has literal standalone paint');
    const comparison = await page.evaluate(({ selector, source }) => {
      const live = document.querySelector(selector), exported = new DOMParser().parseFromString(source, 'image/svg+xml');
      const geometry = root => [...root.querySelectorAll('path,circle,ellipse,line,polyline,polygon,rect,text,g')].map(el => ({
        tag: el.localName, attributes: [...el.attributes].filter(a => /^(d|points|x|y|x1|x2|y1|y2|cx|cy|rx|ry|r|width|height|transform)$/.test(a.name)).map(a => [a.name, a.value]),
      }));
      return { parserError: !!exported.querySelector('parsererror'), live: geometry(live), exported: geometry(exported.documentElement),
        viewBox: [live.getAttribute('viewBox'), exported.documentElement.getAttribute('viewBox')] };
    }, { selector, source });
    assert.equal(comparison.parserError, false, 'export is valid SVG XML');
    assert.deepEqual(comparison.live, comparison.exported, 'export preserves the displayed geometry and transforms');
    assert.equal(comparison.viewBox[0], comparison.viewBox[1]);
  }
  async function verifyPNG(page, body, label) {
    assert.equal(body.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'PNG signature');
    const pixels = await page.evaluate(async base64 => {
      const img = new Image(); img.src = 'data:image/png;base64,' + base64; await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data, colors = new Set(); let opaque = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 0) { opaque++; colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`); }
      return { width: canvas.width, height: canvas.height, colors: colors.size, nontransparentPixels: opaque };
    }, body.toString('base64'));
    assert.ok(pixels.width >= 200 && pixels.height >= 200 && pixels.colors > 4 && pixels.nontransparentPixels > 500, 'PNG contains a rendered diagram: ' + JSON.stringify(pixels));
    downloadEvidence.push({ label: label + '-decoded', ...pixels });
  }
  for (const [label, viewport] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1365, height: 900 }]]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block' });
    const external = [], errors = [], missing = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
      external.push(url.href); return route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400) missing.push(response.status() + ' ' + response.url());
    });
    try {
      await page.goto(base + 'pages/book3/nativity.html', { waitUntil: 'domcontentloaded' });
      await page.locator('#wb-mp-date').waitFor();
      assert.equal(await page.locator('#wb-mp-zonebox').isHidden(), true, 'named-zone controls are hidden in explicit-offset mode');
      await page.locator('#wb-mp-date').fill('2000-01-01');
      await page.locator('#wb-mp-time').fill('12:00');
      await page.locator('#wb-mp-coords > summary').click();
      await page.locator('#wb-mp-lat').fill('51.5');
      await page.locator('#wb-mp-lon').fill('0');
      await page.locator('#wb-mp-off').selectOption('0');
      await submit(page, '#n-form');
      await page.locator('#n-wheel svg').waitFor();
      await textIncludes(page, '#n-method', '2000-01-01T12:00');
      await page.locator('#n-certainty').selectOption('unknown');
      await textIncludes(page, '#n-summary', 'Birth time unknown');
      assert.equal(await page.locator('#n-wheel svg').count(), 0, 'unknown birth time does not display a precise wheel');
      await textIncludes(page, '#n-wheel', 'No ascendant');
      assert.equal(await page.locator('#wb-mp-time').isDisabled(), true, 'unknown time input disabled');
      assert.equal(await page.locator('#n-planets tr').count(), 7, 'seven traditional planets have daily ranges');
      const visibleActionText = await page.locator('#n-actionbar').evaluate(el =>
        [...el.querySelectorAll('.action-bar')].filter(bar => bar.getClientRects().length && getComputedStyle(bar).display !== 'none')
          .map(bar => bar.textContent).join(' '));
      assert.doesNotMatch(visibleActionText, /rising|ascending|day birth|night birth/i, 'unknown time clears precise prior action-bar summary');
      await page.screenshot({ path: resolve(output, label + '-unknown-birth.png'), fullPage: true });
      await page.locator('#n-certainty').selectOption('known');
      await page.locator('#wb-mp-zonemode').selectOption('iana');
      await page.locator('#wb-mp-zone').fill('America/New_York');
      await page.locator('#wb-mp-date').fill('2024-03-10');
      await page.locator('#wb-mp-time').fill('02:30');
      await page.locator('#wb-mp-time').blur();
      await page.locator('#wb-mp-error').waitFor({ state: 'visible' });
      assert.match(await page.locator('#wb-mp-error').textContent(), /nonexistent|does not exist|gap/i, 'DST spring gap is rejected');
      await page.locator('#wb-mp-date').fill('2024-11-03');
      await page.locator('#wb-mp-time').fill('01:30');
      await page.locator('#wb-mp-time').blur();
      assert.match(await page.locator('#wb-mp-error').textContent(), /ambiguous|repeated|twice/i, 'DST fold requires a choice');
      await page.locator('#wb-mp-fold').selectOption('earlier');
      await submit(page, '#n-form');
      await textIncludes(page, '#n-method', '2024-11-03T05:30');
      await page.locator('#wb-mp-fold').selectOption('later');
      await submit(page, '#n-form');
      await textIncludes(page, '#n-method', '2024-11-03T06:30');
      await accessibility(page);
      completed.push(label + ': known/unknown natal precision and real New York DST gap/fold workflow');

      await page.goto(base + 'pages/calendars.html', { waitUntil: 'domcontentloaded' });
      await page.locator('#cal-date').fill('2026-10-03');
      await page.locator('#cal-time').fill('12:00');
      await page.locator('#cal-zone').fill('UTC');
      await submit(page, '#cal-form');
      await textIncludes(page, '#cal-results', '5787');
      await textIncludes(page, '#cal-results', '2569');
      await page.locator('#convert-calendar').selectOption('gregorian');
      await page.locator('#convert-date').fill('2000-01-01');
      await page.locator('#convert-hour').fill('12');
      await submit(page, '#convert-form');
      await textIncludes(page, '#convert-result', '2451545');
      await textIncludes(page, '#convert-result', '1999-12-19');
      await page.locator('#easter-year').fill('2026');
      await submit(page, '#easter-form');
      await textIncludes(page, '#easter-result', '2026-04-05');
      await textIncludes(page, '#easter-result', '2026-04-12');
      await page.locator('#prayer-place').selectOption('london');
      await page.locator('#prayer-date').fill('2026-10-03');
      await submit(page, '#prayer-form');
      await textIncludes(page, '#prayer-results', 'Fajr');
      await textIncludes(page, '#qibla-result', '119.0');
      await page.locator('#prayer-place').selectOption('tromso');
      await page.locator('#prayer-date').fill('2026-06-21');
      await submit(page, '#prayer-form');
      await textIncludes(page, '#prayer-status', 'unavailable');
      assert.doesNotMatch(await page.locator('#prayer-results').textContent(), /NaN|Infinity/, 'polar case has meaningful unavailable results');
      await page.locator('#cal-zone').fill('Not/A_Zone');
      await submit(page, '#cal-form');
      await page.waitForFunction(() => document.querySelector('#cal-status').classList.contains('cal-error'));
      assert.equal(await page.locator('#cal-results').textContent(), '', 'invalid input clears stale calendar output');
      await page.locator('#cal-zone').fill('Asia/Kolkata');
      await submit(page, '#cal-form');
      // ICU versions may canonicalize Kolkata to its equivalent Calcutta alias.
      // Keep the substantive UTC+05:30 result and successful recovery assertions.
      await page.waitForFunction(() => /Asia\/(?:Kolkata|Calcutta)/.test(document.querySelector('#cal-status').textContent));
      await textIncludes(page, '#cal-status', '17:30');
      assert.equal(await page.locator('#cal-status').evaluate(el => el.classList.contains('cal-error')), false);
      await accessibility(page);
      await page.screenshot({ path: resolve(output, label + '-calendars.png'), fullPage: true });
      completed.push(label + ': civil calendars, J2000 JD, Gregorian/Julian Easter, Qibla, polar prayer case, validation recovery');
      assert.deepEqual(errors, [], 'no uncaught page errors');
      assert.deepEqual(missing, [], 'assets resolve under GitHub Pages project prefix');
      assert.deepEqual(external, [], 'natal and calendar calculations make no external requests');
    } catch (error) {
      await page.screenshot({ path: resolve(output, label + '-failure.png'), fullPage: true }).catch(() => {});
      throw error;
    } finally { await context.close(); }
  }
  for (const [label, viewport] of [['workbench-mobile', { width: 390, height: 844 }], ['workbench-desktop', { width: 1365, height: 900 }]]) {
    const start = performance.now();
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block', acceptDownloads: true });
    const errors = [], external = [], missing = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
      external.push(url.href); return route.abort('blockedbyclient');
    });
    await context.addInitScript(() => {
      if (!sessionStorage.getItem('qa-corrupt-state-installed')) {
        localStorage.setItem('wb-saved-readings', '[null]');
        localStorage.setItem('wb-persons', '{}');
        localStorage.setItem('wb-operations', '[null,42]');
        sessionStorage.setItem('qa-corrupt-state-installed', '1');
      }
    });
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) missing.push(response.status() + ' ' + response.url()); });
    try {
      await page.goto(base + 'pages/workbench.html?date=2026-01-01&time=00%3A00&offset=0&lat=51.5&lon=0', { waitUntil: 'networkidle' });
      await page.locator('#wb-wheel svg').waitFor();
      const initial = JSON.parse(await page.locator('#wb-json-view').textContent());
      assert.ok(Math.abs(initial.moment.planets.Sun.lon - 280.568611) < 0.02, 'rendered Workbench agrees with independent Astrodienst 2026 fixture');
      assert.equal(initial.meta.inputs.date, '2026-01-01T00:00:00.000Z');
      assert.equal(await page.locator('#wb-asst-key').count(), 0, 'AI connection waits for explicit opening');
      assert.equal(await page.locator('#wb-birth-mp-date').count(), 1, 'birth picker has independent IDs');
      assert.equal(await page.locator('#wb-mp-date').count(), 1, 'main picker ID is unique');
      await page.locator('#wb-mp-zonemode').selectOption('iana');
      await page.locator('#wb-mp-zone').fill('America/New_York');
      await page.locator('#wb-mp-date').fill('2024-11-03');
      await page.locator('#wb-mp-time').fill('01:30');
      await page.locator('#wb-mp-fold').selectOption('later');
      await submit(page, '#wb-form');
      await page.waitForFunction(() => { try { return JSON.parse(document.querySelector('#wb-json-view').textContent).meta.inputs.date === '2024-11-03T06:30:00.000Z'; } catch { return false; } });
      await page.locator('#wb-lots-sect').check();
      await page.waitForFunction(() => new URL(location.href).searchParams.get('sect') === '1');
      const sharedURL = page.url();
      assert.equal(new URL(sharedURL).searchParams.get('zone'), 'America/New_York');
      assert.equal(new URL(sharedURL).searchParams.get('fold'), 'later');
      await page.locator('#wb-actionbar .ab-menu-btn').click();
      const exported = JSON.parse((await download(page, '#wb-json', label + '-reading')).toString());
      assert.equal(exported.meta.inputs.date, '2024-11-03T06:30:00.000Z');
      assert.equal(exported.meta.inputs.sectAwareFortune, true);
      assert.equal(exported.moment.planets.Sun.lon, JSON.parse(await page.locator('#wb-json-view').textContent()).moment.planets.Sun.lon, 'export and figure use the same calculation');
      assert.doesNotMatch(JSON.stringify(exported), /wb-llm-key|Bearer |api[_-]?key/i, 'chart export excludes credentials');
      if (label === 'workbench-desktop') {
        await page.locator('#wb-actionbar .ab-menu-btn').click();
        await verifySVG(page, '#wb-wheel svg', await download(page, '#wb-svg', label + '-svg'));
        await page.locator('#wb-actionbar .ab-menu-btn').click();
        await verifyPNG(page, await download(page, '#wb-png', label + '-png'), label);
      }
      await page.locator('#wb-reset').click();
      await page.locator('#wb-saved-details > summary').click();
      await page.locator('#wb-saved [data-restore]').filter({ hasText: '2024-11-03' }).first().click();
      assert.equal(await page.locator('#wb-mp-zone').inputValue(), 'America/New_York');
      assert.equal(await page.locator('#wb-mp-fold').inputValue(), 'later');
      assert.equal(await page.locator('#wb-mp-time').inputValue(), '01:30');
      assert.equal(await page.locator('#wb-lots-sect').isChecked(), true);
      await page.goto(sharedURL, { waitUntil: 'networkidle' });
      await page.locator('#wb-wheel svg').waitFor();
      assert.equal(await page.locator('#wb-mp-zone').inputValue(), 'America/New_York');
      assert.equal(await page.locator('#wb-mp-fold').inputValue(), 'later');
      assert.equal(await page.locator('#wb-lots-sect').isChecked(), true);
      await page.locator('#wb-mp-zone').fill('Not/A_Zone');
      await page.locator('#wb-mp-zone').blur();
      await page.waitForFunction(() => document.querySelector('#wb-json')?.disabled === true);
      assert.equal(await page.locator('#wb-actionbar .action-bar').isHidden(), true, 'invalid draft cannot export a stale precise result');
      await page.locator('#wb-mp-zone').fill('America/New_York');
      await submit(page, '#wb-form');
      await page.locator('#wb-wheel svg').waitFor();
      await accessibility(page);
      const liveAction = await page.locator('#wb-live-start').isVisible() ? '#wb-live-start' : '#wb-live-resume';
      await usable(page, liveAction); await page.locator(liveAction).click();
      await textIncludes(page, '#wb-live-status', 'Live');
      await page.locator('#wb-live-pause').click();
      await textIncludes(page, '#wb-live-status', 'Frozen');
      await page.locator('#wb-p-figure').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, label + '-chart.png'), fullPage: false });
      completed.push(label + ': independent Sun fixture, malformed-state recovery, lazy AI, distinct pickers, zone/fold/sect restore, export, invalid draft and live/pause');
      assert.deepEqual(errors, [], 'Workbench has no console or uncaught errors');
      assert.deepEqual(missing, [], 'Workbench assets resolve under Pages prefix');
      assert.deepEqual(external, [], 'Workbench calculations make no external requests');
    } catch (error) {
      await page.screenshot({ path: resolve(output, label + '-failure.png'), fullPage: true }).catch(() => {});
      throw error;
    } finally { journeyTimings.push({ label, milliseconds: Math.round(performance.now() - start) }); await context.close(); }
  }

  for (const [label, viewport, deviceScaleFactor] of [
    ['studio-small', { width: 320, height: 568 }, 1], ['studio-mobile', { width: 390, height: 844 }, 1],
    ['studio-landscape', { width: 844, height: 390 }, 1], ['studio-desktop', { width: 1365, height: 900 }, 1],
    ['studio-reflow', { width: 640, height: 512 }, 2], // CSS reflow emulation; not browser zoom or a physical device
  ]) {
    const start = performance.now();
    const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: 'reduce', serviceWorkers: 'block', acceptDownloads: true });
    const errors = [], external = [], missing = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
      external.push(url.href); return route.abort('blockedbyclient');
    });
    await context.addInitScript(() => {
      if (!sessionStorage.getItem('qa-studio-corruption')) {
        localStorage.setItem('wb-studio-v1', '{}'); localStorage.setItem('wb-studio-snapshots-v1', '[null]');
        sessionStorage.setItem('qa-studio-corruption', '1');
      }
      window.__qaLocations = [];
      Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {
        getCurrentPosition: (success, failure) => window.__qaLocations.push({ success, failure }),
      } });
    });
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) missing.push(response.status() + ' ' + response.url()); });
    try {
      await page.goto(base + 'pages/studio.html', { waitUntil: 'networkidle' });
      await page.locator('#studioFigure svg').waitFor();
      await page.locator('#studioTime').fill('2026-01-01T00:00:00');
      await page.locator('#studioLat').fill('51.5'); await page.locator('#studioLon').fill('0');
      await usable(page, '#studioApply'); await page.locator('#studioApply').click();
      await textIncludes(page, '#studioResultContext', '2026-01-01 00:00:00 UTC');
      await textIncludes(page, '#studioFacts', "10°34' Capricorn");
      assert.doesNotMatch(await page.locator('#studioFacts').textContent(), /undefined|NaN|Infinity/);
      await accessibility(page);
      const figureBox = await page.locator('#studioFigure svg').boundingBox();
      assert.ok(figureBox.width >= 200 && figureBox.height >= 180, 'diagram remains readable at ' + label);
      await page.locator('#studioFigure').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, label + '-western.png'), fullPage: false });
      if (label === 'studio-desktop') {
        const record = JSON.parse((await download(page, '#studioExportJSON', label + '-western')).toString());
        assert.equal(record.inputs.dateISO, '2026-01-01T00:00:00.000Z');
        assert.ok(Math.abs(record.outputs.chart.planets.Sun.lon - 280.568611) < 0.02, 'exported chart retains independent ephemeris fixture');
        assert.doesNotMatch(JSON.stringify(record), /api[_-]?key|Bearer /i);
      }
      await page.locator('#studioTask').selectOption('vedic'); await page.locator('#studioApply').click();
      await textIncludes(page, '#studioMethods', 'Lahiri');
      assert.doesNotMatch(await page.locator('#studioFacts').textContent(), /undefined|NaN|Infinity/);
      await page.locator('#studioVedicStyle').selectOption('south'); await page.locator('#studioApply').click();
      await textIncludes(page, '#studioFigureCaption', 'South Indian');
      await accessibility(page);
      await page.locator('#studioFigure').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, label + '-vedic.png'), fullPage: false });
      await page.locator('#studioTask').selectOption('kamea');
      await page.locator('#studioPlanet').selectOption('Saturn');
      await page.locator('#studioSymbolMethod').selectOption('latin');
      await page.locator('#studioText').fill('AAB'); await page.locator('#studioApply').click();
      await textIncludes(page, '#studioFacts', 'AAB');
      await textIncludes(page, '#studioTracePosition', '2 of 2');
      assert.equal(await page.locator('#studioTracePlay').isDisabled(), true, 'reduced motion uses explicit frame control');
      await page.locator('#studioTraceStep').focus(); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
      await textIncludes(page, '#studioTracePosition', '1 of 2');
      await accessibility(page);
      await page.locator('#studioFigure').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, label + '-kamea.png'), fullPage: false });
      await usable(page, '#studioSaveSnapshot'); await page.locator('#studioSaveSnapshot').click();
      await textIncludes(page, '#studioStatus', 'saved');
      if (label === 'studio-desktop') {
        const record = JSON.parse((await download(page, '#studioExportJSON', label + '-kamea-frame')).toString());
        assert.equal(record.inputs.method, 'latin'); assert.equal(record.inputs.text, 'AAB');
        assert.equal(record.frame.visibleTraceSteps, 1); assert.equal(record.frame.complete, false);
        assert.deepEqual(record.outputs.grid, [[4, 9, 2], [3, 5, 7], [8, 1, 6]], 'published Saturn grid orientation is preserved');
        assert.equal(record.outputs.trace.steps[0].repeats, 2);
        await verifySVG(page, '#studioFigure svg', await download(page, '#studioExportSVG', label + '-svg'));
        await verifyPNG(page, await download(page, '#studioExportPNG', label + '-png'), label);
      }
      await page.locator('#studioPlanet').selectOption('Venus'); await page.locator('#studioApply').click();
      await page.locator('#studioSnapshots button[aria-label^="Restore kamea"]').first().click();
      assert.equal(await page.locator('#studioPlanet').inputValue(), 'Saturn');
      await textIncludes(page, '#studioTracePosition', '1 of 2');
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('#studioSnapshots button[aria-label^="Restore kamea"]').first().click();
      await textIncludes(page, '#studioTracePosition', '1 of 2');
      assert.equal(await page.locator('#studioText').inputValue(), 'AAB');
      await page.locator('#studioText').fill('देव'); await page.locator('#studioApply').click();
      assert.equal(await page.locator('#studioStatus').getAttribute('data-error'), 'true');
      for (const id of ['studioExportJSON', 'studioExportSVG', 'studioExportPNG', 'studioSaveSnapshot']) assert.equal(await page.locator('#' + id).isDisabled(), true, 'invalid symbolic input disables ' + id);
      await page.locator('#studioSymbolMethod').selectOption('hebrew-standard');
      await page.locator('#studioText').fill('שלום'); await page.locator('#studioApply').click();
      await textIncludes(page, '#studioFacts', 'שלום');
      await textIncludes(page, '#studioMethods', 'modern reconstruction');
      await page.locator('#studioTask').selectOption('gematria');
      await page.locator('#studioSymbolMethod').selectOption('standard'); await page.locator('#studioApply').click();
      assert.equal((await page.locator('#studioFigure').textContent()).trim(), '376', 'Hebrew שלום = 300+30+6+40');
      assert.equal(await page.locator('#studioExportSVG').isDisabled(), true, 'letter total offers JSON rather than an invented diagram');
      await page.locator('#studioTask').selectOption('katapayadi');
      await page.locator('#studioText').fill('rāma'); await page.locator('#studioApply').click();
      assert.equal((await page.locator('#studioFigure').textContent()).trim(), '52', 'r=2 m=5, read right to left');
      await page.locator('#studioTask').selectOption('yantra'); await page.locator('#studioPlanet').selectOption('Sun');
      await page.locator('#studioApply').click(); await textIncludes(page, '#studioMethods', 'modern printed');
      await page.locator('#studioFollowHour').check();
      await page.locator('#studioLat').fill('78.2232'); await page.locator('#studioLon').fill('15.6469');
      await page.locator('#studioTime').fill('2026-06-21T12:00:00'); await page.locator('#studioApply').click();
      await textIncludes(page, '#studioMethods', 'unavailable');
      assert.equal(await page.locator('#studioPlanet').inputValue(), 'Sun', 'polar hour failure retains the explicitly chosen square');
      if (label === 'studio-desktop') {
        const before = await page.locator('#studioLat').inputValue();
        await page.locator('#studioUseLocation').click();
        await page.evaluate(() => window.__qaLocations[0].failure({ code: 1 }));
        await textIncludes(page, '#studioLocationStatus', 'denied');
        assert.equal(await page.locator('#studioLat').inputValue(), before);
        await page.locator('#studioUseLocation').click(); await page.locator('#studioLat').fill('40');
        await page.evaluate(() => window.__qaLocations[1].success({ coords: { latitude: 1, longitude: 2, accuracy: 20 } }));
        assert.equal(await page.locator('#studioLat').inputValue(), '40', 'late GPS grant cannot overwrite a manual location edit');
      }
      await page.locator('#studioTask').selectOption('western');
      await page.locator('#studioLat').fill('51.5'); await page.locator('#studioLon').fill('0');
      await page.locator('#studioApply').click();
      const saves = await page.evaluate(() => localStorage.getItem('wb-studio-snapshots-v1'));
      await page.locator('#studioResume').click();
      await page.waitForFunction(() => document.querySelector('#studioClockStatus').dataset.mode === 'live');
      await page.locator('#studioPause').click();
      assert.equal(await page.locator('#studioClockStatus').getAttribute('data-mode'), 'frozen');
      assert.equal(await page.evaluate(() => localStorage.getItem('wb-studio-snapshots-v1')), saves, 'live refresh does not grow saved snapshots');
      await accessibility(page);
      assert.deepEqual(errors, [], 'Studio has no console or uncaught errors');
      assert.deepEqual(missing, [], 'Studio assets resolve under project prefix');
      assert.deepEqual(external, [], 'Studio and exports make no external requests');
      completed.push(label + ': charts/squares/letter totals, trace frame, save/reload, strict alphabet, polar hour, exports and live/pause');
    } catch (error) {
      await page.screenshot({ path: resolve(output, label + '-failure.png'), fullPage: true }).catch(() => {});
      throw error;
    } finally { journeyTimings.push({ label, milliseconds: Math.round(performance.now() - start) }); await context.close(); }
  }

  // Deliberately deferred provider replies prove the DOM-level race handling.
  // Only this test-only fetch implementation sees a fake key; no API is called.
  {
    const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
    const external = [], errors = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
      external.push(url.href); return route.abort('blockedbyclient');
    });
    await context.addInitScript(() => {
      const realFetch = window.fetch.bind(window);
      window.__qaProviderRequests = [];
      window.fetch = (url, options) => {
        if (String(url) !== 'https://api.groq.com/openai/v1/chat/completions') return realFetch(url, options);
        return new Promise(resolve => {
          window.__qaProviderRequests.push({ signal: options.signal, body: JSON.parse(options.body), finish: text => {
            const payload = 'data: ' + JSON.stringify({ choices: [{ delta: { content: text } }] }) + '\n\ndata: [DONE]\n\n';
            resolve(new Response(payload, { headers: { 'Content-Type': 'text/event-stream' } }));
          } });
        });
      };
    });
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(base + 'pages/workbench.html', { waitUntil: 'networkidle' });
      await page.locator('#wb-wheel svg').waitFor();
      await page.locator('#wb-assistant-open').click();
      await page.locator('#wb-asst-key').fill('qa-fake-key-never-transmitted');
      assert.equal(await page.evaluate(() => window.__qaProviderRequests.length), 0, 'opening and entering credentials never sends a request');
      const send = async (text, count) => {
        await page.locator('#wb-asst-input').fill(text);
        await page.locator('#wb-asst-send').click();
        await page.waitForFunction(n => window.__qaProviderRequests.length === n, count);
      };
      await send('First reading question', 1);
      await send('Replace the first request', 2);
      assert.equal(await page.evaluate(() => window.__qaProviderRequests[0].signal.aborted), true);
      await page.evaluate(() => window.__qaProviderRequests[0].finish('STALE_REPLY_MUST_NOT_APPEAR'));
      await page.evaluate(() => window.__qaProviderRequests[1].finish('CURRENT_REPLY_FROM_STUB'));
      await textIncludes(page, '#wb-asst-log', 'CURRENT_REPLY_FROM_STUB');
      assert.doesNotMatch(await page.locator('#wb-asst-log').textContent(), /STALE_REPLY/);
      assert.equal(await page.locator('#wb-asst-stop').isDisabled(), true);
      await send('Stop this request', 3);
      await page.locator('#wb-asst-stop').click();
      assert.equal(await page.evaluate(() => window.__qaProviderRequests[2].signal.aborted), true);
      await page.evaluate(() => window.__qaProviderRequests[2].finish('STOPPED_REPLY_MUST_NOT_APPEAR'));
      await send('Background cancellation', 4);
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      assert.equal(await page.evaluate(() => window.__qaProviderRequests[3].signal.aborted), true);
      await page.evaluate(() => {
        window.__qaProviderRequests[3].finish('BACKGROUND_REPLY_MUST_NOT_APPEAR');
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await send('Provider cancellation', 5);
      await page.locator('#wb-asst-provider').selectOption('anthropic');
      assert.equal(await page.evaluate(() => window.__qaProviderRequests[4].signal.aborted), true);
      await page.evaluate(() => window.__qaProviderRequests[4].finish('PROVIDER_REPLY_MUST_NOT_APPEAR'));
      await page.waitForTimeout(100); // drain buffered stream promises, not a network delay
      assert.doesNotMatch(await page.locator('#wb-asst-log').textContent(), /(?:STALE|STOPPED|BACKGROUND|PROVIDER)_REPLY/);
      assert.equal(await page.evaluate(() => window.__qaProviderRequests.length), 5, 'returning to foreground sends nothing automatically');
      assert.equal(await page.evaluate(() => localStorage.getItem('wb-llm-key-groq')), null, 'remember is opt-in');
      const messages = await page.evaluate(() => window.__qaProviderRequests[4].body.messages);
      assert.doesNotMatch(JSON.stringify(messages), /STALE_REPLY|STOPPED_REPLY|BACKGROUND_REPLY/, 'late replies cannot enter conversation history');
      assert.deepEqual(external, [], 'mocked provider journey never contacts an external endpoint');
      assert.deepEqual(errors, [], 'request cancellation produces no uncaught exception');
      completed.push('assistant: explicit send only; replacement/Stop/hidden/provider abort; stale UI/history blocked; key persistence opt-in');
    } catch (error) {
      await page.screenshot({ path: resolve(output, 'assistant-failure.png'), fullPage: true }).catch(() => {});
      throw error;
    } finally { await context.close(); }
  }

  // The repository's universal gate requires every HTML entry point, not
  // just the calculator journeys. Reuse this pinned Playwright installation.
  const htmlPages = [];
  async function collectHTML(dir = root) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || ['node_modules', '_site', 'test-results'].includes(entry.name)) continue;
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await collectHTML(path);
      else if (entry.name.endsWith('.html')) htmlPages.push(path.slice(root.length + 1).split(sep).join('/'));
    }
  }
  await collectHTML();
  const sweepContext = await browser.newContext({ viewport: { width: 1365, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await sweepContext.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort('blockedbyclient');
  });
  for (const path of htmlPages.sort()) {
    const page = await sweepContext.newPage(), errors = [], start = performance.now();
    page.on('console', message => { if (message.type() === 'error') errors.push('console: ' + message.text()); });
    page.on('pageerror', error => errors.push('uncaught: ' + error.message));
    page.on('requestfailed', request => errors.push('request: ' + request.url() + ' ' + request.failure()?.errorText));
    page.on('response', response => { if (response.status() >= 400) errors.push('HTTP ' + response.status() + ' ' + response.url()); });
    try {
      await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
      await page.locator('header.site').waitFor({ timeout: 10000 });
      assert.equal(await page.locator('main').count(), 1, 'one main landmark');
      assert.ok(await page.locator('nav.main[aria-label]').count(), 'labelled navigation');
      assert.ok(await page.evaluate(() => {
        const link = document.querySelector('a.skip-link');
        return link && document.querySelector(link.getAttribute('href'));
      }), 'skip link resolves');
      await page.waitForTimeout(1200);
      assert.equal(await page.evaluate(() => !!window.__motionStats?.().running), false, 'animation conductor parks when idle');
    } catch (error) { errors.push(error.message); }
    pageSweep.push({ path, passed: !errors.length, milliseconds: Math.round(performance.now() - start), errors });
    if (errors.length) console.error('PAGE FAIL ' + path + ': ' + JSON.stringify(errors));
    await page.close();
  }
  await sweepContext.close();
  assert.deepEqual(pageSweep.filter(item => !item.passed), [], 'all HTML entry points have zero console/page/request errors and valid chrome');
  completed.push('full static site sweep: ' + pageSweep.length + ' HTML entries under the Pages prefix');
  console.log(completed.map(item => 'PASS ' + item).join('\n'));
} catch (error) {
  failure = error; console.error(error);
} finally {
  await browser?.close();
  if (server.listening) await new Promise(ok => server.close(ok));
  await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({
    timestamp: new Date().toISOString(), completed, pageSweep, journeyTimings, downloadEvidence, elapsedMilliseconds: Math.round(performance.now() - started), passed: !failure,
    failure: failure ? String(failure.stack || failure) : null,
  }, null, 2));
}
if (failure) process.exitCode = 1;
