// ============================================================================
//  prasna.js (app) — drives pages/prasna.html. All DOM lives here; the pure
//  engines are core/prasna.js (the verified praśna ruleset), core/kp.js (the
//  249-entry KP sub-lord table) and core/vedic.js (the sidereal chart), with
//  the cited data in core/data/prasna-data.js.
//
//  The user asks a question, picks the quesited house and the moment/place
//  (defaults: here & now) — or supplies a KP horary number 1–249, which fixes
//  the praśna lagna from the querent's chosen sub-arc (KP Reader VI).
//
//  HONEST FRAMING: praśna is a historical divinatory grammar with no
//  demonstrated validity — every testimony rendered carries its citation;
//  described, never prescribed.
// ============================================================================
import { wireCitySelect, toUTC, autolinkResultPanels, nowLocalFields } from './shared.js';
import { initDivinationAssistant } from './divination-assistant.js';
import { castChart } from '../core/astro.js';
import { castVedic } from '../core/vedic.js';
import { prasnaJudgement } from '../core/prasna.js';
import { kpForNumber, kpSignificators, KP_CITATION, KP_FLAGS } from '../core/kp.js';
import { QUESITED_HOUSES } from '../core/data/prasna-data.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// exact degree°minute′second″ within a sign (all KP boundaries are integer arc-seconds)
function dmsInSign(absDeg, signIndex) {
  const total = Math.round((absDeg - signIndex * 30) * 3600);
  const d = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  return `${d}°${String(m).padStart(2, '0')}′${String(s).padStart(2, '0')}″`;
}
const arcLabel = e => `${dmsInSign(e.fromDeg, e.signIndex)}–${dmsInSign(e.toDeg, e.signIndex)} ${e.sign}`;
const sidLabel = lon => { const si = Math.floor(((lon % 360) + 360) % 360 / 30); return `${dmsInSign(((lon % 360) + 360) % 360, si)} ${['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][si]}`; };
const verdictSpan = l => l === 'for' || l === 'favourable' ? `<span class="verdict green">${l}</span>`
  : l === 'against' || l === 'unfavourable' ? `<span class="verdict red">${l}</span>`
  : `<span class="verdict amber">${l}</span>`;

// The last computed report, for the AI panel (wired separately). Subscribers
// get pinged on every recompute.
let lastReport = null;
const reportSubs = [];
const notifyReport = () => { for (const cb of reportSubs) { try { cb(lastReport); } catch { /* non-fatal */ } } };
export function currentPrasnaReport() { return lastReport; }
export function subscribePrasnaReport(cb) { reportSubs.push(cb); }

export function initPrasna() {
  // the quesited-house select — 12 bhāvas with meanings (7th = default)
  $('pr-house').innerHTML = QUESITED_HOUSES.map(h =>
    `<option value="${h.house}"${h.house === 7 ? ' selected' : ''}>${h.house} · ${esc(h.name)} — ${esc(h.meaning)}</option>`).join('');

  // the moment defaults to NOW, the place to London (adjust or use geolocation)
  const f = nowLocalFields();
  $('pr-date').value = f.date; $('pr-time').value = f.time; $('pr-offset').value = f.offset;
  $('pr-lat').value = 51.5074; $('pr-lon').value = -0.1278;
  wireCitySelect($('pr-city'), $('pr-lat'), $('pr-lon'), $('pr-offset'),
    { dateIn: $('pr-date'), timeIn: $('pr-time'), afterGeo: () => run() });

  $('pr-form').addEventListener('submit', e => { e.preventDefault(); run(); });

  // the AI panel: the shared divination assistant, Jyotiṣa-historian voice
  if ($('dv-assistant')) {
    initDivinationAssistant({
      kind: 'prasna',
      getReading: () => lastReport,
      subscribeReading: cb => reportSubs.push(cb),
      copy: { emptyText: 'Judge a praśna above first.' },
    });
  }
  run();
}

