/**
 * Auto-generated VTurb Analytics tools — clicks.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_clicks_total_by_company_day(server: McpServer): void {
  server.registerTool(
    "vturb_clicks_total_by_company_day",
    {
      description: "Returns the totals of clicks for each day in a company and player\n\nPOST /clicks/total_by_company_day\n\nReturns a list with the company clicks grouped by day in a given period.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `player_id` (required): The ID of the player to search for\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "player_id": z.string().describe("The ID of the player to search for"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/clicks/total_by_company_day", args as Record<string, unknown>);
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

export function register_vturb_clicks_total_by_company_timed(server: McpServer): void {
  server.registerTool(
    "vturb_clicks_total_by_company_timed",
    {
      description: "Returns the total of user clicks at a time in seconds related to the video\n\nPOST /clicks/total_by_company_timed\n\nReturns an object containing the all the clicks grouped by the time in seconds it happened related to the video.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `player_id` (required): The ID of the player to search for\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "player_id": z.string().describe("The ID of the player to search for"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/clicks/total_by_company_timed", args as Record<string, unknown>);
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
