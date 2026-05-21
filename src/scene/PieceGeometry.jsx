import React, { useMemo } from 'react'
import * as THREE from 'three'

// Simple helper to create lathe points
const createProfile = (points) => points.map(([x, y]) => new THREE.Vector2(x, y))

// Base dimensions
const BASE_HEIGHT = 0.2
const BASE_RADIUS = 0.4

// Piece profiles (r, y)
const PROFILES = {
  p: [
    [0, 0], [0.35, 0], [0.35, 0.1], [0.3, 0.2], [0.2, 0.4], [0.2, 0.6], [0.3, 0.7], [0.25, 0.8], [0.1, 0.9], [0, 0.9]
  ],
  r: [
    [0, 0], [0.4, 0], [0.4, 0.2], [0.35, 0.3], [0.3, 0.7], [0.35, 0.8], [0.35, 1.0], [0.25, 1.0], [0.25, 0.9], [0, 0.9]
  ],
  b: [
    [0, 0], [0.4, 0], [0.4, 0.1], [0.3, 0.2], [0.2, 0.6], [0.3, 0.7], [0.2, 1.1], [0.05, 1.2], [0, 1.2]
  ],
  q: [
    [0, 0], [0.4, 0], [0.4, 0.1], [0.35, 0.2], [0.2, 0.7], [0.4, 1.2], [0.35, 1.3], [0.1, 1.1], [0, 1.1]
  ],
  k: [
    [0, 0], [0.4, 0], [0.4, 0.1], [0.35, 0.2], [0.25, 0.7], [0.35, 0.8], [0.3, 1.3], [0.1, 1.4], [0, 1.4]
  ]
}

export function PieceGeometry({ type }) {
  const geometry = useMemo(() => {
    if (type === 'n') {
      // Knight is complex, we use a simple lathe base and a box for the head as a procedural fallback
      const basePoints = createProfile([
        [0, 0], [0.4, 0], [0.4, 0.2], [0.3, 0.3], [0.25, 0.6], [0, 0.6]
      ])
      const baseGeo = new THREE.LatheGeometry(basePoints, 32)
      return baseGeo
    }

    const points = createProfile(PROFILES[type] || PROFILES.p)
    return new THREE.LatheGeometry(points, 32)
  }, [type])

  return <primitive object={geometry} attach="geometry" />
}

export function KnightHeadGeometry() {
  return <boxGeometry args={[0.3, 0.6, 0.5]} />
}
