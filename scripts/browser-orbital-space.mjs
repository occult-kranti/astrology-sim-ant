// Focused integration gate for the static Orbital Space instrument.
// Public fixture only; no provider inference, personal birth records or remote writes.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,mkdir,writeFile,access} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const driver='scripts/browser-orbital-space.mjs';
const output=resolve(root,process.env.ORBITAL_OUTPUT||'test-results/orbital-space');
const widths=(process.env.ORBITAL_WIDTHS||'1440,390,320').split(',').map(Number);
assert.ok(widths.length&&widths.every(n=>Number.isInteger(n)&&n>=320&&n<=2560),'Valid ORBITAL_WIDTHS');
const sha=b=>createHash('sha256').update(b).digest('hex');
const prefix='/astrology-sim-ant/';
const fixture={at:'2024-04-01T12:00:00Z',lat:'51.5074',lon:'-0.1278',zone:'Europe/London'};
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.md':'text/plain','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.ico':'image/x-icon'};
async function files(dir){const result=[];for(const e of await readdir(resolve(root,dir),{withFileTypes:true})){if(e.name.startsWith('.')||e.name==='node_modules')continue;const p=dir+'/'+e.name;result.push(...e.isDirectory()?await files(p):[p]);}return result;}
async function manifest(){return Object.fromEntries(await Promise.all(['index.html','manifest.webmanifest','sw.js',driver,...await files('assets'),...await files('pages')].sort().map(async p=>[p,sha(await readFile(resolve(root,p)))])));}
await mkdir(output,{recursive:true});let exists=false;try{await access(resolve(output,'receipt.json'));exists=true;}catch{}
assert.ok(!exists,'Use a fresh ORBITAL_OUTPUT; earlier evidence is immutable.');
const before=await manifest();await writeFile(resolve(output,'driver.mjs'),await readFile(resolve(root,driver)));
const receipt={schemaVersion:1,startedAt:new Date().toISOString(),environment:{node:process.version},fixture,checks:[],failures:[],errors:[],missing:[],externalRequests:[],screenshots:[],downloads:[],source:{beforeSHA256:sha(JSON.stringify(before))},limits:{physicalDevice:false,screenReader:false,humanUsabilityResearch:false,exhaustiveCases:false,cssZoomIsBrowserZoom:false,localEclipseVisibility:false,providerInference:false}};
let browser,server,origin,base,journey='initialization',downloadCount=0;
function check(condition,label,detail){receipt.checks.push({journey,label,pass:!!condition,...detail===undefined?{}:{detail}});assert.ok(condition,label+(detail===undefined?'':': '+JSON.stringify(detail)));}
const serve=async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(prefix))return res.writeHead(404).end();const rel=decodeURIComponent(url.pathname.slice(prefix.length)||'index.html'),path=resolve(root,rel);if(!path.startsWith(root+sep)||rel.split('/').some(p=>p.startsWith('.')))return res.writeHead(403).end();res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'}).end(await readFile(path));}catch{return res.writeHead(404).end('Not found');}};
async function shot(page,name,selector){await page.mouse.move(0,0);if(selector)await page.locator(selector).scrollIntoViewIfNeeded();const bytes=selector?await page.locator(selector).screenshot({animations:'disabled',style:'header.site,.ob-mobile-nav{visibility:hidden!important}'}):await page.screenshot({animations:'disabled'});const filename=journey+'-'+name+'.png';await writeFile(resolve(output,filename),bytes);receipt.screenshots.push({journey,filename,bytes:bytes.length,sha256:sha(bytes),capture:selector?'Element; external fixed site chrome hidden only for capture':'Unmodified viewport'});}
async function download(page,selector,label){const event=page.waitForEvent('download',{timeout:30000});await page.locator(selector).click();const item=await event;check(await item.failure()===null,label+' native download completes');const bytes=await readFile(await item.path()),compressed=gzipSync(bytes),filename=String(++downloadCount).padStart(2,'0')+'-'+item.suggestedFilename()+'.gz';await writeFile(resolve(output,filename),compressed);receipt.downloads.push({journey,label,filename,bytes:bytes.length,sha256:sha(bytes),compressedBytes:compressed.length,compressedSHA256:sha(compressed)});return bytes;}
async function reflow(page,label){const v=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));check(v.scrollWidth<=v.width+2,label+' has no document horizontal overflow',v);}
async function svgInfo(page,bytes){return page.evaluate(text=>{const d=new DOMParser().parseFromString(text,'image/svg+xml'),ids=[...d.querySelectorAll('[id]')].map(e=>e.id),refs=[...text.matchAll(/url\(["']?#([^\s)"']+)["']?\)/g)].map(m=>m[1]);return{parserError:!!d.querySelector('parsererror'),root:d.documentElement.localName,metadata:[...d.querySelectorAll('metadata')].map(e=>{try{return JSON.parse(e.textContent);}catch{return e.textContent;}}),title:d.querySelector('title')?.textContent,description:d.querySelector('desc')?.textContent,executable:d.querySelectorAll('script,foreignObject').length,unresolvedCSSVariables:/var\(/.test(text),missingRefs:refs.filter(id=>!ids.includes(id)),duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),text:d.documentElement.textContent};},bytes.toString());}
async function open(page){await page.goto(base+'pages/calendar-atlas.html?'+new URLSearchParams(fixture),{waitUntil:'networkidle',timeout:60000});await page.locator('#sky-chart svg').waitFor({timeout:60000});await page.locator('#sky-view-orbit').click();await page.locator('.orbital-space svg').waitFor({timeout:30000});check(await page.locator('#sky-view-orbit').getAttribute('aria-pressed')==='true','Orbital Space is the selected instrument');}
async function journeyFor(page,width){
  await open(page);
  await reflow(page,width+'px orbital instrument');
  check(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),'Journey exercises reduced-motion preference');
  const host=page.locator('#sky-orbital-space');
  check(await host.getAttribute('data-os-frame')==='Earth','Initial instrument uses the Earth-view frame');
  check(await page.locator('[data-os-origin]').inputValue()==='Earth','Frame selector identifies its actual origin');
  const firstBytes=await download(page,'#sky-svg','Earth-view instrument SVG'),first=await svgInfo(page,firstBytes);
  const earthMeta=first.metadata.find(m=>m?.kind==='geocentric-direction-projection');
  check(!first.parserError&&first.root==='svg'&&!first.executable&&!first.unresolvedCSSVariables&&!first.missingRefs.length&&!first.duplicateIds.length,'Earth-view export is inert complete XML with valid paint references',first);
  check(earthMeta?.origin==='Earth'&&earthMeta?.privateBirthIncluded===false,'Earth-view export names its geocentric frame and excludes a birth record',earthMeta);
  if(width===1440){const native=await page.context().newPage();try{await native.setViewportSize({width:760,height:640});await native.goto('data:image/svg+xml;base64,'+firstBytes.toString('base64'));check(await native.locator('svg').count()===1&&await native.locator('script,foreignObject').count()===0,'Actual native SVG opens as a standalone inert image document');await shot(native,'native-earth-export');}finally{await native.close();}}
  const a=earthMeta.vectors.find(v=>v.id===earthMeta.bodyA),b=earthMeta.vectors.find(v=>v.id===earthMeta.bodyB);
  const angle=Math.acos(Math.max(-1,Math.min(1,(a.x*b.x+a.y*b.y+a.z*b.z)/(Math.hypot(a.x,a.y,a.z)*Math.hypot(b.x,b.y,b.z)))))*180/Math.PI;
  const longitude=Math.abs(((b.longitude-a.longitude+540)%360)-180);
  check(Math.abs(angle-earthMeta.true3DAngleDegrees)<1e-8&&Math.abs(longitude-earthMeta.longitudeSeparationDegrees)<1e-8,'Independent vector dot product and longitude difference recover the two distinct displayed angles',{angle,longitude});
  const firstMarkers=await page.locator('[data-os-body]').count();await page.locator('[data-os-context]').check();
  check(await page.locator('[data-os-body]').count()>firstMarkers,'All-worlds control draws additional actual bodies');await page.locator('[data-os-context]').uncheck();
  check(await page.locator('[data-os-body]').count()===firstMarkers,'Selected-system view restores the original body count');
  await page.locator('[data-os-origin]').selectOption('Sun');
  await page.locator('[data-os-a]').selectOption('Earth');await page.locator('[data-os-b]').selectOption('Mars');
  await page.locator('[data-os-scale]').selectOption('linear');
  check(await host.getAttribute('data-os-frame')==='Sun','Sun-centered selection changes instrument frame');
  const physical=await svgInfo(page,await download(page,'#sky-svg','Sun-centered Earth–Mars linear-AU SVG'));
  const sunMeta=physical.metadata.find(m=>m?.kind==='heliocentric-projection');
  check(sunMeta?.origin==='Sun'&&sunMeta?.units==='AU'&&sunMeta?.scale==='linear','Heliocentric export names linear physical AU scaling',sunMeta);
  check(sunMeta?.vectors?.some(v=>v.id==='Earth')&&sunMeta.vectors.every(v=>Number.isFinite(v.distanceAU)&&Math.abs(Math.hypot(v.x,v.y,v.z)-v.distanceAU)<1e-10),'Actual heliocentric vectors include Earth and retain their independently computed norm');
  const painted=()=>page.locator('#sky-orbital-space svg').evaluate(svg=>[...svg.querySelectorAll('circle,line,polyline,path')].map(n=>n.outerHTML).join(''));
  const beforeTurn=await painted();await page.locator('[data-os-yaw]').fill('75');await page.locator('[data-os-yaw]').dispatchEvent('input');await page.locator('[data-os-tilt]').fill('30');await page.locator('[data-os-tilt]').dispatchEvent('input');
  check(await painted()!==beforeTurn,'Turn and tilt change actual drawn orbital geometry');
  await page.locator('[data-os-scale]').selectOption('sqrt');
  const compressed=await svgInfo(page,await download(page,'#sky-svg','Rotated compressed Sun-centered SVG'));
  const compressedMeta=compressed.metadata.find(m=>m?.kind==='heliocentric-projection');
  check(compressedMeta?.scale==='sqrt'&&compressedMeta?.yawDegrees===75&&compressedMeta?.tiltDegrees===30,'Export records the selected compression and orientation',compressedMeta);
  check(JSON.stringify(compressedMeta?.vectors)===JSON.stringify(sunMeta.vectors),'Display compression and rotation preserve physical AU vectors exactly');
  if(width===1440)await shot(page,'sun-earth-mars','.os-workspace');
  await page.locator('[data-os-origin]').selectOption('Earth');
  const selected=await page.locator('[data-os-a],[data-os-b]').evaluateAll(nodes=>nodes.map(n=>n.value));
  check(selected.every(v=>v!=='Earth')&&selected[0]!==selected[1],'Returning to Earth-view leaves two distinct observable endpoints',selected);
  await page.locator('[data-os-a]').selectOption('Sun');await page.locator('[data-os-b]').selectOption('Moon');
  check((await page.locator('#sky-orbital-space').innerText()).includes('Sun')&&(await page.locator('#sky-orbital-space').innerText()).includes('Moon'),'Selected Sun–Moon pair is named in the live instrument');
  const mobileControls=await page.locator('#sky-orbital-space select,#sky-orbital-space button').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).map(n=>({tag:n.tagName,height:n.getBoundingClientRect().height,font:parseFloat(getComputedStyle(n).fontSize)})));
  check(mobileControls.every(c=>c.height>=24)&&(width>390||mobileControls.filter(c=>c.tag==='SELECT').every(c=>c.font>=16)),'Visible orbital controls have usable target sizes and native-select type',mobileControls);
  if(width!==1440){
    await shot(page,'earth-view','.os-workspace');await page.locator('[data-os-window]').selectOption('90');await page.locator('[data-os-build]').click();await page.waitForFunction(()=>['ready','error'].includes(document.querySelector('#sky-orbital-space')?.dataset.osState),null,{timeout:120000});
    check(await host.getAttribute('data-os-state')==='ready','Mobile event search reaches a real ready state');await page.locator('[data-os-filter=\"eclipse\"]').click();
    await reflow(page,width+'px populated eclipse timeline');check(await page.locator('[data-os-event]').count()>0,'Mobile timeline retains keyboard-operable eclipse bookmarks');
    await page.locator('[data-os-event]').first().focus();await page.keyboard.press('Enter');check(!!await host.getAttribute('data-os-selected-date'),'Mobile bookmark activation chooses its exact solved date');
    await shot(page,'eclipse-atlas','.os-events');return;
  }
  await page.locator('[data-os-window]').selectOption('366');
  await page.evaluate(()=>{document.querySelector('[data-os-build]').click();document.querySelector('[data-os-cancel]').click();});
  check(['cancelled','idle'].includes(await host.getAttribute('data-os-state')),'Explicit cancellation does not claim an installed event atlas');
  await page.locator('[data-os-window]').selectOption('90');
  await page.locator('[data-os-build]').click();await page.waitForFunction(()=>['ready','error'].includes(document.querySelector('#sky-orbital-space')?.dataset.osState),null,{timeout:120000});
  check(await host.getAttribute('data-os-state')==='ready','Bounded event search completes');
  const eventCount=await page.locator('[data-os-event]').count();check(eventCount>0,'Calculated event bookmarks are present');
  await page.locator('[data-os-filter="eclipse"]').click();
  check(await page.locator('[data-os-event]').count()>0,'Eclipse filter retains actual calculated eclipse events');
  const events=await page.locator('[data-os-event]').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.osEvent,kind:n.dataset.osKind,date:n.dataset.osDate,text:n.textContent,title:n.title})));
  const known=events.find(e=>e.date?.startsWith('2024-04-08')&&e.kind==='solar-eclipse'&&/total/i.test(e.text));
  check(!!known,'The NASA-documented 8 April 2024 total solar eclipse is located',events);
  check(Math.abs(Date.parse(known.date)-Date.parse('2024-04-08T18:17:15Z'))<60000,'Global eclipse peak agrees within60seconds with the historical NASA catalogue TD-minus-deltaT reference',{actual:known.date,reference:'2024-04-08T18:17:15Z',source:'https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html',scope:'Catalogue TD18:18:29 minus rounded deltaT74seconds; not an exact UTC observation.'});
  check(events.every(e=>e.kind.includes('eclipse')),'Eclipse filter removes pair/phase/season marks from the actual event surface');
  await page.locator('[data-os-event][data-os-date=\"'+known.date+'\"]').first().focus();await page.keyboard.press('Enter');
  check((await host.innerText()).match(/global|local visibility/i),'Eclipse interpretation retains global versus local visibility scope');
  check((await host.innerText()).match(/Earth|Moon|Sun/),'Eclipse detail retains its participating bodies');
  await shot(page,'eclipse-atlas','.os-events');
  const selectedDate=await host.getAttribute('data-os-selected-date');
  check((await page.locator('[data-os-reading]').innerText()).includes(selectedDate),'Selected event reading is calculated for its exact UTC with a printed scope');
  check(!!selectedDate&&Number.isFinite(Date.parse(selectedDate)),'Event selection exposes an exact solved UTC');
  const links=await page.locator('[data-os-reading] a[href]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.href))]),localLinks=links.filter(href=>new URL(href).origin===origin);
  check(localLinks.length>0&&localLinks.every(href=>href.startsWith(base)),'Every local source reference resolves from the application root',localLinks);
  const sourceResponses=[];for(const href of localLinks){const response=await page.request.get(href),bytes=await response.body();sourceResponses.push({href,status:response.status(),bytes:bytes.length,sha256:sha(bytes)});}
  check(sourceResponses.every(row=>row.status===200&&row.bytes>0),'Actual local source links return their source bytes instead of a pages/assets404',sourceResponses);receipt.sourceLinks=sourceResponses;
  const storageKey='workbench.date-wayfinding.bookmarks.v1';
  check(await page.evaluate(key=>localStorage.getItem(key),storageKey)===null,'Automatic event discovery does not save bookmarks');
  await page.locator('[data-os-save]').click();
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
  check(saved.version===1&&saved.entries.length===1&&saved.entries[0].scope==='orbital-space'&&saved.entries[0].date===selectedDate.slice(0,10),'Explicit save records the selected public event reference');
  check(saved.entries.every(e=>Object.keys(e).sort().join(',')==='date,id,kind,scope'),'Saved event schema contains no observer or personal fields',saved);
  check(await page.locator('[data-os-save]').getAttribute('aria-pressed')==='true','Save button announces its actual bookmark state');
  await page.locator('[data-os-save]').click();check((await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).entries.length===0,'Explicit removal clears the bookmark');
  await page.locator('[data-os-filter="all"]').click();
  check(await page.locator('[data-os-event]').count()>=eventCount,'All-events filter restores all marker families');
  await page.locator('[data-os-time]').focus();await page.keyboard.press('Home');
  const start=Number(await page.locator('[data-os-time]').getAttribute('min'));
  check(Number(await page.locator('[data-os-time]').inputValue())===start,'Timeline range supports keyboard navigation to window start');
  check(await host.getAttribute('data-os-selected-date')===new Date(start).toISOString(),'Keyboard slider preview retains its explicit UTC');
  await page.locator('[data-os-next]').click();const next=await host.getAttribute('data-os-selected-date');
  check(Date.parse(next)>start,'Next-event button moves to a solved event after the preview');
  await page.locator('[data-os-next]').click();await page.locator('[data-os-prev]').click();
  check(await host.getAttribute('data-os-selected-date')===next,'Previous/next event navigation is reversible');
  const beforeCast=await host.getAttribute('data-os-selected-date');
  await page.locator('[data-os-cast]').click();await page.waitForFunction(iso=>document.querySelector('#sky-printed-moment')?.textContent.includes(iso),beforeCast,{timeout:60000});
  check((await page.locator('#sky-printed-moment').innerText()).includes(beforeCast),'Cast action updates the atlas to the exact solved instant without rounding to a day');
  const readingText=await page.locator('[data-os-reading]').innerText();
  check(/Source reading .* at/.test(readingText)&&/Lilly|Agrippa|Jyoti/.test(readingText),'Orbital view exposes the held source-attributed reading');
  check(/not physical safety ratings|not.*physical|not.*fortune score/.test(await host.innerText()),'Traditional classifications remain qualified separately from physical geometry');
  await page.locator('[data-os-origin]').selectOption('Sun');await page.locator('[data-os-a]').selectOption('Earth');
  check(/Earth is a valid world/.test(await page.locator('[data-os-reading]').innerText()),'Earth-inclusive geometry retains the traditional reading scope limitation');
  const beforeKeyboard=await page.locator('[data-os-a]').inputValue();await page.locator('[data-os-context]').check();
  await page.locator('[data-os-body="Mars"]').focus();await page.keyboard.press('Enter');
  check(await page.locator('[data-os-a]').inputValue()==='Mars'&&beforeKeyboard!=='Mars','Keyboard activation selects the actual plotted world');
  check(await page.locator('[data-os-body="Mars"]').evaluate(e=>e===document.activeElement),'Planet selection restores keyboard focus after the SVG redraw');
  await page.setViewportSize({width:640,height:1000});await page.evaluate(()=>document.documentElement.style.zoom='2');await reflow(page,'200% CSS zoom proxy');await page.locator('[data-os-origin]').focus();await page.locator('[data-os-origin]').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const zoomFocus=await page.locator('[data-os-origin]').evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{focused:document.activeElement===e,visible:hit===e||e.contains(hit),rect:r.toJSON()};});check(zoomFocus.focused&&zoomFocus.visible,'Frame control remains focused and unobscured in the200% CSS zoom proxy',zoomFocus);await shot(page,'zoom');await page.evaluate(()=>document.documentElement.style.removeProperty('zoom'));await page.setViewportSize({width,height:1000});
  await page.locator('[data-os-window]').selectOption('366');
  await page.evaluate(()=>{document.querySelector('[data-os-build]').click();const input=document.querySelector('#atlas-time');input.value='12:01';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.waitForFunction(()=>document.querySelector('#sky-orbital-space')?.dataset.osState==='stale');
  check(await page.locator('[data-os-build]').isDisabled()&&await page.locator('[data-os-cast]').isDisabled()&&await page.locator('#sky-svg').isDisabled(),'External moment edits disable stale orbital calculation, casting and exports');
  await page.waitForTimeout(250);
  check(await host.getAttribute('data-os-state')==='stale','Superseded event work cannot restore ready state after an input edit');
  await reflow(page,'Final stale-state layout');

}
async function run(width){journey='orbital-'+width;const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block',acceptDownloads:true,reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>receipt.errors.push({journey,message:e.message}));page.on('console',m=>{if(m.type()==='error')receipt.errors.push({journey,message:m.text(),kind:'console'});});context.on('response',r=>{if(r.status()>=400)receipt.missing.push({journey,url:r.url(),status:r.status()});});await context.route('**/*',r=>{const url=new URL(r.request().url());if(url.origin===origin||['blob:','data:'].includes(url.protocol))return r.continue();receipt.externalRequests.push({journey,url:url.href});return r.abort('blockedbyclient');});try{await journeyFor(page,width);}catch(error){receipt.failures.push({journey,message:error.message,stack:error.stack});await shot(page,'failure').catch(()=>{});}finally{await context.close();}}
try{
  server=createServer(serve);await new Promise(done=>server.listen(0,'127.0.0.1',done));origin='http://127.0.0.1:'+server.address().port;base=origin+prefix;
  const pkg=process.env.PLAYWRIGHT_PKG?await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href):await import('playwright');
  browser=await(pkg.chromium||pkg.default.chromium).launch({headless:true,...process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{},args:['--no-sandbox']});receipt.environment.browser=browser.version();
  for(const width of widths){await run(width);if(receipt.failures.length||receipt.errors.length)break;}
}catch(error){receipt.failures.push({journey:'harness',message:error.message,stack:error.stack});}
finally{
  await browser?.close();if(server){server.closeAllConnections();await new Promise(done=>server.close(done));}
  const after=await manifest();receipt.source.afterSHA256=sha(JSON.stringify(after));receipt.source.changedFiles=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(p=>before[p]!==after[p]);
  for(const[label,detail]of[['Source changed during run',receipt.source.changedFiles],['Runtime errors',receipt.errors],['Missing resources',receipt.missing],['Unexpected external requests',receipt.externalRequests]])if(detail.length)receipt.failures.push({label,detail});
  receipt.pass=!receipt.failures.length;receipt.acceptanceEligible=receipt.pass;receipt.checkCount=receipt.checks.length;receipt.completedAt=new Date().toISOString();
  await writeFile(resolve(output,'source-before.json'),JSON.stringify(before,null,2)+'\n');await writeFile(resolve(output,'source-after.json'),JSON.stringify(after,null,2)+'\n');await writeFile(resolve(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({pass:receipt.pass,checks:receipt.checkCount,failures:receipt.failures.map(f=>({label:f.label,journey:f.journey,message:f.message})),receipt:resolve(output,'receipt.json')},null,2));if(!receipt.pass)process.exitCode=1;
}
