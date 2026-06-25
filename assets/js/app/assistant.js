// ============================================================================
//  assistant.js — the "Ask a local model" panel for the Workbench. It narrates
//  the COMPUTED, CITED reading (from core/llm-context.js) using a LOCAL language
//  model — nothing leaves the machine. Two backends:
//    • Ollama  — POST http://localhost:11434 (you run `ollama serve`),
//    • WebLLM  — an in-browser model (WebGPU), loaded lazily on request.
//  Two modes: Explain (RAG — the model narrates the facts) and Tools (agentic —
//  the model may call engine functions via runTool to compute fresh numbers).
//
//  GUARDRAILS (defense in depth): the system prompt is the locked, canonical
//  honest-framing preamble (HONEST_SYSTEM_PREAMBLE); the facts are engine-
//  computed and cited; tool calls return real engine output; a visible
//  disclaimer sits in the panel. The model describes a historical, pseudo-
//  scientific tradition — it does not advise or predict.
//
//  VERIFY-GATE CONTRACT: this file makes NO network request on load. Detection
//  and chat happen ONLY on an explicit click, and every fetch is wrapped so a
//  connection refusal/CORS block updates the panel text instead of throwing a
//  console error. That is what keeps the real-browser sweep green (there is no
//  local model in CI).
// ============================================================================
import { buildContext, buildToolSchema, runTool } from '../core/llm-context.js';

const OLLAMA = 'http://localhost:11434';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let api = null, currentReading = null;
let backend = 'ollama', connected = false;
let history = [];                 // chat turns, system excluded; bounded
let controller = null, webllmEngine = null;
const el = id => document.getElementById(id);

export function initAssistant(_api) {
  api = _api || {};
  currentReading = api.getReading ? api.getReading() : null;
  render();
  if (api.subscribeReading) api.subscribeReading(r => { currentReading = r; refreshPreview(); });
}

function render() {
  const host = el('wb-assistant');
  if (!host) return;
  host.innerHTML = `
    <div class="callout science" style="margin-top:0"><span class="label">About this assistant</span>
      It explains the <b>computed, cited</b> reading above using a language model running <b>on your machine</b>
      (Ollama or an in-browser model) — nothing leaves this page. It describes a historical, <b>pseudoscientific</b>
      tradition; it does not advise or predict. Magical material is historical only. New to this?
      <a href="../docs/LOCAL-LLM.html">How to connect a local model →</a></div>

    <div class="field-row" style="margin:.6rem 0;align-items:flex-end;flex-wrap:wrap;gap:.5rem">
      <div class="field"><label for="wb-asst-backend">Backend</label>
        <select id="wb-asst-backend"><option value="ollama">Ollama (local server)</option><option value="webllm">WebLLM (in-browser, WebGPU)</option></select></div>
      <div class="field"><label for="wb-asst-model">Model</label>
        <input id="wb-asst-model" list="wb-asst-models" placeholder="llama3.1" style="width:14rem"><datalist id="wb-asst-models"></datalist></div>
      <button type="button" class="btn sm" id="wb-asst-connect">Detect / connect</button>
      <label class="small" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="wb-asst-tools"> let the model run engine tools (agentic)</label>
    </div>
    <p id="wb-asst-status" class="small muted">Not connected. Click <b>Detect / connect</b> to find a local model — or just read the cited facts below.</p>

    <div id="wb-asst-suggest" class="small" style="margin:.3rem 0"></div>
    <div id="wb-asst-log" class="small" style="max-height:22rem;overflow:auto;border:1px solid #2a3350;border-radius:.4rem;padding:.6rem;background:#0c0f1a"></div>
    <div class="field-row" style="margin-top:.5rem;gap:.4rem">
      <textarea id="wb-asst-input" rows="2" placeholder="Ask about this reading… (e.g. “explain the chart-health verdict”)" style="flex:1 1 320px;min-width:240px"></textarea>
      <button type="button" class="btn" id="wb-asst-send" disabled>Send</button>
      <button type="button" class="btn sm" id="wb-asst-stop">Stop</button>
    </div>

    <details style="margin-top:.6rem"><summary class="small">What the model is told (the grounded facts)</summary>
      <div id="wb-asst-preview" class="small muted"></div></details>`;

  el('wb-asst-backend').addEventListener('change', e => { backend = e.target.value; setStatus(backend === 'webllm'
    ? 'WebLLM: click Detect / connect to load an in-browser model (needs WebGPU; first load downloads hundreds of MB).'
    : 'Ollama: click Detect / connect to list your local models.'); });
  el('wb-asst-connect').addEventListener('click', () => { backend === 'webllm' ? enableWebLLM() : detectOllama(); });
  el('wb-asst-send').addEventListener('click', send);
  el('wb-asst-stop').addEventListener('click', () => { if (controller) controller.abort(); });
  el('wb-asst-input').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });

  renderSuggestions();
  refreshPreview();
}

