// Standards catalogue and small interchange helpers. No DOM, network or clock.
// Implementation/source/adapter status is explicit; see dated source ledger.
import { parseExplicitInstant } from '../instant-boundary.js';
export const STANDARD_CATEGORIES = [
  ['all', 'All standards'], ['time', 'Time & calculations'], ['exchange', 'Files & provenance'], ['integration', 'AI & backend adapters'], ['sources', 'Books & specialist contracts'],
];
const source = (title, url) => ({ title, url });
export const OBSERVATORY_STANDARDS = [
  { id:'instant', category:'time', title:'RFC 3339 · one explicit instant', status:'Local implementation', implementation:'The shared exact-instant parser normalizes an offset timestamp to UTC. This application rejects leap-second notation and implicit-local timestamps.', license:'Internet standard; no new library bundled.', purpose:'Keep a timestamp distinct from a local clock, date-only question or unknown birth time.', example:'Normalize the selected timestamp', sources:[source('RFC 3339 §5.6–5.7','https://www.rfc-editor.org/rfc/rfc3339.html#section-5.6')], limits:'The app’s accepted subset and 1900–2100 comparison range are narrower than the RFC. UTC-like JavaScript days do not implement leap seconds.' },
  { id:'zones', category:'time', title:'IANA zones · explicit DST policy', status:'Local implementation', implementation:'Intl/tzdb-backed resolver implements reject / earlier / later. Temporal is a reference for the policy; no Temporal polyfill is bundled.', license:'Runtime API; IANA data and host implementation have their own terms.', purpose:'Resolve a local date and clock without borrowing the phone’s zone or guessing a repeated clock.', example:'Run the New York DST fold demonstration', sources:[source('IANA Time Zone Database','https://www.iana.org/time-zones'),source('Temporal ZonedDateTime.from','https://tc39.es/proposal-temporal/#sec-temporal-zoneddatetime-static-from')], limits:'Historical zone data and aliases depend on the runtime. Coordinates do not choose a legal/civil time zone.' },
  { id:'intl', category:'time', title:'Intl / ICU · named civil calendars', status:'Local implementation', implementation:'Thirteen named rows reuse the comparison engine: Gregorian/Julian arithmetic plus eleven runtime-checked Intl IDs.', license:'Native Intl; no new calendar package shipped.', purpose:'Show one instant using named civil conventions and retain non-Gregorian parts, eras and leap-month names.', example:'Compare all supported civil date labels', sources:[source('ECMA-402 DateTimeFormat','https://tc39.es/ecma402/#sec-intl-datetimeformat-constructor'),source('ICU calendar services','https://unicode-org.github.io/icu/userguide/datetime/calendar/')], limits:'Runtime-supported is not independently validated across the full date range. Civil midnight is not a religious sunset/sunrise observance decision.' },
  { id:'astronomy', category:'time', title:'Astronomy Engine · sky quantities', status:'Local implementation', implementation:'The existing vendored engine supplies apparent geocentric positions and lunar illumination; the application supplies astrological conventions separately.', license:'Astronomy Engine MIT; existing notice retained.', purpose:'Separate real astronomical coordinates from zodiac partitions and symbolic interpretation.', example:'Calculate Sun, Moon, elongation and illumination', sources:[source('Astronomy Engine upstream','https://github.com/cosinekitty/astronomy')], limits:'No camera measurement is made. The upstream accuracy target does not validate all wrappers, historical epochs or predictive interpretations.' },
  { id:'adhan', category:'time', title:'Adhan · method-labelled prayer times', status:'Local implementation', implementation:'Existing MIT Adhan 4.4.6 snapshot with documented UTC adaptation, method and high-latitude choices.', license:'MIT; see retained assets/vendor/adhan/LICENSE.', purpose:'Produce a calculated local timetable while preserving absent polar events and method differences.', example:'Calculate the selected day’s timetable', sources:[source('Adhan source and methods','https://github.com/batoulapps/adhan-js'),source('Bundled provenance','assets/vendor/adhan/PROVENANCE.md')], limits:'The lab uses Muslim World League, Shafi and middle-of-night choices. It is not a local religious ruling, crescent sighting or terrain-corrected timetable.' },
  { id:'svg', category:'exchange', title:'SVG + PNG · deterministic graphics', status:'Local implementation', implementation:'Native standalone SVG from computed longitudes; browser Canvas rasterizes the same SVG to PNG on request.', license:'Web standards; native browser APIs, no new drawing framework.', purpose:'Keep a machine-readable vector, accessible text alternative and an actual downloadable raster.', example:'Render and export a Sun–Moon longitude diagram', sources:[source('SVG 2','https://www.w3.org/TR/SVG2/'),source('PNG specification','https://www.w3.org/TR/png/')], limits:'This is a calculated coordinate diagram, not a sky photograph or authentic historical plate. PNG export needs Canvas support.' },
  { id:'json', category:'exchange', title:'JSON Schema · a bounded record contract', status:'Local contract + schema example', implementation:'Draft 2020-12 schema is downloadable. The lab validates its own small record contract with explicit checks; it does not bundle a general JSON Schema validator.', license:'Schema standard; no Ajv or other validator installed.', purpose:'Reject missing/invalid context before a backend stores a study record.', example:'Validate a study record and a deliberately invalid fixture', sources:[source('JSON Schema 2020-12 core','https://json-schema.org/draft/2020-12/json-schema-core')], limits:'Schema format annotations alone are not date/zone validation. Backend code must use a full compatible validator plus semantic checks where required.' },
  { id:'ical', category:'exchange', title:'iCalendar RFC 5545 · a study appointment', status:'Local export', implementation:'One UTC VEVENT with escaped text, CRLF and UTF-8-aware 75-octet line folding. No external calendar account is contacted.', license:'Internet standard; no new library bundled.', purpose:'Move a selected study time into a calendar without implying an automatic personal forecast.', example:'Build and download a 30-minute study event', sources:[source('RFC 5545 §3.1, §3.6.1','https://www.rfc-editor.org/rfc/rfc5545.html')], limits:'This is one explicit appointment, not recurring religious observances, exact event search, OAuth sync or a universal holiday feed. Import behavior varies by calendar app.' },
  { id:'provenance', category:'exchange', title:'Provenance · facts, methods and source roles', status:'Local record example', implementation:'A compact application envelope maps entity / activity / derivation concepts to source-labelled calculations. It is PROV-inspired JSON, not a claimed RDF/PROV-O conformance implementation.', license:'Application-authored record; linked source/edition rights remain separate.', purpose:'Preserve what was calculated, which model was used and what a source does or does not support.', example:'Build a source-linked derivation record', sources:[source('W3C PROV-O','https://www.w3.org/TR/prov-o/'),source('Workbench source review','docs/2026-10-calendar-observatory-research.md')], limits:'A source link is provenance, not proof of predictive validity, full-book reading, independent corroboration or copyright permission.' },
  { id:'sqlite', category:'integration', title:'SQLite · portable local study records', status:'Executable SQL adapter example', implementation:'Generate a strict-table schema and insert fixture. The browser does not load SQLite or create a database; the SQL can be imported into a real SQLite CLI/runtime.', license:'SQLite engine is public domain; no SQLite binary or WASM bundled here.', purpose:'Make the local/exported record boundary concrete without claiming a connected backend.', example:'Generate a SQLite schema and selected-record insert', sources:[source('SQLite CREATE TABLE','https://www.sqlite.org/lang_createtable.html'),source('SQLite strict tables','https://www.sqlite.org/stricttables.html')], limits:'Actual storage, encryption, backups and migrations belong to the chosen host. SQL export can contain selected coordinates; share deliberately.' },
  { id:'postgres', category:'integration', title:'PostgreSQL · typed shared storage', status:'SQL adapter example', implementation:'Generate a timestamptz/jsonb table and parameterized insert shape. No remote database is contacted.', license:'PostgreSQL License; no database dependency bundled.', purpose:'Keep UTC instants, zone names, method versions and provenance distinct in shared storage.', example:'Generate PostgreSQL DDL and parameter values', sources:[source('PostgreSQL CREATE TABLE','https://www.postgresql.org/docs/current/sql-createtable.html')], limits:'timestamptz retains an instant, not the original IANA zone; store that zone separately. This example does not create a server, account or auth policy.' },
  { id:'supabase', category:'integration', title:'Supabase Auth + RLS · optional private sync', status:'Proposed integration; SQL example', implementation:'Generate an authenticated per-user table and SELECT/INSERT/UPDATE/DELETE policies. No project, connection, sign-in or deployed policy is implied.', license:'Hosted service terms apply; dependencies/licenses require a separate deployment review.', purpose:'Give a future backend an explicit owner boundary rather than publishing personal studies.', example:'Generate owner-scoped RLS policies', sources:[source('Supabase RLS','https://supabase.com/docs/guides/database/postgres/row-level-security')], limits:'Must be tested with two real users and anonymous access before deployment. Service-role keys stay on the server. A browser key is not an authorization policy.' },
  { id:'mcp', category:'integration', title:'MCP · read-only calculation tools', status:'Existing server; request example', implementation:'The separate official-SDK Node backend exposes strict allowlisted tools. This page builds a JSON-RPC call fixture; it does not call a remote server.', license:'Official SDK Apache-2.0; existing lockfile and notices remain authoritative.', purpose:'Let an authorized AI client request the same deterministic calculation with explicit inputs.', example:'Build workbench_compare_moment tools/call JSON', sources:[source('MCP transports specification','https://modelcontextprotocol.io/specification/2025-11-25/basic/transports'),source('Local backend setup','mcp/README.md')], limits:'GitHub Pages cannot execute the MCP process. Initialize/session/OAuth/host policy is transport-specific; a request preview is not a live connection or a successful client call.' },
  { id:'openai', category:'integration', title:'OpenAI Responses + remote MCP', status:'Server request adapter example', implementation:'Generate a request body with explicitly configurable model/server URL and required tool approval. No OpenAI API request, token use or inference occurs here.', license:'Provider API terms, access, billing and retention apply.', purpose:'Use an authenticated backend/client for source-grounded explanations without borrowing this ChatGPT conversation’s login.', example:'Build a Responses request with an MCP tool', sources:[source('OpenAI remote MCP guide','https://developers.openai.com/api/docs/guides/tools-connectors-mcp'),source('Responses API reference','https://developers.openai.com/api/reference/resources/responses/methods/create')], limits:'Model/account access and remote-server authorization need real configured credentials outside Pages. Input/provider strings are request data, not permission to send anything automatically.' },
  { id:'image', category:'integration', title:'OpenAI Image API · editorial artwork adapter', status:'Server request adapter example', implementation:'Generate an image-generation request from an editable descriptive prompt. No image model is called; local SVG/PNG above remains available without a provider.', license:'Provider terms and source-image rights apply; a generated image is not a historical artifact.', purpose:'Plan labelled editorial illustrations separately from deterministic calculation graphics.', example:'Build an image request with a visible provenance disclaimer', sources:[source('OpenAI image generation guide','https://developers.openai.com/api/docs/guides/image-generation')], limits:'The model is a configurable placeholder; account/model availability is unverified. A documented model name is not evidence of access. Do not fabricate authentic book plates, photographs or observational proof.' },
  { id:'rights', category:'sources', title:'Edition + passage + rights · source discipline', status:'Existing source catalogue + example', implementation:'Existing study lenses retain title, section, edition, claim status and limits. The lab shows a real Agrippa passage record and a deliberately separated modern reconstruction.', license:'Rights depend on edition, translation, commentary, territory and asset; free-to-read is not permission to redistribute.', purpose:'Let an occult-book specialist explain a supplied passage without pretending to have read every book or participated as a historical author.', example:'Inspect the existing Agrippa II.34 source record', sources:[source('Agrippa II.34','https://esotericarchives.com/agrippa/agripp2c.htm'),source('Study source ledger','docs/2026-10-05-study-sources.md')], limits:'The ordinary sunrise/sunset hour method is implemented; the reported oblique-ascension alternative is not. Textual attribution does not validate ritual or predictive efficacy.' },
];

