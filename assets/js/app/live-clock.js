// A testable calculation clock; never owns storage, history, the DOM or network.
export function createLiveClock({ onTick, onResult = () => {}, onState = () => {}, onError = () => {},
  now = () => Date.now(), setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = id => clearTimeout(id), intervalMs = 1000 } = {}) {
  if (typeof onTick !== 'function') throw new TypeError('onTick must calculate one snapshot.');
  if (!Number.isFinite(intervalMs) || intervalMs < 250) throw new RangeError('Live interval must be at least 250 ms.');
  let status = 'idle', timer = null, generation = 0, controller = null, lastTickISO = null, error = null;
  const snapshot = () => Object.freeze({ status, running: status === 'running', intervalMs, lastTickISO, error });
  function publish(value) { status = value; onState(snapshot()); }
  function cancel() {
    generation++;
    if (timer !== null) clearTimer(timer);
    timer = null; controller?.abort(); controller = null;
  }
  async function tick(token) {
    if (token !== generation || status !== 'running') return;
    const job = controller = new AbortController();
    const isCurrent = () => token === generation && status === 'running' && !job.signal.aborted;
    try {
      const date = new Date(now());
      if (!Number.isFinite(date.getTime())) throw new RangeError('Live clock returned an invalid date.');
      const result = await onTick(date, { signal: job.signal, isCurrent });
      if (!isCurrent()) return;
      lastTickISO = date.toISOString();
      onResult(result, date);
    } catch (e) {
      if (!isCurrent()) return;
      error = e?.message || String(e); cancel(); publish('error'); onError(e); return;
    } finally { if (controller === job) controller = null; }
    if (isCurrent()) timer = setTimer(() => { timer = null; tick(token); }, intervalMs);
  }
  function start() {
    if (status === 'running') return snapshot();
    cancel(); error = null; publish('running'); tick(generation); return snapshot();
  }
  function pause() { cancel(); publish('paused'); return snapshot(); }
  function suspend() { if (status === 'running') { cancel(); publish('suspended'); } return snapshot(); }
  function resume() { return ['paused', 'suspended', 'error'].includes(status) ? start() : snapshot(); }
  function stop() { cancel(); publish('idle'); return snapshot(); }
  return { start, pause, resume, suspend, stop, get state() { return snapshot(); } };
}
