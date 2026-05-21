import React from 'react'
import useGameStore from '../store/useGameStore'
import Piece from './Piece'

export default function CapturedPieces() {
  const capturedByWhite = useGameStore(s => s.capturedByWhite) 
  const capturedByBlack = useGameStore(s => s.capturedByBlack)

  const renderCaptured = (pieces, isWhite) => {
    return pieces.map((type, i) => {
      const startX = isWhite ? 6 : -6
      const dirX = isWhite ? 1 : -1
      
      const col = Math.floor(i / 8)
      const row = i % 8
      
      const x = startX + col * 1.0 * dirX
      const z = -3.5 + row * 1.0
      
      const color = isWhite ? 'b' : 'w'
      
      return (
        <Piece key={`cap-${isWhite}-${i}`} type={type} color={color} position={[x, 0.05, z]} isCaptured />
      )
    })
  }

  return (
    <group>
      {renderCaptured(capturedByWhite, true)}
      {renderCaptured(capturedByBlack, false)}
    </group>
  )
}
