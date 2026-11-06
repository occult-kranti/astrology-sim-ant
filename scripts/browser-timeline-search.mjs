// Independent browser verification. Product code receives no mutable test hook.
// Real worker messages may be held/reordered at this test-owned browser boundary.
import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.env.TIMELINE_SEARCH_OUTPUT || 'test-results/timeline-search');
const base = (process.env.BASE || 'http://127.0.0.1:8003/').replace(/\/?$/, '/');
const origin = new URL(base).origin;
const widths = (process.env.TIMELINE_SEARCH_WIDTHS || '320,390,1440,1920').split(',').map(Number);
const selected = (process.env.TIMELINE_SEARCH_JOURNEYS || '').split(',').filter(Boolean);
const frozen = process.env.TIMELINE_SEARCH_FROZEN === '1';
const driver = 'scripts/browser-timeline-search.mjs';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
assert.ok(widths.every(width => Number.isInteger(width) && width >= 320 && width <= 2560));
async function files(dir) {
  const found = [];
  for (const entry of await readdir(resolve(root, dir), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const path = dir + '/' + entry.name;
    found.push(...(entry.isDirectory() ? await files(path) : [path]));
  }
  return found;
}
async function manifest() {
  const paths = ['index.html', 'sw.js', 'manifest.webmanifest', driver, ...await files('assets'), ...await files('pages'), ...await files('mcp')];
  return Object.fromEntries(await Promise.all(paths.sort().map(async path => [path, sha(await readFile(resolve(root, path)))])));
}
await mkdir(output, { recursive: true });
let exists = false;
try { await access(resolve(output, 'receipt.json')); exists = true; } catch {}
assert.ok(!exists, 'Use a new TIMELINE_SEARCH_OUTPUT directory; prior receipts are immutable.');
const before = await manifest();
await writeFile(resolve(output, 'driver.mjs'), await readFile(resolve(root, driver)));
const receipt = {
  schemaVersion: 1, kind: 'independent-timeline-search-browser', startedAt: new Date().toISOString(),
  frozenRequested: frozen, environment: { node: process.version, icu: process.versions.icu, base },
  checks: [], failures: [], errors: [], missing: [], externalRequests: [], downloads: [], screenshots: [], fonts: [],
  source: { beforeSHA256: sha(JSON.stringify(before)) },
  limitations: { physicalDevice: false, screenReader: false, humanUsabilityResearch: false, independentEphemeris: false, outcomeValidation: false, exhaustiveBrowserPlatforms: false },
};
let browser, current;
function check(value, label, detail) {
  receipt.checks.push({ ...current, label, pass: !!value, ...(detail === undefined ? {} : { detail }) });
  assert.ok(value, label + (detail === undefined ? '' : ': ' + JSON.stringify(detail)));
}
async function screenshot(page, label, selector) {
  if (selector) await page.locator(selector).first().evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.mouse.move(0, 0);
  const filename = current.name + '-' + current.width + '-' + label + '.png';
  const bytes = await page.screenshot({ path: resolve(output, filename) });
  receipt.screenshots.push({ ...current, filename, bytes: bytes.length, sha256: sha(bytes) });
}
async function download(page, selector, label) {
  const waiting = page.waitForEvent('download');
  await page.locator(selector).click();
  const item = await waiting;
  check(await item.failure() === null, label + ' download completes');
  const body = await readFile(await item.path()), compressed = gzipSync(body);
  const filename = 'downloads/' + String(receipt.downloads.length + 1).padStart(3, '0') + '-' + item.suggestedFilename() + '.gz';
  await mkdir(resolve(output, 'downloads'), { recursive: true });
  await writeFile(resolve(output, filename), compressed);
  receipt.downloads.push({ ...current, label, filename, bytes: body.length, sha256: sha(body), compressedSHA256: sha(compressed) });
  check(body.length > 40 && !body.includes(Buffer.from('TIMELINE_SEARCH_PRIVATE_SENTINEL')), label + ' contains bytes and no private storage sentinel');
  return body;
}
function csv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  assert.equal(quoted, false); assert.equal(row.length, 0);
  const head = rows.shift();
  return rows.map(cells => { assert.equal(cells.length, head.length); return Object.fromEntries(head.map((key, i) => [key, cells[i]])); });
}
async function tick(page) { await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))); }
async function frameReady(page) { await page.waitForFunction(() => document.querySelector('main.calendar-timeline')?.dataset.state === 'ready'); }
async function settings(page, values) {
  await page.locator('#ct-settings').evaluate(el => el.open = true);
  for (const [id, value] of Object.entries(values)) {
    const control = page.locator('#ct-' + id);
    if (await control.evaluate(el => el.tagName === 'SELECT')) await control.selectOption(String(value));
    else await control.fill(String(value));
  }
  await page.locator('#ct-apply').click();
}
async function privacy(page) {
  const state = await page.evaluate(() => window.__searchPrivacy);
  check(state.privateReads.length === 0 && state.geo === 0, 'No private saved data read or implicit location request', state);
  check(state.writes.length === 0, 'Search and session bookmarks make no automatic storage writes', state.writes);
}
async function journey(name, width, run, options = {}) {
  if (selected.length && !selected.includes(name)) return;
  current = { name, width };
  console.log('Journey: ' + name + ' at ' + width);
  const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width <= 390, reducedMotion: 'reduce', locale: 'en-US', serviceWorkers: 'block', acceptDownloads: true });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === origin || ['data:', 'blob:', 'about:'].includes(url.protocol)) return route.continue();
    receipt.externalRequests.push({ ...current, url: url.href }); return route.abort();
  });
  await context.addInitScript(() => {
    if (!/^https?:$/.test(location.protocol)) return;
    window.__searchInitialURL = location.href;
    const keys = ['birthProfile', 'wb-persons', 'wb-saved-readings', 'privateNotes', 'providerKey'];
    for (const key of keys) localStorage.setItem(key, 'TIMELINE_SEARCH_PRIVATE_SENTINEL');
    window.__searchPrivacy = { privateReads: [], writes: [], geo: 0 };
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem, remove = Storage.prototype.removeItem;
    Storage.prototype.getItem = function (key) { if (keys.includes(key)) window.__searchPrivacy.privateReads.push(key); return get.call(this, key); };
    Storage.prototype.setItem = function (key, value) { window.__searchPrivacy.writes.push({ key, kind: this === localStorage ? 'local' : 'session' }); return set.call(this, key, value); };
    Storage.prototype.removeItem = function (key) { window.__searchPrivacy.writes.push({ key, operation: 'remove' }); return remove.call(this, key); };
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition() { window.__searchPrivacy.geo++; } } });
    const NativeWorker = window.Worker;
    const qa = window.__searchWorkers = { hold: false, failNext: false, pending: [], sent: [], workers: [], release(index) { const message = this.pending.splice(index, 1)[0]; if (message) message.worker.emit(message.data); } };
    window.Worker = class extends EventTarget {
      constructor(url, options) {
        super(); this.search = String(url).includes('timeline-search-worker'); this.url = String(url); this.terminated = false;
        if (this.search && qa.failNext) { qa.failNext = false; throw new Error('QA deliberately unavailable Worker constructor'); }
        this.native = new NativeWorker(url, options); this.onmessage = null; this.onerror = null; qa.workers.push(this);
        this.native.addEventListener('message', event => { if (this.search && qa.hold && event.data.type !== 'progress') qa.pending.push({ worker: this, data: event.data }); else this.emit(event.data); });
        this.native.addEventListener('error', event => { this.onerror?.(event); this.dispatchEvent(new ErrorEvent('error', { message: event.message })); });
      }
      emit(data) { const event = new MessageEvent('message', { data }); this.onmessage?.(event); this.dispatchEvent(event); }
      postMessage(...args) { if (this.search) qa.sent.push(args[0]); this.native.postMessage(...args); }
      terminate() { this.terminated = true; if (!(this.search && qa.hold)) this.native.terminate(); }
    };
  });
  if (options.init) await context.addInitScript(options.init);
  const page = await context.newPage(); page.setDefaultTimeout(25000);
  const watch = page => {
    page.on('pageerror', error => receipt.errors.push({ ...current, url: page.url(), message: error.message }));
    page.on('console', message => { if (message.type() === 'error') receipt.errors.push({ ...current, url: page.url(), message: message.text() }); });
    page.on('response', response => { if (response.status() >= 400) receipt.missing.push({ ...current, url: response.url(), status: response.status() }); });
  };
  watch(page); context.on('page', watch);
  try { await run(page, context); await privacy(page); }
  catch (error) { receipt.failures.push({ ...current, message: error.message, stack: error.stack }); console.log('FAILED: ' + error.message.split('\n')[0]); await screenshot(page, 'failure').catch(() => {}); }
  finally { await context.close(); await writeFile(resolve(output, 'progress.json'), JSON.stringify({ completed: current, checks: receipt.checks.length, failures: receipt.failures }, null, 2)); }
}

