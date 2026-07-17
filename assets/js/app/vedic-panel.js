// ============================================================================
//  vedic-panel.js — a SHARED, TOGGLEABLE "Jagannath Hora (Vedic)" panel that any
//  tool can mount to show the sidereal reading SIDE BY SIDE with the Western one.
//  It is a separate system (different zodiac, houses, daśā), so it is off by
//  default and toggled on per tool. One renderer, used by every integrated tool
//  and the dedicated Vedic page — so the two systems never drift apart.
// ============================================================================
import { castVedic } from '../core/vedic.js';
import { PLANET_GLYPHS } from '../core/astro.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const GL = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋' };
const fmtDate = d => { try { return new Date(d).toISOString().slice(0, 10); } catch { return ''; } };
const digClass = s => s === 'Exalted' || s === 'Own sign' || s === 'Mūlatrikoṇa' ? 'pos' : s === 'Debilitated' ? 'neg' : 'muted';

// Render the full sidereal reading for `chart` into `body`. opts.currentDate
// selects the running daśā (the page/tool passes "now" for a birth chart).
export function renderVedicPanel(body, chart, opts = {}) {
  let v;
  try { v = castVedic(chart, opts); } catch (e) { body.innerHTML = `<p class="muted">Vedic computation failed: ${esc(e.message)}</p>`; return; }

  const grahaRows = Object.entries(v.grahas).map(([p, g]) => `<tr>
    <td>${GL[p] || ''} ${esc(p)}</td>
    <td class="l">${esc(g.label)}${g.retrograde && p !== 'Rahu' && p !== 'Ketu' ? ' ℞' : ''}</td>
    <td>${g.house}</td>
    <td class="l small">${esc(g.nakshatra.name)} <span class="muted">p${g.nakshatra.pada}</span></td>
    <td class="${digClass(g.dignity.state)} small">${esc(g.dignity.state)} <span class="vt-asta" data-asta="${esc(p)}" hidden>☀ asta</span></td></tr>`).join('');

  const dz = v.vimshottari;
  const mahaList = dz.maha.slice(0, 6).map(m => `<span class="${m.current ? 'pos' : 'muted'}">${esc(m.lord)} (${fmtDate(m.start)}${m.current ? ' ◀' : ''})</span>`).join(' · ');
  const navamsa = Object.keys(v.grahas).map(p => `${GL[p] || ''}${esc(RASHI_SHORT(v.navamsa[p]))}`).join(' ');
  const yogas = v.yogas.filter(y => y.present);

  // Ṣaḍbala (full six-fold) table
  const sb = v.shadbala;
  const sbRows = (sb && sb.order ? sb.order : []).map(p => {
    const s = sb.perGraha[p];
    return `<tr><td>${GL[p] || ''} ${esc(p)}</td><td class="r">${s.totalRupa.toFixed(2)}</td>
      <td class="r small muted">${s.required}</td><td class="r ${s.strong ? 'pos' : 'neg'}">${s.ratio}×</td>
      <td class="r small">${s.ishta}/${s.kashta}</td></tr>`;
  }).join('');

  // Practice — the day (vāra) + the birth-keyed remedy (cultural/devotional)
  const pr = v.practice;
  const practiceHtml = pr ? `
    <h3 class="small" style="margin:.8rem 0 .2rem">Practice — the day &amp; the birth <span class="muted small">(cultural/devotional · described, not prescribed)</span></h3>
    <p class="small"><b>Today (${esc(pr.vara.name)} / ${esc(pr.vara.sanskrit)}, a ${esc(pr.vara.graha)}-vāra):</b>
      deity ${esc(pr.vara.deity)}${pr.vara.popular ? ' <span class="muted">(later/popular pairing)</span>' : ''}; ${esc(pr.vara.vrata)}; colour ${esc(pr.vara.colour)}.
      Mantra <b>${esc(pr.vara.mantra)}</b> <span class="muted">(bīja ${esc(pr.vara.bija)}; japa ${pr.vara.japa})</span>;
      yoga ${esc(pr.vara.yoga)} <span class="muted">(modern)</span>; ${esc(pr.vara.yantra)}.</p>
    <p class="small"><b>Birth-keyed:</b> remedial focus <b>${esc(pr.birth.focusGraha)}</b> — ${esc(pr.birth.reason)}.
      Mantra <b>${esc(pr.birth.mantra)}</b> <span class="muted">(bīja ${esc(pr.birth.bija)}; japa ${pr.birth.japa}; deity ${esc(pr.birth.deity)})</span>;
      yoga ${esc(pr.birth.yoga)} <span class="muted">(modern)</span>; ${esc(pr.birth.yantra)}; gem ${esc(pr.birth.gem)}.
      <br>Lagna lord <b>${esc(pr.birth.lagnaLord)}</b>; running daśā lord <b>${esc(pr.birth.dashaLord)}</b>${pr.birth.dashaMantra ? ` <span class="muted">(${esc(pr.birth.dashaMantra)})</span>` : ''};
      birth Moon-nakṣatra <b>${esc(pr.birth.moonNakshatra)}</b> <span class="muted">(${esc(pr.birth.moonNakshatraDeity)} — ${esc(pr.birth.moonNakshatraMeaning)})</span>.</p>
    <p class="small muted">Mantras, vratas, yantras &amp; gems are recorded from the Jyotiṣa / tantra tradition as <b>cultural practice for study, not instruction</b>;
      the <b>graha→āsana map is a modern syncretism</b> (no classical Jyotiṣa basis). Astrology has no demonstrated efficacy.</p>` : '';

  // Conclusions & advice — the computed interpretive synthesis (described, not prescribed)
  const cc = v.conclusions;
  const conclusionsHtml = cc ? `
    <h3 class="small" style="margin:.9rem 0 .2rem">Conclusions &amp; advice <span class="muted small">(how the tradition reads this chart — computed, described not prescribed)</span></h3>
    ${cc.sections.map(s => `<p class="small"><b>${esc(s.title)}.</b> ${esc(s.text)}</p>`).join('')}
    <div class="callout science" style="margin:.4rem 0"><span class="label">In sum</span> ${esc(cc.conclusion)}</div>` : '';

  body.innerHTML = `
    <p class="small muted">Sidereal (Lahiri ayanāṁśa ${v.ayanamsa}°) · whole-sign houses · modelled on Jagannath Hora.
      A <b>separate system</b> from the Western/tropical chart above — shown for comparison, not as a competing forecast.</p>
    <p><b>Lagna (Ascendant):</b> ${esc(v.lagna.label)} <span class="muted">(${esc(v.lagna.sanskrit)}, lord ${esc(v.lagna.lord)})</span>,
      nakṣatra <b>${esc(v.lagna.nakshatra.name)}</b> pada ${v.lagna.nakshatra.pada}.</p>

    <div class="v-fig-chart"></div>

    <h3 class="small" style="margin:.6rem 0 .2rem">Grahas (sidereal)</h3>
    <div class="table-scroll"><table class="data"><thead><tr><th>Graha</th><th>Position</th><th>Bhāva</th><th>Nakṣatra</th><th>Dignity</th></tr></thead><tbody>${grahaRows}</tbody></table></div>
    <p class="small muted" data-asta-note hidden>☀ asta = combust (too near the Sun to be seen). The classical arcs differ between texts; the flagged distances are the working set, contested where the editions disagree.</p>

    <h3 class="small" style="margin:.7rem 0 .2rem">Compound friendship — pañcadhā maitrī <span class="muted small">(natural + temporary, BPHS 3.58–60)</span></h3>
    <div class="v-fig-relmatrix"></div>

    <h3 class="small" style="margin:.7rem 0 .2rem">Graha dṛṣṭi — aspects <span class="muted small">(BPHS Ch. 26; the graded virūpa scheme)</span></h3>
    <div class="v-fig-drishti"></div>

    <h3 class="small" style="margin:.7rem 0 .2rem">Pañcāṅga</h3>
    <p class="small">Tithi <b>${esc(v.panchanga.tithi.name)}</b> (${esc(v.panchanga.tithi.paksha)}) · Vāra <b>${esc(v.panchanga.vara.name)}</b> (${esc(v.panchanga.vara.lord)}) ·
      Nakṣatra <b>${esc(v.panchanga.nakshatra.name)}</b> · Yoga <b>${esc(v.panchanga.yoga.name)}</b> · Karaṇa <b>${esc(v.panchanga.karana.name)}</b>.</p>

    <h3 class="small" style="margin:.7rem 0 .2rem">Vimśottarī daśā</h3>
    <div class="v-fig-dasha"></div>
    <p class="small">Begins in <b>${esc(dz.startLord)}</b> with a balance of <b>${dz.balanceYears} yr</b> (Moon in ${esc(dz.nakshatra.name)}).
      Running now: <b>${esc(dz.currentMaha)}</b> mahā${dz.currentAntar ? ` / <b>${esc(dz.currentAntar)}</b> antar` : ''}.
      <br><span class="muted">Mahā sequence: ${mahaList}…</span></p>

    <h3 class="small" style="margin:.7rem 0 .2rem">Navāṁśa (D9) &amp; Sarvāṣṭakavarga</h3>
    <p class="small">D9 signs: <span class="muted">${navamsa}</span></p>
    <div class="v-fig-sav"></div>
    <p class="small">SAV by sign (Aries→Pisces): <span class="muted">${v.ashtakavarga.sav.join(' · ')}</span> = <b>${v.ashtakavarga.savTotal}</b>
      <span class="muted">(avg 28; &gt;28 strong)</span></p>

    ${yogas.length ? `<h3 class="small" style="margin:.7rem 0 .2rem">Yogas</h3><ul class="clean small">${yogas.map(y => `<li><b>${esc(y.name)}</b> — ${esc(y.detail)}</li>`).join('')}</ul>` : ''}

    <h3 class="small" style="margin:.8rem 0 .2rem">Ṣaḍbala (six-fold strength)</h3>
    <div class="v-fig-shadbala"></div>
    <div class="table-scroll"><table class="data"><thead><tr><th>Graha</th><th class="r">Rūpas</th><th class="r">Req.</th><th class="r">Strength</th><th class="r" title="Iṣṭa / Kaṣṭa phala">Iṣṭa/Kaṣṭa</th></tr></thead><tbody>${sbRows}</tbody></table></div>
    <p class="small muted">Strongest <b>${esc(sb.strongest)}</b>, weakest <b>${esc(sb.weakest)}</b> (the remedial focus). Ratio ≥ 1× = meets the BPHS minimum.</p>

    ${practiceHtml}

    ${conclusionsHtml}

    <details style="margin-top:.5rem"><summary class="small">Ṣaḍbala method &amp; sources</summary>
      <p class="small muted">${esc(sb.note)}</p>
      <p class="small muted">${v.citations.map(esc).join(' · ')}</p></details>

    <p class="small muted" style="margin-top:.4rem">Vedic astrology, like all astrology, has no demonstrated predictive validity; this is a faithful
      reconstruction of a calculation system for study, not a forecast.</p>`;

  // Figures are a progressive enhancement over the tables above (the tables stay
  // as the accessible/print text form). If the B2 viz kit is absent, the tables
  // simply remain. Never let a figure failure blank the reading.
  try { mountVedicFigures(body, v, opts); } catch { /* non-fatal — tables are the covenant's text form */ }

  // The R28 relation panels consume V1's surfaced vedic.js exports
  // (compoundRelations / grahaDrishti / combustion). They are dynamically
  // imported + guarded: if V1's surfacing refactor is not present the panels
  // simply stay empty and the tables above remain the reading's text form.
  try { mountVedicRelations(body, v, chart); } catch { /* non-fatal */ }
}

