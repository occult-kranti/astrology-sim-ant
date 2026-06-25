// ============================================================================
//  workbench.js — drives pages/workbench.html, THE unified tool. One moment &
//  place → one `fullReading` (core/reading.js) → every block rendered, linked,
//  exportable, and offered to a local language model. It re-calls nothing: the
//  spine computes once and every panel (and the JSON export, and the assistant)
//  reads the SAME object. Cross-links are generated from core/registry.js, so
//  "where each number comes from" stays in sync with the code.
// ============================================================================
import { wireCitySelect, toUTC, nowLocalFields, VERDICT_LEGEND } from './shared.js';
import { writeStateToURL, readStateFromURL, copyShareLink, downloadJSON, downloadSVG, svgToPNG,
  downloadMarkdown, saveReadingEntry, listSavedReadings, removeSavedReading } from './state.js';
import { castChart, PLANET_GLYPHS } from '../core/astro.js';
import { allAspects } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { fullReading } from '../core/reading.js';
import { REGISTRY, byId } from '../core/registry.js';
import { HOUSES } from '../core/data/houses.js';
import { OPERATIONS } from '../core/election.js';
import { mansionOf } from '../core/data/lunar-mansions.js';
import { faceOf } from '../core/data/decan-faces.js';
import { starsInAspect } from '../core/data/behenian-stars.js';
import { prayerFor } from '../core/data/picatrix-prayers.js';
import { mansionImage } from '../core/data/mansion-images.js';
import { planetImage } from '../core/data/planet-images.js';
import { attachVedicPanel } from './vedic-panel.js';

