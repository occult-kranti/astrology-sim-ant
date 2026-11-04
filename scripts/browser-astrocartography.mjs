// Independent real-browser verification. The map is local and no model provider
// is contacted by this harness. Numerical fixtures have a separate receipt.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,readdir,mkdir,access} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const driver='scripts/browser-astrocartography.mjs';
const output=resolve(process.env.ASTROCARTOGRAPHY_OUTPUT||'test-results/astrocartography');
const provisional=process.env.ASTROCARTOGRAPHY_ALLOW_MUTATIONS==='1';
const prefix='/astrology-sim-ant/';
const sha=x=>createHash('sha256').update(x).digest('hex');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
await mkdir(output,{recursive:true});
let exists=false;try{await access(resolve(output,'receipt.json'));exists=true;}catch{}
assert.ok(!exists,'Use a fresh ASTROCARTOGRAPHY_OUTPUT directory.');
async function files(dir){
  const out=[];
  for(const entry of await readdir(resolve(root,dir),{withFileTypes:true})){
    if(entry.name.startsWith('.'))continue;
    const p=dir+'/'+entry.name;out.push(...(entry.isDirectory()?await files(p):[p]));
  }
  return out;
}
async function manifest(){
  const names=[driver,'index.html',...await files('assets'),...await files('pages')].sort();
  return Object.fromEntries(await Promise.all(names.map(async p=>[p,sha(await readFile(resolve(root,p)))])));
}
const before=await manifest();
await writeFile(resolve(output,'driver.mjs'),await readFile(resolve(root,driver)));
const receipt={schemaVersion:1,startedAt:new Date().toISOString(),provisional,
  source:{beforeSHA256:sha(JSON.stringify(before))},environment:{node:process.version},
  checks:[],failures:[],errors:[],externalRequests:[],downloads:[],screenshots:[],
  limits:{forecastValidation:false,modelInference:false,physicalDevice:false,screenReader:false,allBrowsers:false}};
let browser,server,origin,base,journey='initialization',downloadCount=0;
function check(ok,label,detail){
  receipt.checks.push({journey,label,pass:!!ok,...detail===undefined?{}:{detail}});
  assert.ok(ok,label+(detail===undefined?'':': '+JSON.stringify(detail)));
}
async function ready(page){await page.waitForFunction(()=>document.querySelector('#ag-app')?.dataset.state==='ready');}
async function rejectedCast(page){await page.locator('#ag-cast').click();await page.waitForFunction(()=>document.querySelector('#ag-profile-error').textContent.trim().length>0);}
async function cast(page){await page.locator('#ag-cast').click();await ready(page);}
async function shot(page,name){
  const bytes=await page.screenshot({animations:'disabled'}),filename=journey+'-'+name+'.png';
  await writeFile(resolve(output,filename),bytes);
  receipt.screenshots.push({filename,sha256:sha(bytes),bytes:bytes.length});
}
async function reflow(page,label){
  const size=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  check(size.scrollWidth<=size.width+2,label+' has no document overflow',size);
}
async function download(page,selector,label){
  const pending=page.waitForEvent('download');await page.locator(selector).click();
  const item=await pending;check(await item.failure()===null,label+' downloads');
  const bytes=await readFile(await item.path());
  const filename=String(++downloadCount).padStart(2,'0')+'-'+item.suggestedFilename()+'.gz';
  await writeFile(resolve(output,filename),gzipSync(bytes));
  receipt.downloads.push({label,filename,bytes:bytes.length,sha256:sha(bytes)});return bytes;
}
async function exported(page,label){return JSON.parse((await download(page,'#ag-export-json',label)).toString());}
async function profile(page,values){
  for(const [key,value]of Object.entries(values)){
    const input=page.locator('#ag-'+key);
    if(['system','disambiguation'].includes(key))await input.selectOption(value);
    else await input.fill(String(value));
  }
}
async function place(page,values){
  for(const [key,value]of Object.entries(values))await page.locator('#ag-place-'+key).fill(String(value));
  await page.locator('#ag-inspect-place').click();
  await page.waitForFunction(()=>!document.querySelector('#ag-bookmark').disabled);
}
async function geographicClick(page,lat,lon){
  await page.locator('#ag-map').scrollIntoViewIfNeeded();
  const screen=await page.evaluate(({lat,lon})=>{
    const svg=document.querySelector('#ag-map');
    const p=new DOMPoint((lon+180)*1200/360,(90-lat)*600/180).matrixTransform(svg.getScreenCTM());
    const hit=document.elementFromPoint(p.x,p.y);
    return{x:p.x,y:p.y,hit:hit?.tagName,blockedByLayer:!!hit?.closest('#ag-crossing-layer,#ag-place-layer')};
  },{lat,lon});
  check(!screen.blockedByLayer,'Known map coordinate is a background selection, not a crossing/city hit',screen);
  await page.mouse.click(screen.x,screen.y);
  const selected={lat:Number(await page.locator('#ag-place-lat').inputValue()),lon:Number(await page.locator('#ag-place-lon').inputValue())};
  check(Math.abs(selected.lat-lat)<0.35&&Math.abs(selected.lon-lon)<0.35,'Screen click preserves geographic coordinates within one display pixel',{expected:{lat,lon},selected});
}
async function run(name,width,callback){
  journey=name;
  const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block',acceptDownloads:true,reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('pageerror',e=>receipt.errors.push({journey:name,message:e.message}));
  page.on('console',m=>{if(m.type()==='error')receipt.errors.push({journey:name,message:m.text(),url:m.location().url});});
  context.on('request',r=>{const u=r.url();if(!u.startsWith(origin)&&!u.startsWith('data:')&&!u.startsWith('blob:'))receipt.externalRequests.push({journey:name,url:u});});
  try{await page.goto(base+'pages/astrocartography.html',{waitUntil:'networkidle'});await ready(page);await callback(page,context);}
  catch(error){receipt.failures.push({journey:name,message:error.message,stack:error.stack});await shot(page,'failure').catch(()=>{});console.error(name+': '+error.message);}
  finally{await context.close();}
}

