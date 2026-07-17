// ============================================================================
//  moment-picker.js — THE date-time-place cluster, designed once (flow §2.2).
//  ONE implementation for every casting page. It renders into a container and
//  WRITES THROUGH to the page's existing hidden inputs by their legacy ids
//  (wb-lat, h-date, …) so every existing app wiring keeps working untouched.
//
//  Load-bearing safety rail (flow risk 1): mountMomentPicker THROWS at mount if
//  any configured legacy id is missing — a silent id drift would compute from
//  stale hidden values. The Chromium sweep computes on every migrated page.
//
//  ── THE 38-ROW UTC-OFFSET TABLE (OFFSETS) — provenance ────────────────────
//  Standard/summer offsets verified against the IANA tz database view on
//  timeanddate.com (July 2026). Notable current-era facts folded in:
//    • UK/Ireland/Portugal   UTC±0 (GMT/WET) → UTC+1 summer (BST/IST/WEST).
//    • Central Europe (CET)   UTC+1 → UTC+2 summer (CEST).
//    • Eastern Europe (EET)   UTC+2 → UTC+3 summer (EEST).
//    • Egypt (Cairo)          UTC+2 → UTC+3 summer — DST REINSTATED 2023, active
//                             2026 (last Fri Apr → last Thu Oct). [timeanddate,
//                             Egypt Independent, 2026]
//    • Türkiye (Istanbul)     UTC+3 permanent, no DST since 2016.
//    • Russia (Moscow)        UTC+3 permanent, no DST since 2014.
//    • Gulf/India/SE-Asia/China/Japan  no DST.
//    • Australia (SE)         AEST UTC+10 → AEDT UTC+11 summer.
//    • New Zealand            NZST UTC+12 → NZDT UTC+13 summer.
//    • US/Canada              EST−5→EDT−4, CST−6→CDT−5, MST−7→MDT−6, PST−8→PDT−7.
//    • Mexico (Mexico City)   UTC−6 permanent — DST ABOLISHED Oct 2022 (central
//                             zone / Zona Centro). [timeanddate, Wikipedia 2022]
//    • Brazil (São Paulo)     UTC−3, no DST since 2019.  Argentina UTC−3, no DST.
//  Sources: https://www.timeanddate.com/time/zones/ ,
//    https://www.timeanddate.com/time/change/egypt/cairo ,
//    https://en.wikipedia.org/wiki/Daylight_saving_time_in_Mexico .
//  engine-test asserts every CITIES city's standard AND summer offset is a row.
// ============================================================================

import { CITIES, nowLocalFields } from './shared.js';
import { attachGeolocate, nearestCity } from './location.js';
import { eraAccuracy } from '../core/calendar.js';

