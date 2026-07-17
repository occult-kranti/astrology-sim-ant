// ============================================================================
//  timelords.js — drives pages/timelords.html: the three classical time-lord
//  techniques, computed side by side on the site's engine.
//   1. SECONDARY PROGRESSIONS — day-for-a-year (Valens IX.3), planets from the
//      real ephemeris at birth + age-in-days, angles by the Naibod arc only.
//   2. FIRDARIA — Abu Ma'shar's 75-year Persian period cycle, with the
//      disputed night-node placement exposed as an honest toggle.
//   3. ZODIACAL RELEASING — Valens IV.4–IV.10, from the Lots of Spirit and
//      Fortune, 360-day years, loosing of the bond marked.
//
//  HONEST FRAMING: historical timing doctrines — described, never prescribed.
//  All computation lives in the pure core modules; this file owns the DOM.
// ============================================================================
import { castChart, formatLon, signOf, SIGN_GLYPHS, PLANET_GLYPHS } from '../core/astro.js';
import { lotsByKey } from '../core/lots.js';
import { progressedPositions, ageFromDates, NAIBOD_DEG_PER_YEAR } from '../core/progressions.js';
import { firdaria, currentFirdaria } from '../core/firdaria.js';
import { zodiacalReleasing, currentReleasing, LOOSING_L1_SIGNS } from '../core/releasing.js';
import { wireCitySelect, toUTC, autolinkResultPanels, nowLocalFields } from './shared.js';
import { attachPersonPicker } from './person.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const NICE = { NorthNode: 'North Node', SouthNode: 'South Node' };
const nice = p => NICE[p] || p;
const fmtD = d => d.toISOString().slice(0, 10);
const HL = 'background:var(--parchment-2);outline:1px solid var(--gold-2)';

// the last computed report, exposed for the AI panel.
let lastReport = null;
let lastFig = null;   // the raw inputs the period-strip figures re-render from
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* ignore */ } } };
export function currentTimelordsReport() { return lastReport; }

export function initTimelords() {
  wireCitySelect($('tl-city'), $('tl-lat'), $('tl-lon'), $('tl-offset'));
  attachPersonPicker($('tl-picker-anchor'), {
    bdate: $('tl-date'), btime: $('tl-time'), boffset: $('tl-offset'),
    blat: $('tl-lat'), blon: $('tl-lon'),
  });
  $('tl-asof').value = nowLocalFields().date;                 // "as of" defaults to today
  $('tl-form').addEventListener('submit', e => { e.preventDefault(); doCompute(); });
  document.querySelectorAll('input[name="tl-nodes"]').forEach(r =>
    r.addEventListener('change', () => { if (lastReport) compute(); }));

  // the AI panel: the shared divination assistant over the computed periods
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'timelords',
      getReading: () => lastReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Compute the time-lord periods above first.' },
    });
  }
  mountTlEnh();
}

