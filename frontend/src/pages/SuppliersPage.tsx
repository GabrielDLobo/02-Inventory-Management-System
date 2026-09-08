import { TruckIcon } from '@heroicons/react/24/outline'
import { suppliersService } from '@/services/api/suppliers'
import { SimpleResourceScreen } from './resources/SimpleResourceScreen'

export function SuppliersPage() {
  return (
    <SimpleResourceScreen
      title="Fornecedores"
      description="Cadastre quem fornece os produtos que entram no estoque."
      labelSingular="Fornecedor"
      labelPlural="Fornecedores"
      gender="m"
      color="#FF9E7A"
      accent="human"
      headerIcon={TruckIcon}
      service={suppliersService}
    />
  )
}
