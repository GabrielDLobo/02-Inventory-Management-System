import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { getLazyScene } from './lazyScene'
import { Scene3DActiveProvider } from './scene3DActiveContext'

const Scene3DCanvas = lazy(() => import('./Scene3DCanvas'))

interface Scene3DProps<TProps extends object> {
  /**
   * Importador dinâmico da cena (ex.: `() => import('@/components/three/scenes/AmbientCube')`).
   * Precisa ser uma referência estável (definida fora do componente que
   * renderiza `<Scene3D>`), do jeito que qualquer `import()` usado com
   * `React.lazy` deve ser. Manter a cena atrás de um import dinâmico, em vez
   * de recebê-la como children pronto, é o que garante que `three`,
   * `@react-three/fiber` e `@react-three/drei` fiquem fora do chunk
   * principal: nenhuma tela importa essas libs de forma estática.
   */
  loadScene: () => Promise<{ default: ComponentType<TProps> }>
  /** Props repassadas pra cena (ex.: cor de destaque por tela). */
  sceneProps?: TProps
  className?: string
  cameraPosition?: [number, number, number]
  fov?: number
  dpr?: [number, number]
  /** Mostrado enquanto o chunk 3D carrega e como cena antes de entrar na viewport. */
  fallback?: ReactNode
}

function DefaultFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-br from-dark-2 to-dark"
    />
  )
}

// Wrapper 3D reutilizável usado em toda tela do SGE (design-system.md §6).
// Regras de performance embutidas aqui, para não depender de cada consumidor
// lembrar delas: lazy-load do bundle three/fiber/drei, Suspense com
// fallback estático, dpr limitado, frameloop sob demanda, pausa fora da
// viewport (IntersectionObserver) e frame estático em prefers-reduced-motion
// (a cena ainda aparece, só não anima: ver useScene3DActive).
export function Scene3D<TProps extends object = Record<string, never>>({
  loadScene,
  sceneProps,
  className,
  cameraPosition = [0, 0, 6],
  fov = 50,
  dpr = [1, 1.5],
  fallback,
}: Scene3DProps<TProps>) {
  const { ref, inView, hasBeenVisible } = useInView()
  const reducedMotion = usePrefersReducedMotion()
  const active = inView && !reducedMotion
  const resolvedFallback = fallback ?? <DefaultFallback />
  const SceneContent = getLazyScene(loadScene)

  return (
    <div ref={ref} className={className}>
      {hasBeenVisible ? (
        <Suspense fallback={resolvedFallback}>
          <Scene3DActiveProvider value={active}>
            <Scene3DCanvas dpr={dpr} cameraPosition={cameraPosition} fov={fov}>
              {/* oxlint-disable-next-line react/static-components -- SceneContent vem de
                  getLazyScene, que cacheia por referência de loadScene (ver lazyScene.ts):
                  não é recriado a cada render. */}
              <SceneContent {...((sceneProps ?? {}) as TProps)} />
            </Scene3DCanvas>
          </Scene3DActiveProvider>
        </Suspense>
      ) : (
        resolvedFallback
      )}
    </div>
  )
}
