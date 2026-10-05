// Shared symbolic arithmetic, trace geometry, export metadata and storage recovery.
// Browser gates separately rasterize the real SVG/PNG and exercise DOM styles.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createSymbolResult, SYMBOL_METHODS } from '../../assets/js/core/symbols.js';
import { renderSymbolSVG } from '../../assets/js/core/viz/symbol-svg.js';
import { KAMEAS, normalizeSigilText, sigilFor, reduceToCell, validateKamea } from '../../assets/js/core/kamea.js';
import { NAVAGRAHA_YANTRAS } from '../../assets/js/core/data/rasa-data.js';
import { listSavedReadings, saveReadingEntry, removeSavedReading, listPersons, savePerson, removePerson,
  encodeState, decodeState, svgToPNG } from '../../assets/js/app/state.js';

test('published Saturn grid and classic Hebrew sums give fixed trace reference cases', () => {
  const result = createSymbolResult({ text: 'אחד', method: 'hebrew-standard' });
  // Agrippa II.22 Saturn plate, read by row; standard Hebrew aleph=1, heth=8, daleth=4.
  assert.deepEqual(result.grid, [[4, 9, 2], [3, 5, 7], [8, 1, 6]]);
  assert.equal(result.trace.total, 13);
  assert.deepEqual(result.trace.letterTrace.map(v => [v.letter, v.value, v.cellValue, v.row, v.col]),
    [['א', 1, 1, 2, 1], ['ח', 8, 8, 2, 0], ['ד', 4, 4, 0, 0]]);
  assert.equal(createSymbolResult({ text: 'יהוה', method: 'hebrew-standard' }).trace.total, 26);
  assert.match(result.method.note, /modern reconstruction/);
});

test('Hebrew final-letter variant and size-dependent reduction are explicitly distinct', () => {
  const standard = createSymbolResult({ planet: 'Sun', text: 'ך', method: 'hebrew-standard' });
  const variant = createSymbolResult({ planet: 'Sun', text: 'ך', method: 'hebrew-gadol' });
  assert.equal(standard.trace.letterTrace[0].value, 20); assert.equal(standard.trace.letterTrace[0].cellValue, 20);
  assert.equal(variant.trace.letterTrace[0].value, 500); assert.equal(variant.trace.letterTrace[0].cellValue, 5);
  assert.equal(reduceToCell(300, 9), 3); assert.equal(reduceToCell(300, 36), 30); assert.equal(reduceToCell(45, 9), 9);
  assert.equal(variant.inputs.method, 'hebrew-gadol');
});

test('existing Latin path order and repeated-cell convention remain stable', () => {
  const trace = sigilFor('GABRIEL', KAMEAS.find(k => k.planet === 'Moon'));
  assert.deepEqual(trace.letterTrace.map(v => v.value), [7, 1, 2, 18, 9, 5, 12]);
  const result = createSymbolResult({ text: 'a A-b' });
  assert.equal(result.inputs.normalizedText, 'AAB');
  assert.equal(result.trace.letterTrace.length, 3); assert.equal(result.trace.steps.length, 2);
  assert.equal(result.trace.steps[0].repeats, 2);
  assert.equal(result.normalization.changes.length, 4);
});

test('normalization records separators and Hebrew points without inventing transliterations', () => {
  const pointed = createSymbolResult({ text: 'אֶחָד', method: 'hebrew-standard' });
  assert.equal(pointed.inputs.normalizedText, 'אחד'); assert.equal(pointed.trace.total, 13);
  assert.equal(pointed.normalization.changes.length, 2);
  for (const text of ['शुक्र', 'Gabrielא', 'A1', 'Café', 'Cafe\u0301', '☉']) {
    assert.throws(() => createSymbolResult({ text }), error => error.code === 'unsupported-characters' && error.details.unsupported.length > 0);
  }
  assert.throws(() => createSymbolResult({ text: 'אa', method: 'hebrew-standard' }), { code: 'unsupported-characters' });
  assert.equal(normalizeSigilText('a - B').normalized, 'AB');
});

test('input and output bounds reject unsupported methods, fabricated squares and empty traces', () => {
  for (const method of ['unknown', 'toString', '', 'hebrew']) assert.throws(() => createSymbolResult({ text: 'AB', method }), { code: 'method' });
  assert.throws(() => createSymbolResult({ planet: 'Neptune' }), { code: 'planet' });
  assert.throws(() => createSymbolResult({ kind: 'mandala' }), { code: 'kind' });
  assert.throws(() => createSymbolResult({ text: '- !' }), { code: 'empty-trace' });
  assert.throws(() => createSymbolResult({ text: 'A'.repeat(257) }), { code: 'text-limit' });
  assert.equal(createSymbolResult({ text: 'A'.repeat(256) }).trace.letterTrace.length, 256);
  assert.throws(() => reduceToCell(NaN, 9), { code: 'cell-value' });
  for (const grid of [[], null, {}, [[]], [[1, 2], [3]]]) assert.equal(validateKamea(grid).ok, false);
  const square = createSymbolResult({ text: '' }); assert.equal(square.trace, null); assert.match(square.title, /square only/);
  assert.equal(SYMBOL_METHODS.kamea.length, 4);
});