// ---------------------------------------------------------------------------
//  OFFSETS — 38 named UTC-offset rows. `value` is decimal hours; `dst` marks
//  the summer-time variant of a region (so the same numeric value may appear
//  twice with different regional labels — the <select> distinguishes by label).
// ---------------------------------------------------------------------------
export const OFFSETS = [
  { value: -12,   label: 'UTC−12 — Baker & Howland Is.' },
  { value: -11,   label: 'UTC−11 — American Samoa, Niue' },
  { value: -10,   label: 'UTC−10 — Hawaii' },
  { value: -9.5,  label: 'UTC−9:30 — Marquesas Is.' },
  { value: -9,    label: 'UTC−9 — Alaska (standard)' },
  { value: -8,    label: 'UTC−8 — US/Canada Pacific (standard, PST)' },
  { value: -7,    label: 'UTC−7 — US Mountain (standard, MST) · Pacific (summer, PDT)', dst: true },
  { value: -6,    label: 'UTC−6 — US Central (standard, CST) · Mexico' },
  { value: -5,    label: 'UTC−5 — US Eastern (standard, EST) · Central (summer, CDT)', dst: true },
  { value: -4,    label: 'UTC−4 — Atlantic · US Eastern (summer, EDT) · Chile', dst: true },
  { value: -3.5,  label: 'UTC−3:30 — Newfoundland' },
  { value: -3,    label: 'UTC−3 — Argentina · Brazil (east)' },
  { value: -2,    label: 'UTC−2 — South Georgia · Fernando de Noronha' },
  { value: -1,    label: 'UTC−1 — Azores · Cape Verde' },
  { value: 0,     label: 'UTC±0 — GMT: UK, Ireland, Portugal (winter) · Iceland' },
  { value: 1,     label: 'UTC+1 — Central Europe (standard, CET) · UK & Ireland (summer, BST) · West Africa', dst: true },
  { value: 2,     label: 'UTC+2 — Eastern Europe (standard, EET) · Central Europe (summer, CEST) · South Africa · Egypt (winter)', dst: true },
  { value: 3,     label: 'UTC+3 — Moscow · Türkiye · East Africa · Eastern Europe (summer, EEST) · Egypt (summer)', dst: true },
  { value: 3.5,   label: 'UTC+3:30 — Iran' },
  { value: 4,     label: 'UTC+4 — Gulf (UAE, Oman) · Azerbaijan · Georgia' },
  { value: 4.5,   label: 'UTC+4:30 — Afghanistan' },
  { value: 5,     label: 'UTC+5 — Pakistan · Uzbekistan' },
  { value: 5.5,   label: 'UTC+5:30 — India · Sri Lanka' },
  { value: 5.75,  label: 'UTC+5:45 — Nepal' },
  { value: 6,     label: 'UTC+6 — Bangladesh · Kazakhstan (east)' },
  { value: 6.5,   label: 'UTC+6:30 — Myanmar · Cocos Is.' },
  { value: 7,     label: 'UTC+7 — Indochina (Thailand, Vietnam) · W. Indonesia' },
  { value: 8,     label: 'UTC+8 — China · Singapore · Hong Kong · W. Australia' },
  { value: 8.75,  label: 'UTC+8:45 — Eucla (SE Western Australia)' },
  { value: 9,     label: 'UTC+9 — Japan · Korea' },
  { value: 9.5,   label: 'UTC+9:30 — Central Australia (standard, ACST)' },
  { value: 10,    label: 'UTC+10 — Eastern Australia (standard, AEST) · W. Pacific' },
  { value: 10.5,  label: 'UTC+10:30 — Central Australia (summer, ACDT)', dst: true },
  { value: 11,    label: 'UTC+11 — Eastern Australia (summer, AEDT) · Solomon Is.', dst: true },
  { value: 12,    label: 'UTC+12 — New Zealand (standard, NZST) · Fiji' },
  { value: 12.75, label: 'UTC+12:45 — Chatham Is. (standard)' },
  { value: 13,    label: 'UTC+13 — New Zealand (summer, NZDT) · Tonga · Samoa', dst: true },
  { value: 14,    label: 'UTC+14 — Line Is. (Kiribati)' },
];

// Cities that do NOT observe daylight-saving in the current era (2026). Every
// other CITIES entry shifts +1 h in summer. Names match shared.js CITIES exactly.
const NO_DST = new Set([
  'Moscow, RU', 'Istanbul, TR', 'Dubai, AE', 'Mumbai, IN', 'Delhi, IN',
  'Bangkok, TH', 'Singapore, SG', 'Hong Kong', 'Beijing, CN', 'Tokyo, JP',
  'Mexico City, MX', 'São Paulo, BR', 'Buenos Aires, AR', 'Johannesburg, ZA', 'Lagos, NG',
]);

// PURE: the {standard, summer|null} offset pair for a CITIES row [name,lat,lon,off].
// summer = standard + 1 where DST is observed, else null. Used by the picker's
// DST hint and asserted by engine-test against OFFSETS.
export function offsetPairForCity(cityRow) {
  const name = cityRow[0], standard = cityRow[3];
  const summer = NO_DST.has(name) ? null : standard + 1;
  return { standard, summer };
}

