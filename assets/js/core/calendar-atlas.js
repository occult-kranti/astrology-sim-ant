// Bounded atlas of named methods. All numerical work stays in the existing
// canonical engines; a catalogue entry is not a claim that it is implemented.
import { compareMoment } from './calendar-observatory.js';
import { houses, houseOf } from './astro.js';
import { easter, formatCivil } from './cultural-calendars.js';
import { SearchSunLongitude, SunPosition } from '../lib/astronomy.js';

export const CALENDAR_ATLAS_VERSION = 1;
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

export const ATLAS_SOURCES = freeze([
  { id:'ATLAS-METHODS',title:'Calendar atlas methods and actual source-reading record',url:'docs/2026-10-atlas-methods.md',author:'Project calendar-method reviewer',edition:'October 2026 atlas pass',section:'Implemented variants, source differences and validation boundaries',readingDepth:'Canonical code and named selected sources inspected; no whole-book or human tradition certification.' },
  { id:'ATLAS-UCL',title:'The Egyptian–Coptic calendar',url:'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/calendar.html',author:'University College London, Digital Egypt for Universities',edition:'2003 web exhibit',section:'Opening paragraph, month table and epagomenal/intercalary-day notes',readingDepth:'Full short calendar page read in atlas Round 1; its listed Beckerath/Cody books were not read.',sha256:'2f3e15f5fa0a9c64cadffe2d9d685add58cfb33c78795092a53c1407f5bdc325' },
  { id:'ATLAS-BRITANNICA',title:'Egyptian calendar',url:'https://www.britannica.com/science/Egyptian-calendar',author:'The Editors of Encyclopaedia Britannica',edition:'Web article accessed 2026-10-29; updated by Teagan Wolter',section:'Civil calendar structure and lunar-calendar distinction',readingDepth:'Selected article paragraphs read. Its compressed reform chronology differs from UCL’s Egypt-specific account; no reform date or ancient conversion epoch is encoded.',sha256:'a6f11dfecdd356f08dcadb3da8f828b63e975100da4034cac1474565273ca7c8' },
  { id:'ATLAS-HKO',title:'The Chinese Agricultural Calendar (Nongli)',url:'https://www.hko.gov.hk/en/gts/time/calendarinfo.htm',author:'Hong Kong Observatory',edition:'Current web explanation accessed 2026-10-29',section:'Lunar, solar and integrated lunisolar calendars; new moons and leap months',readingDepth:'Explanatory paragraphs read anew for this atlas. Does not establish BaZi, regional equivalence or predictive validity.',sha256:'9e5e3fd0e2a9c579c925390ec9fd15f552f476103673be2bf8ae1382db9476cb' },
  { id:'ATLAS-HEBCAL',title:'HDate API documentation',url:'https://hebcal.github.io/api/hdate/classes/HDate.html',author:'Hebcal developers',edition:'Current generated API reference accessed 2026-10-29',section:'HDate class and constructor; conversion of a Gregorian Date into Hebrew date fields',readingDepth:'Selected constructor/conversion documentation read; no Kabbalistic text, sunset computation or religious authority inferred.',sha256:'3354f60e8f34fa4098811d9b01d947368dcf03ff7e0f440768fb56f2f61ec880' },
  { id:'ATLAS-HOUSES',title:'Existing named house algorithms',url:'assets/js/core/astro.js',author:'Project astronomical engine',edition:'Canonical implementation',section:'houses() and houseOf(): Regiomontanus, Placidus, whole-sign and equal houses',readingDepth:'Functions inspected. Existing selected numerical fixtures are inherited; no new broad-range ephemeris validation.' },
  { id:'ATLAS-COMPUTUS',title:'Existing Gregorian and Julian computus',url:'docs/2026-10-calendar-methods.md',author:'Project calendar-method ledger',edition:'Inherited source and selected-fixture record',section:'Easter methods and selected USNO examples',readingDepth:'Code and inherited fixtures inspected; fresh USNO requests returned HTTP 503. Not a claim that every Christian church follows the selected computus.' },
  { id:'ATLAS-SOLAR-TERMS',title:'The 24 Solar Terms',url:'https://www.hko.gov.hk/en/gts/time/24solarterms.htm',author:'Hong Kong Observatory',edition:'Web explanation accessed 2026-10-29',section:'Table 1: 24 English term names, 15° ecliptic longitude steps and major/minor columns',readingDepth:'Table 1 and the surrounding angular definition read in atlas Round 2. The leap-month summary and zodiac discussion are not new implemented calendar rules.',sha256:'2bf78b365fd8e53ae52c36560fc7d46114fe4a6403861824ecd1ef54b234e62f' },
  { id:'ATLAS-CWA-2026',title:'2026 calendar data / 中華民國115年日曆資料表',url:'https://www.cwa.gov.tw/Data/astronomy/2026cal.pdf',author:'Taiwan Central Weather Administration',edition:'2026 data, published February 2025',section:'Page 2, 一、節氣: all 24 solar terms; Taiwan time UTC+8',readingDepth:'All 24 2026 minute-resolution term rows transcribed and rendered page visually inspected. Selected-year fixtures only; no full-range accuracy claim.',sha256:'88a8ab2a59e7ca51835820ab7b56a71b816299972ba8a970a4cb164ac56a043b' },
  { id:'ATLAS-HKO-2026',title:'Gregorian–Lunar Calendar Conversion Table of 2026',url:'https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2026e.pdf',author:'Hong Kong Observatory',edition:'2026 English table',section:'Solar Terms column, January–December',readingDepth:'All 24 solar-term date entries read; day-level independent issuing-authority comparison against CWA minute rows.',sha256:'f74b6da727e8025896b8c370f45a9f9da935aa48604680381bd5cf22bb525224' },
]);

