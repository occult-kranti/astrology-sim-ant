// ============================================================================
//  core/viz/score-bar.js — anchored score bars (dignity / ṣaḍbala / election).
//  A bar renders ONLY with its anchors: endpoints derived from the source's own
//  weights, a zero/threshold line, and ≥1 named benchmark from the source text.
//  A bar without anchors is banned — that is how numbers become horoscope
//  points. [dataviz §3.6]  Pure, deterministic, returns {svg, textModel}.
// ============================================================================
import { tag, num, svgRoot, esc } from './svg.js';

const W = 260, H = 44, PADX = 8, RAIL_Y = 18, RAIL_H = 4;

const SB_STYLE = `
.score-bar{display:block}
.score-bar .sb-rail{fill:var(--dg-grid,#c2b48f);opacity:.5}
.score-bar .sb-zero{stroke:var(--dg-strong,#8a6a2a);stroke-width:1.5}
.score-bar .sb-bar-ok{fill:var(--ok,#2f7d4f)}
.score-bar .sb-bar-bad{fill:var(--bad,#b23b2e)}
.score-bar .sb-anchor{stroke:var(--dg-label,#9b8e6e);stroke-width:1}
.score-bar .sb-anchor-label{fill:var(--dg-label,#9b8e6e);font-family:var(--font-sans,system-ui,sans-serif);font-size:9px}
.score-bar .sb-value{fill:var(--dg-ink,#2a2419);font-family:var(--font-sans,system-ui,sans-serif);font-size:12px;font-weight:700;font-variant-numeric:tabular-nums}`;

// scoreBar({value, domain:[min,max], anchors:[{v,label}], zero=0, format, label, tone})
export function scoreBar({ value, domain, anchors = [], zero = 0, format, label = '', tone = null }) {
  const [min, max] = domain;
  const fmt = format || (v => `${v > 0 ? '+' : ''}${v}`);
  const railX0 = PADX, railX1 = W - PADX - 42; // leave room for the value chip
  const span = (max - min) || 1;
  const x = v => railX0 + (Math.max(min, Math.min(max, v)) - min) / span * (railX1 - railX0);
  const zeroX = x(zero), valX = x(value);
  const positive = tone ? tone === 'ok' : value >= zero;
  const barCls = positive ? 'sb-bar-ok' : 'sb-bar-bad';
  const bx = Math.min(zeroX, valX), bw = Math.abs(valX - zeroX);

  let body = '';
  // rail
  body += tag('rect', { class: 'sb-rail', x: num(railX0), y: RAIL_Y, width: num(railX1 - railX0), height: RAIL_H, rx: 2 }, null);
  // value bar (8px tall, centred on the rail)
  body += tag('rect', { class: barCls, x: num(bx), y: RAIL_Y - 2, width: num(Math.max(0, bw)), height: 8, rx: 2 }, null);
  // zero/threshold line (full rail height ×1.6)
  body += tag('line', { class: 'sb-zero', x1: num(zeroX), y1: RAIL_Y - 5, x2: num(zeroX), y2: RAIL_Y + RAIL_H + 5 }, null);
  // anchor ticks + labels (collision: alternate above/below when < 34px apart)
  let lastX = -Infinity, below = false;
  for (const a of anchors.slice(0, 4)) {
    const ax = x(a.v);
    below = (ax - lastX < 34) ? !below : false;
    lastX = ax;
    body += tag('line', { class: 'sb-anchor', x1: num(ax), y1: RAIL_Y - 5, x2: num(ax), y2: RAIL_Y + 5 }, null);
    const ly = below ? RAIL_Y + 16 : RAIL_Y - 9;
    body += tag('text', { class: 'sb-anchor-label', x: num(ax), y: ly, 'text-anchor': 'middle' }, esc(`${a.label}`));
  }
  // value chip, right-aligned
  body += tag('text', { class: 'sb-value', x: W - PADX, y: RAIL_Y + 4, 'text-anchor': 'end' }, esc(String(fmt(value))));

  const anchorList = anchors.map(a => `${a.label} at ${fmt(a.v)}`).join(', ');
  const ariaLabel = `${label ? label + ': ' : ''}${fmt(value)} on a scale ${fmt(min)} to ${fmt(max)}${anchorList ? '; benchmarks: ' + anchorList : ''}`;
  const svg = svgRoot({ viewBox: `0 0 ${W} ${H}`, cls: 'score-bar', ariaLabel, style: SB_STYLE }, body);

  const textModel = [
    `${label || 'Score'}: ${fmt(value)} on a scale from ${fmt(min)} to ${fmt(max)} (zero at ${fmt(zero)}).`,
    ...anchors.map(a => `Benchmark: ${a.label} at ${fmt(a.v)}.`),
  ];
  return { svg, textModel };
}
