// ============================================================================
//  llm-core.js — the SHARED browser-direct LLM transport for every assistant on
//  the site (the Workbench assistant and the divination assistant). It holds the
//  provider table and the two streaming backends (Anthropic Messages + the
//  OpenAI-compatible /chat/completions used by Groq, Gemini, OpenRouter,
//  Cerebras, Mistral and any custom endpoint), plus the agentic Claude tool-loop.
//
//  PURE TRANSPORT: no DOM, no module-global state. Every call takes its key,
//  model, messages and an AbortSignal, and reports streamed text through an
//  `onDelta` callback — so the caller owns the UI, the chat history and the key
//  storage. This is the live-tested code path (verified against the real Groq
//  free tier): browser-direct, BYOK, nothing proxied, no key ever bundled.
// ============================================================================

// `kind`: 'anthropic' (native Messages API) or 'openai' (/chat/completions).
// `cors`: whether the provider is known to allow browser-direct calls.
export const PROVIDERS = {
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
export const PROV_ORDER = ['anthropic', 'groq', 'gemini', 'openrouter', 'cerebras', 'mistral', 'custom'];

// Free OpenAI-compatible tiers have small per-minute token caps (e.g. Groq's
// 8000 TPM), so the grounded context must be much smaller than for Claude.
export const isFreeKind = kind => kind === 'openai';
export const factBudget = (kind, big) => isFreeKind(kind) ? (big ? 45 : 28) : (big ? 400 : 110);

function anthHeaders(key) {
  return { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
}

// ---------------------------------------------------------------------------
//  streamChat(opts) — stream a chat completion from the selected provider.
//  opts: { provider, url?, baseUrl?, model, key, system, messages, maxTokens?,
//          signal, onDelta(fullText), extraHeaders? }
//  Returns the full text. Throws framed errors (413/429/401 explained).
// ---------------------------------------------------------------------------
export async function streamChat(opts) {
  return (opts.provider && opts.provider.kind === 'anthropic')
    ? claudeStream(opts) : openaiStream(opts);
}

async function claudeStream({ provider, url, model, key, system, messages, maxTokens = 3072, signal, onDelta }) {
  const res = await fetch(url || provider.url, {
    method: 'POST', headers: anthHeaders(key),
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages, stream: true }), signal,
  });
  if (!res.ok) throw new Error('Claude HTTP ' + res.status + ' — ' + (await res.text()).slice(0, 240));
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
      if (o.type === 'content_block_delta' && o.delta && o.delta.type === 'text_delta') { full += o.delta.text; onDelta && onDelta(full); }
      else if (o.type === 'message_delta' && o.delta && o.delta.stop_reason === 'refusal' && !full) { full = '(The model declined this request. Some safety classifiers flag historical occult/magical content — try the recommended Opus 4.8 model, or rephrase.)'; onDelta && onDelta(full); }
      else if (o.type === 'error') throw new Error((o.error && o.error.message) || 'Claude stream error');
    }
  }
  return full;
}

async function openaiStream({ provider, url, baseUrl, model, key, system, messages, maxTokens = 3072, signal, onDelta, extraHeaders }) {
  let endpoint = url || provider.url;
  if (provider && provider.custom) { const b = (baseUrl || '').trim().replace(/\/+$/, ''); if (!b) throw new Error('Enter the OpenAI-compatible base URL.'); endpoint = b + '/chat/completions'; }
  const oaMessages = [{ role: 'system', content: system },
    ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: typeof m.content === 'string' ? m.content : '' }))];
  const headers = { 'content-type': 'application/json', authorization: 'Bearer ' + key, ...(extraHeaders || {}) };
  const res = await fetch(endpoint, {
    method: 'POST', headers,
    body: JSON.stringify({ model, messages: oaMessages, stream: true, max_tokens: maxTokens, temperature: 0.8 }), signal,
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 240);
    if (res.status === 413) throw new Error('This free model’s per-minute token limit is smaller than the grounded context. Pick a model with a higher limit (e.g. Groq llama-3.3-70b-versatile), wait a minute, or use Claude. (' + body + ')');
    if (res.status === 429) throw new Error('Rate limited by the free tier — wait a minute and retry, or switch model/provider. (' + body + ')');
    if (res.status === 401) throw new Error('The provider rejected the key (401) — check it is correct for this provider. (' + body + ')');
    throw new Error('HTTP ' + res.status + ' — ' + body);
  }
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
      if (txt) { full += txt; onDelta && onDelta(full); }
      if (o.error) throw new Error((o.error.message) || 'stream error');
    }
  }
  return full;
}

// ---------------------------------------------------------------------------
//  claudeToolLoop(opts) — the agentic loop (Claude only): the model calls the
//  engine tools, the caller runs them, results are fed back until the model
//  answers. opts: { url, model, key, system, messages, tools, runTool(name,
//  input)->result, signal, onText(text), onToolNote(name,input,result) }.
// ---------------------------------------------------------------------------
export async function claudeToolLoop({ url, model, key, system, messages, tools, runTool, signal, onText, onToolNote }) {
  let finalText = '';
  for (let guard = 0; guard < 6; guard++) {
    const res = await fetch(url, {
      method: 'POST', headers: anthHeaders(key),
      body: JSON.stringify({ model, max_tokens: 3072, system, messages, tools }), signal,
    });
    if (!res.ok) throw new Error('Claude HTTP ' + res.status + ' — ' + (await res.text()).slice(0, 240));
    const data = await res.json();
    if (data.stop_reason === 'refusal') { finalText = '(The model declined this request. Some safety classifiers flag historical occult/magical content — try the recommended Opus 4.8 model, or rephrase.)'; onText && onText(finalText); break; }
    const blocks = data.content || [];
    const toolUses = blocks.filter(b => b.type === 'tool_use');
    const text = blocks.filter(b => b.type === 'text').map(b => b.text).join('');
    if (text) { onText && onText(text); finalText = text; }
    if (data.stop_reason === 'tool_use' && toolUses.length) {
      messages.push({ role: 'assistant', content: blocks });
      const results = [];
      for (const tu of toolUses) {
        let result; try { result = runTool(tu.name, tu.input || {}); } catch (e) { result = { error: e.message }; }
        onToolNote && onToolNote(tu.name, tu.input, result);
        results.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(result) });
      }
      messages.push({ role: 'user', content: results });
      continue;
    }
    break;
  }
  return finalText;
}

// OpenRouter wants attribution headers on browser-direct calls.
export function openrouterHeaders(homeUrl) {
  return { 'HTTP-Referer': homeUrl || 'https://occult-kranti.github.io/astrology-sim-ant/', 'X-Title': "The Astrologer's Workbench" };
}
