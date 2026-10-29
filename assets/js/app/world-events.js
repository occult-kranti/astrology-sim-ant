import { mountChrome } from './shared.js';
import { worldEventsWindow, worldEventsFreshness, worldEventStudySample, compareWorldEventSamples, worldEventsToICS } from '../core/world-events.js';
import { mountDayGuidance } from './day-guidance.js';
import { mountCalendarAssistant } from './calendar-assistant.js';
import { downloadBlob, downloadJSON } from './state.js';

mountChrome('world-events');
const $ = id => document.getElementById(id), ROOT = new URL('../../../', import.meta.url);
const node = (tag, value, cls) => { const el = document.createElement(tag); if (value != null) el.textContent = String(value); if (cls) el.className = cls; return el; };
const human = value => String(value).replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
const dateLabel = value => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));
const nowDate = () => new Date().toISOString().slice(0, 10);
const PRESETS = { london: [51.5074, -.1278, 'Europe/London'], delhi: [28.6139, 77.209, 'Asia/Kolkata'], newyork: [40.7128, -74.006, 'America/New_York'], sydney: [-33.8688, 151.2093, 'Australia/Sydney'] };
let dataset = null, displayedWindow = null, currentStudy = null, currentPair = null, live = true, timer = null, active = true, pairTableSequence = 0;
const pairResizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(updatePairScrollRegions) : null;
const guidance = mountDayGuidance($('we-study-guidance'), null);
const assistant = mountCalendarAssistant($('we-study-ai'), { getComparison: () => currentStudy?.comparison || null });
const exportsEnabled = yes => ['we-ics', 'we-json'].forEach(id => { $(id).disabled = !yes; });
const showError = message => { $('we-error').hidden = !message; $('we-error').textContent = message || ''; };
const clearPair = message => { currentPair = null; pairResizeObserver?.disconnect(); pairTableSequence = 0; $('we-pair-result').hidden = true; $('we-pair-result').replaceChildren(); $('we-pair-json').disabled = true; if (message) $('we-pair-status').textContent = message; };
const clearStudy = message => {
  currentStudy = null; guidance.update(null); assistant.update(null); $('we-study').hidden = true;
  clearPair(message || 'Choose two current agenda records to compare them at the selected observer.');
  if (message) $('we-sample-status').textContent = message;
};
function sourceLink(source) { const a = node('a', source.title); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
function coverageName(id) { return dataset.coverage.find(row => row.id === id)?.name || id; }
function renderSourceLedger() {
  const host = $('we-sources'); host.replaceChildren();
  for (const source of dataset.sources) {
    const article = node('article', null, 'we-source'); article.id = `we-source-${source.id}`;
    const h = node('h3'); h.append(sourceLink(source)); article.append(h);
    article.append(node('p', `${human(source.status)} · HTTP ${source.httpStatus ?? 'request failed'} · checked ${source.checkedAt}`));
    if (source.sourceDated) article.append(node('p', `Source's own dated version: ${source.sourceDated}. Retrieval is not a new confirmation by the issuing authority.`));
    if (source.excerpt) article.append(node('blockquote', source.excerpt));
    if (source.translation) article.append(node('p', `AI translation of the date-relevant passage: ${source.translation}`));
    if (source.support) article.append(node('p', source.support));
    for (const limitation of source.limitations || []) article.append(node('p', limitation, 'we-source-caveat'));
    if (source.sha256) article.append(node('p', `Captured-body SHA-256: ${source.sha256}`, 'we-note'));
    host.append(article);
  }
}
function renderCoverage(window) {
  const host = $('we-coverage'); host.replaceChildren();
  for (const row of window.coverage) {
    const article = node('article', null, 'we-coverage-row'); article.append(node('h3', row.name), node('p', `${row.cohort} · ${human(row.status)} · ${row.matchedCount} matching entries`), node('p', row.note)); host.append(article);
  }
}
function renderAgenda(window) {
  const host = $('we-agenda'); host.replaceChildren();
  $('we-count').textContent = `${window.occurrences.length} matching date records · conditional dates ${window.filters.includeProvisional ? 'included' : 'excluded'}`;
  if (!window.occurrences.length) { const empty = node('div', null, 'we-empty'); empty.append(node('h3', 'No supported entry in this selection'), node('p', 'Try another category or jurisdiction, or inspect the coverage ledger. An empty curated list does not establish that no event occurs.')); host.append(empty); }
  for (const event of window.occurrences) {
    const details = node('details', null, 'we-event'), summary = node('summary'), date = node('time', dateLabel(event.date), 'we-event-date'); date.dateTime = event.date;
    details.dataset.eventId = event.id;
    const title = node('span'); title.append(node('span', event.title, 'we-event-title'), node('span', `${event.countryCodes.map(coverageName).join(' / ')} · ${human(event.category)} · ${event.scope}`, 'we-event-meta'));
    summary.append(date, title); details.append(summary);
    const body = node('div', null, 'we-event-body');
    if (event.ongoingAtWindowStart) body.append(node('p', 'Ongoing at the start of this agenda window; the original start date is retained.', 'we-note'));
    body.append(node('p', event.summary));
    if (event.endDateInclusive) body.append(node('p', `Published date range: ${dateLabel(event.date)} through ${dateLabel(event.endDateInclusive)}, inclusive.`));
    body.append(node('p', `Date-only record · ${human(event.scheduleStatus)}${event.annual ? ' · projected from the cited annual rule' : ''}`, 'we-note'));
    if (event.condition) body.append(node('p', event.condition, 'we-condition'));
    for (const note of event.notes || []) body.append(node('p', note, 'we-source-caveat'));
    const sources = node('p', 'Date sources: ');
    event.sources.forEach((source, i) => { if (i) sources.append(document.createTextNode(' · ')); sources.append(sourceLink(source)); }); body.append(sources);
    let studyDate = null;
    if (event.endDateInclusive) {
      const field = node('div', null, 'field'), label = node('label', 'Choose a date within this campaign for the noon sample');
      studyDate = node('input'); studyDate.type = 'date'; studyDate.id = `we-study-date-${event.id}`; studyDate.min = event.date; studyDate.max = event.endDateInclusive;
      studyDate.value = event.ongoingAtWindowStart ? window.referenceDate : event.date; label.htmlFor = studyDate.id; field.append(label, studyDate); body.append(field);
      studyDate.addEventListener('input', () => clearStudy('The selected campaign date changed. Choose Study a noon sample again to recalculate.'));
    }
    const button = node('button', 'Study a noon sample', 'btn-secondary'); button.type = 'button';
    button.dataset.studyEvent = event.id;
    button.addEventListener('click', () => studyEvent(event, studyDate?.value || event.date)); body.append(button);
    body.append(node('p', 'Uses the observer and explicit noon acknowledgement below. No event clock or outcome is inferred.', 'we-note'));
    details.append(body); host.append(details);
  }
  renderPairChoices(window);
}
function selectedPairEvent(side) { return displayedWindow?.occurrences.find(event => event.occurrenceId === $(`we-pair-${side}`).value); }
function updatePairDate(side) {
  const event = selectedPairEvent(side), input = $(`we-pair-date-${side}`), description = $(`we-pair-description-${side}`);
  if (!event) { input.value = ''; input.readOnly = true; description.textContent = ''; return; }
  const max = event.endDateInclusive || event.date;
  input.min = event.date; input.max = max; input.readOnly = !event.endDateInclusive;
  if (!input.value || input.value < event.date || input.value > max || input.readOnly) input.value = event.ongoingAtWindowStart ? displayedWindow.referenceDate : event.date;
  description.textContent = `${event.title} · ${human(event.scheduleStatus)} · ${event.date}${event.endDateInclusive ? ' through ' + event.endDateInclusive : ''} · date-only source record.`;
}
function renderPairChoices(window) {
  for (const side of ['a', 'b']) {
    const select = $(`we-pair-${side}`), prior = select.value, placeholder = node('option', side === 'a' ? 'Choose an event' : 'Choose a different event'); placeholder.value = '';
    select.replaceChildren(placeholder);
    for (const event of window.occurrences) { const option = node('option', `${event.date} · ${event.title}`); option.value = event.occurrenceId; select.append(option); }
    select.value = window.occurrences.some(event => event.occurrenceId === prior) ? prior : '';
    updatePairDate(side);
  }
}
function updatePairScrollRegions() {
  for (const wrap of $('we-pair-result').querySelectorAll('.we-pair-table-wrap')) {
    const hint = $(wrap.getAttribute('aria-describedby'));
    if (hint) hint.hidden = !(wrap.clientWidth > 0 && wrap.scrollWidth > wrap.clientWidth + 1);
  }
}
function pairTable(caption, rows, headings) {
  const block = node('div', null, 'we-pair-table-block'), hint = node('p', 'Scroll the table horizontally to compare all columns. With a keyboard, focus the table region and use the Left and Right arrow keys.', 'we-pair-scroll-hint we-note');
  hint.id = `we-pair-scroll-${++pairTableSequence}`; hint.hidden = true;
  const wrap = node('div', null, 'we-pair-table-wrap'), table = node('table', null, 'we-pair-table'), head = node('thead'), header = node('tr'), body = node('tbody');
  wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', caption); wrap.setAttribute('aria-describedby', hint.id);
  table.append(node('caption', caption)); for (const heading of headings) { const th = node('th', heading); th.scope = 'col'; header.append(th); } head.append(header);
  for (const cells of rows) { const tr = node('tr'); cells.forEach((value, index) => { const cell = node(index === 0 ? 'th' : 'td'); if (index === 0) cell.scope = 'row'; if (typeof value === 'string') cell.textContent = value; else cell.append(value); tr.append(cell); }); body.append(tr); }
  table.append(head, body); wrap.append(table); block.append(hint, wrap); return block;
}
function renderPair(result) {
  const host = $('we-pair-result'); host.replaceChildren();
  const heading = node('h3', 'Two samples, with their assumptions'); heading.id = 'we-pair-result-title'; heading.tabIndex = -1; host.append(heading);
  host.append(node('p', `Both use observer ${result.observer.lat}° N, ${result.observer.lon}° E, ${result.observer.timeZone}. The actual interval from A to B is ${result.elapsedHours.toFixed(2)} UTC hours; a negative value means B is earlier.`, 'we-study-context'));
  const context = node('div', null, 'we-pair-result-context');
  result.samples.forEach((sample, index) => { const article = node('article'); article.append(node('h4', `${index === 0 ? 'A' : 'B'} · ${sample.event.title}`), node('p', `Source precision: date-only · ${human(sample.event.scheduleStatus)}. Selected study date ${sample.selectedStudyDate}, 12:00 civil clock in ${sample.timeZone}.`), node('p', `Resolved sample: ${sample.sampledAtUTC}`, 'we-note'));
    const refs = node('p', 'Date sources: '); sample.event.sources.forEach((source, i) => { if (i) refs.append(document.createTextNode(' · ')); refs.append(sourceLink(source)); }); article.append(refs);
    const link = node('a', 'Open this sample’s full calendar comparison →'), url = new URL('pages/calendar-compare.html', ROOT), c = sample.comparison.context; url.search = new URLSearchParams({ at: c.dateISO, lat: String(c.lat), lon: String(c.lon), zone: c.timeZone, system: c.system }); link.href = url.href; article.append(link); context.append(article);
  }); host.append(context);
  const signed = value => `${value > 0 ? '+' : ''}${value.toFixed(3)}`;
  host.append(pairTable('Calculated quantities · B minus A', result.measures.map(row => { const label = node('span', row.label); label.append(node('span', row.rule, 'we-pair-rule')); return [label, `${row.first.toFixed(3)}${row.id === 'illumination' ? '%' : '°'}`, `${row.second.toFixed(3)}${row.id === 'illumination' ? '%' : '°'}`, `${signed(row.difference)} ${row.unit}`]; }), ['Quantity and method', 'Sample A', 'Sample B', 'Difference']));
  host.append(pairTable('Derived labels · inspect shared inputs', result.categories.map(row => { const label = node('span', row.label); label.append(node('span', row.rule, 'we-pair-rule')); return [label, row.first, row.second, row.sameLabel == null ? 'Unavailable comparison' : row.sameLabel ? 'Same label' : 'Different labels']; }), ['Convention', 'Sample A', 'Sample B', 'Label comparison']));
  const dates = node('details'); dates.append(node('summary', 'Compare all civil-calendar displays')); dates.addEventListener('toggle', updatePairScrollRegions);
  dates.append(pairTable('Civil display labels do not assign auspiciousness', result.calendars.map(row => { const label = node('span', row.label); label.append(node('span', `${row.first.method}. ${row.first.validation}. Civil boundary: ${row.first.boundary}.`, 'we-pair-rule')); return [label, row.first.text, row.second.text, row.sameDisplay == null ? 'Unavailable' : row.sameDisplay ? 'Same display label' : 'Different display labels']; }), ['Calendar and method', 'Sample A', 'Sample B', 'Display comparison'])); host.append(dates);
  const sources = node('details'), list = node('ul'); sources.append(node('summary', 'Calculation sources and qualifications'));
  for (const source of result.sources) { const li = node('li'), link = node('a', source.title); link.href = new URL(source.url, ROOT).href; li.append(link); list.append(li); } sources.append(list); host.append(sources);
  const limits = node('ul', null, 'we-note'); result.limitations.forEach(limit => limits.append(node('li', limit))); host.append(limits); host.hidden = false;
  for (const wrap of host.querySelectorAll('.we-pair-table-wrap')) { pairResizeObserver?.observe(wrap); pairResizeObserver?.observe(wrap.querySelector('table')); }
  updatePairScrollRegions(); heading.focus();
}
function comparePair() {
  clearStudy();
  try {
    if (!displayedWindow) throw new RangeError('Update the agenda for the edited filters before comparing samples.');
    const first = selectedPairEvent('a'), second = selectedPairEvent('b');
    if (!first || !second) throw new RangeError('Choose two events from the current agenda.');
    if (!$('we-lat').value.trim() || !$('we-lon').value.trim()) throw new RangeError('Complete both observer coordinates.');
    currentPair = compareWorldEventSamples(first, second, { acknowledged: $('we-sample-ack').checked, lat: Number($('we-lat').value), lon: Number($('we-lon').value), timeZone: $('we-zone').value.trim(), firstStudyDate: $('we-pair-date-a').value, secondStudyDate: $('we-pair-date-b').value });
    renderPair(currentPair); $('we-pair-json').disabled = false; $('we-pair-status').textContent = 'Two noon study samples compared locally. These are calculated differences, not event forecasts or statistical correlations.';
  } catch (error) { clearPair(error.message); if (!$('we-sample-ack').checked) $('we-sample-ack').focus(); else { $('we-pair-status').tabIndex = -1; $('we-pair-status').focus(); } }
}
function renderWindow() {
  if (!dataset) return;
  clearStudy(); exportsEnabled(false); showError('');
  try {
    displayedWindow = worldEventsWindow(dataset, { referenceDate: $('we-reference').value, country: $('we-country').value, category: $('we-category').value, includeProvisional: $('we-provisional').checked });
    const last = new Date(displayedWindow.endExclusive + 'T12:00:00Z'); last.setUTCDate(last.getUTCDate() - 1);
    $('we-window-status').textContent = `${live ? 'Current UTC date mode' : 'Frozen reference date'} · ${dateLabel(displayedWindow.referenceDate)} through ${dateLabel(last.toISOString().slice(0, 10))}. Two calendar months; the end boundary is exclusive.`;
    const freshness = worldEventsFreshness(dataset, new Date().toISOString());
    $('we-freshness').textContent = `Source review: ${dataset.reviewedAt} · ${freshness.ageDays} day(s) old · ${human(freshness.status)}. ${freshness.note}`;
    $('we-freshness').classList.toggle('we-freshness-warning', freshness.status !== 'snapshot-within-review-window');
    renderAgenda(displayedWindow); renderCoverage(displayedWindow); exportsEnabled(true);
  } catch (error) { displayedWindow = null; showError(error.message); $('we-window-status').textContent = 'The agenda was not updated. Correct the reference date or filters; your inputs are preserved.'; }
}
function studyEvent(event, studyDate) {
  clearStudy(); showError('');
  try {
    if (!displayedWindow || !displayedWindow.occurrences.some(row => row.occurrenceId === event.occurrenceId)) throw new RangeError('Update the agenda for the current filters before selecting a study sample.');
    if (!$('we-lat').value.trim() || !$('we-lon').value.trim()) throw new RangeError('Complete both observer coordinates.');
    currentStudy = worldEventStudySample(event, { acknowledged: $('we-sample-ack').checked, studyDate, lat: Number($('we-lat').value), lon: Number($('we-lon').value), timeZone: $('we-zone').value.trim() });
    const host = $('we-study-context'); host.replaceChildren();
    host.append(node('p', event.title), node('p', currentStudy.caution, 'we-study-warning'));
    const c = currentStudy.comparison.context;
    host.append(node('p', `Chosen study sample: ${currentStudy.selectedStudyDate}, 12:00 noon in ${c.timeZone} · UTC ${c.dateISO} · observer ${c.lat}° N, ${c.lon}° E.`, 'we-study-context'));
    const a = node('a', 'Open this exact sample in the full calendar comparison →'), url = new URL('pages/calendar-compare.html', ROOT);
    url.search = new URLSearchParams({ at: c.dateISO, lat: String(c.lat), lon: String(c.lon), zone: c.timeZone, system: c.system }); a.href = url.href; host.append(a);
    guidance.update(currentStudy.comparison); assistant.update(currentStudy.comparison); $('we-study').hidden = false;
    $('we-sample-status').textContent = `Noon study sample ready for ${event.title}. No event timestamp or outcome forecast has been generated.`;
    $('we-study-title').tabIndex = -1; $('we-study-title').focus();
  } catch (error) {
    currentStudy = null; $('we-sample-status').textContent = error.message;
    if (!$('we-sample-ack').checked) $('we-sample-ack').focus(); else $('we-zone').focus();
  }
}
$('we-filter-form').addEventListener('submit', event => { event.preventDefault(); renderWindow(); });
$('we-filter-form').addEventListener('input', event => {
  if (event.target.id === 'we-reference') live = false;
  displayedWindow = null; exportsEnabled(false); clearStudy();
  $('we-window-status').textContent = 'Filters changed. Update agenda before exporting; the prior list retains its published dates.';
});
$('we-live').addEventListener('click', () => { live = true; $('we-reference').value = nowDate(); renderWindow(); });
$('we-observer-form').addEventListener('input', () => clearStudy('Observer settings changed. Choose an event again to calculate a new noon sample.'));
$('we-observer-form').addEventListener('submit', event => event.preventDefault());
$('we-place').addEventListener('change', () => { const place = PRESETS[$('we-place').value]; if (place) [$('we-lat').value, $('we-lon').value, $('we-zone').value] = place; clearStudy('Observer preset changed. Verify its zone, acknowledge the noon assumption and choose an event.'); });
for (const id of ['we-lat', 'we-lon', 'we-zone']) $(id).addEventListener('input', () => { $('we-place').value = 'custom'; });
$('we-ics').addEventListener('click', () => {
  if (!displayedWindow) return;
  try { downloadBlob(new Blob([worldEventsToICS(displayedWindow, { generatedAt: new Date().toISOString() })], { type: 'text/calendar;charset=utf-8' }), `world-events-${displayedWindow.referenceDate}.ics`); $('we-export-status').textContent = 'Public date-only calendar downloaded. This imported snapshot will not update itself.'; }
  catch (error) { $('we-export-status').textContent = error.message; }
});
$('we-json').addEventListener('click', () => { if (displayedWindow) downloadJSON(displayedWindow, `world-events-${displayedWindow.referenceDate}.json`); });
$('we-pair-form').addEventListener('submit', event => { event.preventDefault(); comparePair(); });
$('we-pair-form').addEventListener('input', event => { clearPair('Comparison inputs changed. Compare again before exporting.'); if (event.target.id === 'we-pair-a') updatePairDate('a'); if (event.target.id === 'we-pair-b') updatePairDate('b'); });
$('we-pair-json').addEventListener('click', () => { if (!currentPair) return; downloadJSON(currentPair, 'world-event-study-comparison.json'); $('we-pair-status').textContent = 'Comparison downloaded with both explicit samples, selected observer coordinates and source qualifications.'; });
function tick() { if (!active || document.hidden || !live || !dataset) return; const current = nowDate(); if ($('we-reference').value !== current) { $('we-reference').value = current; renderWindow(); } }
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
window.addEventListener('resize', updatePairScrollRegions);
window.addEventListener('pagehide', () => { active = false; clearInterval(timer); });
window.addEventListener('pageshow', event => { active = true; if (event.persisted) { timer = setInterval(tick, 60000); tick(); } });
async function init() {
  try {
    const response = await fetch(new URL('assets/data/world-events.json', ROOT), { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Local event snapshot unavailable (HTTP ${response.status}).`);
    dataset = await response.json();
    const q = new URLSearchParams(location.search); $('we-reference').value = q.get('date') || nowDate(); live = !q.has('date');
    for (const row of dataset.coverage) { const option = node('option', row.name); option.value = row.id; $('we-country').append(option); }
    if (q.has('country')) $('we-country').value = q.get('country');
    if (q.has('category')) $('we-category').value = q.get('category');
    renderSourceLedger(); renderWindow(); timer = setInterval(tick, 60000);
  } catch (error) { showError(`${error.message} The source research ledger remains available below. Reload to retry.`); $('we-window-status').textContent = 'No event dates have been calculated.'; }
}
init();
