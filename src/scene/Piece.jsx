import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PieceGeometry } from './PieceGeometry'
import { FallbackMaterial } from './Environment'
import useGameStore from '../store/useGameStore'

export default function Piece({ type, color, position, square, isCaptured = false }) {
  const isWhite = color === 'w'
  
  const selectedSquare = useGameStore(s => s.selectedSquare)
  const isSelected = !isCaptured && selectedSquare === square

  const materialProps = isWhite
    ? { url: '/textures/wood-light.jpg', fallbackColor: '#E8C8A2', roughness: 0.4, metalness: 0.05 }
    : { url: '/textures/wood-dark.jpg', fallbackColor: '#4C2307', roughness: 0.5, metalness: 0.05 }

  const rotation = type === 'n' ? [0, isWhite ? Math.PI : 0, 0] : [0, 0, 0]

  const meshRef = useRef()
  const animState = useRef({
    phase: 'idle',
    startX: 0, startZ: 0,
    endX: 0, endZ: 0,
    elapsed: 0,
    peakY: 1.35
  })
  const prevSquareRef = useRef(null)

  // Compute targetPos without importing squareToPosition
  const file = square.charCodeAt(0) - 97
  const rank = parseInt(square[1]) - 1
  const targetPos = [file - 3.5, 0.15, 3.5 - rank]

  useEffect(() => {
    if (prevSquareRef.current === null) {
      prevSquareRef.current = square
      if (meshRef.current) {
        meshRef.current.position.set(targetPos[0], 0.15, targetPos[2])
      }
      return
    }
    if (prevSquareRef.current !== square) {
      const cur = meshRef.current.position
      animState.current = {
        phase: 'lifting',
        startX: cur.x, startZ: cur.z,
        endX: targetPos[0], endZ: targetPos[2],
        elapsed: 0,
        peakY: 1.35
      }
      prevSquareRef.current = square
    }
  }, [square])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const a = animState.current
    if (a.phase === 'idle') {
      let targetY = isCaptured ? 0.05 : 0.15
      if (isSelected) {
        targetY += 0.3 + Math.sin(state.clock.elapsedTime * 6) * 0.1
      }
      meshRef.current.position.y = targetY
      return
    }

    a.elapsed += delta * 1000  // convert to ms

    if (a.phase === 'lifting') {
      const t = Math.min(a.elapsed / 180, 1)
      meshRef.current.position.y = 0.15 + t * (a.peakY - 0.15)
      if (t >= 1) { a.phase = 'moving'; a.elapsed = 0 }
    }
    else if (a.phase === 'moving') {
      const t = Math.min(a.elapsed / 280, 1)
      meshRef.current.position.x = a.startX + (a.endX - a.startX) * t
      meshRef.current.position.z = a.startZ + (a.endZ - a.startZ) * t
      meshRef.current.position.y = a.peakY
      if (t >= 1) { a.phase = 'lowering'; a.elapsed = 0 }
    }
    else if (a.phase === 'lowering') {
      const t = Math.min(a.elapsed / 180, 1)
      meshRef.current.position.y = a.peakY + t * (0.15 - a.peakY)
      if (t >= 1) {
        meshRef.current.position.y = 0.15
        a.phase = 'idle'
      }
    }
  })

  return (
    <group ref={meshRef} rotation={rotation} scale={0.72}>
      <mesh castShadow receiveShadow raycast={() => null}>
        <PieceGeometry type={type} />
        <FallbackMaterial {...materialProps} />
      </mesh>
    </group>
  )
}
