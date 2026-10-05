// Sites-only adapter. Deploy behind Sites dispatch, which authenticates OAuth and
// overwrites these identity headers. Never deploy this adapter on an untrusted proxy.
// The private Site access policy is an additional, platform-enforced owner boundary.
import { createHttpHandler } from './http-handler.mjs';

const reply = (message, status = 200) => new Response(JSON.stringify(message), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.protocol !== 'https:') return reply({ error: 'HTTPS required' }, 403);
    if (url.pathname === '/' && request.method === 'GET') return reply({
      name: 'Astrologer’s Workbench MCP',
      endpoint: '/mcp',
      authentication: 'Private Sites OAuth; connect the provisioned plugin.',
      frontend: 'https://occult-kranti.github.io/astrology-sim-ant/pages/studio.html',
      privacy: 'Stateless calculations. No saved inputs, accounts, telemetry or outbound requests.',
    });
    if (url.pathname !== '/mcp') return reply({ error: 'Not found' }, 404);
    if (request.method !== 'POST') return reply({ error: 'Use MCP Streamable HTTP POST' }, 405);
    if (!request.headers.get('oai-authenticated-user-id')?.trim() ||
        !request.headers.get('oai-authenticated-user-email')?.trim()) {
      return reply({ error: 'Authenticated Sites user required. Connect the provisioned plugin.' }, 401);
    }
    // Generic host/body/origin guards are reused; identity is enforced above and
    // never echoed, persisted or used as a substitute for platform authorization.
    const handler = createHttpHandler({ hostname: url.hostname, origin: url.origin });
    try {
      const response = await handler.fetch(request);
      // Legacy MCP clients use SSE even with JSON response mode. Consume the
      // bounded, terminal response before closing the per-request SDK handler.
      return new Response(await response.arrayBuffer(), { status: response.status, headers: response.headers });
    } finally {
      await handler.close();
    }
  },
};
