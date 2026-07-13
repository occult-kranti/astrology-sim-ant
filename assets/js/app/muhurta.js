// ============================================================================
//  muhurta.js (app) — drives pages/muhurta.html, the MUHŪRTA (Indian
//  electional) tool. All computation lives in the pure core
//  (core/muhurta.js); this file owns the DOM: the date+place form, the
//  30-muhūrta day timeline with the three kālas overlaid, and the pañcāṅga
//  quality screens. Honest framing throughout: the classical rules are
//  described, never prescribed — no demonstrated validity.
// ============================================================================
import { muhurtaReport } from '../core/muhurta.js';
import { wireCitySelect, toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// the last computed report, exposed for the AI assistant panel.
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentMuhurtaReport() { return lastReport; }

// format a UTC Date as HH:MM in the tool's chosen UTC offset
const fmtT = (d, off) => new Date(d.getTime() + off * 3600000).toISOString().slice(11, 16);
const fmtDT = (d, off) => {
  const t = new Date(d.getTime() + off * 3600000).toISOString();
  return `${t.slice(0, 10)} ${t.slice(11, 16)}`;
};
const offLabel = off => `UTC${off >= 0 ? '+' : '−'}${Math.abs(off) % 1 ? Math.abs(off).toFixed(1) : Math.abs(off)}`;

export function initMuhurta() {
  // defaults: NOW at Delhi (a natural home for the pañcāṅga clock); the
  // 📍 button switches to here-and-now, the city preset to anywhere.
  const istNow = new Date(Date.now() + 5.5 * 3600000).toISOString();
  $('mu-date').value = istNow.slice(0, 10);
  $('mu-time').value = istNow.slice(11, 16);
  $('mu-offset').value = 5.5;
  $('mu-lat').value = 28.6139; $('mu-lon').value = 77.209;   // Delhi, IN
  wireCitySelect($('mu-city'), $('mu-lat'), $('mu-lon'), $('mu-offset'),
    { dateIn: $('mu-date'), timeIn: $('mu-time'), afterGeo: () => run() });

  $('mu-now').addEventListener('click', () => {
    const f = nowLocalFields();
    $('mu-date').value = f.date; $('mu-time').value = f.time; $('mu-offset').value = f.offset;
    run();
  });
  $('mu-form').addEventListener('submit', e => { e.preventDefault(); run(); });

  // the AI panel: the shared divination assistant, Jyotiṣa-historian voice
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'muhurta',
      getReading: () => lastReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Compute the day above first.' },
    });
  }

  run();                                       // auto-run so the page is never empty
}

function run() {
  const lat = parseFloat($('mu-lat').value), lon = parseFloat($('mu-lon').value);
  const off = parseFloat($('mu-offset').value) || 0;
  const status = $('mu-status');
  if (isNaN(lat) || isNaN(lon) || !$('mu-date').value || !$('mu-time').value) {
    status.textContent = 'Enter a date, time and place first.'; return;
  }
  status.textContent = '';
  let rep;
  try {
    rep = muhurtaReport(toUTC($('mu-date').value, $('mu-time').value, off), lat, lon);
  } catch (e) {
    $('mu-summary').innerHTML = '<p class="muted">This moment could not be computed in this browser. Try the “Now” button or a different date.</p>';
    $('mu-timeline').innerHTML = ''; $('mu-screens').innerHTML = '';
    return;
  }
  lastReport = rep;
  notifyReport();
  if (rep.error) {
    $('mu-summary').innerHTML = `<p class="muted">${esc(rep.error)}</p>`;
    $('mu-timeline').innerHTML = ''; $('mu-screens').innerHTML = '';
    return;
  }
  renderSummary(rep, off);
  renderTimeline(rep, off);
  renderScreens(rep);
  autolinkResultPanels(['mu-summary', 'mu-timeline', 'mu-screens']);
}

// ---------------------------------------------------------------------------
function qualityChip(m) {
  const cls = m.quality === 'auspicious' ? 'mu-q-ausp' : m.quality === 'inauspicious' ? 'mu-q-inausp' : 'mu-q-mixed';
  const flag = m.contested
    ? ` <span class="mu-flag" title="${esc(m.contested.flag + ' ' + m.contested.positions.map(p => `${p.source}: ${p.value}`).join(' | '))}">⚑</span>`
    : '';
  return `<span class="mu-q ${cls}">${esc(m.quality)}</span>${flag}`;
}

function verdictChip(v) {
  const cls = v === 'avoid' ? 'mu-q-inausp' : v === 'favourable' ? 'mu-q-ausp' : 'mu-q-mixed';
  return `<span class="mu-q ${cls}">${esc(v)}</span>`;
}

