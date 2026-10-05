/**
 * AtmosphereCanvas.jsx
 * ----------------------------------------------------------------
 * Persistent R3F canvas that sits fixed behind the entire page.
 * Controls: stars, floating diyas, golden particles, kashful, fog.
 * Driven by GSAP ScrollTrigger via a shared scrollProgress ref.
 * ----------------------------------------------------------------
 */
import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Detect mobile / low-end ─── */
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ─── Shared scroll progress (written by GSAP in App, read here) ─── */
export const scrollState = { progress: 0, mouse: { x: 0, y: 0 } }

/* ─────────── FLOATING DIYAS ─────────── */
function Diyas({ count = 6 }) {
  const group = useRef()
  const diyas = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 5 - 1,
        (Math.random() - 0.5) * 10 - 2
      ),
      speed: 0.3 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.05,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    const sp = scrollState.progress

    group.current.children.forEach((child, i) => {
      const d = diyas[i]
      const float = Math.sin(t * d.speed + d.phase) * 0.25
      child.position.set(
        d.pos.x + scrollState.mouse.x * 0.3,
        d.pos.y + float,
        d.pos.z + scrollState.mouse.y * 0.15
      )
      // Fade diyas as we approach bijoya (progress > 0.75)
      const fade = sp > 0.75 ? 1 - (sp - 0.75) * 4 : 1
      child.scale.setScalar(d.scale * Math.max(0, fade))
    })
  })

  return (
    <group ref={group}>
      {diyas.map((d, i) => (
        <group key={i}>
          {/* Diya body — flat disc */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.05, 12]} />
            <meshStandardMaterial color="#C47B2B" roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Flame */}
          <mesh position={[0, 0.12, 0]}>
            <coneGeometry args={[0.04, 0.18, 8]} />
            <meshStandardMaterial
              color="#FFD700" emissive="#FF8C00"
              emissiveIntensity={2} transparent opacity={0.9}
            />
          </mesh>
          {/* Point light */}
          <pointLight
            color="#FF8C00" intensity={0.6} distance={3} decay={2}
            position={[0, 0.15, 0]}
          />
        </group>
      ))}
    </group>
  )
}

