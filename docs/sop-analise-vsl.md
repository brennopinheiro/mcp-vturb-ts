# SOP — Análise de VSL com o MCP da VTurb

Esse documento serve pra duas coisas: **instalar a extensão da VTurb no Claude Desktop** e **ter prompts prontos** pra analisar a performance do seu VSL.

Não precisa de terminal. Não precisa instalar Python nem nada.

---

## Parte 1 — Instalar (5 minutos)

### 1. Baixar o arquivo

Abra este link e baixe o `.mcpb`:

→ https://github.com/brennopinheiro/mcp-vturb-ts/releases/latest

Vai cair em **Downloads** como `vturb-analytics-X.Y.Z.mcpb` (~3 MB).

### 2. Pegar seu API Token na VTurb

1. Entrar em https://app.vturb.com/settings/analytics-api
2. Clicar em **"Generate New API Key"**
3. Copiar a chave (guarda — só aparece uma vez)

### 3. Instalar no Claude Desktop

1. Abrir o **Claude Desktop**
2. Ir em **Settings → Extensions**
3. Clicar **"Install Extension…"** e escolher o `.mcpb` que você baixou
4. Quando pedir o **API Token**, cola o que você copiou
5. Clicar **Install**

Pronto. Vai aparecer "VTurb Analytics" com ícone vermelho/laranja na lista.

### Testar se está funcionando

Abre uma conversa nova e cola:

> Usa o MCP da VTurb pra me mostrar minha quota da API.

Se voltar "queries used: X, limit: Y" — está funcionando.

| Erro | Causa                  | Solução                                                      |
| ---- | ---------------------- | ------------------------------------------------------------ |
| 401  | Token errado           | Settings → Extensions → vturb-analytics → reconfigurar token |
| 429  | Bateu limite do minuto | Espera 60s                                                   |

---

## Parte 2 — O painel visual `vturb_player_overview`

A maneira mais rápida de olhar a performance de um VSL é pedir o **painel visual**. Ele renderiza dentro da própria conversa do Claude com:

- 6 KPIs em destaque: Views · Plays · Finishes · Conversões · Receita USD · Receita BRL
- Gráfico de barras de conversões por dia
- Tabela de plataformas ativas
- Quota da API no rodapé

### Prompt

> Mostra o dashboard do player `<PLAYER_ID>` de `2026-05-01 00:00:00` até `2026-05-31 23:59:59`.

> **Importante** — sempre passe data com hora cheia (`HH:MM:SS`). A API da VTurb não aceita só `2026-05-01`, vai retornar erro. Use `00:00:00` no início e `23:59:59` no fim do período.

### Quando usar o painel

- Check rápido de "como está esse VSL semana passada" → painel direto, sem perguntar mais nada
- Reunião de equipe → tira print do painel
- Decisão rápida: tem conversão? quanto? plataformas estão certas? → tudo num olhar só

### Quando NÃO usar o painel

- Investigar drop de retenção segundo a segundo → usar análise 1 (texto)
- Comparar 2 versões de VSL → usar análise 4 (AB Test)
- Drill down por origem de tráfego → usar análise 3

---

## Parte 3 — Prompts prontos pra análise detalhada

Cola direto no Claude Desktop trocando `<PLAYER_ID>`, `<DATA_INICIO>` e `<DATA_FIM>` pelos seus valores.

**Datas:** formato `2026-05-15 00:00:00` (sempre com hora cheia).

---

### 1. Curva de retenção — onde o pessoal sai do vídeo

> Pega no VTurb a curva de engajamento do player `<PLAYER_ID>` entre `<DATA_INICIO>` e `<DATA_FIM>`. Me mostra em quais segundos do vídeo acontece queda forte de audiência (mais de 10% de drop num intervalo curto). Lista os 3 piores momentos.

**Use pra:** descobrir qual parte do VSL precisa ser reescrita. Se o pessoal sai no minuto 0:30, é o hook. Se sai no preço, é a ancoragem de valor.

---

### 2. Conversão por dia — está caindo?

> Pega no VTurb as conversões do player `<PLAYER_ID>` por dia entre `<DATA_INICIO>` e `<DATA_FIM>`. Me dá conversões, play rate, conversion rate e receita por dia. Aponta dias fora do padrão (muito acima ou abaixo da média).

**Use pra:** descobrir se mudou algo que estragou a conversão. Dia que despencou geralmente coincide com troca de criativo, mudança no preço ou bug na página.

