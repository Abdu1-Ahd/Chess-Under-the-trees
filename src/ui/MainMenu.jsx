import React, { useState } from 'react'
import useGameStore from '../store/useGameStore'
import SettingsPanel from './SettingsPanel'

/* ─── tiny inline button used only inside MainMenu ─── */
function MenuBtn({ children, active, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'var(--font-display)',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: 'var(--text-carved)',
        backgroundColor: active ? 'var(--wood-highlight)' : 'var(--wood-medium)',
        boxShadow: active
          ? 'inset 0 2px 6px rgba(0,0,0,0.5)'
          : '0 2px 4px rgba(0,0,0,0.4)',
        border: '1px solid rgba(200,134,74,0.4)',
        borderRadius: '4px',
        transition: 'all 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px)'
      }}
    >
      {children}
    </div>
  )
}

const TIMER_OPTIONS = [
  { id: 'none',      label: 'None' },
  { id: 'blitz',     label: 'Blitz 5m' },
  { id: 'rapid',     label: 'Rapid 10m' },
  { id: 'classical', label: 'Classical 30m' },
]

export default function MainMenu() {
  const startGame = useGameStore((s) => s.startGame)

  const [mode,         setMode]         = useState('pvp')
  const [difficulty,   setDifficulty]   = useState('easy')
  const [timerMode,    setTimerMode]    = useState('none')
  const [showSettings, setShowSettings] = useState(false)

  return (
    /* Outer wrapper — full-screen, fades in, pointer-events none so 3D scene is still interactive */
    <div
      className="overlay-backdrop"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
    >
      {/* Centered card — pointer-events re-enabled */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          maxWidth: '90vw',
          pointerEvents: 'auto',
        }}
      >
        <div
          className="panel-pop wooden-panel"
          style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '0' }}
        >
          {/* ── Title ── */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '42px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textAlign: 'center',
              margin: '0 0 6px 0',
              color: 'var(--text-carved)',
              textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
            }}
          >
            {showSettings ? 'SETTINGS' : 'Chess Under The Tree'}
          </h1>

          {/* ── Divider ── */}
          <hr style={{ border: 'none', borderTop: '1px solid var(--wood-light)', margin: '0 0 20px 0' }} />

          {!showSettings ? (
            <>
              {/* ── Mode section ── */}
              <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                marginBottom: '8px',
              }}
            >
              Mode
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['pvp', 'ai'].map((m) => (
                <MenuBtn
                  key={m}
                  active={mode === m}
                  onClick={() => setMode(m)}
                  style={{ flex: 1, height: '40px', fontSize: '13px' }}
                >
                  {m === 'pvp' ? 'PvP' : 'vs AI'}
                </MenuBtn>
              ))}
            </div>
          </div>

          {/* ── AI difficulty (only when AI mode) ── */}
          {mode === 'ai' && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  marginBottom: '8px',
                }}
              >
                AI Difficulty
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Med' },
                  { id: 'hard', label: 'Hard' },
                ].map(({ id, label }) => (
                  <MenuBtn
                    key={id}
                    active={difficulty === id}
                    onClick={() => setDifficulty(id)}
                    style={{ flex: 1, height: '40px', fontSize: '13px' }}
                  >
                    {label}
                  </MenuBtn>
                ))}
              </div>
            </div>
          )}

          {/* ── Timer section ── */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                marginBottom: '8px',
              }}
            >
              Timer
            </div>
            {/* 2×2 grid — flex-wrap ensures clean two-per-row layout */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TIMER_OPTIONS.map(({ id, label }) => (
                <MenuBtn
                  key={id}
                  active={timerMode === id}
                  onClick={() => setTimerMode(id)}
                  style={{
                    flex: '1 1 calc(50% - 6px)',
                    height: '36px',
                    fontSize: '12px',
                  }}
                >
                  {label}
                </MenuBtn>
              ))}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Start Game */}
            <div
              onClick={() => startGame(mode, difficulty, timerMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '46px',
                cursor: 'pointer',
                userSelect: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--text-carved)',
                backgroundColor: 'var(--wood-light)',
                border: '2px solid var(--wood-highlight)',
                borderRadius: '4px',
                transition: 'all 0.12s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.4)'
              }}
            >
              Start Game
            </div>

            {/* Settings */}
            <div
              onClick={() => setShowSettings(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '46px',
                cursor: 'pointer',
                userSelect: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--text-carved)',
                backgroundColor: 'var(--wood-medium)',
                border: '2px solid var(--wood-light)',
                borderRadius: '4px',
                transition: 'all 0.12s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Settings
            </div>
          </div>
            </>
          ) : (
            <SettingsPanel onClose={() => setShowSettings(false)} />
          )}
        </div>
      </div>
    </div>
  )
}
