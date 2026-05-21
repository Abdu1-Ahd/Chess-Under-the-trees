import { useEffect, useRef } from 'react'
import { useSettingsStore } from '../store/useSettingsStore'

export function useSound() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled)
  const soundVolume = useSettingsStore(s => s.soundVolume)

  const moveAudio = useRef(null)
  const captureAudio = useRef(null)
  const checkAudio = useRef(null)

  useEffect(() => {
    moveAudio.current = new Audio('/sounds/move.mp3')
    captureAudio.current = new Audio('/sounds/capture.mp3')
    checkAudio.current = new Audio('/sounds/check.mp3')
  }, [])

  const playSound = (type) => {
    if (!soundEnabled) return

    let audio
    switch (type) {
      case 'move': audio = moveAudio.current; break
      case 'capture': audio = captureAudio.current; break
      case 'check': audio = checkAudio.current; break
      default: return
    }

    if (audio) {
      audio.volume = soundVolume
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
  }

  return { playSound }
}
