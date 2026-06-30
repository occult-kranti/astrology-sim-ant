// ============================================================================
//  shared.js — injects the site header/nav and footer on every page, and
//  provides small UI helpers (city presets, geolocation, datetime). Computes
//  the site root from its own URL so links work at any depth and under the
//  GitHub Pages project subpath (…github.io/astrology-sim-ant/).
// ============================================================================

// site root, e.g. ".../astrology-sim-ant"
export const ROOT = new URL('../../../', import.meta.url).href.replace(/\/$/, '');
const R = p => `${ROOT}/${p.replace(/^\//, '')}`;

import { autolinkGlossary, autolinkResults } from './autolink.js';
import { attachGeolocate, nearestCity } from './location.js';

// Grouped navigation — Start • Tools • Books • Reference. The grouping renders
// as faintly-divided clusters on desktop and as labelled sections in the mobile
// drop-down, so the 14-item bar reads as four short menus instead of one wall.
const NAV_GROUPS = [
  { label: 'Start', items: [
    ['index.html', 'Home', 'home'],
    ['pages/basics.html', 'Basics', 'basics'],
  ] },
  { label: 'Tools', items: [
    ['pages/now.html', 'Now', 'now'],
    ['pages/workbench.html', 'Master Tool', 'workbench'],
    ['pages/trajectory.html', 'Trajectory', 'trajectory'],
    ['pages/workflow.html', 'Workflow', 'workflow'],
    ['pages/tools.html', 'All Tools', 'tools'],
  ] },
  { label: 'Books', items: [
    ['pages/book1/index.html', 'Book I', 'book1'],
    ['pages/book2/index.html', 'Book II', 'book2'],
    ['pages/book3/index.html', 'Book III', 'book3'],
    ['pages/picatrix/index.html', 'Picatrix', 'picatrix'],
    ['pages/vedic/index.html', 'Vedic', 'vedic'],
  ] },
  { label: 'Reference', items: [
    ['pages/glossary.html', 'Glossary', 'glossary'],
    ['pages/about/index.html', 'About', 'about'],
  ] },
];

