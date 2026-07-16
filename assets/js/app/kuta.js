// ============================================================================
//  kuta.js (app) — drives pages/kuta.html: VEDIC MARRIAGE MATCHING, the
//  aṣṭakūṭa (36-guṇa) and the ten South-Indian porutham, between two nativities'
//  sidereal Moons. All DOM lives here; the pure scorer is core/kuta.js.
//
//  SENSITIVE DOMAIN. Every line renders "what the tradition computes" — NEVER
//  advice about any real relationship. Contested values are shown as disputes
//  (⚑), never resolved; the North/South 5-9 contradiction is shown both ways.
//  Astrology has no demonstrated validity — described, never prescribed.
// ============================================================================
import { castChart, PLANET_GLYPHS, signOf, SIGNS } from '../core/astro.js';
import { toSidereal, nakshatraOf } from '../core/data/vedic-data.js';
import { ashtakuta, porutham10 } from '../core/kuta.js';
import { wireCitySelect, toUTC } from './shared.js';
import { attachPersonPicker } from './person.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const G = p => PLANET_GLYPHS[p] || '';
const HL = 'background:var(--parchment-2);outline:1px solid var(--gold-2)';
const FLAG = note => `<span title="${esc(note)}" style="cursor:help">⚑</span>`;
const PILL = { pass: '<span class="verdict green">pass</span>', marginal: '<span class="verdict amber">marginal</span>', fail: '<span class="verdict red">fail</span>' };

function fmtSid(lon) {
  const s = signOf(lon);
  const d = Math.floor(s.degInSign), m = Math.round((s.degInSign - d) * 60);
  return m === 60 ? `${d + 1}°00′ ${SIGNS[s.index]}` : `${d}°${String(m).padStart(2, '0')}′ ${SIGNS[s.index]}`;
}

function fieldsOf(prefix) {
  return { bdate: $(prefix + '-date'), btime: $(prefix + '-time'), boffset: $(prefix + '-offset'), blat: $(prefix + '-lat'), blon: $(prefix + '-lon') };
}
// the SIDEREAL Moon longitude of a birth entry
function moonOf(prefix) {
  const f = fieldsOf(prefix);
  const lat = parseFloat(f.blat.value), lon = parseFloat(f.blon.value);
  if (isNaN(lat) || isNaN(lon) || !f.bdate.value || !f.btime.value) return null;
  const date = toUTC(f.bdate.value, f.btime.value, parseFloat(f.boffset.value) || 0);
  const chart = castChart(date, lat, lon, 'whole');
  return toSidereal(chart.planets.Moon.lon, date);
}

export function initKuta() {
  for (const p of ['ka', 'kb']) {
    wireCitySelect($(p + '-city'), $(p + '-lat'), $(p + '-lon'), $(p + '-offset'));
    attachPersonPicker($(p + '-picker-anchor'), fieldsOf(p));
  }
  $('ku-form').addEventListener('submit', e => { e.preventDefault(); compute(); });
  $('ku-variant').addEventListener('change', () => { if ($('ku-ashtakuta').dataset.ready) compute(); });
}

function compute() {
  const boy = moonOf('ka'), girl = moonOf('kb');
  const status = $('ku-status');
  if (boy == null || girl == null) { status.textContent = 'Fill the birth date, time and place of BOTH people.'; return; }
  status.textContent = '';
  const variantSet = $('ku-variant').value === 'common' ? 'common' : 'saravali';

  let ak, po;
  try { ak = ashtakuta(boy, girl, { variantSet }); po = porutham10(boy, girl); }
  catch (e) { $('ku-ashtakuta').innerHTML = `<p class="muted">Could not compute (${esc(e.message)}).</p>`; return; }

  renderMoons(ak, boy, girl);
  renderAshtakuta(ak);
  renderPorutham(po);
  $('ku-ashtakuta').dataset.ready = '1';
}

// --- the two Moons -----------------------------------------------------------
function renderMoons(ak, boy, girl) {
  const g = ak.groom, b = ak.bride;
  $('ku-moons').innerHTML = `
    <div class="grid cols-2">
      <p class="small"><b>Partner 1 — read as the groom (boy):</b> Moon ${esc(fmtSid(boy))} —
        nakṣatra <b>${esc(g.nakshatra)}</b> (pada ${g.pada}), rāśi <b>${esc(g.rashi)}</b> (lord ${G(g.rashiLord)} ${esc(g.rashiLord)}).</p>
      <p class="small"><b>Partner 2 — read as the bride (girl):</b> Moon ${esc(fmtSid(girl))} —
        nakṣatra <b>${esc(b.nakshatra)}</b> (pada ${b.pada}), rāśi <b>${esc(b.rashi)}</b> (lord ${G(b.rashiLord)} ${esc(b.rashiLord)}).</p>
    </div>
    <p class="small muted">The tradition assigns gendered "groom/bride" roles (its matrices are keyed that way); those
      labels are recorded as the tradition's, not applied to any real person. Moons are sidereal (Lahiri).</p>`;
}

