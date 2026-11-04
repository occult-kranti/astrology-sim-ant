// Real-browser acceptance for the original desktop workbench.
// Synthetic/public fixtures only. Run against a frozen tree; receipts bind exact source hashes.
import assert from 'node:assert/strict';
import {createServer} from 'node:https';
import {readFile,readdir,mkdir,writeFile,access,mkdtemp,rm} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash,X509Certificate} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {gzipSync} from 'node:zlib';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const driver='scripts/browser-desktop-workbench.mjs';
const output=resolve(root,process.env.DESKTOP_OUTPUT||'test-results/desktop-workbench');
const sha=b=>createHash('sha256').update(b).digest('hex');
const prefix='/astrology-sim-ant/';
const testHost='127.0.0.2';
const libraryKey='astrologers-workbench.desktop-library.v1';
const phase=process.env.DESKTOP_PHASE||'all';
assert.ok(['all','functional','negative','tools','layout','offline'].includes(phase),'Choose a valid DESKTOP_PHASE.');
const selected=name=>phase==='all'||phase===name;
const fixture={name:'Equinox public fixture',localDate:'2024-03-20',localTime:'03:06',timeZone:'UTC',lat:'51.5074',lon:'-0.1278',disambiguation:'reject'};
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.ico':'image/x-icon'};
async function files(dir){const result=[];for(const entry of await readdir(resolve(root,dir),{withFileTypes:true})){if(entry.name.startsWith('.')||entry.name==='node_modules')continue;const path=dir+'/'+entry.name;result.push(...(entry.isDirectory()?await files(path):[path]));}return result;}
async function manifest(){return Object.fromEntries(await Promise.all(['index.html','manifest.webmanifest','sw.js',driver,...await files('assets'),...await files('pages')].sort().map(async path=>[path,sha(await readFile(resolve(root,path)))])));}
await mkdir(output,{recursive:true});let exists=false;try{await access(resolve(output,'receipt.json'));exists=true;}catch{}
assert.ok(!exists,'Use a fresh DESKTOP_OUTPUT; earlier evidence is immutable.');
const before=await manifest();await writeFile(resolve(output,'driver.mjs'),await readFile(resolve(root,driver)));
const receipt={schemaVersion:1,startedAt:new Date().toISOString(),phase,environment:{node:process.version},fixture,checks:[],failures:[],errors:[],missing:[],externalRequests:[],expectedNetworkFailures:[],screenshots:[],downloads:[],source:{beforeSHA256:sha(JSON.stringify(before))},limits:{physicalDevice:false,screenReader:false,humanUsabilityResearch:false,exhaustiveCases:false,cssZoomIsBrowserZoom:false,evictionResistance:false,providerServicesOffline:false}};
let browser,server,tlsDirectory,origin,base,journey='initialization',downloadCount=0;
function check(condition,label,detail){receipt.checks.push({journey,label,pass:!!condition,...(detail===undefined?{}:{detail})});assert.ok(condition,label+(detail===undefined?'':': '+JSON.stringify(detail)));}
const serve=async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(prefix)){res.writeHead(404).end();return;}const path=decodeURIComponent(url.pathname.slice(prefix.length)||'index.html'),file=resolve(root,path);if(!file.startsWith(root+sep)||path.split('/').some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(bytes);}catch{if(!res.destroyed)res.writeHead(404).end();}};
async function shot(page,name,selector){await page.mouse.move(0,0);if(selector)await page.locator(selector).scrollIntoViewIfNeeded();const bytes=selector?await page.locator(selector).screenshot({animations:'disabled'}):await page.screenshot({animations:'disabled'});const filename=journey+'-'+name+'.png';await writeFile(resolve(output,filename),bytes);receipt.screenshots.push({journey,filename,bytes:bytes.length,sha256:sha(bytes),capture:selector?'Element screenshot; no DOM/style substitution':'Unmodified viewport'});}
async function download(page,selector,label){const event=page.waitForEvent('download',{timeout:30000});await page.locator(selector).click();const item=await event;check(await item.failure()===null,label+' download completes');const bytes=await readFile(await item.path()),compressed=gzipSync(bytes),filename=String(++downloadCount).padStart(2,'0')+'-'+item.suggestedFilename()+'.gz';await writeFile(resolve(output,filename),compressed);receipt.downloads.push({journey,label,filename,bytes:bytes.length,sha256:sha(bytes),compressedBytes:compressed.length,compressedSHA256:sha(compressed)});return bytes;}
async function ready(page){await page.waitForFunction(()=>document.querySelector('#dw-app')?.dataset.state==='ready'&&!document.querySelector('#dw-export-json')?.disabled&&document.querySelector('#dw-chart svg'),null,{timeout:60000});}
async function cast(page){await page.locator('#dw-cast').click();await ready(page);}
async function reflow(page,label){const size=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));check(size.scrollWidth<=size.width+2,label+' has no document horizontal overflow',size);}
async function fillProfile(page,which,profile){await page.locator('#dw-edit-'+which).click();await page.locator('#dw-profile-dialog').waitFor();for(const[field,value]of Object.entries(profile)){const control=page.locator('#dw-profile-'+field);if(field==='disambiguation')await control.selectOption(value);else await control.fill(String(value));}}
async function applyProfile(page,which,profile){await fillProfile(page,which,profile);await page.locator('#dw-profile-apply').click();await page.waitForFunction(()=>!document.querySelector('#dw-profile-dialog')?.open);if(await page.locator('#dw-app').getAttribute('data-state')!=='ready')await cast(page);await ready(page);}
async function run(name,width,fn,{workers='block',init}={}){journey=name;const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:workers,acceptDownloads:true,reducedMotion:'reduce'});if(init)await context.addInitScript(init);const page=await context.newPage();page.setDefaultTimeout(15000);let expectedFailures=false;const controls={expectNetworkFailures:value=>{expectedFailures=value;}};page.on('pageerror',e=>receipt.errors.push({journey:name,message:e.message}));page.on('console',message=>{if(message.type()!=='error')return;const entry={journey:name,message:message.text()};if(expectedFailures&&/net::ERR_(INTERNET_DISCONNECTED|ABORTED|FAILED)|Failed to fetch/i.test(entry.message))receipt.expectedNetworkFailures.push(entry);else receipt.errors.push(entry);});context.on('response',response=>{if(response.status()>=400)receipt.missing.push({journey:name,status:response.status(),url:response.url()});});context.on('request',request=>{if(!request.url().startsWith(origin)&&!request.url().startsWith('data:')&&!request.url().startsWith('blob:'))receipt.externalRequests.push({journey:name,url:request.url()});});try{await page.goto(base+'pages/desktop.html',{waitUntil:'networkidle',timeout:60000});await ready(page);await fn(page,context,controls);}catch(error){receipt.failures.push({journey:name,message:error.message,stack:error.stack});console.error(name+': '+error.message);await shot(page,'failure').catch(()=>{});}finally{await context.close();}}

