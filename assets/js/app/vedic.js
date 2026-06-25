// ============================================================================
//  vedic.js (app) — drives pages/vedic/index.html, the dedicated Jagannath-Hora
//  (Vedic / sidereal) page. Casts a chart on the shared verified engine and
//  renders the full sidereal reading via the shared renderVedicPanel.
// ============================================================================
import { wireCitySelect, toUTC } from './shared.js';
import { castChart } from '../core/astro.js';
import { renderVedicPanel } from './vedic-panel.js';
import { writeStateToURL, readStateFromURL, copyShareLink } from './state.js';

const $ = id => document.getElementById(id);
const KEYS = ['date', 'time', 'offset', 'lat', 'lon'];

export function initVedic() {
  $('v-date').value = '1990-05-15'; $('v-time').value = '12:00'; $('v-offset').value = 0;
  $('v-lat').value = 51.5074; $('v-lon').value = -0.1278;
  wireCitySelect($('v-city'), $('v-lat'), $('v-lon'), $('v-offset'));

  $('v-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  $('v-copy').addEventListener('click', () => copyShareLink($('v-copy-status'), state()));
  $('v-print').addEventListener('click', () => window.print());

  const s = readStateFromURL(KEYS);
  for (const k of KEYS) if (s[k] != null && s[k] !== '') $('v-' + k).value = s[k];
  run();
}

function state() {
  return { date: $('v-date').value, time: $('v-time').value, offset: $('v-offset').value, lat: $('v-lat').value, lon: $('v-lon').value };
}

function run() {
  const lat = parseFloat($('v-lat').value), lon = parseFloat($('v-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('v-copy-status').textContent = 'Enter a latitude and longitude.'; return; }
  const date = toUTC($('v-date').value, $('v-time').value, parseFloat($('v-offset').value) || 0);
  try {
    const chart = castChart(date, lat, lon, 'whole');
    renderVedicPanel($('v-out'), chart, { currentDate: new Date() });
    writeStateToURL(state());
    $('v-copy-status').textContent = '';
  } catch (e) { $('v-out').innerHTML = '<p class="muted">Could not compute the chart.</p>'; }
}
