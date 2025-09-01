import defaultSettings from '@/settings/default.json'

const STORAGE_KEY = 'app-settings'

export const loadSettings = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const storedSettings = JSON.parse(stored)
      const merged = { ...defaultSettings, ...storedSettings }
      return merged
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings))
    return defaultSettings
  } catch (err) {
    console.error('Error loading settings:', err)
    return {}
  }
}

export const saveSettings = (settings: Record<string, any>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (err) {
    console.error('Error saving settings:', err)
  }
}