// Determine the active NAV section from the URL (exact, not substring — a bare
// `includes()` lit up Home + all books at once). Nested tool pages (e.g.
// book2/horary.html, book1/master.html) resolve to their parent section.
function currentSection() {
  const p = location.pathname;
  if (/\/pages\/book1\//.test(p)) return 'book1';
  if (/\/pages\/book2\//.test(p)) return 'book2';
  if (/\/pages\/book3\//.test(p)) return 'book3';
  if (/\/pages\/picatrix\//.test(p)) return 'picatrix';
  if (/\/pages\/vedic\//.test(p)) return 'vedic';
  if (/\/pages\/about\//.test(p)) return 'about';
  if (/\/pages\/basics\.html$/.test(p)) return 'basics';
  if (/\/pages\/interpret\.html$/.test(p)) return 'basics';
  if (/\/pages\/now\.html$/.test(p)) return 'now';
  if (/\/pages\/workbench\.html$/.test(p)) return 'workbench';
  if (/\/pages\/master\.html$/.test(p)) return 'master';
  if (/\/pages\/trajectory\.html$/.test(p)) return 'trajectory';
  if (/\/pages\/workflow\.html$/.test(p)) return 'workflow';
  if (/\/pages\/tools\.html$/.test(p)) return 'tools';
  if (/\/pages\/(experiment|structure)\.html$/.test(p)) return 'tools';
  if (/\/pages\/glossary\.html$/.test(p)) return 'glossary';
  if (/(\/index\.html$|\/$)/.test(p)) return 'home';
  return '';
}

export function mountChrome(activeKey = '') {
  const active = currentSection() || activeKey;
  // accessibility: a skip link + a target id on <main>
  const skip = document.createElement('a');
  skip.className = 'skip-link'; skip.href = '#content'; skip.textContent = 'Skip to content';
  document.body.prepend(skip);
  const mainEl = document.querySelector('main');
  if (mainEl && !mainEl.id) mainEl.id = 'content';

  const header = document.createElement('header');
  header.className = 'site';
  header.innerHTML = `<div class="wrap">
    <a class="brand" href="${R('index.html')}">
      <span class="mark" aria-hidden="true">✶</span>
      <span><b>The Astrologer's Workbench</b><small>Lilly's <i>Christian Astrology</i> × the <i>Picatrix</i> · computed for study</small></span>
    </a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="main" aria-label="Primary">${NAV_GROUPS.map(g =>
      `<span class="nav-group" role="group" aria-label="${g.label}"><span class="nav-group-label" aria-hidden="true">${g.label}</span>${g.items.map(([href, label, key]) =>
        `<a href="${R(href)}"${key === active ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('')}</span>`).join('')}
    </nav></div>`;
  document.body.prepend(header);

  // Mobile nav: the 14-item bar collapses behind a hamburger on narrow screens.
  // CSS hides the toggle (and shows the full bar) above the breakpoint, so this
  // is a no-op on the desktop layout.
  const navToggle = header.querySelector('.nav-toggle');
  const navEl = header.querySelector('nav.main');
  if (navToggle && navEl) {
    const setOpen = open => { navEl.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
    navToggle.addEventListener('click', () => setOpen(!navEl.classList.contains('open')));
    navEl.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });   // collapse after picking a destination
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  const footer = document.createElement('footer');
  footer.className = 'site';
  footer.innerHTML = `<div class="wrap">
    <div><b style="color:#e9dfc4">The Astrologer's Workbench</b><br>
      A scientifically-honest study &amp; calculation edition of William Lilly's
      <i>Christian Astrology</i> (1647) and the <i>Picatrix</i> — horary, nativity,
      election, talismans and a live sky, on a verified astronomical engine.</div>
    <div><b style="color:#e9dfc4">Study the Books</b>
      <ul class="clean small">
        <li><a href="${R('pages/book1/index.html')}">Book I — An Introduction to Astrology</a></li>
        <li><a href="${R('pages/book2/index.html')}">Book II — Resolution of All Questions</a></li>
        <li><a href="${R('pages/book3/index.html')}">Book III — Judgement of Nativities</a></li>
        <li><a href="${R('pages/picatrix/index.html')}">Picatrix — Astrological Magic</a></li>
        <li><a href="${R('pages/vedic/index.html')}">Jagannath Hora — Vedic (sidereal)</a></li>
      </ul></div>
    <div><b style="color:#e9dfc4">Tools & Study</b>
      <ul class="clean small">
        <li><a href="${R('pages/workbench.html')}">The Master Tool (Workbench) — every calculation in one place</a></li>
        <li><a href="${R('pages/trajectory.html')}">Life Trajectory (birth chart anywhere)</a></li>
        <li><a href="${R('pages/now.html')}">Right Now — live sky</a></li>
        <li><a href="${R('pages/picatrix/election.html')}">Election — choose the moment</a></li>
        <li><a href="${R('pages/book3/master.html')}">Book III Master Tool</a></li>
        <li><a href="${R('pages/tools.html')}">All Tools &amp; Calculators</a></li>
        <li><a href="${R('pages/basics.html')}">The Basics — every concept explained</a></li>
        <li><a href="${R('pages/interpret.html')}">Reading your results (a reference)</a></li>
        <li><a href="${R('pages/structure.html')}">Structure &amp; patterns (the hidden symmetry)</a></li>
        <li><a href="${R('pages/experiment.html')}">Test it yourself (the falsification demo)</a></li>
        <li><a href="${R('pages/how-it-works.html')}">How it's calculated (step by step)</a></li>
        <li><a href="${R('pages/workflow.html')}">Chapter Map &amp; Workflows</a></li>
        <li><a href="${R('pages/book1/master.html')}">Book I Master Tool</a></li>
        <li><a href="${R('pages/book2/horary.html')}">Horary Chart Calculator</a></li>
        <li><a href="${R('pages/glossary.html')}">Glossary &amp; Dictionary</a></li>
        <li><a href="${R('pages/contents.html')}">Master Index</a></li>
        <li><a href="${R('pages/read.html')}">Read the original (free scans)</a></li>
        <li><a href="${R('pages/about/index.html')}">Sources &amp; scientific context</a></li>
      </ul></div>
    <p class="disclaimer">This site presents astrology as a historical, cultural and
      intellectual artefact. Astrology has no demonstrated predictive validity and is
      regarded by the scientific community as a pseudoscience; the calculators reproduce
      Lilly's methods faithfully for study, not for guidance. Astronomical positions are
      computed with the MIT-licensed astronomy-engine (≈1 arc-minute). See
      <a href="${R('pages/about/index.html')}">About & Sources</a>.</p>
  </div>`;
  document.body.appendChild(footer);

  // auto-link glossary terms in the page's prose (not on the glossary itself)
  if (activeKey !== 'glossary') {
    try { autolinkGlossary(document.querySelector('main'), R('pages/glossary.html')); } catch (e) { /* non-fatal */ }
  }
}

// Re-link glossary jargon in freshly-rendered RESULT panels after a compute.
// Tools call this with the ids of the panels they just rendered; the static
// glossary on the glossary page is excluded by the caller never invoking it
// there. Non-fatal — a failure never breaks a reading.
export function autolinkResultPanels(ids) {
  try {
    const roots = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (roots.length) autolinkResults(roots, R('pages/glossary.html'));
  } catch (e) { /* non-fatal */ }
}

// --- A curated set of cities with coordinates and IANA-ish UTC offsets ---
// offset is the STANDARD-time offset; the user can adjust for DST.
export const CITIES = [
  ['London, UK', 51.5074, -0.1278, 0],
  ['Oxford, UK', 51.752, -1.2577, 0],
  ['Edinburgh, UK', 55.9533, -3.1883, 0],
  ['Dublin, IE', 53.3498, -6.2603, 0],
  ['Paris, FR', 48.8566, 2.3522, 1],
  ['Berlin, DE', 52.52, 13.405, 1],
  ['Rome, IT', 41.9028, 12.4964, 1],
  ['Madrid, ES', 40.4168, -3.7038, 1],
  ['Amsterdam, NL', 52.3676, 4.9041, 1],
  ['Athens, GR', 37.9838, 23.7275, 2],
  ['Moscow, RU', 55.7558, 37.6173, 3],
  ['Cairo, EG', 30.0444, 31.2357, 2],
  ['Istanbul, TR', 41.0082, 28.9784, 3],
  ['Dubai, AE', 25.2048, 55.2708, 4],
  ['Mumbai, IN', 19.076, 72.8777, 5.5],
  ['Delhi, IN', 28.6139, 77.209, 5.5],
  ['Bangkok, TH', 13.7563, 100.5018, 7],
  ['Singapore, SG', 1.3521, 103.8198, 8],
  ['Hong Kong', 22.3193, 114.1694, 8],
  ['Beijing, CN', 39.9042, 116.4074, 8],
  ['Tokyo, JP', 35.6762, 139.6503, 9],
  ['Sydney, AU', -33.8688, 151.2093, 10],
  ['Auckland, NZ', -36.8485, 174.7633, 12],
  ['New York, US', 40.7128, -74.006, -5],
  ['Chicago, US', 41.8781, -87.6298, -6],
  ['Denver, US', 39.7392, -104.9903, -7],
  ['Los Angeles, US', 34.0522, -118.2437, -8],
  ['Toronto, CA', 43.6532, -79.3832, -5],
  ['Mexico City, MX', 19.4326, -99.1332, -6],
  ['São Paulo, BR', -23.5505, -46.6333, -3],
  ['Buenos Aires, AR', -34.6037, -58.3816, -3],
  ['Johannesburg, ZA', -26.2041, 28.0473, 2],
  ['Lagos, NG', 6.5244, 3.3792, 1]
];

// Build a chart Date (UTC) from local date/time fields and a UTC offset (hours).
export function toUTC(dateStr, timeStr, offsetHours) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  // local time → UTC: subtract the offset
  return new Date(Date.UTC(y, mo - 1, d, h, mi) - offsetHours * 3600000);
}

// Populate a <select> with the city list; on change set lat/lon/offset inputs.
// Also injects a "📍 Use my location" button + a nearest-city status line right
// after the select, so every tool that wires a place picker gets device
// geolocation for free (offline nearest-city lookup; nothing leaves the page).
//
// `timeFields` (optional) makes the geolocate button "here AND now": when given
// { dateIn, timeIn, afterGeo? } it also fills the date/time with the current
// local moment and the offset with the nearest city's standard UTC offset, then
// calls afterGeo() so the tool can recompute. Present-moment pickers pass it;
// the birth-data picker does NOT (a birth time must never jump to "now").
export function wireCitySelect(sel, latIn, lonIn, offIn, timeFields = null) {
  sel.innerHTML = '<option value="">— choose a place —</option>' +
    CITIES.map(([n], i) => `<option value="${i}">${n}</option>`).join('');
  sel.addEventListener('change', () => {
    const c = CITIES[sel.value];
    if (!c) return;
    latIn.value = c[1]; lonIn.value = c[2]; if (offIn) offIn.value = c[3];
  });

  // Inject the geolocate control once, next to the select.
  try {
    if (sel.dataset && sel.dataset.geoWired) return;
    if (sel.dataset) sel.dataset.geoWired = '1';
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'btn sm geo-btn';
    btn.textContent = timeFields ? '📍 Use my location & time' : '📍 Use my location';
    const status = document.createElement('span');
    status.className = 'small muted geo-status'; status.style.marginLeft = '.5rem';
    sel.insertAdjacentElement('afterend', status);
    sel.insertAdjacentElement('afterend', btn);
    const onGeo = ({ lat, lon }) => {
      if (!timeFields) return;
      try {
        const f = nowLocalFields();
        if (timeFields.dateIn) timeFields.dateIn.value = f.date;
        if (timeFields.timeIn) timeFields.timeIn.value = f.time;
        const near = nearestCity(lat, lon);
        if (offIn && near) offIn.value = near.offset;     // best-guess standard offset for the place
        if (typeof timeFields.afterGeo === 'function') timeFields.afterGeo();
      } catch (e) { /* non-fatal */ }
    };
    attachGeolocate(btn, latIn, lonIn, status, onGeo);
  } catch (e) { /* non-fatal: the place picker still works without geolocation */ }
}

export function nowLocalFields() {
  const n = new Date();
  const pad = x => String(x).padStart(2, '0');
  return {
    date: `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`,
    time: `${pad(n.getHours())}:${pad(n.getMinutes())}`,
    offset: -n.getTimezoneOffset() / 60
  };
}

// ---------------------------------------------------------------------------
//  VERDICT_LEGEND — one explanation of the green / amber / red badge, reused on
//  every page that shows a verdict. It is a TRAFFIC-LIGHT GRAVITY SCALE for the
//  judgement only — deliberately distinguished from the planetary/talisman
//  COLOURS (e.g. Mars's red garment), which are a different thing entirely.
// ---------------------------------------------------------------------------
export const VERDICT_LEGEND = `<div class="callout verdict-legend"><span class="label">What the colours mean</span>
  The verdict badge is a <b>traffic-light scale for the gravity of the judgement</b>, not a quality of the planets:
  <span class="verdict green">green</span> few impediments — favourable / fit to proceed;
  <span class="verdict amber">amber</span> mixed — some cautions stand, weigh them;
  <span class="verdict red">red</span> strongly impeded — the testimonies stand against it.
  <span class="small muted">Red shows <em>severity</em>, nothing more — it is <b>not</b> the planetary or
  talisman colour red (e.g. Mars's red garment); those ritual colours are listed under each planet's
  correspondences and mean something different. The badge is a <b>crude count of impediments</b>, a quick
  summary — not a substitute for weighing the actual significators of the matter, which is the real Lilly method.</span></div>`;
