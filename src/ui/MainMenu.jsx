import React, { useState } from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'
import SettingsPanel from './SettingsPanel'

export default function MainMenu() {
  const startGame = useGameStore(s => s.startGame)
  
  const [mode, setMode] = useState('pvp')
  const [difficulty, setDifficulty] = useState('easy')
  const [timerMode, setTimerMode] = useState('none')
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="overlay-backdrop absolute inset-0 flex items-center justify-center pointer-events-auto z-10 bg-black/40">
      <div className="panel-pop wooden-panel w-[400px] flex flex-col gap-6">
        <h1 className="text-4xl text-center mb-4 text-[#F5DEB3]">Chess 3D</h1>
        
        <div className="flex flex-col gap-4 font-body text-lg">
          <div className="flex justify-between items-center">
            <span>Mode:</span>
            <div className="flex gap-4">
              <span className={`cursor-pointer hover:text-white ${mode === 'pvp' ? 'underline' : ''}`} onClick={() => setMode('pvp')}>PvP</span>
              <span className={`cursor-pointer hover:text-white ${mode === 'ai' ? 'underline' : ''}`} onClick={() => setMode('ai')}>vs AI</span>
            </div>
          </div>

          {mode === 'ai' && (
            <div className="flex justify-between items-center">
              <span>AI Diff:</span>
              <div className="flex gap-4">
                <span className={`cursor-pointer hover:text-white ${difficulty === 'easy' ? 'underline' : ''}`} onClick={() => setDifficulty('easy')}>Easy</span>
                <span className={`cursor-pointer hover:text-white ${difficulty === 'medium' ? 'underline' : ''}`} onClick={() => setDifficulty('medium')}>Med</span>
                <span className={`cursor-pointer hover:text-white ${difficulty === 'hard' ? 'underline' : ''}`} onClick={() => setDifficulty('hard')}>Hard</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span>Timer:</span>
            <div className="flex gap-4">
              <span className={`cursor-pointer hover:text-white ${timerMode === 'none' ? 'underline' : ''}`} onClick={() => setTimerMode('none')}>None</span>
              <span className={`cursor-pointer hover:text-white ${timerMode === '5m' ? 'underline' : ''}`} onClick={() => setTimerMode('5m')}>5m</span>
              <span className={`cursor-pointer hover:text-white ${timerMode === '10m' ? 'underline' : ''}`} onClick={() => setTimerMode('10m')}>10m</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <WoodenButton onClick={() => startGame(mode, difficulty, timerMode)}>Start Game</WoodenButton>
          <WoodenButton onClick={() => setShowSettings(true)}>Settings</WoodenButton>
        </div>
      </div>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}
