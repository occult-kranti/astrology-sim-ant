// A bounded evidence index and a separately assumed, canonically calculated day.
// This module creates no affiliation, causal chain, prophetic clock or outcome score.
import { ESCHATOLOGY_PIKE_ENTITIES, ESCHATOLOGY_PIKE_CLAIMS, ESCHATOLOGY_PIKE_EDGES, ESCHATOLOGY_PIKE_SOURCES, ESCHATOLOGY_PIKE_LIMITS } from './data/eschatology-pike-evidence.js';
import { ESCHATOLOGY_TRADITION_ENTITIES, ESCHATOLOGY_TRADITION_CLAIMS, ESCHATOLOGY_TRADITION_EDGES, ESCHATOLOGY_TRADITION_SOURCES, ESCHATOLOGY_TRADITION_LIMITS } from './data/eschatology-tradition-evidence.js';
import { buildNewtonChronology, buildNewtonExplorationFrame } from './newton-chronology.js';
import { buildSkyInterpretation } from './sky-interpretation.js';
import { normalizeCalendarTimelineRequest } from './calendar-timeline.js';
import { civilFields } from './time.js';
import { julianToJDN, jdnToJulian, jdnToGregorian, isoDate } from './calendar.js';

export const ESCHATOLOGY_ATLAS_VERSION = 1;
export const ESCHATOLOGY_DATE_ROLES = Object.freeze(['claimedDocument', 'statement', 'publication', 'transmission', 'target', 'historicalContext']);
export const ESCHATOLOGY_FRAME_SELECTIONS = Object.freeze(['source-date', 'study-date']);
export const ESCHATOLOGY_GRAPH_EDGE_TYPES = Object.freeze(['citation', 'attribution', 'disputed-attribution', 'comparison', 'influence', 'subject']);
export const ESCHATOLOGY_ATLAS_LIMITS = Object.freeze({ maximumClaims: 120, maximumEntities: 160, maximumSources: 200, maximumCuratedEdges: 300, maximumGraphNodes: 480, maximumGraphEdges: 1200, minimumStudyYear: 1900, maximumStudyYear: 2100 });
const ENTITIES = [...ESCHATOLOGY_PIKE_ENTITIES, ...ESCHATOLOGY_TRADITION_ENTITIES];
const CLAIMS = [...ESCHATOLOGY_PIKE_CLAIMS, ...ESCHATOLOGY_TRADITION_CLAIMS];
const EDGES = [...ESCHATOLOGY_PIKE_EDGES, ...ESCHATOLOGY_TRADITION_EDGES];
const NEWTON = buildNewtonChronology();
const METHOD_SOURCE = { id: 'EA-METHODS', title: 'Eschatology evidence atlas: date roles, graph relations and calculation limits', url: 'docs/2026-10-eschatology-atlas-methods.md', source: 'Project-authored eschatology evidence-atlas method, October 2026; source claims, catalogue relations and explicit modern calendar samples are distinct.', claimType: 'project-method', readingStatus: 'Implementation and declared inference limits; not a historical primary source.' };
const LIMITATIONS = [
  'A source assertion, its date of publication or transmission, an alleged document date and a claimed future target are different records. Repetition does not establish an original document or independent corroboration.',
  'Graph edges retain their stated type and evidence. Catalogue subject and citation links are indexing relations, not proof of affiliation, common worship, political coordination or causation.',
  'Year-only, year-range and unknown dates remain partial. Historical BCE labels have no year zero and are never passed to the astronomical engine as instants.',
  'A documented exact civil date can be explored only with an explicitly assumed clock, observer and IANA zone. Geometry does not authenticate a document or establish the historical event time.',
  'Thirteen civil calendars label one supplied instant. They do not each supply an eschatological or astrological reading. Only three named, inherited Lilly, Agrippa and Jyotiṣa reading lenses are implemented here.',
  'Newton’s 2060 conditional year bound belongs to its own source argument. No exact prophetic day, proximity score, probability, calendar consensus or future outcome is inferred.',
  'Calculated astronomy, civil convention, traditional interpretation and source assessment have different evidential roles. Shared Sun/Moon inputs are not independent confirmations; astrology has no demonstrated predictive validity.',
];
const copy = value => JSON.parse(JSON.stringify(value));
const unique = values => [...new Set(values)];
function mergedSources(...lists) {
  const sources = new Map();
  for (const source of lists.flat()) {
    const earlier = sources.get(source.id);
    if (earlier && (earlier.title !== source.title || earlier.url !== source.url)) throw new Error('Conflicting source identity: ' + source.id);
    if (!earlier) sources.set(source.id, source);
  }
  return copy([...sources.values()]);
}
const SOURCES = mergedSources(ESCHATOLOGY_PIKE_SOURCES, ESCHATOLOGY_TRADITION_SOURCES, NEWTON.sources, [METHOD_SOURCE]);
const BY_CLAIM = new Map(CLAIMS.map(c => [c.id, c]));
export const ESCHATOLOGY_ATLAS_FILTERS = Object.freeze({
  familyIds: Object.freeze(unique(CLAIMS.map(c => c.familyId)).sort()),
  claimKinds: Object.freeze(unique(CLAIMS.map(c => c.kind)).sort()),
  dateRoles: ESCHATOLOGY_DATE_ROLES,
});

