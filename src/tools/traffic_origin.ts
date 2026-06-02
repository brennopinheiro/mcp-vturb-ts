/**
 * Auto-generated VTurb Analytics tools — traffic_origin.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_traffic_origin_stats(server: McpServer): void {
  server.registerTool(
    "vturb_traffic_origin_stats",
    {
      description: "Returns statistics grouped by a specified field\n\nPOST /traffic_origin/stats\n\nReturns statistics for traffic origin grouped by a specified query key for a given company and player within a date range.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `player_id` (required): The ID of the player to search for\n  - `query_key` (required): The query key to group the statistics by\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `video_duration` (required): The total duration of the video in seconds\n  - `pitch_time` (optional): The time in seconds that the video must be watched to be considered a pitch\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "player_id": z.string().describe("The ID of the player to search for"),
    "query_key": z.string().describe("The query key to group the statistics by"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "video_duration": z.number().int().describe("The total duration of the video in seconds"),
    "pitch_time": z.number().int().optional().describe("The time in seconds that the video must be watched to be considered a pitch"),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/traffic_origin/stats", args as Record<string, unknown>);
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

export function register_vturb_traffic_origin_stats_by_day(server: McpServer): void {
  server.registerTool(
    "vturb_traffic_origin_stats_by_day",
    {
      description: "Returns statistics grouped by a specified field and day\n\nPOST /traffic_origin/stats_by_day\n\nReturns statistics for traffic origin grouped by a specified query key for a given company and player within a date range and grouped by day.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `player_id` (required): The ID of the player to search for\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `video_duration` (required): The total duration of the video in seconds\n  - `pitch_time` (optional): The time in seconds that the video must be watched to be considered a pitch\n  - `query_keys` (optional): The query keys to group the statistics by\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "player_id": z.string().describe("The ID of the player to search for"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "video_duration": z.number().int().describe("The total duration of the video in seconds"),
    "pitch_time": z.number().int().optional().describe("The time in seconds that the video must be watched to be considered a pitch"),
    "query_keys": z.array(z.string()).optional().describe("The query keys to group the statistics by"),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/traffic_origin/stats_by_day", args as Record<string, unknown>);
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

export function register_vturb_traffic_origin_valid_utms(server: McpServer): void {
  server.registerTool(
    "vturb_traffic_origin_valid_utms",
    {
      description: "Counts the utms of the given player\n\nPOST /traffic_origin/valid_utms\n\nCounts the utms of the given player. The values are src, sck, utm_source, utm_medium, utm_campaign, utm_term, utm_content, among any other valid query parameter\n\nArgs:\n  - `player_id` (required): The player being analysed.\n  - `start_date` (required): Start date of the period for event querying. [Format: date]\n  - `end_date` (optional): Start date of the period for event querying. [Format: date]",
      inputSchema: {
    "player_id": z.string().describe("The player being analysed."),
    "start_date": z.string().describe("Start date of the period for event querying."),
    "end_date": z.string().optional().describe("Start date of the period for event querying."),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/traffic_origin/valid_utms", args as Record<string, unknown>);
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
