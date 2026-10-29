// Public event dates are a separate layer from a reader's selected study chart.
// Pure module: no current clock, DOM, storage or network access.
import { civilFields, offsetToUTC, resolveZonedTime, validLocation } from './time.js';
import { compareMoment } from './calendar-observatory.js';

const DAY = 86400000;
const pad = n => String(n).padStart(2, '0');
const dateText = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const text = (value, label, limit = 2000) => {
  if (typeof value !== 'string' || !value.trim() || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new RangeError(`Invalid ${label}.`);
  return value;
};
function civilDate(value) {
  const f = civilFields(value, '00:00');
  if (f.year < 1900 || f.year > 2100) throw new RangeError('World-event dates support 1900–2100.');
  return offsetToUTC(value, '00:00', 0);
}
function checkedInstant(value, label = 'timestamp') {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/.test(value) || !Number.isFinite(new Date(value).getTime())) throw new RangeError(`Use an explicit UTC ${label}.`);
  civilFields(value.slice(0, 10), value.slice(11, 19));
  return new Date(value);
}
export function addCivilMonths(value, months = 2) {
  const d = civilDate(value);
  if (!Number.isInteger(months) || months < 1 || months > 6) throw new RangeError('Choose one to six calendar months.');
  const year = d.getUTCFullYear(), month = d.getUTCMonth(), day = d.getUTCDate();
  const first = new Date(0); first.setUTCFullYear(year, month + months, 1); first.setUTCHours(0, 0, 0, 0);
  const end = new Date(first); end.setUTCMonth(end.getUTCMonth() + 1, 0);
  first.setUTCDate(Math.min(day, end.getUTCDate()));
  if (first.getUTCFullYear() > 2100) throw new RangeError('The selected window extends beyond supported year 2100.');
  return dateText(first);
}
function nextDay(value) { return dateText(new Date(civilDate(value).getTime() + DAY)); }
function safeURL(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new RangeError('Source URLs must be public HTTPS addresses.');
  return url.href;
}
export function validateWorldEventsDataset(dataset) {
  if (!dataset || dataset.schemaVersion !== 1 || !Array.isArray(dataset.events) || !Array.isArray(dataset.sources) || !Array.isArray(dataset.coverage)) throw new TypeError('Unsupported world-events dataset.');
  checkedInstant(dataset.reviewedAt, 'source-review timestamp');
  const countryIds = new Set(), sourceIds = new Set(), eventIds = new Set();
  for (const row of dataset.coverage) {
    if (countryIds.has(row.id)) throw new RangeError('Duplicate coverage identity.');
    text(row.id, 'coverage identity', 50); text(row.name, 'coverage name', 200); countryIds.add(row.id);
    if (!['curated-events-present', 'not-reviewed-in-this-pass', 'sources-unavailable', 'institutional-scope-only', 'global-observances'].includes(row.status)) throw new RangeError('Unknown coverage status.');
  }
  for (const source of dataset.sources) {
    if (sourceIds.has(source.id)) throw new RangeError('Duplicate source identity.');
    text(source.id, 'source identity', 100); text(source.title, 'source title', 300); safeURL(source.url); checkedInstant(source.checkedAt, 'source timestamp');
    if (!['verified-date-support', 'failed-access', 'read-no-date-support', 'conflicting-page-elements'].includes(source.status)) throw new RangeError('Unknown source status.');
    sourceIds.add(source.id);
  }
  for (const event of dataset.events) {
    if (eventIds.has(event.id)) throw new RangeError('Duplicate event identity.');
    if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(event.id)) throw new RangeError('Invalid event identity.');
    eventIds.add(event.id); text(event.title, 'event title', 300); text(event.summary, 'event summary');
    if (!['election', 'international-day', 'campaign'].includes(event.category)) throw new RangeError('Unknown event category.');
    if (!['scheduled', 'annual-rule', 'provisional'].includes(event.scheduleStatus)) throw new RangeError('Unknown event schedule status.');
    if (!Array.isArray(event.countryCodes) || !event.countryCodes.length || event.countryCodes.some(id => !countryIds.has(id))) throw new RangeError('Event has an unknown country or institution.');
    if (!Array.isArray(event.sourceIds) || !event.sourceIds.length || event.sourceIds.some(id => !sourceIds.has(id))) throw new RangeError('Event has an unknown source.');
    const cited = event.sourceIds.map(id => dataset.sources.find(source => source.id === id));
    if (!cited.some(source => ['verified-date-support', 'conflicting-page-elements'].includes(source.status))) throw new RangeError('An event needs an actually inspected date source.');
    if (event.date) {
      civilDate(event.date);
      if (event.endDateInclusive && civilDate(event.endDateInclusive) < civilDate(event.date)) throw new RangeError('Event end date precedes its start.');
    } else if (event.annual) {
      const rule = event.annual;
      if (!Number.isInteger(rule.month) || rule.month < 1 || rule.month > 12 || !Number.isInteger(rule.fromYear) || rule.fromYear < 1900 || rule.fromYear > 2100) throw new RangeError('Invalid annual event range.');
      if (rule.day != null) civilDate(`2000-${pad(rule.month)}-${pad(rule.day)}`);
      else if (!Number.isInteger(rule.weekday) || rule.weekday < 0 || rule.weekday > 6 || !Number.isInteger(rule.nth) || rule.nth < 1 || rule.nth > 4) throw new RangeError('Invalid annual weekday rule.');
    } else throw new RangeError('Event must have a supported date or annual rule.');
  }
  return dataset;
}
function annualDate(rule, year) {
  if (year < rule.fromYear) return null;
  if (rule.day != null) {
    try { const value = `${year}-${pad(rule.month)}-${pad(rule.day)}`; civilDate(value); return value; }
    catch { return null; } // February 29 annual rules have no occurrence in ordinary years.
  }
  const first = civilDate(`${year}-${pad(rule.month)}-01`);
  return `${year}-${pad(rule.month)}-${pad(1 + ((rule.weekday - first.getUTCDay() + 7) % 7) + (rule.nth - 1) * 7)}`;
}
export function worldEventsWindow(dataset, { referenceDate, months = 2, country = 'all', category = 'all', includeProvisional = false } = {}) {
  validateWorldEventsDataset(dataset);
  const start = dateText(civilDate(referenceDate)), endExclusive = addCivilMonths(start, months);
  if (country !== 'all' && !dataset.coverage.some(row => row.id === country)) throw new RangeError('Unknown coverage filter.');
  if (!['all', 'election', 'international-day', 'campaign'].includes(category)) throw new RangeError('Unknown category filter.');
  const years = [Number(start.slice(0, 4)), Number(endExclusive.slice(0, 4))].filter((year, i, a) => a.indexOf(year) === i), occurrences = [];
  for (const event of dataset.events) {
    if (!includeProvisional && event.scheduleStatus === 'provisional') continue;
    if (country !== 'all' && !event.countryCodes.includes(country)) continue;
    if (category !== 'all' && event.category !== category) continue;
    for (const date of event.date ? [event.date] : years.map(year => annualDate(event.annual, year)).filter(Boolean)) {
      const eventEnd = nextDay(event.endDateInclusive || date);
      if (date >= endExclusive || eventEnd <= start) continue;
      occurrences.push({ ...event, date, precision: 'date-only', endDateExclusive: eventEnd, occurrenceId: `${event.id}:${date}`,
        ongoingAtWindowStart: date < start, sources: event.sourceIds.map(id => dataset.sources.find(source => source.id === id)) });
    }
  }
  occurrences.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  return { schemaVersion: 1, referenceDate: start, endExclusive, months, filters: { country, category, includeProvisional },
    sourceReviewedAt: dataset.reviewedAt, datePrecision: 'date-only', occurrences,
    coverage: dataset.coverage.map(row => ({ ...row, matchedCount: occurrences.filter(event => event.countryCodes.includes(row.id)).length })),
    limitations: ['This is a curated public-date snapshot, not an exhaustive global event or election calendar.', 'Changing the reference date recomputes the window; it does not refresh the underlying sources.', 'Annual observances use the cited recurrence rule; a campaign theme, local activity or event clock is not inferred.'] };
}
export function worldEventsFreshness(dataset, nowISO) {
  const now = checkedInstant(nowISO), review = checkedInstant(dataset.reviewedAt), ageDays = (now - review) / DAY;
  return { reviewedAt: dataset.reviewedAt, assessedAt: now.toISOString(), ageDays: Math.max(0, Math.floor(ageDays)),
    status: ageDays < 0 ? 'clock-before-source-review' : ageDays > (dataset.freshnessDays || 14) ? 'review-overdue' : 'snapshot-within-review-window',
    note: 'A recent snapshot is not a guarantee that a future election or programme has not changed. Check the issuing authority.' };
}
export function worldEventStudySample(event, { acknowledged = false, lat, lon, timeZone, studyDate = event?.date, system = 'regiomontanus' } = {}) {
  if (!event || event.precision !== 'date-only') throw new TypeError('Choose a public date-only event occurrence.');
  civilDate(event.date); civilDate(event.endDateExclusive);
  if (acknowledged !== true) throw new RangeError('Acknowledge that local noon is a selected study sample, not the event timestamp.');
  validLocation(lat, lon);
  const date = dateText(civilDate(studyDate));
  if (date < event.date || date >= event.endDateExclusive) throw new RangeError('Choose a study date within the event’s published date range.');
  const resolved = resolveZonedTime(date, '12:00:00', timeZone, { disambiguation: 'reject' });
  const comparison = compareMoment({ dateISO: resolved.instant.toISOString(), lat, lon, timeZone, system });
  return { schemaVersion: 1, eventId: event.id, occurrenceId: event.occurrenceId, eventDate: event.date, eventEndDateExclusive: event.endDateExclusive,
    selectedStudyDate: date, sampledAtUTC: resolved.instant.toISOString(), sampleClock: '12:00:00', timeZone,
    sampleStatus: 'explicit-reader-selected-local-noon', eventTimestampKnown: false,
    caution: 'This local-noon observer chart is a chosen study sample. It is not a poll-opening, closing, result, national-capital or globally unique event instant. Historical classifications do not predict election winners or event outcomes.', comparison };
}

