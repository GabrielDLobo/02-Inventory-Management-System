import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, id, className, children, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="mb-3.5">
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.09em] text-muted"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          'w-full rounded-[11px] border border-line bg-surface px-3.5 py-2.5 text-sm text-ink',
          'focus:border-cyan focus:outline-none focus:ring-[3px] focus:ring-cyan/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
