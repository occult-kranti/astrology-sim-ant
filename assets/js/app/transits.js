// ============================================================================
//  transits.js (app) — drives pages/transits.html: TRANSITS TO A NATAL CHART.
//  All DOM lives here; the pure engine is core/transits.js (the timeline +
//  profection overlay) with core/returns.js for the lunar (monthly) returns and
//  core/profections.js for the Lord of the Year. A birth moment + a date window
//  → the exact-hit timeline, the time-lord-activated highlights, the body
//  stations & ingresses, a "transits in force" snapshot, and the lunar returns.
//
//  HONEST FRAMING: astrology has no demonstrated validity. These are real
//  astronomical hit-dates inside a historical timing grammar — described, never
//  prescribed. The amplification rule is labelled a modern reconstruction.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { transitTimeline, currentTransits, TRANSIT_BODIES_DEFAULT, NATAL_POINTS_DEFAULT } from '../core/transits.js';
import { lunarReturnsBetween } from '../core/returns.js';
import { wireCitySelect, toUTC, autolinkResultPanels, nowLocalFields } from './shared.js';
import { attachPersonPicker } from './person.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const NICE = { NorthNode: 'North Node', SouthNode: 'South Node' };
const nice = p => NICE[p] || p;
const fmtDT = d => d.toISOString().replace('T', ' ').slice(0, 16) + ' UT';
const fmtD = d => d.toISOString().slice(0, 10);
const HL = 'background:var(--parchment-2);outline:1px solid var(--gold-2)';

const ASPECT_OPTS = [
  { angle: 0, label: 'Conjunction ☌' }, { angle: 60, label: 'Sextile ⚹' },
  { angle: 90, label: 'Square □' }, { angle: 120, label: 'Trine △' }, { angle: 180, label: 'Opposition ☍' },
];
const POINT_OPTS = NATAL_POINTS_DEFAULT;   // Sun..Saturn + Ascendant + Midheaven
const BODY_OPTS = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// last computed report, for the AI panel + a callable snapshot (prasna.js contract)
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentTransitsReport() { return lastReport; }
export function subscribeTransitsReport(cb) { reportSubs.push(cb); }

