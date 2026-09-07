# SGE — Checklist de QA e Pentest

Referência fixa para validar o sistema antes de cada publicação. Marque cada item.
Teste contra a demo com `python manage.py seed_demo`; use `reset_demo` entre cenários
destrutivos. Conta: `demo` / `demo1234` (login por usuário).
Severidade: 🔴 crítico · 🟠 alto · 🟡 médio · ⚪ baixo.

## 1. Preparação
- [ ] `seed_demo` rodado; dashboard mostra estoque, categorias e movimentações coerentes.
- [ ] `python manage.py check --deploy` sem avisos críticos.
- [ ] Console do navegador sem erros em nenhuma tela.

## 2. Funcional (caminho feliz + borda, mensagens em pt-BR)
### Autenticação
- [ ] Login `demo` retorna 200 + JWT; redireciona pro dashboard.
- [ ] Credenciais erradas: mensagem clara.

### Produtos
- [ ] CRUD completo; preços e quantidade corretos.
- [ ] 🟠 Excluir produto COM movimentações (FK PROTECT) → erro tratado em pt-BR, nunca 500.

### Categorias, Marcas, Fornecedores
- [ ] CRUD nas três (tela genérica); concordância de gênero correta ("Nova categoria").
- [ ] Selects vazios não geram erro cru do DRF (Pk inválido) — mensagem amigável.

### Entradas
- [ ] Registrar entrada aumenta o estoque do produto corretamente.

### Saídas (estoque — área de maior risco)
- [ ] 🔴 Saída maior que o estoque é BLOQUEADA (o estoque nunca fica negativo).
- [ ] 🔴 Saída negativa ou zero é rejeitada.
- [ ] 🔴 Saída de produto inexistente é rejeitada.
- [ ] Saída válida reduz o estoque corretamente.

### Assistente IA
- [ ] Com `OPENAI_API_KEY`: resposta renderizada com segurança (sem XSS).
- [ ] Sem a chave: caminho 502 tratado, sem quebrar a tela.
- [ ] 🔴 `/api/v1/ai/invoke/` exige autenticação e tem rate limit (evita abuso e custo de OpenAI).

### Relatórios
- [ ] Exportações geram arquivo válido; export gigante não derruba o servidor.

## 3. Roteamento e acesso
- [ ] 🔴 Usuário demo (permissões cortadas) NÃO acessa auth/admin/gestão de usuários (via API).
- [ ] 🔴 Escalonamento: tentar criar/editar usuário ou virar staff/superuser → negado.
- [ ] 🔴 IDOR nos recursos; deep-link sem token → 401/redirect; 404 tratado.

## 4. Segurança / Pentest (documentar cada tentativa)
- [ ] 🟠 Troca de senha do demo: bloqueada em `DEMO_MODE` ou confirmada como restaurada pelo `reset_demo`.
- [ ] 🟠 Sem token → 401; token adulterado → 401.
- [ ] 🟠 Brute force no login dispara o django-axes (lockout por IP).
- [ ] 🟠 XSS em nome/descrição de produto; SQLi em filtros.
- [ ] 🔴 `/internal/reset-demo/` (ou equivalente) exige token; sem token recusa.

## 5. Configuração de produção
- [ ] 🔴 `DEBUG=False`; segredos (`DJANGO_SECRET_KEY`, `OPENAI_API_KEY`, token de reset) só em env.
- [ ] 🟠 CORS ou rewrite same-origin resolvido para produção (front e API em domínios separados na Vercel).
- [ ] 🟠 Headers de segurança e WhiteNoise para estáticos.
- [ ] 🟠 Throttle global (anon/user) ativo.

## 6. Automação (commitar os testes)
- [ ] Teste da validação de estoque (saída > estoque, negativa, zero) — o bug já corrigido não pode voltar.
- [ ] Testes de permissão do usuário demo e IDOR.
- [ ] Teste do endpoint de IA (auth obrigatória, throttle, 502 sem chave).
- [ ] Testes de auth (401 sem token, token inválido).
- [ ] Smoke E2E (Playwright): login demo, abre cada tela sem erro de console.
- [ ] `tsc -b`, `oxlint`, `npm run build` e `manage.py check` verdes.

## 7. Sign-off
- [ ] Todos os 🔴 e 🟠 corrigidos e re-testados.
- [ ] `QA_REPORT.md` do ciclo atualizado (data, o que passou/falhou, correções).