// Aries…Pisces short labels for the compact navamsa line.
const RASHI3 = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
function RASHI_SHORT(i) { return RASHI3[i] || '?'; }

// ===========================================================================
//  PURE MODEL-BUILDERS (DOM-free, deterministic, engine-testable) — transform a
//  castVedic() result `v` into the data models the B2 viz kit renders. No DOM,
//  no Date.now(): "now" is always a parameter.
// ===========================================================================
const SIGN_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// The N/S rāśi-chart model consumed by northIndianChart / southIndianChart.
// model: { lagnaSign 1..12, houses: [{ house, sign, grahas:[{id,glyph,deg,retro}] }] }
export function vedicChartModel(v) {
  const lagnaSign = (v.lagna.rashiIndex % 12) + 1;             // 1 = Aries
  const houses = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (v.lagna.rashiIndex + h - 1) % 12;         // whole-sign houses
    houses.push({ house: h, sign: signIdx + 1, grahas: [] });
  }
  for (const [id, g] of Object.entries(v.grahas)) {
    const ho = houses[g.house - 1];
    if (!ho) continue;
    ho.grahas.push({
      id, glyph: GL[id] || id.slice(0, 2), deg: Math.round(g.deg),
      retro: id !== 'Rahu' && id !== 'Ketu' && !!g.retrograde,
    });
  }
  return { lagnaSign, houses };
}

