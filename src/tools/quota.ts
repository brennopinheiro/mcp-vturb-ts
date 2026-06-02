/**
 * Auto-generated VTurb Analytics tools — quota.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_quota_usage(server: McpServer): void {
  server.registerTool(
    "vturb_quota_usage",
    {
      description: "Returns the live API quota usage for the authenticated company\n\nGET /quota/usage\n\nReturns the current usage and limits for your API key — one entry per quota window (typically a per-minute and a per-day bucket). Use this endpoint to self-rate-limit before issuing expensive analytics requests.\n\nNotes:\n- When a metric has no cap, the response returns `limit: null` and\n  `remaining: null` so you don't divide by zero.\n\n- A single API request may count as more than one query against\n  `max_queries_per_minute`, so the `queries` counter can climb faster\n  than your request rate. The response includes `queries.note` to flag\n  this when a hard limit applies. `read_bytes` reflects the actual\n  data scanned and is the more reliable signal for sizing usage.\n\n- This endpoint itself counts as 1 query against `max_queries_per_minute`.",
      inputSchema: {

      },
    },
    async (args) => {
      try {
        const result = await vturbGet("/quota/usage", args as Record<string, unknown>);
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
