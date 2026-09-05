import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="mb-3.5">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.09em] text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'w-full rounded-[11px] border border-line bg-surface px-3.5 py-2.5 text-sm text-ink',
          'focus:border-cyan focus:outline-none focus:ring-[3px] focus:ring-cyan/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
