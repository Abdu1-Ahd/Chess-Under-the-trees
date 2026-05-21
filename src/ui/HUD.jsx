import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'
import MoveHistory from './MoveHistory'

export default function HUD() {
  const setScreen = useGameStore(s => s.setScreen)
  const whiteTime = useGameStore(s => s.whiteTime)
  const blackTime = useGameStore(s => s.blackTime)
  const timerMode = useGameStore(s => s.timerMode)
  const turn = useGameStore(s => s.turn)
  const isAIThinking = useGameStore(s => s.isAIThinking)
  const toggleCameraLock = useGameStore(s => s.toggleCameraLock)
  const cameraLocked = useGameStore(s => s.cameraLocked)

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      <div className="flex justify-between items-start pointer-events-auto">
        <WoodenButton onClick={() => setScreen('paused')} className="text-sm px-4 py-2">Pause</WoodenButton>
        
        {timerMode !== 'none' && (
          <div className="wooden-panel flex flex-col gap-2 p-4 text-center font-body text-xl">
            <div className={turn === 'b' ? 'text-white' : 'opacity-70'}>
              Black: {formatTime(blackTime)}
            </div>
            <div className={turn === 'w' ? 'text-white' : 'opacity-70'}>
              White: {formatTime(whiteTime)}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end pointer-events-auto">
        <div className="flex flex-col gap-4">
          <div className="wooden-panel p-3 cursor-pointer hover:bg-white/10 text-sm font-cinzel text-[#F5DEB3] text-center" onClick={toggleCameraLock}>
            {cameraLocked ? 'Unlock Camera' : 'Lock Top-Down'}
          </div>

          {isAIThinking && (
            <div className="wooden-panel p-3 animate-pulse text-sm font-cinzel text-center">
              AI is thinking...
            </div>
          )}
        </div>
        
        <MoveHistory />
      </div>
    </div>
  )
}
