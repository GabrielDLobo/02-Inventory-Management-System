import { createCrudResource } from './resource'
import type { Product, ProductInput } from './types'

export const productsService = createCrudResource<Product, ProductInput>('/products')
