// ============================================================================
//  tajika.js (app) — drives pages/tajika.html: the Tājika varṣaphala tool.
//
//  All computation lives in the pure core (assets/js/core/tajika.js on the
//  shared engine); this file owns the DOM only. HONEST FRAMING (locked): a
//  historical calculation grammar — described, never prescribed; contested
//  values are surfaced from the data, never silently resolved.
// ============================================================================
import { castChart, PLANET_GLYPHS, signOf, SIGNS } from '../core/astro.js';
import { varshaphala } from '../core/tajika.js';
import { wireCitySelect, toUTC } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';
import { attachPersonPicker } from './person.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const HL = 'background:var(--parchment-2);outline:1px solid var(--gold-2)';
const ORD = h => `${h}${h === 1 ? 'st' : h === 2 ? 'nd' : h === 3 ? 'rd' : 'th'}`;

// "12°34′ Virgo" for a SIDEREAL longitude (the 30° divisions are the rāśis).
function fmtSid(lon) {
  const s = signOf(lon);
  const d = Math.floor(s.degInSign);
  const m = Math.round((s.degInSign - d) * 60);
  return m === 60 ? `${d + 1}°00′ ${SIGNS[s.index]}` : `${d}°${String(m).padStart(2, '0')}′ ${SIGNS[s.index]}`;
}
const fmtUT = d => d ? new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UT' : '—';

// the last computed report, exposed for the AI panel / registry consumers.
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentTajikaReport() { return lastReport; }

export function initTajika() {
  wireCitySelect($('tj-city'), $('tj-lat'), $('tj-lon'), $('tj-offset'));
  attachPersonPicker($('tj-picker-anchor'), {
    bdate: $('tj-date'), btime: $('tj-time'), boffset: $('tj-offset'),
    blat: $('tj-lat'), blon: $('tj-lon'),
  });
  $('tj-year').value = new Date().getFullYear();
  $('tj-form').addEventListener('submit', e => { e.preventDefault(); compute(); });

  // the AI panel: the shared divination assistant, Jyotiṣa-historian voice
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'tajika',
      getReading: () => lastReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Compute a year chart above first.' },
    });
  }
}

function compute() {
  const lat = parseFloat($('tj-lat').value), lon = parseFloat($('tj-lon').value);
  const dateStr = $('tj-date').value, timeStr = $('tj-time').value;
  const year = parseInt($('tj-year').value, 10);
  const status = $('tj-status');
  if (isNaN(lat) || isNaN(lon) || !dateStr || !timeStr) {
    status.textContent = 'Fill the birth date, time and place first.'; return;
  }
  if (!Number.isFinite(year)) { status.textContent = 'Enter a target year.'; return; }
  status.textContent = 'Computing…';

  const birth = toUTC(dateStr, timeStr, parseFloat($('tj-offset').value) || 0);
  let report;
  try {
    const natal = castChart(birth, lat, lon, 'whole');
    report = varshaphala(natal, year, { lat, lon });
  } catch (e) { status.textContent = `Could not compute (${e.message}).`; return; }
  status.textContent = '';

  renderReturn(report);
  renderYearLord(report);
  renderAspects(report);
  renderSahams(report);
  renderCompare(report);

  lastReport = {
    kind: 'tajika',
    meta: { ...report.meta, birthLocal: `${dateStr} ${timeStr} (UTC${($('tj-offset').value || 0) >= 0 ? '+' : ''}${$('tj-offset').value || 0})` },
    varshaPravesha: {
      instantISO: report.varshaPravesha.instantISO,
      tropicalInstantISO: report.varshaPravesha.tropicalInstantISO,
      driftMinutes: report.varshaPravesha.driftMinutes,
      ayanamsa: report.varshaPravesha.ayanamsa,
    },
    annual: report.annual, muntha: report.muntha, varsheshvara: report.varsheshvara,
    aspects: report.aspects, yogas: report.yogas, sahams: report.sahams,
    comparison: report.comparison, citations: report.citations, notes: report.notes,
  };
  notifyReport();
}

