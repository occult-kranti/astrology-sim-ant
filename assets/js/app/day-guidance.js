// Reusable mounted guidance: local calculations only; hourly work starts after
// explicit disclosure. update(null) invalidates stale context and pending work.
import { buildDayGuidance, buildHourlyGuidance } from '../core/day-guidance.js';

const ROOT = new URL('../../../', import.meta.url);
const human = value => String(value).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
const pretty = value => typeof value === 'number' ? (Number.isInteger(value) ? String(value) : value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')) : value == null ? 'Not computed' : typeof value === 'object' ? JSON.stringify(value) : String(value);
function sourceURL(raw) { try { const url = new URL(raw, ROOT); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } }
const selectItems = tradition => {
  const favorable = tradition.items.find(item => item.classification === 'favorable'), caution = tradition.items.find(item => item.classification === 'caution');
  return favorable || caution ? [favorable, caution].filter(Boolean) : [tradition.items.find(item => item.classification === 'neutral') || tradition.items[0]].filter(Boolean);
};

export function mountDayGuidance(container, initialInput = null) {
  if (!container?.ownerDocument || typeof container.replaceChildren !== 'function') throw new TypeError('Mount day guidance in a real document element.');
  const doc = container.ownerDocument, win = doc.defaultView;
  let active = true, version = 0, timer = null, controller = null, current = null, hourlyCache = null, cacheKey = null;
  container.classList.add('day-guidance');
  const node = (tag, text, cls) => { const el = doc.createElement(tag); if (text != null) el.textContent = String(text); if (cls) el.className = cls; return el; };
  const cancel = () => { if (timer !== null) { win.clearTimeout(timer); timer = null; } controller?.abort(); controller = new AbortController(); };
  function link(source) {
    const a = node('a', source.title || source.id), url = sourceURL(source.url);
    if (url) a.href = url;
    return a;
  }
  function compactItem(item) {
    const block = node('div', null, 'dg-compact-item');
    block.append(node('span', `${human(item.classification)} · historical class`, `dg-class dg-${item.classification}`), node('h5', item.title), node('p', item.reading));
    if (item.optionalAction?.text) block.append(node('p', `Optional reflection: ${item.optionalAction.text}`, 'dg-action'));
    block.append(node('p', `Rule ${item.id} · ${item.sourceIds.join(' / ')}. Measured inputs and source qualifications are available below.`, 'dg-note'));
    return block;
  }
  function detailedItem(item, guide) {
    const details = node('details', null, 'dg-rule'); details.dataset.ruleId = item.id;
    details.append(node('summary', `${human(item.classification)} · ${item.title}`));
    details.append(node('p', item.reading));
    details.append(node('p', `Optional reflection: ${item.optionalAction.text}`, 'dg-action'), node('p', item.optionalAction.status, 'dg-note'));
    details.append(node('p', `Rule ${item.rule.id} · ${item.rule.algorithm}`, 'dg-rule-id'));
    details.append(node('p', `Scope: this sample only. ${item.applicability === 'timing-unresolved' ? 'Opening-portion timing is unresolved; no active avoidance judgment.' : 'A symbolic class, without an outcome promise.'}`, 'dg-note'));
    const measurements = node('dl', null, 'dg-measurements');
    for (const [key, value] of Object.entries(item.computed || {})) {
      if (key === 'planets') {
        for (const p of value) measurements.append(node('dt', p.name), node('dd', `${pretty(p.longitudeDegrees)}° longitude · ${pretty(p.speedDegreesPerDay)}°/day; ${p.frame}`));
      } else measurements.append(node('dt', human(key)), node('dd', pretty(value)));
    }
    details.append(node('h6', 'Calculated inputs'), measurements);
    const thresholds = node('dl', null, 'dg-measurements');
    for (const [key, value] of Object.entries(item.thresholds || {})) thresholds.append(node('dt', human(key)), node('dd', pretty(value)));
    details.append(node('h6', 'Rule thresholds and conventions'), thresholds, node('p', item.sourceStatus, 'dg-note'));
    const sources = node('ul', null, 'dg-source-list');
    for (const id of item.sourceIds) {
      const source = guide.sources.find(s => s.id === id), li = node('li');
      if (!source) { li.textContent = id; sources.append(li); continue; }
      li.append(link(source), node('span', ` · ${source.locator || ''} · ${source.status || ''}`)); sources.append(li);
    }
    details.append(node('h6', 'Sources'), sources);
    if (item.sourceCitation) details.append(node('p', item.sourceCitation, 'dg-note'));
    for (const limit of item.limitations || []) details.append(node('p', limit, 'dg-note'));
    return details;
  }
  function allRules(guide) {
    const region = node('div', null, 'dg-rules');
    for (const tradition of guide.traditions) {
      const section = node('section'); section.append(node('h4', tradition.label));
      tradition.items.forEach(item => section.append(detailedItem(item, guide))); region.append(section);
    }
    return region;
  }
  function renderHourly(report, host, runVersion, signal, openState = new Map()) {
    host.replaceChildren();
    host.append(node('p', `${report.date} · ${report.timeZone} · ${pretty(report.actualDayHours)} real hours. ${report.sampleScope}`, 'dg-note'));
    const missing = report.clockSlots.filter(slot => slot.status === 'unavailable');
    if (missing.length) host.append(node('p', `Clock hours that do not exist on this date: ${missing.map(slot => slot.localClock).join(', ')}. The clock change is retained; no sample is invented.`, 'dg-unavailable-note'));
    for (const row of report.rows) {
      const details = node('details', null, 'dg-hour'), occurrence = row.occurrence ? ` · ${row.occurrence === 1 ? 'first' : 'second'} occurrence` : '';
      const label = `${row.localClock.slice(0, 5)} ${row.offsetLabel}${occurrence} → ${row.localEndClock.slice(0, 5)}${row.endOffsetLabel !== row.offsetLabel ? ' ' + row.endOffsetLabel : ''}${row.localEndDate !== row.localDate ? ' next date' : ''} · ${pretty(row.durationMinutes)} real minutes`;
      details.dataset.hourStart = row.startISO;
      details.append(node('summary', label));
      const content = node('div'); details.append(content); let filled = false;
      const saved = openState.get(row.startISO);
      const fill = () => {
        if (!details.open || filled || !active || runVersion !== version) return;
        filled = true;
        if (row.status !== 'available') { content.append(node('p', `Sample unavailable: ${row.reason}`)); return; }
        content.append(node('p', `Sample taken at ${row.startISO}. The interval end is ${row.endISO}; the class is not assumed to last throughout that interval.`, 'dg-note'));
        for (const tradition of row.guidance.traditions) {
          const section = node('section'); section.append(node('h4', tradition.label));
          selectItems(tradition).forEach(item => section.append(compactItem(item))); content.append(section);
        }
        const rules = node('details', null, 'dg-hour-rules'); rules.append(node('summary', 'Inspect every rule and measured position'), allRules(row.guidance)); content.append(rules);
        rules.open = !!saved?.rulesOpen;
        for (const rule of rules.querySelectorAll('[data-rule-id]')) rule.open = saved?.ruleIds.includes(rule.dataset.ruleId) || false;
      };
      details.addEventListener('toggle', fill, { signal });
      host.append(details);
      if (saved) { details.open = true; fill(); }
    }
  }
  function update(inputOrComparison) {
    if (!active) return null;
    const previousOpen = new Set([...container.querySelectorAll('.dg-all-rules details[open][data-rule-id]')].map(el => el.dataset.ruleId));
    const previousKey = cacheKey;
    const previousHourlyOpen = new Map([...container.querySelectorAll('.dg-hour[open][data-hour-start]')].map(hour => [hour.dataset.hourStart, { rulesOpen: !!hour.querySelector('.dg-hour-rules[open]'), ruleIds: [...hour.querySelectorAll('[data-rule-id][open]')].map(rule => rule.dataset.ruleId) }]));
    const preserveHours = !!container.querySelector('.dg-hours[open]'), preserveRules = !!container.querySelector('.dg-all-rules[open]');
    version++; const runVersion = version; cancel(); current = null; container.replaceChildren();
    if (!inputOrComparison) { hourlyCache = null; cacheKey = null; container.append(node('p', 'Update the reading to calculate guidance for the current inputs.', 'dg-note')); return null; }
    let guide;
    try { guide = buildDayGuidance(inputOrComparison); }
    catch (error) { const message = node('p', `Guidance unavailable: ${error.message}`, 'dg-error'); message.setAttribute('role', 'status'); container.append(message); return null; }
    current = guide;
    const key = JSON.stringify([guide.context.localDate, guide.context.timeZone, guide.context.lat, guide.context.lon, guide.context.system, guide.context.prayerMethod, guide.context.asr, guide.context.highLatitude]);
    if (key !== cacheKey) { hourlyCache = null; cacheKey = key; }
    const restoreHourlyOpen = key === previousKey ? previousHourlyOpen : new Map();
    container.append(node('h3', 'A source-led guide for this sample'), node('p', guide.sampleScope.label, 'dg-context'), node('p', 'Use these historical classes as optional reflection prompts. Each tradition keeps its own rules; favorable and caution testimonies are shown together.', 'dg-intro'));
    const overview = node('div', null, 'dg-overview');
    for (const tradition of guide.traditions) {
      const section = node('section', null, 'dg-tradition'); section.append(node('h4', tradition.label));
      selectItems(tradition).forEach(item => section.append(compactItem(item))); overview.append(section);
    }
    container.append(overview);
    for (const tension of guide.tensions) container.append(node('p', tension.text, 'dg-tension'));
    const rules = node('details', null, 'dg-all-rules'); rules.append(node('summary', 'Inspect every rule, measurement and source'), allRules(guide)); rules.open = preserveRules;
    for (const details of rules.querySelectorAll('[data-rule-id]')) details.open = previousOpen.has(details.dataset.ruleId);
    container.append(rules);
    const hours = node('details', null, 'dg-hours'); hours.append(node('summary', 'Explore the selected date hour by hour'));
    const status = node('p', 'Hourly calculations start when you open this section. No background hourly job runs.', 'dg-note'); status.setAttribute('role', 'status');
    const hourlyHost = node('div', null, 'dg-hourly-results'); hours.append(status, hourlyHost); container.append(hours);
    let computed = false;
    function loadHours() {
      if (!hours.open || computed || !active || version !== runVersion) return;
      computed = true;
      if (hourlyCache) { renderHourly(hourlyCache, hourlyHost, runVersion, controller.signal, restoreHourlyOpen); status.textContent = 'Hourly samples reused for this same date, observer and methods.'; return; }
      status.textContent = 'Calculating the real civil-day intervals and sampled rules…'; hourlyHost.setAttribute('aria-busy', 'true');
      timer = win.setTimeout(() => {
        timer = null; if (!active || runVersion !== version || !hours.open) { computed = false; hourlyHost.removeAttribute('aria-busy'); return; }
        try {
          const report = buildHourlyGuidance({ ...guide.context, date: guide.context.localDate });
          if (!active || runVersion !== version) return;
          hourlyCache = report; renderHourly(report, hourlyHost, runVersion, controller.signal, restoreHourlyOpen);
          status.textContent = 'Hourly samples calculated locally. Expand an interval to inspect its readings and source rules.';
        } catch (error) { status.textContent = `Hourly samples unavailable: ${error.message}`; computed = false; }
        finally { hourlyHost.removeAttribute('aria-busy'); }
      }, 0);
    }
    hours.addEventListener('toggle', loadHours, { signal: controller.signal });
    hours.open = preserveHours;
    if (preserveHours) loadHours();
    const limitations = node('details', null, 'dg-limitations'); limitations.append(node('summary', 'Scope and limits'));
    const ul = node('ul'); guide.limitations.forEach(text => ul.append(node('li', text))); limitations.append(ul); container.append(limitations);
    return current;
  }
  function destroy() { if (!active) return; active = false; version++; cancel(); controller.abort(); current = null; hourlyCache = null; cacheKey = null; container.replaceChildren(); }
  update(initialInput);
  return { update, destroy };
}
