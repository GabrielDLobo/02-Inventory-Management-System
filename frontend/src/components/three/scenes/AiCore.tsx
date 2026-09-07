import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, PointLight } from 'three'
import { useScene3DActive } from '../scene3DActiveContext'

const CYAN = '#22D3EE'
const VIOLET = '#7C6FF0'

// Identidade 3D da tela de Assistente IA (design-system.md §6: "núcleo de
// energia 3D pulsante"). Sempre montado atrás de <Scene3D loadScene=.../>.
export default function AiCore() {
  const coreRef = useRef<Mesh>(null)
  const shellRef = useRef<Mesh>(null)
  const lightRef = useRef<PointLight>(null)
  const active = useScene3DActive()

  useFrame((state) => {
    if (!active) return
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.12

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse)
    }
    if (shellRef.current) {
      shellRef.current.rotation.y += 0.006
      shellRef.current.rotation.x += 0.003
    }
    if (lightRef.current) {
      lightRef.current.intensity = 30 + Math.sin(state.clock.elapsedTime * 2) * 14
    }
    state.invalidate()
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight ref={lightRef} position={[0, 0, 2]} color={CYAN} intensity={30} />
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color={VIOLET} emissive={CYAN} emissiveIntensity={0.6} transparent opacity={0.9} />
      </mesh>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.35} />
      </mesh>
    </>
  )
}
