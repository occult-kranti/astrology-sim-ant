// ============================================================================
//  book3-master.js — the Book III Master Tool: a natal super-view. Casts a
//  nativity and reads it through Lilly's Book III apparatus: positions &
//  dignities, the Lord of the Geniture, temperament, the annual profection and
//  Lord of the Year, the hyleg & alcocoden (length of life — a CONTESTED
//  technique, surfaced with its assumptions), the primary directions to the
//  angles (Naibod key, an approximation), and the solar return of a chosen year.
//  It only composes the verified engine; nothing is re-derived.
//  Cites: Lilly, Christian Astrology, Book III.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { essentialDignity, accidentalDignity } from '../core/dignities.js';
import { allAspects } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { SIGNS } from '../core/data/signs.js';
import { annualProfection, monthlyProfection } from '../core/profections.js';
import { hyleg, alcocoden } from '../core/hyleg.js';
import { directionsToAngles } from '../core/directions.js';
import { solarReturn } from '../core/solar-return.js';
import { natalTopicReading } from '../core/natal-topics.js';
import { rectify } from '../core/rectification.js';
import { wireCitySelect, toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';

const $ = id => document.getElementById(id);
const PL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const G = p => PLANET_GLYPHS[p] || p;
let vedicUpdate = null;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sgn = n => (n >= 0 ? '+' : '') + n;
const QUALITY = {
  Fire: { humour: 'Choleric', hot: 1, dry: 1 }, Earth: { humour: 'Melancholic', hot: -1, dry: 1 },
  Air: { humour: 'Sanguine', hot: 1, dry: -1 }, Water: { humour: 'Phlegmatic', hot: -1, dry: -1 }
};
const safe = (el, fn) => { try { fn(); } catch (e) { if (el) el.innerHTML = `<p class="small muted">Could not compute this section: ${esc(e.message)}</p>`; } };

export function initBook3Master() {
  const f = nowLocalFields();
  $('bm-date').value = '1990-01-01'; $('bm-time').value = '12:00'; $('bm-offset').value = 0;
  $('bm-lat').value = 51.5074; $('bm-lon').value = -0.1278;
  $('bm-age').value = 30; $('bm-ryear').value = new Date().getFullYear();
  wireCitySelect($('bm-city'), $('bm-lat'), $('bm-lon'), $('bm-offset'));
  $('bm-now').addEventListener('click', () => { const n = nowLocalFields(); $('bm-date').value = n.date; $('bm-time').value = n.time; $('bm-offset').value = n.offset; });
  $('bm-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  compute();
}

function compute() {
  const date = toUTC($('bm-date').value, $('bm-time').value, parseFloat($('bm-offset').value) || 0);
  const lat = parseFloat($('bm-lat').value), lon = parseFloat($('bm-lon').value);
  if (isNaN(lat) || isNaN(lon)) return;
  const system = $('bm-system').value;
  const age = Math.max(0, parseInt($('bm-age').value, 10) || 0);
  const ryear = parseInt($('bm-ryear').value, 10) || new Date().getFullYear();
  const chart = castChart(date, lat, lon, system);
  const isDay = chart.isDay;
  try { if (!vedicUpdate) vedicUpdate = attachVedicPanel(); vedicUpdate(chart); } catch { /* non-fatal */ }

  // 1. wheel + positions
  safe($('bm-wheel'), () => {
    const bodies = {}; for (const p of PL) bodies[p] = chart.planets[p];
    renderChart($('bm-wheel'), chart, allAspects(bodies), { size: 540 });
  });
  $('bm-summary').innerHTML = `<strong>${formatLon(chart.asc)}</strong> ascending · MC <strong>${formatLon(chart.mc)}</strong> · ${isDay ? 'day' : 'night'} birth`;

  // 2. dignities + Lord of the Geniture + temperament
  const totals = {};
  safe($('bm-planets'), () => {
    let rows = '';
    for (const name of PL) {
      const p = chart.planets[name];
      const ed = essentialDignity(name, p.lon, isDay), ad = accidentalDignity(name, chart);
      totals[name] = ed.total + ad.total;
      rows += `<tr><td>${G(name)} ${name}</td><td class="l">${formatLon(p.lon)}${p.retrograde ? ' ℞' : ''}</td><td>${p.house}</td><td class="${ed.total >= 0 ? 'pos' : 'neg'}">${sgn(ed.total)}</td><td class="${ad.total >= 0 ? 'pos' : 'neg'}">${sgn(ad.total)}</td></tr>`;
    }
    $('bm-planets').innerHTML = rows;
  });
  let lord = null, best = -999;
  for (const [p, t] of Object.entries(totals)) if (t > best) { best = t; lord = p; }
  if (lord) {
    $('bm-lord').innerHTML = `<b>${G(lord)} ${lord}</b> bears the most dignity in the figure (essential + accidental = ${sgn(best)}) and is the <b>Lord of the Geniture</b> — “the most powerful and predominant” planet of the nativity.`;
    safe($('bm-temperament'), () => {
      const contributors = [['Ascendant', signOf(chart.asc).name], ['Moon in', signOf(chart.planets.Moon.lon).name], ['Sun in', signOf(chart.planets.Sun.lon).name], ['Lord of Geniture in', signOf(chart.planets[lord].lon).name]];
      let hot = 0, dry = 0; const humours = { Choleric: 0, Melancholic: 0, Sanguine: 0, Phlegmatic: 0 };
      for (const [, s] of contributors) { const el = SIGNS.find(x => x.name === s).element; const q = QUALITY[el]; hot += q.hot; dry += q.dry; humours[q.humour]++; }
      const dom = Object.entries(humours).sort((a, b) => b[1] - a[1])[0][0];
      $('bm-temperament').innerHTML = `<p>Weighing the Ascendant, Moon, Sun and Lord of the Geniture, the chart leans <b>${hot > 0 ? 'hot' : hot < 0 ? 'cold' : 'balanced'}</b> and <b>${dry > 0 ? 'dry' : dry < 0 ? 'moist' : 'balanced'}</b> — a predominantly <b>${dom}</b> temperament.</p><ul class="small">${contributors.map(([l, s]) => { const el = SIGNS.find(x => x.name === s).element; return `<li>${l} <b>${s}</b> — ${el} (${QUALITY[el].humour})</li>`; }).join('')}</ul>`;
    });
  }

  // 3. annual profection + Lord of the Year
  safe($('bm-profection'), () => {
    const ap = annualProfection(chart, age);
    const mp = monthlyProfection(chart, age, 0);
    const lc = ap.lordCondition || {};
    $('bm-profection').innerHTML = `<p>At age <b>${ap.age}</b> the profection advances the Ascendant to <b>${esc(ap.profectedSign)}</b>, activating the <b>${ap.activatedHouse}${ord(ap.activatedHouse)} house</b>. Its ruler, <b>${G(ap.lordOfYear)} ${ap.lordOfYear}</b>, is the <b>Lord of the Year</b> — its condition (essential ${sgn(lc.essential ?? 0)}, accidental ${sgn(lc.accidental ?? 0)}) colours the year.</p><p class="small">The current profected month opens in <b>${esc(mp.profectedSign)}</b> (ruler ${G(mp.lord)} ${mp.lord}).</p>`;
  });

  // 4. hyleg & alcocoden (contested)
  safe($('bm-hyleg'), () => {
    const hy = hyleg(chart);
    const al = alcocoden(chart, hy);
    const cand = (hy.candidatesExamined || []).map(c => `<tr><td>${esc(c.name)}</td><td class="l">${c.lon != null ? formatLon(c.lon) : '—'}</td><td>${c.house ?? '—'}</td><td>${c.hylegiacal ? 'yes' : 'no'}</td><td>${c.dignified ? 'yes' : 'no'}</td></tr>`).join('');
    const years = al.years ? ` giving <b>${al.years.mean}</b> mean years (greatest ${al.years.greatest}, least ${al.years.least})` : '';
    $('bm-hyleg').innerHTML = `<p>The <b>hyleg</b> (giver of life) is <b>${esc(hy.hyleg || 'none found')}</b>${hy.house ? ` in the ${hy.house}${ord(hy.house)} house` : ''}. The <b>alcocoden</b> (giver of years) is <b>${esc(al.alcocoden || 'none')}</b>${years}.</p><p class="small">${esc(hy.reason || '')}</p><table class="data"><thead><tr><th class="l">Candidate</th><th class="l">Position</th><th>House</th><th>Aphetic place?</th><th>Dignified?</th></tr></thead><tbody>${cand}</tbody></table><p class="small muted">${esc(hy.assumptions || '')} The hyleg/alcocoden is one of the most disputed techniques in the literature — shown for study, not as a prediction of lifespan.</p>`;
  });

  // 5. primary directions to the angles (Naibod)
  safe($('bm-directions'), () => {
    const dirs = directionsToAngles(chart, { maxYears: 90 });
    const rows = dirs.slice(0, 14).map(d => `<tr><td>${G(d.promissor)} ${d.promissor}</td><td>→ ${d.significator}</td><td>${d.arc.toFixed(2)}°</td><td>≈ ${d.years.toFixed(1)} yr</td></tr>`).join('');
    $('bm-directions').innerHTML = `<table class="data"><thead><tr><th class="l">Promissor</th><th>to angle</th><th>Arc</th><th>≈ age of event</th></tr></thead><tbody>${rows}</tbody></table><p class="small muted">Simplified <b>Naibod</b> directions in the zodiac (1° ≈ 1 year of mean solar motion). Lilly's rigorous mundane (Placidian) directions are a further refinement.</p>`;
  });

  // 6. solar return
  safe($('bm-return'), () => {
    const sr = solarReturn(chart, ryear, { lat, lon, system });
    const c = sr.chart;
    $('bm-return').innerHTML = `<p>The Sun returns to its natal place (${formatLon(sr.natalSunLon)}) on <b>${sr.instant.toUTCString()}</b>.</p><p>The revolution for <b>${ryear}</b> rises <b>${formatLon(c.asc)}</b>, with MC <b>${formatLon(c.mc)}</b> and the Sun at <b>${formatLon(c.planets.Sun.lon)}</b> in the ${c.planets.Sun.house}${ord(c.planets.Sun.house)} house.</p><p class="small muted">The solar return (revolution) is read as the theme of the year ahead — Lilly, Book III.</p>`;
  });

  // 7. natal topics — Book III, house by house
  safe($('bm-topics'), () => {
    const r = natalTopicReading(chart);
    const toneCls = t => t === 'favourable' ? 'green' : t === 'afflicted' ? 'red' : 'amber';
    const cards = r.topics.map(t => `<div class="card" style="margin:0">
      <h3 style="margin:0 0 .3rem;font-size:1.02rem">${t.house}. ${esc(t.label)} <span class="verdict ${toneCls(t.tone)}">${t.tone}</span></h3>
      <ul class="clean small" style="margin:.2rem 0">${t.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
      <p class="small muted" style="margin:.1rem 0 0">— ${esc(t.cite)}</p></div>`).join('');
    $('bm-topics').innerHTML = `<div class="grid cols-2" style="gap:.8rem">${cards}</div>
      <div class="callout science" style="margin-top:.8rem"><span class="label">How to read it</span> ${esc(r.caveat)}</div>`;
  });

  // 8. rectification — Animodar & Trutine of Hermes (contested)
  safe($('bm-rectify'), () => {
    const r = rectify(chart);
    const a = r.animodar, t = r.trutine;
    let html = '';
    if (a.ok) {
      html += `<p><b>Animodar (Ptolemy).</b> The pre-natal ${esc(a.syzygy.type)} fell at <b>${esc(a.syzygy.label)}</b>; its almuten is
        <b>${G(a.almuten)} ${esc(a.almuten)}</b> at ${esc(a.almutenLabel)}. Setting the <b>${esc(a.angle)}</b> to its degree-in-sign gives
        <b>${esc(a.correctedAngleLabel)}</b> (from ${esc(a.currentAngleLabel)}) — a suggested birth time of
        <b>${esc(a.suggestedTime.toUTCString())}</b>, a shift of <b>${a.deltaMinutes >= 0 ? '+' : ''}${a.deltaMinutes} min</b>
        (residual ${a.residualDegrees}°).</p><p class="small muted">${esc(a.assumptions)} <span class="muted">${esc(a.citation)}</span></p>`;
    } else { html += `<p class="small muted">Animodar: ${esc(a.reason)}</p>`; }
    if (t.ok) {
      html += `<p style="margin-top:.6rem"><b>Trutine of Hermes (a check).</b> Estimating conception at birth − ${t.gestationDays} days:
        the natal Ascendant (${esc(t.natalAsc.label)}) vs the conception Moon (${esc(t.conceptionMoon.label)}) differ by <b>${t.ascVsConcMoon}°</b>;
        the natal Moon (${esc(t.natalMoon.label)}) vs the conception Asc/Desc by <b>${t.moonVsConcAscDesc}°</b> —
        overall agreement <b>${t.agreementDegrees}°</b> (<b>${esc(t.verdict)}</b>).</p><p class="small muted">${esc(t.assumptions)} <span class="muted">${esc(t.citation)}</span></p>`;
    } else { html += `<p class="small muted">Trutine: ${esc(t.reason)}</p>`; }
    $('bm-rectify').innerHTML = html +
      `<div class="callout science" style="margin-top:.6rem"><span class="label">Contested — for study only</span>
       Rectification has no demonstrated validity; conception is unknown, authors disagree on the almuten and which angle to correct,
       and the gestation length is an idealisation. Shown with every assumption, never as a measurement of your true birth time.</div>`;
  });

  // auto-link glossary jargon in the freshly-rendered prose panels
  autolinkResultPanels(['bm-lord', 'bm-temperament', 'bm-profection', 'bm-hyleg', 'bm-return', 'bm-topics', 'bm-rectify']);
}

const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
function ord(n) { return (n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th'); }
