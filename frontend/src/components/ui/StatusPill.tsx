import { cn } from '@/lib/cn'

export type StockStatus = 'ok' | 'low' | 'critical'

const STATUS_CONFIG: Record<StockStatus, { label: string; classes: string; dot: string }> = {
  ok: { label: 'Normal', classes: 'bg-success/10 text-[#047857]', dot: 'bg-success' },
  low: { label: 'Baixo', classes: 'bg-warning/15 text-[#B45309]', dot: 'bg-warning' },
  critical: { label: 'Crítico', classes: 'bg-danger/10 text-[#BE123C]', dot: 'bg-danger' },
}

interface StatusPillProps {
  status: StockStatus
}

// Nunca usar cor sozinha para transmitir o status: sempre com o rótulo em
// texto ao lado do ponto colorido (design-system.md §1, "Semânticos").
export function StatusPill({ status }: StatusPillProps) {
  const { label, classes, dot } = STATUS_CONFIG[status]

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold', classes)}>
      <i className={cn('h-1.5 w-1.5 rounded-full', dot)} aria-hidden="true" />
      {label}
    </span>
  )
}
