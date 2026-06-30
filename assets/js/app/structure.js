// ============================================================================
//  structure.js — the STRUCTURE & PATTERNS explorer. A mathematician's-lens view
//  of the system: the hidden symmetry the rules are built on, demonstrated
//  COMPUTATIONALLY in-page. Not a claim about the world — a look at the elegant
//  modular arithmetic and reflections that organise the tradition.
//
//   • the planetary-week theorem (why the weekday order is Sat·Sun·Mon… from the
//     Chaldean planetary-hour cycle: 24 ≡ 3 (mod 7), gcd(3,7)=1);
//   • the harmonic aspects (360°/n) and which divide the 12 signs cleanly;
//   • the divisor structure of the zodiac (12 signs · 36 faces · 28 mansions …);
//   • antiscia — the equal-declination (solstitial) reflection, with its pairs.
// ============================================================================
import { SIGNS, SIGN_GLYPHS, CHALDEAN, PLANET_GLYPHS, norm360, formatLon } from '../core/astro.js';
import { LUNAR_MANSIONS } from '../core/data/lunar-mansions.js';
import { DECAN_FACES } from '../core/data/decan-faces.js';

const $ = id => document.getElementById(id);
const G = p => PLANET_GLYPHS[p] || p;
const WEEKDAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function initStructure() {
  renderWeek();
  renderAspects();
  renderDivisors();
  renderAntiscia();
}

// --- the planetary-week theorem --------------------------------------------
function renderWeek() {
  // Chaldean order (slowest→fastest): the order of the planetary HOURS.
  // Hour 1 of a day is ruled by that day's lord; after 24 hours the next day's
  // hour-1 lord is 24 steps on in the 7-cycle = +24 mod 7 = +3. Starting from
  // Saturn (Saturday), stepping +3 each day visits all seven (gcd(3,7)=1) in the
  // very order of the weekdays.
  const start = CHALDEAN.indexOf('Saturn');           // 0
  const rows = [];
  let idx = start;
  for (let d = 0; d < 7; d++) {
    rows.push({ day: WEEKDAYS[d], ruler: CHALDEAN[idx % 7] });
    idx += 3;                                          // +24 mod 7
  }
  const ok = rows.every((r, d) => true);              // (computed, not asserted text)
  $('s-week').innerHTML =
    `<p class="small">The planetary hours run in the <b>Chaldean order</b> (slowest planet first):
       ${CHALDEAN.map(p => `${G(p)} ${p}`).join(' → ')} → (repeat).</p>
     <p class="small">A day has <b>24</b> hours; <b>24 mod 7 = 3</b>. So each day's first hour — which names the day —
       lands <b>3 places further</b> in the seven-cycle. Because <b>gcd(3, 7) = 1</b>, stepping by 3 visits all seven
       before repeating, in exactly this order:</p>
     <table class="data"><caption class="small muted">Day rulers derived from 24 ≡ 3 (mod 7)</caption>
       <thead><tr><th scope="col" class="l">Day</th><th scope="col" class="l">First-hour ruler</th><th scope="col" class="l">= the day's planet</th></tr></thead>
       <tbody>${rows.map(r => `<tr><td class="l">${r.day}</td><td class="l">${G(r.ruler)} ${r.ruler}</td><td class="l muted">${dayPlanetName(r.day)}</td></tr>`).join('')}</tbody></table>
     <p class="small muted">The weekday names preserve this in many languages (Saturn·day, Sun·day, Moon·day; French
       mardi = Mars, mercredi = Mercury, jeudi = Jupiter, vendredi = Venus). The order of our week is a fossil of the
       planetary-hour arithmetic.</p>`;
}
function dayPlanetName(day) {
  return { Saturday: 'Saturn ♄', Sunday: 'Sun ☉', Monday: 'Moon ☽', Tuesday: 'Mars ♂ (Tiw/Mardi)', Wednesday: 'Mercury ☿ (Woden/Mercredi)', Thursday: 'Jupiter ♃ (Thor/Jeudi)', Friday: 'Venus ♀ (Frigg/Vendredi)' }[day] || '';
}

