import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useScene3DActive } from '../scene3DActiveContext'

const CYAN = '#22D3EE'
const VIOLET = '#7C6FF0'
const PARTICLE_COUNT = 700

// Velocidades em rad/s (equivalentes aos incrementos por frame do hero em
// docs/mockups/sge-ui.html, escalados para ~60fps: 0.0022 * 60 ≈ 0.132 etc.).
const GROUP_ROTATION_Y_SPEED = 0.132
const GROUP_ROTATION_X_SPEED = 0.054
const INNER_ROTATION_Y_SPEED = -0.36
const RING_1_SPEED = 0.24
const RING_2_SPEED = -0.18
const PARTICLES_ROTATION_Y_SPEED = 0.036
const CAMERA_EASE = 0.04
const CAMERA_MOUSE_RANGE = 0.9

function useParticlePositions(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3)
    /* oxlint-disable react/purity -- gerado uma única vez por instância da
       cena (useMemo com count fixo), não a cada render: é a posição fixa de
       cada partícula da nuvem, só precisa ser aleatória na primeira vez. */
    for (let i = 0; i < count; i += 1) {
      const radius = 4 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    /* oxlint-enable react/purity */
    return positions
  }, [count])
}

// Hero 3D do login (design-system.md §6 e docs/mockups/sge-ui.html): icosaedro
// wireframe cyan, miolo violeta, dois anéis e uma nuvem de partículas, com a
// câmera seguindo o mouse. Sempre montado atrás de <Scene3D loadScene=.../>.
export default function LoginHero() {
  const groupRef = useRef<Group>(null)
  const innerRef = useRef<Group>(null)
  const ring1Ref = useRef<Group>(null)
  const ring2Ref = useRef<Group>(null)
  const particlesRef = useRef<Group>(null)
  const active = useScene3DActive()
  const positions = useParticlePositions(PARTICLE_COUNT)

  useFrame((state, delta) => {
    if (!active) return

    if (groupRef.current) {
      groupRef.current.rotation.y += GROUP_ROTATION_Y_SPEED * delta
      groupRef.current.rotation.x += GROUP_ROTATION_X_SPEED * delta
    }
    if (innerRef.current) innerRef.current.rotation.y += INNER_ROTATION_Y_SPEED * delta
    if (ring1Ref.current) ring1Ref.current.rotation.z += RING_1_SPEED * delta
    if (ring2Ref.current) ring2Ref.current.rotation.z += RING_2_SPEED * delta
    if (particlesRef.current) particlesRef.current.rotation.y += PARTICLES_ROTATION_Y_SPEED * delta

    const { pointer, camera } = state
    camera.position.x += (pointer.x * CAMERA_MOUSE_RANGE - camera.position.x) * CAMERA_EASE
    camera.position.y += (pointer.y * CAMERA_MOUSE_RANGE - camera.position.y) * CAMERA_EASE
    camera.lookAt(0, 0, 0)

    state.invalidate()
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.55} />
      </mesh>

      <group ref={innerRef}>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial color={VIOLET} transparent opacity={0.35} />
        </mesh>
      </group>

      <group ref={ring1Ref} rotation={[1.2, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[2.5, 0.012, 12, 140]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.4} />
        </mesh>
      </group>

      <group ref={ring2Ref} rotation={[0.4, 1.1, 0]}>
        <mesh>
          <torusGeometry args={[3.1, 0.012, 12, 140]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.4} />
        </mesh>
      </group>

      <group ref={particlesRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial color={CYAN} size={0.03} transparent opacity={0.7} sizeAttenuation />
        </points>
      </group>
    </group>
  )
}
