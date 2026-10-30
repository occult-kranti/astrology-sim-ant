// Calculator adapters remain an explicit reviewed allowlist. A registry entry
// or exported function never becomes remotely callable by discovery alone.
import { CHART_MCP_TOOLS } from './chart-adapters.mjs';
import { CALENDAR_MCP_TOOLS } from './calendar-adapters.mjs';
import { ORACLE_MCP_TOOLS } from './oracle-adapters.mjs';
import { OBSERVATORY_MCP_TOOLS } from './observatory-adapters.mjs';
import { STUDY_MCP_TOOLS } from './study-adapters.mjs';

export const EXTENDED_MCP_TOOLS = [
  ...CHART_MCP_TOOLS,
  ...CALENDAR_MCP_TOOLS,
  ...ORACLE_MCP_TOOLS,
  ...OBSERVATORY_MCP_TOOLS,
  ...STUDY_MCP_TOOLS,
];
if (new Set(EXTENDED_MCP_TOOLS.map(tool => tool.name)).size !== EXTENDED_MCP_TOOLS.length) {
  throw new Error('Duplicate extended MCP tool identity.');
}