export const STUDY_RECORD_SCHEMA = {
  $schema:'https://json-schema.org/draft/2020-12/schema', title:'Observatory study record v1', type:'object', additionalProperties:false,
  required:['schemaVersion','atUTC','timeZone','observer','method','sourceIds'],
  properties:{schemaVersion:{const:1},atUTC:{type:'string',format:'date-time'},timeZone:{type:'string',minLength:1,maxLength:120},observer:{type:'object',additionalProperties:false,required:['latitude','longitude'],properties:{latitude:{type:'number',minimum:-90,maximum:90},longitude:{type:'number',minimum:-180,maximum:180}}},method:{const:'observatory-comparison-v1'},sourceIds:{type:'array',minItems:1,maxItems:40,items:{type:'string',minLength:1,maxLength:120}}},
};

// The checks implement this particular record boundary, not general JSON Schema.
export function validateStandardsRecord(value) {
  const errors=[];const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
  if(!obj(value))return{valid:false,errors:['Record must be an object.']};
  const allowed=Object.keys(STUDY_RECORD_SCHEMA.properties);
  for(const k of Object.keys(value))if(!allowed.includes(k))errors.push(`Unknown property: ${k}`);
  for(const k of STUDY_RECORD_SCHEMA.required)if(!(k in value))errors.push(`Missing property: ${k}`);
  if(value.schemaVersion!==1)errors.push('schemaVersion must equal 1.');
  if(value.method!=='observatory-comparison-v1')errors.push('method must name observatory-comparison-v1.');
  if(typeof value.atUTC!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value.atUTC)||!Number.isFinite(Date.parse(value.atUTC))||new Date(value.atUTC).toISOString().slice(0,19)!==value.atUTC.slice(0,19))errors.push('atUTC must be a valid explicit UTC timestamp.');
  if(typeof value.timeZone!=='string'||!value.timeZone||value.timeZone.length>120)errors.push('timeZone must be a named runtime-supported zone.');
  else try{new Intl.DateTimeFormat('en',{timeZone:value.timeZone});}catch{errors.push('timeZone is unavailable in this runtime.');}
  if(!obj(value.observer))errors.push('observer must be an object.');
  else{for(const k of Object.keys(value.observer))if(!['latitude','longitude'].includes(k))errors.push(`Unknown observer property: ${k}`);for(const [k,limit]of[['latitude',90],['longitude',180]])if(!Number.isFinite(value.observer[k])||Math.abs(value.observer[k])>limit)errors.push(`${k} must be finite and within ±${limit}.`);}
  if(!Array.isArray(value.sourceIds)||value.sourceIds.length<1||value.sourceIds.length>40||value.sourceIds.some(x=>typeof x!=='string'||!x||x.length>120))errors.push('sourceIds needs 1–40 nonempty bounded source IDs.');
  return{valid:errors.length===0,errors};
}

