// Focused, real-browser ensemble checks. No live provider, account or sensor call.
// ENSEMBLE_PHASE=all|sigil|connections|ai|standards|events; ENSEMBLE_OUTPUT=path.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,process.env.ENSEMBLE_OUTPUT||'docs/evidence/ensemble/current');
const phase=process.env.ENSEMBLE_PHASE||'all';
assert.ok(['all','sigil','connections','ai','standards','events'].includes(phase),'known phase');
await mkdir(output,{recursive:true});
const pkg=process.env.PLAYWRIGHT_PKG?await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href):await import('playwright').catch(()=>import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js'));
const chromium=pkg.chromium||pkg.default?.chromium;
const sha=body=>createHash('sha256').update(body).digest('hex');
async function files(dir){const list=[];for(const item of await readdir(resolve(root,dir),{withFileTypes:true})){if(item.name.startsWith('.')||item.name==='node_modules')continue;const rel=dir+'/'+item.name;if(item.isDirectory())list.push(...await files(rel));else list.push(rel);}return list;}
async function product(){const paths=['index.html','sw.js','manifest.webmanifest',...await files('assets'),...await files('pages'),...(await files('mcp')).filter(p=>/\.(mjs|json)$/.test(p))];return Object.fromEntries(await Promise.all(paths.sort().map(async p=>[p,sha(await readFile(resolve(root,p)))])));}
const before=await product();
const report={schemaVersion:1,phase,round:process.env.ENSEMBLE_ROUND||'candidate',startedAt:new Date().toISOString(),checks:[],downloads:[],screenshots:[],errors:[],missing:[],externalRequests:[],source:{testScriptSHA256:sha(await readFile(fileURLToPath(import.meta.url))),productAtStartSHA256:sha(JSON.stringify(before))},limits:{realProviderCalled:false,physicalPhone:false,screenReader:false}};
const prefix='/astrology-sim-ant/';
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(prefix))return res.writeHead(404).end();let rel=decodeURIComponent(u.pathname.slice(prefix.length));if(!rel||rel.endsWith('/'))rel+='index.html';const path=resolve(root,rel);if(!path.startsWith(root+sep)||rel.split('/').some(p=>p.startsWith('.')))return res.writeHead(403).end();res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'}).end(await readFile(path));}catch{return res.writeHead(404).end('Not found');}});
let browser,failure,base,origin;
const check=(ok,label,details)=>{report.checks.push({label,pass:!!ok,...(details?{details}:{})});assert.ok(ok,label+(details?' '+JSON.stringify(details):''));};
const selected=name=>phase==='all'||phase===name;
async function includes(page,selector,text){await page.waitForFunction(({selector,text})=>document.querySelector(selector)?.textContent?.includes(text),{selector,text});}
async function context(width){const c=await browser.newContext({viewport:{width,height:900},locale:'en-US',reducedMotion:'reduce',serviceWorkers:'block',acceptDownloads:true});await c.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===origin||['data:','blob:'].includes(u.protocol))return r.continue();report.externalRequests.push(u.href);return r.abort('blockedbyclient');});await c.addInitScript(()=>{window.__ensemblePermissions={location:0,camera:0};Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(_ok,no)=>{window.__ensemblePermissions.location++;no({code:1,message:'Fixture denies'});}}});});const page=await c.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>report.errors.push({url:page.url(),message:e.message}));page.on('console',m=>{if(m.type()==='error')report.errors.push({url:page.url(),message:m.text(),kind:'console'});});page.on('response',r=>{if(r.status()>=400)report.missing.push({url:r.url(),status:r.status()});});return{c,page};}
async function layout(page,label){const info=await page.evaluate(()=>{const main=document.querySelector('main'),a=document.querySelector('.skip-link');let skip=false;try{skip=!!a&&!!document.querySelector(a.getAttribute('href'));}catch{}return{viewport:innerWidth,scroll:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,header:!!document.querySelector('header.site'),skip};});check(info.scroll<=info.viewport+1&&info.main===1&&info.header&&info.skip,label+' reflow and landmarks',info);}
async function shot(page,label,selector){if(selector)await page.locator(selector).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));else await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const file=label+'.png';await page.screenshot({path:resolve(output,file)});report.screenshots.push(file);}
async function download(page,selector,label){const pending=page.waitForEvent('download');await page.locator(selector).click();const item=await pending;check(await item.failure()===null,label+' download completed');const body=await readFile(await item.path());report.downloads.push({label,filename:item.suggestedFilename(),bytes:body.length,sha256:sha(body)});check(body.length>50,label+' nonempty artifact');return body;}
async function decodePNG(page,body,label){check(body.subarray(0,8).toString('hex')==='89504e470d0a1a0a',label+' PNG signature');const info=await page.evaluate(async data=>{const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const colors=new Set();const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;for(let i=0;i<pixels.length;i+=64)colors.add([...pixels.slice(i,i+4)].join(','));return{width:image.width,height:image.height,colors:colors.size};},body.toString('base64'));check(info.width>=500&&info.height>=500&&info.colors>4,label+' actual drawing pixels',info);}
async function standards(width){
 const {c,page}=await context(width);
 try{
  await page.goto(base+'pages/standards.html');await page.waitForFunction(()=>document.querySelectorAll('.standards-profile').length===58);
  check(await page.locator('[data-standard-id]').count()===16,'all standards remain available '+width);
  await page.locator('#standards-at').fill('1800-01-01T12:00:00Z');await page.locator('#standards-check').click();await includes(page,'#standards-context-status','Check these inputs:');
  check(await page.locator('#standards-at').getAttribute('aria-invalid')==='true','unsupported UTC year is rejected and field identified '+width);
  check(await page.locator('#standards-at').evaluate(el=>document.activeElement===el),'explicit invalid-context check focuses the field '+width);
  await page.locator('#standards-at').fill('1900-01-01T00:30:00Z');await page.locator('#standards-zone').fill('Pacific/Honolulu');await page.locator('#standards-check').click();await includes(page,'#standards-context-status','civil date');
  check((await page.locator('#standards-context-status').innerText()).startsWith('Check these inputs:'),'observer-local year boundary is rejected '+width);
  await page.locator('a[href="#standards-specialists-heading"]').click();
  check(await page.locator('#standards-specialists-heading').evaluate(el=>document.activeElement===el),'direct specialist link moves keyboard focus '+width);
  await page.locator('#standards-profile-search').fill('Hebrew');
  const profile=page.locator('.standards-profile').filter({has:page.locator('[data-profile-prepare="calendar-hebrew"]')});
  await profile.locator('summary').click();await profile.locator('[data-profile-prepare]').click();await page.waitForFunction(()=>!document.querySelector('[data-profile-prepare="calendar-hebrew"]').disabled);
  check(await profile.locator('textarea').isHidden(),'unsupported context does not become a calendar task '+width);
  await page.locator('#standards-at').fill('2026-10-29T12:00:00Z');await page.locator('#standards-zone').fill('Europe/London');await page.locator('#standards-check').click();await includes(page,'#standards-context-status','Input accepted by');
  check(!(await page.locator('#standards-at').getAttribute('aria-invalid')),'valid input recovers from marked error '+width);
  await profile.locator('[data-profile-prepare]').click();await profile.locator('textarea').waitFor({state:'visible'});
  const text=await profile.locator('textarea').inputValue(),packet=JSON.parse(text);
  check(packet.suppliedContext.dateISO==='2026-10-29T12:00:00.000Z'&&packet.suppliedContext.timeZone==='Europe/London','calendar task uses canonical validated context '+width);
  await page.locator('#standards-profile-search').fill('no-such-profile-ensemble');check(await page.locator('#standards-profile-empty').isVisible(),'profile search gives explicit empty recovery '+width);
  await page.locator('#standards-profile-reset').click();check(await page.locator('.standards-profile:visible').count()===58,'reset restores all scoped profiles '+width);
  check(await profile.locator('textarea').inputValue()===text,'filtering and reset preserve reviewed task '+width);
  await page.locator('#standards-lat').fill('52');check(await profile.locator('textarea').isHidden()&&await profile.locator('.standards-downloads button').count()===0,'context edits clear stale prepared task and actions '+width);
  const field=await page.locator('#standards-at').evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,font:parseFloat(getComputedStyle(el).fontSize)}));
  check(field.width>=200&&field.height>=44&&field.font>=16,'explicit instant remains readable and touch sized '+width,field);
  await layout(page,'standards focused workflow '+width);if(width===390)await shot(page,'standards-390','#standards-specialists-heading');
 }finally{await c.close();}
}
const comparisonURL=()=>base+'pages/calendar-compare.html?'+new URLSearchParams({at:'2026-10-29T12:00:00Z',lat:'51.5074',lon:'-0.1278',zone:'Europe/London'});
async function connections(width){
 const {c,page}=await context(width);
 try{
  await page.goto(comparisonURL());await page.locator('#obs-comparison-evidence .ce-frame').first().waitFor();
  const host=page.locator('#obs-comparison-evidence');
  check(await host.locator('.ce-frame').count()===2,'both Sun and Moon frame transforms appear '+width);
  await host.locator('[data-ce-key="map"] > summary').focus();await page.keyboard.press('Enter');
  check(await host.locator('[data-ce-key="map"]').getAttribute('open')!==null,'dependency disclosure operates by keyboard '+width);
  check(await host.locator('.ce-path').count()===5,'five distinct dependency paths remain inspectable '+width);
  await host.locator('[data-ce-key="formulas"] > summary').click();
  await host.locator('[data-ce-key="quantity-yoga"] > summary').click();
  check((await host.locator('[data-ce-key="quantity-yoga"]').innerText()).includes('angular sum'),'yoga is distinguished from elongation '+width);
  await host.locator('[data-ce-key="sources"] > summary').click();
  check((await host.innerText()).includes('unproofread OCR'),'source reading depth is visible '+width);
  const localLinks=await host.locator('a[href]').evaluateAll(els=>[...new Set(els.map(a=>a.href))].filter(u=>new URL(u).origin===location.origin));
  check(localLinks.length>=5&&localLinks.every(u=>u.startsWith(base)),'source links retain project Pages prefix '+width);
  for(const url of localLinks)check((await page.request.get(url)).status()===200,'connection source resolves '+width+' '+new URL(url).pathname);
  const saved=JSON.parse(await download(page,'#obs-json','connections JSON '+width)),e=saved.comparisonEvidence;
  check(e?.kind==='calculation-dependency-explanation'&&e.frames.length===2&&e.quantities.length===5,'export includes structured dependency evidence '+width);
  check(e.frames.every(f=>Math.abs(f.circularResidualDegrees)<1e-9)&&Math.abs(e.sharedLunarGeometry.frameCancellationResidualDegrees)<1e-9,'full-precision frame and elongation identities hold '+width);
  check(e.graph.edges.filter(row=>row.from==='elongation'&&row.kind==='shared-derivation').length===3,'shared lunar derivation is explicit in export '+width);
  const reading=(await download(page,'#obs-markdown','connection reading Markdown '+width)).toString();
  check(reading.includes('## Shared calculations and different conventions')&&reading.includes('"kind": "calculation-dependency-explanation"')&&reading.includes('lunarBoundaryPrecisionNote'),'reading export keeps dependencies and boundary qualification '+width);
  await layout(page,'expanded connections '+width);if(width===390)await shot(page,'connections-390','#obs-comparison-evidence [data-ce-key="map"]');
  await page.locator('#obs-date').fill('2026-10-30');
  check(await host.locator('.ce-frame').count()===0&&await page.locator('#obs-json').isDisabled(),'edited context clears dependency evidence and disables export '+width);
  await page.locator('#obs-update').click();await host.locator('.ce-frame').first().waitFor();
  check((await host.locator('.ce-context').innerText()).includes('2026-10-30'),'updated dependency evidence reflects new moment '+width);
  await page.clock.install({time:new Date('2026-10-29T12:00:00Z')});
  await page.goto(base);await page.waitForFunction(()=>document.querySelectorAll('#weekThis .home-day').length===7);
  check(await page.locator('#homeComparisonEvidence .ce-frame').count()===0,'home connection calculations remain lazy '+width);
  await page.locator('#homeConnections > summary').click();await page.locator('#homeComparisonEvidence .ce-frame').first().waitFor();
  const homeSummary=page.locator('#homeComparisonEvidence [data-ce-key="map"] > summary');
  await homeSummary.focus();await page.keyboard.press('Enter');const previousContext=await page.locator('#homeComparisonEvidence .ce-context').innerText();
  await page.clock.fastForward(61000);
  await page.waitForFunction(old=>document.querySelector('#homeComparisonEvidence .ce-context')?.textContent!==old,previousContext);
  check(await homeSummary.evaluate(el=>document.activeElement===el)&&await page.locator('#homeComparisonEvidence [data-ce-key="map"]').getAttribute('open')!==null,'live minute refresh preserves disclosure and keyboard focus '+width);
  await page.locator('#homeDate').fill('2026-11-02');
  check(await page.locator('#homeComparisonEvidence .ce-frame').count()===0,'home context edit clears open connection evidence '+width);
  await page.locator('#homeRefresh').click();await page.locator('#homeComparisonEvidence .ce-frame').first().waitFor();
  await layout(page,'home connection inspector '+width);
 }finally{await c.close();}
}
async function sigil(width){
 const {c,page}=await context(width);
 try{
  await page.goto(base+'pages/sigil-studio.html');await page.locator('#sg-preview svg').waitFor();
  const initial=await page.locator('#sg-preview').innerHTML();
  const recipeBytes=await download(page,'#sg-json','public recipe for import '+width),recipe=JSON.parse(recipeBytes);
  await page.locator('#sg-recipe-file').setInputFiles({name:'public-recipe.json',mimeType:'application/json',buffer:recipeBytes});await page.locator('#sg-recipe-inspect').click();await page.locator('#sg-recipe-preview svg').waitFor();
  check(await page.locator('#sg-preview').innerHTML()===initial,'replay leaves editable drawing unchanged '+width);
  check(await page.locator('#sg-recipe-consent').isDisabled()&&await page.locator('#sg-recipe-restore').isDisabled(),'public geometry cannot infer private editable inputs '+width);
  check((await page.locator('#sg-recipe-caption').innerText()).toLowerCase().includes('unverified'),'imported source provenance remains unverified '+width);
  const replay=JSON.parse(await download(page,'#sg-recipe-json','replayed JSON '+width));
  check(JSON.stringify(replay.geometry)===JSON.stringify(recipe.geometry)&&!replay.privateInputs&&!replay.privateStudySetup,'replayed JSON preserves geometry without private fields '+width);
  const svg=(await download(page,'#sg-recipe-svg','replayed SVG '+width)).toString();
  check(svg.includes('Unverified file provenance')&&!/<(?:script|foreignObject)\b/.test(svg),'replayed SVG carries bounded numeric provenance '+width);
  await decodePNG(page,await download(page,'#sg-recipe-png','replayed PNG '+width),'replayed geometry '+width);
  await page.locator('#sg-private').check();const privateBytes=await download(page,'#sg-json','private recipe for consent test '+width);
  await page.locator('#sg-recipe-file').setInputFiles({name:'private-recipe.json',mimeType:'application/json',buffer:privateBytes});await page.locator('#sg-recipe-inspect').click();await page.waitForFunction(()=>!document.querySelector('#sg-recipe-consent').disabled);
  check(await page.locator('#sg-recipe-restore').isDisabled(),'matching private recipe waits for explicit restoration consent '+width);
  await page.locator('#sg-text').fill('CHANGED CURRENT TEXT');await page.locator('#sg-recipe-consent').focus();await page.keyboard.press('Space');await page.locator('#sg-recipe-restore').click();
  check(await page.locator('#sg-text').inputValue()===JSON.parse(privateBytes).privateInputs.text&&!(await page.locator('#sg-private').isChecked()),'explicit restoration recalculates controls with private export off '+width);
  const restored=await page.locator('#sg-preview').innerHTML();
  await page.locator('#sg-recipe-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"kind":"sigil-drawing-recipe","svg":"<script>alert(1)</script>"}')});await page.locator('#sg-recipe-inspect').click();await page.locator('#sg-recipe-error:not([hidden])').waitFor();
  check(await page.locator('#sg-preview').innerHTML()===restored&&await page.locator('#sg-recipe-json').isDisabled(),'malformed recipe preserves current design and invalidates replay export '+width);
  await page.locator('#sg-recipe-file').setInputFiles({name:'recovery.json',mimeType:'application/json',buffer:recipeBytes});await page.locator('#sg-recipe-inspect').click();await page.locator('#sg-recipe-preview svg').waitFor();
  check(await page.locator('#sg-recipe-error').isHidden(),'recipe import recovers after an error '+width);
  await layout(page,'recipe replay and recovery '+width);if(width===390)await shot(page,'recipe-390','#sg-recipe-preview');
 }finally{await c.close();}
}
async function ai(width){
 const {c,page}=await context(width);
 try{
  await page.goto(comparisonURL());const host=page.locator('#obs-assistant');await host.locator('.ca-panel').waitFor();await host.locator('summary').click();
  const location=host.getByRole('checkbox',{name:'Include selected coordinates, time zone and civil-calendar rows',exact:true});
  const guidance=host.getByRole('checkbox',{name:'Include sampled historical rules, measured inputs and source qualifications',exact:true});
  const prepare=host.getByRole('button',{name:'Prepare preview',exact:true}),copy=host.getByRole('button',{name:'Copy prompt',exact:true});
  const preview=host.locator('textarea[readonly]'),exportSelector='#obs-assistant .ca-actions button:nth-child(2)';
  await prepare.click();const minimal=JSON.parse(await download(page,exportSelector,'minimal AI packet '+width));
  check(minimal.facts.length===9&&!Object.hasOwn(minimal,'guidance')&&!minimal.disclosures.includeLocation,'default AI packet retains minimal nine facts '+width);
  await host.locator('select').selectOption('guidance');await host.getByRole('button',{name:'Explain locally',exact:true}).click();
  const localAnswer=await host.locator('.ca-local [role="status"]').innerText();
  check(localAnswer.length>200&&localAnswer.includes('separate historical-rule checkbox')&&!(await guidance.isChecked()),'local explanation directs a separate preview choice without opting in '+width);
  await guidance.focus();await page.keyboard.press('Space');
  check(await preview.inputValue()===''&&await copy.isDisabled()&&await page.locator(exportSelector).isDisabled(),'rule disclosure change clears outgoing preview and actions '+width);
  await prepare.click();const rules=JSON.parse(await download(page,exportSelector,'geocentric rule AI packet '+width));
  const serialized=JSON.stringify(rules);
  check(rules.guidance.rules.length===10&&!rules.guidance.temporalHoursIncluded&&rules.facts.length===9,'guidance-only packet has ten geocentric rules '+width);
  check(!serialized.includes('51.5074')&&!serialized.includes('Europe/London')&&!rules.guidance.rules.some(r=>r.id.includes('hour')),'guidance-only packet excludes selected observer and temporal rule '+width);
  check(rules.guidance.rules.every(r=>r.rule&&r.computed&&r.thresholds&&r.sourceIds.length&&r.optionalAction.status),'rules retain measured evidence, thresholds and editorial action status '+width);
  await location.check();check(await preview.inputValue()===''&&await copy.isDisabled(),'location choice independently clears preview '+width);
  await prepare.click();const disclosed=JSON.parse(await download(page,exportSelector,'observer and rule AI packet '+width));
  check(disclosed.guidance.rules.length===11&&disclosed.guidance.temporalHoursIncluded&&disclosed.facts.some(f=>f.kind==='observer-input'&&f.value.latitude===51.5074),'explicit location disclosure includes chosen observer and eleventh rule '+width);
  check(await host.getByRole('link',{name:'Open ChatGPT',exact:true}).getAttribute('href')==='https://chatgpt.com/','ChatGPT handoff remains plain manual link '+width);
  await layout(page,'AI rule disclosure '+width);if(width===390)await shot(page,'ai-rules-390','#obs-assistant .ca-local');
  await page.locator('#obs-lat').fill('52');
  check(await preview.inputValue()===''&&await prepare.isDisabled()&&await page.locator(exportSelector).isDisabled(),'edited chart invalidates AI packet and preparation '+width);
 }finally{await c.close();}
}
async function events(width){
 const {c,page}=await context(width);
 try{
  await page.goto(base+'pages/world-events.html?date=2026-10-29');await page.waitForFunction(()=>!document.querySelector('#we-json').disabled);
  check(await page.locator('#we-pair-a').inputValue()===''&&await page.locator('#we-pair-b').inputValue()==='','event comparison starts with no implied pair '+width);
  await page.locator('#we-pair-a').selectOption('bg-presidential-runoff-2026:2026-11-01');await page.locator('#we-pair-b').selectOption('us-congressional-general-2026:2026-11-03');
  await page.locator('#we-pair-run').click();
  check(await page.locator('#we-pair-json').isDisabled()&&await page.locator('#we-sample-ack').evaluate(el=>document.activeElement===el),'unacknowledged pair is blocked with focus on assumption '+width);
  await page.locator('#we-place').selectOption('newyork');await page.locator('#we-sample-ack').check();await page.locator('#we-pair-run').click();await page.waitForFunction(()=>!document.querySelector('#we-pair-json').disabled);
  const pair=JSON.parse(await download(page,'#we-pair-json','two-event comparison '+width));
  check(pair.kind==='two-event-study-sample-comparison'&&pair.samples.length===2&&pair.calendars.length===13&&pair.observer.timeZone==='America/New_York','pair export keeps both samples, observer and thirteen calendar rows '+width);
  check(pair.elapsedHours===48&&pair.samples.every(s=>s.event.precision==='date-only'&&s.event.sources.length>0),'elapsed UTC time and original event date precision retained '+width);
  check(pair.measures.length===4&&pair.measures.filter(m=>m.unit==='degrees').every(m=>m.difference>=-180&&m.difference<180)&&pair.measures.find(m=>m.id==='illumination').unit==='percentage points','angle and illumination differences have distinct units '+width);
  const table=page.locator('#we-pair-result .we-pair-table-wrap').first();
  check(await table.getAttribute('role')==='region'&&await table.getAttribute('aria-label')==='Calculated quantities · B minus A','comparison table has a named keyboard scroll region '+width);
  if(width<=390){
   check(await page.locator('#we-pair-result .we-pair-scroll-hint').first().isVisible(),'overflowing comparison table provides a scroll cue '+width);
   await table.focus();await page.keyboard.press('ArrowRight');
   await page.waitForFunction(()=>document.querySelector('#we-pair-result .we-pair-table-wrap').scrollLeft>0);
   check(await table.evaluate(el=>el.scrollLeft>0&&document.activeElement===el),'keyboard reveals offscreen comparison columns '+width);
  }
  await layout(page,'two event comparison '+width);if(width===390)await shot(page,'event-pair-390','#we-pair-result');
  await page.locator('#we-pair-b').selectOption('un-women-16-days-2026:2026-11-25');
  check(await page.locator('#we-pair-json').isDisabled()&&await page.locator('#we-pair-result').isHidden(),'changing selected event clears old pair and export '+width);
  await page.locator('#we-pair-date-b').fill('2026-12-20');await page.locator('#we-pair-run').click();
  check(await page.locator('#we-pair-json').isDisabled(),'out-of-range campaign date cannot produce pair export '+width);
  await page.locator('#we-pair-date-b').fill('2026-11-26');await page.locator('#we-pair-run').click();await page.waitForFunction(()=>!document.querySelector('#we-pair-json').disabled);
  await page.locator('#we-lat').fill('41');
  check(await page.locator('#we-pair-json').isDisabled()&&await page.locator('#we-pair-result').isHidden(),'observer edit invalidates both event samples '+width);
  check(Object.values(await page.evaluate(()=>window.__ensemblePermissions)).every(n=>n===0),'event workflow never detects location implicitly '+width);
 }finally{await c.close();}
}
try{
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});origin='http://127.0.0.1:'+server.address().port;base=origin+prefix;
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),args:['--no-sandbox']});report.browser=browser.version();
 for(const width of[320,390,1365]){if(selected('standards'))await standards(width);if(selected('connections'))await connections(width);if(selected('sigil'))await sigil(width);if(selected('ai'))await ai(width);if(selected('events'))await events(width);}
 const after=await product();report.source.productFiles=after;report.source.changedDuringRun=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(p=>before[p]!==after[p]);
 if(report.source.changedDuringRun.length&&process.env.ENSEMBLE_ALLOW_EDITS==='1')report.limits.unfrozenCandidate=true;else check(!report.source.changedDuringRun.length,'product unchanged during verification',report.source.changedDuringRun);
 check(report.source.testScriptSHA256===sha(await readFile(fileURLToPath(import.meta.url))),'test driver unchanged during verification');
 check(!report.errors.length,'zero runtime/console exceptions',report.errors);check(!report.missing.length,'zero missing local resources',report.missing);check(!report.externalRequests.length,'zero implicit external requests',report.externalRequests);
}catch(error){failure=error;report.failure={message:error.message,stack:error.stack};}
finally{await browser?.close();if(server.listening)await new Promise(ok=>server.close(ok));report.finishedAt=new Date().toISOString();report.pass=!failure;await writeFile(resolve(output,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({phase,pass:report.pass,checks:report.checks.length,receipt:resolve(output,'receipt.json')},null,2));}
if(failure)throw failure;
