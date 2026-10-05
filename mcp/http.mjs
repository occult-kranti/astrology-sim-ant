#!/usr/bin/env node
import { createServer } from 'node:http';
import { toNodeHandler, localhostHostValidation, localhostOriginValidation } from '@modelcontextprotocol/node';
import { createHttpHandler } from './http-handler.mjs';
const port = Number(process.env.MCP_PORT || 3001);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new RangeError('MCP_PORT must be 1024–65535.');
const handler = createHttpHandler();
const nodeHandler = toNodeHandler(handler);
const validHost = localhostHostValidation(), validOrigin = localhostOriginValidation();
const server = createServer((req, res) => {
  if (!validHost(req, res) || !validOrigin(req, res)) return;
  void nodeHandler(req, res);
});
server.requestTimeout = 15000; server.headersTimeout = 10000;
server.listen(port, '127.0.0.1', () => console.error(`Workbench MCP: http://127.0.0.1:${port}/mcp (loopback only)`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { server.close(); await handler.close(); });
