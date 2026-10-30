import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import {
  buildEschatologyAtlas, buildEschatologyAtlasFrame, ESCHATOLOGY_DATE_ROLES, ESCHATOLOGY_ATLAS_FILTERS,
  exportEschatologyAtlasJSON, exportEschatologyAtlasCSV, exportEschatologyAtlasFrameJSON, exportEschatologyAtlasFrameCSV,
  serializeEschatologyAtlasJSON, serializeEschatologyAtlasCSV, serializeEschatologyAtlasFrameJSON, serializeEschatologyAtlasFrameCSV,
} from '../../assets/js/core/eschatology-atlas.js';
import { ESCHATOLOGY_PIKE_CLAIMS, ESCHATOLOGY_PIKE_EDGES } from '../../assets/js/core/data/eschatology-pike-evidence.js';
import { ESCHATOLOGY_TRADITION_CLAIMS, ESCHATOLOGY_TRADITION_EDGES } from '../../assets/js/core/data/eschatology-tradition-evidence.js';
import { buildNewtonChronology, buildNewtonExplorationFrame } from '../../assets/js/core/newton-chronology.js';
import { buildSkyInterpretation } from '../../assets/js/core/sky-interpretation.js';

const SETTINGS = { time: '12:00', timeZone: 'Europe/London', lat: 51.5074, lon: -.1278, system: 'regiomontanus', disambiguation: 'reject' };
function refs(value, ids = new Set()) { if (!value || typeof value !== 'object') return ids; if (Array.isArray(value.sourceIds)) value.sourceIds.forEach(id => ids.add(id)); for (const [key, child] of Object.entries(value)) if (key !== 'sources') refs(child, ids); return ids; }
function keys(value) { return value && typeof value === 'object' ? Object.entries(value).flatMap(([key, child]) => [key, ...keys(child)]) : []; }
function csvRows(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (c === '\r' && text[i + 1] === '\n' && !quoted) { row.push(cell); rows.push(row); row = []; cell = ''; i++; }
    else cell += c;
  }
  assert.equal(quoted, false); assert.equal(cell, ''); return rows;
}

