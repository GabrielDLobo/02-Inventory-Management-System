import type { ReactNode } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TopbarProps {
  title: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  action?: ReactNode
}

// Topbar com busca opcional e o badge de "Modo demonstração" fixo à direita
// (design-system.md §5 e §7: a demo precisa se anunciar como tal).
export function Topbar({ title, searchPlaceholder, onSearch, action }: TopbarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-[18px] border-b border-line bg-bg/85 px-[30px] py-3.5 backdrop-blur">
      <h1 className="text-[19px] font-semibold text-ink">{title}</h1>

      {onSearch && (
        <label className="ml-2 flex max-w-[340px] flex-1 items-center gap-2 rounded-[11px] border border-line bg-surface px-3.5 py-2 text-muted">
          <MagnifyingGlassIcon className="h-4 w-4 flex-none" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full border-0 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted"
          />
        </label>
      )}

      <div className="ml-auto flex items-center gap-3">
        {action}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-[7px] text-xs font-semibold text-cyan-700">
          <i className="h-[7px] w-[7px] animate-pulse rounded-full bg-cyan-600 motion-reduce:animate-none" aria-hidden="true" />
          Modo demonstração
        </span>
      </div>
    </div>
  )
}