// SAV/BAV heat-table model (heatTable spec §3.7): rows = per-graha BAV; the SAV
// row (id 'sav') is the emphasis/tfoot row; cols = the 12 signs, Aries-first.
export function savHeatModel(v) {
  const av = v.ashtakavarga;
  const cols = SIGN_EN.map((label, i) => ({ id: 's' + (i + 1), label: label.slice(0, 3) }));
  const rows = Object.keys(av.bav).map(p => ({
    id: 'bav-' + p, label: p,
    cells: av.bav[p].map((n, i) => ({ v: n, el: `bav-${p}-${i + 1}` })),
  }));
  rows.push({ id: 'sav', label: 'SAV', cells: av.sav.map((n, i) => ({ v: n, el: `sav-${i + 1}` })) });
  return {
    cols, rows,
    scale: { min: 0, max: 8, steps: 4 },
    emphasis: { rowId: 'sav', threshold: 28 },
    caption: `56 bindus max per sign across 8 contributors; ${av.savTotal} total; ≥28 is above the mean — a counting convention, not a strength proof.`,
  };
}

// One anchored score-bar spec per graha (scoreBar spec §3.6). Domain from the
// engine's own required minimums; the "required" line is the named anchor.
export function shadbalaBarSpecs(v) {
  const sb = v.shadbala;
  const order = (sb.order && sb.order.length) ? sb.order : Object.keys(sb.perGraha);
  const maxReq = Math.max(...order.map(p => sb.perGraha[p].required));
  const maxVal = Math.max(...order.map(p => sb.perGraha[p].totalRupa));
  // Domain top = 1.6× the largest required minimum, but never below the largest
  // actual value (a graha can exceed 1.6× the max required — don't clip the bar).
  const top = +Math.max(maxReq * 1.6, maxVal * 1.05).toFixed(2);
  return order.map(p => {
    const s = sb.perGraha[p];
    return {
      id: 'shadbala-' + p, value: s.totalRupa, domain: [0, top],
      anchors: [{ v: s.required, label: 'required' }],
      zero: 0, tone: s.strong ? 'ok' : 'bad',
      format: x => x.toFixed(2), label: (GL[p] || '') + ' ' + p,
    };
  });
}

