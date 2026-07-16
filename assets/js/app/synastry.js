// ============================================================================
//  synastry.js (app) — drives pages/synastry.html: the SYNASTRY grid between
//  two nativities, plus the house overlays both ways. All DOM lives here; the
//  pure engine is core/synastry.js (which reuses core/aspects.js's Lilly
//  moieties — no duplicated orb tables).
//
//  HONEST FRAMING: synastry has no demonstrated validity. Jung's 1952 marriage
//  experiment (our Jung wing) is the historical bridge — and its result was
//  NULL. Described, never prescribed.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { synastryGrid, SYNASTRY_BODIES } from '../core/synastry.js';
import { wireCitySelect, toUTC, autolinkResultPanels } from './shared.js';
import { attachPersonPicker } from './person.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const NICE = { NorthNode: 'North Node', SouthNode: 'South Node' };
const nice = p => NICE[p] || p;
const HL = 'background:var(--parchment-2);outline:1px solid var(--gold-2)';
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// last computed report, for the AI panel + a callable snapshot (prasna.js contract)
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentSynastryReport() { return lastReport; }
export function subscribeSynastryReport(cb) { reportSubs.push(cb); }

function fieldsOf(prefix) {
  return { bdate: $(prefix + '-date'), btime: $(prefix + '-time'), boffset: $(prefix + '-offset'), blat: $(prefix + '-lat'), blon: $(prefix + '-lon') };
}
function chartFrom(prefix) {
  const f = fieldsOf(prefix);
  const lat = parseFloat(f.blat.value), lon = parseFloat(f.blon.value);
  if (isNaN(lat) || isNaN(lon) || !f.bdate.value || !f.btime.value) return null;
  const date = toUTC(f.bdate.value, f.btime.value, parseFloat(f.boffset.value) || 0);
  return castChart(date, lat, lon, 'regiomontanus');
}

export function initSynastry() {
  for (const p of ['sa', 'sb']) {
    wireCitySelect($(p + '-city'), $(p + '-lat'), $(p + '-lon'), $(p + '-offset'));
    attachPersonPicker($(p + '-picker-anchor'), fieldsOf(p));
  }
  $('sy-form').addEventListener('submit', e => { e.preventDefault(); compute(); });

  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'synastry',
      getReading: () => lastReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Compute a synastry grid for two charts above first.' },
    });
  }
}

function compute() {
  const A = chartFrom('sa'), B = chartFrom('sb');
  const status = $('sy-status');
  if (!A || !B) { status.textContent = 'Fill the birth date, time and place of BOTH person A and person B.'; return; }
  status.textContent = '';

  let g;
  try { g = synastryGrid(A, B); }
  catch (e) { $('sy-grid').innerHTML = `<p class="muted">Could not compute (${esc(e.message)}).</p>`; return; }

  renderGrid(g);
  renderClassical(g);
  renderOverlays(g);
  try { autolinkResultPanels(['sy-grid', 'sy-classical', 'sy-overlays']); } catch { /* non-fatal */ }

  lastReport = {
    kind: 'synastry',
    charts: {
      A: { birthUTC: A.date.toISOString(), asc: formatLon(A.asc), mc: formatLon(A.mc), isDay: A.isDay },
      B: { birthUTC: B.date.toISOString(), asc: formatLon(B.asc), mc: formatLon(B.mc), isDay: B.isDay },
    },
    counts: g.counts,
    hits: g.hits.map(h => ({ a: h.bodyA, b: h.bodyB, aspect: h.aspect, orb: +Number(h.orb).toFixed(2), applying: h.applying, wholeSign: h.wholeSign })),
    luminaryContacts: g.luminaryContacts.map(h => ({ a: h.bodyA, b: h.bodyB, aspect: h.aspect, orb: +Number(h.orb).toFixed(2) })),
    houseOverlay: {
      aInB: g.houseOverlay.aInB.list.map(o => ({ body: o.body, house: o.house })),
      bInA: g.houseOverlay.bInA.list.map(o => ({ body: o.body, house: o.house })),
    },
    citation: g.citation,
  };
  notifyReport();
}

// --- the aspect grid (rows = A, cols = B) ------------------------------------
function renderGrid(g) {
  const cols = g.cols;
  const head = `<tr><th class="l">A ↓ / B →</th>${cols.map(c => `<th title="${esc(nice(c))} (B)">${G(c)}<br><span class="small">${esc(c.slice(0, 3))}</span></th>`).join('')}</tr>`;
  const body = g.rows.map((r, i) => {
    const tds = g.cells[i].map(cell => {
      if (!cell) return '<td class="muted">·</td>';
      const lum = (cell.bodyA === 'Sun' || cell.bodyA === 'Moon') && (cell.bodyB === 'Sun' || cell.bodyB === 'Moon');
      if (cell.wholeSignOnly) return `<td class="small muted" title="whole-sign ${esc(cell.wholeSign)} (out of orb)">(${esc(cell.wholeSign.slice(0, 3))})</td>`;
      return `<td class="l small"${lum ? ` style="${HL}"` : ''} title="${esc(cell.bodyA)} ${esc(cell.aspect)} ${esc(cell.bodyB)} — orb ${Number(cell.orb).toFixed(2)}°, ${cell.applying ? 'applying' : 'separating'}${cell.wholeSign ? '; whole-sign ' + esc(cell.wholeSign) : ''}">
        ${esc(cell.glyph)}<br><span class="small">${Number(cell.orb).toFixed(1)}°${cell.applying ? '<b>a</b>' : 's'}</span></td>`;
    }).join('');
    return `<tr><th class="l" title="${esc(nice(g.rows[i]))} (A)">${G(r)} ${esc(r.slice(0, 3))}</th>${tds}</tr>`;
  }).join('');
  $('sy-grid').innerHTML = `
    <p class="small">Every aspect <b>between the two charts</b>: rows are <b>A</b>'s bodies, columns are <b>B</b>'s. Each
      cell is the aspect glyph and orb (<b>a</b> = applying, <b>s</b> = separating), Lilly's moieties. A
      <b>(sign)</b> cell is a whole-sign aspect that is out of degree-orb. <b>${g.counts.aspects}</b> aspects in orb.
      Sun/Moon ↔ Sun/Moon cells are highlighted — the classical core (Ptolemy IV.5).</p>
    <div style="overflow-x:auto"><table class="data synastry-grid"><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <p class="small muted">${esc(g.orbNote)}</p>`;
}

