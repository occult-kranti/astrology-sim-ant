// Original desktop instrument. Presentation only: all longitudes, houses and
// aspects arrive from the canonical desktop-workbench adapter. No calculations
// or persistence occur here. Fan positions are labels only; true longitude ticks
// and aspect endpoints remain undisplaced. SVG carries literal portable paint.
import {norm360, SIGN_GLYPHS, SIGNS, formatLon} from '../core/astro.js';

const NS='http://www.w3.org/2000/svg';
const PALETTE={Sun:'#ffd181',Moon:'#e1e9f0',Mercury:'#8edbe0',Venus:'#e5a9cc',Mars:'#ff9287',Jupiter:'#e4bd88',Saturn:'#b9c89c',Uranus:'#80d8e1',Neptune:'#a7b7ff',Pluto:'#d9a9bd',NorthNode:'#c3b6e8',SouthNode:'#bcadce',Fortune:'#dfc480'};
const GLYPHS={Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',NorthNode:'☊',SouthNode:'☋',Fortune:'⊕'};
const ASP={Conjunction:{color:'#e0bd7e',dash:'',glyph:'☌'},Sextile:{color:'#78d5c3',dash:'3 4',glyph:'⚹'},Square:{color:'#ff948c',dash:'',glyph:'□'},Trine:{color:'#8ab9f3',dash:'',glyph:'△'},Opposition:{color:'#df9fd6',dash:'9 5',glyph:'☍'}};
const ELEM=['#e7a68e','#bbc8a4','#a3c5df','#b8b0de'];
const font="'Segoe UI',system-ui,sans-serif";
const symbolFont="'Segoe UI Symbol','Noto Sans Symbols 2','DejaVu Sans',sans-serif";
const node=(tag,attrs={},text)=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))if(v!=null)e.setAttribute(k,String(v));if(text!=null)e.textContent=String(text);return e;};
const round=n=>Math.round(n*1000)/1000;
const p=(lon,asc,r)=>{const angle=(180+norm360(lon-asc))*Math.PI/180;return[round(500+r*Math.cos(angle)),round(500-r*Math.sin(angle))];};
const points=ps=>ps.map(v=>v.join(',')).join(' ');
const segment=(a,b,attrs)=>node('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],...attrs});
const bodyID=b=>b.id||b.name;
const longitude=b=>Number.isFinite(b.lon)?b.lon:b.longitude;
const namedFrame=f=>f==='secondary'?'B':'A';

// Deterministic circular packing. Cut at the largest empty gap, then use a
// minimum 9° separation for legible labels. The cut handles the 0° seam. For
// very clustered data the entire fan is centered on the cluster's original
// angular extent; labels can move, exact data and true ticks never do.
function displayLongitudes(bodies,gap=9){
  const ordered=bodies.map(b=>({id:bodyID(b),lon:norm360(longitude(b))})).sort((a,b)=>a.lon-b.lon);
  if(!ordered.length)return new Map();
  let cut=0,max=-1;
  for(let i=0;i<ordered.length;i++){const next=ordered[(i+1)%ordered.length].lon+(i===ordered.length-1?360:0);if(next-ordered[i].lon>max){max=next-ordered[i].lon;cut=(i+1)%ordered.length;}}
  const linear=ordered.slice(cut).concat(ordered.slice(0,cut));
  const actual=linear.map((b,i)=>b.lon+(i&&b.lon<linear[0].lon?360:0));
  const fitted=[actual[0]];
  for(let i=1;i<actual.length;i++)fitted.push(Math.max(actual[i],fitted[i-1]+gap));
  const shift=(fitted.reduce((s,v,i)=>s+v-actual[i],0))/fitted.length;
  return new Map(linear.map((b,i)=>[b.id,norm360(fitted[i]-shift)]));
}
function activate(el,fn){el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});}
function aspectKey(a){return`${a.fromFrame||a.fromChart||'primary'}:${a.from}:${a.toFrame||a.toChart||'primary'}:${a.to}:${a.aspect}`;}
function degreeLabel(lon){const minutes=Math.floor(norm360(lon)*60)%(360*60),v=minutes%(30*60);return`${Math.floor(v/60)}°${String(v%60).padStart(2,'0')}′`;}
function arc(a,b,r,asc){let delta=((b-a+540)%360)-180;if(Math.abs(delta)<.35)delta=.35;const count=Math.max(2,Math.ceil(Math.abs(delta)/2));return points(Array.from({length:count+1},(_,i)=>p(a+delta*i/count,asc,r)));}

