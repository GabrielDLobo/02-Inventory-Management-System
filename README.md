<div align="center">
  <img src="docs/assets/hero-login.png" alt="SGE — Sistema de Gestão de Estoque" width="100%" />

  <h1>SGE — Sistema de Gestão de Estoque</h1>
  <p><strong>Controle de estoque</strong> — produtos, categorias, fornecedores, entradas e saídas, dashboard com métricas e um assistente de IA.</p>

  <p><a href="https://frontend-vert-seven-86.vercel.app/"><strong>🔗 Ver demo ao vivo</strong></a></p>
  <p><sub>Demo: usuário <code>demo</code> · senha <code>demo1234</code></sub></p>

  <p>
    <img src="https://img.shields.io/badge/Django-5-092E20?logo=django" />
    <img src="https://img.shields.io/badge/DRF%20%2B%20JWT-red" />
    <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/Three.js-000?logo=three.js" />
    <img src="https://img.shields.io/badge/PostgreSQL%20(Neon)-336791?logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/OpenAI-412991?logo=openai" />
    <img src="https://img.shields.io/badge/Vercel-000?logo=vercel" />
  </p>
</div>

**SGE** (*Sistema de Gestão de Estoque*) is an inventory management system for products, categories, brands, suppliers and stock movements (inflows/outflows), with a metrics dashboard and an optional **OpenAI assistant** that generates short daily inventory/sales recommendations.

The current stack is a **React 19 + TypeScript + Vite + Three.js** single-page app consuming a **Django REST Framework** API (JWT auth), with **PostgreSQL (Neon)** in production and deploy on **Vercel**. The legacy server-rendered Django Templates UI has been replaced by this SPA.

## 🚀 Live Demo

The public demo is the React frontend on **Vercel**; it talks to the Django REST API (also on Vercel) and a **PostgreSQL** database on **Neon**:

**URL:** https://frontend-vert-seven-86.vercel.app/

**Login:**
- Usuário: `demo`
- Senha: `demo1234`

The `demo` account is not staff/superuser — it only has view/add/change/delete permissions on the main modules (products, categories, brands, suppliers) and view/add on inflows/outflows. It cannot access `/admin/`, create other users, or change passwords (blocked by `DemoModeMiddleware` while `DEMO_MODE=True`).

### Resetting the demo data

All data (products, brands, categories, suppliers, inflows/outflows) is fictional. It can be reset back to the original seeded dataset at any time:

```bash
curl -X POST -H "X-Reset-Token: <RESET_TOKEN>" https://frontend-vert-seven-86.vercel.app/api/reset-demo/
```

`RESET_TOKEN` is stored only as a Vercel environment variable and is not published here. Resetting invalidates active `demo` sessions (the password hash is reset), so a fresh login is required afterwards. Resets are currently manual/on-demand — there is no automated schedule configured yet; wiring one up (e.g. Vercel Cron or a GitHub Action hitting the endpoint) is a natural next step if fully unattended periodic resets are wanted.

Locally, the same effect can be achieved with:

```bash
python manage.py reset_demo
```

### Serverless limitations

Running Django on Vercel's Python serverless runtime introduces a few constraints compared to a normal always-on server:

- **No background jobs / scheduler**: the original crontab-based task (`fazer_coisas`) was removed; nothing runs on a fixed schedule, and there's no Celery/queue worker.
- **SQLite is dev-only**: each serverless invocation is stateless and ephemeral, so production uses Postgres (Neon) via `DATABASE_URL`; `db.sqlite3` remains the default only for local development (no `DATABASE_URL` set).
- **No static build step**: Vercel's build only installs Python deps, so there's no `collectstatic` on deploy. The public UI is the React SPA, which has its own Vite build; the Django side only needs static assets for the DRF browsable API / `/admin/`. Run `python manage.py collectstatic` locally if you need those styled (`staticfiles/` is git-ignored).
- **Cold starts**: the first request after a period of inactivity can take a few seconds longer.
- **Real-time webhook notification disabled**: the synchronous call to the companion `03-Webhooks-Inventory-Management-System` project (previously fired on every outflow, pointed at `http://localhost:8001`) is disabled in `outflows/signals.py` for this deployment, since that service isn't reachable from Vercel's serverless functions.
- **Migrations run manually**: Vercel's build only installs Python dependencies (`pip install -r requirements.txt`); `python manage.py migrate` must be run locally (or via a separate job/CI step) against the production database — it does not run automatically on deploy.

