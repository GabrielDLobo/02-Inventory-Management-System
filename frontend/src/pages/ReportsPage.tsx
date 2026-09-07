import { ArrowDownIcon, ArrowUpIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardHeader } from '@/components/ui/Card'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { formatCompactCurrency, formatNumber, formatRelativeTime } from '@/lib/format'
import { useReportsData } from './reports/useReportsData'

function loadAmbientCube() {
  return import('@/components/three/scenes/AmbientCube')
}

export function ReportsPage() {
  const { reload, ...state } = useReportsData()

  return (
    <>
      <ScreenHeader
        title="Relatórios"
        description="Valor de estoque por categoria, produtos de maior valor e histórico de movimentações."
        loadScene={loadAmbientCube}
        sceneProps={{ color: '#7C6FF0' }}
      />

      {state.status === 'loading' && <LoadingState />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}

      {state.status === 'success' && (
        <div className="flex flex-col gap-[22px]">
          <Card>
            <CardHeader title="Valor de estoque por categoria" subtitle="custo médio ponderado" />
            {state.data.categoryReport.length === 0 ? (
              <p className="p-[18px] text-sm text-muted">Nenhum produto cadastrado ainda.</p>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <Th>Categoria</Th>
                      <Th>Produtos</Th>
                      <Th>Unidades</Th>
                      <Th>Valor em estoque</Th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.data.categoryReport.map((row) => (
                      <TableRow key={row.categoryId}>
                        <Td>{row.name}</Td>
                        <Td mono>{formatNumber(row.productCount)}</Td>
                        <Td mono>{formatNumber(row.units)}</Td>
                        <Td mono>{formatCompactCurrency(row.stockValue)}</Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          <Card>
            <CardHeader title="Produtos de maior valor em estoque" subtitle="top 5" />
            {state.data.topProducts.length === 0 ? (
              <p className="p-[18px] text-sm text-muted">Nenhum produto cadastrado ainda.</p>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <Th>Produto</Th>
                      <Th>Categoria</Th>
                      <Th>Unidades</Th>
                      <Th>Valor em estoque</Th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.data.topProducts.map((row) => (
                      <TableRow key={row.id}>
                        <Td>{row.title}</Td>
                        <Td>{row.categoryName}</Td>
                        <Td mono>{formatNumber(row.quantity)}</Td>
                        <Td mono>{formatCompactCurrency(row.stockValue)}</Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          <Card>
            <CardHeader title="Histórico de movimentações" subtitle={`${state.data.movementHistory.length} registros`} />
            {state.data.movementHistory.length === 0 ? (
              <EmptyState
                illustration={
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet/10 text-violet">
                    <ChartBarIcon className="h-7 w-7" />
                  </span>
                }
                title="Nenhuma movimentação registrada ainda"
                description="Entradas e saídas aparecem aqui assim que forem registradas."
              />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <Th>Tipo</Th>
                      <Th>Produto</Th>
                      <Th>Fornecedor</Th>
                      <Th>Quantidade</Th>
                      <Th>Quando</Th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.data.movementHistory.map((row) => (
                      <TableRow key={`${row.kind}-${row.id}`}>
                        <Td>
                          <span
                            className={
                              row.kind === 'inflow'
                                ? 'inline-flex items-center gap-1 text-[#047857]'
                                : 'inline-flex items-center gap-1 text-[#BE123C]'
                            }
                          >
                            {row.kind === 'inflow' ? (
                              <ArrowDownIcon className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpIcon className="h-3.5 w-3.5" />
                            )}
                            {row.kind === 'inflow' ? 'Entrada' : 'Saída'}
                          </span>
                        </Td>
                        <Td>{row.productTitle}</Td>
                        <Td>{row.kind === 'inflow' ? row.supplierName : '—'}</Td>
                        <Td mono>
                          {row.kind === 'inflow' ? '+' : '−'}
                          {row.quantity}
                        </Td>
                        <Td className="text-muted">{formatRelativeTime(row.createdAt)}</Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
