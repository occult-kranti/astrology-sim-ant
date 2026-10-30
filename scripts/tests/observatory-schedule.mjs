import assert from 'node:assert/strict';
import { mondayOfWeek, localClockFields, outlookCacheKey } from '../../assets/js/core/observatory-schedule.js';

assert.equal(mondayOfWeek('2026-10-29'),'2026-10-26');
assert.equal(mondayOfWeek('2026-10-25'),'2026-10-19');
assert.equal(mondayOfWeek('2026-01-01'),'2025-12-29');
assert.equal(mondayOfWeek('2024-02-29'),'2024-02-26');
assert.throws(()=>mondayOfWeek('2026-02-30'),/does not exist/);
assert.deepEqual(localClockFields(new Date('2024-11-03T05:30:00Z'),'America/New_York'),{date:'2024-11-03',time:'01:30:00'});
assert.deepEqual(localClockFields(new Date('2024-11-03T06:30:00Z'),'America/New_York'),{date:'2024-11-03',time:'01:30:00'});
assert.deepEqual(localClockFields(new Date('2026-10-29T23:30:00Z'),'Asia/Kolkata'),{date:'2026-10-30',time:'05:00:00'});
assert.throws(()=>localClockFields(new Date('invalid'),'UTC'));
assert.throws(()=>localClockFields(new Date(),'Not/AZone'));
const base={date:'2024-11-03',timeZone:'America/New_York',lat:40.71,lon:-74};
assert.equal(outlookCacheKey(base),outlookCacheKey({...base,date:'2024-10-28'}),'same civil week reuses daily samples across DST');
assert.notEqual(outlookCacheKey(base),outlookCacheKey({...base,date:'2024-11-04'}));
assert.notEqual(outlookCacheKey(base),outlookCacheKey({...base,lat:41}));
assert.notEqual(outlookCacheKey(base),outlookCacheKey({...base,timeZone:'UTC'}));
console.log('Observatory civil-week schedule:14 checks passed.');
