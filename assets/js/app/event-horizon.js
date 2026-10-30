// A complete-date view over the canonical horizon calculation. No saved births,
// provider keys, questions or unrelated page results are read by this module.
import { mountDateNavigator } from './date-wayfinding.js';
import { COUNTRY_EVENT_COUNTRIES } from '../core/data/country-event-research.js';
const ROOT = new URL('../../../', import.meta.url);
const $ = id => document.getElementById(id);
const el = (tag, text, className) => { const n = document.createElement(tag); if (text != null) n.textContent = String(text); if (className) n.className = className; return n; };
const human = value => String(value ?? '').replace(/[-_]/g, ' ');
const pretty = value => typeof value === 'string' ? value : JSON.stringify(value, null, 2);
const dateLabel = (date, options = {}) => new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC', ...options }).format(new Date(`${date}T12:00:00Z`));
const scoreLabel = value => Number.isFinite(value) ? `${value > 0 ? '+' : ''}${Number(value.toFixed(2))}` : 'Unavailable';
const canonicalZone = timeZone => new Intl.DateTimeFormat('en', {timeZone}).resolvedOptions().timeZone;
// A bounded opaque bookmark namespace; observer inputs never enter bookmark storage.
const bookmarkReference = value => { let a = 2166136261, b = 2246822519; for (const character of value) { a = Math.imul(a ^ character.charCodeAt(0), 16777619); b = Math.imul(b ^ character.charCodeAt(0), 3266489917); } return `${(a >>> 0).toString(16)}${(b >>> 0).toString(16)}`; };
const xml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' })[char]);
const list = (host, values, className = 'eh-note') => { if (typeof values === 'string') values = [values]; if (!values?.length) return; const n = el('ul', null, className); for (const value of values) n.append(el('li', typeof value === 'string' ? value : pretty(value))); host.append(n); };
const fields = (host, rows) => { const dl = el('dl'); for (const [key, value] of rows) { if (value == null || value === '') continue; dl.append(el('dt', key), el('dd', typeof value === 'string' ? value : pretty(value))); } host.append(dl); };
const sourceLink = source => { const label = source.title || source.label || source.id || 'Source'; if (!source.url && !source.sourceUrl) return el('span', label); try { const url = new URL(source.url || source.sourceUrl, ROOT); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return el('span', label); const link = el('a', label); link.href = url.href; if (url.origin !== location.origin) { link.target = '_blank'; link.rel = 'noopener noreferrer'; } return link; } catch { return el('span', label); } };
function sourceRow(source) { const row = el('article', null, 'eh-source'); row.append(sourceLink(source)); for (const key of ['id','publisher','sourceKind','edition','locator','accessStatus','readingDepth','rights','status']) if (source[key]) row.append(el('p', `${human(key)}: ${pretty(source[key])}`, 'eh-note')); list(row, source.limitations); return row; }
function download(content, type, filename) { const url = URL.createObjectURL(new Blob([content], {type})), link = el('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function renderTraditions(traditions, sources) {
  const host = $('eh-eschatology'); host.replaceChildren(el('p', 'Attributed references without assigned dates. These traditions do not contribute to profile ranks.', 'eh-note'));
  for (const tradition of traditions) {
    const block = el('details'); block.append(el('summary', tradition.label)); block.append(el('p', tradition.scope || tradition.summary));
    if (tradition.scope && tradition.summary) block.append(el('p', tradition.summary));
    fields(block, [['Reference status', tradition.eschatology?.status], ['Eschatological account', tradition.eschatology?.summary], ['Calendar notes', tradition.calendarNotes], ['Ranking contribution', 'None']]);
    list(block, tradition.limitations);
    const ids = new Set([...(tradition.sourceIds || []), ...(tradition.eschatology?.sourceIds || [])]);
    for (const id of ids) { const source = sources.find(row => row.id === id); if (source) block.append(sourceRow(source)); }
    host.append(block);
  }
}

export async function initEventHorizon() {
  let core, result = null, selectedDate = null, caseId = null, purposeId = null, stale = true, loading = false, page = 0, revision = 0, worker = null, controller = null, ics = null, frame = 0, resizeFrame = 0;
  const PAGE_SIZE = 24, contextCache = new Map();
  const dateNavigators = new Map();
  let navigationCase = null, navigationDisabled = false, chartPreviewDate = null;
  const status = text => { $('eh-status').textContent = text; };
  const error = text => { $('eh-error').textContent = text || ''; $('eh-error').hidden = !text; };
  const chosenCase = () => result?.cases.find(row => row.id === caseId);
  const chosenRow = () => chosenCase()?.rows.find(row => row.date === selectedDate);
  const chosenPurpose = () => core?.HORIZON_PURPOSES.find(row => row.id === purposeId);
  const profileOf = row => row?.purposeResults?.find(value => value.id === purposeId);
  const ready = () => !!result && !stale && !loading;
  const contextFor = date => { const key = `${caseId}:${date}`; if (!contextCache.has(key)) contextCache.set(key, core.eventsForHorizonDate(result, caseId, date)); return contextCache.get(key); };
  function setControls() {
    const disabled = !ready();
    $('eh-chart').tabIndex = disabled ? -1 : 0; $('eh-chart').setAttribute('aria-disabled',String(disabled));
    if (navigationDisabled !== disabled) { for (const navigator of dateNavigators.values()) navigator.update({ disabled }); navigationDisabled = disabled; }
    for (const id of ['eh-case','eh-purpose','eh-date','eh-slider','eh-order','eh-events','eh-observances','eh-open-evidence','eh-json','eh-csv','eh-ics']) $(id).disabled = disabled;
    $('eh-previous').disabled = disabled || selectedDate === chosenCase()?.rows[0]?.date;
    $('eh-next').disabled = disabled || selectedDate === chosenCase()?.rows.at(-1)?.date;
    $('eh-atlas-link').hidden = disabled || !chosenRow()?.sampleUTC;
    if ($('eh-hourly-run')) $('eh-hourly-run').disabled = disabled;
    for (const button of document.querySelectorAll('#eh-results button')) button.disabled = disabled;
    $('eh-cancel').disabled = !loading; $('eh-run').disabled = !core || loading; $('eh-restore').disabled = !core;
    if (disabled) $('eh-page-previous').disabled = $('eh-page-next').disabled = true;
    $('content').classList.toggle('eh-stale', stale && !!result);
    if (stale && result) $('eh-dataset-status').textContent = loading ? 'Previous run retained · new calculation in progress' : 'Previous run retained · stale settings; recalculate or restore';
    $('eh-ics-preview').hidden = true; ics = null;
  }
  function cancelWork(message) {
    revision++; controller?.abort(); controller = null;
    if (worker) { worker.postMessage({type:'cancel', jobId:worker.horizonJobId}); worker.terminate(); worker = null; }
    loading = false; stale = true; $('eh-progress').hidden = true; setControls();
    if (message) status(message);
  }
  function invalidate() { cancelWork('Calculation settings changed. The previous run is stale. Calculate the new settings or restore the precomputed public cases.'); error(''); }
  function progress(value) {
    $('eh-progress').hidden = false;
    const astronomyStage = value?.phase === 'astronomy';
    const done = Number(value?.processedSamples ?? value?.processed ?? value?.completed ?? value?.loaded ?? 0), total = astronomyStage ? 0 : Number(value?.totalSamples ?? value?.total ?? 0);
    if (total > 0) { $('eh-progress').max = total; $('eh-progress').value = Math.min(done, total); } else $('eh-progress').removeAttribute('value');
    status(`${human(value?.phase || value?.stage || 'Loading calculation')} · ${total > 0 ? `${done.toLocaleString()} / ${total.toLocaleString()}` : 'working'}${value?.message ? ` · ${value.message}` : ''}`);
  }
  function populateSelect(id, values, current, label = row => row.label || row.id) { const select = $(id); select.replaceChildren(); for (const row of values) { const option = el('option', label(row)); option.value = row.id; select.append(option); } if (values.some(row => row.id === current)) select.value = current; return select.value; }
  function fillCustomFields() {
    const item = chosenCase(); if (!item) return;
    const observer = item.observer || item;
    $('eh-clock').value = item.sampleTime || observer.sampleTime || '12:00:00'; $('eh-zone').value = observer.timeZone;
    $('eh-lat').value = observer.lat; $('eh-lon').value = observer.lon;
    $('eh-fold').value = item.disambiguation || 'reject';
    $('eh-country-observer').value = COUNTRY_EVENT_COUNTRIES.find(country => country.lat === observer.lat && country.lon === observer.lon && canonicalZone(country.timeZone) === canonicalZone(observer.timeZone))?.id || '';
    $('eh-start').value = result.request.startDate; $('eh-end').value = result.request.endDate;
  }
  function showProvenance() {
    const provenance = result.provenance || {}, runtime = provenance.runtime || {}, label = provenance.kind || provenance.mode || (runtime.node ? 'Precomputed dataset' : 'Current browser calculation');
    $('eh-dataset-status').textContent = `${human(label)} · ${result.cases.length} case${result.cases.length === 1 ? '' : 's'} · ${chosenCase().rows.length.toLocaleString()} dates per selected case`;
    const host = $('eh-coverage'); host.replaceChildren(el('p', 'Daily samples are distinct from solved astronomical event times. Runtime calendar representations can differ between the generated dataset and the current browser.', 'eh-note'));
    host.append(el('p',`${result.coverage?.calendarIds?.length || 0} civil-calendar conversions · ${result.request.purposeIds.length} separate editorial profiles · ${result.coverage?.traditions?.length || 0} attributed tradition references. This is a declared inventory, not exhaustive coverage of every method or religion.`, 'eh-note'));
    fields(host, [['Requested range', `${result.request.startDate} — ${result.request.endDate}, both included`],['Generating environment',runtime.environment || (runtime.node ? 'Node' : 'Browser')],['Calendar runtime',runtime.node ? `Node ${runtime.node}; ICU ${runtime.icu}; CLDR ${runtime.cldr}; time-zone data ${runtime.tz}` : runtime.calendarEngine || runtime.userAgent]]);
    const reproducibility=el('details');reproducibility.append(el('summary','Run counts, source binding & calculation statistics'));fields(reproducibility,[['Complete run counts',result.counts],['Generation provenance',provenance],['Calculation statistics',result.stats]]);host.append(reproducibility);
    const astronomy=el('details');astronomy.append(el('summary','Astronomical event search coverage'));for(const entry of result.astronomy?.coverage || []){const item=el('div',null,'eh-contribution');item.append(el('strong',human(entry.kind)),el('p',`${human(entry.status)}${entry.count != null ? ` · ${entry.count} events` : ''}`,'eh-note'));fields(item,[['Scope',entry.scope],['Scan step hours',entry.scanStepHours],['Not searched',entry.categories]]);astronomy.append(item);}list(astronomy,result.astronomy?.limitations);host.append(astronomy);
    const observances=el('details');observances.append(el('summary','Selected observance traditions & regional variants'));for(const entry of result.coverage?.observances || []){const item=el('div',null,'eh-contribution');item.append(el('strong',entry.label),el('p',`${human(entry.status)} · ${entry.methods || ''}`,'eh-note'));list(item,entry.limitations);fields(item,[['Source IDs',entry.sourceIds]]);observances.append(item);}host.append(observances);
    const coverage = el('details'); coverage.append(el('summary', 'Inspect the complete method inventory'), el('pre', pretty(result.coverage), 'eh-detail-raw')); host.append(coverage);
    const sources = $('eh-sources'); sources.replaceChildren(); const seen = new Set();
    for (const source of [...(result.sources || []), ...(result.astronomy?.sources || [])]) if (!seen.has(source.id || source.url)) { seen.add(source.id || source.url); sources.append(sourceRow(source)); }
    $('eh-limitations').replaceChildren(); for (const limit of new Set([...(result.limitations || []),...(result.astronomy?.limitations || [])])) $('eh-limitations').append(el('li', limit));
  }
  function setResult(value, message) {
    if (!value?.cases?.length || !value.cases.every(item => Array.isArray(item.rows) && item.rows.length)) throw Error('The calculation returned no usable case ledger. No result was activated.');
    clearDateNavigators(); result = value; stale = false; loading = false; contextCache.clear(); page = 0;
    caseId = populateSelect('eh-case', result.cases, caseId);
    const available = core.HORIZON_PURPOSES.filter(item => result.request.purposeIds.includes(item.id));
    purposeId = populateSelect('eh-purpose', available, purposeId);
    const rows = chosenCase().rows; if (!rows.some(row => row.date === selectedDate)) selectedDate = rows[0]?.date;
    if (!selectedDate) throw Error('The requested ledger contains no civil dates.');
    $('eh-date').min = rows[0].date; $('eh-date').max = rows.at(-1).date; $('eh-slider').max = String(rows.length - 1);
    $('eh-start-label').textContent = dateLabel(rows[0].date, {month:'short'}); $('eh-end-label').textContent = dateLabel(rows.at(-1).date, {month:'short'});
    $('eh-progress').hidden = true; error(''); fillCustomFields(); populateFilters(); showProvenance(); setControls(); render(); status(message);
  }
  function populateFilters() {
    const eventKind = $('eh-events').value, observanceFamily = $('eh-observances').value;
    const kinds = [...new Set((result.astronomy?.events || []).map(row => row.kind).filter(Boolean))].sort();
    populateSelect('eh-events', [{id:'all',label:'All dates'},{id:'any',label:'Dates with a calculated event'}, ...kinds.map(id => ({id,label:human(id)}))], eventKind);
    const families = [...new Map((result.observances || []).map(row => [row.familyId || row.family, row.familyLabel || human(row.familyId || row.family)])).entries()].filter(([id]) => id).sort((a,b) => a[1].localeCompare(b[1]));
    populateSelect('eh-observances', [{id:'all',label:'All traditions / dates'},{id:'any',label:'Dates with a named observance'},...families.map(([id,label]) => ({id,label}))], observanceFamily);
  }
  function clearDateNavigators() {
    for (const navigator of dateNavigators.values()) navigator.destroy();
    dateNavigators.clear(); navigationCase = null; chartPreviewDate = null;
    for (const id of ['eh-date-map','eh-profile-tracks','eh-calendar-tracks']) $(id)?.replaceChildren();
  }
  function renderDateNavigators() {
    if (!ready()) return;
    if (navigationCase !== caseId) { clearDateNavigators(); navigationCase = caseId; }
    const item = chosenCase(), observer = item.observer, rows = item.rows;
    const scope = `horizon:${caseId}:${observer.lat}:${observer.lon}:${observer.timeZone}:${item.sampleTime}:${item.disambiguation}:${result.request.startDate}:${result.request.endDate}`;
    const base = row => ({ id: row.date, date: row.date, label: row.date, details: [{label:'Observer',value:`${item.label} · ${observer.lat}°N, ${observer.lon}°E`},{label:'Clock and zone',value:`${item.sampleTime} · ${observer.timeZone}`},{label:'Sample UTC',value:row.sampleUTC || row.reason || 'Unavailable'}] });
    function mount(key, host, label, items, select = date => selectDate(date)) {
      if (!dateNavigators.has(key)) dateNavigators.set(key, mountDateNavigator(host, { id:key, label, items:items(), value:selectedDate, compact:true, bookmarkScope:`horizon:${bookmarkReference(`${scope}:${key}`)}`, onSelect:entry => select(entry.date) }));
    }
    mount('eh-context-dates', $('eh-date-map'), 'Every date · source-qualified context', () => rows.map(row => {
      const context = contextFor(row.date), observances = context.observances.filter(entry => entry.status !== 'unavailable'), astronomy = context.astronomy;
      return {...base(row), label:`${observances.length} named observances · ${astronomy.length} calculated events`, kind:row.status !== 'available' ? 'unavailable' : observances.length ? 'observance' : astronomy.length ? 'astronomy' : 'neutral', summary:row.status !== 'available' ? row.reason : `${observances.length} named observances · ${astronomy.length} calculated events. These layers do not contribute to profile ranks.`, details:[...base(row).details,{label:'Named observances',value:observances.map(entry => `${entry.title || entry.label || entry.name} · ${human(entry.status)}`).join('; ') || 'None in the implemented catalogue'},{label:'Calculated events',value:astronomy.map(entry => `${entry.title || entry.label || entry.name}${entry.localTime ? ` · ${entry.localTime}` : ''}`).join('; ') || 'None in the implemented catalogue'},...row.purposeResults.map(profile => ({label:core.HORIZON_PURPOSES.find(definition => definition.id === profile.id)?.label || profile.id,value:`${scoreLabel(profile.score)} editorial index points · ${profile.observed}/${profile.total} observed`}))], sourceLabel:'Stored horizon ledger · observance and astronomy methods', sourceUrl:new URL('docs/2026-10-horizon-methods.md',ROOT).href};
    }));
    if ($('eh-profile-navigation').open) for (const definition of core.HORIZON_PURPOSES.filter(profile => result.request.purposeIds.includes(profile.id))) {
      const key = `eh-profile-${definition.id}`;
      let host = $(key); if (!host) { host = el('div'); host.id = key; $('eh-profile-tracks').append(host); }
      mount(key,host,definition.label,() => rows.map(row => {
        const profile = row.purposeResults.find(entry => entry.id === definition.id);
        return {...base(row),label:`${scoreLabel(profile?.score)} editorial index points`,kind:profile?.rankable ? 'neutral' : 'unavailable',summary:`${scoreLabel(profile?.score)} editorial index points · ${profile?.observed ?? 0}/${profile?.total ?? 'unknown'} contributions observed. This stored score does not reveal whether favorable and caution classes coexist.`,details:[...base(row).details,{label:'Named profile',value:definition.label},{label:'Fixed arithmetic',value:profile?.rankable ? `${profile.scoreNumerator}/${profile.scoreDenominator} × 100` : 'Unavailable: required evidence is missing'},{label:'Missing evidence',value:profile?.missing?.map(entry => `${entry.id}: ${entry.reason}`).join('; ') || 'None under this profile'},{label:'Scope',value:definition.description}],sourceLabel:'Declared editorial profile · weights, dependencies and source scope',sourceUrl:new URL('docs/2026-10-horizon-ranking.md',ROOT).href};
      }),date => { purposeId = definition.id; $('eh-purpose').value = purposeId; page = 0; selectDate(date); });
    }
    if ($('eh-calendar-navigation').open) for (const calendarId of result.coverage.calendarIds) {
      const key = `eh-calendar-${calendarId}`;
      let host = $(key); if (!host) { host = el('div'); host.id = key; $('eh-calendar-tracks').append(host); }
      mount(key,host,`${human(calendarId)} · stored civil dates`,() => rows.map(row => {
        const calendar = row.calendars.find(entry => entry.id === calendarId);
        return {...base(row),label:calendar?.text || 'Calendar conversion unavailable',kind:calendar?.status === 'available' ? 'neutral' : 'unavailable',summary:calendar?.text || 'Calendar conversion unavailable',details:[...base(row).details,{label:'Calendar status',value:calendar?.status || 'unavailable'},{label:'Boundary',value:calendar?.boundary || 'Unavailable'},{label:'Validation scope',value:calendar?.validation ? pretty(calendar.validation) : 'No additional validation claim'},{label:'Meaning',value:'A civil date label carries no favorable or caution classification.'}],sourceLabel:'Stored calendar conversion · declared civil convention',sourceUrl:new URL('docs/2026-10-calendar-methods.md',ROOT).href};
      }));
    }
    for (const navigator of dateNavigators.values()) navigator.update({ value:selectedDate });
  }
  function renderChart() {
    const rows = chosenCase().rows, width = Math.max(260, Math.round($('eh-chart').getBoundingClientRect().width || 920)), height = width < 500 ? 200 : 230, left = 42, right = 15, top = 23, bottom = 39, plotWidth = width-left-right, plotHeight = height-top-bottom;
    const x = index => left + index / Math.max(1,rows.length-1) * plotWidth, y = score => top + (100-score)/200*plotHeight;
    const observedScores = rows.map(row => { const profile = profileOf(row); return profile?.rankable && Number.isFinite(profile.score) ? profile.score : null; });
    const isolated = [];
    let path = '', connected = false;
    observedScores.forEach((score,index) => { if (score !== null) { path += `${connected ? 'L' : 'M'}${x(index).toFixed(2)} ${y(score).toFixed(2)} `; connected = true; if (!Number.isFinite(observedScores[index-1]) && !Number.isFinite(observedScores[index+1])) isolated.push({ index, date:rows[index].date, score }); } else connected = false; });
    const years = []; rows.forEach((row,index) => { if (row.date.slice(5) === '01-01') years.push({index,label:row.date.slice(0,4)}); });
    if (!years.length) { years.push({index:0,label:dateLabel(rows[0].date,{month:'short',year:undefined})}); if (rows.length > 1) years.push({index:rows.length-1,label:dateLabel(rows.at(-1).date,{month:'short',year:undefined})}); }
    const index = rows.findIndex(row => row.date === selectedDate), value = profileOf(rows[index]), metadata = {caseId,purposeId,selectedDate,selectedScore:value?.score ?? null,sampleCount:rows.length,observedSampleCount:observedScores.filter(Number.isFinite).length,isolatedSampleCount:isolated.length,startDate:rows[0].date,endDate:rows.at(-1).date,scale:[-100,100],unit:'editorial index points',wholeDayPrediction:false};
    $('eh-chart').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="eh-chart-title eh-chart-desc" data-case="${xml(caseId)}" data-purpose="${xml(purposeId)}" data-date="${selectedDate}" data-samples="${rows.length}"><title id="eh-chart-title">${xml(chosenPurpose()?.label)} across every sampled date</title><desc id="eh-chart-desc">Editorial index from minus100 to plus100. Missing samples break the path. Isolated observed samples are drawn as dots. Use the date slider or ranked ledger for exact values and evidence.</desc><metadata>${xml(JSON.stringify(metadata))}</metadata>${[-100,0,100].map(score=>`<line x1="${left}" y1="${y(score)}" x2="${width-right}" y2="${y(score)}" stroke="#bdc5b3" stroke-dasharray="${score===0?'0':'2 5'}"/><text x="${left-9}" y="${y(score)+4}" text-anchor="end" fill="#58655d" font-size="12">${score>0?'+':''}${score}</text>`).join('')}${years.map(tick=>`<line x1="${x(tick.index)}" y1="${top}" x2="${x(tick.index)}" y2="${height-bottom}" stroke="#d1d5c5"/><text x="${x(tick.index)}" y="${height-15}" text-anchor="${tick.index===0?'start':tick.index===rows.length-1?'end':'middle'}" fill="#58655d" font-size="13">${tick.label}</text>`).join('')}<path d="${path}" fill="none" stroke="#315b49" stroke-width="1.5" data-profile-trace="${xml(purposeId)}"/>${isolated.map(sample=>`<circle data-profile-isolated="${xml(purposeId)}" data-date="${sample.date}" data-score="${sample.score}" cx="${x(sample.index)}" cy="${y(sample.score)}" r="3.5" fill="#315b49"><title>${sample.date}: ${sample.score} editorial index points</title></circle>`).join('')}<line x1="${x(index)}" x2="${x(index)}" y1="${top-5}" y2="${height-bottom+5}" stroke="#91472f" stroke-width="1.6"/>${value?.rankable?`<circle data-profile-selected="${xml(purposeId)}" data-date="${selectedDate}" data-score="${value.score}" cx="${x(index)}" cy="${y(value.score)}" r="5" fill="#91472f" stroke="#fbf9f1" stroke-width="2"/>`:''}</svg>`;
  }
  function renderContext(context) {
    const host = $('eh-date-context'); host.replaceChildren();
    for (const [title,rows] of [['Astronomical events',context.astronomy || []],['Named observances',(context.observances || []).filter(row=>row.status!=='unavailable')],...((context.observances || []).some(row=>row.status==='unavailable') ? [['Unavailable observance calculations',context.observances.filter(row=>row.status==='unavailable')]] : [])]) {
      const block = el('div'); block.append(el('h4', title));
      if (!rows.length) block.append(el('p', 'None in the implemented catalogue for this civil date.', 'eh-note'));
      else { const ul=el('ul'); for (const row of rows) ul.append(el('li', `${row.title || row.label || row.name}${row.localTime ? ` · ${row.localTime}` : ''}${row.status ? ` · ${human(row.status)}` : ''}`)); block.append(ul); }
      host.append(block);
    }
  }
  function renderEvidence(row) {
    const host = $('eh-day-content'); host.replaceChildren();
    let detail; try { detail = core.getHorizonDayDetail(result,caseId,selectedDate); } catch(cause) { host.append(el('p', `The stored sample remains visible, but current-runtime detail could not be calculated: ${cause.message}`, 'eh-error')); return; }
    const stored = profileOf(row), purposes = Array.isArray(detail.purposes) ? detail.purposes : detail.purposes?.results || detail.purposes?.profiles || [], current = purposes.find(item => item.id === purposeId);
    host.append(el('p', chosenPurpose()?.description || '', 'eh-note'));
    fields(host, [['Observer coordinates',`${chosenCase().observer.lat}°N, ${chosenCase().observer.lon}°E`],['Time zone',chosenCase().observer.timeZone],['Stored sample UTC',row.sampleUTC || row.reason],['Profile method',chosenPurpose()?.method],['Stored profile index',`${scoreLabel(stored?.score)} · editorial index points`],['Observed / required contributions',`${stored?.observed ?? 0} / ${stored?.total ?? 'unknown'}`],['Stored score arithmetic',stored?.rankable ? `${stored.scoreNumerator} / ${stored.scoreDenominator} × 100` : 'Unavailable because required inputs are missing']]);
    if (stored?.missing?.length) { host.append(el('h4','Missing evidence · not ranked')); list(host,stored.missing.map(item=>typeof item === 'string' ? item : `${item.id}: ${item.reason}`)); }
    if (current && current.score !== stored?.score) host.append(el('p',`Current browser index ${scoreLabel(current.score)} differs from stored index ${scoreLabel(stored?.score)}. The plot and ranks retain the stored run; the workings below use this browser. Recompute explicitly to replace the ledger.`, 'eh-error'));
    host.append(el('h4','Rule-by-rule workings'));
    if (!current?.contributions?.length) host.append(el('p','Detailed rule contributions are unavailable for this sample. Stored availability and score remain explicit.', 'eh-note'));
    for (const contribution of current?.contributions || []) {
      const block = el('details',null,'eh-contribution'), summary = el('summary',`${contribution.label} · ${contribution.observed ? scoreLabel(contribution.value) : 'unavailable'}`);
      block.append(summary); const classification = el('p',human(contribution.rawClassification || 'unavailable'),'eh-classification'); classification.dataset.kind = contribution.rawClassification || 'unavailable'; block.append(classification);
      block.append(el('p',contribution.reason || 'No additional explanation supplied.'));
      fields(block,[['Weight',contribution.weight],['Weighted contribution',contribution.weightedValue],['Dependency group',contribution.dependencyGroup],['Computed inputs',contribution.computed],['Source IDs',contribution.sourceIds],['Source status',contribution.sourceStatus]]);
      list(block,contribution.limitations); host.append(block);
    }
    const dependencies = el('details'); dependencies.append(el('summary','Shared inputs & dependency groups')); list(dependencies,(stored?.dependencyGroups || []).map(group=>`${group.label || group.id}: ${group.observed}/${group.total} observed; shared inputs are not independent corroboration.`)); host.append(dependencies);
    const calendars = el('details'); calendars.append(el('summary',`Calendar readings · ${row.calendars?.length || 0} stored conversions`));
    for (const calendar of row.calendars || []) { const entry=el('div',null,'eh-contribution'); entry.append(el('strong',calendar.label || human(calendar.id)),el('p',calendar.text || human(calendar.status))); fields(entry,[['Status',calendar.status],['Boundary',calendar.boundary],['Validation',calendar.validation]]); calendars.append(entry); } host.append(calendars);
    if (detail.runtimeDifferences?.length) { const differences=el('details');differences.append(el('summary',`${detail.runtimeDifferences.length} stored / current-runtime calendar differences`),el('p','This browser renders these calendar readings differently from the stored dataset. Stored dates and rankings have not been silently replaced.','eh-note'),el('pre',pretty(detail.runtimeDifferences),'eh-detail-raw'));host.append(differences); }
    const events=el('details');events.append(el('summary','Event and observance evidence'));
    for (const item of [...(detail.events?.astronomy || []),...(detail.events?.observances || [])]) { const block=el('div',null,'eh-contribution');block.append(el('strong',item.title || item.label || item.name));fields(block,[['Calculated event UTC',item.startUTC],['Local date / clock',item.localDate ? `${item.localDate} ${item.localTime || ''}` : item.date],['Precision',item.precision],['Boundary',item.boundary],['Variant',item.variant || item.variantId],['Region',item.region],['Method',item.method],['Astronomical details / coordinate frame',item.details],['Shared dependency groups',item.dependencyGroups],['Source IDs',item.sourceIds],['Status',item.status],['Availability explanation',item.reason],['Official source / stored conversion comparison',item.calendarComparison]]);list(block,item.limitations || item.limits);events.append(block); } host.append(events);
    const hourly=el('details');hourly.append(el('summary','Inspect the actual hours of this civil date'),el('p','Calculate a bounded hourly study only when requested. These start-of-segment source classifications do not assert that a quality lasts throughout an hour. Repeated and missing clocks retain their UTC offsets.','eh-note'));
    const hourButton=el('button','Calculate hourly details');hourButton.type='button';hourButton.id='eh-hourly-run';const hourOutput=el('div');hourOutput.id='eh-hourly-result';
    hourButton.addEventListener('click',async()=>{if(!ready())return;const requestedDate=selectedDate,requestedCase=caseId,requestedRevision=revision;hourButton.disabled=true;hourOutput.textContent='Calculating the selected civil day…';await new Promise(resolve=>requestAnimationFrame(resolve));if(!ready()||requestedDate!==selectedDate||requestedCase!==caseId||requestedRevision!==revision)return;
      try{const hours=core.getHorizonHourlyDetail(result,caseId,selectedDate);hourOutput.replaceChildren(el('p',`${hours.actualDayHours} real hours · ${hours.rows.length} calculated segments. ${hours.sampleScope}`,'eh-note'));const missing=hours.clockSlots.filter(slot=>slot.status!=='available');if(missing.length)hourOutput.append(el('p',`Unavailable local clocks: ${missing.map(slot=>slot.localClock).join(', ')}. They are not filled with invented samples.`,'eh-note'));
        for(const hour of hours.rows){const entry=el('details');entry.append(el('summary',`${hour.localClock} · ${hour.offsetLabel}${hour.occurrence?` · occurrence ${hour.occurrence}`:''} · ${hour.durationMinutes} minutes`),el('p',`${hour.startISO} — ${hour.endISO}`,'eh-mono'));if(hour.reason)entry.append(el('p',hour.reason,'eh-note'));for(const tradition of hour.guidance?.traditions||[]){entry.append(el('strong',tradition.label));list(entry,tradition.items.map(item=>`${item.title}: ${human(item.classification)}. ${item.reason || ''}`));}hourOutput.append(entry);}list(hourOutput,hours.limitations);
      }catch(cause){hourOutput.replaceChildren(el('p',`Hourly details are unavailable: ${cause.message}`,'eh-error'));}finally{hourButton.disabled=!ready();}
    });hourly.append(hourButton,hourOutput);host.append(hourly);
    list(host,chosenPurpose()?.limitations); $('eh-day-detail').dataset.date=selectedDate; $('eh-day-detail').dataset.case=caseId;
  }
  function renderComparison() {
    const host=$('eh-comparison'),wasOpen=host.querySelector('details')?.open;host.replaceChildren();const details=el('details');details.open=!!wasOpen;const summary=el('summary','Compare public cases & purposes on this civil date');details.append(summary,el('p','Each case resolves its own local clock. These are separate instants, not a same-sky comparison. Scores from different purposes encode different preferences.', 'eh-note'));
    const wrap=el('div',null,'eh-table-wrap');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','Case and purpose comparison; scroll horizontally');
    const table=el('table',null,'eh-mini-table'),head=el('thead'),header=el('tr');const definitions=core.HORIZON_PURPOSES.filter(p=>result.request.purposeIds.includes(p.id));
    for(const label of ['Case / sample UTC',...definitions.map(p=>p.label)])header.append(el('th',label));head.append(header);table.append(head);const body=el('tbody');
    for(const item of result.cases){const row=item.rows.find(r=>r.date===selectedDate),tr=el('tr'),label=el('td');label.append(el('strong',item.label),el('p',row?.sampleUTC || row?.reason || 'Outside this case range','eh-mono'));tr.append(label);for(const definition of definitions){const profile=row?.purposeResults.find(p=>p.id===definition.id),cell=el('td');cell.textContent=`${scoreLabel(profile?.score)} · ${profile?.observed ?? 0}/${profile?.total ?? 'unknown'} observed`;cell.dataset.case=item.id;cell.dataset.purpose=definition.id;cell.dataset.score=profile?.score ?? '';tr.append(cell);}body.append(tr);}table.append(body);wrap.append(table);details.append(wrap);host.append(details);
  }
  function rankedRows() {
    const order=$('eh-order').value, ranked=core.rankHorizonDates(result,{caseId,purposeId,order:order==='caution'?'worst':'best'});
    const rankedDates=new Set(ranked.rows.map(row=>row.date));
    let rows=[...ranked.rows,...chosenCase().rows.filter(row=>!rankedDates.has(row.date)).map(row=>({...row,ranking:null}))];if(order==='date')rows.sort((a,b)=>a.date.localeCompare(b.date));
    const eventFilter=$('eh-events').value,observanceFilter=$('eh-observances').value;
    if(eventFilter!=='all'||observanceFilter!=='all')rows=rows.filter(row=>{const context=contextFor(row.date);return(eventFilter==='all'||context.astronomy.some(e=>eventFilter==='any'||e.kind===eventFilter))&&(observanceFilter==='all'||context.observances.some(e=>e.status!=='unavailable'&&(observanceFilter==='any'||(e.familyId||e.family)===observanceFilter)));});
    return{...ranked,rows};
  }
  function renderLedger() {
    const ranked=rankedRows(), pages=Math.max(1,Math.ceil(ranked.rows.length/PAGE_SIZE));page=Math.min(page,pages-1);
    $('eh-ranking-note').textContent=`Modern editorial study profile: ${chosenPurpose()?.label}. ${ranked.tiePolicy || 'Exact equal scores share a rank.'} ${ranked.unrankableCount} samples lack complete profile evidence. These indices do not classify whole days or predict outcomes.`;
    $('eh-result-count').textContent=`${ranked.rows.length.toLocaleString()} dates in this filtered list · ${chosenCase().rows.length.toLocaleString()} dates calculated for ${chosenCase().label}.`;
    const body=$('eh-results').querySelector('tbody');body.replaceChildren();
    for(const row of ranked.rows.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE)){
      const profile=profileOf(row),context=contextFor(row.date),tr=el('tr');tr.dataset.date=row.date;tr.dataset.case=caseId;tr.dataset.purpose=purposeId;tr.dataset.score=profile?.score ?? '';tr.setAttribute('aria-selected',String(row.date===selectedDate));
      const first=el('td');first.append(el('span',row.ranking?.rank!=null?`Rank ${row.ranking.rank}${row.ranking.tieSize>1?` · ${row.ranking.tieSize} tied`:''}`:'Not ranked','eh-note'));const button=el('button',dateLabel(row.date,{month:'short'}));button.type='button';button.dataset.selectDate=row.date;button.addEventListener('click',()=>selectDate(row.date,{focus:true}));first.append(button,el('p',row.sampleUTC || row.reason,'eh-mono'));
      const score=el('td');score.append(el('strong',scoreLabel(profile?.score)),el('p','editorial index points'),el('p',`${profile?.scoreNumerator ?? '—'} / ${profile?.scoreDenominator ?? '—'} ×100`));
      const availability=el('td');availability.append(el('p',`${profile?.observed ?? 0}/${profile?.total ?? 'unknown'} contributions observed`),el('p',profile?.rankable?'Complete under this profile':'Unavailable for ranking'));
      const contextCell=el('td');for(const [name,items]of[['Events',context.astronomy],['Observances',context.observances.filter(item=>item.status!=='unavailable')]])contextCell.append(el('p',`${name}: ${items.length?items.map(item=>item.title||item.label||item.name).join('; '):'none in catalogue'}`));const missingObservances=context.observances.filter(item=>item.status==='unavailable');if(missingObservances.length)contextCell.append(el('p',`${missingObservances.length} unavailable observance calculations; not named festivals.`));tr.append(first,score,availability,contextCell);body.append(tr);
    }
    if(!ranked.rows.length){const row=el('tr'),cell=el('td','No dates match these context filters. The complete date slider remains available.');cell.colSpan=4;row.append(cell);body.append(row);}
    $('eh-page-label').textContent=`Page ${ranked.rows.length?page+1:0} of ${ranked.rows.length?pages:0}`;$('eh-page-previous').disabled=!ready()||page===0;$('eh-page-next').disabled=!ready()||page>=pages-1;
  }
  function render() {
    if(!ready())return;const item=chosenCase(),row=chosenRow(),profile=profileOf(row),observer=item.observer||item;
    $('eh-date').value=selectedDate;$('eh-slider').value=String(item.rows.findIndex(r=>r.date===selectedDate));$('eh-slider').setAttribute('aria-valuetext',`${dateLabel(selectedDate)}; ${chosenPurpose()?.label}; ${scoreLabel(profile?.score)} editorial index points`);
    $('eh-date-title').textContent=dateLabel(selectedDate);$('eh-sample-time').textContent=`${item.sampleTime} · ${observer.timeZone} → ${row.sampleUTC || row.reason || 'unresolved instant'}`;
    $('eh-context').textContent=`${item.sampleTime} · ${observer.timeZone}. One instant per civil date. Geographic zone-to-coordinate matching is not verified; observer coordinates are in the evidence panel.`;
    const rank=core.rankHorizonDates(result,{caseId,purposeId,order:'best'}).rows.find(r=>r.date===selectedDate)?.ranking;
    $('eh-rank-badge').replaceChildren(el('span','Profile rank / index'),el('strong',rank?.rank!=null?`${rank.rank}${rank.tieSize>1?' =':''} · ${scoreLabel(profile?.score)}`:'Not ranked'));if(rank?.tieSize>1)$('eh-rank-badge').append(el('span',`${rank.tieSize} exact-score ties`));
    $('eh-purpose-summary').textContent=`${chosenPurpose()?.label}: ${profile?.rankable?`${scoreLabel(profile.score)} editorial index points, from ${profile.observed}/${profile.total} observed contributions.`:`unavailable for ranking; ${profile?.observed ?? 0}/${profile?.total ?? 'unknown'} contributions observed.`} ${chosenPurpose()?.description || ''}`;
    const link=new URL('pages/calendar-atlas.html',ROOT);if(row.sampleUTC){link.searchParams.set('at',row.sampleUTC);link.searchParams.set('lat',observer.lat);link.searchParams.set('lon',observer.lon);link.searchParams.set('zone',observer.timeZone);}$('eh-atlas-link').href=link.href;
    renderChart();renderDateNavigators();renderContext(contextFor(selectedDate));renderEvidence(row);renderComparison();renderLedger();setControls();
  }
  function selectDate(date,{focus=false}={}){if(!ready())return;if(!chosenCase().rows.some(row=>row.date===date)){error('Choose a civil date inside the active calculated window.');$('eh-date').value=selectedDate;return;}selectedDate=date;error('');render();if(focus){$('eh-day-detail').open=true;$('eh-detail-heading').focus({preventScroll:true});$('eh-day-detail').scrollIntoView({block:'start',behavior:'instant'});}status(`${dateLabel(date)} selected. ${chosenPurpose()?.label}: ${scoreLabel(profileOf(chosenRow())?.score)} editorial index points.`);}
  async function loadPreset(){cancelWork();controller=new AbortController();const token=revision;loading=true;stale=true;setControls();error('');progress({stage:'Loading precomputed public cases'});try{const data=await core.loadHorizonPreset({signal:controller.signal,onProgress:value=>{if(token===revision)progress(value);}});if(token!==revision)return;setResult(data,'Checksum-verified precomputed public cases loaded. Every date in the published range is available; inspect provenance before comparing current-browser recalculations.');}catch(cause){if(token!==revision)return;loading=false;setControls();$('eh-progress').hidden=true;$('eh-dataset-status').textContent='Precomputed data unavailable · retry or calculate locally';error(`The precomputed horizon could not load: ${cause.message}`);status('Retry the precomputed dataset or calculate a custom run locally. No incomplete result is active.');}}
  function run(){
    if(!core)return;const country=COUNTRY_EVENT_COUNTRIES.find(item=>item.id===$('eh-country-observer').value);let request;try{request=core.normalizeHorizonRequest({startDate:$('eh-start').value,endDate:$('eh-end').value,cases:[{id:'custom',label:country?`${country.label} · ${country.observerName} study observer`:'Entered observer',lat:Number($('eh-lat').value),lon:Number($('eh-lon').value),timeZone:$('eh-zone').value,sampleTime:$('eh-clock').value,system:'regiomontanus',disambiguation:$('eh-fold').value}],purposeIds:core.HORIZON_PURPOSES.map(p=>p.id),mode:$('eh-strategy').value==='brute'?'brute':'optimized',includeAstronomy:true,includeObservances:true});}catch(cause){invalidate();error(cause.message);$('eh-error').tabIndex=-1;$('eh-error').focus();return;}
    cancelWork();const token=revision;loading=true;setControls();error('');progress({stage:'Starting local calculation'});
    try{worker=new Worker(new URL('../workers/event-horizon-worker.js',import.meta.url),{type:'module'});const jobId=`horizon-${token}`;worker.horizonJobId=jobId;worker.onmessage=event=>{const message=event.data;if(token!==revision||message.jobId!==jobId)return;if(message.type==='progress'){progress(message.progress||message);return;}if(message.type==='result'){worker.terminate();worker=null;try{const value=message.result;if(value?.optimized){if(!value.equivalence?.identical)throw Error('Brute and optimized strategies disagree. No result or export has been activated.');setResult(value.optimized,`Both strategies completed with identical compared outputs. Timing: ${pretty(value.timing)}. This is sampled-grid equivalence, not predictive validation.`);}else setResult(value,'Local calculation complete. Every requested civil date is retained, including unavailable samples.');}catch(cause){loading=false;stale=true;setControls();error(cause.message);status('The calculation could not be activated. Correct the inputs or restore the precomputed public cases.');}return;}if(message.type==='error'){cancelWork('Calculation failed. No partial ranking is available.');error(message.error?.message||message.error||message.message||'Unknown worker error.');}if(message.type==='cancelled')cancelWork('Calculation cancelled. No partial ranking is available.');};worker.onerror=event=>{if(token!==revision)return;cancelWork('The worker failed. Retry or restore the precomputed public cases.');error(event.message);};worker.postMessage({type:'start',jobId,operation:$('eh-strategy').value==='benchmark'?'benchmark':'scan',request});}catch(cause){cancelWork('This browser could not start the calculation worker. The precomputed dataset can still be loaded.');error(cause.message);}
  }
  $('eh-view-form').addEventListener('submit',event=>event.preventDefault());
  $('eh-chart').setAttribute('role','group');
  $('eh-chart').setAttribute('aria-label','Daily profile plot. Hover or tap a date for held evidence. Arrow keys move the selected date; Home and End reach the range boundaries.');
  const chartDate = event => { const chart=$('eh-chart').querySelector('svg'),rows=chosenCase()?.rows;if(!chart||!rows?.length)return null;const bounds=chart.getBoundingClientRect(),width=chart.viewBox.baseVal.width,point=(event.clientX-bounds.left)*width/Math.max(1,bounds.width),plotWidth=Math.max(1,width-42-15),index=Math.round(Math.max(0,Math.min(1,(point-42)/plotWidth))*(rows.length-1));return rows[index].date; };
  const previewChartDate = (date,pin=false) => { if(!ready()||!date)return;chartPreviewDate=date;dateNavigators.get('eh-context-dates')?.preview?.(date,{anchor:$('eh-chart'),pin}); };
  $('eh-chart').addEventListener('pointermove',event=>{if(event.pointerType==='touch'||!ready())return;const date=chartDate(event);if(date!==chartPreviewDate)previewChartDate(date);});
  $('eh-chart').addEventListener('pointerleave',()=>{chartPreviewDate=null;});
  $('eh-chart').addEventListener('focus',()=>previewChartDate(selectedDate));
  $('eh-chart').addEventListener('click',event=>{if(!ready())return;const date=chartDate(event);selectDate(date);previewChartDate(date,true);});
  $('eh-chart').addEventListener('keydown',event=>{if(!ready())return;const rows=chosenCase().rows,index=rows.findIndex(row=>row.date===selectedDate),steps={ArrowLeft:Math.max(0,index-1),ArrowRight:Math.min(rows.length-1,index+1),Home:0,End:rows.length-1};if(Object.hasOwn(steps,event.key)){event.preventDefault();selectDate(rows[steps[event.key]].date);previewChartDate(selectedDate);}else if(event.key==='Enter'||event.key===' '){event.preventDefault();previewChartDate(selectedDate,true);}else if(event.key==='Escape'){dateNavigators.get('eh-context-dates')?.dismiss?.();}});
  for(const country of COUNTRY_EVENT_COUNTRIES){const option=el('option',`${country.label} · ${country.observerName}`);option.value=country.id;$('eh-country-observer').append(option);}
  $('eh-country-observer').addEventListener('change',()=>{const country=COUNTRY_EVENT_COUNTRIES.find(item=>item.id===$('eh-country-observer').value);if(country){$('eh-lat').value=country.lat;$('eh-lon').value=country.lon;$('eh-zone').value=country.timeZone;}invalidate();});
  for(const id of ['eh-lat','eh-lon','eh-zone'])$(id).addEventListener('input',()=>{$('eh-country-observer').value='';});
  for(const id of ['eh-profile-navigation','eh-calendar-navigation'])$(id).addEventListener('toggle',()=>{if($(id).open)renderDateNavigators();});
  $('eh-case').addEventListener('change',()=>{caseId=$('eh-case').value;page=0;const rows=chosenCase().rows;if(!rows.some(row=>row.date===selectedDate))selectedDate=rows[0].date;fillCustomFields();render();});
  $('eh-purpose').addEventListener('change',()=>{purposeId=$('eh-purpose').value;page=0;render();});
  $('eh-date').addEventListener('change',()=>selectDate($('eh-date').value));
  $('eh-slider').addEventListener('input',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>selectDate(chosenCase()?.rows[Number($('eh-slider').value)]?.date));});
  $('eh-previous').addEventListener('click',()=>selectDate(chosenCase().rows[Number($('eh-slider').value)-1]?.date));$('eh-next').addEventListener('click',()=>selectDate(chosenCase().rows[Number($('eh-slider').value)+1]?.date));
  $('eh-open-evidence').addEventListener('click',()=>selectDate(selectedDate,{focus:true}));
  for(const id of['eh-order','eh-events','eh-observances'])$(id).addEventListener('change',()=>{if(!ready())return;page=0;renderLedger();});
  $('eh-page-previous').addEventListener('click',()=>{page--;renderLedger();});$('eh-page-next').addEventListener('click',()=>{page++;renderLedger();});
  $('eh-run-form').addEventListener('input',invalidate);$('eh-run-form').addEventListener('submit',event=>{event.preventDefault();run();});$('eh-cancel').addEventListener('click',()=>cancelWork('Calculation cancelled. No partial result or stale export is available. Restore the reviewed cases or start a new run.'));$('eh-restore').addEventListener('click',()=>core&&loadPreset());
  const exportAction=fn=>{try{if(!ready())throw Error('Load or calculate a current result before exporting.');fn();error('');}catch(cause){error(cause.message);}};
  $('eh-json').addEventListener('click',()=>exportAction(()=>download(core.exportHorizonJSON(result),'application/json','event-horizon.json')));
  $('eh-csv').addEventListener('click',()=>exportAction(()=>download(core.exportHorizonCSV(result,{caseId,purposeId}),'text/csv;charset=utf-8',`event-horizon-${caseId}-${purposeId}.csv`)));
  $('eh-ics').addEventListener('click',()=>exportAction(()=>{ics=core.exportHorizonDayICS(result,{caseId,date:selectedDate,generatedAt:new Date().toISOString()});$('eh-ics-text').textContent=ics;$('eh-ics-disclosure').textContent=`One study moment for ${chosenCase().label}, ${selectedDate}, at ${chosenRow().sampleUTC}. This is not an all-day observance. The file omits coordinates and birth data; its case label and time zone may be included.`;$('eh-ics-preview').hidden=false;$('eh-ics-preview').scrollIntoView({block:'start',behavior:'instant'});}));
  $('eh-ics-download').addEventListener('click',()=>exportAction(()=>{if(!ics)throw Error('Preview the current study moment first.');download(ics,'text/calendar;charset=utf-8',`horizon-study-${selectedDate}.ics`);}));
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(ready())renderChart();});});
  window.addEventListener('pagehide',()=>{cancelWork();cancelAnimationFrame(frame);cancelAnimationFrame(resizeFrame);});
  import('../core/data/horizon-traditions.js').then(references=>renderTraditions(references.HORIZON_TRADITIONS,references.HORIZON_TRADITION_SOURCES)).catch(cause=>$('eh-eschatology').append(el('p',`The reference layer could not load: ${cause.message}. It does not change profile calculations.`,'eh-note')));
  setControls();
  try{core=await import('../core/event-horizon.js');for(const id of ['eh-start','eh-end']){$(id).min=core.HORIZON_LIMITS.minDate;$(id).max=core.HORIZON_LIMITS.maxDate;}setControls();await loadPreset();}catch(cause){$('eh-dataset-status').textContent='Calculation module unavailable · reload to retry';error(`The calculation module could not load: ${cause.message}`);status('Reload to retry. No sample, rank or export is inferred from an incomplete load.');}
}
