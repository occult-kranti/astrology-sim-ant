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
import { planetaryHour } from '../core/planetary-hours.js';
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
    let hourLine;
    if (ph) {
      hourLine = `Planetary <b>hour of ${esc(ph.ruler)}</b> (hour ${esc(ph.hourNumber)} of 24,
        ${ph.isNight ? 'night' : 'day'}) · <b>day of ${esc(ph.dayRuler)}</b>`;
    } else {
      hourLine = `<span class="adv-note">Planetary hour unavailable at this latitude/date
        (no sunrise or sunset returned).</span>`;
    }
    $('n-head').innerHTML = `
      <p style="margin:.1rem 0"><b>${esc(when)}</b></p>
      <p class="small" style="margin:.1rem 0">at ${esc(where)}</p>
      <p style="margin:.4rem 0 0">${hourLine}</p>`;
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

    $('n-moon').innerHTML = `
      <h2>The Moon now</h2>
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
  } catch (e) {
    $('n-moon').innerHTML = `<h2>The Moon now</h2><p class="adv-bad">This section failed: ${esc(e.message)}</p>`;
  }
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
    $('n-cautions').innerHTML = `
      <h2>Cautions now</h2>
      <p><span class="verdict ${esc(cau.verdict)}">${cau.verdict === 'green' ? 'Clean' : cau.verdict === 'amber' ? 'Cautions' : 'Impeded'}</span>
        ${esc(cau.label)}</p>
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
