// ============================================================================
//  art/engravings.js — THE ILLUSTRATION SYSTEM (DS3 art §4).
//  DOM-free string-builders in the site's one engraving hand (the --dg-* /
//  --orn-* stroke grammar): 15 wing frontispieces + page furniture (corner
//  ornaments, a fleuron rule, a deckled register-transition rule). Line art on
//  paper — no fills except a single ≤3px gold "pivot" dot per emblem (law G3,
//  machine-checked). Every frontispiece embeds its own <style> (the WHEEL_STYLE
//  precedent: var(--token, frozen-fallback)) so colour survives export; SVG
//  presentation attributes never use var() (unsupported there).
//
//  frontispiece(name) resolves canonical names + aliases (art §4.3 table) and
//  returns '' for an unknown name so the caller keeps its emoji fallback.
// ============================================================================
import { mulberry32 } from '../../core/skyart.js';

const nn = (v, dp = 2) => Number(Number(v).toFixed(dp));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// -- primitives (class carries the weight; see FP_STYLE) ---------------------
const C = (cls, cx, cy, r) => `<circle class="${cls}" cx="${nn(cx)}" cy="${nn(cy)}" r="${nn(r)}"/>`;
const L = (cls, x1, y1, x2, y2) => `<line class="${cls}" x1="${nn(x1)}" y1="${nn(y1)}" x2="${nn(x2)}" y2="${nn(y2)}"/>`;
const P = (cls, d) => `<path class="${cls}" d="${d}"/>`;
const POLY = (cls, pts) => `<polygon class="${cls}" points="${pts.map(p => `${nn(p[0])},${nn(p[1])}`).join(' ')}"/>`;
const TXT = (x, y, s, size = 8) => `<text x="${nn(x)}" y="${nn(y)}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${esc(s)}</text>`;
// THE ONE gold leaf per emblem — the pivot dot (fill via the .pivot class).
const GOLD = (cx, cy, r = 2.5) => `<circle class="pivot" cx="${nn(cx)}" cy="${nn(cy)}" r="${nn(r)}"/>`;
const pol = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];

const FP_STYLE =
  '.fp{color:var(--dg-ink,#2a2419)}' +
  '.fp .sil,.fp .str,.fp .det,.fp .gld{fill:none;stroke-linecap:round;stroke-linejoin:round}' +
  '.fp .sil{stroke:var(--orn-stroke-strong,#8a6a2a);stroke-width:2}' +
  '.fp .str{stroke:var(--orn-stroke,#cbbd9c);stroke-width:1.25}' +
  '.fp .det{stroke:var(--orn-stroke,#cbbd9c);stroke-width:.75}' +
  '.fp .gld{stroke:var(--orn-gold,#b8862b);stroke-width:1.25}' +
  '.fp .stip{fill:var(--orn-stroke,#cbbd9c);opacity:.4;stroke:none}' +
  '.fp .pivot{fill:var(--orn-gold,#b8862b);stroke:none}' +
  '.fp text{fill:var(--dg-ink,#2a2419);font-family:var(--serif,Georgia,serif)}';

// Shared frame (art §4.4): double rule + four corner flourishes.
function frame() {
  return `<rect class="str" x="6" y="6" width="308" height="108" rx="2" fill="none"/>` +
    `<rect class="det" x="10" y="10" width="300" height="100" rx="1" fill="none"/>` +
    P('det', 'M14,26 Q14,14 26,14') + P('det', 'M306,26 Q306,14 294,14') +
    P('det', 'M14,94 Q14,106 26,106') + P('det', 'M306,94 Q306,106 294,106');
}

// Wrap an emblem's inner geometry in the standard <svg class="fp"> shell.
function fp(label, inner) {
  // Opacity is applied by CSS (.wing-hero .fp / .fp on any host) — never as a
  // presentation attribute, where var() is invalid.
  return `<svg class="fp" viewBox="0 0 320 120" role="img" aria-label="${esc('Engraving: ' + label)}" ` +
    `xmlns="http://www.w3.org/2000/svg">` +
    `<style>${FP_STYLE}</style>${frame()}<g>${inner}</g></svg>`;
}

