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
import { toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';
import { attachVedicPanel } from './vedic-panel.js';
import { downloadSVG, svgToPNG, copyShareLink, writeStateToURL, readStateFromURL } from './state.js';

const $ = id => document.getElementById(id);
const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
let vedicUpdate = null;
const ENH = {};
let bar = null, picker = null, lastChart = null, lastAsps = null;

export async function initHorary() {
  // pre-fill "now" + London
  const n = nowLocalFields();
  $('h-date').value = n.date; $('h-time').value = n.time; $('h-offset').value = 0;
  $('h-lat').value = 51.5074; $('h-lon').value = -0.1278;

  // quesited house dropdown
  $('h-quesited').innerHTML = HOUSES.map(h =>
    `<option value="${h.n}">${h.n} — ${h.signifies.split(';')[0]}</option>`).join('');
  $('h-quesited').value = 7;
  $('h-quesited').addEventListener('change', () => compute());
  $('h-form').addEventListener('submit', e => { e.preventDefault(); doCompute(); });

  await mountEnhancers();

  // restore inputs from a shared link, if present
  const s = readStateFromURL(['date', 'time', 'offset', 'lat', 'lon', 'system', 'quesited']);
  for (const [k, id] of [['date', 'h-date'], ['time', 'h-time'], ['offset', 'h-offset'], ['lat', 'h-lat'], ['lon', 'h-lon'], ['system', 'h-system'], ['quesited', 'h-quesited']])
    if (s[k] != null && s[k] !== '') $(id).value = s[k];

  compute();
}

async function mountEnhancers() {
  const load = async p => { try { return await import(p); } catch { return null; } };
  ENH.mp = await load('./moment-picker.js'); ENH.ab = await load('./action-bar.js');
  ENH.fig = await load('./viz/figure.js'); ENH.wi = await load('./viz/wheel-interact.js');
  ENH.wr = await load('./wheel-rotate.js');
  try { const insp = await load('./viz/inspect.js'); insp && insp.initInspect && insp.initInspect(); } catch { /* */ }

  const ids = { lat: 'h-lat', lon: 'h-lon', date: 'h-date', time: 'h-time', offset: 'h-offset' };
  if (ENH.mp && ENH.mp.mountMomentPicker) {
    try { picker = ENH.mp.mountMomentPicker($('h-picker'), { mode: 'question', label: 'The moment & place', persist: 'wb', ids, onChange: () => compute() }); }
    catch { revealPickerFallback('h-picker', Object.values(ids)); }
  } else revealPickerFallback('h-picker', Object.values(ids));

  const estat = $('h-export-status');
  const exportsMenu = [{ id: 'h-svg', label: 'Chart SVG' }, { id: 'h-png', label: 'Chart PNG' }];
  if (ENH.ab && ENH.ab.mountActionBar) {
    try { bar = ENH.ab.mountActionBar($('h-actionbar'), { variant: 'tool', exports: exportsMenu, copyLinkId: 'h-share', askAI: null, summary: () => barSummary() }); }
    catch { bar = null; }
  }
  if (!bar) injectFallbackExportBar($('h-actionbar'), exportsMenu, 'h-share');

  const wheelSvg = () => $('h-wheel').querySelector('svg');
  const on = (id, fn) => { const el = $(id); if (el && !el.dataset.hwired) { el.dataset.hwired = '1'; el.addEventListener('click', fn); } };
  on('h-svg', () => downloadSVG(wheelSvg(), 'horary-chart.svg'));
  on('h-png', () => svgToPNG(wheelSvg(), 'horary-chart.png').catch(() => { if (estat) estat.textContent = 'Could not export PNG.'; }));
  on('h-share', () => copyShareLink(estat, hState()));
}

function barSummary() {
  const b = $('h-verdict-banner');
  const v = b && b.querySelector('.verdict');
  return { verdict: v ? v.textContent : '', text: b && !b.hidden ? (b.querySelector('.vb-reason') || {}).textContent || '' : '' };
}

function doCompute() {
  const banner = $('h-verdict-banner'), status = $('h-export-status');
  const btn = $('h-form').querySelector('button[type="submit"]');
  const cf = ENH.ab && ENH.ab.computeFlow;
  if (cf) { try { cf(btn, status, () => compute(), { banner, firstPanel: $('h-p-perfection') }); return; } catch { /* */ } }
  compute();
  if (banner && !banner.hidden) { try { banner.tabIndex = -1; banner.focus({ preventScroll: true }); banner.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' }); } catch { /* */ } }
}

function revealPickerFallback(boxId, ids) {
  const box = document.getElementById(boxId); if (!box || box.dataset.fb) return; box.dataset.fb = '1';
  const meta = { 'h-lat': ['number', 'Lat °N', '0.0001'], 'h-lon': ['number', 'Lon °E', '0.0001'], 'h-date': ['date', 'Date'], 'h-time': ['time', 'Time (local)'], 'h-offset': ['number', 'UTC offset', '0.5'] };
  const row = document.createElement('div'); row.className = 'field-row';
  for (const id of ids) { const input = $(id); if (!input) continue; const [t, l, st] = meta[id] || ['text', id]; input.type = t; if (st) input.step = st; input.style.width = t === 'number' ? '7rem' : ''; const f = document.createElement('div'); f.className = 'field'; const lab = document.createElement('label'); lab.htmlFor = id; lab.textContent = l; f.append(lab, input); row.appendChild(f); }
  box.appendChild(row);
}
function injectFallbackExportBar(box, items, copyId) {
  if (!box) return; const row = document.createElement('div'); row.className = 'field-row'; row.style.marginTop = '.4rem';
  const mk = (id, label) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn-secondary sm'; b.id = id; b.textContent = label; return b; };
  for (const it of items) row.appendChild(mk(it.id, it.label));
  if (copyId) row.appendChild(mk(copyId, 'Copy link'));
  box.appendChild(row);
}

function hState() {
  return { date: $('h-date').value, time: $('h-time').value, offset: $('h-offset').value,
    lat: $('h-lat').value, lon: $('h-lon').value, system: $('h-system').value, quesited: $('h-quesited').value };
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

  // --- chart wheel (through mountFigure + wireWheel + attachWheelRotate) ---
  const bodies = {}; for (const p of PLANETS7) bodies[p] = chart.planets[p];
  const asps = allAspects(bodies);
  lastChart = chart; lastAsps = asps;
  renderWheel($('h-wheel'), chart, asps);

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
      <td class="num ${ed.total >= 0 ? 'pos' : 'neg'}">${ed.total >= 0 ? '+' : ''}${ed.total}</td>
      <td class="num ${ad.total >= 0 ? 'pos' : 'neg'}">${ad.total >= 0 ? '+' : ''}${ad.total}</td>
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

  // Verdict banner: does the matter perfect? (plan §T2 — the buried judgement,
  // lifted to the top.) Perfection = shared significator, an applying direct
  // aspect, translation or collection; else the void Moon denies, or it hangs.
  renderVerdictBanner({
    perfects: (lordAsc === lordQ) || !!(modes.direct && modes.direct.applying) || !!modes.translation || !!modes.collection,
    best, modes, lordAsc, lordQ
  });

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

  // auto-link glossary jargon in the freshly-rendered prose panels
  autolinkResultPanels(['h-significators', 'h-perfection']);
  try { writeStateToURL(hState()); } catch { /* non-fatal */ }
  try { picker && picker.commitRecent && picker.commitRecent(); } catch { /* */ }
  try { bar && bar.show && bar.show(); } catch { /* */ }
}

// Render the wheel through B2's figure/interaction pipeline; fall back to plain DOM.
function renderWheel(container, chart, asps) {
  if (ENH.fig && ENH.fig.mountFigure) {
    try {
      const svgEl = renderChart(document.createElement('div'), chart, asps, { size: 540 });
      container.innerHTML = '';
      ENH.fig.mountFigure(container, { svg: svgEl.outerHTML, ariaLabel: 'Horary chart wheel — planets are buttons', caption: '' });
      const mounted = container.querySelector('svg');
      try { ENH.wi && ENH.wi.wireWheel && ENH.wi.wireWheel(mounted, chart, asps); } catch { /* */ }
      try { ENH.wr && ENH.wr.attachWheelRotate && ENH.wr.attachWheelRotate(container, chart); } catch { /* */ }
      return;
    } catch { /* fall through */ }
  }
  renderChart(container, chart, asps, { size: 540 });
}

// The perfection verdict, lifted to a full-width banner right after the header
// (plan §T2). green = perfects, amber = hangs (read the Moon), red = void Moon
// denies. Links down to the modes-of-perfection panel for the reasoning.
function renderVerdictBanner({ perfects, best, modes, lordAsc, lordQ }) {
  const banner = $('h-verdict-banner'); if (!banner) return;
  let mod, word, reason;
  if (perfects) {
    mod = 'ok'; word = 'perfects';
    reason = lordAsc === lordQ ? 'Querent and quesited share one significator — a strong testimony.'
      : (modes.direct && modes.direct.applying) ? 'The significators apply to a direct aspect — the matter comes to pass.'
      : modes.translation ? 'Perfection by translation of light — a third party carries the matter.'
      : modes.collection ? 'Perfection by collection of light — a weightier planet collects both.'
      : 'The significators come together — the matter perfects.';
  } else if (!best) {
    mod = 'bad'; word = 'denied';
    reason = 'The Moon is void of course — “nothing will come of the matter”.';
  } else {
    mod = 'warn'; word = 'unperfected';
    reason = `No direct perfection within orb — read the Moon, who next applies to ${best.name}.`;
  }
  const pill = mod === 'ok' ? 'green' : mod === 'warn' ? 'amber' : 'red';
  banner.className = 'verdict-banner verdict-banner--' + mod;
  banner.hidden = false;
  banner.innerHTML = `<span class="verdict ${pill}">${word}</span> <span class="vb-reason">${reason}</span> <a class="vb-link" href="#h-p-perfection">the modes of perfection ↓</a>`;
}

function ordinal(n) { return ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'][n]; }
