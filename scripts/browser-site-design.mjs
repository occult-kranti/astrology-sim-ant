// Bounded visual-system acceptance. This is Chromium automation, not a screen-
// reader, physical-device, human usability, or universal accessibility audit.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.env.SITE_DESIGN_OUTPUT || 'test-results/site-design');
const widths = (process.env.SITE_DESIGN_WIDTHS || '320,390,1440').split(',').map(Number);
assert.ok(widths.every(width => Number.isInteger(width) && width >= 320 && width <= 2560));
const themes = ['parchment', 'midnight', 'mineral'];
const key = 'wb:appearance:v1';
const prefix = '/astrology-sim-ant/';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const routes = [
  ['home', 'index.html', '#homeSummary:not([aria-busy="true"])'],
  ['atlas', 'pages/calendar-atlas.html?at=2026-10-29T12:00:00Z&lat=51.5074&lon=-0.1278&zone=Europe/London', '#sky-chart svg'],
  ['chinese', 'pages/calendars/chinese.html?at=2026-10-29T12:00:00Z&lat=51.5074&lon=-0.1278&zone=Europe/London', '#sky-chart svg'],
  ['timeline', 'pages/calendar-timeline.html', '#ct-tropical svg'],
  ['country', 'pages/country-calendars.html', '#cr-selected-title'],
  ['newton', 'pages/newton-chronology.html', '#nw-sky svg'],
  ['sources', 'pages/eschatology-atlas.html', '#ea-selected-record'],
  ['tools', 'pages/tools.html', '#toolsTask'],
  ['horary', 'pages/book2/horary.html', '#h-wheel svg'],
  ['vedic', 'pages/vedic/index.html', 'main h1'],
  ['muhurta', 'pages/muhurta.html', 'main h1'],
  ['sigils', 'pages/sigil-studio.html', 'main h1'],
  ['standards', 'pages/standards.html', 'main h1'],
  ['library', 'pages/library/index.html', 'main h1'],
  ['reading', 'pages/yoga/pada1.html', 'main h1'],
  ['dhammapada', 'pages/buddhist/dhammapada.html', '#bud-room .bud-seg'],
  ['heart', 'pages/buddhist/heart.html', '#bud-room .bud-seg'],
  ['anapanasati', 'pages/buddhist/mn118.html', '#bud-room .bud-seg'],
  ['confluence', 'pages/confluence.html', 'main h1'],
];
const selectedRoutes = process.env.SITE_DESIGN_ROUTES?.split(',');
if (selectedRoutes) assert.ok(selectedRoutes.every(name => routes.some(([id]) => id === name)));
const runRoutes = selectedRoutes ? routes.filter(([name]) => selectedRoutes.includes(name)) : routes;
const driver = 'scripts/browser-site-design.mjs';
async function files(directory) {
  const out = [];
  for (const item of await readdir(resolve(root, directory), { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const path = directory + '/' + item.name;
    if (item.isDirectory()) out.push(...await files(path)); else out.push(path);
  }
  return out;
}
async function manifest() {
  const paths = ['index.html', 'docs/LOCAL-LLM.html', 'sw.js', driver, '.design/site-design-coverage.json', ...await files('assets'), ...await files('pages')];
  return Object.fromEntries(await Promise.all(paths.sort().map(async path => [path, sha(await readFile(resolve(root, path)))])));
}
await mkdir(output, { recursive: true });
let prior = false; try { await access(resolve(output, 'receipt.json')); prior = true; } catch {}
assert.ok(!prior, 'Use a fresh SITE_DESIGN_OUTPUT directory; prior evidence is immutable.');
const before = await manifest();
await writeFile(resolve(output, 'driver.mjs'), await readFile(resolve(root, driver)));
const receipt = { schemaVersion: 1, startedAt: new Date().toISOString(), widths, themes, routes: runRoutes.map(([name, path]) => ({ name, path })), checks: [], failures: [], errors: [], missing: [], requestsFailed: [], externalRequests: [], screenshots: [], contrasts: [], source: { beforeSHA256: sha(JSON.stringify(before)) }, limits: { engine: 'Chromium', physicalMobileDevice: false, screenReader: false, humanUsabilityResearch: false, exhaustiveInteractionCoverage: false, contrastScope: 'Representative rendered text and control pairs, excluding SVG labels, images and unresolved gradient backgrounds.' } };
let browser, current = null, origin;
const check = (value, label, detail) => {
  const row = { ...current, label, pass: !!value, ...(detail === undefined ? {} : { detail }) };
  receipt.checks.push(row); if (!value) { receipt.failures.push(row); if (receipt.failures.length <= 12) console.log(JSON.stringify({ failure: row })); }
};
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!path.startsWith(prefix)) { response.writeHead(404); response.end(); return; }
    const local = resolve(root, path.slice(prefix.length) || 'index.html');
    if (!local.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    response.setHeader('Content-Type', mime[extname(local)] || 'application/octet-stream');
    response.end(await readFile(local));
  } catch { response.writeHead(404); response.end(); }
});
async function pageFor(width, storageMode = 'normal', context = browser) {
  const page = await context.newPage();
  await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
  page.on('pageerror', error => receipt.errors.push({ ...current, message: error.message }));
  page.on('console', message => { if (message.type() === 'error') receipt.errors.push({ ...current, message: message.text() }); });
  page.on('response', response => { if (response.status() >= 400) receipt.missing.push({ ...current, status: response.status(), url: response.url() }); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') receipt.requestsFailed.push({ ...current, url: request.url(), error: request.failure()?.errorText }); });
  page.on('request', request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== origin) receipt.externalRequests.push({ ...current, url: request.url() }); });
  await page.evaluateOnNewDocument(({ key, storageMode }) => {
    if (storageMode === 'blocked') {
      const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
      Storage.prototype.getItem = function (name) { if (name === key) throw new DOMException('Storage unavailable', 'SecurityError'); return get.call(this, name); };
      Storage.prototype.setItem = function (name, value) { if (name === key) throw new DOMException('Storage unavailable', 'SecurityError'); return set.call(this, name, value); };
    } else if (storageMode === 'invalid') localStorage.setItem(key, '{"theme":"not-a-theme"}');
    else if (storageMode === 'malformed') localStorage.setItem(key, '{broken');
  }, { key, storageMode });
  return page;
}
async function ready(page, path, selector) {
  await page.goto(origin + prefix + path, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('.appearance-trigger', { timeout: 30000 });
  await page.waitForSelector(selector, { timeout: 60000 });
  if (await page.$('#homeClockMode')) await page.select('#homeClockMode', 'frozen');
  await page.evaluate(() => document.fonts.ready);
}
async function applyTheme(page, theme) {
  await page.click('.appearance-trigger');
  await page.waitForFunction(() => document.querySelector('#site-appearance')?.open);
  await page.click(`[data-appearance-theme="${theme}"]`);
  check(await page.evaluate(theme => document.documentElement.dataset.uiTheme === theme, theme), 'Theme selection applies immediately');
  check(await page.$$eval('#site-appearance [aria-pressed="true"]', elements => elements.length) === 1, 'Exactly one theme button is selected');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#site-appearance')?.open);
  // A theme updates text immediately while inherited button surfaces can have
  // finite background-color transitions. Measure their settled rendered pair.
  await new Promise(resolve => setTimeout(resolve, 250));
  await page.waitForFunction(() => !document.getAnimations().some(animation => animation instanceof CSSTransition && animation.playState === 'running' && Number(animation.effect?.getTiming().duration) <= 1000), { timeout: 2000 });
  check(true, 'Finite theme transitions settle within the bounded interval');
  check(await page.evaluate(() => document.activeElement?.classList.contains('appearance-trigger')), 'Escape restores focus to the Appearance trigger');
}
async function domainSnapshot(page) {
  return page.evaluate(() => ({
    url: location.href,
    inputs: [...document.querySelectorAll('main input,main select,main textarea')].map(element => ({ id: element.id, name: element.name, type: element.type, value: element.value, checked: element.checked, disabled: element.disabled })),
    geometry: [...document.querySelectorAll('main svg [d],main svg [cx],main svg [points],main svg [x1]')].map(element => Object.fromEntries(['d', 'cx', 'cy', 'r', 'points', 'x1', 'x2', 'y1', 'y2', 'transform'].map(name => [name, element.getAttribute(name)]))),
    chartPins: [...document.querySelectorAll('main [data-relation-id][aria-pressed="true"],main [data-sky-relation][aria-pressed="true"]')].map(element => element.dataset.relationId || element.dataset.skyRelation),
  }));
}
async function storageSnapshot(page) {
  return page.evaluate(async key => {
    const pairs = Object.keys(localStorage).filter(name => name !== key).sort().map(name => [name, localStorage.getItem(name)]);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(pairs)));
    return { entryCount: pairs.length, sha256: [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('') };
  }, key);
}
async function staticCoverage() {
  current = { route: 'all-static-routes' };
  // The site contract includes 133 application routes plus this themed local-AI
  // reference document; the coverage ledger deliberately includes all 134.
  const paths = ['index.html', 'docs/LOCAL-LLM.html', ...(await files('pages')).filter(path => path.endsWith('.html'))].sort();
  const coverage = JSON.parse(await readFile(resolve(root, '.design/site-design-coverage.json'), 'utf8'));
  check(JSON.stringify(coverage.map(row => row.path).sort()) === JSON.stringify(paths), 'Family coverage ledger lists every application HTML route exactly once', { actual: paths.length, ledger: coverage.length });
  for (const path of paths) {
    const html = await readFile(resolve(root, path), 'utf8');
    const boots = [...html.matchAll(/<script\b[^>]*\bsrc=["'][^"']*appearance-boot\.js["'][^>]*>\s*<\/script>/gi)];
    const firstStyle = html.search(/<style\b|<link\b[^>]*\brel=["']stylesheet["']/i);
    check(boots.length === 1 && boots[0].index < firstStyle && !/\b(async|defer)\b|\btype=["']module["']/i.test(boots[0][0]), 'One synchronous appearance bootstrap precedes styling: ' + path);
    const css = ['observatory.css', 'site-themes.css', 'site-components.css', 'site-patterns.css'].map(name => html.indexOf(name));
    check(css.every((index, position) => index >= 0 && (position === 0 || index > css[position - 1])), 'Shared shell, theme, component and family styles load in order: ' + path);
    const expected = coverage.find(row => row.path === path)?.family;
    check(!!expected && html.match(/<body\b[^>]*\bdata-page-family=["']([^"']+)["']/i)?.[1] === expected, 'Named page family matches the route ledger: ' + path);
  }
  receipt.staticRoutes = paths.length;
}
async function renderedChecks(page, width) {
  const values = await page.evaluate(() => {
    const visible = element => !!element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
    const textControls = [...document.querySelectorAll('main input:not([type="hidden"]):not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="color"]),main select,main textarea')].filter(visible);
    const savedDateControls = [...document.querySelectorAll('.date-nav-saved-label input[type="checkbox"]')].filter(visible).map(element => ({ label: element.closest('label')?.textContent.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
    const primary = [...document.querySelectorAll('main .btn')].find(visible);
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, tinyControls: textControls.filter(element => parseFloat(getComputedStyle(element).fontSize) < 15.99).map(element => ({ id: element.id, fontSize: getComputedStyle(element).fontSize })), savedDateControls, primary: primary ? { width: primary.getBoundingClientRect().width, height: primary.getBoundingClientRect().height } : null, triggers: document.querySelectorAll('.appearance-trigger').length, dialogs: document.querySelectorAll('#site-appearance').length, families: document.body.dataset.pageFamily };
  });
  check(values.scrollWidth <= values.width + 2, 'No whole-page horizontal overflow', values);
  check(values.triggers === 1 && values.dialogs === 1, 'One Appearance trigger and dialog per route');
  check(values.tinyControls.length === 0, 'Visible text controls remain at least 16px at every tested width', values.tinyControls);
  if (values.savedDateControls.length) check(values.savedDateControls.every(control => control.width >= 43.9 && control.height >= 43.9), 'Visible bookmarked-date filter checkboxes retain 44px square targets', values.savedDateControls);
  if (width <= 680) {
    if (values.primary) check(values.primary.height >= 43.9 && values.primary.width >= 43.9, 'Primary action has a 44px touch target', values.primary);
  }
  const contrasts = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const parse = value => {
      // Modern computed color-mix() values can serialize as color(srgb ...),
      // whose channels are fractions. Normalize through the browser's painter.
      if (!CSS.supports('color', value)) return null;
      context.clearRect(0, 0, 1, 1); context.fillStyle = value; context.fillRect(0, 0, 1, 1);
      const pixel = context.getImageData(0, 0, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2], pixel[3] / 255];
    };
    const blend = (fg, bg) => [...fg.slice(0, 3).map((value, index) => value * fg[3] + bg[index] * (1 - fg[3])), 1];
    const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const selectors = ['header.site .brand b', 'main h1', 'main p', 'main label', 'main input:not([type="hidden"]):not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="color"])', 'main select', 'main .btn', 'main th', 'main td', 'main summary', 'main .callout', 'main .verdict'];
    const results = [];
    for (const selector of selectors) {
      const element = [...document.querySelectorAll(selector)].find(element => element.getClientRects().length && !element.disabled && element.textContent?.trim() !== '');
      if (!element) continue;
      const style = getComputedStyle(element), foreground = parse(style.color); if (!foreground) continue;
      const chain = []; let ancestor = element, gradient = false;
      while (ancestor) { const css = getComputedStyle(ancestor); if (css.backgroundImage !== 'none') gradient = true; chain.unshift(parse(css.backgroundColor) || [0, 0, 0, 0]); ancestor = ancestor.parentElement; }
      let background = [255, 255, 255, 1]; for (const color of chain) background = blend(color, background);
      const composite = blend(foreground, background); const a = luminance(composite), b = luminance(background);
      const size = parseFloat(style.fontSize), bold = parseFloat(style.fontWeight) >= 700, threshold = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
      results.push({ selector, text: element.textContent?.trim().slice(0, 80), color: style.color, background: background.slice(0, 3).map(value => Math.round(value)), contrast: (Math.max(a, b) + .05) / (Math.min(a, b) + .05), fontSize: size, threshold, unresolvedBackgroundImage: gradient });
    }
    return results;
  });
  receipt.contrasts.push(...contrasts.map(value => ({ ...current, ...value })));
  for (const pair of contrasts.filter(value => !value.unresolvedBackgroundImage)) check(pair.contrast >= pair.threshold - .02, 'Rendered contrast: ' + pair.selector, pair);
}
async function chineseInspectorBounds(page) {
  const bounds = await page.evaluate(() => {
    const reading = document.querySelector('#atlas-reading'), wrapper = reading.querySelector('.atlas-table-scroll'), table = wrapper.querySelector('table');
    const readRect = reading.getBoundingClientRect(), wrapRect = wrapper.getBoundingClientRect();
    return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, inspector: { left: readRect.left, right: readRect.right, client: reading.clientWidth, scroll: reading.scrollWidth }, tableRegion: { left: wrapRect.left, right: wrapRect.right, client: wrapper.clientWidth, scroll: wrapper.scrollWidth, overflowX: getComputedStyle(wrapper).overflowX, tabIndex: wrapper.tabIndex }, rows: table.tBodies[0].rows.length, caption: table.caption.textContent, visible: !!table.getClientRects().length && !reading.hidden };
  });
  check(bounds.visible && bounds.rows === 24 && bounds.caption.includes('Asia/Hong_Kong') && bounds.documentWidth <= bounds.viewport + 1 && bounds.inspector.left >= -1 && bounds.inspector.right <= bounds.viewport + 1 && bounds.inspector.scroll <= bounds.inspector.client + 1 && bounds.tableRegion.left >= -1 && bounds.tableRegion.right <= bounds.viewport + 1 && ['auto', 'scroll'].includes(bounds.tableRegion.overflowX) && bounds.tableRegion.tabIndex === 0, 'Chinese single-method inspector retains24 Hong Kong rows inside native viewport bounds with local table scrolling', bounds);
}
async function screenshot(page, name) {
  const filename = name + '.png'; const bytes = await page.screenshot({ path: resolve(output, filename), fullPage: false });
  receipt.screenshots.push({ ...current, filename, bytes: bytes.length, sha256: sha(bytes) });
}
async function preferences() {
  current = { route: 'preference-recovery', width: 390, theme: 'midnight' };
  const page = await pageFor(390);
  try {
    await ready(page, 'pages/tools.html', '#toolsTask');
    await page.focus('.appearance-trigger'); await page.keyboard.press('Enter');
    check(await page.evaluate(() => document.querySelector('#site-appearance').open && document.activeElement?.dataset.appearanceTheme === document.documentElement.dataset.uiTheme), 'Keyboard Enter opens the modal at the current theme');
    for (let step = 0; step < 8; step++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => ({ inside: !!document.activeElement?.closest('#site-appearance'), body: document.activeElement === document.body, tag: document.activeElement?.tagName, documentFocused: document.hasFocus(), modal: document.querySelector('#site-appearance').matches(':modal') }));
      // Native Chromium can expose BODY at the browser-chrome boundary with
      // either document.hasFocus() value. BODY is not a background control;
      // preserve the native :modal invariant and forbid every outside control.
      check(focus.inside || (focus.body && focus.modal), 'Tab never focuses a background control while the native modal is active, step ' + step, focus);
    }
    const inert = await page.evaluate(() => {
      const outside = document.querySelector('.cmdk-btn'); outside.focus();
      return { outsideFocused: document.activeElement === outside, inside: !!document.activeElement?.closest('#site-appearance'), body: document.activeElement === document.body, tag: document.activeElement?.tagName, documentFocused: document.hasFocus(), modal: document.querySelector('#site-appearance').matches(':modal') };
    });
    check(!inert.outsideFocused && inert.modal && (inert.inside || inert.body), 'Native modal prevents programmatic focus of background page controls', inert);
    await page.keyboard.press('Escape');
    await applyTheme(page, 'midnight');
    check(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).theme === 'midnight', key), 'Theme selection stores the bounded preference');
    await ready(page, 'pages/library/index.html', 'main h1');
    check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'midnight'), 'Theme persists across navigation to a nested route');
    await page.reload({ waitUntil: 'networkidle0' });
    check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'midnight'), 'Validated preference survives reload');
    const early = await page.evaluate(async () => { const { initAppearance } = await import(new URL('assets/js/app/appearance.js', new URL('/astrology-sim-ant/', location.origin))); initAppearance(); return [document.querySelectorAll('.appearance-trigger').length, document.querySelectorAll('#site-appearance').length]; });
    check(early[0] === 1 && early[1] === 1, 'Repeated Appearance initialization is idempotent');
    await page.evaluate(key => window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify({ theme: 'mineral' }) })), key);
    check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'mineral'), 'A valid cross-tab theme update is reflected');
    await page.evaluate(key => window.dispatchEvent(new StorageEvent('storage', { key, newValue: '{broken' })), key);
    check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'mineral'), 'A malformed cross-tab record cannot corrupt the active theme');
    await page.evaluate(key => window.dispatchEvent(new StorageEvent('storage', { key, newValue: null })), key);
    check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'midnight'), 'Removing the cross-tab preference restores the black default');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await applyTheme(page, 'mineral'); await page.click('.appearance-trigger'); await screenshot(page, 'appearance-390-mineral'); await page.keyboard.press('Escape');
    // CSS zoom is an explicit additional layout stressor, not a claim of testing
    // browser/OS zoom or a physical mobile device.
    await page.setViewport({ width: 640, height: 1000, deviceScaleFactor: 1 });
    await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
    await page.click('.appearance-trigger');
    const zoom = await page.$eval('#site-appearance', element => { const bounds = element.getBoundingClientRect(); return { left: bounds.left, right: bounds.right, width: innerWidth, scrollWidth: document.documentElement.scrollWidth }; });
    check(zoom.left >= -1 && zoom.right <= zoom.width + 1 && zoom.scrollWidth <= zoom.width + 2, 'Appearance remains within the viewport at CSS zoom 2', zoom);
    await page.keyboard.press('Escape');
    check(await page.evaluate(() => document.activeElement?.classList.contains('appearance-trigger')), 'CSS zoom stress preserves Escape focus restoration');
    await page.evaluate(() => { document.documentElement.style.removeProperty('zoom'); });
    await page.setViewport({ width: 390, height: 1000, deviceScaleFactor: 1 });
    const cdp = await page.createCDPSession();
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    await page.bringToFront();
    await page.focus('.appearance-trigger'); await page.keyboard.press('Enter');
    // Test actual Tab navigation, rather than the dialog's programmatic initial
    // focus. Native browser chrome can be an intermediate stop in this cycle.
    let forcedColorTabs = 0;
    do { await page.keyboard.press('Tab'); forcedColorTabs++; }
    while (forcedColorTabs < 6 && !await page.evaluate(() => !!document.activeElement?.matches('[data-appearance-theme]')));
    // Chromium145 can expose outline-width:0 until its next forced-media style
    // paint. Wait for the same visible-focus contract; never lower its threshold.
    await page.waitForFunction(() => { const focused = document.activeElement, style = getComputedStyle(focused); return matchMedia('(forced-colors: active)').matches && focused.matches('[data-appearance-theme]:focus-visible') && !!focused.closest('#site-appearance') && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2; }, { timeout: 2000, polling: 50 });
    const forcedFocus = await page.evaluate(() => { const focused = document.activeElement, style = getComputedStyle(focused); return { forced: matchMedia('(forced-colors: active)').matches, themeControl: focused.matches('[data-appearance-theme]:focus-visible'), inside: !!focused.closest('#site-appearance'), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth }; });
    check(forcedFocus.forced && forcedFocus.themeControl && forcedFocus.inside && forcedFocus.outlineStyle !== 'none' && parseFloat(forcedFocus.outlineWidth) >= 2, 'Forced-color emulation retains an outlined keyboard-focused theme control', { ...forcedFocus, keyboardTabs: forcedColorTabs });
    await page.keyboard.press('Escape'); await cdp.send('Emulation.setEmulatedMedia', { features: [] }); await cdp.detach();
    await page.emulateMediaType('print');
    check(await page.$eval('.appearance-trigger', element => getComputedStyle(element).display) === 'none', 'Appearance controls are absent from print');
  } finally { await page.close(); }
  for (const mode of ['invalid', 'malformed', 'blocked']) {
    current = { route: 'storage-' + mode, width: 320, theme: 'midnight' };
    const page = await pageFor(320, mode);
    try {
      await ready(page, 'pages/tools.html', '#toolsTask');
      check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'midnight'), 'Invalid or unavailable storage has the black default');
      await applyTheme(page, 'midnight');
      check(await page.evaluate(() => document.documentElement.dataset.uiTheme === 'midnight'), 'Theme controls still work with ' + mode + ' storage');
      if (mode === 'blocked') check(await page.$eval('.appearance-note', element => element.textContent.includes('unavailable')), 'Storage failure is explained without discarding the selected theme');
    } finally { await page.close(); }
  }
  current = { route: 'persisted-navigation', width: 390, theme: 'midnight' };
  const persisted = await browser.createBrowserContext(); const navigationPage = await pageFor(390, 'normal', persisted);
  try {
    await ready(navigationPage, 'index.html', '#homeSummary:not([aria-busy="true"])'); await applyTheme(navigationPage, 'midnight');
    for (const path of ['pages/calendar-atlas.html', 'pages/calendars/western.html', 'pages/mcp.html', 'pages/eschatology-atlas.html']) {
      await ready(navigationPage, path, 'main h1');
      const state = await navigationPage.evaluate(() => ({ theme: document.documentElement.dataset.uiTheme, modalOpen: document.querySelector('#site-appearance').open, pressed: document.querySelector('[data-appearance-theme="midnight"]').getAttribute('aria-pressed') }));
      check(state.theme === 'midnight' && !state.modalOpen && state.pressed === 'true', 'Persisted midnight reaches ' + path + ' before opening Appearance', state);
    }
  } finally { await navigationPage.close(); await persisted.close(); }
}
try {
  await staticCoverage();
  if (receipt.failures.length) throw new Error('Static theme coverage failed before browser execution.');
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); origin = 'http://127.0.0.1:' + server.address().port;
  const puppeteer = (await import(pathToFileURL(resolve(process.env.PUPPETEER_PKG || '/workspace/astrology-browser-tools/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js')).href)).default;
  browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  receipt.browser = await browser.version();
  // Exercise the newly introduced control contract first. A failing preference
  // case must not consume another complete page-family matrix.
  if (!selectedRoutes) {
    await preferences();
    if (receipt.failures.length) throw new Error('Appearance preference acceptance failed before the page-family matrix.');
    console.log(JSON.stringify({ stage: 'preference-acceptance', pass: true, checks: receipt.checks.length }));
  }
  for (const [name, path, selector] of runRoutes) for (const width of widths) {
    current = { route: name, width, theme: 'midnight' };
    const context = await browser.createBrowserContext();
    // An isolated context prevents preferences from a prior route concealing a bootstrap bug.
    let candidate;
    try {
      candidate = await pageFor(width, 'normal', context); await ready(candidate, path, selector);
      if (name === 'atlas' && await candidate.$('#sky-relationships .cr-entry')) await candidate.click('#sky-relationships .cr-entry');
      if (name === 'chinese') {
        await candidate.select('#atlas-view', 'single');
        await candidate.select('#atlas-single', 'chinese-solar-terms');
        await candidate.waitForFunction(() => {
          const reading = document.querySelector('#atlas-reading'), table = reading?.querySelector('.atlas-table-scroll table');
          return !reading?.hidden && table?.tBodies[0]?.rows.length === 24 && table.caption?.textContent.includes('Asia/Hong_Kong') && !!table.getClientRects().length;
        }, { timeout: 60000 });
      }
      const held = await domainSnapshot(candidate);
      await candidate.evaluate(() => localStorage.setItem('site-design:unrelated-sentinel', 'UNRELATED_STUDY_STATE_SENTINEL'));
      const heldStorage = await storageSnapshot(candidate);
      await candidate.evaluate(() => { window.__appearanceDomainEvents = 0; for (const type of ['input', 'change', 'submit']) document.querySelector('main').addEventListener(type, () => window.__appearanceDomainEvents++); });
      for (const theme of themes) {
        current = { route: name, width, theme }; await applyTheme(candidate, theme); await renderedChecks(candidate, width);
        if (name === 'chinese') await chineseInspectorBounds(candidate);
        check(JSON.stringify(await domainSnapshot(candidate)) === JSON.stringify(held), 'Theme change preserves input values, chart geometry, pair pins and URL');
        check(await candidate.evaluate(() => window.__appearanceDomainEvents) === 0, 'Theme change emits no calculator input/change/submit events');
        const afterStorage = await storageSnapshot(candidate);
        check(JSON.stringify(afterStorage) === JSON.stringify(heldStorage), 'Theme change preserves all unrelated browser storage entries', afterStorage);
        if ((name === 'home' && width === 390) || (name === 'atlas' && width === 1440) || (name === 'tools' && width === 320) || (name === 'library' && width === 1440)) {
          await candidate.evaluate(() => scrollTo(0, 0)); await screenshot(candidate, `${name}-${width}-${theme}`);
        }
        if (['dhammapada', 'heart', 'anapanasati'].includes(name) && width === 320 && theme === 'midnight') {
          await candidate.evaluate(() => [...document.querySelectorAll('.bud-line .bud-w')].sort((left, right) => right.textContent.length - left.textContent.length)[0]?.scrollIntoView({ block: 'center', behavior: 'instant' }));
          await candidate.mouse.move(0, 0);
          await screenshot(candidate, `${name}-320-midnight-reading`);
        }
        if (name === 'chinese' && width === 320 && theme === 'midnight') {
          await candidate.focus('#atlas-reading .atlas-table-scroll');
          await candidate.evaluate(() => { const target = document.querySelector('#atlas-reading .atlas-table-scroll'), header = document.querySelector('header.site'); scrollTo({ top: scrollY + target.getBoundingClientRect().top - header.getBoundingClientRect().height - 16, behavior: 'instant' }); });
          await screenshot(candidate, 'chinese-320-midnight-inspector');
        }
      }
    } catch (error) { receipt.failures.push({ ...current, label: 'Journey execution', message: error.message, stack: error.stack }); }
    finally { await candidate?.close(); await context.close(); console.log(JSON.stringify({ journey: name, width, checks: receipt.checks.length, failures: receipt.failures.length })); }
  }
} catch (error) { receipt.failures.push({ label: 'Harness execution', message: error.message, stack: error.stack }); }
finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
  const after = await manifest(); receipt.source.afterSHA256 = sha(JSON.stringify(after));
  receipt.source.changedFiles = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(path => before[path] !== after[path]);
  for (const [label, rows] of [['Runtime/console errors', receipt.errors], ['Missing responses', receipt.missing], ['Failed requests', receipt.requestsFailed], ['Unexpected external requests', receipt.externalRequests]]) if (rows.length) receipt.failures.push({ label, detail: rows });
  if (receipt.source.changedFiles.length) receipt.failures.push({ label: 'Source or driver changed during verification', detail: receipt.source.changedFiles });
  receipt.pass = receipt.failures.length === 0; receipt.acceptanceEligible = receipt.pass && !receipt.source.changedFiles.length;
  receipt.checkCount = receipt.checks.length; receipt.completedAt = new Date().toISOString();
  await writeFile(resolve(output, 'source-before.json'), JSON.stringify(before, null, 2) + '\n');
  await writeFile(resolve(output, 'source-after.json'), JSON.stringify(after, null, 2) + '\n');
  await writeFile(resolve(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify({ pass: receipt.pass, acceptanceEligible: receipt.acceptanceEligible, checks: receipt.checkCount, failures: receipt.failures.length, screenshots: receipt.screenshots.length, receipt: resolve(output, 'receipt.json') }, null, 2));
  if (!receipt.pass) process.exitCode = 1;
}
