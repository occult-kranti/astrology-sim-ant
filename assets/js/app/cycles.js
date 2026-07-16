// ============================================================================
//  cycles.js (app) — drives pages/cycles.html. All DOM lives here; the pure
//  engine is core/cycles.js and the cited data core/data/cycles-data.js.
//
//  Sections: (1) the Jupiter–Saturn conjunction scanner with trigon runs and
//  the doctrinal mean-series overlay; (2) the "conjunctions that made history"
//  cards with epistemic-status labels and cast-this-moment links; (3) the
//  honest eclipse finder (classical ecliptic limits + engine ground truth,
//  global claims only); (4) the Babylonian panel.
//
//  HONEST FRAMING: computed astronomy is shown as astronomy; historical
//  meanings are shown as documented beliefs with citations — described,
//  never prescribed. Eclipse wording is locked to "somewhere on Earth".
// ============================================================================
import { conjunctionsBetween, triplicityRuns, meanConjunctionSeries, eclipseNear } from '../core/cycles.js';
import { formatLon } from '../core/astro.js';
import { eraAccuracy, julianToGregorian, isoDate, utcDate } from '../core/calendar.js';
import {
  CYCLE_CONSTANTS, DOCTRINE, KEPLER, PARIS_1348, BETHLEHEM,
  GOLDEN_CONJUNCTIONS, ECLIPSE_LIMITS, BABYLON,
} from '../core/data/cycles-data.js';
import { autolinkResultPanels } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const fmtUT = d => `${isoDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())} UT`;
const fmtDay = d => isoDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
const triTag = t => `<span class="cy-tri cy-tri-${esc(t)}">${esc(t)}</span>`;
const YEAR_MIN = -1999, YEAR_MAX = 3000;
let scanToken = 0; // cancels a stale chunked scan if the user re-submits

// The last computed sweep, for the AI panel (kind 'cycles' in the shared
// divination assistant): the scan portion set by renderConjunctions, the
// eclipse portion by runEclipse. Subscribers get pinged on every update.
const cyclesReport = { kind: 'cycles', scan: null, eclipse: null };
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(cyclesReport); } catch { /* ignore */ } } };
export function currentCyclesReport() { return cyclesReport; }

export function initCycles() {
  // --- section 1: the scanner ------------------------------------------------
  $('cy-form').addEventListener('submit', e => { e.preventDefault(); runScan(); });
  $('cy-mean-toggle').addEventListener('change', () => {
    const mean = $('cy-mean-out');
    if (mean) mean.style.display = $('cy-mean-toggle').checked ? '' : 'none';
  });

  // --- section 2: history cards ----------------------------------------------
  renderHistory();

  // --- section 3: the eclipse finder ------------------------------------------
  const now = new Date();
  $('cy-ecl-date').value = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  $('cy-ecl-form').addEventListener('submit', e => { e.preventDefault(); runEclipse(); });

  // --- section 4: Babylon -----------------------------------------------------
  renderBabylon();

  // --- the AI panel: the shared divination assistant, historian voice ---------
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'cycles',
      getReading: () => cyclesReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: {
        aboutLabel: 'About this historian',
        botLabel: 'Historian',
      },
    });
  }

  // first paint: the default 1500–2100 scan and today's syzygies
  runScan();
  runEclipse();
}

// ---------------------------------------------------------------------------
//  Section 1 — the conjunction scanner
// ---------------------------------------------------------------------------
function clampYear(v, fallback) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(YEAR_MAX, Math.max(YEAR_MIN, n));
}

function worstEra(fromY, toY) {
  const rank = { casting: 0, study: 1, illustrative: 2, refuse: 3 };
  const a = eraAccuracy(fromY), b = eraAccuracy(toY);
  return rank[a.grade] >= rank[b.grade] ? a : b;
}

function eraBadge(fromY, toY) {
  const acc = worstEra(fromY, toY);
  if (acc.grade === 'casting') { $('cy-era-badge').innerHTML = ''; return; }
  $('cy-era-badge').innerHTML = `<div class="callout"><span class="label">era accuracy — ${esc(acc.label)}</span>
    Part of this range lies outside the engine's casting-grade era (1600–2200). ${esc(acc.note)}</div>`;
}

