import { getCountryHistoryCatalogue, buildCountryHistoryStudy } from '../core/country-history.js';
import { COUNTRY_HISTORY_METHODS, COUNTRY_HISTORY_HOUSES, COUNTRY_HISTORY_TASKS, COUNTRY_METHOD_SOURCES } from '../core/data/country-history-methods.js';
import { frontispiece } from './art/engravings.js';
import { downloadJSON, downloadBlob } from './state.js';
import { compareMoment } from '../core/calendar-observatory.js';
import { mountDateNavigator } from './date-wayfinding.js';
import { COUNTRY_EVENT_RESEARCH, COUNTRY_EVENT_COUNTRIES, COUNTRY_EVENT_RECORDS, COUNTRY_EVENT_SOURCES, COUNTRY_EVENT_PROFILES, COUNTRY_EVENT_CALCULATION_SOURCES, getCountryEventRecords, getCountryEventRecord, validateCountryResearchChunk } from '../core/data/country-event-research.js';

const $ = id => document.getElementById(id);
const ROOT = new URL('../../../', import.meta.url);
const SYSTEMS = { regiomontanus: 'Regiomontanus', placidus: 'Placidus', whole: 'Whole sign', equal: 'Equal' };
const node = (tag, text, className) => { const item = document.createElement(tag); if (text != null) item.textContent = String(text); if (className) item.className = className; return item; };
const arr = value => Array.isArray(value) ? value : [];
const nonempty = value => value == null || value === '' ? 'Unavailable' : String(value);
const readable = value => String(value ?? '').replaceAll('-', ' ');
const xml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const sourceAnchor = id => `ch-source-${id}`;
const degrees = value => Number.isFinite(value) ? `${value.toFixed(3)}°` : 'Unavailable';
const safeSourceURL = value => { if (!value) return null; try { const url = new URL(value, ROOT); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
const list = values => { const ul = node('ul'); arr(values).filter(Boolean).forEach(value => ul.append(node('li', value))); return ul; };
const citations = ids => { const wrapper = node('div', null, 'ch-citations'); arr(ids).forEach(id => { const link = node('a', id); link.href = `#${sourceAnchor(id)}`; link.addEventListener('click', () => { $('ch-sources').closest('details').open = true; }); wrapper.append(link); }); return wrapper; };
const detail = (title, body) => { const d = node('details'); d.append(node('summary', title), typeof body === 'string' ? node('p', body) : body); return d; };

// The plate only renders the canonical assumed sample. It does not infer a time
// from a source date or calculate a second set of cusp values in presentation.
export function countryHousePlateSVG(sample) {
  if (!sample || sample.status !== 'available' || arr(sample.cusps).length !== 12 || !sample.cusps.every(Number.isFinite)) return '';
  const point = (r, angle) => { const a = (angle - 90) * Math.PI / 180; return [280 + r * Math.cos(a), 280 + r * Math.sin(a)]; };
  const line = (r1, r2, angle, color, width = 1) => { const [x1,y1] = point(r1, angle), [x2,y2] = point(r2,angle); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`; };
  let marks = '';
  for (let angle = 0; angle < 360; angle += 5) marks += line(angle % 30 ? 233 : 225, 240, angle, '#979c8d', angle % 30 ? .7 : 1.1);
  for (let index = 0; index < 12; index++) {
    const cusp = sample.cusps[index], next = sample.cusps[(index + 1) % 12], mid = cusp + ((next - cusp + 360) % 360) / 2;
    const [x, y] = point(175, mid);
    marks += line(70, 216, cusp, index % 3 === 0 ? '#91432c' : '#8b9386', index % 3 === 0 ? 1.6 : .8);
    marks += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="21" fill="#263b36">${index + 1}</text>`;
    const [sx,sy] = point(258,index * 30);
    marks += `<text x="${sx}" y="${sy}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#59665e">${index * 30}°</text>`;
  }
  return `<svg class="ch-house-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" role="img" aria-labelledby="ch-plate-title ch-plate-description"><title id="ch-plate-title">Twelve house cusps at an assumed historical time</title><desc id="ch-plate-description">${xml(sample.dateISO)}; ${xml(SYSTEMS[sample.houseSystem] || sample.houseSystem)}. This time is an assumption, not a sourced event time. Rounded numerical values appear in the adjacent table; JSON and CSV retain full precision. Longitude increases clockwise from zero Aries at the top.</desc><rect width="560" height="560" fill="#f6f1e7"/><g fill="none" stroke="#c8c5b6"><circle cx="280" cy="280" r="245"/><circle cx="280" cy="280" r="220"/><circle cx="280" cy="280" r="216"/><circle cx="280" cy="280" r="70"/><circle cx="280" cy="280" r="64"/></g>${marks}<text x="280" y="272" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#91432c">ASSUMED</text><text x="280" y="294" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#263b36">${xml(sample.localTime)}</text></svg>`;
}

// CSV is a labelled long-form companion to the complete canonical JSON. JSON
// columns retain source metadata and raw numeric precision; null stays empty.
export function countryStudyCSV(study) {
  const columns = ['row_type','record_id','country_id','event_title','record_date','event_time_status','source_event_clock','time_qualification','reference_place','reference_zone','reference_latitude','reference_longitude','status','reason','calendar_id','calendar_label','calendar_text','calendar_boundary','calendar_validation','calendar_parts_json','civil_reference_utc','civil_reference_clock','assumption','sample_utc','sample_local_date','sample_local_time','utc_offset_minutes','occurrence','requested_house_system','actual_house_system','ascendant_degrees','midheaven_degrees','cusps_degrees_json','sampling_method_json','source_ids_json','sources_json','record_json','limits_json','warnings_json','clock_slots_json','clock_changes_json'];
  const rows = [];
  for (const item of study.records) {
    const r = item.record, ref = item.civilComparison.reference, day = item.daySensitivity;
    const base = { record_id:r.id, country_id:r.countryId, event_title:r.title, record_date:r.date, event_time_status:r.time.status, source_event_clock:r.time.localTime, time_qualification:r.time.qualification, reference_place:r.eventPlace.label, reference_zone:r.eventPlace.zone, reference_latitude:r.eventPlace.lat, reference_longitude:r.eventPlace.lon, source_ids_json:r.sourceIds, sources_json:study.sources, record_json:r, requested_house_system:study.selection.houseSystem };
    rows.push({ ...base, row_type:'record', status:item.coverage.status, reason:item.coverage.reason, limits_json:study.limitations, warnings_json:item.coverage.warnings, sampling_method_json:day.method, clock_slots_json:day.clockSlots, clock_changes_json:day.clockChanges });
    if (!item.civilComparison.rows.length) rows.push({ ...base, row_type:'calendar-unavailable', status:item.civilComparison.status, reason:item.civilComparison.reason, limits_json:item.civilComparison.limitations });
    for (const row of item.civilComparison.rows) rows.push({ ...base, row_type:'calendar', status:row.status, calendar_id:row.id, calendar_label:row.label, calendar_text:row.text, calendar_boundary:row.boundary, calendar_validation:row.validation, calendar_parts_json:row.parts, civil_reference_utc:ref?.dateISO, civil_reference_clock:ref?.localTime, assumption:ref?.assumption, source_ids_json:[...r.sourceIds,...arr(row.sourceIds)], limits_json:[...item.civilComparison.limitations,...arr(row.limitations)], sampling_method_json:row.method });
    if (!day.samples.length) rows.push({ ...base, row_type:'day-sensitivity-status', status:day.status, reason:day.reason, sampling_method_json:day.method, limits_json:day.limitations });
    for (const sample of day.samples) rows.push({ ...base, row_type:'assumed-house-sample', status:sample.status, reason:sample.reason, assumption:sample.assumptionNote, sample_utc:sample.dateISO, sample_local_date:sample.localDate, sample_local_time:sample.localTime, utc_offset_minutes:sample.utcOffsetMinutes, occurrence:sample.occurrence, requested_house_system:sample.requestedHouseSystem, actual_house_system:sample.houseSystem, ascendant_degrees:sample.ascendantDegrees, midheaven_degrees:sample.midheavenDegrees, cusps_degrees_json:sample.cusps, sampling_method_json:day.method, limits_json:day.limitations, warnings_json:sample.warnings });
  }
  const cell = value => { const raw = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value); return `"${raw.replaceAll('"','""')}"`; };
  return [columns.map(cell).join(','),...rows.map(row => columns.map(key => cell(row[key])).join(','))].join('\r\n') + '\r\n';
}

export function initCountryCalendars() {
  initCountryEventResearch();
  let catalogue, study = null, revision = 0, foundingNavigator = null, highlightedId = '';
  const sampleCalendarCache = new Map();
  const countryName = id => catalogue.countries.find(country => country.id === id)?.label || catalogue.countries.find(country => country.id === id)?.name || id;
  const selectedIds = () => [...document.querySelectorAll('#ch-record-picker input:checked')].map(input => input.value);
  const updateCount = () => { const count = selectedIds().length; $('ch-selection-count').textContent = `${count} of ${catalogue.maxRecords} records selected`; updateFoundingAction(); };
  const disableExports = () => { $('ch-json').disabled = true; $('ch-csv').disabled = true; $('ch-export-status').textContent = ''; };
  const invalidate = () => {
    revision++; study = null; disableExports(); updateCount();
    $('ch-ledger').hidden = true; $('ch-ledger-empty').hidden = false; $('ch-ledger-empty').textContent = 'Compare the updated selection to display its historical dates and sources.';
    $('ch-sensitivity-output').hidden = true; $('ch-sensitivity-empty').hidden = false; $('ch-stale').hidden = false;
    $('ch-status').textContent = 'Inputs changed. Compare again to calculate this selection.'; $('ch-error').hidden = true;
  };

  function renderPicker() {
    const wrapper = $('ch-record-picker'); wrapper.replaceChildren();
    for (const country of catalogue.countries) {
      const records = catalogue.records.filter(record => record.countryId === country.id);
      const group = node('details', null, 'ch-country'); group.open = true;
      const summary = node('summary', countryName(country.id)); summary.append(node('span', `${records.length} historical variants`)); group.append(summary);
      for (const record of records) {
        const label = node('label', null, 'ch-record-option'), input = node('input'); input.type = 'checkbox'; input.name = 'record'; input.value = record.id;
        input.id = `ch-record-${record.id}`; input.checked = record === records[0];
        const text = node('span'); text.append(node('strong', record.title), node('small', record.date, 'ch-record-date'), node('small', `${readable(record.time.status)} · ${record.eventPlace.label}`));
        if (Number(record.date.slice(0,4)) < 1900) text.append(node('small', 'Source record retained · calculation outside supported range', 'ch-unavailable'));
        label.append(input,text); group.append(label);
      }
      wrapper.append(group);
    }
    updateCount();
  }

  function updateFoundingAction() {
    const selected = selectedIds().includes(highlightedId);
    $('ch-add-highlighted').disabled = !highlightedId || selected;
    $('ch-add-highlighted').textContent = selected ? 'Highlighted record is in the comparison' : 'Add highlighted record to comparison';
  }

  function renderFoundingNavigation() {
    const id = $('ch-date-country').value;
    const records = catalogue.records.filter(record => record.countryId === id).sort((a,b) => a.date.localeCompare(b.date));
    if (!records.some(record => record.id === highlightedId)) highlightedId = records[0]?.id || '';
    const items = records.map(record => {
      const source = catalogue.sources.find(item => item.id === record.sourceIds[0]);
      return { id: record.id, date: record.date, label: record.title, kind: 'source-claim', summary: record.scopeNote || 'Documented historical milestone; event clock unknown.', sourceLabel: record.sourceIds.join(' · '), sourceUrl: safeSourceURL(source?.url), details: [
        { label: 'Source calendar', value: record.originalCalendar || 'Not established' },
        { label: 'Event clock', value: record.time.localTime || 'Unknown · date-only source record' },
        { label: 'Reference observer', value: `${record.eventPlace.label} · ${record.eventPlace.zone}` },
        { label: 'Calculation', value: Number(record.date.slice(0,4)) < 1900 ? 'Source retained; calculations unavailable before 1900.' : 'Civil comparison uses separately assumed local noon.' },
        { label: 'Source qualification', value: record.time.qualification || record.scopeNote || 'See the complete source record.' },
      ] };
    });
    const options = { id: 'ch-founding-date', label: `${countryName(id)} · founding source dates`, items, value: highlightedId, bookmarkScope: `country-founding:${id}`, compact: true, onSelect: item => { highlightedId = item.id; updateFoundingAction(); $('ch-date-selection-status').textContent = `${item.date} highlighted. Add it to the comparison to calculate supported labels.`; } };
    if (foundingNavigator) foundingNavigator.update(options); else foundingNavigator = mountDateNavigator($('ch-date-navigator'), options);
    $('ch-date-selection-status').textContent = 'Browsing and saving a date keeps your comparison selection intact.';
    updateFoundingAction();
  }

  function renderReference() {
    for (const house of COUNTRY_HISTORY_HOUSES) {
      const article = node('article', null, 'ch-house-reference'), content = node('div');
      article.append(node('span', String(house.number).padStart(2,'0'), 'ch-house-number'));
      content.append(node('h3', house.label),node('p',house.description));
      const notes = node('div'); notes.append(node('p',house.mundaneAnalogy),node('p',house.qualification),node('p',house.source),citations(house.sourceIds));
      content.append(detail('Civic analogy & source limits', notes)); article.append(content); $('ch-houses').append(article);
    }
    for (const task of COUNTRY_HISTORY_TASKS) {
      const article = node('article', null, 'ch-task'); article.append(node('h3',task.label),node('p',task.description),node('p','Information needed:'),list(task.requiredInformation));
      const notes = node('div'); notes.append(list(task.sourceRequirements),node('p',task.limits),node('p',task.source),citations(task.sourceIds)); article.append(detail('Source requirements & limits', notes)); $('ch-tasks').append(article);
    }
    for (const method of COUNTRY_HISTORY_METHODS) {
      const article = node('article', null, 'ch-method'), heading = node('div'), body = node('div');
      heading.append(node('h3',method.label),node('p',method.scope,'ch-footnote')); body.append(node('p',method.summary),list(method.distinctions),list(method.limitations),citations(method.sourceIds)); article.append(heading,body); $('ch-methods').append(article);
    }
  }

  function renderSources(sources) {
    const all = [...catalogue.sources,...sources,...COUNTRY_METHOD_SOURCES], seen = new Set(); $('ch-sources').replaceChildren();
    for (const source of all) {
      if (seen.has(source.id)) continue; seen.add(source.id);
      const li = node('li'); li.id = sourceAnchor(source.id);
      const strong = node('strong', `${source.id} · `), url = safeSourceURL(source.url), title = node(url ? 'a' : 'span',source.title || source.id); if (url) title.href = url;
      strong.append(title); li.append(strong);
      const attribution = [source.institution,source.author,source.edition,source.locator].filter(Boolean).join(' · '); if (attribution) li.append(node('p',attribution));
      li.append(node('p', `Reading: ${nonempty(source.readingStatus || source.accessDepth)}. Rights: ${nonempty(source.rights)}.`));
      const accessed = source.accessedAt || source.checkedAt; if (accessed) li.append(node('p',`Source check: ${accessed}`));
      if (source.note) li.append(node('p',source.note)); arr(source.notes).forEach(note => li.append(node('p',note))); $('ch-sources').append(li);
    }
    $('ch-source-count').textContent = `(${seen.size})`;
  }

  function recordSheet(item, index) {
    const r = item.record, article = node('article',null,'ch-record-sheet');
    article.append(node('p',`${String(index+1).padStart(2,'0')} · ${countryName(r.countryId)}`,'ch-record-label'),node('h3',r.title));
    const date = node('time',r.date); date.dateTime = r.date; article.append(date,node('p',`${readable(r.time.status)}${r.time.localTime ? ` · source clock ${r.time.localTime}` : ' · event clock unknown'}`));
    if (r.scopeNote) article.append(node('p',r.scopeNote));
    const dl = node('dl');
    for (const [label,value] of [['Reference place',r.eventPlace.label],['IANA zone',r.eventPlace.zone],['Coordinates',Number.isFinite(r.eventPlace.lat) && Number.isFinite(r.eventPlace.lon) ? `${r.eventPlace.lat}, ${r.eventPlace.lon} · ${r.eventPlace.precision}` : 'Unavailable'],['Source calendar',r.originalCalendar]]) dl.append(node('dt',label),node('dd',nonempty(value)));
    article.append(dl,citations(r.sourceIds));
    if (item.civilComparison.reference) {
      const ref = item.civilComparison.reference, block = node('div',null,'ch-reference'); block.append(node('p',`Assumed noon reference: ${ref.localDate} ${ref.localTime}`),node('p',ref.dateISO),node('p',ref.assumption)); article.append(block);
    } else article.append(node('p',`Calculation unavailable. ${item.civilComparison.reason}`,'ch-unavailable'));
    const notes = node('div'); if (r.time.qualification) notes.append(node('p',r.time.qualification)); notes.append(list(item.coverage.warnings.filter(value => value !== r.time.qualification && value !== r.scopeNote)));
    const qualifications = detail('Source precision & location qualifications',notes); qualifications.open = true; article.append(qualifications);
    return article;
  }

  function renderLedger() {
    $('ch-record-context').replaceChildren(...study.records.map(recordSheet));
    const table = node('table'), caption = node('caption','Civil-calendar labels at a declared local-noon reference for each historical record'), head = node('thead'), headings = node('tr');
    caption.className = 'sr-only'; headings.append(node('th','Calendar convention'));
    for (const item of study.records) { const th = node('th',countryName(item.record.countryId)); th.scope = 'col'; th.append(node('small',`${item.record.date} · ${item.record.title}`)); headings.append(th); }
    head.append(headings); const body = node('tbody'), calendars = new Map(); study.records.forEach(item => item.civilComparison.rows.forEach(row => { if (!calendars.has(row.id)) calendars.set(row.id,row); }));
    if (!calendars.size) {
      const tr = node('tr'), th = node('th','Canonical calendar comparison'); th.scope='row'; tr.append(th);
      study.records.forEach(item => tr.append(node('td',`Unavailable. ${item.civilComparison.reason}`,'ch-unavailable'))); body.append(tr);
    }
    for (const [id,example] of calendars) {
      const tr = node('tr'), th = node('th',example.label); th.scope='row'; th.append(node('small',readable(example.boundary))); tr.append(th);
      for (const item of study.records) {
        const row = item.civilComparison.rows.find(candidate => candidate.id === id), cell = node('td');
        if (!row) cell.append(node('p','Unavailable','ch-unavailable'),node('small',item.civilComparison.reason));
        else {
          cell.append(node('p',nonempty(row.text)),node('small',readable(row.status)));
          const notes = node('div'); notes.append(node('p',row.method),node('p',`Verification: ${nonempty(row.validation)}`),list(row.limitations),citations(row.sourceIds)); cell.append(detail('Method & limits',notes));
        }
        tr.append(cell);
      }
      body.append(tr);
    }
    table.append(caption,head,body); $('ch-calendar-table').replaceChildren(table); $('ch-ledger').hidden = false; $('ch-ledger-empty').hidden = true;
  }

  function currentSampleRecord() { return study?.records.find(item => item.record.id === $('ch-sample-record').value); }
  function renderSampleCalendars(item, sample) {
    const wrapper = $('ch-sample-calendars'); wrapper.hidden = !sample || sample.status !== 'available';
    if (wrapper.hidden) { wrapper.removeAttribute('data-date-iso'); $('ch-house-plate').removeAttribute('data-date-iso'); $('ch-sample-calendar-table').replaceChildren(); return; }
    try {
      const key = `${item.record.id}|${sample.dateISO}|${sample.houseSystem}`;
      if (!sampleCalendarCache.has(key)) sampleCalendarCache.set(key, compareMoment({ dateISO: sample.dateISO, lat: item.record.eventPlace.lat, lon: item.record.eventPlace.lon, timeZone: item.record.eventPlace.zone, system: sample.houseSystem }));
      const comparison = sampleCalendarCache.get(key), table = node('table'), head = node('thead'), headings = node('tr'), body = node('tbody');
      headings.append(node('th', 'Civil convention'), node('th', 'Label at the assumed clock'), node('th', 'Method & limits')); head.append(headings);
      for (const row of comparison.calendars) {
        const tr = node('tr'), name = node('th', row.label), limits = node('td'), notes = node('div'); name.scope = 'row';
        notes.append(node('p', row.method), node('p', `${readable(row.boundary)} · ${row.validation}`), list(row.limitations));
        for (const sourceId of row.sourceIds) {
          const source = comparison.sources.find(value => value.id === sourceId), href = safeSourceURL(source?.url);
          if (href) { const a = node('a', source.title || sourceId); a.href = href; notes.append(a, node('br')); }
        }
        limits.append(detail('Read convention & source limits', notes)); tr.append(name, node('td', row.status === 'available' ? row.text : 'Unavailable'), limits); body.append(tr);
      }
      table.append(head, body); $('ch-sample-calendar-table').replaceChildren(table);
      wrapper.dataset.dateIso = sample.dateISO; $('ch-house-plate').dataset.dateIso = sample.dateISO;
      $('ch-sample-sync').textContent = `Chart, cusp values and these thirteen calendar labels share ${sample.dateISO} · assumed ${sample.localTime} in ${item.record.eventPlace.zone}. The comparison ledger above retains its separate fixed-noon references.`;
    } catch (error) {
      wrapper.removeAttribute('data-date-iso'); $('ch-sample-calendar-table').replaceChildren();
      $('ch-sample-sync').textContent = `Calendar labels unavailable at this assumed sample: ${error.message}`;
    }
  }
  function renderSample() {
    const item = currentSampleRecord(); if (!item) return;
    const day = item.daySensitivity, index = Number($('ch-sample-index').value), sample = day.samples[index];
    const available = sample?.status === 'available' && sample.cusps?.every(Number.isFinite);
    $('ch-house-plate').innerHTML = available ? countryHousePlateSVG(sample) : '';
    $('ch-sample-clock').textContent = sample ? `${sample.localDate} · ${sample.localTime}` : 'No available sample';
    $('ch-sample-context').textContent = sample ? `${sample.dateISO} · UTC offset ${sample.utcOffsetMinutes} minutes${sample.occurrence == null ? '' : ` · repeated-clock occurrence ${sample.occurrence}`}. ${sample.assumptionNote}` : nonempty(day.reason);
    $('ch-sample-position').textContent = `Sample ${index+1} of ${day.samples.length}. ${SYSTEMS[sample?.houseSystem] || 'Unavailable geometry'}.`;
    $('ch-sample-index').setAttribute('aria-valuetext',sample ? `Assumed ${sample.localTime}, sample ${index+1} of ${day.samples.length}` : 'Unavailable');
    $('ch-sample-prev').disabled = index <= 0; $('ch-sample-next').disabled = index >= day.samples.length-1;
    $('ch-sample-warnings').textContent = [sample?.reason,...arr(sample?.warnings)].filter(Boolean).join(' ');
    const table = node('table'), head = node('thead'), header = node('tr'); header.append(node('th','House / angle'),node('th','Tropical longitude')); head.append(header); const body = node('tbody');
    for (const [label,value] of [['Ascendant',sample?.ascendantDegrees],['Midheaven',sample?.midheavenDegrees],...Array.from({length:12},(_,i)=>[`House ${i+1}`,sample?.cusps?.[i]])]) { const tr=node('tr'), th=node('th',label); th.scope='row'; tr.append(th,node('td',degrees(value))); body.append(tr); }
    table.append(head,body); $('ch-cusp-table').replaceChildren(table);
    renderSampleCalendars(item, sample);
  }

  function renderSampleRecord() {
    const item=currentSampleRecord(); if (!item) return; const day=item.daySensitivity;
    if (!day.samples.length) renderSampleCalendars(item, null);
    $('ch-sample-work').hidden = !day.samples.length; $('ch-sample-unavailable').hidden = !!day.samples.length; $('ch-sample-unavailable').textContent = `House samples unavailable. ${day.reason || 'No valid sample is available.'}`;
    $('ch-sample-method').textContent = `${SYSTEMS[study.selection.houseSystem]} · ${day.samples.length} explicitly assumed samples. ${day.day ? `${day.day.elapsedHours} elapsed hours in this local day.` : ''}`;
    const limits=node('div'); if (day.method) limits.append(node('p',typeof day.method === 'string' ? day.method : JSON.stringify(day.method))); limits.append(list(day.limitations),citations(['CH-TIME','CH-HOUSES',...item.record.sourceIds]));
    const changes=arr(day.clockChanges); if (changes.length) limits.append(node('p',`${changes.length} historical clock change interval(s): ${changes.map(change=>`${change.kind}, ${change.fromLocalTime} → ${change.toLocalTime} (${change.precision})`).join('; ')}`));
    const missing=arr(day.clockSlots).filter(slot=>slot.status==='unavailable'); if (missing.length) limits.append(node('p',`Unavailable local-hour labels: ${missing.map(slot=>slot.localTime).join(', ')}.`));
    $('ch-sample-limits').replaceChildren(limits); $('ch-sample-index').max=String(Math.max(0,day.samples.length-1)); $('ch-sample-index').value='0'; if (day.samples.length) renderSample();
  }

  function renderSensitivity() {
    const requested=study.selection.includeDaySensitivity;
    $('ch-sensitivity-output').hidden=!requested; $('ch-sensitivity-empty').hidden=requested;
    if (!requested) return;
    $('ch-sample-record').replaceChildren(...study.records.map(item=>{const option=node('option',`${countryName(item.record.countryId)} · ${item.record.date} · ${item.record.title}`);option.value=item.record.id;return option;}));
    const available=study.records.find(item=>item.daySensitivity.samples.length); if (available) $('ch-sample-record').value=available.record.id; renderSampleRecord();
  }

  async function calculate(moveFocus = true) {
    const token=++revision; disableExports(); $('ch-error').hidden=true;
    const recordIds=selectedIds();
    if (!recordIds.length || recordIds.length > catalogue.maxRecords) {
      study=null; $('ch-ledger').hidden=true; $('ch-ledger-empty').hidden=false; $('ch-sensitivity-output').hidden=true; $('ch-sensitivity-empty').hidden=false;
      $('ch-error').textContent=`Select between one and ${catalogue.maxRecords} historical records. Your current selection contains ${recordIds.length}.`; $('ch-error').hidden=false; $('ch-error').focus(); $('ch-status').textContent='Selection needs attention.'; return;
    }
    $('ch-compare').disabled=true; $('ch-status').textContent='Calculating the selected historical references…';
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    try {
      if (token!==revision) return;
      const result=buildCountryHistoryStudy({recordIds,houseSystem:$('ch-house-system').value,includeDaySensitivity:$('ch-sensitivity').checked});
      if (token!==revision) return; study=result; sampleCalendarCache.clear();
      renderLedger(); renderSensitivity(); renderSources(study.sources); $('ch-limitations').replaceChildren(...study.limitations.map(value=>node('li',value)));
      $('ch-stale').hidden=true; $('ch-json').disabled=false; $('ch-csv').disabled=false;
      const unavailable=study.records.filter(item=>item.civilComparison.status==='unavailable').length;
      $('ch-status').textContent=`${study.records.length} historical records compared. ${unavailable} ${unavailable===1?'record has':'records have'} unavailable calendar calculations. Every date keeps its precision and source limits.`;
      if(moveFocus) $('ch-ledger-title').focus();
    } catch(error) {
      study=null; $('ch-ledger').hidden=true; $('ch-ledger-empty').hidden=false; $('ch-sensitivity-output').hidden=true; $('ch-sensitivity-empty').hidden=false;
      $('ch-error').textContent=`The comparison could not be prepared. ${error.message}`; $('ch-error').hidden=false; $('ch-error').focus(); $('ch-status').textContent='Comparison unavailable. Check the selection and try again.';
    } finally { $('ch-compare').disabled=false; }
  }

  try {
    catalogue=getCountryHistoryCatalogue(); $('ch-engraving').innerHTML=frontispiece('astrolabe'); renderPicker(); renderReference(); renderSources([]); $('ch-limitations').replaceChildren(...catalogue.limitations.map(value=>node('li',value)));
    $('ch-date-country').replaceChildren(...catalogue.countries.map(country => { const option = node('option', countryName(country.id)); option.value = country.id; return option; })); renderFoundingNavigation();
    $('ch-date-country').addEventListener('change', renderFoundingNavigation);
    $('ch-add-highlighted').addEventListener('click', () => {
      if (!highlightedId || selectedIds().includes(highlightedId)) return;
      if (selectedIds().length >= catalogue.maxRecords) { $('ch-date-selection-status').textContent = `The comparison already has ${catalogue.maxRecords} records. Clear a checkbox below before adding this one.`; return; }
      const input = $(`ch-record-${highlightedId}`); input.checked = true; input.closest('details').open = true; invalidate(); $('ch-date-selection-status').textContent = 'Record added. Choose Compare selected records to update the ledger.';
    });
    $('ch-form').addEventListener('submit',event=>{event.preventDefault();calculate();});
    $('ch-record-picker').addEventListener('change',invalidate); $('ch-house-system').addEventListener('change',invalidate); $('ch-sensitivity').addEventListener('change',invalidate);
    $('ch-clear').addEventListener('click',()=>{document.querySelectorAll('#ch-record-picker input').forEach(input=>{input.checked=false;});invalidate();});
    $('ch-reset').addEventListener('click',()=>{renderPicker();invalidate();});
    $('ch-sample-record').addEventListener('change',renderSampleRecord); $('ch-sample-index').addEventListener('input',renderSample);
    $('ch-sample-prev').addEventListener('click',()=>{$('ch-sample-index').value=String(Math.max(0,Number($('ch-sample-index').value)-1));renderSample();});
    $('ch-sample-next').addEventListener('click',()=>{$('ch-sample-index').value=String(Math.min(Number($('ch-sample-index').max),Number($('ch-sample-index').value)+1));renderSample();});
    $('ch-json').addEventListener('click',()=>{if(!study)return;downloadJSON(study,'historical-country-calendar-study.json');$('ch-export-status').textContent='JSON downloaded with source precision and declared assumptions.';});
    $('ch-csv').addEventListener('click',()=>{if(!study)return;downloadBlob(new Blob([countryStudyCSV(study)],{type:'text/csv;charset=utf-8'}),'historical-country-calendar-study.csv');$('ch-export-status').textContent='CSV downloaded with labelled source records, calendar rows and assumed samples.';});
    calculate(false);
  } catch(error) { $('ch-error').textContent=`The historical catalogue could not be loaded. ${error.message}`; $('ch-error').hidden=false; $('ch-status').textContent='Historical catalogue unavailable.'; disableExports(); }
}

// This view reads accepted, hash-bound historical snapshots. It does not pass
// outcomes to an engine, fit a model, recalculate a country score or search dates.
function initCountryEventResearch() {
  if (!$('cr-research')) return;
  const query = new URLSearchParams(location.search), requestedCountry = query.get('researchCountry'), requestedRecord = getCountryEventRecord(query.get('researchRecord'));
  let countryId = COUNTRY_EVENT_COUNTRIES.some(c => c.id === requestedCountry) ? requestedCountry : 'usa', records = [], selectedId = requestedRecord?.countryId === requestedCountry ? requestedRecord.id : '', revision = 0, displayed = null, eventNavigator = null, calendarNavigator = null, currentChunk = null;
  const researchURL = (id, recordId = null) => { const url = new URL('pages/country-calendars.html', ROOT); url.searchParams.set('researchCountry', id); if (recordId) url.searchParams.set('researchRecord', recordId); url.hash = 'cr-title'; return url.href; };
  const cache = new Map();
  const sourceMap = new Map(COUNTRY_EVENT_SOURCES.map(s => [s.id, s]));
  const methodMap = new Map(COUNTRY_EVENT_CALCULATION_SOURCES.map(s => [s.id, s]));
  const profileMap = new Map(COUNTRY_EVENT_PROFILES.map(p => [p.id, p]));
  const format = value => Number.isFinite(value) ? value.toFixed(3).replace(/\.?0+$/, '') : 'Unavailable';
  const markerLabels = { start: 'Start / main polling marker', end: 'Documented end / episode endpoint', outcome: 'Result / reported outcome marker' };
  const table = (headers, rows, caption) => {
    const t = node('table'), cap = node('caption', caption), head = node('thead'), tr = node('tr'), body = node('tbody');
    cap.className = 'sr-only'; headers.forEach(label => { const th = node('th', label); th.scope = 'col'; tr.append(th); }); head.append(tr);
    rows.forEach(cells => { const row = node('tr'); cells.forEach((value, index) => { const cell = node(index ? 'td' : 'th'); if (!index) cell.scope = 'row'; cell.append(value instanceof Node ? value : document.createTextNode(String(value ?? 'Unavailable'))); row.append(cell); }); body.append(row); });
    t.append(cap, head, body); return t;
  };
  const sourceLink = source => { const url = safeSourceURL(source?.url), link = node(url ? 'a' : 'span', source?.title || source?.id || 'Unavailable source'); if (url) link.href = url; return link; };
  async function verifiedJSON(descriptor) {
    const response = await fetch(new URL(descriptor.path, ROOT));
    if (!response.ok) throw new Error(`Stored research could not be loaded (${response.status}).`);
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength !== descriptor.bytes) throw new Error('Stored research size differs from its source binding.');
    if (!globalThis.crypto?.subtle) throw new Error('A secure context is required to verify the stored research.');
    const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
    if (digest !== descriptor.sha256) throw new Error('Stored research hash differs from its source binding.');
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  function loadCountry(id) {
    if (!cache.has(id)) cache.set(id, verifiedJSON(COUNTRY_EVENT_RESEARCH.chunks[id]).then(data => validateCountryResearchChunk(data, id)).catch(error => { cache.delete(id); throw error; }));
    return cache.get(id);
  }
  function invalidateComparison() {
    displayed = null; $('cr-comparison').hidden = true; $('cr-download').disabled = true; $('cr-download-status').textContent = ''; $('cr-error').hidden = true;
    calendarNavigator?.update({ disabled: true });
    $('cr-calendar-navigator').removeAttribute('data-date-iso');
  }
  function renderRecord(record) {
    const wrapper = $('cr-source-record'); wrapper.replaceChildren();
    wrapper.append(node('p', 'Historical assertion · date-only source record', 'ch-kicker'), node('h3', record.title), node('p', record.dateConvention));
    const dl = node('dl');
    for (const [label, value] of [['Start marker', record.startDate], ['Documented end', record.endDate || 'Not established in this record'], ['Result / report date', record.outcome.date || 'Not established in this record'], ['Outcome status', readable(record.outcome.status)], ['Source-event group', record.eventGroupId], ['Broader dependence group', record.analysisGroupId]]) dl.append(node('dt', label), node('dd', value));
    wrapper.append(dl, node('p', record.outcome.summary), node('p', 'Religious allegiance, ritual intent and historical calendar adoption are not identified by this sample. The date convention above is the documented claim.', 'ch-footnote'));
    const viewLink = node('a', 'Direct link to this documented record'); viewLink.href = researchURL(record.countryId, record.id); wrapper.append(viewLink);
    if (record.startDate >= '1900-01-01' && record.startDate <= '2100-12-31') {
      const studyLink = node('a', 'Study this date with an explicitly assumed observer & noon clock →'), url = new URL('pages/calendar-timeline.html', ROOT);
      url.searchParams.set('countryObserver', record.countryId); url.searchParams.set('studyDate', record.startDate); studyLink.href = url.href;
      const paragraph = node('p'); paragraph.append(studyLink); wrapper.append(paragraph);
    }
    const notes = detail('Source qualifications & recorded variants', list(record.limitations));
    const sources = node('ol', null, 'cr-sources');
    for (const id of record.sourceIds) {
      const source = sourceMap.get(id), item = node('li'); if (!source) continue;
      item.append(sourceLink(source), node('p', source.locator), node('p', source.claim), node('p', `Reading: ${source.readingStatus}. Access: ${source.accessStatus}. Retrieved: ${source.retrievedAt}.`, 'ch-footnote'), node('p', `Source SHA-256: ${source.contentSHA256}`, 'cr-hash'));
      sources.append(item);
    }
    wrapper.append(notes, detail(`Checked source records (${record.sourceIds.length})`, sources));
  }
  function renderEventTable() {
    $('cr-event-table').replaceChildren(table(['Start marker', 'Documented event & span', 'Recorded outcome', 'Inspect'], records.map(record => {
      const event = node('div'); event.append(node('strong', record.title), node('p', `${readable(record.type)}${record.endDate ? ` · through ${record.endDate}` : ' · no end date assigned'}`, 'ch-footnote'));
      const action = node('button', record.id === selectedId ? 'Selected' : 'Read record', 'ch-secondary'); action.type = 'button'; action.dataset.recordId = record.id; action.setAttribute('aria-label', `Read ${record.title}`); action.setAttribute('aria-pressed', String(record.id === selectedId)); action.addEventListener('click', () => { selectRecord(record.id); $('cr-event-table').querySelector(`button[data-record-id="${record.id}"]`).focus({ preventScroll: true }); });
      return [record.startDate, event, record.outcome.summary, action];
    }), 'The selected country’s source-qualified events; source dates and outcomes remain separate'));
  }
  function selectRecord(id, markerKind = 'start') {
    selectedId = id;
    const record = getCountryEventRecord(id), index = records.findIndex(r => r.id === id);
    $('cr-selected-title').textContent = record.title; $('cr-selected-date').textContent = record.startDate;
    $('cr-selected-date').dataset.eventKind = record.type === 'war' ? 'historical-conflict' : 'neutral';
    $('cr-event-index').value = String(index); $('cr-event-index').setAttribute('aria-valuetext', `${index + 1} of ${records.length}: ${record.startDate}, ${record.title}`);
    $('cr-prev').disabled = index <= 0; $('cr-next').disabled = index >= records.length - 1; $('cr-position').textContent = `${index + 1} of ${records.length} selected records`;
    $('cr-marks').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.recordId === id)));
    $('cr-marker-kind').replaceChildren(...['start', ...(record.endDate ? ['end'] : []), ...(record.outcome.date ? ['outcome'] : [])].map(kind => { const option = node('option', markerLabels[kind]); option.value = kind; return option; }));
    if ([...$('cr-marker-kind').options].some(option => option.value === markerKind)) $('cr-marker-kind').value = markerKind;
    eventNavigator?.update({ value: id });
    renderRecord(record); renderEventTable(); showSample();
  }
  function renderCountry() {
    records = getCountryEventRecords(countryId, $('cr-event-type').value);
    const country = COUNTRY_EVENT_COUNTRIES.find(c => c.id === countryId);
    $('cr-country-panel').setAttribute('aria-labelledby', `cr-tab-${countryId}`);
    $('cr-country-context').textContent = `${country.label} · ${records.length} records. Study observer: ${country.observerName}, ${country.timeZone} (${country.lat}, ${country.lon}). This fixed city reference is an explicit assumption.`;
    const timelineURL = new URL('pages/calendar-timeline.html', ROOT); timelineURL.searchParams.set('countryObserver', country.id); $('cr-study-link').href = timelineURL.href;
    $('cr-study-context').textContent = `Past and future study at ${country.observerName}, ${country.timeZone}; modern coordinates and assumed local noon. This observer does not define a national chart or an event location.`;
    $('cr-country-tabs').querySelectorAll('[role="tab"]').forEach(button => { const active = button.dataset.countryId === countryId; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
    $('cr-event-index').max = String(records.length - 1);
    $('cr-marks').replaceChildren(...records.map(record => { const button = node('button', record.startDate, 'cr-mark'); button.type = 'button'; button.dataset.recordId = record.id; button.dataset.eventKind = record.type === 'war' ? 'historical-conflict' : 'neutral'; button.setAttribute('aria-label', `${record.startDate}: ${record.title}${record.type === 'war' ? ', documented past conflict' : ', documented election'}`); button.addEventListener('click', () => selectRecord(record.id)); return button; }));
    const items = records.map(record => ({ id: record.id, date: record.startDate, label: record.title, kind: record.type === 'war' ? 'historical-conflict' : 'neutral', summary: record.type === 'war' ? 'Documented past conflict episode; no present or future danger assessment.' : 'Documented election marker; no favorable or adverse timing inference.', sourceLabel: record.sourceIds.join(' · '), sourceUrl: safeSourceURL(sourceMap.get(record.sourceIds[0])?.url), details: [
      { label: 'Source convention', value: record.dateConvention },
      { label: 'Event clock', value: 'Unknown · the source supplies a date, not an instant' },
      { label: 'Documented end', value: record.endDate || 'Not established' },
      { label: 'Source qualifications', value: record.limitations.join(' ') },
    ] }));
    const options = { id: 'cr-country-dates', label: `${country.label} · documented past dates`, items, value: records.some(r => r.id === selectedId) ? selectedId : records[0].id, bookmarkScope: `country-history:${countryId}`, onSelect: item => selectRecord(item.id) };
    if (eventNavigator) eventNavigator.update(options); else eventNavigator = mountDateNavigator($('cr-date-navigator'), options);
    selectRecord(records.some(r => r.id === selectedId) ? selectedId : records[0].id);
  }
  function renderCalendarLane(sample) {
    const choice = $('cr-calendar-choice');
    if (!choice.options.length) choice.replaceChildren(...sample.calendars.map(row => { const option = node('option', row.label); option.value = row.id; return option; }));
    const calendarId = choice.value, calendar = sample.calendars.find(row => row.id === calendarId), allowed = new Set(records.map(record => record.id));
    const items = currentChunk.markers.filter(marker => allowed.has(marker.eventId) && marker.localTime === $('cr-clock').value).map(marker => {
      const record = getCountryEventRecord(marker.eventId), stored = currentChunk.samples[marker.sampleId], row = stored.calendars.find(value => value.id === calendarId);
      return { id: `${record.id}:${marker.markerKind}`, date: marker.date, label: row?.status === 'available' ? row.text : 'Calendar label unavailable', kind: row?.status === 'available' ? 'neutral' : 'unavailable', summary: `${record.title} · ${markerLabels[marker.markerKind]}. Civil convention at a separately assumed clock.`, sourceLabel: record.sourceIds.join(' · '), sourceUrl: safeSourceURL(sourceMap.get(record.sourceIds[0])?.url), details: [
        { label: 'Source marker', value: `${marker.date} · ${marker.qualification}` },
        { label: 'Shared assumed instant', value: stored.dateISO || 'Unavailable' },
        { label: 'Study clock / zone', value: `${stored.localTime} · ${stored.timeZone}` },
        { label: 'Calendar convention', value: `${row?.label || calendarId} · ${readable(row?.boundary)}` },
        { label: 'Verification', value: row?.validation || 'Unavailable' },
        { label: 'Source certainty', value: 'Source event clock and event location are not verified by this calculation.' },
      ] };
    }).sort((a,b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    const options = { id: 'cr-calendar-dates', label: `${calendar?.label || calendarId} · source date markers`, items, value: `${selectedId}:${$('cr-marker-kind').value}`, bookmarkScope: `country-calendar:${countryId}:${calendarId}`, compact: true, disabled: false, onSelect: item => { const [recordId, kind] = item.id.split(':'); selectRecord(recordId, kind); } };
    if (calendarNavigator) calendarNavigator.update(options); else calendarNavigator = mountDateNavigator($('cr-calendar-navigator'), options);
    $('cr-calendar-sync').textContent = `Every date step updates the selected source marker, all thirteen labels and descriptive features together. Current assumed instant: ${sample.dateISO} · ${sample.localTime} ${sample.timeZone}. No civil label is assigned good or bad fortune.`;
    $('cr-calendar-navigator').dataset.dateIso = sample.dateISO;
  }
  function renderCalendars(sample) {
    $('cr-calendars').replaceChildren(table(['Civil convention', 'Calculated label', 'Boundary & verification'], sample.calendars.map(row => {
      const method = node('div'); method.append(node('p', `${readable(row.boundary)} · ${readable(row.status)}`), node('p', row.validation, 'ch-footnote'));
      const body = node('div'); body.append(node('p', row.method), list(row.limitations));
      for (const id of row.sourceIds) if (methodMap.has(id)) body.append(sourceLink(methodMap.get(id)), node('br'));
      method.append(detail('Method & source limits', body));
      return [row.label, row.status === 'available' ? row.text : 'Unavailable', method];
    }), 'Stored civil-date conversions at the explicitly assumed instant'));
  }
  function renderFeatures(row, sample) {
    const astronomy = sample.astronomy, hour = sample.planetaryHour;
    $('cr-sky-facts').textContent = `Shared sky inputs: ${astronomy?.phaseLabel || 'phase unavailable'}; Moon–Sun elongation ${format(astronomy?.moonSunElongation)}°. Unequal planetary-hour ruler: ${hour?.ruler || 'Unavailable'}. Several features reuse these quantities; they are dependent measurements.`;
    $('cr-features').replaceChildren(table(['Fixed editorial feature', 'Event feature index', 'Eight-sample mean', 'Event − nearby mean', 'Ties & availability'], row.profiles.map(profile => {
      const evidence = node('div'); evidence.append(node('p', `${profile.availableControls}/8 nearby values available. ${profile.equalControls == null ? 'Tie count unavailable for an incomplete comparison.' : `${profile.equalControls} tied with the event.`}`));
      const notes = node('div'); notes.append(node('p', `Stored numerator / declared denominator: ${profile.eventScoreNumerator ?? 'unavailable'} / ${profile.eventScoreDenominator}. Nearby range: ${format(profile.controlMinimum)} to ${format(profile.controlMaximum)}.`));
      notes.append(node('p', `Nearby indices in offset order: ${profile.controlScores.map(format).join(', ')}.`));
      if (profile.reason) notes.append(node('p', profile.reason));
      notes.append(list(profile.eventMissing.map(item => `${item.id}: ${item.reason}`)), list(profile.missingControls.map(item => `${item.offsetDays > 0 ? '+' : ''}${item.offsetDays} days: ${item.reason} ${arr(item.missing).map(m => `${m.id}: ${m.reason}`).join(' ')}`)));
      evidence.append(detail('Denominators, missingness & values', notes));
      return [profileMap.get(profile.id)?.label || profile.id, format(profile.eventScore), format(profile.controlMean), format(profile.delta), evidence];
    }), 'Descriptive indices, exact ties and complete-control requirements; no outcome prediction'));
    const controls = node('div');
    controls.append(node('p', 'All eight comparison dates are retained, including overlaps. “Possible” means an end is unknown; it does not assert activity on every day.'));
    const controlTable = node('div', null, 'ch-table-scroll'); controlTable.tabIndex = 0; controlTable.setAttribute('role', 'region'); controlTable.setAttribute('aria-label', 'Eight nearby dates and overlap counts');
    controlTable.append(table(['Offset', 'Nearby date', 'Selected marker matches', 'Inside a documented span', 'Possible unknown-end overlaps'], row.controls.map(control => [String(control.offsetDays), control.date, control.flags.exactMarkers.length, control.flags.documentedIntervals.length, control.flags.possibleUnknownEndOverlaps.length]), 'Overlap flags for nearby dates across the selected catalogue')); controls.append(controlTable);
    $('cr-control-evidence').replaceChildren(detail('Inspect the eight nearby dates & overlap flags', controls));
  }
  async function showSample() {
    const token = ++revision, id = countryId, eventId = selectedId, markerKind = $('cr-marker-kind').value, clock = $('cr-clock').value;
    const active = document.activeElement, calendarFocus = $('cr-calendar-navigator').contains(active) ? active.classList.contains('date-nav-slider') ? '.date-nav-slider' : '.date-nav-selected' : null;
    const clockIndex = COUNTRY_EVENT_RESEARCH.clocks.indexOf(clock);
    $('cr-clock-index').value = String(clockIndex); $('cr-clock-index').setAttribute('aria-valuetext', `${clock.slice(0,5)} assumed local clock, sample ${clockIndex + 1} of ${COUNTRY_EVENT_RESEARCH.clocks.length}`);
    $('cr-clock-output').textContent = `${clock.slice(0,5)} · assumed local clock`;
    invalidateComparison(); $('cr-status').textContent = 'Loading and verifying this country’s accepted historical snapshots…';
    try {
      const chunk = await loadCountry(id);
      if (token !== revision) return;
      currentChunk = chunk;
      const row = chunk.markers.find(r => r.eventId === eventId && r.markerKind === markerKind && r.localTime === clock), sample = row && chunk.samples[row.sampleId];
      if (!row || !sample) throw new Error('This source marker and assumed clock have no retained comparison.');
      const record = getCountryEventRecord(eventId), observer = COUNTRY_EVENT_COUNTRIES.find(c => c.id === id);
      $('cr-assumption').textContent = `${markerLabels[markerKind]}: ${row.date}. Assumed ${row.localTime} at ${observer.observerName}, ${sample.timeZone}; ${sample.dateISO}. This dataset does not certify an event instant or event location. Stored calculation from ${COUNTRY_EVENT_RESEARCH.asOf}; changing the clock selects a sensitivity sample, not a sourced event time.`;
      $('cr-comparison').dataset.sampleId = row.sampleId; $('cr-comparison').dataset.dateIso = sample.dateISO;
      renderCalendars(sample); renderFeatures(row, sample); renderCalendarLane(sample);
      displayed = { schemaVersion: 1, kind: 'source-qualified-stored-historical-comparison', record, sources: record.sourceIds.map(sourceId => sourceMap.get(sourceId)), observer, marker: row, sample, profileDefinitions: COUNTRY_EVENT_PROFILES, calculationSources: COUNTRY_EVENT_CALCULATION_SOURCES, binding: COUNTRY_EVENT_RESEARCH.chunks[id], provenance: COUNTRY_EVENT_RESEARCH.provenancePath, predictionAccuracy: null, hiddenBeliefIdentified: false };
      $('cr-comparison').hidden = false; $('cr-download').disabled = false; $('cr-status').textContent = `Verified stored comparison: ${row.date}, assumed ${row.localTime}. All thirteen civil labels share ${sample.dateISO}.`;
      if (calendarFocus && (document.activeElement === document.body || document.activeElement === active)) $('cr-calendar-navigator').querySelector(calendarFocus)?.focus({ preventScroll: true });
    } catch (error) { if (token !== revision) return; $('cr-error').textContent = error.message; $('cr-error').hidden = false; $('cr-status').textContent = 'Stored comparison unavailable. Source records remain readable; select a record to retry.'; }
  }
  async function renderSummary() {
    try {
      const summary = await verifiedJSON(COUNTRY_EVENT_RESEARCH.summary), wrapper = $('cr-global-summary'); wrapper.replaceChildren();
      wrapper.append(node('p', `${summary.counts.events} records · ${summary.counts.sourceEventGroups} source-event groups · ${summary.counts.analysisGroups} conservative groups. ${summary.counts.logicalControlUses.toLocaleString()} logical nearby-date uses share ${summary.counts.uniqueSamples.toLocaleString()} distinct event/control samples across all markers and clocks.`, 'cr-counts'));
      wrapper.append(node('p', 'Primary description: start markers at assumed local noon. Complete differences are averaged within each conservative group, then groups receive equal weight. These original pooled descriptions stay fixed when the country filter changes.'));
      wrapper.append(node('p', 'A negative mean says the fixed feature index was lower at these selected starts than at their nearby samples. Its unit is index points. It does not measure electoral or military success, compare countries, or identify a preferred calendar.'));
      const summaryTable = node('div', null, 'ch-table-scroll'); summaryTable.tabIndex = 0; summaryTable.setAttribute('role', 'region'); summaryTable.setAttribute('aria-label', 'Fixed global descriptions; scroll horizontally if needed');
      summaryTable.append(table(['Fixed feature', 'Complete start pairs', 'Eligible groups', 'Mean event − nearby index'], summary.primaryDescriptions.map(row => [profileMap.get(row.profileId)?.label || row.profileId, `${row.completeStartRecords}/28`, `${row.eligibleAnalysisGroups}/22`, format(row.equalGroupMeanDelta)]), 'Accepted global noon descriptions; arbitrary index points, not probabilities')); wrapper.append(summaryTable);
      wrapper.append(node('p', 'Jyotiṣa has no complete nine-sample comparisons, so its paired mean remains unavailable. Required unresolved rules are not removed from the denominator. Its inherited quality tables also retain pending primary-passage verification.'));
      const sensitivity = summary.clockSensitivity.find(row => row.profileId === 'western-increase-study');
      wrapper.append(node('p', `Western event indices change across 09:00, 12:00 and 18:00 in ${sensitivity.recordsWithDifferentEventScores}/28 records. Agreement at three clocks would not establish whole-day stability. Mercury 100 denotes a rule match and 0 a known nonmatch; neither is a probability or a judgment of good or bad luck.`));
      wrapper.append(node('p', `${summary.controlOverlap.logicalUsesInsideAnyDocumentedInterval} nearby-date uses fall inside a selected documented interval; ${summary.controlOverlap.logicalUsesWithPossibleUnknownEndOverlap} have possible overlap after an onset with no exact end. These categories overlap. Nearby dates, repeated events and shared Moon–Sun inputs do not supply independent evidence.`, 'cr-boundary'));
      wrapper.append(node('p', 'No timestamped pre-event classifier or observed ritual-choice variable exists in this study. Prediction accuracy, success beyond chance and a uniquely identified calendar or hidden belief are not estimable. These limits do not establish that every possible historical association is absent.'));
    } catch (error) { $('cr-global-summary').replaceChildren(node('p', `Accepted summary unavailable: ${error.message}`, 'ch-error')); }
  }
  for (const country of COUNTRY_EVENT_COUNTRIES) {
    const button = node('a', country.label, 'cr-country-tab'); button.href = researchURL(country.id); button.id = `cr-tab-${country.id}`; button.dataset.countryId = country.id; button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', 'cr-country-panel');
    button.addEventListener('click', event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); countryId = country.id; renderCountry(); });
    button.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); countryId = country.id; renderCountry(); return; }
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); const index = COUNTRY_EVENT_COUNTRIES.findIndex(c => c.id === countryId), target = event.key === 'Home' ? 0 : event.key === 'End' ? COUNTRY_EVENT_COUNTRIES.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + COUNTRY_EVENT_COUNTRIES.length) % COUNTRY_EVENT_COUNTRIES.length;
      countryId = COUNTRY_EVENT_COUNTRIES[target].id; renderCountry(); $(`cr-tab-${countryId}`).focus();
    });
    $('cr-country-tabs').append(button);
  }
  for (const profile of COUNTRY_EVENT_PROFILES) {
    const content = node('div'); content.append(node('p', profile.description), node('p', profile.method), node('p', profile.tiePolicy), list(profile.limitations));
    profile.sourceIds.forEach(id => { if (methodMap.has(id)) content.append(sourceLink(methodMap.get(id)), node('br')); });
    $('cr-profile-methods').append(detail(profile.label, content));
  }
  $('cr-event-type').addEventListener('change', renderCountry);
  $('cr-event-index').addEventListener('input', () => selectRecord(records[Number($('cr-event-index').value)].id));
  $('cr-prev').addEventListener('click', () => selectRecord(records[Math.max(0, records.findIndex(r => r.id === selectedId) - 1)].id));
  $('cr-next').addEventListener('click', () => selectRecord(records[Math.min(records.length - 1, records.findIndex(r => r.id === selectedId) + 1)].id));
  $('cr-marker-kind').addEventListener('change', showSample); $('cr-clock').addEventListener('change', showSample);
  $('cr-clock-index').addEventListener('input', () => { $('cr-clock').value = COUNTRY_EVENT_RESEARCH.clocks[Number($('cr-clock-index').value)]; showSample(); });
  $('cr-calendar-choice').addEventListener('change', () => { if (displayed) renderCalendarLane(displayed.sample); });
  $('cr-download').addEventListener('click', () => { if (!displayed) return; downloadJSON(displayed, `${displayed.record.id}-${displayed.marker.markerKind}-${displayed.marker.localTime.slice(0,2)}-assumed.json`); $('cr-download-status').textContent = 'Downloaded with source claims, clock assumptions, nearby-date values, overlap flags and artifact binding.'; });
  renderCountry(); renderSummary();
}
