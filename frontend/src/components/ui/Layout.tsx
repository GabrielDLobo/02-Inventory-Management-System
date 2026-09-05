import type { ReactNode } from 'react'
import { Sidebar, type NavGroup } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
  groups: NavGroup[]
  activeHref: string
  username: string
  title: string
  onNavigate?: (href: string) => void
  onLogout: () => void
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  children: ReactNode
}

// Casca de tela para tudo que fica atrás do login (design-system.md §5).
export function Layout({
  groups,
  activeHref,
  username,
  title,
  onNavigate,
  onLogout,
  searchPlaceholder,
  onSearch,
  children,
}: LayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-[248px_1fr] bg-bg max-[900px]:grid-cols-1">
      <div className="max-[900px]:hidden">
        <Sidebar groups={groups} activeHref={activeHref} username={username} onNavigate={onNavigate} onLogout={onLogout} />
      </div>
      <div className="min-w-0">
        <Topbar title={title} searchPlaceholder={searchPlaceholder} onSearch={onSearch} />
        <main className="max-w-[1180px] px-[30px] pb-11 pt-[26px]">{children}</main>
      </div>
    </div>
  )
}
