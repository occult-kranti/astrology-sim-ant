import json,pathlib,re,datetime,hashlib,sys
root=pathlib.Path(__file__).resolve().parents[4];raw=pathlib.Path(sys.argv[1]);receipt=[]
for p in raw.glob('*receipts.json'):receipt+=json.loads(p.read_text())
by={x['key']:x for x in receipt}
for key,row in by.items():
 if 'sha256' in row:assert hashlib.sha256((raw/(key+'.raw')).read_bytes()).hexdigest()==row['sha256'],key
specs=[
('HOBS-OCA-NATIVITY','oca-nativity','Nativity commemoration','Orthodox Church in America','Heading: commemorated on December 25','Selected heading and feast introduction read. Native fixed feast date; project Gregorian/Julian arithmetic is separate from the church website calendar choice.'),
('HOBS-OCA-THEOPHANY','oca-theophany','Theophany commemoration','Orthodox Church in America','Heading: commemorated on January 6','Selected heading and feast introduction read; no local service hour or Sunday transfer inferred.'),
('HOBS-HEBCAL-2027-DIASPORA','hebcal-2027-diaspora','Hebcal 2027 Diaspora date records','Hebcal','Selected title/date/hdate records for Purim, Pesach, Shavuot, Tishri holidays and Chanukah','JSON factual date rows read; evening candle dates distinguished from daytime Hebrew date labels.'),
('HOBS-HEBCAL-2027-ISRAEL','hebcal-2027-israel','Hebcal 2027 Israel date records','Hebcal','Selected title/date/hdate records and absence of eighth Pesach/second Shavuot day','Selected factual dates compared with the separate Diaspora response; both share one publisher/engine.'),
('HOBS-OCA','oca-pascha','Orthodox Church in America, Lenten and Paschal Cycle','OCA','Christian calendar table: Pascha, Western Easter, Ascension and Pentecost for 2026–2030','Selected complete year/date rows read; issuing church table, not universal fixed-feast policy.'),
('HOBS-USCCB-2027','usccb-2027','USCCB Liturgical Calendar 2027','United States Conference of Catholic Bishops','Principal celebrations and introductory Ascension transfer note; Christmas entries','Selected dates and jurisdiction-specific transfer note read; not a full liturgical calendar implementation.'),
('HOBS-USCCB-2028','usccb-2028','USCCB Liturgical Calendar 2028','United States Conference of Catholic Bishops','Principal celebrations: Easter, Ascension, Pentecost','Selected dates read as independent Western computus fixtures.'),
('HOBS-HEBCAL','hebcal-holidays','Jewish holidays, 5786–5791','Hebcal','Major holiday table, Diaspora/Israel selector and sunset/nightfall explanation','Selected holiday dates and boundary explanation read; Hebcal and Chabad are separate publications, not independent astronomical engines.'),
('HOBS-CHABAD-2027','chabad-holidays','Jewish Holidays in 2027','Chabad.org','Purim, Passover, Shavuot, Rosh Hashanah, Yom Kippur, Sukkot and Chanukah entries','Selected dates, Diaspora qualifications and sunset/nightfall wording read.'),
('HOBS-GOVHK-2027','govhk-holidays','General holidays for 2027','Hong Kong Government','Gazetted table: Lunar New Year, Ching Ming, Buddha birthday, Tuen Ng, day after Mid-Autumn, Chung Yeung','Selected dates read; replacement public holidays are not confused with festival dates.'),
('HOBS-SINGAPORE-MOM','mom-holidays','Public holidays, 2026 and 2027','Singapore Ministry of Manpower','2026 Vesak and Deepavali; 2027 Vesak, Deepavali and Hari Raya rows','Published regional civil-holiday dates read; not a global Hindu/Buddhist calendar.'),
('HOBS-MUIS-2027','muis-dates-2027','Key Islamic dates 2027 / 1448–1449H','Islamic Religious Council of Singapore (MUIS)','One-page month-start and Islamic-events tables','Both tables read. The Islamic New Year heading says 1448H while its native-date column says 1 Muharram 1449H; use the explicit native date and record the source typo.'),
('HOBS-MUIS-CALENDAR-2027','muis-calendar-2027','Islamic Calendar 2027M','MUIS','Calendar month/date grid','Grid retrieved and selected dates inspected; same issuing authority as the key-date sheet, not an independent authority.'),
('HOBS-BAHAI','bahai-calendar','The Bahá’í Calendar','Worldwide Bahá’í Community','Introduction, sunset rule and selected 2026 holy-day display','Selected explanatory paragraphs and published table read; no claim to have read all source books.'),
('HOBS-BAHAI-DATA','bahai-js','Published Bahá’í calendar year data and date rules','Worldwide Bahá’í Community','Calendar component JSON records for 182–187 BE; named holy-day date mapping','Selected official client-side factual date records and mapping inspected without executing downloaded code. Only factual dates are retained; source application code is not copied.'),
('HOBS-BAHAI-UHJ','bahai-uhj','Universal House of Justice, 10 July 2014','Universal House of Justice','Implementation of the Badí‘ calendar; Tehran, equinox and Twin Birthdays','Selected calendar-method paragraphs read; same tradition authority as the official calendar, not independent date validation.'),
('HOBS-AVESTA-CALENDAR','zoro-calendar','The Zoroastrian Religious Calendar','Avesta.org / Joseph H. Peterson','Fasli, Shahanshahi and Qadimi descriptions','Selected modern-calendar definitions read. Only this source’s expressly fixed 21 March Fasli variant is encoded.'),
('HOBS-IRANICA-CALENDAR','iranica-other','Calendars IV: Other Modern Calendars','Encyclopaedia Iranica','Modern Zoroastrian calendars, first paragraphs; published 15 December 1990','Selected historical account of distinct communities and Gregorian-like Fasli reform read; does not independently validate every future 21 March observance.'),
('HOBS-SGPC-CALENDAR','sgpc-calendar','Nanakshahi Calendar official download page','Shiromani Gurdwara Parbandhak Committee','2026–27 calendar and Jantri links','Download-page metadata read. The linked Punjabi PDF was retrieved but no dated passage translated/verified; no dates are encoded from it.'),
('HOBS-JAINWORLD','jainworld-festivals','Jain Festivals','Jainworld','Paryushan, Mahavir birthday and Diwali paragraphs','Selected community descriptions read; regional lunar month/day rules do not supply verified future Gregorian dates here.'),
('HOBS-JINJA','shinto-matsuri','Matsuri','Jinja Honcho','Seasonal festivals and local shrine diversity','Selected official explanatory text read; no universal dated shrine schedule is asserted.'),
]
for year in range(2026,2032):specs.append((f'HOBS-HKO-{year}',f'hko-text-{year}',f'Gregorian–Lunar Calendar Conversion Table of {year}','Hong Kong Observatory','Daily Gregorian/lunar date rows and Bright & Clear solar term','Daily source table parsed; selected festival rows inspected. The table is a Hong Kong convention; repeated lunar-month labels mark the intercalary month and are excluded from ordinary-month festivals.'))
sources=[]
for sid,key,title,pub,locator,depth in specs:
 r=by[key];sources.append({'id':sid,'title':title,'publisher':pub,'url':r['finalURL'],'sourceKind':'official-community-calendar' if 'HOBS-HKO' not in sid else 'official-calendar-table','locator':locator,'retrievedAt':r['retrievedAt'],'httpStatus':r['status'],'sha256':r['sha256'],'readingDepth':depth,'rights':'Source copyright retained. This project stores factual dates, original paraphrases and bibliographic metadata; no complete source page or PDF is redistributed.'})