async function openTimeline(page) {
  await page.goto(base + 'pages/calendar-timeline.html'); await frameReady(page);
  await page.waitForSelector('#ts-run:not(:disabled)');
}
async function scan(page) { await page.locator('#ts-run').click(); await scanReady(page); }
async function openConfig(page) { await page.locator('#ts-config').evaluate(el => el.open = true); }
async function scanReady(page) { await page.waitForFunction(() => document.querySelector('#ct-search')?.dataset.state === 'ready' && !document.querySelector('#ts-results').hidden && !document.querySelector('#ts-json').disabled); }
async function condition(page, kind, value) {
  await page.locator('#ts-add').click();
  const row = page.locator('.ts-criterion').last();
  await row.locator('select').selectOption(kind); await row.locator('input').fill(value);
}
async function scanJSON(page, label) { return JSON.parse(await download(page, '#ts-json', label + ' JSON')); }
async function exportScan(page, label) {
  const json = await download(page, '#ts-json', label + ' JSON'), data = JSON.parse(json);
  const csvBytes = await download(page, '#ts-csv', label + ' CSV');
  const expected = await page.evaluate(async ({ base, data }) => {
    const module = await import(base + 'assets/js/core/timeline-search.js');
    return { json: module.serializeTimelineSearchJSON(data), csv: module.serializeTimelineSearchCSV(data) };
  }, { base, data });
  check(json.toString() === expected.json && csvBytes.toString() === expected.csv, label + ' actual downloads equal canonical serializers');
  const rows = csv(csvBytes.toString()), samples = rows.filter(row => row.record === 'sample');
  check(samples.length === data.rows.length && samples.every((row, index) => Number(row.index) === index && row.date === data.rows[index].date && JSON.parse(row.value).sampleUTC === data.rows[index].sampleUTC), label + ' CSV preserves every date, index and resolved or missing UTC');
  check(same(JSON.parse(rows.find(row => row.record === 'statistics').value), data.statistics) && same(JSON.parse(rows.find(row => row.record === 'request').value), data.request), label + ' CSV retains full statistical family and applied request');
  check(rows.filter(row => row.record === 'line-distance').length === data.rows.reduce((n, row) => n + (row.map?.distances.length || 0), 0), label + ' CSV retains all forty line distances per available map sample');
  check(rows.filter(row => row.record === 'calendar').length === data.rows.length * data.request.calendarIds.length, label + ' CSV retains all selected calendar slots including missing dates');
  return data;
}
function verifyLedger(data, label) {
  const { rows, counts, statistics } = data;
  check(data.kind === 'timeline-search-ledger' && rows.length === counts.total && counts.processed === rows.length, label + ' complete declared daily grid, no top-list truncation');
  for (const status of ['available', 'ambiguous', 'unavailable']) check(counts[status] === rows.filter(row => row.status === status).length, label + ' honest ' + status + ' count');
  check(counts.matched === rows.filter(row => row.matched).length && counts.fullyObserved === rows.filter(row => row.fullyObserved).length, label + ' match and observed denominators follow the complete grid');
  check(rows.every((row, index) => row.index === index && row.calendars.length === data.request.calendarIds.length && row.slot.localDate === row.date), label + ' all row identities and calendar coverage retained');
  if (data.request.map.mode !== 'none') check(rows.filter(row => row.status === 'available').every(row => row.map.distances.length === 40 && new Set(row.map.distances.map(d => d.lineId)).size === 40), label + ' every available map row retains forty unique named lines');
  check(statistics.sampleCount === rows.length && statistics.family.plannedPairs === data.series.length * (data.series.length - 1) / 2, label + ' pair family determined by complete declared series');
  for (const series of data.series) {
    const summary = statistics.series.find(row => row.id === series.id), known = series.values.filter(value => value !== null);
    check(summary.availableCount === known.length && summary.missingCount === rows.length - known.length, label + ' availability for ' + series.id);
    check(series.values.every((value, index) => value === null ? summary.exceedanceFrequency[index] === null : Math.abs(summary.exceedanceFrequency[index] - known.filter(candidate => candidate >= value).length / known.length) < 1e-14), label + ' independent finite-grid frequency with ties for ' + series.id);
  }
  check(statistics.method.outcomeProbabilityAvailable === false, label + ' no outcome probability encoded');
}
async function layout(page, label) {
  const metrics = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth,
    controls: [...document.querySelectorAll('#ct-search button,#ct-search select,#ct-search input:not([type=checkbox]),#ct-search summary')].filter(el => el.getClientRects().length).map(el => ({ id: el.id, label: el.textContent.slice(0, 65), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, scroll: el.scrollWidth, client: el.clientWidth })),
    regions: [...document.querySelectorAll('#ct-search .ts-table-wrap')].filter(el => el.getClientRects().length).map(el => ({ tab: el.tabIndex, role: el.getAttribute('role'), label: el.getAttribute('aria-label'), width: el.clientWidth, scroll: el.scrollWidth })) }));
  check(metrics.scroll <= metrics.width + 1, label + ' no document horizontal overflow', metrics);
  check(metrics.controls.every(control => control.height >= 43 && control.scroll <= control.client + 2), label + ' controls retain 44px targets and unclipped text', metrics.controls);
  check(metrics.regions.every(region => region.tab === 0 && region.role === 'region' && region.label), label + ' table overflow regions are named and keyboard focusable', metrics.regions);
  const overflow = page.locator('#ct-search .ts-table-wrap').filter({ visible: true });
  for (let index = 0; index < await overflow.count(); index++) {
    const region = overflow.nth(index);
    if (await region.evaluate(el => el.scrollWidth > el.clientWidth + 2)) {
      await region.focus(); await page.keyboard.press('ArrowRight');
      await page.waitForFunction(el => el.scrollLeft > 0, await region.elementHandle());
      check(await region.evaluate(el => document.activeElement === el), label + ' overflowing table responds to keyboard scrolling'); break;
    }
  }
}
async function fontReceipt(page, label) {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument'), { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#ct-search h2' });
    receipt.fonts.push({ ...current, label, fonts: (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts });
  } finally { await cdp.detach(); }
}
async function mainJourney(page) {
  await openTimeline(page);
  check(await page.locator('#ct-slider').count() === 1 && await page.locator('#ct-date').count() === 1 && await page.locator('#ct-step-unit').count() === 1, 'Existing main native timeline controls remain available');
  check(await page.locator('#ts-results').isHidden() && (await page.evaluate(() => window.__searchWorkers.sent)).length === 0, 'Initial page does not automatically scan');
  await settings(page, { start: '2026-01-01', end: '2026-02-01', time: '12:34:56', zone: 'UTC', lat: '51.5074', lon: '-0.1278', fold: 'reject' }); await frameReady(page);
  check((await page.locator('#ts-context').innerText()).includes('12:34:56 UTC'), 'Scan context names the explicitly applied clock');
  await condition(page, 'weekday', '1,2,3,4,5'); await condition(page, 'lunar:phaseIndex', '2,3,4');
  await page.locator('#ts-radius').fill('3000'); await scan(page);
  const data = await exportScan(page, '32-day transit scan'); verifyLedger(data, '32-day transit scan');
  check(data.request.timeline.time === '12:34:56' && data.rows.length === 32 && data.request.criteria.length === 2, 'Actual scan uses applied inputs and declared conditions');
  check(!(await page.locator('#ts-inspector').innerText()).includes('no occurrence selected'), 'Ordinary resolved clock is not described as an unresolved occurrence');
  const availableMapRows = data.rows.filter(row => row.map?.available === true), mapMatches = availableMapRows.filter(row => row.map.matched === true).length;
  const mapDiagnostic = await page.locator('#ts-map-discrimination').innerText();
  check(availableMapRows.length === 32 && mapMatches === 32 && data.counts.matched === 7 && mapDiagnostic.includes('Map threshold matched 32 of 32 map-available samples') && mapDiagnostic.includes('did not narrow this search') && mapDiagnostic.includes('0 samples have unavailable map geometry'), 'Real all-pass map threshold is disclosed separately from seven combined-condition matches');
  const statsText = await page.locator('#ts-statistics-body').innerText();
  check(statsText.includes('Planned comparisons') && statsText.includes('Holm') && /do not estimate the chance/.test(statsText), 'Statistical family and outcome limits are visible');
  await page.locator('#ts-statistics-body details').last().evaluate(el => el.open = true);
  check((await page.locator('#ts-statistics-body').innerText()).includes('not a calibrated forecast'), 'Within-grid frequency is visibly distinguished from forecast probability');
  await layout(page, 'Search results'); await fontReceipt(page, 'Site font'); await screenshot(page, 'results', '#ts-result-heading'); await screenshot(page, 'inspector', '#ts-inspector');
  const originalStats = await page.locator('#ts-statistics-body').innerText();
  await page.locator('#ts-filter').selectOption('all'); await page.locator('#ts-order').selectOption('distance');
  const filtered = await scanJSON(page, 'Filtered and reordered');
  check(same(filtered, data) && await page.locator('#ts-statistics-body').innerText() === originalStats, 'View filter/order changes no exported row, denominator, family or adjustment');
  check(await page.locator('#ts-table .ts-date-button').count() === 12 && (await page.locator('#ts-page').innerText()).includes('of 32'), 'Pagination reveals full-grid count');
  await page.locator('#ts-next').click(); check((await page.locator('#ts-page').innerText()).startsWith('13'), 'Next page reaches retained rows');
  await page.locator('#ts-cursor').focus(); await page.keyboard.press('End');
  check(await page.locator('#ts-cursor-date').innerText() === '2026-02-01', 'Native scan slider End selects inclusive final date');
  await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
  check(await page.locator('#ts-cursor-date').innerText() === '2026-01-02' && (await page.locator('#ts-cursor').getAttribute('aria-valuetext')).includes(data.rows[1].sampleUTC), 'Native keyboard date navigation exposes exact sampled UTC');
  await page.locator('#ts-inspector').getByRole('button', { name: 'Use in linked charts', exact: true }).click(); await frameReady(page);
  check(await page.locator('#ct-date').inputValue() === '2026-01-02' && await page.locator('#ct-output').getAttribute('data-date-iso') === data.rows[1].sampleUTC, 'Search selection updates existing frame at the same sample instant');
  await page.locator('#ct-chart-next').click(); await frameReady(page);
  check(await page.locator('#ts-cursor-date').innerText() === '2026-01-03', 'Existing chart navigation updates the search inspector');
  const tags = await page.locator('#ct-output [data-date-iso]').evaluateAll(els => els.map(el => el.dataset.dateIso));
  check(tags.length >= 3 && tags.every(instant => instant === data.rows[2].sampleUTC), 'Existing chart/calendar panes share selected sample instant');
  const calendar = page.locator('#ct-calendars .ct-calendar').first(), calendarId = await calendar.getAttribute('data-calendar-id');
  await calendar.locator('.ct-calendar-date-disclosure').evaluate(el => el.open = true);
  const nativeCalendar = page.locator('[data-calendar-id="' + calendarId + '"] .date-nav-slider');
  check(await nativeCalendar.count() === 1, 'Collapsed calendar card preserves its original native slider');
  await nativeCalendar.focus(); await page.keyboard.press('ArrowRight'); await frameReady(page);
  check(await page.locator('#ct-date').inputValue() === '2026-01-04' && await page.locator('[data-calendar-id="' + calendarId + '"] .ct-calendar-date-disclosure').getAttribute('open') !== null, 'Calendar native keyboard navigation updates shared date and retains open disclosure');
  await page.locator('[data-calendar-id="' + calendarId + '"] .date-nav-slider').focus(); await page.keyboard.press('ArrowLeft'); await frameReady(page);
  check(await page.locator('#ts-cursor-date').innerText() === '2026-01-03', 'Preserved calendar navigation also synchronizes the scan cursor');
  await page.locator('#ts-inspector').getByRole('button', { name: 'Keep this date', exact: true }).click();
  await page.locator('#ts-kept').evaluate(el => el.open = true);
  const kept = JSON.parse(await download(page, '#ts-kept-export', 'Kept study'));
  check(kept.studies.length === 1 && same(kept.studies[0].request, data.request) && same(kept.studies[0].row, data.rows[2]), 'Session bookmark captures exact request and selected row');
  await page.locator('#ts-inspector').getByRole('button', { name: 'Kept in this tab', exact: true }).click();
  check(await page.locator('#ts-kept-count').innerText() === '1 in this tab', 'Exact duplicate capture is not multiplied');
  await page.locator('#ct-lat').fill('20.1234');
  check(await page.locator('#ts-results').isHidden() && await page.locator('#ts-run').isDisabled() && await page.locator('#ts-json').isDisabled(), 'Unapplied observer edit invalidates scan and exports');
  await page.locator('.ts-kept-item button').first().click();
  const preview = await page.locator('#ts-kept-preview').innerText();
  check(preview.includes('51.5074') && !preview.includes('20.1234') && preview.includes('Captured context'), 'Old bookmark preview retains old context without relabelling');
  check(await page.locator('#ct-lat').inputValue() === '20.1234' && await page.locator('#ts-run').isDisabled(), 'Bookmark preview does not overwrite edited applied inputs');
  const keptAfter = JSON.parse(await download(page, '#ts-kept-export', 'Kept study after input change'));
  check(same(keptAfter, kept), 'Context edit cannot mutate captured bookmark export');
  await screenshot(page, 'kept-context', '#ts-kept');
  await page.locator('#ct-apply').click(); await frameReady(page); await scan(page);
  check((await scanJSON(page, 'Changed observer')).request.timeline.lat === 20.1234, 'Reapply and rescan recovers with explicit new observer');
  await page.locator('#ts-config').evaluate(el => el.open = true);
  await page.addStyleTag({ content: '#ct-search,#ct-search button,#ct-search input,#ct-search select,#ct-search summary,#ct-search h2,#ct-search h3{font-family:"DejaVu Sans",sans-serif!important}' });
  await layout(page, 'DejaVu fallback'); await fontReceipt(page, 'DejaVu fallback'); await screenshot(page, 'fallback-configuration', '#ts-config'); await screenshot(page, 'statistics', '#ts-statistics');
  await privacy(page);
  await page.reload(); await frameReady(page);
  check(await page.locator('#ts-kept-count').innerText() === '0 in this tab' && await page.locator('#ts-results').isHidden(), 'Reload clears session captures and scan context');
}
async function races(page) {
  await openTimeline(page); await settings(page, { start: '2026-01-01', end: '2026-01-08', zone: 'UTC' }); await frameReady(page);
  await page.evaluate(() => window.__searchWorkers.hold = true); await page.locator('#ts-run').click();
  await page.waitForFunction(() => window.__searchWorkers.pending.some(item => item.data.type === 'result'));
  check(await page.locator('#ts-progress').isVisible() && await page.locator('#ts-cancel').isEnabled() && await page.locator('#ts-json').isDisabled(), 'Pending real scan displays progress and cancel while exports remain disabled');
  await openConfig(page); await page.locator('#ts-radius').fill('700'); await page.locator('#ts-run').click();
  await page.waitForFunction(() => window.__searchWorkers.pending.filter(item => item.data.type === 'result').length === 2);
  const workerCount = await page.evaluate(() => window.__searchWorkers.workers.filter(worker => worker.search).length);
  check(workerCount === 2 && await page.evaluate(() => window.__searchWorkers.workers.filter(worker => worker.search)[0].terminated), 'Replacement terminates old scan worker and creates a new worker');
  await page.evaluate(() => window.__searchWorkers.release(1)); await scanReady(page);
  const newest = await scanJSON(page, 'Replacement newest result');
  check(newest.request.map.maxDistanceKm === 700, 'Newest real completed result is accepted');
  await page.evaluate(() => window.__searchWorkers.release(0)); await tick(page);
  check(same(await scanJSON(page, 'After older result released'), newest), 'Older real completed result cannot overwrite newer scan');
  await page.locator('#ts-run').click(); await page.waitForFunction(() => window.__searchWorkers.pending.length === 1);
  await page.locator('#ts-cancel').click(); await page.evaluate(() => window.__searchWorkers.release(0)); await tick(page);
  check(await page.locator('#ts-results').isHidden() && await page.locator('#ts-json').isDisabled() && /cancelled/i.test(await page.locator('#ts-state').innerText()), 'Cancelled result cannot revive results, exports or status');
  await page.locator('#ts-run').click(); await page.waitForFunction(() => window.__searchWorkers.pending.length === 1);
  await page.locator('#ct-settings').evaluate(el => el.open = true); await page.locator('#ct-time').fill('14:00');
  await page.evaluate(() => window.__searchWorkers.release(0)); await tick(page);
  check(await page.locator('#ts-results').isHidden() && await page.locator('#ts-run').isDisabled(), 'Applied-context edit rejects pending scan result');
  await page.evaluate(() => { window.__searchWorkers.hold = false; for (const worker of window.__searchWorkers.workers) if (worker.search) worker.native.terminate(); });
  await page.locator('#ct-apply').click(); await frameReady(page);
  await page.evaluate(() => window.__searchWorkers.failNext = true); await page.locator('#ts-run').click();
  check(await page.locator('#ct-search').getAttribute('data-state') === 'error' && await page.locator('#ts-error').isVisible() && await page.locator('#ts-cancel').isDisabled(), 'Unavailable Worker constructor gives bounded visible recovery');
  await scan(page); check((await scanJSON(page, 'Worker recovery')).request.timeline.time === '14:00:00', 'Worker failure can recover without reloading or changing inputs');
  await openConfig(page); await page.locator('#ts-map-mode').selectOption('fixed'); await page.locator('#ts-fixed').fill('unknown'); await page.locator('#ts-run').click();
  await page.waitForFunction(() => document.querySelector('#ct-search').dataset.state === 'error');
  check(await page.locator('#ts-error').isVisible() && await page.locator('#ts-results').isHidden(), 'Invalid fixed instant produces no substituted geometry');
  await screenshot(page, 'recoverable-error', '#ct-search');
}
async function missingClocks(page) {
  await openTimeline(page); await page.locator('#ts-map-mode').selectOption('none'); await condition(page, 'weekday', '1,2,3,4,5'); await condition(page, 'lunar:phaseIndex', '2,3,4');
  await settings(page, { start: '2026-03-05', end: '2026-03-11', time: '02:30', zone: 'America/New_York', lat: '40.7128', lon: '-74.006', fold: 'reject' }); await frameReady(page); await scan(page);
  let data = await exportScan(page, 'Spring clock gap'); verifyLedger(data, 'Spring clock gap');
  check(data.counts.unavailable === 1 && data.rows[3].date === '2026-03-08' && data.rows[3].sampleUTC === null && data.statistics.grid.status === 'unavailable', 'Spring gap remains a null slot and invalidates regular-grid phase reference');
  await page.locator('#ts-filter').selectOption('unavailable'); await page.locator('#ts-table .ts-date-button').click();
  check((await page.locator('#ts-inspector').innerText()).includes(data.rows[3].slot.reason), 'Gap inspector exposes actual canonical reason');
  await screenshot(page, 'gap', '#ts-inspector');
  await settings(page, { start: '2026-10-29', end: '2026-11-04', time: '01:30', fold: 'reject' }); await frameReady(page); await scan(page);
  data = await exportScan(page, 'Autumn repeated clock');
  check(data.counts.ambiguous === 1 && data.rows[3].slot.candidates.length === 2 && data.rows[3].sampleUTC === null, 'Rejected fold preserves both candidate UTC instants and no chosen instant');
  await page.locator('#ts-filter').selectOption('unavailable'); await page.locator('#ts-table .ts-date-button').click();
  const foldText = await page.locator('#ts-inspector').innerText();
  check(data.rows[3].slot.candidates.every(candidate => foldText.includes(candidate.dateISO)), 'Fold inspector visibly exposes both canonical UTC candidates');
  await settings(page, { fold: 'later' }); await frameReady(page); await scan(page); data = await scanJSON(page, 'Explicit later clock');
  check(data.counts.available === 7 && data.rows[3].sampleUTC === '2026-11-01T06:30:00.000Z' && data.statistics.grid.status === 'unavailable', 'Explicit fold choice resolves sample while unequal DST spacing stays ineligible');
  await screenshot(page, 'irregular-grid', '#ts-statistics');
}
async function fixedMap(page) {
  await openTimeline(page); await settings(page, { start: '2026-01-01', end: '2026-01-08', zone: 'UTC' }); await frameReady(page);
  await page.locator('#ts-map-mode').selectOption('fixed'); await page.locator('#ts-fixed').fill('2000-01-01T12:00:00Z');
  await page.locator('#ts-bodies').evaluate(el => el.closest('details').open = true);
  for (const input of await page.locator('#ts-bodies input').all()) if (await input.inputValue() !== 'Sun') await input.uncheck();
  for (const input of await page.locator('#ts-angles input').all()) if (await input.inputValue() !== 'MC') await input.uncheck();
  await scan(page); const data = await exportScan(page, 'Fixed map with selected Sun MC'); verifyLedger(data, 'Fixed map');
  check(data.rows.every(row => row.map.geometryInstantISO === '2000-01-01T12:00:00.000Z' && same(row.map.distances, data.rows[0].map.distances)), 'Fixed source instant and all forty distances remain invariant across scan dates');
  check(data.statistics.pairs.every(pair => pair.phaseReference.tailProbability === null) && data.statistics.series.every(series => series.constant), 'Constant map summaries do not acquire correlation or phase probabilities');
  const detail = page.locator('#ts-inspector details').filter({ has: page.locator('summary', { hasText: 'All planetary line distances' }) });
  await detail.evaluate(el => el.open = true);
  check(await detail.locator('tbody tr').count() === 40 && (await detail.innerText()).match(/Not selected/g)?.length === 39, 'Inspector distinguishes thirty-nine unselected lines from selected Sun MC');
  await page.locator('#ts-inspector').evaluate(el => { el.scrollIntoView({ block: 'start', behavior: 'instant' }); scrollBy(0, -110); });
  await screenshot(page, 'fixed-all-lines');
}
async function mapReady(page) { await page.waitForFunction(() => document.querySelector('#ag-app')?.dataset.state === 'ready' && !document.querySelector('#ag-export-json').disabled); }
async function handoff(page, context) {
  await openTimeline(page); await settings(page, { start: '2026-01-01', end: '2026-01-04', time: '13:14:15', zone: 'Asia/Tokyo', lat: '35.6812', lon: '139.7671', system: 'whole' }); await frameReady(page); await scan(page);
  const scanData = await scanJSON(page, 'Map transfer source');
  const navigations = []; context.on('request', request => { if (request.isNavigationRequest()) navigations.push(request.url()); });
  const opened = context.waitForEvent('page'); await page.locator('#ts-inspector').getByRole('button', { name: 'Map this sample', exact: true }).click();
  const receiver = await opened; await receiver.waitForSelector('#ag-transfer-apply:not([hidden])'); await mapReady(receiver);
  const openedURL = new URL(await receiver.evaluate(() => window.__searchInitialURL));
  check(/^#timeline-transfer=[a-f0-9]{32}$/.test(openedURL.hash) && openedURL.search === '', 'Initial receiver URL contains only a random opaque transfer token');
  check(receiver.url() === base + 'pages/astrocartography.html' && navigations.every(url => !url.includes('35.6812') && !url.includes('139.7671') && !url.includes('2026-01-01')), 'Handoff navigation carries no chart/place/date values and strips opaque fragment');
  check((await receiver.locator('#ag-context-summary').innerText()).includes('2024-03-20') && await receiver.locator('#ag-date').inputValue() === '2024-03-20', 'Received preview preserves current example map and inputs until explicit apply');
  const preview = await receiver.locator('#ag-transfer-summary').innerText();
  check(preview.includes('2026-01-01') && preview.includes('35.6812') && preview.includes('139.7671') && preview.includes('Asia/Tokyo') && preview.includes('whole'), 'Receiver preview exposes exact transferred observer, moment and conventions');
  check(/received.*inputs|review/i.test(await page.locator('#ts-state').innerText()), 'Source receives a readable receipt from the new map tab');
  const geometry = await receiver.locator('#ag-transfer').evaluate(host => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, controls: [...host.querySelectorAll('button')].filter(el => el.getClientRects().length).map(el => ({ height: el.getBoundingClientRect().height, client: el.clientWidth, scroll: el.scrollWidth })) }));
  check(geometry.scroll <= geometry.width + 1 && geometry.controls.every(control => control.height >= 43 && control.scroll <= control.client + 2), 'Receiver preview fits mobile width with readable 44px actions', geometry);
  await screenshot(receiver, 'preview', '#ag-transfer');
  await receiver.locator('#ag-transfer-apply').click(); await mapReady(receiver);
  const map = JSON.parse(await download(receiver, '#ag-export-json', 'Accepted map handoff'));
  check(map.result.context.instantISO === scanData.rows[0].sampleUTC && map.request.inputs.system === 'whole', 'Explicit apply calculates the exact sampled UTC and house convention');
  check(map.request.place.lat === 35.6812 && map.request.place.lon === 139.7671 && map.request.place.timeZone === 'Asia/Tokyo', 'Transferred destination retains exact entered coordinates and display zone');
  check(map.request.inputs.bodyIds.length === 10 && map.request.inputs.angleIds.length === 4 && map.request.inputs.cityIds.length > 20, 'Transfer preserves selected angular bodies and complete city catalogue');
  await screenshot(receiver, 'accepted', '#ag-context-summary'); await privacy(receiver); await receiver.close();
  await openConfig(page); await page.locator('#ts-map-mode').selectOption('fixed'); await page.locator('#ts-fixed').fill('2000-01-01T12:00:00Z'); await scan(page);
  const fixedOpened = context.waitForEvent('page'); await page.locator('#ts-inspector').getByRole('button', { name: 'Map this sample', exact: true }).click();
  const fixed = await fixedOpened; await fixed.waitForSelector('#ag-transfer-apply:not([hidden])'); await mapReady(fixed);
  check((await fixed.locator('#ag-transfer-summary').innerText()).includes('2000-01-01 12:00:00 UTC'), 'Fixed-map transfer previews immutable geometry instant, not scanned date');
  await fixed.locator('#ag-transfer-discard').click();
  check(await fixed.locator('#ag-transfer').isHidden() && (await fixed.locator('#ag-context-summary').innerText()).includes('2024-03-20'), 'Discard preserves prior map'); await privacy(fixed); await fixed.close();
  await openConfig(page); await page.locator('#ts-fixed').fill('2000-01-01T12:00:00.123Z'); await scan(page);
  const countBefore = context.pages().length; await page.locator('#ts-inspector').getByRole('button', { name: 'Map this sample', exact: true }).click(); await tick(page);
  check(context.pages().length === countBefore && (await page.locator('#ts-state').innerText()).includes('no silently rounded handoff'), 'Fractional-second fixed instant is explicitly refused rather than rounded by whole-second map form');
}
async function invalidHandoff(page, context) {
  await page.goto(base + 'index.html');
  for (const kind of ['malformed-token', 'expired-envelope', 'invalid-payload', 'unsupported']) {
    const nonce = ({ 'expired-envelope': 'a'.repeat(32), 'invalid-payload': 'b'.repeat(32) })[kind];
    if (nonce) await page.evaluate(({ nonce, kind }) => {
      const channel = new BroadcastChannel('workbench-astrocartography-transfer-v1-' + nonce);
      window.__qaChannel = channel;
      channel.onmessage = ({ data }) => { if (data.type === 'ready') channel.postMessage({ type: 'offer', nonce, expiresAt: Date.now() + (kind === 'expired-envelope' ? -1000 : 30000), payload: { injected: '<img src=x onerror="window.__injected=true">' } }); };
    }, { nonce, kind });
    const receiver = await context.newPage();
    if (kind === 'unsupported') await receiver.addInitScript(() => Object.defineProperty(window, 'BroadcastChannel', { value: undefined }));
    await receiver.goto(base + 'pages/astrocartography.html#timeline-transfer=' + (nonce || (kind === 'unsupported' ? 'c'.repeat(32) : 'invalid')));
    await mapReady(receiver); await receiver.waitForSelector('#ag-transfer:not([hidden])');
    check(await receiver.locator('#ag-transfer-apply').isHidden() && /existing map inputs were kept/i.test(await receiver.locator('#ag-transfer-status').innerText()), kind + ' gives recoverable status without apply');
    check(!receiver.url().includes('#') && await receiver.locator('#ag-date').inputValue() === '2024-03-20' && (await receiver.locator('#ag-context-summary').innerText()).includes('2024-03-20'), kind + ' preserves prior calculated map and removes token');
    check(await receiver.evaluate(() => !window.__injected), kind + ' does not execute untrusted payload');
    await screenshot(receiver, kind, '#ag-transfer'); await privacy(receiver); await receiver.close();
    if (nonce) await page.evaluate(() => window.__qaChannel.close());
  }
}
async function cancelledHandoff(page, context) {
  await openTimeline(page); await settings(page, { start: '2026-01-01', end: '2026-01-04', zone: 'UTC' }); await frameReady(page); await scan(page);
  // Delay only the receiver's real ready handshake. Accelerate only its 60s
  // expiry callback to exercise recovery without waiting a full minute.
  await context.addInitScript(() => {
    if (!location.pathname.endsWith('/astrocartography.html')) return;
    const Native = window.BroadcastChannel, nativeTimeout = window.setTimeout;
    window.__qaReady = [];
    window.BroadcastChannel = class extends Native { postMessage(value) { if (value?.type === 'ready') window.__qaReady.push(() => super.postMessage(value)); else super.postMessage(value); } };
    window.setTimeout = (callback, delay, ...args) => nativeTimeout(callback, delay === 60000 ? 2500 : delay, ...args);
  });
  const opened = context.waitForEvent('page'); await page.locator('#ts-inspector').getByRole('button', { name: 'Map this sample', exact: true }).click();
  const receiver = await opened; await mapReady(receiver); await receiver.waitForFunction(() => window.__qaReady.length > 0);
  await openConfig(page); await page.locator('#ts-radius').fill('650'); await receiver.evaluate(() => window.__qaReady.splice(0).forEach(send => send()));
  await receiver.waitForFunction(() => /No current transfer/.test(document.querySelector('#ag-transfer-status').textContent));
  check(await receiver.locator('#ag-transfer-apply').isHidden() && (await receiver.locator('#ag-context-summary').innerText()).includes('2024-03-20'), 'Source edit cancels pending channel; delayed receiver cannot revive old transfer');
  await screenshot(receiver, 'expired-after-source-edit', '#ag-transfer'); await privacy(receiver); await receiver.close();
}

