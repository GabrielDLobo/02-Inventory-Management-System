import { useCallback, useEffect, useState } from 'react'
import { productsService } from '@/services/api/products'
import { categoriesService } from '@/services/api/categories'
import { suppliersService } from '@/services/api/suppliers'
import { inflowsService } from '@/services/api/inflows'
import { outflowsService } from '@/services/api/outflows'
import { buildReportsData } from './buildReportsData'
import type { ReportsData } from './types'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: ReportsData }

const GENERIC_ERROR_MESSAGE = 'Não foi possível carregar os relatórios agora.'

export function useReportsData() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    /* oxlint-disable react/set-state-in-effect -- sincronizando com a API a
       cada reloadToken, não é estado derivável durante o render. */
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
        const data = buildReportsData({ products, categories, suppliers, inflows, outflows })
        setState({ status: 'success', data })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', message: GENERIC_ERROR_MESSAGE })
      })
    /* oxlint-enable react/set-state-in-effect */

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  return { ...state, reload }
}