async function runScan() {
  let fromY = clampYear($('cy-from').value, 1500);
  let toY = clampYear($('cy-to').value, 2100);
  if (toY < fromY) [fromY, toY] = [toY, fromY];
  $('cy-from').value = fromY; $('cy-to').value = toY;
  eraBadge(fromY, toY);

  const token = ++scanToken;
  const status = $('cy-scan-status');
  const out = $('cy-conj-out');
  out.innerHTML = '<p class="muted small">Scanning…</p>';

  // Chunked scan (~120-yr slices yielding to the UI) so even a full
  // −1999…3000 sweep never freezes the page.
  const hits = [];
  try {
    for (let y = fromY; y <= toY; y += 120) {
      if (token !== scanToken) return;                       // superseded
      const yEnd = Math.min(y + 120, toY + 1);
      status.textContent = `scanning ${y}…${Math.min(yEnd, YEAR_MAX)}`;
      // the era guard refuses year 3001, so a scan ending AT the max year
      // closes on 3000-12-31 rather than 3001-01-01
      const chunkEnd = yEnd > YEAR_MAX ? utcDate(YEAR_MAX, 12, 31, 23) : utcDate(yEnd, 1, 1, 0);
      const chunk = conjunctionsBetween(utcDate(y, 1, 1, 0), chunkEnd);
      for (const c of chunk) {
        const prev = hits[hits.length - 1];
        if (!prev || Math.abs(c.date - prev.date) > 2 * 86400000) hits.push(c); // dedupe chunk seams
      }
      await new Promise(r => setTimeout(r, 0));               // let the page breathe
    }
  } catch (err) {
    status.textContent = '';
    out.innerHTML = `<p class="small"><b>Could not scan:</b> ${esc(err.message)}</p>`;
    return;
  }
  if (token !== scanToken) return;
  status.textContent = '';
  renderConjunctions(hits, fromY, toY);
}

function renderConjunctions(hits, fromY, toY) {
  const runs = triplicityRuns(hits);
  const shifts = runs.length ? runs.length - 1 : 0;

  // annotate: first crossing of each run = a trigon event row
  const eventOf = new Map();
  runs.forEach((r, i) => {
    if (i === 0) return;
    const first = r.conjunctions[0];
    eventOf.set(first, r.reversion
      ? `<span class="cy-event rev">one-off reversion → ${esc(r.triplicity)}</span>`
      : `<span class="cy-event">⇧ trigon shift → ${esc(r.triplicity)}</span>`);
  });

  const retroMarks = c => {
    const m = [];
    if (c.jupiterRetrograde) m.push('♃℞');
    if (c.saturnRetrograde) m.push('♄℞');
    return m.length ? `<span class="cy-retro">${m.join(' ')}</span>` : '<span class="muted">direct</span>';
  };

  const rows = hits.map(c => {
    const ev = eventOf.get(c) || '';
    return `<tr${ev ? ' class="cy-shift"' : ''}>
      <td class="l">${esc(fmtUT(c.date))}</td>
      <td class="l">${esc(formatLon(c.lon))}</td>
      <td>${triTag(c.triplicity)}</td>
      <td>${retroMarks(c)}</td>
      <td class="num">${c.sep}′</td>
      <td class="l">${ev}</td></tr>`;
  }).join('');

  const meanHTML = renderMeanSeries(fromY, toY);
  $('cy-conj-out').innerHTML = `
    <p class="small">${hits.length} geocentric conjunction${hits.length === 1 ? '' : 's'} (longitude crossings,
      tropical of-date) in ${fromY}…${toY} — ${shifts} triplicity change${shifts === 1 ? '' : 's'}
      (highlighted). Runs of three passes within ~7 months are <b>triple conjunctions</b>, born of retrogradation
      (℞). “Min sep” is the closest the two planets actually came (great-circle, latitude included) — they pass
      near each other, never through.</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Great-conjunction timeline (scrollable)">
    <table class="data"><thead><tr>
      <th class="l">Longitude crossing</th><th class="l">Position (of date)</th><th>Trigon</th>
      <th>Motion</th><th class="num">Min sep</th><th class="l">Trigon event</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6">No conjunctions in this range.</td></tr>'}</tbody></table></div>
    ${meanHTML}
    <p class="cy-cite">Verified against ${esc(GOLDEN_CONJUNCTIONS[1].cite)}</p>`;
  const mean = $('cy-mean-out');
  if (mean) mean.style.display = $('cy-mean-toggle').checked ? '' : 'none';
  try { autolinkResultPanels(['cy-conj-out']); } catch { /* non-fatal */ }
  cyclesReport.scan = { fromY, toY, conjunctions: hits, runs };
  notifyReport();
}

