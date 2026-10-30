// Actual atlas, personal-context and research-lab browser workflows.
// No hosted model, account or sensor call.
// ATLAS_PHASE=all|atlas|personal|search|research; ATLAS_OUTPUT=path.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,process.env.ATLAS_OUTPUT||'docs/evidence/atlas/current');
const phase=process.env.ATLAS_PHASE||'all';
assert.ok(['all','atlas','personal','search','research'].includes(phase),'known phase');
await mkdir(output,{recursive:true});
const pkg=process.env.PLAYWRIGHT_PKG?await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href):await import('playwright').catch(()=>import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js'));
const chromium=pkg.chromium||pkg.default?.chromium;
const sha=body=>createHash('sha256').update(body).digest('hex');
async function files(dir){const list=[];for(const item of await readdir(resolve(root,dir),{withFileTypes:true})){if(item.name.startsWith('.')||item.name==='node_modules')continue;const rel=dir+'/'+item.name;if(item.isDirectory())list.push(...await files(rel));else list.push(rel);}return list;}
async function product(){const paths=['index.html','sw.js','manifest.webmanifest',...await files('assets'),...await files('pages'),...(await files('mcp')).filter(p=>/\.(mjs|json)$/.test(p))];return Object.fromEntries(await Promise.all(paths.sort().map(async p=>[p,sha(await readFile(resolve(root,p)))])));}
const before=await product();
const report={schemaVersion:1,phase,round:process.env.ATLAS_ROUND||'candidate',startedAt:new Date().toISOString(),checks:[],downloads:[],screenshots:[],errors:[],missing:[],externalRequests:[],source:{testScriptSHA256:sha(await readFile(fileURLToPath(import.meta.url))),productAtStartSHA256:sha(JSON.stringify(before))},limits:{realProviderCalled:false,physicalPhone:false,screenReader:false}};
const prefix='/astrology-sim-ant/';
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(prefix))return res.writeHead(404).end();let rel=decodeURIComponent(u.pathname.slice(prefix.length));if(!rel||rel.endsWith('/'))rel+='index.html';const path=resolve(root,rel);if(!path.startsWith(root+sep)||rel.split('/').some(p=>p.startsWith('.')))return res.writeHead(403).end();res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'}).end(await readFile(path));}catch{return res.writeHead(404).end('Not found');}});
let browser,failure,base,origin;
const check=(ok,label,details)=>{report.checks.push({label,pass:!!ok,...(details?{details}:{})});assert.ok(ok,label+(details?' '+JSON.stringify(details):''));};
const selected=name=>phase==='all'||phase===name;
async function includes(page,selector,text){await page.waitForFunction(({selector,text})=>document.querySelector(selector)?.textContent?.includes(text),{selector,text});}
async function context(width){const c=await browser.newContext({viewport:{width,height:900},locale:'en-US',reducedMotion:'reduce',serviceWorkers:'block',acceptDownloads:true});await c.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===origin||['data:','blob:'].includes(u.protocol))return r.continue();report.externalRequests.push(u.href);return r.abort('blockedbyclient');});await c.addInitScript(()=>{window.__atlasPermissions={location:0,camera:0};Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(_ok,no)=>{window.__atlasPermissions.location++;no({code:1,message:'Fixture denies'});}}});});const page=await c.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>report.errors.push({url:page.url(),message:e.message}));page.on('console',m=>{if(m.type()==='error')report.errors.push({url:page.url(),message:m.text(),kind:'console'});});page.on('response',r=>{if(r.status()>=400)report.missing.push({url:r.url(),status:r.status()});});return{c,page};}
async function layout(page,label){const info=await page.evaluate(()=>{const main=document.querySelector('main'),a=document.querySelector('.skip-link');let skip=false;try{skip=!!a&&!!document.querySelector(a.getAttribute('href'));}catch{}return{viewport:innerWidth,scroll:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,header:!!document.querySelector('header.site'),skip};});check(info.scroll<=info.viewport+1&&info.main===1&&info.header&&info.skip,label+' reflow and landmarks',info);}
async function shot(page,label,selector,block='center'){if(selector)await page.locator(selector).evaluate((el,position)=>el.scrollIntoView({block:position,behavior:'instant'}),block);else await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const file=label+'.png';await page.screenshot({path:resolve(output,file)});report.screenshots.push(file);}
async function download(page,selector,label){const pending=page.waitForEvent('download');await page.locator(selector).click();const item=await pending;check(await item.failure()===null,label+' download completed');const body=await readFile(await item.path());report.downloads.push({label,filename:item.suggestedFilename(),bytes:body.length,sha256:sha(body)});check(body.length>50,label+' nonempty artifact');return body;}
async function decodePNG(page,body,label){check(body.subarray(0,8).toString('hex')==='89504e470d0a1a0a',label+' PNG signature');const info=await page.evaluate(async data=>{const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const colors=new Set();const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;for(let i=0;i<pixels.length;i+=64)colors.add([...pixels.slice(i,i+4)].join(','));return{width:image.width,height:image.height,colors:colors.size};},body.toString('base64'));check(info.width>=500&&info.height>=500&&info.colors>4,label+' actual drawing pixels',info);}
async function tableKeyboard(page,selector,label){
 const region=page.locator(selector).first();const bounds=await region.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,role:el.getAttribute('role'),tabIndex:el.tabIndex,label:el.getAttribute('aria-label')}));
 check(bounds.role==='region'&&bounds.tabIndex===0&&!!bounds.label,label+' has named keyboard region',bounds);
 if(bounds.scroll>bounds.width+1){await region.evaluate(el=>el.scrollLeft=0);await region.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);check(await region.evaluate(el=>el.scrollLeft)>0,label+' responds to horizontal keyboard scrolling');await region.evaluate(el=>el.scrollLeft=0);}
}
const publicQuery=new URLSearchParams({at:'2026-10-29T12:00:00Z',lat:'51.5074',lon:'-0.1278',zone:'Europe/London'});
const atlasURL=()=>base+'pages/calendar-atlas.html?'+publicQuery;
async function atlas(width){
 const {c,page}=await context(width);
 try{
  if(width===1440)await page.setViewportSize({width,height:800});
  await page.goto(atlasURL());await page.locator('#atlas-dial svg').waitFor();
  if(width>=1440){const b=await page.locator('#atlas-update').boundingBox(),header=await page.locator('header.site').boundingBox();check(b.y>=header.y+header.height&&b.y+b.height<=(width===1440?800:900),'desktop cold-open Calculate is visible without scrolling '+width,b);if(width===1440)await page.setViewportSize({width,height:900});}

  const plateSize=await page.locator('#atlas-dial svg').evaluate(el=>{const r=el.getBoundingClientRect();return{width:r.width,height:r.height};});
  check(Math.abs(plateSize.width-plateSize.height)<1,'responsive sky plate preserves square geometry without letterboxing '+width,plateSize);
  check(await page.locator('#atlas-matrix tbody tr').count()===32,'all32 named atlas variants remain visible '+width);
  await tableKeyboard(page,'#atlas-matrix-wrap','atlas matrix '+width);
  const beforeJumpDate=await page.locator('#atlas-date').inputValue();for(const href of ['#atlas-dial','#atlas-comparison-title','#atlas-personal','#atlas-export-heading','#atlas-source-heading']){await page.locator('.atlas-jump a[href="'+href+'"]').click();check(new URL(page.url()).hash===href&&await page.locator('#atlas-date').inputValue()===beforeJumpDate&&!await page.locator('#atlas-json').isDisabled(),'atlas section jump preserves calculated context '+href+' '+width);}
  const all=JSON.parse(await download(page,'#atlas-json','all atlas variants '+width));
  check(all.rows.length===32&&all.families.length===7&&['vedic-regional','egyptian-ancient-civil','egyptian-lunar','hebrew-sunset','jewish-kabbalah','chinese-bazi','islamic-observed-crescent'].every(id=>all.rows.find(r=>r.id===id)?.status==='unavailable'),'all export retains seven families and explicitly unimplemented methods '+width);
  const svg=(await download(page,'#atlas-svg','computed sky plate '+width)).toString();
  const metadata=await page.evaluate(text=>{const doc=new DOMParser().parseFromString(text,'image/svg+xml');return{data:JSON.parse(doc.querySelector('metadata').textContent),errors:doc.querySelectorAll('parsererror').length,title:doc.querySelector('title').textContent,description:doc.querySelector('desc').textContent}},svg);
  check(!metadata.errors&&metadata.data.sunLongitude===all.sharedAstronomy.sunLongitude&&metadata.data.moonLongitude===all.sharedAstronomy.moonLongitude&&metadata.data.dateISO===all.context.dateISO,'SVG uses exact exported context and computed Sun/Moon values '+width);
  check(metadata.data.privateBirthIncluded===false&&!svg.includes('51.5074')&&!/<(?:script|foreignObject)\b/.test(svg),'sky SVG carries public geometry without observer/birth or executable content '+width);
  await page.locator('#atlas-tab-lunar').focus();await page.keyboard.press('ArrowRight');
  check(await page.locator('#atlas-tab-solar').getAttribute('aria-selected')==='true'&&await page.locator('#atlas-panel-solar').isVisible(),'solar calculator tab works by keyboard '+width);
  await page.locator('.atlas-selection > summary').click();await page.locator('#atlas-clear').click();await page.locator('#atlas-selected-only').check();
  check(await page.locator('#atlas-empty').isVisible()&&await page.locator('#atlas-json').isDisabled(),'empty selection has recovery and cannot export invented rows '+width);
  for(const id of['gregory','vedic-lunar','egyptian-ancient-civil'])await page.locator(`#atlas-variant-list input[value="${id}"]`).check();
  const subset=JSON.parse(await download(page,'#atlas-json','selected atlas variants '+width));
  check(subset.rows.length===3&&await page.locator('#atlas-matrix tbody tr').count()===3&&subset.rows.some(r=>r.id==='egyptian-ancient-civil'&&r.status==='unavailable'),'selected UI and JSON agree including unavailable methods '+width);
  check(!Object.hasOwn(subset,'comparison')&&subset.methods.length===3&&subset.selection.variantIds.length===3&&!subset.rows.some(r=>r.id==='prayer-timetable'),'selected export omits buried unselected comparison and method records '+width);
  await c.grantPermissions(['clipboard-read','clipboard-write'],{origin});await page.locator('#atlas-share').click();
  const shared=await page.evaluate(()=>navigator.clipboard.readText()),sharedURL=new URL(shared);
  check(sharedURL.pathname.startsWith(prefix)&&sharedURL.searchParams.get('variants').split(',').sort().join(',')==='egyptian-ancient-civil,gregory,vedic-lunar','copied URL contains exact selected variants '+width);
  await page.goto(shared);await page.locator('#atlas-dial svg').waitFor();
  check(await page.locator('#atlas-selected-only').isChecked()&&await page.locator('#atlas-matrix tbody tr').count()===3,'copied selected URL roundtrip restores displayed subset '+width);
  await page.locator('.atlas-selection > summary').click();
  await page.locator('#atlas-view').selectOption('single');await page.locator('#atlas-single').selectOption('egyptian-ancient-civil');
  check((await page.locator('#atlas-reading').innerText()).includes('No ancient conversion epoch'),'focused method preserves explicit unavailable reason '+width);
  await page.locator('#atlas-all').click();await page.locator('#atlas-view').selectOption('matrix');
  check(await page.locator('#atlas-matrix tbody tr').count()===32,'all selection recovers complete ledger '+width);
  check((await page.locator('#atlas-sources').innerText()).includes('books were not read'),'selected source-reading depth visible '+width);
  await layout(page,'atlas populated '+width);if(width===1440||width===1920||width===390)await shot(page,'atlas-'+width,'#atlas-dial');
  const old=await page.locator('#atlas-dial').innerHTML();await page.locator('#atlas-date').fill('1800-01-01');
  check(await page.locator('#atlas-json').isDisabled()&&await page.locator('#atlas-stale').isVisible(),'edited atlas context marks old drawing and disables export '+width);
  await page.locator('#atlas-update').click();await page.locator('#atlas-error:not([hidden])').waitFor();
  check(await page.locator('#atlas-dial').innerHTML()===old&&await page.locator('#atlas-error').evaluate(el=>document.activeElement===el),'invalid date preserves previous labelled plate and focuses error '+width);
  await page.locator('#atlas-date').fill('2026-10-30');await page.locator('#atlas-update').click();await page.waitForFunction(()=>!document.querySelector('#atlas-json').disabled);
  check((await page.locator('#atlas-context').innerText()).includes('2026-10-30'),'valid atlas recovery updates printed instant '+width);
  for(const [route,family,count]of[['western','western',9],['vedic','vedic',5],['egyptian','egyptian',3],['hebrew','jewish',3],['chinese','chinese',3]]){
   await page.goto(base+'pages/calendars/'+route+'.html?'+publicQuery);await page.locator('#atlas-dial svg').waitFor();
   check(await page.locator('body').getAttribute('data-atlas-family')===family&&await page.locator('#atlas-matrix tbody tr').count()===count,'direct '+route+' route keeps only named family '+width);
   const links=await page.locator('#atlas-families a').evaluateAll(els=>els.map(a=>a.href));check(links.every(u=>u.startsWith(base)),'family navigation retains Pages prefix '+route+' '+width);
   if(route==='chinese'){
    await page.locator('#atlas-view').selectOption('single');await page.locator('#atlas-single').selectOption('chinese-solar-terms');
    check(await page.locator('#atlas-reading table tbody tr').count()===24&&(await page.locator('#atlas-reading').innerText()).includes('Asia/Hong_Kong'),'Chinese term inspector exposes24 events and named reference zone '+width);
    check((await page.locator('#atlas-reading').innerText()).toLowerCase().includes('historical'),'solar-term inspector retains historical time-zone qualification '+width);if(width===1440)await shot(page,'solar-terms-1440','#atlas-reading','start');
   }
   await layout(page,'family '+route+' '+width);
  }
  for(const [family,count]of[['islamic',4],['civil',5]]){
   await page.goto(base+'pages/calendar-atlas.html?'+publicQuery+'&family='+family);await page.locator('#atlas-dial svg').waitFor();
   const scoped=JSON.parse(await download(page,'#atlas-json',family+' family export '+width));
   check(scoped.rows.length===count&&scoped.rows.every(r=>r.familyId===family)&&scoped.context.dateISO==='2026-10-29T12:00:00.000Z','generic '+family+' family query and calculation export agree '+width);
   check(await page.locator('#atlas-matrix tbody tr').count()===count,'generic '+family+' family display contains only its rows '+width);
   await layout(page,'generic family '+family+' '+width);
  }
  if(width===1440){await page.setViewportSize({width:720,height:500});await layout(page,'atlas half-width CSS viewport (200-percent zoom reflow proxy)');check(await page.locator('#atlas-update').isVisible(),'zoom-reflow proxy retains calculate control');await page.setViewportSize({width,height:900});}
 }finally{await c.close();}
}
async function personal(width){
 const {c,page}=await context(width);
 try{
  await page.goto(atlasURL());await page.locator('#atlas-dial svg').waitFor();const host=page.locator('#atlas-personal'),field=k=>host.locator(`[data-pc-field="${k}"]`),action=k=>host.locator(`[data-pc-action="${k}"]`);
  const initialURL=page.url(),initialStorage=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
  const personalFont=await host.evaluate(el=>parseFloat(getComputedStyle(el.querySelector('.pc-panel')).fontSize));check(personalFont>=16,'personal panel text retains readable base size '+width,personalFont);
  check(await action('apply').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))>=16,'personal Apply action retains16px text '+width);
  await host.locator('.pc-panel > summary').click();await field('date').fill('2024-11-03');await field('timeZone').fill('America/New_York');await action('apply').click();await host.locator('.pc-context').waitFor();
  check((await host.locator('.pc-context').innerText()).includes('25 actual hours'),'unknown birth time uses actual DST civil-day interval '+width);
  check((await host.locator('.pc-results').innerText()).includes('Unavailable without a recorded birth time'),'unknown-time limitations remain explicit '+width);
  await host.locator('.pc-export > summary').click();await action('prepare').click();
  const minimal=JSON.parse(await download(page,'#atlas-personal [data-pc-action="download"]','default personal metadata '+width));
  check(minimal.kind==='personal-calendar-methods'&&!JSON.stringify(minimal).includes('2024-11-03')&&!JSON.stringify(minimal).includes('America/New_York'),'default personal export excludes birth date, zone and readings '+width);
  await field('includeBirth').focus();await page.keyboard.press('Space');check(await action('download').isDisabled()&&await host.locator('[data-pc="preview"]').inputValue()==='','private opt-in clears prior export preview '+width);
  await action('prepare').click();const interval=JSON.parse(await download(page,'#atlas-personal [data-pc-action="download"]','disclosed unknown-time interval '+width));
  check(interval.certainty==='unknown-time-interval'&&interval.birthContext.actualHours===25&&interval.western.bodies.every(b=>b.status==='sampled-range'&&!b.representativeIsBirthPosition)&&!Object.hasOwn(interval.western,'ascendantDegrees'),'explicit unknown-time export carries sampled uncertainty without an exact ascendant '+width);
  check(interval.returns.solar.status==='unavailable'&&interval.returns.lunar.status==='unavailable'&&!Object.hasOwn(interval.vedic,'vimshottari')&&interval.western.bodies.every(b=>!Object.hasOwn(b,'house')),'unknown-time export withholds exact returns, periods and house placements '+width);
  await field('timeKnown').check();await field('time').fill('01:30:00');await field('lat').fill('40.7128');await field('lon').fill('-74.006');await action('apply').click();await host.locator('[data-pc="error"]:not([hidden])').waitFor();
  check(await host.locator('.pc-context').count()===0,'ambiguous birth clock is rejected without a chosen fold '+width);
  await field('disambiguation').selectOption('later');await action('apply').click();await host.locator('.pc-context').waitFor();
  check((await host.locator('.pc-context').innerText()).includes('2024-11-03T06:30:00.000Z'),'explicit later birth clock resolves the recorded UTC instant '+width);
  if(!(await host.locator('.pc-export').getAttribute('open')!==null))await host.locator('.pc-export > summary').click();
  await field('includeBirth').check();await action('prepare').click();const known=JSON.parse(await download(page,'#atlas-personal [data-pc-action="download"]','disclosed known-time study '+width));
  check(known.certainty==='recorded-time'&&known.birthContext.instantUTC==='2024-11-03T06:30:00.000Z'&&Number.isFinite(known.western.ascendantDegrees),'known-time output includes only explicitly supplied birth context '+width);
  if(width===390){
   await field('includeReturns').check();await action('apply').click();await host.locator('.pc-context').waitFor();await host.locator('.pc-return > summary').click();
   check((await host.locator('.pc-return').innerText()).includes('longitude residual'),'optional timed return disclosure shows calculated residual and method');
   await field('includeBirth').check();await action('prepare').click();const returned=JSON.parse(await download(page,'#atlas-personal [data-pc-action="download"]','explicit timed return study'));
   check(['solar','lunar'].every(k=>returned.returns[k].status==='calculated'&&Number.isFinite(returned.returns[k].residualDegrees)&&Math.abs(returned.returns[k].residualDegrees)<.01),'known-time optional returns export calculated instants and bounded longitude residuals');
  }
  const publicOutput=JSON.parse(await download(page,'#atlas-json','public atlas with personal context '+width));
  check(!JSON.stringify(publicOutput).includes('2024-11-03')&&!JSON.stringify(publicOutput).includes('40.7128'),'public atlas export excludes separately applied birth details '+width);
  await c.grantPermissions(['clipboard-read','clipboard-write'],{origin});await page.locator('#atlas-share').click();const publicLink=await page.evaluate(()=>navigator.clipboard.readText());
  check(!publicLink.includes('2024-11-03')&&!publicLink.includes('40.7128')&&!publicLink.includes('birth'),'copied public link excludes separately held birth context '+width);
  check(page.url()===initialURL&&JSON.stringify(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})))===JSON.stringify(initialStorage),'birth workflow leaves URL and storage unchanged '+width);
  await layout(page,'personal known-time workflow '+width);if(width===390)await shot(page,'personal-390','#atlas-personal .pc-results');
  await page.locator('#atlas-date').fill('2026-11-01');check(await action('download').isDisabled()&&await host.locator('.pc-context').count()===0,'public context edit invalidates private derived results and export '+width);
  await action('clear').click();check(await field('date').inputValue()===''&&await field('timeZone').inputValue()===''&&await field('lat').inputValue()==='','explicit clear removes private input fields '+width);
 }finally{await c.close();}
}
async function search(width){
 const {c,page}=await context(width);
 try{
  await page.goto(base+'pages/calendar-search.html');await page.waitForFunction(()=>document.querySelector('#cs-criterion-kind').options.length>3);
  await page.locator('#cs-start').fill('2024-11-01');await page.locator('#cs-end').fill('2024-11-07');await page.locator('#cs-time').fill('01:30:00');await page.locator('#cs-zone').fill('America/New_York');
  await page.locator('#cs-criterion-kind').selectOption('weekday');await page.locator('#cs-values').fill('1');await page.locator('#cs-add').click();await page.locator('#cs-mode').selectOption('benchmark');await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled,{},{timeout:60000});
  const benchmark=JSON.parse(await download(page,'#cs-json','actual strategy comparison '+width)),r=benchmark.result.optimized;
  check(benchmark.operation==='benchmark'&&benchmark.result.equivalence.identical,'worker benchmark reports equal semantic results '+width);
  check(r.counts.totalDates===7&&r.counts.unavailableSamples===1&&r.counts.matched===1&&r.hits[0].date==='2024-11-04','weekly search preserves ambiguous clock and exact Monday result '+width);
  check((await page.locator('#cs-benchmark').innerText()).includes('not a general performance guarantee'),'benchmark timing is qualified separately from equivalence '+width);
  const csv=(await download(page,'#cs-csv','strategy comparison CSV '+width)).toString();check(csv.includes('2024-11-04')&&csv.includes('2024-11-04T06:30:00.000Z')&&csv.includes('settings'),'CSV preserves actual selected sample and settings '+width);
  await page.locator('[data-sample-date="2024-11-04"]').click();const linked=await page.locator('#cs-selected a').getAttribute('href');
  check(linked.startsWith(base)&&new URL(linked).searchParams.get('at')==='2024-11-04T06:30:00.000Z','search opens exact sample in project-prefixed atlas '+width);
  await page.locator('#cs-start').fill('2024-11-02');check(await page.locator('#cs-json').isDisabled()&&await page.locator('#cs-selected').isHidden(),'edited experiment clears prior export and selected sample '+width);
  await page.locator('#cs-start').fill('2024-11-01');await page.locator('#cs-criteria [data-remove-criterion]').click();await page.locator('#cs-limit').fill('1');await page.locator('#cs-mode').selectOption('optimized');await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled);
  const capped=JSON.parse(await download(page,'#cs-json','capped search '+width)).result;
  check(capped.counts.matched===6&&capped.counts.returned===1&&capped.counts.truncated===true,'return cap preserves full-range matched denominator '+width);
  await page.locator('#cs-associate').click();await page.locator('#cs-error:not([hidden])').waitFor();check(await page.locator('#cs-json').isDisabled(),'event study requires explicit chosen-clock acknowledgement '+width);
  const data=[{id:'fold',title:'Ambiguous clock test date',date:'2024-11-03',precision:'date-only'},{id:'monday-a',title:'Monday A',date:'2024-11-04',precision:'date-only'},{id:'monday-b',title:'Monday B',date:'2024-11-11',precision:'date-only'}];
  await page.locator('#cs-events-file').evaluate(el=>{const d=el.closest('details');if(d)d.open=true;});
  await page.locator('#cs-events-file').setInputFiles({name:'bounded-events.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.waitForFunction(()=>!document.querySelector('#cs-apply-import').disabled);
  check((await page.locator('#cs-import-preview').innerText()).includes('unverified'),'import preview labels source claims unverified '+width);
  await page.locator('#cs-apply-import').click();await page.locator('#cs-event-ack').check();await page.locator('#cs-offsets').fill('-7,7');await page.locator('#cs-criterion-kind').selectOption('weekday');await page.locator('#cs-values').fill('1');await page.locator('#cs-add').click();await page.locator('#cs-start').fill('');await page.locator('#cs-associate').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled,{},{timeout:60000});
  const association=JSON.parse(await download(page,'#cs-json','event control comparison '+width));
  check(association.operation==='association'&&association.result.counts.events===3&&association.result.overall.event.observed===2&&association.result.overall.event.matched===2,'association preserves selected-event eligibility and denominator '+width);
  check(await page.locator('#cs-start').inputValue()===''&&await page.locator('#cs-error').isHidden(),'event association is independent of unrelated search range '+width);
  check(association.result.overall.event.missing===1&&association.result.overall.event.rate===1&&association.result.overall.offsetComparisons.length===2,'ambiguous event sample remains missing with two declared shift comparisons '+width);
  check((await page.locator('#cs-association').innerText()).includes('not the probability or risk of an event'),'descriptive association does not imply event risk '+width);
  await layout(page,'research lab results '+width);if(width===1440||width===390)await shot(page,'search-'+width,'#cs-association');
  await page.locator('#cs-advanced').check();await page.locator('#cs-start').fill('1901-01-01');await page.locator('#cs-end').fill('2099-12-31');await page.locator('#cs-mode').selectOption('brute');await page.locator('#cs-run').click();await page.locator('#cs-cancel').click();
  check(await page.locator('#cs-json').isDisabled()&&await page.locator('#cs-cancel').isDisabled()&&(await page.locator('#cs-status').innerText()).includes('cancelled'),'cancelled large worker job has no current export '+width);
  await page.waitForTimeout(150);check(await page.locator('#cs-json').isDisabled()&&await page.locator('#cs-results').innerText()==='','terminated job cannot revive stale result '+width);
 }finally{await c.close();}
}
async function research(width){
 const {c,page}=await context(width);
 try{
  await page.goto(base+'pages/calendar-search.html');await page.waitForFunction(()=>document.querySelector('#cs-criterion-kind').options.length>3);
  await page.locator('#cs-start').fill('2024-11-04');await page.locator('#cs-end').fill('2024-11-04');await page.locator('#cs-time').fill('12:00:00');await page.locator('#cs-zone').fill('Europe/London');
  const injectedTitle='=1+1 <img src=x onerror="window.__atlasInjected=true">';
  const imported=[{id:'plain-text',title:injectedTitle,date:'2024-11-04',sourceUrl:'https://example.invalid/date-record',sourceStatus:'VERIFIED_PRIMARY_SENTINEL',privateBirth:{sentinel:'PRIVATE_SENTINEL'}},{id:'skipped',title:'Skipped Apia civil date',date:'2011-12-30'}];
  await page.locator('#cs-events-file').evaluate(el=>{el.closest('details').open=true;});
  await page.locator('#cs-events-file').setInputFiles({name:'literal-event-data.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});await page.waitForFunction(()=>!document.querySelector('#cs-apply-import').disabled);
  check((await page.locator('#cs-import-preview').innerText()).includes(injectedTitle)&&await page.locator('#cs-import-preview img, #cs-import-preview script').count()===0,'import title renders as literal text, never executable markup '+width);
  await page.locator('#cs-apply-import').click();await page.locator('#cs-event-select').selectOption('plain-text');await page.locator('#cs-event-ack').check();await page.locator('#cs-signature-fields').selectOption(['weekday']);await page.locator('#cs-event-signature').click();await includes(page,'#cs-status','Event-derived criteria are ready');
  check((await page.locator('#cs-method-summary').innerText()).includes('This record supplies no event time')&&(await page.locator('#cs-criteria').innerText()).includes('Civil weekday: 1'),'event signature preserves record precision and derives an explicit sampled weekday '+width);
  await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled);
  const derived=JSON.parse(await download(page,'#cs-json','event signature self-match '+width));
  check(derived.result.hits.length===1&&derived.result.hits[0].date==='2024-11-04'&&derived.selectionContext.event.id==='plain-text','selected event matches its own derived feature with selection context exported '+width);
  check(!JSON.stringify(derived).includes('PRIVATE_SENTINEL')&&!JSON.stringify(derived).includes('VERIFIED_PRIMARY_SENTINEL')&&derived.selectionContext.event.sourceStatus.includes('caller-supplied'),'untrusted private fields and verification badges do not propagate into result bytes '+width);
  await page.locator('[data-sample-date="2024-11-04"]').click();const exactLink=new URL(await page.locator('#cs-selected a').getAttribute('href'));
  check(exactLink.searchParams.get('system')==='regiomontanus'&&exactLink.searchParams.get('prayerMethod')==='MuslimWorldLeague'&&exactLink.searchParams.get('asr')==='Shafi'&&exactLink.searchParams.get('highLatitude')==='MiddleOfTheNight','sample link retains named calculation conventions '+width);
  const host=page.locator('#cs-personal');check(await host.evaluate(el=>parseFloat(getComputedStyle(el.querySelector('.pc-panel')).fontSize))>=16,'embedded search personal panel retains16px text '+width);check(await host.locator('[data-pc-action="apply"]').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))>=16,'embedded personal action resists smaller inherited font '+width);await host.locator('.pc-panel > summary').click();await host.locator('[data-pc-field="date"]').fill('1991-07-09');await host.locator('[data-pc-field="timeZone"]').fill('Europe/Paris');await host.locator('[data-pc-action="apply"]').click();await host.locator('.pc-context').waitFor();
  const privateFree=(await download(page,'#cs-json','public search after private birth apply '+width)).toString();const csv=(await download(page,'#cs-csv','public search CSV after private birth apply '+width)).toString();
  check(!privateFree.includes('1991-07-09')&&!privateFree.includes('Europe/Paris')&&!csv.includes('1991-07-09')&&!csv.includes('Europe/Paris'),'JSON and CSV omit separately held private birth inputs '+width);
  check(await page.evaluate(()=>window.__atlasInjected===undefined)&&await page.locator('#cs-method-summary img').count()===0,'imported source text remains inert after signature and export '+width);
  await page.locator('#cs-zone').fill('America/New_York');await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled);
  const moved=JSON.parse(await download(page,'#cs-json','event reference after observer edit '+width));
  check(moved.result.hits[0].sampleUTC!==derived.result.hits[0].sampleUTC&&JSON.stringify(moved.selectionContext)===JSON.stringify(derived.selectionContext),'observer edit changes current sample but preserves immutable event-reference clock/context '+width);
  await page.locator('#cs-criterion-kind').selectOption('lunar:phaseIndex');await page.locator('#cs-values').fill(String(moved.result.hits[0].lunar.phaseIndex));await page.locator('#cs-add').click();await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled);
  const edited=JSON.parse(await download(page,'#cs-json','edited event-derived criterion '+width));
  check(edited.selectionContext.modifiedAfterDerivation===true&&edited.selectionContext.sampleUTC===derived.selectionContext.sampleUTC,'edited event-derived pattern retains its origin and marks post-selection modification '+width);
  const priorCriteria=await page.locator('#cs-criteria').innerText();await page.locator('#cs-zone').fill('Pacific/Apia');await page.locator('#cs-event-select').selectOption('skipped');await page.locator('#cs-event-signature').click();await page.locator('#cs-error:not([hidden])').waitFor();
  check(await page.locator('#cs-criteria').innerText()===priorCriteria&&await page.locator('#cs-json').isDisabled()&&(await page.locator('#cs-status').innerText()).includes('No signature was applied'),'unresolvable event civil day preserves criteria without reviving stale export '+width);
  await page.locator('#cs-reset-events').click();while(await page.locator('#cs-criteria [data-remove-criterion]').count())await page.locator('#cs-criteria [data-remove-criterion]').first().click();
  await page.locator('#cs-zone').fill('Europe/London');await page.locator('#cs-start').fill('2026-10-01');await page.locator('#cs-end').fill('2026-10-31');await page.locator('#cs-limit').fill('100');await page.locator('#cs-mode').selectOption('brute');
  await page.locator('#cs-concurrence').evaluate(el=>el.closest('details').open=true);await page.locator('#cs-concurrence').check();await page.locator('#cs-tradition').selectOption('western-lilly');await page.locator('#cs-classification').selectOption('favorable');await page.locator('#cs-minimum').fill('1');await page.locator('#cs-order').selectOption('chronological');
  await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled,{},{timeout:60000});
  const referenceEnvelope=JSON.parse(await download(page,'#cs-json','uncapped reference month '+width)),exhaustive=referenceEnvelope.result;
  check(exhaustive.counts.processed===31&&!exhaustive.counts.truncated&&exhaustive.hits.length>3,'reference exports full sampled month before ranking comparison '+width);
  check(referenceEnvelope.selectionContext?.modifiedAfterDerivation===true&&referenceEnvelope.selectionContext.event.id==='plain-text'&&referenceEnvelope.selectionContext.sampleUTC===derived.selectionContext.sampleUTC,'replacing event dataset does not erase the active pattern reference from exported metadata '+width);
  const count=h=>h.ruleCounts.find(r=>r.traditionId==='western-lilly').favorable;
  const expected=[...exhaustive.hits].sort((a,b)=>count(b)-count(a)||a.date.localeCompare(b.date)).slice(0,3).map(h=>({date:h.date,count:count(h)}));
  check(expected.some(h=>!exhaustive.hits.slice(0,3).some(first=>first.date===h.date)),'ranking fixture requires a winner beyond first three chronological hits '+width);
  await page.locator('#cs-order').selectOption('concurrence');await page.locator('#cs-limit').fill('3');await page.locator('#cs-mode').selectOption('benchmark');await page.locator('#cs-run').click();await page.waitForFunction(()=>!document.querySelector('#cs-json').disabled,{},{timeout:60000});
  const ranked=JSON.parse(await download(page,'#cs-json','full-window ranked benchmark '+width)),rankedResult=ranked.result.optimized;
  check(ranked.result.equivalence.identical&&rankedResult.counts.processed===31&&rankedResult.counts.matched===exhaustive.counts.matched&&rankedResult.counts.returned===3&&rankedResult.counts.truncated,'ranked reference and optimized strategies retain complete range and match counts '+width);
  check(JSON.stringify(rankedResult.hits.map(h=>({date:h.date,count:count(h)})))===JSON.stringify(expected),'top-K bytes equal independently sorted full-reference results, including later dates '+width);
  check(rankedResult.request.order==='concurrence'&&rankedResult.request.concurrence.traditionId==='western-lilly'&&rankedResult.request.concurrence.classification==='favorable','ranking export names the exact tradition and classification '+width);
  check(rankedResult.hits.every((h,i)=>h.rank.position===i+1&&h.rank.knownCount===count(h)&&h.rank.traditionId==='western-lilly'&&h.rank.totalRules===6),'rank metadata reports counted rules, chosen tradition and denominator '+width);
  const rankingCSV=(await download(page,'#cs-csv','ranked sample CSV '+width)).toString(),rankingLines=rankingCSV.split('\r\n');
  check(rankedResult.hits.every((h,i)=>rankingLines[i+1].startsWith(`"${h.date}","${h.sampleUTC}","concurrence","${i+1}","${count(h)}"`)),'CSV preserves the same ranked order and exact chosen counts '+width);
  check((await page.locator('#cs-order-summary').innerText()).includes('All 31')&&(await page.locator('#cs-order-summary').innerText()).includes('not complete maxima or outcome predictions'),'visible ranked explanation limits the claim to counted historical rules '+width);

  await tableKeyboard(page,'#cs-results .cs-table-wrap','ranked results '+width);
  const heights=await page.locator('#cs-results .cs-table tbody tr').evaluateAll(rows=>rows.map(row=>row.getBoundingClientRect().height));
  check(heights.length===3&&heights.every(h=>h<=220),'ranked rows keep per-tradition counts readable without excessive vertical gaps '+width,heights);
  await layout(page,'ranked research '+width);if(width===390||width===1440||width===320)await shot(page,'ranking-'+width,'#cs-order-summary','start');
  const windowBeforeJump=await page.locator('#cs-start').inputValue();await page.locator('#cs-edit-experiment').click();check(await page.locator('#cs-context-heading').evaluate(el=>document.activeElement===el)&&await page.locator('#cs-start').inputValue()===windowBeforeJump&&!await page.locator('#cs-json').isDisabled(),'edit-experiment anchor focuses controls without erasing current result '+width);
  await page.locator('#cs-criterion-kind').selectOption('calendar');await page.locator('#cs-calendar').selectOption('chinese');const fields=await page.locator('#cs-calendar-field option').evaluateAll(els=>els.map(el=>el.value));check(fields.join(',')==='day,month,relatedYear,yearName'&&await page.locator('#cs-json').isDisabled(),'Chinese field choices preserve related-year distinction and editing invalidates ranking '+width);
  if(width===1440){
   await page.setViewportSize({width:1440,height:600});await page.locator('#cs-advanced').check();await page.locator('#cs-start').fill('1901-01-01');await page.locator('#cs-end').fill('2099-12-31');await page.locator('#cs-mode').selectOption('brute');await page.locator('#cs-run').click();await page.locator('#cs-cancel').focus();
   const cancelBox=await page.locator('#cs-cancel').boundingBox();check(cancelBox.y>=0&&cancelBox.y+cancelBox.height<=600,'short desktop keyboard focus brings active Cancel fully into view',cancelBox);
   await page.keyboard.press('Enter');check((await page.locator('#cs-status').innerText()).includes('cancelled')&&await page.locator('#cs-json').isDisabled(),'short desktop keyboard cancellation clears active output');
   await layout(page,'short desktop active-job recovery');await shot(page,'search-short-desktop','#cs-status','center');await page.setViewportSize({width,height:900});
  }

 }finally{await c.close();}
}