// The vimśottarī period-strip model (periodStrip spec §3.3): two lanes — mahā and
// the antardaśās of the running mahā. `now` is passed in (core takes no Date).
export function vimshottariStripModel(v, now) {
  const dz = v.vimshottari;
  const ms = d => new Date(d).getTime();
  const seg = (arr, prefix) => arr.map(m => ({
    start: ms(m.start), end: ms(m.end), id: `${prefix}-${m.lord}-${ms(m.start)}`,
    lord: m.lord,
    label: `${m.lord} ${new Date(m.start).getUTCFullYear()}–${new Date(m.end).getUTCFullYear()}`,
    short: GL[m.lord] || m.lord.slice(0, 2), current: !!m.current,
  }));
  const maha = seg(dz.maha, 'maha');
  const antar = seg(dz.antardashas || [], 'antar');
  const lanes = [{ id: 'maha', label: 'Mahādaśā', segments: maha }];
  if (antar.length) lanes.push({ id: 'antar', label: 'Antardaśā', segments: antar });
  const domain = maha.length ? [maha[0].start, maha[maha.length - 1].end] : [0, 1];
  return { domain, now: now == null ? null : ms(now), lanes, markers: [] };
}

// ===========================================================================
//  FIGURE MOUNTING (DOM) — renders the models above through the B2 viz kit.
//  Every import is dynamic + guarded: an absent kit degrades to the tables,
//  which stay as the accessible/print text form (never-graphics-alone rule).
// ===========================================================================
const VEDIC_STYLE_KEY = 'vedicChartStyle';

