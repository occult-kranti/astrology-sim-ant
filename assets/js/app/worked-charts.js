// ============================================================================
//  worked-charts.js — renders Lilly's OWN horary charts "live". Each figure is
//  fed from its PRINTED positions (data/worked-charts.js) into the same engine
//  the calculators use: it draws the wheel, scores every dignity, and runs the
//  house-by-house judgement (horary-judge.js) — shown BESIDE Lilly's own words
//  and the recorded outcome, so you can watch the method work on the cases that
//  made Christian Astrology famous.
// ============================================================================
import { chartFromPositions } from '../core/chart-from-positions.js';
import { horaryJudgement } from '../core/horary-judge.js';
import { essentialDignity, accidentalDignity } from '../core/dignities.js';
import { allAspects } from '../core/aspects.js';
import { renderChart } from '../core/chart.js';
import { formatLon, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { WORKED_CHARTS } from '../core/data/worked-charts.js';
import { autolinkResultPanels } from './shared.js';

const PLANETS7 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const G = p => PLANET_GLYPHS[p] || '';
const sgn = n => (n >= 0 ? '+' : '') + n;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toneBadge = t => `<span class="verdict ${t === 'affirmed' ? 'green' : t === 'denied' ? 'red' : 'amber'}">${t}</span>`;

export function initWorkedCharts() {
  const host = document.getElementById('wc-list');
  if (!host) return;
  const ids = [];
  WORKED_CHARTS.forEach((wc, i) => {
    const sec = document.createElement('section');
    sec.className = 'card';
    sec.style.margin = '1.4rem 0';
    sec.id = `wc-${wc.key}`;
    try { sec.innerHTML = renderOne(wc, i); } catch (e) { sec.innerHTML = `<p class="small muted">Could not render this chart: ${esc(e.message)}</p>`; }
    host.appendChild(sec);
    ids.push(sec.id);
    // draw the wheel into its placeholder, if this chart has a full figure
    if (wc.figure) {
      try {
        const chart = chartFromPositions(buildSpec(wc));
        const bodies = {}; for (const p of PLANETS7) if (chart.planets[p]) bodies[p] = chart.planets[p];
        const wheelHost = sec.querySelector(`#wc-wheel-${wc.key}`);
        if (wheelHost) renderChart(wheelHost, chart, allAspects(bodies), { size: 460 });
      } catch (e) { /* non-fatal — the narrative still stands */ }
    }
  });
  // link glossary jargon in the rendered prose
  try { autolinkResultPanels(ids); } catch { /* non-fatal */ }
}

function buildSpec(wc) {
  return {
    asc: wc.figure.asc, mc: wc.figure.mc,
    planets: wc.figure.planets,
    system: 'regiomontanus (printed)',
  };
}

function renderOne(wc, i) {
  let figureBlock = '';
  if (wc.figure) {
    const chart = chartFromPositions(buildSpec(wc));
    const j = horaryJudgement(chart, wc.quesitedHouse, { querentHouse: wc.querentHouse || 1, sense: wc.judgeSense });
    figureBlock = `
      <div class="chart-layout" style="margin:.6rem 0">
        <div>
          <div id="wc-wheel-${esc(wc.key)}" class="card" style="padding:.5rem"></div>
          <p class="small muted center" style="margin-top:.4rem">The figure as Lilly printed it${chart.cuspApprox ? ' — wheel drawn with equal houses from the printed Ascendant; each planet keeps Lilly’s own house' : ''}.</p>
        </div>
        <div>
          <h3 style="margin-top:0">The engine reads the same figure ${toneBadge(j.tone)}</h3>
          <p class="small">${esc(j.toneText)}</p>
          <ul class="clean small">${j.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
          ${j.naturalSignificators.length ? `<p class="small muted">Natural significator${j.naturalSignificators.length > 1 ? 's' : ''}: ${j.naturalSignificators.map(n => `${G(n.planet)} ${esc(n.planet)} (${esc(n.label)}, ess. ${sgn(n.essential)})`).join('; ')}.</p>` : ''}
        </div>
      </div>
      ${dignityTable(chart)}
      <div class="callout"><span class="label">Lilly vs the engine</span>
        Lilly's judgement (below) and the engine's reading (above) are read from the <em>same printed figure</em>.
        Where they agree, you can see the rule working; where the tone differs, it is usually because Lilly
        weighs a testimony (reception, a fixed star, a description) that a crude tally cannot — that is the art.
        ${chart.cuspApprox ? 'Applying/separating here uses canonical mean motions, so a borderline call may differ from Lilly’s exact figure.' : ''}</div>`;
  }

  return `
    <span class="tag">${esc(wc.tag)}</span>
    <h2 style="border:0;margin:.3rem 0 .2rem">${esc(wc.title)}</h2>
    <p class="small muted" style="margin:.1rem 0 .6rem">${esc(wc.dateNote)}${wc.place ? ' · ' + esc(wc.place) : ''} · teaches <b>${esc(wc.technique)}</b></p>
    <p><b>The question.</b> ${esc(wc.question)}</p>
    ${wc.significators ? `<p><b>The significators.</b> ${esc(wc.significators)}</p>` : ''}
    ${figureBlock}
    <p><b>Lilly's reasoning.</b> ${esc(wc.reasoning)}</p>
    <p><b>Judgement.</b> ${esc(wc.verdict)}</p>
    <p><b>Outcome.</b> <span class="pos">${esc(wc.outcome)}</span></p>
    <details class="small" style="margin-top:.5rem"><summary>Sources &amp; reconstruction notes</summary>
      <p class="muted" style="margin:.3rem 0 0">${esc(wc.sources)}</p>
      ${wc.caveats ? `<p class="muted">${esc(wc.caveats)}</p>` : ''}</details>`;
}

function dignityTable(chart) {
  let rows = '';
  for (const name of PLANETS7) {
    const p = chart.planets[name]; if (!p) continue;
    const ed = essentialDignity(name, p.lon, chart.isDay);
    const ad = accidentalDignity(name, chart);
    const kinds = ed.rows.map(r => `<span class="${r.score >= 0 ? 'pos' : 'neg'}">${r.kind}</span>`).join(', ');
    rows += `<tr><td>${G(name)} ${name}</td><td class="l">${formatLon(p.lon)}${p.retrograde ? ' ℞' : ''}</td><td>${p.house}</td>
      <td class="l small">${kinds}</td>
      <td class="${ed.total >= 0 ? 'pos' : 'neg'}">${sgn(ed.total)}</td>
      <td class="${ad.total >= 0 ? 'pos' : 'neg'}">${sgn(ad.total)}</td></tr>`;
  }
  return `<table class="data"><caption class="small muted">Dignity ledger of the printed figure</caption>
    <thead><tr><th scope="col" class="l">Planet</th><th scope="col" class="l">Position</th><th scope="col">Ho.</th>
      <th scope="col" class="l">Essential dignities</th><th scope="col">Ess.</th><th scope="col">Acc.</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}