function fields(raw, allowed, label) {
  if (!raw || typeof raw !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(raw))) throw new TypeError(label + ' must be a plain JSON object.');
  if (Reflect.ownKeys(raw).some(key => !allowed.includes(key))) throw new RangeError('Unknown ' + label + ' field.');
  const result = Object.create(null);
  for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(raw))) {
    if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new TypeError(label + ' fields must be ordinary enumerable data properties.');
    result[key] = descriptor.value;
  }
  return result;
}
function choice(value, allowed, label) { if (typeof value !== 'string' || !allowed.includes(value)) throw new RangeError('Choose a supported ' + label + '.'); return value; }
function sourceIdsIn(value, result = new Set()) {
  if (!value || typeof value !== 'object') return result;
  if (Array.isArray(value.sourceIds)) value.sourceIds.forEach(id => result.add(id));
  for (const [key, child] of Object.entries(value)) if (key !== 'sources') sourceIdsIn(child, result);
  return result;
}
function sourcesFor(value, sources = SOURCES) {
  const ids = sourceIdsIn(value), byId = new Map(sources.map(s => [s.id, s]));
  for (const id of ids) if (!byId.has(id)) throw new Error('Unresolved atlas source: ' + id);
  return copy([...ids].map(id => byId.get(id)));
}
function historicalYear(value) { return Number.isInteger(value) && value !== 0 && value >= -9999 && value <= 9999; }
function parsedCivilDay(value, calendar) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('A civil day needs an explicit positive-CE YYYY-MM-DD value.');
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1) throw new RangeError('Source dates do not use a year zero.');
  if (calendar === 'gregorian') { civilFields(value); return value; }
  if (calendar !== 'julian') throw new RangeError('An exact source day needs a named implemented civil calendar.');
  const jdn = julianToJDN(year, month, day), native = jdnToJulian(jdn);
  if (native.y !== year || native.m !== month || native.d !== day) throw new RangeError('The supplied Julian source date does not exist.');
  const gregorian = jdnToGregorian(jdn);
  return isoDate(gregorian.y, gregorian.m, gregorian.d);
}
function validateDate(date, label) {
  if (!date || typeof date !== 'object' || !['day', 'year', 'year-range', 'unknown'].includes(date.precision)) throw new Error('Invalid source date precision: ' + label);
  if (!['documented', 'claimed', 'conditional', 'disputed', 'unknown'].includes(date.status) || date.clock !== null) throw new Error('Invalid date status or invented clock: ' + label);
  if (![null, 'gregorian', 'julian'].includes(date.calendar)) throw new Error('Invalid source calendar: ' + label);
  if (date.precision === 'unknown') {
    if (date.value !== null || date.startYear !== null || date.endYear !== null) throw new Error('Unknown dates need null values: ' + label);
  } else if (date.precision === 'day') {
    if (date.calendar !== null) parsedCivilDay(date.value, date.calendar);
    else if (typeof date.value !== 'string' || !/^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/.test(date.value) || Number(date.value.slice(0, 4)) === 0) throw new Error('Invalid calendar-unspecified source day: ' + label);
    if (date.startYear !== null || date.endYear !== null) throw new Error('An exact day cannot also be an invented year interval: ' + label);
  } else if (date.precision === 'year') {
    if (typeof date.value !== 'string' || !/^-?\d{1,4}$/.test(date.value) || !historicalYear(Number(date.value)) || date.startYear !== null || date.endYear !== null) throw new Error('Invalid source year: ' + label);
  } else if (!historicalYear(date.startYear) || !historicalYear(date.endYear) || date.startYear > date.endYear || date.value !== null) throw new Error('Invalid source year range: ' + label);
  if ((Number(date.value) < 0 || date.startYear < 0 || date.endYear < 0) && date.yearNumbering !== 'historical-no-year-zero') throw new Error('BCE labels require explicit historical year numbering: ' + label);
}
function validateCatalogue() {
  for (const [rows, limit, label] of [[CLAIMS, 120, 'claims'], [ENTITIES, 160, 'entities'], [SOURCES, 200, 'sources'], [EDGES, 300, 'edges']]) {
    if (rows.length > limit || new Set(rows.map(r => r.id)).size !== rows.length) throw new Error('Catalogue bound or unique-ID failure: ' + label);
  }
  const entities = new Set(ENTITIES.map(e => e.id)), sourceIds = new Set(SOURCES.map(s => s.id));
  for (const c of CLAIMS) {
    if (!c.id || !c.familyId || !c.kind || !c.title || !c.text || !Array.isArray(c.subjectIds) || c.subjectIds.some(id => !entities.has(id))) throw new Error('Invalid claim identity or subject: ' + c.id);
    if (!['supported', 'partially-supported', 'contradicted', 'unresolved', 'not-investigated'].includes(c.assessment)) throw new Error('Invalid claim assessment: ' + c.id);
    if (!c.dates || Object.keys(c.dates).some(role => !ESCHATOLOGY_DATE_ROLES.includes(role))) throw new Error('Unknown claim date role: ' + c.id);
    for (const role of ESCHATOLOGY_DATE_ROLES) validateDate(c.dates[role], c.id + ':' + role);
  }
  for (const edge of EDGES) {
    if (!entities.has(edge.fromId) || !entities.has(edge.toId) || !ESCHATOLOGY_GRAPH_EDGE_TYPES.includes(edge.type) || edge.type === 'subject' || !Array.isArray(edge.claimIds) || !edge.claimIds.length || edge.claimIds.some(id => !BY_CLAIM.has(id)) || typeof edge.asserted !== 'boolean') throw new Error('Invalid curated edge: ' + edge.id);
  }
  for (const id of sourceIdsIn([ENTITIES, CLAIMS, EDGES])) if (!sourceIds.has(id)) throw new Error('Unresolved catalogue source: ' + id);
}
validateCatalogue();

