# SGE — Relatório de QA e Pentest

**Data:** 2026-09-07
**Escopo:** backend (Django + DRF), frontend (React/Vite) e a config de deploy na Vercel.
**Ambiente testado:** local, contra o Neon (`DATABASE_URL` do `.env`), com `seed_demo`/`reset_demo`
entre cenários destrutivos; e produção (`https://frontend-vert-seven-86.vercel.app` +
`https://sge-demo-puce.vercel.app`) para os itens de config de deploy.
**Branch:** `qa/hardening`. Segue a estrutura de `docs/QA_CHECKLIST.md`.

## Resumo

| Severidade | Achados | Corrigidos | Status |
|---|---|---|---|
| 🔴 Crítico | 3 | 3 | ✅ fechado e re-testado |
| 🟠 Alto | 2 | 2 | ✅ fechado e re-testado |
| 🟡 Médio | 1 | 0 | registrado, não bloqueia |
| ⚪ Baixo | 1 | 0 | informativo |

52 testes automatizados novos em `tests/` (rodar com
`DATABASE_URL="sqlite:///:memory:" python manage.py test tests` — **não** aponte pro Neon,
veja a nota de segurança no fim) + smoke E2E (`e2e/smoke_test.py`, Playwright) cobrindo login
e as 9 telas. Tudo verde. `tsc -b`, `oxlint`, `npm run build` e `manage.py check` também.

---

## 1. Preparação

| Item | Resultado |
|---|---|
| `seed_demo` roda e o dashboard mostra dados coerentes | ✅ Pass — 32 produtos, estoque por categoria e movimentações batem entre backend e UI |
| `manage.py check --deploy` sem avisos críticos | ✅ Pass (produção) / ⚪ ver nota |
| Console do navegador sem erro em nenhuma tela | ✅ Pass (`e2e/smoke_test.py`, 9/9 telas) |

**Nota sobre `check --deploy`:** rodado localmente (sem `VERCEL=1`) ele aponta 4 avisos de
cookies/HSTS/SSL — **esperado**: `app/settings.py` só liga essas proteções quando
`IS_VERCEL` é verdadeiro (`VERCEL=1`, injetado automaticamente pela Vercel), pra não quebrar
o dev local em HTTP. Rodando com `VERCEL=1 manage.py check --deploy` (simulando produção),
sobra só 1 aviso opcional (`W021`, lista de preload do HSTS — cosmético, não é uma lacuna).

---

## 2. Funcional

### Autenticação
| Item | Resultado |
|---|---|
| Login `demo` → 200 + JWT, redireciona pro dashboard | ✅ Pass |
| Credenciais erradas → mensagem clara | ✅ Pass — a API devolve texto em inglês (`"No active account..."`, padrão do SimpleJWT), mas `LoginPage.tsx` sempre mostra "Usuário ou senha incorretos." pro usuário; a tradução acontece no frontend, não na API |

### Produtos
| Item | Resultado |
|---|---|
| CRUD completo; preços e quantidade corretos | ✅ Pass |
| 🟠 Excluir produto COM movimentações → erro tratado, nunca 500 | 🔴→✅ **Corrigido.** Era exceção crua (`ProtectedError`) até virar 500. `app/api_mixins.py` (`ProtectedDestroyMixin`) agora devolve 409 com mensagem em pt-BR. Testado em `tests/test_protected_delete.py` (produto, categoria, marca **e** fornecedor — o mesmo bug existia nos quatro) |

### Categorias, Marcas, Fornecedores
| Item | Resultado |
|---|---|
| CRUD nas três; concordância de gênero ("Nova categoria") | ✅ Pass — corrigido ainda na Fase 3, sem regressão |
| Selects vazios não geram erro cru do DRF | ✅ Pass — corrigido ainda na Fase 3 (validação client-side antes do submit) |

### Entradas
| Item | Resultado |
|---|---|
| Registrar entrada aumenta o estoque corretamente | ✅ Pass (`tests/test_stock_validation.py`) |

