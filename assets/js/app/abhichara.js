// ============================================================================
//  abhichara.js (app) — drives the ṢAṬKARMAN TIMING SCREEN on
//  pages/abhichara/six-acts.html. All computation lives in the pure core
//  (core/abhichara.js); this file owns the DOM: the act + date/place form, the
//  current-moment read-out, the "does now match the prescription?" table, and
//  the per-act prescription table. Honest framing throughout — the screen
//  describes what the tradition prescribed, as history; it changes nothing real.
// ============================================================================
import { shatkarmanScreen, SHATKARMAN_CAVEAT } from '../core/abhichara.js';
import { SHATKARMAN } from '../core/data/abhichara-data.js';
import { wireCitySelect, toUTC, nowLocalFields, autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const fmtT = (d, off) => new Date(d.getTime() + off * 3600000).toISOString().slice(11, 16);
const offLabel = off => `UTC${off >= 0 ? '+' : '−'}${Math.abs(off) % 1 ? Math.abs(off).toFixed(1) : Math.abs(off)}`;

export function initAbhichara() {
  const sel = $('ab-act');
  if (sel) {
    sel.innerHTML = SHATKARMAN.map(a =>
      `<option value="${a.key}">${esc(a.translit)} — ${esc(a.gloss)}</option>`).join('');
  }

  // default: NOW at Varanasi (Kāśī, the home of the Mantramahodadhi).
  const istNow = new Date(Date.now() + 5.5 * 3600000).toISOString();
  $('ab-date').value = istNow.slice(0, 10);
  $('ab-time').value = istNow.slice(11, 16);
  $('ab-offset').value = 5.5;
  $('ab-lat').value = 25.3176; $('ab-lon').value = 82.9739;   // Varanasi, IN
  wireCitySelect($('ab-city'), $('ab-lat'), $('ab-lon'), $('ab-offset'),
    { dateIn: $('ab-date'), timeIn: $('ab-time'), afterGeo: () => run() });

  $('ab-now').addEventListener('click', () => {
    const f = nowLocalFields();
    $('ab-date').value = f.date; $('ab-time').value = f.time; $('ab-offset').value = f.offset;
    run();
  });
  $('ab-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  if (sel) sel.addEventListener('change', () => run());

  run();
}

function run() {
  const lat = parseFloat($('ab-lat').value), lon = parseFloat($('ab-lon').value);
  const off = parseFloat($('ab-offset').value) || 0;
  const act = $('ab-act').value || 'santi';
  const status = $('ab-status');
  if (isNaN(lat) || isNaN(lon) || !$('ab-date').value || !$('ab-time').value) {
    status.textContent = 'Enter an act, date, time and place first.'; return;
  }
  status.textContent = '';
  let scr;
  try {
    scr = shatkarmanScreen(toUTC($('ab-date').value, $('ab-time').value, off), lat, lon, act);
  } catch (e) {
    $('ab-summary').innerHTML = '<p class="muted">This moment could not be computed in this browser. Try the “Now” button or a different date.</p>';
    $('ab-matches').innerHTML = ''; $('ab-prescriptions').innerHTML = '';
    return;
  }
  if (scr.error) {
    $('ab-summary').innerHTML = `<p class="muted">${esc(scr.error)}</p>`;
    $('ab-matches').innerHTML = ''; $('ab-prescriptions').innerHTML = '';
    return;
  }
  renderSummary(scr, off);
  renderMatches(scr);
  renderPrescriptions(scr);
  autolinkResultPanels(['ab-summary', 'ab-matches', 'ab-prescriptions']);
}

function matchChip(m) {
  if (m.match === true) return '<span class="badge badge--ok">matches</span>';
  if (m.match === false) return '<span class="badge badge--bad">differs</span>';
  return '<span class="badge badge--plain">no rule</span>';
}

// act class → verdict-triad badge (benign = ok, hostile/adjacent = warn, māraṇa = bad)
const CLASS_BADGE = { benign: 'badge--ok', hostile: 'badge--warn', marana: 'badge--bad', 'abhicāra-adjacent': 'badge--warn' };

function renderSummary(scr, off) {
  const cm = scr.currentMoment;
  const clsLabel = { benign: 'benign (śānti-class)', hostile: 'hostile', marana: 'māraṇa-class', 'abhicāra-adjacent': 'abhicāra-adjacent' };
  $('ab-summary').innerHTML = `
    <p><b>The act:</b> ${esc(scr.actLabel)} <span class="badge ${CLASS_BADGE[scr.actClass] || 'badge--plain'}">${esc(clsLabel[scr.actClass] || scr.actClass)}</span></p>
    <ul class="clean small">
      <li><b>Calendar season (ṛtu):</b> ${esc(cm.ritu.translit)} <span class="muted">(${esc(cm.ritu.gloss)})</span> — Sun in sidereal <b>${esc(cm.sunRashi)}</b> (Lahiri ayanāṁśa ${esc(cm.ayanamsa)}°)</li>
      <li><b>Ghaṭikā-cycle block (scheme A):</b> ${esc(cm.ghatikaSeason.translit)} <span class="muted">(ghaṭikā ${cm.ghatikaSeason.ghatikaNumber} after sunrise)</span></li>
      <li><b>Day-part (scheme B):</b> ${esc(cm.dayPart.translit)} <span class="muted">(${esc(cm.dayPart.gloss)})</span></li>
      <li><b>Lunar fortnight:</b> ${esc(cm.fortnight.half)} half — tithi ${cm.fortnight.tithiNum} (${esc(cm.fortnight.tithiName)})</li>
      <li><b>Sunrise</b> ${fmtT(cm.sunrise, off)} · <b>Sunset</b> ${fmtT(cm.sunset, off)} <span class="muted">(times ${esc(offLabel(off))})</span></li>
    </ul>`;
}

function renderMatches(scr) {
  const rows = scr.matches.map(m => `<tr>
    <td class="l"><b>${esc(m.slot)}</b></td>
    <td class="l">${esc(m.prescribed)}</td>
    <td class="l">${esc(m.current)}</td>
    <td>${matchChip(m)}</td>
    <td class="l small muted">${esc(m.cite)}</td>
  </tr>`).join('');
  $('ab-matches').innerHTML = `
    <div class="table-scroll"><table class="data">
      <thead><tr><th class="l">Slot</th><th class="l">Prescribed for this act</th><th class="l">At this moment</th><th>Match</th><th class="l">Source</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="callout" style="margin:.7rem 0 0"><span class="label">The texts disagree ⚑</span>${esc(scr.conflictNote)}</div>`;
}

function renderPrescriptions(scr) {
  const p = scr.prescriptions;
  const row = (k, v, cite) => v ? `<tr><td class="l"><b>${esc(k)}</b></td><td class="l">${esc(v)}</td><td class="l small muted">${esc(cite)}</td></tr>` : '';
  const rows = [
    row('Season (Table C)', p.season ? `${p.season.translit} (${p.season.gloss})` : '—', p.seasonCite),
    row('Day-part (BPK 3.6-7)', p.dayPartBPK ? `${p.dayPartBPK.translit} (${p.dayPartBPK.gloss})` : '— (not in the BPK six-part scheme)', p.dayPartCite),
    row('Day-part (U 1.28 variant)', p.dayPartU128 ? `${p.dayPartU128.translit} (${p.dayPartU128.gloss})` : '—', p.dayPartU128Cite),
    row('Lunar fortnight', p.fortnight, p.fortnightCite),
    row('Colour', p.color, p.colorCite),
    row('Mat-symbol (Uḍḍīśatantra)', p.matUddisha, p.matCite),
    row('Mat-symbol (Bhairavapadmāvatīkalpa)', p.matBhairava, p.matCite),
    row('Mudrā (gesture)', p.mudra, p.mudraCite),
    row('Rosary (mālā)', p.rosary, p.rosaryCite),
    row('Finger-hold', p.finger, p.fingerCite),
    row('Hand', p.hand, p.handCite),
  ].join('');
  $('ab-prescriptions').innerHTML = `
    <div class="table-scroll"><table class="data">
      <thead><tr><th class="l">Correspondence</th><th class="l">The tradition prescribed</th><th class="l">Source</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="callout science" style="margin:.7rem 0 0"><span class="label">Read this, please</span>${esc(SHATKARMAN_CAVEAT)}</div>`;
}
