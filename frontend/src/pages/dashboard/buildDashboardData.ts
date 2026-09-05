import type { Category, Inflow, Outflow, Product, Supplier } from '@/services/api/types'
import { CRITICAL_STOCK_THRESHOLD, getStockStatus, isLowStock } from '@/lib/stock'
import type { DashboardData, MovementFeedItem } from './types'

const RECENT_MOVEMENTS_LIMIT = 6
const ALERT_ITEMS_LIMIT = 2

interface RawDashboardInput {
  products: Product[]
  categories: Category[]
  suppliers: Supplier[]
  inflows: Inflow[]
  outflows: Outflow[]
}

function isSameMonth(isoDate: string, reference: Date): boolean {
  const date = new Date(isoDate)
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth()
}

// Toda a agregação do dashboard roda no cliente: o backend não tem um
// endpoint de métricas na API (app/metrics.py só alimenta o template Django
// antigo), e as listas da API não trazem FK aninhada nem paginação (ver
// services/api/types.ts), então products/categories/suppliers/inflows/
// outflows precisam ser buscados e cruzados aqui.
export function buildDashboardData(input: RawDashboardInput, now: Date = new Date()): DashboardData {
  const { products, categories, suppliers, inflows, outflows } = input

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))
  const supplierNameById = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]))
  const productById = new Map(products.map((product) => [product.id, product]))

  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0)
  const stockValue = products.reduce((sum, product) => sum + Number(product.cost_price) * product.quantity, 0)
  const newProductsThisMonth = products.filter((product) => isSameMonth(product.created_at, now)).length
  const lowStockCount = products.filter((product) => isLowStock(product.quantity)).length

  const unitsByCategory = new Map<number, number>()
  for (const product of products) {
    unitsByCategory.set(product.category, (unitsByCategory.get(product.category) ?? 0) + product.quantity)
  }
  const categoryStock = categories
    .map((category) => ({
      categoryId: category.id,
      name: category.name,
      units: unitsByCategory.get(category.id) ?? 0,
    }))
    .filter((entry) => entry.units > 0)
    .sort((a, b) => b.units - a.units)

  // "Fornecedor" de um produto não existe no model (só a entrada guarda
  // quem forneceu aquele lote): usamos a entrada mais recente do produto
  // como fornecedor de referência pra tabela de estoque baixo.
  const latestSupplierByProduct = new Map<number, { supplierId: number; createdAt: string }>()
  for (const inflow of inflows) {
    const current = latestSupplierByProduct.get(inflow.product)
    if (!current || inflow.created_at > current.createdAt) {
      latestSupplierByProduct.set(inflow.product, { supplierId: inflow.supplier, createdAt: inflow.created_at })
    }
  }

  const lowStockProducts = products
    .filter((product) => isLowStock(product.quantity))
    .sort((a, b) => a.quantity - b.quantity)
    .map((product) => {
      const supplierId = latestSupplierByProduct.get(product.id)?.supplierId
      return {
        id: product.id,
        title: product.title,
        serieNumber: product.serie_number,
        categoryName: categoryNameById.get(product.category) ?? '—',
        supplierName: supplierId !== undefined ? (supplierNameById.get(supplierId) ?? '—') : '—',
        quantity: product.quantity,
        status: getStockStatus(product.quantity),
      }
    })

  const inflowMovements = inflows.map(
    (inflow) =>
      ({
        kind: 'inflow',
        id: inflow.id,
        productTitle: productById.get(inflow.product)?.title ?? 'Produto removido',
        supplierName: supplierNameById.get(inflow.supplier) ?? '—',
        quantity: inflow.quantity,
        createdAt: inflow.created_at,
        description: inflow.description,
      }) satisfies MovementFeedItem,
  )

  const outflowMovements = outflows.map(
    (outflow) =>
      ({
        kind: 'outflow',
        id: outflow.id,
        productTitle: productById.get(outflow.product)?.title ?? 'Produto removido',
        quantity: outflow.quantity,
        createdAt: outflow.created_at,
        description: outflow.description,
      }) satisfies MovementFeedItem,
  )

  const recentMovements = [...inflowMovements, ...outflowMovements]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, RECENT_MOVEMENTS_LIMIT)

  const alertMovements: MovementFeedItem[] = products
    .filter((product) => product.quantity < CRITICAL_STOCK_THRESHOLD)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, ALERT_ITEMS_LIMIT)
    .map((product) => ({
      kind: 'alert',
      id: `alert-${product.id}`,
      productTitle: product.title,
      quantity: product.quantity,
    }))

  return {
    productCount: products.length,
    newProductsThisMonth,
    totalUnits,
    stockValue,
    lowStockCount,
    categoryStock,
    movements: [...recentMovements, ...alertMovements],
    lowStockProducts,
  }
}
