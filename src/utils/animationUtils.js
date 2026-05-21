import * as THREE from 'three'

export function damp(current, target, lambda, dt) {
  return THREE.MathUtils.damp(current, target, lambda, dt)
}

export function dampVector3(vec, targetX, targetY, targetZ, lambda, dt) {
  vec.x = damp(vec.x, targetX, lambda, dt)
  vec.y = damp(vec.y, targetY, lambda, dt)
  vec.z = damp(vec.z, targetZ, lambda, dt)
}

export function dampEuler(euler, targetX, targetY, targetZ, lambda, dt) {
  euler.x = damp(euler.x, targetX, lambda, dt)
  euler.y = damp(euler.y, targetY, lambda, dt)
  euler.z = damp(euler.z, targetZ, lambda, dt)
}
