// ============================================================================
//  chart.js — Hand-rolled SVG renderer for an astrological chart wheel in the
//  traditional style: Ascendant on the left, longitude increasing counter-
//  clockwise, the 12 houses, sign glyphs, planet glyphs, and aspect lines.
//  Pure SVG, no dependencies.
// ============================================================================
import { norm360, SIGN_GLYPHS, PLANET_GLYPHS, signOf } from './astro.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
};

// Element colours by traditional nature.
const PLANET_CLASS = {
  Sun: 'lum', Moon: 'lum', Jupiter: 'benefic', Venus: 'benefic',
  Saturn: 'malefic', Mars: 'malefic', Mercury: 'neutral',
  NorthNode: 'point', SouthNode: 'point', Fortune: 'point'
};
const ASPECT_CLASS = { Conjunction: 'asp-conj', Sextile: 'asp-soft', Trine: 'asp-soft', Square: 'asp-hard', Opposition: 'asp-hard' };

// Map an ecliptic longitude to an (x,y) on a circle of radius r, with the
// Ascendant fixed at the 9-o'clock (left) position and longitude increasing CCW.
function pt(lon, ascLon, cx, cy, r) {
  const a = (180 + (lon - ascLon)) * Math.PI / 180; // radians
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

// chart: object from castChart(). aspects: array from allAspects(). options.
export function renderChart(container, chart, aspects = [], opts = {}) {
  const size = opts.size || 560;
  const cx = size / 2, cy = size / 2;
  const rOuter = size * 0.47;     // zodiac ring outer
  const rSign = size * 0.42;      // sign glyph radius / inner zodiac
  const rHouse = size * 0.30;     // house ring
  const rPlanet = size * 0.355;   // planet glyph radius
  const rAspect = size * 0.285;   // aspect lines inside this
  const rHouseNum = size * 0.115;
  const ascLon = chart.asc;

  const svg = el('svg', { viewBox: `0 0 ${size} ${size}`, class: 'chart-wheel', role: 'img',
    'aria-label': 'Astrological chart wheel' });
  svg.style.width = '100%'; svg.style.maxWidth = size + 'px'; svg.style.height = 'auto';

  // outer + inner zodiac circles
  for (const r of [rOuter, rSign, rHouse]) svg.appendChild(el('circle', { cx, cy, r, class: 'wheel-ring' }));

  // --- sign divisions & glyphs (every 30° from 0 Aries) ---
  for (let s = 0; s < 12; s++) {
    const lon = s * 30;
    const [x1, y1] = pt(lon, ascLon, cx, cy, rSign);
    const [x2, y2] = pt(lon, ascLon, cx, cy, rOuter);
    svg.appendChild(el('line', { x1, y1, x2, y2, class: 'sign-div' }));
    const [gx, gy] = pt(lon + 15, ascLon, cx, cy, (rSign + rOuter) / 2);
    const g = el('text', { x: gx, y: gy, class: `sign-glyph elem-${['fire','earth','air','water'][s % 4]}`,
      'text-anchor': 'middle', 'dominant-baseline': 'central' });
    g.textContent = SIGN_GLYPHS[s];
    svg.appendChild(g);
  }

  // --- house cusps ---
  for (let h = 1; h <= 12; h++) {
    const lon = chart.cusps[h];
    const [x1, y1] = pt(lon, ascLon, cx, cy, rHouseNum);
    const [x2, y2] = pt(lon, ascLon, cx, cy, rHouse);
    const angular = (h === 1 || h === 4 || h === 7 || h === 10);
    svg.appendChild(el('line', { x1, y1, x2, y2, class: angular ? 'cusp-angle' : 'cusp' }));
    // house number near centre, placed at mid-house
    const next = chart.cusps[h === 12 ? 1 : h + 1];
    const mid = lon + norm360(next - lon) / 2;
    const [nx, ny] = pt(mid, ascLon, cx, cy, rHouseNum + 14);
    const t = el('text', { x: nx, y: ny, class: 'house-num', 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    t.textContent = h;
    svg.appendChild(t);
  }

  // --- angle labels (ASC / MC / DSC / IC) ---
  const angleMarks = [['ASC', chart.asc], ['DSC', chart.desc], ['MC', chart.mc], ['IC', chart.ic]];
  for (const [lbl, lon] of angleMarks) {
    const [x, y] = pt(lon, ascLon, cx, cy, rOuter + 12);
    const t = el('text', { x, y, class: 'angle-label', 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    t.textContent = lbl;
    svg.appendChild(t);
  }

  // --- aspect lines (drawn first, behind planets) ---
  const aspectGroup = el('g', { class: 'aspects' });
  for (const a of aspects) {
    const pa = chart.planets[a.from], pb = chart.planets[a.to];
    if (!pa || !pb) continue;
    const [x1, y1] = pt(pa.lon, ascLon, cx, cy, rAspect);
    const [x2, y2] = pt(pb.lon, ascLon, cx, cy, rAspect);
    const line = el('line', { x1, y1, x2, y2, class: `aspect-line ${ASPECT_CLASS[a.aspect] || ''} ${a.applying ? 'applying' : 'separating'}` });
    aspectGroup.appendChild(line);
  }
  svg.appendChild(aspectGroup);

  // --- planets (with simple anti-collision by nudging radius) ---
  const order = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'NorthNode', 'SouthNode', 'Fortune'];
  const placed = [];
  for (const name of order) {
    const p = chart.planets[name];
    if (!p) continue;
    let r = rPlanet;
    // nudge if too close (within 6°) to an already-placed glyph
    for (const q of placed) {
      if (Math.abs(((p.lon - q.lon + 540) % 360) - 180) < 6) r -= 18;
    }
    placed.push({ lon: p.lon, r });
    // tick from ring to planet
    const [tx1, ty1] = pt(p.lon, ascLon, cx, cy, rHouse);
    const [tx2, ty2] = pt(p.lon, ascLon, cx, cy, r + 12);
    svg.appendChild(el('line', { x1: tx1, y1: ty1, x2: tx2, y2: ty2, class: 'planet-tick' }));
    const [x, y] = pt(p.lon, ascLon, cx, cy, r);
    const g = el('g', { class: `planet ${PLANET_CLASS[name] || ''}` });
    const glyph = el('text', { x, y, class: 'planet-glyph', 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    glyph.textContent = PLANET_GLYPHS[name] || '?';
    g.appendChild(glyph);
    // degree label
    const s = signOf(p.lon);
    const [lx, ly] = pt(p.lon, ascLon, cx, cy, r - 16);
    const deg = el('text', { x: lx, y: ly, class: 'planet-deg', 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    deg.textContent = `${Math.floor(s.degInSign)}°${p.retrograde ? '℞' : ''}`;
    g.appendChild(deg);
    const title = el('title');
    title.textContent = `${name} ${Math.floor(s.degInSign)}° ${s.name}${p.retrograde ? ' retrograde' : ''} — house ${p.house}`;
    g.appendChild(title);
    svg.appendChild(g);
  }

  container.innerHTML = '';
  container.appendChild(svg);
  return svg;
}
