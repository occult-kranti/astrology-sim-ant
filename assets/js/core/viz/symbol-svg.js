// Pure, self-contained SVG. The same result/geometry drives page, export and MCP.
import { tag, esc, num } from './svg.js';
import { SymbolInputError } from '../kamea.js';
const COLORS = Object.freeze({ paper: '#fffdf6', ink: '#2a2419', muted: '#655b49', grid: '#cbbd9c', trace: '#6d3926', active: '#ede0bb' });

export function renderSymbolSVG(result, opts = {}) {
  const size = opts.size === undefined ? 480 : opts.size;
  if (!Number.isFinite(size) || size < 240 || size > 2048) throw new SymbolInputError('svg-size', 'SVG size must be 240–2048 viewBox units.');
  const grid = result?.grid, n = grid?.length;
  if (!Array.isArray(grid) || !n || n > 9 || !grid.every(row => Array.isArray(row) && row.length === n && row.every(Number.isFinite))) throw new SymbolInputError('svg-grid', 'A finite square grid is required.');
  const steps = result.trace?.steps || [];
  const count = opts.traceStep == null ? steps.length : opts.traceStep;
  if (!Number.isInteger(count) || count < 0 || count > steps.length) throw new SymbolInputError('trace-step', 'Trace step is a count from zero to the number of path steps.');
  const padding = 12, top = 36, cellSize = (size - 2 * padding) / n, height = size + 78;
  const cells = grid.flatMap((row, r) => row.map((value, c) => ({ row: r, col: c, value,
    x: padding + (c + .5) * cellSize, y: top + (r + .5) * cellSize })));
  const trace = steps.map((step, index) => {
    if (!Number.isInteger(step.row) || !Number.isInteger(step.col) || step.row < 0 || step.col < 0 || step.row >= n || step.col >= n) throw new SymbolInputError('trace-cell', 'Trace cell is outside the square.');
    return { ...step, index, x: padding + (step.col + .5) * cellSize, y: top + (step.row + .5) * cellSize };
  });
  const visible = trace.slice(0, count), active = opts.traceStep != null ? visible.at(-1) : null;
  let body = tag('title', {}, esc(result.title)) + tag('desc', {}, esc(result.textModel.join(' '))) +
    tag('metadata', {}, esc(JSON.stringify({ schemaVersion: result.schemaVersion, inputs: result.inputs, method: result.method,
      sources: result.sources, caveat: result.caveat, validation: result.validation, construction: { visibleSteps: count, totalSteps: steps.length, complete: count === steps.length } })));
  body += tag('rect', { width: size, height, fill: COLORS.paper }, null);
  body += tag('text', { x: size / 2, y: 23, 'text-anchor': 'middle', 'font-size': num(Math.min(14, (size - 24) / (Array.from(result.title).length * .65))), 'font-weight': 600 }, esc(result.title));
  for (const c of cells) {
    body += tag('rect', { x: num(c.x - cellSize / 2), y: num(c.y - cellSize / 2), width: num(cellSize), height: num(cellSize),
      fill: active?.row === c.row && active?.col === c.col ? COLORS.active : COLORS.paper, stroke: COLORS.grid, 'stroke-width': 1 }, null);
    body += tag('text', { x: num(c.x), y: num(c.y), 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-size': num(Math.min(30, cellSize * .32)), fill: COLORS.muted }, String(c.value));
  }
  if (visible.length) {
    if (visible.length > 1) body += tag('polyline', { points: visible.map(p => `${num(p.x)},${num(p.y)}`).join(' '),
      fill: 'none', stroke: COLORS.trace, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, null);
    const first = visible[0], last = visible.at(-1), before = visible.at(-2) || last;
    body += tag('circle', { cx: num(first.x), cy: num(first.y), r: num(Math.max(5, cellSize * .12)), fill: 'none', stroke: COLORS.trace, 'stroke-width': 3 }, null);
    // The end bar marks a completed path, never a temporary playback cursor.
    if (count === trace.length) {
      const angle = Math.atan2(last.y - before.y, last.x - before.x), half = Math.max(6, cellSize * .15);
      body += tag('line', { x1: num(last.x - half * Math.sin(angle)), y1: num(last.y + half * Math.cos(angle)),
        x2: num(last.x + half * Math.sin(angle)), y2: num(last.y - half * Math.cos(angle)), stroke: COLORS.trace, 'stroke-width': 3 }, null);
    }
    for (const p of visible.filter(s => s.repeats > 1)) body += tag('path', { d: `M ${num(p.x - 10)} ${num(p.y + cellSize * .24)} q 5 -6 10 0 q 5 6 10 0`,
      fill: 'none', stroke: COLORS.trace, 'stroke-width': 2 }, null);
  }
  const summary = `Order ${n} · line sum ${result.validation.constant} · total ${result.validation.total}`;
  body += tag('text', { x: size / 2, y: size + 35, 'text-anchor': 'middle', 'font-size': 12 }, esc(summary));
  body += tag('text', { x: size / 2, y: size + 54, 'text-anchor': 'middle', 'font-size': 10 }, esc(`Method: ${result.method.id} · ${count}/${steps.length} trace steps`));
  body += tag('text', { x: size / 2, y: size + 70, 'text-anchor': 'middle', 'font-size': 9, fill: COLORS.muted }, 'Study diagram · source and method in SVG metadata');
  const svg = tag('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: `0 0 ${size} ${height}`, width: size, height,
    role: 'img', 'aria-label': result.title, fill: COLORS.ink, 'font-family': 'system-ui, sans-serif', 'data-viz': 'symbol' }, body);
  return { svg, textModel: [...result.textModel], geometry: { size, height, padding, top, cellSize, cells, trace },
    construction: { visibleSteps: count, totalSteps: trace.length, complete: count === trace.length } };
}
