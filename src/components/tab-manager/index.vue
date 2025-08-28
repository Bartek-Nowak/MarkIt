<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import Tab from './Tab.vue'

interface TabItem {
  id: number
  title: string
  active: boolean
  markdown: string
}

const markdown = defineModel<string>('markdown')

const tabs = reactive<TabItem[]>([
  { id: 1, title: 'Index', active: true, markdown: '' },
])

const activeTab = computed<TabItem>(() => tabs.find(t => t.active) || tabs[0])

const setActive = (id: number) => {
  tabs.forEach(t => t.active = t.id === id)
  markdown.value = activeTab.value.markdown
}

const addTab = () => {
  const newId = tabs.length ? Math.max(...tabs.map(t => t.id)) + 1 : 1
  tabs.push({ id: newId, title: 'New Tab', active: false, markdown: '' })
  setActive(newId)
}

const removeTab = (id: number) => {
  if (tabs.length <= 1) return
  const index = tabs.findIndex(t => t.id === id)
  if (index === -1) return
  const wasActive = tabs[index].active
  tabs.splice(index, 1)
  if (wasActive && tabs.length > 0) {
    const newActiveIndex = index > 0 ? index - 1 : 0
    tabs.forEach((t, i) => t.active = i === newActiveIndex)
    markdown.value = tabs[newActiveIndex].markdown
  }
}

watch(
  () => activeTab.value,
  (tab) => {
    markdown.value = tab.markdown
  },
  { immediate: true }
)

watch(markdown, (val) => {
  activeTab.value.markdown = val as string
})
</script>

<template>
  <div class="flex gap-1 bg-gray-800 px-1 pt-1 overflow-x-auto">
    <Tab v-for="tab in tabs" :key="tab.id" :id="tab.id" v-model:title="tab.title" :active="tab.active"
      :canRemove="tabs.length > 1" @click="setActive(tab.id)" @remove="removeTab" />
    <button @click="addTab" class="flex items-center justify-center px-3 py-1 rounded-t-lg border border-b-0
             text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors">
      +
    </button>
  </div>
</template>