function renderMeanSeries(fromY, toY) {
  let series;
  try { series = meanConjunctionSeries(fromY, toY); } catch { return ''; }
  let prevTri = null;
  const rows = series.map(m => {
    const shift = prevTri !== null && m.triplicity !== prevTri;
    prevTri = m.triplicity;
    return `<tr${shift ? ' class="cy-shift"' : ''}>
      <td>${m.year}</td><td class="l">${esc(formatLon(m.lon))}</td><td>${triTag(m.triplicity)}</td>
      <td class="l">${shift ? '<span class="cy-event">⇧ triplicity shift (doctrinal)</span>' : ''}</td></tr>`;
  }).join('');
  return `<div id="cy-mean-out" style="display:none">
    <h3>The doctrinal overlay — Abū Maʿshar's MEAN conjunctions</h3>
    <p class="small">The medieval doctrine ran on an idealized clock: exactly one <b>mean</b> conjunction every
      ${CYCLE_CONSTANTS.synodicJulianYears} Julian years, each +${CYCLE_CONSTANTS.meanAdvance.tropicalDeg}° (tropical)
      from the last — twelve per triplicity (${CYCLE_CONSTANTS.perTrigon.doctrinalYears} years), full cycle
      ${CYCLE_CONSTANTS.fullReturn.medievalYears} years by medieval convention (Kepler:
      ${CYCLE_CONSTANTS.fullReturn.keplerYears} years, ${CYCLE_CONSTANTS.fullReturn.keplerConjunctions} conjunctions).
      It never produces a triple. Compare its tidy shifts with the computed timeline above — where the sky
      retrogrades, wanders early into the next trigon (1980–81 Libra) or doubles back, the doctrine's clock keeps
      ticking regardless. That divergence is the point.</p>
    <table class="data"><thead><tr><th>Year (mean)</th><th class="l">Mean position</th><th>Trigon</th><th class="l"></th></tr></thead>
      <tbody>${rows}</tbody></table>
    <p class="cy-cite">${esc(CYCLE_CONSTANTS.cite)}</p></div>`;
}

// ---------------------------------------------------------------------------
//  Section 2 — conjunctions that made history
// ---------------------------------------------------------------------------
function castLink(dateIso, time, lat, lon, place, year) {
  const acc = eraAccuracy(year);
  const url = `workbench.html?date=${encodeURIComponent(dateIso)}&time=${encodeURIComponent(time)}&offset=0&lat=${lat}&lon=${lon}`;
  return `<p style="margin-bottom:0"><a class="btn sm" href="${url}">✶ Cast this moment (${esc(place)})</a>
    <span class="pill" title="${esc(acc.note)}">${esc(acc.label)}</span></p>`;
}

// epistemic status label → the promoted site-wide badge triad (plan §1.2.4):
// belief→conspiracy wash, debunked→debunked, disputed→disputed, astronomy→ok.
const HIST_BADGE = { belief: 'con', debunked: 'deb', disputed: 'disp', astronomy: 'ok' };
function histCard(status, statusClass, title, bodyHTML, cite, footerHTML = '') {
  return `<article class="card cy-hist">
    <span class="badge badge--${HIST_BADGE[statusClass] || 'plain'}">${esc(status)}</span>
    <h3>${esc(title)}</h3>
    ${bodyHTML}
    <p class="cy-cite">${esc(cite)}</p>
    ${footerHTML}</article>`;
}

