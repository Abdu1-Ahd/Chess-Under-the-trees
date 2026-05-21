import { useGameStore } from './store/useGameStore'
import MainMenu from './ui/MainMenu'
import HUD from './ui/HUD'
import PauseMenu from './ui/PauseMenu'
import EndScreen from './ui/EndScreen'
import ReviewMode from './ui/ReviewMode'
import PromotionPicker from './ui/PromotionPicker'
import ChessScene from './scene/ChessScene'
import { useAI } from './hooks/useAI'
import { useTimer } from './hooks/useTimer'

export default function App() {
  const screen = useGameStore((state) => state.screen)
  
  // Initialize AI hook
  useAI()
  
  // Initialize Timer hook
  useTimer()

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <ChessScene />
      </div>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
        {screen === 'menu' && <MainMenu />}
        {screen === 'game' && <HUD />}
        {screen === 'paused' && <PauseMenu />}
        {screen === 'ended' && <EndScreen />}
        {screen === 'review' && <ReviewMode />}
        <PromotionPicker />
      </div>
    </>
  )
}
