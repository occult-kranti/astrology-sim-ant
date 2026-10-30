import { normalizeBirthContext, buildPersonalCalendar, exportPersonalCalendar } from '../core/personal-calendar.js';

let serial = 0;
const node = (tag, text, className) => { const el = document.createElement(tag); if (text != null) el.textContent = text; if (className) el.className = className; return el; };
const degree = value => `${value.toFixed(3)}°`;
// Optional local component; no storage, URL mutation, geolocation or provider.
export function mountPersonalCalendar(container, { onChange = () => {}, getSelectedInstant = () => null } = {}) {
  if (!(container instanceof Element) || typeof onChange !== 'function' || typeof getSelectedInstant !== 'function') throw new TypeError('Personal calendar needs a container and callbacks.');
  const prefix = `personal-${++serial}`, panel = node('details', null, 'pc-panel');
  panel.append(node('summary', 'Add birth details · optional'));
  panel.append(node('p', 'Compare a recorded birth moment—or an explicitly unknown-time interval—with the selected calendar moment. Details stay in this page’s memory. Nothing is saved, added to a URL or sent to AI.', 'pc-intro'));
  const form = node('form', null, 'pc-form'); form.noValidate = true;
  const fields = {};
  function field(key, label, type, parent = form) {
    const wrap = node('div', null, 'pc-field'), input = node(type === 'select' ? 'select' : 'input');
    if (type !== 'select') input.type = type;
    input.id = `${prefix}-${key}`; input.dataset.pcField = key; input.autocomplete = 'off';
    const title = node('label', label); title.htmlFor = input.id; wrap.append(title, input); parent.append(wrap); fields[key] = input; return input;
  }
  field('date', 'Gregorian birth date', 'date').setAttribute('min', '1900-01-01'); fields.date.max = '2100-12-31';
  field('timeZone', 'Birth-record IANA time zone', 'text').placeholder = 'For example, Europe/London'; fields.timeZone.maxLength = 120;
  const knownLabel = node('label', null, 'pc-check'), known = node('input'); known.type = 'checkbox'; known.dataset.pcField = 'timeKnown'; known.id = `${prefix}-known`; knownLabel.htmlFor = known.id; knownLabel.append(known, document.createTextNode(' I know the recorded local birth time')); form.append(knownLabel); fields.timeKnown = known;
  const exactFields = node('div', null, 'pc-exact'); exactFields.hidden = true; form.append(exactFields);
  field('time', 'Recorded local time', 'time', exactFields).step = '1';
  const fold = field('disambiguation', 'If the clock time occurred twice', 'select', exactFields);
  for (const [value, label] of [['reject', 'Require clarification'], ['earlier', 'Earlier occurrence'], ['later', 'Later occurrence']]) { const option = node('option', label); option.value = value; fold.append(option); }
  field('lat', 'Birthplace latitude (° north)', 'number', exactFields).step = 'any'; fields.lat.min = '-90'; fields.lat.max = '90';
  field('lon', 'Birthplace longitude (° east)', 'number', exactFields).step = 'any'; fields.lon.min = '-180'; fields.lon.max = '180';
  const system = field('houseSystem', 'Western house convention', 'select', exactFields);
  for (const [value, label] of [['regiomontanus', 'Regiomontanus · inherited Lilly convention'], ['placidus', 'Placidus · comparison variant'], ['whole', 'Whole-sign · comparison variant'], ['equal', 'Equal · comparison variant']]) { const option = node('option', label); option.value = value; system.append(option); }
  const returnsLabel = node('label', null, 'pc-check'), returns = node('input'); returns.type = 'checkbox'; returns.id = `${prefix}-returns`; returns.dataset.pcField = 'includeReturns'; returnsLabel.htmlFor = returns.id; returnsLabel.append(returns, document.createTextNode(' Calculate tropical solar and lunar return times')); exactFields.append(returnsLabel);
  form.append(node('p', 'Without a recorded time, the calculation uses the actual birth civil-day interval. A midpoint sample is never treated as your birth time; houses, ascendant, daśā and exact return times remain unavailable.', 'pc-help'));
  const actions = node('div', null, 'pc-actions'), apply = node('button', 'Apply birth context', 'btn'), clear = node('button', 'Clear birth details', 'btn-secondary'); apply.type = 'submit'; clear.type = 'button'; apply.dataset.pcAction = 'apply'; clear.dataset.pcAction = 'clear'; actions.append(apply, clear); form.append(actions);
  const status = node('p', 'Optional: no birth context added.', 'pc-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.dataset.pc = 'status';
  const error = node('p', '', 'pc-error'); error.hidden = true; error.tabIndex = -1; error.setAttribute('role', 'alert'); error.dataset.pc = 'error';
  const results = node('div', null, 'pc-results'); results.dataset.pc = 'results';
  const exportBox = node('details', null, 'pc-export'); exportBox.append(node('summary', 'Review an optional JSON export'));
  const privateLabel = node('label', null, 'pc-check'), privateChoice = node('input'); privateChoice.type = 'checkbox'; privateChoice.id = `${prefix}-private`; privateChoice.dataset.pcField = 'includeBirth'; privateLabel.htmlFor = privateChoice.id; privateLabel.append(privateChoice, document.createTextNode(' Include birth inputs, birthplace and derived personal readings in this export')); exportBox.append(privateLabel);
  exportBox.append(node('p', 'Off by default. Without this choice the download contains the selected public instant and source metadata only. With it, review the exact private data below before downloading.', 'pc-help'));
  const prepare = node('button', 'Prepare export preview', 'btn-secondary'); prepare.type = 'button'; prepare.dataset.pcAction = 'prepare';
  const previewLabel = node('label', 'Exact JSON export preview'), preview = node('textarea'); preview.id = `${prefix}-preview`; preview.rows = 8; preview.readOnly = true; preview.dataset.pc = 'preview'; previewLabel.htmlFor = preview.id;
  const download = node('button', 'Download reviewed JSON', 'btn-secondary'); download.type = 'button'; download.dataset.pcAction = 'download'; download.disabled = true;
  exportBox.append(prepare, previewLabel, preview, download); exportBox.hidden = true;
  panel.append(form, error, status, results, exportBox); container.replaceChildren(panel);
  let value = null, result = null, request = null, prepared = null, destroyed = false;
  function clearExport() { prepared = null; preview.value = ''; download.disabled = true; }
  function invalidate(message = 'Birth inputs changed. Apply them again before using or exporting a personal result.') {
    const hadValue = value !== null;
    value = result = request = null; clearExport(); privateChoice.checked = false; results.replaceChildren(); exportBox.hidden = true; error.hidden = true; status.textContent = message;
    if (hadValue) onChange(null);
  }
  function render(output) {
    results.replaceChildren();
    const intro = output.certainty === 'recorded-time' ? `Recorded birth instant: ${output.birthContext.instantUTC}. Selected comparison: ${output.selectedInstant}.` : `Birth time unknown: ${output.birthContext.startUTC} to ${output.birthContext.endUTCExclusive} (exclusive), ${output.birthContext.actualHours} actual hours. These are estimated sampled arcs, not exact natal positions.`;
    results.append(node('p', intro, 'pc-context'));
    for (const [key, title] of [['western', 'Western · tropical'], ['vedic', 'Vedic · approximate Lahiri sidereal']]) {
      const section = node('section', null, 'pc-method'); section.append(node('h3', title), node('p', output.methods[key], 'pc-help'));
      const list = node('dl', null, 'pc-body-list');
      for (const body of output[key].bodies) {
        list.append(node('dt', body.body));
        const offset = output.offsets.find(row => row.body === body.body);
        if (output.certainty === 'recorded-time') {
          list.append(node('dd', `${body.sign} ${degree(body.degreeInSign)} (${degree(body.longitudeDegrees)}); house ${body.house}. Current-minus-birth: ${degree(key === 'western' ? offset.tropicalDegrees : offset.siderealDegrees)}.${body.nakshatra ? ` Nakṣatra ${body.nakshatra.name}, pāda ${body.nakshatra.pada}.` : ''}`));
        } else list.append(node('dd', `Estimated arc ${degree(body.arcStartDegrees)} → ${degree(body.arcEndDegrees)}${body.crossesZero ? ' across 0°' : ''}; span ${degree(body.estimatedSpanDegrees)}. Sampled signs: ${body.sampleSigns.join(', ')}. ${body.qualification}`));
      }
      section.append(list);
      if (output.certainty === 'recorded-time') section.append(node('p', `Ascendant: ${degree(output[key].ascendantDegrees)}. ${key === 'western' ? `Actual house system: ${output.western.houseSystem}. ${output.western.houseWarning || ''}` : 'Whole-sign house model.'}`, 'pc-help'));
      results.append(section);
    }
    if (output.certainty === 'recorded-time') {
      const dasha = output.vedic.vimshottari;
      results.append(node('p', dasha.status === 'traditional-calculation' ? `Traditional Vimśottarī label: ${dasha.mahaLord}${dasha.antarLord ? ' / ' + dasha.antarLord : ''}; ${dasha.startUTC} to ${dasha.endUTC}. ${dasha.convention}` : dasha.reason, 'pc-help'));
    } else results.append(node('p', 'Unavailable without a recorded birth time: ' + output.unavailablePersonal.join('; ') + '.', 'pc-help'));
    const returnDetails = node('details', null, 'pc-return'); returnDetails.append(node('summary', 'Solar and lunar return calculation status'));
    for (const key of ['solar', 'lunar']) { const entry = output.returns[key]; returnDetails.append(node('p', entry.status === 'calculated' ? `${key === 'solar' ? 'Solar' : 'Lunar'} return: ${entry.instantUTC}; longitude residual ${entry.residualDegrees.toExponential(2)}°. ${entry.method}` : `${key === 'solar' ? 'Solar' : 'Lunar'}: ${entry.reason}`)); }
    results.append(returnDetails);
    const sources = node('details'); sources.append(node('summary', 'Sources, variants and limits'));
    for (const source of output.sources) { const p = node('p'), link = node('a', source.title); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; p.append(link, document.createTextNode(` — ${source.edition ? source.edition + '; ' : ''}${source.section ? source.section + '; ' : ''}${source.status}`)); sources.append(p); }
    sources.append(node('p', 'Unimplemented variants: ' + output.unavailableVariants.join('; ') + '.'), node('p', output.limitations.join(' '))); results.append(sources);
  }
  function refresh() {
    if (destroyed) return;
    clearExport(); result = request = null; results.replaceChildren(); exportBox.hidden = true; error.hidden = true;
    if (!value) return;
    const selectedInstant = getSelectedInstant();
    if (!selectedInstant) { status.textContent = 'Birth context held only in this page. Select a valid public calendar moment to compare it.'; return; }
    try {
      request = { birth: value, selectedInstant, houseSystem: fields.houseSystem.value, includeReturns: value.timeKnown && returns.checked };
      result = buildPersonalCalendar(request); render(result); exportBox.hidden = false;
      status.textContent = 'Personal study calculated locally. Birth details are excluded from public calendar exports and URLs; nothing has been saved or sent.';
    } catch (e) { request = null; error.textContent = e.message; error.hidden = false; status.textContent = 'The selected comparison is unavailable. Correct the public moment or birth inputs.'; }
  }
  form.addEventListener('input', () => { invalidate(); exactFields.hidden = !known.checked; if (!known.checked) returns.checked = false; });
  form.addEventListener('change', () => { invalidate(); exactFields.hidden = !known.checked; if (!known.checked) returns.checked = false; });
  form.addEventListener('submit', event => {
    event.preventDefault(); if (destroyed) return;
    try {
      const birth = { date: fields.date.value, timeZone: fields.timeZone.value, timeKnown: known.checked };
      if (known.checked) {
        if (!fields.lat.value.trim() || !fields.lon.value.trim()) throw new RangeError('Enter both birthplace coordinates for a timed chart.');
        Object.assign(birth, { time: fields.time.value, lat: Number(fields.lat.value), lon: Number(fields.lon.value), disambiguation: fields.disambiguation.value });
      }
      value = normalizeBirthContext(birth); onChange(value); refresh();
    } catch (e) { invalidate('Birth context was not accepted. Correct the highlighted message and apply again.'); error.textContent = e.message; error.hidden = false; error.focus(); }
  });
  privateChoice.addEventListener('change', clearExport);
  prepare.addEventListener('click', () => {
    if (!request || !value || getSelectedInstant() !== request.selectedInstant) { refresh(); return; }
    prepared = exportPersonalCalendar(request, { includeBirth: privateChoice.checked }); preview.value = JSON.stringify(prepared, null, 2); download.disabled = false;
  });
  download.addEventListener('click', () => {
    if (!prepared || !request || getSelectedInstant() !== request.selectedInstant) { refresh(); return; }
    const url = URL.createObjectURL(new Blob([preview.value + '\n'], { type: 'application/json' })), link = node('a'); link.href = url; link.download = 'personal-calendar-study.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  function clearAll() {
    invalidate('Birth details cleared from this component. No stored copy was created.');
    for (const key of ['date', 'timeZone', 'time', 'lat', 'lon']) fields[key].value = '';
    known.checked = returns.checked = privateChoice.checked = false; fold.value = 'reject'; system.value = 'regiomontanus'; exactFields.hidden = true;
  }
  clear.addEventListener('click', clearAll);
  return { getValue: () => value, clear: clearAll, refresh, destroy() { if (destroyed) return; clearAll(); destroyed = true; container.replaceChildren(); } };
}
