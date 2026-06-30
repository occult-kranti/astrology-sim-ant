// ============================================================================
//  experiment.js — the FALSIFICATION DEMO. The honest-science centre-piece: it
//  takes the same aim and place, permutes the MOMENT across a window, and shows
//  (1) how the "fitness" score is distributed over random moments — the null
//  distribution; (2) where the chosen moment falls in it (its percentile);
//  (3) how sensitive the verdict is to a few minutes' change. The lesson: the
//  green/amber/red label is a deterministic function of the clock that scatters
//  freely — common or rare by the RULE, not a signal about events in the world.
//
//  It computes nothing new — it just runs the SAME cited scorer (election.js)
//  over many sampled times. Astrology has no demonstrated predictive validity;
//  this makes that visible, in-tool.
// ============================================================================
import { castChart } from '../core/astro.js';
import { electionScore, OPERATIONS } from '../core/election.js';
import { wireCitySelect, toUTC, nowLocalFields } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const VCOLOR = { green: '#2f7d4f', amber: '#c79a2b', red: '#b23b2e' };
const WINDOWS = { day: { label: 'this day (±12 h)', ms: 12 * 3600e3 }, week: { label: 'this week (±3.5 days)', ms: 3.5 * 86400e3 }, year: { label: 'this year (±182 days)', ms: 182 * 86400e3 } };

