import React from 'react'
import useGameStore from '../store/useGameStore'
import { useChess } from '../hooks/useChess'

export default function PromotionPicker() {
  const promotionPending = useGameStore(s => s.promotionPending)
  const turn = useGameStore(s => s.turn)
  const { makeMove } = useChess()

  if (!promotionPending) return null

  const handleSelect = (piece) => {
    makeMove(promotionPending.from, promotionPending.to, piece)
    useGameStore.setState({ promotionPending: null })
  }

  const pieces = [
    { code: 'q', name: 'QUEEN', w: '♕', b: '♛' },
    { code: 'r', name: 'ROOK', w: '♖', b: '♜' },
    { code: 'b', name: 'BISHOP', w: '♗', b: '♝' },
    { code: 'n', name: 'KNIGHT', w: '♘', b: '♞' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 40,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'auto'
    }}>
      <style>{`
        .promo-card {
          width: 90px; height: 110px;
          background: var(--wood-medium);
          border: 2px solid var(--wood-light);
          border-radius: 8px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          cursor: pointer; gap: 8px;
          transition: all 0.15s ease;
        }
        .promo-card:hover {
          background: var(--wood-light);
          border-color: var(--wood-highlight);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }
      `}</style>
      
      <div className="wooden-panel" style={{ width: '440px', padding: '28px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Cinzel', fontSize: '20px', letterSpacing: '0.12em',
          color: 'var(--text-carved)', marginBottom: '20px'
        }}>
          PROMOTE PAWN
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px' }}>
          {pieces.map(p => (
            <div 
              key={p.code} 
              className="promo-card"
              onClick={() => handleSelect(p.code)}
            >
              <div style={{ fontFamily: 'Cinzel', fontSize: '40px', lineHeight: 1 }}>
                {turn === 'w' ? p.w : p.b}
              </div>
              <div style={{ fontFamily: 'Cinzel', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