function renderHistory() {
  const g2020 = GOLDEN_CONJUNCTIONS[0];
  const parisG = julianToGregorian(PARIS_1348.julianDate.y, PARIS_1348.julianDate.m, PARIS_1348.julianDate.d);
  const parisIso = isoDate(parisG.y, parisG.m, parisG.d);

  $('cy-history-cards').innerHTML = [
    // Abū Maʿshar — the doctrine itself
    histCard('documented belief', 'belief', DOCTRINE.title,
      `<p class="small">${esc(DOCTRINE.author)}. ${esc(DOCTRINE.basis)}</p>
       <ul class="clean small">${DOCTRINE.tiers.map(t =>
        `<li><b>${esc(t.every)}</b> — ${esc(t.name)}: ${esc(t.signification)}.</li>`).join('')}</ul>
       <p class="small muted">${DOCTRINE.flags.map(esc).join('<br>')}</p>`,
      DOCTRINE.cite),

    // Kepler 1603
    histCard('documented belief', 'belief', KEPLER.title,
      `<p class="small">${esc(KEPLER.work)}. ${esc(KEPLER.conjunction.note)}</p>
       <ul class="clean small">${KEPLER.claims.map(c => `<li>${esc(c)}</li>`).join('')}</ul>`,
      KEPLER.cite,
      castLink(KEPLER.conjunction.date, '06:59', KEPLER.conjunction.place.lat, KEPLER.conjunction.place.lon,
        KEPLER.conjunction.place.name, 1603)),

    // Paris 1348
    histCard('documented belief — debunked cause', 'debunked', PARIS_1348.title,
      `<blockquote class="lilly" style="margin:.4rem 0">“${esc(PARIS_1348.quote)}”</blockquote>
       <p class="small">${esc(PARIS_1348.quoteNote)} ${esc(PARIS_1348.reasoning)}</p>
       <p class="small"><b>The sky checks out:</b> at the stated hour (${esc(PARIS_1348.enginePositions.calendar)})
         the engine puts Saturn at ${esc(PARIS_1348.enginePositions.saturn)}, Jupiter at
         ${esc(PARIS_1348.enginePositions.jupiter)}, Mars at ${esc(PARIS_1348.enginePositions.mars)};
         ${esc(PARIS_1348.enginePositions.exactConjunction)}. <b>The cause does not:</b>
         ${esc(PARIS_1348.actualCause)}</p>`,
      PARIS_1348.cite,
      castLink(parisIso, '13:00', PARIS_1348.place.lat, PARIS_1348.place.lon,
        `${PARIS_1348.place.name}, Julian ${PARIS_1348.julianDate.y}-03-20 → Gregorian ${parisIso}`, PARIS_1348.julianDate.y)),

    // Bethlehem 7 BCE
    histCard('disputed', 'disputed', BETHLEHEM.title,
      `<p class="small">Three passes, all in Pisces (Julian calendar; engine-verified):</p>
       <ul class="clean small">${BETHLEHEM.passes.map(p =>
        `<li><b>${esc(p.date)}</b> — ${esc(p.position)}, separation ${p.sepArcmin}′${p.retro ? ', both retrograde' : ''}</li>`).join('')}</ul>
       <p class="small">${esc(BETHLEHEM.separationNote)} ${esc(BETHLEHEM.babylonNote)}</p>
       <p class="small muted">${esc(BETHLEHEM.spreadFlag)}</p>
       <p class="small muted" style="margin-bottom:0">Era tier: <span class="pill"
         title="${esc(eraAccuracy(BETHLEHEM.yearAstronomical).note)}">${esc(eraAccuracy(BETHLEHEM.yearAstronomical).label)}</span>
         — year −6 lies below the date pickers' range, so no cast link is offered.</p>`,
      BETHLEHEM.cite),

    // 2020 — computed astronomy
    histCard('computed astronomy', 'astronomy', g2020.label,
      `<p class="small">${esc(g2020.note)} It closed the 1980–2000 trigon story: the earth series that began in 1842
        (after the 1802 Virgo entry and 1821 Aries reversion) ended, and the air series opened in Aquarius —
        exactly the kind of shift Abū Maʿshar's tables were built to flag, carrying no demonstrated meaning.</p>`,
      g2020.cite,
      castLink(g2020.date, '18:26', 51.5074, -0.1278, 'London', 2020)),
  ].join('');
  try { autolinkResultPanels(['cy-history-cards']); } catch { /* non-fatal */ }
}

// ---------------------------------------------------------------------------
//  Section 3 — the eclipse finder (global claims only)
// ---------------------------------------------------------------------------
// eclipse-possibility verdict → the site-wide verdict badge triad (gravity scale).
const V_BADGE = { certain: 'ok', possible: 'warn', impossible: 'bad' };
const V = v => `<span class="badge badge--${V_BADGE[v] || 'plain'}">${esc(v)}</span>`;