// ---- the 15 emblems (art §4.3) --------------------------------------------
// Each centered near (160,60); each contains exactly one GOLD() pivot.
const CX = 160, CY = 62;

function emAstrolabe() {
  let ticks = '';
  for (let a = 0; a < 360; a += 15) { const [x1, y1] = pol(CX, CY, 36, a), [x2, y2] = pol(CX, CY, 40, a); ticks += L('det', x1, y1, x2, y2); }
  return C('sil', CX, CY, 40) + C('str', CX, CY, 36) + ticks +
    C('str', CX, CY, 26) + C('str', CX, CY, 15) +
    P('det', `M${CX - 12},${CY + 6} A24,24 0 0,1 ${CX + 12},${CY + 6}`) +
    L('sil', CX - 30, CY + 22, CX + 30, CY - 22) +
    P('sil', `M${CX},${CY - 46} q8,-8 16,0`) + C('str', CX + 8, CY - 48, 3) +
    GOLD(CX, CY);
}

function emSquareFigure() {
  const s = 46; // half outer side
  const sq = [[CX - s, CY - s], [CX + s, CY - s], [CX + s, CY + s], [CX - s, CY + s]];
  const dia = [[CX, CY - s], [CX + s, CY], [CX, CY + s], [CX - s, CY]];
  return POLY('sil', sq) + POLY('str', dia) +
    L('det', CX - s, CY - s, CX + s, CY + s) + L('det', CX + s, CY - s, CX - s, CY + s) +
    // a quill crossing at ~30°
    P('sil', `M${CX - 34},${CY + 40} C${CX + 6},${CY + 20} ${CX + 30},${CY - 24} ${CX + 40},${CY - 44}`) +
    P('det', `M${CX + 40},${CY - 44} C${CX + 22},${CY - 34} ${CX + 8},${CY - 20} ${CX + 4},${CY - 6}`) +
    L('det', CX - 20, CY + 30, CX - 8, CY + 18) +
    GOLD(CX - 34, CY + 40, 2.5);
}

function emSiderealWheel() {
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const a = i * 30, long = i % 2 === 0 ? 46 : 40;
    const [tx, ty] = pol(CX, CY, long, a);
    const [lx, ly] = pol(CX, CY, 30, a - 4), [rx, ry] = pol(CX, CY, 30, a + 4);
    rays += POLY('det', [[lx, ly], [tx, ty], [rx, ry]]);
  }
  // the 27-nakṣatra ring as a single dashed circle (a "broken ring", 1 element)
  const ring = `<circle class="det" cx="${CX}" cy="${CY}" r="49" fill="none" stroke-dasharray="2 4.7"/>`;
  return C('str', CX, CY, 30) + C('sil', CX, CY, 26) + rays + ring + GOLD(CX, CY, 3);
}

function emTree() {
  // 10 sephirot in three pillars, compressed into the landscape frame.
  const S = {
    keter: [CX, 16], chokmah: [CX + 30, 30], binah: [CX - 30, 30],
    chesed: [CX + 34, 52], geburah: [CX - 34, 52], tiferet: [CX, 60],
    netzach: [CX + 30, 82], hod: [CX - 30, 82], yesod: [CX, 92], malkuth: [CX, 106]
  };
  const paths = [
    ['keter', 'chokmah'], ['keter', 'binah'], ['chokmah', 'binah'],
    ['chokmah', 'chesed'], ['binah', 'geburah'], ['chesed', 'geburah'],
    ['chokmah', 'tiferet'], ['binah', 'tiferet'], ['chesed', 'tiferet'], ['geburah', 'tiferet'],
    ['chesed', 'netzach'], ['geburah', 'hod'], ['tiferet', 'netzach'], ['tiferet', 'hod'],
    ['netzach', 'hod'], ['netzach', 'yesod'], ['hod', 'yesod'], ['tiferet', 'yesod'], ['yesod', 'malkuth']
  ];
  let edges = paths.map(([a, b]) => L('det', S[a][0], S[a][1], S[b][0], S[b][1])).join('');
  let nodes = Object.entries(S).map(([k, [x, y]]) => C('str', x, y, 6) + (k === 'keter' ? C('det', x, y, 8) : '')).join('');
  return edges + nodes + GOLD(S.tiferet[0], S.tiferet[1], 2.4);
}

