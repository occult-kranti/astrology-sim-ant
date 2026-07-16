// ============================================================================
//  rasa.js (app) — drives pages/rasa.html: the Indian alchemy (rasaśāstra) &
//  yantra-mathematics wing. All computation is in the pure core
//  (core/yantra.js + data/rasa-data.js); this file owns the DOM only.
//
//   • the textual chain (with the Nāgārjuna "ghost" & the contested datings)
//   • the 18 saṃskāras + the rasaśālā apparatus (history of chemistry only)
//   • the nine navagraha squares, each with a LIVE validateYantra() badge
//   • the dated classical squares (Chautisa's most-perfect properties checked live)
//   • a kaṭapayādi encoder/decoder
//   • the 81-cell Sarvatobhadra Chakra cast for a chosen date (joins the pañcāṅga)
//
//  NO assistant panel. HONEST FRAMING throughout — described, never prescribed.
// ============================================================================
import {
  validateYantra, validateMostPerfect, katapayadiDecode, katapayadiEncode,
  buildSarvatobhadra, sarvatobhadraVedha,
} from '../core/yantra.js';
import {
  TEXTS, TEXTS_NOTE, SAMSKARAS, SAMSKARAS_NOTE, APPARATUS, CLAIMS,
  NAVAGRAHA_YANTRAS, NAVAGRAHA_NOTE, CLASSICAL_SQUARES, KATAPAYADI,
} from '../core/data/rasa-data.js';
import { castChart } from '../core/astro.js';
import { castVedic } from '../core/vedic.js';
import { wireCitySelect, toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const flag = (title) => `<span class="ry-flag" title="${esc(title)}">⚑</span>`;

// ---------------------------------------------------------------------------
export function initRasa() {
  renderTexts();
  renderSamskaras();
  renderApparatus();
  renderNavagraha();
  renderClassical();
  renderKatapayadi();
  wireSBC();
  try { autolinkResultPanels(['ry-texts', 'ry-samskaras', 'ry-apparatus', 'ry-navagraha-note', 'ry-classical', 'hiw-rasa']); } catch { /* non-fatal */ }
}

// --- 1. the textual chain ----------------------------------------------------
function renderTexts() {
  const rows = TEXTS.map(t => {
    const dispute = t.contested
      ? ` ${flag(t.contested.flag + ' — ' + t.contested.detail)}<div class="small" style="color:var(--gold)">${esc(t.contested.flag)}</div>`
      : '';
    return `<tr>
      <td class="l"><b>${esc(t.title)}</b><div class="small muted">${esc(t.author)}</div></td>
      <td class="l small">${esc(t.date)}</td>
      <td class="l small">${esc(t.role)}${dispute}</td>
      <td class="l small muted">${esc(t.cite)}</td>
    </tr>`;
  }).join('');
  $('ry-texts').innerHTML = `
    <div style="overflow-x:auto"><table class="data">
      <thead><tr><th class="l">Text</th><th class="l">Date</th><th class="l">Role &amp; dispute</th><th class="l">Source</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="small muted" style="margin:.5rem 0 0">${esc(TEXTS_NOTE)}</p>
    <p class="small muted" style="margin:.3rem 0 0"><b>Claim vs chemistry:</b> the programme was <i>${esc(CLAIMS.aphorism.iast)}</i> —
      ${esc(CLAIMS.aphorism.gloss)} ${esc(CLAIMS.chemistry)} <span class="muted">(${esc(CLAIMS.chemistryCite)})</span></p>`;
}

// --- 2. the 18 saṃskāras -----------------------------------------------------
function renderSamskaras() {
  const groupLabel = { 'aṣṭa': 'aṣṭasaṃskāra (1–8: fit for medicine)', 'jāraṇa': 'jāraṇa group (mica/metal "digestion")', 'vedha': 'toward vedha (transmutation)' };
  const rows = SAMSKARAS.map(s => {
    const cls = s.group === 'aṣṭa' ? 'ry-ok' : s.group === 'vedha' ? 'ry-bad' : '';
    return `<tr${s.n === 8 ? ' style="border-bottom:2px solid var(--gold)"' : ''}>
      <td>${s.n}</td>
      <td class="l"><b>${esc(s.iast)}</b> <span class="small muted">${esc(s.en)}</span></td>
      <td class="l small">${esc(s.fn)}</td>
      <td class="l"><span class="ry-badge ${cls}">${esc(s.group)}</span></td>
    </tr>`;
  }).join('');
  $('ry-samskaras').innerHTML = `
    <div style="overflow-x:auto"><table class="data">
      <thead><tr><th>#</th><th class="l">Saṃskāra</th><th class="l">Function (historical record)</th><th class="l">Class</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="small muted" style="margin:.5rem 0 0">Groups: ${Object.values(groupLabel).map(esc).join(' · ')}.
      ${esc(SAMSKARAS_NOTE)}</p>
    <p class="small muted" style="margin:.3rem 0 0"><b>Source:</b> ${esc(SAMSKARAS[0].cite)}</p>`;
}

// --- 3. the apparatus --------------------------------------------------------
function renderApparatus() {
  const rows = APPARATUS.map(a => `<tr>
    <td class="l"><b>${esc(a.name)}</b></td>
    <td class="l small">${esc(a.ref)}</td>
    <td class="l small">${esc(a.fn)}</td></tr>`).join('');
  $('ry-apparatus').innerHTML = `
    <div style="overflow-x:auto"><table class="data">
      <thead><tr><th class="l">Yantra</th><th class="l">Verse ref</th><th class="l">Function</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="small muted" style="margin:.5rem 0 0"><b>Source:</b> ${esc(APPARATUS[0].cite)}</p>`;
}

// --- grid renderer (shared by navagraha + classical) ------------------------
function gridHTML(grid, { markDiag = true } = {}) {
  const n = grid.length;
  let cells = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const onDiag = markDiag && (r === c || r === n - 1 - c);
    cells += `<div class="yc${onDiag ? ' diag' : ''}">${grid[r][c]}</div>`;
  }
  return `<div class="yg" style="grid-template-columns:repeat(${n}, 1fr)">${cells}</div>`;
}

