// ============================================================================
//  state.js — generalized SHARE & EXPORT helpers, lifted from the bespoke
//  round-trip that used to live only in app/trajectory.js so EVERY tool can:
//    • encode its inputs into the URL and restore them (shareable links),
//    • copy that link to the clipboard,
//    • download the computed reading as JSON,
//    • download the chart wheel as SVG or PNG (all client-side, no server).
//
//  `encodeState`/`decodeState` are pure string<->object helpers (no DOM, so the
//  headless test can exercise them). Everything else touches the DOM/clipboard
//  and is only called from page code. No top-level DOM access — safe to import
//  in Node.
// ============================================================================

// --- pure: state <-> query string ------------------------------------------
// Encode a flat object of inputs as a query string, skipping empty/null values.
export function encodeState(obj) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(obj || {})) if (v !== '' && v != null) q.set(k, String(v));
  return q.toString();
}

// Decode a query string (with or without a leading '?') into a flat object.
export function decodeState(search = '') {
  const q = new URLSearchParams(String(search).replace(/^\?/, ''));
  const out = {};
  for (const [k, v] of q.entries()) out[k] = v;
  return out;
}

// --- DOM: URL round-trip ----------------------------------------------------
// Write the given state object into the address bar (no navigation/history push).
export function writeStateToURL(obj) {
  try { history.replaceState(null, '', `${location.pathname}?${encodeState(obj)}`); }
  catch { /* non-fatal */ }
}

// Read the current URL's query into a flat object; if `keys` is given, keep only
// those keys (and only those actually present).
export function readStateFromURL(keys = null) {
  const all = decodeState(location.search);
  if (!keys) return all;
  const out = {};
  for (const k of keys) if (k in all) out[k] = all[k];
  return out;
}

// Copy a shareable link to the clipboard. If `stateObj` is given it is written to
// the URL first; `statusEl` (optional) receives a short success/failure message.
export function copyShareLink(statusEl = null, stateObj = null) {
  if (stateObj) writeStateToURL(stateObj);
  const url = location.href;
  const ok = () => { if (statusEl) statusEl.textContent = 'Link copied to clipboard.'; };
  const fail = () => { if (statusEl) statusEl.textContent = 'Could not copy — the link is in the address bar.'; };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fail);
    else fail();
  } catch { fail(); }
  return url;
}

// --- DOM: downloads ---------------------------------------------------------
// Trigger a download of a Blob as `filename` (transient object URL, revoked).
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Download a JS object as pretty-printed JSON.
export function downloadJSON(obj, filename = 'reading.json') {
  downloadBlob(new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }), filename);
}

// --- localStorage: silent reading history (no DOM/network) ------------------
//  Each generated reading's INPUT STATE is auto-saved here so it can be restored
//  later. localStorage is only touched inside these functions (guarded), so the
//  module stays import-safe in Node.
const HISTORY_KEY = 'wb-saved-readings';
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* quota / disabled */ } };
export function listSavedReadings() { try { return JSON.parse(lsGet(HISTORY_KEY) || '[]'); } catch { return []; } }
// entry: { key, ts, label, state }. De-dupes by key, newest first, capped.
export function saveReadingEntry(entry, cap = 30) {
  if (!entry || !entry.key) return listSavedReadings();
  const list = [entry, ...listSavedReadings().filter(e => e.key !== entry.key)].slice(0, cap);
  lsSet(HISTORY_KEY, JSON.stringify(list));
  return list;
}
export function removeSavedReading(key) {
  const list = listSavedReadings().filter(e => e.key !== key);
  lsSet(HISTORY_KEY, JSON.stringify(list));
  return list;
}
export function clearSavedReadings() { lsSet(HISTORY_KEY, '[]'); }

// --- localStorage: saved PEOPLE (birth moments) -----------------------------
//  A "person" is a saved birth moment the tools can be tuned to: name + birth
//  date/time/place. Stored on-device only (nothing leaves the page). Used to
//  personalise the natal & Picatrix layers ("tuned to a specific person").
const PERSONS_KEY = 'wb-persons';
export function listPersons() { try { return JSON.parse(lsGet(PERSONS_KEY) || '[]'); } catch { return []; } }
// person: { id, name, bdate, btime, boffset, blat, blon, place }
export function savePerson(person, cap = 40) {
  if (!person || !person.name) return listPersons();
  const id = person.id || ('p' + person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (person.bdate || ''));
  const entry = { ...person, id };
  const list = [entry, ...listPersons().filter(p => p.id !== id)].slice(0, cap);
  lsSet(PERSONS_KEY, JSON.stringify(list));
  return list;
}
export function removePerson(id) {
  const list = listPersons().filter(p => p.id !== id);
  lsSet(PERSONS_KEY, JSON.stringify(list));
  return list;
}

