// Date-only observance labels, never a forecast or an exact ritual start time.
// Reuses canonical calendar rows and computus. No clock, storage or network.
import { easter, parseCivil, validateLocation, validateZone } from './cultural-calendars.js';
import { gregorianToJDN, jdnToJulian } from './calendar.js';
import { HORIZON_OBSERVANCE_SOURCES, HORIZON_OBSERVANCE_COVERAGE, HKO_OBSERVANCE_DATES, BAHAI_PUBLISHED_YEARS, REGIONAL_OBSERVANCE_DATES } from './data/horizon-observances.js';
export { HORIZON_OBSERVANCE_SOURCES, HORIZON_OBSERVANCE_COVERAGE };

export const HORIZON_OBSERVANCE_LIMITS = Object.freeze({ startDate:'2026-01-01', endDate:'2031-01-01', maxRowsPerDate:48, maxCalendars:13 });
const DAY=86400000, clone=value=>JSON.parse(JSON.stringify(value));
const IDS=['gregory','julian','hebrew','islamic-civil','islamic-umalqura','chinese','buddhist','indian','persian','coptic','ethiopic','japanese','roc'];
const HEBREW_MONTHS=['Tishri','Heshvan','Kislev','Tevet','Shevat','Adar','Adar I','Adar II','Nisan','Iyar','Sivan','Tamuz','Av','Elul'];
const ISLAMIC_MONTHS=['Muharram','Safar','Rabiʻ I','Rabiʻ II','Jumada I','Jumada II','Rajab','Shaʻban','Ramadan','Shawwal','Dhuʻl-Qiʻdah','Dhuʻl-Hijjah'];
const CHINESE_MONTHS=['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth'];
const BOUNDARIES={
  civil:'Selected civil date; no religious ceremony time or full-day verdict is inferred.',
  jewish:'Daytime date of an observance beginning at the previous local sunset and ending at nightfall; exact local times are not calculated.',
  islamic:'Religious date begins at the previous local sunset; exact start, crescent visibility and local authority decisions are not calculated.',
  bahai:'Sunset on the preceding civil date through sunset on this date; exact local sunset is not calculated.',
};
const atDate=date=>Date.parse(date+'T12:00:00Z');
const shift=(date,days)=>new Date(atDate(date)+days*DAY).toISOString().slice(0,10);
const format=({y,m,d})=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const text=(value,max,label)=>{if(typeof value!=='string'||value.length>max)throw new TypeError(`${label} must be bounded text.`);return value;};

function normalize({date,calendars,observer}={}) {
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new TypeError('Supply a Gregorian date as YYYY-MM-DD.');
  parseCivil(date);
  if(date<HORIZON_OBSERVANCE_LIMITS.startDate||date>HORIZON_OBSERVANCE_LIMITS.endDate)throw new RangeError('Observance coverage is bounded to 2026-01-01 through 2031-01-01 inclusive.');
  if(!observer||typeof observer!=='object'||Array.isArray(observer))throw new TypeError('Supply the selected observer and IANA zone.');
  validateLocation(observer.lat,observer.lon);validateZone(observer.timeZone);
  if(!Array.isArray(calendars)||calendars.length<1||calendars.length>13)throw new RangeError('Supply up to thirteen canonical calendar rows.');
  const seen=new Set(),rows=new Map();
  for(const row of calendars){
    if(!row||!IDS.includes(row.id)||seen.has(row.id))throw new RangeError('Calendar rows must have distinct supported identities.');
    seen.add(row.id);
    if(!['available','unavailable'].includes(row.status)||!Array.isArray(row.parts)||row.parts.length>32)throw new TypeError('Invalid canonical calendar status or parts.');
    const parts={};
    for(const part of row.parts){
      if(!part||typeof part.type!=='string')throw new TypeError('Invalid calendar part.');
      if(['month','day','year','relatedYear','yearName','era'].includes(part.type)){
        if(Object.hasOwn(parts,part.type))throw new TypeError('Repeated calendar field.');
        parts[part.type]=text(part.value,120,'Calendar field');
      }
    }
    rows.set(row.id,{id:row.id,status:row.status,text:text(row.text??'',240,'Calendar label'),parts});
  }
  const g=rows.get('gregory');
  if(!g)throw new RangeError('Include the canonical Gregorian row, even when its sampled clock is unavailable.');
  if(g.status==='available'&&format({y:+g.parts.year,m:+g.parts.month,d:+g.parts.day})!==date)throw new RangeError('The canonical Gregorian row must match the explicitly selected civil date.');
  return {date,year:+date.slice(0,4),rows};
}

