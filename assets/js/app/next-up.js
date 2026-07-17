// ============================================================================
//  next-up.js — the "Where next" band (flow §3.3). Dead-end elimination: every
//  page ends with 2–3 curated onward links instead of trailing reference tables.
//  Called by mountChrome (after the footer is built, inserted before it); pages
//  opt out with <meta name="no-next-up"> (index.html, confluence.html).
//
//  Fallback chain: exact currentSection() key → the key's menu-group default →
//  the home trio. So EVERY key resolves to ≥2 rows (engine-tested), and every
//  href is a real page on disk (engine-tested).
//
//  The band is navigational chrome, never interpretive prose — no framing risk.
// ============================================================================

import * as shared from './shared.js';

const ROOT = shared.ROOT || (new URL('../../../', import.meta.url).href.replace(/\/$/, ''));
const R = p => `${ROOT}/${String(p).replace(/^\//, '')}`;

// Every currentSection() key this map must cover (kept in sync with shared.js;
// engine-test asserts each resolves to ≥2 rows through the fallback chain).
export const SECTION_KEYS = [
  'home', 'basics', 'learn', 'interpret', 'howitworks', 'workflow', 'contents',
  'workbench', 'autopilot', 'now', 'trajectory', 'horary', 'nativity', 'dignities',
  'phours', 'handcalc', 'transits', 'synastry', 'timelords', 'cycles', 'moments',
  'election', 'talisman',
  'book1', 'book2', 'book3', 'picatrix', 'vedic', 'prasna', 'muhurta', 'tajika',
  'tithipravesha', 'kuta', 'rasa', 'abhichara', 'kabbalah', 'jung', 'chronology',
  'confluence', 'yoga', 'greatworks',
  'geomancy', 'tarot', 'iching', 'runes',
  'glossary', 'tools', 'library', 'about', 'roadmap', 'experiment', 'structure', 'read',
];