try{
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});origin='http://127.0.0.1:'+server.address().port;base=origin+prefix;
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),args:['--no-sandbox']});report.browser=browser.version();
 for(const width of[320,390,1440,1920]){if(selected('atlas'))await atlas(width);if(selected('personal'))await personal(width);if(selected('search'))await search(width);if(selected('research'))await research(width);}
 const after=await product();report.source.productFiles=after;report.source.changedDuringRun=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(p=>before[p]!==after[p]);
 if(report.source.changedDuringRun.length&&process.env.ATLAS_ALLOW_EDITS==='1')report.limits.unfrozenCandidate=true;else check(!report.source.changedDuringRun.length,'product unchanged during verification',report.source.changedDuringRun);
 check(report.source.testScriptSHA256===sha(await readFile(fileURLToPath(import.meta.url))),'test driver unchanged during verification');
 check(!report.errors.length,'zero runtime/console exceptions',report.errors);check(!report.missing.length,'zero missing local resources',report.missing);check(!report.externalRequests.length,'zero implicit external requests',report.externalRequests);
}catch(error){failure=error;report.failure={message:error.message,stack:error.stack};}
finally{await browser?.close();if(server.listening)await new Promise(ok=>server.close(ok));report.finishedAt=new Date().toISOString();report.pass=!failure;await writeFile(resolve(output,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({phase,pass:report.pass,checks:report.checks.length,receipt:resolve(output,'receipt.json')},null,2));}
if(failure)throw failure;