async function functionalJourney(page){
  check(await page.locator('main').count()===1&&await page.locator('header.site').count()===1,'Workbench preserves one main and shared site header');
  check(await page.locator('nav.main[aria-label]').count()>0,'Shared navigation retains accessible name');
  check(await page.evaluate(()=>{const a=document.querySelector('a.skip-link');return !!a&&!!document.querySelector(a.getAttribute('href'));}),'Skip link points to the actual main region');
  check(await page.evaluate(key=>localStorage.getItem(key)===null,libraryKey),'Opening the workbench does not save a profile');
  await applyProfile(page,'primary',fixture);
  await page.evaluate(()=>window.scrollTo(0,0));await shot(page,'initial');
  const initial=JSON.parse((await download(page,'#dw-export-json','Public equinox chart')).toString());
  check(JSON.stringify(initial).includes('2024-03-20T03:06:00.000Z'),'Export records the exact public fixture instant');
  check(initial.kind==='astrology-desktop-study'&&initial.schemaVersion===1,'Export declares its actual versioned study schema');
  check(initial.primary.bodies.length===12&&initial.primary.houses.length===12,'Chart exports ten bodies, two mean nodes and twelve house cusps');
  const sun=initial.primary.bodies.find(b=>b.id==='Sun');
  check(Math.min(sun.lon,360-sun.lon)<0.05,'Independent March equinox fixture places the tropical Sun near 0° Aries',sun.lon);
  check(initial.secondary===null&&initial.crossAspects.length===0,'Natal mode exports a single chart without invented comparison rows');
  check(!new URL(page.url()).search,'Chart inputs remain outside the URL');
  const plotted=await page.locator('#dw-chart [data-dw-body][data-dw-frame="primary"]').evaluateAll(es=>es.map(e=>({id:e.dataset.dwBody,lon:Number(e.dataset.longitude)})));
  check(plotted.length===12&&plotted.every(p=>Math.abs(p.lon-initial.primary.bodies.find(b=>b.id===p.id).lon)<1e-7),'Rendered body markers retain every actual exported longitude');
  await page.locator('#dw-system').selectOption('whole');
  check(await page.locator('#dw-app').getAttribute('data-state')==='stale'&&await page.locator('#dw-export-json').isDisabled(),'Settings edit marks the held chart stale and disables JSON export');
  check(await page.locator('#dw-export-svg').isDisabled(),'Stale chart SVG export is disabled');
  await page.locator('#dw-show-aspects').uncheck();await page.locator('#dw-show-aspects').check();
  check(await page.locator('#dw-app').getAttribute('data-state')==='stale'&&await page.locator('#dw-export-json').isDisabled()&&await page.locator('#dw-ai').isDisabled(),'Changing drawing layers cannot re-enable stale calculation exports or AI handoff');
  await cast(page);
  const whole=JSON.parse((await download(page,'#dw-export-json','Whole-sign chart')).toString());
  check(whole.primary.actualSystem==='whole'&&whole.primary.chart.cusps.slice(1).every(v=>Math.abs(v%30)<1e-8),'Whole-sign selection changes actual cusp computation');
  for(const system of ['equal','regiomontanus','placidus']){await page.locator('#dw-system').selectOption(system);await cast(page);const record=JSON.parse((await download(page,'#dw-export-json',system+' chart')).toString());check(record.primary.actualSystem===system&&record.inputs.system===system,'Requested house system is held in exported calculation: '+system);}
  await page.locator('#dw-zodiac').selectOption('lahiri');await cast(page);
  const sidereal=JSON.parse((await download(page,'#dw-export-json','Linear Lahiri chart')).toString());
  const siderealSun=sidereal.primary.bodies.find(b=>b.id==='Sun');
  check(sidereal.primary.ayanamsa>24&&sidereal.primary.ayanamsa<25&&Math.abs(((sun.lon-siderealSun.lon+360)%360)-sidereal.primary.ayanamsa)<1e-7,'Lahiri selection applies the stated epoch-specific longitude rotation');
  check(sidereal.primary.warnings.some(w=>/linear approximation/i.test(w)),'Lahiri approximation remains explicit in the exported evidence');
  await page.locator('#dw-zodiac').selectOption('tropical');await page.locator('#dw-mode').selectOption('transit');await cast(page);
  await applyProfile(page,'secondary',{...fixture,name:'Eclipse public fixture',localDate:'2024-04-08',localTime:'18:00'});
  const transit=JSON.parse((await download(page,'#dw-export-json','Transit comparison')).toString());
  check(transit.inputs.mode==='transit'&&transit.secondary.dateISO==='2024-04-08T18:00:00.000Z'&&transit.crossAspects.length>0,'Transit view exports a second explicit epoch and actual cross-chart contacts');
  check(transit.crossAspects.every(a=>a.fromChart==='primary'&&a.toChart==='secondary'&&['applying','separating','exact'].includes(a.phase)),'Transit contact direction and local linear-motion phases are explicit');
  await page.locator('#dw-step-unit').selectOption('day');await page.locator('#dw-step-next').click();await ready(page);
  const stepped=JSON.parse((await download(page,'#dw-export-json','One elapsed day transit step')).toString());
  check(stepped.primary.dateISO===transit.primary.dateISO&&Date.parse(stepped.secondary.dateISO)-Date.parse(transit.secondary.dateISO)===86400000,'Transit stepping freezes the natal epoch and advances only the comparison instant');
  await page.locator('#dw-step-prev').click();await ready(page);
  await page.locator('#dw-mode').selectOption('synastry');await cast(page);
  const synastry=JSON.parse((await download(page,'#dw-export-json','Synastry comparison')).toString());
  check(synastry.inputs.mode==='synastry'&&synastry.crossAspects.every(a=>a.applying===null&&a.separating===null&&a.phase==='not-applicable'),'Synastry does not claim a shared applying/separating motion clock');
  await page.locator('#dw-orb').fill('1');await cast(page);
  const narrow=JSON.parse((await download(page,'#dw-export-json','Narrow contact orb')).toString());
  check(narrow.crossAspects.length<=synastry.crossAspects.length&&narrow.crossAspects.every(a=>a.orb<=1+1e-8),'Changing the orb recomputes bounded cross-chart contacts');
  await page.locator('#dw-orb').fill('3');await page.locator('#dw-mode').selectOption('natal');await cast(page);
  const body=page.locator('#dw-chart [data-dw-body="Mars"][data-dw-frame="primary"]').first();
  await body.focus();await page.keyboard.press('Enter');
  check((await page.locator('#dw-inspector').innerText()).includes('Mars'),'Keyboard activation of a plotted body opens its named inspector');
  check(await page.locator('#dw-chart [data-dw-body="Mars"][data-dw-frame="primary"]').evaluate(e=>e===document.activeElement),'Redrawing the selected planet retains keyboard focus');
  check(await page.locator('#dw-inspector').innerText().then(t=>/source|Lilly|dignity/i.test(t)),'Body inspector retains calculation or named-source evidence');
  await page.locator('.dw-aspect-item').first().focus();await page.keyboard.press('Enter');
  check(await page.locator('.dw-aspect-item[aria-pressed="true"]').evaluate(e=>e===document.activeElement),'Selected close-contact list item retains keyboard focus after redraw');
  check(/Separation|Exact angle/.test(await page.locator('#dw-inspector').innerText()),'Close-contact selection exposes the measured angle and allowance');
  const svg=await download(page,'#dw-export-svg','Portable displayed chart SVG');
  const svgInfo=await page.evaluate(text=>{const d=new DOMParser().parseFromString(text,'image/svg+xml');return{root:d.documentElement.localName,error:!!d.querySelector('parsererror'),scripts:d.querySelectorAll('script').length,external:[...d.querySelectorAll('[href],[xlink\\:href]')].map(e=>e.getAttribute('href')||e.getAttribute('xlink:href')).filter(u=>/^https?:/.test(u||''))};},svg.toString());
  check(svgInfo.root==='svg'&&!svgInfo.error&&svgInfo.scripts===0&&svgInfo.external.length===0,'SVG export parses without scripts or external assets',svgInfo);
  await page.locator('#dw-save').click();
  const savedRaw=await page.evaluate(key=>localStorage.getItem(key),libraryKey);
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),libraryKey);
  check(saved?.charts?.length===1&&saved.charts[0].profile.localDate===fixture.localDate,'Save explicitly persists the displayed primary profile');
  const library=JSON.parse((await download(page,'#dw-library-export','Portable private library')).toString());
  check(library.charts.length===1&&library.format==='astrologers-workbench-library','Library download contains the deliberate saved chart');
  await page.locator('#dw-library-file').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{broken')});
  await page.waitForFunction(()=>/valid JSON|invalid|not valid/i.test(document.querySelector('#dw-library-status')?.textContent||''));
  check(await page.evaluate(({key,before})=>localStorage.getItem(key)===before,{key:libraryKey,before:savedRaw}),'Malformed import leaves the existing library bytes unchanged');
  await page.locator('#dw-library-file').setInputFiles({name:'library.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(library))});
  await page.waitForFunction(()=>/Library imported/.test(document.querySelector('#dw-library-status')?.textContent||''));
  check(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).charts.length===1,libraryKey),'Re-importing the same library does not duplicate a chart');
  await shot(page,'saved-library');
  await page.locator('#dw-ai').click();
  check(await page.locator('#dw-ai-dialog').evaluate(e=>e.open),'AI action opens a reviewable native dialog');
  const packet=await page.locator('#dw-ai-packet').inputValue();
  check(packet.includes(fixture.localDate)&&/source|evidence/i.test(packet),'AI packet includes the selected calculation and source framing');
  const packetBytes=await download(page,'#dw-ai-download','Reviewed AI text packet');
  check(packetBytes.toString()===packet,'AI text download preserves the visible reviewable packet');
  await page.keyboard.press('Escape');
  check(await page.locator('#dw-ai').evaluate(e=>e===document.activeElement),'AI dialog Escape restores the triggering control');
  await page.evaluate(()=>{window.qaPrintCalled=0;window.print=()=>window.qaPrintCalled++;});await page.locator('#dw-print').click();
  check(await page.evaluate(()=>window.qaPrintCalled===1),'Print control invokes the browser print entry point');
  await page.locator('#dw-offset').focus();await page.keyboard.press('End');await ready(page);
  const rangeEnd=JSON.parse((await download(page,'#dw-export-json','Keyboard timeline endpoint')).toString());
  check(Date.parse(rangeEnd.primary.dateISO)-Date.parse(initial.primary.dateISO)===365*86400000,'Timeline keyboard End computes the actual +365 elapsed-day boundary');
  await page.locator('#dw-time-reset').click();await ready(page);
  const reset=JSON.parse((await download(page,'#dw-export-json','Reset timeline reference')).toString());
  check(reset.primary.dateISO===initial.primary.dateISO,'Reset restores the original explicit reference instant');
  await page.evaluate(()=>{const slider=document.getElementById('dw-offset');for(let i=-50;i<=50;i++){slider.value=String(i);slider.dispatchEvent(new Event('input',{bubbles:true}));}slider.value='7';slider.dispatchEvent(new Event('change',{bubbles:true}));});await ready(page);
  const latest=JSON.parse((await download(page,'#dw-export-json','Final slider value after 101 previews')).toString());
  check(Date.parse(latest.primary.dateISO)-Date.parse(initial.primary.dateISO)===7*86400000,'A burst of 101 preview changes computes only the final released slider value');
  await page.locator('#dw-time-reset').click();await ready(page);
  check(await page.evaluate(()=>![...document.querySelectorAll('[id]')].map(e=>e.id).some((id,i,all)=>all.indexOf(id)!==i)),'Workbench has no duplicate element IDs after switching views');
}

