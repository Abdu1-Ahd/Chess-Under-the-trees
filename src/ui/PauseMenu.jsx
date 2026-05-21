import React, { useState } from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'
import SettingsPanel from './SettingsPanel'

export default function PauseMenu() {
  const setScreen = useGameStore(s => s.setScreen)
  const resign = useGameStore(s => s.resign)
  const offerDraw = useGameStore(s => s.offerDraw)
  const gameMode = useGameStore(s => s.gameMode)
  const [showSettings, setShowSettings] = useState(false)

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
          width: '320px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          zIndex: 30,
          margin: 0,
          padding: '32px', borderRadius: '10px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
          pointerEvents: 'auto'
        }}
      >
        <h2 style={{
          fontFamily: 'Cinzel', fontSize: '28px', fontWeight: 700,
          letterSpacing: '0.15em', textAlign: 'center',
          color: 'var(--text-carved)', marginBottom: '24px',
          borderBottom: '1px solid var(--wood-light)', paddingBottom: '12px',
          width: '100%'
        }}>
          {showSettings ? 'SETTINGS' : 'PAUSED'}
        </h2>
        {!showSettings ? (
          <div style={{ width: '100%' }}>
            <WoodenButton 
              style={{ marginBottom: '10px', fontFamily: 'Cinzel', fontSize: '13px', letterSpacing: '0.08em' }} 
              onClick={() => setScreen('game')}
            >
              Resume
            </WoodenButton>
            <WoodenButton 
              style={{ marginBottom: '10px', fontFamily: 'Cinzel', fontSize: '13px', letterSpacing: '0.08em' }} 
              onClick={() => setShowSettings(true)}
            >
              Settings
            </WoodenButton>
            {gameMode === 'vs-friend' && (
              <WoodenButton 
                style={{ marginBottom: '10px', fontFamily: 'Cinzel', fontSize: '13px', letterSpacing: '0.08em' }} 
                onClick={offerDraw}
              >
                Offer Draw
              </WoodenButton>
            )}
            <WoodenButton 
              style={{ marginBottom: '0', fontFamily: 'Cinzel', fontSize: '13px', letterSpacing: '0.08em' }} 
              onClick={resign}
            >
              Resign
            </WoodenButton>
          </div>
        ) : (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </div>
    </>
  )
}