for source in sources:
 if source['id'].startswith('HOBS-HEBCAL'):source['sourceKind']='community-software-calendar'
 elif source['id']=='HOBS-IRANICA-CALENDAR':source['sourceKind']='academic-reference'
 elif source['id'] in ['HOBS-AVESTA-CALENDAR','HOBS-JAINWORLD']:source['sourceKind']='community-reference'
 elif source['id']=='HOBS-JINJA':source['sourceKind']='official-community-explanation'
 elif source['id']=='HOBS-SGPC-CALENDAR':source['sourceKind']='official-publication-metadata'
sources.append({'id':'HOBS-CIVIL','title':'Canonical civil calendar methods','publisher':'Astrologer’s Workbench','url':'docs/2026-10-calendar-methods.md','sourceKind':'inherited-project-method','locator':'calendar-observatory.js civilRows; cultural-calendars.js; calendar.js','readingDepth':'Actual 13-converter implementation and selected existing tests inspected; no full-range religious authority claim.','rights':'Project implementation and documentation licence applies.'})
# Read the complete HKO daily grid, identify repeated month starts rather than
# assigning a second ordinary festival to an intercalary month.
chinese=[]
fest={(1,1):('lunar-new-year','Lunar New Year'),(5,5):('tuen-ng','Tuen Ng / Dragon Boat Festival'),(8,15):('mid-autumn','Mid-Autumn Festival'),(9,9):('chung-yeung','Chung Yeung Festival')}
for year in range(2026,2032):
 previous=None;month=None;leap=False;count=0
 for line in (raw/f'hko-text-{year}.raw').read_text().splitlines():
  m=re.match(r'(\d{4})/(\d+)/(\d+)\s+(.+?)\s{2,}(.+)',line)
  if not m:continue
  y,mo,d,lunar,tail=m.groups();date=f'{y}-{int(mo):02}-{int(d):02}';count+=1
  if 'Lunar Month' in lunar:
   month=int(re.search(r'\d+',lunar)[0]);leap=month==previous;previous=month;day=1
  else:day=int(lunar)
  key=fest.get((month,day)) if not leap else None
  if key and '2026-01-01'<=date<='2031-01-01':chinese.append({'date':date,'key':key[0],'title':key[1],'month':month,'day':day,'leap':False,'sourceId':f'HOBS-HKO-{year}'})
  if 'Bright & Clear' in tail and '2026-01-01'<=date<='2031-01-01':chinese.append({'date':date,'key':'ching-ming','title':'Ching Ming / Qingming solar-term date','month':month,'day':day,'leap':leap,'sourceId':f'HOBS-HKO-{year}'})
 assert count==(366 if year%4==0 else 365),(year,count)
