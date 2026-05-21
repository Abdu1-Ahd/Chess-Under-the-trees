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

  startGame: (mode, difficulty, timerMode) => {},
  selectSquare: (square) => {},
  makeMove: (from, to, promotion) => {},
  undoMove: () => {},
  offerDraw: () => {},
  resign: () => {},
  setPromotion: (piece) => {},
  toggleCameraLock: () => {},
  setScreen: (screen) => set({ screen }),
  setReviewIndex: (index) => {},
  tickTimer: () => {},
  resetGame: () => {},
}))
