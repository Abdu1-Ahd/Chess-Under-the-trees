import React from 'react'

export default function SquareHighlight({ position, type }) {
  // type: 'selected' | 'valid' | 'capture' | 'check'
  
  let color = '#ffffff'
  let opacity = 0.5
  
  switch (type) {
    case 'selected':
      color = '#e2c65f' // golden
      opacity = 0.6
      break
    case 'valid':
      color = '#7ab35a' // green dot
      opacity = 0.6
      break
    case 'capture':
      color = '#d14343' // red corner/highlight
      opacity = 0.6
      break
    case 'check':
      color = '#d14343'
      opacity = 0.8
      break
  }

  // Elevate slightly above square surface (0.05 + 0.01) to prevent z-fighting
  const yPos = 0.05 + 0.01 

  if (type === 'valid') {
    return (
      <mesh position={[position[0], yPos, position[2]]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      </mesh>
    )
  }
  
  if (type === 'capture') {
    return (
      <mesh position={[position[0], yPos, position[2]]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} side={2} />
      </mesh>
    )
  }

  return (
    <mesh position={[position[0], yPos, position[2]]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}