async function mountVedicFigures(body, v, opts) {
  const now = opts && opts.currentDate ? opts.currentDate : null;
  const figureMod = () => import('./viz/figure.js');

  // -- the rāśi chart + the N/S .seg style toggle (persisted to localStorage) --
  const chartHost = body.querySelector('.v-fig-chart');
  if (chartHost) {
    const [chartMod, figMod] = await Promise.all([import('../core/vedic-chart.js'), figureMod()]).catch(() => [null, null]);
    if (chartMod && figMod && chartMod.northIndianChart) {
      const model = vedicChartModel(v);
      let style = 'north';
      try { style = localStorage.getItem(VEDIC_STYLE_KEY) || 'north'; } catch { /* private mode */ }
      const seg = document.createElement('div');
      seg.className = 'seg'; seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Chart style');
      seg.innerHTML =
        `<button type="button" class="seg-btn" data-style="north" aria-pressed="${style === 'north'}">North Indian</button>` +
        `<button type="button" class="seg-btn" data-style="south" aria-pressed="${style === 'south'}">South Indian</button>`;
      const figWrap = document.createElement('div');
      chartHost.append(seg, figWrap);

      // Wire the ONE inspect grammar so the rāśi-chart bhāva cells become live
      // (tap = tip, long-press / click = pin card) — exactly the way synastry.js
      // turns on inspect (dynamic import + initInspect). The bhāva <g>s already
      // carry data-el="bhava-N" + role=button + aria-label (core/vedic-chart.js);
      // here we register a tip/card provider so the pin card reads the bhāva's
      // sign & grahas. The figWrap root is stable across N/S redraws.
      const inspectMod = await import('./viz/inspect.js').catch(() => null);
      if (inspectMod && inspectMod.registerFigure) {
        if (inspectMod.initInspect) inspectMod.initInspect();
        const signName = s => SIGN_EN[(s - 1 + 12) % 12] || '';
        const bhavaOf = el => {
          const m = ((el.getAttribute && el.getAttribute('data-el')) || '').match(/^bhava-(\d+)$/);
          return m ? (model.houses.find(h => h.house === +m[1]) || null) : null;
        };
        inspectMod.registerFigure(figWrap, {
          tip(el) {
            const h = bhavaOf(el); if (!h) return null;
            const gr = h.grahas.map(g => g.glyph).join(' ');
            return `Bhāva ${h.house} · ${signName(h.sign)}${gr ? ' · ' + gr : ''}`;
          },
          card(el) {
            const h = bhavaOf(el); if (!h) return null;
            const gr = h.grahas.length ? h.grahas.map(g => `${g.glyph} ${g.id}${g.retro ? ' ℞' : ''}`).join(', ') : '—';
            return {
              title: `Bhāva ${h.house} — ${signName(h.sign)}`,
              rows: [{ k: 'Rāśi (sign)', v: signName(h.sign) }, { k: 'Grahas', v: gr }],
              plainLine: `The ${signName(h.sign)} bhāva (house ${h.house}) of this sidereal chart, whole-sign from the lagna.`,
            };
          },
        });
      }

      const draw = st => {
        const out = st === 'south' ? chartMod.southIndianChart(model, { size: 360 }) : chartMod.northIndianChart(model, { size: 360 });
        figWrap.replaceChildren();
        figMod.mountFigure(figWrap, { svg: out.svg, textModel: out.textModel, ariaLabel: (st === 'south' ? 'South' : 'North') + ' Indian rāśi chart' });
      };
      seg.addEventListener('click', e => {
        const btn = e.target.closest('.seg-btn'); if (!btn) return;
        style = btn.dataset.style;
        try { localStorage.setItem(VEDIC_STYLE_KEY, style); } catch { /* ignore */ }
        for (const b of seg.querySelectorAll('.seg-btn')) b.setAttribute('aria-pressed', String(b.dataset.style === style));
        draw(style);
      });
      draw(style);
    }
  }

  // -- SAV/BAV heat table -----------------------------------------------------
  const savHost = body.querySelector('.v-fig-sav');
  if (savHost) {
    const [htMod, figMod] = await Promise.all([import('../core/viz/heat-table.js'), figureMod()]).catch(() => [null, null]);
    if (htMod && figMod && htMod.heatTable) {
      const out = htMod.heatTable(savHeatModel(v));
      figMod.mountFigure(savHost, { html: out.html, textModel: out.textModel, ariaLabel: 'Aṣṭakavarga heat table' });
    }
  }

  // -- ṣaḍbala anchored score bars -------------------------------------------
  const sbHost = body.querySelector('.v-fig-shadbala');
  if (sbHost) {
    const [barMod, figMod] = await Promise.all([import('../core/viz/score-bar.js'), figureMod()]).catch(() => [null, null]);
    if (barMod && figMod && barMod.scoreBar) {
      for (const spec of shadbalaBarSpecs(v)) {
        const out = barMod.scoreBar(spec);
        const row = document.createElement('div'); row.className = 'v-bar-row';
        sbHost.appendChild(row);
        figMod.mountFigure(row, { svg: out.svg, textModel: out.textModel, ariaLabel: spec.label + ' ṣaḍbala' });
      }
    }
  }

  // -- vimśottarī period strip ------------------------------------------------
  const dzHost = body.querySelector('.v-fig-dasha');
  if (dzHost) {
    const [tlMod, figMod] = await Promise.all([import('../core/viz/timeline-svg.js'), figureMod()]).catch(() => [null, null]);
    if (tlMod && figMod && tlMod.periodStrip) {
      const out = tlMod.periodStrip(vimshottariStripModel(v, now), { ariaLabel: 'Vimśottarī daśā timeline' });
      figMod.mountFigure(dzHost, { svg: out.svg, textModel: out.textModel, ariaLabel: 'Vimśottarī daśā timeline' });
    }
  }
}