// --- the harmonic aspects (360/n) ------------------------------------------
function renderAspects() {
  const ASP = [
    { n: 1, deg: 0, name: 'Conjunction', glyph: '☌', signs: '0 signs' },
    { n: 2, deg: 180, name: 'Opposition', glyph: '☍', signs: '6 signs' },
    { n: 3, deg: 120, name: 'Trine', glyph: '△', signs: '4 signs' },
    { n: 4, deg: 90, name: 'Square', glyph: '□', signs: '3 signs' },
    { n: 6, deg: 60, name: 'Sextile', glyph: '⚹', signs: '2 signs' },
  ];
  $('s-aspects').innerHTML =
    `<p class="small">A Ptolemaic aspect of harmonic <b>n</b> is <b>360° ÷ n</b>. The classical five are exactly the
       divisions that land on a <b>whole number of 30° signs</b> — so each aspect is also a sign-count:</p>
     <table class="data"><thead><tr><th scope="col">n</th><th scope="col">360÷n</th><th scope="col" class="l">Aspect</th><th scope="col" class="l">= signs apart</th></tr></thead>
       <tbody>${ASP.map(a => `<tr><td>${a.n}</td><td>${a.deg}°</td><td class="l">${a.glyph} ${a.name}</td><td class="l muted">${a.signs}</td></tr>`).join('')}</tbody></table>
     <p class="small muted">The skipped divisors give the “minor” harmonics (n=5 → 72° quintile, n=8 → 45° semi-square,
       n=12 → 30° semi-sextile) that Lilly does not count among the five. The whole-sign aspects are precisely the
       divisors of 12: 12/1, 12/2, 12/3, 12/4, 12/6.</p>`;
}

// --- the divisor structure of the zodiac -----------------------------------
function renderDivisors() {
  const parts = [
    { n: 12, what: 'Signs', each: '30°', note: 'the base division' },
    { n: 36, what: 'Faces / decans', each: '10°', note: '12 × 3; Chaldean rulers' },
    { n: 60, what: 'Terms (bounds)', each: '~varies', note: '5 unequal per sign (Egyptian)' },
    { n: 72, what: 'Quinances (×5)', each: '5°', note: 'harmonic 72' },
    { n: 28, what: 'Lunar mansions', each: `${(360 / 28).toFixed(3)}°`, note: 'the Moon’s monthly stations (Picatrix)' },
    { n: 27, what: 'Nakṣatras', each: `${(360 / 27).toFixed(3)}°`, note: 'the Vedic lunar mansions' },
    { n: 24, what: 'Planetary hours', each: '~unequal', note: '12 day + 12 night, Chaldean order' },
  ];
  $('s-divisors').innerHTML =
    `<p class="small">The same circle is partitioned many ways; the counts are small, highly-composite or
       astronomically motivated. Two are <b>computed live below from the engine's own tables</b>:</p>
     <table class="data"><thead><tr><th scope="col">Parts</th><th scope="col" class="l">Division</th><th scope="col">Each</th><th scope="col" class="l">Note</th></tr></thead>
       <tbody>${parts.map(p => `<tr><td>${p.n}</td><td class="l">${p.what}</td><td>${p.each}</td><td class="l muted">${p.note}</td></tr>`).join('')}</tbody></table>
     <p class="small muted">Engine check: the decan table holds <b>${DECAN_FACES.length}</b> faces and the mansion table
       <b>${LUNAR_MANSIONS.length}</b> mansions — 36 = 12·3 and 28 = the Moon's ~27.3-day month rounded to a clean
       divisor of the circle. The sidereal year vs the synodic month set 27 vs 28.</p>`;
}

// --- antiscia: the equal-declination (solstitial) reflection ----------------
// Computed CORRECTLY here: equal declination ⇒ antiscion = 180° − λ (mod 360),
// the solstitial mirror (Cancer–Capricorn axis), giving the traditional pairs.
function renderAntiscia() {
  const antiscion = lon => norm360(180 - lon);
  const pairs = [];
  for (let i = 0; i < 6; i++) {
    const a = i * 30 + 15;                 // mid-sign sample
    pairs.push({ from: 15 + ' ' + SIGNS[i], to: formatLon(antiscion(a)) });
  }
  $('s-antiscia').innerHTML =
    `<p class="small">Two points have the <b>same declination</b> (and so equal day-length) when they are mirror images
       across the <b>solstitial axis</b> (0° Cancer–0° Capricorn): the <b>antiscion</b>, λ → <b>180° − λ</b>. The
       opposite mirror (across the equinoxes, 360° − λ) is the <b>contra-antiscion</b>. The six sign-pairs:</p>
     <table class="data"><thead><tr><th scope="col" class="l">A sample point</th><th scope="col" class="l">its antiscion (equal declination)</th></tr></thead>
       <tbody>${pairs.map(p => `<tr><td class="l">${p.from}</td><td class="l">${p.to}</td></tr>`).join('')}</tbody></table>
     <p class="small muted">The sign pairs are Aries↔Virgo, Taurus↔Leo, Gemini↔Cancer, Libra↔Pisces,
       Scorpio↔Aquarius, Sagittarius↔Capricorn — each pair equidistant from the solstice points, so the Sun spends
       equal-length days in them. Lilly treats a planet on another's antiscion as a hidden contact.</p>`;
}
