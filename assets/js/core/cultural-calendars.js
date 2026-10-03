// Calendar/date-only arithmetic stays separate from an observer's UTC instant.
import { gregorianToJDN, julianToJDN, jdnToGregorian, jdnToJulian, utcDate, isoDate } from './calendar.js';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab, HighLatitudeRule, PolarCircleResolution } from '../../vendor/adhan/Adhan.js';

export const CALENDARS = [
  { id: 'hebrew', label: 'Hebrew civil date', note: 'Civil midnight boundary; religious days begin at local sunset. Observances and Israel/diaspora rules are not inferred.' },
  { id: 'islamic-civil', label: 'Islamic tabular civil', note: 'Arithmetic civil calendar; not a crescent-sighting determination. Religious days begin at local sunset.' },
  { id: 'islamic-umalqura', label: 'Islamic Umm al-Qura', note: 'Browser Umm al-Qura data; local religious authorities and observed crescents can differ.' },
  { id: 'chinese', label: 'Chinese lunisolar civil', note: 'Chinese calendar convention, preserving leap-month names. Not a universal East Asian calendar.' },
  { id: 'buddhist', label: 'Thai Buddhist civil', note: 'Modern Thai civil era; not a Buddhist observance calendar.' },
  { id: 'indian', label: 'Indian national Saka', note: 'Indian national solar calendar; not a regional Hindu lunar calendar.' },
];
export const PRAYER_METHODS = [
  ['MuslimWorldLeague', 'Muslim World League · 18° / 17°'],
  ['NorthAmerica', 'ISNA / North America · 15° / 15°'],
  ['Egyptian', 'Egyptian · 19.5° / 17.5°'],
  ['Karachi', 'Karachi · 18° / 18°'],
  ['UmmAlQura', 'Umm al-Qura · 18.5° / 90 minutes'],
  ['MoonsightingCommittee', 'Moonsighting Committee · seasonal twilight'],
  ['Turkey', 'Turkey · 18° / 17° + method adjustments'],
];

export function validateCivil(y, m, d, calendar = 'gregorian') {
  if (!['gregorian', 'julian'].includes(calendar)) throw new RangeError('Choose Gregorian or Julian.');
  if (![y, m, d].every(Number.isInteger) || y < 1 || y > 9999 || m < 1 || m > 12) throw new RangeError('Enter a year from 1 to 9999 and a month from 1 to 12.');
  const leap = y % 4 === 0 && (calendar === 'julian' || y % 100 !== 0 || y % 400 === 0);
  if (d < 1 || d > [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]) throw new RangeError('This day does not exist in the selected calendar.');
  return { y, m, d };
}
export function parseCivil(value, calendar = 'gregorian') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (!match) throw new RangeError('Enter a complete date as YYYY-MM-DD.');
  return validateCivil(...match.slice(1).map(Number), calendar);
}
export function civilToJD(value, calendar = 'gregorian', utcHours = 0) {
  const { y, m, d } = typeof value === 'string' ? parseCivil(value, calendar) : validateCivil(value.y, value.m, value.d, calendar);
  if (!Number.isFinite(utcHours) || utcHours < 0 || utcHours >= 24) throw new RangeError('UTC hour must be from 0 up to, but not including, 24.');
  return (calendar === 'gregorian' ? gregorianToJDN(y, m, d) : julianToJDN(y, m, d)) - 0.5 + utcHours / 24;
}
export function fromJD(jd) {
  if (!Number.isFinite(jd) || jd < 1721425.5 || jd >= 5373484.5) throw new RangeError('Julian day must map to Gregorian years 1–9999.');
  const jdn = Math.floor(jd + 0.5);
  return { jd, jdn, gregorian: jdnToGregorian(jdn), julian: jdnToJulian(jdn), utcHours: ((jd + 0.5) - jdn) * 24 };
}
export const formatCivil = ({ y, m, d }) => isoDate(y, m, d);
export function utcInstant(dateValue, timeValue = '12:00') {
  const { y, m, d } = parseCivil(dateValue);
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(timeValue));
  if (!match || +match[1] > 23 || +match[2] > 59 || +(match[3] || 0) > 59) throw new RangeError('Enter a valid UTC time.');
  const date = utcDate(y, m, d, 0);
  date.setUTCHours(+match[1], +match[2], +(match[3] || 0));
  return date;
}
export function validateZone(zone) {
  if (typeof zone !== 'string' || !zone.trim()) throw new RangeError('Enter an IANA time zone, such as Europe/London.');
  try { return new Intl.DateTimeFormat('en', { timeZone: zone.trim() }).resolvedOptions().timeZone; }
  catch { throw new RangeError('Time zone is not recognized. Use an IANA name such as Asia/Kolkata or UTC.'); }
}
export function calendarSupported(id) {
  try { return new Intl.DateTimeFormat('en', { calendar: id, timeZone: 'UTC' }).resolvedOptions().calendar === id; }
  catch { return false; }
}
export function calendarAtInstant(date, id, timeZone = 'UTC') {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('Enter a valid instant.');
  const zone = validateZone(timeZone);
  if (!CALENDARS.some(c => c.id === id)) throw new RangeError('Unsupported calendar method.');
  if (!calendarSupported(id)) return { supported: false, id, text: 'This browser does not support this calendar.' };
  if (date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100) throw new RangeError('Civil calendar display is supported for 1900–2100.');
  const formatter = new Intl.DateTimeFormat('en', { calendar: id, timeZone: zone, year: 'numeric', month: 'long', day: 'numeric', era: 'short' });
  return { supported: true, id, text: formatter.format(date), parts: formatter.formatToParts(date), timeZone: zone, boundary: 'civil-midnight' };
}
// Gregorian computus (Meeus/Jones/Butcher). Ecclesiastical, not an observed Moon.
export function easter(year, method = 'gregorian') {
  if (!Number.isInteger(year) || year < 1583 || year > 4099) throw new RangeError('Easter comparison supports years 1583–4099.');
  let month, day;
  if (method === 'gregorian') {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    month = Math.floor((h + l - 7 * m + 114) / 31); day = (h + l - 7 * m + 114) % 31 + 1;
  } else if (method === 'julian') {
    const a = year % 4, b = year % 7, c = year % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7;
    month = Math.floor((d + e + 114) / 31); day = (d + e + 114) % 31 + 1;
  } else throw new RangeError('Unknown Easter convention.');
  const native = { y: year, m: month, d: day };
  return { method, native, gregorian: method === 'gregorian' ? native : jdnToGregorian(julianToJDN(year, month, day)) };
}
export function validateLocation(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw new RangeError('Latitude must be −90 to 90 and longitude −180 to 180 degrees.');
}
export const KAABA = { latitude: 21.4225241, longitude: 39.8261818 };
export function qibla(latitude, longitude) {
  validateLocation(latitude, longitude);
  if (Math.abs(latitude) > 89.999999) return { available: false, reason: 'True-north bearing is undefined at a geographic pole.' };
  const r = Math.PI / 180, phi = latitude * r, destination = KAABA.latitude * r, delta = (KAABA.longitude - longitude) * r;
  const y = Math.sin(delta) * Math.cos(destination), x = Math.cos(phi) * Math.sin(destination) - Math.sin(phi) * Math.cos(destination) * Math.cos(delta);
  if (Math.hypot(x, y) < 1e-6) return { available: false, reason: 'Direction is undefined or unstable within a few metres of the Kaaba or its antipode.' };
  return { available: true, bearing: ((Math.atan2(y, x) / r) + 360) % 360, reference: 'true north', model: 'spherical initial great-circle bearing' };
}

