import { EXAMPLE_MD } from '@/constants'
import { saveFile } from '@/utils/saveFile'
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export interface TabItem {
  id: number
  title: string
  active: boolean
  markdown: string
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = reactive<TabItem[]>([
    { id: 1, title: 'Example', active: true, markdown: EXAMPLE_MD },
  ])

  const activeTab = computed(() => tabs.find((t) => t.active)!)

  const setActive = (id: number) => {
    tabs.forEach((t) => (t.active = t.id === id))
  }

  const addTab = (title = 'New Tab') => {
    const newId = tabs.length ? Math.max(...tabs.map((t) => t.id)) + 1 : 1
    tabs.push({ id: newId, title, active: false, markdown: '' })
    setActive(newId)
  }

  const removeTab = (id: number) => {
    if (tabs.length <= 1) return
    const index = tabs.findIndex((t) => t.id === id)
    if (index === -1) return
    const wasActive = tabs[index].active
    tabs.splice(index, 1)
    if (wasActive && tabs.length > 0) {
      const newActiveIndex = index > 0 ? index - 1 : 0
      tabs.forEach((t, i) => (t.active = i === newActiveIndex))
    }
  }

  const exportTabs = async () => {
    const data = JSON.stringify(tabs, null, 2)
    await saveFile('tabs-export', data, 'json')
  }

  const importTabs = (json: string) => {
    try {
      const imported: TabItem[] = JSON.parse(json)
      if (!Array.isArray(imported)) throw new Error('Invalid JSON structure')
      imported.forEach((tab, i) => {
        if (!tab.id) tab.id = i + 1
        if (typeof tab.active !== 'boolean') tab.active = false
        if (!tab.title) tab.title = `Tab ${i + 1}`
        if (!tab.markdown) tab.markdown = ''
      })
      tabs.splice(0, tabs.length, ...imported)
      if (!tabs.some((t) => t.active)) tabs[0].active = true
    } catch (e) {
      console.error('Failed to import tabs JSON:', e)
    }
  }

  return { tabs, activeTab, setActive, addTab, removeTab, exportTabs, importTabs }
})
