// Actual PostgreSQL-in-WASM/RLS and browser-client contract tests.
// Public generated sources plus synthetic fixtures; no hosted database accessed.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {WORKBENCH_RAG_CHUNKS as chunks,WORKBENCH_RAG_MANIFEST as manifest} from '../assets/js/core/data/workbench-rag-corpus.js';
import {normalizeWorkbenchSupabase,searchWorkbenchSupabase} from '../assets/js/app/workbench-supabase.js';
if(!process.env.PGLITE_PKG)throw new Error('Set PGLITE_PKG to pinned @electric-sql/pglite 0.5.13 dist/index.js; see docs/2026-11-workbench-supabase.md.');
const {PGlite}=await import(pathToFileURL(resolve(process.env.PGLITE_PKG)).href);
const db=new PGlite(),checks=[],evaluation=[],startedAt=new Date().toISOString();
const sha=value=>createHash('sha256').update(value).digest('hex');
const migration=readFileSync(new URL('../supabase/migrations/202611040001_workbench_rag.sql',import.meta.url),'utf8');
const client=readFileSync(new URL('../assets/js/app/workbench-supabase.js',import.meta.url),'utf8');
const driverSHA256=sha(readFileSync(new URL(import.meta.url)));
const exporterSHA256=sha(readFileSync(new URL('./export-workbench-rag-sql.mjs',import.meta.url)));
const seed=execFileSync(process.execPath,[new URL('./export-workbench-rag-sql.mjs',import.meta.url).pathname],{encoding:'utf8',maxBuffer:32*1024*1024});
const output=process.env.WORKBENCH_DB_RECEIPT?resolve(process.env.WORKBENCH_DB_RECEIPT):null;
if(output&&existsSync(output))throw new Error('Use a fresh WORKBENCH_DB_RECEIPT path; earlier evidence is retained.');
function check(label,condition,detail){assert.ok(condition,label);checks.push({label,pass:true,...(detail===undefined?{}:{detail})});}
async function rejects(label,action,pattern){await assert.rejects(action,pattern);checks.push({label,pass:true});}
const count=async()=>Number((await db.query('select count(*) as n from public.workbench_reference_chunks')).rows[0].n);
const cfg={url:'https://test-project.supabase.co',publishableKey:'sb_publishable_syntheticKey12345'};
const sample=chunks[0];
const sampleRow={id:sample.id,source_id:sample.sourceId,title:sample.title,body:sample.text,category:sample.category,tags:sample.tags,file_path:sample.file,locator:sample.locator,url:sample.url,reading_depth:sample.readingDepth,rights_scope:sample.rightsScope,source_reading_depth:sample.sourceReadingDepth,source_file_sha256:sample.sourceFileSHA256,content_sha256:sample.textSHA256,rank:0.25};
const jsonResponse=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
let result;
try{
  await db.exec('create role anon;create role authenticated;create role service_role bypassrls;');
  await db.exec(readFileSync(new URL('../supabase/migrations/202610300001_sky_reference.sql',import.meta.url),'utf8'));
  await db.exec(migration);await db.exec(seed);await db.exec(migration);await db.exec(seed);
  check('Migration and seed are repeatable beside the retained sky schema',await count()===chunks.length);
  const stored=(await db.query('select id,body,title,file_path,locator,url,tags,content_sha256,source_reading_depth,source_file_sha256,published from public.workbench_reference_chunks order by id')).rows;
  const expected=[...chunks].sort((a,b)=>a.id.localeCompare(b.id));
  for(let i=0;i<expected.length;i++){
    const a=expected[i],b=stored[i];
    assert.deepEqual(b,{id:a.id,body:a.text,title:a.title,file_path:a.file,locator:a.locator,url:a.url,tags:a.tags,content_sha256:a.textSHA256,source_reading_depth:a.sourceReadingDepth,source_file_sha256:a.sourceFileSHA256,published:true});
  }
  check('Every source body, quote, path, locator, tag and provenance hash round-trips exactly',true,{chunks:chunks.length});
  check('All ten declared categories are present',(await db.query('select distinct category from public.workbench_reference_chunks')).rows.length===manifest.categories.length);
  check('Published source table has RLS enabled',(await db.query("select relrowsecurity from pg_class where oid='public.workbench_reference_chunks'::regclass")).rows[0].relrowsecurity===true);
  const proc=(await db.query("select prosecdef,proconfig from pg_proc where oid='public.search_workbench_reference(text,integer,text)'::regprocedure")).rows[0];
  check('Retrieval uses invoker privileges and a fixed empty search path',proc.prosecdef===false&&proc.proconfig.some(value=>value==='search_path=""'));
  check('Transformation helpers are outside the public REST schema',(await db.query("select count(*) as n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('workbench_rag_tag_text','workbench_rag_query')")).rows[0].n===0);
  check('Private query helper also bounds direct input',(await db.query("select numnode(workbench_private.workbench_rag_query($1,'english')) as n",['x'.repeat(1001)])).rows[0].n===0);
  // Two retired/unpublished controls have the same searchable body as real rows.
  const copyFixture=id=>db.query('insert into public.workbench_reference_chunks(id,source_id,title,body,category,tags,file_path,locator,url,reading_depth,rights_scope,source_reading_depth,source_file_sha256,content_sha256,published) select $1,source_id,title,body,category,tags,file_path,locator,url,reading_depth,rights_scope,source_reading_depth,source_file_sha256,content_sha256,true from public.workbench_reference_chunks limit 1',[id]);
  await copyFixture('WRAG-0000000000000000');await db.exec(seed);
  check('Reseeding retires removed managed chunks without deleting them',(await db.query("select published from public.workbench_reference_chunks where id='WRAG-0000000000000000'")).rows[0].published===false);
  await copyFixture('INTERNAL-HIDDEN');await db.exec("update public.workbench_reference_chunks set published=false where id='INTERNAL-HIDDEN'");
  for(const role of ['anon','authenticated']){
    await db.exec(`set role ${role}`);
    check(`${role} sees exactly the published generated corpus`,await count()===chunks.length);
    check(`${role} cannot select hidden or retired controls`,(await db.query("select id from public.workbench_reference_chunks where id in ('INTERNAL-HIDDEN','WRAG-0000000000000000')")).rows.length===0);
    for(const[verb,sql]of [['insert',"insert into public.workbench_reference_chunks(id) values ('BAD')"],['update','update public.workbench_reference_chunks set published=false'],['delete','delete from public.workbench_reference_chunks'],['truncate','truncate public.workbench_reference_chunks']])await rejects(`${role} ${verb} denied`,()=>db.exec(sql),/permission denied/);
    const rows=(await db.query('select * from public.search_workbench_reference($1,12,null)',['chart'])).rows;
    check(`${role} can call bounded published-only retrieval`,rows.length>0&&rows.length<=12&&!rows.some(row=>row.id==='INTERNAL-HIDDEN'||row.id==='WRAG-0000000000000000'));
    check(`${role} lexical rank is finite, nonnegative and descending`,rows.every((row,index)=>Number.isFinite(row.rank)&&row.rank>=0&&(!index||rows[index-1].rank>=row.rank)));
    for(const[query,limit,category,pattern]of [[null,6,null,/at most 1000/],['x'.repeat(1001),6,null,/at most 1000/],['chart',null,null,/1 to 12/],['chart',0,null,/1 to 12/],['chart',13,null,/1 to 12/],['chart',6,'Bad Category',/lowercase identifier/],['chart',6,"x';delete",/lowercase identifier/]])await rejects(`${role} rejects invalid RPC arguments ${checks.length}`,()=>db.query('select * from public.search_workbench_reference($1,$2,$3)',[query,limit,category]),pattern);
    await db.exec('reset role');
  }
  await db.exec('set role service_role');
  await copyFixture('SERVICE-WRITE-CONTROL');await db.exec("update public.workbench_reference_chunks set published=false where id='SERVICE-WRITE-CONTROL'");await db.exec("delete from public.workbench_reference_chunks where id='SERVICE-WRITE-CONTROL'");
  check('Service role can deliberately curate public sources',true);
  check('RPC still excludes unpublished controls for a bypass-RLS service role',(await db.query("select id from public.search_workbench_reference('chart',12,null)")).rows.every(row=>!['INTERNAL-HIDDEN','WRAG-0000000000000000'].includes(row.id)));
  await db.exec('reset role;set role anon');
  for(const query of ['','   ','the a and','!!!','zxqvplmn fyhrrtzz'])check('Empty/unsupported query returns no invented source: '+JSON.stringify(query),(await db.query('select * from public.search_workbench_reference($1,6,null)',[query])).rows.length===0);
  const partialNoise=(await db.query("select body,title from public.search_workbench_reference('zzyzx marmalade penguin',6,null)")).rows;
  check('Broad OR retrieval can return genuine Penguin publisher matches for a partly unsupported query',partialNoise.length>0&&partialNoise.every(row=>/penguin/i.test(row.body+' '+row.title)));
  check('Unknown well-formed category returns no sources',(await db.query("select * from public.search_workbench_reference('chart',6,'not-in-this-corpus')")).rows.length===0);
  for(const category of manifest.categories){const rows=(await db.query('select * from public.search_workbench_reference($1,12,$2)',['chart calendar source astrology method',category])).rows;check('Category filter retains only '+category,rows.every(row=>row.category===category));}
  const injection="'); DELETE FROM public.workbench_reference_chunks; --";
  await db.query('select * from public.search_workbench_reference($1,6,null)',[injection]);check('SQL-like query remains data and cannot alter the corpus',await count()===chunks.length);
  const cases=[
    ['cazimi combustion Lilly',['assets/js/core/data/sky-reading-sources.js']],
    ['Lahiri sidereal tropical zodiac',['pages/learn.html','assets/js/core/data/sky-reading-sources.js']],
    ['Hebrew calendar sunset civil midnight',['docs/2026-10-calendar-methods.md']],
    ['Jung feeling individuation',['assets/js/core/data/glossary.js','assets/js/core/data/jung-astrology.js']],
    ['solar eclipse local visibility',['docs/2026-11-orbital-space-methods.md','assets/js/core/data/sky-reading-sources.js']],
    ['connect MCP server chatbot',['pages/mcp.html']],
    ['Agrippa planetary hours',['assets/js/core/data/sky-reading-sources.js']],
    ['Yoga Sutras editions',['pages/yoga/sources.html','pages/yoga/index.html']],
    ['Newton 2060',['assets/js/core/data/newton-chronology-sources.js']],
    ['zodiacal releasing Spirit Fortune',['pages/timelords.html']],
  ];
  for(const[query,expectedFiles]of cases){const rows=(await db.query('select * from public.search_workbench_reference($1,5,null)',[query])).rows;evaluation.push({query,expectedFiles,ids:rows.map(row=>row.id),files:rows.map(row=>row.file_path),hit:rows.some(row=>expectedFiles.includes(row.file_path))});}
  const begin=performance.now();
  for(let i=0;i<50;i++){const query=cases[i%cases.length][0];const rows=(await db.query('select id from public.search_workbench_reference($1,12,null)',[query])).rows;assert.ok(rows.length<=12&&new Set(rows.map(row=>row.id)).size===rows.length);}
  check('Fifty repeated source queries remain bounded and duplicate-free',true,{milliseconds:Math.round(performance.now()-begin)});
  await db.exec('reset role');

  // Browser transport tests use synthetic keys and injected fetch; no network I/O.
  check('HTTPS project URL normalizes to the exact RPC',normalizeWorkbenchSupabase(cfg).rpcURL==='https://test-project.supabase.co/rest/v1/rpc/search_workbench_reference');
  for(const url of ['http://localhost:54321','http://127.0.0.1:54321','http://[::1]:54321'])check('Explicit local Supabase URL is accepted: '+url,normalizeWorkbenchSupabase({...cfg,url}).url.startsWith('http:'));
  for(const url of ['http://example.com','https://user:pass@example.com','https://example.com/path','https://example.com/?key=x','https://example.com/#key','javascript:alert(1)','https://localhost.evil.invalid/a','http://0.0.0.0:54321']){
    assert.throws(()=>normalizeWorkbenchSupabase({...cfg,url}));checks.push({label:'Unsafe project URL rejected: '+url,pass:true});
  }
  const jwt=role=>['e30',Buffer.from(JSON.stringify({role})).toString('base64url'),'synthetic'].join('.');
  check('Legacy anon key accepted after role inspection',normalizeWorkbenchSupabase({...cfg,publishableKey:jwt('anon')}).publishableKey===jwt('anon'));
  for(const key of ['sb_secret_syntheticOnly',jwt('service_role'),jwt('authenticated'),'arbitrary-key','']){assert.throws(()=>normalizeWorkbenchSupabase({...cfg,publishableKey:key}),/key/i);checks.push({label:'Nonpublishable synthetic key rejected '+checks.length,pass:true});}
  let request;
  const response=await searchWorkbenchSupabase(cfg,'Moon aspects',{fetchImpl:async(url,options)=>{request={url,options};return jsonResponse([sampleRow]);}});
  check('Explicit source call sends only query, result count and category',JSON.stringify(JSON.parse(request.options.body))===JSON.stringify({query_text:'Moon aspects',match_count:6,category_filter:null}));
  check('Request omits browser credentials, cache, redirects and referrer',request.options.credentials==='omit'&&request.options.cache==='no-store'&&request.options.redirect==='error'&&request.options.referrerPolicy==='no-referrer');
  check('Publishable key stays in request header, not URL/body/results',request.options.headers.apikey===cfg.publishableKey&&!request.url.includes(cfg.publishableKey)&&!request.options.body.includes(cfg.publishableKey)&&!JSON.stringify(response).includes(cfg.publishableKey));
  check('Returned source fields and content hash match the public corpus',response.rows.length===1&&response.rows[0].text===sample.text&&response.rows[0].textSHA256===sample.textSHA256&&response.rows[0].sourceReadingDepth===sample.sourceReadingDepth);
  check('Relative source link remains a project-relative link',response.rows[0].url===sample.url);
  let calls=0;const empty=await searchWorkbenchSupabase(cfg,'  ',{fetchImpl:async()=>{calls++;throw Error('must not call');}});check('Empty query performs no network call',calls===0&&empty.rows.length===0);
  for(const[query,opts]of [[null,{}],['x'.repeat(1001),{}],['Moon',{limit:13}],['Moon',{limit:0}],['Moon',{category:'Bad category'}],['Moon',{timeoutMs:0}]])await rejects('Invalid browser arguments rejected before request '+checks.length,()=>searchWorkbenchSupabase(cfg,query,{...opts,fetchImpl:async()=>{throw Error('unexpected network');}}),/invalid|1000|1 to 12|lowercase|Timeout/);
  await rejects('HTTP errors are surfaced without echoing response secrets',()=>searchWorkbenchSupabase(cfg,'Moon',{fetchImpl:async()=>jsonResponse({message:'synthetic secret should not appear'},401)}),/HTTP 401/);
  await rejects('Malformed response is rejected',()=>searchWorkbenchSupabase(cfg,'Moon',{fetchImpl:async()=>new Response('not-json')}),/malformed/);
  await rejects('Excessive rows are rejected',()=>searchWorkbenchSupabase(cfg,'Moon',{limit:1,fetchImpl:async()=>jsonResponse([sampleRow,sampleRow])}),/excessive/);
  await rejects('Duplicate source IDs are rejected',()=>searchWorkbenchSupabase(cfg,'Moon',{fetchImpl:async()=>jsonResponse([sampleRow,sampleRow])}),/duplicate/);
  await rejects('Content hash mismatch is rejected',()=>searchWorkbenchSupabase(cfg,'Moon',{fetchImpl:async()=>jsonResponse([{...sampleRow,body:'tampered source text'}])}),/hash/);
  for(const patch of [{url:'javascript:alert(1)'},{url:'../private.json'},{rank:-1},{tags:['x'.repeat(121)]},{source_file_sha256:'invalid'}])await rejects('Malformed source provenance rejected '+checks.length,()=>searchWorkbenchSupabase(cfg,'Moon',{fetchImpl:async()=>jsonResponse([{...sampleRow,...patch}])}),/invalid|malformed/);
  await rejects('Oversized response is rejected',()=>searchWorkbenchSupabase(cfg,'Moon',{fetchImpl:async()=>new Response('x'.repeat(1_000_001))}),/size limit/);
  const cancelled=new AbortController();cancelled.abort();await rejects('Pre-aborted request sends nothing',()=>searchWorkbenchSupabase(cfg,'Moon',{signal:cancelled.signal,fetchImpl:async()=>{throw Error('unexpected network');}}),/cancelled/);
  await rejects('Transport timeout cancels the in-flight request',()=>searchWorkbenchSupabase(cfg,'Moon',{timeoutMs:5,fetchImpl:async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}))}),/timed out/);
  const late=new AbortController();await rejects('Cancellation is honored even if a transport ignores abort',()=>searchWorkbenchSupabase(cfg,'Moon',{signal:late.signal,fetchImpl:async()=>{late.abort(new DOMException('Cancelled by test.','AbortError'));return jsonResponse([sampleRow]);}}),/Cancelled/);
  check('Client contains no storage API, chart reader or automatic fallback',!/(?:localStorage|sessionStorage|indexedDB|castChart|birthReading|fallback)/.test(client));
  result={schemaVersion:1,pass:true,startedAt,completedAt:new Date().toISOString(),engine:'@electric-sql/pglite 0.5.13; PostgreSQL in WASM',hostedSupabase:false,remoteCredentialsUsed:false,networkCalls:0,driverSHA256,exporterSHA256,migrationSHA256:sha(migration),seedSHA256:sha(seed),clientSHA256:sha(client),corpusSHA256:manifest.corpusSHA256,chunks:chunks.length,checks,evaluation,summary:{checks:checks.length,top5SourceFileHits:evaluation.filter(row=>row.hit).length,cases:evaluation.length,scope:'Ten authored source-file regression questions, not held-out relevance evaluation. PostgreSQL English/simple lexical OR ranking; no vector search, model training or generated-answer quality assessed.'}};
  if(output){mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify({pass:result.pass,...result.summary,receipt:output},null,2));
}catch(error){
  result={schemaVersion:1,pass:false,startedAt,completedAt:new Date().toISOString(),hostedSupabase:false,remoteCredentialsUsed:false,networkCalls:0,driverSHA256,exporterSHA256,migrationSHA256:sha(migration),seedSHA256:sha(seed),clientSHA256:sha(client),corpusSHA256:manifest.corpusSHA256,checks,evaluation,failure:{name:error.name,message:error.message,code:error.code||null}};
  if(output){mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(result,null,2)+'\n');}
  console.error(JSON.stringify({pass:false,checks:checks.length,failure:result.failure,receipt:output},null,2));process.exitCode=1;
}finally{await db.close();}
