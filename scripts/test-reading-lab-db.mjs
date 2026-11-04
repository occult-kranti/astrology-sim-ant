// Executes real PostgreSQL-in-WASM grants, RLS, constraints and RPC tests.
// No hosted project, credentials, private charts or model test splits are read.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { buildReadingLabDatabase, readingLabSeedSQL, READING_DATABASE_PATH, READING_MIGRATION_PATH } from './build-reading-lab-database.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
if (!process.env.PGLITE_PKG) throw new Error('Set PGLITE_PKG to the installed @electric-sql/pglite 0.5.13 dist/index.js. No remote database is used.');
const modulePath = resolve(process.env.PGLITE_PKG);
const version = JSON.parse(readFileSync(resolve(dirname(modulePath), '../package.json'), 'utf8')).version;
assert.equal(version, '0.5.13', 'Use the pinned local PostgreSQL-in-WASM dependency');
const { PGlite } = await import(pathToFileURL(modulePath).href);
const db = new PGlite();
const sha = value => createHash('sha256').update(value).digest('hex');
const database = buildReadingLabDatabase(), seed = readingLabSeedSQL(database);
const migration = readFileSync(resolve(root, READING_MIGRATION_PATH), 'utf8');
const storedJSON = readFileSync(resolve(root, READING_DATABASE_PATH), 'utf8');
const output = process.env.READING_LAB_DB_RECEIPT ? resolve(process.env.READING_LAB_DB_RECEIPT) : null;
if (output && existsSync(output)) throw new Error('Choose a fresh READING_LAB_DB_RECEIPT path; retain earlier receipts.');
const startedAt = new Date().toISOString(), checks = [], queries = [];
const check = (label, condition, detail) => { assert.ok(condition, label); checks.push({ label, pass: true, ...(detail === undefined ? {} : { detail }) }); };
const rejects = async (label, action, pattern) => { await assert.rejects(action, pattern); checks.push({ label, pass: true }); };
const count = async () => Number((await db.query('select count(*) as n from public.reading_lab_examples')).rows[0].n);
const baseReceipt = {
  schemaVersion: 1, kind: 'local-public-reading-database-verification', startedAt,
  engine: `@electric-sql/pglite ${version}; PostgreSQL in WASM`, hostedSupabase: false,
  remoteCredentialsUsed: false, networkCalls: 0, privateProfilesIncluded: false, modelEvaluationDataIncluded: false,
  driverSHA256: sha(readFileSync(new URL(import.meta.url))),
  generatorSHA256: sha(readFileSync(new URL('./build-reading-lab-database.mjs', import.meta.url))),
  migrationSHA256: sha(migration), seedSHA256: sha(seed), databaseSHA256: database.contentSHA256
};
let receipt;
try {
  assert.equal(storedJSON, JSON.stringify(database, null, 2) + '\n');
  check('Generated public JSON matches fresh canonical calculation and explicit source hashes', true);
  check('Public JSON stays below one megabyte', Buffer.byteLength(storedJSON) < 1000000, { bytes: Buffer.byteLength(storedJSON) });
  check('Only published source cases enter the exporter', database.examples.every(row => !Object.keys(row.input).some(key => /name|birth|profile|lat|lon|chat|token|key|secret/i.test(key) && !['planetLongitude', 'sunLongitude', 'moonLongitude', 'workedChartKey'].includes(key))));
  check('No full calculated chart is stored in a result summary', database.examples.every(row => row.resultSummary.frameworks.every(item => !('facts' in item) && !('chart' in item) && !('planets' in item))));
  check('Model training and held-out files are absent from the source whitelist', database.sourceFiles.every(row => !/model-lab|private|heldout/.test(row.file)));
  check('All nonnumeric examples remain unevaluable', database.examples.filter(row => row.totalReferenceFields === 0).every(row => row.status === 'not-numerically-evaluable' && row.outcomeEvaluable === false));
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls; create role reading_lab_outsider;');
  await db.exec(migration);
  await db.exec(migration);
  check('Migration is repeatable', true);
  await db.exec(seed); await db.exec(seed);
  check('Seed is idempotent and contains all authored public cases', await count() === database.examples.length);
  const stored = (await db.query('select * from public.reading_lab_examples order by id')).rows;
  for (const row of stored) {
    const example = database.examples.find(item => item.id === row.id);
    const { resultSummary, fieldChecks, contentSHA256, ...caseData } = example;
    assert.deepEqual(row.case_data, caseData); assert.deepEqual(row.field_checks, fieldChecks);
    assert.deepEqual(row.result_summary, resultSummary);
    assert.deepEqual(row.sources, example.sourceIds.map(id => database.sources.find(source => source.id === id)));
    assert.deepEqual(row.source_ids, example.sourceIds);
    assert.equal(row.content_sha256, contentSHA256); assert.equal(row.source_graph_sha256, database.sourceGraphSHA256);
    assert.equal(row.outcome_evaluable, false); assert.equal(row.published, true);
  }
  check('Every public case, source, locator, rights statement, checked value, limit and hash round-trips exactly', true, { examples: stored.length });
  const summary = (await db.query('select count(distinct tradition_id) as traditions,sum(total_reference_fields) as fields,sum(matched_fields) as matches,count(*) filter (where total_reference_fields=0) as unevaluable from public.reading_lab_examples')).rows[0];
  check('SQL preserves separate field counts and unevaluable cases', Number(summary.traditions) === database.summary.traditions && Number(summary.fields) === database.summary.referenceFields && Number(summary.matches) === database.summary.matchedFields && Number(summary.unevaluable) === database.summary.unevaluableCases, summary);
  check('RLS is enabled', (await db.query("select relrowsecurity from pg_class where oid='public.reading_lab_examples'::regclass")).rows[0].relrowsecurity);
  const proc = (await db.query("select prosecdef,proconfig from pg_proc where oid='public.search_reading_lab_examples(text,integer,text)'::regprocedure")).rows[0];
  check('RPC uses invoker privileges and fixed empty search path', proc.prosecdef === false && proc.proconfig.includes('search_path=""'));
  check('Source validation helper is outside the exposed public schema', Number((await db.query("select count(*) as n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='reading_lab_sources_valid'")).rows[0].n) === 0);
  const copy = (id, published) => db.query(`insert into public.reading_lab_examples(id,dataset_id,tradition_id,title,method_id,kind,status,source_ids,sources,case_data,field_checks,result_summary,matched_fields,total_reference_fields,outcome_evaluable,content_sha256,source_graph_sha256,published)
    select $1,dataset_id,tradition_id,'HiddenSentinel',method_id,kind,status,source_ids,sources,case_data,field_checks,result_summary,matched_fields,total_reference_fields,outcome_evaluable,content_sha256,source_graph_sha256,$2 from public.reading_lab_examples order by id limit 1`, [id, published]);
  await copy('qa-retired-example', true); await db.exec(seed);
  check('Reseeding retires removed managed rows without deleting them', (await db.query("select published from public.reading_lab_examples where id='qa-retired-example'")).rows[0].published === false);
  await copy('qa-unpublished-example', false);
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    check(`${role} sees exactly the published authored examples`, await count() === database.examples.length);
    check(`${role} cannot directly read unpublished or retired rows`, (await db.query("select id from public.reading_lab_examples where id like 'qa-%'")).rows.length === 0);
    check(`${role} RPC cannot expose unpublished rows`, (await db.query("select id from public.search_reading_lab_examples('HiddenSentinel',24,null)")).rows.length === 0);
    for (const [verb, sql] of [
      ['insert', "insert into public.reading_lab_examples(id) values ('qa-write')"],
      ['update', 'update public.reading_lab_examples set published=false'],
      ['delete', 'delete from public.reading_lab_examples'],
      ['truncate', 'truncate public.reading_lab_examples']
    ]) await rejects(`${role} ${verb} is denied`, () => db.exec(sql), /permission denied/);
    const browse = (await db.query("select id from public.search_reading_lab_examples('',24,null)")).rows;
    check(`${role} can browse published examples through bounded RPC`, browse.length === database.examples.length);
    await db.exec('reset role');
  }
  await db.exec('set role reading_lab_outsider');
  await rejects('Unrelated role has no PUBLIC table permission', () => db.query('select id from public.reading_lab_examples'), /permission denied/);
  await rejects('Unrelated role has no PUBLIC RPC permission', () => db.query("select * from public.search_reading_lab_examples('',8,null)"), /permission denied/);
  await db.exec('reset role; set role service_role');
  await copy('qa-service-example', false);
  check('Trusted service role can curate explicitly', (await db.query("select id from public.reading_lab_examples where id='qa-service-example'")).rows.length === 1);
  check('RPC remains published-only for a bypass-RLS service role', (await db.query("select id from public.search_reading_lab_examples('HiddenSentinel',24,null)")).rows.length === 0);
  await rejects('Source rights metadata is required by SQL constraint', () => db.query("update public.reading_lab_examples set sources=jsonb_set(sources,'{0}',(sources->0)-'rights') where id='qa-service-example'"), /check constraint/);
  await rejects('Source ID order cannot silently disagree with metadata', () => db.query("update public.reading_lab_examples set source_ids=ARRAY['invented-source'] where id='qa-service-example'"), /check constraint/);
  await rejects('Outcome validation cannot be claimed through this schema', () => db.query("update public.reading_lab_examples set outcome_evaluable=true where id='qa-service-example'"), /check constraint/);
  await rejects('Unevaluable example cannot be marked a successful numerical match', () => db.query("update public.reading_lab_examples set status='reference-fields-match',total_reference_fields=0,matched_fields=0,field_checks='[]'::jsonb where id='qa-service-example'"), /check constraint/);
  await db.exec('reset role; set role anon');
  for (const [query, expected] of [
    ['Maya', 'mayan-nmai-2012-12-20'], ['cazimi', 'lilly-cazimi-example'],
    ['Easter', 'christian-easter-2024'], ['tithi', 'vedic-rao-tithi-example-2'],
    ['leap month', 'chinese-leap-month-2023'], ['feeling', 'jung-feeling-valuation']
  ]) {
    const rows = (await db.query('select id from public.search_reading_lab_examples($1,8,null)', [query])).rows;
    const ids = rows.map(row => row.id); check(`Source lookup: ${query}`, ids.includes(expected)); queries.push({ query, expected, returned: ids });
  }
  for (const tradition of database.frameworks.map(row => row.id)) {
    const rows = (await db.query('select tradition_id from public.search_reading_lab_examples($1,24,$2)', ['', tradition])).rows;
    check(`Tradition filter: ${tradition}`, rows.length > 0 && rows.every(row => row.tradition_id === tradition));
  }
  for (const text of ['the and of', '!!!', 'zxqvplmn fyhrrtzz']) check(`No-match lookup: ${text}`, (await db.query('select id from public.search_reading_lab_examples($1,8,null)', [text])).rows.length === 0);
  for (const [query, limit, tradition] of [[null, 8, null], ['x'.repeat(241), 8, null], ['', 0, null], ['', 25, null], ['', null, null], ['', 8, 'invented']]) await rejects('Invalid RPC argument rejected ' + checks.length, () => db.query('select id from public.search_reading_lab_examples($1,$2,$3)', [query, limit, tradition]), /at most 240|1 to 24|supported tradition/);
  await db.query('select id from public.search_reading_lab_examples($1,8,null)', ["'); DELETE FROM public.reading_lab_examples; --"]);
  check('SQL-looking query remains inert data', await count() === database.examples.length);
  check('Requested count is enforced', (await db.query("select id from public.search_reading_lab_examples('',1,null)")).rows.length === 1);
  const start = performance.now();
  for (let index = 0; index < 60; index++) {
    const rows = (await db.query('select id from public.search_reading_lab_examples($1,8,null)', [queries[index % queries.length].query])).rows;
    assert.ok(rows.length <= 8 && new Set(rows.map(row => row.id)).size === rows.length);
  }
  check('Sixty repeated RPC queries remain bounded and duplicate-free', true, { milliseconds: Math.round(performance.now() - start) });
  await db.exec('reset role');
  receipt = { ...baseReceipt, pass: true, completedAt: new Date().toISOString(), checks, queries, summary: { checks: checks.length, ...database.summary, sqlLookupCases: queries.length, scope: 'Public-source storage, access-control and authored lookup regression checks; not model evaluation or predictive accuracy.' } };
  console.log(JSON.stringify({ pass: true, ...receipt.summary, receipt: output }, null, 2));
} catch (error) {
  receipt = { ...baseReceipt, pass: false, completedAt: new Date().toISOString(), checks, queries, failure: { name: error.name, message: error.message, code: error.code ?? null } };
  console.error(JSON.stringify({ pass: false, checks: checks.length, failure: receipt.failure, receipt: output }, null, 2)); process.exitCode = 1;
} finally {
  if (output) { mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n'); }
  await db.close();
}
