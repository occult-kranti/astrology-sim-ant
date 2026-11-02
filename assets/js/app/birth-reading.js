import { resolveZonedTime } from '../core/time.js';
import { svgToString, downloadBlob } from './state.js';
import { mountBirthChartConsole } from './birth-chart-console.js';
import { mountOfflineLibrary } from './offline-library.js';

const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=String(text);if(cls)n.className=cls;return n;};
const human=s=>String(s).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ');
const val=v=>v==null?'Not available':typeof v==='number'?(Number.isInteger(v)?String(v):v.toFixed(5)):typeof v==='boolean'?(v?'Yes':'No'):String(v);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL=s=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};

function evidence(data,depth=0){
  if(data==null||typeof data!=='object')return el('span',val(data));
  if(Array.isArray(data)){
    const list=el('ol',null,'br-evidence-list');
    for(const item of data){const li=el('li');li.append(evidence(item,depth+1));list.append(li);}return list;
  }
  const dl=el('dl',null,'br-facts');
  for(const [key,value]of Object.entries(data)){
    if(value==null)continue;
    const row=el('div');row.append(el('dt',human(key)));
    const dd=el('dd');
    if(typeof value==='object'&&depth>0){const d=el('details');d.append(el('summary','Inspect '+human(key)),evidence(value,depth+1));dd.append(d);}
    else dd.append(evidence(value,depth+1));
    row.append(dd);dl.append(row);
  }return dl;
}
function disclosure(title,data,open=false){const d=el('details',null,'br-evidence');d.open=open;d.append(el('summary',title),evidence(data));return d;}
function table(headers,rows){
  const wrap=el('div',null,'br-table-wrap');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',headers.join(', ')+' table; scroll horizontally');
  const t=el('table'),head=el('thead'),tr=el('tr');for(const h of headers){const th=el('th',h);th.scope='col';tr.append(th);}head.append(tr);t.append(head);const body=el('tbody');
  for(const row of rows){const r=el('tr');for(const cell of row){const td=el('td');td.append(cell instanceof Node?cell:el('span',val(cell)));r.append(td);}body.append(r);}t.append(body);wrap.append(t);return wrap;
}
function block(data){const a=el('article',null,'br-reading');if(typeof data==='string'){a.append(el('p',data));return a;}a.append(el('h3',data.title||data.label||data.topic||'Reading'));
  for(const key of ['text','observation','rule','interpretation','reflection','prompt','qualification','reason'])if(data[key]){const p=el('p');if(!['text','interpretation'].includes(key))p.append(el('strong',human(key)+': '));p.append(document.createTextNode(typeof data[key]==='string'?data[key]:JSON.stringify(data[key])));a.append(p);}
  if(data.sourceIds?.length){const p=el('p',null,'br-note');p.append('Sources: ');data.sourceIds.forEach((id,i)=>{if(i)p.append(' · ');const l=el('a',id);l.href='#br-source-'+id;l.dataset.sourceRef=id;p.append(l);});a.append(p);}return a;
}

