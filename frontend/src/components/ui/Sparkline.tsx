interface SparklineProps {
  /** Série real (nunca inventada) usada só como traço decorativo. */
  values: number[]
  className?: string
}

// Mini-gráfico de linha sem eixos, decorativo, sobre um StatKPI.
export function Sparkline({ values, className }: SparklineProps) {
  if (values.length < 2) return null

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * 100},${100 - ((value - min) / range) * 100}`)
    .join(' ')

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
