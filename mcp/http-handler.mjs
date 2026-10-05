import { createHandler } from './server.mjs';
import { METHODS } from './toolkit.mjs';

// Web-standard adapter; the official SDK owns MCP protocol negotiation and messages.
// The Node launcher binds loopback. A remote deployment MUST supply an access token,
// an exact allowed hostname and HTTPS at its trusted reverse proxy. This is not OAuth.
export function createHttpHandler({ hostname = '127.0.0.1', origin = null, token = null, remote = false } = {}) {
  if (remote && (!token || token.length < 32 || !hostname || ['localhost', '127.0.0.1'].includes(hostname))) throw new Error('Remote MCP needs a hostname and a secret access token of at least 32 characters.');
  const mcp = createHandler();
  const deny = (message, status) => new Response(message, { status, headers: { 'Cache-Control': 'no-store' } });
  return {
    close: () => mcp.close(),
    async fetch(request) {
      const url = new URL(request.url);
      if (url.hostname !== hostname || (remote && url.protocol !== 'https:')) return deny('Untrusted host or transport', 403);
      if (url.pathname !== '/mcp') return deny('Not found', 404);
      const suppliedOrigin = request.headers.get('Origin');
      if (suppliedOrigin && suppliedOrigin !== (origin || url.origin)) return deny('Untrusted origin', 403);
      if (token && request.headers.get('Authorization') !== `Bearer ${token}`) return deny('Authentication required', 401);
      if (request.method !== 'POST') return deny('This stateless endpoint accepts POST only', 405);
      if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return deny('JSON required', 415);
      const chunks = []; let bytes = 0;
      const reader = request.body?.getReader();
      if (!reader) return deny('JSON required', 400);
      let readTimer, rejectRead;
      const interrupted = new Promise((_, reject) => { rejectRead = reject; });
      const abortRead = () => rejectRead(new Error('Request aborted'));
      const timeoutRead = () => rejectRead(new Error('Request body timed out'));
      if (request.signal.aborted) { void reader.cancel().catch(() => {}); reader.releaseLock(); return deny('Request aborted', 408); }
      request.signal.addEventListener('abort', abortRead, { once: true });
      readTimer = setTimeout(timeoutRead, 10000);
      try {
        while (true) {
          const { value, done } = await Promise.race([reader.read(), interrupted]);
          if (done) break;
          bytes += value.byteLength;
          if (bytes > METHODS.limits.inputBytes) { void reader.cancel().catch(() => {}); return deny('Request too large', 413); }
          chunks.push(value);
        }
      } catch {
        void reader.cancel().catch(() => {});
        return deny('Request body timed out or was aborted', 408);
      } finally {
        clearTimeout(readTimer); request.signal.removeEventListener('abort', abortRead); reader.releaseLock();
      }
      const body = new Uint8Array(bytes); let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
      let parsed;
      try { parsed = JSON.parse(new TextDecoder().decode(body)); } catch { return deny('Invalid JSON', 400); }
      if (Array.isArray(parsed)) return deny('Batch requests are unsupported', 400);
      const response = await mcp.fetch(new Request(request.url, { method: 'POST', headers: request.headers, body, signal: request.signal }));
      const headers = new Headers(response.headers); headers.set('Cache-Control', 'no-store');
      return new Response(response.body, { status: response.status, headers });
    },
  };
}
