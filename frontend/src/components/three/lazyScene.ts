import { lazy, type ComponentType } from 'react'

type SceneLoader = () => Promise<{ default: ComponentType }>

// Cacheia o componente lazy por referência do loader, para que <Scene3D> não
// precise chamar `lazy()` dentro do corpo do componente a cada render (o que
// recriaria o componente e resetaria o Suspense a cada vez, além de disparar
// o aviso de lint react(static-components)).
const cache = new WeakMap<SceneLoader, ComponentType>()

export function getLazyScene(loadScene: SceneLoader): ComponentType {
  let component = cache.get(loadScene)
  if (!component) {
    component = lazy(loadScene)
    cache.set(loadScene, component)
  }
  return component
}