# Official Bahai page publishes only factual calendar anchors here. Named
# holy-day offsets are visible in its source mapping and documented separately.
bundle=(raw/'bahai-js.raw').read_text()
bahai=[row for row in json.loads(re.search(r"JSON.parse\('(\[\{\"bahaiEra\".*?\])'\)",bundle)[1]) if 2025<=row['calendarYearStart']<=2030]
convert=lambda s:'-'.join(reversed(s.split('/')))
for row in bahai:
 row['nawRuz']=convert(row.pop('gregorianNawRuzDate'));row['birthOfBab']=convert(row['twinBirthdays']['birthOfTheBab']['date']);row['birthOfBahaullah']=convert(row['twinBirthdays']['birthOfBahaullah']['date']);del row['twinBirthdays'];row['ayyamStart']=convert(row['ayyamIHa']['startDate']);row['ayyamEnd']=convert(row['ayyamIHa']['endDate']);del row['ayyamIHa']
regional=[
 {'date':'2026-05-31','key':'vesak','title':'Vesak Day — Singapore published holiday','familyId':'buddhist','variantId':'singapore-published','region':'Singapore','sourceIds':['HOBS-SINGAPORE-MOM']},
 {'date':'2026-11-08','key':'deepavali','title':'Deepavali — Singapore published holiday','familyId':'hindu','variantId':'singapore-published','region':'Singapore','sourceIds':['HOBS-SINGAPORE-MOM']},
 {'date':'2027-10-28','key':'deepavali','title':'Deepavali — Singapore published holiday','familyId':'hindu','variantId':'singapore-published','region':'Singapore','sourceIds':['HOBS-SINGAPORE-MOM']},
 {'date':'2027-05-20','key':'vesak','title':'Vesak Day — Singapore published holiday','familyId':'buddhist','variantId':'singapore-published','region':'Singapore','sourceIds':['HOBS-SINGAPORE-MOM']},
 {'date':'2027-05-13','key':'buddha-birthday','title':'Birthday of the Buddha — Hong Kong published holiday','familyId':'buddhist','variantId':'hong-kong-published','region':'Hong Kong','sourceIds':['HOBS-GOVHK-2027'],'native':{'month':4,'day':8,'leap':False}},
]
for date,key,title,native in [('2027-02-08','ramadan-start','Ramadan begins',{'month':'Ramadan','day':1}),('2027-03-10','eid-fitr','Eid al-Fitr / Hari Raya Aidilfitri',{'month':'Shawwal','day':1}),('2027-05-17','eid-adha','Eid al-Adha / Hari Raya Aidiladha',{'month':'Dhuʻl-Hijjah','day':10}),('2027-06-06','hijri-new-year','Islamic New Year',{'month':'Muharram','day':1}),('2027-06-15','ashura','Ashura / Asyura',{'month':'Muharram','day':10})]:regional.append({'date':date,'key':key,'title':title+' — MUIS published date','familyId':'islamic','variantId':'singapore-muis-published','region':'Singapore / MUIS calendar','sourceIds':['HOBS-MUIS-2027']+(['HOBS-SINGAPORE-MOM'] if key.startswith('eid-') else []),'native':native})
coverage=[]
def cv(id,family,label,status,methods,limits,sources,**extra):coverage.append({'id':id,'familyId':family,'label':label,'status':status,'methods':methods,'limitations':limits,'sourceIds':sources,**extra})
cv('christian-western','christian','Selected Western Christian computus and fixed dates','partial','Canonical Gregorian Easter; selected Easter-relative days and Gregorian Christmas/Epiphany.','Not every feast, church, local transfer or obligation; Ascension Thursday and Sunday-transfer conventions remain separate.',['HOBS-OCA','HOBS-USCCB-2027','HOBS-USCCB-2028'])
cv('christian-eastern','christian','Selected Eastern Julian computus and fixed dates','partial','Canonical Julian Pascha converted to Gregorian; selected relative days and Julian Christmas/Epiphany.','Not a claim that all Eastern churches use Julian fixed feasts; revised-Julian/Gregorian communities differ.',['HOBS-OCA'])
cv('jewish-fixed','jewish','Selected fixed Hebrew holiday dates','partial','Canonical Hebrew civil date labels, selected month/day rules; Israel/Diaspora duration variants.','Daytime Gregorian date only. Sunset/nightfall not calculated; postponed fasts, all 8 Hanukkah days and local observance decisions not implemented.',['HOBS-HEBCAL','HOBS-CHABAD-2027'])
for id in ['islamic-civil','islamic-umalqura']:cv(id,'islamic',id+' projected observance labels','projection','Selected native month/day rules on the named runtime calendar.','Not an observed-crescent or local-authority determination; religious sunset boundaries are not calculated.',['HOBS-MUIS-2027','HOBS-CIVIL'])
cv('islamic-muis','islamic','Selected MUIS 2027 published dates','published-subset','Named dated rows from the Singapore authority.','Regional publication only; later years not extrapolated from this sheet.',['HOBS-MUIS-2027'],publishedThrough='2027-12-31')
cv('chinese-hko','chinese','Selected Chinese festivals and Qingming','published-derived-subset','HKO 2026–2031 daily tables plus named regular-month rules corroborated in GovHK 2027.','Hong Kong convention. Runtime Chinese label mismatch is retained. Intercalary month is excluded; not all East Asian traditions.',['HOBS-GOVHK-2027']+[f'HOBS-HKO-{y}' for y in range(2026,2032)])
cv('hindu-regional','hindu','Selected regional Hindu public dates','published-subset','Singapore Deepavali 2026/2027.','Indian national Saka does not calculate Hindu festivals; regional tithi/sunrise rules and 2028–2030 dates remain unavailable.',['HOBS-SINGAPORE-MOM'],publishedThrough='2027-12-31')
cv('buddhist-regional','buddhist','Selected regional Buddhist public dates','published-subset','Singapore Vesak 2026/2027 and Hong Kong Buddha birthday 2027.','Distinct communities/dates retained. Thai Buddhist era does not calculate Buddhist observances; broader future calendars remain unavailable.',['HOBS-SINGAPORE-MOM','HOBS-GOVHK-2027'],publishedThrough='2027-12-31')
cv('sikh-community','sikh','Sikh community observance schedules','unavailable','SGPC calendar publication identified.','No independently checked translated festival date or selected Nanakshahi/Bikrami implementation; no future dates inferred.',['HOBS-SGPC-CALENDAR'])
cv('jain-community','jain','Jain community observance schedules','unavailable','Selected community festival descriptions only.','Svetambara/Digambara and regional lunar-month rules require a named engine and authoritative Gregorian fixtures.',['HOBS-JAINWORLD'])
cv('bahai-official','bahai','Official Bahá’í calendar dates','published-derived-subset','Official 182–187 BE year anchors, Twin Birthdays, intercalary ranges and selected holy-day mapping.','Sunset-to-sunset boundaries; exact sunset not calculated. Not an independently implemented Tehran equinox/new-moon solver.',['HOBS-BAHAI','HOBS-BAHAI-DATA','HOBS-BAHAI-UHJ'])
cv('zoroastrian-fasli','zoroastrian','Avesta.org-described fixed 21 March Fasli Naw Ruz','source-rule-subset','Only explicitly named fixed-date source convention.','Shahanshahi, Qadimi and astronomical-equinox variants are not supplied; no Persian civil-date substitution. Independent future fixture validation remains pending.',['HOBS-AVESTA-CALENDAR','HOBS-IRANICA-CALENDAR'])
cv('shinto-local','shinto','Local Shinto shrine festivals','unavailable','Official Jinja Honcho account of seasonal and local variation.','No universal shrine schedule or future dates inferred from Japanese era labels.',['HOBS-JINJA'])
for id in ['gregory','julian','hebrew','islamic-civil','islamic-umalqura','chinese','buddhist','indian','persian','coptic','ethiopic','japanese','roc']:
 cv('civil-'+id,'civil',id+' canonical civil converter','inherited-civil-conversion','Existing compareMoment calendar row; no duplicate converter.','Runtime and original fixture limits remain. Civil label alone is not religious authority or a complete observance calendar.',['HOBS-CIVIL'],calendarId=id,kind='civil-converter')