export function initTransits() {
  wireCitySelect($('tx-city'), $('tx-lat'), $('tx-lon'), $('tx-offset'));
  attachPersonPicker($('tx-picker-anchor'), {
    bdate: $('tx-date'), btime: $('tx-time'), boffset: $('tx-offset'), blat: $('tx-lat'), blon: $('tx-lon'),
  });

  // default window: today → +1 year
  const today = nowLocalFields().date;
  const [y, m, d] = today.split('-').map(Number);
  $('tx-from').value = today;
  $('tx-to').value = `${y + 1}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // checkbox banks
  $('tx-bodies').innerHTML = BODY_OPTS.map(b =>
    `<label class="pill"><input type="checkbox" name="tx-body" value="${b}" checked> ${G(b)} ${b}</label>`).join(' ');
  $('tx-moon-wrap').innerHTML = `<label class="pill" title="the Moon perfects dozens of exact aspects a month — off by default"><input type="checkbox" id="tx-moon"> ☽ include the transiting Moon</label>`;
  $('tx-points').innerHTML = POINT_OPTS.map(p =>
    `<label class="pill"><input type="checkbox" name="tx-point" value="${p}" checked> ${G(p)} ${esc(nice(p))}</label>`).join(' ');
  $('tx-aspects').innerHTML = ASPECT_OPTS.map(a =>
    `<label class="pill"><input type="checkbox" name="tx-aspect" value="${a.angle}" checked> ${esc(a.label)}</label>`).join(' ');

  $('tx-form').addEventListener('submit', e => { e.preventDefault(); compute(); });

  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'transits',
      getReading: () => lastReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Compute a transit timeline above first.' },
    });
  }
}

function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
}

function compute() {
  const lat = parseFloat($('tx-lat').value), lon = parseFloat($('tx-lon').value);
  const dateStr = $('tx-date').value, timeStr = $('tx-time').value;
  const status = $('tx-status');
  if (isNaN(lat) || isNaN(lon) || !dateStr || !timeStr) { status.textContent = 'Fill the birth date, time and place first.'; return; }
  const fromStr = $('tx-from').value, toStr = $('tx-to').value;
  if (!fromStr || !toStr) { status.textContent = 'Choose a from/to date range.'; return; }
  const start = new Date(`${fromStr}T00:00:00Z`), end = new Date(`${toStr}T00:00:00Z`);
  if (end <= start) { status.textContent = 'The "to" date must be after the "from" date.'; return; }
  if ((end - start) / 86400000 > 731) { status.textContent = 'The range is capped at ~2 years — narrow it.'; return; }
  status.textContent = '';

  const bodies = checkedValues('tx-body');
  const natalPoints = checkedValues('tx-point');
  const aspects = checkedValues('tx-aspect').map(Number);
  const includeMoon = $('tx-moon') && $('tx-moon').checked;
  if (!bodies.length || !natalPoints.length || !aspects.length) { status.textContent = 'Pick at least one transiting planet, natal point and aspect.'; return; }

  const birth = toUTC(dateStr, timeStr, parseFloat($('tx-offset').value) || 0);
  let natal, tl, snap, lr;
  try {
    natal = castChart(birth, lat, lon, 'regiomontanus');
    tl = transitTimeline(natal, start, end, { bodies, natalPoints, aspects, includeMoon });
    // "in force" snapshot at the range start (or today if within the window)
    const now = new Date();
    const refDate = (now >= start && now <= end) ? now : start;
    snap = currentTransits(natal, refDate, { natalPoints });
    // lunar returns across the window (cap the window at 400 days for the table)
    const lrEnd = (end - start) / 86400000 > 400 ? new Date(start.getTime() + 400 * 86400000) : end;
    lr = lunarReturnsBetween(natal, start, lrEnd);
  } catch (e) {
    $('tx-timeline').innerHTML = `<p class="muted">Could not compute the transits (${esc(e.message)}).</p>`;
    return;
  }

  renderSummary(natal, tl, birth);
  renderSnapshot(snap);
  renderTimeline(tl);
  renderStations(tl);
  renderReturns(lr);
  try { autolinkResultPanels(['tx-summary', 'tx-snapshot', 'tx-timeline', 'tx-stations', 'tx-returns']); } catch { /* non-fatal */ }

  lastReport = {
    kind: 'transits',
    meta: { birthUTC: birth.toISOString(), lat, lon, asc: formatLon(natal.asc), mc: formatLon(natal.mc), isDay: natal.isDay },
    window: tl.window, bodies: tl.bodies, natalPoints: tl.natalPoints, aspects: tl.aspects,
    profectionsInWindow: tl.profectionsInWindow,
    events: tl.events.map(e => ({
      body: e.transitingBody, natalPoint: e.natalPoint, aspect: e.aspect, exactISO: e.exactISO,
      transit: e.transitLabel, motion: e.motion, pass: `${e.passIndex}/${e.passCount}`,
      timeLordActivated: e.timeLordActivated, timeLordReason: e.timeLordReason,
      lordOfYear: e.profection ? e.profection.lordOfYear : null,
    })),
    snapshot: { dateISO: snap.dateISO, contacts: snap.contacts.map(c => ({ body: c.transitingBody, natalPoint: c.natalPoint, aspect: c.aspect, orb: +c.orb.toFixed(2), applying: c.applying, timeLordActivated: c.timeLordActivated })) },
    stations: tl.stations.map(s => ({ body: s.body, when: s.instantISO, station: s.station, at: s.label })),
    ingresses: tl.ingresses.map(i => ({ body: i.body, when: i.instantISO, sign: i.sign })),
    lunarReturns: { count: lr.count, first: lr.returns[0] ? lr.returns[0].instantISO : null },
    citation: tl.citation,
  };
  notifyReport();
}

// --- natal + window summary --------------------------------------------------
function renderSummary(natal, tl, birth) {
  const profs = tl.profectionsInWindow.map(p =>
    `age <b>${p.age}</b> → profected <b>${esc(p.profectedSign)}</b>, Lord of the Year <b>${G(p.lordOfYear)} ${esc(p.lordOfYear)}</b>`).join(' · ');
  $('tx-summary').innerHTML = `
    <p class="small"><b>Nativity</b> ${esc(fmtDT(birth))} — Asc ${esc(formatLon(natal.asc))}, MC ${esc(formatLon(natal.mc))},
      ${natal.isDay ? 'day' : 'night'} birth. <b>Window</b> ${esc(tl.window.startISO.slice(0, 10))} → ${esc(tl.window.endISO.slice(0, 10))}
      (${tl.window.days} days). <b>${tl.events.length}</b> exact hits.</p>
    <p class="small"><b>Profection ${tl.profectionsInWindow.length > 1 ? 'years' : 'year'} in the window:</b> ${profs || '<span class="muted">— (birth date unknown to the profection)</span>'}.
      <span class="muted">Transits BY the Lord of the Year, or TO the Lord of the Year / the profected sign, are highlighted — the "time-lord activated" filter.</span></p>
    ${tl.bodies.includes('Moon') ? '' : '<p class="small muted">The transiting <b>Moon is excluded</b> (too fast for a daily timeline — it perfects dozens of exact aspects a month). Tick "include the transiting Moon" to add it, or read its returns below.</p>'}`;
}

// --- transits in force (snapshot) --------------------------------------------
function renderSnapshot(snap) {
  if (!snap.contacts.length) { $('tx-snapshot').innerHTML = `<p class="small muted">No transiting aspect within orb at ${esc(snap.dateISO.slice(0, 16).replace('T', ' '))} UT.</p>`; return; }
  const rows = snap.contacts.map(c => `<tr${c.timeLordActivated ? ` style="${HL}"` : ''}>
    <td class="l">${G(c.transitingBody)} ${esc(c.transitingBody)}${c.retrograde ? ' ℞' : ''}</td>
    <td class="l">${esc(c.glyph)} ${esc(c.aspect)}</td>
    <td class="l">${G(c.natalPoint)} ${esc(nice(c.natalPoint))}</td>
    <td class="num">${c.orb.toFixed(2)}°</td>
    <td>${c.applying ? '<span class="verdict amber">applying</span>' : '<span class="verdict green">separating</span>'}</td>
    <td class="l small">${c.timeLordActivated ? `<b>◀ ${esc(c.timeLordReason)}</b>` : ''}</td></tr>`).join('');
  $('tx-snapshot').innerHTML = `
    <p class="small">Transiting aspects <b>in orb</b> at <b>${esc(snap.dateISO.slice(0, 16).replace('T', ' '))} UT</b>
      ${snap.profection ? `— profection age ${snap.profection.age}, Lord of the Year <b>${G(snap.profection.lordOfYear)} ${esc(snap.profection.lordOfYear)}</b>` : ''}.
      <span class="muted">Orbs are Lilly's moieties; applying vs separating is the state an exact-hit list cannot show.</span></p>
    <table class="data"><thead><tr><th class="l">Transiting</th><th class="l">Aspect</th><th class="l">Natal point</th><th class="num">Orb</th><th>Phase</th><th class="l">Time-lord</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <p class="small muted">${esc(snap.note)}</p>`;
}

// --- the exact-hit timeline --------------------------------------------------
function renderTimeline(tl) {
  if (!tl.events.length) { $('tx-timeline').innerHTML = '<p class="small muted">No exact hits in this window for the chosen planets, points and aspects.</p>'; return; }
  const rows = tl.events.map(e => `<tr${e.timeLordActivated ? ` style="${HL}"` : ''}>
    <td class="l small">${esc(fmtDT(e.exactInstant))}</td>
    <td class="l">${G(e.transitingBody)} ${esc(e.transitingBody)}</td>
    <td class="l">${esc(e.glyph)} ${esc(e.aspect)}</td>
    <td class="l">${G(e.natalPoint)} ${esc(nice(e.natalPoint))}</td>
    <td class="l small">${esc(e.transitLabel)}${e.retrograde ? ' <b>℞</b>' : ''}</td>
    <td class="l small">exact${e.passCount > 1 ? ` · ${esc(e.passNote)}` : ''}</td>
    <td class="l small">${e.timeLordActivated ? `<b>◀ ${esc(e.timeLordReason)}</b>${e.profection ? ` <span class="muted">(LOTY ${esc(e.profection.lordOfYear)})</span>` : ''}` : ''}</td></tr>`).join('');
  $('tx-timeline').innerHTML = `
    <p class="small">${tl.events.length} exact perfections, earliest first. <b>℞</b> = the transiting planet is retrograde at the hit;
      a retrograde loop over a natal point gives the classic <b>1-or-3 pass</b> structure. Highlighted rows are
      <b>time-lord activated</b> (a transit BY the Lord of the Year, or TO the Lord of the Year / the profected sign).</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Exact-hit transit timeline (scrollable)">
    <table class="data"><thead><tr><th class="l">Exact (UT)</th><th class="l">Transiting</th><th class="l">Aspect</th><th class="l">Natal point</th><th class="l">At</th><th class="l">Pass</th><th class="l">Time-lord</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
}

