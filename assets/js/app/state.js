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
