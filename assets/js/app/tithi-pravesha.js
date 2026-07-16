// ============================================================================
//  tithi-pravesha.js (app) — drives pages/tithi-pravesha.html: the annual (and
//  monthly) TITHI-PRAVEŚA. All DOM lives here; the pure engine is
//  core/tithi-pravesha.js on the shared astronomy engine.
//
//  HONEST FRAMING (locked): a modern-lineage technique with NO classical BPHS
//  anchor; the solar/soli-lunar month choice is a genuine dispute (solar is the
//  JHora default here). Described, never prescribed.
// ============================================================================
import { castChart, PLANET_GLYPHS, signOf, SIGNS } from '../core/astro.js';
import { tithiPravesha, monthlyPravesha } from '../core/tithi-pravesha.js';
import { wireCitySelect, toUTC } from './shared.js';
import { attachPersonPicker } from './person.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const HL = 'background:var(--parchment-2);outline:1px solid var(--gold-2)';
const ORD = h => `${h}${h === 1 ? 'st' : h === 2 ? 'nd' : h === 3 ? 'rd' : 'th'}`;

function fmtSid(lon) {
  const s = signOf(lon);
  const d = Math.floor(s.degInSign), m = Math.round((s.degInSign - d) * 60);
  return m === 60 ? `${d + 1}°00′ ${SIGNS[s.index]}` : `${d}°${String(m).padStart(2, '0')}′ ${SIGNS[s.index]}`;
}
const fmtUT = d => d ? new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UT' : '—';
const fmtUTsec = d => d ? new Date(d).toISOString().replace('T', ' ').slice(0, 19) + ' UT' : '—';

