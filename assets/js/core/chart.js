// ============================================================================
//  chart.js — Hand-rolled SVG renderer for an astrological chart wheel in the
//  traditional style: Ascendant on the left, longitude increasing counter-
//  clockwise, the 12 houses, sign glyphs, planet glyphs, and aspect lines.
//  Pure SVG, no dependencies.
//
//  Design-System 2.0 beauty pass (WP2): size-relative proportions, degree
//  ticks, a faint elemental wash, glyph halos, cluster-fan collision handling
//  (replacing the old radius-nudge), orb-weighted aspect lines, conjunction
//  brackets, a responsive `data-density`, and an embedded <style> block so the
//  wheel is self-styled — including when the SVG is exported and opened stand-
//  alone. Colours are driven by the WP1 diagram tokens (`--dg-*`) with fall-
//  backs to the current values, so this works whether or not WP1 has landed.
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
const ELEMENTS = ['fire', 'earth', 'air', 'water'];

// The wheel's own stylesheet, embedded as an SVG <style> so the diagram is
// self-styled on the page AND when serialized/exported (state.js clones deep,
// so this rides along). Every colour prefers a WP1 `--dg-*`/semantic token and
// falls back to the byte-for-byte current value → zero drift before WP1 lands.
const FONT_SANS = "var(--font-sans, var(--sans, 'Inter','Segoe UI',system-ui,-apple-system,sans-serif))";
const WHEEL_STYLE = `
.chart-wheel{display:block;margin:0 auto}
.chart-wheel .wheel-ring{fill:var(--dg-fill,#fffdf6);stroke:var(--dg-frame,#cbbd9c);stroke-width:1}
.chart-wheel .wheel-ring:first-of-type{fill:var(--dg-fill-2,#fbf4e3);stroke-width:1.5}
.chart-wheel .elem-wash{stroke:none}
.chart-wheel .deg-tick{stroke:var(--dg-tick,#b3a37e);stroke-width:1}
.chart-wheel .deg-tick.t5,.chart-wheel .deg-tick.t10{stroke:var(--dg-grid,#c2b48f)}
.chart-wheel .sign-div{stroke:var(--dg-frame,#cbbd9c);stroke-width:1}
.chart-wheel .elem-fire{fill:var(--fire,#c0432b)}
.chart-wheel .elem-earth{fill:var(--earth,#6c7a32)}
.chart-wheel .elem-air{fill:var(--air,#2f7ca8)}
.chart-wheel .elem-water{fill:var(--water,#4a55a8)}
.chart-wheel .cusp{stroke:var(--dg-grid,#c2b48f);stroke-width:1;stroke-dasharray:3 3}
.chart-wheel .cusp-angle{stroke:var(--dg-strong,#8a6a2a);stroke-width:1.8}
.chart-wheel .aspect-hub{fill:var(--dg-fill-2,#fbf4e3);stroke:none;opacity:.55}
.chart-wheel .house-num{fill:var(--dg-label,#9b8e6e);font-family:${FONT_SANS}}
.chart-wheel .angle-tri{fill:var(--dg-sel,var(--gold,#b8862b));stroke:none}
.chart-wheel .asc-arc{fill:none;stroke:var(--dg-sel,var(--gold,#b8862b));stroke-width:2;stroke-linecap:round}
.chart-wheel .angle-label{fill:var(--accent-strong,#6b5a2a);font-family:${FONT_SANS};font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.chart-wheel .planet-leader{fill:none;stroke:var(--dg-tick,#c7b88f);stroke-width:.8}
.chart-wheel .planet-tick{stroke:var(--dg-tick,#c7b88f);stroke-width:.8}
.chart-wheel .planet-glyph{fill:var(--dg-ink,#2a2419);paint-order:stroke;stroke:var(--dg-fill,#fffdf6);stroke-width:3;stroke-linejoin:round}
.chart-wheel .planet-deg{fill:var(--text-muted,#6b6354);font-family:${FONT_SANS}}
.chart-wheel .planet.benefic .planet-glyph{fill:var(--benefic,#2f7d4f)}
.chart-wheel .planet.malefic .planet-glyph{fill:var(--malefic,#b23b2e)}
.chart-wheel .planet.lum .planet-glyph{fill:var(--lum,#b8862b)}
.chart-wheel .planet.neutral .planet-glyph{fill:var(--neutral,#6a5aa0)}
.chart-wheel .planet.point .planet-glyph{fill:#7b6f8f}
.chart-wheel .aspect-line{fill:none;stroke-width:1.1;opacity:.6}
.chart-wheel .aspect-line.asp-soft{stroke:var(--ok,#2f7d4f)}
.chart-wheel .aspect-line.asp-hard{stroke:var(--bad,#b23b2e)}
.chart-wheel .aspect-line.asp-conj{stroke:var(--asp-conj,#8a6a2a)}
.chart-wheel .aspect-line.separating{stroke-dasharray:4 4}
.chart-wheel .asp-conj-bracket{fill:none;stroke:var(--asp-conj,#8a6a2a);stroke-width:1.4;opacity:.75;stroke-linecap:round}
.chart-wheel .aspect-dot{fill:var(--bad,#b23b2e);opacity:.7}
.chart-wheel[data-density="mini"] .planet-deg{display:none}
@media print{
.chart-wheel .elem-wash{display:none}
.chart-wheel .aspect-hub{display:none}
.chart-wheel .deg-tick{stroke:#999}
.chart-wheel .angle-tri,.chart-wheel .asc-arc{fill:#8a6a2a;stroke:#8a6a2a}
}`;