// Journeys below are bound to the implemented DOM before acceptance. Keeping
// this scaffold separate allows contract review without claiming executed tests.
async function initial(page){
  check(await page.locator('#ag-map').count()===1,'The angular map is present');
  check(await page.locator('#ag-date').inputValue()==='2024-03-20','Initial event is the declared public equinox example');
  check(/public/i.test(await page.locator('#ag-mode').innerText()),'Initial profile is explicitly labelled a public example');
  check(await page.locator('#ag-map').getAttribute('role')==='group','Map exposes a group with a keyboard alternative, not an opaque image');
  check(await page.locator('#ag-body-filter input').count()===10&&await page.locator('#ag-angle-filter input').count()===4,'Ten bodies and four angular conditions have native controls');
  check(await page.locator('#ag-land-layer path').count()>0,'Actual local geographic outlines render');
  check(await page.locator('#ag-line-layer .ag-angular-line').count()>=40,'All default angular lines render with separate geometric segments');
  check(await page.locator('#ag-chat').isHidden(),'No assistant or provider connection is opened automatically');
  await reflow(page,'Initial map');await shot(page,'initial');
}

async function profileChecks(page){
  await profile(page,{time:''});
  check(await page.locator('#ag-export-json').isDisabled(),'Removing the known clock immediately invalidates export');
  await rejectedCast(page);
  check(/clock|time|required|known/i.test(await page.locator('#ag-profile-error').innerText()),'Missing clock rejects calculation without inventing noon');
  await profile(page,{name:'Synthetic QA event',date:'2024-03-10',time:'02:30',zone:'America/New_York',lat:40.7,lon:-74,disambiguation:'reject'});
  await rejectedCast(page);
  check(/exist|gap|skipped/i.test(await page.locator('#ag-profile-error').innerText()),'Nonexistent spring DST clock rejects');
  await profile(page,{date:'2024-11-03',time:'01:30'});await rejectedCast(page);
  check(/twice|earlier|later|ambiguous/i.test(await page.locator('#ag-profile-error').innerText()),'Repeated autumn DST clock requires an explicit occurrence');
  await profile(page,{disambiguation:'earlier'});await cast(page);
  check((await page.locator('#ag-context-summary').innerText()).includes('05:30'),'Earlier repeated clock maps to05:30UTC');
  await profile(page,{disambiguation:'later'});await cast(page);
  check((await page.locator('#ag-context-summary').innerText()).includes('06:30'),'Later repeated clock maps to06:30UTC');
  await profile(page,{date:'2011-12-30',time:'12:00',zone:'Pacific/Apia'});await rejectedCast(page);
  check(/exist|gap|skipped/i.test(await page.locator('#ag-profile-error').innerText()),'Skipped Apia civil date is rejected');
  await profile(page,{date:'2200-01-01',time:'12:00',zone:'UTC'});await rejectedCast(page);
  check(/1900|2100|range/i.test(await page.locator('#ag-profile-error').innerText()),'Out-of-range chart date is rejected');
  await page.locator('#ag-demo').click();await ready(page);
  for(const lat of [90,-90]){
    await profile(page,{lat});await cast(page);
    check(await page.locator('#ag-line-layer .ag-angular-line').count()>=40,'Birthplace at latitude'+lat+' does not erase the global geometry');
  }
  await profile(page,{lat:91});await rejectedCast(page);
  check(/latitude|90/i.test(await page.locator('#ag-profile-error').innerText()),'Invalid birth latitude rejects');
  await page.locator('#ag-demo').click();await ready(page);
  check(!await page.locator('#ag-export-json').isDisabled(),'Restoring the public example recovers from invalid input');
  await shot(page,'recovered');
}


