import React, { useMemo } from 'react'
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

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
      const basePoints = createProfile([
        [0, 0], [0.4, 0], [0.4, 0.2], [0.3, 0.3], [0.25, 0.6], [0, 0.6]
      ])
      const baseGeo = new THREE.LatheGeometry(basePoints, 32)
      const headGeo = new THREE.BoxGeometry(0.3, 0.6, 0.5)
      headGeo.translate(0, 0.7, 0.1)
      return BufferGeometryUtils.mergeGeometries([baseGeo, headGeo])
    }

    const points = createProfile(PROFILES[type] || PROFILES.p)
    const baseGeo = new THREE.LatheGeometry(points, 32)

    if (type === 'p') {
      const headGeo = new THREE.SphereGeometry(0.2, 16, 16)
      headGeo.translate(0, 0.9, 0)
      return BufferGeometryUtils.mergeGeometries([baseGeo, headGeo])
    }

    if (type === 'r') {
      const topGeo = new THREE.BoxGeometry(0.3, 0.05, 0.3)
      topGeo.translate(0, 0.9, 0)
      return BufferGeometryUtils.mergeGeometries([baseGeo, topGeo])
    }

    if (type === 'b') {
      const tipGeo = new THREE.ConeGeometry(0.06, 0.25, 8)
      tipGeo.translate(0, 1.2 + 0.125, 0)
      return BufferGeometryUtils.mergeGeometries([baseGeo, tipGeo])
    }

    if (type === 'q') {
      const geos = [baseGeo]
      for (let i = 0; i < 6; i++) {
        const sphere = new THREE.SphereGeometry(0.04, 8, 8)
        const angle = (i / 6) * Math.PI * 2
        sphere.translate(Math.cos(angle) * 0.18, 1.1, Math.sin(angle) * 0.18)
        geos.push(sphere)
      }
      return BufferGeometryUtils.mergeGeometries(geos)
    }

    if (type === 'k') {
      const crossH = new THREE.BoxGeometry(0.25, 0.06, 0.06)
      crossH.translate(0, 1.4 + 0.12, 0)
      const crossV = new THREE.BoxGeometry(0.06, 0.25, 0.06)
      crossV.translate(0, 1.4 + 0.125, 0)
      return BufferGeometryUtils.mergeGeometries([baseGeo, crossH, crossV])
    }

    return baseGeo
  }, [type])

  return <primitive object={geometry} attach="geometry" />
}