const $ = id => document.getElementById(id);
const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const STATE_KEYS = ['date', 'time', 'offset', 'lat', 'lon', 'system', 'op', 'q', 'bdate', 'btime', 'boffset', 'blat', 'blon'];

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const sgn = n => (n >= 0 ? '+' : '') + n;
const vbadge = v => `<span class="verdict ${v}">${v}</span>`;
const rel = p => String(p).replace(/^pages\//, '');           // path from inside pages/

// --- last computed reading + a tiny subscription, for the assistant ---------
let lastReading = null, lastChart = null, lastBirthChart = null, wheelSvg = null, vedicUpdate = null;
const readingSubs = [];
export const getReading = () => lastReading;
// the live engine context tool-calls need (the actual castChart objects).
export const getContext = () => ({ chart: lastChart, birthChart: lastBirthChart });
export const subscribeReading = cb => { readingSubs.push(cb); if (lastReading) { try { cb(lastReading); } catch { /* ignore */ } } };

// Registry-driven header links for a panel: "how it's calculated" + dedicated tool.
function regLinks(id) {
  const e = byId(id); if (!e) return '';
  const parts = [];
  if (e.howItWorks) parts.push(`<a href="${esc(rel(e.howItWorks))}">how it's calculated ↗</a>`);
  const pg = (e.pages || []).find(p => !/master\.html$/.test(p)) || (e.pages || [])[0];
  if (pg) parts.push(`<a href="${esc(rel(pg))}">open the dedicated tool ↗</a>`);
  return parts.length ? '— ' + parts.join(' · ') : '';
}

export function initWorkbench() {
  const f = nowLocalFields();
  $('wb-date').value = f.date; $('wb-time').value = f.time; $('wb-offset').value = f.offset;
  $('wb-lat').value = 51.5074; $('wb-lon').value = -0.1278;
  wireCitySelect($('wb-city'), $('wb-lat'), $('wb-lon'), $('wb-offset'));

  $('wb-op').innerHTML = OPERATIONS.map(o => `<option value="${o.key}">${esc(o.label)} (${o.ruler})</option>`).join('');
  // The horary house picker lives IN the horary card now (the main form no longer
  // asks it). Default to the general view (querent + Moon, no specific question).
  $('wb-horary-house').innerHTML = '<option value="">— querent &amp; Moon only (general) —</option>' +
    HOUSES.map(h => `<option value="${h.n}">${h.n} — ${esc(h.signifies.split(';')[0])}</option>`).join('');
  $('wb-horary-house').addEventListener('change', () => run());

  $('wb-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  $('wb-copy').addEventListener('click', () => copyShareLink($('wb-status'), currentState()));
  $('wb-json').addEventListener('click', () => { if (lastReading) downloadJSON(lastReading, 'workbench-reading.json'); });
  $('wb-md').addEventListener('click', () => { if (lastReading) downloadMarkdown(lastReading, 'workbench-reading.md'); });
  $('wb-svg').addEventListener('click', () => downloadSVG(wheelSvg, 'chart.svg'));
  $('wb-png').addEventListener('click', () => { svgToPNG(wheelSvg, 'chart.png').catch(() => { $('wb-status').textContent = 'Could not export PNG.'; }); });
  $('wb-print').addEventListener('click', () => window.print());

  renderSaved();   // the on-device saved-readings list (auto-saved each compute)

  // restore shared state from the URL, if any
  const s = readStateFromURL(STATE_KEYS);
  const set = (k, id) => { if (s[k] != null && s[k] !== '') $(id).value = s[k]; };
  set('date', 'wb-date'); set('time', 'wb-time'); set('offset', 'wb-offset');
  set('lat', 'wb-lat'); set('lon', 'wb-lon'); set('system', 'wb-system');
  set('op', 'wb-op'); set('q', 'wb-horary-house');
  set('bdate', 'wb-bdate'); set('btime', 'wb-btime'); set('boffset', 'wb-boffset'); set('blat', 'wb-blat'); set('blon', 'wb-blon');
  if (s.bdate) $('wb-birth-details').open = true;

  renderAssistantPlaceholder();
  run();
}

function currentState() {
  return {
    date: $('wb-date').value, time: $('wb-time').value, offset: $('wb-offset').value,
    lat: $('wb-lat').value, lon: $('wb-lon').value, system: $('wb-system').value,
    op: $('wb-op').value, q: $('wb-horary-house').value,
    bdate: $('wb-bdate').value, btime: $('wb-btime').value, boffset: $('wb-boffset').value,
    blat: $('wb-blat').value, blon: $('wb-blon').value,
  };
}

function run() {
  const lat = parseFloat($('wb-lat').value), lon = parseFloat($('wb-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('wb-status').textContent = 'Enter a latitude and longitude.'; return; }
  const date = toUTC($('wb-date').value, $('wb-time').value, parseFloat($('wb-offset').value) || 0);
  const system = $('wb-system').value;
  const operationKey = $('wb-op').value || 'love';
  const quesitedHouse = $('wb-horary-house').value ? parseInt($('wb-horary-house').value, 10) : null;

  // optional birth chart → the natal/trajectory block
  let birth = null;
  const blat = parseFloat($('wb-blat').value), blon = parseFloat($('wb-blon').value);
  if ($('wb-bdate').value && $('wb-btime').value && !isNaN(blat) && !isNaN(blon)) {
    try {
      const bdate = toUTC($('wb-bdate').value, $('wb-btime').value, parseFloat($('wb-boffset').value) || 0);
      birth = { chart: castChart(bdate, blat, blon, system) };
    } catch { birth = null; }
  }

  const chart = castChart(date, lat, lon, system);
  const reading = fullReading(chart, { operationKey, quesitedHouse, birth, generatedAt: new Date().toISOString() });
  lastReading = reading; lastChart = chart; lastBirthChart = birth ? birth.chart : null;
  try { if (!vedicUpdate) vedicUpdate = attachVedicPanel({ before: '#wb-horary-card' }); vedicUpdate(chart); } catch { /* non-fatal */ }

  // chart wheel (reuse the shared renderer)
  try {
    const bodies = {}; for (const p of PLANETS7) bodies[p] = chart.planets[p];
    renderChart($('wb-wheel'), chart, allAspects(bodies), { size: 520 });
    wheelSvg = $('wb-wheel').querySelector('svg');
  } catch { /* non-fatal */ }

  safe(() => renderSummary(reading));
  safe(() => renderMoment(reading));
  safe(() => renderDignities(reading));
  safe(() => renderAspects(reading));
  safe(() => renderLots(reading));
  safe(() => renderCautions(reading));
  safe(() => renderHorary(reading));
  safe(() => renderElection(reading));
  safe(() => renderTalisman(reading));
  safe(() => renderNatal(reading));
  safe(() => renderReference());
  safe(() => renderJSON(reading));
  safe(() => renderCitations(reading));

  writeStateToURL(currentState());
  $('wb-status').textContent = '';
  try { autoSave(reading); } catch { /* non-fatal: saving never blocks the reading */ }
  for (const cb of readingSubs) { try { cb(reading); } catch { /* ignore */ } }
}

// --- save / publish ---------------------------------------------------------
const stateKey = s => Object.values(s).join('|');
function autoSave(reading) {                       // silent: no status, no network
  const s = currentState();
  const asc = reading && reading.moment && reading.moment.angles ? reading.moment.angles.asc.label : '';
  const label = `${s.date || ''} ${s.time || ''}${asc ? ' · ' + asc + ' asc' : ''} · ${s.lat},${s.lon}`.trim();
  saveReadingEntry({ key: stateKey(s), ts: new Date().toISOString(), label, state: s });
  renderSaved();
}
function renderSaved() {
  const box = $('wb-saved'); if (!box) return;
  const list = listSavedReadings();
  if (!list.length) { box.innerHTML = '<span class="muted">No saved readings yet — every reading you compute is auto-saved here, on this device only.</span>'; return; }
  box.innerHTML = '<b>Saved on this device:</b><ul class="clean">' + list.map(e =>
    `<li><a href="#" class="gloss-link" data-restore="${esc(e.key)}">${esc(e.label || e.ts)}</a> <span class="muted small">${esc((e.ts || '').slice(0, 16).replace('T', ' '))}</span> · <a href="#" class="small muted" data-remove="${esc(e.key)}">remove</a></li>`).join('') + '</ul>';
  box.querySelectorAll('a[data-restore]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); restoreSaved(a.getAttribute('data-restore')); }));
  box.querySelectorAll('a[data-remove]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); removeSavedReading(a.getAttribute('data-remove')); renderSaved(); }));
}
function restoreSaved(key) {
  const e = listSavedReadings().find(x => x.key === key); if (!e || !e.state) return;
  for (const [k, v] of Object.entries(e.state)) { const id = 'wb-' + (k === 'q' ? 'horary-house' : k); if ($(id) != null && v != null) $(id).value = v; }
  if (e.state.bdate) $('wb-birth-details').open = true;
  run();
}

const safe = fn => { try { fn(); } catch (e) { /* a failing panel never breaks the page */ } };

// --- renderers --------------------------------------------------------------
function renderSummary(r) {
  const m = r.moment;
  const ph = m.planetaryHour;
  $('wb-summary').innerHTML =
    `<strong>${esc(m.angles.asc.label)}</strong> ascending · MC <strong>${esc(m.angles.mc.label)}</strong> · ` +
    `${m.isDay ? 'a <b>day</b> chart' : 'a <b>night</b> chart'}` +
    (ph ? ` · planetary hour of <b>${esc(ph.ruler)}</b> ${G(ph.ruler)} (a ${esc(ph.dayRuler)}-day)` : '') +
    ` · chart health ${vbadge(r.cautions.verdict)}`;
  $('wb-moment-cite').textContent = '— positions from astronomy-engine (~1′); Regiomontanus houses';
}

function renderMoment(r) {
  let rows = '';
  for (const name of Object.keys(r.moment.planets)) {
    const p = r.moment.planets[name];
    const dig = r.dignities.perPlanet[name];
    rows += `<tr><td>${G(name)} ${esc(name.replace('Node', ' Node'))}</td>
      <td class="l">${esc(p.label)}${p.retrograde ? ' ℞' : ''}</td><td>${p.house}</td>
      <td class="r small">${p.speed != null ? p.speed.toFixed(2) : ''}</td>
      <td class="${dig ? (dig.sumTotal >= 0 ? 'pos' : 'neg') : 'muted'}">${dig ? sgn(dig.sumTotal) : '·'}</td></tr>`;
  }
  $('wb-moment').innerHTML = `<table class="data"><thead><tr><th>Body</th><th>Position</th><th>Ho.</th><th>Speed</th><th title="essential + accidental">Dignity</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderDignities(r) {
  $('wb-dignities-links').innerHTML = regLinks('essential-dignity');
  let rows = '';
  for (const name of PLANETS7) {
    const d = r.dignities.perPlanet[name];
    const kinds = d.essential.rows.map(x => `<span class="${x.score >= 0 ? 'pos' : 'neg'}">${esc(x.kind)}</span>`).join(', ');
    rows += `<tr><td>${G(name)} ${name}</td><td class="l small">${kinds}</td>
      <td class="${d.essential.total >= 0 ? 'pos' : 'neg'}">${sgn(d.essential.total)}</td>
      <td class="${d.accidental.total >= 0 ? 'pos' : 'neg'}">${sgn(d.accidental.total)}</td>
      <td class="${d.sumTotal >= 0 ? 'pos' : 'neg'}"><b>${sgn(d.sumTotal)}</b></td></tr>`;
  }
  const a = r.dignities.almutens, log = r.dignities.lordOfGeniture;
  $('wb-dignities').innerHTML =
    `<table class="data"><thead><tr><th>Planet</th><th>Essential dignities</th><th>Ess.</th><th>Acc.</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
     <p class="small">Almuten of the Ascendant: <b>${esc(a.ascendant.planet)}</b> (score ${a.ascendant.score}) · of the MC: <b>${esc(a.midheaven.planet)}</b> (${a.midheaven.score}).
       Lord of the Geniture (greatest total dignity): <b>${esc(log.planet)}</b> (${sgn(log.score)}).</p>`;
}

function renderAspects(r) {
  $('wb-aspects-links').innerHTML = regLinks('aspects');
  const list = r.aspects.list;
  const asp = list.length
    ? '<ul class="clean">' + list.map(a => `<li>${G(a.from)} ${a.from} <b>${a.glyph} ${a.aspect}</b> ${G(a.to)} ${a.to} — <span class="${a.applying ? 'pos' : 'muted'}">${a.applying ? 'applying' : 'separating'}</span>, orb ${a.orb.toFixed(1)}°${a.partile ? ' <b>(partile)</b>' : ''}</li>`).join('') + '</ul>'
    : '<p class="muted">No aspects within orb.</p>';
  const rec = r.aspects.receptions.length
    ? '<p class="small"><b>Reception:</b> ' + r.aspects.receptions.map(x => `${x.a}↔${x.b} (${x.a} in ${x.b}’s ${x.byA.join('/')}; ${x.b} in ${x.a}’s ${x.byB.join('/')})`).join('; ') + '</p>'
    : '<p class="small muted">No mutual reception among the seven.</p>';
  $('wb-aspects').innerHTML = asp + rec;
}

function renderLots(r) {
  $('wb-lots-links').innerHTML = regLinks('part-of-fortune');
  const L = r.lots;
  let anti = '';
  for (const name of PLANETS7) {
    const p = r.moment.planets[name];
    anti += `<tr><td>${G(name)} ${name}</td><td class="l">${esc(p.antiscion.label)}</td><td class="l muted">${esc(p.contraAntiscion.label)}</td></tr>`;
  }
  $('wb-lots').innerHTML =
    `<p><b>Part of Fortune</b> ⊕ ${esc(L.fortune.label)} <span class="small muted">(${esc(L.fortune.formula)})</span> ·
        <b>Part of Spirit</b> ${esc(L.spirit.label)} <span class="small muted">(${esc(L.spirit.formula)})</span></p>
     <table class="data"><thead><tr><th>Planet</th><th>Antiscion</th><th>Contra-antiscion</th></tr></thead><tbody>${anti}</tbody></table>`;
}

function renderCautions(r) {
  $('wb-cautions-links').innerHTML = regLinks('chart-health');
  const c = r.cautions;
  const adv = c.global.map(a => {
    const cls = a.severity === 'good' ? 'pos' : a.severity === 'caution' ? 'neg' : 'muted';
    const icon = a.severity === 'good' ? '✓' : a.severity === 'caution' ? '⚠' : '·';
    return `<li><span class="${cls}">${icon}</span> ${esc(a.text)}</li>`;
  }).join('');
  $('wb-cautions').innerHTML =
    `<p style="font-size:1.05rem">Verdict: ${vbadge(c.verdict)} — ${esc(c.label)}</p>
     ${VERDICT_LEGEND}
     <ul class="clean">${adv}</ul>
     <p class="small muted">Impediments — ${c.counts.caution} caution, ${c.counts.bad} grave (of which ${c.counts.keyCaution + c.counts.keyBad} touch a key significator).</p>`;
}

function renderHorary(r) {
  $('wb-horary-links').innerHTML = regLinks('perfection');
  // GENERAL view (no specific question house chosen): the querent's significator
  // and the Moon's condition & next aspect — the horary "state of play" that needs
  // no quesited house. Pick a house above for the quesited significator & perfection.
  if (!r.horary) {
    const lordAsc = r.cautions.lordAsc;
    const qp = lordAsc ? r.moment.planets[lordAsc] : null;
    const moon = r.moment.planets.Moon;
    let mn = null;
    for (const a of r.aspects.list) {
      if ((a.from === 'Moon' || a.to === 'Moon') && a.applying && (!mn || a.orb < mn.orb)) mn = { other: a.from === 'Moon' ? a.to : a.from, aspect: a.aspect, glyph: a.glyph, orb: a.orb };
    }
    const sel = r.election.selected, voc = sel && sel.moon ? sel.moon.voidOfCourse : false;
    $('wb-horary').innerHTML =
      `<p class="small muted">The <b>general</b> horary state — the querent's significator and the Moon. Choose the house your question is about (above) for the quesited significator and the modes of perfection.</p>
       <p><b>Querent</b> — the Lord of the Ascendant is ${qp ? `${G(lordAsc)} <b>${esc(lordAsc)}</b> at ${esc(qp.label)} in the ${qp.house}th house` : esc(lordAsc || 'n/a')}, with the Moon as co-significator.</p>
       <p><b>The Moon</b> is in ${esc(moon.sign)}, the ${moon.house}th house${voc ? ', and is <b>void of course</b> — "nothing will come of the matter"' : (mn ? `; she next applies to a <b>${esc(mn.aspect.toLowerCase())}</b> ${mn.glyph || ''} of <b>${G(mn.other)} ${esc(mn.other)}</b> (orb ${mn.orb.toFixed(1)}°)` : '')}.</p>`;
    return;
  }
  const h = r.horary;
  const modeLines = [];
  const M = h.perfection.modes || {};
  if (h.sharedSignificator) modeLines.push('Querent &amp; quesited share one significator — a strong, often affirmative testimony.');
  if (M.direct) modeLines.push(`<b>Direct ${esc(M.direct.aspect.toLowerCase())}</b> ${M.direct.glyph} — <span class="${M.direct.applying ? 'pos' : 'muted'}">${M.direct.applying ? 'applying, the matter perfects' : 'separating, past or denied'}</span> (orb ${M.direct.orb.toFixed(1)}°).`);
  if (M.translation) modeLines.push(`<b>Translation of light</b>: ${esc(M.translation.carrier)} carries light from ${esc(M.translation.from)} to ${esc(M.translation.to)}.`);
  if (M.collection) modeLines.push(`<b>Collection of light</b>: ${esc(M.collection.collector)} collects both significators${M.collection.received ? ', receiving them' : ''}.`);
  if (M.reception) modeLines.push(`<b>Reception</b>: ${M.reception.mutual ? 'mutual' : 'one-way'} reception between the significators.`);
  if (M.prohibition) modeLines.push(`<span class="neg"><b>Prohibition</b></span>: ${esc(M.prohibition.planet)} perfects with ${esc(M.prohibition.target)} first.`);
  if (M.refranation) modeLines.push(`<span class="neg"><b>Refranation</b></span>: ${esc(M.refranation.planet)} turns retrograde before perfecting.`);
  if (h.timing) modeLines.push(`<b>Timing</b>: ${esc(h.timing.text)} <span class="muted">(Lilly proportions a mean — an estimate).</span>`);
  if (!modeLines.length) modeLines.push('No direct aspect, translation or collection within orb — read the Moon.');
  const mn = h.moonCoSignificator.nextAspect;
  $('wb-horary').innerHTML =
    `<p class="small muted">Shown for house ${h.quesitedHouse} (${esc((h.quesitedSignifies || '').split(';')[0])}). Choose the house your question is about, or “— none —” to hide.</p>
     <p><b>Querent</b> — ${esc(h.querent.lordAsc)} ${G(h.querent.lordAsc)}${h.querent.label ? ` at ${esc(h.querent.label)} in the ${h.querent.house}th (ess. ${sgn(h.querent.essentialTotal)})` : ''}, with the Moon as co-significator.</p>
     <p><b>Quesited</b> — the ${h.quesitedHouse}th, ruled by ${esc(h.quesited.lordQ)} ${G(h.quesited.lordQ)}${h.quesited.label ? ` at ${esc(h.quesited.label)} in the ${h.quesited.house}th (ess. ${sgn(h.quesited.essentialTotal)})` : ''}.</p>
     <p>${h.moonCoSignificator.voidOfCourse ? 'The Moon is <b>void of course</b> — she makes no further applying aspect before leaving her sign.' : (mn ? `The Moon next applies to a <b>${esc(mn.aspect.toLowerCase())}</b> ${mn.glyph} of <b>${esc(mn.to)}</b> (orb ${mn.orb.toFixed(1)}°).` : '')}</p>
     <ul class="clean">${modeLines.map(l => `<li>${l}</li>`).join('')}</ul>`;
}

function renderElection(r) {
  $('wb-election-links').innerHTML = regLinks('election');
  const sel = r.election.selected;
  let html = '';
  if (sel) {
    const reasons = sel.reasons.map(x => {
      const cls = x.severity === 'bad' ? 'neg' : x.severity === 'caution' ? 'neg' : x.severity === 'good' ? 'pos' : 'muted';
      return `<li><span class="${cls}">${esc(x.severity)}</span> (${sgn(x.delta)}) ${esc(x.text)} <span class="small muted">— ${esc(x.cite)}</span></li>`;
    }).join('');
    html += `<p style="font-size:1.05rem">For <b>${esc(sel.operation.label)}</b> (${esc(sel.operation.ruler)}): ${vbadge(sel.verdict)} — ${esc(sel.label)} <span class="muted">(score ${sel.score})</span></p>`;
    if (sel.gating && sel.gating.length) html += `<p class="neg small">Hard requirement unmet: ${esc(sel.gating.join('; '))} — the tradition would not call this fit, however high the score.</p>`;
    html += `<ul class="clean small">${reasons}</ul>`;
  }
  const rank = r.election.rankedNow.map(o => `<tr><td>${esc(o.label)}</td><td>${G(o.ruler)} ${o.ruler}</td><td>${vbadge(o.verdict)}</td><td class="r">${o.score}</td></tr>`).join('');
  html += `<p class="small"><b>All aims ranked for this moment:</b></p>
     <table class="data"><thead><tr><th>Aim</th><th>Ruler</th><th>Verdict</th><th>Score</th></tr></thead><tbody>${rank}</tbody></table>`;
  // Picatrix correspondences of the moment (mansion / decan faces / Behenian stars)
  if (lastChart) {
    try {
      const moon = lastChart.planets.Moon, sun = lastChart.planets.Sun;
      const mm = mansionOf(moon.lon), mf = faceOf(moon.lon), sf = faceOf(sun.lon);
      const stars = starsInAspect(lastChart, 6);
      const starsTxt = stars.length ? stars.map(s => `${G(s.planet)} ${esc(s.planet)} ∠ ${esc(s.star)} (${s.sep.toFixed(1)}°)`).join('; ') : 'none closely conjunct a planet now';
      const mi = mansionImage(mm.num);
      html += `<p class="small" style="margin-top:.6rem"><b>Picatrix correspondences of the moment:</b> Moon in <b>Mansion ${mm.num} — ${esc(mm.name)}</b> (“${esc(mm.use)}”); Moon’s face ${esc(mf.ruler)} — ${esc(mf.image)}; Sun’s face ${esc(sf.ruler)}. Behenian contacts: ${starsTxt}.</p>` +
        (mi ? `<p class="small muted">Mansion ${mm.num} talismanic image (historical): ${esc(mi.image)} <i>— ${esc(mi.purpose)}</i> <span class="small">[${esc(mi.citation)}]</span></p>` : '');
    } catch { /* non-fatal */ }
  }
  $('wb-election').innerHTML = html;
}

function renderTalisman(r) {
  $('wb-talisman-links').innerHTML = regLinks('talisman');
  const t = r.talisman;
  if (!t) { $('wb-talisman').innerHTML = '<p class="muted">No recipe.</p>'; return; }
  const sp = t.materials.spirits;
  const steps = t.steps.map(s => `<li>${esc(s.text)} <span class="small muted">— ${esc(s.cite)}</span></li>`).join('');
  const pimg = planetImage(t.planet);
  const imgHtml = pimg ? `<p class="small"><b>Planetary talismanic image (historical):</b> ${esc(pimg.image)} <i>— ${esc(pimg.purpose)}</i> <span class="muted small">[${esc(pimg.citation)}]</span></p>` : '';
  const pr = prayerFor(t.planet);
  const prayerHtml = pr ? `<p class="small"><b>Picatrix Book III — the prayer &amp; spirit of ${esc(t.planet)}:</b>
       addressed as <i>${esc(pr.address.split('.')[0].toLowerCase())}</i>; prayer-angel ${esc(pr.prayerAngel.latin || '—')}, directional spirit ${esc(pr.spirit.master)}.
       <br><span class="muted">“${esc(pr.prayerExcerpt.slice(0, 150))}…”</span>
       <a href="picatrix/prayers.html">full prayer &amp; spirits ↗</a>${pr.flag ? ` <span class="neg">⚠ ${esc(pr.flag.split('—')[0])}</span>` : ''}
       <span class="muted small">— historical text, described not prescribed.</span></p>` : '';
  $('wb-talisman').innerHTML =
    `<p>Aim: <b>${esc(t.aim)}</b> · ruling planet <b>${esc(t.planet)}</b> ${G(t.planet)} · this moment: ${vbadge(t.verdict)}</p>
     <p class="small"><b>Materials (historical):</b> suffumigation ${esc(t.materials.suffumigation)}; colour ${esc(t.materials.colour)};
       metal ${esc(t.materials.metal)}; stone ${esc(t.materials.stone)}. <b>Powers (kept distinct):</b>
       Picatrix prayer-angel ${esc(sp.picatrixPrayerAngel)}; Agrippa angel ${esc(sp.agrippa.angel)}, intelligence ${esc(sp.agrippa.intelligence)}, spirit ${esc(sp.agrippa.spirit)}.</p>
     ${imgHtml}
     ${prayerHtml}
     <ol class="small">${steps}</ol>
     <p class="small muted">${esc(t.disclaimer)}</p>`;
}

function renderNatal(r) {
  const card = $('wb-natal-card');
  $('wb-natal-links').innerHTML = regLinks('life-trajectory');
  if (!r.natal) {
    $('wb-natal').innerHTML = '<p class="muted">Add a birth date, time and place in the form above (open “Optional — add a birth moment”) to compute the whole-life trajectory: natal signatures, the profection timeline &amp; Lord of the Year, primary directions, the solar return, and a personalised Picatrix overlay.</p>';
    return;
  }
  const tj = r.natal.trajectory;
  const n = tj.natal, cy = tj.currentYear;
  const cur = tj.timeline.find(t => t.current);
  $('wb-natal').innerHTML =
    `<p><b>Natal signatures</b> — ${n.isDay ? 'day' : 'night'} chart; almuten of the Ascendant <b>${esc(n.almutenAsc)}</b>;
       Lord of the Geniture <b>${esc(n.lordOfGeniture.planet)}</b> (${sgn(n.lordOfGeniture.score)}); temperament ${esc(n.temperament.summary)} (${esc(n.temperament.dominant)}).</p>
     <p><b>This year</b> (age ${cy.age}) — profected to ${esc(cy.profectedSign)}, the ${cy.activatedHouse}th house activated;
       <b>Lord of the Year ${esc(cy.lordOfYear)}</b>${cur ? ` (natal dignity ${sgn((cur.lordEssential || 0) + (cur.lordAccidental || 0))})` : ''}.</p>
     <p><b>Ruling planets</b> (the works the tradition counts as this nativity’s): ${esc(tj.picatrix.rulingPlanets.join(', '))}.
       ${tj.picatrix.recommendedTalisman ? `Recommended talisman: <b>${esc(tj.picatrix.recommendedTalisman.aim)}</b> ${vbadge(tj.picatrix.recommendedTalisman.verdict)}.` : ''}</p>
     <p class="small muted">The full year-by-year timeline, directions and personal Picatrix layer are on the
       <a href="trajectory.html">Life Trajectory</a> tool. ${tj.notes ? '(' + esc(tj.notes) + ')' : ''}</p>`;
}

function renderReference() {
  const byBook = {};
  for (const e of REGISTRY) (byBook[e.book] = byBook[e.book] || []).push(e);
  let html = '';
  for (const [book, entries] of Object.entries(byBook)) {
    html += `<h3 class="small" style="margin:.8rem 0 .3rem;text-transform:uppercase;letter-spacing:.04em">${esc(book)}</h3><ul class="clean small">`;
    for (const e of entries) {
      const links = [];
      if (e.howItWorks) links.push(`<a href="${esc(rel(e.howItWorks))}">how it's calculated</a>`);
      for (const pg of (e.pages || [])) links.push(`<a href="${esc(rel(pg))}">${esc(rel(pg))}</a>`);
      html += `<li><b>${esc(e.title)}</b> — ${esc(e.computes)}
        <br><span class="muted">${esc(e.module)} · <code>${esc(e.exportName)}()</code> · ${esc(e.citation)}</span>
        <br>${links.join(' · ')}${e.glossaryTerms.length ? ' · <a href="glossary.html">glossary: ' + e.glossaryTerms.map(esc).join(', ') + '</a>' : ''}</li>`;
    }
    html += '</ul>';
  }
  $('wb-reference').innerHTML = html;
}

function renderJSON(r) { $('wb-json-view').textContent = JSON.stringify(r, null, 2); }
function renderCitations(r) { $('wb-citations').innerHTML = '<b>Sources used in this reading:</b> ' + r.citations.map(esc).join(' · '); }

function renderAssistantPlaceholder() {
  $('wb-assistant').innerHTML =
    `<p class="small muted">An AI assistant attaches here to explain this reading in plain language, grounded in the
      computed, cited facts above — and to plan historical "workings" using the engine tools. It uses <b>Claude</b>
      (the Anthropic API) with <b>your own key</b>. See <a href="../docs/LOCAL-LLM.html">how it works</a>.</p>`;
}