const ENH = {}; let tlbar = null;
const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
async function mountTlEnh() {
  const L = async p => { try { return await import(p); } catch { return null; } };
  ENH.ab = await L('./action-bar.js');
  ENH.ts = await L('../core/viz/timeline-svg.js'); ENH.fig = await L('./viz/figure.js'); ENH.brush = await L('./viz/brush.js');
  // If a compute already ran before the viz kit finished importing, draw the strips now.
  try { if (lastReport && lastFig) mountTlStrips(lastFig.fird, lastFig.curF, lastFig.rel, lastFig.birth, lastFig.asOf); } catch { /* non-fatal */ }
  if (ENH.ab && ENH.ab.mountActionBar && $('tl-actionbar')) {
    try { tlbar = ENH.ab.mountActionBar($('tl-actionbar'), { variant: 'tool', exports: [], askAI: $('dv-assistant') ? () => { const a = $('dv-assistant'); a.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto' }); const t = a.querySelector('textarea, input'); t && t.focus(); } : null, summary: () => ({ verdict: '', text: 'Time-lord periods computed.' }) }); } catch { tlbar = null; }
  }
}
function doCompute() {
  const cf = ENH.ab && ENH.ab.computeFlow;
  if (cf) { try { cf($('tl-form').querySelector('button[type="submit"]'), null, () => compute(), { banner: $('tl-summary'), firstPanel: $('tl-summary') }); return; } catch { /* */ } }
  compute();
}

function nodeChoice() {
  const r = document.querySelector('input[name="tl-nodes"]:checked');
  return r && r.value === 'afterMars' ? 'afterMars' : 'end';
}

function compute() {
  const lat = parseFloat($('tl-lat').value), lon = parseFloat($('tl-lon').value);
  const dateStr = $('tl-date').value, timeStr = $('tl-time').value;
  const status = $('tl-status');
  if (isNaN(lat) || isNaN(lon) || !dateStr || !timeStr) {
    status.textContent = 'Fill the birth date, time and place first.'; return;
  }
  status.textContent = '';
  const system = $('tl-system').value || 'regiomontanus';
  const birth = toUTC(dateStr, timeStr, parseFloat($('tl-offset').value) || 0);
  const asofStr = $('tl-asof').value || nowLocalFields().date;
  const [ay, am, ad] = asofStr.split('-').map(Number);
  const asOf = new Date(Date.UTC(ay, am - 1, ad, 12, 0));    // "as of" read at 12:00 UT

  let chart;
  try { chart = castChart(birth, lat, lon, system); }
  catch (e) { status.textContent = `Could not compute (${e.message}).`; return; }

  const ageYears = ageFromDates(birth, asOf);
  if (ageYears < 0) { status.textContent = 'The "as of" date is before the birth date.'; return; }

  const prog = progressedPositions(birth, lat, lon, ageYears, { system });
  const fird = firdaria(birth, chart.isDay, { nightNodes: nodeChoice() });
  // firdaria boundaries use Julian years (365.25 d, the module's documented
  // convention) — the "current" lookup must use the same clock, not tropical
  const curF = currentFirdaria(fird.majors, (asOf.getTime() - birth.getTime()) / (365.25 * 86400000));
  // Lots SECT-AWARE for the releasing: Valens's Hellenistic Lots reverse by
  // night (Lilly's non-reversing convention is the site default elsewhere).
  const lots = lotsByKey(chart, { sectAware: true });
  const spiritSign = signOf(lots.spirit.lon), fortuneSign = signOf(lots.fortune.lon);
  const zrS = zodiacalReleasing(spiritSign.index, birth, { maxYears: 100 });
  const zrF = zodiacalReleasing(fortuneSign.index, birth, { maxYears: 100 });
  const curS = currentReleasing(zrS, birth, asOf);
  const curFo = currentReleasing(zrF, birth, asOf);

  $('tl-summary').innerHTML = `<b>${chart.isDay ? 'Day' : 'Night'} birth</b> — Asc ${esc(formatLon(chart.asc))},
    MC ${esc(formatLon(chart.mc))}; age <b>${ageYears.toFixed(2)}</b> tropical years as of ${esc(asofStr)}.`;

  renderProgressions(chart, prog, ageYears);
  renderFirdaria(chart, fird, curF, ageYears);
  renderReleasing(chart, lots, { zrS, zrF, curS, curFo }, birth, asOf);
  try { autolinkResultPanels(['tl-prog', 'tl-fird', 'tl-zr']); } catch { /* non-fatal */ }
  try { tlbar && tlbar.show && tlbar.show(); } catch { /* */ }

  // The interactive period-strip figures (firdāriā + zodiacal releasing) — they
  // AUGMENT the tables above, never replace them. [ui3-spec §8 timelords row]
  lastFig = { fird, curF, rel: { zrS, zrF, curS, curFo }, birth, asOf };
  try { mountTlStrips(fird, curF, { zrS, zrF, curS, curFo }, birth, asOf); } catch { /* non-fatal */ }

  lastReport = {
    kind: 'timelords',
    meta: {
      birthUTC: birth.toISOString(), lat, lon, system, asOf: asOf.toISOString(),
      isDay: chart.isDay, ageTropicalYears: ageYears,
      asc: formatLon(chart.asc), mc: formatLon(chart.mc),
    },
    progressions: prog,
    firdaria: { ...fird, current: curF },
    releasing: {
      lots: { spirit: { lon: lots.spirit.lon, label: lots.spirit.label }, fortune: { lon: lots.fortune.lon, label: lots.fortune.label } },
      fromSpirit: { ...zrS, current: curS }, fromFortune: { ...zrF, current: curFo },
    },
  };
  notifyReport();
}

// --- 1 · secondary progressions ----------------------------------------------
function renderProgressions(chart, prog, ageYears) {
  const signed = d => { const x = ((d + 540) % 360) - 180; return `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(2)}°`; };
  const rows = Object.keys(prog.planets).map(p => {
    const n = chart.planets[p], q = prog.planets[p];
    return `<tr><td class="l">${G(p)} ${esc(p)}</td>
      <td class="l">${esc(formatLon(n.lon))}</td>
      <td class="l">${esc(formatLon(q.lon))}${q.retrograde ? ' ℞' : ''}</td>
      <td class="l">${signed(q.lon - n.lon)}</td></tr>`;
  }).join('');
  $('tl-prog').innerHTML = `
    <p class="small">Age <b>${ageYears.toFixed(4)}</b> tropical years → progressed instant =
      birth + ${ageYears.toFixed(4)} days = <b>${esc(prog.progressedDate.toISOString().replace('T', ' ').slice(0, 16))} UT</b>
      (one ephemeris day after birth ≡ one year of life — Valens, Anthology IX.3).</p>
    <table class="data"><thead><tr><th class="l">Planet</th><th class="l">Natal</th><th class="l">Progressed</th><th class="l">Δ</th></tr></thead>
      <tbody>${rows}
      <tr style="${HL}"><td class="l">MC</td><td class="l">${esc(formatLon(chart.mc))}</td>
        <td class="l">${esc(formatLon(prog.progressedMC))}</td><td class="l">+${prog.naibodArcDeg.toFixed(2)}°</td></tr>
      <tr style="${HL}"><td class="l">Ascendant</td><td class="l">${esc(formatLon(chart.asc))}</td>
        <td class="l">${esc(formatLon(prog.progressedAsc))}</td><td class="l">re-derived</td></tr></tbody></table>
    <p class="small">Naibod arc = ${NAIBOD_DEG_PER_YEAR.toFixed(8)}°/yr × ${ageYears.toFixed(4)} yr =
      <b>${prog.naibodArcDeg.toFixed(4)}°</b>; progressed MC = natal MC + arc, progressed Ascendant re-derived from
      that MC through the birth latitude &amp; natal obliquity. Angles use the Naibod arc ONLY — solar-arc MC, solar
      arc in RA and mean quotidian are recognized alternatives, out of scope here.</p>
    <p class="small muted">${esc(prog.citation)}</p>`;
}

// --- 2 · firdaria ---------------------------------------------------------------
function renderFirdaria(chart, fird, curF, ageYears) {
  const inCycle = curF.ageInCycle;
  const rows = fird.majors.map(m => {
    const isCur = curF.major === m;
    const subs = m.subs === null
      ? '<span class="muted small">— node period: no sub-periods —</span>'
      : m.subs.map(s => {
        const isCurSub = isCur && curF.sub === s;
        return `<span class="pill" style="${isCurSub ? HL : ''}" title="ages ${s.startAge.toFixed(2)}–${s.endAge.toFixed(2)}">
          ${G(m.lord)}/${G(s.lord)} ${esc(nice(s.lord))} ${s.startAge.toFixed(1)}–${s.endAge.toFixed(1)}${isCurSub ? ' ◀ now' : ''}</span>`;
      }).join(' ');
    return `<tr${isCur ? ` style="${HL}"` : ''}>
      <td class="l"><b>${G(m.lord)} ${esc(nice(m.lord))}</b>${isCur ? ' ◀ now' : ''}</td>
      <td class="l">${m.startAge}–${m.endAge}</td>
      <td class="l small">${esc(fmtD(m.startDate))} → ${esc(fmtD(m.endDate))}</td>
      <td class="l">${subs}</td></tr>`;
  }).join('');
  $('tl-fird').innerHTML = `
    <p class="small"><b>${chart.isDay ? 'Day' : 'Night'} birth</b> — the sequence starts from the
      ${chart.isDay ? 'Sun' : 'Moon'}.${chart.isDay
        ? ' (The night-node toggle above makes no difference for day births: Mars is the last planet before the nodes in both orders.)'
        : ` Night-node placement in force: <b>${fird.nightNodes === 'afterMars' ? 'Bonatti variant — nodes after Mars' : 'Abu Maʿshar (default) — nodes at the end'}</b>.`}
      ${curF.cycle > 0 ? `<b>Cycle ${curF.cycle + 1}</b> — the 75-year cycle repeats; ages shown are within the cycle (current age in cycle ${inCycle.toFixed(1)}).` : ''}
      Running now: <b>${curF.major ? `${nice(curF.major.lord)} major` : '—'}${curF.sub ? ` / ${nice(curF.sub.lord)} sub` : ''}</b>
      at age ${ageYears.toFixed(2)}.</p>
    <table class="data"><thead><tr><th class="l">Major lord</th><th class="l">Ages</th><th class="l">Dates</th><th class="l">Sub-periods (7 equal; nodes skipped)</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <div class="callout science" style="margin-top:.6rem"><span class="label">The disputed value, shown honestly</span>
      ${esc(fird.notes.nodePlacement)}</div>
    <p class="small muted">${esc(fird.notes.subPeriods)} ${esc(fird.notes.yearLength)}</p>
    <p class="small muted">${esc(fird.citation)}</p>`;
}

// --- 3 · zodiacal releasing ------------------------------------------------------
function renderReleasing(chart, lots, r, birth, asOf) {
  const distAge = r.curS.distributionAge; // same clock for both lots
  const block = (title, topic, lot, zr, cur) => {
    const rows = zr.l1.map(p => {
      const isCur = cur.l1 === p;
      const l2 = p.l2.map(q => {
        const isCurL2 = isCur && cur.l2 === q;
        const label = `${SIGN_GLYPHS[q.signIndex]} ${q.months}m${q.truncated ? '·tr' : ''}`;
        return `<span class="pill" style="${isCurL2 ? HL : ''}" title="${esc(fmtD(q.startDate))} → ${esc(fmtD(q.endDate))}${q.loosed ? ' — loosing of the bond' : ''}">
          ${q.loosed ? '<b>→ opposite sign</b> ' : ''}${esc(label)}${isCurL2 ? ' ◀ now' : ''}</span>`;
      }).join(' ');
      return `<tr${isCur ? ` style="${HL}"` : ''}>
        <td class="l"><b>${SIGN_GLYPHS[p.signIndex]} ${esc(p.sign)}</b>${isCur ? ' ◀ now' : ''}${LOOSING_L1_SIGNS.includes(p.signIndex) ? ' <span class="muted small" title="a full 12-sign L2 cycle (211 months) fits inside this L1, so the bond looses">†</span>' : ''}</td>
        <td class="l">${p.years}</td>
        <td class="l small">${(p.startDay / 360).toFixed(0)}–${(p.endDay / 360).toFixed(0)}</td>
        <td class="l small">${esc(fmtD(p.startDate))} → ${esc(fmtD(p.endDate))}</td>
        <td class="l">${l2}</td></tr>`;
    }).join('');
    return `<h3>${title} <span class="small muted">— ${topic}</span></h3>
      <p class="small">${esc(lot.name)} at <b>${esc(lot.label)}</b> → L1 begins in <b>${esc(zr.lotSign)}</b>
        (the whole sign holding the Lot; the degree is irrelevant — Valens IV.4).
        Running now: <b>${cur.l1 ? cur.l1.sign : '—'} L1${cur.l2 ? ` / ${cur.l2.sign} L2` : ''}</b>.</p>
      <table class="data"><thead><tr><th class="l">L1 sign</th><th class="l">Years</th><th class="l">Dist. yrs</th><th class="l">Dates</th>
        <th class="l">L2 sub-periods (30-day months; <b>→ opposite sign</b> = loosing of the bond)</th></tr></thead>
        <tbody>${rows}</tbody></table>`;
  };
  $('tl-zr').innerHTML = `
    <p class="small">Lot of Spirit (Daimon) ☼ at <b>${esc(lots.spirit.label)}</b> · Lot of Fortune ⊕ at
      <b>${esc(lots.fortune.label)}</b> <span class="muted small">(sect-aware Hellenistic formulas, as Valens reckons
      them — by night the added points reverse; Lilly's non-reversing convention is the site default elsewhere)</span>.</p>
    <p class="small"><b>Distribution age:</b> ${Math.floor(r.curS.daysLived).toLocaleString()} real days lived =
      <b>${distAge.years} distribution-years + ${distAge.days.toFixed(0)} days</b> — the releasing clock runs on
      Valens's 360-day year (IV.9: "the universal year has 365¼ days, while the year with respect to the distribution
      has 360"), so period boundaries drift against calendar years.</p>
    ${block('Released from the Lot of Spirit', 'employment, rank, action (career)', lots.spirit, r.zrS, r.curS)}
    ${block('Released from the Lot of Fortune', 'the body & health', lots.fortune, r.zrF, r.curFo)}
    <div class="callout science" style="margin-top:.6rem"><span class="label">Doctrinal note, not implemented</span>
      ${esc(zrNote(r.zrS))}</div>
    <p class="small muted">${esc(r.zrS.citation)}</p>`;
}
const zrNote = zr => zr.notes.swapRule;

// ===========================================================================
//  Interactive period-strip figures (firdāriā + zodiacal releasing).
//  Rendered through B2's core/viz/timeline-svg → app/viz/figure → app/viz/brush
//  pipeline: periodStrip → mountFigure (adds .fig-scroll) → initBrush (drag-
//  brush + keyboard +/−/Home + crosshair opt-in) + a persistent zoombar. The
//  HOST re-renders on viz:zoom (semantic zoom) by mutating the SAME <svg> node
//  in place — this keeps the brush's listeners + domainOrig intact and updates
//  data-domain so keyboard "+" shrinks the visible span. [dataviz §3.3, §4.2–4.3]
// ===========================================================================
function ensureFigBox(id, beforeEl) {
  let box = document.getElementById(id);
  if (!box) {
    box = document.createElement('div');
    box.id = id;
    box.style.margin = '.2rem 0 .8rem';
    if (beforeEl && beforeEl.parentNode) beforeEl.parentNode.insertBefore(box, beforeEl);
  }
  return box;
}

// A persistent zoombar (mirrors app/viz/brush.js's on-zoom bar so the two never
// duplicate — brush's syncZoombar finds this one by class and only updates it).
function addZoombar(fig, svg) {
  if (fig.querySelector('.viz-zoombar')) return;
  const bar = document.createElement('div');
  bar.className = 'viz-zoombar';
  bar.innerHTML = `<button type="button" class="btn-secondary sm zb-out" aria-label="Zoom out"><span aria-hidden="true">−</span> out</button>`
    + `<button type="button" class="btn-secondary sm zb-reset" aria-label="Reset zoom"><span aria-hidden="true">⟲</span> reset</button>`
    + `<button type="button" class="btn-secondary sm zb-in" aria-label="Zoom in"><span aria-hidden="true">+</span> in</button>`
    + `<span class="zb-readout"></span>`;
  const body = fig.querySelector('.fig-body') || fig.firstChild;
  (body || fig).insertAdjacentElement('afterend', bar);
  const zoom = f => {
    const dom = (svg.getAttribute('data-domain') || '0,1').split(',').map(Number);
    const orig = (svg.dataset.domainOrig || svg.getAttribute('data-domain') || '0,1').split(',').map(Number);
    const span = dom[1] - dom[0], mid = (dom[0] + dom[1]) / 2;
    const ns = f === 0 ? (orig[1] - orig[0]) : span * f;
    let a = f === 0 ? orig[0] : mid - ns / 2, b = f === 0 ? orig[1] : mid + ns / 2;
    a = Math.max(orig[0], a); b = Math.min(orig[1], b);
    fig.dispatchEvent(new CustomEvent('viz:zoom', { detail: { t0: a, t1: b }, bubbles: true }));
  };
  bar.querySelector('.zb-in').addEventListener('click', () => zoom(0.5));
  bar.querySelector('.zb-out').addEventListener('click', () => zoom(2));
  bar.querySelector('.zb-reset').addEventListener('click', () => zoom(0));
}

// Mount ONE strip model into a container and wire brush + zoombar + in-place
// semantic-zoom re-render. Returns the .fig element (or null if the kit is absent).
function mountStrip(box, model, ariaLabel, opts = {}) {
  if (!(ENH.ts && ENH.ts.periodStrip && ENH.fig && ENH.fig.mountFigure)) return null;
  const width = 960;
  const out = ENH.ts.periodStrip(model, { width, ariaLabel });
  const fig = ENH.fig.mountFigure(box, { svg: out.svg, textModel: out.textModel, ariaLabel, scroll: 'auto' });
  const svg = fig.querySelector('svg[data-viz="period-strip"]');
  if (svg && opts.crosshair) svg.setAttribute('data-crosshair', '');
  try { ENH.brush && ENH.brush.initBrush && ENH.brush.initBrush(fig); } catch { /* */ }
  if (svg) addZoombar(fig, svg);
  fig.addEventListener('viz:zoom', e => {
    const s = fig.querySelector('svg[data-viz="period-strip"]');
    if (!s || !ENH.ts) return;
    const re = ENH.ts.periodStrip({ ...model, domain: [e.detail.t0, e.detail.t1] }, { width, ariaLabel });
    const tmp = document.createElement('div'); tmp.innerHTML = re.svg;
    const nn = tmp.querySelector('svg'); if (!nn) return;
    s.setAttribute('viewBox', nn.getAttribute('viewBox'));
    s.setAttribute('data-domain', nn.getAttribute('data-domain'));
    s.innerHTML = nn.innerHTML;
    if (opts.crosshair) s.setAttribute('data-crosshair', '');
    if (typeof opts.onZoom === 'function') { try { opts.onZoom(e.detail.t0, e.detail.t1); } catch { /* */ } }
  });
  return fig;
}

function firdariaStripModel(fird, curF, asOf) {
  const majors = fird.majors;
  const domain = [majors[0].startDate.getTime(), majors[majors.length - 1].endDate.getTime()];
  const segments = majors.map((m, i) => ({
    id: `fird-${i}-${m.lord}`, label: nice(m.lord), short: G(m.lord), lord: m.lord,
    start: m.startDate.getTime(), end: m.endDate.getTime(), current: curF.major === m,
  }));
  return { domain, now: asOf.getTime(), lanes: [{ id: 'firdaria', label: 'Firdārīa', segments }], markers: [] };
}

function zrStripModel(rel, asOf) {
  const laneOf = (zr, cur, label) => ({
    id: label, label,
    segments: zr.l1.map((p, i) => ({
      id: `zr-${label}-${i}`, label: p.sign, short: SIGN_GLYPHS[p.signIndex],
      start: p.startDate.getTime(), end: p.endDate.getTime(), current: cur.l1 === p,
    })),
  });
  const starts = [rel.zrS.l1[0].startDate.getTime(), rel.zrF.l1[0].startDate.getTime()];
  const endsS = rel.zrS.l1[rel.zrS.l1.length - 1].endDate.getTime();
  const endsF = rel.zrF.l1[rel.zrF.l1.length - 1].endDate.getTime();
  const domain = [Math.min(...starts), Math.max(endsS, endsF)];
  return {
    domain, now: asOf.getTime(),
    lanes: [laneOf(rel.zrS, rel.curS, 'Spirit'), laneOf(rel.zrF, rel.curFo, 'Fortune')], markers: [],
  };
}

function mountTlStrips(fird, curF, rel, birth, asOf) {
  if (!(ENH.ts && ENH.fig && ENH.brush)) return;
  const firdBox = ensureFigBox('tl-fird-fig', $('tl-fird'));
  const zrBox = ensureFigBox('tl-zr-fig', $('tl-zr'));
  try { mountStrip(firdBox, firdariaStripModel(fird, curF, asOf), 'Firdārīa periods over the life'); } catch { /* */ }
  try { mountStrip(zrBox, zrStripModel(rel, asOf), 'Zodiacal releasing (L1) from Spirit and Fortune'); } catch { /* */ }
}
