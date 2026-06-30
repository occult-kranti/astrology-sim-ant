// ============================================================================
//  assistant.js — the "Ask the Workbench" panel. It narrates the COMPUTED,
//  CITED reading (from core/llm-context.js) using an LLM called DIRECTLY from
//  the browser with the user's OWN key (BYOK — nothing is proxied). Two backend
//  kinds are supported:
//    • Anthropic (Claude) — the recommended default; supports the agentic
//      tool-loop (the model runs the real engine tools).
//    • OpenAI-compatible — Groq, Google Gemini (OpenAI endpoint), OpenRouter,
//      Cerebras, Mistral, or any custom base URL. Lets a user bring a FREE-tier
//      key. Streaming chat only (the data is embedded; no live tool-calls).
//
//  Three uses: free chat about the reading; "Codex of this Hour" (a Hermes/
//  Picatrix codebook narration); and "Plan a working" (map an aim to a
//  catalogued operation + the favourable window).
//
//  HONEST / SAFETY: no key is ever bundled — every request uses the user's own
//  key and goes only to that provider's endpoint. The system prompt is the
//  locked honest-framing preamble; facts are engine-computed & cited; the model
//  describes a historical, pseudoscientific tradition — it does not advise or
//  predict. VERIFY-GATE: NO network request fires on load; every fetch is on an
//  explicit click and is wrapped so a failure updates the panel, never throws.
// ============================================================================
import { buildContext, runTool, toAnthropicTools, buildCodexPrompt, buildSynthesisPrompt, buildOperationPrompt, dataBlockFor, SITE_URLS } from '../core/llm-context.js';
import { downloadText } from './state.js';

// --- providers --------------------------------------------------------------
//  `kind`: 'anthropic' (native Messages API) or 'openai' (/chat/completions).
//  `cors`: whether the provider is known to allow browser-direct calls. Honest:
//  if a provider blocks CORS, the user sees a network error (no key leaks).
const PROVIDERS = {
  anthropic: {
    label: 'Claude (Anthropic) — recommended, supports tools', kind: 'anthropic', tools: true, cors: 'yes',
    url: 'https://api.anthropic.com/v1/messages', keyHint: 'sk-ant-…', keyUrl: 'https://platform.claude.com',
    models: [['claude-opus-4-8', 'Opus 4.8 — recommended'], ['claude-fable-5', 'Fable 5 — most powerful'], ['claude-sonnet-4-6', 'Sonnet 4.6 — balanced'], ['claude-haiku-4-5', 'Haiku 4.5 — fast & cheap']],
  },
  groq: {
    label: 'Groq — free tier, very fast (no card)', kind: 'openai', tools: false, cors: 'yes',
    url: 'https://api.groq.com/openai/v1/chat/completions', keyHint: 'gsk_…', keyUrl: 'https://console.groq.com/keys',
    models: [['openai/gpt-oss-120b', 'GPT-OSS 120B'], ['openai/gpt-oss-20b', 'GPT-OSS 20B (fast)'], ['qwen/qwen3-32b', 'Qwen3 32B']],
  },
  gemini: {
    label: 'Google Gemini — free tier (no card)', kind: 'openai', tools: false, cors: 'yes',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', keyHint: 'AIza…', keyUrl: 'https://aistudio.google.com/apikey',
    models: [['gemini-2.5-flash', 'Gemini 2.5 Flash'], ['gemini-2.5-flash-lite', 'Gemini 2.5 Flash-Lite'], ['gemini-2.5-pro', 'Gemini 2.5 Pro (low quota)']],
  },
  openrouter: {
    label: 'OpenRouter — free models', kind: 'openai', tools: false, cors: 'yes',
    url: 'https://openrouter.ai/api/v1/chat/completions', keyHint: 'sk-or-…', keyUrl: 'https://openrouter.ai/keys',
    models: [['deepseek/deepseek-r1:free', 'DeepSeek R1 (free)'], ['deepseek/deepseek-v3:free', 'DeepSeek V3 (free)'], ['meta-llama/llama-3.3-70b:free', 'Llama 3.3 70B (free)']],
  },
  cerebras: {
    label: 'Cerebras — free 1M tokens/day, very fast', kind: 'openai', tools: false, cors: 'yes',
    url: 'https://api.cerebras.ai/v1/chat/completions', keyHint: 'csk-…', keyUrl: 'https://cloud.cerebras.ai',
    models: [['gpt-oss-120b', 'GPT-OSS 120B'], ['llama-3.3-70b', 'Llama 3.3 70B'], ['qwen-3-32b', 'Qwen3 32B']],
  },
  mistral: {
    label: 'Mistral — free Experiment tier', kind: 'openai', tools: false, cors: 'yes',
    url: 'https://api.mistral.ai/v1/chat/completions', keyHint: '…', keyUrl: 'https://console.mistral.ai/api-keys',
    models: [['mistral-small-latest', 'Mistral Small'], ['mistral-large-latest', 'Mistral Large']],
  },
  custom: {
    label: 'Custom OpenAI-compatible endpoint…', kind: 'openai', tools: false, cors: 'unknown', custom: true,
    url: '', keyHint: 'your key', keyUrl: '',
    models: [['', '(type a model name below)']],
  },
};
const PROV_ORDER = ['anthropic', 'groq', 'gemini', 'openrouter', 'cerebras', 'mistral', 'custom'];

