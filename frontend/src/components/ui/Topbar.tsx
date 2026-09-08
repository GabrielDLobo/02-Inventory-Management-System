import { Bars3Icon } from '@heroicons/react/24/outline'

interface TopbarProps {
  onOpenNav: () => void
}

// Abaixo de lg, a sidebar vira um drawer (Sidebar com onClose) e esta barra
// é o único jeito de abri-la — por isso ela some no desktop (design v2: o
// título/busca/badge de demo agora moram no PageHero de cada tela).
export function Topbar({ onOpenNav }: TopbarProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Abrir menu"
        className="rounded-lg p-1.5 text-ink transition hover:bg-surface-2"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <span className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-cyan to-violet">
          <span className="font-display text-[10px] font-bold text-dark">SG</span>
        </span>
        <span className="font-display text-sm font-bold text-ink">
          S<span className="text-cyan-700">GE</span>
        </span>
      </span>
    </div>
  )
}
