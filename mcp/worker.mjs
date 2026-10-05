// Optional fetch-runtime entry. Host secrets belong in the deployment environment,
// never in this repository or GitHub Pages. No deployment is implied by this file.
import { createHttpHandler } from './http-handler.mjs';
export default {
  async fetch(request, env) {
    if (!env.MCP_HOSTNAME || !env.MCP_ACCESS_TOKEN) return new Response('MCP host is not configured', { status: 503 });
    const handler = createHttpHandler({ hostname: env.MCP_HOSTNAME, token: env.MCP_ACCESS_TOKEN, remote: true });
    try { return await handler.fetch(request); } finally { await handler.close(); }
  },
};
