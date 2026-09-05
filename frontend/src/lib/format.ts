const numberFormatter = new Intl.NumberFormat('pt-BR')

const compactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value)
}

const RELATIVE_UNITS: Array<{ limitSeconds: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { limitSeconds: 60, divisor: 1, unit: 'second' },
  { limitSeconds: 3600, divisor: 60, unit: 'minute' },
  { limitSeconds: 86400, divisor: 3600, unit: 'hour' },
  { limitSeconds: 2592000, divisor: 86400, unit: 'day' },
]

const relativeFormatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

// "há 14 min", "há 3 horas"... Datas do backend não têm timezone (USE_TZ =
// False), então tratamos created_at como horário local mesmo.
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const then = new Date(isoDate)
  const diffSeconds = Math.round((now.getTime() - then.getTime()) / 1000)

  if (diffSeconds < 5) return 'agora mesmo'

  for (const { limitSeconds, divisor, unit } of RELATIVE_UNITS) {
    if (diffSeconds < limitSeconds) {
      return relativeFormatter.format(-Math.round(diffSeconds / divisor), unit)
    }
  }

  const days = Math.round(diffSeconds / 86400)
  return relativeFormatter.format(-days, 'day')
}