const PROV_STORE = 'wb-llm-provider';
const OPS_STORE = 'wb-operations';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let api = null, currentReading = null;
let history = [], controller = null;
const el = id => document.getElementById(id);

export function initAssistant(_api) {
  api = _api || {};
  currentReading = api.getReading ? api.getReading() : null;
  render();
  if (api.subscribeReading) api.subscribeReading(r => { currentReading = r; refreshPreview(); });
}

// --- storage helpers (best-effort; never throw) -----------------------------
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
const lsDel = k => { try { localStorage.removeItem(k); } catch { /* ignore */ } };
function recentOps() { try { return JSON.parse(lsGet(OPS_STORE) || '[]'); } catch { return []; } }
function saveOp(req) { lsSet(OPS_STORE, JSON.stringify([req, ...recentOps().filter(x => x !== req)].slice(0, 8))); }

const provName = () => { const s = el('wb-asst-provider'); return s && PROVIDERS[s.value] ? s.value : 'anthropic'; };
const provCfg = () => PROVIDERS[provName()];
// Free OpenAI-compatible tiers have small per-minute token caps (e.g. Groq's
// 8000 TPM), so the grounded context must be MUCH smaller than for Claude. These
// budgets keep a typical request under ~6–7k tokens on a free key.
const isFree = () => provCfg().kind === 'openai';
const factBudget = big => isFree() ? (big ? 45 : 28) : (big ? 400 : 110);
const keyStore = () => 'wb-llm-key-' + provName();
const baseStore = () => 'wb-llm-base-' + provName();

