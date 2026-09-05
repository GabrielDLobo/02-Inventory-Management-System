// Contrato real da API (lido em products/categories/brands/suppliers/inflows/
// outflows: views.py, serializers.py, models.py). Não é o que docs/api-endpoints.md
// descreve: não há paginação (sem DEFAULT_PAGINATION_CLASS), sem busca/filtro no
// backend, e as FKs (category, brand, supplier, product) trafegam como IDs
// (PrimaryKeyRelatedField via `fields = '__all__'`), nunca como objeto aninhado.

export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  title: string
  category: number
  brand: number
  description: string | null
  serie_number: string | null
  // DecimalField serializado como string ("1199.00") pelo DRF.
  cost_price: string
  selling_price: string
  quantity: number
  created_at: string
  updated_at: string
}

export interface Inflow {
  id: number
  supplier: number
  product: number
  quantity: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface Outflow {
  id: number
  product: number
  quantity: number
  description: string | null
  created_at: string
  updated_at: string
}

// Payloads de escrita: todos os campos aceitos pelo serializer, exceto os
// somente-leitura (id, created_at, updated_at).
export type CategoryInput = Omit<Category, 'id' | 'created_at' | 'updated_at'>
export type BrandInput = Omit<Brand, 'id' | 'created_at' | 'updated_at'>
export type SupplierInput = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>
// Inflow/Outflow não têm endpoint de update (só list/create/retrieve), então
// só existe o payload de criação.
export type InflowInput = Omit<Inflow, 'id' | 'created_at' | 'updated_at'>
export type OutflowInput = Omit<Outflow, 'id' | 'created_at' | 'updated_at'>

// Erros de validação do DRF: { campo: ["mensagem", ...] }. `non_field_errors`
// e `detail` aparecem em erros gerais (permissão, autenticação, PROTECT).
export type ApiValidationError = Record<string, string[] | undefined> & {
  detail?: string
}
