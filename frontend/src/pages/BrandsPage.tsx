import { TagIcon } from '@heroicons/react/24/outline'
import { brandsService } from '@/services/api/brands'
import { SimpleResourceScreen } from './resources/SimpleResourceScreen'

function loadAmbientCube() {
  return import('@/components/three/scenes/AmbientCube')
}

export function BrandsPage() {
  return (
    <SimpleResourceScreen
      title="Marcas"
      description="Cadastre as marcas dos produtos que passam pelo estoque."
      labelSingular="Marca"
      labelPlural="Marcas"
      gender="f"
      color="#7C6FF0"
      headerIcon={TagIcon}
      service={brandsService}
      loadScene={loadAmbientCube}
    />
  )
}
