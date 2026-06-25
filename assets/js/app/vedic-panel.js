// ============================================================================
//  vedic-panel.js — a SHARED, TOGGLEABLE "Jagannath Hora (Vedic)" panel that any
//  tool can mount to show the sidereal reading SIDE BY SIDE with the Western one.
//  It is a separate system (different zodiac, houses, daśā), so it is off by
//  default and toggled on per tool. One renderer, used by every integrated tool
//  and the dedicated Vedic page — so the two systems never drift apart.
// ============================================================================
import { castVedic } from '../core/vedic.js';
import { PLANET_GLYPHS } from '../core/astro.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const GL = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋' };
const fmtDate = d => { try { return new Date(d).toISOString().slice(0, 10); } catch { return ''; } };
const digClass = s => s === 'Exalted' || s === 'Own sign' || s === 'Mūlatrikoṇa' ? 'pos' : s === 'Debilitated' ? 'neg' : 'muted';

// Render the full sidereal reading for `chart` into `body`. opts.currentDate
// selects the running daśā (the page/tool passes "now" for a birth chart).
export function renderVedicPanel(body, chart, opts = {}) {
  let v;
  try { v = castVedic(chart, opts); } catch (e) { body.innerHTML = `<p class="muted">Vedic computation failed: ${esc(e.message)}</p>`; return; }

  const grahaRows = Object.entries(v.grahas).map(([p, g]) => `<tr>
    <td>${GL[p] || ''} ${esc(p)}</td>
    <td class="l">${esc(g.label)}${g.retrograde && p !== 'Rahu' && p !== 'Ketu' ? ' ℞' : ''}</td>
    <td>${g.house}</td>
    <td class="l small">${esc(g.nakshatra.name)} <span class="muted">p${g.nakshatra.pada}</span></td>
    <td class="${digClass(g.dignity.state)} small">${esc(g.dignity.state)}</td></tr>`).join('');

  const dz = v.vimshottari;
  const mahaList = dz.maha.slice(0, 6).map(m => `<span class="${m.current ? 'pos' : 'muted'}">${esc(m.lord)} (${fmtDate(m.start)}${m.current ? ' ◀' : ''})</span>`).join(' · ');
  const navamsa = Object.keys(v.grahas).map(p => `${GL[p] || ''}${esc(RASHI_SHORT(v.navamsa[p]))}`).join(' ');
  const yogas = v.yogas.filter(y => y.present);

  body.innerHTML = `
    <p class="small muted">Sidereal (Lahiri ayanāṁśa ${v.ayanamsa}°) · whole-sign houses · modelled on Jagannath Hora.
      A <b>separate system</b> from the Western/tropical chart above — shown for comparison, not as a competing forecast.</p>
    <p><b>Lagna (Ascendant):</b> ${esc(v.lagna.label)} <span class="muted">(${esc(v.lagna.sanskrit)}, lord ${esc(v.lagna.lord)})</span>,
      nakṣatra <b>${esc(v.lagna.nakshatra.name)}</b> pada ${v.lagna.nakshatra.pada}.</p>

    <h3 class="small" style="margin:.6rem 0 .2rem">Grahas (sidereal)</h3>
    <table class="data"><thead><tr><th>Graha</th><th>Position</th><th>Bhāva</th><th>Nakṣatra</th><th>Dignity</th></tr></thead><tbody>${grahaRows}</tbody></table>

    <h3 class="small" style="margin:.7rem 0 .2rem">Pañcāṅga</h3>
    <p class="small">Tithi <b>${esc(v.panchanga.tithi.name)}</b> (${esc(v.panchanga.tithi.paksha)}) · Vāra <b>${esc(v.panchanga.vara.name)}</b> (${esc(v.panchanga.vara.lord)}) ·
      Nakṣatra <b>${esc(v.panchanga.nakshatra.name)}</b> · Yoga <b>${esc(v.panchanga.yoga.name)}</b> · Karaṇa <b>${esc(v.panchanga.karana.name)}</b>.</p>

    <h3 class="small" style="margin:.7rem 0 .2rem">Vimśottarī daśā</h3>
    <p class="small">Begins in <b>${esc(dz.startLord)}</b> with a balance of <b>${dz.balanceYears} yr</b> (Moon in ${esc(dz.nakshatra.name)}).
      Running now: <b>${esc(dz.currentMaha)}</b> mahā${dz.currentAntar ? ` / <b>${esc(dz.currentAntar)}</b> antar` : ''}.
      <br><span class="muted">Mahā sequence: ${mahaList}…</span></p>

    <h3 class="small" style="margin:.7rem 0 .2rem">Navāṁśa (D9) &amp; Sarvāṣṭakavarga</h3>
    <p class="small">D9 signs: <span class="muted">${navamsa}</span></p>
    <p class="small">SAV by sign (Aries→Pisces): <span class="muted">${v.ashtakavarga.sav.join(' · ')}</span> = <b>${v.ashtakavarga.savTotal}</b>
      <span class="muted">(avg 28; &gt;28 strong)</span></p>

    ${yogas.length ? `<h3 class="small" style="margin:.7rem 0 .2rem">Yogas</h3><ul class="clean small">${yogas.map(y => `<li><b>${esc(y.name)}</b> — ${esc(y.detail)}</li>`).join('')}</ul>` : ''}

    <details style="margin-top:.5rem"><summary class="small">Partial Ṣaḍbala (flagged) &amp; sources</summary>
      <p class="small muted">${esc(v.shadbala.note)}</p>
      <p class="small muted">${v.citations.map(esc).join(' · ')}</p></details>

    <p class="small muted" style="margin-top:.4rem">Vedic astrology, like all astrology, has no demonstrated predictive validity; this is a faithful
      reconstruction of a calculation system for study, not a forecast.</p>`;
}

