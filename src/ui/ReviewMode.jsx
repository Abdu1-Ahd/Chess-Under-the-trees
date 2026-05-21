import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'

export default function ReviewMode() {
  const resetGame = useGameStore(s => s.resetGame)
  const reviewIndex = useGameStore(s => s.reviewIndex)
  const moveHistory = useGameStore(s => s.moveHistory)
  
  const handlePrev = () => {
    if (reviewIndex > 0) useGameStore.setState({ reviewIndex: reviewIndex - 1 })
  }
  
  const handleNext = () => {
    if (reviewIndex < moveHistory.length) useGameStore.setState({ reviewIndex: reviewIndex + 1 })
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end items-center p-6 pb-12">
      <div className="pointer-events-auto flex gap-4">
        <WoodenButton onClick={handlePrev} className={reviewIndex === 0 ? 'opacity-50' : ''}>Prev</WoodenButton>
        <WoodenButton onClick={handleNext} className={reviewIndex === moveHistory.length ? 'opacity-50' : ''}>Next</WoodenButton>
        <WoodenButton onClick={resetGame}>Main Menu</WoodenButton>
      </div>
    </div>
  )
}
