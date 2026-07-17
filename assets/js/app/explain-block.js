// ============================================================================
//  app/explain-block.js — the DOM renderer for a pure "In plain words" text model
//  (built by core/explain/*). Renders the three-layer standard from chart-ux.md §4:
//    (iii) IN PLAIN WORDS — always-visible, attributed, computed sentences, with a
//          row of glossary term-chips that open the shared glosstip popover;
//    (ii)  <details> WHAT THE TRADITION COMPUTES HERE — cited mechanics, collapsed;
//    (optional) a figure legend row.
//  Order on screen: legend → plain words → collapsed mechanics (novice first).
//
//  DOM-only (app layer). Idempotent per compute (sets innerHTML wholesale). All
//  colour/spacing via DS2 tokens; style.css is never touched — the block's CSS is
//  injected once as a page-scoped <style>. Reduced-motion-first (no transitions).
// ============================================================================
import { ROOT } from './shared.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The visible label for a glossary term-chip: drop the parenthetical and glyphs
// (so 'Sect (Diurnal / Nocturnal)' shows as 'Sect', matching autolink's phrase).
function chipLabel(term) {
  return String(term).replace(/\([^)]*\)/g, '')
    .replace(/[☉☽☿♀♂♃♄☊☋⊕△□⚹☌☍✶]/g, '').replace(/\s+/g, ' ').trim();
}

let cssInjected = false;
function ensureCSS() {
  if (cssInjected || document.getElementById('explain-block-css')) { cssInjected = true; return; }
  cssInjected = true;
  const s = document.createElement('style');
  s.id = 'explain-block-css';
  s.textContent = `
  .explain-block { margin: var(--sp-3) 0 var(--sp-4); }
  .plain-words { position: relative; background: var(--surface-wash);
    border: 1px solid var(--border); border-left: 3px solid var(--accent);
    border-radius: var(--rad-2); padding: var(--sp-3) var(--sp-4); }
  .plain-words--ok   { border-left-color: var(--ok); }
  .plain-words--warn { border-left-color: var(--warn); }
  .plain-words--bad  { border-left-color: var(--bad); }
  .plain-words .pw-label { display: block; font-family: var(--font-sans);
    font-size: var(--fs-label); letter-spacing: .12em; text-transform: uppercase;
    font-weight: 700; color: var(--text-muted); margin-bottom: var(--sp-1); }
  .plain-words .pw-text { margin: 0; color: var(--text); }
  .explain-terms { display: flex; flex-wrap: wrap; gap: var(--sp-1);
    margin-top: var(--sp-2); }
  .term-chip { display: inline-flex; align-items: center; gap: .25rem;
    font-family: var(--font-sans); font-size: var(--fs--1); line-height: 1;
    padding: .28rem .5rem; border: 1px solid var(--border); border-radius: var(--rad-pill);
    background: var(--surface-card); color: var(--text-soft); cursor: help; }
  .term-chip:hover { border-color: var(--accent); color: var(--text); }
  .term-chip:focus-visible { outline: 2px solid var(--focus); outline-offset: 1px; }
  .term-chip .tc-i { color: var(--accent); font-weight: 700; }
  .layer-mechanics { margin-top: var(--sp-2); border: 1px solid var(--border);
    border-radius: var(--rad-2); background: var(--surface-card); }
  .layer-mechanics > summary { cursor: pointer; padding: var(--sp-2) var(--sp-3);
    font-family: var(--font-sans); font-size: var(--fs--1); color: var(--text-soft);
    list-style: none; }
  .layer-mechanics > summary::-webkit-details-marker { display: none; }
  .layer-mechanics > summary .lm-gear { color: var(--text-muted); margin-right: .35rem; }
  .layer-mechanics[open] > summary { border-bottom: 1px solid var(--border); }
  .layer-mechanics .lm-body { padding: var(--sp-3); color: var(--text-soft); }
  .layer-mechanics .lm-body p { margin: 0 0 var(--sp-2); }
  .layer-mechanics .lm-cite { margin: var(--sp-2) 0 0; }
  .lm-contested { border-left: 3px solid var(--warn); background: var(--warn-wash);
    padding: var(--sp-2) var(--sp-3); border-radius: var(--rad-1); margin: var(--sp-2) 0; }
  .lm-contested .lm-claim { font-weight: 700; display: block; }
  .figure-legend { display: flex; flex-wrap: wrap; gap: var(--sp-1) var(--sp-3);
    align-items: center; margin-bottom: var(--sp-2); font-size: var(--fs--1);
    color: var(--text-muted); }
  .figure-legend .fl-item { display: inline-flex; align-items: center; gap: .35rem; }
  .figure-legend .fl-swatch { width: 1rem; height: .5rem; border-radius: 2px;
    display: inline-block; border: 1px solid var(--border); }
  @media print { .term-chip .tc-i { display: none; } }
  `;
  (document.head || document.documentElement).appendChild(s);
}

