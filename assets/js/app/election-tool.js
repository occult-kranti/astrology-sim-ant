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
  wireCitySelect($('e-city'), $('e-lat'), $('e-lon'), $('e-offset'));

  // 3) Now button refills the moment fields
  $('e-now').addEventListener('click', () => {
    const f = nowLocalFields();
    $('e-date').value = f.date; $('e-time').value = f.time; $('e-offset').value = f.offset;
  });

  $('e-form').addEventListener('submit', e => { e.preventDefault(); judge(); });

  // 4) auto-run once so the page is never empty
  judge();
}

function judge() {
  const op = $('e-op').value;
  const lat = parseFloat($('e-lat').value), lon = parseFloat($('e-lon').value);
  const offset = parseFloat($('e-offset').value) || 0;
  const system = $('e-system').value;

  if (isNaN(lat) || isNaN(lon)) {
    $('e-summary').innerHTML = '<span class="muted">Enter a valid latitude and longitude.</span>';
    return;
  }

  let when, chart, e;
  try {
    when = toUTC($('e-date').value, $('e-time').value, offset);
    chart = castChart(when, lat, lon, system);
    e = electionScore(chart, op);
  } catch (err) {
    $('e-summary').innerHTML =
      '<span class="muted">This moment could not be computed in this browser. Try the “Now” button or a different date.</span>';
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
function renderSummary(e) {
  $('e-summary').innerHTML =
    `<span class="verdict ${esc(e.verdict)}">${esc(verdictWord(e.verdict))}</span> ` +
    `for <b>${esc(e.operation.label)}</b> — ${esc(e.label)} ` +
    `<span class="small">(score ${esc(e.score)})</span>`;
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
        <td>${esc(w.best)}</td>
      </tr>`;
    }).join('');
    box.innerHTML =
      `<table class="data">
        <thead><tr>
          <th scope="col" class="l">Window (start – end, local)</th>
          <th scope="col">Best verdict</th>
          <th scope="col">Best score</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="small muted">Windows are contiguous stretches where the moment scores at least “mixed”, ranked by their peak score. Sampled every 30 minutes.</p>`;
  } catch (err) {
    box.innerHTML = '<p class="small muted">The upcoming-window scan could not be completed in this browser; the readout above is unaffected.</p>';
  }
}
