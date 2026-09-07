import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { extractValidationErrors, fieldError } from '@/lib/apiError'
import type { ApiValidationError } from '@/services/api/types'

export interface SimpleResourceFormValues {
  name: string
  description: string
}

interface SimpleResourceFormProps {
  initialValues?: SimpleResourceFormValues
  submitLabel: string
  onSubmit: (values: SimpleResourceFormValues) => Promise<void>
  onCancel: () => void
}

export function SimpleResourceForm({ initialValues, submitLabel, onSubmit, onCancel }: SimpleResourceFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [errors, setErrors] = useState<ApiValidationError>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrors({})
    setIsSubmitting(true)
    try {
      await onSubmit({ name, description })
    } catch (error) {
      setErrors(extractValidationErrors(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldError(errors.name)}
        required
        autoFocus
      />
      <Input
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
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
