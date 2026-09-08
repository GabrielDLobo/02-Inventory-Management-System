import type { ComponentType, SVGProps } from 'react'
import { ArrowLeftStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'

export interface NavItem {
  key: string
  label: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  badge?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

interface SidebarProps {
  groups: NavGroup[]
  activeHref: string
  username: string
  onNavigate?: (href: string) => void
  onLogout: () => void
  /** Presente só no modo drawer (mobile): renderiza o botão de fechar. */
  onClose?: () => void
}

// Sidebar + Nav do SGE (design-system.md §5, evoluída pro Layout v2: 264px,
// barra de brilho no item ativo). `onNavigate` fica opcional porque a Fase 1
// ainda não tinha roteador; a Fase 2 já usa react-router normalmente.
export function Sidebar({ groups, activeHref, username, onNavigate, onLogout, onClose }: SidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[264px] flex-none flex-col gap-1 border-r border-line bg-surface p-4">
      <div className="flex items-center gap-2.5 px-2 pb-5 pt-1.5">
        <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-gradient-to-br from-cyan to-violet shadow-glow">
          <span className="font-display text-xs font-bold text-dark">SG</span>
        </span>
        <span className="font-display text-[17px] font-bold tracking-[-.02em] text-ink">
          S<span className="text-cyan-700">GE</span>
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="ml-auto rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-2.5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[.1em] text-muted">
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = item.href === activeHref
              const Icon = item.icon
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(event) => {
                    if (!onNavigate) return
                    event.preventDefault()
                    onNavigate(item.href)
                  }}
                  className={cn(
                    'relative flex items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-[13.5px] font-medium text-muted transition',
                    'hover:bg-surface-2 hover:text-ink',
                    active && 'bg-gradient-to-r from-cyan/15 to-cyan/5 font-semibold text-cyan-700',
                  )}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-gradient-to-b from-cyan to-violet shadow-glow"
                    />
                  )}
                  <Icon className={cn('h-[18px] w-[18px] flex-none', active && 'text-cyan-600')} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-violet/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[.05em] text-violet">
                      {item.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 rounded-[11px] border border-line bg-surface-2 p-2.5">
        <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] bg-gradient-to-br from-violet to-cyan font-display text-xs font-semibold text-white">
          {username.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 text-[12.5px] leading-tight">
          <span className="block truncate font-semibold text-ink">{username}</span>
          <span className="text-[11px] text-muted">Ambiente de demonstração</span>
        </span>
        <button
          type="button"
          onClick={onLogout}
          title="Sair"
          aria-label="Sair"
          className="ml-auto text-muted transition hover:text-danger"
        >
          <ArrowLeftStartOnRectangleIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </aside>
  )
}
