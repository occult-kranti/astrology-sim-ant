// ============================================================================
//  art/adopt.js — the JS swap layer for the illustration system (DS3 art §4.3,
//  §4.5). Reads B5's `data-fp` attribute on wing-hero glyph watermarks and swaps
//  the 12rem emoji for its engraved frontispiece (the emoji stays in the DOM as
//  the no-JS fallback — hidden only once JS has drawn the replacement). Also
//  gilds `.card--plate` ceremonial cards with four corner ornaments.
//  Idempotent, non-fatal, called by shared.js during chrome injection.
// ============================================================================
import { frontispiece, cornerOrnament } from './engravings.js';

function adoptFrontispieces(root) {
  root.querySelectorAll('.wing-hero .wh-glyph[data-fp]').forEach(glyph => {
    if (glyph.dataset.fpAdopted) return;
    const svg = frontispiece(glyph.getAttribute('data-fp'));
    if (!svg) return;                          // unknown name → keep the emoji
    glyph.dataset.fpAdopted = '1';
    glyph.insertAdjacentHTML('afterend', svg);
    // The engraving now carries the watermark; hide the emoji fallback (kept in
    // the DOM so a no-JS load still shows it).
    glyph.style.display = 'none';
  });
}

function adoptPlateCorners(root) {
  root.querySelectorAll('.card--plate').forEach(card => {
    if (card.dataset.plateAdopted) return;
    card.dataset.plateAdopted = '1';
    const wrap = document.createElement('span');
    wrap.className = 'plate-corners';
    wrap.setAttribute('aria-hidden', 'true');
    ['pc-tl', 'pc-tr', 'pc-br', 'pc-bl'].forEach(pos => {
      const c = document.createElement('span');
      c.className = 'plate-corner ' + pos;
      c.innerHTML = cornerOrnament(12);
      wrap.appendChild(c);
    });
    card.appendChild(wrap);
  });
}

export function adoptArt(root) {
  const r = root || (typeof document !== 'undefined' ? document : null);
  if (!r || !r.querySelectorAll) return;
  try { adoptFrontispieces(r); } catch (e) { /* non-fatal */ }
  try { adoptPlateCorners(r); } catch (e) { /* non-fatal */ }
}

export default adoptArt;
