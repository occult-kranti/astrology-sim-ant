import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';
import { DESKTOP_TOOLS, DESKTOP_CATEGORIES } from '../../assets/js/core/data/desktop-tools.js';

let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const same = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };
const rejects = (fn, code) => { assert.throws(fn, error => error.code === code, code); checks++; };
let eagerReads = 0;
Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { eagerReads++; throw new Error('denied'); } });
const library = await import('../../assets/js/app/desktop-library.js');
same(eagerReads, 0, 'Importing the module has no storage side effect');
const { readChartLibrary, saveChart, deleteChart, exportChartLibrary, importChartLibrary, validateProfile, DESKTOP_LIBRARY_KEY } = library;

class MemoryStore {
  constructor() { this.data = new Map(); this.writes = 0; this.failWrite = false; }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { if (this.failWrite) throw new Error('quota'); this.data.set(key, value); this.writes++; }
}
const store = new MemoryStore();
const profile = { name: 'Public equinox example', localDate: '2024-03-20', localTime: '03:06', timeZone: 'Etc/UTC', lat: 51.4779, lon: 0, disambiguation: 'reject' };
same(readChartLibrary(store), [], 'An absent library is empty');
same(store.writes, 0, 'Reading does not save');
rejects(() => readChartLibrary(), 'STORAGE_UNAVAILABLE');
rejects(() => readChartLibrary(null), 'STORAGE_UNAVAILABLE');
rejects(() => readChartLibrary({ getItem() { throw new Error(); }, setItem() {} }), 'STORAGE_UNAVAILABLE');

const first = saveChart({ ...profile, secret: 'must-not-survive', dateISO: 'wrong' }, { storage: store });
check(first.id.length >= 8, 'Saved record has an identifier');
same(store.writes, 1, 'Explicit save performs one write');
same(Object.keys(first.profile).sort(), Object.keys(profile).sort(), 'Persist only declared profile fields');
check(!store.getItem(DESKTOP_LIBRARY_KEY).includes('must-not-survive'), 'Unknown sensitive fields are discarded');
same(readChartLibrary(store)[0], first, 'Saved chart round trips');
const exported = exportChartLibrary(readChartLibrary(store));
same(store.writes, 1, 'Export has no persistence side effect');
const fresh = new MemoryStore();
same(importChartLibrary(exported, { storage: fresh }), [first], 'Export and import round trip');
same(fresh.writes, 1, 'Import commits once');
same(importChartLibrary(exported, { storage: fresh }).length, 1, 'Reimport merges idempotently');

const colliding = JSON.parse(exported);
colliding.charts[0].name = 'Another moment';
colliding.charts[0].profile.localDate = '2024-03-21';
const merged = importChartLibrary(JSON.stringify(colliding), { storage: fresh });
same(merged.length, 2, 'Differing colliding import is retained separately');
same(merged[0], first, 'Merge never overwrites the original');
check(merged[1].id !== first.id, 'Collision receives a new ID');
same(importChartLibrary(exported, { storage: fresh, mode: 'replace' }), [first], 'Explicit replace uses only imported rows');
rejects(() => importChartLibrary(exported, { storage: fresh, mode: 'clear' }), 'INVALID_IMPORT_MODE');

const updated = saveChart({ ...profile, localTime: '04:06' }, { id: first.id, name: 'Revised', storage: store });
same(updated.createdAt, first.createdAt, 'Update preserves created time');
same(updated.id, first.id, 'Update preserves identifier');
same(readChartLibrary(store).length, 1, 'Update does not duplicate records');
rejects(() => saveChart(profile, { id: 'missing_id', storage: store }), 'CHART_NOT_FOUND');
const before = store.getItem(DESKTOP_LIBRARY_KEY);
store.failWrite = true;
rejects(() => saveChart(profile, { storage: store }), 'STORAGE_WRITE_FAILED');
same(store.getItem(DESKTOP_LIBRARY_KEY), before, 'Quota failure leaves old data intact');
store.failWrite = false;
same(deleteChart(first.id, { storage: store }), [], 'Deletion removes selected record');
const writes = store.writes;
same(deleteChart('missing', { storage: store }), [], 'Deleting a missing chart is harmless');
same(store.writes, writes, 'Deleting a missing chart avoids write');

