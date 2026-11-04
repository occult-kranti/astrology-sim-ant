// Reproducible public-example export. No workspace crawling, user inputs, model
// training records, private charts, remote writes or full source books.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { READING_CASES, READING_SOURCES, READING_METHOD_NOTES } from '../assets/js/core/data/reading-cases.js';
import { READING_FRAMEWORKS, compareReadingCases } from '../assets/js/core/reading-lab.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const READING_DATABASE_PATH = 'assets/data/reading-lab-examples.json';
export const READING_MIGRATION_PATH = 'supabase/migrations/202611040002_reading_lab.sql';
export const READING_DATABASE_INPUTS = Object.freeze([
  'assets/js/core/aspects.js', 'assets/js/core/astro.js', 'assets/js/core/calendar-observatory.js',
  'assets/js/core/calendar.js', 'assets/js/core/chart-from-positions.js', 'assets/js/core/considerations.js',
  'assets/js/core/cultural-calendars.js', 'assets/js/core/data/dignities-data.js',
  'assets/js/core/data/jung-astrology.js', 'assets/js/core/data/muhurta-data.js',
  'assets/js/core/data/reading-cases.js', 'assets/js/core/data/sky-reading-sources.js',
  'assets/js/core/data/vedic-data.js', 'assets/js/core/data/vedic-remedies.js',
  'assets/js/core/data/worked-charts.js', 'assets/js/core/day-guidance.js', 'assets/js/core/dignities.js',
  'assets/js/core/instant-boundary.js', 'assets/js/core/jung.js', 'assets/js/core/muhurta.js',
  'assets/js/core/planetary-hours.js', 'assets/js/core/reading-lab.js', 'assets/js/core/sky-interpretation.js',
  'assets/js/core/time.js', 'assets/js/core/vedic.js', 'assets/js/lib/astronomy.js',
  'assets/vendor/adhan/Adhan.js', 'assets/vendor/adhan/Astronomical.js', 'assets/vendor/adhan/CalculationMethod.js',
  'assets/vendor/adhan/CalculationParameters.js', 'assets/vendor/adhan/Coordinates.js', 'assets/vendor/adhan/DateUtils.js',
  'assets/vendor/adhan/HighLatitudeRule.js', 'assets/vendor/adhan/Madhab.js', 'assets/vendor/adhan/MathUtils.js',
  'assets/vendor/adhan/PolarCircleResolution.js', 'assets/vendor/adhan/Prayer.js', 'assets/vendor/adhan/PrayerTimes.js',
  'assets/vendor/adhan/Qibla.js', 'assets/vendor/adhan/Rounding.js', 'assets/vendor/adhan/Shafaq.js',
  'assets/vendor/adhan/SolarCoordinates.js', 'assets/vendor/adhan/SolarTime.js', 'assets/vendor/adhan/SunnahTimes.js',
  'assets/vendor/adhan/TimeComponents.js', 'research/reading-lab/source-ledger.json',
  'scripts/build-reading-lab-database.mjs', READING_MIGRATION_PATH
]);
const sha = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const string = (value, max) => typeof value === 'string' && value.length > 0 && value.length <= max && !value.includes('\0');
const identifier = value => typeof value === 'string' && /^[a-z][a-z0-9-]{0,119}$/.test(value);
const sqlQuote = value => `E'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "''")}'`;

function summarizeResult(result) {
  // Only method/boundary context and status/limitations. Numeric checked fields
  // remain in fieldChecks; full planets, houses and chart objects are excluded.
  const contextKeys = ['inputKind', 'timeKnown', 'dateISO', 'timeZone', 'calendarBoundary', 'frame', 'workedChartKey', 'dateNote'];
  const context = Object.fromEntries(contextKeys.filter(key => Object.hasOwn(result.context, key)).map(key => [key, clone(result.context[key])]));
  return {
    kind: result.kind, context,
    frameworks: Object.entries(result.frameworks).map(([id, row]) => ({
      id, status: row.status, method: row.method,
      limitations: clone(row.limitations ?? []),
      ...(row.facts?.chart?.verification ? { verification: clone(row.facts.chart.verification), withheld: clone(row.facts.chart.withheld ?? []) } : {})
    })),
    warnings: clone(result.warnings ?? []), limits: clone(result.limits ?? []),
    scope: 'Status, boundaries and limitations only. Field checks retain their listed values; full calculated charts are not stored.'
  };
}