// [label, href, reason] — reason is a short "why go there" whisper.
export const NEXT_UP = {
  // Start
  basics: [['Learn — the curriculum', 'pages/learn.html', 'a guided path'], ['How it’s calculated', 'pages/how-it-works.html', 'the mathematics'], ['The Workbench', 'pages/workbench.html', 'now cast one']],
  learn: [['The Great Works', 'pages/greatworks/index.html', 'author → book → tool'], ['The Basics', 'pages/basics.html', 'every concept'], ['The Workbench', 'pages/workbench.html', 'put it to work']],
  interpret: [['The Workbench', 'pages/workbench.html', 'cast a reading'], ['Glossary', 'pages/glossary.html', 'every term']],
  howitworks: [['The Workbench', 'pages/workbench.html', 'cast a chart'], ['Sources & Science', 'pages/about/index.html', 'the engine & citations'], ['Cast by hand', 'pages/handcalc.html', 'the ephemeris method']],
  workflow: [['Master Index', 'pages/contents.html', 'the concept map'], ['Compare the tools', 'pages/tools.html', 'what each computes']],
  contents: [['Compare the tools', 'pages/tools.html', 'what each computes'], ['The Workbench', 'pages/workbench.html', 'the master tool']],

  // Cast
  workbench: [['Horary', 'pages/book2/horary.html', 'ask a question'], ['Life Trajectory', 'pages/trajectory.html', 'the whole arc'], ['Election', 'pages/picatrix/election.html', 'choose a moment']],
  autopilot: [['The Workbench', 'pages/workbench.html', 'drive it by hand'], ['How it’s calculated', 'pages/how-it-works.html', 'what it runs']],
  now: [['The Workbench', 'pages/workbench.html', 'cast this moment'], ['Moment Scanner', 'pages/moments.html', 'scan a range'], ['Election', 'pages/picatrix/election.html', 'is it fit?']],
  trajectory: [['Time-lords', 'pages/timelords.html', 'the timing layer'], ['Transits', 'pages/transits.html', 'to your natal'], ['Solar returns', 'pages/book3/master.html', 'the year’s figure']],
  horary: [['Book II — the method', 'pages/book2/index.html', 'behind the verdict'], ['Praśna', 'pages/prasna.html', 'the Indian mirror'], ['Worked charts', 'pages/book2/examples.html', 'Lilly’s own']],
  nativity: [['Book III master tool', 'pages/book3/master.html', 'every technique'], ['Life Trajectory', 'pages/trajectory.html', 'the whole arc'], ['Transits', 'pages/transits.html', 'now vs natal']],
  dignities: [['The Workbench', 'pages/workbench.html', 'in a full reading'], ['Book I — dignities', 'pages/book1/index.html', 'the doctrine'], ['Degrees table', 'pages/book1/degrees.html', 'term & face']],
  phours: [['Right Now', 'pages/now.html', 'the live hour'], ['Election', 'pages/picatrix/election.html', 'the hour, scored'], ['Talisman', 'pages/picatrix/talisman.html', 'the hour in practice']],
  handcalc: [['The Workbench', 'pages/workbench.html', 'the engine version'], ['How it’s calculated', 'pages/how-it-works.html', 'the theory']],
  transits: [['Time-lords', 'pages/timelords.html', 'the timing layer'], ['Synastry', 'pages/synastry.html', 'chart to chart'], ['Life Trajectory', 'pages/trajectory.html', 'the arc']],
  synastry: [['Kūṭa matching', 'pages/kuta.html', 'the Indian mirror'], ['Transits', 'pages/transits.html', 'timing'], ['The Workbench', 'pages/workbench.html', 'each chart in full']],
  timelords: [['Life Trajectory', 'pages/trajectory.html', 'the whole arc'], ['Transits', 'pages/transits.html', 'the outer timing'], ['Book III master', 'pages/book3/master.html', 'directions & returns']],
  cycles: [['The Confluence', 'pages/confluence.html', 'the atlas of it'], ['Moment Scanner', 'pages/moments.html', 'a range, scored'], ['Chronology', 'pages/chronology/index.html', 'the history']],
  moments: [['Election', 'pages/picatrix/election.html', 'judge one moment'], ['Right Now', 'pages/now.html', 'the live sky'], ['Cycles of History', 'pages/cycles.html', 'the long view']],
  election: [['Talisman', 'pages/picatrix/talisman.html', 'the moment in practice'], ['Muhūrta', 'pages/muhurta.html', 'the Indian election'], ['Planetary hours', 'pages/book1/planetary-hours.html', 'the hour ruler']],
  talisman: [['Election', 'pages/picatrix/election.html', 'choose its moment'], ['Kameas', 'pages/picatrix/kameas.html', 'the squares & sigils'], ['Picatrix prayers', 'pages/picatrix/prayers.html', 'the recitation']],

  // Traditions
  book1: [['Essential Dignities', 'pages/book1/dignities.html', 'the tool'], ['Book II — Horary', 'pages/book2/index.html', 'ask a question'], ['The Workbench', 'pages/workbench.html', 'cast a figure']],
  book2: [['Horary', 'pages/book2/horary.html', 'the calculator'], ['Worked charts', 'pages/book2/examples.html', 'Lilly’s own'], ['Book III — Nativities', 'pages/book3/index.html', 'birth charts']],
  book3: [['Nativity', 'pages/book3/nativity.html', 'a birth chart'], ['Life Trajectory', 'pages/trajectory.html', 'the whole arc'], ['Book III master', 'pages/book3/master.html', 'every technique']],
  picatrix: [['Election', 'pages/picatrix/election.html', 'is this moment fit?'], ['Talisman', 'pages/picatrix/talisman.html', 'the recipe'], ['The 28 Mansions', 'pages/picatrix/mansions.html', 'the Moon’s houses']],
  vedic: [['Kūṭa matching', 'pages/kuta.html', 'compatibility'], ['Praśna', 'pages/prasna.html', 'Indian horary'], ['Muhūrta', 'pages/muhurta.html', 'election']],
  prasna: [['Horary', 'pages/book2/horary.html', 'the Western mirror'], ['Vedic', 'pages/vedic/index.html', 'the full chart'], ['Muhūrta', 'pages/muhurta.html', 'election']],
  muhurta: [['Election', 'pages/picatrix/election.html', 'the Western mirror'], ['Tithi-praveśa', 'pages/tithi-pravesha.html', 'the annual return'], ['Vedic', 'pages/vedic/index.html', 'the chart']],
  tajika: [['Tithi-praveśa', 'pages/tithi-pravesha.html', 'another annual'], ['Vedic', 'pages/vedic/index.html', 'the natal'], ['Time-lords', 'pages/timelords.html', 'Western timing']],
  tithipravesha: [['Tājika varṣaphala', 'pages/tajika.html', 'the Indo-Persian annual'], ['Vedic', 'pages/vedic/index.html', 'the natal'], ['Muhūrta', 'pages/muhurta.html', 'election']],
  kuta: [['Synastry', 'pages/synastry.html', 'the Western mirror'], ['Vedic', 'pages/vedic/index.html', 'each chart'], ['Praśna', 'pages/prasna.html', 'ask about it']],
  rasa: [['Kameas', 'pages/picatrix/kameas.html', 'the magic squares'], ['Talisman', 'pages/picatrix/talisman.html', 'the Western mirror'], ['Abhicāra', 'pages/abhichara/index.html', 'the ritual wing']],
  abhichara: [['Rasaśāstra & yantras', 'pages/rasa.html', 'the yantras'], ['The six acts', 'pages/abhichara/six-acts.html', 'ṣaṭkarma'], ['Picatrix', 'pages/picatrix/index.html', 'the Western mirror']],
  kabbalah: [['Kameas', 'pages/picatrix/kameas.html', 'the planetary squares'], ['The Confluence', 'pages/confluence.html', 'the atlas'], ['Great Works', 'pages/greatworks/index.html', 'the sources']],
  jung: [['The Workbench', 'pages/workbench.html', 'cast a chart'], ['The Confluence', 'pages/confluence.html', 'the atlas'], ['Learn', 'pages/learn.html', 'the curriculum']],
  chronology: [['The Confluence', 'pages/confluence.html', 'the atlas'], ['Cycles of History', 'pages/cycles.html', 'the sky behind it'], ['Great Works', 'pages/greatworks/index.html', 'the texts']],
  confluence: [['The Chronology', 'pages/chronology/index.html', 'the narrative'], ['Cycles of History', 'pages/cycles.html', 'the sky']],
  yoga: [['Great Works', 'pages/greatworks/index.html', 'more study wings'], ['Learn', 'pages/learn.html', 'the curriculum'], ['The Library', 'pages/library/index.html', 'the people & books']],
  greatworks: [['The Library', 'pages/library/index.html', 'the practitioners'], ['Learn', 'pages/learn.html', 'the curriculum'], ['The Yoga Sūtras', 'pages/yoga/index.html', 'a study wing']],

  // Oracles
  geomancy: [['Tarot', 'pages/tarot.html', 'another oracle'], ['I Ching', 'pages/iching.html', 'the Changes'], ['Election', 'pages/picatrix/election.html', 'the hour of the cast']],
  tarot: [['I Ching', 'pages/iching.html', 'another oracle'], ['Geomancy', 'pages/geomancy.html', 'the Shield'], ['Runes', 'pages/runes.html', 'the Elder Futhark']],
  iching: [['Runes', 'pages/runes.html', 'another oracle'], ['Tarot', 'pages/tarot.html', 'the spread'], ['Geomancy', 'pages/geomancy.html', 'the Shield']],
  runes: [['Geomancy', 'pages/geomancy.html', 'another oracle'], ['Tarot', 'pages/tarot.html', 'the spread'], ['I Ching', 'pages/iching.html', 'the Changes']],

  // Reference
  glossary: [['The Basics', 'pages/basics.html', 'every concept'], ['Learn', 'pages/learn.html', 'the curriculum'], ['How it’s calculated', 'pages/how-it-works.html', 'the method']],
  tools: [['Master Index', 'pages/contents.html', 'the concept map'], ['The Workbench', 'pages/workbench.html', 'the master tool'], ['Learn', 'pages/learn.html', 'where to start']],
  library: [['Great Works', 'pages/greatworks/index.html', 'the study guides'], ['The Chronology', 'pages/chronology/index.html', 'the history'], ['Sources & Science', 'pages/about/index.html', 'the citations']],
  about: [['How it’s calculated', 'pages/how-it-works.html', 'the method'], ['The Roadmap', 'pages/roadmap.html', 'what’s planned'], ['The Workbench', 'pages/workbench.html', 'try it']],
  roadmap: [['The Workbench', 'pages/workbench.html', 'what ships today'], ['Sources & Science', 'pages/about/index.html', 'the honest note']],
  experiment: [['How it’s calculated', 'pages/how-it-works.html', 'the method'], ['Sources & Science', 'pages/about/index.html', 'the science'], ['The Workbench', 'pages/workbench.html', 'cast for real']],
  structure: [['The Confluence', 'pages/confluence.html', 'the atlas'], ['Master Index', 'pages/contents.html', 'the concept map']],
  read: [['The Library', 'pages/library/index.html', 'the people & books'], ['Great Works', 'pages/greatworks/index.html', 'the study guides'], ['Sources & Science', 'pages/about/index.html', 'the editions']],
};

