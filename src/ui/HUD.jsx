import React, { useMemo, useEffect, useState } from 'react'
import useGameStore from '../store/useGameStore'
import MoveHistory from './MoveHistory'

const PIECE_VALUES = { q: 9, r: 5, b: 3, n: 3, p: 1 }

function getMaterialAdvantage(chess) {
  let white = 0
  let black = 0
  chess.board().flat().forEach((piece) => {
    if (!piece) return
    const value = PIECE_VALUES[piece.type] ?? 0
    if (piece.color === 'w') white += value
    else black += value
  })
  const diff = white - black
  return {
    whiteAhead: diff > 0 ? diff : 0,
    blackAhead: diff < 0 ? -diff : 0,
  }
}

export default function HUD() {
  const setScreen = useGameStore(s => s.setScreen)
  const whiteTime = useGameStore(s => s.whiteTime)
  const blackTime = useGameStore(s => s.blackTime)
  const timerMode = useGameStore(s => s.timerMode)
  const turn = useGameStore(s => s.turn)
  const isAIThinking = useGameStore(s => s.isAIThinking)
  const toggleCameraLock = useGameStore(s => s.toggleCameraLock)
  const cameraLocked = useGameStore(s => s.cameraLocked)
  const chess = useGameStore(s => s.chess)
  const fen = useGameStore(s => s.fen)

  const { whiteAhead, blackAhead } = useMemo(
    () => getMaterialAdvantage(chess),
    [chess, fen]
  )

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Turn text animation state
  const [displayTurn, setDisplayTurn] = useState(turn)
  const [turnOpacity, setTurnOpacity] = useState(1)

  useEffect(() => {
    if (turn !== displayTurn) {
      setTurnOpacity(0)
      const timeout = setTimeout(() => {
        setDisplayTurn(turn)
        setTurnOpacity(1)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [turn, displayTurn])

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <style>{`
        .hud-btn {
          font-family: Cinzel, serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          font-weight: 600;
          background: var(--wood-medium);
          border: 2px solid var(--wood-light);
          border-radius: 6px;
          color: var(--text-carved);
          box-shadow: 0 3px 0 var(--wood-dark), 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
          pointer-events: auto;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .hud-btn:hover {
          transform: translateY(-1px);
        }
        .hud-btn:active {
          transform: translateY(2px);
          box-shadow: 0 0 0 var(--wood-dark), 0 2px 4px rgba(0,0,0,0.4);
        }
        @keyframes pulse-think {
          0% { opacity: 0.5; }
          100% { opacity: 1.0; }
        }
        .pulse-text {
          animation: pulse-think 1s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Pause Button */}
      <button 
        className="hud-btn"
        onClick={() => setScreen('paused')} 
        style={{ position: 'fixed', top: '14px', left: '14px', zIndex: 20, width: '72px', height: '34px' }}
      >
        PAUSE
      </button>

      {/* Lock Camera Button */}
      <button 
        className="hud-btn"
        onClick={toggleCameraLock} 
        style={{ position: 'fixed', top: '14px', right: '14px', zIndex: 20, width: '130px', height: '34px', whiteSpace: 'nowrap' }}
      >
        {cameraLocked ? 'UNLOCK CAMERA' : 'LOCK TOP-DOWN'}
      </button>

      {/* Timers */}
      {timerMode !== 'none' && (
        <>
          {/* Black Timer */}
          <div 
            className="wooden-panel flex flex-col items-center justify-center"
            style={{ 
              pointerEvents: 'auto', position: 'fixed', top: '60px', left: '14px', 
              width: '140px', padding: '8px 16px', zIndex: 20,
              border: turn === 'b' ? '2px solid var(--wood-highlight)' : '2px solid color-mix(in srgb, var(--wood-light) 60%, transparent)'
            }}
          >
            <div style={{ fontFamily: 'Cinzel', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
              BLACK
              {blackAhead > 0 && <span style={{ color: 'var(--text-carved)', marginLeft: '4px' }}>+{blackAhead}</span>}
            </div>
            <div style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 700, color: 'var(--text-carved)', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(blackTime)}
            </div>
          </div>
          
          {/* White Timer */}
          <div 
            className="wooden-panel flex flex-col items-center justify-center"
            style={{ 
              pointerEvents: 'auto', position: 'fixed', bottom: '60px', left: '14px', 
              width: '140px', padding: '8px 16px', zIndex: 20,
              border: turn === 'w' ? '2px solid var(--wood-highlight)' : '2px solid color-mix(in srgb, var(--wood-light) 60%, transparent)'
            }}
          >
            <div style={{ fontFamily: 'Cinzel', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
              WHITE
              {whiteAhead > 0 && <span style={{ color: 'var(--text-carved)', marginLeft: '4px' }}>+{whiteAhead}</span>}
            </div>
            <div style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 700, color: 'var(--text-carved)', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(whiteTime)}
            </div>
          </div>
        </>
      )}

      {/* Turn Indicator */}
      <div 
        className={isAIThinking ? "pulse-text" : ""}
        style={{ 
          pointerEvents: 'auto', position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20,
          background: 'var(--wood-dark)', border: '2px solid var(--wood-light)', borderRadius: '20px', padding: '8px 24px',
          fontFamily: 'Cinzel', fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-carved)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          opacity: isAIThinking ? 1 : turnOpacity, transition: 'opacity 0.3s ease'
        }}
      >
        {isAIThinking ? 'THINKING...' : (displayTurn === 'w' ? "WHITE'S MOVE" : "BLACK'S MOVE")}
      </div>

      <MoveHistory />
    </div>
  )
}