## Documentation

Full project documentation is available at:
<a href="https://gabrieldlobo.github.io/02-Inventory-Management-System/" target="_blank" rel="noopener noreferrer">https://gabrieldlobo.github.io/02-Inventory-Management-System/</a>

### Local preview

```bash
mkdocs serve -a 127.0.0.1:8001
```

Open:
<a href="http://127.0.0.1:8001/" target="_blank" rel="noopener noreferrer">http://127.0.0.1:8001/</a>

### Docs source

Edit markdown pages in `docs/` and navigation in `mkdocs.yml`.

### Publish

```bash
mkdocs gh-deploy --clean
```

## Key Features

- **Authentication**
  - Login/Logout pages
  - Permission-based access to modules and dashboard sections

- **Inventory domain modules**
  - Suppliers
  - Brands
  - Categories
  - Products

- **Stock movements**
  - **Inflows**: register incoming stock (purchases/entries)
  - **Outflows**: register outgoing stock (sales/dispatch)

- **Dashboard**
  - Inventory metrics
  - Sales metrics
  - Charts and daily aggregations

- **AI Insights (optional)**
  - Uses OpenAI to generate short, direct insights about replenishment and sales/outflows
  - Stores generated insights and shows them in the dashboard

## Tech Stack

**Frontend** (`frontend/`)
- React 19 + TypeScript (strict)
- Vite
- Three.js via `@react-three/fiber` + `@react-three/drei` (ambient 3D on every screen, lazy-loaded and disabled under `prefers-reduced-motion`)
- TailwindCSS (build step, design tokens from `docs/design-system.md`)
- Axios API layer with JWT (per-user login)

**Backend** (repository root)
- Python / Django 5.2 + Django REST Framework
- SimpleJWT for authentication
- `django-axes` (per-IP lockout), `DemoModeMiddleware` for `DEMO_MODE`
- `dj-database-url` + WhiteNoise
- OpenAI API for the inventory assistant (`ai/` app)

**Infra**
- PostgreSQL on Neon (production); SQLite for local dev
- Deploy on Vercel (frontend SPA + Django API as Python serverless)

## Project Structure (high-level)

- `frontend/` — React + TypeScript + Vite SPA (the current UI)
- `app/` — Django project configuration (settings/urls) and dashboard aggregation views
- `api/` — DRF routing that mounts the domain endpoints under `/api/v1/`
- `products/`, `categories/`, `brands/`, `suppliers/` — master data
- `inflows/`, `outflows/` — stock movements
- `authentication/` — JWT token endpoints (`/api/v1/authentication/`)
- `ai/` — prompts + agent logic for the OpenAI inventory assistant

## API (consumed by the SPA)

The frontend talks only to the REST API under `/api/v1/`:

- `POST /api/v1/authentication/token/` — obtain JWT (username + password)
- `POST /api/v1/authentication/token/refresh/` — refresh JWT
- `/api/v1/products/`, `/api/v1/categories/`, `/api/v1/brands/`, `/api/v1/suppliers/` — CRUD
- `/api/v1/inflows/`, `/api/v1/outflows/` — stock movements
- dashboard metrics + AI assistant endpoints under the same prefix

> Read the real contract from the backend `views`/`serializers`/`urls` — formats are not assumed.

## Getting Started (development)

### 1) Clone and create a virtual environment