// human offset formatter, e.g. 5.5 → "UTC+5:30", -3.5 → "UTC−3:30"
export function formatOffset(v) {
  const sign = v < 0 ? '−' : '+';
  const a = Math.abs(v);
  const h = Math.floor(a);
  const m = Math.round((a - h) * 60);
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

// ---------------------------------------------------------------------------
//  validateMoment — PURE. The 7-rule set (flow §2.2.3). No DOM. Returns
//  { errors:[{field,message}], hints:[{field,message}] }. errors block submit.
// ---------------------------------------------------------------------------
export function validateMoment(fields = {}) {
  const errors = [], hints = [];
  const num = v => (v === '' || v == null ? NaN : Number(v));
  const lat = num(fields.lat), lon = num(fields.lon), off = num(fields.offset);
  const date = fields.date == null ? '' : String(fields.date).trim();
  const time = fields.time == null ? '' : String(fields.time).trim();

  // required
  if (!date) errors.push({ field: 'date', message: 'Enter a date.' });
  if (!time) errors.push({ field: 'time', message: 'Enter a time (local clock time).' });
  if (fields.lat === '' || fields.lat == null || Number.isNaN(lat)) errors.push({ field: 'lat', message: 'Enter a latitude.' });
  if (fields.lon === '' || fields.lon == null || Number.isNaN(lon)) errors.push({ field: 'lon', message: 'Enter a longitude.' });

  // ranges
  if (!Number.isNaN(lat) && (lat < -90 || lat > 90)) errors.push({ field: 'lat', message: 'Latitude must be between −90° and +90°.' });
  if (!Number.isNaN(lon) && (lon < -180 || lon > 180)) errors.push({ field: 'lon', message: 'Longitude must be between −180° and +180°.' });
  if (!Number.isNaN(off)) {
    if (off < -12 || off > 14) errors.push({ field: 'offset', message: 'UTC offset must be between −12 and +14.' });
    else if (Math.abs(off * 4 - Math.round(off * 4)) > 1e-9) errors.push({ field: 'offset', message: 'UTC offset must be in 15-minute steps.' });
  }

  // offset-vs-longitude sanity (advisory)
  if (!Number.isNaN(lon) && !Number.isNaN(off) && Math.abs(lon / 15 - off) > 3) {
    hints.push({ field: 'offset', message: `${formatOffset(off)} is unusual for longitude ${lon}° — check the offset (and daylight-saving).` });
  }
  // circular-polar houses (advisory)
  if (!Number.isNaN(lat) && Math.abs(lat) > 66) {
    hints.push({ field: 'lat', message: 'Above the polar circles quadrant house systems degrade; Whole Sign is safer.' });
  }
  // era accuracy — casting silent, study/illustrative advisory, out-of-range blocking
  if (date) {
    const ym = /^(-?\d+)/.exec(date);
    const year = ym ? parseInt(ym[1], 10) : NaN;
    if (!Number.isNaN(year)) {
      let era; try { era = eraAccuracy(year); } catch (e) { era = null; }
      if (era) {
        if (era.grade === 'refuse') errors.push({ field: 'date', message: era.note || 'This date is outside the engine’s defensible range.' });
        else if (era.grade === 'study' || era.grade === 'illustrative') hints.push({ field: 'date', message: `${era.label}: ${era.note}` });
      }
    }
  }
  return { errors, hints };
}

// ===========================================================================
//  RECENT PLACES — one localStorage memory, shared across every tool.
// ===========================================================================
const RECENTS_KEY = 'wb-recent-places';
const RECENTS_CAP = 8;

function readRecents() {
  try { const a = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); return Array.isArray(a) ? a : []; }
  catch (e) { return []; }
}
function writeRecents(list) {
  try { localStorage.setItem(RECENTS_KEY, JSON.stringify(list.slice(0, RECENTS_CAP))); } catch (e) { /* non-fatal */ }
}
function pushRecent(place) {
  if (!place || place.lat == null || place.lon == null) return readRecents();
  const key = p => `${Math.round(p.lat * 100)},${Math.round(p.lon * 100)}`;
  const list = readRecents().filter(p => key(p) !== key(place));
  list.unshift({ name: place.name || `${place.lat}, ${place.lon}`, lat: place.lat, lon: place.lon, offset: place.offset, ts: Date.now() });
  writeRecents(list);
  return list.slice(0, RECENTS_CAP);
}

