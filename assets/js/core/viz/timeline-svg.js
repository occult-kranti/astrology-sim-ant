// ============================================================================
//  core/viz/timeline-svg.js — the SHARED PERIOD STRIP (chart-ux §7.7, drawn
//  here). One renderer for vimśottarī, firdāriā, ZR, profections, and the
//  transit hit-density strip. Pure, deterministic; `now` is a parameter (core
//  takes no Date.now()). Returns {svg, textModel, geometry}. [dataviz §3.3]
//
//  OWNERSHIP: this file is Builder 2's (ui3-partition.md). If it ever appears as
//  a one-line stub, that is a merge/partition accident — this is the real module.
//
//  Note (deviation from §3.3, recorded): on-figure long labels are truncated to
//  the segment width rather than clipped by a per-segment <clipPath>. This keeps
//  the SVG free of document-global clipPath ids (several strips coexist on one
//  page) and XML-clean; the FULL label is always carried in `textModel` and thus
//  the fig-print-list, so the covenant's text form is intact. [dataviz §2 print]
// ============================================================================
import { tag, num, points, svgRoot, esc } from './svg.js';
import { timeTicks } from './scale.js';

const GUTTER = 90, PAD = 8;
const LORD_CLASS = {
  Sun: 'lum', Moon: 'lum', Jupiter: 'ben', Venus: 'ben',
  Saturn: 'mal', Mars: 'mal', Mercury: 'neu',
  Rahu: 'node', Ketu: 'node', NorthNode: 'node', SouthNode: 'node',
};
const MARKER_CLASS = { hit: 'mk-hit', station: 'mk-station', ingress: 'mk-ingress', lob: 'mk-lob' };

const STRIP_STYLE = `
.period-strip{display:block;font-family:var(--font-sans,system-ui,sans-serif)}
.period-strip .ps-lane-label{fill:var(--dg-label,#9b8e6e);font-size:11px}
.period-strip .ps-seg rect{stroke:var(--dg-frame,#cbbd9c);stroke-width:1}
.period-strip .ps-seg.seg-lum rect{fill:var(--viz-seg-lum,#f2e2bb)}
.period-strip .ps-seg.seg-ben rect{fill:var(--viz-seg-ben,#d8efd6)}
.period-strip .ps-seg.seg-mal rect{fill:var(--viz-seg-mal,#f6d9d9)}
.period-strip .ps-seg.seg-neu rect{fill:var(--viz-seg-neu,#e6e0f2)}
.period-strip .ps-seg.seg-node rect{fill:var(--viz-seg-node,#e4e0ea)}
.period-strip .ps-seg.seg-current rect{stroke:var(--dg-sel,#b8862b);stroke-width:2}
.period-strip .ps-seg-label{fill:var(--dg-ink,#2a2419);font-size:11px}
.period-strip .ps-axis-line{stroke:var(--dg-grid,#c2b48f);stroke-width:1}
.period-strip .ps-axis-label{fill:var(--dg-label,#9b8e6e);font-size:10px}
.period-strip .ps-now-line{stroke:var(--viz-now,#8a6a2a);stroke-width:1.5}
.period-strip .ps-now-tri{fill:var(--viz-now,#8a6a2a)}
.period-strip .ps-now-label{fill:var(--viz-now,#8a6a2a);font-size:10px}
.period-strip .ps-marker.mk-hit{stroke:var(--bad,#b23b2e)}
.period-strip .ps-marker.mk-station{stroke:var(--neutral,#6a5aa0)}
.period-strip .ps-marker.mk-ingress{stroke:var(--dg-strong,#8a6a2a)}
.period-strip .ps-marker.mk-lob{stroke:var(--dg-strong,#8a6a2a)}
.period-strip .ps-marker line{stroke-width:1.5}`;

