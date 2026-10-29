// Shared exact-instant boundary for lightweight and compound calculators.
// Pure: no engine, DOM, storage, clock or network dependencies.
import { civilFields, offsetToUTC } from './time.js';

export const HOUSE_SYSTEMS = ['regiomontanus', 'placidus', 'whole', 'equal'];

export function parseExplicitInstant(value) {
  if (typeof value !== 'string') throw new RangeError('Use an ISO date and time with Z or an explicit UTC offset.');
  const m = /^((?:\d{4}|[+-]\d{6})-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!m) throw new RangeError('Use an ISO date and time with Z or an explicit UTC offset.');
  if (m[1].startsWith('-000000-')) throw new RangeError('ISO astronomical year zero is 0000, not −000000.');
  const clock = m[2] + ':' + (m[3] || '00');
  civilFields(m[1], clock);
  let offset = 0;
  if (m[5] !== 'Z') {
    const hours = Number(m[5].slice(1, 3)), minutes = Number(m[5].slice(4));
    if (hours > 23 || minutes > 59) throw new RangeError('Invalid ISO UTC offset.');
    offset = (hours + minutes / 60) * (m[5][0] === '-' ? -1 : 1);
  }
  const date = offsetToUTC(m[1], clock, offset);
  date.setUTCMilliseconds(Number((m[4] || '').padEnd(3, '0')));
  if (date.getUTCFullYear() < -1999 || date.getUTCFullYear() > 3000) throw new RangeError('Supported study dates are years −1999 through 3000; precision varies by epoch.');
  return date;
}