// --- 4. the nine navagraha yantras ------------------------------------------
function renderNavagraha() {
  $('ry-navagraha').innerHTML = NAVAGRAHA_YANTRAS.map(y => {
    const v = validateYantra(y.grid);
    const badge = v.ok
      ? `<span class="ry-badge ry-ok" title="rows ${v.lines.rows} · columns ${v.lines.cols} · diagonals ${v.lines.diagonals}, all = ${v.constant}">✓ verified: rows/cols/diagonals all = ${v.constant}</span>`
      : `<span class="ry-badge ry-bad">✗ INVALID: ${esc(v.errors[0] || '')}</span>`;
    return `<div class="ry-card">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:.6rem;margin-bottom:.4rem">
        <b>${esc(y.graha)}</b><span class="small muted">${esc(y.en)} · total ${y.total}</span></div>
      ${gridHTML(y.grid)}
      <div style="margin-top:.4rem">${badge}</div>
      <div class="small" style="margin-top:.3rem"><span class="ry-badge ry-prov-modern" title="${esc(y.provenance)}">modern printed tradition</span></div>
    </div>`;
  }).join('');
  $('ry-navagraha-note').innerHTML = `${esc(NAVAGRAHA_NOTE)} <span class="muted">Source: ${esc(NAVAGRAHA_YANTRAS[0].cite)}</span>`;
}

// --- 5. the dated classical squares -----------------------------------------
function renderClassical() {
  $('ry-classical').innerHTML = CLASSICAL_SQUARES.map(s => {
    const provClass = 'ry-prov-classical';
    const dispute = s.contested ? ` ${flag(s.contested.flag + ' — ' + s.contested.detail)}` : '';
    let gridBlock, checkBlock;
    if (s.grid) {
      gridBlock = gridHTML(s.grid);
      if (s.mostPerfect) {
        const mp = validateMostPerfect(s.grid);
        checkBlock = mp.ok
          ? `<span class="ry-badge ry-ok" title="magic lines ${mp.checks.magic} · broken diagonals ${mp.checks.brokenDiagonals} · 2×2 blocks ${mp.checks.blocks2x2} · corner quads ${mp.checks.cornerQuads}">✓ most-perfect: rows·cols·diagonals·broken-diagonals·2×2-blocks·corner-quads all = ${mp.constant}</span>`
          : `<span class="ry-badge ry-bad">✗ ${esc(mp.errors[0] || '')}</span>`;
      } else {
        const v = validateYantra(s.grid);
        checkBlock = v.ok
          ? `<span class="ry-badge ry-ok">✓ verified: rows/cols/diagonals all = ${v.constant}</span>`
          : `<span class="ry-badge ry-bad">✗ ${esc(v.errors[0] || '')}</span>`;
      }
    } else {
      gridBlock = `<p class="small muted" style="margin:0">No single cell arrangement is asserted by the source — the method and constant (${s.constant}) are recorded, not a fabricated grid.</p>`;
      checkBlock = `<span class="ry-badge" title="method/constant only">constant ${s.constant} (no asserted grid)</span>`;
    }
    return `<div class="ry-card" style="margin-bottom:.8rem">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:.6rem;flex-wrap:wrap;margin-bottom:.4rem">
        <b>${esc(s.name)}</b>
        <span class="small"><span class="ry-badge ${provClass}">classical · ${esc(s.date)}</span>${dispute}</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
        <div>${gridBlock}</div>
        <div style="flex:1 1 260px;min-width:240px">
          <p class="small" style="margin:0 0 .4rem">${esc(s.properties)}</p>
          <div>${checkBlock}</div>
        </div></div>
      <p class="small muted" style="margin:.4rem 0 0">${esc(s.cite)}</p>
    </div>`;
  }).join('');
}