export function initTithiPravesha() {
  wireCitySelect($('tp-city'), $('tp-lat'), $('tp-lon'), $('tp-offset'));
  attachPersonPicker($('tp-picker-anchor'), {
    bdate: $('tp-date'), btime: $('tp-time'), boffset: $('tp-offset'), blat: $('tp-lat'), blon: $('tp-lon'),
  });
  $('tp-year').value = new Date().getFullYear();
  $('tp-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
}

function compute() {
  const lat = parseFloat($('tp-lat').value), lon = parseFloat($('tp-lon').value);
  const dateStr = $('tp-date').value, timeStr = $('tp-time').value;
  const year = parseInt($('tp-year').value, 10);
  const monthRule = $('tp-monthrule').value === 'soliLunar' ? 'soliLunar' : 'solar';
  const status = $('tp-status');
  if (isNaN(lat) || isNaN(lon) || !dateStr || !timeStr) { status.textContent = 'Fill the birth date, time and place first.'; return; }
  if (!Number.isFinite(year)) { status.textContent = 'Enter a target year.'; return; }
  status.textContent = 'Computing…';

  const birth = toUTC(dateStr, timeStr, parseFloat($('tp-offset').value) || 0);
  let tp, monthly;
  try {
    const natal = castChart(birth, lat, lon, 'whole');
    tp = tithiPravesha(natal, year, { monthRule, lat, lon });
    monthly = monthlyPravesha(natal, tp.match.instant, 12);
  } catch (e) { status.textContent = `Could not compute (${e.message}).`; return; }
  status.textContent = '';

  renderAnnual(tp);
  renderChart(tp);
  renderReadings(tp);
  renderMonthly(monthly);
}

// --- 1 · the annual TP instant + window --------------------------------------
function renderAnnual(tp) {
  const n = tp.natal, w = tp.windowDates, m = tp.match;
  const candRows = tp.candidates.map(c => `
    <tr${c.instantISO === m.instantISO ? ` style="${HL}"` : ''}>
      <td class="l">${esc(fmtUTsec(c.instant))}</td>
      <td class="l">${esc(c.siderealSunSign)}</td>
      <td class="l">${esc(c.tithi.name)}</td>
      <td class="l small">${c.elongError.toExponential(1)}°</td></tr>`).join('');
  const amb = tp.ambiguity.flag
    ? `<div class="callout science" style="margin-top:.6rem"><span class="label">Window edge case — surfaced, never silently resolved</span>${esc(tp.ambiguity.reason)}</div>`
    : '';
  const variant = tp.variantSelection
    ? `<div class="callout science" style="margin-top:.6rem"><span class="label">Soli-lunar variant in force</span>
        Natal amānta (soli-lunar) month opened with the Sun in <b>${esc(tp.variantSelection.natalAmantaSign)}</b>;
        ${tp.variantSelection.matchesInNatalMonth} match(es) in that month this year.
        <br><span class="small muted">${esc(tp.variantSelection.note)}</span></div>`
    : '';
  $('tp-annual').innerHTML = `
    <p class="small"><b>Natal tithi:</b> the Moon stood <b>${n.elongation}°</b> ahead of the Sun at birth —
      <b>${esc(n.tithi.name)}</b> (tithi ${n.tithi.num}, ${esc(n.tithi.paksha)}); the natal Sun sits in sidereal
      <b>${esc(n.solarSign)}</b> (${n.solarSignDeg}°, Lahiri). The annual TP is the instant the Moon regains that exact
      ${n.elongation}° elongation while the Sun is back in ${esc(n.solarSign)}.</p>
    <p class="small"><b>Sun-in-${esc(n.solarSign)} window (${tp.year}):</b> ${esc(fmtUT(w.ingress))} → ${esc(fmtUT(w.egress))}
      (${tp.window.lengthDays} days). <b>Month rule:</b> ${tp.monthRule === 'solar' ? '<b>solar</b> (the JHora default)' : '<b>soli-lunar</b> (the PVR variant)'}.</p>
    <p class="small" style="${HL};padding:.35rem .55rem;display:inline-block"><b>Annual tithi-praveśa:</b>
      <b>${esc(fmtUTsec(m.instant))}</b> — Sun sidereal ${esc(m.siderealSunSign)}, ${esc(m.tithi.name)},
      elongation matched to ${m.elongError.toExponential(1)}°.</p>
    <table class="data" style="margin-top:.6rem"><thead><tr><th class="l">Candidate instant (solar window)</th>
      <th class="l">Sun sidereal</th><th class="l">Tithi</th><th class="l">Match error</th></tr></thead>
      <tbody>${candRows || '<tr><td colspan="4" class="muted">no candidate in the solar window — see the edge-case note</td></tr>'}</tbody></table>
    ${amb}${variant}
    <p class="small muted" style="margin-top:.5rem">${esc(tp.anchorNote)}</p>`;
}

// --- 2 · the TP chart (sidereal) ---------------------------------------------
function renderChart(tp) {
  const v = tp.vedic;
  const rows = Object.keys(v.grahas).map(p => {
    const g = v.grahas[p];
    return `<tr><td class="l">${G(p)} ${esc(p)}</td><td class="l">${esc(g.label)}${g.retrograde ? ' ℞' : ''}</td>
      <td class="l small">${esc(g.nakshatra.name)} (pada ${g.nakshatra.pada})</td><td class="l">${ORD(g.house)}</td></tr>`;
  }).join('');
  $('tp-chart').innerHTML = `
    <p class="small"><b>TP lagna:</b> ${esc(v.lagna.label)} — ${esc(v.lagna.rashi)} (${esc(v.lagna.sanskrit)}),
      lord ${G(v.lagna.lord)} ${esc(v.lagna.lord)}, rising nakṣatra ${esc(v.lagna.nakshatra.name)}. Whole-sign bhāvas,
      sidereal (Lahiri ${v.ayanamsa}°). Cast for the <b>birthplace</b> (${tp.place.lat}°, ${tp.place.lon}°).</p>
    <table class="data"><thead><tr><th class="l">Graha</th><th class="l">Sidereal position</th>
      <th class="l">Nakṣatra</th><th class="l">Bhāva</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// --- 3 · the readings (year lord etc.) ---------------------------------------
function renderReadings(tp) {
  const r = tp.readings, p = r.panchanga;
  $('tp-readings').innerHTML = `
    <ul class="clean small">
      <li><b>TP lagna:</b> ${esc(r.tpLagna.rashi)} (${esc(r.tpLagna.sanskrit)}), lord ${G(r.tpLagna.lord)} ${esc(r.tpLagna.lord)}.
        <span class="muted">${esc(r.tpLagna.note)}</span></li>
      <li><b>Weekday lord of the TP day:</b> ${G(r.weekdayLord.lord)} ${esc(r.weekdayLord.lord)} (${esc(r.weekdayLord.vara)}).
        <span class="muted">${esc(r.weekdayLord.note)}</span></li>
      <li><b>Horā lord at the TP instant — the "lord of the year":</b> ${r.horaLord.lord ? G(r.horaLord.lord) + ' ' + esc(r.horaLord.lord) : '—'}.
        <span class="muted">${esc(r.horaLord.note)}</span></li>
      <li><b>Pañcāṅga:</b> ${esc(p.tithi.name)} · ${esc(p.vara.name)} · nakṣatra ${esc(p.nakshatra.name)} · yoga ${esc(p.yoga.name)} · karaṇa ${esc(p.karana.name)}.</li>
    </ul>
    <div class="callout science" style="margin-top:.4rem"><span class="label">The annual daśā is documented, not computed</span>
      ${esc(tp.tithiAshtottariNote)}</div>`;
}

// --- 4 · the monthly praveśas ------------------------------------------------
function renderMonthly(mo) {
  const rows = mo.praveshas.map((x, i) => `<tr>
    <td class="l">${i + 1}</td><td class="l">${esc(fmtUTsec(x.instant))}</td>
    <td class="l">${esc(x.siderealSunSign)}</td><td class="l">${esc(x.tithi.name)}</td></tr>`).join('');
  $('tp-monthly').innerHTML = `
    <p class="small">The <b>monthly</b> tithi-praveśa — the recurrence of the natal elongation once per (solar) month
      (~29.5 days apart), from the annual TP forward. Each row is an exact tithi-return; cast any one as its own chart.</p>
    <table class="data"><thead><tr><th class="l">#</th><th class="l">Instant</th><th class="l">Sun sidereal</th><th class="l">Tithi</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <p class="small muted" style="margin-top:.4rem">${esc(mo.note)}</p>`;
}
