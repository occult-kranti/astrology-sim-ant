// ============================================================================
//  kabbalah.js (app) — drives pages/kabbalah.html. Renders the Tree of Life as
//  inline SVG from the Kircher-layout coordinates in core/data/kabbalah-data.js,
//  wires the click-to-inspect panels (sephira → sphere/pillar/planet/kamea link;
//  path → letter/class/correspondence/GD trump link, with the DISPUTE panels
//  where a value is contested), the gematria calculator (core/kabbalah.js), the
//  Sefer-Yetzirah recension spread table, and the transmission timeline.
//
//  All DOM lives here; the engine (core/kabbalah.js) and data are pure.
//  HONEST FRAMING: a layered historical symbolic construction of no
//  demonstrated validity — described, never prescribed; disputes shown, never
//  resolved.
// ============================================================================
import {
  SEPHIROTH, PATHS, DAATH, ORIENTATION, SY_PLANET_SPREAD, SY_RECENSIONS,
  TRANSMISSION, QUOTES, KAPLAN_QUOTE_CAVEAT, HEBREW_LETTERS, disputeById,
} from '../core/data/kabbalah-data.js';
import {
  gematria, GEMATRIA_METHODS, GEMATRIA_EXAMPLES, pathByNum, sephiraByNum,
  pathsAt, kameaCellFor,
} from '../core/kabbalah.js';
import { kameaByPlanet } from '../core/kamea.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

// --- layout: normalized coords → SVG pixels ---------------------------------
const X = x => 80 + x * 320;
const Y = y => 50 + y * 88;
const SEPH_R = 30;
// Letter glyphs sit at the path midpoint except where midpoints would collide
// (the middle-pillar verticals share x with Daath and other glyphs).
const GLYPH_T = { 13: 0.82, 25: 0.28 };

export function initKabbalah() {
  renderTree();
  renderOrientation();
  initCalc();
  renderSpread();
  renderRecensions();
  renderTimeline();
  showIntro();
  document.addEventListener('click', onPick);
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('.kb-seph,.kb-path,.kb-daath')) {
      e.preventDefault(); onPick(e);
    }
  });
}

// --- the tree ----------------------------------------------------------------
function renderTree() {
  const paths = PATHS.map(p => {
    const a = sephiraByNum(p.from), b = sephiraByNum(p.to);
    const x1 = X(a.x), y1 = Y(a.y), x2 = X(b.x), y2 = Y(b.y);
    const t = GLYPH_T[p.num] || 0.5;
    const gx = x1 + (x2 - x1) * t, gy = y1 + (y2 - y1) * t;
    return `<g class="kb-path" data-kb-path="${p.num}" tabindex="0" role="button"
      aria-label="Path ${p.num}: ${esc(p.letter.name)}, ${esc(p.correspondence)}, ${esc(p.gdTrump.name)}">
      <line class="kb-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
      <g class="kb-glyph"><circle cx="${gx}" cy="${gy}" r="12"></circle>
        <text class="kb-svgtext" x="${gx}" y="${gy + 4.5}" text-anchor="middle" font-size="13">${p.letter.char}</text></g>
    </g>`;
  }).join('');
  const daath = `<g class="kb-daath" data-kb-daath="1" tabindex="0" role="button" aria-label="Daath — not a sephirah (flagged)">
    <circle cx="${X(DAATH.x)}" cy="${Y(DAATH.y)}" r="16"></circle>
    <text class="kb-svgtext" x="${X(DAATH.x)}" y="${Y(DAATH.y) + 4}" text-anchor="middle" font-size="10" opacity=".75">${DAATH.hebrew}</text></g>`;
  const sephs = SEPHIROTH.map(s => {
    const cx = X(s.x), cy = Y(s.y);
    return `<g class="kb-seph${s.planet ? ' planetary' : ''}" data-kb-seph="${s.num}" tabindex="0" role="button"
      aria-label="${esc(s.name)} (${s.num}), ${esc(s.translation)}${s.planet ? ', ' + esc(s.planet) : ''}">
      <circle cx="${cx}" cy="${cy}" r="${SEPH_R}"></circle>
      <text class="kb-svgtext" x="${cx}" y="${cy - 13}" text-anchor="middle" font-size="8" opacity=".7">${s.num}</text>
      <text class="kb-svgtext" x="${cx}" y="${cy + 3}" text-anchor="middle" font-size="13">${s.hebrew}</text>
      <text class="kb-svgtext" x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="8.5">${esc(s.name)}</text>
    </g>`;
  }).join('');
  $('kb-tree').innerHTML = `<svg viewBox="0 0 480 640" role="img"
    aria-label="The Tree of Life, Kircher layout: ten sephiroth joined by twenty-two lettered paths">
    <text class="kb-svgtext" x="80" y="14" text-anchor="middle" font-size="10" opacity=".7">Severity</text>
    <text class="kb-svgtext" x="400" y="14" text-anchor="middle" font-size="10" opacity=".7">Mercy</text>
    ${paths}${daath}${sephs}</svg>`;
}

