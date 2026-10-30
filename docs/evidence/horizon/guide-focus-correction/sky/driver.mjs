// Source-bound browser journeys for the interactive sky instrument.
// No provider inference or connected-calendar write is performed.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,process.env.SKY_OUTPUT||'docs/evidence/sky/current');
const phase=process.env.SKY_PHASE||'all';
assert.ok(['all','chart','timeline','alignment','assistant','guides','guide-layout'].includes(phase),'known sky phase');
const widths=(process.env.SKY_WIDTHS||'320,390,1440,1920').split(',').map(Number);
assert.ok(widths.every(width=>Number.isInteger(width)&&width>=320&&width<=2560),'valid widths');
await mkdir(output,{recursive:true});
await writeFile(resolve(output,'driver.mjs'),await readFile(fileURLToPath(import.meta.url)));
const pkg=process.env.PLAYWRIGHT_PKG?await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href):await import('playwright').catch(()=>import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js'));
const chromium=pkg.chromium||pkg.default?.chromium;
const sha=body=>createHash('sha256').update(body).digest('hex');
async function files(dir){const list=[];for(const item of await readdir(resolve(root,dir),{withFileTypes:true})){if(item.name.startsWith('.')||item.name==='node_modules')continue;const rel=dir+'/'+item.name;if(item.isDirectory())list.push(...await files(rel));else list.push(rel);}return list;}
async function product(){const paths=['index.html','sw.js','manifest.webmanifest',...await files('assets'),...await files('pages'),...(await files('mcp')).filter(p=>/\.(mjs|json)$/.test(p))];return Object.fromEntries(await Promise.all(paths.sort().map(async p=>[p,sha(await readFile(resolve(root,p)))])));}
const before=await product();
const report={schemaVersion:1,phase,round:process.env.SKY_ROUND||'candidate',startedAt:new Date().toISOString(),checks:[],downloads:[],screenshots:[],fonts:[],errors:[],missing:[],externalRequests:[],mockProviderRequests:[],source:{testScriptSHA256:sha(await readFile(fileURLToPath(import.meta.url))),productAtStartSHA256:sha(JSON.stringify(before))},limits:{realProviderCalled:false,mockedProviderTransport:true,physicalPhone:false,screenReader:false,calendarProviderWrite:false}};
const prefix='/astrology-sim-ant/';
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(prefix))return res.writeHead(404).end();if(u.pathname.startsWith(prefix+'__sky-test-provider/')){const chunks=[];for await(const chunk of req)chunks.push(chunk);const data=JSON.parse(Buffer.concat(chunks).toString()),entry={path:u.pathname,method:req.method,model:data.model,stream:data.stream,systemSHA256:sha(data.messages[0].content),userSHA256:sha(data.messages[1].content),hasAuthorization:!!req.headers.authorization,completed:false,closed:false};report.mockProviderRequests.push(entry);res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store'});const send=text=>res.write('data: '+JSON.stringify({choices:[{delta:{content:text}}]})+'\n\n');send(u.pathname.endsWith('/slow')?'Partial fixture answer. ':'Fixture model response [SKY-F-SELECTED]. <img src=x onerror=alert(1)> [UNKNOWN-TEST-ID]');const finish=()=>{entry.completed=true;res.end('data: [DONE]\n\n');};if(u.pathname.endsWith('/slow')){const timer=setTimeout(finish,1000);res.on('close',()=>{entry.closed=true;clearTimeout(timer);});}else finish();return;}let rel=decodeURIComponent(u.pathname.slice(prefix.length));if(!rel||rel.endsWith('/'))rel+='index.html';const path=resolve(root,rel);if(!path.startsWith(root+sep)||rel.split('/').some(p=>p.startsWith('.')))return res.writeHead(403).end();res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'}).end(await readFile(path));}catch{return res.writeHead(404).end('Not found');}});
let browser,failure,base,origin;
const check=(ok,label,details)=>{report.checks.push({label,pass:!!ok,...(details!==undefined?{details}:{})});assert.ok(ok,label+(details!==undefined?' '+JSON.stringify(details):''));};
const selected=name=>phase==='all'||phase===name;
const fixture={at:'2026-10-29T12:00:00Z',lat:'51.5074',lon:'-0.1278',zone:'Europe/London'};
const url=(extra={})=>base+'pages/calendar-atlas.html?'+new URLSearchParams({...fixture,...extra});

async function context(width){
 const c=await browser.newContext({viewport:{width,height:900},locale:'en-US',reducedMotion:'reduce',serviceWorkers:'block',acceptDownloads:true});
 await c.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===origin||['data:','blob:'].includes(u.protocol))return r.continue();report.externalRequests.push(u.href);return r.abort('blockedbyclient');});
 await c.addInitScript(()=>{window.__skyPermissionCalls=0;Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(_ok,no)=>{window.__skyPermissionCalls++;no({code:1,message:'Fixture denies'});}}});});
 const page=await c.newPage();page.setDefaultTimeout(20000);
 page.on('pageerror',e=>report.errors.push({url:page.url(),message:e.message}));
 page.on('console',m=>{if(m.type()==='error')report.errors.push({url:page.url(),message:m.text(),kind:'console'});});
 page.on('response',r=>{if(r.status()>=400)report.missing.push({url:r.url(),status:r.status()});});
 return{c,page};
}
async function layout(page,label){
 const v=await page.evaluate(()=>{const link=document.querySelector('.skip-link');return{width:innerWidth,scroll:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,header:!!document.querySelector('header.site'),skip:!!link&&!!document.querySelector(link.getAttribute('href'))};});
 check(v.scroll<=v.width+1&&v.main===1&&v.header&&v.skip,label+' reflow and landmarks',v);
}
async function shot(page,label,selector){if(selector)await page.locator(selector).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));const file=label+'.png';await page.screenshot({path:resolve(output,file)});report.screenshots.push(file);}
async function download(page,selector,label){const pending=page.waitForEvent('download');await page.locator(selector).click();const item=await pending;check(await item.failure()===null,label+' download completed');const body=await readFile(await item.path());report.downloads.push({label,filename:item.suggestedFilename(),bytes:body.length,sha256:sha(body)});check(body.length>40,label+' nonempty artifact');return body;}
async function fonts(page,selector,label){
 let client;const item={label,selector,viewport:page.viewportSize()};
 try{item.metrics=await page.locator(selector).evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return{fontFamily:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,width:r.width,height:r.height,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};});client=await page.context().newCDPSession(page);await client.send('DOM.enable');await client.send('CSS.enable');const doc=await client.send('DOM.getDocument'),node=await client.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector});item.platformFonts=(await client.send('CSS.getPlatformFontsForNode',{nodeId:node.nodeId})).fonts;}catch(error){item.warning=error.message;}finally{await client?.detach();}
 report.fonts.push(item);
}
async function focusedGuideControl(page){await page.evaluate(()=>new Promise(requestAnimationFrame));return page.evaluate(()=>{const el=document.activeElement,host=document.querySelector('#tool-assistant'),r=el.getBoundingClientRect(),top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{inside:host.contains(el),tag:el.tagName,id:el.id,text:el.textContent?.slice(0,100),rect:r.toJSON(),visibleHit:!!top&&(top===el||el.contains(top)),topTag:top?.tagName,topId:top?.id,topClass:top?.className};});}