const definitions = [
  ['western','Western & Christian','Tropical study charts, civil dates and Christian computus are distinct methods, not one combined prediction.',['gregory','julian','western-regiomontanus','western-placidus','western-whole','western-equal','easter-gregorian','easter-julian','planetary-hours']],
  ['vedic','Indian & Jyotiṣa','Separate the national Saka solar date, a sidereal solar position, lunar partitions and the sunrise weekday.',['indian','vedic-solar','vedic-lunar','vedic-vara','vedic-regional']],
  ['egyptian','Egyptian & Coptic','The calculated Coptic civil date is not an ancient Egyptian wandering-year or lunar reconstruction.',['coptic','egyptian-ancient-civil','egyptian-lunar']],
  ['jewish','Jewish & Kabbalah','A Hebrew civil conversion, a religious sunset day and a Kabbalistic textual interpretation require different rules.',['hebrew','hebrew-sunset','jewish-kabbalah']],
  ['chinese','Chinese','Compare the lunisolar civil date with 24 solar-term events; neither automatically calculates Four Pillars.',['chinese','chinese-bazi','chinese-solar-terms']],
  ['islamic','Islamic','Tabular, Umm al-Qura, observed-crescent and prayer-timetable methods have different inputs and authority.',['islamic-civil','islamic-umalqura','prayer-timetable','islamic-observed-crescent']],
  ['civil','Further civil calendars','Named runtime calendars and era systems, with their existing validation limits.',['buddhist','persian','ethiopic','japanese','roc']],
];
export const ATLAS_FAMILIES = freeze(definitions.map(([id,label,description,variantIds])=>({id,label,description,variantIds})));
const familyFor = id => ATLAS_FAMILIES.find(family=>family.variantIds.includes(id)).id;
const civilLabels = {gregory:'Gregorian civil date',julian:'Julian civil date',hebrew:'Hebrew civil date','islamic-civil':'Islamic tabular civil date','islamic-umalqura':'Umm al-Qura civil date',chinese:'Chinese lunisolar civil date',buddhist:'Thai Buddhist civil era',indian:'Indian national Saka solar date',persian:'Persian civil date',coptic:'Coptic civil date',ethiopic:'Ethiopic civil date',japanese:'Japanese era civil date',roc:'ROC / Minguo civil date'};
const variant = (id,label,kind,method,description,sourceIds,extra={})=>({id,familyId:familyFor(id),label,kind,method,description,sourceIds,validation:'Inherited implementation and selected fixtures only; no new full-range or predictive validation.',limitations:[],boundary:'explicit-instant',implementation:'implemented',...extra});
const unavailable = (id,label,description,sourceIds,reason)=>variant(id,label,'unavailable-implementation','No numerical implementation in this atlas',description,sourceIds,{implementation:'unavailable',boundary:'not-calculated',validation:'Unavailable: no source-anchored calculator and fixture set selected.',reason,limitations:[reason]});
const civilVariants = Object.entries(civilLabels).map(([id,label])=>variant(id,label,'calculated-civil','Canonical selected-zone civil conversion',id==='coptic'?'Runtime Coptic convention; ancient Egyptian calendar dates and liturgical feasts are separate.':id==='hebrew'?'Civil midnight display; religious sunset dates and Kabbalistic readings are separate.':id==='chinese'?'Named lunisolar conversion with related year and leap-month labels; not BaZi.':id==='indian'?'National solar civil calendar; not a regional Hindu lunisolar calendar.':'Named calendar or era convention, not an outcome forecast.',['OBS-CALENDAR',...(id==='coptic'?['ATLAS-UCL','ATLAS-BRITANNICA']:id==='hebrew'?['ATLAS-HEBCAL']:id==='chinese'?['ATLAS-HKO']:[])],{calendarId:id,boundary:'civil-midnight',validation:'Use the returned canonical row’s existing selected-fixture or pending status.'}));
const houseVariants = [['regiomontanus','Regiomontanus'],['placidus','Placidus'],['whole','Whole-sign'],['equal','Equal']].map(([system,label])=>variant('western-'+system,label+' tropical houses','calculated-chart',label+' houses from the canonical houses() engine','Compare house placements for the same geocentric planetary positions; a moment chart is not a natal or horary judgment.',['ATLAS-HOUSES','OBS-ASTRONOMY','OBS-WESTERN'],{houseSystem:system,limitations:['No birth or horary question is inferred. Requested and actual systems remain distinct if the engine falls back.']}));
const extraVariants = [
  ...['gregorian','julian'].map(method=>variant('easter-'+method,(method==='gregorian'?'Gregorian':'Julian')+' Easter computus','calculated-convention','Existing '+method+' ecclesiastical computus for the observer civil year','An ecclesiastical calendar rule, not an observed Moon or a Lilly chart judgment.',['ATLAS-COMPUTUS'],{computus:method,boundary:'observer-civil-year',limitations:['This is a named computus, not an assertion that all Western or Eastern churches use it.']})),
  variant('planetary-hours','Temporal planetary hour','traditional-rule','Canonical twelve daylight / twelve night divisions','Sunrise-bounded planetary day and current temporal hour.',['OBS-HOURS','OBS-ASTRONOMY'],{boundary:'sunrise-to-next-sunrise'}),
  variant('vedic-solar','Sidereal solar position','calculated-chart','Canonical tropical Sun minus the linear Lahiri estimate','A solar position and sign, not a complete regional solar calendar date.',['OBS-VEDIC','OBS-ASTRONOMY'],{limitations:['Linear Lahiri approximation; not exact JHora equivalence or a solar-month ingress search.']}),
  variant('vedic-lunar','Lunar Pañcāṅga elements','calculated-partitions','Canonical instantaneous tithi, karaṇa, nakṣatra and nitya yoga','Distinct angle partitions using the same Sun and Moon, without combining them into an agreement score.',['OBS-VEDIC','OBS-ASTRONOMY'],{limitations:['No exact limb end times, regional lunar month, festival policy or predictive validation. Floating-point boundary behavior is inherited.']}),
  variant('vedic-vara','Sunrise-bounded vāra','calculated-convention','Canonical selected-zone sunrise weekday','Before sunrise, this can differ from the civil weekday.',['OBS-VEDIC','OBS-CALENDAR'],{boundary:'local-sunrise'}),
  variant('prayer-timetable','Selected prayer timetable','calculated-schedule','Canonical Adhan calculation with explicit method, Asr and high-latitude rules','Retains partial/unavailable solar events and the observer civil date.',['OBS-ADHAN','OBS-CALENDAR'],{boundary:'selected-local-civil-date'}),
  variant('chinese-solar-terms','Twenty-four solar-term events','calculated-events','Vendored SearchSunLongitude: apparent geocentric tropical longitude at 15° intervals','HKO term names and angles; annual event list in a named Hong Kong reference year, with UTC and observer-zone times.',['ATLAS-SOLAR-TERMS','ATLAS-CWA-2026','ATLAS-HKO-2026','OBS-ASTRONOMY'],{boundary:'astronomical-event',validation:'All 24 selected 2026 CWA minute fixtures agree within two minutes; HKO day-level dates also checked. Not full-range validation.',limitations:['Solver milliseconds do not imply millisecond physical accuracy. No BaZi pillars, lunar-month assignment or regional observance is inferred.']}),
  unavailable('vedic-regional','Regional lunar months & festivals','Amānta/pūrṇimānta, regional solar/lunar months and festival rules require named regional conventions.',['OBS-VEDIC','ATLAS-METHODS'],'No regional month model, local festival authority or independent fixture set is selected; the national Saka date is not a substitute.'),
  unavailable('egyptian-ancient-civil','Ancient Egyptian civil reconstruction','UCL and Britannica describe a 365-day ancient civil structure, distinct from Coptic intercalation.',['ATLAS-UCL','ATLAS-BRITANNICA'],'No ancient conversion epoch/era and independent anchor pair is selected. The current Coptic date cannot be relabelled as an ancient Egyptian date.'),
  unavailable('egyptian-lunar','Ancient Egyptian lunar reconstruction','Historical lunar reckoning is distinct from the ancient civil year and the Coptic calendar.',['ATLAS-BRITANNICA','ATLAS-UCL'],'A named historical reconstruction, observation convention and independently anchored date fixtures are not implemented.'),
  unavailable('hebrew-sunset','Hebrew religious sunset day','A midnight civil conversion does not establish a local religious date or observance.',['OBS-CALENDAR','ATLAS-HEBCAL'],'A religious sunset-day date, community observance policy and Israel/diaspora decisions are not calculated here.'),
  unavailable('jewish-kabbalah','Kabbalistic textual interpretation','Hebrew calendar fields do not automatically supply a Kabbalistic reading.',['ATLAS-METHODS'],'No selected text edition, interpretive rule set or authenticated reading is generated. Existing letter-study tools remain separate.'),
  unavailable('chinese-bazi','Four Pillars / BaZi','A Chinese lunisolar civil date does not automatically calculate Four Pillars.',['ATLAS-HKO','ATLAS-METHODS'],'No Four Pillars epoch, solar-term boundary, day/hour convention or verified implementation is selected.'),
  unavailable('islamic-observed-crescent','Observed-crescent religious date','Tabular and Umm al-Qura outputs do not prove local crescent observation.',['OBS-CALENDAR','ATLAS-METHODS'],'No observation report, local religious-authority decision or crescent-visibility model is supplied.'),
];
const byId = new Map([...civilVariants,...houseVariants,...extraVariants].map(item=>[item.id,item]));
export const ATLAS_VARIANTS = freeze(ATLAS_FAMILIES.flatMap(family=>family.variantIds.map(id=>byId.get(id))));

