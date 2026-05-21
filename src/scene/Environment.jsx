import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Helper to safely load textures or use a fallback color
export function FallbackMaterial({ url, normalUrl, fallbackColor, roughness, metalness, wrap = false, repeat = [1, 1] }) {
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(fallbackColor),
      roughness: roughness || 0.5,
      metalness: metalness || 0
    })

    const loader = new THREE.TextureLoader()
    
    loader.load(url, (texture) => {
      if (wrap) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(repeat[0], repeat[1])
      }
      mat.map = texture
      mat.color.setHex(0xffffff) // Reset color if texture loads
      mat.needsUpdate = true
    }, undefined, (err) => {
      console.warn(`Texture not found: ${url}, using fallback color.`)
    })

    if (normalUrl) {
      loader.load(normalUrl, (normal) => {
        if (wrap) {
          normal.wrapS = normal.wrapT = THREE.RepeatWrapping
          normal.repeat.set(repeat[0], repeat[1])
        }
        mat.normalMap = normal
        mat.needsUpdate = true
      }, undefined, (err) => {
        console.warn(`Normal map not found: ${normalUrl}`)
      })
    }

    return mat
  }, [url, normalUrl, fallbackColor, roughness, metalness, wrap, repeat])

  return <primitive object={material} attach="material" />
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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

      {/* Tree Trunk Base */}
      <mesh position={[-9, 5, -4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.1, 10, 12]} />
        <FallbackMaterial 
          url="/textures/bark-diffuse.jpg"
          normalUrl="/textures/bark-normal.jpg"
          fallbackColor="#3B2010"
          roughness={0.85}
        />
      </mesh>

      {/* Tree Trunk Upper */}
      <mesh position={[-9.2, 11, -3.8]} rotation={[0, 0, -0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.8, 6, 12]} />
        <FallbackMaterial 
          url="/textures/bark-diffuse.jpg"
          normalUrl="/textures/bark-normal.jpg"
          fallbackColor="#3B2010"
          roughness={0.85}
        />
      </mesh>

      {/* Roots */}
      {[
        { pos: [-9, 0, -3], rot: [Math.PI/2, 0.2, 0] },
        { pos: [-8.5, 0, -4.5], rot: [Math.PI/2, -0.5, Math.PI/3] },
        { pos: [-9.5, 0, -4.5], rot: [Math.PI/2, -0.3, -Math.PI/3] }
      ].map((root, i) => (
        <mesh key={`root-${i}`} position={root.pos} rotation={root.rot} castShadow receiveShadow>
          <torusGeometry args={[1, 0.4, 8, 12, Math.PI]} />
          <FallbackMaterial 
            url="/textures/bark-diffuse.jpg"
            normalUrl="/textures/bark-normal.jpg"
            fallbackColor="#3B2010"
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Main Tree Foliage Canopy — layered spheres for depth */}
      {[
        { pos: [-9, 15, -3.5], scale: [5, 4, 5] },
        { pos: [-8, 18, -2.5], scale: [3.5, 3, 3.5] },
        { pos: [-11, 16, -4], scale: [3, 3.5, 3] },
        { pos: [-9.5, 20, -3], scale: [2.5, 2.5, 2.5] },
        { pos: [-7.5, 14, -2], scale: [2.5, 2, 2.5] },
      ].map((leaf, i) => (
        <mesh
          key={`leaf-${i}`}
          ref={el => foliageRefs.current[i] = el}
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

      {/* Second background tree (right side, distant) */}
      <mesh position={[12, 4, -8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.8, 8, 10]} />
        <FallbackMaterial url="/textures/bark-diffuse.jpg" fallbackColor="#3B2010" roughness={0.85} />
      </mesh>
      {[
        { pos: [12, 12, -8], scale: [3.5, 3, 3.5] },
        { pos: [13, 14, -7.5], scale: [2.5, 2.5, 2.5] },
        { pos: [11, 13, -9], scale: [2.5, 2, 2.5] },
      ].map((leaf, i) => (
        <mesh
          key={`leaf2-${i}`}
          ref={el => foliageRefs.current[5 + i] = el}
          position={leaf.pos}
          scale={leaf.scale}
          castShadow
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#254d24' : '#2d6e2b'}
            roughness={0.95}
            metalness={0}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}
    </group>
  )
}
