import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PieceGeometry, KnightHeadGeometry } from './PieceGeometry'
import { FallbackMaterial } from './Environment'
import { dampVector3 } from '../utils/animationUtils'
import useGameStore from '../store/useGameStore'

export default function Piece({ type, color, position, square, isCaptured = false }) {
  const groupRef = useRef()
  const isWhite = color === 'w'
  
  const selectedSquare = useGameStore(s => s.selectedSquare)
  const isSelected = !isCaptured && selectedSquare === square

  const materialProps = isWhite
    ? { url: '/textures/wood-light.jpg', fallbackColor: '#E8C8A2', roughness: 0.4, metalness: 0.05 }
    : { url: '/textures/wood-dark.jpg', fallbackColor: '#4C2307', roughness: 0.5, metalness: 0.05 }

  // Rotate black knights to face forward, white knights face backward
  const rotation = type === 'n' ? [0, isWhite ? Math.PI : 0, 0] : [0, 0, 0]

  // Teleport to initial position on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position)
    }
  }, []) // only on mount

  useFrame((state, delta) => {
    if (!groupRef.current) return

    let targetY = position[1]
    
    // Selection bob animation
    if (isSelected) {
      targetY += 0.3 + Math.sin(state.clock.elapsedTime * 6) * 0.1
    }

    dampVector3(groupRef.current.position, position[0], targetY, position[2], 8, delta)
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <PieceGeometry type={type} />
        <FallbackMaterial {...materialProps} />
      </mesh>
      {type === 'n' && (
        <mesh position={[0, 0.7, 0.1]} castShadow receiveShadow>
          <KnightHeadGeometry />
          <FallbackMaterial {...materialProps} />
        </mesh>
      )}
    </group>
  )
}