> Esse aqui o painel já mostra parcialmente (gráfico diário). Use o prompt em texto quando quiser play rate / conversion rate / outliers identificados.

---

### 3. Qual origem de tráfego converte melhor

> Pega no VTurb as estatísticas de origem de tráfego do player `<PLAYER_ID>` entre `<DATA_INICIO>` e `<DATA_FIM>`, agrupado por utm_source. Me mostra conversion rate, receita por visitante (RPV) e tempo médio assistido por origem. Diz quais origens estão acima e abaixo da média.

**Use pra:** decidir onde aumentar verba e onde cortar. Origem com tempo assistido alto mas conversão baixa = público quente mas oferta não bate. Origem com tempo baixo = ad atraindo público errado.

---

### 4. Comparar 2 versões de VSL (AB Test)

> No VTurb tenho um teste A/B rodando. Lista meus comparison groups ativos, depois roda o stats do teste `<COMPARISON_GROUP_ID>` com os 2 players. Me diz qual venceu em conversion rate e em receita por visitante, e por quanto.

**Use pra:** decidir qual versão deixar no ar. Se um player venceu o outro com folga, mata o perdedor.

---

### 5. Live users (durante lançamento)

> Pega `vturb_sessions_live_users` do player `<PLAYER_ID>` dos últimos 30 minutos. Quero ver quantos leads estão ao vivo agora.

**Use pra:** monitorar lançamento em tempo real. Pico alto = bom momento pra disparar e-mail/WhatsApp lembrando da urgência. Pico baixo = algo travou no funnel.

---

### 6. Overview da semana (resumo em texto)

> Faz um overview da semana passada para o player `<PLAYER_ID>`:
>
> 1. quota usage atual
> 2. conversões por dia (últimos 7 dias)
> 3. origens de tráfego (qual converte melhor)
> 4. piores momentos de retenção do vídeo
>
> Me resume em 5 bullets: o que está bem, o que está ruim, e onde devo mexer primeiro.

**Use pra:** check semanal. Roda toda segunda de manhã.

> Diferença do painel: aqui o Claude **cruza dados** e te dá recomendações. O painel mostra os números, esse prompt interpreta.

---

## Parte 4 — Quando voltar pra `ht-vsl`

Os números acima mostram **onde** o VSL está perdendo. Pra **corrigir o roteiro**, volta pra skill:

- Drop no hook (primeiros 30s) → reabrir `briefing-vsl.md` e regenerar o **Bloco 1** com novo hook.
- Drop no preço → reforçar **valor antes do preço** no `oferta.md` e regenerar o bloco de oferta.
- Conversão caindo numa origem específica → o ad não casa com o VSL. Ajustar hook + ad copy juntos (`ht-ads-aplicacao`).

> **Importante:** regenerar só o bloco afetado, não o VSL inteiro. Mudar o vídeo todo quebra os cue points do editor e atrasa a produção.

---

## Parte 5 — Lista completa de ferramentas

Se quiser ver tudo que dá pra chamar:

> Roda `vturb_help` e me mostra o catálogo.

Ou consulta a documentação oficial da API: https://vturb.gitbook.io/analytics-api/pt

### Resumo das 30 ferramentas disponíveis

| Categoria              | Tools                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Painel visual**      | `vturb_player_overview` (renderiza HTML inline)                                        |
| **Entrada / catálogo** | `vturb_help`                                                                           |
| **clicks**             | `vturb_clicks_total_by_company_day` · `..._timed`                                      |
| **comparison_groups**  | `..._list` · `..._stats`                                                               |
| **conversions**        | `vturb_conversions_active_platforms` · `..._stats_by_day` · `..._video_timed`          |
| **custom_metrics**     | `..._list`                                                                             |
| **events**             | `..._leaderboard` · `..._total_by_company` · `..._day` · `..._players`                 |
| **headlines**          | `..._stats_by_player`                                                                  |
| **players**            | `..._list` (com busca por nome)                                                        |
| **quota**              | `..._usage`                                                                            |
| **sessions**           | `..._live_users` · `..._stats` · `..._by_day` · `..._by_field` · `..._by_field_by_day` |
| **times**              | `..._user_engagement` · `..._by_day` · `..._by_field` · `..._by_traffic_origin`        |
| **traffic_origin**     | `..._stats` · `..._stats_by_day` · `..._valid_utms`                                    |
| **turbo**              | `..._stats_by_player`                                                                  |
