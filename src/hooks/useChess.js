import useGameStore from '../store/useGameStore'
import { useSound } from './useSound'

export function useChess() {
  const chess = useGameStore(s => s.chess)
  const selectedSquare = useGameStore(s => s.selectedSquare)
  const turn = useGameStore(s => s.turn)
  const { playSound } = useSound()

  const handleSquareClick = (square) => {
    // Get piece at clicked square
    const piece = chess.get(square)

    // If nothing is selected
    if (!selectedSquare) {
      if (piece && piece.color === turn) {
        selectPiece(square)
      }
      return
    }

    // If something is selected
    if (selectedSquare === square) {
      // Deselect if clicking the same square
      useGameStore.setState({ selectedSquare: null, validMoves: [] })
      return
    }

    if (piece && piece.color === turn) {
      // Switch selection to another own piece
      selectPiece(square)
      return
    }

    // Attempt to move
    const validMoves = useGameStore.getState().validMoves
    const validMove = validMoves.find(m => m.to === square)
    const isPromotion = validMoves.some(m => m.to === square && m.promotion)
    
    if (isPromotion) {
      useGameStore.setState({ promotionPending: { from: selectedSquare, to: square, color: turn } })
      return
    }

    if (validMove) {
      makeMove(selectedSquare, square)
    } else {
      // Deselect on invalid move click
      useGameStore.setState({ selectedSquare: null, validMoves: [] })
    }
  }

  const selectPiece = (square) => {
    const moves = chess.moves({ square, verbose: true })
    useGameStore.setState({
      selectedSquare: square,
      validMoves: moves
    })
  }

  const makeMove = (from, to, promotion) => {
    try {
      const result = chess.move({ from, to, promotion })
      if (result) {
        const state = useGameStore.getState()
        state.updateIdMapForMove(result)
        const newCapturedWhite = [...state.capturedByWhite]
        const newCapturedBlack = [...state.capturedByBlack]
        const newHistory = [...state.moveHistory, result.san]
        
        if (result.captured) {
          if (result.color === 'w') {
            newCapturedWhite.push(result.captured)
          } else {
            newCapturedBlack.push(result.captured)
          }
        }

        if (chess.inCheck()) {
          playSound('check')
        } else if (result.captured) {
          playSound('capture')
        } else {
          playSound('move')
        }

        let newGameResult = null
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            newGameResult = { winner: chess.turn() === 'w' ? 'b' : 'w', reason: 'checkmate' }
          } else if (chess.isStalemate()) {
            newGameResult = { winner: null, reason: 'stalemate' }
          } else if (chess.isDraw() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
            newGameResult = { winner: null, reason: 'draw' }
          } else {
            newGameResult = { winner: null, reason: 'ended' }
          }
        }

        useGameStore.setState({
          fen: chess.fen(),
          turn: chess.turn(),
          selectedSquare: null,
          validMoves: [],
          inCheck: chess.inCheck(),
          gameResult: newGameResult,
          capturedByWhite: newCapturedWhite,
          capturedByBlack: newCapturedBlack,
          moveHistory: newHistory,
          ...(newGameResult ? { screen: 'ended' } : {})
        })
      }
    } catch (e) {
      console.error("Invalid move", e)
    }
  }

  return { handleSquareClick, makeMove }
}
