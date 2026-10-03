import { CALENDARS, PRAYER_METHODS, civilToJD, fromJD, formatCivil, utcInstant, validateZone, calendarAtInstant, easter, prayerTimes, qibla } from '../core/cultural-calendars.js';

const $ = id => document.getElementById(id);
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const PLACES = {
  london: [51.5074, -0.1278, 'Europe/London'], delhi: [28.6139, 77.209, 'Asia/Kolkata'],
  makkah: [21.4225, 39.8262, 'Asia/Riyadh'], newyork: [40.7128, -74.006, 'America/New_York'],
  sydney: [-33.8688, 151.2093, 'Australia/Sydney'], tromso: [69.6492, 18.9553, 'Europe/Oslo'],
};
function report(id, text, error = false) { const el = $(id); el.textContent = text; el.classList.toggle('cal-error', error); }
function guarded(action, status, resultIds = []) {
  try { action(); }
  catch (error) { resultIds.forEach(id => { $(id).replaceChildren(); }); report(status, error.message || 'Calculation unavailable. Check your inputs.', true); }
}
function number(id) {
  if (!$(id).value.trim()) throw new RangeError('Complete all numeric fields.');
  return Number($(id).value);
}
function localDate(date, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function compareDates() {
  const date = utcInstant($('cal-date').value, $('cal-time').value), zone = validateZone($('cal-zone').value);
  const results = CALENDARS.map(calendar => ({ ...calendar, result: calendarAtInstant(date, calendar.id, zone) }));
  $('cal-results').innerHTML = results.map(({ id, label, note, result }) => `<article class="cal-date-card"><h3>${label}</h3><p class="cal-value">${escape(result.text)}</p><p class="small"><code>${id}</code> · ${escape(note)}</p></article>`).join('');
  const local = new Intl.DateTimeFormat('en-GB', { timeZone: zone, dateStyle: 'full', timeStyle: 'short' }).format(date);
  report('cal-status', `${local} (${zone}). Input: ${date.toISOString().slice(0, 16).replace('T', ' ')} UTC.`);
}
function calculatePrayer() {
  const latitude = number('prayer-lat'), longitude = number('prayer-lon');
  const options = { date: $('prayer-date').value, latitude, longitude, timeZone: $('prayer-zone').value, method: $('prayer-method').value, asr: $('prayer-asr').value, highLatitude: $('prayer-high').value, ishaAdjustment: number('prayer-isha') };
  const result = prayerTimes(options), bearing = qibla(latitude, longitude);
  $('prayer-results').innerHTML = `<dl class="cal-times">${result.times.map(time => `<div class="cal-time"><dt>${time.name[0].toUpperCase() + time.name.slice(1)}</dt><dd${time.available ? '' : ' class="cal-unavailable"'}>${escape(time.text)}</dd>${time.differentDate ? `<dd class="cal-unavailable">${escape(time.localDate)} local</dd>` : ''}</div>`).join('')}</dl><p class="small muted">${escape(result.method)} · Asr ${escape(result.asr)} · twilight limit ${escape(result.highLatitude)} · extra Isha ${result.ishaAdjustment >= 0 ? '+' : ''}${result.ishaAdjustment} minutes. Times include the selected method's built-in adjustments and minute rounding.</p>`;
  $('qibla-result').innerHTML = `<h3>Qibla direction</h3>${bearing.available ? `<p class="cal-bearing">${bearing.bearing.toFixed(1)}° <span class="small">clockwise from true north</span></p><p class="small muted">From ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E. Numerical bearing; no live compass alignment.</p>` : `<p>${escape(bearing.reason)}</p>`}`;
  report('prayer-status', `${options.date} in ${result.timeZone} · ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E.${result.complete ? '' : ' Some events are unavailable: the selected method cannot resolve this polar day or night.'}`);
}
function showConversion(jd) {
  const result = fromJD(jd), seconds = Math.min(86399, Math.round(result.utcHours * 3600));
  const time = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  $('convert-jd').value = jd.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  $('convert-result').classList.remove('cal-error');
  $('convert-result').innerHTML = `<dl class="cal-definition"><dt>Gregorian</dt><dd>${formatCivil(result.gregorian)}</dd><dt>Julian</dt><dd>${formatCivil(result.julian)}</dd><dt>UTC time (nearest second)</dt><dd>${time}</dd><dt>Julian day</dt><dd>${jd.toFixed(6)}</dd><dt>JDN at this day's noon</dt><dd>${result.jdn}</dd></dl>`;
}
function calculateEaster() {
  const year = number('easter-year'), gregorian = easter(year), julian = easter(year, 'julian');
  $('easter-result').classList.remove('cal-error');
  $('easter-result').innerHTML = `<h3>Gregorian computus</h3><p class="cal-value">${formatCivil(gregorian.gregorian)} Gregorian</p><h3>Julian computus</h3><p class="cal-value">${formatCivil(julian.gregorian)} Gregorian</p><p class="small">${formatCivil(julian.native)} in the Julian calendar.</p>`;
}

export function initCulturalCalendars() {
  let active = true;
  window.addEventListener('pagehide', () => { active = false; });
  window.addEventListener('pageshow', () => { active = true; });
  $('prayer-method').innerHTML = PRAYER_METHODS.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  const setNow = () => { const now = new Date(); $('cal-date').value = now.toISOString().slice(0, 10); $('cal-time').value = now.toISOString().slice(11, 16); };
  setNow();
  $('cal-zone').value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  $('prayer-date').value = localDate(new Date(), 'Europe/London');
  $('easter-year').value = new Date().getUTCFullYear();
  const calendars = () => guarded(compareDates, 'cal-status', ['cal-results']);
  const prayers = () => guarded(calculatePrayer, 'prayer-status', ['prayer-results', 'qibla-result']);
  $('cal-form').addEventListener('submit', event => { event.preventDefault(); calendars(); });
  $('cal-now').addEventListener('click', () => { setNow(); calendars(); });
  $('prayer-form').addEventListener('submit', event => { event.preventDefault(); prayers(); });
  $('convert-form').addEventListener('submit', event => { event.preventDefault(); guarded(() => showConversion(civilToJD($('convert-date').value, $('convert-calendar').value, number('convert-hour'))), 'convert-result'); });
  $('jd-form').addEventListener('submit', event => { event.preventDefault(); guarded(() => showConversion(number('convert-jd')), 'convert-result'); });
  $('easter-form').addEventListener('submit', event => { event.preventDefault(); guarded(calculateEaster, 'easter-result'); });
  $('cal-form').addEventListener('input', () => { $('cal-results').replaceChildren(); report('cal-status', 'Inputs changed. Choose Compare dates to update.'); });
  $('prayer-form').addEventListener('input', () => { $('prayer-results').replaceChildren(); $('qibla-result').replaceChildren(); report('prayer-status', 'Inputs changed. Calculate times & direction to update.'); });
  $('prayer-place').addEventListener('change', () => {
    const place = PLACES[$('prayer-place').value]; if (!place) return;
    [$('prayer-lat').value, $('prayer-lon').value, $('prayer-zone').value] = place;
    report('prayer-location-status', `Preset selected: ${$('prayer-place').selectedOptions[0].textContent}. Verify the date and method before use.`);
    prayers();
  });
  ['prayer-lat', 'prayer-lon'].forEach(id => $(id).addEventListener('input', () => { $('prayer-place').value = 'custom'; }));
  $('prayer-locate').addEventListener('click', () => {
    if (!navigator.geolocation) { report('prayer-location-status', 'This browser has no location service. Enter coordinates manually.', true); return; }
    $('prayer-locate').disabled = true;
    report('prayer-location-status', 'Requesting device location… You can also enter coordinates manually.');
    navigator.geolocation.getCurrentPosition(position => {
      if (!active) { $('prayer-locate').disabled = false; return; }
      $('prayer-locate').disabled = false;
      $('prayer-lat').value = position.coords.latitude.toFixed(6); $('prayer-lon').value = position.coords.longitude.toFixed(6); $('prayer-place').value = 'custom';
      $('prayer-zone').value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      report('prayer-location-status', `Location accuracy about ${Math.round(position.coords.accuracy)} m. Device time zone: ${$('prayer-zone').value}; check that it matches this location. Coordinates stay in this browser.`);
      prayers();
    }, error => { $('prayer-locate').disabled = false; if (active) report('prayer-location-status', error.code === 1 ? 'Location permission denied. Enter coordinates and time zone manually.' : 'Location unavailable. Enter coordinates and time zone manually.', true); }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });
  calendars(); prayers(); guarded(() => showConversion(2451545), 'convert-result'); guarded(calculateEaster, 'easter-result');
}