try {
  const pkg = process.env.PLAYWRIGHT_PKG || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
  const { chromium } = await import(pathToFileURL(pkg).href);
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/home/agent/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome', args: ['--no-sandbox'] });
  receipt.environment.browser = browser.version();
  for (const width of widths) await journey('responsive', width, mainJourney);
  await journey('worker-lifecycle', 390, races);
  await journey('missing-clocks', 390, missingClocks);
  await journey('fixed-map', 1440, fixedMap);
  await journey('map-handoff', 390, handoff);
  await journey('invalid-handoff', 390, invalidHandoff);
  await journey('cancelled-handoff', 390, cancelledHandoff);
} catch (error) { receipt.failures.push({ name: 'harness', message: error.message, stack: error.stack }); }
finally {
  await browser?.close();
  const after = await manifest();
  receipt.source.afterSHA256 = sha(JSON.stringify(after));
  receipt.source.changedFiles = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(path => before[path] !== after[path]);
  receipt.pass = receipt.failures.length === 0 && receipt.errors.length === 0 && receipt.missing.length === 0 && receipt.externalRequests.length === 0 && receipt.checks.length > 0;
  receipt.acceptanceEligible = receipt.pass && frozen && receipt.source.changedFiles.length === 0 && widths.length === 4 && [320, 390, 1440, 1920].every(width => widths.includes(width)) && !selected.length;
  receipt.completedAt = new Date().toISOString(); receipt.checkCount = receipt.checks.length;
  await writeFile(resolve(output, 'source-before.json'), JSON.stringify(before, null, 2) + '\n');
  await writeFile(resolve(output, 'source-after.json'), JSON.stringify(after, null, 2) + '\n');
  await writeFile(resolve(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify({ pass: receipt.pass, acceptanceEligible: receipt.acceptanceEligible, checks: receipt.checkCount, downloads: receipt.downloads.length, screenshots: receipt.screenshots.length, errors: receipt.errors.length, failures: receipt.failures.map(f => ({ name: f.name, width: f.width, message: f.message })), changedFiles: receipt.source.changedFiles, receipt: resolve(output, 'receipt.json') }, null, 2));
  if (!receipt.pass || (frozen && !receipt.acceptanceEligible)) process.exitCode = 1;
}
