// Private chart library. Importing this module never reads or writes storage.
// Only deliberate save/delete/import calls persist data, in one atomic setItem.
// No profile is put into a URL, sent over the network, or added to the offline cache.
import { normalizeDesktopProfile } from '../core/desktop-workbench.js';

export const DESKTOP_LIBRARY_KEY = 'astrologers-workbench.desktop-library.v1';
export const DESKTOP_LIBRARY_LIMITS = Object.freeze({ charts: 200, bytes: 1024 * 1024 });
const FORMAT = 'astrologers-workbench-library';
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const fail = (code, message) => { const error = new Error(message); error.code = code; throw error; };
const copy = value => JSON.parse(JSON.stringify(value));
const bytes = value => new TextEncoder().encode(value).length;

function getStorage(given) {
  try {
    const storage = given === undefined ? globalThis.localStorage : given;
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') throw new Error();
    return storage;
  } catch {
    fail('STORAGE_UNAVAILABLE', 'This browser cannot access the chart library. You can still calculate charts and export the current chart.');
  }
}

function label(value, fallback = 'Untitled chart') {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string' || value.length > 100 || /[\u0000-\u001f\u007f]/u.test(value)) {
    fail('INVALID_NAME', 'Use a chart name of at most 100 characters without control characters.');
  }
  return value.trim() || fallback;
}

export function validateProfile(raw) {
  if (!plain(raw)) fail('INVALID_PROFILE', 'Each chart must contain a plain profile object.');
  // Re-resolve the civil clock on this runtime. Imported UTC values are never trusted.
  const normalized = normalizeDesktopProfile(raw);
  return {
    name: label(raw.name), localDate: normalized.localDate, localTime: normalized.localTime,
    timeZone: normalized.timeZone, lat: normalized.lat, lon: normalized.lon,
    disambiguation: normalized.disambiguation,
  };
}

function validTimestamp(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

function validateEntry(raw) {
  if (!plain(raw) || typeof raw.id !== 'string' || !/^[A-Za-z0-9_-]{8,80}$/.test(raw.id)) {
    fail('INVALID_ENTRY', 'Each saved chart needs a valid chart identifier.');
  }
  if (!validTimestamp(raw.createdAt) || !validTimestamp(raw.updatedAt) || raw.updatedAt < raw.createdAt) {
    fail('INVALID_TIMESTAMP', 'A saved chart has invalid creation or update timestamps.');
  }
  return { id: raw.id, name: label(raw.name), profile: validateProfile(raw.profile), createdAt: raw.createdAt, updatedAt: raw.updatedAt };
}

function validateEntries(entries) {
  if (!Array.isArray(entries) || entries.length > DESKTOP_LIBRARY_LIMITS.charts) {
    fail('LIBRARY_LIMIT', `A chart library can contain at most ${DESKTOP_LIBRARY_LIMITS.charts} charts.`);
  }
  const ids = new Set();
  return entries.map(raw => {
    const entry = validateEntry(raw);
    if (ids.has(entry.id)) fail('DUPLICATE_ID', 'The imported library contains duplicate chart identifiers. Nothing was changed.');
    ids.add(entry.id);
    return entry;
  });
}

function parseLibrary(text) {
  if (typeof text !== 'string' || bytes(text) > DESKTOP_LIBRARY_LIMITS.bytes) {
    fail('IMPORT_LIMIT', 'Choose a chart-library JSON file no larger than 1 MiB.');
  }
  let envelope;
  try { envelope = JSON.parse(text); } catch { fail('INVALID_JSON', 'The chart library is not valid JSON. Nothing was changed.'); }
  if (!plain(envelope) || envelope.format !== FORMAT || envelope.version !== 1 || !own(envelope, 'charts')) {
    fail('INVALID_FORMAT', 'Choose an Astrologer’s Workbench chart-library export, version 1.');
  }
  return validateEntries(envelope.charts);
}

export function readChartLibrary(storage) {
  const target = getStorage(storage);
  let text;
  try { text = target.getItem(DESKTOP_LIBRARY_KEY); }
  catch { fail('STORAGE_UNAVAILABLE', 'The browser blocked access to saved charts. Your existing library was not changed.'); }
  return text === null ? [] : parseLibrary(text);
}

export function exportChartLibrary(entries) {
  const charts = validateEntries(entries === undefined ? readChartLibrary() : entries);
  const text = JSON.stringify({ format: FORMAT, version: 1, charts }, null, 2);
  if (bytes(text) > DESKTOP_LIBRARY_LIMITS.bytes) fail('IMPORT_LIMIT', 'The chart library exceeds the 1 MiB portable-export limit.');
  return text;
}

function persist(entries, storage) {
  const text = exportChartLibrary(entries);
  const target = getStorage(storage);
  try { target.setItem(DESKTOP_LIBRARY_KEY, text); }
  catch { fail('STORAGE_WRITE_FAILED', 'The browser could not save this change, possibly because storage is full or blocked. Your previous library remains in place.'); }
  return copy(entries);
}

function newId(existing) {
  let id;
  do {
    id = globalThis.crypto?.randomUUID?.() || `chart_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
  } while (existing.has(id));
  return id;
}

export function saveChart(profile, { id, name, storage } = {}) {
  const normalized = validateProfile(profile);
  const entries = readChartLibrary(storage);
  const index = id === undefined ? -1 : entries.findIndex(entry => entry.id === id);
  if (id !== undefined && index < 0) fail('CHART_NOT_FOUND', 'That saved chart no longer exists. Save it as a new chart.');
  if (index < 0 && entries.length >= DESKTOP_LIBRARY_LIMITS.charts) fail('LIBRARY_LIMIT', 'The local library is full (200 charts). Export a backup and remove an unneeded chart first.');
  const now = new Date().toISOString();
  const entry = { id: index < 0 ? newId(new Set(entries.map(e => e.id))) : id,
    name: label(name ?? normalized.name), profile: normalized,
    createdAt: index < 0 ? now : entries[index].createdAt,
    updatedAt: index < 0 ? now : (now < entries[index].createdAt ? entries[index].createdAt : now) };
  if (index < 0) entries.push(entry); else entries[index] = entry;
  persist(entries, storage);
  return copy(entry);
}

export function deleteChart(id, { storage } = {}) {
  const entries = readChartLibrary(storage);
  if (!entries.some(entry => entry.id === id)) return entries;
  return persist(entries.filter(entry => entry.id !== id), storage);
}

export function importChartLibrary(text, { storage, mode = 'merge' } = {}) {
  if (!['merge', 'replace'].includes(mode)) fail('INVALID_IMPORT_MODE', 'Choose merge or replace for this import.');
  const incoming = parseLibrary(text);
  // Replace is an explicit caller action, and can recover from a corrupt existing file.
  if (mode === 'replace') return persist(incoming, storage);
  const existing = readChartLibrary(storage);
  const ids = new Set(existing.map(entry => entry.id));
  for (const entry of incoming) {
    const collision = existing.find(saved => saved.id === entry.id);
    // Re-importing an unchanged chart is idempotent. A differing chart never overwrites
    // a saved chart during merge: give the incoming record its own new identifier.
    if (collision && collision.name === entry.name && JSON.stringify(collision.profile) === JSON.stringify(entry.profile)) continue;
    const candidate = collision ? { ...entry, id: newId(ids) } : entry;
    ids.add(candidate.id); existing.push(candidate);
  }
  return persist(existing, storage);
}
