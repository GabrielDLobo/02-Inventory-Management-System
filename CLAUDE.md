# CLAUDE.md — SGE (Sistema de Gestão de Estoque)

Guia operacional para o Claude Code trabalhar neste repositório. Leia este arquivo inteiro antes de qualquer alteração.

## O que é o projeto

SGE é um sistema de gestão de estoque (produtos, categorias, marcas, fornecedores, entradas e saídas), da família Ephyra. Ele já tem uma **demo pública no ar** e vamos: (1) construir um frontend novo em **React + TypeScript + Vite com 3D**, substituindo os templates Django atuais, e (2) manter/reforçar a camada de segurança da demo. Marca Ephyra: cyan sobre grafite, com Three.js.

Referência visual: `docs/mockups/sge-ui.html` (login dark com hero 3D + dashboard de estoque). Design system: `docs/design-system.md`.

## Stack real

**Backend** (raiz): Django 5.2 + Django REST Framework + SimpleJWT. Já configurado para produção: **django-axes** (lockout por IP, 5 falhas/30min), **dj-database-url + Neon**, **WhiteNoise**, `DEMO_MODE`, deploy na Vercel. App `ai` com integração **OpenAI** (um assistente — preservar e valorizar). Apps de domínio: `products`, `categories`, `brands`, `suppliers`, `inflows`, `outflows`, além de `authentication`, `api`, `ai`, `services`, `app`.

Models (simples): `Product` (title, category FK, brand FK, serie_number, cost_price, selling_price, quantity, description); `Category`/`Brand`/`Supplier` (name, description); `Inflow` (supplier FK, product FK, quantity, description); `Outflow` (product FK, quantity, description). Não há campo de estoque mínimo — "estoque baixo" hoje é heurística (< 10 un.); adicionar `min_stock` ao Product é uma melhoria opcional.

**Frontend hoje**: templates Django + Tailwind (renderizado no servidor). O `package.json` só compila o CSS. **Vamos construir um SPA React + TS + Vite do zero** consumindo a API DRF. Login é **por usuário** (não e-mail): demo `demo` / `demo1234`, via JWT.

## Infra de demo e segurança (JÁ EXISTE — reutilizar, não recriar)

- `app/management/commands/seed_demo.py` — cria o usuário `demo` **sem ser staff/superuser, com permissões cortadas** (só produtos/categorias/marcas/fornecedores/entradas/saídas; nada de usuários/admin) e popula dados fictícios. Já foi **enriquecido** (32 produtos, estoque baixo para alertas, movimentações datadas coerentes: estoque = entradas − saídas).
- `app/management/commands/reset_demo.py` — apaga tudo e roda o seed. Também **redefine a senha do demo**, então trocas de senha se auto-corrigem no reset.
- `django-axes`, `DEMO_MODE`, JWT já configurados no `settings.py`.

Ou seja: o sequestro de conta já é barrado pelo modelo de permissões (o demo não tem permissão de mexer em usuários/admin). **Hardening opcional** (baixa prioridade): bloquear o endpoint de troca de senha quando `DEMO_MODE=True`, para não deixar a demo travada entre um reset e outro.

## Convenções de código

- **UI em pt-BR.** TypeScript estrito. Sem `any` implícito.
- **Sem "tells de IA"**: nada de travessões como pausa de frase, nada de emojis; ícones de verdade (`@heroicons/react`) e microcopy humano.
- Toda chamada de API passa por uma camada `src/services/*` (Axios). Descobrir o **contrato real** lendo as views/serializers/urls do backend — não assumir formato.
- Componentes pequenos e reutilizáveis, em `src/components/ui/`.
- `npm run build`, `lint` e `type-check` limpos antes de considerar uma tela pronta.

## Sistema visual e 3D

Seguir `docs/design-system.md` (mesma marca do PortalRH: cyan `#22D3EE` sobre `#04070D`, Space Grotesk + Inter + JetBrains Mono). **Diferença do SGE: 3D em TODAS as telas** — não só login e dashboard. Cada tela ganha um elemento 3D ambiente (cabeçalho com objeto girando, empty state 3D, ícone 3D da seção), sempre **lazy-loaded, pausado fora da tela e desligado em `prefers-reduced-motion`**, para não pesar tabelas e formulários. Stack: `three` + `@react-three/fiber` + `@react-three/drei`.

## Fases (executar em ordem, uma por vez, diff antes de avançar)

- **Fase 1 — Scaffold + fundação**: criar o app React + TS + Vite (pasta `frontend/`), Tailwind com os tokens do design system, fontes self-hosted, cliente de API (Axios + JWT por usuário), componentes base em `src/components/ui/`, e o setup do 3D (R3F) com um wrapper `<Scene3D lazy/>` reutilizável. Deploy: frontend na Vercel, API Django já na Vercel + Neon.
- **Fase 2 — Login 3D + Dashboard**: login dark com hero 3D (usuário `demo`), e dashboard consumindo a API real (produtos, unidades em estoque, valor do estoque, estoque baixo, estoque por categoria, movimentações recentes).
- **Fase 3 — Telas (com 3D em cada uma)**: Produtos (lista + cadastro/edição), Categorias, Marcas, Fornecedores, Entradas, Saídas, Assistente IA (usando o endpoint do app `ai`), Relatórios. Cada tela com estados loading/erro/vazio, responsiva, e um acento 3D ambiente.

## Onde trabalhar

- Este repositório é a fonte de verdade. Ao mexer no front novo, `cd frontend`.
- Não commitar segredos. Rodar `python manage.py seed_demo` para popular a demo local e validar as telas contra dados reais.
