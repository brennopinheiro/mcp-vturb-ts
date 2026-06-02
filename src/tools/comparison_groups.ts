/**
 * Auto-generated VTurb Analytics tools — comparison_groups.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_comparison_groups_list(server: McpServer): void {
  server.registerTool(
    "vturb_comparison_groups_list",
    {
      description: "List the AB tests (comparison groups) registered for the authenticated company\n\nPOST /comparison_groups/list\n\nReturns every AB test registered for the company, with the players enrolled in each test (including their traffic percentages) and the test start/finish timestamps. Results are ordered by creation date (newest first). Use the optional `start_date`/`end_date` filters to narrow results by the comparison group `created_at`.\n\nArgs:\n  - `end_date` (optional): Upper bound applied to the comparison group `created_at`. Format `YYYY-MM-DD HH:MM:SS`. Optional — when omitted, no upper bound is applied. [Format: date-time]\n  - `start_date` (optional): Lower bound applied to the comparison group `created_at`. Format `YYYY-MM-DD HH:MM:SS`. Optional. [Format: date-time]\n  - `timezone` (optional): Timezone used to interpret `start_date`/`end_date`. Defaults to `Etc/UTC`.",
      inputSchema: {
    "end_date": z.string().optional().describe("Upper bound applied to the comparison group `created_at`. Format `YYYY-MM-DD HH:MM:SS`. Optional — when omitted, no upper bound is applied."),
    "start_date": z.string().optional().describe("Lower bound applied to the comparison group `created_at`. Format `YYYY-MM-DD HH:MM:SS`. Optional."),
    "timezone": z.string().optional().describe("Timezone used to interpret `start_date`/`end_date`. Defaults to `Etc/UTC`."),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/comparison_groups/list", args as Record<string, unknown>);
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

export function register_vturb_comparison_groups_stats(server: McpServer): void {
  server.registerTool(
    "vturb_comparison_groups_stats",
    {
      description: "Returns the full analytics metrics for up to 2 players of an AB test\n\nPOST /comparison_groups/stats\n\nReturns, in a single response, the full set of analytics metrics for up to 2 players of an AB test: views, plays, finishes, clicks, conversions with revenue in USD/BRL/EUR, engagement, pitch audience and pitch retention, as well as the derived play rate, conversion rate and revenue per visitor (RPV). Each item's `start_date` is optional — when omitted, it falls back to the player's own `started_at` (from the comparison group's `players` list) and, if that is not set, to the comparison group's `started_at`. When `end_date` is omitted, results run through the current time.\n\nArgs:\n  - `comparison_group_id` (required): The AB test (comparison group) id.\n  - `items` (required): Up to 2 players to return stats for. Players not enrolled in the AB test are silently ignored.\n  - `events` (optional): Event names for the `views`/`plays`/`finishes` aggregates. Defaults to `[\"started\", \"viewed\", \"finished\"]`.\n  - `timezone` (optional): Timezone used by ClickHouse to interpret every `start_date` / `end_date` string in this request (both caller-provided and the defaults resolved from the comparison group). Defaults to `Etc/UTC`.",
      inputSchema: {
    "comparison_group_id": z.string().describe("The AB test (comparison group) id."),
    "items": z.array(z.record(z.unknown())).describe("Up to 2 players to return stats for. Players not enrolled in the AB test are silently ignored."),
    "events": z.array(z.string()).optional().describe("Event names for the `views`/`plays`/`finishes` aggregates. Defaults to `[\"started\", \"viewed\", \"finished\"]`."),
    "timezone": z.string().optional().describe("Timezone used by ClickHouse to interpret every `start_date` / `end_date` string in this request (both caller-provided and the defaults resolved from the comparison group). Defaults to `Etc/UTC`."),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/comparison_groups/stats", args as Record<string, unknown>);
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
