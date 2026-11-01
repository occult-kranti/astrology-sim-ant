/** Shared, source-labelled date navigation. This module performs no calculation. */
export const DATE_KINDS = Object.freeze({
  'traditional-favorable': { label: 'Traditional favorable', icon: '+' },
  'traditional-caution': { label: 'Traditional caution', icon: '!' },
  mixed: { label: 'Mixed traditional rules', icon: '±' },
  astronomy: { label: 'Calculated astronomy', icon: '◉' },
  observance: { label: 'Named observance', icon: '◇' },
  'historical-conflict': { label: 'Historical conflict', icon: '×' },
  'historical-peace': { label: 'Historical peace / diplomacy', icon: '○' },
  'source-claim': { label: 'Source claim', icon: '§' },
  unavailable: { label: 'Unavailable', icon: '—' },
  neutral: { label: 'Date / context', icon: '·' },
});

export const DATE_BOOKMARK_KEY = 'workbench.date-wayfinding.bookmarks.v1';
const BOOKMARK_EVENT = 'date-wayfinding-bookmarks-change';
const MAX_BOOKMARKS = 250;
const PAGE_SIZE = 12;
const MAX_SEGMENTS = 80;
export const CELESTIAL_KINDS = Object.freeze({
  'march-equinox': 'March equinox', 'june-solstice': 'June solstice',
  'september-equinox': 'September equinox', 'december-solstice': 'December solstice',
  'new-moon': 'New Moon', 'first-quarter': 'First quarter', 'full-moon': 'Full Moon', 'last-quarter': 'Last quarter',
});
let serial = 0;
let memoryBookmarks = [];
let storageUnavailable = false;
let activeClose = null;
let activePreviewLocked = null;

function text(value, max = 600) { return typeof value === 'string' ? value.slice(0, max) : ''; }
function token(value, max = 160) {
  return typeof value === 'string' && value.length <= max && /^[a-zA-Z0-9][a-zA-Z0-9:_.@+/-]*$/.test(value) ? value : '';
}
function kindOf(value) { return Object.hasOwn(DATE_KINDS, value) ? value : 'neutral'; }
function validateScope(value) {
  if (value != null && !token(value, 80)) throw new TypeError('A bookmark scope must be a public reference of 1–80 letters, digits or :_.@+/- characters.');
}
function publicDay(value) { return /^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value) ? value.slice(0, 10) : ''; }
function sourceURL(value, base) {
  if (typeof value !== 'string' || value.length > 2048 || !value.trim()) return '';
  try { const url = new URL(value, base); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; }
  catch { return ''; }
}
function normalizeCelestial(value) {
  if (!value || typeof value !== 'object' || !Number.isFinite(value.phase) || value.phase < 0 || value.phase > 1 || !text(value.phaseLabel, 160) || !text(value.sourceLabel, 600)) return null;
  return Object.freeze({ phase: value.phase, phaseLabel: text(value.phaseLabel, 160),
    ...(Number.isFinite(value.illumination) && value.illumination >= 0 && value.illumination <= 1 ? { illumination: value.illumination } : {}),
    sourceLabel: text(value.sourceLabel, 600), calendarLabel: text(value.calendarLabel, 240), timeZone: text(value.timeZone, 160) });
}
function exactInstant(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return false;
  const date = new Date(value); return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 19) === value.slice(0, 19);
}
function normalizeMarkerRange(value) {
  if(value==null)return null;
  const valid=date=>typeof date==='string'&&(/^\d{4}-\d{2}-\d{2}$/.test(date)?Number.isFinite(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date:exactInstant(date));
  if(typeof value!=='object'||Array.isArray(value)||!valid(value.start)||!valid(value.end)||Date.parse(value.end)<Date.parse(value.start))throw new TypeError('Celestial marker range needs ordered, valid UTC dates or exact instants.');
  return Object.freeze({start:value.start,end:value.end});
}

/** Bounded declared fields only; callers retain any calculation data themselves. */
export function normalizeDateItems(items) {
  if (!Array.isArray(items) || items.length > 10000) throw new TypeError('Date navigation requires an array of at most 10,000 entries.');
  const ids = new Set();
  return items.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new TypeError(`Date entry ${index + 1} must be an object.`);
    const id = text(item.id, 160) || `date-entry-${index}`;
    if (ids.has(id)) throw new TypeError('Date navigation entry identifiers must be unique.');
    ids.add(id);
    const celestial = ['source-claim','unavailable'].includes(kindOf(item.kind)) ? null : normalizeCelestial(item.celestial);
    return Object.freeze({
      id, date: text(item.date, 100), label: text(item.label, 240) || 'Date entry',
      kind: kindOf(item.kind), summary: text(item.summary, 3000),
      details: Object.freeze((Array.isArray(item.details) ? item.details : []).slice(0, 24).flatMap(detail => {
        if (!detail || typeof detail !== 'object' || typeof detail.label !== 'string' || typeof detail.value !== 'string') return [];
        return [Object.freeze({ label: text(detail.label, 160), value: text(detail.value, 2000) })];
      })),
      sourceLabel: text(item.sourceLabel, 600), sourceUrl: text(item.sourceUrl, 2048),
      ...(celestial ? { celestial } : {}),
      ...(text(item.calendarLabel, 240) ? { calendarLabel: text(item.calendarLabel, 240) } : {}),
      ...(text(item.timeZone, 160) ? { timeZone: text(item.timeZone, 160) } : {}),
    });
  });
}

/** Exact solved events are independent of the indexed study-day grid. */
export function normalizeDateMarkers(markers) {
  const rows = normalizeDateItems(markers);
  return rows.map((row, index) => {
    const input = markers[index];
    if (!Object.hasOwn(CELESTIAL_KINDS, input.celestialKind) || !exactInstant(row.date) || !row.sourceLabel || !token(row.id) || (input.kind != null && input.kind !== 'astronomy')) throw new TypeError('Celestial markers require a declared event kind, exact UTC instant, public reference and astronomy source.');
    return Object.freeze({ ...row, kind: 'astronomy', celestialKind: input.celestialKind,
      ...(text(input.actionLabel,160)?{actionLabel:text(input.actionLabel,160)}:{}),...(text(input.actionNote,1000)?{actionNote:text(input.actionNote,1000)}:{}) });
  }).sort((a, b) => Date.parse(a.date)-Date.parse(b.date) || a.id.localeCompare(b.id));
}
function validateDataset(items, markers) {
  if (items.length + markers.length > 10000) throw new TypeError('Date entries and celestial markers together must not exceed 10,000 records.');
  const ids = new Set(items.map(item => item.id));
  if (markers.some(marker => ids.has(marker.id))) throw new TypeError('Date entries and celestial markers need distinct public references.');
}

