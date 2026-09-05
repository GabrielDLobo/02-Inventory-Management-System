import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from '@/services/auth/tokenStorage'

const AUTH_TOKEN_PATH = '/authentication/token/'

let onAuthExpiredHandler: (() => void) | null = null

// Chamado uma vez, na inicialização do app (ver src/App.tsx), para reagir a
// uma sessão que expirou de fato (refresh também falhou) sem acoplar esta
// camada de API ao roteador.
export function setOnAuthExpired(handler: () => void): void {
  onAuthExpiredHandler = handler
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && !config.url?.includes(AUTH_TOKEN_PATH)) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

// Evita disparar N refreshes em paralelo quando várias chamadas tomam 401 ao
// mesmo tempo: todas esperam a mesma promise de refresh em andamento.
let refreshInFlight: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken()
  if (!refresh) {
    throw new Error('Sem refresh token disponível.')
  }

  const response = await axios.post<{ access: string }>(
    `${import.meta.env.VITE_API_BASE_URL}/authentication/token/refresh/`,
    { refresh },
  )
  setAccessToken(response.data.access)
  return response.data.access
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const isAuthEndpoint = config?.url?.includes(AUTH_TOKEN_PATH)

    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
      throw error
    }

    config._retried = true

    try {
      refreshInFlight ??= refreshAccessToken().finally(() => {
        refreshInFlight = null
      })
      const access = await refreshInFlight
      config.headers.set('Authorization', `Bearer ${access}`)
      return await apiClient.request(config)
    } catch (refreshError) {
      clearTokens()
      onAuthExpiredHandler?.()
      throw refreshError
    }
  },
)