export function escapeICalText(text){return String(text).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');}
export function foldICalLine(line){const enc=new TextEncoder();let out='',part='',size=0;for(const c of line){const n=enc.encode(c).length;if(size+n>75){out+=part+'\r\n';part=' ';size=1;}part+=c;size+=n;}return out+part;}
export function createStudyICalendar({atUTC,generatedAtUTC,title='Calendar Observatory study',description='Source-labelled study appointment; no personal forecast.',uid='study@astrology-sim-ant',durationMinutes=30}){
  const at=parseExplicitInstant(atUTC),generated=parseExplicitInstant(generatedAtUTC);if(!Number.isInteger(durationMinutes)||durationMinutes<1||durationMinutes>1440)throw new RangeError('A 1–1440 minute duration is required.');
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  // UTC DTSTART/DTEND avoid supplying an incomplete VTIMEZONE definition.
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Astrologers Workbench//Standards Lab 1//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${escapeICalText(uid)}`,`DTSTAMP:${stamp(generated)}`,`DTSTART:${stamp(at)}`,`DTEND:${stamp(new Date(at.getTime()+durationMinutes*60000))}`,`SUMMARY:${escapeICalText(title)}`,`DESCRIPTION:${escapeICalText(description)}`,'END:VEVENT','END:VCALENDAR'].map(foldICalLine).join('\r\n')+'\r\n';
}

export const SQLITE_SCHEMA = `CREATE TABLE IF NOT EXISTS study_records (\n  id TEXT PRIMARY KEY,\n  at_utc TEXT NOT NULL,\n  time_zone TEXT NOT NULL,\n  latitude REAL NOT NULL CHECK(latitude BETWEEN -90 AND 90),\n  longitude REAL NOT NULL CHECK(longitude BETWEEN -180 AND 180),\n  method TEXT NOT NULL,\n  source_ids_json TEXT NOT NULL CHECK(json_valid(source_ids_json))\n) STRICT;`;
export const POSTGRES_SCHEMA = `CREATE TABLE study_records (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  at_utc timestamptz NOT NULL,\n  time_zone text NOT NULL,\n  latitude double precision NOT NULL CHECK(latitude BETWEEN -90 AND 90),\n  longitude double precision NOT NULL CHECK(longitude BETWEEN -180 AND 180),\n  method text NOT NULL,\n  provenance jsonb NOT NULL\n);`;
export const SUPABASE_SCHEMA = `-- Example only: review migrations and test anonymous + two-user access.\nCREATE TABLE public.private_studies (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  at_utc timestamptz NOT NULL,\n  time_zone text NOT NULL,\n  payload jsonb NOT NULL,\n  created_at timestamptz NOT NULL DEFAULT now()\n);\nALTER TABLE public.private_studies ENABLE ROW LEVEL SECURITY;\nGRANT SELECT, INSERT, UPDATE, DELETE ON public.private_studies TO authenticated;\nCREATE POLICY own_read ON public.private_studies FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);\nCREATE POLICY own_insert ON public.private_studies FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);\nCREATE POLICY own_update ON public.private_studies FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);\nCREATE POLICY own_delete ON public.private_studies FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);\n-- Do not expose service-role secrets. A real deployment must verify grants,\n-- policy behavior, backups, export/deletion and retention with actual identities.`;

// BEGIN GENERATED SPECIALIST PROFILES
const specialistProfiles = [
  {
    "id": "calendar-gregory",
    "kind": "calendar",
    "title": "Gregorian civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Proleptic Gregorian civil date in an explicit IANA zone; midnight boundary.",
    "validation": "Inherited selected arithmetic fixtures. No universal historical adoption-gap reconstruction.",
    "path": ".claude/skills/calendar-gregory/SKILL.md"
  },
  {
    "id": "calendar-julian",
    "kind": "calendar",
    "title": "Julian civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Local Gregorian civil day → JDN → proleptic Julian; noon JDN convention distinct from midnight civil day.",
    "validation": "Inherited selected conversion fixtures. Not a Julian-church observance authority or universal adoption history.",
    "path": ".claude/skills/calendar-julian/SKILL.md"
  },
  {
    "id": "calendar-hebrew",
    "kind": "calendar",
    "title": "Hebrew civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl hebrew, selected-zone civil midnight; preserve month/era parts.",
    "validation": "Inherited selected daytime fixtures; no sunset date, Israel/diaspora policy or full-range religious validation.",
    "path": ".claude/skills/calendar-hebrew/SKILL.md"
  },
  {
    "id": "calendar-islamic-civil",
    "kind": "calendar",
    "title": "Islamic tabular civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl islamic-civil arithmetic convention, selected-zone civil midnight.",
    "validation": "Runtime support checked; independent display-date fixtures pending. Not crescent sighting or local religious authority.",
    "path": ".claude/skills/calendar-islamic-civil/SKILL.md"
  },
  {
    "id": "calendar-islamic-umalqura",
    "kind": "calendar",
    "title": "Islamic Umm al-Qura civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl islamic-umalqura data/convention; preserve support and range caveats.",
    "validation": "Runtime support checked; independent display-date fixtures pending. Table/fallback and local authority can differ.",
    "path": ".claude/skills/calendar-islamic-umalqura/SKILL.md"
  },
  {
    "id": "calendar-chinese",
    "kind": "calendar",
    "title": "Chinese lunisolar civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl chinese; preserve relatedYear, named/leap month, selected-zone civil day.",
    "validation": "Inherited selected HKO UTC+8 fixtures. Not Korean/Vietnamese/BaZi/Tibetan equivalence or full-range independent validation.",
    "path": ".claude/skills/calendar-chinese/SKILL.md"
  },
  {
    "id": "calendar-buddhist",
    "kind": "calendar",
    "title": "Thai Buddhist civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl buddhist, modern Thai civil era, selected-zone civil midnight.",
    "validation": "Inherited selected modern fixture; not Buddhist religious observance or historical Thai new-year reconstruction.",
    "path": ".claude/skills/calendar-buddhist/SKILL.md"
  },
  {
    "id": "calendar-indian",
    "kind": "calendar",
    "title": "Indian national Saka calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl indian, Indian national solar civil date.",
    "validation": "Inherited selected fixtures. Not regional Hindu lunar/festival or Balinese Saka calendar.",
    "path": ".claude/skills/calendar-indian/SKILL.md"
  },
  {
    "id": "calendar-persian",
    "kind": "calendar",
    "title": "Persian runtime civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl persian, selected-zone civil date; state runtime version/convention.",
    "validation": "Runtime support only; independent date fixtures pending. Do not equate astronomical/tabular variants or claim Iranian civil-authority policy.",
    "path": ".claude/skills/calendar-persian/SKILL.md"
  },
  {
    "id": "calendar-coptic",
    "kind": "calendar",
    "title": "Coptic civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl coptic, selected-zone civil midnight.",
    "validation": "Runtime support only; independent date fixtures pending. Complete ecclesiastical feasts/fasts are not implemented.",
    "path": ".claude/skills/calendar-coptic/SKILL.md"
  },
  {
    "id": "calendar-ethiopic",
    "kind": "calendar",
    "title": "Ethiopic civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl ethiopic era, selected-zone civil midnight; not ethiopic-amete-alem.",
    "validation": "Runtime support only; independent date fixtures pending. No complete Ethiopian/Eritrean liturgical determination.",
    "path": ".claude/skills/calendar-ethiopic/SKILL.md"
  },
  {
    "id": "calendar-japanese",
    "kind": "calendar",
    "title": "Japanese era civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl japanese; modern Gregorian-style month/day with named imperial era.",
    "validation": "Runtime support only; independent era-boundary fixtures pending. Not a premodern lunisolar Japanese calendar.",
    "path": ".claude/skills/calendar-japanese/SKILL.md"
  },
  {
    "id": "calendar-roc",
    "kind": "calendar",
    "title": "ROC / Minguo civil calendar",
    "scope": "Implemented civil-calendar family; not a forecast or universal observance authority.",
    "method": "Runtime Intl roc; Gregorian-style month/day and Taiwan civil-era numbering.",
    "validation": "Runtime support only; independent fixtures pending. Different era naming is not an independent astronomical model.",
    "path": ".claude/skills/calendar-roc/SKILL.md"
  },
  {
    "id": "source-work-hall-stoaa",
    "kind": "book",
    "title": "The Secret Teachings of All Ages",
    "scope": "Manly Palmer Hall · source records and supplied passages; no new full-book reading.",
    "method": "Self-published, printed by H. S. Crocker Company, Inc., San Francisco, 1928; color plates by J. Augustus Knapp.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hall-stoaa/SKILL.md"
  },
  {
    "id": "source-work-hall-lost-keys",
    "kind": "book",
    "title": "The Lost Keys of Masonry",
    "scope": "Manly Palmer Hall · source records and supplied passages; no new full-book reading.",
    "method": "First edition 1923 — Hall’s first book, written just past his 21st birthday (he did not join a lodge until 1954).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hall-lost-keys/SKILL.md"
  },
  {
    "id": "source-work-hall-lectures",
    "kind": "book",
    "title": "Lectures on Ancient Philosophy",
    "scope": "Manly Palmer Hall · source records and supplied passages; no new full-book reading.",
    "method": "First edition 1929 — written as the companion/commentary volume to STOAA.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hall-lectures/SKILL.md"
  },
  {
    "id": "source-work-hermetica-corpus-hermeticum",
    "kind": "book",
    "title": "Corpus Hermeticum (CH I–XIV, XVI–XVIII)",
    "scope": "Hermes Trismegistus (attributed) · source records and supplied passages; no new full-book reading.",
    "method": "Ancient text; PD English = Mead, Thrice-Greatest Hermes vol. 2 (Theosophical Publishing Society, 1906).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hermetica-corpus-hermeticum/SKILL.md"
  },
  {
    "id": "source-work-hermetica-asclepius",
    "kind": "book",
    "title": "Asclepius (Latin; \"The Perfect Sermon\")",
    "scope": "Hermes Trismegistus (attributed) · source records and supplied passages; no new full-book reading.",
    "method": "Ancient text; Mead’s 1906 English (vol. 2, \"The Perfect Sermon\") is PD.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hermetica-asclepius/SKILL.md"
  },
  {
    "id": "source-work-hermetica-stobaean",
    "kind": "book",
    "title": "Stobaean Excerpts (incl. Kore Kosmou) + fragments in the Fathers",
    "scope": "Hermes Trismegistus (attributed) · source records and supplied passages; no new full-book reading.",
    "method": "Ancient text; Mead vol. 3 (1906) PD.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hermetica-stobaean/SKILL.md"
  },
  {
    "id": "source-work-hermetica-emerald-tablet",
    "kind": "book",
    "title": "The Emerald Tablet (Tabula Smaragdina)",
    "scope": "Hermes Trismegistus (attributed) · source records and supplied passages; no new full-book reading.",
    "method": "Text PD; Newton’s English translation + commentary (Keynes MS 28) PD (Newton d. 1727).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-hermetica-emerald-tablet/SKILL.md"
  },
  {
    "id": "source-work-crowley-crowley-777",
    "kind": "book",
    "title": "777 (Liber 777)",
    "scope": "Aleister Crowley · source records and supplied passages; no new full-book reading.",
    "method": "London & Felling-on-Tyne: Walter Scott Publishing Co., 1909 (published anonymously).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-crowley-crowley-777/SKILL.md"
  },
  {
    "id": "source-work-crowley-crowley-liber-al",
    "kind": "book",
    "title": "Liber AL vel Legis (The Book of the Law)",
    "scope": "Aleister Crowley · source records and supplied passages; no new full-book reading.",
    "method": "Written Cairo, April 1904 (Crowley’s claim: dictated by \"Aiwass\"); first published 1909 as \"Liber L vel Legis\" in ΘΕΛΗΜΑ vol. III; republished The Equinox I(10), 1913; Tunis edition 1925/1926.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-crowley-crowley-liber-al/SKILL.md"
  },
  {
    "id": "source-work-crowley-crowley-book4",
    "kind": "book",
    "title": "Book 4 (Liber ABA), Parts I–II",
    "scope": "Aleister Crowley · source records and supplied passages; no new full-book reading.",
    "method": "Part I \"Mysticism\": Wieland & Co., London, 1912. Part II \"Magick (Elemental Theory)\": Wieland & Co., 1913. With Mary d’Este Sturges (\"Soror Virakam\").",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-crowley-crowley-book4/SKILL.md"
  },
  {
    "id": "source-work-crowley-crowley-mtp",
    "kind": "book",
    "title": "Magick in Theory and Practice (Book 4, Part III)",
    "scope": "Aleister Crowley · source records and supplied passages; no new full-book reading.",
    "method": "Paris: Lecram Press — title page dated 1929; the Subscriber’s Edition actually appeared 1930 (dating contested; flagged, not resolved).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-crowley-crowley-mtp/SKILL.md"
  },
  {
    "id": "source-work-crowley-crowley-book-of-thoth",
    "kind": "book",
    "title": "The Book of Thoth (The Equinox III:5)",
    "scope": "Aleister Crowley · source records and supplied passages; no new full-book reading.",
    "method": "London: O.T.O. / Chiswick Press, 21 March 1944; 200 signed and numbered copies.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-crowley-crowley-book-of-thoth/SKILL.md"
  },
  {
    "id": "source-work-crowley-crowley-equinox-i",
    "kind": "book",
    "title": "The Equinox, Volume I, Numbers 1–10",
    "scope": "Aleister Crowley · source records and supplied passages; no new full-book reading.",
    "method": "London, 1909–1913, semi-annual — \"the Review of Scientific Illuminism\".",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-crowley-crowley-equinox-i/SKILL.md"
  },
  {
    "id": "source-work-dee-dee-monas",
    "kind": "book",
    "title": "Monas Hieroglyphica",
    "scope": "John Dee · source records and supplied passages; no new full-book reading.",
    "method": "Antwerp: Willem Silvius, 1564; dedicated to Emperor Maximilian II.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-dee-dee-monas/SKILL.md"
  },
  {
    "id": "source-work-dee-dee-true-faithful",
    "kind": "book",
    "title": "A True & Faithful Relation… Between Dr. John Dee… and Some Spirits",
    "scope": "John Dee · source records and supplied passages; no new full-book reading.",
    "method": "London, 1659 (posthumous; from the Cotton Appendix XLVI manuscripts), with Casaubon’s long hostile preface arguing Dee was deluded by evil spirits.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-dee-dee-true-faithful/SKILL.md"
  },
  {
    "id": "source-work-dee-dee-enochian",
    "kind": "book",
    "title": "The Enochian system: the 48 Calls, the tables, and their publication history",
    "scope": "John Dee · source records and supplied passages; no new full-book reading.",
    "method": "Received (per the diaries) 1583–1584, largely at Kraków 1584; Dee’s fair copy is Sloane MS 3191 (\"48 Claves Angelicae\"); partial print Casaubon 1659; GD adaptation c. 1888–1900; Crowley, Liber Chanokh (Equinox I:7–8, 1912).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-dee-dee-enochian/SKILL.md"
  },
  {
    "id": "source-work-dee-dee-praeface",
    "kind": "book",
    "title": "The Mathematicall Praeface to the Elements of Geometrie of Euclid",
    "scope": "John Dee · source records and supplied passages; no new full-book reading.",
    "method": "London: John Day, 1570 — preface to Henry Billingsley’s first English translation of Euclid.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-dee-dee-praeface/SKILL.md"
  },
  {
    "id": "source-work-agrippa-three-books",
    "kind": "book",
    "title": "De occulta philosophia libri tres / Three Books of Occult Philosophy",
    "scope": "Heinrich Cornelius Agrippa von Nettesheim · source records and supplied passages; no new full-book reading.",
    "method": "Complete Latin, Cologne 1533 (partial 1531); English \"J.F.\", London: Gregory Moule, 1651.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-agrippa-three-books/SKILL.md"
  },
  {
    "id": "source-work-agrippa-fourth-book",
    "kind": "book",
    "title": "Fourth Book of Occult Philosophy (pseudo-Agrippa) — SPURIOUS",
    "scope": "Heinrich Cornelius Agrippa von Nettesheim · source records and supplied passages; no new full-book reading.",
    "method": "Latin at \"Marpurgum\" (Marburg), 1559, per Peterson’s source text (its status as the absolute first printing is unverified); English by Robert Turner, London, 1655.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-agrippa-fourth-book/SKILL.md"
  },
  {
    "id": "source-work-levi-dogme-et-rituel",
    "kind": "book",
    "title": "Dogme et rituel de la haute magie",
    "scope": "Éliphas Lévi (Alphonse-Louis Constant) · source records and supplied passages; no new full-book reading.",
    "method": "Paris, 2 vols., 1854–56; A. E. Waite (trans.), London: George Redway, 1896.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-levi-dogme-et-rituel/SKILL.md"
  },
  {
    "id": "source-work-ficino-de-vita",
    "kind": "book",
    "title": "De vita libri tres / Three Books on Life",
    "scope": "Marsilio Ficino · source records and supplied passages; no new full-book reading.",
    "method": "Florence, 1489 (Latin). Kaske & Clark (1989) and Boer (1980) are the modern translations.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-ficino-de-vita/SKILL.md"
  },
  {
    "id": "source-work-iamblichus-de-mysteriis",
    "kind": "book",
    "title": "De mysteriis (Reply of Abamon to Porphyry)",
    "scope": "Iamblichus of Chalcis · source records and supplied passages; no new full-book reading.",
    "method": "Ancient text; Thomas Taylor (trans.), 1821 (2nd ed. 1895); Alexander Wilder (trans.), \"Theurgia, or the Egyptian Mysteries\", 1911.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-iamblichus-de-mysteriis/SKILL.md"
  },
  {
    "id": "source-work-regardie-the-golden-dawn",
    "kind": "book",
    "title": "The Golden Dawn (4 vols.)",
    "scope": "Israel Regardie · source records and supplied passages; no new full-book reading.",
    "method": "Chicago: Aries Press, 4 vols., 1937–1940; Llewellyn 6th ed., 1989 (the edition the site cites).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-regardie-the-golden-dawn/SKILL.md"
  },
  {
    "id": "source-work-varahamihira-brihajjataka",
    "kind": "book",
    "title": "Bṛhajjātaka (Bṛhat Jātaka)",
    "scope": "Varāhamihira · source records and supplied passages; no new full-book reading.",
    "method": "Ancient Sanskrit text (28 adhyāyas, 400+ ślokas). TWO verified US-PD English translations: (a) N. Chidambaram Iyer, 'The Brihat Jataka of Varaha Mihira', Foster Press, Madras, 1885 (2nd ed. 1905); (b) V. Subrahmanya Sastri, \"Varahamihira's Brihat Jataka\", Government Branch Press, Mysore, 1929.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-varahamihira-brihajjataka/SKILL.md"
  },
  {
    "id": "source-work-varahamihira-brihatsamhita",
    "kind": "book",
    "title": "Bṛhat Saṁhitā",
    "scope": "Varāhamihira · source records and supplied passages; no new full-book reading.",
    "method": "Ancient Sanskrit text (~106 chapters). PD English: N. Chidambaram Iyer, 'The Brihat Samhita of Varaha Mihira', 2 parts, South Indian Press, Madras, 1884. Partial earlier PD: H. Kern's serial translation in the Journal of the Royal Asiatic Society (1870–75).",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-varahamihira-brihatsamhita/SKILL.md"
  },
  {
    "id": "source-work-varahamihira-pancasiddhantika",
    "kind": "book",
    "title": "Pañcasiddhāntikā",
    "scope": "Varāhamihira · source records and supplied passages; no new full-book reading.",
    "method": "Ancient Sanskrit text. PD English: G. Thibaut & Mahāmahopādhyāya Sudhākara Dvivedī, 'The Panchasiddhantika: The Astronomical Work of Varaha Mihira', E. J. Lazarus & Co. (Medical Hall Press), Benares, 1889.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-varahamihira-pancasiddhantika/SKILL.md"
  },
  {
    "id": "source-work-yogananda-autobiography-of-a-yogi-1946",
    "kind": "book",
    "title": "Autobiography of a Yogi",
    "scope": "Paramahansa Yogananda · source records and supplied passages; no new full-book reading.",
    "method": "Philosophical Library, New York, December 1946 (1st ed.); title page 'Paramhansa Yogananda'; dedicated to Luther Burbank; foreword by W. Y. Evans-Wentz. This FIRST EDITION has 48 chapters, ending at ch. 48 'At Encinitas in California'. Later editions differ: SRF's 3rd (1951) and subsequent revised editions add ch. 49 'The Years 1940–1951' and carry extensive authorial/editorial revisions — those revised editions are copyrighted.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-yogananda-autobiography-of-a-yogi-1946/SKILL.md"
  },
  {
    "id": "source-work-yogananda-whispers-from-eternity-1929",
    "kind": "book",
    "title": "Whispers from Eternity",
    "scope": "Paramahansa Yogananda · source records and supplied passages; no new full-book reading.",
    "method": "First edition attributed to 1929 (Yogoda Sat-Sanga / early SRF imprint); later SRF revised editions are copyrighted.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-yogananda-whispers-from-eternity-1929/SKILL.md"
  },
  {
    "id": "source-work-yogananda-science-of-religion-1924",
    "kind": "book",
    "title": "The Science of Religion",
    "scope": "Paramahansa Yogananda · source records and supplied passages; no new full-book reading.",
    "method": "First English edition, early Yogoda/SRF imprint, adapted from an earlier Bengali/Hindi lecture text. FIRST-EDITION YEAR UNCERTAIN: sources give 1920, 1924 and 1925 — all pre-1930, so the PD verdict is unaffected, but the exact year is not established.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-yogananda-science-of-religion-1924/SKILL.md"
  },
  {
    "id": "source-work-yogananda-songs-of-the-soul-1923",
    "kind": "book",
    "title": "Songs of the Soul",
    "scope": "Paramahansa Yogananda · source records and supplied passages; no new full-book reading.",
    "method": "First edition 1923 (early Yogoda/SRF imprint); later revised editions copyrighted.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-yogananda-songs-of-the-soul-1923/SKILL.md"
  },
  {
    "id": "source-work-yogananda-second-coming-of-christ-2004",
    "kind": "book",
    "title": "The Second Coming of Christ: The Resurrection of the Christ Within You",
    "scope": "Paramahansa Yogananda · source records and supplied passages; no new full-book reading.",
    "method": "Self-Realization Fellowship, 2004 (2 vols), compiled and edited posthumously from Yogananda's commentaries.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-yogananda-second-coming-of-christ-2004/SKILL.md"
  },
  {
    "id": "source-work-vivekananda-raja-yoga",
    "kind": "book",
    "title": "Raja Yoga",
    "scope": "Swami Vivekananda · source records and supplied passages; no new full-book reading.",
    "method": "First published July 1896 from lectures Vivekananda delivered in New York in 1895–96. Imprint varies by issue: the New York Vedanta-circle issue (Vivekananda's American students) and Longmans, Green & Co. (London printing 1896/1897); the American students later brought out a New York edition (glossary added by Swami Abhedananda, c. 1899). PD under any of these imprints.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-vivekananda-raja-yoga/SKILL.md"
  },
  {
    "id": "source-work-vivekananda-the-yogas-and-complete-works",
    "kind": "book",
    "title": "Karma-Yoga, Jñāna-Yoga, Bhakti-Yoga & the Complete Works",
    "scope": "Swami Vivekananda · source records and supplied passages; no new full-book reading.",
    "method": "Lifetime lecture-books: Karma-Yoga (New York, 1896); Bhakti-Yoga and Jñāna-Yoga assembled from 1895–96 lectures (first book editions in the years around 1899–1902). Collected: 'Speeches and Writings of Swami Vivekananda' (Madras, 1899-era) and, definitively, The Complete Works of Swami Vivekananda (Advaita Ashrama, Mayavati/Almora), whose collected volumes begin appearing from 1907; the modern set (later reprinted/reset through the 20th century, current 8–9 volumes) adds posthumously edited/collected matter.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-vivekananda-the-yogas-and-complete-works/SKILL.md"
  },
  {
    "id": "source-work-vivekananda-chicago-1893-address",
    "kind": "book",
    "title": "The 1893 World's Parliament of Religions address",
    "scope": "Swami Vivekananda · source records and supplied passages; no new full-book reading.",
    "method": "Addresses delivered at the World's Parliament of Religions, Chicago, September 1893 (opened 11 Sept 1893, alongside the Columbian Exposition); the responses are printed in J. H. Barrows (ed.), The World's Parliament of Religions (Chicago, 1894), a PD source.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-vivekananda-chicago-1893-address/SKILL.md"
  },
  {
    "id": "source-work-lilly-christian-astrology",
    "kind": "book",
    "title": "Christian Astrology",
    "scope": "William Lilly · source records and supplied passages; no new full-book reading.",
    "method": "1647 engine/source tradition; distinct 1659 second-edition opening/contents study lens.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-lilly-christian-astrology/SKILL.md"
  },
  {
    "id": "source-work-picatrix",
    "kind": "book",
    "title": "Picatrix / Ghāyat al-Ḥakīm",
    "scope": "Complex Arabic/Latin transmission; attribution is not settled by a title. · source records and supplied passages; no new full-book reading.",
    "method": "Existing source references include Pingree Latin and Attrell/Porreca modern English; modern translations copyrighted.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-picatrix/SKILL.md"
  },
  {
    "id": "source-work-vedic-bphs",
    "kind": "book",
    "title": "Bṛhat Parāśara Horā Śāstra and named Parāśarī study methods",
    "scope": "Parāśara attribution; composite text/edition questions remain. · source records and supplied passages; no new full-book reading.",
    "method": "Existing BPHS/Rao/Indian ephemeris references; choose actual edition and chapter before a new textual claim.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-vedic-bphs/SKILL.md"
  },
  {
    "id": "source-work-muhurta-cintamani",
    "kind": "book",
    "title": "Muhūrta Cintāmaṇi and inherited quality screens",
    "scope": "Rāma Daivajña attribution in existing catalogue. · source records and supplied passages; no new full-book reading.",
    "method": "Existing modern summaries and cited editions; verse-level primary collation incomplete.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-muhurta-cintamani/SKILL.md"
  },
  {
    "id": "source-work-newton-opticks",
    "kind": "book",
    "title": "Opticks · Query31 method lens",
    "scope": "Isaac Newton · source records and supplied passages; no new full-book reading.",
    "method": "1730 fourth English edition, Query31 pp.404–405; existing Gutenberg source lens.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-newton-opticks/SKILL.md"
  },
  {
    "id": "source-work-patanjali-yoga-sutras",
    "kind": "book",
    "title": "Yoga Sūtras / Pātañjalayogaśāstra",
    "scope": "Patañjali attribution; dating/unified-authorship debate remains. · source records and supplied passages; no new full-book reading.",
    "method": "Existing RamaPrasada1912, Woods1914 and named source layers in YS_META.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-patanjali-yoga-sutras/SKILL.md"
  },
  {
    "id": "source-work-buddhist-texts",
    "kind": "book",
    "title": "Buddhist study texts · separate recensions and layers",
    "scope": "Named Pāli/Sanskrit textual traditions; no single author identity inferred. · source records and supplied passages; no new full-book reading.",
    "method": "Sujato CC0 Metta/MN118/Dhammapada layers; Müller1894 HeartSūtra translation; inspect per-layer metadata.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-buddhist-texts/SKILL.md"
  },
  {
    "id": "source-work-yijing",
    "kind": "book",
    "title": "Yijing / Book of Changes",
    "scope": "Traditional composite text; name the supplied translation. · source records and supplied passages; no new full-book reading.",
    "method": "Inspect existing hexagram data citations and translation rights before quotation.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-yijing/SKILL.md"
  },
  {
    "id": "source-work-tarot",
    "kind": "book",
    "title": "Tarot traditions and deck source records",
    "scope": "Name the deck/author/school; do not universalize correspondences. · source records and supplied passages; no new full-book reading.",
    "method": "Existing deck data and practitioner catalogue; exact source/deck rights apply.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-tarot/SKILL.md"
  },
  {
    "id": "source-work-runes",
    "kind": "book",
    "title": "Elder Futhark source traditions",
    "scope": "Historical inscriptions/poems vs modern divination authors must be separated. · source records and supplied passages; no new full-book reading.",
    "method": "Inspect existing rune data/citations; do not invent one ancient divination manual.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-runes/SKILL.md"
  },
  {
    "id": "source-work-kabbalah",
    "kind": "book",
    "title": "Kabbalah / letter-number methods",
    "scope": "Named Jewish source tradition distinct from later Hermetic adaptations. · source records and supplied passages; no new full-book reading.",
    "method": "Existing Kabbalah data and Agrippa III.30 source record; exact edition before text claims.",
    "validation": "Bibliographic/passage/adaptation/implementation statuses remain distinct; rights and source flags preserved.",
    "path": ".claude/skills/source-work-kabbalah/SKILL.md"
  }
];
// END GENERATED SPECIALIST PROFILES

export const SPECIALIST_PROFILES = specialistProfiles.map(profile => ({
  ...profile, skillPath:profile.path,
  agentRole:profile.kind==='calendar'?'calendar-method-reviewer':'book-source-reviewer',
  agentTemplate:profile.kind==='calendar'?'.claude/agents/calendar-method-reviewer.md':'.claude/agents/book-source-reviewer.md',
  taskContract:{
    input:profile.kind==='calendar'?'Explicit UTC instant, observer coordinates, IANA zone, requested civil method and input certainty.':'Exact named work, edition, supplied or actually retrievable passage, question and intended tool mapping.',
    method:profile.method,
    references:[profile.path,'.claude/skills/observatory-source-contract/SKILL.md','docs/2026-10-calendar-observatory-research.md'],
    verification:profile.validation,
    output:['Named method and actual inputs','Exact source/section/edition and reading depth','Claim type and fixture/implementation status','Differences, missing values and unsupported scope','Actual checks, corrections and remaining review'],
    launchPrompt:`Use the ${profile.kind==='calendar'?'calendar-method-reviewer':'book-source-reviewer'} repository agent template with profile ${profile.id}. Read ${profile.path} and the shared source contract. Perform one bounded review of the supplied input/passage using the named method. Preserve fixture and source flags; do not impersonate a human expert, infer unavailable values or claim predictive validity. Return the required evidence handoff. No other profile or external service is implicitly authorized.`,
  },
}));
