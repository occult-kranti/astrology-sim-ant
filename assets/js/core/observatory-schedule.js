// Civil week arithmetic, not an ephemeris. A calendar date advances independently
// of a UTC duration, so Monday alignment remains stable across DST transitions.
import { civilFields } from './time.js';

export function localClockFields(instant, timeZone) {
  if (!(instant instanceof Date) || !Number.isFinite(instant.getTime())) throw new RangeError('A valid instant is required.');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA-u-ca-gregory-nu-latn', {
    timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23',
  }).formatToParts(instant).map(p => [p.type,p.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,time:`${parts.hour}:${parts.minute}:${parts.second}`};
}

export function mondayOfWeek(date) {
  const f=civilFields(date,'12:00'), d=new Date(0);
  d.setUTCFullYear(f.year,f.month-1,f.day); d.setUTCHours(12,0,0,0);
  d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
  return d.toISOString().slice(0,10);
}

export function outlookCacheKey({date,timeZone,lat,lon}) {
  return JSON.stringify([mondayOfWeek(date),timeZone,lat,lon]);
}
