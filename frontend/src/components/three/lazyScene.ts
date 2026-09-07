import { lazy, type ComponentType } from 'react'

type SceneLoader<TProps extends object> = () => Promise<{ default: ComponentType<TProps> }>

// Cacheia o componente lazy por referência do loader, para que <Scene3D> não
// precise chamar `lazy()` dentro do corpo do componente a cada render (o que
// recriaria o componente e resetaria o Suspense a cada vez, além de disparar
// o aviso de lint react(static-components)).
const cache = new WeakMap<SceneLoader<object>, ComponentType<object>>()

export function getLazyScene<TProps extends object>(loadScene: SceneLoader<TProps>): ComponentType<TProps> {
  let component = cache.get(loadScene as SceneLoader<object>)
  if (!component) {
    component = lazy(loadScene) as unknown as ComponentType<object>
    cache.set(loadScene as SceneLoader<object>, component)
  }
  return component as ComponentType<TProps>
}