async function negativeJourney(page){
  await applyProfile(page,'primary',fixture);
  const held=JSON.parse((await download(page,'#dw-export-json','Held chart before invalid input')).toString());
  await fillProfile(page,'primary',{...fixture,localDate:'2024-03-10',localTime:'02:30',timeZone:'America/New_York'});
  await page.locator('#dw-profile-apply').click();
  check(await page.locator('#dw-profile-dialog').evaluate(e=>e.open),'Skipped DST clock does not silently close and calculate');
  check(/does not exist|skipped|gap/i.test(await page.locator('#dw-profile-dialog').innerText()),'Skipped DST clock has a visible recovery explanation');
  await page.locator('#dw-profile-localDate').fill('2024-11-03');await page.locator('#dw-profile-localTime').fill('01:30');await page.locator('#dw-profile-apply').click();
  check(await page.locator('#dw-profile-dialog').evaluate(e=>e.open)&&/twice|repeated|ambiguous|earlier|later/i.test(await page.locator('#dw-profile-dialog').innerText()),'Repeated DST clock requires an explicit occurrence');
  await page.locator('#dw-profile-disambiguation').selectOption('earlier');await page.locator('#dw-profile-apply').click();await page.waitForFunction(()=>!document.querySelector('#dw-profile-dialog')?.open);if(await page.locator('#dw-app').getAttribute('data-state')!=='ready')await cast(page);
  const earlier=JSON.parse((await download(page,'#dw-export-json','Earlier repeated clock')).toString());
  await applyProfile(page,'primary',{disambiguation:'later'});
  const later=JSON.parse((await download(page,'#dw-export-json','Later repeated clock')).toString());
  check(Date.parse(later.primary.dateISO)-Date.parse(earlier.primary.dateISO)===3600000,'DST occurrence choices resolve to distinct instants one hour apart');
  check(later.primary.profile.ambiguous&&later.primary.profile.disambiguation==='later','Export retains the repeated-clock decision');
  await applyProfile(page,'primary',{...fixture,name:'<img src=x onerror="window.qaInjected=1">'});
  check(await page.evaluate(()=>window.qaInjected!==1&&document.querySelectorAll('#dw-app img[src="x"]').length===0),'Chart labels containing markup remain inert text');
  await page.locator('#dw-save').click();
  const savedRaw=await page.evaluate(key=>localStorage.getItem(key),libraryKey);
  await page.evaluate(()=>{window.qaStorageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='astrologers-workbench.desktop-library.v1')throw new DOMException('Simulated quota exhausted','QuotaExceededError');return window.qaStorageSet.call(this,key,value);};});
  await page.locator('#dw-save').click();
  check(/could not save|full|blocked|storage/i.test(await page.locator('#dw-status').innerText()),'Quota failure is surfaced with a recoverable storage message');
  check(await page.evaluate(({key,raw})=>localStorage.getItem(key)===raw,{key:libraryKey,raw:savedRaw}),'Quota failure preserves the previous library');
  await page.evaluate(()=>{Storage.prototype.setItem=window.qaStorageSet;delete window.qaStorageSet;});
  await applyProfile(page,'primary',fixture);
  check(await page.locator('#dw-app').getAttribute('data-state')==='ready','Chart calculations recover after storage failure');
  await fillProfile(page,'primary',{lat:'90'});await page.locator('#dw-profile-apply').click();
  check(await page.locator('#dw-profile-dialog').evaluate(e=>e.open),'Geographic pole input cannot produce invented house angles');await page.keyboard.press('Escape');
  await page.locator('#dw-system').selectOption('placidus');await cast(page);
  await applyProfile(page,'primary',{...fixture,lat:'80',localDate:'2024-06-21',localTime:'12:00'});
  const polar=JSON.parse((await download(page,'#dw-export-json','High-latitude fallback')).toString());
  check(polar.primary.warnings.length>0&&polar.primary.actualSystem!==polar.primary.requestedSystem,'High-latitude Placidus fallback is explicitly represented');
  check(/fallback|whole|equal|latitude|polar/i.test(await page.locator('#dw-app').innerText()),'House fallback is visible in the workbench');
  await applyProfile(page,'primary',fixture);
  const recovered=JSON.parse((await download(page,'#dw-export-json','Recovered public fixture')).toString());
  check(recovered.primary.dateISO===held.primary.dateISO,'Recovery restores the intended explicit chart epoch');
  await applyProfile(page,'primary',{...fixture,timeZone:'  UTC  '});
  const trimmed=JSON.parse((await download(page,'#dw-export-json','Normalized time zone')).toString());
  check(trimmed.inputs.primary.timeZone==='UTC','Accepted time-zone input is normalized before storage and subsequent time navigation');
  const beforeNow=await page.evaluate(()=>Date.now());await page.locator('#dw-now').click();await ready(page);
  const nowStudy=JSON.parse((await download(page,'#dw-export-json','Explicit Now action')).toString());
  const afterNow=await page.evaluate(()=>Date.now());
  check(Date.parse(nowStudy.primary.dateISO)>=beforeNow-1000&&Date.parse(nowStudy.primary.dateISO)<=afterNow,'Now uses a real current instant after normalized-zone editing');
  await applyProfile(page,'primary',{...fixture,localDate:'2100-12-31',localTime:'12:00'});
  const boundaryDate='2100-12-31T12:00:00.000Z';
  await page.locator('#dw-offset').focus();await page.keyboard.press('End');
  check(await page.locator('#dw-offset').inputValue()==='0'&&/previous chart|1900|2100/i.test(await page.locator('#dw-status').innerText()),'Out-of-range timeline release restores the held slider position and explains the rejected date');
  const bounded=JSON.parse((await download(page,'#dw-export-json','Held upper-bound chart')).toString());
  check(bounded.primary.dateISO===boundaryDate,'Rejected future navigation does not replace the last valid chart');
  await applyProfile(page,'primary',fixture);
  await shot(page,'recovered');
}

