// Emit a reviewable seed file; never connects to or writes a hosted database.
import { createHash } from 'node:crypto';
import { SKY_READING_CHUNKS } from '../assets/js/core/data/sky-reading-sources.js';
const quote=value=>`'${String(value).replaceAll("'","''")}'`;
console.log('-- Curated source paraphrases only. Review edition rights before publishing.\nbegin;');
for(const c of SKY_READING_CHUNKS){const values=[c.id,c.sourceId,c.title,c.text,c.locator,c.url,c.claimType,c.readingStatus,c.rights].map(quote);values.push(`ARRAY[${c.lensIds.map(quote).join(',')}]::text[]`,quote(createHash('sha256').update(c.text).digest('hex')),'true');
  console.log(`insert into public.sky_reference_chunks (id,source_id,title,body,locator,url,claim_type,reading_status,rights,lens_ids,content_sha256,published) values (${values.join(',')}) on conflict (id) do update set source_id=excluded.source_id,title=excluded.title,body=excluded.body,locator=excluded.locator,url=excluded.url,claim_type=excluded.claim_type,reading_status=excluded.reading_status,rights=excluded.rights,lens_ids=excluded.lens_ids,content_sha256=excluded.content_sha256,published=excluded.published;`);}
console.log('commit;');
