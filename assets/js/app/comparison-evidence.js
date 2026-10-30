// Native, local dependency inspector. No request, storage, provider or timer.
import { buildComparisonEvidence } from '../core/comparison-evidence.js';

const ROOT = new URL('../../../', import.meta.url);
const fmt = (number, digits = 4) => Number(number).toFixed(digits).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
const observerKey = c => JSON.stringify([c.lat,c.lon,c.timeZone,c.system,c.prayerMethod,c.asr,c.highLatitude]);
function sourceURL(raw) { if(typeof raw!=='string'||!raw)return null; try { const url = new URL(raw,ROOT); return ['https:','http:'].includes(url.protocol) ? url.href : null; } catch { return null; } }

export function mountComparisonEvidence(container, initialInput = null) {
  if (!container?.ownerDocument || typeof container.replaceChildren !== 'function') throw new TypeError('Mount the comparison inspector in a real document element.');
  const doc = container.ownerDocument;
  let active = true, key = null;
  container.classList.add('comparison-evidence');
  const node = (tag,text,cls) => { const el=doc.createElement(tag); if(text!=null)el.textContent=String(text); if(cls)el.className=cls;return el; };
  const details = (id,label) => { const el=node('details',null,'ce-disclosure');el.dataset.ceKey=id;el.append(node('summary',label));return el; };
  const references = (ids,report) => {
    const p=node('p','Sources · ','ce-note');
    ids.forEach((id,index)=>{const source=report.sources.find(s=>s.id===id);if(index)p.append(doc.createTextNode(' · '));const a=node('a',source?.title||id);const url=sourceURL(source?.url);if(url)a.href=url;p.append(a);});return p;
  };
  function bandText(q) {
    const b=q.band;if(q.id==='yoga')return `27 equal ${fmt(b.widthDegrees,6)}° intervals of the sidereal sum.`;
    if(q.id==='phase'&&b.lowerDegrees>b.upperDegrees)return `${fmt(b.lowerDegrees)}° ≤ Δ < 360°, or 0° ≤ Δ < ${fmt(b.upperDegrees)}°.`;
    const input=q.id==='nakshatra'?'sidereal Moon':'Δ';return `${fmt(b.lowerDegrees,6)}° ≤ ${input} < ${fmt(b.upperDegrees,6)}°.`;
  }
  function map(report) {
    const host=details('map','Trace the shared inputs'),paths=node('ol',null,'ce-paths'),g=report.sharedLunarGeometry;
    const rows=[
      [['Sun and Moon','Geocentric tropical longitudes'],['Subtract','Δ = '+fmt(g.elongationDegrees)+'°'],['Three partitions','Broad phase · tithi · karaṇa']],
      [['Moon and offset','Moon − linear Lahiri estimate'],['Choose a frame',fmt(g.siderealMoonLongitude)+'° sidereal Moon'],['27 equal arcs','Nakṣatra · '+report.quantities.find(q=>q.id==='nakshatra').value]],
      [['Sidereal Sun and Moon','Add both sidereal longitudes'],['Normalize the sum',fmt(g.yoga.angleDegrees)+'°'],['27 equal arcs','Nitya yoga · '+report.quantities.find(q=>q.id==='yoga').value]],
      [['Instant and IANA zone','An explicit civil clock'],['Named conversion','Calendar and runtime conventions'],['Civil date names','Labels, not religious observances']],
      [['Observer and solar horizon','Latitude, longitude and day boundary'],['Distinct methods','Temporal division / selected prayer rules'],['Local schedules','Planetary hours · vāra · prayers']],
    ];
    rows.forEach(parts=>{const li=node('li',null,'ce-path');parts.forEach(([title,value],index)=>{if(index){const arrow=node('span','→','ce-arrow');arrow.setAttribute('aria-hidden','true');li.append(arrow);}const block=node('div',null,'ce-step');block.append(node('strong',title),node('span',value));li.append(block);});paths.append(li);});
    host.append(node('p','Arrows show implemented inputs and transformations. They do not assert influence, historical transmission or independent agreement.','ce-note'),paths);
    return host;
  }
  function update(inputOrComparison) {
    if(!active)return null;
    const opened=new Set([...container.querySelectorAll('details[open][data-ce-key]')].map(el=>el.dataset.ceKey));
    const focused=container.contains(doc.activeElement)?doc.activeElement:null;
    const focusKey=focused?.closest('details[data-ce-key]')?.dataset.ceKey;
    const focusTag=focused?.tagName,focusHref=focused?.getAttribute('href');
    container.replaceChildren();
    if(!inputOrComparison){key=null;container.append(node('p','Update the reading to inspect connections for the current inputs.','ce-note'));return null;}
    let report;
    try{report=buildComparisonEvidence(inputOrComparison);}catch(error){key=null;const p=node('p',`Connections unavailable: ${error.message}`,'ce-error');p.setAttribute('role','alert');container.append(p);return null;}
    const nextKey=observerKey(report.context),preserve=key===nextKey;key=nextKey;
    container.append(node('h3','Why these readings connect—and differ'),node('p',`${report.context.dateISO} · ${report.context.timeZone}`,'ce-context'),node('p','Inspect a shared calculation before comparing its meanings. These checks explain the implementation; they do not validate a prediction.','ce-intro'));
    const frames=node('div',null,'ce-frames');
    for(const frame of report.frames){
      const article=node('article',null,'ce-frame');article.append(node('h4',frame.body));
      const values=node('dl');values.append(node('dt','Tropical'),node('dd',`${fmt(frame.tropicalLongitudeDegrees)}° · ${frame.tropicalSign}`),node('dt','Subtract offset'),node('dd',`${fmt(frame.ayanamshaDegrees,8)}°`),node('dt','Sidereal'),node('dd',`${fmt(frame.siderealLongitudeDegrees)}° · ${frame.siderealSign}`),node('dt','Circular residual'),node('dd',`${fmt(frame.circularResidualDegrees,10)}°`));article.append(values);frames.append(article);
    }
    container.append(frames,node('p','Sidereal longitude = normalize(tropical longitude − chosen ayanāṁśa). A zero residual is an internal identity, not a second astronomical measurement.','ce-note'));
    const precision=details('precision','Inspect frame precision and source');precision.append(node('p',report.displayPrecisionNote),node('p','Linear Lahiri is the named approximation used here, not exact JHora equivalence.'),references(['CE-ASTRONOMY','CE-AYANAMSHA'],report));container.append(precision);
    container.append(node('p',`Shared elongation: ${fmt(report.sharedLunarGeometry.elongationDegrees)}°. Phase, tithi and karaṇa partition this one angle; counting them as three agreeing observations would count the same input repeatedly.`,'ce-key-insight'),map(report));
    const formulas=details('formulas','Inspect the five lunar formulas');formulas.append(node('p',report.lunarBoundaryPrecisionNote,'ce-note'));
    for(const q of report.quantities){const part=details(`quantity-${q.id}`,`${q.label} · ${q.value}`);part.append(node('p',q.input),node('p',q.formula,'ce-formula'),node('p',`Angle: ${fmt(q.angleDegrees,8)}°. ${bandText(q)}`),node('p',q.distinction),references(q.sourceIds,report));if(q.matchesCanonical===false)part.append(node('p','The partition check differs from the canonical displayed index; inspect numerical boundary precision before interpreting it.','ce-error'));formulas.append(part);}
    container.append(formulas);
    const boundaries=details('boundaries','Compare day boundaries and observer dependence');
    for(const row of report.boundaries){const section=node('section',null,'ce-boundary');section.append(node('h4',row.label),node('p',`${row.status} · ${row.value}`,'ce-value'));const dl=node('dl');dl.append(node('dt','Uses'),node('dd',row.uses),node('dt','Boundary'),node('dd',row.boundary),node('dt','Scope'),node('dd',row.doesNotUse));section.append(dl,references(row.sourceIds,report));boundaries.append(section);}container.append(boundaries);
    const books=details('books','Compare what the source texts actually ask');
    for(const difference of report.sourceDifferences){const article=node('article',null,'ce-source-difference');article.append(node('h4',difference.title),node('p',difference.text),references(difference.sourceIds,report));books.append(article);}container.append(books);
    const sources=details('sources','Sources, reading depth and limits');
    for(const source of report.sources){const article=node('article',null,'ce-source');const a=node('a',source.title),url=sourceURL(source.url);if(url)a.href=url;article.append(a,node('p',source.section),node('p',source.edition,'ce-note'),node('p',source.readingStatus,'ce-note'));sources.append(article);}
    const limits=node('ul');report.limitations.forEach(limit=>limits.append(node('li',limit)));sources.append(limits);container.append(sources);
    if(preserve){
      for(const detail of container.querySelectorAll('details[data-ce-key]'))detail.open=opened.has(detail.dataset.ceKey);
      if(focused&&focusKey){
        const section=[...container.querySelectorAll('details[data-ce-key]')].find(el=>el.dataset.ceKey===focusKey);
        const target=focusTag==='SUMMARY'?section?.querySelector(':scope > summary'):focusTag==='A'?[...section?.querySelectorAll('a[href]')||[]].find(el=>el.getAttribute('href')===focusHref):null;
        target?.focus({preventScroll:true});
      }
    }
    return report;
  }
  function destroy(){if(!active)return;active=false;key=null;container.replaceChildren();}
  update(initialInput);return{update,destroy};
}