/** Ignore malformed storage without changing it. No caller prose or metadata is retained. */
export function parseDateBookmarks(raw) {
  if (!raw) return [];
  if (typeof raw !== 'string' || raw.length > 200000) throw new TypeError('Stored date bookmarks could not be read.');
  const parsed = JSON.parse(raw);
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.entries) || parsed.entries.length > MAX_BOOKMARKS) throw new TypeError('Stored date bookmarks use an unsupported format.');
  const seen = new Set();
  return parsed.entries.map(entry => {
    if (!entry || !token(entry.scope, 80) || !token(entry.id) || typeof entry.date !== 'string' || !/^(?:\d{4}-\d{2}-\d{2})?$/.test(entry.date) || !Object.hasOwn(DATE_KINDS, entry.kind)) throw new TypeError('Stored date bookmark is invalid.');
    const key = `${entry.scope}\n${entry.id}`;
    if (seen.has(key)) throw new TypeError('Stored date bookmarks contain duplicate entries.');
    seen.add(key);
    return { scope: entry.scope, id: entry.id, date: entry.date, kind: entry.kind };
  });
}

function loadBookmarks(win) {
  if (storageUnavailable) return { entries: memoryBookmarks, note: 'Bookmarks are available in this tab only; browser storage is unavailable.' };
  try {
    const entries = parseDateBookmarks(win.localStorage.getItem(DATE_BOOKMARK_KEY));
    memoryBookmarks = entries;
    return { entries, note: '' };
  } catch (error) {
    // A corrupt record remains untouched until the user deliberately saves/removes.
    if (error instanceof SyntaxError || error instanceof TypeError) return { entries: [], corrupt: true, note: 'Stored date bookmarks could not be read. Saving a date starts a new bookmark list.' };
    storageUnavailable = true;
    return { entries: memoryBookmarks, note: 'Bookmarks are available in this tab only; browser storage is unavailable.' };
  }
}

function loadCSS(doc) {
  const href = new URL('../../css/date-wayfinding.css', import.meta.url).href;
  if ([...doc.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === href)) return;
  const link = doc.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.dataset.dateWayfindingStyle = '';
  doc.head.append(link);
}

/**
 * mountDateNavigator(host, {id,label,items,value,onSelect,bookmarkScope,emptyMessage,compact,disabled})
 * value: item id (preferred), exact date string, or integer index.
 * update(patch) preserves selection and never invokes onSelect. Only explicit navigation does.
 * items are already ordered and source-classified by the caller. No interpretation is inferred.
 * Optional celestial data is supplied astronomy, not inferred here. Exact markers
 * open independent cards; only their explicit action invokes onMarkerSelect.
 * markerActionLabel/Note (or per-marker actionLabel/Note) disclose study-day actions.
 */
