<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTabsStore } from '@/stores/tabs'
import Tab from './Tab.vue'

const tabsStore = useTabsStore()

const markdown = ref(tabsStore.activeTab.markdown)

watch(
  () => tabsStore.activeTab,
  (tab) => {
    markdown.value = tab.markdown
  },
  { immediate: true }
)

watch(markdown, (val) => {
  if (tabsStore.activeTab) tabsStore.activeTab.markdown = val
})
</script>

<template>
  <div class="flex gap-1 bg-gray-800 pt-1 overflow-x-auto">
    <Tab v-for="tab in tabsStore.tabs" :key="tab.id" :id="tab.id" v-model:title="tab.title" :active="tab.active"
      :canRemove="tabsStore.tabs.length > 1" @click="tabsStore.setActive(tab.id)" @remove="tabsStore.removeTab" />
    <button @click="tabsStore.addTab()" class="flex items-center justify-center px-3 py-1 rounded-t-lg border border-b-0
             text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors">
      +
    </button>
  </div>
</template>
