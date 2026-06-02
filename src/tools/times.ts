/**
 * Auto-generated VTurb Analytics tools — times.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_times_user_engagement(server: McpServer): void {
  server.registerTool(
    "vturb_times_user_engagement",
    {
      description: "Returns the total of users that reached a certain second of the video entire duration\n\nPOST /times/user_engagement\n\nReturns an object containing the overall engagement of the users in a given period for the specified player.\n\nArgs:\n  - `player_id` (required): The ID of the player to search for\n  - `video_duration` (required): The total duration of the video in seconds\n  - `end_date` (optional): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `start_date` (optional): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "player_id": z.string().describe("The ID of the player to search for"),
    "video_duration": z.number().int().describe("The total duration of the video in seconds"),
    "end_date": z.string().optional().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "start_date": z.string().optional().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/times/user_engagement", args as Record<string, unknown>);
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

export function register_vturb_times_user_engagement_by_day(server: McpServer): void {
  server.registerTool(
    "vturb_times_user_engagement_by_day",
    {
      description: "Returns an array with the engagement rate per day\n\nPOST /times/user_engagement_by_day\n\nReturns an array containing the overall engagement of the users in a given period for the specified player per day.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `player_id` (required): The ID of the player to search for\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `video_duration` (required): The total duration of the video in seconds\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "player_id": z.string().describe("The ID of the player to search for"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "video_duration": z.number().int().describe("The total duration of the video in seconds"),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/times/user_engagement_by_day", args as Record<string, unknown>);
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

export function register_vturb_times_user_engagement_by_field(server: McpServer): void {
  server.registerTool(
    "vturb_times_user_engagement_by_field",
    {
      description: "Returns an array with the engagement grouped by a field\n\nPOST /times/user_engagement_by_field\n\nReturns an array containing the overall engagement of the users in a given period for the specified player per day.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `field` (required): The field to group the engagement by, possible values are 'country', 'browser', 'device_type', 'utm_campain', 'utm_source', 'utm_medium', 'utm_content', 'utm_term' If 'no_attribution' is passed, all values that have been set to null or that are empty strings will be returned.\n  - `player_id` (required): The ID of the player to search for\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `values` (required): The values to filter the field by, for example ['Brazil', 'Romenia'] or ['Chrome', 'Firefox']\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "field": z.string().describe("The field to group the engagement by, possible values are 'country', 'browser', 'device_type', 'utm_campain', 'utm_source', 'utm_medium', 'utm_content', 'utm_term' If 'no_attribution' is passed, all values that have been set to null or that are empty strings will be returned."),
    "player_id": z.string().describe("The ID of the player to search for"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "values": z.array(z.string()).describe("The values to filter the field by, for example ['Brazil', 'Romenia'] or ['Chrome', 'Firefox']"),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/times/user_engagement_by_field", args as Record<string, unknown>);
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

export function register_vturb_times_user_engagement_by_traffic_origin(server: McpServer): void {
  server.registerTool(
    "vturb_times_user_engagement_by_traffic_origin",
    {
      description: "Returns an array with the engagement grouped by a field\n\nPOST /times/user_engagement_by_traffic_origin\n\nReturns an array containing the overall engagement of the users in a given period for the specified player per day.\n\nArgs:\n  - `end_date` (required): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `player_id` (required): The ID of the player to search for\n  - `query_key` (required): The query param key to group the engagement by, possible values example: 'utm_campain', 'utm_source', 'utm_medium', 'utm_content', 'utm_term'\n  - `start_date` (required): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `values` (required): The values to filter the query key parameter by, for example ['Facebook', 'Google', 'Campaign 1', 'Campaign 2']\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "player_id": z.string().describe("The ID of the player to search for"),
    "query_key": z.string().describe("The query param key to group the engagement by, possible values example: 'utm_campain', 'utm_source', 'utm_medium', 'utm_content', 'utm_term'"),
    "start_date": z.string().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "values": z.array(z.string()).describe("The values to filter the query key parameter by, for example ['Facebook', 'Google', 'Campaign 1', 'Campaign 2']"),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/times/user_engagement_by_traffic_origin", args as Record<string, unknown>);
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
