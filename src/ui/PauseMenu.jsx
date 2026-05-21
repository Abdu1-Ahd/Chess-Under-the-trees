import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'

export default function PauseMenu() {
  const setScreen = useGameStore(s => s.setScreen)
  const resign = useGameStore(s => s.resign)
  const offerDraw = useGameStore(s => s.offerDraw)

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20 bg-black/60">
      <div className="wooden-panel w-[300px] flex flex-col gap-4 items-center">
        <h2 className="text-3xl mb-4 font-cinzel text-[#F5DEB3]">Paused</h2>
        <WoodenButton className="w-full" onClick={() => setScreen('game')}>Resume</WoodenButton>
        <WoodenButton className="w-full" onClick={offerDraw}>Offer Draw</WoodenButton>
        <WoodenButton className="w-full" onClick={resign}>Resign</WoodenButton>
      </div>
    </div>
  )
}
