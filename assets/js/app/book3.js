// ============================================================================
//  book3.js — the Nativity (birth chart) calculator for Book III. Reuses the
//  engine and adds the Lord of the Geniture (almuten of the whole figure) and a
//  simplified humoral temperament estimate after Lilly's method.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { essentialDignity, accidentalDignity } from '../core/dignities.js';
import { allAspects } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { SIGNS } from '../core/data/signs.js';
import { DOMICILE } from '../core/data/dignities-data.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';

const $ = id => document.getElementById(id);
const PL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const G = p => PLANET_GLYPHS[p] || p;

// Each sign's elemental qualities (hot/cold, dry/moist) for temperament.
const QUALITY = { // [hot(+)/cold(-), dry(+)/moist(-)] and humour
  Fire: { humour: 'Choleric', hot: 1, dry: 1 }, Earth: { humour: 'Melancholic', hot: -1, dry: 1 },
  Air: { humour: 'Sanguine', hot: 1, dry: -1 }, Water: { humour: 'Phlegmatic', hot: -1, dry: -1 }
};

export function initNativity() {
  const n = nowLocalFields();
  $('n-date').value = '1990-01-01'; $('n-time').value = '12:00'; $('n-offset').value = 0;
  $('n-lat').value = 51.5074; $('n-lon').value = -0.1278;
  wireCitySelect($('n-city'), $('n-lat'), $('n-lon'), $('n-offset'));
  $('n-now').addEventListener('click', () => { const f = nowLocalFields(); $('n-date').value = f.date; $('n-time').value = f.time; $('n-offset').value = f.offset; });
  $('n-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  compute();
}

function compute() {
  const date = toUTC($('n-date').value, $('n-time').value, parseFloat($('n-offset').value) || 0);
  const lat = parseFloat($('n-lat').value), lon = parseFloat($('n-lon').value);
  if (isNaN(lat) || isNaN(lon)) return;
  const chart = castChart(date, lat, lon, $('n-system').value);
  const isDay = chart.isDay;

  const bodies = {}; for (const p of PL) bodies[p] = chart.planets[p];
  const asps = allAspects(bodies);
  renderChart($('n-wheel'), chart, asps, { size: 540 });

  $('n-summary').innerHTML = `<strong>${formatLon(chart.asc)}</strong> ascending · MC
    <strong>${formatLon(chart.mc)}</strong> · ${isDay ? 'day' : 'night'} birth`;

  // planet table with essential + accidental
  let rows = '';
  const totals = {};
  for (const name of PL) {
    const p = chart.planets[name];
    const ed = essentialDignity(name, p.lon, isDay);
    const ad = accidentalDignity(name, chart);
    totals[name] = ed.total + ad.total;
    rows += `<tr><td>${G(name)} ${name}</td><td class="l">${formatLon(p.lon)}${p.retrograde ? ' ℞' : ''}</td>
      <td>${p.house}</td><td class="${ed.total >= 0 ? 'pos' : 'neg'}">${ed.total >= 0 ? '+' : ''}${ed.total}</td>
      <td class="${ad.total >= 0 ? 'pos' : 'neg'}">${ad.total >= 0 ? '+' : ''}${ad.total}</td></tr>`;
  }
  $('n-planets').innerHTML = rows;

  // Lord of the Geniture: highest combined dignity, well placed
  let lord = null, best = -999;
  for (const [p, t] of Object.entries(totals)) if (t > best) { best = t; lord = p; }
  $('n-lord').innerHTML = `<b>${G(lord)} ${lord}</b> bears the most dignity in the figure
    (essential + accidental = ${best >= 0 ? '+' : ''}${best}) and is the <b>Lord of the Geniture</b> —
    the planet Lilly takes as “the most powerful and predominant” in the nativity, colouring the native's
    whole disposition.`;

  // Temperament: tally hot/cold & dry/moist from Asc sign, Moon sign, Sun sign, Lord of Geniture sign
  const contributors = [
    ['Ascendant sign', signOf(chart.asc).name],
    ['Moon in', signOf(chart.planets.Moon.lon).name],
    ['Sun in', signOf(chart.planets.Sun.lon).name],
    ['Lord of Geniture in', signOf(chart.planets[lord].lon).name]
  ];
  let hot = 0, dry = 0; const humours = { Choleric: 0, Melancholic: 0, Sanguine: 0, Phlegmatic: 0 };
  for (const [, sName] of contributors) {
    const el = SIGNS.find(s => s.name === sName).element;
    const q = QUALITY[el]; hot += q.hot; dry += q.dry; humours[q.humour]++;
  }
  const dominant = Object.entries(humours).sort((a, b) => b[1] - a[1])[0][0];
  $('n-temperament').innerHTML = `
    <p>Weighing the Ascendant, the Moon, the Sun and the Lord of the Geniture, the chart leans
      <b>${hot > 0 ? 'hot' : hot < 0 ? 'cold' : 'balanced (hot/cold)'}</b> and
      <b>${dry > 0 ? 'dry' : dry < 0 ? 'moist' : 'balanced (dry/moist)'}</b> —
      a predominantly <b>${dominant}</b> temperament.</p>
    <ul class="small">${contributors.map(([lbl, s]) => {
      const el = SIGNS.find(x => x.name === s).element;
      return `<li>${lbl} <b>${s}</b> — ${el} (${QUALITY[el].humour})</li>`;
    }).join('')}</ul>
    <p class="small muted">This is a simplified rendering of Lilly's temperament method, which also weighs the
      planets aspecting the Ascendant, the Moon's phase, and the season — see Book III.</p>`;
}
