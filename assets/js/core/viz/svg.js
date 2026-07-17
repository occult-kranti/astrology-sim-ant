// ============================================================================
//  core/viz/svg.js — pure SVG/HTML string builders for the UI3 dataviz kit.
//  DOM-free, deterministic (no Date, no random). Every renderer in core/viz/**
//  builds through tag() so attribute escaping is uniform and the XML
//  well-formedness test (ui3-viz §1) has one code path to trust. [dataviz §3.1]
// ============================================================================

// Escape a value for safe inclusion in XML/HTML text or a double-quoted attr.
export const esc = s => String(s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// tag(name, attrs, children):
//   children === null           → self-closing  <name .../>
//   children === '' | string    → <name ...>children</name>
//   attrs values that are null/undefined are dropped (so optional attrs vanish).
//   Boolean false is dropped; boolean true renders a value-less-ish key="key".
export const tag = (name, attrs = {}, children = '') => {
  const a = Object.entries(attrs)
    .filter(([, v]) => v != null && v !== false)
    .map(([k, v]) => v === true ? ` ${k}="${esc(k)}"` : ` ${k}="${esc(v)}"`)
    .join('');
  return `<${name}${a}${children === null ? '/>' : `>${children}</${name}>`}`;
};

// Deterministic numeric coordinate: fixed decimal places, minus-zero normalised.
export const num = (n, dp = 2) => {
  const v = Number(Number(n).toFixed(dp));
  return Object.is(v, -0) ? 0 : v;
};

// Join an array of [x,y] points into an SVG points="" string (deterministic).
export const points = (arr, dp = 2) => arr.map(([x, y]) => `${num(x, dp)},${num(y, dp)}`).join(' ');

// Wrap an SVG body in a self-styled <svg> root with an embedded <style> block.
// styleText uses `var(--token, fallback-hex)` pairs so exports self-style — the
// same convention as core/chart.js WHEEL_STYLE (rides along on serialize/export).
export function svgRoot({ viewBox, cls, ariaLabel, role = 'img', style, extra = {} }, body) {
  const attrs = {
    xmlns: 'http://www.w3.org/2000/svg', viewBox, class: cls, role,
    'aria-label': ariaLabel, ...extra,
  };
  return tag('svg', attrs, (style ? tag('style', {}, style) : '') + body);
}
