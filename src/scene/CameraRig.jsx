import React, { useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useCamera } from '../hooks/useCamera'

export default function CameraRig() {
  const { camera } = useThree()
  const { getCameraPosition } = useCamera()
  
  // Set initial camera pose before first frame
  useEffect(() => {
    camera.position.set(0, 9, 11)
    camera.lookAt(0, 0, 0)
    camera.fov = 50
    camera.near = 0.1
    camera.far = 200
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