function emLotus() {
  const base = [CX, CY + 26];
  const petal = ang => {
    const [ax, ay] = pol(base[0], base[1], 44, ang);
    const [c1x, c1y] = pol(base[0], base[1], 20, ang - 22), [c2x, c2y] = pol(base[0], base[1], 40, ang - 8);
    const [c3x, c3y] = pol(base[0], base[1], 40, ang + 8), [c4x, c4y] = pol(base[0], base[1], 20, ang + 22);
    return P('str', `M${nn(base[0])},${nn(base[1])} C${nn(c1x)},${nn(c1y)} ${nn(c2x)},${nn(c2y)} ${nn(ax)},${nn(ay)} C${nn(c3x)},${nn(c3y)} ${nn(c4x)},${nn(c4y)} ${nn(base[0])},${nn(base[1])}`);
  };
  let petals = '';
  [-140, -160, -180, -200, -220].forEach(a => petals += petal(a));      // upper row of 5
  [-150, -180, -210].forEach(a => petals += petal(a));                  // inner row of 3
  return petals + C('det', base[0], base[1], 6) + P('stip', `M${base[0] - 6},${base[1]} a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0`) +
    P('det', `M40,${CY + 34} q20,-6 40,0 t40,0 t40,0 t40,0 t40,0`) +
    P('det', `M40,${CY + 40} q20,6 40,0 t40,0 t40,0 t40,0 t40,0`) +
    GOLD(base[0], base[1] - 2, 2.2);
}

function emAlembic() {
  return P('sil', `M${CX - 14},${CY - 18} L${CX - 20},${CY + 18} Q${CX},${CY + 34} ${CX + 20},${CY + 18} L${CX + 14},${CY - 18} Z`) +
    P('str', `M${CX - 14},${CY - 18} Q${CX},${CY - 30} ${CX + 14},${CY - 18}`) +
    P('str', `M${CX + 6},${CY - 26} Q${CX + 30},${CY - 26} ${CX + 40},${CY - 4} L${CX + 46},${CY - 2}`) +
    C('str', CX + 48, CY + 4, 6) +
    P('det', `M${CX - 6},${CY - 22} q6,10 0,20 q-6,10 0,20`) +
    P('det', `M${CX - 8},${CY + 30} l4,10 M${CX},${CY + 32} l0,12 M${CX + 8},${CY + 30} l-4,10`) +
    GOLD(CX + 48, CY + 4, 2.2);
}

function emHeptagram() {
  const pts = [];
  for (let i = 0; i < 7; i++) pts.push(pol(CX, CY, 42, -90 + i * 360 / 7));
  let star = '';
  for (let i = 0; i < 7; i++) { const a = pts[i], b = pts[(i + 3) % 7]; star += L('str', a[0], a[1], b[0], b[1]); }
  const glyphs = ['♄', '♃', '♂', '☉', '♀', '☿', '☽'];
  let g = '';
  for (let i = 0; i < 7; i++) { const [gx, gy] = pol(CX, CY, 50, -90 + i * 360 / 7); g += TXT(gx, gy, glyphs[i], 8); }
  return C('det', CX, CY, 42) + star + g + GOLD(CX, CY, 2.4);
}

function emLoom() {
  let warp = '';
  for (let i = -4; i <= 4; i++) warp += L('det', CX + i * 10, CY - 34, CX + i * 10, CY + 34);
  let band = '';
  for (let x = CX - 42; x <= CX + 42; x += 5) band += L('det', x, CY - 8, x + 5, CY + 8);
  return L('str', CX - 46, CY - 40, CX - 46, CY + 40) + L('str', CX + 46, CY - 40, CX + 46, CY + 40) +
    warp + band +
    POLY('sil', [[CX - 20, CY], [CX, CY - 8], [CX + 20, CY], [CX, CY + 8]]) +
    GOLD(CX, CY, 2.2);
}