function make(date,key,title,familyId,variantId,sourceIds,options={}) {
  const boundaryKind=options.boundaryKind??'civil';
  return {id:`hobs-${familyId}-${variantId}-${key}-${date}`,date,title,familyId,variantId,
    sourceIds:[...sourceIds],precision:'date-only',status:'calculated-rule',region:'Named convention; community applicability must be checked',
    boundary:BOUNDARIES[boundaryKind],boundaryKind,exactStartUTC:null,exactEndUTC:null,
    ...(boundaryKind!=='civil'?{beginsOnPreviousCivilDate:shift(date,-1)}:{}),
    method:'Selected named date convention; not a prediction',limitations:['Date-only labels do not supply exact event times or cultural authority.'],...options};
}

const paschalCache=new Map();
function christian(date,year) {
  if(!paschalCache.has(year))paschalCache.set(year,Object.fromEntries(['gregorian','julian'].map(method=>[method,format(easter(year,method).gregorian)])));
  const rows=[],starts=paschalCache.get(year);
  const offsets=[[-7,'palm-sunday','Palm Sunday'],[-2,'good-friday','Good Friday'],[0,'easter','Easter / Pascha'],[39,'ascension-thursday','Ascension — Thursday convention'],[49,'pentecost','Pentecost']];
  for(const method of ['gregorian','julian'])for(const [offset,key,title] of offsets)if(date===shift(starts[method],offset))rows.push(make(date,key,title,'christian',`${method}-computus`,method==='gregorian'?['HOBS-OCA','HOBS-USCCB-2027','HOBS-USCCB-2028']:['HOBS-OCA'],{calendarId:method==='gregorian'?'gregory':'julian',method:`Canonical ${method} ecclesiastical computus; ${offset>=0?'+':''}${offset} civil days from Easter. Not an observed-Moon algorithm.`,region:method==='gregorian'?'Selected Western Gregorian computus':'Selected Eastern Julian Paschal convention',limitations:['Local liturgical hours, full feast calendar and transferred observances are not inferred.','Fixed-date and Paschal conventions are separate choices; not all Eastern churches use Julian fixed feasts.']}));
  if(date===shift(starts.gregorian,42))rows.push(make(date,'ascension-sunday','Ascension — Sunday-transfer convention','christian','western-sunday-transfer',['HOBS-USCCB-2027'],{method:'Gregorian Easter +42 civil days; explicit Sunday-transfer variant.',region:'Communities following the Sunday-transfer convention; USCCB 2027 names the US jurisdiction split',limitations:['Do not infer the reader’s ecclesiastical jurisdiction from coordinates. Future local policy changes are not monitored.']}));
  return rows;
}

function fixedChristian(date,rows) {
  const result=[],civil=parseCivil(date),julian=jdnToJulian(gregorianToJDN(civil.y,civil.m,civil.d));
  for(const [calendarId,variant] of [['gregory','gregorian-fixed'],['julian','julian-fixed']]){
    const row=rows.get(calendarId),fallback=calendarId==='gregory'?civil:julian;
    const md=row?.status==='available'?`${+row.parts.month}-${+row.parts.day}`:`${fallback.m}-${fallback.d}`,title=md==='12-25'?'Christmas / Nativity':md==='1-6'?'Epiphany / Theophany':null;
    if(title)result.push(make(date,md==='12-25'?'christmas':'epiphany',title,'christian',variant,[md==='12-25'?'HOBS-OCA-NATIVITY':'HOBS-OCA-THEOPHANY','HOBS-CIVIL'],{calendarId,method:`Selected ${calendarId==='julian'?'Julian':'Gregorian'} fixed month/day; no transfer to Sunday.`,region:calendarId==='julian'?'Churches retaining Julian fixed-date convention':'Communities retaining the Gregorian fixed date',limitations:['This is a named fixed-date convention, not every church’s calendar. Epiphany Sunday transfers and local service times are not calculated.']}));
  }
  return result;
}

