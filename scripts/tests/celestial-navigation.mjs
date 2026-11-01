// Presentation metadata over held sky geometry and canonical event solvers.
// Synthetic event fixtures test identity/time-zone behavior, not new ephemerides.
import { pathToFileURL } from 'node:url';
import {
  celestialPhase, celestialPhaseFromPositions, celestialEventKind,
  celestialMarkers, celestialEventsForRange,
} from '../../assets/js/core/celestial-navigation.js';

export async function run() {
  let count = 0; const failures = [];
  const ok = (condition, label) => { count++; if (!condition) failures.push(label); };
  const throws = (action, label) => { try { action(); ok(false, label); } catch { ok(true, label); } };
  const near = (a, b, tolerance = 1e-12) => Number.isFinite(a) && Math.abs(a-b) <= tolerance;

  const newMoon = celestialPhase({ moonSunElongation:0, moonIlluminatedFraction:0 }, { calendarLabel:'Hebrew civil display', timeZone:'UTC' });
  ok(newMoon && newMoon.phase === 0, 'New Moon elongation remains a zero phase, not missing data');
  ok(newMoon?.illumination === 0, 'A true held zero illuminated fraction is retained');
  const fullMoon = celestialPhase({ moonSunElongation:180, moonIlluminatedFraction:1 });
  ok(fullMoon?.phase === .5 && fullMoon?.illumination === 1, 'Full Moon retains half-turn phase and a held illuminated fraction of one');
  ok(/full/i.test(fullMoon?.phaseLabel || ''), 'Broad phase label identifies Full Moon vicinity');
  const waning = celestialPhase({ moonSunElongation:359 });
  ok(near(waning?.phase, 359/360) && waning.phase > .99, 'Waning geometry near wrap stays near one turn rather than jumping to zero');
  ok(!Object.hasOwn(waning || {}, 'illumination'), 'An elongation-only phase does not invent an illuminated fraction');
  ok(celestialPhase({ moonSunElongation:360 })?.phase === 0, 'A complete angular turn normalizes to zero');
  ok(near(celestialPhase({ moonSunElongation:-90 })?.phase, .75), 'Negative equivalent longitude differences normalize to the same phase');
  for (const input of [null, {}, {moonSunElongation:NaN}, {moonSunElongation:Infinity}, {moonSunElongation:'90'}]) {
    ok(celestialPhase(input) === null, 'Missing or nonfinite held phase input remains unavailable: '+JSON.stringify(input));
  }
  for (const illumination of [-.01, 1.01, NaN, Infinity, '0']) {
    const result = celestialPhase({ moonSunElongation:90, moonIlluminatedFraction:illumination });
    ok(result && !Object.hasOwn(result, 'illumination'), 'Invalid held illumination is not promoted to a measured value: '+String(illumination));
  }
  const sample = [{id:'Sun',longitude:350},{id:'Moon',longitude:80}];
  const sampledPhase = celestialPhaseFromPositions(sample);
  ok(near(sampledPhase?.phase, .25) && /quarter/i.test(sampledPhase?.phaseLabel || ''), 'Sampled Moon minus Sun wraps through Aries to the correct quarter geometry');
  ok(!Object.hasOwn(sampledPhase || {}, 'illumination'), 'Sampled longitudes do not claim an uncalculated illuminated fraction');
  for (const positions of [null, [], [{id:'Sun',longitude:0}], [{id:'Moon',longitude:90}], [{id:'Sun',longitude:0},{id:'Moon',longitude:NaN}]]) {
    ok(celestialPhaseFromPositions(positions) === null, 'Incomplete or nonfinite sampled body positions remain unavailable');
  }

  const event = (dateISO, kind, angle, label) => ({
    dateISO, kind, angle, label,
    definition:'Synthetic test fixture for event-time identity; not a claimed observed event.',
    method:'Canonical solver metadata fixture', frame:'geocentric apparent true ecliptic/equinox of date',
  });
  const first = event('2026-03-29T00:30:00Z', 'lunar-quarter', 90, 'First quarter');
  const second = event('2026-03-29T01:30:00Z', 'solar-quarter', 0, 'March equinox');
  for (const [kind, names] of [
    ['solar-quarter',['march-equinox','june-solstice','september-equinox','december-solstice']],
    ['lunar-quarter',['new-moon','first-quarter','full-moon','last-quarter']],
  ]) {
    for (const [index, name] of names.entries()) {
      ok(celestialEventKind({kind,angle:index*90}) === name, 'Canonical '+kind+' angle '+index*90+' has its correct distinct marker kind');
    }
  }
  const markers = celestialMarkers([first, second], { calendarLabel:'Chinese civil display', timeZone:'Europe/London', selectionNote:'Daily study sample; exact event is separate.' });
  ok(markers.length === 2 && new Set(markers.map(marker => marker.id)).size === 2, 'Different events on the same civil day retain distinct bookmark identities');
  ok(markers[0]?.date === '2026-03-29T00:30:00.000Z' && markers[1]?.date === '2026-03-29T01:30:00.000Z', 'Marker dates retain the exact normalized UTC instant across a DST transition');
  ok(markers.every(marker => marker.kind === 'astronomy' && marker.celestialKind), 'Astronomical marks stay distinct from traditional favorable or caution classifications');
  const localText = JSON.stringify(markers);
  ok(localText.includes('00:30') && localText.includes('02:30') && localText.includes('Europe/London'), 'Observer clock labels retain the DST jump without changing event UTC');
  const nextDay = celestialMarkers([event('2026-01-03T10:03:26.043Z','lunar-quarter',180,'Full Moon')], {timeZone:'Pacific/Kiritimati'});
  ok(nextDay[0]?.date === '2026-01-03T10:03:26.043Z' && JSON.stringify(nextDay).includes('2026-01-04'), 'An observer date can differ from the UTC event date without retiming it');
  const offset = celestialMarkers([{...first,dateISO:'2026-03-29T07:00:00+05:30'}], {timeZone:'Asia/Kolkata'});
  ok(offset[0]?.date === '2026-03-29T01:30:00.000Z', 'An explicit offset is normalized into the same exact UTC event identity');
  ok(celestialMarkers([first, {...first}], {timeZone:'UTC'}).length === 1, 'An identical exact event may be deduplicated without losing another event on its date');
  ok(celestialMarkers([{...first,kind:'religious-sighting'},{...first,dateISO:'not-an-instant'},{...first,angle:45}], {timeZone:'UTC'}).length === 0, 'Unsupported event kinds, malformed instants and nonquarter angles do not create astronomy markers');
  const poisoned = celestialMarkers([{...first,privateBirth:'PRIVATE-BIRTH-FIXTURE',latitude:'PRIVATE-LAT-FIXTURE',person:{name:'PRIVATE-PERSON-FIXTURE'},secretToken:'PRIVATE-TOKEN-FIXTURE'}], {timeZone:'UTC'});
  ok(!JSON.stringify(poisoned).includes('PRIVATE-'), 'Normalized bookmark metadata excludes unrelated private or node payload fields');

  const year = celestialEventsForRange({startISO:'2028-01-01T00:00:00Z',endISO:'2028-12-31T23:59:59.999Z',timeZone:'UTC'});
  ok(Array.isArray(year) && year.length > 50 && year.length < 64, 'A complete leap year provides bounded canonical solar and lunar quarter events');
  const solar = year.filter(item => item.kind === 'solar-quarter');
  ok(solar.length === 4 && new Set(solar.map(item => item.angle)).size === 4 && [0,90,180,270].every(angle => solar.some(item => item.angle === angle)), 'Leap-year event search returns each of the four unique solar quarters');
  ok(solar.map(item => item.label).join('|') === 'March equinox|June solstice|September equinox|December solstice', 'Season labels stay hemisphere-neutral rather than assigning universal spring or autumn');
  ok(solar.every(item => celestialEventKind(item)), 'All canonical solar quarters have a supported presentation kind');
  const start = year[3].dateISO, end = year[8].dateISO;
  const limited = celestialEventsForRange({startISO:start,endISO:end,timeZone:'UTC'});
  ok(limited.length === 6 && limited[0].dateISO === start && limited.at(-1).dateISO === end, 'Exact range endpoints are inclusive and retain both boundary events');
  ok(limited.every(item => item.dateISO >= start && item.dateISO <= end), 'A cached annual result never leaks events outside the requested exact range');
  ok(JSON.stringify(limited) === JSON.stringify(celestialEventsForRange({startISO:start,endISO:end,timeZone:'UTC'})), 'Repeated cached range requests retain deterministic event values and order');
  ok(Object.isFrozen(year) && year.every(Object.isFrozen), 'Cached canonical event arrays and records cannot be changed by a navigator consumer');
  const equinox = celestialEventsForRange({startISO:'2026-03-20T00:00:00Z',endISO:'2026-03-21T00:00:00Z',timeZone:'UTC'}).find(item => item.kind === 'solar-quarter');
  ok(equinox && Math.abs(Date.parse(equinox.dateISO)-Date.parse('2026-03-20T14:46:00Z')) < 120000, 'Numerically searched March 2026 equinox agrees with the inherited independent published fixture within two minutes');
  for (const patch of [
    {startISO:'1899-12-31T23:59:59Z'}, {endISO:'2101-01-01T00:00:00Z'},
    {startISO:'2028-01-01'}, {endISO:'invalid'}, {timeZone:'Invalid/Zone'},
    {startISO:'2028-12-31T23:59:59.999Z',endISO:'2028-01-01T00:00:00Z'},
    {startISO:'2020-01-01T00:00:00Z',endISO:'2031-01-01T00:00:00Z'},
  ]) {
    throws(() => celestialEventsForRange({startISO:'2028-01-01T00:00:00Z',endISO:'2028-12-31T23:59:59.999Z',timeZone:'UTC',...patch}), 'Invalid instant, zone or excessive supported range is rejected: '+JSON.stringify(patch));
  }
  return {pass:failures.length === 0, count, failures};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run();
  console.log(`${result.pass?'PASS':'FAIL'} celestial navigation: ${result.count} checks`);
  result.failures.forEach(failure => console.error(failure));
  process.exitCode = result.pass ? 0 : 1;
}
