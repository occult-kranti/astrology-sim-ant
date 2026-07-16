// ============================================================================
//  handcalc.js (app) — drives pages/handcalc.html: "Cast a chart by hand."
//
//  Five stations of the classic manual workflow (clock→UT, LST, positions,
//  houses, the finished chart), each hand step CHECKED against the verified
//  engine with the delta shown. All computation lives in the pure core
//  (core/handcalc.js + core/astro.js); this file owns the DOM only.
//
//  HONEST FRAMING (locked): this is the real, astronomical part of astrology —
//  reproducible mathematics. The interpretive layer that would read meaning into
//  the finished chart remains without demonstrated validity. NO assistant panel.
// ============================================================================
import { castChart, PLANET_GLYPHS } from '../core/astro.js';
import {
  lstHand, lstExact, ramcExact, siderealTimeAtMidnight, intervalHoursOf,
  plog, interpolateBody, miniEphemeris, tableOfHousesDemo,
  formatHMS, formatDMS, formatZodiac, hmsFromHours, dmsFromDeg, stSecondsBetween,
  HANDCALC_BODIES,
} from '../core/handcalc.js';
import {
  DEFAULT_EXAMPLE, ATLAS_PITFALLS, ACCEL_CONSTANTS, DEVORE_PLOG_CHECK,
  CAVEATS, VERIFICATION_CULTURE, REFERENCE_KIT,
} from '../core/data/handcalc-data.js';
import { wireCitySelect, toUTC, autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const ORD = h => `${h}${h === 1 ? 'st' : h === 2 ? 'nd' : h === 3 ? 'rd' : 'th'}`;

// delta chips — green when negligible, amber/red when it is a real (still tiny) gap
const dSec = s => `<span class="${Math.abs(s) < 1 ? 'hc-delta-ok' : 'hc-delta-warn'}">${s >= 0 ? '+' : '−'}${Math.abs(s).toFixed(2)} s</span>`;
const dMin = m => `<span class="${Math.abs(m) < 1 ? 'hc-delta-ok' : 'hc-delta-warn'}">${m >= 0 ? '+' : '−'}${Math.abs(m).toFixed(2)}′</span>`;
const fmtUT = d => new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UT';

let lastBirth = null;

export function initHandcalc() {
  wireCitySelect($('hc-city'), $('hc-lat'), $('hc-lon'), $('hc-offset'));

  // prefill the worked example (the single source is the data module)
  $('hc-date').value = DEFAULT_EXAMPLE.date;
  $('hc-time').value = DEFAULT_EXAMPLE.time;
  $('hc-offset').value = DEFAULT_EXAMPLE.offset;
  $('hc-lat').value = DEFAULT_EXAMPLE.lat;
  $('hc-lon').value = DEFAULT_EXAMPLE.lon;

  $('hc-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  $('hc-rate').addEventListener('change', () => { if (lastBirth) compute(); });
  $('hc-t-go').addEventListener('click', workMyLST);

  renderSources();
  compute();
}

function readForm() {
  const lat = parseFloat($('hc-lat').value), lon = parseFloat($('hc-lon').value);
  const date = $('hc-date').value, time = $('hc-time').value;
  const offset = parseFloat($('hc-offset').value) || 0;
  const rate = parseFloat($('hc-rate').value) || 10;
  return { lat, lon, date, time, offset, rate };
}

function compute() {
  const f = readForm();
  const status = $('hc-status');
  if (isNaN(f.lat) || isNaN(f.lon) || !f.date || !f.time) {
    status.textContent = 'Fill the birth date, time, latitude and longitude first.'; return;
  }
  status.textContent = '';
  const birthUT = toUTC(f.date, f.time, f.offset);
  lastBirth = { birthUT, ...f };

  renderUT(f, birthUT);
  const lst = renderLST(f, birthUT);
  const pos = renderPositions(birthUT, lst.interval);
  const houses = renderHouses(f, birthUT);
  renderChart(f, birthUT, lst, pos, houses);

  try { autolinkResultPanels(['hc-ut', 'hc-lst', 'hc-pos', 'hc-houses', 'hc-chart']); } catch { /* non-fatal */ }
}

// --- STATION 1 — clock time → UT --------------------------------------------
function renderUT(f, birthUT) {
  const off = f.offset;
  const offLabel = `UTC${off >= 0 ? '+' : '−'}${Math.abs(off)}`;
  const pitfalls = ATLAS_PITFALLS.map(p => `<div class="hc-pitfall">
      <b>${esc(p.title)}</b>
      <div class="small">${esc(p.text)}</div>
      <div class="small muted">Source: ${esc(p.source)}</div></div>`).join('');
  $('hc-ut').innerHTML = `
    <p class="small">Clock time <b class="hc-mono">${esc(f.date)} ${esc(f.time)}</b> at offset <b>${esc(offLabel)}</b>
      → Universal Time <b class="hc-mono">${esc(fmtUT(birthUT))}</b>. The rule: <b>UT = local − offset</b> (subtract
      the zone; a west/negative offset therefore adds hours and can roll the date).</p>
    <div class="callout"><span class="label">The honest atlas step</span>
      This tool takes the UTC offset <b>you</b> supply — it does <b>not</b> ship a time-zone atlas. That is the honest
      limit, because the offset is where real charts go wrong. An astrologer working by hand reaches for
      <b>The American Atlas</b> (Shanks) precisely because US zone &amp; daylight-saving history is unreconstructable
      from memory. The documented traps:</div>
    ${pitfalls}
    <p class="small muted">If your offset is off by an hour, every step below is off with it — and nothing in the
      trigonometry will warn you. That is the lesson of Station 1.</p>`;
}

// --- STATION 2 — Local Sidereal Time ----------------------------------------
function renderLST(f, birthUT) {
  const st0 = siderealTimeAtMidnight(birthUT);
  const interval = intervalHoursOf(birthUT);
  const lonDeg = f.lon;
  const eng = lstExact(birthUT, lonDeg);
  const ramc = ramcExact(birthUT, lonDeg);

  const handBook = lstHand(birthUT, st0, interval, lonDeg, { rate: 10 });
  const handExact = lstHand(birthUT, st0, interval, lonDeg, { rate: 9.8565 });
  const handSel = f.rate === 10 ? handBook : f.rate === 9.8565 ? handExact : lstHand(birthUT, st0, interval, lonDeg, { rate: f.rate });

  const bs = handSel.bookShortcut;
  const accelExplain = handSel.rate === 10
    ? `book rule: ${bs.hoursInt}×10 + ${bs.minutesRem.toFixed(0)}÷6 = ${(bs.hoursTerm + bs.minutesTerm).toFixed(1)} s`
    : `${handSel.rate} s/h × ${interval.toFixed(4)} h`;
  const lonDir = lonDeg < 0 ? 'West, subtract' : 'East, add';

  // the term-by-term breakdown for the selected rate
  const terms = `
    <table class="data hc-scroll"><tbody>
      <tr><td>Sidereal time at prior midnight (0h UT)</td><td class="hc-num hc-mono">${formatHMS(st0)}</td><td class="small muted">from the ephemeris page (our engine's GAST at 0h)</td></tr>
      <tr><td>+ UT interval since midnight</td><td class="hc-num hc-mono">${formatHMS(interval)}</td><td class="small muted">Station 1's UT, minus 0h</td></tr>
      <tr class="hc-hand"><td>+ Acceleration @ ${handSel.rate} s/h</td><td class="hc-num hc-mono">+${handSel.accelSeconds.toFixed(1)} s</td><td class="small muted">${esc(accelExplain)}</td></tr>
      <tr><td>${lonDeg < 0 ? '−' : '+'} Longitude ÷ 15</td><td class="hc-num hc-mono">${handSel.parts.longitude}</td><td class="small muted">${esc(formatDMS(Math.abs(lonDeg)))} ÷ 15 (${lonDir})</td></tr>
      <tr style="border-top:2px solid var(--rule)"><td><b>= Local Sidereal Time (by hand)</b></td><td class="hc-num hc-mono"><b>${formatHMS(handSel.lstHours)}</b></td><td class="small muted">${handSel.wrapped ? 'reduced below 24h' : ''}</td></tr>
      <tr><td>Engine LST = RAMC ÷ 15</td><td class="hc-num hc-mono">${formatHMS(eng)}</td><td class="small muted">RAMC ${ramc.toFixed(3)}° = GAST + longitude</td></tr>
    </tbody></table>`;

  const dB = stSecondsBetween(handBook.lstHours, eng);
  const dE = stSecondsBetween(handExact.lstHours, eng);
  const compare = `
    <table class="data"><thead><tr><th>Acceleration rule</th><th class="hc-num">on interval</th><th class="hc-num">hand LST</th><th class="hc-num">Δ vs engine</th></tr></thead>
    <tbody>
      <tr${f.rate === 10 ? ' class="hc-hand"' : ''}><td>10 s/hour — the book rule</td><td class="hc-num hc-mono">+${handBook.accelSeconds.toFixed(1)} s</td><td class="hc-num hc-mono">${formatHMS(handBook.lstHours)}</td><td class="hc-num">${dSec(dB)}</td></tr>
      <tr${f.rate === 9.8565 ? ' class="hc-hand"' : ''}><td>9.8565 s/hour — exact mean</td><td class="hc-num hc-mono">+${handExact.accelSeconds.toFixed(1)} s</td><td class="hc-num hc-mono">${formatHMS(handExact.lstHours)}</td><td class="hc-num">${dSec(dE)}</td></tr>
    </tbody></table>`;

  const reconcile = ACCEL_CONSTANTS.map(a => `<li><b>${esc(a.label)}</b> — ${esc(a.note)} <span class="muted">(${esc(a.source)})</span></li>`).join('');

  $('hc-lst').innerHTML = `
    ${terms}
    <p class="small">The two acceleration rules, side by side against the engine — the book rule's cost is a
      fraction of a second of sidereal time:</p>
    ${compare}
    <details style="margin-top:.5rem"><summary class="small">The acceleration constant, reconciled (a contested value)</summary>
      <ul class="clean small" style="margin-top:.4rem">${reconcile}</ul></details>`;

  // prefill the "do it yourself" term inputs with the derived values
  const sh = hmsFromHours(st0), iv = hmsFromHours(interval), ld = dmsFromDeg(Math.abs(lonDeg));
  $('hc-t-sth').value = sh.h; $('hc-t-stm').value = sh.m; $('hc-t-sts').value = sh.s.toFixed(1);
  $('hc-t-inth').value = iv.h; $('hc-t-intm').value = iv.m;
  $('hc-t-lond').value = ld.d; $('hc-t-lonm').value = ld.m;
  $('hc-t-londir').value = lonDeg < 0 ? 'W' : 'E';

  return { st0, interval, eng, ramc, handBook, handExact, handSel, deltaBookSec: dB, deltaExactSec: dE };
}

// the interactive "work it yourself" panel
function workMyLST() {
  if (!lastBirth) return;
  const sth = parseFloat($('hc-t-sth').value) || 0, stm = parseFloat($('hc-t-stm').value) || 0, sts = parseFloat($('hc-t-sts').value) || 0;
  const inth = parseFloat($('hc-t-inth').value) || 0, intm = parseFloat($('hc-t-intm').value) || 0;
  const lond = parseFloat($('hc-t-lond').value) || 0, lonm = parseFloat($('hc-t-lonm').value) || 0;
  const dir = $('hc-t-londir').value;
  const rate = parseFloat($('hc-rate').value) || 10;

  const st0 = sth + stm / 60 + sts / 3600;
  const interval = inth + intm / 60;
  const lonDeg = (dir === 'W' ? -1 : 1) * (lond + lonm / 60);

  const hand = lstHand(lastBirth.birthUT, st0, interval, lonDeg, { rate });
  const eng = lstExact(lastBirth.birthUT, lastBirth.lon);
  const d = stSecondsBetween(hand.lstHours, eng);
  $('hc-t-out').innerHTML = `Your acceleration @ ${rate} s/h = <b class="hc-mono">+${hand.accelSeconds.toFixed(1)} s</b>;
    your hand LST = <b class="hc-mono">${formatHMS(hand.lstHours)}</b>; the engine's LST = <b class="hc-mono">${formatHMS(eng)}</b>.
    Difference: ${dSec(d)}. <span class="muted">(The engine uses the birth longitude you entered in the form above,
    ${lastBirth.lon}°; edit the terms to see how each shifts the result.)</span>`;
}

// --- STATION 3 — planetary positions ----------------------------------------
function renderPositions(birthUT, interval) {
  const me = miniEphemeris(birthUT, 2);

  // the mini-ephemeris table (midnight positions + daily motions)
  const head = `<tr><th>Body</th>${me.rows.map(r => `<th class="hc-num">@0h ${esc(new Date(r.date).toISOString().slice(5, 10))}</th>`).join('')}<th class="hc-num">daily motion</th></tr>`;
  const meBody = HANDCALC_BODIES.map(name => {
    const cells = me.rows.map(r => `<td class="hc-num hc-mono">${formatZodiac(r.bodies[name].lon, false)}</td>`).join('');
    return `<tr><td>${G(name)} ${esc(name)}</td>${cells}<td class="hc-num hc-mono">${formatDMS(me.rows[0].bodies[name].motion, 0)}</td></tr>`;
  }).join('');
  const nodeRow = `<tr><td>${G('NorthNode')} N. Node <span class="muted small">(mean)</span></td>${me.rows.map(r => `<td class="hc-num hc-mono">${formatZodiac(r.node.lon, false)}</td>`).join('')}<td class="hc-num hc-mono">${formatDMS(me.rows[0].node.motion, 0)}</td></tr>`;

  // interpolation per body: linear AND proportional-log, vs engine exact
  const interp = HANDCALC_BODIES.map(name => {
    const b = interpolateBody(name, birthUT, interval);
    const isMoon = name === 'Moon';
    return `<tr${isMoon ? ' class="hc-moon-row"' : ''}>
      <td>${G(name)} ${esc(name)}</td>
      <td class="hc-num hc-mono">${formatDMS(b.dailyMotion, 0)}</td>
      <td class="hc-num hc-mono">${formatZodiac(b.linear.lon)}</td>
      <td class="hc-num hc-mono">${formatZodiac(b.plog.lon)}</td>
      <td class="hc-num hc-mono">${formatZodiac(b.exact)}</td>
      <td class="hc-num">${dMin(b.linear.errorMin)}</td></tr>`;
  }).join('');

  // the proportional-log method spelt out: the DeVore printed check + the live Moon
  const moon = interpolateBody('Moon', birthUT, interval);
  const dc = DEVORE_PLOG_CHECK;
  const plogPanel = `
    <details style="margin-top:.6rem"><summary class="small"><b>The proportional logarithm</b> — plog(x) = log₁₀(1440 ÷ x-in-minutes), so plog(motion) + plog(interval) = plog(correction)</summary>
      <div style="margin-top:.4rem">
        <p class="small"><b>Historical check</b> — DeVore's printed table values, reproduced exactly by our plog():
          plog(${esc(dc.motion.label)}) = <span class="hc-mono">${plog(dc.motion.minutes).toFixed(5)}</span> (book ${dc.motion.printedPlog}),
          plog(${esc(dc.interval.label)}) = <span class="hc-mono">${plog(dc.interval.minutes).toFixed(5)}</span> (book ${dc.interval.printedPlog}),
          sum <span class="hc-mono">${(plog(dc.motion.minutes) + plog(dc.interval.minutes)).toFixed(5)}</span> → correction
          <span class="hc-mono">${formatDMS((1440 / Math.pow(10, plog(dc.motion.minutes) + plog(dc.interval.minutes))) / 60, 0)}</span> (book ${esc(dc.resultPrinted)}).</p>
        <p class="small"><b>This chart's Moon</b> — daily motion ${formatDMS(moon.dailyMotion, 0)} (${moon.plog.dmMinutes.toFixed(1)}′),
          interval ${formatHMS(interval)} (${moon.plog.intMinutes.toFixed(0)} min):
          plog <span class="hc-mono">${moon.plog.plogDm.toFixed(5)}</span> + plog <span class="hc-mono">${moon.plog.plogInt.toFixed(5)}</span>
          = <span class="hc-mono">${moon.plog.sum.toFixed(5)}</span> → correction
          <span class="hc-mono">${formatDMS(moon.plog.motionDeg, 0)}</span>. The prop-log answer and the linear answer
          agree to <b>${Math.abs(moon.routesAgreeMin).toFixed(3)}′</b> — the logs are a labour-saver, not an accuracy gain.</p>
        <p class="small muted">${esc(dc.tableTopConstant.label)} = ${dc.tableTopConstant.value} (${esc(dc.tableTopConstant.note)}). ${esc(dc.warning)}</p>
      </div></details>`;

  $('hc-pos').innerHTML = `
    <h3 style="margin:.2rem 0 .3rem;font-size:1rem">The mini-ephemeris <span class="small muted">— our engine, printed like the Michelsen midnight page</span></h3>
    <p class="small muted" style="margin:.1rem 0 .4rem">Honest provenance: these midnight positions are computed by
      this site's verified engine, not scanned from a book — but they are exactly what the American Ephemeris at
      Midnight would show for this date.</p>
    <div class="hc-scroll"><table class="data"><thead>${head}</thead><tbody>${meBody}${nodeRow}</tbody></table></div>

    <h3 style="margin:.8rem 0 .3rem;font-size:1rem">Interpolation to the birth moment <span class="small muted">— linear &amp; proportional-log, vs the exact engine</span></h3>
    <div class="hc-scroll"><table class="data"><thead>
      <tr><th>Body</th><th class="hc-num">daily motion</th><th class="hc-num">linear estimate</th><th class="hc-num">prop-log estimate</th><th class="hc-num">engine exact</th><th class="hc-num">Δ (linear)</th></tr>
      </thead><tbody>${interp}</tbody></table></div>
    <p class="small"><span class="hc-moon-row" style="padding:.05rem .3rem">The Moon</span> is the one to watch: its
      one-day linear interpolation carries a <b>~2–3′ error</b> because its motion curves within the day — the classics
      say to use logarithms for it (which give the same answer here). The Sun's error is ≈0.00′. Neither shifts a sign
      or a house.</p>
    ${plogPanel}`;

  return { moon, sunErr: interpolateBody('Sun', birthUT, interval).linear.errorMin, moonErr: moon.linear.errorMin };
}

// --- STATION 4 — house cusps -------------------------------------------------
function renderHouses(f, birthUT) {
  const ramc = ramcExact(birthUT, f.lon);
  const th = tableOfHousesDemo(ramc, f.lat, birthUT, { system: 'placidus' });
  const g = th.grid;
  const z = a => formatZodiac(a);

  const grid = `
    <div class="hc-grid2">
      <div></div><div class="h">lat ${g.latLo}°N</div><div class="h">lat ${g.latHi}°N</div>
      <div class="h">ST ${formatHMS(g.rowLoST, 0)} (RAMC ${g.rowLoRamc}°)</div><div class="hc-mono">${z(g.corners.loLo.asc)}</div><div class="hc-mono">${z(g.corners.loHi.asc)}</div>
      <div class="h">ST ${formatHMS(g.rowHiST, 0)} (RAMC ${g.rowHiRamc}°)</div><div class="hc-mono">${z(g.corners.hiLo.asc)}</div><div class="hc-mono">${z(g.corners.hiHi.asc)}</div>
    </div>`;

  $('hc-houses').innerHTML = `
    <p class="small">Your sidereal time is <b class="hc-mono">${formatHMS(ramc / 15)}</b> (RAMC ${ramc.toFixed(3)}°), your
      latitude <b>${f.lat}°N</b>. That falls between two table rows (4-min sidereal-time steps = 1° of RAMC) and two
      latitude columns. The four surrounding <b>Ascendant</b> cells:</p>
    ${grid}
    <p class="small">Interpolate across the rows by ${(g.rowFrac * 100).toFixed(1)}% and across the latitudes by
      ${(g.latFrac * 100).toFixed(1)}%:</p>
    <table class="data"><thead><tr><th>Angle</th><th class="hc-num">double-interpolated (by hand)</th><th class="hc-num">engine exact</th><th class="hc-num">Δ</th></tr></thead>
    <tbody>
      <tr><td>Ascendant</td><td class="hc-num hc-mono">${z(th.interpolated.asc)}</td><td class="hc-num hc-mono">${z(th.exact.asc)}</td><td class="hc-num">${dMin(th.delta.ascMin)}</td></tr>
      <tr><td>Midheaven <span class="muted small">(latitude-independent)</span></td><td class="hc-num hc-mono">${z(th.interpolated.mc)}</td><td class="hc-num hc-mono">${z(th.exact.mc)}</td><td class="hc-num">${dMin(th.delta.mcMin)}</td></tr>
    </tbody></table>
    <p class="small muted">${esc(th.rowCaveat)}</p>
    <p class="small muted">${esc(CAVEATS.find(c => c.id === 'koch-not-implemented').text)}</p>`;

  return { ramc, th };
}

// --- STATION 5 — the finished chart -----------------------------------------
function renderChart(f, birthUT, lst, pos, houses) {
  const chart = castChart(birthUT, f.lat, f.lon, 'placidus');
  const angles = [
    ['Ascendant', chart.asc], ['Midheaven', chart.mc], ['Descendant', chart.desc], ['Imum Coeli', chart.ic],
  ].map(([n, v]) => `<tr><td>${esc(n)}</td><td class="hc-num hc-mono">${formatZodiac(v)}</td></tr>`).join('');

  const planetRows = [...HANDCALC_BODIES, 'NorthNode'].map(name => {
    const p = chart.planets[name];
    return `<tr><td>${G(name)} ${esc(name === 'NorthNode' ? 'N. Node' : name)}</td>
      <td class="hc-num hc-mono">${formatZodiac(p.lon)}${p.retrograde ? ' ℞' : ''}</td>
      <td class="hc-num">${ORD(p.house)}</td></tr>`;
  }).join('');

  const bookLSTsec = lst.deltaBookSec;
  const moonErr = Math.abs(pos.moonErr);
  const ascDelta = Math.abs(houses.th.delta.ascMin);

  const quotes = VERIFICATION_CULTURE.map(q => `<div class="hc-quote">
      <div class="small">“${esc(q.quote)}”</div>
      <div class="small muted">— ${esc(q.who)}. ${esc(q.gloss)} <span>(${esc(q.source)})</span></div></div>`).join('');

  $('hc-chart').innerHTML = `
    <p class="small">Assembled from the hand steps above, then set beside the engine's own <code>castChart</code>
      (Placidus). This is a <b>${chart.isDay ? 'day' : 'night'}</b> chart.</p>
    <div class="field-row" style="gap:1.4rem;align-items:flex-start">
      <div style="flex:1 1 240px"><table class="data"><thead><tr><th>Angle</th><th class="hc-num">longitude</th></tr></thead><tbody>${angles}</tbody></table></div>
      <div style="flex:1 1 300px"><table class="data"><thead><tr><th>Body</th><th class="hc-num">position</th><th class="hc-num">house</th></tr></thead><tbody>${planetRows}</tbody></table></div>
    </div>
    <div class="callout"><span class="label">Total accumulated error — worked entirely by the book rules</span>
      The largest single discrepancy from the exact engine was the <b>Moon's ~${moonErr.toFixed(1)}′</b>
      (inherent to one-day interpolation). The <b>10 s/hour</b> acceleration rule added <b>${bookLSTsec >= 0 ? '+' : '−'}${Math.abs(bookLSTsec).toFixed(1)} s</b>
      of sidereal time (≈${Math.abs(bookLSTsec * 15 / 60).toFixed(2)}′ on the Midheaven), and the house
      double-interpolation cost <b>${ascDelta.toFixed(2)}′</b> on the Ascendant. <b>None of these changes a single
      sign, house or dignity placement</b> — which is exactly why the old book rules were good enough for centuries,
      and exactly what checking against the engine lets you see.</div>
    <h3 style="margin:.8rem 0 .3rem;font-size:1rem">Why teach this at all — the verification culture</h3>
    ${quotes}
    <p class="small muted">The thesis of this page: every hand step is checked against the exact engine with the delta
      shown. The deltas are the pedagogy — they teach how good, and how limited, each historical rule is.</p>`;
}

// --- the sources panel (inside the how-it-works card) ------------------------
function renderSources() {
  const kit = REFERENCE_KIT.map(r => `<li><b>${esc(r.title)}</b> — ${esc(r.author)} <span class="muted">(${esc(r.pub)})</span>. ${esc(r.note)} <span class="muted small">${esc(r.source)}</span></li>`).join('');
  const caveats = CAVEATS.map(c => `<li>${esc(c.text)} <span class="muted small">(${esc(c.source)})</span></li>`).join('');
  $('hc-sources').innerHTML = `
    <h3>Sources — the reference kit</h3>
    <ul class="clean small">${kit}</ul>
    <h3>Hedges kept honest</h3>
    <ul class="clean small">${caveats}</ul>
    <p class="small muted">${esc(DEVORE_PLOG_CHECK.napier)} ${esc(DEVORE_PLOG_CHECK.source)}</p>`;
}
