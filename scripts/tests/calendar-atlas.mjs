import { pathToFileURL } from 'node:url';
import { ATLAS_FAMILIES, ATLAS_VARIANTS, buildCalendarAtlas, exportCalendarAtlas } from '../../assets/js/core/calendar-atlas.js';

export async function run() {
  let count=0;const failures=[];
  const ok=(condition,message)=>{count++;if(!condition)failures.push(message);};
  const throws=(fn,message)=>{try{fn();ok(false,message);}catch{ok(true,message);}};
  const input={dateISO:'2026-10-29T00:30:00Z',lat:28.6139,lon:77.209,timeZone:'Asia/Kolkata'};
  const all=buildCalendarAtlas(input),byId=id=>all.rows.find(row=>row.id===id);
  const civilIds=['gregory','julian','hebrew','islamic-civil','islamic-umalqura','chinese','buddhist','indian','persian','coptic','ethiopic','japanese','roc'];
  ok(ATLAS_FAMILIES.length===7&&new Set(ATLAS_VARIANTS.map(v=>v.id)).size===32,'Seven family groups, 32 distinct named variants');
  ok(civilIds.every(id=>byId(id))&&all.rows.filter(r=>r.kind==='calculated-civil').length===13,'All thirteen existing civil displays preserved without duplication');
  ok(all.families.flatMap(f=>f.rows).length===all.rows.length&&all.families.every(f=>f.rows.every(r=>r.familyId===f.id)),'Family views contain exactly their selected rows');
  const sources=new Set(all.sources.map(s=>s.id));
  ok(all.rows.every(r=>r.sourceIds.length&&r.sourceIds.every(id=>sources.has(id))),'Every displayed variant source resolves');
  ok(all.sources.every(s=>typeof s.readingDepth==='string'&&s.readingDepth.length>10),'All sources retain actual or explicitly inherited reading depth');
  ok(all.rows.every(r=>typeof r.summary==='string'&&r.summary&&typeof r.method==='string'&&r.method&&r.validation&&Array.isArray(r.limitations)),'Every row has readable method, summary, validation and limits');
  ok(JSON.parse(JSON.stringify(all)).context.dateISO==='2026-10-29T00:30:00.000Z','Entire atlas is JSON-safe and instant normalized');
  for(const id of ['vedic-regional','egyptian-ancient-civil','egyptian-lunar','hebrew-sunset','jewish-kabbalah','chinese-bazi','islamic-observed-crescent']){
    const r=byId(id);ok(r.status==='unavailable'&&r.result===null&&r.reason&&r.validation.includes('Unavailable'),id+' has no fabricated numerical result');
  }
  ok(byId('hebrew').boundary==='civil-midnight'&&byId('hebrew-sunset').boundary==='not-calculated','Hebrew civil and religious-day boundary stay distinct');
  ok(byId('coptic').validation.includes('pending')&&byId('egyptian-ancient-civil').status==='unavailable','Coptic runtime output is not promoted to ancient Egyptian reconstruction or independent fixture validation');
  ok(byId('chinese').validation.includes('selected-reference')&&byId('chinese-bazi').status==='unavailable','Chinese selected-fixture category is preserved without inferring BaZi');
  ok(all.rows.filter(r=>r.kind==='calculated-civil'&&r.validation.includes('pending')).length===7,'Seven inherited independent-display-fixture gaps remain explicit');
  const chosen=buildCalendarAtlas(input,{familyIds:['western','jewish'],variantIds:['gregory','hebrew','chinese']});
  ok(chosen.rows.map(r=>r.id).join(',')==='gregory,hebrew','Family and variant filters intersect in catalogue order');
  ok(buildCalendarAtlas(input,{familyIds:['chinese']}).rows.every(r=>r.familyId==='chinese'),'Single family exposes only its named variants');
  ok(buildCalendarAtlas(input,{variantIds:['julian']}).rows.length===1,'Single method selection does not secretly include the family');
  for(const options of [null,[],{familyIds:[]},{variantIds:[]},{familyIds:['made-up']},{variantIds:['chinese','chinese']},{familyIds:['western'],variantIds:['hebrew']},{all:true}])throws(()=>buildCalendarAtlas(input,options),'Invalid or empty selection rejected: '+JSON.stringify(options));
  for(const patch of [{dateISO:'2026-10-29'},{dateISO:'2026-10-29T12:00:00'},{timeKnown:false},{lat:NaN},{timeZone:'Not/AZone'},{dateISO:'1900-01-01T00:00:00Z',timeZone:'Pacific/Honolulu'}])throws(()=>buildCalendarAtlas({...input,...patch}),'Canonical exact-input contract retained: '+JSON.stringify(patch));
  for(const id of ['western-regiomontanus','western-placidus','western-whole','western-equal']){
    const r=byId(id);ok(r.status==='available'&&r.result.requestedSystem===r.result.actualSystem&&r.result.cusps.length===12&&r.result.cusps.every(Number.isFinite),id+' exposes twelve canonical cusps with requested/actual methods');
  }
  const whole=byId('western-whole').result,equal=byId('western-equal').result;
  ok(whole.cusps.every(c=>Math.abs(c/30-Math.round(c/30))<1e-9),'Whole-sign cusps begin on zodiac-sign boundaries');
  ok(Math.abs(equal.cusps[0]-equal.ascendant)<1e-10,'Equal houses begin at the ascendant');
  ok(byId('western-whole').result.placements.map(p=>p.longitude).join(',')===byId('western-equal').result.placements.map(p=>p.longitude).join(','),'House variants share the same planetary longitudes');
  const polar=buildCalendarAtlas({...input,dateISO:'2026-06-21T12:00:00Z',lat:69.6492,lon:18.9553,timeZone:'Europe/Oslo'},{variantIds:['western-placidus','planetary-hours','vedic-vara']});
  const placidus=polar.rows.find(r=>r.id==='western-placidus');
  ok(placidus.status==='partial'&&placidus.result.requestedSystem==='placidus'&&placidus.result.actualSystem==='regiomontanus'&&placidus.result.warning,'Polar fallback is explicitly partial and is not claimed to be Placidus');
  ok(polar.rows.filter(r=>r.id!=='western-placidus').every(r=>r.status==='unavailable'),'Polar sunrise hour and vāra are unavailable');
  ok(byId('vedic-vara').result.lord==='Mercury'&&all.context.localWeekday==='Thursday','Before-sunrise vāra can differ from observer civil Thursday');
  ok(byId('vedic-lunar').result.tithi.num===all.comparison.vedic.panchanga.tithi.num&&byId('vedic-solar').result.sun.longitude===all.comparison.vedic.sun.longitude,'Vedic study rows reuse canonical partitions and solar frame');
  // Retained USNO worked example, independently originated before this atlas:
  // Gregorian and Julian computus both give Gregorian 2010-04-04.
  const easters=buildCalendarAtlas({...input,dateISO:'2010-01-01T12:00:00Z'},{variantIds:['easter-gregorian','easter-julian']}).rows;
  ok(easters.every(r=>r.result.gregorianDate==='2010-04-04'),'Inherited USNO 2010 computus coincidence remains exact');
  ok(easters[1].result.nativeDate==='2010-03-22'&&easters[1].result.method==='julian','Julian computus preserves its native date separately from Gregorian correspondence');
  const atYear=buildCalendarAtlas({...input,dateISO:'2025-12-31T23:30:00Z',lat:1.8721,lon:-157.4278,timeZone:'Pacific/Kiritimati'},{variantIds:['easter-gregorian']});
  ok(atYear.rows[0].result.year===2026,'Annual computus uses observer civil year, not UTC year');
  // Fresh CWA 2026 PDF, page2 一、節氣, explicitly UTC+8. HKO2026 table's
  // independently published day-level Solar Terms column agrees with all dates.
  // See ATLAS-CWA-2026 / ATLAS-HKO-2026 source records and the R2 reading ledger.
  const termFixtures=[['01-05','16:23'],['01-20','09:45'],['02-04','04:02'],['02-18','23:52'],['03-05','21:59'],['03-20','22:46'],['04-05','02:40'],['04-20','09:39'],['05-05','19:49'],['05-21','08:37'],['06-05','23:48'],['06-21','16:24'],['07-07','09:57'],['07-23','03:13'],['08-07','19:43'],['08-23','10:19'],['09-07','22:41'],['09-23','08:05'],['10-08','14:29'],['10-23','17:38'],['11-07','17:52'],['11-22','15:23'],['12-07','10:52'],['12-22','04:50']];
  const terms=byId('chinese-solar-terms');
  ok(terms.status==='available'&&terms.result.events.length===24&&new Set(terms.result.events.map(t=>t.longitudeDegrees)).size===24,'All24 named solar-term longitudes have one annual event');
  for(let i=0;i<termFixtures.length;i++){
    const [day,time]=termFixtures[i],event=terms.result.events[i],expected=new Date(`2026-${day}T${time}:00+08:00`);
    ok(event.longitudeDegrees===(285+i*15)%360&&Math.abs(new Date(event.instantUTC)-expected)<=120000&&event.referenceDate===`2026-${day}`,`CWA2026 ${day} solar term within2minutes and HKO reference date`);
  }
  ok(terms.result.nextEvent.name==='Winter Commences'&&terms.result.nextEvent.chineseName==='立冬','HKO English and CWA Chinese names preserved for next solar term');
  const atTerm=buildCalendarAtlas({...input,dateISO:terms.result.nextEvent.instantUTC},{variantIds:['chinese-solar-terms']}).rows[0];
  ok(new Date(atTerm.result.nextEvent.instantUTC)>new Date(terms.result.nextEvent.instantUTC),'Next solar term is strictly later even when selected instant is a computed event');
  const acrossYear=buildCalendarAtlas({...input,dateISO:'2099-12-25T00:00:00Z'},{variantIds:['chinese-solar-terms']}).rows[0];
  ok(acrossYear.result.referenceYear===2099&&acrossYear.result.nextEvent.instantUTC.startsWith('2100-01-'),'Next solar term can cross reference-year boundary within supported range');
  const lastYear=buildCalendarAtlas({...input,dateISO:'2100-12-25T00:00:00Z'},{variantIds:['chinese-solar-terms']}).rows[0];
  ok(lastYear.status==='partial'&&lastYear.result.events.length===24&&lastYear.result.nextEvent===null&&lastYear.result.nextStatus==='unavailable','Annual2100 terms remain available but a2101 next event is withheld');
  const referenceEdge=buildCalendarAtlas({...input,dateISO:'2100-12-31T18:00:00Z',lat:40.7,lon:-74,timeZone:'America/New_York'},{variantIds:['chinese-solar-terms']}).rows[0];
  ok(referenceEdge.status==='unavailable'&&referenceEdge.result===null,'Hong Kong reference year2101 is unavailable even when observer civil year remains2100');
  const datelineTerms=buildCalendarAtlas({...input,lat:1.8721,lon:-157.4278,timeZone:'Pacific/Kiritimati'},{variantIds:['chinese-solar-terms']}).rows[0].result;
  const equinox=datelineTerms.events.find(e=>e.longitudeDegrees===0);
  ok(equinox.referenceDate==='2026-03-20'&&equinox.observerDate==='2026-03-21'&&datelineTerms.referenceTimeZone==='Asia/Hong_Kong','Same solar-term instant retains reference UTC+8 date and distinct observer date');
  // Runtime-zone policy regressions, not newly sourced astronomical fixtures.
  // Hong Kong used summer time in 1950; never silently force its IANA clock to +8.
  const historicalTerms=buildCalendarAtlas({...input,dateISO:'1950-06-21T12:00:00Z'},{variantIds:['chinese-solar-terms']}).rows[0].result;
  const historicalSolstice=historicalTerms.events.find(e=>e.longitudeDegrees===90);
  const plusNine=new Date(Date.parse(historicalSolstice.instantUTC)+9*3600000).toISOString();
  ok(historicalSolstice.referenceDate===plusNine.slice(0,10)&&historicalSolstice.referenceTime===plusNine.slice(11,19),'Historical Hong Kong reference clock preserves runtime summer-time offset rather than fixed UTC+8');
  const londonTerms=buildCalendarAtlas({...input,lat:51.5,lon:-.13,timeZone:'Europe/London'},{variantIds:['chinese-solar-terms']}).rows[0].result;
  const beforeDST=londonTerms.events.find(e=>e.longitudeDegrees===0),afterDST=londonTerms.events.find(e=>e.longitudeDegrees===15);
  ok(beforeDST.observerTime===beforeDST.instantUTC.slice(11,19)&&afterDST.observerTime===new Date(Date.parse(afterDST.instantUTC)+3600000).toISOString().slice(11,19),'Each observer event uses its own DST offset rather than the selected instant offset');
  ok(londonTerms.events.every((e,i)=>e.instantUTC===terms.result.events[i].instantUTC),'Observer-zone change preserves the shared geocentric event instants');
  const publicJulian=exportCalendarAtlas(input,{variantIds:['julian']});
  ok(!Object.hasOwn(publicJulian,'comparison')&&publicJulian.rows.length===1&&publicJulian.rows[0].id==='julian'&&!JSON.stringify(publicJulian).includes('houseCusps'),'Selected public export omits the full internal comparison');
  ok(publicJulian.families.length===1&&publicJulian.families[0].rows.length===1&&!Object.hasOwn(publicJulian,'prayer')&&!Object.hasOwn(publicJulian,'vedic'),'Unselected tradition/prayer result blocks are not buried in the selected export');
  ok(publicJulian.sharedAstronomy.sunLongitude===all.comparison.astronomy.sunLongitude&&publicJulian.sharedAstronomy.moonLongitude===all.comparison.astronomy.moonLongitude,'Export preserves only explicit shared sky quantities for plate verification');
  const publicHour=exportCalendarAtlas(input,{variantIds:['planetary-hours']}),hourSources=new Set(publicHour.sources.map(s=>s.id));
  ok(publicHour.rows[0].result.sourceIds.every(id=>hourSources.has(id))&&publicHour.sharedAstronomy.sourceIds.every(id=>hourSources.has(id)),'Selected export resolves nested canonical result and shared-sky source references');
  const poisoned=buildCalendarAtlas({...input,rows:[{id:'hebrew',summary:'FORGED'}],note:'PRIVATE NOTE',comparison:{calendars:[{text:'FORGED'}]}});
  ok(!JSON.stringify(poisoned).includes('FORGED')&&!JSON.stringify(poisoned).includes('PRIVATE NOTE'),'Caller-supplied rows and undeclared private metadata are not exported');
  ok(Object.isFrozen(ATLAS_FAMILIES)&&Object.isFrozen(ATLAS_VARIANTS)&&Object.isFrozen(ATLAS_VARIANTS[0].sourceIds),'Catalogue and nested metadata cannot be mutated');
  const savedTZ=process.env.TZ;
  try{process.env.TZ='Pacific/Honolulu';const west=JSON.stringify(buildCalendarAtlas(input));process.env.TZ='Pacific/Apia';ok(west===JSON.stringify(buildCalendarAtlas(input)),'Atlas is independent of host-device time zone');}
  finally{if(savedTZ===undefined)delete process.env.TZ;else process.env.TZ=savedTZ;}
  return {pass:failures.length===0,count,failures};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=await run();console.log(`${r.pass?'PASS':'FAIL'} calendar atlas: ${r.count} checks`);r.failures.forEach(f=>console.error(f));process.exitCode=r.pass?0:1;}