function renderSummary(rep, off) {
  const k = rep.kalas;
  const kline = ['rahu', 'yama', 'gulika'].map((key, i) =>
    `<b>${['Rāhu-kāla', 'Yamaghaṇṭa', 'Gulika-kāla'][i]}</b> ${fmtT(k[key].start, off)}–${fmtT(k[key].end, off)} <span class="muted">(octant ${k[key].octant})</span>`)
    .join(' · ');
  const cur = rep.current
    ? `#${rep.current.num} <b>${esc(rep.current.name)}</b> (${fmtT(rep.current.start, off)}–${fmtT(rep.current.end, off)}) ${qualityChip(rep.current)}`
    : '<span class="muted">—</span>';
  $('mu-summary').innerHTML = `
    <ul class="clean small">
      <li><b>Vāra (sunrise-bounded weekday):</b> ${esc(rep.vara.name)} — day of <b>${esc(rep.vara.lord)}</b>
        ${rep.vara.differsFromCivilUTC ? `<span class="mu-flag" title="${esc(rep.vara.note)}">⚑ differs from the civil-UTC vāra (${esc(rep.vara.civilUTCVara)})</span>` : ''}</li>
      <li><b>Sunrise</b> ${fmtT(rep.sunrise, off)} · <b>Sunset</b> ${fmtT(rep.sunset, off)} ·
        <b>Next sunrise</b> ${fmtDT(rep.nextSunrise, off)} <span class="muted">(all times ${esc(offLabel(off))})</span></li>
      <li><b>The moment falls in:</b> ${cur}</li>
      <li><b>The three kālas (avoid, day arc ÷ 8):</b> ${kline}</li>
      <li><b>Abhijit</b> (day-muhūrta 8, straddles local apparent noon): ${fmtT(rep.abhijit.start, off)}–${fmtT(rep.abhijit.end, off)},
        midpoint ${fmtT(rep.abhijit.midpoint, off)}${rep.abhijit.todayException ? ` — <span class="mu-flag" title="${esc(rep.abhijit.todayException)}">⚑ weekday exception applies today (contested)</span>` : ''}</li>
      <li><b>Brāhma muhūrta</b> (29th of 30, pre-dawn): ${fmtT(rep.brahma.start, off)}–${fmtT(rep.brahma.end, off)}</li>
    </ul>
    <p class="small muted" style="margin:.5rem 0 0">${esc(rep.vara.note)}</p>
    <p class="small muted" style="margin:.3rem 0 0">${esc(rep.notes[1])} ${esc(rep.notes[2])}</p>`;
}

// ---------------------------------------------------------------------------
function renderTimeline(rep, off) {
  const KALAS = [['rahu', 'Rāhu-kāla'], ['yama', 'Yamaghaṇṭa'], ['gulika', 'Gulika-kāla']];
  const rows = rep.muhurtas.map(m => {
    const chips = KALAS
      .filter(([key]) => m.start < rep.kalas[key].end && rep.kalas[key].start < m.end)
      .map(([, label]) => `<span class="mu-kala">${esc(label)}</span>`).join('');
    const star = m.isAbhijit ? ' ★ Abhijit' : m.isBrahma ? ' ★ Brāhma muhūrta' : '';
    const varTip = m.variants ? ` <span class="mu-flag muted" title="${esc(m.variants)}">*</span>` : '';
    const cond = m.condition ? `<div class="small muted">${esc(m.condition)}</div>` : '';
    return `<tr${m.isAbhijit || m.isBrahma ? ' class="mu-star"' : ''}>
      <td>${m.num}</td>
      <td class="l"><b>${esc(m.name)}</b>${varTip}${star ? `<b class="muted">${esc(star)}</b>` : ''}${cond}</td>
      <td>${m.isDay ? 'day' : 'night'}</td>
      <td>${fmtT(m.start, off)}</td>
      <td>${fmtT(m.end, off)}</td>
      <td>${qualityChip(m)}</td>
      <td class="l">${chips || '<span class="muted">—</span>'}</td>
    </tr>`;
  }).join('');
  $('mu-timeline').innerHTML = `
    <div style="overflow-x:auto"><table class="data">
      <thead><tr><th>#</th><th class="l">Muhūrta</th><th>Arc</th><th>From</th><th>To</th><th>Classical quality</th><th class="l">Kāla overlap (avoid)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="small muted" style="margin:.5rem 0 0">⚑ = contested in the sources (hover for both positions, kept verbatim);
      * = name variant (hover). Times ${esc(offLabel(off))}. <b>Source:</b> ${esc(rep.citations[0])}</p>`;
}

// ---------------------------------------------------------------------------
function renderScreens(rep) {
  const s = rep.screens;
  const rows = ['tithi', 'yoga', 'karana', 'nakshatra'].map(key => {
    const r = s[key];
    return `<tr>
      <td class="l"><b>${esc(r.limb)}</b></td>
      <td class="l">${esc(r.value)}</td>
      <td class="l">${esc(r.class)}</td>
      <td>${verdictChip(r.verdict)}<div class="small muted">${esc(r.detail)}</div></td>
      <td class="l small muted">${esc(r.cite)}</td>
    </tr>`;
  }).join('');
  $('mu-screens').innerHTML = `
    <div style="overflow-x:auto"><table class="data">
      <thead><tr><th class="l">Limb</th><th class="l">At this moment</th><th class="l">Class</th><th>Classical verdict</th><th class="l">Source</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="small muted" style="margin:.5rem 0 0">“Avoid” and “favourable” are the <em>tradition's</em> gradings
      (${esc(rep.ayanamsaName)} sidereal frame, ayanāṁśa ${esc(rep.ayanamsa)}°), reproduced for study — they carry no
      demonstrated validity and are not advice.</p>`;
}
