import { useCallback, useEffect, useState } from 'react'
import { productsService } from '@/services/api/products'
import { categoriesService } from '@/services/api/categories'
import { suppliersService } from '@/services/api/suppliers'
import { inflowsService } from '@/services/api/inflows'
import { outflowsService } from '@/services/api/outflows'
import { buildDashboardData } from './buildDashboardData'
import type { DashboardData } from './types'

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardData }

const GENERIC_ERROR_MESSAGE = 'Não foi possível carregar os dados do estoque agora.'

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    // Efeito de busca de dados padrão: sincroniza com a API (sistema
    // externo) toda vez que reloadToken muda. As chamadas a setState aqui
    // dentro (loading/success/error) são o próprio propósito do efeito, não
    // um valor derivável durante o render.
    /* oxlint-disable react/set-state-in-effect */
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([
      productsService.list(),
      categoriesService.list(),
      suppliersService.list(),
      inflowsService.list(),
      outflowsService.list(),
    ])
      .then(([products, categories, suppliers, inflows, outflows]) => {
        if (cancelled) return
        const data = buildDashboardData({ products, categories, suppliers, inflows, outflows })
        setState({ status: 'success', data })
      })
      .catch(() => {
        if (cancelled) return
        setState({ status: 'error', message: GENERIC_ERROR_MESSAGE })
      })
    /* oxlint-enable react/set-state-in-effect */

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  return { ...state, reload }
}
