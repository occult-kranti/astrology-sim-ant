// ============================================================================
//  election-tool.js — the interactive Election page. Pick an aim, a moment and
//  a place; this auto-calculates a fully cited electional readout via the
//  Election Engine (core/election.js), and scans the next 72 hours for the best
//  upcoming windows. Presented strictly as historical practice — astrology has
//  no demonstrated predictive validity.
// ============================================================================
import { castChart, formatLon } from '../core/astro.js';
import { OPERATIONS, electionScore, findNextElection } from '../core/election.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';
let vedicUpdate = null;

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initElection() {
  // 1) populate the operation select from the engine's catalogue
  const opSel = $('e-op');
  opSel.innerHTML = OPERATIONS.map(o =>
    `<option value="${esc(o.key)}">${esc(o.label)}</option>`).join('');
  // honour ?op=<key> so the Right-Now dashboard can deep-link a specific aim
  try {
    const want = new URLSearchParams(location.search).get('op');
    if (want && OPERATIONS.some(o => o.key === want)) opSel.value = want;
  } catch { /* non-fatal */ }

  // 2) prefill date/time/offset; default place London
  const n = nowLocalFields();
  $('e-date').value = n.date; $('e-time').value = n.time; $('e-offset').value = 0;
  $('e-lat').value = 51.5074; $('e-lon').value = -0.1278;
  wireCitySelect($('e-city'), $('e-lat'), $('e-lon'), $('e-offset'),
    { dateIn: $('e-date'), timeIn: $('e-time'), afterGeo: () => judge() });

  // 3) Now button refills the moment fields
  $('e-now').addEventListener('click', () => {
    const f = nowLocalFields();
    $('e-date').value = f.date; $('e-time').value = f.time; $('e-offset').value = f.offset;
  });

  $('e-form').addEventListener('submit', e => { e.preventDefault(); judge(); });
  // Live update: changing the aim or house system re-judges at once (no need to
  // press "Judge"), so the readout always matches the selected aim.
  $('e-op').addEventListener('change', () => judge());
  $('e-system').addEventListener('change', () => judge());
  const hb = $('e-heatmap-btn');
  if (hb) hb.addEventListener('click', () => renderHeatmap());

  // 4) auto-run once so the page is never empty
  judge();
}

function judge() {
  const op = $('e-op').value;
  const lat = parseFloat($('e-lat').value), lon = parseFloat($('e-lon').value);
  const offset = parseFloat($('e-offset').value) || 0;
  const system = $('e-system').value;

  if (isNaN(lat) || isNaN(lon)) {
    summaryMessage('Enter a valid latitude and longitude.');
    return;
  }

  let when, chart, e;
  try {
    when = toUTC($('e-date').value, $('e-time').value, offset);
    chart = castChart(when, lat, lon, system);
    try { if (!vedicUpdate) vedicUpdate = attachVedicPanel(); vedicUpdate(chart); } catch { /* non-fatal */ }
    e = electionScore(chart, op);
  } catch (err) {
    summaryMessage('This moment could not be computed in this browser. Try the “Now” button or a different date.');
    $('e-detail').innerHTML = '';
    $('e-reasons').innerHTML = '';
    $('e-windows').innerHTML = '';
    return;
  }

  renderSummary(e);
  renderDetail(e);
  renderReasons(e);
  renderWindows(op, when, lat, lon);
}

// ---------------------------------------------------------------------------
// the traffic-light verdict → the promoted .verdict-banner triad (plan §1.3.9);
// the green/amber/red gravity scale is unchanged — only its presentation is.
const VB_CLASS = { green: 'ok', amber: 'warn', red: 'bad' };
function renderSummary(e) {
  const el = $('e-summary');
  el.className = 'verdict-banner verdict-banner--' + (VB_CLASS[e.verdict] || 'warn');
  el.innerHTML =
    `<span class="verdict ${esc(e.verdict)}">${esc(verdictWord(e.verdict))}</span>` +
    `<span class="vb-reason">for <b>${esc(e.operation.label)}</b> — ${esc(e.label)} ` +
    `<span class="small">(score ${esc(e.score)})</span></span>` +
    `<a class="vb-link" href="#e-reasons-card">see the cited testimonies ↓</a>`;
}
function summaryMessage(msg) {
  const el = $('e-summary');
  el.className = '';
  el.innerHTML = `<span class="muted">${esc(msg)}</span>`;
}

function verdictWord(v) {
  return v === 'green' ? 'Favourable' : v === 'red' ? 'Unfavourable' : 'Mixed';
}

