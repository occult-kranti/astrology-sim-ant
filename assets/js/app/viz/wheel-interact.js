// ============================================================================
//  app/viz/wheel-interact.js — the chart wheel wired to the inspect grammar
//  (chart-ux §7.1 c/d executed). Registers a tip/card provider for the wheel
//  SVG root; planet groups, aspect lines and cusp hit-strokes all become
//  inspectable through the ONE grammar in inspect.js. [dataviz §4.4]
//  OWNERSHIP: Builder 2. DOM only; ships NO CSS. No rAF, no motion dependency
//  (rotation physics lives in app/wheel-rotate.js).
// ============================================================================
import { registerFigure } from './inspect.js';
import { wheelInspectModel, wheelLegendModel } from '../../core/viz/wheel-model.js';

const ASPECT_GLYPH = { Conjunction: '☌', Sextile: '⚹', Square: '□', Trine: '△', Opposition: '☍' };

// wireWheel(svg, reading, aspects)
//   svg     — the rendered .chart-wheel <svg> element (or a container holding it)
//   reading — the host's reading object ({chart, aspects, dignities?, houseTopics?, plain?})
//   aspects — allAspects() output (used for legend + fallback lookups)
// Returns { legend } so the host can pass it to mountFigure.
export function wireWheel(svg, reading = {}, aspects = []) {
  const root = svg && (svg.matches && svg.matches('.chart-wheel') ? svg : svg.querySelector && svg.querySelector('.chart-wheel')) || svg;
  if (!root) return { legend: [] };
  const chart = reading.chart || reading;
  const rd = { chart, aspects: reading.aspects || aspects, dignities: reading.dignities, houseTopics: reading.houseTopics, plain: reading.plain };

  registerFigure(root, {
    tip(el) {
      const id = el.getAttribute('data-el');
      if (!id) return null;
      const m = wheelInspectModel(rd, id);
      if (id.startsWith('aspect-')) {
        const a = (rd.aspects || []).find(x => `aspect-${x.from}-${x.to}-${x.aspect}` === id) || {};
        return `${m.title}${typeof a.orb === 'number' ? ` · orb ${a.orb.toFixed(1)}° ${a.applying ? 'applying' : 'separating'}` : ''}`;
      }
      const first = m.rows && m.rows[0];
      return `${m.title}${first ? ` · ${first.v}` : ''}`;
    },
    card(el) {
      const id = el.getAttribute('data-el');
      const m = wheelInspectModel(rd, id);
      // ✶ assistant prefill button, only where the host wired one (chart-ux §8)
      let footer = '';
      if (reading.assistantPrefill && typeof reading.assistantPrefill === 'function') {
        footer = `<div class="vpc-foot"><button class="btn-secondary sm vpc-ask" type="button">✶ Ask the diviner</button></div>`;
      }
      return { ...m, footer, _prefill: reading.assistantPrefill, _id: id };
    },
  });

  // wire the ✶ button after each pin (event-delegated on the card)
  document.addEventListener('viz:pin', e => {
    if (!e.detail || e.detail.fig !== root) return;
    const fn = e.detail.model && e.detail.model._prefill;
    if (!fn) return;
    setTimeout(() => {
      const btn = document.querySelector('.viz-pin-card .vpc-ask');
      if (btn && !btn._wired) { btn._wired = true; btn.addEventListener('click', () => fn(e.detail.model._id)); }
    }, 0);
  });

  return { legend: wheelLegendModel(chart, rd.aspects || aspects) };
}

export { ASPECT_GLYPH };
