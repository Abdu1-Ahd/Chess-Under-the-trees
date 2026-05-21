import React from 'react'
import { useThree } from '@react-three/fiber'

export default function CameraRig() {
  const { camera } = useThree()
  
  // Static White POV position for Phase 2
  camera.position.set(0, 5, 9)
  camera.lookAt(0, 0, 0)
  camera.fov = 55
  camera.updateProjectionMatrix()
  
  return null
}
