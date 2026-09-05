import { useState } from 'react'
import {
  Squares2X2Icon,
  CubeIcon,
  Bars3Icon,
  TagIcon,
  TruckIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { Layout } from '@/components/ui/Layout'
import type { NavGroup } from '@/components/ui/Sidebar'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { StatKPI } from '@/components/ui/StatKPI'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { Scene3D } from '@/components/three/Scene3D'

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Estoque',
    items: [
      { key: 'dashboard', label: 'Dashboard', href: '/', icon: Squares2X2Icon },
      { key: 'products', label: 'Produtos', href: '/produtos', icon: CubeIcon },
      { key: 'categories', label: 'Categorias', href: '/categorias', icon: Bars3Icon },
      { key: 'brands', label: 'Marcas', href: '/marcas', icon: TagIcon },
      { key: 'suppliers', label: 'Fornecedores', href: '/fornecedores', icon: TruckIcon },
    ],
  },
  {
    label: 'Movimentações',
    items: [
      { key: 'inflows', label: 'Entradas', href: '/entradas', icon: ArrowDownTrayIcon },
      { key: 'outflows', label: 'Saídas', href: '/saidas', icon: ArrowUpTrayIcon },
    ],
  },
  {
    label: 'Inteligência',
    items: [
      { key: 'ai', label: 'Assistente IA', href: '/assistente', icon: SparklesIcon, badge: 'IA' },
      { key: 'reports', label: 'Relatórios', href: '/relatorios', icon: ChartBarIcon },
    ],
  },
]

const LOW_STOCK_SAMPLE = [
  { product: 'Álcool 70% 1L', category: 'Limpeza', supplier: 'Bela Vista', stock: 8, min: 20, status: 'critical' as const },
  { product: 'Café Torrado 1kg', category: 'Alimentos', supplier: 'Grão Nobre', stock: 15, min: 30, status: 'low' as const },
  { product: 'Papel Higiênico 12un', category: 'Higiene', supplier: 'Suave Lar', stock: 22, min: 40, status: 'low' as const },
]

function loadAmbientCube() {
  return import('@/components/three/scenes/AmbientCube')
}

// Página de vitrine da Fase 1 (scaffold + fundação): demonstra os
// componentes base e o wrapper <Scene3D/> funcionando juntos. As telas reais
// (login com hero 3D, dashboard com dados da API) entram na Fase 2.
function App() {
  const [search, setSearch] = useState('')

  return (
    <Layout
      groups={NAV_GROUPS}
      activeHref="/"
      username="demo"
      title="Fundação do SGE"
      searchPlaceholder="Buscar produto, fornecedor, SKU..."
      onSearch={setSearch}
      onLogout={() => {
        /* placeholder: fluxo real de logout entra na Fase 2 */
      }}
    >
      <div className="mb-[22px] overflow-hidden rounded-2xl border border-dark-line bg-dark">
        <div className="grid grid-cols-[1fr_180px] items-center gap-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Visão geral do estoque</h2>
            <p className="mt-1 text-sm text-[#8CA0AD]">
              Componentes base e cena 3D ambiente prontos para as telas da Fase 2.
              {search && <span className="font-tabular"> Buscando por &ldquo;{search}&rdquo;.</span>}
            </p>
          </div>
          <Scene3D loadScene={loadAmbientCube} className="h-[120px] w-full" cameraPosition={[0, 0, 4.5]} />
        </div>
      </div>

      <div className="mb-[22px] grid grid-cols-4 gap-4 max-[900px]:grid-cols-2">
        <StatKPI icon={ArchiveBoxIcon} tone="cyan" label="Produtos cadastrados" value="248" delta="▲ 12 este mês" deltaTone="up" />
        <StatKPI icon={CubeIcon} tone="violet" label="Unidades em estoque" value="12.480" delta="▲ 4,1% na semana" deltaTone="up" />
        <StatKPI icon={BanknotesIcon} tone="human" label="Valor do estoque" value="R$ 384,2 mil" delta="custo médio ponderado" deltaTone="flat" />
        <StatKPI icon={ExclamationTriangleIcon} tone="warning" label="Estoque baixo" value="9" delta="itens abaixo do mínimo" deltaTone="warn" />
      </div>

      <Card className="mb-[22px]">
        <CardHeader title="Produtos com estoque baixo" subtitle="reposição sugerida" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <Th>Produto</Th>
                <Th>Categoria</Th>
                <Th>Fornecedor</Th>
                <Th>Estoque</Th>
                <Th>Mínimo</Th>
                <Th>Status</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {LOW_STOCK_SAMPLE.map((row) => (
                <TableRow key={row.product}>
                  <Td>{row.product}</Td>
                  <Td>{row.category}</Td>
                  <Td>{row.supplier}</Td>
                  <Td mono>{row.stock}</Td>
                  <Td mono>{row.min}</Td>
                  <Td>
                    <StatusPill status={row.status} />
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card>
        <CardHeader title="Componentes de formulário" subtitle="Button, Input, Select" />
        <CardBody className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
          <div>
            <Input label="Nome do produto" placeholder="Ex.: Notebook UltraSlim 14&quot;" />
            <Select label="Categoria" defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              <option value="informatica">Informática</option>
              <option value="limpeza">Limpeza</option>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="primary">Salvar produto</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="ghost">Ver detalhes</Button>
            <Button variant="danger">Excluir</Button>
          </div>
        </CardBody>
      </Card>
    </Layout>
  )
}

export default App
