// Mock-provider HTTP boundary tests. These do not count as actual LLM inference.
import assert from 'node:assert/strict';
import {createRagServer,loadConfig,auditModelReply,parseCompletedResponseSSE,projectAstrocartographyChat} from '../../local-rag/server.mjs';
import {buildWorkbenchEvidence} from '../../assets/js/core/workbench-rag.js';
import {workbenchPromptProfile} from '../../local-rag/model-prompt.mjs';
import {exportAstrocartography,exportAstrocartographyPlace} from '../../assets/js/core/astrocartography.js';
import {ASTROCARTOGRAPHY_CITIES} from '../../assets/js/core/data/astrocartography-data.js';
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
const throws=(fn,label)=>{assert.throws(fn,undefined,label);checks++;};
const config=loadConfig({RAG_PORT:'8844',LOCAL_CONTEXT_PREFLIGHT:'off',OPENAI_API_KEY:'mock-server-secret-never-exposed',OPENAI_MODEL:'mock-responses',CHATGPT_MODEL:'mock-chatgpt'});
let behavior='normal',calls=[],modelReachable=true;
const fetchImpl=async(url,options={})=>{
 const u=new URL(url);calls.push({url:u.href,options});
 if(u.pathname==='/v1/models')return new Response(JSON.stringify({data:[{id:modelReachable?config.localModel:'other-model'}]}),{status:200});
 if(u.pathname==='/apply-template')return behavior==='preflight-unavailable'?new Response('{}',{status:404}):new Response(JSON.stringify({prompt:'A mock rendered chat template containing explicit special tokens.'}));
 if(u.pathname==='/tokenize')return new Response(JSON.stringify({tokens:Array(behavior==='preflight-oversize'?8192:120).fill(1)}));
 const request=JSON.parse(options.body),system=request.messages?.[0]?.content||request.input?.[0]?.content?.[0]?.text||'';
 const ids=JSON.parse(system.match(/(?:Available citation IDs|Only these source IDs are available): (\[[^\n]*?\])\./)?.[1]||'[]');
 if(behavior==='timeout')return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(Error('abort')),{once:true}));
 if(behavior==='rate')return new Response('{"error":"mock limit"}',{status:429});
 if(behavior==='large')return new Response('x'.repeat(1048577),{status:200});
 const user=request.messages?.[1]?.content||request.input?.[1]?.content?.[0]?.text||'',query=user.match(/^QUESTION\n([\s\S]*?)\n\n/)?.[1]||'',packet=buildWorkbenchEvidence(query.slice(0,2000),{limit:config.retrievalLimit,maxTokens:config.retrievalTokens}),source=packet.rows.find(row=>row.id===ids[0]);
 const quote=source?.excerpt.slice(0,80)||'';
 const reply={answer:'This is a mock provider answer for transport validation.'+(ids[0]?` [${ids[0]}]`:''),citations:behavior==='unknown'?['WRAG-invented']:[...ids].slice(0,1),actions:behavior==='unsafe'?[{type:'open_tool',url:'https://example.com'}]:[{type:'set_view',view:'positions'}],grounding:source?[{sourceId:source.id,quote:behavior==='badquote'?'This quotation never appeared in the supplied source.':quote,claim:'A synthetic transport-test claim; semantic correctness is not evaluated.'}]:[]};
 if(behavior==='unknown')reply.answer='A mock unsupported answer [WRAG-invented].';
 if(u.pathname==='/v1/chat/completions')return new Response(JSON.stringify({model:config.localModel,choices:[{message:{content:JSON.stringify(reply)}}],usage:{prompt_tokens:10,completion_tokens:10}}));
 const response={status:'completed',model:request.model,output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(reply)}]}]};
 if(request.stream)return new Response('event: response.completed\ndata: '+JSON.stringify({type:'response.completed',response})+'\n\ndata: [DONE]\n\n');
 return new Response(JSON.stringify(response));
};
let revision=0;const listeners=new Set();
const login={getSessionRevision:()=>revision,subscribeSessionInvalidation:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},status:()=>({provider:'chatgpt',connected:true,inferenceVerified:false}),getAccessToken:async()=>'mock-oauth-token'};
const server=createRagServer({config,fetchImpl,login});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const send=async(payload,options={})=>{const r=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json',...options.headers},body:JSON.stringify(payload),...options});return{status:r.status,data:await r.json()};};
const question='Why can Placidus and Whole Sign place a planet in different houses?';
const profile={name:'Public Greenwich test',localDate:'2026-11-04',localTime:'12:00:00',timeZone:'Etc/UTC',lat:51.4779,lon:0,disambiguation:'reject'};
try{
 const health=await(await fetch(base+'/api/health')).json();ok(health.local.ready,'Health probes actual configured model identifier');ok(health.openai.ready===null&&health.openai.configured,'Configured API key is not represented as verified inference');ok(!JSON.stringify(health).includes('mock-server-secret'),'Health does not expose API credential');ok(health.chatgpt.ready&&health.chatgpt.model==='mock-chatgpt','ChatGPT health separates connection and configured model');
 ok(health.prompt.profile==='scenario-v3'&&health.prompt.temperatureForLocal===0&&health.prompt.maxOutputTokens===512&&health.retrieval.limit===5&&health.retrieval.maxTokens===2100,'Health exposes actual final prompt and bounded deployment output settings');
 ok(health.runtime.maxConcurrent===1&&health.runtime.timeoutMs===110000,'One admission matches the single model slot and timeout leaves margin before the120second client limit');
 for(const id of ['baseline-v1','evidence-v2','scenario-v3']){const c=loadConfig({RAG_PROMPT_PROFILE:id}),p=workbenchPromptProfile(id);ok(c.promptProfile===id&&c.temperature===p.temperature&&c.maxTokens===Math.min(p.maxTokens,512)&&c.retrievalLimit===p.retrievalLimit&&c.retrievalTokens===p.retrievalTokens,'Deployment output cap preserves the frozen named profile '+id);}
 ok(workbenchPromptProfile('scenario-v3').maxTokens===1000,'Runtime correction does not modify the frozen evaluation prompt profile');
 const explicitLimits=loadConfig({RAG_MAX_TOKENS:'768',RAG_MAX_CONCURRENT:'2',RAG_TIMEOUT_MS:'120000'});ok(explicitLimits.maxTokens===768&&explicitLimits.maxConcurrent===2&&explicitLimits.timeoutMs===120000,'Existing bounded runtime overrides remain explicit');
 throws(()=>loadConfig({RAG_PROMPT_PROFILE:'invented-profile'}),'Unknown prompt profile rejected');
 ok(loadConfig({}).localContextPreflight==='llama.cpp'&&loadConfig({}).localContextLimit===8192,'Pinned default local model enables actual tokenizer preflight for8192tokens');
 ok(loadConfig({RAG_LOCAL_MODEL:'custom-model'}).localContextPreflight==='off'&&loadConfig({RAG_LOCAL_BASE_URL:'http://127.0.0.1:9999/v1/'}).localContextPreflight==='off','Custom model/base preserve compatibility with preflight explicitly off');
 throws(()=>loadConfig({LOCAL_CONTEXT_PREFLIGHT:'invented'}),'Unknown tokenizer preflight mode rejected');
 throws(()=>loadConfig({LOCAL_CONTEXT_LIMIT:'512'}),'Implausibly small configured context limit rejected');
 modelReachable=false;ok(!(await(await fetch(base+'/api/health')).json()).local.ready,'Other local model does not count as ready');modelReachable=true;
 const page=await fetch(base+'/pages/desktop.html');ok(page.status===200&&(await page.text()).includes('dw-app'),'Same-origin public desktop page served');
 for(const path of ['/.git/config','/local-rag/.env','/mcp/package.json','/README.md','/private-birth-reading/reading.html'])ok((await fetch(base+path)).status===404,'Non-public path denied '+path);
 ok((await fetch(base+'/assets/%252e%252e/local-rag/.env')).status===404,'Double-encoded traversal cannot serve a secret');
 const normal=await send({question,provider:'local',requestId:'mock-request-1'});ok(normal.status===200,'Local provider response accepted');ok(normal.data.requestId==='mock-request-1','Request identity echoed');ok(!normal.data.contextIncluded,'Context remains opt-in');ok(normal.data.citations.length>0&&normal.data.citationAudit.identifiersValid,'Only retrieved citations accepted');ok(normal.data.actions[0].type==='set_view'&&normal.data.actionAudit.note.includes('no action'),'Validated proposal is never executed');ok(calls.at(-1).url==='http://127.0.0.1:8845/v1/chat/completions','Local upstream is fixed server config');
 const normalPayload=JSON.parse(calls.at(-1).options.body);ok(normalPayload.temperature===0&&normalPayload.max_tokens===512&&normalPayload.messages[0].content.includes('Possible everyday scenario'),'Inference uses unchanged frozen scenario prompt with512token deployment cap');
 ok(normal.data.promptProfile==='scenario-v3'&&normal.data.draft===true&&normal.data.grounding.length===1&&normal.data.groundingAudit.allSuppliedQuotesMatched&&normal.data.groundingAudit.semanticSupportValidated===false,'Exact supplied quote is audited without semantic validation and result remains a draft');
 ok(Object.keys(normal.data.grounding[0]).sort().join(',')==='claim,quote,sourceId','Browser receives only bounded plain grounding fields for independent inspection');
 const context={inputs:{mode:'natal',zodiac:'tropical',system:'whole',orb:6,primary:profile,secondary:null},selection:{body:'Sun',frame:'primary'}};
 const chart=await send({question,provider:'local',context});ok(chart.status===200&&chart.data.contextIncluded,'Explicit valid chart context accepted');const prompt=JSON.parse(calls.at(-1).options.body).messages[1].content;ok(prompt.includes('2026-11-04T12:00:00.000Z')&&prompt.includes('longitude'),'Server recomputes UTC and planetary facts');
 const sentContext=()=>JSON.parse(JSON.parse(calls.at(-1).options.body).messages[1].content.split('SERVER-COMPUTED STUDY CONTEXT\n').at(-1));
 const reading={dateISO:'2024-03-20',timeZone:'UTC'};
 const readingReply=await send({question,context:{reading}});ok(readingReply.status===200&&readingReply.data.contextKind==='reading','Date-only canonical reading accepted');
 let canonical=sentContext().reading;ok(Object.keys(canonical.frameworks).length===9&&canonical.context.timeKnown===false&&canonical.context.instantISO===null,'All nine frameworks fit without inventing an exact moment');
 ok(!canonical.frameworks.lilly.facts.chart&&!canonical.frameworks.vedic.facts.panchanga&&Object.keys(canonical.frameworks.plato.facts).length===0,'Missing chart clocks and textual methods retain their boundaries');
 ok(Buffer.byteLength(calls.at(-1).options.body,'utf8')<=health.prompt.providerPayloadMaxBytes,'Nine-family provider payload fits the declared bound without silently omitted facts');
 const fullReading={...reading,time:'03:06',lat:51.5074,lon:-0.1278};ok((await send({question,context:{reading:fullReading}})).status===200,'Exact nine-family reading accepted');canonical=sentContext().reading;
 ok(Object.keys(canonical.frameworks).length===9&&canonical.frameworks.lilly.facts.chart.houses.length===12&&canonical.frameworks.vedic.facts.panchanga.tithi,'Exact context retains all canonical chart facts');
 ok(Buffer.byteLength(JSON.stringify(sentContext()),'utf8')<=health.prompt.contextMaxBytes&&Buffer.byteLength(calls.at(-1).options.body,'utf8')<=health.prompt.providerPayloadMaxBytes,'Exact nine-family reading fits both explicit context and provider bounds');
 ok((await send({question,context:{reading:{caseId:'lilly-dog-printed-figure'}}})).status===200,'Registered public source example accepted');canonical=sentContext().reading;
 ok(canonical.total===4&&canonical.matched===4&&canonical.outcomeEvaluable===false&&!canonical.result.frameworks.lilly.facts.chart.ascendant,'Public example recomputed with only four verified fields and no invented angle');
 ok((await send({question,context:{reading:{caseId:'dee-monas-symbolic-method'}}})).status===200&&sentContext().reading.total===0,'Textual case stays numerically unevaluable');
 ok((await send({question,context:{reading:{dateISO:'-003113-08-11',timeZone:'UTC',frameworks:['mayan']}}})).status===200&&sentContext().reading.frameworks.mayan.facts.longCount==='0.0.0.0.0','Isolated Maya BCE request uses its named canonical epoch');
 for(const invalid of [{reading,inputs:context.inputs},{reading,selection:{body:'Sun',frame:'primary'}},{reading:{...reading,facts:{forged:true}}},{reading:{caseId:'lilly-dog-printed-figure',dateISO:'2024-03-20'}},{reading:{caseId:'unknown'}},{reading:{dateISO:'2024-03-10',time:'02:30',timeZone:'America/New_York'}},{reading:{dateISO:'2024-11-03',time:'01:30',timeZone:'America/New_York'}},{reading:{...reading,timeKnown:false}},{reading:{...reading,frameworks:['invented']}},{reading:null}]){const before=calls.length;ok((await send({question,context:invalid})).status===400&&calls.length===before,'Mixed, forged or invalid reading input rejected before provider fetch');}
 const acgInputs={profile:{...profile,localDate:'2024-03-20',localTime:'03:06:00'},bodyIds:['Sun','Moon','Venus'],angleIds:['ASC','DSC','MC','IC'],purpose:'overview',radiusKm:500,system:'regiomontanus',cityIds:ASTROCARTOGRAPHY_CITIES.slice(0,2).map(row=>row.id)};
 const acgPlace={name:'Public equatorial reference',lat:0,lon:0,timeZone:'Etc/UTC'};
 let acgReply=await send({question,context:{astrocartography:{inputs:acgInputs}}});
 ok(acgReply.status===200&&acgReply.data.contextKind==='astrocartography'&&acgReply.data.contextIncluded,'Explicit astrocartography input uses its own canonical context branch');
 let acgCanonical=sentContext().astrocartography;
 const acgGlobalFull=exportAstrocartography(acgInputs),acgGlobalBefore=JSON.stringify(acgGlobalFull);
 assert.deepEqual(acgCanonical,projectAstrocartographyChat(acgGlobalFull));checks++;
 ok(JSON.stringify(acgGlobalFull)===acgGlobalBefore,'Chat projection leaves the canonical core/MCP export unchanged');
 ok(acgCanonical.contextScope.projection==='astrocartography-chat-v1'&&acgCanonical.contextScope.omitted.length>4,'Chat projection declares its schema and omitted sections');
 assert.deepEqual(acgCanonical.lineIds,acgGlobalFull.lineSummaries.map(line=>line.id));checks++;
 assert.deepEqual(acgCanonical.bodies.rows,acgGlobalFull.bodies.map(b=>[b.id,b.raDegrees,b.declinationDegrees,b.distanceAU,b.subpoint.lon]));checks++;
 assert.deepEqual(acgCanonical.crossings.rows,acgGlobalFull.crossings.map(c=>[c.lineIds,c.lat,c.lon,c.residualDegrees,c.kind]));checks++;
 assert.deepEqual(acgCanonical.sources,acgGlobalFull.sources.map(({id,locator})=>({id,locator})));checks++;
 ok(acgCanonical.positionMethods.includes(acgGlobalFull.bodies[0].positionMethod)&&acgCanonical.contextScope.angularDistance.includes('6371.0088'),'Position method and angular-distance conversion are explicit');
 ok(acgCanonical.context.instantISO==='2024-03-20T03:06:00.000Z'&&acgCanonical.scope.renderGeometryOmitted===true&&!('lines'in acgCanonical),'Server recomputes the birth instant and excludes full world geometry');
 ok(acgCanonical.scoring.claimType==='project-editorial-rubric'&&acgCanonical.limitations.length>0,'Symbolic ranking is labelled editorial and preserves limitations');
 ok(Buffer.byteLength(JSON.stringify(sentContext()),'utf8')<=health.prompt.contextMaxBytes&&Buffer.byteLength(calls.at(-1).options.body,'utf8')<=health.prompt.providerPayloadMaxBytes,'Astrocartography summary fits declared context and provider byte bounds');
 acgReply=await send({question,context:{astrocartography:{inputs:{profile:acgInputs.profile}}}});
 ok(acgReply.status===200&&sentContext().astrocartography.scope.totalLines===40,'Default ten-body four-angle request remains a usable bounded summary');
 acgReply=await send({question,context:{astrocartography:{inputs:acgInputs,place:acgPlace}}});
 ok(acgReply.status===200&&acgReply.data.contextKind==='astrocartography','Explicit selected-place summary accepted');
 acgCanonical=sentContext().astrocartography;
 const acgPlaceFull=exportAstrocartographyPlace(acgInputs,acgPlace),acgPlaceBefore=JSON.stringify(acgPlaceFull);
 assert.deepEqual(acgCanonical,projectAstrocartographyChat(acgPlaceFull));checks++;
 ok(JSON.stringify(acgPlaceFull)===acgPlaceBefore,'Selected-place projection does not mutate the core export');
 assert.deepEqual(acgCanonical.calendarFacts,acgPlaceFull.calendarFacts);checks++;
 ok(Object.keys(acgCanonical.calendarFacts).length===9&&Object.values(acgCanonical.calendarFacts).every(f=>f.method&&f.status&&Array.isArray(f.limitations)),'Every calendar method, availability, fact and limitation remains unchanged');
 assert.deepEqual(acgCanonical.distances.rows,acgPlaceFull.distances.map(d=>[d.lineId,d.distanceKm,d.nearestKind]));checks++;
 assert.deepEqual(acgCanonical.relocatedChart.houses.rows,acgPlaceFull.relocatedChart.houses.map(h=>[h.house,h.longitude]));checks++;
 assert.deepEqual(acgCanonical.relocatedChart.bodies.rows,acgPlaceFull.relocatedChart.bodies.map(b=>[b.id,b.longitude,b.house,b.sign,b.retrograde,b.dignity?.total??null,b.dignity?.peregrine??null,b.dignity?.dispositor??null]));checks++;
 assert.deepEqual(acgCanonical.ranking,acgPlaceFull.ranking);checks++;
 ok(acgCanonical.contextScope.omitted.includes('Nearest-point coordinates')&&acgCanonical.contextScope.omitted.some(s=>s.includes('dignity component')),'Omitted nearest-point geometry and dignity components are visible in context scope');
 ok(acgCanonical.relocation.instantISO==='2024-03-20T03:06:00.000Z'&&acgCanonical.relocatedChart.dateISO===acgCanonical.relocation.instantISO,'Relocation preserves the original UTC instant');
 ok(acgCanonical.relocatedChart.requestedSystem==='regiomontanus'&&acgCanonical.relocatedChart.actualSystem&&Array.isArray(acgCanonical.relocatedChart.warnings),'Requested and actual house system plus warnings remain explicit');
 ok(acgCanonical.distances.rows.length===12&&acgCanonical.contextScope.selectedDistanceCount===12,'All selected angle distances are retained without full map geometry');
 ok(Buffer.byteLength(JSON.stringify(sentContext()),'utf8')<=health.prompt.contextMaxBytes&&Buffer.byteLength(calls.at(-1).options.body,'utf8')<=health.prompt.providerPayloadMaxBytes,'Selected-place context fits both byte limits');
 const firstPlaceInstant=acgCanonical.relocation.instantISO;
 ok((await send({question,context:{astrocartography:{inputs:acgInputs,place:{...acgPlace,timeZone:'Asia/Kolkata'}}}})).status===200&&sentContext().astrocartography.relocation.instantISO===firstPlaceInstant,'A place timezone changes the displayed clock without changing the birth instant');
 ok((await send({question,context:{astrocartography:{inputs:{...acgInputs,cityIds:[]}}}})).status===200&&sentContext().astrocartography.scope.totalCities===0,'An explicit empty city selection permits a map-only request');
 const acgPolar=exportAstrocartographyPlace(acgInputs,{name:'Public pole test',lat:90,lon:0,timeZone:'UTC'}),acgPolarChat=projectAstrocartographyChat(acgPolar);
 ok(acgPolarChat.relocatedChart===null&&acgPolarChat.relocation.status==='unavailable','Unavailable polar relocation is preserved without fabricated chart fields');
 assert.deepEqual(acgPolarChat.calendarFacts,acgPolar.calendarFacts);checks++;
 const acgFallback=exportAstrocartographyPlace({...acgInputs,system:'placidus'},{name:'Public high-latitude test',lat:70,lon:20,timeZone:'UTC'}),acgFallbackChat=projectAstrocartographyChat(acgFallback);
 assert.deepEqual(acgFallbackChat.relocation,acgFallback.relocation);checks++;
 assert.deepEqual(acgFallbackChat.relocatedChart.warnings,acgFallback.relocatedChart.warnings);checks++;
 for(const boundary of [
  {date:'1900-01-01',time:'00:00',zone:'Pacific/Honolulu',lat:21.3,lon:-157.8},
  {date:'2100-12-31',time:'23:59',zone:'Pacific/Kiritimati',lat:1.8,lon:-157.4}
 ]){
  const inputs={profile:{...acgInputs.profile,localDate:boundary.date,localTime:boundary.time,timeZone:'UTC'},cityIds:[]},place={name:'Public calendar range boundary',lat:boundary.lat,lon:boundary.lon,timeZone:boundary.zone};
  const full=exportAstrocartographyPlace(inputs,place),projection=projectAstrocartographyChat(full);
  ok(full.calendarFacts===null&&projection.calendarFacts===null&&projection.contextScope.calendarFamilies.length===0,'Relocated civil date outside the Reading Lab range preserves unavailable calendar facts');
  ok(projection.relocation.readingUnavailableReason===full.relocation.readingUnavailableReason&&!!projection.relocation.readingUnavailableReason,'Calendar unavailability retains the canonical explanation');
  ok(projection.distances.rows.length===40&&projection.distances.rows.every(row=>Number.isFinite(row[1])),'Unavailable boundary calendars do not discard the forty valid geometric distances');
  ok(projection.contextScope.retained.some(s=>s.includes('Calendar facts unavailable'))&&!projection.contextScope.retained.some(s=>s.startsWith('All nine')),'Boundary scope never claims nine available calendar methods');
  const reply=await send({question,context:{astrocartography:{inputs,place}}});
  ok(reply.status===200&&sentContext().astrocartography.calendarFacts===null,'A valid boundary astrocartography request remains usable through HTTP');
 }
 const acgNoTime={...acgInputs.profile};delete acgNoTime.localTime;
 for(const invalid of [
  {astrocartography:{inputs:acgInputs},reading},
  {astrocartography:{inputs:acgInputs},inputs:context.inputs},
  {astrocartography:{inputs:acgInputs},selection:{body:'Sun',frame:'primary'}},
  {astrocartography:{input:acgInputs}},
  {astrocartography:{inputs:acgInputs,context:{forged:true}}},
  {astrocartography:{inputs:acgInputs,lines:[{forged:true}]}},
  {astrocartography:{inputs:{...acgInputs,profile:acgNoTime}}},
  {astrocartography:{inputs:{...acgInputs,profile:{...acgInputs.profile,dateISO:'1900-01-01T00:00:00Z'}}}},
  {astrocartography:{inputs:{...acgInputs,profile:{...acgInputs.profile,localDate:'2024-03-10',localTime:'02:30:00',timeZone:'America/New_York'}}}},
  {astrocartography:{inputs:{...acgInputs,profile:{...acgInputs.profile,localDate:'2024-11-03',localTime:'01:30:00',timeZone:'America/New_York'}}}},
  {astrocartography:{inputs:{...acgInputs,bodyIds:['Earth']}}},
  {astrocartography:{inputs:{...acgInputs,cityIds:['private-saved-location']}}},
  {astrocartography:{inputs:{...acgInputs,bodyPositions:{Sun:{longitude:0}}}}},
  {astrocartography:{inputs:{...acgInputs,radiusKm:3001}}},
  {astrocartography:{inputs:acgInputs,place:{...acgPlace,timeZone:'Invalid/Zone'}}},
  {astrocartography:{inputs:acgInputs,place:{...acgPlace,lat:91}}},
  {astrocartography:{inputs:acgInputs,place:{...acgPlace,chart:{forged:true}}}},
  {astrocartography:{inputs:acgInputs,place:null}},
  {astrocartography:null}
 ]){const before=calls.length;ok((await send({question,context:invalid})).status===400&&calls.length===before,'Invalid, mixed or forged astrocartography input rejected before provider access');}
 const privateAcyclicName='SYNTHETIC_PRIVATE_ACG_NAME_731';
 const explicitPrivate=await send({question,context:{astrocartography:{inputs:{...acgInputs,profile:{...acgInputs.profile,name:privateAcyclicName}}}}});
 ok(explicitPrivate.status===200&&JSON.stringify(sentContext()).includes(privateAcyclicName),'A profile name appears upstream only in an explicitly opted-in context');
 const afterPrivate=await send({question});
 ok(afterPrivate.status===200&&!afterPrivate.data.contextIncluded&&!JSON.stringify(JSON.parse(calls.at(-1).options.body)).includes(privateAcyclicName),'The next context-free request does not inherit astrocartography profile data');
 ok((await send({question,context:{inputs:{...context.inputs,planets:{Sun:0}}}})).status===400,'Client-provided derived planetary rows rejected');
 ok((await send({question,context:{inputs:context.inputs,selection:{body:'Earth',frame:'primary'}}})).status===400,'Unavailable selection rejected');
 ok((await send({question,endpoint:'http://evil.example'})).status===400,'Arbitrary provider URL rejected');
 ok((await send({question,provider:'unknown'})).status===400,'Unknown provider rejected');
 ok((await send({question:''})).status===400,'Empty question rejected');
 ok((await send({question:'x'.repeat(3001)})).status===400,'Oversized question rejected');
 ok((await send({question:'x'.repeat(70000)})).status===413,'Oversized request rejected');
 const wrongContent=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'text/plain'},body:'{}'});ok(wrongContent.status===415,'Simple cross-site text POST rejected');
 const hostile=await send({question},{headers:{'Content-Type':'application/json',Origin:'https://untrusted.example'}});ok(hostile.status===403,'Unlisted origin rejected');
 const file=await send({question},{headers:{'Content-Type':'application/json',Origin:'null'}});ok(file.status===403,'File origin requires explicit opt-in');
 const cors=await fetch(base+'/api/chat',{method:'OPTIONS',headers:{Origin:'http://127.0.0.1:8844'}});ok(cors.status===204&&cors.headers.get('access-control-allow-origin')==='http://127.0.0.1:8844','CORS echoes only exact allowed origin');
 behavior='unknown';const unknown=await send({question});ok(unknown.data.citationAudit.unknownIds.includes('WRAG-invented')&&unknown.data.citations.length===0,'Invented source ID is flagged and not accepted');
 behavior='unsafe';const unsafe=await send({question});ok(unsafe.data.actions.length===0&&unsafe.data.actionAudit.rejected,'Malformed executable/URL action is rejected');
 behavior='badquote';const badquote=await send({question});ok(badquote.status===200&&badquote.data.grounding.length===0&&badquote.data.groundingAudit.rejected.length===1&&badquote.data.draftReasons.length>0&&badquote.data.warning.includes('draft'),'Invalid quote remains a visibly flagged generated draft, not validated source support');
 behavior='rate';ok((await send({question})).status===429,'Provider rate limit propagates');
 behavior='large';ok((await send({question})).status===502,'Oversized provider answer rejected');
 behavior='normal';const openai=await send({question,provider:'openai'});ok(openai.status===200,'Responses API transport parsed');let sent=JSON.parse(calls.at(-1).options.body);ok(sent.store===false&&Array.isArray(sent.input)&&!('messages'in sent),'Responses input uses array and disables provider storage');ok(calls.at(-1).options.headers.Authorization==='Bearer mock-server-secret-never-exposed','API key stays in server-to-provider header');ok(!JSON.stringify(openai.data).includes('mock-server-secret'),'API key never returned');
 const chatgpt=await send({question,provider:'chatgpt'});ok(chatgpt.status===200,'SIWC response.completed SSE accepted');sent=JSON.parse(calls.at(-1).options.body);ok(sent.stream===true&&sent.store===false&&Array.isArray(sent.input),'SIWC request uses required stream/store/input fields');ok(!('temperature'in sent)&&!('max_output_tokens'in sent)&&!('previous_response_id'in sent),'SIWC request omits unsupported options');ok(calls.at(-1).options.headers.Authorization==='Bearer mock-oauth-token','Own OAuth access token used only on server');
 config.timeoutMs=30;behavior='timeout';ok((await send({question})).status===504,'Slow upstream is aborted with timeout');behavior='normal';ok((await send({question})).status===200,'Server recovers after timeout');
 config.timeoutMs=500;behavior='timeout';const pending=send({question,provider:'chatgpt'});await new Promise(r=>setTimeout(r,15));revision++;for(const fn of listeners)fn({revision,reason:'logout'});const cancelled=await pending;ok(cancelled.status===401&&cancelled.data.error.code==='AUTH_SESSION_ENDED','Logout aborts an active ChatGPT inference and discards its answer');ok(listeners.size===0,'Completed request unsubscribes its session listener');
 const oldToken=login.getAccessToken;login.getAccessToken=async()=>{await new Promise(r=>setTimeout(r,25));return 'late-token';};const before=calls.length;const delayed=send({question,provider:'chatgpt'});await new Promise(r=>setTimeout(r,10));revision++;for(const fn of listeners)fn({revision,reason:'logout'});const delayedResult=await delayed;ok(delayedResult.status===401&&calls.length===before,'Logout during token acquisition prevents provider fetch');login.getAccessToken=oldToken;
 config.maxConcurrent=1;config.timeoutMs=80;behavior='timeout';const first=send({question});await new Promise(r=>setTimeout(r,10));ok((await send({question})).status===429,'Concurrent admission respects configured bound');ok((await first).status===504,'Bounded active request times out');config.maxConcurrent=2;behavior='normal';config.timeoutMs=1000;
 throws(()=>loadConfig({RAG_LOCAL_BASE_URL:'http://169.254.169.254/v1/'}),'Metadata endpoint rejected');throws(()=>loadConfig({RAG_LOCAL_BASE_URL:'https://example.com/v1/'}),'Remote local-model endpoint rejected');throws(()=>loadConfig({RAG_ALLOWED_ORIGINS:'*'}),'Wildcard origin rejected');throws(()=>parseCompletedResponseSSE('data: [DONE]\n\n'),'DONE without completed is rejected');throws(()=>parseCompletedResponseSSE('data: {"type":"response.failed"}\n\n'),'Failed response stream rejected');
 const evidence=buildWorkbenchEvidence(question,{limit:3,maxTokens:1200});const badInline=auditModelReply('{"answer":"See [WRAG-madeup].","citations":[],"actions":[]}',evidence);ok(badInline.citationAudit.unknownIds.includes('WRAG-madeup'),'Invented inline citation also flagged');
 const sourceId='WRAG-quote-fixture',excerpt='This exact selected excerpt supports only a limited source-method demonstration.';
 const quoteEvidence={citations:[{id:sourceId,title:'Synthetic audit fixture'}],rows:[{id:sourceId,excerpt,text:excerpt+' This omitted passage was not sent to the provider.'}]};
 const modelReply={answer:`A model explanation [${sourceId}].`,citations:[sourceId],actions:[],grounding:[{sourceId,quote:'This exact selected excerpt',claim:'This claim is not semantically checked.'}]};
 const quoteAudit=auditModelReply(JSON.stringify(modelReply),quoteEvidence);ok(quoteAudit.groundingAudit.accepted===1&&quoteAudit.groundingAudit.semanticSupportValidated===false,'Exact excerpt match is explicitly not entailment or semantic validation');
 for(const grounding of [[{sourceId,quote:'This omitted passage was not sent to the provider.',claim:'A fabricated extension.'}],[{sourceId,quote:'This Exact selected excerpt',claim:'Changed case is not exact.'}],[{sourceId,quote:'Too short',claim:'Insufficient quote.'}],[{sourceId:'WRAG-other',quote:'This exact selected excerpt',claim:'Wrong source.'}],[{...modelReply.grounding[0],url:'https://example.invalid'}],Array(3).fill(modelReply.grounding[0])]){const result=auditModelReply(JSON.stringify({...modelReply,grounding}),quoteEvidence);ok(result.groundingAudit.rejected.length>0&&result.draft,'Omitted, altered, undersized, unknown, extended or excess quote item is flagged');}
 const noMarker=auditModelReply(JSON.stringify({...modelReply,answer:'A sentence without an inline marker.'}),quoteEvidence);ok(noMarker.citationAudit.missingInlineIds.includes(sourceId)&&noMarker.draftReasons.length>0,'Missing inline marker remains visible');
 const unstructured=auditModelReply('A plain answer without the requested structured fields.',quoteEvidence);ok(unstructured.draft&&unstructured.citationAudit.structured===false&&unstructured.actions.length===0,'Malformed structured output remains a draft without executable actions');
 config.localContextPreflight='llama.cpp';behavior='normal';const budgeted=await send({question,context:{reading}});
 ok(budgeted.status===200&&budgeted.data.contextBudget.verified&&budgeted.data.contextBudget.promptTokens===120&&budgeted.data.contextBudget.requiredTokens===664&&budgeted.data.contextBudget.contextWindowTokens===8192,'Actual rendered-template token count reserves512output and32boundary tokens');
 const preflightCalls=calls.slice(-3);ok(preflightCalls.map(c=>new URL(c.url).pathname).join(',')==='/apply-template,/tokenize,/v1/chat/completions','Configured tokenizer preflight precedes inference');
 ok(JSON.parse(preflightCalls[0].options.body).messages[0].content.includes('Possible everyday scenario')&&JSON.parse(preflightCalls[0].options.body).chat_template_kwargs.enable_thinking===false,'Preflight receives the actual frozen model messages and matching template options');
 behavior='preflight-oversize';let beforeGeneration=calls.length;const tooMany=await send({question:'天'.repeat(3000),context:{reading:fullReading}});
 ok(tooMany.status===400&&tooMany.data.error.code==='CONTEXT_WINDOW_EXCEEDED'&&tooMany.data.error.message.includes('Select fewer frameworks'),'Tokenized oversized Unicode question gets a clear context-budget error');
 ok(calls.slice(beforeGeneration).every(c=>!c.url.endsWith('/v1/chat/completions')),'Oversized tokenizer result cannot reach model generation or silently truncate facts');
 beforeGeneration=calls.length;const acgTooMany=await send({question,context:{astrocartography:{inputs:acgInputs,place:acgPlace}}});
 ok(acgTooMany.status===400&&acgTooMany.data.error.code==='CONTEXT_WINDOW_EXCEEDED'&&acgTooMany.data.error.message.includes('bodies or reference cities'),'Astrocartography token overflow explains the relevant ways to reduce shared context');
 ok(calls.slice(beforeGeneration).every(c=>!c.url.endsWith('/v1/chat/completions')),'Astrocartography tokenizer overflow fails before generation without silently dropping facts');
 behavior='preflight-unavailable';beforeGeneration=calls.length;const unavailableBudget=await send({question});
 ok(unavailableBudget.status===503&&unavailableBudget.data.error.code==='LOCAL_CONTEXT_PREFLIGHT_UNAVAILABLE'&&calls.slice(beforeGeneration).every(c=>!c.url.endsWith('/v1/chat/completions')),'Configured unavailable tokenizer fails closed before model generation');
 config.localContextPreflight='off';behavior='normal';const compatible=await send({question});ok(compatible.status===200&&compatible.data.contextBudget.mode==='off'&&!compatible.data.contextBudget.verified,'Explicit opt-out remains disclosed and supports generic local endpoints');
 console.log(JSON.stringify({kind:'local-rag-http-mock-test',checks,passed:true,actualModelInference:false},null,2));
}finally{await new Promise(r=>server.close(r));server.closeAllConnections();}
