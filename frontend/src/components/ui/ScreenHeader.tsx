import type { ComponentType, ReactNode } from 'react'
import { Scene3D } from '@/components/three/Scene3D'

export type PageHeroAccent = 'cyan' | 'violet' | 'human' | 'success' | 'danger'

const ACCENT_COLORS: Record<PageHeroAccent, string> = {
  cyan: '#22D3EE',
  violet: '#7C6FF0',
  human: '#FF9E7A',
  success: '#10B981',
  danger: '#F43F5E',
}

interface ScreenHeaderProps<TProps extends object> {
  /** Rótulo do grupo de navegação (breadcrumb), ex.: "Estoque". */
  eyebrow?: string
  title: string
  description: string
  /** Botões de ação da tela, alinhados à direita do título. */
  actions?: ReactNode
  /** Cor de destaque do halo/malha CSS quando a tela não tem objeto 3D real. */
  accent?: PageHeroAccent
  /**
   * Só passado pelas telas com identidade 3D própria (Dashboard e Assistente
   * IA — ver design-system.md §6): as demais usam apenas a malha/halo em CSS
   * abaixo, sem contexto WebGL.
   */
  loadScene?: () => Promise<{ default: ComponentType<TProps> }>
  sceneProps?: TProps
  cameraPosition?: [number, number, number]
}

// PageHero: faixa escura no topo de toda tela interna (design-system.md §6,
// evoluída pro Layout v2). Gradiente radial + malha em CSS mascarada + halo
// de cor, com breadcrumb, badge de demo, título/descrição e ações à direita.
export function ScreenHeader<TProps extends object = Record<string, never>>({
  eyebrow,
  title,
  description,
  actions,
  accent = 'cyan',
  loadScene,
  sceneProps,
  cameraPosition = [0, 0, 4.5],
}: ScreenHeaderProps<TProps>) {
  const haloColor = ACCENT_COLORS[accent]

  return (
    <div
      className="relative overflow-hidden pb-14 pt-6"
      style={{ background: 'radial-gradient(120% 100% at 15% 0%, #12203A 0%, #0A101C 55%, #04070D 100%)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.25]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,197,214,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,197,214,.5) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(65% 90% at 20% 10%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(65% 90% at 20% 10%, black 0%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: haloColor, opacity: 0.22 }}
      />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-[30px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C8CA0]">
            <span>SGE</span>
            {eyebrow && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#9DB1BD]">{eyebrow}</span>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-[6px] text-[11px] font-semibold text-cyan">
            <i className="h-[6px] w-[6px] animate-pulse rounded-full bg-cyan shadow-glow motion-reduce:animate-none" aria-hidden="true" />
            Modo demonstração
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold tracking-[-.01em] text-white sm:text-[28px]">{title}</h1>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[#8CA0AD]">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {actions}
            {loadScene && (
              <Scene3D
                loadScene={loadScene}
                sceneProps={sceneProps}
                className="h-16 w-16 flex-none sm:h-20 sm:w-20"
                cameraPosition={cameraPosition}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
