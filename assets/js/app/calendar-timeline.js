// A view over one canonical frame. Calendar/planet values are never computed by
// presentation. Input changes terminate their worker and invalidate all exports.
import { downloadBlob } from './state.js';
const ROOT = new URL('../../../', import.meta.url);
const $ = id => document.getElementById(id);
const node = (tag, text, className) => { const n = document.createElement(tag); if (text != null) n.textContent = String(text); if (className) n.className = className; return n; };
const arr = value => Array.isArray(value) ? value : [];
const human = value => String(value ?? '').replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
const valueText = value => value == null ? 'Unavailable' : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
const decimal = (value, places = 3) => Number.isFinite(value) ? value.toFixed(places) : 'Unavailable';
const degrees = value => Number.isFinite(value) ? decimal(value) + '°' : 'Unavailable';
const dateLabel = (date, short = false) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
const xml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const SYSTEMS = { regiomontanus: 'Regiomontanus', placidus: 'Placidus', whole: 'Whole sign', equal: 'Equal' };
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const GLYPHS = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇', Rahu: '☊', Ketu: '☋' };
const DEFAULTS = { startDate: '2026-10-30', endDate: '2031-01-01', time: '12:00:00', timeZone: 'Europe/London', lat: 51.5074, lon: -.1278, system: 'regiomontanus', disambiguation: 'reject', includeCatalogStars: false, includeGuidance: true };
const list = values => { const ul = node('ul'); for (const value of arr(values)) ul.append(node('li', valueText(value))); return ul; };
const details = (title, content) => { const d = node('details'); d.append(node('summary', title), typeof content === 'string' ? node('p', content) : content); return d; };
const safeURL = raw => { if (!raw) return null; try { const u = new URL(raw, ROOT); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; } };
const sourceLink = source => { const n = node(safeURL(source.url || source.sourceUrl) ? 'a' : 'span', source.title || source.label || source.id); const url = safeURL(source.url || source.sourceUrl); if (url) { n.href = url; if (new URL(url).origin !== location.origin) { n.target = '_blank'; n.rel = 'noopener noreferrer'; } } return n; };
const citations = ids => { const div = node('div', null, 'ct-citations'); for (const id of arr(ids)) { const a = node('a', id); a.href = '#ct-source-' + id; a.addEventListener('click', () => { const target = $('ct-source-' + id); if (target) target.closest('details').open = true; }); div.append(a); } return div; };

