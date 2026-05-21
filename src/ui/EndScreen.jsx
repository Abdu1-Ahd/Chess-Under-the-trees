import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'

export default function EndScreen() {
  const resetGame = useGameStore(s => s.resetGame)
  const gameResult = useGameStore(s => s.gameResult)

  const enterReview = () => {
    useGameStore.setState({ 
      screen: 'review', 
      reviewIndex: useGameStore.getState().moveHistory.length 
    })
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: 29, 
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
          pointerEvents: 'auto'
        }}
      />
      <div 
        className="wooden-panel flex flex-col items-center" 
        style={{ 
          position: 'fixed', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 30, width: '380px',
          padding: '32px', borderRadius: '10px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
          pointerEvents: 'auto'
        }}
      >
        <h2 style={{
          fontFamily: 'Cinzel', fontSize: '32px', fontWeight: 700,
          letterSpacing: '0.15em', textAlign: 'center',
          color: 'var(--text-carved)', marginBottom: '8px',
          width: '100%'
        }}>
          GAME OVER
        </h2>
        <p style={{
          fontFamily: 'Cinzel', fontSize: '14px',
          color: 'var(--text-dim)', textAlign: 'center',
          marginBottom: '24px', borderBottom: '1px solid var(--wood-light)',
          paddingBottom: '16px', width: '100%', textTransform: 'capitalize'
        }}>
          {gameResult?.reason || 'Resignation'}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', width: '100%' }}>
          <WoodenButton 
            style={{ width: '100%', height: '44px', background: 'var(--wood-medium)', border: '2px solid var(--wood-light)' }} 
            onClick={enterReview}
          >
            Review
          </WoodenButton>
          <WoodenButton 
            style={{ width: '100%', height: '44px', background: 'var(--wood-light)', border: '2px solid var(--wood-highlight)' }} 
            onClick={resetGame}
          >
            Main Menu
          </WoodenButton>
        </div>
      </div>
    </>
  )
}
