import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import useGameStore from '../store/useGameStore'
import { PieceGeometry } from './PieceGeometry'
import { FallbackMaterial } from './Environment'
import { squareToPosition } from '../utils/boardUtils'

function AnimatedCapturedPiece({ type, color, index, targetX, targetZ, isWhiteGrass }) {
  const chess = useGameStore(s => s.chess)
  const groupRef = useRef()
  const isWhitePiece = color === 'w'
  
  const materialProps = isWhitePiece
    ? { url: '/textures/wood-light.jpg', fallbackColor: '#E8C8A2', roughness: 0.4, metalness: 0.05 }
    : { url: '/textures/wood-dark.jpg', fallbackColor: '#4C2307', roughness: 0.5, metalness: 0.05 }

  const rotation = type === 'n' ? [0, isWhitePiece ? Math.PI : 0, 0] : [0, 0, 0]

  const animState = useRef({ active: false, elapsed: 0, startZ: 0 })
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      
      const currentArr = isWhiteGrass ? useGameStore.getState().capturedByWhite : useGameStore.getState().capturedByBlack
      if (index === currentArr.length - 1) {
        const history = chess.history({ verbose: true })
        let sZ = targetZ
        if (history.length > 0) {
          const lastMove = history[history.length - 1]
          if (lastMove.flags.includes('c') || lastMove.flags.includes('e')) {
            sZ = squareToPosition(lastMove.to)[2]
          }
        }
        animState.current = { active: true, elapsed: 0, startZ: sZ }
      }
    }
  }, [chess, index, isWhiteGrass, targetZ])

  useFrame((_, delta) => {
    if (!groupRef.current || !animState.current.active) return
    animState.current.elapsed += delta * 1000
    const t = Math.min(animState.current.elapsed / 500, 1)
    
    // Smooth ease out
    const easeOut = 1 - Math.pow(1 - t, 3)

    const startX = isWhiteGrass ? 4.5 : -4.5
    const endX = targetX
    const endZ = targetZ
    const startZ = animState.current.startZ

    groupRef.current.position.x = startX + (endX - startX) * easeOut
    groupRef.current.position.z = startZ + (endZ - startZ) * easeOut
    groupRef.current.position.y = 0.15 + (0.05 - 0.15) * easeOut

    if (t >= 1) {
      animState.current.active = false
    }
  })

  // Initial setup
  const initX = animState.current.active ? (isWhiteGrass ? 4.5 : -4.5) : targetX
  const initZ = animState.current.active ? animState.current.startZ : targetZ
  const initY = animState.current.active ? 0.15 : 0.05

  return (
    <group ref={groupRef} position={[initX, initY, initZ]} rotation={rotation} scale={0.72}>
      <mesh castShadow receiveShadow>
        <PieceGeometry type={type} />
        <FallbackMaterial {...materialProps} />
      </mesh>
    </group>
  )
}

export default function CapturedPieces() {
  const screen = useGameStore(s => s.screen)
  const capturedByWhite = useGameStore(s => screen === 'review' ? s.reviewCapturedByWhite : s.capturedByWhite) 
  const capturedByBlack = useGameStore(s => screen === 'review' ? s.reviewCapturedByBlack : s.capturedByBlack)

  const renderCaptured = (pieces, isWhiteGrass) => {
    return pieces.map((type, i) => {
      const startX = isWhiteGrass ? 6 : -6
      const dirX = isWhiteGrass ? 1 : -1
      
      const col = Math.floor(i / 8)
      const row = i % 8
      
      const x = startX + col * 1.0 * dirX
      const z = -3.5 + row * 1.0
      
      const color = isWhiteGrass ? 'b' : 'w' // Grass is "captured by White", so pieces are Black
      
      return (
        <AnimatedCapturedPiece 
          key={`cap-${isWhiteGrass}-${i}`} 
          type={type} 
          color={color} 
          index={i}
          targetX={x} 
          targetZ={z} 
          isWhiteGrass={isWhiteGrass}
        />
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