// --- 6. the kaṭapayādi calculator -------------------------------------------
function renderKatapayadi() {
  const tbl = KATAPAYADI.table.map(row =>
    `<tr><td><b>${row.digit}</b></td><td class="l">${row.syllables.map(esc).join(' · ')}</td></tr>`).join('');
  const examples = KATAPAYADI.examples.map(ex =>
    `<li><code>${esc(ex.input.length > 30 ? ex.input.slice(0, 30) + '…' : ex.input)}</code> → <b>${esc(ex.value)}</b> <span class="muted">— ${esc(ex.gloss)}</span></li>`).join('');
  $('ry-kata-table').innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1.2rem;align-items:flex-start">
      <div style="flex:0 1 320px"><table class="data"><thead><tr><th>Digit</th><th class="l">Consonants (with a vowel)</th></tr></thead><tbody>${tbl}</tbody></table></div>
      <div style="flex:1 1 300px">
        <p class="small" style="margin-top:0"><b>Rules.</b> ${KATAPAYADI.rules.map(esc).join(' ')}</p>
        <p class="small"><b>Verified examples:</b></p><ul class="clean small">${examples}</ul>
        <p class="small muted">Earliest use: ${esc(KATAPAYADI.earliestUse)} Defining verse: ${esc(KATAPAYADI.definingVerse)}</p>
        <p class="small muted">${esc(KATAPAYADI.cite)}</p>
      </div></div>`;
  const run = () => {
    const word = $('ry-kata-in').value.trim();
    const num = $('ry-kata-num').value.trim();
    let out = '';
    if (word) {
      const d = katapayadiDecode(word);
      const steps = d.trace.map(t => `${esc(t.syllable)} <span class="muted">(${t.counted === '(standalone vowel)' ? '0' : esc(t.counted) + '=' + t.digit})</span>`).join(' · ');
      out += `<div class="ry-card" style="margin-top:.6rem"><p class="small" style="margin:0"><b>Decode</b> “${esc(d.input)}” →
        digits in order [${d.digits.join(', ')}], read right-to-left → <b style="color:var(--gold);font-size:1.05rem">${esc(d.value)}</b></p>
        <p class="small muted" style="margin:.3rem 0 0">${steps}</p>
        ${d.ignoredTrailingConsonants.length ? `<p class="small muted" style="margin:.2rem 0 0">Ignored (vowelless): ${d.ignoredTrailingConsonants.map(esc).join(', ')}</p>` : ''}</div>`;
    }
    if (num && /\d/.test(num)) {
      const e = katapayadiEncode(num);
      const back = katapayadiDecode(e.syllables).value;
      out += `<div class="ry-card" style="margin-top:.6rem"><p class="small" style="margin:0"><b>Encode</b> ${esc(e.input)} →
        <b style="color:var(--link)">${esc(e.syllables)}</b> <span class="muted">(round-trips: decode → ${esc(back)})</span></p>
        <p class="small muted" style="margin:.3rem 0 0">${esc(e.note)}</p>
        <p class="small muted" style="margin:.2rem 0 0">Per digit (leftward): ${e.alternatives.map(a => `${a.digit}:{${a.choices.map(esc).join('/')}}`).join(' · ')}</p></div>`;
    }
    $('ry-kata-out').innerHTML = out;
  };
  $('ry-kata-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  $('ry-kata-in').addEventListener('input', run);
  $('ry-kata-num').addEventListener('input', run);
  $('ry-kata-in').value = 'dhīra';
  run();
}

// --- 7. the Sarvatobhadra Chakra --------------------------------------------
const WD_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let SBC = null;

function wireSBC() {
  SBC = buildSarvatobhadra();
  const istNow = new Date(Date.now() + 5.5 * 3600000).toISOString();
  $('ry-sbc-date').value = istNow.slice(0, 10);
  $('ry-sbc-time').value = istNow.slice(11, 16);
  $('ry-sbc-offset').value = 5.5;
  $('ry-sbc-lat').value = 28.6139; $('ry-sbc-lon').value = 77.209;   // Delhi
  wireCitySelect($('ry-sbc-city'), $('ry-sbc-lat'), $('ry-sbc-lon'), $('ry-sbc-offset'),
    { dateIn: $('ry-sbc-date'), timeIn: $('ry-sbc-time'), afterGeo: () => runSBC() });
  $('ry-sbc-now').addEventListener('click', () => {
    const f = nowLocalFields();
    $('ry-sbc-date').value = f.date; $('ry-sbc-time').value = f.time; $('ry-sbc-offset').value = f.offset;
    runSBC();
  });
  $('ry-sbc-form').addEventListener('submit', e => { e.preventDefault(); runSBC(); });
  drawSBC(null);       // draw the empty grid immediately
  runSBC();
}

function runSBC() {
  const lat = parseFloat($('ry-sbc-lat').value), lon = parseFloat($('ry-sbc-lon').value);
  const off = parseFloat($('ry-sbc-offset').value) || 0;
  const status = $('ry-sbc-status');
  if (isNaN(lat) || isNaN(lon) || !$('ry-sbc-date').value || !$('ry-sbc-time').value) {
    status.textContent = 'Enter a date, time and place first.'; return;
  }
  status.textContent = '';
  let date, vedic;
  try {
    date = toUTC($('ry-sbc-date').value, $('ry-sbc-time').value, off);
    vedic = castVedic(castChart(date, lat, lon, 'whole'));
  } catch (e) {
    $('ry-sbc-summary').innerHTML = '<p class="muted small">This moment could not be computed in this browser. Try “Now” or another date.</p>';
    drawSBC(null); $('ry-sbc-vedha').innerHTML = ''; return;
  }
  const p = vedic.panchanga;
  const wd = date.getUTCDay();
  const wdAbbr = WD_ABBR[wd];
  // which grahas occupy which nakṣatra (num 1..27)
  const grahaByNak = {};
  for (const [name, g] of Object.entries(vedic.grahas)) {
    const num = g.nakshatra.num;
    (grahaByNak[num] = grahaByNak[num] || []).push(name);
  }
  const moonNak = vedic.grahas.Moon.nakshatra;
  const tithiGroup = tithiGroupFor(p.tithi.num);

  // summary
  $('ry-sbc-summary').innerHTML = `
    <ul class="clean small" style="margin:.2rem 0">
      <li><b>Moon</b> in <b>${esc(moonNak.sanskrit || moonNak.name)}</b> (nakṣatra ${moonNak.num}, pada ${moonNak.pada})</li>
      <li><b>Tithi</b> ${p.tithi.num} — ${esc(p.tithi.name)} → <b>${esc(tithiGroup)}</b> group cell</li>
      <li><b>Vāra</b> ${esc(p.vara.name)} (${wdAbbr}) → weekday cell</li>
      <li><b>Ayanāṁśa</b> ${esc(vedic.ayanamsaName)} ${vedic.ayanamsa}° (sidereal)</li>
    </ul>
    <p class="small muted" style="margin:.2rem 0 0">Highlighted: <span style="color:var(--link)">Moon's nakṣatra</span>,
      every other graha's nakṣatra, the ${esc(tithiGroup)} tithi-cell and the ${wdAbbr} weekday-cell.</p>`;

  drawSBC({ grahaByNak, moonNum: moonNak.num, tithiGroup, wdAbbr });
  renderVedha(moonNak, grahaByNak);
  try { autolinkResultPanels(['ry-sbc-summary', 'ry-sbc-vedha']); } catch { /* non-fatal */ }
}

