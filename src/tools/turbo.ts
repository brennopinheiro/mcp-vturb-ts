/**
 * Auto-generated VTurb Analytics tools — turbo.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_turbo_stats_by_player(server: McpServer): void {
  server.registerTool(
    "vturb_turbo_stats_by_player",
    {
      description: "Statistics used by the turbo dashboard\n\nPOST /turbo/stats_by_player\n\nReturns several statistics used by the turbo dashboard.\nSpeed, engagement, views, pitch and clicks are among these metrics\n\nArgs:\n  - `pitch_time` (required): The time in seconds that the video must be watched to be considered a pitch\n  - `player_id` (required): The player being analysed.\n  - `start_date` (required): Start date of the period for event querying. [Format: date]\n  - `video_duration` (required): The duration of the video\n  - `end_date` (optional): End date of the period for event querying. Optional — when omitted, the response is unbounded at the upper end. When provided, inclusive at the end of the minute (e.g. `23:59:59` captures the full minute). [Format: date]",
      inputSchema: {
    "pitch_time": z.number().int().describe("The time in seconds that the video must be watched to be considered a pitch"),
    "player_id": z.string().describe("The player being analysed."),
    "start_date": z.string().describe("Start date of the period for event querying."),
    "video_duration": z.number().int().describe("The duration of the video"),
    "end_date": z.string().optional().describe("End date of the period for event querying. Optional — when omitted, the response is unbounded at the upper end. When provided, inclusive at the end of the minute (e.g. `23:59:59` captures the full minute)."),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/turbo/stats_by_player", args as Record<string, unknown>);
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
