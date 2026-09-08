import { useState, type ReactNode } from 'react'
import { Sidebar, type NavGroup } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
  groups: NavGroup[]
  activeHref: string
  username: string
  onNavigate?: (href: string) => void
  onLogout: () => void
  children: ReactNode
}

// Casca de tela para tudo que fica atrás do login (design-system.md §5,
// evoluída pro Layout v2). Abaixo de lg a sidebar some do fluxo e vira um
// drawer acionado pela Topbar (hambúrguer) em vez de simplesmente
// desaparecer sem substituto.
export function Layout({ groups, activeHref, username, onNavigate, onLogout, children }: LayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  function handleNavigate(href: string) {
    onNavigate?.(href)
    setIsMobileNavOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg lg:flex">
      <div className="hidden lg:block">
        <Sidebar groups={groups} activeHref={activeHref} username={username} onNavigate={onNavigate} onLogout={onLogout} />
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-dark/50"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 shadow-2xl">
            <Sidebar
              groups={groups}
              activeHref={activeHref}
              username={username}
              onNavigate={handleNavigate}
              onLogout={onLogout}
              onClose={() => setIsMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Topbar onOpenNav={() => setIsMobileNavOpen(true)} />
        {children}
      </div>
    </div>
  )
}