function renderOrientation() {
  $('kb-orientation').innerHTML = `<b>Orientation:</b> ${esc(ORIENTATION.note)} <span class="muted">— ${esc(ORIENTATION.cite)}</span>`;
}

function onPick(e) {
  const el = e.target.closest && e.target.closest('[data-kb-seph],[data-kb-path],[data-kb-daath]');
  if (!el) return;
  document.querySelectorAll('#kb-tree .sel').forEach(n => n.classList.remove('sel'));
  if (el.hasAttribute('data-kb-daath')) { markSel('.kb-daath'); showDaath(); }
  else if (el.hasAttribute('data-kb-seph')) { const n = +el.getAttribute('data-kb-seph'); markSel(`.kb-seph[data-kb-seph="${n}"]`); showSephira(n); }
  else { const n = +el.getAttribute('data-kb-path'); markSel(`.kb-path[data-kb-path="${n}"]`); showPath(n); }
  if (!e.target.closest('#kb-tree')) { const box = $('kb-inspector'); if (box.scrollIntoView) box.scrollIntoView({ block: 'nearest' }); }
}
function markSel(sel) { const n = document.querySelector('#kb-tree ' + sel); if (n) n.classList.add('sel'); }

// --- inspector panels ----------------------------------------------------------
function showIntro() {
  $('kb-inspector').innerHTML = `<h3 style="margin:0 0 .4rem">How to read this diagram</h3>
    <p class="small" style="margin:.2rem 0">Click a <b>sephira</b> (numbered circle) or a <b>path</b> (letter glyph) to
    open its record here. The seven planetary sephiroth link to their kameas; every path links to its Golden Dawn trump.
    The dashed circle is <b>Daath</b> — not one of the ten (click it to see why).</p>
    <ul class="clean small" style="margin:.4rem 0">
      <li><span class="badge badge--plain">keyboard</span> Tab to a sphere or path, then press <b>Enter</b> or <b>Space</b> to inspect it.</li>
      <li><span class="badge badge--disp">contested</span> where an assignment is disputed between recensions, it is <b>flagged and never resolved</b>.</li>
    </ul>`;
}

function sephChip(num) { const s = sephiraByNum(num); return `<button type="button" class="btn sm" data-kb-seph="${num}">${num} ${esc(s.name)}</button>`; }
function pathChip(num) { const p = pathByNum(num); return `<button type="button" class="btn sm" data-kb-path="${num}">${num} ${p.letter.char} ${esc(p.letter.name)}</button>`; }
function disputeBox(id) {
  const d = disputeById(id);
  if (!d) return '';
  return `<div class="callout kb-flag" style="margin-top:.6rem"><span class="badge badge--disp">Contested — never resolved</span>
    <span class="small">${esc(d.what)}</span><br><span class="small muted">Cite: ${esc(d.cite)}</span></div>`;
}

