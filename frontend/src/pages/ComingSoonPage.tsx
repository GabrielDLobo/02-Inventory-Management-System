import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { EmptyState } from '@/components/ui/EmptyState'

// Espaço reservado pras telas da Fase 3, só pra a navegação da sidebar não
// levar a links mortos enquanto elas não existem.
export function ComingSoonPage({ title }: { title: string }) {
  return (
    <EmptyState
      illustration={
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan/10 text-cyan-700">
          <WrenchScrewdriverIcon className="h-7 w-7" />
        </span>
      }
      title={`${title} chega na próxima fase`}
      description="Esta tela ainda não foi construída."
    />
  )
}
