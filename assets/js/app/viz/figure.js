// ============================================================================
//  app/viz/figure.js — mountFigure(): wraps a renderer's output in the shipped
//  .fig component (body, legend, caption, hidden print list) and adds the
//  .fig-scroll guard so figures scroll inside their own box and the page body
//  never scrolls horizontally at 390 px. Idempotent. [dataviz §4.1]
//  OWNERSHIP: Builder 2's module. DOM only; ships NO CSS (B3 owns the .fig /
//  .figure-legend / .fig-scroll / .fig-print-list rules). No rAF, no motion dep.
// ============================================================================

const esc = s => String(s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// legend model → chips (swatch square or glyph + label)
function legendHtml(legend) {
  if (!legend || !legend.length) return '';
  const rows = legend.map(r => {
    const mark = r.swatchClass
      ? `<span class="lg-swatch ${esc(r.swatchClass)}" aria-hidden="true"></span>`
      : `<span class="lg-glyph" aria-hidden="true">${esc(r.glyph || '')}</span>`;
    return `<span class="figure-legend-item" role="listitem">${mark}<span class="lg-label">${esc(r.label)}</span></span>`;
  }).join('');
  return `<div class="figure-legend" role="list">${rows}</div>`;
}

function printListHtml(textModel) {
  if (!textModel || !textModel.length) return '';
  return `<ol class="fig-print-list">${textModel.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
}

// mountFigure(container, { svg|html, textModel, legend, caption, ariaLabel, scroll })
//   Renders into `container` (cleared first). Returns the .fig element.
export function mountFigure(container, spec = {}) {
  if (!container) return null;
  const { svg, html, textModel, legend, caption, ariaLabel = 'Figure', scroll = 'auto' } = spec;
  const fig = document.createElement('figure');
  fig.className = 'fig';

  const bodyWrap = document.createElement('div');
  bodyWrap.className = 'fig-body';
  // .fig-scroll: a horizontally scrollable region so wide figures never push the
  // page body wide. The browser shows a scrollbar only when the child overflows.
  if (scroll !== false) {
    bodyWrap.classList.add('fig-scroll');
    bodyWrap.setAttribute('tabindex', '0');
    bodyWrap.setAttribute('role', 'region');
    bodyWrap.setAttribute('aria-label', `${ariaLabel} (scrollable)`);
  }
  bodyWrap.innerHTML = svg != null ? svg : (html != null ? html : '');
  fig.appendChild(bodyWrap);

  if (legend && legend.length) fig.insertAdjacentHTML('beforeend', legendHtml(legend));
  if (caption) {
    const cap = document.createElement('figcaption');
    cap.className = 'fig-caption';
    cap.textContent = caption;
    fig.appendChild(cap);
  }
  if (textModel && textModel.length) fig.insertAdjacentHTML('beforeend', printListHtml(textModel));

  container.innerHTML = '';
  container.appendChild(fig);
  return fig;
}