// --- 1 · varṣa-praveśa + the annual chart -----------------------------------
function renderReturn(r) {
  const vp = r.varshaPravesha, an = r.annual, mu = r.muntha;
  const rows = Object.keys(an.grahas).map(p => {
    const g = an.grahas[p];
    return `<tr><td class="l">${G(p)} ${esc(p)}</td>
      <td class="l">${esc(g.label)}${g.retrograde ? ' ℞' : ''}</td>
      <td class="l">${ORD(g.house)}</td></tr>`;
  }).join('');
  $('tj-return').innerHTML = `
    <p class="small"><b>Varṣa-praveśa (sidereal return):</b> <b>${esc(fmtUT(vp.instant))}</b>
      — the Sun regains its natal <i>sidereal</i> place ${esc(fmtSid(vp.natalSiderealSun))}
      (matched to ${vp.siderealMatchDeg.toExponential(1)}°). Ayanāṁśa ${vp.ayanamsa}° (Lahiri — a modern convention;
      Balabhadra's own constants are Sūrya-siddhānta era).
      This is a <b>${an.isDay ? 'day' : 'night'}</b> varṣa-praveśa — the day/night rules below follow it.</p>
    <p class="small"><b>Annual lagna:</b> ${esc(an.lagna.label)} — ${esc(an.lagna.rashi)} (${esc(an.lagna.sanskrit)}),
      lord ${G(an.lagna.lord)} ${esc(an.lagna.lord)}; whole-sign houses, sidereal.</p>
    <p class="small" style="${HL};padding:.3rem .5rem;display:inline-block"><b>Munthā:</b>
      ${esc(mu.rashi)} (${esc(mu.sanskrit)}) — natal lagna sign + ${mu.completedYears} completed years —
      in the <b>${ORD(mu.house)} house</b> of the annual chart; munthā lord ${G(mu.lord)} ${esc(mu.lord)}.
      <span class="muted">It progresses ≈2.5°/month within the year (house extent ÷ 12 — Tājikamuktāvali, as quoted
      by Balabhadra).</span></p>
    <div class="table-scroll"><table class="data"><thead><tr><th class="l">Graha</th><th class="l">Sidereal position</th><th class="l">House</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="small muted">${esc(vp.cite)} ${esc(mu.cite)}</p>`;
}

// --- 2 · varṣeśvara -----------------------------------------------------------
function renderYearLord(r) {
  const y = r.varsheshvara;
  const rows = y.candidates.map(c => `
    <tr${c.chosen ? ` style="${HL}"` : ''}>
      <td class="l">${esc(c.role)}</td>
      <td class="l">${G(c.planet)} ${esc(c.planet)} <span class="muted small">in ${esc(c.planetSign)}</span></td>
      <td class="l">${c.aspectsLagna ? `${esc(c.aspect.name)} <span class="muted small">(strength ${c.aspect.strength})</span>` : '<span class="muted">no aspect</span>'}</td>
      <td class="l">${c.strengthRatio != null ? `${c.strengthRatio}× required` : '—'}</td>
      <td class="l">${c.chosen ? '<span class="badge badge--ok">✓ varṣeśvara</span>' : ''}</td>
    </tr>`).join('');
  const dispute = !y.viaDispute ? '' : `
    <div class="callout science" style="margin-top:.6rem"><span class="label">The no-aspect dispute — shown, not silently resolved</span>
      No candidate aspects the annual lagna this year, and the authorities genuinely split four ways:
      <b>${y.dispute.positions.map(p => `${esc(p.authority)} → ${esc(p.rule)}`).join(' · ')}</b>.
      Implemented default: ${esc(y.dispute.implemented)}<br>
      <span class="small muted">${esc(y.dispute.cite)}</span></div>`;
  $('tj-yearlord').innerHTML = `
    <p class="small">"${esc(y.aspectPrecondition.quote)}" — ${esc(y.aspectPrecondition.by)}. The aspect to the annual
      lagna is the <b>precondition</b>; ties run down the Tājikakaustubha chain:
      ${y.tieChain.chain.map(esc).join(' → ')}.</p>
    <div class="table-scroll"><table class="data"><thead><tr><th class="l">Candidate (office)</th><th class="l">Planet</th>
      <th class="l">Aspects the annual lagna?</th><th class="l">Ṣaḍbala strength</th><th class="l">Chosen</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="small"><b>Varṣeśvara: ${G(y.chosen.planet)} ${esc(y.chosen.planet)}</b>
      (${y.chosen.roles.map(esc).join(' + ')}) — selected by: ${esc(y.tieBreakUsed)}.</p>
    ${dispute}
    <p class="small muted">${esc(y.strengthNote)}</p>
    <p class="small muted">${esc(y.cite)}</p>`;
}

