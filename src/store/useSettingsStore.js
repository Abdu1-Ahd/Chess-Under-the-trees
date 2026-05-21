import { create } from 'zustand'

export const useSettingsStore = create((set) => ({
  soundEnabled: true,
  soundVolume: 0.5,
  defaultCameraLocked: false,
  autoQueen: false,
  showCoordinates: true,
  playerColor: 'w',

  updateSetting: (key, value) => set((state) => ({ [key]: value }))
}))
