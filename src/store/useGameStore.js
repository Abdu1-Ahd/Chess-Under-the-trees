import { create } from 'zustand'
import { Chess } from 'chess.js'
import { evaluateMaterialBalance } from '../hooks/useStockfish'

const initialChess = new Chess()

const TIMER_SECONDS = {
  none: 0,
  blitz: 300,
  rapid: 600,
  classical: 1800,
}

export const useGameStore = create((set, get) => ({
  screen: 'menu',
  gameMode: null,
  aiDifficulty: 'easy',
  chess: initialChess,
  fen: initialChess.fen(),
  turn: 'w',
  selectedSquare: null,
  validMoves: [],
  capturedByWhite: [],
  capturedByBlack: [],
  moveHistory: [],
  gameResult: null,
  reviewIndex: 0,
  isAIThinking: false,
  promotionPending: null,
  cameraLocked: false,
  whiteTime: 0,
  blackTime: 0,
  timerMode: 'none',
  inCheck: false,
  drawOfferDeclined: false,
  pieceIdMap: {},
  reviewPieceIdMap: {},
  reviewCapturedByWhite: [],
  reviewCapturedByBlack: [],

  startGame: (mode, difficulty, timerMode) => {
    const seconds = TIMER_SECONDS[timerMode] ?? 0
    initialChess.reset()
    set({
      screen: 'game',
      gameMode: mode,
      aiDifficulty: difficulty,
      timerMode,
      chess: initialChess,
      fen: initialChess.fen(),
      turn: 'w',
      selectedSquare: null,
      validMoves: [],
      capturedByWhite: [],
      capturedByBlack: [],
      moveHistory: [],
      gameResult: null,
      reviewIndex: 0,
      inCheck: false,
      promotionPending: null,
      drawOfferDeclined: false,
      whiteTime: seconds,
      blackTime: seconds,
      reviewCapturedByWhite: [],
      reviewCapturedByBlack: [],
    })
    get().buildInitialIdMap(initialChess)
  },
  buildInitialIdMap: (chessInst) => {
    const idMap = {}
    const counters = {}
    chessInst.board().forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (!cell) return
        const baseKey = cell.color + cell.type
        counters[baseKey] = (counters[baseKey] || 0)
        const square = String.fromCharCode(ci + 97) + (8 - ri)
        idMap[square] = baseKey + counters[baseKey]
        counters[baseKey]++
      })
    })
    set({ pieceIdMap: idMap, reviewPieceIdMap: idMap })
  },
  updateIdMapForMove: (move) => {
    const state = get()
    const newMap = { ...state.pieceIdMap }
    newMap[move.to] = newMap[move.from]
    delete newMap[move.from]
    
    if (move.flags.includes('e')) {
      const file = move.to[0]
      const rank = move.color === 'w' ? '5' : '4'
      delete newMap[file + rank]
    }
    if (move.flags.includes('k')) {
      const r = move.color === 'w' ? '1' : '8'
      newMap[`f${r}`] = newMap[`h${r}`]
      delete newMap[`h${r}`]
    } else if (move.flags.includes('q')) {
      const r = move.color === 'w' ? '1' : '8'
      newMap[`d${r}`] = newMap[`a${r}`]
      delete newMap[`a${r}`]
    }
    set({ pieceIdMap: newMap })
  },
  buildReviewIdMap: (upToIndex) => {
    const state = get()
    const history = state.chess.history({ verbose: true })
    const tempChess = new Chess()
    const idMap = {}
    const counters = {}
    
    tempChess.board().forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (!cell) return
        const baseKey = cell.color + cell.type
        counters[baseKey] = (counters[baseKey] || 0)
        const square = String.fromCharCode(ci + 97) + (8 - ri)
        idMap[square] = baseKey + counters[baseKey]
        counters[baseKey]++
      })
    })

    const reviewCapturedWhite = []
    const reviewCapturedBlack = []

    for (let i = 0; i < upToIndex; i++) {
      const move = history[i]
      if (!move) continue
      idMap[move.to] = idMap[move.from]
      delete idMap[move.from]
      
      if (move.captured) {
        if (move.color === 'w') reviewCapturedWhite.push(move.captured)
        else reviewCapturedBlack.push(move.captured)
      }
      
      if (move.flags.includes('e')) {
        const file = move.to[0]
        const rank = move.color === 'w' ? '5' : '4'
        delete idMap[file + rank]
      }
      if (move.flags.includes('k')) {
        const r = move.color === 'w' ? '1' : '8'
        idMap[`f${r}`] = idMap[`h${r}`]
        delete idMap[`h${r}`]
      } else if (move.flags.includes('q')) {
        const r = move.color === 'w' ? '1' : '8'
        idMap[`d${r}`] = idMap[`a${r}`]
        delete idMap[`a${r}`]
      }
    }
    set({ 
      reviewPieceIdMap: idMap,
      reviewCapturedByWhite: reviewCapturedWhite,
      reviewCapturedByBlack: reviewCapturedBlack
    })
  },
  selectSquare: (square) => {},
  makeMove: (from, to, promotion) => {},
  undoMove: () => {},
  offerDraw: () => {
    const state = get()
    const isVsAi = state.gameMode === 'vs-ai' || state.gameMode === 'ai'

    if (isVsAi) {
      const diff = evaluateMaterialBalance(state.chess)
      if (diff < -3) {
        set({
          gameResult: { winner: 'draw', reason: 'Draw by agreement' },
          screen: 'ended',
          drawOfferDeclined: false,
        })
      } else {
        set({ drawOfferDeclined: true, screen: 'paused' })
      }
      return
    }

    set({
      gameResult: { winner: 'draw', reason: 'Draw by agreement' },
      screen: 'ended',
    })
  },
  resign: () => set(state => ({
    gameResult: state.turn === 'w' ? 'Black wins by resignation' : 'White wins by resignation',
    screen: 'ended',
  })),
  setPromotion: (piece) => {},
  toggleCameraLock: () => set(state => ({ cameraLocked: !state.cameraLocked })),
  setScreen: (screen) => set({ screen }),
  setReviewIndex: (index) => {
    set({ reviewIndex: index })
    get().buildReviewIdMap(index)
  },
  tickTimer: () => {
    const state = get()
    if (state.screen !== 'game' || state.timerMode === 'none' || state.gameResult || state.isAIThinking) return

    if (state.turn === 'w') {
      const newTime = state.whiteTime - 1
      if (newTime <= 0) {
        set({ whiteTime: 0, gameResult: 'Black wins on time', screen: 'ended' })
      } else {
        set({ whiteTime: newTime })
      }
    } else {
      const newTime = state.blackTime - 1
      if (newTime <= 0) {
        set({ blackTime: 0, gameResult: 'White wins on time', screen: 'ended' })
      } else {
        set({ blackTime: newTime })
      }
    }
  },
  resetGame: () => set({ screen: 'menu' }),
}))

export default useGameStore