async function open(page,extra={}){await page.goto(url(extra));await page.locator('#sky-chart svg').waitFor();check(await page.locator('#sky-error').isHidden(),'calculated sky opens without a surfaced error '+page.viewportSize().width);}
async function svgDocument(page,body){return page.evaluate(text=>{const d=new DOMParser().parseFromString(text,'image/svg+xml');return{errors:d.querySelectorAll('parsererror').length,metadata:JSON.parse(d.querySelector('metadata').textContent),title:d.querySelector('title')?.textContent,description:d.querySelector('desc')?.textContent,executable:d.querySelectorAll('script,foreignObject').length};},body.toString());}
async function currentReading(page,label){return JSON.parse(await download(page,'#sky-reading-json',label));}
async function sourceLinks(page,selector,label,expectedURLs=[]){
 const links=await page.locator(selector).evaluateAll(els=>[...new Set(els.map(el=>el.href))]);
 const expected=[...new Set(expectedURLs.filter(url=>url&&!/^https?:/i.test(url)).map(url=>new URL(url,base).href))];
 check(expected.every(url=>links.includes(url)),label+' exposes every referenced local source at the application root',{expected,links});
 const local=links.filter(url=>new URL(url).origin===origin),receipts=[];
 for(const href of local){const response=await page.request.get(href),body=await response.body();receipts.push({href,status:response.status(),bytes:body.length,sha256:sha(body)});}
 (report.sourceLinks??=[]).push({label,page:page.url(),links,localResponses:receipts});
 check(receipts.every(row=>row.status===200&&row.bytes>0&&row.href.startsWith(base)),label+' actual local source endpoints return nonempty files',receipts);
}
async function chart(width){
 const {c,page}=await context(width);
 try{
  await open(page);check(await page.locator('#sky-view-zodiac').getAttribute('aria-pressed')==='true'&&await page.locator('#sky-chart').isVisible(),'deep chart is the default functional view '+width);
  if(width<=390){const controls=await page.locator('.sky-toolbar button').evaluateAll(els=>els.map(el=>({label:el.textContent,fontSize:parseFloat(getComputedStyle(el).fontSize),height:el.getBoundingClientRect().height})));check(controls.length===4&&controls.every(c=>c.fontSize>=16&&c.height>=44),'mobile instrument controls retain16px text and44px targets '+width,controls);}
  const initial=await currentReading(page,'public sky calculation '+width);
  check(initial.kind==='sky-explorer-reading'&&initial.snapshot.bodies.length===10&&initial.snapshot.context.dateISO==='2026-10-29T12:00:00.000Z','public export contains ten actually calculated bodies at the chosen instant '+width);
  check(initial.privateBirthIncluded===false&&initial.context.lat===51.5074&&initial.context.lon===-.1278,'public casting identifies its observer without a birth record '+width);
  const diagram=await svgDocument(page,await download(page,'#sky-svg','deep chart SVG '+width));
  check(!diagram.errors&&!diagram.executable&&diagram.metadata.kind==='interactive-sky-wheel'&&diagram.metadata.privateBirthIncluded===false,'deep chart exports inert parseable SVG with public metadata '+width);
  check(diagram.metadata.bodies.every(b=>initial.snapshot.bodies.some(p=>p.id===b.id&&p.longitude===b.longitude)),'SVG body metadata equals actual calculation export '+width);
  const geometry=await page.locator('#sky-chart [data-body][data-longitude]').evaluateAll(els=>els.filter(el=>!el.dataset.skyBody.includes(':')).map(el=>{const circle=el.querySelector('circle');return{id:el.dataset.body,longitude:Number(el.dataset.longitude),x:Number(circle?.getAttribute('cx')),y:Number(circle?.getAttribute('cy'))};}));
  check(geometry.length===10&&geometry.every(p=>Math.abs((((Math.atan2(p.y-360,p.x-360)*180/Math.PI+90)-p.longitude+540)%360)-180)<1e-7),'displayed marker geometry independently recovers calculated longitude '+width,geometry);
  for(const id of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']){
   await page.locator('#sky-body').selectOption(id);check((await page.locator('#sky-body-details').innerText()).includes(id)&&await page.locator(`#sky-chart [data-sky-body="${id}"]`).getAttribute('aria-pressed')==='true','body selection updates inspector and plotted selection '+id+' '+width);
  }
  const outer=await currentReading(page,'outer planet historical scope '+width);
  check(outer.interpretation.lenses.every(l=>l.rules.some(r=>r.classification==='unavailable'&&r.id.endsWith('UNSUPPORTED'))),'outer-planet reading retains explicit historical scope '+width);
  const mercury=page.locator('#sky-chart [data-sky-body="Mercury"]');await mercury.focus();await page.keyboard.press('Enter');
  check(await page.locator('#sky-body').inputValue()==='Mercury','keyboard activation selects the actual plotted planet '+width);
  check(await page.locator('#sky-chart [data-sky-body="Mercury"]').evaluate(el=>document.activeElement===el),'keyboard chart selection preserves focus on replacement marker '+width);
  await page.locator('#sky-stars').check();const starValue=await page.locator('#sky-body option').evaluateAll(els=>els.find(el=>el.value.startsWith('star:'))?.value);check(!!starValue,'named star catalogue is available '+width);await page.locator('#sky-body').selectOption(starValue);
  check((await page.locator('#sky-body-details').innerText()).includes(starValue.slice(5))&&/approx|catalog|inherited/i.test(await page.locator('#sky-body-details').innerText()),'star inspector retains model and catalogue qualification '+width);
  const catalogueValue=await page.locator('#sky-body option').evaluateAll(els=>els.find(el=>el.value.startsWith('catalog:'))?.value);check(!!catalogueValue&&initial.snapshot.catalogStars.length===20,'bounded modern catalogue is distinct from inherited markers '+width);await page.locator('#sky-body').selectOption(catalogueValue);check((await page.locator('#sky-body-details').innerText()).includes('proper motion')&&(await page.locator('#sky-body-details').innerText()).includes('not every star'),'modern star selection identifies model and incomplete coverage '+width);
  const modernDrawing=await svgDocument(page,await download(page,'#sky-svg','modern catalogue geometry '+width));check(modernDrawing.metadata.catalogStars.length===20&&modernDrawing.metadata.catalogStars.every(s=>initial.snapshot.catalogStars.some(p=>p.id===s.id&&p.longitude===s.longitude)),'catalogue SVG positions agree with actual propagated-star output '+width);
  await page.locator('#sky-body').selectOption('Moon');
  const sourceReading=await currentReading(page,'source-backed Moon reading '+width);
  check(sourceReading.interpretation.lenses.length===3&&sourceReading.interpretation.lenses.every(l=>l.rules.length>0&&l.rules.every(r=>r.sourceIds.length&&r.sourceIds.every(id=>sourceReading.interpretation.sources.some(s=>s.id===id)))),'every implemented source lens resolves its rule citations '+width);
  await sourceLinks(page,'#sky-reading .sky-source a','atlas source navigation '+width,sourceReading.interpretation.sources.map(source=>source.url));
  for(const id of ['lilly','agrippa','jyotisha'])await page.locator(`#sky-lenses input[value="${id}"]`).uncheck();
  check((await page.locator('#sky-reading').innerText()).includes('Choose at least one')&&(await currentReading(page,'empty reading lenses '+width)).interpretation===null,'empty source selection does not invent a reading '+width);
  await page.locator('#sky-lenses input[value="agrippa"]').check();check((await currentReading(page,'selected Agrippa lens '+width)).interpretation.lenses.map(l=>l.id).join(',')==='agrippa','selected lens export contains exactly the requested tradition '+width);
  await page.locator('#sky-view-orbit').click();await page.locator('#sky-scale').selectOption('linear');
  const linear=await svgDocument(page,await download(page,'#sky-svg','linear AU orbit projection '+width));
  check(linear.metadata.kind==='heliocentric-projection'&&linear.metadata.scale==='linear'&&linear.metadata.units==='AU'&&linear.metadata.vectors.some(b=>b.id==='Earth')&&linear.description.includes('Body sizes'),'orbital view separates physical AU vectors from symbol sizes '+width);
  check(linear.metadata.vectors.every(v=>Math.abs(Math.hypot(v.x,v.y,v.z)-v.distanceAU)<1e-12),'orbit export retains the physical 3D vector norm '+width);
  await page.locator('#sky-scale').selectOption('sqrt');await page.locator('#sky-yaw').fill('75');await page.locator('#sky-yaw').dispatchEvent('input');
  const compressed=await svgDocument(page,await download(page,'#sky-svg','rotated compressed orbit projection '+width));
  check(compressed.metadata.scale==='sqrt'&&compressed.metadata.yawDegrees===75&&JSON.stringify(compressed.metadata.vectors)===JSON.stringify(linear.metadata.vectors),'changing display projection preserves physical positions '+width);
  check(compressed.description.includes('not a physical distance scale')&&!JSON.stringify(compressed.metadata).includes('51.5074'),'compressed projection discloses scale and SVG omits observer coordinates '+width);
  if(width===1440)await shot(page,'orbit-1440','#sky-chart');
  await page.locator('#sky-view-simple').click();check(await page.locator('#atlas-dial svg').isVisible(),'original Sun–Moon plate remains available '+width);await page.locator('#sky-view-zodiac').click();
  await layout(page,'deep sky '+width);await fonts(page,'#sky-body-details','body inspector '+width);if(width===390||width===1440||width===1920)await shot(page,'deep-chart-'+width,'#atlas-sky-explorer');
  await page.locator('#atlas-date').fill('2027-03-20');check(await page.locator('#sky-svg').isDisabled()&&await page.locator('#sky-reading-json').isDisabled()&&await page.locator('#sky-stale').isVisible(),'moment edit invalidates sky export and interpretation '+width);
  check(await page.locator('#sky-view-orbit').isDisabled()&&await page.locator('#sky-body').isDisabled()&&await page.locator('#sky-overlay').isDisabled()&&await page.locator('#sky-chart [data-sky-body]').evaluateAll(els=>els.every(el=>el.getAttribute('aria-disabled')==='true'&&el.getAttribute('tabindex')==='-1')),'stale chart cannot be relabelled or reinterpreted through active controls '+width);
  await page.locator('#atlas-update').click();await page.waitForFunction(()=>!document.querySelector('#sky-reading-json').disabled);
  const future=await currentReading(page,'future recasting '+width);check(future.snapshot.context.dateISO.startsWith('2027-03-20')&&future.snapshot.bodies.find(b=>b.id==='Sun').longitude!==initial.snapshot.bodies.find(b=>b.id==='Sun').longitude,'future casting recomputes actual positions '+width);
  if(width===1440){await page.setViewportSize({width:720,height:500});await layout(page,'720px zoom-reflow proxy');await page.locator('#sky-view-orbit').focus();const b=await page.locator('#sky-view-orbit').boundingBox();check(b.y>=0&&b.y+b.height<=500,'zoom-reflow keyboard control is not obscured',b);await page.setViewportSize({width,height:900});}
  if(width===390){await page.goto(base+'pages/calendars/western.html?'+new URLSearchParams(fixture));await page.locator('#sky-reading .sky-source a').first().waitFor();await sourceLinks(page,'#sky-reading .sky-source a','nested western family source navigation',sourceReading.interpretation.sources.map(source=>source.url));}
 }finally{await c.close();}
}
async function timeline(width){
 const {c,page}=await context(width);
 try{
  await open(page);await page.locator('#sky-window').selectOption('two-days');await page.locator('#sky-build-timeline').click();await page.waitForFunction(()=>!document.querySelector('#sky-time-results').hidden&&!document.querySelector('#sky-timeline-json').disabled,{},{timeout:60000});
  const short=JSON.parse(await download(page,'#sky-timeline-json','hourly two-day timeline '+width));
  check(short.request.stepHours===1&&short.samples.length===49&&short.samples[0].dateISO==='2026-10-28T12:00:00.000Z'&&short.samples.at(-1).dateISO==='2026-10-30T12:00:00.000Z','hourly timeline is dynamically calculated around the selected instant '+width);
  check(short.samples.every(s=>s.positions.length===10)&&short.sampling.continuousTrajectory===false&&short.sampling.allTransitionsDetected===false,'timeline distinguishes sampled coordinates from complete transition detection '+width);
  check(await page.locator('#sky-timeline [data-timeline-body="Moon"]').getAttribute('data-rendering')==='sample-path','hourly Moon trace uses the declared sampled path '+width);
  await page.locator('#sky-time-range').fill('36');await page.locator('#sky-time-range').dispatchEvent('input');await page.locator('#sky-sample-cast').click();await page.waitForFunction(at=>document.querySelector('#atlas-context').textContent.includes(at),short.samples[36].dateISO);
  const cast=await currentReading(page,'timeline sample recast '+width);
  check(cast.context.dateISO===short.samples[36].dateISO&&cast.snapshot.bodies.every(b=>short.samples[36].positions.find(p=>p.id===b.id)?.longitude===b.longitude),'timeline sample casts the exact UTC positions into the atlas '+width);
  await page.locator('#sky-sample-next').click();const next=await currentReading(page,'next calculated sample '+width);check(next.context.dateISO===short.samples[37].dateISO,'next sample advances the actual calculation '+width);
  await page.locator('#sky-step').selectOption('24');check(await page.locator('#sky-timeline-json').isDisabled()&&await page.locator('#sky-time-results').isHidden(),'edited timeline settings invalidate prior result '+width);
  await page.locator('#sky-window').selectOption('ten-years');await page.locator('#sky-build-timeline').click();await page.locator('#sky-cancel-timeline').click();check((await page.locator('#sky-timeline-status').innerText()).toLowerCase().includes('cancel')&&await page.locator('#sky-timeline-json').isDisabled(),'active timeline can be cancelled without exporting stale work '+width);
  await page.locator('#sky-window').selectOption('sixty-days');await page.locator('#sky-build-timeline').click();await page.waitForFunction(()=>!document.querySelector('#sky-time-results').hidden&&!document.querySelector('#sky-timeline-json').disabled,{},{timeout:60000});const replacement=JSON.parse(await download(page,'#sky-timeline-json','replacement job after cancellation '+width));check(replacement.request.stepHours===24&&replacement.samples.length===61&&replacement.request.spanDays===60,'replacement job cannot receive the cancelled ten-year result '+width);
  await page.locator('#sky-window').selectOption('ten-years');
  await page.locator('#sky-build-timeline').click();await page.waitForFunction(()=>!document.querySelector('#sky-time-results').hidden&&!document.querySelector('#sky-timeline-json').disabled,{},{timeout:60000});
  const long=JSON.parse(await download(page,'#sky-timeline-json','calculated ten-year timeline '+width));
  check(long.request.startISO.startsWith('2021-')&&long.request.endISO.startsWith('2031-')&&long.samples.length>250&&long.events.some(e=>e.kind==='solar-quarter')&&long.events.some(e=>e.kind==='lunar-quarter'),'ten-year timeline computes both historical and future samples and solved event types '+width);
  check(long.sampling.warnings.some(w=>w.includes('Moon'))&&await page.locator('#sky-sampling-warning').isVisible()&&(await page.locator('#sky-sampling-warning').innerText()).includes('Moon'),'coarse lunar aliasing is visible beside the timeline '+width);
  const moonTrace=page.locator('#sky-timeline [data-timeline-body="Moon"]');check(await moonTrace.getAttribute('data-rendering')==='sample-points'&&await moonTrace.locator('circle').count()===long.samples.length&&await moonTrace.locator('path').count()===0,'coarse Moon is shown as actual sample points without an aliased connecting curve '+width);
  const plottedMoon=await moonTrace.locator('circle').evaluateAll(els=>els.map(el=>({x:Number(el.getAttribute('cx')),y:Number(el.getAttribute('cy'))}))),start=Date.parse(long.samples[0].dateISO),end=Date.parse(long.samples.at(-1).dateISO);check(plottedMoon.every((p,i)=>Math.abs(p.x-(65+(Date.parse(long.samples[i].dateISO)-start)/(end-start)*1010))<.011&&Math.abs(p.y-(320-long.samples[i].positions.find(x=>x.id==='Moon').longitude/360*280))<.011),'every plotted coarse Moon point retains its actual sample time and longitude '+width);
  const region=page.locator('#sky-timeline');await region.focus();const scroll=await region.evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));if(scroll.scroll>scroll.client+1){await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);check(await region.evaluate(el=>el.scrollLeft)>0,'timeline scroll responds to keyboard '+width);}
  await layout(page,'calculated timeline '+width);if(width===390||width===1440)await shot(page,'timeline-'+width,'#sky-timeline-heading');
  await page.locator('#atlas-zone').fill('Pacific/Kiritimati');await page.locator('#atlas-update').click();await page.waitForFunction(()=>!document.querySelector('#sky-reading-json').disabled);check(await page.locator('#sky-timeline-json').isDisabled()&&await page.locator('#sky-time-results').isHidden(),'time-zone change cannot reuse old timeline local labels '+width);
  await page.locator('#sky-window').selectOption('custom');await page.locator('#sky-start').fill('2026-10-30');await page.locator('#sky-end').fill('2026-10-29');await page.locator('#sky-build-timeline').click();await page.waitForFunction(()=>document.querySelector('#sky-cancel-timeline').disabled);check(/end|later|range/i.test(await page.locator('#sky-timeline-status').innerText())&&await page.locator('#sky-timeline-json').isDisabled(),'invalid custom interval reports a recoverable error '+width);
 }finally{await c.close();}
}
async function alignment(width){
 const {c,page}=await context(width);
 try{
  await open(page);await page.locator('#sky-overlay').click();check(await page.locator('#sky-overlay').getAttribute('aria-expanded')==='true'&&await page.locator('#sky-overlay-panel').isVisible(),'calendar overlay opens with semantic state '+width);
  await page.locator('#sky-alignment-zone').fill('Pacific/Kiritimati');await page.locator('#sky-alignment-apply').click();
  const same=await currentReading(page,'same instant different calendar clocks '+width),a=same.alignment;
  check(a.synchronization.sameInstant===true&&a.synchronization.elapsedSeconds===0&&a.synchronization.base.localDate!==a.synchronization.comparison.localDate,'same UTC keeps sky fixed while date-line clock changes civil date '+width);
  check(a.synchronization.geographicZoneMatch==='not-verified'&&a.synchronization.providerSync==='not-connected','clock alignment does not claim geographic verification or connected sync '+width);
  check(a.rings.every(r=>r.frame&&r.sourceIds.length)&&a.legend.some(r=>r.status==='unavailable')&&!a.rings.some(r=>r.id==='gregory'||r.id==='hebrew'),'only sourced angular methods become rings; unavailable civil methods remain labelled '+width);
  const ticks=await page.locator('#sky-chart [data-ring][data-sector-start]').evaluateAll(els=>els.map(el=>({ring:el.dataset.ring,angle:Number(el.dataset.sectorStart),xy:el.getAttribute('d').match(/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi).slice(0,2).map(Number)})));check(ticks.length>20&&ticks.every(t=>a.rings.find(r=>r.id===t.ring)?.sectors.some(s=>s.startDegrees===t.angle)&&Math.abs((((Math.atan2(t.xy[1]-360,t.xy[0]-360)*180/Math.PI+90)-t.angle+540)%360)-180)<1e-7),'overlay tick geometry uses the shared tropical angle exactly once '+width);
  const firstRing=page.locator('#sky-ring-controls input').first(),id=await firstRing.inputValue();await firstRing.uncheck();const without=await svgDocument(page,await download(page,'#sky-svg','selected calendar overlay SVG '+width));check(!without.metadata.overlays.includes(id),'ring selection changes exported geometry metadata '+width);
  await page.locator('#sky-alignment-mode').selectOption('same-local-clock');await page.locator('#sky-alignment-apply').click();const local=(await currentReading(page,'same wall clock different instant '+width)).alignment;
  check(local.synchronization.sameLocalClock===true&&local.synchronization.sameInstant===false&&local.synchronization.elapsedSeconds===-14*3600,'same clock comparison exposes its actual UTC shift '+width);
  const calendarDetails=page.locator('.sky-calendar-export');await calendarDetails.locator('summary').click();await page.locator('#sky-ics-preview').click();const minimal=(await download(page,'#sky-ics-download','minimal calendar import '+width)).toString();const unfolded=minimal.replace(/\r\n[ \t]/g,'');
  check(unfolded.includes('DTSTART:20261029T120000Z')&&!unfolded.includes('DTEND:')&&unfolded.includes('Manual import only')&&!unfolded.includes('51.5074')&&!unfolded.includes('Europe/London'),'minimal ICS exports exact base study instant without observer details or invented duration '+width);
  check(minimal.endsWith('\r\n')&&!/(^|[^\r])\n/.test(minimal)&&minimal.split('\r\n').every(line=>Buffer.byteLength(line,'utf8')<=75),'ICS uses CRLF and RFC5545 octet-bounded folded lines '+width);
  await page.locator('#sky-ics-context').check();check(await page.locator('#sky-ics-download').isDisabled(),'calendar context disclosure requires a fresh preview '+width);await page.locator('#sky-ics-preview').click();const disclosed=(await download(page,'#sky-ics-download','explicit observer calendar import '+width)).toString().replace(/\r\n[ \t]/g,'');check(disclosed.includes('51.5074')&&disclosed.includes('Europe/London')&&disclosed.includes('Selected methods:'),'explicit ICS context option includes the previewed observer and methods '+width);
  await layout(page,'calendar overlay '+width);if(width===390||width===1440)await shot(page,'alignment-'+width,'#sky-overlay-heading');
  await open(page,{at:'2024-11-03T01:30:00Z',zone:'UTC'});await page.locator('#sky-overlay').click();await page.locator('#sky-alignment-zone').fill('America/New_York');await page.locator('#sky-alignment-mode').selectOption('same-local-clock');await page.locator('#sky-alignment-apply').click();
  const fold=(await currentReading(page,'unresolved repeated comparison clock '+width)).alignment;check(fold.synchronization.status==='unresolved'&&fold.synchronization.code==='AMBIGUOUS_TIME'&&fold.synchronization.candidatesUTC.length===2,'repeated wall clock remains unresolved until chosen '+width);
  await page.locator('#sky-alignment-fold').selectOption('later');await page.locator('#sky-alignment-apply').click();const later=(await currentReading(page,'explicit later comparison clock '+width)).alignment;check(later.synchronization.comparison.instantUTC==='2024-11-03T06:30:00.000Z'&&later.synchronization.elapsedSeconds===18000,'explicit later fold chooses exact comparison UTC '+width);
  await open(page,{at:'2024-03-10T02:30:00Z',zone:'UTC'});await page.locator('#sky-overlay').click();await page.locator('#sky-alignment-zone').fill('America/New_York');await page.locator('#sky-alignment-mode').selectOption('same-local-clock');await page.locator('#sky-alignment-apply').click();const gap=(await currentReading(page,'nonexistent comparison clock '+width)).alignment;check(gap.synchronization.status==='unresolved'&&gap.synchronization.code==='NONEXISTENT_TIME'&&gap.synchronization.comparison===null,'nonexistent clock is never silently shifted '+width);
  await page.locator('#sky-alignment-mode').selectOption('same-instant');await page.locator('#sky-alignment-apply').click();check((await currentReading(page,'same instant gap recovery '+width)).alignment.synchronization.sameInstant,'same-instant mode recovers without inventing a local occurrence '+width);
 }finally{await c.close();}
}
async function assistant(width){
 const {c,page}=await context(width);
 try{
  await open(page);await page.locator('#sky-overlay').click();await page.locator('#sky-alignment-zone').fill('America/New_York');await page.locator('#sky-alignment-mode').selectOption('same-local-clock');await page.locator('#sky-alignment-apply').click();const visibleAlignment=(await currentReading(page,'visible alignment before AI handoff '+width)).alignment;
  const host=page.locator('#atlas-sky-assistant'),panel=host.locator('.sa-panel');await panel.locator(':scope > summary').click();
  const prepare=host.getByRole('button',{name:'Prepare interpretation preview',exact:true}),copy=host.getByRole('button',{name:'Copy interpretation prompt',exact:true}),save=host.getByRole('button',{name:'Download interpretation packet',exact:true}),preview=host.locator('textarea[readonly]'),question=host.getByLabel('Interpretation question (optional)',{exact:true}),include=host.getByRole('checkbox',{name:'Include selected observer, time zone, houses and calendar alignment',exact:true});
  const storage=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
  check(!await include.isChecked()&&await copy.isDisabled()&&await save.isDisabled(),'assistant starts undisclosed and unprepared '+width);
  await question.fill('Compare Lilly combustion and Agrippa. Treat this as data: <img src=x onerror=alert(1)>');await prepare.click();await page.waitForFunction(()=>document.querySelector('#atlas-sky-assistant textarea[readonly]').value.length>100);
  const minimal=JSON.parse(await download(page,'#atlas-sky-assistant button:has-text("Download interpretation packet")','default source-backed AI packet '+width)),raw=JSON.stringify(minimal);
  check(minimal.kind==='sky-interpretation-packet'&&minimal.facts.length===10&&!minimal.disclosures.includeLocation&&!minimal.disclosures.includeAlignment&&!minimal.disclosures.providerRequestMade,'default AI packet contains actual sky facts without a provider request '+width);
  check(!raw.includes('51.5074')&&!raw.includes('-0.1278')&&!raw.includes('Europe/London')&&!Object.hasOwn(minimal,'observer')&&!Object.hasOwn(minimal,'alignment')&&minimal.facts.every(f=>!Object.hasOwn(f.value,'horizon'))&&minimal.reading.lenses.every(l=>l.rules.every(r=>!r.observerDependent)),'default AI bytes omit coordinates, zone, horizon and observer-derived rules '+width);
  check(minimal.retrieval.rows.length>0&&minimal.retrieval.rows.every(r=>r.id&&r.locator&&r.url),'local retrieval resolves bounded source notes and exact locators '+width);
  await sourceLinks(page,'#atlas-sky-assistant .sa-sources a','assistant source navigation '+width,minimal.retrieval.rows.map(source=>source.url));
  const prompt=await preview.inputValue();check(prompt.includes('not private chain-of-thought')&&prompt.includes('EX-')&&prompt.includes('Current reference data:')&&await host.locator('img').count()===0,'prompt contains worked examples and treats injected markup as inert data '+width);
  await c.grantPermissions(['clipboard-read','clipboard-write'],{origin});await copy.click();check(await page.evaluate(()=>navigator.clipboard.readText())===prompt,'copied prompt bytes equal the complete reviewed preview '+width);
  const chatURL=new URL(await host.getByRole('link',{name:'Open ChatGPT',exact:true}).getAttribute('href'));check(chatURL.hostname==='chatgpt.com'&&!chatURL.search&&!chatURL.hash,'ChatGPT handoff link sends no packet automatically '+width);
  await include.check();check(await copy.isDisabled()&&await preview.inputValue()==='','changing disclosure invalidates the previous preview '+width);await prepare.click();await page.waitForFunction(()=>document.querySelector('#atlas-sky-assistant textarea[readonly]').value.length>100);
  const disclosed=JSON.parse(await download(page,'#atlas-sky-assistant button:has-text("Download interpretation packet")','explicit observer AI packet '+width));check(disclosed.observer.lat===51.5074&&disclosed.observer.timeZone==='Europe/London'&&disclosed.disclosures.includeAlignment&&JSON.stringify(disclosed.alignment.synchronization)===JSON.stringify(visibleAlignment.synchronization),'explicit AI disclosure preserves the exact visible comparison zone, clock mode and UTC mismatch '+width,{visible:visibleAlignment.synchronization,packet:disclosed.alignment.synchronization});
  await page.locator('#sky-alignment-zone').fill('Asia/Kolkata');check(await preview.inputValue()===''&&await save.isDisabled(),'comparison setting edit invalidates a prepared AI interpretation '+width);check(await page.locator('#sky-reading-json').isDisabled(),'pending comparison settings cannot export the previous alignment as current '+width);await page.locator('#sky-alignment-apply').click();
  await include.uncheck();await prepare.click();await page.locator('#sky-body').selectOption('Mars');check(await preview.inputValue()===''&&await save.isDisabled(),'selecting another planet invalidates the prepared AI answer context '+width);
  await host.locator('.sa-provider > summary').click();const endpoint=host.getByLabel('Complete API endpoint',{exact:true}),model=host.getByLabel('Model',{exact:true}),key=host.getByLabel('API key (optional for local models)',{exact:true}),consent=host.getByRole('checkbox',{name:'I reviewed the preview and want to send it to the endpoint shown here',exact:true}),send=host.getByRole('button',{name:'Send reviewed interpretation',exact:true});
  await endpoint.fill(base+'__sky-test-provider/complete');await model.fill('qa-fixture-only');await key.fill('qa-fixture-key-not-a-secret');await prepare.click();check(await send.isDisabled(),'provider request requires separate reviewed-preview consent '+width);
  const transportPreview=await preview.inputValue(),divider='\n\nCurrent reference data:\n',parts=transportPreview.split(divider);check(parts.length===2&&!transportPreview.includes('qa-fixture-key-not-a-secret'),'provider key is absent from preview bytes '+width);await consent.check();const requestStart=report.mockProviderRequests.length;await send.click();await page.waitForFunction(()=>document.querySelector('#atlas-sky-assistant .sa-status').textContent.includes('Model response received'));
  const request=report.mockProviderRequests[requestStart];check(request?.method==='POST'&&request.model==='qa-fixture-only'&&request.systemSHA256===sha(parts[0])&&request.userSHA256===sha(parts[1]),'mock transport receives exactly the reviewed system and user prompt bytes '+width);
  check((await host.locator('.sa-output').innerText()).includes('<img src=x')&&await host.locator('.sa-output img').count()===0&&(await host.locator('.sa-citations').innerText()).includes('UNKNOWN-TEST-ID'),'streamed answer stays inert text and flags unknown citation identifiers '+width);
  check(await send.isDisabled()&&!await consent.isChecked(),'completed response clears transmission consent '+width);
  await endpoint.fill(base+'__sky-test-provider/slow');await prepare.click();await consent.check();await send.click();await page.waitForFunction(()=>document.querySelector('#atlas-sky-assistant .sa-output').textContent.includes('Partial fixture answer'));
  await question.fill('Changed while the fixture response is streaming.');await page.waitForTimeout(1100);check(await preview.inputValue()===''&&(await host.locator('.sa-output').innerText())===''&&await send.isDisabled(),'input edits abort a stream and discard stale late response text '+width);
  check(JSON.stringify(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})))===JSON.stringify(storage),'assistant and temporary provider key do not alter browser storage '+width);
  await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide')));check(await key.inputValue()==='','leaving-page lifecycle clears the in-memory provider key '+width);
  await layout(page,'source-backed assistant '+width);await fonts(page,'#atlas-sky-assistant .sa-status','assistant status '+width);if(width===390||width===1440)await shot(page,'assistant-'+width,'#atlas-sky-assistant');
 }finally{await c.close();}
}
async function guides(width){
 const {getToolGuide}=await import(pathToFileURL(resolve(root,'assets/js/core/tool-guide.js')).href),{TOOLS}=await import(pathToFileURL(resolve(root,'mcp/toolkit.mjs')).href),guide=getToolGuide(),mcpNames=new Set(TOOLS.map(t=>t.name)),mcpSchemas=new Map(TOOLS.map(t=>[t.name,t.inputSchema]));
 const routes=[...new Set(guide.rows.flatMap(row=>row.pages))].sort(),critical=['pages/calendars.html','pages/calendar-compare.html','pages/calendar-search.html','pages/sigil-studio.html','pages/standards.html','pages/world-events.html',...['western','vedic','egyptian','hebrew','chinese'].map(f=>'pages/calendars/'+f+'.html')];
 check(critical.every(path=>routes.includes(path)),'all current calendar, event and symbolic tools have an actual guide route '+width);
 const representative=['pages/workbench.html','pages/book1/master.html','pages/book2/examples.html','pages/vedic/index.html','pages/calendars.html','pages/calendar-atlas.html','pages/calendar-search.html','pages/sigil-studio.html','pages/confluence.html'];
 const selectedRoutes=width===390?routes:representative,exported=new Set(),sentinel='QA-PRIVATE-BIRTH-NOTE-2035-04-17-NOT-FOR-PROMPTS';
 const {c,page}=await context(width);await c.addInitScript(value=>{localStorage.setItem('qa-private-sentinel',value);sessionStorage.setItem('qa-private-sentinel',value);},sentinel);
 try{
  if(width===390){await page.goto(base);await page.locator('#tool-assistant .ta-panel').waitFor();const aliasIds=await page.locator('#tool-assistant select option').evaluateAll(options=>options.map(option=>option.value));check(JSON.stringify(aliasIds)===JSON.stringify(guide.rows.filter(row=>row.pages.includes('index.html')).map(row=>row.id)),'Pages project-root alias mounts the actual homepage guide entries');}
  for(const route of selectedRoutes){
   const expected=guide.rows.filter(row=>row.pages.includes(route)),visit={route,width,expectedCapabilityIds:expected.map(row=>row.id),completed:false};(report.guideVisits??=[]).push(visit);await page.goto(base+route);visit.actualURL=page.url();const host=page.locator('#tool-assistant');await host.locator('.ta-panel').waitFor();
   check(await host.count()===1,'single shared tool guide mounts on '+route+' '+width);
   const shortcut=page.locator('.tool-guide-shortcut a');check(await shortcut.count()===1,'tool guide is discoverable from the page heading '+route+' '+width);await shortcut.click();await page.evaluate(()=>new Promise(requestAnimationFrame));const summary=host.locator('.ta-panel > summary'),navigation=await host.evaluate(el=>({open:el.querySelector('.ta-panel').open,summaryFocused:document.activeElement===el.querySelector('.ta-panel > summary'),activeTag:document.activeElement?.tagName,activeId:document.activeElement?.id,activeText:document.activeElement?.textContent?.slice(0,120)}));if(!navigation.open||!navigation.summaryFocused){await page.keyboard.press('Tab');navigation.afterTab=await page.evaluate(()=>({tag:document.activeElement?.tagName,id:document.activeElement?.id,text:document.activeElement?.textContent?.slice(0,120)}));await shot(page,'failure-guide-focus-'+width,'#tool-assistant');}check(navigation.open&&navigation.summaryFocused,'heading shortcut opens and focuses the actual tool guide '+route+' '+width,navigation);const sb=await summary.boundingBox(),hb=await page.locator('header.site').boundingBox();check(sb.y>=hb.y+hb.height-1,'guide shortcut does not hide focused summary below sticky navigation '+route+' '+width,{summary:sb,header:hb});const hit=await summary.evaluate(el=>{const r=el.getBoundingClientRect(),top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{visibleHit:!!top&&(top===el||el.contains(top)),rect:r.toJSON(),viewport:{width:innerWidth,height:innerHeight},topTag:top?.tagName,topId:top?.id,topClass:top?.className};});if(!hit.visibleHit)await shot(page,'failure-guide-visibility-'+route.replace(/[^a-z0-9]+/gi,'-')+'-'+width);check(hit.visibleHit,'focused guide summary is not obscured by a page toolbar '+route+' '+width,hit);const select=host.getByLabel('Tool on this page',{exact:true});await page.keyboard.press('Tab');check(await select.evaluate(el=>document.activeElement===el),'keyboard continues from guide summary to its tool selector '+route+' '+width);const actual=await select.locator('option').evaluateAll(options=>options.map(option=>option.value));
   check(JSON.stringify(actual)===JSON.stringify(expected.map(row=>row.id)),'guide selector matches the registered tools on '+route+' '+width);
   const rect=await host.boundingBox();check(rect.x>=0&&rect.x+rect.width<=width+1,'tool guide fits its route viewport '+route+' '+width,rect);
   if(width>=1100){const grid=await host.evaluate(el=>{const p=el.parentElement,s=getComputedStyle(p),r=p.getBoundingClientRect();return{withRail:p.matches('main.with-rail')&&s.display==='grid',left:r.left+parseFloat(s.paddingLeft)+parseFloat(s.borderLeftWidth),right:r.right-parseFloat(s.paddingRight)-parseFloat(s.borderRightWidth)};});if(grid.withRail)check(Math.abs(rect.x-grid.left)<2&&Math.abs(rect.x+rect.width-grid.right)<2,'desktop guide spans the content and rail columns '+route+' '+width,{guide:rect,grid});}
   for(const entry of expected){
    await select.selectOption(entry.id);const explanation=await host.locator('.ta-explanation').innerText();check(explanation.includes(entry.source.citation)&&explanation.includes(entry.support.scope)&&entry.support.outputPaths.every(p=>explanation.includes(p)),'tool guide exposes its named source and actual MCP execution scope '+entry.id+' '+width);
    if(exported.has(entry.id))continue;exported.add(entry.id);
    check(Array.isArray(entry.localFunctionInputs)&&!Object.hasOwn(entry,'inputs')&&explanation.includes('Local engine inputs')&&explanation.includes('MCP required inputs'),'local engine and callable adapter inputs are explicitly separate '+entry.id+' '+width);
    for(const contract of entry.mcpContracts){const item=host.locator('.ta-explanation details').filter({has:page.getByText(`${contract.name} · MCP input schema`,{exact:true})});await item.locator('summary').click();const pre=item.locator('pre');check(await pre.isVisible()&&JSON.stringify(JSON.parse(await pre.innerText()))===JSON.stringify(mcpSchemas.get(contract.name)),'expanded MCP schema equals the actual tool contract '+contract.name+' on '+entry.id+' '+width);await item.locator('summary').click();}
    if(['prasna','kuta-matching','world-events'].includes(entry.id)){const fields=await host.locator('.ta-explanation dl').evaluate(el=>Object.fromEntries([...el.querySelectorAll('dt')].map(dt=>[dt.textContent,dt.nextElementSibling?.textContent]))),localOnly={'prasna':['vedicChart'],'kuta-matching':['boyMoonSidLon','girlMoonSidLon'],'world-events':['dataset']}[entry.id];check(localOnly.every(name=>fields['Local engine inputs'].includes(name)&&!fields['MCP required inputs'].includes(name)),'derived engine arguments are not requested as MCP inputs '+entry.id+' '+width,fields);}
    const question=host.getByLabel('Question about the method (optional)',{exact:true}),preview=host.locator('textarea[readonly]');await question.fill('Explain the named input, output and source conventions without inventing a calculation.');await host.getByRole('button',{name:'Prepare tool prompt',exact:true}).click();
    const raw=await preview.inputValue();check(raw.length>100&&!raw.includes(sentinel)&&raw.includes('no current calculation'),'tool prompt describes its contract without reading private page records '+entry.id+' '+width);
    const packet=JSON.parse(await download(page,'#tool-assistant button:has-text("Download tool guide")','tool guide '+entry.id+' '+width));check(packet.kind==='tool-guide'&&packet.rows.length===1&&packet.rows[0].id===entry.id&&packet.rows[0].support.mcpTools.every(name=>mcpNames.has(name))&&!JSON.stringify(packet).includes(sentinel),'downloaded tool coverage names only actually registered MCP tools '+entry.id+' '+width);
    const contracts=packet.rows[0].mcpContracts,expectedContracts=packet.rows[0].support.mcpTools.map(name=>({name,inputSchema:mcpSchemas.get(name)}));check(JSON.stringify(contracts)===JSON.stringify(expectedContracts)&&!Object.hasOwn(packet.rows[0],'inputs')&&raw.includes('localFunctionInputs')&&raw.includes('mcpContracts'),'actual exported and previewed MCP schemas exactly match callable tools '+entry.id+' '+width);
    await question.fill('A revised question.');check(await preview.inputValue()===''&&await host.getByRole('button',{name:'Copy tool prompt',exact:true}).isDisabled(),'tool question edit invalidates previous prompt '+entry.id+' '+width);
   }
   if(route==='pages/calendars.html'&&(width===390||width===1440)){await fonts(page,'#tool-assistant .ta-status','per-tool guide '+width);await shot(page,'tool-guide-'+width,'#tool-assistant');}
   if(route==='pages/confluence.html'){
    await shortcut.click();let outside=false,insideSteps=0;
    for(let step=0;step<20;step++){await page.keyboard.press('Tab');const focus=await focusedGuideControl(page);if(!focus.inside){outside=true;break;}insideSteps++;check(focus.visibleHit,'Confluence guide forward keyboard focus remains unobscured '+step+' '+width,focus);}
    check(outside&&insideSteps>=5,'Confluence keyboard navigation can leave the guide without a trap '+width,{outside,insideSteps});
    for(let step=0;step<3;step++){await page.keyboard.press('Shift+Tab');const focus=await focusedGuideControl(page);check(focus.inside&&focus.visibleHit,'Confluence guide backward keyboard focus remains unobscured '+step+' '+width,focus);}
    if(width===1440)await shot(page,'confluence-guide-keyboard-1440');
   }
   visit.completed=true;
  }
  if(width===390)check(exported.size===guide.rows.length,'every registered capability exported once through a real route', {capabilities:guide.rows.length,visitedRoutes:selectedRoutes.length,exports:exported.size});
  if(width===1440){await page.setViewportSize({width:720,height:500});const panel=page.locator('#tool-assistant .ta-panel');await panel.scrollIntoViewIfNeeded();const rect=await panel.boundingBox();check(rect.x>=0&&rect.x+rect.width<=721,'per-tool guide retains 200-percent zoom-reflow proxy bounds',rect);}
 }finally{await c.close();}
}

