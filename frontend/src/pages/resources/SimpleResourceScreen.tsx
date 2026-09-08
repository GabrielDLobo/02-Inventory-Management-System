import { useMemo, useState, type ComponentType, type SVGProps } from 'react'
import toast from 'react-hot-toast'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ScreenHeader, type PageHeroAccent } from '@/components/ui/ScreenHeader'
import { PageBody } from '@/components/ui/PageBody'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { useResourceList } from '@/hooks/useResourceList'
import { SimpleResourceForm, type SimpleResourceFormValues } from './SimpleResourceForm'

// Forma comum a Category, Brand e Supplier (mesmos campos nos três models).
interface NamedResource {
  id: number
  name: string
  description: string | null
  created_at: string
}

interface NamedResourceService {
  list: () => Promise<NamedResource[]>
  create: (input: SimpleResourceFormValues) => Promise<NamedResource>
  update: (id: number, input: SimpleResourceFormValues) => Promise<NamedResource>
  remove: (id: number) => Promise<void>
}

interface SimpleResourceScreenProps {
  title: string
  description: string
  labelSingular: string
  labelPlural: string
  /** Concordância de gênero do labelSingular ("Categoria"/"Marca" = f, "Fornecedor" = m). */
  gender: 'm' | 'f'
  color: string
  accent: PageHeroAccent
  headerIcon: ComponentType<SVGProps<SVGSVGElement>>
  service: NamedResourceService
}

type DialogState = { kind: 'create' } | { kind: 'edit'; resource: NamedResource } | { kind: 'delete'; resource: NamedResource } | null

export function SimpleResourceScreen({
  title,
  description,
  labelSingular,
  labelPlural,
  gender,
  color,
  accent,
  headerIcon: HeaderIcon,
  service,
}: SimpleResourceScreenProps) {
  const { reload, ...state } = useResourceList(service.list)
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<DialogState>(null)

  const label = labelSingular.toLowerCase()
  const newLabel = `${gender === 'f' ? 'Nova' : 'Novo'} ${label}`
  const firstLabel = `${gender === 'f' ? 'primeira' : 'primeiro'} ${label}`
  const createdLabel = `${labelSingular} ${gender === 'f' ? 'cadastrada' : 'cadastrado'}.`
  const updatedLabel = `${labelSingular} ${gender === 'f' ? 'atualizada' : 'atualizado'}.`
  const deletedLabel = `${labelSingular} ${gender === 'f' ? 'excluída' : 'excluído'}.`

  const filteredData = useMemo(() => {
    if (state.status !== 'success') return []
    const term = search.trim().toLowerCase()
    if (!term) return state.data
    return state.data.filter((resource) => resource.name.toLowerCase().includes(term))
  }, [state, search])

  async function handleCreate(values: SimpleResourceFormValues) {
    await service.create(values)
    toast.success(createdLabel)
    setDialog(null)
    reload()
  }

  async function handleUpdate(id: number, values: SimpleResourceFormValues) {
    await service.update(id, values)
    toast.success(updatedLabel)
    setDialog(null)
    reload()
  }

  async function handleDelete(resource: NamedResource) {
    try {
      await service.remove(resource.id)
      toast.success(deletedLabel)
      setDialog(null)
      reload()
    } catch {
      toast.error(`Não foi possível excluir. Verifique se não há registros vinculados a "${resource.name}".`)
    }
  }

  return (
    <>
      <ScreenHeader
        eyebrow="Estoque"
        title={title}
        description={description}
        accent={accent}
        actions={
          state.status === 'success' && (
            <Button onClick={() => setDialog({ kind: 'create' })}>
              <PlusIcon className="h-4 w-4" />
              {newLabel}
            </Button>
          )
        }
      />

      <PageBody>
        <Card>
          <CardHeader
            title={labelPlural}
            action={
              state.status === 'success' &&
              state.data.length > 0 && (
                <input
                  type="search"
                  placeholder={`Buscar ${label}...`}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full max-w-56 rounded-[11px] border border-line bg-surface px-3.5 py-2 text-[13.5px] text-ink outline-none focus:border-cyan focus:ring-[3px] focus:ring-cyan/15"
                />
              )
            }
          />

          {state.status === 'loading' && <LoadingState />}
          {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}

          {state.status === 'success' && state.data.length === 0 && (
            <EmptyState
              illustration={
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  <HeaderIcon className="h-7 w-7" />
                </span>
              }
              title={`Nenhum${gender === 'f' ? 'a' : ''} ${label} cadastrad${gender === 'f' ? 'a' : 'o'} ainda`}
              description={`Cadastre ${firstLabel} pra começar a usar em produtos.`}
              action={<Button onClick={() => setDialog({ kind: 'create' })}>{newLabel}</Button>}
            />
          )}

          {state.status === 'success' && state.data.length > 0 && filteredData.length === 0 && (
            <p className="p-[18px] text-sm text-muted">Nenhum{gender === 'f' ? 'a' : ''} {label} encontrad{gender === 'f' ? 'a' : 'o'} para &ldquo;{search}&rdquo;.</p>
          )}

          {state.status === 'success' && filteredData.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <Th>Nome</Th>
                    <Th>Descrição</Th>
                    <Th>Ações</Th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((resource) => (
                    <TableRow key={resource.id}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg bg-cyan/10 text-cyan-700">
                            <HeaderIcon className="h-4 w-4" />
                          </span>
                          {resource.name}
                        </div>
                      </Td>
                      <Td className="max-w-xs truncate text-muted">{resource.description ?? '—'}</Td>
                      <Td>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDialog({ kind: 'edit', resource })}
                            aria-label={`Editar ${resource.name}`}
                            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDialog({ kind: 'delete', resource })}
                            aria-label={`Excluir ${resource.name}`}
                            className="rounded-lg p-1.5 text-muted transition hover:bg-danger/10 hover:text-danger"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </Td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </PageBody>

      {dialog?.kind === 'create' && (
        <Modal title={newLabel} onClose={() => setDialog(null)}>
          <SimpleResourceForm submitLabel="Cadastrar" onSubmit={handleCreate} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.kind === 'edit' && (
        <Modal title={`Editar ${label}`} onClose={() => setDialog(null)}>
          <SimpleResourceForm
            initialValues={{ name: dialog.resource.name, description: dialog.resource.description ?? '' }}
            submitLabel="Salvar alterações"
            onSubmit={(values) => handleUpdate(dialog.resource.id, values)}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title={`Excluir ${label}`}
          description={`Tem certeza que quer excluir "${dialog.resource.name}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={() => handleDelete(dialog.resource)}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  )
}
