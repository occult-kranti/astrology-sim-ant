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
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value)
  && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const scalar = value => value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value));
function flatRecord(value) {
  if (!plain(value) || !Object.values(value).every(scalar)) return null;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !['__proto__', 'prototype', 'constructor'].includes(key)));
}
function readingRecord(value) {
  if (!plain(value) || typeof value.key !== 'string' || !value.key.trim()) return null;
  const state = flatRecord(value.state);
  if (!state || (value.label != null && typeof value.label !== 'string') || (value.ts != null && typeof value.ts !== 'string')) return null;
  return { key: value.key, label: value.label || value.key, ts: value.ts || '', state };
}
function storedCollection(key, normalize, identity) {
  try {
    const parsed = JSON.parse(lsGet(key) || '[]');
    if (!Array.isArray(parsed)) return [];
    const seen = new Set();
    return parsed.map(normalize).filter(value => {
      if (!value || seen.has(value[identity])) return false;
      seen.add(value[identity]); return true;
    });
  } catch { return []; }
}
const safeCap = (cap, fallback) => Number.isInteger(cap) && cap > 0 && cap <= 200 ? cap : fallback;
// Recovery is in-memory: reading a damaged collection does not overwrite it.
// Keep valid siblings and their additive flat timezone/method state fields.
export function listSavedReadings() { return storedCollection(HISTORY_KEY, readingRecord, 'key'); }
// entry: { key, ts, label, state }. De-dupes by key, newest first, capped.
export function saveReadingEntry(entry, cap = 30) {
  const normalized = readingRecord(entry);
  if (!normalized) return listSavedReadings();
  const list = [normalized, ...listSavedReadings().filter(e => e.key !== normalized.key)].slice(0, safeCap(cap, 30));
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
function personRecord(value) {
  const record = flatRecord(value);
  if (!record || typeof record.name !== 'string' || !record.name.trim() || typeof record.id !== 'string' || !record.id.trim()) return null;
  for (const key of ['bdate', 'btime', 'boffset', 'blat', 'blon', 'place']) {
    if (record[key] != null && !['string', 'number'].includes(typeof record[key])) return null;
  }
  return record;
}
export function listPersons() { return storedCollection(PERSONS_KEY, personRecord, 'id'); }
// person: { id, name, bdate, btime, boffset, blat, blon, place }
export function savePerson(person, cap = 40) {
  if (!plain(person) || typeof person.name !== 'string' || !person.name.trim()) return listPersons();
  const id = person.id || ('p' + person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (person.bdate || ''));
  const entry = personRecord({ ...person, id });
  if (!entry) return listPersons();
  const list = [entry, ...listPersons().filter(p => p.id !== id)].slice(0, safeCap(cap, 40));
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
// The chart wheel is drawn with classed elements (.wheel-ring, .planet-glyph,
// .aspect-line …) styled by style.css. That stylesheet does NOT travel with a
// downloaded .svg/.png, so exports used to come out unstyled. We inline a
// self-contained copy of the `.chart-wheel` rule subset (var()s resolved to the
// literal token values) as a <style> element inside the serialized clone, so the
// downloaded file renders identically to the on-page wheel and stays editable by
// hand (classes preserved). Kept here as a string constant — no runtime DOM read,
// so the module stays import-safe in Node.
const WHEEL_EXPORT_CSS = `
.chart-wheel{display:block;margin:0 auto;font-family:'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif}
.wheel-ring{fill:#fffdf6;stroke:#cbbd9c;stroke-width:1}
.wheel-ring:first-of-type{fill:#fbf4e3}
.sign-div{stroke:#cbbd9c;stroke-width:1}
.cusp{stroke:#c2b48f;stroke-width:1;stroke-dasharray:3 3}
.cusp-angle{stroke:#8a6a2a;stroke-width:1.8}
.sign-glyph{font-size:17px}
.elem-fire{fill:#c0432b}.elem-earth{fill:#6c7a32}.elem-air{fill:#2f7ca8}.elem-water{fill:#4a55a8}
.house-num{font-size:11px;fill:#9b8e6e;font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif}
.angle-label{font-size:10px;fill:#6b5a2a;font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;font-weight:700;letter-spacing:.05em}
.planet-tick{stroke:#c7b88f;stroke-width:.8}
.planet-glyph{font-size:19px;fill:#2a2419}
.planet-deg{font-size:9px;fill:#6b6354;font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif}
.planet.benefic .planet-glyph{fill:#2f7d4f}
.planet.malefic .planet-glyph{fill:#b23b2e}
.planet.lum .planet-glyph{fill:#b8862b}
.planet.neutral .planet-glyph{fill:#6a5aa0}
.planet.point .planet-glyph{fill:#7b6f8f;font-size:16px}
.aspect-line{stroke-width:1.1;opacity:.6;fill:none}
.aspect-line.asp-soft{stroke:#2f7d4f}
.aspect-line.asp-hard{stroke:#b23b2e}
.aspect-line.asp-conj{stroke:#8a6a2a}
.aspect-line.separating{stroke-dasharray:4 4;opacity:.4}
`;

// True only for the chart wheel (root carries `.chart-wheel`, or contains one) —
// so we never touch non-wheel SVGs (kameas, yantras) that also round-trip here.
function isChartWheel(svgEl) {
  try {
    return !!(svgEl && ((svgEl.classList && svgEl.classList.contains('chart-wheel')) ||
      (svgEl.querySelector && svgEl.querySelector('.chart-wheel'))));
  } catch { return false; }
}

const SVG_PAINT_PROPERTIES = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'fill-opacity', 'stroke-opacity', 'opacity',
  'color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline',
  'letter-spacing', 'visibility', 'display', 'stop-color', 'stop-opacity', 'flood-color', 'flood-opacity',
  'paint-order', 'vector-effect', 'transform', 'transform-origin', 'transform-box'];

// Capture computed paint from the real diagram before detaching it. Every
// element gets literal values; page CSS, theme variables and remote fonts are
// not dependencies of the serialized SVG. Geometry attributes remain unchanged.
function freezeSVGPaint(source, clone) {
  const view = source.ownerDocument?.defaultView;
  const getStyle = view?.getComputedStyle?.bind(view) || globalThis.getComputedStyle;
  if (typeof getStyle !== 'function') return false;
  const originals = [source, ...source.querySelectorAll('*')], copies = [clone, ...clone.querySelectorAll('*')];
  originals.forEach((element, index) => {
    if (['style', 'title', 'desc', 'metadata'].includes(element.localName)) return;
    const target = copies[index], paint = getStyle(element);
    target.removeAttribute('style');
    for (const property of SVG_PAINT_PROPERTIES) {
      const value = paint.getPropertyValue(property);
      if (value && !/var\s*\(/i.test(value)) target.style.setProperty(property, value);
    }
    for (const attribute of Array.from(target.attributes)) {
      if (/^on/i.test(attribute.name)) target.removeAttribute(attribute.name);
      else if (attribute.name !== 'style' && /var\s*\(/i.test(attribute.value)) {
        const value = paint.getPropertyValue(attribute.name);
        if (!value || /var\s*\(/i.test(value)) throw new Error(`Cannot resolve SVG paint: ${attribute.name}`);
        target.setAttribute(attribute.name, value);
      }
    }
  });
  clone.querySelectorAll('style,script').forEach(node => node.remove());
  return true;
}

// Serialize an <svg> element to a standalone SVG string (with the xmlns added).
// For the chart wheel, the wheel stylesheet is embedded so the file is portable.
export function svgToString(svgEl) {
  if (!svgEl || typeof svgEl.cloneNode !== 'function') throw new Error('No SVG diagram to export.');
  const clone = svgEl.cloneNode(true);
  if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (!clone.getAttribute('xmlns:xlink')) clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  if (!freezeSVGPaint(svgEl, clone) && isChartWheel(svgEl)) {
    clone.querySelectorAll('style').forEach(node => node.remove());
    const doc = svgEl.ownerDocument || document;
    const styleEl = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = WHEEL_EXPORT_CSS;
    clone.insertBefore(styleEl, clone.firstChild);
  }
  // A detached, already self-styled symbol needs no computed-style access.
  // Other detached SVGs must not silently export unresolved theme variables.
  for (const element of [clone, ...clone.querySelectorAll('*')]) {
    if (element.localName === 'style' && /var\s*\(/i.test(element.textContent)) throw new Error('Attach the diagram before exporting its theme styles.');
    for (const attribute of Array.from(element.attributes)) if (attribute.name === 'style' || SVG_PAINT_PROPERTIES.includes(attribute.name)) {
      if (/var\s*\(/i.test(attribute.value)) throw new Error('SVG export contains unresolved theme styles.');
    }
  }
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
      if (!Number.isFinite(scale) || scale < 1 || scale > 4) throw new Error('PNG scale must be between 1 and 4.');
      const str = svgToString(svgEl);
      const vb = svgEl.viewBox && svgEl.viewBox.baseVal;
      const w = (vb && vb.width) || svgEl.clientWidth || 540;
      const h = (vb && vb.height) || svgEl.clientHeight || 540;
      if (![w, h].every(v => Number.isFinite(v) && v > 0) || w * h * scale * scale > 16777216) throw new Error('PNG exceeds the 16-megapixel export limit.');
      const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = w * scale; canvas.height = h * scale;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, canvas.width, canvas.height); // parchment ground (--paper-0), matches the wheel
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