function render() {
  const host = el('wb-assistant');
  if (!host) return;
  const savedProv = lsGet(PROV_STORE) || 'anthropic';
  host.innerHTML = `
    <div class="callout science" style="margin-top:0"><span class="label">About this assistant</span>
      It explains the <b>computed, cited</b> reading above using an LLM called directly from your browser with
      <b>your own API key</b> (nothing is proxied; no key is bundled). Use <b>Claude</b> (recommended, supports the
      agentic tools) or a <b>free-tier</b> provider (Groq, Gemini, OpenRouter…). It describes a historical,
      <b>pseudoscientific</b> tradition; it does not advise or predict. Magical material is historical only.
      New here? <a href="../docs/LOCAL-LLM.html">How the assistant works →</a></div>

    <fieldset style="border:1px solid #2a3350;border-radius:.5rem;padding:.7rem .8rem;margin:.6rem 0">
      <legend class="small" style="padding:0 .4rem">Connect an AI (your own key)</legend>
      <div class="field-row" style="align-items:flex-end;flex-wrap:wrap;gap:.6rem">
        <div class="field" style="flex:1 1 240px"><label for="wb-asst-provider">Provider</label>
          <select id="wb-asst-provider">${PROV_ORDER.map(k => `<option value="${k}">${esc(PROVIDERS[k].label)}</option>`).join('')}</select></div>
        <div class="field"><label for="wb-asst-model">Model</label><select id="wb-asst-model"></select></div>
      </div>
      <div class="field-row" id="wb-asst-base-row" style="margin-top:.5rem;display:none"><div class="field" style="flex:1 1 100%">
        <label for="wb-asst-base">Base URL (OpenAI-compatible, ending in <code>/v1</code>)</label>
        <input id="wb-asst-base" type="text" spellcheck="false" placeholder="https://host/v1" style="width:100%"></div></div>
      <div class="field-row" style="align-items:flex-end;flex-wrap:wrap;gap:.6rem;margin-top:.5rem">
        <div class="field" style="flex:1 1 320px"><label for="wb-asst-key">API key</label>
          <input id="wb-asst-key" type="password" autocomplete="off" spellcheck="false" style="width:100%"></div>
        <a id="wb-asst-getkey" class="small" rel="noopener" target="_blank" href="#">get a key ↗</a>
      </div>
      <div class="field-row" style="align-items:center;gap:1rem;margin-top:.5rem">
        <label class="small" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="wb-asst-remember"> remember on this device</label>
        <label class="small" id="wb-asst-tools-wrap" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="wb-asst-tools" checked> let the model run the engine tools (agentic; Claude only)</label>
      </div>
      <p id="wb-asst-status" class="small muted" style="margin:.4rem 0 0">Paste your key and ask — nothing is sent until you do.</p>
    </fieldset>

    <div class="field-row" style="gap:.4rem;margin:.2rem 0 .3rem;flex-wrap:wrap">
      <button type="button" class="btn sm" id="wb-asst-synth">🔎 Interpret &amp; advise — everything, together</button>
      <button type="button" class="btn sm" id="wb-asst-codex">📜 Codex of this Hour — evocative</button>
    </div>
    <p class="small muted" style="margin:.1rem 0 .6rem">First <b>compute a reading above</b>; both buttons then send the
      <b>whole computed reading as JSON</b> so the model interprets the real figures across <b>both systems</b> (Western + Vedic)
      and the Picatrix layer — the plain one synthesises &amp; advises, the Codex is image-rich. Each reply has a <b>⤓ save</b> link.</p>

    <fieldset style="border:1px solid #2a3350;border-radius:.5rem;padding:.7rem .8rem;margin:.2rem 0 .6rem">
      <legend class="small" style="padding:0 .4rem">Plan a working (agentic)</legend>
      <p class="small muted" style="margin:.1rem 0 .4rem">Ask the Workbench to plan a historical working. The model maps your aim to a catalogued
        operation, finds the next favourable window (with the engine tools on Claude, or from the embedded data otherwise), and lays out the procedure.</p>
      <div class="field-row" style="gap:.4rem">
        <textarea id="wb-asst-op" rows="2" placeholder="e.g. when is the next best time to attempt to call rain, and how would the tradition do it?" style="flex:1 1 320px;min-width:240px"></textarea>
        <button type="button" class="btn" id="wb-asst-plan">Plan it</button>
      </div>
      <div id="wb-asst-op-recent" class="small" style="margin-top:.35rem"></div>
    </fieldset>

    <div id="wb-asst-log" class="small" style="max-height:24rem;overflow:auto;border:1px solid #2a3350;border-radius:.4rem;padding:.6rem;background:#0c0f1a"></div>
    <div class="field-row" style="margin-top:.5rem;gap:.4rem">
      <textarea id="wb-asst-input" rows="2" placeholder="Ask about this reading… (e.g. “explain the chart-health verdict”)" style="flex:1 1 320px;min-width:240px"></textarea>
      <button type="button" class="btn" id="wb-asst-send">Send</button>
      <button type="button" class="btn sm" id="wb-asst-stop">Stop</button>
    </div>

    <details style="margin-top:.6rem"><summary class="small">What the model is told (the grounded facts)</summary>
      <div id="wb-asst-preview" class="small muted"></div></details>`;

  el('wb-asst-provider').value = PROVIDERS[savedProv] ? savedProv : 'anthropic';
  onProviderChange();
  el('wb-asst-provider').addEventListener('change', () => { lsSet(PROV_STORE, provName()); onProviderChange(); });
  el('wb-asst-synth').addEventListener('click', () => generateSynthesis());
  el('wb-asst-codex').addEventListener('click', () => generateCodex());
  el('wb-asst-plan').addEventListener('click', () => planOperation());
  el('wb-asst-send').addEventListener('click', () => send());
  el('wb-asst-stop').addEventListener('click', () => { if (controller) controller.abort(); });
  el('wb-asst-input').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
  el('wb-asst-key').addEventListener('change', () => persistKey());
  el('wb-asst-base').addEventListener('change', () => { lsSet(baseStore(), el('wb-asst-base').value.trim()); });
  el('wb-asst-remember').addEventListener('change', () => persistKey());

  renderRecentOps();
  refreshPreview();
}

