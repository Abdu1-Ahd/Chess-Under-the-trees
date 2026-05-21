import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'

export default function ReviewMode() {
  const resetGame = useGameStore(s => s.resetGame)
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end items-center p-6">
      <div className="pointer-events-auto flex gap-4">
        <WoodenButton onClick={resetGame}>Main Menu</WoodenButton>
      </div>
    </div>
  )
}
