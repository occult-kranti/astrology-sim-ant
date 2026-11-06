// Explicit, one-shot, same-origin chart transfer. The URL carries only a random
// channel identifier; chart/place inputs never enter a URL or browser storage.
import { normalizeAstrocartographyInputs } from '../core/astrocartography.js';
import { validateLocation, validateZone } from '../core/cultural-calendars.js';
import { ASTROCARTOGRAPHY_CITIES } from '../core/data/astrocartography-data.js';

const PREFIX = 'workbench-astrocartography-transfer-v1-';
const FRAGMENT = '#timeline-transfer=';
const TTL = 60000;
const plain = (value, keys, label) => {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(label + ' must be a plain object.');
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!keys.includes(key) || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new TypeError('Unsupported ' + label + ' field.');
  }
};
export function normalizeAstrocartographyHandoff(raw) {
  plain(raw, ['inputs', 'place'], 'map transfer');
  const inputs = normalizeAstrocartographyInputs(raw.inputs);
  if (inputs.cityIds.length !== ASTROCARTOGRAPHY_CITIES.length) throw new RangeError('Map transfers use the complete reference-city catalogue; omit cityIds.');
  plain(raw.place, ['name', 'lat', 'lon', 'timeZone'], 'destination');
  const { name, lat, lon, timeZone } = raw.place;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) throw new TypeError('Use a bounded destination name.');
  validateLocation(lat, lon);
  const payload = { inputs, place: { name: name.trim(), lat, lon, timeZone: validateZone(timeZone) } };
  if (new TextEncoder().encode(JSON.stringify(payload)).length > 16384) throw new RangeError('The map transfer exceeds its input limit.');
  return payload;
}

/** Call only from an explicit user click. No provider or persistent storage. */
export function offerAstrocartographyHandoff(raw, { onStatus = () => {} } = {}) {
  const payload = normalizeAstrocartographyHandoff(raw);
  if (typeof BroadcastChannel !== 'function' || !globalThis.crypto?.getRandomValues || !/^https?:$/.test(location.protocol)) {
    onStatus('unavailable', 'Cross-tab transfer is unavailable here. Export the study and open the map from the local HTTP website.');
    return { cancel() {} };
  }
  const nonce = [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join('');
  const channel = new BroadcastChannel(PREFIX + nonce), expiresAt = Date.now() + TTL;
  let closed = false, sent = false;
  const finish = (state, message) => {
    if (closed) return;
    closed = true; clearTimeout(timer); channel.close(); onStatus(state, message);
  };
  const timer = setTimeout(() => finish('expired', 'The map transfer expired. Click Map this sample again when ready.'), TTL);
  channel.onmessage = ({ data }) => {
    if (closed || !data || data.nonce !== nonce || Date.now() >= expiresAt) return;
    if (data.type === 'ready' && !sent) {
      sent = true; channel.postMessage({ type: 'offer', nonce, expiresAt, payload });
      onStatus('sent', 'Inputs sent to the map tab for review. Nothing has been calculated or saved there yet.');
    } else if (data.type === 'received' && sent) {
      finish('received', 'The map tab received the inputs. Review them there, then choose Calculate transferred map.');
    }
  };
  const url = new URL('../../../pages/astrocartography.html', import.meta.url);
  url.hash = FRAGMENT.slice(1) + nonce;
  try {
    window.open(url.href, '_blank', 'noopener,noreferrer');
    onStatus('waiting', 'Map tab requested. If your browser blocked it, allow this user-initiated popup and try again. The input transfer expires in 60 seconds.');
  } catch {
    finish('unavailable', 'The browser could not open the map tab. No inputs were stored.');
  }
  return { cancel: () => finish('cancelled', 'The pending map transfer was cancelled because the study changed.') };
}

/** Receives an offer for preview only. The caller owns the explicit Apply action. */
export function receiveAstrocartographyHandoff(onOffer, { onStatus = () => {} } = {}) {
  if (!location.hash.startsWith(FRAGMENT)) return () => {};
  const nonce = location.hash.slice(FRAGMENT.length);
  // Even an invalid transfer token is removed; it is never chart input.
  history.replaceState(history.state, '', location.pathname + location.search);
  if (!/^[a-f0-9]{32}$/.test(nonce) || typeof BroadcastChannel !== 'function') {
    onStatus('unavailable', 'This map-transfer link is invalid or unsupported. Existing map inputs were kept.');
    return () => {};
  }
  const channel = new BroadcastChannel(PREFIX + nonce);
  let closed = false;
  const finish = () => { if (!closed) { closed = true; clearTimeout(timer); clearInterval(retry); channel.close(); } };
  const timer = setTimeout(() => { finish(); onStatus('expired', 'No current transfer was received. Reopen this map from the timeline; existing inputs were kept.'); }, TTL);
  const ready = () => { if (!closed) channel.postMessage({ type: 'ready', nonce }); };
  const retry = setInterval(ready, 300);
  channel.onmessage = ({ data }) => {
    if (closed || !data || data.nonce !== nonce || data.type !== 'offer') return;
    try {
      plain(data, ['type', 'nonce', 'expiresAt', 'payload'], 'transfer envelope');
      if (!Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now() || data.expiresAt > Date.now() + TTL + 2000) throw new RangeError('This transfer has expired or has an invalid expiry.');
      const payload = normalizeAstrocartographyHandoff(data.payload);
      channel.postMessage({ type: 'received', nonce }); finish(); onOffer(payload);
    } catch (error) { finish(); onStatus('invalid', error.message + ' Existing map inputs were kept.'); }
  };
  ready();
  return finish;
}