export function prayerTimes({ date, latitude, longitude, timeZone, method = 'MuslimWorldLeague', asr = 'Shafi', highLatitude = 'MiddleOfTheNight', ishaAdjustment = 0 }) {
  const civil = parseCivil(date);
  if (civil.y < 1900 || civil.y > 2100) throw new RangeError('Prayer calculations support 1900–2100.');
  validateLocation(latitude, longitude);
  const zone = validateZone(timeZone);
  if (!PRAYER_METHODS.some(([key]) => key === method)) throw new RangeError('Choose a supported prayer method.');
  if (!['Shafi', 'Hanafi'].includes(asr) || !['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle'].includes(highLatitude)) throw new RangeError('Choose a supported Asr and high-latitude rule.');
  if (!Number.isFinite(ishaAdjustment) || Math.abs(ishaAdjustment) > 120) throw new RangeError('Isha adjustment must be within ±120 minutes.');
  const params = CalculationMethod[method]();
  params.madhab = Madhab[asr]; params.highLatitudeRule = HighLatitudeRule[highLatitude];
  params.polarCircleResolution = PolarCircleResolution.Unresolved;
  params.adjustments.isha = ishaAdjustment;
  const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const dayAt = instant => {
    const parts = Object.fromEntries(dayFormatter.formatToParts(instant).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  // Vendored adaptation reads UTC date fields, eliminating host-time-zone drift.
  // Solar-date labels follow longitude; civil date labels follow zone policy.
  // Date-line locations (e.g. Kiritimati) can differ by one whole day.
  let results;
  for (const shift of [0, -1, 1]) {
    const anchor = utcDate(civil.y, civil.m, civil.d, 12);
    anchor.setUTCDate(anchor.getUTCDate() + shift);
    const candidate = new PrayerTimes(new Coordinates(latitude, longitude), anchor, params);
    if (Number.isFinite(candidate.dhuhr.getTime()) && dayAt(candidate.dhuhr) === date) { results = candidate; break; }
  }
  if (!results) throw new RangeError('This civil date cannot be resolved in the selected time zone. Check the location, zone, and skipped historical dates.');
  const times = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map(name => {
    const instant = results[name];
    if (!Number.isFinite(instant?.getTime())) return { name, available: false, text: 'No calculable time with this method', instant: null };
    const localDate = dayAt(instant);
    return { name, available: true, text: formatter.format(instant), instant, localDate, differentDate: localDate !== date };
  });
  return { times, timeZone: zone, method, asr, highLatitude, ishaAdjustment, polarResolution: 'Unresolved', parameters: { fajrAngle: params.fajrAngle, ishaAngle: params.ishaAngle, ishaInterval: params.ishaInterval, adjustments: params.methodAdjustments }, complete: times.every(t => t.available) };
}
