import React from 'react'
import { Canvas } from '@react-three/fiber'
import Environment from './Environment'
import Board from './Board'
import CameraRig from './CameraRig'
import CapturedPieces from './CapturedPieces'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#a8c8a0', color: 'black', fontFamily: 'sans-serif', zIndex: 100 }}>
          Scene error - please refresh
        </div>
      )
    }
    return this.props.children
  }
}

export default function ChessScene() {
  return (
    <ErrorBoundary>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 9, 11], fov: 50, near: 0.1, far: 200 }}
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
    </ErrorBoundary>
  )
}
