// Independent, bounded browser acceptance for shared date navigation and its pages.
// Fixtures exercise hostile/long input and storage failures; page journeys use real
// canonical calculations. Results bind exact product and driver bytes.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.env.DATE_NAV_OUTPUT || 'test-results/date-wayfinding');
const widths = (process.env.DATE_NAV_WIDTHS || '320,390,1440,1920').split(',').map(Number);
assert.ok(widths.every(w => Number.isInteger(w) && w >= 320 && w <= 2560));
const pageWidths = (process.env.DATE_NAV_PAGE_WIDTHS || '390,1440').split(',').map(Number);
assert.ok(pageWidths.every(w => Number.isInteger(w) && w >= 320 && w <= 2560));
const key = 'workbench.date-wayfinding.bookmarks.v1';
const sentinel = 'DATE_NAV_PRIVATE_SENTINEL_20261030';
const sha = value => createHash('sha256').update(value).digest('hex');
async function files(dir) { const out = []; for (const e of await readdir(resolve(root, dir), { withFileTypes: true })) { if (e.name.startsWith('.') || e.name === 'node_modules') continue; const p = dir + '/' + e.name; if (e.isDirectory()) out.push(...await files(p)); else out.push(p); } return out; }
async function product() { return Object.fromEntries(await Promise.all(['index.html', 'sw.js', ...await files('assets'), ...await files('pages')].sort().map(async p => [p, sha(await readFile(resolve(root, p)))]))); }
await mkdir(output, { recursive: true });
const driver = await readFile(fileURLToPath(import.meta.url));
await writeFile(resolve(output, 'driver.mjs'), driver);
const before = await product();
const receipt = { schemaVersion: 1, startedAt: new Date().toISOString(), round: process.env.DATE_NAV_ROUND || 'candidate', environment: { node: process.version, platform: process.platform, icu: process.versions.icu }, checks: [], failures: [], screenshots: [], screenshotFiles: [], downloads: [], errors: [], missing: [], externalRequests: [], source: { productAtStartSHA256: sha(JSON.stringify(before)), driverAtStartSHA256: sha(driver) }, limits: { physicalTouchDevice: false, screenReader: false, humanUsabilityResearch: false, historicalSourceTruth: false, historicalTimezoneValidation: false } };
let currentJourney = null;
const check = (value, label, detail) => { receipt.checks.push({ label, ...currentJourney, pass: !!value, ...(detail === undefined ? {} : { detail }) }); assert.ok(value, label + (detail === undefined ? '' : ': ' + JSON.stringify(detail))); };
const prefix = '/astrology-sim-ant/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/plain', '.woff2': 'font/woff2' };
const fixture = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Date navigation acceptance fixture</title><link rel="stylesheet" href="assets/css/date-wayfinding.css"><style>*{box-sizing:border-box}body{margin:0;padding:16px;background:#f6f1e7;color:#263b36;font:16px Arial,sans-serif}main{max-width:1120px;margin:auto}section{margin-block:24px}button,input,summary{font:inherit}button{min-height:44px}h1{font-size:1.3rem}</style><main><h1>QA fixture · real shared component</h1><button id="outside">Outside the component</button><button id="preview-a">Preview A</button><button id="preview-b">Preview B</button><section id="fixture-a"></section><section id="fixture-b"></section><section id="fixture-empty"></section><p id="selection" role="status"></p></main><script type="module">
import { mountDateNavigator } from './assets/js/app/date-wayfinding.js';
const kinds=['astronomy','neutral','traditional-favorable','traditional-caution','mixed','historical-conflict','source-claim','unavailable'];
const items=Array.from({length:400},(_,i)=>({id:'record-'+i,date:new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),label:i===0?'Long source title: <img src=x onerror="window.__injected=true"> '+ 'qualified historical date and source '.repeat(8):'Source record '+i,kind:kinds[i%kinds.length],summary:'Named source context only; no outcome prediction.',details:[{label:'Precision',value:'Day precision; event clock unknown'},{label:'Scope',value:'An explicit public reference; private births excluded'}],sourceLabel:'QA fixture source'}));
window.__fixtureItems=items;window.__fixtureSelections=[];
window.__fixtureA=mountDateNavigator(document.getElementById('fixture-a'),{id:'fixture-a',label:'Dense source dates with long labels',items,bookmarkScope:'qa-scope-a',onSelect:item=>{window.__fixtureSelections.push(item.id);document.getElementById('selection').textContent=item.id;}});
window.__fixtureB=mountDateNavigator(document.getElementById('fixture-b'),{id:'fixture-b',label:'Same date in another scope',items:items.slice(0,2),bookmarkScope:'qa-scope-b'});
window.__fixtureEmpty=mountDateNavigator(document.getElementById('fixture-empty'),{id:'fixture-empty',label:'Empty source collection',items:[],bookmarkScope:'qa-empty',emptyMessage:'No documented dates in this filter.'});
for(const [id,navigator,entry] of [['preview-a',window.__fixtureA,'record-25'],['preview-b',window.__fixtureB,'record-1']]){const anchor=document.getElementById(id);anchor.addEventListener('pointerenter',()=>navigator.preview(entry,{anchor}));anchor.addEventListener('focus',()=>navigator.preview(entry,{anchor}));anchor.addEventListener('click',()=>navigator.preview(entry,{anchor,pin:true}));}
window.__fixtureReady=true;
</script></html>`;
const server = createServer(async (req, res) => { try { const u = new URL(req.url, 'http://localhost'); if (!u.pathname.startsWith(prefix)) return res.writeHead(404).end(); let rel = decodeURIComponent(u.pathname.slice(prefix.length)); if (rel === '__date-wayfinding-test.html') return res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }).end(fixture); if (!rel || rel.endsWith('/')) rel += 'index.html'; const path = resolve(root, rel); if (!path.startsWith(root + sep) || rel.split('/').some(p => p.startsWith('.'))) return res.writeHead(403).end(); const body = await readFile(path); res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body); } catch { res.writeHead(404).end('Not found'); } });
let browser, origin, base;
async function context(width, options = {}) {
  const c = await browser.newContext({ viewport: { width, height: 900 }, locale: 'en-US', reducedMotion: 'reduce', serviceWorkers: 'block', acceptDownloads: true, hasTouch: !!options.touch });
  await c.route('**/*', route => { const u = new URL(route.request().url()); if (u.origin === origin || ['data:', 'blob:'].includes(u.protocol)) return route.continue(); receipt.externalRequests.push(u.href); return route.abort('blockedbyclient'); });
  await c.addInitScript(({ sentinel, key, storage }) => {
    const privateKeys = ['birthProfile', 'wb-persons', 'wb-saved-readings', 'privateNotes', 'providerKey'];
    for (const k of privateKeys) localStorage.setItem(k, sentinel);
    if (storage === 'corrupt') localStorage.setItem(key, '{malformed');
    window.__qa = { privateReads: [], writes: [], permissions: 0 };
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (k) { if (privateKeys.includes(k)) window.__qa.privateReads.push(k); if (storage === 'unavailable' && k === key) throw new DOMException('Storage blocked', 'SecurityError'); return get.call(this, k); };
    Storage.prototype.setItem = function (k, v) { window.__qa.writes.push({ key: k, value: String(v) }); if (storage === 'unavailable' && k === key) throw new DOMException('Storage blocked', 'QuotaExceededError'); return set.call(this, k, v); };
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition: () => { window.__qa.permissions++; } } });
  }, { sentinel, key, storage: options.storage });
  const page = await c.newPage(); page.setDefaultTimeout(25000);
  page.on('pageerror', e => receipt.errors.push({ width, url: page.url(), message: e.message }));
  page.on('console', m => { if (m.type() === 'error') receipt.errors.push({ width, url: page.url(), message: m.text() }); });
  page.on('response', r => { if (r.status() >= 400) receipt.missing.push({ width, url: r.url(), status: r.status() }); });
  return { c, page };
}
async function shot(page, label, selector) { if (selector) await page.locator(selector).first().scrollIntoViewIfNeeded(); const filename = (currentJourney?.journey ? currentJourney.journey + '-' : '') + label + '.png'; await page.screenshot({ path: resolve(output, filename), timeout: 10000 }); receipt.screenshots.push(filename); const bytes=await readFile(resolve(output,filename)); receipt.screenshotFiles.push({filename,bytes:bytes.length,sha256:sha(bytes),viewport:page.viewportSize()}); }
async function journey(label, width, fn, options) {
  console.log('Journey: ' + label); currentJourney = { journey: label, viewport: width }; const { c, page } = await context(width, options); let deadline;
  try { await Promise.race([fn(page), new Promise((_, reject) => { deadline = setTimeout(() => reject(new Error('Journey exceeded the explicit 90-second browser budget')), 90000); })]); }
  catch (error) { receipt.failures.push({ label, message: error.message, stack: error.stack }); console.log('Failed: ' + label + ' · ' + error.message.split('\n')[0]); await shot(page, 'failure-' + label).catch(() => {}); }
  finally { clearTimeout(deadline); await c.close(); await writeFile(resolve(output, 'progress.json'), JSON.stringify({ completedJourney: label, checks: receipt.checks, failures: receipt.failures }, null, 2)); }
}
async function privacy(page, label, allowBookmarks = false) { const q = await page.evaluate(() => window.__qa); check(!q.privateReads.length, label + ' does not read private saved births or notes', q.privateReads); check(q.permissions === 0, label + ' never requests geolocation'); check(allowBookmarks ? q.writes.every(w => w.key === key && !w.value.includes(sentinel)) : !q.writes.length, label + ' persistence requires an explicit bookmark action', q.writes); }
async function layout(page, label) { const m = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, navs: [...document.querySelectorAll('.date-nav')].filter(e => e.getClientRects().length).map(e => ({ id: e.dataset.dateNavigator, width: e.getBoundingClientRect().width, scroll: e.scrollWidth, client: e.clientWidth })), controls: [...document.querySelectorAll('.date-nav button,.date-nav input:not([type=checkbox]),.date-nav summary,.date-nav-saved-label')].filter(e => e.getClientRects().length).map(e => ({ text: e.getAttribute('aria-label') || e.textContent.slice(0,80), width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })) })); check(m.scroll <= m.width + 1, label + ' document fits viewport', m); check(m.navs.every(n => n.scroll <= n.client + 2), label + ' date components do not clip horizontally', m.navs); check(m.controls.every(c => c.height >= 43), label + ' date controls provide 44px vertical targets', m.controls); }
async function actualDownload(page, selector, label) { const waiting = page.waitForEvent('download'); await page.locator(selector).click(); const item = await waiting; check(await item.failure() === null, label + ' download completes'); const bytes = await readFile(await item.path()); check(bytes.length > 40 && !bytes.includes(Buffer.from(sentinel)), label + ' contains data and excludes private storage'); const filename = 'download-' + String(receipt.downloads.length + 1).padStart(2,'0') + '-' + item.suggestedFilename(); await writeFile(resolve(output, filename), bytes); receipt.downloads.push({ label, filename, bytes: bytes.length, sha256: sha(bytes) }); return bytes; }
async function outerScroll(page) { const moved = await page.evaluate(async () => { const before = scrollY; scrollBy(0, before > 24 ? -24 : 24); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); return scrollY !== before; }); check(moved, 'regression performs an actual outer-page scroll'); }
async function fixtureReady(page) { await page.goto(base + '__date-wayfinding-test.html'); await page.waitForFunction(() => window.__fixtureReady); }
async function card(nav) { return nav.page().locator('#' + await nav.locator('.date-nav-selected').getAttribute('aria-controls')); }
async function openCard(nav) { const button = nav.locator('.date-nav-selected'), targetId = await button.getAttribute('aria-controls'), visible = nav.page().locator('.date-nav-popover:visible'); if (await visible.count() && await visible.first().getAttribute('id') !== targetId) await nav.page().keyboard.press('Escape'); await button.click(); await (await card(nav)).waitFor({ state: 'visible' }); }

async function fixtureJourney(page, width) {
  await fixtureReady(page); const nav = page.locator('#fixture-a .date-nav'), second = page.locator('#fixture-b .date-nav');
  await privacy(page, 'fixture initial ' + width); await layout(page, 'long/dense/empty ' + width);
  check(await page.locator('#fixture-empty').innerText().then(s => s.includes('No documented dates')), 'empty collection has an explicit message ' + width);
  check(!await page.evaluate(() => window.__injected) && await nav.locator('img').count() === 0, 'untrusted source text cannot become markup ' + width);
  const slider = nav.locator('.date-nav-slider'); await slider.focus(); await page.keyboard.press('End'); check(await slider.inputValue() === '399', 'native End selects final source ' + width); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight'); check(await slider.inputValue() === '1', 'native Home and ArrowRight select one source ' + width); check(await slider.getAttribute('aria-valuetext'), 'native slider exposes a meaningful value ' + width);
  await page.keyboard.press('Home'); const selected = nav.locator('.date-nav-selected'), popover = await card(nav);
  await nav.locator('.date-nav-list > summary').click(); await nav.locator('.date-nav-list-item').first().waitFor(); check(await nav.locator('.date-nav-list-item').count() === 12, 'dense source list renders a bounded page ' + width); await nav.locator('.date-nav-list-next').click(); check(await nav.locator('.date-nav-list-item').first().getAttribute('data-index') === '12', 'list pagination reaches next source records ' + width); await nav.locator('.date-nav-search').fill('Source record 399'); check(await nav.locator('.date-nav-list-item').count() === 1 && await nav.locator('.date-nav-list-item').getAttribute('data-index') === '399', 'dense source search reaches final source ' + width); await nav.locator('.date-nav-search').fill('nonexistent source filter'); check(await nav.locator('.date-nav-list-item').count() === 0 && (await nav.locator('.date-nav-list-message').innerText()).includes('No dates'), 'list search has honest empty state ' + width); await nav.locator('.date-nav-search').fill(''); await nav.locator('.date-nav-list > summary').click();
  await selected.focus(); await popover.waitFor({ state: 'visible' }); check(await selected.getAttribute('aria-expanded') === 'true', 'focus reveals card and expanded state ' + width);
  await page.keyboard.press('Escape'); check(await popover.isHidden() && await selected.evaluate(e => e === document.activeElement), 'Escape dismisses and returns focus ' + width);
  await page.locator('#outside').focus(); await selected.hover(); await popover.waitFor({ state: 'visible' });
  const geometry = await popover.evaluate(el => { const anchor=document.querySelector('#fixture-a .date-nav-selected').getBoundingClientRect(), card=el.getBoundingClientRect(); return { anchor:anchor.toJSON(), card:card.toJSON(), width:innerWidth, height:innerHeight }; });
  check(geometry.card.left >= 0 && geometry.card.right <= geometry.width && geometry.card.top >= 0 && geometry.card.bottom <= geometry.height, 'long card is placed within the viewport ' + width, geometry);
  check(geometry.card.bottom <= geometry.anchor.top || geometry.card.top >= geometry.anchor.bottom, 'long card leaves its trigger visible and clickable ' + width, geometry);
  await outerScroll(page); check(await popover.isHidden(), 'passive hover card dismisses on outer scroll ' + width);
  await page.mouse.move(0, 0); await selected.hover(); await popover.waitFor({ state: 'visible' });
  await popover.locator('.date-nav-close').focus(); await outerScroll(page); check(await popover.isVisible() && await popover.locator('.date-nav-close').evaluate(e => e === document.activeElement), 'outer scroll preserves an unpinned card with focus inside it ' + width);
  await page.keyboard.press('Escape'); await page.locator('#outside').focus(); await page.mouse.move(0, 0); await selected.hover(); await popover.waitFor({ state: 'visible' });
  await selected.click(); check(await (await card(nav)).locator('.date-nav-close').evaluate(e => e === document.activeElement), 'click after hover pins the long card and focuses Close ' + width);
  await outerScroll(page); check(await popover.isVisible() && await popover.locator('.date-nav-close').evaluate(e => e === document.activeElement), 'outer scroll preserves a pinned card and its focused control ' + width);
  if (width === 320) { const inner = await popover.evaluate(async e => { const available = e.scrollHeight - e.clientHeight; e.scrollTop = Math.min(32, available); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); return { available, scrolled: e.scrollTop }; }); check(inner.available > 0 && inner.scrolled > 0 && await popover.isVisible(), 'inner scrolling retains the long pinned card and actual scroll position', inner); await popover.evaluate(e => { e.scrollTop = 0; }); }
  await popover.hover(); await page.waitForTimeout(250); check(await popover.isVisible(), 'hover card remains open while pointer enters it ' + width); await selected.focus(); await page.keyboard.press('Escape');
  await openCard(nav); await shot(page, 'fixture-card-' + width, '#fixture-a'); await layout(page, 'open long card ' + width);
  await (await card(nav)).locator('.date-nav-bookmark').focus(); await page.keyboard.press('Escape'); check(await popover.isHidden() && await selected.evaluate(e => e === document.activeElement), 'Escape from inside card closes and returns focus ' + width); await openCard(nav);
  await (await card(nav)).locator('.date-nav-bookmark').click(); let saved = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)); check(saved.entries.length === 1 && saved.entries[0].scope === 'qa-scope-a', 'bookmark belongs only to explicit scope ' + width); check(Object.keys(saved.entries[0]).sort().join(',') === 'date,id,kind,scope', 'saved bookmark contains only allowlisted references ' + width); check(!JSON.stringify(saved).includes('Long source') && !JSON.stringify(saved).includes(sentinel), 'bookmark omits text and private metadata ' + width);
  await page.reload(); await page.waitForFunction(() => window.__fixtureReady); await openCard(page.locator('#fixture-a .date-nav')); check(await (await card(page.locator('#fixture-a .date-nav'))).locator('.date-nav-bookmark').getAttribute('aria-pressed') === 'true', 'bookmark survives reload ' + width); await openCard(second); check(await (await card(second)).locator('.date-nav-bookmark').getAttribute('aria-pressed') !== 'true', 'same record is unsaved in another scope ' + width); await page.keyboard.press('Escape'); await openCard(nav); await (await card(nav)).locator('.date-nav-bookmark').click(); saved = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)); check(saved.entries.length === 0, 'explicit remove deletes only saved reference ' + width); await privacy(page, 'fixture final ' + width, true);
  await (await card(nav)).locator('.date-nav-bookmark').click(); await page.keyboard.press('Escape'); await openCard(second); await (await card(second)).locator('.date-nav-bookmark').click(); await page.keyboard.press('Escape');
  const manager = page.locator('#fixture-empty .date-nav'); await manager.locator('.date-nav-list > summary').click(); await manager.locator('.date-nav-manager > summary').click(); await manager.locator('.date-nav-remove-bookmark').first().waitFor(); check(await manager.locator('.date-nav-remove-bookmark').count() === 2, 'manager exposes saved references across scopes ' + width); await manager.locator('.date-nav-remove-bookmark').first().click(); saved = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)); check(saved.entries.length === 1 && saved.entries[0].scope === 'qa-scope-b', 'manager removes selected scope without deleting another bookmark ' + width); await manager.locator('.date-nav-remove-bookmark').click(); check(JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)).entries.length === 0, 'manager can clear a reference outside the current date filter ' + width); await manager.locator('.date-nav-list > summary').click();
  await page.locator('#preview-a').focus(); await outerScroll(page); check(await popover.isVisible() && await page.locator('#preview-a').evaluate(e => e === document.activeElement), 'outer scroll preserves a keyboard-focused unpinned card ' + width); await page.locator('#preview-b').hover(); check(await popover.isVisible() && await popover.locator('.date-nav-popover-title').innerText() === 'Source record 25', 'neighbor hover cannot replace a keyboard-focused unpinned card ' + width); await page.locator('#preview-b').focus(); check(await (await card(second)).isVisible(), 'intentional keyboard focus can select another unpinned preview ' + width); await page.keyboard.press('Escape');
  await page.locator('#preview-a').click(); await page.locator('#preview-b').hover(); check(await popover.isVisible() && await popover.locator('.date-nav-popover-title').innerText() === 'Source record 25' && await (await card(second)).isHidden(), 'neighbor in another navigator cannot replace a pinned card ' + width);
  await popover.locator('.date-nav-bookmark').click(); saved = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)); check(saved.entries.length === 1 && saved.entries[0].id === 'record-25' && saved.entries[0].scope === 'qa-scope-a', 'neighbor hover cannot change the bookmarked reference ' + width); await page.keyboard.press('Escape'); check(await page.locator('#preview-a').evaluate(e => e === document.activeElement), 'cross-navigator hover preserves original Escape anchor ' + width);
  await page.evaluate(() => window.__fixtureA.update({ disabled: true })); check(await slider.isDisabled() && await nav.locator('.date-nav-prev').isDisabled() && await nav.locator('.date-nav-next').isDisabled(), 'stale component disables navigation ' + width);
  if (width === 1440) { await page.evaluate(() => { document.documentElement.style.zoom = '2'; }); await layout(page, '200 percent zoom'); await shot(page, 'fixture-zoom'); }
}

async function storageJourney(page, mode) { await fixtureReady(page); const nav = page.locator('#fixture-a .date-nav'); await privacy(page, mode + ' startup'); check((await nav.innerText()).match(/storage|saved|browser|bookmark|unavailable|recover|corrupt/i), mode + ' storage status is visible'); await openCard(nav); await (await card(nav)).locator('.date-nav-bookmark').click(); check(await (await card(nav)).locator('.date-nav-bookmark').getAttribute('aria-pressed') === 'true', mode + ' explicit action retains current-session bookmark'); await (await card(nav)).locator('.date-nav-bookmark').click(); check(await (await card(nav)).locator('.date-nav-bookmark').getAttribute('aria-pressed') === 'false', mode + ' current-session remove remains usable'); await privacy(page, mode + ' after action', true); await shot(page, 'fixture-storage-' + mode, '#fixture-a'); }

async function timelineJourney(page) {
  await page.goto(base + 'pages/calendar-timeline.html'); await page.waitForFunction(() => document.querySelector('main.calendar-timeline')?.dataset.state === 'ready');
  check(await page.locator('.date-nav').count() > 0, 'timeline exposes shared date navigator'); await privacy(page, 'timeline initial');
  const all = page.locator('#ct-output .date-nav-slider').filter({ hasNot: page.locator('#ct-date-highlights') }); check(await all.count() >= 13, 'calendar methods expose linked native sliders');
  const slider = page.locator('.ct-calendar-dates .date-nav-slider').first(); await slider.focus(); await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => document.querySelector('main.calendar-timeline')?.dataset.state === 'ready'); check(await slider.evaluate(e => e === document.activeElement), 'calendar lane restores focus after its canonical rebuild'); await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => document.querySelector('main.calendar-timeline')?.dataset.state === 'ready'); check(await slider.inputValue() === '2', 'consecutive keyboard steps stay in the calendar lane');
  const tags = await page.locator('[data-date-iso]').evaluateAll(els => els.map(e => e.dataset.dateIso).filter(Boolean)); check(tags.length >= 3 && new Set(tags).size === 1, 'calendar-lane keyboard step updates every linked instrument to one UTC instant', tags);
  const values = await page.locator('.ct-calendar-dates .date-nav-slider,#ct-tropical-dates .date-nav-slider,#ct-sidereal-dates .date-nav-slider').evaluateAll(els => els.map(e => e.value)); check(new Set(values).size === 1, 'all calendar-lane sliders share one date index', values);
  const bytes = await actualDownload(page, '#ct-json', 'timeline selected linked date JSON'); const data = JSON.parse(bytes); check(tags[0] === data.context.dateISO, 'actual timeline export retains selected instrument instant');
  await shot(page, 'timeline-linked-' + page.viewportSize().width, '#ct-calendars'); await layout(page, 'timeline ' + page.viewportSize().width);
  await page.locator('#ct-settings').evaluate(e => e.open = true); await page.locator('#ct-time').fill('13:14:15'); check(await page.locator('#ct-json').isDisabled() && await page.locator('#ct-output').isHidden(), 'editing clock invalidates linked results and downloads');
}

async function countriesJourney(page) {
  await page.goto(base + 'pages/country-calendars.html'); await page.locator('#cr-country-tabs [role=tab]').first().waitFor(); const countries = await page.locator('#cr-country-tabs [role=tab]').evaluateAll(els => els.map(e => ({ id: e.id, label: e.textContent })));
  check(countries.length === 7, 'all seven country views remain reachable');
  for (const country of countries) { await page.locator('#' + country.id).click(); await page.waitForFunction(() => !document.getElementById('cr-download').disabled); check((await page.locator('#cr-country-context').innerText()).includes(country.label), 'country context follows tab ' + country.label); check(await page.locator('#cr-country-panel .date-nav').count() > 0, 'country date navigation exists ' + country.label); await page.locator('#cr-event-type').selectOption('war'); await page.waitForFunction(() => !document.getElementById('cr-download').disabled); check(/date-only/i.test(await page.locator('#cr-source-record').innerText()), 'conflict selection preserves source-only precision ' + country.label); await page.locator('#cr-event-type').selectOption('election'); await page.waitForFunction(() => !document.getElementById('cr-download').disabled); await page.locator('#cr-event-type').selectOption('all'); }
  await page.waitForFunction(() => !document.getElementById('cr-download').disabled); const bytes = await actualDownload(page, '#cr-download', 'country accepted source sample JSON'); const data = JSON.parse(bytes); check(!!data.record && !!data.marker, 'country download retains source record separately from sample'); await layout(page, 'all-country navigation ' + page.viewportSize().width); await privacy(page, 'country navigation'); await shot(page, 'country-view-' + page.viewportSize().width, '#cr-date-navigator');
  const nav = page.locator('#cr-date-navigator .date-nav'); await openCard(nav); check(/unknown|not an instant/i.test(await (await card(nav)).innerText()), 'country date card keeps unknown event clock explicit'); await shot(page, 'country-source-card-' + page.viewportSize().width); await page.keyboard.press('Escape');
}

async function routeSmoke(page, route) {
  await page.goto(base + 'pages/' + route + '.html'); await page.locator('.date-nav:visible').first().waitFor({ timeout: 60000 }); await privacy(page, route + ' initial');
  if (route === 'newton-chronology') {
    await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready', null, { timeout: 60000 });
    await newtonPassivePreviewRegression(page);
    const slider = page.locator('#nw-ring-navigation .date-nav-slider').first(); await slider.evaluate(e => { for (let p=e.parentElement;p;p=p.parentElement) if(p.tagName==='DETAILS')p.open=true; }); await slider.focus(); await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready'); check(await page.locator('#nw-date').inputValue() === '2060-01-02', 'Newton calendar lane advances one explicit study day');
    const values = await page.locator('#nw-ring-navigation .date-nav-slider,#nw-sky-navigation .date-nav-slider,#nw-slider').evaluateAll(els => els.map(e => e.value)); check(values.length > 2 && values.every(v => v === '1'), 'Newton sky and selected calendar rings remain synchronized', values);
    const data = JSON.parse(await actualDownload(page, '#nw-json', 'Newton linked study day JSON')); check(data.context.dateISO === await page.locator('#nw-workspace').getAttribute('data-date-iso'), 'Newton actual export retains selected instant');
    await newtonEventRegression(page);
  } else {
    await page.waitForFunction(() => !document.getElementById('atlas-json').disabled); const before = await page.locator('#atlas-context > span').first().innerText();
    const slider = page.locator('#atlas-lunar-dates .date-nav-slider'); await slider.focus(); await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => !document.getElementById('atlas-json').disabled);
    const after = await page.locator('#atlas-context > span').first().innerText(); check(Date.parse(after)-Date.parse(before) === 86400000, route + ' calendar slider advances declared 24 UTC hours');
    check(await slider.evaluate(e => e === document.activeElement), route + ' rebuilt date lane restores keyboard focus');
    const values = await page.locator('#atlas-lunar-dates .date-nav-slider,#atlas-solar-dates .date-nav-slider,#atlas-reading-dates .date-nav-slider,[id^=atlas-method-] .date-nav-slider,#sky-chart-dates .date-nav-slider,#sky-simple-dates .date-nav-slider').evaluateAll(els => els.filter(e => !e.closest('[data-date-navigator="atlas-events-nav"]')).map(e => e.value)); check(new Set(values).size === 1, route + ' date lanes synchronize selected index', values);
    if (route === 'calendar-atlas') {
      const solar = page.locator('#atlas-event-dates .date-nav-slider'); await solar.focus(); await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => !document.getElementById('atlas-json').disabled);
      const solved = await page.locator('#atlas-event-dates .date-nav-selected-date').innerText(); check(await page.locator('#atlas-context > span').first().innerText() === solved, 'selecting a solved solar term retains its exact UTC milliseconds');
      const nav = page.locator('#sky-rule-dates .date-nav'); await openCard(nav); await (await card(nav)).locator('.date-nav-bookmark').click(); await page.keyboard.press('Escape');
      const first = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)).entries[0]; await page.locator('#atlas-lunar-dates .date-nav-slider').focus(); await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => !document.getElementById('atlas-json').disabled);
      await openCard(nav); check(await (await card(nav)).locator('.date-nav-bookmark').getAttribute('aria-pressed') === 'false', 'same named rule at another instant does not reuse an earlier bookmark'); await (await card(nav)).locator('.date-nav-bookmark').click(); await page.keyboard.press('Escape');
      const saved = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)).entries; check(saved.length === 2 && saved[0].id !== saved[1].id && saved[0].date !== saved[1].date && saved.some(e => e.id === first.id), 'rule bookmarks retain separate stable source-plus-instant identities', saved);
      await page.locator('#atlas-lunar-dates .date-nav-slider').focus(); await page.keyboard.press('ArrowLeft'); await page.waitForFunction(() => !document.getElementById('atlas-json').disabled); await openCard(nav); check(await (await card(nav)).locator('.date-nav-bookmark').getAttribute('aria-pressed') === 'true', 'returning to the original rule instant restores its bookmark'); await page.keyboard.press('Escape'); await privacy(page, 'atlas explicit rule bookmarks', true);
    }
  }
  await layout(page, route + ' ' + page.viewportSize().width); await shot(page, route.replaceAll('/','-') + '-' + page.viewportSize().width, '.date-nav:visible');
}

async function newtonPassivePreviewRegression(page) {
  const sourceTrigger = page.locator('#nw-source-date-navigation .date-nav-selected'), sourceCard = await card(page.locator('#nw-source-date-navigation .date-nav'));
  await sourceTrigger.hover(); await sourceCard.waitFor({ state: 'visible' });
  await page.locator('#nw-next').evaluate(e => e.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  check(await sourceCard.isHidden(), 'scrolling from a Newton source preview dismisses the passive overlay');
  await page.locator('#nw-next').click(); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready');
  check(await page.locator('#nw-date').inputValue() === '2060-01-02' && await page.locator('#nw-next').evaluate(e => e === document.activeElement), 'Newton next-day control remains clickable after source hover and scroll');
  await page.locator('#nw-slider').focus(); await page.keyboard.press('Home'); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready');
  await page.locator('#nw-hypothesis').focus(); await page.mouse.move(0, 0); await sourceTrigger.hover(); await sourceCard.waitFor({ state: 'visible' });
  check(await page.locator('#nw-hypothesis').evaluate(e => e === document.activeElement), 'passive source hover preserves the previous Newton control focus');
  await page.locator('#nw-slider').focus();
  check(await sourceCard.isHidden(), 'intentional focus on the Newton slider dismisses a passive source preview');
  await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready'); await page.locator('#nw-next').click(); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready');
  check(await page.locator('#nw-date').inputValue() === '2060-01-03' && await page.locator('#nw-next').evaluate(e => e === document.activeElement), 'Newton keyboard date selection and following day click survive source hover');
  await page.locator('#nw-slider').focus(); await page.keyboard.press('Home'); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready');
}

async function newtonEventRegression(page) {
  const markers = page.locator('#nw-year-timeline [data-event-id]');
  const first = markers.filter({ has: page.locator('title', { hasText: /new moon/i }) }).first(), neighbor = markers.filter({ has: page.locator('title', { hasText: /first quarter/i }) }).first();
  await first.scrollIntoViewIfNeeded(); await first.focus(); const dialog = page.locator('.date-nav-popover:visible'); await dialog.waitFor(); const title = await dialog.locator('.date-nav-popover-title').innerText(), reference = await first.getAttribute('data-event-id');
  const rect = await neighbor.boundingBox(); check(!!rect, 'adjacent Newton quarter marker has a real pointer target'); await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2); await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))); check(await dialog.locator('.date-nav-popover-title').innerText() === title && await first.evaluate(e => e === document.activeElement), 'neighbor hover cannot replace the focused unpinned Newton source card'); await page.keyboard.press('Enter'); await page.mouse.move(0,0); await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2); await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  check(await dialog.locator('.date-nav-popover-title').innerText() === title, 'adjacent Newton hover cannot replace the pinned New Moon card'); await dialog.locator('.date-nav-bookmark').click(); check(JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)).entries.some(e => e.id === reference), 'Newton card bookmarks its original source event after neighbor hover'); await page.keyboard.press('Escape'); check(await first.evaluate(e => e === document.activeElement), 'Newton Escape returns to original marker after neighbor hover');
  await page.locator('#nw-year').fill('2025'); await page.locator('#nw-date').fill('2025-04-20'); await page.locator('#nw-apply').click(); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready', null, { timeout: 60000 }); await page.locator('#nw-event-kind').selectOption('observance');
  const dates = page.locator('#nw-events .nw-event-date'); check(await dates.count() === 2, 'coincident 2025 Easter and Pascha remain two named projections'); const ids = await dates.evaluateAll(els => els.map(e => e.dataset.eventId)); check(new Set(ids).size === 2, 'same-day Newton observances retain distinct source identities', ids);
  for (let index=0;index<2;index++) { await dates.nth(index).click(); const card = page.locator('.date-nav-popover:visible'); await card.locator('.date-nav-bookmark').click(); await page.keyboard.press('Escape'); }
  const saved = JSON.parse(await page.evaluate(k => localStorage.getItem(k), key)).entries.filter(e => ids.includes(e.id)); check(saved.length === 2 && saved.every(e => e.date === '2025-04-20'), 'both coincident observances can be bookmarked independently'); await privacy(page, 'Newton explicit event bookmarks', true);
}

async function horizonJourney(page) {
  await page.goto(base + 'pages/event-horizon.html'); await page.waitForFunction(() => !document.getElementById('eh-json').disabled, null, { timeout: 60000 });
  await page.locator('#eh-profile-navigation > summary').click(); await page.locator('#eh-calendar-navigation > summary').click();
  await page.waitForFunction(() => document.querySelectorAll('#eh-calendar-tracks .date-nav').length === 13);
  check(await page.locator('#eh-profile-tracks .date-nav').count() === 4, 'horizon exposes four separate profile lanes');
  const slider = page.locator('#eh-calendar-tracks .date-nav-slider').first(); await slider.focus(); await page.keyboard.press('End');
  check(await page.locator('#eh-date').inputValue() === '2031-01-01', 'horizon calendar End reaches final date');
  const values = await page.locator('#eh-date-map .date-nav-slider,#eh-profile-tracks .date-nav-slider,#eh-calendar-tracks .date-nav-slider').evaluateAll(els => els.map(e => e.value));
  check(values.length === 18 && new Set(values).size === 1, 'all horizon context/profile/calendar sliders retain one selected date', values);
  check(await page.locator('#eh-calendar-tracks [data-kind="traditional-favorable"],#eh-calendar-tracks [data-kind="traditional-caution"]').count() === 0, 'civil calendar lanes have no inherited favorable/caution colors');
  const held = await page.locator('#eh-date').inputValue(); await page.locator('#eh-chart').focus(); await page.locator('.date-nav-popover:visible').waitFor(); check(await page.locator('#eh-date').inputValue() === held, 'horizon plot focus previews without changing selected date'); await page.keyboard.press('Escape'); check(await page.locator('#eh-chart').evaluate(e => e === document.activeElement), 'horizon plot Escape restores the chart anchor');
  await privacy(page, 'horizon navigation'); await layout(page, 'horizon all lanes ' + page.viewportSize().width); await shot(page, 'horizon-calendar-lanes-' + page.viewportSize().width, '#eh-calendar-navigation');
  await page.locator('.eh-recompute > summary').click(); await page.locator('#eh-clock').fill('13:14:15');
  check(await page.locator('#eh-json').isDisabled() && await slider.isDisabled(), 'horizon clock edit disables prior shared lanes and export');
}

async function searchJourney(page) {
  await page.goto(base + 'pages/calendar-search.html'); await page.locator('#cs-advanced').evaluate(e => e.open = true); await page.locator('#cs-limit').fill('3'); await page.locator('#cs-run').click();
  await page.waitForFunction(() => !document.getElementById('cs-json').disabled);
  const note = await page.locator('#cs-date-navigation').innerText(); check(note.includes('3 retained matches') && note.includes('31 requested date slots') && note.includes('cap excludes'), 'capped search discloses the full request and retained subset', note.slice(0,500));
  await page.locator('#cs-date-navigation .cs-track-disclosure > summary').nth(0).click(); await page.locator('#cs-date-navigation .cs-track-disclosure > summary').nth(1).click();
  await page.waitForFunction(() => document.querySelectorAll('[data-date-navigator^="cs-calendar-"]').length === 13);
  check(await page.locator('[data-date-navigator^="cs-tradition-"]').count() === 2, 'search keeps two traditional-rule lanes separate');
  const slider = page.locator('[data-date-navigator^="cs-calendar-"] .date-nav-slider').first(); await slider.focus(); await page.keyboard.press('End');
  const values = await page.locator('#cs-date-navigation .date-nav-slider').evaluateAll(els => els.map(e => e.value)); check(values.length === 16 && values.every(v => v === '2'), 'all search lanes select the last retained sample', values);
  const bytes = await actualDownload(page, '#cs-json', 'count-capped search JSON'); const data = JSON.parse(bytes); check(data.result.counts.returned === 3 && data.result.counts.totalDates === 31 && data.result.counts.matched === 31, 'actual search download preserves matched versus retained counts');
  await privacy(page, 'search selected sample'); await layout(page, 'search expanded lanes ' + page.viewportSize().width); await shot(page, 'search-results-' + page.viewportSize().width, '#cs-date-navigation');
  await page.locator('#cs-time').fill('13:14:15'); check(await page.locator('#cs-json').isDisabled() && await page.locator('#cs-date-navigation').isHidden(), 'search input edit clears navigation and disables stale downloads');
}

async function eschatologyJourney(page) {
  await page.goto(base + 'pages/eschatology-atlas.html'); await page.locator('#ea-date-nav-known .date-nav').waitFor(); await privacy(page, 'source atlas initial');
  const original = await page.locator('#ea-selected-record').innerText(); await page.locator('#ea-selection').selectOption('study-date'); await page.locator('#ea-study-date').fill('2026-10-30'); await page.locator('#ea-calculate').click(); await page.waitForFunction(() => !document.getElementById('ea-reading-json').disabled);
  const slider = page.locator('#ea-sky-slider'); await slider.focus(); await page.keyboard.press('ArrowRight'); await page.waitForFunction(() => !document.getElementById('ea-reading-json').disabled);
  check(await page.locator('#ea-study-date').inputValue() === '2026-10-31', 'eschatology sky slider advances explicit study day');
  check(await page.locator('#ea-selected-record').innerText() === original, 'advancing study date preserves exact source-date and eligibility text');
  const values = await page.locator('#ea-study-slider,#ea-sky-slider,[id^="ea-calendar-"]').evaluateAll(els => els.filter(e => e.matches('input[type=range]')).map(e => e.value)); check(values.length >= 15 && new Set(values).size === 1, 'source atlas sky and thirteen calendar sliders synchronize', values);
  const data = JSON.parse(await actualDownload(page, '#ea-reading-json', 'explicit source-atlas study JSON')); check(data.frame.context.dateISO === await page.locator('#ea-reading-result').getAttribute('data-date-iso'), 'source-atlas export preserves selected calculation instant');
  await layout(page, 'source atlas ' + page.viewportSize().width); await shot(page, 'eschatology-study-' + page.viewportSize().width, '#ea-sky-navigation'); await page.locator('#ea-time').fill('13:14:15'); check(await page.locator('#ea-reading-json').isDisabled(), 'source-atlas edited clock disables stale export');
}

try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); origin = 'http://127.0.0.1:' + server.address().port; base = origin + prefix;
  const pkg = await import(process.env.PLAYWRIGHT_PKG ? pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href : 'playwright'); browser = await (pkg.chromium || pkg.default.chromium).launch({ headless: true }); receipt.browser = browser.version();
  if (process.env.DATE_NAV_PAGES_ONLY !== '1') {
  for (const width of widths) await journey('fixture-' + width, width, page => fixtureJourney(page, width));
  for (const mode of ['corrupt', 'unavailable']) await journey('storage-' + mode, 390, page => storageJourney(page, mode), { storage: mode });
  await journey('touch', 390, async page => { await fixtureReady(page); const nav = page.locator('#fixture-a .date-nav'); await nav.locator('.date-nav-selected').tap(); check(await (await card(nav)).isVisible(), 'touch opens date details'); await (await card(nav)).locator('.date-nav-close').tap(); check(await (await card(nav)).isHidden(), 'touch close dismisses date details'); }, { touch: true });
  }
  if (process.env.DATE_NAV_FIXTURE_ONLY !== '1') {
    await journey('newton-scroll-320', 320, async page => { await page.goto(base + 'pages/newton-chronology.html'); await page.waitForFunction(() => document.querySelector('.newton-workbench')?.dataset.state === 'ready', null, { timeout: 60000 }); await newtonPassivePreviewRegression(page); await layout(page, 'Newton source-scroll regression 320'); await privacy(page, 'Newton source-scroll regression 320'); await shot(page, 'next-day-320', '#nw-next'); });
    for (const width of pageWidths) {
      await journey('timeline-' + width, width, timelineJourney); await journey('countries-' + width, width, countriesJourney);
      await journey('eschatology-atlas-' + width, width, eschatologyJourney);
      for (const route of ['newton-chronology', 'calendar-atlas', 'calendars/western']) await journey(route.replaceAll('/','-') + '-' + width, width, page => routeSmoke(page, route));
      await journey('event-horizon-' + width, width, horizonJourney); await journey('calendar-search-' + width, width, searchJourney);
    }
  }
} catch (error) { receipt.failures.push({ label: 'harness', message: error.message, stack: error.stack }); }
finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve)); const after = await product(); receipt.source.productAtEndSHA256 = sha(JSON.stringify(after)); receipt.source.driverAtEndSHA256 = sha(await readFile(fileURLToPath(import.meta.url))); receipt.source.changedFiles = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(p => before[p] !== after[p]); receipt.source.driverChanged = receipt.source.driverAtStartSHA256 !== receipt.source.driverAtEndSHA256; receipt.source.driftAllowed = process.env.DATE_NAV_ALLOW_EDITS === '1';
  for (const [label, values] of [['runtime/console errors', receipt.errors], ['missing local responses', receipt.missing], ['implicit external requests', receipt.externalRequests]]) if (values.length) receipt.failures.push({ label, detail: values });
  if ((receipt.source.changedFiles.length || receipt.source.driverChanged) && !receipt.source.driftAllowed) receipt.failures.push({ label: 'product or driver changed during verification', detail: receipt.source });
  receipt.pass = receipt.failures.length === 0; receipt.acceptanceEligible = receipt.pass && !receipt.source.changedFiles.length && !receipt.source.driverChanged && !receipt.source.driftAllowed; receipt.completedAt = new Date().toISOString(); receipt.checkCount = receipt.checks.length;
  await writeFile(resolve(output, 'source-before.json'), JSON.stringify(before, null, 2) + '\n'); await writeFile(resolve(output, 'source-after.json'), JSON.stringify(after, null, 2) + '\n'); await writeFile(resolve(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n'); console.log(JSON.stringify({ pass: receipt.pass, acceptanceEligible: receipt.acceptanceEligible, checks: receipt.checkCount, failures: receipt.failures.map(f => ({ label: f.label, message: f.message })), receipt: resolve(output, 'receipt.json') }, null, 2)); if (!receipt.pass) process.exitCode = 1;
}
