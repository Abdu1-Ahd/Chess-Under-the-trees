import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'

export default function ReviewMode() {
  const resetGame = useGameStore(s => s.resetGame)
  const reviewIndex = useGameStore(s => s.reviewIndex)
  const setReviewIndex = useGameStore(s => s.setReviewIndex)
  const moveHistory = useGameStore(s => s.moveHistory)
  
  const handleStart = () => setReviewIndex(0)
  const handlePrev = () => {
    if (reviewIndex > 0) setReviewIndex(reviewIndex - 1)
  }
  const handleNext = () => {
    if (reviewIndex < moveHistory.length) setReviewIndex(reviewIndex + 1)
  }
  const handleEnd = () => setReviewIndex(moveHistory.length)

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
      `}</style>
      <button 
        className="hud-btn"
        onClick={resetGame} 
        style={{ position: 'fixed', top: '14px', right: '14px', zIndex: 20, width: '110px', height: '34px' }}
      >
        EXIT REVIEW
      </button>

      <div 
        style={{
          position: 'fixed', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '10px', alignItems: 'center', zIndex: 20,
          pointerEvents: 'auto'
        }}
      >
        <WoodenButton 
          onClick={handleStart} 
          className={reviewIndex === 0 ? 'opacity-50' : ''}
          style={{ width: '90px', height: '36px', padding: 0 }}
        >
          ◀◀ Start
        </WoodenButton>
        <WoodenButton 
          onClick={handlePrev} 
          className={reviewIndex === 0 ? 'opacity-50' : ''}
          style={{ width: '80px', height: '36px', padding: 0 }}
        >
          ◀ Prev
        </WoodenButton>
        <div style={{
          width: '110px', height: '36px', textAlign: 'center',
          fontFamily: 'Cinzel', fontSize: '11px', color: 'var(--text-carved)',
          background: 'var(--wood-dark)', border: '1px solid var(--wood-light)',
          borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          Move {reviewIndex} / {moveHistory.length}
        </div>
        <WoodenButton 
          onClick={handleNext} 
          className={reviewIndex === moveHistory.length ? 'opacity-50' : ''}
          style={{ width: '80px', height: '36px', padding: 0 }}
        >
          Next ▶
        </WoodenButton>
        <WoodenButton 
          onClick={handleEnd} 
          className={reviewIndex === moveHistory.length ? 'opacity-50' : ''}
          style={{ width: '90px', height: '36px', padding: 0 }}
        >
          End ▶▶
        </WoodenButton>
      </div>
    </div>
  )
}