function setStatus(t) { const s = el('wb-asst-status'); if (s) s.innerHTML = t; }

function renderSuggestions() {
  const s = el('wb-asst-suggest'); if (!s) return;
  const qs = ['Explain this chart in plain English.', 'What does the chart-health verdict mean here, and why?',
    'Why is the selected election green/amber/red right now?', 'Which planet is strongest and weakest, and why?'];
  if (currentReading && currentReading.natal) qs.push('What is my Lord of the Year, and what did Lilly say it governs?');
  s.innerHTML = 'Try: ' + qs.map(q => `<a href="#" class="gloss-link" data-q="${esc(q)}">${esc(q)}</a>`).join(' · ');
  s.querySelectorAll('a[data-q]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); el('wb-asst-input').value = a.getAttribute('data-q'); send();
  }));
}

function refreshPreview() {
  const p = el('wb-asst-preview'); if (!p) return;
  if (!currentReading) { p.textContent = 'Compute a reading above first.'; return; }
  try {
    const { facts } = buildContext(currentReading);
    p.innerHTML = '<ul class="clean">' + facts.map(f => `<li>${esc(f.text)}${f.cite ? ` <span class="muted">[${esc(f.cite)}]</span>` : ''}</li>`).join('') + '</ul>';
  } catch { p.textContent = 'Could not build the context.'; }
  renderSuggestions();
}

// --- chat log ---------------------------------------------------------------
function appendMsg(role, text) {
  const log = el('wb-asst-log');
  const div = document.createElement('div');
  div.style.margin = '.35rem 0';
  div.innerHTML = `<b class="${role === 'user' ? 'pos' : 'muted'}">${role === 'user' ? 'You' : 'Model'}:</b> <span></span>`;
  div.querySelector('span').textContent = text;
  log.appendChild(div); log.scrollTop = log.scrollHeight;
  return div.querySelector('span');
}
function appendToolNote(name, args, result) {
  const log = el('wb-asst-log');
  const div = document.createElement('div');
  div.className = 'small muted'; div.style.margin = '.2rem 0 .2rem 1rem';
  const ok = !(result && result.error);
  div.innerHTML = `↳ tool <code>${esc(name)}</code>(${esc(JSON.stringify(args || {}))}) → ${ok ? 'computed' : 'error: ' + esc(result.error)}`;
  log.appendChild(div); log.scrollTop = log.scrollHeight;
}
const scrollLog = () => { const l = el('wb-asst-log'); if (l) l.scrollTop = l.scrollHeight; };