// Hold an actual progressive-enhancement module to reproduce the observed
// focus race deterministically. Native layout/scroll anchoring remains active.
async function guideLayout(width){
 if(![320,390].includes(width))return;
 for(const userScroll of[false,true]){
  const {c,page}=await context(width);let release,intercepted;
  const held=new Promise(resolve=>{release=resolve;}),requested=new Promise(resolve=>{intercepted=resolve;});
  const entry={width,userScroll,route:'pages/trajectory.html',completed:false};(report.guideLayoutCases??=[]).push(entry);
  await c.addInitScript(()=>{window.__qaGuideScrollCalls=[];const native=window.scrollBy;window.scrollBy=function(...args){window.__qaGuideScrollCalls.push({at:performance.now(),args});return native.apply(this,args);};});
  await page.route('**/assets/js/app/person.js',async route=>{intercepted();await held;await route.continue().catch(()=>{});},{times:1});
  const geometry=()=>page.locator('#tool-assistant .ta-panel > summary').evaluate(el=>{const r=el.getBoundingClientRect(),header=document.querySelector('header.site').getBoundingClientRect();const hits=[r.top+1,r.top+r.height/2,r.bottom-1].map(y=>{const hit=document.elementFromPoint(r.left+r.width/2,y);return!!hit&&(hit===el||el.contains(hit));});return{rect:r.toJSON(),viewport:{width:innerWidth,height:innerHeight},headerBottom:header.bottom,focused:document.activeElement===el,visible:r.left>=0&&r.right<=innerWidth&&r.top>=header.bottom&&r.bottom<=innerHeight&&hits.every(Boolean),hits,scrollY,calls:window.__qaGuideScrollCalls.length};});
  try{
   await page.goto(base+'pages/trajectory.html');await page.locator('#tool-assistant .ta-panel').waitFor();
   let timer;try{await Promise.race([requested,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Actual deferred person module was not requested')),10000);})]);}finally{clearTimeout(timer);}
   check(await page.locator('#tj-summary strong').count()===0,'actual trajectory calculation is still pending before guide activation '+width+' '+userScroll);
   await page.locator('.tool-guide-shortcut a').click();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   entry.before=await geometry();check(entry.before.focused&&entry.before.visible,'ordinary guide shortcut is focused and unobscured before deferred rendering '+width+' '+userScroll,entry.before);
   if(userScroll){
    await page.mouse.move(width/2,400);await page.mouse.wheel(0,-900);
    await page.waitForFunction(()=>document.querySelector('#tool-assistant .ta-panel > summary').getBoundingClientRect().top>=innerHeight);
    entry.afterIntent=await geometry();check(entry.afterIntent.focused&&!entry.afterIntent.visible&&entry.afterIntent.scrollY<entry.before.scrollY-100,'native wheel deliberately leaves the focused guide below the viewport '+width,entry.afterIntent);
   }
   release();
   await page.waitForFunction(()=>document.querySelector('#tj-summary strong')&&document.querySelector('#tj-timeline')?.textContent.trim()&&document.querySelector('#tj-picatrix')?.textContent.trim(),{},{timeout:30000});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   entry.after=await geometry();
   if(userScroll){
    check(entry.after.focused&&entry.after.calls===entry.afterIntent.calls,'late real trajectory rendering does not pull back a deliberately scrolled guide '+width,{before:entry.afterIntent,after:entry.after});
    await page.keyboard.press('Tab');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const focus=await focusedGuideControl(page);check(focus.inside&&focus.visibleHit&&await page.locator('#tool-assistant select').evaluate(el=>document.activeElement===el),'next native Tab rearms unobscured guide focus after deliberate scrolling '+width,focus);
   }else check(entry.after.focused&&entry.after.visible,'focused guide stays visible after the actual deferred trajectory render '+width,entry.after);
   entry.scrollCalls=await page.evaluate(()=>window.__qaGuideScrollCalls);entry.completed=true;
   await shot(page,'trajectory-guide-'+(userScroll?'intent-rearmed-':'late-layout-')+width);
  }catch(error){entry.failure=error.message;entry.geometry=await geometry().catch(()=>null);await shot(page,'failure-trajectory-guide-'+(userScroll?'intent-':'layout-')+width).catch(()=>{});throw error;}
  finally{release();await c.close();}
 }
}

try{
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});origin='http://127.0.0.1:'+server.address().port;base=origin+prefix;
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),args:['--no-sandbox']});report.browser=browser.version();report.runtime={nodeVersion:process.version,platform:process.platform};
 for(const width of widths){if(selected('chart'))await chart(width);if(selected('timeline'))await timeline(width);if(selected('alignment'))await alignment(width);if(selected('assistant'))await assistant(width);if(selected('guides'))await guides(width);if(selected('guide-layout')||phase==='guides')await guideLayout(width);}
 const after=await product();report.source.productFiles=after;report.source.changedDuringRun=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(p=>before[p]!==after[p]);
 if(report.source.changedDuringRun.length&&process.env.SKY_ALLOW_EDITS==='1')report.limits.unfrozenCandidate=true;else check(!report.source.changedDuringRun.length,'product unchanged during verification',report.source.changedDuringRun);
 check(report.source.testScriptSHA256===sha(await readFile(fileURLToPath(import.meta.url))),'test driver unchanged during verification');
 check(!report.errors.length,'zero runtime/console exceptions',report.errors);check(!report.missing.length,'zero missing local resources',report.missing);check(!report.externalRequests.length,'zero implicit external requests',report.externalRequests);
}catch(error){failure=error;report.failure={message:error.message,stack:error.stack};}
finally{if(!report.source.productFiles){const after=await product();report.source.productFiles=after;report.source.changedDuringRun=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(p=>before[p]!==after[p]);}await browser?.close();if(server.listening)await new Promise(ok=>server.close(ok));report.finishedAt=new Date().toISOString();report.pass=!failure;await writeFile(resolve(output,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({phase,pass:report.pass,checks:report.checks.length,downloads:report.downloads.length,receipt:resolve(output,'receipt.json')},null,2));}
if(failure)throw failure;