// Re-skin the connect form for the selected provider.
function onProviderChange() {
  const p = provCfg();
  const modelSel = el('wb-asst-model');
  modelSel.innerHTML = p.models.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('');
  el('wb-asst-key').placeholder = p.keyHint;
  el('wb-asst-key').value = lsGet(keyStore()) || '';
  el('wb-asst-remember').checked = !!lsGet(keyStore());
  el('wb-asst-base-row').style.display = p.custom ? '' : 'none';
  if (p.custom) el('wb-asst-base').value = lsGet(baseStore()) || '';
  const gk = el('wb-asst-getkey'); if (gk) { gk.href = p.keyUrl || '#'; gk.style.display = p.keyUrl ? '' : 'none'; }
  el('wb-asst-tools-wrap').style.display = p.tools ? 'flex' : 'none';
  setStatus(p.cors === 'unknown'
    ? 'Note: this provider’s browser-direct (CORS) support is unverified — if you see a network error, it blocks direct calls; use Claude/Groq/Gemini/OpenRouter, which do allow it.'
    : 'Paste your key and ask — nothing is sent until you do.');
}

function setStatus(t) { const s = el('wb-asst-status'); if (s) s.innerHTML = t; }
function getKey() { const k = el('wb-asst-key') ? el('wb-asst-key').value.trim() : ''; persistKey(); return k; }
function persistKey() {
  const remember = el('wb-asst-remember') && el('wb-asst-remember').checked;
  const k = el('wb-asst-key') ? el('wb-asst-key').value.trim() : '';
  if (remember && k) lsSet(keyStore(), k); else lsDel(keyStore());
}

function renderRecentOps() {
  const box = el('wb-asst-op-recent'); if (!box) return;
  const ops = recentOps();
  box.innerHTML = ops.length ? 'Recent: ' + ops.map(o => `<a href="#" class="gloss-link" data-op="${esc(o)}">${esc(o.length > 48 ? o.slice(0, 46) + '…' : o)}</a>`).join(' · ') : '';
  box.querySelectorAll('a[data-op]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); el('wb-asst-op').value = a.getAttribute('data-op'); }));
}

function refreshPreview() {
  const p = el('wb-asst-preview'); if (!p) return;
  if (!currentReading) { p.textContent = 'Compute a reading above first.'; return; }
  try {
    const { facts } = buildContext(currentReading);
    p.innerHTML = '<ul class="clean">' + facts.map(f => `<li>${esc(f.text)}${f.cite ? ` <span class="muted">[${esc(f.cite)}]</span>` : ''}</li>`).join('') + '</ul>';
  } catch { p.textContent = 'Could not build the context.'; }
}

// --- chat log (labelled bubbles) --------------------------------------------
function appendMsg(role, text) {
  const log = el('wb-asst-log');
  const turn = document.createElement('div');
  turn.className = `wb-chat-turn ${role === 'user' ? 'wb-chat-user' : 'wb-chat-bot'}`;
  const label = document.createElement('div');
  label.className = 'wb-chat-role';
  label.innerHTML = `<span aria-hidden="true">${role === 'user' ? '🜨' : '✶'}</span> ${role === 'user' ? 'You' : provName() === 'anthropic' ? 'Claude' : 'AI'}`;
  const body = document.createElement('div');
  body.className = 'wb-chat-body';
  body.textContent = text;
  turn.appendChild(label); turn.appendChild(body);
  log.appendChild(turn); log.scrollTop = log.scrollHeight;
  return body;
}
function appendToolNote(name, args, result) {
  const log = el('wb-asst-log');
  const div = document.createElement('div');
  div.className = 'wb-chat-note';
  const ok = !(result && result.error);
  div.innerHTML = `↳ ran <code>${esc(name)}</code>(${esc(JSON.stringify(args || {}))}) → ${ok ? 'computed' : 'error: ' + esc(result.error)}`;
  log.appendChild(div); log.scrollTop = log.scrollHeight;
}
const scrollLog = () => { const l = el('wb-asst-log'); if (l) l.scrollTop = l.scrollHeight; };

// --- backends ---------------------------------------------------------------
function anthHeaders(key) {
  return { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
}

// dispatch a streaming chat to the selected provider.
async function streamChat(messages, system, asstEl, maxTokens = 3072) {
  return provCfg().kind === 'anthropic'
    ? claudeStream(messages, system, asstEl, maxTokens)
    : openaiStream(messages, system, asstEl, maxTokens);
}

async function claudeStream(messages, system, asstEl, maxTokens = 3072) {
  const key = getKey(); const model = el('wb-asst-model').value;
  const res = await fetch(provCfg().url, {
    method: 'POST', headers: anthHeaders(key),
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages, stream: true }),
    signal: controller.signal,
  });
  if (!res.ok) throw new Error('Claude HTTP ' + res.status + ' — ' + (await res.text()).slice(0, 240));
  asstEl.textContent = '';
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', full = '';
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim(); if (!payload || payload === '[DONE]') continue;
      let o; try { o = JSON.parse(payload); } catch { continue; }
      if (o.type === 'content_block_delta' && o.delta && o.delta.type === 'text_delta') { full += o.delta.text; asstEl.textContent = full; scrollLog(); }
      else if (o.type === 'message_delta' && o.delta && o.delta.stop_reason === 'refusal' && !full) { full = '(The model declined this request. Some safety classifiers flag historical occult/magical content — try the recommended Opus 4.8 model, or rephrase.)'; asstEl.textContent = full; }
      else if (o.type === 'error') throw new Error((o.error && o.error.message) || 'Claude stream error');
    }
  }
  history.push({ role: 'assistant', content: full });
  return full;
}

