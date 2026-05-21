import { Chess } from 'chess.js'
import React from 'react'
import { Text } from '@react-three/drei'
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
  const screen = useGameStore(s => s.screen)
  const reviewIndex = useGameStore(s => s.reviewIndex)
  
  const { handleSquareClick } = useChess()

  const squares = []
  const pieces = []
  const highlights = []
  
  let boardState = chess.board()

  if (screen === 'review') {
    const tempChess = new Chess()
    const history = chess.history({ verbose: true })
    for (let i = 0; i < reviewIndex; i++) {
      tempChess.move(history[i])
    }
    boardState = tempChess.board()
  }
  
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
          onClick={(e) => { 
            e.stopPropagation(); 
            if (screen === 'game') handleSquareClick(square) 
          }}
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
          <Piece key={`p-${square}`} square={square} type={piece.type} color={piece.color} position={pos} />
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

  // Coordinate labels
  const files = ['a','b','c','d','e','f','g','h']
  const ranks = ['8','7','6','5','4','3','2','1']
  const coordLabels = []

  files.forEach((file, i) => {
    const x = i - 3.5
    // Bottom rail file labels (white side)
    coordLabels.push(
      <Text
        key={`file-b-${file}`}
        position={[x, 0.16, 4.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.28}
        color="#F5DEB3"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79mT7.woff"
      >
        {file}
      </Text>
    )
  })

  ranks.forEach((rank, i) => {
    const z = i - 3.5
    // Left rail rank labels
    coordLabels.push(
      <Text
        key={`rank-l-${rank}`}
        position={[-4.5, 0.16, z]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.28}
        color="#F5DEB3"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79mT7.woff"
      >
        {rank}
      </Text>
    )
  })

  return (
    <group>
      {/* 8x8 Squares */}
      {squares}

      {/* Highlights */}
      {highlights}

      {/* Pieces */}
      {pieces}

      {/* Coordinate Labels */}
      {coordLabels}

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
