import { useEffect, useState, type ReactNode } from 'react'
import * as authService from '@/services/auth/authService'
import { setOnAuthExpired } from '@/services/api/client'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => authService.getUsername())

  useEffect(() => {
    // Se o refresh do JWT falhar (refresh token vencido/inválido), a sessão
    // acabou de fato: derruba o estado local pra <ProtectedRoute> mandar de
    // volta pro login, sem essa camada de API conhecer o roteador.
    setOnAuthExpired(() => setUsername(null))
  }, [])

  async function login(user: string, password: string) {
    await authService.login(user, password)
    setUsername(user)
  }

  function logout() {
    authService.logout()
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ username, isAuthenticated: username !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
