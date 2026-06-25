// ============================================================================
//  trajectory.js (app) — the LIFE TRAJECTORY page. Enter one birth moment and
//  place (anywhere, by lat/lon, with an optional offline place-name preset) plus
//  a "reading place now", and read the nativity across the whole arc of a life:
//    1. the natal signatures (Asc/MC, sect, almuten of the Ascendant, Lord of
//       the Geniture, sect light, temperament, hyleg & alcocoden);
//    2. the year-by-year profection TIMELINE & Lord of the Year (current row lit);
//    3. the primary DIRECTIONS to the angles (Naibod key);
//    4. THIS YEAR — the Lord of the Year and the solar return;
//    5. a personalised PICATRIX overlay — ruling planets, the operations
//       naturally yours, this year's focus, best/worst right now, a talisman.
//
//  It only composes the verified core engine (core/trajectory.js + core/astro.js)
//  — nothing is re-derived here. Every section is rendered inside its own
//  try/catch so the page never blanks; all dynamic text is HTML-escaped.
//
//  Presented strictly as historical study. Astrology has no demonstrated
//  predictive validity; the Picatrix "magic" has no demonstrated efficacy.
//  Cites: Lilly, Christian Astrology, Books I & III; the Picatrix.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { lifeTrajectory } from '../core/trajectory.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';
import { attachGeolocate, nearestCity } from './location.js';

const $ = id => document.getElementById(id);
const G = p => (p && PLANET_GLYPHS[p]) ? `${PLANET_GLYPHS[p]} ${p}` : (p || '—');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sgn = n => (n == null ? '—' : (n >= 0 ? '+' : '') + n);
const ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
const ord = n => (n % 100 >= 11 && n % 100 <= 13) ? 'th' : (ORD[n % 10] || 'th');
const fLon = v => { try { return formatLon(v); } catch { return v == null ? '—' : String(v); } };
const safe = (el, fn) => { try { fn(); } catch (e) { if (el) el.innerHTML = `<p class="small muted">Could not compute this section: ${esc(e && e.message)}</p>`; } };

// ---------------------------------------------------------------------------
//  Init: defaults, presets, geolocation, share/save, then auto-run once.
// ---------------------------------------------------------------------------
export function initTrajectory() {
  // Sensible default birth so the page is never blank: 1990-01-01 12:00 London.
  $('tj-date').value = '1990-01-01';
  $('tj-time').value = '12:00';
  $('tj-offset').value = 0;
  $('tj-lat').value = 51.5074;
  $('tj-lon').value = -0.1278;
  $('tj-name').value = 'London, UK';
  $('tj-system').value = 'regiomontanus';
  $('tj-nlat').value = 51.5074;
  $('tj-nlon').value = -0.1278;

  // City preset fills birth lat/lon/offset; also mirror the chosen name + the
  // reading place when it still matches the birth place.
  wireCitySelect($('tj-city'), $('tj-lat'), $('tj-lon'), $('tj-offset'));
  $('tj-city').addEventListener('change', () => {
    const opt = $('tj-city').options[$('tj-city').selectedIndex];
    if (opt && opt.value !== '') {
      try { $('tj-name').value = opt.textContent; } catch { /* non-fatal */ }
      // keep the reading place tracking the birth place until the user overrides it
      try { $('tj-nlat').value = $('tj-lat').value; $('tj-nlon').value = $('tj-lon').value; } catch { /* non-fatal */ }
    }
  });

  // "Use my location" — fills the READING place (not the birth place).
  attachGeolocate($('tj-here'), $('tj-nlat'), $('tj-nlon'), $('tj-here-status'), ({ lat, lon }) => {
    try { const near = nearestCity(lat, lon); if (near) $('tj-here-status').textContent = `Reading place set — near ${near.name}`; } catch { /* non-fatal */ }
  });

  $('tj-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  $('tj-print').addEventListener('click', () => { try { window.print(); } catch { /* non-fatal */ } });
  $('tj-copy').addEventListener('click', copyLink);

  // Read shared params back so a link reproduces the reading.
  try { readParams(); } catch { /* non-fatal — defaults already set */ }

  // Auto-run once on load.
  run();
}

// ---------------------------------------------------------------------------
//  Share/save via URL.
// ---------------------------------------------------------------------------
function currentParams() {
  return {
    date: $('tj-date').value,
    time: $('tj-time').value,
    offset: $('tj-offset').value,
    lat: $('tj-lat').value,
    lon: $('tj-lon').value,
    name: $('tj-name').value,
    system: $('tj-system').value,
    nlat: $('tj-nlat').value,
    nlon: $('tj-nlon').value,
  };
}

function writeParams() {
  try {
    const p = currentParams();
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(p)) if (v !== '' && v != null) q.set(k, v);
    history.replaceState(null, '', `${location.pathname}?${q.toString()}`);
  } catch { /* non-fatal */ }
}

