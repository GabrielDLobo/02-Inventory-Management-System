import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PageBodyProps {
  children: ReactNode
  className?: string
}

// Conteúdo claro que "sobe" sobre o PageHero escuro via margem negativa
// (design-system.md §6, Layout v2). Só cuida de posicionamento/espaçamento —
// cada Card mantém seu próprio fundo e sombra.
export function PageBody({ children, className }: PageBodyProps) {
  return (
    <div className={cn('relative z-10 mx-auto -mt-8 max-w-[1180px] px-4 pb-11 sm:px-[30px]', className)}>
      {children}
    </div>
  )
}
