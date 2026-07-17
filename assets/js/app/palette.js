// ============================================================================
//  palette.js — the command palette (flow §2.6, D10, C7). The fourth wayfinding
//  organ: type-to-find over the data the site already has. Opens on Ctrl/⌘-K or
//  the header 🔍 button (NO global "/" — D10/C10). Index = NAV_GROUPS + REGISTRY
//  + ~40 curated aliases; glossary/atlas terms are NOT indexed (C7).
//
//  searchIndex is a PURE 30-line subsequence scorer (Fuse.js rejected) —
//  engine-tested. shared.js exports are read via a namespace import so this
//  module links even if a name is (transiently) absent in a lone worktree.
// ============================================================================

import * as shared from './shared.js';
import { REGISTRY } from '../core/registry.js';

const ROOT = shared.ROOT || (new URL('../../../', import.meta.url).href.replace(/\/$/, ''));
const R = p => `${ROOT}/${String(p).replace(/^\//, '')}`;

// ---------------------------------------------------------------------------
//  ALIASES — ~40 curated "what a person types" → destination rows. Every href
//  is a real page on disk (engine-test asserts they resolve).
// ---------------------------------------------------------------------------
export const ALIASES = [
  { q: 'birth chart', label: 'Nativity — a birth chart', href: 'pages/book3/nativity.html' },
  { q: 'natal chart', label: 'Nativity — a birth chart', href: 'pages/book3/nativity.html' },
  { q: 'horoscope', label: 'The Workbench — cast a chart', href: 'pages/workbench.html' },
  { q: 'cast a chart', label: 'The Workbench — Master Tool', href: 'pages/workbench.html' },
  { q: 'compatibility', label: 'Synastry — chart to chart', href: 'pages/synastry.html' },
  { q: 'relationship', label: 'Synastry — chart to chart', href: 'pages/synastry.html' },
  { q: 'marriage matching', label: 'Kūṭa matching — the aṣṭakūṭa', href: 'pages/kuta.html' },
  { q: 'question', label: 'Horary — ask a question', href: 'pages/book2/horary.html' },
  { q: 'yes or no', label: 'Horary — ask a question', href: 'pages/book2/horary.html' },
  { q: 'good time', label: 'Election — choose a moment', href: 'pages/picatrix/election.html' },
  { q: 'choose a moment', label: 'Election — choose a moment', href: 'pages/picatrix/election.html' },
  { q: 'auspicious time', label: 'Muhūrta — Indian election', href: 'pages/muhurta.html' },
  { q: 'magic square', label: 'Kameas — planetary squares & sigils', href: 'pages/picatrix/kameas.html' },
  { q: 'kamea', label: 'Kameas — planetary squares & sigils', href: 'pages/picatrix/kameas.html' },
  { q: 'yantra', label: 'Rasaśāstra & yantras', href: 'pages/rasa.html' },
  { q: 'talisman', label: 'Talisman Workshop', href: 'pages/picatrix/talisman.html' },
  { q: 'timeline', label: 'The Great Confluence — the atlas', href: 'pages/confluence.html' },
  { q: 'history', label: 'The Hermetic Chronology', href: 'pages/chronology/index.html' },
  { q: 'live sky', label: 'Right Now — live sky', href: 'pages/now.html' },
  { q: 'current transits', label: 'Transits to a natal', href: 'pages/transits.html' },
  { q: 'planetary hours', label: 'Planetary Hours', href: 'pages/book1/planetary-hours.html' },
  { q: 'dignities', label: 'Essential Dignities', href: 'pages/book1/dignities.html' },
  { q: 'tarot cards', label: 'Tarot — the spread', href: 'pages/tarot.html' },
  { q: 'i ching', label: 'I Ching — the Changes', href: 'pages/iching.html' },
  { q: 'hexagram', label: 'I Ching — the Changes', href: 'pages/iching.html' },
  { q: 'runes', label: 'Runes — Elder Futhark', href: 'pages/runes.html' },
  { q: 'geomancy', label: 'Geomancy — the Shield', href: 'pages/geomancy.html' },
  { q: 'divination', label: 'All Tools — the oracles', href: 'pages/tools.html' },
  { q: 'kabbalah', label: 'Kabbalah — Tree of Life', href: 'pages/kabbalah.html' },
  { q: 'gematria', label: 'Kabbalah — Tree of Life & gematria', href: 'pages/kabbalah.html' },
  { q: 'vedic', label: 'Vedic — Jyotiṣa (sidereal)', href: 'pages/vedic/index.html' },
  { q: 'jyotish', label: 'Vedic — Jyotiṣa (sidereal)', href: 'pages/vedic/index.html' },
  { q: 'dasha', label: 'Time-lords & progressions', href: 'pages/timelords.html' },
  { q: 'progressions', label: 'Time-lords & progressions', href: 'pages/timelords.html' },
  { q: 'life reading', label: 'Life Trajectory', href: 'pages/trajectory.html' },
  { q: 'learn astrology', label: 'Learn — the curriculum', href: 'pages/learn.html' },
  { q: 'how it works', label: "How it's calculated", href: 'pages/how-it-works.html' },
  { q: 'glossary', label: 'Glossary & Dictionary', href: 'pages/glossary.html' },
  { q: 'sources', label: 'Sources & Science', href: 'pages/about/index.html' },
  { q: 'ai', label: 'Grand Orchestrator (AI)', href: 'pages/autopilot.html' },
  { q: 'moon phase', label: 'Right Now — live sky', href: 'pages/now.html' },
  { q: 'eclipse', label: 'Cycles of History', href: 'pages/cycles.html' },
];

