// ============================================================================
//  shared.js — injects the site header/nav and footer on every page, and
//  provides small UI helpers (city presets, geolocation, datetime). Computes
//  the site root from its own URL so links work at any depth and under the
//  GitHub Pages project subpath (…github.io/astrology-sim-ant/).
// ============================================================================

// site root, e.g. ".../astrology-sim-ant"
export const ROOT = new URL('../../../', import.meta.url).href.replace(/\/$/, '');
const R = p => `${ROOT}/${p.replace(/^\//, '')}`;

import { autolinkGlossary, autolinkResults } from './autolink.js';
import { attachGeolocate, nearestCity } from './location.js';
import { injectIcons } from './art/icons.js';
import { adoptArt } from './art/adopt.js';

// Grouped navigation — a MEGA-MENU. Five groups (Start · Cast · Traditions ·
// Oracles · Reference); each group is a dropdown that lists EVERY destination BY
// NAME, so nothing hides behind an "All Tools" page. On desktop the group label
// is a button opening a dropdown panel (wide groups run in two columns); on
// mobile the same groups become accordion sections in the hamburger drawer.
// Each item is [href, label, key]; `key` matches a value returned by
// currentSection() so the active page (and its group) light up.
// Exported so B1's palette.js / next-up.js can index destinations without
// duplicating the catalogue (read-only imports; the array itself is not mutated).
export const NAV_GROUPS = [
  { label: 'Start', key: 'start', items: [
    ['index.html', 'Home', 'home'],
    ['pages/basics.html', 'The Basics — every concept', 'basics'],
    ['pages/learn.html', 'Learn — astrology & the math', 'learn'],
    ['pages/interpret.html', 'How to read results', 'interpret'],
    ['pages/how-it-works.html', "How it's calculated", 'howitworks'],
    ['pages/workflow.html', 'Chapter map & workflows', 'workflow'],
    ['pages/contents.html', 'Master Index', 'contents'],
  ] },
  // The Cast panel is split into three labelled column-groups (flow §4). The
  // 4th tuple slot is an optional `.nav-menu-kicker` label rendered before that
  // item — CSS-only grouping, same links, no key changes; items are reordered
  // into their subgroups but nothing is added or removed.
  { label: 'Cast', key: 'cast', wide: true, items: [
    ['pages/workbench.html', 'The Workbench — Master Tool', 'workbench', 'This moment'],
    ['pages/now.html', 'Right Now — live sky', 'now'],
    ['pages/book2/horary.html', 'Horary — a question', 'horary'],
    ['pages/picatrix/election.html', 'Election — choose a moment', 'election'],
    ['pages/moments.html', 'Moment Scanner', 'moments'],
    ['pages/cycles.html', 'Cycles of History', 'cycles'],
    ['pages/book3/nativity.html', 'Nativity — a birth chart', 'nativity', 'A person'],
    ['pages/trajectory.html', 'Life Trajectory', 'trajectory'],
    ['pages/transits.html', 'Transits to a natal', 'transits'],
    ['pages/synastry.html', 'Synastry — chart to chart', 'synastry'],
    ['pages/timelords.html', 'Time-lords & progressions', 'timelords'],
    ['pages/handcalc.html', 'Cast a chart by hand', 'handcalc', 'By hand & meta'],
    ['pages/book1/dignities.html', 'Essential Dignities', 'dignities'],
    ['pages/book1/planetary-hours.html', 'Planetary Hours', 'phours'],
    ['pages/picatrix/talisman.html', 'Talisman Workshop', 'talisman'],
    ['pages/autopilot.html', 'Grand Orchestrator (AI)', 'autopilot'],
  ] },
  { label: 'Traditions', key: 'traditions', wide: true, items: [
    ['pages/book1/index.html', 'Book I — Introduction', 'book1'],
    ['pages/book2/index.html', 'Book II — Horary', 'book2'],
    ['pages/book3/index.html', 'Book III — Nativities', 'book3'],
    ['pages/picatrix/index.html', 'Picatrix — astral magic', 'picatrix'],
    ['pages/vedic/index.html', 'Vedic — Jyotiṣa (sidereal)', 'vedic'],
    ['pages/prasna.html', 'Praśna & KP sub-lords', 'prasna'],
    ['pages/muhurta.html', 'Muhūrta — Indian election', 'muhurta'],
    ['pages/tajika.html', 'Tājika varṣaphala', 'tajika'],
    ['pages/tithi-pravesha.html', 'Tithi-praveśa', 'tithipravesha'],
    ['pages/vedic/yogas.html', 'Vedic yogas — detector', 'vedicyogas'],
    ['pages/vedic/delineation.html', 'Bhāva delineations — browser', 'vedicdelineation'],
    ['pages/vedic/course.html', 'Vedic course — theory', 'vediccourse'],
    ['pages/kuta.html', 'Kūṭa Matching', 'kuta'],
    ['pages/rasa.html', 'Rasaśāstra & Yantras', 'rasa'],
    ['pages/abhichara/index.html', 'Abhicāra — ritual magic', 'abhichara'],
    ['pages/kabbalah.html', 'Kabbalah — Tree of Life', 'kabbalah'],
    ['pages/thelemic-times.html', 'Thelemic times — era legis & Liber Resh', 'thelemictimes'],
    ['pages/jung/index.html', 'Jung & astrology', 'jung'],
    ['pages/chronology/index.html', 'The Hermetic Chronology', 'chronology'],
    ['pages/confluence.html', 'The Great Confluence — atlas', 'confluence'],
    ['pages/yoga/index.html', 'The Yoga Sūtras', 'yoga'],
    ['pages/greatworks/index.html', 'Great Works', 'greatworks'],
  ] },
  { label: 'Oracles', key: 'oracles', items: [
    ['pages/geomancy.html', 'Geomancy — the Shield', 'geomancy'],
    ['pages/tarot.html', 'Tarot — the spread', 'tarot'],
    ['pages/iching.html', 'I Ching — the Changes', 'iching'],
    ['pages/runes.html', 'Runes — Elder Futhark', 'runes'],
  ] },
  { label: 'Reference', key: 'reference', items: [
    ['pages/glossary.html', 'Glossary & Dictionary', 'glossary'],
    ['pages/tools.html', 'Compare the tools', 'tools'],
    ['pages/library/index.html', 'The Library', 'library'],
    ['pages/about/index.html', 'Sources & Science', 'about'],
    ['pages/roadmap.html', 'The Roadmap — planned', 'roadmap'],
    ['pages/experiment.html', 'Test it yourself', 'experiment'],
    ['pages/structure.html', 'Structure & patterns', 'structure'],
    ['pages/read.html', 'Read the originals', 'read'],
  ] },
];