function dateEligibility(date) {
  if (date.precision !== 'day') return { eligible: false, gregorianDate: null, reason: 'This source field supplies no exact civil day; no January 1 or other day is inferred.' };
  if (date.status !== 'documented') return { eligible: false, gregorianDate: null, reason: 'This date is claimed, conditional or disputed. Choose an explicit study date to inspect a hypothetical sample; geometry cannot authenticate it.' };
  if (date.calendar === null) return { eligible: false, gregorianDate: null, reason: 'The source date has no established Gregorian or Julian convention. Its calendar is not guessed.' };
  const gregorianDate = parsedCivilDay(date.value, date.calendar), year = Number(gregorianDate.slice(0, 4));
  if (year < 1900 || year > 2100) return { eligible: false, gregorianDate, reason: 'The documented date is outside the canonical 1900–2100 study range and remains source-only.' };
  return { eligible: true, gregorianDate, reason: 'An exact documented civil-day field is eligible for a separately assumed-clock sample; this does not verify an event instant or document authenticity.' };
}
function timelineRows(claims, dateRole = null, datedOnly = false) {
  return claims.flatMap(claim => (dateRole ? [dateRole] : ESCHATOLOGY_DATE_ROLES).filter(role => !datedOnly || claim.dates[role].precision !== 'unknown').map(role => ({
    id: claim.id + ':' + role, claimId: claim.id, dateRole: role, title: claim.title, familyId: claim.familyId, claimKind: claim.kind, assessment: claim.assessment,
    date: copy(claim.dates[role]), sourceIds: [...claim.sourceIds], geometryEligibility: dateEligibility(claim.dates[role]),
  })));
}
function newtonComparison() {
  return { kind: 'separate-source-argument', scenarios: copy(NEWTON.scenarios), textualVariants: copy(NEWTON.textualVariants), exactPropheticDate: null, yearProximityCalculated: false, eventOutcomeCorrespondence: null,
    method: 'Retain Newton’s distinct directional year arguments and their own sources. Calendar conversion and shared imagery do not identify the selected claim with either period.', sourceIds: ['EA-METHODS'], limitations: [...NEWTON.limitations] };
}
function relatedTools(claims) {
  return claims.some(c => c.familyId === 'thelema') ? [{ id: 'era-legis', title: 'Era Legis — Thelemic date stamp', url: 'pages/thelemic-times.html', status: 'existing-separate-tool', claimType: 'related-tool-discovery', calculatedInThisResult: false,
    scope: 'An existing era/date-stamp calculator. It is not an additional eschatological target, a fourth reading lens or evidence that a prophecy is true.', sourceIds: ['EA-METHODS'] }] : [];
}
function graphOf(entities, claims, edges, sources) {
  const graphSourceIds = sourceIdsIn([entities, claims, edges]);
  const nodes = [
    ...entities.map(e => ({ id: 'entity:' + e.id, refId: e.id, kind: 'entity', entityKind: e.kind, familyId: e.familyId, label: e.label, sourceIds: [...e.sourceIds] })),
    ...claims.map(c => ({ id: 'claim:' + c.id, refId: c.id, kind: 'claim', familyId: c.familyId, label: c.title, assessment: c.assessment, sourceIds: [...c.sourceIds] })),
    ...sources.filter(s => graphSourceIds.has(s.id)).map(s => ({ id: 'source:' + s.id, refId: s.id, kind: 'source', label: s.title, sourceIds: [s.id] })),
  ];
  const graphEdges = edges.map(e => ({ ...copy(e), id: 'curated:' + e.id, fromId: 'entity:' + e.fromId, toId: 'entity:' + e.toId, provenance: 'curated-source-edge', historicalRelationshipClaim: e.type !== 'comparison' }));
  for (const c of claims) {
    for (const id of c.subjectIds) graphEdges.push({ id: 'subject:' + c.id + ':' + id, fromId: 'claim:' + c.id, toId: 'entity:' + id, type: 'subject', label: 'Record concerns', provenance: 'catalogue-index', historicalRelationshipClaim: false, asserted: false, claimIds: [c.id], sourceIds: [...c.sourceIds] });
    for (const id of c.sourceIds) graphEdges.push({ id: 'citation:' + c.id + ':' + id, fromId: 'claim:' + c.id, toId: 'source:' + id, type: 'citation', label: 'Claim cites source', provenance: 'catalogue-index', historicalRelationshipClaim: false, asserted: false, claimIds: [c.id], sourceIds: [id] });
  }
  if (nodes.length > ESCHATOLOGY_ATLAS_LIMITS.maximumGraphNodes || graphEdges.length > ESCHATOLOGY_ATLAS_LIMITS.maximumGraphEdges) throw new Error('The evidence graph exceeds its bounded catalogue limits.');
  const nodeIds = new Set(nodes.map(n => n.id));
  if (nodeIds.size !== nodes.length || new Set(graphEdges.map(e => e.id)).size !== graphEdges.length || graphEdges.some(e => !nodeIds.has(e.fromId) || !nodeIds.has(e.toId))) throw new Error('The evidence graph has an unresolved or duplicate identity.');
  return { nodes, edges: graphEdges, inferredEdges: false, method: 'Curated typed source relationships plus explicitly labelled subject/citation index links. Layout distance and connectivity are not evidence of causation or common belief.', sourceIds: ['EA-METHODS'] };
}

