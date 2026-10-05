// Optional, instance-scoped session study. Importing/mounting makes no requests.
// Keys are held only by the password input and a single in-flight request.
import { buildStudyPacket, buildStudyPrompt, studyCitationWarnings } from '../core/study-packet.js';
import { PROVIDERS, streamChat } from './llm-core.js';

const PROVIDER_NAMES = { groq: 'Groq', anthropic: 'Anthropic' };
const OUTPUT_LIMIT = 32000, MAX_TOKENS = 2048, TIMEOUT_MS = 60000;
let nextId = 0;
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

export function buildSessionStudyRequest(packet, { provider, model }) {
  if (!Object.hasOwn(PROVIDER_NAMES, provider)) throw new RangeError('Choose Groq or Anthropic.');
  if (typeof model !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9/._:-]{0,127}$/.test(model)) throw new RangeError('Enter a supported model identifier (at most 128 characters).');
  const prompt = buildStudyPrompt(packet), messages = [{ role: 'user', content: prompt.user }];
  const body = provider === 'anthropic'
    ? { model, max_tokens: MAX_TOKENS, system: prompt.system, messages, stream: true }
    : { model, messages: [{ role: 'system', content: prompt.system }, ...messages], stream: true, max_tokens: MAX_TOKENS, temperature: 0.8 };
  return freeze({ provider, model, destination: PROVIDERS[provider].url, body, packet, prompt });
}

function providerError(error) {
  // Do not echo a server body that could repeat authorization or session text.
  if (/\b401\b|\b403\b/.test(String(error?.message))) return 'The provider rejected access (401/403). Check your API key and account access, then prepare and retry.';
  if (/\b429\b|rate.limit/i.test(String(error?.message))) return 'The provider rate limit was reached (429). Wait, then send the same approved request again.';
  if (/\b413\b|per.minute token limit/i.test(String(error?.message))) return 'The provider rejected the request size (413). Exclude optional text or use a model with a suitable context limit.';
  return 'The request failed or the connection was interrupted. Check your provider settings and network, then retry. No answer was saved.';
}