// OpenAI /chat/completions streaming (Groq, Gemini, OpenRouter, Cerebras, …).
async function openaiStream(messages, system, asstEl, maxTokens = 3072) {
  const p = provCfg(); const key = getKey(); const model = el('wb-asst-model').value;
  let url = p.url;
  if (p.custom) { const b = (el('wb-asst-base').value || '').trim().replace(/\/+$/, ''); if (!b) throw new Error('Enter the OpenAI-compatible base URL.'); url = b + '/chat/completions'; }
  const oaMessages = [{ role: 'system', content: system },
    ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: typeof m.content === 'string' ? m.content : '' }))];
  const headers = { 'content-type': 'application/json', authorization: 'Bearer ' + key };
  if (provName() === 'openrouter') { headers['HTTP-Referer'] = SITE_URLS && SITE_URLS.home ? SITE_URLS.home : 'https://occult-kranti.github.io/astrology-sim-ant/'; headers['X-Title'] = "The Astrologer's Workbench"; }
  const res = await fetch(url, {
    method: 'POST', headers,
    body: JSON.stringify({ model, messages: oaMessages, stream: true, max_tokens: maxTokens, temperature: 0.8 }),
    signal: controller.signal,
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 240);
    if (res.status === 413) throw new Error('This free model’s per-minute token limit is smaller than the grounded context. Pick a model with a higher limit (e.g. Groq llama-3.3-70b-versatile), wait a minute, or use Claude. (' + body + ')');
    if (res.status === 429) throw new Error('Rate limited by the free tier — wait a minute and retry, or switch model/provider. (' + body + ')');
    if (res.status === 401) throw new Error('The provider rejected the key (401) — check it is correct for this provider. (' + body + ')');
    throw new Error('HTTP ' + res.status + ' — ' + body);
  }
  asstEl.textContent = '';
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', full = '';
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim(); if (!payload || payload === '[DONE]') continue;
      let o; try { o = JSON.parse(payload); } catch { continue; }
      const delta = o.choices && o.choices[0] && o.choices[0].delta;
      const txt = delta && delta.content;
      if (txt) { full += txt; asstEl.textContent = full; scrollLog(); }
      if (o.error) throw new Error((o.error.message) || 'stream error');
    }
  }
  history.push({ role: 'assistant', content: full });
  return full;
}

