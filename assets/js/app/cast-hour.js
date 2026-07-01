// ============================================================================
//  cast-hour.js — "the hour of the cast": a small strip for the ORACLE pages
//  (geomancy, tarot, I Ching) showing the astrological timing lore the tradition
//  applied to divination — the planetary day & hour (geomancers cast in the hour
//  of the matter's planet), and the Moon's condition (Lilly's considerations
//  warn against judging when the Moon is void of course or in the Via Combusta).
//
//  It reuses the SAME engine as everything else (castChart, planetaryHour,
//  moonPhase, isViaCombusta, mansionOf) — nothing re-derived. Time is "now";
//  place defaults to London (the hours depend on place; the note says so).
//
//  HONEST FRAMING: shown as the tradition's practice, for study. The timing has
//  no demonstrated effect on anything — least of all on a random cast.
// ============================================================================
import { castChart, signOf, PLANET_GLYPHS } from '../core/astro.js';
import { planetaryHour } from '../core/planetary-hours.js';
import { moonPhase, isViaCombusta } from '../core/election.js';
import { mansionOf } from '../core/data/lunar-mansions.js';
import { aspectBetween } from '../core/aspects.js';

const PLANETS7 = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The Moon's next applying Ptolemaic aspect (void of course if none) — the same
// weighing horary-judge.js uses.
function moonIsVoid(chart) {
  const moon = chart.planets.Moon;
  for (const name of PLANETS7) {
    const a = aspectBetween('Moon', moon, name, chart.planets[name]);
    if (a && a.applying) return false;
  }
  return true;
}

// Render the strip into #id. Non-fatal: any failure leaves the div empty.
export function renderCastHour(id, opts = {}) {
  const host = document.getElementById(id);
  if (!host) return;
  try {
    const lat = opts.lat ?? 51.5074, lon = opts.lon ?? -0.1278;   // London default
    const now = new Date();
    const chart = castChart(now, lat, lon, 'regiomontanus');
    const ph = planetaryHour(now, lat, lon);
    const moon = chart.planets.Moon;
    const sign = signOf(moon.lon).name;
    const phase = moonPhase(chart);
    const mans = mansionOf(moon.lon);
    const vc = isViaCombusta(moon.lon, now);
    const voidNow = moonIsVoid(chart);
    const G = p => PLANET_GLYPHS[p] || '';
    const flags = [];
    if (voidNow) flags.push('the Moon is <b>void of course</b> — Lilly counsels not to judge');
    if (vc && vc.active) flags.push('the Moon is in the <b>Via Combusta</b> — a classical caution');
    host.innerHTML = `<div class="callout" style="margin:.8rem 0"><span class="label">The hour of the cast — the tradition's timing</span>
      It is the hour of ${G(ph.ruler)} <b>${esc(ph.ruler)}</b> on a ${G(ph.dayRuler)} ${esc(ph.dayRuler)}-day;
      the Moon is ${esc(phase.label || (phase.waxing ? 'waxing' : 'waning'))} in <b>${esc(sign)}</b>,
      mansion ${mans.num} (${esc(mans.name)})${flags.length ? ' — ' + flags.join('; ') : ''}.
      <span class="small muted">The geomancers cast in the hour of the matter's planet, and Lilly's considerations warn
      against judging under a void or afflicted Moon — recorded as the tradition's practice (for London; the hours vary
      by place). It has no demonstrated effect, least of all on a random cast — see the
      <a href="now.html">live dashboard</a> and the <a href="book1/planetary-hours.html">planetary hours</a>.</span></div>`;
  } catch (e) { host.innerHTML = ''; /* non-fatal — the oracle still works */ }
}