const iso = t => new Date(t).toISOString().slice(0, 10);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function periodStrip(model, opts = {}) {
  const { domain, now = null, lanes = [], markers = [] } = model;
  const width = opts.width || 960;
  const laneH = opts.laneH || 28;
  const laneGap = opts.laneGap || 6;
  const axis = opts.axis !== false;
  const [t0, t1] = domain;
  const span = (t1 - t0) || 1;
  const nLanes = lanes.length;
  const lanesH = nLanes * laneH + Math.max(0, nLanes - 1) * laneGap;
  const axisH = axis ? 22 : 0;
  const markerH = markers.length ? 14 : 0;
  const H = lanesH + axisH + markerH;
  const px0 = GUTTER, px1 = width - PAD;
  const xOf = t => px0 + (clamp(t, t0, t1) - t0) / span * (px1 - px0);
  const charFit = w => Math.max(0, Math.floor((w - 8) / 5.8));
  const trunc = (s, w) => { const c = charFit(w); return s.length <= c ? s : (c > 1 ? s.slice(0, c - 1) + '…' : ''); };

  let body = '';
  const textModel = [];

  // --- lanes + segments ---
  lanes.forEach((lane, li) => {
    const laneY = li * (laneH + laneGap);
    const cy = laneY + laneH / 2;
    body += tag('text', { class: 'ps-lane-label', x: 6, y: num(cy + 3) }, esc(`${lane.label || lane.id}`));
    const segSentences = [];
    for (const seg of lane.segments || []) {
      const s = clamp(seg.start, t0, t1), e = clamp(seg.end, t0, t1);
      if (e <= t0 || s >= t1) { segSentences.push(`${seg.label}${seg.current ? ' (current)' : ''}`); continue; }
      const x0 = xOf(s), x1 = xOf(e), w = x1 - x0;
      const cls = LORD_CLASS[seg.lord] || 'neu';
      const segCls = `ps-seg seg-${cls}${seg.current ? ' seg-current' : ''}`;
      let inner = tag('rect', { x: num(x0), y: num(laneY + 3), width: num(Math.max(0, w)), height: laneH - 6, rx: 3 }, null);
      const fullLabel = `${seg.current ? '▸ ' : ''}${seg.label || ''}`;
      if (w >= 56) {
        inner += tag('text', { class: 'ps-seg-label', x: num(x0 + 6), y: num(cy + 3) }, esc(trunc(fullLabel, w)));
      } else if (w >= 18) {
        inner += tag('text', { class: 'ps-seg-label', x: num(x0 + w / 2), y: num(cy + 3), 'text-anchor': 'middle' }, esc(`${seg.short || ''}`));
      } else {
        inner += tag('text', { class: 'ps-seg-label lbl-quiet', x: num(x0 + 2), y: num(cy + 3), style: 'display:none' }, esc(`${fullLabel}`));
      }
      body += tag('g', {
        class: segCls, 'data-el': seg.id, 'data-t0': iso(seg.start), 'data-t1': iso(seg.end),
        tabindex: seg.focusable ? '0' : null, role: seg.focusable ? 'button' : null,
      }, inner + tag('title', {}, esc(`${seg.label || seg.id}`)));
      segSentences.push(`${seg.label}${seg.current ? ' (current)' : ''}`);
    }
    textModel.push(`${lane.label || lane.id}: ${segSentences.join(', ')}.`);
  });

  // --- axis ---
  if (axis) {
    for (const tk of timeTicks([t0, t1], px1 - px0)) {
      const x = xOf(tk.t);
      body += tag('line', { class: 'ps-axis-line', x1: num(x), y1: 0, x2: num(x), y2: lanesH }, null);
      body += tag('text', { class: 'ps-axis-label', x: num(x), y: num(lanesH + 13), 'text-anchor': 'middle' }, tk.label);
    }
  }

  // --- markers row (clustered within 3px) ---
  if (markers.length) {
    const my = lanesH + axisH;
    const sorted = markers.slice().sort((a, b) => a.t - b.t);
    const clusters = [];
    for (const m of sorted) {
      const x = xOf(m.t);
      const last = clusters[clusters.length - 1];
      if (last && Math.abs(x - last.x) < 3) { last.count++; last.items.push(m); }
      else clusters.push({ x, count: 1, items: [m], kind: m.kind, id: m.id, label: m.label });
    }
    for (const c of clusters) {
      const cls = `ps-marker ${MARKER_CLASS[c.kind] || 'mk-hit'}`;
      body += tag('g', {
        class: cls, 'data-el': c.id, 'data-count': c.count > 1 ? c.count : null, 'data-t0': iso(c.items[0].t),
      }, tag('line', { x1: num(c.x), y1: num(my), x2: num(c.x), y2: num(my + 7) }, null)
        + tag('title', {}, esc(`${c.label || c.id}${c.count > 1 ? ` (${c.count})` : ''}`)));
    }
    const dense = clusters.reduce((a, c) => a + c.count, 0);
    textModel.push(`${dense} point event${dense === 1 ? '' : 's'} marked across the window.`);
  }

  // --- now marker (last, on top) ---
  if (now != null && now >= t0 && now <= t1) {
    const x = xOf(now);
    body += tag('line', { class: 'ps-now-line', x1: num(x), y1: 0, x2: num(x), y2: lanesH }, null);
    body += tag('polygon', { class: 'ps-now-tri', points: points([[x - 4, 0], [x + 4, 0], [x, 6]]) }, null);
    body += tag('text', { class: 'ps-now-label', x: num(x + 6), y: 9 }, 'now');
  }

  const ariaLabel = opts.ariaLabel || `Period strip, ${new Date(t0).getUTCFullYear()} to ${new Date(t1).getUTCFullYear()}`;
  const svg = svgRoot({
    viewBox: `0 0 ${width} ${H}`, cls: 'period-strip', ariaLabel, style: STRIP_STYLE,
    extra: { 'data-viz': 'period-strip', 'data-domain': `${t0},${t1}` },
  }, body);

  return { svg, textModel, geometry: { width, height: H, px0, px1, lanesH } };
}