/* ─────────── KASH FLOWERS ─────────── */
function KashField({ count = 30 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: -3.5 + Math.random() * 0.8,
      z: (Math.random() - 0.5) * 8 - 1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      height: 0.8 + Math.random() * 0.8,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    positions.forEach((p, i) => {
      const sway = Math.sin(t * p.speed + p.phase) * 0.15
      dummy.position.set(p.x + sway * 0.5, p.y, p.z)
      dummy.rotation.z = sway
      dummy.scale.set(0.06, p.height * 0.1, 0.06)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} castShadow>
      <cylinderGeometry args={[1, 1, 10, 6]} />
      <meshStandardMaterial color="#c8d8a0" roughness={0.9} />
    </instancedMesh>
  )
}

/* ─────────── SHIULI PETALS ─────────── */
function ShiuliPetals({ count = 25 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: 8 + Math.random() * 8,
      z: (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.01,
      vy: -(0.005 + Math.random() * 0.01),
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      size: 0.06 + Math.random() * 0.07,
    }))
  }, [count])

  const stateRef = useRef(petals.map(p => ({ ...p })))

  useFrame(() => {
    if (!mesh.current) return
    const sp = scrollState.progress

    stateRef.current.forEach((s, i) => {
      s.y += s.vy
      s.x += s.vx + sp * 0.003
      s.rot += s.rotSpeed

      if (s.y < -6) {
        s.y = 8 + Math.random() * 4
        s.x = (Math.random() - 0.5) * 20
      }

      dummy.position.set(
        s.x + scrollState.mouse.x * 0.2,
        s.y,
        s.z
      )
      dummy.rotation.set(s.rot, s.rot * 0.5, s.rot * 0.3)
      dummy.scale.setScalar(s.size)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#FFFACD" roughness={0.8} transparent opacity={0.85}
      />
    </instancedMesh>
  )
}

/* ─────────── GOLDEN PARTICLES ─────────── */
function GoldenParticles({ count = 120 }) {
  const points = useRef()

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = Array.from({ length: count }, () => ({
      vy: 0.005 + Math.random() * 0.01,
      vx: (Math.random() - 0.5) * 0.005,
    }))
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
    }
    return { positions, velocities }
  }, [count])

  const posRef = useRef(new Float32Array(positions))

  useFrame(() => {
    if (!points.current) return
    const arr = posRef.current
    const sp = scrollState.progress

    for (let i = 0; i < count; i++) {
      arr[i * 3]     += velocities[i].vx + scrollState.mouse.x * 0.001
      arr[i * 3 + 1] += velocities[i].vy * (1 - sp * 0.5)
      arr[i * 3 + 2] += sp * 0.005

      if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -8
    }
    points.current.geometry.attributes.position.array.set(arr)
    points.current.geometry.attributes.position.needsUpdate = true

    // Fade particles at bijoya
    const fade = sp > 0.8 ? 1 - (sp - 0.8) * 5 : 1
    points.current.material.opacity = 0.6 * Math.max(0, fade)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={posRef.current}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFD700" size={0.06} transparent opacity={0.6}
        sizeAttenuation depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─────────── ATMOSPHERE LIGHTING ─────────── */
function AtmosphereLighting() {
  const ambRef = useRef()
  const dirRef = useRef()
  const maroonRef = useRef()
  const goldRef = useRef()

  useFrame(() => {
    const sp = scrollState.progress

    if (ambRef.current) {
      // Brighten slightly during ashtami (0.3-0.45), dim at bijoya
      const intensity = sp > 0.7
        ? 0.15 + (1 - (sp - 0.7) / 0.3) * 0.2
        : 0.2 + Math.sin(sp * Math.PI * 2) * 0.1
      ambRef.current.intensity = intensity
    }

    if (goldRef.current) {
      // Gold light dims as bijoya approaches
      const fade = sp > 0.75 ? 1 - (sp - 0.75) * 4 : 1
      goldRef.current.intensity = 0.8 * Math.max(0, fade)
    }
  })

  return (
    <>
      <ambientLight ref={ambRef} color="#1a0509" intensity={0.25} />
      <directionalLight color="#FFE4B5" intensity={0.3} position={[5, 8, 5]} />
      <pointLight ref={goldRef} color="#C9941A" intensity={0.8} position={[-3, 2, 4]} distance={20} decay={2} />
      <pointLight ref={maroonRef} color="#6B0E1E" intensity={0.4} position={[5, -1, -3]} distance={15} decay={2} />
      <pointLight color="#FF8C00" intensity={0.2} position={[0, 3, 5]} distance={12} decay={2} />
    </>
  )
}

/* ─────────── CAMERA CONTROLLER ─────────── */
function CameraRig() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const lerpedPos = useRef(new THREE.Vector3(0, 1, 9))

  useEffect(() => {
    camera.position.set(0, 1, 12)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(({ clock }) => {
    const sp = scrollState.progress
    const mx = scrollState.mouse.x
    const my = scrollState.mouse.y
    const t = clock.getElapsedTime()

    // Camera journey mapped to scroll:
    // 0.0  → hero: (0, 1, 9)
    // 0.15 → schedule: (0, 0, 7)
    // 0.4  → invitation: (0.5, 0.5, 8)
    // 0.6  → cultural: (-0.3, 0, 7)
    // 0.85 → bijoya: (0, 1, 11) — pull back
    // 1.0  → end: (0, 2, 14)

    let tx, ty, tz
    if (sp < 0.15) {
      const p = sp / 0.15
      tx = THREE.MathUtils.lerp(0, 0, p)
      ty = THREE.MathUtils.lerp(1, 0.5, p)
      tz = THREE.MathUtils.lerp(9, 8, p)
    } else if (sp < 0.4) {
      const p = (sp - 0.15) / 0.25
      tx = THREE.MathUtils.lerp(0, 0.3, p)
      ty = THREE.MathUtils.lerp(0.5, 0, p)
      tz = THREE.MathUtils.lerp(8, 7, p)
    } else if (sp < 0.65) {
      const p = (sp - 0.4) / 0.25
      tx = THREE.MathUtils.lerp(0.3, -0.3, p)
      ty = THREE.MathUtils.lerp(0, 0.3, p)
      tz = THREE.MathUtils.lerp(7, 7.5, p)
    } else if (sp < 0.85) {
      const p = (sp - 0.65) / 0.2
      tx = THREE.MathUtils.lerp(-0.3, 0, p)
      ty = THREE.MathUtils.lerp(0.3, 1, p)
      tz = THREE.MathUtils.lerp(7.5, 10, p)
    } else {
      const p = (sp - 0.85) / 0.15
      tx = 0
      ty = THREE.MathUtils.lerp(1, 2, p)
      tz = THREE.MathUtils.lerp(10, 14, p)
    }

    // Add subtle breathing + mouse parallax
    const breathX = Math.sin(t * 0.18) * 0.08
    const breathY = Math.cos(t * 0.12) * 0.05

    target.current.set(
      tx + mx * 0.35 + breathX,
      ty + my * 0.2 + breathY,
      tz
    )

    lerpedPos.current.lerp(target.current, 0.025)
    camera.position.copy(lerpedPos.current)
    camera.lookAt(0, ty * 0.3, 0)
  })

  return null
}

/* ─────────── MANDAP SILHOUETTE ─────────── */
function MandapSilhouette() {
  const group = useRef()

  useFrame(({ clock }) => {
    if (!group.current) return
    const sp = scrollState.progress
    // Fade mandap as we move deep into schedule
    const fade = sp > 0.2 ? Math.max(0, 1 - (sp - 0.2) * 3) : 1
    group.current.children.forEach(c => {
      if (c.material) c.material.opacity = fade * 0.35
    })
  })

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      {/* Central spire */}
      <mesh position={[0, 3, -4]}>
        <coneGeometry args={[0.3, 2.5, 6]} />
        <meshStandardMaterial color="#8B0000" emissive="#3A0510" transparent opacity={0.35} />
      </mesh>
      {/* Side spires */}
      {[-2, 2].map((x, i) => (
        <mesh key={i} position={[x, 2.2, -4]}>
          <coneGeometry args={[0.2, 1.8, 6]} />
          <meshStandardMaterial color="#6B0E1E" emissive="#2d0508" transparent opacity={0.3} />
        </mesh>
      ))}
      {/* Base platform */}
      <mesh position={[0, 0, -4]}>
        <boxGeometry args={[8, 0.2, 3]} />
        <meshStandardMaterial color="#3A0510" emissive="#1a0305" transparent opacity={0.5} />
      </mesh>
      {/* Pillars */}
      {[-3, -1.5, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[x, 1.25, -4]}>
          <cylinderGeometry args={[0.12, 0.15, 2.5, 8]} />
          <meshStandardMaterial color="#C9941A" emissive="#6B4E0E" emissiveIntensity={0.3} transparent opacity={0.25} />
        </mesh>
      ))}
      {/* Decorative arch */}
      <mesh position={[0, 2.5, -3.8]}>
        <torusGeometry args={[2.5, 0.12, 8, 40, Math.PI]} />
        <meshStandardMaterial color="#C9941A" emissive="#FFD700" emissiveIntensity={0.4} transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

/* ─────────── MOON ─────────── */
function Moon() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const sp = scrollState.progress
    ref.current.position.y = 5 - sp * 3
    ref.current.material.emissiveIntensity = 0.3 - sp * 0.25
  })
  return (
    <mesh ref={ref} position={[6, 5, -8]}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial
        color="#FFF8E7" emissive="#FFF8E7"
        emissiveIntensity={0.3} transparent opacity={0.6}
      />
    </mesh>
  )
}

