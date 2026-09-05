import type { TdHTMLAttributes, ThHTMLAttributes, HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function TableContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('overflow-x-auto', className)} {...props} />
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full border-collapse', className)} {...props} />
}

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b border-line-2 last:border-b-0 hover:bg-surface-2', className)} {...props} />
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b border-line-2 bg-surface-2 px-[18px] py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[.07em] text-muted',
        className,
      )}
      {...props}
    />
  )
}

interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {
  mono?: boolean
}

export function Td({ className, mono, ...props }: TdProps) {
  return (
    <td
      className={cn('whitespace-nowrap px-[18px] py-3 text-[13px] text-ink', mono && 'font-mono font-tabular', className)}
      {...props}
    />
  )
}
