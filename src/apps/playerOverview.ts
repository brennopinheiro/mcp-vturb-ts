/**
 * vturb_player_overview — Prefab-style dashboard for a single player.
 *
 * Registers:
 *   - The static HTML resource at `ui://vturb/dashboard.html`
 *   - The tool itself with `_meta.ui.resourceUri` pointing at that resource
 *     and `structuredContent` carrying the per-call data
 *
 * Claude Desktop fetches the resource (renderer) once, then on each call
 * passes our `structuredContent` into the iframe — our inline JS picks it up
 * from `window.structuredContent` and draws the panel.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost, VturbError } from "../client.js";
import { DASHBOARD_HTML, DASHBOARD_URI, UI_MIME } from "./dashboard-html.js";

type Maybe<T> = T | null | undefined;

function num(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function get(obj: unknown, ...path: string[]): unknown {
  let cur: unknown = obj;
  for (const k of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
}

async function safe<T>(p: Promise<T>): Promise<T | { _error: string }> {
  try {
    return await p;
  } catch (err) {
    const e = err as VturbError;
    return { _error: `${e.status ?? 0}: ${e.message ?? String(err)}` };
  }
}

function isError(x: unknown): x is { _error: string } {
  return (
    !!x && typeof x === "object" && "_error" in (x as Record<string, unknown>)
  );
}

export function registerPlayerOverview(server: McpServer): void {
  // 1. Register the static HTML renderer at ui://vturb/dashboard.html
  server.registerResource(
    "vturb_dashboard",
    DASHBOARD_URI,
    {
      title: "VTurb Dashboard Renderer",
      description:
        "Self-contained HTML template for the player_overview dashboard.",
      mimeType: UI_MIME,
    },
    async () => ({
      contents: [
        {
          uri: DASHBOARD_URI,
          mimeType: UI_MIME,
          text: DASHBOARD_HTML,
        },
      ],
    }),
  );

  // 2. Register the tool with _meta.ui pointing at the renderer
  server.registerTool(
    "vturb_player_overview",
    {
      description:
        "VTurb Player Overview — visual dashboard for a single player. " +
        "Renders KPIs (views/plays/finishes/conversions/receita USD+BRL), " +
        "bar chart de conversões por dia, plataformas ativas e quota atual " +
        "da API num painel só dentro da conversa.",
      inputSchema: {
        player_id: z.string().describe("VTurb player ID."),
        start_date: z
          .string()
          .describe(
            "Período de início. Formatos: 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:MM:SS'.",
          ),
        end_date: z.string().describe("Período de fim. Mesmos formatos."),
        timezone: z
          .string()
          .optional()
          .describe("IANA timezone (ex: 'America/Sao_Paulo'). Default: UTC."),
      },
      _meta: {
        "io.modelcontextprotocol/ui": {
          resourceUri: DASHBOARD_URI,
        },
        ui: {
          resourceUri: DASHBOARD_URI,
        },
      },
    },
    async (args) => {
      const { player_id, start_date, end_date, timezone } = args;
      const baseBody: Record<string, unknown> = {
        player_id,
        start_date,
        end_date,
      };
      if (timezone) baseBody.timezone = timezone;

      const [sessions, conversionsDay, activePlatforms, quotaResp] =
        await Promise.all([
          safe(vturbPost("/sessions/stats", { ...baseBody })),
          safe(vturbPost("/conversions/stats_by_day", { ...baseBody })),
          safe(
            vturbPost("/conversions/active_platforms", {
              start_date,
              ...(timezone ? { timezone } : {}),
            }),
          ),
          safe(vturbGet("/quota/usage")),
        ]);

      const errors: string[] = [];
      const collect = (label: string, x: unknown) => {
        if (isError(x)) errors.push(`${label}: ${x._error}`);
      };
      collect("sessions/stats", sessions);
      collect("conversions/stats_by_day", conversionsDay);
      collect("conversions/active_platforms", activePlatforms);
      collect("quota/usage", quotaResp);

      const kpis = {
        views: num(get(sessions, "views", "total")),
        plays: num(get(sessions, "plays", "total")),
        finishes: num(get(sessions, "finishes", "total")),
        conversions: num(get(sessions, "conversions", "total")),
        revenueUsd: num(get(sessions, "conversions", "total_amount_usd")),
        revenueBrl: num(get(sessions, "conversions", "total_amount_brl")),
      };

      const dailyChart: {
        day: string;
        conversions: number;
        revenueUsd: number | null;
      }[] = [];
      const rawDays = isError(conversionsDay) ? null : conversionsDay;
      const rawDaysList: unknown[] = Array.isArray(rawDays)
        ? (rawDays as unknown[])
        : Array.isArray(get(rawDays, "data"))
          ? (get(rawDays, "data") as unknown[])
          : [];
      for (const row of rawDaysList) {
        if (!row || typeof row !== "object") continue;
        const r = row as Record<string, unknown>;
        dailyChart.push({
          day: String(r.day ?? r.date ?? ""),
          conversions: Math.round(num(r.total ?? r.count) ?? 0),
          revenueUsd: num(r.total_amount_usd ?? r.amount_usd),
        });
      }

      const platforms = Array.isArray(activePlatforms)
        ? (activePlatforms as unknown[]).map((p) => String(p))
        : [];

      let quotaOut: {
        queries?: {
          used: number | null;
          limit: number | null;
          remaining: number | null;
        };
        resetsAt?: string;
      } | null = null;
      const quotas = get(quotaResp, "quotas") as Maybe<unknown[]>;
      if (Array.isArray(quotas)) {
        const minute =
          quotas.find((q) => get(q, "interval_seconds") === 60) ?? quotas[0];
        if (minute && typeof minute === "object") {
          quotaOut = {
            queries: {
              used: num(get(minute, "queries", "used")),
              limit: num(get(minute, "queries", "limit")),
              remaining: num(get(minute, "queries", "remaining")),
            },
            resetsAt:
              String(get(minute, "interval_ends_at") ?? "") || undefined,
          };
        }
      }

      const tzLabel = timezone ? ` · ${timezone}` : "";
      const structuredContent = {
        title: "VTurb Player Overview",
        subtitle: `Player ${player_id} · ${start_date} → ${end_date}${tzLabel}`,
        kpis,
        dailyChart,
        platforms,
        quota: quotaOut,
        errors,
      };

      // Plain-text fallback so clients without MCP App UI rendering still see numbers
      const fallback = [
        `VTurb Player Overview — player ${player_id} (${start_date} → ${end_date})`,
        `Views: ${kpis.views ?? "—"} · Plays: ${kpis.plays ?? "—"} · Finishes: ${kpis.finishes ?? "—"} · Conversões: ${kpis.conversions ?? "—"}`,
        `Receita: USD ${kpis.revenueUsd ?? "—"} | BRL ${kpis.revenueBrl ?? "—"}`,
        platforms.length ? `Plataformas: ${platforms.join(", ")}` : "",
        errors.length ? `Avisos: ${errors.join(" | ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      return {
        content: [{ type: "text" as const, text: fallback }],
        structuredContent,
      };
    },
  );
}