async function toolJourney(page){
  const search=page.locator('#dw-tools-search');
  const enclosing=search.locator('xpath=ancestor::details');if(await enclosing.count()&&!await enclosing.evaluate(e=>e.open))await enclosing.locator('summary').first().click();await search.scrollIntoViewIfNeeded();
  await search.fill('Newton');
  check((await page.locator('#dw-tools-list').innerText()).includes('Newton'),'Tool search reaches retained historical research features');
  const links=await page.locator('#dw-tools-list a[href]').evaluateAll(es=>es.map(e=>e.href));
  check(links.some(u=>u.endsWith('/pages/newton-chronology.html')),'Search result keeps the existing Newton route');
  await search.fill('zzzz-nonexistent-qa');
  check(/no|nothing|0/i.test(await page.locator('#dw-tools-list').innerText()),'Unmatched tool search explains its empty state');
  await search.fill('');await page.locator('#dw-tools-category').selectOption({index:0});
  const all=await page.locator('#dw-tools-list a[href]').evaluateAll(es=>es.map(e=>e.href));
  check(new Set(all).size>=130,'Full catalogue retains the existing application routes',new Set(all).size);
  check(all.every(u=>u.startsWith(base)&&!new URL(u).search),'Tool links stay under the Pages project prefix without private inputs');
  await shot(page,'tool-catalogue');
}