// One default per menu group (each ≥3 rows) — the middle rung of the fallback.
export const GROUP_DEFAULTS = {
  start: [['The Workbench', 'pages/workbench.html', 'cast a chart'], ['Learn', 'pages/learn.html', 'the curriculum'], ['The Basics', 'pages/basics.html', 'every concept']],
  cast: [['The Workbench', 'pages/workbench.html', 'the master tool'], ['Right Now', 'pages/now.html', 'the live sky'], ['Compare the tools', 'pages/tools.html', 'what each computes']],
  traditions: [['Master Index', 'pages/contents.html', 'the concept map'], ['The Confluence', 'pages/confluence.html', 'the atlas'], ['The Library', 'pages/library/index.html', 'the sources']],
  oracles: [['Tarot', 'pages/tarot.html', 'the spread'], ['I Ching', 'pages/iching.html', 'the Changes'], ['Geomancy', 'pages/geomancy.html', 'the Shield']],
  reference: [['Compare the tools', 'pages/tools.html', 'what each computes'], ['Master Index', 'pages/contents.html', 'the concept map'], ['Sources & Science', 'pages/about/index.html', 'the citations']],
};

export const HOME_TRIO = [['The Workbench', 'pages/workbench.html', 'cast a chart'], ['Learn', 'pages/learn.html', 'the curriculum'], ['The Confluence', 'pages/confluence.html', 'browse the map']];

