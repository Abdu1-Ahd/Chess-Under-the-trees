import { useEffect } from 'react'
import { useGameStore } from './store/useGameStore'
import MainMenu from './ui/MainMenu'
import HUD from './ui/HUD'
import PauseMenu from './ui/PauseMenu'
import EndScreen from './ui/EndScreen'
import ReviewMode from './ui/ReviewMode'
import PromotionPicker from './ui/PromotionPicker'
import ChessScene from './scene/ChessScene'
import { useStockfish } from './hooks/useStockfish'

export default function App() {
  const screen = useGameStore((state) => state.screen)
  const timerMode = useGameStore((state) => state.timerMode)
  const gameResult = useGameStore((state) => state.gameResult)
  const tickTimer = useGameStore((state) => state.tickTimer)

  useStockfish()

  useEffect(() => {
    if (screen !== 'game' || timerMode === 'none' || gameResult) return
    const interval = setInterval(() => { tickTimer() }, 1000)
    return () => clearInterval(interval)
  }, [screen, timerMode, gameResult, tickTimer])

  return (
    <>
      {/* Layer 0 — 3D canvas, fills viewport */}
      <ChessScene />

      {/* Layer 5 — vignette (between scene and UI panels) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Layer 10 — UI overlay, pointer-events disabled on container */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {screen === 'menu'   && <MainMenu />}
        {screen === 'game'   && <HUD />}
        {screen === 'paused' && <PauseMenu />}
        {screen === 'ended'  && <EndScreen />}
        {screen === 'review' && <ReviewMode />}
        <PromotionPicker />
      </div>
    </>
  )
}