# Persist access failures honestly; copied content bodies remain outside repository.
used={x[1] for x in specs}
for row in receipt:
 row['readingStatus']='selected-passages-or-factual-rows-read' if row['key'] in used else 'retrieved-not-used'
 if row.get('status')!=200:row['readingStatus']='access-failed'
 if row['key'] in ['baps-festivals','islamic-aid-calendar']:row['readingStatus']='redirected-no-requested-date-support'
 if row['key']=='sgpc-2026':row['readingStatus']='retrieved-untranslated-date-passages'
 receipt_note={}
(root/'docs/evidence/horizon/observances/sources.json').write_text(json.dumps({'purpose':'Selected official/community observance facts and explicit unavailable coverage','retrievals':receipt,'sourceCatalogue':sources,'rights':'No complete copyrighted source bodies or application bundles committed. Selected factual dates and original metadata only.'},ensure_ascii=False,indent=2)+'\n')
prefix='// Selected source-qualified date facts. Source bodies are not redistributed.\n// See docs/2026-10-horizon-observances.md and the committed retrieval receipt.\nconst freeze = value => { if(value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };\n'
for name,value in [('HORIZON_OBSERVANCE_SOURCES',sources),('HORIZON_OBSERVANCE_COVERAGE',coverage),('HKO_OBSERVANCE_DATES',chinese),('BAHAI_PUBLISHED_YEARS',bahai),('REGIONAL_OBSERVANCE_DATES',regional)]:prefix+='export const '+name+' = freeze('+json.dumps(value,ensure_ascii=False,indent=2)+');\n'
(root/'assets/js/core/data/horizon-observances.js').write_text(prefix)
print(json.dumps({'sources':len(sources),'coverage':len(coverage),'chineseDates':len(chinese),'bahaiYears':len(bahai),'regionalDates':len(regional),'retrievals':len(receipt)}))
