// ============================================================================
//  core/viz/scale.js — linear & time scales + nice ticks for the dataviz kit.
//  Pure, deterministic, UTC-based (the site's engines work in UTC). Imports the
//  single vendored file (d3-ticks, ISC) — the one import site. [dataviz §3.2]
// ============================================================================
import ticks, { tickStep } from '../../../vendor/d3-ticks/ticks.js';

// linScale([d0,d1],[r0,r1]) → f(v) with f.invert(px). Guards a zero-width domain.
export function linScale([d0, d1], [r0, r1]) {
  const span = (d1 - d0) || 1;
  const k = (r1 - r0) / span;
  const f = v => r0 + (v - d0) * k;
  f.invert = p => d0 + (p - r0) / k;
  f.domain = [d0, d1];
  f.range = [r0, r1];
  return f;
}

// niceTicks — thin wrapper over the vendored tick math (float-safe bounds).
export function niceTicks(d0, d1, count = 6) { return ticks(d0, d1, count); }
export { tickStep };

const DAY = 86400000, WEEK = 7 * DAY, MONTH = 30.436875 * DAY, YEAR = 365.2425 * DAY;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// timeTicks([t0,t1], widthPx) → [{t, label, major}]. Picks the unit ladder by
// span/width so majors are ≥ ~72 px apart; labels are plain en-dash-free forms
// ('1994', 'Mar 2027', '12 Aug'). Deterministic; no Date.now().
export function timeTicks([t0, t1], widthPx = 960) {
  const span = Math.max(1, t1 - t0);
  const targetMajors = Math.max(2, Math.floor(widthPx / 84));
  const approx = span / targetMajors;
  // choose the smallest unit whose step ≥ approx
  let unit, stepMs, fmt;
  if (approx >= YEAR) {
    // year steps via nice tick math on the year axis
    const y0 = new Date(t0).getUTCFullYear(), y1 = new Date(t1).getUTCFullYear();
    const yrTicks = ticks(y0, y1, targetMajors);
    const stepYr = yrTicks.length > 1 ? Math.round(yrTicks[1] - yrTicks[0]) : 1;
    const out = [];
    for (let y = Math.ceil(y0 / stepYr) * stepYr; y <= y1; y += stepYr) {
      const t = Date.UTC(y, 0, 1);
      if (t >= t0 && t <= t1) out.push({ t, label: String(y), major: true });
    }
    return out;
  } else if (approx >= MONTH * 2.5) { unit = 'quarter'; }
  else if (approx >= WEEK * 2.2) { unit = 'month'; }
  else if (approx >= DAY * 2.2) { unit = 'week'; }
  else { unit = 'day'; }

  const out = [];
  const start = new Date(t0);
  if (unit === 'quarter') {
    let y = start.getUTCFullYear(), q = Math.floor(start.getUTCMonth() / 3);
    for (let t = Date.UTC(y, q * 3, 1); t <= t1; ) {
      if (t >= t0) out.push({ t, label: `${MON[new Date(t).getUTCMonth()]} ${new Date(t).getUTCFullYear()}`, major: true });
      q++; if (q > 3) { q = 0; y++; } t = Date.UTC(y, q * 3, 1);
    }
  } else if (unit === 'month') {
    let y = start.getUTCFullYear(), m = start.getUTCMonth();
    for (let t = Date.UTC(y, m, 1); t <= t1; ) {
      if (t >= t0) { const d = new Date(t); out.push({ t, label: `${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`, major: true }); }
      m++; if (m > 11) { m = 0; y++; } t = Date.UTC(y, m, 1);
    }
  } else if (unit === 'week') {
    const first = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    for (let t = first; t <= t1; t += WEEK) {
      if (t >= t0) { const d = new Date(t); out.push({ t, label: `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`, major: true }); }
    }
  } else {
    const first = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    const stepDays = approx >= DAY ? Math.max(1, Math.round(approx / DAY)) : 1;
    for (let t = first; t <= t1; t += stepDays * DAY) {
      if (t >= t0) { const d = new Date(t); out.push({ t, label: `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`, major: true }); }
    }
  }
  return out;
}
