import { Bars3Icon } from '@heroicons/react/24/outline'
import { categoriesService } from '@/services/api/categories'
import { SimpleResourceScreen } from './resources/SimpleResourceScreen'

export function CategoriesPage() {
  return (
    <SimpleResourceScreen
      title="Categorias"
      description="Organize os produtos por categoria pra facilitar filtros e relatórios."
      labelSingular="Categoria"
      labelPlural="Categorias"
      gender="f"
      color="#22D3EE"
      accent="cyan"
      headerIcon={Bars3Icon}
      service={categoriesService}
    />
  )
}
