#!/usr/bin/env node
// Independent oracle: pinned Skyfield/JPL coordinates plus elementary spherical
// altitude and a numerical one-dimensional distance minimum. No engine vector
// basis or engine distance/intersection formula is used to construct expectations.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {
 getAstrocartographyBodyPositions,lineGeometryForBody,distanceToAstrocartographyLine,
 intersectAstrocartographyLines,ASTROCARTOGRAPHY_EARTH_RADIUS_KM,
} from '../../assets/js/core/astrocartography.js';
const fixtureBytes=await readFile(new URL('../../research/astrocartography/independent-fixtures.json',import.meta.url));
const fixture=JSON.parse(fixtureBytes),D=Math.PI/180,R=6371.0088;
let checks=0;const groups={ephemeris:0,renderGeometry:0,distance:0,crossings:0,singularities:0};
function ok(condition,message,group){checks++;if(group)groups[group]++;assert.ok(condition,message);}
function near(actual,expected,tolerance,message,group){ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,`${message}: actual ${actual}, expected ${expected}, tolerance ${tolerance}`,group);}
// atan2(sin,cos) independently handles circular differences, including ±180°.
const circular=x=>Math.atan2(Math.sin(x*D),Math.cos(x*D))/D;
const circularNear=(a,b,t,m,g)=>near(circular(a-b),0,t,m,g);
function altitude(body,gast,lat,lon){const p=lat*D,d=body.declinationDegrees*D,h=(gast+lon-body.raDegrees)*D;return Math.asin(Math.max(-1,Math.min(1,Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(h))))/D;}
function sphereDistance(a,b){const p=a.lat*D,q=b.lat*D,dp=q-p,dl=(b.lon-a.lon)*D;const h=Math.max(0,Math.min(1,Math.sin(dp/2)**2+Math.cos(p)*Math.cos(q)*Math.sin(dl/2)**2));return 2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))/D;}
// A completely separate coordinate parameterization: solve the scalar horizon
// equation for latitude at each hour angle; meridians use latitude directly.
function independentPoint(body,gast,angle,x){
 const longitude=body.raDegrees-gast,delta=body.declinationDegrees*D;
 if(angle==='MC'||angle==='IC')return{lat:x/D,lon:circular(longitude+(angle==='IC'?180:0))};
 if(Math.abs(delta)<1e-14)return{lat:x/D,lon:circular(longitude+(angle==='ASC'?-90:90))};
 return{lat:Math.atan(-Math.cos(delta)*Math.cos(x)/Math.sin(delta))/D,lon:circular(longitude+x/D)};
}
function numericalArcDistance(body,gast,angle,place){
 const meridian=angle==='MC'||angle==='IC'||Math.abs(body.declinationDegrees)<1e-12;
 const lo=meridian?-Math.PI/2:angle==='ASC'?-Math.PI:0,hi=meridian?Math.PI/2:angle==='ASC'?0:Math.PI;
 const distance=x=>sphereDistance(place,independentPoint(body,gast,angle,x));
 const n=160,step=(hi-lo)/n;let best=0,value=Infinity;
 for(let i=0;i<=n;i++){const current=distance(lo+i*step);if(current<value){value=current;best=i;}}
 let a=lo+Math.max(0,best-1)*step,b=lo+Math.min(n,best+1)*step;
 const ratio=(Math.sqrt(5)-1)/2;let c=b-ratio*(b-a),d=a+ratio*(b-a),fc=distance(c),fd=distance(d);
 for(let i=0;i<85;i++){if(fc<fd){b=d;d=c;fd=fc;c=b-ratio*(b-a);fc=distance(c);}else{a=c;c=d;fc=fd;d=a+ratio*(b-a);fd=distance(d);}}
 return Math.min(value,fc,fd,distance(lo),distance(hi));
}
const maximum={raArcseconds:0,declinationArcseconds:0,gastArcseconds:0,mcLongitudeArcseconds:0,distanceOracleDegrees:0};
for(const epoch of fixture.epochs){
 const actual=getAstrocartographyBodyPositions(epoch.dateISO);
 const gastError=Math.abs(circular(actual.gastDegrees-epoch.gastDegrees))*3600;maximum.gastArcseconds=Math.max(maximum.gastArcseconds,gastError);
 near(gastError,0,fixture.tolerances.gastArcseconds,`${epoch.dateISO} GAST vs Skyfield`, 'ephemeris');
 for(const expected of epoch.bodies){
  const body=actual.bodies.find(b=>b.id===expected.id);ok(!!body,`${expected.id} is present`,'ephemeris');
  const raError=Math.abs(circular(body.raDegrees-expected.raDegrees))*3600,decError=Math.abs(body.declinationDegrees-expected.declinationDegrees)*3600;
  maximum.raArcseconds=Math.max(maximum.raArcseconds,raError);maximum.declinationArcseconds=Math.max(maximum.declinationArcseconds,decError);
  near(raError,0,fixture.tolerances.raArcseconds,`${epoch.dateISO} ${body.id} RA`, 'ephemeris');near(decError,0,fixture.tolerances.declinationArcseconds,`${epoch.dateISO} ${body.id} declination`,'ephemeris');
  const mc=body.subpoint.lon,mcError=Math.abs(circular(mc-expected.mcEastLongitudeDegrees))*3600;maximum.mcLongitudeArcseconds=Math.max(maximum.mcLongitudeArcseconds,mcError);
  near(mcError,0,fixture.tolerances.mcLongitudeArcseconds,`${epoch.dateISO} ${body.id} MC longitude`,'ephemeris');
 }
}
near(ASTROCARTOGRAPHY_EARTH_RADIUS_KM,R,1e-10,'Declared mean-radius sphere','distance');
const synthetic=[
 {id:'Sun',raDegrees:0,declinationDegrees:0,gast:0},
 {id:'Moon',raDegrees:137.5,declinationDegrees:0,gast:23},
 {id:'Sun',raDegrees:30,declinationDegrees:30,gast:0},
 {id:'Moon',raDegrees:350,declinationDegrees:-30,gast:13},
 {id:'Sun',raDegrees:180,declinationDegrees:66.5,gast:0},
 {id:'Moon',raDegrees:179.999,declinationDegrees:-66.5,gast:0},
 {id:'Sun',raDegrees:270,declinationDegrees:89,gast:91},
 {id:'Moon',raDegrees:110,declinationDegrees:-89,gast:17},
];
for(const body of synthetic){
 const generated=lineGeometryForBody(body,body.gast);ok(generated.lines.length===4,'Non-polar declination has four labeled half-arcs','renderGeometry');
 for(const line of generated.lines){
  ok(line.segments.length>0,'Rendered half-arc has at least one segment','renderGeometry');
  for(const segment of line.segments){
   ok(segment.length>1,'Rendered segments retain two points','renderGeometry');
   for(let i=0;i<segment.length;i++){
    const [lon,lat]=segment[i];ok(Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180+1e-9&&Math.abs(lat)<=90+1e-9,'Finite bounded map coordinates','renderGeometry');
    if(i)ok(Math.abs(lon-segment[i-1][0])<=180+1e-8,'No unsplit dateline jump within one rendered segment','renderGeometry');
    if(line.angle==='MC'||line.angle==='IC')circularNear(lon,body.raDegrees-body.gast+(line.angle==='IC'?180:0),1e-7,'MC/IC limiting longitude including polar endpoints','renderGeometry');
    else {
     near(altitude(body,body.gast,lat,lon),0,1e-7,'Independent scalar horizon equation at every displayed point','renderGeometry');
     if(body.declinationDegrees===0)circularNear(lon,body.raDegrees-body.gast+(line.angle==='ASC'?-90:90),1e-7,'Equatorial-declination horizon arc retains limiting longitude at both poles','renderGeometry');
     if(Math.abs(lat)<89.999999){
      const before=altitude(body,body.gast-0.0001,lat,lon),after=altitude(body,body.gast+0.0001,lat,lon);
      if(Math.abs(after-before)>1e-8)ok(line.angle==='ASC'?after>before:after<before,'Rising/setting classification follows independent time derivative','renderGeometry');
     }
    }
   }
  }
  for(const place of [{lat:0,lon:0},{lat:0,lon:180},{lat:51.4779,lon:0},{lat:-33.8688,lon:151.2093},{lat:78,lon:-179.9},{lat:-88,lon:75}]){
   const expected=numericalArcDistance(body,body.gast,line.angle,place),actual=distanceToAstrocartographyLine(line,place);
   maximum.distanceOracleDegrees=Math.max(maximum.distanceOracleDegrees,Math.abs(actual.angularDistanceDegrees-expected));
   near(actual.angularDistanceDegrees,expected,1e-6,'Distance vs independent scalar minimization over the selected half-arc','distance');
   near(actual.distanceKm,actual.angularDistanceDegrees*D*R,1e-7,'Angular-to-spherical-km conversion','distance');
  }
 }
}
const equatorial=lineGeometryForBody({id:'Sun',raDegrees:0,declinationDegrees:0},0).lines;
for(const [angle,place,expected]of [['MC',{lat:0,lon:180},90],['IC',{lat:0,lon:0},90],['ASC',{lat:0,lon:90},90],['DSC',{lat:0,lon:-90},90]])near(distanceToAstrocartographyLine(equatorial.find(l=>l.angle===angle),place).angularDistanceDegrees,expected,1e-10,'Opposite branch is not zero-distance to a full great circle','distance');
const tilted={id:'Moon',raDegrees:0,declinationDegrees:30};
const rise=lineGeometryForBody(tilted,0).lines.find(l=>l.angle==='ASC');
near(distanceToAstrocartographyLine(rise,{lat:45,lon:-125.26438968275465}).distanceKm,0,1e-7,'Independent45°latitude rising root','singularities');
for(let h=-180;h<=180;h+=5)ok(altitude(tilted,0,70,h)>0,'70°latitude remains circumpolar above the horizon','singularities');
near(distanceToAstrocartographyLine(rise,{lat:70,lon:180}).angularDistanceDegrees,10,1e-9,'Circumpolar place is ten degrees from grazing arc endpoint','singularities');
for(const h of [179.99,180.01])ok(altitude(tilted,0,60,h)>0,'Grazing endpoint has same altitude sign on both sides','singularities');
near(altitude(tilted,0,60,180),0,1e-12,'Tangency is not an ordinary sign-changing rise','singularities');
near(altitude({declinationDegrees:20,raDegrees:0},0,45,0),65,1e-12,'MC transit is not generally overhead','singularities');
for(const declinationDegrees of [-90,90]){const polar=lineGeometryForBody({id:'Sun',raDegrees:123,declinationDegrees},0);ok(polar.lines.length===0,'Celestial pole has no physical RA-defined angular lines','singularities');ok(polar.warnings.length>0,'Celestial-pole omission is disclosed','singularities');}
const get=(body,angle)=>lineGeometryForBody(body,0).lines.find(l=>l.angle===angle);
const a={id:'Sun',raDegrees:0,declinationDegrees:0},b={id:'Moon',raDegrees:90,declinationDegrees:30};
for(const [aa,bb,expectedLon]of [['MC','ASC',0],['IC','DSC',180]]){
 const result=intersectAstrocartographyLines(get(a,aa),get(b,bb));ok(result.points.length===1,'Correct half-arcs retain one antipodal branch','crossings');near(result.points[0].lat,0,1e-9,'Independent crossing latitude','crossings');circularNear(result.points[0].lon,expectedLon,1e-9,'Independent crossing longitude','crossings');ok(result.points[0].kind==='angular-crossing','Regular crossing retains regular classification','crossings');
}
ok(intersectAstrocartographyLines(get(a,'MC'),get(b,'DSC')).points.length===0,'Opposite half-arcs must not inherit a supporting-circle crossing','crossings');
const tangent=intersectAstrocartographyLines(get(a,'MC'),get(tilted,'ASC'));ok(tangent.points.length===1&&tangent.points[0].kind==='grazing-boundary','Tangent closure is explicitly a grazing boundary','crossings');near(tangent.points[0].lat,-60,1e-8,'Independent grazing latitude','crossings');
const poles=intersectAstrocartographyLines(get(a,'MC'),get(b,'MC'));ok(poles.points.length===0&&poles.omittedPolarCount===2,'Geographic-pole coincidences do not become two ordinary crossings','crossings');
for(const separation of [0,1e-10]){
 const unresolved=intersectAstrocartographyLines(get(a,'ASC'),get({id:'Moon',raDegrees:separation,declinationDegrees:0},'ASC'));
 ok(unresolved.points.length===0&&/unresolved/.test(unresolved.status),'Coincident/near-parallel supporting circles are unresolved, not fabricated points','crossings');
}
const nearParallel=intersectAstrocartographyLines(get({id:'Sun',raDegrees:0,declinationDegrees:30},'ASC'),get({id:'Moon',raDegrees:0.000001,declinationDegrees:30.000001},'ASC'));
for(const point of nearParallel.points){near(altitude({raDegrees:0,declinationDegrees:30},0,point.lat,point.lon),0,1e-7,'Near-parallel crossing satisfies first independent plane','crossings');near(altitude({raDegrees:0.000001,declinationDegrees:30.000001},0,point.lat,point.lon),0,1e-7,'Near-parallel crossing satisfies second independent plane','crossings');}
const dateline=get({id:'Sun',raDegrees:30,declinationDegrees:30},'DSC');
const seam=dateline.segments.flat().filter(([lon])=>Math.abs(Math.abs(lon)-180)<1e-9);ok(seam.length>=2,'Dateline crossing has paired seam endpoints','renderGeometry');for(const [,lat]of seam)near(lat,Math.atan(1.5)/D,1e-8,'Exact dateline latitude from independent scalar horizon equation','renderGeometry');
const receipt={kind:'independent-astrocartography-numerics',passed:true,checks,groups,externalEpochs:fixture.epochs.length,externalBodyPositions:fixture.epochs.reduce((n,x)=>n+x.bodies.length,0),fixtureSHA256:createHash('sha256').update(fixtureBytes).digest('hex'),maximumObservedErrors:maximum,tolerances:fixture.tolerances,claimType:fixture.claimType,limits:['Five sampled matched-time epochs do not validate every date in1900–2100.','A mean-radius sphere is not an ellipsoidal geodesic or physical rise/set model.','Geometry checks do not validate astrological predictions or editorial scores.']};
if(process.env.ASTROCARTOGRAPHY_NUMERICS_OUTPUT){await mkdir(dirname(process.env.ASTROCARTOGRAPHY_NUMERICS_OUTPUT),{recursive:true});await writeFile(process.env.ASTROCARTOGRAPHY_NUMERICS_OUTPUT,JSON.stringify(receipt,null,2)+'\n');}
console.log(JSON.stringify(receipt,null,2));
