import { mountChrome } from './shared.js';
import { compareMoment, buildCalendarOutlook, observatoryInputFromLocal } from '../core/calendar-observatory.js';
import { localClockFields, mondayOfWeek, outlookCacheKey } from '../core/observatory-schedule.js';
import { mountCalendarAssistant } from './calendar-assistant.js';
import { mountDayGuidance } from './day-guidance.js';
import { buildDayGuidance } from '../core/day-guidance.js';

mountChrome('home');
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const places={
  london:[51.5074,-.1278,'Europe/London'],delhi:[28.6139,77.209,'Asia/Kolkata'],newyork:[40.7128,-74.006,'America/New_York'],
  beijing:[39.9042,116.4074,'Asia/Shanghai'],cairo:[30.0444,31.2357,'Africa/Cairo'],jerusalem:[31.7683,35.2137,'Asia/Jerusalem'],
  tokyo:[35.6762,139.6503,'Asia/Tokyo'],sydney:[-33.8688,151.2093,'Australia/Sydney'],mexico:[19.4326,-99.1332,'America/Mexico_City'],
};
let comparison=null,outlook=null,cacheKey=null,dirty=false,busy=false,timer=null,revision=0;
const assistant=mountCalendarAssistant($('homeAssistant'),{getComparison:()=>comparison});
const dayGuide=mountDayGuidance($('homeDayGuide'),null);
const dayMounts=new Map();
let renderedOutlook=null,renderedDate=null,weekGuidanceInvalidated=false;

