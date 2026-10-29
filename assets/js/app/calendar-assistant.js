import { buildCalendarStudyPacket, buildCalendarStudyPrompt, answerCalendarStudyQuestion } from '../core/calendar-study-packet.js';

let instance = 0;
const element = (tag, text, className) => { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; };
const fingerprint = result => result?.context ? JSON.stringify(['dateISO', 'lat', 'lon', 'timeZone', 'system', 'prayerMethod', 'asr', 'highLatitude'].map(k => result.context[k] ?? null)) : null;

// An explicit handoff to the user's chosen chat. No SDK, API key, telemetry,
// provider call, injected query text or assumption of a connected ChatGPT session.
export function mountCalendarAssistant(container, { getComparison = () => null } = {}) {
  if (!(container instanceof Element) || typeof getComparison !== 'function') throw new TypeError('Assistant needs a container and current-comparison callback.');
  const id = `calendar-assistant-${++instance}`;
  const details = element('details', '', 'ca-panel'), summary = element('summary', 'Study this comparison with AI');
  const intro = element('p', 'Explore the methods locally, or prepare a source-labelled packet to copy into ChatGPT. Preparing a packet sends nothing. This site cannot read your ChatGPT account or this conversation.');
  const disclosure = element('label', '', 'ca-disclosure'), include = element('input');
  include.type = 'checkbox'; include.id = `${id}-location`;
  disclosure.htmlFor = include.id;
  disclosure.append(include, document.createTextNode(' Include selected coordinates, time zone and civil-calendar rows'));
  const disclosureHelp = element('p', 'Off by default: exact coordinates, zone, civil-date labels, houses, prayer and planetary-hour times. UTC and geocentric positions remain visible. Notes, saved births and credentials are always excluded.', 'small muted');
  disclosureHelp.id = `${id}-disclosure`; include.setAttribute('aria-describedby', disclosureHelp.id);
  const guidanceDisclosure = element('label', '', 'ca-disclosure'), includeGuidance = element('input');
  includeGuidance.type = 'checkbox'; includeGuidance.id = `${id}-guidance`;
  guidanceDisclosure.htmlFor = includeGuidance.id;
  guidanceDisclosure.append(includeGuidance, document.createTextNode(' Include sampled historical rules, measured inputs and source qualifications'));
  const guidanceHelp = element('p', 'A separate choice: include the rule evidence behind this reading. With location off, only geocentric rules are included; temporal-hour and local-clock details stay excluded. Optional actions remain labelled modern editorial reflections.', 'small muted');
  guidanceHelp.id = `${id}-guidance-help`; includeGuidance.setAttribute('aria-describedby', guidanceHelp.id);
  const questionLabel = element('label', 'Question for ChatGPT (optional)'), question = element('textarea');
  question.id = `${id}-question`; question.maxLength = 1000; question.rows = 3;
  question.placeholder = 'For example: Why do the tropical and sidereal signs differ?';
  questionLabel.htmlFor = question.id;
  const prepare = element('button', 'Prepare preview', 'btn'); prepare.type = 'button';
  const previewLabel = element('label', 'Outgoing prompt — review before copying'), preview = element('textarea');
  preview.id = `${id}-preview`; preview.readOnly = true; preview.rows = 9; previewLabel.htmlFor = preview.id;
  preview.placeholder = 'Calculate a moment, then prepare a preview. Nothing is sent automatically.';
  const actions = element('div', '', 'ca-actions'), copy = element('button', 'Copy prompt', 'btn'), download = element('button', 'Download packet JSON', 'btn-secondary'), open = element('a', 'Open ChatGPT', 'btn-secondary');
  copy.type = download.type = 'button'; open.href = 'https://chatgpt.com/'; open.target = '_blank'; open.rel = 'noopener noreferrer';
  open.setAttribute('aria-describedby', `${id}-handoff`);
  const handoffHelp = element('p', 'Copy the prompt, open ChatGPT, then paste and send it yourself. Opening the link sends no packet and does not connect the accounts. Your chosen service’s privacy and retention settings apply.', 'small muted');
  handoffHelp.id = `${id}-handoff`;
  actions.append(copy, download, open);
  const status = element('p', 'Calculate a moment to prepare its study packet.', 'ca-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const local = element('div', '', 'ca-local'), localTitle = element('h3', 'Ask about the methods'), localNote = element('p', 'Local rule-based explanations · no language model or network request'), topicLabel = element('label', 'Choose a study question'), topic = element('select'), explain = element('button', 'Explain locally', 'btn-secondary'), answer = element('p');
  topic.id = `${id}-topic`; topicLabel.htmlFor = topic.id;
  for (const [value, label] of [['differences', 'Why do the readings differ?'], ['similarities', 'What do these systems share?'], ['guidance', 'Which measured rules explain this sample?'], ['disagreements', 'Why can favorable and caution coexist?'], ['boundaries', 'When does the day begin?'], ['sources', 'Which sources support this?'], ['privacy', 'What data would I share?']]) { const o = element('option', label); o.value = value; topic.append(o); }
  explain.type = 'button'; answer.setAttribute('role', 'status');
  const sourceLinks = element('ul', '', 'ca-source-links'); sourceLinks.hidden = true;
  local.append(localTitle, localNote, topicLabel, topic, explain, answer, sourceLinks);
  const style = element('style');
  style.textContent = '.ca-panel{border-block:1px solid var(--line,#cfc7b8);padding-block:1rem;margin-block:1.5rem}.ca-panel summary{font-size:1.1rem;font-weight:700;min-height:44px;cursor:pointer}.ca-panel textarea{display:block;box-sizing:border-box;width:100%;max-width:100%;font:inherit;min-height:5rem;padding:.75rem;overflow-wrap:anywhere}.ca-panel label{display:block;margin-block:.8rem .35rem;font-weight:600}.ca-panel .ca-disclosure{display:flex;align-items:flex-start;gap:.7rem;font-weight:400;min-height:44px}.ca-panel .ca-disclosure input{width:1.3rem;height:1.3rem;flex:0 0 auto;margin-block:.1rem}.ca-actions{display:flex;gap:.65rem;flex-wrap:wrap;margin-block:1rem}.ca-panel button,.ca-panel select,.ca-panel .btn-secondary{min-height:44px;font-size:1rem}.ca-panel select{max-width:100%;margin-block-end:.75rem}.ca-panel button:disabled{opacity:.55;cursor:not-allowed}.ca-status{min-height:1.5em}.ca-local{border-block-start:1px solid var(--line,#cfc7b8);margin-block-start:1rem;padding-block-start:1rem}.ca-local h3{margin-block-start:0}.ca-panel :focus-visible{outline:3px solid var(--accent,#8c3f26);outline-offset:3px}';
  details.append(summary, intro, local, disclosure, disclosureHelp, guidanceDisclosure, guidanceHelp, questionLabel, question, prepare, previewLabel, preview, actions, handoffHelp, status);
  container.replaceChildren(style, details);
  let comparison = null, selectedFingerprint = null, packet = null, destroyed = false;
  const clear = message => { packet = null; preview.value = ''; copy.disabled = download.disabled = true; answer.textContent = ''; sourceLinks.replaceChildren(); sourceLinks.hidden = true; status.textContent = message; };
  const current = () => {
    const candidate = getComparison();
    if (destroyed || !comparison || !candidate || fingerprint(candidate) !== selectedFingerprint) {
      clear('The time, location or method changed. Calculate again before preparing or copying a packet.');
      return null;
    }
    return candidate;
  };
  const preparePacket = () => {
    const candidate = current(); if (!candidate) return false;
    try {
      packet = buildCalendarStudyPacket(candidate, { includeLocation: include.checked, includeGuidance: includeGuidance.checked });
      preview.value = buildCalendarStudyPrompt(packet, question.value).text;
      copy.disabled = download.disabled = false;
      status.textContent = `Preview prepared locally.${packet.guidance ? ` ${packet.guidance.rules.length} historical rules included; ${include.checked ? 'selected observer disclosed' : 'observer and temporal-hour context excluded'}.` : ' Historical rule evidence is excluded.'} Review the exact outgoing text. Nothing has been sent.`;
      return true;
    } catch (error) { clear(`Could not prepare the packet: ${error.message}`); return false; }
  };
  prepare.addEventListener('click', preparePacket);
  include.addEventListener('change', () => clear('Disclosure choice changed. Prepare a new preview before copying.'));
  includeGuidance.addEventListener('change', () => clear('Rule-evidence choice changed. Prepare a new preview before copying.'));
  question.addEventListener('input', () => clear('Question changed. Prepare a new preview before copying.'));
  copy.addEventListener('click', async () => {
    if (!current() || !packet) return;
    const text = preview.value;
    try {
      await navigator.clipboard.writeText(text);
      if (current() && packet && preview.value === text) status.textContent = 'Prompt copied. Paste and explicitly send it in your chosen chat. No provider request was made here.';
    } catch {
      if (!current() || !packet) return;
      preview.focus(); preview.select();
      status.textContent = 'Clipboard access is unavailable. Select and copy the preview manually.';
    }
  });
  download.addEventListener('click', () => {
    if (!current() || !packet) return;
    const link = element('a'), url = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2) + '\n'], { type: 'application/json' }));
    link.href = url; link.download = `calendar-study-${packet.atUTC.slice(0, 10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Packet JSON downloaded. Nothing has been uploaded.';
  });
  explain.addEventListener('click', () => {
    const candidate = current(); if (!candidate) return;
    try {
      const localPacket = buildCalendarStudyPacket(candidate, { includeLocation: include.checked, includeGuidance: includeGuidance.checked || ['guidance', 'disagreements'].includes(topic.value) });
      answer.textContent = answerCalendarStudyQuestion(localPacket, topic.value).text;
      sourceLinks.replaceChildren(...localPacket.sources.map(source => {
        const li = element('li'), a = element('a', `[${source.id}] ${source.title}`);
        a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; li.append(a); return li;
      }));
      sourceLinks.hidden = topic.value === 'privacy';
    }
    catch (error) { answer.textContent = `The local explanation is unavailable: ${error.message}`; }
  });
  function update(result) {
    comparison = result || null; selectedFingerprint = fingerprint(comparison);
    prepare.disabled = explain.disabled = !comparison;
    clear(comparison ? 'Current comparison ready. Choose a local question or prepare an AI preview.' : 'Calculate a moment to prepare its study packet. Previous previews have been cleared.');
  }
  update(getComparison());
  return { update, destroy() { destroyed = true; comparison = packet = null; container.replaceChildren(); } };
}