// Aries…Pisces short labels for the compact navamsa line.
const RASHI3 = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
function RASHI_SHORT(i) { return RASHI3[i] || '?'; }

// ---------------------------------------------------------------------------
//  createVedicPanel(opts) — build a collapsible, toggleable Vedic card. Returns
//  { card, update(chart) }. Tools append `card` once and call `update(chart)`
//  after each compute; the panel renders lazily when toggled on.
// ---------------------------------------------------------------------------
export function createVedicPanel(opts = {}) {
  const card = document.createElement('section');
  card.className = 'card vedic-panel';
  card.innerHTML = `<h2 style="margin-top:0;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap">
      <label style="display:flex;align-items:center;gap:.4rem;font-size:1.05rem;cursor:pointer"><input type="checkbox" class="vedic-toggle"${opts.defaultOn ? ' checked' : ''}> 🕉 Jagannath Hora — Vedic (sidereal) view</label>
      <span class="small muted">another system · toggle to view side by side</span></h2>
    <div class="vedic-body"${opts.defaultOn ? '' : ' style="display:none"'}></div>`;
  const toggle = card.querySelector('.vedic-toggle');
  const bodyEl = card.querySelector('.vedic-body');
  let lastChart = null, rendered = false;
  const doRender = () => { if (lastChart) { renderVedicPanel(bodyEl, lastChart, { currentDate: opts.currentDate || new Date() }); rendered = true; } };
  toggle.addEventListener('change', () => {
    bodyEl.style.display = toggle.checked ? '' : 'none';
    if (toggle.checked) doRender();
  });
  if (opts.defaultOn) doRender();
  return {
    card,
    update(chart) { lastChart = chart; rendered = false; if (toggle.checked) doRender(); },
  };
}

// Convenience: append a Vedic panel to a tool's <main> and return its update fn.
export function attachVedicPanel(opts = {}) {
  const panel = createVedicPanel(opts);
  const main = document.querySelector('main');
  const anchor = opts.before ? document.querySelector(opts.before) : null;
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(panel.card, anchor);
  else if (main) main.appendChild(panel.card);
  return panel.update;
}
