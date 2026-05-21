import { useEffect, useRef } from 'react'
import useGameStore from '../store/useGameStore'
import { useChess } from './useChess'

export function useAI() {
  const workerRef = useRef(null)
  const turn = useGameStore(s => s.turn)
  const fen = useGameStore(s => s.fen)
  const screen = useGameStore(s => s.screen)
  const gameMode = useGameStore(s => s.gameMode)
  const aiDifficulty = useGameStore(s => s.aiDifficulty)
  const gameResult = useGameStore(s => s.gameResult)
  const isAIThinking = useGameStore(s => s.isAIThinking)
  
  const { makeMove } = useChess()

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker('/stockfish/stockfish.js')
    
    workerRef.current.onmessage = (e) => {
      const msg = e.data
      if (typeof msg === 'string' && msg.startsWith('bestmove')) {
        const moveStr = msg.split(' ')[1] // e.g. "e2e4" or "e7e8q"
        if (moveStr && moveStr !== '(none)') {
          const from = moveStr.slice(0, 2)
          const to = moveStr.slice(2, 4)
          const promotion = moveStr.length > 4 ? moveStr[4] : undefined
          
          useGameStore.setState({ isAIThinking: false })
          makeMove(from, to, promotion)
        }
      }
    }

    return () => {
      workerRef.current.terminate()
    }
  }, []) // setup once

  useEffect(() => {
    if (screen !== 'game' || gameMode !== 'ai' || gameResult) return
    
    // AI is black for now
    if (turn === 'b' && !isAIThinking) {
      useGameStore.setState({ isAIThinking: true })
      
      const skillMap = { easy: 0, medium: 10, hard: 20 }
      const depthMap = { easy: 5, medium: 10, hard: 15 }
      const skill = skillMap[aiDifficulty] || 10
      const depth = depthMap[aiDifficulty] || 10

      const w = workerRef.current
      w.postMessage(`setoption name Skill Level value ${skill}`)
      w.postMessage(`position fen ${fen}`)
      w.postMessage(`go depth ${depth}`)
    }
  }, [turn, fen, screen, gameMode, aiDifficulty, gameResult, isAIThinking])

  return null
}
