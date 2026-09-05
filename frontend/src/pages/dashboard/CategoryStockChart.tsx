import { formatNumber } from '@/lib/format'
import type { CategoryStock } from './types'

interface CategoryStockChartProps {
  categories: CategoryStock[]
}

// Barras simples em CSS (design-system.md: "Gráfico: estoque por categoria,
// barras, uma cor cyan"): não precisa de biblioteca de gráficos pra isso.
export function CategoryStockChart({ categories }: CategoryStockChartProps) {
  if (categories.length === 0) {
    return <p className="text-sm text-muted">Nenhum produto com estoque cadastrado ainda.</p>
  }

  const max = Math.max(...categories.map((category) => category.units))

  return (
    <div className="flex flex-col gap-[11px]">
      {categories.map((category) => (
        <div key={category.categoryId} className="grid grid-cols-[96px_1fr_46px] items-center gap-3">
          <span className="truncate text-[12.5px] font-medium text-ink">{category.name}</span>
          <div className="h-3 overflow-hidden rounded-full bg-line-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan shadow-glow"
              style={{ width: `${max === 0 ? 0 : (category.units / max) * 100}%` }}
            />
          </div>
          <span className="font-mono font-tabular text-right text-[12.5px] font-semibold text-muted">
            {formatNumber(category.units)}
          </span>
        </div>
      ))}
    </div>
  )
}
