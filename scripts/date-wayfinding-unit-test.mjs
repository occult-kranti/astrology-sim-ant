import assert from 'node:assert/strict';
import { DATE_KINDS, DATE_BOOKMARK_KEY, normalizeDateItems, parseDateBookmarks } from '../assets/js/app/date-wayfinding.js';

let checks = 0;
function check(label, fn) { fn(); checks++; console.log(`PASS ${label}`); }

check('All ten explicit date types remain distinguishable', () => {
  assert.equal(Object.keys(DATE_KINDS).length, 10);
  assert.equal(new Set(Object.values(DATE_KINDS).map(kind => kind.label)).size, 10);
});
check('Wording never infers a favorable or conflict classification', () => {
  for (const kind of [undefined, 'profile-high', 'danger', 'favorable']) {
    const [entry] = normalizeDateItems([{ id: 'test', date: '2026-10-30', label: 'Favorable conflict danger', kind }]);
    assert.equal(entry.kind, 'neutral');
  }
});
check('Normalization excludes undeclared private fields and bounds declared text', () => {
  const [entry] = normalizeDateItems([{ id: 'test', date: '2026-10-30', label: 'x'.repeat(1000), kind: 'astronomy', birth: { name: 'private' }, notes: 'private', coordinates: [12, 34], aiContext: 'private', details: [{ label: 'Clock', value: 'Unknown', private: 'private' }, { label: 'Invalid numeric value', value: 44 }] }]);
  assert.equal(entry.label.length, 240);
  assert.deepEqual(Object.keys(entry), ['id', 'date', 'label', 'kind', 'summary', 'details', 'sourceLabel', 'sourceUrl']);
  assert.deepEqual(entry.details, [{ label: 'Clock', value: 'Unknown' }]);
  assert(Object.isFrozen(entry)); assert(Object.isFrozen(entry.details));
});
check('Full 3,660-entry order and exact supplied source precision survive', () => {
  const entries = Array.from({ length: 3660 }, (_, index) => ({ id: `entry-${index}`, date: index === 0 ? 'Conditional year 2060' : String(index), label: `Entry ${index}`, kind: 'source-claim' }));
  const result = normalizeDateItems(entries);
  assert.equal(result.length, 3660); assert.equal(result[0].date, 'Conditional year 2060'); assert.equal(result[3659].id, 'entry-3659');
});
check('Duplicate references and overbound input fail before an ambiguous selection', () => {
  assert.throws(() => normalizeDateItems([{ id: 'same' }, { id: 'same' }]));
  assert.throws(() => normalizeDateItems(Array.from({ length: 10001 }, (_, index) => ({ id: String(index) }))));
});
check('Bookmarks serialize only safe scoped public references', () => {
  const entries = parseDateBookmarks(JSON.stringify({ version: 1, entries: [{ scope: 'country-history:US', id: 'declaration-1776', date: '1776-07-04', kind: 'neutral', label: 'private', notes: 'private', coordinates: [1, 2], aiContext: 'private' }] }));
  assert.deepEqual(entries, [{ scope: 'country-history:US', id: 'declaration-1776', date: '1776-07-04', kind: 'neutral' }]);
  assert.equal(DATE_BOOKMARK_KEY, 'workbench.date-wayfinding.bookmarks.v1');
});
check('Unknown source dates remain reference-only bookmarks', () => {
  assert.deepEqual(parseDateBookmarks(JSON.stringify({ version: 1, entries: [{ scope: 'claims', id: 'conditional-2060', date: '', kind: 'source-claim' }] }))[0].date, '');
});
check('Malformed, duplicate and overbound stored payloads fail safely', () => {
  const entry = { scope: 'public', id: 'a', date: '2026-10-30', kind: 'neutral' };
  for (const raw of ['{', '{}', JSON.stringify({ version: 1, entries: [{ ...entry, date: 'private prose' }] }), JSON.stringify({ version: 1, entries: [{ ...entry, scope: 'private coordinates: 1,2' }] }), JSON.stringify({ version: 1, entries: [entry, entry] }), JSON.stringify({ version: 1, entries: Array(251).fill(entry) }), 'x'.repeat(200001)]) assert.throws(() => parseDateBookmarks(raw));
  assert.deepEqual(parseDateBookmarks(null), []);
});
console.log(`Date wayfinding: ${checks} checks passed.`);