function emCastLots() {
  const rnd = mulberry32(31);
  let staves = '';
  for (let i = 0; i < 4; i++) {
    const x = CX - 60 + i * 8, y = CY - 30 + rnd() * 6;
    staves += L('str', x, y, x, y + 22) + L('str', x + 4, y + 2, x + 4, y + 24);
  }
  const [scx, scy] = [CX + 20, CY + 8];
  const coin = C('str', scx, scy, 12) + POLY('det', [[scx - 3, scy - 3], [scx + 3, scy - 3], [scx + 3, scy + 3], [scx - 3, scy + 3]]);
  const card = `<rect class="str" x="${CX + 40}" y="${CY - 30}" width="26" height="38" rx="2" transform="rotate(12 ${CX + 53} ${CY - 11})" fill="none"/>`;
  const star = P('det', `M${CX + 53},${CY - 20} l2,5 l5,.6 l-4,3.4 l1.4,5 l-4.4,-2.8 l-4.4,2.8 l1.4,-5 l-4,-3.4 l5,-.6 z`);
  let ground = '';
  for (let i = 0; i < 10; i++) ground += C('stip', CX - 60 + rnd() * 120, CY + 30 + rnd() * 8, 0.7);
  return staves + coin + card + star + ground + GOLD(scx, scy, 2.2);
}

function emMandala() {
  const outer = [[CX - 44, CY - 44], [CX + 44, CY - 44], [CX + 44, CY + 44], [CX - 44, CY + 44]];
  const inner = [[CX, CY - 32], [CX + 32, CY], [CX, CY + 32], [CX - 32, CY]];
  let quad = '';
  [45, 135, 225, 315].forEach(a => { const [x, y] = pol(CX, CY, 26, a); quad += C('det', x, y, 2); });
  return POLY('str', outer) + C('str', CX, CY, 40) + POLY('str', inner) + C('sil', CX, CY, 16) + quad + GOLD(CX, CY, 2.4);
}

function emHourglass() {
  return L('str', CX - 30, CY - 40, CX - 30, CY + 40) + L('str', CX + 30, CY - 40, CX + 30, CY + 40) +
    L('sil', CX - 30, CY - 40, CX + 30, CY - 40) + L('sil', CX - 30, CY + 40, CX + 30, CY + 40) +
    POLY('sil', [[CX - 26, CY - 36], [CX + 26, CY - 36], [CX, CY]]) +
    POLY('sil', [[CX - 26, CY + 36], [CX + 26, CY + 36], [CX, CY]]) +
    P('stip', `M${CX - 20},${CY + 34} a20,4 0 1,0 40,0`) +
    P('det', `M${CX - 40},${CY - 30} l3,-3 l3,3 M${CX + 34},${CY + 24} l3,-3 l3,3 M${CX + 36},${CY - 34} l3,-3 l3,3`) +
    GOLD(CX, CY, 2);
}

function emLamp() {
  return P('sil', `M${CX - 30},${CY + 10} Q${CX - 34},${CY - 6} ${CX - 10},${CY - 8} L${CX + 34},${CY - 8} Q${CX + 44},${CY} ${CX + 36},${CY + 10} Q${CX},${CY + 26} ${CX - 30},${CY + 10} Z`) +
    P('str', `M${CX + 34},${CY - 8} l8,-4`) +
    P('str', `M${CX - 6},${CY - 8} q-2,-14 4,-18 q6,4 4,18`) +
    P('det', `M${CX - 22},${CY - 22} a24,24 0 0,1 44,0`) +
    GOLD(CX - 2, CY - 24, 2.2);
}

