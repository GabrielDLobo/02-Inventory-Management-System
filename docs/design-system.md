# SGE — Design System (marca Ephyra)

Referência visual do SGE. Mesma marca do PortalRH (cyan sobre grafite, Three.js),
com uma diferença importante: **3D em TODAS as telas**. Alvo visual:
`docs/mockups/sge-ui.html`.

## 1. Tokens de cor
```
/* Claro (sistema) */
--bg:#F7F9FC; --surface:#FFFFFF; --surface-2:#FBFCFE;
--ink:#0B1220; --muted:#5B6472; --line:#E6EAF0; --line-2:#EFF2F7;
/* Marca / acento */
--cyan:#22D3EE; --cyan-600:#06B6D4; --cyan-700:#0E7490;
--human:#FF9E7A; --violet:#7C6FF0;
/* Semânticos (com ícone/label, nunca cor sozinha) */
--success:#10B981; --warning:#F59E0B; --danger:#F43F5E;
/* Dark (login, hero, headers 3D) */
--dark:#04070D; --dark-2:#0A0F1A; --dark-line:#16202E;
```

## 2. Tipografia
Space Grotesk (display/títulos), Inter (corpo/UI), JetBrains Mono (números, SKU, preços).
Self-hosted via `@fontsource`. Números e valores sempre com `font-variant-numeric:tabular-nums`.

## 3. Forma & elevação
Cards `rounded-2xl` (16px), inputs/botões 11px, pills 20px. Sombras suaves; `glow` cyan
só em destaques. Preços em R$ com mono tabular.

## 4. Tailwind (theme.extend)
Igual ao PortalRH: mapear `bg/surface/ink/muted/line`, `cyan{DEFAULT,600,700}`, `human`,
`violet`, semânticos e `dark{DEFAULT,2,line}`; `fontFamily.display/sans/mono`; `borderRadius`
`xl:16px`/`2xl:20px`; `boxShadow.sm/card/glow`.

## 5. Componentes base (`src/components/ui/`)
Button (primary cyan / secondary / ghost / danger), Input/Select, Card/Panel, **StatKPI**
(ícone colorido + número grande + delta), **StatusPill** (ok/baixo/crítico para estoque),
Table (header em surface-2, mono nos números, `overflow-x:auto`), Sidebar+Nav, Topbar com
badge de demo, Toast (react-hot-toast). Ícones: `@heroicons/react`.

### KPIs do dashboard de estoque
Produtos cadastrados, Unidades em estoque, **Valor do estoque (R$)**, Estoque baixo (alertas).
Gráfico: estoque por categoria (barras, uma cor cyan). Movimentações recentes (entradas em
verde `+`, saídas em vermelho `−`, alertas de mínimo em âmbar). Tabela de produtos com estoque
baixo (produto/SKU, categoria, fornecedor, estoque, mínimo, status).

## 6. 3D — EM TODAS AS TELAS
Stack: `three` + `@react-three/fiber` + `@react-three/drei`. Criar um wrapper reutilizável
`<Scene3D variant lazy/>` e usá-lo em cada tela, sempre performático:

- **Login:** hero forte (icosaedro wireframe cyan, miolo violeta, anéis, ~700 partículas reativas ao mouse) — como no mockup.
- **Dashboard:** acentos 3D nos KPIs + um objeto ambiente no cabeçalho.
- **Produtos/Categorias/Marcas/Fornecedores/Entradas/Saídas:** cada tela com um **objeto 3D ambiente no cabeçalho** (ex.: cubo/caixa girando devagar, tema estoque) e **empty states 3D** (quando a lista está vazia). Ícones de seção podem ser 3D leves.
- **Assistente IA:** um núcleo de energia 3D pulsante como identidade da tela de IA.

**Regras de performance (obrigatórias, já que é 3D em tudo):**
- `Suspense` + fallback estático; `dpr={[1,1.5]}`.
- `frameloop="demand"` ou pausar o render quando o canvas sai da viewport (IntersectionObserver).
- Desligar animação e cenas pesadas em `prefers-reduced-motion` (render de um frame estático).
- Uma única instância de cena por tela; nada de 3D atrás de tabelas/formulários densos (só no cabeçalho/empty state).
- Lazy-load do bundle 3D (code-splitting), fora do chunk principal.

## 7. Copy e anti-IA
UI em pt-BR. Sem travessões como pausa de frase, sem emojis. Ícones reais e microcopy humano.
Botão diz a ação ("Registrar entrada", "Salvar produto"); toast confirma o resultado.
Login mostra: "Ambiente de demonstração · dados fictícios, reiniciados periodicamente".

## 8. Aceite (por fase)
- Fundação: fontes, tokens, componentes base, `<Scene3D/>` reutilizável.
- Login dark com hero 3D (usuário demo) + dashboard consumindo a API real.
- Cada tela interna com seu acento 3D ambiente, estados completos, responsiva, e
  `build/lint/type-check` limpos. Lighthouse de performance >= 85 no desktop mesmo com o 3D.