// ===========================================================================
//  mountMomentPicker — the DOM component. Returns an API the host calls.
// ===========================================================================
export function mountMomentPicker(container, opts = {}) {
  if (!container) throw new Error('moment-picker: container is required.');
  const mode = opts.mode || 'now';
  const ids = opts.ids || {};
  const persist = opts.persist || 'wb';
  const onChange = typeof opts.onChange === 'function' ? opts.onChange : () => {};
  const uid = persist + '-mp';

  // --- resolve legacy inputs; THROW if any configured id is missing ---------
  const need = ['lat', 'lon', 'date', 'time', 'offset'];
  const legacy = {};
  for (const k of need) {
    const id = ids[k];
    if (!id) throw new Error(`moment-picker: missing legacy id mapping for "${k}".`);
    const el = document.getElementById(id);
    if (!el) throw new Error(`moment-picker: legacy input #${id} (${k}) not found in the page.`);
    legacy[k] = el;
  }

  const setLegacy = (k, v) => {
    const el = legacy[k];
    if (!el) return;
    el.value = v;
    try { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { /* */ }
  };

  // --- build DOM ------------------------------------------------------------
  const showNow = mode === 'now' || mode === 'question';
  const fs = document.createElement('fieldset');
  fs.className = 'mp';
  fs.innerHTML = `
    <legend>${opts.label || 'The moment &amp; place'}</legend>
    <div class="mp-group mp-place">
      <span class="mp-label" id="${uid}-placelbl">Place</span>
      <div class="mp-place-row">
        <div class="mp-combo">
          <input id="${uid}-city" class="mp-city" type="search" role="combobox" autocomplete="off"
                 aria-expanded="false" aria-controls="${uid}-list" aria-autocomplete="list"
                 aria-labelledby="${uid}-placelbl" placeholder="🔍 place…">
          <ul id="${uid}-list" class="mp-listbox" role="listbox" aria-label="Places" hidden></ul>
        </div>
        <button type="button" class="btn-secondary sm mp-geo" id="${uid}-geo">📍 Use my location</button>
        <span class="small muted mp-geo-status" id="${uid}-geostatus"></span>
      </div>
      <div class="mp-chips" id="${uid}-chips" aria-label="Recent places"></div>
      <details class="mp-coords" id="${uid}-coords">
        <summary class="small">coordinates &amp; offset</summary>
        <div class="mp-coords-row">
          <div class="field"><label for="${uid}-lat">Lat °N</label><input id="${uid}-lat" type="number" step="0.0001" inputmode="decimal" style="width:7rem"></div>
          <div class="field"><label for="${uid}-lon">Lon °E</label><input id="${uid}-lon" type="number" step="0.0001" inputmode="decimal" style="width:7rem"></div>
          <div class="field"><label for="${uid}-off">UTC offset</label>
            <select id="${uid}-off" style="width:22rem;max-width:100%"></select>
            <input id="${uid}-offnum" type="number" step="0.25" hidden style="width:6rem" aria-label="Custom UTC offset (decimal hours)">
          </div>
        </div>
      </details>
    </div>
    <div class="mp-group mp-when">
      <span class="mp-label" id="${uid}-whenlbl">When</span>
      <div class="mp-when-row">
        <div class="field"><label for="${uid}-date">Date</label><input id="${uid}-date" type="date"></div>
        <div class="field"><label for="${uid}-time">Time (local)</label><input id="${uid}-time" type="time"></div>
        ${showNow ? `<button type="button" class="btn-secondary sm mp-now" id="${uid}-now">⏱ Now</button>` : ''}
      </div>
    </div>
    <p class="mp-hint" id="${uid}-hint" hidden></p>
    <p class="mp-error" id="${uid}-error" role="alert" hidden></p>`;
  container.appendChild(fs);
  container.dataset.mpMode = mode;

  const $ = sel => fs.querySelector(sel);
  const cityInput = $(`#${uid}-city`);
  const listbox = $(`#${uid}-list`);
  const chipsEl = $(`#${uid}-chips`);
  const coords = $(`#${uid}-coords`);
  const latEl = $(`#${uid}-lat`);
  const lonEl = $(`#${uid}-lon`);
  const offSel = $(`#${uid}-off`);
  const offNum = $(`#${uid}-offnum`);
  const dateEl = $(`#${uid}-date`);
  const timeEl = $(`#${uid}-time`);
  const nowBtn = $(`#${uid}-now`);
  const hintEl = $(`#${uid}-hint`);
  const errorEl = $(`#${uid}-error`);

  // populate the offset select
  offSel.innerHTML = OFFSETS.map((o, i) => `<option value="${o.value}" data-i="${i}">${o.label}</option>`).join('')
    + `<option value="custom">custom… (enter a decimal offset)</option>`;

  // --- two-way binds: visible control → hidden legacy input -----------------
  latEl.addEventListener('input', () => { setLegacy('lat', latEl.value); onChange(); });
  lonEl.addEventListener('input', () => { setLegacy('lon', lonEl.value); onChange(); });
  dateEl.addEventListener('input', () => { setLegacy('date', dateEl.value); onChange(); });
  timeEl.addEventListener('input', () => { setLegacy('time', timeEl.value); onChange(); });

  const applyOffset = () => {
    if (offSel.value === 'custom') { offNum.hidden = false; setLegacy('offset', offNum.value); }
    else { offNum.hidden = true; setLegacy('offset', offSel.value); }
    onChange();
  };
  offSel.addEventListener('change', applyOffset);
  offNum.addEventListener('input', () => { setLegacy('offset', offNum.value); onChange(); });

  // set the offset <select> to a numeric value (first non-DST matching row = standard)
  function selectOffset(value) {
    const rows = Array.from(offSel.options);
    const match = rows.find(o => o.value !== 'custom' && Number(o.value) === value && !OFFSETS[Number(o.dataset.i)].dst)
      || rows.find(o => o.value !== 'custom' && Number(o.value) === value);
    if (match) { offSel.value = match.value; offNum.hidden = true; }
    else { offSel.value = 'custom'; offNum.hidden = false; offNum.value = value; }
    applyOffset();
  }

  // --- initialise from any pre-filled legacy values (share links) -----------
  if (legacy.lat.value) latEl.value = legacy.lat.value;
  if (legacy.lon.value) lonEl.value = legacy.lon.value;
  if (legacy.date.value) dateEl.value = legacy.date.value;
  if (legacy.time.value) timeEl.value = legacy.time.value;
  if (legacy.offset.value !== '') selectOffset(Number(legacy.offset.value));

  // --- choose a city: fill fields + DST hint --------------------------------
  function chooseCity(row) {
    const [name, lat, lon] = row;
    const { standard, summer } = offsetPairForCity(row);
    cityInput.value = name;
    latEl.value = lat; lonEl.value = lon;
    setLegacy('lat', lat); setLegacy('lon', lon);
    selectOffset(standard);
    if (summer != null) showHint(`Set to ${formatOffset(standard)} (standard) for ${name}. ⚠ If daylight-saving was in force at this clock time, pick the summer offset (${formatOffset(summer)}).`);
    else showHint(`Set to ${formatOffset(standard)} for ${name} — this place keeps one offset all year.`);
    closeList();
    onChange();
  }
  function choosePlace(p) {   // a recent {name,lat,lon,offset}
    cityInput.value = p.name || '';
    latEl.value = p.lat; lonEl.value = p.lon;
    setLegacy('lat', p.lat); setLegacy('lon', p.lon);
    if (p.offset != null) selectOffset(Number(p.offset));
    closeList();
    onChange();
  }

  // --- the combobox listbox -------------------------------------------------
  let activeIdx = -1, currentRows = [];
  function buildRows(q) {
    const query = (q || '').trim().toLowerCase();
    const rows = [];
    for (const r of readRecents()) {
      if (!query || (r.name || '').toLowerCase().includes(query)) rows.push({ kind: 'recent', place: r, label: r.name });
    }
    for (const c of CITIES) {
      if (!query || c[0].toLowerCase().includes(query)) rows.push({ kind: 'city', row: c, label: c[0] });
    }
    rows.push({ kind: 'coords', label: 'Use coordinates…' });
    return rows.slice(0, 40);
  }
  function renderList(q) {
    currentRows = buildRows(q);
    activeIdx = -1;
    listbox.innerHTML = currentRows.map((r, i) => {
      const badge = r.kind === 'recent' ? '<span class="mp-opt-badge">recent</span>' : (r.kind === 'coords' ? '<span class="mp-opt-badge">▸</span>' : '');
      return `<li id="${uid}-opt-${i}" role="option" class="mp-opt mp-opt--${r.kind}" aria-selected="false">${badge}<span>${escapeHtml(r.label)}</span></li>`;
    }).join('');
    listbox.hidden = currentRows.length === 0;
    cityInput.setAttribute('aria-expanded', String(!listbox.hidden));
  }
  function openList() { renderList(cityInput.value); }
  function closeList() { listbox.hidden = true; cityInput.setAttribute('aria-expanded', 'false'); cityInput.removeAttribute('aria-activedescendant'); activeIdx = -1; }
  function setActive(i) {
    const opts = Array.from(listbox.querySelectorAll('.mp-opt'));
    opts.forEach(o => o.setAttribute('aria-selected', 'false'));
    if (i < 0 || i >= opts.length) { activeIdx = -1; cityInput.removeAttribute('aria-activedescendant'); return; }
    activeIdx = i;
    opts[i].setAttribute('aria-selected', 'true');
    cityInput.setAttribute('aria-activedescendant', opts[i].id);
    try { opts[i].scrollIntoView({ block: 'nearest' }); } catch (e) { /* */ }
  }
  function commitRow(i) {
    const r = currentRows[i];
    if (!r) return;
    if (r.kind === 'recent') choosePlace(r.place);
    else if (r.kind === 'city') chooseCity(r.row);
    else { closeList(); coords.open = true; latEl.focus(); }
  }

  cityInput.addEventListener('focus', openList);
  cityInput.addEventListener('input', () => renderList(cityInput.value));
  cityInput.addEventListener('keydown', e => {
    if (listbox.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) openList();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIdx + 1, currentRows.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
    else if (e.key === 'Enter') { if (activeIdx >= 0) { e.preventDefault(); commitRow(activeIdx); } }
    else if (e.key === 'Escape') { if (!listbox.hidden) { e.preventDefault(); closeList(); } }
  });
  listbox.addEventListener('mousedown', e => {   // mousedown so blur doesn't beat it
    const li = e.target.closest('.mp-opt');
    if (!li) return;
    e.preventDefault();
    commitRow(Array.from(listbox.children).indexOf(li));
  });
  document.addEventListener('click', e => { if (!fs.contains(e.target)) closeList(); });

  // --- recents chips --------------------------------------------------------
  function renderChips() {
    const recents = readRecents();
    if (!recents.length) { chipsEl.innerHTML = ''; return; }
    chipsEl.innerHTML = `<span class="mp-chips-label small muted">recent:</span>` + recents.map((p, i) =>
      `<span class="mp-chip" data-i="${i}"><button type="button" class="mp-chip-pick">${escapeHtml(p.name || '')}</button><button type="button" class="mp-chip-x" aria-label="Remove ${escapeHtml(p.name || '')}">×</button></span>`).join('');
  }
  chipsEl.addEventListener('click', e => {
    const chip = e.target.closest('.mp-chip'); if (!chip) return;
    const i = Number(chip.dataset.i);
    const recents = readRecents();
    if (e.target.closest('.mp-chip-x')) { recents.splice(i, 1); writeRecents(recents); renderChips(); }
    else if (e.target.closest('.mp-chip-pick')) { if (recents[i]) choosePlace(recents[i]); }
  });
  renderChips();

  // --- geolocate ------------------------------------------------------------
  attachGeolocate($(`#${uid}-geo`), latEl, lonEl, $(`#${uid}-geostatus`), ({ lat, lon }) => {
    setLegacy('lat', lat); setLegacy('lon', lon);
    const near = nearestCity(lat, lon);
    if (near) selectOffset(near.offset);
    if (mode !== 'birth') {   // "here AND now" — never for a birth moment
      const f = nowLocalFields();
      dateEl.value = f.date; timeEl.value = f.time;
      setLegacy('date', f.date); setLegacy('time', f.time);
    }
    onChange();
  });

  // --- Now ------------------------------------------------------------------
  if (nowBtn) nowBtn.addEventListener('click', () => {
    const f = nowLocalFields();
    dateEl.value = f.date; timeEl.value = f.time;
    setLegacy('date', f.date); setLegacy('time', f.time);
    selectOffset(f.offset);
    onChange();
  });

  // --- validation surface ---------------------------------------------------
  function currentFields() {
    return { lat: latEl.value, lon: lonEl.value, offset: offSel.value === 'custom' ? offNum.value : offSel.value, date: dateEl.value, time: timeEl.value };
  }
  function showHint(msg) { hintEl.textContent = msg; hintEl.hidden = !msg; }
  function showError(msg) { errorEl.textContent = msg; errorEl.hidden = !msg; }
  function clearInvalid() {
    [latEl, lonEl, dateEl, timeEl, offSel, offNum].forEach(el => { el.removeAttribute('aria-invalid'); el.classList.remove('is-invalid'); el.removeAttribute('aria-describedby'); });
  }
  const fieldEl = f => ({ lat: latEl, lon: lonEl, date: dateEl, time: timeEl, offset: offSel }[f] || null);

  function validate({ focusFirst = false } = {}) {
    const { errors, hints } = validateMoment(currentFields());
    clearInvalid();
    if (errors.length) {
      showError(errors.map(e => e.message).join(' '));
      errors.forEach(e => { const el = fieldEl(e.field); if (el) { el.setAttribute('aria-invalid', 'true'); el.classList.add('is-invalid'); el.setAttribute('aria-describedby', errorEl.id); } });
      if (focusFirst) { const el = fieldEl(errors[0].field); if (el && el.focus) { if (el === latEl || el === lonEl) coords.open = true; el.focus(); } }
    } else showError('');
    if (hints.length) showHint(hints.map(h => h.message).join(' '));
    return { ok: errors.length === 0, errors, hints };
  }
  [latEl, lonEl, dateEl, timeEl].forEach(el => el.addEventListener('blur', () => validate()));
  offSel.addEventListener('blur', () => validate());

  // ---- public API ----------------------------------------------------------
  return {
    validate,
    isValid: () => validate().ok,
    fields: currentFields,
    commitRecent() {
      const lat = Number(latEl.value), lon = Number(lonEl.value);
      if (Number.isNaN(lat) || Number.isNaN(lon)) return;
      const offset = offSel.value === 'custom' ? Number(offNum.value) : Number(offSel.value);
      pushRecent({ name: cityInput.value || `${lat}, ${lon}`, lat, lon, offset });
      renderChips();
    },
    refresh() { renderChips(); },
    setMoment({ date, time, offset } = {}) {
      if (date != null) { dateEl.value = date; setLegacy('date', date); }
      if (time != null) { timeEl.value = time; setLegacy('time', time); }
      if (offset != null) selectOffset(Number(offset));
    },
    el: fs,
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
