// ============================================================================
//  autopilot.js — THE GRAND ORCHESTRATOR. One prompt, every engine. The user
//  pastes their own Claude API key, types ANY question (simple → advanced;
//  about a past date or a future one) and Claude AGENTICALLY drives ALL of the
//  site's engines via tools — computing whatever charts it needs, then explaining
//  them codebooked (book meaning → plain terms, honest frame first).
//
//  It reuses the SHARED machinery, never duplicating it:
//    • core/llm-context.js  — toAnthropicTools() (the whole tool surface),
//      runTool() (the pure dispatcher), buildOrchestratorPrompt() (the codebooked
//      meta-prompt) and ORCHESTRATOR_PREAMBLE + HONEST_SYSTEM_PREAMBLE (the frame).
//    • app/llm-core.js      — PROVIDERS.anthropic + the Anthropic transport.
//    • the SHARED key store  — 'wb-llm-key-anthropic', so a key pasted on the
//      Workbench works here too (and vice-versa). BYOK, browser-direct, nothing
//      proxied, no key ever bundled.
//
//  HONEST / SAFETY: no key is bundled; every request uses the user's own key and
//  goes only to Anthropic's endpoint. The system prompt is the locked honest
//  framing; the model DESCRIBES historical, pseudoscientific traditions — it does
//  not advise or predict. VERIFY-GATE: NO network request fires on load; every
//  fetch is on an explicit click and is wrapped so a failure updates the log,
//  never throws.
// ============================================================================
import { toAnthropicTools, runTool, buildOrchestratorPrompt, ORCHESTRATOR_PREAMBLE, HONEST_SYSTEM_PREAMBLE } from '../core/llm-context.js';
import { PROVIDERS } from './llm-core.js';
import { downloadText } from './state.js';

const KEY_STORE = 'wb-llm-key-anthropic';   // the SAME key the Workbench assistant stores
const REMEMBER_STORE = 'wb-ap-remember';
const MODEL_STORE = 'wb-ap-model';
const MAX_ROUNDS = 12;

const el = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
const lsDel = k => { try { localStorage.removeItem(k); } catch { /* ignore */ } };

const PROV = PROVIDERS.anthropic;
let controller = null;

// The example-prompt chips — each fills the box (the four the brief names).
const EXAMPLES = [
  'My birth chart and this year’s varṣaphala, explained simply.',
  'When were the great conjunctions of the 1600s and what did astrologers make of them?',
  'Scan next week for a good moment to start a project — every tradition.',
  'Compare my chart with my partner’s.',
];

export function initAutopilot() {
  render();
}