export function buildReadingLabDatabase() {
  const allowed = new Set(READING_DATABASE_INPUTS);
  const files = [...READING_DATABASE_INPUTS].sort().map(file => {
    assert.ok(!file.includes('model-lab') && !file.includes('private') && !file.startsWith('/'), 'Only explicit public reading dependencies');
    const bytes = readFileSync(resolve(ROOT, file));
    if (file.startsWith('assets/') && file.endsWith('.js')) {
      const imports = bytes.toString('utf8').matchAll(/(?:^|\n)\s*(?:import|export)\s+(?:[^;'"`]*?\s+from\s+)?['"]([^'"]+)['"]/g);
      for (const match of imports) if (match[1].startsWith('.')) {
        const target = relative(ROOT, resolve(ROOT, dirname(file), match[1])).replaceAll('\\', '/');
        assert.ok(allowed.has(target), `Add new engine dependency to explicit public hash list: ${target}`);
      }
    }
    return { file, bytes: bytes.length, sha256: sha(bytes) };
  });
  const frameworkIds = new Set(READING_FRAMEWORKS.map(row => row.id));
  const sourceIds = new Set();
  for (const source of READING_SOURCES) {
    assert.ok(identifier(source.id) && !sourceIds.has(source.id), 'Unique public source ID'); sourceIds.add(source.id);
    for (const field of ['title', 'url', 'locator', 'readingDepth', 'rights']) assert.ok(string(source[field], 5000), `Required source provenance: ${source.id}/${field}`);
    const url = new URL(source.url); assert.ok(url.protocol === 'https:' && !url.username && !url.password, 'Public HTTPS source without credentials');
  }
  const comparison = compareReadingCases();
  const examples = READING_CASES.map((sourceCase, index) => {
    const row = comparison.rows[index];
    assert.equal(sourceCase.id, row.caseId); assert.ok(identifier(row.caseId) && frameworkIds.has(row.traditionId));
    assert.ok(sourceCase.sourceIds.length > 0 && sourceCase.sourceIds.every(id => sourceIds.has(id)), 'All example source IDs resolve');
    // Registered authored examples may carry only these public, nonpersonal
    // inputs. A future expansion needs an explicit reviewed schema change.
    const publicInputKeys = ['dateISO', 'timeZone', 'planetLongitude', 'sunLongitude', 'moonLongitude', 'frame', 'workedChartKey'];
    assert.ok(Object.keys(sourceCase.input).every(key => publicInputKeys.includes(key)), 'Unexpected public example input; never export private profiles');
    const example = {
      id: row.caseId, title: row.title, traditionId: row.traditionId, methodId: row.methodId,
      kind: sourceCase.kind, sourceIds: [...row.sourceIds], input: clone(sourceCase.input),
      expected: clone(sourceCase.expected ?? []), evaluability: clone(row.evaluability),
      interpretation: clone(row.interpretation), status: row.status, fieldChecks: clone(row.checks),
      matchedFields: row.matched, totalReferenceFields: row.total, outcomeEvaluable: false,
      resultSummary: summarizeResult(row.result)
    };
    assert.ok(Buffer.byteLength(JSON.stringify(example)) < 60000, 'Bounded public example');
    assert.ok(row.total > 0 || row.status === 'not-numerically-evaluable', 'Unevaluable examples must not be labelled successful');
    return { ...example, contentSHA256: sha(JSON.stringify(example)) };
  });
  assert.ok(examples.length > 0 && examples.length <= 24 && new Set(examples.map(row => row.id)).size === examples.length, 'Bounded distinct public cases');
  const payload = {
    schemaVersion: 1, kind: 'public-reading-lab-examples', datasetId: 'reading-lab-public-v1',
    publicationScope: 'Authored public source examples and original commentary; no private profiles, chat logs, model training data, sealed model tests or full books.',
    sourceFiles: files, sourceGraphSHA256: sha(JSON.stringify(files)),
    runtimeNote: 'Civil labels use the supported JavaScript Intl calendar implementation. Check mode compares actual output as well as source hashes; runtime-specific label changes require review.',
    frameworks: clone(READING_FRAMEWORKS), sources: clone(READING_SOURCES), methodNotes: clone(READING_METHOD_NOTES),
    summary: {
      examples: examples.length, sources: READING_SOURCES.length, traditions: frameworkIds.size,
      casesWithReferenceFields: comparison.casesWithReferenceFields,
      unevaluableCases: examples.filter(row => row.totalReferenceFields === 0).length,
      referenceFields: comparison.referenceFields, matchedFields: comparison.matchedFields,
      outcomeEvaluable: false, scope: 'Matching listed source fields is not predictive accuracy or full-chart validation.'
    }, examples
  };
  const database = { ...payload, contentSHA256: sha(JSON.stringify(payload)) };
  assert.ok(Buffer.byteLength(JSON.stringify(database)) < 1000000, 'Public example database must stay under 1 MB');
  return database;
}

export function readingLabSeedSQL(database = buildReadingLabDatabase()) {
  const statements = database.examples.map(example => {
    const { resultSummary, fieldChecks, contentSHA256, ...caseData } = example;
    const sources = example.sourceIds.map(id => database.sources.find(source => source.id === id));
    const values = [example.id, database.datasetId, example.traditionId, example.title, example.methodId ?? '', example.kind, example.status].map(sqlQuote);
    values.push(`ARRAY[${example.sourceIds.map(sqlQuote).join(',')}]::text[]`);
    values.push(...[sources, caseData, fieldChecks, resultSummary].map(value => `${sqlQuote(JSON.stringify(value))}::jsonb`));
    values.push(example.matchedFields, example.totalReferenceFields, 'false', sqlQuote(contentSHA256), sqlQuote(database.sourceGraphSHA256), 'true');
    return `insert into public.reading_lab_examples (id,dataset_id,tradition_id,title,method_id,kind,status,source_ids,sources,case_data,field_checks,result_summary,matched_fields,total_reference_fields,outcome_evaluable,content_sha256,source_graph_sha256,published) values (${values.join(',')}) on conflict (id) do update set dataset_id=excluded.dataset_id,tradition_id=excluded.tradition_id,title=excluded.title,method_id=excluded.method_id,kind=excluded.kind,status=excluded.status,source_ids=excluded.source_ids,sources=excluded.sources,case_data=excluded.case_data,field_checks=excluded.field_checks,result_summary=excluded.result_summary,matched_fields=excluded.matched_fields,total_reference_fields=excluded.total_reference_fields,outcome_evaluable=excluded.outcome_evaluable,content_sha256=excluded.content_sha256,source_graph_sha256=excluded.source_graph_sha256,published=excluded.published;`;
  });
  return `-- Public reviewed reading examples only. No hosted deployment is performed.\n-- Dataset SHA256 ${database.contentSHA256}\nbegin;\nupdate public.reading_lab_examples set published=false where dataset_id='reading-lab-public-v1';\n${statements.join('\n')}\ncommit;\n`;
}

function main(args) {
  let check = false, sqlDirectory = null;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--check' && !check) check = true;
    else if (args[index] === '--sql-dir' && !sqlDirectory && args[index + 1] && !args[index + 1].startsWith('--')) sqlDirectory = resolve(args[++index]);
    else throw new Error('Use --check and/or --sql-dir /path/to/reviewable/artifacts.');
  }
  const database = buildReadingLabDatabase(), bytes = JSON.stringify(database, null, 2) + '\n';
  assert.ok(Buffer.byteLength(bytes) < 1000000, 'Formatted public bundle below 1 MB');
  const destination = resolve(ROOT, READING_DATABASE_PATH);
  if (check) assert.equal(readFileSync(destination, 'utf8'), bytes, 'Stale public reading database; regenerate after reviewing source changes');
  else { mkdirSync(dirname(destination), { recursive: true }); writeFileSync(destination, bytes); }
  if (sqlDirectory) {
    mkdirSync(sqlDirectory, { recursive: true });
    const migration = readFileSync(resolve(ROOT, READING_MIGRATION_PATH), 'utf8'), seed = readingLabSeedSQL(database);
    writeFileSync(resolve(sqlDirectory, '001-reading-lab-schema.sql'), migration);
    writeFileSync(resolve(sqlDirectory, '002-reading-lab-public-examples.sql'), seed);
    writeFileSync(resolve(sqlDirectory, 'reading-lab-examples.json'), bytes);
    writeFileSync(resolve(sqlDirectory, 'manifest.json'), JSON.stringify({
      schemaVersion: 1, hostedDeployment: false, privateDataIncluded: false,
      databaseSHA256: database.contentSHA256, sourceGraphSHA256: database.sourceGraphSHA256,
      files: [{ file: '001-reading-lab-schema.sql', sha256: sha(migration) }, { file: '002-reading-lab-public-examples.sql', sha256: sha(seed) }, { file: 'reading-lab-examples.json', sha256: sha(bytes) }], summary: database.summary
    }, null, 2) + '\n');
    writeFileSync(resolve(sqlDirectory, 'README.md'), '# Optional public Reading Lab database\n\nThese are reviewable local artifacts. No Supabase project was connected or changed. Apply the schema, then the public-example seed with an authorized administrative SQL connection if you choose to host it. Never put a service-role key in browser code.\n\nThe table permits anonymous/authenticated reads of published examples and denies client writes. The bounded invoker RPC is `public.search_reading_lab_examples(query_text, match_count, tradition_filter)`. Empty queries browse published examples. No private charts, full books, model training examples or sealed model-evaluation questions are included. Matching fields is not predictive accuracy.\n');
  }
  console.log(JSON.stringify({ mode: check ? 'check' : 'generate', path: READING_DATABASE_PATH, bytes: Buffer.byteLength(bytes), contentSHA256: database.contentSHA256, ...database.summary, sqlDirectory, hostedDeployment: false }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
