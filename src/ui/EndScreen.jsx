import React from 'react'
import useGameStore from '../store/useGameStore'
import WoodenButton from './WoodenButton'

export default function EndScreen() {
  const resetGame = useGameStore(s => s.resetGame)
  const gameResult = useGameStore(s => s.gameResult)

  const enterReview = () => {
    useGameStore.setState({ 
      screen: 'review', 
      reviewIndex: useGameStore.getState().moveHistory.length 
    })
  }

  return (
    <div className="overlay-backdrop absolute inset-0 flex items-center justify-center pointer-events-auto z-20 bg-black/60">
      <div className="panel-pop wooden-panel w-[400px] flex flex-col gap-6 items-center text-center">
        <h2 className="text-4xl font-cinzel text-[#F5DEB3]">Game Over</h2>
        <p className="text-2xl font-body capitalize text-[#C4A882]">{gameResult}</p>
        
        <div className="flex gap-4 mt-4">
          <WoodenButton onClick={enterReview}>Review</WoodenButton>
          <WoodenButton onClick={resetGame}>Main Menu</WoodenButton>
        </div>
      </div>
    </div>
  )
}
