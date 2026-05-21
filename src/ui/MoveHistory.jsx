import React, { useRef, useEffect, useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function MoveHistory() {
  const moveHistory = useGameStore(s => s.moveHistory)
  const listRef = useRef(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [moveHistory, expanded])

  if (moveHistory.length === 0) return null

  const pairs = []
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairs.push({
      w: moveHistory[i],
      b: moveHistory[i + 1]
    })
  }

  return (
    <>
      <div 
        onClick={() => setExpanded(true)}
        style={{ 
          position: 'fixed', right: expanded ? '-30px' : 0, top: '50%', transform: 'translateY(-50%)',
          width: '28px', height: '80px', zIndex: 20,
          background: 'var(--wood-dark)', border: '2px solid var(--wood-light)',
          borderRight: 'none', borderRadius: '6px 0 0 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', pointerEvents: 'auto',
          writingMode: 'vertical-rl', fontSize: '10px', letterSpacing: '0.12em',
          color: 'var(--text-dim)', fontFamily: 'Cinzel',
          transition: 'right 0.25s ease'
        }}
      >
        ▶ MOVES
      </div>

      <div 
        style={{ 
          position: 'fixed', right: 0, top: 0, height: '100vh', width: '200px', zIndex: 20,
          background: 'var(--wood-dark)', borderLeft: '2px solid var(--wood-light)',
          display: 'flex', flexDirection: 'column',
          transform: expanded ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ padding: '16px 12px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Cinzel', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
            HISTORY
          </span>
          <button 
            onClick={() => setExpanded(false)}
            style={{ width: '24px', height: '24px', fontFamily: 'Cinzel', fontSize: '12px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            ◀
          </button>
        </div>
        
        <div 
          ref={listRef} 
          style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {pairs.map((pair, idx) => (
            <div key={idx} style={{ 
              display: 'flex', gap: '6px', padding: '5px 4px', 
              background: idx === pairs.length - 1 ? 'rgba(212,160,23,0.15)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'),
              borderRadius: idx === pairs.length - 1 ? '3px' : '0'
            }}>
              <span style={{ width: '24px', fontFamily: 'Cinzel', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'right' }}>
                {idx + 1}.
              </span>
              <span style={{ flex: 1, fontFamily: 'Cinzel', fontSize: '11px', color: 'var(--text-carved)', letterSpacing: '0.04em' }}>
                {pair.w}
              </span>
              <span style={{ flex: 1, fontFamily: 'Cinzel', fontSize: '11px', color: 'var(--text-carved)', letterSpacing: '0.04em' }}>
                {pair.b || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
