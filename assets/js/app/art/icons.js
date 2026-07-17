// ============================================================================
//  art/icons.js — THE INSTRUMENT ICON SET (DS3 art §5, §6.2).
//  One JS-injected SVG sprite: 44 <symbol>s (compass-and-rule engraving grammar,
//  24×24, stroke=currentColor 1.75, fill:none, round caps/joins, ≤8 paths) plus
//  the four <pattern> defs the epistemic-texture layer and the atlas reference
//  by id. Offline-proof and file://-proof (no external sprite fetch). Icons are
//  reinforcement beside text labels — icon-only buttons must carry aria-label.
//
//  injectIcons() idempotently prepends the sprite to <body>; shared.js calls it
//  during chrome injection. Usage:  <svg class="icon" aria-hidden="true"><use
//  href="#i-export-svg"></use></svg>
// ============================================================================

// Each entry is the inner geometry; the wrapping <symbol> supplies the shared
// stroke grammar so every glyph inherits it (≤8 paths, half-pixel construction).
const ICONS = {
  'i-cast': '<path d="M6 5l1.8 4"/><path d="M12 4l1 5"/><path d="M17.5 6l-1.8 4"/><circle cx="12" cy="17.5" r="1.2"/><path d="M5 20h14"/>',
  'i-recast': '<path d="M18.5 8A7 7 0 1 0 20 13"/><path d="M19.5 4.5V9h-4.5"/><circle cx="12" cy="12" r="1.2"/>',
  'i-wheel': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  'i-table': '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 15h17M9.5 5v14M15 5v14"/>',
  'i-ledger': '<path d="M7 7h10M7 12h10M7 17h10"/><circle cx="3.8" cy="7" r=".9"/><circle cx="3.8" cy="12" r=".9"/><circle cx="3.8" cy="17" r=".9"/>',
  'i-filter': '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
  'i-search': '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/>',
  'i-reset': '<path d="M5.5 8A7 7 0 1 1 4 13"/><path d="M4.5 4.5V9H9"/>',
  'i-settings': '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3.2M12 18.8V22M22 12h-3.2M5.2 12H2M19.1 4.9l-2.3 2.3M7.2 16.8l-2.3 2.3M19.1 19.1l-2.3-2.3M7.2 7.2 4.9 4.9"/>',
  'i-layers': '<path d="M12 3l8 5-8 5-8-5z"/><path d="M4 13l8 5 8-5"/>',
  'i-rail': '<path d="M6 4v16"/><path d="M6 8h10M6 12h12M6 16h8"/>',
  'i-zoom-in': '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20M10 7v6M7 10h6"/>',
  'i-zoom-out': '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20M7 10h6"/>',
  'i-fit': '<path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"/>',
  'i-minimap': '<rect x="3.5" y="4" width="17" height="16" rx="2"/><rect x="12" y="12" width="6" height="5" rx="1"/>',
  'i-prev': '<path d="M14 6l-6 6 6 6"/>',
  'i-next': '<path d="M10 6l6 6-6 6"/>',
  'i-up': '<path d="M6 14l6-6 6 6"/>',
  'i-down': '<path d="M6 10l6 6 6-6"/>',
  'i-play': '<path d="M8 5l11 7-11 7z"/>',
  'i-pause': '<path d="M9 5v14M15 5v14"/>',
  'i-step': '<path d="M7 5v14"/><path d="M11 5l9 7-9 7z"/>',
  'i-copy-link': '<path d="M9.5 14.5l5-5"/><path d="M10.5 6.5l1-1a3.8 3.8 0 0 1 5.5 5.5l-1 1"/><path d="M13.5 17.5l-1 1a3.8 3.8 0 0 1-5.5-5.5l1-1"/>',
  'i-share': '<circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M7.8 11.1l8.4-4.2M7.8 12.9l8.4 4.2"/>',
  'i-export-svg': '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M6 16c3-6 9 2 12-4"/>',
  'i-export-png': '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="11" r="1"/><circle cx="13" cy="14" r="1"/><circle cx="16" cy="10" r="1"/>',
  'i-download-md': '<path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/><path d="M12 4v10M8 10l4 4 4-4"/>',
  'i-print': '<path d="M7 8V4h10v4"/><rect x="4" y="8" width="16" height="8" rx="2"/><rect x="7" y="14" width="10" height="6"/>',
  'i-save': '<path d="M7 9v6a5 3 0 0 0 10 0V9"/><ellipse cx="12" cy="9" rx="5" ry="2"/><path d="M12 9V4l3-1"/>',
  'i-keyboard': '<rect x="3" y="7" width="18" height="11" rx="2"/><path d="M7 11h.01M11 11h.01M15 11h.01M8 15h8"/>',
  'i-drag': '<path d="M8 11V6a1.5 1.5 0 0 1 3 0v4M11 10V5a1.5 1.5 0 0 1 3 0v5M14 10.5V7a1.5 1.5 0 0 1 3 0v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-4-2l-2.2-3.2a1.5 1.5 0 0 1 2.4-1.8L8 12"/>',
  'i-info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".7" fill="currentColor" stroke="none"/>',
  'i-caution': '<path d="M12 4l9 16H3z"/><path d="M12 10v5"/><circle cx="12" cy="18" r=".7" fill="currentColor" stroke="none"/>',
  'i-check': '<path d="M5 12l5 5 9-11"/>',
  'i-cross': '<path d="M6 6l12 12M18 6L6 18"/>',
  'i-question': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7"/><circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none"/>',
  'i-book': '<path d="M12 6c-2-1.5-5-1.5-7 0v11c2-1.5 5-1.5 7 0M12 6c2-1.5 5-1.5 7 0v11c-2-1.5-5-1.5-7 0M12 6v11"/>',
  'i-scroll': '<path d="M8 4h9v13a3 3 0 0 1-3 3H7a3 3 0 0 0 3-3V4z"/><path d="M8 4a2 2 0 0 0-2 2v1h3"/><path d="M11 9h4M11 13h4"/>',
  'i-quill': '<path d="M4 20c8 0 14-6 15.5-16C13 5 6 8 6 15.5z"/><path d="M6.5 17.5l5-5"/>',
  'i-lamp': '<path d="M4 15h9a4 4 0 0 0 0-8H8l-4 4z"/><path d="M13 11l6-2"/><path d="M9 6.5C9 5 10 4.2 10 4.2s.9 1-.2 2.3"/>',
  'i-thread': '<path d="M3 16c3-4 6 2 9-2s5 2 9-2"/><circle cx="7" cy="7.5" r="1.4"/>',
  'i-clock': '<circle cx="12" cy="12" r="9"/><path d="M12 12l-3-2M12 12l2.2-4"/>',
  'i-calendar': '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 4v3M16 4v3M4 11h16"/><circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none"/>',
  'i-pin': '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.2"/>',
  // Optional set (ship, but not asserted by the gate) --------------------------
  'i-tour': '<path d="M6 3v18"/><path d="M6 4h11l-2 3.5 2 3.5H6"/>',
  'i-sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/>',
  'i-moon': '<path d="M20 14a8 8 0 1 1-10-10 6.5 6.5 0 0 0 10 10z"/>',
  'i-star': '<path d="M12 3l1.6 7.4L21 12l-7.4 1.6L12 21l-1.6-7.4L3 12l7.4-1.6z"/>',
  'i-eye': '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/>',
  'i-eye-off': '<path d="M4 5l16 14"/><path d="M9.6 6.3A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3 3.4M6.1 8.5A17 17 0 0 0 2 12s4 6 10 6a10 10 0 0 0 3-.5"/>'
};

