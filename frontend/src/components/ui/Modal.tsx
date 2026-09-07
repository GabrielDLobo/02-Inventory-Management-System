import { useEffect, type ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-title" className="font-display text-lg font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1 text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
