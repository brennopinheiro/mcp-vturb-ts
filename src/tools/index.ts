/** Auto-generated tools index. Regenerate with: npm run generate */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import * as clicks from "./clicks.js";
import * as comparison_groups from "./comparison_groups.js";
import * as conversions from "./conversions.js";
import * as custom_metrics from "./custom_metrics.js";
import * as events from "./events.js";
import * as headlines from "./headlines.js";
import * as players from "./players.js";
import * as quota from "./quota.js";
import * as sessions from "./sessions.js";
import * as times from "./times.js";
import * as traffic_origin from "./traffic_origin.js";
import * as turbo from "./turbo.js";

export function registerAllTools(server: McpServer): number {
  let n = 0;
  clicks.register_vturb_clicks_total_by_company_day(server); n++;
  clicks.register_vturb_clicks_total_by_company_timed(server); n++;
  comparison_groups.register_vturb_comparison_groups_list(server); n++;
  comparison_groups.register_vturb_comparison_groups_stats(server); n++;
  conversions.register_vturb_conversions_active_platforms(server); n++;
  conversions.register_vturb_conversions_stats_by_day(server); n++;
  conversions.register_vturb_conversions_video_timed(server); n++;
  custom_metrics.register_vturb_custom_metrics_list(server); n++;
  events.register_vturb_events_leaderboard(server); n++;
  events.register_vturb_events_total_by_company(server); n++;
  events.register_vturb_events_total_by_company_day(server); n++;
  events.register_vturb_events_total_by_company_players(server); n++;
  headlines.register_vturb_headlines_stats_by_player(server); n++;
  players.register_vturb_players_list(server); n++;
  quota.register_vturb_quota_usage(server); n++;
  sessions.register_vturb_sessions_live_users(server); n++;
  sessions.register_vturb_sessions_stats(server); n++;
  sessions.register_vturb_sessions_stats_by_day(server); n++;
  sessions.register_vturb_sessions_stats_by_field(server); n++;
  sessions.register_vturb_sessions_stats_by_field_by_day(server); n++;
  times.register_vturb_times_user_engagement(server); n++;
  times.register_vturb_times_user_engagement_by_day(server); n++;
  times.register_vturb_times_user_engagement_by_field(server); n++;
  times.register_vturb_times_user_engagement_by_traffic_origin(server); n++;
  traffic_origin.register_vturb_traffic_origin_stats(server); n++;
  traffic_origin.register_vturb_traffic_origin_stats_by_day(server); n++;
  traffic_origin.register_vturb_traffic_origin_valid_utms(server); n++;
  turbo.register_vturb_turbo_stats_by_player(server); n++;
  return n;
}
