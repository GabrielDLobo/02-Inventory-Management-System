import type { Category, Inflow, Outflow, Product, Supplier } from '@/services/api/types'
import type { CategoryReportRow, MovementHistoryRow, ReportsData, TopProductRow } from './types'

const TOP_PRODUCTS_LIMIT = 5

interface RawReportsInput {
  products: Product[]
  categories: Category[]
  suppliers: Supplier[]
  inflows: Inflow[]
  outflows: Outflow[]
}

// Assim como o dashboard (pages/dashboard/buildDashboardData.ts), tudo aqui
// roda no cliente: não há endpoint de relatórios na API.
export function buildReportsData(input: RawReportsInput): ReportsData {
  const { products, categories, suppliers, inflows, outflows } = input

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))
  const supplierNameById = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]))
  const productById = new Map(products.map((product) => [product.id, product]))

  const byCategory = new Map<number, { productCount: number; units: number; stockValue: number }>()
  for (const product of products) {
    const current = byCategory.get(product.category) ?? { productCount: 0, units: 0, stockValue: 0 }
    current.productCount += 1
    current.units += product.quantity
    current.stockValue += Number(product.cost_price) * product.quantity
    byCategory.set(product.category, current)
  }

  const categoryReport: CategoryReportRow[] = categories
    .map((category) => {
      const totals = byCategory.get(category.id) ?? { productCount: 0, units: 0, stockValue: 0 }
      return {
        categoryId: category.id,
        name: category.name,
        productCount: totals.productCount,
        units: totals.units,
        stockValue: totals.stockValue,
      }
    })
    .filter((row) => row.productCount > 0)
    .sort((a, b) => b.stockValue - a.stockValue)

  const topProducts: TopProductRow[] = [...products]
    .map((product) => ({
      id: product.id,
      title: product.title,
      categoryName: categoryNameById.get(product.category) ?? '—',
      quantity: product.quantity,
      stockValue: Number(product.cost_price) * product.quantity,
    }))
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, TOP_PRODUCTS_LIMIT)

  const inflowRows = inflows.map(
    (inflow) =>
      ({
        kind: 'inflow',
        id: inflow.id,
        productTitle: productById.get(inflow.product)?.title ?? 'Produto removido',
        supplierName: supplierNameById.get(inflow.supplier) ?? '—',
        quantity: inflow.quantity,
        createdAt: inflow.created_at,
      }) satisfies MovementHistoryRow,
  )

  const outflowRows = outflows.map(
    (outflow) =>
      ({
        kind: 'outflow',
        id: outflow.id,
        productTitle: productById.get(outflow.product)?.title ?? 'Produto removido',
        quantity: outflow.quantity,
        createdAt: outflow.created_at,
      }) satisfies MovementHistoryRow,
  )

  const movementHistory = [...inflowRows, ...outflowRows].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  return { categoryReport, topProducts, movementHistory }
}
