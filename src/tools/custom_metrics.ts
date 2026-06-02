/**
 * Auto-generated VTurb Analytics tools — custom_metrics.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_custom_metrics_list(server: McpServer): void {
  server.registerTool(
    "vturb_custom_metrics_list",
    {
      description: "List all custom metrics of a player\n\nPOST /custom_metrics/list\n\nReturns a list of all custom metrics of a player and the calculated engagement rate for them\n\nArgs:\n  - `player_id` (required): The player being analysed.\n  - `end_date` (optional): End date of the period for event querying. [Format: date-time]\n  - `start_date` (optional): Start date of the period for event querying. [Format: date-time]\n  - `timezone` (optional): The timezone to use for the date filtering, if not provided UTC will be used",
      inputSchema: {
    "player_id": z.string().describe("The player being analysed."),
    "end_date": z.string().optional().describe("End date of the period for event querying."),
    "start_date": z.string().optional().describe("Start date of the period for event querying."),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering, if not provided UTC will be used"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/custom_metrics/list", args as Record<string, unknown>);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        const e = err as { message?: string; status?: number; details?: unknown };
        return {
          isError: true,
          content: [{ type: "text", text: `VTurb error (${e.status ?? 0}): ${e.message ?? String(err)}` }],
        };
      }
    },
  );
}
