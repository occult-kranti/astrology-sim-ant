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
  $('tl-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
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