function emCodex() {
  return P('str', `M${CX},${CY - 22} C${CX - 20},${CY - 30} ${CX - 44},${CY - 26} ${CX - 50},${CY - 22} L${CX - 50},${CY + 26} C${CX - 44},${CY + 22} ${CX - 20},${CY + 18} ${CX},${CY + 26}`) +
    P('str', `M${CX},${CY - 22} C${CX + 20},${CY - 30} ${CX + 44},${CY - 26} ${CX + 50},${CY - 22} L${CX + 50},${CY + 26} C${CX + 44},${CY + 22} ${CX + 20},${CY + 18} ${CX},${CY + 26}`) +
    L('str', CX, CY - 22, CX, CY + 26) +
    P('det', `M${CX - 42},${CY - 14} q16,-4 34,2 M${CX - 42},${CY - 6} q16,-4 34,2 M${CX - 42},${CY + 2} q16,-4 34,2`) +
    P('det', `M${CX + 8},${CY - 12} q16,-4 34,2 M${CX + 8},${CY - 4} q16,-4 34,2 M${CX + 8},${CY + 4} q16,-4 34,2`) +
    P('gld', `M${CX},${CY + 26} l0,10`) +
    GOLD(CX, CY + 36, 2.2);
}

function emArmillary() {
  return `<ellipse class="str" cx="${CX}" cy="${CY}" rx="42" ry="16" fill="none"/>` +
    `<ellipse class="str" cx="${CX}" cy="${CY}" rx="16" ry="42" fill="none"/>` +
    `<ellipse class="det" cx="${CX}" cy="${CY}" rx="34" ry="34" fill="none" transform="rotate(30 ${CX} ${CY})"/>` +
    C('str', CX, CY, 42) +
    L('sil', CX, CY - 48, CX, CY + 48) +
    L('det', CX - 46, CY, CX + 46, CY) +
    GOLD(...pol(CX, CY, 42, -35), 2.4);
}

function emBalance() {
  return L('sil', CX, CY - 38, CX, CY + 34) +
    L('sil', CX - 46, CY - 24, CX + 46, CY - 24) +
    L('det', CX - 46, CY - 24, CX - 46, CY - 6) + L('det', CX + 46, CY - 24, CX + 46, CY - 6) +
    P('str', `M${CX - 58},${CY - 6} A14,14 0 0,0 ${CX - 34},${CY - 6}`) +
    P('str', `M${CX + 34},${CY - 6} A14,14 0 0,0 ${CX + 58},${CY - 6}`) +
    P('det', `M${CX - 52},${CY - 12} l4,5 l5,-5 l4,5 l5,-5`) +
    `<rect class="det" x="${CX + 38}" y="${CY - 14}" width="14" height="10" fill="none"/>` +
    P('det', `M${CX + 38},${CY - 14} l14,10 M${CX + 52},${CY - 14} l-14,10`) +
    POLY('sil', [[CX - 8, CY + 34], [CX + 8, CY + 34], [CX, CY + 44]]) +
    GOLD(CX, CY - 38, 2.4);
}

export const FRONTISPIECES = {
  astrolabe: () => fp('an astrolabe', emAstrolabe()),
  'square-figure': () => fp('a quill and the square horary figure', emSquareFigure()),
  'sidereal-wheel': () => fp('the sidereal wheel', emSiderealWheel()),
  tree: () => fp('the Tree of Life', emTree()),
  lotus: () => fp('the lotus', emLotus()),
  alembic: () => fp('the alembic', emAlembic()),
  heptagram: () => fp('the planetary heptagram', emHeptagram()),
  loom: () => fp('the loom', emLoom()),
  'cast-lots': () => fp('the cast lots', emCastLots()),
  mandala: () => fp('the mandala', emMandala()),
  hourglass: () => fp('the hourglass', emHourglass()),
  lamp: () => fp('the oil lamp', emLamp()),
  codex: () => fp('the open codex', emCodex()),
  armillary: () => fp('the armillary sphere', emArmillary()),
  balance: () => fp('the assay balance', emBalance())
};

