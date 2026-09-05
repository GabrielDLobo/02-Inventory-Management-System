import { createCrudResource } from './resource'
import type { Supplier, SupplierInput } from './types'

export const suppliersService = createCrudResource<Supplier, SupplierInput>('/suppliers')