// --- 3 · Tājika aspects & yogas -------------------------------------------------
function renderAspects(r) {
  const a = r.aspects, yo = r.yogas;
  const orbRow = Object.entries(a.orbs).map(([p, o]) => `${G(p)} ${o}°`).join(' · ');
  const withAspect = a.pairs.filter(p => p.aspect);
  const rows = withAspect.map(p => {
    const verdict = p.verdict === 'itthasala'
      ? `<b>itthaśāla</b> (${esc(p.grade)})${p.carveOut ? ' <b title="past exactness by under 1° — still itthaśāla per the ancient commentator (Hāyanaratna ch.3 §4); the Western applying flag of aspects.js says separating here">†</b>' : ''}`
      : p.verdict === 'isarapha' ? '<b>īsarāpha</b>' : '<span class="muted">out of orb</span>';
    return `<tr${p.verdict === 'itthasala' ? ` style="${HL}"` : ''}>
      <td class="l">${G(p.a)} ${esc(p.a)} – ${G(p.b)} ${esc(p.b)}</td>
      <td class="l">${esc(p.aspect.name)}${p.aspect.friendly === true ? ' <span class="muted small">friendly</span>' : p.aspect.friendly === false ? ' <span class="muted small">inimical</span>' : ''}</td>
      <td class="l">${G(p.faster)} ${esc(p.faster)}</td>
      <td class="num">${p.gap.toFixed(2)}°</td>
      <td class="l small">${p.withinOwnOrbs ? 'own orbs' : p.withinTwelve ? '≤12°' : '—'}${p.withinHalfSum ? '' : ' <span class="muted">(fails half-sum)</span>'}</td>
      <td class="l">${verdict}${p.bhavishyat ? ' <span class="muted small" title="the swifter planet in the last degree of its sign, about to apply across the boundary — bhaviṣyat (delayed result)">▸bhaviṣyat</span>' : ''}</td>
    </tr>`;
  }).join('');
  const noAspect = a.pairs.filter(p => !p.aspect).map(p => `${G(p.a)}–${G(p.b)}`).join(', ');
  const yogaLines = [];
  yogaLines.push(`<b>Ikkavāla</b> (all seven in angles/succedents): ${yo.ikkavala ? '<b>present</b>' : 'not present'} ·
    <b>Induvāra</b> (all seven cadent): ${yo.induvara ? '<b>present — "never praised as good"</b>' : 'not present'}`);
  yogaLines.push(yo.naktas.length
    ? `<b>Nakta</b> (translation of light): ${yo.naktas.map(n => `${G(n.via)} ${esc(n.via)} carries ${G(n.from)} ${esc(n.from)} → ${G(n.to)} ${esc(n.to)}`).join('; ')}`
    : '<b>Nakta</b>: none detected');
  yogaLines.push(yo.yamayas.length
    ? `<b>Yamayā</b> (collection of light): ${yo.yamayas.map(y => `${G(y.collector)} ${esc(y.collector)} collects ${G(y.pair[0])}+${G(y.pair[1])}`).join('; ')}`
    : '<b>Yamayā</b>: none detected');
  yogaLines.push(yo.kambulas.length
    ? `<b>Kambūla</b> (Moon-assisted itthaśāla): ${yo.kambulas.map(k => `${G(k.pair[0])} ${esc(k.pair[0])}–${G(k.pair[1])} ${esc(k.pair[1])} with the Moon`).join('; ')} <span class="muted small">(the 16-fold dignity grading is documented in-data, not computed)</span>`
    : '<b>Kambūla</b>: none detected');
  $('tj-aspects').innerHTML = `
    <p class="small"><b>Deeptāṁśa ("orbs of light"):</b> ${orbRow}
      <span class="muted small">(Daivajñālaṃkṛti 8.9 = Tājikasāra 88; Rāhu 12° is a Praśnavaiṣṇava-only variant, flagged;
      a popular website's "Mars 12°" is a known transcription error, recorded in-data)</span>.
      Combining rule — the text's own: <i>"within their own orbs of light, or within twelve degrees"</i>; the modern
      half-sum convention is unverified in the sources (though mathematically identical to this site's Lilly moiety
      rule) and is shown only as a comparison flag.</p>
    <div class="table-scroll"><table class="data"><thead><tr><th class="l">Pair</th><th class="l">Tājika aspect (sign-counted)</th>
      <th class="l">Swifter</th><th class="num">Gap (deg-in-sign)</th><th class="l">Within orb</th><th class="l">Verdict</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="small muted">No Tājika aspect (2/6/8/12 sign relations): ${noAspect || '—'}.
      <b>†</b> = past exactness by under 1° — <i>still itthaśāla</i> per "the ancient commentator" (Hāyanaratna ch.3 §4);
      for that sliver the Western applying flag of this site's <code>aspects.js</code> reads separating. Both verdicts
      are honest to their own rulebooks.</p>
    <p class="small">${yogaLines.join('<br>')}</p>
    <p class="small muted">${esc(yo.scanNote)}</p>
    <p class="small muted">${esc(a.cite)}</p>`;
}

