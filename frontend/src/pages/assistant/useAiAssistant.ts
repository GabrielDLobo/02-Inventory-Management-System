import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { aiService } from '@/services/api/ai'
import type { AIResult } from '@/services/api/types'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: AIResult | null }

const GENERIC_ERROR_MESSAGE = 'Não foi possível carregar a análise agora.'

export function useAiAssistant() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [isInvoking, setIsInvoking] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    /* oxlint-disable react/set-state-in-effect -- sincronizando com a API a
       cada reloadToken, não é estado derivável durante o render. */
    let cancelled = false
    setState({ status: 'loading' })

    aiService
      .latest()
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
  }, [reloadToken])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  async function invoke(): Promise<{ ok: true } | { ok: false; message: string }> {
    setIsInvoking(true)
    try {
      const data = await aiService.invoke()
      setState({ status: 'success', data })
      return { ok: true }
    } catch (error) {
      const message = isAxiosError<{ detail?: string }>(error)
        ? (error.response?.data?.detail ?? GENERIC_ERROR_MESSAGE)
        : GENERIC_ERROR_MESSAGE
      return { ok: false, message }
    } finally {
      setIsInvoking(false)
    }
  }

  return { ...state, reload, invoke, isInvoking }
}