// key → menu-group key (built from NAV_GROUPS where possible, with a fallback).
const FALLBACK_GROUP = {
  home: null, basics: 'start', learn: 'start', interpret: 'start', howitworks: 'start', workflow: 'start', contents: 'start',
  workbench: 'cast', autopilot: 'cast', now: 'cast', trajectory: 'cast', horary: 'cast', nativity: 'cast', dignities: 'cast', phours: 'cast', handcalc: 'cast', transits: 'cast', synastry: 'cast', timelords: 'cast', cycles: 'cast', moments: 'cast', election: 'cast', talisman: 'cast',
  book1: 'traditions', book2: 'traditions', book3: 'traditions', picatrix: 'traditions', vedic: 'traditions', prasna: 'traditions', muhurta: 'traditions', tajika: 'traditions', tithipravesha: 'traditions', kuta: 'traditions', rasa: 'traditions', abhichara: 'traditions', kabbalah: 'traditions', jung: 'traditions', chronology: 'traditions', confluence: 'traditions', yoga: 'traditions', greatworks: 'traditions',
  geomancy: 'oracles', tarot: 'oracles', iching: 'oracles', runes: 'oracles',
  glossary: 'reference', tools: 'reference', library: 'reference', about: 'reference', roadmap: 'reference', experiment: 'reference', structure: 'reference', read: 'reference',
};
function groupOf(key) {
  const groups = Array.isArray(shared.NAV_GROUPS) ? shared.NAV_GROUPS : [];
  for (const g of groups) if ((g.items || []).some(([, , k]) => k === key)) return g.key;
  return FALLBACK_GROUP[key] || null;
}

// PURE: resolve a section key to its rows through the fallback chain.
export function nextUpFor(key) {
  if (NEXT_UP[key] && NEXT_UP[key].length >= 2) return NEXT_UP[key];
  const g = groupOf(key);
  if (g && GROUP_DEFAULTS[g]) return GROUP_DEFAULTS[g];
  return HOME_TRIO;
}

// Every href the map can emit — for the engine-test on-disk assertion.
export function allHrefs() {
  const set = new Set();
  const add = rows => rows.forEach(r => set.add(r[1]));
  Object.values(NEXT_UP).forEach(add);
  Object.values(GROUP_DEFAULTS).forEach(add);
  add(HOME_TRIO);
  return Array.from(set);
}

// ===========================================================================
//  mountNextUp — insert the band before the footer. Called by mountChrome.
// ===========================================================================
export function mountNextUp(activeKey) {
  if (typeof document === 'undefined') return;
  if (document.querySelector('meta[name="no-next-up"]')) return;
  if (document.querySelector('.next-up')) return;   // once
  let key = activeKey;
  if (!key && typeof shared.currentSection === 'function') { try { key = shared.currentSection(); } catch (e) { key = ''; } }
  const rows = nextUpFor(key || 'home');
  const section = document.createElement('section');
  section.className = 'next-up';
  section.setAttribute('aria-label', 'Where next');
  section.innerHTML = `<h2 class="next-up-kicker">Where next</h2>
    <div class="grid cols-3 next-up-grid">${rows.map(([label, href, reason]) =>
      `<a class="card next-up-card" href="${R(href)}"><h3>${escapeHtml(label)}</h3>${reason ? `<p class="small muted">${escapeHtml(reason)}</p>` : ''}</a>`).join('')}</div>`;
  const footer = document.querySelector('footer.site') || document.querySelector('footer');
  if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
  else (document.querySelector('main') || document.body).appendChild(section);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
