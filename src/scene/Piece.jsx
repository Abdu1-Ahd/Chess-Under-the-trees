import React from 'react'
import { PieceGeometry, KnightHeadGeometry } from './PieceGeometry'
import { FallbackMaterial } from './Environment'

export default function Piece({ type, color, position }) {
  const isWhite = color === 'w'

  const materialProps = isWhite
    ? { url: '/textures/wood-light.jpg', fallbackColor: '#E8C8A2', roughness: 0.4, metalness: 0.05 }
    : { url: '/textures/wood-dark.jpg', fallbackColor: '#4C2307', roughness: 0.5, metalness: 0.05 }

  // Rotate black knights to face forward, white knights face backward
  const rotation = type === 'n' ? [0, isWhite ? Math.PI : 0, 0] : [0, 0, 0]

  return (
    <group position={position} rotation={rotation}>
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
