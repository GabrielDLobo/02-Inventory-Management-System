import { ArchiveBoxIcon } from '@heroicons/react/24/outline'
import { StatusPill } from '@/components/ui/StatusPill'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'
import { LOW_STOCK_THRESHOLD } from '@/lib/stock'
import type { LowStockRow } from './types'

interface LowStockTableProps {
  rows: LowStockRow[]
}

export function LowStockTable({ rows }: LowStockTableProps) {
  if (rows.length === 0) {
    return <p className="p-[18px] text-sm text-muted">Nenhum produto abaixo do estoque mínimo. Tudo em ordem.</p>
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <Th>Produto</Th>
            <Th>Categoria</Th>
            <Th>Fornecedor</Th>
            <Th>Estoque</Th>
            <Th>Mínimo</Th>
            <Th>Status</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <Td>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg bg-cyan/10 text-cyan-700">
                    <ArchiveBoxIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">{row.title}</div>
                    {row.serieNumber && <div className="text-[11.5px] text-muted">SKU {row.serieNumber}</div>}
                  </div>
                </div>
              </Td>
              <Td>{row.categoryName}</Td>
              <Td>{row.supplierName}</Td>
              <Td mono>{row.quantity}</Td>
              <Td mono>{LOW_STOCK_THRESHOLD}</Td>
              <Td>
                <StatusPill status={row.status} />
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