// --- stations & ingresses (the "Dates + Degrees" context) --------------------
function renderStations(tl) {
  const stRows = tl.stations.map(s => `<tr><td class="l small">${esc(fmtD(s.instant))}</td>
    <td class="l">${G(s.body)} ${esc(s.body)}</td><td class="l">stations <b>${esc(s.station)}</b></td><td class="l small">${esc(s.label)}</td></tr>`).join('');
  const inRows = tl.ingresses.map(i => `<tr><td class="l small">${esc(fmtD(i.instant))}</td>
    <td class="l">${G(i.body)} ${esc(i.body)}</td><td class="l">enters <b>${esc(i.sign)}</b></td><td class="l small">${esc(formatLon(i.lon))}</td></tr>`).join('');
  $('tx-stations').innerHTML = `
    <p class="small">The stations (direction changes) and sign ingresses of the transiting planets in the window — the raw
      material of a "dates &amp; degrees" calendar. <span class="muted">A planet stationing on a natal degree is a classic
      trigger; an ingress moves it into a new whole-sign house of the natal chart.</span></p>
    <div class="grid cols-2">
      <div><h3>Stations</h3>${stRows ? `<table class="data"><thead><tr><th class="l">Date</th><th class="l">Planet</th><th class="l">Station</th><th class="l">At</th></tr></thead><tbody>${stRows}</tbody></table>` : '<p class="small muted">No stations in the window.</p>'}</div>
      <div><h3>Sign ingresses</h3>${inRows ? `<table class="data"><thead><tr><th class="l">Date</th><th class="l">Planet</th><th class="l">Ingress</th><th class="l">At</th></tr></thead><tbody>${inRows}</tbody></table>` : '<p class="small muted">No sign ingresses in the window.</p>'}</div>
    </div>`;
}

// --- lunar (monthly) returns -------------------------------------------------
function renderReturns(lr) {
  const rows = lr.returns.map((r, i) => `<tr><td>${i + 1}</td><td class="l small">${esc(fmtDT(r.instant))}</td>
    <td class="l small">${esc(r.moonLabel)}</td></tr>`).join('');
  $('tx-returns').innerHTML = `
    <p class="small">The <b>lunar (monthly) returns</b> in the window — the instants the transiting Moon regains its
      natal place (${esc(lr.natalMoonLabel)}), about 13 a year. Catherine Urban sells "monthly return" readings; the
      return chart is cast for each instant at the birthplace. <b>${lr.count}</b> in this span.</p>
    ${rows ? `<table class="data"><thead><tr><th>#</th><th class="l">Return (UT)</th><th class="l">Moon at</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="small muted">No lunar returns in the window.</p>'}
    <div class="callout science" style="margin-top:.6rem"><span class="label">Contested definition, kept honest</span>
      ${esc(lr.contested)}</div>`;
}