function missing(date,calendarId,familyId,sourceIds,reason) {
  return make(date,calendarId,`${familyId} date-based observances unavailable`,familyId,'unresolved-calendar',sourceIds,{status:'unavailable',calendarId,method:'No date rule applied to unavailable or unrecognized calendar parts.',reason,limitations:[reason,'Missing calendar information is not evidence that no observance occurs.']});
}

function jewish(date,rows) {
  const row=rows.get('hebrew'),sources=['HOBS-HEBCAL','HOBS-CHABAD-2027','HOBS-HEBCAL-2027-DIASPORA','HOBS-HEBCAL-2027-ISRAEL'];
  if(row?.status!=='available'||!HEBREW_MONTHS.includes(row.parts.month)||!Number.isInteger(+row.parts.day)||+row.parts.day<1||+row.parts.day>30)return [missing(date,'hebrew','jewish',sources,'The supplied canonical Hebrew civil label is unavailable or unrecognized.')];
  const month=row.parts.month,day=+row.parts.day,result=[];
  const add=(key,title,variant='shared-fixed-date',region='Selected shared Hebrew fixed-date convention')=>result.push(make(date,key,title,'jewish',variant,sources,{calendarId:'hebrew',boundaryKind:'jewish',boundary:BOUNDARIES.jewish,beginsOnPreviousCivilDate:shift(date,-1),region,nativeDate:{month,day,year:row.parts.year},method:'Named Hebrew month/day rule applied to the canonical daytime civil label.',limitations:['The midnight-based civil row is not an exact sunset religious-date calculation.','Israel/Diaspora variants describe calendar traditions, not inferred personal or geographic affiliation.']}));
  if(month==='Tishri'&&day<=2)add('rosh-hashanah',`Rosh Hashanah · day ${day}`);
  if(month==='Tishri'&&day===10)add('yom-kippur','Yom Kippur');
  if(month==='Tishri'&&day>=15&&day<=21)add('sukkot',`Sukkot · day ${day-14}`);
  if(month==='Tishri'&&day===22){add('shemini-atzeret-simchat-torah','Shemini Atzeret / Simchat Torah','israel','Israel calendar convention');add('shemini-atzeret','Shemini Atzeret','diaspora','Diaspora calendar convention');}
  if(month==='Tishri'&&day===23)add('simchat-torah','Simchat Torah','diaspora','Diaspora calendar convention');
  if(month==='Kislev'&&day===25)add('hanukkah-start','Hanukkah · first daytime date');
  if(month==='Shevat'&&day===15)add('tu-bishvat','Tu BiShvat');
  if(['Adar','Adar II'].includes(month)&&day===14)add('purim','Purim · unwalled-city convention');
  if(month==='Nisan'&&day>=15&&day<=22){if(day<=21)add('pesach',`Pesach · day ${day-14}`,'israel','Israel calendar convention');add('pesach',`Pesach · day ${day-14}`,'diaspora','Diaspora calendar convention');}
  if(month==='Sivan'&&[6,7].includes(day)){if(day===6)add('shavuot','Shavuot','israel','Israel calendar convention');add('shavuot',`Shavuot · day ${day-5}`,'diaspora','Diaspora calendar convention');}
  return result;
}

