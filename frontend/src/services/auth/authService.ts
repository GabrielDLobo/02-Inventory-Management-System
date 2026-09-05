import { apiClient } from '@/services/api/client'
import { clearTokens, getAccessToken, getUsername, setTokens } from './tokenStorage'

interface TokenPairResponse {
  access: string
  refresh: string
}

export async function login(username: string, password: string): Promise<void> {
  const { data } = await apiClient.post<TokenPairResponse>('/authentication/token/', {
    username,
    password,
  })
  setTokens(data, username)
}

export function logout(): void {
  clearTokens()
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}

export { getUsername }
