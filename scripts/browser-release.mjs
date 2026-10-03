// Strict release journeys under the GitHub Pages project path.
// Browser-only tooling: npm install --no-save --package-lock=false playwright@1.58.2
// npx playwright install chromium && node scripts/browser-release.mjs
// These checks exercise user workflows; scientific reference vectors live in engine-test.mjs.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'test-results');
await mkdir(output, { recursive: true });
async function loadPlaywright() {
  if (process.env.PLAYWRIGHT_PKG) return import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href);
  try { return await import('playwright'); }
  catch { return import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs'); }
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
const completed = [];
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
  console.log(completed.map(item => 'PASS ' + item).join('\n'));
} catch (error) {
  failure = error; console.error(error);
} finally {
  await browser?.close();
  if (server.listening) await new Promise(ok => server.close(ok));
  await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({
    timestamp: new Date().toISOString(), completed, passed: !failure,
    failure: failure ? String(failure.stack || failure) : null,
  }, null, 2));
}
if (failure) process.exitCode = 1;