/** A finite curated catalogue. Filters do not mutate claims or promote dates. */
export function buildEschatologyAtlas(raw = {}) {
  const r = fields(raw, ['familyId', 'claimKind', 'dateRole', 'datedOnly'], 'atlas filter');
  const familyId = Object.hasOwn(r, 'familyId') ? choice(r.familyId, ESCHATOLOGY_ATLAS_FILTERS.familyIds, 'family') : null;
  const claimKind = Object.hasOwn(r, 'claimKind') ? choice(r.claimKind, ESCHATOLOGY_ATLAS_FILTERS.claimKinds, 'claim kind') : null;
  const dateRole = Object.hasOwn(r, 'dateRole') ? choice(r.dateRole, ESCHATOLOGY_DATE_ROLES, 'date role') : null;
  if (Object.hasOwn(r, 'datedOnly') && typeof r.datedOnly !== 'boolean') throw new TypeError('datedOnly must be a boolean.');
  const datedOnly = r.datedOnly ?? false;
  const claims = CLAIMS.filter(c => (!familyId || c.familyId === familyId) && (!claimKind || c.kind === claimKind) && (!datedOnly || (dateRole ? [dateRole] : ESCHATOLOGY_DATE_ROLES).some(role => c.dates[role].precision !== 'unknown')));
  const ids = new Set(claims.map(c => c.id)), edges = EDGES.filter(e => e.claimIds.every(id => ids.has(id)));
  const withheldEdges = EDGES.filter(e => e.claimIds.some(id => ids.has(id)) && !e.claimIds.every(id => ids.has(id)));
  const entityIds = new Set([...claims.flatMap(c => c.subjectIds), ...edges.flatMap(e => [e.fromId, e.toId])]);
  const entities = ENTITIES.filter(e => entityIds.has(e.id));
  const result = { schemaVersion: ESCHATOLOGY_ATLAS_VERSION, kind: 'source-claim-evidence-atlas', request: { ...(familyId ? { familyId } : {}), ...(claimKind ? { claimKind } : {}), ...(dateRole ? { dateRole } : {}), datedOnly }, entities: copy(entities), claims: copy(claims), edges: copy(edges),
    timeline: timelineRows(claims, dateRole, datedOnly), graph: graphOf(entities, claims, edges, SOURCES), newtonComparison: newtonComparison(), relatedTools: relatedTools(claims),
    counts: { claims: claims.length, entities: entities.length, curatedEdges: edges.length, totalCatalogueClaims: CLAIMS.length, truncated: false }, filters: copy(ESCHATOLOGY_ATLAS_FILTERS),
    filterDisclosure: { curatedEdgePolicy: 'An edge is included only when all supporting claims remain selected. Otherwise the entire edge is withheld; its evidence identifiers and qualifications are never stripped.', withheldCuratedEdges: withheldEdges.map(e => ({ id: e.id, reason: 'One or more supporting claims are outside the selected filter.' })) },
    limitations: [...LIMITATIONS, ...ESCHATOLOGY_PIKE_LIMITS, ...ESCHATOLOGY_TRADITION_LIMITS], sourceIds: ['EA-METHODS'],
  };
  result.sources = sourcesFor(result); return result;
}