// Map an ecliptic longitude to an (x,y) on a circle of radius r, with the
// Ascendant fixed at the 9-o'clock (left) position and longitude increasing CCW.
function pt(lon, ascLon, cx, cy, r) {
  const a = (180 + (lon - ascLon)) * Math.PI / 180; // radians
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

// Cluster-fan: spread the display longitudes of tightly packed planets so their
// glyphs never overlap, while the leader still points at the TRUE longitude.
// Pure function of the {name, lon} list — no DOM, deterministic, testable.
function fanDisplayLongitudes(entries, { gap = 7, step = 6, minFan = 7 } = {}) {
  const map = new Map();
  if (!entries.length) return map;
  const sorted = entries.map(e => ({ name: e.name, lon: norm360(e.lon) })).sort((a, b) => a.lon - b.lon);
  // group where the gap to the previous body is under `gap` degrees
  const clusters = [];
  let cur = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].lon - sorted[i - 1].lon < gap) cur.push(sorted[i]);
    else { clusters.push(cur); cur = [sorted[i]]; }
  }
  clusters.push(cur);
  // stitch the wrap-around seam (last cluster adjacent to the first across 0°)
  if (clusters.length > 1) {
    const first = clusters[0], last = clusters[clusters.length - 1];
    if ((first[0].lon + 360 - last[last.length - 1].lon) < gap) {
      clusters[0] = last.concat(first);
      clusters.pop();
    }
  }
  for (const cl of clusters) {
    const n = cl.length;
    if (n === 1) { map.set(cl[0].name, cl[0].lon); continue; }
    const base = cl[0].lon;
    const un = cl.map(e => { let d = e.lon - base; if (d < -180) d += 360; if (d > 180) d -= 360; return d; });
    const mid = (Math.min(...un) + Math.max(...un)) / 2;
    const span = Math.max(minFan, n * step);
    // fan monotonically in longitude order, centred on the cluster midpoint
    const order = un.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).map(p => p[1]);
    order.forEach((ci, k) => {
      const disp = mid - span / 2 + span * (k / (n - 1));
      map.set(cl[ci].name, norm360(base + disp));
    });
  }
  return map;
}

