import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ArchiveBoxIcon, CubeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatusPill } from '@/components/ui/StatusPill'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { productsService } from '@/services/api/products'
import { formatNumber } from '@/lib/format'
import { getStockStatus } from '@/lib/stock'
import type { Product, ProductInput } from '@/services/api/types'
import { useProductsPageData } from './products/useProductsPageData'
import { ProductForm } from './products/ProductForm'

function loadAmbientCube() {
  return import('@/components/three/scenes/AmbientCube')
}

type DialogState = { kind: 'create' } | { kind: 'edit'; product: Product } | { kind: 'delete'; product: Product } | null

export function ProductsPage() {
  const { reload, ...state } = useProductsPageData()
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<DialogState>(null)

  const filteredProducts = useMemo(() => {
    if (state.status !== 'success') return []
    const term = search.trim().toLowerCase()
    if (!term) return state.data.products
    return state.data.products.filter(
      (product) =>
        product.title.toLowerCase().includes(term) || (product.serie_number ?? '').toLowerCase().includes(term),
    )
  }, [state, search])

  async function handleCreate(values: ProductInput) {
    await productsService.create(values)
    toast.success('Produto cadastrado.')
    setDialog(null)
    reload()
  }

  async function handleUpdate(id: number, values: ProductInput) {
    await productsService.update(id, values)
    toast.success('Produto atualizado.')
    setDialog(null)
    reload()
  }

  async function handleDelete(product: Product) {
    try {
      await productsService.remove(product.id)
      toast.success('Produto excluído.')
      setDialog(null)
      reload()
    } catch {
      toast.error(`Não foi possível excluir "${product.title}". Verifique se não há entradas ou saídas vinculadas.`)
    }
  }

  return (
    <>
      <ScreenHeader
        title="Produtos"
        description="Cadastre e mantenha os produtos que passam pelo estoque."
        loadScene={loadAmbientCube}
      />

      {state.status === 'loading' && <LoadingState />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}

      {state.status === 'success' && (
        <Card>
          <CardHeader
            title="Produtos cadastrados"
            action={
              <div className="flex items-center gap-2.5">
                <input
                  type="search"
                  placeholder="Buscar por nome ou SKU..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-56 rounded-[11px] border border-line bg-surface px-3.5 py-2 text-[13.5px] text-ink outline-none focus:border-cyan focus:ring-[3px] focus:ring-cyan/15"
                />
                <Button onClick={() => setDialog({ kind: 'create' })}>
                  <PlusIcon className="h-4 w-4" />
                  Novo produto
                </Button>
              </div>
            }
          />

          {state.data.products.length === 0 ? (
            <EmptyState
              illustration={
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan/10 text-cyan-700">
                  <CubeIcon className="h-7 w-7" />
                </span>
              }
              title="Nenhum produto cadastrado ainda"
              description="Cadastre categorias e marcas primeiro, depois o primeiro produto."
              action={<Button onClick={() => setDialog({ kind: 'create' })}>Novo produto</Button>}
            />
          ) : filteredProducts.length === 0 ? (
            <p className="p-[18px] text-sm text-muted">Nenhum produto encontrado para &ldquo;{search}&rdquo;.</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <Th>Produto</Th>
                    <Th>Categoria</Th>
                    <Th>Marca</Th>
                    <Th>Preço de venda</Th>
                    <Th>Estoque</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const categoryName = state.data.categories.find((c) => c.id === product.category)?.name ?? '—'
                    const brandName = state.data.brands.find((b) => b.id === product.brand)?.name ?? '—'
                    return (
                      <TableRow key={product.id}>
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg bg-cyan/10 text-cyan-700">
                              <ArchiveBoxIcon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="truncate">{product.title}</div>
                              {product.serie_number && (
                                <div className="text-[11.5px] text-muted">SKU {product.serie_number}</div>
                              )}
                            </div>
                          </div>
                        </Td>
                        <Td>{categoryName}</Td>
                        <Td>{brandName}</Td>
                        <Td mono>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            Number(product.selling_price),
                          )}
                        </Td>
                        <Td mono>{formatNumber(product.quantity)}</Td>
                        <Td>
                          <StatusPill status={getStockStatus(product.quantity)} />
                        </Td>
                        <Td>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDialog({ kind: 'edit', product })}
                              aria-label={`Editar ${product.title}`}
                              className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDialog({ kind: 'delete', product })}
                              aria-label={`Excluir ${product.title}`}
                              className="rounded-lg p-1.5 text-muted transition hover:bg-danger/10 hover:text-danger"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </Td>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {state.status === 'success' && dialog?.kind === 'create' && (
        <Modal title="Novo produto" onClose={() => setDialog(null)}>
          <ProductForm
            categories={state.data.categories}
            brands={state.data.brands}
            submitLabel="Cadastrar"
            onSubmit={handleCreate}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}

      {state.status === 'success' && dialog?.kind === 'edit' && (
        <Modal title="Editar produto" onClose={() => setDialog(null)}>
          <ProductForm
            categories={state.data.categories}
            brands={state.data.brands}
            initialValues={{
              title: dialog.product.title,
              category: dialog.product.category,
              brand: dialog.product.brand,
              description: dialog.product.description ?? '',
              serie_number: dialog.product.serie_number ?? '',
              cost_price: dialog.product.cost_price,
              selling_price: dialog.product.selling_price,
              quantity: dialog.product.quantity,
            }}
            submitLabel="Salvar alterações"
            onSubmit={(values) => handleUpdate(dialog.product.id, values)}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Excluir produto"
          description={`Tem certeza que quer excluir "${dialog.product.title}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={() => handleDelete(dialog.product)}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  )
}
