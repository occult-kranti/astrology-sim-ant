// ============================================================================
//  shared.js — injects the site header/nav and footer on every page, and
//  provides small UI helpers (city presets, geolocation, datetime). Computes
//  the site root from its own URL so links work at any depth and under the
//  GitHub Pages project subpath (…github.io/astrology-sim-ant/).
// ============================================================================

// site root, e.g. ".../astrology-sim-ant"
export const ROOT = new URL('../../../', import.meta.url).href.replace(/\/$/, '');
const R = p => `${ROOT}/${p.replace(/^\//, '')}`;

import { autolinkGlossary } from './autolink.js';

const NAV = [
  ['index.html', 'Home'],
  ['pages/now.html', 'Now'],
  ['pages/master.html', 'Master'],
  ['pages/workflow.html', 'Workflow'],
  ['pages/book1/index.html', 'Book I'],
  ['pages/book2/index.html', 'Book II'],
  ['pages/book3/index.html', 'Book III'],
  ['pages/picatrix/index.html', 'Picatrix'],
  ['pages/tools.html', 'Tools'],
  ['pages/glossary.html', 'Glossary'],
  ['pages/about/index.html', 'About']
];

export function mountChrome(activeKey = '') {
  const header = document.createElement('header');
  header.className = 'site';
  header.innerHTML = `<div class="wrap">
    <a class="brand" href="${R('index.html')}">
      <span class="mark">✶</span>
      <span><b>Christian Astrology</b><small>The Work of William Lilly · 1647</small></span>
    </a>
    <nav class="main">${NAV.map(([href, label]) =>
      `<a href="${R(href)}"${href.includes(activeKey) && activeKey ? ' class="active"' : ''}>${label}</a>`).join('')}
    </nav></div>`;
  document.body.prepend(header);

  const footer = document.createElement('footer');
  footer.className = 'site';
  footer.innerHTML = `<div class="wrap">
    <div><b style="color:#e9dfc4">Christian Astrology</b><br>
      An interactive study edition of William Lilly's 1647 textbook of horary,
      natal and elemental astrology — with working calculators built on a
      verified astronomical engine.</div>
    <div><b style="color:#e9dfc4">Study the Books</b>
      <ul class="clean small">
        <li><a href="${R('pages/book1/index.html')}">Book I — An Introduction to Astrology</a></li>
        <li><a href="${R('pages/book2/index.html')}">Book II — Resolution of All Questions</a></li>
        <li><a href="${R('pages/book3/index.html')}">Book III — Judgement of Nativities</a></li>
        <li><a href="${R('pages/picatrix/index.html')}">Picatrix — Astrological Magic</a></li>
      </ul></div>
    <div><b style="color:#e9dfc4">Tools & Study</b>
      <ul class="clean small">
        <li><a href="${R('pages/master.html')}">Unified Master Tool</a></li>
        <li><a href="${R('pages/now.html')}">Right Now — live sky</a></li>
        <li><a href="${R('pages/picatrix/election.html')}">Election — choose the moment</a></li>
        <li><a href="${R('pages/book3/master.html')}">Book III Master Tool</a></li>
        <li><a href="${R('pages/tools.html')}">All Tools &amp; Calculators</a></li>
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
export function wireCitySelect(sel, latIn, lonIn, offIn) {
  sel.innerHTML = '<option value="">— choose a place —</option>' +
    CITIES.map(([n], i) => `<option value="${i}">${n}</option>`).join('');
  sel.addEventListener('change', () => {
    const c = CITIES[sel.value];
    if (!c) return;
    latIn.value = c[1]; lonIn.value = c[2]; if (offIn) offIn.value = c[3];
  });
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