```bash
git clone https://github.com/GabrielDLobo/02-Inventory-Management-System.git
cd 02-Inventory-Management-System

python -m venv venv
# Linux/Mac:
source venv/bin/activate
# Windows:
# venv\Scripts\activate
```

### 2) Install dependencies

If the repository has a `requirements.txt`:

```bash
pip install -r requirements.txt
```

If not, install the minimum:

```bash
pip install django python-decouple
```

### 3) Configure environment variables

Create a `.env` file if your settings expect it. For AI features, set:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (e.g. `gpt-4o-mini`)

If you don't want AI features, you can keep them unset and disable the related execution in your environment.

### 4) Run migrations and create an admin user

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5) Seed the demo data (optional, recommended)

```bash
python manage.py seed_demo
```

Creates the `demo` / `demo1234` user (no admin rights) and populates fictional products, movements and low-stock alerts.

### 6) Run the API

```bash
python manage.py runserver
```

The API is served at http://127.0.0.1:8000/api/v1/ (and the DRF browsable API / `/admin/`).

### 7) Run the frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # keep VITE_API_BASE_URL=/api/v1; set API_PROXY_TARGET if the API isn't on :8000
npm run dev
```

Open http://127.0.0.1:5173/ and log in with `demo` / `demo1234`. Vite proxies `/api` to the Django server, so no CORS setup is needed.

Before considering a screen done: `npm run build`, `npm run lint` and `tsc -b` must be clean.

## How this project complements the Webhooks project

This repository is the **core system** where stock and sales are recorded.  
The companion repository **03-Webhooks-Inventory-Management-System** can be used as an **integration/notification service** to receive events (like a new sale/outflow) and send notifications (email + messaging).

A common setup is:
1. A sale is created in this system (or in another system).
2. An event is posted to the Webhooks service.
3. Notifications are sent to administrators or stakeholders.

> **Note:** this integration is disabled in the [Live Demo](#-live-demo) deployed on Vercel, since the Webhooks service isn't reachable from that serverless environment. Re-enable it in `outflows/signals.py` if you deploy both services together.

## License

No license file is included by default. Add a license if you plan to distribute or use this project commercially.

## Segurança & Qualidade

- **[Relatório de QA](docs/QA_REPORT.md)** — cobertura de testes, verificações manuais e itens conhecidos.
- **[Segurança da autenticação](docs/authentication-security.md)** — modelo de permissões do usuário `demo`, JWT, lockout por IP (django-axes) e `DEMO_MODE`.

# Project Images

> These screenshots show the **legacy** server-rendered Django Templates UI, kept for reference. The current UI is the React SPA in `frontend/` (see the hero image and the [live demo](#-live-demo)).

## Login
![alt text](</public/Captura de tela 2025-09-03 041708.png>)

## Home
![alt text](</public/Captura de tela 2025-09-03 035324.png>)
![alt text](</public/Captura de tela 2025-09-03 035333.png>)

## Suppliers / Fornecedores 
![alt text](</public/Captura de tela 2025-09-03 035519.png>)
![alt text](</public/Captura de tela 2025-09-03 035531.png>)

## Brands / Marcas
![alt text](</public/Captura de tela 2025-09-03 035546.png>)
![alt text](</public/Captura de tela 2025-09-03 035557.png>)

## Categories / Categorias
![alt text](</public/Captura de tela 2025-09-03 035614.png>)
![alt text](</public/Captura de tela 2025-09-03 035624.png>)

## Products / Produtos
![alt text](</public/Captura de tela 2025-09-03 035636.png>)
![alt text](</public/Captura de tela 2025-09-03 035648.png>)

## Inflows / Entradas
![alt text](</public/Captura de tela 2025-09-03 041227.png>)
![alt text](</public/Captura de tela 2025-09-03 041239.png>)

## Outflows / Saídas
![alt text](</public/Captura de tela 2025-09-03 041249.png>)
![alt text](</public/Captura de tela 2025-09-03 041259.png>)