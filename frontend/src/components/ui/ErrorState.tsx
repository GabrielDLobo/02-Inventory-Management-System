import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-danger/10 text-danger">
        <ExclamationTriangleIcon className="h-6 w-6" />
      </span>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
