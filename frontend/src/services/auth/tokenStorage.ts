// Sessão por usuário (login é por username, não e-mail: authentication/urls.py
// só expõe TokenObtainPairView/TokenRefreshView/TokenVerifyView do SimpleJWT,
// sem endpoint de perfil). O token de acesso não carrega o username como claim
// (serializer padrão do SimpleJWT), então guardamos o que o usuário digitou no
// login à parte, só para exibição (topbar, sidebar).

const ACCESS_KEY = 'sge.auth.access'
const REFRESH_KEY = 'sge.auth.refresh'
const USERNAME_KEY = 'sge.auth.username'

export interface AuthTokens {
  access: string
  refresh: string
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY)
}

export function setTokens(tokens: AuthTokens, username: string): void {
  localStorage.setItem(ACCESS_KEY, tokens.access)
  localStorage.setItem(REFRESH_KEY, tokens.refresh)
  localStorage.setItem(USERNAME_KEY, username)
}

export function setAccessToken(access: string): void {
  localStorage.setItem(ACCESS_KEY, access)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USERNAME_KEY)
}
