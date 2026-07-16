// ============================================================================
//  library.js (app) — renders THE PRACTITIONERS' LIBRARY per-domain pages from
//  the cited data module (core/data/practitioners.js, one source of truth).
//
//  Each domain page groups its records BY PRACTICE (an <h2> per practice that
//  cross-links to the site's matching tool/wing), and within a practice orders
//  the expert cards by tier — canon first, then respected, niche, academic.
//  Every card shows name / years / tier chip / school / one-line who-they-are,
//  the verified works, any journal papers, and — where a named work teaches one
//  — the STEP-BY-STEP METHOD as an ordered list ("as taught in <methodSource>"),
//  with honest-framing/belief-context flags rendered as ⚑ notes. A client-side
//  name/practice filter box drives a live re-render; the journals section is
//  appended at the bottom. Every card carries an anchor id.
//
//  DOM lives here; the data stays pure in core/**.
// ============================================================================
import { PRACTITIONERS_BY_DOMAIN, TIER_DEFS, JOURNALS } from '../core/data/practitioners.js';
import { autolinkResultPanels } from './shared.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const TIER_ORDER = ['canon', 'respected', 'niche', 'academic'];
const TIER_LABEL = Object.fromEntries(TIER_DEFS.map(t => [t.key, t.label]));
// Tier chips are inline-styled so no site CSS is touched.
const TIER_CHIP = {
  canon:     { bg: '#efe0bd', fg: '#5a4410' },
  respected: { bg: '#e7eef7', fg: '#2b4a6b' },
  niche:     { bg: '#f0e8d4', fg: '#7a5a06' },
  academic:  { bg: '#d8efd6', fg: '#1f5e1d' },
};

// Practice → the site's matching tool/wing page (hrefs relative to
// pages/library/). Verified to exist against the repo's page tree.
const PRACTICE_LINKS = {
  // western
  'Horary': { href: '../book2/horary.html', label: 'Horary — cast a question' },
  'Electional': { href: '../picatrix/election.html', label: 'Election — choose a moment' },
  'Natal (Hellenistic / Medieval / Renaissance)': { href: '../book3/nativity.html', label: 'Nativity — a birth chart' },
  'Mundane': { href: '../cycles.html', label: 'Cycles of History — conjunctions & eclipses' },
  'Astrological Magic (Picatrix)': { href: '../picatrix/talisman.html', label: 'Talisman Workshop' },
  // indian
  'Parāśarī (natal)': { href: '../vedic/index.html', label: 'Vedic — Jyotiṣa (Jagannath Hora)' },
  'Jaimini': { href: '../vedic/index.html', label: 'Vedic — Jyotiṣa (Jagannath Hora)' },
  'Nakṣatra': { href: '../vedic/index.html', label: 'Vedic — the nakṣatras & pañcāṅga' },
  'KP (Krishnamurti Paddhati)': { href: '../prasna.html', label: 'Praśna & the KP sub-lords' },
  'Tājika (varṣaphala)': { href: '../tajika.html', label: 'Tājika varṣaphala — the annual chart' },
  'Muhūrta': { href: '../muhurta.html', label: 'Muhūrta — the Indian election' },
  'Praśna': { href: '../prasna.html', label: 'Praśna — Indian horary' },
  'Nāḍī': { href: '../vedic/index.html', label: 'Vedic — Jyotiṣa (Jagannath Hora)' },
  'History of jyotiṣa (scholarship)': { href: '../vedic/index.html', label: 'Vedic — the Jyotiṣa wing' },
  'Rasaśāstra & alchemy (scholarship)': { href: '../rasa.html', label: 'Rasaśāstra & yantras' },
  'Yoga (scholarship)': { href: '../yoga/index.html', label: 'The Yoga Sūtras — the study wing' },
  // esoteric
  'Tarot': { href: '../tarot.html', label: 'Tarot — the spread, laid & read' },
  'Geomancy': { href: '../geomancy.html', label: 'Geomancy — the Shield Chart' },
  'I Ching': { href: '../iching.html', label: 'I Ching — the Book of Changes' },
  'Runes': { href: '../runes.html', label: 'Runes — the Elder Futhark' },
  'Kabbalah': { href: '../kabbalah.html', label: 'Kabbalah — the Tree of Life' },
  'Alchemy': { href: '../chronology/alchemy.html', label: 'Alchemy — the Great Work' },
  'Jung & divination': { href: '../jung/index.html', label: 'Jung & astrology' },
};

function tierChip(tier) {
  const c = TIER_CHIP[tier] || TIER_CHIP.canon;
  return `<span class="chip" style="background:${c.bg};color:${c.fg}">${esc(TIER_LABEL[tier] || tier)}</span>`;
}

function workLine(w) {
  const bits = [];
  if (w.year !== undefined && w.year !== null && w.year !== '') bits.push(esc(w.year));
  if (w.publisher) bits.push(esc(w.publisher));
  const tail = bits.length ? ` <span class="muted">— ${bits.join(', ')}</span>` : '';
  return `<li><b>${esc(w.title)}</b>${tail}</li>`;
}