async function offlineJourney(page,context,controls){
  const library=page.locator('.offline-library');
  const enclosing=library.locator('xpath=ancestor::details');if(await enclosing.count()&&!await enclosing.evaluate(e=>e.open))await enclosing.locator('summary').first().click();
  await library.scrollIntoViewIfNeeded();
  await page.locator('[data-offline-action="prepare"]').click();
  await page.waitForFunction(()=>['ready','error','unavailable'].includes(document.querySelector('.offline-library')?.dataset.state),null,{timeout:180000});
  check(await library.getAttribute('data-state')==='ready','Explicit offline download verifies the full static library',await page.locator('[data-offline-status]').innerText());
  await page.reload({waitUntil:'networkidle'});await ready(page);
  check(await page.evaluate(()=>!!navigator.serviceWorker.controller),'Offline workbench is controlled by its own service worker');
  controls.expectNetworkFailures(true);await context.setOffline(true);await page.reload({waitUntil:'networkidle'});await ready(page);
  check(await page.locator('#dw-app').getAttribute('data-state')==='ready','Workbench reloads with the browser network disabled after explicit preparation');
  await applyProfile(page,'primary',fixture);
  const offline=JSON.parse((await download(page,'#dw-export-json','Offline calculated fixture')).toString());
  check(offline.primary.dateISO==='2024-03-20T03:06:00.000Z'&&offline.primary.bodies.length===12,'New profile calculation and export work offline');
  await page.goto(base+'pages/newton-chronology.html',{waitUntil:'networkidle'});
  check(await page.locator('header.site').count()===1&&await page.locator('main').count()===1,'An unvisited retained specialist page also opens from the prepared offline library');
  const urls=await page.evaluate(async()=>{const urls=[];for(const name of await caches.keys()){const cache=await caches.open(name);urls.push(...(await cache.keys()).map(r=>r.url));}return urls;});
  check(urls.every(url=>!new URL(url).search&&!url.includes('Equinox%20public')&&!url.includes('2024-03-20')),'Offline cache keys contain only static resources without profile parameters');
  await page.goto(base+'pages/desktop.html',{waitUntil:'networkidle'});await ready(page);await shot(page,'offline-ready');
}

