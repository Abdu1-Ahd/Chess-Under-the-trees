import React from 'react'
import { useSettingsStore } from '../store/useSettingsStore'
import WoodenButton from './WoodenButton'

export default function SettingsPanel({ onClose }) {
  const { soundEnabled, soundVolume, updateSetting } = useSettingsStore()

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <span style={{ fontFamily: 'Cinzel', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
          Sound Effects
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => updateSetting('soundEnabled', true)}
            style={{
              width: '48px', height: '28px', fontSize: '10px', fontFamily: 'Cinzel',
              background: soundEnabled ? 'var(--wood-highlight)' : 'var(--wood-dark)',
              color: soundEnabled ? '#fff' : 'var(--text-dim)',
              border: '1px solid var(--wood-light)', borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ON
          </button>
          <button
            onClick={() => updateSetting('soundEnabled', false)}
            style={{
              width: '48px', height: '28px', fontSize: '10px', fontFamily: 'Cinzel',
              background: !soundEnabled ? 'var(--wood-highlight)' : 'var(--wood-dark)',
              color: !soundEnabled ? '#fff' : 'var(--text-dim)',
              border: '1px solid var(--wood-light)', borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            OFF
          </button>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <span style={{ fontFamily: 'Cinzel', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
          Volume
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            style={{ width: '28px', height: '28px', background: 'var(--wood-dark)', border: '1px solid var(--wood-light)', color: 'var(--text-carved)', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => updateSetting('soundVolume', Math.max(0, soundVolume - 0.1))}
          >-</button>
          <span style={{ width: '48px', fontFamily: 'Cinzel', fontSize: '13px', color: 'var(--text-carved)', textAlign: 'center' }}>
            {Math.round(soundVolume * 100)}%
          </span>
          <button 
            style={{ width: '28px', height: '28px', background: 'var(--wood-dark)', border: '1px solid var(--wood-light)', color: 'var(--text-carved)', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => updateSetting('soundVolume', Math.min(1, soundVolume + 0.1))}
          >+</button>
        </div>
      </div>

      <WoodenButton 
        onClick={onClose} 
        style={{ marginTop: '20px', width: '100%', height: '40px', fontFamily: 'Cinzel', fontSize: '12px' }}
      >
        Back
      </WoodenButton>
    </div>
  )
}