function readParams() {
  const q = new URLSearchParams(location.search);
  if (![...q.keys()].length) return;
  const set = (key, id) => { const v = q.get(key); if (v != null && v !== '') $(id).value = v; };
  set('date', 'tj-date'); set('time', 'tj-time'); set('offset', 'tj-offset');
  set('lat', 'tj-lat'); set('lon', 'tj-lon'); set('name', 'tj-name');
  set('nlat', 'tj-nlat'); set('nlon', 'tj-nlon');
  const sys = q.get('system');
  if (sys && [...$('tj-system').options].some(o => o.value === sys)) $('tj-system').value = sys;
}

function copyLink() {
  writeParams();
  const status = $('tj-copy-status');
  const url = location.href;
  const ok = () => { if (status) status.textContent = 'Link copied to clipboard.'; };
  const fail = () => { if (status) status.textContent = 'Could not copy — the link is in the address bar.'; };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(ok, fail);
    } else { fail(); }
  } catch { fail(); }
}

// ---------------------------------------------------------------------------
//  Run: cast the birth chart, compose the trajectory, render every section.
// ---------------------------------------------------------------------------
function run() {
  const dateStr = $('tj-date').value, timeStr = $('tj-time').value;
  const offset = parseFloat($('tj-offset').value) || 0;
  const lat = parseFloat($('tj-lat').value), lon = parseFloat($('tj-lon').value);
  const system = $('tj-system').value || 'regiomontanus';
  const name = $('tj-name').value;
  let nlat = parseFloat($('tj-nlat').value), nlon = parseFloat($('tj-nlon').value);
  if (isNaN(nlat) || isNaN(nlon)) { nlat = lat; nlon = lon; }
  if (!dateStr || !timeStr || isNaN(lat) || isNaN(lon)) {
    $('tj-summary').innerHTML = '<span class="muted">Enter a valid birth date, time, and coordinates.</span>';
    return;
  }

  // Save params on every successful run so the address bar is always shareable.
  writeParams();

  let birthChart, traj;
  try {
    birthChart = castChart(toUTC(dateStr, timeStr, offset), lat, lon, system);
    traj = lifeTrajectory(birthChart, {
      currentDate: new Date(),
      nowPlace: { lat: nlat, lon: nlon },
      system,
    });
  } catch (e) {
    $('tj-summary').innerHTML = `<span class="muted">Could not cast this nativity: ${esc(e && e.message)}</span>`;
    return;
  }

  // Header summary
  safe($('tj-summary'), () => {
    const where = name ? `${esc(name)} (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)` : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    $('tj-summary').innerHTML =
      `<strong>${fLon(traj.natal.asc)}</strong> ascending · MC <strong>${fLon(traj.natal.mc)}</strong> · ` +
      `${traj.natal.isDay ? 'day' : 'night'} birth · age <strong>${traj.ageNow}</strong> · ${where}`;
  });

  renderNatal(traj);
  renderTimeline(traj);
  renderDirections(traj);
  renderYear(traj, { nlat, nlon });
  renderPicatrix(traj, { nlat, nlon });
  renderCitations(traj);
}

// --- 1. Natal signatures ----------------------------------------------------
function renderNatal(traj) {
  safe($('tj-natal'), () => {
    const n = traj.natal;
    const hy = n.hyleg;
    const al = n.alcocoden;
    const yrs = al && al.years ? ` (≈ <b>${esc(al.years.mean)}</b> mean years; greatest ${esc(al.years.greatest)}, least ${esc(al.years.least)})` : '';
    const t = n.temperament || {};
    let rows = '';
    const cell = (k, v) => { rows += `<tr><td class="l"><b>${esc(k)}</b></td><td class="l">${v}</td></tr>`; };
    cell('Ascendant / MC', `${fLon(n.asc)} rising · MC ${fLon(n.mc)}`);
    cell('Sect', `${n.isDay ? 'Day' : 'Night'} birth — the sect light is <b>${G(n.sectLight)}</b>`);
    cell('Almuten of the Ascendant', `<b>${G(n.almutenAsc)}</b> <span class="small muted">(chief dispositor of the rising degree)</span>`);
    cell('Lord of the Geniture', `<b>${G(n.lordOfGeniture && n.lordOfGeniture.planet)}</b> <span class="small muted">(greatest total dignity, ${sgn(n.lordOfGeniture && n.lordOfGeniture.score)})</span>`);
    cell('Temperament', `${esc(t.dominant || '—')} <span class="small muted">(${esc(t.summary || '')})</span>`);
    cell('Hyleg <span class="small muted">(contested)</span>',
      hy ? `<b>${esc(hy.hyleg || 'none found')}</b>${hy.house ? ` — the ${hy.house}${ord(hy.house)} house` : ''}`
         : '<span class="muted">could not be determined</span>');
    cell('Alcocoden <span class="small muted">(contested)</span>',
      al ? `<b>${esc(al.alcocoden || 'none')}</b>${yrs}`
         : '<span class="muted">could not be determined</span>');

    let html = `<table class="data"><tbody>${rows}</tbody></table>`;
    if (hy && hy.reason) html += `<p class="small muted" style="margin-top:.5rem">${esc(hy.reason)}</p>`;
    if (traj.notes) html += `<p class="small muted">Note: ${esc(traj.notes)}</p>`;
    html += `<div class="callout"><b>Marked as contested:</b> the hyleg &amp; alcocoden (length-of-life) is one of the most
      disputed techniques in the whole literature, and astrologers disagree on its rules. It is shown here only to
      illustrate the method — never as a statement about anyone's lifespan.</div>`;
    html += `<p class="small muted">${esc('Lilly, Christian Astrology Bk I (almuten, Lord of the Geniture, sect, temperament) & Bk III (hyleg/alcocoden).')}</p>`;
    $('tj-natal').innerHTML = html;
  });
}

