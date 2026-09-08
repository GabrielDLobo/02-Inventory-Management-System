import { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowUpIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { PageBody } from '@/components/ui/PageBody'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { outflowsService } from '@/services/api/outflows'
import { formatRelativeTime } from '@/lib/format'
import type { Outflow, OutflowInput } from '@/services/api/types'
import { useMovementsPageData } from './movements/useMovementsPageData'
import { OutflowForm } from './movements/OutflowForm'

export function OutflowsPage() {
  const { reload, ...state } = useMovementsPageData<Outflow>(outflowsService.list)
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function handleCreate(values: OutflowInput) {
    // Erros (ex.: quantidade maior que o estoque disponível) propagam pro
    // catch do próprio OutflowForm, que já sabe exibi-los nos campos certos.
    await outflowsService.create(values)
    toast.success('Saída registrada. O estoque do produto foi atualizado.')
    setIsFormOpen(false)
    reload()
  }

  return (
    <>
      <ScreenHeader
        eyebrow="Movimentações"
        title="Saídas"
        description="Registre vendas e outras saídas de produtos do estoque."
        accent="danger"
        actions={
          state.status === 'success' && (
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Registrar saída
            </Button>
          )
        }
      />

      <PageBody>
        {state.status === 'loading' && <LoadingState />}
        {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}

        {state.status === 'success' && (
          <Card>
            <CardHeader title="Saídas registradas" />

            {state.data.movements.length === 0 ? (
              <EmptyState
                illustration={
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-[#BE123C]">
                    <ArrowUpIcon className="h-7 w-7" />
                  </span>
                }
                title="Nenhuma saída registrada ainda"
                description="Registre a primeira saída de estoque."
                action={<Button onClick={() => setIsFormOpen(true)}>Registrar saída</Button>}
              />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <Th>Produto</Th>
                      <Th>Quantidade</Th>
                      <Th>Descrição</Th>
                      <Th>Quando</Th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.data.movements.map((outflow) => (
                      <TableRow key={outflow.id}>
                        <Td>{state.data.products.find((p) => p.id === outflow.product)?.title ?? '—'}</Td>
                        <Td mono className="text-[#BE123C]">
                          −{outflow.quantity}
                        </Td>
                        <Td className="max-w-xs truncate text-muted">{outflow.description ?? '—'}</Td>
                        <Td className="text-muted">{formatRelativeTime(outflow.created_at)}</Td>
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
        <Modal title="Registrar saída" onClose={() => setIsFormOpen(false)}>
          <OutflowForm products={state.data.products} onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
        </Modal>
      )}
    </>
  )
}