export async function run() {
  let count = 0; const failures = [];
  const test = (label, fn) => { count++; try { fn(); } catch (error) { failures.push(label + ': ' + error.message); } };
  const atlas = buildEschatologyAtlas(), allClaims = [...ESCHATOLOGY_PIKE_CLAIMS, ...ESCHATOLOGY_TRADITION_CLAIMS];
  const allEdges = [...ESCHATOLOGY_PIKE_EDGES, ...ESCHATOLOGY_TRADITION_EDGES];
  const first = atlas.claims[0], study = { ...SETTINGS, claimId: first.id, dateRole: 'target', selection: 'study-date', date: '2060-07-01' };
  test('Complete catalogue preserves curated claims, qualifications, roles and identities', () => {
    assert.deepEqual(atlas.claims, allClaims); assert.deepEqual(atlas.edges, allEdges); assert.equal(atlas.counts.truncated, false);
    assert.equal(atlas.timeline.length, allClaims.length * 6); assert.deepEqual(ESCHATOLOGY_DATE_ROLES, ['claimedDocument', 'statement', 'publication', 'transmission', 'target', 'historicalContext']);
    for (const claim of allClaims) for (const role of ESCHATOLOGY_DATE_ROLES) assert.deepEqual(atlas.timeline.find(t => t.claimId === claim.id && t.dateRole === role).date, claim.dates[role]);
    for (const key of ['ranking', 'probability', 'beliefScore', 'militaryTiming', 'bestDate']) assert.ok(!keys(atlas).includes(key));
    assert.deepEqual(buildEschatologyAtlas(atlas.request), atlas);
  });
  test('Every graph link resolves and generated relations are explicitly nonhistorical indexing', () => {
    const ids = new Set(atlas.graph.nodes.map(n => n.id)), claimIds = new Set(atlas.claims.map(c => c.id));
    assert.equal(ids.size, atlas.graph.nodes.length); assert.equal(atlas.graph.inferredEdges, false);
    for (const edge of atlas.graph.edges) { assert.ok(ids.has(edge.fromId)); assert.ok(ids.has(edge.toId)); assert.ok(edge.claimIds.every(id => claimIds.has(id))); if (edge.provenance === 'catalogue-index') { assert.equal(edge.historicalRelationshipClaim, false); assert.equal(edge.asserted, false); assert.ok(['subject', 'citation'].includes(edge.type)); } }
    for (const claim of allClaims) { assert.ok(ids.has('claim:' + claim.id)); for (const subject of claim.subjectIds) assert.ok(atlas.graph.edges.some(e => e.fromId === 'claim:' + claim.id && e.toId === 'entity:' + subject && e.type === 'subject')); }
  });
  for (const familyId of ESCHATOLOGY_ATLAS_FILTERS.familyIds) test('Family filter preserves evidence closure: ' + familyId, () => {
    const result = buildEschatologyAtlas({ familyId }), ids = new Set(result.claims.map(c => c.id));
    assert.ok(result.claims.length > 0); assert.ok(result.claims.every(c => c.familyId === familyId));
    for (const edge of result.edges) assert.ok(edge.claimIds.every(id => ids.has(id)));
    const expected = allEdges.filter(e => e.claimIds.every(id => ids.has(id))); assert.deepEqual(result.edges, expected);
    const withheld = allEdges.filter(e => e.claimIds.some(id => ids.has(id)) && !e.claimIds.every(id => ids.has(id))); assert.deepEqual(result.filterDisclosure.withheldCuratedEdges.map(e => e.id), withheld.map(e => e.id));
    const available = new Set(result.sources.map(s => s.id)); for (const id of refs(result)) assert.ok(available.has(id), id);
  });
  test('Date-role and known-date filters never relabel publication as target', () => {
    const targets = buildEschatologyAtlas({ dateRole: 'target', datedOnly: true });
    assert.ok(targets.timeline.every(t => t.dateRole === 'target' && t.date.precision !== 'unknown'));
    assert.deepEqual(targets.claims.map(c => c.id), allClaims.filter(c => c.dates.target.precision !== 'unknown').map(c => c.id));
    const pubs = buildEschatologyAtlas({ dateRole: 'publication', datedOnly: true }); assert.ok(pubs.timeline.every(t => t.dateRole === 'publication'));
  });
  test('Pike alleged-document date remains distinct from unknown target and cannot auto-calculate', () => {
    const claim = ESCHATOLOGY_PIKE_CLAIMS.find(c => c.dates.claimedDocument.precision === 'day' && c.dates.claimedDocument.status !== 'documented');
    assert.ok(claim, 'Expected a sourced alleged-day record'); assert.equal(claim.dates.target.precision, 'unknown'); assert.equal(claim.dates.target.value, null);
    const result = buildEschatologyAtlasFrame({ ...SETTINGS, claimId: claim.id, dateRole: 'claimedDocument', selection: 'source-date' });
    assert.equal(result.status, 'source-only'); assert.equal(result.frame, null); assert.equal(result.readings, null); assert.equal(result.selection.selectedGregorianDate, null); assert.deepEqual(result.selection.sourceDate, claim.dates.claimedDocument); assert.equal(result.selection.geometryValidatesSourceAuthenticity, false);
  });
  test('Newton 2060 and 2370 remain distinct year bounds without fabricated modern days', () => {
    for (const year of ['2060', '2370']) {
      const claim = allClaims.find(c => c.dates.target.precision === 'year' && c.dates.target.value === year); assert.ok(claim, year + ' source branch');
      const result = buildEschatologyAtlasFrame({ ...SETTINGS, claimId: claim.id, dateRole: 'target', selection: 'source-date' });
      assert.equal(result.status, 'source-only'); assert.equal(result.frame, null); assert.equal(result.selection.selectedGregorianDate, null); assert.equal(result.selection.sourceDate.precision, 'year');
    }
    const canonical = buildNewtonChronology(); assert.deepEqual(atlas.newtonComparison.scenarios, canonical.scenarios); assert.deepEqual(atlas.newtonComparison.textualVariants, canonical.textualVariants); assert.equal(atlas.newtonComparison.exactPropheticDate, null); assert.equal(atlas.newtonComparison.yearProximityCalculated, false);
  });
  test('BCE historical context is not silently interpreted as astronomical year numbering', () => {
    const row = atlas.timeline.find(t => t.date.precision === 'year-range' && t.date.startYear < 0); assert.ok(row);
    assert.equal(row.date.yearNumbering, 'historical-no-year-zero'); assert.equal(row.date.calendar, null); assert.equal(row.geometryEligibility.eligible, false);
    const result = buildEschatologyAtlasFrame({ ...SETTINGS, claimId: row.claimId, dateRole: row.dateRole, selection: 'source-date' }); assert.equal(result.frame, null); assert.equal(result.selection.sourceDate.startYear, row.date.startYear);
  });
  for (const raw of [null, [], { familyId: null }, { familyId: 'unknown-family' }, { claimKind: 'unknown-kind' }, { dateRole: 'prediction' }, { datedOnly: 'true' }, { datedOnly: null }, { country: 'usa' }, { graph: {} }, { claims: [] }, { purpose: 'military' }]) test('Catalogue rejects undeclared/coercive input ' + JSON.stringify(raw), () => assert.throws(() => buildEschatologyAtlas(raw)));
  for (const [fn, base] of [[buildEschatologyAtlas, {}], [buildEschatologyAtlasFrame, study]]) {
    test(fn.name + ': descriptor checks execute no input getter', () => {
      let calls = 0; const field = fn === buildEschatologyAtlas ? 'datedOnly' : 'lat';
      assert.throws(() => fn(Object.defineProperty({ ...base }, field, { enumerable: true, get() { calls++; return 1; } }))); assert.equal(calls, 0);
      assert.throws(() => fn({ ...base, [Symbol('secret')]: true })); assert.throws(() => fn(Object.defineProperty({ ...base }, field, { enumerable: false, value: true }))); assert.throws(() => fn(Object.assign(Object.create({ inherited: true }), base)));
    });
  }
  test('Scalar selectors and observer fields never coerce caller objects or iterate arrays', () => {
    let calls = 0;
    const poison = { [Symbol.toPrimitive]() { calls++; return 1; }, valueOf() { calls++; return 1; }, toString() { calls++; return '2060-07-01'; } };
    for (const key of ['familyId', 'claimKind', 'dateRole', 'datedOnly']) assert.throws(() => buildEschatologyAtlas({ [key]: poison }));
    for (const key of ['claimId', 'dateRole', 'selection', 'date', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation', 'includeCatalogStars']) assert.throws(() => buildEschatologyAtlasFrame({ ...study, [key]: poison }));
    const array = Object.defineProperty([], Symbol.iterator, { get() { calls++; throw new Error('Must not be read'); } });
    assert.throws(() => buildEschatologyAtlas({ familyId: array })); assert.throws(() => buildEschatologyAtlasFrame({ ...study, dateRole: array })); assert.equal(calls, 0);
  });
  for (const field of ['claimId', 'dateRole', 'selection', 'date', 'time', 'timeZone', 'lat', 'lon', 'system', 'disambiguation']) test('Study frame requires explicit ' + field, () => { const r = { ...study }; delete r[field]; assert.throws(() => buildEschatologyAtlasFrame(r)); });
  for (const patch of [{ claimId: 'unknown-claim' }, { dateRole: 'prophecy' }, { selection: 'guess' }, { selection: 'source-date' }, { date: '2060-02-30' }, { date: '1900-02-29' }, { date: '2100-02-29' }, { date: '1899-12-31' }, { date: '2101-01-01' }, { date: '2370-01-01' }, { date: null }, { time: '24:00' }, { lat: '51' }, { lat: 90 }, { lon: Infinity }, { system: null }, { disambiguation: null }, { timeZone: 'Invalid/Zone' }, { includeCatalogStars: 'true' }, { purpose: 'war' }, { belief: 'secret' }, { country: 'usa' }, { frame: {} }, { readings: {} }, { dateISO: '2060-01-01T00:00:00Z' }]) test('Study frame rejects invalid selection/context ' + JSON.stringify(patch), () => assert.throws(() => buildEschatologyAtlasFrame({ ...study, ...patch })));
  const result = buildEschatologyAtlasFrame(study);
  test('Modern sample reproduces canonical frame and precisely three fixed reading lenses', () => {
    const canonical = buildNewtonExplorationFrame({ ...SETTINGS, date: study.date }); assert.deepEqual(result.frame, canonical);
    const readings = buildSkyInterpretation({ dateISO: canonical.context.dateISO, lat: canonical.context.lat, lon: canonical.context.lon, timeZone: canonical.context.timeZone, system: canonical.context.system }, { lensIds: ['lilly', 'agrippa', 'jyotisha'], planet: 'Moon', purpose: 'study', includeObserver: true });
    assert.deepEqual(result.readings, readings); assert.deepEqual(result.readings.lenses.map(l => l.id), ['lilly', 'agrippa', 'jyotisha']); assert.equal(result.frame.comparison.calendars.length, 13);
    assert.equal(result.scope.civilCalendarsAreReadingLenses, false); assert.equal(result.scope.outcomeScoreCalculated, false); assert.equal(result.selection.historicalEventInstantEstablished, false); assert.deepEqual(result.selection.sourceDate, first.dates.target);
    assert.equal(result.readings.context.dateISO, result.frame.context.dateISO); assert.equal(result.readings.options.purpose, 'study');
    for (const key of ['purposes', 'studyTasks', 'ranking', 'score']) assert.ok(!keys(result).includes(key));
  });
  test('An eligible documented exact source date uses its field, not the date of its claim target', () => {
    const eligible = atlas.timeline.find(t => t.geometryEligibility.eligible); assert.ok(eligible);
    const sample = buildEschatologyAtlasFrame({ ...SETTINGS, claimId: eligible.claimId, dateRole: eligible.dateRole, selection: 'source-date' });
    assert.equal(sample.status, 'available'); assert.equal(sample.frame.explorationRequest.date, eligible.geometryEligibility.gregorianDate); assert.deepEqual(sample.selection.sourceDate, eligible.date); assert.equal(sample.selection.assumedClock, true); assert.equal(sample.selection.historicalEventInstantEstablished, false);
  });
  test('Unknown-clock gap and explicit fold choices preserve canonical missingness', () => {
    const gap = buildEschatologyAtlasFrame({ ...study, date: '2027-03-14', time: '02:30', timeZone: 'America/New_York' }); assert.equal(gap.status, 'unavailable'); assert.equal(gap.frame.slot.code, 'NONEXISTENT_TIME'); assert.equal(gap.readings, null); assert.equal(gap.frame.comparison, null);
    const fold = buildEschatologyAtlasFrame({ ...study, date: '2027-11-07', time: '01:30', timeZone: 'America/New_York' }); assert.equal(fold.status, 'ambiguous'); assert.equal(fold.frame.slot.candidates.length, 2); assert.equal(fold.readings, null);
    const later = buildEschatologyAtlasFrame({ ...study, date: '2027-11-07', time: '01:30', timeZone: 'America/New_York', disambiguation: 'later' }); assert.equal(later.frame.context.dateISO, '2027-11-07T06:30:00.000Z'); assert.equal(later.readings.context.dateISO, later.frame.context.dateISO);
  });
  test('Skipped civil day and supported-civil/unsupported-UTC boundary are never substituted', () => {
    const skip = buildEschatologyAtlasFrame({ ...study, date: '2011-12-30', timeZone: 'Pacific/Apia' }); assert.equal(skip.status, 'unavailable'); assert.equal(skip.frame.slot.code, 'NONEXISTENT_DATE'); assert.equal(skip.readings, null);
    const edge = buildEschatologyAtlasFrame({ ...study, date: '1900-01-01', time: '00:00', timeZone: 'Asia/Tokyo' }); assert.equal(edge.frame.slot.code, 'UTC_RANGE'); assert.equal(edge.readings, null); assert.equal(edge.selection.selectedGregorianDate, '1900-01-01');
  });
  test('Complete source closure includes Newton branches and the actual named reading sources', () => {
    for (const output of [atlas, result]) { const ids = new Set(output.sources.map(s => s.id)); assert.equal(ids.size, output.sources.length); for (const id of refs(output)) assert.ok(ids.has(id), id); }
    assert.ok(result.sources.some(s => s.id === 'SKY-LILLY-DIGNITY')); assert.ok(result.sources.some(s => s.id === 'NC-YAHUDA-7-3G'));
  });
  test('Canonical JSON/CSV exports equal shared held-result serializers', () => {
    assert.equal(exportEschatologyAtlasJSON(), serializeEschatologyAtlasJSON(atlas)); assert.equal(exportEschatologyAtlasCSV(), serializeEschatologyAtlasCSV(atlas));
    assert.equal(exportEschatologyAtlasFrameJSON(study), serializeEschatologyAtlasFrameJSON(result)); assert.equal(exportEschatologyAtlasFrameCSV(study), serializeEschatologyAtlasFrameCSV(result));
    assert.deepEqual(JSON.parse(exportEschatologyAtlasFrameJSON(study)), result);
    const rows = csvRows(exportEschatologyAtlasFrameCSV(study)); assert.equal(rows.filter(r => r[0] === 'civil-calendar').length, 13); assert.equal(rows.filter(r => r[0] === 'sky-body').length, 10); assert.ok(rows.some(r => r[0] === 'calculation-context')); assert.ok(rows.some(r => r[0] === 'limits'));
    const claimRow = rows.find(r => r[0] === 'source-claim'); assert.deepEqual(JSON.parse(claimRow[6]), first);
    assert.throws(() => exportEschatologyAtlasFrameJSON(result));
  });
  test('Raw property order and repeated filters do not change canonical export bytes', () => {
    const reordered = Object.fromEntries(Object.entries(study).reverse()); assert.equal(exportEschatologyAtlasFrameJSON(reordered), exportEschatologyAtlasFrameJSON(study)); assert.equal(exportEschatologyAtlasFrameCSV(reordered), exportEschatologyAtlasFrameCSV(study));
    const filters = { familyId: first.familyId, dateRole: 'publication', datedOnly: true }, reverse = Object.fromEntries(Object.entries(filters).reverse());
    assert.equal(exportEschatologyAtlasJSON(filters), exportEschatologyAtlasJSON(reverse)); assert.equal(exportEschatologyAtlasCSV(filters), exportEschatologyAtlasCSV(reverse));
    const replay = buildEschatologyAtlas(filters); assert.deepEqual(buildEschatologyAtlas(replay.request), replay); assert.deepEqual(buildEschatologyAtlasFrame(result.request), result);
  });
  test('Catalogue CSV retains normalized filters, edge withholding and separate tool discovery', () => {
    const filtered = buildEschatologyAtlas({ familyId: 'church-of-satan', dateRole: 'publication', datedOnly: false }), rows = csvRows(serializeEschatologyAtlasCSV(filtered));
    assert.deepEqual(JSON.parse(rows.find(r => r[0] === 'catalogue-filter')[5]), filtered.request); assert.deepEqual(JSON.parse(rows.find(r => r[0] === 'filter-disclosure')[5]), filtered.filterDisclosure);
    assert.ok(filtered.filterDisclosure.withheldCuratedEdges.some(e => e.id === 'TR-R-COS-TST'));
    const thelema = buildEschatologyAtlas({ familyId: 'thelema' }), tools = csvRows(serializeEschatologyAtlasCSV(thelema)).filter(r => r[0] === 'related-tool'); assert.equal(tools.length, 1); assert.equal(JSON.parse(tools[0][5]).id, 'era-legis'); assert.equal(JSON.parse(tools[0][5]).calculatedInThisResult, false);
  });
  test('Source-only CSV/JSON keeps unknown dates and reasons without fabricated chart rows', () => {
    const row = atlas.timeline.find(t => t.date.precision === 'unknown'), raw = { ...SETTINGS, claimId: row.claimId, dateRole: row.dateRole, selection: 'source-date' }, output = buildEschatologyAtlasFrame(raw);
    assert.equal(output.status, 'source-only'); assert.equal(output.frame, null); assert.equal(output.readings, null); assert.ok(output.reason);
    assert.deepEqual(JSON.parse(exportEschatologyAtlasFrameJSON(raw)), output); const rows = csvRows(exportEschatologyAtlasFrameCSV(raw)); assert.ok(!rows.some(r => ['sky-body', 'chart', 'civil-calendar', 'named-reading'].includes(r[0])));
    assert.equal(rows.find(r => r[0] === 'selection')[4], ''); assert.equal(JSON.parse(rows.find(r => r[0] === 'selection')[6]).sourceDate.value, null);
    const ids = new Set(output.sources.map(s => s.id)); for (const id of refs(output)) assert.ok(ids.has(id), id);
  });
  test('Returned catalogue and frame copies cannot mutate subsequent source claims', () => {
    const copied = buildEschatologyAtlas(); copied.claims[0].dates.target.value = '9999-01-01'; copied.graph.edges[0].label = 'invented'; assert.deepEqual(buildEschatologyAtlas().claims, allClaims);
    const sample = buildEschatologyAtlasFrame(study); sample.claim.title = 'forged'; assert.equal(buildEschatologyAtlasFrame(study).claim.title, first.title);
  });
  return { pass: failures.length === 0, count, failures };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { const result = await run(); console.log(`${result.pass ? 'PASS' : 'FAIL'} eschatology atlas: ${result.count} checks`); result.failures.forEach(f => console.error(f)); process.exitCode = result.pass ? 0 : 1; }