// Determine the active NAV item-key from the URL (exact, not substring — a bare
// `includes()` lit up Home + all books at once). Every destination resolves to
// the key of its own mega-menu item; sub-pages of a wing resolve to the wing
// hub, EXCEPT the few tool pages that live inside a book/picatrix folder but
// belong (by name) to the Cast group — those resolve to their Cast item so the
// Cast group lights up when you are actually using that tool.
export function currentSection() {
  const p = location.pathname;
  const m = re => re.test(p);

  // Cast tools that physically live inside a Traditions folder — checked first.
  if (m(/\/pages\/book1\/dignities\.html$/)) return 'dignities';
  if (m(/\/pages\/book1\/planetary-hours\.html$/)) return 'phours';
  if (m(/\/pages\/book2\/horary\.html$/)) return 'horary';
  if (m(/\/pages\/book3\/nativity\.html$/)) return 'nativity';
  if (m(/\/pages\/picatrix\/election\.html$/)) return 'election';
  if (m(/\/pages\/picatrix\/talisman\.html$/)) return 'talisman';

  // Traditions — wing hubs and their chapter/reference sub-pages.
  if (m(/\/pages\/book1\//)) return 'book1';
  if (m(/\/pages\/book2\//)) return 'book2';
  if (m(/\/pages\/book3\//)) return 'book3';
  if (m(/\/pages\/picatrix\//)) return 'picatrix';
  if (m(/\/pages\/vedic\/yogas\.html$/)) return 'vedicyogas';
  if (m(/\/pages\/vedic\/delineation\.html$/)) return 'vedicdelineation';
  if (m(/\/pages\/vedic\/course\.html$/)) return 'vediccourse';
  if (m(/\/pages\/vedic\//)) return 'vedic';
  if (m(/\/pages\/jung\//)) return 'jung';
  if (m(/\/pages\/chronology\//)) return 'chronology';
  if (m(/\/pages\/confluence\.html$/)) return 'confluence';
  if (m(/\/pages\/yoga\//)) return 'yoga';
  if (m(/\/pages\/greatworks\//)) return 'greatworks';
  if (m(/\/pages\/abhichara\//)) return 'abhichara';
  if (m(/\/pages\/prasna\.html$/)) return 'prasna';
  if (m(/\/pages\/muhurta\.html$/)) return 'muhurta';
  if (m(/\/pages\/tajika\.html$/)) return 'tajika';
  if (m(/\/pages\/tithi-pravesha\.html$/)) return 'tithipravesha';
  if (m(/\/pages\/kuta\.html$/)) return 'kuta';
  if (m(/\/pages\/rasa\.html$/)) return 'rasa';
  if (m(/\/pages\/kabbalah\.html$/)) return 'kabbalah';
  if (m(/\/pages\/thelemic-times\.html$/)) return 'thelemictimes';

  // Cast (top-level tool pages).
  if (m(/\/pages\/workbench\.html$/) || m(/\/pages\/master\.html$/)) return 'workbench';
  if (m(/\/pages\/autopilot\.html$/)) return 'autopilot';
  if (m(/\/pages\/now\.html$/)) return 'now';
  if (m(/\/pages\/trajectory\.html$/)) return 'trajectory';
  if (m(/\/pages\/handcalc\.html$/)) return 'handcalc';
  if (m(/\/pages\/transits\.html$/)) return 'transits';
  if (m(/\/pages\/synastry\.html$/)) return 'synastry';
  if (m(/\/pages\/timelords\.html$/)) return 'timelords';
  if (m(/\/pages\/cycles\.html$/)) return 'cycles';
  if (m(/\/pages\/moments\.html$/)) return 'moments';

  // Oracles.
  if (m(/\/pages\/geomancy\.html$/)) return 'geomancy';
  if (m(/\/pages\/tarot\.html$/)) return 'tarot';
  if (m(/\/pages\/iching\.html$/)) return 'iching';
  if (m(/\/pages\/runes\.html$/)) return 'runes';

  // Start.
  if (m(/\/pages\/basics\.html$/)) return 'basics';
  if (m(/\/pages\/learn\.html$/)) return 'learn';
  if (m(/\/pages\/interpret\.html$/)) return 'interpret';
  if (m(/\/pages\/how-it-works\.html$/)) return 'howitworks';
  if (m(/\/pages\/workflow\.html$/)) return 'workflow';
  if (m(/\/pages\/contents\.html$/)) return 'contents';

  // Reference.
  if (m(/\/pages\/glossary\.html$/)) return 'glossary';
  if (m(/\/pages\/tools\.html$/)) return 'tools';
  if (m(/\/pages\/library\//)) return 'library';
  if (m(/\/pages\/about\//)) return 'about';
  if (m(/\/pages\/roadmap\.html$/)) return 'roadmap';
  if (m(/\/pages\/experiment\.html$/)) return 'experiment';
  if (m(/\/pages\/structure\.html$/)) return 'structure';
  if (m(/\/pages\/read\.html$/)) return 'read';

  if (m(/(\/index\.html$|\/$)/)) return 'home';
  return '';
}

// Which mega-menu group contains a given item-key (so the group's button can be
// highlighted when one of its destinations is the active page).
function groupOf(key) {
  const g = NAV_GROUPS.find(gr => gr.items.some(([, , k]) => k === key));
  return g ? g.key : '';
}

export function mountChrome(activeKey = '') {
  const active = currentSection() || activeKey;
  // accessibility: a skip link + a target id on <main>
  const skip = document.createElement('a');
  skip.className = 'skip-link'; skip.href = '#content'; skip.textContent = 'Skip to content';
  document.body.prepend(skip);
  const mainEl = document.querySelector('main');
  if (mainEl && !mainEl.id) mainEl.id = 'content';

  const header = document.createElement('header');
  header.className = 'site';
  const activeGroup = groupOf(active);
  header.innerHTML = `<div class="wrap">
    <a class="brand" href="${R('index.html')}">
      <span class="mark" aria-hidden="true">✶</span>
      <span><b>The Astrologer's Workbench</b><small>Lilly · Picatrix · Jyotiṣa · the oracles — computed honestly, for study</small></span>
    </a>
    <button class="cmdk-btn" type="button" aria-label="Search the site (Ctrl-K)"><svg class="icon" aria-hidden="true"><use href="#i-search"></use></svg></button>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="main" aria-label="Primary">${NAV_GROUPS.map(g =>
      `<div class="nav-group${g.key === activeGroup ? ' has-current' : ''}" data-group="${g.key}">` +
        `<button type="button" class="nav-group-btn" id="navbtn-${g.key}" aria-haspopup="true" aria-expanded="false" aria-controls="navmenu-${g.key}">` +
          `${g.label}<span class="nav-caret" aria-hidden="true">▾</span></button>` +
        `<div class="nav-menu${g.wide ? ' wide' : ''}" id="navmenu-${g.key}" aria-label="${g.label}">${g.items.map(([href, label, key, kicker]) =>
          (kicker ? `<b class="nav-menu-kicker">${kicker}</b>` : '') +
          `<a href="${R(href)}"${key === active ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('')}</div>` +
      `</div>`).join('')}
    </nav></div>`;
  document.body.prepend(header);

  // ---- Mobile drawer: the whole grouped bar collapses behind a hamburger below
  // the breakpoint. CSS hides the toggle (and lays the bar out horizontally)
  // above it, so this is inert on desktop.
  const navToggle = header.querySelector('.nav-toggle');
  const navEl = header.querySelector('nav.main');
  const groupEls = Array.from(header.querySelectorAll('.nav-group'));

  const closeMenus = except => groupEls.forEach(g => {
    if (g === except) return;
    g.classList.remove('open');
    const b = g.querySelector('.nav-group-btn'); if (b) b.setAttribute('aria-expanded', 'false');
  });

  if (navToggle && navEl) {
    const setDrawer = open => {
      navEl.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); if (!open) closeMenus(null);
      // DS3: spring the drawer in AFTER the state flip (truth first). Guarded by a
      // dynamic motion.js import — degrades to the instant open when absent/RM.
      if (open) import('./motion.js').then(m => { if (m.motionOK && m.motionOK()) m.animatePresence(navEl, 'in', m.SPRINGS.gentle, 'y', 8); }).catch(() => {});
    };
    navToggle.addEventListener('click', () => setDrawer(!navEl.classList.contains('open')));
    navEl.addEventListener('click', e => { if (e.target.closest('a')) setDrawer(false); });   // collapse after picking a destination
    navToggle._setDrawer = setDrawer;
  }

  // ---- Mega-menu dropdowns (disclosure pattern): the group button toggles its
  // panel via `.open` + aria-expanded. Same class drives the desktop dropdown
  // and the mobile accordion — CSS positions it differently per breakpoint.
  groupEls.forEach(g => {
    const btn = g.querySelector('.nav-group-btn');
    const menu = g.querySelector('.nav-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = !g.classList.contains('open');
      closeMenus(g);
      g.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    // ArrowDown from the button drops focus into the panel (keyboard convenience)
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); closeMenus(g); g.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); const first = menu.querySelector('a'); if (first) first.focus(); }
    });
    // Tabbing out of a group closes it (desktop); the drawer stays as-is on mobile.
    g.addEventListener('focusout', () => setTimeout(() => {
      if (!g.contains(document.activeElement)) { g.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    }, 0));
  });

  // Escape closes the open dropdown (and returns focus to its button); a click
  // anywhere outside a group closes them all.
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openG = groupEls.find(g => g.classList.contains('open'));
    if (openG) { openG.classList.remove('open'); const b = openG.querySelector('.nav-group-btn'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); } }
    else if (navToggle && navToggle._setDrawer && navEl.classList.contains('open')) navToggle._setDrawer(false);
  });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-group')) closeMenus(null); });

  const footer = document.createElement('footer');
  // Footer diet (plan §4.5): the mega-menu now names every destination, so the
  // ~35-link "Tools & Study" dump is redundant on all 95 pages. The `.footer-diet`
  // class (WP1 CSS) slims the grid and hides the `.footer-overflow` column, and a
  // compact "Explore" column of the five nav-group hub links takes its visible
  // place. The full list stays in the DOM (hidden) so no destination is dropped;
  // reachability is guaranteed by the mega-menu, which stays as-is. The brand
  // blurb, the Study-the-Books column and the disclaimer are unchanged.
  footer.className = 'site footer-diet';
  footer.innerHTML = `<div class="wrap">
    <div><b style="color:#e9dfc4">The Astrologer's Workbench</b><br>
      A scientifically-honest study &amp; calculation edition of the Western tradition
      (Lilly's <i>Christian Astrology</i>, 1647, and the <i>Picatrix</i>), the Indian
      systems (Jyotiṣa, praśna, muhūrta), the oracles and the esoteric wings —
      every figure on a verified astronomical engine, every claim cited.</div>
    <div><b style="color:#e9dfc4">Study the Books</b>
      <ul class="clean small">
        <li><a href="${R('pages/book1/index.html')}">Book I — An Introduction to Astrology</a></li>
        <li><a href="${R('pages/book2/index.html')}">Book II — Resolution of All Questions</a></li>
        <li><a href="${R('pages/book3/index.html')}">Book III — Judgement of Nativities</a></li>
        <li><a href="${R('pages/picatrix/index.html')}">Picatrix — Astrological Magic</a></li>
        <li><a href="${R('pages/vedic/index.html')}">Jagannath Hora — Vedic (sidereal)</a></li>
        <li><a href="${R('pages/jung/index.html')}">Jung &amp; astrology — the psychologist among the horoscopes</a></li>
        <li><a href="${R('pages/chronology/index.html')}">The Hermetic Chronology — as above, so below</a></li>
        <li><a href="${R('pages/abhichara/index.html')}">Abhicāra — the Indian ritual-magic traditions, described</a></li>
        <li><a href="${R('pages/yoga/index.html')}">The Yoga Sūtras of Patañjali — the study wing</a></li>
        <li><a href="${R('pages/greatworks/index.html')}">The Great Works — author→book→chapter study guides</a></li>
        <li><a href="${R('pages/library/index.html')}">The Practitioners' Library — the people &amp; the books</a></li>
      </ul></div>
    <div><b style="color:#e9dfc4">Explore</b>
      <ul class="clean small">
        <li><a href="${R('pages/basics.html')}">Start — the Basics &amp; the path</a></li>
        <li><a href="${R('pages/workbench.html')}">Cast — the Workbench (master tool)</a></li>
        <li><a href="${R('pages/contents.html')}">Traditions — the Master Index</a></li>
        <li><a href="${R('pages/geomancy.html')}">Oracles — geomancy, tarot &amp; more</a></li>
        <li><a href="${R('pages/about/index.html')}">Reference — Sources &amp; Science</a></li>
      </ul>
      <p class="small" style="color:#8f8973;margin:.5rem 0 0">Every page is named in the menu at the top.</p></div>
    <div class="footer-overflow"><b style="color:#e9dfc4">Tools & Study</b>
      <ul class="clean small">
        <li><a href="${R('pages/workbench.html')}">The Master Tool (Workbench) — every calculation in one place</a></li>
        <li><a href="${R('pages/autopilot.html')}">The Grand Orchestrator — one prompt, every engine (agentic AI)</a></li>
        <li><a href="${R('pages/trajectory.html')}">Life Trajectory (birth chart anywhere)</a></li>
        <li><a href="${R('pages/timelords.html')}">Time-lords &amp; progressions — firdaria · zodiacal releasing</a></li>
        <li><a href="${R('pages/cycles.html')}">Cycles of History — great conjunctions &amp; eclipses</a></li>
        <li><a href="${R('pages/transits.html')}">Transits to a natal chart — the timing timeline &amp; profection overlay</a></li>
        <li><a href="${R('pages/synastry.html')}">Synastry — the chart-to-chart aspect grid &amp; house overlays</a></li>
        <li><a href="${R('pages/now.html')}">Right Now — live sky</a></li>
        <li><a href="${R('pages/picatrix/election.html')}">Election — choose the moment</a></li>
        <li><a href="${R('pages/book3/master.html')}">Book III Master Tool</a></li>
        <li><a href="${R('pages/tools.html')}">All Tools &amp; Calculators</a></li>
        <li><a href="${R('pages/basics.html')}">The Basics — every concept explained</a></li>
        <li><a href="${R('pages/learn.html')}">Learn — astrology &amp; the mathematics</a></li>
        <li><a href="${R('pages/interpret.html')}">Reading your results (a reference)</a></li>
        <li><a href="${R('pages/structure.html')}">Structure &amp; patterns (the hidden symmetry)</a></li>
        <li><a href="${R('pages/experiment.html')}">Test it yourself (the falsification demo)</a></li>
        <li><a href="${R('pages/geomancy.html')}">Geomancy — the Shield Chart</a></li>
        <li><a href="${R('pages/tarot.html')}">Tarot — the spread, laid &amp; read</a></li>
        <li><a href="${R('pages/iching.html')}">I Ching — the Book of Changes</a></li>
        <li><a href="${R('pages/runes.html')}">Runes — the Elder Futhark, cast &amp; read</a></li>
        <li><a href="${R('pages/kabbalah.html')}">Kabbalah — the Tree of Life explorer &amp; gematria</a></li>
        <li><a href="${R('pages/prasna.html')}">Praśna — Indian horary &amp; the KP sub-lords</a></li>
        <li><a href="${R('pages/muhurta.html')}">Muhūrta — the Indian election of the moment</a></li>
        <li><a href="${R('pages/rasa.html')}">Rasaśāstra &amp; yantras — Indian mercury-alchemy &amp; the magic squares</a></li>
        <li><a href="${R('pages/moments.html')}">Cross-system moment scanner — every rulebook, one timeline</a></li>
        <li><a href="${R('pages/tajika.html')}">Tājika varṣaphala — the Indo-Persian annual chart</a></li>
        <li><a href="${R('pages/tithi-pravesha.html')}">Tithi-praveśa — the Vedic annual &amp; monthly tithi return</a></li>
        <li><a href="${R('pages/kuta.html')}">Kūṭa matching — the aṣṭakūṭa &amp; the ten porutham</a></li>
        <li><a href="${R('pages/how-it-works.html')}">How it's calculated (step by step)</a></li>
        <li><a href="${R('pages/handcalc.html')}">Cast a chart by hand — the ephemeris &amp; tables method</a></li>
        <li><a href="${R('pages/workflow.html')}">Chapter Map &amp; Workflows</a></li>
        <li><a href="${R('pages/book1/master.html')}">Book I Master Tool</a></li>
        <li><a href="${R('pages/book2/horary.html')}">Horary Chart Calculator</a></li>
        <li><a href="${R('pages/glossary.html')}">Glossary &amp; Dictionary</a></li>
        <li><a href="${R('pages/contents.html')}">Master Index</a></li>
        <li><a href="${R('pages/roadmap.html')}">The Roadmap — planned tools &amp; wings</a></li>
        <li><a href="${R('pages/read.html')}">Read the original (free scans)</a></li>
        <li><a href="${R('pages/about/index.html')}">Sources &amp; scientific context</a></li>
      </ul></div>
    <p class="disclaimer">This site presents astrology as a historical, cultural and
      intellectual artefact. Astrology has no demonstrated predictive validity and is
      regarded by the scientific community as a pseudoscience; the calculators reproduce
      Lilly's methods faithfully for study, not for guidance. Astronomical positions are
      computed with the MIT-licensed astronomy-engine (≈1 arc-minute). See
      <a href="${R('pages/about/index.html')}">About & Sources</a>.</p>
  </div>`;
  document.body.appendChild(footer);

  // ---- DS3 art layer: inject the icon sprite (so every <use href="#i-*"> and
  // the epistemic <pattern> refs resolve) and swap wing-hero emoji watermarks
  // for their engraved frontispieces + gild any .card--plate corners. -------
  try { injectIcons(document); } catch (e) { /* non-fatal */ }
  try { adoptArt(document); } catch (e) { /* non-fatal */ }

  // ---- DS3 chrome: the command palette + the "where next" band. D18 — both
  // mount via dynamic import().catch() so shared.js works in a worktree where
  // B1's modules are absent, and degrades gracefully if one fails offline. ---
  const searchBtn = header.querySelector('.cmdk-btn');
  import('./palette.js').then(m => {
    const mount = m.mountPalette || m.initPalette || m.default;
    let api = null;
    if (typeof mount === 'function') { try { api = mount({ navGroups: NAV_GROUPS, current: active }); } catch (e) { /* non-fatal */ } }
    const open = m.openPalette || (api && api.open);
    if (searchBtn) searchBtn.addEventListener('click', e => {
      e.preventDefault();
      if (typeof open === 'function') { try { open(); return; } catch (e2) { /* fall through */ } }
      document.dispatchEvent(new CustomEvent('ui3:open-palette'));
    });
  }).catch(() => { /* palette absent — the mega-menu + 🔍 button stay inert but present */ });

  if (!document.querySelector('meta[name="no-next-up"]')) {
    import('./next-up.js').then(m => {
      const mount = m.mountNextUp || m.initNextUp || m.default;
      if (typeof mount === 'function') { try { mount(); } catch (e) { /* non-fatal */ } }
    }).catch(() => { /* next-up absent — no dead-end band this build */ });
  }

  // ---- R28 P: register the offline service worker (PWA). Guarded dynamic
  // import — absent/failed registration never touches the page; the worker
  // no-ops on localhost so dev + the verify gate are unaffected. ------------
  import('./sw-register.js').then(m => {
    const reg = m.registerServiceWorker || m.default;
    if (typeof reg === 'function') { try { reg(); } catch (e) { /* non-fatal */ } }
  }).catch(() => { /* sw-register absent — the site works online-only */ });

  // a11y: ensure every data-table header cell carries a `scope` — now (static
  // tables) and as result panels render (a light observer on <main>). One pass
  // covers the whole site instead of per-table edits.
  try {
    const fixScopes = root => (root || document).querySelectorAll('table.data th:not([scope])')
      .forEach(th => th.setAttribute('scope', th.closest('thead') ? 'col' : 'row'));
    fixScopes(document);
    const main = document.querySelector('main');
    if (main && typeof MutationObserver === 'function') {
      const mo = new MutationObserver(ms => { for (const m of ms) if (m.addedNodes && m.addedNodes.length) { fixScopes(main); break; } });
      mo.observe(main, { childList: true, subtree: true });
    }
  } catch (e) { /* non-fatal */ }

  // auto-link glossary terms in the page's prose (not on the glossary itself)
  if (activeKey !== 'glossary') {
    try { autolinkGlossary(document.querySelector('main'), R('pages/glossary.html')); } catch (e) { /* non-fatal */ }
  }
}

// Re-link glossary jargon in freshly-rendered RESULT panels after a compute.
// Tools call this with the ids of the panels they just rendered; the static
// glossary on the glossary page is excluded by the caller never invoking it
// there. Non-fatal — a failure never breaks a reading.
export function autolinkResultPanels(ids) {
  try {
    const roots = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (roots.length) autolinkResults(roots, R('pages/glossary.html'));
  } catch (e) { /* non-fatal */ }
}

// --- A curated set of cities with coordinates and IANA-ish UTC offsets ---
// offset is the STANDARD-time offset; the user can adjust for DST.
export const CITIES = [
  ['London, UK', 51.5074, -0.1278, 0],
  ['Oxford, UK', 51.752, -1.2577, 0],
  ['Edinburgh, UK', 55.9533, -3.1883, 0],
  ['Dublin, IE', 53.3498, -6.2603, 0],
  ['Paris, FR', 48.8566, 2.3522, 1],
  ['Berlin, DE', 52.52, 13.405, 1],
  ['Rome, IT', 41.9028, 12.4964, 1],
  ['Madrid, ES', 40.4168, -3.7038, 1],
  ['Amsterdam, NL', 52.3676, 4.9041, 1],
  ['Athens, GR', 37.9838, 23.7275, 2],
  ['Moscow, RU', 55.7558, 37.6173, 3],
  ['Cairo, EG', 30.0444, 31.2357, 2],
  ['Istanbul, TR', 41.0082, 28.9784, 3],
  ['Dubai, AE', 25.2048, 55.2708, 4],
  ['Mumbai, IN', 19.076, 72.8777, 5.5],
  ['Delhi, IN', 28.6139, 77.209, 5.5],
  ['Bangkok, TH', 13.7563, 100.5018, 7],
  ['Singapore, SG', 1.3521, 103.8198, 8],
  ['Hong Kong', 22.3193, 114.1694, 8],
  ['Beijing, CN', 39.9042, 116.4074, 8],
  ['Tokyo, JP', 35.6762, 139.6503, 9],
  ['Sydney, AU', -33.8688, 151.2093, 10],
  ['Auckland, NZ', -36.8485, 174.7633, 12],
  ['New York, US', 40.7128, -74.006, -5],
  ['Chicago, US', 41.8781, -87.6298, -6],
  ['Denver, US', 39.7392, -104.9903, -7],
  ['Los Angeles, US', 34.0522, -118.2437, -8],
  ['Toronto, CA', 43.6532, -79.3832, -5],
  ['Mexico City, MX', 19.4326, -99.1332, -6],
  ['São Paulo, BR', -23.5505, -46.6333, -3],
  ['Buenos Aires, AR', -34.6037, -58.3816, -3],
  ['Johannesburg, ZA', -26.2041, 28.0473, 2],
  ['Lagos, NG', 6.5244, 3.3792, 1]
];

// Build a chart Date (UTC) from local date/time fields and a UTC offset (hours).
export function toUTC(dateStr, timeStr, offsetHours) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  // local time → UTC: subtract the offset
  return new Date(Date.UTC(y, mo - 1, d, h, mi) - offsetHours * 3600000);
}

// Populate a <select> with the city list; on change set lat/lon/offset inputs.
// Also injects a "📍 Use my location" button + a nearest-city status line right
// after the select, so every tool that wires a place picker gets device
// geolocation for free (offline nearest-city lookup; nothing leaves the page).
//
// `timeFields` (optional) makes the geolocate button "here AND now": when given
// { dateIn, timeIn, afterGeo? } it also fills the date/time with the current
// local moment and the offset with the nearest city's standard UTC offset, then
// calls afterGeo() so the tool can recompute. Present-moment pickers pass it;
// the birth-data picker does NOT (a birth time must never jump to "now").
export function wireCitySelect(sel, latIn, lonIn, offIn, timeFields = null) {
  sel.innerHTML = '<option value="">— choose a place —</option>' +
    CITIES.map(([n], i) => `<option value="${i}">${n}</option>`).join('');
  sel.addEventListener('change', () => {
    const c = CITIES[sel.value];
    if (!c) return;
    latIn.value = c[1]; lonIn.value = c[2]; if (offIn) offIn.value = c[3];
  });

  // Inject the geolocate control once, next to the select.
  try {
    if (sel.dataset && sel.dataset.geoWired) return;
    if (sel.dataset) sel.dataset.geoWired = '1';
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'btn-secondary sm geo-btn';
    btn.textContent = timeFields ? '📍 Use my location & time' : '📍 Use my location';
    const status = document.createElement('span');
    status.className = 'small muted geo-status'; status.style.marginLeft = '.5rem';
    sel.insertAdjacentElement('afterend', status);
    sel.insertAdjacentElement('afterend', btn);
    const onGeo = ({ lat, lon }) => {
      if (!timeFields) return;
      try {
        const f = nowLocalFields();
        if (timeFields.dateIn) timeFields.dateIn.value = f.date;
        if (timeFields.timeIn) timeFields.timeIn.value = f.time;
        const near = nearestCity(lat, lon);
        if (offIn && near) offIn.value = near.offset;     // best-guess standard offset for the place
        if (typeof timeFields.afterGeo === 'function') timeFields.afterGeo();
      } catch (e) { /* non-fatal */ }
    };
    attachGeolocate(btn, latIn, lonIn, status, onGeo);
  } catch (e) { /* non-fatal: the place picker still works without geolocation */ }
}

export function nowLocalFields() {
  const n = new Date();
  const pad = x => String(x).padStart(2, '0');
  return {
    date: `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`,
    time: `${pad(n.getHours())}:${pad(n.getMinutes())}`,
    offset: -n.getTimezoneOffset() / 60
  };
}

// ---------------------------------------------------------------------------
//  VERDICT_LEGEND — one explanation of the green / amber / red badge, reused on
//  every page that shows a verdict. It is a TRAFFIC-LIGHT GRAVITY SCALE for the
//  judgement only — deliberately distinguished from the planetary/talisman
//  COLOURS (e.g. Mars's red garment), which are a different thing entirely.
// ---------------------------------------------------------------------------
export const VERDICT_LEGEND = `<div class="callout verdict-legend"><span class="label">What the colours mean</span>
  The verdict badge is a <b>traffic-light scale for the gravity of the judgement</b>, not a quality of the planets:
  <span class="verdict green">green</span> few impediments — favourable / fit to proceed;
  <span class="verdict amber">amber</span> mixed — some cautions stand, weigh them;
  <span class="verdict red">red</span> strongly impeded — the testimonies stand against it.
  <span class="small muted">Red shows <em>severity</em>, nothing more — it is <b>not</b> the planetary or
  talisman colour red (e.g. Mars's red garment); those ritual colours are listed under each planet's
  correspondences and mean something different. The badge is a <b>crude count of impediments</b>, a quick
  summary — not a substitute for weighing the actual significators of the matter, which is the real Lilly method.</span></div>`;