function showSephira(num) {
  const s = sephiraByNum(num);
  const kamea = s.kameaPlanet ? kameaByPlanet(s.kameaPlanet) : null;
  const planetLine = s.planet
    ? `<b>${esc(s.planet)}</b> — <a href="picatrix/kameas.html">see its kamea (the ${kamea ? kamea.order + '×' + kamea.order : ''} square) →</a>`
    : `<i>none</i> — this sephira is <b>not a planet</b>; it is ${esc(s.sphere)}`;
  $('kb-inspector').innerHTML = `
    <h3 style="margin:0">${s.num} · ${esc(s.name)}${s.also ? ` <span class="small muted">(also ${esc(s.also)})</span>` : ''} — <span lang="he">${s.hebrew}</span></h3>
    <p class="small" style="margin:.3rem 0">“${esc(s.translation)}” · Pillar of <b>${esc(pillarName(s.pillar))}</b></p>
    <ul class="clean small">
      <li><b>Sphere:</b> ${esc(s.sphere)}</li>
      <li><b>Planet:</b> ${planetLine}</li>
      <li><b>Divine name:</b> ${esc(s.godName)} · <b>Archangel:</b> ${esc(s.archangel)} · <b>Choir:</b> ${esc(s.choir)}</li>
      <li><b>Queen-scale colour:</b> ${esc(s.queenColor)}</li>
    </ul>
    ${s.variants ? `<div class="callout kb-flag"><span class="badge badge--warn">Flagged</span> <span class="small">${esc(s.variants)}</span></div>` : ''}
    <p class="small" style="margin:.5rem 0 .2rem"><b>Paths meeting here:</b> ${pathsAt(num).map(p => pathChip(p.num)).join(' ')}</p>
    <p class="small muted">Cite: ${esc(s.cite)}</p>`;
}

function pillarName(p) { return p === 'middle' ? 'the Middle' : p === 'mercy' ? 'Mercy (viewer’s right)' : 'Severity (viewer’s left)'; }

function showPath(num) {
  const p = pathByNum(num);
  const cls = { mother: 'mother (→ an element, Sefer Yetzirah ch. 3)', double: 'double (→ a planet, SY ch. 4 — assignment CONTESTED, see below)', simple: 'simple (→ a zodiac sign, SY ch. 5)' }[p.letterClass];
  const spreadRow = p.letterClass === 'double' ? doubleSpreadRow(p.letter.name) : '';
  $('kb-inspector').innerHTML = `
    <h3 style="margin:0">Path ${p.num} · ${esc(p.letter.name)} <span lang="he">${p.letter.char}</span></h3>
    <p class="small" style="margin:.3rem 0"><b>Joins:</b> ${sephChip(p.from)} ${sephChip(p.to)}</p>
    <ul class="clean small">
      <li><b>Letter value:</b> ${p.letter.value} (standard gematria)</li>
      <li><b>Letter class:</b> ${esc(cls)}</li>
      <li><b>Correspondence (GD):</b> ${esc(p.correspondence)}${p.correspondence2 ? ` · also ${esc(p.correspondence2)}` : ''}</li>
      <li><b>GD trump:</b> <a href="tarot.html">${esc(p.gdTrump.name)} (${ROMAN[p.gdTrump.number]}) →</a></li>
    </ul>
    ${spreadRow}
    ${(p.disputeIds || []).map(disputeBox).join('')}
    <p class="small muted">Cite: ${esc(p.cite)}</p>`;
}

// The four-column recension row for one double letter — shown right on the path.
function doubleSpreadRow(letterName) {
  const i = SY_PLANET_SPREAD.letters.indexOf(letterName === 'Tau' ? 'Tau' : letterName);
  if (i < 0) return '';
  const cells = SY_PLANET_SPREAD.columns.map(c =>
    `<td>${esc(c.planets[i])}${c.matchesNoManuscript ? ' <span class="small muted">(no MS)</span>' : ''}${c.uncertain ? ' <span class="small muted">(uncertain)</span>' : ''}</td>`).join('');
  return `<div style="overflow-x:auto"><table class="data small"><caption class="small muted">Which planet? — by version (never resolved)</caption>
    <thead><tr>${SY_PLANET_SPREAD.columns.map(c => `<th>${esc(shortLabel(c.key))}</th>`).join('')}</tr></thead>
    <tbody><tr>${cells}</tr></tbody></table></div>`;
}
function shortLabel(key) {
  return { shortLongSaadia: 'Short/Long/Saadia', gra: 'Gra', zohar: 'Zohar (uncertain)', goldenDawn: 'Golden Dawn' }[key] || key;
}

