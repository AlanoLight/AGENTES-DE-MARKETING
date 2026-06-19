# FASE 2 IMPLEMENTADA - INTELIGENCIA DE MERCADO

## Status
Implementacao da Fase 2 concluida expandindo a arquitetura existente (sem reescrever os modulos centrais).

## Tabelas novas
Migration aplicada: `platform/api/src/db/migrations/003_phase2_market_intelligence.sql`

- `competitor_snapshots`
- `review_insights`
- `strategies`
- `content_ideas`
- Indices criados para consultas por empresa/tempo e empresa/source.

## Arquivos criados
- `platform/api/src/modules/intelligence/reviewAnalyzer.js`
- `platform/api/src/modules/intelligence/dailyCompetitorScan.js`
- `FASE2_IMPLEMENTADA.md`

## Arquivos alterados
- `platform/api/src/modules/collection/competitorMonitor.js`
- `platform/api/src/modules/automation/scheduler.js`
- `platform/api/src/bootstrapPaulinhos.js`
- `platform/api/src/routes/intelligence.routes.js`
- `platform/dashboard-app/src/api.js`
- `platform/dashboard-app/src/App.jsx`
- `platform/dashboard-app/src/styles.css`

## O que foi implementado

### 1) competitor_snapshots no fluxo de monitoramento
Toda coleta relevante agora persiste historico em `competitor_snapshots`:
- coleta do proprio cardapio
- coleta de cardapios concorrentes
- Google Places (busca)
- Google Place Details/Reviews

### 2) reviewAnalyzer com analyzeReviews()
Arquivo: `platform/api/src/modules/intelligence/reviewAnalyzer.js`

Implementado `analyzeReviews()` com:
- extração de elogios (termos positivos)
- extração de reclamacoes (termos negativos)
- classificacao de sentimento geral (positivo/misto/negativo)
- geracao de oportunidades acionaveis
- persistencia em `review_insights`
- registro complementar em `market_analysis`

### 3) Job diario 08:00, 14:00, 20:00
Arquivo: `platform/api/src/modules/automation/scheduler.js`

Novo cron:
- `0 8,14,20 * * *`

Pipeline executado por empresa:
1. Google Places (textSearch)
2. Place Details
3. Reviews
4. Snapshot (`competitor_snapshots`)
5. Analise (`review_insights` via `analyzeReviews()`)

Modulo do job: `platform/api/src/modules/intelligence/dailyCompetitorScan.js`

### 4) Bootstrap Paulinhos expandido
Arquivo: `platform/api/src/bootstrapPaulinhos.js`

Bootstrap agora suporta os canais exigidos:
- Instagram
- Site
- Cardapio
- Google Maps

E popula:
- `companies`
- `competitors`
- `market_analysis`
- `strategies`
- `content_ideas`

Tambem ficou reutilizavel por rota/API e modo CLI.

### 5) Endpoints novos para dashboard concorrencial
Arquivo: `platform/api/src/routes/intelligence.routes.js`

Novo endpoint:
- `GET /api/intelligence/competitor-intelligence/:companyId`

Retorna dados reais com:
- ranking de concorrentes
- avaliacoes/sentimento
- crescimento/variacao temporal
- tendencias por fonte de coleta
- oportunidades acionaveis

Endpoint de bootstrap atualizado:
- `POST /api/intelligence/bootstrap-paulinhos`
- aceita payload opcional para URLs (instagram/site/menu/maps)

### 6) Dashboard com area "Concorrentes"
Arquivos:
- `platform/dashboard-app/src/api.js`
- `platform/dashboard-app/src/App.jsx`
- `platform/dashboard-app/src/styles.css`

Nova secao com dados reais:
- KPIs competitivos
- ranking atual
- sentimento de reviews
- crescimento/variacao
- oportunidades acionaveis

## Validacoes executadas

### API migrations
Comando:
- `npm run migrate` (em `platform/api`)

Resultado:
- `001_init.sql` aplicada
- `002_real_data_monitoring.sql` aplicada
- `003_phase2_market_intelligence.sql` aplicada

### Dashboard build
Comando:
- `npm run build` (em `platform/dashboard-app`)

Resultado:
- build concluido com sucesso (Vite)

### Erros de codigo
- Verificacao de erros da workspace: sem erros.

## Como executar

1. API
- `cd platform/api`
- `npm install`
- `npm run migrate`
- `npm run dev`

2. Dashboard
- `cd platform/dashboard-app`
- `npm install`
- `npm run dev`

3. Bootstrap Paulinhos
- Via API: `POST /api/intelligence/bootstrap-paulinhos`
- Via script: `npm run bootstrap:paulinhos` (em `platform/api`)

## Proximos passos sugeridos
1. Adicionar alertas proativos (ex.: queda de nota/review spike) para disparo em canais de notificacao.
2. Incluir score composto por concorrente (nota + volume + tendencia) para priorizacao automatica.
3. Evoluir analise de reviews com NLP/LLM para topicos por categoria (preco, entrega, sabor, atendimento).
4. Adicionar filtros por janela temporal no dashboard (7d, 30d, 90d).
