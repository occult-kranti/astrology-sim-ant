// A presentation-only console over an already calculated private birth report.
// No ephemeris, storage, URL mutation, network, or printed-chart reconstruction.
import { renderChart } from '../core/chart.js';
import { formatLon } from '../core/astro.js';
import { svgToString, svgToPNG, downloadBlob } from './state.js';

const NS='http://www.w3.org/2000/svg';
const FRAMES=Object.freeze({
  'tropical-regiomontanus':{key:'tropicalRegiomontanus',label:'Tropical · Regiomontanus'},
  'tropical-whole':{key:'tropicalWhole',label:'Tropical · whole sign'},
  'sidereal-whole':{key:'siderealWhole',label:'Sidereal · whole sign'},
});
const BODY_ORDER=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','NorthNode','SouthNode'];
const nameOf=name=>({NorthNode:'North node · Rāhu',SouthNode:'South node · Ketu'}[name]||name);
const number=(n,digits=6)=>typeof n==='number'&&Number.isFinite(n)?n.toFixed(digits):'Unavailable';
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=String(text);if(cls)n.className=cls;return n;};
const svgNode=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
const defaults=frame=>({frame:FRAMES[frame]?frame:'tropical-regiomontanus',body:'Sun',house:1,layers:{houses:true,aspects:true,labels:true},focus:false,pair:null,orientation:'asc-left',zoom:100});
let instanceCount=0;

/** Mount one bounded console. Only the subtree created here is removed on destroy.
 * options.onBodySelect(name) opens the host's full interpretation on explicit
 * SVG activation or Open full reading. Native selection stays in the console.
 * options.onFrameChange(id) can mirror an existing external frame selector.
 */
