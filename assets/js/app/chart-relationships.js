/** Inline, source-labelled relationship exploration. This layer performs no calculation. */
const freeze = value => Object.freeze(value);
export const RELATION_STYLES = freeze({
  conjunction: freeze({ color: '#285a6a', dash: '', glyph: '☌', label: 'Conjunction', angle: '0°' }),
  sextile: freeze({ color: '#4c5d55', dash: '3 4', glyph: '⚹', label: 'Sextile', angle: '60°' }),
  square: freeze({ color: '#725018', dash: '8 4', glyph: '□', label: 'Square', angle: '90°' }),
  trine: freeze({ color: '#3a5f85', dash: '12 4', glyph: '△', label: 'Trine', angle: '120°' }),
  opposition: freeze({ color: '#6c4967', dash: '10 3 2 3', glyph: '☍', label: 'Opposition', angle: '180°' }),
  'mutual-reception': freeze({ color: '#73503c', dash: '5 3 1 3', glyph: '↔', label: 'Mutual reception', angle: '' }),
  'full-drishti': freeze({ color: '#285a6a', dash: '7 3', glyph: '→', label: 'Full dṛṣṭi', angle: '' }),
  'special-drishti': freeze({ color: '#6c4967', dash: '7 3 2 3', glyph: '⇒', label: 'Special dṛṣṭi', angle: '' }),
});
const FALLBACK_STYLE = freeze({ color: '#4c5d55', dash: '2 4', glyph: '—', label: 'Relationship', angle: '' });
export function relationPresentation(type) { return RELATION_STYLES[type] || FALLBACK_STYLE; }
const RING_COLORS = freeze({
  'tropical-zodiac': '#285a6a', 'sidereal-zodiac': '#6c4967', nakshatra: '#725018', 'solar-terms': '#3a5f85',
  'western-regiomontanus': '#4c5d55', 'western-placidus': '#73503c', 'western-whole': '#555980', 'western-equal': '#3e6b63',
});
const RING_FALLBACKS = freeze(['#285a6a', '#6c4967', '#725018', '#3a5f85', '#4c5d55', '#73503c', '#555980', '#3e6b63']);
/** Stable across filtering/reordering; callers still supply the explicit ring name. */
export function calendarRingColor(id) {
  if (typeof id !== 'string' || !id) return '#4c5d55';
  if (Object.hasOwn(RING_COLORS, id)) return RING_COLORS[id];
  let hash = 2166136261;
  for (const char of id.slice(0,4096)) hash = Math.imul(hash ^ char.codePointAt(0), 16777619) >>> 0;
  return RING_FALLBACKS[hash % RING_FALLBACKS.length];
}

const SITE_ROOT = new URL('../../../', import.meta.url);
const PAGE_SIZE = 8;
let serial = 0;
const text = (value, max = 1000) => typeof value === 'string' ? value.slice(0, max) : '';
const array = (value, maximum, name) => {
  if (!Array.isArray(value) || value.length > maximum) throw new TypeError(`${name} must be a bounded array (at most ${maximum}).`);
  return value;
};
const finite = value => Number.isFinite(value) ? value : null;
function sourceURL(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048) return '';
  try { const url = new URL(value, SITE_ROOT); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; }
  catch { return ''; }
}
function normalizeModel(value) {
  const input = value || {};
  const methods = array(input.methods || [], 32, 'Relationship methods').map(method => ({
    id: text(method.id, 120), label: text(method.label, 240), available: method.available === true,
    reason: text(method.reason, 2000), frame: text(method.frame, 600), sourceIds: array(method.sourceIds || [], 32, 'Method sources').map(id => text(id, 160)),
  }));
  if (methods.some(m => !m.id || !m.label) || new Set(methods.map(m => m.id)).size !== methods.length) throw new TypeError('Relationship methods need unique IDs and labels.');
  const methodIds = new Set(methods.map(m => m.id)), ids = new Set();
  const relations = array(input.relations || [], 2048, 'Relationships').map(item => {
    const id = text(item.id, 240), methodId = text(item.methodId, 120);
    if (!id || ids.has(id) || !methodIds.has(methodId)) throw new TypeError('Relationships need unique IDs and a declared method.');
    ids.add(id);
    return {
      id, methodId, type: text(item.type, 80), bodyIds: [...new Set(array(item.bodyIds || [], 12, 'Relationship bodies').map(id => text(id, 120)).filter(Boolean))],
      label: text(item.label, 400) || 'Relationship', summary: text(item.summary, 3000),
      classification: ['favorable', 'caution', 'mixed', 'unavailable', 'neutral'].includes(item.classification) ? item.classification : 'neutral',
      separationDegrees: finite(item.separationDegrees), angleDegrees: finite(item.angleDegrees), orbDegrees: finite(item.orbDegrees), allowedOrbDegrees: finite(item.allowedOrbDegrees),
      phase: text(item.phase, 120), directed: item.directed === true,
      sourceIds: array(item.sourceIds || [], 32, 'Relationship sources').map(id => text(id, 160)),
      details: array(item.details || [], 64, 'Relationship details').map(d => ({ label: text(d.label, 200), value: text(d.value, 3000) })),
      limitations: array(item.limitations || [], 32, 'Relationship limits').map(v => text(v, 2000)),
    };
  });
  return {
    methods, relations, context: { dateISO: text(input.context?.dateISO, 100) },
    bodies: array(input.bodies || [], 128, 'Body labels').map(body => ({ id: text(body.id, 120), label: text(body.label, 240) || text(body.id, 120) })),
    sources: array(input.sources || [], 256, 'Source records').map(source => ({ id: text(source.id, 160), title: text(source.title || source.label, 500), url: sourceURL(source.url), locator: text(source.locator || source.section, 1500), readingDepth: text(source.readingDepth, 2000) })),
    limitations: array(input.limitations || [], 32, 'Model limits').map(v => text(v, 2000)),
  };
}

