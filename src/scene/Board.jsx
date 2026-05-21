import React from 'react'
import { FallbackMaterial } from './Environment'
import useGameStore from '../store/useGameStore'
import Piece from './Piece'
import { squareToPosition } from '../utils/boardUtils'
import { useChess } from '../hooks/useChess'
import SquareHighlight from './SquareHighlight'

export default function Board() {
  const chess = useGameStore(s => s.chess)
  const fen = useGameStore(s => s.fen) // subscribe to fen changes
  const selectedSquare = useGameStore(s => s.selectedSquare)
  const validMoves = useGameStore(s => s.validMoves)
  const inCheck = useGameStore(s => s.inCheck)
  const turn = useGameStore(s => s.turn)
  
  const { handleSquareClick } = useChess()

  const squares = []
  const pieces = []
  const highlights = []
  
  const boardState = chess.board()
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 !== 0
      
      const square = String.fromCharCode(col + 97) + (8 - row)
      const x = col - 3.5
      const z = 3.5 - row
      const pos = squareToPosition(square)
      
      squares.push(
        <mesh 
          key={`sq-${square}`} 
          position={[x, 0, z]} 
          castShadow 
          receiveShadow
          onClick={(e) => { e.stopPropagation(); handleSquareClick(square) }}
        >
          <boxGeometry args={[1, 0.1, 1]} />
          {isLight ? (
            <FallbackMaterial 
              url="/textures/wood-light.jpg"
              fallbackColor="#C8A882"
              roughness={0.4}
              metalness={0.05}
            />
          ) : (
            <FallbackMaterial 
              url="/textures/wood-dark.jpg"
              fallbackColor="#5C3317"
              roughness={0.5}
              metalness={0.05}
            />
          )}
        </mesh>
      )
      
      
      const piece = boardState[row][col]
      if (piece) {
        pieces.push(
          <Piece key={`p-${square}`} type={piece.type} color={piece.color} position={pos} />
        )
        // Highlight check
        if (inCheck && piece.type === 'k' && piece.color === turn) {
          highlights.push(<SquareHighlight key={`h-check-${square}`} position={pos} type="check" />)
        }
      }
      
      // Highlight selection
      if (selectedSquare === square) {
        highlights.push(<SquareHighlight key={`h-sel-${square}`} position={pos} type="selected" />)
      }
      
      // Highlight valid moves
      const validMove = validMoves.find(m => m.to === square)
      if (validMove) {
        const isCapture = validMove.flags.includes('c') || validMove.flags.includes('e')
        highlights.push(<SquareHighlight key={`h-val-${square}`} position={pos} type={isCapture ? 'capture' : 'valid'} />)
      }
    }
  }

  return (
    <group>
      {/* 8x8 Squares */}
      {squares}

      {/* Highlights */}
      {highlights}

      {/* Pieces */}
      {pieces}

      {/* Board Border Rails */}
      {/* Border thickness: 1 unit on each side. Total board width is 8. Border makes it 10x10. */}
      {/* Top and Bottom Rails (X-axis spans 10 units) */}
      <mesh position={[0, -0.075, -4.5]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.25, 1]} />
        <FallbackMaterial 
          url="/textures/board-border.jpg"
          fallbackColor="#7B4A1E"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.075, 4.5]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.25, 1]} />
        <FallbackMaterial 
          url="/textures/board-border.jpg"
          fallbackColor="#7B4A1E"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Left and Right Rails (Z-axis spans 8 units to fit between top/bottom rails) */}
      <mesh position={[-4.5, -0.075, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.25, 8]} />
        <FallbackMaterial 
          url="/textures/board-border.jpg"
          fallbackColor="#7B4A1E"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[4.5, -0.075, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.25, 8]} />
        <FallbackMaterial 
          url="/textures/board-border.jpg"
          fallbackColor="#7B4A1E"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}
