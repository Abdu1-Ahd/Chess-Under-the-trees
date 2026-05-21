export function squareToPosition(square) {
  const file = square.charCodeAt(0) - 97 // 'a' is 97
  const rank = parseInt(square[1], 10) - 1
  // file: a=0, h=7 -> x: -3.5 to 3.5
  // rank: 1=0, 8=7 -> z: 3.5 to -3.5 (White is at +z, Black is at -z)
  return [file - 3.5, 0.15, 3.5 - rank]
}

