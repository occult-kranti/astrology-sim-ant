// ============================================================================
//  talisman.js (app) — the guided talisman workflow. Choose an aim and a
//  moment/place; the page elects the time, assembles the historical materials,
//  mansion/face/star and ritual steps, and renders the end-result "recipe card".
//  Composes core/talisman.js (which composes the election + correspondence
//  engines). Historical practice, described not prescribed.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { OPERATIONS } from '../core/election.js';
import { talismanRecipe } from '../core/talisman.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';
let vedicUpdate = null;

const $ = id => document.getElementById(id);
const G = p => PLANET_GLYPHS[p] || p;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const VW = v => v === 'green' ? 'favourable' : v === 'amber' ? 'mixed' : 'unfavourable';

export function initTalisman() {
  $('t-op').innerHTML = OPERATIONS.map(o => `<option value="${esc(o.key)}">${esc(o.label)}</option>`).join('');
  try { const w = new URLSearchParams(location.search).get('op'); if (w && OPERATIONS.some(o => o.key === w)) $('t-op').value = w; } catch { /* */ }
  const n = nowLocalFields();
  $('t-date').value = n.date; $('t-time').value = n.time; $('t-offset').value = 0;
  $('t-lat').value = 51.5074; $('t-lon').value = -0.1278;
  wireCitySelect($('t-city'), $('t-lat'), $('t-lon'), $('t-offset'));
  $('t-now').addEventListener('click', () => { const f = nowLocalFields(); $('t-date').value = f.date; $('t-time').value = f.time; $('t-offset').value = f.offset; });
  $('t-form').addEventListener('submit', e => { e.preventDefault(); build(); });
  build();
}

function build() {
  try {
    const date = toUTC($('t-date').value, $('t-time').value, parseFloat($('t-offset').value) || 0);
    const lat = parseFloat($('t-lat').value), lon = parseFloat($('t-lon').value);
    if (isNaN(lat) || isNaN(lon)) return;
    const chart = castChart(date, lat, lon, 'regiomontanus');
    try { if (!vedicUpdate) vedicUpdate = attachVedicPanel(); vedicUpdate(chart); } catch { /* non-fatal */ }
    const r = talismanRecipe(chart, $('t-op').value, { scanHours: 72, stepMinutes: 30 });

    // Step-by-step
    $('t-steps').innerHTML = `<ol class="steps">${r.steps.map(s =>
      `<li>${esc(s.text)} <span class="small muted">— ${esc(s.cite)}</span></li>`).join('')}</ol>`;

    // End-result recipe card
    const m = r.materials, sp = m.spirits;
    const win = r.window
      ? `Best upcoming window (next 72 h): <b>${r.window.start.toLocaleString()}</b> → ${r.window.end.toLocaleString()} (best ${VW(r.window.bestVerdict)}, score ${r.window.best}).`
      : `No clearly favourable window in the next 72 h — the tradition would wait.`;
    const starTxt = r.star ? `${G(r.star.planet)} ${esc(r.star.planet)} ∠ ${esc(r.star.star)} (${r.star.sep.toFixed(1)}°)` : 'none conjunct a planet now';
    $('t-card').innerHTML = `
      <div class="card" style="border:2px solid var(--gold,#b9912f)">
        <h2 style="margin-top:0">Recipe — ${esc(r.aim)} <span class="verdict ${esc(r.verdict)}">${VW(r.verdict)}</span></h2>
        <p class="small muted">${esc(r.disclaimer)}</p>
        <table class="data">
          <tbody>
            <tr><th class="l">Aim</th><td class="l">${esc(r.aim)} — ruling planet ${G(r.planet)} <b>${esc(r.planet)}</b> (${esc(r.book)})</td></tr>
            <tr><th class="l">Moment</th><td class="l">${esc(new Date(r.when).toUTCString())} · ${r.where.lat.toFixed(2)}°, ${r.where.lon.toFixed(2)}°${r.hour ? ` · hour of ${esc(r.hour.ruler)}, day of ${esc(r.hour.dayRuler)}` : ''}</td></tr>
            <tr><th class="l">Election</th><td class="l"><b>${VW(r.verdict)}</b> — ${esc(r.verdictLabel)} (score ${r.score}). ${esc(win)}</td></tr>
            <tr><th class="l">Moon</th><td class="l">${esc(r.moon.sign)} ${formatLon(r.moon.lon)}, ${esc(r.moon.phase)}; Mansion ${r.moon.mansion.num} — ${esc(r.moon.mansion.name)} (“${esc(r.moon.mansion.use)}”)</td></tr>
            <tr><th class="l">Suffumigation</th><td class="l">${esc(m.suffumigation)}</td></tr>
            <tr><th class="l">Colour</th><td class="l">${esc(m.colour)}</td></tr>
            <tr><th class="l">Metal</th><td class="l">${esc(m.metal)}</td></tr>
            <tr><th class="l">Stone</th><td class="l">${esc(m.stone)}</td></tr>
            <tr><th class="l">Spirits</th><td class="l">Picatrix prayer-angel ${esc(sp.picatrixPrayerAngel)}; Agrippa Angel <b>${esc(sp.agrippa.angel)}</b> / Intelligence ${esc(sp.agrippa.intelligence)} / Spirit ${esc(sp.agrippa.spirit)}</td></tr>
            <tr><th class="l">Design</th><td class="l">${esc(r.design)}</td></tr>
            <tr><th class="l">Fixed star</th><td class="l">${starTxt}</td></tr>
          </tbody>
        </table>
        <p class="small"><button type="button" class="btn sm" onclick="window.print()">Print this recipe</button></p>
      </div>`;
  } catch (e) {
    $('t-card').innerHTML = `<p class="adv-bad">Could not build the recipe: ${esc(e.message)}</p>`;
  }
}
