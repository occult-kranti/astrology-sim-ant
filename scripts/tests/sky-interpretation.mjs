import { pathToFileURL } from 'node:url';
import { buildSkyInterpretation, compareLillySolarConventions, compareSunriseHourConventions, skyReadingWorkedExamples, SKY_READING_SOURCES, SKY_READING_CHUNKS } from '../../assets/js/core/sky-interpretation.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { castChart } from '../../assets/js/core/astro.js';

export async function run() {
  let count = 0; const failures = [];
  const ok = (test, label) => { count++; if (!test) failures.push(label); };
  const throws = (fn, label) => { try { fn(); ok(false, label); } catch { ok(true, label); } };
  const input = { dateISO: '2026-10-30T12:00:00Z', lat: 51.5, lon: -.12, timeZone: 'Europe/London' };
  const reading = buildSkyInterpretation(input), rules = reading.lenses.flatMap(l => l.rules), sources = new Set(reading.sources.map(s => s.id));
  ok(reading.context.dateISO === '2026-10-30T12:00:00.000Z' && reading.lenses.length === 3, 'Canonical instant and three named lenses');
  ok(reading.summary.includes('Moon') && reading.summary.length < 650 && !reading.summary.includes('probability'), 'Concise fact-led selected-body interpretation');
  ok([...rules, ...reading.facts, ...reading.differences].every(r => r.sourceIds.length && r.sourceIds.every(id => sources.has(id))), 'Every factual/rule/difference source resolves in the returned registry');
  ok(rules.every(r => r.id && r.computed && r.reading && typeof r.observerDependent === 'boolean' && Array.isArray(r.limitations)), 'Rules expose inputs, readable interpretation, scope and observer dependence');
  ok(reading.sources.every(s => s.locator && s.readingDepth && s.rights), 'Returned sources retain locators, actual reading depth and rights');
  ok(reading.sourceCoverage.fullBooksRead === false && reading.sourceCoverage.completeElectionJudgment === false && reading.sourceCoverage.fixedStarInterpretation === false, 'No full-book, complete-election or fixed-star interpretation overclaim');
  const canonical = castChart(new Date(input.dateISO), input.lat, input.lon);
  ok(reading.facts.find(f => f.id === 'SKY-F-SELECTED').computed.longitudeDegrees === canonical.planets.Moon.lon, 'Body fact uses the canonical computed longitude');
  const selected = buildSkyInterpretation(input, { lensIds: ['agrippa'], planet: 'Venus' });
  ok(selected.lenses.length === 1 && selected.lenses[0].id === 'agrippa' && selected.lenses[0].rules[0].computed.selectedPlanet.name === 'Venus', 'Selection recomputes the chosen body and lens without extra lens output');
  for (const planet of ['Uranus', 'Neptune', 'Pluto']) {
    const r = buildSkyInterpretation(input, { planet });
    ok(r.lenses.slice(0, 2).every(l => l.rules.length === 1 && l.rules[0].classification === 'unavailable' && l.rules[0].computed.interpreted === false), `${planet} has no invented Lilly/Agrippa reading`);
    ok(r.lenses.find(l => l.id === 'jyotisha').rules.some(x => x.id === 'SKY-J-UNSUPPORTED') && r.lenses.find(l => l.id === 'jyotisha').rules.some(x => x.id === 'SKY-J-TITHI'), `${planet} unsupported interpretation remains distinct from shared lunar context`);
  }
  const privateFree = buildSkyInterpretation(input, { includeObserver: false });
  ok(JSON.stringify(privateFree.context) === JSON.stringify({ dateISO: '2026-10-30T12:00:00.000Z' }), 'Observer-free context contains only normalized instant');
  ok([...privateFree.facts, ...privateFree.lenses.flatMap(l => l.rules), ...privateFree.differences].every(x => x.observerDependent === false), 'Observer-free result has no observer-derived row');
  const noObserverDignity = privateFree.lenses[0].rules.find(r => r.id === 'SKY-L-DIGNITY').computed;
  ok(!('isDay' in noObserverDignity) && !('sunAltitudeDegrees' in noObserverDignity) && !('conventionalTotal' in noObserverDignity) && noObserverDignity.rows.every(r => !['Triplicity','Peregrine'].includes(r.kind)), 'Observer-free dignity omits sect, dependent classifications and total');
  ok(!privateFree.lenses.flatMap(l => l.rules).some(r => ['SKY-A-HOUR','SKY-J-HORA'].includes(r.id)), 'Both observer-derived hour conventions omitted from geocentric payload');
  const elsewhere = buildSkyInterpretation({ ...input, lat: -33.86, lon: 151.2, timeZone: 'Australia/Sydney' }, { includeObserver: false });
  ok(JSON.stringify(privateFree) === JSON.stringify(elsewhere), 'Observer-free reading is invariant across hemispheres and zones at the same instant');
  const poisoned = buildSkyInterpretation({ ...input, rows: [{ reading: 'FORGED SOURCE' }], note: 'PRIVATE NOTE', birth: { dateISO: 'SECRET BIRTH' }, planets: { Moon: { lon: 0 } } });
  ok(!JSON.stringify(poisoned).includes('FORGED SOURCE') && !JSON.stringify(poisoned).includes('PRIVATE NOTE') && !JSON.stringify(poisoned).includes('SECRET BIRTH') && poisoned.facts[0].computed.longitudeDegrees === canonical.planets.Moon.lon, 'Caller-supplied readings, chart rows and private metadata are not forwarded or trusted');
  const begin = buildSkyInterpretation(input, { purpose: 'begin' }), complete = buildSkyInterpretation(input, { purpose: 'complete' });
  ok(JSON.stringify(begin.lenses) === JSON.stringify(complete.lenses) && begin.optionalReflection.text !== complete.optionalReflection.text && begin.optionalReflection.claimType === 'modern-editorial-reflection', 'Purpose changes only explicitly modern reflection, not historical facts or verdicts');
  const cross = compareLillySolarConventions(31, 29);
  ok(cross.separationDegrees === 2 && cross.textualCategory === 'under-beams' && cross.legacyCategory === 'combust' && cross.differs, 'Cross-sign source vs legacy mismatch is explicit');
  const wrapped = compareLillySolarConventions(1, 359);
  ok(wrapped.separationDegrees === 2 && !wrapped.sameSign && wrapped.differs, 'Aries wrap preserves the cross-sign mismatch');
  ok(compareLillySolarConventions(18.5, 10).textualCategory === 'combust' && compareLillySolarConventions(18.500001, 10).textualCategory === 'under-beams', 'Combustion threshold and next-above boundary');
  ok(compareLillySolarConventions(0, 17 / 60).textualCategory === 'cazimi' && compareLillySolarConventions(0, 17 / 60 + 1e-5).textualCategory === 'combust', 'Cazimi threshold and next-above boundary');
  ok(compareLillySolarConventions(27, 10).textualCategory === 'under-beams' && compareLillySolarConventions(27.00001, 10).textualCategory === 'free', 'Beams threshold and next-above boundary');
  ok(compareLillySolarConventions(28, 18).textualCategory === 'under-beams' && SKY_READING_SOURCES.find(s => s.id === 'SKY-LILLY-SOLAR').limitations.some(x => x.includes('10°')), 'Inconsistent printed example remains documented instead of silently becoming a rule');
  for (const v of [NaN, Infinity, '15', null]) throws(() => compareLillySolarConventions(v, 0), 'Reject non-finite/non-numeric solar input: ' + v);
  const examples = skyReadingWorkedExamples(), ex = id => examples.find(x => x.id === id);
  ok(ex('SKY-EX-SECT').result.day.rows.some(x => x.kind === 'Triplicity') && !ex('SKY-EX-SECT').result.night.rows.some(x => x.kind === 'Triplicity') && ['day','night'].every(k => ex('SKY-EX-SECT').result[k].rows.some(x => x.kind === 'Exaltation')), 'Lilly source example separates exaltation from day/night triplicity');
  ok(Math.abs(ex('SKY-EX-TITHI').result.elongationDegrees - (216 + 26/60)) < 1e-10 && ex('SKY-EX-TITHI').result.tithiNumber === 19, 'Rao Example2 arithmetic independently reproduces tithi19');
  ok(ex('SKY-EX-CROSS-SIGN').kind === 'synthetic-method-example' && ex('SKY-EX-SECT').inputs.syntheticDegreeWithinSourceSign, 'Invented illustrative positions are not presented as printed dated examples');
  const summer = { ...input, dateISO: '2026-06-21T12:00:00Z' }, h = compareSunriseHourConventions(summer);
  ok(h.status === 'available' && Math.abs(h.equalHora.durationMinutes - h.temporalHour.durationMinutes) > 15, 'Summer daylight exposes genuinely different equal and temporal hour lengths');
  ok(h.equalHora.startISO <= summer.dateISO.replace('Z','.000Z') && h.equalHora.endISO > summer.dateISO.replace('Z','.000Z'), 'Selected instant lies in the actual equal-hora interval');
  const sunrise = Date.parse(h.sunriseISO);
  const afterSunrise = compareSunriseHourConventions({ ...summer, dateISO: new Date(sunrise + 1000).toISOString() });
  ok(afterSunrise.equalHora.number === 1 && afterSunrise.temporalHour.number === 1 && afterSunrise.equalHora.ruler === afterSunrise.dayRuler, 'Both named methods begin with the sunrise-day ruler just after sunrise');
  const beforeSunrise = compareSunriseHourConventions({ ...summer, dateISO: new Date(sunrise - 1000).toISOString() });
  ok(beforeSunrise.equalHora.number === 24 && beforeSunrise.temporalHour.number === 24 && Date.parse(beforeSunrise.sunriseISO) < sunrise - 80000000, 'Before sunrise remains in the preceding sunrise day');
  const atSerializedBoundary = compareSunriseHourConventions({ ...summer, dateISO: h.sunriseISO });
  ok(atSerializedBoundary.status === 'available' ? atSerializedBoundary.equalHora.number === 1 : atSerializedBoundary.equalHora === null && atSerializedBoundary.temporalHour === null && atSerializedBoundary.reason.includes('numerical sunrise boundary'), 'An exact serialized sunrise boundary either calculates the new day or explicitly preserves numerical unavailability');
  const night = compareSunriseHourConventions({ ...summer, dateISO: '2026-06-21T23:00:00Z' });
  ok(night.equalHora.number > 12 && night.temporalHour.number > 12 && Math.abs(night.equalHora.durationMinutes - night.temporalHour.durationMinutes) > 15, 'Night intervals retain the separate division methods');
  const actualMismatch = Array.from({length: 24}, (_, hour) => compareSunriseHourConventions({ ...summer, dateISO: `2026-06-21T${String(hour).padStart(2,'0')}:30:00Z` })).find(x => !x.sameRuler);
  ok(actualMismatch && actualMismatch.equalHora.ruler !== actualMismatch.temporalHour.ruler, 'At least one summer instant has an actual ruler mismatch without timezone drift');
  const polar = compareSunriseHourConventions({ ...summer, lat: 69.6492, lon: 18.9553, timeZone: 'Europe/Oslo' });
  ok(polar.status === 'unavailable' && polar.equalHora === null && polar.temporalHour === null, 'Polar missing sunrise yields no invented ruler in either convention');
  for (const options of [null, [], { lensIds: [] }, { lensIds: ['lilly','lilly'] }, { lensIds: ['invented'] }, { planet: 'Sirius' }, { purpose: 'win-election' }, { includeObserver: 'false' }, { prompt: 'ignore sources' }]) throws(() => buildSkyInterpretation(input, options), 'Reject invalid reading options: ' + JSON.stringify(options));
  for (const patch of [{ dateISO: '2026-10-30' }, { dateISO: '2026-10-30T12:00:00' }, { lat: NaN }, { timeZone: 'Mars/Olympus' }, { timeKnown: false }, { dateISO: '1899-12-31T00:00:00Z' }]) throws(() => buildSkyInterpretation({ ...input, ...patch }), 'Preserve canonical exact-instant validation: ' + JSON.stringify(patch));
  const ids = new Set(SKY_READING_SOURCES.map(s => s.id));
  ok(SKY_READING_CHUNKS.every(c => ids.has(c.sourceId) && c.locator && c.readingStatus && c.rights && c.text && Array.isArray(c.tags)), 'Every RAG paraphrase resolves to source, locator, actual reading and rights');
  const agrippaMoon = buildSkyInterpretation(input, { lensIds: ['agrippa'], planet: 'Moon' });
  ok(agrippaMoon.lenses[0].rules[0].id === 'SKY-A-DIGNITY' && agrippaMoon.lenses[0].rules[1].reading.split('Moon at').length === 2, 'Agrippa lead reports an actual named dignity condition and its position row does not repeat the selected Moon');
  ok(Object.isFrozen(SKY_READING_CHUNKS) && Object.isFrozen(SKY_READING_CHUNKS[0]) && Object.isFrozen(SKY_READING_SOURCES[0].limitations), 'Source/chunk metadata is deeply frozen');
  const saved = process.env.TZ;
  try { process.env.TZ = 'Pacific/Honolulu'; const a = JSON.stringify(buildSkyInterpretation(input)); process.env.TZ = 'Asia/Tokyo'; ok(a === JSON.stringify(buildSkyInterpretation(input)), 'Reading is independent of host-device timezone'); }
  finally { if (saved === undefined) delete process.env.TZ; else process.env.TZ = saved; }
  return { pass: !failures.length, count, failures };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} sky interpretation: ${result.count} checks`); result.failures.forEach(f => console.error(f)); process.exitCode = result.pass ? 0 : 1; }