// English names/angles and major/minor distinction: HKO Table 1. Chinese names:
// CWA 2026 term table. These event definitions do not implement BaZi or months.
const SOLAR_TERMS = freeze([
  ['Vernal Equinox','春分'],['Bright and Clear','清明'],['Corn Rain','穀雨'],['Summer Commences','立夏'],
  ['Corn Forms','小滿'],['Corn on Ear','芒種'],['Summer Solstice','夏至'],['Moderate Heat','小暑'],
  ['Great Heat','大暑'],['Autumn Commences','立秋'],['End of Heat','處暑'],['White Dew','白露'],
  ['Autumnal Equinox','秋分'],['Cold Dew','寒露'],['Frost','霜降'],['Winter Commences','立冬'],
  ['Light Snow','小雪'],['Heavy Snow','大雪'],['Winter Solstice','冬至'],['Moderate Cold','小寒'],
  ['Severe Cold','大寒'],['Spring Commences','立春'],['Spring Showers','雨水'],['Insects Waken','驚蟄'],
].map(([name,chineseName],index)=>({name,chineseName,longitudeDegrees:index*15,kind:index%2?'minor':'major'})));

function solarTermEvents(context) {
  const referenceTimeZone='Asia/Hong_Kong',selected=new Date(context.dateISO);
  const formatter=zone=>new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const reference=formatter(referenceTimeZone),observer=formatter(context.timeZone);
  const fields=(date,fmt)=>{const p=Object.fromEntries(fmt.formatToParts(date).map(part=>[part.type,part.value]));return {date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}:${p.second}`};};
  const referenceYear=Number(fields(selected,reference).date.slice(0,4));
  if(referenceYear<1900||referenceYear>2100)throw new RangeError('The Hong Kong reference year is outside the supported 1900–2100 event list.');
  const event=(term,date)=>{
    const ref=fields(date,reference),local=fields(date,observer);
    return {...term,instantUTC:date.toISOString(),referenceDate:ref.date,referenceTime:ref.time,observerDate:local.date,observerTime:local.time};
  };
  let start=new Date(Date.UTC(referenceYear,0,1)),angle=(Math.ceil(SunPosition(start).elon/15)*15)%360;
  const events=[];
  for(let index=0;index<24;index++){
    const found=SearchSunLongitude(angle,start,20);
    if(!found||found.date.getUTCFullYear()!==referenceYear)throw new RangeError('A complete annual solar-term sequence could not be established.');
    events.push(event(SOLAR_TERMS[angle/15],found.date));
    start=new Date(found.date.getTime()+1000);angle=(angle+15)%360;
  }
  let nextEvent=events.find(item=>new Date(item.instantUTC)>selected)||null;
  if(!nextEvent){
    // Only the next event beyond this annual list is needed; never expose 2101.
    const found=SearchSunLongitude(angle,new Date(selected.getTime()+1),20);
    if(found&&found.date>selected&&found.date.getUTCFullYear()<=2100)nextEvent=event(SOLAR_TERMS[angle/15],found.date);
  }
  return {referenceYear,referenceTimeZone,observerTimeZone:context.timeZone,events,nextEvent,nextStatus:nextEvent?'available':'unavailable',nextReason:nextEvent?null:'No later term is available within the supported UTC range.',method:'Twenty-four fixed apparent geocentric tropical-longitude events; year named in Hong Kong civil time, same instants shown in the observer zone.',precisionNote:'Numerical event search. Selected 2026 published minute-resolution fixtures agree within two minutes; stored solver milliseconds are not an observational accuracy claim. Historical Asia/Hong_Kong clock offsets follow runtime time-zone data; the selected 2026 reference fixtures use UTC+8.'};
}

function selection(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Atlas options must be an object.');
  if (Object.keys(options).some(key=>!['familyIds','variantIds'].includes(key))) throw new RangeError('Unknown atlas selection option.');
  const check = (key,allowed) => {
    if (options[key] === undefined) return null;
    const ids=options[key];
    if (!Array.isArray(ids) || !ids.length || ids.length>allowed.length || ids.some(id=>typeof id!=='string'||!allowed.includes(id)) || new Set(ids).size!==ids.length) throw new RangeError('Choose a nonempty, unique list of known '+key+'.');
    return new Set(ids);
  };
  const families=check('familyIds',ATLAS_FAMILIES.map(f=>f.id)),variants=check('variantIds',ATLAS_VARIANTS.map(v=>v.id));
  const selected=ATLAS_VARIANTS.filter(v=>(!families||families.has(v.familyId))&&(!variants||variants.has(v.id)));
  if(!selected.length)throw new RangeError('The family and variant selections have no methods in common.');
  return selected;
}

/** Exact input -> fresh canonical comparison. Family and variant filters
 * intersect; omitted filters mean all. Never trust supplied calculated rows.
 */
export function buildCalendarAtlas(input, options={}) {
  const selected=selection(options), comparison=compareMoment(input),context=clone(comparison.context),date=new Date(context.dateISO);
  const rows=selected.map(metadata=>{
    const row={...clone(metadata),status:'available',result:null,summary:''};
    if(metadata.implementation==='unavailable')return {...row,status:'unavailable',summary:metadata.reason};
    if(metadata.calendarId){
      const civil=comparison.calendars.find(c=>c.id===metadata.calendarId);
      return {...row,status:civil.status,result:clone(civil),summary:civil.text,method:civil.method,boundary:civil.boundary,validation:civil.validation,sourceIds:[...new Set([...row.sourceIds,...civil.sourceIds])],limitations:[...row.limitations,...civil.limitations]};
    }
    if(metadata.houseSystem){
      const h=houses(date,context.lat,context.lon,metadata.houseSystem),fallback=h.system!==metadata.houseSystem;
      return {...row,status:fallback?'partial':'available',summary:fallback?`${metadata.label} unavailable here; engine returned ${h.system} cusps.`:`${metadata.label}; ascendant ${h.asc.toFixed(2)}°; twelve cusps.`,result:{requestedSystem:metadata.houseSystem,actualSystem:h.system,cusps:h.cusps.slice(1),ascendant:h.asc,midheaven:h.mc,placements:comparison.western.planets.map(p=>({id:p.id,longitude:p.longitude,house:houseOf(p.longitude,h.cusps)})),warning:h.houseWarning||null},limitations:[...row.limitations,...(h.houseWarning?[h.houseWarning]:[])]};
    }
    if(metadata.computus){
      const year=Number(context.localDate.slice(0,4)),result=easter(year,metadata.computus);
      return {...row,summary:`${formatCivil(result.native)} (${metadata.computus}); Gregorian ${formatCivil(result.gregorian)}.`,result:{year,method:metadata.computus,nativeDate:formatCivil(result.native),gregorianDate:formatCivil(result.gregorian)},validation:'Inherited selected USNO computus examples; not a new whole-range or community-observance validation.'};
    }
    if(metadata.id==='planetary-hours')return {...row,status:comparison.planetaryHours.status,result:clone(comparison.planetaryHours),summary:comparison.planetaryHours.ruler?`${comparison.planetaryHours.ruler} · hour ${comparison.planetaryHours.hourNumber} · day ${comparison.planetaryHours.dayRuler}`:comparison.planetaryHours.reason,limitations:[...row.limitations,...comparison.planetaryHours.limitations]};
    if(metadata.id==='vedic-solar')return {...row,result:{sun:clone(comparison.vedic.sun),ayanamsha:clone(comparison.vedic.ayanamsha)},summary:`${comparison.vedic.sun.sign} · ${comparison.vedic.sun.degree.toFixed(2)}° within sign; linear Lahiri estimate.`};
    if(metadata.id==='vedic-lunar'){
      const p=comparison.vedic.panchanga;
      return {...row,result:{moon:clone(comparison.vedic.moon),tithi:clone(p.tithi),karana:clone(p.karana),nakshatra:clone(p.nakshatra),yoga:clone(p.yoga)},summary:`Tithi ${p.tithi.num} · ${p.tithi.name}; nakṣatra ${p.nakshatra.name}; yoga ${p.yoga.name}; karaṇa ${p.karana.name}.`};
    }
    if(metadata.id==='vedic-vara'){
      const v=comparison.vedic.panchanga.vara;
      return {...row,status:v.lord?'available':'unavailable',result:clone(v),summary:v.lord?`${v.name} · ${v.lord}; civil ${context.localWeekday}.`:v.method};
    }
    if(metadata.id==='prayer-timetable')return {...row,status:comparison.prayer.status,result:clone(comparison.prayer),summary:`${comparison.prayer.method} · ${comparison.prayer.status} · ${context.localDate}`,limitations:[...row.limitations,...comparison.prayer.limitations]};
    if(metadata.id==='chinese-solar-terms'){
      try{const result=solarTermEvents(context);return {...row,status:result.nextEvent?'available':'partial',result,summary:`${result.referenceYear}: 24 solar terms in ${result.referenceTimeZone}. ${result.nextEvent?`Next: ${result.nextEvent.name} · ${result.nextEvent.instantUTC}`:result.nextReason}`};}
      catch(error){return {...row,status:'unavailable',summary:error.message,reason:error.message};}
    }
    throw new Error('Atlas variant has no dispatch: '+metadata.id);
  });
  const families=ATLAS_FAMILIES.filter(f=>rows.some(r=>r.familyId===f.id)).map(f=>({...clone(f),variantIds:rows.filter(r=>r.familyId===f.id).map(r=>r.id),rows:rows.filter(r=>r.familyId===f.id)}));
  return {schemaVersion:CALENDAR_ATLAS_VERSION,context,comparison,families,rows,methods:clone(selected),sources:[...clone(comparison.sources).map(source=>({...source,readingDepth:'Inherited source record from the canonical comparison; see its linked ledger for actual reading/fixture scope.'})),...clone(ATLAS_SOURCES)],selection:{familyIds:families.map(f=>f.id),variantIds:rows.map(r=>r.id)},limitations:[...comparison.limitations,'This atlas is a bounded catalogue of named variants, not every calendar or all variations of a tradition. Unavailable entries do not fabricate results.','A current-moment chart, a birth chart, a horary question and ecclesiastical computus are different tasks. No birth details or question are inferred.','Shared astronomical inputs are dependencies, not independent confirmations. No consensus score combines unlike dates, charts, prayers or symbolic classifications.','Source-reading depth and fixture status remain explicit. Selected passages are not full-book readings or human tradition certification.']};
}

/** Public selected-method export: omit the internal full comparison. Recompute
 * first, retain only declared shared plate geometry and selected result blocks.
 */
export function exportCalendarAtlas(input,options={}) {
  const {comparison,...atlas}=buildCalendarAtlas(input,options),sourceIds=new Set(['ATLAS-METHODS','OBS-ASTRONOMY']);
  const collect=value=>{if(!value||typeof value!=='object')return;if(Array.isArray(value.sourceIds))value.sourceIds.forEach(id=>sourceIds.add(id));Object.values(value).forEach(collect);};
  collect(atlas.rows);collect(atlas.methods);
  const a=comparison.astronomy;
  return {...atlas,kind:'calendar-atlas-selected-methods',sources:atlas.sources.filter(source=>sourceIds.has(source.id)),sharedAstronomy:{sunLongitude:a.sunLongitude,moonLongitude:a.moonLongitude,moonSunElongation:a.moonSunElongation,moonIlluminatedFraction:a.moonIlluminatedFraction,phaseLabel:a.phaseLabel,sourceIds:['OBS-ASTRONOMY'],scope:'Shared astronomical quantities for the plate; not additional selected tradition readings.'}};
}
