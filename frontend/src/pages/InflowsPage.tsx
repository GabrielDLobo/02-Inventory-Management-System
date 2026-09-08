import { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { PageBody } from '@/components/ui/PageBody'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { inflowsService } from '@/services/api/inflows'
import { formatRelativeTime } from '@/lib/format'
import type { Inflow, InflowInput } from '@/services/api/types'
import { useMovementsPageData } from './movements/useMovementsPageData'
import { InflowForm } from './movements/InflowForm'

export function InflowsPage() {
  const { reload, ...state } = useMovementsPageData<Inflow>(inflowsService.list)
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function handleCreate(values: InflowInput) {
    await inflowsService.create(values)
    toast.success('Entrada registrada. O estoque do produto foi atualizado.')
    setIsFormOpen(false)
    reload()
  }

  return (
    <>
      <ScreenHeader
        eyebrow="Movimentações"
        title="Entradas"
        description="Registre a chegada de produtos vindos de fornecedores."
        accent="success"
        actions={
          state.status === 'success' && (
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Registrar entrada
            </Button>
          )
        }
      />

      <PageBody>
        {state.status === 'loading' && <LoadingState />}
        {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}

        {state.status === 'success' && (
          <Card>
            <CardHeader title="Entradas registradas" />

            {state.data.movements.length === 0 ? (
              <EmptyState
                illustration={
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-[#047857]">
                    <ArrowDownIcon className="h-7 w-7" />
                  </span>
                }
                title="Nenhuma entrada registrada ainda"
                description="Registre a primeira entrada de estoque."
                action={<Button onClick={() => setIsFormOpen(true)}>Registrar entrada</Button>}
              />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <Th>Produto</Th>
                      <Th>Fornecedor</Th>
                      <Th>Quantidade</Th>
                      <Th>Descrição</Th>
                      <Th>Quando</Th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.data.movements.map((inflow) => (
                      <TableRow key={inflow.id}>
                        <Td>{state.data.products.find((p) => p.id === inflow.product)?.title ?? '—'}</Td>
                        <Td>{state.data.suppliers.find((s) => s.id === inflow.supplier)?.name ?? '—'}</Td>
                        <Td mono className="text-[#047857]">
                          +{inflow.quantity}
                        </Td>
                        <Td className="max-w-xs truncate text-muted">{inflow.description ?? '—'}</Td>
                        <Td className="text-muted">{formatRelativeTime(inflow.created_at)}</Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        )}
      </PageBody>

      {state.status === 'success' && isFormOpen && (
        <Modal title="Registrar entrada" onClose={() => setIsFormOpen(false)}>
          <InflowForm
            products={state.data.products}
            suppliers={state.data.suppliers}
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
          />
        </Modal>
      )}
    </>
  )
}
