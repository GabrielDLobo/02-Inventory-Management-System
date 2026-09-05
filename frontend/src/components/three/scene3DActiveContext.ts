import { createContext, useContext } from 'react'

// true só quando a cena está visível na viewport E o usuário não pediu
// motion reduzido. As cenas (conteúdo de <Scene3D>) devem checar isso dentro
// do próprio useFrame antes de girar/animar e chamar invalidate() — o
// <Canvas frameloop="demand"> não redesenha sozinho, então sem essa checagem
// simplesmente não haveria animação nenhuma, ativa ou não.
const Scene3DActiveContext = createContext(false)

export const Scene3DActiveProvider = Scene3DActiveContext.Provider

export function useScene3DActive(): boolean {
  return useContext(Scene3DActiveContext)
}
