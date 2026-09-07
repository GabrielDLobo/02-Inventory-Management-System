import { TruckIcon } from '@heroicons/react/24/outline'
import { suppliersService } from '@/services/api/suppliers'
import { SimpleResourceScreen } from './resources/SimpleResourceScreen'

function loadAmbientCube() {
  return import('@/components/three/scenes/AmbientCube')
}

export function SuppliersPage() {
  return (
    <SimpleResourceScreen
      title="Fornecedores"
      description="Cadastre quem fornece os produtos que entram no estoque."
      labelSingular="Fornecedor"
      labelPlural="Fornecedores"
      gender="m"
      color="#FF9E7A"
      headerIcon={TruckIcon}
      service={suppliersService}
      loadScene={loadAmbientCube}
    />
  )
}