const ISLAMIC_RULES=[['Ramadan',1,'ramadan-start','Ramadan begins'],['Shawwal',1,'eid-fitr','Eid al-Fitr'],['Dhuʻl-Hijjah',10,'eid-adha','Eid al-Adha'],['Muharram',1,'hijri-new-year','Islamic New Year'],['Muharram',10,'ashura','Ashura']];
function islamic(date,rows) {
  const result=[];
  for(const calendarId of ['islamic-civil','islamic-umalqura']){
    const row=rows.get(calendarId);
    if(row?.status!=='available'||!ISLAMIC_MONTHS.includes(row.parts.month)||!Number.isInteger(+row.parts.day)||+row.parts.day<1||+row.parts.day>30){result.push(missing(date,calendarId,'islamic',['HOBS-MUIS-2027','HOBS-CIVIL'],'The named Islamic calendar label is unavailable or unrecognized.'));continue;}
    for(const [month,day,key,title] of ISLAMIC_RULES)if(row.parts.month===month&&+row.parts.day===day)result.push(make(date,key,`${title} — ${calendarId} projection`,'islamic',calendarId,['HOBS-MUIS-2027','HOBS-CIVIL'],{calendarId,status:'projected-calendar',boundaryKind:'islamic',boundary:BOUNDARIES.islamic,beginsOnPreviousCivilDate:shift(date,-1),region:'Calendar-method projection; no community or jurisdiction selected',nativeDate:{month,day,year:row.parts.year},method:`Selected native month/day applied to ${calendarId}; no crescent-sighting determination.`,limitations:['Future local religious authority decisions can differ from either arithmetic or Umm al-Qura dates.','Start of Ramadan is a date label, not the dawn or sunset fasting timetable.','Named Islamic observances and practices differ among communities.']}));
  }
  return result;
}

function chineseComparison(row,published) {
  const name=row?.parts.month??'',month=CHINESE_MONTHS.findIndex(word=>name.startsWith(word+' Month'))+1,day=Number(row?.parts.day),leap=/bis|leap/i.test(name);
  const available=row?.status==='available'&&month>0&&Number.isInteger(day)&&day>=1&&day<=30;
  const matches=available&&month===published.month&&day===published.day&&leap===published.leap;
  return {calendarId:'chinese',status:!available?'unavailable':matches?'matches':'mismatch',published:{month:published.month,day:published.day,leap:published.leap,referenceTimeZone:'Asia/Hong_Kong'},runtime:available?{month,day,leap,text:row.text}:null,
    explanation:!available?'Official published date retained; canonical runtime Chinese label is unavailable.':matches?'The selected runtime label matches these published Hong Kong date fields; this does not validate every future date or other East Asian convention.':'Published Hong Kong date and the selected runtime Chinese civil label differ. Both are retained; no silent calendar repair or universal observance verdict is made.'};
}

function chinese(date,rows) {
  return HKO_OBSERVANCE_DATES.filter(record=>record.date===date).map(record=>make(date,record.key,record.title,'chinese','hong-kong-published-derived',[record.sourceId,'HOBS-GOVHK-2027'],{calendarId:'chinese',status:'published-derived-date',region:'Hong Kong calendar convention; not all East Asian communities',method:record.key==='ching-ming'?'HKO published Bright & Clear solar-term civil date.':'HKO published daily lunar table; selected ordinary-month festival rule; repeated intercalary month excluded.',calendarComparison:chineseComparison(rows.get('chinese'),record),limitations:['Published date is not the instant of a new moon, solar term, ceremony or festival start.','Runtime ICU/calendar data can differ between Node and browsers. Its original civil label remains unchanged.','GovHK 2027 is a selected rule/date cross-check, not an independent validation of every later source table.']}));
}

function publishedRegional(date,rows) {
  return REGIONAL_OBSERVANCE_DATES.filter(record=>record.date===date).map(record=>make(date,record.key,record.title,record.familyId,record.variantId,record.sourceIds,{status:'published-date',region:record.region,boundaryKind:record.familyId==='islamic'?'islamic':'civil',boundary:BOUNDARIES[record.familyId==='islamic'?'islamic':'civil'],...(record.familyId==='islamic'?{beginsOnPreviousCivilDate:shift(date,-1)}:{}),method:'Selected issuing-authority published date; no extrapolation into unpublished years.',...(record.native?{publishedNativeDate:clone(record.native)}:{}),...(record.familyId==='buddhist'&&record.native?{calendarComparison:chineseComparison(rows.get('chinese'),record.native)}:{}),limitations:['Regional published dates do not define the observance for every community or location.','Public holiday replacement days and religious start/end times are not inferred.']}));
}

