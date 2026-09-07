import { useCallback, useEffect, useState } from 'react'
import { productsService } from '@/services/api/products'
import { suppliersService } from '@/services/api/suppliers'
import type { Product, Supplier } from '@/services/api/types'

interface MovementsPageData<TMovement> {
  movements: TMovement[]
  products: Product[]
  suppliers: Supplier[]
}

type State<TMovement> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: MovementsPageData<TMovement> }

const GENERIC_ERROR_MESSAGE = 'Não foi possível carregar os dados agora.'

// Usado por Entradas e Saídas: ambas as listas só trazem o ID do produto (e,
// no caso de entradas, do fornecedor), então products/suppliers vêm juntos
// pra resolver os nomes na tabela e alimentar os selects do formulário.
export function useMovementsPageData<TMovement>(listMovements: () => Promise<TMovement[]>) {
  const [state, setState] = useState<State<TMovement>>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    /* oxlint-disable react/set-state-in-effect -- sincronizando com a API a
       cada reloadToken, não é estado derivável durante o render. */
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([listMovements(), productsService.list(), suppliersService.list()])
      .then(([movements, products, suppliers]) => {
        if (!cancelled) setState({ status: 'success', data: { movements, products, suppliers } })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', message: GENERIC_ERROR_MESSAGE })
      })
    /* oxlint-enable react/set-state-in-effect */

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload deliberado só por reloadToken
  }, [reloadToken])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  return { ...state, reload }
}
