// Source-labelled presentation data over the existing canonical sky solver.
// These records never change a calendar calculation, a study clock or an export.
import { buildSkyTimelineSync, SKY_LIMITS } from './sky-dynamics.js';
import { parseExplicitInstant } from './instant-boundary.js';
import { validateZone } from './cultural-calendars.js';

const DAY = 86400000, MIN = Date.parse('1900-01-01T00:00:00Z'), MAX = Date.parse('2100-12-31T23:59:59.999Z');
const phaseLabels = ['New Moon vicinity','Waxing crescent','First quarter vicinity','Waxing gibbous','Full Moon vicinity','Waning gibbous','Last quarter vicinity','Waning crescent'];
const solarKinds = ['march-equinox','june-solstice','september-equinox','december-solstice'];
const lunarKinds = ['new-moon','first-quarter','full-moon','last-quarter'];
const yearEvents = new Map(), MAX_CACHED_YEARS = 24;
const norm = value => ((value % 360) + 360) % 360;
const prose = (value, max = 600) => typeof value === 'string' ? value.slice(0,max) : '';

/** Phase is shared sky geometry, never a calendar-specific sighting decision. */
export function celestialPhase(astronomy, {calendarLabel = '', timeZone = '', sourceLabel = 'Held canonical astronomy · geocentric Moon–Sun elongation'} = {}) {
  const angle = astronomy?.moonSunElongation;
  if (!Number.isFinite(angle)) return null;
  const phase = norm(angle) / 360;
  return Object.freeze({ phase, phaseLabel: prose(astronomy.phaseLabel,160) || phaseLabels[Math.floor((norm(angle)+22.5)/45)%8],
    ...(Number.isFinite(astronomy.moonIlluminatedFraction) && astronomy.moonIlluminatedFraction >= 0 && astronomy.moonIlluminatedFraction <= 1 ? {illumination:astronomy.moonIlluminatedFraction} : {}),
    calendarLabel:prose(calendarLabel,240),timeZone:prose(timeZone,100),sourceLabel:prose(sourceLabel),
  });
}

/** Existing sampled longitudes support a phase icon, not a new illumination model. */
export function celestialPhaseFromPositions(positions, options = {}) {
  if (!Array.isArray(positions)) return null;
  const sun = positions.find(body => body?.id === 'Sun'), moon = positions.find(body => body?.id === 'Moon');
  if (!Number.isFinite(sun?.longitude) || !Number.isFinite(moon?.longitude)) return null;
  return celestialPhase({moonSunElongation:norm(moon.longitude-sun.longitude)}, {sourceLabel:'Canonical sampled Sun and Moon longitudes · geocentric elongation',...options});
}

export function celestialEventKind(event) {
  if (!event || !Number.isFinite(event.angle)) return null;
  const index = norm(event.angle) / 90;
  if (!Number.isInteger(index)) return null;
  return event.kind === 'solar-quarter' ? solarKinds[index] : event.kind === 'lunar-quarter' ? lunarKinds[index] : null;
}

/** A bounded, immutable view cache; no observer coordinates or private inputs. */
export function celestialEventsForRange({startISO,endISO,timeZone = 'UTC'} = {}) {
  const start = +parseExplicitInstant(startISO), end = +parseExplicitInstant(endISO), zone = validateZone(timeZone);
  if (start < MIN || end > MAX || end < start || (end-start)/DAY > SKY_LIMITS.maxSpanDays) throw new RangeError('Celestial navigation supports bounded UTC windows within 1900–2100.');
  const events = [];
  for (let year = new Date(start).getUTCFullYear(); year <= new Date(end).getUTCFullYear(); year++) {
    const key = year+'|'+zone;
    let saved = yearEvents.get(key);
    if (!saved) {
      const result = buildSkyTimelineSync({startISO:`${year}-01-01T00:00:00.000Z`,endISO:`${year}-12-31T23:59:59.999Z`,timeZone:zone,bodyIds:['Sun','Moon'],stepHours:8760,includeEvents:true},{maxSamples:3,maxEvents:64});
      saved = Object.freeze(result.events.map(event=>Object.freeze({...event})));
      yearEvents.set(key,saved);
      if (yearEvents.size > MAX_CACHED_YEARS) yearEvents.delete(yearEvents.keys().next().value);
    }
    events.push(...saved.filter(event=>Date.parse(event.dateISO)>=start&&Date.parse(event.dateISO)<=end));
  }
  return Object.freeze(events.sort((a,b)=>a.dateISO.localeCompare(b.dateISO)||a.kind.localeCompare(b.kind)));
}

/** Exact-event cards are separate from an indexed daily slider's selection. */
export function celestialMarkers(events, {calendarLabel = '',timeZone = 'UTC',selectionNote = 'Use the explicit action to cast the solved UTC instant; opening or bookmarking this card does not move the slider.'} = {}) {
  if (!Array.isArray(events) || events.length > 10000) throw new TypeError('Celestial markers require a bounded event array.');
  const zone = validateZone(timeZone), seen = new Set();
  const formatter = new Intl.DateTimeFormat('en-CA-u-ca-gregory-nu-latn',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  return events.flatMap(event=>{
    const celestialKind = celestialEventKind(event); if (!celestialKind) return [];
    let instant; try { instant = parseExplicitInstant(event.dateISO || event.instantUTC); } catch { return []; }
    const date = instant.toISOString(), id = 'celestial-'+celestialKind+'@'+date;
    if (seen.has(id)) return []; seen.add(id);
    const fields = Object.fromEntries(formatter.formatToParts(instant).map(part=>[part.type,part.value]));
    const localDate = `${fields.year}-${fields.month}-${fields.day}`, localTime = `${fields.hour}:${fields.minute}:${fields.second}`;
    const sourceLabel = prose(event.method) || 'Canonical Astronomy Engine solar-season / lunar-quarter numerical solver';
    const celestial = event.kind === 'lunar-quarter' ? celestialPhase({moonSunElongation:event.angle,phaseLabel:event.label},{calendarLabel,timeZone:zone,sourceLabel}) : undefined;
    return [{id,date,label:prose(event.label,240)||celestialKind,kind:'astronomy',celestialKind,calendarLabel:prose(calendarLabel,240),timeZone:zone,
      ...(celestial?{celestial}:{}),sourceLabel,
      summary:prose(event.definition,3000)||'Numerically solved astronomical instant, separate from daily study samples.',
      details:[{label:'Solved UTC instant',value:date},{label:'Observer clock',value:localDate+' '+localTime+' · '+zone},{label:'Calendar lane',value:prose(calendarLabel,240)||'Shared astronomical sky'},{label:'Method',value:sourceLabel},{label:'Selection',value:prose(selectionNote,2000)},{label:'Scope',value:'Geocentric astronomical event; no crescent-sighting, religious calendar boundary or predicted outcome is inferred.'}],
    }];
  });
}
