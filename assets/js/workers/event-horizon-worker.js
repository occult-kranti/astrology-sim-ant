import { buildEventHorizon, benchmarkHorizonStrategies } from '../core/event-horizon.js';

// One complete ledger per job; cancellation never reports partial data as success.
export function createEventHorizonWorkerController(postMessage) {
  let active = null;
  const send = (type, jobId, fields = {}) => postMessage({ type, jobId, ...fields });
  const fail = (jobId, message, code = 'INVALID_MESSAGE') => send('error', jobId, { error: { name: 'RangeError', message, code } });
  async function handleMessage(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.jobId !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(data.jobId)) { fail(null, 'Supply a bounded alphanumeric job ID.'); return; }
    const { type, jobId } = data;
    if (type === 'cancel') { if (active?.jobId === jobId) active.cancelled = true; else fail(jobId, 'No matching active job to cancel.', 'NO_ACTIVE_JOB'); return; }
    if (type !== 'start' || !['scan', 'benchmark'].includes(data.operation)) { fail(jobId, 'Choose scan or benchmark in a start message.'); return; }
    if (active) { fail(jobId, 'A job is already running. Cancel it or use another worker.', 'BUSY'); return; }
    const token = { jobId, cancelled: false }; active = token;
    const hooks = { shouldCancel: () => token.cancelled, onProgress: progress => send('progress', jobId, { progress }), yieldControl: () => new Promise(resolve => setTimeout(resolve, 0)) };
    try {
      const result = await (data.operation === 'benchmark' ? benchmarkHorizonStrategies : buildEventHorizon)(data.request, hooks);
      if (token.cancelled) send('cancelled', jobId); else send('result', jobId, { result });
    } catch (error) {
      if (token.cancelled || error.name === 'AbortError' || error.code === 'CANCELLED') send('cancelled', jobId);
      else send('error', jobId, { error: { name: error.name ?? 'Error', message: error.message ?? 'Horizon calculation failed.', code: error.code ?? 'CALCULATION_ERROR' } });
    } finally { if (active === token) active = null; }
  }
  return { handleMessage, cancelAll() { if (active) active.cancelled = true; }, get activeJobId() { return active?.jobId ?? null; } };
}
if (typeof self !== 'undefined' && typeof self.postMessage === 'function' && typeof document === 'undefined') {
  const controller = createEventHorizonWorkerController(message => self.postMessage(message));
  self.addEventListener('message', event => { void controller.handleMessage(event.data); });
}
