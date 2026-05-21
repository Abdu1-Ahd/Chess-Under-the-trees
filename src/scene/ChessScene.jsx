import React from 'react'
import { Canvas } from '@react-three/fiber'
import Environment from './Environment'
import Board from './Board'
import CameraRig from './CameraRig'

export default function ChessScene() {
  return (
    <Canvas shadows gl={{ antialias: true }}>
      <Environment />
      <Board />
      <CameraRig />
    </Canvas>
  )
}
