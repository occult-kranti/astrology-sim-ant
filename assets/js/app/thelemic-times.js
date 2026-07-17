// ============================================================================
//  thelemic-times.js (app) — drives pages/thelemic-times.html. All DOM lives
//  here; the pure engine is core/thelemic.js (eraLegis + solarStations), which
//  runs entirely on the site's existing astronomy engine.
//
//  ONE page, TWO museum panels:
//    A — ERA LEGIS: the Thelemic "Anno" date-stamp Aleister Crowley used, in the
//        {docosade}{year} Roman-numeral form, with the ☉/☽ sign stamp. The
//        year-start is CONTESTED (exact vernal-equinox instant vs the
//        conventional March 20); both are exposed, exact is the default.
//    B — LIBER RESH: the four solar stations (sunrise / noon / sunset /
//        midnight) at which Liber Resh vel Helios (1911) directs its adorations
//        of the Sun — presented as the historical rubric, not an instruction.
//
//  MUSEUM VOICE (binding): historical description, cited to pre-1931 PD
//  witnesses, with the standing no-validity note. Nothing here tells the reader
//  to do anything or claims any effect.
// ============================================================================
import { mountChrome, toUTC } from './shared.js';
import { computeFlow, mountActionBar } from './action-bar.js';
import { eraLegis, solarStations } from '../core/thelemic.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// "UTC+5:30" style label for a decimal-hours offset (self-contained).
function formatOffset(v) {
  const sign = v < 0 ? '−' : '+';
  const a = Math.abs(v), h = Math.floor(a), m = Math.round((a - h) * 60);
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

let picker = null;
let lastEra = null, lastResh = null, lastCtx = null;
let actionBar = null;

// Format a UTC Date at a chosen whole/decimal UTC offset → "HH:MM" local clock.
function localClock(date, offsetHours) {
  const shifted = new Date(date.getTime() + offsetHours * 3600000);
  const hh = String(shifted.getUTCHours()).padStart(2, '0');
  const mm = String(shifted.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
function localDateLabel(date, offsetHours) {
  const shifted = new Date(date.getTime() + offsetHours * 3600000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[shifted.getUTCDay()]} ${shifted.getUTCDate()} ${mons[shifted.getUTCMonth()]} ${shifted.getUTCFullYear()}`;
}

async function mountPicker() {
  const host = $('tt-picker');
  if (!host) return;
  const mod = await import('./moment-picker.js').catch(() => null);
  if (!mod || !mod.mountMomentPicker) return;
  try {
    picker = mod.mountMomentPicker(host, {
      mode: 'now',
      ids: { lat: 'tt-lat', lon: 'tt-lon', date: 'tt-date', time: 'tt-time', offset: 'tt-offset' },
      label: 'The moment & place',
      persist: 'wb',
      onChange: () => {},
    });
  } catch { /* mountMomentPicker throws on a missing legacy id — non-fatal */ }
}

export function initThelemicTimes() {
  mountChrome('thelemictimes');

  // defaults: here (London) & now
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  $('tt-date').value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  $('tt-time').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  $('tt-offset').value = -(now.getTimezoneOffset() / 60);
  $('tt-lat').value = 51.5074; $('tt-lon').value = -0.1278;

  // a shared link overrides the defaults (?date=&time=&lat=&lon=&offset=&mode=)
  const q = new URLSearchParams(location.search);
  const setIf = (id, key) => { if (q.get(key) != null && q.get(key) !== '') $(id).value = q.get(key); };
  setIf('tt-date', 'date'); setIf('tt-time', 'time');
  setIf('tt-lat', 'lat'); setIf('tt-lon', 'lon'); setIf('tt-offset', 'offset');
  if (q.get('mode') === 'march20') { const r = document.querySelector('input[name="tt-mode"][value="march20"]'); if (r) r.checked = true; }

  mountPicker();

  // the sticky results action bar (tool variant: an Export ▾ menu)
  const abHost = $('tt-actionbar');
  if (abHost) {
    actionBar = mountActionBar(abHost, {
      variant: 'tool',
      exports: [{ id: 'tt-export-md', label: 'Copy as text (Markdown)' }],
      copyLinkId: 'tt-copylink',
      summary: () => lastEra ? { verdict: `Anno ${lastEra.anno}`, verdictClass: 'badge--doc', text: lastEra.stamp } : {},
      top: true,
    });
    const md = $('tt-export-md');
    if (md) md.addEventListener('click', () => copyText(buildMarkdown()));
    const cl = $('tt-copylink');
    if (cl) cl.addEventListener('click', () => copyText(shareLink()));
  }

  $('tt-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  // recompute the Era Legis panel live when the year-start convention flips
  Array.from(document.querySelectorAll('input[name="tt-mode"]')).forEach(r =>
    r.addEventListener('change', () => { if (lastCtx) run(); }));

  run();
}

function selectedMode() {
  const r = document.querySelector('input[name="tt-mode"]:checked');
  return r && r.value === 'march20' ? 'march20' : 'exact';
}

function run() {
  const lat = parseFloat($('tt-lat').value), lon = parseFloat($('tt-lon').value);
  const offset = parseFloat($('tt-offset').value) || 0;
  const status = $('tt-status');
  if (isNaN(lat) || isNaN(lon)) { if (status) status.textContent = 'Enter a latitude and longitude.'; return; }
  if (!$('tt-date').value || !$('tt-time').value) { if (status) status.textContent = 'Enter a date and time.'; return; }
  if (status) status.textContent = '';

  const banner = $('tt-eralegis-card');
  computeFlow($('tt-compute'), status, () => {
    const date = toUTC($('tt-date').value, $('tt-time').value, offset);
    const mode = selectedMode();
    lastEra = eraLegis(date, { mode });
    // compute BOTH modes so the panel can state the contested alternative honestly
    const other = eraLegis(date, { mode: mode === 'exact' ? 'march20' : 'exact' });
    lastResh = solarStations(date, lat, lon);
    lastCtx = { date, lat, lon, offset, mode };
    renderEraLegis(lastEra, other, offset);
    renderResh(lastResh, offset, lat, lon);
    if (picker && picker.commitRecent) { try { picker.commitRecent(); } catch { /* */ } }
    if (actionBar) actionBar.show(lastEra);
  }, { banner, firstPanel: banner });
}

// ---------------------------------------------------------------------------
//  Panel A — Era Legis
// ---------------------------------------------------------------------------
function renderEraLegis(e, other, offset) {
  const host = $('tt-eralegis');
  if (!host) return;
  const modeLabel = e.mode === 'march20' ? 'conventional March 20' : 'exact vernal-equinox instant';
  const otherLabel = other.mode === 'march20' ? 'conventional March 20' : 'exact vernal-equinox instant';
  const yearStartLocal = `${localDateLabel(e.yearStart, offset)}, ${localClock(e.yearStart, offset)}`;
  const contested = e.anno !== other.anno
    ? `<p class="tt-contested"><span class="tt-flag">contested</span> This moment falls in the window where the two
        conventions disagree. By the ${esc(modeLabel)} the year is <b>${esc(e.anno)}</b>; by the ${esc(otherLabel)} it
        would be <b>${esc(other.anno)}</b>. Crowley's own dating followed the equinox; a fixed March-20 boundary is a
        later simplification. Both are shown; neither is "correct".</p>`
    : `<p class="small muted">The two year-start conventions (${esc(modeLabel)} vs ${esc(otherLabel)}) agree for this
        moment — they diverge only for the few hours between March 20 00:00 and the true equinox.</p>`;

  host.innerHTML = `
    <div class="tt-anno-hero">
      <div class="tt-anno" aria-label="Anno ${esc(e.anno)}">
        <span class="tt-anno-doc">${esc(e.docosadeRoman)}</span><span class="tt-anno-yr">${esc(e.yearRoman)}</span>
      </div>
      <div class="tt-anno-meta">
        <div class="tt-stamp">${esc(e.stamp)}</div>
        <div class="small muted">${esc(e.weekday)} · <i>${esc(e.dies)} æræ novæ</i></div>
      </div>
    </div>
    <p class="tt-reading">The tradition writes this moment as <b>Anno ${esc(e.anno)}</b> of the New Aeon —
      docosade <b>${esc(e.docosadeRoman)}</b> (${e.docosade}), year <b>${esc(e.yearRoman)}</b> (${e.yearWithin}) within it,
      i.e. ${e.yearsSince} year${e.yearsSince === 1 ? '' : 's'} since the epochal vernal equinox of 1904. The current
      Thelemic year began at ${esc(yearStartLocal)} (${esc(modeLabel)}).</p>
    ${contested}
    <div class="tt-note-hist"><b>How the notation works, as Crowley used it.</b> The New-Aeon year-count begins at the
      northern <b>vernal equinox of 1904</b>. Years are gathered into 22-year cycles he called <b>docosades</b>; a date
      is written as two Roman numerals — the docosade (upper-case) and the year within it 0–21 (lower-case), so the case
      alone tells them apart. The full stamp adds the Sun's and Moon's zodiacal places (<span class="tt-mono">${esc(e.stamp)}</span>)
      and the Latin day-name. Described as his calendrical practice; ${esc(e.citation)}</div>
    <p class="tt-noval">${esc(e.noValidity)}</p>`;
}

// ---------------------------------------------------------------------------
//  Panel B — Liber Resh solar stations
// ---------------------------------------------------------------------------
function renderResh(ss, offset, lat, lon) {
  const host = $('tt-resh');
  if (!host) return;
  if (!ss) {
    host.innerHTML = `<p class="muted">At this latitude and date the Sun does not rise and set in the ordinary way
      (polar day or night), so the four horizon stations are undefined. Try a lower latitude or another date.</p>`;
    return;
  }
  const rows = ss.stations.map(s => `
    <tr>
      <td class="tt-resh-time"><b>${esc(localClock(s.time, offset))}</b></td>
      <td class="tt-resh-name"><b>${esc(s.label)}</b> — <span class="tt-deity">${esc(s.deity)}</span></td>
      <td class="tt-resh-astro small muted">${esc(s.astronomy)}</td>
    </tr>`).join('');
  host.innerHTML = `
    <p class="small muted">Local clock times (${esc(formatOffset(offset))}) for
      ${lat.toFixed(2)}°, ${lon.toFixed(2)}° on ${esc(localDateLabel(ss.sunrise, offset))}.</p>
    <div class="table-scroll"><table class="data tt-resh-table">
      <thead><tr><th>Time</th><th>Station &amp; adoration</th><th>What it is, astronomically</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="tt-note-hist"><b>The four moments of Liber Resh.</b> The 1911 text has the aspirant salute the Sun at
      dawn (as <b>Ra</b>), at noon (as <b>Ahathoor</b>), at sunset (as <b>Tum</b>) and at midnight (as <b>Khephra</b>) —
      the sun rising, at its height, setting, and beneath the earth. What this panel shows is only the <b>astronomy</b>
      those four names mark: two horizon crossings and the two solar culminations (upper = noon, lower = midnight),
      computed for your place. ${esc(ss.citation)}</div>
    <p class="tt-noval">${esc(ss.noValidity)}</p>`;
}

// ---------------------------------------------------------------------------
//  Export helpers
// ---------------------------------------------------------------------------
function buildMarkdown() {
  if (!lastEra || !lastCtx) return '';
  const off = lastCtx.offset;
  let md = `# Thelemic times\n\n`;
  md += `## Era Legis — the Anno date-stamp\n`;
  md += `- **Anno ${lastEra.anno}** (docosade ${lastEra.docosadeRoman} = ${lastEra.docosade}, year ${lastEra.yearRoman} = ${lastEra.yearWithin})\n`;
  md += `- ${lastEra.stamp}\n`;
  md += `- ${lastEra.weekday} · ${lastEra.dies} æræ novæ\n`;
  md += `- Year-start convention: ${lastEra.mode === 'march20' ? 'conventional March 20' : 'exact vernal-equinox instant'}\n`;
  md += `- ${lastEra.citation}\n\n`;
  if (lastResh) {
    md += `## Liber Resh — the four solar stations (${formatOffset(off)})\n`;
    for (const s of lastResh.stations) md += `- ${localClock(s.time, off)} — ${s.label} (${s.deity}): ${s.astronomy}\n`;
    md += `- ${lastResh.citation}\n\n`;
  }
  md += `_${lastEra.noValidity}_\n`;
  return md;
}

function shareLink() {
  if (!lastCtx) return location.href;
  const u = new URL(location.href);
  u.search = '';
  u.searchParams.set('date', $('tt-date').value);
  u.searchParams.set('time', $('tt-time').value);
  u.searchParams.set('lat', String(lastCtx.lat));
  u.searchParams.set('lon', String(lastCtx.lon));
  u.searchParams.set('offset', String(lastCtx.offset));
  u.searchParams.set('mode', lastCtx.mode);
  return u.href;
}

function copyText(text) {
  if (!text) return;
  try {
    navigator.clipboard.writeText(text).then(
      () => flashStatus('Copied.'),
      () => flashStatus('Copy failed — select and copy manually.'));
  } catch { flashStatus('Copy failed — select and copy manually.'); }
}
function flashStatus(msg) {
  const s = $('tt-status');
  if (!s) return;
  s.textContent = msg;
  setTimeout(() => { if (s.textContent === msg) s.textContent = ''; }, 2500);
}
