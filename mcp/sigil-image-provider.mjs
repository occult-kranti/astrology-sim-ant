// Optional independently hosted image-generation adapter. Not mounted by Pages,
// not a new MCP tool, and not connected merely by importing this module.
// Supply secrets/model/host in the backend runtime; never in browser JavaScript.
const PROVIDER_URL = 'https://api.openai.com/v1/images/generations';
const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
const tokenEqual = (a, b) => { if (a.length !== b.length) return false; let difference = 0; for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i); return difference === 0; };
async function boundedText(stream, maxBytes, signal) {
  if (!stream) return '';
  const reader = stream.getReader(), chunks = []; let bytes = 0;
  let abort;
  const aborted = new Promise((_, reject) => { abort = () => { reader.cancel().catch(() => {}); reject(new Error('aborted')); }; signal.addEventListener('abort', abort, { once: true }); if (signal.aborted) abort(); });
  try {
    while (true) {
      const { value, done } = await Promise.race([reader.read(), aborted]); if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new RangeError('body-limit'); }
      chunks.push(value);
    }
    const data = new Uint8Array(bytes); let offset = 0; for (const c of chunks) { data.set(c, offset); offset += c.byteLength; }
    return new TextDecoder('utf-8', { fatal: true }).decode(data);
  } finally { signal.removeEventListener('abort', abort); reader.releaseLock(); }
}

export function createSigilImageProvider({ apiKey, accessToken, model, hostname, fetchImpl = fetch, now = Date.now, timeoutMs = 60000 } = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new TypeError('Configure the image provider API key in the server runtime.');
  if (typeof accessToken !== 'string' || accessToken.length < 32) throw new TypeError('Configure a separate server access token of at least 32 characters.');
  if (typeof model !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(model)) throw new TypeError('Configure a supported image model explicitly in the server runtime.');
  if (typeof hostname !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9.-]*$/.test(hostname)) throw new TypeError('Configure the exact HTTPS backend hostname.');
  if (typeof fetchImpl !== 'function' || typeof now !== 'function' || !Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60000) throw new TypeError('Invalid adapter runtime options.');
  let inFlight = false, windowStart = -Infinity, requests = 0;
  return {
    async fetch(request) {
      const url = new URL(request.url);
      if (url.protocol !== 'https:' || url.hostname !== hostname || url.port || url.pathname !== '/api/sigil-image' || url.search) return reply({ error: 'Unknown HTTPS image endpoint.' }, 403);
      if (request.method !== 'POST') return reply({ error: 'Use an authenticated POST request.' }, 405);
      const origin = request.headers.get('origin'); if (origin && origin !== `https://${hostname}`) return reply({ error: 'Origin is not allowed.' }, 403);
      if (!tokenEqual(request.headers.get('authorization') || '', `Bearer ${accessToken}`)) return reply({ error: 'Authentication required.' }, 401);
      if ((request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase() !== 'application/json') return reply({ error: 'Use application/json.' }, 415);
      if (Number(request.headers.get('content-length') || 0) > 65536) return reply({ error: 'Request exceeds 64 KiB.' }, 413);
      if (request.signal.aborted) return reply({ error: 'Request cancelled.' }, 408);
      if (inFlight) return reply({ error: 'An image request is already running. Try again after it completes.' }, 429);
      const at = now(); if (!Number.isFinite(at)) return reply({ error: 'Server clock is unavailable.' }, 503);
      if (at - windowStart >= 60000) { windowStart = at; requests = 0; }
      if (requests >= 4) return reply({ error: 'This backend allows four image requests per minute.' }, 429);
      const controller = new AbortController(), abort = () => controller.abort(); request.signal.addEventListener('abort', abort, { once: true });
      const timer = setTimeout(abort, timeoutMs); let providerStarted = false;
      inFlight = true;
      try {
        let input;
        try { input = JSON.parse(await boundedText(request.body, 65536, controller.signal)); }
        catch (error) { if (controller.signal.aborted) return reply({ error: 'Request cancelled or timed out.' }, 408); return reply({ error: error instanceof RangeError ? 'Request exceeds 64 KiB.' : 'Request JSON is invalid.' }, error instanceof RangeError ? 413 : 400); }
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k => k !== 'prompt') || typeof input.prompt !== 'string' || !input.prompt.trim() || input.prompt.length > 12000) return reply({ error: 'Supply only a prompt string of 1–12000 characters.' }, 400);
        requests++; providerStarted = true;
        const response = await fetchImpl(PROVIDER_URL, { method: 'POST', redirect: 'error', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, prompt: input.prompt, n: 1, size: '1024x1024', quality: 'low', output_format: 'png' }), signal: controller.signal });
        if (!response.ok) { if (response.body) await response.body.cancel(); return reply({ error: response.status === 429 ? 'The image provider is rate limited.' : 'The image provider rejected the request. Check server configuration and provider access.', providerStatus: response.status }, response.status === 429 ? 429 : 502); }
        const output = JSON.parse(await boundedText(response.body, 18 * 1024 * 1024, controller.signal));
        const encoded = output?.data?.[0]?.b64_json;
        if (typeof encoded !== 'string' || encoded.length > 16 * 1024 * 1024 || encoded.length % 4 !== 0 || !/^iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$/.test(encoded)) return reply({ error: 'The provider did not return a bounded PNG image.' }, 502);
        return reply({ kind: 'provider-rendered-illustration', provider: 'OpenAI Images API', model, image: { mimeType: 'image/png', base64: encoded }, claimStatus: 'AI-rendered illustration; numbers, geometry and cultural authenticity are not validated. The procedural SVG remains the authoritative drawing.' });
      } catch {
        return reply({ error: controller.signal.aborted ? 'Request cancelled or timed out.' : providerStarted ? 'The image provider response could not be processed.' : 'The image request could not be processed.' }, controller.signal.aborted ? 408 : 502);
      } finally { clearTimeout(timer); request.signal.removeEventListener('abort', abort); inFlight = false; }
    },
  };
}