// --- 1 · the aṣṭakūṭa (36 guṇa) ---------------------------------------------
function renderAshtakuta(ak) {
  const rows = ak.kutas.map(k => {
    const notes = [];
    for (const d of k.doshas || []) notes.push(`<span class="verdict red">doṣa</span> ${esc(d)}`);
    for (const c of k.cancellations || []) notes.push(`<span class="verdict amber">cancellation</span> ${esc(c)}`);
    const flag = k.contested ? ' ' + FLAG(k.contestedNote || 'contested value — see the notes below') : '';
    return `<tr${k.doshas && k.doshas.length ? '' : ''}>
      <td class="l"><b>${esc(k.name)}</b>${flag}${k.variantUsed ? ` <span class="muted small">[${esc(k.variantUsed)}]</span>` : ''}</td>
      <td class="l"><b>${k.points}</b> / ${k.max}</td>
      <td class="l small">${esc(k.detail)}${notes.length ? '<br>' + notes.join('<br>') : ''}</td></tr>`;
  }).join('');
  const contestedNotes = ak.kutas.filter(k => k.contested && k.contestedNote)
    .map(k => `<li class="small"><b>${esc(k.name)} ⚑:</b> ${esc(k.contestedNote)}</li>`).join('');
  const nadiExempt = ak.kutas.find(k => k.key === 'nadi' && k.exempt);
  const exemptBlock = nadiExempt && nadiExempt.exempt ? `
    <div class="callout science" style="margin-top:.5rem"><span class="label">Nāḍī exempt-star lists — both shown, neither hardcoded</span>
      Two exempt lists circulate (even within one source): <b>List A</b> — ${esc(nadiExempt.exempt.listANames)}
      ${nadiExempt.exempt.listA ? '<span class="verdict amber">a star here IS on list A</span>' : ''};
      <b>List B</b> — ${esc(nadiExempt.exempt.listBNames)}
      ${nadiExempt.exempt.listB ? '<span class="verdict amber">a star here IS on list B</span>' : ''}.
      <br><span class="small muted">${esc(nadiExempt.exempt.note)}</span></div>` : '';
  $('ku-ashtakuta').innerHTML = `
    <div class="stat-row"><div class="stat">
      <div class="stat-num">${ak.total} / ${ak.max}</div>
      <div class="stat-label">Aṣṭakūṭa guṇa — what the tradition computes (not a compatibility measure)</div>
    </div></div>
    <p class="small">The eight kūṭas (guṇas) summed to 36. Rows carrying <b>⚑</b> are values the sources dispute — hover
      for the disagreement; the contested cells (varṇa · graha-maitrī · gaṇa) follow the <b>variant set</b> chosen above
      (currently <b>${esc(ak.variantSet)}</b>). Boy = groom, girl = bride.</p>
    <table class="data"><thead><tr><th class="l">Kūṭa</th><th class="l">Points</th><th class="l">What the tradition computes</th></tr></thead>
      <tbody>${rows}
        <tr style="${HL}"><td class="l"><b>Total</b></td><td class="l"><b>${ak.total}</b> / ${ak.max}</td>
          <td class="l small">Band: ${esc(ak.band.bands)} <b>⚑ ${esc('bands vary by source')}</b>. Minimum commonly cited ${ak.band.minimum}. ${esc(ak.band.ramanSchool)}</td></tr>
      </tbody></table>
    ${exemptBlock}
    <ul style="margin:.6rem 0 0">${contestedNotes}</ul>
    <p class="small muted">Classical anchor: ${esc(ak.classicalAnchor)}</p>`;
}

// --- 2 · the ten porutham ----------------------------------------------------
function renderPorutham(po) {
  const rows = po.poruthams.map(p => {
    const veto = p.veto ? ` <span class="pill" title="rajju/vedhā are non-negotiable vetoes">veto</span>` : '';
    const extra = [];
    if (p.divergence) extra.push(FLAG(p.divergence) + ' <span class="muted">tārā divergence</span>');
    if (p.directionVariant) extra.push(FLAG(p.directionVariant) + ' <span class="muted">direction variant</span>');
    return `<tr${p.veto && p.status === 'fail' ? ` style="${HL}"` : ''}>
      <td class="l"><b>${esc(p.name)}</b>${veto}</td>
      <td>${PILL[p.status] || esc(p.status)}</td>
      <td class="l small">${esc(p.detail)}${extra.length ? ' ' + extra.join(' ') : ''}</td></tr>`;
  }).join('');
  const contradiction = po.contradictions.length ? po.contradictions.map(c => `
    <div class="callout science" style="margin-top:.5rem"><span class="label">Cross-system contradiction — shown both ways, never resolved</span>
      <b>Rāśi (5/9):</b> South says <b>${esc(c.south)}</b> — North says <b>${esc(c.north)}</b>.
      <br><span class="small muted">${esc(c.note)}</span></div>`).join('') : '';
  const vetoBanner = po.vetoed ? `
    <p class="small" style="${HL};padding:.35rem .55rem"><b>Vetoed on:</b> ${po.vetoes.map(esc).join(', ')} —
      in the strict Tamil rule a rajju (or vedhā) match rejects the pairing regardless of the other poruthams. Recorded
      as the tradition's rule, never as a statement about people.</p>` : '';
  $('ku-porutham').innerHTML = `
    <div class="stat-row"><div class="stat">
      <div class="stat-num">${po.passCount} / ${po.total}</div>
      <div class="stat-label">Porutham present (South) — the tradition's tally, never advice</div>
    </div></div>
    <p class="small">The ten South-Indian poruthams as pass / marginal / fail, counted <b>girl → boy</b> per the Tamil
      convention. <b>${po.passCount}</b> of ${po.total} present. Rajju and vedhā are hard vetoes.</p>
    ${vetoBanner}
    <table class="data"><thead><tr><th class="l">Porutham</th><th>Verdict</th><th class="l">What the tradition computes</th></tr></thead>
      <tbody>${rows}</tbody></table>
    ${contradiction}
    <p class="small muted" style="margin-top:.4rem">${esc(po.scoring)}</p>
    <p class="small muted">Classical anchor: ${esc(po.classicalAnchor)}</p>`;
}