// ---------------------------------------------------------------------------
//  createVedicPanel(opts) — build a collapsible, toggleable Vedic card. Returns
//  { card, update(chart) }. Tools append `card` once and call `update(chart)`
//  after each compute; the panel renders lazily when toggled on.
// ---------------------------------------------------------------------------
export function createVedicPanel(opts = {}) {
  const card = document.createElement('section');
  card.className = 'card vedic-panel';
  card.innerHTML = `<h2 style="margin-top:0;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap">
      <label style="display:flex;align-items:center;gap:.4rem;font-size:1.05rem;cursor:pointer"><input type="checkbox" class="vedic-toggle"${opts.defaultOn ? ' checked' : ''}> 🕉 Jagannath Hora — Vedic (sidereal) view</label>
      <span class="small muted">another system · toggle to view side by side</span></h2>
    <div class="vedic-body"${opts.defaultOn ? '' : ' style="display:none"'}></div>`;
  const toggle = card.querySelector('.vedic-toggle');
  const bodyEl = card.querySelector('.vedic-body');
  let lastChart = null, rendered = false;
  const doRender = () => { if (lastChart) { renderVedicPanel(bodyEl, lastChart, { currentDate: opts.currentDate || new Date() }); rendered = true; } };
  toggle.addEventListener('change', () => {
    bodyEl.style.display = toggle.checked ? '' : 'none';
    if (toggle.checked) doRender();
  });
  if (opts.defaultOn) doRender();
  return {
    card,
    update(chart) { lastChart = chart; rendered = false; if (toggle.checked) doRender(); },
  };
}

// Convenience: append a Vedic panel to a tool's <main> and return its update fn.
export function attachVedicPanel(opts = {}) {
  const panel = createVedicPanel(opts);
  const main = document.querySelector('main');
  const anchor = opts.before ? document.querySelector(opts.before) : null;
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(panel.card, anchor);
  else if (main) main.appendChild(panel.card);
  return panel.update;
}

// ===========================================================================
//  R28 relation panels — friendship matrix + graha-dṛṣṭi grid + combustion
//  flags. These consume V1's SURFACED vedic.js exports (compoundRelations,
//  grahaDrishti, combustion). Because those return shapes are not fully frozen
//  in the V1↔V2 contract, every consumer here NORMALISES defensively and the
//  whole block degrades to nothing when the exports are absent.
// ===========================================================================
const num = x => (x == null || x === '' || isNaN(Number(x))) ? null : +Number(x).toFixed(2);