function showDaath() {
  $('kb-inspector').innerHTML = `
    <h3 style="margin:0">Daath <span lang="he">${DAATH.hebrew}</span> <span class="small muted">— “${esc(DAATH.translation)}”</span></h3>
    <div class="callout kb-flag" style="margin-top:.5rem"><span class="badge badge--warn">Not a sephirah</span>
      <span class="small">${esc(DAATH.note)}</span></div>
    <p class="small muted">Cite: ${esc(DAATH.cite)}</p>`;
}

// --- gematria calculator ----------------------------------------------------------
function initCalc() {
  const sel = $('kb-method');
  sel.innerHTML = Object.entries(GEMATRIA_METHODS).map(([k, m]) => `<option value="${k}">${esc(m.label)}</option>`).join('');
  const letters = HEBREW_LETTERS.map(L =>
    `<button type="button" class="btn sm kb-key" data-kb-key="${L.char}" title="${esc(L.name)} = ${L.value}" lang="he">${L.char}</button>`).join('');
  const finals = HEBREW_LETTERS.filter(L => L.finalChar).map(L =>
    `<button type="button" class="btn sm kb-key" data-kb-key="${L.finalChar}" title="${esc(L.name)} final = ${L.value} (gadol: ${L.finalValue})" lang="he">${L.finalChar}</button>`).join('');
  $('kb-keyboard').innerHTML = `
    <div class="kb-keys">${letters}<button type="button" class="btn sm" data-kb-key="⌫" title="delete last letter">⌫</button>
      <button type="button" class="btn sm" data-kb-key="⌦" title="clear">clear</button></div>
    <div class="kb-keys"><span class="small muted" style="align-self:center">Final forms (mispar-gadol variant 500–900):</span>${finals}</div>`;
  $('kb-examples').innerHTML = GEMATRIA_EXAMPLES.map(x =>
    `<button type="button" class="btn sm" data-kb-example="${esc(x.he)}" title="${esc(x.translit)} — ${esc(x.calc)}"><span lang="he">${esc(x.he)}</span> = ${x.total}</button>`).join(' ');
  $('kb-calc').addEventListener('click', e => {
    const key = e.target.closest && e.target.closest('[data-kb-key]');
    const exm = e.target.closest && e.target.closest('[data-kb-example]');
    const input = $('kb-word');
    if (key) {
      const k = key.getAttribute('data-kb-key');
      if (k === '⌫') input.value = Array.from(input.value).slice(0, -1).join('');
      else if (k === '⌦') input.value = '';
      else input.value += k;
      runCalc();
    } else if (exm) { input.value = exm.getAttribute('data-kb-example'); runCalc(); }
  });
  $('kb-calc').addEventListener('submit', e => { e.preventDefault(); runCalc(); });
  $('kb-word').addEventListener('input', runCalc);
  sel.addEventListener('change', runCalc);
  $('kb-word').value = GEMATRIA_EXAMPLES[0].he;
  runCalc();
}

function runCalc() {
  const method = $('kb-method').value;
  const g = gematria($('kb-word').value, { method });
  const out = $('kb-result');
  if (!g.letters.length) { out.innerHTML = '<p class="small muted">Type or tap Hebrew letters above — non-Hebrew characters are ignored.</p>'; return; }
  const chips = g.letters.map(l => `<span title="${esc(l.name)}"><span lang="he">${esc(l.char)}</span> ${esc(l.name)} = ${l.value}</span>`).join(' ');
  const hasFinals = g.letters.some(l => l.isFinal);
  const finalsHint = hasFinals && method === 'standard'
    ? '<p class="small muted">This word contains final forms — standard counting values them as medials; flip the method to see the mispar-gadol VARIANT (flagged, never the default).</p>' : '';
  const cell9 = kameaCellFor(g.total, 9);
  $('kb-result').innerHTML = `
    <span class="stat" style="display:inline-block;margin:.4rem 0"><span class="stat-num">${g.total}</span>
      <span class="stat-label">${esc(GEMATRIA_METHODS[g.method].label)}</span></span>
    <p class="kb-breakdown small">${chips}</p>
    ${finalsHint}
    <p class="small muted">Sigil-tracer join: the aiq-bekar power-of-ten collapse lands ${g.total} on cell <b>${cell9}</b>
      of the Moon’s 9×9 kamea — <a href="picatrix/kameas.html">trace names on the squares →</a>.
      The arithmetic is exact; the equal-sum symbolism the tradition built on it has no demonstrated validity.</p>`;
}