// --- backends: detect / connect ---------------------------------------------
async function detectOllama() {
  setStatus('Looking for Ollama at localhost:11434…');
  try {
    const res = await fetch(OLLAMA + '/api/tags', { method: 'GET' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const names = (data.models || []).map(m => m.name);
    el('wb-asst-models').innerHTML = names.map(n => `<option value="${esc(n)}"></option>`).join('');
    if (names.length && !el('wb-asst-model').value) el('wb-asst-model').value = names[0];
    connected = true; el('wb-asst-send').disabled = false;
    setStatus(names.length
      ? `Connected to Ollama — ${names.length} model(s) available. Pick one and ask.`
      : 'Ollama is running but has no models. Pull one, e.g. <code>ollama pull llama3.1</code>.');
  } catch (e) {
    connected = false; el('wb-asst-send').disabled = false; // allow a manual model name + try
    setStatus(`Could not reach Ollama (${esc(e.message)}). Start it with <code>ollama serve</code>, and allow this page with
      <code>OLLAMA_ORIGINS=*</code> (set it, then restart the server). You can still type a model name and press Send to try.`);
  }
}

async function enableWebLLM() {
  if (!('gpu' in navigator)) { setStatus('WebGPU is not available in this browser — WebLLM needs it. Use Ollama instead.'); return; }
  setStatus('Loading the in-browser model engine (first time downloads hundreds of MB)…');
  try {
    const webllm = await import('https://esm.run/@mlc-ai/web-llm');
    const modelId = el('wb-asst-model').value.trim() || 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
    webllmEngine = await webllm.CreateMLCEngine(modelId, { initProgressCallback: p => setStatus('Loading: ' + esc((p && p.text) || '…')) });
    backend = 'webllm'; connected = true; el('wb-asst-send').disabled = false;
    setStatus('In-browser model ready: <code>' + esc(modelId) + '</code>.');
  } catch (e) { setStatus('WebLLM failed to load: ' + esc(e.message) + '. Use Ollama, or check WebGPU support.'); }
}

// --- send -------------------------------------------------------------------
async function send() {
  const input = el('wb-asst-input');
  const q = input.value.trim(); if (!q) return;
  if (!currentReading) { setStatus('Compute a reading above first.'); return; }
  input.value = '';
  appendMsg('user', q);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try {
    const { system } = buildContext(currentReading);
    const messages = [{ role: 'system', content: system }, ...history.slice(-8), { role: 'user', content: q }];
    if (backend === 'webllm') await webllmAsk(messages, asstEl);
    else if (el('wb-asst-tools').checked) await ollamaToolLoop(messages, asstEl);
    else await ollamaStream(messages, asstEl);
    history.push({ role: 'user', content: q });
  } catch (e) {
    asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed');
  }
}

async function ollamaStream(messages, asstEl) {
  const model = el('wb-asst-model').value.trim() || 'llama3.1';
  const res = await fetch(OLLAMA + '/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }), signal: controller.signal,
  });
  if (!res.ok) throw new Error('Ollama HTTP ' + res.status);
  asstEl.textContent = '';
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', full = '';
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
      if (!line) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      if (o.message && o.message.content) { full += o.message.content; asstEl.textContent = full; scrollLog(); }
    }
  }
  history.push({ role: 'assistant', content: full });
}

async function ollamaToolLoop(messages, asstEl) {
  const model = el('wb-asst-model').value.trim() || 'llama3.1';
  const tools = buildToolSchema();
  let finalText = '';
  for (let guard = 0; guard < 5; guard++) {
    const res = await fetch(OLLAMA + '/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, tools, stream: false }), signal: controller.signal,
    });
    if (!res.ok) throw new Error('Ollama HTTP ' + res.status);
    const data = await res.json(); const msg = data.message || {};
    if (msg.tool_calls && msg.tool_calls.length) {
      messages.push(msg);
      for (const tc of msg.tool_calls) {
        const fname = tc.function && tc.function.name;
        let fargs = tc.function && tc.function.arguments;
        if (typeof fargs === 'string') { try { fargs = JSON.parse(fargs); } catch { fargs = {}; } }
        let result; try { result = runTool(fname, fargs || {}, api.getContext ? api.getContext() : {}); } catch (e) { result = { error: e.message }; }
        appendToolNote(fname, fargs, result);
        messages.push({ role: 'tool', content: JSON.stringify(result) });
      }
      continue;
    }
    finalText = msg.content || ''; asstEl.textContent = finalText; break;
  }
  history.push({ role: 'assistant', content: finalText });
}

async function webllmAsk(messages, asstEl) {
  if (!webllmEngine) { setStatus('Load the in-browser model first (Detect / connect).'); throw new Error('WebLLM not loaded'); }
  asstEl.textContent = '';
  const chunks = await webllmEngine.chat.completions.create({ messages, stream: true });
  let full = '';
  for await (const c of chunks) {
    const d = (c.choices && c.choices[0] && c.choices[0].delta && c.choices[0].delta.content) || '';
    full += d; asstEl.textContent = full; scrollLog();
  }
  history.push({ role: 'assistant', content: full });
}
