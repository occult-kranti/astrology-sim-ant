import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { OBSERVATORY_STANDARDS, SPECIALIST_PROFILES, STUDY_RECORD_SCHEMA, validateStandardsRecord, createStudyICalendar, foldICalLine, SQLITE_SCHEMA, POSTGRES_SCHEMA, SUPABASE_SCHEMA } from '../../assets/js/core/data/observatory-standards.js';

export async function run(){
 let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
 const good={schemaVersion:1,atUTC:'2026-10-29T12:00:00.000Z',timeZone:'Europe/London',observer:{latitude:51.5074,longitude:-.1278},method:'observatory-comparison-v1',sourceIds:['OBS-ASTRONOMY','OBS-CALENDAR']};
 check(validateStandardsRecord(good).valid,'canonical record validates');
 for(const value of [null,[],{}, {...good,atUTC:'2026-02-30T12:00:00Z'}, {...good,atUTC:'2026-10-29T12:00:00'}, {...good,atUTC:'2026-10-29'}, {...good,timeZone:'Never/Here'}, {...good,observer:{latitude:91,longitude:0}}, {...good,observer:{latitude:0,longitude:Infinity}}, {...good,observer:{latitude:0,longitude:0,secret:'not-allowed'}}, {...good,sourceIds:[]}, {...good,sourceIds:['']}, {...good,unknown:true}, {...good,method:'invented'}, {...good,schemaVersion:2}])check(!validateStandardsRecord(value).valid,'invalid record rejected');
 for(const key of STUDY_RECORD_SCHEMA.required){const missing={...good};delete missing[key];check(!validateStandardsRecord(missing).valid,`missing ${key} rejected`);}
 const stamp='2026-10-30T16:45:12Z';
 for(const atUTC of ['2026-02-30T12:00:00Z','2026-10-29T12:00:00','2026-10-29','2026-10-29T25:00:00Z','2026-10-29T12:00:60Z']){assert.throws(()=>createStudyICalendar({atUTC,generatedAtUTC:stamp}));checks++;}
 assert.throws(()=>createStudyICalendar({atUTC:good.atUTC}));checks++;
 assert.throws(()=>createStudyICalendar({atUTC:good.atUTC,generatedAtUTC:'2026-02-30T12:00:00Z'}));checks++;
 for(const durationMinutes of[0,1441,1.5,Infinity]){assert.throws(()=>createStudyICalendar({atUTC:good.atUTC,generatedAtUTC:stamp,durationMinutes}));checks++;}
 const data={atUTC:'2026-10-29T12:00:00+05:30',generatedAtUTC:stamp,title:'A title, with; special\\characters\nand nāmā'.repeat(9),description:'Never\r\nBEGIN:VEVENT\r\nSUMMARY:injected',uid:'study-safe@example.test'};
 const ics=createStudyICalendar(data);
 check(ics.includes('DTSTART:20261029T063000Z\r\n'),'offset normalized to UTC');
 check(ics.includes('DTEND:20261029T070000Z\r\n'),'thirty minute endpoint');
 check(ics.includes('DTSTAMP:20261030T164512Z\r\n'),'explicit generation time retained');
 check(ics.endsWith('\r\n'),'terminal CRLF');
 check(!/(^|[^\r])\n/.test(ics),'no bare LF');
 check(ics.split('\r\n').filter(x=>x==='BEGIN:VEVENT').length===1,'text cannot inject another event');
 check(ics.includes('\\,')&&ics.includes('\\;')&&ics.includes('\\\\')&&ics.includes('\\n'),'text escapes remain explicit');
 for(const line of ics.split('\r\n'))check(new TextEncoder().encode(line).length<=75,'UTF8 folded physical lines <=75octets');
 const unicode='COMMENT:'+('界é🙂'.repeat(90));const folded=foldICalLine(unicode);check(folded.replace(/\r\n /g,'')===unicode,'line unfolding preserves complete Unicode code points');
 const oldTZ=process.env.TZ;try{process.env.TZ='UTC';const utc=createStudyICalendar(data);process.env.TZ='Pacific/Honolulu';check(createStudyICalendar(data)===utc,'ICS output independent of host TZ');}finally{if(oldTZ===undefined)delete process.env.TZ;else process.env.TZ=oldTZ;}
 check(OBSERVATORY_STANDARDS.length===16,'sixteen curated standards');check(new Set(OBSERVATORY_STANDARDS.map(x=>x.id)).size===16,'unique standard IDs');
 for(const item of OBSERVATORY_STANDARDS){check(item.status&&item.implementation&&item.license&&item.limits&&item.example,'standard states actual status/implementation/license/limits/example');check(item.sources.length>0&&item.sources.every(x=>/^https:\/\//.test(x.url)||!/^(?:\/|\.\.)/.test(x.url)),'source references are explicit safe HTTPS or project-relative');}
 check(SPECIALIST_PROFILES.filter(x=>x.kind==='calendar').length===13,'thirteen implemented civil family skills');check(SPECIALIST_PROFILES.filter(x=>x.kind==='book').length===45,'forty-five named book/source profiles');check(new Set(SPECIALIST_PROFILES.map(x=>x.id)).size===58,'unique specialist IDs');
 for(const profile of SPECIALIST_PROFILES){
  const skill=await readFile(new URL('../../'+profile.skillPath,import.meta.url),'utf8');const agent=await readFile(new URL('../../'+profile.agentTemplate,import.meta.url),'utf8');
  check(skill.includes('../observatory-source-contract/SKILL.md'),'specialist reuses common source contract');
  check(profile.kind==='calendar'?skill.includes('predictive')&&skill.includes('fixture'):skill.includes('Reading status: inherited')&&skill.includes('predictive'),'specialist retains domain validation boundary');
  check(agent.includes('name: '+profile.agentRole),'agent role maps to actual template');
  check(profile.taskContract.input&&profile.taskContract.method&&profile.taskContract.references.includes(profile.skillPath)&&profile.taskContract.verification&&profile.taskContract.output.length>=5&&profile.taskContract.launchPrompt.includes(profile.id),'each role has an actionable bounded task packet');
 }
 check(SQLITE_SCHEMA.includes('STRICT')&&SQLITE_SCHEMA.includes('json_valid'),'SQLite exact typed adapter with JSON check');
 check(POSTGRES_SCHEMA.includes('timestamptz')&&POSTGRES_SCHEMA.includes('time_zone text'),'PostgreSQL retains separate instant and zone');
 for(const verb of ['SELECT','INSERT','UPDATE','DELETE'])check(SUPABASE_SCHEMA.includes('FOR '+verb+' TO authenticated'),'owner policy covers '+verb);
 check(SUPABASE_SCHEMA.includes('ENABLE ROW LEVEL SECURITY')&&SUPABASE_SCHEMA.includes('WITH CHECK')&&SUPABASE_SCHEMA.includes('auth.uid()'),'RLS owner boundaries included; live authorization still separate');
 return{checks};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){const result=await run();console.log('Observatory standards: '+result.checks+' checks passed.');}
