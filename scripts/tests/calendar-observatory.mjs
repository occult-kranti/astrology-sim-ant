import { pathToFileURL } from 'node:url';
import { compareMoment, buildCalendarOutlook, observatoryInputFromLocal } from '../../assets/js/core/calendar-observatory.js';

export async function run() {
  const failures = []; let count = 0;
  const ok = (condition, message) => { count++; if (!condition) failures.push(message); };
  const throws = (fn, message, code) => { try { fn(); ok(false, message); } catch (error) { ok(!code || error.code === code, `${message}${code ? ` (${error.code})` : ''}`); } };
  const input = { dateISO: '2026-10-29T12:00:00Z', lat: 51.5074, lon: -.1278, timeZone: 'Europe/London' };
  const result = compareMoment(input), again = compareMoment(input);
  const row = (r, id) => r.calendars.find(c => c.id === id);
  const part = (r, id, key) => row(r, id)?.parts.find(p => p.type === key)?.value;
  ok(JSON.stringify(result) === JSON.stringify(again), 'Same explicit input is deterministic without current clock or random state');
  ok(result.context.dateISO === '2026-10-29T12:00:00.000Z' && result.context.localDate === '2026-10-29', 'Explicit UTC and observer civil date remain distinct fields');
  ok(result.calendars.length === 13 && new Set(result.calendars.map(c => c.id)).size === 13, 'Thirteen distinct named civil conventions; no duplicate Gregorian filler');
  ok(row(result, 'julian').text === '2026-10-16', 'Modern Gregorian/Julian 13-day offset independent reference');
  ok(result.calendars.every(c => c.boundary === 'civil-midnight'), 'Civil displays explicitly use midnight, including Hebrew and Islamic labels');
  ok(row(result, 'hebrew').limitations.some(t => /sunset/.test(t)), 'Hebrew religious sunset day is not inferred');
  ok(row(result, 'islamic-civil').limitations.some(t => /not a crescent/.test(t)), 'Islamic arithmetic display does not claim crescent observation');
  for (const id of ['persian', 'coptic', 'ethiopic', 'japanese', 'roc']) ok(/pending/.test(row(result, id).validation), `Added ${id} keeps independent-fixture validation pending`);
  const sourceIds = new Set(result.sources.map(s => s.id));
  ok(result.calendars.every(c => c.sourceIds.every(id => sourceIds.has(id))) && result.comparisons.every(c => c.sourceIds.every(id => sourceIds.has(id))), 'All source references resolve within the packet');
  // Hong Kong Observatory 2026 official conversion table: 17 February = lunar 1/1.
  const chinese = compareMoment({ ...input, dateISO: '2026-02-17T04:00:00Z', lat: 22.3, lon: 114.17, timeZone: 'Asia/Hong_Kong' });
  ok(part(chinese, 'chinese', 'day') === '1' && /First|1/.test(part(chinese, 'chinese', 'month')) && part(chinese, 'chinese', 'relatedYear') === '2026', 'HKO independently originated Chinese New Year fixture survives composition');
  // Hebcal HDate reference: 13 November 2008 = 15 Cheshvan 5769.
  const hebrew = compareMoment({ ...input, dateISO: '2008-11-13T12:00:00Z' });
  ok(part(hebrew, 'hebrew', 'day') === '15' && part(hebrew, 'hebrew', 'year') === '5769', 'Hebcal independently originated date fixture survives composition');
  // March 2026 equinox from the USNO seasonal convention (Sun at Aries origin).
  const equinox = compareMoment({ ...input, dateISO: '2026-03-20T14:46:00Z' });
  ok(Math.min(equinox.astronomy.sunLongitude, 360 - equinox.astronomy.sunLongitude) < .03, 'Published 2026 March equinox Sun near tropical Aries origin');
  ok(Math.abs(((result.western.sun.longitude - result.vedic.sun.longitude + 360) % 360) - result.vedic.ayanamsha.degrees) < .0001, 'Tropical/sidereal difference is the reported ayanamsha, not two independent skies');
  ok(result.astronomy.moonIlluminatedFraction >= 0 && result.astronomy.moonIlluminatedFraction <= 1, 'Physical Moon illumination remains bounded');
  ok(Math.floor(result.astronomy.moonSunElongation / 12) + 1 === result.vedic.panchanga.tithi.num, 'Tithi and elongation share their disclosed mathematical dependency');
  ok(result.vedic.traditionalScreens.kind === 'traditional-rule' && Object.values(result.vedic.traditionalScreens.limbs).every(x => x.cite), 'Existing quality screens preserve their actual source citations and interpretive type');
  ok(result.vedic.traditionalScreens.limitations.some(t => /not timed/.test(t)), 'Opening-ghati quality rules do not invent interval boundaries');
  const parigha = compareMoment({ ...input, lat: 28.6139, lon: 77.209, timeZone: 'Asia/Kolkata' });
  const parighaYoga = parigha.vedic.traditionalScreens.limbs.yoga;
  ok(parigha.vedic.panchanga.yoga.name === 'Parigha' && parighaYoga.ruleVerdict === 'avoid', 'Delhi 2026-10-29 retains the historical Parigha opening-portion rule as classification metadata');
  ok(parighaYoga.applicableAtInstant === null && parighaYoga.applicability === 'timing-unresolved' && parighaYoga.verdict === null, 'Untimed Parigha never produces an active avoid verdict at the selected instant');
  ok(Object.values(parigha.vedic.traditionalScreens.limbs).every(limb => limb.kind === 'traditional-classification' && limb.verdict === null && limb.applicableAtInstant === null), 'Every new symbolic quality is classified, never an active outcome verdict');
  ok(Object.values(parigha.vedic.traditionalScreens.limbs).every(limb => /secondary/.test(limb.sourceStatus) && /pending/.test(limb.sourceStatus)), 'Every quality exposes its modern secondary-source status and pending primary-passage verification');
  ok(parigha.vedic.traditionalScreens.sourceProvenance.primaryPassageVerification === 'pending', 'Structured source provenance does not imply verified primary-text rules');
  const wholeYoga = compareMoment({ ...input, dateISO: '2026-10-27T12:00:00Z' }).vedic.traditionalScreens.limbs.yoga;
  ok(wholeYoga.class === 'mahā-doṣa (whole duration)' && wholeYoga.applicability === 'classification-only' && wholeYoga.verdict === null, 'A whole-duration historical rule also remains classification-only, not a personal or active outcome judgment');

  ok(result.planetaryHours.status === 'available' && Date.parse(result.planetaryHours.currentStartISO) <= Date.parse(result.context.dateISO) && Date.parse(result.planetaryHours.currentEndISO) > Date.parse(result.context.dateISO), 'Reported temporal hour actually encloses requested instant');
  const sunrise = Date.parse(result.planetaryHours.sunrise);
  const before = compareMoment({ ...input, dateISO: new Date(sunrise - 1000).toISOString() });
  const after = compareMoment({ ...input, dateISO: new Date(sunrise + 1000).toISOString() });
  ok(before.planetaryHours.dayRuler !== after.planetaryHours.dayRuler && after.planetaryHours.hourNumber === 1, 'Sunrise boundary changes the planetary day, unlike midnight civil date');
  ok(before.context.localDate === after.context.localDate, 'Sunrise boundary comparison preserves the same civil date');
  const west = compareMoment({ ...input, lat: 40.71, lon: -74, timeZone: 'America/New_York' });
  ok(west.astronomy.sunLongitude === result.astronomy.sunLongitude && west.astronomy.moonLongitude === result.astronomy.moonLongitude, 'Geocentric sky is location invariant at one instant');
  ok(west.western.ascendant.longitude !== result.western.ascendant.longitude && west.prayer.times.find(x => x.name === 'dhuhr').instant !== result.prayer.times.find(x => x.name === 'dhuhr').instant, 'Houses and local prayer schedule respond to observer position');
  const pole = compareMoment({ ...input, dateISO: '2026-06-21T12:00:00Z', lat: 89, lon: 0, timeZone: 'UTC' });
  ok(pole.planetaryHours.status === 'unavailable' && pole.vedic.panchanga.vara.name === 'Unavailable', 'Polar interval and vara unavailability survive composition without substituted rulers');
  ok(pole.prayer.status !== 'available' && pole.prayer.times.some(t => !t.available), 'Unresolved polar prayer events remain unavailable/partial');
  const kiritimati = compareMoment({ ...input, dateISO: '2026-10-02T12:00:00Z', lat: 1.87, lon: -157.4, timeZone: 'Pacific/Kiritimati' });
  ok(kiritimati.context.localDate === '2026-10-03' && kiritimati.prayer.times.every(t => !t.available || t.localDate === '2026-10-03'), 'Date-line prayer schedule follows requested observer date, not UTC date');
  throws(() => compareMoment({ ...input, dateISO: '2026-02-30T12:00:00Z' }), 'Impossible civil date rejected instead of normalized');
  throws(() => compareMoment({ ...input, dateISO: '2026-10-29T12:00:00' }), 'Implicit-zone datetime rejected');
  throws(() => compareMoment({ ...input, dateISO: '1899-12-31T23:59:59Z' }), 'Out-of-range UTC date rejected');
  throws(() => compareMoment({ ...input, timeZone: undefined }), 'Missing observer zone rejected instead of inferred');
  throws(() => compareMoment({ ...input, timeZone: 'Not/AZone' }), 'Invalid IANA zone rejected');
  throws(() => compareMoment({ ...input, lat: 91 }), 'Invalid location rejected');
  throws(() => compareMoment({ ...input, prayerMethod: 'unknown' }), 'Invalid prayer method rejected as invalid input');
  throws(() => compareMoment({ ...input, asr: 'invented' }), 'Invalid Asr choice rejected');
  throws(() => compareMoment({ ...input, timeKnown: false }), 'Unknown birth time not converted into a moment reading');
  const newYork = { ...input, dateISO: '2026-03-07T17:00:00Z', lat: 40.71, lon: -74, timeZone: 'America/New_York' };
  const dst = buildCalendarOutlook({ ...newYork, startDate: '2026-03-07', days: 3 });
  ok(dst.rows.every(r => r.status === 'available' && r.snapshot.context.localTime === '12:00:00'), 'Daily samples retain local noon across spring DST');
  ok(Date.parse(dst.rows[1].dateISO) - Date.parse(dst.rows[0].dateISO) === 23 * 3600000, 'Spring local-noon interval is 23 hours, not a fixed 24-hour increment');
  const autumn = buildCalendarOutlook({ ...newYork, startDate: '2026-10-31', days: 3 });
  ok(Date.parse(autumn.rows[1].dateISO) - Date.parse(autumn.rows[0].dateISO) === 25 * 3600000, 'Autumn local-noon interval is 25 hours');
  const gap = buildCalendarOutlook({ ...newYork, startDate: '2026-03-08', sampleTime: '02:30', days: 1 });
  ok(gap.rows[0].status === 'unavailable' && gap.rows[0].code === 'NONEXISTENT_TIME', 'Outlook DST gap stays explicitly unavailable');
  const fold = buildCalendarOutlook({ ...newYork, startDate: '2026-11-01', sampleTime: '01:30', days: 1 });
  ok(fold.rows[0].status === 'unavailable' && fold.rows[0].code === 'AMBIGUOUS_TIME', 'Outlook repeated clock requires explicit occurrence');
  const earlier = observatoryInputFromLocal({ date: '2026-11-01', time: '01:30', timeZone: 'America/New_York', disambiguation: 'earlier', lat: 40.71, lon: -74 });
  const later = observatoryInputFromLocal({ date: '2026-11-01', time: '01:30', timeZone: 'America/New_York', disambiguation: 'later', lat: 40.71, lon: -74 });
  ok(Date.parse(later.dateISO) - Date.parse(earlier.dateISO) === 3600000, 'Explicit repeated-clock choices produce distinct one-hour-separated instants');
  const apia = buildCalendarOutlook({ ...input, dateISO: '2011-12-29T12:00:00Z', lat: -13.83, lon: -171.75, timeZone: 'Pacific/Apia', startDate: '2011-12-29', days: 3 });
  ok(apia.rows[0].status === 'available' && apia.rows[1].localDate === '2011-12-30' && apia.rows[1].status === 'unavailable' && apia.rows[2].status === 'available', 'Skipped Samoa civil date retained as unavailable, neighboring dates calculated');
  const full = buildCalendarOutlook({ ...input, days: 14, startDate: '2026-10-26' });
  ok(full.rows.length === 14 && full.rows[0].localDate === '2026-10-26' && full.rows[13].localDate === '2026-11-08', 'Explicit Monday yields this and next calendar-week dates');
  ok(full.rows.slice(0, 7).every(r => r.weekIndex === 0) && full.rows.slice(7).every(r => r.weekIndex === 1), 'Seven-day group membership remains stable');
  ok(JSON.stringify(full).length < 1500000 && JSON.parse(JSON.stringify(full)).rows[0].snapshot.context.dateISO === full.rows[0].dateISO, 'Fourteen-day result is serializable and below MCP bound');
  throws(() => buildCalendarOutlook({ ...input, days: 15 }), 'Unbounded outlook request rejected');
  throws(() => buildCalendarOutlook({ ...input, days: 0 }), 'Empty outlook request rejected');
  throws(() => buildCalendarOutlook({ ...input, startDate: '2100-12-25', days: 14 }), 'Partial out-of-range 2101 outlook rejected visibly');
  const tz = process.env.TZ;
  try {
    process.env.TZ = 'UTC'; const utc = JSON.stringify(compareMoment(input));
    process.env.TZ = 'Pacific/Honolulu'; const honolulu = JSON.stringify(compareMoment(input));
    ok(utc === honolulu, 'Comparison is invariant to host/device timezone');
  } finally { if (tz === undefined) delete process.env.TZ; else process.env.TZ = tz; }
  ok(result.unimplemented.length >= 5 && !result.unimplemented.some(t => result.calendars.some(c => c.id === t.id)), 'Unimplemented regional/religious traditions remain separate from calculated rows');
  return { pass: failures.length === 0, failures, count };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} calendar observatory: ${result.count} checks`);
  result.failures.forEach(f => console.error(f)); process.exitCode = result.pass ? 0 : 1;
}
