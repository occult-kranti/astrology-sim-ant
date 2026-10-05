// Static discovery/help data only. GitHub Pages cannot serve the MCP POST transport.
import { readFileSync, writeFileSync } from 'node:fs';
import { TOOLS } from '../mcp/toolkit.mjs';
const catalogue = {
  schemaVersion: 1,
  generatedFrom: 'mcp/toolkit.mjs',
  transport: 'streamable-http',
  endpoint: 'https://astrologers-workbench-mcp.whatswrong-inc.chatgpt.site/mcp',
  authentication: 'Private Sites OAuth; use the provisioned Astrologer’s Workbench MCP plugin.',
  staticPageIsMcpServer: false,
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
};
const target = new URL('../assets/data/mcp-catalogue.json', import.meta.url);
const content = JSON.stringify(catalogue, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== content) throw new Error('Static MCP catalogue is stale. Run node scripts/build-mcp-catalogue.mjs.');
} else writeFileSync(target, content);
console.log(`Generated static connection catalogue: ${catalogue.tools.length} tools.`);