/* ─────────── MAIN SCENE ─────────── */
function Scene({ mobile }) {
  const particleCount = mobile ? 50 : 120
  const diyaCount = mobile ? 3 : 6
  const kashCount = mobile ? 15 : 30
  const shiuliCount = mobile ? 12 : 25

  return (
    <>
      <AtmosphereLighting />
      <CameraRig />
      <fog attach="fog" args={['#1A0305', 14, 35]} />

      <Stars radius={60} depth={30} count={mobile ? 800 : 1500} factor={3} saturation={0} fade speed={0.5} />
      <Moon />
      <MandapSilhouette />
      <KashField count={kashCount} />
      <Diyas count={diyaCount} />
      <ShiuliPetals count={shiuliCount} />
      <GoldenParticles count={particleCount} />

      {/* Subtle ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, -2]}>
        <planeGeometry args={[25, 15]} />
        <meshStandardMaterial
          color="#1A0305" emissive="#3A0510"
          emissiveIntensity={0.15} transparent opacity={0.7}
        />
      </mesh>
    </>
  )
}

/* ─────────── EXPORTED CANVAS ─────────── */
export default function AtmosphereCanvas() {
  const mobile = isMobile()
  const reduced = prefersReduced()

  if (reduced) return null // Respect prefers-reduced-motion

  return (
    <Canvas
      id="three-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      dpr={mobile ? [1, 1] : [1, 1.5]}
      camera={{ fov: 60, near: 0.1, far: 100 }}
      shadows={!mobile}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <Scene mobile={mobile} />
      </Suspense>
    </Canvas>
  )
}
