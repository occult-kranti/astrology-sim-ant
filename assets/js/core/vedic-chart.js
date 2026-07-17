// ============================================================================
//  core/vedic-chart.js — North & South Indian rāśi figures (chart-ux §7.5's
//  renderer, drawn per dataviz §3.4). Pure, deterministic, DOM-free; returns
//  {svg, textModel}. The host builds `model` from castVedic() output.
//
//  CONVENTIONS VERIFIED (accuracy-check skill, 2026-07; verdict: AGREE across
//  ≥3 independent authorities):
//   • North Indian = FIXED bhāvas; House 1 is the top-centre diamond; houses are
//     counted ANTICLOCKWISE (H2 = upper-left triangle …); each house shows its
//     SIGN NUMBER (Aries=1 … Pisces=12), the lagna sign sitting in House 1.
//   • South Indian = FIXED signs in a 4×4 grid; Pisces top-left (0,0), Aries
//     (0,1) proceeding CLOCKWISE to Virgo bottom-right (3,3); the lagna cell is
//     marked with a diagonal corner stroke; houses count from lagna clockwise.
//   Sources: edithhathaway.com/how-to-read-a-north-indian-chart (H1 top,
//   counter-clockwise, signs 1–12); vedicplanet.com/jyotish (South: Pisces
//   top-left, Virgo bottom-right, clockwise from Aries); innerknowing.yoga &
//   gitudivinetouch.com (South fixed-sign, lagna dash). Consistent with JHora
//   (P.V.R. Narasimha Rao) & Parāśara BPHS whole-sign house model. The §3.4
//   geometry tables below are LAYOUT (verified against JHora renderings), not
//   doctrine; the sign→house mapping is the doctrinal part and is verified.
// ============================================================================
import { tag, num, points, svgRoot, esc } from './viz/svg.js';
import { SIGNS } from './astro.js';

const GRAHA_CLASS = {
  Sun: 'lum', Moon: 'lum', Jupiter: 'benefic', Venus: 'benefic',
  Saturn: 'malefic', Mars: 'malefic', Mercury: 'neutral',
  Rahu: 'point', Ketu: 'point', NorthNode: 'point', SouthNode: 'point',
};

// North-Indian fixed-house geometry at a 400×400 base (dataviz §3.4 table).
const NORTH = {
  1: { poly: [[200, 0], [100, 100], [200, 200], [300, 100]], sign: [200, 58], stack: [200, 120] },
  2: { poly: [[0, 0], [200, 0], [100, 100]], sign: [100, 26], stack: [100, 62] },
  3: { poly: [[0, 0], [100, 100], [0, 200]], sign: [28, 100], stack: [62, 100] },
  4: { poly: [[0, 200], [100, 100], [200, 200], [100, 300]], sign: [58, 200], stack: [120, 200] },
  5: { poly: [[0, 400], [0, 200], [100, 300]], sign: [28, 300], stack: [62, 300] },
  6: { poly: [[0, 400], [100, 300], [200, 400]], sign: [100, 374], stack: [100, 338] },
  7: { poly: [[200, 400], [100, 300], [200, 200], [300, 300]], sign: [200, 342], stack: [200, 280] },
  8: { poly: [[400, 400], [200, 400], [300, 300]], sign: [300, 374], stack: [300, 338] },
  9: { poly: [[400, 400], [300, 300], [400, 200]], sign: [372, 300], stack: [338, 300] },
  10: { poly: [[400, 200], [300, 100], [200, 200], [300, 300]], sign: [342, 200], stack: [280, 200] },
  11: { poly: [[400, 0], [400, 200], [300, 100]], sign: [372, 100], stack: [338, 100] },
  12: { poly: [[400, 0], [300, 100], [200, 0]], sign: [300, 26], stack: [300, 62] },
};

// South-Indian fixed sign → [row, col] (0-indexed from top-left) at the 4×4 grid.
const SOUTH_CELL = {
  1: [0, 1], 2: [0, 2], 3: [0, 3], 4: [1, 3], 5: [2, 3], 6: [3, 3],
  7: [3, 2], 8: [3, 1], 9: [3, 0], 10: [2, 0], 11: [1, 0], 12: [0, 0],
};