### Saídas (estoque)
| Item | Resultado |
|---|---|
| 🔴 Saída > estoque é bloqueada | 🔴→✅ **Corrigido.** Era o bug mais sério do projeto: a API aceitava qualquer quantidade e deixava o produto com estoque **negativo** (reproduzi manualmente na Fase 3: saída de 999 un. de um produto com 5 em estoque foi aceita). `outflows/serializers.py.validate()` agora rejeita com 400 antes de tocar no banco |
| 🔴 Saída negativa ou zero é rejeitada | 🔴→✅ **Corrigido** — `validate_quantity()` no mesmo serializer |
| 🔴 Saída de produto inexistente é rejeitada | ✅ Pass — já funcionava (`PrimaryKeyRelatedField` do DRF rejeita PK inválido) |
| Saída válida reduz o estoque corretamente | ✅ Pass |

Defesa em profundidade aplicada também em `inflows/serializers.py` (quantidade > 0) e
`products/serializers.py` (quantidade ≥ 0, preços > 0) — nenhum dos três models usa
`PositiveIntegerField`/validators, então a API aceitava valores negativos em qualquer um
antes desse fix.

### Assistente IA
| Item | Resultado |
|---|---|
| Com `OPENAI_API_KEY`: resposta renderizada com segurança | ✅ Pass (por construção) — `AssistantPage.tsx` renderiza `state.data.result` como texto React puro (`{...}`), nunca `dangerouslySetInnerHTML`. Grep confirma: **zero** ocorrências de `dangerouslySetInnerHTML` ou `innerHTML =` em `frontend/src`. Não testei com uma chave real (nenhuma disponível no ambiente) |
| Sem a chave: caminho 502 tratado | ✅ Pass — testado local e **em produção** (a Vercel não tem `OPENAI_API_KEY` configurada); `tests/test_ai_endpoint.py` cobre com mock |
| 🔴 Exige autenticação e tem rate limit | 🔴→✅ **Corrigido.** Não havia limite nenhum — cada chamada aciona a API paga da OpenAI, então o próprio usuário demo podia gerar custo sem controle. `app/settings.py` ganhou `DEFAULT_THROTTLE_CLASSES` (anon/user globais) + scope `ai_invoke` em **10/hora**, aplicado via `ScopedRateThrottle` em `ai/views.py`. Auth já era exigida (`IsAuthenticated`) |

### Relatórios
| Item | Resultado |
|---|---|
| Exportações geram arquivo válido; export gigante não derruba o servidor | ⚪ **N/A** — não existe funcionalidade de exportação na tela de Relatórios (só tabelas). Item do checklist não corresponde a uma feature construída |
| DoS via corpo de requisição gigante (relacionado) | 🟡→✅ **Corrigido.** Achado via `pip-audit` (CVE-2026-73228): `djangorestframework` 3.15.2 fazia `request.data` ignorar o `DATA_UPLOAD_MAX_MEMORY_SIZE` do Django pra JSON/form-urlencoded — um POST com corpo gigante era todo carregado em memória antes de qualquer limite entrar em vigor. Afeta **todo** POST da API (produtos, saídas, `ai/invoke` etc.), não só relatórios. Corrigido atualizando pra 3.17.2 |

---

## 3. Roteamento e acesso

| Item | Resultado |
|---|---|
| 🔴 Demo não acessa auth/admin/gestão de usuários (via API) | ✅ Pass — não existe (e nunca existiu) endpoint de usuários na API; `/admin/` exige `is_staff` (demo não é). `tests/test_demo_permissions.py` tenta rotas adivinhadas (`/api/v1/users/`, `/api/v1/auth/users/` etc.) e confirma 404 em todas |
| 🔴 Escalonamento de privilégio negado | ✅ Pass — nenhum serializer de domínio expõe campo de usuário; um PATCH em `/api/v1/products/` com `is_staff`/`is_superuser` no payload é ignorado (não existe esse campo no serializer) |
| 🔴 IDOR nos recursos | ✅ Pass, com ressalva de design — o SGE não é multi-tenant: não há dono por produto/categoria/entrada/saída, é um estoque único compartilhado por quem tem permissão. "IDOR" no sentido clássico (usuário A vendo dado do usuário B) não se aplica; o controle relevante é o de **permissão por modelo** (`DjangoModelPermissions`), testado em `NoPermissionUserTests` — um usuário autenticado sem nenhuma permissão recebe 403 em toda escrita |
| Deep-link sem token → 401/redirect | ✅ Pass — API devolve 401 (`tests/test_access_control.py`); frontend redireciona pro `/login` via `ProtectedRoute` (confirmado em navegador nas Fases 2 e 3) |
| 404 tratado | ✅ Pass — ID inexistente e rota inexistente devolvem 404 padrão do DRF, sem vazar stack trace |

