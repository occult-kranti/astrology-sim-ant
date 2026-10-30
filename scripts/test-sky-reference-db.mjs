// Optional real PostgreSQL-in-WASM migration/RLS verification; not hosted Supabase evidence.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { retrieveSkySources } from '../assets/js/core/sky-source-retrieval.js';
import { SKY_READING_CHUNKS } from '../assets/js/core/data/sky-reading-sources.js';
if(!process.env.PGLITE_PKG)throw new Error('Set PGLITE_PKG to the installed @electric-sql/pglite module; see docs/2026-10-sky-ai-rag.md.');
const {PGlite}=await import(pathToFileURL(process.env.PGLITE_PKG).href);const db=new PGlite();
const migrationPath=new URL('../supabase/migrations/202610300001_sky_reference.sql',import.meta.url),migration=readFileSync(migrationPath,'utf8');
const seed=execFileSync(process.execPath,[new URL('./export-sky-reference-sql.mjs',import.meta.url).pathname],{encoding:'utf8'});
const checks=[];function check(label,condition){assert.ok(condition,label);checks.push({label,pass:true});}
const evaluation=[];
try{
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(migration);await db.exec(seed);await db.exec(migration); // Idempotent policy/function replacement.
  check('Migration and curated seed execute in PostgreSQL',Number((await db.query('select count(*) as n from public.sky_reference_chunks')).rows[0].n)===SKY_READING_CHUNKS.length);
  await db.exec("insert into public.sky_reference_chunks select 'INTERNAL-HIDDEN',source_id,title,body,locator,url,claim_type,reading_status,rights,lens_ids,content_sha256,false from public.sky_reference_chunks limit 1");
  for(const role of ['anon','authenticated']){
    await db.exec(`set role ${role}`);
    check(`${role} can read only published reference rows`,Number((await db.query('select count(*) as n from public.sky_reference_chunks')).rows[0].n)===SKY_READING_CHUNKS.length);
    check(`${role} cannot select the unpublished fixture`,(await db.query("select id from public.sky_reference_chunks where id='INTERNAL-HIDDEN'")).rows.length===0);
    for(const[verb,sql]of [['insert',"insert into public.sky_reference_chunks(id) values ('BAD')"],['update',"update public.sky_reference_chunks set published=false"],['delete','delete from public.sky_reference_chunks']]){await assert.rejects(()=>db.exec(sql),/permission denied/);checks.push({label:`${role} ${verb} denied`,pass:true});}
    check(`${role} can call the invoker retrieval function`,(await db.query("select * from public.search_sky_reference('cazimi', 3)")).rows.length>0);
    await assert.rejects(()=>db.query("select * from public.search_sky_reference('Moon', 9)"),/1 to 8/);checks.push({label:`${role} excessive result count rejected`,pass:true});
    await db.exec('reset role');
  }
  await db.exec('set role anon');
  const cases=[['same-sign combustion cazimi','SKY-CH-LILLY-SOLAR'],['planetary hours sunrise polar','SKY-CH-AGRIPPA-HOURS'],['tithi worked example Moon Sun','SKY-CH-RAO-TITHI'],['nakshatra ayanamsha sidereal tropical','SKY-CH-RAO-NAKSHATRA'],['calendar mismatch dependency','SKY-CH-DEPENDENCIES'],['astrolabe circular projection 3D','SKY-CH-ART']];
  for(const[query,expected]of cases){const local=retrieveSkySources(query,{limit:3}).rows.map(r=>r.id);const sql=(await db.query('select id from public.search_sky_reference($1,3)',[query])).rows.map(r=>r.id);evaluation.push({query,expected,localTop3:local,postgresTop3:sql,localHit:local.includes(expected),postgresHit:sql.includes(expected)});}
  check('Empty retrieval returns no fabricated source',(await db.query("select * from public.search_sky_reference('', 3)")).rows.length===0);
  check('Unsupported retrieval returns no fabricated source',(await db.query("select * from public.search_sky_reference('quantum pineapple spaceship', 3)")).rows.length===0);
  await db.query('select * from public.search_sky_reference($1,3)',["'); DELETE FROM public.sky_reference_chunks; --"]);
  check('Query text is parameterized data, not SQL',Number((await db.query('select count(*) as n from public.sky_reference_chunks')).rows[0].n)===SKY_READING_CHUNKS.length);
  await db.exec('reset role');
  const result={schemaVersion:1,pass:true,engine:'@electric-sql/pglite 0.5.13; PostgreSQL in WASM',hostedSupabase:false,remoteCredentialsUsed:false,migrationSHA256:createHash('sha256').update(migration).digest('hex'),seedSHA256:createHash('sha256').update(seed).digest('hex'),checks,evaluation,summary:{localHits:evaluation.filter(x=>x.localHit).length,postgresHits:evaluation.filter(x=>x.postgresHit).length,cases:evaluation.length,scope:'Six authored regression questions, not held-out evaluation. BM25 uses overlap; SQL websearch requires query terms unless OR is requested. No model-generated answers assessed.'}};
  if(process.env.SKY_DB_RECEIPT){mkdirSync(new URL('.',pathToFileURL(process.env.SKY_DB_RECEIPT)),{recursive:true});writeFileSync(process.env.SKY_DB_RECEIPT,JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify({pass:result.pass,checks:checks.length,...result.summary},null,2));
}finally{await db.close();}