const VEDIC_STYLE = `
.rasi-chart{display:block;font-family:var(--font-sans,system-ui,sans-serif)}
.rasi-chart .rc-frame{fill:none;stroke:var(--dg-frame,#cbbd9c);stroke-width:1}
.rasi-chart .rc-frame.rc-outer{stroke-width:1.5}
.rasi-chart .rc-hit{fill:transparent;stroke:none}
.rasi-chart .rc-signnum{fill:var(--dg-label,#9b8e6e);font-size:13px}
.rasi-chart .rc-title{fill:var(--dg-strong,#8a6a2a);font-size:13px;font-weight:700}
.rasi-chart .rc-lagna-mark{stroke:var(--dg-strong,#8a6a2a);stroke-width:2}
.rasi-chart .rc-lagna-cell{fill:var(--dg-fill-2,#fbf4e3)}
.rasi-chart .rc-graha{font-size:16px;fill:var(--dg-ink,#2a2419)}
.rasi-chart .rc-graha.benefic{fill:var(--benefic,#2f7d4f)}
.rasi-chart .rc-graha.malefic{fill:var(--malefic,#b23b2e)}
.rasi-chart .rc-graha.lum{fill:var(--lum,#b8862b)}
.rasi-chart .rc-graha.neutral{fill:var(--neutral,#6a5aa0)}
.rasi-chart .rc-graha.point{fill:#7b6f8f}
.rasi-chart .rc-deg{font-size:9px;fill:var(--text-muted,#6b6354)}
.rasi-chart .is-hot .rc-hit{fill:var(--accent-wash,rgba(184,134,43,.14))}`;

const signName = n => SIGNS[(n - 1 + 12) % 12] || '';

