import { getCountryHistoryCatalogue, buildCountryHistoryStudy } from '../core/country-history.js';
import { COUNTRY_HISTORY_METHODS, COUNTRY_HISTORY_HOUSES, COUNTRY_HISTORY_TASKS, COUNTRY_METHOD_SOURCES } from '../core/data/country-history-methods.js';
import { frontispiece } from './art/engravings.js';
import { downloadJSON, downloadBlob } from './state.js';

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
  let catalogue, study = null, revision = 0;
  const countryName = id => catalogue.countries.find(country => country.id === id)?.label || catalogue.countries.find(country => country.id === id)?.name || id;
  const selectedIds = () => [...document.querySelectorAll('#ch-record-picker input:checked')].map(input => input.value);
  const updateCount = () => { const count = selectedIds().length; $('ch-selection-count').textContent = `${count} of ${catalogue.maxRecords} records selected`; };
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
  }

  function renderSampleRecord() {
    const item=currentSampleRecord(); if (!item) return; const day=item.daySensitivity;
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
      if (token!==revision) return; study=result;
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