// RFC 5545 TEXT escaping and 75-octet content-line folding. Iterating Unicode
// code points keeps a multi-byte UTF-8 character intact across a folded line.
export function escapeICSText(value) { return String(value).replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
export function foldICSLine(value) {
  if (/[\r\n]/.test(value)) throw new RangeError('ICS content lines cannot contain raw line breaks.');
  const encoder = new TextEncoder(); let line = '', size = 0; const lines = [];
  for (const char of value) {
    const bytes = encoder.encode(char).length;
    if (size + bytes > 75) { lines.push(line); line = ' '; size = 1; }
    line += char; size += bytes;
  }
  lines.push(line); return lines.join('\r\n');
}
export function worldEventsToICS(window, { generatedAt, calendarName = 'Calendar Observatory — selected world events' } = {}) {
  const dtstamp = checkedInstant(generatedAt, 'export timestamp').toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  if (!window || !Array.isArray(window.occurrences)) throw new TypeError('Export a calculated event window.');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Astrologers Workbench//World Events 1//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' + escapeICSText(calendarName)];
  for (const event of window.occurrences) {
    civilDate(event.date); civilDate(event.endDateExclusive);
    if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(event.id)) throw new RangeError('Invalid export event identity.');
    const description = [event.summary, `Date precision: date-only. Scope: ${event.scope || 'See source'}.`, `Schedule status: ${event.scheduleStatus}. Source snapshot: ${window.sourceReviewedAt}.`, 'No event timestamp, astrology chart, selected observer coordinates or outcome prediction is included in this public-date calendar.', ...(event.sources || []).map(source => source.url)].join('\n');
    lines.push('BEGIN:VEVENT', `UID:world-events-${event.id}-${event.date}@occult-kranti.github.io`, `DTSTAMP:${dtstamp}`, `DTSTART;VALUE=DATE:${event.date.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${event.endDateExclusive.replace(/-/g, '')}`,
      'SUMMARY:' + escapeICSText(event.title), 'DESCRIPTION:' + escapeICSText(description), 'LOCATION:' + escapeICSText(event.scope || event.countryCodes.join(', ')), 'CATEGORIES:' + escapeICSText(event.category), `STATUS:${event.scheduleStatus === 'provisional' ? 'TENTATIVE' : 'CONFIRMED'}`, 'TRANSP:TRANSPARENT');
    if (event.sources?.[0]?.url) lines.push('URL:' + safeURL(event.sources[0].url));
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR'); return lines.map(foldICSLine).join('\r\n') + '\r\n';
}
