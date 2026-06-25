// ============================================================================
//  horary.js — drives the Horary Chart Calculator page.
// ============================================================================
import { castChart, formatLon, signOf, norm360, PLANET_GLYPHS, SIGN_GLYPHS } from '../core/astro.js';
import { essentialDignity, accidentalDignity, dignityRulersAt, almuten } from '../core/dignities.js';
import { allAspects, aspectBetween, mutualReception } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { planetaryHour } from '../core/planetary-hours.js';
import { considerations } from '../core/considerations.js';
import { modesOfPerfection, timeToPerfection } from '../core/perfection.js';
import { DOMICILE } from '../core/data/dignities-data.js';
import { HOUSES } from '../core/data/houses.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';

const $ = id => document.getElementById(id);
const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
let vedicUpdate = null;

export function initHorary() {
  // pre-fill "now" + London
  const n = nowLocalFields();
  $('h-date').value = n.date; $('h-time').value = n.time; $('h-offset').value = 0;
  $('h-lat').value = 51.5074; $('h-lon').value = -0.1278;
  wireCitySelect($('h-city'), $('h-lat'), $('h-lon'), $('h-offset'));

  // quesited house dropdown
  $('h-quesited').innerHTML = HOUSES.map(h =>
    `<option value="${h.n}">${h.n} — ${h.signifies.split(';')[0]}</option>`).join('');
  $('h-quesited').value = 7;

  $('h-now').addEventListener('click', () => {
    const f = nowLocalFields(); $('h-date').value = f.date; $('h-time').value = f.time; $('h-offset').value = f.offset;
  });
  $('h-geo').addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(p => {
      $('h-lat').value = p.coords.latitude.toFixed(4);
      $('h-lon').value = p.coords.longitude.toFixed(4);
    });
  });
  $('h-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  compute();
}