export function initExperiment() {
  $('x-op').innerHTML = OPERATIONS.map(o => `<option value="${esc(o.key)}">${esc(o.label)}</option>`).join('');
  const n = nowLocalFields();
  $('x-date').value = n.date; $('x-time').value = n.time; $('x-offset').value = 0;
  $('x-lat').value = 51.5074; $('x-lon').value = -0.1278;
  wireCitySelect($('x-city'), $('x-lat'), $('x-lon'), $('x-offset'));
  $('x-now').addEventListener('click', () => { const f = nowLocalFields(); $('x-date').value = f.date; $('x-time').value = f.time; $('x-offset').value = f.offset; });
  $('x-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  run();
}

function scoreAt(when, lat, lon, system, op) {
  try { const e = electionScore(castChart(when, lat, lon, system), op); return { score: e.score, verdict: e.verdict }; }
  catch { return { score: 0, verdict: 'amber' }; }
}

function run() {
  const op = $('x-op').value;
  const lat = parseFloat($('x-lat').value), lon = parseFloat($('x-lon').value);
  const offset = parseFloat($('x-offset').value) || 0;
  const system = 'regiomontanus';
  const N = Math.max(50, Math.min(1000, parseInt($('x-n').value, 10) || 300));
  const win = WINDOWS[$('x-window').value] || WINDOWS.day;
  if (isNaN(lat) || isNaN(lon)) { $('x-out').innerHTML = '<p class="muted">Enter a valid place.</p>'; return; }
  const centre = toUTC($('x-date').value, $('x-time').value, offset);
  $('x-out').innerHTML = '<p class="small muted">Sampling…</p>';

  setTimeout(() => {
    // the chosen moment
    const chosen = scoreAt(centre, lat, lon, system, op);
    // N random moments uniformly across the window centred on the chosen moment
    const scores = [], vcount = { green: 0, amber: 0, red: 0 };
    for (let i = 0; i < N; i++) {
      const dt = (Math.random() * 2 - 1) * win.ms;
      const r = scoreAt(new Date(centre.getTime() + dt), lat, lon, system, op);
      scores.push(r.score); vcount[r.verdict] = (vcount[r.verdict] || 0) + 1;
    }
    scores.sort((a, b) => a - b);
    const below = scores.filter(s => s < chosen.score).length;
    const pct = Math.round((below / N) * 100);
    const mean = scores.reduce((a, b) => a + b, 0) / N;

    // sensitivity: the chosen moment vs +7 min, +1 h
    const s7 = scoreAt(new Date(centre.getTime() + 7 * 60e3), lat, lon, system, op);
    const s1h = scoreAt(new Date(centre.getTime() + 3600e3), lat, lon, system, op);
    const flips = (chosen.verdict !== s7.verdict) || (chosen.verdict !== s1h.verdict);

    const opLabel = (OPERATIONS.find(o => o.key === op) || {}).label || op;
    $('x-out').innerHTML =
      `<p style="font-size:1.05rem">Your moment scores <b>${chosen.score}</b>
         (<span class="verdict ${chosen.verdict}">${chosen.verdict}</span>) — higher than <b>${pct}%</b>
         of ${N} random moments ${esc(win.label)} at this place${pct >= 40 && pct <= 60 ? ' — i.e. close to an ordinary, middling moment.' : pct > 60 ? ' — a relatively favourable one, by the rule.' : ' — a relatively unfavourable one, by the rule.'}</p>
       ${histogramSVG(scores, chosen.score, mean)}
       <p class="small"><b>Verdicts over the window:</b>
         <span style="color:${VCOLOR.green}">■</span> fit ${vcount.green} ·
         <span style="color:${VCOLOR.amber}">■</span> mixed ${vcount.amber} ·
         <span style="color:${VCOLOR.red}">■</span> unfit ${vcount.red} (of ${N}).</p>
       <div class="callout science"><span class="label">What this shows</span>
         <p class="small" style="margin:.2rem 0">For <b>${esc(opLabel)}</b>, the same place a few minutes apart can change the verdict:
           now <span class="verdict ${chosen.verdict}">${chosen.verdict}</span>, +7 min <span class="verdict ${s7.verdict}">${s7.verdict}</span>,
           +1 h <span class="verdict ${s1h.verdict}">${s1h.verdict}</span>${flips ? ' — it flips.' : ' — stable here, but try another aim or window.'}</p>
         <p class="small" style="margin:.2rem 0">The score is a <b>deterministic function of the clock</b> that scatters across the window above.
           A “favourable” moment is favourable <em>by the rule’s arithmetic</em> — its frequency is set by how strict the rule is, not by any
           measured effect on events. No controlled study has found electional timing to influence outcomes. This tool lets you see the rule’s
           behaviour for yourself; it is a demonstration of the method, not evidence for it.</p></div>`;
  }, 30);
}

// A small inline-SVG histogram of the score distribution, with the chosen
// moment marked. Pure string building; no dependencies.
function histogramSVG(sorted, chosenScore, mean) {
  const W = 560, H = 150, pad = 28;
  const lo = sorted[0], hi = sorted[sorted.length - 1];
  const span = Math.max(1, hi - lo);
  const BINS = 16;
  const bins = new Array(BINS).fill(0);
  for (const s of sorted) { const b = Math.min(BINS - 1, Math.floor(((s - lo) / span) * BINS)); bins[b]++; }
  const maxB = Math.max(...bins, 1);
  const bw = (W - 2 * pad) / BINS;
  const x = v => pad + ((v - lo) / span) * (W - 2 * pad);
  const bars = bins.map((c, i) => {
    const h = (c / maxB) * (H - 2 * pad);
    return `<rect x="${(pad + i * bw).toFixed(1)}" y="${(H - pad - h).toFixed(1)}" width="${(bw - 1).toFixed(1)}" height="${h.toFixed(1)}" fill="#7a3b1e" opacity="0.7"/>`;
  }).join('');
  const chosenX = x(chosenScore), meanX = x(mean);
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto" role="img" aria-label="Histogram of fitness scores over random moments">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#fffdf8" stroke="#d8cbac"/>
    ${bars}
    <line x1="${meanX.toFixed(1)}" y1="${pad}" x2="${meanX.toFixed(1)}" y2="${H - pad}" stroke="#6b6354" stroke-dasharray="3 3"/>
    <line x1="${chosenX.toFixed(1)}" y1="${pad - 6}" x2="${chosenX.toFixed(1)}" y2="${H - pad}" stroke="#b23b2e" stroke-width="2"/>
    <text x="${chosenX.toFixed(1)}" y="${pad - 8}" font-size="10" text-anchor="middle" fill="#b23b2e">your moment</text>
    <text x="${pad}" y="${H - 8}" font-size="10" fill="#6b6354">score ${lo}</text>
    <text x="${W - pad}" y="${H - 8}" font-size="10" text-anchor="end" fill="#6b6354">${hi}</text>
    <text x="${meanX.toFixed(1)}" y="${H - 8}" font-size="10" text-anchor="middle" fill="#6b6354">mean ${mean.toFixed(0)}</text>
  </svg>`;
}