export function mountBirthChartConsole(container,initialReport,options={}){
  if(!container?.appendChild)throw new TypeError('A chart console requires a DOM container.');
  const prefix='bcc-'+(++instanceCount),abort=new AbortController();
  let report=initialReport,state=defaults(options.frame),svg=null,rotationGroup=null,metadata=null,destroyed=false,exporting=false,generation=0,exportSequence=0;
  const root=node('section',null,'birth-chart-console');root.dataset.bccRoot='';root.setAttribute('aria-label','Birth chart exploration console');
  const meta=node('p','', 'bcc-meta');meta.dataset.bccContext='';
  const header=node('header',null,'bcc-header'),eyebrow=node('p','PERSONAL OBSERVATORY / CHART CONTROL','bcc-eyebrow'),title=node('h3','Read the sky in layers.');
  const titleGroup=node('div');titleGroup.append(eyebrow,title);const index=node('span','01 / SKY','bcc-index');index.setAttribute('aria-hidden','true');header.append(titleGroup,index);
  const toolbar=node('div',null,'bcc-toolbar'),main=node('div',null,'bcc-main'),instrument=node('div',null,'bcc-instrument'),side=node('aside',null,'bcc-inspector');side.setAttribute('aria-label','Selected chart facts');
  const plot=node('div',null,'bcc-plot');plot.dataset.bccPlot='';
  const plotNote=node('p','Select a body on the wheel or in the body menu. The wheel uses calculated longitudes; textures and radial spacing are illustrative.','bcc-note');
  const field=(label,control)=>{const wrap=node('label',null,'bcc-field');const id=prefix+'-'+(control.dataset.bccFrame!==undefined?'frame':control.dataset.bccBody!==undefined?'body':control.dataset.bccHouse!==undefined?'house':control.dataset.bccOrientation!==undefined?'orientation':'zoom');control.id=id;wrap.htmlFor=id;wrap.append(node('span',label),control);return wrap;};
  const select=(data,entries)=>{const s=node('select');s.setAttribute(data,'');for(const[value,label]of entries){const o=node('option',label);o.value=value;s.append(o);}return s;};
  const frameSelect=select('data-bcc-frame',Object.entries(FRAMES).map(([id,v])=>[id,v.label]));
  const bodySelect=select('data-bcc-body',[]),houseSelect=select('data-bcc-house',Array.from({length:12},(_,i)=>[String(i+1),'House '+(i+1)]));
  toolbar.append(field('Coordinate & house frame',frameSelect),field('Inspect a body',bodySelect),field('Inspect a house',houseSelect));
  const layers=node('fieldset',null,'bcc-layers');layers.append(node('legend','Visible layers'));
  const layerInputs={};
  for(const[key,label]of [['houses','House lines'],['aspects','Aspect lines'],['labels','Degree & angle labels']]){const lab=node('label',null,'bcc-toggle'),input=node('input');input.type='checkbox';input.checked=true;input.dataset.bccLayer=key;lab.append(input,node('span',label));layers.append(lab);layerInputs[key]=input;}
  const viewControls=node('div',null,'bcc-view-controls'),orientation=select('data-bcc-orientation',[['asc-left','Ascendant at left'],['aries-top','0° Aries at top']]),zoom=node('input');zoom.type='range';zoom.min='100';zoom.max='220';zoom.step='10';zoom.value='100';zoom.dataset.bccZoom='';zoom.setAttribute('aria-label','Wheel display zoom');
  const zoomOutput=node('output','100%');zoomOutput.htmlFor=prefix+'-zoom';zoomOutput.dataset.bccZoomValue='';
  const zoomField=field('Display zoom',zoom);zoomField.append(zoomOutput);
  const button=(label,action)=>{const b=node('button',label);b.type='button';b.dataset.bccAction=action;return b;};
  const resetButton=button('Reset view','reset');resetButton.className='bcc-reset';viewControls.append(field('Display orientation',orientation),zoomField,resetButton);
  const readout=node('div',null,'bcc-readout');readout.dataset.bccReadout='';readout.setAttribute('aria-live','polite');
  const houseReadout=node('div',null,'bcc-house-readout');houseReadout.dataset.bccHouseReadout='';
  const openReading=button('Open full reading ↗','open-reading');openReading.className='bcc-open-reading';
  const aspectHeader=node('div',null,'bcc-aspect-heading');aspectHeader.append(node('p','ANGULAR CONTACTS','bcc-eyebrow'),node('h4','Follow the connections.'));
  const focusLabel=node('label',null,'bcc-toggle'),focusInput=node('input');focusInput.type='checkbox';focusInput.dataset.bccFocus='';focusLabel.append(focusInput,node('span','Only the selected body’s contacts'));
  const aspectNote=node('p','Western planetary-moiety filter, shared angular geometry. Sidereal display does not turn these contacts into Vedic graha-dṛṣṭi.','bcc-note');
  const aspectList=node('ol',null,'bcc-aspect-list');aspectList.dataset.bccAspects='';
  const unpin=button('Clear pair focus','clear-pair');unpin.disabled=true;
  const aspectDetail=node('div',null,'bcc-pair-detail');aspectDetail.dataset.bccPairDetail='';
  const exports=node('div',null,'bcc-exports'),svgButton=button('Download view · SVG','svg'),pngButton=button('Download view · PNG','png');exports.append(svgButton,pngButton);
  const exportNote=node('p','Downloads include this private chart, its instant and current display settings. Zoomed views export the visible crop. No birth data is saved by these controls.','bcc-note');
  const status=node('p','', 'bcc-status');status.dataset.bccStatus='';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const tableDetails=node('details',null,'bcc-data');tableDetails.append(node('summary','Read the complete position table'));
  const tableWrap=node('div',null,'bcc-table-wrap');tableWrap.tabIndex=0;tableWrap.setAttribute('role','region');tableWrap.setAttribute('aria-label','Held body positions; scroll horizontally');tableDetails.append(tableWrap);
  instrument.append(plot,plotNote,viewControls,tableDetails);side.append(readout,openReading,houseReadout,aspectHeader,focusLabel,aspectNote,aspectList,unpin,aspectDetail);main.append(instrument,side);
  root.append(meta,header,toolbar,layers,main,exports,exportNote,status);container.append(root);

  const frame=()=>report?.charts?.[FRAMES[state.frame]?.key];
  const heldAspects=()=>Array.isArray(report?.western?.aspects)?report.western.aspects.filter(a=>frame()?.planets?.[a.from]&&frame()?.planets?.[a.to]):[];
  const visibleAspects=()=>heldAspects().filter(a=>!state.focus||a.from===state.body||a.to===state.body);
  const pairKey=a=>[a.from,a.to,a.aspect].join('|');
  function facts(entries){const dl=node('dl',null,'bcc-facts');for(const[label,value]of entries){const div=node('div');div.append(node('dt',label),node('dd',value));dl.append(div);}return dl;}
  function writeMetadata(){
    if(!metadata)return;
    metadata.textContent=JSON.stringify({kind:'private-birth-chart-view',version:1,frame:state.frame,frameLabel:FRAMES[state.frame].label,coordinateFrame:frame()?.frame,instantUTC:report?.context?.instantUTC||null,selectedBody:state.body,selectedHouse:state.house,layers:{...state.layers},focusedBodyContacts:state.focus,focusedPair:state.pair,orientation:state.orientation,zoom:state.zoom,aspectConvention:'Held Western planetary moieties; not Vedic graha-drishti',geometrySource:'Already calculated birth-report frame; display controls do not recast'});
  }
  function applyView(){
    if(!svg||!frame())return;
    const angle=state.orientation==='aries-top'?90-frame().asc:0;
    rotationGroup.setAttribute('transform',`rotate(${angle} 340 340)`);
    // Counter-rotate textual labels around their own anchors, keeping each
    // number attached to its unchanged position while making it readable.
    for(const t of rotationGroup.querySelectorAll('text')){const x=Number(t.getAttribute('x')),y=Number(t.getAttribute('y'));if(Number.isFinite(x)&&Number.isFinite(y))t.setAttribute('transform',`rotate(${-angle} ${x} ${y})`);}
    const size=760/(state.zoom/100),edge=340-size/2;svg.setAttribute('viewBox',`${edge} ${edge} ${size} ${size}`);
    zoom.value=String(state.zoom);zoomOutput.value=state.zoom+'%';zoomOutput.textContent=state.zoom+'%';orientation.value=state.orientation;
    svg.dataset.bccViewOrientation=state.orientation;svg.dataset.bccViewZoom=String(state.zoom);writeMetadata();
  }
  function applyHighlights(){
    if(!svg)return;
    svg.dataset.bccSelectedBody=state.body;svg.dataset.bccSelectedHouse=String(state.house);
    for(const g of svg.querySelectorAll('.planet')){const selected=g.dataset.el==='planet-'+state.body;g.dataset.bccSelectedBody=String(selected);g.setAttribute('aria-pressed',String(selected));g.querySelector('.bcc-body-ring')?.remove();if(selected){const glyph=g.querySelector('.planet-glyph');g.prepend(svgNode('circle',{cx:glyph.getAttribute('x'),cy:glyph.getAttribute('y'),r:22,fill:'none',stroke:'var(--chart-focus,#35e9ff)','stroke-width':2.5,class:'bcc-body-ring','pointer-events':'none'}));}}
    for(const g of svg.querySelectorAll('.cusp-group')){const n=Number(g.dataset.el?.split('-')[1]),selected=n===state.house;g.dataset.bccSelectedHouse=String(selected);g.setAttribute('aria-pressed',String(selected));}
    writeMetadata();
  }
  function renderReadouts(){
    const c=frame(),p=c?.planets?.[state.body];if(!p)return;
    readout.replaceChildren(node('p','SELECTED BODY','bcc-eyebrow'),node('h4',nameOf(state.body)),node('p',formatLon(p.lon,true),'bcc-position'),facts([
      ['Longitude',number(p.lon)+'°'],['Latitude',number(p.lat)+'°'],['House',String(p.house)],['Motion',p.retrograde?'Retrograde':'Direct'],[state.frame==='sidereal-whole'?'Inherited tropical speed':'Speed',number(p.speed)+'° / day'],['Frame',FRAMES[state.frame].label],
    ]));
    if(state.body.includes('Node'))readout.append(node('p','Mean lunar node: a modeled intersection, not a physical planet.','bcc-note'));
    const occupants=Object.entries(c.planets).filter(([,p])=>p.house===state.house).map(([n])=>nameOf(n));
    const topic=report?.western?.houses?.find(h=>h.house===state.house);
    houseReadout.replaceChildren(node('p','SELECTED HOUSE','bcc-eyebrow'),node('h4','House '+state.house+(topic?.title?' · '+topic.title:'')),facts([['Cusp',formatLon(c.cusps[state.house],true)],['Cusp longitude',number(c.cusps[state.house])+'°'],['Occupants',occupants.join(', ')||'No displayed bodies'],['House method',c.system]]));
    houseReadout.append(node('p','Occupants follow the selected frame. The topic name is the report’s Western reference, not an independent Vedic judgment.','bcc-note'));
    const list=visibleAspects();aspectList.replaceChildren();
    if(!list.length)aspectList.append(node('li','No contacts pass this held rule for the selected body.','bcc-note'));
    for(const a of list){const li=node('li'),b=node('button');b.type='button';b.dataset.bccPair=pairKey(a);b.setAttribute('aria-pressed',String(state.pair===pairKey(a)));b.append(node('strong',`${a.from} ${a.aspect.toLowerCase()} ${a.to}`),node('span',`Orb ${number(a.orb,3)}° · ${a.applying?'applying':'separating'}`));li.append(b);aspectList.append(li);}
    const selected=list.find(a=>pairKey(a)===state.pair);unpin.disabled=!selected;aspectDetail.replaceChildren();
    if(selected)aspectDetail.append(node('h4','Focused pair'),facts([['Contact',`${selected.from} · ${selected.aspect} · ${selected.to}`],['Exact angle',number(selected.angle,0)+'°'],['Orb',number(selected.orb,6)+'°'],['Allowed moiety',number(selected.allowance,3)+'°'],['Phase',selected.applying?'Applying under the local speed test':'Separating under the local speed test']]),node('p',selected.interpretation||selected.rule||'Held angular contact; no life event is inferred.','bcc-note'));
    openReading.disabled=typeof options.onBodySelect!=='function';
  }
  function renderTable(){
    const table=node('table'),caption=node('caption',FRAMES[state.frame].label+' · held body positions'),head=node('thead'),row=node('tr');
    for(const label of ['Body','Longitude','Sign position','House','Motion']){const th=node('th',label);th.scope='col';row.append(th);}head.append(row);const body=node('tbody');
    for(const[name,p]of Object.entries(frame().planets)){const r=node('tr');for(const value of [nameOf(name),number(p.lon)+'°',formatLon(p.lon,true),p.house,p.retrograde?'Retrograde':'Direct'])r.append(node('td',value));body.append(r);}table.append(caption,head,body);tableWrap.replaceChildren(table);
  }
  function draw(){
    const c=frame();if(!c){plot.replaceChildren(node('p','Calculate a birth reading to open the chart console.','bcc-empty'));return;}
    const active=root.ownerDocument.activeElement,previousFocus=active?.closest?.('[data-el]')?.getAttribute('data-el'),previousPairFocus=active?.closest?.('[data-bcc-pair]')?.getAttribute('data-bcc-pair');
    const list=visibleAspects();if(state.pair&&!list.some(a=>pairKey(a)===state.pair))state.pair=null;
    const drawn=state.layers.aspects?(state.pair?list.filter(a=>pairKey(a)===state.pair):list):[];
    svg=renderChart(plot,c,drawn,{size:680});svg.setAttribute('viewBox','-40 -40 760 760');svg.style.maxWidth='100%';svg.dataset.bccWheel='';
    const background=svg.querySelector('[data-chart-background]');if(background){background.setAttribute('x','-40');background.setAttribute('y','-40');background.setAttribute('width','760');background.setAttribute('height','760');}
    metadata=svgNode('metadata',{});svg.append(metadata);rotationGroup=svgNode('g',{'data-bcc-rotation':''});
    for(const child of [...svg.children])if(child.matches('.wheel-rotor,.angle-label'))rotationGroup.append(child);svg.append(rotationGroup);
    for(const g of svg.querySelectorAll('.cusp-group')){const n=Number(g.dataset.el.split('-')[1]);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',`Inspect house ${n}, cusp ${formatLon(c.cusps[n],true)}`);}
    for(const g of svg.querySelectorAll('.cusp-group,.house-num'))if(!state.layers.houses)g.style.display='none';
    for(const label of svg.querySelectorAll('.planet-deg,.angle-label,.house-num'))if(!state.layers.labels)label.style.display='none';
    frameSelect.value=state.frame;bodySelect.value=state.body;houseSelect.value=String(state.house);focusInput.checked=state.focus;
    for(const [key,input]of Object.entries(layerInputs))input.checked=state.layers[key];
    meta.textContent=`${FRAMES[state.frame].label} · ${report?.context?.instantUTC||'Recorded instant'} · held chart`;
    applyView();applyHighlights();renderReadouts();renderTable();
    if(previousFocus)svg.querySelector(`[data-el="${previousFocus}"]`)?.focus();
    else if(previousPairFocus)aspectList.querySelector(`[data-bcc-pair="${previousPairFocus}"]`)?.focus();
  }
  function selectBody(name,{open=false}={}){
    if(!frame()?.planets?.[name])return;state.body=name;state.pair=null;draw();
    if(open&&typeof options.onBodySelect==='function')options.onBodySelect(name);
  }
  function setFrame(id,{notify=true}={}){
    if(destroyed||!FRAMES[id]||!report?.charts?.[FRAMES[id].key])return;
    state.frame=id;state.pair=null;populateBodies();draw();if(notify)options.onFrameChange?.(id);
  }
  function populateBodies(){
    const names=BODY_ORDER.filter(n=>frame()?.planets?.[n]);bodySelect.replaceChildren(...names.map(name=>{const o=node('option',nameOf(name));o.value=name;return o;}));if(!names.includes(state.body))state.body=names[0]||'Sun';
  }
  function reset(){if(destroyed)return;state={...defaults(state.frame)};populateBodies();draw();status.textContent='Display reset. The calculated birth report is unchanged.';}
  async function exportView(type){
    if(!svg||destroyed||exporting)return;const requestSequence=++exportSequence,reportAtRequest=report,generationAtRequest=generation,stillCurrent=()=>!destroyed&&report===reportAtRequest&&generation===generationAtRequest;exporting=true;svgButton.disabled=pngButton.disabled=true;status.textContent='Preparing the private chart '+type.toUpperCase()+'…';
    try{writeMetadata();if(type==='svg')downloadBlob(new Blob([svgToString(svg)],{type:'image/svg+xml;charset=utf-8'}),'birth-chart-private-'+state.frame+'.svg');else await svgToPNG(svg,'birth-chart-private-'+state.frame+'.png',2,{shouldDownload:stillCurrent});if(stillCurrent())status.textContent='Private chart '+type.toUpperCase()+' download prepared.';}
    catch(error){if(stillCurrent())status.textContent='Chart export failed: '+error.message;}
    finally{if(requestSequence===exportSequence){exporting=false;if(!destroyed&&report)svgButton.disabled=pngButton.disabled=false;}}
  }
  root.addEventListener('change',e=>{
    const t=e.target;if(t.matches('[data-bcc-frame]'))setFrame(t.value);
    else if(t.matches('[data-bcc-body]'))selectBody(t.value);
    else if(t.matches('[data-bcc-house]')){state.house=Number(t.value);applyHighlights();renderReadouts();}
    else if(t.matches('[data-bcc-layer]')){state.layers[t.dataset.bccLayer]=t.checked;draw();}
    else if(t.matches('[data-bcc-focus]')){state.focus=t.checked;state.pair=null;draw();}
    else if(t.matches('[data-bcc-orientation]')){state.orientation=t.value;applyView();}
  },{signal:abort.signal});
  root.addEventListener('input',e=>{if(e.target.matches('[data-bcc-zoom]')){state.zoom=Number(e.target.value);applyView();}},{signal:abort.signal});
  function activate(t){
    const body=t.closest('[data-el^="planet-"]');if(body){selectBody(body.dataset.el.slice(7),{open:true});return;}
    const cusp=t.closest('[data-el^="cusp-"]');if(cusp){state.house=Number(cusp.dataset.el.slice(5));houseSelect.value=String(state.house);applyHighlights();renderReadouts();return;}
    const pair=t.closest('[data-bcc-pair]');if(pair){state.pair=pair.dataset.bccPair;draw();status.textContent='Focused pair drawn. Clear pair focus to restore the contact set.';return;}
    const action=t.closest('[data-bcc-action]')?.dataset.bccAction;
    if(action==='reset')reset();else if(action==='clear-pair'){state.pair=null;draw();}else if(action==='open-reading')options.onBodySelect?.(state.body);else if(action==='svg'||action==='png')exportView(action);
  }
  root.addEventListener('click',e=>activate(e.target),{signal:abort.signal});
  root.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.matches('[data-el^="planet-"],[data-el^="cusp-"]')){e.preventDefault();activate(e.target);}},{signal:abort.signal});
  function clear(){if(destroyed)return;generation++;exportSequence++;exporting=false;report=null;svg=null;metadata=null;rotationGroup=null;state=defaults(options.frame);plot.replaceChildren(node('p','Calculate a birth reading to open the chart console.','bcc-empty'));readout.replaceChildren();houseReadout.replaceChildren();aspectList.replaceChildren();aspectDetail.replaceChildren();tableWrap.replaceChildren();meta.textContent='No active private chart';status.textContent='Chart selection and private chart removed.';for(const control of root.querySelectorAll('button,input,select'))control.disabled=true;}
  function update(next){if(destroyed)return;generation++;exportSequence++;exporting=false;report=next;state=defaults(options.frame);for(const control of root.querySelectorAll('button,input,select'))control.disabled=false;if(!frame()){clear();return;}populateBodies();draw();status.textContent='Held chart ready. Controls change its presentation only.';}
  function destroy(){if(destroyed)return;generation++;exportSequence++;exporting=false;destroyed=true;abort.abort();report=null;svg=null;metadata=null;rotationGroup=null;root.remove();}
  update(initialReport);
  return Object.freeze({update,setFrame,reset,clear,destroy,getState:()=>JSON.parse(JSON.stringify(state)),getSVG:()=>svg});
}