function compute() {
  const date = toUTC($('h-date').value, $('h-time').value, parseFloat($('h-offset').value) || 0);
  const lat = parseFloat($('h-lat').value), lon = parseFloat($('h-lon').value);
  const system = $('h-system').value;
  const quesited = parseInt($('h-quesited').value, 10);
  if (isNaN(lat) || isNaN(lon)) return;

  const chart = castChart(date, lat, lon, system);
  const ph = planetaryHour(date, lat, lon);
  const isDay = chart.isDay;
  try { if (!vedicUpdate) vedicUpdate = attachVedicPanel(); vedicUpdate(chart); } catch { /* non-fatal */ }

  // --- chart wheel ---
  const bodies = {}; for (const p of PLANETS7) bodies[p] = chart.planets[p];
  const asps = allAspects(bodies);
  renderChart($('h-wheel'), chart, asps, { size: 540 });

  // --- header line ---
  $('h-summary').innerHTML =
    `<strong>${formatLon(chart.asc)}</strong> ascending · MC <strong>${formatLon(chart.mc)}</strong> ·
     ${isDay ? 'a <b>day</b> chart' : 'a <b>night</b> chart'} ·
     ${ph ? `planetary hour of <b>${ph.ruler}</b> ${PLANET_GLYPHS[ph.ruler]} (a ${ph.dayRuler}-day)` : ''}`;

  // --- planet/dignity table ---
  let rows = '';
  for (const name of PLANETS7) {
    const p = chart.planets[name];
    const ed = essentialDignity(name, p.lon, isDay);
    const ad = accidentalDignity(name, chart);
    const s = signOf(p.lon);
    const dig = ed.rows.map(r => `<span class="${r.score >= 0 ? 'pos' : 'neg'}">${r.kind}</span>`).join(', ');
    rows += `<tr>
      <td>${PLANET_GLYPHS[name]} ${name}</td>
      <td class="l">${formatLon(p.lon)}${p.retrograde ? ' ℞' : ''}</td>
      <td>${p.house}</td>
      <td class="l small">${dig}</td>
      <td class="${ed.total >= 0 ? 'pos' : 'neg'}">${ed.total >= 0 ? '+' : ''}${ed.total}</td>
      <td class="${ad.total >= 0 ? 'pos' : 'neg'}">${ad.total >= 0 ? '+' : ''}${ad.total}</td>
    </tr>`;
  }
  // nodes + fortune
  for (const name of ['NorthNode', 'SouthNode', 'Fortune']) {
    const p = chart.planets[name];
    rows += `<tr><td>${PLANET_GLYPHS[name]} ${name.replace('Node', ' Node')}</td>
      <td class="l">${formatLon(p.lon)}</td><td>${p.house}</td><td colspan="3" class="muted small">point</td></tr>`;
  }
  $('h-planets').innerHTML = rows;

  // --- significators ---
  const lordAsc = DOMICILE[signOf(chart.asc).index];
  const quesitedSign = signOf(chart.cusps[quesited]).index;
  const lordQ = DOMICILE[quesitedSign];
  const moon = chart.planets.Moon;
  const querentSig = chart.planets[lordAsc];
  const quesitedSig = chart.planets[lordQ];

  // aspect between the two significators
  let perfection = '';
  if (lordAsc === lordQ) {
    perfection = `The querent and the quesited share the same significator (<b>${lordAsc}</b>) — the houses are ruled by one planet, a strong (often affirmative) testimony.`;
  } else {
    const a = aspectBetween(lordAsc, querentSig, lordQ, quesitedSig);
    if (a) {
      perfection = `The significators are in <b>${a.aspect.toLowerCase()}</b> ${a.glyph}, and <b>${a.applying ? 'applying' : 'separating'}</b> (orb ${a.orb.toFixed(1)}°). `
        + (a.applying
          ? `An applying ${a.nature === 'easy' ? 'sextile/trine' : a.nature === 'hard' ? 'square/opposition' : 'conjunction'} promises the matter ${a.nature === 'hard' ? 'with difficulty' : a.nature === 'easy' ? 'with ease' : 'directly'}.`
          : 'A separating aspect usually means the matter is past, or will not perfect of itself.');
    } else {
      perfection = `The significators (<b>${lordAsc}</b> and <b>${lordQ}</b>) cast no aspect within orb — look to the Moon, or to translation/collection of light, for perfection.`;
    }
  }
  // reception between significators
  let recep = '';
  const mr = mutualReception(lordAsc, querentSig.lon, lordQ, quesitedSig.lon, l => dignityRulersAt(l, isDay));
  if (mr) recep = ` There is <b>mutual reception</b> (${lordAsc} in ${lordQ}'s ${mr.byA.join('/')}, ${lordQ} in ${lordAsc}'s ${mr.byB.join('/')}) — easing the matter, even through a hard aspect.`;

  // Moon's next aspect (the general flow of the matter)
  let moonNext = '';
  let best = null;
  for (const name of PLANETS7) {
    if (name === 'Moon') continue;
    const a = aspectBetween('Moon', moon, name, chart.planets[name]);
    if (a && a.applying && (!best || a.orb < best.orb)) best = { name, ...a };
  }
  if (best) moonNext = `The Moon next applies to a <b>${best.aspect.toLowerCase()}</b> ${best.glyph} of <b>${best.name}</b> (orb ${best.orb.toFixed(1)}°) — this shows the drift and outcome of the matter.`;
  else moonNext = 'The Moon makes no further applying aspect before leaving her sign — she is <b>void of course</b>.';

  $('h-significators').innerHTML = `
    <p><b>Querent</b> — ruler of the 1st (${SIGN_GLYPHS[signOf(chart.asc).index]} ${signOf(chart.asc).name} rising):
      <b>${lordAsc}</b> ${PLANET_GLYPHS[lordAsc]} at ${formatLon(querentSig.lon)} in the ${querentSig.house}th;
      with the <b>Moon</b> ☽ at ${formatLon(moon.lon)} as co-significator.</p>
    <p><b>Quesited</b> — the ${ordinal(quesited)} house (${HOUSES[quesited - 1].signifies.split(';')[0]}),
      ruled by <b>${lordQ}</b> ${PLANET_GLYPHS[lordQ]} at ${formatLon(quesitedSig.lon)} in the ${quesitedSig.house}th.</p>
    <p>${perfection}${recep}</p>
    <p>${moonNext}</p>`;

  // --- modes of perfection & timing ---
  const modes = modesOfPerfection(chart, lordAsc, lordQ, l => dignityRulersAt(l, isDay));
  const mLines = [];
  if (lordAsc === lordQ) mLines.push('Querent and quesited share one significator — a strong, often affirmative, direct testimony.');
  if (modes.direct) {
    const dir = modes.direct;
    mLines.push(`<b>Direct ${dir.aspect.toLowerCase()}</b> ${dir.glyph} of the significators — <span class="${dir.applying ? 'pos' : 'muted'}">${dir.applying ? 'applying, so the matter perfects' : 'separating, so it is past or denied'}</span> (orb ${dir.orb.toFixed(1)}°).`);
    if (dir.applying) {
      const t = timeToPerfection(dir.orb, querentSig.lon, querentSig.house);
      mLines.push(`<b>Timing</b>: from ${dir.orb.toFixed(1)}° to perfection, the significator being in a ${t.mode.toLowerCase()} sign in an ${t.house.toLowerCase()} house → <b>${t.text}</b> <span class="muted">(Lilly proportions a mean; treat as an estimate).</span>`);
    }
  }
  if (modes.translation) mLines.push(`<b>Translation of light</b>: ${PLANET_GLYPHS[modes.translation.carrier]} ${modes.translation.carrier} carries light from ${modes.translation.from} to ${modes.translation.to} — a third party brings the matter about.`);
  if (modes.collection) mLines.push(`<b>Collection of light</b>: ${PLANET_GLYPHS[modes.collection.collector]} ${modes.collection.collector} collects both significators${modes.collection.received ? ' and receives them in its dignities' : ''} — perfection by a weightier third party.`);
  if (modes.reception) mLines.push(`<b>Reception</b>: ${modes.reception.mutual ? 'mutual reception' : 'one-way reception'} between the significators — eases the matter, even through a hard aspect.`);
  if (modes.prohibition) mLines.push(`<span class="neg"><b>Prohibition</b></span>: ${PLANET_GLYPHS[modes.prohibition.planet]} ${modes.prohibition.planet} perfects with ${modes.prohibition.target} first — the matter may be hindered.`);
  if (modes.refranation) mLines.push(`<span class="neg"><b>Refranation</b></span>: ${modes.refranation.planet} turns retrograde before perfecting — the matter may come undone.`);
  if (!modes.direct && !modes.translation && !modes.collection)
    mLines.push('No direct aspect, translation or collection between the significators within orb — read the Moon, or reconsider the quesited house.');
  $('h-perfection').innerHTML = mLines.map(l => `<li>${l}</li>`).join('');

  // --- aspects list ---
  $('h-aspects').innerHTML = asps.length
    ? asps.map(a => `<li>${PLANET_GLYPHS[a.from]} ${a.from} <b>${a.glyph} ${a.aspect}</b> ${PLANET_GLYPHS[a.to]} ${a.to}
        — <span class="${a.applying ? 'pos' : 'muted'}">${a.applying ? 'applying' : 'separating'}</span>, orb ${a.orb.toFixed(1)}°</li>`).join('')
    : '<li class="muted">No aspects within orb.</li>';

  // --- considerations ---
  const con = considerations(chart, ph ? ph.ruler : null);
  $('h-considerations').innerHTML = con.advisories.map(a => {
    const icon = a.severity === 'good' ? '✓' : a.severity === 'caution' ? '⚠' : '·';
    const cls = a.severity === 'good' ? 'pos' : a.severity === 'caution' ? 'neg' : 'muted';
    return `<li><span class="${cls}">${icon}</span> ${a.text}</li>`;
  }).join('');

  // --- almuten of the ascendant ---
  const al = almuten(chart.asc, isDay);
  $('h-almuten').textContent = `Almuten of the Ascendant degree: ${al.planet} (essential score ${al.score}).`;
}

function ordinal(n) { return ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'][n]; }