// ---------------------------------------------------------------------------
function renderDetail(e) {
  const m = e.moon;
  const c = e.correspondences || {};
  const ag = c.agrippa || {};

  // hour / day line
  let hourLine;
  if (e.hour) {
    const bits = [];
    if (e.hour.hourMatch) bits.push('the operation’s own hour');
    if (e.hour.dayMatch) bits.push('its own day');
    const tag = bits.length ? ` — <b class="pos">${esc(bits.join(' and '))}</b>` : '';
    hourLine = `Hour of <b>${esc(e.hour.ruler)}</b>, day of <b>${esc(e.hour.dayRuler)}</b>${tag}.`;
  } else {
    hourLine = 'The planetary hour could not be computed for this place.';
  }

  // via combusta phrasing
  let viaLine;
  const v = m.viaCombusta || {};
  if (v.active) viaLine = '<b>in via combusta</b> (the “burning way” — distressed)';
  else if (v.inZone && v.exemptBySpica) viaLine = 'in via combusta but exempt — conjunct Spica (the fortunate oasis)';
  else viaLine = 'clear of the via combusta';

  const disp = (m.dispositor && m.dispositor.planet) ? esc(m.dispositor.planet) : '—';
  const mf = m.face || {}, sf = e.sunFace || {};

  // star contacts
  const starList = (e.stars && e.stars.length)
    ? e.stars.map(s => `${esc(s.planet)} ☌ ${esc(s.star)} (${esc((s.sep ?? 0).toFixed(1))}°)`).join('; ')
    : 'none within orb';

  $('e-detail').innerHTML = `
  <div class="grid cols-2">
    <div class="card">
      <h3 style="margin-top:0">What this moment offers</h3>
      <ul class="clean small">
        <li><b>Operation:</b> ${esc(e.operation.label)} — ruler <b>${esc(e.operation.ruler)}</b>
          (${esc(e.operation.polarity)}); <span class="muted">${esc(e.operation.book)}</span></li>
        <li><b>Planetary hour &amp; day:</b> ${hourLine}</li>
        <li><b>Ruler:</b> ${esc(e.ruler.planet)} —
          essential ${esc(e.ruler.essential >= 0 ? '+' : '')}${esc(e.ruler.essential)}${e.ruler.peregrine ? ', <b>peregrine</b>' : ''}</li>
        <li><b>Moon:</b> ${esc(m.sign)} ${esc(formatLon(m.lon))}, ${esc(m.phase)},
          ${esc((m.speed ?? 0).toFixed(1))}°/day</li>
        <li><b>Mansion:</b> ${esc(m.mansion.num)} — ${esc(m.mansion.name)}
          (“${esc(m.mansion.use)}”)</li>
        <li><b>Via combusta:</b> ${viaLine}</li>
        <li><b>Void of course:</b> ${m.voidOfCourse ? '<b>yes</b>' : 'no'}</li>
        <li><b>Moon's dispositor:</b> ${disp}</li>
        <li><b>Fixed-star contacts:</b> ${starList}</li>
      </ul>
    </div>
    <div class="card">
      <h3 style="margin-top:0">Faces &amp; correspondences</h3>
      <ul class="clean small">
        <li><b>Moon's decan face</b> (${esc(mf.sign)} decan ${esc(mf.decan)}, ruled by ${esc(mf.ruler)}):
          <em>${esc(mf.image)}</em></li>
        <li><b>Sun's decan face</b> (${esc(sf.sign)} decan ${esc(sf.decan)}, ruled by ${esc(sf.ruler)}):
          <em>${esc(sf.image)}</em></li>
        <li><b>Governs:</b> ${esc(c.governs)}</li>
        <li><b>Suffumigation:</b> ${esc(c.suffumigation)}</li>
        <li><b>Colour:</b> ${esc(c.colour)} · <b>Metal:</b> ${esc(c.metal)} · <b>Stone:</b> ${esc(c.stone)}</li>
        <li><b>Spirits:</b> Picatrix prayer-angel ${esc(c.picatrixPrayerAngel)};
          Agrippa angel ${esc(ag.angel)}, intelligence ${esc(ag.intelligence)}, spirit ${esc(ag.spirit)}</li>
      </ul>
      <p class="small muted" style="margin:.4rem 0 0">${esc(c.source)} — presented as historical magical practice, not instruction.</p>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
function renderReasons(e) {
  const reasons = e.reasons || [];
  $('e-reasons').innerHTML = reasons.length
    ? reasons.map(r =>
        `<li class="adv-${esc(r.severity)}">${esc(r.text)}` +
        (r.cite ? ` <span class="small">${esc(r.cite)}</span>` : '') + `</li>`).join('')
    : '<li class="muted">No testimonies were produced for this moment.</li>';
}

// ---------------------------------------------------------------------------
function renderWindows(op, when, lat, lon) {
  const box = $('e-windows');
  box.innerHTML = '<p class="small muted">Scanning the next 72 hours…</p>';
  try {
    const windows = findNextElection(op, when, lat, lon, { hoursAhead: 72, stepMinutes: 30 });
    if (!windows.length) {
      box.innerHTML = '<p class="small">No favourable window in the next 72 hours.</p>';
      return;
    }
    const rows = windows.slice(0, 8).map(w => {
      const verdict = w.bestVerdict || (w.peak && w.peak.verdict) || 'amber';
      return `<tr>
        <td class="l">${esc(w.start.toLocaleString())} – ${esc(w.end.toLocaleString())}</td>
        <td><span class="verdict ${esc(verdict)}">${esc(verdictWord(verdict))}</span></td>
        <td class="num">${esc(w.best)}</td>
      </tr>`;
    }).join('');
    box.innerHTML =
      `<table class="data">
        <thead><tr>
          <th scope="col" class="l">Window (start – end, local)</th>
          <th scope="col">Best verdict</th>
          <th scope="col" class="num">Best score</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="small muted">Windows are contiguous stretches where the moment scores at least “mixed”, ranked by their peak score. Sampled every 30 minutes.</p>`;
  } catch (err) {
    box.innerHTML = '<p class="small muted">The upcoming-window scan could not be completed in this browser; the readout above is unaffected.</p>';
  }
}

// ---------------------------------------------------------------------------
//  The 7-day × 24-hour election heat-map. Each cell is electionScore for that
//  hour & aim; the weekly planetary-hour periodicity emerges as a diagonal.
const VCOLOR = { green: '#2f7d4f', amber: '#c79a2b', red: '#b23b2e' };
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function renderHeatmap() {
  const op = $('e-op').value;
  const lat = parseFloat($('e-lat').value), lon = parseFloat($('e-lon').value);
  const offset = parseFloat($('e-offset').value) || 0;
  const system = $('e-system').value;
  const dateStr = $('e-date').value;
  const box = $('e-heatmap'), status = $('e-heatmap-status');
  if (isNaN(lat) || isNaN(lon)) { box.innerHTML = '<p class="small muted">Enter a valid latitude and longitude.</p>'; return; }
  status.textContent = 'Scoring 168 hours…';
  // Defer so the status paints before the (synchronous) compute loop runs.
  setTimeout(() => {
    try {
      const rows = [];
      for (let d = 0; d < 7; d++) {
        const cells = [];
        for (let h = 0; h < 24; h++) {
          const when = toUTC(dateStr, `${String(h).padStart(2, '0')}:00`, offset);
          when.setUTCDate(when.getUTCDate() + d);
          let v = 'amber', sc = 0;
          try { const e = electionScore(castChart(when, lat, lon, system), op); v = e.verdict; sc = e.score; } catch { /* leave default */ }
          cells.push({ v, sc, h });
        }
        const lbl = toUTC(dateStr, '12:00', offset); lbl.setUTCDate(lbl.getUTCDate() + d);
        const localDow = new Date(lbl.getTime() + offset * 3600000).getUTCDay();
        rows.push({ dow: DOW[localDow], cells });
      }
      const opLabel = (OPERATIONS.find(o => o.key === op) || {}).label || op;
      const head = '<th class="l" style="font-size:.7rem">day＼h</th>' +
        Array.from({ length: 24 }, (_, h) => `<th style="font-size:.62rem;font-weight:400;padding:0 1px">${h}</th>`).join('');
      const body = rows.map(r => `<tr><td class="l small" style="white-space:nowrap;padding-right:.4rem">${esc(r.dow)}</td>` +
        r.cells.map(c => `<td title="${esc(r.dow)} ${c.h}:00 — ${esc(c.v)} (score ${c.sc})" style="background:${VCOLOR[c.v] || '#777'};width:16px;height:16px;border:1px solid rgba(0,0,0,.15)"></td>`).join('') + '</tr>').join('');
      box.innerHTML =
        `<p class="small" style="margin:.2rem 0"><b>${esc(opLabel)}</b> — every hour of the next 7 days
           (<span style="color:${VCOLOR.green}">■</span> fit · <span style="color:${VCOLOR.amber}">■</span> mixed ·
           <span style="color:${VCOLOR.red}">■</span> unfit).</p>
         <table style="border-collapse:collapse"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
         <p class="small muted" style="margin:.3rem 0 0">The favourable cells repeat on a 7-day diagonal because the
           ruler's planetary day &amp; hour recur weekly — the periodicity is the <em>arithmetic of the planetary hours</em>,
           transparent and reproducible, not evidence of an influence on events.</p>`;
      status.textContent = '';
    } catch (err) {
      box.innerHTML = '<p class="small muted">The heat-map could not be computed in this browser.</p>';
      status.textContent = '';
    }
  }, 30);
}