// --- A readable Markdown summary of a fullReading (pure) ---------------------
export function readingToMarkdown(reading) {
  if (!reading) return '# Reading\n\n(empty)';
  const r = reading, L = [];
  const m = r.moment || {}, inp = (r.meta && r.meta.inputs) || {};
  L.push("# The Astrologer's Workbench — a reading");
  L.push('');
  L.push(`*Generated for ${fmtUTC(inp.date)} at lat ${inp.latitude}, lon ${inp.longitude} (${inp.system} houses, a ${m.isDay ? 'day' : 'night'} chart).*`);
  L.push('');
  L.push('> Astrology has no demonstrated predictive validity and is regarded by science as a pseudoscience. The mathematics is real; the interpretations are historical doctrine — described for study, never prescribed.');
  L.push('');
  if (m.angles) L.push(`**The figure.** Ascendant ${m.angles.asc.label}; Midheaven ${m.angles.mc.label}.${m.planetaryHour ? ` Planetary hour of ${m.planetaryHour.ruler} (a ${m.planetaryHour.dayRuler}-day).` : ''}`);
  if (m.planets) {
    L.push('');
    L.push('| Body | Position | House | Retro |');
    L.push('|---|---|---|---|');
    for (const [n, p] of Object.entries(m.planets)) L.push(`| ${n} | ${p.label} | ${p.house} | ${p.retrograde ? '℞' : ''} |`);
  }
  if (r.cautions) L.push(`\n**Chart health:** ${r.cautions.verdict} — ${r.cautions.label}.`);
  if (r.dignities && r.dignities.lordOfGeniture) L.push(`**Lord of the Geniture:** ${r.dignities.lordOfGeniture.planet}. Almuten of the Ascendant: ${r.dignities.almutens.ascendant.planet}.`);
  if (r.lots) L.push(`**Part of Fortune:** ${r.lots.fortune.label}; **Part of Spirit:** ${r.lots.spirit.label}.`);
  const sel = r.election && r.election.selected;
  if (sel) L.push(`\n**Election** for *${sel.operation.label}* (${sel.operation.ruler}): ${sel.verdict} (score ${sel.score}).`);
  if (r.election && r.election.rankedNow && r.election.rankedNow.length) L.push(`**Aims ranked now:** ${r.election.rankedNow.map(o => `${o.label} (${o.verdict})`).join('; ')}.`);
  if (r.vedic) {
    const v = r.vedic;
    L.push('');
    L.push('## Vedic (Jagannath Hora) — a separate, sidereal system');
    L.push(`Lagna ${v.lagna.label} (lord ${v.lagna.lord}); Moon nakṣatra ${v.grahas.Moon.nakshatra.name}.`);
    L.push(`Pañcāṅga: tithi ${v.panchanga.tithi.name}, vāra ${v.panchanga.vara.name}, yoga ${v.panchanga.yoga.name}.`);
    L.push(`Vimśottarī: running ${v.vimshottari.currentMaha} mahā${v.vimshottari.currentAntar ? ' / ' + v.vimshottari.currentAntar + ' antar' : ''}.`);
    if (v.shadbala) L.push(`Ṣaḍbala: strongest ${v.shadbala.strongest}, weakest ${v.shadbala.weakest} (order ${v.shadbala.order.join(' > ')}).`);
    if (v.practice) {
      L.push('');
      L.push(`**Practice (cultural/devotional — described, not prescribed).** Today (${v.practice.vara.name}, a ${v.practice.vara.graha}-vāra): mantra ${v.practice.vara.mantra}; yoga ${v.practice.vara.yoga} (modern). Birth-keyed focus ${v.practice.birth.focusGraha}: mantra ${v.practice.birth.mantra}; gem ${v.practice.birth.gem}.`);
    }
  }
  if (r.citations) { L.push('\n---'); L.push(`*Sources: ${r.citations.join(' · ')}*`); }
  return L.join('\n');
}
function fmtUTC(d) { try { return new Date(d).toISOString().replace('.000Z', 'Z'); } catch { return String(d); } }

// Download a reading as a Markdown summary.
export function downloadMarkdown(reading, filename = 'reading.md') {
  downloadText(readingToMarkdown(reading), filename, 'text/markdown;charset=utf-8');
}

// Download arbitrary text.
export function downloadText(text, filename, mime = 'text/plain') {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

// --- DOM: SVG / PNG export of the chart wheel -------------------------------
// Serialize an <svg> element to a standalone SVG string (with the xmlns added).
export function svgToString(svgEl) {
  const clone = svgEl.cloneNode(true);
  if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (!clone.getAttribute('xmlns:xlink')) clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  return new XMLSerializer().serializeToString(clone);
}

// Download an <svg> element as an .svg file.
export function downloadSVG(svgEl, filename = 'chart.svg') {
  if (!svgEl) return;
  downloadBlob(new Blob([svgToString(svgEl)], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

// Rasterize an <svg> element to PNG (at `scale`×) and download it. Returns a
// Promise; resolves after the download triggers, rejects on a render error.
export function svgToPNG(svgEl, filename = 'chart.png', scale = 2) {
  return new Promise((resolve, reject) => {
    if (!svgEl) return reject(new Error('no svg element'));
    try {
      const str = svgToString(svgEl);
      const vb = svgEl.viewBox && svgEl.viewBox.baseVal;
      const w = (vb && vb.width) || svgEl.clientWidth || 540;
      const h = (vb && vb.height) || svgEl.clientHeight || 540;
      const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = w * scale; canvas.height = h * scale;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#0f1320'; ctx.fillRect(0, 0, canvas.width, canvas.height); // match page bg
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          canvas.toBlob(b => { if (b) { downloadBlob(b, filename); resolve(); } else reject(new Error('toBlob failed')); }, 'image/png');
        } catch (e) { URL.revokeObjectURL(url); reject(e); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image load failed')); };
      img.src = url;
    } catch (e) { reject(e); }
  });
}
