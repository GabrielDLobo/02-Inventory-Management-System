import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { extractValidationErrors, fieldError } from '@/lib/apiError'
import type { ApiValidationError, Brand, Category, ProductInput } from '@/services/api/types'

interface ProductFormProps {
  categories: Category[]
  brands: Brand[]
  initialValues?: ProductInput
  submitLabel: string
  onSubmit: (values: ProductInput) => Promise<void>
  onCancel: () => void
}

const EMPTY_VALUES: ProductInput = {
  title: '',
  category: 0,
  brand: 0,
  description: '',
  serie_number: '',
  cost_price: '',
  selling_price: '',
  quantity: 0,
}

export function ProductForm({ categories, brands, initialValues, submitLabel, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<ProductInput>(initialValues ?? EMPTY_VALUES)
  const [errors, setErrors] = useState<ApiValidationError>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrors({})

    // Os selects começam em 0 (nenhum selecionado); pega isso aqui em vez de
    // deixar a API devolver "Pk inválido "0" - objeto não existe.".
    const formErrors: ApiValidationError = {}
    if (!values.category) formErrors.category = 'Selecione uma categoria.'
    if (!values.brand) formErrors.brand = 'Selecione uma marca.'
    // products/models.py usa IntegerField (não PositiveIntegerField) pra
    // quantity e DecimalField sem validadores pros preços: a API aceita
    // valores negativos, então a checagem de valores plausíveis é só aqui.
    if (values.quantity < 0) formErrors.quantity = 'A quantidade não pode ser negativa.'
    if (!(Number(values.cost_price) > 0)) formErrors.cost_price = 'Informe um preço de custo maior que zero.'
    if (!(Number(values.selling_price) > 0)) formErrors.selling_price = 'Informe um preço de venda maior que zero.'
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      setErrors(extractValidationErrors(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Nome do produto"
        value={values.title}
        onChange={(event) => update('title', event.target.value)}
        error={fieldError(errors.title)}
        required
        autoFocus
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Categoria"
          value={values.category || ''}
          onChange={(event) => update('category', Number(event.target.value))}
          error={fieldError(errors.category)}
          required
        >
          <option value="" disabled>
            Selecione
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          label="Marca"
          value={values.brand || ''}
          onChange={(event) => update('brand', Number(event.target.value))}
          error={fieldError(errors.brand)}
          required
        >
          <option value="" disabled>
            Selecione
          </option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Preço de custo (R$)"
          inputMode="decimal"
          value={values.cost_price}
          onChange={(event) => update('cost_price', event.target.value)}
          error={fieldError(errors.cost_price)}
          required
        />
        <Input
          label="Preço de venda (R$)"
          inputMode="decimal"
          value={values.selling_price}
          onChange={(event) => update('selling_price', event.target.value)}
          error={fieldError(errors.selling_price)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantidade em estoque"
          type="number"
          min={0}
          value={values.quantity}
          onChange={(event) => update('quantity', Number(event.target.value))}
          error={fieldError(errors.quantity)}
          required
        />
        <Input
          label="Número de série / SKU"
          value={values.serie_number ?? ''}
          onChange={(event) => update('serie_number', event.target.value)}
          error={fieldError(errors.serie_number)}
        />
      </div>

      <Input
        label="Descrição"
        value={values.description ?? ''}
        onChange={(event) => update('description', event.target.value)}
        error={fieldError(errors.description)}
      />

      {errors.detail && <p className="mb-3.5 text-xs text-danger">{errors.detail}</p>}

      <div className="mt-2 flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