test('all existing square catalogues reuse their validator and retain provenance', () => {
  for (const k of KAMEAS) {
    const result = createSymbolResult({ planet: k.planet });
    assert.deepEqual(result.grid, k.rows); assert.equal(result.validation.constant, k.magicConstant);
    assert.ok(result.sources.includes(k.citation)); assert.notEqual(result.grid, k.rows);
  }
  for (const y of NAVAGRAHA_YANTRAS) {
    const result = createSymbolResult({ kind: 'yantra', planet: y.en });
    assert.deepEqual(result.grid, y.grid); assert.equal(result.validation.constant, y.constant);
    assert.match(result.method.label, /modern printed/); assert.ok(result.sources.includes(y.provenance));
    assert.equal(result.trace, null); assert.equal(result.inputs.normalizedText, '');
    assert.ok(renderSymbolSVG(result).svg.includes('xmlns="http://www.w3.org/2000/svg"'));
  }
  assert.throws(() => createSymbolResult({ kind: 'yantra', text: 'A' }), { code: 'yantra-text' });
});

test('SVG cell centers and on-demand construction follow fixed geometry without moving the square', () => {
  const result = createSymbolResult({ text: 'AAB' }), full = renderSymbolSVG(result);
  assert.deepEqual(full.geometry.trace.map(p => [p.x, p.y]), [[240, 416], [392, 112]]);
  assert.equal(full.construction.complete, true);
  for (const count of [0, 1, 2]) {
    const frame = renderSymbolSVG(result, { traceStep: count });
    assert.deepEqual(frame.geometry.cells, full.geometry.cells);
    assert.equal(frame.construction.visibleSteps, count);
    assert.equal(frame.svg.includes('<line '), count === 2, 'end bar appears only for the complete trace');
    assert.equal(frame.svg.includes('<circle '), count > 0);
  }
  for (const traceStep of [-1, 3, .5, NaN]) assert.throws(() => renderSymbolSVG(result, { traceStep }), { code: 'trace-step' });
});

test('SVG is deterministic, self-contained, escaped and carries actual method/input metadata', () => {
  const result = createSymbolResult({ text: 'Gabriel' });
  const rendered = renderSymbolSVG(result);
  assert.equal(rendered.svg, renderSymbolSVG(structuredClone(result)).svg);
  assert.doesNotMatch(rendered.svg, /var\(|<script|<animate|https?:\/\/(?!www\.w3\.org)/);
  assert.match(rendered.svg, /<metadata>/); assert.match(rendered.svg, /normalizedText/);
  assert.match(rendered.svg, /Gabriel/); assert.match(rendered.svg, /modern/);
  assert.ok(rendered.textModel.includes(result.method.note));
  const escaped = renderSymbolSVG({ ...result, title: '<script>&"' }).svg;
  assert.doesNotMatch(escaped, /<script>/); assert.match(escaped, /&lt;script&gt;/);
  assert.throws(() => renderSymbolSVG(result, { size: Infinity }), { code: 'svg-size' });
});

function withStorage(t, seed = {}) {
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'localStorage'), store = new Map(Object.entries(seed));
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) } });
  t.after(() => { if (prior) Object.defineProperty(globalThis, 'localStorage', prior); else delete globalThis.localStorage; });
  return store;
}

test('malformed stored collection roots and members cannot break startup', t => {
  const store = withStorage(t);
  for (const raw of ['{}', '[null]', 'null', '"saved"', '1', '{broken', '[[]]']) {
    store.set('wb-saved-readings', raw); store.set('wb-persons', raw);
    assert.deepEqual(listSavedReadings(), []); assert.deepEqual(listPersons(), []);
    assert.deepEqual(removeSavedReading('missing'), []); assert.deepEqual(removePerson('missing'), []);
  }
});

test('valid siblings and new clock/method fields survive partial recovery, restore and save', t => {
  const state = { date: '2024-11-03', time: '01:30', zone: 'America/New_York', fold: 'later', bzone: '', bfold: 'earlier', sect: false, lat: 0, offset: -5 };
  const good = { key: 'one', label: 'Fold case', ts: '2026-10-05T00:00:00Z', state };
  const raw = JSON.stringify([null, good, { key: 'bad', state: [] }, { key: 'nested', state: { date: {} } }, good]);
  const store = withStorage(t, { 'wb-saved-readings': raw,
    'wb-persons': JSON.stringify([null, { id: 'p1', name: 'Observer', bdate: '2000-01-01', blat: 0, blon: 0 }, { id: 'bad', name: {} }]) });
  assert.deepEqual(listSavedReadings(), [good]); assert.equal(store.get('wb-saved-readings'), raw, 'read recovery does not overwrite original storage');
  assert.deepEqual(listSavedReadings()[0].state, state);
  assert.equal(decodeState(encodeState(state)).fold, 'later');
  assert.equal(saveReadingEntry({ key: 'two', state }).length, 2);
  assert.equal(listPersons().length, 1);
  assert.equal(savePerson({ name: 'Second', bdate: '2001-01-01', bzone: 'UTC', bfold: 'earlier' }).length, 2);
  assert.equal(savePerson({ name: ['invalid'] }).length, 2);
  assert.equal(saveReadingEntry({ key: 'bad', state: { x: Infinity } }).length, 2);
});

test('blocked storage, absent diagrams and invalid PNG scale fail safely', async t => {
  withStorage(t);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
  assert.deepEqual(listSavedReadings(), []); assert.deepEqual(listPersons(), []);
  assert.equal(saveReadingEntry({ key: 'volatile', state: { date: '2026-10-05' } }).length, 1);
  await assert.rejects(svgToPNG(null), /no svg/);
  await assert.rejects(svgToPNG({}, 'test.png', 0), /scale/);
});