// --- the classical (Ptolemaic) core + the hit list ---------------------------
function renderClassical(g) {
  const lum = g.luminaryContacts;
  const hits = g.hits.slice().sort((a, b) => Number(a.orb) - Number(b.orb));
  const hitRows = hits.map(h => `<tr${(h.bodyA === 'Sun' || h.bodyA === 'Moon') && (h.bodyB === 'Sun' || h.bodyB === 'Moon') ? ` style="${HL}"` : ''}>
    <td class="l">${G(h.bodyA)} ${esc(nice(h.bodyA))} <span class="muted">(A)</span></td>
    <td class="l">${esc(h.glyph)} ${esc(h.aspect)}</td>
    <td class="l">${G(h.bodyB)} ${esc(nice(h.bodyB))} <span class="muted">(B)</span></td>
    <td class="l">${Number(h.orb).toFixed(2)}°</td>
    <td>${h.applying ? '<span class="verdict amber">applying</span>' : '<span class="verdict green">separating</span>'}</td>
    <td class="l small">${h.wholeSign ? esc(h.wholeSign) : '—'}</td></tr>`).join('');
  $('sy-classical').innerHTML = `
    <p class="small"><b>The classical core (Ptolemy, Tetrabiblos IV.5):</b> marriages "are lasting when in both the
      genitures the luminaries happen to be in harmonious aspect… and particularly when this comes about by exchange."
      The luminary interaspects (each chart's Sun/Moon to the other's) are the cited kernel; the full grid is a modern
      convention.</p>
    ${lum.length ? `<ul class="clean small">${lum.map(h => `<li><b>${G(h.bodyA)} ${esc(h.bodyA)} (A) ${esc(h.glyph)} ${esc(h.aspect)} ${G(h.bodyB)} ${esc(h.bodyB)} (B)</b> — orb ${Number(h.orb).toFixed(2)}°${(h.aspect === 'Trine' || h.aspect === 'Sextile') ? ' <span class="verdict green">harmonious</span>' : ''}</li>`).join('')}</ul>`
      : '<p class="small muted">No luminary interaspect within orb between the two charts — by the Ptolemaic rule this pairing shows no marital-harmony testimony from the lights (as most chance pairings do not).</p>'}
    <h3>All cross-aspects, closest first</h3>
    ${hitRows ? `<table class="data"><thead><tr><th class="l">Person A</th><th class="l">Aspect</th><th class="l">Person B</th><th class="l">Orb</th><th>Phase</th><th class="l">Whole-sign</th></tr></thead><tbody>${hitRows}</tbody></table>` : '<p class="small muted">No cross-aspects within orb.</p>'}`;
}

// --- house overlays both ways ------------------------------------------------
function renderOverlays(g) {
  const block = (title, ov, hostLabel) => {
    const rows = ov.list.map(o => `<tr><td class="l">${G(o.body)} ${esc(o.body)}</td><td class="l small">${esc(o.label)}</td><td>${ordinal(o.house)}</td></tr>`).join('');
    const byHouse = Object.entries(ov.byHouse).filter(([, arr]) => arr.length)
      .map(([h, arr]) => `<span class="pill">${ordinal(Number(h))}: ${arr.map(a => G(a) + a.slice(0, 2)).join(' ')}</span>`).join(' ');
    return `<div><h3>${title}</h3>
      <p class="small">${esc(hostLabel)} — <b>${ov.total}</b> planets placed.</p>
      <table class="data"><thead><tr><th class="l">Planet</th><th class="l">At</th><th>House</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="small" style="margin-top:.3rem">${byHouse}</p></div>`;
  };
  $('sy-overlays').innerHTML = `
    <p class="small">Where each person's planets fall in the <b>other's houses</b> — the areas of life each animates for
      the other. Whole counts: each set of the seven planets sums to seven placements.</p>
    <div class="grid cols-2">
      ${block("A's planets in B's houses", g.houseOverlay.aInB, "Person A's seven planets, read against Person B's Regiomontanus cusps")}
      ${block("B's planets in A's houses", g.houseOverlay.bInA, "Person B's seven planets, read against Person A's Regiomontanus cusps")}
    </div>`;
}
