import { McpServer, createMcpHandler, fromJsonSchema } from '@modelcontextprotocol/server';
import { TOOLS, METHODS, callTool } from './toolkit.mjs';

export function createServer() {
  const server = new McpServer({ name: 'astrologers-workbench', version: '1.0.0' });
  for (const tool of TOOLS) server.registerTool(tool.name, {
    description: tool.description,
    inputSchema: fromJsonSchema(tool.inputSchema),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async args => {
    try {
      const result = callTool(tool.name, args);
      return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: `${error.name}: ${error.message}` }] };
    }
  });
  server.registerResource('calculation-methods', 'workbench://methods', { title: 'Methods, sources and limits', mimeType: 'application/json' }, async uri => ({
    contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(METHODS) }],
  }));
  return server;
}
export const createHandler = () => createMcpHandler(createServer, { responseMode: 'json' });
