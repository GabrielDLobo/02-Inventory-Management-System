export interface CategoryReportRow {
  categoryId: number
  name: string
  productCount: number
  units: number
  stockValue: number
}

export interface TopProductRow {
  id: number
  title: string
  categoryName: string
  quantity: number
  stockValue: number
}

export type MovementHistoryRow =
  | { kind: 'inflow'; id: number; productTitle: string; supplierName: string; quantity: number; createdAt: string }
  | { kind: 'outflow'; id: number; productTitle: string; quantity: number; createdAt: string }

export interface ReportsData {
  categoryReport: CategoryReportRow[]
  topProducts: TopProductRow[]
  movementHistory: MovementHistoryRow[]
}
