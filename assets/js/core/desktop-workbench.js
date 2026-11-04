// Desktop study adapter. Pure and explicit: no clock, storage, DOM or network.
// Composes the repository engines; this does not add a second ephemeris.
import { castChart, norm360, signOf, houseOf } from './astro.js';
import { civilFields, resolveZonedTime, validLocation } from './time.js';
import { HOUSE_SYSTEMS, parseExplicitInstant } from './instant-boundary.js';
import { buildSkySnapshot, SKY_BODIES } from './sky-dynamics.js';
import { allAspects, aspectBetween } from './aspects.js';
import { lahiriAyanamsa, AYANAMSA_RATE } from './data/vedic-data.js';
import { essentialDignity } from './dignities.js';

export const DESKTOP_SCHEMA_VERSION = 1;
export const DESKTOP_MODES = Object.freeze(['natal', 'transit', 'synastry']);
export const DESKTOP_ZODIACS = Object.freeze(['tropical', 'lahiri']);
export const DESKTOP_HOUSES = Object.freeze([...HOUSE_SYSTEMS]);
export const DESKTOP_LIMITS = Object.freeze({ minYear: 1900, maxYear: 2100, maxOrb: 10, maxName: 100 });
export const DESKTOP_SOURCES = Object.freeze([
  { id: 'DESKTOP-ASTRONOMY', title: 'Astronomy Engine: apparent geocentric positions', url: 'https://github.com/cosinekitty/astronomy', claimType: 'calculated-astronomy', note: 'Bundled MIT-licensed engine. Existing reference fixtures, not independent full-range validation.' },
  { id: 'DESKTOP-HOUSES', title: 'Workbench calculation methods and house-system limits', url: 'docs/2026-10-calculation-methods.md', claimType: 'calculation-method', note: 'Four canonical house algorithms; actual fallback is exposed alongside the requested method.' },
  { id: 'DESKTOP-ASPECTS', title: 'Geometric aspect comparison', url: 'assets/js/core/aspects.js', claimType: 'modern-implementation-choice', note: 'Five conventional angles and an explicit uniform orb. This view does not use Lilly’s planet-specific moieties.' },
  { id: 'DESKTOP-LAHIRI', title: 'Inherited linear Lahiri estimate', url: 'assets/js/core/data/vedic-data.js', claimType: 'inherited-approximation', note: '23.8531° at J2000 + 50.2877 arcseconds per Julian year; not the full Swiss/IAE precession model.' },
  { id: 'DESKTOP-LILLY', title: 'Lilly essential-dignity table, Christian Astrology (1647), Book I', url: 'assets/js/core/data/dignities-data.js', claimType: 'named-traditional-rule', note: 'Inherited table and source qualifications. A conventional ledger is not a success probability or a personality diagnosis.' },
  { id: 'DESKTOP-TIME', title: 'IANA local-clock resolution and repeated/skipped times', url: 'https://tc39.es/proposal-temporal/docs/ambiguity.html', claimType: 'technical-reference', note: 'Runtime Intl time-zone database; gap rejection and explicit repeated-clock choice.' },
].map(Object.freeze));

