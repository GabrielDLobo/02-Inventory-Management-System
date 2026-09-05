import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'

interface Scene3DCanvasProps {
  children: ReactNode
  dpr: [number, number]
  cameraPosition: [number, number, number]
  fov: number
}

// Carregado sob demanda (ver Scene3D.tsx): isola three/@react-three/fiber num
// chunk separado, fora do bundle principal. frameloop="demand" significa que
// nada é redesenhado a menos que algo chame invalidate() explicitamente (via
// useScene3DActive nas cenas filhas) — é isso que garante a pausa fora da
// viewport e em prefers-reduced-motion.
export default function Scene3DCanvas({ children, dpr, cameraPosition, fov }: Scene3DCanvasProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: cameraPosition, fov }}
    >
      {children}
    </Canvas>
  )
}
