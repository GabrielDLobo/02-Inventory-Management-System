import { createCrudResource } from './resource'
import type { Brand, BrandInput } from './types'

export const brandsService = createCrudResource<Brand, BrandInput>('/brands')