// --- 2. Trajectory timeline -------------------------------------------------
function renderTimeline(traj) {
  safe($('tj-timeline'), () => {
    const tl = traj.timeline || [];
    const rows = tl.map(r => {
      const cls = r.current ? ' style="background:rgba(120,180,120,.18);font-weight:600"' : '';
      const mark = r.current ? ' ◀ now' : '';
      return `<tr${cls}><td>${r.age}</td><td>${r.year}</td><td class="l">${esc(r.profectedSign)}</td>` +
        `<td>${r.activatedHouse}${ord(r.activatedHouse)}</td>` +
        `<td class="l">${G(r.lordOfYear)}</td>` +
        `<td>ess ${sgn(r.lordEssential)} · acc ${sgn(r.lordAccidental)}${mark}</td></tr>`;
    }).join('');
    $('tj-timeline').innerHTML =
      `<p class="small">Each year of life the Ascendant "profects" forward <b>one sign and one house</b>; the lord of
        that sign becomes the <b>Lord of the Year</b>. The highlighted row is the present year.</p>
      <table class="data"><thead><tr><th>Age</th><th>Year</th><th class="l">Profected sign</th><th>House</th>
        <th class="l">Lord of the Year</th><th>Its natal condition</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="small muted">Lilly, Christian Astrology Bk III — annual profections &amp; the Lord of the Year.</p>`;
  });
}

// --- 3. Primary directions --------------------------------------------------
function renderDirections(traj) {
  safe($('tj-directions'), () => {
    const dirs = traj.directions || [];
    if (!dirs.length) { $('tj-directions').innerHTML = '<p class="small muted">No directions to the angles fell within the studied span.</p>'; return; }
    const rows = dirs.slice(0, 16).map(d =>
      `<tr><td class="l">${G(d.promissor)}</td><td>→ ${esc(d.significator)}</td><td>${Number(d.arc).toFixed(2)}°</td><td>≈ age ${Number(d.years).toFixed(1)}</td></tr>`
    ).join('');
    $('tj-directions').innerHTML =
      `<p class="small">A significator is "directed" to the angles; the arc between them, read as years of life, dates an
        event. This table sorts the contacts by the age at which the tradition would time them.</p>
      <table class="data"><thead><tr><th class="l">Promissor</th><th>to angle</th><th>Arc</th><th>≈ age of event</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="small muted">Simplified <b>Naibod</b> directions in the zodiac (1° ≈ 1 year of mean solar motion); Lilly's
        rigorous mundane (Placidian) directions are a further refinement. Lilly, Christian Astrology Bk III.</p>`;
  });
}

// --- 4. This year -----------------------------------------------------------
function renderYear(traj, place) {
  safe($('tj-year'), () => {
    const cy = traj.currentYear || {};
    const sr = cy.solarReturn || {};
    const inst = sr.instant ? new Date(sr.instant) : null;
    const instTxt = inst ? esc(inst.toUTCString()) : '<span class="muted">unavailable</span>';
    const srTxt = sr.error
      ? `<p class="small muted">Solar return unavailable: ${esc(sr.error)}</p>`
      : `<p>The Sun returns to its natal place on <b>${instTxt}</b>. The revolution rises
          <b>${fLon(sr.asc)}</b>, with MC <b>${fLon(sr.mc)}</b>, and the Sun falls in the
          <b>${sr.sunHouse != null ? sr.sunHouse + ord(sr.sunHouse) : '—'} house</b>.</p>`;
    $('tj-year').innerHTML =
      `<p>At age <b>${cy.age}</b> the Ascendant profects to <b>${esc(cy.profectedSign || '—')}</b>, activating the
        <b>${cy.activatedHouse != null ? cy.activatedHouse + ord(cy.activatedHouse) : '—'} house</b>. Its ruler,
        <b>${G(cy.lordOfYear)}</b>, is this year's <b>Lord of the Year</b> — the annual time-lord whose natal
        condition is read as colouring the year.</p>
      ${srTxt}
      <p class="small muted">Lilly, Christian Astrology Bk III — the Lord of the Year &amp; the Solar Revolution.</p>`;
  });
}