function render() {
  const host = el('ap-app');
  if (!host) return;
  host.innerHTML = `
    <div class="callout science" style="margin-top:0"><span class="label">Honest note — please read</span>
      This page uses an LLM (Anthropic's <b>Claude</b>) called <b>directly from your browser with your own API key</b> —
      nothing is proxied, no key is bundled. Claude drives the site's <b>~a dozen engines as tools</b> (charts,
      transits, synastry, the Indian &amp; Persian clocks, the great conjunctions, the oracles…), computing the real
      numbers before it explains them. It DESCRIBES historical, <b>pseudoscientific</b> traditions of no demonstrated
      validity — it does not advise or predict. For a <b>future date</b> the tools give what the sky will really do and
      what the tradition <em>would</em> say — never a real prediction; for a <b>past date</b>, what the tradition
      <em>would have</em> said.</div>

    <fieldset style="border:1px solid #2a3350;border-radius:.5rem;padding:.7rem .8rem;margin:.6rem 0">
      <legend class="small" style="padding:0 .4rem">Connect Claude (your own key)</legend>
      <div class="field-row" style="align-items:flex-end;flex-wrap:wrap;gap:.6rem">
        <div class="field" style="flex:1 1 320px"><label for="ap-key">Claude API key</label>
          <input id="ap-key" type="password" autocomplete="off" spellcheck="false" placeholder="${esc(PROV.keyHint)}" style="width:100%"></div>
        <div class="field"><label for="ap-model">Model</label>
          <select id="ap-model">${PROV.models.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>
        <a id="ap-getkey" class="small" rel="noopener" target="_blank" href="${esc(PROV.keyUrl || '#')}">get a key ↗</a>
      </div>
      <div class="field-row" style="align-items:center;gap:1rem;margin-top:.5rem">
        <label class="small" style="display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="ap-remember"> remember on this device</label>
        <span class="small muted">Claude only — the agentic tools need it. A key saved on the
          <a href="workbench.html">Master Tool</a> works here too (same store). Groq's free tier
          <b>can't drive tools</b>; for the non-agentic flows use the <a href="workbench.html">Workbench assistant</a>.</span>
      </div>
      <p id="ap-status" class="small muted" style="margin:.4rem 0 0">Paste your key, type a question — nothing is sent until you press Ask.</p>
    </fieldset>

    <div class="field-row" style="gap:.4rem;margin:.2rem 0 .3rem;flex-wrap:wrap">
      <span class="small muted" style="align-self:center">Try:</span>
      ${EXAMPLES.map((q, i) => `<button type="button" class="btn sm ap-ex" data-i="${i}">${esc(q.replace(/\.$/, ''))}</button>`).join('')}
    </div>

    <div id="ap-log" class="chat small" style="max-height:30rem;overflow:auto;padding:.7rem">
      <p class="chat-note" style="margin:.2rem">Ask anything — simple or advanced, about a past date or a future one. Claude will
        plan which engines to run, compute the real figures, then explain them plainly (book meaning → plain words), honest
        frame first, each tradition kept separate.</p></div>

    <div class="field-row" style="margin-top:.5rem;gap:.4rem">
      <textarea id="ap-input" rows="3" placeholder="e.g. “I was born 1990-05-15 08:30 in London — read my chart and this year ahead, simply.”" style="flex:1 1 320px;min-width:240px"></textarea>
      <button type="button" class="btn" id="ap-send">Ask</button>
      <button type="button" class="btn sm" id="ap-stop">Stop</button>
    </div>
    <p class="small muted" style="margin:.4rem 0 0">Each engine Claude runs is shown as a collapsible
      <code>⚙ toolName(args)</code> line, so you can audit every number. The reply has a <b>⤓ save</b> link.</p>`;

  // restore the saved key / model
  const savedKey = lsGet(KEY_STORE);
  if (savedKey) { el('ap-key').value = savedKey; el('ap-remember').checked = true; }
  else el('ap-remember').checked = lsGet(REMEMBER_STORE) === '1';
  const savedModel = lsGet(MODEL_STORE);
  if (savedModel && PROV.models.some(m => m[0] === savedModel)) el('ap-model').value = savedModel;

  el('ap-send').addEventListener('click', () => ask());
  el('ap-stop').addEventListener('click', () => { if (controller) controller.abort(); });
  el('ap-input').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); ask(); } });
  el('ap-key').addEventListener('change', persistKey);
  el('ap-remember').addEventListener('change', persistKey);
  el('ap-model').addEventListener('change', () => lsSet(MODEL_STORE, el('ap-model').value));
  host.querySelectorAll('.ap-ex').forEach(b => b.addEventListener('click', () => {
    el('ap-input').value = EXAMPLES[+b.getAttribute('data-i')];
    el('ap-input').focus();
  }));
}

function persistKey() {
  const remember = el('ap-remember') && el('ap-remember').checked;
  const k = el('ap-key') ? el('ap-key').value.trim() : '';
  lsSet(REMEMBER_STORE, remember ? '1' : '0');
  if (remember && k) lsSet(KEY_STORE, k); else lsDel(KEY_STORE);
}
function getKey() { const k = el('ap-key') ? el('ap-key').value.trim() : ''; persistKey(); return k; }
function setStatus(t) { const s = el('ap-status'); if (s) s.innerHTML = t; }

// crypto randomness for the oracle tools (castRunes/castGeomancy/drawTarot/…):
// the APP throws the dice, never the model and never the pure core.
function appRand(n) {
  try { const a = new Uint32Array(1); (self.crypto || window.crypto).getRandomValues(a); return a[0] % n; }
  catch { return Math.floor(Math.random() * n); }
}

// --- the chat log -----------------------------------------------------------
function appendMsg(role, text) {
  const log = el('ap-log');
  const turn = document.createElement('div');
  turn.className = `chat-turn ${role === 'user' ? 'chat-user' : 'chat-bot'}`;
  const label = document.createElement('div');
  label.className = 'chat-role';
  label.innerHTML = `<span aria-hidden="true">${role === 'user' ? '🜨' : '🜍'}</span> ${role === 'user' ? 'You' : 'The Orchestrator (Claude)'}`;
  const body = document.createElement('div');
  body.className = 'chat-body';
  body.textContent = text;
  turn.appendChild(label); turn.appendChild(body);
  log.appendChild(turn); log.scrollTop = log.scrollHeight;
  return body;
}
// A collapsible '⚙ toolName(args)' line rendered for every tool call.
function appendToolNote(name, args, result) {
  const log = el('ap-log');
  const d = document.createElement('details');
  d.className = 'chat-note';
  d.style.margin = '.25rem 0';
  const ok = !(result && result.error);
  const argStr = (() => { try { return JSON.stringify(args || {}); } catch { return '{…}'; } })();
  const shortArgs = argStr.length > 90 ? argStr.slice(0, 88) + '…' : argStr;
  let resStr = ''; try { resStr = JSON.stringify(result, null, 2); } catch { resStr = String(result); }
  d.innerHTML = `<summary style="cursor:pointer">⚙ <code>${esc(name)}</code>(${esc(shortArgs)}) ${ok ? '→ computed' : '→ <b style="color:var(--malefic)">error</b>'}</summary>`
    + `<pre class="small" style="white-space:pre-wrap;overflow:auto;max-height:16rem;margin:.3rem 0 0">${esc(resStr)}</pre>`;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
}
const scrollLog = () => { const l = el('ap-log'); if (l) l.scrollTop = l.scrollHeight; };

