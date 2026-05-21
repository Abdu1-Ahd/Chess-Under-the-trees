import React from 'react'
import { Canvas } from '@react-three/fiber'
import Environment from './Environment'
import Board from './Board'
import CameraRig from './CameraRig'
import CapturedPieces from './CapturedPieces'

export default function ChessScene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      camera={{ position: [0, 8, 10], fov: 55, near: 0.1, far: 200 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        zIndex: 0,
      }}
    >
      <color attach="background" args={['#a8c8a0']} />
      <Environment />
      <Board />
      <CapturedPieces />
      <CameraRig />
    </Canvas>
  )
}