// --- the recension spread table ------------------------------------------------------
function renderSpread() {
  const byName = new Map(HEBREW_LETTERS.map(L => [L.name, L]));
  const head = SY_PLANET_SPREAD.columns.map(c =>
    `<th>${esc(c.label)}${c.matchesNoManuscript ? '<br><span class="small" style="font-weight:400">⚠ matches NO manuscript</span>' : ''}${c.uncertain ? '<br><span class="small" style="font-weight:400">⚠ sources conflict</span>' : ''}</th>`).join('');
  const rows = SY_PLANET_SPREAD.letters.map((name, i) => {
    const L = byName.get(name);
    return `<tr><th scope="row"><span lang="he">${L ? L.char : ''}</span> ${esc(name)}</th>${SY_PLANET_SPREAD.columns.map(c => `<td>${esc(c.planets[i])}</td>`).join('')}</tr>`;
  }).join('');
  $('kb-spread').innerHTML = `
    <p class="small">${esc(SY_PLANET_SPREAD.what)}</p>
    <div style="overflow-x:auto"><table class="data">
      <thead><tr><th>Double letter</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small" style="margin-top:.5rem">${SY_PLANET_SPREAD.columns.map(c => `<b>${esc(shortLabel(c.key))}:</b> ${esc(c.note)} <span class="muted">(${esc(c.cite)})</span>`).join('<br>')}</p>
    <blockquote class="small" style="border-left:3px solid var(--gold);margin:.7rem 0;padding:.2rem .8rem">
      “${esc(SY_PLANET_SPREAD.karrQuote.text)}”<br><span class="muted">— ${esc(SY_PLANET_SPREAD.karrQuote.source)}</span></blockquote>
    <p class="small muted">Cite: ${esc(SY_PLANET_SPREAD.cite)}</p>`;
}

// --- recensions, dating & quotes ------------------------------------------------------
function renderRecensions() {
  const versions = SY_RECENSIONS.versions.map(v =>
    `<li><b>${esc(v.name)}</b> — ${esc(v.note)} <span class="muted">(${esc(v.cite)})</span></li>`).join('');
  const quotes = QUOTES.map(q =>
    `<blockquote class="small" style="border-left:3px solid var(--rule);margin:.5rem 0;padding:.2rem .8rem">“${esc(q.text)}”<br>
      <span class="muted">— ${esc(q.source)}</span></blockquote>`).join('');
  $('kb-recensions').innerHTML = `
    <ul class="clean small">${versions}</ul>
    <div class="callout kb-flag"><span class="badge badge--disp">Dating — unresolved</span>
      <span class="small">${esc(SY_RECENSIONS.dating.range)}</span><br>
      <span class="small muted">Cite: ${esc(SY_RECENSIONS.dating.cite)}</span></div>
    <p class="small" style="margin:.6rem 0 .2rem">${esc(SY_RECENSIONS.belimahNote)}</p>
    <p class="small muted">Critical text: ${esc(SY_RECENSIONS.criticalText.name)} — ${esc(SY_RECENSIONS.criticalText.note)}</p>
    <h3 class="small" style="margin:.8rem 0 .2rem"><b>Verified pull-quotes</b> <span class="muted">(same letter, different planets — the disagreement in the sources’ own words)</span></h3>
    ${quotes}
    <p class="small muted">${esc(KAPLAN_QUOTE_CAVEAT)}</p>`;
}

// --- transmission timeline -------------------------------------------------------------
function renderTimeline() {
  $('kb-timeline').innerHTML = `<ol class="clean small">${TRANSMISSION.map(t =>
    `<li style="margin:.25rem 0"><b>${esc(t.when)}</b> — ${esc(t.what)} <span class="muted">(${esc(t.cite)})</span></li>`).join('')}</ol>
    <p class="small muted" style="margin-bottom:0">Each layer is a documented historical addition; the finished diagram
      belongs to no single century and no single author — which is why this page dates every step instead of presenting
      the Tree as one revealed object.</p>`;
}
