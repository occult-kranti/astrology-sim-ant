// ============================================================================
//  master-unified.js — the Unified Master Tool. ONE moment + place, read at
//  once through all three of Lilly's books and the Picatrix election layer,
//  each panel linking out to its dedicated tool. It only composes the verified
//  engine — nothing is re-derived. Honest study aid; astrology has no
//  demonstrated predictive validity.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { essentialDignity, accidentalDignity, almuten } from '../core/dignities.js';
import { allAspects } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { chartCautions } from '../core/cautions.js';
import { planetaryHour } from '../core/planetary-hours.js';
import { rankNow } from '../core/election.js';
import { DOMICILE } from '../core/data/dignities-data.js';
import { mansionOf } from '../core/data/lunar-mansions.js';
import { faceOf } from '../core/data/decan-faces.js';
import { starsInAspect } from '../core/data/behenian-stars.js';
import { hyleg, alcocoden } from '../core/hyleg.js';
import { annualProfection } from '../core/profections.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';
let vedicUpdate = null;

const $ = id => document.getElementById(id);
const PL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const G = p => PLANET_GLYPHS[p] || p;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sgn = n => (n >= 0 ? '+' : '') + n;
const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => (n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th');
const safe = (el, fn) => { try { fn(); } catch (e) { if (el) el.innerHTML = `<p class="small muted">Could not compute: ${esc(e.message)}</p>`; } };
const ADV = sev => ({ good: 'adv-good', note: 'adv-note', caution: 'adv-caution', bad: 'adv-bad' }[sev] || 'adv-note');

export function initMaster() {
  const f = nowLocalFields();
  $('u-date').value = f.date; $('u-time').value = f.time; $('u-offset').value = f.offset;
  $('u-lat').value = 51.5074; $('u-lon').value = -0.1278;
  wireCitySelect($('u-city'), $('u-lat'), $('u-lon'), $('u-offset'));
  $('u-now').addEventListener('click', () => { const n = nowLocalFields(); $('u-date').value = n.date; $('u-time').value = n.time; $('u-offset').value = n.offset; });
  $('u-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  compute();
}

function compute() {
  const date = toUTC($('u-date').value, $('u-time').value, parseFloat($('u-offset').value) || 0);
  const lat = parseFloat($('u-lat').value), lon = parseFloat($('u-lon').value);
  if (isNaN(lat) || isNaN(lon)) return;
  const system = $('u-system').value;
  const chart = castChart(date, lat, lon, system);
  const isDay = chart.isDay;
  try { if (!vedicUpdate) vedicUpdate = attachVedicPanel(); vedicUpdate(chart); } catch { /* non-fatal */ }
  const ph = planetaryHour(date, lat, lon);

  // 1. the moment
  safe($('u-moment'), () => {
    const bodies = {}; for (const p of PL) bodies[p] = chart.planets[p];
    renderChart($('u-wheel'), chart, allAspects(bodies), { size: 480 });
    let rows = '';
    for (const name of PL) { const p = chart.planets[name]; rows += `<tr><td>${G(name)} ${name}</td><td class="l">${formatLon(p.lon)}${p.retrograde ? ' ℞' : ''}</td><td>${p.house}</td></tr>`; }
    $('u-positions').innerHTML = rows;
    $('u-hour').innerHTML = ph
      ? `Planetary hour of <b>${G(ph.ruler)} ${ph.ruler}</b> (hour ${ph.hourNumber} of 24, ${ph.isNight ? 'night' : 'day'}) · day of <b>${G(ph.dayRuler)} ${ph.dayRuler}</b>.`
      : 'Planetary hour unavailable for this place/time.';
  });

  // 2. Book I — dignities & chart health
  safe($('u-book1'), () => {
    const aAsc = almuten(chart.asc, isDay), aMc = almuten(chart.mc, isDay);
    let dig = PL.map(n => { const ed = essentialDignity(n, chart.planets[n].lon, isDay); return `${G(n)} ${sgn(ed.total)}`; }).join(' · ');
    const cau = chartCautions(chart, { hourRuler: ph && ph.ruler });
    const adv = cau.global.slice(0, 6).map(a => `<li class="${ADV(a.severity)}">${esc(a.text)}</li>`).join('');
    $('u-book1').innerHTML = `<p>Almuten of the Ascendant: <b>${G(aAsc.planet)} ${aAsc.planet}</b>; of the MC: <b>${G(aMc.planet)} ${aMc.planet}</b>.</p>
      <p class="small">Essential dignity: ${dig}</p>
      <p>Chart health: <span class="verdict ${cau.verdict}">${cau.verdict}</span> — ${esc(cau.label)}</p>
      <ul class="advisories">${adv}</ul>
      <p class="sev-legend small"><span class="adv-good">good</span> · <span class="adv-note">note</span> · <span class="adv-caution">caution</span> · <span class="adv-bad">serious</span></p>`;
  });

  // 3. Book II — significators
  safe($('u-book2'), () => {
    const lordAsc = DOMICILE[signOf(chart.asc).index];
    const la = chart.planets[lordAsc];
    const edL = essentialDignity(lordAsc, la.lon, isDay);
    const moon = chart.planets.Moon;
    $('u-book2').innerHTML = `<p>The <b>Lord of the Ascendant</b> (the querent) is <b>${G(lordAsc)} ${lordAsc}</b> — ${formatLon(la.lon)}, the ${la.house}${ord(la.house)} house, essential dignity ${sgn(edL.total)}.</p>
      <p>The <b>Moon</b> (co-significator / the flow of the matter) is in ${signOf(moon.lon).name}, the ${moon.house}${ord(moon.house)} house, moving ${Math.abs(moon.speed).toFixed(1)}°/day.</p>
      <p class="small muted">For the full horary judgement — quesited house, perfection, timing — open the <a href="book2/horary.html">Horary Calculator</a>.</p>`;
  });

  // 4. Book III — the nativity (the moment read as a birth)
  safe($('u-book3'), () => {
    const totals = {}; for (const n of PL) totals[n] = essentialDignity(n, chart.planets[n].lon, isDay).total + accidentalDignity(n, chart).total;
    let lord = null, best = -999; for (const [p, t] of Object.entries(totals)) if (t > best) { best = t; lord = p; }
    const hy = hyleg(chart); const al = alcocoden(chart, hy);
    const loy = annualProfection(chart, 0).lordOfYear;
    $('u-book3').innerHTML = `<p><b>Lord of the Geniture:</b> ${G(lord)} ${lord} (dignity ${sgn(best)}).</p>
      <p><b>Hyleg:</b> ${esc(hy.hyleg || 'none')} · <b>Alcocoden:</b> ${esc(al.alcocoden || 'none')}${al.years ? ` (≈ ${al.years.mean} mean years)` : ''}.</p>
      <p><b>Lord of the (first) Year:</b> ${G(loy)} ${loy}.</p>
      <p class="small muted">Natal techniques shown for the birth-moment reading; the hyleg/alcocoden is contested. Full detail in the <a href="book3/master.html">Book III Master Tool</a>.</p>`;
  });

  // 5. Picatrix — election & magic (best vs least advised now)
  safe($('u-picatrix'), () => {
    const ranked = rankNow(chart);
    const best3 = ranked.slice(0, 3), least3 = ranked.slice(-3).reverse();
    const row = r => `<li><span class="verdict ${r.verdict}">${r.verdict}</span> <b>${esc(r.operation.label)}</b> — ruler ${G(r.operation.ruler)} ${r.operation.ruler} <span class="small muted">(score ${r.score})</span></li>`;
    const moon = chart.planets.Moon, m = mansionOf(moon.lon), mf = faceOf(moon.lon), sf = faceOf(chart.planets.Sun.lon);
    const stars = starsInAspect(chart, 6);
    const starsTxt = stars.length ? stars.map(s => `${G(s.planet)} ${s.planet} ∠ ${esc(s.star)} (${s.sep.toFixed(1)}°)`).join('; ') : 'none closely conjunct a planet now';
    $('u-picatrix').innerHTML = `
      <div class="grid cols-2">
        <div><h3 style="margin:.2rem 0">Best advised now</h3><ul class="clean">${best3.map(row).join('')}</ul></div>
        <div><h3 style="margin:.2rem 0">Least advised now</h3><ul class="clean">${least3.map(row).join('')}</ul></div>
      </div>
      <p>Moon in <b>Mansion ${m.num} — ${esc(m.name)}</b> (“${esc(m.use)}”); Moon's face: ${esc(mf.ruler)} — ${esc(mf.image)}.</p>
      <p class="small">Sun's face: ${esc(sf.ruler)} — ${esc(sf.image)}. Behenian contacts: ${starsTxt}.</p>
      <p class="small muted">Drill in with the <a href="picatrix/election.html">Election Engine</a> or watch it live on <a href="now.html">Right Now</a>. Presented as the history of a practice, not advice.</p>`;
  });
}
