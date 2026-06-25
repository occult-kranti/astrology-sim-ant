// ============================================================================
//  book1-master.js — the Book I "Master Tool": one chart input → every Book I
//  computation in a single view. Positions, the full essential-dignity ledger
//  for all seven planets, accidental dignity, almutens, aspects with Lilly's
//  orbs, antiscia and their contacts, the Part of Fortune, the planetary hour,
//  and the body-part rulerships.
// ============================================================================
import {
  castChart, formatLon, signOf, norm360, antiscion, contraAntiscion,
  PLANET_GLYPHS, SIGN_GLYPHS
} from '../core/astro.js';
import { essentialDignity, accidentalDignity, almuten, dignityRulersAt } from '../core/dignities.js';
import { allAspects, aspectBetween } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { planetaryHour } from '../core/planetary-hours.js';
import { SIGNS } from '../core/data/signs.js';
import { DOMICILE } from '../core/data/dignities-data.js';
import { genderOfDegree, qualityOfDegree, isFortunateDegree, bodyPartOf } from '../core/data/degree-tables.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';

const $ = id => document.getElementById(id);
const PL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const G = p => PLANET_GLYPHS[p] || p;

export function initMaster() {
  const n = nowLocalFields();
  $('m-date').value = n.date; $('m-time').value = n.time; $('m-offset').value = 0;
  $('m-lat').value = 51.5074; $('m-lon').value = -0.1278;
  wireCitySelect($('m-city'), $('m-lat'), $('m-lon'), $('m-offset'));
  $('m-now').addEventListener('click', () => { const f = nowLocalFields(); $('m-date').value = f.date; $('m-time').value = f.time; $('m-offset').value = f.offset; });
  $('m-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  compute();
}

function compute() {
  const date = toUTC($('m-date').value, $('m-time').value, parseFloat($('m-offset').value) || 0);
  const lat = parseFloat($('m-lat').value), lon = parseFloat($('m-lon').value);
  if (isNaN(lat) || isNaN(lon)) return;
  const chart = castChart(date, lat, lon, $('m-system').value);
  const isDay = chart.isDay;
  const ph = planetaryHour(date, lat, lon);

  const bodies = {}; for (const p of PL) bodies[p] = chart.planets[p];
  const asps = allAspects(bodies);
  renderChart($('m-wheel'), chart, asps, { size: 540 });

  $('m-summary').innerHTML = `<strong>${formatLon(chart.asc)}</strong> ascending · MC
    <strong>${formatLon(chart.mc)}</strong> · ${isDay ? 'day' : 'night'} chart
    ${ph ? `· hour of <b>${G(ph.ruler)} ${ph.ruler}</b> (${ph.dayRuler}-day)` : ''}`;

  // 1) Full essential + accidental dignity ledger
  let rows = '';
  for (const name of PL) {
    const p = chart.planets[name];
    const ed = essentialDignity(name, p.lon, isDay);
    const ad = accidentalDignity(name, chart);
    const s = signOf(p.lon);
    rows += `<tr>
      <td>${G(name)} ${name}</td>
      <td class="l">${formatLon(p.lon)}${p.retrograde ? ' ℞' : ''}</td>
      <td>${p.house}</td>
      <td class="l small">${ed.rows.map(r => `<span class="${r.score >= 0 ? 'pos' : 'neg'}">${r.kind}</span>`).join(', ')}</td>
      <td class="${ed.total >= 0 ? 'pos' : 'neg'}">${ed.total >= 0 ? '+' : ''}${ed.total}</td>
      <td class="${ad.total >= 0 ? 'pos' : 'neg'}">${ad.total >= 0 ? '+' : ''}${ad.total}</td>
      <td class="${(ed.total + ad.total) >= 0 ? 'pos' : 'neg'}"><b>${(ed.total + ad.total) >= 0 ? '+' : ''}${ed.total + ad.total}</b></td>
      <td>${G(ed.dispositor)}</td>
    </tr>`;
  }
  $('m-dignities').innerHTML = rows;

  // 2) Almutens of the angles
  const angAl = [['Ascendant', chart.asc], ['Midheaven', chart.mc]].map(([lbl, l]) => {
    const a = almuten(l, isDay); return `${lbl}: <b>${G(a.planet)} ${a.planet}</b> (${a.score})`;
  }).join(' · ');
  $('m-almutens').innerHTML = angAl;

  // 3) Aspects
  $('m-aspects').innerHTML = asps.length
    ? asps.map(a => `<li>${G(a.from)} ${a.from} <b>${a.glyph} ${a.aspect}</b> ${G(a.to)} ${a.to}
        — <span class="${a.applying ? 'pos' : 'muted'}">${a.applying ? 'applying' : 'separating'}</span>, orb ${a.orb.toFixed(1)}°</li>`).join('')
    : '<li class="muted">No aspects within orb.</li>';

  // 4) Antiscia + contacts
  let antiRows = '', contacts = [];
  for (const name of PL) {
    const p = chart.planets[name];
    const a = antiscion(p.lon), c = contraAntiscion(p.lon);
    antiRows += `<tr><td>${G(name)} ${name}</td><td class="l">${formatLon(a)}</td><td class="l">${formatLon(c)}</td></tr>`;
    // does this antiscion fall on another planet (within 1°)?
    for (const other of PL) {
      if (other === name) continue;
      const op = chart.planets[other].lon;
      if (Math.min(norm360(a - op), norm360(op - a)) <= 1)
        contacts.push(`${G(name)} ${name}'s antiscion meets ${G(other)} ${other} (a hidden conjunction)`);
      if (Math.min(norm360(c - op), norm360(op - c)) <= 1)
        contacts.push(`${G(name)} ${name}'s contra-antiscion meets ${G(other)} ${other} (a hidden opposition)`);
    }
  }
  $('m-antiscia').innerHTML = antiRows;
  $('m-contacts').innerHTML = contacts.length
    ? contacts.map(c => `<li>${c}</li>`).join('') : '<li class="muted">No antiscia contacts within 1°.</li>';

  // 5) Special points
  const pof = chart.planets.Fortune, nn = chart.planets.NorthNode;
  $('m-points').innerHTML = `
    <li>Part of Fortune ⊕ at <b>${formatLon(pof.lon)}</b>, house ${pof.house}</li>
    <li>Dragon's Head ☊ at <b>${formatLon(nn.lon)}</b>, house ${nn.house}; Tail ☋ at ${formatLon(chart.planets.SouthNode.lon)}</li>
    <li>The chart is <b>${isDay ? 'diurnal (a day chart)' : 'nocturnal (a night chart)'}</b> — the Sun is ${isDay ? 'above' : 'below'} the horizon.</li>`;

  // 6) Body-part rulerships (Lilly's planet×sign grid) + degree qualities
  $('m-body').innerHTML = PL.map(name => {
    const s = signOf(chart.planets[name].lon);
    const part = bodyPartOf(name, s.index);
    const gender = genderOfDegree(s.index, s.degInSign);
    const quality = qualityOfDegree(s.index, s.degInSign);
    const fort = isFortunateDegree(s.index, s.degInSign);
    return `<li>${G(name)} ${name} in ${SIGNS[s.index].glyph} ${s.name} → rules the <b>${(part || '').toLowerCase()}</b>
      <span class="muted small">(${gender}, ${quality} degree${fort ? ', <b class="pos">fortunate</b>' : ''})</span></li>`;
  }).join('');
}