function run() {
  const lat = parseFloat($('pr-lat').value), lon = parseFloat($('pr-lon').value);
  if (isNaN(lat) || isNaN(lon)) { $('pr-status').textContent = 'Enter a latitude and longitude.'; return; }
  $('pr-status').textContent = '';
  const date = toUTC($('pr-date').value, $('pr-time').value, parseFloat($('pr-offset').value) || 0);
  const question = $('pr-question').value.trim();
  const quesitedHouse = parseInt($('pr-house').value, 10) || 7;
  const rawNum = $('pr-number').value.trim();
  const kpNumber = rawNum === '' ? null : parseInt(rawNum, 10);
  if (kpNumber != null && (isNaN(kpNumber) || kpNumber < 1 || kpNumber > 249)) {
    $('pr-status').textContent = 'The KP horary number must be 1–249 (or blank).'; return;
  }

  let v, judgement, kp, numberInfo = null;
  try {
    const chart = castChart(date, lat, lon, 'whole');
    v = castVedic(chart, { currentDate: new Date() });
    judgement = prasnaJudgement(v, { quesitedHouse, question, kpNumber });
    kp = kpSignificators(v);
    if (kpNumber != null) numberInfo = kpForNumber(kpNumber);
  } catch (e) {
    $('pr-chart').innerHTML = `<p class="muted">Could not compute the praśna chart (${esc(e.message)}).</p>`;
    return;
  }

  renderChart(v, judgement, date);
  renderNumber(numberInfo);
  renderJudgement(judgement);
  renderKp(v, kp);

  lastReport = {
    kind: 'prasna',
    question, quesitedHouse,
    quesited: judgement.quesited,
    momentUTC: date.toISOString(), place: { lat, lon },
    ayanamsa: v.ayanamsa, ayanamsaName: v.ayanamsaName,
    lagna: judgement.lagna,
    moon: judgement.moon,
    panchanga: v.panchanga,
    judgement,
    kp,
    horaryNumber: numberInfo,
  };
  notifyReport();
  try { autolinkResultPanels(['pr-chart', 'pr-judgement', 'pr-kp']); } catch { /* non-fatal */ }
}

// --- the sidereal praśna chart summary --------------------------------------
function renderChart(v, j, date) {
  const p = v.panchanga;
  const lagnaNote = j.lagna.overriddenByKpNumber
    ? `<p class="small"><b>Note:</b> the lagna below is FIXED by the KP horary number ${j.kpNumber} (the querent’s chosen sub-arc), not by the horizon at the moment — the KP Reader VI convention. The grahas stand for the moment of judgment.</p>` : '';
  $('pr-chart').innerHTML = `${lagnaNote}
    <table class="data"><tbody>
      <tr><th class="l">Moment (UTC)</th><td class="l">${esc(date.toISOString().replace('T', ' ').slice(0, 16))} UT</td></tr>
      <tr><th class="l">Praśna lagna</th><td class="l">${esc(sidLabel(j.lagna.lon))} — ${esc(j.lagna.sanskrit)} (${esc(j.lagna.sign)}), lord ${esc(j.lagna.lord)}; nakṣatra ${esc(j.lagna.nakshatra.sanskrit)} (pada ${j.lagna.nakshatra.pada})${j.lagna.shirshodaya ? ' · śīrṣodaya' : ''}</td></tr>
      <tr><th class="l">Moon (the querent’s mind)</th><td class="l">${esc(sidLabel(v.grahas.Moon.lon))} in ${esc(v.grahas.Moon.rashiSanskrit)} — house ${j.moon.house}; nakṣatra ${esc(j.moon.nakshatra.sanskrit)} (pada ${j.moon.nakshatra.pada})</td></tr>
      <tr><th class="l">Tithi &amp; pakṣa</th><td class="l">${esc(p.tithi.name)} (tithi ${p.tithi.num}) — ${esc(p.tithi.paksha)}</td></tr>
      <tr><th class="l">Vāra · yoga · karaṇa</th><td class="l">${esc(p.vara.name)} (lord ${esc(p.vara.lord)}) · ${esc(p.yoga.name)} · ${esc(p.karana.name)}</td></tr>
      <tr><th class="l">Ayanāṁśa</th><td class="l">${v.ayanamsa}° — ${esc(v.ayanamsaName)}</td></tr>
    </tbody></table>
    <p class="small muted">Sidereal (tropical − Lahiri ayanāṁśa), whole-sign bhāvas, mean node — the conventions of this site’s Vedic wing. The Moon’s nakṣatra at the query moment is praśna’s own data layer, with no Western analogue.</p>`;
}

// --- the KP horary number panel ----------------------------------------------
function renderNumber(info) {
  const card = $('pr-number-card');
  if (!info) { card.hidden = true; return; }
  card.hidden = false;
  const e = info.entry;
  $('pr-number-out').innerHTML = `
    <p class="small">Number <b>${info.number}</b> of 249 → the sub-arc <b>${esc(arcLabel(e))}</b>
      (${esc(e.nakshatraSanskrit)} nakṣatra${e.split ? '; one half of a rāśi-boundary split sub' : ''}).</p>
    <p class="small">Sub-lord chain: sign lord <b>${esc(e.signLord)}</b> → star lord <b>${esc(e.starLord)}</b> → sub-lord <b>${esc(e.subLord)}</b>
      <span class="muted">(in KP doctrine: context → flow → the claimed “final judge”)</span>.</p>
    <p class="small muted">${esc(info.convention)}</p>
    <p class="small muted">${esc(info.cite)}</p>`;
}

