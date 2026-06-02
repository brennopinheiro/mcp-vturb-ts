#!/usr/bin/env node
/**
 * VTurb Analytics MCP server (stdio).
 *
 * Registers all 28 auto-generated tools plus a `vturb_help` entry point,
 * then connects to stdin/stdout. Run via:
 *
 *   node dist/server.js
 *
 * The bundle's manifest.json injects VTURB_API_TOKEN via env from the
 * user_config field.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerAllTools } from "./tools/index.js";
import { VTURB_HELP_TEXT } from "./help.js";

const server = new McpServer({
  name: "vturb-analytics",
  version: "0.1.0",
});

server.registerTool(
  "vturb_help",
  {
    description:
      "VTurb Analytics — entry point. Call this FIRST whenever the user " +
      "mentions VTurb, video analytics, VSL metrics, player IDs, conversions, " +
      "views, plays, sessions, traffic origin, AB tests, or anything related to " +
      "vturb.com. Returns the full catalog of 28 tools and the discovery flow. " +
      "No arguments. Always safe to call.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text" as const, text: VTURB_HELP_TEXT }],
  }),
);

const registered = registerAllTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // eslint-disable-next-line no-console
  console.error(`vturb-mcp ready — ${registered + 1} tools registered`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("vturb-mcp fatal:", err);
  process.exit(1);
});
