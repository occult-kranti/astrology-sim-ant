// Shared deterministic result contract for the Studio, historical page and MCP.
// Astronomical charts remain in calculation-context.js; these are symbolic grids.
import { KAMEAS, SIGIL_METHODS, SYMBOL_LIMITS, SymbolInputError, normalizeSigilText, sigilFor, sigilFromValues, validateKamea } from './kamea.js';
import { gematria, GEMATRIA_METHODS } from './kabbalah.js';
import { HEBREW_LETTERS } from './data/kabbalah-data.js';
import { yantraForGraha, validateYantra } from './yantra.js';

export const SYMBOL_METHODS = Object.freeze({
  kamea: Object.freeze([
    ...Object.entries(SIGIL_METHODS).map(([id, m]) => Object.freeze({ id, ...m, alphabet: 'latin' })),
    ...Object.entries(GEMATRIA_METHODS).map(([id, m]) => Object.freeze({ id: `hebrew-${id}`, label: `Hebrew ${m.label}`,
      note: `${m.note} Letter values are historical; this trace with the stated cell reduction is a modern reconstruction, not a facsimile historical seal.`, alphabet: 'hebrew' })),
  ]),
  yantra: Object.freeze([Object.freeze({ id: 'navagraha', label: 'Navagraha square — modern printed tradition',
    note: 'The sourced nine-square offset set; arithmetic verified separately from traditional interpretations.', alphabet: null })]),
});
const caveat = 'Historical symbolic systems for study. Arithmetic and geometry are reproducible; no magical efficacy is asserted.';

export function createSymbolResult(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new SymbolInputError('input', 'Supply a symbol input object.');
  const kind = input.kind === undefined ? 'kamea' : input.kind;
  if (!Object.hasOwn(SYMBOL_METHODS, kind)) throw new SymbolInputError('kind', 'Choose kamea or yantra.');
  const text = input.text === undefined ? '' : input.text;
  if (typeof text !== 'string' || Array.from(text).length > SYMBOL_LIMITS.textCodePoints) throw new SymbolInputError('text-limit', 'Text must be a string of at most 256 characters.');
  const methodId = input.method === undefined ? (kind === 'kamea' ? 'latin' : 'navagraha') : input.method;
  const method = SYMBOL_METHODS[kind].find(m => m.id === methodId);
  if (!method) throw new SymbolInputError('method', `Choose a supported ${kind} method.`);
  const planet = input.planet === undefined ? (kind === 'kamea' ? 'Saturn' : 'Sun') : input.planet;
  if (typeof planet !== 'string') throw new SymbolInputError('planet', 'Choose a planet from the catalogue.');
  let grid, validation, trace = null, title, sources, normalized = text, normalization = null;
  if (kind === 'kamea') {
    const square = KAMEAS.find(k => k.planet.toLowerCase() === planet.trim().toLowerCase());
    if (!square) throw new SymbolInputError('planet', 'The kamea catalogue has Saturn, Jupiter, Mars, Sun, Venus, Mercury and Moon.');
    normalization = normalizeSigilText(text, method.alphabet); normalized = normalization.normalized;
    if (text.trim()) {
      if (!normalized) throw new SymbolInputError('empty-trace', 'Enter at least one accepted letter, or leave the field empty for a square only.', normalization);
      if (method.alphabet === 'latin') trace = sigilFor(text, square, { method: method.id });
      else {
        const values = gematria(normalized, { method: method.id.slice('hebrew-'.length) });
        trace = { ...sigilFromValues(values.letters.map(v => ({ letter: v.char, value: v.value })), square),
          text, method: method.id, methodNote: method.note, normalization, total: values.total,
          note: 'Read Hebrew letters in logical text order. Reduce each letter separately: remove trailing powers of ten while out of range, then use digit sums. Do not trace the word total as a substitute for its letters.' };
      }
    }
    grid = square.rows.map(row => [...row]); validation = validateKamea(grid);
    title = `${square.planet} kamea${trace ? ' — name trace' : ' — square only'}`;
    sources = [square.citation, ...(method.alphabet === 'hebrew' ? [HEBREW_LETTERS[0].cite] : [])];
    input = { kind, planet: square.planet, text, method: method.id };
  } else {
    if (text.trim()) throw new SymbolInputError('yantra-text', 'Navagraha mode displays its sourced square; name tracing belongs to kamea mode.');
    const square = yantraForGraha(planet);
    if (!square) throw new SymbolInputError('planet', 'Choose one of the nine navagraha entries.');
    normalized = ''; grid = square.grid.map(row => [...row]); validation = validateYantra(grid);
    title = `${square.graha} (${square.en}) — navagraha square`;
    sources = [square.cite, square.provenance];
    input = { kind, planet: square.en, text: '', method: method.id };
  }
  if (!validation.ok) throw new SymbolInputError('invalid-square', 'The sourced square failed its arithmetic checks.', validation);
  const textModel = [title, method.label, method.note,
    `${grid.length} × ${grid.length}; each row, column and main diagonal sums to ${validation.constant}; total ${validation.total}.`,
    ...grid.map((row, i) => `Row ${i + 1}: ${row.join(', ')}.`),
    ...(trace ? [`Normalized letters: ${normalized}.`, ...trace.letterTrace.map((v, i) => `Letter ${i + 1}: ${v.letter}, value ${v.value}, cell ${v.cellValue}, row ${v.row + 1}, column ${v.col + 1}.`)] : ['Square only; no name trace.']), caveat];
  return { schemaVersion: 1, kind, title, inputs: { ...input, normalizedText: normalized }, grid, validation, trace, normalization,
    method: { ...method, reduction: kind === 'kamea' ? 'Out-of-range values: trailing powers of ten, then digit sum; consecutive equal cells collapse with a repeat count.' : 'Sourced offset square; repeated or shifted integers are permitted by this validator.' },
    sources: [...new Set(sources.filter(Boolean))], limits: { ...SYMBOL_LIMITS }, units: 'dimensionless integers; SVG positions in viewBox units', caveat, textModel };
}
