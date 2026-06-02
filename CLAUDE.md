# mcp-vturb-ts — Project Instructions

TypeScript MCP server for the **VTurb Public Analytics API**, packaged as a `.mcpb` bundle for one-click install on Claude Desktop.

This is the **distribution-grade** version. For dev iteration, use [`mcp-vturb`](https://github.com/brennopinheiro/mcp-vturb) (Python).

## Stack

- Node.js 18+ (runtime embarcado no Claude Desktop)
- `@modelcontextprotocol/sdk` 1.29 (stdio transport)
- `zod` 3 (inputSchema validation)
- Zero deps nativos compilados — instala instantâneo cross-platform

## API alvo

- **Base URL**: `https://analytics.vturb.net`
- **Auth**: 2 headers — `X-Api-Token` + `X-Api-Version: v1`
- **Env var**: `VTURB_API_TOKEN`
- Token gerado em `app.vturb.com/settings/analytics-api`

## Estrutura

```
mcp-vturb-ts/
├── manifest.json           # MCPB spec 0.4, server.type=node
├── icon.png                # 512×512 PNG da VTurb
├── specs/vturb-openapi.json
├── scripts/generate.ts     # OpenAPI → src/tools/*.ts (dev-time)
├── src/
│   ├── server.ts           # stdio entry point
│   ├── client.ts           # fetch wrapper
│   ├── help.ts             # vturb_help text
│   └── tools/              # 12 módulos auto-gerados + index.ts
└── dist/                   # tsc output — incluso no bundle
```

## Comandos

```bash
npm install
npm run generate    # OpenAPI → src/tools/*.ts (rodar após mudar o spec)
npm run build       # tsc → dist/

# Smoke test rápido
VTURB_API_TOKEN=... node dist/server.js  # stdio, vai aguardar input MCP

# Pack distribuição
npm run pack-mcpb   # gera dist-mcpb/vturb-analytics-X.Y.Z.mcpb
```

## Convenções

- Cada tool tem prefixo `vturb_` — auto-identificável sem Code Mode
- Generator é determinístico — rodar de novo produz output idêntico
- Nunca editar `src/tools/*.ts` à mão; sempre via generator
- Manter paridade de versão entre `package.json` e `manifest.json`

## Por que TypeScript

Python (mcp-vturb) usa `uv` runtime que baixa Python + 67 deps na primeira execução (~30s). Node ship's no Claude Desktop — primeira execução é instantânea. Veja [issue #X](https://github.com/brennopinheiro/mcp-vturb-ts/issues) para o reasoning completo.