// Small independently testable cancellation controller. A response owns writes
// only while its token is active; abort also guards buffered/late completions.
export function createSessionStudyController({ transport = streamChat, onText = () => {}, onStatus = () => {}, onBusy = () => {}, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let active = null, disposed = false;
  const current = token => !disposed && active === token && !token.controller.signal.aborted;
  const cancel = (reason = 'Stopped. The partial response is not a saved answer.') => {
    const previous = active; active = null;
    if (previous) { clearTimer(previous.timer); previous.controller.abort(); }
    onBusy(false); if (reason) onStatus(reason);
  };
  return {
    get busy() { return active !== null; },
    cancel,
    async send(request, key) {
      if (disposed) throw new Error('This session study panel has been closed.');
      if (typeof key !== 'string' || !key.trim() || key.length > 4096) throw new Error('Enter your provider API key. It is kept in memory only.');
      cancel('');
      const token = { controller: new AbortController(), timer: null };
      active = token; onBusy(true); onStatus('Sending the approved snapshot…');
      token.timer = setTimer(() => { if (current(token)) cancel('The request timed out after 60 seconds. Send again to retry; nothing resumes automatically.'); }, TIMEOUT_MS);
      try {
        const answer = await transport({ provider: PROVIDERS[request.provider], url: request.destination,
          model: request.model, key: key.trim(), system: request.prompt.system,
          messages: [{ role: 'user', content: request.prompt.user }], maxTokens: MAX_TOKENS, signal: token.controller.signal,
          onDelta: value => {
            if (!current(token)) return;
            if (typeof value !== 'string' || value.length > OUTPUT_LIMIT) { cancel('The response exceeded the 32,000-character limit. No answer was saved.'); return; }
            onText(value);
          } });
        if (!current(token)) return null;
        if (typeof answer !== 'string' || !answer.trim() || answer.length > OUTPUT_LIMIT) throw new Error('Invalid or empty provider response.');
        onText(answer); onStatus('Response complete. AI text is not verified; review its citations before saving.');
        return answer;
      } catch (error) {
        if (current(token)) onStatus(providerError(error));
        return null;
      } finally {
        clearTimer(token.timer);
        if (active === token) { active = null; onBusy(false); }
      }
    },
    destroy() { cancel(''); disposed = true; },
  };
}

export function mountSessionStudy(host, { getSession, onSaveAnswer } = {}) {
  if (!host?.ownerDocument || typeof getSession !== 'function') throw new TypeError('A session-study host and getSession callback are required.');
  const doc = host.ownerDocument, win = doc.defaultView, id = `session-ai-${++nextId}`;
  let prepared = null, answerRecord = null, disposed = false;
  const refs = {}, listeners = [];
  const el = (tag, text, key) => {
    const element = doc.createElement(tag); if (text) element.textContent = text;
    if (key) { element.dataset.sessionAi = key; element.id = `${id}-${key}`; refs[key] = element; }
    return element;
  };
  const on = (element, event, callback) => { element.addEventListener(event, callback); listeners.push(() => element.removeEventListener(event, callback)); };
  const panel = el('section'); panel.className = 'session-ai'; panel.setAttribute('aria-label', 'Study this session with optional AI');
  panel.append(el('h3', 'Study this session with AI'));
  panel.append(el('p', 'Prepare a frozen study packet, review exactly what it contains, then send it to your chosen provider. Opening this panel sends nothing. Copy or export works without an account.'));
  const controls = el('fieldset'); controls.className = 'session-ai-controls'; controls.append(el('legend', 'Provider and disclosure choices'));
  const field = (label, element) => { const wrapper = el('div'); wrapper.className = 'field session-ai-field'; const l = el('label', label); l.htmlFor = element.id; wrapper.append(l, element); controls.append(wrapper); };
  const provider = el('select', '', 'provider');
  for (const [value, label] of Object.entries(PROVIDER_NAMES)) { const option = el('option', label); option.value = value; provider.append(option); }
  field('Provider', provider);
  const model = el('input', '', 'model'); model.type = 'text'; model.maxLength = 128; model.spellcheck = false; field('Model identifier (editable)', model);
  const key = el('input', '', 'key'); key.type = 'password'; key.autocomplete = 'off'; key.spellcheck = false; key.maxLength = 4096; field('Your API key — kept only in memory', key);
  controls.append(el('p', 'Your provider account must permit API use for the chosen model. Availability, pricing and quotas depend on that account. No key is included in copied or exported packets.'));
  for (const [name, label] of [['location', 'Include coordinates and location-dependent calculations'], ['notes', 'Include notes, hypothesis, reflection and reported measurements'], ['question', 'Include the session title and recorded question'], ['symbol-text', 'Include entered letters and their symbolic calculation']]) {
    const check = el('input', '', name); check.type = 'checkbox'; const labelEl = el('label'); labelEl.className = 'session-ai-check'; labelEl.append(check, doc.createTextNode(` ${label}`)); controls.append(labelEl);
  }
  panel.append(controls);
  const actions = el('div'); actions.className = 'session-ai-actions';
  const button = (key, label, parent = actions) => { const b = el('button', label, key); b.type = 'button'; parent.append(b); return b; };
  button('prepare', 'Prepare request'); button('send', 'Send approved request'); button('stop', 'Stop'); button('copy', 'Copy study prompt'); button('export-prompt', 'Export study packet');
  panel.append(actions);
  const status = el('p', 'Choose what to disclose and prepare a request. No provider request has been sent.', 'status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); panel.append(status);
  const details = el('details'); details.open = true; details.className = 'session-ai-preview'; details.append(el('summary', 'Exact outgoing request (authorization key omitted)'));
  const preview = el('pre', 'No request prepared.', 'preview'); preview.tabIndex = 0; details.append(preview); panel.append(details);
  const response = el('div', '', 'response'); response.className = 'session-ai-response'; response.setAttribute('role', 'region'); response.setAttribute('aria-label', 'AI response'); response.setAttribute('aria-busy', 'false'); panel.append(response);
  const warning = el('p', '', 'citations'); warning.className = 'session-ai-citations'; panel.append(warning);
  const answerActions = el('div'); answerActions.className = 'session-ai-actions';
  button('export-answer', 'Export answer with approved packet', answerActions);
  if (typeof onSaveAnswer === 'function') button('save-answer', 'Save this answer', answerActions);
  panel.append(answerActions); host.replaceChildren(panel);
  const statusText = value => { if (!disposed) status.textContent = value; };
  const options = () => ({ includeLocation: refs.location.checked, includeNotes: refs.notes.checked, includeQuestion: refs.question.checked, includeSymbolText: refs['symbol-text'].checked });
  const enable = () => {
    refs.send.disabled = !prepared || controller.busy;
    refs.stop.disabled = !controller.busy;
    refs.copy.disabled = refs['export-prompt'].disabled = !prepared;
    refs['export-answer'].disabled = !answerRecord;
    if (refs['save-answer']) refs['save-answer'].disabled = !answerRecord;
    response.setAttribute('aria-busy', String(controller.busy));
  };
  const controller = createSessionStudyController({
    onText: value => { if (!disposed) response.textContent = value; },
    onStatus: statusText, onBusy: () => { if (!disposed) enable(); },
  });
  const invalidate = (reason = 'The session or settings changed. Prepare a new request before sending.') => {
    if (disposed) return;
    controller.cancel(''); prepared = null; answerRecord = null;
    preview.textContent = 'Previous preview is stale. Prepare the current session again.';
    if (response.textContent) response.textContent = 'The previous response belongs to an earlier request. Prepare the current session before asking again.';
    warning.textContent = ''; statusText(reason); enable();
  };
  const chooseModel = () => { model.value = PROVIDERS[provider.value].models[0][0]; };
  chooseModel();
  for (const control of [model, key, refs.location, refs.notes, refs.question, refs['symbol-text']]) on(control, control.type === 'checkbox' ? 'change' : 'input', () => invalidate());
  on(provider, 'change', () => { key.value = ''; chooseModel(); invalidate('Provider changed and the in-memory key was cleared. Review the model and prepare a new request.'); });
  const packetNow = () => { const selected = getSession(); return buildStudyPacket(selected?.session, selected?.context, options()); };
  on(refs.prepare, 'click', () => {
    controller.cancel(''); answerRecord = null; response.textContent = ''; warning.textContent = '';
    try {
      prepared = buildSessionStudyRequest(packetNow(), { provider: provider.value, model: model.value.trim() });
      preview.textContent = JSON.stringify({ destination: prepared.destination, body: prepared.body }, null, 2);
      statusText(`Prepared ${preview.textContent.length.toLocaleString()} characters for ${PROVIDER_NAMES[prepared.provider]} (${prepared.model}). Review the request, then choose Send. Nothing has been transmitted.`);
    } catch (error) { prepared = null; preview.textContent = 'No valid request prepared.'; statusText(error.message); }
    enable();
  });
  on(refs.send, 'click', async () => {
    if (!prepared || controller.busy || disposed) return;
    try {
      if (JSON.stringify(packetNow()) !== JSON.stringify(prepared.packet) || provider.value !== prepared.provider || model.value.trim() !== prepared.model) { invalidate(); return; }
      if (!key.value.trim()) { statusText('Enter your provider API key, then prepare the request again. Copy and export remain available without a key.'); return; }
      const approved = prepared; answerRecord = null; response.textContent = ''; warning.textContent = ''; enable();
      const answer = await controller.send(approved, key.value);
      if (disposed || prepared !== approved || answer === null) return;
      const citationWarnings = studyCitationWarnings(answer, approved.packet);
      warning.textContent = citationWarnings.length ? citationWarnings.join(' ') : 'Citation IDs can identify supplied evidence; they do not prove the AI interpreted it correctly.';
      answerRecord = freeze({ schemaVersion: 1, createdAt: new Date().toISOString(), provider: approved.provider, model: approved.model, text: answer,
        packet: approved.packet, request: { destination: approved.destination, body: approved.body }, citationWarnings });
      enable();
    } catch (error) { statusText(error.message); enable(); }
  });
  on(refs.stop, 'click', () => controller.cancel());
  on(refs.copy, 'click', async () => {
    if (!prepared) return;
    const approved = prepared;
    try {
      if (!win.navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await win.navigator.clipboard.writeText(`${approved.prompt.system}\n\n${approved.prompt.user}`);
      if (!disposed && prepared === approved) statusText('Study prompt copied. Pasting it into another AI client is a separate disclosure to that service.');
    } catch { if (!disposed && prepared === approved) statusText('Clipboard unavailable. Use Export study packet or select and copy the preview text.'); }
  });
  const download = (value, filename) => {
    const url = win.URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
    const anchor = el('a'); anchor.href = url; anchor.download = filename; doc.body.append(anchor); anchor.click(); anchor.remove();
    // Revoke after the browser has consumed the click; no permanent URL cache.
    win.setTimeout(() => win.URL.revokeObjectURL(url), 0);
  };
  on(refs['export-prompt'], 'click', () => { if (prepared) { try { download({ schemaVersion: 1, packet: prepared.packet, prompt: prepared.prompt, request: { destination: prepared.destination, body: prepared.body } }, 'study-packet.json'); statusText('Approved study packet exported locally. No provider request was sent.'); } catch { statusText('Export failed. Select and copy the preview text instead.'); } } });
  on(refs['export-answer'], 'click', () => { if (answerRecord) { try { download(answerRecord, 'study-answer.json'); statusText('Answer and its approved packet exported locally.'); } catch { statusText('Answer export failed. Copy the response text instead.'); } } });
  if (refs['save-answer']) on(refs['save-answer'], 'click', async () => {
    if (!answerRecord) return;
    const saved = answerRecord;
    try { await onSaveAnswer(saved); if (!disposed && answerRecord === saved) statusText('Answer saved with its approved packet.'); }
    catch { if (!disposed && answerRecord === saved) statusText('The answer could not be saved. Use Export answer to keep a local copy.'); }
  });
  on(doc, 'visibilitychange', () => { if (doc.hidden) invalidate('Stopped while this page is hidden. Prepare again to send; nothing resumes automatically.'); });
  const destroy = () => {
    if (disposed) return;
    controller.destroy(); key.value = ''; prepared = answerRecord = null; listeners.splice(0).forEach(remove => remove());
    disposed = true; host.replaceChildren();
  };
  on(win, 'pagehide', destroy); enable();
  return { invalidate, destroy };
}