---

## 4. Segurança / Pentest

| Tentativa | Resultado |
|---|---|
| 🟠 Troca de senha do demo | ⚪ **N/A** — não existe endpoint de troca de senha em lugar nenhum (nem API, nem template: `app/urls.py` só tem `login/`/`logout/`). Não há o que bloquear. Confirmado que `reset_demo` restaura a senha padrão mesmo se alguém trocá-la direto no banco (`tests/test_management_commands.py::test_reset_demo_resets_a_changed_password`) |
| 🟠 Sem token → 401 | ✅ Pass |
| 🟠 Token adulterado (assinatura quebrada) → 401 | ✅ Pass — testei também um token com formato de JWT mas assinatura alterada, não só um valor aleatório |
| 🟠 Brute force dispara o django-axes | ✅ Pass — 5 tentativas erradas travam o IP mesmo pra senha certa depois; login bem-sucedido reseta o contador (`AXES_RESET_ON_SUCCESS`). Testado no endpoint JWT, que é o único caminho de login exposto pro frontend |
| 🟠 XSS em nome/descrição de produto | ✅ Pass — payload `<script>...</script>` é armazenado e devolvido como string JSON literal (não há como a API "executar" HTML, é uma API JSON); a defesa real é o frontend nunca desserializar isso como HTML (confirmado por grep, ver seção do Assistente IA acima) |
| 🟠 SQLi em filtros | ✅ Pass — a API não tem nenhum filtro (Fase 1: sem `django-filter`, sem busca); o único lugar com filtro por querystring é o template Django antigo (`products/views.py`, `.filter(title__icontains=...)`), parametrizado pelo ORM. Testei um payload de `DROP TABLE` nesse campo: sem erro, sem efeito no banco |
| 🔴 Endpoint de reset exige token | ✅ Pass — `/api/reset-demo/` sem `X-Reset-Token` → 403; com token errado → 403; `GET` (em vez de `POST`) → 405, mesmo com token certo na query string |

---

## 5. Configuração de produção

| Item | Resultado |
|---|---|
| 🔴 `DEBUG=False`; segredos só em env | ✅ Pass — `DEBUG` default `False` (só liga com `DEBUG=True` explícito); `DJANGO_SECRET_KEY`, `OPENAI_API_KEY`, `RESET_TOKEN`, `DATABASE_URL` todos via `os.environ`, `.env` fora do git (`.gitignore` raiz) |
| 🟠 CORS/rewrite same-origin resolvido | 🟠→✅ **Corrigido nesta sessão** (branch `fix/sge-same-origin`, já commitada). Achado maior do que "falta rewrite": o backend (`sge-demo`) estava com **SSO Deployment Protection ligada e sem alias de produção ativo** — inacessível publicamente, não era só CORS. Corrigi via `vercel project protection disable sge-demo --sso` + redeploy (recriou o alias), depois `frontend/vercel.json` com rewrite `/api/(.*)` → backend + fallback SPA. Testado em produção: login, dashboard e IA (502 sem chave) funcionando same-origin |
| 🟠 Headers de segurança + WhiteNoise | ✅ Pass — `SECURE_HSTS_*`, `X_FRAME_OPTIONS`, `SECURE_REFERRER_POLICY` ativos quando `IS_VERCEL`; WhiteNoise servindo estáticos com `CompressedStaticFilesStorage` |
| 🟠 Throttle global ativo | 🔴→✅ **Corrigido** (ver seção do Assistente IA) — não existia nenhum antes desta sessão |

---

## 6. Automação (commitada)