/** Pure SVG geometry over canonical coordinates, safe to import without a DOM. */
export function calendarTimelinePlateSVG(frame, mode = 'tropical') {
  const sidereal = mode === 'sidereal', chart = sidereal ? frame?.charts?.vedic : frame?.charts?.tropical;
  const bodies = sidereal ? chart?.planets : frame?.sky?.bodies;
  if (!chart || !arr(chart.cusps).every(Number.isFinite) || chart.cusps.length !== 12 || !arr(bodies).every(b => Number.isFinite(b.longitude))) return '';
  const id = sidereal ? 'ct-sidereal-plate' : 'ct-tropical-plate';
  const point = (r, longitude) => { const radians = (longitude - 90) * Math.PI / 180; return [300 + r * Math.cos(radians), 300 + r * Math.sin(radians)]; };
  const line = (r1, r2, lon, stroke, width = 1, extra = '') => { const p = point(r1, lon), q = point(r2, lon); return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`; };
  let marks = '';
  for (let angle = 0; angle < 360; angle += 2) marks += line(angle % 30 === 0 ? 265 : angle % 10 === 0 ? 270 : 275, 281, angle, angle % 30 === 0 ? '#263b36' : '#89917e', angle % 30 === 0 ? 1.2 : .6);
  for (let i = 0; i < 12; i++) {
    const p = point(252, i * 30 + 15), cusp = chart.cusps[i], next = chart.cusps[(i + 1) % 12], mid = cusp + ((next - cusp + 360) % 360) / 2, h = point(226, mid);
    marks += `<text x="${p[0]}" y="${p[1]}" dominant-baseline="central" text-anchor="middle" fill="#263b36" font-size="10" font-family="Georgia,serif" letter-spacing=".5">${SIGNS[i].toUpperCase()}</text>`;
    marks += line(73, 237, cusp, i % 3 === 0 ? '#9a674e' : '#b8bdab', i % 3 === 0 ? 1.1 : .6);
    marks += `<text x="${h[0]}" y="${h[1]}" dominant-baseline="central" text-anchor="middle" fill="#6a7465" font-size="10" font-family="monospace">${i + 1}</text>`;
  }
  bodies.forEach((b, i) => {
    const r = 97 + i * (111 / Math.max(1, bodies.length - 1)), p = point(r, b.longitude), q = point(238, b.longitude), copper = ['Sun','Moon'].includes(b.id);
    marks += `<circle cx="300" cy="300" r="${r}" fill="none" stroke="#d6d7c9" stroke-width=".45"/>`;
    marks += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${copper ? '#93442c' : '#61796b'}" stroke-width=".7" stroke-dasharray="2 4"/>`;
    marks += `<g data-body="${xml(b.id)}" data-longitude="${b.longitude}"><title>${xml(b.id)} · ${degrees(b.longitude)}${b.retrograde ? ' · retrograde' : ''}</title><circle cx="${p[0]}" cy="${p[1]}" r="11" fill="#fbf8ef" stroke="${copper ? '#93442c' : '#426151'}" stroke-width="1.2"/><text x="${p[0]}" y="${p[1] + 1}" dominant-baseline="central" text-anchor="middle" fill="${copper ? '#93442c' : '#263b36'}" font-family="Georgia,serif" font-size="17">${xml(GLYPHS[b.id] || b.id.slice(0, 2))}</text></g>`;
  });
  const instant = frame.context.dateISO;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-labelledby="${id}-title ${id}-desc" data-date-iso="${xml(instant)}"><title id="${id}-title">${sidereal ? 'Sidereal traditional grahas' : 'Tropical ten-body sky'} at ${xml(instant)}</title><desc id="${id}-desc">Canonical positions and twelve ${sidereal ? 'whole-sign sidereal' : xml(chart.actualSystem)} house cusps. Zero Aries at top; longitude increases clockwise. Individual ring radii are a diagram convention, not distance. Full names and numerical values appear in the companion tables.</desc><circle cx="300" cy="300" r="289" fill="#f6f1e7" stroke="#c6c5b5"/><circle cx="300" cy="300" r="284" fill="none" stroke="#c6c5b5"/><circle cx="300" cy="300" r="240" fill="none" stroke="#a6ae9a"/>${marks}<circle cx="300" cy="300" r="70" fill="#f6f1e7" stroke="#c6c5b5"/><circle cx="300" cy="300" r="65" fill="none" stroke="#d4d1c0"/><text x="300" y="287" text-anchor="middle" fill="#93442c" font-family="monospace" font-size="10" letter-spacing="1.6">${sidereal ? 'SIDEREAL' : 'TROPICAL'}</text><text x="300" y="312" text-anchor="middle" fill="#263b36" font-family="Georgia,serif" font-size="21">${bodies.length} ${sidereal ? 'grahas' : 'bodies'}</text><path d="M293 332 H307 M300 325 V339" stroke="#93442c" stroke-width=".6"/><metadata>${xml(JSON.stringify({ kind: 'calendar-timeline-plate', mode, dateISO: instant, frame: chart.frame, bodies: bodies.map(b => ({ id: b.id, longitude: b.longitude })), cusps: chart.cusps, radialDistancePhysical: false }))}</metadata></svg>`;
}

export function initCalendarTimeline() {
  let grid = null, frame = null, worker = null, revision = 0, selectedIndex = 0, busy = false, request = null, active = true, history = null, marker = null;
  const selectedFamilies = new Set(), main = document.querySelector('.calendar-timeline');
  const sourceRows = new Map();
  function state(name, message) { main.dataset.state = name; $('ct-status').textContent = message; $('ct-chart-state').textContent = name === 'loading' ? 'Updating the linked instruments…' : name === 'ready' ? 'One shared instant across all instruments' : message; }
  function exportsEnabled(enabled) { $('ct-json').disabled = !enabled; $('ct-csv').disabled = !enabled; }
  function controls() {
    const navigable = Boolean(grid && request);
    $('ct-date').disabled = !navigable; $('ct-slider').disabled = !navigable;
    $('ct-prev').disabled = !navigable || selectedIndex <= 0;
    $('ct-next').disabled = !navigable || selectedIndex >= grid.slots.length - 1;
    $('ct-cancel').disabled = !busy;
    $('ct-linked-controls').hidden = !navigable; $('ct-chart-prev').disabled = !navigable || selectedIndex <= 0; $('ct-chart-next').disabled = !navigable || selectedIndex >= grid.slots.length - 1;
    $('ct-prev').setAttribute('aria-label', 'Previous ' + $('ct-step-unit').value);
    $('ct-next').setAttribute('aria-label', 'Next ' + $('ct-step-unit').value);
  }
  function stop() { revision++; worker?.terminate(); worker = null; busy = false; controls(); }
  function invalidate(message = 'Settings changed. Apply them to calculate the updated moment.') {
    stop(); frame = null; grid = null; request = null; $('ct-pending-space').hidden = true; $('ct-output').hidden = true; $('ct-output').removeAttribute('data-date-iso');
    $('ct-stale').hidden = false; $('ct-error').hidden = true; $('ct-unavailable').hidden = true; $('ct-export-status').textContent = ''; exportsEnabled(false);
    $('ct-atlas-link').href = new URL('pages/calendar-atlas.html', ROOT).href;
    $('ct-sources').replaceChildren(node('p', 'Apply the updated settings to display their source records.', 'ct-note')); sourceRows.clear();
    state('stale', message); controls();
  }
  function fail(message) { $('ct-pending-space').hidden = true; busy = false; worker?.terminate(); worker = null; $('ct-error').textContent = message; $('ct-error').hidden = false; frame = null; $('ct-output').hidden = true; exportsEnabled(false); state('error', 'Calculation unavailable. Correct the settings and choose Apply settings to retry.'); $('ct-settings').open = true; controls(); }
  function operate(type, input, index, done) {
    stop(); const id = revision; busy = true; controls();
    if (typeof Worker === 'undefined') { fail('This browser cannot run the calculation worker. Use a browser with module Worker support and choose Apply settings to retry.'); return; }
    try {
      worker = new Worker(new URL('../workers/calendar-timeline-worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = ({ data }) => { if (!active || id !== revision || data.requestId !== id || data.type !== type) return; worker?.terminate(); worker = null; busy = false; controls(); if (data.error) { fail(data.error.message); return; } done(data.result); };
      worker.onerror = event => { event.preventDefault(); if (id === revision && active) fail(event.message || 'The calculation worker could not load. Check the connection and retry.'); };
      worker.postMessage({ requestId: id, type, request: input, index });
    } catch (error) { fail(error.message); }
  }
  function readRequest() {
    for (const id of ['ct-start','ct-end','ct-time','ct-zone','ct-lat','ct-lon']) if (!$(id).value.trim()) throw new RangeError('Complete the range, clock, time zone and both observer coordinates.');
    return { startDate: $('ct-start').value, endDate: $('ct-end').value, time: $('ct-time').value, timeZone: $('ct-zone').value.trim(), lat: Number($('ct-lat').value), lon: Number($('ct-lon').value), system: $('ct-system').value, disambiguation: $('ct-fold').value, includeGuidance: true, includeCatalogStars: false };
  }
  function fillSettings(r) { for (const [id, key] of Object.entries({ 'ct-start':'startDate','ct-end':'endDate','ct-time':'time','ct-zone':'timeZone','ct-lat':'lat','ct-lon':'lon','ct-system':'system','ct-fold':'disambiguation' })) $(id).value = r[key]; }
  function updateDate(index) {
    selectedIndex = Math.max(0, Math.min(grid.slots.length - 1, index)); const slot = grid.slots[selectedIndex];
    $('ct-date').value = slot.localDate; $('ct-slider').value = String(selectedIndex); $('ct-slider').setAttribute('aria-valuetext', dateLabel(slot.localDate) + ' at ' + slot.localTime + ' ' + request.timeZone);
    $('ct-slider').style.setProperty('--ct-progress', (selectedIndex / Math.max(1, grid.slots.length - 1) * 100) + '%');
    $('ct-date-heading').textContent = dateLabel(slot.localDate); $('ct-chart-date').textContent = dateLabel(slot.localDate); $('ct-selected-context').textContent = `${slot.localTime} · ${request.timeZone} · explicit study clock`;
    controls();
  }
  function select(index) {
    if (!grid || !request) return;
    updateDate(index); frame = null; exportsEnabled(false); if (!$('ct-output').hidden) { $('ct-pending-space').style.height = $('ct-output').getBoundingClientRect().height + 'px'; $('ct-pending-space').hidden = false; } $('ct-output').hidden = true; $('ct-output').removeAttribute('data-date-iso'); $('ct-error').hidden = true; $('ct-unavailable').hidden = true; $('ct-stale').hidden = true;
    $('ct-sources').replaceChildren(node('p', 'Calculating the selected moment; its source records will appear with the result.', 'ct-note'));
    state('loading', 'Calculating the selected instant across the sky and calendar traditions…');
    operate('frame', request, selectedIndex, result => {
      frame = result; renderSources(result.sources); $('ct-limitations').replaceChildren(...list(result.limitations).children);
      if (result.status !== 'available') { renderUnavailable(result); return; }
      renderFrame(result); state('ready', `All instruments show ${result.context.dateISO}. One local-clock sample; no whole-day verdict.`); controls(); exportsEnabled(true);
    });
  }
  function apply(desiredDate = $('ct-date').value) {
    invalidate('Building the date grid for the entered range…'); $('ct-stale').hidden = true;
    let input; try { input = readRequest(); } catch (error) { fail(error.message); return; }
    state('loading', 'Resolving the local clock for every date in this range…');
    operate('grid', input, 0, result => {
      grid = result; request = result.request; selectedIndex = Math.max(0, result.slots.findIndex(s => s.localDate === desiredDate));
      $('ct-date').min = request.startDate; $('ct-date').max = request.endDate; $('ct-slider').max = String(result.slots.length - 1);
      $('ct-start-label').textContent = dateLabel(request.startDate, true); $('ct-end-label').textContent = dateLabel(request.endDate, true);
      $('ct-slot-count').textContent = `${result.counts.total.toLocaleString()} dates · ${result.counts.ambiguous + result.counts.unavailable} unresolved`;
      $('ct-settings-summary').textContent = `${request.timeZone} · ${request.time} · ${SYSTEMS[request.system]}`;
      select(selectedIndex);
    });
  }
  function renderUnavailable(result) {
    $('ct-pending-space').hidden = true;
    const host = $('ct-unavailable'); host.replaceChildren(node('strong', 'This clock sample is ' + human(result.status)), node('p', result.slot.reason));
    if (result.slot.selectedDateISO) host.append(node('p', 'Resolved UTC instant: ' + result.slot.selectedDateISO));
    for (const candidate of result.slot.candidates) host.append(node('p', `Occurrence ${candidate.occurrence || 1}: ${candidate.dateISO} · UTC offset ${candidate.offsetSeconds / 3600} hours`));
    if (result.status === 'ambiguous') host.append(node('p', 'Open the settings, choose the earlier or later occurrence, then Apply settings.'));
    host.hidden = false; $('ct-output').hidden = true; exportsEnabled(false); state('unavailable', 'The selected date remains on the slider. No substitute instant has been calculated.'); controls();
  }
  function renderFrame(result) {
    const c = result.context, a = result.comparison.astronomy, tropical = result.charts.tropical, vedic = result.charts.vedic;
    $('ct-output').dataset.dateIso = c.dateISO;
    $('ct-instant').textContent = `${c.dateISO}\n${c.localDate} · ${c.localTime} · ${c.timeZone}\n${decimal(c.lat, 4)}° N · ${decimal(c.lon, 4)}° E`;
    $('ct-tropical').innerHTML = calendarTimelinePlateSVG(result, 'tropical'); $('ct-sidereal').innerHTML = calendarTimelinePlateSVG(result, 'sidereal');
    $('ct-tropical-system').textContent = SYSTEMS[tropical.actualSystem] || tropical.actualSystem;
    $('ct-tropical-caption').textContent = `Ten calculated bodies; twelve ${SYSTEMS[tropical.actualSystem] || tropical.actualSystem} house cusps. Requested: ${SYSTEMS[tropical.requestedSystem] || tropical.requestedSystem}.${tropical.warning ? ' ' + tropical.warning : ''}`;
    $('ct-sidereal-caption').textContent = `Seven traditional bodies and two mean lunar nodes. Whole-sign houses; linear Lahiri estimate ${degrees(vedic.ayanamsha.degrees)}. This approximation is not exact JHora equivalence.`;
    const measures = [['Lunar phase · broad sector', a.phaseLabel], ['Moon illumination', decimal(a.moonIlluminatedFraction * 100, 1) + '%'], ['Moon–Sun elongation', degrees(a.moonSunElongation)], ['Sidereal lunar mansion', vedic.panchanga?.nakshatra?.sanskrit || vedic.panchanga?.nakshatra?.name || 'Unavailable']];
    $('ct-measures').replaceChildren(...measures.map(([label, value]) => { const d = node('div'); d.append(node('dt', label), node('dd', value)); return d; }));
    const table = (id, rows) => { $(id).querySelector('tbody').replaceChildren(...rows.map(values => { const tr = node('tr'); values.forEach((v, i) => { const td = node(i === 0 ? 'th' : 'td', valueText(v)); if (i === 0) td.scope = 'row'; tr.append(td); }); return tr; })); $(id).dataset.dateIso = c.dateISO; };
    table('ct-planets', result.sky.bodies.map(b => [b.name, degrees(b.longitude), degrees(b.latitude), tropical.placements.find(p => p.id === b.id)?.house, b.retrograde ? 'Retrograde' : 'Direct']));
    table('ct-houses', tropical.cusps.map((longitude, i) => [i + 1, degrees(longitude), degrees(vedic.cusps[i])]));
    table('ct-grahas', vedic.planets.map(p => [p.id, degrees(p.longitude), p.sign, p.house, `${p.nakshatra.sanskrit || p.nakshatra.name} · pāda ${p.nakshatra.pada}`]));
    renderFamilies(result); renderCalendars(result); renderRules(result); renderTasks(result); renderEvents(result);
    for (const id of ['ct-tropical','ct-sidereal','ct-measures','ct-calendars','ct-rules','ct-tasks','ct-events']) $(id).dataset.dateIso = c.dateISO;
    const atlasURL = new URL('pages/calendar-atlas.html', ROOT); for (const [k, v] of Object.entries({ at:c.dateISO,lat:c.lat,lon:c.lon,zone:c.timeZone,system:c.system })) atlasURL.searchParams.set(k, String(v)); $('ct-atlas-link').href = atlasURL.href;
    $('ct-pending-space').hidden = true; $('ct-output').hidden = false;
  }
  function renderFamilies(result) {
    if ($('ct-families').querySelector('input')) return;
    for (const family of result.atlas.families) {
      selectedFamilies.add(family.id); const label = node('label'), input = node('input'); input.type = 'checkbox'; input.value = family.id; input.checked = true;
      input.addEventListener('change', () => { input.checked ? selectedFamilies.add(family.id) : selectedFamilies.delete(family.id); if (frame?.status === 'available') renderCalendars(frame); }); label.append(input, node('span', family.label)); $('ct-families').append(label);
    }
  }
  function renderCalendars(result) {
    const rows = result.atlas.rows.filter(r => selectedFamilies.has(r.familyId)); $('ct-calendars').replaceChildren();
    $('ct-calendar-count').textContent = `${rows.length} named methods in ${selectedFamilies.size} selected families. ${rows.filter(r => r.status === 'unavailable').length} explicitly unavailable. Family selection changes this display; downloads retain the complete selected frame.`;
    if (!rows.length) { $('ct-calendars').append(node('p', 'Select a calendar family to display its dates and methods.', 'ct-note ct-no-calendars')); return; }
    for (const row of rows) {
      const article = node('article', null, 'ct-calendar'); article.dataset.calendarId = row.id; article.dataset.dateIso = result.context.dateISO;
      article.append(node('p', human(row.kind), 'ct-kicker'), node('h3', row.label), node('p', row.summary || row.result?.text || row.reason || 'Unavailable', 'ct-calendar-value'), node('p', `${human(row.status)} · ${human(row.boundary)}`, 'ct-note'));
      const body = node('div'); body.append(node('p', row.method), node('p', 'Validation: ' + row.validation), list(row.limitations), citations(row.sourceIds)); if (row.reason) body.append(node('p', row.reason));
      article.append(details('Method, source & limits', body)); $('ct-calendars').append(article);
    }
  }
  function renderRules(result) {
    $('ct-rules').replaceChildren();
    for (const tradition of arr(result.guidance?.traditions)) {
      const article = node('article', null, 'ct-lens'); article.append(node('h3', tradition.label));
      for (const rule of tradition.items) {
        const block = node('details', null, 'ct-rule'); block.append(node('summary', rule.title), node('p', rule.reading), node('p', 'Named classification: ' + human(rule.classification) + ' · sampled instant only', 'ct-note'));
        block.append(node('p', rule.algorithm || rule.rule?.algorithm, 'ct-note'), node('p', rule.sourceStatus, 'ct-note'), list(rule.limitations), citations(rule.sourceIds));
        block.append(details('Calculated inputs & thresholds', node('pre', JSON.stringify({ computed:rule.computed,thresholds:rule.thresholds }, null, 2)))); article.append(block);
      }
      $('ct-rules').append(article);
    }
    if (!$('ct-rules').children.length) $('ct-rules').append(node('p', 'Traditional guidance is unavailable for this instant.', 'ct-note'));
  }
  function renderTasks(result) {
    $('ct-tasks').replaceChildren();
    for (const task of arr(result.studyTasks)) {
      const card = node('article', null, 'ct-task'); card.dataset.taskId = task.id;
      card.append(node('h4', task.label), node('p', task.summary), node('p', task.status === 'available' ? `This sample: ${decimal(task.score, 0)} editorial index points · ${task.result.observed}/${task.result.total} required contributions observed.` : `${human(task.status)}: ${task.reason || 'Required inputs are missing.'}`, 'ct-note'), node('p', task.optionalAction));
      const evidence = node('div'); evidence.append(node('p', task.sourceNote), list(task.calculationRequirements), list(task.limitations), citations(task.sourceIds));
      if (task.result) evidence.append(node('p', task.method), node('pre', JSON.stringify({ scoreNumerator:task.result.scoreNumerator,scoreDenominator:task.result.scoreDenominator,contributions:task.result.contributions,missing:task.result.missing }, null, 2)));
      card.append(details('Requirements & evidence', evidence)); $('ct-tasks').append(card);
    }
  }
  function renderEvents(result) {
    const row = result.atlas.rows.find(r => r.id === 'chinese-solar-terms'), events = row?.result;
    $('ct-events').replaceChildren();
    const nearby = result.astronomicalEvents;
    if (nearby) {
      $('ct-events').append(node('h3', 'Nearby lunar quarters & solar seasons'), node('p', `${nearby.startISO} to ${nearby.endISO}. ${nearby.timing || ''}`, 'ct-note'));
      const nearList = node('ul', null, 'ct-events-list');
      for (const event of arr(nearby.events)) { const li = node('li'); li.append(node('strong', event.label), node('br'), node('time', event.dateISO), node('span', ` · observer date ${event.localDate}, ${event.localTime} ${result.context.timeZone}`), node('p', event.definition, 'ct-note')); nearList.append(li); }
      $('ct-events').append(nearList, list(nearby.limitations));
      if (!nearby.events?.length) $('ct-events').append(node('p', 'No supported event in this bounded interval.', 'ct-note'));
    }
    $('ct-events').append(node('h3', 'Chinese solar-term convention'));
    if (!events?.events?.length) { $('ct-events').append(node('p', row?.reason || 'Solar-term events are unavailable.', 'ct-note')); return; }
    if (events.nextEvent) $('ct-events').append(node('p', `Next calculated solar term: ${events.nextEvent.name} · ${events.nextEvent.instantUTC} UTC instant; ${events.nextEvent.observerDate} ${events.nextEvent.observerTime} in ${result.context.timeZone}.`));
    $('ct-events').append(node('p', `${events.referenceYear} reference year in ${events.referenceTimeZone}. ${events.precisionNote || ''}`, 'ct-note'), citations(row.sourceIds));
    const ul = node('ul', null, 'ct-events-list');
    for (const e of events.events) { const li = node('li'); li.append(node('strong', `${e.name} · ${e.longitudeDegrees}°`), node('br'), node('time', e.instantUTC), node('span', ` · observer date ${e.observerDate}, ${e.observerTime} ${result.context.timeZone}`)); ul.append(li); }
    $('ct-events').append(details('All 24 solved solar terms in the reference year', ul));
  }
  function renderSources(sources) {
    sourceRows.clear(); for (const source of arr(sources)) sourceRows.set(source.id, source);
    $('ct-sources').replaceChildren();
    for (const source of sourceRows.values()) {
      const article = node('article', null, 'ct-source'); article.id = 'ct-source-' + source.id; article.append(sourceLink(source));
      for (const key of ['id','author','publisher','claimType','edition','locator','section','readingDepth','readingStatus','accessDepth','accessStatus','rights','status']) if (source[key]) article.append(node('p', human(key) + ': ' + valueText(source[key])));
      article.append(list(source.limitations)); $('ct-sources').append(article);
    }
  }
  function clearMarker() { marker = null; $('ct-history-assumption').hidden = true; }
  function step(direction) {
    if (!grid) return; clearMarker(); const date = new Date(grid.slots[selectedIndex].localDate + 'T12:00:00Z'), unit = $('ct-step-unit').value;
    if (unit === 'day') return select(selectedIndex + direction);
    const day = date.getUTCDate(); date.setUTCDate(1); if (unit === 'month') date.setUTCMonth(date.getUTCMonth() + direction); else date.setUTCFullYear(date.getUTCFullYear() + direction);
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate(); date.setUTCDate(Math.min(day, last));
    const offset = Math.round((Date.parse(date.toISOString().slice(0,10) + 'T00:00:00Z') - Date.parse(request.startDate + 'T00:00:00Z')) / 86400000); select(offset);
  }
  function exportResult(type) {
    if (!frame || frame.status !== 'available' || busy) return;
    const date = frame.context.localDate, saved = frame, selectedRequest = request, index = selectedIndex;
    exportsEnabled(false); state('loading', `Preparing the ${type.toUpperCase()} download for the displayed instant…`);
    operate(type, selectedRequest, index, result => { if (frame !== saved) return; downloadBlob(new Blob([result], { type: type === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8' }), `calendar-timeline-${date}.${type}`); exportsEnabled(true); state('ready', 'The displayed instant and source context are ready.'); $('ct-export-status').textContent = `${type.toUpperCase()} downloaded for ${saved.context.dateISO}, including the entered observer and complete frame.`; });
  }
  $('ct-form').addEventListener('submit', event => { event.preventDefault(); apply(); });
  $('ct-form').addEventListener('input', () => { marker = null; $('ct-history-assumption').hidden = true; invalidate(); });
  $('ct-form').addEventListener('change', () => { marker = null; $('ct-history-assumption').hidden = true; invalidate(); });
  $('ct-slider').addEventListener('input', () => { clearMarker(); select(Number($('ct-slider').value)); });
  $('ct-date').addEventListener('change', () => { if (!grid) return; const index = grid.slots.findIndex(s => s.localDate === $('ct-date').value); if (index < 0) { $('ct-error').textContent = 'Choose a date inside the applied range, or edit the range in settings.'; $('ct-error').hidden = false; $('ct-date').value = grid.slots[selectedIndex].localDate; return; } clearMarker(); select(index); });
  $('ct-chart-prev').addEventListener('click', () => { clearMarker(); select(selectedIndex - 1); }); $('ct-chart-next').addEventListener('click', () => { clearMarker(); select(selectedIndex + 1); });
  $('ct-prev').addEventListener('click', () => step(-1)); $('ct-next').addEventListener('click', () => step(1)); $('ct-step-unit').addEventListener('change', controls);
  $('ct-cancel').addEventListener('click', () => { stop(); frame = null; $('ct-pending-space').hidden = true; $('ct-output').hidden = true; $('ct-output').removeAttribute('data-date-iso'); $('ct-sources').replaceChildren(node('p', 'Calculation cancelled. Apply settings or choose a date to restore its source records.', 'ct-note')); exportsEnabled(false); state('cancelled', 'Calculation cancelled. Choose another date or Apply settings to restart.'); });
  $('ct-reset').addEventListener('click', () => { marker = null; $('ct-history-assumption').hidden = true; fillSettings(DEFAULTS); apply(DEFAULTS.startDate); });
  $('ct-json').addEventListener('click', () => exportResult('json')); $('ct-csv').addEventListener('click', () => exportResult('csv'));
  window.addEventListener('pagehide', () => { active = false; stop(); frame = null; exportsEnabled(false); });
  window.addEventListener('pageshow', event => { active = true; if (event.persisted) apply(); });
  fillSettings(DEFAULTS); apply(DEFAULTS.startDate);
  // History catalogue is loaded independently; a source-load failure must not
  // take the live calendar instruments down with it.
  import('../core/data/timeline-history.js').then(data => { history = data; renderHistory(); }).catch(error => { $('ct-history').replaceChildren(node('p', `Historical markers could not load: ${error.message}. Reload the page to retry.`, 'ct-error')); });
  function renderHistory() {
    $('ct-history').replaceChildren();
    const sources = new Map(arr(history.TIMELINE_HISTORY_SOURCES).map(s => [s.id, s]));
    for (const event of arr(history.TIMELINE_HISTORY_EVENTS)) {
      const date = event.date, article = node('article', null, 'ct-history-record'); article.dataset.historyId = event.id;
      const text = node('div'); text.append(node('h3', event.title || event.label), node('p', event.summary || event.description || event.meaning), node('p', `${human(event.eventType)} · ${event.countries?.join(', ') || event.scope || ''}`), node('p', 'Source event clock: unknown in this catalogue (not verified). Any chart uses the entered observer and an explicitly assumed study clock.'));
      const evidence = node('div'); evidence.append(node('p', valueText(event.precision || event.datePrecision || 'date only')), node('p', event.scopeNote), node('p', event.time?.qualification), node('p', `Place record: ${event.eventPlace?.label || 'Unspecified'}; zone and coordinates are not certified.`), node('p', 'Source status: ' + human(event.sourceStatus)), node('p', 'Source lineages: ' + arr(event.sourceFamilies).join(', ')), node('p', event.originalCalendar ? 'Original calendar: ' + valueText(event.originalCalendar) : ''), list(event.notes), list(event.limitations));
      for (const id of arr(event.sourceIds)) { const source = sources.get(id); if (source) { const block = node('div', null, 'ct-source'); block.append(sourceLink(source)); for (const key of ['institution','locator','edition','accessedAt','accessStatus','readingStatus','readingDepth','accessDepth','rights','scope']) if (source[key]) block.append(node('p', human(key) + ': ' + valueText(source[key]))); block.append(list(source.notes)); evidence.append(block); } }
      text.append(details('Event meaning & sources', evidence));
      const button = node('button', 'Study this date →'); button.type = 'button'; button.dataset.historyDate = date;
      if (typeof date !== 'string' || date < '1900-01-01' || date > '2100-12-31') { button.disabled = true; button.textContent = 'Outside calculation range'; }
      else button.addEventListener('click', () => jumpHistory(event));
      const actions = node('div', null, 'ct-history-actions'); actions.append(button);
      const download = node('button', 'Source record · JSON'); download.type = 'button'; download.dataset.historyExport = event.id;
      download.addEventListener('click', () => { const record = { kind:'historical-source-record', record:event, sources:arr(event.sourceIds).map(id => sources.get(id)).filter(Boolean), coverage:history.TIMELINE_HISTORY_COVERAGE, limitations:history.TIMELINE_HISTORY_LIMITS, calculationIncluded:false, assumedClockIncluded:false }; downloadBlob(new Blob([JSON.stringify(record, null, 2) + '\n'], {type:'application/json;charset=utf-8'}), `historical-source-${event.id}.json`); });
      actions.append(download); article.append(node('time', date, 'ct-history-date'), text, actions); $('ct-history').append(article);
    }
  }
  function jumpHistory(event) {
    let retained; try { retained = readRequest(); } catch (error) { fail(error.message); return; }
    const center = Date.parse(event.date + 'T12:00:00Z'), bounds = offset => new Date(center + offset * 86400000).toISOString().slice(0,10);
    retained.startDate = bounds(-30) < '1900-01-01' ? '1900-01-01' : bounds(-30); retained.endDate = bounds(30) > '2100-12-31' ? '2100-12-31' : bounds(30);
    marker = event; fillSettings(retained); $('ct-history-assumption').textContent = `Historical marker: ${event.title || event.label} · ${event.date}. Source clock unknown in this catalogue. The ${retained.time} study clock, ${retained.timeZone} zone and observer ${retained.lat}° N, ${retained.lon}° E are retained assumptions, not sourced event time or place.`; $('ct-history-assumption').hidden = false;
    apply(event.date); $('ct-instrument').scrollIntoView({ block:'start', behavior:'instant' }); $('ct-date-heading').focus({ preventScroll:true });
  }
}
