// ============================================================================
//  picatrix-prayers.js (app) — renders the Picatrix Book III/IV prayers, spirits,
//  the Perfect Nature and the Book IV summary into pages/picatrix/prayers.html.
//  HISTORICAL TEXT FOR STUDY — described, never prescribed. Reads the cited data
//  from core/data/picatrix-prayers.js (no calculation; pure reference render).
// ============================================================================
import { PLANETARY_PRAYERS, PERFECT_NATURE, BOOK_IV, PICATRIX_PRAYERS_FRAMING, PICATRIX_PRAYERS_SOURCE } from '../core/data/picatrix-prayers.js';
import { PLANET_GLYPHS } from '../core/astro.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

export function renderPrayers(elId = 'pr-out', only = null) {
  const host = document.getElementById(elId);
  if (!host) return;
  const planets = only ? [only] : ORDER;
  const cards = planets.map(p => {
    const d = PLANETARY_PRAYERS[p]; if (!d) return '';
    const dir = d.spirit.directions;
    return `<section class="card" style="margin:.8rem 0">
      <h3 style="margin-top:0">${G(p)} ${esc(p)} <span class="small muted">— ${esc(d.names)}</span></h3>
      <blockquote class="small" style="border-left:3px solid var(--gold);margin:.3rem 0;padding:.2rem 0 .2rem .8rem;font-style:italic">“${esc(d.prayerExcerpt)}”</blockquote>
      <p class="small"><b>Address:</b> ${esc(d.address)}</p>
      <p class="small"><b>Prayer-angel (III.7):</b> ${d.prayerAngel.latin ? esc(d.prayerAngel.latin) + ' <span class="muted">(' + esc(d.prayerAngel.arabic) + ')</span>' : '<span class="muted">none named — the Sun is addressed directly</span>'} ·
        <b>Spirit (III.9):</b> ${esc(d.spirit.master)} <span class="muted">(${esc(d.spirit.masterArabic)})</span></p>
      <details class="small"><summary>The six directional spirits & the spirit of its motion (III.9)</summary>
        <p class="muted">above ${esc(dir.above)} · below ${esc(dir.below)} · right ${esc(dir.right)} · left ${esc(dir.left)} · before ${esc(dir.front)} · behind ${esc(dir.behind)} · motion ${esc(d.spirit.motion)}</p></details>
      ${d.flag ? `<p class="small neg">⚠ ${esc(d.flag)}</p>` : ''}
      <p class="small muted">${esc(d.citation)}</p>
    </section>`;
  }).join('');

  const pn = PERFECT_NATURE;
  const perfectNature = `<section class="card" style="margin:.8rem 0;border-color:var(--gold)">
    <h3 style="margin-top:0">The Perfect Nature <span class="small muted">(al-Ṭibāʿ al-Tāmm · Picatrix III.6)</span></h3>
    <p class="small">${esc(pn.what)}</p>
    <p class="small"><b>The four names:</b> ${pn.namesLatin.map(esc).join(', ')} <span class="muted">(Ar. ${pn.namesArabic.map(esc).join(', ')})</span></p>
    <p class="small">${esc(pn.rite)}</p>
    <p class="small muted"><b>Contested:</b> ${esc(pn.uncertainty)}</p>
    <p class="small muted">${esc(pn.citation)}</p></section>`;

  const bookIV = `<section class="card" style="margin:.8rem 0">
    <h3 style="margin-top:0">Book IV — prayers, suffumigations & natural magic</h3>
    <ul class="clean small">${BOOK_IV.map(b => `<li><b>${esc(b.ch)} — ${esc(b.title)}.</b> ${esc(b.summary)}${b.flag ? ` <span class="neg">⚠ ${esc(b.flag)}</span>` : ''}</li>`).join('')}</ul></section>`;

  host.innerHTML = `
    <div class="callout science"><span class="label">Read this first</span> ${esc(PICATRIX_PRAYERS_FRAMING)}</div>
    ${cards}
    ${perfectNature}
    ${bookIV}
    <p class="small muted" style="margin-top:1rem">${esc(PICATRIX_PRAYERS_SOURCE)}</p>`;
}
