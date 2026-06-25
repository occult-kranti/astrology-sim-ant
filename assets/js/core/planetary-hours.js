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
export function planetaryHour(instant, lat, lon) {
  // Find the relevant sunrise that begins the current planetary day.
  const dayStart = new Date(Date.UTC(
    instant.getUTCFullYear(), instant.getUTCMonth(), instant.getUTCDate(), 0, 0, 0));
  let sunrise = riseSet('rise', dayStart, lat, lon);
  let sunset = riseSet('set', dayStart, lat, lon);

  let baseDate, start, sunsetT, nextRise, weekday;

  if (sunrise && instant >= sunrise) {
    // today's planetary day
    start = sunrise;
    sunsetT = sunset && sunset > sunrise ? sunset : riseSet('set', new Date(sunrise.getTime() + 3600000), lat, lon);
    nextRise = riseSet('rise', new Date(start.getTime() + 18 * 3600000), lat, lon);
    weekday = sunrise.getUTCDay();
    baseDate = sunrise;
  } else {
    // before today's sunrise → previous planetary day's night
    const prev = new Date(dayStart.getTime() - 24 * 3600000);
    start = riseSet('rise', prev, lat, lon);
    sunsetT = riseSet('set', prev, lat, lon);
    nextRise = sunrise;
    weekday = start ? start.getUTCDay() : (instant.getUTCDay() + 6) % 7;
    baseDate = start;
  }
  if (!start || !sunsetT || !nextRise) return null;

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
    weekday, sunrise: start, sunset: sunsetT, nextSunrise: nextRise,
    hourLengthMinutes: lenMs / 60000
  };
}

// The ruler of the planetary day (weekday ruler) for a date.
export function dayRuler(date) {
  return DAY_RULERS[date.getUTCDay()];
}

// Full table of 24 planetary hours for a day, for display.
export function hoursTable(date, lat, lon) {
  const dayStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
  const sunrise = riseSet('rise', dayStart, lat, lon);
  const sunset = sunrise ? riseSet('set', new Date(sunrise.getTime() + 3600000), lat, lon) : null;
  const nextRise = sunrise ? riseSet('rise', new Date(sunrise.getTime() + 18 * 3600000), lat, lon) : null;
  if (!sunrise || !sunset || !nextRise) return null;
  const dayLen = (sunset - sunrise) / 12, nightLen = (nextRise - sunset) / 12;
  const dayRulerName = DAY_RULERS[sunrise.getUTCDay()];
  const startIdx = CHALDEAN.indexOf(dayRulerName);
  const rows = [];
  for (let h = 0; h < 24; h++) {
    const night = h >= 12;
    const t0 = night ? new Date(sunset.getTime() + (h - 12) * nightLen)
                     : new Date(sunrise.getTime() + h * dayLen);
    rows.push({ hour: h + 1, night, start: t0, ruler: CHALDEAN[(startIdx + h) % 7] });
  }
  return { rows, sunrise, sunset, nextRise, dayRuler: dayRulerName };
}