function compareURL(snapshot) {
  const c=snapshot.context,url=new URL('../../../pages/calendar-compare.html',import.meta.url);
  for(const [key,value] of Object.entries({at:c.dateISO,lat:c.lat,lon:c.lon,zone:c.timeZone,system:c.system})) url.searchParams.set(key,value);
  return url.href;
}
function setError(message) {
  $('homeError').textContent=message||''; $('homeError').hidden=!message;
  if(message) $('homeLocationDetails').open=true;
}
function disableStale() {
  dirty=true; revision++; comparison=null; assistant.update(null);
  dayGuide.update(null); for(const entry of dayMounts.values()) entry.mount.update(null);weekGuidanceInvalidated=true;
  $('homeOutlookStale').hidden=false;$('homeOutlook').dataset.stale='true';
  document.querySelectorAll('a.home-day').forEach(a=>{if(a.hasAttribute('href'))a.dataset.currentHref=a.href;a.removeAttribute('href');a.setAttribute('aria-disabled','true');});
  $('homeDownload').disabled=true;
  $('homeCompare').setAttribute('aria-disabled','true');
  $('homeStatus').textContent='Inputs changed. Update reading to calculate this moment; the previous display is retained below.';
  $('homeSummary').dataset.stale='true';
}
function fieldsNow() {
  const f=localClockFields(new Date(),$('homeZone').value.trim());
  $('homeDate').value=f.date; $('homeTime').value=f.time;
}
function readInput() {
  const lat=$('homeLat').value.trim(),lon=$('homeLon').value.trim();
  if(!lat||!lon) throw new RangeError('Enter both latitude and longitude.');
  return observatoryInputFromLocal({date:$('homeDate').value,time:$('homeTime').value,timeZone:$('homeZone').value.trim(),lat:Number(lat),lon:Number(lon),disambiguation:$('homeFold').value});
}
function renderSummary(s) {
  const a=s.astronomy,p=s.vedic.panchanga,h=s.planetaryHours;
  $('home-current-title').textContent=$('homeClockMode').value==='live'?"Today's reading":'Reading for the selected moment';
  $('homeSummary').innerHTML=`<article class="home-fact"><span class="home-fact-label">THE SHARED SKY · CALCULATED</span><h3>${esc(a.phaseLabel)}</h3><p>${(a.moonIlluminatedFraction*100).toFixed(1)}% of the lunar disc illuminated.<br>Moon–Sun elongation ${a.moonSunElongation.toFixed(2)}°.</p><p class="home-source">Geocentric Astronomy Engine · broad phase sector</p></article>
    <article class="home-fact"><span class="home-fact-label">TWO ZODIAC CONVENTIONS</span><h3>${esc(s.western.moon.sign)} <span aria-hidden="true">/</span> ${esc(s.vedic.moon.sign)}</h3><p>Tropical Moon / sidereal Moon.<br>Sun: ${esc(s.western.sun.sign)} / ${esc(s.vedic.sun.sign)}.</p><p class="home-source">Linear Lahiri estimate ${s.vedic.ayanamsha.degrees.toFixed(3)}° · not exact JHora equivalence</p></article>
    <article class="home-fact"><span class="home-fact-label">TRADITIONAL DAY &amp; LIMBS</span><h3>${esc(p.tithi.name)}</h3><p>${esc(p.tithi.paksha)} · Nakṣatra ${esc(p.nakshatra.name)}.<br>${h.status==='available'?`${esc(h.ruler)} hour · ${esc(h.dayRuler)} sunrise day`:'Planetary hour unavailable at this location'}.</p><p class="home-source">Instant Pañcāṅga study model · Agrippa II.34 temporal-hour convention</p></article>`;
  $('homeSummary').setAttribute('aria-busy','false'); delete $('homeSummary').dataset.stale;
  const screens=s.vedic.traditionalScreens;
  $('homeTraditions').innerHTML=`<details><summary>How the traditions read these quantities</summary><p>${esc(s.comparisons.find(x=>x.id==='zodiac-offset').text)}</p><p>${esc(s.comparisons.find(x=>x.id==='lunar-dependence').text)}</p>${screens?`<h3>Jyotiṣa / Muhūrta study classifications</h3><p class="small">These are classifications at this instant, not personal advice or a verdict on the whole day. Primary-text verification is incomplete; the inherited rule set includes modern secondary sources and citation flags.</p>${Object.values(screens.limbs).map(l=>`<p><strong>${esc(l.limb)} · ${esc(l.class)}</strong><br>${esc(l.detail)}</p>`).join('')}<p class="small">${esc(screens.limitations.join(' '))}</p><a href="${esc(compareURL(s))}#obs-readings-heading">Inspect rule-by-rule sources in the full comparison →</a>`:''}</details>`;
  $('homeCompare').href=compareURL(s); $('homeCompare').removeAttribute('aria-disabled');
}
function renderOutlook(result,selectedDate) {
  $('homeOutlookStale').hidden=true;delete $('homeOutlook').dataset.stale;
  document.querySelectorAll('a.home-day').forEach(a=>{if(a.dataset.currentHref)a.href=a.dataset.currentHref;delete a.dataset.currentHref;a.removeAttribute('aria-disabled');});
  if(renderedOutlook===result&&renderedDate===selectedDate) {
    if(weekGuidanceInvalidated) for(const entry of dayMounts.values()) entry.mount.update(entry.snapshot);
    weekGuidanceInvalidated=false;
    $('homeDownload').disabled=false;
    return;
  }
  for(const entry of dayMounts.values()) entry.mount.destroy(); dayMounts.clear();
  renderedOutlook=result;renderedDate=selectedDate;weekGuidanceInvalidated=false;
  const html=row=>{
    const parts=row.localDate.split('-'),label=`${parts[2]}/${parts[1]}`;
    if(row.status!=='available') return `<article class="home-day"><time datetime="${esc(row.localDate)}">${esc(label)}</time><span><strong class="home-day-title">Sample unavailable</strong><span class="home-day-meta">${esc(row.reason)}</span></span></article>`;
    const s=row.snapshot,p=s.vedic.panchanga,change=row.changesFromPreviousSample.find(x=>x.startsWith('Tropical Moon:'))||row.changesFromPreviousSample.find(x=>x.startsWith('Nakṣatra:'));
    const classification=s.vedic.traditionalScreens?.limbs.tithi;
    return `<div class="home-day-entry"><a class="home-day" href="${esc(compareURL(s))}"${row.localDate===selectedDate?' aria-current="date"':''}><time datetime="${esc(row.localDate)}">${esc(row.weekday.slice(0,3))}<small>${esc(label)}</small></time><span><span class="home-day-title">${esc(s.astronomy.phaseLabel)}</span><span class="home-day-meta">Tropical Moon ${esc(s.western.moon.sign)} · sidereal ${esc(s.vedic.moon.sign)}<br>${esc(p.tithi.name)} · ${esc(p.nakshatra.name)}${classification?`<br>Traditional tithi class: ${esc(classification.class)}${classification.meaning?` (${esc(classification.meaning)})`:''}`:''}</span>${change?`<span class="home-day-change">Changed since prior sample: ${esc(change)}</span>`:''}</span><span aria-hidden="true">↗</span></a><p class="home-day-action" data-day-action="${esc(row.localDate)}"></p><details class="home-day-details" data-day="${esc(row.localDate)}"><summary>Recommendations, rules &amp; hourly detail</summary><div class="home-day-guide"></div></details></div>`;
  };
  $('weekThis').innerHTML=result.rows.slice(0,7).map(html).join('');
  $('weekNext').innerHTML=result.rows.slice(7,14).map(html).join('');
  for(const row of result.rows.filter(row=>row.status==='available')) {
    const details=document.querySelector(`[data-day="${row.localDate}"]`);
    const guide=buildDayGuidance(row.snapshot);
    const items=guide.traditions?.flatMap(t=>t.items||[])||[];
    const highlighted=['favorable','caution'].map(kind=>items.find(item=>item.classification===kind)).filter(Boolean);
    if(!highlighted.length&&items.length) highlighted.push(items[0]);
    const action=document.querySelector(`[data-day-action="${row.localDate}"]`);
    action.textContent=highlighted.map(item=>`At noon · ${item.classification}: ${item.title}. ${typeof item.optionalAction==='string'?item.optionalAction:item.optionalAction?.text||''}`).join(' ');
    details.addEventListener('toggle',()=>{
      if(details.open&&!dayMounts.has(row.localDate)) {
        const mount=mountDayGuidance(details.querySelector('.home-day-guide'),dirty?null:row.snapshot);
        dayMounts.set(row.localDate,{mount,snapshot:row.snapshot});
      }
    });
  }
  const short=date=>new Intl.DateTimeFormat('en',{month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
  $('home-this-title').textContent=`This week · ${short(result.rows[0].localDate)}–${short(result.rows[6].localDate)}`;
  $('home-next-title').textContent=`Next week · ${short(result.rows[7].localDate)}–${short(result.rows[13].localDate)}`;
  $('homeOutlookMethod').textContent=`Local-noon snapshots, Monday–Sunday · ${result.context.timeZone}. Favorable and caution describe separate historical rules at noon; actions are optional modern reflection prompts. Expand a day for its rules and hourly samples. Changes are not exact transition times or whole-day forecasts. Day links include the selected coordinates.`;
  $('homeDownload').disabled=false;
}

async function calculate({automatic=false}={}) {
  if(busy || (automatic&&dirty)) return;
  busy=true; const token=++revision;
  $('homeRefresh').disabled=true; $('homeSummary').setAttribute('aria-busy','true');
  setError('');
  try {
    let input;
    if($('homeClockMode').value==='live') {
      // The running clock is already an unambiguous instant, even inside a DST
      // fold. Do not reinterpret its displayed wall time as an unknown occurrence.
      const now=new Date(),f=localClockFields(now,$('homeZone').value.trim());
      $('homeDate').value=f.date;$('homeTime').value=f.time;
      if(!$('homeLat').value.trim()||!$('homeLon').value.trim()) throw new RangeError('Enter both latitude and longitude.');
      input={dateISO:now.toISOString(),lat:Number($('homeLat').value),lon:Number($('homeLon').value),timeZone:$('homeZone').value.trim()};
    } else input=readInput();
    // Yield to expose pending feedback before the bounded fourteen-day calculation.
    if(!automatic) $('homeStatus').textContent='Calculating the selected moment and daily samples locally…';
    await new Promise(resolve=>setTimeout(resolve,0));
    if(token!==revision) return;
    const next=compareMoment(input),key=outlookCacheKey({date:next.context.localDate,timeZone:input.timeZone,lat:input.lat,lon:input.lon});
    let nextOutlook=outlook;
    if(key!==cacheKey || !nextOutlook) {
      nextOutlook=buildCalendarOutlook({...input,startDate:mondayOfWeek(next.context.localDate),days:14,sampleTime:'12:00'});
      // Override the generic engine group labels with the caller's explicit Monday alignment.
      nextOutlook={...nextOutlook,weekLabels:['This calendar week','Next calendar week'],calendarWeekAlignment:'Monday–Sunday in the selected zone',limitations:nextOutlook.limitations.filter(x=>!x.startsWith('The two seven-day groups start'))};
    }
    if(token!==revision) return;
    comparison=next; outlook=nextOutlook; cacheKey=key; dirty=false;
    renderSummary(comparison); renderOutlook(outlook,next.context.localDate); assistant.update(comparison);dayGuide.update(comparison);
    $('homeStatus').textContent=`${$('homeClockMode').value==='live'?'Following the present · refreshes every minute while open':'Frozen moment'} · ${next.context.localLabel} · ${input.timeZone} · ${next.context.dateISO}. Location: ${input.lat}°, ${input.lon}°. Nothing sent to a server.`;
  } catch(error) {
    comparison=null; assistant.update(null);dayGuide.update(null);for(const entry of dayMounts.values()) entry.mount.update(null);weekGuidanceInvalidated=true; $('homeDownload').disabled=true; $('homeCompare').setAttribute('aria-disabled','true');
    dirty=true; setError(error.message||'The calculation could not be completed. Correct the inputs and update again.');
    $('homeStatus').textContent='Calculation paused. Earlier results, if present, are retained and do not represent the edited inputs.';
  } finally {
    busy=false; $('homeRefresh').disabled=false; $('homeSummary').setAttribute('aria-busy','false');
  }
}

$('homeContext').addEventListener('submit',event=>{event.preventDefault();calculate();});
$('homeContext').addEventListener('input',event=>{
  if(['homeDate','homeTime'].includes(event.target.id)) $('homeClockMode').value='frozen';
  if(['homeLat','homeLon','homeZone'].includes(event.target.id)) $('homePlace').value='custom';
  disableStale();
});
$('homePlace').addEventListener('change',()=>{
  const value=places[$('homePlace').value];
  if(value) { $('homeLat').value=value[0]; $('homeLon').value=value[1]; $('homeZone').value=value[2]; if($('homeClockMode').value==='live') fieldsNow(); }
  else $('homeLocationDetails').open=true;
  disableStale();
});
$('homeCompare').addEventListener('click',event=>{if(!comparison) {event.preventDefault();setError('Update the reading before opening the comparison for these inputs.');}});
$('homeOutlook').addEventListener('click',event=>{if(dirty&&event.target.closest('a.home-day')) {event.preventDefault();$('homeOutlookStale').hidden=false;}});
$('homeDownload').addEventListener('click',()=>{
  if(!outlook||!comparison||dirty) return;
  const packet={...outlook,rows:outlook.rows.map(row=>row.status==='available'?{...row,studyGuidance:buildDayGuidance(row.snapshot)}:row),exportedAt:new Date().toISOString(),privacy:'Contains selected coordinates and time zone. Share deliberately.'};
  const url=URL.createObjectURL(new Blob([JSON.stringify(packet,null,2)],{type:'application/json'})),a=document.createElement('a');
  a.href=url;a.download=`calendar-outlook-${outlook.startDate}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&$('homeClockMode').value==='live'&&!dirty) calculate({automatic:true});});
window.addEventListener('pagehide',()=>{clearInterval(timer);});
window.addEventListener('pageshow',event=>{if(event.persisted) {timer=setInterval(tick,60000);tick();}});
function tick() {if(!document.hidden&&$('homeClockMode').value==='live'&&!dirty) calculate({automatic:true});}
fieldsNow();calculate();timer=setInterval(tick,60000);