/** Render a standalone-exportable SVG. Callbacks receive canonical objects/IDs. */
export function renderDesktopWheel(container,study,options={}){
  if(!container||!study?.primary?.chart)throw new TypeError('A container and calculated primary chart are required.');
  const opts={selectedBody:'Sun',selectedFrame:'primary',selectedAspect:null,showAspects:true,showHouses:true,...options};
  const primary=study.primary,secondary=study.secondary,comparison=!!secondary;
  const asc=primary.chart.asc;
  if(!Number.isFinite(asc))throw new RangeError('The chart needs a finite ascendant.');
  const frames=[['primary',primary],...(secondary?[['secondary',secondary]]:[])];
  const allBodies=new Map();
  for(const[frame,value]of frames)for(const b of value.bodies||[])if(Number.isFinite(longitude(b)))allBodies.set(`${frame}:${bodyID(b)}`,b);
  const selected=allBodies.get(`${opts.selectedFrame}:${opts.selectedBody}`);
  const aspects=comparison?(study.crossAspects||[]):(primary.aspects||[]);
  const selectedKey=opts.selectedAspect?aspectKey(opts.selectedAspect):null;
  const label=`${comparison?'Comparison biwheel':'Chart wheel'}; primary ascendant ${formatLon(asc)}. ${primary.chart.system} houses. ${frames.reduce((n,[,f])=>n+(f.bodies?.length||0),0)} selectable body markers. Exact positions are also in the Positions view.`;
  const svg=node('svg',{xmlns:NS,viewBox:'0 0 1000 1000',class:'dw-wheel',role:'group','aria-label':label,'data-dw-wheel':comparison?'biwheel':'natal','data-asc':asc,'font-family':font,'text-anchor':'middle','dominant-baseline':'middle'});
  svg.style.width='100%';svg.style.height='auto';svg.style.display='block';
  svg.append(node('title',{},comparison?'Two charts, one zodiac':'Calculated chart instrument'));
  svg.append(node('desc',{},'Longitudes increase counterclockwise from the primary Ascendant on the left. A is the primary chart; B is the comparison chart. Solid cyan and dashed amber rings distinguish the frames. Displayed bodies have symbolic sizes. Labels may fan apart; fine leaders retain exact longitudes. Aspect colors name geometry, not favorable or unfavorable outcomes. Use the adjacent tables for exact positions and keyboard alternatives.'));
  svg.append(node('metadata',{},JSON.stringify({kind:'desktop-chart-wheel',version:1,mode:study.inputs?.mode||study.mode||(comparison?'comparison':'natal'),zodiac:study.inputs?.zodiac||null,primaryUTC:primary.dateISO,secondaryUTC:secondary?.dateISO||null,system:primary.chart.system,ascendant:asc,bodyPositions:frames.flatMap(([frame,v])=>(v.bodies||[]).map(b=>({frame,id:bodyID(b),longitude:longitude(b)}))),geometry:'Longitudes and true ticks are canonical; label fanning and marker sizes are display conventions.',containsUserChartData:true})));
  const style=node('style');style.textContent='.dw-wheel [role="button"]{cursor:pointer;outline:none}.dw-wheel .dw-marker-focus{opacity:0}.dw-wheel [role="button"]:focus .dw-marker-focus,.dw-wheel [role="button"]:focus-visible .dw-marker-focus{opacity:1}.dw-wheel [role="button"]:hover .dw-marker-disc{stroke-width:2.4}.dw-wheel .dw-aspect-hit:focus .dw-aspect-line{stroke-width:4;opacity:1}@media(forced-colors:active){.dw-wheel [role="button"]:focus .dw-marker-focus{stroke:Highlight}}';svg.append(style);
  svg.append(node('rect',{width:1000,height:1000,fill:'#06090d'}));
  svg.append(node('circle',{cx:500,cy:500,r:451,fill:'#090e14',stroke:'#2a3541','stroke-width':1.4}));
  svg.append(node('circle',{cx:500,cy:500,r:408,fill:'#080c11',stroke:'#31404b','stroke-width':1}));
  // Restrained zodiac bands, real 30° partitions and one-degree graduation.
  for(let sign=0;sign<12;sign++){
    const start=sign*30,verts=[];
    for(let d=0;d<=30;d+=2)verts.push(p(start+d,asc,448));
    for(let d=30;d>=0;d-=2)verts.push(p(start+d,asc,410));
    svg.append(node('polygon',{points:points(verts),fill:ELEM[sign%4],'fill-opacity':.035}));
    svg.append(segment(p(start,asc,409),p(start,asc,450),{stroke:'#3b4753','stroke-width':1}));
    const xy=p(start+15,asc,429);
    const t=node('text',{x:xy[0],y:xy[1],fill:ELEM[sign%4],'font-family':symbolFont,'font-size':25},SIGN_GLYPHS[sign]);t.append(node('title',{},SIGNS[sign]));svg.append(t);
  }
  for(let d=0;d<360;d++){
    const len=d%30===0?12:d%10===0?8:d%5===0?5:2.5;
    svg.append(segment(p(d,asc,408),p(d,asc,408-len),{stroke:d%5===0?'#52616e':'#29343e','stroke-width':d%30===0?1.4:.8}));
  }
  const rPrimary=comparison?296:351,rSecondary=373,rHouse=comparison?258:303,rAspect=comparison?236:276;
  svg.append(node('circle',{cx:500,cy:500,r:rHouse,fill:'#070b10',stroke:'#26333e','stroke-width':1}));
  svg.append(node('circle',{cx:500,cy:500,r:rPrimary,fill:'none',stroke:'#75cfc7','stroke-width':.8,'stroke-opacity':.28,'data-frame-ring':'primary'}));
  if(comparison)svg.append(node('circle',{cx:500,cy:500,r:rSecondary,fill:'none',stroke:'#e1b979','stroke-width':1,'stroke-dasharray':'5 7','stroke-opacity':.4,'data-frame-ring':'secondary'}));
  if(opts.showHouses){
    for(let h=1;h<=12;h++){
      const lon=primary.chart.cusps?.[h],next=primary.chart.cusps?.[h===12?1:h+1];
      if(!Number.isFinite(lon)||!Number.isFinite(next))continue;
      const angular=[1,4,7,10].includes(h);
      svg.append(segment(p(lon,asc,92),p(lon,asc,rHouse),{stroke:angular?'#546574':'#293743','stroke-width':angular?1.2:.8,'stroke-dasharray':angular?null:'2 5','data-dw-cusp':h,'data-longitude':lon}));
      const xy=p(lon+norm360(next-lon)/2,asc,rHouse-21);
      svg.append(node('text',{x:xy[0],y:xy[1],fill:'#a1b1bf','font-size':14,'font-weight':500},h));
    }
  }
  // Aspect chords use exact longitudes, never collision-adjusted marker angles.
  const aspectsLayer=node('g',{'data-dw-aspect-layer':'','aria-label':comparison?'Cross-chart aspects':'Primary chart aspects'});
  if(opts.showAspects)for(const a of aspects){
    const fromFrame=a.fromFrame||a.fromChart||'primary',toFrame=a.toFrame||a.toChart||(comparison?'secondary':'primary');
    const from=allBodies.get(`${fromFrame}:${a.from}`),to=allBodies.get(`${toFrame}:${a.to}`);if(!from||!to)continue;
    const paint=ASP[a.aspect]||{color:'#a8b5c1',dash:'',glyph:a.glyph||'·'};
    const active=selectedKey===aspectKey({...a,fromFrame,toFrame});
    const related=(fromFrame===opts.selectedFrame&&a.from===opts.selectedBody)||(toFrame===opts.selectedFrame&&a.to===opts.selectedBody);
    const opacity=active?1:related ? .84 : .43;
    const group=node('g',{class:'dw-aspect-hit','data-dw-aspect':`${a.from}-${a.to}-${a.aspect}`,'data-from-frame':fromFrame,'data-to-frame':toFrame,tabindex:0,role:'button','aria-pressed':active?'true':'false','aria-label':`${namedFrame(fromFrame)} ${a.from} ${a.aspect} ${namedFrame(toFrame)} ${a.to}; orb ${Number(a.orb).toFixed(2)} degrees`});
    group.append(node('title',{},`${namedFrame(fromFrame)} ${a.from} ${paint.glyph} ${namedFrame(toFrame)} ${a.to} · ${a.aspect} · orb ${Number(a.orb).toFixed(3)}°`));
    let geometry;
    if(a.aspect==='Conjunction')geometry={tag:'polyline',attrs:{points:arc(longitude(from),longitude(to),rAspect-8,asc)}};
    else{const f=p(longitude(from),asc,rAspect),t=p(longitude(to),asc,rAspect);geometry={tag:'line',attrs:{x1:f[0],y1:f[1],x2:t[0],y2:t[1]}};}
    group.append(node(geometry.tag,{...geometry.attrs,fill:'none',stroke:'transparent','stroke-width':13}));
    group.append(node(geometry.tag,{...geometry.attrs,class:'dw-aspect-line',fill:'none',stroke:paint.color,'stroke-width':active?3.1:related?1.8:1.05,'stroke-dasharray':paint.dash||null,'stroke-opacity':opacity,'data-from-longitude':longitude(from),'data-to-longitude':longitude(to)}));
    if(active){const f=p(longitude(from),asc,rAspect),t=p(longitude(to),asc,rAspect);for(const[x,y]of[f,t])group.append(node('circle',{cx:x,cy:y,r:4,fill:paint.color}));}
    activate(group,()=>opts.onSelectAspect?.(a));aspectsLayer.append(group);
  }
  svg.append(aspectsLayer);
  // Hub intentionally labels the working frames; no fabricated score or destiny.
  svg.append(node('circle',{cx:500,cy:500,r:80,fill:'#080d13',stroke:'#25343f','stroke-width':1}));
  svg.append(node('text',{x:500,y:473,fill:'#94a7b8','font-size':11,'letter-spacing':2.4},comparison?'CHART COMPARISON':'CHART STUDY'));
  svg.append(node('text',{x:500,y:508,fill:'#e7eef5','font-size':30,'font-family':symbolFont},comparison?'A ↔ B':selected?(selected.glyph||GLYPHS[bodyID(selected)]||'✦'):'A'));
  svg.append(node('text',{x:500,y:539,fill:'#a2b2c1','font-size':11,'letter-spacing':1},comparison?'INNER / OUTER':'PRIMARY · A'));
  // Body markers. Their leaders end at true ticks, and preserve original data.
  for(const[frame,value]of frames){
    const bodies=(value.bodies||[]).filter(b=>Number.isFinite(longitude(b))),fans=displayLongitudes(bodies,comparison&&frame==='primary'?11:9),r=frame==='primary'?rPrimary:rSecondary;
    const frameColor=frame==='primary'?'#7bd6d0':'#efc586';
    for(const b of bodies){
      const id=bodyID(b),lon=longitude(b),display=fans.get(id)??lon,xy=p(display,asc,r),color=PALETTE[id]||'#c9d4df';
      const active=opts.selectedBody===id&&opts.selectedFrame===frame;
      const selectedPair=opts.selectedAspect&&((opts.selectedAspect.from===id&&(opts.selectedAspect.fromFrame||opts.selectedAspect.fromChart||'primary')===frame)||(opts.selectedAspect.to===id&&(opts.selectedAspect.toFrame||opts.selectedAspect.toChart||(comparison?'secondary':'primary'))===frame));
      const trueTick=p(lon,asc,r-31),elbow=p(lon,asc,r-23),end=p(display,asc,r-23);
      svg.append(node('polyline',{points:points([trueTick,elbow,end,xy]),fill:'none',stroke:frameColor,'stroke-width':active?1.6:.8,'stroke-opacity':active ? .9 : .45,'stroke-dasharray':frame==='secondary'?'3 3':null,'data-dw-leader':id,'data-frame':frame,'data-longitude':lon}));
      svg.append(segment(p(lon,asc,r-36),p(lon,asc,r-28),{stroke:color,'stroke-width':1.7,'data-dw-true-tick':id,'data-frame':frame,'data-longitude':lon}));
      const aLabel=`${namedFrame(frame)} ${id}, ${b.label||formatLon(lon)}, ${b.retrograde?'retrograde':'direct'}${b.house?`, house ${b.house}`:''}. Inspect ${frame} chart body.`;
      const group=node('g',{'data-dw-body':id,'data-dw-frame':frame,'data-longitude':lon,'data-display-longitude':display,role:'button',tabindex:0,'aria-label':aLabel,'aria-pressed':active?'true':'false'});
      group.append(node('title',{},aLabel));
      // True body circles are symbolic glyph containers, not physical sizes.
      group.append(node('circle',{cx:xy[0],cy:xy[1],r:25,fill:'#060b11','fill-opacity':.94,stroke:active||selectedPair?frameColor:'#293945','stroke-width':active?2.1:1,class:'dw-marker-disc'}));
      group.append(node('circle',{cx:xy[0]-4,cy:xy[1]-5,r:15,fill:color,'fill-opacity':.075,'pointer-events':'none'}));
      group.append(node('circle',{cx:xy[0],cy:xy[1],r:29,fill:'none',stroke:'#ffffff','stroke-width':2,'stroke-dasharray':'3 3',class:'dw-marker-focus','pointer-events':'none'}));
      group.append(node('text',{x:xy[0],y:xy[1]+.5,fill:color,'font-size':27,'font-family':symbolFont,'pointer-events':'none'},b.glyph||GLYPHS[id]||id.slice(0,2)));
      const degree=p(display,asc,r+37);
      group.append(node('text',{x:degree[0],y:degree[1],fill:active?'#f3f6fa':'#c1cfdb','font-size':12,'font-family':font,'font-variant-numeric':'tabular-nums','paint-order':'stroke',stroke:'#070b10','stroke-width':3,'stroke-linejoin':'round','pointer-events':'none'},`${degreeLabel(lon)}${b.retrograde?' ℞':''}`));
      const tag=p(display,asc,r-17);
      group.append(node('text',{x:tag[0],y:tag[1]+2,fill:frameColor,'font-size':8,'font-weight':700,'paint-order':'stroke',stroke:'#080d14','stroke-width':2,'pointer-events':'none'},namedFrame(frame)));
      activate(group,()=>opts.onSelectBody?.(id,frame));svg.append(group);
    }
  }
  // Primary angles retain their true longitudes even when houses are hidden.
  for(const[name,lon]of[['ASC',asc],['MC',primary.chart.mc],['DSC',primary.chart.desc??norm360(asc+180)],['IC',primary.chart.ic??norm360(primary.chart.mc+180)]]){
    if(!Number.isFinite(lon))continue;
    const xy=p(lon,asc,473),arrow=p(lon,asc,450);
    svg.append(segment(p(lon,asc,451),p(lon,asc,459),{stroke:'#b3c2ce','stroke-width':1.2}));
    svg.append(node('circle',{cx:arrow[0],cy:arrow[1],r:2,fill:'#c5d5e1'}));
    svg.append(node('rect',{x:xy[0]-22,y:xy[1]-10,width:44,height:20,rx:3,fill:'#101822',stroke:'#374957','stroke-width':.8}));
    svg.append(node('text',{x:xy[0],y:xy[1]+.5,fill:'#d6e4ee','font-size':10,'font-weight':650,'letter-spacing':1},name));
  }
  container.replaceChildren(svg);return svg;
}
