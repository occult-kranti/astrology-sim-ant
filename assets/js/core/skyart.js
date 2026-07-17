// ============================================================================
//  skyart.js — CELESTIAL INSTRUMENTS (The Illuminated Observatory, DS3 art §7).
//  Pure, deterministic, DOM-free SVG string-builders (the core/chart.js emit-
//  strings precedent). Three instruments — the engraved Moon, the planetary-hour
//  dial, and a seeded starfield — plus the mulberry32 PRNG they share. No
//  Date.now(), no randomness at module scope: "now" and every seed are always
//  parameters, so the output is byte-identical across calls (engine-tested) and
//  screenshots stay stable in the Chromium gate.
//
//  Each renderer emits a self-styled <svg> (an embedded <style> with
//  var(--token, frozen-fallback) rules, exactly the WHEEL_STYLE pattern) so an
//  exported/standalone figure carries its own look. Presentation attributes
//  never use var() (unsupported in SVG attrs) — colour rides through classes.
// ============================================================================

// ---- tiny shared helpers ---------------------------------------------------
const n = (v, dp = 2) => Number(Number(v).toFixed(dp));
const escAttr = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Deterministic 32-bit PRNG (Tommy Ettinger's mulberry32). Same seed → same
// stream → stable art and stable diffs. Returns a function yielding [0,1).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Point on a circle of radius r at angle θ (degrees), SVG axes (y down).
const pol = (r, deg) => {
  const a = deg * Math.PI / 180;
  return [n(r * Math.cos(a)), n(r * Math.sin(a))];
};

const pad2 = x => String(x).padStart(2, '0');
const hhmm = d => (d instanceof Date && !isNaN(d)) ? `${pad2(d.getHours())}:${pad2(d.getMinutes())}` : '';

// ===========================================================================
//  7.1  moonPhaseSVG — the Moon as an engraving
//  Signature (tolerant): moonPhaseSVG(frac, waxing, opts?) OR
//                        moonPhaseSVG({ frac, waxing, r, label })
//  frac = illuminated fraction 0..1; waxing boolean (light on the right).
// ===========================================================================
const MOON_STYLE =
  '.sa-moon .disc{fill:var(--sky-disc,#0b102a)}' +
  '.sa-moon .lit{fill:var(--sky-lit,#fdf9ec)}' +
  '.sa-moon .rim{fill:none;stroke:var(--dg-strong,#8a6a2a);stroke-width:1.5}' +
  '.sa-moon .halo{fill:none;stroke:var(--sky-halo,rgba(240,210,138,.22));stroke-width:6;opacity:.5}' +
  '.sa-moon .crater{fill:var(--dg-frame,#cbbd9c);opacity:.22}';

// Build the lit-region path for a right-lit moon of radius r. Returns '' when
// nothing is lit (new moon). Handles the three exact edge cases so no invalid
// `A rx,r` with rx==0 is ever emitted.
function litPath(frac, r) {
  if (frac <= 0) return '';
  if (frac >= 1) return `M 0,${-r} A ${r},${r} 0 0,1 0,${r} A ${r},${r} 0 0,1 0,${-r} Z`;
  const rx = n(r * Math.abs(2 * frac - 1));
  const sweep = frac < 0.5 ? 1 : 0;              // terminator bulges toward/away
  const term = rx === 0 ? `L 0,${-r}` : `A ${rx},${r} 0 0,${sweep} 0,${-r}`;
  return `M 0,${-r} A ${r},${r} 0 0,1 0,${r} ${term} Z`;
}

export function moonPhaseSVG(a, b, c) {
  let frac, waxing, r, label;
  if (a && typeof a === 'object') { ({ frac, waxing, r, label } = a); }
  else { frac = a; waxing = b; if (c && typeof c === 'object') ({ r, label } = c); }
  frac = Math.max(0, Math.min(1, Number(frac) || 0));
  waxing = !!waxing;
  r = Number(r) || 44;
  const pct = Math.round(frac * 100);
  const lbl = (label || 'The Moon') + `: ${pct}% illuminated, ${waxing ? 'waxing' : 'waning'}`;

  const lit = litPath(frac, r);
  // Lit region, flipped for a waning (left-lit) moon.
  const litG = lit
    ? (waxing ? `<path class="lit" d="${lit}"/>`
              : `<g transform="scale(-1,1)"><path class="lit" d="${lit}"/></g>`)
    : '';

  // Craters: 3 stipple discs, clipped to the lit region so they only mark the
  // illuminated face. Skipped near new moon (nothing to mark).
  let craters = '';
  if (frac > 0.15 && lit) {
    const cx = waxing ? 1 : -1;
    const spots = [[cx * r * 0.42, -r * 0.30, r * 0.13],
                   [cx * r * 0.55, r * 0.24, r * 0.09],
                   [cx * r * 0.24, r * 0.05, r * 0.07]];
    const clipId = 'sa-moon-lit';
    const clipPath = waxing ? lit : lit;   // clip uses the un-flipped path space
    const clipShape = waxing
      ? `<path d="${lit}"/>`
      : `<g transform="scale(-1,1)"><path d="${lit}"/></g>`;
    craters =
      `<clipPath id="${clipId}">${clipShape}</clipPath>` +
      `<g clip-path="url(#${clipId})">` +
      spots.map(([x, y, rr]) => `<circle class="crater" cx="${n(x)}" cy="${n(y)}" r="${n(rr)}"/>`).join('') +
      `</g>`;
  }

  const vb = `${-r - 6} ${-r - 6} ${(r + 6) * 2} ${(r + 6) * 2}`;
  return `<svg class="sa-moon" viewBox="${vb}" role="img" aria-label="${escAttr(lbl)}" xmlns="http://www.w3.org/2000/svg">` +
    `<style>${MOON_STYLE}</style>` +
    `<circle class="halo" cx="0" cy="0" r="${n(r + 2)}"/>` +
    `<circle class="disc" cx="0" cy="0" r="${r}"/>` +
    litG + craters +
    `<circle class="rim" cx="0" cy="0" r="${r}"/>` +
    `</svg>`;
}

// ===========================================================================
//  7.2  hourDialSVG — the planetary-hour instrument
//  Signature (tolerant):
//    hourDialSVG(hoursTableResult, now, opts?)   // the partition call form
//    hourDialSVG({ hours, now, r })              // the art-spec call form
//  hoursTableResult may be:
//    • { rows:[{hour,night,start,ruler}], sunrise, sunset, nextRise, dayRuler }
//      (the shape core/planetary-hours.js hoursTable() actually returns), or
//    • a flat array of { start, end, planet|ruler, isDay|night }.
//  The 24 unequal sectors are drawn proportional to their real durations — the
//  day/night asymmetry IS the lesson. The hours TABLE stays the complete,
//  accessible source; this dial is its redundant portrait (aria-label headline).
// ===========================================================================
const PLANET_GLYPH = {
  Saturn: '♄', Jupiter: '♃', Mars: '♂', Sun: '☉',
  Venus: '♀', Mercury: '☿', Moon: '☽'
};
const DIAL_STYLE =
  '.sa-dial .face{fill:var(--dg-fill,#fffdf6);stroke:var(--dg-strong,#8a6a2a);stroke-width:1.5}' +
  '.sa-dial .inner{fill:none;stroke:var(--dg-frame,#cbbd9c);stroke-width:1}' +
  '.sa-dial .sec-day{fill:var(--dg-fill-2,#fbf4e3)}' +
  '.sa-dial .sec-night{fill:var(--sky-disc,#0b102a);opacity:.92}' +
  '.sa-dial .spoke{stroke:var(--dg-grid,#c2b48f);stroke-width:.75}' +
  '.sa-dial .glyph{font-family:var(--serif,Georgia,serif);font-size:13px;text-anchor:middle;dominant-baseline:central}' +
  '.sa-dial .glyph-day{fill:var(--dg-ink,#2a2419)}' +
  '.sa-dial .glyph-night{fill:#e9e3d2}' +
  '.sa-dial .hd-now-arc{fill:none;stroke:var(--gold-500,#b8862b);stroke-width:2.5;stroke-linecap:round}' +
  '.sa-dial .hd-now{opacity:1}' +
  '.sa-dial .hd-needle{fill:var(--gold-500,#b8862b);stroke:var(--dg-fill,#fffdf6);stroke-width:1}' +
  '.sa-dial .hub{fill:var(--gold-500,#b8862b);stroke:var(--dg-fill,#fffdf6);stroke-width:1.5}';

// Annular sector path from radius r0→r1 between angles a0→a1 (degrees, clockwise).
function annular(r0, r1, a0, a1) {
  const large = ((a1 - a0) % 360 + 360) % 360 > 180 ? 1 : 0;
  const [x0o, y0o] = pol(r1, a0), [x1o, y1o] = pol(r1, a1);
  const [x1i, y1i] = pol(r0, a1), [x0i, y0i] = pol(r0, a0);
  return `M ${x0o},${y0o} A ${r1},${r1} 0 ${large},1 ${x1o},${y1o} ` +
         `L ${x1i},${y1i} A ${r0},${r0} 0 ${large},0 ${x0i},${y0i} Z`;
}

function normalizeHours(input) {
  if (!input) return [];
  let rows = null, tail = null;
  if (Array.isArray(input)) rows = input;
  else if (Array.isArray(input.rows)) { rows = input.rows; tail = input.nextRise; }
  else if (Array.isArray(input.hours)) rows = input.hours;
  if (!rows || !rows.length) return [];
  return rows.map((rw, i) => {
    const start = rw.start;
    let end = rw.end;
    if (!end) end = (i + 1 < rows.length) ? rows[i + 1].start : (tail || null);
    const planet = rw.planet || rw.ruler || '';
    const isDay = (rw.isDay != null) ? !!rw.isDay : !rw.night;
    return { start, end, planet, isDay };
  }).filter(s => s.start instanceof Date && s.end instanceof Date && !isNaN(s.start) && !isNaN(s.end));
}

export function hourDialSVG(a, b, c) {
  let sectors, now, r;
  if (a && typeof a === 'object' && !Array.isArray(a) && (a.hours || a.now) && !a.rows) {
    ({ hours: sectors, now, r } = a);
    sectors = normalizeHours({ hours: sectors });
  } else {
    sectors = normalizeHours(a);
    now = b;
    if (c && typeof c === 'object') ({ r } = c);
  }
  r = Number(r) || 120;
  const R0 = n(r * 0.65), R1 = r;          // inner/outer ring of the sectors

  if (!sectors.length) {
    return `<svg class="sa-dial" viewBox="${-r - 20} ${-r - 20} ${(r + 20) * 2} ${(r + 20) * 2}" role="img" aria-label="Planetary hours dial (unavailable)" xmlns="http://www.w3.org/2000/svg"><style>${DIAL_STYLE}</style><circle class="face" cx="0" cy="0" r="${r}"/></svg>`;
  }

  const t0 = sectors[0].start.getTime();
  const t1 = sectors[sectors.length - 1].end.getTime();
  const span = (t1 - t0) || 1;
  // Sunrise (first sector start) sits at 9 o'clock (180°), progressing clockwise.
  const angleAt = t => 180 + ((t - t0) / span) * 360;

  const nowMs = (now instanceof Date && !isNaN(now)) ? now.getTime() : null;
  let curIdx = -1;
  if (nowMs != null) {
    for (let i = 0; i < sectors.length; i++) {
      if (nowMs >= sectors[i].start.getTime() && nowMs < sectors[i].end.getTime()) { curIdx = i; break; }
    }
  }

  let secs = '', spokes = '', glyphs = '', nowArc = '';
  sectors.forEach((s, i) => {
    const a0 = angleAt(s.start.getTime()), a1 = angleAt(s.end.getTime());
    const cls = s.isDay ? 'sec-day' : 'sec-night';
    const isNow = i === curIdx;
    secs += `<path class="${cls}${isNow ? ' hd-now' : ''}" d="${annular(R0, R1, a0, a1)}"/>`;
    const [sx, sy] = pol(R1, a0), [sxi, syi] = pol(R0, a0);
    spokes += `<line class="spoke" x1="${sxi}" y1="${syi}" x2="${sx}" y2="${sy}"/>`;
    const mid = (a0 + a1) / 2, [gx, gy] = pol((R0 + R1) / 2, mid);
    const g = PLANET_GLYPH[s.planet] || '';
    if (g) glyphs += `<text class="glyph ${s.isDay ? 'glyph-day' : 'glyph-night'}" x="${gx}" y="${gy}">${g}</text>`;
    if (isNow) {
      const [ax, ay] = pol(R1 + 3, a0), [bx, by] = pol(R1 + 3, a1);
      const large = ((a1 - a0) % 360 + 360) % 360 > 180 ? 1 : 0;
      nowArc = `<path class="hd-now-arc" d="M ${ax},${ay} A ${R1 + 3},${R1 + 3} 0 ${large},1 ${bx},${by}"/>`;
    }
  });

  // The gold hand at `now` (the page's one gold leaf). Points from centre out.
  let needle = '';
  if (nowMs != null) {
    const na = angleAt(nowMs);
    const [tx, ty] = pol(R1 - 6, na);
    const [lx, ly] = pol(6, na + 90), [rx2, ry2] = pol(6, na - 90);
    needle = `<polygon class="hd-needle" points="${tx},${ty} ${lx},${ly} ${rx2},${ry2}"/>`;
  }

  // aria-label headline.
  let head = 'Planetary hours dial';
  if (curIdx >= 0) {
    const cur = sectors[curIdx];
    head = `Planetary hours dial: hour of ${cur.planet} until ${hhmm(cur.end)}`;
  }

  const vb = `${-r - 20} ${-r - 20} ${(r + 20) * 2} ${(r + 20) * 2}`;
  return `<svg class="sa-dial" viewBox="${vb}" role="img" aria-label="${escAttr(head)}" xmlns="http://www.w3.org/2000/svg">` +
    `<style>${DIAL_STYLE}</style>` +
    `<circle class="face" cx="0" cy="0" r="${r}"/>` +
    secs + spokes +
    `<circle class="inner" cx="0" cy="0" r="${R0}"/>` +
    glyphs + nowArc + needle +
    `<circle class="hub" cx="0" cy="0" r="4"/>` +
    `</svg>`;
}

// ===========================================================================
//  7.3  starfieldSVG — a deterministic starfield for Dome surfaces
//  starfieldSVG({ w, h, seed, density, wrap })
//  Seeded → identical sky every call (stable diffs, stable screenshots).
//  Node count is capped at 90 (art §7.3 budget / engine-test).
// ===========================================================================
const STAR_STYLE =
  '.starfield .st{fill:var(--sky-star,#fff7dd)}' +
  '.starfield .sp{stroke:var(--sky-star,#fff7dd);stroke-width:.6;stroke-linecap:round}';

export function starfieldSVG(opts = {}) {
  const w = Number(opts.w) || 200, h = Number(opts.h) || 120;
  const seed = (opts.seed != null) ? (opts.seed | 0) : 271828;
  const density = Number(opts.density) || (1 / 2400);
  const wrap = opts.wrap !== false;
  const rnd = mulberry32(seed);
  const count = Math.min(90, Math.max(0, Math.round(w * h * density)));

  let nodes = '';
  for (let i = 0; i < count; i++) {
    const x = n(rnd() * w), y = n(rnd() * h);
    const rr = n(0.4 + rnd() * 0.8), op = n(0.25 + rnd() * 0.55);
    const sparkle = rnd() < 0.06;
    nodes += sparkle
      ? `<path class="sp" d="M ${n(x - 3)},${y} H ${n(x + 3)} M ${x},${n(y - 3)} V ${n(y + 3)}" opacity="${op}"/>`
      : `<circle class="st" cx="${x}" cy="${y}" r="${rr}" opacity="${op}"/>`;
  }
  const group = `<g class="stars">${nodes}</g>`;
  if (!wrap) return group;
  return `<svg class="starfield" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    `<style>${STAR_STYLE}</style>${group}</svg>`;
}
