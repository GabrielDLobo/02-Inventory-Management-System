import type { ComponentType } from 'react'
import { Scene3D } from '@/components/three/Scene3D'

interface ScreenHeaderProps<TProps extends object> {
  title: string
  description: string
  loadScene: () => Promise<{ default: ComponentType<TProps> }>
  sceneProps?: TProps
  cameraPosition?: [number, number, number]
}

// Cabeçalho escuro com acento 3D ambiente, repetido em toda tela interna
// (design-system.md §6). Cada tela só passa a cena e a cor de destaque.
export function ScreenHeader<TProps extends object = Record<string, never>>({
  title,
  description,
  loadScene,
  sceneProps,
  cameraPosition = [0, 0, 4.5],
}: ScreenHeaderProps<TProps>) {
  return (
    <div className="mb-[22px] overflow-hidden rounded-2xl border border-dark-line bg-dark">
      <div className="grid grid-cols-[1fr_140px] items-center gap-4 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-[#8CA0AD]">{description}</p>
        </div>
        <Scene3D loadScene={loadScene} sceneProps={sceneProps} className="h-[100px] w-full" cameraPosition={cameraPosition} />
      </div>
    </div>
  )
}
