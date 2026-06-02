/**
 * Auto-generated VTurb Analytics tools — events.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_events_leaderboard(server: McpServer): void {
  server.registerTool(
    "vturb_events_leaderboard",
    {
      description: "Returns player leaderboards based on video engagement metrics\n\nPOST /events/leaderboard\n\nProvides leaderboard rankings of players based on their video engagement metrics (views, plays, pauses, etc...) within specified time periods. Multiple leaderboards with different player limits can be requested in a single call.\n\nArgs:\n  - `company_id` (required): The ID of the company to search for\n  - `leaderboards` (required): \n  - `timezone` (optional): The timezone to use for date calculations (defaults to 'Etc/UCT' if not provided)",
      inputSchema: {
    "company_id": z.string().describe("The ID of the company to search for"),
    "leaderboards": z.array(z.record(z.unknown())),
    "timezone": z.string().optional().describe("The timezone to use for date calculations (defaults to 'Etc/UCT' if not provided)"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/events/leaderboard", args as Record<string, unknown>);
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

export function register_vturb_events_total_by_company(server: McpServer): void {
  server.registerTool(
    "vturb_events_total_by_company",
    {
      description: "Returns the number of times the events happened as well as the count considering unique device and sessions\n\nPOST /events/total_by_company\n\nReturns a list with the companies and events with the number of times the event happened in a given period.\n\nArgs:\n  - `events` (required): Names of the events to filter by. Can be ['started', 'finished', 'viewed']\n  - `end_date` (optional): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `player_id` (optional): The ID of the player to filter the results by.\n  - `start_date` (optional): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]",
      inputSchema: {
    "events": z.array(z.string()).describe("Names of the events to filter by. Can be ['started', 'finished', 'viewed']"),
    "end_date": z.string().optional().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "player_id": z.string().optional().describe("The ID of the player to filter the results by."),
    "start_date": z.string().optional().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/events/total_by_company", args as Record<string, unknown>);
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

export function register_vturb_events_total_by_company_day(server: McpServer): void {
  server.registerTool(
    "vturb_events_total_by_company_day",
    {
      description: "Returns the totals of the events for each day in a company\n\nPOST /events/total_by_company_day\n\nReturns a list with the companies grouped by day and the number of times each event happened for each day in a given period.\n\nArgs:\n  - `events` (required): Names of the events to filter by. Can be ['started', 'finished', 'viewed']\n  - `player_id` (required): The ID of the player to search for\n  - `end_date` (optional): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `start_date` (optional): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "events": z.array(z.string()).describe("Names of the events to filter by. Can be ['started', 'finished', 'viewed']"),
    "player_id": z.string().describe("The ID of the player to search for"),
    "end_date": z.string().optional().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "start_date": z.string().optional().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/events/total_by_company_day", args as Record<string, unknown>);
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

export function register_vturb_events_total_by_company_players(server: McpServer): void {
  server.registerTool(
    "vturb_events_total_by_company_players",
    {
      description: "Returns the totals of the events for each player in a company\n\nPOST /events/total_by_company_players\n\nReturns a list with the companies grouped by its players and the number of times each event happened for each one in a given period.\n\nArgs:\n  - `events` (required): Names of the events to filter by. Can be ['started', 'finished', 'viewed']\n  - `end_date` (optional): End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]\n  - `players_start_date` (optional): \n  - `start_date` (optional): Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\" [Format: date]",
      inputSchema: {
    "events": z.array(z.string()).describe("Names of the events to filter by. Can be ['started', 'finished', 'viewed']"),
    "end_date": z.string().optional().describe("End date of the period for event querying. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
    "players_start_date": z.array(z.record(z.unknown())).optional(),
    "start_date": z.string().optional().describe("Start date of the period for event querying. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" or \"2023-10-26\""),
      },
    },
    async (args) => {
      try {
        const result = await vturbPost("/events/total_by_company_players", args as Record<string, unknown>);
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
