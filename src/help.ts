export const VTURB_HELP_TEXT = `VTurb Analytics MCP — local wrapper around analytics.vturb.net (28 endpoints).

All tools are named with the \`vturb_\` prefix. Call any of them directly — no
discovery dance, no Code Mode. The OpenAPI spec is vendored so every tool
includes typed parameters with required/format/enum hints.

CATEGORIES (each tool name follows the pattern \`vturb_<category>_<rest>\`):

  • clicks            — total clicks by company/day, by video timed
  • comparison_groups — list AB tests and stats (up to 2 players each)
  • conversions       — active platforms, stats by day, video timed (per second)
  • custom_metrics    — list custom metrics of a player
  • events            — leaderboard, totals by company/day/players
  • headlines         — stats by player (headlines dashboard)
  • players           — list players with optional name search
  • quota             — current API quota (self rate-limit check; call this
                        before heavy queries)
  • sessions          — stats, by day, by field, by field+day, live users
  • times             — user engagement by second/day/field/traffic origin
  • traffic_origin    — stats, by day, valid UTMs
  • turbo             — stats by player (turbo dashboard)

DATE FORMAT for all tools: "YYYY-MM-DD" or "YYYY-MM-DD HH:MM:SS".
DEFAULT TIMEZONE: UTC server-side. Pass timezone="America/Sao_Paulo" for BR.

RATE LIMITS: 60/120/300/800 req/min depending on the user's VTurb plan. Use
\`vturb_quota_usage\` to check before bursting requests.
`;
