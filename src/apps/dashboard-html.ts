/**
 * Self-contained HTML for the VTurb player_overview dashboard.
 *
 * No external CDN, no third-party JS — vanilla CSS + inline JS that
 * draws an SVG bar chart and reads its data from `window.structuredContent`
 * (the MCP Apps protocol convention) with multiple fallback paths.
 *
 * Hosted at the MCP resource URI `ui://vturb/dashboard.html`. The
 * `vturb_player_overview` tool references this URI in `_meta.ui.resourceUri`
 * and sends the per-call data via `structuredContent` on the tool result.
 */

export const DASHBOARD_URI = "ui://vturb/dashboard.html";
export const UI_MIME = "text/html;profile=mcp-app";

export const DASHBOARD_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VTurb Player Overview</title>
  <style>
    :root {
      --bg: #0d0d0d; --surface: #1a1a1a; --border: #2a2a2a;
      --text: #e8e8e8; --muted: #888; --accent: #ff5a2c; --accent-soft: #f93b50;
    }
    @media (prefers-color-scheme: light) {
      :root { --bg: #fafafa; --surface: #fff; --border: #e5e5e5; --text: #1a1a1a; --muted: #666; }
    }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
           margin: 0; padding: 20px; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.4; }
    .header { margin-bottom: 20px; }
    .header h1 { margin: 0 0 4px; font-size: 18px; font-weight: 600; }
    .header .meta { color: var(--muted); font-size: 12px; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 24px; }
    .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 14px; }
    .kpi .label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
    .kpi .value { font-size: 20px; font-weight: 600; margin-top: 4px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px; }
    .surface { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 14px; }
    .chart svg { display: block; width: 100%; height: auto; }
    .bar { fill: var(--accent); }
    .bar:hover { fill: var(--accent-soft); }
    .axis { fill: var(--muted); font-size: 10px; font-family: inherit; }
    .bar-label { fill: var(--text); font-size: 10px; font-family: inherit; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
    td:last-child { border-bottom: none; }
    tr:last-child td { border-bottom: none; }
    .quota { font-size: 11px; color: var(--muted); margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
    .quota strong { color: var(--text); font-weight: 600; }
    .empty { color: var(--muted); font-size: 13px; padding: 20px; text-align: center; }
    .errors { background: rgba(249, 59, 80, 0.08); border: 1px solid rgba(249, 59, 80, 0.3); border-radius: 6px; padding: 10px; margin-top: 16px; color: var(--accent-soft); font-size: 12px; }
    .errors strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div id="root"><div class="empty">Carregando dados…</div></div>
  <script>
    function readData() {
      if (window.structuredContent && typeof window.structuredContent === 'object') return window.structuredContent;
      if (window.mcpData && typeof window.mcpData === 'object') return window.mcpData;
      var el = document.getElementById('vturb-initial-data');
      if (el && el.textContent) { try { return JSON.parse(el.textContent); } catch (e) {} }
      return null;
    }

    var nfBR = new Intl.NumberFormat('pt-BR');
    var nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    var nfBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    function fmtInt(n) { return (n == null) ? '—' : nfBR.format(Math.round(Number(n) || 0)); }
    function fmtUsd(n) { return (n == null) ? '—' : nfUSD.format(Number(n) || 0); }
    function fmtBrl(n) { return (n == null) ? '—' : nfBRL.format(Number(n) || 0); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

    function buildBarChart(days) {
      if (!days || !days.length) return '';
      var values = days.map(function(d){ return Number(d.conversions || 0); });
      var maxVal = Math.max.apply(null, values) || 1;
      var n = days.length;
      var width = 600;
      var height = 200;
      var leftPad = 30, rightPad = 10, topPad = 20, bottomPad = 36;
      var plotW = width - leftPad - rightPad;
      var plotH = height - topPad - bottomPad;
      var gap = 4;
      var barW = Math.max(8, (plotW - gap * (n - 1)) / n);
      var bars = '';
      for (var i = 0; i < n; i++) {
        var v = values[i];
        var h = (v / maxVal) * plotH;
        var x = leftPad + i * (barW + gap);
        var y = topPad + plotH - h;
        var label = (days[i].day || '').slice(-5);
        bars += '<rect class="bar" x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h + '" rx="2"/>';
        bars += '<text class="axis" x="' + (x + barW / 2) + '" y="' + (topPad + plotH + 14) + '" text-anchor="middle">' + esc(label) + '</text>';
        if (v > 0 && h > 14) {
          bars += '<text class="bar-label" x="' + (x + barW / 2) + '" y="' + (y - 4) + '" text-anchor="middle">' + fmtInt(v) + '</text>';
        }
      }
      return '<svg viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Conversões por dia">' + bars + '</svg>';
    }

    function render(data) {
      var root = document.getElementById('root');
      if (!data) { root.innerHTML = '<div class="empty">Sem dados ainda. Chame vturb_player_overview com player_id/start_date/end_date.</div>'; return; }
      var k = data.kpis || {};
      var days = data.dailyChart || [];
      var platforms = data.platforms || [];
      var quota = data.quota || {};
      var errors = data.errors || [];
      var html = '';
      html += '<div class="header">';
      html += '<h1>' + esc(data.title || 'VTurb Player Overview') + '</h1>';
      if (data.subtitle) html += '<div class="meta">' + esc(data.subtitle) + '</div>';
      html += '</div>';
      html += '<div class="kpis">';
      html += '<div class="kpi"><div class="label">Views</div><div class="value">' + fmtInt(k.views) + '</div></div>';
      html += '<div class="kpi"><div class="label">Plays</div><div class="value">' + fmtInt(k.plays) + '</div></div>';
      html += '<div class="kpi"><div class="label">Finishes</div><div class="value">' + fmtInt(k.finishes) + '</div></div>';
      html += '<div class="kpi"><div class="label">Conversões</div><div class="value">' + fmtInt(k.conversions) + '</div></div>';
      html += '<div class="kpi"><div class="label">Receita (USD)</div><div class="value">' + fmtUsd(k.revenueUsd) + '</div></div>';
      html += '<div class="kpi"><div class="label">Receita (BRL)</div><div class="value">' + fmtBrl(k.revenueBrl) + '</div></div>';
      html += '</div>';
      if (days.length) {
        html += '<div class="section"><h2>Conversões por dia</h2><div class="surface chart">' + buildBarChart(days) + '</div></div>';
      }
      if (platforms.length) {
        html += '<div class="section"><h2>Plataformas ativas</h2><div class="surface"><table><tbody>';
        for (var i = 0; i < platforms.length; i++) {
          html += '<tr><td>' + esc(platforms[i]) + '</td></tr>';
        }
        html += '</tbody></table></div></div>';
      }
      if (quota && quota.queries) {
        var q = quota.queries;
        html += '<div class="quota">Quota da API (minuto atual): <strong>' + fmtInt(q.used) + '/' + (q.limit == null ? '∞' : fmtInt(q.limit)) + '</strong> queries · ';
        html += (q.remaining == null ? 'sem limite' : fmtInt(q.remaining) + ' restantes');
        if (quota.resetsAt) html += ' · reset ' + esc(quota.resetsAt);
        html += '</div>';
      }
      if (errors.length) {
        html += '<div class="errors"><strong>Avisos da API:</strong>';
        for (var j = 0; j < errors.length; j++) { html += '<div>' + esc(errors[j]) + '</div>'; }
        html += '</div>';
      }
      root.innerHTML = html;
    }

    render(readData());

    window.addEventListener('message', function(event) {
      var d = event && event.data;
      if (!d) return;
      if (d.structuredContent) render(d.structuredContent);
      else if (d.kpis || d.dailyChart) render(d);
    });
  </script>
</body>
</html>`;
