import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { observancesForDate, HORIZON_OBSERVANCE_LIMITS, HORIZON_OBSERVANCE_SOURCES, HORIZON_OBSERVANCE_COVERAGE } from '../../assets/js/core/horizon-observances.js';
import { HKO_OBSERVANCE_DATES } from '../../assets/js/core/data/horizon-observances.js';
import { compareMoment } from '../../assets/js/core/calendar-observatory.js';
import { resolveZonedTime } from '../../assets/js/core/time.js';
const observer={lat:22.3193,lon:114.1694,timeZone:'Asia/Hong_Kong'};
const json=value=>JSON.parse(JSON.stringify(value));
const fixture=(date,selected=observer)=>({date,observer:selected,calendars:compareMoment({...selected,dateISO:resolveZonedTime(date,'12:00:00',selected.timeZone).instant.toISOString()}).calendars});
const rows=(date,selected)=>observancesForDate(fixture(date,selected));
const has=(list,key,variant)=>list.some(row=>row.id.includes(`-${key}-`)&&(!variant||row.variantId===variant));
export function run(){
  const failures=[];let count=0;
  const test=(name,fn)=>{count++;try{fn();}catch(error){failures.push(`${name}: ${error.message}`);}};
  test('All requested families and all thirteen existing civil converters have explicit coverage',()=>{
    for(const family of ['christian','jewish','islamic','chinese','hindu','buddhist','sikh','jain','bahai','zoroastrian','shinto'])assert.ok(HORIZON_OBSERVANCE_COVERAGE.some(row=>row.familyId===family));
    assert.equal(HORIZON_OBSERVANCE_COVERAGE.filter(row=>row.kind==='civil-converter').length,13);
    for(const family of ['sikh','jain','shinto'])assert.equal(HORIZON_OBSERVANCE_COVERAGE.find(row=>row.familyId===family).status,'unavailable');
  });
  test('Every coverage source resolves and factual sources retain access and reading qualifications',()=>{
    const ids=new Set(HORIZON_OBSERVANCE_SOURCES.map(s=>s.id));assert.equal(ids.size,HORIZON_OBSERVANCE_SOURCES.length);
    for(const row of HORIZON_OBSERVANCE_COVERAGE)for(const id of row.sourceIds)assert.ok(ids.has(id),id);
    for(const source of HORIZON_OBSERVANCE_SOURCES){assert.ok(source.readingDepth&&source.rights&&source.locator);if(source.id!=='HOBS-CIVIL'){assert.equal(source.httpStatus,200);assert.match(source.sha256,/^[a-f0-9]{64}$/);assert.match(source.url,/^https:/);}}
  });
  test('Western Easter agrees with the independently published OCA and selected USCCB dates',()=>{
    for(const date of ['2026-04-05','2027-03-28','2028-04-16','2029-04-01','2030-04-21'])assert.ok(has(rows(date),'easter','gregorian-computus'),date);
  });
  test('Julian Pascha agrees with OCA published table and remains a separate variant',()=>{
    for(const date of ['2026-04-12','2027-05-02','2028-04-16','2029-04-08','2030-04-28'])assert.ok(has(rows(date),'easter','julian-computus'),date);
    const shared=rows('2028-04-16').filter(r=>r.id.includes('-easter-'));assert.equal(shared.length,2);assert.notEqual(shared[0].id,shared[1].id);
  });
  test('Good Friday, Ascension Thursday/Sunday and Pentecost retain different rules',()=>{
    assert.ok(has(rows('2027-03-26'),'good-friday','gregorian-computus'));
    assert.ok(has(rows('2027-05-06'),'ascension-thursday','gregorian-computus'));
    assert.ok(has(rows('2027-05-09'),'ascension-sunday','western-sunday-transfer'));
    assert.ok(has(rows('2027-05-16'),'pentecost','gregorian-computus'));
    assert.ok(has(rows('2027-06-20'),'pentecost','julian-computus'));
  });
  test('Fixed Gregorian/Julian feasts do not infer a universal church calendar',()=>{
    assert.ok(has(rows('2026-12-25'),'christmas','gregorian-fixed'));
    assert.ok(has(rows('2027-01-07'),'christmas','julian-fixed'));
    assert.ok(has(rows('2027-01-06'),'epiphany','gregorian-fixed'));
    assert.ok(has(rows('2027-01-19'),'epiphany','julian-fixed'));
  });
  test('Pesach daytime date and previous sunset remain distinct; Israel/Diaspora lengths differ',()=>{
    assert.ok(!has(rows('2027-04-21'),'pesach'));
    const start=rows('2027-04-22').filter(r=>r.id.includes('-pesach-'));assert.equal(start.length,2);
    assert.ok(start.every(r=>r.beginsOnPreviousCivilDate==='2027-04-21'&&r.exactStartUTC===null&&r.boundaryKind==='jewish'));
    assert.ok(has(rows('2027-04-28'),'pesach','israel'));
    assert.ok(!has(rows('2027-04-29'),'pesach','israel'));assert.ok(has(rows('2027-04-29'),'pesach','diaspora'));
  });
  test('Shavuot and Simchat Torah explicitly preserve Israel/Diaspora variants',()=>{
    assert.ok(has(rows('2027-06-11'),'shavuot','israel'));assert.ok(has(rows('2027-06-12'),'shavuot','diaspora'));assert.ok(!has(rows('2027-06-12'),'shavuot','israel'));
    assert.ok(has(rows('2027-10-23'),'shemini-atzeret-simchat-torah','israel'));assert.ok(has(rows('2027-10-24'),'simchat-torah','diaspora'));
  });
  test('Purim uses Adar II in leap years and does not confuse Purim Katan',()=>{
    assert.ok(has(rows('2027-03-23'),'purim'));assert.ok(!has(rows('2027-02-21'),'purim'));assert.ok(has(rows('2028-03-12'),'purim'));
  });
  test('Rosh Hashanah and Yom Kippur match selected independent daytime fixtures',()=>{
    assert.ok(has(rows('2027-10-02'),'rosh-hashanah'));assert.ok(has(rows('2027-10-03'),'rosh-hashanah'));assert.ok(has(rows('2027-10-11'),'yom-kippur'));
  });
  test('Hanukkah first daytime label is not an evening candle count or invented full interval',()=>{
    assert.ok(!has(rows('2027-12-24'),'hanukkah-start'));const r=rows('2027-12-25').find(r=>r.id.includes('-hanukkah-start-'));assert.ok(r);assert.equal(r.beginsOnPreviousCivilDate,'2027-12-24');assert.ok(!has(rows('2027-12-26'),'hanukkah-start'));
  });
  test('MUIS published Ramadan and Eid dates remain separate from calendar projections',()=>{
    for(const[date,key]of [['2027-02-08','ramadan-start'],['2027-03-10','eid-fitr'],['2027-05-17','eid-adha']]){const r=rows(date).find(r=>r.variantId==='singapore-muis-published'&&r.id.includes(`-${key}-`));assert.ok(r);assert.equal(r.status,'published-date');assert.equal(r.exactStartUTC,null);}
    const scan=Array.from({length:4},(_,i)=>rows(`2027-03-${String(8+i).padStart(2,'0')}`)).flat().filter(r=>r.id.includes('-eid-fitr-'));
    for(const variant of ['islamic-civil','islamic-umalqura'])assert.ok(scan.some(r=>r.variantId===variant&&r.status==='projected-calendar'));
  });
  test('HKO2027 and2030 published New Year dates retain actual runtime disagreement',()=>{
    for(const date of ['2027-02-06','2030-02-03']){const input=fixture(date),before=json(input.calendars),r=observancesForDate(input).find(r=>r.id.includes('-lunar-new-year-'));assert.ok(r);assert.deepEqual(input.calendars,before);assert.equal(r.calendarComparison.published.month,1);assert.equal(r.calendarComparison.published.day,1);const c=input.calendars.find(c=>c.id==='chinese');assert.equal(r.calendarComparison.runtime.text,c.text);const matches=r.calendarComparison.runtime.month===1&&r.calendarComparison.runtime.day===1&&!r.calendarComparison.runtime.leap;assert.equal(r.calendarComparison.status,matches?'matches':'mismatch');if(process.versions.icu==='78.3')assert.equal(r.calendarComparison.status,'mismatch');}
    assert.ok(!has(rows('2027-02-07'),'lunar-new-year'));
  });
  test('HKO intercalary fifth month does not duplicate Dragon Boat Festival',()=>{
    assert.ok(has(rows('2028-05-28'),'tuen-ng'));assert.ok(!has(rows('2028-06-27'),'tuen-ng'));
  });
  test('HKO festival facts cover all five years without silently repairing runtime calendars',()=>{
    assert.equal(HKO_OBSERVANCE_DATES.length,25);
    for(const item of HKO_OBSERVANCE_DATES){const result=rows(item.date).find(r=>r.id.includes(`-${item.key}-`));assert.ok(result);assert.ok(result.sourceIds.includes(item.sourceId));assert.ok(['matches','mismatch','unavailable'].includes(result.calendarComparison.status));}
  });
  test('GovHK Mid-Autumn festival is not its following public holiday',()=>{
    assert.ok(has(rows('2027-09-15'),'mid-autumn'));assert.ok(!has(rows('2027-09-16'),'mid-autumn'));
  });
  test('Vesak and Buddha birthday keep distinct regional dates; substitute holidays are not inferred',()=>{
    assert.ok(has(rows('2026-05-31'),'vesak','singapore-published'));assert.ok(!has(rows('2026-06-01'),'vesak'));
    assert.ok(has(rows('2027-05-20'),'vesak','singapore-published'));assert.ok(has(rows('2027-05-13'),'buddha-birthday','hong-kong-published'));
    assert.ok(has(rows('2026-11-08'),'deepavali','singapore-published'));assert.ok(!has(rows('2026-11-09'),'deepavali'));
  });
  test('Unpublished Hindu/Buddhist future schedules are not invented from civil era labels',()=>{
    for(const date of ['2028-05-20','2028-10-28','2029-11-08','2030-05-13'])assert.ok(!rows(date).some(r=>['hindu','buddhist'].includes(r.familyId)));
    assert.ok(HORIZON_OBSERVANCE_COVERAGE.find(r=>r.id==='hindu-regional').limitations.includes('Saka'));
  });
  test('Published Bahai Naw-Ruz changes March21 to March20 and preserves sunset boundary',()=>{
    assert.ok(has(rows('2026-03-21'),'naw-ruz','official-badi-published'));assert.ok(has(rows('2027-03-21'),'naw-ruz','official-badi-published'));assert.ok(has(rows('2028-03-20'),'naw-ruz','official-badi-published'));assert.ok(!has(rows('2028-03-21'),'naw-ruz','official-badi-published'));
    const r=rows('2028-03-20').find(r=>r.familyId==='bahai');assert.equal(r.beginsOnPreviousCivilDate,'2028-03-19');assert.equal(r.boundaryKind,'bahai');assert.equal(r.exactStartUTC,null);
  });
  test('Bahai Twin Birthday facts are published dates, not fixed Gregorian recurrences',()=>{
    for(const date of ['2026-11-10','2027-10-30','2028-10-19','2029-11-07','2030-10-28'])assert.ok(has(rows(date),'birth-bab','official-badi-published'),date);
    assert.ok(has(rows('2027-10-31'),'birth-bahaullah','official-badi-published'));
  });
  test('Bahai intercalary ranges follow official year data rather than Gregorian leap-year assumptions',()=>{
    assert.ok(has(rows('2026-02-25'),'ayyam-i-ha'));assert.ok(has(rows('2026-03-01'),'ayyam-i-ha'));assert.ok(!has(rows('2026-03-02'),'ayyam-i-ha'));
    assert.ok(has(rows('2028-02-29'),'ayyam-i-ha'));assert.ok(!has(rows('2028-03-01'),'ayyam-i-ha'));
  });
  test('Fasli source rule is explicitly distinct from Bahai equinox-linked publication and Persian civil date',()=>{
    const r=rows('2028-03-21').find(r=>r.familyId==='zoroastrian');assert.equal(r.status,'source-rule');assert.equal(r.variantId,'avesta-fixed-fasli');assert.ok(r.limitations.some(x=>x.includes('pending')));assert.ok(!rows('2028-03-20').some(r=>r.familyId==='zoroastrian'));
  });
  test('Unavailable sampled clocks retain date-only fixed/published facts and explicit native-calendar missingness',()=>{
    const input=fixture('2026-12-25');input.calendars=input.calendars.map(r=>({id:r.id,status:'unavailable',parts:[]}));const result=observancesForDate(input);assert.ok(has(result,'christmas','gregorian-fixed'));assert.equal(result.filter(r=>r.status==='unavailable').length,3);assert.ok(result.every(r=>r.exactStartUTC===null));
    input.date='2027-02-06';const chinese=observancesForDate(input).find(r=>r.familyId==='chinese');assert.equal(chinese.calendarComparison.status,'unavailable');assert.equal(chinese.status,'published-derived-date');
  });
  test('Missing or unrecognized lunar calendar fields are unavailable, not a clean nonmatch',()=>{
    const input=fixture('2027-04-22');input.calendars.find(r=>r.id==='hebrew').parts.find(p=>p.type==='month').value='Unrecognized month';const result=observancesForDate(input);assert.ok(result.some(r=>r.familyId==='jewish'&&r.status==='unavailable'));assert.ok(!has(result,'pesach'));
  });
  test('Strict dates, observer and canonical Gregorian/date consistency reject invalid requests',()=>{
    const valid=fixture('2027-04-22');for(const date of ['2025-12-31','2031-01-02','2027-02-29','2027-4-22','2027-04-22T00:00:00Z'])assert.throws(()=>observancesForDate({...valid,date}));
    for(const patch of [{timeZone:'Bad/Zone'},{lat:NaN},{lon:181}])assert.throws(()=>observancesForDate({...valid,observer:{...observer,...patch}}));
    assert.throws(()=>observancesForDate({...valid,date:'2027-04-23'}));assert.throws(()=>observancesForDate({...valid,calendars:[...valid.calendars,valid.calendars[0]]}));
  });
  test('Output is bounded, source-resolved, date-only and excludes undeclared private context',()=>{
    const input=fixture('2027-04-22');input.observer.notes='PRIVATE_SENTINEL';input.calendars[0].notes='PRIVATE_SENTINEL';const result=observancesForDate(input),sourceIds=new Set(HORIZON_OBSERVANCE_SOURCES.map(s=>s.id));
    assert.ok(result.length<=48);assert.equal(new Set(result.map(r=>r.id)).size,result.length);assert.ok(!JSON.stringify(result).includes('PRIVATE_SENTINEL'));for(const row of result){assert.equal(row.precision,'date-only');assert.equal(row.exactStartUTC,null);assert.equal(row.exactEndUTC,null);assert.ok(row.boundary&&row.method&&row.region&&row.limitations.length);for(const id of row.sourceIds)assert.ok(sourceIds.has(id),id);for(const key of ['score','good','bad','probability','dateISO','lat','lon'])assert.equal(Object.hasOwn(row,key),false);}
  });
  test('Result mutation cannot alter factual data or later calculations',()=>{
    const first=rows('2027-02-06');first[0].calendarComparison.published.day=99;first[0].sourceIds.push('invented');const second=rows('2027-02-06');assert.equal(second[0].calendarComparison.published.day,1);assert.ok(!second[0].sourceIds.includes('invented'));
  });
  test('The complete allowed civil-date range remains valid even with all sampled clocks unavailable',()=>{
    const calendars=fixture('2026-01-01').calendars.map(r=>({id:r.id,status:'unavailable',parts:[]}));let days=0;
    for(let ms=Date.parse('2026-01-01T12:00:00Z');ms<=Date.parse('2031-01-01T12:00:00Z');ms+=86400000){const date=new Date(ms).toISOString().slice(0,10),result=observancesForDate({date,calendars,observer});assert.ok(result.length<=48);assert.equal(result.filter(r=>r.status==='unavailable').length,3);days++;}
    assert.equal(days,1827);assert.equal(HORIZON_OBSERVANCE_LIMITS.startDate,'2026-01-01');
  });
  test('Explicit civil date/zone use is stable across host timezone and dateline observers',()=>{
    const tz=process.env.TZ,fetch=globalThis.fetch;globalThis.fetch=()=>{throw Error('Unexpected network');};
    try{process.env.TZ='Pacific/Honolulu';const input=fixture('2027-04-22'),a=observancesForDate(input);process.env.TZ='Asia/Tokyo';assert.deepEqual(observancesForDate(input),a);for(const zone of ['Pacific/Kiritimati','Pacific/Pago_Pago'])assert.ok(has(rows('2027-04-22',{lat:0,lon:0,timeZone:zone}),'pesach'));}
    finally{globalThis.fetch=fetch;if(tz===undefined)delete process.env.TZ;else process.env.TZ=tz;}
  });
  return {pass:failures.length===0,count,passed:count-failures.length,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=run();console.log(`${result.pass?'PASS':'FAIL'} horizon observances: ${result.count} groups`);result.failures.forEach(item=>console.error(item));process.exitCode=result.pass?0:1;}
