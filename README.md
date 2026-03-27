# Inventory Management System (SGE) — Django

A Django-based **Inventory Management System** (SGE - *Sistema de Gestão de Estoque*) that allows you to manage products, suppliers, and stock movements (inflows/outflows), providing a dashboard with metrics and charts. It also includes an optional **AI insights** module to generate short daily inventory/sales recommendations based on system data.

## Documentation / Documentacao

- EN: Full project documentation is available at:
  https://gabrieldlobo.github.io/02-Inventory-Management-System/
- PT: A documentacao completa do projeto esta disponivel em:
  https://gabrieldlobo.github.io/02-Inventory-Management-System/

### Local preview

```bash
mkdocs serve -a 127.0.0.1:8001
```

Open: http://127.0.0.1:8001/

### Docs source

- EN: Edit markdown pages in `docs/` and navigation in `mkdocs.yml`.
- PT: Edite as paginas markdown em `docs/` e o menu em `mkdocs.yml`.

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

- Python / Django
- Django Templates (HTML)
- TailwindCSS (via CDN)
- (Optional) OpenAI API

## Project Structure (high-level)

Common Django apps you may find in this repository:

- `app/` — Django project configuration (settings/urls) and dashboard views
- `products/`, `categories/`, `brands/`, `suppliers/` — master data
- `inflows/`, `outflows/` — stock movements
- `authentication/` — API/auth related endpoints (mounted under `/api/v1/`)
- `ai/` — AI prompts + agent logic that produces inventory insights

## Main Routes (typical)

- `GET /login/` — Login
- `POST /login/` — Login submit
- `GET /logout/` — Logout
- `GET /home/` — Dashboard
- `/api/v1/` — API (authentication module)

> Other routes depend on each module (`products`, `inflows`, `outflows`, etc.).

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

### 5) Run the server

```bash
python manage.py runserver
```

Open: http://127.0.0.1:8000/

## How this project complements the Webhooks project

This repository is the **core system** where stock and sales are recorded.  
The companion repository **03-Webhooks-Inventory-Management-System** can be used as an **integration/notification service** to receive events (like a new sale/outflow) and send notifications (email + messaging).

A common setup is:
1. A sale is created in this system (or in another system).
2. An event is posted to the Webhooks service.
3. Notifications are sent to administrators or stakeholders.

## License

No license file is included by default. Add a license if you plan to distribute or use this project commercially.

# Project Images

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