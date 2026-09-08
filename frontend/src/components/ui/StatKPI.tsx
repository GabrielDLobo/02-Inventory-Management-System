import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/cn'
import { Sparkline } from './Sparkline'

type StatKPITone = 'cyan' | 'violet' | 'human' | 'warning'
type StatKPIDeltaTone = 'up' | 'down' | 'flat' | 'warn'

interface StatKPIProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  tone?: StatKPITone
  label: string
  value: string
  delta?: string
  deltaTone?: StatKPIDeltaTone
  /** Série real opcional (ex.: unidades por categoria) para o mini-gráfico. */
  sparkline?: number[]
}

const TONE_CLASSES: Record<StatKPITone, string> = {
  cyan: 'bg-cyan/10 text-cyan-700',
  violet: 'bg-violet/10 text-violet',
  human: 'bg-human/15 text-[#E06A3C]',
  warning: 'bg-warning/15 text-[#B45309]',
}

const TONE_BAR_CLASSES: Record<StatKPITone, string> = {
  cyan: 'from-cyan to-cyan-600',
  violet: 'from-violet to-cyan',
  human: 'from-human to-violet',
  warning: 'from-warning to-human',
}

const DELTA_CLASSES: Record<StatKPIDeltaTone, string> = {
  up: 'text-success',
  down: 'text-danger',
  flat: 'text-muted',
  warn: 'text-[#B45309]',
}

// KPI do dashboard de estoque (design-system.md §5, evoluído pro Layout v2):
// barra de gradiente no topo, ícone colorido, número grande e um mini-
// gráfico opcional sobre dado real (nunca uma tendência inventada).
export function StatKPI({ icon: Icon, tone = 'cyan', label, value, delta, deltaTone = 'flat', sparkline }: StatKPIProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-[18px] pt-[21px] shadow-sm">
      <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', TONE_BAR_CLASSES[tone])} />

      <div className="flex items-start justify-between gap-3">
        <div className={cn('mb-3.5 grid h-[38px] w-[38px] flex-none place-items-center rounded-[10px]', TONE_CLASSES[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline values={sparkline} className={cn('h-8 w-20', TONE_CLASSES[tone].split(' ')[1])} />
        )}
      </div>

      <div className="text-[12.5px] font-medium text-muted">{label}</div>
      <div className="font-tabular mt-[3px] font-display text-3xl font-bold tracking-[-.02em] text-ink">
        {value}
      </div>
      {delta && (
        <div className={cn('mt-[7px] text-[11.5px] font-semibold', DELTA_CLASSES[deltaTone])}>{delta}</div>
      )}
    </div>
  )
}
