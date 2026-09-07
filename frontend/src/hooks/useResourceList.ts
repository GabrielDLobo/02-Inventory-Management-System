import { useCallback, useEffect, useState } from 'react'

type ResourceListState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T[] }

const GENERIC_ERROR_MESSAGE = 'Não foi possível carregar os dados agora.'

// Hook de busca de lista padrão (loading/erro/sucesso), usado por toda tela
// de listagem da Fase 3. `reload()` também serve pra recarregar depois de
// criar/editar/excluir um registro.
export function useResourceList<T>(fetcher: () => Promise<T[]>) {
  const [state, setState] = useState<ResourceListState<T>>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    /* oxlint-disable react/set-state-in-effect -- sincronizando com a API
       (sistema externo) toda vez que reloadToken muda; não é estado
       derivável durante o render. */
    let cancelled = false
    setState({ status: 'loading' })

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
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
