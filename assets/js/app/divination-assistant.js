// ============================================================================
//  divination-assistant.js — the "Ask the diviner" panel for the Geomancy and
//  Tarot tools. It narrates the COMPUTED, CITED cast (from core/llm-context.js)
//  through the shared browser-direct transport (app/llm-core.js), with the
//  user's OWN key (BYOK — nothing proxied, no key bundled). The model speaks in
//  the learned-historian-diviner voice (DIVINER_PREAMBLE) but is held to the
//  same locked honest framing as the rest of the site: described, never
//  prescribed; a pseudoscience; no real prediction or advice.
//
//  Shares the provider/key storage with the Workbench assistant, so a key pasted
//  once works everywhere. Exposes `prefill(text)` so a per-figure / per-card
//  "✶ explain this" button can drop a question into the box and focus it.
//
//  VERIFY-GATE: no network request fires on load; every fetch is on an explicit
//  click and wrapped so a failure updates the panel, never throws.
// ============================================================================
import {
  buildGeomancyContext, buildTarotContext, buildIchingContext,
  buildGeomancyInterpretPrompt, buildTarotInterpretPrompt, buildIchingInterpretPrompt,
  geomancyDataBlock, tarotDataBlock, ichingDataBlock, SITE_URLS,
} from '../core/llm-context.js';
import { PROVIDERS, PROV_ORDER, streamChat, factBudget, isFreeKind, openrouterHeaders } from './llm-core.js';
import { LOCAL_DEFAULTS } from './local-config.js';
import { downloadText } from './state.js';

const PROV_STORE = 'wb-llm-provider';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const el = id => document.getElementById(id);

let api = null, currentReading = null, history = [], controller = null;

const provName = () => { const s = el('dv-asst-provider'); return s && PROVIDERS[s.value] ? s.value : 'anthropic'; };
const provCfg = () => PROVIDERS[provName()];
const isFree = () => isFreeKind(provCfg().kind);
const keyStore = () => 'wb-llm-key-' + provName();
const baseStore = () => 'wb-llm-base-' + provName();
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
const lsDel = k => { try { localStorage.removeItem(k); } catch { /* ignore */ } };
// default provider: remembered choice, else local-config default, else Groq
const defaultProv = () => { const p = lsGet(PROV_STORE) || LOCAL_DEFAULTS.provider || 'groq'; return PROVIDERS[p] ? p : 'groq'; };
// pre-fill the key: remembered key, else the local-config key (this device only)
const prefillKey = () => lsGet(keyStore()) || (provName() === LOCAL_DEFAULTS.provider ? (LOCAL_DEFAULTS.key || '') : '');

// Build the grounded context + interpret prompt for whichever divination we are.
// Free OpenAI-compatible tiers have small per-minute token caps (Groq's 8000 TPM),
// and the diviner persona + glossary already cost ~700 tokens, so free providers
// get a much leaner fact set and a trimmed glossary (and drop the JSON data block
// below) to keep a grounded interpret request under the cap.
const CTX = { geomancy: buildGeomancyContext, tarot: buildTarotContext, iching: buildIchingContext };
const PROMPT = { geomancy: buildGeomancyInterpretPrompt, tarot: buildTarotInterpretPrompt, iching: buildIchingInterpretPrompt };
const DATABLOCK = { geomancy: geomancyDataBlock, tarot: tarotDataBlock, iching: ichingDataBlock };
const SUBJECT = { geomancy: 'shield', tarot: 'spread', iching: 'cast' };

function buildCtx(reading, big) {
  const free = isFree();
  const maxFacts = free ? (big ? 22 : 14) : factBudget(provCfg().kind, big);
  const maxGlossary = free ? 4 : 99;
  return (CTX[api.kind] || buildGeomancyContext)(reading, { maxFacts, maxGlossary });
}
function interpretBody(reading) {
  const base = (PROMPT[api.kind] || buildGeomancyInterpretPrompt)(reading);
  if (isFree()) return base; // the cited facts in the system prompt already ground the cast
  return base + (DATABLOCK[api.kind] || geomancyDataBlock)(reading);
}
const subjectWord = () => SUBJECT[api.kind] || 'cast';

export function initDivinationAssistant(_api) {
  api = _api || {};
  currentReading = api.getReading ? api.getReading() : null;
  render();
  if (api.subscribeReading) api.subscribeReading(r => { currentReading = r; refreshPreview(); });
  return { prefill };
}