async function claudeToolLoop(messages, system, asstEl) {
  const key = getKey(); const model = el('wb-asst-model').value; const tools = toAnthropicTools();
  let finalText = '';
  for (let guard = 0; guard < 6; guard++) {
    const res = await fetch(provCfg().url, {
      method: 'POST', headers: anthHeaders(key),
      body: JSON.stringify({ model, max_tokens: 3072, system, messages, tools }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Claude HTTP ' + res.status + ' — ' + (await res.text()).slice(0, 240));
    const data = await res.json();
    if (data.stop_reason === 'refusal') { finalText = '(The model declined this request. Some safety classifiers flag historical occult/magical content — try the recommended Opus 4.8 model, or rephrase.)'; asstEl.textContent = finalText; break; }
    const blocks = data.content || [];
    const toolUses = blocks.filter(b => b.type === 'tool_use');
    const text = blocks.filter(b => b.type === 'text').map(b => b.text).join('');
    if (text) { asstEl.textContent = text; finalText = text; }
    if (data.stop_reason === 'tool_use' && toolUses.length) {
      messages.push({ role: 'assistant', content: blocks });
      const results = [];
      for (const tu of toolUses) {
        let result; try { result = runTool(tu.name, tu.input || {}, api.getContext ? api.getContext() : {}); } catch (e) { result = { error: e.message }; }
        appendToolNote(tu.name, tu.input, result);
        results.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(result) });
      }
      messages.push({ role: 'user', content: results });
      continue;
    }
    break;
  }
  history.push({ role: 'assistant', content: finalText });
  return finalText;
}

// --- the entry points -------------------------------------------------------
function preflight() {
  if (!currentReading) { setStatus('Compute a reading above first.'); return false; }
  if (provCfg().custom && !(el('wb-asst-base').value || '').trim()) { setStatus('Enter the OpenAI-compatible base URL.'); return false; }
  if (!getKey()) { setStatus('Enter your API key first.'); return false; }
  setStatus('');
  return true;
}
const toolsOn = () => provCfg().tools && el('wb-asst-tools') && el('wb-asst-tools').checked;

async function send() {
  const input = el('wb-asst-input');
  const q = input.value.trim(); if (!q || !preflight()) return;
  input.value = '';
  const { system } = buildContext(currentReading, { maxFacts: factBudget(false) });
  const messages = [...history.slice(isFree() ? -4 : -8), { role: 'user', content: q }];
  history.push({ role: 'user', content: q });
  appendMsg('user', q);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try {
    const out = toolsOn() ? await claudeToolLoop(messages, system, asstEl) : await streamChat(messages, system, asstEl);
    addSaveLink(asstEl, out, 'reply');
  } catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

function addSaveLink(bodyEl, text, name) {
  if (!bodyEl || !text) return;
  const turn = bodyEl.closest('.wb-chat-turn') || bodyEl.parentElement; if (!turn) return;
  const a = document.createElement('a');
  a.href = '#'; a.className = 'wb-chat-save'; a.style.display = 'inline-block'; a.style.marginTop = '.4rem';
  a.textContent = '⤓ save this reply';
  a.addEventListener('click', e => { e.preventDefault(); downloadText(text, `workbench-${name || 'reply'}.md`, 'text/markdown;charset=utf-8'); });
  turn.appendChild(a);
}

async function generateSynthesis() {
  if (!preflight()) return;
  const { system } = buildContext(currentReading, { maxFacts: factBudget(true) });
  appendMsg('user', '🔎 Interpret & advise — the whole reading, together (data sent as JSON)');
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await streamChat([{ role: 'user', content: buildSynthesisPrompt(currentReading) + dataBlockFor(currentReading) }], system, asstEl, 6144); addSaveLink(asstEl, out, 'interpretation'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

async function generateCodex() {
  if (!preflight()) return;
  const { system } = buildContext(currentReading, { maxFacts: factBudget(true) });
  appendMsg('user', '📜 Codex of this Hour (deep interpretation, both systems; data sent as JSON)');
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await streamChat([{ role: 'user', content: buildCodexPrompt(currentReading) + dataBlockFor(currentReading) }], system, asstEl, 6144); addSaveLink(asstEl, out, 'codex'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

async function planOperation() {
  const req = el('wb-asst-op').value.trim(); if (!req || !preflight()) return;
  saveOp(req); renderRecentOps();
  const { system } = buildContext(currentReading);
  appendMsg('user', '🜔 ' + req);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  const messages = [{ role: 'user', content: buildOperationPrompt(currentReading, req) + dataBlockFor(currentReading) }];
  try {
    const out = toolsOn() ? await claudeToolLoop(messages, system, asstEl) : await streamChat(messages, system, asstEl);
    addSaveLink(asstEl, out, 'working');
  } catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}
