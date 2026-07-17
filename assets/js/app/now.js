// ============================================================================
//  now.js — the "Right Now" live dashboard. Auto-computes everything about the
//  present moment for a chosen place and re-renders every 60 seconds:
//   • the planetary HOUR & DAY ruler (Chaldean order);
//   • the Moon's condition — sign, phase, speed, mansion, void-of-course, Via
//     Combusta, dispositor and decan face;
//   • what the Lilly–Picatrix tradition deemed fit to do now (ranked elections);
//   • the active chart cautions (chart-health verdict + advisories);
//   • any Behenian fixed-star contacts;
//   • the Sun's decan face today.
//
//  Nothing is re-implemented: it composes the verified engine (astro / cautions
//  / election / planetary-hours / lunar-mansions / decan-faces / behenian-stars).
//  Presented as HISTORICAL practice — astrology has no demonstrated validity.
// ============================================================================
import { castChart, formatLon, signOf } from '../core/astro.js';
import { planetaryHour, hoursTable } from '../core/planetary-hours.js';
import { chartCautions } from '../core/cautions.js';
import { rankNow, moonPhase, moonDispositor, isViaCombusta, nextAuspiciousTime } from '../core/election.js';
import { mansionOf } from '../core/data/lunar-mansions.js';
import { faceOf } from '../core/data/decan-faces.js';
import { starsInAspect } from '../core/data/behenian-stars.js';
import { wireCitySelect, VERDICT_LEGEND } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';
let vedicUpdate = null;

const $ = id => document.getElementById(id);

// HTML-escape any dynamic string before it touches innerHTML.
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// A small severity legend, reused in the cautions card.
const SEV_LEGEND = `<p class="sev-legend small">
  <span class="adv-good">good</span> ·
  <span class="adv-note">note</span> ·
  <span class="adv-caution">caution</span> ·
  <span class="adv-bad">impediment</span></p>`;

let LAT = 51.5074, LON = -0.1278;
let timer = null;

export function initNow() {
  // City picker drives the lat/lon inputs (default London).
  wireCitySelect($('n-city'), $('n-lat'), $('n-lon'), null);
  const refresh = () => {
    const la = parseFloat($('n-lat').value), lo = parseFloat($('n-lon').value);
    if (!isNaN(la)) LAT = la;
    if (!isNaN(lo)) LON = lo;
    render();
  };
  $('n-city').addEventListener('change', refresh);
  $('n-lat').addEventListener('change', refresh);
  $('n-lon').addEventListener('change', refresh);
  // Explicit "Calculate" button — recompute for the (possibly hand-edited) place.
  const calcBtn = $('n-calc');
  if (calcBtn) calcBtn.addEventListener('click', () => {
    refresh();
    const s = $('n-calc-status');
    if (s) {
      const t = new Date();
      s.textContent = `Updated for ${(parseFloat($('n-lat').value) || 0).toFixed(2)}°, ${(parseFloat($('n-lon').value) || 0).toFixed(2)}° at ${t.toLocaleTimeString()}`;
    }
  });

  render();
  if (timer) clearInterval(timer);
  timer = setInterval(render, 60000);
}

// Re-cast the chart for the present instant and repaint every section. Each
// section is independently guarded so one failure cannot blank the page.
function render() {
  const now = new Date();
  const lat = LAT, lon = LON;
  let chart, ph;
  try {
    chart = castChart(now, lat, lon, 'regiomontanus');
  } catch (e) {
    $('n-head').innerHTML = `<p class="adv-bad">The astronomical engine could not compute this moment: ${esc(e.message)}</p>`;
    return;
  }
  try { ph = planetaryHour(now, lat, lon); } catch { ph = null; }
  try { if (!vedicUpdate) vedicUpdate = attachVedicPanel({ currentDate: now }); vedicUpdate(chart); } catch { /* non-fatal */ }

  renderHead(chart, ph, now, lat, lon);
  renderDial(now, lat, lon);
  renderMoon(chart, now);
  renderOps(chart);
  renderCautions(chart, ph);
  renderStars(chart);
  renderSunFace(chart);
}

