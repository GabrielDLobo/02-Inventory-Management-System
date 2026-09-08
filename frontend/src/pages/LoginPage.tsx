import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowsRightLeftIcon, ChartBarIcon, CubeIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/authContext'
import { Scene3D } from '@/components/three/Scene3D'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const DEMO_USERNAME = 'demo'
const DEMO_PASSWORD = 'demo1234'

const HIGHLIGHTS = [
  { icon: ChartBarIcon, label: 'Controle de estoque em tempo real' },
  { icon: ArrowsRightLeftIcon, label: 'Entradas e saídas com histórico completo' },
  { icon: SparklesIcon, label: 'Assistente de IA integrado' },
]

function loadLoginHero() {
  return import('@/components/three/scenes/LoginHero')
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState(DEMO_USERNAME)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleLogin(user: string, pass: string) {
    setError(null)
    setIsSubmitting(true)
    try {
      await login(user, pass)
      navigate('/', { replace: true })
    } catch {
      setError('Usuário ou senha incorretos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    void handleLogin(username, password)
  }

  function handleDemoLogin() {
    setUsername(DEMO_USERNAME)
    setPassword(DEMO_PASSWORD)
    void handleLogin(DEMO_USERNAME, DEMO_PASSWORD)
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-dark">
      <Scene3D loadScene={loadLoginHero} className="absolute inset-0" cameraPosition={[0, 0, 6]} fov={55} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 42%, rgba(34,211,238,.16), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative flex h-full items-center justify-center overflow-y-auto p-6">
        <div className="flex w-full max-w-[1180px] items-center justify-center gap-16">
          {/* Bloco de marca — some abaixo de 960px, o card de vidro fica centralizado sozinho. */}
          <div className="hidden flex-1 min-[960px]:block">
            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan to-violet shadow-glow">
                <CubeIcon className="h-6 w-6 text-dark" />
              </span>
              <span className="font-display text-2xl font-bold tracking-[-.02em] text-[#EAF2F6]">
                S<span className="text-cyan">GE</span> Estoque
              </span>
            </div>

            <h1 className="max-w-lg font-display text-4xl font-bold leading-[1.15] tracking-[-.02em] text-[#EAF2F6]">
              Visão completa do estoque,{' '}
              <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                da entrada à saída
              </span>
              .
            </h1>
            <p className="mb-8 mt-4 max-w-md text-[15px] leading-relaxed text-[#8CA0AD]">
              Controle de produtos, entradas, saídas e fornecedores.
            </p>

            <ul className="flex flex-col gap-3.5">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-[#CFE0E8]">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-cyan/10 text-cyan">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Card de vidro com o formulário. */}
          <div className="w-full max-w-[410px] rounded-[22px] border border-cyan/[.22] bg-[rgba(9,14,26,.55)] p-8 text-[#EAF2F6] shadow-[0_24px_70px_rgba(0,0,0,.55)] backdrop-blur-[16px]">
            <div className="mb-1 flex items-center gap-[11px] min-[960px]:hidden">
              <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-gradient-to-br from-cyan to-violet shadow-glow">
                <CubeIcon className="h-[19px] w-[19px] text-dark" />
              </span>
              <span className="font-display text-xl font-bold tracking-[-.02em]">
                S<span className="text-cyan">GE</span> Estoque
              </span>
            </div>
            <p className="mb-[26px] mt-0.5 text-[13px] text-[#8CA0AD] min-[960px]:hidden">
              Controle de produtos, entradas, saídas e fornecedores.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <Input
                tone="dark"
                label="Usuário"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isSubmitting}
                required
              />
              <Input
                tone="dark"
                label="Senha"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />

              {error && (
                <p role="alert" className="-mt-1 mb-3.5 text-xs text-[#FCA5A5]">
                  {error}
                </p>
              )}

              <Button type="submit" className="mt-1.5 w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar no sistema'}
              </Button>
            </form>

            <div className="mt-[22px] rounded-[13px] border border-dashed border-cyan/30 bg-cyan/5 p-[15px]">
              <span className="mb-[9px] inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-cyan">
                <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan shadow-glow motion-reduce:animate-none" aria-hidden="true" />
                Ambiente de demonstração
              </span>
              <p className="mb-3 text-xs leading-relaxed text-[#9DB1BD]">
                Dados fictícios, reiniciados periodicamente. Acesse com{' '}
                <b className="font-mono text-[#CFE0E8]">demo</b> / <b className="font-mono text-[#CFE0E8]">demo1234</b>.
              </p>
              <Button type="button" className="w-full shadow-none" disabled={isSubmitting} onClick={handleDemoLogin}>
                Entrar na demonstração
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