/**
 * Callback contract:
 * onChange/onViewChange(state): filtered relations after model/filter/pin changes, never pointer movement.
 * onHighlight({relationId,bodyIds,type,methodId,pinned}|null): presentation only, including hover/focus previews.
 * onSelect(relation|null): explicit pin/clear only. No storage, ephemeris, worker or network work occurs here.
 */
export function mountRelationshipInspector(host, options = {}) {
  if (!host?.ownerDocument) throw new TypeError('A relationship inspector needs a DOM container.');
  const doc = host.ownerDocument, win = doc.defaultView;
  const href = new URL('../../css/chart-relationships.css', import.meta.url).href;
  if (![...doc.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === href)) {
    const link = doc.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.dataset.chartRelationshipsStyle = ''; doc.head.append(link);
  }
  let config = { id: '', label: 'Relationships in this chart', compact: false, disabled: false, bodyId: null, ...options };
  let model = normalizeModel(config.model), destroyed = false, methodId = model.methods.find(m => m.id === 'geometry')?.id || model.methods[0]?.id || '';
  let typeFilter = 'all', scope = config.bodyId ? 'selected' : 'all', selectedId = null, previewId = null, page = 0, leaveTimer = null, focusGuard = false, pendingFocusId = null;
  let returnAnchor = null, lastHighlight = '', transientStatus = '', stateVersion = 0;
  const uid = `chart-relations-${++serial}`;
  const node = (tag, value, className) => { const n = doc.createElement(tag); if (value != null) n.textContent = value; if (className) n.className = className; return n; };
  const button = (label, className) => { const n = node('button', label, className); n.type = 'button'; return n; };
  const root = node('section', null, 'chart-relations'); root.dataset.relationshipInspector = text(config.id, 160) || uid;
  const title = node('h3', config.label, 'cr-title'); title.id = uid + '-title'; root.setAttribute('aria-labelledby', title.id);
  const heading = node('div', null, 'cr-heading'), count = node('span', '', 'cr-count'); heading.append(title, count);
  const intro = node('p', 'Choose a relationship to connect its bodies and inspect the declared rule. Color identifies the relationship type; it is not an outcome score.', 'cr-intro');
  const controls = node('div', null, 'cr-controls');
  const selectField = (label, className) => { const field = node('label', label, 'cr-field ' + className + '-field'), input = node('select', null, className); field.append(input); controls.append(field); return input; };
  const methodSelect = selectField('Rule or convention', 'cr-method'), typeSelect = selectField('Relationship type', 'cr-type'), scopeSelect = selectField('Body scope', 'cr-scope');
  const methodNote = node('p', '', 'cr-method-note'), legend = node('ul', null, 'cr-legend'); legend.setAttribute('aria-label', 'Relationship colors and line patterns');
  const content = node('div', null, 'cr-content'), results = node('div', null, 'cr-results');
  const list = node('ul', null, 'cr-list'); list.setAttribute('aria-label', 'Available relationships');
  const empty = node('p', '', 'cr-empty');
  const pager = node('div', null, 'cr-pager'), previous = button('← Previous', 'cr-prev'), next = button('Next →', 'cr-next'), pageLabel = node('span', '', 'cr-page-label'); pager.append(previous, pageLabel, next);
  results.append(list, empty, pager);
  const detail = node('div', null, 'cr-detail'); detail.setAttribute('role', 'region'); detail.setAttribute('aria-labelledby', uid+'-detail-title');
  const detailHead = node('div', null, 'cr-detail-head'), detailTitle = node('h4', '', 'cr-detail-title'), clearButton = button('Clear', 'cr-clear'); detailTitle.id=uid+'-detail-title'; clearButton.setAttribute('aria-label', 'Clear selected relationship'); detailHead.append(detailTitle, clearButton);
  const detailState = node('p', '', 'cr-detail-state'), summary = node('p', '', 'cr-summary'), facts = node('dl', null, 'cr-facts');
  const workings = node('details', null, 'cr-workings'), workingsSummary = node('summary', 'Rule, frame & sources'), workBody = node('div'); workings.append(workingsSummary, workBody);
  detail.append(detailHead, detailState, summary, facts, workings); content.append(results, detail);
  const availability = node('details', null, 'cr-availability'), availabilitySummary = node('summary', 'Method availability & limits'), availabilityBody = node('div'); availability.append(availabilitySummary, availabilityBody);
  const status = node('p', '', 'cr-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  root.append(heading, intro, controls, methodNote, legend, content, availability, status); host.append(root);

  const currentMethod = () => model.methods.find(m => m.id === methodId);
  const byId = id => model.relations.find(r => r.id === id);
  const methodRows = () => currentMethod()?.available ? model.relations.filter(r => r.methodId === methodId) : [];
  const filteredRows = () => methodRows().filter(r => (typeFilter === 'all' || r.type === typeFilter) && (scope !== 'selected' || !config.bodyId || r.bodyIds.includes(config.bodyId)));
  const activeRelation = () => byId(selectedId || previewId);
  const fmt = value => Number.isFinite(value) ? `${value.toFixed(3)}°` : null;
  const bodyLabel = id => model.bodies.find(b => b.id === id)?.label || id;
  function stopLeave() { if (leaveTimer !== null) win.clearTimeout(leaveTimer); leaveTimer = null; }
  function getState() {
    const relations = config.disabled ? [] : filteredRows();
    return { methodId, typeFilter, scope, bodyId: config.bodyId, relations: relations.map(r => ({ ...r, bodyIds: [...r.bodyIds] })), visibleRelationIds: relations.map(r => r.id), selectedId, previewId, disabled: !!config.disabled };
  }
  function emitView() { if (!destroyed) (config.onViewChange || config.onChange)?.(getState()); }
  function emitHighlight(force = false) {
    const relation = !config.disabled && activeRelation(), payload = relation ? { relationId: relation.id, bodyIds: [...relation.bodyIds], type: relation.type, methodId: relation.methodId, pinned: !!selectedId } : null;
    const signature = JSON.stringify(payload);
    if (!destroyed && (force || signature !== lastHighlight)) { lastHighlight = signature; config.onHighlight?.(payload); }
  }
  function addSources(target, ids) {
    for (const id of [...new Set(ids)]) {
      const source = model.sources.find(s => s.id === id), p = node('p', null, 'cr-source');
      p.append(node('strong', source?.title || id));
      if (source?.locator) p.append(doc.createTextNode(' · ' + source.locator));
      if (source?.url) { const a = node('a', 'Open source ↗'); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; p.append(a); }
      if (source?.readingDepth) p.append(node('small', source.readingDepth));
      target.append(p);
    }
  }
  function renderDetail() {
    const relation = activeRelation();
    detail.hidden = !relation; clearButton.disabled = !!config.disabled || !relation;
    for (const entry of list.querySelectorAll('.cr-entry')) {
      const chosen = entry.dataset.relationId === selectedId, previewed = !selectedId && entry.dataset.relationId === previewId;
      entry.setAttribute('aria-pressed', String(chosen)); entry.classList.toggle('cr-previewed', previewed);
    }
    if (!relation) return;
    const style = relationPresentation(relation.type); detail.style.setProperty('--cr-relation-color', style.color);
    detailTitle.textContent = relation.label; detailState.textContent = `${selectedId ? 'Pinned selection' : 'Preview · activate to pin'} · ${currentMethod()?.label || relation.methodId}${relation.directed ? ' · directed relationship' : ''}`;
    summary.textContent = relation.summary; summary.hidden = !relation.summary;
    const values = [['Longitude separation', fmt(relation.separationDegrees)], ['Target angle', fmt(relation.angleDegrees)], ['From exact', fmt(relation.orbDegrees)], ['Allowed orb', fmt(relation.allowedOrbDegrees)], ['Motion status', relation.phase && relation.phase !== 'not-applicable' ? relation.phase.replaceAll('-', ' ') : null]];
    facts.replaceChildren(...values.filter(([,value]) => value != null).flatMap(([label,value]) => [node('dt',label),node('dd',value)])); facts.hidden = !facts.children.length;
    workBody.replaceChildren();
    if (currentMethod()?.frame) workBody.append(node('p', 'Frame · ' + currentMethod().frame));
    if (model.context.dateISO) workBody.append(node('p', 'Held instant · ' + model.context.dateISO, 'cr-instant'));
    if (relation.classification !== 'neutral') workBody.append(node('p', `Named rule classification · ${relation.classification}`, 'cr-classification'));
    if (relation.details.length) { const dl = node('dl', null, 'cr-facts'); for (const d of relation.details) dl.append(node('dt', d.label), node('dd', d.value)); workBody.append(dl); }
    addSources(workBody, relation.sourceIds);
    if (relation.limitations.length) { const ul = node('ul', null, 'cr-limits'); for (const limit of relation.limitations) ul.append(node('li', limit)); workBody.append(ul); }
    workings.hidden = !workBody.children.length;
  }
  function renderFilters() {
    methodSelect.replaceChildren(...model.methods.map(method => { const option = node('option', method.label + (method.available ? '' : ' · unavailable')); option.value = method.id; return option; })); methodSelect.value = methodId;
    const types = [...new Set(methodRows().map(r => r.type))];
    if (!types.includes(typeFilter)) typeFilter = 'all';
    typeSelect.replaceChildren(...['all', ...types].map(type => { const option = node('option', type === 'all' ? 'All types' : relationPresentation(type).label); option.value = type; return option; })); typeSelect.value = typeFilter;
    scopeSelect.replaceChildren(...(config.bodyId ? [['selected', bodyLabel(config.bodyId)], ['all', 'All bodies']] : [['all', 'All bodies']]).map(([id,label]) => { const option = node('option', label); option.value = id; return option; }));
    if (!config.bodyId) scope = 'all'; scopeSelect.value = scope;
    for (const input of [methodSelect,typeSelect,scopeSelect]) input.disabled = !!config.disabled || !model.methods.length;
    scopeSelect.closest('label').hidden = !config.bodyId;
    const method = currentMethod(); methodNote.textContent = method?.available ? method.reason || method.frame || 'Relationships from the declared held calculation.' : method?.reason || 'No relationship method is available for this frame.';
    legend.replaceChildren(...types.map(type => { const style = relationPresentation(type), li = node('li'); li.style.setProperty('--cr-relation-color', style.color); const swatch = node('span', style.glyph, 'cr-glyph'); swatch.setAttribute('aria-hidden','true');
      const sample=doc.createElementNS('http://www.w3.org/2000/svg','svg'),line=doc.createElementNS('http://www.w3.org/2000/svg','line');sample.setAttribute('viewBox','0 0 26 10');sample.setAttribute('width','26');sample.setAttribute('height','10');sample.setAttribute('aria-hidden','true');sample.classList.add('cr-line-sample');for(const [key,value]of Object.entries({x1:1,y1:5,x2:25,y2:5,stroke:style.color,'stroke-width':2}))line.setAttribute(key,String(value));if(style.dash)line.setAttribute('stroke-dasharray',style.dash);sample.append(line);
      li.append(swatch,sample,doc.createTextNode(style.label + (style.angle ? ' · '+style.angle : ''))); return li; }));
    availabilityBody.replaceChildren();
    for (const method of model.methods) { const p = node('p'); p.append(node('strong',method.label+' · '+(method.available?'available':'unavailable')),node('span',method.reason || method.frame)); availabilityBody.append(p); }
    if (model.limitations.length) { const ul=node('ul'); for(const limit of model.limitations)ul.append(node('li',limit)); availabilityBody.append(ul); }
  }
  function clearPreview() {
    stopLeave(); if (destroyed || selectedId || !previewId) return;
    previewId = null; renderDetail(); emitHighlight();
  }
  function preview(id, anchor = null) {
    if (destroyed || config.disabled || selectedId || focusGuard) return false;
    const relation = filteredRows().find(r => r.id === id); if (!relation) return false;
    stopLeave(); if (previewId === id) return true;
    previewId = id; if (anchor) returnAnchor = anchor; renderDetail(); emitHighlight(); return true;
  }
  function scheduleClear() {
    stopLeave(); leaveTimer = win.setTimeout(() => {
      leaveTimer = null;
      if (destroyed || selectedId || detail.matches(':hover') || detail.contains(doc.activeElement)) return;
      const entry = [...list.querySelectorAll('.cr-entry')].find(e => e.dataset.relationId === previewId);
      if (entry && (entry.matches(':hover') || entry === doc.activeElement)) return;
      clearPreview();
    }, 180);
  }
  function setSelection(id, { notify = true, anchor = null } = {}) {
    if (destroyed || config.disabled) return false;
    const relation = filteredRows().find(r => r.id === id); if (!relation) return false;
    const version=++stateVersion; stopLeave(); selectedId = id; previewId = null; returnAnchor = anchor || [...list.querySelectorAll('.cr-entry')].find(e => e.dataset.relationId === id) || returnAnchor;
    transientStatus = `Selected ${relation.label}.`; renderDetail(); status.textContent = transientStatus; emitView(); emitHighlight(true);
    if (!destroyed && version===stateVersion && notify) config.onSelect?.({ ...relation, bodyIds: [...relation.bodyIds] }); return !destroyed;
  }
  function clear({ restoreFocus = false, notify = true } = {}) {
    if (destroyed) return;
    const version=++stateVersion, hadSelection = !!selectedId, anchor = returnAnchor; stopLeave(); selectedId = previewId = null; returnAnchor = null; transientStatus = 'Relationship highlight cleared.'; renderDetail(); status.textContent = transientStatus; emitView(); emitHighlight(true);
    if (!destroyed && version===stateVersion && notify && hadSelection) config.onSelect?.(null);
    if (!destroyed && version===stateVersion && restoreFocus && anchor?.isConnected && !anchor.disabled) { focusGuard = true; anchor.focus({ preventScroll: true }); focusGuard = false; }
  }
  function renderList() {
    const rows = filteredRows(), pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE)); page = Math.max(0, Math.min(page,pages-1));
    const activeId = doc.activeElement?.classList.contains('cr-entry') ? doc.activeElement.dataset.relationId : null;
    list.replaceChildren(...rows.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE).map(relation => {
      const li = node('li'), entry = button('', 'cr-entry'), style = relationPresentation(relation.type); entry.dataset.relationId = relation.id; entry.dataset.relationType = relation.type; entry.disabled = !!config.disabled; entry.style.setProperty('--cr-relation-color',style.color);
      const glyph=node('span',style.glyph,'cr-entry-glyph');glyph.setAttribute('aria-hidden','true');
      const label=node('span',relation.label,'cr-entry-label'), meta=node('small',[style.label,relation.orbDegrees!=null?`${relation.orbDegrees.toFixed(2)}° from exact`:null,relation.phase&&relation.phase!=='not-applicable'?relation.phase.replaceAll('-',' '):null].filter(Boolean).join(' · '),'cr-entry-meta');
      entry.append(glyph,label,meta);entry.setAttribute('aria-controls',uid+'-detail');
      entry.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')preview(relation.id,entry);});entry.addEventListener('pointerleave',scheduleClear);
      entry.addEventListener('focus',()=>preview(relation.id,entry));entry.addEventListener('blur',scheduleClear);
      entry.addEventListener('click',()=>{if(selectedId===relation.id)clear();else setSelection(relation.id,{anchor:entry});});li.append(entry);return li;
    }));
    count.textContent = `${rows.length} ${rows.length===1?'relationship':'relationships'}`;
    empty.hidden = !!rows.length;empty.textContent = !currentMethod()?.available ? currentMethod()?.reason || 'No supported method is available.' : typeFilter!=='all'||scope==='selected' ? 'No relationship matches this type and body scope at the held instant. Change a filter to inspect the available set.' : 'No relationship satisfies this method at the held instant.';
    pager.hidden = rows.length <= PAGE_SIZE; pageLabel.textContent = rows.length ? `${page*PAGE_SIZE+1}–${Math.min((page+1)*PAGE_SIZE,rows.length)} of ${rows.length}` : '0'; previous.disabled=!!config.disabled||page===0;next.disabled=!!config.disabled||page>=pages-1;
    const focusId=activeId||(!config.disabled&&doc.activeElement===doc.body?pendingFocusId:null);
    if (config.disabled&&activeId) pendingFocusId=activeId;
    if (!config.disabled&&focusId) {const target=[...list.querySelectorAll('.cr-entry')].find(e=>e.dataset.relationId===focusId);if(target){focusGuard=true;target.focus({preventScroll:true});focusGuard=false;}pendingFocusId=null;}
  }
  function renderAll() {
    root.classList.toggle('cr-compact',!!config.compact);root.classList.toggle('cr-disabled',!!config.disabled);root.setAttribute('aria-disabled',String(!!config.disabled)); title.textContent=text(config.label,240)||'Relationships in this chart';
    renderFilters();const ids=new Set(filteredRows().map(r=>r.id));
    if (config.disabled || selectedId&&!ids.has(selectedId) || previewId&&!ids.has(previewId)) {if(selectedId||previewId)transientStatus=config.disabled?'Previous relationship selection cleared while the parent frame is held.':'Previous relationship is unavailable under these filters or this frame.';selectedId=previewId=null;returnAnchor=null;}
    renderList();renderDetail();status.textContent=config.disabled?'Previous frame retained. Update the parent chart to inspect relationships.':transientStatus;
  }
  function changeFilter() {stateVersion++;stopLeave();page=0;transientStatus='';renderAll();emitView();emitHighlight(true);}
  methodSelect.addEventListener('change',()=>{if(config.disabled||destroyed)return;methodId=methodSelect.value;typeFilter='all';changeFilter();});
  typeSelect.addEventListener('change',()=>{if(config.disabled||destroyed)return;typeFilter=typeSelect.value;changeFilter();});scopeSelect.addEventListener('change',()=>{if(config.disabled||destroyed)return;scope=scopeSelect.value;changeFilter();});
  previous.addEventListener('click',()=>{if(config.disabled||destroyed)return;page--;clearPreview();renderList();renderDetail();});next.addEventListener('click',()=>{if(config.disabled||destroyed)return;page++;clearPreview();renderList();renderDetail();});
  clearButton.addEventListener('click',()=>clear({restoreFocus:true}));
  detail.id=uid+'-detail';detail.addEventListener('pointerenter',stopLeave);detail.addEventListener('pointerleave',scheduleClear);detail.addEventListener('focusout',scheduleClear);
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&(selectedId||previewId)){event.preventDefault();event.stopPropagation();clear({restoreFocus:true});}});
  renderAll();emitView();emitHighlight();
  return {
    getState, setSelection, preview, clearPreview, clear,
    update(patch={}) {
      if(destroyed)return;const nextModel=Object.hasOwn(patch,'model')?normalizeModel(patch.model):model;
      if(root.contains(doc.activeElement)&&doc.activeElement.classList.contains('cr-entry'))pendingFocusId=doc.activeElement.dataset.relationId;
      stateVersion++;config={...config,...patch};model=nextModel;if(!model.methods.some(m=>m.id===methodId))methodId=model.methods.find(m=>m.id==='geometry')?.id||model.methods[0]?.id||'';
      stopLeave();renderAll();emitView();emitHighlight(true);
    },
    destroy() {if(destroyed)return;destroyed=true;stateVersion++;stopLeave();selectedId=previewId=null;returnAnchor=null;root.remove();const clearHighlight=config.onHighlight;config={...config,disabled:true,onHighlight:null,onSelect:null,onChange:null,onViewChange:null};clearHighlight?.(null);},
  };
}