// name aliases → canonical emblem (art §4.3 wing mapping; B5 sets data-fp).
const ALIASES = {
  workbench: 'astrolabe', cast: 'astrolabe', tools: 'astrolabe',
  book1: 'square-figure', book2: 'square-figure', book3: 'square-figure', books: 'square-figure', quill: 'square-figure', 'quill-square': 'square-figure',
  vedic: 'sidereal-wheel',
  kabbalah: 'tree',
  yoga: 'lotus',
  rasa: 'alembic', alchemy: 'alembic',
  picatrix: 'heptagram', abhichara: 'heptagram',
  confluence: 'loom',
  oracles: 'cast-lots', divination: 'cast-lots',
  jung: 'mandala',
  chronology: 'hourglass',
  learn: 'lamp',
  library: 'codex', greatworks: 'codex', 'great-works': 'codex',
  now: 'armillary', 'right-now': 'armillary',
  experiment: 'balance', structure: 'balance', assay: 'balance'
};

// Resolve a wing name to its frontispiece SVG string; '' if unknown (caller
// keeps the emoji fallback).
export function frontispiece(name, opts = {}) {
  if (!name) return '';
  const key = String(name).toLowerCase().trim();
  const canon = FRONTISPIECES[key] ? key : ALIASES[key];
  return canon && FRONTISPIECES[canon] ? FRONTISPIECES[canon](opts) : '';
}

// ---- page furniture --------------------------------------------------------

// A 12×12 corner flourish (aria-hidden decoration) for .card--plate corners.
export function cornerOrnament(size = 12) {
  return `<svg class="orn-corner" width="${size}" height="${size}" viewBox="0 0 12 12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    `<style>${FP_STYLE}</style>` +
    P('str', 'M1,11 Q1,1 11,1') + P('det', 'M3,11 Q3,3 11,3') + GOLD(11, 1, 0.9) + `</svg>`;
}

// The hr.fancy ceremony upgrade: a centered fleuron on a gilt rule.
export function ruleFleuron(width = 320) {
  const cx = width / 2;
  return `<svg class="orn-rule" viewBox="0 0 ${width} 16" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    `<style>${FP_STYLE}</style>` +
    L('det', 8, 8, cx - 16, 8) + L('det', cx + 16, 8, width - 8, 8) +
    POLY('str', [[cx, 3], [cx + 5, 8], [cx, 13], [cx - 5, 8]]) +
    POLY('det', [[cx - 11, 8], [cx - 8, 5], [cx - 5, 8], [cx - 8, 11]]) +
    POLY('det', [[cx + 11, 8], [cx + 8, 5], [cx + 5, 8], [cx + 8, 11]]) +
    GOLD(cx, 8, 1.4) + `</svg>`;
}

// A deckled register-transition line (art §3.4): a seeded quadratic wave + a
// faint gold echo. Returns a full <svg> for a `.deckle-rule` host.
export function ruleDeckle(width = 1200, seed = 7) {
  const rnd = mulberry32(seed);
  let d = 'M0,6';
  let x = 0;
  while (x < width) {
    const wl = 55 + rnd() * 20;                 // wavelength 55–75px
    const amp = 2 + rnd() * 1;                   // ±2.5px
    const nx = Math.min(width, x + wl);
    const midx = (x + nx) / 2;
    const dir = (Math.floor(x / 40) % 2 === 0) ? -1 : 1;
    d += ` Q${nn(midx)},${nn(6 + dir * amp)} ${nn(nx)},6`;
    x = nx;
  }
  return `<svg class="deckle-svg" viewBox="0 0 ${width} 12" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    `<style>.deckle-svg .d1{fill:none;stroke:var(--orn-stroke,#cbbd9c);stroke-width:1}` +
    `.deckle-svg .d2{fill:none;stroke:var(--gold-300,#d9b15a);stroke-width:1;opacity:.45}</style>` +
    `<path class="d1" d="${d}"/><path class="d2" d="${d}" transform="translate(0,3)"/></svg>`;
}
