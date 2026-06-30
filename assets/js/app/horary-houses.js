// ============================================================================
//  horary-houses.js — drives pages/book2/houses.html. Two things:
//   1. a LIVE judgement reader: pick a house and a moment, and the engine
//      (horary-judge.js) identifies the significators, runs the modes of
//      perfection, reads the Moon, and gives an affirmed / qualified / denied
//      tone with the house's own rule;
//   2. the twelve houses as a reference, each with Lilly's significations, the
//      natural significators, what perfection MEANS for that topic, and the
//      testimonies that affirm and deny (horary-house-judgement.js).
// ============================================================================
import { castChart, PLANET_GLYPHS } from '../core/astro.js';
import { horaryJudgement } from '../core/horary-judge.js';
import { HOUSES } from '../core/data/houses.js';
import { HORARY_HOUSE_JUDGEMENT, byHouse } from '../core/data/horary-house-judgement.js';
import { wireCitySelect, toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const G = p => PLANET_GLYPHS[p] || '';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toneBadge = t => `<span class="verdict ${t === 'affirmed' ? 'green' : t === 'denied' ? 'red' : 'amber'}">${t}</span>`;

export function initHoraryHouses() {
  renderReference();

  // live reader form
  const n = nowLocalFields();
  $('hh-date').value = n.date; $('hh-time').value = n.time; $('hh-offset').value = n.offset;
  $('hh-lat').value = 51.5074; $('hh-lon').value = -0.1278;
  wireCitySelect($('hh-city'), $('hh-lat'), $('hh-lon'), $('hh-offset'),
    { dateIn: $('hh-date'), timeIn: $('hh-time'), afterGeo: () => run() });
  $('hh-house').innerHTML = HOUSES.map(h => `<option value="${h.n}">${h.n} — ${esc(h.signifies.split(';')[0])}</option>`).join('');
  $('hh-house').value = 7;
  $('hh-now').addEventListener('click', () => { const f = nowLocalFields(); $('hh-date').value = f.date; $('hh-time').value = f.time; $('hh-offset').value = f.offset; run(); });
  $('hh-house').addEventListener('change', () => run());
  $('hh-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  run();
}

function run() {
  const lat = parseFloat($('hh-lat').value), lon = parseFloat($('hh-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('hh-out').innerHTML = '<p class="muted">Enter a latitude and longitude.</p>'; return; }
  let chart, j;
  try {
    const date = toUTC($('hh-date').value, $('hh-time').value, parseFloat($('hh-offset').value) || 0);
    chart = castChart(date, lat, lon, 'regiomontanus');
    j = horaryJudgement(chart, parseInt($('hh-house').value, 10));
  } catch (e) {
    $('hh-out').innerHTML = `<p class="muted">This moment could not be computed in this browser (${esc(e.message)}).</p>`;
    return;
  }
  const ref = byHouse(j.quesitedHouse);
  $('hh-out').innerHTML =
    `<p style="font-size:1.05rem">House ${j.quesitedHouse} — ${esc(ref ? ref.topic : j.topic)} ${toneBadge(j.tone)}</p>
     <p class="small">${esc(j.toneText)}</p>
     <ul class="clean small">${j.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
     ${j.naturalSignificators.length ? `<p class="small muted">Natural significator${j.naturalSignificators.length > 1 ? 's' : ''} of this topic: ${j.naturalSignificators.map(nn => `${G(nn.planet)} ${esc(nn.planet)} (${esc(nn.label)}${nn.combust ? ', combust' : ''})`).join('; ')}.</p>` : ''}
     <p class="small muted"><b>Lilly’s rule:</b> ${esc(j.note)} <span class="muted">— ${esc(j.cite)}</span></p>
     <div class="callout"><span class="label">A tone, not a verdict</span> This is a structured weighing of Lilly’s
       testimonies, shown for study — astrology has no demonstrated predictive validity. The real method weighs the
       <em>actual</em> significators of your matter (reception, the angles, fixed stars) beyond any tally.</div>`;
  try { autolinkResultPanels(['hh-out']); } catch { /* non-fatal */ }
}

function renderReference() {
  $('house-guide').innerHTML = HORARY_HOUSE_JUDGEMENT.map(j => {
    const base = HOUSES[j.n - 1];
    return `<div class="card">
      <h3>${j.n}. ${esc(base.name)} ${base.angle ? `<span class="pill">${esc(base.angle)}</span>` : ''}</h3>
      <p class="small"><b>Signifies:</b> ${esc(base.signifies)}</p>
      <p class="small"><b>Natural significators:</b> ${j.naturalSignificators.map(p => `${G(p) || ''} ${esc(p)}`).join(', ')}
        ${base.joy ? `· joy of ${G(base.joy)} ${esc(base.joy)}` : ''}</p>
      <p class="small"><b>How it perfects:</b> ${esc(j.perfectionMeaning)}</p>
      <details class="small"><summary>Testimonies that affirm &amp; deny</summary>
        <p class="pos" style="margin:.3rem 0 .1rem"><b>Affirm</b></p>
        <ul class="small">${j.affirmative.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        <p class="neg" style="margin:.3rem 0 .1rem"><b>Deny</b></p>
        <ul class="small">${j.negative.map(a => `<li>${esc(a)}</li>`).join('')}</ul></details>
      <p class="small muted">${esc(j.lillyNote)} <span class="muted">— ${esc(j.citation)}</span></p>
    </div>`;
  }).join('');
}
