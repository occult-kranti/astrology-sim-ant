// One deliberately frozen, user-selected instant. No network requests, automatic
// location access or personal-record writes are needed to compare calendars.
import { compareMoment } from '../core/calendar-observatory.js';
import { resolveZonedTime, validLocation } from '../core/time.js';
import { PRAYER_METHODS, validateZone } from '../core/cultural-calendars.js';
import { parseExplicitInstant } from '../core/instant-boundary.js';
import { downloadBlob, downloadJSON } from './state.js';
import { mountDayGuidance } from './day-guidance.js';
import { buildDayGuidance } from '../core/day-guidance.js';
import { buildComparisonEvidence } from '../core/comparison-evidence.js';
import { mountComparisonEvidence } from './comparison-evidence.js';

const $ = id => document.getElementById(id);
const PRESETS = Object.freeze({
  london: [51.5074, -0.1278, 'Europe/London'], delhi: [28.6139, 77.209, 'Asia/Kolkata'],
  makkah: [21.4225, 39.8262, 'Asia/Riyadh'], newyork: [40.7128, -74.006, 'America/New_York'],
  shanghai: [31.2304, 121.4737, 'Asia/Shanghai'], sydney: [-33.8688, 151.2093, 'Australia/Sydney'],
  tromso: [69.6492, 18.9553, 'Europe/Oslo'],
});
const FIELD_IDS = ['obs-date', 'obs-time', 'obs-zone', 'obs-lat', 'obs-lon', 'obs-system', 'obs-fold', 'obs-method', 'obs-asr', 'obs-high'];
const SITE_ROOT = new URL('../../../', import.meta.url);
const node = (tag, text, className) => { const el = document.createElement(tag); if (text != null) el.textContent = String(text); if (className) el.className = className; return el; };
const human = value => String(value).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
const textValue = value => {
  if (value == null) return 'Unavailable';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : String(Math.round(value * 10000) / 10000);
  if (typeof value !== 'object') return String(value);
  return value.label || value.name || value.text || value.reason || JSON.stringify(value);
};
const list = value => Array.isArray(value) ? value : value == null ? [] : [value];
const localFields = (instant, timeZone) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA-u-ca-gregory-nu-latn', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(instant).map(part => [part.type, part.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}:${p.second}` };
};
const sourceURL = raw => { try { const url = new URL(raw, SITE_ROOT); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };

export function calendarComparisonToMarkdown(result) {
  if (!result) throw new Error('Calculate a current comparison first.');
  const c = result.context || {}, lines = ['# Calendar Observatory — one moment', '', `UTC instant: ${c.dateISO || c.instant || ''}`, `Zone: ${c.timeZone || ''}`, `Latitude / longitude: ${c.lat ?? ''}, ${c.lon ?? ''}`, '', '> Calendar arithmetic and astronomical geometry do not validate symbolic predictions. Religious observances can use different day boundaries and local rulings.', '', '## Calendar dates', ''];
  for (const item of result.calendars || []) lines.push(`### ${item.label || item.id}`, '', String(item.text || item.value || item.reason || 'Unavailable'), '', `Method: ${textValue(item.method)}`, `Boundary: ${textValue(item.boundary)}`, ...list(item.limitations).map(value => `- ${textValue(value)}`), '');
  lines.push('## Historical guidance and optional reflection actions', '', '> These rules classify this sample only. Suggested actions are modern editorial prompts, not book quotations or outcome predictions.', '', '```json', JSON.stringify(buildDayGuidance(result), null, 2), '```', '', '## Full source-labelled comparison', '', '```json', JSON.stringify(result, null, 2), '```');
  lines.push('', '## Shared calculations and different conventions', '', '```json', JSON.stringify(buildComparisonEvidence(result), null, 2), '```');
  return lines.join('\n');
}

export function initCalendarObservatory() {
  let activeComparison = null, displayedComparison = null, currentInput = null, assistant = null, active = true, locationRequest = 0;
  const dayGuide=mountDayGuidance($('obs-day-guidance'),null);
  const connectionGuide=mountComparisonEvidence($('obs-comparison-evidence'),null);
  const status = message => { $('obs-status').textContent = message; };
  const error = message => { $('obs-error').hidden = !message; $('obs-error').textContent = message || ''; };
  const setExports = enabled => ['obs-json', 'obs-markdown', 'obs-share'].forEach(id => { $(id).disabled = !enabled; });
  const dirty = () => {
    activeComparison = null; currentInput = null; assistant?.update(null);dayGuide.update(null);connectionGuide.update(null); setExports(false);
    $('obs-stale').hidden = !displayedComparison; $('obs-export-status').textContent = '';
    $('obs-tool-links').replaceChildren(); error('');
    status('Inputs changed. Choose Compare this moment to update the frozen comparison.');
  };
  const fillInstant = instant => {
    const zone = validateZone($('obs-zone').value); const parts = localFields(instant, zone);
    $('obs-date').value = parts.date; $('obs-time').value = parts.time;
    const candidates = resolveZonedTime(parts.date, parts.time, zone, { disambiguation: 'earlier' });
    $('obs-fold').value = candidates.ambiguous && candidates.instant.getTime() !== Math.floor(instant.getTime() / 1000) * 1000 ? 'later' : candidates.ambiguous ? 'earlier' : 'reject';
  };
  const numeric = id => { if (!$(id).value.trim()) throw new RangeError('Complete both coordinates before calculating.'); return Number($(id).value); };
  const readInput = () => {
    const zone = validateZone($('obs-zone').value), lat = numeric('obs-lat'), lon = numeric('obs-lon');
    validLocation(lat, lon);
    const resolution = resolveZonedTime($('obs-date').value, $('obs-time').value, zone, { disambiguation: $('obs-fold').value });
    return { dateISO: resolution.instant.toISOString(), lat, lon, timeZone: zone, system: $('obs-system').value, prayerMethod: $('obs-method').value, asr: $('obs-asr').value, highLatitude: $('obs-high').value };
  };
  function renderContext(result, input) {
    const dt = new Date(input.dateISO), context = $('obs-context-values'); context.replaceChildren();
    const fields = [ ['UTC instant', dt.toISOString().replace('.000Z', 'Z')], ['Local clock', new Intl.DateTimeFormat('en-GB', { timeZone: input.timeZone, dateStyle: 'full', timeStyle: 'long' }).format(dt)], ['Time zone', input.timeZone], ['Observer', `${input.lat.toFixed(4)}° N, ${input.lon.toFixed(4)}° E`], ['Western / sidereal', `${human(input.system)} houses / Lahiri, whole sign`] ];
    for (const [key, value] of fields) context.append(node('dt', key), node('dd', value));
    $('obs-stale').hidden = true;
  }
  function renderCalendars(result) {
    const root = $('obs-calendars'); root.replaceChildren();
    for (const item of result.calendars || []) {
      const row = node('article', null, 'obs-calendar-row'), heading = node('div'), details = node('div', null, 'obs-calendar-method');
      heading.append(node('h3', item.label || human(item.id)), node('span', human(item.status || (item.supported === false ? 'Unavailable' : 'Calculated')), 'obs-status-label'));
      row.append(heading, node('p', item.text || textValue(item.value || item.reason || 'Unavailable'), 'obs-calendar-value'));
      if (item.boundary) details.append(node('p', `Day boundary · ${human(item.boundary)}`));
      if (item.validation) details.append(node('p', `Reference checks · ${human(item.validation)}`));
      const methods = node('details'); methods.append(node('summary', 'Calculation, use & limits'));
      const steps=node('ol');
      steps.append(node('li',`Start with the explicit UTC instant ${result.context.dateISO}.`),node('li',`Resolve the civil clock in ${result.context.timeZone}: ${result.context.localDate} ${result.context.localTime}.`),node('li',item.method||'This runtime cannot supply the requested method.'));
      methods.append(steps);
      if(item.parts?.length) methods.append(node('p',`Returned fields · ${item.parts.filter(part=>part.type!=='literal').map(part=>`${part.type}: ${part.value}`).join(' · ')}`));
      methods.append(node('p','Use this result to label the civil date in the named convention. A date conversion does not calculate an auspicious action, a planetary alignment or a religious ruling. See the separate historical rule explanations below for the astronomical inputs those rules actually use.','obs-help'));
      if (item.method) methods.append(node('p', textValue(item.method)));
      for (const limit of list(item.limitations || item.note)) methods.append(node('p', textValue(limit)));
      if (item.sourceIds?.length) {
        const p = node('p', 'References · ');
        item.sourceIds.forEach((id, i) => { const a = node('a', id); a.href = '#' + id; if (i) p.append(document.createTextNode(' · ')); p.append(a); }); methods.append(p);
      }
      details.append(methods);
      row.append(details); root.append(row);
    }
  }
  function reading(title, data, preferred) {
    const article = node('article', null, 'obs-reading'); article.append(node('h3', title));
    if (!data) { article.append(node('p', 'Unavailable for this comparison.')); return article; }
    if (data.status) article.append(node('p', human(data.status), 'obs-status-label'));
    const dl = node('dl', null, 'obs-key-values');
    const entries = preferred ? preferred(data) : Object.entries(data).filter(([key, value]) => !['status', 'sourceIds', 'limitations', 'notes', 'method', 'warnings'].includes(key) && (value == null || typeof value !== 'object' || value.label || value.name || value.text));
    for (const [key, value] of entries.slice(0, 12)) dl.append(node('dt', human(key)), node('dd', textValue(value)));
    article.append(dl);
    if (data.method) article.append(node('p', `Method · ${textValue(data.method)}`, 'obs-help'));
    for (const limit of list(data.limitations || data.notes || data.warnings)) article.append(node('p', textValue(limit), 'obs-help'));
    const details = node('details'); details.append(node('summary', 'Inspect calculated values'), node('pre', JSON.stringify(data, null, 2), 'obs-data')); article.append(details);
    return article;
  }
  function renderReadings(result) {
    const host = $('obs-readings'); host.replaceChildren();
    const position = value => value ? `${Number(value.degree).toFixed(2)}° ${value.sign}` : 'Unavailable';
    const localClock = iso => iso ? new Intl.DateTimeFormat('en-GB', { timeZone: currentInput.timeZone, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : 'Unavailable';
    host.append(reading('Astronomical reference', result.astronomy, a => [
      ['Moon phase', a.phaseLabel], ['Moon illuminated', `${(a.moonIlluminatedFraction * 100).toFixed(1)}%`],
      ['Moon–Sun elongation', `${Number(a.moonSunElongation).toFixed(2)}°`], ['Julian day UTC', a.julianDayUTC],
    ]));
    host.append(reading('Western · tropical', result.western, w => [
      ['Sun', position(w.sun)], ['Moon', position(w.moon)], ['Ascendant', position(w.ascendant)],
      ['House convention', human(w.houseSystem || 'Unavailable')], ['Requested houses', human(w.requestedHouseSystem || 'Unavailable')],
      ['Sect by solar horizon', w.isDay == null ? 'Unavailable' : w.isDay ? 'Day' : 'Night'],
    ]));
    host.append(reading('Jyotiṣa · sidereal', result.vedic, v => [
      ['Sun', position(v.sun)], ['Moon', position(v.moon)], ['Lagna', v.lagna?.label || 'Unavailable'],
      ['Ayanāṁśa', v.ayanamsha ? `${v.ayanamsha.degrees}° · linear Lahiri estimate` : 'Unavailable'],
      ['Tithi', v.panchanga?.tithi ? `${v.panchanga.tithi.name} · ${v.panchanga.tithi.paksha}` : 'Unavailable'],
      ['Vāra at sunrise', v.panchanga?.vara ? `${v.panchanga.vara.name || 'Unavailable'}${v.panchanga.vara.lord ? ' · ' + v.panchanga.vara.lord : ''}` : 'Unavailable'],
      ['Nakṣatra', v.panchanga?.nakshatra ? `${v.panchanga.nakshatra.name} · pāda ${v.panchanga.nakshatra.pada}` : 'Unavailable'],
      ['Yoga', v.panchanga?.yoga?.name || 'Unavailable'], ['Karaṇa', v.panchanga?.karana?.name || 'Unavailable'],
    ]));
    if (result.vedic?.traditionalScreens) {
      const screens = result.vedic.traditionalScreens, article = node('article', null, 'obs-reading');
      article.append(node('h3', 'Jyotiṣa · historical quality rules'), node('p', screens.scope, 'obs-help'), node('p', 'Primary-text verification is incomplete. These screens reproduce modern secondary summaries, including citation flags and disputed variants. They are source-labelled historical classifications, not a verified judgment for this instant.', 'obs-help'));
      for (const item of Object.values(screens.limbs || {})) {
        const part = node('div', null, 'obs-connection');
        const unresolved = item.applicability === 'timing-unresolved';
        const historicalVerdict = item.ruleVerdict ?? item.verdict;
        const classification = unresolved ? 'Opening-portion rule · timing unresolved' : historicalVerdict ? `Historical classification · ${human(historicalVerdict)}` : 'Historical classification · no instant verdict';
        part.append(node('h4', `${item.limb} · ${item.class}`), node('p', item.value), node('p', classification), node('p', item.detail));
        if (unresolved) part.append(node('p', 'The limb start and end are not calculated, so this comparison cannot establish whether the selected instant falls in the opening portion. No active avoidance judgment is applied.', 'obs-help'));
        const source = node('details'); source.append(node('summary', 'Rule provenance'), node('p', item.cite, 'obs-help')); part.append(source); article.append(part);
      }
      for (const limitation of list(screens.limitations)) article.append(node('p', limitation, 'obs-help'));
      host.append(article);
    }
    host.append(reading('Planetary hours', result.planetaryHours, h => [
      ['Current ruler', h.ruler || h.reason || 'Unavailable'], ['Sunrise-day ruler', h.dayRuler || 'Unavailable'],
      ['Hour within segment', h.hourNumber ? `${h.hourNumber} · ${h.isNight ? 'night' : 'daylight'}` : 'Unavailable'],
      ['Interval length', h.hourLengthMinutes ? `${Number(h.hourLengthMinutes).toFixed(2)} minutes` : 'Unavailable'],
      ['Starts locally', localClock(h.currentStartISO)], ['Ends locally', localClock(h.currentEndISO)],
    ]));
    host.append(reading('Prayer time conventions', result.prayer, p => [
      ['Local timetable date', p.date], ['Asr convention', p.asr], ['Twilight rule', human(p.highLatitude || 'Unavailable')],
      ...list(p.times).map(t => [human(t.name), t.available ? `${t.text}${t.differentDate ? ' · ' + t.localDate : ''}` : 'Unavailable']),
      ['Qibla', p.qibla?.available ? `${Number(p.qibla.bearing).toFixed(2)}° from true north` : p.qibla?.reason || 'Unavailable'],
    ]));
  }
  function renderConnections(result) {
    const root = $('obs-connections'); root.replaceChildren();
    for (const comparison of list(result.comparisons)) {
      const el = node('article', null, 'obs-connection');
      if (typeof comparison === 'string') el.append(node('p', comparison));
      else {
        el.append(node('h3', comparison.title || comparison.label || human(comparison.kind || comparison.id || 'Compare the methods')));
        for (const key of ['text', 'summary', 'similarity', 'difference', 'interpretation', 'note', 'caveat']) if (comparison[key]) el.append(node('p', textValue(comparison[key])));
        if (!['text', 'summary', 'similarity', 'difference', 'interpretation', 'note', 'caveat'].some(key => comparison[key])) el.append(node('p', textValue(comparison)));
      }
      root.append(el);
    }
    const prompts = $('obs-prompts'); prompts.replaceChildren();
    if (list(result.studyPrompts).length) {
      prompts.append(node('h3', 'Questions for a closer reading')); const ul = node('ul');
      for (const item of list(result.studyPrompts)) ul.append(node('li', typeof item === 'string' ? item : item.text || item.prompt || item.label || textValue(item)));
      prompts.append(ul);
    }
  }
  function renderSources(result) {
    const limits = $('obs-limitations'), sources = $('obs-sources'); limits.replaceChildren(); sources.replaceChildren();
    const ul = node('ul'); for (const item of list(result.limitations)) ul.append(node('li', textValue(item))); limits.append(ul);
    if (list(result.unimplemented).length) {
      const details = node('details'), pending = node('ul'); details.append(node('summary', 'Traditions and methods not calculated here'));
      for (const item of list(result.unimplemented)) pending.append(node('li', `${item.label || item.id}: ${item.reason}`));
      details.append(pending); limits.append(details);
    }
    for (const item of list(result.sources)) {
      const li = node('li');
      if (typeof item === 'string') li.textContent = item;
      else {
        if (item.id) li.id = item.id;
        const label = item.title || item.label || item.id || item.name || 'Method reference', url = sourceURL(item.url || item.href || '');
        if (url && (item.url || item.href)) { const a = node('a', label); a.href = url; li.append(a); } else li.append(node('span', label));
        for (const key of ['author', 'locator', 'note', 'scope', 'license']) if (item[key]) li.append(document.createTextNode(` · ${textValue(item[key])}`));
      }
      sources.append(li);
    }
  }
  function renderToolLinks(input) {
    const at = new Date(input.dateISO), utc = at.toISOString(), local = localFields(at, input.timeZone), first = resolveZonedTime(local.date, local.time, input.timeZone, { disambiguation: 'earlier' });
    const fold = first.ambiguous ? first.instant.getTime() === Math.floor(at.getTime() / 1000) * 1000 ? 'earlier' : 'later' : 'reject';
    const resolved = resolveZonedTime(local.date, local.time, input.timeZone, { disambiguation: fold });
    const query = new URLSearchParams({ date: utc.slice(0, 10), time: utc.slice(11, 19), offset: '0', lat: String(input.lat), lon: String(input.lon) }), host = $('obs-tool-links'); host.replaceChildren();
    for (const [title, path, extras] of [['Open full Workbench →', 'workbench.html', { date: local.date, time: local.time, offset: String(resolved.offsetHours), system: input.system, zone: input.timeZone, fold }], ['Open Vedic chart · UTC inputs →', 'vedic/index.html', {}], ['Calendar methods →', 'calendars.html', null]]) {
      const a = node('a', title), q = new URLSearchParams(query); Object.entries(extras || {}).forEach(([key, value]) => q.set(key, value));
      a.href = path + (extras === null ? '' : '?' + q); host.append(a);
    }
    const art=node('a','Design a sigil for this study moment →');
    art.href='sigil-studio.html?'+new URLSearchParams({at:input.dateISO,lat:String(input.lat),lon:String(input.lon),zone:input.timeZone});host.append(art);
  }
  function run({ focusError = false } = {}) {
    activeComparison = null; currentInput = null; assistant?.update(null);dayGuide.update(null);connectionGuide.update(null); setExports(false); error('');
    FIELD_IDS.forEach(id => $(id).removeAttribute('aria-invalid'));
    try {
      const input = readInput(), result = compareMoment(input);
      activeComparison = displayedComparison = result; currentInput = input;
      renderContext(result, input); renderCalendars(result); renderReadings(result); renderConnections(result); renderSources(result); renderToolLinks(input);
      $('obs-results').hidden = false; setExports(true); assistant?.update(result);dayGuide.update(result);connectionGuide.update(result);
      status(`Comparison calculated locally for ${input.dateISO.replace('.000Z', 'Z')}. All panels use this one instant; unavailable methods remain labelled.`);
      window.dispatchEvent(new CustomEvent('calendar-observatory:comparison', { detail: result }));
    } catch (err) {
      $('obs-stale').hidden = !displayedComparison; $('obs-tool-links').replaceChildren();
      const message = err.code === 'AMBIGUOUS_TIME' ? 'This local clock time occurs twice. Open Calculation conventions and choose the earlier or later occurrence, then compare again.' : err.message || 'Comparison unavailable. Check the date, time zone and coordinates.';
      error(message); status('The calculation was not updated. Your entered values are preserved.');
      if (err.code === 'AMBIGUOUS_TIME') { $('obs-fold').closest('details').open = true; $('obs-fold').setAttribute('aria-invalid', 'true'); if (focusError) $('obs-fold').focus(); }
      else if (focusError) { $('obs-error').tabIndex = -1; $('obs-error').focus(); }
    }
  }
  $('obs-method').replaceChildren(...PRAYER_METHODS.map(([value, label]) => { const option = node('option', label); option.value = value; return option; }));
  $('obs-form').addEventListener('input', dirty);
  $('obs-form').addEventListener('change', dirty);
  $('obs-form').addEventListener('submit', event => { event.preventDefault(); run({ focusError: true }); });
  $('obs-place').addEventListener('change', () => {
    const preset = PRESETS[$('obs-place').value]; if (!preset) return;
    const at = activeComparison ? new Date(currentInput.dateISO) : null;
    [$('obs-lat').value, $('obs-lon').value, $('obs-zone').value] = preset;
    $('obs-location-status').textContent = `Preset selected: ${$('obs-place').selectedOptions[0].textContent}. Verify the local date and time before comparing.`;
    if (at) fillInstant(at); dirty();
  });
  ['obs-lat', 'obs-lon', 'obs-zone'].forEach(id => $(id).addEventListener('input', () => { $('obs-place').value = 'custom'; locationRequest++; $('obs-locate').disabled = false; }));
  $('obs-now').addEventListener('click', () => { try { fillInstant(new Date()); dirty(); status('Current time filled in the chosen time zone. Choose Compare this moment to calculate.'); } catch (err) { error(err.message); } });
  $('obs-locate').addEventListener('click', () => {
    if (!navigator.geolocation) { $('obs-location-status').textContent = 'Location is unavailable in this browser. Enter coordinates and time zone manually.'; return; }
    const request = ++locationRequest; $('obs-locate').disabled = true; $('obs-location-status').textContent = 'Requesting location. You can keep entering coordinates manually.';
    navigator.geolocation.getCurrentPosition(position => {
      if (!active || request !== locationRequest) return;
      $('obs-locate').disabled = false; $('obs-lat').value = position.coords.latitude.toFixed(6); $('obs-lon').value = position.coords.longitude.toFixed(6); $('obs-place').value = 'custom';
      $('obs-zone').value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      $('obs-location-status').textContent = `Device accuracy approximately ±${Math.round(position.coords.accuracy)} m. Device zone ${$('obs-zone').value}; verify it matches this location. Your local clock fields are unchanged.`;
      dirty();
    }, err => {
      if (!active || request !== locationRequest) return; $('obs-locate').disabled = false;
      $('obs-location-status').textContent = err.code === 1 ? 'Location permission was denied. Enter coordinates and time zone manually.' : 'Location could not be obtained. Enter coordinates and time zone manually.';
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });
  const guardedExport = fn => { if (!activeComparison || !currentInput) { $('obs-export-status').textContent = 'Compare the current inputs before exporting.'; return; } try { fn(activeComparison, currentInput); } catch (err) { $('obs-export-status').textContent = err.message || 'Export unavailable. Try JSON download.'; } };
  $('obs-json').addEventListener('click', () => guardedExport(result => downloadJSON({...result,studyGuidance:buildDayGuidance(result),comparisonEvidence:buildComparisonEvidence(result)}, 'calendar-comparison.json')));
  $('obs-markdown').addEventListener('click', () => guardedExport(result => downloadBlob(new Blob([calendarComparisonToMarkdown(result)], { type: 'text/markdown;charset=utf-8' }), 'calendar-comparison.md')));
  $('obs-share').addEventListener('click', () => guardedExport(async (_result, input) => {
    const url = new URL(location.href); url.search = new URLSearchParams({ at: input.dateISO, lat: String(input.lat), lon: String(input.lon), zone: input.timeZone, system: input.system, method: input.prayerMethod, asr: input.asr, high: input.highLatitude }).toString(); url.hash = '';
    try { await navigator.clipboard.writeText(url.href); $('obs-export-status').textContent = 'Comparison link copied. It includes your selected coordinates.'; }
    catch { const a = node('a', 'Open the comparison link to copy it from the address bar'); a.href = url.href; $('obs-export-status').replaceChildren(a); }
  }));
  window.addEventListener('pagehide', () => { active = false; locationRequest++; $('obs-locate').disabled = false; });
  window.addEventListener('pageshow', () => { active = true; });
  let incomingError = null;
  try {
    const q = new URLSearchParams(location.search);
    for (const [key, id] of [['lat', 'obs-lat'], ['lon', 'obs-lon'], ['zone', 'obs-zone'], ['system', 'obs-system'], ['method', 'obs-method'], ['asr', 'obs-asr'], ['high', 'obs-high']]) if (q.has(key)) $(id).value = q.get(key);
    if (q.has('lat') || q.has('lon') || q.has('zone')) $('obs-place').value = 'custom';
    if (q.has('at')) {
      fillInstant(parseExplicitInstant(q.get('at')));
    } else fillInstant(new Date());
  } catch (err) { incomingError = err.message; }
  setExports(false);
  if (incomingError) { error(incomingError); status('The incoming link was not calculated. Correct the inputs and compare.'); } else run();
  import('./calendar-assistant.js').then(module => { if (!active) return; assistant = module.mountCalendarAssistant($('obs-assistant'), { getComparison: () => activeComparison }); assistant.update(activeComparison); }).catch(() => {
    $('obs-assistant').append(node('p', 'The optional AI prompt helper is unavailable. Local comparisons and exports still work.', 'obs-help'));
  });
  return { current: () => activeComparison, refresh: () => run() };
}