export function initBirthReading(){
  const form=$('br-form');if(!form)return;
  let current=null,input=null,worker=null,revision=0,chartConsole=null;
  mountOfflineLibrary($('br-offline'));
  const actions=['br-export-json','br-export-html','br-print'];
  const status=text=>{$('br-status').textContent=text;};
  const disable=()=>actions.forEach(id=>$(id).disabled=true);
  const invalidate=()=>{revision++;worker?.terminate();worker=null;chartConsole?.destroy();chartConsole=null;current=null;input=null;disable();$('br-results').hidden=true;for(const id of ['br-summary','br-chart','br-positions','br-comparison','br-houses','br-periods','br-events','br-sensitivity','br-method','br-sources'])$(id)?.replaceChildren();form.removeAttribute('aria-busy');status('Inputs changed. Calculate the reading to update every section.');};
  const localDate=()=>new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  $('br-asof').value=localDate();
  form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
  const read=()=>({birth:{date:$('br-date').value,timeKnown:true,time:$('br-time').value,timeZone:$('br-zone').value.trim(),lat:Number($('br-lat').value),lon:Number($('br-lon').value)},asOf:resolveZonedTime($('br-asof').value,'12:00',$('br-zone').value.trim()).instant.toISOString(),futureYears:3});
  function draw(){
    if(!current?.charts)return;
    const frame=$('br-chart-select').value;
    if(chartConsole){chartConsole.setFrame(frame);return;}
    chartConsole=mountBirthChartConsole($('br-chart'),current,{frame,
      onFrameChange:value=>{$('br-chart-select').value=value;},
      onBodySelect:name=>{const detail=[...$('br-positions').querySelectorAll('[data-body]')].find(d=>d.dataset.body===name);if(detail){for(let ancestor=detail;ancestor;ancestor=ancestor.parentElement)if(ancestor.tagName==='DETAILS')ancestor.open=true;detail.scrollIntoView({block:'start',behavior:'instant'});detail.querySelector('summary').focus();}}
    });
  }
  function render(report,request){
    current=report;input=request;
    const replace=(id,...nodes)=>$(id)?.replaceChildren(...nodes);
    replace('br-summary',...report.summary.map(block),disclosure('Recorded input and calculation context',{birth:request.birth,asOf:request.asOf,context:report.context}));
    replace('br-positions',table(['Body','Tropical position','Regiomontanus / whole-sign house','Sidereal position / house'],report.western.planets.map(p=>{const g=report.vedic.grahas.find(g=>g.name===p.name);return[p.name,p.label,`${p.house} / ${p.wholeSignHouse}`,g?`${g.label} · house ${g.house}`:'No counterpart'];})),...report.western.planets.map(p=>{const d=el('details',null,'br-evidence');d.dataset.body=p.name;d.append(el('summary',`${p.name} · read both traditions`),block({...p,title:'Tropical · '+p.name}),block({...report.vedic.grahas.find(g=>g.name===p.name),title:'Sidereal · '+p.name}),disclosure('Dignity and motion evidence',p.dignity));return d;}),...report.western.nodes.map(n=>{const d=disclosure(n.name+' · mean lunar node',{tropical:n,sidereal:report.vedic.grahas.find(g=>g.name===(n.name==='NorthNode'?'Rahu':'Ketu'))});d.dataset.body=n.name;return d;}),disclosure('Natal angular relationships',report.western.aspects));
    replace('br-comparison',...report.comparison.map(block),...(report.methodComparisons||[]).map(m=>disclosure(m.title||m.family||'Method comparison',m)),...(report.calendars.rows||[]).map(r=>{const d=el('details',null,'br-evidence');d.dataset.calendarId=r.id;d.append(el('summary',`${r.label||r.name||r.id} · ${r.status||'calculated'}`),evidence(r));return d;}));
    replace('br-houses',...(report.western.houses||[]).map(h=>{const a=block(h);a.append(disclosure('House, ruler and comparison evidence',h));return a;}));
    const annual=report.timeline.annual,slider=el('input'),sliderLabel=el('label','Explore completed age · annual profections'),selected=el('div',null,'br-current');slider.type='range';slider.min=0;slider.max=annual.length-1;slider.step=1;slider.id='br-age-slider';slider.value=Math.max(0,annual.findIndex(r=>r.phase==='current'));sliderLabel.htmlFor=slider.id;
    const showAge=()=>{const a=annual[Number(slider.value)];selected.replaceChildren(el('p',`${a.phase.toUpperCase()} · age ${a.age} · ${a.startUTC.slice(0,10)} → ${a.endUTC.slice(0,10)}`,'br-kicker'),block(a));slider.setAttribute('aria-valuetext',`Age ${a.age}, ${a.title}, ${a.phase}`);};slider.addEventListener('input',showAge);showAge();
    replace('br-periods',el('p','These are dates assigned by named symbolic methods. A past period is not evidence that an event happened, and a future period does not establish an outcome.','br-note'),sliderLabel,slider,selected,el('h3','Vimśottarī major periods'),table(['Period lord','Starts UTC','Ends UTC','At the study date'],report.vedic.dasha.periods.map(p=>[p.lord,p.startUTC.slice(0,10),p.endUTC.slice(0,10),p.phase])),el('p',report.vedic.dasha.convention,'br-note'),disclosure('Current major period and subperiod',{major:report.vedic.dasha.current,subperiod:report.vedic.dasha.currentAntar},true),disclosure('All modelled subperiods and calculation evidence',report.vedic.dasha),disclosure('Every annual profection',annual));
    replace('br-events',el('p',`Snapshot: ${request.asOf}. Future search ends ${report.timeline.futureEnd||'three years later'}. These are calculated cycle dates and model interpretations, not probabilities of life events.`,'br-note'),el('h3','Upcoming return dates'),table(['Cycle','Solved UTC instant','Interpretation'],report.timeline.returns.map(r=>[r.title,r.instantUTC,r.interpretation])),el('h3','Jupiter and Saturn: selected exact contacts'),table(['UTC date','Contact','Reading'],report.timeline.transits.map(t=>[t.exactISO,`${t.transitingBody} ${t.aspect} natal ${t.natalPoint}`,t.interpretation])),disclosure('Current transits to natal positions',report.timeline.currentTransits),disclosure('Future returns: solver evidence',report.timeline.returns),disclosure('Future transit contacts and search scope',{events:report.timeline.transits,methods:report.timeline.methods}));
    replace('br-sensitivity',evidence(report.sensitivity||report.timeSensitivity||'See method qualifications.'));
    replace('br-method',...report.steps.map(block),disclosure('Lunar calendar, divisional charts and strength models',{panchanga:report.vedic.panchanga,vargas:report.vedic.vargas,shadbala:report.vedic.shadbala,ashtakavarga:report.vedic.ashtakavarga,yogas:report.vedic.yogas}),disclosure('Scope, model choices and unavailable readings',report.limitations,true));
    replace('br-sources',...report.sources.map(s=>{const a=el('article',null,'br-source');a.id='br-source-'+s.id;a.append(el('h3',s.title||s.id));const u=safeURL(s.url);if(u){const link=el('a','Open source');link.href=u;link.rel='noopener noreferrer';a.append(link);}a.append(evidence(s));return a;}));
    $('br-results').hidden=false;draw();actions.forEach(id=>$(id).disabled=false);status('Reading calculated locally. Your private birth inputs have not been saved or sent.');
  }
  function calculate(request){
    invalidate();const token=revision;status('Calculating the charts, calendar comparison and three-year cycles…');form.setAttribute('aria-busy','true');
    worker=new Worker(new URL('../workers/birth-reading-worker.js',import.meta.url),{type:'module'});
    worker.onmessage=({data})=>{if(token!==revision)return;worker.terminate();worker=null;form.removeAttribute('aria-busy');if(data.error){status(data.error);return;}try{render(data.report,request);}catch(error){invalidate();status('Unable to display reading: '+error.message);}};
    worker.onerror=e=>{if(token!==revision)return;invalidate();status('Calculation could not finish. '+e.message);};worker.postMessage(request);
  }
  form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;try{calculate(read());}catch(error){invalidate();status(error.message);}});
  $('br-chart-select')?.addEventListener('change',draw);
  $('br-clear').addEventListener('click',()=>{invalidate();form.reset();$('br-asof').value=localDate();$('br-import').value='';status('Birth inputs and reading cleared from this page.');$('br-date').focus();});
  $('br-import').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;invalidate();const token=revision;
    try{
      if(file.size>2*1024*1024)throw Error('Choose a JSON file smaller than 2 MiB.');
      const raw=JSON.parse(await file.text());if(token!==revision)return;
      const r=raw.kind==='private-birth-reading'?raw.input:raw;
      if(!r||typeof r!=='object'||Object.keys(r).some(k=>!['birth','asOf','futureYears'].includes(k))||!r.birth||r.birth.timeKnown!==true)throw Error('Import a timed birth input with birth, asOf and futureYears fields.');
      const b=r.birth;if(Object.keys(b).some(k=>!['date','timeKnown','time','timeZone','lat','lon','disambiguation'].includes(k)))throw Error('Birth record contains unsupported fields.');
      // Recompute from input. Archived results and source prose are never trusted.
      for(const [id,key]of [['br-date','date'],['br-time','time'],['br-zone','timeZone'],['br-lat','lat'],['br-lon','lon']])$(id).value=b[key];
      $('br-asof').value=new Intl.DateTimeFormat('en-CA',{timeZone:b.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(r.asOf));calculate(r);
    }catch(error){invalidate();status('Import failed: '+error.message);}
  });
  $('br-export-json').addEventListener('click',()=>{if(current)downloadBlob(new Blob([JSON.stringify({kind:'private-birth-reading',schemaVersion:1,input,report:current},null,2)],{type:'application/json'}),'birth-reading-private.json');});
  $('br-print').addEventListener('click',()=>{if(current)window.print();});
  let printClosed=[];
  window.addEventListener('beforeprint',()=>{printClosed=[...$('br-results').querySelectorAll('details:not([open])')];printClosed.forEach(d=>d.open=true);});
  window.addEventListener('afterprint',()=>{printClosed.forEach(d=>d.open=false);printClosed=[];});
  $('br-export-html').addEventListener('click',()=>{
    if(!current)return;
    const clone=$('br-results').cloneNode(true);clone.hidden=false;clone.querySelectorAll('button,select,input,script,label').forEach(n=>n.remove());clone.querySelectorAll('details').forEach(n=>n.open=true);
    const svg=$('br-chart').querySelector('svg');if(svg){clone.querySelector('#br-chart').innerHTML=svgToString(svg);clone.querySelector('#br-chart').prepend(el('p',$('br-chart').querySelector('p')?.textContent||'Selected chart frame','br-note'));}
    clone.querySelectorAll('svg [role=button]').forEach(n=>{n.removeAttribute('role');n.removeAttribute('tabindex');});
    clone.querySelectorAll('svg').forEach(n=>n.setAttribute('aria-label','Static chart; positions and interpretations follow in the report.'));
    const css=`:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#050607;color:#e7edf0;font:17px/1.7 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:clamp(20px,5vw,64px)}h1,h2,h3{font-family:Georgia,serif;line-height:1.25}h1{font-size:clamp(2rem,5vw,3.8rem)}h2{font-size:2rem;color:#82e6ec}h3{font-size:1.35rem}a{color:#f6d588}section{padding-block:24px;border-top:1px solid #53606a}p{max-width:78ch}svg{max-width:100%;height:auto}.br-table-wrap{overflow:auto}table{border-collapse:collapse;width:100%}th,td{padding:12px;text-align:left;vertical-align:top;border-bottom:1px solid #52606a}td{min-width:180px}details{margin-block:12px;padding:12px;border:1px solid #53606a;border-radius:8px}summary,dt{font-weight:650}dd{margin:0 0 10px;overflow-wrap:anywhere}dl>div{padding:8px 0}li{margin-block:10px}.br-note{color:#b3c0cb}.br-actions,.br-chart-controls,.br-jump,.br-jumps{display:none}footer{margin-top:3rem;color:#b3c0cb}@media print{body{background:white;color:black;font-size:11pt}a,h2{color:#153d55}main{padding:0}.br-table-wrap{overflow:visible}svg{max-height:19cm}section{break-before:auto}h2,h3{break-after:avoid}details{break-inside:auto}table{font-size:9pt}td{min-width:0}}`;
    const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Private birth reading · ${esc(input.birth.date)}</title><style>${css}</style></head><body><main><p>THE ASTROLOGER'S WORKBENCH · PRIVATE STUDY</p><h1>Your birth, through many calendars.</h1><p>Recorded local birth: ${esc(input.birth.date)} ${esc(input.birth.time)} · ${esc(input.birth.timeZone)} · ${esc(input.birth.lat)}°, ${esc(input.birth.lon)}°. Study snapshot: ${esc(input.asOf)}.</p><p>This file includes personal birth details. Store and share it deliberately. Calculations describe positions and calendar conventions; historical interpretations offer reflection, not established past or future life events.</p>${clone.outerHTML}<footer>Self-contained reading: no scripts, remote assets or automatic network requests. Sources can be opened explicitly. Recalculate in the Workbench when inputs or the study date change.</footer></main></body></html>`;
    downloadBlob(new Blob([html],{type:'text/html'}),'birth-reading-private.html');
  });
  status('Enter a recorded birth and calculate a private reading.');
}
