import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { extractValidationErrors, fieldError } from '@/lib/apiError'
import type { ApiValidationError, OutflowInput, Product } from '@/services/api/types'

interface OutflowFormProps {
  products: Product[]
  onSubmit: (values: OutflowInput) => Promise<void>
  onCancel: () => void
}

export function OutflowForm({ products, onSubmit, onCancel }: OutflowFormProps) {
  const [product, setProduct] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<ApiValidationError>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProduct = products.find((item) => item.id === product)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrors({})

    // O select começa em 0 (nenhum selecionado); pega isso aqui em vez de
    // deixar a API devolver "Pk inválido "0" - objeto não existe.".
    if (!product) {
      setErrors({ product: 'Selecione um produto.' })
      return
    }

    if (quantity < 1) {
      setErrors({ quantity: 'Informe uma quantidade maior que zero.' })
      return
    }

    // outflows/serializers.py não valida quantidade contra o estoque
    // disponível (fields = '__all__', sem validate()) e o signal que
    // desconta o estoque não tem piso em zero — sem essa checagem aqui, a
    // saída é aceita e o produto fica com quantidade negativa.
    if (selectedProduct && quantity > selectedProduct.quantity) {
      setErrors({ quantity: `Só há ${selectedProduct.quantity} unidades em estoque.` })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ product, quantity, description })
    } catch (error) {
      setErrors(extractValidationErrors(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
            {item.title} ({item.quantity} em estoque)
          </option>
        ))}
      </Select>

      <Input
        label="Quantidade"
        type="number"
        min={1}
        max={selectedProduct?.quantity}
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
        placeholder="Ex.: venda, pedido #..."
      />

      {errors.detail && <p className="mb-3.5 text-xs text-danger">{errors.detail}</p>}

      <div className="mt-2 flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar saída'}
        </Button>
      </div>
    </form>
  )
}
