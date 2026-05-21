import React from 'react'
import { useSettingsStore } from '../store/useSettingsStore'
import WoodenButton from './WoodenButton'

export default function SettingsPanel({ onClose }) {
  const { soundEnabled, soundVolume, updateSetting } = useSettingsStore()

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 bg-black/60">
      <div className="wooden-panel w-[350px] flex flex-col gap-6">
        <h2 className="text-2xl text-center font-cinzel text-[#F5DEB3]">Settings</h2>
        
        <div className="flex flex-col gap-4 font-body text-xl">
          <div className="flex justify-between items-center">
            <span>Sound Effects:</span>
            <div
              className={`cursor-pointer ${soundEnabled ? 'text-white' : 'text-black/50'}`}
              onClick={() => updateSetting('soundEnabled', !soundEnabled)}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Volume:</span>
            <div className="flex gap-4">
              <div 
                className="cursor-pointer hover:text-white px-2" 
                onClick={() => updateSetting('soundVolume', Math.max(0, soundVolume - 0.1))}
              >-</div>
              <div className={soundEnabled ? 'text-[#C4A882]' : 'text-black/50'}>
                {Math.round(soundVolume * 100)}%
              </div>
              <div 
                className="cursor-pointer hover:text-white px-2" 
                onClick={() => updateSetting('soundVolume', Math.min(1, soundVolume + 0.1))}
              >+</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <WoodenButton onClick={onClose}>Close</WoodenButton>
        </div>
      </div>
    </div>
  )
}