function solarSentence(r) {
  const L = ECLIPSE_LIMITS.solar;
  if (r.verdict === 'certain') return `a solar eclipse <b>had</b> to occur somewhere on Earth at this new moon (D &lt; ${L.certainDeg}°).`;
  if (r.verdict === 'impossible') return `no solar eclipse was possible anywhere on Earth (D &gt; ${L.impossibleDeg}°).`;
  return `a solar eclipse was <b>possible</b> somewhere on Earth (${L.certainDeg}° ≤ D ≤ ${L.impossibleDeg}° — the uncertain band; this is precisely the “eclipse possibility” Babylonian astronomers predicted).`;
}
function lunarSentence(r) {
  const L = ECLIPSE_LIMITS.lunarAny;
  if (r.verdictAny === 'certain') return `a lunar eclipse (of some type, penumbral included) <b>had</b> to occur, visible from a portion of Earth (D &lt; ${L.certainDeg}°).`;
  if (r.verdictAny === 'impossible') return `no lunar eclipse of any type was possible (D &gt; ${L.impossibleDeg}°).`;
  return `a lunar eclipse was <b>possible</b> for a portion of Earth (${L.certainDeg}°–${L.impossibleDeg}° — the uncertain band).`;
}
function groundTruthSentence(gt, kindWord) {
  if (gt.sameSyzygy) {
    return `confirms a <b>${esc(gt.kind)}</b> ${kindWord} eclipse at this very syzygy — peak ${esc(fmtUT(gt.peak))},
      somewhere on Earth (no claim about visibility from any particular place).`;
  }
  return `finds <b>no eclipse at this syzygy</b> — the search skips it; the next ${kindWord} eclipse it finds is a
    ${esc(gt.kind)} on ${esc(fmtDay(gt.peak))}.`;
}
const layersAgree = r => (r.verdict === 'impossible') === !r.groundTruth.sameSyzygy;

function runEclipse() {
  const out = $('cy-eclipse-out');
  const val = $('cy-ecl-date').value;
  if (!val) { out.innerHTML = '<p class="small muted">Pick a date first.</p>'; return; }
  const [y, m, d] = val.split('-').map(Number);
  let r;
  try { r = eclipseNear(utcDate(y, m, d, 12)); }
  catch (err) { out.innerHTML = `<p class="small"><b>Could not compute:</b> ${esc(err.message)}</p>`; return; }

  const s = r.solar, l = r.lunar;
  const eraNote = r.era.grade !== 'casting'
    ? `<div class="callout"><span class="label">era accuracy — ${esc(r.era.label)}</span> ${esc(r.era.note)}</div>` : '';

  out.innerHTML = `${eraNote}
  <div class="grid cols-2">
    <div class="cy-syzygy"><h3>☉ New moon — solar check</h3>
      <p class="small"><b>${esc(fmtUT(s.syzygy))}</b> · Moon ${esc(formatLon(s.moonLon))} ·
        node distance <b>D = ${s.nodeDistanceDeg}°</b></p>
      <p class="small">Classical ecliptic limits: ${V(s.verdict)} — ${solarSentence(s)}</p>
      <p class="small">Ground truth (global search): ${groundTruthSentence(s.groundTruth, 'solar')}</p>
      <p class="cy-agree">${layersAgree(s) ? '✓ the two layers agree.' : '△ the layers differ — the syzygy sits in or near the uncertain band; the ground-truth search decides.'}</p>
    </div>
    <div class="cy-syzygy"><h3>☽ Full moon — lunar check</h3>
      <p class="small"><b>${esc(fmtUT(l.syzygy))}</b> · Moon ${esc(formatLon(l.moonLon))} ·
        node distance <b>D = ${l.nodeDistanceDeg}°</b></p>
      <p class="small">Any type (NASA limits): ${V(l.verdictAny)} — ${lunarSentence(l)}</p>
      <p class="small">Classical <em>umbral</em> limits (9°30′ / 12°15′): ${V(l.verdictUmbral)} —
        for a partial/total (umbral) eclipse specifically.</p>
      <p class="small">Ground truth (global search): ${groundTruthSentence(l.groundTruth, 'lunar')}</p>
      <p class="cy-agree">${layersAgree(l) ? '✓ the two layers agree.' : '△ the layers differ — the syzygy sits in or near the uncertain band; the ground-truth search decides.'}</p>
    </div>
  </div>
  <p class="small muted" style="margin-top:.6rem">${esc(ECLIPSE_LIMITS.framing)}</p>
  <p class="small muted">${esc(ECLIPSE_LIMITS.classicalSolarDiscrepancy.flag)}</p>
  <p class="cy-cite">${esc(ECLIPSE_LIMITS.cite)}</p>`;
  try { autolinkResultPanels(['cy-eclipse-out']); } catch { /* non-fatal */ }
  cyclesReport.eclipse = r;
  notifyReport();
}

// ---------------------------------------------------------------------------
//  Section 4 — Babylon
// ---------------------------------------------------------------------------
function renderBabylon() {
  $('cy-babylon').innerHTML = BABYLON.map(b => `<article class="card">
    <h3>${esc(b.title)}</h3>
    <p class="small">${esc(b.text)}</p>
    <p class="cy-cite">${esc(b.cite)}</p></article>`).join('');
  try { autolinkResultPanels(['cy-babylon']); } catch { /* non-fatal */ }
}
