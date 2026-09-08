import toast from 'react-hot-toast'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { PageBody } from '@/components/ui/PageBody'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/format'
import { useAiAssistant } from './assistant/useAiAssistant'

function loadAiCore() {
  return import('@/components/three/scenes/AiCore')
}

export function AssistantPage() {
  const { reload, invoke, isInvoking, ...state } = useAiAssistant()

  async function handleInvoke() {
    const result = await invoke()
    if (result.ok) {
      toast.success('Nova análise gerada.')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <>
      <ScreenHeader
        eyebrow="Inteligência"
        title="Assistente IA"
        description="Análises e sugestões diárias geradas a partir dos dados de estoque e vendas."
        loadScene={loadAiCore}
        cameraPosition={[0, 0, 5]}
        actions={
          state.status === 'success' &&
          state.data && (
            <Button onClick={handleInvoke} disabled={isInvoking}>
              <SparklesIcon className="h-4 w-4" />
              {isInvoking ? 'Gerando análise...' : 'Gerar nova análise'}
            </Button>
          )
        }
      />

      <PageBody>
        {state.status === 'loading' && <LoadingState label="Carregando última análise..." />}
        {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}

        {state.status === 'success' && (
          <Card>
            <CardHeader
              title="Análise do assistente"
              subtitle={state.data ? `Gerada ${formatRelativeTime(state.data.created_at)}` : undefined}
            />
            <CardBody>
              {state.data?.result ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{state.data.result}</p>
              ) : (
                <EmptyState
                  illustration={
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet/10 text-violet">
                      <SparklesIcon className="h-7 w-7" />
                    </span>
                  }
                  title="Nenhuma análise gerada ainda"
                  description="Gere a primeira análise com base nos produtos e saídas cadastrados."
                  action={
                    <Button onClick={handleInvoke} disabled={isInvoking}>
                      {isInvoking ? 'Gerando análise...' : 'Gerar primeira análise'}
                    </Button>
                  }
                />
              )}
            </CardBody>
          </Card>
        )}
      </PageBody>
    </>
  )
}