async function mapChecks(page){
  await geographicClick(page,12.34,22.34);
  check(await page.locator('#ag-place-zone').inputValue()==='UTC'&&/assumption/.test(await page.locator('#ag-place-zone-note').innerText()),'Map coordinate selection explicitly uses an assumed UTC display zone');
  const map=page.locator('#ag-map');await map.focus();await page.keyboard.press('+');
  check(await map.getAttribute('viewBox')!=='0 0 1200 600','Keyboard plus zooms the map');
  check(await page.locator('.ag-map-scale').isHidden(),'Static global labels hide when zoomed');
  await geographicClick(page,15.67,31.23);
  await map.focus();const before=await map.getAttribute('viewBox');await page.keyboard.press('ArrowRight');
  check(before!==await map.getAttribute('viewBox'),'Keyboard arrows pan the zoomed map');
  const current=await page.locator('#ag-place-lon').inputValue();const box=await map.boundingBox();
  await page.mouse.move(box.x+box.width*.55,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.65,box.y+box.height*.5,{steps:8});await page.mouse.up();
  check(current===await page.locator('#ag-place-lon').inputValue(),'Dragging pans without changing selected geographic coordinates');
  await map.focus();await page.keyboard.press('Home');
  check(await map.getAttribute('viewBox')==='0 0 1200 600','Home restores the whole world');
  await geographicClick(page,12.34,179);await geographicClick(page,-12.34,-179);
  await page.locator('#ag-line-select').selectOption('Moon-ASC');await page.locator('#ag-inspect-line').click();
  check(await page.locator('#ag-line-details').evaluate(el=>document.activeElement===el),'Line inspection moves keyboard focus to its details');
  let highlighted=await page.locator('.ag-angular-line[data-selected=true]').evaluateAll(xs=>[...new Set(xs.map(x=>x.dataset.lineId))]);
  check(highlighted.length===1&&highlighted[0]==='Moon-ASC','Selected line is distinctly highlighted');
  await page.locator('#ag-crossings-body [data-ag-crossing]').first().click();
  highlighted=await page.locator('.ag-angular-line[data-selected=true]').evaluateAll(xs=>[...new Set(xs.map(x=>x.dataset.lineId))]);
  check(highlighted.length===2,'Selecting an actual crossing highlights both member lines',highlighted);
  check(/Selected pair:/.test(await page.locator('#ag-inspector-body').innerText()),'Selected pair is identified in the place inspector');
  check(await page.locator('.ag-place-score strong').evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return r.getClientRects().length===1;}),'The decimal score remains on one visual line');
  const cross=await exported(page,'Selected crossing');
  const c=cross.result.crossings.find(x=>x.id===cross.display.selectedCrossing);
  check(c&&c.lineIds.every(x=>highlighted.includes(x)),'Export records the same crossing that is highlighted');
  check(Math.abs(cross.inspection.place.lat-c.lat)<1e-6&&Math.abs(cross.inspection.place.lon-c.lon)<1e-6,'Crossing inspection uses its computed geographic point');
  await page.locator('#ag-line-select').selectOption('Sun-MC');await page.locator('#ag-inspect-line').click();
  check(await page.locator('.ag-angular-line[data-selected=true]').count()===1,'Individual line selection clears the crossing pair');
  await page.locator('#ag-show-crossings').check();
  check(await page.locator('.ag-crossing-point').count()===cross.result.crossings.length,'Crossing visibility toggle renders the computed crossing set');
  await page.locator('#ag-crossing-filter').selectOption('Sun-MC');
  check((await page.locator('#ag-crossings-body').innerText()).split('Inspect coordinates').slice(0,-1).every(t=>t.includes('Sun-MC')),'Crossing table filters by the named member line');
  await shot(page,'selected');
}
async function analysisChecks(page){
  const initial=await exported(page,'Initial study');const geometry=JSON.stringify(initial.result.lines);
  check(initial.inspection.reading&&Object.keys(initial.inspection.reading.frameworks).length===9,'Place inspection contains nine separately labelled calendar/source frameworks');
  check(initial.inspection.context.instantISO===initial.result.context.instantISO,'Place study retains the map UTC instant');
  await page.locator('#ag-city-search').fill('Mumbai');
  check(await page.locator('[data-ag-city]').count()===1,'Offline city search filters to Mumbai');
  await page.locator('[data-ag-city]').click();
  check(await page.locator('#ag-place-zone').inputValue()==='Asia/Kolkata','Catalogue selection supplies its declared IANA zone');
  await page.locator('#ag-city-search').fill('no-such-offline-city');
  check(/No catalogue match/.test(await page.locator('#ag-city-count').innerText()),'Unknown city produces explicit coordinate-form fallback');
  await page.locator('#ag-rank-next').click();check(/11–20/.test(await page.locator('#ag-rank-page').innerText()),'Rankings paginate beyond the first ten places');
  const purposes=await page.locator('#ag-purpose option').evaluateAll(xs=>xs.map(x=>x.value));await page.locator('#ag-purpose').selectOption(purposes[1]);await ready(page);
  const changed=await exported(page,'Changed editorial purpose');
  check(JSON.stringify(changed.result.lines)===geometry,'Editorial purpose does not change physical line geometry');
  check(JSON.stringify(changed.comparison.map(x=>[x.city.id,x.score]))!==JSON.stringify(initial.comparison.map(x=>[x.city.id,x.score])),'Declared purpose changes the weighted comparison');
  check(/not a probability|not a safety/.test(await page.locator('#ag-purpose-note').innerText()),'Scoring qualification stays next to purpose control');
  await page.locator('#ag-radius').fill('12');check(await page.locator('#ag-export-json').isDisabled(),'Typing a radius immediately invalidates held export');
  await page.locator('#ag-radius').fill('120');await page.locator('#ag-radius').fill('1200');await ready(page);
  const radius=await exported(page,'Settled radius');
  check(radius.request.inputs.radiusKm===1200,'Rapid radius edits settle on the final numeric value');
  check(JSON.stringify(radius.result.lines)===geometry,'Scoring radius does not change line geometry');
  await page.locator('#ag-radius').fill('0');await page.locator('#ag-radius').blur();
  await page.waitForFunction(()=>document.querySelector('#ag-profile-error').textContent.trim().length>0);
  check(await page.locator('#ag-export-json').isDisabled(),'Out-of-range radius cannot export stale results');
  await page.locator('#ag-radius').fill('500');await page.locator('#ag-radius').blur();await cast(page);
  await page.locator('#ag-body-filter input[value=Sun]').uncheck();await ready(page);
  check(await page.locator('#ag-line-select option').count()===36,'Removing a body removes its four angular lines');
  for(const v of ['Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune']){await page.locator(`#ag-body-filter input[value=${v}]`).uncheck();await ready(page);}
  await page.locator('#ag-body-filter input[value=Pluto]').click();
  check(await page.locator('#ag-body-filter input[value=Pluto]').isChecked(),'Last remaining body cannot be deselected');
  for(const v of ['ASC','DSC','MC']){await page.locator(`#ag-angle-filter input[value=${v}]`).uncheck();await ready(page);}
  await page.locator('#ag-angle-filter input[value=IC]').click();
  check(await page.locator('#ag-angle-filter input[value=IC]').isChecked(),'Last remaining angle cannot be deselected');
  check(await page.locator('#ag-line-select option').count()===1,'Single body/single angle selection produces exactly one line');
  check(/No isolated crossings/.test(await page.locator('#ag-crossings-body').innerText()),'Single-line selection has no fabricated crossings');
  await place(page,{name:'North pole',lat:90,lon:0,zone:'UTC'});
  const pole=await exported(page,'Pole study');
  check(pole.inspection.ranking.score===null,'Pole thematic score is unavailable, not numerical zero');
  check(pole.inspection.relocation.status==='unavailable','Pole located chart is explicitly unavailable');
  check(/Score unavailable/.test(await page.locator('#ag-inspector-body').innerText()),'Pole qualification appears visibly in inspector');
  check(await page.locator('.ag-pole-note').count()===1&&!/Nearest-line interpretation: conditional themes/.test(await page.locator('#ag-inspector-body').innerText()),'Exact pole suppresses arbitrary nearest-line themes while retaining geometric distances');
  await page.locator('#ag-place-lat').fill('91');await page.locator('#ag-inspect-place').click();
  check(/latitude|90/.test(await page.locator('#ag-place-error').innerText())&&await page.locator('#ag-export-json').isDisabled(),'Invalid destination disables export and explains latitude error');
  await place(page,{name:'Recovered',lat:0,lon:0,zone:'UTC'});
  await profile(page,{system:'whole'});check(await page.locator('#ag-export-json').isDisabled(),'House-system edit requires explicit recast');await cast(page);
  check(!await page.locator('#ag-export-json').isDisabled(),'Corrected profile and destination recover export');
}
async function privacyChecks(page){
  const sentinel='QA_ONLY_<img src=x onerror=alert(1)>';
  const originalURL=page.url();await profile(page,{name:sentinel});await cast(page);
  await place(page,{name:'=2+2',lat:31,lon:42,zone:'America/New_York'});await page.locator('#ag-bookmark').click();await page.locator('#ag-bookmark').click();
  check(await page.locator('[data-ag-bookmark-id]').count()===1,'Duplicate coordinates and zone are not kept twice');
  await page.locator('[data-ag-bookmark-id]').click();
  check(await page.locator('#ag-place-zone').inputValue()==='America/New_York'&&(await page.locator('#ag-place-zone-note').innerText()).includes('America/New_York')&&!/UTC is a study assumption/.test(await page.locator('#ag-place-zone-note').innerText()),'Revisited manually kept non-UTC place retains the correct declared-zone label');
  for(let i=1;i<12;i++){await place(page,{name:'QA place '+i,lat:i,lon:i*2,zone:'UTC'});await page.locator('#ag-bookmark').click();}
  await place(page,{name:'Thirteenth',lat:20,lon:40,zone:'UTC'});await page.locator('#ag-bookmark').click();
  check(await page.locator('[data-ag-bookmark-id]').count()===12&&/twelve/.test(await page.locator('#ag-status').innerText()),'Session bookmark cap is enforced at twelve places');
  await page.locator('#ag-compare-bookmarks').click();await ready(page);
  check(/1–10 of 12/.test(await page.locator('#ag-rank-page').innerText()),'Kept-place comparison is calculated and paginated');
  const data=await exported(page,'Explicit local private study download');
  check(data.request.inputs.profile.name===sentinel&&data.bookmarks.length===12,'Only explicit JSON download includes the custom profile and kept coordinates');
  check(await page.locator('#ag-context-summary img').count()===0,'Profile HTML-looking text is rendered inertly');
  const csv=(await download(page,'#ag-export-csv','Kept-place CSV')).toString();
  check(csv.includes("'=2+2"),'CSV formula-like label is neutralized');
  check(csv.includes('Editorial score (not probability)'),'CSV identifies the editorial metric');
  check(page.url()===originalURL,'Private study data never enters the page URL');
  const storage=await page.evaluate(()=>({local:JSON.stringify({...localStorage}),session:JSON.stringify({...sessionStorage})}));
  check(!JSON.stringify(storage).includes('QA_ONLY_')&&!JSON.stringify(storage).includes('QA place'),'Profile and kept places are not automatically stored');
  await page.locator('[data-ag-remove-bookmark]').first().click();check(await page.locator('[data-ag-bookmark-id]').count()===11,'Removing a kept place updates the session list');
  await page.evaluate(()=>{window.__prints=0;window.print=()=>window.__prints++;});await page.locator('#ag-print').click();check(await page.evaluate(()=>window.__prints)===1,'Print is invoked only by explicit user action');
  await page.reload({waitUntil:'networkidle'});await ready(page);
  check(await page.locator('[data-ag-bookmark-id]').count()===0&&/Public equinox/.test(await page.locator('#ag-name').inputValue()),'Reload clears session places and restores the public example');
}
async function assistantChecks(page){
  await page.locator('#ag-open-chat').click();await page.locator('#wc-ask').waitFor();
  check(!await page.locator('#wc-include-chart').isChecked(),'Optional provider context is off by default');
  await page.locator('#wc-question').fill('What is astrocartography and a geometric horizon?');await page.locator('#wc-ask').click();
  check(/LOCAL SOURCE EXCERPTS/.test(await page.locator('#wc-answer').innerText()),'Source search executes locally with an extractive label');
  await page.locator('#wc-prepare').click();let body=JSON.parse(await page.locator('#wc-preview').inputValue());
  check(!('context'in body),'Prepared provider body omits study context without opt-in');
  await page.locator('#wc-settings').evaluate(x=>x.open=true);await page.locator('#wc-include-chart').check();await page.locator('#wc-prepare').click();
  body=JSON.parse(await page.locator('#wc-preview').inputValue());
  check(body.context?.astrocartography?.inputs?.profile?.localTime==='03:06','Explicit context includes the canonical known clock');
  check(body.context.astrocartography.place?.timeZone==='UTC','Explicit context includes the selected place and declared zone');
  check(!JSON.stringify(body).includes('segments')&&!JSON.stringify(body).includes('bookmarks'),'Prepared request contains canonical inputs, not full geometry or kept-place library');
  await page.locator('#ag-place-name').fill('Changed after preview');
  check(await page.locator('#wc-send').isDisabled(),'Changing a place invalidates the prepared provider request');
  await page.locator('#ag-inspect-place').click();await ready(page);
  await page.locator('#wc-action-json').evaluate(x=>x.closest('details').open=true);
  await page.locator('#wc-action-json').fill('{"type":"set_houses","system":"whole"}');await page.locator('#wc-preview-action').click();
  check(await page.locator('[data-wc-apply]').count()===0&&/explicit atlas|Chart studio/.test(await page.locator('#wc-actions').innerText()),'Chart-changing actions are rejected on the map page');
  await page.evaluate(()=>{window.__opened=[];window.open=(...args)=>{window.__opened.push(args);return null;};});
  await page.locator('#wc-action-json').fill('{"type":"open_tool","toolId":"mcp"}');await page.locator('#wc-preview-action').click();
  check(await page.evaluate(()=>window.__opened.length)===0,'Named-tool proposal does not navigate before Apply');
  await page.locator('[data-wc-apply]').click();const opened=await page.evaluate(()=>window.__opened);
  check(opened.length===1&&new URL(opened[0][0]).pathname.endsWith('/pages/mcp.html')&&!new URL(opened[0][0]).search,'Reviewed tool navigation uses the correct URL without private study data',opened);
  await shot(page,'source-and-actions');
}
async function libraryChecks(page){
  const storageKey='astrologers-workbench.desktop-library.v1';
  await page.evaluate(async(base)=>{const{saveChart}=await import(base+'assets/js/app/desktop-library.js');saveChart({name:'QA saved <b>inert</b>',localDate:'2000-01-01',localTime:'12:34',timeZone:'UTC',lat:0,lon:0,disambiguation:'reject'});},base);
  await page.reload({waitUntil:'networkidle'});await ready(page);
  check((await page.locator('#ag-name').inputValue()).startsWith('Public equinox'),'A saved local chart is never auto-loaded');
  await page.locator('#ag-load-saved').click();await page.locator('.ag-library-row').waitFor();
  check(await page.locator('#ag-library-dialog').evaluate(x=>x.open),'Explicit saved-chart action opens a native dialog');
  check(await page.locator('.ag-library-row b').count()===0,'Saved chart label markup remains inert');
  await page.keyboard.press('Escape');check(!await page.locator('#ag-library-dialog').evaluate(x=>x.open),'Escape dismisses saved-chart dialog');
  check(await page.locator('#ag-load-saved').evaluate(x=>document.activeElement===x),'Closing the saved-chart dialog restores its invoking control');
  await page.locator('#ag-load-saved').click();await page.locator('.ag-library-row').click();
  check(await page.locator('#ag-date').inputValue()==='2000-01-01'&&await page.locator('#ag-export-json').isDisabled(),'Explicit record selection fills form but requires recast');
  check(await page.locator('#ag-cast').evaluate(x=>document.activeElement===x),'Saved selection moves focus to Cast');await cast(page);
  check(/SAVED CHART/.test(await page.locator('#ag-mode').innerText()),'Calculated saved profile retains explicit-selection label');
  await page.evaluate(k=>localStorage.setItem(k,'{"charts": ["bad"]}'),storageKey);
  await page.locator('#ag-load-saved').click();
  await page.waitForFunction(()=>!document.querySelector('#ag-library-status').textContent.includes('Reading the local'));
  check(await page.locator('.ag-library-row').count()===0&&/invalid|unsupported|version|format/i.test(await page.locator('#ag-library-status').innerText()),'Malformed local library is rejected without importing partial data');
  await page.keyboard.press('Escape');
}

