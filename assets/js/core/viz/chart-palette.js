// Presentation only. These tokens inherit the selected site theme, so changing
// appearance repaints an existing instrument without recasting its positions.
// Literal fallbacks keep DOM-free diagrams usable outside the site stylesheet.
// Browser downloads use state.svgToString() to freeze the computed paint.
export const CHART_PAINT = Object.freeze({
  background: 'var(--chart-bg, #f6f1e7)',
  surface: 'var(--chart-surface, #fbf8ef)',
  ink: 'var(--chart-ink, #263b36)',
  muted: 'var(--chart-muted, #60695d)',
  grid: 'var(--chart-grid, #c8c5b6)',
  line: 'var(--chart-line, #a6ae9a)',
  strong: 'var(--chart-strong, #89917e)',
  accent: 'var(--chart-accent, #9a482e)',
  focus: 'var(--chart-focus, #286a81)',
  star: 'var(--chart-star, #263b36)',
});

const BODY_FALLBACKS = Object.freeze({
  Sun: '#9a482e', Moon: '#263b36', Mercury: '#566f76', Venus: '#76586c',
  Mars: '#a04434', Jupiter: '#776123', Saturn: '#385e51', Uranus: '#3c6b78',
  Neptune: '#5b608b', Pluto: '#795d48', Earth: '#385e51', Rahu: '#76586c', Ketu: '#795d48',
});

// Identity, rather than enumeration order, connects the marker, guide, timeline
// and legend. Earth therefore keeps its own color in the heliocentric view.
export function chartBodyColor(id, fallback = CHART_PAINT.ink) {
  return Object.hasOwn(BODY_FALLBACKS, id)
    ? `var(--chart-body-${id.toLowerCase()}, ${BODY_FALLBACKS[id]})`
    : fallback;
}

const physicalBodies = new Set(['Sun','Moon','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']);
const paintXML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const localId = value => String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
const number = value => Number.isFinite(value) ? String(value) : '0';

// These layers are intentionally separate from the canonical marker. Surface
// shading, bands and rings are stylized material cues, never observed imagery,
// apparent body size, illumination, orientation or additional sky positions.
export function planetSurfaceSVG(id, {prefix, cx, cy, r, rings = true} = {}) {
  if (!physicalBodies.has(id) || ![cx,cy,r].every(Number.isFinite) || r <= 0) return '';
  const key = localId(`${prefix || 'chart'}-${id}-surface`), color = chartBodyColor(id);
  const core = 'var(--chart-planet-core, #14191f)', highlight = 'var(--chart-planet-highlight, #ffffff)';
  const circle = `cx="${cx}" cy="${cy}" r="${r}"`;
  const ring = id === 'Saturn' && rings;
  const ellipse = `cx="${cx}" cy="${cy}" rx="${r*1.5}" ry="${r*.43}" transform="rotate(-22 ${cx} ${cy})"`;
  let detail = '';
  if (id === 'Jupiter' || id === 'Saturn') {
    for (const [offset,width,opacity] of [[-.4,.14,.26],[-.05,.2,.18],[.32,.11,.3]]) {
      const y = cy + offset*r;
      detail += `<path d="M ${cx-r} ${y} Q ${cx} ${y+r*.16} ${cx+r} ${y}" fill="none" stroke="${color}" stroke-width="${r*width}" opacity="${opacity}"/>`;
    }
  } else if (id === 'Moon' || id === 'Mercury') {
    for (const [dx,dy,size] of [[-.28,-.13,.15],[.21,.3,.12],[.37,-.34,.09]]) {
      detail += `<circle cx="${cx+dx*r}" cy="${cy+dy*r}" r="${size*r}" fill="${core}" stroke="${highlight}" stroke-width="${r*.025}" opacity=".32"/>`;
    }
  }
  return `<g data-chart-decoration="planet-surface" data-surface-body="${id}" aria-hidden="true" pointer-events="none" opacity="var(--chart-planet-surface-opacity, 0)"><defs><radialGradient id="${key}" cx="28%" cy="22%" r="80%"><stop offset="0" stop-color="${highlight}" stop-opacity=".78"/><stop offset=".2" stop-color="${color}" stop-opacity=".76"/><stop offset=".53" stop-color="${color}" stop-opacity=".27"/><stop offset=".85" stop-color="${core}" stop-opacity="1"/><stop offset="1" stop-color="${core}" stop-opacity="1"/></radialGradient><clipPath id="${key}-clip"><circle ${circle}/></clipPath></defs>${ring?`<ellipse ${ellipse} fill="none" stroke="${color}" stroke-width="${Math.max(.7,r*.13)}" opacity=".4"/>`:''}<circle ${circle} fill="none" stroke="${color}" stroke-width="${Math.max(2,r*.3)}" opacity="var(--chart-glow-opacity, 0)"/><circle data-planet-disc="${id}" ${circle} fill="${core}"/><circle data-planet-shading="${id}" ${circle} fill="url(#${key})"/><g clip-path="url(#${key}-clip)" opacity="var(--chart-planet-detail-opacity, .7)">${detail}</g><circle data-planet-rim="${id}" ${circle} fill="none" stroke="${color}" stroke-width="${Math.max(.65,r*.065)}"/>${ring?`<path d="M ${cx-r*1.39} ${cy+r*.56} Q ${cx+r*.27} ${cy+r*.9} ${cx+r*1.39} ${cy-r*.56}" fill="none" stroke="${color}" stroke-width="${Math.max(.7,r*.1)}" opacity=".85"/>`:''}</g>`;
}

// Ambient depth has no point marks and cannot be mistaken for a star catalogue.
// Supply either a circle or a rectangle matching the existing instrument plate.
export function instrumentSurfaceSVG({prefix, cx, cy, r, width, height} = {}) {
  const circular = [cx,cy,r].every(Number.isFinite) && r > 0;
  if (!circular && !([width,height].every(Number.isFinite) && width > 0 && height > 0)) return '';
  const key = localId(`${prefix || 'chart'}-instrument-depth`);
  const shape = circular ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${key})"/>` : `<rect width="${width}" height="${height}" fill="url(#${key})"/>`;
  return `<g data-chart-decoration="instrument-depth" aria-hidden="true" pointer-events="none" opacity="var(--chart-depth-opacity, .04)"><defs><radialGradient id="${key}" cx="47%" cy="40%" r="62%"><stop offset="0" stop-color="var(--chart-depth-color, #acbac2)"/><stop offset=".62" stop-color="var(--chart-depth-color, #acbac2)" stop-opacity=".18"/><stop offset="1" stop-color="var(--chart-depth-color, #acbac2)" stop-opacity="0"/></radialGradient></defs>${shape}</g>`;
}

// A sharply bounded outer light layer keeps the rule's central line/dash intact.
// Native strokes remain portable to SVG/PNG and never blur text or hit targets.
export function neonStrokeSVG(tag, attrs, {color = CHART_PAINT.accent, width = 5} = {}) {
  if (!['path','line','circle','ellipse','polyline'].includes(tag)) return '';
  const geometry = Object.entries(attrs || {}).map(([key,value]) => ` ${paintXML(key)}="${paintXML(value)}"`).join('');
  return `<${tag}${geometry} data-chart-decoration="neon-stroke" aria-hidden="true" pointer-events="none" fill="none" stroke="${paintXML(color)}" stroke-width="${number(width)}" opacity="var(--chart-glow-opacity, 0)"/>`;
}
