import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import type { Mesh } from 'three'
import { useScene3DActive } from '../scene3DActiveContext'

export interface AmbientCubeProps {
  /** Cor de destaque da tela (aresta do cubo e luz de ponto). Padrão: cyan da marca. */
  color?: string
}

// Objeto 3D ambiente para cabeçalhos de tela (design-system.md §6: "cubo/caixa
// girando devagar, tema estoque"). Sempre montado atrás de <Scene3D loadScene=.../>,
// nunca importado diretamente por uma página.
export default function AmbientCube({ color = '#22D3EE' }: AmbientCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const active = useScene3DActive()
  const invalidate = useThree((state) => state.invalidate)

  useFrame((_state, delta) => {
    if (!active || !meshRef.current) return
    meshRef.current.rotation.x += delta * 0.25
    meshRef.current.rotation.y += delta * 0.35
    invalidate()
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={40} color={color} />
      <mesh ref={meshRef}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#0A0F1A" transparent opacity={0.85} />
        <Edges color={color} />
      </mesh>
    </>
  )
}
