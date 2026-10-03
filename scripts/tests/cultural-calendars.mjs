import { pathToFileURL } from 'node:url';
import { CALENDARS, civilToJD, fromJD, formatCivil, parseCivil, utcInstant, calendarSupported, calendarAtInstant, easter, qibla, KAABA, prayerTimes } from '../../assets/js/core/cultural-calendars.js';

export async function run() {
  const failures = []; let count = 0;
  const ok = (condition, message) => { count++; if (!condition) failures.push(message); };
  const throws = (fn, message) => { try { fn(); ok(false, message); } catch { ok(true, message); } };
  const part = (result, type) => result.parts?.find(p => p.type === type)?.value;
  // USNO calendar chapter, https://aa.usno.navy.mil/downloads/c15_usb_online.pdf
  ok(civilToJD('2000-01-01', 'gregorian', 12) === 2451545, 'J2000 noon JD 2451545');
  ok(civilToJD('2000-01-01') === 2451544.5, 'JD begins at noon, midnight half-day offset');
  ok(formatCivil(fromJD(civilToJD('1582-10-15')).julian) === '1582-10-05', '1582 Gregorian/Julian independent reform fixture');
  ok(formatCivil(fromJD(civilToJD('1752-09-02', 'julian')).gregorian) === '1752-09-13', 'British reform eve Julian 2 Sep = Gregorian 13 Sep');
  ok(civilToJD('1858-11-17') === 2400000.5, 'MJD epoch USNO reference');
  ok(formatCivil(fromJD(civilToJD('0622-07-16', 'julian')).gregorian) === '0622-07-19', 'USNO Islamic civil epoch: Julian 16 July 622');
  throws(() => parseCivil('1900-02-29'), 'Gregorian 1900 not leap');
  throws(() => parseCivil('2100-02-29'), 'Gregorian 2100 not leap');
  ok(parseCivil('1900-02-29', 'julian').d === 29 && parseCivil('2000-02-29').d === 29, 'Julian century / Gregorian 400-year leap days');
  throws(() => parseCivil('2026-02-30'), 'Invalid civil date rejected');
  throws(() => civilToJD('2000-01-01', 'gregorian', 24), '24:00 not silently shifted');
  throws(() => fromJD(NaN), 'Invalid Julian day rejected');
  throws(() => utcInstant('2026-10-03', '12:99'), 'Invalid minutes rejected');
  ok(utcInstant('0099-01-01', '00:00').getUTCFullYear() === 99, 'Year 99 not remapped to 1999');
  // USNO Easter worked examples: https://aa.usno.navy.mil/faq/easter
  for (const [year, expected] of [[2010,'2010-04-04'],[1962,'1962-04-22'],[1954,'1954-04-18']]) ok(formatCivil(easter(year).gregorian) === expected, `USNO Gregorian Easter ${year}`);
  ok(formatCivil(easter(2010, 'julian').gregorian) === '2010-04-04', '2010 Julian and Gregorian Easter coincide');
  ok(formatCivil(easter(2026, 'julian').native) === '2026-03-30', 'Julian computus date preserves own calendar label');
  throws(() => easter(1200), 'Unsupported computus range rejected');
  throws(() => easter(2026, 'universal'), 'Unknown computus method rejected');
  // Hebcal primary examples: hebcal.github.io/api/hdate and converter?gd=3&gm=10&gy=2026&g2h=1
  if (calendarSupported('hebrew')) {
    const old = calendarAtInstant(utcInstant('2008-11-13'), 'hebrew');
    ok(part(old,'day') === '15' && part(old,'year') === '5769' && /[Cc]heshvan|[Hh]eshvan/.test(part(old,'month')), 'Hebcal 15 Cheshvan 5769 fixture');
    const current = calendarAtInstant(utcInstant('2026-10-03'), 'hebrew');
    ok(part(current,'day') === '22' && part(current,'year') === '5787' && /Tish/.test(part(current,'month')), 'Hebcal 22 Tishrei 5787 fixture');
  } else ok(false, 'Verification runtime must support Hebrew for independent fixtures');
  // HKO official Gregorian/Lunar conversion table 2026: 17 February = first lunar day/month.
  if (calendarSupported('chinese')) {
    const lunar = calendarAtInstant(utcInstant('2026-02-17', '04:00'), 'chinese', 'Asia/Shanghai');
    ok(part(lunar,'day') === '1' && /First|1/.test(part(lunar,'month')) && part(lunar,'relatedYear') === '2026', 'HKO Chinese New Year 2026');
  } else ok(false, 'Verification runtime must support Chinese for independent fixtures');
  const buddhist = calendarAtInstant(utcInstant('2026-10-03'), 'buddhist');
  ok(part(buddhist,'year') === '2569', 'Modern Thai Buddhist civil year +543');
  const saka = calendarAtInstant(utcInstant('2024-03-21'), 'indian');
  ok(part(saka,'year') === '1946' && part(saka,'day') === '1', 'Indian national Saka leap-year new year');
  ok(CALENDARS.every(c => typeof calendarSupported(c.id) === 'boolean'), 'Calendar support is detected explicitly');
  ok(!calendarSupported('made-up-calendar'), 'Silent Intl fallback detected');
  throws(() => calendarAtInstant(new Date(), 'hebrew', 'Not/AZone'), 'Invalid IANA zone rejected');
  const west = calendarAtInstant(utcInstant('2026-10-03', '01:00'), 'hebrew', 'America/Los_Angeles');
  ok(part(west,'day') === '21', 'Civil-day display follows selected zone across midnight');
  // Independent Qibla regression values from Adhan source tests, not this implementation.
  // https://github.com/batoulapps/adhan-js/blob/a2c4bda71352f43355b23448c6329df150ca0ec3/test/qibla.test.ts
  for (const [lat,lon,bearing] of [[51.5074,-0.1278,118.987],[40.7128,-74.0059,58.4817],[-33.8688,151.2093,277.4996]]) ok(Math.abs(qibla(lat,lon).bearing-bearing) < .001, `Qibla published fixture ${lat},${lon}`);
  ok(!qibla(KAABA.latitude,KAABA.longitude).available, 'Qibla at Kaaba unavailable');
  ok(!qibla(-KAABA.latitude, KAABA.longitude-180).available, 'Qibla antipode unavailable');
  ok(!qibla(90, 0).available, 'Qibla pole unavailable');
  throws(() => qibla(NaN, 0), 'Invalid coordinates rejected');
  // Independently originated published-table transcription RETAINED UPSTREAM.
  // Ankara January/June 2019, Yeni Safak URL no longer retrievable in this execution.
  // https://github.com/batoulapps/adhan-js/blob/a2c4bda71352f43355b23448c6329df150ca0ec3/Shared/Times/Ankara-Turkey.json
  const ankara = { latitude:39.939382, longitude:32.819713, timeZone:'Europe/Istanbul', method:'Turkey', asr:'Shafi', highLatitude:'MiddleOfTheNight' };
  const minutes = value => value.split(':').reduce((hours, minute) => hours * 60 + +minute, 0);
  for (const [date, expected] of [['2019-01-01',['06:33','08:03','12:57','15:20','17:40','19:05']],['2019-06-01',['03:24','05:15','12:51','16:48','20:17','22:00']]]) {
    const result = prayerTimes({ ...ankara, date });
    result.times.forEach((time,i) => ok(time.available && Math.abs(minutes(time.text)-minutes(expected[i])) <= 2, `Published Ankara ${date} ${time.name} within 2 minutes: ${time.text}`));
  }
  const polar = prayerTimes({ date:'2026-06-21', latitude:69.6492, longitude:18.9553, timeZone:'Europe/Oslo' });
  ok(!polar.complete && polar.times.some(t => !t.available && t.instant === null), 'Polar summer unavailable events, never fabricated midnight');
  const fixed = { date:'2026-10-03', latitude:21.4, longitude:39.8, timeZone:'Asia/Riyadh', method:'UmmAlQura' };
  ok(prayerTimes({...fixed,ishaAdjustment:30}).times[5].instant-prayerTimes(fixed).times[5].instant === 1800000, 'Explicit Isha adjustment exactly 30 minutes');
  const standard = prayerTimes({...ankara,date:'2019-01-01'}), hanafi = prayerTimes({...ankara,date:'2019-01-01',asr:'Hanafi'});
  ok(hanafi.times[3].instant > standard.times[3].instant, 'Hanafi Asr later than standard at reference location');
  const dateline = prayerTimes({date:'2026-10-03',latitude:1.8721,longitude:-157.4278,timeZone:'Pacific/Kiritimati'});
  ok(dateline.times[2].localDate === '2026-10-03', 'Date-line solar day maps to requested Kiritimati civil date');
  const apia = prayerTimes({date:'2026-10-03',latitude:-13.83,longitude:-171.75,timeZone:'Pacific/Apia'});
  ok(apia.times.every(t => t.localDate === '2026-10-03'), 'All Apia 2026-10-03 prayer events use requested civil date');
  throws(() => prayerTimes({date:'2011-12-30',latitude:-13.833,longitude:-171.75,timeZone:'Pacific/Apia'}), 'Samoa skipped civil date rejected');
  throws(() => prayerTimes({...ankara,date:'2019-01-01',method:'Unknown'}), 'Unknown prayer method rejected');
  throws(() => prayerTimes({...ankara,date:'2019-01-01',latitude:NaN}), 'Invalid prayer location rejected');
  const originalZone = process.env.TZ;
  try {
    const inZone = zone => { process.env.TZ = zone; return JSON.stringify(prayerTimes({...ankara,date:'2019-06-01'}).times); };
    ok(inZone('UTC') === inZone('Pacific/Honolulu') && inZone('UTC') === inZone('Pacific/Apia'), 'Prayer instants invariant across UTC/Honolulu/Apia device zones');
  } finally { if (originalZone === undefined) delete process.env.TZ; else process.env.TZ = originalZone; }
  return { pass: failures.length === 0, failures, count };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} cultural calendars: ${result.count} checks`);
  result.failures.forEach(failure => console.error(failure)); process.exitCode = result.pass ? 0 : 1;
}