function tithiGroupFor(num) {
  const within = ((num - 1) % 5); // 0..4 → Nandā..Pūrṇā
  return ['Nandā', 'Bhadrā', 'Jayā', 'Riktā', 'Pūrṇā'][within];
}

function drawSBC(hl) {
  const n = SBC.size;
  let cells = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const cell = SBC.grid[r][c];
    if (!cell) { cells += '<div class="sc"></div>'; continue; }
    let cls = 'sc', label = esc(cell.label), sub = '';
    if (cell.type === 'vowel') cls += ' sc-vowel';
    else if (cell.type === 'nakshatra') { cls += ' sc-nak'; sub = `<span class="n">${cell.isAbhijit ? 'Abhijit' : '#' + cell.num}</span>`; }
    else if (cell.type === 'consonant') { cls += ' sc-con'; }
    else if (cell.type === 'rashi') { cls += ' sc-rashi'; label = esc(cell.label.slice(0, 3)); }
    else if (cell.type === 'tithivara') { cls += ' sc-tv'; sub = `<span class="n">${esc((cell.weekdays || []).join('/'))}</span>`; }
    // highlighting
    if (hl) {
      if (cell.type === 'nakshatra') {
        if (cell.num === hl.moonNum) cls += ' sc-moon';
        else if (hl.grahaByNak[cell.num]) cls += ' sc-hi';
      } else if (cell.type === 'tithivara') {
        if (cell.tithiGroup === hl.tithiGroup) cls += ' sc-hi';
        if ((cell.weekdays || []).includes(hl.wdAbbr)) cls += ' sc-hi';
      }
    }
    const title = cell.type === 'nakshatra' && hl && hl.grahaByNak[cell.num] ? ` title="${esc(hl.grahaByNak[cell.num].join(', '))} here"` : (cell.flagged ? ' title="ring-2 consonant — flagged, single degraded source"' : '');
    cells += `<div class="${cls}"${title}>${label}${sub}</div>`;
  }
  $('ry-sbc-grid').innerHTML = `<div class="sbc">${cells}</div>
    <div class="ry-legend" style="margin-top:.5rem">
      <span><span class="ry-swatch" style="background:var(--link)"></span>Moon</span>
      <span><span class="ry-swatch" style="background:var(--gold)"></span>graha / tithi / vāra</span>
      <span style="color:var(--gold)">vowels on diagonals</span>
      <span style="color:var(--link)">rāśis</span>
      <span style="color:var(--muted)">consonants (ring 2 ⚑)</span>
    </div>
    <p class="small muted" style="margin:.4rem 0 0">${esc(SBC.accuracyFlags.ring2)}</p>
    <p class="small muted" style="margin:.2rem 0 0">${esc(SBC.cite)}</p>`;
}