// The four <pattern> defs (frozen hexes = the resolved values of --dg-frame /
// --ep-disp / --ep-con; SVG <line>/<circle> attrs can't read custom properties
// across <use>, so freezing is deliberate and documented — art §6.2).
const PATTERN_DEFS =
  '<pattern id="pat-shade" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
    '<line x1="0" y1="0" x2="0" y2="4" stroke="#cbbd9c" stroke-width=".6" opacity=".55"/></pattern>' +
  '<pattern id="pat-ep-disp" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
    '<line x1="0" y1="0" x2="0" y2="4" stroke="#4a68a8" stroke-width="1" opacity=".55"/></pattern>' +
  '<pattern id="pat-ep-con" width="5" height="5" patternUnits="userSpaceOnUse">' +
    '<circle cx="2.5" cy="2.5" r=".8" fill="#b06f1f" opacity=".6"/></pattern>' +
  '<pattern id="pat-stipple" width="5" height="5" patternUnits="userSpaceOnUse">' +
    '<circle cx="1" cy="1" r=".7" fill="#cbbd9c" opacity=".4"/>' +
    '<circle cx="3.5" cy="3.5" r=".6" fill="#cbbd9c" opacity=".35"/></pattern>';

const SYMBOLS = Object.entries(ICONS).map(([id, body]) =>
  `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
  `stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`
).join('');

export const ICON_SPRITE =
  `<svg id="ds3-icon-sprite" style="display:none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
  `<defs>${PATTERN_DEFS}</defs>${SYMBOLS}</svg>`;

// List of the shipped ids (useful to the engine test and any usage audit).
export const ICON_IDS = Object.keys(ICONS);

// Idempotently prepend the sprite to <body> so every page's <use href="#i-*">
// and pattern reference resolves. Safe to call more than once.
export function injectIcons(doc) {
  const d = doc || (typeof document !== 'undefined' ? document : null);
  if (!d || !d.body) return;
  if (d.getElementById('ds3-icon-sprite')) return;
  const holder = d.createElement('div');
  holder.innerHTML = ICON_SPRITE;
  const sprite = holder.firstElementChild;
  if (sprite) d.body.insertBefore(sprite, d.body.firstChild);
}
