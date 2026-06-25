// ============================================================================
//  assistant.js — the "Ask the Workbench" panel. It narrates the COMPUTED,
//  CITED reading (from core/llm-context.js) using Claude via the Anthropic API,
//  called DIRECTLY from the browser with the user's own key. Three uses:
//    • free chat about the reading (Explain, or agentic Tools mode);
//    • "Generate the Codex of this Hour" — a Hermes/Picatrix codebook narration
//      of every computation, its meaning, and its best historical use;
//    • "Plan a working" — an agentic box (the "conjure rain" pattern) that maps a
//      free-form aim to a catalogued operation, finds the next favourable window
//      with the engine tools, and lays out the historical procedure.
//
//  The local backends (Ollama / in-browser WebLLM) are present in the code but
//  DISABLED in the UI for now — only the Claude API option is exposed.
//
//  GUARDRAILS: the system prompt is the locked, canonical honest-framing
//  preamble; the facts are engine-computed & cited; tool calls run the real
//  engine; a visible disclaimer sits in the panel. The model describes a
//  historical, pseudoscientific tradition — it does not advise or predict.
//
//  VERIFY-GATE CONTRACT: NO network request fires on load. Every fetch happens
//  only on an explicit click and is wrapped so a failure updates the panel text
//  rather than throwing a console error (there is no API key in CI).
// ============================================================================
import { buildContext, runTool, toAnthropicTools, buildCodexPrompt, buildSynthesisPrompt, buildOperationPrompt, dataBlockFor, SITE_URLS } from '../core/llm-context.js';
import { downloadText } from './state.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const KEY_STORE = 'wb-claude-key';
const OPS_STORE = 'wb-operations';
const MODELS = [
  ['claude-opus-4-8', 'Claude Opus 4.8 — most capable (default)'],
  ['claude-sonnet-4-6', 'Claude Sonnet 4.6 — balanced'],
  ['claude-haiku-4-5', 'Claude Haiku 4.5 — fast & cheap'],
  ['claude-fable-5', 'Claude Fable 5 — most powerful'],
];
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
function saveOp(req) {
  const list = [req, ...recentOps().filter(x => x !== req)].slice(0, 8);
  lsSet(OPS_STORE, JSON.stringify(list));
}

function render() {
  const host = el('wb-assistant');
  if (!host) return;
  const savedKey = lsGet(KEY_STORE) || '';
  host.innerHTML = `
    <div class="callout science" style="margin-top:0"><span class="label">About this assistant</span>
      It explains the <b>computed, cited</b> reading above using <b>Claude</b> (the Anthropic API), called
      directly from your browser with <b>your own API key</b>. It describes a historical, <b>pseudoscientific</b>
      tradition; it does not advise or predict. Magical material is historical only. The key is sent only to
      <code>api.anthropic.com</code>. New here? <a href="../docs/LOCAL-LLM.html">How the assistant works →</a></div>

    <fieldset style="border:1px solid #2a3350;border-radius:.5rem;padding:.7rem .8rem;margin:.6rem 0">
      <legend class="small" style="padding:0 .4rem">Connect Claude</legend>
      <div class="field-row" style="align-items:flex-end;flex-wrap:wrap;gap:.6rem">
        <div class="field" style="flex:1 1 320px"><label for="wb-asst-key">Anthropic API key</label>
          <input id="wb-asst-key" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" value="${esc(savedKey)}" style="width:100%"></div>
        <div class="field"><label for="wb-asst-model">Model</label>
          <select id="wb-asst-model">${MODELS.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>
      </div>
      <div class="field-row" style="align-items:center;gap:1rem;margin-top:.5rem">
        <label class="small" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="wb-asst-remember" ${savedKey ? 'checked' : ''}> remember on this device</label>
        <label class="small" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="wb-asst-tools" checked> let Claude run the engine tools (agentic)</label>
        <a href="https://platform.claude.com" class="small" rel="noopener" target="_blank">get a key ↗</a>
      </div>
      <p id="wb-asst-status" class="small muted" style="margin:.4rem 0 0">Paste your key and ask — nothing is sent until you do.</p>
    </fieldset>

    <div class="field-row" style="gap:.4rem;margin:.2rem 0 .3rem;flex-wrap:wrap">
      <button type="button" class="btn sm" id="wb-asst-synth">🔎 Interpret &amp; advise — everything, together</button>
      <button type="button" class="btn sm" id="wb-asst-codex">📜 Codex of this Hour — evocative</button>
    </div>
    <p class="small muted" style="margin:.1rem 0 .6rem">First <b>compute a reading above</b>; both buttons then send the
      <b>whole computed reading as JSON</b> so Claude interprets the real figures across <b>both systems</b> (Western + Vedic)
      and the Picatrix layer — the plain one synthesises &amp; advises, the Codex is image-rich. Each reply has a <b>⤓ save</b> link.</p>

    <fieldset style="border:1px solid #2a3350;border-radius:.5rem;padding:.7rem .8rem;margin:.2rem 0 .6rem">
      <legend class="small" style="padding:0 .4rem">Plan a working (agentic)</legend>
      <p class="small muted" style="margin:.1rem 0 .4rem">Ask the Workbench to plan a historical working. Claude maps your aim to a catalogued
        operation, <b>uses the engine tools</b> to find the next favourable window, says what to check in the report, and lays out the procedure.</p>
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

    <details style="margin-top:.6rem"><summary class="small">What Claude is told (the grounded facts)</summary>
      <div id="wb-asst-preview" class="small muted"></div></details>`;

  el('wb-asst-model').value = MODELS[0][0];
  el('wb-asst-synth').addEventListener('click', () => generateSynthesis());
  el('wb-asst-codex').addEventListener('click', () => generateCodex());
  el('wb-asst-plan').addEventListener('click', () => planOperation());
  el('wb-asst-send').addEventListener('click', () => send());
  el('wb-asst-stop').addEventListener('click', () => { if (controller) controller.abort(); });
  el('wb-asst-input').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
  el('wb-asst-key').addEventListener('change', () => persistKey());
  el('wb-asst-remember').addEventListener('change', () => persistKey());

  renderRecentOps();
  refreshPreview();
}