| Item | Resultado |
|---|---|
| Teste da validação de estoque | ✅ `tests/test_stock_validation.py` (11 casos: outflow/inflow/product) |
| Testes de permissão do demo e IDOR | ✅ `tests/test_demo_permissions.py`, `tests/test_access_control.py` |
| Teste do endpoint de IA | ✅ `tests/test_ai_endpoint.py` (auth, throttle, 502 mockado — nenhum teste chama a OpenAI de verdade) |
| Testes de auth | ✅ `tests/test_access_control.py`, `tests/test_axes_lockout.py` |
| Smoke E2E (Playwright) | ✅ `e2e/smoke_test.py` — login real pela UI + 9 telas, roda contra os servidores locais reais |
| `tsc -b`, `oxlint`, `npm run build`, `manage.py check` verdes | ✅ Pass (ver seção 8) |

Bônus não pedido explicitamente mas natural do ciclo: `tests/test_protected_delete.py`
(409 em vez de 500) e `tests/test_injection.py` (XSS armazenado, SQLi).

**⚠️ Rodar a suíte com banco isolado, não contra o Neon:**
```
DATABASE_URL="sqlite:///:memory:" python manage.py test tests
```
`app/settings.py` carrega `DATABASE_URL` do `.env` (aponta pro Neon de produção/demo) via
`python-dotenv`; só definir a variável no processo do teste (como acima) garante que
`seed_demo`/`reset_demo` chamados dentro dos testes de `tests/test_management_commands.py`
rodem num banco descartável, não no Neon real.

---

## 7. Achados não corrigidos (não bloqueiam)

| # | Severidade | Achado | Por que não corrigi agora |
|---|---|---|---|
| 1 | 🟡 Médio | Nenhuma lista da API é paginada (Fase 1: `ListCreateAPIView` puro, sem `DEFAULT_PAGINATION_CLASS`) | Não é uma vulnerabilidade explorável por um atacante externo (exige autenticação, e um usuário autenticado já pode listar tudo de qualquer forma) — é uma característica de escala. Em produção com um catálogo muito maior que o da demo, isso vira lentidão/uso de memória. Fica registrado como melhoria futura, fora do escopo de um ciclo de hardening |
| 2 | ⚪ Baixo | `docs/testing.md` e o item "exportações" de `docs/QA_CHECKLIST.md` descrevem funcionalidades que não existem no código (pytest-fixtures pra um `Product.is_low_stock()` que não existe; export de relatórios) | Mesmo padrão já visto em `docs/api-endpoints.md` nas Fases 1-3: documentação aspiracional, escrita antes ou à parte do código real. Não é um problema de segurança, é uma inconsistência de documentação — sinalizando aqui em vez de silenciosamente ignorar |

---

## 8. Build/lint/type-check/suíte — estado final

```
Backend:  manage.py check                         → 0 issues
          manage.py check --deploy (VERCEL=1)      → 1 aviso opcional (W021, HSTS preload)
          DATABASE_URL="sqlite:///:memory:" \
            manage.py test tests                   → Ran 52 tests — OK
          bandit -r . (exceto venv/frontend/site)   → 0 issues em código de aplicação
                                                       (22 "low" só em tests/, falso-positivo
                                                       de senha hardcoded em fixture de teste)
          pip-audit -r requirements.txt             → No known vulnerabilities found
          python e2e/smoke_test.py                  → OK — 9 telas + login, 0 erro de console

Frontend: npx tsc -b                                → limpo
          npm run lint (oxlint)                     → limpo
          npm run build                              → limpo
          npm audit (prod + dev)                     → found 0 vulnerabilities
```

## 9. Sign-off

- [x] Todos os 🔴 e 🟠 corrigidos e re-testados (3 críticos + 2 altos; ver seções 2-5).
- [x] `QA_REPORT.md` atualizado (este arquivo).

**Commits desta sessão** (branch `qa/hardening`):
`fix(qa)` — estoque negativo, 500 em delete protegido, throttle da IA · `fix(deps)` — openai
(fase anterior) e djangorestframework (CVEs) · `test(e2e)` — smoke Playwright.
Branch `fix/sge-same-origin` (separada, já commitada) resolveu o item de CORS/deploy.
