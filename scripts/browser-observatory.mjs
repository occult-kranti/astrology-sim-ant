// Cross-calendar/mobile regression evidence. No real AI, geolocation, or sensor call.
// Uses a Pages-style subpath and real Chromium. Set OBS_PHASE=baseline for the
// immutable initial archive, OBS_ROOT=/path/to/archive, OBS_OUTPUT=/path/to/evidence.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const checkout=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const root=resolve(process.env.OBS_ROOT||checkout);
const phase=process.env.OBS_PHASE||'all';
if(!['baseline','sweep','journeys','all'].includes(phase))throw Error('Unknown OBS_PHASE');
const output=resolve(process.env.OBS_OUTPUT||resolve(checkout,'docs/evidence/calendar-observatory',phase));
await mkdir(output,{recursive:true});
async function loadPlaywright(){
 if(process.env.PLAYWRIGHT_PKG)return import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href);
 try{return await import('playwright');}catch{return import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js');}
}
const pkg=await loadPlaywright(),chromium=pkg.chromium||pkg.default?.chromium;
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};
const prefix='/astrology-sim-ant/';
const server=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(prefix))return res.writeHead(404).end();
 let rel=decodeURIComponent(url.pathname.slice(prefix.length));if(!rel||rel.endsWith('/'))rel+='index.html';
 const path=resolve(root,rel);if(!path.startsWith(root+sep)||rel.split('/').some(p=>p.startsWith('.')))return res.writeHead(403).end();
 const body=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
}catch{return res.writeHead(404).end('Not found');}});
const evidence={schemaVersion:1,phase,startedAt:new Date().toISOString(),source:{baseCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim(),rootIsImmutableBaseline:phase==='baseline'},environment:{browser:'Chromium',serviceWorkers:'blocked',reducedMotion:'reduce',screenReader:false,realPhone:false},sweeps:[],screenshots:[],checks:[],errors:[],externalRequests:[],missing:[]};
let browser,failure;
async function pagesIn(directory){const result=[];for(const e of await readdir(resolve(root,directory),{withFileTypes:true})){const rel=directory+'/'+e.name;if(e.isDirectory())result.push(...await pagesIn(rel));else if(e.name.endsWith('.html'))result.push(rel);}return result;}
const pages=['index.html',...await pagesIn('pages')].sort();
const digest=async rel=>createHash('sha256').update(await readFile(resolve(root,rel))).digest('hex');
async function productFiles(directory){const paths=[];for(const e of await readdir(resolve(root,directory),{withFileTypes:true})){if(e.name==='node_modules'||e.name.startsWith('.'))continue;const rel=directory?directory+'/'+e.name:e.name;if(e.isDirectory())paths.push(...await productFiles(rel));else paths.push(rel);}return paths;}
const boundPaths=['index.html','sw.js','manifest.webmanifest',...await productFiles('assets'),...await productFiles('pages'),...(await productFiles('mcp')).filter(p=>/\.(mjs|json)$/.test(p))].sort();
const productHashes=async()=>Object.fromEntries(await Promise.all(boundPaths.map(async p=>[p,await digest(p)])));
evidence.source.productAtStart=await productHashes();
evidence.source.testScriptSha256=createHash('sha256').update(await readFile(fileURLToPath(import.meta.url))).digest('hex');
const inspect=async page=>page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,header:!!document.querySelector('header.site'),title:document.title,h1:document.querySelector('h1')?.textContent?.trim()||'',skip:(()=>{const a=document.querySelector('a.skip-link');try{return !!a&&!!document.querySelector(a.getAttribute('href'));}catch{return false;}})()}));
async function screenshot(page,label){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForFunction(()=>scrollY===0);const name=label+'.png';await page.screenshot({path:resolve(output,name),fullPage:false});evidence.screenshots.push({path:name,viewport:page.viewportSize()});}
const check=(ok,label,details)=>{evidence.checks.push({label,pass:!!ok,...(details?{details}: {})});assert.ok(ok,label+(details?' '+JSON.stringify(details):''));};
try{
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});
 const origin='http://127.0.0.1:'+server.address().port,base=origin+prefix;
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),args:['--no-sandbox']});
 evidence.environment.version=browser.version();
 async function contextFor(viewport){const context=await browser.newContext({viewport,reducedMotion:'reduce',serviceWorkers:'block',acceptDownloads:true});
  await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===origin||['data:','blob:'].includes(u.protocol))return route.continue();evidence.externalRequests.push(u.href);return route.abort('blockedbyclient');});
  await context.addInitScript(()=>{window.__obsPermissions={location:0,camera:0,motion:0};Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(_ok,no)=>{window.__obsPermissions.location++;no({code:1,message:'Test denied'});}}});if(navigator.mediaDevices)Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async()=>{window.__obsPermissions.camera++;throw new DOMException('Test denied','NotAllowedError');}});});
  const page=await context.newPage();page.setDefaultTimeout(20000);let current='';page.on('pageerror',err=>evidence.errors.push({page:current,message:err.message}));page.on('console',message=>{if(message.type()==='error')evidence.errors.push({page:current,message:message.text(),kind:'console'});});page.on('response',response=>{if(response.status()>=400)evidence.missing.push({page:current,status:response.status(),url:response.url()});});
  return{context,page,setCurrent:value=>{current=value;}};}
 if(phase!=='journeys'){
  const widths=phase==='baseline'?[390]:[320,390,1365];
  for(const width of widths){const{context,page,setCurrent}=await contextFor({width,height:width===1365?900:844});try{
   for(const rel of pages){setCurrent(rel);const response=await page.goto(base+rel,{waitUntil:'domcontentloaded'});await page.waitForTimeout(100);const info=await inspect(page);evidence.sweeps.push({page:rel,width,status:response.status(),...info});
    if(['index.html','pages/calendars.html','pages/workbench.html','pages/studio.html','pages/book3/nativity.html','pages/vedic/index.html','pages/calendar-compare.html'].includes(rel))await screenshot(page,(phase==='baseline'?'before':'after')+'-'+width+'-'+rel.replaceAll('/','-').replace('.html',''));
   }
  }finally{await context.close();}}
  evidence.pageInventory=await Promise.all(pages.map(async page=>({page,sha256:await digest(page)})));
  if(phase!=='baseline'){
   check(evidence.sweeps.every(x=>x.status===200),'all preserved and new routes return200');
   check(evidence.sweeps.every(x=>x.main===1&&x.header&&x.skip),'one main, chrome, and working skip target across everyroute');
   check(evidence.sweeps.every(x=>x.scrollWidth<=x.width+1),'no whole-page horizontal overflow',evidence.sweeps.filter(x=>x.scrollWidth>x.width+1));
  }
 }
 // User journeys test actual rendered values, stale-state boundaries and exports.
 if(phase==='journeys'||phase==='all'){
  async function readyHome(page){await page.waitForFunction(()=>document.querySelectorAll('#homeSummary .home-fact').length===3&&document.querySelectorAll('#weekThis .home-day').length===7&&document.querySelectorAll('#weekNext .home-day').length===7&&!document.querySelector('#homeDownload').disabled);}
  async function includes(page,selector,text){await page.waitForFunction(({selector,text})=>document.querySelector(selector)?.textContent?.includes(text),{selector,text});}
  async function jsonDownload(page,selector){const pending=page.waitForEvent('download');await page.locator(selector).click();const file=await pending;check(await file.failure()===null,'download succeeds: '+selector);return JSON.parse(await readFile(await file.path(),'utf8'));}
  async function noOverflow(page,label){const info=await inspect(page);check(info.scrollWidth<=info.width+1,label+' reflow',info);}
  async function usable(page,selector,label){await page.locator(selector).scrollIntoViewIfNeeded();const r=await page.locator(selector).evaluate(el=>{const box=el.getBoundingClientRect(),hit=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);return {width:box.width,height:box.height,hit:hit===el||el.contains(hit)};});check(r.width>=24&&r.height>=24&&r.hit,label+' target reachable and unobscured',r);}
  for(const width of[320,390,1365]){const{context,page,setCurrent}=await contextFor({width,height:width===1365?900:844});try{
   setCurrent('homepage '+width);await page.clock.install({time:new Date('2026-10-25T23:59:30Z')});
   await page.goto(base,{waitUntil:'domcontentloaded'});await readyHome(page);
   check(await page.locator('#homePlace').inputValue()==='london','London is explicit default example '+width);
   if(width<=480)for(const selector of ['#homeDate','#homeTime']){const r=await page.locator(selector).evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,fontSize:parseFloat(getComputedStyle(el).fontSize)}));check(r.width>=200&&r.height>=44&&r.fontSize>=16,'native date/time value has readable space '+width+' '+selector,r);}
   check(await page.locator('#weekThis .home-day time').first().getAttribute('datetime')==='2026-10-19','homepage Monday week alignment '+width);
   const initial=await jsonDownload(page,'#homeDownload');check(initial.rows.length===14&&initial.calendarWeekAlignment.includes('Monday'),'actual 14-day export '+width);
   check(initial.rows.every(x=>x.status==='available'&&x.snapshot.context.localTime.startsWith('12:00')),'every day is local-noon calculated snapshot '+width);
   await page.clock.fastForward(61000);await includes(page,'#homeStatus','2026-10-26');
   check(await page.locator('#weekThis .home-day time').first().getAttribute('datetime')==='2026-10-26','automatic midnight/Monday week rollover '+width);
   const permissions=await page.evaluate(()=>window.__obsPermissions);check(Object.values(permissions).every(x=>x===0),'no implicit permissions '+width,permissions);
   await noOverflow(page,'homepage '+width);await screenshot(page,'journey-'+width+'-home');
   await page.locator('#homeAssistant summary').click();await page.locator('#homeAssistant button').filter({hasText:'Prepare preview'}).click();
   const homePreview=page.locator('#homeAssistant textarea[readonly]');check((await homePreview.inputValue()).includes('calendar-study-packet'),'home AI preview prepared locally '+width);
   await page.locator('#homeDate').fill('2024-11-03');check(await page.locator('#homeClockMode').inputValue()==='frozen','date edit freezes live clock '+width);check(await page.locator('#homeDownload').isDisabled(),'stale home export disabled '+width);check(await homePreview.inputValue()==='','stale home AI preview cleared '+width);
   await page.locator('#homePlace').selectOption('newyork');await page.locator('#homeTime').fill('01:30:00');await page.locator('#homeRefresh').click();await includes(page,'#homeError','occurs twice');
   await page.locator('#homeFold').selectOption('earlier');await page.locator('#homeRefresh').click();await includes(page,'#homeStatus','2024-11-03T05:30');
   await page.locator('#homeFold').selectOption('later');await page.locator('#homeRefresh').click();await includes(page,'#homeStatus','2024-11-03T06:30');
   check(await page.locator('#homeError').isHidden(),'home DST recovery '+width);
   await page.locator('#collection > summary').click();check(await page.locator('#collection a[href="pages/book1/index.html"]').count()>0,'original collection preserved and reachable '+width);
   setCurrent('comparison '+width);
   const query=new URLSearchParams({at:'2024-11-03T06:30:00Z',lat:'40.7128',lon:'-74.006',zone:'America/New_York'});
   await page.goto(base+'pages/calendar-compare.html?'+query,{waitUntil:'domcontentloaded'});await includes(page,'#obs-status','2024-11-03T06:30');
   check(await page.locator('#obs-fold').inputValue()==='later','incoming exact instant resolves actual DST occurrence '+width);
   if(width<=480)for(const selector of ['#obs-date','#obs-time']){const r=await page.locator(selector).evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,fontSize:parseFloat(getComputedStyle(el).fontSize)}));check(r.width>=200&&r.height>=44&&r.fontSize>=16,'native comparison clock value has readable space '+width+' '+selector,r);}
   check(await page.locator('#obs-calendars article').count()===13,'13 named civil conventions rendered '+width);
   const comparison=await jsonDownload(page,'#obs-json');check(comparison.context.dateISO==='2024-11-03T06:30:00.000Z'&&comparison.context.timeZone==='America/New_York','JSON exports actual displayed context '+width);
   check(comparison.calendars.every(x=>x.boundary==='civil-midnight'&&x.method&&x.sourceIds.length),'exported methods and day boundaries '+width);
   await page.locator('#obs-assistant summary').click();const assistant=page.locator('#obs-assistant');await assistant.getByRole('button',{name:'Prepare preview',exact:true}).click();
   const preview=assistant.locator('textarea[readonly]');let prompt=await preview.inputValue();check(prompt.includes('calendar-study-packet')&&!prompt.includes('40.7128')&&!prompt.includes('America/New_York')&&!prompt.includes('-74.006'),'default AI packet omits observer location and zone '+width);
   check((await assistant.getByRole('link',{name:'Open ChatGPT'}).getAttribute('href'))==='https://chatgpt.com/','ChatGPT link has no packet query or automatic send '+width);
   await assistant.getByRole('button',{name:'Explain locally'}).click();check((await assistant.locator('.ca-local').textContent()).includes('linear Lahiri'),'local deterministic explanation is available '+width);
   await assistant.locator('input[type=checkbox]').check();check(await preview.inputValue()==='','disclosure change clears old preview '+width);
   await assistant.getByRole('button',{name:'Prepare preview',exact:true}).click();prompt=await preview.inputValue();check(prompt.includes('40.7128')&&prompt.includes('America/New_York'),'explicit disclosure includes selected observer '+width);
   await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('Fixture denial','NotAllowedError');}}}));
   await assistant.getByRole('button',{name:'Copy prompt',exact:true}).click();await includes(page,'#obs-assistant .ca-status','Clipboard access is unavailable');
   check(await preview.evaluate(el=>document.activeElement===el&&el.selectionStart===0&&el.selectionEnd===el.value.length),'clipboard failure provides selected manual-copy text '+width);
   await assistant.locator('textarea:not([readonly])').fill('A changed question');check(await preview.inputValue()==='','question edit clears copied preview '+width);
   await page.locator('#obs-lat').fill('41');check(await page.locator('#obs-json').isDisabled()&&await page.locator('#obs-tool-links a').count()===0,'edited comparison disables stale exports and links '+width);
   await page.locator('#obs-time').fill('01:30:00');await page.locator('#obs-date').fill('2024-11-03');await page.locator('.obs-method-options > summary').click();await page.locator('#obs-fold').selectOption('reject');await page.locator('#obs-update').click();await includes(page,'#obs-error','occurs twice');
   check(await page.locator('#obs-fold').getAttribute('aria-invalid')==='true','ambiguous fold error associated with choice '+width);
   await page.locator('#obs-fold').selectOption('earlier');await page.locator('#obs-update').click();await includes(page,'#obs-status','2024-11-03T05:30');
   await page.locator('#obs-date').fill('2024-03-10');await page.locator('#obs-time').fill('02:30:00');await page.locator('#obs-update').click();await includes(page,'#obs-error','does not exist');
   check(await page.locator('#obs-date').inputValue()==='2024-03-10'&&await page.locator('#obs-time').inputValue()==='02:30:00','gap error retains entered date and time '+width);
   await page.locator('#obs-time').fill('03:30:00');await page.locator('#obs-update').click();await includes(page,'#obs-status','2024-03-10T07:30');
   await noOverflow(page,'comparison '+width);await usable(page,'#obs-json','comparison JSON '+width);await screenshot(page,'journey-'+width+'-compare');
   await page.locator('#obs-locate').click();await includes(page,'#obs-location-status','permission was denied');check((await page.evaluate(()=>window.__obsPermissions)).location===1,'location permission only after explicit click '+width);
   if(width<800){await page.locator('.ob-mobile-nav button').click();check(await page.locator('.nav-toggle').getAttribute('aria-expanded')==='true','mobile dock opens complete navigation '+width);await page.locator('#navbtn-cast').click();await page.keyboard.press('Escape');check(await page.locator('#navbtn-cast').getAttribute('aria-expanded')==='false','Escape closes group '+width);await page.keyboard.press('Escape');check(await page.locator('.nav-toggle').getAttribute('aria-expanded')==='false','Escape closes drawer '+width);}
   await page.goto(base+'pages/calendar-compare.html?at=invalid&lat=40&lon=-74&zone=UTC',{waitUntil:'domcontentloaded'});await page.locator('#obs-error:not([hidden])').waitFor();check(await page.locator('#obs-json').isDisabled(),'invalid incoming link is held, not replaced by now '+width);
  }finally{await context.close();}}
  // The actual running instant remains unambiguous during the autumn clock fold.
  const {context,page,setCurrent}=await contextFor({width:390,height:844});try{setCurrent('live DST fold');await page.clock.install({time:new Date('2024-11-03T06:30:00Z')});await page.goto(base,{waitUntil:'domcontentloaded'});await readyHome(page);await page.locator('#homePlace').selectOption('newyork');await page.locator('#homeRefresh').click();await includes(page,'#homeStatus','2024-11-03T06:30');check(await page.locator('#homeError').isHidden(),'live known instant is not rejected as ambiguous wall time');check(await page.locator('#homeClockMode').inputValue()==='live','live fold retains follow-present mode');}finally{await context.close();}
 }
 evidence.source.productAtEnd=await productHashes();
 evidence.source.productUnchanged=JSON.stringify(evidence.source.productAtStart)===JSON.stringify(evidence.source.productAtEnd);
 if(phase!=='baseline'){
  check(evidence.source.productUnchanged,'tested product source remained unchanged throughout the run');
  check(evidence.errors.length===0,'zero browser runtime exceptions',evidence.errors);
  check(evidence.missing.length===0,'zero missing local resources',evidence.missing);
 }
}catch(error){failure=error;evidence.failure={message:error.message,stack:error.stack};}
finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));evidence.finishedAt=new Date().toISOString();evidence.pass=!failure;await writeFile(resolve(output,'receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({phase,pass:evidence.pass,sweeps:evidence.sweeps.length,checks:evidence.checks.length,errors:evidence.errors.length,missing:evidence.missing.length,externalRequests:evidence.externalRequests.length,receipt:resolve(output,'receipt.json')},null,2));}
if(failure)throw failure;