const FRAME_KEYS = ['claimId', 'dateRole', 'selection', 'date', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation', 'includeCatalogStars'];
function frameRequest(raw) {
  const r = fields(raw, FRAME_KEYS, 'atlas frame');
  if (typeof r.claimId !== 'string' || !BY_CLAIM.has(r.claimId)) throw new RangeError('Choose a known source claim.');
  choice(r.dateRole, ESCHATOLOGY_DATE_ROLES, 'date role'); choice(r.selection, ESCHATOLOGY_FRAME_SELECTIONS, 'date selection');
  choice(r.disambiguation, ['reject', 'earlier', 'later'], 'explicit repeated-clock policy');
  if (r.selection === 'source-date' && Object.hasOwn(r, 'date')) throw new RangeError('A source-date request cannot override the source with a supplied day. Choose study-date explicitly.');
  if (r.selection === 'study-date' && !Object.hasOwn(r, 'date')) throw new RangeError('An explicitly selected study date is required.');
  // This sentinel validates only primitive observer/clock options through the
  // existing strict contract. It is never calculated, exported or used as a day.
  const validationDate = r.selection === 'study-date' ? r.date : '2000-01-01';
  const normalized = normalizeCalendarTimelineRequest({ startDate: validationDate, endDate: validationDate, time: r.time, timeZone: r.timeZone, lat: r.lat, lon: r.lon, system: r.system, disambiguation: r.disambiguation, includeCatalogStars: r.includeCatalogStars, includeGuidance: false });
  return { claimId: r.claimId, dateRole: r.dateRole, selection: r.selection, ...(r.selection === 'study-date' ? { date: r.date } : {}), time: normalized.time, timeZone: normalized.timeZone, lat: normalized.lat, lon: normalized.lon, system: normalized.system, disambiguation: normalized.disambiguation, includeCatalogStars: normalized.includeCatalogStars };
}

/** Claim provenance stays distinct from an explicit modern astronomical sample. */
export function buildEschatologyAtlasFrame(raw) {
  const request = frameRequest(raw), claim = BY_CLAIM.get(request.claimId), sourceDate = claim.dates[request.dateRole], eligibility = dateEligibility(sourceDate);
  const date = request.selection === 'study-date' ? request.date : eligibility.eligible ? eligibility.gregorianDate : null;
  const selection = { claimId: claim.id, dateRole: request.dateRole, mode: request.selection, sourceDate: copy(sourceDate), sourceDateEligibility: eligibility, selectedGregorianDate: date,
    assumedClock: true, assumedObserver: true, historicalEventInstantEstablished: false, geometryValidatesSourceAuthenticity: false,
    label: request.selection === 'study-date' ? 'Explicit user-selected study day, independent of the claim’s date precision or authenticity.' : eligibility.eligible ? 'Documented civil-date field with a separately assumed study clock and observer; not a recovered event instant.' : 'Source date retained without calculated geometry; its precision, status and calendar remain unchanged.', sourceIds: [...claim.sourceIds, 'EA-METHODS'] };
  let frame = null, readings = null, status = 'source-only', reason = eligibility.reason;
  if (date !== null) {
    frame = buildNewtonExplorationFrame({ date, time: request.time, timeZone: request.timeZone, lat: request.lat, lon: request.lon, system: request.system, disambiguation: request.disambiguation, includeCatalogStars: request.includeCatalogStars });
    status = frame.status; reason = frame.slot.reason;
    if (status === 'available') readings = buildSkyInterpretation({ dateISO: frame.context.dateISO, lat: frame.context.lat, lon: frame.context.lon, timeZone: frame.context.timeZone, system: frame.context.system }, { lensIds: ['lilly', 'agrippa', 'jyotisha'], planet: 'Moon', purpose: 'study', includeObserver: true });
  }
  const result = { schemaVersion: ESCHATOLOGY_ATLAS_VERSION, kind: 'source-claim-and-assumed-study-sample', request, status, reason, claim: copy(claim), selection, frame, readings, newtonComparison: newtonComparison(), relatedTools: relatedTools([claim]),
    scope: { civilCalendarRows: frame?.comparison?.calendars.length ?? 0, namedReadingLenses: readings?.lenses.length ?? 0, readingPurpose: 'study', selectedReadingBody: 'Moon', civilCalendarsAreReadingLenses: false, outcomeScoreCalculated: false, hiddenBeliefIdentified: false },
    limitations: [...LIMITATIONS, ...(frame?.limitations || []), ...(readings?.limitations || [])], sourceIds: ['EA-METHODS'],
  };
  result.sources = sourcesFor(result, mergedSources(SOURCES, frame?.sources || [], readings?.sources || [])); return result;
}

/** Serialization helpers emit held data only; they do not authenticate it. */
export function serializeEschatologyAtlasJSON(atlas) { return JSON.stringify(atlas, null, 2) + '\n'; }
export function serializeEschatologyAtlasFrameJSON(result) { return JSON.stringify(result, null, 2) + '\n'; }
function csvCell(value) { let s = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value); if (typeof value !== 'number' && (/^\s*[=+@-]/.test(s) || /^[\t\r\n]/.test(s))) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }
const csv = rows => rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
export function serializeEschatologyAtlasCSV(atlas) {
  const rows = [['recordType', 'id', 'claimId', 'dateRole', 'status', 'value', 'sourceIds']];
  rows.push(['catalogue-filter', 'request', '', '', 'explicit-request', atlas.request, ['EA-METHODS']]);
  rows.push(['filter-disclosure', 'curated-edges', '', '', 'complete-support-required', atlas.filterDisclosure, ['EA-METHODS']]);
  for (const e of atlas.entities) rows.push(['entity', e.id, '', '', '', e, e.sourceIds]);
  for (const c of atlas.claims) rows.push(['claim', c.id, c.id, '', c.assessment, c, c.sourceIds]);
  for (const t of atlas.timeline) rows.push(['source-date', t.id, t.claimId, t.dateRole, t.date.status, t.date, t.sourceIds]);
  for (const e of atlas.graph.edges) rows.push(['typed-graph-edge', e.id, e.claimIds, '', e.provenance, e, e.sourceIds]);
  rows.push(['newton-comparison', 'newton', '', '', 'separate-source-arguments', atlas.newtonComparison, atlas.newtonComparison.sourceIds]);
  for (const tool of atlas.relatedTools) rows.push(['related-tool', tool.id, '', '', tool.status, tool, tool.sourceIds]);
  for (const s of atlas.sources) rows.push(['source', s.id, '', '', 'source-record', s, []]);
  rows.push(['limits', 'limits', '', '', 'qualified', atlas.limitations, ['EA-METHODS']]); return csv(rows);
}
export function serializeEschatologyAtlasFrameCSV(result) {
  const rows = [['recordType', 'id', 'claimId', 'dateRole', 'dateISO', 'status', 'value', 'sourceIds']];
  const add = (kind, id, status, value, sourceIds = []) => rows.push([kind, id, result.claim.id, result.selection.dateRole, result.frame?.context?.dateISO ?? null, status, value, sourceIds]);
  add('source-claim', result.claim.id, result.claim.assessment, result.claim, result.claim.sourceIds);
  add('selection', 'selection', result.status, result.selection, result.selection.sourceIds);
  add('calculation-context', 'request', result.status, result.request, ['EA-METHODS']);
  add('availability', 'sample', result.status, { reason: result.reason, slot: result.frame?.slot ?? null }, ['EA-METHODS']);
  for (const c of result.frame?.comparison?.calendars || []) add('civil-calendar', c.id, c.status, c, c.sourceIds);
  for (const body of result.frame?.sky?.bodies || []) add('sky-body', body.id, 'available', body, ['SKY-ASTRONOMY']);
  for (const [kind, chart] of Object.entries(result.frame?.charts || {})) add('chart', kind, chart.status, chart, chart.sourceIds);
  for (const fact of result.readings?.facts || []) add('reading-fact', fact.id, 'calculated', fact, fact.sourceIds);
  for (const lens of result.readings?.lenses || []) for (const rule of lens.rules) add('named-reading', lens.id + ':' + rule.id, rule.classification, { lensId: lens.id, lensLabel: lens.label, rule }, rule.sourceIds);
  for (const difference of result.readings?.differences || []) add('reading-difference', difference.id, difference.kind, difference, difference.sourceIds);
  add('newton-comparison', 'newton', 'separate-source-arguments', result.newtonComparison, result.newtonComparison.sourceIds);
  for (const tool of result.relatedTools) add('related-tool', tool.id, tool.status, tool, tool.sourceIds);
  for (const source of result.sources) add('source', source.id, 'source-record', source);
  add('limits', 'limits', 'qualified', result.limitations, ['EA-METHODS']); return csv(rows);
}
export function exportEschatologyAtlasJSON(raw = {}) { return serializeEschatologyAtlasJSON(buildEschatologyAtlas(raw)); }
export function exportEschatologyAtlasCSV(raw = {}) { return serializeEschatologyAtlasCSV(buildEschatologyAtlas(raw)); }
export function exportEschatologyAtlasFrameJSON(raw) { return serializeEschatologyAtlasFrameJSON(buildEschatologyAtlasFrame(raw)); }
export function exportEschatologyAtlasFrameCSV(raw) { return serializeEschatologyAtlasFrameCSV(buildEschatologyAtlasFrame(raw)); }