for (const text of ['', '{broken', 'null', '[]', JSON.stringify({ version: 99, charts: [] }), JSON.stringify({ format: 'other', version: 1, charts: [] })]) {
  const snapshot = fresh.getItem(DESKTOP_LIBRARY_KEY);
  assert.throws(() => importChartLibrary(text, { storage: fresh })); checks++;
  same(fresh.getItem(DESKTOP_LIBRARY_KEY), snapshot, 'Malformed imports do not mutate');
}
rejects(() => importChartLibrary('x'.repeat(1024 * 1024 + 1), { storage: fresh }), 'IMPORT_LIMIT');
const duplicate = JSON.parse(exported); duplicate.charts.push({ ...duplicate.charts[0] });
rejects(() => importChartLibrary(JSON.stringify(duplicate), { storage: fresh }), 'DUPLICATE_ID');
const invalid = JSON.parse(exported); invalid.charts[0].updatedAt = 'yesterday';
rejects(() => importChartLibrary(JSON.stringify(invalid), { storage: fresh }), 'INVALID_TIMESTAMP');
invalid.charts[0].updatedAt = first.updatedAt; invalid.charts[0].id = '__proto__';
// Prototype-like string IDs cannot mutate object prototypes; records are stored in an array.
const harmless = importChartLibrary(JSON.stringify(invalid), { storage: new MemoryStore() });
same(harmless[0].id, '__proto__', 'String IDs stay inert data');
same({}.polluted, undefined, 'No prototype pollution');
assert.throws(() => validateProfile({ ...profile, localDate: '2024-02-31' })); checks++;
assert.throws(() => validateProfile({ ...profile, localDate: '2024-03-10', localTime: '02:30', timeZone: 'America/New_York' })); checks++;
assert.throws(() => validateProfile({ ...profile, localDate: '2024-11-03', localTime: '01:30', timeZone: 'America/New_York' })); checks++;
same(validateProfile({ ...profile, localDate: '2024-11-03', localTime: '01:30', timeZone: 'America/New_York', disambiguation: 'later' }).disambiguation, 'later', 'Explicit fold selection survives');
assert.throws(() => validateProfile({ ...profile, lat: Infinity })); checks++;
assert.throws(() => validateProfile({ ...profile, timeZone: 'bad/zone' })); checks++;
assert.throws(() => validateProfile({ ...profile, name: 'x'.repeat(101) })); checks++;
const full = JSON.parse(exported);
full.charts = Array.from({ length: 200 }, (_, i) => ({ ...first, id: `record_${String(i).padStart(4, '0')}` }));
const fullStore = new MemoryStore();
same(importChartLibrary(JSON.stringify(full), { storage: fullStore }).length, 200, 'Maximum chart count imports');
rejects(() => saveChart(profile, { storage: fullStore }), 'LIBRARY_LIMIT');
full.charts.push({ ...first, id: 'record_overflow' });
rejects(() => importChartLibrary(JSON.stringify(full), { storage: fresh }), 'LIBRARY_LIMIT');
const corrupt = new MemoryStore(); corrupt.setItem(DESKTOP_LIBRARY_KEY, '{broken');
rejects(() => readChartLibrary(corrupt), 'INVALID_JSON');
same(corrupt.getItem(DESKTOP_LIBRARY_KEY), '{broken', 'Corrupt storage not silently overwritten');
same(importChartLibrary(exported, { storage: corrupt, mode: 'replace' }), [first], 'Explicit replacement recovers corrupt storage');

// Inventory every existing application page, with no network or private URL arguments.
const root = fileURLToPath(new URL('../../', import.meta.url));
async function walk(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) result.push(...await walk(path));
    else if (item.name.endsWith('.html')) result.push(path);
  }
  return result;
}
const expected = [resolve(root, 'index.html'), ...await walk(resolve(root, 'pages'))].filter(path => !path.endsWith('/pages/desktop.html'));
const actual = DESKTOP_TOOLS.map(tool => resolve(root, 'pages', tool.href));
same([...actual].sort(), [...expected].sort(), 'Catalogue exposes every pre-existing application page');
same(new Set(DESKTOP_TOOLS.map(tool => tool.id)).size, DESKTOP_TOOLS.length, 'Unique catalogue IDs');
same(new Set(actual).size, actual.length, 'Unique catalogue routes');
for (const tool of DESKTOP_TOOLS) {
  check(DESKTOP_CATEGORIES.includes(tool.category), `Known category: ${tool.id}`);
  check(tool.title.length > 0 && tool.description.length > 0, `Usable label and description: ${tool.id}`);
  check(!/[?#]/.test(tool.href) && !/^[a-z]+:/i.test(tool.href), `Local clean URL: ${tool.id}`);
  check((await readFile(resolve(root, 'pages', tool.href), 'utf8')).includes('<html'), `Existing HTML route: ${tool.id}`);
}
const moduleText = await readFile(resolve(root, 'assets/js/app/desktop-library.js'), 'utf8');
check(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|window\.location/.test(moduleText), 'No network or URL transport in library');
console.log(JSON.stringify({ status: 'PASS', checks, routes: DESKTOP_TOOLS.length, scope: 'bounded chart-library storage/import/export failures and complete local route inventory' }, null, 2));
