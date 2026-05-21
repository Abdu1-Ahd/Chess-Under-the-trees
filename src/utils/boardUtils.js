export function squareToPosition(square) {
  const file = square.charCodeAt(0) - 97 // 'a' is 97
  const rank = parseInt(square[1], 10) - 1
  // file: a=0, h=7 -> x: -3.5 to 3.5
  // rank: 1=0, 8=7 -> z: 3.5 to -3.5 (White is at +z, Black is at -z)
  return [file - 3.5, 0.05, 3.5 - rank]
}

export function positionToSquare(x, z) {
  const file = Math.round(x + 3.5)
  const rank = Math.round(3.5 - z)
  if (file >= 0 && file <= 7 && rank >= 0 && rank <= 7) {
    return String.fromCharCode(file + 97) + (rank + 1)
  }
  return null
}
