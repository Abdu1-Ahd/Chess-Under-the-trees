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
  const pieceIdMap = useGameStore(s => s.pieceIdMap)
  const reviewPieceIdMap = useGameStore(s => s.reviewPieceIdMap)
  
  const { handleSquareClick } = useChess()

  const squares = []
  const pieces = []
  const highlights = []
  
  const activeIdMap = screen === 'review' ? reviewPieceIdMap : pieceIdMap

  let boardState = chess.board()

  if (screen === 'review') {
    const tempChessReview = new Chess()
    const history = chess.history({ verbose: true })
    for (let i = 0; i < reviewIndex; i++) {
      tempChessReview.move(history[i])
    }
    boardState = tempChessReview.board()
  }
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 !== 0
      
      const square = String.fromCharCode(col + 97) + (8 - row)
      const pos = squareToPosition(square)
      const x = pos[0]
      const z = pos[2]
      
      squares.push(
        <group key={`sq-group-${square}`}>
          <mesh 
            key={`sq-${square}`} 
            position={[x, 0, z]} 
            castShadow 
            receiveShadow
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
          <mesh
            name={square}
            position={[x, 0.15, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (screen === 'game') handleSquareClick(e.object.name) 
            }}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </group>
      )
      
      
      const piece = boardState[row][col]
      if (piece !== null) {
        const stableId = activeIdMap[square] || `${piece.color}${piece.type}${square}`
        pieces.push(
          <Piece key={stableId} square={square} type={piece.type} color={piece.color} position={pos} />
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
        position={[x, 0.2, 4.2]}
        fontSize={0.22}
        color="#8B7355"
        anchorX="center"
        anchorY="middle"
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
        position={[-4.2, 0.2, z]}
        fontSize={0.22}
        color="#8B7355"
        anchorX="center"
        anchorY="middle"
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
