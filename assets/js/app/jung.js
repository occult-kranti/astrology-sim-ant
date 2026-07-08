// ============================================================================
//  jung.js (app) — drives the Jung & astrology study pages:
//   • renderJungTimeline()  — pages/jung/timeline.html, rendered from the cited
//     JUNG_TIMELINE data module (one source of truth for the dates).
//   • initJungExperiment()  — pages/jung/experiment.html: the 1952 marriage
//     experiment's real figures, plus an HONEST re-run — Monte-Carlo batches of
//     chance pairings (the null model) drawn with crypto randomness, plotted as
//     a histogram against the percentages Jung reported. Chance alone produces
//     his "significant" rates; Jung himself conceded as much.
//  The RANDOMNESS lives here (the app); the engine stays pure.
// ============================================================================
import { JUNG_TIMELINE, JUNG_EXPERIMENT } from '../core/data/jung-astrology.js';
import { experimentBatchFull, expectedRate } from '../core/jung.js';
import { autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KIND_LABEL = { life: 'Life', work: 'Work', letter: 'Letter', experiment: 'Experiment', legacy: 'Legacy' };

// --- the timeline -------------------------------------------------------------
export function renderJungTimeline() {
  const host = $('jung-timeline'); if (!host) return;
  host.innerHTML = JUNG_TIMELINE.map(e => `<div class="jung-tl-row jung-tl-${esc(e.kind)}">
    <div class="jung-tl-year"><b>${esc(e.year)}</b><br><span class="small muted">${esc(KIND_LABEL[e.kind] || e.kind)}</span></div>
    <div class="jung-tl-body"><b>${esc(e.title)}</b>
      <p class="small" style="margin:.25rem 0 .15rem">${esc(e.text)}</p>
      <p class="small muted" style="margin:0">— ${esc(e.cite)}</p></div>
  </div>`).join('');
  try { autolinkResultPanels(['jung-timeline']); } catch { /* non-fatal */ }
}

// --- the experiment page --------------------------------------------------------
function rand01() {
  try { const a = new Uint32Array(1); (self.crypto || window.crypto).getRandomValues(a); return a[0] / 0x100000000; }
  catch { return Math.random(); }
}

export function initJungExperiment() {
  renderFigures();
  const btn = $('jx-run'); if (btn) btn.addEventListener('click', () => runSimulation());
  runSimulation();
}

function renderFigures() {
  const host = $('jx-figures'); if (!host) return;
  const X = JUNG_EXPERIMENT;
  host.innerHTML = `
    <table class="data"><thead><tr><th class="l">Batch</th><th class="l">Married pairs</th><th class="l">Top-scoring aspect</th><th class="l">Frequency</th></tr></thead>
    <tbody>${X.batches.map(b => `<tr><td class="l">${b.n}</td><td class="l">${b.pairs}</td><td class="l"><b>${esc(b.topAspect)}</b></td><td class="l">${b.pct}%</td></tr>`).join('')}
    <tr><td class="l"><b>Total</b></td><td class="l"><b>${X.totalPairs}</b> (${X.totalHoroscopes} horoscopes)</td><td class="l" colspan="2">${esc(X.aspectsExamined)}</td></tr></tbody></table>
    <p class="small"><b>Method.</b> ${esc(X.method)}</p>
    <p class="small"><b>The statistics.</b> ${esc(X.initialOdds)} ${esc(X.fierz)}</p>
    <p class="small"><b>Pauli.</b> ${esc(X.pauli)}</p>
    <p class="small"><b>Jung's own conclusion.</b> ${esc(X.conclusion)}</p>
    <p class="small muted">— ${esc(X.cite)}</p>`;
  try { autolinkResultPanels(['jx-figures']); } catch { /* non-fatal */ }
}

// Monte-Carlo: R batches of chance pairings, tallying the SAME FIFTY
// cross-aspects Jung did (conj/opp of 5 points × 5 points, direction
// distinguished — CW 8 §878) and taking each batch's BEST-scoring aspect —
// the very statistic his ~10% maxima report.
function runSimulation() {
  const host = $('jx-sim'); if (!host) return;
  const pairs = 180;                     // Jung's first batch size
  const R = 200;
  const orb = JUNG_EXPERIMENT.orb;
  const maxima = [];
  for (let i = 0; i < R; i++) maxima.push(experimentBatchFull(rand01, { pairs, orb }).maxRate * 100);
  maxima.sort((a, b) => a - b);
  const jungMax = Math.max(...JUNG_EXPERIMENT.batches.map(b => b.pct));
  const atOrAbove = maxima.filter(m => m >= jungMax).length;
  const pct = Math.round((atOrAbove / R) * 100);
  const median = maxima[Math.floor(R / 2)];

  // histogram, 14 bins
  const lo = Math.min(maxima[0], expectedRate(orb) * 100 - 0.5), hi = Math.max(maxima[maxima.length - 1], jungMax + 1);
  const BINS = 14, w = (hi - lo) / BINS, bins = new Array(BINS).fill(0);
  for (const m of maxima) bins[Math.min(BINS - 1, Math.floor((m - lo) / w))]++;
  const peak = Math.max(...bins);
  const W = 560, H = 180, PAD = 28;
  const bars = bins.map((n, i) => {
    const x = PAD + (i / BINS) * (W - 2 * PAD), bw = (W - 2 * PAD) / BINS - 2;
    const h = (n / peak) * (H - 2 * PAD);
    return `<rect x="${x.toFixed(1)}" y="${(H - PAD - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="var(--air)" opacity="0.75"/>`;
  }).join('');
  const jungX = PAD + ((jungMax - lo) / (hi - lo)) * (W - 2 * PAD);
  const perAspect = expectedRate(orb) * 100;                     // ~4.4% per single directional aspect
  const expX = PAD + ((perAspect - lo) / (hi - lo)) * (W - 2 * PAD);

  host.innerHTML = `
    <p class="small">200 simulated batches of <b>${pairs} chance pairings</b> each (independent uniform longitudes — what
      chance marriage-pairing gives), tallying <b>all fifty</b> of Jung's cross-aspects at his ${orb}° orb and taking each
      batch's <b>best-scoring aspect</b> — exactly the statistic his "significant" ~10% maxima report:</p>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histogram of best-of-fifty aspect rates in simulated chance batches" style="width:100%;max-width:${W}px">
      ${bars}
      <line x1="${expX.toFixed(1)}" y1="${PAD / 2}" x2="${expX.toFixed(1)}" y2="${H - PAD}" stroke="var(--earth)" stroke-dasharray="4 3"/>
      <text x="${expX.toFixed(1)}" y="${PAD / 2 - 2}" font-size="11" text-anchor="middle" fill="var(--earth)">one aspect's chance rate ${perAspect.toFixed(1)}%</text>
      <line x1="${jungX.toFixed(1)}" y1="${PAD / 2}" x2="${jungX.toFixed(1)}" y2="${H - PAD}" stroke="var(--fire)" stroke-width="2"/>
      <text x="${jungX.toFixed(1)}" y="${H - PAD + 14}" font-size="11" text-anchor="middle" fill="var(--fire)">Jung's best batch ${jungMax}%</text>
      <line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" stroke="var(--rule)"/>
      <text x="${PAD}" y="${H - PAD + 14}" font-size="11" fill="var(--muted)">${lo.toFixed(0)}%</text>
      <text x="${W - PAD}" y="${H - PAD + 14}" font-size="11" text-anchor="end" fill="var(--muted)">${hi.toFixed(0)}%</text>
    </svg>
    <p class="small"><b>Result:</b> the median chance batch's best aspect scored <b>${median.toFixed(1)}%</b>, and
      <b>${pct}%</b> of pure-chance batches reached a best of <b>${jungMax}% or more</b> — Jung's strongest observation.
      Any single, pre-named directional aspect lands within ±${orb}° in only ≈ ${perAspect.toFixed(1)}% of chance pairings
      (that is why 18-of-180 looked so striking) — but nobody pre-named it: the maxima were <b>selected after the fact
      from fifty candidates</b>, and the best of fifty runs near 10% by luck alone. That selection effect is what Fierz's
      corrections quantified, and what Jung conceded in print (§§881, 901, 906).</p>
    <p class="small muted">Re-run for a fresh 200 batches — the histogram barely moves. That stability IS the null hypothesis.</p>`;
}
