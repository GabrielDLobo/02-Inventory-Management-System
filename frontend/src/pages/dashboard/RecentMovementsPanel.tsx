import { ArrowDownIcon, ArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { formatRelativeTime } from '@/lib/format'
import { LOW_STOCK_THRESHOLD } from '@/lib/stock'
import type { MovementFeedItem } from './types'

interface RecentMovementsPanelProps {
  movements: MovementFeedItem[]
}

export function RecentMovementsPanel({ movements }: RecentMovementsPanelProps) {
  if (movements.length === 0) {
    return <p className="text-sm text-muted">Nenhuma movimentação registrada ainda.</p>
  }

  return (
    <div className="flex flex-col">
      {movements.map((movement) => (
        <MovementRow key={`${movement.kind}-${movement.id}`} movement={movement} />
      ))}
    </div>
  )
}

function MovementRow({ movement }: { movement: MovementFeedItem }) {
  if (movement.kind === 'alert') {
    return (
      <div className="flex gap-3 border-b border-line-2 py-[11px] last:border-b-0">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-warning/15 text-[#B45309]">
          <ExclamationTriangleIcon className="h-4 w-4" />
        </span>
        <div className="text-[13px] leading-snug">
          <span className="font-semibold">Alerta</span> {movement.productTitle} abaixo do mínimo
          <span className="mt-0.5 block text-[11.5px] text-muted">
            restam {movement.quantity} un. · mínimo heurístico {LOW_STOCK_THRESHOLD}
          </span>
        </div>
      </div>
    )
  }

  const isInflow = movement.kind === 'inflow'

  return (
    <div className="flex gap-3 border-b border-line-2 py-[11px] last:border-b-0">
      <span
        className={
          isInflow
            ? 'grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-success/10 text-[#047857]'
            : 'grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-danger/10 text-[#BE123C]'
        }
      >
        {isInflow ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1 text-[13px] leading-snug">
        <span className="font-semibold">{isInflow ? 'Entrada' : 'Saída'}</span> {movement.productTitle}
        <span className="mt-0.5 block truncate text-[11.5px] text-muted">
          {isInflow ? `Fornecedor ${movement.supplierName}` : (movement.description ?? 'Sem observações')} ·{' '}
          {formatRelativeTime(movement.createdAt)}
        </span>
      </div>
      <span className={`self-center font-mono font-tabular text-[13px] font-semibold ${isInflow ? 'text-[#047857]' : 'text-[#BE123C]'}`}>
        {isInflow ? '+' : '−'}
        {movement.quantity}
      </span>
    </div>
  )
}