async function responsive(page){
  if((await page.viewportSize()).width<=390)check(!await page.locator('#ag-comparison-disclosure').evaluate(x=>x.open),'Mobile comparison controls begin collapsed with a labelled summary');
  await reflow(page,'Responsive initial');await shot(page,'initial');
  await page.locator('#ag-map').scrollIntoViewIfNeeded();await reflow(page,'Responsive map');await shot(page,'map');
  await page.locator('#ag-inspector-title').scrollIntoViewIfNeeded();await reflow(page,'Responsive inspector');
  check(await page.locator('.ag-place-score strong').evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return r.getClientRects().length===1;}),'Responsive inspector score is not split across text lines');await shot(page,'inspector');
  await page.locator('.ag-place-score').scrollIntoViewIfNeeded();await shot(page,'place-result');
  await page.locator('#ag-open-chat').click();await page.locator('#wc-ask').waitFor();
  await page.locator('#ag-chat').scrollIntoViewIfNeeded();await reflow(page,'Responsive assistant');await shot(page,'assistant');
}

try{
  server=createServer(async(req,res)=>{
    try{
      const u=new URL(req.url,'http://local');if(!u.pathname.startsWith(prefix))return res.writeHead(404).end();
      const rel=decodeURIComponent(u.pathname.slice(prefix.length)||'index.html'),p=resolve(root,rel);
      if(!p.startsWith(root+sep)||rel.split('/').some(x=>x.startsWith('.')))return res.writeHead(403).end();
      res.setHeader('Content-Type',mime[extname(p)]||'application/octet-stream');res.end(await readFile(p));
    }catch{res.writeHead(404).end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;base=origin+prefix;
  const pkg=await import(process.env.PLAYWRIGHT_PKG?pathToFileURL(resolve(process.env.PLAYWRIGHT_PKG)).href:'playwright');
  browser=await(pkg.chromium||pkg.default.chromium).launch({headless:true,...process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{},args:['--no-sandbox']});
  receipt.environment.browser=browser.version();
  await run('initial-1440',1440,initial);
  await run('profile-1440',1440,profileChecks);
  await run('map-1440',1440,mapChecks);
  await run('analysis-1440',1440,analysisChecks);
  await run('privacy-1440',1440,privacyChecks);
  await run('assistant-1440',1440,assistantChecks);
  await run('library-1440',1440,libraryChecks);
  await run('mobile-320',320,responsive);
  await run('mobile-390',390,responsive);
  await run('desktop-1920',1920,responsive);
}catch(error){receipt.failures.push({journey:'harness',message:error.message,stack:error.stack});}
finally{
  await browser?.close();if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}
  const after=await manifest();receipt.source.afterSHA256=sha(JSON.stringify(after));
  receipt.source.changedFiles=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(p=>before[p]!==after[p]);
  if(receipt.source.changedFiles.length&&!provisional)receipt.failures.push({label:'Source changed during acceptance',files:receipt.source.changedFiles});
  for(const[label,rows]of[['Unexpected runtime errors',receipt.errors],['Unexpected external requests',receipt.externalRequests]])if(rows.length)receipt.failures.push({label,rows});
  receipt.checkCount=receipt.checks.length;receipt.pass=!receipt.failures.length;receipt.acceptance=receipt.pass&&!provisional;
  receipt.completedAt=new Date().toISOString();
  await writeFile(resolve(output,'source-before.json'),JSON.stringify(before,null,2)+'\n');
  await writeFile(resolve(output,'source-after.json'),JSON.stringify(after,null,2)+'\n');
  await writeFile(resolve(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({pass:receipt.pass,acceptance:receipt.acceptance,checks:receipt.checkCount,failures:receipt.failures,receipt:resolve(output,'receipt.json')},null,2));
  if(!receipt.pass)process.exitCode=1;
}
