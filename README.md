# VTurb Analytics — Claude Desktop Extension

Conecta o Claude direto na sua conta VTurb. Pergunta tipo:

> "Me dá os números de hoje do player X."

E o Claude busca views, plays, conversões, receita, traffic origin — tudo da API oficial da VTurb. **29 ferramentas, todas com prefixo `vturb_`** pra Claude encontrar na hora.

## Instalação (Mac & Windows) — 3 passos

### 1. Baixe o arquivo `.mcpb`

[**⬇️ vturb-analytics-0.1.0.mcpb**](https://github.com/brennopinheiro/mcp-vturb-ts/releases/latest)

### 2. Pegue seu API token

Acesse <https://app.vturb.com/settings/analytics-api> → **"Generate New API Key"** → copia.

### 3. Instale no Claude Desktop

1. Abre o **Claude Desktop**
2. **Settings → Extensions** (ou **Configurações → Extensões**)
3. **"Install Extension…"** → seleciona o `.mcpb`
4. Cola seu API token
5. Pronto.

Não precisa instalar Node, terminal, nada. **Node.js já vem com o Claude Desktop** — primeira execução é instantânea (diferente da versão Python, que baixa ~67 deps).

## O que dá pra fazer

- _"Lista meus players da VTurb."_
- _"Conversões do player X de 01/05 até 31/05."_
- _"Stats de sessão por dia da última semana — agrupado por traffic origin."_
- _"Compara os 2 players do meu AB test."_
- _"Quanto da minha quota da API eu já usei nesse minuto?"_

### 28 endpoints cobertos + `vturb_help`

| Categoria             | Tools                                                                              |
| --------------------- | ---------------------------------------------------------------------------------- |
| **clicks**            | `vturb_clicks_total_by_company_day`, `..._timed`                                   |
| **comparison_groups** | `..._list`, `..._stats`                                                            |
| **conversions**       | `vturb_conversions_active_platforms`, `..._stats_by_day`, `..._video_timed`        |
| **custom_metrics**    | `..._list`                                                                         |
| **events**            | `..._leaderboard`, `..._total_by_company`, `..._day`, `..._players`                |
| **headlines**         | `..._stats_by_player`                                                              |
| **players**           | `..._list` (com busca por nome)                                                    |
| **quota**             | `..._usage`                                                                        |
| **sessions**          | `..._live_users`, `..._stats`, `..._by_day`, `..._by_field`, `..._by_field_by_day` |
| **times**             | `..._user_engagement`, `..._by_day`, `..._by_field`, `..._by_traffic_origin`       |
| **traffic_origin**    | `..._stats`, `..._stats_by_day`, `..._valid_utms`                                  |
| **turbo**             | `..._stats_by_player`                                                              |

## Segurança

- **100% local**: roda no seu computador, fala direto com `analytics.vturb.net`
- **Token criptografado**: guardado no keychain do sistema operacional
- **Open source**: código auditável neste repo

## Suporte

- API VTurb fora / token errado → [help.vturb.com](https://help.vturb.com)
- Bug nessa extensão → [abre uma issue](https://github.com/brennopinheiro/mcp-vturb-ts/issues)

---

## Para desenvolvedores

```bash
git clone https://github.com/brennopinheiro/mcp-vturb-ts
cd mcp-vturb-ts
npm install
npm run generate   # OpenAPI → src/tools/*.ts
npm run build      # tsc → dist/

# Smoke test (stdio, espera input MCP)
VTURB_API_TOKEN=... node dist/server.js

# Pack .mcpb
npm install -g @anthropic-ai/mcpb
npm run pack-mcpb
```

Arquitetura: OpenAPI 3.0.2 vendored em `specs/vturb-openapi.json` → `scripts/generate.ts` gera 12 módulos TS → `McpServer.registerTool` expõe cada um com schema zod. Detalhes em [`CLAUDE.md`](CLAUDE.md).

### Por que não Python?

Existe a versão Python em [brennopinheiro/mcp-vturb](https://github.com/brennopinheiro/mcp-vturb) — funcional, mas a primeira execução baixa Python + 67 deps via `uv` (~30s). Aqui Node já tá embarcado no Claude Desktop, então instala instantâneo. Para usuários finais é a opção certa.

## License

MIT
