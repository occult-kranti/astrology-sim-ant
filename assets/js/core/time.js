// Exact-time boundary for all calculators. Civil Gregorian dates use
// astronomical years (1 BCE = 0); offsets are hours east of UTC. No host-zone
// parsing. IANA resolution uses the browser's Intl/tzdb and rejects DST gaps
// and repeated clock times until the caller explicitly chooses an occurrence.
// Reference: https://tc39.es/proposal-temporal/docs/ambiguity.html
const DAY = 86400000;
const formatters = new Map();

export function civilFields(dateStr, timeStr = '00:00') {
  const d = /^([+-]?\d{4,6})-(\d{2})-(\d{2})$/.exec(String(dateStr));
  const t = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(timeStr));
  if (!d || !t) throw new RangeError('Enter a valid Gregorian date and clock time.');
  const f = { year: Number(d[1]), month: Number(d[2]), day: Number(d[3]), hour: Number(t[1]), minute: Number(t[2]), second: Number(t[3] || 0) };
  if (f.month < 1 || f.month > 12 || f.day < 1 || f.day > 31 || f.hour > 23 || f.minute > 59 || f.second > 59) throw new RangeError('That date or clock time does not exist.');
  const date = fieldsDate(f);
  if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() !== f.year || date.getUTCMonth() + 1 !== f.month || date.getUTCDate() !== f.day) throw new RangeError('That Gregorian date does not exist.');
  return f;
}

function fieldsDate(f) {
  const d = new Date(0);
  d.setUTCFullYear(f.year, f.month - 1, f.day);
  d.setUTCHours(f.hour || 0, f.minute || 0, f.second || 0, 0);
  return d;
}

export function offsetToUTC(dateStr, timeStr, offsetHours) {
  if (offsetHours === '' || offsetHours == null || !Number.isFinite(Number(offsetHours)) || Math.abs(Number(offsetHours)) > 24) throw new RangeError('Enter a finite UTC offset between −24 and +24 hours.');
  return new Date(fieldsDate(civilFields(dateStr, timeStr)).getTime() - Number(offsetHours) * 3600000);
}

function formatter(zone) {
  if (typeof zone !== 'string' || !zone.trim()) throw new RangeError('Enter an IANA time zone, such as Europe/London.');
  if (!formatters.has(zone)) {
    const fmt = new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', {
      timeZone: zone, era: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    if (formatters.size > 64) formatters.clear();
    formatters.set(zone, fmt);
  }
  return formatters.get(zone);
}

function wallFields(date, fmt) {
  const p = Object.fromEntries(fmt.formatToParts(date).map(x => [x.type, x.value]));
  return { year: p.era === 'BC' ? 1 - Number(p.year) : Number(p.year), month: Number(p.month), day: Number(p.day), hour: Number(p.hour), minute: Number(p.minute), second: Number(p.second) };
}

export function zonedTimeCandidates(dateStr, timeStr, zone) {
  const f = civilFields(dateStr, timeStr), nominal = fieldsDate(f).getTime(), fmt = formatter(zone.trim());
  // Sample both sides of all ordinary DST/political transitions, including
  // full-day date-line skips. Candidate instants must round-trip ALL fields.
  const offsets = new Set();
  for (let dt = -2 * DAY; dt <= 2 * DAY; dt += 6 * 3600000) {
    const at = nominal + dt;
    offsets.add(fieldsDate(wallFields(new Date(at), fmt)).getTime() - at);
  }
  const candidates = [...offsets].map(offset => new Date(nominal - offset)).filter(d => {
    const actual = wallFields(d, fmt);
    return Object.keys(f).every(k => actual[k] === f[k]);
  }).sort((a, b) => a - b);
  return candidates.filter((d, i) => i === 0 || d.getTime() !== candidates[i - 1].getTime());
}

export function resolveZonedTime(dateStr, timeStr, zone, { disambiguation = 'reject' } = {}) {
  if (!['reject', 'earlier', 'later'].includes(disambiguation)) throw new RangeError('Choose reject, earlier, or later for repeated clock times.');
  const candidates = zonedTimeCandidates(dateStr, timeStr, zone);
  if (!candidates.length) {
    const error = new RangeError('This clock time does not exist in that time zone because the clocks changed. Correct the time.');
    error.code = 'NONEXISTENT_TIME'; throw error;
  }
  if (candidates.length > 1 && disambiguation === 'reject') {
    const error = new RangeError('This clock time occurs twice. Choose the earlier or later occurrence after checking the birth record.');
    error.code = 'AMBIGUOUS_TIME'; error.candidates = candidates; throw error;
  }
  const instant = candidates[disambiguation === 'later' ? candidates.length - 1 : 0];
  const nominal = fieldsDate(civilFields(dateStr, timeStr)).getTime();
  return { instant, offsetHours: (nominal - instant.getTime()) / 3600000, ambiguous: candidates.length > 1, candidates };
}

export function validLocation(latitude, longitude) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new RangeError('Latitude must be −90…90° and longitude −180…180°.');
}

// Date-only input has different semantics from an exact local birth time. A
// civil day can begin after 00:00 (e.g. São Paulo's 2018 DST gap). Find the first
// real instant of that date; reject a completely skipped date. Resolution is
// one second, matching this module's input precision and historical Intl data.
export function startOfZonedDay(dateStr, zone) {
  civilFields(dateStr, '00:00');
  const at = seconds => {
    const h = Math.floor(seconds / 3600), m = Math.floor(seconds / 60) % 60, s = seconds % 60;
    return zonedTimeCandidates(dateStr, [h, m, s].map(v => String(v).padStart(2, '0')).join(':'), zone);
  };
  const midnight = at(0); if (midnight.length) return midnight[0];
  let upper = 3600;
  while (upper < 86400 && !at(upper).length) upper += 3600;
  if (upper === 86400) { const e = new RangeError('This civil date does not exist in the selected time zone.'); e.code = 'NONEXISTENT_DATE'; throw e; }
  let lower = upper - 3600;
  while (upper - lower > 1) { const middle = Math.floor((lower + upper) / 2); if (at(middle).length) upper = middle; else lower = middle; }
  return at(upper)[0];
}

export function zonedCivilDay(dateStr, zone) {
  const start = startOfZonedDay(dateStr, zone), next = offsetToUTC(dateStr, '00:00', 0);
  // A following skipped civil date (Apia 2011-12-30) contributes no instants.
  for (let day = 1; day <= 3; day++) {
    next.setUTCDate(next.getUTCDate() + 1);
    try { return { start, end: startOfZonedDay(next.toISOString().split('T')[0], zone) }; }
    catch (e) { if (e.code !== 'NONEXISTENT_DATE') throw e; }
  }
  throw new RangeError('Could not establish the next civil-day boundary.');
}
