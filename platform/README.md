# Plataforma de Inteligencia de Marketing

Esta pasta contem a implementacao real da plataforma:

- `api/`: backend REST + SQLite + automacoes + engines
- `dashboard-app/`: dashboard React conectado na API

## Execucao

### 1) API

```bash
cd platform/api
npm install
npm run start
```

### 2) Dashboard React

```bash
cd platform/dashboard-app
npm install
npm run dev
```

## Endpoints principais

- `POST /api/intelligence/collect-links`
- `GET /api/intelligence/competitors/:companyId`
- `POST /api/intelligence/trends/:companyId`
- `POST /api/strategies/:companyId`
- `POST /api/content/captions`
- `POST /api/creative/image`
- `GET /api/dashboard/overview/:companyId`
