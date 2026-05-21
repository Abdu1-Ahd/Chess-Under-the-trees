import { create } from 'zustand'
import { Chess } from 'chess.js'

const initialChess = new Chess();

export const useGameStore = create((set) => ({
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

  startGame: (mode, difficulty, timerMode) => {
    const timeMap = { '5m': 300, '10m': 600, 'none': 0 }
    initialChess.reset()
    set({
      screen: 'game',
      gameMode: mode,
      aiDifficulty: difficulty,
      timerMode: timerMode,
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
      whiteTime: timeMap[timerMode] || 0,
      blackTime: timeMap[timerMode] || 0
    })
  },
  selectSquare: (square) => {},
  makeMove: (from, to, promotion) => {},
  undoMove: () => {},
  offerDraw: () => set({ gameResult: 'draw', screen: 'ended' }),
  resign: () => set(state => ({ 
    gameResult: state.turn === 'w' ? 'Black wins by resignation' : 'White wins by resignation',
    screen: 'ended'
  })),
  setPromotion: (piece) => {},
  toggleCameraLock: () => set(state => ({ cameraLocked: !state.cameraLocked })),
  setScreen: (screen) => set({ screen }),
  setReviewIndex: (index) => set({ reviewIndex: index }),
  tickTimer: () => {},
  resetGame: () => set({ screen: 'menu' }),
}))
