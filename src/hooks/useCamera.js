import { useRef, useEffect } from 'react'
import useGameStore from '../store/useGameStore'
import * as THREE from 'three'

export function useCamera() {
  const turn = useGameStore(s => s.turn)
  const cameraLocked = useGameStore(s => s.cameraLocked)
  const gameMode = useGameStore(s => s.gameMode)

  const state = useRef({
    isTransitioning: false,
    t: 1,
    startPos: new THREE.Vector3(0, 9, 11),
    endPos: new THREE.Vector3(0, 9, 11),
    controlPos: new THREE.Vector3(0, 9, 11),
    currentTarget: new THREE.Vector3(0, 9, 11)
  })

  useEffect(() => {
    const s = state.current
    let targetX = 0, targetY = 9, targetZ = 11
    
    if (cameraLocked) {
      targetY = 16
      targetZ = 0.01 // Slight offset to prevent up-vector flipping when looking straight down
    } else {
      if (gameMode === 'pvp') {
        if (turn === 'b') {
          targetZ = -11
        }
      }
    }

    const newEnd = new THREE.Vector3(targetX, targetY, targetZ)
    
    // Start a transition if the destination changed
    if (newEnd.distanceTo(s.endPos) > 0.1) {
      s.startPos.copy(s.currentTarget)
      s.endPos.copy(newEnd)
      s.t = 0
      s.isTransitioning = true

      // If swinging across the board between White and Black, use a wide bezier arc
      if (!cameraLocked && Math.abs(s.startPos.z - newEnd.z) > 10) {
        s.controlPos.set(12, 8, 0) // Swing out to the side (X = 12)
      } else {
        // Otherwise, do a more direct arc
        s.controlPos.copy(s.startPos).lerp(newEnd, 0.5)
        s.controlPos.y += 2
      }
    }
  }, [turn, cameraLocked, gameMode])

  const getCameraPosition = (delta) => {
    const s = state.current
    if (s.isTransitioning) {
      s.t += delta * 0.8 // Transition speed
      if (s.t >= 1) {
        s.t = 1
        s.isTransitioning = false
      }
      
      // Smooth ease in-out
      const tEased = s.t < 0.5 ? 2 * s.t * s.t : -1 + (4 - 2 * s.t) * s.t

      const p0 = s.startPos
      const p1 = s.controlPos
      const p2 = s.endPos

      const invT = 1 - tEased
      s.currentTarget.x = invT * invT * p0.x + 2 * invT * tEased * p1.x + tEased * tEased * p2.x
      s.currentTarget.y = invT * invT * p0.y + 2 * invT * tEased * p1.y + tEased * tEased * p2.y
      s.currentTarget.z = invT * invT * p0.z + 2 * invT * tEased * p1.z + tEased * tEased * p2.z
    }
    
    return s.currentTarget
  }

  return { getCameraPosition }
}

// session:926dbfe9b
