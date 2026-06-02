/**
 * Auto-generated VTurb Analytics tools — players.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

export function register_vturb_players_list(server: McpServer): void {
  server.registerTool(
    "vturb_players_list",
    {
      description: "List all players\n\nGET /players/list\n\nReturns a list of all players belonging to the authenticated user's company\n\nArgs:\n  - `end_date` (optional): End date of the period for player filtering. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `name` (optional): Filter players by name. Search is case-insensitive (including non-ASCII characters such as `É`/`é`). Special characters `%`, `_`, `\\`, and brackets are matched literally — for example `name=[campaign_1]` returns only players whose names contain that exact tag. Surrounding whitespace is trimmed before matching; the trimmed value must be between 3 and 128 characters.\n  - `name_match` (optional): How `name` is matched. `contains` (default) matches anywhere in the name; `starts_with` and `ends_with` anchor to the beginning or end; `exact` requires a full case-insensitive match. Sending `name_match` without `name` returns 400. [Values: contains, starts_with, ends_with, exact; Default: contains]\n  - `start_date` (optional): Start date of the period for player filtering. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\" [Format: date]\n  - `timezone` (optional): The timezone to use for the date filtering",
      inputSchema: {
    "end_date": z.string().optional().describe("End date of the period for player filtering. This will be used as <=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "name": z.string().optional().describe("Filter players by name. Search is case-insensitive (including non-ASCII characters such as `É`/`é`). Special characters `%`, `_`, `\\`, and brackets are matched literally — for example `name=[campaign_1]` returns only players whose names contain that exact tag. Surrounding whitespace is trimmed before matching; the trimmed value must be between 3 and 128 characters."),
    "name_match": z.enum(["contains", "starts_with", "ends_with", "exact"] as const).optional().describe("How `name` is matched. `contains` (default) matches anywhere in the name; `starts_with` and `ends_with` anchor to the beginning or end; `exact` requires a full case-insensitive match. Sending `name_match` without `name` returns 400."),
    "start_date": z.string().optional().describe("Start date of the period for player filtering. This will be used as >=. Format examples \"2023-10-26T18:24:05.000+00:00\" or \"2023-10-26 18:24:05 UTC\""),
    "timezone": z.string().optional().describe("The timezone to use for the date filtering"),
      },
    },
    async (args) => {
      try {
        const result = await vturbGet("/players/list", args as Record<string, unknown>);
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