export function mountDateNavigator(container, options = {}) {
  if (!container?.ownerDocument) throw new TypeError('A date navigator needs a DOM container.');
  const doc = container.ownerDocument, win = doc.defaultView;
  loadCSS(doc);
  let config = { label: 'Explore dates', emptyMessage: 'No dates are available in this view.', compact: false, disabled: false, ...options };
  validateScope(config.bookmarkScope);
  let items = normalizeDateItems(config.items || []), markers = normalizeDateMarkers(config.markers || []), celestial = normalizeCelestial(config.celestial), selected = 0, preview = null, open = false, pinned = false, destroyed = false;
  validateDataset(items, markers);
  let eventPage = 0, railSignature = '', seasonSignature = '', celestialVersion = 0, markerRange = normalizeMarkerRange(config.markerRange);
  let closeTimer = null, filter = '', savedOnly = false, listPage = 0, managePage = 0, restoringFocus = false, pendingFocus = null;
  let externalAnchor = null, anchorAttributes = null, portal = null, placedAnchorRect = null;
  let bookmarkState = loadBookmarks(win);
  const uid = `date-nav-${++serial}`;
  const scope = () => token(config.bookmarkScope, 80) || token(config.id, 80) || 'public-dates';
  const el = (tag, value, className) => { const node = doc.createElement(tag); if (value != null) node.textContent = value; if (className) node.className = className; return node; };
  const button = (value, className, title) => { const node = el('button', value, className); node.type = 'button'; if (title) node.setAttribute('aria-label', title); return node; };
  const root = el('section', null, 'date-nav'); root.dataset.dateNavigator = text(config.id, 160) || uid;
  const heading = el('h3', config.label, 'date-nav-heading'); heading.id = `${uid}-heading`; root.setAttribute('aria-labelledby', heading.id);
  const head = el('div', null, 'date-nav-head'), count = el('span', '', 'date-nav-count'); head.append(heading, count);
  const empty = el('p', '', 'date-nav-empty');
  const body = el('div', null, 'date-nav-body');
  const controls = el('div', null, 'date-nav-controls');
  const previous = button('←', 'date-nav-prev', 'Previous date entry');
  const next = button('→', 'date-nav-next', 'Next date entry');
  const sliderWrap = el('div', null, 'date-nav-slider-wrap');
  const sliderLabel = el('label', '', 'date-nav-sr'); sliderLabel.htmlFor = `${uid}-slider`;
  const slider = el('input', null, 'date-nav-slider'); slider.type = 'range'; slider.id = `${uid}-slider`; slider.min = '0'; slider.step = '1'; slider.setAttribute('aria-describedby', `${uid}-overview-note`);
  const sliderStage = el('div', null, 'date-nav-slider-stage'), phaseThumb = el('span', null, 'date-nav-phase-thumb'); phaseThumb.setAttribute('aria-hidden', 'true'); phaseThumb.hidden = true; sliderStage.append(slider, phaseThumb);
  const overview = el('div', null, 'date-nav-overview'); overview.setAttribute('aria-hidden', 'true');
  const ends = el('div', null, 'date-nav-ends'); const startDate = el('span'), endDate = el('span'); ends.append(startDate, endDate);
  sliderWrap.append(sliderLabel, overview, sliderStage, ends); controls.append(previous, sliderWrap, next);
  const celestialSection = el('section', null, 'date-nav-celestial-section'), celestialTitle = el('h4', 'Celestial event bookmarks', 'date-nav-celestial-title'), celestialNote = el('p', '', 'date-nav-celestial-note');
  celestialTitle.id = `${uid}-celestial-title`; celestialSection.setAttribute('aria-labelledby', celestialTitle.id);
  const celestialRail = el('div', null, 'date-nav-celestial'); celestialRail.setAttribute('aria-label', 'Solved celestial events; separate from the study-day slider');
  const seasonBookmarks=el('nav',null,'date-nav-season-bookmarks');seasonBookmarks.setAttribute('aria-label','Annual equinox and solstice bookmark presets');
  const celestialLegend = el('ul', null, 'date-nav-celestial-legend'); celestialLegend.setAttribute('aria-label', 'Celestial event symbols');
  const celestialList = el('details', null, 'date-nav-celestial-list'), celestialListSummary = el('summary'), celestialItems = el('ol', null, 'date-nav-celestial-items');
  const celestialControls = el('div', null, 'date-nav-list-controls'), celestialPrevious = button('Previous events', 'date-nav-celestial-prev'), celestialNext = button('Next events', 'date-nav-celestial-next'), celestialCount = el('span', '', 'date-nav-celestial-count'); celestialControls.append(celestialPrevious, celestialCount, celestialNext);
  celestialList.append(celestialListSummary, celestialItems, celestialControls); celestialSection.append(celestialTitle, seasonBookmarks, celestialNote, celestialRail, celestialLegend, celestialList);
  const selectedButton = button('', 'date-nav-selected'); selectedButton.setAttribute('aria-haspopup', 'dialog'); selectedButton.setAttribute('aria-controls', `${uid}-popover`); selectedButton.setAttribute('aria-expanded', 'false');
  const popover = el('div', null, 'date-nav-popover'); popover.id = `${uid}-popover`; popover.hidden = true; popover.setAttribute('role', 'dialog'); popover.setAttribute('aria-labelledby', `${uid}-detail-title`);
  const popoverHeader = el('div', null, 'date-nav-popover-head'); const popoverTitle = el('h4', '', 'date-nav-popover-title'); popoverTitle.id = `${uid}-detail-title`;
  const close = button('Close ×', 'date-nav-close', 'Close date details'); popoverHeader.append(popoverTitle, close);
  const detailDate = el('p', '', 'date-nav-detail-date'), badge = el('span', '', 'date-nav-badge'), summary = el('p', '', 'date-nav-summary'), details = el('dl', null, 'date-nav-facts'), source = el('p', '', 'date-nav-source');
  const bookmark = button('Bookmark date', 'date-nav-bookmark'); bookmark.setAttribute('aria-pressed', 'false');
  const markerSelect = button('Use exact instant', 'date-nav-marker-select'), markerActionNote = el('p', '', 'date-nav-marker-action-note'); markerSelect.hidden = markerActionNote.hidden = true;
  const privacy = el('p', 'Bookmarks save only an entry reference and date on this device.', 'date-nav-bookmark-note');
  popover.append(popoverHeader, detailDate, badge, summary, details, source, markerSelect, markerActionNote, bookmark, privacy);
  const selectedWrap = el('div', null, 'date-nav-selected-wrap'); selectedWrap.append(selectedButton, popover);
  const more = el('details', null, 'date-nav-list'); const moreSummary = el('summary');
  const explanation = el('p', '', 'date-nav-explanation'); explanation.id = `${uid}-overview-note`;
  const legend = el('ul', null, 'date-nav-legend'); legend.setAttribute('aria-label', 'Date types in this view');
  const listTools = el('div', null, 'date-nav-list-tools');
  const searchLabel = el('label', 'Find a listed date', 'date-nav-search-label'); const search = el('input', null, 'date-nav-search'); search.type = 'search'; search.placeholder = 'Date or label'; searchLabel.append(search);
  const savedLabel = el('label', null, 'date-nav-saved-label'); const saved = el('input', null, 'date-nav-saved'); saved.type = 'checkbox'; savedLabel.append(saved, doc.createTextNode('Bookmarked only'));
  listTools.append(searchLabel, savedLabel);
  const list = el('ol', null, 'date-nav-items'); const listMessage = el('p', '', 'date-nav-list-message'); listMessage.setAttribute('aria-live', 'polite');
  const listControls = el('div', null, 'date-nav-list-controls'); const listPrevious = button('Previous entries', 'date-nav-list-prev'), listNext = button('Next entries', 'date-nav-list-next'), listCount = el('span', '', 'date-nav-list-count'); listControls.append(listPrevious, listCount, listNext);
  const manager = el('details', null, 'date-nav-manager'), managerSummary = el('summary');
  const managerNote = el('p', 'Saved public references from all views. Removing a bookmark does not change a chart or date selection.', 'date-nav-bookmark-note');
  const managerList = el('ul', null, 'date-nav-manager-items');
  const managerControls = el('div', null, 'date-nav-list-controls'), managerPrevious = button('Previous saved', 'date-nav-manager-prev'), managerNext = button('Next saved', 'date-nav-manager-next'), managerCount = el('span', '', 'date-nav-list-count'); managerControls.append(managerPrevious, managerCount, managerNext);
  manager.append(managerSummary, managerNote, managerList, managerControls);
  more.append(moreSummary, explanation, legend, listTools, listMessage, list, listControls, manager);
  const status = el('p', bookmarkState.note, 'date-nav-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  body.append(controls, celestialSection, selectedWrap, more); root.append(head, empty, body, status); container.append(root);

  function isSaved(item) { return bookmarkState.entries.some(entry => entry.scope === scope() && entry.id === item?.id); }
  function resolve(value, fallback = 0) {
    if (!items.length) return 0;
    if (Number.isInteger(value)) return Math.max(0, Math.min(items.length - 1, value));
    const index = items.findIndex(item => item.id === value);
    if (index >= 0) return index;
    const byDate = items.findIndex(item => item.date === value);
    return byDate >= 0 ? byDate : Math.max(0, Math.min(items.length - 1, fallback));
  }
  selected = resolve(config.value);
  function mark(node, item) { node.dataset.kind = item.kind; }
  function badgeText(item) { const kind = DATE_KINDS[item.kind]; return `${kind.icon} ${kind.label}`; }
  const svgNode = (tag, attrs = {}) => { const node = doc.createElementNS('http://www.w3.org/2000/svg', tag); for (const [key,value] of Object.entries(attrs)) node.setAttribute(key, String(value)); return node; };
  function celestialGlyph(kind, phase = null) {
    const svg = svgNode('svg', { viewBox: '0 0 24 24', width: 24, height: 24, 'aria-hidden': 'true', focusable: 'false' }); svg.classList.add('date-nav-celestial-glyph');
    if (phase != null || ['new-moon','first-quarter','full-moon','last-quarter'].includes(kind)) {
      const value = phase ?? ({ 'new-moon':0, 'first-quarter':.25, 'full-moon':.5, 'last-quarter':.75 })[kind], step = Math.round(value * 8) % 8;
      svg.dataset.phaseStep = String(step); svg.append(svgNode('circle', { cx:12,cy:12,r:9,fill:'var(--dn-phase-dark, #2b3d47)',stroke:'var(--dn-phase-rim, currentColor)','stroke-width':1.2 }));
      const paths = { 1:'M12 3A9 9 0 0 1 12 21A6.5 9 0 0 0 12 3', 2:'M12 3A9 9 0 0 1 12 21Z', 3:'M12 3A9 9 0 0 1 12 21A6.5 9 0 0 1 12 3', 5:'M12 3A9 9 0 0 0 12 21A6.5 9 0 0 0 12 3', 6:'M12 3A9 9 0 0 0 12 21Z', 7:'M12 3A9 9 0 0 0 12 21A6.5 9 0 0 1 12 3' };
      if (step === 4) svg.append(svgNode('circle', { cx:12,cy:12,r:8.4,fill:'var(--dn-phase-light, #fffdf6)' }));
      else if (paths[step]) svg.append(svgNode('path', { d:paths[step],fill:'var(--dn-phase-light, #fffdf6)' }));
    } else {
      svg.append(svgNode('circle', { cx:12,cy:12,r:4,fill:'none',stroke:'currentColor','stroke-width':1.5 }));
      svg.append(svgNode('path', { d:'M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',fill:'none',stroke:'currentColor','stroke-width':1.3,'stroke-linecap':'round' }));
      if (kind?.includes('equinox')) svg.append(svgNode('path', { d:'M4 12h16',stroke:'currentColor','stroke-width':1 }));
      if (kind?.includes('solstice')) svg.append(svgNode('path', { d:kind==='june-solstice'?'M9 5l3-3 3 3M12 2v4':'M9 19l3 3 3-3M12 18v4',fill:'none',stroke:'currentColor','stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round' }));
    }
    return svg;
  }
  function bookmarkStar(saved) {
    const svg = svgNode('svg', { viewBox:'0 0 24 24',width:18,height:18,'aria-hidden':'true',focusable:'false' }); svg.classList.add('date-nav-bookmark-star'); svg.dataset.saved=String(saved);
    svg.append(svgNode('path', { d:'m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.4l6.2-.9Z',fill:saved?'currentColor':'none',stroke:'currentColor','stroke-width':1.5 })); return svg;
  }
  function itemCelestial(item, allowCurrent = false) {
    return item && !['source-claim','unavailable'].includes(item.kind) ? item.celestial || (allowCurrent && item.id === items[selected]?.id ? celestial : null) : null;
  }
  const phaseText = value => `${value.phaseLabel}${value.illumination != null ? ` · ${(value.illumination * 100).toFixed(1)}% illuminated` : ''}`;
  function markerButton(item, className) {
    const entry = button('', className); entry.dataset.markerId=item.id; entry.dataset.celestialKind=item.celestialKind; entry.dataset.kind='astronomy'; entry.disabled=!!config.disabled;
    entry.append(celestialGlyph(item.celestialKind, item.celestial?.phase),el('span',item.label,'date-nav-celestial-label'),el('span',className==='date-nav-celestial-list-item'?item.date:item.date.slice(5,10),'date-nav-celestial-date'),bookmarkStar(isSaved(item)));
    entry.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')showDetails(item,false,entry);}); entry.addEventListener('pointerleave',scheduleClose);
    entry.addEventListener('focus',()=>showDetails(item,false,entry)); entry.addEventListener('blur',scheduleClose); entry.addEventListener('click',()=>showDetails(item,true,entry));
    return entry;
  }
  function refreshCelestialSaved() {
    for (const entry of root.querySelectorAll('[data-marker-id]')) {
      const item=markers.find(marker=>marker.id===entry.dataset.markerId); if(!item)continue;
      const saved=isSaved(item);entry.dataset.saved=String(saved);entry.setAttribute('aria-label',`${item.label}. Exact UTC ${item.date}. ${item.calendarLabel||'Shared astronomy'}${item.timeZone?`. Zone ${item.timeZone}`:''}.${saved?' Bookmarked.':''} Details and bookmark.`);
      entry.querySelector('.date-nav-bookmark-star')?.replaceWith(bookmarkStar(saved));entry.disabled=!!config.disabled;
    }
  }
  function renderCelestialList() {
    const pages=Math.max(1,Math.ceil(markers.length/PAGE_SIZE));eventPage=Math.max(0,Math.min(eventPage,pages-1)); const begin=eventPage*PAGE_SIZE; celestialItems.start=begin+1;
    celestialItems.replaceChildren(...markers.slice(begin,begin+PAGE_SIZE).map(item=>{const li=el('li');li.append(markerButton(item,'date-nav-celestial-list-item'));return li;}));
    celestialCount.textContent=markers.length?`${begin+1}–${Math.min(begin+PAGE_SIZE,markers.length)} of ${markers.length}`:'0 events';
    celestialPrevious.disabled=!!config.disabled||eventPage===0;celestialNext.disabled=!!config.disabled||eventPage>=pages-1;refreshCelestialSaved();
  }
  function renderSeasonBookmarks(){
    const year=Number.isInteger(config.focusYear)?String(config.focusYear).padStart(4,'0'):publicDay(items[selected]?.date||'')?items[selected].date.slice(0,4):markers[0]?.date.slice(0,4);
    const signature=`${celestialVersion}:${year}`;if(signature===seasonSignature)return;seasonSignature=signature;
    const seasons=markers.filter(item=>(item.celestialKind.includes('equinox')||item.celestialKind.includes('solstice'))&&item.date.startsWith(year+'-'));
    const unique=[...new Map(seasons.map(item=>[item.celestialKind,item])).values()].slice(0,4);
    seasonBookmarks.replaceChildren(...unique.map(item=>markerButton(item,'date-nav-season-bookmark')));seasonBookmarks.hidden=!unique.length;seasonBookmarks.setAttribute('aria-label',`Equinox and solstice bookmark presets for ${year||'the supplied year'}; opening a preset does not save it`);
  }
  function renderCelestial(force = false) {
    celestialSection.hidden=!markers.length;celestialListSummary.textContent=`All exact celestial events · ${markers.length}`;
    const width=Math.max(44,celestialRail.clientWidth||root.clientWidth||win.innerWidth-32), capacity=Math.max(1,Math.min(40,Math.floor(width/56)));
    const signature=`${celestialVersion}:${capacity}`;
    if(force||signature!==railSignature){
      railSignature=signature; const times=items.map(item=>publicDay(item.date)?Date.parse(item.date):NaN).filter(Number.isFinite);
      const suppliedStart=Date.parse(markerRange?.start),suppliedEnd=Date.parse(markerRange?.end);
      const start=Number.isFinite(suppliedStart)?suppliedStart:times.length?Math.min(...times):markers.length?Date.parse(markers[0].date):0;
      const end=Number.isFinite(suppliedEnd)?suppliedEnd:times.length?Math.max(...times):markers.length?Date.parse(markers.at(-1).date):start;
      const visible=markers.filter(item=>Date.parse(item.date)>=start&&Date.parse(item.date)<=end), countByFamily={solar:0,lunar:0}; let drawn=0;
      celestialRail.replaceChildren();
      for(const family of ['solar','lunar']){
        const lane=el('div',null,'date-nav-celestial-lane');lane.dataset.celestialFamily=family;let previousPosition=-Infinity;
        const familyRows=visible.filter(item=>(item.celestialKind.includes('equinox')||item.celestialKind.includes('solstice')?'solar':'lunar')===family);
        for(const item of familyRows){
          const position=end>start?(Date.parse(item.date)-start)/(end-start):.5;
          const pixelPosition=Math.max(22,Math.min(width-22,position*width));
          if(pixelPosition-previousPosition<56||countByFamily[family]>=capacity||drawn>=MAX_SEGMENTS)continue;
          const entry=markerButton(item,'date-nav-celestial-mark');entry.style.setProperty('--dn-position',`${position*100}%`);lane.append(entry);previousPosition=pixelPosition;countByFamily[family]++;drawn++;
        }
        lane.hidden=!lane.children.length;celestialRail.append(lane);
      }
      celestialRail.hidden=!drawn;celestialRail.dataset.density=drawn<visible.length?'dense':'full';
      celestialNote.textContent=`${markers.length} exact solved events; ${visible.length} within this study window. ${drawn<visible.length?`The rail shows ${drawn} spaced markers; all events remain in the paged list. `:''}This event rail is separate from the indexed study-day slider. Opening a card does not change the selected date.`;
      const kinds=[...new Set(markers.map(item=>item.celestialKind))];celestialLegend.replaceChildren(...kinds.map(kind=>{const li=el('li');li.dataset.celestialKind=kind;li.append(celestialGlyph(kind),doc.createTextNode(CELESTIAL_KINDS[kind]));return li;}));
      if(celestialList.open)renderCelestialList();
    }
    renderSeasonBookmarks();celestialPrevious.disabled=!!config.disabled||eventPage===0;celestialNext.disabled=!!config.disabled||eventPage>=Math.ceil(markers.length/PAGE_SIZE)-1;
    refreshCelestialSaved();
    if(open&&externalAnchor&&!externalAnchor.isConnected)closeDetails();
  }
  function clearClose() { if (closeTimer) win.clearTimeout(closeTimer); closeTimer = null; }
  function detachAnchor() {
    if (!externalAnchor) return;
    externalAnchor.removeEventListener('pointerleave', scheduleClose); externalAnchor.removeEventListener('pointerenter', clearClose); externalAnchor.removeEventListener('focusout', scheduleClose); externalAnchor.removeEventListener('keydown', onAnchorKeydown);
    for (const [name, value] of Object.entries(anchorAttributes || {})) { if (value === null) externalAnchor.removeAttribute(name); else externalAnchor.setAttribute(name, value); }
    externalAnchor = null; anchorAttributes = null;
  }
  function resetPlacement() {
    detachAnchor(); if (popover.parentElement !== selectedWrap) selectedWrap.append(popover); if (portal) portal.hidden = true;
    popover.style.maxHeight = ''; placedAnchorRect = null;
  }
  function closeDetails(restoreFocus = false) {
    const focusTarget = externalAnchor || selectedButton;
    clearClose(); open = false; pinned = false; preview = null; popover.hidden = true; selectedButton.setAttribute('aria-expanded', 'false'); root.classList.remove('date-nav-open');
    resetPlacement(); if (activeClose === closeDetails) { activeClose = null; activePreviewLocked = null; }
    if (restoreFocus && focusTarget.isConnected && !focusTarget.disabled) {
      restoringFocus = true; focusTarget.focus({ preventScroll: true }); restoringFocus = false;
    }
  }
  function scheduleClose() {
    clearClose(); closeTimer = win.setTimeout(() => {
      const trigger = externalAnchor || selectedButton;
      if (pinned || popover.matches(':hover') || trigger.matches(':hover') || popover.contains(doc.activeElement) || trigger.contains(doc.activeElement)) return;
      closeDetails();
    }, 220);
  }
  function onAnchorKeydown(event) {
    if (event.key === 'Tab' && !event.shiftKey && open) {
      event.preventDefault(); pinned = true; close.focus({ preventScroll: true });
    }
  }
  function onPopoverKeydown(event) {
    if (event.key !== 'Tab') return;
    if ((event.shiftKey && doc.activeElement === close) || (!event.shiftKey && doc.activeElement === bookmark)) {
      event.preventDefault(); closeDetails(true);
    }
  }
  function placeExternal(event) {
    if (!open || !externalAnchor || !portal) return;
    // Inner scrolling must not resize the same card and reset its scroll position.
    if (event?.type === 'scroll' && popover.contains(event.target)) return;
    if (!externalAnchor.isConnected) { closeDetails(); return; }
    const rect = externalAnchor.getBoundingClientRect();
    // A passive hover preview belongs to the position where it was opened. Do
    // not let scrolling its trigger away clamp a tall card over unrelated controls.
    // Explicitly pinned cards and keyboard interaction retain their current card.
    // A queued scroll from before pointerenter must not dismiss a new preview.
    if (event?.type === 'scroll' && placedAnchorRect && (rect.top !== placedAnchorRect.top || rect.left !== placedAnchorRect.left) && !pinned && !popover.contains(doc.activeElement) && !externalAnchor.contains(doc.activeElement)) {
      closeDetails(); return;
    }
    placedAnchorRect = rect;
    const previousScroll = popover.scrollTop;
    const availableWidth = Math.max(0, win.innerWidth - 24), availableHeight = Math.max(80, win.innerHeight - 24);
    portal.style.minWidth = popover.style.minWidth = '0'; popover.style.maxWidth = '100%';
    portal.style.width = `${Math.min(520, availableWidth)}px`;
    // Bounding rectangles use rendered viewport pixels, while fixed-position
    // lengths inherit CSS zoom. Measure that scale rather than mixing units.
    const scale = portal.offsetWidth ? portal.getBoundingClientRect().width / portal.offsetWidth : 1;
    const zoom = Number.isFinite(scale) && scale > 0 ? scale : 1;
    portal.style.width = `${Math.min(520, availableWidth / zoom)}px`;
    popover.style.maxHeight = `${availableHeight / zoom}px`;
    const naturalHeight = popover.getBoundingClientRect().height;
    const roomBelow = Math.max(0, win.innerHeight - 12 - Math.max(12, rect.bottom + 8));
    const roomAbove = Math.max(0, Math.min(win.innerHeight - 12, rect.top - 8) - 12);
    const below = roomBelow >= naturalHeight || (roomAbove < naturalHeight && roomBelow >= roomAbove);
    // A long hover card must scroll on one side of its trigger, not cover the trigger
    // while the pointer is trying to click it. Large chart anchors can fill the viewport.
    popover.style.maxHeight = `${Math.min(availableHeight, Math.max(48, below ? roomBelow : roomAbove)) / zoom}px`;
    const height = popover.getBoundingClientRect().height;
    const width = popover.getBoundingClientRect().width;
    const left = Math.max(12, Math.min(rect.left, win.innerWidth - width - 12));
    const top = Math.max(12, Math.min(below ? rect.bottom + 8 : rect.top - height - 8, win.innerHeight - height - 12));
    portal.style.left = `${left / zoom}px`; portal.style.top = `${top / zoom}px`;
    // Correct any containing-block offset without changing the anchored source.
    const placed = popover.getBoundingClientRect();
    portal.style.left = `${(left + left - placed.left) / zoom}px`;
    portal.style.top = `${(top + top - placed.top) / zoom}px`;
    popover.scrollTop = previousScroll;
  }
  function attachAnchor(anchor) {
    if (externalAnchor === anchor) return;
    detachAnchor(); externalAnchor = anchor;
    anchorAttributes = Object.fromEntries(['aria-controls', 'aria-expanded', 'aria-haspopup'].map(name => [name, anchor.getAttribute(name)]));
    anchor.setAttribute('aria-controls', popover.id); anchor.setAttribute('aria-expanded', 'true'); anchor.setAttribute('aria-haspopup', 'dialog');
    anchor.addEventListener('pointerleave', scheduleClose); anchor.addEventListener('pointerenter', clearClose); anchor.addEventListener('focusout', scheduleClose); anchor.addEventListener('keydown', onAnchorKeydown);
    if (!portal) { portal = el('div', null, 'date-nav date-nav-portal'); portal.dataset.datePreviewPortal = root.dataset.dateNavigator; doc.body.append(portal); }
    portal.hidden = false; portal.append(popover);
  }
  function renderDetails(item) {
    if (!item) return;
    popoverTitle.textContent = item.label; detailDate.textContent = item.date; badge.textContent = badgeText(item); mark(badge, item);
    summary.textContent = item.summary; summary.hidden = !item.summary;
    const phase=itemCelestial(item,true),contextFacts=[...(item.calendarLabel||phase?.calendarLabel?[{label:'Calendar',value:item.calendarLabel||phase.calendarLabel}]:[]),...(item.timeZone||phase?.timeZone?[{label:'Study time zone',value:item.timeZone||phase.timeZone}]:[]),...(phase?[{label:'Supplied Moon phase',value:phaseText(phase)},{label:'Phase source',value:phase.sourceLabel}]:[])];
    details.replaceChildren(...[...contextFacts,...item.details].flatMap(detail => [el('dt', detail.label), el('dd', detail.value)])); details.hidden = !details.children.length;
    source.replaceChildren(); source.hidden = !item.sourceLabel && !item.sourceUrl;
    if (item.sourceLabel) source.append(doc.createTextNode(item.sourceLabel));
    const href = sourceURL(item.sourceUrl, doc.baseURI);
    if (href) { const link = el('a', 'Open source ↗'); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; source.append(link); }
    const bookmarked = isSaved(item); bookmark.textContent = bookmarked ? 'Remove bookmark' : bookmarkState.corrupt ? 'Start new list with this date' : 'Bookmark date'; bookmark.setAttribute('aria-pressed', String(bookmarked));
    bookmark.disabled = !!config.disabled || !token(item.id);
    markerSelect.hidden=!item.celestialKind||typeof config.onMarkerSelect!=='function';markerSelect.disabled=!!config.disabled;
    markerSelect.textContent=item.actionLabel||text(config.markerActionLabel,160)||'Use exact instant';
    markerActionNote.textContent=item.actionNote||text(config.markerActionNote,1000)||'The event time is the exact supplied UTC instant. The indexed study-day slider is independent.';markerActionNote.hidden=!item.celestialKind;
    privacy.textContent = token(item.id) ? bookmarkState.corrupt ? bookmarkState.note : 'Bookmarks save only an entry reference and date on this device.' : 'This entry has no supported bookmark reference.';
  }
  function showDetails(item = items[selected], pin = false, anchor = null) {
    if (!item || config.disabled || destroyed || restoringFocus) return false;
    item=items.find(current=>current.id===item.id)||markers.find(current=>current.id===item.id);if(!item)return false;
    // Pointer movement caused by scrolling or moving toward Bookmark must not change
    // an actively used card's source/date or the anchor restored by Escape.
    if (!pin && activePreviewLocked?.()) return false;
    if (activeClose && activeClose !== closeDetails) activeClose(); activeClose = closeDetails;
    activePreviewLocked = () => open && (pinned || popover.contains(doc.activeElement) || externalAnchor?.contains(doc.activeElement));
    attachAnchor(anchor || selectedButton);
    clearClose(); preview = item; pinned = pinned || pin; open = true; renderDetails(item); popover.hidden = false; selectedButton.setAttribute('aria-expanded', String(!anchor)); root.classList.add('date-nav-open');
    placeExternal();
    if (pin) close.focus({ preventScroll: true });
    return true;
  }
  function renderSelection() {
    const item = items[selected]; if (!item) return;
    renderSeasonBookmarks();
    slider.value = String(selected); slider.setAttribute('aria-valuetext', `${item.date}. ${item.label}. ${DATE_KINDS[item.kind].label}. Entry ${selected + 1} of ${items.length}.`);
    selectedButton.replaceChildren(el('span', badgeText(item), 'date-nav-selected-kind'), el('strong', item.date || item.label, 'date-nav-selected-date'), el('span', `${item.date ? item.label : ''}${isSaved(item) ? ' · Bookmarked' : ''}`, 'date-nav-selected-label'), el('span', 'Details + bookmark', 'date-nav-selected-action'));
    const phase=itemCelestial(item,true),ratio=items.length>1?selected/(items.length-1):.5;
    for(const node of [sliderWrap,sliderStage]){node.style.setProperty('--dn-progress',`${ratio*100}%`);node.style.setProperty('--dn-progress-ratio',String(ratio));}
    phaseThumb.replaceChildren();phaseThumb.hidden=!phase;
    if(phase){const phaseLabel=el('span',null,'date-nav-selected-celestial');phaseLabel.append(celestialGlyph(null,phase.phase),el('span',phaseText(phase)));selectedButton.append(phaseLabel);phaseThumb.append(celestialGlyph(null,phase.phase));}
    selectedButton.dataset.saved=String(isSaved(item));selectedButton.append(bookmarkStar(isSaved(item)));
    selectedButton.setAttribute('aria-label', `${item.date}. ${item.label}. ${DATE_KINDS[item.kind].label}${phase?`. ${phaseText(phase)}`:''}${isSaved(item) ? '. Bookmarked' : ''}. Details and bookmark.`);
    slider.setAttribute('aria-valuetext',`${item.date}. ${item.label}. ${DATE_KINDS[item.kind].label}.${phase?` ${phaseText(phase)}.`:''} Entry ${selected+1} of ${items.length}.`);
    mark(selectedButton, item); previous.disabled = !!config.disabled || selected === 0; next.disabled = !!config.disabled || selected === items.length - 1; selectedButton.disabled = !!config.disabled;
    if (open && !preview) { renderDetails(item); placeExternal(); }
  }
  function renderOverview() {
    overview.replaceChildren(); const segmentCount = Math.min(MAX_SEGMENTS, items.length);
    const phaseStep=Math.max(1,Math.ceil(segmentCount/Math.max(1,Math.floor((root.clientWidth||win.innerWidth-32)/36))));
    for (let index = 0; index < segmentCount; index++) {
      const begin = Math.floor(index * items.length / segmentCount), end = Math.floor((index + 1) * items.length / segmentCount);
      const segment = el('span', null, 'date-nav-segment');
      const kinds = [...new Set(items.slice(begin, end).map(item => item.kind))];
      // Mixed is a source rule category, never a synthetic label for an overview bin.
      for (const kind of kinds) { const stripe = el('i'); stripe.dataset.kind = kind; segment.append(stripe); }
      const suppliedPhase=index%phaseStep===0?items.slice(begin,end).find(item=>itemCelestial(item)):null;
      if(suppliedPhase){const glyph=celestialGlyph(null,suppliedPhase.celestial.phase);glyph.classList.add('date-nav-phase-tick');segment.append(glyph);}
      overview.append(segment);
    }
    explanation.textContent = items.length > MAX_SEGMENTS
      ? `The overview groups ${items.length.toLocaleString()} entries into ${MAX_SEGMENTS} segments; each segment shows the types present. The slider and date list include every entry in the supplied order. Spacing follows entries, not elapsed time.`
      : 'Each overview segment marks one entry. The slider and date list follow the supplied order; spacing does not represent elapsed time.';
    const kinds = [...new Set(items.map(item => item.kind))]; legend.replaceChildren(...kinds.map(kind => { const li = el('li', `${DATE_KINDS[kind].icon} ${DATE_KINDS[kind].label}`); li.dataset.kind = kind; return li; }));
  }
  function renderList() {
    const matches = items.map((item, index) => ({ item, index })).filter(({ item }) => (!savedOnly || isSaved(item)) && (!filter || `${item.date} ${item.label} ${DATE_KINDS[item.kind].label}`.toLocaleLowerCase().includes(filter)));
    const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE)); listPage = Math.max(0, Math.min(listPage, pages - 1));
    const begin = listPage * PAGE_SIZE; list.start = begin + 1;
    list.replaceChildren(...matches.slice(begin, begin + PAGE_SIZE).map(({ item, index }) => {
      const li = el('li'); const entry = button('', 'date-nav-list-item'); entry.dataset.index = String(index); mark(entry, item); entry.disabled = !!config.disabled; entry.setAttribute('aria-current', String(index === selected));
      entry.append(el('strong', item.date || 'Date not specified'), el('span', item.label), el('small', `${badgeText(item)}${isSaved(item) ? ' · Bookmarked' : ''}`));
      entry.addEventListener('click', () => { select(index, true); selectedButton.focus(); showDetails(items[selected], true); });
      li.append(entry); return li;
    }));
    listMessage.textContent = matches.length ? `${matches.length.toLocaleString()} matching ${matches.length === 1 ? 'entry' : 'entries'}.` : savedOnly ? 'No bookmarked dates match this view.' : 'No dates match this search.';
    listCount.textContent = matches.length ? `${begin + 1}–${Math.min(begin + PAGE_SIZE, matches.length)} of ${matches.length.toLocaleString()}` : '0 entries';
    listPrevious.disabled = !!config.disabled || listPage === 0; listNext.disabled = !!config.disabled || listPage >= pages - 1;
    moreSummary.textContent = `Date list, key & bookmarks · ${items.length.toLocaleString()} entries`;
  }
  function select(index, activate = false) {
    if (config.disabled || destroyed || !items.length) return;
    const nextIndex = resolve(index, selected); if (nextIndex === selected && !activate) return;
    selected = nextIndex; preview = null; renderSelection(); if (more.open) renderList();
    if (typeof config.onSelect === 'function') config.onSelect(items[selected], selected);
  }
  function refreshList() {
    moreSummary.textContent = `Date list, key & bookmarks · ${items.length.toLocaleString()} entries`;
    if (more.open) renderList();
    renderManager();
    renderCelestial();
  }
  function saveBookmarks(entries, message) {
    memoryBookmarks = entries;
    try { win.localStorage.setItem(DATE_BOOKMARK_KEY, JSON.stringify({ version: 1, entries })); storageUnavailable = false; }
    catch { storageUnavailable = true; }
    bookmarkState = { entries, note: '' };
    status.textContent = `${message}${storageUnavailable ? ' Saved for this tab only; browser storage is unavailable.' : ' Stored on this device.'}`;
    win.dispatchEvent(new win.Event(BOOKMARK_EVENT));
  }
  function renderManager() {
    managerSummary.textContent = `Manage saved dates · ${bookmarkState.entries.length}`;
    if (!manager.open) return;
    const pages = Math.max(1, Math.ceil(bookmarkState.entries.length / PAGE_SIZE)); managePage = Math.max(0, Math.min(managePage, pages - 1));
    const begin = managePage * PAGE_SIZE;
    managerList.replaceChildren(...bookmarkState.entries.slice(begin, begin + PAGE_SIZE).map(entry => {
      const li = el('li'), reference = el('span', null, 'date-nav-saved-reference');
      reference.append(el('strong', entry.date || 'Source reference'), el('span', `${entry.scope} · ${entry.id}`));
      const remove = button('Remove', 'date-nav-remove-bookmark', `Remove bookmark ${entry.date || entry.id} from ${entry.scope}`); remove.disabled = !!config.disabled;
      remove.addEventListener('click', () => {
        if (config.disabled) return;
        bookmarkState = loadBookmarks(win);
        saveBookmarks(bookmarkState.entries.filter(savedEntry => !(savedEntry.scope === entry.scope && savedEntry.id === entry.id)), 'Bookmark removed.');
        managerSummary.focus({ preventScroll: true });
      });
      li.append(reference, remove); return li;
    }));
    managerNote.textContent = bookmarkState.corrupt ? bookmarkState.note : bookmarkState.entries.length ? 'Saved public references from all views. Removing a bookmark does not change a chart or date selection.' : 'No saved date references on this device.';
    managerCount.textContent = bookmarkState.entries.length ? `${begin + 1}–${Math.min(begin + PAGE_SIZE, bookmarkState.entries.length)} of ${bookmarkState.entries.length}` : '0 saved';
    managerPrevious.disabled = !!config.disabled || managePage === 0; managerNext.disabled = !!config.disabled || managePage === pages - 1;
  }
  function renderAll(rebuildData = true) {
    root.classList.toggle('date-nav-compact', !!config.compact); root.classList.toggle('date-nav-disabled', !!config.disabled); root.setAttribute('aria-disabled', String(!!config.disabled));
    heading.textContent = text(config.label, 240) || 'Explore dates'; sliderLabel.textContent = `${heading.textContent}: selected date entry`;
    count.textContent = config.disabled ? 'Held · update the parent view' : `${items.length.toLocaleString()} ${items.length === 1 ? 'entry' : 'entries'}${markers.length?` · ${markers.length} celestial events`:''}`;
    empty.textContent = text(config.emptyMessage, 600) || 'No dates are available in this view.'; empty.hidden = !!items.length||!!markers.length;
    // Saved references remain manageable even when this view has no dated entries.
    controls.hidden = selectedWrap.hidden = !items.length;
    slider.max = String(Math.max(0, items.length - 1)); slider.disabled = !!config.disabled || items.length < 2;
    search.disabled = saved.disabled = !!config.disabled;
    startDate.textContent = items[0]?.date || ''; endDate.textContent = items.at(-1)?.date || '';
    renderSelection(); if (rebuildData) renderOverview(); refreshList(); if (config.disabled || (!items.length&&!markers.length)) closeDetails();
  }
  function onBookmarksChanged() { if (destroyed) return; bookmarkState = loadBookmarks(win); renderSelection(); refreshList(); if (open) { renderDetails(preview || items[selected]); placeExternal(); } }
  function onStorage(event) { if (event.key === DATE_BOOKMARK_KEY || event.key === null) onBookmarksChanged(); }
  function onResize(event) { placeExternal(event); if(!destroyed)renderCelestial(); }
  function onOutside(event) {
    if (pendingFocus && !root.contains(event.target)) pendingFocus = null;
    if (open && !selectedWrap.contains(event.target) && !popover.contains(event.target) && !externalAnchor?.contains(event.target) && !list.contains(event.target)) closeDetails();
  }
  function onFocusChange(event) {
    if (pendingFocus && event.target !== doc.body && event.target !== pendingFocus) pendingFocus = null;
    if (open && !pinned && !popover.contains(event.target) && !externalAnchor?.contains(event.target)) closeDetails();
  }
  function onEscape(event) {
    if (event.key !== 'Escape' || !open) return;
    event.preventDefault(); event.stopPropagation(); closeDetails(true);
  }
  slider.addEventListener('input', () => select(Number(slider.value)));
  slider.addEventListener('change', () => select(Number(slider.value)));
  previous.addEventListener('click', () => select(selected - 1)); next.addEventListener('click', () => select(selected + 1));
  selectedButton.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showDetails(); });
  selectedButton.addEventListener('pointerleave', scheduleClose);
  selectedButton.addEventListener('focus', () => { if (!restoringFocus) showDetails(); });
  selectedButton.addEventListener('click', () => showDetails(items[selected], true));
  selectedWrap.addEventListener('focusout', scheduleClose); popover.addEventListener('pointerenter', clearClose); popover.addEventListener('pointerleave', scheduleClose); popover.addEventListener('focusout', scheduleClose); popover.addEventListener('keydown', onPopoverKeydown);
  close.addEventListener('click', () => closeDetails(true)); root.addEventListener('keydown', onEscape);
  bookmark.addEventListener('click', () => {
    const item = preview || items[selected]; if (config.disabled || destroyed || !item || !token(item.id)) return;
    bookmarkState = loadBookmarks(win); const exists = isSaved(item);
    if (!exists && bookmarkState.entries.length >= MAX_BOOKMARKS) { status.textContent = `The ${MAX_BOOKMARKS}-bookmark limit is reached. Remove a saved date before adding another.`; return; }
    const entries = bookmarkState.entries.filter(entry => !(entry.scope === scope() && entry.id === item.id));
    if (!exists) entries.push({ scope: scope(), id: item.id, date: publicDay(item.date), kind: item.kind });
    saveBookmarks(entries, exists ? 'Bookmark removed.' : 'Date bookmarked.');
  });
  markerSelect.addEventListener('click',()=>{if(config.disabled||destroyed||!preview?.celestialKind||typeof config.onMarkerSelect!=='function')return;const item=preview;closeDetails();config.onMarkerSelect(item);});
  celestialList.addEventListener('toggle',()=>{if(celestialList.open&&!destroyed)renderCelestialList();});
  celestialPrevious.addEventListener('click',()=>{if(config.disabled||destroyed)return;eventPage--;renderCelestialList();});celestialNext.addEventListener('click',()=>{if(config.disabled||destroyed)return;eventPage++;renderCelestialList();});
  search.addEventListener('input', () => { filter = search.value.trim().toLocaleLowerCase(); listPage = 0; renderList(); });
  saved.addEventListener('change', () => { savedOnly = saved.checked; listPage = 0; renderList(); });
  listPrevious.addEventListener('click', () => { listPage--; renderList(); }); listNext.addEventListener('click', () => { listPage++; renderList(); });
  managerPrevious.addEventListener('click', () => { managePage--; renderManager(); }); managerNext.addEventListener('click', () => { managePage++; renderManager(); });
  manager.addEventListener('toggle', renderManager);
  more.addEventListener('toggle', () => { if (more.open) renderList(); });
  doc.addEventListener('pointerdown', onOutside); doc.addEventListener('focusin', onFocusChange); doc.addEventListener('keydown', onEscape); win.addEventListener('resize', onResize); win.addEventListener('scroll', placeExternal, true); win.addEventListener('storage', onStorage); win.addEventListener(BOOKMARK_EVENT, onBookmarksChanged);
  renderAll();
  return {
    getState:()=>({selectedId:items[selected]?.id||null,selectedIndex:selected,selected:items[selected]||null,celestial:itemCelestial(items[selected],true),markers:[...markers],disabled:!!config.disabled}),
    /** Preview a listed item at an existing chart/date mark, without selecting or calculating. */
    preview(value, { anchor = null, pin = false } = {}) {
      if (restoringFocus || config.disabled || destroyed) return false;
      const index = Number.isInteger(value) ? value : items.findIndex(item => item.id === value || item.date === value);
      const item=index>=0&&index<items.length?items[index]:markers.find(item=>item.id===value||item.date===value);if(!item)return false;
      const target = anchor?.ownerDocument === doc && typeof anchor.getBoundingClientRect === 'function' ? anchor : null;
      return showDetails(item, !!pin, target);
    },
    dismiss: scheduleClose,
    closePreview: scheduleClose,
    update(patch = {}) {
      if (destroyed) return;
      const old = items[selected], previousPreview = preview?.id;
      // Validate before changing the mounted state, so failed updates leave it usable.
      const nextItems = Object.hasOwn(patch, 'items') ? normalizeDateItems(patch.items || []) : items;
      const nextMarkers=Object.hasOwn(patch,'markers')?normalizeDateMarkers(patch.markers||[]):markers;validateDataset(nextItems,nextMarkers);
      const nextCelestial=Object.hasOwn(patch,'celestial')?normalizeCelestial(patch.celestial):celestial;
      const nextMarkerRange=Object.hasOwn(patch,'markerRange')?normalizeMarkerRange(patch.markerRange):markerRange;
      if (Object.hasOwn(patch, 'bookmarkScope')) validateScope(patch.bookmarkScope);
      const hadDisabled = !!config.disabled;
      if (!hadDisabled && patch.disabled && root.contains(doc.activeElement)) pendingFocus = doc.activeElement;
      if(nextItems!==items||nextMarkers!==markers||nextMarkerRange!==markerRange)celestialVersion++;
      config = { ...config, ...patch }; items = nextItems;markers=nextMarkers;celestial=nextCelestial;markerRange=nextMarkerRange;
      selected = Object.hasOwn(patch, 'value') ? resolve(patch.value, selected) : resolve(old?.id, resolve(old?.date, selected));
      preview = previousPreview && ((externalAnchor && externalAnchor !== selectedButton) || previousPreview !== old?.id) ? [...items,...markers].find(item => item.id === previousPreview) || null : null;
      renderAll(Object.hasOwn(patch, 'items'));
      if (open && externalAnchor && !externalAnchor.isConnected) closeDetails();
      if (open) { renderDetails(preview || items[selected]); placeExternal(); }
      if (hadDisabled && !config.disabled && pendingFocus) {
        const target = pendingFocus; pendingFocus = null;
        if (target.isConnected && !target.disabled && (doc.activeElement === doc.body || doc.activeElement === target)) {
          restoringFocus = true; target.focus({ preventScroll: true }); restoringFocus = false;
        }
      }
    },
    destroy() {
      if (destroyed) return; closeDetails(); destroyed = true; clearClose();
      doc.removeEventListener('pointerdown', onOutside); doc.removeEventListener('focusin', onFocusChange); doc.removeEventListener('keydown', onEscape); win.removeEventListener('resize', onResize); win.removeEventListener('scroll', placeExternal, true); win.removeEventListener('storage', onStorage); win.removeEventListener(BOOKMARK_EVENT, onBookmarksChanged); portal?.remove(); root.remove();
    },
  };
}
