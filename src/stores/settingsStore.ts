import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { loadSettings, saveSettings } from '../utils/settings-fs'

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<Record<string, any>>({})

  const load = async () => {
    const loaded = await loadSettings()
    Object.assign(settings, loaded)
  }

  const save = () => saveSettings(settings)

  const setSetting = (key: string, value: any) => {
    settings[key] = value
    save()
  }

  watch(settings, () => {
    save()
    if (settings.appearance.theme) applyTheme(settings.appearance.theme)
  })

  const applyTheme = (theme: string) => {
    document.documentElement.className = ''
    document.documentElement.classList.add(theme)
  }

  return {
    settings,
    load,
    save,
    setSetting,
  }
})
