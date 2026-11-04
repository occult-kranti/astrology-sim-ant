// Emits reviewable SQL for a selected public corpus. No remote connections.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {WORKBENCH_RAG_CHUNKS} from '../assets/js/core/data/workbench-rag-corpus.js';
const quote=value=>`E'${String(value).replaceAll('\\','\\\\').replaceAll("'","''")}'`;
const hash=value=>createHash('sha256').update(value).digest('hex');
const str=(value,max)=>typeof value==='string'&&value.length>0&&value.length<=max&&!value.includes('\0');
assert.ok(Array.isArray(WORKBENCH_RAG_CHUNKS)&&WORKBENCH_RAG_CHUNKS.length>0&&WORKBENCH_RAG_CHUNKS.length<=20000,'Expected a bounded, generated public source corpus.');
const seen=new Set(),statements=[];
for(const c of WORKBENCH_RAG_CHUNKS){
  assert.ok(/^WRAG-[0-9a-f]{12,64}$/.test(c.id)&&!seen.has(c.id),'Invalid/duplicate managed source ID.');seen.add(c.id);
  for(const[field,max]of Object.entries({sourceId:160,title:500,text:12000,category:80,file:2000,locator:2000,url:2000,readingDepth:3000,rightsScope:3000,sourceReadingDepth:3000,sourceFileSHA256:64}))assert.ok(field==='locator'&&c[field]===''||str(c[field],max),'Invalid public source field '+field+' in '+c.id);
  assert.ok(/^[a-z][a-z0-9-]{0,79}$/.test(c.category),'Invalid category.');
  assert.ok(!c.file.startsWith('/')&&!c.file.includes('\\')&&!c.file.split('/').some(part=>!part||part==='..'),'Source file must be a repository-relative path.');
  const relative=/^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+(?:#[A-Za-z0-9_.:-]+)?$/.test(c.url)&&!c.url.split('#')[0].split('/').includes('..');
  if(!relative){const url=new URL(c.url);assert.ok(['https:','http:'].includes(url.protocol)&&!url.username&&!url.password,'Invalid source URL.');}
  assert.ok(Array.isArray(c.tags)&&c.tags.length<=32&&c.tags.every(tag=>str(tag,120)),'Invalid source tags.');
  assert.ok(/^[0-9a-f]{64}$/.test(c.sourceFileSHA256),'Invalid source file hash.');
  assert.equal(c.textSHA256,hash(c.text),'Source text hash mismatch: '+c.id);
  const values=[c.id,c.sourceId,c.title,c.text,c.category].map(quote);
  values.push(`ARRAY[${c.tags.map(quote).join(',')}]::text[]`,...[c.file,c.locator,c.url,c.readingDepth,c.rightsScope,c.sourceReadingDepth,c.sourceFileSHA256,c.textSHA256].map(quote),'true');
  statements.push(`insert into public.workbench_reference_chunks (id,source_id,title,body,category,tags,file_path,locator,url,reading_depth,rights_scope,source_reading_depth,source_file_sha256,content_sha256,published) values (${values.join(',')}) on conflict (id) do update set source_id=excluded.source_id,title=excluded.title,body=excluded.body,category=excluded.category,tags=excluded.tags,file_path=excluded.file_path,locator=excluded.locator,url=excluded.url,reading_depth=excluded.reading_depth,rights_scope=excluded.rights_scope,source_reading_depth=excluded.source_reading_depth,source_file_sha256=excluded.source_file_sha256,content_sha256=excluded.content_sha256,published=excluded.published;`);
}
console.log('-- Generated public source chunks only. Inspect sources/rights before hosting.');
console.log('-- Current corpus: '+WORKBENCH_RAG_CHUNKS.length+' chunks; text manifest SHA256 '+hash(WORKBENCH_RAG_CHUNKS.map(c=>c.id+':'+c.textSHA256).join('\n'))+'.');
console.log('begin;');
console.log("-- Retire managed chunks removed by a later corpus build; do not delete data.\nupdate public.workbench_reference_chunks set published=false where id ~ '^WRAG-[0-9a-f]{12,64}$';");
console.log(statements.join('\n'));
console.log('commit;');