// Call `fn` with each candidate argument in turn; the first call that returns a
// non-empty object wins. Covers the plausible V1 signatures — fn(vedicResult),
// fn(westernChart), fn(grahas) — without depending on which one V1 shipped.
function tryCall(fn, candidates) {
  if (typeof fn !== 'function') return null;
  for (const a of candidates) {
    if (a == null) continue;
    try { const r = fn(a); if (r && typeof r === 'object' && Object.keys(r).length) return r; } catch { /* try next */ }
  }
  return null;
}

// A relation/aspect grid may arrive as a flat {a:{b:cell}} map OR as V1's
// surfaced wrapper { grahas:[...], matrix|grid:{a:{b:cell}}, cite, note }.
// unwrapGrid returns { grahas, cells } from either shape. Pure.
function unwrapGrid(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const cells = (raw.matrix && typeof raw.matrix === 'object') ? raw.matrix
    : (raw.grid && typeof raw.grid === 'object') ? raw.grid : raw;
  let grahas = Array.isArray(raw.grahas) ? raw.grahas.slice()
    : Object.keys(cells).filter(g => cells[g] && typeof cells[g] === 'object');
  grahas = grahas.filter(g => cells[g] && typeof cells[g] === 'object');
  if (!grahas.length) return null;
  return { grahas, cells };
}

// combustion(...) → { graha: { combust, arc, cite, contested } }. Accepts V1's
// { perGraha:{p:{is,sep,arc,...}}, contested, cite }, a boolean/object map, or
// an array of per-graha records.
export function normalizeCombustion(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  const topCite = raw.cite || raw.citation || null;
  const topContested = !!raw.contested;
  const map = (raw.perGraha && typeof raw.perGraha === 'object') ? raw.perGraha : raw;
  const put = (g, val) => {
    if (g == null || val == null) return;
    if (typeof val === 'boolean') { out[g] = { combust: val, arc: null, cite: topCite, contested: topContested }; return; }
    if (typeof val === 'object' && !Array.isArray(val)) {
      const combust = !!(val.is ?? val.combust ?? val.asta ?? val.burnt ?? val.combustion);
      out[g] = {
        combust,
        arc: num(val.arc ?? val.deg ?? val.orb ?? val.distance ?? val.sep),
        cite: val.cite || val.source || val.citation || topCite,
        contested: (val.contested != null ? !!val.contested : topContested),
      };
    }
  };
  if (Array.isArray(map)) { for (const e of map) if (e && e.graha) put(e.graha, e); }
  else for (const [g, val] of Object.entries(map)) put(g, val);
  return out;
}

// compoundRelations(...) → a heatTable model over the shared grahas. The cell
// value is the pañcadhā-maitrī virūpa (V1's `tierVirupa`); the diagonal is
// left blank ('·').
export function relationHeatModel(raw) {
  const g = unwrapGrid(raw);
  if (!g) return null;
  const { grahas, cells } = g;
  const virupaOf = cell => {
    if (cell == null) return null;
    if (typeof cell === 'number') return cell;
    if (typeof cell === 'object') return num(cell.tierVirupa ?? cell.virupa ?? cell.value ?? cell.v ?? cell.score);
    return null;
  };
  const cols = grahas.map(x => ({ id: 'rel-' + x, label: GL[x] || x.slice(0, 3) }));
  const rows = grahas.map(a => ({
    id: 'rel-' + a, label: (GL[a] || '') + ' ' + a,
    cells: grahas.map(b => {
      if (a === b) return { v: '·', el: `rel-${a}-${b}` };
      const val = virupaOf(cells[a] && cells[a][b]);
      return { v: val == null ? '·' : val, el: `rel-${a}-${b}` };
    }),
  }));
  return {
    cols, rows, scale: { min: 0, max: 22.5, steps: 4 },
    caption: 'Pañcadhā-maitrī (compound friendship) in virūpas — higher is friendlier (great-friend 22.5 … great-enemy 1.875); a graha with itself is left blank. BPHS 3.55–60. A classical relation model, describing nothing about anyone.',
  };
}

