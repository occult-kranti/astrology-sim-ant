// ============================================================================
//  jung-tool.js — drives pages/jung/tool.html: the three kinds of chart-work
//  C. G. Jung actually did, on this site's engine.
//   1. The PSYCHOLOGICAL HOROSCOPE — a natal figure read through the Jungian
//      layer (archetypes, the element→function balance, anima/animus, the
//      Sol–Luna coniunctio, the senex/shadow), as Jung cast charts for patients.
//   2. The SYNASTRY of his 1952 marriage experiment — the cross-aspect grid
//      between two nativities with the three classic marriage aspects flagged.
//   3. The AEON CLOCK of Aion — precession, the Platonic month, and the
//      competing datings of the Age of Aquarius (Jung's own included).
//  One click loads Jung's OWN nativity (as his daughter cast it).
//
//  HONEST FRAMING: Jung used astrology; he never validated it. Everything here
//  is a historical, interpretive practice — described, never prescribed.
// ============================================================================
import { castChart, formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { renderChart } from '../core/chart.js';
import { allAspects } from '../core/aspects.js';
import { jungianReading, crossAspects, jungAspectHits, aeonClock, JUNG_BIRTH, JUNG_EXPERIMENT, expectedRate } from '../core/jung.js';
import { wireCitySelect, toUTC, autolinkResultPanels } from './shared.js';
import { attachPersonPicker } from './person.js';
import { initDivinationAssistant } from './divination-assistant.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const motionOK = () => { try { return matchMedia('(prefers-reduced-motion: no-preference)').matches; } catch { return false; } };
const ENH = {}; let jbar = null;

async function mountJungEnh() {
  const L = async p => { try { return await import(p); } catch { return null; } };
  ENH.fig = await L('./viz/figure.js'); ENH.wi = await L('./viz/wheel-interact.js'); ENH.wr = await L('./wheel-rotate.js'); ENH.ab = await L('./action-bar.js');
  try { const i = await L('./viz/inspect.js'); i && i.initInspect && i.initInspect(); } catch { /* */ }
  if (ENH.ab && ENH.ab.mountActionBar && $('jt-actionbar')) {
    try { jbar = ENH.ab.mountActionBar($('jt-actionbar'), { variant: 'tool', exports: [], askAI: () => { const a = $('dv-assistant'); if (a) { a.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto' }); const t = a.querySelector('textarea, input'); t && t.focus(); } }, summary: () => ({ verdict: '', text: 'Psychological horoscope computed.' }) }); } catch { jbar = null; }
  }
}

// jt-wheel already sits inside a .fig wrapper, so render directly (no mountFigure
// nesting) and wire the interaction/rotation onto the svg.
function renderJungWheel(container, chart, asps) {
  container.innerHTML = '';
  renderChart(container, chart, asps, { size: 340 });
  const m = container.querySelector('svg');
  try { ENH.wi && ENH.wi.wireWheel && ENH.wi.wireWheel(m, chart, asps); } catch { /* */ }
  try { ENH.wr && ENH.wr.attachWheelRotate && ENH.wr.attachWheelRotate(container, chart); } catch { /* */ }
}
const G = p => PLANET_GLYPHS[p] || '';

// the last computed psychological horoscope, exposed to the "Jung reads it
// himself" AI panel (the randomness-free, cited report is the grounding).
let lastJungReading = null;
const jungSubs = [];
function jungReadingObj(chart, r, isJung) {
  return {
    kind: 'jung', name: isJung ? 'C. G. Jung' : '', isJung, reading: r,
    asc: formatLon(chart.asc), mc: formatLon(chart.mc),
    ascSign: signOf(chart.asc).name, mcSign: signOf(chart.mc).name,
  };
}

function fieldsOf(prefix) {
  return { bdate: $(prefix + '-date'), btime: $(prefix + '-time'), boffset: $(prefix + '-offset'), blat: $(prefix + '-lat'), blon: $(prefix + '-lon') };
}
function chartFrom(prefix) {
  const f = fieldsOf(prefix);
  const lat = parseFloat(f.blat.value), lon = parseFloat(f.blon.value);
  if (isNaN(lat) || isNaN(lon) || !f.bdate.value || !f.btime.value) return null;
  const date = toUTC(f.bdate.value, f.btime.value, parseFloat(f.boffset.value) || 0);
  return castChart(date, lat, lon, 'regiomontanus');
}
function fillJung(prefix) {
  const f = fieldsOf(prefix);
  f.bdate.value = JUNG_BIRTH.date; f.btime.value = JUNG_BIRTH.time; f.boffset.value = JUNG_BIRTH.utcOffset;
  f.blat.value = JUNG_BIRTH.lat; f.blon.value = JUNG_BIRTH.lon;
}

export function initJungTool() {
  for (const p of ['ja', 'jb']) {
    wireCitySelect($(p + '-city'), $(p + '-lat'), $(p + '-lon'), $(p + '-offset'));
    attachPersonPicker($(p + '-picker-anchor'), fieldsOf(p));
  }
  $('ja-usejung').addEventListener('click', () => { fillJung('ja'); runHoroscope(); });
  $('jt-horoscope-form').addEventListener('submit', e => { e.preventDefault(); runHoroscope(); });
  $('jt-synastry-run').addEventListener('click', () => runSynastry());
  renderAeon();
  mountJungAssistant();
  mountJungEnh();
}

// The "Jung reads it himself" AI panel — the shared divination assistant,
// re-skinned to speak in Jung's own first-person voice and grounded in the
// computed psychological horoscope. Claude is recommended for the full reading.
function mountJungAssistant() {
  if (!$('dv-assistant')) return;
  initDivinationAssistant({
    kind: 'jung',
    getReading: () => lastJungReading,
    subscribeReading: cb => jungSubs.push(cb),
    interpretMaxTokens: 8192,
    copy: {
      botLabel: 'C. G. Jung',
      aboutLabel: 'Let Jung read it himself',
      aboutHtml: 'Have <b>C. G. Jung</b> read this horoscope aloud — the model speaks in the <b>first person as Jung</b>, '
        + 'a faithful reconstruction of his documented voice and views, grounded strictly in the <b>computed positions</b> '
        + 'above. It reads the chart as he did — a <b>mirror of the psyche</b>, never a fate or a forecast — and it stays '
        + 'honest, as he was, that his own statistical test of astrology came out null. <b>Claude is recommended</b> for the '
        + 'full, extremely detailed reading (a free Groq key also works, but gives a shorter reply). Your own key; nothing is '
        + 'proxied, no key is bundled.',
      interpretLabel: '📖 Have Jung read the whole horoscope',
      interpretHint: 'First <b>compute a horoscope above</b>; the button hands Jung the whole computed figure and asks him to '
        + 'read it <b>step by step</b> — the frame, Sol, Luna, the coniunctio, Mercurius, the four functions, the shadow, and '
        + 'the individuation task. Each reply has a <b>⤓ save</b> link.',
      interpretUserMsg: '📖 C. G. Jung — read the whole psychological horoscope, step by step',
      placeholder: 'Ask Jung about this horoscope… (e.g. “what is my inferior function, and why does it matter?”)',
      emptyText: 'Compute a psychological horoscope above first.',
    },
  });
}

// --- 1. the psychological horoscope ------------------------------------------
function runHoroscope() {
  const chart = chartFrom('ja');
  if (!chart) { $('jt-reading').innerHTML = '<p class="muted">Fill the birth date, time and place of Person A first.</p>'; return; }
  let r;
  try { r = jungianReading(chart); } catch (e) { $('jt-reading').innerHTML = `<p class="muted">Could not compute (${esc(e.message)}).</p>`; return; }

  try { renderJungWheel($('jt-wheel'), chart, allAspects(chart.planets)); } catch { /* wheel is optional */ }
  try { jbar && jbar.show && jbar.show(); } catch { /* */ }

  const isJung = $('ja-date').value === JUNG_BIRTH.date && $('ja-time').value === JUNG_BIRTH.time
    && Math.abs(parseFloat($('ja-lat').value) - JUNG_BIRTH.lat) < 0.01 && Math.abs(parseFloat($('ja-lon').value) - JUNG_BIRTH.lon) < 0.01;
  $('jt-reading').innerHTML = `
    ${isJung ? `<p class="small"><b>This is Jung’s own nativity</b> — Sun ${esc(formatLon(chart.planets.Sun.lon))}, Moon ${esc(formatLon(chart.planets.Moon.lon))}, Ascendant ${esc(formatLon(chart.asc))} — as his daughter, the astrologer Gret Baumann-Jung, cast it (the birth time is a family reconstruction). ${esc(JUNG_BIRTH.cite)}</p>` : ''}
    <h3>The planets as archetypal images</h3>
    <table class="data"><thead><tr><th class="l">Planet</th><th class="l">Position</th><th class="l">Archetype</th><th class="l">The Jungian reading</th></tr></thead>
    <tbody>${r.planets.map(p => `<tr>
      <td class="l">${p.glyph} ${esc(p.planet)}</td>
      <td class="l">${esc(p.label)}, house ${p.house}${p.retrograde ? ' ℞' : ''}</td>
      <td class="l"><b>${esc(p.archetype)}</b></td>
      <td class="l">${esc(p.meaning)} <span class="muted small">[${esc(p.cite)}]</span></td></tr>`).join('')}</tbody></table>

    <h3>The element balance — the four functions</h3>
    <p class="small">Weighted count (luminaries ×2, Ascendant +1):
      ${r.elements.functions.map(f => `<span class="pill">${esc(f.element)} / ${esc(f.function)}: <b>${f.weight}</b></span>`).join(' ')}</p>
    <p class="small">Leading: <b>${esc(r.elements.dominant.element)} → ${esc(r.elements.dominant.function)}</b> (${esc(r.elements.dominant.note)});
      least: <b>${esc(r.elements.inferior.element)} → ${esc(r.elements.inferior.function)}</b> — in the post-Jungian reading, the
      candidate <i>inferior function</i>, the doorway of the unconscious. <span class="muted">[${esc(r.elements.dominant.cite)}]</span></p>
    ${r.elements.axisNote ? `<p class="small muted">${esc(r.elements.axisNote)}</p>` : ''}

    <h3>Sol &amp; Luna — the coniunctio</h3>
    <p class="small">${esc(r.coniunctio.text)}</p>
    <p class="small muted">${esc(r.coniunctio.note)}</p>

    <h3>Anima / animus significators</h3>
    <p class="small">Anima side: ${esc(r.animaAnimus.anima)}. Animus side: ${esc(r.animaAnimus.animus)}.</p>
    <p class="small muted">${esc(r.animaAnimus.note)}</p>

    <h3>The senex &amp; the shadow</h3>
    <p class="small">${esc(r.shadow.saturn)}. ${esc(r.shadow.text)}</p>

    <div class="callout science" style="margin-top:.8rem"><span class="label">Held to the honest frame</span> ${esc(r.caveat)}</div>`;
  try { autolinkResultPanels(['jt-reading']); } catch { /* non-fatal */ }

  // hand the computed report to the "Jung reads it himself" AI panel
  lastJungReading = jungReadingObj(chart, r, isJung);
  jungSubs.forEach(cb => { try { cb(lastJungReading); } catch { /* non-fatal */ } });
}

// --- 2. the marriage-experiment synastry --------------------------------------
function runSynastry() {
  const A = chartFrom('ja'), B = chartFrom('jb');
  if (!A || !B) { $('jt-synastry').innerHTML = '<p class="muted">Fill the birth data of BOTH Person A and Person B first.</p>'; return; }
  const hits = crossAspects(A, B);
  const classic = jungAspectHits(A, B);
  const anyClassic = classic.some(c => c.present);
  $('jt-synastry').innerHTML = `
    <p class="small">The cross-aspects Jung's experiment tallied — the <b>conjunctions and oppositions</b> (orb ${JUNG_EXPERIMENT.orb}°)
      of <b>Sun, Moon, Venus, Mars and the Ascendant–Descendant axis</b> between the two nativities (a conjunction with
      the Descendant appears here as an opposition with the Ascendant; Jung omitted the MC/IC — CW 8 §878 n.3):</p>
    ${hits.length ? `<table class="data"><thead><tr><th class="l">Person A</th><th></th><th class="l">Person B</th><th class="l">Aspect</th><th class="l">Orb</th></tr></thead>
      <tbody>${hits.map(h => `<tr><td class="l">${G(h.from)} ${esc(h.from)}</td><td>${h.glyph}</td><td class="l">${G(h.to)} ${esc(h.to)}</td><td class="l">${esc(h.aspect)}</td><td class="l">${h.orb.toFixed(1)}°</td></tr>`).join('')}</tbody></table>`
      : '<p class="small muted">No cross-conjunction or opposition within the orb — by Jung’s tally this pairing scores no aspect at all (as most chance pairings do not).</p>'}
    <h3>The three “classic marriage aspects”</h3>
    <p class="small">The aspects that topped Jung's three batches, checked in both directions:</p>
    <ul class="clean small">${classic.map(c => `<li><span class="verdict ${c.present ? 'green' : 'amber'}">${c.present ? 'present' : 'absent'}</span>
      <b>${esc(c.label)}</b> (closest separation ${c.orb.toFixed(1)}°) — topped batch ${c.batch} of the experiment.</li>`).join('')}</ul>
    <div class="callout science"><span class="label">What this ${anyClassic ? 'does NOT mean' : 'means'}</span>
      By chance alone, a given directional aspect lands within ±8° in about <b>1 pairing in ${Math.round(1 / expectedRate(JUNG_EXPERIMENT.orb))}</b>
      (≈${(expectedRate(JUNG_EXPERIMENT.orb) * 100).toFixed(1)}%); checked both ways, as displayed here, Sun–Moon and Moon–Ascendant reach about 1 in 11
      (Moon–Moon, being symmetric, stays ≈ 1 in 22). Across the <b>fifty</b> aspects Jung tallied, some aspect scoring ~10% in a batch
      is what chance looks like. ${anyClassic ? 'Finding one here is expected noise, not a verdict on any relationship.' : 'Their absence is equally meaningless.'}
      Jung himself conceded the experiment had no statistical significance — see <a href="experiment.html">the experiment, re-run honestly</a>.</div>`;
  try { autolinkResultPanels(['jt-synastry']); } catch { /* non-fatal */ }
}

// --- 3. the aeon clock ----------------------------------------------------------
function renderAeon() {
  let a;
  try { a = aeonClock(new Date()); } catch (e) { $('jt-aeon').innerHTML = `<p class="muted">Could not compute (${esc(e.message)}).</p>`; return; }
  $('jt-aeon').innerHTML = `
    <p class="small">The <b>precession of the equinoxes</b> carries the vernal point backward through the constellations —
      one full <b>Platonic year</b> of ≈ <b>${a.platonicYear.toLocaleString()} years</b>, one sign (a <b>Platonic month</b>,
      Jung's "aeon") every ≈ <b>${a.platonicMonth.toLocaleString()} years</b>. This is real, verifiable astronomy — the
      meanings assigned to the ages are not.</p>
    <p class="small">Today the vernal point stands at sidereal ${a.vernalSiderealLon.toFixed(2)}° (ayanāṁśa ${a.ayanamsa.toFixed(2)}°) —
      <b>${a.pctThroughPisces}% of the way through Pisces</b> by the equal-sign reckoning, with ≈ <b>${a.yearsToAquarius} years</b>
      to the Aquarius boundary (≈ AD ${a.aquariusYearLahiri}).</p>
    <div class="meter" style="height:.8rem;background:var(--parchment-2);border:1px solid var(--rule);border-radius:.4rem;overflow:hidden;margin:.4rem 0">
      <div style="width:${a.pctThroughPisces}%;height:100%;background:var(--water)"></div></div>
    <h3>When does the Age of Aquarius begin? It depends whom you ask.</h3>
    <table class="data"><thead><tr><th class="l">Dating</th><th class="l">By what reckoning</th><th class="l">Source</th></tr></thead>
      <tbody>${a.datings.map(d => `<tr><td class="l"><b>${esc(d.when)}</b></td><td class="l">${esc(d.by)}</td><td class="l small">${esc(d.cite)}</td></tr>`).join('')}</tbody></table>
    <p class="small muted">${esc(a.note)} <span class="muted">— ${esc(a.cite)}</span></p>`;
}
