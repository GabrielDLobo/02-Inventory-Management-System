import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type InputTone = 'light' | 'dark'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** 'dark' é usado no card de login sobre o hero 3D; todo o resto da app é 'light'. */
  tone?: InputTone
}

const TONE_CLASSES: Record<InputTone, { label: string; input: string; error: string }> = {
  light: {
    label: 'text-muted',
    input: 'border-line bg-surface text-ink',
    error: 'text-danger',
  },
  dark: {
    label: 'text-[#7F93A0]',
    input: 'border-[rgba(140,160,173,.25)] bg-[rgba(4,7,13,.6)] text-[#EAF2F6] placeholder:text-[#5C6E79]',
    error: 'text-[#FCA5A5]',
  },
}

export function Input({ label, error, id, className, tone = 'light', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const toneClasses = TONE_CLASSES[tone]

  return (
    <div className="mb-3.5">
      <label
        htmlFor={inputId}
        className={cn('mb-1.5 block text-[11px] font-semibold uppercase tracking-[.09em]', toneClasses.label)}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'w-full rounded-[11px] border px-3.5 py-2.5 text-sm',
          toneClasses.input,
          'focus:border-cyan focus:outline-none focus:ring-[3px] focus:ring-cyan/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className={cn('mt-1.5 text-xs', toneClasses.error)}>
          {error}
        </p>
      )}
    </div>
  )
}
