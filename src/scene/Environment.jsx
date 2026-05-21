import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Helper to safely load textures or use a fallback color
export function FallbackMaterial({ url, normalUrl, fallbackColor, roughness, metalness, wrap = false, repeat = [1, 1] }) {
  const [map, setMap] = useState(null)
  const [normalMap, setNormalMap] = useState(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (texture) => {
        if (wrap) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          texture.repeat.set(repeat[0], repeat[1])
        }
        setMap(texture)
      },
      undefined,
      () => console.warn(`Texture not found: ${url}, using fallback color.`)
    )
  }, [url, wrap, repeat])

  useEffect(() => {
    if (!normalUrl) return
    const loader = new THREE.TextureLoader()
    loader.load(
      normalUrl,
      (normal) => {
        if (wrap) {
          normal.wrapS = normal.wrapT = THREE.RepeatWrapping
          normal.repeat.set(repeat[0], repeat[1])
        }
        setNormalMap(normal)
      },
      undefined,
      () => console.warn(`Normal map not found: ${normalUrl}`)
    )
  }, [normalUrl, wrap, repeat])

  return (
    <meshStandardMaterial
      color={map ? '#ffffff' : fallbackColor}
      map={map}
      normalMap={normalMap}
      roughness={roughness ?? 0.5}
      metalness={metalness ?? 0}
    />
  )
}

export default function Environment() {
  // Wind animation ref for foliage
  const foliageRefs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    foliageRefs.current.forEach((ref, i) => {
      if (!ref) return
      const freq = 0.3 + i * 0.07
      const amp = 0.008 + i * 0.002
      ref.rotation.x = Math.sin(t * freq) * amp
      ref.rotation.z = Math.cos(t * freq * 0.7) * amp * 0.6
    })
  })

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#C8D8FF" />
      <hemisphereLight skyColor="#87CEEB" groundColor="#4a7c2f" intensity={0.6} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={2.5}
        color="#FFF5E0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Scene Fog for depth */}
      <fog attach="fog" args={['#a8c8a0', 20, 80]} />
      
      {/* Dappled light effect */}
      {[
        [-3, 15, -2],
        [2, 15, 1],
        [-1, 15, 3],
        [4, 15, -3]
      ].map((pos, i) => (
        <spotLight
          key={i}
          position={pos}
          target-position={[pos[0], 0, pos[2]]}
          intensity={0.3}
          penumbra={0.8}
          angle={0.15}
          castShadow={false}
        />
      ))}

      {/* Grass Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <FallbackMaterial 
          url="/textures/grass-diffuse.jpg"
          normalUrl="/textures/grass-normal.jpg"
          fallbackColor="#4a7c2f"
          roughness={0.9}
          wrap={true}
          repeat={[20, 20]}
        />
      </mesh>

      {/* Single tree at PRD position [-9, 0, -4] */}
      <group position={[-9, 0, -4]}>
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.7, 8, 12]} />
          <meshStandardMaterial color="#3B2010" roughness={0.85} />
        </mesh>

        <mesh position={[-0.2, 11, 0.2]} rotation={[0, 0, -0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.8, 6, 12]} />
          <meshStandardMaterial color="#3B2010" roughness={0.85} />
        </mesh>

        <group position={[-0.5, 0, 0]}>
          {[
            { pos: [0, 0, 1], rot: [Math.PI / 2, 0.2, 0] },
            { pos: [0.5, 0, -0.5], rot: [Math.PI / 2, -0.5, Math.PI / 3] },
            { pos: [-0.5, 0, -0.5], rot: [Math.PI / 2, -0.3, -Math.PI / 3] },
          ].map((root, i) => (
            <mesh key={`root-${i}`} position={root.pos} rotation={root.rot} castShadow receiveShadow>
              <torusGeometry args={[1, 0.4, 8, 12, Math.PI]} />
              <meshStandardMaterial color="#3B2010" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {[
          { pos: [0, 15, 0.5], scale: [5, 4, 5] },
          { pos: [1, 18, 1.5], scale: [3.5, 3, 3.5] },
          { pos: [-2, 16, 0], scale: [3, 3.5, 3] },
          { pos: [-0.5, 20, 1], scale: [2.5, 2.5, 2.5] },
          { pos: [1.5, 14, 2], scale: [2.5, 2, 2.5] },
        ].map((leaf, i) => (
          <mesh
            key={`leaf-${i}`}
            ref={el => { foliageRefs.current[i] = el }}
            position={leaf.pos}
            scale={leaf.scale}
            castShadow
          >
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#2d6e2b' : '#3a8a38'}
              roughness={0.95}
              metalness={0}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>

    </group>
  )
}
