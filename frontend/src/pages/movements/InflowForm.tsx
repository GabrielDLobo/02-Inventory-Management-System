import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { extractValidationErrors, fieldError } from '@/lib/apiError'
import type { ApiValidationError, InflowInput, Product, Supplier } from '@/services/api/types'

interface InflowFormProps {
  products: Product[]
  suppliers: Supplier[]
  onSubmit: (values: InflowInput) => Promise<void>
  onCancel: () => void
}

export function InflowForm({ products, suppliers, onSubmit, onCancel }: InflowFormProps) {
  const [supplier, setSupplier] = useState(0)
  const [product, setProduct] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<ApiValidationError>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrors({})

    // Os selects começam em 0 (nenhum selecionado); pega isso aqui em vez de
    // deixar a API devolver "Pk inválido "0" - objeto não existe.".
    const formErrors: ApiValidationError = {}
    if (!supplier) formErrors.supplier = 'Selecione um fornecedor.'
    if (!product) formErrors.product = 'Selecione um produto.'
    if (quantity < 1) formErrors.quantity = 'Informe uma quantidade maior que zero.'
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ supplier, product, quantity, description })
    } catch (error) {
      setErrors(extractValidationErrors(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Select
        label="Fornecedor"
        value={supplier || ''}
        onChange={(event) => setSupplier(Number(event.target.value))}
        error={fieldError(errors.supplier)}
        required
      >
        <option value="" disabled>
          Selecione
        </option>
        {suppliers.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>

      <Select
        label="Produto"
        value={product || ''}
        onChange={(event) => setProduct(Number(event.target.value))}
        error={fieldError(errors.product)}
        required
      >
        <option value="" disabled>
          Selecione
        </option>
        {products.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </Select>

      <Input
        label="Quantidade"
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
        error={fieldError(errors.quantity)}
        required
      />

      <Input
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        error={fieldError(errors.description)}
        placeholder="Ex.: reposição mensal"
      />

      {errors.detail && <p className="mb-3.5 text-xs text-danger">{errors.detail}</p>}

      <div className="mt-2 flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar entrada'}
        </Button>
      </div>
    </form>
  )
}