function legendHTML(legend) {
  if (!legend || !legend.length) return '';
  const items = legend.map(l => {
    const mark = l.glyph
      ? `<span class="fl-glyph" aria-hidden="true">${esc(l.glyph)}</span>`
      : `<span class="fl-swatch" style="background:${esc(l.color || 'var(--accent)')}"></span>`;
    return `<span class="fl-item">${mark}${esc(l.label)}</span>`;
  }).join('');
  return `<div class="figure-legend" role="list">${items}</div>`;
}

function termsRow(terms, href) {
  if (!terms || !terms.length) return '';
  const chips = terms.map(t => {
    const label = chipLabel(t.term);
    return `<button type="button" class="term-chip gloss-tip-trigger" data-slug="${esc(t.slug)}" `
      + `data-term="${esc(t.term)}" data-href="${esc(href)}#${esc(t.slug)}" `
      + `aria-label="Glossary: ${esc(label)}"><span class="tc-i" aria-hidden="true">ⓘ</span>${esc(label)}</button>`;
  }).join('');
  return `<div class="explain-terms">${chips}</div>`;
}

function mechanicsHTML(m) {
  if (!m) return '';
  const contested = (m.contested || []).map(c => {
    const pos = (c.positions || []).map(p => `<li>${esc(p)}</li>`).join('');
    return `<div class="lm-contested"><span class="lm-claim">Contested — ${esc(c.claim)}</span>`
      + (pos ? `<ul class="clean small">${pos}</ul>` : '') + `</div>`;
  }).join('');
  return `<details class="layer-mechanics">
    <summary><span class="lm-gear" aria-hidden="true">⚙</span>${esc(m.summary)}</summary>
    <div class="lm-body">${m.html || ''}${contested}${m.citation ? `<p class="lm-cite small muted">${esc(m.citation)}</p>` : ''}</div>
  </details>`;
}

// ---------------------------------------------------------------------------
//  renderExplainBlock(container, model, opts)
//    container : the DOM node whose innerHTML becomes the block.
//    model     : a core/explain/* text model
//                { anchorId, plain:{label,text,terms,tone}, mechanics }.
//    opts.legend      : optional [{ glyph|color, label }] figure legend.
//    opts.glossaryHref: glossary page href (defaults to the site's).
//    opts.textId      : id set on the plain-words <p>, so the caller can add it
//                       to autolinkResultPanels for inline glossary links too.
// ---------------------------------------------------------------------------
export function renderExplainBlock(container, model, opts = {}) {
  if (!container || !model || !model.plain) return;
  ensureCSS();
  const href = opts.glossaryHref || `${ROOT}/pages/glossary.html`;
  const tone = model.plain.tone ? ` plain-words--${model.plain.tone}` : '';
  const textId = opts.textId ? ` id="${esc(opts.textId)}"` : '';
  container.innerHTML =
    `<div class="explain-block"${model.anchorId ? ` id="${esc(model.anchorId)}"` : ''}>
      ${legendHTML(opts.legend)}
      <div class="plain-words${tone}">
        <span class="pw-label">${esc(model.plain.label || 'In plain words')}</span>
        <p class="pw-text"${textId}>${esc(model.plain.text)}</p>
        ${termsRow(model.plain.terms, href)}
      </div>
      ${mechanicsHTML(model.mechanics)}
    </div>`;
}

// Convenience: ensure a mount container exists directly AFTER `afterEl`, reusing
// it across recomputes (so the block replaces in place, never stacks).
export function ensureExplainMount(afterEl, id) {
  if (!afterEl) return null;
  let box = document.getElementById(id);
  if (!box) {
    box = document.createElement('div');
    box.id = id;
    afterEl.insertAdjacentElement('afterend', box);
  }
  return box;
}
