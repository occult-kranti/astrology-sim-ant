// Appearance is local presentation state. It never recasts a chart or dispatches
// calculator input/change events, and it owns only one bounded storage record.
const KEY = 'wb:appearance:v1';
const THEMES = Object.freeze([
  { id: 'parchment', name: 'Parchment', detail: 'Warm paper · copper ink' },
  { id: 'midnight', name: 'Midnight', detail: 'Dark slate · warm starlight' },
  { id: 'mineral', name: 'Mineral', detail: 'Cool paper · blue ink' },
]);
const valid = theme => THEMES.some(item => item.id === theme);

export function initAppearance(options = {}) {
  const existing = document.getElementById('site-appearance');
  if (existing) return existing;
  const mount = options.mount || document.querySelector('header.site .wrap');
  if (!mount) return null;

  const trigger = document.createElement('button');
  trigger.type = 'button'; trigger.className = 'appearance-trigger';
  trigger.setAttribute('aria-label', 'Appearance: choose a color theme');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'site-appearance');
  trigger.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor"/></svg><span>Appearance</span>';

  const dialog = document.createElement('dialog');
  dialog.id = 'site-appearance'; dialog.className = 'appearance-dialog';
  dialog.dataset.uiAppearance = 'true';
  dialog.setAttribute('aria-labelledby', 'appearance-title');
  dialog.setAttribute('aria-describedby', 'appearance-description');
  dialog.innerHTML = '<div class="appearance-heading"><div><p class="appearance-kicker">YOUR READING DESK</p><h2 id="appearance-title">Make yourself at home.</h2></div><button type="button" class="appearance-close" aria-label="Close appearance settings">✕</button></div><p id="appearance-description">Choose the light for your workspace. Your calculations stay exactly as they are.</p><div class="appearance-options" role="group" aria-label="Color theme"></div><p class="appearance-note" role="status" aria-live="polite"></p>';
  document.body.append(dialog);
  // Keep the search/menu controls in their existing relative order.
  const nav = mount.querySelector('nav.main');
  mount.insertBefore(trigger, nav || null);

  const list = dialog.querySelector('.appearance-options');
  const note = dialog.querySelector('.appearance-note');
  for (const theme of THEMES) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'appearance-option';
    button.dataset.appearanceTheme = theme.id;
    button.innerHTML = `<span class="appearance-sample" data-sample="${theme.id}" aria-hidden="true"><i></i><i></i><i></i></span><span class="appearance-option-copy"><strong>${theme.name}</strong><small>${theme.detail}</small></span><span class="appearance-selected" aria-hidden="true">✓</span>`;
    button.addEventListener('click', () => {
      apply(theme.id);
      let stored = true;
      try { localStorage.setItem(KEY, JSON.stringify({ theme: theme.id })); }
      catch { stored = false; }
      note.textContent = stored ? `${theme.name} selected. Saved on this browser.` : `${theme.name} selected for this page. Browser storage is unavailable.`;
    });
    list.append(button);
  }

  function apply(theme) {
    const selected = valid(theme) ? theme : 'parchment';
    document.documentElement.dataset.uiTheme = selected;
    for (const button of list.querySelectorAll('[data-appearance-theme]')) {
      button.setAttribute('aria-pressed', String(button.dataset.appearanceTheme === selected));
    }
    trigger.title = `Appearance · ${THEMES.find(item => item.id === selected).name}`;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = selected === 'midnight' ? '#161e26' : selected === 'mineral' ? '#eef3f5' : '#f7f5ee';
  }
  apply(document.documentElement.dataset.uiTheme);

  let returnFocus = null;
  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    returnFocus = document.activeElement;
    note.textContent = 'Your preference is stored only in this browser.';
    dialog.showModal();
    // Begin at the chosen theme rather than making visitors cycle from the top.
    dialog.querySelector('[aria-pressed="true"]')?.focus();
  });
  dialog.querySelector('.appearance-close').addEventListener('click', () => dialog.close());
  // Native cancellation owns Escape while this top-layer dialog is open.
  // Prevent background page handlers from clearing chart/date selections.
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') event.stopPropagation();
  });
  dialog.addEventListener('close', () => {
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  window.addEventListener('storage', event => {
    if (event.key !== KEY) return;
    if (event.newValue === null) { apply('parchment'); return; }
    try { const value = JSON.parse(event.newValue); if (value && valid(value.theme)) apply(value.theme); }
    catch { /* Ignore malformed records from another tab. */ }
  });
  return dialog;
}
