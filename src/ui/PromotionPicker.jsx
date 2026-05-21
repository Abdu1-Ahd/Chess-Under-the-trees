import React from 'react'
import useGameStore from '../store/useGameStore'
import { useChess } from '../hooks/useChess'

export default function PromotionPicker() {
  const promotionPending = useGameStore(s => s.promotionPending)
  const { makeMove } = useChess()

  if (!promotionPending) return null

  const handleSelect = (piece) => {
    makeMove(promotionPending.from, promotionPending.to, piece)
    useGameStore.setState({ promotionPending: null })
  }

  const pieces = ['q', 'r', 'n', 'b']
  const names = { q: 'Queen', r: 'Rook', n: 'Knight', b: 'Bishop' }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-30 bg-black/60">
      <div className="wooden-panel w-[300px] flex flex-col gap-4 items-center">
        <h2 className="text-2xl mb-4 font-cinzel text-[#F5DEB3]">Promote Pawn</h2>
        {pieces.map(p => (
          <div
            key={p}
            className="w-full py-3 text-center cursor-pointer hover:bg-white/10 font-cinzel text-xl border border-[#C8864A] mb-2 text-[#C4A882]"
            onClick={() => handleSelect(p)}
          >
            {names[p]}
          </div>
        ))}
      </div>
    </div>
  )
}