// --- 4 · sahams -------------------------------------------------------------------
function renderSahams(r) {
  const s = r.sahams;
  const rows = s.sahams.map(x => `
    <tr>
      <td class="l"><b>${esc(x.name)}</b>${x.contested ? ' <span title="a contested reading — see the notes below the table">⚑</span>' : ''}</td>
      <td class="l small">${esc(x.formula)}${x.formulaNote ? ` <span class="muted">(${esc(x.formulaNote)})</span>` : ''}</td>
      <td class="l">${esc(fmtSid(x.lon))}</td>
      <td class="l">${ORD(x.house)}</td>
      <td class="l">${x.correctionApplied ? '<b title="the added point fell outside the arc from subtrahend to minuend — one sign added">+30°</b>' : '—'}</td>
    </tr>`).join('');
  const contested = s.sahams.filter(x => x.contested).map(x => {
    const notes = Object.values(x.contested).map(c => c.note).join(' ');
    return `<li class="small"><b>${esc(x.name)}:</b> ${esc(notes)}</li>`;
  }).join('');
  $('tj-sahams').innerHTML = `
    <p class="small">Each saham = <b>minuend − subtrahend + added point</b> (this is a <b>${s.isDay ? 'day' : 'night'}</b>
      varṣa-praveśa — ${s.isDay ? 'day formulas in force' : 'minuend and subtrahend swapped where the text reverses'}).
      The between-check point is the Lagna except where the text says otherwise (Venus for Mitra; Sun/Moon for Gaurava).
      Annual-lagna lord for Sāmarthya: ${G(s.lagnaLord)} ${esc(s.lagnaLord)}.</p>
    <div class="table-scroll"><table class="data"><thead><tr><th class="l">Saham</th><th class="l">Formula (as applied)</th>
      <th class="l">Position (sidereal)</th><th class="l">House</th><th class="l">+30° correction</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <div class="callout science" style="margin-top:.6rem"><span class="label">The +30° correction is contested inside the tradition</span>
      ${esc(s.correction.contested.visvanatha.note)}<br>
      <span class="small muted">${esc(s.correction.contested.visvanatha.cite)}</span></div>
    <ul style="margin:.6rem 0 0">${contested}</ul>
    <p class="small muted">${esc(s.correction.contested.granularity.note)}</p>
    <p class="small muted">${esc(s.countsNote.note)}</p>
    <p class="small muted">${esc(s.cite)}</p>`;
}

// --- 5 · the honest comparison -------------------------------------------------------
function renderCompare(r) {
  const vp = r.varshaPravesha;
  $('tj-compare').innerHTML = `
    <p class="small"><b>The same return, two rulebooks.</b>
      Tropical return (Lilly's revolution, <a href="book3/master.html">Book III master tool</a>):
      <b>${esc(fmtUT(vp.tropicalInstant))}</b> · Sidereal return (this varṣa-praveśa):
      <b>${esc(fmtUT(vp.instant))}</b> — ${vp.driftMinutes != null ? `${Math.abs(vp.driftMinutes).toFixed(0)} minutes ${vp.driftMinutes >= 0 ? 'later' : 'earlier'}` : 'drift unavailable'}
      (${esc(vp.expectedDriftNote)}).</p>
    <p class="small">${esc(r.comparison.note)}</p>
    <p class="small muted">${esc(r.comparison.cite)}</p>`;
}
