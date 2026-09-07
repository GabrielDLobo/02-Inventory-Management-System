"""Smoke E2E do SGE: loga como demo e abre cada tela da sidebar, checando
que carrega sem erro de console. Não substitui os testes de tests/ (esses
cobrem regras de negócio); este script cobre "a tela renderiza de ponta a
ponta contra a API real", que só um navegador de verdade testa.

Pré-requisitos (rodar em dois terminais antes deste script):
  1. Backend:  python manage.py runserver 127.0.0.1:8000
  2. Frontend: cd frontend && npm run dev  (porta 5173)
  3. Dados:    python manage.py seed_demo

Uso:
  python e2e/smoke_test.py
  python e2e/smoke_test.py --headed        # ver o navegador rodando
  python e2e/smoke_test.py --base-url https://frontend-vert-seven-86.vercel.app
"""

import argparse
import sys

from playwright.sync_api import sync_playwright

SCREENS = [
    ("/", "Dashboard", "Visão geral do estoque"),
    ("/produtos", "Produtos", "Produtos cadastrados"),
    ("/categorias", "Categorias", "Categorias"),
    ("/marcas", "Marcas", "Marcas"),
    ("/fornecedores", "Fornecedores", "Fornecedores"),
    ("/entradas", "Entradas", "Entradas registradas"),
    ("/saidas", "Saídas", "Saídas registradas"),
    ("/assistente", "Assistente IA", "Análise do assistente"),
    ("/relatorios", "Relatórios", "Valor de estoque por categoria"),
]

# Ruído conhecido e inofensivo neste projeto (ver docs/QA_REPORT.md): perda
# de contexto WebGL é comum em navegador headless/sandboxed e o
# Scene3D/AmbientCube já degrada de forma graciosa quando isso acontece.
IGNORED_CONSOLE_SNIPPETS = [
    'THREE.WebGLRenderer: Context Lost',
    'THREE.Clock: This module has been deprecated',
]


def run(base_url: str, headed: bool) -> int:
    failures: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headed)
        page = browser.new_page()
        console_errors: list[str] = []
        page.on(
            'console',
            lambda msg: console_errors.append(f'{msg.location.get("url", "?")}: {msg.text}')
            if msg.type == 'error' and not any(s in msg.text for s in IGNORED_CONSOLE_SNIPPETS)
            else None,
        )
        page.on('pageerror', lambda exc: console_errors.append(f'pageerror: {exc}'))

        print(f'== Login ({base_url}/login) ==')
        page.goto(f'{base_url}/login', wait_until='networkidle')
        # Os campos não têm id fixo (useId do React); seleciona pelo label.
        page.get_by_label('Usuário').fill('demo')
        page.get_by_label('Senha').fill('demo1234')
        page.get_by_role('button', name='Entrar no sistema').click()
        page.wait_for_url(f'{base_url}/', timeout=15000)
        print('  login ok, redirecionou pro dashboard')

        for path, label, expected_text in SCREENS:
            console_errors.clear()
            url = f'{base_url}{path}'
            print(f'== {label} ({url}) ==')
            try:
                page.goto(url, wait_until='networkidle', timeout=20000)
                page.wait_for_selector(f'text={expected_text}', timeout=10000)
            except Exception as exc:  # noqa: BLE001 — smoke test: qualquer falha aqui é reportável
                failures.append(f'{label}: não carregou ("{expected_text}" não apareceu) — {exc}')
                continue

            if console_errors:
                failures.append(f'{label}: {len(console_errors)} erro(s) de console: {console_errors}')
            else:
                print(f'  ok — "{expected_text}" visível, sem erro de console')

        browser.close()

    print()
    if failures:
        print(f'FALHOU ({len(failures)}):')
        for failure in failures:
            print(f'  - {failure}')
        return 1

    print(f'OK — {len(SCREENS)} telas + login, sem erro de console.')
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--base-url', default='http://localhost:5173')
    parser.add_argument('--headed', action='store_true')
    args = parser.parse_args()
    sys.exit(run(args.base_url, args.headed))
