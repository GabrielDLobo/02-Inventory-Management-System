import { Spinner } from './Spinner'

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted">
      <Spinner className="h-6 w-6" />
      {label}
    </div>
  )
}