// ---------------------------------------------------------------------------
//  buildIndex — assemble the searchable rows. Each row: {label, href, kind,
//  group, hint}. Deduped by href+label.
// ---------------------------------------------------------------------------
export function buildIndex() {
  const rows = [];
  const groups = Array.isArray(shared.NAV_GROUPS) ? shared.NAV_GROUPS : [];
  groups.forEach((g, gi) => {
    (g.items || []).forEach(([href, label]) => rows.push({ label, href, kind: g.label || 'Page', group: g.label, order: gi, hint: pathHint(href) }));
  });
  const regList = Array.isArray(REGISTRY) ? REGISTRY : [];
  regList.forEach(r => {
    const page = (r.pages && r.pages[0]) || null;
    if (!page) return;
    rows.push({ label: r.title || r.id, href: page, kind: 'Capability', group: 'Reference', order: 90, hint: (r.computes || '').slice(0, 90) });
  });
  ALIASES.forEach(a => rows.push({ label: a.label, href: a.href, kind: 'Search', group: 'Alias', order: 50, alias: a.q, hint: pathHint(a.href) }));
  // dedupe by href|label
  const seen = new Set(), out = [];
  for (const r of rows) { const k = r.href + '|' + r.label; if (!seen.has(k)) { seen.add(k); out.push(r); } }
  return out;
}
function pathHint(href) { return String(href).replace(/^pages\//, '').replace(/\.html$/, '').replace(/\/index$/, ''); }

// ---------------------------------------------------------------------------
//  searchIndex(q, items, limit) — PURE. prefix > word-boundary > substring >
//  subsequence; ties broken by item.order then label length. Matches against
//  the label AND the alias text (if any).
// ---------------------------------------------------------------------------
export function searchIndex(q, items, limit = 9) {
  const query = String(q || '').trim().toLowerCase();
  if (!query) return items.slice(0, limit);
  const scored = [];
  for (const it of items) {
    const s = Math.max(scoreOne(query, (it.label || '').toLowerCase()), it.alias ? scoreOne(query, it.alias.toLowerCase()) + 40 : -Infinity);
    if (s > -Infinity) scored.push({ it, s });
  }
  scored.sort((a, b) => b.s - a.s || (a.it.order || 0) - (b.it.order || 0) || (a.it.label || '').length - (b.it.label || '').length);
  return scored.slice(0, limit).map(x => x.it);
}
function scoreOne(q, l) {
  if (!l) return -Infinity;
  if (l === q) return 1200;
  if (l.startsWith(q)) return 1000 - l.length;
  const words = l.split(/[^a-z0-9]+/);
  if (words.some(w => w.startsWith(q))) return 800 - l.length;
  const idx = l.indexOf(q);
  if (idx >= 0) return 600 - idx - l.length * 0.1;
  // subsequence
  let qi = 0;
  for (let i = 0; i < l.length && qi < q.length; i++) if (l[i] === q[qi]) qi++;
  if (qi === q.length) return 300 - l.length * 0.1;
  return -Infinity;
}

// ===========================================================================
//  mountPalette — the <dialog> UI. Returns { open, close, el }. shared.js
//  mounts this on every page (dynamic import) and points the header 🔍 button
//  at .open(). No transition (reduced-motion parity is trivial — none needed).
// ===========================================================================
export function mountPalette() {
  if (typeof document === 'undefined') return null;
  if (document.getElementById('cmdk-dialog')) return null;   // once per page

  const dialog = document.createElement('dialog');
  dialog.className = 'cmdk';
  dialog.id = 'cmdk-dialog';
  dialog.setAttribute('aria-label', 'Search the site');
  dialog.innerHTML = `
    <form method="dialog" class="cmdk-form">
      <input type="search" class="cmdk-input" role="combobox" aria-expanded="true" aria-controls="cmdk-list"
             aria-autocomplete="list" autocomplete="off" placeholder="Search the site — a tool, a tradition, an oracle…" aria-label="Search the site">
      <ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Results"></ul>
      <p class="cmdk-foot small muted">↑↓ to move · ↵ to open · Esc to close</p>
    </form>`;
  document.body.appendChild(dialog);

  const input = dialog.querySelector('.cmdk-input');
  const list = dialog.querySelector('.cmdk-list');
  let index = [], results = [], active = 0;

  const render = () => {
    results = searchIndex(input.value, index, 9);
    active = 0;
    list.innerHTML = results.map((r, i) => `
      <li id="cmdk-opt-${i}" role="option" class="cmdk-row${i === 0 ? ' is-active' : ''}" aria-selected="${i === 0}">
        <span class="cmdk-kicker">${escapeHtml(r.kind || '')}</span>
        <span class="cmdk-label">${escapeHtml(r.label || '')}</span>
        <span class="cmdk-path small muted">${escapeHtml(r.hint || '')}</span>
      </li>`).join('') || `<li class="cmdk-row cmdk-empty small muted" role="option" aria-selected="false">No matches — try the menu at the top.</li>`;
    input.setAttribute('aria-activedescendant', results.length ? 'cmdk-opt-0' : '');
  };
  const setActive = i => {
    if (!results.length) return;
    active = (i + results.length) % results.length;
    Array.from(list.children).forEach((li, j) => { const on = j === active; li.classList.toggle('is-active', on); li.setAttribute('aria-selected', String(on)); if (on) { input.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); } });
  };
  const go = i => { const r = results[i]; if (r) { close(); location.href = R(r.href); } };

  input.addEventListener('input', render);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(active); }
    // Esc: <input type="search"> swallows the first Escape (native clear), so the
    // dialog's native cancel never fires — close it explicitly (footer says "Esc to close").
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  list.addEventListener('mousedown', e => { const li = e.target.closest('.cmdk-row'); if (!li || li.classList.contains('cmdk-empty')) return; e.preventDefault(); go(Array.from(list.children).indexOf(li)); });

  function open() {
    if (dialog.open) return;
    index = buildIndex();
    input.value = '';
    render();
    try { dialog.showModal(); } catch (e) { dialog.setAttribute('open', ''); }
    input.focus();
  }
  function close() { try { if (dialog.open) dialog.close(); } catch (e) { dialog.removeAttribute('open'); } }

  // global Ctrl/⌘-K (no "/" binding — D10)
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); dialog.open ? close() : open(); }
  });

  return { open, close, el: dialog };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
