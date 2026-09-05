import { ArchiveBoxIcon, BanknotesIcon, CubeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { StatKPI } from '@/components/ui/StatKPI'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Scene3D } from '@/components/three/Scene3D'
import { formatCompactCurrency, formatNumber } from '@/lib/format'
import { LOW_STOCK_THRESHOLD } from '@/lib/stock'
import { useDashboardData } from './dashboard/useDashboardData'
import { CategoryStockChart } from './dashboard/CategoryStockChart'
import { RecentMovementsPanel } from './dashboard/RecentMovementsPanel'
import { LowStockTable } from './dashboard/LowStockTable'

const TODAY_LABEL = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

function loadAmbientCube() {
  return import('@/components/three/scenes/AmbientCube')
}

export function DashboardPage() {
  const state = useDashboardData()

  return (
    <>
      <div className="mb-[22px] overflow-hidden rounded-2xl border border-dark-line bg-dark">
        <div className="grid grid-cols-[1fr_140px] items-center gap-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Visão geral do estoque</h2>
            <p className="mt-1 text-sm text-[#8CA0AD]">Movimentações e níveis de estoque hoje, {TODAY_LABEL}.</p>
          </div>
          <Scene3D loadScene={loadAmbientCube} className="h-[100px] w-full" cameraPosition={[0, 0, 4.5]} />
        </div>
      </div>

      {state.status === 'loading' && <LoadingState label="Carregando dados do estoque..." />}

      {state.status === 'error' && <ErrorState message={state.message} onRetry={state.reload} />}

      {state.status === 'success' && (
        <>
          <div className="mb-[22px] grid grid-cols-4 gap-4 max-[900px]:grid-cols-2">
            <StatKPI
              icon={ArchiveBoxIcon}
              tone="cyan"
              label="Produtos cadastrados"
              value={formatNumber(state.data.productCount)}
              delta={
                state.data.newProductsThisMonth > 0
                  ? `▲ ${state.data.newProductsThisMonth} este mês`
                  : 'Nenhum produto novo este mês'
              }
              deltaTone={state.data.newProductsThisMonth > 0 ? 'up' : 'flat'}
            />
            <StatKPI
              icon={CubeIcon}
              tone="violet"
              label="Unidades em estoque"
              value={formatNumber(state.data.totalUnits)}
              delta="soma de todos os produtos"
              deltaTone="flat"
            />
            <StatKPI
              icon={BanknotesIcon}
              tone="human"
              label="Valor do estoque"
              value={formatCompactCurrency(state.data.stockValue)}
              delta="custo médio ponderado"
              deltaTone="flat"
            />
            <StatKPI
              icon={ExclamationTriangleIcon}
              tone="warning"
              label="Estoque baixo"
              value={formatNumber(state.data.lowStockCount)}
              delta={`abaixo de ${LOW_STOCK_THRESHOLD} unidades`}
              deltaTone="warn"
            />
          </div>

          <div className="mb-[22px] grid grid-cols-[1.35fr_1fr] gap-4 max-[900px]:grid-cols-1">
            <Card>
              <CardHeader title="Estoque por categoria" subtitle="unidades" />
              <CardBody>
                <CategoryStockChart categories={state.data.categoryStock} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Movimentações recentes" />
              <CardBody>
                <RecentMovementsPanel movements={state.data.movements} />
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader title="Produtos com estoque baixo" subtitle="reposição sugerida" />
            <LowStockTable rows={state.data.lowStockProducts} />
          </Card>
        </>
      )}
    </>
  )
}