// Draw a vertical graha stack around an anchor (two columns when >4 occupants).
function stackGrahas(grahas, ax, ay, k) {
  if (!grahas || !grahas.length) return '';
  const twoCol = grahas.length > 4;
  const cols = twoCol ? [grahas.slice(0, Math.ceil(grahas.length / 2)), grahas.slice(Math.ceil(grahas.length / 2))] : [grahas];
  let out = '';
  cols.forEach((col, ci) => {
    const cx = twoCol ? ax + (ci === 0 ? -16 : 16) * k : ax;
    const y0 = ay - (col.length - 1) / 2 * 18 * k;
    col.forEach((g, i) => {
      const gy = y0 + i * 18 * k;
      const cls = `rc-graha ${GRAHA_CLASS[g.id] || 'neutral'}`;
      out += tag('text', { class: cls, x: num(cx), y: num(gy), 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': num(16 * k, 1) }, esc(`${g.glyph || g.id}`));
      if (g.deg != null) out += tag('text', { class: 'rc-deg', x: num(cx), y: num(gy + 11 * k), 'text-anchor': 'middle', 'font-size': num(9 * k, 1) }, esc(`${Math.floor(g.deg)}°${g.retro ? '℞' : ''}`));
    });
  });
  return out;
}

function grahaList(grahas) {
  return grahas && grahas.length ? grahas.map(g => `${g.id} ${Math.floor(g.deg ?? 0)}°${g.retro ? ' retrograde' : ''}`).join(', ') : 'empty';
}

function houseGroup(n, signNum, grahas, hit, signAnchor, k) {
  const label = `House ${n}, ${signName(signNum)}: ${grahaList(grahas)}`;
  let inner = tag('polygon', { class: 'rc-hit', points: hit }, null);
  if (signAnchor) inner += tag('text', { class: 'rc-signnum', x: num(signAnchor[0]), y: num(signAnchor[1]), 'text-anchor': 'middle', 'dominant-baseline': 'central' }, String(signNum));
  return { g: (extra) => tag('g', { class: 'rc-bhava', 'data-el': `bhava-${n}`, tabindex: '0', role: 'button', 'aria-label': label }, inner + extra), label };
}

// northIndianChart(model, opts) → {svg, textModel}
export function northIndianChart(model, opts = {}) {
  const size = opts.size || 400;
  const k = size / 400;
  const S = ([x, y]) => [x * k, y * k];
  const bySign = {};
  (model.houses || []).forEach(h => { bySign[h.house] = h; });

  let body = '';
  // frame: outer square, both diagonals, midpoint rhombus
  body += tag('rect', { class: 'rc-frame rc-outer', x: 0, y: 0, width: num(400 * k), height: num(400 * k) }, null);
  body += tag('line', { class: 'rc-frame', x1: 0, y1: 0, x2: num(400 * k), y2: num(400 * k) }, null);
  body += tag('line', { class: 'rc-frame', x1: num(400 * k), y1: 0, x2: 0, y2: num(400 * k) }, null);
  body += tag('polygon', { class: 'rc-frame', points: points([S([200, 0]), S([400, 200]), S([200, 400]), S([0, 200])]) }, null);

  const textModel = [];
  for (let h = 1; h <= 12; h++) {
    const geo = NORTH[h];
    const house = bySign[h] || { house: h, sign: h, grahas: [] };
    const hit = points(geo.poly.map(S));
    const built = houseGroup(h, house.sign, house.grahas, hit, S(geo.sign), k);
    body += built.g(stackGrahas(house.grahas, ...S(geo.stack), k));
    textModel.push(`House ${h} (${signName(house.sign)}): ${grahaList(house.grahas)}.`);
  }

  const svg = svgRoot({
    viewBox: `0 0 ${num(size)} ${num(size)}`, cls: 'rasi-chart rasi-north',
    ariaLabel: `North Indian rāśi chart, ${opts.varga || 'D1'}${opts.title ? ' — ' + opts.title : ''}`,
    style: VEDIC_STYLE, extra: { 'data-viz': 'vedic-chart', 'data-style': 'north' },
  }, body);
  return { svg, textModel };
}

// southIndianChart(model, opts) → {svg, textModel}
export function southIndianChart(model, opts = {}) {
  const size = opts.size || 400;
  const cell = size / 4;
  const lagnaSign = model.lagnaSign || (model.houses && model.houses[0] && model.houses[0].sign) || 1;
  const bySign = {};
  (model.houses || []).forEach(h => { bySign[h.sign] = h; });

  let body = '';
  // 4×4 grid frame — outer square plus the inner lines that bound the 12 cells
  body += tag('rect', { class: 'rc-frame rc-outer', x: 0, y: 0, width: num(size), height: num(size) }, null);
  // lagna cell fill (drawn before strokes so the fill sits under the grid)
  const [lr, lc] = SOUTH_CELL[lagnaSign];
  body += tag('rect', { class: 'rc-lagna-cell', x: num(lc * cell), y: num(lr * cell), width: num(cell), height: num(cell) }, null);
  // grid lines
  for (let i = 1; i < 4; i++) {
    body += tag('line', { class: 'rc-frame', x1: num(i * cell), y1: 0, x2: num(i * cell), y2: num(size) }, null);
    body += tag('line', { class: 'rc-frame', x1: 0, y1: num(i * cell), x2: num(size), y2: num(i * cell) }, null);
  }
  // centre 2×2 title / varga label
  body += tag('text', { class: 'rc-title', x: num(size / 2), y: num(size / 2 - 8), 'text-anchor': 'middle', 'dominant-baseline': 'central' }, opts.varga || 'D1');
  if (opts.title) body += tag('text', { class: 'rc-signnum', x: num(size / 2), y: num(size / 2 + 12), 'text-anchor': 'middle', 'dominant-baseline': 'central' }, opts.title);

  const textModel = [];
  for (let signNum = 1; signNum <= 12; signNum++) {
    const [r, c] = SOUTH_CELL[signNum];
    const x = c * cell, y = r * cell;
    const house = bySign[signNum] || null;
    const houseNum = house ? house.house : ((signNum - lagnaSign + 12) % 12) + 1;
    const grahas = house ? house.grahas : [];
    const label = `House ${houseNum}, ${signName(signNum)}: ${grahaList(grahas)}`;
    let inner = tag('rect', { class: 'rc-hit', x: num(x), y: num(y), width: num(cell), height: num(cell) }, null);
    if (signNum === lagnaSign) {
      inner += tag('line', { class: 'rc-lagna-mark', x1: num(x), y1: num(y + 22 * (size / 400)), x2: num(x + 22 * (size / 400)), y2: num(y) }, null);
    }
    if (opts.houseNumbers) inner += tag('text', { class: 'rc-signnum', x: num(x + 6), y: num(y + 14), 'text-anchor': 'start' }, String(houseNum));
    inner += stackGrahas(grahas, x + cell / 2, y + cell / 2, size / 400);
    body += tag('g', { class: 'rc-bhava', 'data-el': `bhava-${houseNum}`, tabindex: '0', role: 'button', 'aria-label': label }, inner);
    textModel.push(`House ${houseNum} (${signName(signNum)}): ${grahaList(grahas)}.`);
  }
  // keep textModel in house order for the covenant reading
  textModel.sort((a, b) => (parseInt(a.match(/House (\d+)/)[1]) - parseInt(b.match(/House (\d+)/)[1])));

  const svg = svgRoot({
    viewBox: `0 0 ${num(size)} ${num(size)}`, cls: 'rasi-chart rasi-south',
    ariaLabel: `South Indian rāśi chart, ${opts.varga || 'D1'}${opts.title ? ' — ' + opts.title : ''}`,
    style: VEDIC_STYLE, extra: { 'data-viz': 'vedic-chart', 'data-style': 'south' },
  }, body);
  return { svg, textModel };
}
