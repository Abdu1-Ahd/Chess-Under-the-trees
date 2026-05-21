import { useEffect } from 'react'
import useGameStore from '../store/useGameStore'

export function useTimer() {
  const screen = useGameStore(s => s.screen)
  const timerMode = useGameStore(s => s.timerMode)
  const turn = useGameStore(s => s.turn)
  const gameResult = useGameStore(s => s.gameResult)

  useEffect(() => {
    if (screen !== 'game' || timerMode === 'none' || gameResult) return

    const interval = setInterval(() => {
      useGameStore.setState(state => {
        if (state.screen !== 'game' || state.gameResult) return state

        if (state.turn === 'w') {
          const newTime = state.whiteTime - 1
          if (newTime <= 0) {
            return { whiteTime: 0, gameResult: 'Black wins on time', screen: 'ended' }
          }
          return { whiteTime: newTime }
        } else {
          const newTime = state.blackTime - 1
          if (newTime <= 0) {
            return { blackTime: 0, gameResult: 'White wins on time', screen: 'ended' }
          }
          return { blackTime: newTime }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [screen, timerMode, turn, gameResult])

  return null
}