function bahai(date) {
  const result=[],sources=['HOBS-BAHAI','HOBS-BAHAI-DATA','HOBS-BAHAI-UHJ'];
  const offsets=[[0,'naw-ruz','Naw-Rúz'],[31,'ridvan-first','Riḍván · first day'],[39,'ridvan-ninth','Riḍván · ninth day'],[42,'ridvan-twelfth','Riḍván · twelfth day'],[64,'declaration-bab','Declaration of the Báb'],[69,'ascension-bahaullah','Ascension of Bahá’u’lláh'],[111,'martyrdom-bab','Martyrdom of the Báb'],[250,'covenant','Day of the Covenant'],[252,'ascension-abdulbaha','Ascension of ‘Abdu’l-Bahá']];
  for(const year of BAHAI_PUBLISHED_YEARS){
    const records=offsets.map(([offset,key,title])=>({date:shift(year.nawRuz,offset),key,title}));
    records.push({date:year.birthOfBab,key:'birth-bab',title:'Birth of the Báb'},{date:year.birthOfBahaullah,key:'birth-bahaullah',title:'Birth of Bahá’u’lláh'});
    if(date>=year.ayyamStart&&date<=year.ayyamEnd)records.push({date,key:'ayyam-i-ha',title:'Ayyám-i-Há · intercalary days'});
    for(const record of records)if(record.date===date)result.push(make(date,record.key,record.title,'bahai','official-badi-published',sources,{status:'published-derived-date',boundaryKind:'bahai',boundary:BOUNDARIES.bahai,beginsOnPreviousCivilDate:shift(date,-1),region:'Worldwide Bahá’í calendar; local sunset boundary',bahaiYear:year.bahaiEra,method:'Official published year anchors and Twin Birthday dates; selected holy-day date offsets from the inspected official mapping.',limitations:['Exact Tehran equinox/new-moon rules are not independently solved by this module.','Source-publication consistency is not an independent astronomical validation.','Day of the Covenant, Ascension of ‘Abdu’l-Bahá and intercalary days have different significance from the nine work-suspension holy days; no practice obligation is inferred.']}));
  }
  return result;
}

/** The caller supplies trusted canonical comparison rows; MCP/orchestration
 * must compute them from explicit inputs, not accept untrusted derived facts.
 * Empty output means no selected supported rule matched, never no observance.
 */
export function observancesForDate(input) {
  const {date,year,rows}=normalize(input);
  const result=[...christian(date,year),...fixedChristian(date,rows),...jewish(date,rows),...islamic(date,rows),...chinese(date,rows),...publishedRegional(date,rows),...bahai(date)];
  if(date.endsWith('-03-21'))result.push(make(date,'naw-ruz','Naw Ruz — fixed 21 March Fasli convention','zoroastrian','avesta-fixed-fasli',['HOBS-AVESTA-CALENDAR','HOBS-IRANICA-CALENDAR'],{status:'source-rule',region:'Only the fixed-date Fasli convention described by Avesta.org',method:'Explicit fixed 21 March source convention; no equinox or Persian calendar substitution.',limitations:['Independent future date fixtures are pending. This is not universal Zoroastrian calendrical authority.','Shahanshahi, Qadimi and equinox-based variants remain unimplemented.','Exact religious day boundary and ceremony time are not calculated.']}));
  if(result.length>HORIZON_OBSERVANCE_LIMITS.maxRowsPerDate)throw new RangeError('Observance result exceeds the explicit bounded row count.');
  if(new Set(result.map(row=>row.id)).size!==result.length)throw new Error('Duplicate observance identity.');
  return result.sort((a,b)=>a.familyId.localeCompare(b.familyId)||a.variantId.localeCompare(b.variantId)||a.id.localeCompare(b.id));
}
