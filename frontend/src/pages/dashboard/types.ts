import type { StockStatus } from '@/components/ui/StatusPill'

export interface CategoryStock {
  categoryId: number
  name: string
  units: number
}

export interface LowStockRow {
  id: number
  title: string
  serieNumber: string | null
  categoryName: string
  supplierName: string
  quantity: number
  status: StockStatus
}

export type MovementFeedItem =
  | {
      kind: 'inflow'
      id: number
      productTitle: string
      supplierName: string
      quantity: number
      createdAt: string
      description: string | null
    }
  | {
      kind: 'outflow'
      id: number
      productTitle: string
      quantity: number
      createdAt: string
      description: string | null
    }
  | {
      kind: 'alert'
      id: string
      productTitle: string
      quantity: number
    }

export interface DashboardData {
  productCount: number
  newProductsThisMonth: number
  totalUnits: number
  stockValue: number
  lowStockCount: number
  categoryStock: CategoryStock[]
  movements: MovementFeedItem[]
  lowStockProducts: LowStockRow[]
}