function paperLine(p) {
  const jr = [p.journal, p.year].filter(x => x !== undefined && x !== null && x !== '').map(esc).join(', ');
  return `<li>“${esc(p.title)}”${jr ? ` <span class="muted">— ${jr}</span>` : ''}</li>`;
}

function methodBlock(p) {
  if (!p.methodSteps || !p.methodSteps.length) return '';
  const src = p.methodSource ? ` <span class="muted small">— as taught in ${esc(p.methodSource)}</span>` : '';
  return `<div class="lib-method">
    <p class="small" style="margin:.5rem 0 .25rem"><b>The method, step by step</b>${src}</p>
    <ol class="small">${p.methodSteps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>`;
}

function flagBlock(p) {
  if (!p.flags || !p.flags.length) return '';
  return p.flags.map(f => `<p class="small" style="margin:.25rem 0;color:#7a5a06">⚑ ${esc(f)}</p>`).join('');
}

function card(p) {
  const id = `x-${slug(p.name)}`;
  const years = p.years ? `<span class="muted">${esc(p.years)}</span>` : '';
  const tierNote = p.tierNote ? `<p class="small" style="margin:.15rem 0;color:#5a5340"><i>${esc(p.tierNote)}</i></p>` : '';
  const papers = p.papers && p.papers.length
    ? `<p class="small" style="margin:.4rem 0 .1rem"><b>Papers</b></p><ul class="clean small">${p.papers.map(paperLine).join('')}</ul>` : '';
  return `<article class="card" id="${id}">
    <h3 style="margin-bottom:.15rem">${esc(p.name)} ${tierChip(p.tier)}</h3>
    <p class="small" style="margin:.1rem 0 .4rem">${years}${years && p.school ? ' · ' : ''}${esc(p.school)}</p>
    ${tierNote}
    <p style="margin:.35rem 0">${esc(p.line)}</p>
    <p class="small" style="margin:.4rem 0 .1rem"><b>Works</b></p>
    <ul class="clean small">${p.works.map(workLine).join('')}</ul>
    ${papers}
    ${methodBlock(p)}
    ${flagBlock(p)}
    <p class="small muted" style="margin-top:.5rem">✓ Verified: ${esc(p.verified)}<br>▸ ${esc(p.cite)}</p>
  </article>`;
}

// Ordered, de-duplicated list of practices as they first appear in the data.
function practiceOrder(records) {
  const seen = new Set(); const order = [];
  for (const r of records) if (!seen.has(r.practice)) { seen.add(r.practice); order.push(r.practice); }
  return order;
}

function matches(p, q) {
  if (!q) return true;
  const hay = `${p.name} ${p.practice} ${p.school} ${p.line} ${p.tier} `
    + p.works.map(w => w.title).join(' ') + ' ' + (p.flags || []).join(' ');
  return hay.toLowerCase().includes(q);
}

export function initLibrary(domain) {
  const host = $('lib-catalog'); if (!host) return;
  const records = (PRACTITIONERS_BY_DOMAIN[domain] || []).slice();
  const order = practiceOrder(records);
  const qIn = $('lib-search'), count = $('lib-count'), reset = $('lib-reset');

  function render() {
    const q = qIn ? qIn.value.trim().toLowerCase() : '';
    let html = '', shown = 0;
    for (const practice of order) {
      const group = records
        .filter(r => r.practice === practice && matches(r, q))
        .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
      if (!group.length) continue;
      shown += group.length;
      const link = PRACTICE_LINKS[practice];
      const linkHtml = link ? ` <a class="small" href="${esc(link.href)}" style="font-weight:600">→ ${esc(link.label)}</a>` : '';
      html += `<section class="lib-practice"><h2 id="p-${slug(practice)}" style="margin-bottom:.3rem">${esc(practice)}</h2>
        <p class="small muted" style="margin:0 0 .6rem">${group.length} ${group.length === 1 ? 'entry' : 'entries'} ·${linkHtml || ' (reference)'}</p>
        <div class="grid cols-2">${group.map(card).join('')}</div></section>`;
    }
    host.innerHTML = shown ? html
      : '<p class="muted" style="padding:1rem 0">No practitioners match — try clearing the filter.</p>';
    if (count) count.textContent = `${shown} of ${records.length} practitioners`;
    try { autolinkResultPanels(['lib-catalog']); } catch { /* non-fatal */ }
  }

  if (qIn) qIn.addEventListener('input', render);
  if (reset) reset.addEventListener('click', () => { if (qIn) qIn.value = ''; render(); });
  render();

  // Journals & resources footer.
  const jhost = $('lib-journals');
  if (jhost && JOURNALS[domain]) {
    jhost.innerHTML = `<ul class="clean">${JOURNALS[domain].map(j =>
      `<li><b>${esc(j.name)}</b> <span class="muted small">— ${esc(j.note)}</span></li>`).join('')}</ul>`;
  }
}
