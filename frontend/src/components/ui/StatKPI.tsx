import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/cn'

type StatKPITone = 'cyan' | 'violet' | 'human' | 'warning'
type StatKPIDeltaTone = 'up' | 'down' | 'flat' | 'warn'

interface StatKPIProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  tone?: StatKPITone
  label: string
  value: string
  delta?: string
  deltaTone?: StatKPIDeltaTone
}

const TONE_CLASSES: Record<StatKPITone, string> = {
  cyan: 'bg-cyan/10 text-cyan-700',
  violet: 'bg-violet/10 text-violet',
  human: 'bg-human/15 text-[#E06A3C]',
  warning: 'bg-warning/15 text-[#B45309]',
}

const DELTA_CLASSES: Record<StatKPIDeltaTone, string> = {
  up: 'text-success',
  down: 'text-danger',
  flat: 'text-muted',
  warn: 'text-[#B45309]',
}

// KPI do dashboard de estoque (design-system.md §5): ícone colorido, número
// grande em fonte de display com tabular-nums, e um delta opcional.
export function StatKPI({ icon: Icon, tone = 'cyan', label, value, delta, deltaTone = 'flat' }: StatKPIProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-[18px] shadow-sm">
      <div className={cn('mb-3.5 grid h-[38px] w-[38px] place-items-center rounded-[10px]', TONE_CLASSES[tone])}>
        <Icon className="h-5 w-5" />
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