function render() {
  const host = el('dv-assistant');
  if (!host) return;
  const savedProv = defaultProv();
  host.innerHTML = `
    <div class="callout science" style="margin-top:0"><span class="label">About this diviner</span>
      It interprets the <b>computed, cited</b> ${esc(subjectWord())} above using an LLM called directly from your browser with
      <b>your own API key</b> (nothing is proxied; no key is bundled). It narrates in the voice of a learned
      historian of the Western esoteric tradition — vivid about the figures, cards and their <b>rituals</b> — yet it
      describes a <b>pseudoscientific</b> art for study only: never a prediction, never advice. Use <b>Claude</b> or a
      <b>free-tier</b> provider (Groq, Gemini, OpenRouter…). The same key works across every tool on the site.</div>

    <fieldset style="border:1px solid #2a3350;border-radius:.5rem;padding:.7rem .8rem;margin:.6rem 0">
      <legend class="small" style="padding:0 .4rem">Connect an AI (your own key)</legend>
      <div class="field-row" style="align-items:flex-end;flex-wrap:wrap;gap:.6rem">
        <div class="field" style="flex:1 1 240px"><label for="dv-asst-provider">Provider</label>
          <select id="dv-asst-provider">${PROV_ORDER.map(k => `<option value="${k}">${esc(PROVIDERS[k].label)}</option>`).join('')}</select></div>
        <div class="field"><label for="dv-asst-model">Model</label><select id="dv-asst-model"></select></div>
      </div>
      <div class="field-row" id="dv-asst-base-row" style="margin-top:.5rem;display:none"><div class="field" style="flex:1 1 100%">
        <label for="dv-asst-base">Base URL (OpenAI-compatible, ending in <code>/v1</code>)</label>
        <input id="dv-asst-base" type="text" spellcheck="false" placeholder="https://host/v1" style="width:100%"></div></div>
      <div class="field-row" style="align-items:flex-end;flex-wrap:wrap;gap:.6rem;margin-top:.5rem">
        <div class="field" style="flex:1 1 320px"><label for="dv-asst-key">API key</label>
          <input id="dv-asst-key" type="password" autocomplete="off" spellcheck="false" style="width:100%"></div>
        <a id="dv-asst-getkey" class="small" rel="noopener" target="_blank" href="#">get a key ↗</a>
      </div>
      <div class="field-row" style="align-items:center;gap:1rem;margin-top:.5rem">
        <label class="small" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="dv-asst-remember"> remember on this device</label>
      </div>
      <p id="dv-asst-status" class="small muted" style="margin:.4rem 0 0">Paste your key and ask — nothing is sent until you do.</p>
    </fieldset>

    <div class="field-row" style="gap:.4rem;margin:.2rem 0 .3rem;flex-wrap:wrap">
      <button type="button" class="btn sm" id="dv-asst-interpret">🔮 Interpret this ${esc(subjectWord())} — the whole reading</button>
    </div>
    <p class="small muted" style="margin:.1rem 0 .6rem">First <b>cast above</b>; the button sends the <b>whole computed
      ${esc(subjectWord())} as data</b> so the model reads the real figures. Each reply has a <b>⤓ save</b> link.</p>

    <div id="dv-asst-log" class="small" style="max-height:24rem;overflow:auto;border:1px solid #2a3350;border-radius:.4rem;padding:.6rem;background:#0c0f1a"></div>
    <div class="field-row" style="margin-top:.5rem;gap:.4rem">
      <textarea id="dv-asst-input" rows="2" placeholder="Ask about this ${esc(subjectWord())}… (e.g. “what does the Judge mean here?”)" style="flex:1 1 320px;min-width:240px"></textarea>
      <button type="button" class="btn" id="dv-asst-send">Send</button>
      <button type="button" class="btn sm" id="dv-asst-stop">Stop</button>
    </div>

    <details style="margin-top:.6rem"><summary class="small">What the model is told (the grounded facts)</summary>
      <div id="dv-asst-preview" class="small muted"></div></details>`;

  el('dv-asst-provider').value = savedProv;
  onProviderChange();
  el('dv-asst-provider').addEventListener('change', () => { lsSet(PROV_STORE, provName()); onProviderChange(); });
  el('dv-asst-interpret').addEventListener('click', () => interpret());
  el('dv-asst-send').addEventListener('click', () => send());
  el('dv-asst-stop').addEventListener('click', () => { if (controller) controller.abort(); });
  el('dv-asst-input').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
  el('dv-asst-key').addEventListener('change', () => persistKey());
  el('dv-asst-base').addEventListener('change', () => lsSet(baseStore(), el('dv-asst-base').value.trim()));
  el('dv-asst-remember').addEventListener('change', () => persistKey());
  refreshPreview();
}

function onProviderChange() {
  const p = provCfg();
  el('dv-asst-model').innerHTML = p.models.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('');
  el('dv-asst-key').placeholder = p.keyHint;
  el('dv-asst-key').value = prefillKey();
  el('dv-asst-remember').checked = !!lsGet(keyStore());
  el('dv-asst-base-row').style.display = p.custom ? '' : 'none';
  if (p.custom) el('dv-asst-base').value = lsGet(baseStore()) || '';
  const gk = el('dv-asst-getkey'); if (gk) { gk.href = p.keyUrl || '#'; gk.style.display = p.keyUrl ? '' : 'none'; }
  setStatus(p.cors === 'unknown'
    ? 'Note: this provider’s browser-direct (CORS) support is unverified — if you see a network error, it blocks direct calls; use Claude/Groq/Gemini/OpenRouter.'
    : 'Paste your key and ask — nothing is sent until you do.');
}

