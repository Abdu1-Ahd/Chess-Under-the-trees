import React, { useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useCamera } from '../hooks/useCamera'

export default function CameraRig() {
  const { camera } = useThree()
  const { getCameraPosition } = useCamera()
  
  // Set initial FOV
  useEffect(() => {
    camera.fov = 55
    camera.updateProjectionMatrix()
  }, [camera])

  useFrame((state, delta) => {
    const pos = getCameraPosition(delta)
    camera.position.copy(pos)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  })
  
  return null
}