async function layoutJourney(page,context,controls,width){
  await reflow(page,'Initial '+width+'px');await shot(page,'initial');
  await page.locator('#dw-edit-primary').click();
  await reflow(page,'Profile dialog '+width+'px');await shot(page,'profile-dialog');
  await page.keyboard.press('Escape');
  check(!await page.locator('#dw-profile-dialog').evaluate(e=>e.open),'Escape closes native profile dialog');
  check(await page.locator('#dw-edit-primary').evaluate(e=>e===document.activeElement),'Closing dialog restores trigger focus');
  for(const view of ['positions','aspects','wheel']){await page.locator('[data-dw-view="'+view+'"]').click();await reflow(page,view+' '+width+'px');}
  await page.setViewportSize({width:640,height:1000});await page.evaluate(()=>document.documentElement.style.zoom='2');await reflow(page,'200% CSS zoom proxy');await page.locator('#dw-cast').focus();check(await page.locator('#dw-cast').evaluate(e=>e===document.activeElement),'Primary calculate action remains keyboard focusable at zoom');await shot(page,'zoom-proxy');
}

try{
  tlsDirectory=await mkdtemp(resolve(tmpdir(),'awb-desktop-tls-'));const keyPath=resolve(tlsDirectory,'key.pem'),certPath=resolve(tlsDirectory,'cert.pem');
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',keyPath,'-out',certPath,'-sha256','-days','1','-subj','/CN='+testHost,'-addext','subjectAltName=IP:'+testHost],{stdio:'ignore'});
  const key=await readFile(keyPath),cert=await readFile(certPath),publicKey=new X509Certificate(cert).publicKey.export({type:'spki',format:'der'}),spki=createHash('sha256').update(publicKey).digest('base64');
  receipt.environment.tls={protocol:'https:',host:testHost,certificateSHA256:sha(cert),spkiSHA256Base64:spki,trust:'Only ephemeral test certificate public key allowlisted in this browser process'};
  server=createServer({key,cert},serve);await new Promise(done=>server.listen(0,testHost,done));origin='https://'+testHost+':'+server.address().port;base=origin+prefix;
  const pkg=await import(process.env.PLAYWRIGHT_PKG?pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href:'playwright');browser=await(pkg.chromium||pkg.default.chromium).launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox','--ignore-certificate-errors-spki-list='+spki]});receipt.environment.browser=browser.version();
  if(selected('functional'))await run('functional-1440',1440,functionalJourney);
  if(selected('negative'))await run('negative-1440',1440,negativeJourney);
  if(selected('tools'))await run('tools-1440',1440,toolJourney);
  if(selected('layout'))for(const width of [320,390,1920])await run('layout-'+width,width,(page,context,controls)=>layoutJourney(page,context,controls,width));
  if(selected('offline'))await run('offline-1440',1440,offlineJourney,{workers:'allow'});
}catch(error){receipt.failures.push({journey:'harness',message:error.message,stack:error.stack});}
finally{
  await browser?.close();if(server){server.closeAllConnections();await new Promise(done=>server.close(done));}if(tlsDirectory){await rm(tlsDirectory,{recursive:true,force:true});receipt.environment.tls.temporaryFilesRemoved=true;}
  const after=await manifest();receipt.source.afterSHA256=sha(JSON.stringify(after));receipt.source.changedFiles=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(path=>before[path]!==after[path]);
  for(const[label,detail]of[['Source changed during run',receipt.source.changedFiles],['Runtime errors',receipt.errors],['Missing resources',receipt.missing],['Unexpected external requests',receipt.externalRequests]])if(detail.length)receipt.failures.push({label,detail});
  receipt.pass=receipt.failures.length===0;receipt.acceptanceEligible=receipt.pass&&phase==='all';receipt.checkCount=receipt.checks.length;receipt.completedAt=new Date().toISOString();
  await writeFile(resolve(output,'source-before.json'),JSON.stringify(before,null,2)+'\n');await writeFile(resolve(output,'source-after.json'),JSON.stringify(after,null,2)+'\n');await writeFile(resolve(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({pass:receipt.pass,checks:receipt.checkCount,failures:receipt.failures.map(f=>({label:f.label,journey:f.journey,message:f.message})),receipt:resolve(output,'receipt.json')},null,2));if(!receipt.pass)process.exitCode=1;
}
