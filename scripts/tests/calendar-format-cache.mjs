// Independent fresh-Intl comparisons plus native-formatter allocation regression.
import assert from 'node:assert/strict';
import { CALENDARS, calendarAtInstant, calendarSupported, validateZone } from '../../assets/js/core/cultural-calendars.js';
let checks = 0;
const equal = (a,b) => { assert.deepEqual(a,b); checks++; };
const dates = ['1900-03-01T12:00:00Z','2000-02-29T00:00:00Z','2026-03-08T07:30:00Z','2028-12-31T23:30:00Z','2100-06-30T06:00:00Z'];
const zones = ['UTC','America/New_York','Asia/Kolkata','Pacific/Apia','Europe/London'];
for (const id of CALENDARS.map(c=>c.id)) for (const zone of zones) for (const value of dates) {
  const date = new Date(value), canonicalZone = new Intl.DateTimeFormat('en',{timeZone:zone}).resolvedOptions().timeZone;
  const supported = new Intl.DateTimeFormat('en',{calendar:id,timeZone:'UTC'}).resolvedOptions().calendar === id;
  const actual = calendarAtInstant(date,id,zone);
  equal(actual.supported,supported);
  if (supported) {
    const fresh = new Intl.DateTimeFormat('en',{calendar:id,timeZone:canonicalZone,year:'numeric',month:'long',day:'numeric',era:'short'});
    equal(actual.parts,fresh.formatToParts(date)); equal(actual.text,fresh.format(date)); equal(actual.timeZone,canonicalZone);
  }
}
// Exercise more zones than any retained cache can hold; eviction must not alter results.
for (const zone of Intl.supportedValuesOf('timeZone').slice(0,160)) {
  const date = new Date('2026-11-05T12:00:00Z');
  equal(calendarAtInstant(date,'hebrew',zone).text,new Intl.DateTimeFormat('en',{calendar:'hebrew',timeZone:zone,year:'numeric',month:'long',day:'numeric',era:'short'}).format(date));
}
for (const [date,zone] of [['1900-01-01T00:00:00Z','Pacific/Honolulu'],['2100-12-31T23:59:59Z','Pacific/Kiritimati']]) {
  assert.throws(()=>calendarAtInstant(new Date(date),'hebrew',zone),/observer-zone/);checks++;
}
assert.throws(()=>validateZone('Not/A_Zone'));checks++;
equal(calendarSupported('not-a-calendar'),false);
const Original = Intl.DateTimeFormat;
let constructions = 0;
try {
  Intl.DateTimeFormat = function(...args) { constructions++; return new Original(...args); };
  for (const c of CALENDARS) calendarAtInstant(new Date(dates[0]),c.id,'UTC');
  const warmed = constructions;
  for (let i=0;i<200;i++) calendarAtInstant(new Date(dates[i%dates.length]),CALENDARS[i%CALENDARS.length].id,'UTC');
  assert.ok(constructions-warmed<5,'Repeated dates use existing public formatter configuration instead of hundreds of native objects');checks++;
} finally { Intl.DateTimeFormat = Original; }
equal(validateZone(' Etc/UTC '),'UTC');
console.log(JSON.stringify({pass:true,checks,scope:'Fresh Intl parity, eviction, supported range and bounded allocation; no calendar arithmetic changed.'}));