function setStatus(t) { const s = el('dv-asst-status'); if (s) s.innerHTML = t; }
function getKey() { const k = el('dv-asst-key') ? el('dv-asst-key').value.trim() : ''; persistKey(); return k; }
function persistKey() {
  const remember = el('dv-asst-remember') && el('dv-asst-remember').checked;
  const k = el('dv-asst-key') ? el('dv-asst-key').value.trim() : '';
  if (remember && k) lsSet(keyStore(), k); else lsDel(keyStore());
}

function refreshPreview() {
  const p = el('dv-asst-preview'); if (!p) return;
  if (!currentReading) { p.textContent = `Cast a ${subjectWord()} above first.`; return; }
  try { const { facts } = buildCtx(currentReading, false);
    p.innerHTML = '<ul class="clean">' + facts.map(f => `<li>${esc(f.text)}${f.cite ? ` <span class="muted">[${esc(f.cite)}]</span>` : ''}</li>`).join('') + '</ul>';
  } catch { p.textContent = 'Could not build the context.'; }
}

function appendMsg(role, text) {
  const log = el('dv-asst-log');
  const turn = document.createElement('div');
  turn.className = `wb-chat-turn ${role === 'user' ? 'wb-chat-user' : 'wb-chat-bot'}`;
  const label = document.createElement('div');
  label.className = 'wb-chat-role';
  label.innerHTML = `<span aria-hidden="true">${role === 'user' ? '🜨' : '✶'}</span> ${role === 'user' ? 'You' : provName() === 'anthropic' ? 'Claude' : 'The diviner'}`;
  const body = document.createElement('div');
  body.className = 'wb-chat-body'; body.textContent = text;
  turn.appendChild(label); turn.appendChild(body);
  log.appendChild(turn); log.scrollTop = log.scrollHeight;
  return body;
}
const scrollLog = () => { const l = el('dv-asst-log'); if (l) l.scrollTop = l.scrollHeight; };

function addSaveLink(bodyEl, text, name) {
  if (!bodyEl || !text) return;
  const turn = bodyEl.closest('.wb-chat-turn') || bodyEl.parentElement; if (!turn) return;
  const a = document.createElement('a');
  a.href = '#'; a.className = 'wb-chat-save'; a.style.display = 'inline-block'; a.style.marginTop = '.4rem';
  a.textContent = '⤓ save this reply';
  a.addEventListener('click', e => { e.preventDefault(); downloadText(text, `${api.kind}-${name || 'reply'}.md`, 'text/markdown;charset=utf-8'); });
  turn.appendChild(a);
}

function preflight() {
  if (!currentReading) { setStatus(`Cast a ${subjectWord()} above first.`); return false; }
  if (provCfg().custom && !(el('dv-asst-base').value || '').trim()) { setStatus('Enter the OpenAI-compatible base URL.'); return false; }
  if (!getKey()) { setStatus('Enter your API key first.'); return false; }
  setStatus(''); return true;
}

async function transport(messages, system, asstEl, maxTokens) {
  const p = provCfg();
  asstEl.textContent = '';
  const full = await streamChat({
    provider: p, url: p.url, baseUrl: p.custom ? (el('dv-asst-base').value || '') : '',
    model: el('dv-asst-model').value, key: getKey(),
    system, messages, maxTokens, signal: controller.signal,
    extraHeaders: provName() === 'openrouter' ? openrouterHeaders(SITE_URLS && SITE_URLS.home) : null,
    onDelta: t => { asstEl.textContent = t; scrollLog(); },
  });
  history.push({ role: 'assistant', content: full });
  return full;
}

async function send() {
  const input = el('dv-asst-input');
  const q = input.value.trim(); if (!q || !preflight()) return;
  input.value = '';
  const { system } = buildCtx(currentReading, false);
  const messages = [...history.slice(isFree() ? -4 : -8), { role: 'user', content: q }];
  history.push({ role: 'user', content: q });
  appendMsg('user', q);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await transport(messages, system, asstEl, 3072); addSaveLink(asstEl, out, 'reply'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

async function interpret() {
  if (!preflight()) return;
  const { system } = buildCtx(currentReading, true);
  appendMsg('user', `🔮 Interpret this ${subjectWord()} — the whole reading (data sent)`);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await transport([{ role: 'user', content: interpretBody(currentReading) }], system, asstEl, 6144); addSaveLink(asstEl, out, 'interpretation'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

// Per-figure / per-card "explain this" affordance: drop a question into the box.
export function prefill(text) {
  const input = el('dv-asst-input'); if (!input) return;
  input.value = text;
  const card = document.getElementById('dv-assistant-card') || el('dv-assistant');
  if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  input.focus();
}