// 1) Header: local date/time, place, the planetary hour & day ruler.
function renderHead(chart, ph, now, lat, lon) {
  try {
    const when = now.toLocaleString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const where = `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
    const moonSign = signOf(chart.planets.Moon.lon);
    // Dashboard stat tiles for the present moment (plan §T4): the planetary hour,
    // the day ruler and the Moon's sign, glanceable at the top of the board.
    const stats = ph ? `
      <div class="stat-row" style="margin:.5rem 0 0">
        <div class="stat"><div class="stat-num">${esc(ph.ruler)}</div><div class="stat-label">Planetary hour</div></div>
        <div class="stat"><div class="stat-num">${esc(ph.dayRuler)}</div><div class="stat-label">Day ruler</div></div>
        <div class="stat"><div class="stat-num">${esc(ph.hourNumber)}<span style="font-size:.5em"> / 24 ${ph.isNight ? 'night' : 'day'}</span></div><div class="stat-label">Hour of the day</div></div>
        <div class="stat"><div class="stat-num">${esc(moonSign.glyph)} ${esc(moonSign.name)}</div><div class="stat-label">Moon's sign</div></div>
      </div>`
      : `<p style="margin:.4rem 0 0"><span class="adv-note">Planetary hour unavailable at this latitude/date
        (no sunrise or sunset returned).</span></p>`;
    $('n-head').innerHTML = `
      <p style="margin:.1rem 0"><b>${esc(when)}</b></p>
      <p class="small" style="margin:.1rem 0">at ${esc(where)}</p>
      ${stats}`;
  } catch (e) {
    $('n-head').innerHTML = `<p class="adv-bad">Header failed: ${esc(e.message)}</p>`;
  }
}

// 2) The Moon now.
function renderMoon(chart, now) {
  try {
    const moon = chart.planets.Moon;
    const s = signOf(moon.lon);
    const phase = moonPhase(chart);
    const mansion = mansionOf(moon.lon);
    const disp = moonDispositor(chart);
    const face = faceOf(moon.lon);

    // void-of-course: derived from the cautions global advisories.
    const cau = chartCautions(chart, {});
    const voc = cau.global.find(a => /void of course/i.test(a.text));
    const vocText = voc
      ? `<span class="adv-caution">Yes</span> — ${esc(voc.text)}`
      : `<span class="adv-good">No</span> — the Moon still applies to an aspect.`;

    // via combusta with the Spica exception.
    const via = isViaCombusta(moon.lon, now);
    let viaText;
    if (via.active) viaText = `<span class="adv-caution">in the Via Combusta</span> (the "burning way", 15° Libra–15° Scorpio) — distressed.`;
    else if (via.inZone && via.exemptBySpica) viaText = `<span class="adv-note">in the Via Combusta but exempt (conjunct Spica)</span> — the distress is lifted.`;
    else viaText = `<span class="adv-good">not in the Via Combusta.</span>`;

    const spd = Math.abs(moon.speed);
    const dispText = disp.planet ? esc(disp.planet) : '—';

    // illuminated fraction & waxing sense, for the engraved moon instrument
    const sunLon = chart.planets.Sun.lon;
    const elong = phase.elongation;                                   // 0..180 from the Sun
    const frac = (1 - Math.cos(elong * Math.PI / 180)) / 2;           // illuminated fraction 0..1
    const waxing = ((moon.lon - sunLon + 360) % 360) < 180;

    $('n-moon').innerHTML = `
      <h2>The Moon now</h2>
      <div class="sky-inset moon-inset"></div>
      <ul class="advisories">
        <li class="adv-note"><b>${s.glyph} ${esc(s.name)}</b> — ${esc(formatLon(moon.lon))}</li>
        <li class="adv-note">Phase: <b>${esc(phase.label)}</b> · elongation ${esc(phase.elongation.toFixed(1))}° from the Sun</li>
        <li class="adv-note">Speed: <b>${esc(spd.toFixed(2))}°/day</b></li>
        <li class="adv-note">Mansion ${esc(mansion.num)} — <b>${esc(mansion.name)}</b> (${esc(mansion.signSpan)});
          use: ${esc(mansion.use)}</li>
        <li class="adv-note">Void of course: ${vocText}</li>
        <li class="adv-note">Via Combusta: ${viaText}</li>
        <li class="adv-note">Dispositor (ruler of her sign): <b>${dispText}</b></li>
        <li class="adv-note">Her decan face (${esc(face.sign)} face ${esc(face.decan)}, ruled by ${esc(face.ruler)}):
          <span class="small">${esc(face.image)}</span></li>
      </ul>`;
    mountMoonInset($('n-moon').querySelector('.moon-inset'), frac, waxing, `The Moon, ${phase.label}`);
  } catch (e) {
    $('n-moon').innerHTML = `<h2>The Moon now</h2><p class="adv-bad">This section failed: ${esc(e.message)}</p>`;
  }
}

// The engraved Moon instrument (art §7.1) on a small Dome inset with a seeded
// starfield behind the disc. Progressive enhancement: absent skyart → the
// advisory list above is the complete, accessible reading.
async function mountMoonInset(host, frac, waxing, label) {
  if (!host) return;
  const sky = await import('../core/skyart.js').catch(() => null);
  if (!sky || !sky.moonPhaseSVG) return;
  const stars = sky.starfieldSVG ? sky.starfieldSVG({ w: 220, h: 150, seed: 271828 }) : '';
  host.innerHTML = `<div class="sky-inset-stars" aria-hidden="true">${stars}</div>` +
    `<div class="sky-inset-disc">${sky.moonPhaseSVG({ frac, waxing, r: 44, label })}</div>`;
}

// The planetary-hours dial (art §7.2): the instrument portrait of the day's 24
// unequal hours, above its complete accessible source — the 24-row hours table.
function renderDial(now, lat, lon) {
  const host = $('n-dial');
  if (!host) return;
  let table;
  try { table = hoursTable(now, lat, lon); } catch { table = null; }
  // Day-rollback (mirror planetaryHour's logic, planetary-hours.js §24): the
  // planetary day begins at SUNRISE, not midnight. Before today's sunrise the
  // present instant belongs to the PREVIOUS planetary day's night — but
  // hoursTable(now) always starts at TODAY's sunrise, so `now` would fall before
  // row 0 (no hl-row, and the marker/caption would wrongly read today's first
  // day-hour). Rebuild from the previous day so the dial, caption, hl-row and the
  // planetaryHour() stat tile always agree. (planetaryHour rolls back the same way.)
  if (table && now < table.sunrise) {
    try {
      const prev = hoursTable(new Date(now.getTime() - 24 * 3600000), lat, lon);
      if (prev && now >= prev.sunrise && now < prev.nextRise) table = prev;
    } catch { /* keep today's table */ }
  }
  if (!table) {
    host.innerHTML = '<h2>The planetary hours of today</h2><p class="adv-note">No sunrise or sunset was returned at this latitude and date, so unequal hours cannot be drawn.</p>';
    return;
  }
  // Adapt hoursTable rows → the dial's {start,end,planet,isDay} shape.
  const rows = table.rows;
  const hours = rows.map((r, i) => ({
    start: r.start,
    end: (i + 1 < rows.length ? rows[i + 1].start : table.nextRise),
    planet: r.ruler, isDay: !r.night,
  }));
  const cur = hours.find(h => now >= h.start && now < h.end) || hours[0];
  const rowsHtml = rows.map((r, i) => {
    const end = i + 1 < rows.length ? rows[i + 1].start : table.nextRise;
    const isNow = now >= r.start && now < end;
    const t = d => new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `<tr${isNow ? ' class="hl-row"' : ''}><td class="num">${r.hour}</td>
      <td>${r.night ? 'night' : 'day'}</td><td><b>${esc(r.ruler)}</b></td>
      <td class="l small">${esc(t(r.start))}–${esc(t(end))}</td></tr>`;
  }).join('');
  host.innerHTML = `<h2>The planetary hours of today</h2>
    <div class="n-dial-fig"></div>
    <p class="small">The day and night are each divided into twelve <b>unequal</b> hours between sunrise and sunset; the
      dial makes that asymmetry visible. The gilt hand marks the present hour, ruled by <b>${esc(cur.planet)}</b>.</p>
    <details class="small"><summary>The 24 hours as a table (the complete source)</summary>
      <div class="table-scroll"><table class="data"><thead><tr><th class="num">#</th><th>Half</th><th>Ruler</th><th class="l">Span (local)</th></tr></thead>
        <tbody>${rowsHtml}</tbody></table></div></details>`;
  mountHourDial(host.querySelector('.n-dial-fig'), hours, now);
}

async function mountHourDial(figHost, hours, now) {
  if (!figHost) return;
  const sky = await import('../core/skyart.js').catch(() => null);
  if (!sky || !sky.hourDialSVG) return;
  try { figHost.innerHTML = sky.hourDialSVG({ hours, now, r: 120 }); } catch { /* non-fatal */ }
}

// 3) Best vs least advised now — every operation ranked for this place & time.
function verdictWord(v) { return v === 'green' ? 'favourable' : v === 'amber' ? 'mixed' : 'unfavourable'; }
function opRow(r) {
  const op = r.operation;
  const reason = (r.reasons && r.reasons[0]) ? r.reasons[0].text : '';
  return `<li class="adv-${r.verdict === 'green' ? 'good' : r.verdict === 'amber' ? 'note' : 'caution'}">
    <a href="picatrix/election.html?op=${esc(op.key)}">
      <span class="verdict ${esc(r.verdict)}">${verdictWord(r.verdict)}</span>
      <b>${esc(op.label)}</b></a>
    <span class="small">— ruler ${esc(op.ruler)}, score ${esc(r.score)}</span>
    ${reason ? `<div class="small muted">${esc(reason)}</div>` : ''}
  </li>`;
}
function renderOps(chart) {
  try {
    const ranked = rankNow(chart);                 // all operations, best-first
    if (!ranked.length) { $('n-ops').innerHTML = '<h2>Best vs least advised now</h2><p class="adv-note">No operations could be scored.</p>'; return; }
    const n = ranked.length;
    const bestCount = Math.min(5, Math.ceil(n / 2));
    const best = ranked.slice(0, bestCount);
    const least = ranked.slice(-3).reverse();       // worst first
    const topLabel = best[0].operation.label;
    $('n-ops').innerHTML = `
      <h2>How the election rules score the present sky</h2>
      <p class="small">Of the ${n} traditional operations, the electional testimonies right now score
        <b>${esc(topLabel)}</b> highest. Each links to the full cited breakdown in the Election Engine.</p>
      <div class="grid cols-2">
        <div>
          <h3 style="margin:.2rem 0">Highest-scoring now</h3>
          <ul class="advisories">${best.map(opRow).join('')}</ul>
        </div>
        <div>
          <h3 style="margin:.2rem 0">Lowest-scoring now</h3>
          <ul class="advisories">${least.map(opRow).join('')}</ul>
        </div>
      </div>
      <p class="small">A ranking of the Lilly–Picatrix electional testimonies for this instant — historical
        method, <em>described not prescribed</em>; not advice, and astrology has no demonstrated validity.</p>`;
  } catch (e) {
    $('n-ops').innerHTML = `<h2>Best vs least advised now</h2><p class="adv-bad">This section failed: ${esc(e.message)}</p>`;
  }
}

// 4) Cautions now — the chart-health verdict + advisories.
function renderCautions(chart, ph) {
  try {
    const cau = chartCautions(chart, { hourRuler: ph ? ph.ruler : null });
    const items = cau.global.map(a =>
      `<li class="adv-${esc(a.severity)}">${esc(a.text)}</li>`).join('');
    const nextBtn = cau.verdict === 'green'
      ? '<p class="small adv-good">The chart-health is already clear right now.</p>'
      : `<p><button type="button" class="btn sm" id="n-next-ausp">Find the next clearer hour →</button>
          <span id="n-next-ausp-out" class="small muted"></span></p>`;
    const vmod = cau.verdict === 'green' ? 'ok' : cau.verdict === 'amber' ? 'warn' : 'bad';
    $('n-cautions').innerHTML = `
      <h2>Cautions now</h2>
      <div class="verdict-banner verdict-banner--${vmod}" role="status" aria-live="polite">
        <span class="verdict ${esc(cau.verdict)}">${cau.verdict === 'green' ? 'Clean' : cau.verdict === 'amber' ? 'Cautions' : 'Impeded'}</span>
        <span class="vb-reason">${esc(cau.label)}</span></div>
      <ul class="advisories">${items || '<li class="adv-good">No global cautions stand right now.</li>'}</ul>
      ${nextBtn}
      ${VERDICT_LEGEND}
      ${SEV_LEGEND}`;
    // On demand: scan forward for the next moment the verdict improves (kept off
    // the 60s auto-refresh so the live view stays snappy).
    const btn = document.getElementById('n-next-ausp');
    if (btn) btn.addEventListener('click', () => {
      const out = document.getElementById('n-next-ausp-out');
      if (out) out.textContent = 'Scanning the next 48 hours…';
      try {
        const na = nextAuspiciousTime(new Date(), LAT, LON, { hoursAhead: 48, target: 'amber' });
        if (out) out.textContent = na
          ? `Next more auspicious: ${na.time.toLocaleString()} (~${na.hoursFromNow.toFixed(1)}h) — improves to “${na.verdict}”.`
          : 'No clearer window in the next 48 hours.';
      } catch (e) { if (out) out.textContent = 'Could not scan: ' + (e && e.message); }
    });
  } catch (e) {
    $('n-cautions').innerHTML = `<h2>Cautions now</h2><p class="adv-bad">This section failed: ${esc(e.message)}</p>`;
  }
}

// 5) Fixed stars now — Behenian stars conjunct a planet within 6°.
function renderStars(chart) {
  try {
    const hits = starsInAspect(chart, 6);
    const body = hits.length
      ? `<ul class="advisories">${hits.map(h =>
          `<li class="adv-note"><b>${esc(h.planet)}</b> conjunct <b>${esc(h.star)}</b>
            (${esc(h.sep.toFixed(1))}°)</li>`).join('')}</ul>`
      : `<p class="adv-good">No Behenian star is closely conjunct a planet right now.</p>`;
    $('n-stars').innerHTML = `<h2>Fixed stars now</h2>${body}`;
  } catch (e) {
    $('n-stars').innerHTML = `<h2>Fixed stars now</h2><p class="adv-bad">This section failed: ${esc(e.message)}</p>`;
  }
}

// 6) The Sun's face today.
function renderSunFace(chart) {
  try {
    const face = faceOf(chart.planets.Sun.lon);
    $('n-sunface').innerHTML = `<b>The Sun's face today:</b> ${esc(face.sign)} face ${esc(face.decan)}
      (ruled by ${esc(face.ruler)}) — <span class="small">${esc(face.image)}</span>`;
  } catch (e) {
    $('n-sunface').innerHTML = `<span class="adv-bad">Sun's face failed: ${esc(e.message)}</span>`;
  }
}