// grahaDrishti(...) → { grahas, matrix:{a:{b:{virupa,full}|null}} }. Reads V1's
// `sphuta` virūpa + `full` flag; falls back to a plain number cell. Pure.
export function drishtiModel(raw) {
  const g = unwrapGrid(raw);
  if (!g) return null;
  const { grahas, cells } = g;
  const matrix = {};
  for (const a of grahas) {
    matrix[a] = {};
    for (const b of grahas) {
      if (a === b) { matrix[a][b] = null; continue; }
      const cell = cells[a] && cells[a][b];
      let virupa = null, full = false;
      if (typeof cell === 'number') { virupa = cell; full = cell >= 60; }
      else if (cell && typeof cell === 'object') {
        virupa = num(cell.sphuta ?? cell.virupa ?? cell.value ?? cell.v ?? cell.score);
        full = !!(cell.full ?? cell.special ?? (virupa != null && virupa >= 60));
      }
      matrix[a][b] = virupa == null ? null : { virupa, full };
    }
  }
  return { grahas, matrix };
}

function drishtiGridHtml(raw) {
  const m = drishtiModel(raw);
  if (!m) return '';
  const head = `<tr><th class="l" scope="col">from ↓ / to →</th>${m.grahas.map(b => `<th scope="col">${GL[b] || esc(b.slice(0, 2))}</th>`).join('')}</tr>`;
  const rows = m.grahas.map(a => `<tr><th class="l" scope="row">${GL[a] || ''} ${esc(a.slice(0, 3))}</th>${m.grahas.map(b => {
    if (a === b) return '<td class="vt-self">·</td>';
    const c = m.matrix[a][b];
    if (!c) return '<td class="muted">·</td>';
    return `<td class="${c.full ? 'is-full' : ''}" title="${esc(a)} aspects ${esc(b)} — ${c.virupa} virūpa${c.full ? ' (full/special aspect)' : ''}">${c.virupa}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="table-scroll"><table class="data vt-drishti"><thead>${head}</thead><tbody>${rows}</tbody></table></div>
    <p class="small muted">Graha-dṛṣṭi in virūpas (BPHS Ch. 26 graded scheme): every graha casts the 7th-house full aspect (60 virūpas); Mars additionally aspects the 4th/8th, Jupiter the 5th/9th, Saturn the 3rd/10th — a full/special aspect is boxed. The whole-sign (popular) vs graded (sphuṭa) presentation is itself contested; this shows the graded virūpas.</p>`;
}

async function mountVedicRelations(body, v, chart) {
  const vmod = await import('../core/vedic.js').catch(() => null);
  if (!vmod) return;
  const cands = [v, chart, v && v.grahas];

  // -- combustion (asta) flags on the graha table ----------------------------
  try {
    const comb = normalizeCombustion(tryCall(vmod.combustion, cands));
    let any = false;
    for (const [p, info] of Object.entries(comb)) {
      if (info && info.combust) {
        any = true;
        const span = body.querySelector(`.vt-asta[data-asta="${p}"]`);
        if (span) {
          span.hidden = false;
          span.textContent = '☀ asta' + (info.arc != null ? ` (${info.arc}°)` : '');
          if (info.cite) span.title = info.cite + (info.contested ? ' — arc contested' : '');
        }
      }
    }
    if (any) { const note = body.querySelector('[data-asta-note]'); if (note) note.hidden = false; }
  } catch { /* non-fatal */ }

  // -- friendship matrix via the shared heatTable ----------------------------
  const relHost = body.querySelector('.v-fig-relmatrix');
  if (relHost) {
    try {
      const model = relationHeatModel(tryCall(vmod.compoundRelations, cands));
      if (model) {
        const htMod = await import('../core/viz/heat-table.js').catch(() => null);
        if (htMod && htMod.heatTable) relHost.innerHTML = `<div class="vt-relmatrix">${htMod.heatTable(model).html}</div>`;
      }
    } catch { /* non-fatal */ }
  }

  // -- graha-dṛṣṭi grid ------------------------------------------------------
  const drHost = body.querySelector('.v-fig-drishti');
  if (drHost) {
    try {
      const html = drishtiGridHtml(tryCall(vmod.grahaDrishti, cands));
      if (html) drHost.innerHTML = html;
    } catch { /* non-fatal */ }
  }
}