function addSaveLink(bodyEl, text) {
  if (!bodyEl || !text) return;
  const turn = bodyEl.closest('.chat-turn') || bodyEl.parentElement; if (!turn) return;
  const a = document.createElement('a');
  a.href = '#'; a.className = 'chat-save'; a.style.display = 'inline-block'; a.style.marginTop = '.4rem';
  a.textContent = '⤓ save this reply';
  a.addEventListener('click', e => { e.preventDefault(); downloadText(text, 'orchestrator-reply.md', 'text/markdown;charset=utf-8'); });
  turn.appendChild(a);
}

// --- the Anthropic transport + the agentic tool loop (Claude only) ----------
// A self-contained loop (up to MAX_ROUNDS): the model calls the engine tools,
// we run them (runTool, with crypto randomness injected), feed the results back,
// and render the final answer. Modelled on assistant.js's claudeToolLoop, but
// local so it owns the round budget and the ⚙ tool-note rendering.
function anthHeaders(key) {
  return { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
}

async function orchestrate(system, messages, asstEl) {
  const model = el('ap-model').value;
  const tools = toAnthropicTools();
  const key = getKey();
  let finalText = '';
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const res = await fetch(PROV.url, {
      method: 'POST', headers: anthHeaders(key),
      body: JSON.stringify({ model, max_tokens: 4096, system, messages, tools }), signal: controller.signal,
    });
    if (!res.ok) throw new Error('Claude HTTP ' + res.status + ' — ' + (await res.text()).slice(0, 240));
    const data = await res.json();
    if (data.stop_reason === 'refusal') {
      finalText = '(The model declined this request. Some safety classifiers flag historical occult/magical content — try the recommended Opus model, or rephrase.)';
      asstEl.textContent = finalText; break;
    }
    const blocks = data.content || [];
    const toolUses = blocks.filter(b => b.type === 'tool_use');
    const text = blocks.filter(b => b.type === 'text').map(b => b.text).join('');
    if (text) { finalText = text; asstEl.textContent = text; scrollLog(); }
    if (data.stop_reason === 'tool_use' && toolUses.length) {
      messages.push({ role: 'assistant', content: blocks });
      const results = [];
      for (const tu of toolUses) {
        let result;
        try { result = runTool(tu.name, tu.input || {}, { rand: appRand }); }
        catch (e) { result = { error: e.message }; }
        appendToolNote(tu.name, tu.input, result);
        results.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(result) });
      }
      messages.push({ role: 'user', content: results });
      if (!finalText) asstEl.textContent = '…computing…';
      continue;
    }
    break;   // no more tools requested — finalText holds the answer
  }
  if (!finalText) finalText = '(No answer was produced — try rephrasing, or check your key and model.)';
  asstEl.textContent = finalText;
  return finalText;
}

async function ask() {
  const input = el('ap-input');
  const q = input.value.trim();
  if (!q) { setStatus('Type a question first.'); return; }
  if (!getKey()) { setStatus('Paste your Claude API key first.'); return; }
  setStatus('');
  input.value = '';
  lsSet(MODEL_STORE, el('ap-model').value);

  appendMsg('user', q);
  const asstEl = appendMsg('assistant', '…');
  controller = new AbortController();

  // The locked honest frame + the whole-Workbench persona; the codebooked task
  // is the user turn. The tools are supplied to the model by orchestrate().
  const system = HONEST_SYSTEM_PREAMBLE + ORCHESTRATOR_PREAMBLE;
  const messages = [{ role: 'user', content: buildOrchestratorPrompt(q) }];
  try {
    const out = await orchestrate(system, messages, asstEl);
    addSaveLink(asstEl, out);
  } catch (e) {
    asstEl.textContent = (e && e.name === 'AbortError') ? '(stopped)' : 'Error: ' + (e && e.message ? e.message : 'request failed');
  }
}
