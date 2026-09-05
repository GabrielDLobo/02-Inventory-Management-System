import { createCrudResource } from './resource'
import type { Category, CategoryInput } from './types'

export const categoriesService = createCrudResource<Category, CategoryInput>('/categories')