function setStatus(t) { const s = el('wb-asst-status'); if (s) s.innerHTML = t; }

function getKey() { const k = el('wb-asst-key') ? el('wb-asst-key').value.trim() : ''; persistKey(); return k; }
function persistKey() {
  const remember = el('wb-asst-remember') && el('wb-asst-remember').checked;
  const k = el('wb-asst-key') ? el('wb-asst-key').value.trim() : '';
  if (remember && k) lsSet(KEY_STORE, k); else lsDel(KEY_STORE);
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

// --- chat log ---------------------------------------------------------------
function appendMsg(role, text) {
  const log = el('wb-asst-log');
  const div = document.createElement('div');
  div.style.margin = '.35rem 0';
  div.innerHTML = `<b class="${role === 'user' ? 'pos' : 'muted'}">${role === 'user' ? 'You' : 'Claude'}:</b> <span></span>`;
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

// --- Claude (Anthropic API), called direct from the browser -----------------
function anthHeaders(key) {
  return {
    'content-type': 'application/json',
    'x-api-key': key,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  };
}

async function claudeStream(messages, system, asstEl, maxTokens = 3072) {
  const key = getKey(); const model = el('wb-asst-model').value;
  const res = await fetch(ANTHROPIC_URL, {
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
      else if (o.type === 'error') throw new Error((o.error && o.error.message) || 'Claude stream error');
    }
  }
  history.push({ role: 'assistant', content: full });
  return full;
}

async function claudeToolLoop(messages, system, asstEl) {
  const key = getKey(); const model = el('wb-asst-model').value; const tools = toAnthropicTools();
  let finalText = '';
  for (let guard = 0; guard < 6; guard++) {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST', headers: anthHeaders(key),
      body: JSON.stringify({ model, max_tokens: 3072, system, messages, tools }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Claude HTTP ' + res.status + ' — ' + (await res.text()).slice(0, 240));
    const data = await res.json();
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

// --- the three entry points -------------------------------------------------
function preflight() {
  if (!currentReading) { setStatus('Compute a reading above first.'); return false; }
  if (!getKey()) { setStatus('Enter your Anthropic API key first.'); return false; }
  setStatus('');
  return true;
}

async function send() {
  const input = el('wb-asst-input');
  const q = input.value.trim(); if (!q || !preflight()) return;
  input.value = '';
  const { system } = buildContext(currentReading);
  const messages = [...history.slice(-8), { role: 'user', content: q }];
  history.push({ role: 'user', content: q });
  appendMsg('user', q);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try {
    const out = el('wb-asst-tools').checked ? await claudeToolLoop(messages, system, asstEl) : await claudeStream(messages, system, asstEl);
    addSaveLink(asstEl, out, 'reply');
  } catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

// Append a "⤓ save" link to a finished assistant reply (raw text → .md download).
function addSaveLink(spanEl, text, name) {
  if (!spanEl || !text) return;
  const div = spanEl.closest('div'); if (!div) return;
  const a = document.createElement('a');
  a.href = '#'; a.className = 'small'; a.style.marginLeft = '.6rem'; a.textContent = '⤓ save';
  a.addEventListener('click', e => { e.preventDefault(); downloadText(text, `workbench-${name || 'reply'}.md`, 'text/markdown;charset=utf-8'); });
  div.appendChild(a);
}

async function generateSynthesis() {
  if (!preflight()) return;
  // Data-first: the reading is already computed; send the WHOLE reading as JSON so
  // Claude interprets the real figures and synthesises across both systems.
  const { system } = buildContext(currentReading, { maxFacts: 400 });
  appendMsg('user', '🔎 Interpret & advise — the whole reading, together (data sent as JSON)');
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await claudeStream([{ role: 'user', content: buildSynthesisPrompt(currentReading) + dataBlockFor(currentReading) }], system, asstEl, 6144); addSaveLink(asstEl, out, 'interpretation'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

async function generateCodex() {
  if (!preflight()) return;
  // Embed the WHOLE computed reading (both systems + the daily/birth practice) as
  // JSON in the prompt — the "upload the values with the prompt" path — so the
  // model interprets the real figures rather than browsing or inventing.
  const { system } = buildContext(currentReading, { maxFacts: 400 });
  appendMsg('user', '📜 Codex of this Hour (deep interpretation, both systems; data sent as JSON)');
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await claudeStream([{ role: 'user', content: buildCodexPrompt(currentReading) + dataBlockFor(currentReading) }], system, asstEl, 6144); addSaveLink(asstEl, out, 'codex'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}

async function planOperation() {
  const req = el('wb-asst-op').value.trim(); if (!req || !preflight()) return;
  saveOp(req); renderRecentOps();
  const { system } = buildContext(currentReading);
  appendMsg('user', '🜔 ' + req);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();
  try { const out = await claudeToolLoop([{ role: 'user', content: buildOperationPrompt(currentReading, req) + dataBlockFor(currentReading) }], system, asstEl); addSaveLink(asstEl, out, 'working'); }
  catch (e) { asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed'); }
}
