import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export function ConfirmDialog({ title, description, confirmLabel = 'Confirmar', onConfirm, onClose }: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleConfirm() {
    setIsSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-5 text-sm text-muted">{description}</p>
      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Excluindo...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
