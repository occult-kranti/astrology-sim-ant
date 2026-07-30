// ============================================================================
//  vedic.js (app) — drives pages/vedic/index.html, the dedicated Jagannath-Hora
//  (Vedic / sidereal) page. Casts a chart on the shared verified engine and
//  renders the full sidereal reading via the shared renderVedicPanel.
//
//  R33 — the reading is now also EXPLAINABLE. The module keeps the canonical
//  last-report accessor (the pattern muhurta.js established: a module-level
//  lastReport + reportSubs + notifyReport + an exported current…Report()) and
//  mounts the shared divination assistant with kind 'vedic'. The assistant is
//  an EXPLAINER, not an oracle: it makes the computed ṣaḍbala rūpas, the
//  running Vimśottarī period, the aṣṭakavarga bindus and the conclusion lines
//  legible, with the rule that produced each one. The prefilled question chips
//  below the reading only FILL the box — they never send, so they work with no
//  API key at all.
//
//  The mount is dynamically imported and fully guarded: a missing assistant
//  module, or a page without the #dv-assistant host, can never stop the chart
//  from being computed and drawn. Information first, AI second.
// ============================================================================
import { wireCitySelect, toUTC } from './shared.js';
import { nearestCity } from './location.js';
import { castChart } from '../core/astro.js';
import { renderVedicPanel } from './vedic-panel.js';
import { writeStateToURL, readStateFromURL, copyShareLink } from './state.js';

const $ = id => document.getElementById(id);
const KEYS = ['date', 'time', 'offset', 'lat', 'lon'];

// ---------------------------------------------------------------------------
//  The last computed sidereal reading, exposed for the AI assistant panel.
//  `null` whenever the page has no valid cast — so the panel shows its honest
//  emptyText instead of narrating a stale chart.
// ---------------------------------------------------------------------------
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };

/** @returns {{v:object, chart:object, moment:{dateISO:string,offset:number,lat:number,lon:number,place:string}, conclusions:object|null}|null} */
export function currentVedicReport() { return lastReport; }

// The prefilled "explain this" chips. They are declared in the page markup
// (so they exist and are readable with JavaScript disabled); this list is the
// fallback used only if the page ships none.
const FALLBACK_CHIPS = [
  'Explain my Ṣaḍbala numbers — what is a rūpa, and what does the required minimum mean?',
  'Why is this Vimśottarī daśā running now? Show me how the balance at birth produced it.',
  'What do the Aṣṭakavarga bindus actually count?',
  'Where does this sidereal chart disagree with the tropical one, and why?',
  'Which classical rule produced each conclusion line?',
];

const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };

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

  // introspection hook for the headless/Chromium sweeps (mirrors __cflNav)
  try { window.__vedicReport = () => currentVedicReport(); } catch { /* non-fatal */ }

  mountAssistant();
}

// ---------------------------------------------------------------------------
//  The AI explainer. Dynamically imported + guarded so a partial tree, a blocked
//  module or an absent panel host degrades to "the page still computes and
//  draws the chart" — never to a broken page.
// ---------------------------------------------------------------------------
async function mountAssistant() {
  if (!$('dv-assistant')) { wireChips(null); return; }
  let handle = null;
  const da = await import('./divination-assistant.js').catch(() => null);
  if (da && da.initDivinationAssistant) {
    try {
      handle = da.initDivinationAssistant({
        kind: 'vedic',
        getReading: currentVedicReport,
        subscribeReading: cb => reportSubs.push(cb),
        copy: {
          emptyText: 'Cast the sidereal chart above first.',
          placeholder: 'Ask about this sidereal reading… (e.g. “what is a rūpa, and does my Mercury clear its bar?”)',
        },
      }) || null;
    } catch { handle = null; /* non-fatal */ }
  }
  wireChips(handle);
}

// The chips fill the assistant's question box and focus it. They NEVER send:
// a prefilled question costs nothing, needs no API key, and stays editable.
// (Candidate upstream API: divination-assistant exposes `prefill(text)` on its
// init handle and as a module export; the textarea fallback below is only for
// the case where neither is reachable.)
function wireChips(handle) {
  const host = $('v-ai-chips');
  if (!host) return;
  const prefill = text => {
    if (handle && typeof handle.prefill === 'function') { try { handle.prefill(text); return; } catch { /* fall through */ } }
    const input = document.getElementById('dv-asst-input');
    if (!input) return;
    input.value = text;
    try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch { /* non-fatal */ }
    const card = $('dv-assistant-card') || $('dv-assistant');
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'center' });
    try { input.focus(); } catch { /* non-fatal */ }
  };
  host.addEventListener('click', e => {
    const btn = e.target.closest('button[data-q]');
    if (!btn) return;
    e.preventDefault();
    prefill(btn.dataset.q || btn.textContent.trim() || FALLBACK_CHIPS[0]);
  });
}

// ---------------------------------------------------------------------------
function state() {
  return { date: $('v-date').value, time: $('v-time').value, offset: $('v-offset').value, lat: $('v-lat').value, lon: $('v-lon').value };
}

// The human place label the assistant may name. A chosen preset gives its own
// name; otherwise the coordinates are the truth and the nearest listed city is
// offered only as an explicit approximation — never as a claim about the place.
function placeLabel(lat, lon) {
  const sel = $('v-city');
  if (sel && sel.value !== '' && sel.selectedIndex > 0) {
    const t = (sel.options[sel.selectedIndex].textContent || '').trim();
    if (t) return t;
  }
  const co = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? 'E' : 'W'}`;
  try {
    const near = nearestCity(lat, lon);
    if (near) return `${co} (nearest listed city: ${near.name}, ≈${Math.round(near.distanceKm)} km)`;
  } catch { /* non-fatal */ }
  return co;
}

function clearReport() { if (lastReport !== null) { lastReport = null; notifyReport(); } }

function run() {
  const lat = parseFloat($('v-lat').value), lon = parseFloat($('v-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('v-copy-status').textContent = 'Enter a latitude and longitude.'; clearReport(); return; }
  const offset = parseFloat($('v-offset').value) || 0;
  const date = toUTC($('v-date').value, $('v-time').value, offset);
  try {
    const chart = castChart(date, lat, lon, 'whole');
    const v = renderVedicPanel($('v-out'), chart, { currentDate: new Date() });
    writeStateToURL(state());
    $('v-copy-status').textContent = '';
    if (!v) { clearReport(); return; }            // the panel rendered its own failure notice
    lastReport = {
      v,
      chart,
      moment: {
        dateISO: (date instanceof Date && !isNaN(date)) ? date.toISOString() : '',
        offset, lat, lon,
        place: placeLabel(lat, lon),
      },
      conclusions: v.conclusions || null,
    };
    notifyReport();
  } catch (e) {
    $('v-out').innerHTML = '<p class="muted">Could not compute the chart.</p>';
    clearReport();
  }
}
