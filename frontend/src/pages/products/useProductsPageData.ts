import { useCallback, useEffect, useState } from 'react'
import { productsService } from '@/services/api/products'
import { categoriesService } from '@/services/api/categories'
import { brandsService } from '@/services/api/brands'
import type { Brand, Category, Product } from '@/services/api/types'

interface ProductsPageData {
  products: Product[]
  categories: Category[]
  brands: Brand[]
}

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: ProductsPageData }

const GENERIC_ERROR_MESSAGE = 'Não foi possível carregar os produtos agora.'

// Junto com products, busca categories/brands: a lista de produtos só traz
// os IDs de category/brand (fields = '__all__' com PrimaryKeyRelatedField),
// então o nome de cada um precisa vir de uma consulta à parte pra exibir na
// tabela e alimentar os selects do formulário.
export function useProductsPageData() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    /* oxlint-disable react/set-state-in-effect -- sincronizando com a API a
       cada reloadToken, não é estado derivável durante o render. */
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([productsService.list(), categoriesService.list(), brandsService.list()])
      .then(([products, categories, brands]) => {
        if (!cancelled) setState({ status: 'success', data: { products, categories, brands } })
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