const CLASSICAL = new Set(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn']);
const BODY_IDS = [...SKY_BODIES.map(x => x.id), 'NorthNode', 'SouthNode'];
const MIN = Date.parse('1900-01-01T00:00:00Z'), MAX = Date.parse('2100-12-31T23:59:59.999Z');
function object(raw, label) { if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError(`${label} must be an object.`); }
function text(raw, fallback, max, label) {
  const value = raw === undefined ? fallback : raw;
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new RangeError(`${label} must be non-empty text of at most ${max} characters.`);
  return value.trim();
}
function checkInstant(date) {
  if (!Number.isFinite(+date) || +date < MIN || +date > MAX) throw new RangeError('Desktop study charts support UTC years 1900–2100.');
  return date;
}

/** Resolve civil input afresh. Unknown metadata (including imported dateISO) is omitted. */
export function normalizeDesktopProfile(raw) {
  object(raw, 'Chart profile');
  if (raw.timeKnown === false) throw new RangeError('An exact chart needs a known time. Use the separate date-only birth reader when the time is unknown.');
  const name = text(raw.name, 'Untitled chart', 100, 'Chart name');
  const localDate = text(raw.localDate, undefined, 10, 'Local date');
  const localTime = text(raw.localTime, undefined, 8, 'Local time');
  const timeZone = text(raw.timeZone, undefined, 120, 'Time zone');
  const f = civilFields(localDate, localTime);
  if (f.year < 1900 || f.year > 2100 || !/^\d{4}-\d{2}-\d{2}$/.test(localDate)) throw new RangeError('Desktop study local dates must be within 1900–2100.');
  validLocation(raw.lat, raw.lon);
  if (Math.abs(raw.lat) === 90) throw new RangeError('Angles and houses are undefined at the geographic poles; choose a latitude below 90°.');
  const disambiguation = raw.disambiguation ?? 'reject';
  const resolved = resolveZonedTime(localDate, localTime, timeZone, { disambiguation });
  checkInstant(resolved.instant);
  return { name, localDate, localTime, timeZone, lat: raw.lat, lon: raw.lon, disambiguation,
    dateISO: resolved.instant.toISOString(), offsetHours: resolved.offsetHours, ambiguous: resolved.ambiguous };
}

function profileInput(p) { return { name: p.name, localDate: p.localDate, localTime: p.localTime, timeZone: p.timeZone, lat: p.lat, lon: p.lon, disambiguation: p.disambiguation }; }
function bodyCaption(id) { return id === 'NorthNode' ? { name: 'Mean North Node', glyph: '☊' } : id === 'SouthNode' ? { name: 'Mean South Node', glyph: '☋' } : SKY_BODIES.find(b => b.id === id); }
function positionLabel(lon) {
  const s = signOf(lon), d = Math.floor(s.degInSign), m = Math.floor((s.degInSign - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}′ ${s.name}`;
}
function mapAspects(bodies, orb) {
  return allAspects(Object.fromEntries(bodies.map(b => [b.id, { lon: b.lon, speed: b.speed }])), { orbOverride: orb })
    .map(a => ({ ...a, applying: a.orb < 1e-8 ? null : a.applying, separating: a.orb < 1e-8 ? null : a.separating, type: a.aspect.toLowerCase(), phase: a.orb < 1e-8 ? 'exact' : a.applying ? 'applying' : 'separating', phaseMethod: 'Short linear-motion comparison; not a solved future contact.', sourceIds: ['DESKTOP-ASPECTS'] }))
    .sort((a,b) => a.orb - b.orb || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
}
function castProfile(profile, options) {
  const date = new Date(profile.dateISO), tropical = castChart(date, profile.lat, profile.lon, options.system);
  const sky = buildSkySnapshot({ dateISO: profile.dateISO, timeZone: profile.timeZone, lat: profile.lat, lon: profile.lon }, { includeStars: false, includeCatalogStars: false, aspectOrb: options.orb });
  const ayanamsa = options.zodiac === 'lahiri' ? lahiriAyanamsa(date) : 0;
  const shift = lon => norm360(lon - ayanamsa);
  const asc = shift(tropical.asc), mc = shift(tropical.mc);
  // Sidereal whole-sign cusps start at the sidereal ASC sign, not the rotated
  // tropical sign boundary. Quadrant/equal cusps preserve geometric offsets.
  const cusps = tropical.cusps.map((lon, i) => i === 0 ? 0 : options.zodiac === 'lahiri' && tropical.system === 'whole' ? norm360(Math.floor(asc / 30) * 30 + (i - 1) * 30) : shift(lon));
  const speedShift = options.zodiac === 'lahiri' ? AYANAMSA_RATE / 365.25 : 0;
  const bodies = BODY_IDS.map(id => {
    const p = sky.bodies.find(b => b.id === id);
    const raw = p ? { lon: p.longitude, lat: p.latitude, speed: p.speedDegreesPerDay } : tropical.planets[id];
    const lon = shift(raw.lon), speed = raw.speed - speedShift, caption = bodyCaption(id);
    const dignity = options.zodiac === 'tropical' && CLASSICAL.has(id) ? essentialDignity(id, lon, tropical.isDay) : null;
    const evidence = dignity ? [{ claimType: 'named-traditional-rule', title: 'Lilly essential dignity', summary: `${dignity.rows.map(r => `${r.kind} (${r.score > 0 ? '+' : ''}${r.score})`).join('; ')}. Dispositor: ${dignity.dispositor}.`, sourceIds: ['DESKTOP-LILLY'], limitation: 'Conventional historical points; not a probability, personal worth or overall judgment.' }] : [{ claimType: 'calculated-astronomy', title: 'Position and frame', summary: `${caption.name} is displayed in the ${options.zodiac === 'lahiri' ? 'linear Lahiri sidereal' : 'tropical'} zodiac.`, sourceIds: [id.includes('Node') ? 'DESKTOP-HOUSES' : 'DESKTOP-ASTRONOMY'], limitation: options.zodiac === 'lahiri' ? 'Selecting a sidereal frame does not turn Western aspect angles into a full Jyotiṣa reading.' : 'No classical seven-planet dignity judgment is assigned to this point.' }];
    return { id, name: caption.name, glyph: caption.glyph, lon, longitude: lon, tropicalLongitude: raw.lon, latitude: raw.lat, speed, speedDegreesPerDay: speed, retrograde: speed < 0, house: houseOf(lon, cusps), sign: signOf(lon), label: positionLabel(lon), dignity, evidence };
  });
  const planets = Object.fromEntries(bodies.map(b => [b.id, { lon: b.lon, lat: b.latitude, speed: b.speed, retrograde: b.retrograde, house: b.house }]));
  const chart = { ...tropical, asc, mc, desc: shift(tropical.desc), ic: shift(tropical.ic), cusps, planets,
    zodiac: options.zodiac, ayanamsa, timeZone: profile.timeZone, utcOffset: profile.offsetHours };
  const warnings = [];
  if (tropical.houseWarning) warnings.push(tropical.houseWarning);
  if (profile.ambiguous) warnings.push(`Repeated local clock: the explicitly selected ${profile.disambiguation} occurrence was used.`);
  if (options.zodiac === 'lahiri') warnings.push('Lahiri is the inherited linear approximation. Quadrant cusps are rotated; Whole Sign starts at the sidereal ascendant sign. This display is not a complete Jyotiṣa judgment.');
  return { profile, dateISO: profile.dateISO, chart, bodies, aspects: mapAspects(bodies, options.orb),
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, lon: cusps[i + 1], longitude: cusps[i + 1], sign: signOf(cusps[i + 1]), label: positionLabel(cusps[i + 1]) })),
    requestedSystem: options.system, actualSystem: tropical.system, zodiac: options.zodiac, ayanamsa, warnings };
}

/** Build one or two charts. Transit primary is frozen; synastry has no shared motion clock. */
export function buildDesktopStudy(raw) {
  object(raw, 'Desktop study');
  const mode = raw.mode ?? 'natal', zodiac = raw.zodiac ?? 'tropical', system = raw.system ?? 'placidus', orb = raw.orb ?? 3;
  if (!DESKTOP_MODES.includes(mode)) throw new RangeError('Choose natal, transit or synastry.');
  if (!DESKTOP_ZODIACS.includes(zodiac)) throw new RangeError('Choose tropical or lahiri.');
  if (!DESKTOP_HOUSES.includes(system)) throw new RangeError('Choose a supported house system.');
  if (typeof orb !== 'number' || !Number.isFinite(orb) || orb < 0 || orb > 10) throw new RangeError('Choose a uniform aspect orb from 0 to 10 degrees.');
  const primaryProfile = normalizeDesktopProfile(raw.primary);
  const secondaryProfile = mode === 'natal' ? null : normalizeDesktopProfile(raw.secondary);
  const options = { mode, zodiac, system, orb }, primary = castProfile(primaryProfile, options), secondary = secondaryProfile ? castProfile(secondaryProfile, options) : null;
  const crossAspects = [];
  if (secondary) for (const a of primary.bodies) for (const b of secondary.bodies) {
    const hit = aspectBetween(a.id, { lon: a.lon, speed: 0 }, b.id, { lon: b.lon, speed: mode === 'transit' ? b.speed : 0 }, { orbOverride: orb });
    if (!hit) continue;
    crossAspects.push({ ...hit, from: a.id, to: b.id, fromChart: 'primary', toChart: 'secondary', type: hit.aspect.toLowerCase(),
      applying: mode === 'transit' && hit.orb >= 1e-8 ? hit.applying : null, separating: mode === 'transit' && hit.orb >= 1e-8 ? hit.separating : null,
      phase: mode === 'transit' ? hit.orb < 1e-8 ? 'exact' : hit.applying ? 'applying' : 'separating' : 'not-applicable',
      phaseMethod: mode === 'transit' ? 'Primary longitude fixed; secondary short linear motion only. Not a solved perfection.' : 'Different natal epochs: no applying/separating judgment.', sourceIds: ['DESKTOP-ASPECTS'] });
  }
  crossAspects.sort((a,b) => a.orb-b.orb || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
  return { schemaVersion: DESKTOP_SCHEMA_VERSION, inputs: { ...options, primary: profileInput(primaryProfile), secondary: secondaryProfile ? profileInput(secondaryProfile) : null },
    primary, secondary, crossAspects, methods: { engine: 'Bundled Astronomy Engine and canonical Workbench house algorithms', frame: 'Apparent geocentric true ecliptic/equinox of date', zodiac,
      ayanamsa: zodiac === 'lahiri' ? 'Linear Lahiri estimate, separately evaluated at each chart epoch' : null,
      requestedHouseSystem: system, aspectOrbDegrees: orb, aspectMethod: 'Uniform orb for conjunction, sextile, square, trine and opposition; not Lilly moieties',
      nodes: 'Mean lunar nodes; inherited nominal node speed', displayPrecision: 'Position labels truncate within the calculated sign to one arcminute; numerical fields retain engine digits without claiming that accuracy.', motion: 'Central ±6-hour longitude difference; linear Lahiri rate subtracted in sidereal display',
      time: 'Explicit local Gregorian date/clock and IANA zone, resolved by runtime Intl; repeated clocks require a choice', supportedYears: [1900, 2100],
      privacy: 'Computed locally. Saving, exporting or sending a packet requires a separate explicit action.',
      limits: ['Numerical precision is not observational accuracy or predictive validity.', 'Signs are equal 30° divisions, not IAU constellations.', 'No solar returns, progressions or relationship outcome scores are inferred from this comparison; use the dedicated tools.', 'Lahiri charts at different dates use each epoch’s ayanamsa; cross-chart angles are comparisons in that declared sidereal frame.'] },
    sources: DESKTOP_SOURCES.map(x => ({ ...x })) };
}

/** Portable input is recomputed so caller-supplied numerical rows are never trusted. */
export function exportDesktopStudy(study) {
  object(study, 'Desktop study');
  const computed = buildDesktopStudy(study.inputs);
  return JSON.parse(JSON.stringify({ kind: 'astrology-desktop-study', ...computed }));
}

/** Shift an actual instant; hours/days are elapsed time, months/years clamp in UTC. */
export function stepDesktopProfile(raw, amount, unit = 'day') {
  if (!Number.isInteger(amount) || Math.abs(amount) > 3660 || !['hour', 'day', 'month', 'year'].includes(unit)) throw new RangeError('Choose an integer step up to 3660 hours, days, months or years.');
  const p = normalizeDesktopProfile(raw), d = parseExplicitInstant(p.dateISO);
  if (unit === 'hour' || unit === 'day') d.setTime(+d + amount * (unit === 'hour' ? 3600000 : 86400000));
  else {
    const day = d.getUTCDate(); d.setUTCDate(1);
    if (unit === 'month') d.setUTCMonth(d.getUTCMonth() + amount); else d.setUTCFullYear(d.getUTCFullYear() + amount);
    const last = new Date(+d); last.setUTCMonth(last.getUTCMonth() + 1, 0); d.setUTCDate(Math.min(day, last.getUTCDate()));
  }
  checkInstant(d);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', { timeZone: p.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(d).map(x => [x.type, x.value]));
  const shifted = { ...profileInput(p), localDate: `${parts.year}-${parts.month}-${parts.day}`, localTime: `${parts.hour}:${parts.minute}:${parts.second}` };
  // Preserve the selected instant even if elapsed stepping lands in a fold.
  const earlier = resolveZonedTime(shifted.localDate, shifted.localTime, shifted.timeZone, { disambiguation: 'earlier' });
  shifted.disambiguation = earlier.ambiguous ? +earlier.instant === +d ? 'earlier' : 'later' : 'reject';
  return normalizeDesktopProfile(shifted);
}
