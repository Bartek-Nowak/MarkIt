const SETTINGS_FILE = 'default.json'
const STORAGE_KEY = 'app-settings'

const getSettingsPath = (): string => `/settings/${SETTINGS_FILE}`

export const loadSettings = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }

    const response = await fetch(getSettingsPath())
    if (!response.ok) throw new Error('Failed to load the JSON file')
    const data = await response.json()

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  } catch (err) {
    console.error('Error loading settings:', err)
    return {}
  }
}

export const saveSettings = (settings: Record<string, any>) => {
  console.log(settings)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (err) {
    console.error('Error saving settings:', err)
  }
}
