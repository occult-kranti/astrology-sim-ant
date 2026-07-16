// ============================================================================
//  moments.js (app) — drives pages/moments.html, the CROSS-SYSTEM MOMENT
//  SCANNER. All computation lives in the pure core (core/moments.js); this
//  file owns the DOM: the range+place+aim form and the compressed timeline
//  table (one row per state-change, not one per step). Honest framing
//  throughout: the columns are separate historical rulebooks, compared —
//  never merged; no demonstrated validity.
// ============================================================================
import { scanMoments, DEFAULT_OPERATION_KEY, MAX_HOURS_AHEAD } from '../core/moments.js';
import { OPERATIONS } from '../core/election.js';
import { wireCitySelect, toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// format a UTC Date in the tool's chosen UTC offset
const fmtT = (d, off) => new Date(d.getTime() + off * 3600000).toISOString().slice(11, 16);
const fmtDT = (d, off) => {
  const t = new Date(d.getTime() + off * 3600000).toISOString();
  return `${t.slice(0, 10)} ${t.slice(11, 16)}`;
};
const offLabel = off => `UTC${off >= 0 ? '+' : '−'}${Math.abs(off) % 1 ? Math.abs(off).toFixed(1) : Math.abs(off)}`;

const KALA_LABELS = { rahu: 'Rāhu-kāla', yama: 'Yamaghaṇṭa', gulika: 'Gulika-kāla' };

export function initMoments() {
  // defaults: here-and-now (the browser's clock & zone), London as the preset
  // place; the 📍 button switches to the user's location, the city select to
  // anywhere else.
  const f = nowLocalFields();
  $('mo-date').value = f.date; $('mo-time').value = f.time; $('mo-offset').value = f.offset;
  $('mo-lat').value = 51.5074; $('mo-lon').value = -0.1278;   // London, UK
  $('mo-aim').innerHTML = OPERATIONS.map(o =>
    `<option value="${esc(o.key)}"${o.key === DEFAULT_OPERATION_KEY ? ' selected' : ''}>${esc(o.label)} (${esc(o.ruler)})</option>`).join('');
  wireCitySelect($('mo-city'), $('mo-lat'), $('mo-lon'), $('mo-offset'),
    { dateIn: $('mo-date'), timeIn: $('mo-time'), afterGeo: () => run() });

  $('mo-now').addEventListener('click', () => {
    const n = nowLocalFields();
    $('mo-date').value = n.date; $('mo-time').value = n.time; $('mo-offset').value = n.offset;
    run();
  });
  $('mo-form').addEventListener('submit', e => { e.preventDefault(); run(); });

  run();                                       // auto-run so the page is never empty
}

function run() {
  const lat = parseFloat($('mo-lat').value), lon = parseFloat($('mo-lon').value);
  const off = parseFloat($('mo-offset').value) || 0;
  const hours = Math.min(MAX_HOURS_AHEAD, parseInt($('mo-hours').value, 10) || 24);
  const status = $('mo-status');
  if (isNaN(lat) || isNaN(lon) || !$('mo-date').value || !$('mo-time').value) {
    status.textContent = 'Enter a start moment and place first.'; return;
  }
  status.textContent = 'Scanning…';
  let res; const t0 = performance.now();
  try {
    res = scanMoments(toUTC($('mo-date').value, $('mo-time').value, off), hours, lat, lon,
      { operationKey: $('mo-aim').value || DEFAULT_OPERATION_KEY });
  } catch (e) {
    status.textContent = '';
    $('mo-out').innerHTML = '<p class="muted">This range could not be computed in this browser. Try the “Now” button or a different start.</p>';
    return;
  }
  const ms = performance.now() - t0;
  renderScan(res, off, ms);
  autolinkResultPanels(['mo-out']);
}

// ---------------------------------------------------------------------------
//  Compression: the scan returns one row per step; we render a row only when
//  a tradition's state CHANGES — the Lilly verdict, the hour ruler, the
//  muhūrta, the kāla, or any pañcāṅga screen verdict. A rendered row's state
//  holds until the next rendered row.
// ---------------------------------------------------------------------------
const sigOf = r => [
  r.lilly ? r.lilly.verdict : '',
  r.hour ? r.hour.ruler : '',
  r.muhurta ? r.muhurta.num : '',
  r.kala || '',
  r.panchanga ? r.panchanga.yogaVerdicts.summary : '',
].join('|');

function compress(rows) {
  const out = [];
  let prev = null;
  for (const r of rows) {
    const s = sigOf(r);
    if (s !== prev) { out.push(r); prev = s; }
  }
  return out;
}

// ---------------------------------------------------------------------------
function lillyCell(l) {
  if (!l) return '<span class="muted">—</span>';
  return `<span class="verdict ${esc(l.verdict)}" title="${esc(l.topReason)}">${esc(l.verdict)}</span>
    <span class="small muted">${l.score >= 0 ? '+' : ''}${l.score}</span>`;
}

function hourCell(h) {
  if (!h) return '<span class="muted">—</span>';
  return `<b>${esc(h.ruler)}</b> <span class="small muted">${h.isNight ? 'night' : 'day'} hour</span>`;
}

function muhurtaCell(m) {
  if (!m) return '<span class="muted">— (no sunrise here)</span>';
  const cls = m.quality === 'auspicious' ? 'mo-q-ausp' : m.quality === 'inauspicious' ? 'mo-q-inausp' : 'mo-q-mixed';
  const star = m.isAbhijit ? ' <span class="mo-star" title="Abhijit — the noon muhūrta">★</span>'
    : m.isBrahma ? ' <span class="mo-star" title="Brāhma muhūrta — the pre-dawn slot">★</span>' : '';
  const flag = m.contested
    ? ' <span class="mo-flag" title="The sources disagree on this muhūrta’s grading — both positions are kept verbatim on the Muhūrta page.">⚑</span>' : '';
  return `#${m.num} <b>${esc(m.name)}</b> <span class="mo-q ${cls}">${esc(m.quality)}</span>${star}${flag}`;
}

function kalaCell(k) {
  if (!k) return '<span class="muted">—</span>';
  return `<span class="mo-kala">${esc(KALA_LABELS[k] || k)}</span>`;
}

function panchangaCell(p) {
  if (!p) return '<span class="muted">—</span>';
  const chip = v => `<span class="mo-q ${v === 'avoid' ? 'mo-q-inausp' : v === 'favourable' ? 'mo-q-ausp' : 'mo-q-mixed'}">${esc(v)}</span>`;
  const v = p.yogaVerdicts;
  return `<span class="small" title="tithi ${esc(p.tithi)} · nakṣatra ${esc(p.nakshatra)}">
    T ${chip(v.tithi)} Y ${chip(v.yoga)} K ${chip(v.karana)} N ${chip(v.nakshatra)}</span>`;
}

function renderScan(res, off, ms) {
  const shown = compress(res.rows);
  const body = shown.map(r => `<tr>
    <td class="l" style="white-space:nowrap">${fmtDT(r.time, off)}</td>
    <td>${lillyCell(r.lilly)}</td>
    <td>${hourCell(r.hour)}</td>
    <td class="l">${muhurtaCell(r.muhurta)}</td>
    <td>${kalaCell(r.kala)}</td>
    <td class="l">${panchangaCell(r.panchanga)}</td>
  </tr>`).join('');

  const m = res.meta;
  $('mo-out').innerHTML = `
    <p class="small"><b>Aim (Lilly/Picatrix column only):</b> ${esc(m.operation.label)} — ruled by ${esc(m.operation.ruler)}.
      <b>Range:</b> ${fmtDT(m.from, off)} → ${fmtDT(m.to, off)} <span class="muted">(${esc(offLabel(off))},
      ${esc(String(m.stepMinutes))}-min steps)</span>. <b>${res.rows.length}</b> steps scanned,
      <b>${shown.length}</b> state-changes shown <span class="muted">(runs where nothing changes are compressed;
      a row holds until the next)</span> — computed in ${ms.toFixed(0)} ms.</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Moment timeline (scrollable)"><table class="data">
      <thead><tr><th class="l">From (local)</th><th>Lilly election</th><th>Planetary hour</th>
        <th class="l">Muhūrta</th><th>Kāla</th><th class="l">Pañcāṅga screens</th></tr></thead>
      <tbody>${body}</tbody>
    </table></div>
    <p class="small muted" style="margin:.5rem 0 0">★ = Abhijit / Brāhma muhūrta · ⚑ = grading contested in the
      sources · T/Y/K/N = tithi · yoga · karaṇa · nakṣatra screens (hover a row's screens for the running tithi
      &amp; nakṣatra; hover a Lilly verdict for its leading testimony). ${esc(m.notes[0])}</p>
    <p class="small muted" style="margin:.3rem 0 0">${esc(m.caveat)}</p>`;
}
