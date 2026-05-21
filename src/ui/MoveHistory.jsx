import React, { useRef, useEffect } from 'react'
import useGameStore from '../store/useGameStore'

export default function MoveHistory() {
  const moveHistory = useGameStore(s => s.moveHistory)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [moveHistory])

  if (moveHistory.length === 0) return null

  const pairs = []
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairs.push({
      w: moveHistory[i],
      b: moveHistory[i + 1]
    })
  }

  return (
    <div className="wooden-panel w-56 max-h-[300px] flex flex-col font-body text-lg p-4 pointer-events-auto">
      <h3 className="font-cinzel text-center border-b border-[#C8864A] pb-2 mb-3 text-[#F5DEB3]">History</h3>
      <div 
        ref={listRef} 
        className="overflow-y-auto overflow-x-hidden pr-2 flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // hide scrollbar Firefox/IE
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {pairs.map((pair, idx) => (
          <div key={idx} className="flex justify-between py-1 border-b border-black/20 text-[#C4A882]">
            <span className="w-8 text-black/40">{idx + 1}.</span>
            <span className="flex-1 text-left">{pair.w}</span>
            <span className="flex-1 text-left">{pair.b || ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