// --- the testimonies table -----------------------------------------------------
function renderJudgement(j) {
  const rows = j.testimonies.map(t => `<tr>
    <td class="l"><b>${esc(t.rule)}</b></td>
    <td class="l small">${esc(t.detail)}</td>
    <td>${verdictSpan(t.verdict)}</td>
    <td class="l small muted">${esc(t.cite)}</td></tr>`).join('');
  $('pr-judgement').innerHTML = `
    <p><b>Question:</b> ${j.question ? esc(j.question) : '<span class="muted">(none given — the configuration is judged in the abstract)</span>'}
      &nbsp;·&nbsp; <b>Quesited:</b> house ${j.quesitedHouse}, ${esc(j.quesited.name)} — ${esc(j.quesited.sign)} (${esc(j.quesited.sanskrit)}), lord ${esc(j.quesited.lord)}</p>
    <p>The testimonies lean ${verdictSpan(j.leaning)} — ${j.counts.for} for · ${j.counts.against} against · ${j.counts.neutral} neutral.
      <span class="small muted">A crude count of cited testimonies, not a prediction.</span></p>
    <table class="data"><thead><tr><th class="l">Rule</th><th class="l">Testimony</th><th>Leaning</th><th class="l">Source</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <p class="small muted" style="margin-top:.5rem"><b>Classification used:</b> benefics ${esc(j.classification.benefics.join(', '))};
      malefics ${esc(j.classification.malefics.join(', '))} (+ Rāhu/Ketu under the flagged Phaladīpikā extension); Moon ${esc(j.classification.paksha)}.
      <span class="muted">${esc(j.classification.cite)}</span></p>
    <div class="callout" style="margin-top:.6rem"><span class="label">A tone, not a verdict</span> ${esc(j.caveat)}</div>
    <h3>What the texts demand that no engine can compute</h3>
    <ul class="clean small">${j.outOfScope.map(o => `<li><b>${esc(o.layer)}</b> — ${esc(o.why)} <span class="muted">${esc(o.cite)}</span></li>`).join('')}</ul>
    <details class="small" style="margin-top:.5rem"><summary><b>Edition &amp; numbering discrepancies</b> (stored in-data, never silently resolved)</summary>
      <ul class="clean small">${j.editionFlags.map(f => `<li>${esc(f)}</li>`).join('')}</ul></details>`;
}

// --- the KP layer ---------------------------------------------------------------
function renderKp(v, kp) {
  const cuspRows = kp.cusps.map(c => `<tr>
    <td>${c.house}</td><td class="l">${esc(c.sign)} (${esc(c.signSanskrit)})</td>
    <td class="l">${esc(sidLabel(c.lon))}</td>
    <td>${esc(c.starLord)}</td><td><b>${esc(c.subLord)}</b></td></tr>`).join('');
  const planetRows = kp.planets.map(p => `<tr>
    <td class="l">${esc(p.planet)}</td><td class="l">${esc(sidLabel(p.lon))}</td>
    <td class="l">${esc(p.nakshatra)}</td><td>${esc(p.starLord)}</td><td><b>${esc(p.subLord)}</b></td></tr>`).join('');
  $('pr-kp').innerHTML = `
    <p class="small"><b>Lagna sub-lord:</b> ${esc(kp.lagna.signLord)} (sign) → ${esc(kp.lagna.starLord)} (star) → <b>${esc(kp.lagna.subLord)}</b> (sub) — table entry No. ${kp.lagna.entryNum}.
      &nbsp;·&nbsp; <b>Moon:</b> star lord ${esc(kp.moon.starLord)}, sub-lord <b>${esc(kp.moon.subLord)}</b>.</p>
    <p class="small muted">In KP doctrine the cuspal sub-lord is the claimed “final judge” of a house’s matter — sign lord sets context, star lord the flow, sub-lord the verdict. Reported as Krishnamurti’s method, never as a working truth.</p>
    <div class="grid cols-2">
      <div><h3>The 12 cusp sub-lords</h3>
        <table class="data"><thead><tr><th>House</th><th class="l">Sign</th><th class="l">Cusp</th><th>Star lord</th><th>Sub-lord</th></tr></thead>
        <tbody>${cuspRows}</tbody></table></div>
      <div><h3>Graha star- &amp; sub-lords</h3>
        <table class="data"><thead><tr><th class="l">Graha</th><th class="l">Position</th><th class="l">Nakṣatra</th><th>Star lord</th><th>Sub-lord</th></tr></thead>
        <tbody>${planetRows}</tbody></table></div>
    </div>
    <details class="small" style="margin-top:.5rem"><summary><b>KP flags</b> (conventions &amp; discrepancies stored in-data)</summary>
      <ul class="clean small">${KP_FLAGS.map(f => `<li>${esc(f)}</li>`).join('')}</ul></details>
    <p class="small muted" style="margin-top:.4rem">${esc(KP_CITATION)}</p>`;
}
