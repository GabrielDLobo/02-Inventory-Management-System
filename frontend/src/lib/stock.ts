import type { StockStatus } from '@/components/ui/StatusPill'

// O model Product não tem campo de estoque mínimo (CLAUDE.md): "baixo" é
// heurística de produto (< 10 un.). Para dar às três variantes visuais do
// StatusPill algum sentido, dividimos essa heurística em duas faixas —
// "crítico" abaixo da metade do limite, "baixo" no restante da faixa.
export const LOW_STOCK_THRESHOLD = 10
export const CRITICAL_STOCK_THRESHOLD = 5

export function getStockStatus(quantity: number): StockStatus {
  if (quantity < CRITICAL_STOCK_THRESHOLD) return 'critical'
  if (quantity < LOW_STOCK_THRESHOLD) return 'low'
  return 'ok'
}

export function isLowStock(quantity: number): boolean {
  return quantity < LOW_STOCK_THRESHOLD
}
