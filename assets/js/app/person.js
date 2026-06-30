// ============================================================================
//  person.js — a small, reusable "saved people" control so a tool can be TUNED
//  TO A SPECIFIC PERSON: pick a saved birth moment to fill the birth fields, or
//  save the current birth fields as a named person. On-device only (localStorage
//  via state.js) — nothing leaves the page. Used to personalise the natal &
//  Picatrix layers.
// ============================================================================
import { listPersons, savePerson, removePerson } from './state.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// fields: { bdate, btime, boffset, blat, blon } — DOM <input> elements.
// opts:   { onSelect?(person), title? }
// Inserts the control immediately AFTER `anchorEl`.
export function attachPersonPicker(anchorEl, fields, opts = {}) {
  if (!anchorEl || !anchorEl.insertAdjacentElement) return null;
  const box = document.createElement('div');
  box.className = 'person-picker small';
  box.style.margin = '.5rem 0 .2rem';

  const val = el => (el && el.value != null ? el.value : '');

  function render(selId = '') {
    const persons = listPersons();
    box.innerHTML =
      `<label style="display:inline-flex;align-items:center;gap:.35rem">👤 <b>Saved people</b>
        <select class="person-sel"><option value="">— none —</option>${persons.map(p =>
          `<option value="${esc(p.id)}"${p.id === selId ? ' selected' : ''}>${esc(p.name)}${p.bdate ? ' · ' + esc(p.bdate) : ''}</option>`).join('')}</select></label>
       <span style="margin-left:.6rem;white-space:nowrap"><input class="person-name" type="text" placeholder="name to save as" style="width:9rem">
         <button type="button" class="btn sm person-save">Save this birth moment</button></span>
       ${selId ? '<a href="#" class="person-remove" style="margin-left:.5rem">remove</a>' : ''}
       <span class="person-status muted" style="margin-left:.5rem"></span>`;

    const status = m => { const s = box.querySelector('.person-status'); if (s) s.textContent = m || ''; };

    box.querySelector('.person-sel').addEventListener('change', e => {
      const p = persons.find(x => x.id === e.target.value);
      render(e.target.value);
      if (!p) return;
      const set = (el, v) => { if (el && v != null && v !== '') el.value = v; };
      set(fields.bdate, p.bdate); set(fields.btime, p.btime); set(fields.boffset, p.boffset);
      set(fields.blat, p.blat); set(fields.blon, p.blon);
      status(`Loaded ${p.name}.`);
      if (typeof opts.onSelect === 'function') { try { opts.onSelect(p); } catch (e) { /* non-fatal */ } }
    });

    box.querySelector('.person-save').addEventListener('click', () => {
      const name = (box.querySelector('.person-name').value || '').trim();
      if (!name) { status('Enter a name first.'); return; }
      if (!val(fields.bdate)) { status('Fill the birth date/time/place first.'); return; }
      const person = {
        name, bdate: val(fields.bdate), btime: val(fields.btime), boffset: val(fields.boffset),
        blat: val(fields.blat), blon: val(fields.blon),
      };
      savePerson(person);
      const saved = listPersons().find(p => p.name === name);
      render(saved ? saved.id : '');
      status(`Saved ${name}.`);
    });

    const rm = box.querySelector('.person-remove');
    if (rm) rm.addEventListener('click', e => {
      e.preventDefault();
      const sel = box.querySelector('.person-sel');
      if (sel && sel.value) { removePerson(sel.value); render(''); status('Removed.'); }
    });
  }

  render();
  anchorEl.insertAdjacentElement('afterend', box);
  return box;
}