function renderVedha(moonNak, grahaByNak) {
  const v = sarvatobhadraVedha(moonNak.num, SBC);
  if (!v) { $('ry-sbc-vedha').innerHTML = ''; return; }
  const cellDesc = c => {
    if (!c) return '—';
    const who = c.type === 'nakshatra' && grahaByNak[c.num] ? ` <span style="color:var(--link)">(${esc(grahaByNak[c.num].join(', '))})</span>` : '';
    const vp = c.vowelPair ? ` <span class="muted">(pairs with ${esc(c.vowelPair)})</span>` : '';
    return `${esc(c.label)}${c.num ? ` <span class="muted">#${c.num}</span>` : ''}${who}${vp}`;
  };
  $('ry-sbc-vedha').innerHTML = `
    <div class="ry-card">
      <p class="small" style="margin-top:0"><b>Vedha from the Moon</b> in ${esc(v.nakshatra.name)} (a computable reconstruction):</p>
      <ul class="clean small">
        <li><b>Front (sammukha):</b> ${cellDesc(v.front)}</li>
        <li><b>Diagonals:</b> ${v.diagonals.map(cellDesc).join(' · ')}</li>
      </ul>
      <p class="small muted" style="margin:.3rem 0 0">${esc(v.note)}</p>
      <p class="small" style="margin:.4rem 0 0;color:var(--gold)">⚑ ${esc(v.rules.luminariesNodes.flag)}</p>
      <p class="small muted" style="margin:.1rem 0 0">A) ${esc(v.rules.luminariesNodes.traditionA)} B) ${esc(v.rules.luminariesNodes.traditionB)}</p>
      <p class="small muted" style="margin:.3rem 0 0">${esc(v.rules.cumulative)}</p>
      <p class="small" style="margin:.3rem 0 0;color:var(--gold)">⚑ ${esc(v.rules.sourceDispute.flag)}</p>
      <p class="small muted" style="margin:.1rem 0 0">${v.rules.sourceDispute.positions.map(esc).join(' — vs — ')}</p>
      <p class="small muted" style="margin:.3rem 0 0">${esc(v.cite)}</p>
    </div>`;
}