// chart: object from castChart(). aspects: array from allAspects(). options.
export function renderChart(container, chart, aspects = [], opts = {}) {
  const size = opts.size || 560;
  const cx = size / 2, cy = size / 2;
  const rOuter = size * 0.475;    // zodiac ring outer frame
  const rZodInner = size * 0.415; // inner edge of the zodiac band
  const rHouse = size * 0.30;     // house ring
  const rPlanet = size * 0.345;   // planet glyph radius (fixed; fan handles crowding)
  const rAspect = size * 0.285;   // aspect lines end inside this
  const rHub = size * 0.13;       // faint disc under the aspect crossings
  const rHouseNum = size * 0.115;
  const ascLon = chart.asc;

  const density = size >= 480 ? 'full' : size >= 380 ? 'compact' : 'mini';
  const showMinutes = density === 'full';
  const showDeg = density !== 'mini';
  const signFs = (size * 0.032).toFixed(1);
  const planetFs = (size * 0.036).toFixed(1);
  const pointFs = (size * 0.030).toFixed(1);
  const degFs = Math.max(7, size * 0.0167).toFixed(1);
  const houseNumFs = Math.max(9, size * 0.0204).toFixed(1);
  const angleFs = Math.max(8, size * 0.0185).toFixed(1);

  // Dynamic root aria-label (D4): names the ascendant, counts, and the affordance.
  const nPlanets = Object.keys(chart.planets || {}).filter(n => chart.planets[n]).length;
  const rootLabel = `Chart wheel: ${signOf(chart.asc).name} rising; ${nPlanets} planets, ${aspects.length} aspects. Interactive — planets are buttons.`;
  const svg = el('svg', {
    viewBox: `0 0 ${size} ${size}`, class: 'chart-wheel', role: 'img',
    'data-density': density, 'aria-label': rootLabel
  });
  svg.style.width = '100%'; svg.style.maxWidth = size + 'px'; svg.style.height = 'auto';

  // embedded stylesheet — makes the wheel self-styled (page + export)
  const style = el('style');
  style.textContent = WHEEL_STYLE;
  svg.appendChild(style);

  // The rotor (D4): everything that turns under wheel-rotate lives here; the four
  // ASC/MC/DSC/IC angle *labels* stay outside as the fixed cardinal frame. The
  // group carries no transform, so the rendered figure is byte-identical at rest.
  const rotor = el('g', { class: 'wheel-rotor', 'data-rot': '' });
  svg.appendChild(rotor);
  const paint = node => rotor.appendChild(node);

  // small arc helper: sampled points of the short arc between two longitudes
  const arcPts = (lonA, lonB, r) => {
    let d = ((lonB - lonA + 540) % 360) - 180;
    const steps = Math.max(2, Math.ceil(Math.abs(d) / 3));
    const out = [];
    for (let i = 0; i <= steps; i++) out.push(pt(lonA + d * (i / steps), ascLon, cx, cy, r));
    return out;
  };
  const ptsAttr = arr => arr.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

  // --- concentric rings ---
  for (const r of [rOuter, rZodInner, rHouse]) paint(el('circle', { cx, cy, r, class: 'wheel-ring' }));

  // --- faint elemental wash per 30° wedge (orientation aid; hidden in print) ---
  for (let s = 0; s < 12; s++) {
    const lon = s * 30;
    const outerArc = arcPts(lon, lon + 30, rOuter);
    const innerArc = arcPts(lon + 30, lon, rZodInner);
    paint(el('polygon', {
      points: ptsAttr(outerArc.concat(innerArc)),
      class: `elem-wash elem-${ELEMENTS[s % 4]}`, 'fill-opacity': '0.06'
    }));
  }

  // --- degree ticks inside the zodiac ring (density-gated) ---
  if (density !== 'mini') {
    for (let d = 0; d < 360; d++) {
      const isTen = d % 10 === 0, isFive = d % 5 === 0;
      if (density === 'compact' && !isFive) continue; // no 1° ticks below "full"
      const len = isTen ? 8 : isFive ? 5 : 2.5;
      const [x1, y1] = pt(d, ascLon, cx, cy, rZodInner);
      const [x2, y2] = pt(d, ascLon, cx, cy, rZodInner - len);
      paint(el('line', { x1, y1, x2, y2, class: `deg-tick${isTen ? ' t10' : isFive ? ' t5' : ''}` }));
    }
  }

  // --- sign divisions & glyphs (every 30° from 0 Aries) ---
  for (let s = 0; s < 12; s++) {
    const lon = s * 30;
    const [x1, y1] = pt(lon, ascLon, cx, cy, rZodInner);
    const [x2, y2] = pt(lon, ascLon, cx, cy, rOuter);
    paint(el('line', { x1, y1, x2, y2, class: 'sign-div' }));
    const [gx, gy] = pt(lon + 15, ascLon, cx, cy, (rZodInner + rOuter) / 2);
    const g = el('text', {
      x: gx, y: gy, class: `sign-glyph elem-${ELEMENTS[s % 4]}`, 'font-size': signFs,
      'text-anchor': 'middle', 'dominant-baseline': 'central'
    });
    g.textContent = SIGN_GLYPHS[s];
    paint(g);
  }

  // --- house cusps (lines now; numbers drawn later, atop the aspect lines) ---
  const houseNums = [];
  for (let h = 1; h <= 12; h++) {
    const lon = chart.cusps[h];
    const [x1, y1] = pt(lon, ascLon, cx, cy, rHouseNum);
    const [x2, y2] = pt(lon, ascLon, cx, cy, rHouse);
    const angular = (h === 1 || h === 4 || h === 7 || h === 10);
    // cusp + a parallel 8px transparent hit-stroke, grouped & stamped (D4)
    const cuspG = el('g', { class: 'cusp-group', 'data-el': `cusp-${h}` });
    cuspG.appendChild(el('line', { x1, y1, x2, y2, class: 'cusp-hit', stroke: 'transparent', 'stroke-width': 8 }));
    cuspG.appendChild(el('line', { x1, y1, x2, y2, class: angular ? 'cusp-angle' : 'cusp' }));
    paint(cuspG);
    const next = chart.cusps[h === 12 ? 1 : h + 1];
    const mid = lon + norm360(next - lon) / 2;
    const [nx, ny] = pt(mid, ascLon, cx, cy, rHouseNum + 14);
    houseNums.push([h, nx, ny]);
  }

  // --- faint aspect hub disc (sits under the crossing lines) ---
  paint(el('circle', { cx, cy, r: rHub, class: 'aspect-hub' }));

  // --- planet display longitudes via the cluster fan ---
  const order = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'NorthNode', 'SouthNode', 'Fortune'];
  const present = order.filter(n => chart.planets[n]).map(n => ({ name: n, lon: chart.planets[n].lon }));
  const fan = fanDisplayLongitudes(present);

  // --- aspect lines (behind planets); conjunctions as arc brackets ---
  const aspectGroup = el('g', { class: 'aspects' });
  for (const a of aspects) {
    const pa = chart.planets[a.from], pb = chart.planets[a.to];
    if (!pa || !pb) continue;
    if (a.aspect === 'Conjunction') {
      // a small arc bracket spanning the two glyphs' DISPLAY longitudes
      const la = fan.get(a.from) ?? pa.lon, lb = fan.get(a.to) ?? pb.lon;
      const cg = el('g', { class: 'asp-conj-group', 'data-el': `aspect-${a.from}-${a.to}-Conjunction`, 'data-pair': `${a.from},${a.to}` });
      cg.appendChild(el('polyline', { points: ptsAttr(arcPts(la, lb, rAspect)), class: 'asp-conj-bracket' }));
      for (const lon of [la, lb]) { // bracket feet
        const [fx1, fy1] = pt(lon, ascLon, cx, cy, rAspect);
        const [fx2, fy2] = pt(lon, ascLon, cx, cy, rAspect + 5);
        cg.appendChild(el('line', { x1: fx1, y1: fy1, x2: fx2, y2: fy2, class: 'asp-conj-bracket' }));
      }
      aspectGroup.appendChild(cg);
      continue;
    }
    const [x1, y1] = pt(pa.lon, ascLon, cx, cy, rAspect);
    const [x2, y2] = pt(pb.lon, ascLon, cx, cy, rAspect);
    const line = el('line', { x1, y1, x2, y2, class: `aspect-line ${ASPECT_CLASS[a.aspect] || ''} ${a.applying ? 'applying' : 'separating'}`, 'data-el': `aspect-${a.from}-${a.to}-${a.aspect}`, 'data-pair': `${a.from},${a.to}` });
    // width & opacity by tightness of the orb (inline → beats the stylesheet)
    const orb = typeof a.orb === 'number' ? a.orb : 3;
    const w = orb <= 1 ? 1.8 : orb <= 3 ? 1.2 : 0.8;
    const op = orb <= 1 ? 0.75 : orb <= 3 ? 0.6 : 0.45;
    line.style.strokeWidth = w + 'px';
    line.style.opacity = String(op);
    aspectGroup.appendChild(line);
    // hard aspects also carry a midpoint dot (colour-blind / print distinction)
    if (ASPECT_CLASS[a.aspect] === 'asp-hard') {
      aspectGroup.appendChild(el('circle', { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, r: 2, class: 'aspect-dot' }));
    }
  }
  paint(aspectGroup);

  // --- house numbers (on top of the aspect lines, so they stay legible) ---
  for (const [h, nx, ny] of houseNums) {
    const t = el('text', { x: nx, y: ny, class: 'house-num', 'font-size': houseNumFs, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    t.textContent = h;
    paint(t);
  }

  // --- angle marks (ASC / MC / DSC / IC): gold tick-triangle + small-caps label ---
  const angleMarks = [['ASC', chart.asc], ['DSC', chart.desc], ['MC', chart.mc], ['IC', chart.ic]];
  for (const [lbl, lon] of angleMarks) {
    const apex = pt(lon, ascLon, cx, cy, rOuter - 7);
    const bl = pt(lon - 1.4, ascLon, cx, cy, rOuter + 0.5);
    const br = pt(lon + 1.4, ascLon, cx, cy, rOuter + 0.5);
    // triangles + arc rotate with the rotor; the labels stay outside as the
    // fixed cardinal frame (D4: "ASC/MC labels stay outside").
    paint(el('polygon', { points: ptsAttr([apex, bl, br]), class: 'angle-tri' }));
    if (lbl === 'ASC') paint(el('polyline', { points: ptsAttr(arcPts(lon - 2, lon + 2, rOuter)), class: 'asc-arc' }));
    const [x, y] = pt(lon, ascLon, cx, cy, rOuter + 14);
    const t = el('text', { x, y, class: 'angle-label', 'font-size': angleFs, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    t.textContent = lbl;
    svg.appendChild(t);
  }

  // --- planets (angular fan instead of the old radius nudge) ---
  for (const name of order) {
    const p = chart.planets[name];
    if (!p) continue;
    const dispLon = fan.get(name) ?? p.lon;
    const isPoint = PLANET_CLASS[name] === 'point';
    const glyphR = size * 0.02;
    // 2-segment leader: TRUE-lon tick on the house ring → elbow → glyph at display-lon
    const P1 = pt(p.lon, ascLon, cx, cy, rHouse);
    const P2 = pt(p.lon, ascLon, cx, cy, rPlanet - glyphR);
    const P3 = pt(dispLon, ascLon, cx, cy, rPlanet - glyphR);
    paint(el('polyline', { points: ptsAttr([P1, P2, P3]), class: 'planet-leader' }));

    const [x, y] = pt(dispLon, ascLon, cx, cy, rPlanet);
    const sLbl = signOf(p.lon);
    const g = el('g', {
      class: `planet ${PLANET_CLASS[name] || ''}`,
      'data-el': `planet-${name}`, 'data-lon': p.lon.toFixed(2),
      tabindex: '0', role: 'button',
      'aria-label': `${name} ${Math.floor(sLbl.degInSign)}° ${sLbl.name}${p.retrograde ? ', retrograde' : ''} — house ${p.house}`
    });
    const glyph = el('text', { x, y, class: 'planet-glyph', 'font-size': isPoint ? pointFs : planetFs, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    glyph.textContent = PLANET_GLYPHS[name] || '?';
    g.appendChild(glyph);

    const s = signOf(p.lon);
    if (showDeg) {
      const [lx, ly] = pt(dispLon, ascLon, cx, cy, rPlanet - 16);
      const deg = el('text', { x: lx, y: ly, class: 'planet-deg', 'font-size': degFs, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
      const d = Math.floor(s.degInSign);
      deg.textContent = showMinutes
        ? `${d}°${String(Math.floor((s.degInSign - d) * 60)).padStart(2, '0')}'${p.retrograde ? '℞' : ''}`
        : `${d}°${p.retrograde ? '℞' : ''}`;
      g.appendChild(deg);
    }

    const title = el('title');
    title.textContent = `${name} ${Math.floor(s.degInSign)}° ${s.name}${p.retrograde ? ' retrograde' : ''} — house ${p.house}`;
    g.appendChild(title);
    paint(g);
  }

  container.innerHTML = '';
  container.appendChild(svg);
  return svg;
}
