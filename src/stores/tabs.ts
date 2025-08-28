import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export interface TabItem {
  id: number
  title: string
  active: boolean
  markdown: string
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = reactive<TabItem[]>([{ id: 1, title: 'Index', active: true, markdown: '' }])

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

  return { tabs, activeTab, setActive, addTab, removeTab }
})
