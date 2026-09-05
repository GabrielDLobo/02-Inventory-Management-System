import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  /** Ícone estático ou um <Scene3D/> (design-system.md: empty states 3D nas telas internas). */
  illustration?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, illustration, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {illustration}
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}
