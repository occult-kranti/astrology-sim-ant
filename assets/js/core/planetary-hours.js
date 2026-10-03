// ============================================================================
//  planetary-hours.js — Planetary day & hour rulers (Chaldean order).
//  The day is divided into 12 equal "hours" between sunrise and sunset, and the
//  night into 12 between sunset and the next sunrise. The first hour of the day
//  is ruled by the planet that rules the weekday; subsequent hours follow the
//  Chaldean order (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon). The
//  planetary day begins at SUNRISE, not midnight.
// ============================================================================
import * as Astronomy from '../lib/astronomy.js';
import { CHALDEAN } from './astro.js';
import { DAY_RULERS } from './data/dignities-data.js';

// The local weekday attached to a sunrise. An explicit civil zone/offset is
// preferred; otherwise use the local mean-solar date and disclose that choice.
export function sunriseDay(instant, lat, lon, { timeZone = null, utcOffset = null } = {}) {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, instant, -2)?.date;
  if (!sunrise) return null;
  const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunrise, 1)?.date;
  const nextSunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, new Date(sunrise.getTime() + 12 * 3600000), 1)?.date;
  if (!sunset || !nextSunrise || sunset <= sunrise || sunset >= nextSunrise || instant < sunrise || instant >= nextSunrise) return null;
  let weekday, weekdayMethod;
  if (timeZone) {
    const label = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(sunrise);
    weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(label);
    weekdayMethod = `weekday at local sunrise in ${timeZone}`;
  } else {
    const offset = Number.isFinite(utcOffset) ? utcOffset : lon / 15;
    weekday = new Date(sunrise.getTime() + offset * 3600000).getUTCDay();
    weekdayMethod = Number.isFinite(utcOffset) ? `weekday at sunrise using supplied UTC offset ${utcOffset}` : 'weekday at sunrise using the local mean-solar date (longitude/15); no civil time zone supplied';
  }
  return { sunrise, sunset, nextSunrise, weekday, weekdayMethod };
}

// Sunrise/sunset for a date & place. Returns Date objects (UTC) or null.
function riseSet(kind, date, lat, lon) {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const dir = kind === 'rise' ? +1 : -1;
  // search starting from local midnight of that date
  const start = new Astronomy.AstroTime(date);
  const ev = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, dir, start, 1);
  return ev ? ev.date : null;
}

// Determine the planetary hour ruler for an instant at a location.
export function planetaryHour(instant, lat, lon, options = {}) {
  return planetaryHourForDay(instant, sunriseDay(instant, lat, lon, options));
}

// Reuse an already calculated sunrise interval inside compound readings.
export function planetaryHourForDay(instant, day) {
  if (!day || instant < day.sunrise || instant >= day.nextSunrise) return null;
  const { sunrise: start, sunset: sunsetT, nextSunrise: nextRise, weekday, weekdayMethod } = day;

  let hourNo, lenMs, isNight;
  if (instant >= sunsetT) {
    isNight = true;
    lenMs = (nextRise - sunsetT) / 12;
    hourNo = 12 + Math.floor((instant - sunsetT) / lenMs);
  } else {
    isNight = false;
    lenMs = (sunsetT - start) / 12;
    hourNo = Math.floor((instant - start) / lenMs);
  }
  hourNo = Math.max(0, Math.min(23, hourNo));

  const dayRuler = DAY_RULERS[weekday];                 // ruler of the weekday
  const startIdx = CHALDEAN.indexOf(dayRuler);          // first hour = day ruler
  const ruler = CHALDEAN[(startIdx + hourNo) % 7];

  return {
    ruler, dayRuler, hourNumber: hourNo + 1, isNight,
    weekday, weekdayMethod, sunrise: start, sunset: sunsetT, nextSunrise: nextRise,
    hourLengthMinutes: lenMs / 60000
  };
}

// The ruler of the planetary day (weekday ruler) for a date.
export function dayRuler(date) {
  return DAY_RULERS[date.getUTCDay()];
}

// Full table of 24 planetary hours for a day, for display.
export function hoursTable(date, lat, lon, options = {}) {
  const dayStart = new Date(date); dayStart.setUTCHours(0, 0, 0, 0);
  const sunrise = riseSet('rise', dayStart, lat, lon);
  const sunset = sunrise ? riseSet('set', new Date(sunrise.getTime() + 3600000), lat, lon) : null;
  const nextRise = sunrise ? riseSet('rise', new Date(sunrise.getTime() + 18 * 3600000), lat, lon) : null;
  if (!sunrise || !sunset || !nextRise) return null;
  const dayLen = (sunset - sunrise) / 12, nightLen = (nextRise - sunset) / 12;
  const localDay = sunriseDay(new Date(sunrise.getTime() + 1000), lat, lon, options);
  if (!localDay) return null;
  const dayRulerName = DAY_RULERS[localDay.weekday];
  const startIdx = CHALDEAN.indexOf(dayRulerName);
  const rows = [];
  for (let h = 0; h < 24; h++) {
    const night = h >= 12;
    const t0 = night ? new Date(sunset.getTime() + (h - 12) * nightLen)
                     : new Date(sunrise.getTime() + h * dayLen);
    rows.push({ hour: h + 1, night, start: t0, ruler: CHALDEAN[(startIdx + h) % 7] });
  }
  return { rows, sunrise, sunset, nextRise, dayRuler: dayRulerName, weekdayMethod: localDay.weekdayMethod };
}