// --- 5. Picatrix overlay ----------------------------------------------------
function renderPicatrix(traj, place) {
  safe($('tj-picatrix'), () => {
    const p = traj.picatrix || {};
    const ruling = (p.rulingPlanets || []).map(G).join(' · ') || '—';

    const affHtml = (p.affinities || []).length
      ? `<ul class="small">${p.affinities.map(a => `<li><b>${esc(a.label)}</b> <span class="muted">(${G(a.ruler)})</span> — ${esc(a.reason)}</li>`).join('')}</ul>`
      : '<p class="small muted">No operation is ruled by your ruling planets.</p>';

    const yfHtml = (p.yearFocus || []).length
      ? `<ul class="small">${p.yearFocus.map(y => `<li><b>${esc(y.label)}</b> <span class="muted">(${G(y.ruler)})</span></li>`).join('')}</ul>`
      : '<p class="small muted">The Lord of the Year rules no listed operation this year.</p>';

    const bw = p.nowBestWorst || { best: [], worst: [] };
    const opRow = r => `<li><span class="verdict ${esc(r.verdict)}">${esc(r.verdict)}</span> <b>${esc(r.label)}</b>
      <span class="small muted">(${G(r.ruler)}, score ${esc(r.score)})</span></li>`;
    const bestHtml = (bw.best || []).length ? `<ul class="clean">${bw.best.map(opRow).join('')}</ul>` : '<p class="small muted">unavailable</p>';
    const worstHtml = (bw.worst || []).length ? `<ul class="clean">${bw.worst.map(opRow).join('')}</ul>` : '<p class="small muted">unavailable</p>';

    // Recommended talisman
    let talHtml = '<p class="small muted">No talisman scored favourably for the present moment.</p>';
    const t = p.recommendedTalisman;
    if (t) {
      const m = t.materials || {};
      const link = `picatrix/talisman.html?op=${encodeURIComponent(t.operationKey)}`;
      talHtml =
        `<p><b>Aim:</b> ${esc(t.aim)} · <b>Planet:</b> ${G(t.planet)} · ` +
        `<b>Verdict right now:</b> <span class="verdict ${esc(t.verdict)}">${esc(t.verdict)}</span>` +
        `${t.verdictLabel ? ` <span class="small muted">(${esc(t.verdictLabel)})</span>` : ''}.</p>
        <p class="small"><b>Materials (study only):</b> suffumigation of ${esc(m.suffumigation)}; colour ${esc(m.colour)};
          metal ${esc(m.metal)}; stone ${esc(m.stone)}.</p>
        <p class="small"><a href="${esc(link)}">Open this recipe in the Talisman Workshop →</a></p>`;
    }

    $('tj-picatrix').innerHTML =
      `<p><b>The chart's ruling planets:</b> ${ruling} <span class="small muted">— the almuten of the Ascendant, the Lord of the
        Geniture, and the sect light, deduped.</span></p>

      <h3 style="margin:.8rem 0 .2rem">Works the tradition would count as this chart's</h3>${affHtml}

      <h3 style="margin:.8rem 0 .2rem">This year's significations <span class="small muted">— ruled by the Lord of the Year (${G(traj.currentYear && traj.currentYear.lordOfYear)})</span></h3>${yfHtml}

      <h3 style="margin:.8rem 0 .2rem">How the election rules score the present sky</h3>
      <div class="grid cols-2">
        <div><b class="small">Highest-scoring now</b>${bestHtml}</div>
        <div><b class="small">Lowest-scoring now</b>${worstHtml}</div>
      </div>

      <h3 style="margin:.8rem 0 .2rem">The highest-scoring talisman for this moment</h3>${talHtml}

      <div class="callout science"><span class="label">Honest caveat</span> This "magic" is recorded as history. There is
        no demonstrated mechanism or effect for talismans or planetary operations; the figures above are simply how the
        Picatrix/Lilly election rules would <em>score</em> the present sky — described, never prescribed. Never make or use
        any historical recipe — some name toxic or illegal materials. (The Picatrix, Ghayat al-Hakim; the seven planetary operations.)</div>`;
  });
}

// --- citations footer -------------------------------------------------------
function renderCitations(traj) {
  safe($('tj-citations'), () => {
    const cites = traj.citations || [];
    $('tj-citations').innerHTML = cites.length
      ? `<b>Sources used in this reading:</b><br>${cites.map(esc).join('<br>')}`
      : '';
  });
}
